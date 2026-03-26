module.exports = async function (context) {
  // À brancher ensuite sur Microsoft Graph
  context.res = {
    status: 200,
    body: [
      { id: 1, nom: "Utilisateur A" },
      { id: 2, nom: "Utilisateur B" }
    ]
  };
};
