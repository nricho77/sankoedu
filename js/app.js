import { router } from "./router.js";
import { renderLogin } from "../ui/login.js";
import { isAuthenticated, getUser, clearUser, hasRole } from "./auth.js";

const loginScreen = document.getElementById("login-screen");
const app = document.getElementById("app");

function showApp() {
  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");
  applyAuthorizations();
  router.go("home");
}

function showLogin() {
  app.classList.add("hidden");
  loginScreen.classList.remove("hidden");
}

function applyAuthorizations() {
  if (!hasRole("admin")) {
    document.querySelector('[data-route="admin"]')?.remove();
  }
  if (!hasRole("approver") && !hasRole("admin")) {
    document.querySelector('[data-route="appro"]')?.remove();
  }
}

router.init();

if (isAuthenticated()) {
  showApp();
} else {
  renderLogin(showApp);
  showLogin();
}
``
