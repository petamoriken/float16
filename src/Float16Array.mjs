import { wrapInArrayIterator } from "./_arrayIterator.mjs";
import { convertToNumber, roundToFloat16Bits } from "./_converter.mjs";
import { LengthOfArrayLike, SpeciesConstructor, ToIntegerOrInfinity, defaultCompare } from "./_spec.mjs";
import { hasOwn } from "./_util/hasOwn.mjs";
import { isArrayBuffer, isBigIntTypedArray, isCanonicalIntegerIndexString, isIterable, isObject, isObjectLike, isOrdinaryArray, isOrdinaryTypedArray, isSharedArrayBuffer, isTypedArray, isUint16Array } from "./_util/is.mjs";
import { createPrivateStorage } from "./_util/private.mjs";

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
    throw TypeError("Constructor is not a object");
  }

  return Reflect.has(constructor, brand);
}

/**
 * @param {unknown} target
 * @returns {target is Float16Array}
 */
export function isFloat16Array(target) {
  return hasFloat16ArrayBrand(target) && !isTypedArray(target);
}

/**
 * @param {unknown} target
 * @returns {target is Uint16Array & { __float16bits: never }}
 */
function isFloat16BitsArray(target) {
  return hasFloat16ArrayBrand(target) && isUint16Array(target);
}

/**
 * @param {unknown} target
 * @throws {TypeError}
 */
function assertFloat16Array(target) {
  if (!isFloat16Array(target)) {
    throw new TypeError("This is not a Float16Array");
  }
}

/**
 * @param {unknown} target
 * @throws {TypeError}
 */
function assertSpeciesTypedArray(target) {
  if (isFloat16Array(target)) {
    return;
  }

  if (!isTypedArray(target)) {
    throw new TypeError("SpeciesConstructor didn't return TypedArray");
  }

  if (isBigIntTypedArray(target)) {
    throw new TypeError("Cannot mix BigInt and other types, use explicit conversions");
  }
}

/**
 * @param {Float16Array} float16
 * @returns {Uint16Array & { __float16bits: never }}
 */
function getFloat16BitsArray(float16) {
  let target = _(float16).target;

  // from other realms
  if (target === undefined) {
    const clone = new Float16Array(float16.buffer, float16.byteOffset, float16.length);
    target = _(clone).target;
  }

  return target;
}

/**
 * @param {Uint16Array & { __float16bits: never }} float16bitsArray
 * @returns {number[]}
 */
function copyToArray(float16bitsArray) {
  const length = float16bitsArray.length;

  const array = [];
  for (let i = 0; i < length; ++i) {
    array[i] = convertToNumber(float16bitsArray[i]);
  }

  return array;
}

const TypedArrayPrototype = Reflect.getPrototypeOf(Uint8Array).prototype;

const TypedArrayPrototypeGetters = new Set();
for (const key of Reflect.ownKeys(TypedArrayPrototype)) {
  const descriptor = Object.getOwnPropertyDescriptor(TypedArrayPrototype, key);
  if (hasOwn(descriptor, "get")) {
    TypedArrayPrototypeGetters.add(key);
  }
}

/** @type {ProxyHandler<Float16Array>} */
const handler = Object.freeze({
  get(target, key, receiver) {
    if (isCanonicalIntegerIndexString(key) && hasOwn(target, key)) {
      return convertToNumber(Reflect.get(target, key));
    }

    if (TypedArrayPrototypeGetters.has(key)) {
      return Reflect.get(target, key);
    }

    return Reflect.get(target, key, receiver);
  },

  set(target, key, value, receiver) {
    if (isCanonicalIntegerIndexString(key) && hasOwn(target, key)) {
      return Reflect.set(target, key, roundToFloat16Bits(value));
    }

    return Reflect.set(target, key, value, receiver);
  },
});

/** limitation: `Object.getPrototypeOf(Float16Array)` returns `Uint16Array` */
export class Float16Array extends Uint16Array {

