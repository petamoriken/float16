/* eslint-env node */

"use strict";

const util = require("util");

/**
 * @example
 * ```
 * Float16Array.prototype[Symbol.for("nodejs.util.inspect.custom")] = customInspect;
 * ```
 */
module.exports.customInspect = function customInspect(_deps, options) {
  const array = [];
  for (let i = 0; i < this.length; ++i) {
    array[i] = this[i];
  }

  return `Float16Array(${this.length}) ${util.inspect(array, options)}`;
};
