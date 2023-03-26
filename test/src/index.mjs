import {
  Float16Array, isFloat16Array, isTypedArray,
  getFloat16, setFloat16,
  f16round,
} from "../../src/index.mjs";

const float16 = new Float16Array([1.0, 1.1, 1.2]);
assertEqualsTrue(float16.reduce((prev, current) => prev + current) === 3.298828125);

assertEqualsTrue(isFloat16Array(float16));
assertEqualsTrue(isFloat16Array(new Float32Array()) === false);
assertEqualsTrue(isFloat16Array(new Uint16Array()) === false);

assertEqualsTrue(isTypedArray(float16));
assertEqualsTrue(isTypedArray(new Float32Array()));
assertEqualsTrue(isTypedArray(new Uint16Array()));

const buffer = new ArrayBuffer(2);
const view = new DataView(buffer);

setFloat16(view, 0, Math.PI, true);
assertEqualsTrue(getFloat16(view, 0, true) === 3.140625);

assertEqualsTrue(f16round(1.337) === 1.3369140625);

function assertEqualsTrue(target) {
  if (target !== true) {
    throw new Error("Assertion failed");
  }
}
