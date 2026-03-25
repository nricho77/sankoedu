// =====================================================
// app.js — point d'entrée principal & orchestrateur UI
// =====================================================

import { Auth } from "./auth.js";
import { RouterApp } from "./router.js";

// UI modules
import { renderHome } from "./ui/home.js";
import { renderEntry } from "./ui/entry.js";
import { renderEntries } from "./ui/entries.js";
import { renderAppro } from "./ui/appro.js";
import { renderAdmin } from "./ui/admin.js";
import { renderProfile } from "./ui/profile.js";

import { showToast } from "./utils.js";


// =====================================================
// INITIALISATION DE L’APPLICATION
// =====================================================

async function initApp() {

  // Initialisation de la session
  await Auth.init();

  // Récupération éventuelle du user déjà connecté
  const user = Auth.currentUser;

  // Gestion de l'écran login/setup
  prepareLoginHandlers();

  // Router : enregistrer les écrans
  RouterApp.register("home",    renderHome);
  RouterApp.register("entry",   renderEntry);
  RouterApp.register("entries", renderEntries);
  RouterApp.register("appro",   renderAppro);
  RouterApp.register("admin",   renderAdmin);
  RouterApp.register("profile", renderProfile);

  // Si pas connecté → afficher login
  if (!user) {
    document.getElementById("login-screen").classList.remove("hidden");
    return;
  }

  // Si connecté → afficher application
  startMainUI();
}


// =====================================================
// LOGIN + SETUP HANDLERS
// =====================================================
function prepareLoginHandlers() {

  // Bouton login local
  const btnLocal = document.getElementById("btn-login-local");
  if (btnLocal) {
    btnLocal.onclick = async () => {
      const email = document.getElementById("l-email").value.trim();
      const pw    = document.getElementById("l-pw").value.trim();

      try {
        await Auth.loginLocal(email, pw);
        startMainUI();
      } catch(err) {
        showToast("Erreur connexion locale", "error");
      }
    };
  }

  // Bouton login MSAL
  const btnMsal = document.getElementById("btn-msal");
  if (btnMsal) {
    btnMsal.onclick = async () => {
      try {
        await Auth.loginMicrosoft();
        startMainUI();
      } catch(err) {
        showToast("Connexion Microsoft impossible", "error");
      }
    };
  }

  // Validation sur touche Enter
  document.addEventListener("keydown", e => {
    if (e.key === "Enter" 
        && !document.getElementById("login-screen").classList.contains("hidden")) {
      btnLocal?.click();
    }
  });

  // Setup initial (création admin)
  const btnSetup = document.getElementById("btn-setup");
  if (btnSetup) {
    btnSetup.onclick = async () => {
      const org = document.getElementById("s-org").value.trim();
      const first = document.getElementById("s-first").value.trim();
      const last = document.getElementById("s-last").value.trim();
      const email = document.getElementById("s-email").value.trim();
      const pw = document.getElementById("s-pw").value;
      const pw2 = document.getElementById("s-pw2").value;

      const error = document.getElementById("setup-error");

      if (!org || !first || !last || !email || !pw) {
        error.textContent = "Tous les champs sont obligatoires.";
        error.classList.remove("hidden");
        return;
      }
      if (pw !== pw2) {
        error.textContent = "Les mots de passe ne correspondent pas.";
        error.classList.remove("hidden");
        return;
      }

      // Appel backend (sera ajouté dans Azure Functions)
      try {
        await fetch("/api/setup/init", {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ org, first, last, email, pw })
        });
        showToast("Application configurée", "success");
        location.reload();
      } catch {
        error.textContent = "Erreur création admin.";
        error.classList.remove("hidden");
      }
    };
  }
}


// =====================================================
// DÉMARRAGE DE L’UI PRINCIPALE
// =====================================================
function startMainUI() {
  const login = document.getElementById("login-screen");
  const app   = document.getElementById("app");

  login.classList.add("hidden");
  app.classList.remove("hidden");

  setupNavigation();
  RouterApp.go("home");
}


// =====================================================
// CONFIGURATION DE LA NAVIGATION RESPONSIVE
// =====================================================
function setupNavigation() {
  const items = document.querySelectorAll(".nav-item");
  items.forEach(btn => {
    btn.onclick = () => {
      const route = btn.dataset.route;
      RouterApp.go(route);
    };
  });
}


// =====================================================
// LANCER APP
// =====================================================
document.addEventListener("DOMContentLoaded", initApp);