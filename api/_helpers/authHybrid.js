const verify = require("../auth/verifyToken");

function getHybridIdentity(req) {
  // 1. MSAL (Azure Static Web Apps)
  const principal = req.headers["x-ms-client-principal"];
  if (principal) {
    try {
      const user = JSON.parse(Buffer.from(principal, "base64").toString());
      return {
        method: "msal",
        email: user.userDetails,
        roles: user.userRoles
      };
    } catch {}
  }

  // 2. JWT local
  const claims = verify(req);
  if (claims) {
    return { method: "local", ...claims };
  }

  // 3. Not authenticated
  return null;
}

module.exports = { getHybridIdentity };