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
        localStorage.setItem('user', JSON.stringify(data)); // guarda la sesión también
        window.location.href = '../../pages/pagina-gestion-usuario/gestion-usuario.html';
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }
});
