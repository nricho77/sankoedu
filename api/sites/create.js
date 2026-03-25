const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");

module.exports = async function (context, req) {
  const claims = verify(req);
  if (!claims || claims.role !== "admin")
    return context.res = { status:403 };

  const { nom, code } = req.body;

  const data = {
    Title: nom,
    Code: code,
    Actif: true
  };

  const r = await graph.addSite(data);
  context.res = { status:200, body:r };
};