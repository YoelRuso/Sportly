// ==========================
// TOGGLE CONTRASEÑA
// ==========================
const eyeOpen = `<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>`;
const eyeClosed = `<path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238z"/><path d="m13.646 14.354-12-12 .708-.708 12 12z"/>`;

document.querySelectorAll('.toggle-password').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = btn.closest('.password-wrapper').querySelector('input');
    const icon = btn.querySelector('.eye-icon');
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    icon.innerHTML = isHidden ? eyeClosed : eyeOpen;
    btn.setAttribute('aria-label', isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });
});


// ==========================
// REGEX
// ==========================
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{7,}$/;


// ==========================
// ELEMENTOS
// ==========================
const form = document.querySelector("form");

const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmError = document.getElementById("confirmError");


// ==========================
// MANEJO DE ERRORES
// ==========================
function showError(element, message) {
  element.textContent = message;
}

function clearError(element) {
  element.textContent = "";
}


// ==========================
// ESTILO DE INPUTS
// ==========================
function setValid(input) {
  input.classList.remove("invalid");
  input.classList.add("valid");
}

function setInvalid(input) {
  input.classList.remove("valid");
  input.classList.add("invalid");
}


// ==========================
// VALIDACIÓN EN TIEMPO REAL
// ==========================
email.addEventListener("input", () => {
  if (email.value === "") {
    email.classList.remove("invalid", "valid");
  } else if (emailRegex.test(email.value)) {
    clearError(emailError);
    setValid(email);
  } else {
    showError(emailError, "Correo inválido");
    setInvalid(email);
  }
});

password.addEventListener("input", () => {
  if (passwordRegex.test(password.value)) {
    clearError(passwordError);
    setValid(password);
  } else {
    showError(
      passwordError,
      "Mín. 7 caracteres, mayúscula, minúscula, número y símbolo"
    );
    setInvalid(password);
  }
});

confirmPassword.addEventListener("input", () => {
  if (password.value === confirmPassword.value) {
    clearError(confirmError);
    setValid(confirmPassword);
  } else {
    showError(confirmError, "Las contraseñas no coinciden");
  }
});


// ==========================
// VALIDACIÓN AL ENVIAR
// ==========================
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  let valid = true;

  // Validar email
  if (!emailRegex.test(email.value)) {
    showError(emailError, 'Correo electrónico inválido');
    setInvalid(email);
    valid = false;
  } else {
    clearError(emailError);
    setValid(email);
  }

  // Validar contraseña
  if (!passwordRegex.test(password.value)) {
    showError(
      passwordError,
      'Mín. 7 caracteres, mayúscula, minúscula, número y símbolo',
    );
    setInvalid(password);
    valid = false;
  } else {
    clearError(passwordError);
    setValid(password);
  }

  // Confirmar contraseña
  if (password.value !== confirmPassword.value) {
    showError(confirmError, 'Las contraseñas no coinciden');
    setInvalid(confirmPassword);
    valid = false;
  } else {
    clearError(confirmError);
    setValid(confirmPassword);
  }

  // probar si email ya existe
  if (valid) {
    try {
      const res = await fetch(
        `http://localhost:3000/usuarios?email=${encodeURIComponent(email.value)}`,
      );
      const data = await res.json();

      if (data.length > 0) {
        showError(emailError, 'Correo electrónico ya existe');
        setInvalid(email);
        valid = false;
        console.log('Correo electrónico ya existe:', data);
      } else {
        clearError(emailError);
        setValid(email);
      }
    } catch (err) {
      console.error(err);
      return;
    }
  }

  // Todo correcto
  if (valid) {
    fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Success:', data);
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = '../../pages/pagina-gestion-usuario/gestion-usuario.html';
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }
});