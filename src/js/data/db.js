// ===========================================
// DEMO / SYNTHETIC DATA
// ===========================================
// All names, emails, phone numbers, credentials, school records,
// professional license numbers, visits and population figures in this
// file are fictitious and exist exclusively for demonstration purposes.
// They do not represent real SEP personnel, schools or institutional records.
// ===========================================// ===========================================
// Mock Data - Plataforma Psicoeducativa
// ===========================================

const DB = {
  // Usuarios del sistema
  usuarios: [
    {
      id: 0,
      nombre: 'Administrador Sistema',
      avatar: 'AD',
      email: 'admin@example.com',
      rol: 'admin',
      password: 'admin123',
      region: 'Central',
      equipo: 'Admin'
    },
    {
      id: 1,
      nombre: 'Dra. María García',
      avatar: 'MG',
      email: 'maria.garcia@institucion.mx',
      rol: 'psicologo',
      password: 'demo123',
      region: 'Pachuca I',
      equipo: 'Alpha'
    },
    {
      id: 2,
      nombre: 'Dr. Juan Pérez',
      avatar: 'JP',
      email: 'juan.perez@institucion.mx',
      rol: 'psicologo',
      region: 'Pachuca I',
      equipo: 'Alpha'
    },
    {
      id: 3,
      nombre: 'Mtra. María López',
      avatar: 'ML',
      email: 'maria.lopez@institucion.mx',
      rol: 'psicologo',
      region: 'Pachuca II',
      equipo: 'Beta'
    }
  ],

  // Psicologos
  psicologos: [
    { id: 1, nombre: 'Dr. Juan Pérez', especialidad: 'Psicología Clínica', region: 'Pachuca I', avatar: 'JP', cedula: '12345678', telefono: '7711234567', escuelas: 12, visitas: 45, rating: 4.8, status: 'online', email: 'juan.perez@institucion.mx' },
    { id: 2, nombre: 'Dra. María García', especialidad: 'Psicología Educativa', region: 'Pachuca I', avatar: 'MG', cedula: '23456789', telefono: '7712345678', escuelas: 15, visitas: 52, rating: 4.9, status: 'offline', email: 'maria.garcia@institucion.mx' },
    { id: 3, nombre: 'Mtra. Ana Torres', especialidad: 'Psicología Social', region: 'Pachuca II', avatar: 'AT', cedula: '34567890', telefono: '7713456789', escuelas: 8, visitas: 28, rating: 4.6, status: 'online', email: 'ana.torres@institucion.mx' },
    { id: 4, nombre: 'Lic. Roberto Mendoza', especialidad: 'Psicología Infantil', region: 'Pachuca I', avatar: 'RM', cedula: '45678901', telefono: '7714567890', escuelas: 10, visitas: 35, rating: 4.7, status: 'away', email: 'roberto.mendoza@institucion.mx' }
  ],

  // Administrativos
  administrativos: [
    { id: 1, nombre: 'Lic. Ana López', area: 'Administrativa', puesto: 'Secretaria General', email: 'ana.lopez@institucion.mx', telefono: '7711234567', extension: '101', avatar: 'AL' },
    { id: 2, nombre: 'Ing. Roberto Martínez', area: 'Académica', puesto: 'Coordinador Académico', email: 'roberto.martinez@institucion.mx', telefono: '7712345678', extension: '102', avatar: 'RM' },
    { id: 3, nombre: 'C.P. Sofía Cruz', area: 'Contabilidad', puesto: 'Contadora', email: 'sofia.cruz@institucion.mx', telefono: '7713456789', extension: '103', avatar: 'SC' }
  ],

  // Escuelas — 84 municipios, 15 regiones
  escuelas: [
    // Huejutla (4)
    { id: 1, nombre: 'Escuela Huazalingo', cct: '13XXX0001', nivel: 'Maternal', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Huazalingo', region: 'Huejutla', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    { id: 2, nombre: 'Escuela Huejutla', cct: '13XXX0002', nivel: 'Preescolar', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Huejutla', region: 'Huejutla', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 3, nombre: 'Escuela Jaltocan', cct: '13XXX0003', nivel: 'Primaria', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Jaltocan', region: 'Huejutla', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 4, nombre: 'Escuela San Felipe Orizatlan', cct: '13XXX0004', nivel: 'Secundaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'San Felipe Orizatlan', region: 'Huejutla', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    // Ixmiquilpan (12)
    { id: 5, nombre: 'Escuela Alfajayucan', cct: '13XXX0005', nivel: 'Maternal', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Alfajayucan', region: 'Ixmiquilpan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    { id: 6, nombre: 'Escuela Cardonal', cct: '13XXX0006', nivel: 'Preescolar', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Cardonal', region: 'Ixmiquilpan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 7, nombre: 'Escuela Chapantongo', cct: '13XXX0007', nivel: 'Primaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Chapantongo', region: 'Ixmiquilpan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 8, nombre: 'Escuela Chilcuautla', cct: '13XXX0008', nivel: 'Secundaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Chilcuautla', region: 'Ixmiquilpan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 9, nombre: 'Escuela Huichapan', cct: '13XXX0009', nivel: 'Media Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Huichapan', region: 'Ixmiquilpan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    { id: 10, nombre: 'Escuela Ixmiquilpan', cct: '13XXX0010', nivel: 'Maternal', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Ixmiquilpan', region: 'Ixmiquilpan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 11, nombre: 'Escuela Nicolas Flores', cct: '13XXX0011', nivel: 'Preescolar', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Nicolas Flores', region: 'Ixmiquilpan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 12, nombre: 'Escuela Nopala', cct: '13XXX0012', nivel: 'Primaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Nopala', region: 'Ixmiquilpan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 13, nombre: 'Escuela Pacula', cct: '13XXX0013', nivel: 'Secundaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Pacula', region: 'Ixmiquilpan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    { id: 14, nombre: 'Escuela Tasquillo', cct: '13XXX0014', nivel: 'Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tasquillo', region: 'Ixmiquilpan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 15, nombre: 'Escuela Tecozautla', cct: '13XXX0015', nivel: 'Media Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tecozautla', region: 'Ixmiquilpan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 16, nombre: 'Escuela Zimapan', cct: '13XXX0016', nivel: 'Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Zimapan', region: 'Ixmiquilpan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    // Tula (6)
    { id: 17, nombre: 'Escuela Atitalaquia', cct: '13XXX0017', nivel: 'Maternal', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Atitalaquia', region: 'Tula', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    { id: 18, nombre: 'Escuela Atotonilco de Tula', cct: '13XXX0018', nivel: 'Preescolar', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Atotonilco de Tula', region: 'Tula', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 19, nombre: 'Escuela Tepeji del Rio', cct: '13XXX0019', nivel: 'Primaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tepeji del Rio', region: 'Tula', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 20, nombre: 'Escuela Tepetitlan', cct: '13XXX0020', nivel: 'Secundaria', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tepetitlan', region: 'Tula', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 21, nombre: 'Escuela Tezontepec de Aldama', cct: '13XXX0021', nivel: 'Secundaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tezontepec de Aldama', region: 'Tula', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    { id: 22, nombre: 'Escuela Tula de Allende', cct: '13XXX0022', nivel: 'Media Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tula de Allende', region: 'Tula', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    // Tulancingo (8)
    { id: 23, nombre: 'Escuela Agua Blanca', cct: '13XXX0023', nivel: 'Maternal', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Agua Blanca', region: 'Tulancingo', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 24, nombre: 'Escuela Acaxochitlan', cct: '13XXX0024', nivel: 'Preescolar', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Acaxochitlan', region: 'Tulancingo', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 25, nombre: 'Escuela Acatlan', cct: '13XXX0025', nivel: 'Primaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Acatlan', region: 'Tulancingo', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    { id: 26, nombre: 'Escuela Cuautepec', cct: '13XXX0026', nivel: 'Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Cuautepec', region: 'Tulancingo', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 27, nombre: 'Escuela Metepec', cct: '13XXX0027', nivel: 'Maternal', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Metepec', region: 'Tulancingo', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 28, nombre: 'Escuela Santiago Tulantepec', cct: '13XXX0028', nivel: 'Preescolar', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Santiago Tulantepec', region: 'Tulancingo', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 29, nombre: 'Escuela Singuilucan', cct: '13XXX0029', nivel: 'Media Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Singuilucan', region: 'Tulancingo', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    { id: 30, nombre: 'Escuela Tulancingo', cct: '13XXX0030', nivel: 'Primaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tulancingo', region: 'Tulancingo', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    // Pachuca I (3)
    { id: 31, nombre: 'Escuela Mineral de la Reforma', cct: '13XXX0031', nivel: 'Secundaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Mineral de la Reforma', region: 'Pachuca I', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 32, nombre: 'Escuela Pachuca', cct: '13XXX0032', nivel: 'Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Pachuca', region: 'Pachuca I', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 33, nombre: 'Escuela San Agustín Tlaxiaca', cct: '13XXX0033', nivel: 'Primaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'San Agustín Tlaxiaca', region: 'Pachuca I', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    // Pachuca II (6)
    { id: 34, nombre: 'Escuela Almoloya', cct: '13XXX0034', nivel: 'Maternal', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Almoloya', region: 'Pachuca II', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 35, nombre: 'Escuela Apan', cct: '13XXX0035', nivel: 'Preescolar', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Apan', region: 'Pachuca II', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 36, nombre: 'Escuela Emiliano Zapata', cct: '13XXX0036', nivel: 'Primaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Emiliano Zapata', region: 'Pachuca II', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 37, nombre: 'Escuela Tepeapulco', cct: '13XXX0037', nivel: 'Secundaria', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tepeapulco', region: 'Pachuca II', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    { id: 38, nombre: 'Escuela Tlanalapa', cct: '13XXX0038', nivel: 'Secundaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tlanalapa', region: 'Pachuca II', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 39, nombre: 'Escuela Zempoala', cct: '13XXX0039', nivel: 'Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Zempoala', region: 'Pachuca II', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    // Pachuca III (6)
    { id: 40, nombre: 'Escuela Atotonilco el Grande', cct: '13XXX0040', nivel: 'Maternal', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Atotonilco el Grande', region: 'Pachuca III', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 41, nombre: 'Escuela Epazoyucan', cct: '13XXX0041', nivel: 'Preescolar', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Epazoyucan', region: 'Pachuca III', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    { id: 42, nombre: 'Escuela Huasca de Ocampo', cct: '13XXX0042', nivel: 'Primaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Huasca de Ocampo', region: 'Pachuca III', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 43, nombre: 'Escuela Mineral del Chico', cct: '13XXX0043', nivel: 'Maternal', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Mineral del Chico', region: 'Pachuca III', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 44, nombre: 'Escuela Mineral del Monte', cct: '13XXX0044', nivel: 'Media Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Mineral del Monte', region: 'Pachuca III', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 45, nombre: 'Escuela Omitlan de Juarez', cct: '13XXX0045', nivel: 'Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Omitlan de Juarez', region: 'Pachuca III', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    // Pachuca IV (4)
    { id: 46, nombre: 'Escuela Villa de Tezontepec', cct: '13XXX0046', nivel: 'Preescolar', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Villa de Tezontepec', region: 'Pachuca IV', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 47, nombre: 'Escuela Tizayuca', cct: '13XXX0047', nivel: 'Media Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tizayuca', region: 'Pachuca IV', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 48, nombre: 'Escuela Tolcayuca', cct: '13XXX0048', nivel: 'Primaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tolcayuca', region: 'Pachuca IV', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 49, nombre: 'Escuela Zapotlan de Juarez', cct: '13XXX0049', nivel: 'Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Zapotlan de Juarez', region: 'Pachuca IV', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    // Molango (10)
    { id: 50, nombre: 'Escuela Calnali', cct: '13XXX0050', nivel: 'Maternal', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Calnali', region: 'Molango', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 51, nombre: 'Escuela Eloxochitlan', cct: '13XXX0051', nivel: 'Preescolar', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Eloxochitlan', region: 'Molango', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 52, nombre: 'Escuela Juarez Hidalgo', cct: '13XXX0052', nivel: 'Primaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Juarez Hidalgo', region: 'Molango', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 53, nombre: 'Escuela Lolotla', cct: '13XXX0053', nivel: 'Secundaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Lolotla', region: 'Molango', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    { id: 54, nombre: 'Escuela Metztitlan', cct: '13XXX0054', nivel: 'Maternal', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Metztitlan', region: 'Molango', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 55, nombre: 'Escuela Molango', cct: '13XXX0055', nivel: 'Maternal', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Molango', region: 'Molango', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 56, nombre: 'Escuela Tepehuacan de Gro.', cct: '13XXX0056', nivel: 'Secundaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tepehuacan de Gro.', region: 'Molango', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 57, nombre: 'Escuela Tlanchinol', cct: '13XXX0057', nivel: 'Preescolar', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tlanchinol', region: 'Molango', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    { id: 58, nombre: 'Escuela Tlahuiltepa', cct: '13XXX0058', nivel: 'Preescolar', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tlahuiltepa', region: 'Molango', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 59, nombre: 'Escuela Xochicoatlan', cct: '13XXX0059', nivel: 'Primaria', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Xochicoatlan', region: 'Molango', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    // Actopan (7)
    { id: 60, nombre: 'Escuela Actopan', cct: '13XXX0060', nivel: 'Secundaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Actopan', region: 'Actopan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 61, nombre: 'Escuela El Arenal', cct: '13XXX0061', nivel: 'Media Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'El Arenal', region: 'Actopan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    { id: 62, nombre: 'Escuela Francisco I. Madero', cct: '13XXX0062', nivel: 'Media Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Francisco I. Madero', region: 'Actopan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 63, nombre: 'Escuela Mixquiahuala', cct: '13XXX0063', nivel: 'Media Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Mixquiahuala', region: 'Actopan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 64, nombre: 'Escuela Progreso de Obregon', cct: '13XXX0064', nivel: 'Maternal', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Progreso de Obregon', region: 'Actopan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 65, nombre: 'Escuela San Salvador', cct: '13XXX0065', nivel: 'Media Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'San Salvador', region: 'Actopan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    { id: 66, nombre: 'Escuela Santiago de Anaya', cct: '13XXX0066', nivel: 'Secundaria', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Santiago de Anaya', region: 'Actopan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    // Tenango de Doria (3)
    { id: 67, nombre: 'Escuela Huehuetla', cct: '13XXX0067', nivel: 'Primaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Huehuetla', region: 'Tenango de Doria', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 68, nombre: 'Escuela San Bartolo Tutotepec', cct: '13XXX0068', nivel: 'Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'San Bartolo Tutotepec', region: 'Tenango de Doria', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 69, nombre: 'Escuela Tenango de Doria', cct: '13XXX0069', nivel: 'Preescolar', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tenango de Doria', region: 'Tenango de Doria', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    // Jacala (4)
    { id: 70, nombre: 'Escuela Chapulhuacan', cct: '13XXX0070', nivel: 'Secundaria', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Chapulhuacan', region: 'Jacala', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 71, nombre: 'Escuela Jacala', cct: '13XXX0071', nivel: 'Media Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Jacala', region: 'Jacala', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 72, nombre: 'Escuela La Mision', cct: '13XXX0072', nivel: 'Maternal', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'La Mision', region: 'Jacala', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 73, nombre: 'Escuela Pisaflores', cct: '13XXX0073', nivel: 'Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Pisaflores', region: 'Jacala', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    // Atlapexco (4)
    { id: 74, nombre: 'Escuela Atlapexco', cct: '13XXX0074', nivel: 'Media Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Atlapexco', region: 'Atlapexco', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 75, nombre: 'Escuela Huautla', cct: '13XXX0075', nivel: 'Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Huautla', region: 'Atlapexco', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 76, nombre: 'Escuela Xochiatipan', cct: '13XXX0076', nivel: 'Preescolar', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Xochiatipan', region: 'Atlapexco', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 77, nombre: 'Escuela Yahualica', cct: '13XXX0077', nivel: 'Media Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Yahualica', region: 'Atlapexco', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    // Tlaxcoapan (4)
    { id: 78, nombre: 'Escuela Ajacuba', cct: '13XXX0078', nivel: 'Media Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Ajacuba', region: 'Tlaxcoapan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 79, nombre: 'Escuela Tetepango', cct: '13XXX0079', nivel: 'Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tetepango', region: 'Tlaxcoapan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 80, nombre: 'Escuela Tlaxcoapan', cct: '13XXX0080', nivel: 'Primaria', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tlaxcoapan', region: 'Tlaxcoapan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
    { id: 81, nombre: 'Escuela Tlahuelilpan', cct: '13XXX0081', nivel: 'Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tlahuelilpan', region: 'Tlaxcoapan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dr. Juan Pérez', status: 'green', cobertura: 50 },
    // Zacualtipan (3)
    { id: 82, nombre: 'Escuela San Agustin Metzquititlan', cct: '13XXX0082', nivel: 'Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'San Agustin Metzquititlan', region: 'Zacualtipan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Dra. María García', status: 'green', cobertura: 50 },
    { id: 83, nombre: 'Escuela Tianguistengo', cct: '13XXX0083', nivel: 'Superior', modalidad: 'General', turno: 'Matutino', tipo: 'Pública', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Tianguistengo', region: 'Zacualtipan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Mtra. Ana Torres', status: 'green', cobertura: 50 },
    { id: 84, nombre: 'Escuela Zacualtipan', cct: '13XXX0084', nivel: 'Secundaria', modalidad: 'General', turno: 'Matutino', tipo: 'Privada', direccion: 'Calle Principal s/n', colonia: 'Centro', municipio: 'Zacualtipan', region: 'Zacualtipan', alumnosH: 100, alumnosM: 100, docentesH: 5, docentesM: 8, directivos: 2, director: 'Director/a', telDirector: '7710000000', psicologo: 'Lic. Roberto Mendoza', status: 'green', cobertura: 50 },
  ],

  // Visitas
  visitas: [
    { id: 1, escuela: 'Escuela primaria Benito Juárez', escuelaId: 2, fecha: '2026-04-28', hora: '9:00', horaSalida: '12:00', turno: 'Matutino', psicologo: 'Dra. María García', poblacion: { alumnosH: 30, alumnosM: 25, docentesH: 5, docentesM: 5 }, eje: 'Bienestar Personal', taller: 'Inteligencia emocional', status: 'completada' },
    { id: 2, escuela: 'CAIC Progreso', escuelaId: 4, fecha: '2026-04-28', hora: '11:30', horaSalida: '14:00', turno: 'Matutino', psicologo: 'Dr. Juan Pérez', poblacion: { alumnosH: 20, alumnosM: 20, docentesH: 3, docentesM: 4 }, eje: 'Bienestar Social', taller: 'Empatía', status: 'completada' },
    { id: 3, escuela: 'Escuela Secundaria Miguel Hidalgo', escuelaId: 5, fecha: '2026-04-29', hora: '9:00', horaSalida: '13:00', turno: 'Matutino', psicologo: 'Mtra. Ana Torres', poblacion: { alumnosH: 50, alumnoM: 45, docentesH: 8, docentesM: 10 }, eje: 'Prevención', taller: 'Prevención de adicciones', status: 'programada' },
    { id: 4, escuela: 'CAM #1', escuelaId: 3, fecha: '2026-04-22', hora: '14:00', horaSalida: '17:00', turno: 'Vespertino', psicologo: 'Lic. Roberto Mendoza', poblacion: { alumnosH: 15, alumnosM: 12, docentesH: 2, docentesM: 3 }, eje: 'Bienestar Personal', taller: 'Autoconocimiento', status: 'completada' },
    // Huejutla
    { id: 5, escuela: 'Escuela Huazalingo', escuelaId: 1, fecha: '2026-05-10', hora: '9:00', horaSalida: '12:00', turno: 'Matutino', psicologo: 'Dr. Juan Pérez', poblacion: { alumnosH: 25, alumnosM: 20, docentesH: 4, docentesM: 4 }, eje: 'Bienestar Personal', taller: 'Inteligencia emocional', status: 'programada' },
    // Ixmiquilpan
    { id: 6, escuela: 'Escuela Alfajayucan', escuelaId: 5, fecha: '2026-05-11', hora: '9:00', horaSalida: '13:00', turno: 'Matutino', psicologo: 'Dra. María García', poblacion: { alumnosH: 30, alumnosM: 28, docentesH: 5, docentesM: 6 }, eje: 'Bienestar Social', taller: 'Empatía', status: 'programada' },
    // Tula
    { id: 7, escuela: 'Escuela Atitalaquia', escuelaId: 17, fecha: '2026-05-12', hora: '10:00', horaSalida: '14:00', turno: 'Matutino', psicologo: 'Mtra. Ana Torres', poblacion: { alumnosH: 22, alumnosM: 18, docentesH: 4, docentesM: 5 }, eje: 'Prevención', taller: 'Prevención de adicciones', status: 'programada' },
    // Tulancingo
    { id: 8, escuela: 'Escuela Agua Blanca', escuelaId: 23, fecha: '2026-05-13', hora: '8:00', horaSalida: '12:00', turno: 'Matutino', psicologo: 'Lic. Roberto Mendoza', poblacion: { alumnosH: 20, alumnosM: 22, docentesH: 3, docentesM: 4 }, eje: 'Bienestar Personal', taller: 'Autoconocimiento', status: 'programada' },
    // Pachuca II
    { id: 9, escuela: 'Escuela Almoloya', escuelaId: 34, fecha: '2026-05-14', hora: '9:00', horaSalida: '13:00', turno: 'Matutino', psicologo: 'Dr. Juan Pérez', poblacion: { alumnosH: 28, alumnosM: 25, docentesH: 5, docentesM: 5 }, eje: 'Bienestar Social', taller: 'Comunicación asertiva', status: 'programada' },
    // Pachuca III
    { id: 10, escuela: 'Escuela Atotonilco el Grande', escuelaId: 40, fecha: '2026-05-15', hora: '10:00', horaSalida: '14:00', turno: 'Matutino', psicologo: 'Dra. María García', poblacion: { alumnosH: 24, alumnosM: 20, docentesH: 4, docentesM: 5 }, eje: 'Prevención', taller: 'Prevención de violencia', status: 'programada' },
    // Pachuca IV
    { id: 11, escuela: 'Escuela Villa de Tezontepec', escuelaId: 46, fecha: '2026-05-16', hora: '9:00', horaSalida: '12:00', turno: 'Matutino', psicologo: 'Mtra. Ana Torres', poblacion: { alumnosH: 18, alumnosM: 22, docentesH: 3, docentesM: 4 }, eje: 'Bienestar Personal', taller: 'Manejo de emociones', status: 'programada' },
    // Molango
    { id: 12, escuela: 'Escuela Calnali', escuelaId: 50, fecha: '2026-05-17', hora: '8:00', horaSalida: '12:00', turno: 'Matutino', psicologo: 'Lic. Roberto Mendoza', poblacion: { alumnosH: 20, alumnosM: 18, docentesH: 3, docentesM: 3 }, eje: 'Bienestar Social', taller: 'Trabajo en equipo', status: 'programada' },
    // Actopan
    { id: 13, escuela: 'Escuela Actopan', escuelaId: 60, fecha: '2026-05-18', hora: '9:00', horaSalida: '13:00', turno: 'Matutino', psicologo: 'Dr. Juan Pérez', poblacion: { alumnosH: 30, alumnosM: 28, docentesH: 5, docentesM: 6 }, eje: 'Prevención', taller: 'Prevención de adicciones', status: 'programada' },
    // Tenango de Doria
    { id: 14, escuela: 'Escuela Huehuetla', escuelaId: 67, fecha: '2026-05-19', hora: '10:00', horaSalida: '14:00', turno: 'Matutino', psicologo: 'Dra. María García', poblacion: { alumnosH: 22, alumnosM: 20, docentesH: 4, docentesM: 5 }, eje: 'Bienestar Personal', taller: 'Inteligencia emocional', status: 'programada' },
    // Jacala
    { id: 15, escuela: 'Escuela Chapulhuacan', escuelaId: 70, fecha: '2026-05-20', hora: '9:00', horaSalida: '12:00', turno: 'Matutino', psicologo: 'Mtra. Ana Torres', poblacion: { alumnosH: 20, alumnosM: 18, docentesH: 3, docentesM: 4 }, eje: 'Bienestar Social', taller: 'Empatía', status: 'programada' }
  ],

  // Cursos
  cursos: [
    { id: 1, titulo: 'Inteligencia Emocional', descripcion: 'Aprende a identificar y gestionar emociones', icono: '🧠', duracion: '2 horas', modulos: 5, completados: 3, categoria: 'Bienestar Personal' },
    { id: 2, titulo: 'Manejo de Conflictos', descripcion: 'Estrategias para-mediar conflictos en el aula', icono: '🤝', duracion: '1.5 horas', modulos: 4, completados: 2, categoria: 'Bienestar Social' },
    { id: 3, titulo: 'Comunicación Asertiva', descripcion: 'Mejora tu comunicación con estudiantes', icono: '🗣️', duracion: '1 hora', modulos: 3, completados: 3, categoria: 'Bienestar Social' },
    { id: 4, titulo: 'Resiliencia', descripcion: 'Fortalece tu capacidad de adaptación', icono: '💪', duracion: '2 horas', modulos: 4, completados: 0, categoria: 'Bienestar Personal' },
    { id: 5, titulo: 'Prevención de Acoso', descripcion: 'Identifica y previene el acoso escolar', icono: '🛡️', duracion: '3 horas', modulos: 5, completados: 0, categoria: 'Prevención' }
  ],

  // Logros
  logros: [
    { id: 1, nombre: 'Primer Curso', icono: '🏆', fecha: '2026-03-10' },
    { id: 2, nombre: 'Racha 7 días', icono: '🔥', fecha: '2026-03-15' },
    { id: 3, nombre: '10 Visitas', icono: '⭐', fecha: '2026-03-20' },
    { id: 4, nombre: 'Certificada', icono: '🎓', fecha: '2026-03-25' }
  ],

  // Chats
  chats: [
    { id: 1, nombre: 'Dr. Juan Pérez', avatar: 'JP', ultimoMensaje: '¿Cómo va la visita en Benito Juárez?', hora: '10:15', online: true, noLeidos: 0 },
    { id: 2, nombre: 'Mtra. María López', avatar: 'ML', ultimoMensaje: 'El taller fue muy exitoso 🎉', hora: 'Ayer', online: true, noLeidos: 0 },
    { id: 3, nombre: 'Equipo Pachuca I', avatar: 'EQ', ultimoMensaje: 'Reunión a las 3pm', hora: '9:30', online: true, noLeidos: 3, tipo: 'grupo' },
    { id: 4, nombre: 'Admin Contabilidad', avatar: 'AC', ultimoMensaje: 'El reporte está listo', hora: 'Lun', online: false, noLeidos: 0 }
  ],

  // Mensajes
  mensajes: [
    { id: 1, chatId: 1, texto: 'Hola! ¿Cómo va la visita en Benito Juárez?', tiempo: '10:10', tipo: 'received' },
    { id: 2, chatId: 1, texto: 'Muy bien! Ya estamos en la segunda ronda de talleres', tiempo: '10:12', tipo: 'sent' },
    { id: 3, chatId: 1, texto: 'Los directivos están muy contents', tiempo: '10:13', tipo: 'sent' },
    { id: 4, chatId: 1, texto: 'Excelente! Cuéntame cuando termine la visita', tiempo: '10:15', tipo: 'received' }
  ],

  // Archivos — removed in restructuring (moved to sep:fs in localStorage)
  archivos: []
};

// ===========================================
// Helper Functions
// ===========================================

function getById(array, id) {
  return array.find(item => item.id === id);
}

function filterBy(array, key, value) {
  return array.filter(item => item[key] === value);
}

function searchBy(array, query) {
  const q = query.toLowerCase();
  return array.filter(item => 
    item.nombre.toLowerCase().includes(q) ||
    (item.cct && item.cct.toLowerCase().includes(q))
  );
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
}

function formatTime(time) {
  return time;
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

// ===========================================
// File System persistence (sep:fs in localStorage via syncStore)
// ===========================================

function getFS() {
  return syncStore.get('fs') || {};
}

function setFS(data) {
  syncStore.set('fs', data);
}

// ===========================================
// Navigation
// ===========================================

function navigateTo(page) {
  window.location.href = page;
}

function goBack() {
  window.history.back();
}

// ===========================================
// Session Management
// ===========================================

let session = {
  usuario: null,
  loggedIn: false
};

function login(userId) {
  const user = getById(DB.usuarios, userId);
  if (user) {
    session.usuario = user;
    session.loggedIn = true;
    localStorage.setItem('sep_session', JSON.stringify(session));
    return true;
  }
  return false;
}

function logout() {
  session = { usuario: null, loggedIn: false };
  localStorage.removeItem('sep_session');
  navigateTo('login.html');
}

function checkSession() {
  const stored = localStorage.getItem('sep_session');
  if (stored) {
    session = JSON.parse(stored);
    return session.loggedIn;
  }
  return false;
}

// ===========================================
// Export
// ===========================================

window.DB = DB;
window.utils = {
  getById,
  filterBy,
  searchBy,
  formatDate,
  formatTime,
  getInitials,
  generateId,
  navigateTo,
  goBack,
  login,
  logout,
  checkSession,
  getFS,
  setFS
};
