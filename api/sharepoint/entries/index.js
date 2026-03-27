const graph = require("../../graph/graphClient");

module.exports = async function (context, req) {
  const client = await graph();

  const siteId = process.env.SHAREPOINT_SITE_ID;
  const listId = process.env.SP_LIST_ENTRIES;

  const result = await client
    .api(`/sites/${siteId}/lists/${listId}/items?expand=fields`)
    .get();

  context.res = {
    status: 200,
    body: result.value.map(i => ({
      id: i.id,
      user: i.fields.User,
      date: i.fields.Date,
      hours: i.fields.Hours,
      status: i.fields.Status
    }))
  };
};
``
