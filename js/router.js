import { renderHome } from "/ui/home.js";
import { renderEntries } from "/ui/entries.js";
import { renderEntry } from "/ui/entry.js";
import { renderAppro } from "/ui/appro.js";
import { renderAdmin } from "/ui/admin.js";
import { renderProfile } from "/ui/profile.js";


const routes = {
  home: renderHome,
  entries: renderEntries,
  entry: renderEntry,
  appro: renderAppro,
  admin: renderAdmin,
  profile: renderProfile
};

export const router = {
  init() {
    document.addEventListener("click", e => {
      const btn = e.target.closest("[data-route]");
      if (btn) this.go(btn.dataset.route);
    });
  },

  go(route) {
    const screen = routes[route];
    if (!screen) return;
    screen();
  }
};
