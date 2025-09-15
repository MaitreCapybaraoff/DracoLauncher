// build.js
const fs = require("fs");
const path = require("path");
const https = require("https");

// Arguments
const args = process.argv.slice(2);
let iconUrl = null;

args.forEach(arg => {
  if (arg.startsWith("--icon=")) {
    iconUrl = arg.split("=")[1];
  }
});

if (!iconUrl) {
  console.error("❌ Erreur: aucune URL fournie. Utilise: node build.js --icon=<url>");
  process.exit(1);
}

const outputDir = "app/assets/images";

// Vérifie que le dossier existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Fonction pour télécharger et sauvegarder
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(`Erreur HTTP ${response.statusCode}`);
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close(() => {
          console.log(`✅ Fichier sauvegardé: ${outputPath}`);
          resolve();
        });
      });
    }).on("error", err => {
      reject(err.message);
    });
  });
}

// Liste des fichiers à générer
const targets = [
  "LoadingSeal.png",
  "minecraft.icns",
  "SealCircle.ico",
  "SealCircle.png"
];

// Téléchargement et duplication
(async () => {
  try {
    for (const filename of targets) {
      const outputPath = path.join(outputDir, filename);
      await downloadFile(iconUrl, outputPath);
    }
    console.log("🎉 Tous les fichiers ont été créés !");
  } catch (err) {
    console.error("❌ Erreur:", err);
  }
})();