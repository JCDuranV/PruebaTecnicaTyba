const { fetchRandomCat } = require("../services/cat.service");
const CatImage = require("../db/catImage.model");

async function getCatImage(req, res) {
  try {
    const imageBuffer = await fetchRandomCat();

    const now = new Date();

    // Guardamos en la BD
    await CatImage.create({
      data: imageBuffer,
      createdAt: now,
      lastCalledAt: now
    });

    // Devolvemos la imagen como respuesta HTTP
    res.set("Content-Type", "image/jpeg");
    res.send(imageBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch cat image" });
  }
}

module.exports = {
  getCatImage
};
