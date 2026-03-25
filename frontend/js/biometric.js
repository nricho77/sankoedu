
// ==================================================
// biometric.js — Préparation biométrie (WebAuthn/NFC)
// ==================================================

import { API } from "./api.js";
import { showToast } from "./utils.js";

class BiometricClass {

  constructor() {
    this.available = {
      webauthn: window.PublicKeyCredential !== undefined,
      nfc: "NDEFReader" in window,  // Chrome Android
      external: true // pour futurs lecteurs USB
    };
  }

  // --------------------------------------------------
  // Enregistrement WebAuthn (futur)
  // --------------------------------------------------
  async registerWebAuthn(userId) {
    showToast("Enregistrement biométrique (future)", "default");

    // Préparer API backend
    const challenge = await API.get(`/biometric/register?user=${userId}`);

    // Ici viendra WebAuthn réel — stub :
    return { ok:true };
  }

  // --------------------------------------------------
  // Vérification WebAuthn (future)
  // --------------------------------------------------
  async verifyWebAuthn() {
    showToast("Vérification WebAuthn (future)", "default");

    return { ok:true };
  }

  // --------------------------------------------------
  // Lecture NFC (badge, futur)
  // --------------------------------------------------
  async readNFC() {
    showToast("Scan NFC non encore implémenté", "default");
    return null;
  }

  // --------------------------------------------------
  // Lecture lecteurs externes
  // --------------------------------------------------
  async readExternalReader() {
    showToast("Scan lecteur externe (futur)", "default");
    return null;
  }

  // --------------------------------------------------
  // Simulation (pour tests sans hardware)
  // --------------------------------------------------
  simulateScan() {
    showToast("Scan biométrique simulé ✓", "success");
    return {
      ok:true,
      tag:"SIMULATED_TAG_12345"
    };
  }
}

export const Biometric = new BiometricClass();