  /** @see https://tc39.es/ecma262/#sec-typedarray */
  constructor(input, byteOffset, length) {
    // input Float16Array
    if (isFloat16Array(input)) {
      // peel off Proxy
      const float16bitsArray = getFloat16BitsArray(input);
      super(float16bitsArray);

    // object without ArrayBuffer
    } else if (isObject(input) && !isArrayBuffer(input)) {
      /** @type {ArrayLike<number>} */
      let list;
      /** @type {number} */
      let length;

      // TypedArray
      if (isTypedArray(input)) {
        if (isBigIntTypedArray(input)) {
          throw new TypeError("Cannot mix BigInt and other types, use explicit conversions");
        }

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

    return proxy;
  }

  /**
   * limitation: `Object.getOwnPropertyNames(Float16Array)` or `Reflect.ownKeys(Float16Array)` include this key
   *
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
   *
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
      const float16bitsArray = getFloat16BitsArray(proxy);

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

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys */
  keys() {
    assertFloat16Array(this);

    return Reflect.apply(super.keys, getFloat16BitsArray(this), []);
  }

  /**
   * limitation: returns a object whose prototype is not `%ArrayIteratorPrototype%`
   *
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
   */
  values() {
    assertFloat16Array(this);

    const arrayIterator = Reflect.apply(super.values, getFloat16BitsArray(this), []);
    return wrapInArrayIterator((function* () {
      for (const val of arrayIterator) {
        yield convertToNumber(val);
      }
    })());
  }

  /**
   * limitation: returns a object whose prototype is not `%ArrayIteratorPrototype%`
   *
   * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
   */
  entries() {
    assertFloat16Array(this);

    const arrayIterator = Reflect.apply(super.entries, getFloat16BitsArray(this), []);
    return wrapInArrayIterator((function* () {
      for (const [i, val] of arrayIterator) {
        yield [i, convertToNumber(val)];
      }
    })());
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.at */
  at(index) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;
    const relativeIndex = ToIntegerOrInfinity(index);
    const k = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;

    if (k < 0 || k >= length) {
      return;
    }

    return convertToNumber(float16bitsArray[k]);
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.map */
  map(callback, ...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;
    const thisArg = opts[0];

    const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);

    // for optimization
    if (Constructor === Float16Array) {
      const proxy = new Float16Array(length);
      const array = getFloat16BitsArray(proxy);

      for (let i = 0; i < length; ++i) {
        const val = convertToNumber(float16bitsArray[i]);
        array[i] = roundToFloat16Bits(callback.call(thisArg, val, i, this));
      }

      return proxy;
    }

    const array = new Constructor(length);
    assertSpeciesTypedArray(array);

    for (let i = 0; i < length; ++i) {
      const val = convertToNumber(float16bitsArray[i]);
      array[i] = callback.call(thisArg, val, i, this);
    }

    return array;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter */
  filter(callback, ...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;
    const thisArg = opts[0];

    const kept = [];
    for (let i = 0; i < length; ++i) {
      const val = convertToNumber(float16bitsArray[i]);
      if (callback.call(thisArg, val, i, this)) {
        kept.push(val);
      }
    }

    const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);
    const array = new Constructor(kept);
    assertSpeciesTypedArray(array);

    return array;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce */
  reduce(callback, ...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;
    if (length === 0 && opts.length === 0) {
      throw TypeError("Reduce of empty array with no initial value");
    }

    let accumulator, start;
    if (opts.length === 0) {
      accumulator = convertToNumber(float16bitsArray[0]);
      start = 1;
    } else {
      accumulator = opts[0];
      start = 0;
    }

    for (let i = start; i < length; ++i) {
      accumulator = callback(accumulator, convertToNumber(float16bitsArray[i]), i, this);
    }

    return accumulator;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright */
  reduceRight(callback, ...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;
    if (length === 0 && opts.length === 0) {
      throw TypeError("Reduce of empty array with no initial value");
    }

    let accumulator, start;
    if (opts.length === 0) {
      accumulator = convertToNumber(float16bitsArray[length - 1]);
      start = length - 2;
    } else {
      accumulator = opts[0];
      start = length - 1;
    }

    for (let i = start; i >= 0; --i) {
      accumulator = callback(accumulator, convertToNumber(float16bitsArray[i]), i, this);
    }

    return accumulator;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach */
  forEach(callback, ...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;
    const thisArg = opts[0];

    for (let i = 0; i < length; ++i) {
      callback.call(thisArg, convertToNumber(float16bitsArray[i]), i, this);
    }
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.find */
  find(callback, ...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;
    const thisArg = opts[0];

    for (let i = 0; i < length; ++i) {
      const value = convertToNumber(float16bitsArray[i]);
      if (callback.call(thisArg, value, i, this)) {
        return value;
      }
    }
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex */
  findIndex(callback, ...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;
    const thisArg = opts[0];

    for (let i = 0; i < length; ++i) {
      const value = convertToNumber(float16bitsArray[i]);
      if (callback.call(thisArg, value, i, this)) {
        return i;
      }
    }

    return -1;
  }

  /** @see https://tc39.es/proposal-array-find-from-last/index.html#sec-%typedarray%.prototype.findlast */
  findLast(callback, ...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;
    const thisArg = opts[0];

    for (let i = length - 1; i >= 0; --i) {
      const value = convertToNumber(float16bitsArray[i]);
      if (callback.call(thisArg, value, i, this)) {
        return value;
      }
    }
  }

  /** @see https://tc39.es/proposal-array-find-from-last/index.html#sec-%typedarray%.prototype.findlastindex */
  findLastIndex(callback, ...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;
    const thisArg = opts[0];

    for (let i = length - 1; i >= 0; --i) {
      const value = convertToNumber(float16bitsArray[i]);
      if (callback.call(thisArg, value, i, this)) {
        return i;
      }
    }

    return -1;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.every */
  every(callback, ...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;
    const thisArg = opts[0];

    for (let i = 0; i < length; ++i) {
      if (!callback.call(thisArg, convertToNumber(float16bitsArray[i]), i, this)) {
        return false;
      }
    }

    return true;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.some */
  some(callback, ...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;
    const thisArg = opts[0];

    for (let i = 0; i < length; ++i) {
      if (callback.call(thisArg, convertToNumber(float16bitsArray[i]), i, this)) {
        return true;
      }
    }

    return false;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.set */
  set(input, ...opts) {
    assertFloat16Array(this);

    const targetOffset = ToIntegerOrInfinity(opts[0]);
    if (targetOffset < 0) {
      throw RangeError("Offset is out of bounds");
    }

    if (isBigIntTypedArray(input)) {
      throw new TypeError("Cannot mix BigInt and other types, use explicit conversions");
    }

    // for optimization
    if (isFloat16Array(input)) {
      // peel off Proxy
      return Reflect.apply(super.set, getFloat16BitsArray(this), [
        getFloat16BitsArray(input),
        targetOffset,
      ]);
    }

    const float16bitsArray = getFloat16BitsArray(this);

    const targetLength = float16bitsArray.length;

    const src = Object(input);
    const srcLength = LengthOfArrayLike(src);

    if (targetOffset === Infinity || srcLength + targetOffset > targetLength) {
      throw RangeError("Offset is out of bounds");
    }

    for (let i = 0; i < srcLength; ++i) {
      float16bitsArray[i + targetOffset] = roundToFloat16Bits(src[i]);
    }
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse */
  reverse() {
    assertFloat16Array(this);

    Reflect.apply(super.reverse, getFloat16BitsArray(this), []);

    return this;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill */
  fill(value, ...opts) {
    assertFloat16Array(this);

    Reflect.apply(super.fill, getFloat16BitsArray(this), [roundToFloat16Bits(value), ...opts]);

    return this;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin */
  copyWithin(target, start, ...opts) {
    assertFloat16Array(this);

    Reflect.apply(super.copyWithin, getFloat16BitsArray(this), [target, start, ...opts]);

    return this;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort */
  sort(...opts) {
    assertFloat16Array(this);

    const compare = opts[0] !== undefined ? opts[0] : defaultCompare;
    Reflect.apply(super.sort, getFloat16BitsArray(this), [(x, y) => { return compare(convertToNumber(x), convertToNumber(y)); }]);

    return this;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice */
  slice(...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);

    // for optimization
    if (Constructor === Float16Array) {
      const uint16 = new Uint16Array(float16bitsArray.buffer, float16bitsArray.byteOffset, float16bitsArray.length);
      return new Float16Array(uint16.slice(...opts).buffer);
    }

    const length = float16bitsArray.length;
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
    assertSpeciesTypedArray(array);

    if (count === 0) {
      return array;
    }

    let n = 0;
    while (k < final) {
      array[n] = convertToNumber(float16bitsArray[k]);
      ++k;
      ++n;
    }

    return array;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray */
  subarray(...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);

    const uint16 = new Uint16Array(float16bitsArray.buffer, float16bitsArray.byteOffset, float16bitsArray.length);
    const uint16Subarray = uint16.subarray(...opts);

    const array = new Constructor(uint16Subarray.buffer, uint16Subarray.byteOffset, uint16Subarray.length);
    assertSpeciesTypedArray(array);

    return array;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof */
  indexOf(element, ...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;

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

    for (let i = from; i < length; ++i) {
      if (hasOwn(float16bitsArray, i) && convertToNumber(float16bitsArray[i]) === element) {
        return i;
      }
    }

    return -1;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof */
  lastIndexOf(element, ...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;

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
      if (hasOwn(float16bitsArray, i) && convertToNumber(float16bitsArray[i]) === element) {
        return i;
      }
    }

    return -1;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes */
  includes(element, ...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);

    const length = float16bitsArray.length;

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
    for (let i = from; i < length; ++i) {
      const value = convertToNumber(float16bitsArray[i]);

      if (isNaN && Number.isNaN(value)) {
        return true;
      }

      if (value === element) {
        return true;
      }
    }

    return false;
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.join */
  join(...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);
    const array = copyToArray(float16bitsArray);

    return array.join(...opts);
  }

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring */
  toLocaleString(...opts) {
    assertFloat16Array(this);

    const float16bitsArray = getFloat16BitsArray(this);
    const array = copyToArray(float16bitsArray);

    return array.toLocaleString(...opts);
  }

  /** @see https://tc39.es/ecma262/#sec-get-%typedarray%.prototype-@@tostringtag */
  get [Symbol.toStringTag]() {
    if (isFloat16BitsArray(this)) {
      return "Float16Array";
    }
  }
}

/** @see https://tc39.es/ecma262/#sec-typedarray.bytes_per_element */
Object.defineProperty(Float16Array, "BYTES_PER_ELEMENT", { value: Uint16Array.BYTES_PER_ELEMENT });

/** limitation: It is peaked by `Object.getOwnPropertySymbols(Float16Array)` and `Reflect.ownKeys(Float16Array)` */
Object.defineProperty(Float16Array, brand, {});

const Float16ArrayPrototype = Float16Array.prototype;

/** @see https://tc39.es/ecma262/#sec-typedarray.prototype.bytes_per_element */
Object.defineProperty(Float16ArrayPrototype, "BYTES_PER_ELEMENT", { value: Uint16Array.BYTES_PER_ELEMENT });

/** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator */
Object.defineProperty(Float16ArrayPrototype, Symbol.iterator, {
  value: Float16ArrayPrototype.values,
  writable: true,
  configurable: true,
});

// To make `new Float16Array() instanceof Uint16Array` returns `false`
Reflect.setPrototypeOf(Float16ArrayPrototype, TypedArrayPrototype);
