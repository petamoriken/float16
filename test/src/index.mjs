import {
  Float16Array, isFloat16Array, isTypedArray,
  getFloat16, setFloat16,
  hfround,
} from "../../src/index.mjs";

const float16 = new Float16Array([1.0, 1.1, 1.2]);
assert(float16.reduce((prev, current) => prev + current) === 3.298828125);

assert(isFloat16Array(float16));
assert(isFloat16Array(new Float32Array()) === false);
assert(isFloat16Array(new Uint16Array()) === false);

assert(isTypedArray(float16));
assert(isTypedArray(new Float32Array()));
assert(isTypedArray(new Uint16Array()));

const buffer = new ArrayBuffer(2);
const view = new DataView(buffer);

setFloat16(view, 0, Math.PI, true);
assert(getFloat16(view, 0, true) === 3.140625);

assert(hfround(1.337) === 1.3369140625);

function assert(target) {
  if (target !== true) {
    throw new Error("Assertion failed");
  }
}
