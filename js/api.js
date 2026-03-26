export const api = {
  async login(email, password) {
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!r.ok) throw new Error("login failed");
    return r.json();
  }
};
``
