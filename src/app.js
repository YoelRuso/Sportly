/**
 * app.js — Sportly Application Module
 *
 * Modern ID-based asynchronous loading system with a dynamic
 * data rendering engine for multi-sport content.
 * Uses explicit renderComponent(url, containerId) calls and
 * a configuration-based sport schema mapper.
 */

const JSON_SERVER_BASE = 'http://localhost:3000';

// ─── Active Sport State ─────────────────────────────────────────────

let activeSport = 'all';

// ─── Template Loader ────────────────────────────────────────────────

/**
 * Fetches an HTML file and injects its content into a container by ID.
 * @param {string} url — path to the HTML template file
 * @param {string} containerId — the id of the target DOM element
 */
async function renderComponent(url, containerId) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container #${containerId} not found.`);
    return;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.status}`);
    }

    container.innerHTML = await response.text();
  } catch (error) {
    console.error(`Error loading component into #${containerId}:`, error);
    container.innerHTML = `<p style="color:red;">Error loading template.</p>`;
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

// ─── Sport Schema Mapper ────────────────────────────────────────────
//
// Configuration object mapping sport types to their field extractors.
// Each sport shares the same JSON keys but populates different fields:
//   • Soccer / Basketball → strHomeTeam & strAwayTeam are populated
//   • Tennis             → strHomeTeam/strAwayTeam are null; use strEvent
//   • F1 (Motorsport)   → strHomeTeam/strAwayTeam are null; strVenue matters

const SPORT_CONFIG = {
  soccer: {
    badge: 'Fútbol',
    title: (e) => `${e.strHomeTeam} VS ${e.strAwayTeam}`,
    description: (e) => {
      const home = e.intHomeScore ?? '-';
      const away = e.intAwayScore ?? '-';
      const league = e.strLeague || '';
      const round = e.intRound ? `Jornada ${e.intRound}` : '';
      return [league, round, `Resultado: ${home} – ${away}`].filter(Boolean).join(' · ');
    },
  },
  basketball: {
    badge: 'Baloncesto',
    title: (e) => `${e.strHomeTeam} VS ${e.strAwayTeam}`,
    description: (e) => {
      const home = e.intHomeScore ?? '-';
      const away = e.intAwayScore ?? '-';
      const league = e.strLeague || '';
      const round = e.intRound ? `Jornada ${e.intRound}` : '';
      return [league, round, `Resultado: ${home} – ${away}`].filter(Boolean).join(' · ');
    },
  },
  tennis: {
    badge: 'Tennis',
    title: (e) => e.strEvent || 'Evento de tenis',
    description: (e) => e.strDescriptionEN || e.strLeague || 'Partido de tenis',
  },
  motorsport: {
    badge: 'F1',
    title: (e) => e.strEvent || 'Evento F1',
    description: (e) => {
      const venue = e.strVenue || '';
      const city = e.strCity || '';
      const country = e.strCountry || '';
      return [venue, city, country].filter(Boolean).join(', ') || e.strLeague || 'Carrera';
    },
  },
};

/**
 * Resolves sport configuration from an event's strSport field.
 * Falls back to a generic config if the sport is unknown.
 */
function getSportConfig(strSport) {
  const key = (strSport || '').toLowerCase();
  return SPORT_CONFIG[key] || {
    badge: strSport || 'Deporte',
    title: (e) => e.strEvent || e.strFilename || 'Evento deportivo',
    description: (e) => e.strDescriptionEN || e.strLeague || '',
  };
}

/**
 * Maps sport-specific fields to a common UI Card data structure
 * using the SPORT_CONFIG schema mapper.
 * @param {string} sportType — the strSport value (e.g. 'Soccer', 'Tennis')
 * @param {Object} event — raw event object from json-server
 * @returns {{ title, description, badge, date, image }}
 */
