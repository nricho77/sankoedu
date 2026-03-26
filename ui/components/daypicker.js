
// ======================================================
// daypicker.js — sélection de dates intelligente
// ======================================================

import { isFerie } from "../../utils.js";

export function renderDayPicker(periodDays, currentDay, entries = {}) {

  let html = `<div class="daypicker">`;

  html += `<div class="dp-grid">`;

  periodDays.forEach(d => {
    const entry = entries[d];
    let cls = "dp-item";

    if (d === currentDay) cls += " active";
    if (isFerie(d, [])) cls += " ferie";

    if (entry) {
      if (entry.statut === "soumis") cls += " dot-blue";
      if (entry.statut === "approuve") cls += " dot-green";
      if (entry.statut === "refuse") cls += " dot-red";
      if (entry.statut === "brouillon") cls += " dot-gray";
    }

    const label = new Date(d).toLocaleDateString("fr-CA", {
      weekday:"short", day:"numeric"
    });

    html += `
      <div class="${cls}" data-date="${d}">
        ${label}
      </div>
    `;
  });

  html += `</div></div>`;

  return html;
}
