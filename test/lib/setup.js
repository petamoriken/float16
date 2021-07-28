const assert = require("power-assert");
const float16 = require("../../lib");

Object.assign(global, float16);
global.assert = assert;
