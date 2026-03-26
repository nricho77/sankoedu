import { router } from "./router.js";
import { api } from "./api.js";

const login = document.getElementById("login-screen");
const app   = document.getElementById("app");

function showLogin() {
  login.classList.remove("hidden");
  app.classList.add("hidden");
}
function showApp() {
  login.classList.add("hidden");
  app.classList.remove("hidden");
}

document.getElementById("btn-login-local").onclick = async () => {
  const r = await api.login();
  if (r.ok) {
    showApp();
    router.go("home");
  } else {
    alert("Erreur connexion");
  }
};

showLogin();
router.init();

// Test backend
api.health().then(console.log);
``
