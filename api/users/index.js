const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");

module.exports = async function (context, req) {
  const claims = verify(req);
  if (!claims || claims.role !== "admin")
    return context.res = { status:403, body:{message:"Accès refusé"} };

  try {
    const users = await graph.listUsers();
    context.res = { status:200, body: users };
  } catch(err) {
    context.log(err);
    context.res = { status:500, body:{message:"Erreur serveur"} };
  }
}