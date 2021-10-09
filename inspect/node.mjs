/* eslint-env node */

import util from "util";

/**
 * @example
 * ```
 * Float16Array.prototype[Symbol.for("nodejs.util.inspect.custom")] = customInspect;
 * ```
 */
export function customInspect(_deps, options) {
  const array = [];
  for (let i = 0; i < this.length; ++i) {
    array[i] = this[i];
  }

  return `Float16Array(${this.length}) ${util.inspect(array, options)}`;
}
