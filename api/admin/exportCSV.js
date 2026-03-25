const verify = require("../auth/verifyToken");
const graph  = require("../graph/graph");

module.exports = async (context, req) => {
  const claims = verify(req);
  if (!claims || claims.role !== "admin")
    return context.res={status:403};

  const { period } = req.query;

  const entries = await graph.listEntries(period, null, claims);
  const appr = entries.filter(e => e.Statut === "approuve");

  let csv = "Date;Employé;Site;Heures;Type;Banque\n";

  appr.forEach(e => {
    csv += [
      e.DateJour,
      `${e.Prenom} ${e.Nom}`,
      e.SiteCode,
      e.HeuresCalc,
      e.TypeJour,
      e.BanqueGest || 0
    ].join(";") + "\n";
  });

  context.res = {
    status:200,
    headers:{
      "Content-Type":"text/csv",
      "Content-Disposition":"attachment; filename=export.csv"
    },
    body: csv
  };
};