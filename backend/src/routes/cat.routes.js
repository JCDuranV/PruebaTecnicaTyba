const express = require("express");
const router = express.Router();

const { getCatImage } = require("../controllers/cat.controller");

router.get("/cat", getCatImage);

module.exports = router;
