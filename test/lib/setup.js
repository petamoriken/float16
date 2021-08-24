/* eslint-env node */

"use strict";

const assert = require("power-assert");
const float16 = require("../../index.js");

Object.assign(global, float16);
global.assert = assert;
