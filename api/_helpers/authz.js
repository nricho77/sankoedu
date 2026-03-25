// ======================================================
// authz.js — Vérification des rôles + extraction claims
// ======================================================
const verify = require("../auth/verifyToken");

function mustAuth(req) {
  const claims = verify(req);
  if (!claims) throw { status: 401, message: "Authentification requise." };
  return claims;
}

function mustBe(role, claims) {
  if (claims.role !== role)
    throw { status: 403, message: "Permissions insuffisantes." };
}

function mustBeOneOf(roles, claims) {
  if (!roles.includes(claims.role))
    throw { status: 403, message: "Rôle insuffisant." };
}

module.exports = { mustAuth, mustBe, mustBeOneOf };