const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");

module.exports = async (context, req) => {
  const claims = verify(req);
  if (!claims || claims.role !== "admin")
    return context.res={status:403};

  const { period } = req.query;

  const entries = await graph.listEntries(period, null, claims);
  const appr = entries.filter(e => e.Statut === "approuve");

  const result = {};
  appr.forEach(e => {
    if (!result[e.SiteId]) result[e.SiteId] = 0;
    result[e.SiteId] += e.HeuresCalc;
  });

  context.res = { status:200, body:result };
};