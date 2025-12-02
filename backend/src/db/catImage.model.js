const mongoose = require("mongoose");

const CatImageSchema = new mongoose.Schema({
  data: Buffer,
  hash: String,         
  createdAt: Date,
  lastCalledAt: Date
});

module.exports = mongoose.model("CatImage", CatImageSchema);
