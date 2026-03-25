const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");
const crypto = require("crypto");

module.exports = async function (context, req) {
  const claims = verify(req);
  if (!claims || claims.role !== "admin")
    return context.res = { status:403 };

  const userId = req.params.id;

  const newPw = "FT" + Math.floor(1000 + Math.random()*9000) + "!";
  const hash  = crypto.createHash("sha256").update(newPw).digest("hex");

  await graph.updateUser(userId, { PwHash: hash });

  context.res = { status:200, body:{ tempPw:newPw } };
};