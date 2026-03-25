const axios = require("axios");
const qs = require("qs");

// =======================================================
// 1. TOKEN (Client Credentials → App Graph)
// =======================================================
async function getToken() {
  const tenant  = process.env.TENANT_ID;
  const client  = process.env.CLIENT_ID;
  const secret  = process.env.CLIENT_SECRET;

  const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;

  const body = qs.stringify({
    grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default",
    client_id: client,
    client_secret: secret
  });

  const res = await axios.post(url, body, {
    headers: { "Content-Type":"application/x-www-form-urlencoded" }
  });

  return res.data.access_token;
}


// =======================================================
// 2. Liste SharePoint helpers
// =======================================================
async function spList(listName) {
  const site = process.env.SHAREPOINT_SITE;
  const base = `${site}/_api/web/lists/getByTitle('${listName}')/items`;
  return base;
}


// =======================================================
// 3. Opérations CRUD simplifiées
// =======================================================
async function spGet(list, filter="") {
  const token = await getToken();
  const url = `${await spList(list)}?$top=5000${filter}`;

  const res = await axios.get(url, {
    headers:{ "Authorization":`Bearer ${token}` }
  });

  return res.data.value;
}

async function spAdd(list, data) {
  const token = await getToken();

  const res = await axios.post(await spList(list), data, {
    headers:{
      "Authorization":`Bearer ${token}`,
      "Content-Type":"application/json;odata=verbose",
      "Accept":"application/json;odata=verbose"
    }
  });

  return res.data;
}

async function spUpdate(list, id, data) {
  const token = await getToken();
  const url = `${await spList(list)}(${id})`;

  const res = await axios.post(url, data, {
    headers:{
      "Authorization":`Bearer ${token}`,
      "Content-Type":"application/json;odata=verbose",
      "IF-MATCH":"*",
      "X-HTTP-Method":"MERGE"
    }
  });

  return res.data;
}


// =======================================================
// 4. API métier (exemples)
// =======================================================
module.exports = {

  // -------- USERS --------
  async findUserByEmail(email) {
    const items = await spGet(process.env.SP_LIST_USERS,
      `&$filter=Email eq '${email}'`
    );
    return items?.[0] || null;
  },

  async listUsers() {
    return await spGet(process.env.SP_LIST_USERS);
  },

  async createUser(data) {
    return spAdd(process.env.SP_LIST_USERS, data);
  },
  // =======================================================
// CONFIG FT_Config
// =======================================================

	async function configExists() {
	  const list = process.env.SP_LIST_CONFIG || "FT_Config";
	  const items = await spGet(list);
	  return items.length > 0 ? items[0] : null;
	}

	async function createConfig(data) {
	  const list = process.env.SP_LIST_CONFIG || "FT_Config";
	  return spAdd(list, data);
	}

module.exports = {
  // ...déjà présent...
  configExists,
  createConfig,
  // autres exports...
};
  // ... (idem pour Sites, Periods, Entries, Assigns)
};