function renderSportData(sportType, event) {
  const config = getSportConfig(sportType);
  return {
    badge: config.badge,
    title: config.title(event),
    description: config.description(event),
    date: formatDate(event.dateEvent),
    image: eventImage(event),
  };
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
    const { badge, title, description, image } = renderSportData(event.strSport, event);

    const section = document.createElement('section');
    section.className = 'card-item';

    section.innerHTML = `
      <div class="card">
        <div class="card-header"
             style="background-image: url('${image}');">
          <span class="badge">${badge}</span>
        </div>
        <div class="card-content">
          <h3>${title}</h3>
          <p>${description}</p>
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
    const { badge, title, description, date, image } = renderSportData(event.strSport, event);

    const section = document.createElement('section');
    section.className = 'card-item';

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
          <p class="news-excerpt">${description}</p>
          <a href="../../pages/pagina-leermas-resumen/leermas.html" class="news-read-more">Leer más &rarr;</a>
        </div>
      </div>`;

    container.appendChild(section);
  });
}

// ─── Sport State & Navbar ───────────────────────────────────────────

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
 * Central state handler: sets the active sport, fetches data,
 * and triggers re-rendering of the main card container.
 * @param {string} sport — endpoint name ('all', 'soccer', etc.)
 * @param {Function} renderFn — callback(events, container)
 * @param {HTMLElement} container — the cards-grid element
 */
async function setActiveSport(sport, renderFn, container) {
  activeSport = sport;

  let events;
  if (sport === 'all') {
    events = await fetchAllSports();
  } else {
    events = await fetchSportData(sport);
  }

  renderFn(events, container);
}

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

    // Update active state in the navbar
    nav.querySelectorAll('a').forEach((a) => a.classList.remove('active'));
    link.classList.add('active');

    const label = link.textContent.trim();
    const sport = SPORT_MAP[label];

    if (!sport) return;

    await setActiveSport(sport, renderFn, container);
  });
}

// ─── Page Initialisers ──────────────────────────────────────────────

/**
 * Initialises the Inicio (home) page.
 * Loads components by ID, fetches all sport data and renders cards.
 */
async function initInicio() {
  await Promise.all([
    renderComponent('../../templates/template-header/header.html', 'header'),
    renderComponent('../../templates/template-navbar-entre-deportes/navbar-entre-deportes.html', 'navbar'),
    renderComponent('../../templates/template-footer/footer.html', 'footer'),
  ]);

  const container = document.querySelector('.cards-grid');
  if (!container) return;

  await setActiveSport('all', renderCards, container);
  setupSportsNav(renderCards, container);
}

/**
 * Initialises the Resumen (summary) page.
 * Loads components by ID, fetches all sport data and renders resumen cards.
 */
async function initResumen() {
  await Promise.all([
    renderComponent('../../templates/template-header/header.html', 'header'),
    renderComponent('../../templates/template-navbar-entre-deportes/navbar-entre-deportes.html', 'navbar'),
    renderComponent('../../templates/template-footer/footer.html', 'footer'),
  ]);

  const container = document.querySelector('.cards-grid');
  if (!container) return;

  await setActiveSport('all', renderResumenCards, container);
  setupSportsNav(renderResumenCards, container);
}

/**
 * Initialises the Calendario page.
 * Loads header and footer components by ID.
 */
async function initCalendario() {
  await Promise.all([
    renderComponent('../../templates/template-header/header.html', 'header'),
    renderComponent('../../templates/template-footer/footer.html', 'footer'),
  ]);
}

/**
 * Initialises the Leer Más page.
 * Loads header, main content, and footer components by ID.
 */
async function initLeermas() {
  await Promise.all([
    renderComponent('../../templates/template-header/header.html', 'header'),
    renderComponent('../../templates/template-main-leermas/main-leermas.html', 'main-content'),
    renderComponent('../../templates/template-footer/footer.html', 'footer'),
  ]);
}

/**
 * Initialises the Políticas / Avisos page.
 * Loads header, main content, and footer components by ID.
 */
async function initPoliticas() {
  await Promise.all([
    renderComponent('../../templates/template-header/header.html', 'header'),
    renderComponent('../../templates/template-politicas-avisos/main-politicas-avisos.html', 'main-content'),
    renderComponent('../../templates/template-footer/footer.html', 'footer'),
  ]);
}
