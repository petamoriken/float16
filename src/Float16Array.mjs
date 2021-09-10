import { wrapInArrayIterator } from "./helper/arrayIterator.mjs";
import { convertToNumber, roundToFloat16Bits } from "./helper/converter.mjs";
import { isArrayBuffer, isCanonicalIntegerIndexString, isIterable, isObject, isObjectLike, isOrdinaryArray, isOrdinaryTypedArray, isSharedArrayBuffer, isTypedArray, isUint16Array } from "./helper/is.mjs";
import { createPrivateStorage } from "./helper/private.mjs";
import { LengthOfArrayLike, SpeciesConstructor, ToIntegerOrInfinity, defaultCompare } from "./helper/spec.mjs";

const brand = Symbol.for("__Float16Array__");

const _ = createPrivateStorage();

/**
 * @param {unknown} target
 * @returns {boolean}
 */
function hasFloat16ArrayBrand(target) {
  if (!isObjectLike(target)) {
    return false;
  }

  const prototype = Reflect.getPrototypeOf(target);
  if (!isObjectLike(prototype)) {
    return false;
  }

  const constructor = prototype.constructor;
  if (constructor === undefined) {
    return false;
  }
  if (!isObject(constructor)) {
    throw TypeError("constructor is not a object");
  }

  return Reflect.has(constructor, brand);
}

/**
 * @param {unknown} target
 * @returns {boolean}
 */
export function isFloat16Array(target) {
  return hasFloat16ArrayBrand(target) && !isTypedArray(target);
}

/**
 * @param {unknown} target
 * @returns {boolean}
 */
function isFloat16BitsArray(target) {
  return hasFloat16ArrayBrand(target) && isUint16Array(target);
}

/**
 * @param {unknown} target
 * @throws {TypeError}
 */
function assertFloat16BitsArray(target) {
  if (!isFloat16BitsArray(target)) {
    throw new TypeError("This is not a Float16Array");
  }
}

/**
 * @param {Float16Array} float16
 * @return {ArrayLike<number>}
 */
function getFloat16BitsArrayFromFloat16Array(float16) {
  let target = _(float16).target;

  // from other realms
  if (target === undefined) {
    const clone = new Float16Array(float16.buffer, float16.byteOffset, float16.length);
    target = _(clone).target;
  }

  return target;
}

/**
 * @param {ArrayLike<number>} float16bitsArray
 * @return {number[]}
 */
function copyToArray(float16bitsArray) {
  const length = float16bitsArray.length;

  const array = [];
  for (let i = 0; i < length; ++i) {
    array[i] = convertToNumber(float16bitsArray[i]);
  }

  return array;
}

/**
 * @param {unknown} target
 * @returns {boolean}
 */
function isDefaultFloat16ArrayMethods(target) {
  return typeof target === "function" && defaultFloat16ArrayMethods.has(target);
}

/** @type {ProxyHandler<Function>} */
const applyHandler = Object.freeze({
  apply(func, thisArg, args) {
    // peel off Proxy
    if (isFloat16Array(thisArg)) {
      const target = getFloat16BitsArrayFromFloat16Array(thisArg);
      return Reflect.apply(func, target, args);
    }

    return Reflect.apply(func, thisArg, args);
  },
});

const hasOwnProperty = Object.prototype.hasOwnProperty;

/** @type {ProxyHandler<Float16Array>} */
const handler = Object.freeze({
  get(target, key) {
    if (isCanonicalIntegerIndexString(key) && hasOwnProperty.call(target, key)) {
      return convertToNumber(Reflect.get(target, key));
    }

    const ret = Reflect.get(target, key);
    if (!isDefaultFloat16ArrayMethods(ret)) {
      return ret;
    }

    // TypedArray methods can't be called by Proxy Object
    let proxy = _(ret).proxy;

    if (proxy === undefined) {
      proxy = _(ret).proxy = new Proxy(ret, applyHandler);
    }

    return proxy;
  },

  set(target, key, value) {
    if (isCanonicalIntegerIndexString(key) && hasOwnProperty.call(target, key)) {
      return Reflect.set(target, key, roundToFloat16Bits(value));
    }

    return Reflect.set(target, key, value);
  },
});

/**
 * limitation: see README.md for details
 */
export class Float16Array extends Uint16Array {

