const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");

module.exports = async (context, req) => {
  const claims = verify(req);
  if (!claims || claims.role !== "admin")
    return context.res={status:403};

  const { period, site } = req.query;

  const entries = await graph.listEntries(period, site, claims);
  const appr = entries.filter(e => e.Statut === "approuve");

  const group = {};
  appr.forEach(e => {
    if (!group[e.UserId]) group[e.UserId] = 0;
    group[e.UserId] += e.HeuresCalc;
  });

  context.res = { status:200, body:{ site, group } };
};
``