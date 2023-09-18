describe("f16round()", () => {
  const maxFloat16 = 65504;
  const minFloat16 = 2 ** -24;

  it("property `name` is 'f16round'", () => {
    assert(f16round.name === "f16round");
  });

  it("property `length` is 1", () => {
    assert(f16round.length === 1);
  });

  it("return NaN when value is empty or undefined or NaN", () => {
    assert(Number.isNaN(f16round()));
    assert(Number.isNaN(f16round(undefined)));
    assert(Number.isNaN(f16round(NaN)));
  });

  it("return 0 when value is 0 or null", () => {
    assert(Object.is(f16round(0), 0));
    assert(Object.is(f16round(null), 0));
  });

  it("return -0 when value is -0", () => {
    assert(Object.is(f16round(-0), -0));
  });

  it("return ±Infinity when value is ±Infinity", () => {
    assert(f16round(Infinity) === Infinity);
    assert(f16round(-Infinity) === -Infinity);
  });

  it("return ±Infinity when value is ±Number.MAX_VALUE", () => {
    assert(f16round(Number.MAX_VALUE) === Infinity);
    assert(f16round(-Number.MAX_VALUE) === -Infinity);
  });

  it("return ±0 when value is ±Number.MIN_VALUE", () => {
    assert(Object.is(f16round(Number.MIN_VALUE), 0));
    assert(Object.is(f16round(-Number.MIN_VALUE), -0));
  });

  it("return same value when value is ±float16 max/min value", () => {
    assert(f16round(maxFloat16) === maxFloat16);
    assert(f16round(-maxFloat16) === -maxFloat16);
    assert(f16round(minFloat16) === minFloat16);
    assert(f16round(-minFloat16) === -minFloat16);
  });

  it("return 0 when value is ±float16 min value / 2", () => {
    assert(Object.is(f16round(minFloat16 / 2), 0));
    assert(Object.is(f16round(-minFloat16 / 2), -0));
  });

  it("return ±float16 min value when value is ±float16 min value / 2 ± a bit number", () => {
    assert(f16round(2.980232238769531911744490042422139897126953655970282852649688720703125e-8) === minFloat16);
    assert(f16round(-2.980232238769531911744490042422139897126953655970282852649688720703125e-8) === -minFloat16);
  });

  it("round finite values properly", () => {
    assert(f16round(0.499994) === 0.5);
    assert(f16round(1.337) === 1.3369140625);
  });

  it("throw TypeError when value is bigint", function () {
    assert.throws(() => {
      f16round(BigInt(0));
    }, TypeError);
  });
});
