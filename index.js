/* eslint-env node */

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const { setFloat16, getFloat16 } = require("./lib/DataView.js");
const { Float16Array, isFloat16Array } = require("./lib/Float16Array.js");
const { hfround } = require("./lib/hfround.js");

exports.setFloat16 = setFloat16;
exports.getFloat16 = getFloat16;
exports.Float16Array = Float16Array;
exports.isFloat16Array = isFloat16Array;
exports.hfround = hfround;
