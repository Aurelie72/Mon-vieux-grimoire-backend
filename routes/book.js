const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const bookCtrl = require("../controllers/book");

// Récupérer tous les livres
router.get("/", bookCtrl.getAllBooks);

// Récupérer un livre par ID
router.get("/:id", bookCtrl.getOneBook);

// le top 3 des livres
router.get("/:bestreating", bookCtrl.getBestRating);

// Créer un livre (avec image)
router.post("/", auth, multer, bookCtrl.createBook);

// Modifier un livre (avec ou sans nouvelle image)
router.put("/:id", auth, multer, bookCtrl.modifyBook);

// Supprimer un livre (et son image)
router.delete("/:id", auth, bookCtrl.deleteBook);
// noter un livre
router.post("/:id/rating", auth, bookCtrl.rateBook);

module.exports = router;
