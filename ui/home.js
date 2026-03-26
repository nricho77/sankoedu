import { api } from "/js/api.js";

export async function renderHome() {
  const root = document.getElementById("screens");
  const data = await api.getSharePointData();

  root.innerHTML = `
    <h2>Accueil</h2>
    <ul>
      ${data.map(d => `<li>${d.nom}</li>`).join("")}
    </ul>
  `;
}
