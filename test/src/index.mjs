import { Float16Array, getFloat16, hfround, setFloat16 } from "../../src/index.mjs";

const float16 = new Float16Array([1.0, 1.1, 1.2]);
assert( float16.reduce((prev, current) => prev + current) === 3.298828125 );

const buffer = new ArrayBuffer(2);
const view = new DataView(buffer);

setFloat16(view, 0, Math.PI, true);
assert( getFloat16(view, 0, true) === 3.140625 );

assert( hfround(1.337) === 1.3369140625 );

function assert(target) {
  if (!target) {
    throw new Error("assertion failed");
  }
}
