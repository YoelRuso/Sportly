/**
 * app.js — Sportly Application Module
 *
 * Replaces xlu-include-file.js with a modern async/await approach.
 * Handles template loading, sport data fetching from json-server,
 * and dynamic rendering based on sport-specific schemas.
 */

const JSON_SERVER_BASE = 'http://localhost:3000';

// ─── Template Loader ────────────────────────────────────────────────

/**
 * Loads an HTML file and injects its content into every element
 * that has `xlu-include-file="<filePath>"`.
 * Processes elements sequentially so nested includes are resolved.
 */
async function loadTemplates() {
  let element;

  while ((element = document.querySelector('[xlu-include-file]'))) {
    const file = element.getAttribute('xlu-include-file');

    try {
      const response = await fetch(file);

      if (!response.ok) {
        throw new Error(`Failed to load ${file}: ${response.status}`);
      }

      const content = await response.text();
      element.removeAttribute('xlu-include-file');
      element.innerHTML = content;
    } catch (error) {
      console.error('Error loading template:', error);
      element.removeAttribute('xlu-include-file');
      element.innerHTML = `<p style="color:red;">Error loading template: ${file}</p>`;
    }
  }
}

// ─── Data Fetching ──────────────────────────────────────────────────

/**
 * Fetches sport data from json-server.
 * @param {string} sport — one of 'soccer', 'basket', 'tenis', 'f1'
 * @returns {Promise<Array>} — array of event objects
 */
async function fetchSportData(sport) {
  try {
    const response = await fetch(`${JSON_SERVER_BASE}/${sport}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${sport}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${sport} data:`, error);
    return [];
  }
}

/**
 * Fetches ALL sports and merges them into one array.
 * @returns {Promise<Array>}
 */
async function fetchAllSports() {
  const sports = ['soccer', 'basket', 'tenis', 'f1'];

  try {
    const results = await Promise.all(sports.map((s) => fetchSportData(s)));
    return results.flat();
  } catch (error) {
    console.error('Error fetching all sports:', error);
    return [];
  }
}

// ─── Sport Schema Mapping ───────────────────────────────────────────
//
// Each sport has the same JSON keys but different data patterns:
//   • Soccer / Basketball → strHomeTeam & strAwayTeam are populated
//   • Tennis             → strHomeTeam/strAwayTeam are null; use strEvent
//   • F1 (Motorsport)   → strHomeTeam/strAwayTeam are null; strVenue matters
//
// The helpers below normalise every event into a common shape used by
// the card renderers: { title, description, badge, date, image }

/**
 * Returns the human-readable sport badge label.
 */
function sportBadge(strSport) {
  const map = {
    Soccer: 'Fútbol',
    Basketball: 'Baloncesto',
    Tennis: 'Tennis',
    Motorsport: 'F1',
  };
  return map[strSport] || strSport || 'Deporte';
}

/**
 * Builds a card-friendly title from an event.
 */
function eventTitle(event) {
  if (event.strHomeTeam && event.strAwayTeam) {
    return `${event.strHomeTeam} VS ${event.strAwayTeam}`;
  }
  return event.strEvent || event.strFilename || 'Evento deportivo';
}

/**
 * Builds a description string depending on the sport type.
 */
function eventDescription(event) {
  const sport = (event.strSport || '').toLowerCase();

  if (sport === 'soccer' || sport === 'basketball') {
    const home = event.intHomeScore ?? '-';
    const away = event.intAwayScore ?? '-';
    const league = event.strLeague || '';
    const round = event.intRound ? `Jornada ${event.intRound}` : '';
    return [league, round, `Resultado: ${home} – ${away}`]
      .filter(Boolean)
      .join(' · ');
  }

  if (sport === 'tennis') {
    return event.strDescriptionEN || event.strLeague || 'Partido de tenis';
  }

  if (sport === 'motorsport') {
    const venue = event.strVenue || '';
    const city = event.strCity || '';
    const country = event.strCountry || '';
    return [venue, city, country].filter(Boolean).join(', ') || event.strLeague || 'Carrera';
  }

  return event.strDescriptionEN || event.strLeague || '';
}

/**
 * Picks the best available image for an event.
 */
function eventImage(event) {
  return (
    event.strThumb ||
    event.strPoster ||
    event.strBanner ||
    event.strSquare ||
    '../../../public/images/vienna-reyes-qCrKTET_09o-unsplash.jpg'
  );
}

