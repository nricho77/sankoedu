
// ========================================
// auth.js — Authentification hybride
// ========================================

import { CONFIG } from "./config.js";
import { API } from "./api.js";
import { showToast } from "./utils.js";

// MSAL configuration
let msalApp = null;
if (CONFIG.MSAL.CLIENT_ID) {
  msalApp = new msal.PublicClientApplication({
    auth: {
      clientId: CONFIG.MSAL.CLIENT_ID,
      authority: CONFIG.MSAL.AUTHORITY,
      redirectUri: CONFIG.MSAL.REDIRECT_URI
    },
    cache: {
      cacheLocation: CONFIG.MSAL.CACHE
    }
  });
}


// =========================================================
// Auth class
// =========================================================

class AuthClass {

  constructor() {
    this.currentUser = null;
    this.localToken = null; // JWT provenant du backend
    this.msalAccount = null;
  }

  // -------------------------------------------------------
  // INIT : tenter de restaurer une session locale
  // -------------------------------------------------------
  async init() {
    // Récup token local
    this.localToken = localStorage.getItem("ft_token");

    // Tenter restoration MSAL
    if (msalApp) {
      const accounts = msalApp.getAllAccounts();
      if (accounts.length > 0) {
        this.msalAccount = accounts[0];
      }
    }

    return true;
  }

  // -------------------------------------------------------
  // TOKEN PROVIDER (unifié MSAL / local)
  // -------------------------------------------------------
  async getToken() {
    // Priorité au token MSAL
    if (this.msalAccount) {
      try {
        const result = await msalApp.acquireTokenSilent({
          scopes: ["User.Read"],
          account: this.msalAccount
        });
        return result.accessToken;
      } catch(e) {
        console.warn("MSAL silent failed", e);
      }
    }

    // Sinon JWT local
    return this.localToken;
  }

  // -------------------------------------------------------
  // LOGIN LOCAL (email/password)
  // -------------------------------------------------------
  async loginLocal(email, password) {
    const res = await API.post("/auth/loginLocal", {
      email, password
    });

    this.localToken = res.token;
    localStorage.setItem("ft_token", res.token);
    this.currentUser = res.user;

    showToast("Connexion réussie", "success");
    return true;
  }

  // -------------------------------------------------------
  // LOGIN MICROSOFT (MSAL)
  // -------------------------------------------------------
  async loginMicrosoft() {
    if (!msalApp) throw new Error("Connexion Microsoft non configurée.");

    const result = await msalApp.loginPopup({
      scopes: ["User.Read"]
    });

    this.msalAccount = result.account;

    // Vérification backend via API
    const check = await API.get("/auth/loginMicrosoft");

    this.currentUser = check.user;
    showToast("Connecté avec Microsoft 365", "success");
  }

  // -------------------------------------------------------
  // LOGOUT
  // -------------------------------------------------------
  async logout() {
    // MSAL
    if (msalApp && this.msalAccount) {
      try { await msalApp.logoutPopup(); } catch(e){}
    }

    // Local
    this.localToken = null;
    this.currentUser = null;
    localStorage.removeItem("ft_token");

    showToast("Déconnexion", "default");
  }
}

export const Auth = new AuthClass();
