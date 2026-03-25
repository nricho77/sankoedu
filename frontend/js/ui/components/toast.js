
// ======================================================
// toast.js — système de toast amélioré
// ======================================================

class ToastSystem {

  constructor() {
    this.queue = [];
    this.active = false;
  }

  show(message, type="default", duration=2500) {
    this.queue.push({ message, type, duration });
    this._process();
  }

  _process() {
    if (this.active || this.queue.length === 0) return;

    const { message, type, duration } = this.queue.shift();
    this.active = true;

    const el = document.getElementById("toast");
    el.textContent = message;

    if (type === "success") el.style.background = "var(--green)";
    else if (type === "error") el.style.background = "var(--red)";
    else el.style.background = "var(--t1)";

    el.classList.remove("hidden");

    setTimeout(() => el.classList.add("show"), 20);

    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => {
        el.classList.add("hidden");
        this.active = false;
        this._process();
      }, 300);
    }, duration);
  }
}

export const Toast = new ToastSystem();
