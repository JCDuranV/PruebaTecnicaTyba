const mongoose = require("mongoose");

const CatImageSchema = new mongoose.Schema({
  data: Buffer,          // Imagen en binario
  createdAt: Date,       // Primera vez que se generó
  lastCalledAt: Date     // Última vez que se pidió ese mismo gato
});

module.exports = mongoose.model("CatImage", CatImageSchema);
