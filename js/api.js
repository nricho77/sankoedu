export const api = {
  async login() {
    const r = await fetch("/api/login", { method: "POST" });
    if (!r.ok) throw new Error();
    return r.text();
  },

  async getSharePointData() {
    const r = await fetch("/api/sharepoint");
    return r.json();
  }
};
