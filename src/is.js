import { ToIntegerOrInfinity } from "./spec";

export { default as isArrayBuffer } from "lodash-es/isArrayBuffer";

/**
 * @param {unknown} view
 * @returns {boolean}
 */
export function isDataView(view) {
    return ArrayBuffer.isView(view) && Object.prototype.toString.call(view) === "[object DataView]";
}

/**
 * @param {unknown} key
 * @returns {boolean}
 */
export function isCanonicalIntegerIndexString(key) {
    return typeof key === "string" && key === ToIntegerOrInfinity(key) + "";
}
