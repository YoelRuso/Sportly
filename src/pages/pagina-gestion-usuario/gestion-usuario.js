/**
 * gestion-usuario.js — Sportly User Profile Module
 *
 * Lee el usuario activo desde localStorage, carga sus favoritos
 * desde json-server y los renderiza. Soporta todos los endpoints
 * de deporte y permite eliminar favoritos directamente desde esta página.
 */

const JSON_SERVER_BASE_USER = 'http://localhost:3000';
const ALL_SPORT_ENDPOINTS = ['soccer', 'basket', 'tenis', 'f1'];

// ─── Init ────────────────────────────────────────────────────────────
async function initUsuario() {
  const user = JSON.parse(localStorage.getItem('user'));
  validateUser(user);
  displayUser(user);
  await cargarFavoritos(user);
}

// ─── Auth helpers ─────────────────────────────────────────────────────
function validateUser(user) {
  console.log(user ? `Logged in as: ${user.id}` : 'Not logged in');
}

function displayUser(user) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val ?? '';
  };
  set('userID', user?.id);
  set('email', user?.email);
}

// ─── Favoritos ────────────────────────────────────────────────────────
async function cargarFavoritos(user) {
  const matchList = document.getElementById('match-list');

  if (!user) {
    renderEmptyState(matchList, 'Inicia sesión para ver tus favoritos.');
    return;
  }

  renderLoadingState(matchList);

  const favoritos = await fetchFavoritosDeUsuario(user.id);
  if (!favoritos) {
    renderEmptyState(matchList, 'Error al cargar favoritos.');
    return;
  }

  matchList.innerHTML = '';

  if (favoritos.length === 0) {
    renderEmptyState(matchList);
    return;
  }

  await Promise.all(
    favoritos.map((fav) => buscarYRenderizarEvento(fav, matchList, user.id)),
  );
}

async function fetchFavoritosDeUsuario(userID) {
  try {
    const res = await fetch(
      `${JSON_SERVER_BASE_USER}/partidas-favoritas?userID=${encodeURIComponent(userID)}`,
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching favorites:', err);
    return null;
  }
}

// ─── Búsqueda de eventos ──────────────────────────────────────────────
async function buscarYRenderizarEvento(fav, container, userID) {
  const evento = await buscarEventoEnEndpoints(fav.idEvent);

  if (evento) {
    renderizarFavorito(evento, fav, container);
  } else {
    console.warn(`Event idEvent=${fav.idEvent} not found in any sport endpoint`);
  }
}

async function buscarEventoEnEndpoints(idEvent) {
  for (const sport of ALL_SPORT_ENDPOINTS) {
    const evento = await buscarEventoEnEndpoint(sport, idEvent);
    if (evento) return evento;
  }
  return null;
}

async function buscarEventoEnEndpoint(sport, idEvent) {
  try {
    const res = await fetch(`${JSON_SERVER_BASE_USER}/${sport}`);
    if (!res.ok) return null;
    const allData = await res.json();
    return allData.find((item) => String(item.idEvent) === String(idEvent)) ?? null;
  } catch (err) {
    console.error(`Error searching in ${sport}:`, err);
    return null;
  }
}

// ─── Eliminar favorito ────────────────────────────────────────────────
async function eliminarFavorito(recordId, itemEl) {
  deshabilitarBotonEliminar(itemEl);

  try {
    await fetch(`${JSON_SERVER_BASE_USER}/partidas-favoritas/${recordId}`, {
      method: 'DELETE',
    });
    animarYEliminarItem(itemEl);
  } catch (err) {
    console.error('Error removing favorite:', err);
  }
}

function deshabilitarBotonEliminar(itemEl) {
  const btn = itemEl.querySelector('.btn-remove-fav');
  if (btn) { btn.disabled = true; btn.textContent = '…'; }
}

function animarYEliminarItem(itemEl) {
  itemEl.classList.add('removing');
  setTimeout(() => {
    itemEl.remove();
    mostrarVacioSiSinItems();
  }, 300);
}

function mostrarVacioSiSinItems() {
  const matchList = document.getElementById('match-list');
  const hayItems = matchList?.querySelectorAll('.match-item').length > 0;
  if (matchList && !hayItems) renderEmptyState(matchList);
}

// ─── Render ───────────────────────────────────────────────────────────
function renderizarFavorito(evento, fav, container) {
  const item = crearItemFavorito(evento, fav);
  container.appendChild(item);
}

function crearItemFavorito(evento, fav) {
  const item = document.createElement('div');
  item.className = 'match-item';
  item.innerHTML = buildMatchItemHTML(evento);

  // Click en el item (no en el botón ✕) → abre el video si existe
  item.addEventListener('click', (e) => {
    if (e.target.closest('.btn-remove-fav')) return;
    const videoUrl = sanitizeVideoUrl(evento.strVideo);
    if (videoUrl) window.open(videoUrl, '_blank', 'noopener,noreferrer');
  });

  item.querySelector('.btn-remove-fav').addEventListener('click', (e) => {
    e.stopPropagation();
    eliminarFavorito(fav.id, item);
  });

  // Estilo cursor según si hay video
  if (sanitizeVideoUrl(evento.strVideo)) {
    item.style.cursor = 'pointer';
  } else {
    item.style.cursor = 'default';
  }

  return item;
}

function buildMatchItemHTML(evento) {
  const title = buildMatchTitle(evento);
  const dateText = buildDateText(evento);
  const videoUrl = sanitizeVideoUrl(evento.strVideo);
  return `
    <span class="match-title">${title}</span>
    <span class="date">${dateText}</span>
    ${videoUrl ? '<span class="match-video-hint">▶ Ver video</span>' : ''}
    <button class="btn-remove-fav" aria-label="Eliminar de favoritos" title="Quitar de favoritos">✕</button>
  `;
}

function buildMatchTitle(evento) {
  return evento.strHomeTeam && evento.strAwayTeam
    ? `${evento.strHomeTeam} vs ${evento.strAwayTeam}`
    : evento.strEvent || 'Evento deportivo';
}

function buildDateText(evento) {
  const date = formatDate(evento.dateEvent);
  const time = formatTime(evento);
  const league = evento.strLeague || '';
  return [date, time ? `${time}h` : '', league].filter(Boolean).join(' · ');
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

// ─── Utils ────────────────────────────────────────────────────────────
function sanitizeVideoUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) return '';
  return trimmed;
}

function formatDate(dateStr) {
  if (!dateStr) return 'Fecha por confirmar';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatTime(evento) {
  const t = evento?.strTimeLocal || evento?.strTime || '';
  if (!t) return '';
  const hhmm = String(t).slice(0, 5);
  return /^\d{2}:\d{2}$/.test(hhmm) ? hhmm : String(t);
}
