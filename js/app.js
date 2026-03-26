import { router } from "/js/router.js";
import { renderLogin } from "/ui/login.js";
import { isAuthenticated, hasRole } from "/js/auth.js";


const loginScreen = document.getElementById("login-screen");
const app = document.getElementById("app");

/* =========================
   Affichage conditionnel
========================= */

function showLogin() {
  app.classList.add("hidden");
  loginScreen.classList.remove("hidden");
}

function showApp() {
  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");
  applyAuthorizations();
  router.go("home");
}

/* =========================
   Gestion des rôles UI
========================= */

function applyAuthorizations() {
  if (!hasRole("admin")) {
    document.querySelector('[data-route="admin"]')?.remove();
  }
  if (!hasRole("approver") && !hasRole("admin")) {
    document.querySelector('[data-route="appro"]')?.remove();
  }
}

/* =========================
   INIT
========================= */

router.init();

if (isAuthenticated()) {
  // Utilisateur déjà connecté
  showApp();
} else {
  // Aucun utilisateur → LOGIN OBLIGATOIRE
  renderLogin(showApp);
  showLogin();
}
