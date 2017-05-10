const float16 = require("../../lib");
const assert = require("power-assert");

Object.assign(global, float16);
global.assert = assert;