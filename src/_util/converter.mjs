import {
  MathAbs,
  MathFloor,
  MathLog2,
  MathPow,
  MathSign,
  MathTrunc,
  NativeArrayBuffer,
  NativeFloat32Array,
  NativeUint16Array,
  NativeUint32Array,
  NumberIsFinite,
  NumberIsNaN,
  ObjectIs,
} from "./primordials.mjs";

// base algorithm: https://github.com/feross/ieee754
// BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource>

/**
 * round a number to nearest value; if the number falls midway,
 * it is rounded to the nearest value with an even least significant digit.
 * @param {number} num - double float
 * @returns {number} half float number bits
 */
function roundTiesToEven(num) {
  const truncated = MathTrunc(num);
  const isOdd = truncated % 2 !== 0;
  const delta = MathAbs(num - truncated);
  if (delta > 0.5 || delta === 0.5 && isOdd) {
    return truncated + MathSign(num);
  }
  return truncated;
}

const f16EMax = 31;
const f16EBias = 15;
const f16MLen = 10;
const f16MMask = 0x3ff;

/**
 * round a number to a half float number bits
 * @param {unknown} num - double float
 * @returns {number} half float number bits
 */
export function roundToFloat16Bits(num) {
  const absNum = MathAbs(/** @type {number} */ (num));

  const s = /** @type {number} */ (num) < 0 || ObjectIs(num, -0) ? 1 : 0;
  let m, e;

  // NaN, Infinity, -Infinity
  if (!NumberIsFinite(absNum)) {
    m = NumberIsNaN(absNum) ? 0x200 : 0;
    e = f16EMax;

  // finite
  } else {
    let rawE = MathFloor(MathLog2(absNum));
    let c = MathPow(2, -rawE);
    if (absNum * c < 1) {
      --rawE;
      c *= 2;
    }
    if (absNum * c >= 2) {
      ++rawE;
      c /= 2;
    }

    if (rawE + f16EBias >= f16EMax) {
      m = 0;
      e = f16EMax;
    } else if (rawE + f16EBias >= 1) {
      m = roundTiesToEven(((absNum * c) - 1) * 0x400) & f16MMask;
      e = rawE + f16EBias;
    } else {
      m = roundTiesToEven(absNum * 0x1000000) & f16MMask;
      e = 0;
    }
  }

  return s << 15 | e << f16MLen | m;
}

// base algorithm: http://fox-toolkit.org/ftp/fasthalffloatconversion.pdf

const buffer = new NativeArrayBuffer(4);
const floatView = new NativeFloat32Array(buffer);
const uint32View = new NativeUint32Array(buffer);

const mantissaTable = new NativeUint32Array(2048);
for (let i = 1; i < 1024; ++i) {
  let m = i << 13; // zero pad mantissa bits
  let e = 0; // zero exponent

  // normalized
  while ((m & 0x00800000) === 0) {
    m <<= 1;
    e -= 0x00800000; // decrement exponent
  }

  m &= ~0x00800000; // clear leading 1 bit
  e += 0x38800000; // adjust bias

  mantissaTable[i] = m | e;
}
for (let i = 1024; i < 2048; ++i) {
  mantissaTable[i] = 0x38000000 + ((i - 1024) << 13);
}

const exponentTable = new NativeUint32Array(64);
for (let i = 1; i < 31; ++i) {
  exponentTable[i] = i << 23;
}
exponentTable[31] = 0x47800000;
exponentTable[32] = 0x80000000;
for (let i = 33; i < 63; ++i) {
  exponentTable[i] = 0x80000000 + ((i - 32) << 23);
}
exponentTable[63] = 0xc7800000;

const offsetTable = new NativeUint16Array(64);
for (let i = 1; i < 64; ++i) {
  if (i !== 32) {
    offsetTable[i] = 1024;
  }
}

/**
 * convert a half float number bits to a number
 * @param {number} float16bits - half float number bits
 * @returns {number} double float
 */
export function convertToNumber(float16bits) {
  const i = float16bits >> 10;
  uint32View[0] = mantissaTable[offsetTable[i] + (float16bits & 0x3ff)] + exponentTable[i];
  return floatView[0];
}
