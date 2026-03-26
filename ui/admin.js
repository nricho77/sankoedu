// =====================================================
// admin.js — panneau d’administration complet
// =====================================================

import { Auth } from "/js/auth.js";
import { DBApp } from "/js/db.js";
import { RouterApp } from "/js/router.js";
import { Modal } from "./components/modal.js";
import { Toast } from "./components/toast.js";
import { renderTable } from "./components/table.js";

export async function renderAdmin() {

  const screen = document.getElementById("screen-admin");
  const user = Auth.currentUser;

  if (!user || user.role !== "admin") {
    screen.innerHTML = `<div class="pad">Accès refusé</div>`;
    return;
  }

  screen.innerHTML = `
    <div class="pad">
      <h2>Administration</h2>

      <div class="tabs">
        <button data-tab="users">Utilisateurs</button>
        <button data-tab="sites">Sites</button>
        <button data-tab="assigns">Affectations</button>
        <button data-tab="periods">Périodes</button>
        <button data-tab="summary">Sommaires</button>
      </div>

      <div id="admin-content" class="pad"></div>
    </div>
  `;

  // Tab click
  screen.querySelectorAll("[data-tab]").forEach(btn => {
    btn.onclick = () => loadTab(btn.dataset.tab);
  });

  loadTab("users"); // défaut

  // =====================================================
  // TABS
  // =====================================================
  async function loadTab(tab) {
    const container = document.getElementById("admin-content");

    if (tab === "users")   return loadUsers(container);
    if (tab === "sites")   return loadSites(container);
    if (tab === "assigns") return loadAssigns(container);
    if (tab === "periods") return loadPeriods(container);
    if (tab === "summary") return loadSummary(container);
  }

  // =====================================================
  // Users
  // =====================================================
  async function loadUsers(el) {
    const users = await DBApp.listUsers();

    const rows = users.map(u => [
      `${u.prenom} ${u.nom}`,
      u.email,
      u.role,
      `<button class="btn btn-sm" data-reset="${u.id}">🔑</button>`
    ]);

    el.innerHTML = `
      <h3>Utilisateurs</h3>
      <button class="btn btn-primary" id="btn-add-u">+ Ajouter</button>
      ${renderTable(["Nom", "Email", "Rôle", ""], rows)}
    `;

    document.getElementById("btn-add-u").onclick = () => {
      Modal.open(`
        <h3>Créer utilisateur</h3>
        <input id="u-prenom" class="ctrl-input" placeholder="Prénom">
        <input id="u-nom" class="ctrl-input" placeholder="Nom">
        <input id="u-email" class="ctrl-input" placeholder="Email">
        <select id="u-role" class="ctrl-select">
          <option>educatrice</option>
          <option>gestionnaire</option>
          <option>admin</option>
        </select>
        <input id="u-pw" class="ctrl-input" type="password" placeholder="Mot de passe">
        <button id="u-save" class="btn btn-primary" style="margin-top:1rem;">Créer</button>
      `);

      document.getElementById("u-save").onclick = async () => {
        await DBApp.createUser({
          prenom: document.getElementById("u-prenom").value,
          nom:    document.getElementById("u-nom").value,
          email:  document.getElementById("u-email").value,
          role:   document.getElementById("u-role").value,
          pw:     document.getElementById("u-pw").value
        });
        Modal.close();
        Toast.show("Utilisateur créé", "success");
        loadUsers(el);
      };
    };

    el.querySelectorAll("[data-reset]").forEach(btn => {
      btn.onclick = async () => {
        await DBApp.resetPassword(btn.dataset.reset);
        Toast.show("Mot de passe réinitialisé", "success");
      };
    });
  }

  // =====================================================
  // Sites
  // =====================================================
  async function loadSites(el) {
    const sites = await DBApp.listSites();

    el.innerHTML = `
      <h3>Sites</h3>
      <button class="btn btn-primary" id="btn-add-s">+ Ajouter</button>
      ${renderTable(["Nom", "Code"], sites.map(s=>[s.Titre, s.Code]))}
    `;

    document.getElementById("btn-add-s").onclick = () => {
      Modal.open(`
        <h3>Nouveau site</h3>
        <input id="s-nom" class="ctrl-input" placeholder="Nom complet">
        <input id="s-code" class="ctrl-input" placeholder="Code (GLPN)">
        <button id="s-save" class="btn btn-primary" style="margin-top:1rem;">Créer</button>
      `);

      document.getElementById("s-save").onclick = async () => {
        await DBApp.createSite({
          nom: document.getElementById("s-nom").value,
          code: document.getElementById("s-code").value
        });
        Modal.close();
        loadSites(el);
      };
    };
  }

  // =====================================================
  // Affectations
  // =====================================================
  async function loadAssigns(el) {
    // Placeholder minimal
    el.innerHTML = `
      <h3>Affectations</h3>
      <p>Écran à compléter selon besoin exact (assignation multi-site).</p>
    `;
  }

  // =====================================================
  // Périodes
  // =====================================================
  async function loadPeriods(el) {
    const periods = await DBApp.listPeriods();

    el.innerHTML = `
      <h3>Périodes</h3>
      <button class="btn btn-primary" id="btn-add-p">+ Créer période</button>
      ${renderTable(["Label","Début","Fin","Statut"], periods.map(p=>[
        p.Label, p.DateDebut, p.DateFin, p.Statut
      ]))}
    `;

    document.getElementById("btn-add-p").onclick = () => {
      Modal.open(`
        <h3>Nouvelle période</h3>
        <input id="p-label" class="ctrl-input" placeholder="Label">
        <input id="p-start" type="date" class="ctrl-input">
        <input id="p-end" type="date" class="ctrl-input">
        <select id="p-status" class="ctrl-select">
          <option>ouverte</option>
          <option>fermee</option>
        </select>
        <button id="p-save" class="btn btn-primary" style="margin-top:1rem;">Créer</button>
      `);

      document.getElementById("p-save").onclick = async () => {
        await DBApp.createPeriod({
          label: document.getElementById("p-label").value,
          start: document.getElementById("p-start").value,
          end:   document.getElementById("p-end").value,
          statut:document.getElementById("p-status").value,
        });
        Modal.close();
        loadPeriods(el);
      };
    };
  }

  // =====================================================
  // Sommaires + export
  // =====================================================
  async function loadSummary(el) {
    const periods = await DBApp.listPeriods();
    const active = periods.find(p => p.statut === "ouverte");

    el.innerHTML = `
      <h3>Sommaires</h3>
      <button id="btn-sum-site" class="btn">Par site</button>
      <button id="btn-sum-user" class="btn">Par employé</button>
      <button id="btn-sum-all"  class="btn btn-primary">Tous les sites</button>
      <button id="btn-csv" class="btn btn-green">⬇ Export CSV</button>

      <div id="sum-result" class="pad"></div>
    `;

    document.getElementById("btn-sum-all").onclick = async () => {
      const data = await DBApp.summaryAll(active.FtId);
      document.getElementById("sum-result").innerHTML =
        `<pre>${JSON.stringify(data,null,2)}</pre>`;
    };

    document.getElementById("btn-csv").onclick = async () => {
      const csv = await DBApp.exportCSV(active.FtId);
      downloadFile("sommaire.csv", csv.csv);
    };
  }

  // Petite fonction utilitaire
  function downloadFile(name, content) {
    const blob = new Blob([content], {type:"text/csv"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }
}
