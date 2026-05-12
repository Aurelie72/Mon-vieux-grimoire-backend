const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Configuration Multer : stockage dans /images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = path.extname(name);
    callback(null, Date.now() + extension);
  },
});

const upload = multer({ storage: storage }).single("image");

// ⭐ Middleware final : Multer + optimisation Sharp
module.exports = (req, res, next) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Si pas d'image → on continue
    if (!req.file) {
      return next();
    }

    const filePath = path.join("images", req.file.filename);

    try {
      // Optimisation simple : compression + conversion WebP
      await sharp(filePath)
        .resize(800) // largeur max 800px
        .webp({ quality: 80 }) // compression
        .toFile(filePath + ".webp");

      // Supprimer l'image originale
      fs.unlinkSync(filePath);

      // Mettre à jour le nom du fichier dans req.file
      req.file.filename = req.file.filename + ".webp";

      next();
    } catch (error) {
      return res.status(500).json({ error: "Erreur optimisation image" });
    }
  });
};

// const multer = require("multer");

// const MIME_TYPES = {
//   "image/jpg": "jpg",
//   "image/jpeg": "jpg",
//   "image/png": "png",
// };

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "images");
//   },
//   filename: (req, file, callback) => {
//     const name = file.originalname.split(" ").join("_");
//     const extension = MIME_TYPES[file.mimetype];
//     callback(null, name + Date.now() + "." + extension);
//   },
// });

// module.exports = multer({ storage: storage }).single("image");
