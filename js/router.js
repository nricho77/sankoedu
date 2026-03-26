
// ====================================
// router.js — Navigation entre écrans
// ====================================

import { renderHome }    from "../ui/home.js";
import { renderEntries } from "../ui/entries.js";
import { renderEntry }   from "../ui/entry.js";
import { renderAppro }   from "../ui/appro.js";
import { renderAdmin }   from "../ui/admin.js";
import { renderProfile } from "../ui/profile.js";

const routes = {
  home: renderHome,
  entries: renderEntries,
  entry: renderEntry,
  appro: renderAppro,
  admin: renderAdmin,
  profile: renderProfile
};

export const router = {
  current: null,

  init() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-route]");
      if (!btn) return;
      const route = btn.dataset.route;
      this.go(route);
    });
  },

  go(name, params = {}) {
    const fn = routes[name];
    if (!fn) {
      console.warn("Route inconnue:", name);
      return;
    }
    this.current = name;
    fn(params);
  }
};
