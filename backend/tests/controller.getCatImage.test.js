const { getCatImage } = require("../src/controllers/cat.controller");
const CatImage = require("../src/db/catImage.model");
const generateImageHash = require("../src/utils/hashImage");

jest.mock("../src/services/cat.service", () => ({
  fetchRandomCat: jest.fn()
}));

jest.mock("../src/db/catImage.model", () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

const { fetchRandomCat } = require("../src/services/cat.service");

describe("getCatImage controller", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      set: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it("responde correctamente con una imagen", async () => {
    const buffer = Buffer.from("imagen-mock");

    fetchRandomCat.mockResolvedValue(buffer);
    CatImage.findOne.mockResolvedValue(null);

    await getCatImage(req, res);

    expect(fetchRandomCat).toHaveBeenCalledTimes(1);
    expect(res.set).toHaveBeenCalledWith("Content-Type", "image/jpeg");
    expect(res.send).toHaveBeenCalledWith(buffer);
  });

  it("maneja errores correctamente", async () => {
    fetchRandomCat.mockRejectedValue(new Error("API Error"));

    await getCatImage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "No se pudo obtener la imagen" });
  });
});
