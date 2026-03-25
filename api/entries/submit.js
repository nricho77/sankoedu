const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");
const crypto = require("crypto");

module.exports = async (context, req) => {
  const claims = verify(req);
  if (!claims) return context.res={status:401};

  const id = req.params.id;

  // Récup entrée
  const entry = await graph.getEntry(id);

  // Générer seal
  const sealStr =
    `${entry.DateJour}\n${entry.TypeJour}\n${entry.Arrivee}\n${entry.Depart}\n${entry.PausePayee}`;
  const seal = crypto.createHash("sha256").update(sealStr+"_ft_seal").digest("hex");

  await graph.updateEntry(id, {
    Statut: "soumis",
    Seal: seal,
    CommentaireRefus: ""
  });

  context.res = { status:200, body:{message:"Soumis"} };
};