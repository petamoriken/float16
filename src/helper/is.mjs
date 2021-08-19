import isObject from "lodash-es/isObject.js";
import { ToIntegerOrInfinity } from "./spec.mjs";

export { default as isObject } from "lodash-es/isObject.js";
export { default as isArrayBuffer } from "lodash-es/isArrayBuffer.js";
export { default as isTypedArray } from "lodash-es/isTypedArray.js";

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isDataView(value) {
    return ArrayBuffer.isView(value) && Object.prototype.toString.call(value) === "[object DataView]";
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isSharedArrayBuffer(value) {
    return Object.prototype.toString.call(value) === "[object SharedArrayBuffer]";
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isIterable(value) {
    return isObject(value) && typeof value[Symbol.iterator] === "function";
}

/**
 * @param {unknown} key
 * @returns {boolean}
 */
export function isCanonicalIntegerIndexString(key) {
    return typeof key === "string" && key === ToIntegerOrInfinity(key) + "";
}
