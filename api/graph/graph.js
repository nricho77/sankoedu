const { Client } = require("@microsoft/microsoft-graph-client");
require("isomorphic-fetch");

function getGraphClient() {
  return Client.init({
    authProvider: (done) => {
      done(null, process.env.GRAPH_ACCESS_TOKEN);
    }
  });
}

module.exports = { getGraphClient };
