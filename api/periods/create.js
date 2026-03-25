const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");

module.exports = async (context, req) => {
  const claims = verify(req);
  if (!claims || claims.role !== "admin")
    return context.res={status:403};

  const { label, start, end, statut } = req.body;

  const data = {
    Title: label,
    Label: label,
    DateDebut: start,
    DateFin: end,
    Statut: statut
  };

  const r = await graph.addPeriod(data);
  context.res = { status:200, body:r };
};