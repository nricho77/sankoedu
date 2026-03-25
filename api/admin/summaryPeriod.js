const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");

module.exports = async (context, req) => {
  const claims = verify(req);
  if (!claims || claims.role !== "admin")
    return context.res={status:403};

  const { period } = req.query;

  const entries = await graph.listEntries(period, null, claims);
  const appr = entries.filter(e => e.Statut === "approuve");

  const total = appr.reduce((s,e)=>s+e.HeuresCalc,0);

  context.res = {
    status:200,
    body:{
      period,
      totalHeures: total,
      count: appr.length
    }
  };
};