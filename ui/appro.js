// =====================================================
// appro.js — Approbation des entrées
// =====================================================

import { hasRole, isAuthenticated } from "/js/auth.js";
import { DBApp } from "/js/db.js";
import { router } from "/js/router.js";
import { Modal } from "/ui/components/modal.js";
import { Toast } from "/ui/components/toast.js";

export async function renderAppro() {

  const screen = document.getElementById("screen-appro");
  const user = Auth.currentUser;

  if (!user || (user.role !== "gestionnaire" && user.role !== "admin")) {
    screen.innerHTML = `<div class="pad">Accès refusé</div>`;
    return;
  }

  screen.innerHTML = `<div class="pad">Chargement...</div>`;

  try {
    const periods = await DBApp.listPeriods();
    const active = periods.find(p => p.statut === "ouverte");

    if (!active) {
      screen.innerHTML = `<div class="pad">Aucune période active.</div>`;
      return;
    }

    const sites = await DBApp.listSites();
    const entries = await DBApp.getEntries(active.FtId, null);

    // Filtrer : uniquement les entrées "soumis"
    const pending = entries.filter(e => e.statut === "soumis");

    // Grouper par utilisateur
    const grouped = {};
    pending.forEach(e => {
      if (!grouped[e.userId]) grouped[e.userId] = [];
      grouped[e.userId].push(e);
    });

    let html = `
      <div class="pad">
        <h2>Entrées à approuver</h2>
        <div class="card">
    `;

    for (const uid in grouped) {
      const userEntries = grouped[uid];
      const totalHours = userEntries.reduce((s,e)=>s+e.heuresCalc,0);

      html += `
        <div class="card-row tappable" data-uid="${uid}">
          <div class="card-row-body">
            <div class="card-row-title">${userEntries[0].prenom} ${userEntries[0].nom}</div>
            <div class="card-row-sub">${userEntries.length} entrées — ${totalHours} h</div>
          </div>
          <div class="card-row-right">›</div>
        </div>
      `;
    }

    html += `</div></div>`;
    screen.innerHTML = html;

    // click → détail employé
    screen.querySelectorAll("[data-uid]").forEach(row => {
      row.onclick = () => renderApproDetail(row.dataset.uid, active.FtId);
    });

  } catch(err) {
    screen.innerHTML = `<div class="pad">Erreur chargement.</div>`;
  }
}


// =====================================================
// DÉTAIL EMPLOYÉ
// =====================================================
export async function renderApproDetail(userId, periodId) {

  const screen = document.getElementById("screen-appro");
  screen.innerHTML = `<div class="pad">Chargement…</div>`;

  const entries = await DBApp.getEntries(periodId, null);
  const list = entries.filter(e => e.userId === userId && e.statut === "soumis");

  let html = `
    <div class="pad">
      <button class="topbar-back" onclick="RouterApp.go('appro')">‹ Retour</button>
      <h2>${list[0].prenom} ${list[0].nom}</h2>
      <div class="card">
  `;

  list.forEach(e => {
    const date = new Date(e.dateJour).toLocaleDateString("fr-CA");

    html += `
      <div class="card-row">
        <div class="card-row-body">
          <div class="card-row-title">${date}</div>
          <div class="card-row-sub">${e.typeJour}</div>
          <div class="card-row-sub">Heures: ${e.heuresCalc}</div>
        </div>
      </div>
    `;
  });

  html += `
      </div>

      <div class="pad">
        <label class="ctrl-label">Banque (heures sup.)</label>
        <input id="bank-gest" type="number" class="ctrl-input" step="0.25" value="0">

        <button id="btn-approve-all" class="btn btn-green" style="width:100%;margin-top:1rem;">
          ✅ Approuver toutes les entrées
        </button>

        <button id="btn-refuse-all" class="btn btn-red" style="width:100%;margin-top:.7rem;">
          ❌ Refuser (avec commentaire)
        </button>
      </div>
    </div>
  `;

  screen.innerHTML = html;

  // Approuver
  document.getElementById("btn-approve-all").onclick = async () => {
    const val = parseFloat(document.getElementById("bank-gest").value || 0);

    for (const e of list) {
      await DBApp.approveEntry(e.id, val);
    }
    Toast.show("Entrées approuvées ✓", "success");
    RouterApp.go("appro");
  };

  // Refuser
  document.getElementById("btn-refuse-all").onclick = () => {
    Modal.open(`
      <h3>Motif de refus</h3>
      <textarea id="ref-txt" class="ctrl-textarea" placeholder="Expliquez ici…"></textarea>
      <div style="text-align:right;margin-top:1rem;">
        <button class="btn btn-red" id="ref-do">Refuser</button>
      </div>
    `);

    document.getElementById("ref-do").onclick = async () => {
      const comment = document.getElementById("ref-txt").value.trim();
      if (!comment) {
        Toast.show("Commentaire requis", "error");
        return;
      }
      for (const e of list) await DBApp.refuseEntry(e.id, comment);
      Modal.close();
      Toast.show("Entrées refusées", "default");
      RouterApp.go("appro");
    };
  };
}
