// ==========================
// ELEMENTOS
// ==========================
const form = document.querySelector("form");

const email = document.getElementById("email");
const password = document.getElementById("password");

// ==========================
// VALIDACIÓN AL ENVIAR
// ==========================
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  try {
    const res = await fetch(
      `http://localhost:3000/usuarios?email=${encodeURIComponent(email.value)}`,
    );
    const data = await res.json();

    if (data.length > 0) {
      if (sendPasswordEqualToDBPassword(data, password.value)) {
        console.log('Logged in with:' + JSON.stringify(data[0]));
        localStorage.setItem('user', JSON.stringify(data[0]));
      } else {
        console.log(
          'Correo electrónico y contrazeña no son correcto (password)',
        );
      }
    } else {
      console.log('Correo electrónico y contrazeña no son correcto (email)');
    }
  } catch (err) {
    console.error(err);
  }
});

function sendPasswordEqualToDBPassword(data, password) {
  return data[0].password === password;
}