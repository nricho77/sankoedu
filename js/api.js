// ======================================================
// js/api.js
// Centralise TOUS les appels vers /api
// ======================================================

async function request(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });

    // Tentative de parsing JSON ou texte
    const contentType = response.headers.get("content-type");
    const data =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
      // Erreur contrôlée
      throw {
        status: response.status,
        data
      };
    }

    return data;
  } catch (err) {
    console.error("[API ERROR]", url, err);
    throw err;
  }
}

// ======================================================
// API publique utilisée par le frontend
// ======================================================
export const api = {
  // ---------- AUTH ----------
  async login(email, password) {
    return request("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  },

  async logout() {
    // backend optionnel plus tard
    return Promise.resolve();
  },

  // ---------- HEALTH ----------
  async health() {
    return request("/api/health");
  },

  // ---------- SHAREPOINT (LECTURE) ----------
  async getUsers() {
    return request("/api/sharepoint/users");
  },

  async getEntries() {
    return request("/api/sharepoint/entries");
  },

  async getMyEntries(userId) {
    return request(`/api/sharepoint/entries?userId=${encodeURIComponent(userId)}`);
  },

  // ---------- ENTRIES ----------
  async createEntry(entry) {
    return request("/api/sharepoint/entries", {
      method: "POST",
      body: JSON.stringify(entry)
    });
  },

  async updateEntry(entryId, data) {
    return request(`/api/sharepoint/entries/${entryId}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  // ---------- APPROBATION ----------
  async getPendingApprovals() {
    return request("/api/sharepoint/entries/pending");
  },

  async approveEntry(entryId) {
    return request(`/api/sharepoint/entries/${entryId}/approve`, {
      method: "POST"
    });
  },

  async rejectEntry(entryId, reason) {
    return request(`/api/sharepoint/entries/${entryId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason })
    });
  }
};
