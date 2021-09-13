import { isObject } from "./is.mjs";

/**
 * @see https://tc39.es/ecma262/#sec-tointegerorinfinity
 * @param {unknown} target
 * @returns {number}
 */
export function ToIntegerOrInfinity(target) {
  if (typeof target === "bigint") {
    throw TypeError("Cannot convert a BigInt value to a number");
  }

  const number = Number(target);

  if (Number.isNaN(number) || number === 0) {
    return 0;
  }

  return Math.trunc(number);
}

/**
 * @see https://tc39.es/ecma262/#sec-tolength
 * @param {unknown} target
 * @returns {number}
 */
function ToLength(target) {
  const length = ToIntegerOrInfinity(target);
  if (length < 0) {
    return 0;
  }

  return length < Number.MAX_SAFE_INTEGER ? length : Number.MAX_SAFE_INTEGER;
}

/**
 * @see https://tc39.es/ecma262/#sec-lengthofarraylike
 * @param {object} arrayLike
 * @returns {number}
 */
export function LengthOfArrayLike(arrayLike) {
  if (!isObject(arrayLike)) {
    throw TypeError("this is not a object");
  }

  return ToLength(arrayLike.length);
}

/**
 * @see https://tc39.es/ecma262/#sec-speciesconstructor
 * @param {object} target
 * @param {Function} defaultConstructor
 * @returns {Function}
 */
export function SpeciesConstructor(target, defaultConstructor) {
  if (!isObject(target)) {
    throw TypeError("this is not a object");
  }

  const constructor = target.constructor;
  if (constructor === undefined) {
    return defaultConstructor;
  }
  if (!isObject(constructor)) {
    throw TypeError("constructor is not a object");
  }

  const species = constructor[Symbol.species];
  if (species == null) {
    return defaultConstructor;
  }

  return species;
}

/**
 * bigint comparisons are not supported
 * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
 * @param {number} x
 * @param {number} y
 * @returns {-1 | 0 | 1}
 */
export function defaultCompare(x, y) {
  const isNaN_x = Number.isNaN(x);
  const isNaN_y = Number.isNaN(y);

  if (isNaN_x && isNaN_y) {
    return 0;
  }

  if (isNaN_x) {
    return 1;
  }

  if (isNaN_y) {
    return -1;
  }

  if (x < y) {
    return -1;
  }

  if (x > y) {
    return 1;
  }

  if (x === 0 && y === 0) {
    const isPlusZero_x = Object.is(x, 0);
    const isPlusZero_y = Object.is(y, 0);

    if (!isPlusZero_x && isPlusZero_y) {
      return -1;
    }

    if (isPlusZero_x && !isPlusZero_y) {
      return 1;
    }
  }

  return 0;
}
