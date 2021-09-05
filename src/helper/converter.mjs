/* global globalThis, self, window, global */

// algorithm: http://fox-toolkit.org/ftp/fasthalffloatconversion.pdf

/** @type {globalThis} */
const stdin =
  typeof globalThis !== "undefined" ? globalThis :
    typeof self !== "undefined" ? self :
      typeof window !== "undefined" ? window :
        typeof global !== "undefined" ? global : Function("return this")();

const heap = new ArrayBuffer(0x4000);

const asm = function (stdin, _foreign, heap) {
  "use asm";

  const fround = stdin.Math.fround;

  const HEAPU32 = new stdin.Uint32Array(heap);
  const HEAPF32 = new stdin.Float32Array(heap);

  const base = 0;
  const shift = 2048;

  const mantissa = 4096;
  const exponent = 12288;
  const offset = 12544;

  const free = 12800;

  function init() {
    initF64ToF16Table();
    initF16ToF64Table();
  }

  function initF64ToF16Table() {
    var i = 0, e = 0;

    for (i = 0; (i | 0) < 256; i = i + 1 | 0) {
      e = i - 127 | 0;

      // very small number (0, -0)
      if ((e | 0) < (-27 | 0)) {
        HEAPU32[base + (i << 2) >> 2]           = 0x0000;
        HEAPU32[base + ((i | 0x100) << 2) >> 2] = 0x8000;
        HEAPU32[shift + (i << 2) >> 2]           = 24;
        HEAPU32[shift + ((i | 0x100) << 2) >> 2] = 24;

        // small number (denorm)
      } else if ((e | 0) < (-14 | 0)) {
        HEAPU32[base + (i << 2) >> 2]           = 0x0400 >> (-e | 0) - 14;
        HEAPU32[base + ((i | 0x100) << 2) >> 2] = 0x0400 >> (-e | 0) - 14 | 0x8000;
        HEAPU32[shift + (i << 2) >> 2]           = (-e | 0) - 1;
        HEAPU32[shift + ((i | 0x100) << 2) >> 2] = (-e | 0) - 1;

      // normal number
      } else if ((e | 0) <= 15) {
        HEAPU32[base + (i << 2) >> 2]           = e + 15 << 10;
        HEAPU32[base + ((i | 0x100) << 2) >> 2] = e + 15 << 10 | 0x8000;
        HEAPU32[shift + (i << 2) >> 2]           = 13;
        HEAPU32[shift + ((i | 0x100) << 2) >> 2] = 13;

      // large number (Infinity, -Infinity)
      } else if ((e | 0) < 128) {
        HEAPU32[base + (i << 2) >> 2]           = 0x7c00;
        HEAPU32[base + ((i | 0x100) << 2) >> 2] = 0xfc00;
        HEAPU32[shift + (i << 2) >> 2]           = 24;
        HEAPU32[shift + ((i | 0x100) << 2) >> 2] = 24;

      // stay (NaN, Infinity, -Infinity)
      } else {
        HEAPU32[base + (i << 2) >> 2]           = 0x7c00;
        HEAPU32[base + ((i | 0x100) << 2) >> 2] = 0xfc00;
        HEAPU32[shift + (i << 2) >> 2]           = 13;
        HEAPU32[shift + ((i | 0x100) << 2) >> 2] = 13;
      }
    }
  }

  function initF16ToF64Table() {
    var i = 0, m = 0, e = 0;

    for (i = 1; (i | 0) < 1024; i = i + 1 | 0) {
      m = i << 13; // zero pad mantissa bits
      e = 0;       // zero exponent

      // normalized
      while ((m & 0x00800000) == 0) {
        e = (e | 0) - 0x00800000 | 0; // decrement exponent
        m = m << 1;
      }

      m = m & ~0x00800000;          // clear leading 1 bit
      e = (e | 0) + 0x38800000 | 0; // adjust bias

      HEAPU32[mantissa + (i << 2) >> 2] = m | e;
    }
    for (i = 1024; (i | 0) < 2048; i = i + 1 | 0) {
      HEAPU32[mantissa + (i << 2) >> 2] = 0x38000000 + (i - 1024 << 13);
    }

    for (i = 1; (i | 0) < 31; i = i + 1 | 0) {
      HEAPU32[exponent + (i << 2) >> 2] = i << 23;
    }
    HEAPU32[exponent + 124 >> 2] = 0x47800000;
    HEAPU32[exponent + 128 >> 2] = 0x80000000;
    for (i = 33; (i | 0) < 63; i = i + 1 | 0) {
      HEAPU32[exponent + (i << 2) >> 2] = 0x80000000 + (i - 32 << 23);
    }
    HEAPU32[exponent + 252 >> 2] = 0xc7800000;

    for (i = 1; (i | 0) < 64; i = i + 1 | 0) {
      if ((i | 0) == 32) {
        HEAPU32[offset + (i << 2) >> 2] = 0;
      } else {
        HEAPU32[offset + (i << 2) >> 2] = 1024;
      }
    }
  }

  /**
   * @param {number} num
   * @returns {number} half float number bits
   */
  function roundToFloat16Bits(num) {
    num = fround(num);

    var f = 0, e = 0;

    HEAPF32[free >> 2] = num;
    f = HEAPU32[free >> 2] | 0;
    e = f >> 23 & 0x1ff;
    return (
      HEAPU32[base + (e << 2) >> 2] +
      ((f & 0x007fffff) >> HEAPU32[shift + (e << 2) >> 2]) | 0
    );
  }

  /**
   * @param {number} float16bits - half float number bits
   * @returns {number}
   */
  function convertToNumber(float16bits) {
    float16bits = float16bits | 0;

    var m = 0;

    m = float16bits >> 10;
    HEAPU32[free >> 2] =
      HEAPU32[mantissa + (HEAPU32[offset + (m << 2) >> 2] + (float16bits & 0x3ff) << 2) >> 2] +
      HEAPU32[exponent + (m << 2) >> 2];
    return +HEAPF32[free >> 2];
  }

  return {
    init: init,
    roundToFloat16Bits: roundToFloat16Bits,
    convertToNumber: convertToNumber,
  };

}(stdin, null, heap);

asm.init();

/** round a number to a half float number bits. */
export const roundToFloat16Bits = asm.roundToFloat16Bits;

/** convert a half float number bits to a number. */
export const convertToNumber = asm.convertToNumber;
