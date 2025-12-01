const axios = require("axios");

async function fetchRandomCat() {
  try {
    const response = await axios.get("https://cataas.com/cat", {
      responseType: "arraybuffer",
      headers: {
        "Accept": "image/jpeg"
      },
      maxRedirects: 5 // IMPORTANTE para evitar imagen rota
    });

    return response.data;
  } catch (error) {
    console.error("Error al consumir CATAAS:", error);
    throw new Error("Error fetching cat image");
  }
}

module.exports = {
  fetchRandomCat,
};
