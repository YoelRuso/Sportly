// ==========================
// ELEMENTOS
// ==========================
const form = document.querySelector('form');

const email = document.getElementById('email');
const password = document.getElementById('password');

// ==========================
// EVENTO PRINCIPAL
// ==========================
form.addEventListener('submit', handleSubmit);

// ==========================
// MANEJADORES
// ==========================
async function handleSubmit(e) {
  e.preventDefault();

  try {
    const data = await fetchUserByEmail(email.value);

    if (userExists(data)) {
      handlePasswordValidation(data, password.value);
    } else {
      logEmailError();
    }
  } catch (err) {
    console.error(err);
    console.error(err);
  }
}

// ==========================
// FUNCIONES DE NEGOCIO
// ==========================
async function fetchUserByEmail(emailValue) {
  const res = await fetch(
    `http://localhost:3000/usuarios?email=${encodeURIComponent(emailValue)}`,
  );
  return res.json();
}

function userExists(data) {
  return data.length > 0;
}

function handlePasswordValidation(data, passwordValue) {
  if (isPasswordCorrect(data, passwordValue)) {
    handleLoginSuccess(data[0]);
  } else {
    logPasswordError();
  }
}

function isPasswordCorrect(data, passwordValue) {
  return data[0].password === passwordValue;
}

// ==========================
// ACCIONES / EFECTOS
// ==========================
function handleLoginSuccess(user) {
  console.log('Logged in with:' + JSON.stringify(user));
  localStorage.setItem('user', JSON.stringify(user));
}

function logPasswordError() {
  console.log('Correo electrónico y contrazeña no son correcto (password)');
}

function logEmailError() {
  console.log('Correo electrónico y contrazeña no son correcto (email)');
}
