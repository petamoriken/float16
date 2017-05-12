(function() {

const maxFloat16 = 65504;
const minFloat16 = 2 ** -24;

function isPlusZero(num) {
    return num === 0 && 1 / num === Infinity;
}

function isMinusZero(num) {
    return num === 0 && 1 / num === -Infinity;
}


describe("hfround()", () => {

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
        assert( isPlusZero( hfround(0) ) );
        assert( isPlusZero( hfround(null) ) );
    });

    it("return -0 when value is -0", () => {
        assert( isMinusZero( hfround(-0) ) );
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
        assert( isPlusZero( hfround(Number.MIN_VALUE) ) );
        assert( isMinusZero( hfround(-Number.MIN_VALUE) ) );
    });

    it("return same value when value is ±float16 max/min value", () => {
        assert( hfround(maxFloat16) === maxFloat16 );
        assert( hfround(-maxFloat16) === -maxFloat16 );
        assert( hfround(minFloat16) === minFloat16 );
        assert( hfround(-minFloat16) === -minFloat16 );
    });

    it("return same value when value is float16 max value + a bit number", () => {
        assert( hfround(maxFloat16 + 2 ** (2 ** (5 - 1) - 1 - 10 - 2)) === maxFloat16 );
    });

    it("return 0 when value is ±float16 min value / 2", () => {
        assert( isPlusZero( hfround(minFloat16 / 2) ) );
        assert( isMinusZero( hfround(-minFloat16 / 2) ) );
    });

    it("return ±float16 min value when value is ±float16 min value / 2 ± a bit number", () => {
        assert( hfround(minFloat16 / 2 + 2 ** -25) === minFloat16 );
        assert( hfround(-minFloat16 / 2 - 2 ** -25) === -minFloat16 );
    });

    it("return 1.3369140625 when value is 1.337", () => {
        assert( hfround(1.337) === 1.3369140625 );
    });
});

})();