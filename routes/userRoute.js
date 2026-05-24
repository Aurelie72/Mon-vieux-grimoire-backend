const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController");
const loginLimiter = require("../middleware/rateLimit");

router.post("/signup", userCtrl.signup);
router.post("/login", loginLimiter, userCtrl.login);

module.exports = router;
