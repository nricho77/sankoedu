import { api } from "/js/api.js";

export async function renderEntries() {
  const root = document.getElementById("screens");
  const entries = await api.getEntries();

  root.innerHTML = `
    <h2>Mes entrées</h2>
    <ul>
      ${entries.map(e =>
        `<li>${e.Date} – ${e.Hours}h</li>`
      ).join("")}
    </ul>
  `;
}
