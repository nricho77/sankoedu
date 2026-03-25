
// ========================================
// utils.js — Fonctions utilitaires globales
// ========================================

// -------- SHA-256 (utilisé pour "seal" des entrées) --------
export async function sha256(str) {
  const data = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2,"0"))
    .join("");
}

// -------- Format heure (HH:MM) → minutes --------
export function hhmmToMinutes(hhmm) {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// -------- Minutes → HH:MM --------
export function minutesToHHMM(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

// -------- Calcul heures travaillées --------
export function computeHours(arrivee, depart, pausePayee) {
  if (!arrivee || !depart) return 0;

  let t = hhmmToMinutes(depart) - hhmmToMinutes(arrivee);
  if (t < 0) return 0;

  // pause automatique si non payée
  if (pausePayee === "Non" && t >= 270) { // 4h30 = 270 min
    t -= 30;
  }
  return t;
}

// -------- Format date YYYY-MM-DD vers objet --------
export function todayISO() {
  return new Date().toISOString().slice(0,10);
}

export function isFerie(dateISO, list) {
  return list.includes(dateISO);
}

// -------- DOM Helper --------
export function $(sel) {
  return document.querySelector(sel);
}

export function $all(sel) {
  return document.querySelectorAll(sel);
}

// -------- Toast Global --------
export function showToast(msg, type="default") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  el.classList.add("show");

  if (type === "error") el.style.background = "var(--red)";
  else if (type === "success") el.style.background = "var(--green)";
  else el.style.background = "var(--t1)";

  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.classList.add("hidden"), 300);
  }, 2500);
}

// -------- Wait (async) --------
export function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}
