const express = require("express");

const app = express();

// Middleware básico
app.use(express.json());

// Endpoint de prueba
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
