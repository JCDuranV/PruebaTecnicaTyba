const axios = require("axios");

const ENDPOINT = "https://cataas.com/cat";
const VERIFICATION_URL = "https://cataas.com/cat/oK1thExzt01VM4Tc?position=center";

async function fetchRandomCat() {
  try {
    const response = await axios.get(ENDPOINT, {
      responseType: "arraybuffer",
      headers: {
        "Accept": "image/jpeg"
      },
      maxRedirects: 5 
    });

    return response.data;
  } catch (error) {
    console.error("Error al consumir CATAAS:", error);
    throw new Error("Error fetching cat image");
  }
}

async function fetchVerificationCat() {
  try {
    const response = await axios.get(VERIFICATION_URL, {
      responseType: "arraybuffer",
      headers: { "Accept": "image/jpeg" },
      maxRedirects: 5
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching verification cat:", error);
    throw new Error("Error fetching verification cat image");
  }
}

module.exports = {
  fetchRandomCat,
  fetchVerificationCat
};
