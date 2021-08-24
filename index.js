/* eslint-env node */

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const { setFloat16, getFloat16 } = require("./lib/DataView.js");
const { Float16Array, isFloat16Array } = require("./lib/Float16Array.js");
const { hfround } = require("./lib/hfround.js");

Object.defineProperty(exports, "hfround", {
  enumerable: true,
  get: function () {
    return hfround;
  },
});
Object.defineProperty(exports, "Float16Array", {
  enumerable: true,
  get: function () {
    return Float16Array;
  },
});
Object.defineProperty(exports, "isFloat16Array", {
  enumerable: true,
  get: function () {
    return isFloat16Array;
  },
});
Object.defineProperty(exports, "getFloat16", {
  enumerable: true,
  get: function () {
    return getFloat16;
  },
});
Object.defineProperty(exports, "setFloat16", {
  enumerable: true,
  get: function () {
    return setFloat16;
  },
});
