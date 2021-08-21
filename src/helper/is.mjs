import { ToIntegerOrInfinity } from "./spec.mjs";

const toString = Object.prototype.toString;

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isObject(value) {
    return (value !== null && typeof value === "object") || typeof value === "function";
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isObjectLike(value) {
    return value !== null && typeof value === "object";
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isDataView(value) {
    return ArrayBuffer.isView(value) && toString.call(value) === "[object DataView]";
}

const typedArrayTags = new Set([
    "[object Float32Array]",
    "[object Float64Array]",
    "[object Int8Array]",
    "[object Int16Array]",
    "[object Int32Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Uint16Array]",
    "[object Uint32Array]",
    "[object BigInt64Array]",
    "[object BigUint64Array]",
]);

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isTypedArray(value) {
    return ArrayBuffer.isView(value) && typedArrayTags.has(toString.call(value));
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
 export function isArrayBuffer(value) {
    return isObjectLike(value) && toString.call(value) === "[object ArrayBuffer]";
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isSharedArrayBuffer(value) {
    return isObjectLike(value) && toString.call(value) === "[object SharedArrayBuffer]";
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
