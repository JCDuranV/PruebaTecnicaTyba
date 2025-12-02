jest.mock("../src/db/catImage.model", () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

const CatImage = require("../src/db/catImage.model");
const generateImageHash = require("../src/utils/hashImage");
const { __test_saveOrUpdateImage: saveOrUpdateImage } = require("../src/controllers/cat.controller");

// Mock de fecha real
const nowMock = new Date();

describe("saveOrUpdateImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(nowMock);
  });

  it("crea una nueva imagen si el hash no existe", async () => {
    CatImage.findOne.mockResolvedValue(null);

    const buffer = Buffer.from("imagen-nueva");
    await saveOrUpdateImage(buffer, { originalUrl: "/api/cat" });

    expect(CatImage.create).toHaveBeenCalledTimes(1);
    const expectedHash = generateImageHash(buffer);

    expect(CatImage.create).toHaveBeenCalledWith({
      data: buffer,
      hash: expectedHash,
      createdAt: nowMock,
      lastCalledAt: nowMock
    });
  });

  it("actualiza lastCalledAt si la imagen ya existe", async () => {
    const saveMock = jest.fn();
    CatImage.findOne.mockResolvedValue({
      lastCalledAt: nowMock,
      save: saveMock
    });

    const buffer = Buffer.from("imagen-duplicada");
    await saveOrUpdateImage(buffer, { originalUrl: "/api/cat" });

    expect(saveMock).toHaveBeenCalled();
    expect(CatImage.create).not.toHaveBeenCalled();
  });
});
