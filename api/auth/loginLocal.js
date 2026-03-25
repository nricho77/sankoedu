const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const graph = require("../graph/graph");

module.exports = async function (context, req) {
  const { email, password } = req.body;

  if (!email || !password)
    return context.res = { status:400, body:{message:"Missing email/pw"} };

  try {
    // Lire utilisateur SharePoint
    const user = await graph.findUserByEmail(email);
    if (!user)
      return context.res = { status:401, body:{message:"Invalid user"} };

    // Vérifier hash SHA-256
    const hash = crypto.createHash("sha256").update(password).digest("hex");
    if (hash !== user.PwHash)
      return context.res = { status:401, body:{message:"Invalid password"} };

    const token = jwt.sign(
      { uid:user.FtId, role:user.Role, email:user.Email },
      process.env.JWT_SECRET,
      { expiresIn:"12h" }
    );

    context.res = {
      status:200,
      body: { token, user }
    };

  } catch(err) {
    context.log(err);
    context.res = { status:500, body:{message:"Server error"} };
  }
}