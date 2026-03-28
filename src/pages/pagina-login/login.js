// ==========================
// ELEMENTOS
// ==========================
const form = document.querySelector('form');
const email = document.getElementById('email');
const password = document.getElementById('password');

const errorBox = document.createElement('p');
errorBox.style.color = '#ff6b6b';
errorBox.style.marginTop = '10px';
errorBox.style.textAlign = 'center';
errorBox.style.minHeight = '20px';
form?.appendChild(errorBox);

// ==========================
// TOGGLE CONTRASEÑA
// ==========================
const toggleBtn = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');

const eyeOpen = `<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>`;
const eyeClosed = `<path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238z"/><path d="m13.646 14.354-12-12 .708-.708 12 12z"/>`;

toggleBtn?.addEventListener('click', () => {
  const isHidden = password.type === 'password';
  password.type = isHidden ? 'text' : 'password';
  eyeIcon.innerHTML = isHidden ? eyeClosed : eyeOpen;
  toggleBtn.setAttribute('aria-label', isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
});

// ==========================
// EVENTO PRINCIPAL
// ==========================
form?.addEventListener('submit', handleSubmit);

// ==========================
// MANEJADORES
// ==========================
async function handleSubmit(e) {
  e.preventDefault();
  clearMessage();

  const identity = normalizeIdentity(email.value);
  const passInput = password.value;

  if (!identity || !passInput) {
    showMessage('Completa correo y contrasena.');
    return;
  }

  try {
    const users = await fetchUsers();
    const matchedUser = users.find((u) => matchesIdentity(u, identity));

    if (!matchedUser) {
      showMessage('Usuario no encontrado.');
      return;
    }

    if (getUserPassword(matchedUser) !== passInput) {
      showMessage('Contrasena incorrecta.');
      return;
    }

    handleLoginSuccess(matchedUser);
  } catch (err) {
    console.error(err);
    showMessage('No se pudo iniciar sesion. Verifica json-server en puerto 3000.');
  }
}

// ==========================
// FUNCIONES DE NEGOCIO
// ==========================
async function fetchUsers() {
  const response = await fetch('http://localhost:3000/usuarios');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function normalizeIdentity(value) {
  return String(value ?? '').trim().toLowerCase();
}

function matchesIdentity(user, identityValue) {
  const emailValue = normalizeIdentity(user?.email);
  const userValue = normalizeIdentity(user?.user);
  return identityValue === emailValue || identityValue === userValue;
}

function getUserPassword(user) {
  return user?.password ?? user?.pass ?? '';
}

// ==========================
// ACCIONES / EFECTOS
// ==========================
function handleLoginSuccess(user) {
  localStorage.setItem('user', JSON.stringify(user));
  window.location.href = '../../pages/pagina-gestion-usuario/gestion-usuario.html';
}

function showMessage(message) {
  if (errorBox) errorBox.textContent = message;
}

function clearMessage() {
  if (errorBox) errorBox.textContent = '';
}