const BASE = "/api";

async function request(url, options = {}) {
  const r = await fetch(BASE + url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!r.ok) {
    const msg = await r.text();
    throw new Error(msg || r.statusText);
  }

  return r.json();
}

export const api = {
  get(url) {
    return request(url);
  },

  post(url, data) {
    return request(url, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  put(url, data) {
    return request(url, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  delete(url) {
    return request(url, {
      method: "DELETE"
    });
  },

  login(email, password) {
    return this.post("/login", { email, password });
  }
};
