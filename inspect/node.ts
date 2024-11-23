/* eslint-env node */

import type util from "node:util";

/**
 * Custom inspect function for Node.js
 *
 * ```
 * Float16Array.prototype[Symbol.for("nodejs.util.inspect.custom")] = customInspect;
 * ```
 */
export function customInspect(this: ArrayLike<number>, _deps: number, options: util.InspectOptions, inspect: typeof util.inspect): string {
  const length = this.length;

  const array = [];
  for (let i = 0; i < length; ++i) {
    array[i] = this[i];
  }

  return `Float16Array(${length}) ${inspect(array, options)}`;
}
