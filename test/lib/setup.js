/* eslint-env node */

"use strict";

require("espower-loader")({
  cwd: process.cwd(),
  pattern: "test/*.js",
});

const assert = require("power-assert");
const float16 = require("../../index.js");

Object.assign(global, float16);
global.assert = assert;
