/**
 * app.js — Sportly Application Module
 *
 * Modern ID-based asynchronous loading system with a dynamic
 * data rendering engine for multi-sport content.
 * Uses explicit renderComponent(url, containerId) calls and
 * a configuration-based sport schema mapper.
 * Includes pagination support via json-server ?_page=N&_per_page=9
 */

const JSON_SERVER_BASE = 'http://localhost:3000';

// ─── Active Sport State ─────────────────────────────────────────────
let activeSport = 'all';

// ─── Pagination State ───────────────────────────────────────────────
const paginationState = {
  currentPage: 1,
  perPage: 9,
  totalPages: 1,
  currentSport: 'all',
  currentRenderFn: null,
  currentContainer: null,
};

// ─── Template Loader ────────────────────────────────────────────────
async function renderComponent(url, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container #${containerId} not found.`);
    return;
  }
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to load ${url}: ${response.status}`);
    container.innerHTML = await response.text();
  } catch (error) {
    console.error(`Error loading component into #${containerId}:`, error);
    container.innerHTML = `<p style="color:red;">Error loading template.</p>`;
  }
}

// ─── Data Fetching ──────────────────────────────────────────────────

/**
 * Fetches a single sport page from json-server with pagination.
 * json-server returns: { first, prev, next, last, pages, items, data[] }
 * @param {string} sport
 * @param {number} page
 * @param {number} perPage
 * @returns {Promise<{ data: Array, pages: number, items: number }>}
 */
async function fetchSportDataPaged(sport, page = 1, perPage = 9) {
  try {
    const response = await fetch(
      `${JSON_SERVER_BASE}/${sport}?_page=${page}&_per_page=${perPage}`,
    );
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${sport}`);
    const json = await response.json();
    return {
      data: json.data || [],
      pages: json.pages || 1,
      items: json.items || 0,
    };
  } catch (error) {
    console.error(`Error fetching ${sport} data:`, error);
    return { data: [], pages: 1, items: 0 };
  }
}

/**
 * Fetches a single sport (all pages not paginated — used internally).
 */
async function fetchSportData(sport) {
  try {
    const response = await fetch(`${JSON_SERVER_BASE}/${sport}`);
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${sport}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${sport} data:`, error);
    return [];
  }
}

/**
 * Fetches ALL sports for "Todos" tab — paginated by fetching first page
 * of each sport and merging, then handles pagination per-sport internally.
 */
async function fetchAllSportsPaged(page = 1, perPage = 9) {
  const sports = ['soccer', 'basket', 'tenis', 'f1'];
  try {
    // For "all", we fetch all sports without pagination and slice manually
    const results = await Promise.all(sports.map((s) => fetchSportData(s)));
    const all = results.flat();
    const totalItems = all.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const start = (page - 1) * perPage;
    const data = all.slice(start, start + perPage);
    return { data, pages: totalPages, items: totalItems };
  } catch (error) {
    console.error('Error fetching all sports:', error);
    return { data: [], pages: 1, items: 0 };
  }
}

// ─── Sport Schema Mapper ────────────────────────────────────────────
const SPORT_CONFIG = {
  soccer: {
    badge: 'Fútbol',
    title: (e) => `${e.strHomeTeam} VS ${e.strAwayTeam}`,
    description: (e) => {
      const home = e.intHomeScore ?? '-';
      const away = e.intAwayScore ?? '-';
      const league = e.strLeague || '';
      const round = e.intRound ? `Jornada ${e.intRound}` : '';
      return [league, round, `Resultado: ${home} – ${away}`]
        .filter(Boolean)
        .join(' · ');
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
      return [league, round, `Resultado: ${home} – ${away}`]
        .filter(Boolean)
        .join(' · ');
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
      return (
        [venue, city, country].filter(Boolean).join(', ') ||
        e.strLeague ||
        'Carrera'
      );
    },
  },
};

function getSportConfig(strSport) {
  const key = (strSport || '').toLowerCase();
  return (
    SPORT_CONFIG[key] || {
      badge: strSport || 'Deporte',
      title: (e) => e.strEvent || e.strFilename || 'Evento deportivo',
      description: (e) => e.strDescriptionEN || e.strLeague || '',
    }
  );
}

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

