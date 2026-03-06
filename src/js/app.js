/**
 * app.js – Shared utilities: auth state management and header update.
 * Included by every page that loads the common header template.
 */

const DB_PATH = '/db.json';
const AUTH_KEY = 'sportly_user';
const LOCAL_USERS_KEY = 'sportly_registered_users';
const HEADER_POLL_INTERVAL_MS = 60;

/* ─── Auth helpers ──────────────────────────────────────────────── */

function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}

function loginUser(userObj) {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(userObj));
}

function logoutUser() {
  sessionStorage.removeItem(AUTH_KEY);
  window.location.href = '/src/pages/pagina-login/login.html';
}

async function validateCredentials(username, password) {
  // 1. Check db.json users
  try {
    const res = await fetch(DB_PATH);
    if (res.ok) {
      const db = await res.json();
      const found = db.usuarios.find(
        (u) => u.user === username && u.pass === password
      );
      if (found) {
        return { id: found.id, user: found.user, role: found.role };
      }
    }
  } catch (e) {
    console.warn('Could not reach db.json:', e);
  }

  // 2. Fallback: locally-registered users (localStorage)
  const locals = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
  const local = locals.find((u) => u.user === username && u.pass === password);
  return local ? { id: local.id, user: local.user, role: local.role } : null;
}

function registerLocalUser(username, email, password) {
  const locals = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
  if (locals.find((u) => u.user === username || u.email === email)) {
    return false; // already exists
  }
  locals.push({ id: Date.now(), user: username, email, pass: password, role: 'user' });
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(locals));
  return true;
}

/* ─── Header auth display ───────────────────────────────────────── */

function updateHeaderAuth() {
  const user = getCurrentUser();
  const loginLink   = document.getElementById('loginLink');
  const userLabel   = document.getElementById('loggedInUser');
  const profileLink = document.getElementById('profileLink');
  const logoutBtn   = document.getElementById('logoutBtn');

  if (user) {
    if (loginLink)   loginLink.style.display   = 'none';
    if (userLabel)  { userLabel.style.display  = 'inline'; userLabel.textContent = user.user; }
    if (profileLink) profileLink.style.display = 'inline';
    if (logoutBtn)   logoutBtn.style.display   = 'inline-block';
  } else {
    if (loginLink)   loginLink.style.display   = 'inline';
    if (userLabel)   userLabel.style.display   = 'none';
    if (profileLink) profileLink.style.display = 'none';
    if (logoutBtn)   logoutBtn.style.display   = 'none';
  }
}

/** Poll until the header elements injected by xlu-include-file are ready. */
function waitForHeaderAndUpdate() {
  if (document.getElementById('loginLink')) {
    updateHeaderAuth();
  } else {
    setTimeout(waitForHeaderAndUpdate, HEADER_POLL_INTERVAL_MS);
  }
}

/* ─── Hamburger menu toggle ─────────────────────────────────────── */

function toggleMobileMenu() {
  const nav = document.getElementById('mainNav');
  if (nav) nav.classList.toggle('open');
}

/* ─── Bootstrap ─────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', waitForHeaderAndUpdate);
