import { isObject } from "./is.mjs";
import {
  CANNOT_CONVERT_A_BIGINT_VALUE_TO_A_NUMBER,
  CONSTRUCTOR_IS_NOT_A_OBJECT,
  THIS_IS_NOT_A_OBJECT,
} from "./messages.mjs";
import {
  MathTrunc,
  NativeNumber,
  NativeTypeError,
  NumberIsNaN,
  ObjectIs,
  SymbolSpecies,
} from "./primordials.mjs";

/**
 * @see https://tc39.es/ecma262/#sec-tointegerorinfinity
 * @param {unknown} target
 * @returns {number}
 */
export function ToIntegerOrInfinity(target) {
  if (typeof target === "bigint") {
    throw NativeTypeError(CANNOT_CONVERT_A_BIGINT_VALUE_TO_A_NUMBER);
  }

  const number = NativeNumber(target);

  if (NumberIsNaN(number) || number === 0) {
    return 0;
  }

  return MathTrunc(number);
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

  return length < NativeNumber.MAX_SAFE_INTEGER
    ? length
    : NativeNumber.MAX_SAFE_INTEGER;
}

/**
 * @see https://tc39.es/ecma262/#sec-lengthofarraylike
 * @param {object} arrayLike
 * @returns {number}
 */
export function LengthOfArrayLike(arrayLike) {
  if (!isObject(arrayLike)) {
    throw NativeTypeError(THIS_IS_NOT_A_OBJECT);
  }

  return ToLength(/** @type {any} */ (arrayLike).length);
}

/**
 * @see https://tc39.es/ecma262/#sec-speciesconstructor
 * @param {object} target
 * @param {{ new(...args: any[]): any; }} defaultConstructor
 * @returns {{ new(...args: any[]): any; }}
 */
export function SpeciesConstructor(target, defaultConstructor) {
  if (!isObject(target)) {
    throw NativeTypeError(THIS_IS_NOT_A_OBJECT);
  }

  const constructor = target.constructor;
  if (constructor === undefined) {
    return defaultConstructor;
  }
  if (!isObject(constructor)) {
    throw NativeTypeError(CONSTRUCTOR_IS_NOT_A_OBJECT);
  }

  const species = constructor[SymbolSpecies];
  if (species == null) {
    return defaultConstructor;
  }

  return species;
}

/**
 * bigint comparisons are not supported
 *
 * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
 * @param {number} x
 * @param {number} y
 * @returns {-1 | 0 | 1}
 */
export function defaultCompare(x, y) {
  const isNaN_x = NumberIsNaN(x);
  const isNaN_y = NumberIsNaN(y);

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
    const isPlusZero_x = ObjectIs(x, 0);
    const isPlusZero_y = ObjectIs(y, 0);

    if (!isPlusZero_x && isPlusZero_y) {
      return -1;
    }

    if (isPlusZero_x && !isPlusZero_y) {
      return 1;
    }
  }

  return 0;
}