  /**
   * @see https://tc39.es/ecma262/#sec-typedarray
   */
  constructor(input, byteOffset, length) {
    // input Float16Array
    if (isFloat16Array(input)) {
      // peel off Proxy
      const float16bitsArray = getFloat16BitsArrayFromFloat16Array(input);
      super(float16bitsArray);

    // object without ArrayBuffer
    } else if (isObject(input) && !isArrayBuffer(input)) {
      /** @type {ArrayLike<number>} */
      let list;
      /** @type {number} */
      let length;

      // TypedArray
      if (isTypedArray(input)) {
        list = input;
        length = input.length;

        const buffer = input.buffer;
        /** @type {ArrayBufferConstructor} */
        const BufferConstructor = !isSharedArrayBuffer(buffer) ? SpeciesConstructor(buffer, ArrayBuffer) : ArrayBuffer;
        const data = new BufferConstructor(length * Float16Array.BYTES_PER_ELEMENT);
        super(data);

      // Iterable (Array)
      } else if (isIterable(input)) {
        // for optimization
        if (isOrdinaryArray(input)) {
          list = input;
          length = input.length;
          super(length);

        } else {
          list = [...input];
          length = list.length;
          super(length);
        }

      // ArrayLike
      } else {
        list = input;
        length = LengthOfArrayLike(input);
        super(length);
      }

      // set values
      for (let i = 0; i < length; ++i) {
        // super (Uint16Array)
        this[i] = roundToFloat16Bits(list[i]);
      }

    // primitive, ArrayBuffer
    } else {
      switch (arguments.length) {
        case 0:
          super();
          break;

        case 1:
          super(input);
          break;

        case 2:
          super(input, byteOffset);
          break;

        case 3:
          super(input, byteOffset, length);
          break;

        default:
          super(...arguments);
      }
    }

    const proxy = new Proxy(this, handler);

    // proxy private storage
    _(proxy).target = this;

    // this private storage
    _(this).proxy = proxy;

    return proxy;
  }

  /**
   * limitation: `Object.getOwnPropertyNames(Float16Array)` or `Reflect.ownKeys(Float16Array)` include this key
   * @see https://tc39.es/ecma262/#sec-%typedarray%.from
   */
  static from(src, ...opts) {
    const Constructor = this;

    if (!Reflect.has(Constructor, brand)) {
      throw TypeError("This constructor is not a subclass of Float16Array");
    }

    // for optimization
    if (Constructor === Float16Array) {
      if (isFloat16Array(src) && opts.length === 0) {
        const uint16 = new Uint16Array(src.buffer, src.byteOffset, src.length);
        return new Float16Array(uint16.slice().buffer);
      }

      if (opts.length === 0) {
        return new Float16Array(Uint16Array.from(src, roundToFloat16Bits).buffer);
      }

      const mapFunc = opts[0];
      const thisArg = opts[1];

      return new Float16Array(Uint16Array.from(src, function (val, ...args) {
        return roundToFloat16Bits(mapFunc.call(this, val, ...args));
      }, thisArg).buffer);
    }

    /** @type {ArrayLike<number>} */
    let list;
    /** @type {number} */
    let length;

    // Iterable (TypedArray, Array)
    if (isIterable(src)) {
      // for optimization
      if (isOrdinaryArray(src) || isOrdinaryTypedArray(src)) {
        list = src;
        length = src.length;
      } else {
        list = [...src];
        length = list.length;
      }

    // ArrayLike
    } else {
      list = src;
      length = LengthOfArrayLike(src);
    }

    const array = new Constructor(length);

    if (opts.length === 0) {
      for (let i = 0; i < length; ++i) {
        array[i] = list[i];
      }

    } else {
      const mapFunc = opts[0];
      const thisArg = opts[1];
      for (let i = 0; i < length; ++i) {
        array[i] = mapFunc.call(thisArg, list[i], i);
      }
    }

    return array;
  }

