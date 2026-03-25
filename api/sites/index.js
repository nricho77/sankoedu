const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");

module.exports = async function (context, req) {
  const claims = verify(req);
  if (!claims || claims.role !== "admin")
    return context.res = { status:403 };

  const sites = await graph.listSites();
  context.res = { status:200, body: sites };
};
``