export const api = {
  async health() {
    const r = await fetch("/api/health");
    return r.text();
  },
  async login() {
    const r = await fetch("/api/login", { method: "POST" });
    return { ok: r.ok };
  }
};
