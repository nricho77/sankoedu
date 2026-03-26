// =====================================================
// entries.js — liste des entrées de la période
// =====================================================

import { Auth } from "../auth.js";
import { DBApp } from "../db.js";
import { RouterApp } from "../router.js";
import { showToast } from "../utils.js";

export async function renderEntries() {

  const screen = document.getElementById("screen-entries");
  const user   = Auth.currentUser;

  screen.innerHTML = `<div class="pad">Chargement...</div>`;

  try {
    const periods = await DBApp.listPeriods();
    const active = periods.find(p => p.statut === "ouverte");

    if (!active) {
      screen.innerHTML = `<div class="pad">Aucune période active.</div>`;
      return;
    }

    const entries = await DBApp.getEntries(active.FtId, user.siteActif || "");

    let html = `<div class="pad">
      <h2>Mes entrées – ${active.label}</h2>
      <div class="card">`;

    entries.forEach(e => {
      const date = new Date(e.dateJour).toLocaleDateString("fr-CA");
      const icon = e.statut === "soumis"  ? "📤" :
                   e.statut === "approuve"? "✅" :
                   e.statut === "refuse" ? "❌" :
                   "✏️";

      html += `
        <div class="card-row tappable" data-id="${e.id}">
          <div class="card-row-body">
            <div class="card-row-title">${date}</div>
            <div class="card-row-sub">${e.statut}</div>
          </div>
          <div class="card-row-right">${icon}</div>
        </div>
      `;
    });

    html += `</div></div>`;

    screen.innerHTML = html;

    // Navigation vers saisie du jour
    screen.querySelectorAll(".card-row").forEach(row => {
      row.onclick = () => RouterApp.go("entry");
    });

  } catch(err) {
    console.error(err);
    screen.innerHTML = `<div class="pad">Erreur chargement entrées.</div>`;
  }
}