const userID = document.getElementById("userID");
const email = document.getElementById("email");


async function initUsuario() {
  const user = JSON.parse(localStorage.getItem('user'));

  validateUser(user);
  displayUser(user);
  await fetchPartidosFavoritos(user);
}

function validateUser(user) {
  if (user) {
    console.log('Logged in as:', user);
  } else {
    console.log('Not logged in');
  }
}

function displayUser(user) {
  userID.innerHTML = user.id;
  email.innerHTML = user.email;
}

async function fetchPartidosFavoritos(user) {
  try {
    const res = await fetch(
      `http://localhost:3000/partidas-favoritas?userID=${encodeURIComponent(user.id)}`,
    );
    const data = await res.json();

    if (data.length > 0) {
      addPartidosFavoritosToPage(data);
    }
  } catch (err) {
    console.error(err);
  }
}

function addPartidosFavoritosToPage(partidosFavoritos) {
  console.log(partidosFavoritos);
}
