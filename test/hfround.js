/* eslint-env mocha, es2020 */
/* global assert hfround */

describe("hfround()", () => {

  const maxFloat16 = 65504;
  const minFloat16 = 2 ** -24;

  it("property `name` is 'hfround'", () => {
    assert( hfround.name === "hfround" );
  });

  it("property `length` is 1", () => {
    assert( hfround.length === 1 );
  });

  it("return NaN when value is empty or undefined or NaN", () => {
    assert( Number.isNaN( hfround() ) );
    assert( Number.isNaN( hfround(undefined) ) );
    assert( Number.isNaN( hfround(NaN) ) );
  });

  it("return 0 when value is 0 or null", () => {
    assert( Object.is( hfround(0), 0 ) );
    assert( Object.is( hfround(null), 0 ) );
  });

  it("return -0 when value is -0", () => {
    assert( Object.is( hfround(-0), -0 ) );
  });

  it("return ±Infinity when value is ±Infinity", () => {
    assert( hfround(Infinity) === Infinity );
    assert( hfround(-Infinity) === -Infinity );
  });

  it("return ±Infinity when value is ±Number.MAX_VALUE", () => {
    assert( hfround(Number.MAX_VALUE) === Infinity );
    assert( hfround(-Number.MAX_VALUE) === -Infinity );
  });

  it("return ±0 when value is ±Number.MIN_VALUE", () => {
    assert( Object.is( hfround(Number.MIN_VALUE), 0 ) );
    assert( Object.is( hfround(-Number.MIN_VALUE), -0 ) );
  });

  it("return same value when value is ±float16 max/min value", () => {
    assert( hfround(maxFloat16) === maxFloat16 );
    assert( hfround(-maxFloat16) === -maxFloat16 );
    assert( hfround(minFloat16) === minFloat16 );
    assert( hfround(-minFloat16) === -minFloat16 );
  });

  it("return 0 when value is ±float16 min value / 2", () => {
    assert( Object.is( hfround(minFloat16 / 2), 0 ) );
    assert( Object.is( hfround(-minFloat16 / 2), -0 ) );
  });

  it("return ±float16 min value when value is ±float16 min value / 2 ± a bit number", () => {
    assert( hfround(minFloat16 / 2 + 2 ** -25) === minFloat16 );
    assert( hfround(-minFloat16 / 2 - 2 ** -25) === -minFloat16 );
  });

  it("return 1.3369140625 when value is 1.337", () => {
    assert( hfround(1.337) === 1.3369140625 );
  });

  it("throw TypeError when value is bigint", function () {
    // Safari 13 doesn't have BigInt
    if (typeof BigInt === "undefined") {
      this.skip();
    }

    assert.throws(() => { hfround(BigInt(0)); }, TypeError);
  });
});
