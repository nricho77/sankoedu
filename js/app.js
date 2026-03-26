import { router } from "./router.js";
import { api } from "./api.js";
import { CONFIG } from "./config.js";      // ton fichier existant
import { initBio } from "./biometric.js"; // ton fichier existant

console.log("App démarrée avec config :", CONFIG);

router.init();
