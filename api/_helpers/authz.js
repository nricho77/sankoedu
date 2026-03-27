// ======================================================
// authz.js — Vérification des rôles + extraction claims
// ======================================================
function requireRole(req, roles) {
  const role = req.headers["x-user-role"];
  if (!roles.includes(role)) {
    throw { status: 403, message: "Accès interdit" };
  }
}

module.exports = { requireRole };
