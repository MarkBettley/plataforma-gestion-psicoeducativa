// ===========================================
// Dashboard JS - simple
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
  // Verificar sesión
  if (sessionStorage.getItem('sep_logged') !== 'true') {
    window.location.href = 'login.html';
    return;
  }
  
  initDock();
  startClock();
});

function initDock() {
  const dockIcons = document.querySelectorAll('.dock__icon');
  
  dockIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      const href = icon.dataset.href;
      if (href) {
        window.location.href = href;
      }
    });
  });
}

function startClock() {
  const clockEl = document.getElementById('clock');
  const widgetTime = document.getElementById('widget-time');
  const widgetDate = document.getElementById('widget-date');
  
  function update() {
    const now = new Date();
    const time = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
    
    if (clockEl) clockEl.textContent = time;
    if (widgetTime) widgetTime.textContent = time;
    if (widgetDate) widgetDate.textContent = date.charAt(0).toUpperCase() + date.slice(1) + ' ' + now.getDate();
  }
  
  update();
  setInterval(update, 1000);
}