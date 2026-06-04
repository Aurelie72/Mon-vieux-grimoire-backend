require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const helmet = require("helmet");

console.log(">>> APP.JS CHARGÉ DEPUIS :", __filename);

// ****
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

console.log("DNS Node :", dns.getServers());
// ****

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("ERREUR MONGODB :", err));

app.use(express.json());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
  }),
);

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
