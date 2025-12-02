const express = require("express");
const router = express.Router();

const { getCatImage } = require("../controllers/cat.controller");
const { getCatCount } = require("../controllers/cat.controller");
const { getVerificationCat } = require("../controllers/cat.controller");

router.get("/cat", getCatImage);
router.get("/verification", getVerificationCat);
router.get("/count", getCatCount);

module.exports = router;
