const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");
const crypto = require("crypto");

module.exports = async function (context, req) {
  const claims = verify(req);
  if (!claims || claims.role !== "admin")
    return context.res = { status:403, body:{message:"Accès refusé"} };

  const { prenom, nom, email, role, pw } = req.body;

  if (!prenom || !nom || !email || !role || !pw)
    return context.res = { status:400, body:{message:"Champs requis"} };

  try {
    const hash = crypto.createHash("sha256").update(pw).digest("hex");

    const data = {
      Title: `${nom}, ${prenom}`,
      Prenom: prenom,
      Nom: nom,
      Email: email,
      PwHash: hash,
      Role: role,
      Actif: true
    };

    const created = await graph.createUser(data);
    context.res = { status:200, body: created };

  } catch(err) {
    context.log(err);
    context.res = { status:500, body:{message:"Erreur création utilisateur"} };
  }
};