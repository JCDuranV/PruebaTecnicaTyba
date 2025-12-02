const express = require("express");
const catRoutes = require("./routes/cat.routes");
const connectDB = require("./db/connection");

const app = express();

connectDB();

app.use(express.json());
app.use("/api", catRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
