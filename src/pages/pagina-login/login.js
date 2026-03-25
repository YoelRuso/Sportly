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

  const identity = email.value.trim();
  const passInput = password.value;

  if (!identity || !passInput) {
    showMessage('Completa correo y contrasena.');
    return;
  }

  try {
    const users = await fetchUserCandidates(identity);

    if (!users.length) {
      showMessage('Usuario no encontrado.');
      return;
    }

    const matchedUser = users.find((u) => getUserPassword(u) === passInput);
    if (!matchedUser) {
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
async function fetchUserCandidates(identityValue) {
  const byEmailUrl = `http://localhost:3000/usuarios?email=${encodeURIComponent(identityValue)}`;
  const emailRes = await fetch(byEmailUrl);
  if (!emailRes.ok) throw new Error(`HTTP ${emailRes.status}`);

  const byEmail = await emailRes.json();
  if (byEmail.length > 0) return byEmail;

  // Compatibilidad con registros antiguos que guardan "user" en vez de "email".
  const byUserUrl = `http://localhost:3000/usuarios?user=${encodeURIComponent(identityValue)}`;
  const userRes = await fetch(byUserUrl);
  if (!userRes.ok) throw new Error(`HTTP ${userRes.status}`);
  return userRes.json();
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
