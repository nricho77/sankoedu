
// ================================
// config.js — Configuration globale
// ================================

export const CONFIG = {

  // Mode de fonctionnement : "local" (sans backend) ou "cloud"
  MODE: "cloud",

  // --- API (Azure Functions) ---
  API_BASE: "/api",   // Static Web Apps reverse proxy

  // --- MSAL Auth (Microsoft 365 login) ---
  MSAL: {
    CLIENT_ID: "",            // à remplir par l’admin
    TENANT_ID: "common",      // ou "organizations"
    REDIRECT_URI: window.location.origin + "/",
    AUTHORITY: "https://login.microsoftonline.com/common",
    CACHE: "sessionStorage"
  },

  // --- Session Timeout (minutes) ---
  SESSION_TIMEOUT: 30,

  // --- Format des dates ---
  DATE_FORMAT: "YYYY-MM-DD",

  // --- Jours fériés (configurable) ---
  FERIERS: [
    "2026-01-01",
    "2026-04-06",
    "2026-05-18",
    "2026-06-24",
    "2026-07-01",
    "2026-09-07",
    "2026-10-12",
    "2026-12-25"
  ]
};


// ================================
// Types & Rôles
// ================================

export const JOUR_TYPES = [
  "reguliere",
  "ferie",
  "maladie",
  "vacances",
  "formation",
  "conge"
];


export const ROLES = {
  ADMIN: "admin",
  APPROVER: "approver",
  USER: "user"
};



// ================================
// Breakpoints Responsive
// ================================

export const RESPONSIVE = {
  MOBILE: 480,
  TABLET: 1024
};
