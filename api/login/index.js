module.exports = async function (context, req) {
  let body = req.body;

  // Sécurité supplémentaire (Azure peut fournir rawBody)
  if (!body && req.rawBody) {
    try {
      body = JSON.parse(req.rawBody);
    } catch {
      body = null;
    }
  }

  if (!body || !body.email) {
    context.res = {
      status: 400,
      body: {
        error: "Email manquant dans la requête"
      }
    };
    return;
  }

  const email = body.email;

  // Rôles simulés (à connecter plus tard à SharePoint)
  let role = "user";
  if (email.endsWith("@admin.com")) role = "admin";
  if (email.endsWith("@appro.com")) role = "approver";

  context.res = {
    status: 200,
    body: {
      email,
      name: email.split("@")[0],
      role
    }
  };
};
