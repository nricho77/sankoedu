const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");

module.exports = async function (context, req) {
  const claims = verify(req);
  if (!claims || claims.role !== "admin")
    return context.res = { status:403 };

  const userId = req.params.id;

  await graph.updateUser(userId, { Actif:false });
  context.res = { status:200, body:{message:"Désactivé"} };
};