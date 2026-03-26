const { getGraphClient } = require("../../graph/client");

module.exports = async function (context) {
  const client = getGraphClient();

  const siteId = process.env.SHAREPOINT_SITE_ID;
  const listId = process.env.SP_LIST_USERS;

  const result = await client
    .api(`/sites/${siteId}/lists/${listId}/items?expand=fields`)
    .get();

  context.res = {
    status: 200,
    body: result.value.map(i => i.fields)
  };
};
