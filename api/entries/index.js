const verify = require("../auth/verifyToken");
const graph = require("../graph/graph");

module.exports = async (context, req) => {
  const claims = verify(req);
  if (!claims) return context.res={status:401};

  const period = req.query.period;
  const site   = req.query.site || "";

  const entries = await graph.listEntries(period, site, claims);
  context.res = { status:200, body:entries };
};