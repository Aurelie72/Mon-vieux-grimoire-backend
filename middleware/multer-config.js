const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

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

module.exports = (req, res, next) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return next();
    }

    const filePath = path.join("images", req.file.filename);

    try {
      await sharp(filePath)
        .resize(800)
        .webp({ quality: 80 })
        .toFile(filePath + ".webp");

      fs.unlinkSync(filePath);

      req.file.filename = req.file.filename + ".webp";

      next();
    } catch (error) {
      return res.status(500).json({ error: "Erreur optimisation image" });
    }
  });
};
