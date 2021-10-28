import {
  ArrayIsArray,
  MathTrunc,
  NativeNumber,
  NumberIsFinite,
  SymbolIterator,
  SymbolToStringTag,
  TypedArrayPrototypeGetSymbolToStringTag,
} from "./primordials.mjs";

/**
 * @param {unknown} value
 * @returns {value is object}
 */
export function isObject(value) {
  return (value !== null && typeof value === "object") ||
    typeof value === "function";
}

/**
 * @param {unknown} value
 * @returns {value is object}
 */
export function isObjectLike(value) {
  return value !== null && typeof value === "object";
}

// Inspired by util.types implementation of Node.js
/** @typedef {Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float32Array|Float64Array|BigUint64Array|BigInt64Array} TypedArray */

/**
 * @param {unknown} value
 * @returns {value is TypedArray}
 */
export function isTypedArray(value) {
  return TypedArrayPrototypeGetSymbolToStringTag(value) !== undefined;
}

/**
 * @param {unknown} value
 * @returns {value is BigInt64Array|BigUint64Array}
 */
export function isBigIntTypedArray(value) {
  const typedArrayName = TypedArrayPrototypeGetSymbolToStringTag(value);
  return typedArrayName === "BigInt64Array" ||
    typedArrayName === "BigUint64Array";
}

/**
 * @param {unknown} value
 * @returns {value is ArrayBuffer}
 */
export function isArrayBuffer(value) {
  return isObjectLike(value) && value[SymbolToStringTag] === "ArrayBuffer";
}

/**
 * @param {unknown} value
 * @returns {value is SharedArrayBuffer}
 */
export function isSharedArrayBuffer(value) {
  return isObjectLike(value) &&
    value[SymbolToStringTag] === "SharedArrayBuffer";
}

/**
 * @param {unknown} value
 * @returns {value is Iterable<unknown>}
 */
export function isIterable(value) {
  return isObject(value) && typeof value[SymbolIterator] === "function";
}

/**
 * @param {unknown} value
 * @returns {value is unknown[]}
 */
export function isOrdinaryArray(value) {
  if (!ArrayIsArray(value)) {
    return false;
  }

  const iterator = value[SymbolIterator]();
  if (iterator[SymbolToStringTag] !== "Array Iterator") {
    return false;
  }

  return true;
}

/**
 * @param {unknown} value
 * @returns {value is TypedArray}
 */
export function isOrdinaryTypedArray(value) {
  if (!isTypedArray(value)) {
    return false;
  }

  const iterator = value[SymbolIterator]();
  if (iterator[SymbolToStringTag] !== "Array Iterator") {
    return false;
  }

  return true;
}

/**
 * @param {unknown} value
 * @returns {value is string}
 */
export function isCanonicalIntegerIndexString(value) {
  if (typeof value !== "string") {
    return false;
  }

  const number = NativeNumber(value);
  if (value !== number + "") {
    return false;
  }

  if (!NumberIsFinite(number)) {
    return false;
  }

  if (number !== MathTrunc(number)) {
    return false;
  }

  return true;
}
