import { api } from "../js/api.js";
import { setUser } from "../js/auth.js";

export function renderLogin(onSuccess) {
  const root = document.getElementById("login-screen");

  root.innerHTML = `
    <div class="login-card">
      <h2>Connexion</h2>
      <input id="login-email" placeholder="Email" />
      <input id="login-password" type="password" placeholder="Mot de passe" />
      <button id="login-btn">Se connecter</button>
      <div id="login-error" class="error hidden"></div>
    </div>
  `;

  document.getElementById("login-btn").onclick = async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const user = await api.login(email, password);
      setUser(user);
      onSuccess();
    } catch {
      const err = document.getElementById("login-error");
      err.textContent = "Connexion échouée";
      err.classList.remove("hidden");
    }
  };
}
