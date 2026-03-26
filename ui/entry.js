// =====================================================
// entry.js — saisie d’une journée
// =====================================================

import { isAuthenticated } from "/js/auth.js";
import { DBApp } from "/js/db.js";
import { router } from "/js/router.js";
import { JOUR_TYPES } from "/js/config.js";
import { computeHours, minutesToHHMM, showToast } from "/js/utils.js";

export async function renderEntry() {

  const screen = document.getElementById("screen-entry");
  const user   = Auth.currentUser;

  if (!user) {
    screen.innerHTML = `<div class="pad">Session expirée.</div>`;
    return;
  }

  screen.innerHTML = `<div class="pad">Chargement...</div>`;

  try {
    // Charger période active
    const periods = await DBApp.listPeriods();
    const active  = periods.find(p => p.statut === "ouverte");

    if (!active) {
      screen.innerHTML = `<div class="pad">Aucune période active.</div>`;
      return;
    }

    // Charger entrée du jour (si existe)
    const today = new Date().toISOString().slice(0,10);
    const entries = await DBApp.getEntries(active.FtId, user.siteActif || "");
    let entry = entries.find(e => e.dateJour === today);

    if (!entry) {
      // Construction brouillon
      entry = {
        dateJour: today,
        typeJour: "reguliere",
        arrivee: "",
        depart: "",
        pausePayee: "Oui",
        statut: "brouillon"
      };
    }

    // ---------- Formulaire ----------
    const html = `
      <div class="pad">
        <h2>Saisie du ${new Date(today).toLocaleDateString("fr-CA")}</h2>

        <div class="form-group">
          <label class="ctrl-label">Type de journée</label>
          <select id="f-type" class="ctrl-select">
            ${JOUR_TYPES.map(t => `
              <option value="${t}" ${entry.typeJour === t ? 'selected' : ''}>
                ${t}
              </option>
            `).join("")}
          </select>
        </div>

        <div class="form-group">
          <label class="ctrl-label">Heure d'arrivée</label>
          <input id="f-arr" type="time" step="60" class="ctrl-input" value="${entry.arrivee || ''}">
        </div>

        <div class="form-group">
          <label class="ctrl-label">Heure de départ</label>
          <input id="f-dep" type="time" step="60" class="ctrl-input" value="${entry.depart || ''}">
        </div>

        <div class="form-group">
          <label class="ctrl-label">Pause payée</label>
          <select id="f-pause" class="ctrl-select">
            <option ${entry.pausePayee==="Oui"?"selected":""}>Oui</option>
            <option ${entry.pausePayee==="Non"?"selected":""}>Non</option>
          </select>
        </div>

        <div class="card">
          <div class="hl-lbl">Heures calculées</div>
          <div id="f-hours" class="hl-val">0h00</div>
        </div>
      </div>

      <div class="sticky-bar">
        <button id="btn-save"  class="btn btn-primary">💾 Sauvegarder</button>
        <button id="btn-submit" class="btn btn-green">📤 Soumettre</button>
      </div>
    `;

    screen.innerHTML = html;

    // ---------- Mise à jour heures dynamique ----------
    function updateHours() {
      const arr = document.getElementById("f-arr").value;
      const dep = document.getElementById("f-dep").value;
      const pause = document.getElementById("f-pause").value;

      const minutes = computeHours(arr, dep, pause);
      document.getElementById("f-hours").textContent =
        minutesToHHMM(minutes) + " h";
    }

    ["f-arr","f-dep","f-pause"].forEach(id => {
      document.getElementById(id).onchange = updateHours;
    });

    updateHours();

    // ---------- Événements ----------
    document.getElementById("btn-save").onclick = async () => {
      entry.typeJour = document.getElementById("f-type").value;
      entry.arrivee  = document.getElementById("f-arr").value;
      entry.depart   = document.getElementById("f-dep").value;
      entry.pausePayee = document.getElementById("f-pause").value;

      await DBApp.saveDraft(entry.id || "new", entry);
      showToast("Brouillon enregistré", "success");
    };

    document.getElementById("btn-submit").onclick = async () => {
      await DBApp.submitEntry(entry.id);
      showToast("Entrée soumise ✓", "success");
      RouterApp.go("entries");
    };

  } catch (err) {
    console.error(err);
    screen.innerHTML = `<div class="pad">Erreur chargement saisie.</div>`;
  }
}
