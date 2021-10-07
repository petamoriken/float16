/*! @petamoriken/float16 v3.4.7-33-g9e08f2f | MIT License - https://git.io/float16 */

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
   *
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
   *
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
   *
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

  /** @returns {(self: object) => object} */
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

  /** @see https://tc39.es/ecma262/#sec-%arrayiteratorprototype%-object */
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
   *
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

  const hasOwnProperty = Object.prototype.hasOwnProperty;

  /** @type {(object: object, key: PropertyKey) => boolean} */
  const hasOwn = Object.hasOwn || function hasOwn(object, key) {
    return hasOwnProperty.call(object, key);
  };

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
   * @returns {ArrayLike<number>}
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

  /** @type {ProxyHandler<Float16Array>} */
  const handler = Object.freeze({
    get(target, key) {
      if (isCanonicalIntegerIndexString(key) && hasOwn(target, key)) {
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
      if (isCanonicalIntegerIndexString(key) && hasOwn(target, key)) {
        return Reflect.set(target, key, roundToFloat16Bits(value));
      }

      return Reflect.set(target, key, value);
    },
  });

  /** limitation: see README.md for details */
  class Float16Array extends Uint16Array {

    /** @see https://tc39.es/ecma262/#sec-typedarray */
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

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys */
    keys() {
      assertFloat16BitsArray(this);

      return super.keys();
    }

    /**
     * limitation: returns a object whose prototype is not `%ArrayIteratorPrototype%`
     *
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
     *
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

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.at */
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

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.map */
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

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter */
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

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce */
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

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright */
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

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach */
    forEach(callback, ...opts) {
      assertFloat16BitsArray(this);

      const thisArg = opts[0];

      for (let i = 0, l = this.length; i < l; ++i) {
        callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy);
      }
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.find */
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

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex */
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

    /** @see https://tc39.es/proposal-array-find-from-last/index.html#sec-%typedarray%.prototype.findlast */
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

    /** @see https://tc39.es/proposal-array-find-from-last/index.html#sec-%typedarray%.prototype.findlastindex */
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

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.every */
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

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.some */
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

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.set */
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

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse */
    reverse() {
      assertFloat16BitsArray(this);

      super.reverse();

      return _(this).proxy;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill */
    fill(value, ...opts) {
      assertFloat16BitsArray(this);

      super.fill(roundToFloat16Bits(value), ...opts);

      return _(this).proxy;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin */
    copyWithin(target, start, ...opts) {
      assertFloat16BitsArray(this);

      super.copyWithin(target, start, ...opts);

      return _(this).proxy;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort */
    sort(...opts) {
      assertFloat16BitsArray(this);

      const compare = opts[0] !== undefined ? opts[0] : defaultCompare;
      super.sort((x, y) => { return compare(convertToNumber(x), convertToNumber(y)); });

      return _(this).proxy;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice */
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

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray */
    subarray(...opts) {
      assertFloat16BitsArray(this);

      const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
      const float16bitsArray = uint16.subarray(...opts);

      const Constructor = SpeciesConstructor(this, Float16Array);
      const array = new Constructor(float16bitsArray.buffer, float16bitsArray.byteOffset, float16bitsArray.length);

      return array;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof */
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
        if (hasOwn(this, i) && convertToNumber(this[i]) === element) {
          return i;
        }
      }

      return -1;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof */
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
        if (hasOwn(this, i) && convertToNumber(this[i]) === element) {
          return i;
        }
      }

      return -1;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes */
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

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.join */
    join(...opts) {
      assertFloat16BitsArray(this);

      const array = copyToArray(this);

      return array.join(...opts);
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring */
    toLocaleString(...opts) {
      assertFloat16BitsArray(this);

      const array = copyToArray(this);

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

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator */
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
   *
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
   *
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXQxNi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL19jb252ZXJ0ZXIubWpzIiwiLi4vc3JjL2hmcm91bmQubWpzIiwiLi4vc3JjL191dGlsL3ByaXZhdGUubWpzIiwiLi4vc3JjL19hcnJheUl0ZXJhdG9yLm1qcyIsIi4uL3NyYy9fdXRpbC9pcy5tanMiLCIuLi9zcmMvX3NwZWMubWpzIiwiLi4vc3JjL191dGlsL2hhc093bi5tanMiLCIuLi9zcmMvRmxvYXQxNkFycmF5Lm1qcyIsIi4uL3NyYy9EYXRhVmlldy5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gYWxnb3JpdGhtOiBodHRwOi8vZm94LXRvb2xraXQub3JnL2Z0cC9mYXN0aGFsZmZsb2F0Y29udmVyc2lvbi5wZGZcblxuY29uc3QgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuY29uc3QgZmxvYXRWaWV3ID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXIpO1xuY29uc3QgdWludDMyVmlldyA9IG5ldyBVaW50MzJBcnJheShidWZmZXIpO1xuXG5jb25zdCBiYXNlVGFibGUgPSBuZXcgVWludDMyQXJyYXkoNTEyKTtcbmNvbnN0IHNoaWZ0VGFibGUgPSBuZXcgVWludDMyQXJyYXkoNTEyKTtcblxuZm9yIChsZXQgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBjb25zdCBlID0gaSAtIDEyNztcblxuICAvLyB2ZXJ5IHNtYWxsIG51bWJlciAoMCwgLTApXG4gIGlmIChlIDwgLTI3KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAweDAwMDA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gMjQ7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgLy8gc21hbGwgbnVtYmVyIChkZW5vcm0pXG4gIH0gZWxzZSBpZiAoZSA8IC0xNCkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gIDB4MDQwMCA+PiAoLWUgLSAxNCk7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAoMHgwNDAwID4+ICgtZSAtIDE0KSkgfCAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gLWUgLSAxO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IC1lIC0gMTtcblxuICAvLyBub3JtYWwgbnVtYmVyXG4gIH0gZWxzZSBpZiAoZSA8PSAxNSkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gIChlICsgMTUpIDw8IDEwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gKChlICsgMTUpIDw8IDEwKSB8IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAxMztcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcblxuICAvLyBsYXJnZSBudW1iZXIgKEluZmluaXR5LCAtSW5maW5pdHkpXG4gIH0gZWxzZSBpZiAoZSA8IDEyOCkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gMHg3YzAwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDI0O1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDI0O1xuXG4gIC8vIHN0YXkgKE5hTiwgSW5maW5pdHksIC1JbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBiYXNlVGFibGVbaV0gICAgICAgICA9IDB4N2MwMDtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ZmMwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAxMztcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcbiAgfVxufVxuXG4vKipcbiAqIHJvdW5kIGEgbnVtYmVyIHRvIGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtIC0gZG91YmxlIGZsb2F0XG4gKiBAcmV0dXJucyB7bnVtYmVyfSBoYWxmIGZsb2F0IG51bWJlciBiaXRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByb3VuZFRvRmxvYXQxNkJpdHMobnVtKSB7XG4gIGZsb2F0Vmlld1swXSA9IG51bTtcbiAgY29uc3QgZiA9IHVpbnQzMlZpZXdbMF07XG4gIGNvbnN0IGUgPSAoZiA+PiAyMykgJiAweDFmZjtcbiAgcmV0dXJuIGJhc2VUYWJsZVtlXSArICgoZiAmIDB4MDA3ZmZmZmYpID4+IHNoaWZ0VGFibGVbZV0pO1xufVxuXG5jb25zdCBtYW50aXNzYVRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDIwNDgpO1xuY29uc3QgZXhwb25lbnRUYWJsZSA9IG5ldyBVaW50MzJBcnJheSg2NCk7XG5jb25zdCBvZmZzZXRUYWJsZSA9IG5ldyBVaW50MzJBcnJheSg2NCk7XG5cbm1hbnRpc3NhVGFibGVbMF0gPSAwO1xuZm9yIChsZXQgaSA9IDE7IGkgPCAxMDI0OyArK2kpIHtcbiAgbGV0IG0gPSBpIDw8IDEzOyAgICAvLyB6ZXJvIHBhZCBtYW50aXNzYSBiaXRzXG4gIGxldCBlID0gMDsgICAgICAgICAgLy8gemVybyBleHBvbmVudFxuXG4gIC8vIG5vcm1hbGl6ZWRcbiAgd2hpbGUoKG0gJiAweDAwODAwMDAwKSA9PT0gMCkge1xuICAgIGUgLT0gMHgwMDgwMDAwMDsgIC8vIGRlY3JlbWVudCBleHBvbmVudFxuICAgIG0gPDw9IDE7XG4gIH1cblxuICBtICY9IH4weDAwODAwMDAwOyAgIC8vIGNsZWFyIGxlYWRpbmcgMSBiaXRcbiAgZSArPSAweDM4ODAwMDAwOyAgICAvLyBhZGp1c3QgYmlhc1xuXG4gIG1hbnRpc3NhVGFibGVbaV0gPSBtIHwgZTtcbn1cbmZvciAobGV0IGkgPSAxMDI0OyBpIDwgMjA0ODsgKytpKSB7XG4gIG1hbnRpc3NhVGFibGVbaV0gPSAweDM4MDAwMDAwICsgKChpIC0gMTAyNCkgPDwgMTMpO1xufVxuXG5leHBvbmVudFRhYmxlWzBdID0gMDtcbmZvciAobGV0IGkgPSAxOyBpIDwgMzE7ICsraSkge1xuICBleHBvbmVudFRhYmxlW2ldID0gaSA8PCAyMztcbn1cbmV4cG9uZW50VGFibGVbMzFdID0gMHg0NzgwMDAwMDtcbmV4cG9uZW50VGFibGVbMzJdID0gMHg4MDAwMDAwMDtcbmZvciAobGV0IGkgPSAzMzsgaSA8IDYzOyArK2kpIHtcbiAgZXhwb25lbnRUYWJsZVtpXSA9IDB4ODAwMDAwMDAgKyAoKGkgLSAzMikgPDwgMjMpO1xufVxuZXhwb25lbnRUYWJsZVs2M10gPSAweGM3ODAwMDAwO1xuXG5vZmZzZXRUYWJsZVswXSA9IDA7XG5mb3IgKGxldCBpID0gMTsgaSA8IDY0OyArK2kpIHtcbiAgaWYgKGkgPT09IDMyKSB7XG4gICAgb2Zmc2V0VGFibGVbaV0gPSAwO1xuICB9IGVsc2Uge1xuICAgIG9mZnNldFRhYmxlW2ldID0gMTAyNDtcbiAgfVxufVxuXG4vKipcbiAqIGNvbnZlcnQgYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBmbG9hdDE2Yml0cyAtIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGRvdWJsZSBmbG9hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzKSB7XG4gIGNvbnN0IG0gPSBmbG9hdDE2Yml0cyA+PiAxMDtcbiAgdWludDMyVmlld1swXSA9IG1hbnRpc3NhVGFibGVbb2Zmc2V0VGFibGVbbV0gKyAoZmxvYXQxNmJpdHMgJiAweDNmZildICsgZXhwb25lbnRUYWJsZVttXTtcbiAgcmV0dXJuIGZsb2F0Vmlld1swXTtcbn1cbiIsImltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX2NvbnZlcnRlci5tanNcIjtcblxuLyoqXG4gKiByZXR1cm5zIHRoZSBuZWFyZXN0IGhhbGYgcHJlY2lzaW9uIGZsb2F0IHJlcHJlc2VudGF0aW9uIG9mIGEgbnVtYmVyLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoZnJvdW5kKG51bSkge1xuICBpZiAodHlwZW9mIG51bSA9PT0gXCJiaWdpbnRcIikge1xuICAgIHRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IGEgQmlnSW50IHZhbHVlIHRvIGEgbnVtYmVyXCIpO1xuICB9XG5cbiAgbnVtID0gTnVtYmVyKG51bSk7XG5cbiAgLy8gZm9yIG9wdGltaXphdGlvblxuICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pIHx8IG51bSA9PT0gMCkge1xuICAgIHJldHVybiBudW07XG4gIH1cblxuICBjb25zdCB4MTYgPSByb3VuZFRvRmxvYXQxNkJpdHMobnVtKTtcbiAgcmV0dXJuIGNvbnZlcnRUb051bWJlcih4MTYpO1xufVxuIiwiLyoqIEByZXR1cm5zIHsoc2VsZjogb2JqZWN0KSA9PiBvYmplY3R9ICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJpdmF0ZVN0b3JhZ2UoKSB7XG4gIGNvbnN0IHdtID0gbmV3IFdlYWtNYXAoKTtcbiAgcmV0dXJuIChzZWxmKSA9PiB7XG4gICAgY29uc3Qgc3RvcmFnZSA9IHdtLmdldChzZWxmKTtcbiAgICBpZiAoc3RvcmFnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gc3RvcmFnZTtcbiAgICB9XG5cbiAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHdtLnNldChzZWxmLCBvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVQcml2YXRlU3RvcmFnZSB9IGZyb20gXCIuL191dGlsL3ByaXZhdGUubWpzXCI7XG5cbmNvbnN0IF8gPSBjcmVhdGVQcml2YXRlU3RvcmFnZSgpO1xuXG5jb25zdCBJdGVyYXRvclByb3RvdHlwZSA9IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YoUmVmbGVjdC5nZXRQcm90b3R5cGVPZihbXVtTeW1ib2wuaXRlcmF0b3JdKCkpKTtcblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0lYXJyYXlpdGVyYXRvcnByb3RvdHlwZSUtb2JqZWN0ICovXG5jb25zdCBBcnJheUl0ZXJhdG9yUHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge1xuICBuZXh0OiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICByZXR1cm4gXyh0aGlzKS5pdGVyYXRvci5uZXh0KCk7XG4gICAgfSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gIH0sXG5cbiAgW1N5bWJvbC50b1N0cmluZ1RhZ106IHtcbiAgICB2YWx1ZTogXCJBcnJheSBJdGVyYXRvclwiLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgfSxcbn0pO1xuXG4vKipcbiAqIEBwYXJhbSB7SXRlcmF0b3I8bnVtYmVyPn0gaXRlcmF0b3JcbiAqIEByZXR1cm5zIHtJdGVyYWJsZUl0ZXJhdG9yPG51bWJlcj59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3cmFwSW5BcnJheUl0ZXJhdG9yKGl0ZXJhdG9yKSB7XG4gIGNvbnN0IGFycmF5SXRlcmF0b3IgPSBPYmplY3QuY3JlYXRlKEFycmF5SXRlcmF0b3JQcm90b3R5cGUpO1xuICBfKGFycmF5SXRlcmF0b3IpLml0ZXJhdG9yID0gaXRlcmF0b3I7XG4gIHJldHVybiBhcnJheUl0ZXJhdG9yO1xufVxuIiwiLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgb2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBvYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIjtcbn1cblxuLy8gSW5zcGlyZWQgYnkgdXRpbC50eXBlcyBpbXBsZW1lbnRhdGlvbiBvZiBOb2RlLmpzXG5jb25zdCBUeXBlZEFycmF5UHJvdG90eXBlID0gUmVmbGVjdC5nZXRQcm90b3R5cGVPZihVaW50OEFycmF5KS5wcm90b3R5cGU7XG5jb25zdCBnZXRUeXBlZEFycmF5UHJvdG90eXBlU3lib2xUb1N0cmluZ1RhZyA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFR5cGVkQXJyYXlQcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZykuZ2V0O1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBVaW50OEFycmF5fFVpbnQ4Q2xhbXBlZEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fEludDhBcnJheXxJbnQxNkFycmF5fEludDMyQXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheXxCaWdVaW50NjRBcnJheXxCaWdJbnQ2NEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBnZXRUeXBlZEFycmF5UHJvdG90eXBlU3lib2xUb1N0cmluZ1RhZy5jYWxsKHZhbHVlKSAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBVaW50MTZBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVWludDE2QXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGdldFR5cGVkQXJyYXlQcm90b3R5cGVTeWJvbFRvU3RyaW5nVGFnLmNhbGwodmFsdWUpID09PSBcIlVpbnQxNkFycmF5XCI7XG59XG5cbmNvbnN0IHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgRGF0YVZpZXd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFWaWV3KHZhbHVlKSB7XG4gIGlmICghQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChpc1R5cGVkQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHRvU3RyaW5nLmNhbGwodmFsdWUpICE9PSBcIltvYmplY3QgRGF0YVZpZXddXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgQXJyYXlCdWZmZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBcIltvYmplY3QgQXJyYXlCdWZmZXJdXCI7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIFNoYXJlZEFycmF5QnVmZmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTaGFyZWRBcnJheUJ1ZmZlcih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gXCJbb2JqZWN0IFNoYXJlZEFycmF5QnVmZmVyXVwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBJdGVyYWJsZTxhbnk+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJdGVyYWJsZSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIHR5cGVvZiB2YWx1ZVtTeW1ib2wuaXRlcmF0b3JdID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIGFueVtdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPcmRpbmFyeUFycmF5KHZhbHVlKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBpdGVyYXRvciA9IHZhbHVlW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgaWYgKHRvU3RyaW5nLmNhbGwoaXRlcmF0b3IpICE9PSBcIltvYmplY3QgQXJyYXkgSXRlcmF0b3JdXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVWludDhBcnJheXxVaW50OENsYW1wZWRBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxJbnQ4QXJyYXl8SW50MTZBcnJheXxJbnQzMkFycmF5fEZsb2F0MzJBcnJheXxGbG9hdDY0QXJyYXl8QmlnVWludDY0QXJyYXl8QmlnSW50NjRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3JkaW5hcnlUeXBlZEFycmF5KHZhbHVlKSB7XG4gIGlmICghaXNUeXBlZEFycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gdmFsdWVbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICBpZiAodG9TdHJpbmcuY2FsbChpdGVyYXRvcikgIT09IFwiW29iamVjdCBBcnJheSBJdGVyYXRvcl1cIikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgbnVtYmVyID0gTnVtYmVyKHZhbHVlKTtcbiAgaWYgKHZhbHVlICE9PSBudW1iZXIgKyBcIlwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobnVtYmVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChudW1iZXIgIT09IE1hdGgudHJ1bmMobnVtYmVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuIiwiaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tIFwiLi9fdXRpbC9pcy5tanNcIjtcblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9pbnRlZ2Vyb3JpbmZpbml0eVxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBUb0ludGVnZXJPckluZmluaXR5KHRhcmdldCkge1xuICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJiaWdpbnRcIikge1xuICAgIHRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IGEgQmlnSW50IHZhbHVlIHRvIGEgbnVtYmVyXCIpO1xuICB9XG5cbiAgY29uc3QgbnVtYmVyID0gTnVtYmVyKHRhcmdldCk7XG5cbiAgaWYgKE51bWJlci5pc05hTihudW1iZXIpIHx8IG51bWJlciA9PT0gMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIE1hdGgudHJ1bmMobnVtYmVyKTtcbn1cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9sZW5ndGhcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBUb0xlbmd0aCh0YXJnZXQpIHtcbiAgY29uc3QgbGVuZ3RoID0gVG9JbnRlZ2VyT3JJbmZpbml0eSh0YXJnZXQpO1xuICBpZiAobGVuZ3RoIDwgMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIGxlbmd0aCA8IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSID8gbGVuZ3RoIDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWxlbmd0aG9mYXJyYXlsaWtlXG4gKiBAcGFyYW0ge29iamVjdH0gYXJyYXlMaWtlXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gTGVuZ3RoT2ZBcnJheUxpa2UoYXJyYXlMaWtlKSB7XG4gIGlmICghaXNPYmplY3QoYXJyYXlMaWtlKSkge1xuICAgIHRocm93IFR5cGVFcnJvcihcInRoaXMgaXMgbm90IGEgb2JqZWN0XCIpO1xuICB9XG5cbiAgcmV0dXJuIFRvTGVuZ3RoKGFycmF5TGlrZS5sZW5ndGgpO1xufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1zcGVjaWVzY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGRlZmF1bHRDb25zdHJ1Y3RvclxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5leHBvcnQgZnVuY3Rpb24gU3BlY2llc0NvbnN0cnVjdG9yKHRhcmdldCwgZGVmYXVsdENvbnN0cnVjdG9yKSB7XG4gIGlmICghaXNPYmplY3QodGFyZ2V0KSkge1xuICAgIHRocm93IFR5cGVFcnJvcihcInRoaXMgaXMgbm90IGEgb2JqZWN0XCIpO1xuICB9XG5cbiAgY29uc3QgY29uc3RydWN0b3IgPSB0YXJnZXQuY29uc3RydWN0b3I7XG4gIGlmIChjb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRDb25zdHJ1Y3RvcjtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KGNvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IFR5cGVFcnJvcihcImNvbnN0cnVjdG9yIGlzIG5vdCBhIG9iamVjdFwiKTtcbiAgfVxuXG4gIGNvbnN0IHNwZWNpZXMgPSBjb25zdHJ1Y3RvcltTeW1ib2wuc3BlY2llc107XG4gIGlmIChzcGVjaWVzID09IG51bGwpIHtcbiAgICByZXR1cm4gZGVmYXVsdENvbnN0cnVjdG9yO1xuICB9XG5cbiAgcmV0dXJuIHNwZWNpZXM7XG59XG5cbi8qKlxuICogYmlnaW50IGNvbXBhcmlzb25zIGFyZSBub3Qgc3VwcG9ydGVkXG4gKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc29ydFxuICogQHBhcmFtIHtudW1iZXJ9IHhcbiAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gKiBAcmV0dXJucyB7LTEgfCAwIHwgMX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRDb21wYXJlKHgsIHkpIHtcbiAgY29uc3QgaXNOYU5feCA9IE51bWJlci5pc05hTih4KTtcbiAgY29uc3QgaXNOYU5feSA9IE51bWJlci5pc05hTih5KTtcblxuICBpZiAoaXNOYU5feCAmJiBpc05hTl95KSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAoaXNOYU5feCkge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKGlzTmFOX3kpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBpZiAoeCA8IHkpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBpZiAoeCA+IHkpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGlmICh4ID09PSAwICYmIHkgPT09IDApIHtcbiAgICBjb25zdCBpc1BsdXNaZXJvX3ggPSBPYmplY3QuaXMoeCwgMCk7XG4gICAgY29uc3QgaXNQbHVzWmVyb195ID0gT2JqZWN0LmlzKHksIDApO1xuXG4gICAgaWYgKCFpc1BsdXNaZXJvX3ggJiYgaXNQbHVzWmVyb195KSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKGlzUGx1c1plcm9feCAmJiAhaXNQbHVzWmVyb195KSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cbiIsImNvbnN0IGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIEB0eXBlIHsob2JqZWN0OiBvYmplY3QsIGtleTogUHJvcGVydHlLZXkpID0+IGJvb2xlYW59ICovXG5leHBvcnQgY29uc3QgaGFzT3duID0gT2JqZWN0Lmhhc093biB8fCBmdW5jdGlvbiBoYXNPd24ob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpO1xufTtcbiIsImltcG9ydCB7IHdyYXBJbkFycmF5SXRlcmF0b3IgfSBmcm9tIFwiLi9fYXJyYXlJdGVyYXRvci5tanNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX2NvbnZlcnRlci5tanNcIjtcbmltcG9ydCB7IExlbmd0aE9mQXJyYXlMaWtlLCBTcGVjaWVzQ29uc3RydWN0b3IsIFRvSW50ZWdlck9ySW5maW5pdHksIGRlZmF1bHRDb21wYXJlIH0gZnJvbSBcIi4vX3NwZWMubWpzXCI7XG5pbXBvcnQgeyBoYXNPd24gfSBmcm9tIFwiLi9fdXRpbC9oYXNPd24ubWpzXCI7XG5pbXBvcnQgeyBpc0FycmF5QnVmZmVyLCBpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZywgaXNJdGVyYWJsZSwgaXNPYmplY3QsIGlzT2JqZWN0TGlrZSwgaXNPcmRpbmFyeUFycmF5LCBpc09yZGluYXJ5VHlwZWRBcnJheSwgaXNTaGFyZWRBcnJheUJ1ZmZlciwgaXNUeXBlZEFycmF5LCBpc1VpbnQxNkFycmF5IH0gZnJvbSBcIi4vX3V0aWwvaXMubWpzXCI7XG5pbXBvcnQgeyBjcmVhdGVQcml2YXRlU3RvcmFnZSB9IGZyb20gXCIuL191dGlsL3ByaXZhdGUubWpzXCI7XG5cbmNvbnN0IGJyYW5kID0gU3ltYm9sLmZvcihcIl9fRmxvYXQxNkFycmF5X19cIik7XG5cbmNvbnN0IF8gPSBjcmVhdGVQcml2YXRlU3RvcmFnZSgpO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaGFzRmxvYXQxNkFycmF5QnJhbmQodGFyZ2V0KSB7XG4gIGlmICghaXNPYmplY3RMaWtlKHRhcmdldCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBwcm90b3R5cGUgPSBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gIGlmICghaXNPYmplY3RMaWtlKHByb3RvdHlwZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBjb25zdHJ1Y3RvciA9IHByb3RvdHlwZS5jb25zdHJ1Y3RvcjtcbiAgaWYgKGNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCFpc09iamVjdChjb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoXCJjb25zdHJ1Y3RvciBpcyBub3QgYSBvYmplY3RcIik7XG4gIH1cblxuICByZXR1cm4gUmVmbGVjdC5oYXMoY29uc3RydWN0b3IsIGJyYW5kKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgcmV0dXJuIGhhc0Zsb2F0MTZBcnJheUJyYW5kKHRhcmdldCkgJiYgIWlzVHlwZWRBcnJheSh0YXJnZXQpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNGbG9hdDE2Qml0c0FycmF5KHRhcmdldCkge1xuICByZXR1cm4gaGFzRmxvYXQxNkFycmF5QnJhbmQodGFyZ2V0KSAmJiBpc1VpbnQxNkFycmF5KHRhcmdldCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0YXJnZXQpIHtcbiAgaWYgKCFpc0Zsb2F0MTZCaXRzQXJyYXkodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJUaGlzIGlzIG5vdCBhIEZsb2F0MTZBcnJheVwiKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7RmxvYXQxNkFycmF5fSBmbG9hdDE2XG4gKiBAcmV0dXJucyB7QXJyYXlMaWtlPG51bWJlcj59XG4gKi9cbmZ1bmN0aW9uIGdldEZsb2F0MTZCaXRzQXJyYXlGcm9tRmxvYXQxNkFycmF5KGZsb2F0MTYpIHtcbiAgbGV0IHRhcmdldCA9IF8oZmxvYXQxNikudGFyZ2V0O1xuXG4gIC8vIGZyb20gb3RoZXIgcmVhbG1zXG4gIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGNsb25lID0gbmV3IEZsb2F0MTZBcnJheShmbG9hdDE2LmJ1ZmZlciwgZmxvYXQxNi5ieXRlT2Zmc2V0LCBmbG9hdDE2Lmxlbmd0aCk7XG4gICAgdGFyZ2V0ID0gXyhjbG9uZSkudGFyZ2V0O1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0FycmF5TGlrZTxudW1iZXI+fSBmbG9hdDE2Yml0c0FycmF5XG4gKiBAcmV0dXJucyB7bnVtYmVyW119XG4gKi9cbmZ1bmN0aW9uIGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpIHtcbiAgY29uc3QgbGVuZ3RoID0gZmxvYXQxNmJpdHNBcnJheS5sZW5ndGg7XG5cbiAgY29uc3QgYXJyYXkgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGFycmF5W2ldID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNEZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcyh0YXJnZXQpIHtcbiAgcmV0dXJuIHR5cGVvZiB0YXJnZXQgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcy5oYXModGFyZ2V0KTtcbn1cblxuLyoqIEB0eXBlIHtQcm94eUhhbmRsZXI8RnVuY3Rpb24+fSAqL1xuY29uc3QgYXBwbHlIYW5kbGVyID0gT2JqZWN0LmZyZWV6ZSh7XG4gIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgICAvLyBwZWVsIG9mZiBQcm94eVxuICAgIGlmIChpc0Zsb2F0MTZBcnJheSh0aGlzQXJnKSkge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZ2V0RmxvYXQxNkJpdHNBcnJheUZyb21GbG9hdDE2QXJyYXkodGhpc0FyZyk7XG4gICAgICByZXR1cm4gUmVmbGVjdC5hcHBseShmdW5jLCB0YXJnZXQsIGFyZ3MpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0LmFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpO1xuICB9LFxufSk7XG5cbi8qKiBAdHlwZSB7UHJveHlIYW5kbGVyPEZsb2F0MTZBcnJheT59ICovXG5jb25zdCBoYW5kbGVyID0gT2JqZWN0LmZyZWV6ZSh7XG4gIGdldCh0YXJnZXQsIGtleSkge1xuICAgIGlmIChpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyhrZXkpICYmIGhhc093bih0YXJnZXQsIGtleSkpIHtcbiAgICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXkpKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXQgPSBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSk7XG4gICAgaWYgKCFpc0RlZmF1bHRGbG9hdDE2QXJyYXlNZXRob2RzKHJldCkpIHtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLy8gVHlwZWRBcnJheSBtZXRob2RzIGNhbid0IGJlIGNhbGxlZCBieSBQcm94eSBPYmplY3RcbiAgICBsZXQgcHJveHkgPSBfKHJldCkucHJveHk7XG5cbiAgICBpZiAocHJveHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcHJveHkgPSBfKHJldCkucHJveHkgPSBuZXcgUHJveHkocmV0LCBhcHBseUhhbmRsZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm94eTtcbiAgfSxcblxuICBzZXQodGFyZ2V0LCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKGtleSkgJiYgaGFzT3duKHRhcmdldCwga2V5KSkge1xuICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcbiAgfSxcbn0pO1xuXG4vKiogbGltaXRhdGlvbjogc2VlIFJFQURNRS5tZCBmb3IgZGV0YWlscyAqL1xuZXhwb3J0IGNsYXNzIEZsb2F0MTZBcnJheSBleHRlbmRzIFVpbnQxNkFycmF5IHtcblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXR5cGVkYXJyYXkgKi9cbiAgY29uc3RydWN0b3IoaW5wdXQsIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICAgIC8vIGlucHV0IEZsb2F0MTZBcnJheVxuICAgIGlmIChpc0Zsb2F0MTZBcnJheShpbnB1dCkpIHtcbiAgICAgIC8vIHBlZWwgb2ZmIFByb3h5XG4gICAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheUZyb21GbG9hdDE2QXJyYXkoaW5wdXQpO1xuICAgICAgc3VwZXIoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICAvLyBvYmplY3Qgd2l0aG91dCBBcnJheUJ1ZmZlclxuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoaW5wdXQpICYmICFpc0FycmF5QnVmZmVyKGlucHV0KSkge1xuICAgICAgLyoqIEB0eXBlIHtBcnJheUxpa2U8bnVtYmVyPn0gKi9cbiAgICAgIGxldCBsaXN0O1xuICAgICAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG4gICAgICBsZXQgbGVuZ3RoO1xuXG4gICAgICAvLyBUeXBlZEFycmF5XG4gICAgICBpZiAoaXNUeXBlZEFycmF5KGlucHV0KSkge1xuICAgICAgICBsaXN0ID0gaW5wdXQ7XG4gICAgICAgIGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcblxuICAgICAgICBjb25zdCBidWZmZXIgPSBpbnB1dC5idWZmZXI7XG4gICAgICAgIC8qKiBAdHlwZSB7QXJyYXlCdWZmZXJDb25zdHJ1Y3Rvcn0gKi9cbiAgICAgICAgY29uc3QgQnVmZmVyQ29uc3RydWN0b3IgPSAhaXNTaGFyZWRBcnJheUJ1ZmZlcihidWZmZXIpID8gU3BlY2llc0NvbnN0cnVjdG9yKGJ1ZmZlciwgQXJyYXlCdWZmZXIpIDogQXJyYXlCdWZmZXI7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgQnVmZmVyQ29uc3RydWN0b3IobGVuZ3RoICogRmxvYXQxNkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKTtcbiAgICAgICAgc3VwZXIoZGF0YSk7XG5cbiAgICAgIC8vIEl0ZXJhYmxlIChBcnJheSlcbiAgICAgIH0gZWxzZSBpZiAoaXNJdGVyYWJsZShpbnB1dCkpIHtcbiAgICAgICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgICAgICBpZiAoaXNPcmRpbmFyeUFycmF5KGlucHV0KSkge1xuICAgICAgICAgIGxpc3QgPSBpbnB1dDtcbiAgICAgICAgICBsZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gICAgICAgICAgc3VwZXIobGVuZ3RoKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpc3QgPSBbLi4uaW5wdXRdO1xuICAgICAgICAgIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICAgICAgICAgIHN1cGVyKGxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgLy8gQXJyYXlMaWtlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaXN0ID0gaW5wdXQ7XG4gICAgICAgIGxlbmd0aCA9IExlbmd0aE9mQXJyYXlMaWtlKGlucHV0KTtcbiAgICAgICAgc3VwZXIobGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHZhbHVlc1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICAvLyBzdXBlciAoVWludDE2QXJyYXkpXG4gICAgICAgIHRoaXNbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMobGlzdFtpXSk7XG4gICAgICB9XG5cbiAgICAvLyBwcmltaXRpdmUsIEFycmF5QnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgc3VwZXIoaW5wdXQpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzdXBlcihpbnB1dCwgYnl0ZU9mZnNldCk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHN1cGVyKGlucHV0LCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwcm94eSA9IG5ldyBQcm94eSh0aGlzLCBoYW5kbGVyKTtcblxuICAgIC8vIHByb3h5IHByaXZhdGUgc3RvcmFnZVxuICAgIF8ocHJveHkpLnRhcmdldCA9IHRoaXM7XG5cbiAgICAvLyB0aGlzIHByaXZhdGUgc3RvcmFnZVxuICAgIF8odGhpcykucHJveHkgPSBwcm94eTtcblxuICAgIHJldHVybiBwcm94eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiBgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRmxvYXQxNkFycmF5KWAgb3IgYFJlZmxlY3Qub3duS2V5cyhGbG9hdDE2QXJyYXkpYCBpbmNsdWRlIHRoaXMga2V5XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUuZnJvbVxuICAgKi9cbiAgc3RhdGljIGZyb20oc3JjLCAuLi5vcHRzKSB7XG4gICAgY29uc3QgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgaWYgKCFSZWZsZWN0LmhhcyhDb25zdHJ1Y3RvciwgYnJhbmQpKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoXCJUaGlzIGNvbnN0cnVjdG9yIGlzIG5vdCBhIHN1YmNsYXNzIG9mIEZsb2F0MTZBcnJheVwiKTtcbiAgICB9XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGlmIChpc0Zsb2F0MTZBcnJheShzcmMpICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBVaW50MTZBcnJheShzcmMuYnVmZmVyLCBzcmMuYnl0ZU9mZnNldCwgc3JjLmxlbmd0aCk7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KHVpbnQxNi5zbGljZSgpLmJ1ZmZlcik7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShVaW50MTZBcnJheS5mcm9tKHNyYywgcm91bmRUb0Zsb2F0MTZCaXRzKS5idWZmZXIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXBGdW5jID0gb3B0c1swXTtcbiAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzFdO1xuXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShVaW50MTZBcnJheS5mcm9tKHNyYywgZnVuY3Rpb24gKHZhbCwgLi4uYXJncykge1xuICAgICAgICByZXR1cm4gcm91bmRUb0Zsb2F0MTZCaXRzKG1hcEZ1bmMuY2FsbCh0aGlzLCB2YWwsIC4uLmFyZ3MpKTtcbiAgICAgIH0sIHRoaXNBcmcpLmJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqIEB0eXBlIHtBcnJheUxpa2U8bnVtYmVyPn0gKi9cbiAgICBsZXQgbGlzdDtcbiAgICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgICBsZXQgbGVuZ3RoO1xuXG4gICAgLy8gSXRlcmFibGUgKFR5cGVkQXJyYXksIEFycmF5KVxuICAgIGlmIChpc0l0ZXJhYmxlKHNyYykpIHtcbiAgICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICAgIGlmIChpc09yZGluYXJ5QXJyYXkoc3JjKSB8fCBpc09yZGluYXJ5VHlwZWRBcnJheShzcmMpKSB7XG4gICAgICAgIGxpc3QgPSBzcmM7XG4gICAgICAgIGxlbmd0aCA9IHNyYy5sZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaXN0ID0gWy4uLnNyY107XG4gICAgICAgIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgLy8gQXJyYXlMaWtlXG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3QgPSBzcmM7XG4gICAgICBsZW5ndGggPSBMZW5ndGhPZkFycmF5TGlrZShzcmMpO1xuICAgIH1cblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgYXJyYXlbaV0gPSBsaXN0W2ldO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1hcEZ1bmMgPSBvcHRzWzBdO1xuICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMV07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gbWFwRnVuYy5jYWxsKHRoaXNBcmcsIGxpc3RbaV0sIGkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiBgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRmxvYXQxNkFycmF5KWAgb3IgYFJlZmxlY3Qub3duS2V5cyhGbG9hdDE2QXJyYXkpYCBpbmNsdWRlIHRoaXMga2V5XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUub2ZcbiAgICovXG4gIHN0YXRpYyBvZiguLi5pdGVtcykge1xuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gdGhpcztcblxuICAgIGlmICghUmVmbGVjdC5oYXMoQ29uc3RydWN0b3IsIGJyYW5kKSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKFwiVGhpcyBjb25zdHJ1Y3RvciBpcyBub3QgYSBzdWJjbGFzcyBvZiBGbG9hdDE2QXJyYXlcIik7XG4gICAgfVxuXG4gICAgY29uc3QgbGVuZ3RoID0gaXRlbXMubGVuZ3RoO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBwcm94eSA9IG5ldyBGbG9hdDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5RnJvbUZsb2F0MTZBcnJheShwcm94eSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZmxvYXQxNmJpdHNBcnJheVtpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhpdGVtc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm94eTtcbiAgICB9XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgYXJyYXlbaV0gPSBpdGVtc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUua2V5cyAqL1xuICBrZXlzKCkge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gc3VwZXIua2V5cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IHJldHVybnMgYSBvYmplY3Qgd2hvc2UgcHJvdG90eXBlIGlzIG5vdCBgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlYFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS52YWx1ZXNcbiAgICovXG4gIHZhbHVlcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgYXJyYXlJdGVyYXRvciA9IHN1cGVyLnZhbHVlcygpO1xuICAgIHJldHVybiB3cmFwSW5BcnJheUl0ZXJhdG9yKChmdW5jdGlvbiogKCkge1xuICAgICAgZm9yIChjb25zdCB2YWwgb2YgYXJyYXlJdGVyYXRvcikge1xuICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiByZXR1cm5zIGEgb2JqZWN0IHdob3NlIHByb3RvdHlwZSBpcyBub3QgYCVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJWBcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZW50cmllc1xuICAgKi9cbiAgZW50cmllcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgYXJyYXlJdGVyYXRvciA9IHN1cGVyLmVudHJpZXMoKTtcbiAgICByZXR1cm4gd3JhcEluQXJyYXlJdGVyYXRvcigoZnVuY3Rpb24qICgpIHtcbiAgICAgIGZvciAoY29uc3QgW2ksIHZhbF0gb2YgYXJyYXlJdGVyYXRvcikge1xuICAgICAgICB5aWVsZCBbaSwgY29udmVydFRvTnVtYmVyKHZhbCldO1xuICAgICAgfVxuICAgIH0pKCkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmF0ICovXG4gIGF0KGluZGV4KSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICAgIGNvbnN0IHJlbGF0aXZlSW5kZXggPSBUb0ludGVnZXJPckluZmluaXR5KGluZGV4KTtcbiAgICBjb25zdCBrID0gcmVsYXRpdmVJbmRleCA+PSAwID8gcmVsYXRpdmVJbmRleCA6IGxlbmd0aCArIHJlbGF0aXZlSW5kZXg7XG5cbiAgICBpZiAoayA8IDAgfHwgayA+PSBsZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udmVydFRvTnVtYmVyKHRoaXNba10pO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLm1hcCAqL1xuICBtYXAoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsIEZsb2F0MTZBcnJheSk7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IHByb3h5ID0gbmV3IEZsb2F0MTZBcnJheShsZW5ndGgpO1xuICAgICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXlGcm9tRmxvYXQxNkFycmF5KHByb3h5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCB2YWwgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXlbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWwsIGksIF8odGhpcykucHJveHkpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH1cblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCB2YWwgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICBhcnJheVtpXSA9IGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsLCBpLCBfKHRoaXMpLnByb3h5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmlsdGVyICovXG4gIGZpbHRlcihjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGNvbnN0IGtlcHQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBjb25zdCB2YWwgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWwsIGksIF8odGhpcykucHJveHkpKSB7XG4gICAgICAgIGtlcHQucHVzaCh2YWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsIEZsb2F0MTZBcnJheSk7XG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3Ioa2VwdCk7XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUucmVkdWNlICovXG4gIHJlZHVjZShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoXCJSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlXCIpO1xuICAgIH1cblxuICAgIGxldCBhY2N1bXVsYXRvciwgc3RhcnQ7XG4gICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNvbnZlcnRUb051bWJlcih0aGlzWzBdKTtcbiAgICAgIHN0YXJ0ID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWNjdW11bGF0b3IgPSBvcHRzWzBdO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNhbGxiYWNrKGFjY3VtdWxhdG9yLCBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSksIGksIF8odGhpcykucHJveHkpO1xuICAgIH1cblxuICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5yZWR1Y2VyaWdodCAqL1xuICByZWR1Y2VSaWdodChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoXCJSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlXCIpO1xuICAgIH1cblxuICAgIGxldCBhY2N1bXVsYXRvciwgc3RhcnQ7XG4gICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNvbnZlcnRUb051bWJlcih0aGlzW2xlbmd0aCAtIDFdKTtcbiAgICAgIHN0YXJ0ID0gbGVuZ3RoIC0gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgYWNjdW11bGF0b3IgPSBvcHRzWzBdO1xuICAgICAgc3RhcnQgPSBsZW5ndGggLSAxO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soYWNjdW11bGF0b3IsIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSwgaSwgXyh0aGlzKS5wcm94eSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZvcmVhY2ggKi9cbiAgZm9yRWFjaChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KTtcbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZCAqL1xuICBmaW5kKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kaW5kZXggKi9cbiAgZmluZEluZGV4KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLWFycmF5LWZpbmQtZnJvbS1sYXN0L2luZGV4Lmh0bWwjc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZGxhc3QgKi9cbiAgZmluZExhc3QoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9wcm9wb3NhbC1hcnJheS1maW5kLWZyb20tbGFzdC9pbmRleC5odG1sI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbmRsYXN0aW5kZXggKi9cbiAgZmluZExhc3RJbmRleChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcbiAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZXZlcnkgKi9cbiAgZXZlcnkoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBpZiAoIWNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc29tZSAqL1xuICBzb21lKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgaWYgKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc2V0ICovXG4gIHNldChpbnB1dCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCB0YXJnZXRPZmZzZXQgPSBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pO1xuICAgIGlmICh0YXJnZXRPZmZzZXQgPCAwKSB7XG4gICAgICB0aHJvdyBSYW5nZUVycm9yKFwib2Zmc2V0IGlzIG91dCBvZiBib3VuZHNcIik7XG4gICAgfVxuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChpc0Zsb2F0MTZBcnJheShpbnB1dCkpIHtcbiAgICAgIC8vIHBlZWwgb2ZmIFByb3h5XG4gICAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheUZyb21GbG9hdDE2QXJyYXkoaW5wdXQpO1xuICAgICAgc3VwZXIuc2V0KGZsb2F0MTZiaXRzQXJyYXksIHRhcmdldE9mZnNldCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGFyZ2V0TGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgICBjb25zdCBzcmMgPSBPYmplY3QoaW5wdXQpO1xuICAgIGNvbnN0IHNyY0xlbmd0aCA9IExlbmd0aE9mQXJyYXlMaWtlKHNyYyk7XG5cbiAgICBpZiAodGFyZ2V0T2Zmc2V0ID09PSBJbmZpbml0eSB8fCBzcmNMZW5ndGggKyB0YXJnZXRPZmZzZXQgPiB0YXJnZXRMZW5ndGgpIHtcbiAgICAgIHRocm93IFJhbmdlRXJyb3IoXCJvZmZzZXQgaXMgb3V0IG9mIGJvdW5kc1wiKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNyY0xlbmd0aDsgKytpKSB7XG4gICAgICB0aGlzW2kgKyB0YXJnZXRPZmZzZXRdID0gcm91bmRUb0Zsb2F0MTZCaXRzKHNyY1tpXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJldmVyc2UgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgc3VwZXIucmV2ZXJzZSgpO1xuXG4gICAgcmV0dXJuIF8odGhpcykucHJveHk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmlsbCAqL1xuICBmaWxsKHZhbHVlLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIHN1cGVyLmZpbGwocm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSwgLi4ub3B0cyk7XG5cbiAgICByZXR1cm4gXyh0aGlzKS5wcm94eTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5jb3B5d2l0aGluICovXG4gIGNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBzdXBlci5jb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIC4uLm9wdHMpO1xuXG4gICAgcmV0dXJuIF8odGhpcykucHJveHk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc29ydCAqL1xuICBzb3J0KC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgY29tcGFyZSA9IG9wdHNbMF0gIT09IHVuZGVmaW5lZCA/IG9wdHNbMF0gOiBkZWZhdWx0Q29tcGFyZTtcbiAgICBzdXBlci5zb3J0KCh4LCB5KSA9PiB7IHJldHVybiBjb21wYXJlKGNvbnZlcnRUb051bWJlcih4KSwgY29udmVydFRvTnVtYmVyKHkpKTsgfSk7XG5cbiAgICByZXR1cm4gXyh0aGlzKS5wcm94eTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zbGljZSAqL1xuICBzbGljZSguLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsIEZsb2F0MTZBcnJheSk7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBVaW50MTZBcnJheSh0aGlzLmJ1ZmZlciwgdGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmxlbmd0aCk7XG4gICAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gdWludDE2LnNsaWNlKC4uLm9wdHMpO1xuICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoZmxvYXQxNmJpdHNBcnJheS5idWZmZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICAgIGNvbnN0IHN0YXJ0ID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBjb25zdCBlbmQgPSBvcHRzWzFdID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMV0pO1xuXG4gICAgbGV0IGs7XG4gICAgaWYgKHN0YXJ0ID09PSAtSW5maW5pdHkpIHtcbiAgICAgIGsgPSAwO1xuICAgIH0gZWxzZSBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICBrID0gbGVuZ3RoICsgc3RhcnQgPiAwID8gbGVuZ3RoICsgc3RhcnQgOiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBrID0gbGVuZ3RoIDwgc3RhcnQgPyBsZW5ndGggOiBzdGFydDtcbiAgICB9XG5cbiAgICBsZXQgZmluYWw7XG4gICAgaWYgKGVuZCA9PT0gLUluZmluaXR5KSB7XG4gICAgICBmaW5hbCA9IDA7XG4gICAgfSBlbHNlIGlmIChlbmQgPCAwKSB7XG4gICAgICBmaW5hbCA9IGxlbmd0aCArIGVuZCA+IDAgPyBsZW5ndGggKyBlbmQgOiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaW5hbCA9IGxlbmd0aCA8IGVuZCA/IGxlbmd0aCA6IGVuZDtcbiAgICB9XG5cbiAgICBjb25zdCBjb3VudCA9IGZpbmFsIC0gayA+IDAgPyBmaW5hbCAtIGsgOiAwO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGNvdW50KTtcblxuICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cblxuICAgIGxldCBuID0gMDtcbiAgICB3aGlsZSAoayA8IGZpbmFsKSB7XG4gICAgICBhcnJheVtuXSA9IGNvbnZlcnRUb051bWJlcih0aGlzW2tdKTtcbiAgICAgICsraztcbiAgICAgICsrbjtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc3ViYXJyYXkgKi9cbiAgc3ViYXJyYXkoLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCB1aW50MTYgPSBuZXcgVWludDE2QXJyYXkodGhpcy5idWZmZXIsIHRoaXMuYnl0ZU9mZnNldCwgdGhpcy5sZW5ndGgpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSB1aW50MTYuc3ViYXJyYXkoLi4ub3B0cyk7XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCBGbG9hdDE2QXJyYXkpO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXkuYnVmZmVyLCBmbG9hdDE2Yml0c0FycmF5LmJ5dGVPZmZzZXQsIGZsb2F0MTZiaXRzQXJyYXkubGVuZ3RoKTtcblxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5pbmRleG9mICovXG4gIGluZGV4T2YoZWxlbWVudCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAoZnJvbSA9PT0gSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBmcm9tLCBsID0gbGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBpZiAoaGFzT3duKHRoaXMsIGkpICYmIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUubGFzdGluZGV4b2YgKi9cbiAgbGFzdEluZGV4T2YoZWxlbWVudCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgIGxldCBmcm9tID0gb3B0cy5sZW5ndGggPj0gMSA/IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSkgOiBsZW5ndGggLSAxO1xuICAgIGlmIChmcm9tID09PSAtSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA+PSAwKSB7XG4gICAgICBmcm9tID0gZnJvbSA8IGxlbmd0aCAtIDEgPyBmcm9tIDogbGVuZ3RoIC0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPj0gMDsgLS1pKSB7XG4gICAgICBpZiAoaGFzT3duKHRoaXMsIGkpICYmIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuaW5jbHVkZXMgKi9cbiAgaW5jbHVkZXMoZWxlbWVudCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAoZnJvbSA9PT0gSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGlzTmFOID0gTnVtYmVyLmlzTmFOKGVsZW1lbnQpO1xuICAgIGZvciAobGV0IGkgPSBmcm9tLCBsID0gbGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcblxuICAgICAgaWYgKGlzTmFOICYmIE51bWJlci5pc05hTih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuam9pbiAqL1xuICBqb2luKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgYXJyYXkgPSBjb3B5VG9BcnJheSh0aGlzKTtcblxuICAgIHJldHVybiBhcnJheS5qb2luKC4uLm9wdHMpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnRvbG9jYWxlc3RyaW5nICovXG4gIHRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgYXJyYXkgPSBjb3B5VG9BcnJheSh0aGlzKTtcblxuICAgIHJldHVybiBhcnJheS50b0xvY2FsZVN0cmluZyguLi5vcHRzKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtZ2V0LSV0eXBlZGFycmF5JS5wcm90b3R5cGUtQEB0b3N0cmluZ3RhZyAqL1xuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG4gICAgaWYgKGlzRmxvYXQxNkJpdHNBcnJheSh0aGlzKSkge1xuICAgICAgcmV0dXJuIFwiRmxvYXQxNkFycmF5XCI7XG4gICAgfVxuICB9XG59XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdHlwZWRhcnJheS5ieXRlc19wZXJfZWxlbWVudCAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheSwgXCJCWVRFU19QRVJfRUxFTUVOVFwiLCB7IHZhbHVlOiBVaW50MTZBcnJheS5CWVRFU19QRVJfRUxFTUVOVCB9KTtcblxuLyoqIGxpbWl0YXRpb246IEl0IGlzIHBlYWtlZCBieSBgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhGbG9hdDE2QXJyYXkpYCBhbmQgYFJlZmxlY3Qub3duS2V5cyhGbG9hdDE2QXJyYXkpYCAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheSwgYnJhbmQsIHt9KTtcblxuY29uc3QgRmxvYXQxNkFycmF5UHJvdG90eXBlID0gRmxvYXQxNkFycmF5LnByb3RvdHlwZTtcblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLUBAaXRlcmF0b3IgKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXlQcm90b3R5cGUsIFN5bWJvbC5pdGVyYXRvciwge1xuICB2YWx1ZTogRmxvYXQxNkFycmF5UHJvdG90eXBlLnZhbHVlcyxcbiAgd3JpdGFibGU6IHRydWUsXG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbn0pO1xuXG5jb25zdCBkZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcyA9IG5ldyBXZWFrU2V0KCk7XG5mb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5UHJvdG90eXBlKSkge1xuICAvLyBjb25zdHJ1Y3RvciBpcyBub3QgY2FsbGFibGVcbiAgaWYgKGtleSA9PT0gXCJjb25zdHJ1Y3RvclwiKSB7XG4gICAgY29udGludWU7XG4gIH1cblxuICBjb25zdCB2YWwgPSBGbG9hdDE2QXJyYXlQcm90b3R5cGVba2V5XTtcbiAgaWYgKHR5cGVvZiB2YWwgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGRlZmF1bHRGbG9hdDE2QXJyYXlNZXRob2RzLmFkZCh2YWwpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBjb252ZXJ0VG9OdW1iZXIsIHJvdW5kVG9GbG9hdDE2Qml0cyB9IGZyb20gXCIuL19jb252ZXJ0ZXIubWpzXCI7XG5pbXBvcnQgeyBpc0RhdGFWaWV3IH0gZnJvbSBcIi4vX3V0aWwvaXMubWpzXCI7XG5cbi8qKlxuICogcmV0dXJucyBhbiB1bnNpZ25lZCAxNi1iaXQgZmxvYXQgYXQgdGhlIHNwZWNpZmllZCBieXRlIG9mZnNldCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgRGF0YVZpZXcuXG4gKlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge1tib29sZWFuXX0gb3B0c1xuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZsb2F0MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIC4uLm9wdHMpIHtcbiAgaWYgKCFpc0RhdGFWaWV3KGRhdGFWaWV3KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGaXJzdCBhcmd1bWVudCB0byBnZXRGbG9hdDE2IGZ1bmN0aW9uIG11c3QgYmUgYSBEYXRhVmlld1wiKTtcbiAgfVxuXG4gIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoIGRhdGFWaWV3LmdldFVpbnQxNihieXRlT2Zmc2V0LCAuLi5vcHRzKSApO1xufVxuXG4vKipcbiAqIHN0b3JlcyBhbiB1bnNpZ25lZCAxNi1iaXQgZmxvYXQgdmFsdWUgYXQgdGhlIHNwZWNpZmllZCBieXRlIG9mZnNldCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgRGF0YVZpZXcuXG4gKlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCB2YWx1ZSwgLi4ub3B0cykge1xuICBpZiAoIWlzRGF0YVZpZXcoZGF0YVZpZXcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZpcnN0IGFyZ3VtZW50IHRvIHNldEZsb2F0MTYgZnVuY3Rpb24gbXVzdCBiZSBhIERhdGFWaWV3XCIpO1xuICB9XG5cbiAgZGF0YVZpZXcuc2V0VWludDE2KGJ5dGVPZmZzZXQsIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSksIC4uLm9wdHMpO1xufVxuIl0sIm5hbWVzIjpbIl8iXSwibWFwcGluZ3MiOiI7Ozs7O0VBQUE7QUFDQTtFQUNBLE1BQU0sTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2xDLE1BQU0sU0FBUyxHQUFHLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzNDLE1BQU0sVUFBVSxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDO0VBQ0EsTUFBTSxTQUFTLEdBQUcsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDdkMsTUFBTSxVQUFVLEdBQUcsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEM7RUFDQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQzlCLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNwQjtFQUNBO0VBQ0EsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRTtFQUNmLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLE1BQU0sQ0FBQztFQUNsQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDO0VBQ2xDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztFQUMvQixJQUFJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQy9CO0VBQ0E7RUFDQSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUU7RUFDdEIsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksTUFBTSxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0VBQ2hELElBQUksU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxNQUFNLENBQUM7RUFDMUQsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ25DLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkM7RUFDQTtFQUNBLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUU7RUFDdEIsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQztFQUMzQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLE1BQU0sQ0FBQztFQUNyRCxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7RUFDL0IsSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMvQjtFQUNBO0VBQ0EsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRTtFQUN0QixJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsV0FBVyxNQUFNLENBQUM7RUFDbEMsSUFBSSxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQztFQUNsQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7RUFDL0IsSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMvQjtFQUNBO0VBQ0EsR0FBRyxNQUFNO0VBQ1QsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLFdBQVcsTUFBTSxDQUFDO0VBQ2xDLElBQUksU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7RUFDbEMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0VBQy9CLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7RUFDL0IsR0FBRztFQUNILENBQUM7QUFDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsa0JBQWtCLENBQUMsR0FBRyxFQUFFO0VBQ3hDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztFQUNyQixFQUFFLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMxQixFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxLQUFLLENBQUM7RUFDOUIsRUFBRSxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDNUQsQ0FBQztBQUNEO0VBQ0EsTUFBTSxhQUFhLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDNUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDMUMsTUFBTSxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEM7RUFDQSxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDL0IsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0VBQ2xCLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1o7RUFDQTtFQUNBLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLE1BQU0sQ0FBQyxFQUFFO0VBQ2hDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQztFQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDWixHQUFHO0FBQ0g7RUFDQSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztFQUNuQixFQUFFLENBQUMsSUFBSSxVQUFVLENBQUM7QUFDbEI7RUFDQSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzNCLENBQUM7RUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ2xDLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7RUFDckQsQ0FBQztBQUNEO0VBQ0EsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNyQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQzdCLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7RUFDN0IsQ0FBQztFQUNELGFBQWEsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUM7RUFDL0IsYUFBYSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztFQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQzlCLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7RUFDbkQsQ0FBQztFQUNELGFBQWEsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUM7QUFDL0I7RUFDQSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ25CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDN0IsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUU7RUFDaEIsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3ZCLEdBQUcsTUFBTTtFQUNULElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztFQUMxQixHQUFHO0VBQ0gsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ08sU0FBUyxlQUFlLENBQUMsV0FBVyxFQUFFO0VBQzdDLEVBQUUsTUFBTSxDQUFDLEdBQUcsV0FBVyxJQUFJLEVBQUUsQ0FBQztFQUM5QixFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMzRixFQUFFLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3RCOztFQ2xIQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7RUFDN0IsRUFBRSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtFQUMvQixJQUFJLE1BQU0sU0FBUyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7RUFDakUsR0FBRztBQUNIO0VBQ0EsRUFBRSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCO0VBQ0E7RUFDQSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7RUFDMUMsSUFBSSxPQUFPLEdBQUcsQ0FBQztFQUNmLEdBQUc7QUFDSDtFQUNBLEVBQUUsTUFBTSxHQUFHLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDdEMsRUFBRSxPQUFPLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUM5Qjs7RUN0QkE7RUFDTyxTQUFTLG9CQUFvQixHQUFHO0VBQ3ZDLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztFQUMzQixFQUFFLE9BQU8sQ0FBQyxJQUFJLEtBQUs7RUFDbkIsSUFBSSxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ2pDLElBQUksSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO0VBQy9CLE1BQU0sT0FBTyxPQUFPLENBQUM7RUFDckIsS0FBSztBQUNMO0VBQ0EsSUFBSSxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3BDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDdEIsSUFBSSxPQUFPLEdBQUcsQ0FBQztFQUNmLEdBQUcsQ0FBQztFQUNKOztFQ1hBLE1BQU1BLEdBQUMsR0FBRyxvQkFBb0IsRUFBRSxDQUFDO0FBQ2pDO0VBQ0EsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoRztFQUNBO0VBQ0EsTUFBTSxzQkFBc0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFO0VBQ2hFLEVBQUUsSUFBSSxFQUFFO0VBQ1IsSUFBSSxLQUFLLEVBQUUsU0FBUyxJQUFJLEdBQUc7RUFDM0IsTUFBTSxPQUFPQSxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0VBQ3JDLEtBQUs7RUFDTCxJQUFJLFFBQVEsRUFBRSxJQUFJO0VBQ2xCLElBQUksWUFBWSxFQUFFLElBQUk7RUFDdEIsR0FBRztBQUNIO0VBQ0EsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUc7RUFDeEIsSUFBSSxLQUFLLEVBQUUsZ0JBQWdCO0VBQzNCLElBQUksWUFBWSxFQUFFLElBQUk7RUFDdEIsR0FBRztFQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0g7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsbUJBQW1CLENBQUMsUUFBUSxFQUFFO0VBQzlDLEVBQUUsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0VBQzlELEVBQUVBLEdBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0VBQ3ZDLEVBQUUsT0FBTyxhQUFhLENBQUM7RUFDdkI7O0VDOUJBO0VBQ0E7RUFDQTtFQUNBO0VBQ08sU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFO0VBQ2hDLEVBQUUsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxLQUFLLE9BQU8sS0FBSyxLQUFLLFVBQVUsQ0FBQztFQUN0RixDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsWUFBWSxDQUFDLEtBQUssRUFBRTtFQUNwQyxFQUFFLE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7RUFDckQsQ0FBQztBQUNEO0VBQ0E7RUFDQSxNQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDO0VBQ3pFLE1BQU0sc0NBQXNDLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLG1CQUFtQixFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDN0g7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsWUFBWSxDQUFDLEtBQUssRUFBRTtFQUNwQyxFQUFFLE9BQU8sc0NBQXNDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLFNBQVMsQ0FBQztFQUMxRSxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsYUFBYSxDQUFDLEtBQUssRUFBRTtFQUNyQyxFQUFFLE9BQU8sc0NBQXNDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLGFBQWEsQ0FBQztFQUM5RSxDQUFDO0FBQ0Q7RUFDQSxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztBQUMzQztFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ08sU0FBUyxVQUFVLENBQUMsS0FBSyxFQUFFO0VBQ2xDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDbEMsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQSxFQUFFLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQzNCLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztBQUNIO0VBQ0EsRUFBRSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssbUJBQW1CLEVBQUU7RUFDcEQsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQSxFQUFFLE9BQU8sSUFBSSxDQUFDO0VBQ2QsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUU7RUFDckMsRUFBRSxPQUFPLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLHNCQUFzQixDQUFDO0VBQ2hGLENBQUM7QUFDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ08sU0FBUyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUU7RUFDM0MsRUFBRSxPQUFPLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLDRCQUE0QixDQUFDO0VBQ3RGLENBQUM7QUFDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ08sU0FBUyxVQUFVLENBQUMsS0FBSyxFQUFFO0VBQ2xDLEVBQUUsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFVBQVUsQ0FBQztFQUN6RSxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsZUFBZSxDQUFDLEtBQUssRUFBRTtFQUN2QyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQzdCLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztBQUNIO0VBQ0EsRUFBRSxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7RUFDNUMsRUFBRSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUsseUJBQXlCLEVBQUU7RUFDN0QsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQSxFQUFFLE9BQU8sSUFBSSxDQUFDO0VBQ2QsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLG9CQUFvQixDQUFDLEtBQUssRUFBRTtFQUM1QyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDNUIsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQSxFQUFFLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztFQUM1QyxFQUFFLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyx5QkFBeUIsRUFBRTtFQUM3RCxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7QUFDSDtFQUNBLEVBQUUsT0FBTyxJQUFJLENBQUM7RUFDZCxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsNkJBQTZCLENBQUMsS0FBSyxFQUFFO0VBQ3JELEVBQUUsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7RUFDakMsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQSxFQUFFLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUMvQixFQUFFLElBQUksS0FBSyxLQUFLLE1BQU0sR0FBRyxFQUFFLEVBQUU7RUFDN0IsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQ2hDLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztBQUNIO0VBQ0EsRUFBRSxJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQ3JDLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQztFQUNkOztFQ3pJQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ08sU0FBUyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUU7RUFDNUMsRUFBRSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtFQUNsQyxJQUFJLE1BQU0sU0FBUyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7RUFDakUsR0FBRztBQUNIO0VBQ0EsRUFBRSxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEM7RUFDQSxFQUFFLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO0VBQzVDLElBQUksT0FBTyxDQUFDLENBQUM7RUFDYixHQUFHO0FBQ0g7RUFDQSxFQUFFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUM1QixDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBUyxRQUFRLENBQUMsTUFBTSxFQUFFO0VBQzFCLEVBQUUsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDN0MsRUFBRSxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUU7RUFDbEIsSUFBSSxPQUFPLENBQUMsQ0FBQztFQUNiLEdBQUc7QUFDSDtFQUNBLEVBQUUsT0FBTyxNQUFNLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7RUFDN0UsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsaUJBQWlCLENBQUMsU0FBUyxFQUFFO0VBQzdDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtFQUM1QixJQUFJLE1BQU0sU0FBUyxDQUFDLHNCQUFzQixDQUFDLENBQUM7RUFDNUMsR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDcEMsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ08sU0FBUyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLEVBQUU7RUFDL0QsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQ3pCLElBQUksTUFBTSxTQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQztFQUM1QyxHQUFHO0FBQ0g7RUFDQSxFQUFFLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7RUFDekMsRUFBRSxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7RUFDakMsSUFBSSxPQUFPLGtCQUFrQixDQUFDO0VBQzlCLEdBQUc7RUFDSCxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7RUFDOUIsSUFBSSxNQUFNLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0VBQ25ELEdBQUc7QUFDSDtFQUNBLEVBQUUsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUM5QyxFQUFFLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtFQUN2QixJQUFJLE9BQU8sa0JBQWtCLENBQUM7RUFDOUIsR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLE9BQU8sQ0FBQztFQUNqQixDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ08sU0FBUyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtFQUNyQyxFQUFFLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDbEMsRUFBRSxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xDO0VBQ0EsRUFBRSxJQUFJLE9BQU8sSUFBSSxPQUFPLEVBQUU7RUFDMUIsSUFBSSxPQUFPLENBQUMsQ0FBQztFQUNiLEdBQUc7QUFDSDtFQUNBLEVBQUUsSUFBSSxPQUFPLEVBQUU7RUFDZixJQUFJLE9BQU8sQ0FBQyxDQUFDO0VBQ2IsR0FBRztBQUNIO0VBQ0EsRUFBRSxJQUFJLE9BQU8sRUFBRTtFQUNmLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztFQUNkLEdBQUc7QUFDSDtFQUNBLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0VBQ2IsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQ2QsR0FBRztBQUNIO0VBQ0EsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7RUFDYixJQUFJLE9BQU8sQ0FBQyxDQUFDO0VBQ2IsR0FBRztBQUNIO0VBQ0EsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUMxQixJQUFJLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQ3pDLElBQUksTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekM7RUFDQSxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksWUFBWSxFQUFFO0VBQ3ZDLE1BQU0sT0FBTyxDQUFDLENBQUMsQ0FBQztFQUNoQixLQUFLO0FBQ0w7RUFDQSxJQUFJLElBQUksWUFBWSxJQUFJLENBQUMsWUFBWSxFQUFFO0VBQ3ZDLE1BQU0sT0FBTyxDQUFDLENBQUM7RUFDZixLQUFLO0VBQ0wsR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLENBQUMsQ0FBQztFQUNYOztFQ3pIQSxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztBQUN2RDtFQUNBO0VBQ08sTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxTQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0VBQ3BFLEVBQUUsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztFQUMxQyxDQUFDOztFQ0VELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM3QztFQUNBLE1BQU0sQ0FBQyxHQUFHLG9CQUFvQixFQUFFLENBQUM7QUFDakM7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVMsb0JBQW9CLENBQUMsTUFBTSxFQUFFO0VBQ3RDLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTtFQUM3QixJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7QUFDSDtFQUNBLEVBQUUsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNuRCxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEVBQUU7RUFDaEMsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQSxFQUFFLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUM7RUFDNUMsRUFBRSxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7RUFDakMsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0VBQ0gsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0VBQzlCLElBQUksTUFBTSxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQztFQUNuRCxHQUFHO0FBQ0g7RUFDQSxFQUFFLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7RUFDekMsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLGNBQWMsQ0FBQyxNQUFNLEVBQUU7RUFDdkMsRUFBRSxPQUFPLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQy9ELENBQUM7QUFDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBUyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUU7RUFDcEMsRUFBRSxPQUFPLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUMvRCxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVMsc0JBQXNCLENBQUMsTUFBTSxFQUFFO0VBQ3hDLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQ25DLElBQUksTUFBTSxJQUFJLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0VBQ3RELEdBQUc7RUFDSCxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVMsbUNBQW1DLENBQUMsT0FBTyxFQUFFO0VBQ3RELEVBQUUsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNqQztFQUNBO0VBQ0EsRUFBRSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7RUFDNUIsSUFBSSxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3ZGLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDN0IsR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLE1BQU0sQ0FBQztFQUNoQixDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVMsV0FBVyxDQUFDLGdCQUFnQixFQUFFO0VBQ3ZDLEVBQUUsTUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDO0FBQ3pDO0VBQ0EsRUFBRSxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7RUFDbkIsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ25DLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3BELEdBQUc7QUFDSDtFQUNBLEVBQUUsT0FBTyxLQUFLLENBQUM7RUFDZixDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVMsNEJBQTRCLENBQUMsTUFBTSxFQUFFO0VBQzlDLEVBQUUsT0FBTyxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksMEJBQTBCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ2hGLENBQUM7QUFDRDtFQUNBO0VBQ0EsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztFQUNuQyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtFQUM3QjtFQUNBLElBQUksSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7RUFDakMsTUFBTSxNQUFNLE1BQU0sR0FBRyxtQ0FBbUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUNsRSxNQUFNLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQy9DLEtBQUs7QUFDTDtFQUNBLElBQUksT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDOUMsR0FBRztFQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0g7RUFDQTtFQUNBLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7RUFDOUIsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtFQUNuQixJQUFJLElBQUksNkJBQTZCLENBQUMsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtFQUNuRSxNQUFNLE9BQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDdkQsS0FBSztBQUNMO0VBQ0EsSUFBSSxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztFQUN6QyxJQUFJLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxHQUFHLENBQUMsRUFBRTtFQUM1QyxNQUFNLE9BQU8sR0FBRyxDQUFDO0VBQ2pCLEtBQUs7QUFDTDtFQUNBO0VBQ0EsSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQzdCO0VBQ0EsSUFBSSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7RUFDN0IsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7RUFDMUQsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtFQUMxQixJQUFJLElBQUksNkJBQTZCLENBQUMsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtFQUNuRSxNQUFNLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDakUsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztFQUMzQyxHQUFHO0VBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDSDtFQUNBO0VBQ08sTUFBTSxZQUFZLFNBQVMsV0FBVyxDQUFDO0FBQzlDO0VBQ0E7RUFDQSxFQUFFLFdBQVcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTtFQUN6QztFQUNBLElBQUksSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDL0I7RUFDQSxNQUFNLE1BQU0sZ0JBQWdCLEdBQUcsbUNBQW1DLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDMUUsTUFBTSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QjtFQUNBO0VBQ0EsS0FBSyxNQUFNLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQ3pEO0VBQ0EsTUFBTSxJQUFJLElBQUksQ0FBQztFQUNmO0VBQ0EsTUFBTSxJQUFJLE1BQU0sQ0FBQztBQUNqQjtFQUNBO0VBQ0EsTUFBTSxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUMvQixRQUFRLElBQUksR0FBRyxLQUFLLENBQUM7RUFDckIsUUFBUSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUM5QjtFQUNBLFFBQVEsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztFQUNwQztFQUNBLFFBQVEsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxHQUFHLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsR0FBRyxXQUFXLENBQUM7RUFDdkgsUUFBUSxNQUFNLElBQUksR0FBRyxJQUFJLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztFQUNwRixRQUFRLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQjtFQUNBO0VBQ0EsT0FBTyxNQUFNLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQ3BDO0VBQ0EsUUFBUSxJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUNwQyxVQUFVLElBQUksR0FBRyxLQUFLLENBQUM7RUFDdkIsVUFBVSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztFQUNoQyxVQUFVLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4QjtFQUNBLFNBQVMsTUFBTTtFQUNmLFVBQVUsSUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztFQUM1QixVQUFVLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0VBQy9CLFVBQVUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3hCLFNBQVM7QUFDVDtFQUNBO0VBQ0EsT0FBTyxNQUFNO0VBQ2IsUUFBUSxJQUFJLEdBQUcsS0FBSyxDQUFDO0VBQ3JCLFFBQVEsTUFBTSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzFDLFFBQVEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3RCLE9BQU87QUFDUDtFQUNBO0VBQ0EsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3ZDO0VBQ0EsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDOUMsT0FBTztBQUNQO0VBQ0E7RUFDQSxLQUFLLE1BQU07RUFDWCxNQUFNLFFBQVEsU0FBUyxDQUFDLE1BQU07RUFDOUIsUUFBUSxLQUFLLENBQUM7RUFDZCxVQUFVLEtBQUssRUFBRSxDQUFDO0VBQ2xCLFVBQVUsTUFBTTtBQUNoQjtFQUNBLFFBQVEsS0FBSyxDQUFDO0VBQ2QsVUFBVSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDdkIsVUFBVSxNQUFNO0FBQ2hCO0VBQ0EsUUFBUSxLQUFLLENBQUM7RUFDZCxVQUFVLEtBQUssQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7RUFDbkMsVUFBVSxNQUFNO0FBQ2hCO0VBQ0EsUUFBUSxLQUFLLENBQUM7RUFDZCxVQUFVLEtBQUssQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0VBQzNDLFVBQVUsTUFBTTtBQUNoQjtFQUNBLFFBQVE7RUFDUixVQUFVLEtBQUssQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0VBQzlCLE9BQU87RUFDUCxLQUFLO0FBQ0w7RUFDQSxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMzQztFQUNBO0VBQ0EsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUMzQjtFQUNBO0VBQ0EsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUMxQjtFQUNBLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztBQUNIO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQzVCLElBQUksTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQzdCO0VBQ0EsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLEVBQUU7RUFDMUMsTUFBTSxNQUFNLFNBQVMsQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO0VBQzVFLEtBQUs7QUFDTDtFQUNBO0VBQ0EsSUFBSSxJQUFJLFdBQVcsS0FBSyxZQUFZLEVBQUU7RUFDdEMsTUFBTSxJQUFJLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtFQUNwRCxRQUFRLE1BQU0sTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDL0UsUUFBUSxPQUFPLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUN2RCxPQUFPO0FBQ1A7RUFDQSxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7RUFDN0IsUUFBUSxPQUFPLElBQUksWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLGtCQUFrQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDbEYsT0FBTztBQUNQO0VBQ0EsTUFBTSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDOUIsTUFBTSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUI7RUFDQSxNQUFNLE9BQU8sSUFBSSxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDNUUsUUFBUSxPQUFPLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDcEUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzFCLEtBQUs7QUFDTDtFQUNBO0VBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQztFQUNiO0VBQ0EsSUFBSSxJQUFJLE1BQU0sQ0FBQztBQUNmO0VBQ0E7RUFDQSxJQUFJLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0VBQ3pCO0VBQ0EsTUFBTSxJQUFJLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsRUFBRTtFQUM3RCxRQUFRLElBQUksR0FBRyxHQUFHLENBQUM7RUFDbkIsUUFBUSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztFQUM1QixPQUFPLE1BQU07RUFDYixRQUFRLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7RUFDeEIsUUFBUSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztFQUM3QixPQUFPO0FBQ1A7RUFDQTtFQUNBLEtBQUssTUFBTTtFQUNYLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQztFQUNqQixNQUFNLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUN0QyxLQUFLO0FBQ0w7RUFDQSxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFDO0VBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0VBQzNCLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUN2QyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDM0IsT0FBTztBQUNQO0VBQ0EsS0FBSyxNQUFNO0VBQ1gsTUFBTSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDOUIsTUFBTSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDOUIsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3ZDLFFBQVEsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUNyRCxPQUFPO0VBQ1AsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRTtFQUN0QixJQUFJLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQztBQUM3QjtFQUNBLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxFQUFFO0VBQzFDLE1BQU0sTUFBTSxTQUFTLENBQUMsb0RBQW9ELENBQUMsQ0FBQztFQUM1RSxLQUFLO0FBQ0w7RUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDaEM7RUFDQTtFQUNBLElBQUksSUFBSSxXQUFXLEtBQUssWUFBWSxFQUFFO0VBQ3RDLE1BQU0sTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDN0MsTUFBTSxNQUFNLGdCQUFnQixHQUFHLG1DQUFtQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFFO0VBQ0EsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3ZDLFFBQVEsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDM0QsT0FBTztBQUNQO0VBQ0EsTUFBTSxPQUFPLEtBQUssQ0FBQztFQUNuQixLQUFLO0FBQ0w7RUFDQSxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFDO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3JDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMxQixLQUFLO0FBQ0w7RUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxJQUFJLEdBQUc7RUFDVCxJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDO0VBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztFQUN4QixHQUFHO0FBQ0g7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxNQUFNLEdBQUc7RUFDWCxJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDO0VBQ0EsSUFBSSxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7RUFDekMsSUFBSSxPQUFPLG1CQUFtQixDQUFDLENBQUMsYUFBYTtFQUM3QyxNQUFNLEtBQUssTUFBTSxHQUFHLElBQUksYUFBYSxFQUFFO0VBQ3ZDLFFBQVEsTUFBTSxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDbkMsT0FBTztFQUNQLEtBQUssR0FBRyxDQUFDLENBQUM7RUFDVixHQUFHO0FBQ0g7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxPQUFPLEdBQUc7RUFDWixJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDO0VBQ0EsSUFBSSxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7RUFDMUMsSUFBSSxPQUFPLG1CQUFtQixDQUFDLENBQUMsYUFBYTtFQUM3QyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxhQUFhLEVBQUU7RUFDNUMsUUFBUSxNQUFNLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQ3hDLE9BQU87RUFDUCxLQUFLLEdBQUcsQ0FBQyxDQUFDO0VBQ1YsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUU7RUFDWixJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDO0VBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0VBQy9CLElBQUksTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDckQsSUFBSSxNQUFNLENBQUMsR0FBRyxhQUFhLElBQUksQ0FBQyxHQUFHLGFBQWEsR0FBRyxNQUFNLEdBQUcsYUFBYSxDQUFDO0FBQzFFO0VBQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sRUFBRTtFQUM5QixNQUFNLE9BQU87RUFDYixLQUFLO0FBQ0w7RUFDQSxJQUFJLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3BDLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQ3pCLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakM7RUFDQSxJQUFJLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QjtFQUNBLElBQUksTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMvQjtFQUNBLElBQUksTUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQy9EO0VBQ0E7RUFDQSxJQUFJLElBQUksV0FBVyxLQUFLLFlBQVksRUFBRTtFQUN0QyxNQUFNLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzdDLE1BQU0sTUFBTSxnQkFBZ0IsR0FBRyxtQ0FBbUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxRTtFQUNBLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUN2QyxRQUFRLE1BQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM3QyxRQUFRLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDaEcsT0FBTztBQUNQO0VBQ0EsTUFBTSxPQUFPLEtBQUssQ0FBQztFQUNuQixLQUFLO0FBQ0w7RUFDQSxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFDO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3JDLE1BQU0sTUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzNDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQy9ELEtBQUs7QUFDTDtFQUNBLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDNUIsSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQztFQUNBLElBQUksTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVCO0VBQ0EsSUFBSSxNQUFNLElBQUksR0FBRyxFQUFFLENBQUM7RUFDcEIsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ2pELE1BQU0sTUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzNDLE1BQU0sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUN6RCxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDdkIsT0FBTztFQUNQLEtBQUs7QUFDTDtFQUNBLElBQUksTUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0VBQy9ELElBQUksTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEM7RUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQzVCLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakM7RUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7RUFDL0IsSUFBSSxJQUFJLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7RUFDM0MsTUFBTSxNQUFNLFNBQVMsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0VBQ3JFLEtBQUs7QUFDTDtFQUNBLElBQUksSUFBSSxXQUFXLEVBQUUsS0FBSyxDQUFDO0VBQzNCLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtFQUMzQixNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDN0MsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0VBQ2hCLEtBQUssTUFBTTtFQUNYLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM1QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7RUFDaEIsS0FBSztBQUNMO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3pDLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDdEYsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLFdBQVcsQ0FBQztFQUN2QixHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksRUFBRTtFQUNqQyxJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDO0VBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0VBQy9CLElBQUksSUFBSSxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0VBQzNDLE1BQU0sTUFBTSxTQUFTLENBQUMsNkNBQTZDLENBQUMsQ0FBQztFQUNyRSxLQUFLO0FBQ0w7RUFDQSxJQUFJLElBQUksV0FBVyxFQUFFLEtBQUssQ0FBQztFQUMzQixJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7RUFDM0IsTUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN0RCxNQUFNLEtBQUssR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQ3pCLEtBQUssTUFBTTtFQUNYLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM1QixNQUFNLEtBQUssR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQ3pCLEtBQUs7QUFDTDtFQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtFQUNyQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ3RGLEtBQUs7QUFDTDtFQUNBLElBQUksT0FBTyxXQUFXLENBQUM7RUFDdkIsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDN0IsSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQztFQUNBLElBQUksTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVCO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ2pELE1BQU0sUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDekUsS0FBSztFQUNMLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQzFCLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakM7RUFDQSxJQUFJLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QjtFQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtFQUNqRCxNQUFNLE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM3QyxNQUFNLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDM0QsUUFBUSxPQUFPLEtBQUssQ0FBQztFQUNyQixPQUFPO0VBQ1AsS0FBSztFQUNMLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxTQUFTLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQy9CLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakM7RUFDQSxJQUFJLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QjtFQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtFQUNqRCxNQUFNLE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM3QyxNQUFNLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDM0QsUUFBUSxPQUFPLENBQUMsQ0FBQztFQUNqQixPQUFPO0VBQ1AsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQ2QsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDOUIsSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQztFQUNBLElBQUksTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVCO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDL0MsTUFBTSxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDN0MsTUFBTSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQzNELFFBQVEsT0FBTyxLQUFLLENBQUM7RUFDckIsT0FBTztFQUNQLEtBQUs7RUFDTCxHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsYUFBYSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksRUFBRTtFQUNuQyxJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDO0VBQ0EsSUFBSSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUI7RUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtFQUMvQyxNQUFNLE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM3QyxNQUFNLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDM0QsUUFBUSxPQUFPLENBQUMsQ0FBQztFQUNqQixPQUFPO0VBQ1AsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQ2QsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDM0IsSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQztFQUNBLElBQUksTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVCO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ2pELE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQy9FLFFBQVEsT0FBTyxLQUFLLENBQUM7RUFDckIsT0FBTztFQUNQLEtBQUs7QUFDTDtFQUNBLElBQUksT0FBTyxJQUFJLENBQUM7RUFDaEIsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDMUIsSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQztFQUNBLElBQUksTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVCO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ2pELE1BQU0sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUM5RSxRQUFRLE9BQU8sSUFBSSxDQUFDO0VBQ3BCLE9BQU87RUFDUCxLQUFLO0FBQ0w7RUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQ3RCLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakM7RUFDQSxJQUFJLE1BQU0sWUFBWSxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3RELElBQUksSUFBSSxZQUFZLEdBQUcsQ0FBQyxFQUFFO0VBQzFCLE1BQU0sTUFBTSxVQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQztFQUNsRCxLQUFLO0FBQ0w7RUFDQTtFQUNBLElBQUksSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDL0I7RUFDQSxNQUFNLE1BQU0sZ0JBQWdCLEdBQUcsbUNBQW1DLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDMUUsTUFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxDQUFDO0VBQ2hELE1BQU0sT0FBTztFQUNiLEtBQUs7QUFDTDtFQUNBLElBQUksTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNyQztFQUNBLElBQUksTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzlCLElBQUksTUFBTSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0M7RUFDQSxJQUFJLElBQUksWUFBWSxLQUFLLFFBQVEsSUFBSSxTQUFTLEdBQUcsWUFBWSxHQUFHLFlBQVksRUFBRTtFQUM5RSxNQUFNLE1BQU0sVUFBVSxDQUFDLHlCQUF5QixDQUFDLENBQUM7RUFDbEQsS0FBSztBQUNMO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3hDLE1BQU0sSUFBSSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMxRCxLQUFLO0VBQ0wsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLE9BQU8sR0FBRztFQUNaLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakM7RUFDQSxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQjtFQUNBLElBQUksT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO0VBQ3pCLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQ3ZCLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakM7RUFDQSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUNuRDtFQUNBLElBQUksT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO0VBQ3pCLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksRUFBRTtFQUNyQyxJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDO0VBQ0EsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUM3QztFQUNBLElBQUksT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO0VBQ3pCLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7RUFDaEIsSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQztFQUNBLElBQUksTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDO0VBQ3JFLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdEY7RUFDQSxJQUFJLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztFQUN6QixHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFO0VBQ2pCLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakM7RUFDQSxJQUFJLE1BQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMvRDtFQUNBO0VBQ0EsSUFBSSxJQUFJLFdBQVcsS0FBSyxZQUFZLEVBQUU7RUFDdEMsTUFBTSxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ2hGLE1BQU0sTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7RUFDckQsTUFBTSxPQUFPLElBQUksWUFBWSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3ZELEtBQUs7QUFDTDtFQUNBLElBQUksTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztFQUMvQixJQUFJLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQy9DLElBQUksTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxNQUFNLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUU7RUFDQSxJQUFJLElBQUksQ0FBQyxDQUFDO0VBQ1YsSUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLFFBQVEsRUFBRTtFQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDWixLQUFLLE1BQU0sSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO0VBQzFCLE1BQU0sQ0FBQyxHQUFHLE1BQU0sR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLE1BQU0sR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0VBQ2xELEtBQUssTUFBTTtFQUNYLE1BQU0sQ0FBQyxHQUFHLE1BQU0sR0FBRyxLQUFLLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQztFQUMxQyxLQUFLO0FBQ0w7RUFDQSxJQUFJLElBQUksS0FBSyxDQUFDO0VBQ2QsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRTtFQUMzQixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7RUFDaEIsS0FBSyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtFQUN4QixNQUFNLEtBQUssR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztFQUNsRCxLQUFLLE1BQU07RUFDWCxNQUFNLEtBQUssR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQUM7RUFDMUMsS0FBSztBQUNMO0VBQ0EsSUFBSSxNQUFNLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNoRCxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pDO0VBQ0EsSUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7RUFDckIsTUFBTSxPQUFPLEtBQUssQ0FBQztFQUNuQixLQUFLO0FBQ0w7RUFDQSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNkLElBQUksT0FBTyxDQUFDLEdBQUcsS0FBSyxFQUFFO0VBQ3RCLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMxQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0VBQ1YsTUFBTSxFQUFFLENBQUMsQ0FBQztFQUNWLEtBQUs7QUFDTDtFQUNBLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLFFBQVEsQ0FBQyxHQUFHLElBQUksRUFBRTtFQUNwQixJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDO0VBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzlFLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDdEQ7RUFDQSxJQUFJLE1BQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztFQUMvRCxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakg7RUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQzVCLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakM7RUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDL0I7RUFDQSxJQUFJLElBQUksSUFBSSxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzVDLElBQUksSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO0VBQzNCLE1BQU0sT0FBTyxDQUFDLENBQUMsQ0FBQztFQUNoQixLQUFLO0FBQ0w7RUFDQSxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtFQUNsQixNQUFNLElBQUksSUFBSSxNQUFNLENBQUM7RUFDckIsTUFBTSxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7RUFDcEIsUUFBUSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0VBQ2pCLE9BQU87RUFDUCxLQUFLO0FBQ0w7RUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtFQUMvQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxFQUFFO0VBQ25FLFFBQVEsT0FBTyxDQUFDLENBQUM7RUFDakIsT0FBTztFQUNQLEtBQUs7QUFDTDtFQUNBLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztFQUNkLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxXQUFXLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQ2hDLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakM7RUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDL0I7RUFDQSxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDNUUsSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtFQUM1QixNQUFNLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFDaEIsS0FBSztBQUNMO0VBQ0EsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUU7RUFDbkIsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDbkQsS0FBSyxNQUFNO0VBQ1gsTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDO0VBQ3JCLEtBQUs7QUFDTDtFQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtFQUNwQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxFQUFFO0VBQ25FLFFBQVEsT0FBTyxDQUFDLENBQUM7RUFDakIsT0FBTztFQUNQLEtBQUs7QUFDTDtFQUNBLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztFQUNkLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQzdCLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakM7RUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDL0I7RUFDQSxJQUFJLElBQUksSUFBSSxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzVDLElBQUksSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO0VBQzNCLE1BQU0sT0FBTyxLQUFLLENBQUM7RUFDbkIsS0FBSztBQUNMO0VBQ0EsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7RUFDbEIsTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDO0VBQ3JCLE1BQU0sSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO0VBQ3BCLFFBQVEsSUFBSSxHQUFHLENBQUMsQ0FBQztFQUNqQixPQUFPO0VBQ1AsS0FBSztBQUNMO0VBQ0EsSUFBSSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQ3hDLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQy9DLE1BQU0sTUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdDO0VBQ0EsTUFBTSxJQUFJLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQ3hDLFFBQVEsT0FBTyxJQUFJLENBQUM7RUFDcEIsT0FBTztBQUNQO0VBQ0EsTUFBTSxJQUFJLEtBQUssS0FBSyxPQUFPLEVBQUU7RUFDN0IsUUFBUSxPQUFPLElBQUksQ0FBQztFQUNwQixPQUFPO0VBQ1AsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO0VBQ2hCLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakM7RUFDQSxJQUFJLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQztFQUNBLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7RUFDL0IsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLGNBQWMsQ0FBQyxHQUFHLElBQUksRUFBRTtFQUMxQixJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDO0VBQ0EsSUFBSSxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEM7RUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0VBQ3pDLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxLQUFLLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRztFQUM3QixJQUFJLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7RUFDbEMsTUFBTSxPQUFPLGNBQWMsQ0FBQztFQUM1QixLQUFLO0VBQ0wsR0FBRztFQUNILENBQUM7QUFDRDtFQUNBO0VBQ0EsTUFBTSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsbUJBQW1CLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztBQUNuRztFQUNBO0VBQ0EsTUFBTSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQy9DO0VBQ0EsTUFBTSxxQkFBcUIsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDO0FBQ3JEO0VBQ0E7RUFDQSxNQUFNLENBQUMsY0FBYyxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUU7RUFDOUQsRUFBRSxLQUFLLEVBQUUscUJBQXFCLENBQUMsTUFBTTtFQUNyQyxFQUFFLFFBQVEsRUFBRSxJQUFJO0VBQ2hCLEVBQUUsWUFBWSxFQUFFLElBQUk7RUFDcEIsQ0FBQyxDQUFDLENBQUM7QUFDSDtFQUNBLE1BQU0sMEJBQTBCLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztFQUNqRCxLQUFLLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsRUFBRTtFQUMxRDtFQUNBLEVBQUUsSUFBSSxHQUFHLEtBQUssYUFBYSxFQUFFO0VBQzdCLElBQUksU0FBUztFQUNiLEdBQUc7QUFDSDtFQUNBLEVBQUUsTUFBTSxHQUFHLEdBQUcscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDekMsRUFBRSxJQUFJLE9BQU8sR0FBRyxLQUFLLFVBQVUsRUFBRTtFQUNqQyxJQUFJLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUN4QyxHQUFHO0VBQ0g7O0VDcjJCQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ08sU0FBUyxVQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksRUFBRTtFQUMxRCxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7RUFDN0IsSUFBSSxNQUFNLElBQUksU0FBUyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7RUFDcEYsR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLGVBQWUsRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7RUFDcEUsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsVUFBVSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQ2pFLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtFQUM3QixJQUFJLE1BQU0sSUFBSSxTQUFTLENBQUMsMERBQTBELENBQUMsQ0FBQztFQUNwRixHQUFHO0FBQ0g7RUFDQSxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7RUFDckU7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
