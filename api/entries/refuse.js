const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");

module.exports = async (context, req) => {
  const claims = verify(req);
  if (!claims || (claims.role !== "gestionnaire" && claims.role !== "admin"))
    return context.res={status:403};

  const id = req.params.id;
  const { comment } = req.body;

  if (!comment)
    return context.res={status:400, body:{message:"Commentaire requis"}};

  await graph.updateEntry(id, {
    Statut: "refuse",
    CommentaireRefus: comment
  });

  context.res = { status:200, body:{message:"Refusé"} };
};