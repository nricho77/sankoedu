const graph = require("../../../graph/graphClient");
const { requireRole } = require("../../../_helpers/authz");

module.exports = async function (context, req) {
  try {
    requireRole(req, ["admin", "approver"]);

    const id = req.params.id;
    const client = await graph();

    await client
      .api(`/sites/${process.env.SHAREPOINT_SITE_ID}/lists/${process.env.SP_LIST_ENTRIES}/items/${id}/fields`)
      .update({
        Status: "Approuvé",
        ApprovedOn: new Date().toISOString(),
        ApprovedBy: req.headers["x-user-email"]
      });

    context.res = { status: 200, body: "OK" };
  } catch (e) {
    context.res = { status: e.status || 500, body: e.message };
  }
};
