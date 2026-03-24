const userID = document.getElementById('userID');
const email = document.getElementById('email');

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
    const partidosFavoritosOfUser = await res.json();

    if (partidosFavoritosOfUser.length > 0) {
      fetchPartidosFavoritosFromDeporteAndAddToPage(partidosFavoritosOfUser);
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchPartidosFavoritosFromDeporteAndAddToPage(
  partidosFavoritosOfUser,
) {
  for (const partidoFavorito of partidosFavoritosOfUser) {
    try {
      // Run all fetches in parallel
      const res = await fetch(`http://localhost:3000/soccer`);

      // Parse all responses in parallel
      const allData = await res.json();
      const filteredData = allData.filter(
        (item) => String(item.idEvent) === String(partidoFavorito.idEvent),
      );
      console.log(filteredData);
      if (filteredData.length > 0) {
        addPartidosFavoritosToPage(filteredData);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

function addPartidosFavoritosToPage(data) {
  const { strEvent, dateEvent, strVideo } = data[0];

  const match_list = document.getElementById('match-list');

  match_list.innerHTML += `
    <a class="match-item" href="${strVideo}" target="_blank">
      <span>${strEvent}</span>
      <span class="date">${formatDate(dateEvent)}</span>
    </a>
  `;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

