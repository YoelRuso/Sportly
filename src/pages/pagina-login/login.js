/**
 * login.js – Handles login and registration with HTML5 + JS validation.
 * Relies on app.js being loaded first (for validateCredentials, loginUser, etc.)
 */

const REDIRECT_DELAY_MS = 1500;

/* ─── Tab switching ─────────────────────────────────────────────── */

function showTab(tab) {
  document.getElementById('panel-login').style.display    = tab === 'login'    ? '' : 'none';
  document.getElementById('panel-register').style.display = tab === 'register' ? '' : 'none';
  document.getElementById('tab-login').classList.toggle('active',    tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
}

/* ─── Field validation helpers ──────────────────────────────────── */

function showFieldError(input, msg) {
  input.classList.add('invalid');
  const hint = input.nextElementSibling;
  if (hint && hint.classList.contains('field-hint')) {
    hint.textContent = msg;
    hint.style.color = '#ff4466';
  }
}

function clearFieldError(input) {
  input.classList.remove('invalid');
  const hint = input.nextElementSibling;
  if (hint && hint.classList.contains('field-hint')) {
    hint.style.color = '';
  }
}

function validateField(input) {
  clearFieldError(input);
  if (!input.checkValidity()) {
    showFieldError(input, input.validationMessage);
    return false;
  }
  return true;
}

/* ─── Live validation on blur ───────────────────────────────────── */

function attachLiveValidation(form) {
  form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(input);
    });
  });
}

/* ─── Login form ────────────────────────────────────────────────── */

async function handleLogin(e) {
  e.preventDefault();

  const userInput = document.getElementById('loginUser');
  const passInput = document.getElementById('loginPass');
  const errorBox  = document.getElementById('login-error');

  // HTML5 validation first
  let valid = true;
  [userInput, passInput].forEach((el) => { if (!validateField(el)) valid = false; });
  if (!valid) return;

  errorBox.style.display = 'none';

  const user = await validateCredentials(userInput.value.trim(), passInput.value);

  if (user) {
    loginUser(user);
    // Redirect to home
    window.location.href = '/src/pages/pagina-inicio/inicio.html';
  } else {
    errorBox.textContent = 'Usuario o contraseña incorrectos.';
    errorBox.style.display = 'block';
    passInput.value = '';
    passInput.focus();
  }
}

/* ─── Register form ─────────────────────────────────────────────── */

function handleRegister(e) {
  e.preventDefault();

  const userInput    = document.getElementById('regUser');
  const emailInput   = document.getElementById('regEmail');
  const passInput    = document.getElementById('regPass');
  const confirmInput = document.getElementById('regPassConfirm');
  const errorBox     = document.getElementById('register-error');
  const successBox   = document.getElementById('register-success');

  errorBox.style.display   = 'none';
  successBox.style.display = 'none';

  // HTML5 validation
  let valid = true;
  [userInput, emailInput, passInput, confirmInput].forEach((el) => {
    if (!validateField(el)) valid = false;
  });
  if (!valid) return;

  // Passwords must match
  if (passInput.value !== confirmInput.value) {
    showFieldError(confirmInput, 'Las contraseñas no coinciden.');
    return;
  }

  const ok = registerLocalUser(
    userInput.value.trim(),
    emailInput.value.trim(),
    passInput.value
  );

  if (ok) {
    successBox.textContent = '¡Cuenta creada! Ya puedes iniciar sesión.';
    successBox.style.display = 'block';
    document.getElementById('registerForm').reset();
    setTimeout(() => showTab('login'), REDIRECT_DELAY_MS);
  } else {
    errorBox.textContent = 'El usuario o email ya están registrados.';
    errorBox.style.display = 'block';
  }
}

/* ─── Init ──────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, go home
  if (isLoggedIn()) {
    window.location.href = '/src/pages/pagina-inicio/inicio.html';
    return;
  }

  const loginForm    = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    attachLiveValidation(loginForm);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
    attachLiveValidation(registerForm);
  }
});
