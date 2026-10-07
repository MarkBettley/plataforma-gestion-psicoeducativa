// ===========================================
// Login JS - Autenticación (Simple)
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
  init();
});

function init() {
  const loginScreen = document.getElementById('login-screen');
  const passwordInput = document.getElementById('password-input');
  const loginBtn = document.getElementById('login-btn');
  const usernameDisplay = document.getElementById('username-display');
  const avatarImg = document.getElementById('avatar-img');
  
  // Si ya está logueado, ir al dashboard
  if (utils && utils.checkSession && utils.checkSession()) {
    window.location.href = 'dashboard.html';
    return;
  }
  
  // Cargar usuario demo
  if (DB && DB.usuarios) {
    const demoUser = DB.usuarios[0];
    if (usernameDisplay) usernameDisplay.textContent = demoUser.nombre;
    if (avatarImg) {
      avatarImg.alt = demoUser.nombre;
      avatarImg.title = demoUser.nombre;
    }
  }
  
  // Event listeners
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
  }
  
  if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleLogin();
    });
    
    passwordInput.addEventListener('input', () => {
      passwordInput.classList.remove('login__error');
    });
  }
}

function handleLogin() {
  const passwordInput = document.getElementById('password-input');
  const container = document.querySelector('.login__container');
  const password = passwordInput.value.trim();
  
  if (!password) {
    showError(container, passwordInput);
    return;
  }
  
  // Aceptar cualquier contraseña para demo
  // Guardar sesión simple
  sessionStorage.setItem('sep_usuario', 'Demo Usuario');
  sessionStorage.setItem('sep_logged', 'true');
  
  // Success
  if (container) {
    container.classList.add('login--success');
  }
  
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 500);
}

function showError(container, passwordInput) {
  if (container) {
    container.classList.add('login__error');
    setTimeout(() => {
      container.classList.remove('login__error');
    }, 500);
  }
  if (passwordInput) {
    passwordInput.value = '';
    passwordInput.focus();
  }
}