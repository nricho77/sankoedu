const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");

module.exports = async (context, req) => {
  const claims = verify(req);
  if (!claims) return context.res={status:401};

  const id = req.params.id;
  const data = req.body;

  await graph.updateEntry(id, data);
  context.res = { status:200, body:{message:"Sauvé"} };
};
