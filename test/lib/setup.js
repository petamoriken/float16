/* eslint-env node */

const assert = require("power-assert");
const float16 = require("../../lib/index.js");

Object.assign(global, float16);
global.assert = assert;
