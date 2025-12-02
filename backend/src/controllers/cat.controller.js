const { fetchRandomCat } = require("../services/cat.service");
const CatImage = require("../db/catImage.model");
const generateImageHash = require("../utils/hashImage");

async function getCatImage(req, res) {
  try {
    const imageBuffer = await fetchRandomCat();

    const now = new Date();

    // Calcular hash de la imagen
    const hash = generateImageHash(imageBuffer);

    // Buscar si esa imagen ya existe
    let existingImage = await CatImage.findOne({ hash });

    if (existingImage) {
      // Ya existe → solo actualizar lastCalledAt
      existingImage.lastCalledAt = now;
      await existingImage.save();

      console.log("Imagen duplicada → actualizando timestamp");
    } else {
      // No existe → guardar como nueva
      await CatImage.create({
        data: imageBuffer,
        hash,
        createdAt: now,
        lastCalledAt: now
      });

      console.log("Imagen nueva guardada");
    }

    // Devolver la imagen
    res.set("Content-Type", "image/jpeg");
    res.send(imageBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch cat image" });
  }
}

async function getCatCount(req, res) {
  try {
    const count = await CatImage.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not count images" });
  }
}

module.exports = {
  getCatImage,
  getCatCount
};
