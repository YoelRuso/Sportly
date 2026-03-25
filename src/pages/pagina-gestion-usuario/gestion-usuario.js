/**
 * gestion-usuario.js — Sportly User Profile Module
 *
 * Reads the active user from localStorage, loads their favorites
 * from json-server and renders them. Supports all sport endpoints
 * and allows removing favorites directly from this page.
 */

const JSON_SERVER_BASE_USER = 'http://localhost:3000';

// Todos los endpoints donde puede estar un evento
const ALL_SPORT_ENDPOINTS = ['soccer', 'basket', 'tenis', 'f1'];

// ─── Init ────────────────────────────────────────────────────────────
async function initUsuario() {
  const user = JSON.parse(localStorage.getItem('user'));

  validateUser(user);
  displayUser(user);
  await fetchPartidosFavoritos(user);
}

// ─── Auth helpers ─────────────────────────────────────────────────────
function validateUser(user) {
  if (user) {
    console.log('Logged in as:', user);
  } else {
    console.log('Not logged in');
  }
}

function displayUser(user) {
  const userIDEl = document.getElementById('userID');
  const emailEl = document.getElementById('email');
  if (userIDEl) userIDEl.textContent = user?.id ?? '';
  if (emailEl) emailEl.textContent = user?.email ?? '';
}

// ─── Fetch favoritos del usuario ──────────────────────────────────────
async function fetchPartidosFavoritos(user) {
  const matchList = document.getElementById('match-list');

  if (!user) {
    renderEmptyState(matchList, 'Inicia sesión para ver tus favoritos.');
    return;
  }

  renderLoadingState(matchList);

  try {
    const res = await fetch(
      `${JSON_SERVER_BASE_USER}/partidas-favoritas?userID=${encodeURIComponent(user.id)}`,
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const partidosFavoritosOfUser = await res.json();

    matchList.innerHTML = '';

    if (partidosFavoritosOfUser.length === 0) {
      renderEmptyState(matchList);
      return;
    }

    // Busca los datos de cada favorito en todos los endpoints en paralelo
    await Promise.all(
      partidosFavoritosOfUser.map((fav) =>
        fetchEventAndRender(fav, matchList, user.id),
      ),
    );
  } catch (err) {
    console.error('Error fetching favorites:', err);
    renderEmptyState(matchList, 'Error al cargar favoritos.');
  }
}

// ─── Busca un evento en todos los endpoints ───────────────────────────
async function fetchEventAndRender(fav, container, userID) {
  for (const sport of ALL_SPORT_ENDPOINTS) {
    try {
      const res = await fetch(`${JSON_SERVER_BASE_USER}/${sport}`);
      if (!res.ok) continue;
      const allData = await res.json();
      const match = allData.find(
        (item) => String(item.idEvent) === String(fav.idEvent),
      );
      if (match) {
        addPartidosFavoritosToPage(match, fav, container, userID);
        return; // encontrado, no seguir buscando
      }
    } catch (err) {
      console.error(`Error searching in ${sport}:`, err);
    }
  }
  console.warn(`Event idEvent=${fav.idEvent} not found in any sport endpoint`);
}

// ─── Eliminar favorito ────────────────────────────────────────────────
async function removeFavorite(recordId, itemEl) {
  try {
    const btn = itemEl.querySelector('.btn-remove-fav');
    if (btn) { btn.disabled = true; btn.textContent = '…'; }

    await fetch(`${JSON_SERVER_BASE_USER}/partidas-favoritas/${recordId}`, {
      method: 'DELETE',
    });

    itemEl.classList.add('removing');
    setTimeout(() => itemEl.remove(), 300);

    // Si no quedan items, muestra el estado vacío
    const matchList = document.getElementById('match-list');
    if (matchList && matchList.querySelectorAll('.match-item').length === 0) {
      setTimeout(() => renderEmptyState(matchList), 350);
    }
  } catch (err) {
    console.error('Error removing favorite:', err);
  }
}

// ─── Render ───────────────────────────────────────────────────────────
function addPartidosFavoritosToPage(event, fav, container, userID) {
  const title = event.strHomeTeam && event.strAwayTeam
    ? `${event.strHomeTeam} vs ${event.strAwayTeam}`
    : event.strEvent || 'Evento deportivo';

  const date = formatDate(event.dateEvent);
  const time = formatTime(event);
  const league = event.strLeague || '';
  const dateText = [date, time ? `${time}h` : '', league].filter(Boolean).join(' · ');

  const item = document.createElement('div');
  item.className = 'match-item';

  item.innerHTML = `
    <span class="match-title">${title}</span>
    <span class="date">${dateText}</span>
    <button class="btn-remove-fav" aria-label="Eliminar de favoritos" title="Quitar de favoritos">✕</button>
  `;

  item.querySelector('.btn-remove-fav').addEventListener('click', (e) => {
    e.stopPropagation();
    removeFavorite(fav.id, item);
  });

  container.appendChild(item);
}

function renderEmptyState(container, msg) {
  container.innerHTML = `
    <div class="empty-favorites">
      <p>⭐ ${msg || 'Aún no tienes partidos favoritos.'}</p>
      ${!msg ? '<p>Añádelos desde la página de inicio.</p>' : ''}
    </div>
  `;
}

function renderLoadingState(container) {
  container.innerHTML = `<p class="loading-favorites">Cargando favoritos…</p>`;
}

// ─── Date / time utils ────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return 'Fecha por confirmar';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(event) {
  const t = event?.strTimeLocal || event?.strTime || '';
  if (!t) return '';
  const hhmm = String(t).slice(0, 5);
  return /^\d{2}:\d{2}$/.test(hhmm) ? hhmm : String(t);
}
