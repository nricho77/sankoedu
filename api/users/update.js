const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");
const crypto = require("crypto");

module.exports = async function (context, req) {
  const claims = verify(req);
  if (!claims) return context.res = { status:401 };

  const userId = req.params.id;
  const { oldPw, newPw } = req.body;

  try {
    const user = await graph.getUserById(userId);

    if (claims.uid !== user.FtId && claims.role !== "admin")
      return context.res = { status:403, body:{message:"Accès refusé"} };

    const oldHash = crypto.createHash("sha256").update(oldPw).digest("hex");
    if (oldHash !== user.PwHash)
      return context.res = { status:400, body:{message:"Mot de passe invalide"} };

    const newHash = crypto.createHash("sha256").update(newPw).digest("hex");

    await graph.updateUser(userId, { PwHash: newHash });
    context.res = { status:200, body:{message:"OK"} };

  } catch(err) {
    context.res = { status:500, body:{message:"Erreur serveur"} };
  }
};