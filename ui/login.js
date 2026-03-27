import { api } from "/js/api.js";
import { setUser } from "/js/auth.js";

export function renderLogin(onSuccess) {
  const root = document.getElementById("login-screen");


root.innerHTML = `
  <div class="login-card">
    <h2>Connexion</h2>
    <input id="login-email" placeholder="Email" />
    <input id="login-password" type="password" placeholder="Mot de passe" />
    <button id="login-btn" type="button">Se connecter</button>
    <div id="login-error" class="error hidden"></div>
  </div>
`;


  document.getElementById("login-btn").onclick = async () => {
    const emailInput = document.getElementById("login-email")
    const passwordInput = document.getElementById("login-password");

    
    if (!emailInput || !emailInput.value.trim()) {
      throw new Error("Email manquant côté UI");
    }

    const email = emailInput.value.trim();
    const password = passwordInput?.value || "";
  };
}