  /**
   * limitation: `Object.getOwnPropertyNames(Float16Array)` or `Reflect.ownKeys(Float16Array)` include this key
   * @see https://tc39.es/ecma262/#sec-%typedarray%.of
   */
  static of(...items) {
    const Constructor = this;

    if (!Reflect.has(Constructor, brand)) {
      throw TypeError("This constructor is not a subclass of Float16Array");
    }

    const length = items.length;

    // for optimization
    if (Constructor === Float16Array) {
      const proxy = new Float16Array(length);
      const float16bitsArray = getFloat16BitsArrayFromFloat16Array(proxy);

      for (let i = 0; i < length; ++i) {
        float16bitsArray[i] = roundToFloat16Bits(items[i]);
      }

      return proxy;
    }

    const array = new Constructor(length);

    for (let i = 0; i < length; ++i) {
      array[i] = items[i];
    }

    return array;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
   */
  keys() {
    assertFloat16BitsArray(this);

    return super.keys();
  }

  /**
   * limitation: returns a object whose prototype is not `%ArrayIteratorPrototype%`
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
   */
  values() {
    assertFloat16BitsArray(this);

    const arrayIterator = super.values();
    return wrapInArrayIterator((function* () {
      for (const val of arrayIterator) {
        yield convertToNumber(val);
      }
    })());
  }

  /**
   * limitation: returns a object whose prototype is not `%ArrayIteratorPrototype%`
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
   */
  entries() {
    assertFloat16BitsArray(this);

    const arrayIterator = super.entries();
    return wrapInArrayIterator((function* () {
      for (const [i, val] of arrayIterator) {
        yield [i, convertToNumber(val)];
      }
    })());
  }

  /**
   * @see https://tc39.es/proposal-relative-indexing-method/#sec-%typedarray%.prototype.at
   */
  at(index) {
    assertFloat16BitsArray(this);

    const length = this.length;
    const relativeIndex = ToIntegerOrInfinity(index);
    const k = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;

    if (k < 0 || k >= length) {
      return;
    }

    return convertToNumber(this[k]);
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
   */
  map(callback, ...opts) {
    assertFloat16BitsArray(this);

    const thisArg = opts[0];

    const length = this.length;

    const Constructor = SpeciesConstructor(this, Float16Array);

    // for optimization
    if (Constructor === Float16Array) {
      const proxy = new Float16Array(length);
      const float16bitsArray = getFloat16BitsArrayFromFloat16Array(proxy);

      for (let i = 0; i < length; ++i) {
        const val = convertToNumber(this[i]);
        float16bitsArray[i] = roundToFloat16Bits(callback.call(thisArg, val, i, _(this).proxy));
      }

      return proxy;
    }

    const array = new Constructor(length);

    for (let i = 0; i < length; ++i) {
      const val = convertToNumber(this[i]);
      array[i] = callback.call(thisArg, val, i, _(this).proxy);
    }

    return array;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
   */
  filter(callback, ...opts) {
    assertFloat16BitsArray(this);

    const thisArg = opts[0];

    const kept = [];
    for (let i = 0, l = this.length; i < l; ++i) {
      const val = convertToNumber(this[i]);
      if (callback.call(thisArg, val, i, _(this).proxy)) {
        kept.push(val);
      }
    }

    const Constructor = SpeciesConstructor(this, Float16Array);
    const array = new Constructor(kept);

    return array;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
   */
  reduce(callback, ...opts) {
    assertFloat16BitsArray(this);

    const length = this.length;
    if (length === 0 && opts.length === 0) {
      throw TypeError("Reduce of empty array with no initial value");
    }

    let accumulator, start;
    if (opts.length === 0) {
      accumulator = convertToNumber(this[0]);
      start = 1;
    } else {
      accumulator = opts[0];
      start = 0;
    }

    for (let i = start; i < length; ++i) {
      accumulator = callback(accumulator, convertToNumber(this[i]), i, _(this).proxy);
    }

    return accumulator;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
   */
  reduceRight(callback, ...opts) {
    assertFloat16BitsArray(this);

    const length = this.length;
    if (length === 0 && opts.length === 0) {
      throw TypeError("Reduce of empty array with no initial value");
    }

    let accumulator, start;
    if (opts.length === 0) {
      accumulator = convertToNumber(this[length - 1]);
      start = length - 2;
    } else {
      accumulator = opts[0];
      start = length - 1;
    }

    for (let i = start; i >= 0; --i) {
      accumulator = callback(accumulator, convertToNumber(this[i]), i, _(this).proxy);
    }

    return accumulator;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
   */
  forEach(callback, ...opts) {
    assertFloat16BitsArray(this);

    const thisArg = opts[0];

    for (let i = 0, l = this.length; i < l; ++i) {
      callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy);
    }
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
   */
  find(callback, ...opts) {
    assertFloat16BitsArray(this);

    const thisArg = opts[0];

    for (let i = 0, l = this.length; i < l; ++i) {
      const value = convertToNumber(this[i]);
      if (callback.call(thisArg, value, i, _(this).proxy)) {
        return value;
      }
    }
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
   */
  findIndex(callback, ...opts) {
    assertFloat16BitsArray(this);

    const thisArg = opts[0];

    for (let i = 0, l = this.length; i < l; ++i) {
      const value = convertToNumber(this[i]);
      if (callback.call(thisArg, value, i, _(this).proxy)) {
        return i;
      }
    }

    return -1;
  }

  /**
   * @see https://tc39.es/proposal-array-find-from-last/index.html#sec-%typedarray%.prototype.findlast
   */
  findLast(callback, ...opts) {
    assertFloat16BitsArray(this);

    const thisArg = opts[0];

    for (let i = this.length - 1; i >= 0; --i) {
      const value = convertToNumber(this[i]);
      if (callback.call(thisArg, value, i, _(this).proxy)) {
        return value;
      }
    }
  }

  /**
   * @see https://tc39.es/proposal-array-find-from-last/index.html#sec-%typedarray%.prototype.findlastindex
   */
  findLastIndex(callback, ...opts) {
    assertFloat16BitsArray(this);

    const thisArg = opts[0];

    for (let i = this.length - 1; i >= 0; --i) {
      const value = convertToNumber(this[i]);
      if (callback.call(thisArg, value, i, _(this).proxy)) {
        return i;
      }
    }

    return -1;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
   */
  every(callback, ...opts) {
    assertFloat16BitsArray(this);

    const thisArg = opts[0];

    for (let i = 0, l = this.length; i < l; ++i) {
      if (!callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy)) {
        return false;
      }
    }

    return true;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
   */
  some(callback, ...opts) {
    assertFloat16BitsArray(this);

    const thisArg = opts[0];

    for (let i = 0, l = this.length; i < l; ++i) {
      if (callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy)) {
        return true;
      }
    }

    return false;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
   */
  set(input, ...opts) {
    assertFloat16BitsArray(this);

    const targetOffset = ToIntegerOrInfinity(opts[0]);
    if (targetOffset < 0) {
      throw RangeError("offset is out of bounds");
    }

    // for optimization
    if (isFloat16Array(input)) {
      // peel off Proxy
      const float16bitsArray = getFloat16BitsArrayFromFloat16Array(input);
      super.set(float16bitsArray, targetOffset);
      return;
    }

    const targetLength = this.length;

    const src = Object(input);
    const srcLength = LengthOfArrayLike(src);

    if (targetOffset === Infinity || srcLength + targetOffset > targetLength) {
      throw RangeError("offset is out of bounds");
    }

    for (let i = 0; i < srcLength; ++i) {
      this[i + targetOffset] = roundToFloat16Bits(src[i]);
    }
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
   */
  reverse() {
    assertFloat16BitsArray(this);

    super.reverse();

    return _(this).proxy;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
   */
  fill(value, ...opts) {
    assertFloat16BitsArray(this);

    super.fill(roundToFloat16Bits(value), ...opts);

    return _(this).proxy;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
   */
  copyWithin(target, start, ...opts) {
    assertFloat16BitsArray(this);

    super.copyWithin(target, start, ...opts);

    return _(this).proxy;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
   */
  sort(...opts) {
    assertFloat16BitsArray(this);

    const compare = opts[0] !== undefined ? opts[0] : defaultCompare;
    super.sort((x, y) => { return compare(convertToNumber(x), convertToNumber(y)); });

    return _(this).proxy;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
   */
  slice(...opts) {
    assertFloat16BitsArray(this);

    const Constructor = SpeciesConstructor(this, Float16Array);

    // for optimization
    if (Constructor === Float16Array) {
      const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
      const float16bitsArray = uint16.slice(...opts);
      return new Float16Array(float16bitsArray.buffer);
    }

    const length = this.length;
    const start = ToIntegerOrInfinity(opts[0]);
    const end = opts[1] === undefined ? length : ToIntegerOrInfinity(opts[1]);

    let k;
    if (start === -Infinity) {
      k = 0;
    } else if (start < 0) {
      k = length + start > 0 ? length + start : 0;
    } else {
      k = length < start ? length : start;
    }

    let final;
    if (end === -Infinity) {
      final = 0;
    } else if (end < 0) {
      final = length + end > 0 ? length + end : 0;
    } else {
      final = length < end ? length : end;
    }

    const count = final - k > 0 ? final - k : 0;
    const array = new Constructor(count);

    if (count === 0) {
      return array;
    }

    let n = 0;
    while (k < final) {
      array[n] = convertToNumber(this[k]);
      ++k;
      ++n;
    }

    return array;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
   */
  subarray(...opts) {
    assertFloat16BitsArray(this);

    const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
    const float16bitsArray = uint16.subarray(...opts);

    const Constructor = SpeciesConstructor(this, Float16Array);
    const array = new Constructor(float16bitsArray.buffer, float16bitsArray.byteOffset, float16bitsArray.length);

    return array;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
   */
  indexOf(element, ...opts) {
    assertFloat16BitsArray(this);

    const length = this.length;

    let from = ToIntegerOrInfinity(opts[0]);
    if (from === Infinity) {
      return -1;
    }

    if (from < 0) {
      from += length;
      if (from < 0) {
        from = 0;
      }
    }

    for (let i = from, l = length; i < l; ++i) {
      if (hasOwnProperty.call(this, i) && convertToNumber(this[i]) === element) {
        return i;
      }
    }

    return -1;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
   */
  lastIndexOf(element, ...opts) {
    assertFloat16BitsArray(this);

    const length = this.length;

    let from = opts.length >= 1 ? ToIntegerOrInfinity(opts[0]) : length - 1;
    if (from === -Infinity) {
      return -1;
    }

    if (from >= 0) {
      from = from < length - 1 ? from : length - 1;
    } else {
      from += length;
    }

    for (let i = from; i >= 0; --i) {
      if (hasOwnProperty.call(this, i) && convertToNumber(this[i]) === element) {
        return i;
      }
    }

    return -1;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
   */
  includes(element, ...opts) {
    assertFloat16BitsArray(this);

    const length = this.length;

    let from = ToIntegerOrInfinity(opts[0]);
    if (from === Infinity) {
      return false;
    }

    if (from < 0) {
      from += length;
      if (from < 0) {
        from = 0;
      }
    }

    const isNaN = Number.isNaN(element);
    for (let i = from, l = length; i < l; ++i) {
      const value = convertToNumber(this[i]);

      if (isNaN && Number.isNaN(value)) {
        return true;
      }

      if (value === element) {
        return true;
      }
    }

    return false;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
   */
  join(...opts) {
    assertFloat16BitsArray(this);

    const array = copyToArray(this);

    return array.join(...opts);
  }

  /**
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
   */
  toLocaleString(...opts) {
    assertFloat16BitsArray(this);

    const array = copyToArray(this);

    return array.toLocaleString(...opts);
  }

  /**
   * @see https://tc39.es/ecma262/#sec-get-%typedarray%.prototype-@@tostringtag
   */
  get [Symbol.toStringTag]() {
    if (isFloat16BitsArray(this)) {
      return "Float16Array";
    }
  }
}

/**
 * @see https://tc39.es/ecma262/#sec-typedarray.bytes_per_element
 */
Object.defineProperty(Float16Array, "BYTES_PER_ELEMENT", { value: Uint16Array.BYTES_PER_ELEMENT });

/**
 * limitation: It is peaked by `Object.getOwnPropertySymbols(Float16Array)` and `Reflect.ownKeys(Float16Array)`
 */
Object.defineProperty(Float16Array, brand, {});

const Float16ArrayPrototype = Float16Array.prototype;

/**
 * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
 */
Object.defineProperty(Float16ArrayPrototype, Symbol.iterator, {
  value: Float16ArrayPrototype.values,
  writable: true,
  configurable: true,
});

const defaultFloat16ArrayMethods = new WeakSet();
for (const key of Reflect.ownKeys(Float16ArrayPrototype)) {
  // constructor is not callable
  if (key === "constructor") {
    continue;
  }

  const val = Float16ArrayPrototype[key];
  if (typeof val === "function") {
    defaultFloat16ArrayMethods.add(val);
  }
}
