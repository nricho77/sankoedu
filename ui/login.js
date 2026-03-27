import { api } from "/js/api.js";
import { setUser } from "/js/auth.js";

export function renderLogin(onSuccess) {
  const root = document.getElementById("login-screen");

  root.innerHTML = `
    <div class="login-card">
      <h2>Connexion</h2>
      <input id="login-email" placeholder="Email" />
      <input id="login-password" type="password" />
      <button id="login-btn" type="button">Se connecter</button>
      <div id="login-error" class="error hidden"></div>
    </div>
  `;

  document.getElementById("login-btn").onclick = async () => {
    console.log("✅ Click sur le bouton login");

    const email = document.getElementById("login-email")?.value?.trim();
    const password = document.getElementById("login-password")?.value || "";

    if (!email) {
      const err = document.getElementById("login-error");
      err.textContent = "Email requis";
      err.classList.remove("hidden");
      return;
    }

    try {
      const user = await api.login(email, password);
      console.log("✅ Login OK, user =", user);

      setUser(user);

      console.log("✅ Appel de onSuccess()");
      onSuccess();

    } catch (e) {
      console.error("❌ Login error", e);
      const err = document.getElementById("login-error");
      err.textContent = "Connexion échouée";
      err.classList.remove("hidden");
    }
  };
}
``
