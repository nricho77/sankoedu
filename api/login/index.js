module.exports = async function (context, req) {
  let body = req.body;

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
      body: { error: "Email manquant" }
    };
    return;
  }

  const email = body.email.trim();

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
