import { ToIntegerOrInfinity } from "./spec.mjs";

export { default as isObject } from "lodash-es/isObject.js";
export { default as isArrayBuffer } from "lodash-es/isArrayBuffer.js";

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isDataView(value) {
    return ArrayBuffer.isView(value) && Object.prototype.toString.call(value) === "[object DataView]";
}

/**
 * @param {unknown} key
 * @returns {boolean}
 */
export function isCanonicalIntegerIndexString(key) {
    return typeof key === "string" && key === ToIntegerOrInfinity(key) + "";
}
