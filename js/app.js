/* =========================================================
   app.js — Point d’entrée principal de l’application
   ========================================================= */

/**
 * Ce fichier :
 * - démarre l’application
 * - vérifie que le frontend est bien chargé
 * - prépare la structure SPA
 * - sera enrichi ensuite (auth, router, API, etc.)
 */

console.log("✅ app.js chargé correctement");

// ---------------------------------------------------------
// Sélecteurs utiles
// ---------------------------------------------------------
const setupScreen = document.getElementById("setup-screen");
const loginScreen = document.getElementById("login-screen");
const appRoot     = document.getElementById("app");

// ---------------------------------------------------------
// Initialisation de l'application
// ---------------------------------------------------------
function initApp() {
  console.log("🚀 Initialisation de l’application…");

  // Pour l’instant :
  // – on masque tout
  hideAll();

  // – on affiche l’écran de login par défaut
  showLogin();
}

// ---------------------------------------------------------
// Fonctions d'affichage
// ---------------------------------------------------------
function hideAll() {
  if (setupScreen) setupScreen.classList.add("hidden");
  if (loginScreen) loginScreen.classList.add("hidden");
  if (appRoot)     appRoot.classList.add("hidden");
}

function showSetup() {
  hideAll();
  if (setupScreen) setupScreen.classList.remove("hidden");
}

function showLogin() {
  hideAll();
  if (loginScreen) loginScreen.classList.remove("hidden");
}

function showApp() {
  hideAll();
  if (appRoot) appRoot.classList.remove("hidden");
}

// ---------------------------------------------------------
// Gestion très simple des boutons (temporaire)
// ---------------------------------------------------------
const btnSetup = document.getElementById("btn-setup");
if (btnSetup) {
  btnSetup.addEventListener("click", () => {
    alert("🔧 Setup initial – à brancher avec l’API plus tard");
    showLogin();
  });
}

const btnLoginLocal = document.getElementById("btn-login-local");
if (btnLoginLocal) {
  btnLoginLocal.addEventListener("click", () => {
    alert("🔐 Connexion locale – à brancher avec l’API plus tard");
    showApp();
  });
}

// ---------------------------------------------------------
// Lancement automatique quand le DOM est prêt
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});
