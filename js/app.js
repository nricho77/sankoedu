import { router } from "./router.js";
import { renderLogin } from "../ui/login.js";
import { api } from "./api.js";
import { hasRole } from "./auth.js";

const loginContainer = document.getElementById("login-screen");
const app = document.getElementById("app");

function showApp() {
  loginContainer.classList.add("hidden");
  app.classList.remove("hidden");
  router.go("home");
}

if (!hasRole("admin")) {
  document.querySelector('[data-route="admin"]')?.remove();
}

renderLogin(async () => {
  await api.login();
  showApp();
});

router.init();
