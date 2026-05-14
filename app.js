require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");

console.log(">>> APP.JS CHARGÉ DEPUIS :", __filename);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("ERREUR MONGODB :", err));

app.use(express.json());

// AJOUT DU CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Votre serveur Express fonctionne !" });
});

const userRoutes = require("./routes/userRoute");
app.use("/api/auth", userRoutes);

const bookRoutes = require("./routes/bookRoute");
app.use("/api/books", bookRoutes);

module.exports = app;
