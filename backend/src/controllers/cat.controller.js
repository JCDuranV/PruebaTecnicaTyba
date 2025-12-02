const { fetchRandomCat, fetchVerificationCat } = require("../services/cat.service");
const CatImage = require("../db/catImage.model");
const generateImageHash = require("../utils/hashImage");

async function getCatImage(req, res) {
  try {
    const imageBuffer = await fetchRandomCat();
    await saveOrUpdateImage(imageBuffer);
    res.set("Content-Type", "image/jpeg");
    res.send(imageBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "No se pudo obtener la imagen" });
  }
}

async function getVerificationCat(req, res) {
  try {
    const imageBuffer = await fetchVerificationCat();
    await saveOrUpdateImage(imageBuffer);
    res.set("Content-Type", "image/jpeg");
    res.send(imageBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "No se pudo obtener la imagen" });
  }
}

async function saveOrUpdateImage(imageBuffer) {
  const now = new Date();
  const hash = generateImageHash(imageBuffer);

  let existingImage = await CatImage.findOne({ hash });
  if (existingImage) {
    existingImage.lastCalledAt = now;
    await existingImage.save();
    console.log("Imagen duplicada → actualizando timestamp");
  } else {
    await CatImage.create({
      data: imageBuffer,
      hash,
      createdAt: now,
      lastCalledAt: now
    });
    console.log("Imagen nueva guardada");
  }
}

async function getCatCount(req, res) {
  try {
    const count = await CatImage.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "No se pudo leer las imagenes" });
  }
}

module.exports = {
  getCatImage,
  getVerificationCat,
  getCatCount,
  __test_saveOrUpdateImage: saveOrUpdateImage
};
