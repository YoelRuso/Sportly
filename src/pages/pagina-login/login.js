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
