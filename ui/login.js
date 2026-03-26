export function renderLogin(onLoginSuccess) {
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
    try {
      await onLoginSuccess();
    } catch (e) {
      const err = document.getElementById("login-error");
      err.textContent = "Échec de connexion";
      err.classList.remove("hidden");
    }
  };
}
