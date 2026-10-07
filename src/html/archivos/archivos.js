// ===========================================
// Archivos — FileSystem Tree Engine
// Reestructuración Jerarquía Dinámica
// ===========================================
(function() {
  'use strict';

  // ===========================================
  // Constants
  // ===========================================

  var ICON_MAP = {
    'folder': '\uD83D\uDCC1',
    'pdf': '\uD83D\uDCC4',
    'doc': '\uD83D\uDCDD',
    'xls': '\uD83D\uDCCA',
    'img': '\uD83D\uDDBC\uFE0F',
    'zip': '\uD83D\uDCE6'
  };

  var MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  // ===========================================
  // Global State
  // ===========================================

  var state = {
    currentPath: null,          // { region, municipio, tipo, nivel, escuelaId, fecha, psicologo }
    currentView: 'tree',        // 'tree' or 'files'
    currentViewMode: 'view-md', // default view mode
    uploadPath: null,           // path being navigated in upload modal
    uploadSelectedFiles: []     // files selected for upload (MG4: internal state)
  };

  // ===========================================
  // ensurePath — FH3
  // Creates empty nested objects at each level if missing
  // ===========================================

  function ensurePath(fs, region, municipio, tipo, nivel, escuelaId, fecha, psicologo) {
    if (!fs[region]) fs[region] = {};
    if (!fs[region][municipio]) fs[region][municipio] = {};
    if (!fs[region][municipio][tipo]) fs[region][municipio][tipo] = {};
    if (!fs[region][municipio][tipo][nivel]) fs[region][municipio][tipo][nivel] = {};
    if (!fs[region][municipio][tipo][nivel][escuelaId]) fs[region][municipio][tipo][nivel][escuelaId] = {};
    if (!fs[region][municipio][tipo][nivel][escuelaId][fecha]) fs[region][municipio][tipo][nivel][escuelaId][fecha] = {};
    if (!fs[region][municipio][tipo][nivel][escuelaId][fecha][psicologo]) fs[region][municipio][tipo][nivel][escuelaId][fecha][psicologo] = [];
    return fs;
  }

  // ===========================================
  // hasLegacyData — CE2
  // Check if the legacy `archivos` object exists and has non-folder items
  // ===========================================

  function hasLegacyData() {
    if (typeof archivos === 'undefined' || !archivos) return false;
    for (var key in archivos) {
      if (!archivos.hasOwnProperty(key)) continue;
      var items = archivos[key];
      if (!Array.isArray(items)) continue;
      for (var i = 0; i < items.length; i++) {
        if (items[i].tipo !== 'folder') return true;
      }
    }
    return false;
  }

  // ===========================================
  // Internal: getFilesAtPathFromFS
  // Safe traversal of fs[region][municipio][tipo][nivel][escuelaId][fecha][psicologo]
  // ===========================================

  function getFilesAtPathFromFS(fs, region, municipio, tipo, nivel, escuelaId, fecha, psicologo) {
    try {
      var files = fs[region][municipio][tipo][nivel][escuelaId][fecha][psicologo];
      return Array.isArray(files) ? files : [];
    } catch (e) {
      return [];
    }
  }

  // ===========================================
  // buildFileSystemTree — CE3
  // Build TreeNode[] from DB.escuelas + DB.visitas + persisted sep:fs
  // ===========================================

  function buildFileSystemTree() {
    var persistedFS = {};

    if (typeof window.utils !== 'undefined' && window.utils.getFS) {
      persistedFS = window.utils.getFS();
    }

    var escuelas = [];
    var visitas = [];

    if (typeof window.DB !== 'undefined') {
      escuelas = window.DB.escuelas || [];
      visitas = window.DB.visitas || [];
    }

    var tree = [];

    // 1. Extract unique regions, sorted alphabetically
    var regionSet = {};
    for (var ei = 0; ei < escuelas.length; ei++) {
      var esc = escuelas[ei];
      if (esc.region) regionSet[esc.region] = true;
    }
    var regions = Object.keys(regionSet).sort();

    // Constants for the new hierarchy
    var TIPO_DISPLAY = { 'Privada': 'Privadas', 'P\u00FAblica': 'P\u00FAblicas' };
    var NIVEL_ORDER = ['Maternal', 'Preescolar', 'Primaria', 'Secundaria', 'Media Superior', 'Superior'];

    // 2. Build hierarchy — 7 levels: Region → Municipio → Tipo → Nivel → Escuela → Fecha → Psicólogo
    for (var ri = 0; ri < regions.length; ri++) {
      var region = regions[ri];
      var escuelasInRegion = [];
      for (var ei2 = 0; ei2 < escuelas.length; ei2++) {
        if (escuelas[ei2].region === region) escuelasInRegion.push(escuelas[ei2]);
      }

      // Unique municipios in region, sorted
      var mpioSet = {};
      for (var ei3 = 0; ei3 < escuelasInRegion.length; ei3++) {
        if (escuelasInRegion[ei3].municipio) {
          mpioSet[escuelasInRegion[ei3].municipio] = true;
        }
      }
      var municipios = Object.keys(mpioSet).sort();

      var municipioNodes = [];

      for (var mi = 0; mi < municipios.length; mi++) {
        var municipio = municipios[mi];
        var escuelasInMpio = [];
        for (var ei4 = 0; ei4 < escuelasInRegion.length; ei4++) {
          if (escuelasInRegion[ei4].municipio === municipio) {
            escuelasInMpio.push(escuelasInRegion[ei4]);
          }
        }

        // Sort escuelas by nombre
        escuelasInMpio.sort(function(a, b) {
          return (a.nombre || '').localeCompare(b.nombre || '');
        });

        // Group escuelas by tipo (Privada/Pública)
        var tipoSet = {};
        for (var ti = 0; ti < escuelasInMpio.length; ti++) {
          if (escuelasInMpio[ti].tipo) {
            tipoSet[escuelasInMpio[ti].tipo] = true;
          }
        }
        var tipos = Object.keys(tipoSet).sort();

        var tipoNodes = [];

        for (var ti2 = 0; ti2 < tipos.length; ti2++) {
          var tipo = tipos[ti2];
          var tipoLabel = TIPO_DISPLAY[tipo] || tipo;
          var escuelasInTipo = [];
          for (var ei5 = 0; ei5 < escuelasInMpio.length; ei5++) {
            if (escuelasInMpio[ei5].tipo === tipo) {
              escuelasInTipo.push(escuelasInMpio[ei5]);
            }
          }

          // Group by nivel within this tipo, sorted by NIVEL_ORDER
          var nivelSet = {};
          for (var ni = 0; ni < escuelasInTipo.length; ni++) {
            if (escuelasInTipo[ni].nivel) {
              nivelSet[escuelasInTipo[ni].nivel] = true;
            }
          }
          var niveles = Object.keys(nivelSet).sort(function(a, b) {
            return NIVEL_ORDER.indexOf(a) - NIVEL_ORDER.indexOf(b);
          });

          var nivelNodes = [];

          for (var ni2 = 0; ni2 < niveles.length; ni2++) {
            var nivel = niveles[ni2];
            var escuelasInNivel = [];
            for (var ei6 = 0; ei6 < escuelasInTipo.length; ei6++) {
              if (escuelasInTipo[ei6].nivel === nivel) {
                escuelasInNivel.push(escuelasInTipo[ei6]);
              }
            }

            var escuelaNodes = [];

            for (var sci = 0; sci < escuelasInNivel.length; sci++) {
              var escuela = escuelasInNivel[sci];

              // Collect visits for this school
              var visitasForEscuela = [];
              for (var vi = 0; vi < visitas.length; vi++) {
                if (visitas[vi].escuelaId === escuela.id) {
                  visitasForEscuela.push(visitas[vi]);
                }
              }

              // Group visitas by fecha
              var fechaGroup = {};
              for (var vi2 = 0; vi2 < visitasForEscuela.length; vi2++) {
                var v = visitasForEscuela[vi2];
                if (!v.fecha) continue;
                if (!fechaGroup[v.fecha]) fechaGroup[v.fecha] = [];
                fechaGroup[v.fecha].push(v);
              }
              var fechas = Object.keys(fechaGroup).sort().reverse();

              var fechaNodes = [];
              var escuelaCount = 0;

              for (var fdi2 = 0; fdi2 < fechas.length; fdi2++) {
                var fechaStr = fechas[fdi2];
                var visitasInFecha = fechaGroup[fechaStr];

                // Group by psicologo within this fecha
                var psicoSet = {};
                for (var pi = 0; pi < visitasInFecha.length; pi++) {
                  var psicoName = visitasInFecha[pi].psicologo;
                  if (psicoName) {
                    psicoSet[psicoName] = true;
                  } else {
                    psicoSet['Sin asignar'] = true;
                  }
                }
                var psicologos = Object.keys(psicoSet).sort();

                var psicoNodes = [];
                var fechaCount = 0;

                for (var pi2 = 0; pi2 < psicologos.length; pi2++) {
                  var psicologo = psicologos[pi2];
                  var filesAtPsico = getFilesAtPathFromFS(persistedFS, region, municipio, tipoLabel, nivel, escuela.id, fechaStr, psicologo);
                  fechaCount += filesAtPsico.length;

                  psicoNodes.push({
                    type: 'psicologo',
                    id: region + '/' + municipio + '/' + tipo + '/' + nivel + '/' + escuela.id + '/' + fechaStr + '/' + encodeURIComponent(psicologo),
                    label: psicologo,
                    count: filesAtPsico.length,
                    data: {
                      region: region,
                      municipio: municipio,
                      tipo: tipoLabel,
                      nivel: nivel,
                      escuelaId: escuela.id,
                      fecha: fechaStr,
                      psicologo: psicologo
                    },
                    children: []
                  });
                }

                escuelaCount += fechaCount;

                fechaNodes.push({
                  type: 'fecha',
                  id: region + '/' + municipio + '/' + tipo + '/' + nivel + '/' + escuela.id + '/' + fechaStr,
                  label: fechaStr,
                  count: fechaCount,
                  data: {
                    region: region,
                    municipio: municipio,
                    tipo: tipoLabel,
                    nivel: nivel,
                    escuelaId: escuela.id,
                    fecha: fechaStr
                  },
                  children: psicoNodes
                });
              }

              escuelaNodes.push({
                type: 'escuela',
                id: region + '/' + municipio + '/' + tipo + '/' + nivel + '/' + escuela.id,
                label: escuela.nombre || ('Escuela #' + escuela.id),
                count: escuelaCount,
                data: {
                  region: region,
                  municipio: municipio,
                  tipo: tipoLabel,
                  nivel: nivel,
                  escuelaId: escuela.id
                },
                children: fechaNodes
              });
            }

            var nivelCount = 0;
            for (var eni = 0; eni < escuelaNodes.length; eni++) {
              nivelCount += escuelaNodes[eni].count;
            }

            nivelNodes.push({
              type: 'nivel',
              id: region + '/' + municipio + '/' + tipo + '/' + nivel,
              label: nivel,
              count: nivelCount,
              data: {
                region: region,
                municipio: municipio,
                tipo: tipoLabel,
                nivel: nivel
              },
              children: escuelaNodes
            });
          }

          var tipoCount = 0;
          for (var nni = 0; nni < nivelNodes.length; nni++) {
            tipoCount += nivelNodes[nni].count;
          }
          tipoNodes.push({
            type: 'tipo',
            id: region + '/' + municipio + '/' + tipo,
            label: tipoLabel,
            count: tipoCount,
            data: {
              region: region,
              municipio: municipio,
              tipo: tipoLabel
            },
            children: nivelNodes
          });
        }

        var municipioCount = 0;
        for (var tni = 0; tni < tipoNodes.length; tni++) {
          municipioCount += tipoNodes[tni].count;
        }

        municipioNodes.push({
          type: 'municipio',
          id: region + '/' + municipio,
          label: municipio,
          count: municipioCount,
          children: tipoNodes
        });
      }

      var regionCount = 0;
      for (var mni = 0; mni < municipioNodes.length; mni++) {
        regionCount += municipioNodes[mni].count;
      }

      tree.push({
        type: 'region',
        id: region,
        label: region,
        count: regionCount,
        children: municipioNodes
      });
    }

    // 3. Handle "Legado" special case
    if (persistedFS && persistedFS['Legado']) {
      var legacyCount = 0;
      var legadoChildren = [];

      try {
        if (persistedFS['Legado']['Legado'] && persistedFS['Legado']['Legado']['0']) {
          var legacyFiles = persistedFS['Legado']['Legado']['0']['legacy'] || [];
          legacyCount = legacyFiles.length;
        }
      } catch (e) {
        // If legado structure is malformed, skip
      }

      // Build a legado fecha node to make it navigable
      if (legacyCount > 0 || Object.keys(persistedFS['Legado']).length > 0) {
        var legadoFechaNode = {
          type: 'fecha',
          id: 'Legado/Legado/0/legacy',
          label: 'Archivos migrados',
          count: legacyCount,
          data: {
            region: 'Legado',
            municipio: 'Legado',
            escuelaId: '0',
            fecha: 'legacy'
          },
          children: []
        };

        var legadoEscuelaNode = {
          type: 'escuela',
          id: 'Legado/Legado/0',
          label: 'Datos legacy',
          count: legacyCount,
          children: [legadoFechaNode]
        };

        var legadoMpioNode = {
          type: 'municipio',
          id: 'Legado/Legado',
          label: 'Legado',
          count: legacyCount,
          children: [legadoEscuelaNode]
        };

        tree.push({
          type: 'region',
          id: 'Legado',
          label: 'Legado',
          count: legacyCount,
          children: [legadoMpioNode]
        });
      }
    }

    return tree;
  }

  // ===========================================
  // getFilesAtPath — CE4
  // Given { region, municipio, escuelaId, fecha }, return FileEntry[]
  // ===========================================

  function getFilesAtPath(path) {
    if (!path || !path.region) return [];

    var fs = {};
    if (typeof window.utils !== 'undefined' && window.utils.getFS) {
      fs = window.utils.getFS();
    }

    // Special handling for Legado path
    if (path.region === 'Legado' && path.fecha === 'legacy') {
      try {
        var legacyFiles = fs['Legado']['Legado']['0']['legacy'];
        return Array.isArray(legacyFiles) ? legacyFiles : [];
      } catch (e) {
        return [];
      }
    }

    // Normal path: require all 7 levels
    if (!path.municipio || !path.tipo || !path.nivel ||
      path.escuelaId === undefined || path.escuelaId === null || !path.fecha || !path.psicologo) {
      return [];
    }

    return getFilesAtPathFromFS(fs, path.region, path.municipio, path.tipo, path.nivel, path.escuelaId, path.fecha, path.psicologo);
  }

  // ===========================================
  // Escape HTML utility
  // ===========================================

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ===========================================
  // renderFileGrid — renders FileEntry[] with current view mode
  // Supports all 9 view modes (VM1, VM3)
  // ===========================================

  function renderFileGrid(files) {
    var grid = document.getElementById('grid');
    if (!grid) return;
    var main = document.getElementById('main-content');
    var mode = state.currentViewMode || 'view-md';

    // Reset grid and main classes
    grid.className = 'grid';
    if (main) {
      main.classList.remove('main-with-panel', 'main-with-preview');
    }

    // Remove old panel if exists
    var oldPanel = document.querySelector('.details-panel, .preview-panel');
    if (oldPanel) oldPanel.remove();

    // Remove extra columns from items
    grid.querySelectorAll('.item-type-col, .item-date-col, .item-size-col, .item-author-col, .item-school-col').forEach(function(el) { el.remove(); });

    if (!files || files.length === 0) {
      grid.innerHTML = '<div class="file-list-empty" style="grid-column:1/-1;text-align:center;padding:40px;color:#8E8E93;">No hay archivos en esta ubicaci\u00F3n</div>';
      return;
    }

    switch (mode) {
      case 'view-list':
        grid.classList.add('view-list');
        grid.innerHTML = renderItemsAsList(files);
        break;
      case 'view-details':
        grid.classList.add('view-details');
        grid.innerHTML = renderItemsAsDetails(files);
        break;
      case 'view-content':
        grid.classList.add('view-content');
        grid.innerHTML = renderItemsAsContent(files);
        break;
      case 'view-panel-detalles':
        grid.classList.add('view-list');
        if (main) {
          main.classList.add('main-with-panel');
          main.insertAdjacentHTML('beforeend',
            '<div class="details-panel" id="details-panel"><h3>Detalles</h3><div class="details-empty">Selecciona un archivo para ver sus detalles</div></div>');
        }
        grid.innerHTML = renderItemsAsList(files);
        break;
      case 'view-panel-vista':
        grid.classList.add('view-list');
        if (main) {
          main.classList.add('main-with-preview');
          main.insertAdjacentHTML('beforeend',
            '<div class="preview-panel" id="preview-panel"><h3>Vista Previa</h3><div class="preview-content"><div class="preview-empty">Selecciona un archivo para ver su vista previa</div></div></div>');
        }
        grid.innerHTML = renderItemsAsList(files);
        break;
      case 'view-mosaic':
        grid.classList.add('view-mosaic');
        grid.innerHTML = renderGridItems(files);
        break;
      case 'view-xl':
        grid.classList.add('view-xl');
        grid.innerHTML = renderGridItems(files);
        break;
      case 'view-lg':
        grid.classList.add('view-lg');
        grid.innerHTML = renderGridItems(files);
        break;
      case 'view-sm':
        grid.classList.add('view-sm');
        grid.innerHTML = renderGridItems(files);
        break;
      case 'view-md':
      default:
        grid.classList.add('view-md');
        grid.innerHTML = renderGridItems(files);
        break;
    }
  }

  // ===========================================
  // getAllFilesFromFS — walk entire tree, collect all FileEntry[]
  // (VM1 — mi-unidad / recientes aggregation)
  // ===========================================

  function getAllFilesFromFS(fs) {
    if (!fs || typeof fs !== 'object') return [];
    var all = [];
    for (var region in fs) {
      if (!fs.hasOwnProperty(region)) continue;
      for (var municipio in fs[region]) {
        if (!fs[region].hasOwnProperty(municipio)) continue;
        for (var tipo in fs[region][municipio]) {
          if (!fs[region][municipio].hasOwnProperty(tipo)) continue;
          for (var nivel in fs[region][municipio][tipo]) {
            if (!fs[region][municipio][tipo].hasOwnProperty(nivel)) continue;
            for (var escuelaId in fs[region][municipio][tipo][nivel]) {
              if (!fs[region][municipio][tipo][nivel].hasOwnProperty(escuelaId)) continue;
              for (var fecha in fs[region][municipio][tipo][nivel][escuelaId]) {
                if (!fs[region][municipio][tipo][nivel][escuelaId].hasOwnProperty(fecha)) continue;
                for (var psicologo in fs[region][municipio][tipo][nivel][escuelaId][fecha]) {
                  if (!fs[region][municipio][tipo][nivel][escuelaId][fecha].hasOwnProperty(psicologo)) continue;
                  var files = fs[region][municipio][tipo][nivel][escuelaId][fecha][psicologo];
                  if (Array.isArray(files)) {
                    for (var fi = 0; fi < files.length; fi++) {
                      all.push(files[fi]);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return all;
  }

  // ===========================================
  // parseFechaSubida — convert "DD Mon" to numeric for sorting
  // ===========================================

  function parseFechaSubida(str) {
    if (!str) return 0;
    var parts = str.split(' ');
    if (parts.length < 2) return 0;
    var day = parseInt(parts[0], 10) || 0;
    var monthIndex = MONTHS.indexOf(parts[1]);
    return monthIndex >= 0 ? monthIndex * 100 + day : 0;
  }

  // ===========================================
  // renderGridItems — basic grid rendering (shared by grid modes)
  // ===========================================

  function renderGridItems(files) {
    return files.map(function(file) {
      var icon = ICON_MAP[file.tipo] || '\uD83D\uDCC4';
      return '<div class="item" data-file=\'' + JSON.stringify(file).replace(/'/g, '&#39;') + '\'>' +
        '<div class="item-icon">' + icon + '</div>' +
        '<div class="item-name">' + escapeHtml(file.nombre) + '</div>' +
        '<div class="item-meta">' + (file.tama\u00F1o || '') + ' - ' + (file.fechaSubida || '') + '</div>' +
        '</div>';
    }).join('');
  }

  // ===========================================
  // renderItemsAsList — list view (VM3)
  // ===========================================

  function renderItemsAsList(files) {
    return files.map(function(file) {
      var icon = ICON_MAP[file.tipo] || '\uD83D\uDCC4';
      return '<div class="item" data-file=\'' + JSON.stringify(file).replace(/'/g, '&#39;') + '\'>' +
        '<div class="item-icon">' + icon + '</div>' +
        '<div class="item-name">' + escapeHtml(file.nombre) + '</div>' +
        '<span class="item-type-col">' + (file.tipo || '').toUpperCase() + '</span>' +
        '<span class="item-date-col">' + (file.fechaSubida || '') + '</span>' +
        '<span class="item-size-col">' + (file.tama\u00F1o || '') + '</span>' +
        '</div>';
    }).join('');
  }

  // ===========================================
  // renderItemsAsDetails — details view (VM3)
  // ===========================================

  function renderItemsAsDetails(files) {
    return files.map(function(file) {
      var icon = ICON_MAP[file.tipo] || '\uD83D\uDCC4';
      var psicStr = file.psicologos && file.psicologos.length > 0 ? file.psicologos.join(', ') : '';
      var escuelaName = (file.region || '') + (file.municipio ? ' / ' + file.municipio : '');
      return '<div class="item" data-file=\'' + JSON.stringify(file).replace(/'/g, '&#39;') + '\'>' +
        '<div class="item-icon">' + icon + '</div>' +
        '<div class="item-name">' + escapeHtml(file.nombre) + '</div>' +
        '<span class="item-type-col">' + (file.tipo || '').toUpperCase() + '</span>' +
        '<span class="item-date-col">' + (file.fechaSubida || '') + '</span>' +
        '<span class="item-size-col">' + (file.tama\u00F1o || '') + '</span>' +
        '<span class="item-author-col">' + escapeHtml(psicStr) + '</span>' +
        '<span class="item-school-col">' + escapeHtml(escuelaName) + '</span>' +
        '</div>';
    }).join('');
  }

  // ===========================================
  // renderItemsAsContent — content view with folder groups (VM3)
  // ===========================================

  function renderItemsAsContent(files) {
    // Group by docType
    var groups = {};
    for (var fi = 0; fi < files.length; fi++) {
      var docType = files[fi].docType || 'otros';
      if (!groups[docType]) groups[docType] = [];
      groups[docType].push(files[fi]);
    }
    var html = '';
    for (var groupName in groups) {
      if (!groups.hasOwnProperty(groupName)) continue;
      html += '<div class="folder-group">' +
        '<div class="folder-group-title">' + escapeHtml(groupName) + '</div>' +
        '<div class="folder-items">';
      var groupFiles = groups[groupName];
      for (var gi = 0; gi < groupFiles.length; gi++) {
        var file = groupFiles[gi];
        var icon = ICON_MAP[file.tipo] || '\uD83D\uDCC4';
        html += '<div class="item" data-file=\'' + JSON.stringify(file).replace(/'/g, '&#39;') + '\'>' +
          '<div class="item-icon">' + icon + '</div>' +
          '<div class="item-name">' + escapeHtml(file.nombre) + '</div>' +
          '</div>';
      }
      html += '</div></div>';
    }
    return html;
  }

  // ===========================================
  // renderSidebar + renderTreeNode — ST2
  // ===========================================

  var _sidebarTree = [];

  function renderSidebar(tree) {
    _sidebarTree = tree;
    var container = document.getElementById('sidebar-tree');
    if (!container) return;
    container.innerHTML = tree.map(function(node) {
      return renderTreeNode(node, 0);
    }).join('');
  }

  function renderTreeNode(node, depth) {
    var icon = node.type === 'fecha' ? '\uD83D\uDCC5' : '\uD83D\uDCC1';
    var hasChildren = node.children && node.children.length > 0;
    var countBadge = node.count > 0 ? '<span class="folder-count">' + node.count + '</span>' : '';

    var html = '<div class="folder" data-type="' + node.type + '" data-id="' + node.id + '">';
    html += '<span>' + icon + '</span><span>' + escapeHtml(node.label) + '</span>' + countBadge;
    html += '</div>';

    if (hasChildren) {
      var display = depth === 0 ? 'block' : 'none';
      html += '<div class="folder-children" style="display:' + display + '">';
      for (var i = 0; i < node.children.length; i++) {
        html += renderTreeNode(node.children[i], depth + 1);
      }
      html += '</div>';
    }

    return html;
  }

  // ===========================================
  // Sidebar click handling — ST3
  // ===========================================

  function setupSidebarClicks() {
    var sidebar = document.getElementById('sidebar-tree');
    if (!sidebar) return;

    sidebar.addEventListener('click', function(e) {
      var folderEl = e.target.closest('.folder');
      if (!folderEl) return;

      var type = folderEl.dataset.type;
      var id = folderEl.dataset.id;

      // Find node in tree
      var node = findNodeById(_sidebarTree, id);
      if (!node) return;

      // Toggle active class
      sidebar.querySelectorAll('.folder--active').forEach(function(el) {
        el.classList.remove('folder--active');
      });
      folderEl.classList.add('folder--active');

      // Toggle children visibility
      var childrenContainer = folderEl.nextElementSibling;
      var hasChildren = childrenContainer && childrenContainer.classList.contains('folder-children');

      if (hasChildren) {
        var isVisible = childrenContainer.style.display === 'block';
        childrenContainer.style.display = isVisible ? 'none' : 'block';
      }

      // Navigate
      if (node.data) {
        navigateToPath({
          region: node.data.region,
          municipio: node.data.municipio,
          tipo: node.data.tipo,
          nivel: node.data.nivel,
          escuelaId: node.data.escuelaId,
          fecha: node.data.fecha,
          psicologo: node.data.psicologo
        });
      }
    });
  }

  function findNodeById(nodes, id) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) return nodes[i];
      if (nodes[i].children && nodes[i].children.length > 0) {
        var found = findNodeById(nodes[i].children, id);
        if (found) return found;
      }
    }
    return null;
  }

  function findNodeByLabelAndType(nodes, label, type) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].label === label && nodes[i].type === type) return nodes[i];
    }
    return null;
  }

  function findNodeByPartialPath(tree, path) {
    if (!tree || !path) return null;
    var current = null;

    if (path.region) {
      current = findNodeByLabelAndType(tree, path.region, 'region');
      if (!current) return null;
    }
    if (path.municipio && current && current.children) {
      current = findNodeByLabelAndType(current.children, path.municipio, 'municipio');
      if (!current) return null;
    }
    // Resolve tipo: match by label (label === data.tipo, both display form)
    if (path.tipo && current && current.children) {
      current = findNodeByLabelAndType(current.children, path.tipo, 'tipo');
      if (!current) return null;
    }
    // Resolve nivel
    if (path.nivel && current && current.children) {
      current = findNodeByLabelAndType(current.children, path.nivel, 'nivel');
      if (!current) return null;
    }
    if (path.escuelaId !== undefined && path.escuelaId !== null && current && current.children) {
      // Use loose equality (==) to handle Legado string '0'
      var foundEscuela = null;
      for (var i = 0; i < current.children.length; i++) {
        var child = current.children[i];
        if (child.type === 'escuela') {
          if (child.data && child.data.escuelaId == path.escuelaId) {
            foundEscuela = child;
            break;
          }
          // Legado edge case: escuela node without data, extract id from path
          if (!child.data && child.id) {
            var extractedId = child.id.split('/').pop();
            if (extractedId == path.escuelaId) {
              foundEscuela = child;
              break;
            }
          }
        }
      }
      if (!foundEscuela) return null;
      current = foundEscuela;
    }
    // Resolve fecha
    if (path.fecha && current && current.children) {
      current = findNodeByLabelAndType(current.children, path.fecha, 'fecha');
      if (!current) return null;
    }
    // Resolve psicologo (new deepest level before files)
    if (path.psicologo && current && current.children) {
      current = findNodeByLabelAndType(current.children, path.psicologo, 'psicologo');
      if (!current) return null;
    }

    return current;
  }

  // ===========================================
  // navigateToPath — ST4
  // ===========================================

  function navigateToPath(path) {
    if (!path) return;
    state.currentPath = path;

    // Save view mode before replacing breadcrumb/grid
    // (keeps old setViewMode working for Mi Unidad)

    // ——— Update breadcrumb ———
    var bc = document.getElementById('breadcrumb');
    var items = [{ id: 'mi-unidad', name: 'Mi Unidad' }];
    if (path.region) items.push({ id: 'bread-region', name: path.region });
    if (path.municipio) items.push({ id: 'bread-municipio', name: path.municipio });
    if (path.tipo) items.push({ id: 'bread-tipo', name: path.tipo });
    if (path.nivel) items.push({ id: 'bread-nivel', name: path.nivel });
    if (path.escuelaId !== undefined && path.escuelaId !== null) {
      var escuelaName = 'Escuela #' + path.escuelaId;
      items.push({ id: 'bread-escuela', name: escuelaName });
    }
    if (path.fecha) items.push({ id: 'bread-fecha', name: path.fecha });
    if (path.psicologo) items.push({ id: 'bread-psicologo', name: path.psicologo });

    bc.innerHTML = items.map(function(item, index) {
      if (index === items.length - 1) {
        return '<span>' + escapeHtml(item.name) + '</span>';
      }
      return '<span class="breadcrumb-item" data-nav="' + item.id + '">' + escapeHtml(item.name) + '</span><span class="breadcrumb-separator">/</span>';
    }).join('');

    // ——— Update title ———
    var titleEl = document.getElementById('view-title');
    if (path.psicologo) {
      titleEl.textContent = path.psicologo;
    } else if (path.fecha) {
      titleEl.textContent = path.fecha;
    } else if (path.escuelaId !== undefined && path.escuelaId !== null) {
      // Try to look up the school name from DB
      var schName = '';
      if (typeof window.DB !== 'undefined' && window.DB.escuelas) {
        for (var si = 0; si < window.DB.escuelas.length; si++) {
          if (window.DB.escuelas[si].id == path.escuelaId) {
            schName = window.DB.escuelas[si].nombre || '';
            break;
          }
        }
      }
      titleEl.textContent = schName || 'Escuela #' + path.escuelaId;
    } else if (path.nivel) {
      titleEl.textContent = path.nivel;
    } else if (path.tipo) {
      titleEl.textContent = path.tipo;
    } else if (path.municipio) {
      titleEl.textContent = path.municipio;
    } else if (path.region) {
      titleEl.textContent = path.region;
    }

    // Update nav items — remove active from all
    document.querySelectorAll('.nav-item').forEach(function(item) {
      item.classList.remove('nav-item--active');
    });

    // Bifurcación: psicólogo → archivos, Legado legacy → archivos, parcial → subcarpetas
    if (path.psicologo || (path.region === 'Legado' && path.fecha === 'legacy')) {
      var files = getFilesAtPath(path);
      renderFileGrid(files);
    } else {
      renderSubfoldersView(path);
    }
  }

  function renderSubfoldersView(path) {
    var grid = document.getElementById('grid');
    if (!grid) return;

    var tree = window._currentTree;
    if (!tree) {
      grid.innerHTML = '<div class="file-list-empty" style="grid-column:1/-1;text-align:center;padding:40px;color:#8E8E93;">No se encontr\u00F3 el \u00E1rbol</div>';
      return;
    }

    var currentNode = findNodeByPartialPath(tree, path);
    if (!currentNode) {
      grid.innerHTML = '<div class="file-list-empty" style="grid-column:1/-1;text-align:center;padding:40px;color:#8E8E93;">No se encontr\u00F3 la ubicaci\u00F3n</div>';
      return;
    }

    var children = currentNode.children || [];

    if (children.length === 0) {
      var emptyMsg = 'No hay elementos en esta ubicaci\u00F3n';
      if (currentNode.type === 'region') emptyMsg = 'No hay municipios en esta regi\u00F3n';
      else if (currentNode.type === 'municipio') emptyMsg = 'No hay escuelas en esta categor\u00EDa';
      else if (currentNode.type === 'tipo') emptyMsg = 'No hay escuelas en esta categor\u00EDa';
      else if (currentNode.type === 'nivel') emptyMsg = 'No hay escuelas en este nivel';
      else if (currentNode.type === 'escuela' || currentNode.data && currentNode.data.escuelaId !== undefined) emptyMsg = 'No hay visitas programadas para esta escuela';
      else if (currentNode.type === 'psicologo') emptyMsg = 'No hay archivos para este psic\u00F3logo';
      grid.innerHTML = '<div class="file-list-empty" style="grid-column:1/-1;text-align:center;padding:40px;color:#8E8E93;">' + emptyMsg + '</div>';
      return;
    }

    var html = '';
    children.forEach(function(child) {
      var count = child.count || 0;
      // Build data-folder with type prefix for click handler
      var folderType = child.type || 'folder';
      var folderValue = '';
      if (child.type === 'region') folderValue = child.label;
      else if (child.type === 'municipio') folderValue = child.label;
      else if (child.type === 'tipo') folderValue = (child.data && child.data.tipo) ? child.data.tipo : child.label;
      else if (child.type === 'nivel') folderValue = (child.data && child.data.nivel) ? child.data.nivel : child.label;
      else if (child.type === 'escuela') folderValue = (child.data && child.data.escuelaId !== undefined) ? String(child.data.escuelaId) : (child.id ? child.id.split('/').pop() : '');
      else if (child.type === 'fecha') folderValue = (child.data && child.data.fecha) ? child.data.fecha : child.label;
      else if (child.type === 'psicologo') folderValue = child.label;
      else folderValue = child.label || child.id || '';

      html += '<div class="item" data-folder="' + folderType + ':' + escapeHtml(folderValue) + '">' +
        '<div class="item-icon">📁</div>' +
        '<div class="item-name">' + escapeHtml(child.label || child.id || 'Sin nombre') + '</div>' +
        '<div class="item-meta">' + count + ' archivos</div>' +
        '</div>';
    });

    grid.className = 'grid ' + (state.currentViewMode || 'view-md');
    grid.innerHTML = html;

    // Click handlers to navigate one level deeper
    grid.querySelectorAll('[data-folder]').forEach(function(el) {
      el.addEventListener('click', function() {
        var folder = el.dataset.folder;
        if (!folder) return;
        var colonIdx = folder.indexOf(':');
        if (colonIdx === -1) return;
        var fType = folder.substring(0, colonIdx);
        var fValue = folder.substring(colonIdx + 1);
        var newPath = { region: path.region };
        if (path.municipio) newPath.municipio = path.municipio;
        if (path.tipo) newPath.tipo = path.tipo;
        if (path.nivel) newPath.nivel = path.nivel;
        if (path.escuelaId !== undefined && path.escuelaId !== null) newPath.escuelaId = path.escuelaId;

        if (fType === 'region') {
          newPath = { region: fValue };
        } else if (fType === 'municipio') {
          newPath.municipio = fValue;
        } else if (fType === 'tipo') {
          newPath.tipo = fValue;
        } else if (fType === 'nivel') {
          newPath.nivel = fValue;
        } else if (fType === 'escuela') {
          newPath.escuelaId = parseInt(fValue, 10);
          // If it's Legado, keep as string
          if (fValue === '0' && path.region === 'Legado') {
            newPath.escuelaId = '0';
          }
        } else if (fType === 'fecha') {
          newPath.fecha = fValue;
        } else if (fType === 'psicologo') {
          newPath.psicologo = fValue;
        }

        navigateToPath(newPath);
      });
    });
  }

  // ===========================================
  // renderMiUnidadView — root view showing region folders + uploaded files
  // ===========================================

  function renderMiUnidadView(uploadedFiles) {
    var grid = document.getElementById('grid');
    if (!grid) return;

    var tree = window._currentTree;
    var html = '';

    // Show region folders from the tree
    if (tree && tree.length > 0) {
      tree.forEach(function(regionNode) {
        var count = regionNode.count || 0;
        html += '<div class="item" data-folder="region:' + escapeHtml(regionNode.label) + '">' +
          '<div class="item-icon">📁</div>' +
          '<div class="item-name">' + escapeHtml(regionNode.label) + '</div>' +
          '<div class="item-meta">' + count + ' archivos</div>' +
          '</div>';
      });
    }

    // Show uploaded files
    if (uploadedFiles && uploadedFiles.length > 0) {
      uploadedFiles.forEach(function(file) {
        var icon = ICON_MAP[file.tipo] || '📄';
        html += '<div class="item" data-file=\'' + JSON.stringify(file).replace(/'/g, '&#39;') + '\'>' +
          '<div class="item-icon">' + icon + '</div>' +
          '<div class="item-name">' + escapeHtml(file.nombre) + '</div>' +
          '<div class="item-meta">' + (file.tamaño || '') + ' - ' + (file.fechaSubida || '') + '</div>' +
          '</div>';
      });
    }

    if (!html) {
      grid.innerHTML = '<div class="file-list-empty" style="grid-column:1/-1;text-align:center;padding:40px;color:#8E8E93;">No hay archivos en esta ubicación. Usa + Nuevo para subir archivos o navega por las regiones en el panel lateral.</div>';
      return;
    }

    grid.className = 'grid ' + (state.currentViewMode || 'view-md');
    grid.innerHTML = html;

    // Add click handlers for region folders
    grid.querySelectorAll('[data-folder]').forEach(function(el) {
      el.addEventListener('click', function() {
        var folder = el.dataset.folder;
        if (folder && folder.startsWith('region:')) {
          var regionName = folder.replace('region:', '');
          navigateToPath({ region: regionName });
        }
      });
    });

    // Add click handlers for file preview
    grid.querySelectorAll('[data-file]').forEach(function(el) {
      el.addEventListener('click', function() {
        try {
          var fileData = JSON.parse(el.dataset.file);
          showFilePreview(fileData);
        } catch (e) {}
      });
    });
  }

  // ===========================================
  // changeView — nav item handler (Mi Unidad, Recientes, Compartidos)
  // VM1 — aggregate view for mi-unidad / recientes
  // ===========================================

  function changeView(viewId, viewName) {
    state.currentPath = null;

    // Update nav active states
    document.querySelectorAll('.nav-item').forEach(function(item) {
      item.classList.toggle('nav-item--active', item.dataset.nav === viewId);
    });

    // Update title
    var titleEl = document.getElementById('view-title');
    if (titleEl) titleEl.textContent = viewName;

    // Update breadcrumb to default
    var bc = document.getElementById('breadcrumb');
    if (bc) {
      bc.innerHTML = '<span class="breadcrumb-item" data-nav="mi-unidad">Mi Unidad</span>';
    }

    var fs = (typeof window.utils !== 'undefined' && window.utils.getFS) ? window.utils.getFS() : {};
    var allFiles = getAllFilesFromFS(fs);

    if (viewId === 'mi-unidad') {
      allFiles.sort(function(a, b) {
        return parseFechaSubida(b.fechaSubida) - parseFechaSubida(a.fechaSubida);
      });
      renderMiUnidadView(allFiles);
    } else if (viewId === 'recientes') {
      allFiles.sort(function(a, b) {
        return parseFechaSubida(b.fechaSubida) - parseFechaSubida(a.fechaSubida);
      });
      if (allFiles.length === 0) {
        renderFileGrid([]);
      } else {
        renderFileGrid(allFiles.slice(0, 20));
      }
    } else if (viewId === 'compartidos') {
      renderFileGrid([]);
    }
  }

  // ===========================================
  // setViewMode — VM1, VM3
  // Switch between 9 view modes
  // ===========================================

  function setViewMode(mode) {
    state.currentViewMode = mode;
    if (state.currentPath && (state.currentPath.psicologo ||
        (state.currentPath.region === 'Legado' && state.currentPath.fecha === 'legacy'))) {
      // Viewing files — re-render with new view mode
      var files = getFilesAtPath(state.currentPath);
      renderFileGrid(files);
    } else if (state.currentPath) {
      // Viewing subfolders — view modes don't apply, just re-render
      renderSubfoldersView(state.currentPath);
    } else {
      // Root view — show Mi Unidad with files
      var fs = (typeof window.utils !== 'undefined' && window.utils.getFS) ? window.utils.getFS() : {};
      var allFiles = getAllFilesFromFS(fs);
      allFiles.sort(function(a, b) {
        return parseFechaSubida(b.fechaSubida) - parseFechaSubida(a.fechaSubida);
      });
      renderMiUnidadView(allFiles);
    }
  }

  // ===========================================
  // closeMenus — close all menu bar dropdowns
  // ===========================================

  function closeMenus() {
    document.querySelectorAll('.menu-bar__menu').forEach(function(m) {
      m.classList.remove('menu-bar__menu--open');
    });
  }

  // ===========================================
  // toggleSubmenu — toggle display of submenus (Ordenar submenu)
  // ===========================================

  function toggleSubmenu(submenuId, event) {
    if (event) event.stopPropagation();
    var submenu = document.getElementById(submenuId);
    if (!submenu) return;
    if (submenu.style.display === 'none') {
      submenu.style.display = 'block';
    } else {
      submenu.style.display = 'none';
    }
  }

  var zoomLevel = 1;

  function zoomIn() {
    zoomLevel = Math.min(zoomLevel + 0.1, 2);
    var grid = document.querySelector('.grid');
    if (grid) grid.style.transform = 'scale(' + zoomLevel + ')';
  }

  function zoomOut() {
    zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
    var grid = document.querySelector('.grid');
    if (grid) grid.style.transform = 'scale(' + zoomLevel + ')';
  }

  function zoomReset() {
    zoomLevel = 1;
    var grid = document.querySelector('.grid');
    if (grid) grid.style.transform = 'scale(1)';
  }

  // ===========================================
  // ordenarArchivos — VM5
  // Sort files at current path by criterion
  // ===========================================

  function ordenarArchivos(criterio) {
    var files = [];
    if (state.currentPath && (state.currentPath.psicologo ||
        (state.currentPath.region === 'Legado' && state.currentPath.fecha === 'legacy'))) {
      files = getFilesAtPath(state.currentPath);
    } else {
      var fs = (typeof window.utils !== 'undefined' && window.utils.getFS) ? window.utils.getFS() : {};
      files = getAllFilesFromFS(fs);
    }

    if (!files || files.length === 0) return;

    files.sort(function(a, b) {
      switch (criterio) {
        case 'nombre-asc':
          return (a.nombre || '').localeCompare(b.nombre || '');
        case 'nombre-desc':
          return (b.nombre || '').localeCompare(a.nombre || '');
        case 'fecha-reciente':
          return parseFechaSubida(b.fechaSubida) - parseFechaSubida(a.fechaSubida);
        case 'fecha-antigua':
          return parseFechaSubida(a.fechaSubida) - parseFechaSubida(b.fechaSubida);
        case 'tamano-menor': {
          var aSize = parseFloat((a.tama\u00F1o || '0').replace(' MB', '').replace(' GB', ''));
          var bSize = parseFloat((b.tama\u00F1o || '0').replace(' MB', '').replace(' GB', ''));
          return aSize - bSize;
        }
        case 'tamano-mayor': {
          var aSize2 = parseFloat((a.tama\u00F1o || '0').replace(' MB', '').replace(' GB', ''));
          var bSize2 = parseFloat((b.tama\u00F1o || '0').replace(' MB', '').replace(' GB', ''));
          return bSize2 - aSize2;
        }
        default:
          return 0;
      }
    });

    renderFileGrid(files);
  }

  // ===========================================
  // showFilePreview — VM4
  // Preview modal adapted for FileEntry (fechaSubida instead of fecha)
  // ===========================================

  function showFilePreview(file) {
    if (!file) return;
    var icon = ICON_MAP[file.tipo] || '\uD83D\uDCC4';

    var previewIcon = document.getElementById('preview-icon');
    var previewName = document.getElementById('preview-name');
    var previewType = document.getElementById('preview-type');
    var previewDate = document.getElementById('preview-date');
    var previewSize = document.getElementById('preview-size');

    if (previewIcon) previewIcon.textContent = icon;
    if (previewName) previewName.textContent = file.nombre || '';
    if (previewType) previewType.textContent = (file.tipo || '').toUpperCase();
    if (previewDate) previewDate.textContent = file.fechaSubida || file.fecha || '';
    if (previewSize) previewSize.textContent = file.tama\u00F1o || '';

    // Update details panel if visible
    updateDetailsPanel(file);
    updatePreviewPanel(file);

    var overlay = document.getElementById('preview-modal');
    if (overlay) overlay.classList.add('show');
  }

  function closePreviewModal() {
    var overlay = document.getElementById('preview-modal');
    if (overlay) overlay.classList.remove('show');
  }

  // ===========================================
  // updateDetailsPanel / updatePreviewPanel — VM3
  // ===========================================

  function updateDetailsPanel(file) {
    var panel = document.getElementById('details-panel');
    if (!panel) return;
    if (!file) {
      panel.innerHTML = '<h3>Detalles</h3><div class="details-empty">Selecciona un archivo para ver sus detalles</div>';
      return;
    }
    var icon = ICON_MAP[file.tipo] || '\uD83D\uDCC4';
    var docTypeName = file.docType || '—';
    var psicStr = file.psicologos && file.psicologos.length > 0 ? file.psicologos.join(', ') : '—';
    var escuelaStr = (file.region || '') + (file.municipio ? ' / ' + file.municipio : '');

    panel.innerHTML = '<h3>Detalles</h3>' +
      '<div class="details-section"><div class="details-preview-icon">' + icon + '</div></div>' +
      '<div class="details-section">' +
      '  <div class="details-row"><span class="details-label">Nombre</span><span class="details-value">' + escapeHtml(file.nombre) + '</span></div>' +
      '  <div class="details-row"><span class="details-label">Tipo</span><span class="details-value">' + (file.tipo || '').toUpperCase() + '</span></div>' +
      '  <div class="details-row"><span class="details-label">Tama\u00F1o</span><span class="details-value">' + (file.tama\u00F1o || '') + '</span></div>' +
      '  <div class="details-row"><span class="details-label">Fecha</span><span class="details-value">' + (file.fechaSubida || '') + '</span></div>' +
      '  <div class="details-row"><span class="details-label">Documento</span><span class="details-value">' + escapeHtml(docTypeName) + '</span></div>' +
      '  <div class="details-row"><span class="details-label">Psic\u00F3logos</span><span class="details-value">' + escapeHtml(psicStr) + '</span></div>' +
      '  <div class="details-row"><span class="details-label">Ubicaci\u00F3n</span><span class="details-value">' + escapeHtml(escuelaStr) + '</span></div>' +
      '</div>' +
      '<div class="details-section"><div style="display:flex;gap:8px;">' +
      '  <button class="preview-btn preview-btn--print" onclick="window.print()" style="flex:1;padding:8px;border-radius:6px;border:none;background:#34C759;color:white;cursor:pointer;">\uD83D\uDD28</button>' +
      '  <button class="preview-btn preview-btn--download" onclick="alert(\'Descargar\')" style="flex:1;padding:8px;border-radius:6px;border:none;background:#007AFF;color:white;cursor:pointer;">\u2B07\uFE0F</button>' +
      '</div></div>';
  }

  function updatePreviewPanel(file) {
    var panel = document.getElementById('preview-panel');
    if (!panel) return;
    if (!file) {
      panel.innerHTML = '<h3>Vista Previa</h3><div class="preview-content"><div class="preview-empty">Selecciona un archivo para ver su vista previa</div></div>';
      return;
    }
    var icon = ICON_MAP[file.tipo] || '\uD83D\uDCC4';
    panel.innerHTML = '<h3>Vista Previa</h3>' +
      '<div class="preview-content">' +
      '  <div class="preview-file-icon">' + icon + '</div>' +
      '  <div class="preview-file-name">' + escapeHtml(file.nombre) + '</div>' +
      '  <div class="preview-file-meta">' + (file.tipo || '').toUpperCase() + ' \u00B7 ' + (file.tama\u00F1o || '') + ' \u00B7 ' + (file.fechaSubida || '') + '</div>' +
      '  <div class="preview-actions">' +
      '    <button class="btn-print" onclick="window.print()" style="flex:1;padding:8px;border-radius:6px;border:none;background:#34C759;color:white;cursor:pointer;">\uD83D\uDD28</button>' +
      '    <button class="btn-download" onclick="alert(\'Descargar\')" style="flex:1;padding:8px;border-radius:6px;border:none;background:#007AFF;color:white;cursor:pointer;">\u2B07\uFE0F</button>' +
      '    <button class="btn-preview" onclick="showFilePreview(fileData)" style="flex:1;padding:8px;border-radius:6px;border:none;background:#5856D6;color:white;cursor:pointer;">\uD83D\uDC41\uFE0F</button>' +
      '</div></div>';
  }

  // ===========================================
  // Filter Modal — VM5
  // ===========================================

  // tiposDoc reference for filter display
  var tiposDoc = {
    'oficio-solicitud': 'Oficio solicitud',
    'oficio-contestacion': 'Oficio contestaci\u00F3n',
    'oficio-comision': 'Oficio comisi\u00F3n',
    'evidencia-fotografica': 'Evidencia fotogr\u00E1fica',
    'reporte': 'Reporte',
    'figuras-fortalecidas': 'Figuras fortalecidas',
    'otros': 'Otros'
  };

  function openFiltrosModal() {
    var overlay = document.getElementById('filtros-modal');
    if (overlay) overlay.classList.add('show');
    populateFilterSelects();
  }

  function closeFiltrosModal() {
    var overlay = document.getElementById('filtros-modal');
    if (overlay) overlay.classList.remove('show');
  }

  function populateFilterSelects() {
    // Populate municipio select from DB.escuelas
    var mpioSelect = document.getElementById('filtro-municipio');
    if (mpioSelect) {
      var currentVal = mpioSelect.value;
      mpioSelect.innerHTML = '<option value="">Todos</option>';
      if (typeof window.DB !== 'undefined' && window.DB.escuelas) {
        var seen = {};
        for (var ei = 0; ei < window.DB.escuelas.length; ei++) {
          var mpio = window.DB.escuelas[ei].municipio;
          if (mpio && !seen[mpio]) {
            seen[mpio] = true;
            mpioSelect.innerHTML += '<option value="' + mpio.replace(/"/g, '&quot;') + '">' + mpio + '</option>';
          }
        }
      }
      if (currentVal) mpioSelect.value = currentVal;
    }

    // Populate escuela select from DB.escuelas
    var escSelect = document.getElementById('filtro-escuela');
    if (escSelect) {
      var currentEsc = escSelect.value;
      escSelect.innerHTML = '<option value="">Todas</option>';
      if (typeof window.DB !== 'undefined' && window.DB.escuelas) {
        for (var ei2 = 0; ei2 < window.DB.escuelas.length; ei2++) {
          var esc = window.DB.escuelas[ei2];
          escSelect.innerHTML += '<option value="' + esc.id + '">' + escapeHtml(esc.nombre) + ' (' + (esc.cct || '') + ')</option>';
        }
      }
      if (currentEsc) escSelect.value = currentEsc;
    }
  }

  function limpiarFiltros() {
    var numOficio = document.getElementById('filtro-num-oficio');
    var municipio = document.getElementById('filtro-municipio');
    var escuela = document.getElementById('filtro-escuela');
    var cct = document.getElementById('filtro-cct');
    var fecha = document.getElementById('filtro-fecha');
    var tipoDoc = document.getElementById('filtro-tipo-doc');
    var resultados = document.getElementById('filtros-resultados');

    if (numOficio) numOficio.value = '';
    if (municipio) municipio.value = '';
    if (escuela) escuela.value = '';
    if (cct) cct.value = '';
    if (fecha) fecha.value = '';
    if (tipoDoc) tipoDoc.value = '';
    document.querySelectorAll('input[name="filtro-psicologo"]').forEach(function(cb) { cb.checked = false; });
    if (resultados) resultados.innerHTML = '';

    // Reset to current view
    if (state.currentPath && (state.currentPath.psicologo ||
        (state.currentPath.region === 'Legado' && state.currentPath.fecha === 'legacy'))) {
      var files = getFilesAtPath(state.currentPath);
      renderFileGrid(files);
    } else {
      changeView('mi-unidad', 'Mi Unidad');
    }
  }

  function searchAllFiles(fs) {
    return getAllFilesFromFS(fs);
  }

  function aplicarFiltros() {
    var numOficio = document.getElementById('filtro-num-oficio') ? document.getElementById('filtro-num-oficio').value.trim() : '';
    var municipio = document.getElementById('filtro-municipio') ? document.getElementById('filtro-municipio').value : '';
    var escuela = document.getElementById('filtro-escuela') ? document.getElementById('filtro-escuela').value : '';
    var cct = document.getElementById('filtro-cct') ? document.getElementById('filtro-cct').value.trim() : '';
    var fecha = document.getElementById('filtro-fecha') ? document.getElementById('filtro-fecha').value : '';
    var tipoDoc = document.getElementById('filtro-tipo-doc') ? document.getElementById('filtro-tipo-doc').value : '';

    // Psychologists selected
    var psicologosSeleccionados = [];
    document.querySelectorAll('input[name="filtro-psicologo"]:checked').forEach(function(cb) {
      psicologosSeleccionados.push(cb.value);
    });

    var hayFiltros = numOficio || municipio || escuela || cct || fecha || tipoDoc || psicologosSeleccionados.length > 0;
    if (!hayFiltros) {
      closeFiltrosModal();
      if (state.currentPath && (state.currentPath.psicologo ||
          (state.currentPath.region === 'Legado' && state.currentPath.fecha === 'legacy'))) {
        var currentFiles = getFilesAtPath(state.currentPath);
        renderFileGrid(currentFiles);
      } else {
        changeView('mi-unidad', 'Mi Unidad');
      }
      return;
    }

    // Search ALL files in sep:fs recursively
    var fs = (typeof window.utils !== 'undefined' && window.utils.getFS) ? window.utils.getFS() : {};
    var todosArchivos = searchAllFiles(fs);

    // Apply filters
    var filtrados = todosArchivos.filter(function(archivo) {
      if (numOficio && !archivo.nombre.toLowerCase().includes(numOficio.toLowerCase())) return false;

      // Filter by municipio
      if (municipio && archivo.municipio !== municipio) return false;

      // Filter by escuela
      if (escuela && archivo.escuelaId != escuela) return false;

      // Filter by CCT (simulated)
      if (cct && archivo.cct !== cct) return false;

      // Filter by fecha
      if (fecha) {
        var fileFecha = archivo.fechaSubida || '';
        if (!fileFecha.includes(fecha)) return false;
      }

      // Filter by tipoDoc
      if (tipoDoc && archivo.docType !== tipoDoc) return false;

      // Filter by psicologos
      if (psicologosSeleccionados.length > 0) {
        var filePsicos = archivo.psicologos || [];
        var tienePsicologo = psicologosSeleccionados.some(function(p) {
          return filePsicos.indexOf(p) !== -1;
        });
        if (!tienePsicologo) return false;
      }

      return true;
    });

    var resultadosDiv = document.getElementById('filtros-resultados');
    if (resultadosDiv) {
      if (filtrados.length === 0) {
        resultadosDiv.innerHTML = '<span style="color: #FF3B30;">No se encontraron archivos con los filtros aplicados</span>';
      } else {
        resultadosDiv.innerHTML = 'Se encontraron <strong>' + filtrados.length + '</strong> archivo(s)';
      }
    }

    if (filtrados.length === 0) return;

    // Render results in grid
    var titleEl = document.getElementById('view-title');
    if (titleEl) titleEl.textContent = 'Resultados de b\u00FAsqueda';
    state.currentPath = null;
    renderFileGrid(filtrados);
    closeFiltrosModal();
  }

  // ===========================================
  // Upload Modal — Phase 4
  // ===========================================

  var uploadNav = {
    stack: [],
    currentNodes: []
  };

  // ===========================================
  // openUploadModal — UM3
  // ===========================================

  function openUploadModal() {
    state.uploadPath = {};
    uploadNav.stack = [];
    uploadNav.currentNodes = _sidebarTree;

    var overlay = document.getElementById('upload-modal');
    if (overlay) overlay.classList.add('show');

    // Clear previous state
    var fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';

    // Clear selected files from internal state
    state.uploadSelectedFiles = [];

    var fileTypeList = document.getElementById('file-type-list');
    if (fileTypeList) {
      fileTypeList.innerHTML = '<div class="file-list-empty">Selecciona archivos arriba</div>';
    }

    // Populate psicólogos checkboxes
    populatePsicologosCheckboxes();

    // Render root level
    renderUploadLevel(_sidebarTree);

    // Update status indicator
    var indicator = document.getElementById('upload-status-indicator');
    if (indicator) indicator.textContent = 'Navega hasta una fecha de visita';

    // Disable confirm button
    var confirmBtn = document.getElementById('upload-confirm');
    if (confirmBtn) confirmBtn.disabled = true;
  }

  // ===========================================
  // renderUploadLevel — renders one level in upload modal
  // ===========================================

  function renderUploadLevel(nodes) {
    var content = document.getElementById('upload-content');
    var bc = document.getElementById('upload-breadcrumb');
    if (!content || !bc) return;

    var items = uploadNav.stack;

    // Render breadcrumb
    var bcHtml = '<span';
    if (items.length > 0) {
      bcHtml += ' style="cursor:pointer;color:#007AFF;" data-ubci="0"';
    }
    bcHtml += '>Regiones</span>';

    for (var si = 0; si < items.length; si++) {
      var isLast = si === items.length - 1;
      bcHtml += '<span> / </span><span';
      if (!isLast) {
        bcHtml += ' style="cursor:pointer;color:#007AFF;" data-ubci="' + (si + 1) + '"';
      }
      bcHtml += '>' + escapeHtml(items[si].label) + '</span>';
    }
    bc.innerHTML = bcHtml;

    if (!nodes || nodes.length === 0) {
      content.innerHTML = '<div class="file-list-empty">No hay subcarpetas</div>';
      return;
    }

    content.innerHTML = nodes.map(function(node) {
      var icon = node.type === 'fecha' ? '\uD83D\uDCC5' : '\uD83D\uDCC1';
      var countHtml = node.count > 0 ? ' <span class="folder-count">' + node.count + '</span>' : '';
      return '<div class="folder-item" data-type="' + node.type + '" data-id="' + node.id + '">' +
        '<span>' + icon + '</span><span>' + escapeHtml(node.label) + '</span>' + countHtml +
        '</div>';
    }).join('');
  }

  // ===========================================
  // Upload navigation event handlers — UM4
  // ===========================================

  function setupUploadNavigation() {
    var content = document.getElementById('upload-content');
    if (!content) return;

    // Click on folders inside upload content
    content.addEventListener('click', function(e) {
      var item = e.target.closest('.folder-item');
      if (!item) return;

      var type = item.dataset.type;
      var id = item.dataset.id;

      // Find node in full tree
      var node = findNodeById(_sidebarTree, id);
      if (!node) return;

      // Update uploadPath
      var path = state.uploadPath || {};
      if (node.data) {
        if (node.data.region) path.region = node.data.region;
        if (node.data.municipio) path.municipio = node.data.municipio;
        if (node.data.tipo) path.tipo = node.data.tipo;
        if (node.data.nivel) path.nivel = node.data.nivel;
        if (node.data.escuelaId !== undefined && node.data.escuelaId !== null) path.escuelaId = node.data.escuelaId;
        if (node.data.fecha) path.fecha = node.data.fecha;
        if (node.data.psicologo) path.psicologo = node.data.psicologo;
      }
      state.uploadPath = path;

      var indicator = document.getElementById('upload-status-indicator');
      var confirmBtn = document.getElementById('upload-confirm');

      // Leaf node (psicologo) — reached target
      if (type === 'psicologo') {
        if (indicator) indicator.textContent = 'Listo para subir archivos';
        if (confirmBtn) confirmBtn.disabled = false;

        uploadNav.stack.push({ label: node.label, type: type });

        var contentEl = document.getElementById('upload-content');
        contentEl.innerHTML = '<div class="file-list-empty" style="padding:30px;">' +
          '\uD83D\uDCC5 <strong>' + escapeHtml(node.label) + '</strong><br>' +
          '<span style="font-size:12px;color:#8E8E93;">Usa el selector de archivos arriba</span></div>';

        // Update breadcrumb to show full path including this fecha
        renderUploadLevel([]);
        return;
      }

      // Intermediate node — navigate one level deeper
      if (indicator) indicator.textContent = 'Navega hasta una fecha de visita';
      if (confirmBtn) confirmBtn.disabled = true;

      uploadNav.stack.push({ label: node.label, type: type });
      uploadNav.currentNodes = node.children || [];
      renderUploadLevel(uploadNav.currentNodes);
    });

    // Click on breadcrumb in upload modal — go back
    var bc = document.getElementById('upload-breadcrumb');
    if (bc) {
      bc.addEventListener('click', function(e) {
        var span = e.target.closest('[data-ubci]');
        if (!span) return;

        var targetIndex = parseInt(span.dataset.ubci);

        // Rebuild from tree root
        var nodes = _sidebarTree;
        var newStack = [];
        var newPath = {};

        for (var i = 0; i < targetIndex; i++) {
          var stackItem = uploadNav.stack[i];
          if (!stackItem) break;

          var found = findNodeByLabelAndType(nodes, stackItem.label, stackItem.type);
          if (found) {
            newStack.push(stackItem);
            if (found.data) {
              if (found.data.region) newPath.region = found.data.region;
              if (found.data.municipio) newPath.municipio = found.data.municipio;
              if (found.data.tipo) newPath.tipo = found.data.tipo;
              if (found.data.nivel) newPath.nivel = found.data.nivel;
              if (found.data.escuelaId !== undefined && found.data.escuelaId !== null) newPath.escuelaId = found.data.escuelaId;
              if (found.data.fecha) newPath.fecha = found.data.fecha;
              if (found.data.psicologo) newPath.psicologo = found.data.psicologo;
            }
            nodes = found.children || [];
          } else {
            nodes = [];
            break;
          }
        }

        uploadNav.stack = newStack;
        uploadNav.currentNodes = nodes;
        state.uploadPath = newPath;

        // Update status
        var indicator = document.getElementById('upload-status-indicator');
        var confirmBtn = document.getElementById('upload-confirm');
        if (indicator) indicator.textContent = 'Navega hasta una fecha de visita';
        if (confirmBtn) confirmBtn.disabled = true;

        renderUploadLevel(nodes);
      });
    }
  }

  // ===========================================
  // uploadFiles — UM5
  // ===========================================

  function uploadFiles() {
    var path = state.uploadPath;
    if (!path || !path.region || !path.municipio || !path.tipo || !path.nivel ||
        path.escuelaId === undefined || path.escuelaId === null || !path.fecha || !path.psicologo) {
      alert('Por favor navega hasta la carpeta de un psic\u00F3logo antes de subir archivos.');
      return false;
    }

    var files = state.uploadSelectedFiles || [];
    if (!files || files.length === 0) {
      alert('Por favor selecciona al menos un archivo');
      return false;
    }

    // Check all files have docType assigned
    for (var fi = 0; fi < files.length; fi++) {
      if (!files[fi].tipo) {
        alert('Por favor selecciona el tipo de documento para todos los archivos');
        return false;
      }
    }

    // Get psychologist from the navigated path
    var psicologos = [];
    if (path.psicologo) {
      psicologos.push(path.psicologo);
    }

    // Read current FS from localStorage
    var fs = {};
    if (typeof window.utils !== 'undefined' && window.utils.getFS) {
      fs = window.utils.getFS();
    }

    var today = new Date();
    var fechaSubida = today.getDate() + ' ' + MONTHS[today.getMonth()];

    // File type map from extension
    var tipoMap = {
      'pdf': 'pdf', 'doc': 'doc', 'docx': 'doc',
      'xls': 'xls', 'xlsx': 'xls',
      'jpg': 'img', 'jpeg': 'img', 'png': 'img', 'gif': 'img',
      'zip': 'zip', 'rar': 'zip'
    };

    var added = 0;

    for (var fi2 = 0; fi2 < files.length; fi2++) {
      var fileData = files[fi2];
      var fileName = fileData.name;
      if (!fileName) continue;

      var ext = fileName.split('.').pop().toLowerCase();
      var fileTipo = tipoMap[ext] || 'doc';

      // Format file size
      var fileSize = '0.0 MB';
      if (fileData.file && fileData.file.size) {
        fileSize = (fileData.file.size / (1024 * 1024)).toFixed(1) + ' MB';
      }

      // Generate unique ID
      var genId = (typeof window.utils !== 'undefined' && window.utils.generateId)
        ? window.utils.generateId
        : function() { return Date.now() + Math.random().toString(36).substr(2, 9); };

      // Build FileEntry
      var entry = {
        id: genId(),
        nombre: fileName,
        tipo: fileTipo,
        tama\u00F1o: fileSize,
        fechaSubida: fechaSubida,
        docType: fileData.tipo,
        psicologos: psicologos,
        escuelaId: path.escuelaId,
        municipio: path.municipio,
        region: path.region,
        tipoEscuela: path.tipo,
        nivel: path.nivel,
        psicologo: path.psicologo
      };

      // Ensure path and add file
      ensurePath(fs, path.region, path.municipio, path.tipo, path.nivel, path.escuelaId, path.fecha, path.psicologo);
      fs[path.region][path.municipio][path.tipo][path.nivel][path.escuelaId][path.fecha][path.psicologo].push(entry);
      added++;
    }

    // Persist to localStorage
    if (typeof window.utils !== 'undefined' && window.utils.setFS) {
      window.utils.setFS(fs);
    }

    alert(added + ' archivo(s) subido(s) correctamente');

    // If currentPath matches upload path, re-render grid
    if (state.currentPath &&
        state.currentPath.region === path.region &&
        state.currentPath.municipio === path.municipio &&
        state.currentPath.tipo === path.tipo &&
        state.currentPath.nivel === path.nivel &&
        state.currentPath.escuelaId == path.escuelaId &&
        state.currentPath.fecha === path.fecha &&
        state.currentPath.psicologo === path.psicologo) {
      var currentFiles = getFilesAtPath(state.currentPath);
      renderFileGrid(currentFiles);
    }

    // Close modal
    closeUploadModal();

    return true;
  }

  // ===========================================
  // closeUploadModal — UM7
  // ===========================================

  function closeUploadModal() {
    state.uploadPath = null;
    uploadNav.stack = [];
    uploadNav.currentNodes = [];

    var overlay = document.getElementById('upload-modal');
    if (overlay) overlay.classList.remove('show');

    var bc = document.getElementById('upload-breadcrumb');
    if (bc) bc.innerHTML = '';
    var content = document.getElementById('upload-content');
    if (content) content.innerHTML = '';
    var indicator = document.getElementById('upload-status-indicator');
    if (indicator) indicator.textContent = '';

    var fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';

    state.uploadSelectedFiles = [];

    var fileTypeList = document.getElementById('file-type-list');
    if (fileTypeList) {
      fileTypeList.innerHTML = '<div class="file-list-empty">Selecciona archivos arriba</div>';
    }
  }

  // ===========================================
  // handleUpload — alias for uploadFiles (MG4)
  // Exposed globally for HTML onclick compatibility
  // ===========================================

  function handleUpload() {
    return uploadFiles();
  }

  // ===========================================
  // populatePsicologosCheckboxes — UM6
  // ===========================================

  function populatePsicologosCheckboxes() {
    var container = document.getElementById('psicologos-checkboxes');
    if (!container) return;

    var psicologos = [];
    if (typeof window.DB !== 'undefined' && window.DB.psicologos) {
      psicologos = window.DB.psicologos;
    }

    if (psicologos.length === 0) {
      container.innerHTML = '<span style="font-size:12px;color:#8E8E93;">No hay psic\u00F3logos registrados</span>';
      return;
    }

    container.innerHTML = psicologos.map(function(p) {
      return '<label style="display:flex;align-items:center;gap:6px;font-size:13px;padding:2px 0;">' +
        '<input type="checkbox" name="upload-psicologos" value="' + (p.nombre || '').replace(/"/g, '&quot;') + '"> ' + escapeHtml(p.nombre) +
        '</label>';
    }).join('');
  }

  // ===========================================
  // runMigration — MG1
  // One-time migration from legacy archivos object to sep:fs
  // ===========================================

  function runMigration() {
    // Phase 1: legacy archivos → sep:fs (EXISTENTE, no cambiar)
    var fs = (typeof window.utils !== 'undefined' && window.utils.getFS) ? window.utils.getFS() : {};
    if (Object.keys(fs).length === 0 && hasLegacyData()) {
      // Build migrated files structure
      var migratedFiles = [];
      for (var key in archivos) {
        if (!archivos.hasOwnProperty(key)) continue;
        var items = archivos[key];
        if (!Array.isArray(items)) continue;
        for (var fi = 0; fi < items.length; fi++) {
          var file = items[fi];
          if (file.tipo !== 'folder') {
            var today = new Date();
            var defaultFecha = today.getDate() + ' ' + MONTHS[today.getMonth()];
            var genId = (typeof window.utils !== 'undefined' && window.utils.generateId)
              ? window.utils.generateId
              : function() { return Date.now() + Math.random().toString(36).substr(2, 9); };

            migratedFiles.push({
              id: genId(),
              nombre: file.nombre,
              tipo: file.tipo,
              tama\u00F1o: file.tama\u00F1o,
              fechaSubida: file.fecha || defaultFecha,
              docType: file.docType || 'otros',
              psicologos: file.psicologo ? [file.psicologo] : [],
              escuelaId: null,
              municipio: null,
              region: null
            });
          }
        }
      }

      // Build legacy structure: Legado > Legado > 0 > legacy
      var result = {};
      result['Legado'] = {};
      result['Legado']['Legado'] = {};
      result['Legado']['Legado']['0'] = {};
      result['Legado']['Legado']['0']['legacy'] = migratedFiles;

      if (typeof window.utils !== 'undefined' && window.utils.setFS) {
        window.utils.setFS(result);
      }
    }

    // Phase 2: migrate sep:fs from 4-level to 7-level structure (NUEVO)
    migrateFSto7Levels();
  }

  // ===========================================
  // migrateFSto7Levels — MG1 Phase 2
  // One-time migration of sep:fs from 4-level to 7-level hierarchy
  // ===========================================

  function migrateFSto7Levels() {
    var fs = (typeof window.utils !== 'undefined' && window.utils.getFS) ? window.utils.getFS() : {};
    if (!fs || typeof fs !== 'object') return;

    // Already migrated
    if (fs._version && fs._version >= 2) return;

    // Check if data exists in old 4-level format:
    //   fs[region][municipio][escuelaId][fecha] → files[]
    // vs new 7-level:
    //   fs[region][municipio][tipo][nivel][escuelaId][fecha][psicologo] → files[]
    var hasOldFormat = false;
    for (var region in fs) {
      if (!fs.hasOwnProperty(region) || region === '_version') continue;
      // Skip Legado — has numeric key '0' that would falsely trigger old-format detection
      if (region === 'Legado') continue;
      for (var municipio in fs[region]) {
        if (!fs[region].hasOwnProperty(municipio)) continue;
        var firstKey = Object.keys(fs[region][municipio])[0];
        if (firstKey && !isNaN(parseInt(firstKey, 10))) {
          hasOldFormat = true;
          break;
        }
      }
      if (hasOldFormat) break;
    }

    if (!hasOldFormat) {
      fs._version = 2;
      if (typeof window.utils !== 'undefined' && window.utils.setFS) {
        window.utils.setFS(fs);
      }
      return;
    }

    // Build lookup: escuelaId → { tipo, nivel }
    var escuelaLookup = {};
    var escuelas = (typeof window.DB !== 'undefined' && window.DB.escuelas) || [];
    for (var ei = 0; ei < escuelas.length; ei++) {
      escuelaLookup[escuelas[ei].id] = {
        tipo: escuelas[ei].tipo || 'P\u00FAblica',
        nivel: escuelas[ei].nivel || 'Primaria'
      };
    }

    // Map internal tipo values to display keys used in the 7-level FS
    var TIPO_KEY = { 'Privada': 'Privadas', 'P\u00FAblica': 'P\u00FAblicas' };

    // Build new 7-level FS
    var newFS = { _version: 2 };

    for (var r in fs) {
      if (!fs.hasOwnProperty(r) || r === '_version') continue;
      // Skip Legado — handled separately by getFilesAtPath
      if (r === 'Legado') continue;

      for (var m in fs[r]) {
        if (!fs[r].hasOwnProperty(m)) continue;

        for (var eId in fs[r][m]) {
          if (!fs[r][m].hasOwnProperty(eId)) continue;

          var escuelaInfo = escuelaLookup[eId];
          var tipo = (escuelaInfo && escuelaInfo.tipo) || 'P\u00FAblica';
          var nivel = (escuelaInfo && escuelaInfo.nivel) || 'Primaria';
          var tipoKey = TIPO_KEY[tipo] || tipo;

          for (var f in fs[r][m][eId]) {
            if (!fs[r][m][eId].hasOwnProperty(f)) continue;

            var files = fs[r][m][eId][f];
            if (!Array.isArray(files)) continue;

            // Group files by psychologist within this fecha
            var filesByPsicologo = {};
            for (var fi = 0; fi < files.length; fi++) {
              var file = files[fi];
              var psicologos = file.psicologos && file.psicologos.length > 0
                ? file.psicologos
                : ['Sin asignar'];

              for (var pi = 0; pi < psicologos.length; pi++) {
                var pName = psicologos[pi];
                if (!filesByPsicologo[pName]) filesByPsicologo[pName] = [];
                filesByPsicologo[pName].push(file);
              }
            }

            // Write into new 7-level structure
            if (!newFS[r]) newFS[r] = {};
            if (!newFS[r][m]) newFS[r][m] = {};
            if (!newFS[r][m][tipoKey]) newFS[r][m][tipoKey] = {};
            if (!newFS[r][m][tipoKey][nivel]) newFS[r][m][tipoKey][nivel] = {};
            if (!newFS[r][m][tipoKey][nivel][eId]) newFS[r][m][tipoKey][nivel][eId] = {};
            if (!newFS[r][m][tipoKey][nivel][eId][f]) newFS[r][m][tipoKey][nivel][eId][f] = {};

            for (var p in filesByPsicologo) {
              newFS[r][m][tipoKey][nivel][eId][f][p] = filesByPsicologo[p];
            }
          }
        }
      }
    }

    // Preserve Legado data (not migrated — special structure handled by getFilesAtPath)
    if (fs['Legado']) {
      newFS['Legado'] = JSON.parse(JSON.stringify(fs['Legado']));
    }

    if (typeof window.utils !== 'undefined' && window.utils.setFS) {
      window.utils.setFS(newFS);
    }
  }

  // ===========================================
  // initArchivosTree — wire event delegation (MG3)
  // Entry point: migration → build tree → render → wire events → default view
  // ===========================================

  function initArchivosTree() {
    // 1. Run migration first
    runMigration();

    // Update calendar icon in agenda dock
    (function updateCalendarIcon() {
      var now = new Date();
      var dayName = now.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
      var dayNameEl = document.getElementById('day-name');
      var dayNumberEl = document.getElementById('day-number');
      if (dayNameEl) dayNameEl.textContent = dayName;
      if (dayNumberEl) dayNumberEl.textContent = now.getDate();
    })();

    // 2. Build and render the file system tree
    var tree = buildFileSystemTree();
    window._currentTree = tree;
    renderSidebar(tree);
    setupSidebarClicks();
    setupUploadNavigation();

    // 3. Set default view
    changeView('mi-unidad', 'Mi Unidad');

    // 4. Wire all event listeners

    // ——— Logout button ———
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        if (typeof window.utils !== 'undefined' && window.utils.logout) {
          window.utils.logout();
        } else {
          syncStore.clear();
          window.location.href = '../login.html';
        }
      });
    }

    // ——— Dock navigation ———
    document.querySelectorAll('.dock__icon').forEach(function(icon) {
      icon.addEventListener('click', function() {
        var href = icon.dataset.href;
        if (href) window.location.href = href;
      });
    });

    // ——— Clock update ———
    function updateClock() {
      var clockEl = document.getElementById('clock');
      if (clockEl) {
        clockEl.textContent = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
      }
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ——— Menu bar dropdowns ———
    ['archivo', 'ver'].forEach(function(menu) {
      var btn = document.getElementById('menu-' + menu);
      var dropdown = document.getElementById('dropdown-' + menu);
      if (btn && dropdown) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          var isOpen = dropdown.classList.contains('menu-bar__menu--open');
          ['archivo', 'ver'].forEach(function(m) {
            var d = document.getElementById('dropdown-' + m);
            if (d) d.classList.remove('menu-bar__menu--open');
          });
          if (!isOpen) dropdown.classList.add('menu-bar__menu--open');
        });
      }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.menu-bar__dropdown')) {
        closeMenus();
      }
    });

    // ——— Sidebar navigation (Mi Unidad, Recientes, Compartidos) ———
    document.querySelectorAll('.nav-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var navId = item.dataset.nav;
        var navNames = {
          'mi-unidad': 'Mi Unidad',
          'recientes': 'Recientes',
          'compartidos': 'Compartidos'
        };
        changeView(navId, navNames[navId]);
      });
    });

    // ——— Breadcrumb click delegation ———
    var bc = document.getElementById('breadcrumb');
    if (bc) {
      bc.addEventListener('click', function(e) {
        if (e.target.classList.contains('breadcrumb-item')) {
          var nav = e.target.dataset.nav;
          if (nav === 'mi-unidad') {
            changeView('mi-unidad', 'Mi Unidad');
            return;
          }

          // Hierarchical breadcrumb navigation
          var path = state.currentPath;
          if (path) {
            if (nav === 'bread-region') {
              navigateToPath({ region: path.region });
            } else if (nav === 'bread-municipio') {
              navigateToPath({ region: path.region, municipio: path.municipio });
            } else if (nav === 'bread-tipo') {
              navigateToPath({ region: path.region, municipio: path.municipio, tipo: path.tipo });
            } else if (nav === 'bread-nivel') {
              navigateToPath({ region: path.region, municipio: path.municipio, tipo: path.tipo, nivel: path.nivel });
            } else if (nav === 'bread-escuela') {
              navigateToPath({ region: path.region, municipio: path.municipio, tipo: path.tipo, nivel: path.nivel, escuelaId: path.escuelaId });
            } else if (nav === 'bread-fecha') {
              navigateToPath({ region: path.region, municipio: path.municipio, tipo: path.tipo, nivel: path.nivel, escuelaId: path.escuelaId, fecha: path.fecha });
            }
          }
        }
      });
    }

    // ——— Grid item clicks (delegation) ———
    var grid = document.getElementById('grid');
    if (grid) {
      grid.addEventListener('click', function(e) {
        var fileItem = e.target.closest('[data-file]');
        if (fileItem) {
          e.preventDefault();
          try {
            var fileData = JSON.parse(fileItem.dataset.file);
            showFilePreview(fileData);
          } catch (err) {
            // ignore parse errors
          }
        }
      });
    }

    // ——— "+ Nuevo" button ———
    var newBtn = document.getElementById('new-btn');
    if (newBtn) {
      newBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        openUploadModal();
      });
    }

    // ——— Upload modal buttons ———
    var uploadConfirm = document.getElementById('upload-confirm');
    if (uploadConfirm) {
      uploadConfirm.addEventListener('click', function() {
        uploadFiles();
      });
    }
    var uploadCancel = document.getElementById('upload-cancel');
    if (uploadCancel) {
      uploadCancel.addEventListener('click', closeUploadModal);
    }

    // Close upload modal on overlay click
    var uploadModal = document.getElementById('upload-modal');
    if (uploadModal) {
      uploadModal.addEventListener('click', function(e) {
        if (e.target === uploadModal) {
          closeUploadModal();
        }
      });
    }

    // ——— Preview modal buttons ———
    var previewPrint = document.getElementById('preview-print');
    if (previewPrint) {
      previewPrint.addEventListener('click', function() { window.print(); });
    }
    var previewDownload = document.getElementById('preview-download');
    if (previewDownload) {
      previewDownload.addEventListener('click', function() {
        var previewName = document.getElementById('preview-name');
        alert('Descargar ' + (previewName ? previewName.textContent : '') + ' - En desarrollo');
      });
    }
    var previewClose = document.getElementById('preview-close');
    if (previewClose) {
      previewClose.addEventListener('click', closePreviewModal);
    }

    // Close preview modal on overlay click
    var previewModal = document.getElementById('preview-modal');
    if (previewModal) {
      previewModal.addEventListener('click', function(e) {
        if (e.target === previewModal) {
          closePreviewModal();
        }
      });
    }

    // ——— Filter modal buttons ———
    var filtrosBuscar = document.getElementById('filtros-buscar');
    if (filtrosBuscar) {
      filtrosBuscar.addEventListener('click', aplicarFiltros);
    }
    var filtrosLimpiar = document.getElementById('filtros-limpiar');
    if (filtrosLimpiar) {
      filtrosLimpiar.addEventListener('click', limpiarFiltros);
    }

    // Close filter modal on overlay click
    var filtrosModal = document.getElementById('filtros-modal');
    if (filtrosModal) {
      filtrosModal.addEventListener('click', function(e) {
        if (e.target === filtrosModal) {
          closeFiltrosModal();
        }
      });
    }

    // ——— File input event for upload ———
    var fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.addEventListener('change', function(e) {
        var files = e.target.files;
        state.uploadSelectedFiles = [];
        if (files && files.length > 0) {
          for (var i = 0; i < files.length; i++) {
            state.uploadSelectedFiles.push({
              file: files[i],
              name: files[i].name,
              tipo: ''
            });
          }
        }
        renderFileTypeList();
      });
    }
  }

  // ===========================================
  // renderFileTypeList — file list with docType selectors
  // (kept for upload modal backward compat, MG4)
  // ===========================================

  function renderFileTypeList() {
    var container = document.getElementById('file-type-list');
    if (!container) return;
    var sf = state.uploadSelectedFiles || [];
    if (sf.length === 0) {
      container.innerHTML = '<div class="file-list-empty">Selecciona archivos arriba</div>';
      return;
    }
    container.innerHTML = sf.map(function(file, index) {
      return '<div class="file-list-item" data-index="' + index + '">' +
        '<span class="file-list-name" title="' + escapeHtml(file.name) + '">' + escapeHtml(file.name) + '</span>' +
        '<select class="file-list-select" data-index="' + index + '">' +
        '  <option value="">Seleccionar...</option>' +
        '  <option value="oficio-solicitud">Oficio solicitud</option>' +
        '  <option value="oficio-contestacion">Oficio contestaci\u00F3n</option>' +
        '  <option value="oficio-comision">Oficio comisi\u00F3n</option>' +
        '  <option value="evidencia-fotografica">Evidencia fotogr\u00E1fica</option>' +
        '  <option value="reporte">Reporte</option>' +
        '  <option value="figuras-fortalecidas">Figuras fortalecidas</option>' +
        '  <option value="otros">Otros</option>' +
        '</select>' +
        '<button type="button" class="file-list-remove" data-index="' + index + '">\u2715</button>' +
        '</div>';
    }).join('');

    container.querySelectorAll('.file-list-select').forEach(function(select) {
      select.addEventListener('change', function(e) {
        var idx = parseInt(e.target.dataset.index);
        if (state.uploadSelectedFiles && state.uploadSelectedFiles[idx]) {
          state.uploadSelectedFiles[idx].tipo = e.target.value;
        }
      });
    });

    container.querySelectorAll('.file-list-remove').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var idx = parseInt(e.target.dataset.index);
        if (state.uploadSelectedFiles && state.uploadSelectedFiles[idx]) {
          state.uploadSelectedFiles.splice(idx, 1);
          renderFileTypeList();
        }
      });
    });
  }

  // ===========================================
  // Expose public API via window.archivosFS
  // ===========================================

  window.archivosFS = {
    state: state,
    ICON_MAP: ICON_MAP,
    MONTHS: MONTHS,
    ensurePath: ensurePath,
    hasLegacyData: hasLegacyData,
    buildFileSystemTree: buildFileSystemTree,
    getFilesAtPath: getFilesAtPath,
    getFilesAtPathFromFS: getFilesAtPathFromFS,
    renderSidebar: renderSidebar,
    renderTreeNode: renderTreeNode,
    navigateToPath: navigateToPath,
    renderFileGrid: renderFileGrid,
    initArchivosTree: initArchivosTree,
    openUploadModal: openUploadModal,
    closeUploadModal: closeUploadModal,
    findNodeByPartialPath: findNodeByPartialPath,
    renderSubfoldersView: renderSubfoldersView,
    uploadFiles: uploadFiles,
    handleUpload: handleUpload,
    populatePsicologosCheckboxes: populatePsicologosCheckboxes,
    showFilePreview: showFilePreview,
    closePreviewModal: closePreviewModal,
    ordenarArchivos: ordenarArchivos,
    aplicarFiltros: aplicarFiltros,
    limpiarFiltros: limpiarFiltros,
    openFiltrosModal: openFiltrosModal,
    closeFiltrosModal: closeFiltrosModal,
    setViewMode: setViewMode,
    toggleSubmenu: toggleSubmenu,
    closeMenus: closeMenus,
    zoomIn: zoomIn,
    zoomOut: zoomOut,
    zoomReset: zoomReset
  };

  // ===========================================
  // Expose individual functions to window for HTML onclick compatibility
  // These are called from inline onclick attributes (CRITICAL)
  // ===========================================

  window.navigateTo = typeof window.navigateTo !== 'undefined' ? window.navigateTo : window.utils.navigateTo;
  window.openFiltrosModal = openFiltrosModal;
  window.closeFiltrosModal = closeFiltrosModal;
  window.aplicarFiltros = aplicarFiltros;
  window.limpiarFiltros = limpiarFiltros;
  window.setViewMode = setViewMode;
  window.ordenarArchivos = ordenarArchivos;
  window.openUploadModal = openUploadModal;
  window.closeUploadModal = closeUploadModal;
  window.handleUpload = handleUpload;
  window.showFilePreview = showFilePreview;
  window.closePreviewModal = closePreviewModal;
  window.toggleSubmenu = toggleSubmenu;
  window.closeMenus = closeMenus;
  window.zoomIn = zoomIn;
  window.zoomOut = zoomOut;
  window.zoomReset = zoomReset;

})();
