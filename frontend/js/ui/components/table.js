
// ======================================================
// table.js — table responsive dynamique
// ======================================================

export function renderTable(headers = [], rows = [], options = {}) {
  let thead = "<tr>";
  headers.forEach(h => thead += `<th>${h}</th>`);
  thead += "</tr>";

  let tbody = "";
  rows.forEach(row => {
    tbody += "<tr>";
    row.forEach(cell => {
      tbody += `<td>${cell}</td>`;
    });
    tbody += "</tr>";
  });

  return `
    <div class="table-wrap">
      <table>
        <thead>${thead}</thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>
  `;
}
