import {
  Float16Array, isFloat16Array, isTypedArray,
  getFloat16, setFloat16,
  f16round,
} from "../../src/index.mjs";

const float16 = new Float16Array([1.0, 1.1, 1.2]);
assertEquals(float16.reduce((prev, current) => prev + current), 3.2998046875);

assertEquals(isFloat16Array(float16), true);
assertEquals(isFloat16Array(new Float32Array()), false);
assertEquals(isFloat16Array(new Uint16Array()), false);

assertEquals(isTypedArray(float16), true);
assertEquals(isTypedArray(new Float32Array()), true);
assertEquals(isTypedArray(new Uint16Array()), true);

const buffer = new ArrayBuffer(2);
const view = new DataView(buffer);

setFloat16(view, 0, Math.PI, true);
assertEquals(getFloat16(view, 0, true), 3.140625);

assertEquals(f16round(1.337), 1.3369140625);

function assertEquals(actual, expected) {
  if (actual !== expected) {
    throw new Error(`Assertion failed; actual: ${actual}, expected: ${expected}`);
  }
}
