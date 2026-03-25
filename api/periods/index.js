const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");

module.exports = async function (context, req) {
  const claims = verify(req);
  if (!claims) return context.res={status:401};

  const periods = await graph.listPeriods();
  context.res = { status:200, body:periods };
};