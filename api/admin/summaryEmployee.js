const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");

module.exports = async (context, req) => {
  const claims = verify(req);
  if (!claims || claims.role !== "admin")
    return context.res={status:403};

  const period = req.query.period;
  const userId = req.query.user;

  const entries = await graph.listEntries(period, null, claims);
  const list = entries.filter(e => e.UserId === userId && e.Statut === "approuve");

  const total = list.reduce((s,e)=>s+e.HeuresCalc,0);

  context.res = {
    status:200,
    body:{
      userId,
      period,
      totalHeures: total,
      detail: list
    }
  };
};