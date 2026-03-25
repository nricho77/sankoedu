// ======================================================
// /api/setup/init.js — Installation initiale
// ======================================================

const crypto = require("crypto");
const graph  = require("../graph/graph");

module.exports = async function (context, req) {

  const { org, first, last, email, pw } = req.body || {};

  // ------------------------------
  // 1. Vérifier si déjà configuré
  // ------------------------------
  const existing = await graph.configExists();
  if (existing) {
    return context.res = {
      status: 400,
      body: { message: "L'application est déjà configurée." }
    };
  }

  // ------------------------------
  // 2. Validation rapide
  // ------------------------------
  if (!org || !first || !last || !email || !pw) {
    return context.res = {
      status: 400,
      body: { message: "Champs requis manquants." }
    };
  }

  try {
    // ------------------------------
    // 3. Créer config globale
    // ------------------------------
    await graph.createConfig({
      Title: "FT_Config",
      Organisation: org,
      SetupDone: true,
      DateSetup: new Date().toISOString()
    });

    // ------------------------------
    // 4. Créer admin
    // ------------------------------
    const hash = crypto.createHash("sha256").update(pw).digest("hex");

    await graph.createUser({
      Title: `${last}, ${first}`,
      Prenom: first,
      Nom: last,
      Email: email.toLowerCase(),
      PwHash: hash,
      Role: "admin",
      Actif: true
    });

    // ------------------------------
    // 5. Optionnel — créer site défaut
    // ------------------------------
    await graph.addSite({
      Title: org + " - Siège",
      Code: "HQ",
      Actif: true
    });

    // ------------------------------
    // 6. Réponse OK
    // ------------------------------
    context.res = {
      status: 200,
      body: { message: "Setup terminé avec succès." }
    };

  } catch (err) {
    context.log(err);
    context.res = {
      status: 500,
      body: { message: "Erreur serveur pendant le setup." }
    };
  }
};