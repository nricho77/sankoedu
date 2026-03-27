// ======================================================
// ui/appro.js
// Écran d'approbation des entrées de temps
// ======================================================

import { api } from "/js/api.js";
import { isAuthenticated, hasRole } from "/js/auth.js";

/**
 * Point d'entrée de l'écran Approbation
 */
export async function renderAppro() {
  const root = document.getElementById("screens");

  // ------------------------------
  // Sécurité UI (premier niveau)
  // ------------------------------
  if (!isAuthenticated()) {
    root.innerHTML = `
      <div class="screen">
        <h2>Connexion requise</h2>
        <p>Veuillez vous connecter pour accéder à cette section.</p>
      </div>
    `;
    return;
  }

  if (!hasRole("approver") && !hasRole("admin")) {
    root.innerHTML = `
      <div class="screen">
        <h2>Accès refusé</h2>
        <p>Vous n’avez pas les autorisations pour approuver des entrées.</p>
      </div>
    `;
    return;
  }

  // ------------------------------
  // Chargement
  // ------------------------------
  root.innerHTML = `
    <div class="screen">
      <h2>Approbation</h2>
      <p>Chargement des entrées en attente…</p>
    </div>
  `;

  try {
    const entries = await api.getPendingApprovals();

    if (!entries.length) {
      root.innerHTML = `
        <div class="screen">
          <h2>Approbation</h2>
          <p>Aucune entrée en attente d’approbation.</p>
        </div>
      `;
      return;
    }

    // ------------------------------
    // Affichage des entrées
    // ------------------------------
    root.innerHTML = `
      <div class="screen">
        <h2>Approbation des entrées</h2>
        <div class="appro-list">
          ${entries.map(renderEntryRow).join("")}
        </div>
      </div>
    `;

    bindActions();

  } catch (err) {
    console.error("Erreur approbation :", err);
    root.innerHTML = `
      <div class="screen">
        <h2>Erreur</h2>
        <p>Impossible de charger les entrées.</p>
      </div>
    `;
  }
}

/**
 * Génère une ligne d’entrée à approuver
 */
function renderEntryRow(entry) {
  return `
    <div class="appro-card" data-id="${entry.id}">
      <div class="appro-details">
        <strong>${entry.userName || "Employé"}</strong><br/>
        ${entry.date} — ${entry.hours}h<br/>
        <small>${entry.site || ""}</small>
      </div>
      <div class="appro-actions">
        <button class="btn-approve">Approuver</button>
        <button class="btn-reject">Refuser</button>
      </div>
    </div>
  `;
}

/**
 * Attache les événements aux boutons
 */
function bindActions() {
  document.querySelectorAll(".btn-approve").forEach(btn => {
    btn.onclick = async () => {
      const card = btn.closest(".appro-card");
      const id = card.dataset.id;

      await api.approveEntry(id);
      card.remove();
    };
  });

  document.querySelectorAll(".btn-reject").forEach(btn => {
    btn.onclick = async () => {
      const card = btn.closest(".appro-card");
      const id = card.dataset.id;

      const reason = prompt("Motif du refus ?");
      if (!reason) return;

      await api.rejectEntry(id, reason);
      card.remove();
    };
  });
}