function eventImage(event) {
  return (
    event.strThumb ||
    event.strPoster ||
    event.strBanner ||
    event.strSquare ||
    '../../../public/images/tenis.png'
  );
}

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
function renderCards(events, container) {
  container.innerHTML = '';
  if (events.length === 0) {
    container.innerHTML =
      '<p style="color:#aaa;text-align:center;grid-column:1/-1;">No hay eventos disponibles.</p>';
    return;
  }
  events.forEach((event) => {
    const { badge, title, description, image } = renderSportData(
      event.strSport,
      event,
    );
    const section = document.createElement('section');
    section.className = 'card-item';
    section.innerHTML = `
      <div class="card">
        <div class="card-header" style="background-image: url('${image}');">
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

function renderResumenCards(events, container) {
  container.innerHTML = '';
  if (events.length === 0) {
    container.innerHTML =
      '<p style="color:#aaa;text-align:center;grid-column:1/-1;">No hay eventos disponibles.</p>';
    return;
  }
  events.forEach((event) => {
    const { badge, title, description, date, image } = renderSportData(
      event.strSport,
      event,
    );
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

// ─── Pagination UI ──────────────────────────────────────────────────

/**
 * Renders the pagination controls below the cards grid.
 * Expects a <div id="pagination"> in the HTML.
 */
function renderPagination(currentPage, totalPages) {
  const paginationEl = document.getElementById('pagination');
  if (!paginationEl) return;

  paginationEl.innerHTML = '';

  if (totalPages <= 1) return;

  const createBtn = (label, page, disabled = false, active = false) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = [
      'pagination-btn',
      active ? 'pagination-btn--active' : '',
      disabled ? 'pagination-btn--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
    btn.disabled = disabled;
    if (!disabled) {
      btn.addEventListener('click', () => goToPage(page));
    }
    return btn;
  };

  // Anterior
  paginationEl.appendChild(createBtn('←', currentPage - 1, currentPage === 1));

  // Números de página con ventana deslizante
  const delta = 2;
  const range = [];
  for (
    let i = Math.max(1, currentPage - delta);
    i <= Math.min(totalPages, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (range[0] > 1) {
    paginationEl.appendChild(createBtn('1', 1));
    if (range[0] > 2) {
      const dots = document.createElement('span');
      dots.textContent = '…';
      dots.className = 'pagination-dots';
      paginationEl.appendChild(dots);
    }
  }

  range.forEach((p) => {
    paginationEl.appendChild(createBtn(String(p), p, false, p === currentPage));
  });

  if (range[range.length - 1] < totalPages) {
    if (range[range.length - 1] < totalPages - 1) {
      const dots = document.createElement('span');
      dots.textContent = '…';
      dots.className = 'pagination-dots';
      paginationEl.appendChild(dots);
    }
    paginationEl.appendChild(createBtn(String(totalPages), totalPages));
  }

  // Siguiente
  paginationEl.appendChild(
    createBtn('→', currentPage + 1, currentPage === totalPages),
  );
}

/**
 * Navigates to a specific page, fetches data and re-renders.
 */
async function goToPage(page) {
  const { currentSport, perPage, currentRenderFn, currentContainer } =
    paginationState;

  paginationState.currentPage = page;

  // Scroll suave al inicio del grid
  currentContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const { data, pages } =
    currentSport === 'all'
      ? await fetchAllSportsPaged(page, perPage)
      : await fetchSportDataPaged(currentSport, page, perPage);

  paginationState.totalPages = pages;
  currentRenderFn(data, currentContainer);
  renderPagination(page, pages);
}

// ─── Sport State & Navbar ───────────────────────────────────────────
const SPORT_MAP = {
  Todos: 'all',
  Fútbol: 'soccer',
  Baloncesto: 'basket',
  Tennis: 'tenis',
  F1: 'f1',
};

/**
 * Central state handler with pagination support.
 */
async function setActiveSport(sport, renderFn, container) {
  activeSport = sport;

  // Reset to page 1 when switching sport
  paginationState.currentPage = 1;
  paginationState.currentSport = sport;
  paginationState.currentRenderFn = renderFn;
  paginationState.currentContainer = container;

  const { data, pages } =
    sport === 'all'
      ? await fetchAllSportsPaged(1, paginationState.perPage)
      : await fetchSportDataPaged(sport, 1, paginationState.perPage);

  paginationState.totalPages = pages;
  renderFn(data, container);
  renderPagination(1, pages);
}

function setupSportsNav(renderFn, container) {
  const nav = document.querySelector('.sports-selection nav ul');
  if (!nav) return;

  nav.addEventListener('click', async (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    e.preventDefault();

    nav.querySelectorAll('a').forEach((a) => a.classList.remove('active'));
    link.classList.add('active');

    const label = link.textContent.trim();
    const sport = SPORT_MAP[label];
    if (!sport) return;

    await setActiveSport(sport, renderFn, container);
  });
}

// ─── Page Initialisers ──────────────────────────────────────────────
async function initInicio() {
  await Promise.all([
    renderComponent('../../templates/template-header/header.html', 'header'),
    renderComponent(
      '../../templates/template-navbar-entre-deportes/navbar-entre-deportes.html',
      'navbar',
    ),
    renderComponent('../../templates/template-footer/footer.html', 'footer'),
  ]);

  const container = document.querySelector('.cards-grid');
  if (!container) return;

  await setActiveSport('all', renderCards, container);
  setupSportsNav(renderCards, container);
}

async function initResumen() {
  await Promise.all([
    renderComponent('../../templates/template-header/header.html', 'header'),
    renderComponent(
      '../../templates/template-navbar-entre-deportes/navbar-entre-deportes.html',
      'navbar',
    ),
    renderComponent('../../templates/template-footer/footer.html', 'footer'),
  ]);

  const container = document.querySelector('.cards-grid');
  if (!container) return;

  await setActiveSport('all', renderResumenCards, container);
  setupSportsNav(renderResumenCards, container);
}

async function initCalendario() {
  await Promise.all([
    renderComponent('../../templates/template-header/header.html', 'header'),
    renderComponent('../../templates/template-footer/footer.html', 'footer'),
  ]);
}

async function initLeermas() {
  await Promise.all([
    renderComponent('../../templates/template-header/header.html', 'header'),
    renderComponent(
      '../../templates/template-main-leermas/main-leermas.html',
      'main-content',
    ),
    renderComponent('../../templates/template-footer/footer.html', 'footer'),
  ]);
}

async function initPoliticas() {
  await Promise.all([
    renderComponent('../../templates/template-header/header.html', 'header'),
    renderComponent(
      '../../templates/template-politicas-avisos/main-politicas-avisos.html',
      'main-content',
    ),
    renderComponent('../../templates/template-footer/footer.html', 'footer'),
  ]);
}
