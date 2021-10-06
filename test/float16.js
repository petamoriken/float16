/*! @petamoriken/float16 v3.4.7-23-g61ac23c | MIT License - https://git.io/float16 */

const float16 = (function (exports) {
  'use strict';

  // algorithm: http://fox-toolkit.org/ftp/fasthalffloatconversion.pdf

  const buffer = new ArrayBuffer(4);
  const floatView = new Float32Array(buffer);
  const uint32View = new Uint32Array(buffer);

  const baseTable = new Uint32Array(512);
  const shiftTable = new Uint32Array(512);

  for (let i = 0; i < 256; ++i) {
    const e = i - 127;

    // very small number (0, -0)
    if (e < -27) {
      baseTable[i]         = 0x0000;
      baseTable[i | 0x100] = 0x8000;
      shiftTable[i]         = 24;
      shiftTable[i | 0x100] = 24;

    // small number (denorm)
    } else if (e < -14) {
      baseTable[i]         =  0x0400 >> (-e - 14);
      baseTable[i | 0x100] = (0x0400 >> (-e - 14)) | 0x8000;
      shiftTable[i]         = -e - 1;
      shiftTable[i | 0x100] = -e - 1;

    // normal number
    } else if (e <= 15) {
      baseTable[i]         =  (e + 15) << 10;
      baseTable[i | 0x100] = ((e + 15) << 10) | 0x8000;
      shiftTable[i]         = 13;
      shiftTable[i | 0x100] = 13;

    // large number (Infinity, -Infinity)
    } else if (e < 128) {
      baseTable[i]         = 0x7c00;
      baseTable[i | 0x100] = 0xfc00;
      shiftTable[i]         = 24;
      shiftTable[i | 0x100] = 24;

    // stay (NaN, Infinity, -Infinity)
    } else {
      baseTable[i]         = 0x7c00;
      baseTable[i | 0x100] = 0xfc00;
      shiftTable[i]         = 13;
      shiftTable[i | 0x100] = 13;
    }
  }

  /**
   * round a number to a half float number bits.
   * @param {number} num - double float
   * @returns {number} half float number bits
   */
  function roundToFloat16Bits(num) {
    floatView[0] = num;
    const f = uint32View[0];
    const e = (f >> 23) & 0x1ff;
    return baseTable[e] + ((f & 0x007fffff) >> shiftTable[e]);
  }

  const mantissaTable = new Uint32Array(2048);
  const exponentTable = new Uint32Array(64);
  const offsetTable = new Uint32Array(64);

  mantissaTable[0] = 0;
  for (let i = 1; i < 1024; ++i) {
    let m = i << 13;    // zero pad mantissa bits
    let e = 0;          // zero exponent

    // normalized
    while((m & 0x00800000) === 0) {
      e -= 0x00800000;  // decrement exponent
      m <<= 1;
    }

    m &= ~0x00800000;   // clear leading 1 bit
    e += 0x38800000;    // adjust bias

    mantissaTable[i] = m | e;
  }
  for (let i = 1024; i < 2048; ++i) {
    mantissaTable[i] = 0x38000000 + ((i - 1024) << 13);
  }

  exponentTable[0] = 0;
  for (let i = 1; i < 31; ++i) {
    exponentTable[i] = i << 23;
  }
  exponentTable[31] = 0x47800000;
  exponentTable[32] = 0x80000000;
  for (let i = 33; i < 63; ++i) {
    exponentTable[i] = 0x80000000 + ((i - 32) << 23);
  }
  exponentTable[63] = 0xc7800000;

  offsetTable[0] = 0;
  for (let i = 1; i < 64; ++i) {
    if (i === 32) {
      offsetTable[i] = 0;
    } else {
      offsetTable[i] = 1024;
    }
  }

  /**
   * convert a half float number bits to a number.
   * @param {number} float16bits - half float number bits
   * @returns {number} double float
   */
  function convertToNumber(float16bits) {
    const m = float16bits >> 10;
    uint32View[0] = mantissaTable[offsetTable[m] + (float16bits & 0x3ff)] + exponentTable[m];
    return floatView[0];
  }

  /**
   * returns the nearest half precision float representation of a number.
   * @param {number} num
   * @returns {number}
   */
  function hfround(num) {
    if (typeof num === "bigint") {
      throw TypeError("Cannot convert a BigInt value to a number");
    }

    num = Number(num);

    // for optimization
    if (!Number.isFinite(num) || num === 0) {
      return num;
    }

    const x16 = roundToFloat16Bits(num);
    return convertToNumber(x16);
  }

  /**
   * @returns {(self: object) => object}
   */
  function createPrivateStorage() {
    const wm = new WeakMap();
    return (self) => {
      const storage = wm.get(self);
      if (storage !== undefined) {
        return storage;
      }

      const obj = Object.create(null);
      wm.set(self, obj);
      return obj;
    };
  }

  const _$1 = createPrivateStorage();

  const IteratorPrototype = Reflect.getPrototypeOf(Reflect.getPrototypeOf([][Symbol.iterator]()));

  /**
   * @see https://tc39.es/ecma262/#sec-%arrayiteratorprototype%-object
   */
  const ArrayIteratorPrototype = Object.create(IteratorPrototype, {
    next: {
      value: function next() {
        return _$1(this).iterator.next();
      },
      writable: true,
      configurable: true,
    },

    [Symbol.toStringTag]: {
      value: "Array Iterator",
      configurable: true,
    },
  });

  /**
   * @param {Iterator<number>} iterator
   * @returns {IterableIterator<number>}
   */
  function wrapInArrayIterator(iterator) {
    const arrayIterator = Object.create(ArrayIteratorPrototype);
    _$1(arrayIterator).iterator = iterator;
    return arrayIterator;
  }

  /**
   * @param {unknown} value
   * @returns {value is object}
   */
  function isObject(value) {
    return (value !== null && typeof value === "object") || typeof value === "function";
  }

  /**
   * @param {unknown} value
   * @returns {value is object}
   */
  function isObjectLike(value) {
    return value !== null && typeof value === "object";
  }

  // Inspired by util.types implementation of Node.js
  const TypedArrayPrototype = Reflect.getPrototypeOf(Uint8Array).prototype;
  const getTypedArrayPrototypeSybolToStringTag = Reflect.getOwnPropertyDescriptor(TypedArrayPrototype, Symbol.toStringTag).get;

  /**
   * @param {unknown} value
   * @returns {value is Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float32Array|Float64Array|BigUint64Array|BigInt64Array}
   */
  function isTypedArray(value) {
    return getTypedArrayPrototypeSybolToStringTag.call(value) !== undefined;
  }

  /**
   * @param {unknown} value
   * @returns {value is Uint16Array}
   */
  function isUint16Array(value) {
    return getTypedArrayPrototypeSybolToStringTag.call(value) === "Uint16Array";
  }

  const toString = Object.prototype.toString;

  /**
   * @param {unknown} value
   * @returns {value is DataView}
   */
  function isDataView(value) {
    if (!ArrayBuffer.isView(value)) {
      return false;
    }

    if (isTypedArray(value)) {
      return false;
    }

    if (toString.call(value) !== "[object DataView]") {
      return false;
    }

    return true;
  }

  /**
   * @param {unknown} value
   * @returns {value is ArrayBuffer}
   */
  function isArrayBuffer(value) {
    return isObjectLike(value) && toString.call(value) === "[object ArrayBuffer]";
  }

  /**
   * @param {unknown} value
   * @returns {value is SharedArrayBuffer}
   */
  function isSharedArrayBuffer(value) {
    return isObjectLike(value) && toString.call(value) === "[object SharedArrayBuffer]";
  }

  /**
   * @param {unknown} value
   * @returns {value is Iterable<any>}
   */
  function isIterable(value) {
    return isObject(value) && typeof value[Symbol.iterator] === "function";
  }

  /**
   * @param {unknown} value
   * @returns {value is any[]}
   */
  function isOrdinaryArray(value) {
    if (!Array.isArray(value)) {
      return false;
    }

    const iterator = value[Symbol.iterator]();
    if (toString.call(iterator) !== "[object Array Iterator]") {
      return false;
    }

    return true;
  }

  /**
   * @param {unknown} value
   * @returns {value is Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float32Array|Float64Array|BigUint64Array|BigInt64Array}
   */
  function isOrdinaryTypedArray(value) {
    if (!isTypedArray(value)) {
      return false;
    }

    const iterator = value[Symbol.iterator]();
    if (toString.call(iterator) !== "[object Array Iterator]") {
      return false;
    }

    return true;
  }

  /**
   * @param {unknown} value
   * @returns {value is string}
   */
  function isCanonicalIntegerIndexString(value) {
    if (typeof value !== "string") {
      return false;
    }

    const number = Number(value);
    if (value !== number + "") {
      return false;
    }

    if (!Number.isFinite(number)) {
      return false;
    }

    if (number !== Math.trunc(number)) {
      return false;
    }

    return true;
  }

  /**
   * @see https://tc39.es/ecma262/#sec-tointegerorinfinity
   * @param {unknown} target
   * @returns {number}
   */
  function ToIntegerOrInfinity(target) {
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
  function LengthOfArrayLike(arrayLike) {
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
  function SpeciesConstructor(target, defaultConstructor) {
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
  function defaultCompare(x, y) {
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
  function isFloat16Array(target) {
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
  class Float16Array extends Uint16Array {

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

  /**
   * returns an unsigned 16-bit float at the specified byte offset from the start of the DataView.
   * @param {DataView} dataView
   * @param {number} byteOffset
   * @param {[boolean]} opts
   * @returns {number}
   */
  function getFloat16(dataView, byteOffset, ...opts) {
    if (!isDataView(dataView)) {
      throw new TypeError("First argument to getFloat16 function must be a DataView");
    }

    return convertToNumber( dataView.getUint16(byteOffset, ...opts) );
  }

  /**
   * stores an unsigned 16-bit float value at the specified byte offset from the start of the DataView.
   * @param {DataView} dataView
   * @param {number} byteOffset
   * @param {number} value
   * @param {[boolean]} opts
   */
  function setFloat16(dataView, byteOffset, value, ...opts) {
    if (!isDataView(dataView)) {
      throw new TypeError("First argument to setFloat16 function must be a DataView");
    }

    dataView.setUint16(byteOffset, roundToFloat16Bits(value), ...opts);
  }

  exports.Float16Array = Float16Array;
  exports.getFloat16 = getFloat16;
  exports.hfround = hfround;
  exports.isFloat16Array = isFloat16Array;
  exports.setFloat16 = setFloat16;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXQxNi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2hlbHBlci9jb252ZXJ0ZXIubWpzIiwiLi4vc3JjL2hmcm91bmQubWpzIiwiLi4vc3JjL2hlbHBlci9wcml2YXRlLm1qcyIsIi4uL3NyYy9oZWxwZXIvYXJyYXlJdGVyYXRvci5tanMiLCIuLi9zcmMvaGVscGVyL2lzLm1qcyIsIi4uL3NyYy9oZWxwZXIvc3BlYy5tanMiLCIuLi9zcmMvRmxvYXQxNkFycmF5Lm1qcyIsIi4uL3NyYy9EYXRhVmlldy5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gYWxnb3JpdGhtOiBodHRwOi8vZm94LXRvb2xraXQub3JnL2Z0cC9mYXN0aGFsZmZsb2F0Y29udmVyc2lvbi5wZGZcblxuY29uc3QgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuY29uc3QgZmxvYXRWaWV3ID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXIpO1xuY29uc3QgdWludDMyVmlldyA9IG5ldyBVaW50MzJBcnJheShidWZmZXIpO1xuXG5jb25zdCBiYXNlVGFibGUgPSBuZXcgVWludDMyQXJyYXkoNTEyKTtcbmNvbnN0IHNoaWZ0VGFibGUgPSBuZXcgVWludDMyQXJyYXkoNTEyKTtcblxuZm9yIChsZXQgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBjb25zdCBlID0gaSAtIDEyNztcblxuICAvLyB2ZXJ5IHNtYWxsIG51bWJlciAoMCwgLTApXG4gIGlmIChlIDwgLTI3KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAweDAwMDA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gMjQ7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgLy8gc21hbGwgbnVtYmVyIChkZW5vcm0pXG4gIH0gZWxzZSBpZiAoZSA8IC0xNCkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gIDB4MDQwMCA+PiAoLWUgLSAxNCk7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAoMHgwNDAwID4+ICgtZSAtIDE0KSkgfCAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gLWUgLSAxO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IC1lIC0gMTtcblxuICAvLyBub3JtYWwgbnVtYmVyXG4gIH0gZWxzZSBpZiAoZSA8PSAxNSkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gIChlICsgMTUpIDw8IDEwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gKChlICsgMTUpIDw8IDEwKSB8IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAxMztcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcblxuICAvLyBsYXJnZSBudW1iZXIgKEluZmluaXR5LCAtSW5maW5pdHkpXG4gIH0gZWxzZSBpZiAoZSA8IDEyOCkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gMHg3YzAwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDI0O1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDI0O1xuXG4gIC8vIHN0YXkgKE5hTiwgSW5maW5pdHksIC1JbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBiYXNlVGFibGVbaV0gICAgICAgICA9IDB4N2MwMDtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ZmMwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAxMztcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcbiAgfVxufVxuXG4vKipcbiAqIHJvdW5kIGEgbnVtYmVyIHRvIGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBudW0gLSBkb3VibGUgZmxvYXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kVG9GbG9hdDE2Qml0cyhudW0pIHtcbiAgZmxvYXRWaWV3WzBdID0gbnVtO1xuICBjb25zdCBmID0gdWludDMyVmlld1swXTtcbiAgY29uc3QgZSA9IChmID4+IDIzKSAmIDB4MWZmO1xuICByZXR1cm4gYmFzZVRhYmxlW2VdICsgKChmICYgMHgwMDdmZmZmZikgPj4gc2hpZnRUYWJsZVtlXSk7XG59XG5cbmNvbnN0IG1hbnRpc3NhVGFibGUgPSBuZXcgVWludDMyQXJyYXkoMjA0OCk7XG5jb25zdCBleHBvbmVudFRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDY0KTtcbmNvbnN0IG9mZnNldFRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDY0KTtcblxubWFudGlzc2FUYWJsZVswXSA9IDA7XG5mb3IgKGxldCBpID0gMTsgaSA8IDEwMjQ7ICsraSkge1xuICBsZXQgbSA9IGkgPDwgMTM7ICAgIC8vIHplcm8gcGFkIG1hbnRpc3NhIGJpdHNcbiAgbGV0IGUgPSAwOyAgICAgICAgICAvLyB6ZXJvIGV4cG9uZW50XG5cbiAgLy8gbm9ybWFsaXplZFxuICB3aGlsZSgobSAmIDB4MDA4MDAwMDApID09PSAwKSB7XG4gICAgZSAtPSAweDAwODAwMDAwOyAgLy8gZGVjcmVtZW50IGV4cG9uZW50XG4gICAgbSA8PD0gMTtcbiAgfVxuXG4gIG0gJj0gfjB4MDA4MDAwMDA7ICAgLy8gY2xlYXIgbGVhZGluZyAxIGJpdFxuICBlICs9IDB4Mzg4MDAwMDA7ICAgIC8vIGFkanVzdCBiaWFzXG5cbiAgbWFudGlzc2FUYWJsZVtpXSA9IG0gfCBlO1xufVxuZm9yIChsZXQgaSA9IDEwMjQ7IGkgPCAyMDQ4OyArK2kpIHtcbiAgbWFudGlzc2FUYWJsZVtpXSA9IDB4MzgwMDAwMDAgKyAoKGkgLSAxMDI0KSA8PCAxMyk7XG59XG5cbmV4cG9uZW50VGFibGVbMF0gPSAwO1xuZm9yIChsZXQgaSA9IDE7IGkgPCAzMTsgKytpKSB7XG4gIGV4cG9uZW50VGFibGVbaV0gPSBpIDw8IDIzO1xufVxuZXhwb25lbnRUYWJsZVszMV0gPSAweDQ3ODAwMDAwO1xuZXhwb25lbnRUYWJsZVszMl0gPSAweDgwMDAwMDAwO1xuZm9yIChsZXQgaSA9IDMzOyBpIDwgNjM7ICsraSkge1xuICBleHBvbmVudFRhYmxlW2ldID0gMHg4MDAwMDAwMCArICgoaSAtIDMyKSA8PCAyMyk7XG59XG5leHBvbmVudFRhYmxlWzYzXSA9IDB4Yzc4MDAwMDA7XG5cbm9mZnNldFRhYmxlWzBdID0gMDtcbmZvciAobGV0IGkgPSAxOyBpIDwgNjQ7ICsraSkge1xuICBpZiAoaSA9PT0gMzIpIHtcbiAgICBvZmZzZXRUYWJsZVtpXSA9IDA7XG4gIH0gZWxzZSB7XG4gICAgb2Zmc2V0VGFibGVbaV0gPSAxMDI0O1xuICB9XG59XG5cbi8qKlxuICogY29udmVydCBhIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHMgdG8gYSBudW1iZXIuXG4gKiBAcGFyYW0ge251bWJlcn0gZmxvYXQxNmJpdHMgLSBoYWxmIGZsb2F0IG51bWJlciBiaXRzXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBkb3VibGUgZmxvYXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0cykge1xuICBjb25zdCBtID0gZmxvYXQxNmJpdHMgPj4gMTA7XG4gIHVpbnQzMlZpZXdbMF0gPSBtYW50aXNzYVRhYmxlW29mZnNldFRhYmxlW21dICsgKGZsb2F0MTZiaXRzICYgMHgzZmYpXSArIGV4cG9uZW50VGFibGVbbV07XG4gIHJldHVybiBmbG9hdFZpZXdbMF07XG59XG4iLCJpbXBvcnQgeyBjb252ZXJ0VG9OdW1iZXIsIHJvdW5kVG9GbG9hdDE2Qml0cyB9IGZyb20gXCIuL2hlbHBlci9jb252ZXJ0ZXIubWpzXCI7XG5cbi8qKlxuICogcmV0dXJucyB0aGUgbmVhcmVzdCBoYWxmIHByZWNpc2lvbiBmbG9hdCByZXByZXNlbnRhdGlvbiBvZiBhIG51bWJlci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoZnJvdW5kKG51bSkge1xuICBpZiAodHlwZW9mIG51bSA9PT0gXCJiaWdpbnRcIikge1xuICAgIHRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IGEgQmlnSW50IHZhbHVlIHRvIGEgbnVtYmVyXCIpO1xuICB9XG5cbiAgbnVtID0gTnVtYmVyKG51bSk7XG5cbiAgLy8gZm9yIG9wdGltaXphdGlvblxuICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pIHx8IG51bSA9PT0gMCkge1xuICAgIHJldHVybiBudW07XG4gIH1cblxuICBjb25zdCB4MTYgPSByb3VuZFRvRmxvYXQxNkJpdHMobnVtKTtcbiAgcmV0dXJuIGNvbnZlcnRUb051bWJlcih4MTYpO1xufVxuIiwiLyoqXG4gKiBAcmV0dXJucyB7KHNlbGY6IG9iamVjdCkgPT4gb2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJpdmF0ZVN0b3JhZ2UoKSB7XG4gIGNvbnN0IHdtID0gbmV3IFdlYWtNYXAoKTtcbiAgcmV0dXJuIChzZWxmKSA9PiB7XG4gICAgY29uc3Qgc3RvcmFnZSA9IHdtLmdldChzZWxmKTtcbiAgICBpZiAoc3RvcmFnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gc3RvcmFnZTtcbiAgICB9XG5cbiAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHdtLnNldChzZWxmLCBvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVQcml2YXRlU3RvcmFnZSB9IGZyb20gXCIuL3ByaXZhdGUubWpzXCI7XG5cbmNvbnN0IF8gPSBjcmVhdGVQcml2YXRlU3RvcmFnZSgpO1xuXG5jb25zdCBJdGVyYXRvclByb3RvdHlwZSA9IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YoUmVmbGVjdC5nZXRQcm90b3R5cGVPZihbXVtTeW1ib2wuaXRlcmF0b3JdKCkpKTtcblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJWFycmF5aXRlcmF0b3Jwcm90b3R5cGUlLW9iamVjdFxuICovXG5jb25zdCBBcnJheUl0ZXJhdG9yUHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge1xuICBuZXh0OiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICByZXR1cm4gXyh0aGlzKS5pdGVyYXRvci5uZXh0KCk7XG4gICAgfSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gIH0sXG5cbiAgW1N5bWJvbC50b1N0cmluZ1RhZ106IHtcbiAgICB2YWx1ZTogXCJBcnJheSBJdGVyYXRvclwiLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgfSxcbn0pO1xuXG4vKipcbiAqIEBwYXJhbSB7SXRlcmF0b3I8bnVtYmVyPn0gaXRlcmF0b3JcbiAqIEByZXR1cm5zIHtJdGVyYWJsZUl0ZXJhdG9yPG51bWJlcj59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3cmFwSW5BcnJheUl0ZXJhdG9yKGl0ZXJhdG9yKSB7XG4gIGNvbnN0IGFycmF5SXRlcmF0b3IgPSBPYmplY3QuY3JlYXRlKEFycmF5SXRlcmF0b3JQcm90b3R5cGUpO1xuICBfKGFycmF5SXRlcmF0b3IpLml0ZXJhdG9yID0gaXRlcmF0b3I7XG4gIHJldHVybiBhcnJheUl0ZXJhdG9yO1xufVxuIiwiLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgb2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBvYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIjtcbn1cblxuLy8gSW5zcGlyZWQgYnkgdXRpbC50eXBlcyBpbXBsZW1lbnRhdGlvbiBvZiBOb2RlLmpzXG5jb25zdCBUeXBlZEFycmF5UHJvdG90eXBlID0gUmVmbGVjdC5nZXRQcm90b3R5cGVPZihVaW50OEFycmF5KS5wcm90b3R5cGU7XG5jb25zdCBnZXRUeXBlZEFycmF5UHJvdG90eXBlU3lib2xUb1N0cmluZ1RhZyA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFR5cGVkQXJyYXlQcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZykuZ2V0O1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBVaW50OEFycmF5fFVpbnQ4Q2xhbXBlZEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fEludDhBcnJheXxJbnQxNkFycmF5fEludDMyQXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheXxCaWdVaW50NjRBcnJheXxCaWdJbnQ2NEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBnZXRUeXBlZEFycmF5UHJvdG90eXBlU3lib2xUb1N0cmluZ1RhZy5jYWxsKHZhbHVlKSAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBVaW50MTZBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVWludDE2QXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGdldFR5cGVkQXJyYXlQcm90b3R5cGVTeWJvbFRvU3RyaW5nVGFnLmNhbGwodmFsdWUpID09PSBcIlVpbnQxNkFycmF5XCI7XG59XG5cbmNvbnN0IHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgRGF0YVZpZXd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFWaWV3KHZhbHVlKSB7XG4gIGlmICghQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChpc1R5cGVkQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHRvU3RyaW5nLmNhbGwodmFsdWUpICE9PSBcIltvYmplY3QgRGF0YVZpZXddXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgQXJyYXlCdWZmZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBcIltvYmplY3QgQXJyYXlCdWZmZXJdXCI7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIFNoYXJlZEFycmF5QnVmZmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTaGFyZWRBcnJheUJ1ZmZlcih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gXCJbb2JqZWN0IFNoYXJlZEFycmF5QnVmZmVyXVwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBJdGVyYWJsZTxhbnk+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJdGVyYWJsZSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIHR5cGVvZiB2YWx1ZVtTeW1ib2wuaXRlcmF0b3JdID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIGFueVtdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPcmRpbmFyeUFycmF5KHZhbHVlKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBpdGVyYXRvciA9IHZhbHVlW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgaWYgKHRvU3RyaW5nLmNhbGwoaXRlcmF0b3IpICE9PSBcIltvYmplY3QgQXJyYXkgSXRlcmF0b3JdXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVWludDhBcnJheXxVaW50OENsYW1wZWRBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxJbnQ4QXJyYXl8SW50MTZBcnJheXxJbnQzMkFycmF5fEZsb2F0MzJBcnJheXxGbG9hdDY0QXJyYXl8QmlnVWludDY0QXJyYXl8QmlnSW50NjRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3JkaW5hcnlUeXBlZEFycmF5KHZhbHVlKSB7XG4gIGlmICghaXNUeXBlZEFycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gdmFsdWVbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICBpZiAodG9TdHJpbmcuY2FsbChpdGVyYXRvcikgIT09IFwiW29iamVjdCBBcnJheSBJdGVyYXRvcl1cIikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgbnVtYmVyID0gTnVtYmVyKHZhbHVlKTtcbiAgaWYgKHZhbHVlICE9PSBudW1iZXIgKyBcIlwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobnVtYmVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChudW1iZXIgIT09IE1hdGgudHJ1bmMobnVtYmVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuIiwiaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tIFwiLi9pcy5tanNcIjtcblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9pbnRlZ2Vyb3JpbmZpbml0eVxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBUb0ludGVnZXJPckluZmluaXR5KHRhcmdldCkge1xuICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJiaWdpbnRcIikge1xuICAgIHRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IGEgQmlnSW50IHZhbHVlIHRvIGEgbnVtYmVyXCIpO1xuICB9XG5cbiAgY29uc3QgbnVtYmVyID0gTnVtYmVyKHRhcmdldCk7XG5cbiAgaWYgKE51bWJlci5pc05hTihudW1iZXIpIHx8IG51bWJlciA9PT0gMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIE1hdGgudHJ1bmMobnVtYmVyKTtcbn1cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9sZW5ndGhcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBUb0xlbmd0aCh0YXJnZXQpIHtcbiAgY29uc3QgbGVuZ3RoID0gVG9JbnRlZ2VyT3JJbmZpbml0eSh0YXJnZXQpO1xuICBpZiAobGVuZ3RoIDwgMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIGxlbmd0aCA8IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSID8gbGVuZ3RoIDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWxlbmd0aG9mYXJyYXlsaWtlXG4gKiBAcGFyYW0ge29iamVjdH0gYXJyYXlMaWtlXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gTGVuZ3RoT2ZBcnJheUxpa2UoYXJyYXlMaWtlKSB7XG4gIGlmICghaXNPYmplY3QoYXJyYXlMaWtlKSkge1xuICAgIHRocm93IFR5cGVFcnJvcihcInRoaXMgaXMgbm90IGEgb2JqZWN0XCIpO1xuICB9XG5cbiAgcmV0dXJuIFRvTGVuZ3RoKGFycmF5TGlrZS5sZW5ndGgpO1xufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1zcGVjaWVzY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGRlZmF1bHRDb25zdHJ1Y3RvclxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5leHBvcnQgZnVuY3Rpb24gU3BlY2llc0NvbnN0cnVjdG9yKHRhcmdldCwgZGVmYXVsdENvbnN0cnVjdG9yKSB7XG4gIGlmICghaXNPYmplY3QodGFyZ2V0KSkge1xuICAgIHRocm93IFR5cGVFcnJvcihcInRoaXMgaXMgbm90IGEgb2JqZWN0XCIpO1xuICB9XG5cbiAgY29uc3QgY29uc3RydWN0b3IgPSB0YXJnZXQuY29uc3RydWN0b3I7XG4gIGlmIChjb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRDb25zdHJ1Y3RvcjtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KGNvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IFR5cGVFcnJvcihcImNvbnN0cnVjdG9yIGlzIG5vdCBhIG9iamVjdFwiKTtcbiAgfVxuXG4gIGNvbnN0IHNwZWNpZXMgPSBjb25zdHJ1Y3RvcltTeW1ib2wuc3BlY2llc107XG4gIGlmIChzcGVjaWVzID09IG51bGwpIHtcbiAgICByZXR1cm4gZGVmYXVsdENvbnN0cnVjdG9yO1xuICB9XG5cbiAgcmV0dXJuIHNwZWNpZXM7XG59XG5cbi8qKlxuICogYmlnaW50IGNvbXBhcmlzb25zIGFyZSBub3Qgc3VwcG9ydGVkXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb3J0XG4gKiBAcGFyYW0ge251bWJlcn0geFxuICogQHBhcmFtIHtudW1iZXJ9IHlcbiAqIEByZXR1cm5zIHstMSB8IDAgfCAxfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdENvbXBhcmUoeCwgeSkge1xuICBjb25zdCBpc05hTl94ID0gTnVtYmVyLmlzTmFOKHgpO1xuICBjb25zdCBpc05hTl95ID0gTnVtYmVyLmlzTmFOKHkpO1xuXG4gIGlmIChpc05hTl94ICYmIGlzTmFOX3kpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChpc05hTl94KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICBpZiAoaXNOYU5feSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmICh4IDwgeSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmICh4ID4geSkge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCkge1xuICAgIGNvbnN0IGlzUGx1c1plcm9feCA9IE9iamVjdC5pcyh4LCAwKTtcbiAgICBjb25zdCBpc1BsdXNaZXJvX3kgPSBPYmplY3QuaXMoeSwgMCk7XG5cbiAgICBpZiAoIWlzUGx1c1plcm9feCAmJiBpc1BsdXNaZXJvX3kpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoaXNQbHVzWmVyb194ICYmICFpc1BsdXNaZXJvX3kpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAwO1xufVxuIiwiaW1wb3J0IHsgd3JhcEluQXJyYXlJdGVyYXRvciB9IGZyb20gXCIuL2hlbHBlci9hcnJheUl0ZXJhdG9yLm1qc1wiO1xuaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9oZWxwZXIvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHsgaXNBcnJheUJ1ZmZlciwgaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcsIGlzSXRlcmFibGUsIGlzT2JqZWN0LCBpc09iamVjdExpa2UsIGlzT3JkaW5hcnlBcnJheSwgaXNPcmRpbmFyeVR5cGVkQXJyYXksIGlzU2hhcmVkQXJyYXlCdWZmZXIsIGlzVHlwZWRBcnJheSwgaXNVaW50MTZBcnJheSB9IGZyb20gXCIuL2hlbHBlci9pcy5tanNcIjtcbmltcG9ydCB7IGNyZWF0ZVByaXZhdGVTdG9yYWdlIH0gZnJvbSBcIi4vaGVscGVyL3ByaXZhdGUubWpzXCI7XG5pbXBvcnQgeyBMZW5ndGhPZkFycmF5TGlrZSwgU3BlY2llc0NvbnN0cnVjdG9yLCBUb0ludGVnZXJPckluZmluaXR5LCBkZWZhdWx0Q29tcGFyZSB9IGZyb20gXCIuL2hlbHBlci9zcGVjLm1qc1wiO1xuXG5jb25zdCBicmFuZCA9IFN5bWJvbC5mb3IoXCJfX0Zsb2F0MTZBcnJheV9fXCIpO1xuXG5jb25zdCBfID0gY3JlYXRlUHJpdmF0ZVN0b3JhZ2UoKTtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGhhc0Zsb2F0MTZBcnJheUJyYW5kKHRhcmdldCkge1xuICBpZiAoIWlzT2JqZWN0TGlrZSh0YXJnZXQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcHJvdG90eXBlID0gUmVmbGVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpO1xuICBpZiAoIWlzT2JqZWN0TGlrZShwcm90b3R5cGUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgY29uc3RydWN0b3IgPSBwcm90b3R5cGUuY29uc3RydWN0b3I7XG4gIGlmIChjb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICghaXNPYmplY3QoY29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiY29uc3RydWN0b3IgaXMgbm90IGEgb2JqZWN0XCIpO1xuICB9XG5cbiAgcmV0dXJuIFJlZmxlY3QuaGFzKGNvbnN0cnVjdG9yLCBicmFuZCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGbG9hdDE2QXJyYXkodGFyZ2V0KSB7XG4gIHJldHVybiBoYXNGbG9hdDE2QXJyYXlCcmFuZCh0YXJnZXQpICYmICFpc1R5cGVkQXJyYXkodGFyZ2V0KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRmxvYXQxNkJpdHNBcnJheSh0YXJnZXQpIHtcbiAgcmV0dXJuIGhhc0Zsb2F0MTZBcnJheUJyYW5kKHRhcmdldCkgJiYgaXNVaW50MTZBcnJheSh0YXJnZXQpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKi9cbmZ1bmN0aW9uIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGFyZ2V0KSB7XG4gIGlmICghaXNGbG9hdDE2Qml0c0FycmF5KHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhpcyBpcyBub3QgYSBGbG9hdDE2QXJyYXlcIik7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge0Zsb2F0MTZBcnJheX0gZmxvYXQxNlxuICogQHJldHVybiB7QXJyYXlMaWtlPG51bWJlcj59XG4gKi9cbmZ1bmN0aW9uIGdldEZsb2F0MTZCaXRzQXJyYXlGcm9tRmxvYXQxNkFycmF5KGZsb2F0MTYpIHtcbiAgbGV0IHRhcmdldCA9IF8oZmxvYXQxNikudGFyZ2V0O1xuXG4gIC8vIGZyb20gb3RoZXIgcmVhbG1zXG4gIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGNsb25lID0gbmV3IEZsb2F0MTZBcnJheShmbG9hdDE2LmJ1ZmZlciwgZmxvYXQxNi5ieXRlT2Zmc2V0LCBmbG9hdDE2Lmxlbmd0aCk7XG4gICAgdGFyZ2V0ID0gXyhjbG9uZSkudGFyZ2V0O1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0FycmF5TGlrZTxudW1iZXI+fSBmbG9hdDE2Yml0c0FycmF5XG4gKiBAcmV0dXJuIHtudW1iZXJbXX1cbiAqL1xuZnVuY3Rpb24gY29weVRvQXJyYXkoZmxvYXQxNmJpdHNBcnJheSkge1xuICBjb25zdCBsZW5ndGggPSBmbG9hdDE2Yml0c0FycmF5Lmxlbmd0aDtcblxuICBjb25zdCBhcnJheSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgYXJyYXlbaV0gPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gIH1cblxuICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0RlZmF1bHRGbG9hdDE2QXJyYXlNZXRob2RzKHRhcmdldCkge1xuICByZXR1cm4gdHlwZW9mIHRhcmdldCA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmF1bHRGbG9hdDE2QXJyYXlNZXRob2RzLmhhcyh0YXJnZXQpO1xufVxuXG4vKiogQHR5cGUge1Byb3h5SGFuZGxlcjxGdW5jdGlvbj59ICovXG5jb25zdCBhcHBseUhhbmRsZXIgPSBPYmplY3QuZnJlZXplKHtcbiAgYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncykge1xuICAgIC8vIHBlZWwgb2ZmIFByb3h5XG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KHRoaXNBcmcpKSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBnZXRGbG9hdDE2Qml0c0FycmF5RnJvbUZsb2F0MTZBcnJheSh0aGlzQXJnKTtcbiAgICAgIHJldHVybiBSZWZsZWN0LmFwcGx5KGZ1bmMsIHRhcmdldCwgYXJncyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZmxlY3QuYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncyk7XG4gIH0sXG59KTtcblxuY29uc3QgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vKiogQHR5cGUge1Byb3h5SGFuZGxlcjxGbG9hdDE2QXJyYXk+fSAqL1xuY29uc3QgaGFuZGxlciA9IE9iamVjdC5mcmVlemUoe1xuICBnZXQodGFyZ2V0LCBrZXkpIHtcbiAgICBpZiAoaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcoa2V5KSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHRhcmdldCwga2V5KSkge1xuICAgICAgcmV0dXJuIGNvbnZlcnRUb051bWJlcihSZWZsZWN0LmdldCh0YXJnZXQsIGtleSkpO1xuICAgIH1cblxuICAgIGNvbnN0IHJldCA9IFJlZmxlY3QuZ2V0KHRhcmdldCwga2V5KTtcbiAgICBpZiAoIWlzRGVmYXVsdEZsb2F0MTZBcnJheU1ldGhvZHMocmV0KSkge1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvLyBUeXBlZEFycmF5IG1ldGhvZHMgY2FuJ3QgYmUgY2FsbGVkIGJ5IFByb3h5IE9iamVjdFxuICAgIGxldCBwcm94eSA9IF8ocmV0KS5wcm94eTtcblxuICAgIGlmIChwcm94eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBwcm94eSA9IF8ocmV0KS5wcm94eSA9IG5ldyBQcm94eShyZXQsIGFwcGx5SGFuZGxlcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb3h5O1xuICB9LFxuXG4gIHNldCh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgICBpZiAoaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcoa2V5KSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHRhcmdldCwga2V5KSkge1xuICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcbiAgfSxcbn0pO1xuXG4vKipcbiAqIGxpbWl0YXRpb246IHNlZSBSRUFETUUubWQgZm9yIGRldGFpbHNcbiAqL1xuZXhwb3J0IGNsYXNzIEZsb2F0MTZBcnJheSBleHRlbmRzIFVpbnQxNkFycmF5IHtcblxuICAvKipcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXR5cGVkYXJyYXlcbiAgICovXG4gIGNvbnN0cnVjdG9yKGlucHV0LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgICAvLyBpbnB1dCBGbG9hdDE2QXJyYXlcbiAgICBpZiAoaXNGbG9hdDE2QXJyYXkoaW5wdXQpKSB7XG4gICAgICAvLyBwZWVsIG9mZiBQcm94eVxuICAgICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXlGcm9tRmxvYXQxNkFycmF5KGlucHV0KTtcbiAgICAgIHN1cGVyKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgLy8gb2JqZWN0IHdpdGhvdXQgQXJyYXlCdWZmZXJcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGlucHV0KSAmJiAhaXNBcnJheUJ1ZmZlcihpbnB1dCkpIHtcbiAgICAgIC8qKiBAdHlwZSB7QXJyYXlMaWtlPG51bWJlcj59ICovXG4gICAgICBsZXQgbGlzdDtcbiAgICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICAgICAgbGV0IGxlbmd0aDtcblxuICAgICAgLy8gVHlwZWRBcnJheVxuICAgICAgaWYgKGlzVHlwZWRBcnJheShpbnB1dCkpIHtcbiAgICAgICAgbGlzdCA9IGlucHV0O1xuICAgICAgICBsZW5ndGggPSBpbnB1dC5sZW5ndGg7XG5cbiAgICAgICAgY29uc3QgYnVmZmVyID0gaW5wdXQuYnVmZmVyO1xuICAgICAgICAvKiogQHR5cGUge0FycmF5QnVmZmVyQ29uc3RydWN0b3J9ICovXG4gICAgICAgIGNvbnN0IEJ1ZmZlckNvbnN0cnVjdG9yID0gIWlzU2hhcmVkQXJyYXlCdWZmZXIoYnVmZmVyKSA/IFNwZWNpZXNDb25zdHJ1Y3RvcihidWZmZXIsIEFycmF5QnVmZmVyKSA6IEFycmF5QnVmZmVyO1xuICAgICAgICBjb25zdCBkYXRhID0gbmV3IEJ1ZmZlckNvbnN0cnVjdG9yKGxlbmd0aCAqIEZsb2F0MTZBcnJheS5CWVRFU19QRVJfRUxFTUVOVCk7XG4gICAgICAgIHN1cGVyKGRhdGEpO1xuXG4gICAgICAvLyBJdGVyYWJsZSAoQXJyYXkpXG4gICAgICB9IGVsc2UgaWYgKGlzSXRlcmFibGUoaW5wdXQpKSB7XG4gICAgICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICAgICAgaWYgKGlzT3JkaW5hcnlBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICBsaXN0ID0gaW5wdXQ7XG4gICAgICAgICAgbGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuICAgICAgICAgIHN1cGVyKGxlbmd0aCk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaXN0ID0gWy4uLmlucHV0XTtcbiAgICAgICAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgICAgICBzdXBlcihsZW5ndGgpO1xuICAgICAgICB9XG5cbiAgICAgIC8vIEFycmF5TGlrZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGlzdCA9IGlucHV0O1xuICAgICAgICBsZW5ndGggPSBMZW5ndGhPZkFycmF5TGlrZShpbnB1dCk7XG4gICAgICAgIHN1cGVyKGxlbmd0aCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNldCB2YWx1ZXNcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgLy8gc3VwZXIgKFVpbnQxNkFycmF5KVxuICAgICAgICB0aGlzW2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGxpc3RbaV0pO1xuICAgICAgfVxuXG4gICAgLy8gcHJpbWl0aXZlLCBBcnJheUJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHN1cGVyKGlucHV0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc3VwZXIoaW5wdXQsIGJ5dGVPZmZzZXQpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzdXBlcihpbnB1dCwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcHJveHkgPSBuZXcgUHJveHkodGhpcywgaGFuZGxlcik7XG5cbiAgICAvLyBwcm94eSBwcml2YXRlIHN0b3JhZ2VcbiAgICBfKHByb3h5KS50YXJnZXQgPSB0aGlzO1xuXG4gICAgLy8gdGhpcyBwcml2YXRlIHN0b3JhZ2VcbiAgICBfKHRoaXMpLnByb3h5ID0gcHJveHk7XG5cbiAgICByZXR1cm4gcHJveHk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZsb2F0MTZBcnJheSlgIG9yIGBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5KWAgaW5jbHVkZSB0aGlzIGtleVxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLmZyb21cbiAgICovXG4gIHN0YXRpYyBmcm9tKHNyYywgLi4ub3B0cykge1xuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gdGhpcztcblxuICAgIGlmICghUmVmbGVjdC5oYXMoQ29uc3RydWN0b3IsIGJyYW5kKSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKFwiVGhpcyBjb25zdHJ1Y3RvciBpcyBub3QgYSBzdWJjbGFzcyBvZiBGbG9hdDE2QXJyYXlcIik7XG4gICAgfVxuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBpZiAoaXNGbG9hdDE2QXJyYXkoc3JjKSAmJiBvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zdCB1aW50MTYgPSBuZXcgVWludDE2QXJyYXkoc3JjLmJ1ZmZlciwgc3JjLmJ5dGVPZmZzZXQsIHNyYy5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheSh1aW50MTYuc2xpY2UoKS5idWZmZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoVWludDE2QXJyYXkuZnJvbShzcmMsIHJvdW5kVG9GbG9hdDE2Qml0cykuYnVmZmVyKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWFwRnVuYyA9IG9wdHNbMF07XG4gICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1sxXTtcblxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoVWludDE2QXJyYXkuZnJvbShzcmMsIGZ1bmN0aW9uICh2YWwsIC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHJvdW5kVG9GbG9hdDE2Qml0cyhtYXBGdW5jLmNhbGwodGhpcywgdmFsLCAuLi5hcmdzKSk7XG4gICAgICB9LCB0aGlzQXJnKS5idWZmZXIpO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7QXJyYXlMaWtlPG51bWJlcj59ICovXG4gICAgbGV0IGxpc3Q7XG4gICAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG4gICAgbGV0IGxlbmd0aDtcblxuICAgIC8vIEl0ZXJhYmxlIChUeXBlZEFycmF5LCBBcnJheSlcbiAgICBpZiAoaXNJdGVyYWJsZShzcmMpKSB7XG4gICAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgICBpZiAoaXNPcmRpbmFyeUFycmF5KHNyYykgfHwgaXNPcmRpbmFyeVR5cGVkQXJyYXkoc3JjKSkge1xuICAgICAgICBsaXN0ID0gc3JjO1xuICAgICAgICBsZW5ndGggPSBzcmMubGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGlzdCA9IFsuLi5zcmNdO1xuICAgICAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgIH1cblxuICAgIC8vIEFycmF5TGlrZVxuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0ID0gc3JjO1xuICAgICAgbGVuZ3RoID0gTGVuZ3RoT2ZBcnJheUxpa2Uoc3JjKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gbGlzdFtpXTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtYXBGdW5jID0gb3B0c1swXTtcbiAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzFdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBhcnJheVtpXSA9IG1hcEZ1bmMuY2FsbCh0aGlzQXJnLCBsaXN0W2ldLCBpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZsb2F0MTZBcnJheSlgIG9yIGBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5KWAgaW5jbHVkZSB0aGlzIGtleVxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLm9mXG4gICAqL1xuICBzdGF0aWMgb2YoLi4uaXRlbXMpIHtcbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICBpZiAoIVJlZmxlY3QuaGFzKENvbnN0cnVjdG9yLCBicmFuZCkpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcihcIlRoaXMgY29uc3RydWN0b3IgaXMgbm90IGEgc3ViY2xhc3Mgb2YgRmxvYXQxNkFycmF5XCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDtcblxuICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICBpZiAoQ29uc3RydWN0b3IgPT09IEZsb2F0MTZBcnJheSkge1xuICAgICAgY29uc3QgcHJveHkgPSBuZXcgRmxvYXQxNkFycmF5KGxlbmd0aCk7XG4gICAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheUZyb21GbG9hdDE2QXJyYXkocHJveHkpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXlbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMoaXRlbXNbaV0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGFycmF5W2ldID0gaXRlbXNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmtleXNcbiAgICovXG4gIGtleXMoKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIHJldHVybiBzdXBlci5rZXlzKCk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogcmV0dXJucyBhIG9iamVjdCB3aG9zZSBwcm90b3R5cGUgaXMgbm90IGAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSVgXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnZhbHVlc1xuICAgKi9cbiAgdmFsdWVzKCkge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheUl0ZXJhdG9yID0gc3VwZXIudmFsdWVzKCk7XG4gICAgcmV0dXJuIHdyYXBJbkFycmF5SXRlcmF0b3IoKGZ1bmN0aW9uKiAoKSB7XG4gICAgICBmb3IgKGNvbnN0IHZhbCBvZiBhcnJheUl0ZXJhdG9yKSB7XG4gICAgICAgIHlpZWxkIGNvbnZlcnRUb051bWJlcih2YWwpO1xuICAgICAgfVxuICAgIH0pKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IHJldHVybnMgYSBvYmplY3Qgd2hvc2UgcHJvdG90eXBlIGlzIG5vdCBgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlYFxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5lbnRyaWVzXG4gICAqL1xuICBlbnRyaWVzKCkge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheUl0ZXJhdG9yID0gc3VwZXIuZW50cmllcygpO1xuICAgIHJldHVybiB3cmFwSW5BcnJheUl0ZXJhdG9yKChmdW5jdGlvbiogKCkge1xuICAgICAgZm9yIChjb25zdCBbaSwgdmFsXSBvZiBhcnJheUl0ZXJhdG9yKSB7XG4gICAgICAgIHlpZWxkIFtpLCBjb252ZXJ0VG9OdW1iZXIodmFsKV07XG4gICAgICB9XG4gICAgfSkoKSk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtcmVsYXRpdmUtaW5kZXhpbmctbWV0aG9kLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5hdFxuICAgKi9cbiAgYXQoaW5kZXgpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gICAgY29uc3QgcmVsYXRpdmVJbmRleCA9IFRvSW50ZWdlck9ySW5maW5pdHkoaW5kZXgpO1xuICAgIGNvbnN0IGsgPSByZWxhdGl2ZUluZGV4ID49IDAgPyByZWxhdGl2ZUluZGV4IDogbGVuZ3RoICsgcmVsYXRpdmVJbmRleDtcblxuICAgIGlmIChrIDwgMCB8fCBrID49IGxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIodGhpc1trXSk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUubWFwXG4gICAqL1xuICBtYXAoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsIEZsb2F0MTZBcnJheSk7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IHByb3h5ID0gbmV3IEZsb2F0MTZBcnJheShsZW5ndGgpO1xuICAgICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXlGcm9tRmxvYXQxNkFycmF5KHByb3h5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCB2YWwgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXlbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWwsIGksIF8odGhpcykucHJveHkpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH1cblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCB2YWwgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICBhcnJheVtpXSA9IGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsLCBpLCBfKHRoaXMpLnByb3h5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmlsdGVyXG4gICAqL1xuICBmaWx0ZXIoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBjb25zdCBrZXB0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKHRoaXNbaV0pO1xuICAgICAgaWYgKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICBrZXB0LnB1c2godmFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCBGbG9hdDE2QXJyYXkpO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGtlcHQpO1xuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJlZHVjZVxuICAgKi9cbiAgcmVkdWNlKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggPT09IDAgJiYgb3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcihcIlJlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWVcIik7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKHRoaXNbMF0pO1xuICAgICAgc3RhcnQgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soYWNjdW11bGF0b3IsIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSwgaSwgXyh0aGlzKS5wcm94eSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJlZHVjZXJpZ2h0XG4gICAqL1xuICByZWR1Y2VSaWdodChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoXCJSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlXCIpO1xuICAgIH1cblxuICAgIGxldCBhY2N1bXVsYXRvciwgc3RhcnQ7XG4gICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNvbnZlcnRUb051bWJlcih0aGlzW2xlbmd0aCAtIDFdKTtcbiAgICAgIHN0YXJ0ID0gbGVuZ3RoIC0gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgYWNjdW11bGF0b3IgPSBvcHRzWzBdO1xuICAgICAgc3RhcnQgPSBsZW5ndGggLSAxO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soYWNjdW11bGF0b3IsIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSwgaSwgXyh0aGlzKS5wcm94eSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZvcmVhY2hcbiAgICovXG4gIGZvckVhY2goY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSwgaSwgXyh0aGlzKS5wcm94eSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbmRcbiAgICovXG4gIGZpbmQoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcbiAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbmRpbmRleFxuICAgKi9cbiAgZmluZEluZGV4KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLWFycmF5LWZpbmQtZnJvbS1sYXN0L2luZGV4Lmh0bWwjc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZGxhc3RcbiAgICovXG4gIGZpbmRMYXN0KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKHRoaXNbaV0pO1xuICAgICAgaWYgKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsdWUsIGksIF8odGhpcykucHJveHkpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtYXJyYXktZmluZC1mcm9tLWxhc3QvaW5kZXguaHRtbCNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kbGFzdGluZGV4XG4gICAqL1xuICBmaW5kTGFzdEluZGV4KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKHRoaXNbaV0pO1xuICAgICAgaWYgKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsdWUsIGksIF8odGhpcykucHJveHkpKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5ldmVyeVxuICAgKi9cbiAgZXZlcnkoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBpZiAoIWNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc29tZVxuICAgKi9cbiAgc29tZShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNldFxuICAgKi9cbiAgc2V0KGlucHV0LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IHRhcmdldE9mZnNldCA9IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSk7XG4gICAgaWYgKHRhcmdldE9mZnNldCA8IDApIHtcbiAgICAgIHRocm93IFJhbmdlRXJyb3IoXCJvZmZzZXQgaXMgb3V0IG9mIGJvdW5kc1wiKTtcbiAgICB9XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KGlucHV0KSkge1xuICAgICAgLy8gcGVlbCBvZmYgUHJveHlcbiAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5RnJvbUZsb2F0MTZBcnJheShpbnB1dCk7XG4gICAgICBzdXBlci5zZXQoZmxvYXQxNmJpdHNBcnJheSwgdGFyZ2V0T2Zmc2V0KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRMZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgIGNvbnN0IHNyYyA9IE9iamVjdChpbnB1dCk7XG4gICAgY29uc3Qgc3JjTGVuZ3RoID0gTGVuZ3RoT2ZBcnJheUxpa2Uoc3JjKTtcblxuICAgIGlmICh0YXJnZXRPZmZzZXQgPT09IEluZmluaXR5IHx8IHNyY0xlbmd0aCArIHRhcmdldE9mZnNldCA+IHRhcmdldExlbmd0aCkge1xuICAgICAgdGhyb3cgUmFuZ2VFcnJvcihcIm9mZnNldCBpcyBvdXQgb2YgYm91bmRzXCIpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3JjTGVuZ3RoOyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHRhcmdldE9mZnNldF0gPSByb3VuZFRvRmxvYXQxNkJpdHMoc3JjW2ldKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUucmV2ZXJzZVxuICAgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgc3VwZXIucmV2ZXJzZSgpO1xuXG4gICAgcmV0dXJuIF8odGhpcykucHJveHk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmlsbFxuICAgKi9cbiAgZmlsbCh2YWx1ZSwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBzdXBlci5maWxsKHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSksIC4uLm9wdHMpO1xuXG4gICAgcmV0dXJuIF8odGhpcykucHJveHk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuY29weXdpdGhpblxuICAgKi9cbiAgY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIHN1cGVyLmNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgLi4ub3B0cyk7XG5cbiAgICByZXR1cm4gXyh0aGlzKS5wcm94eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb3J0XG4gICAqL1xuICBzb3J0KC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgY29tcGFyZSA9IG9wdHNbMF0gIT09IHVuZGVmaW5lZCA/IG9wdHNbMF0gOiBkZWZhdWx0Q29tcGFyZTtcbiAgICBzdXBlci5zb3J0KCh4LCB5KSA9PiB7IHJldHVybiBjb21wYXJlKGNvbnZlcnRUb051bWJlcih4KSwgY29udmVydFRvTnVtYmVyKHkpKTsgfSk7XG5cbiAgICByZXR1cm4gXyh0aGlzKS5wcm94eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zbGljZVxuICAgKi9cbiAgc2xpY2UoLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCB1aW50MTYgPSBuZXcgVWludDE2QXJyYXkodGhpcy5idWZmZXIsIHRoaXMuYnl0ZU9mZnNldCwgdGhpcy5sZW5ndGgpO1xuICAgICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IHVpbnQxNi5zbGljZSguLi5vcHRzKTtcbiAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KGZsb2F0MTZiaXRzQXJyYXkuYnVmZmVyKTtcbiAgICB9XG5cbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICBjb25zdCBzdGFydCA9IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSk7XG4gICAgY29uc3QgZW5kID0gb3B0c1sxXSA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzFdKTtcblxuICAgIGxldCBrO1xuICAgIGlmIChzdGFydCA9PT0gLUluZmluaXR5KSB7XG4gICAgICBrID0gMDtcbiAgICB9IGVsc2UgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgayA9IGxlbmd0aCArIHN0YXJ0ID4gMCA/IGxlbmd0aCArIHN0YXJ0IDogMDtcbiAgICB9IGVsc2Uge1xuICAgICAgayA9IGxlbmd0aCA8IHN0YXJ0ID8gbGVuZ3RoIDogc3RhcnQ7XG4gICAgfVxuXG4gICAgbGV0IGZpbmFsO1xuICAgIGlmIChlbmQgPT09IC1JbmZpbml0eSkge1xuICAgICAgZmluYWwgPSAwO1xuICAgIH0gZWxzZSBpZiAoZW5kIDwgMCkge1xuICAgICAgZmluYWwgPSBsZW5ndGggKyBlbmQgPiAwID8gbGVuZ3RoICsgZW5kIDogMDtcbiAgICB9IGVsc2Uge1xuICAgICAgZmluYWwgPSBsZW5ndGggPCBlbmQgPyBsZW5ndGggOiBlbmQ7XG4gICAgfVxuXG4gICAgY29uc3QgY291bnQgPSBmaW5hbCAtIGsgPiAwID8gZmluYWwgLSBrIDogMDtcbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3Rvcihjb3VudCk7XG5cbiAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG5cbiAgICBsZXQgbiA9IDA7XG4gICAgd2hpbGUgKGsgPCBmaW5hbCkge1xuICAgICAgYXJyYXlbbl0gPSBjb252ZXJ0VG9OdW1iZXIodGhpc1trXSk7XG4gICAgICArK2s7XG4gICAgICArK247XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnN1YmFycmF5XG4gICAqL1xuICBzdWJhcnJheSguLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBVaW50MTZBcnJheSh0aGlzLmJ1ZmZlciwgdGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmxlbmd0aCk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IHVpbnQxNi5zdWJhcnJheSguLi5vcHRzKTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsIEZsb2F0MTZBcnJheSk7XG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IoZmxvYXQxNmJpdHNBcnJheS5idWZmZXIsIGZsb2F0MTZiaXRzQXJyYXkuYnl0ZU9mZnNldCwgZmxvYXQxNmJpdHNBcnJheS5sZW5ndGgpO1xuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmluZGV4b2ZcbiAgICovXG4gIGluZGV4T2YoZWxlbWVudCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAoZnJvbSA9PT0gSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBmcm9tLCBsID0gbGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLCBpKSAmJiBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSkgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmxhc3RpbmRleG9mXG4gICAqL1xuICBsYXN0SW5kZXhPZihlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgbGV0IGZyb20gPSBvcHRzLmxlbmd0aCA+PSAxID8gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKSA6IGxlbmd0aCAtIDE7XG4gICAgaWYgKGZyb20gPT09IC1JbmZpbml0eSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChmcm9tID49IDApIHtcbiAgICAgIGZyb20gPSBmcm9tIDwgbGVuZ3RoIC0gMSA/IGZyb20gOiBsZW5ndGggLSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMsIGkpICYmIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKipcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuaW5jbHVkZXNcbiAgICovXG4gIGluY2x1ZGVzKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgICBsZXQgZnJvbSA9IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSk7XG4gICAgaWYgKGZyb20gPT09IEluZmluaXR5KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICBmcm9tID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpc05hTiA9IE51bWJlci5pc05hTihlbGVtZW50KTtcbiAgICBmb3IgKGxldCBpID0gZnJvbSwgbCA9IGxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG5cbiAgICAgIGlmIChpc05hTiAmJiBOdW1iZXIuaXNOYU4odmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmpvaW5cbiAgICovXG4gIGpvaW4oLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KHRoaXMpO1xuXG4gICAgcmV0dXJuIGFycmF5LmpvaW4oLi4ub3B0cyk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUudG9sb2NhbGVzdHJpbmdcbiAgICovXG4gIHRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgYXJyYXkgPSBjb3B5VG9BcnJheSh0aGlzKTtcblxuICAgIHJldHVybiBhcnJheS50b0xvY2FsZVN0cmluZyguLi5vcHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtZ2V0LSV0eXBlZGFycmF5JS5wcm90b3R5cGUtQEB0b3N0cmluZ3RhZ1xuICAgKi9cbiAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuICAgIGlmIChpc0Zsb2F0MTZCaXRzQXJyYXkodGhpcykpIHtcbiAgICAgIHJldHVybiBcIkZsb2F0MTZBcnJheVwiO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10eXBlZGFycmF5LmJ5dGVzX3Blcl9lbGVtZW50XG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXksIFwiQllURVNfUEVSX0VMRU1FTlRcIiwgeyB2YWx1ZTogVWludDE2QXJyYXkuQllURVNfUEVSX0VMRU1FTlQgfSk7XG5cbi8qKlxuICogbGltaXRhdGlvbjogSXQgaXMgcGVha2VkIGJ5IGBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKEZsb2F0MTZBcnJheSlgIGFuZCBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXksIGJyYW5kLCB7fSk7XG5cbmNvbnN0IEZsb2F0MTZBcnJheVByb3RvdHlwZSA9IEZsb2F0MTZBcnJheS5wcm90b3R5cGU7XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUtQEBpdGVyYXRvclxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5UHJvdG90eXBlLCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgdmFsdWU6IEZsb2F0MTZBcnJheVByb3RvdHlwZS52YWx1ZXMsXG4gIHdyaXRhYmxlOiB0cnVlLFxuICBjb25maWd1cmFibGU6IHRydWUsXG59KTtcblxuY29uc3QgZGVmYXVsdEZsb2F0MTZBcnJheU1ldGhvZHMgPSBuZXcgV2Vha1NldCgpO1xuZm9yIChjb25zdCBrZXkgb2YgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheVByb3RvdHlwZSkpIHtcbiAgLy8gY29uc3RydWN0b3IgaXMgbm90IGNhbGxhYmxlXG4gIGlmIChrZXkgPT09IFwiY29uc3RydWN0b3JcIikge1xuICAgIGNvbnRpbnVlO1xuICB9XG5cbiAgY29uc3QgdmFsID0gRmxvYXQxNkFycmF5UHJvdG90eXBlW2tleV07XG4gIGlmICh0eXBlb2YgdmFsID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBkZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcy5hZGQodmFsKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9oZWxwZXIvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHsgaXNEYXRhVmlldyB9IGZyb20gXCIuL2hlbHBlci9pcy5tanNcIjtcblxuLyoqXG4gKiByZXR1cm5zIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlldy5cbiAqIEBwYXJhbSB7RGF0YVZpZXd9IGRhdGFWaWV3XG4gKiBAcGFyYW0ge251bWJlcn0gYnl0ZU9mZnNldFxuICogQHBhcmFtIHtbYm9vbGVhbl19IG9wdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCAuLi5vcHRzKSB7XG4gIGlmICghaXNEYXRhVmlldyhkYXRhVmlldykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmlyc3QgYXJndW1lbnQgdG8gZ2V0RmxvYXQxNiBmdW5jdGlvbiBtdXN0IGJlIGEgRGF0YVZpZXdcIik7XG4gIH1cblxuICByZXR1cm4gY29udmVydFRvTnVtYmVyKCBkYXRhVmlldy5nZXRVaW50MTYoYnl0ZU9mZnNldCwgLi4ub3B0cykgKTtcbn1cblxuLyoqXG4gKiBzdG9yZXMgYW4gdW5zaWduZWQgMTYtYml0IGZsb2F0IHZhbHVlIGF0IHRoZSBzcGVjaWZpZWQgYnl0ZSBvZmZzZXQgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIERhdGFWaWV3LlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCB2YWx1ZSwgLi4ub3B0cykge1xuICBpZiAoIWlzRGF0YVZpZXcoZGF0YVZpZXcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZpcnN0IGFyZ3VtZW50IHRvIHNldEZsb2F0MTYgZnVuY3Rpb24gbXVzdCBiZSBhIERhdGFWaWV3XCIpO1xuICB9XG5cbiAgZGF0YVZpZXcuc2V0VWludDE2KGJ5dGVPZmZzZXQsIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSksIC4uLm9wdHMpO1xufVxuIl0sIm5hbWVzIjpbIl8iXSwibWFwcGluZ3MiOiI7Ozs7O0VBQUE7QUFDQTtFQUNBLE1BQU0sTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2xDLE1BQU0sU0FBUyxHQUFHLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzNDLE1BQU0sVUFBVSxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDO0VBQ0EsTUFBTSxTQUFTLEdBQUcsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDdkMsTUFBTSxVQUFVLEdBQUcsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEM7RUFDQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQzlCLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNwQjtFQUNBO0VBQ0EsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRTtFQUNmLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLE1BQU0sQ0FBQztFQUNsQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDO0VBQ2xDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztFQUMvQixJQUFJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQy9CO0VBQ0E7RUFDQSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUU7RUFDdEIsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksTUFBTSxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0VBQ2hELElBQUksU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxNQUFNLENBQUM7RUFDMUQsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ25DLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkM7RUFDQTtFQUNBLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUU7RUFDdEIsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQztFQUMzQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLE1BQU0sQ0FBQztFQUNyRCxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7RUFDL0IsSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMvQjtFQUNBO0VBQ0EsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRTtFQUN0QixJQUFJLFNBQVMsQ0FBQyxDQUFDLENB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
