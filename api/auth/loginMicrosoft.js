const graph = require("../graph/graph");

module.exports = async function(context, req) {

  const email = req.headers["x-ms-client-principal-name"];
  if (!email)
    return context.res = { status:401, body:{message:"No Microsoft account"} };

  const user = await graph.findUserByEmail(email);
  if (!user)
    return context.res = { status:403, body:{message:"User not registered"} };

  context.res = { status:200, body:{ user } };
};