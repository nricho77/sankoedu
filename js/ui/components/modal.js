
// ======================================================
// modal.js — composant modal global
// ======================================================

export const Modal = {

  open(htmlContent, options = {}) {
    const overlay = document.getElementById("modal-overlay");
    const modal    = document.getElementById("modal");

    modal.innerHTML = htmlContent;

    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    // Fermer en cliquant à l’extérieur
    overlay.onclick = (e) => {
      if (e.target === overlay) Modal.close();
    };

    // Fermeture par ESC
    document.addEventListener("keydown", Modal._escHandler);
  },

  close() {
    const overlay = document.getElementById("modal-overlay");
    const modal    = document.getElementById("modal");

    overlay.classList.add("hidden");
    modal.innerHTML = "";

    document.body.style.overflow = "";
    document.removeEventListener("keydown", Modal._escHandler);
  },

  _escHandler(e) {
    if (e.key === "Escape") Modal.close();
  }
};
