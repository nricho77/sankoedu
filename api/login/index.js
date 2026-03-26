module.exports = async function (context, req) {
  const { email } = req.body || {};

  if (!email) {
    context.res = { status: 400, body: "Email requis" };
    return;
  }

  // ⛏️ À remplacer plus tard par SharePoint FT_Users
  let role = "user";
  if (email.endsWith("@admin.com")) role = "admin";
  if (email.endsWith("@appro.com")) role = "approver";

  context.res = {
    status: 200,
    body: {
      email,
      role,
      name: email.split("@")[0]
    }
  };
};
