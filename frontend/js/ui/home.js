// =====================================================
// home.js — écran d'accueil
// =====================================================

import { Auth } from "../auth.js";
import { DBApp } from "../db.js";
import { RouterApp } from "../router.js";
import { renderTable } from "./components/table.js";
import { showToast } from "../utils.js";

export async function renderHome() {

  const screen = document.getElementById("screen-home");
  const user   = Auth.currentUser;

  if (!user) {
    screen.innerHTML = `<div class="pad">Utilisateur non connecté.</div>`;
    return;
  }

  screen.innerHTML = `<div class="pad">Chargement...</div>`;

  try {
    // -------- Charger périodes --------
    const periods = await DBApp.listPeriods();
    const active = periods.find(p => p.statut === "ouverte");

    if (!active) {
      screen.innerHTML = `
        <div class="pad">
          <h2>Aucune période active</h2>
          <p>Veuillez demander à un administrateur d’activer une période.</p>
        </div>`;
      return;
    }

    // -------- Titre accueil --------
    const title = `
      <div class="hero">
        <div class="hero-name">Bonjour ${user.prenom} 👋</div>
        <div class="hero-sub">Période : ${active.label}</div>
      </div>
    `;

    // -------- Progression (nombre de jours saisis) --------
    const entries = await DBApp.getEntries(active.FtId, user.siteActif || "");
    const total = entries.length;
    const done  = entries.filter(e => e.statut !== "brouillon").length;

    const progress = `
      <div class="card">
        <div class="prog-row">
          <div class="prog-lbl">Progression</div>
          <div class="prog-count">${done}/${total}</div>
        </div>
        <div class="prog-bar">
          <div class="prog-fill" style="width:${(done/total)*100}%"></div>
        </div>
      </div>
    `;

    // -------- Actions rapides --------
    let actions = `
      <div class="action-grid">
        <div class="tile primary" data-action="newEntry">
          <div class="tile-icon">✏️</div>
          <div class="tile-lbl">Nouvelle saisie</div>
        </div>

        <div class="tile" data-action="entries">
          <div class="tile-icon">📋</div>
          <div class="tile-lbl">Mes entrées</div>
        </div>
    `;

    if (user.role !== "educatrice") {
      actions += `
        <div class="tile" data-action="appro">
          <div class="tile-icon">✅</div>
          <div class="tile-lbl">À approuver</div>
        </div>
      `;
    }

    if (user.role === "admin") {
      actions += `
        <div class="tile" data-action="admin">
          <div class="tile-icon">⚙️</div>
          <div class="tile-lbl">Administration</div>
        </div>
      `;
    }

    actions += `</div>`;

    screen.innerHTML = `
      ${title}
      <div class="pad">
        ${progress}
        ${actions}
      </div>
    `;

    // -------- Actions click --------
    screen.querySelectorAll("[data-action]").forEach(btn => {
      btn.onclick = () => {
        const a = btn.dataset.action;
        if (a === "newEntry") RouterApp.go("entry");
        else RouterApp.go(a);
      };
    });

  } catch (err) {
    console.error(err);
    screen.innerHTML = `<div class="pad">Erreur chargement accueil.</div>`;
  }
}