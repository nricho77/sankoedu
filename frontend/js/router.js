
// ====================================
// router.js — Navigation entre écrans
// ====================================

import { $all } from "./utils.js";

class Router {

  constructor() {
    this.current = "home";
    this.screens = {};
  }

  register(name, renderFn) {
    this.screens[name] = renderFn;
  }

  async go(name) {
    if (!this.screens[name]) {
      console.warn("Route inconnue:", name);
      return;
    }

    // Masquer tous les écrans
    $all(".screen").forEach(s => s.classList.add("hidden"));

    // Afficher le bon écran
    const el = document.getElementById("screen-" + name);
    el.classList.remove("hidden");

    // Exécuter rendu du module
    this.current = name;
    await this.screensname;

    this.updateNav(name);
  }

  updateNav(active) {
    $all(".nav-item").forEach(b => {
      const r = b.dataset.route;
      if (r === active) b.classList.add("active");
      else b.classList.remove("active");
    });
  }
}

export const RouterApp = new Router();
