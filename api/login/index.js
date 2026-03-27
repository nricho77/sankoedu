module.exports = async function (context, req) {
  let body = req.body;

  // Fallback Azure Functions
  if (!body && req.rawBody) {
    try {
      body = JSON.parse(req.rawBody);
    } catch {
      body = null;
    }
  }

  if (!body || typeof body.email !== "string") {
    context.res = {
      status: 400,
      body: { error: "Email manquant ou invalide" }
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