/**
 * Formats a date string for display.
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ─── Card Renderers ─────────────────────────────────────────────────

/**
 * Renders an array of events as "card" components (used on inicio page).
 */
function renderCards(events, container) {
  container.innerHTML = '';

  if (events.length === 0) {
    container.innerHTML =
      '<p style="color:#aaa;text-align:center;grid-column:1/-1;">No hay eventos disponibles.</p>';
    return;
  }

  const MAX_CARDS = 6;
  const slice = events.slice(0, MAX_CARDS);

  slice.forEach((event) => {
    const section = document.createElement('section');
    section.className = 'card-item';

    const image = eventImage(event);
    const badge = sportBadge(event.strSport);
    const title = eventTitle(event);
    const desc = eventDescription(event);

    section.innerHTML = `
      <div class="card">
        <div class="card-header"
             style="background-image: url('${image}');">
          <span class="badge">${badge}</span>
        </div>
        <div class="card-content">
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>
      </div>`;

    container.appendChild(section);
  });
}

/**
 * Renders an array of events as "card-resumen" components (used on resumen page).
 */
function renderResumenCards(events, container) {
  container.innerHTML = '';

  if (events.length === 0) {
    container.innerHTML =
      '<p style="color:#aaa;text-align:center;grid-column:1/-1;">No hay eventos disponibles.</p>';
    return;
  }

  const MAX_CARDS = 6;
  const slice = events.slice(0, MAX_CARDS);

  slice.forEach((event) => {
    const section = document.createElement('section');
    section.className = 'card-item';

    const image = eventImage(event);
    const badge = sportBadge(event.strSport);
    const title = eventTitle(event);
    const desc = eventDescription(event);
    const date = formatDate(event.dateEvent);

    section.innerHTML = `
      <div class="news-card">
        <div class="news-image-container" style="background-image: url('${image}');">
          <div class="news-overlay">
            <span class="news-category">${badge}</span>
            <span class="news-date">${date}</span>
          </div>
        </div>
        <div class="news-body">
          <h2 class="news-title">${title}</h2>
          <p class="news-excerpt">${desc}</p>
          <a href="../../pages/pagina-leermas-resumen/leermas.html" class="news-read-more">Leer más &rarr;</a>
        </div>
      </div>`;

    container.appendChild(section);
  });
}

// ─── Navbar Interaction ─────────────────────────────────────────────

/**
 * Maps navbar link text to json-server endpoint names.
 */
const SPORT_MAP = {
  Todos: 'all',
  'Fútbol': 'soccer',
  Baloncesto: 'basket',
  Tennis: 'tenis',
  F1: 'f1',
};

/**
 * Sets up click listeners on the sports navbar.
 * @param {Function} renderFn — callback(events, container) to render cards
 * @param {HTMLElement} container — the cards-grid element
 */
function setupSportsNav(renderFn, container) {
  const nav = document.querySelector('.sports-selection nav ul');
  if (!nav) return;

  nav.addEventListener('click', async (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    e.preventDefault();

    // Update active state
    nav.querySelectorAll('a').forEach((a) => a.classList.remove('active'));
    link.classList.add('active');

    const label = link.textContent.trim();
    const sport = SPORT_MAP[label];

    if (!sport) return;

    let events;
    if (sport === 'all') {
      events = await fetchAllSports();
    } else {
      events = await fetchSportData(sport);
    }

    renderFn(events, container);
  });
}

// ─── Page Initialisers ──────────────────────────────────────────────

/**
 * Initialises the Inicio (home) page.
 * Loads templates, then fetches all sport data and renders cards.
 */
async function initInicio() {
  await loadTemplates();

  const container = document.querySelector('.cards-grid');
  if (!container) return;

  // Load initial data (all sports)
  const events = await fetchAllSports();
  renderCards(events, container);

  // Wire up sports navbar
  setupSportsNav(renderCards, container);
}

/**
 * Initialises the Resumen (summary) page.
 * Loads templates, then fetches all sport data and renders resumen cards.
 */
async function initResumen() {
  await loadTemplates();

  const container = document.querySelector('.cards-grid');
  if (!container) return;

  // Load initial data (all sports)
  const events = await fetchAllSports();
  renderResumenCards(events, container);

  // Wire up sports navbar
  setupSportsNav(renderResumenCards, container);
}

/**
 * Generic page initialiser — only loads templates (no sport data).
 * Used for pages like calendario, leermas, politicas-avisos.
 */
async function initPage() {
  await loadTemplates();
}
