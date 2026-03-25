
// ==========================================
// api.js — Client HTTP pour Azure Functions
// ==========================================

import { CONFIG } from "./config.js";
import { showToast } from "./utils.js";
import { Auth } from "./auth.js";

async function request(method, url, data=null) {

  const headers = {
    "Content-Type": "application/json"
  };

  // Ajout token MSAL ou Local JWT
  const token = await Auth.getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (data) options.body = JSON.stringify(data);

  try {
    const res = await fetch(CONFIG.API_BASE + url, options);

    if (!res.ok) {
      let msg = `Erreur ${res.status}`;
      try {
        const err = await res.json();
        msg = err.message || msg;
      } catch(e){}

      showToast(msg, "error");
      throw new Error(msg);
    }

    return await res.json();

  } catch (err) {
    console.error("API ERROR:", method, url, err);
    throw err;
  }
}

export const API = {
  get: (url)        => request("GET",    url),
  post: (url,data)  => request("POST",   url, data),
  put: (url,data)   => request("PUT",    url, data),
  delete: (url)     => request("DELETE", url)
};
