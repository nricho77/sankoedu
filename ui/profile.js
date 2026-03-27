// =====================================================
// profile.js — écran Profil utilisateur
// =====================================================

import { isAuthenticated } from "/js/auth.js";
import { DBApp } from "/js/db.js";
import { Toast } from "/ui/components/toast.js";

export async function renderProfile() {

  const screen = document.getElementById("screen-profile");
  const u = Auth.currentUser;

  if (!u) {
    screen.innerHTML = `<div class='pad'>Session expirée.</div>`;
    return;
  }

  screen.innerHTML = `
    <div class="profile-hero">
      <div class="profile-av">${u.prenom[0]}</div>
      <div>
        <div class="profile-name">${u.prenom} ${u.nom}</div>
        <div class="profile-role">${u.role}</div>
        <div class="profile-sites">${u.sites?.join(", ") || ""}</div>
      </div>
    </div>

    <div class="pad">
      <div class="section-title">Changer mot de passe</div>
      <div class="card" style="padding:1rem;">
        <input id="pw-old" class="ctrl-input" type="password" placeholder="Mot de passe actuel">
        <input id="pw-new" class="ctrl-input" type="password" placeholder="Nouveau mot de passe">
        <input id="pw-conf" class="ctrl-input" type="password" placeholder="Confirmer mot de passe">

        <button id="btn-pw" class="btn btn-primary" style="width:100%;margin-top:1rem;">
          Mettre à jour
        </button>
      </div>

      <button id="btn-logout" class="btn btn-ghost" style="width:100%;margin-top:1rem;">
        Se déconnecter
      </button>
    </div>
  `;

  document.getElementById("btn-pw").onclick = async () => {
    const old = document.getElementById("pw-old").value;
    const nw  = document.getElementById("pw-new").value;
    const cf  = document.getElementById("pw-conf").value;

    if (nw !== cf) return Toast.show("Les mots de passe ne correspondent pas", "error");

    try {
      await DBApp.updateUser(u.id, { oldPw: old, newPw: nw });
      Toast.show("Mot de passe mis à jour", "success");
    } catch {
      Toast.show("Erreur mise à jour", "error");
    }
  };

  document.getElementById("btn-logout").onclick = () => {
    Auth.logout();
    location.reload();
  };
}
