export const api = {
  async getEntries() {
    const r = await fetch("/api/sharepoint/entries");
    return r.json();
  },

  async approveEntry(id) {
    return fetch(`/api/sharepoint/entries/${id}/approve`, {
      method: "POST"
    });
  }
};
