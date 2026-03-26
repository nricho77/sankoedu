import { router } from "./router.js";
import { api } from "./api.js";

// démarrage
console.log("✅ app.js chargé");

// Exposer api en global (pratique au début)
window.api = api;

// Gestion écran login → app (temporaire)
const login = document.getElementById("login-screen");
const app   = document.getElementById("app");

function showLogin() {
  login?.classList.remove("hidden");
  app?.classList.add("hidden");
}
function showApp() {
  login?.classList.add("hidden");
  app?.classList.remove("hidden");
}

// Test API (optionnel, rassurant)
api.health().then(r => console.log("API:", r));

// Simuler login OK (à remplacer plus tard)
document.addEventListener("click", (e) => {
  if (e.target.closest("#btn-login-local")) {
    showApp();
    router.go("home");
  }
});

// Init
showLogin();
router.init();
