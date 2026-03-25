const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");

module.exports = async (context, req) => {
  const claims = verify(req);
  if (!claims || (claims.role !== "gestionnaire" && claims.role !== "admin"))
    return context.res={status:403};

  const id = req.params.id;
  const { banqueGest } = req.body;

  await graph.updateEntry(id, {
    Statut: "approuve",
    BanqueGest: banqueGest || 0
  });

  context.res = { status:200, body:{message:"Approuvé"} };
};