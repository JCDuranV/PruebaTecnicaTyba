const generateImageHash = require("../src/utils/hashImage");

describe("generateImageHash", () => {
  it("debe generar un hash string", () => {
    const buffer = Buffer.from("test-cat");
    const hash = generateImageHash(buffer);
    expect(typeof hash).toBe("string");
  });

  it("el mismo buffer produce el mismo hash", () => {
    const buffer = Buffer.from("miau");
    const hash1 = generateImageHash(buffer);
    const hash2 = generateImageHash(buffer);
    expect(hash1).toBe(hash2);
  });

  it("buffers distintos producen hashes distintos", () => {
    const hash1 = generateImageHash(Buffer.from("gato"));
    const hash2 = generateImageHash(Buffer.from("perro"));
    expect(hash1).not.toBe(hash2);
  });
});
