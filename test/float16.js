/*! @petamoriken/float16 v3.4.11-19-g572fe6e | MIT License - https://git.io/float16 */

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
   * @param {Iterator<T>} iterator
   * @returns {IterableIterator<T>}
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
  const getTypedArrayPrototypeSymbolToStringTag = Reflect.getOwnPropertyDescriptor(Reflect.getPrototypeOf(Uint8Array).prototype, Symbol.toStringTag).get;

  /**
   * @param {unknown} value
   * @returns {value is Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float32Array|Float64Array|BigUint64Array|BigInt64Array}
   */
  function isTypedArray(value) {
    return getTypedArrayPrototypeSymbolToStringTag.call(value) !== undefined;
  }

  /**
   * @param {unknown} value
   * @returns {value is Uint16Array}
   */
  function isUint16Array(value) {
    return getTypedArrayPrototypeSymbolToStringTag.call(value) === "Uint16Array";
  }

  /**
   * @param {unknown} value
   * @returns {value is BigInt64Array|BigUint64Array}
   */
  function isBigIntTypedArray(value) {
    const typedArrayName = getTypedArrayPrototypeSymbolToStringTag.call(value);
    return typedArrayName === "BigInt64Array" || typedArrayName === "BigUint64Array";
  }

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

    return true;
  }

  /**
   * @param {unknown} value
   * @returns {value is ArrayBuffer}
   */
  function isArrayBuffer(value) {
    return isObjectLike(value) && value[Symbol.toStringTag] === "ArrayBuffer";
  }

  /**
   * @param {unknown} value
   * @returns {value is SharedArrayBuffer}
   */
  function isSharedArrayBuffer(value) {
    return isObjectLike(value) && value[Symbol.toStringTag] === "SharedArrayBuffer";
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
    if (iterator[Symbol.toStringTag] !== "Array Iterator") {
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
    if (iterator[Symbol.toStringTag] !== "Array Iterator") {
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
   * @returns {target is Float16Array}
   */
  function isFloat16Array(target) {
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

  /**
   * @param {unknown} target
   * @throws {TypeError}
   */
  function assertSpeciesTypedArray(target) {
    if (isFloat16Array(target)) {
      return;
    }

    if (!isTypedArray(target)) {
      throw new TypeError("This is not a TypedArray");
    }

    if (isBigIntTypedArray(target)) {
      throw new TypeError("Cannot mix BigInt and other types, use explicit conversions");
    }
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

      return Reflect.apply(TypedArrayPrototype.keys, getFloat16BitsArray(this), []);
    }

    /**
     * limitation: returns a object whose prototype is not `%ArrayIteratorPrototype%`
     *
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
     */
    values() {
      assertFloat16Array(this);

      const arrayIterator = Reflect.apply(TypedArrayPrototype.values, getFloat16BitsArray(this), []);
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

      const arrayIterator = Reflect.apply(TypedArrayPrototype.entries, getFloat16BitsArray(this), []);
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
        throw RangeError("offset is out of bounds");
      }

      if (isBigIntTypedArray(input)) {
        throw new TypeError("Cannot mix BigInt and other types, use explicit conversions");
      }

      // for optimization
      if (isFloat16Array(input)) {
        // peel off Proxy
        return Reflect.apply(TypedArrayPrototype.set, getFloat16BitsArray(this), [
          getFloat16BitsArray(input),
          targetOffset,
        ]);
      }

      const float16bitsArray = getFloat16BitsArray(this);

      const targetLength = float16bitsArray.length;

      const src = Object(input);
      const srcLength = LengthOfArrayLike(src);

      if (targetOffset === Infinity || srcLength + targetOffset > targetLength) {
        throw RangeError("offset is out of bounds");
      }

      for (let i = 0; i < srcLength; ++i) {
        float16bitsArray[i + targetOffset] = roundToFloat16Bits(src[i]);
      }
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse */
    reverse() {
      assertFloat16Array(this);

      Reflect.apply(TypedArrayPrototype.reverse, getFloat16BitsArray(this), []);

      return this;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill */
    fill(value, ...opts) {
      assertFloat16Array(this);

      Reflect.apply(TypedArrayPrototype.fill, getFloat16BitsArray(this), [roundToFloat16Bits(value), ...opts]);

      return this;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin */
    copyWithin(target, start, ...opts) {
      assertFloat16Array(this);

      Reflect.apply(TypedArrayPrototype.copyWithin, getFloat16BitsArray(this), [target, start, ...opts]);

      return this;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort */
    sort(...opts) {
      assertFloat16Array(this);

      const compare = opts[0] !== undefined ? opts[0] : defaultCompare;
      Reflect.apply(TypedArrayPrototype.sort, getFloat16BitsArray(this), [(x, y) => { return compare(convertToNumber(x), convertToNumber(y)); }]);

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

      const uint16 = new Uint16Array(float16bitsArray.buffer, float16bitsArray.byteOffset, float16bitsArray.length);
      const subarray = uint16.subarray(...opts);

      const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);
      const array = new Constructor(subarray.buffer, subarray.byteOffset, subarray.length);
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

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator */
  Object.defineProperty(Float16ArrayPrototype, Symbol.iterator, {
    value: Float16ArrayPrototype.values,
    writable: true,
    configurable: true,
  });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXQxNi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL19jb252ZXJ0ZXIubWpzIiwiLi4vc3JjL2hmcm91bmQubWpzIiwiLi4vc3JjL191dGlsL3ByaXZhdGUubWpzIiwiLi4vc3JjL19hcnJheUl0ZXJhdG9yLm1qcyIsIi4uL3NyYy9fdXRpbC9pcy5tanMiLCIuLi9zcmMvX3NwZWMubWpzIiwiLi4vc3JjL191dGlsL2hhc093bi5tanMiLCIuLi9zcmMvRmxvYXQxNkFycmF5Lm1qcyIsIi4uL3NyYy9EYXRhVmlldy5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gYWxnb3JpdGhtOiBodHRwOi8vZm94LXRvb2xraXQub3JnL2Z0cC9mYXN0aGFsZmZsb2F0Y29udmVyc2lvbi5wZGZcblxuY29uc3QgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuY29uc3QgZmxvYXRWaWV3ID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXIpO1xuY29uc3QgdWludDMyVmlldyA9IG5ldyBVaW50MzJBcnJheShidWZmZXIpO1xuXG5jb25zdCBiYXNlVGFibGUgPSBuZXcgVWludDMyQXJyYXkoNTEyKTtcbmNvbnN0IHNoaWZ0VGFibGUgPSBuZXcgVWludDMyQXJyYXkoNTEyKTtcblxuZm9yIChsZXQgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBjb25zdCBlID0gaSAtIDEyNztcblxuICAvLyB2ZXJ5IHNtYWxsIG51bWJlciAoMCwgLTApXG4gIGlmIChlIDwgLTI3KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAweDAwMDA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gMjQ7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgLy8gc21hbGwgbnVtYmVyIChkZW5vcm0pXG4gIH0gZWxzZSBpZiAoZSA8IC0xNCkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gIDB4MDQwMCA+PiAoLWUgLSAxNCk7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAoMHgwNDAwID4+ICgtZSAtIDE0KSkgfCAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gLWUgLSAxO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IC1lIC0gMTtcblxuICAvLyBub3JtYWwgbnVtYmVyXG4gIH0gZWxzZSBpZiAoZSA8PSAxNSkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gIChlICsgMTUpIDw8IDEwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gKChlICsgMTUpIDw8IDEwKSB8IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAxMztcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcblxuICAvLyBsYXJnZSBudW1iZXIgKEluZmluaXR5LCAtSW5maW5pdHkpXG4gIH0gZWxzZSBpZiAoZSA8IDEyOCkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gMHg3YzAwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDI0O1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDI0O1xuXG4gIC8vIHN0YXkgKE5hTiwgSW5maW5pdHksIC1JbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBiYXNlVGFibGVbaV0gICAgICAgICA9IDB4N2MwMDtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ZmMwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAxMztcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcbiAgfVxufVxuXG4vKipcbiAqIHJvdW5kIGEgbnVtYmVyIHRvIGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtIC0gZG91YmxlIGZsb2F0XG4gKiBAcmV0dXJucyB7bnVtYmVyfSBoYWxmIGZsb2F0IG51bWJlciBiaXRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByb3VuZFRvRmxvYXQxNkJpdHMobnVtKSB7XG4gIGZsb2F0Vmlld1swXSA9IG51bTtcbiAgY29uc3QgZiA9IHVpbnQzMlZpZXdbMF07XG4gIGNvbnN0IGUgPSAoZiA+PiAyMykgJiAweDFmZjtcbiAgcmV0dXJuIGJhc2VUYWJsZVtlXSArICgoZiAmIDB4MDA3ZmZmZmYpID4+IHNoaWZ0VGFibGVbZV0pO1xufVxuXG5jb25zdCBtYW50aXNzYVRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDIwNDgpO1xuY29uc3QgZXhwb25lbnRUYWJsZSA9IG5ldyBVaW50MzJBcnJheSg2NCk7XG5jb25zdCBvZmZzZXRUYWJsZSA9IG5ldyBVaW50MzJBcnJheSg2NCk7XG5cbm1hbnRpc3NhVGFibGVbMF0gPSAwO1xuZm9yIChsZXQgaSA9IDE7IGkgPCAxMDI0OyArK2kpIHtcbiAgbGV0IG0gPSBpIDw8IDEzOyAgICAvLyB6ZXJvIHBhZCBtYW50aXNzYSBiaXRzXG4gIGxldCBlID0gMDsgICAgICAgICAgLy8gemVybyBleHBvbmVudFxuXG4gIC8vIG5vcm1hbGl6ZWRcbiAgd2hpbGUoKG0gJiAweDAwODAwMDAwKSA9PT0gMCkge1xuICAgIGUgLT0gMHgwMDgwMDAwMDsgIC8vIGRlY3JlbWVudCBleHBvbmVudFxuICAgIG0gPDw9IDE7XG4gIH1cblxuICBtICY9IH4weDAwODAwMDAwOyAgIC8vIGNsZWFyIGxlYWRpbmcgMSBiaXRcbiAgZSArPSAweDM4ODAwMDAwOyAgICAvLyBhZGp1c3QgYmlhc1xuXG4gIG1hbnRpc3NhVGFibGVbaV0gPSBtIHwgZTtcbn1cbmZvciAobGV0IGkgPSAxMDI0OyBpIDwgMjA0ODsgKytpKSB7XG4gIG1hbnRpc3NhVGFibGVbaV0gPSAweDM4MDAwMDAwICsgKChpIC0gMTAyNCkgPDwgMTMpO1xufVxuXG5leHBvbmVudFRhYmxlWzBdID0gMDtcbmZvciAobGV0IGkgPSAxOyBpIDwgMzE7ICsraSkge1xuICBleHBvbmVudFRhYmxlW2ldID0gaSA8PCAyMztcbn1cbmV4cG9uZW50VGFibGVbMzFdID0gMHg0NzgwMDAwMDtcbmV4cG9uZW50VGFibGVbMzJdID0gMHg4MDAwMDAwMDtcbmZvciAobGV0IGkgPSAzMzsgaSA8IDYzOyArK2kpIHtcbiAgZXhwb25lbnRUYWJsZVtpXSA9IDB4ODAwMDAwMDAgKyAoKGkgLSAzMikgPDwgMjMpO1xufVxuZXhwb25lbnRUYWJsZVs2M10gPSAweGM3ODAwMDAwO1xuXG5vZmZzZXRUYWJsZVswXSA9IDA7XG5mb3IgKGxldCBpID0gMTsgaSA8IDY0OyArK2kpIHtcbiAgaWYgKGkgPT09IDMyKSB7XG4gICAgb2Zmc2V0VGFibGVbaV0gPSAwO1xuICB9IGVsc2Uge1xuICAgIG9mZnNldFRhYmxlW2ldID0gMTAyNDtcbiAgfVxufVxuXG4vKipcbiAqIGNvbnZlcnQgYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBmbG9hdDE2Yml0cyAtIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGRvdWJsZSBmbG9hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzKSB7XG4gIGNvbnN0IG0gPSBmbG9hdDE2Yml0cyA+PiAxMDtcbiAgdWludDMyVmlld1swXSA9IG1hbnRpc3NhVGFibGVbb2Zmc2V0VGFibGVbbV0gKyAoZmxvYXQxNmJpdHMgJiAweDNmZildICsgZXhwb25lbnRUYWJsZVttXTtcbiAgcmV0dXJuIGZsb2F0Vmlld1swXTtcbn1cbiIsImltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX2NvbnZlcnRlci5tanNcIjtcblxuLyoqXG4gKiByZXR1cm5zIHRoZSBuZWFyZXN0IGhhbGYgcHJlY2lzaW9uIGZsb2F0IHJlcHJlc2VudGF0aW9uIG9mIGEgbnVtYmVyLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoZnJvdW5kKG51bSkge1xuICBpZiAodHlwZW9mIG51bSA9PT0gXCJiaWdpbnRcIikge1xuICAgIHRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IGEgQmlnSW50IHZhbHVlIHRvIGEgbnVtYmVyXCIpO1xuICB9XG5cbiAgbnVtID0gTnVtYmVyKG51bSk7XG5cbiAgLy8gZm9yIG9wdGltaXphdGlvblxuICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pIHx8IG51bSA9PT0gMCkge1xuICAgIHJldHVybiBudW07XG4gIH1cblxuICBjb25zdCB4MTYgPSByb3VuZFRvRmxvYXQxNkJpdHMobnVtKTtcbiAgcmV0dXJuIGNvbnZlcnRUb051bWJlcih4MTYpO1xufVxuIiwiLyoqIEByZXR1cm5zIHsoc2VsZjogb2JqZWN0KSA9PiBvYmplY3R9ICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJpdmF0ZVN0b3JhZ2UoKSB7XG4gIGNvbnN0IHdtID0gbmV3IFdlYWtNYXAoKTtcblxuICByZXR1cm4gKHNlbGYpID0+IHtcbiAgICBjb25zdCBzdG9yYWdlID0gd20uZ2V0KHNlbGYpO1xuICAgIGlmIChzdG9yYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBzdG9yYWdlO1xuICAgIH1cblxuICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgd20uc2V0KHNlbGYsIG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcbn1cbiIsImltcG9ydCB7IGNyZWF0ZVByaXZhdGVTdG9yYWdlIH0gZnJvbSBcIi4vX3V0aWwvcHJpdmF0ZS5tanNcIjtcblxuY29uc3QgXyA9IGNyZWF0ZVByaXZhdGVTdG9yYWdlKCk7XG5cbmNvbnN0IEl0ZXJhdG9yUHJvdG90eXBlID0gUmVmbGVjdC5nZXRQcm90b3R5cGVPZihSZWZsZWN0LmdldFByb3RvdHlwZU9mKFtdW1N5bWJvbC5pdGVyYXRvcl0oKSkpO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSVhcnJheWl0ZXJhdG9ycHJvdG90eXBlJS1vYmplY3QgKi9cbmNvbnN0IEFycmF5SXRlcmF0b3JQcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7XG4gIG5leHQ6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHJldHVybiBfKHRoaXMpLml0ZXJhdG9yLm5leHQoKTtcbiAgICB9LFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgfSxcblxuICBbU3ltYm9sLnRvU3RyaW5nVGFnXToge1xuICAgIHZhbHVlOiBcIkFycmF5IEl0ZXJhdG9yXCIsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICB9LFxufSk7XG5cbi8qKlxuICogQHBhcmFtIHtJdGVyYXRvcjxUPn0gaXRlcmF0b3JcbiAqIEByZXR1cm5zIHtJdGVyYWJsZUl0ZXJhdG9yPFQ+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JhcEluQXJyYXlJdGVyYXRvcihpdGVyYXRvcikge1xuICBjb25zdCBhcnJheUl0ZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShBcnJheUl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgXyhhcnJheUl0ZXJhdG9yKS5pdGVyYXRvciA9IGl0ZXJhdG9yO1xuICByZXR1cm4gYXJyYXlJdGVyYXRvcjtcbn1cbiIsIi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIG9iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB8fCB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgb2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCI7XG59XG5cbi8vIEluc3BpcmVkIGJ5IHV0aWwudHlwZXMgaW1wbGVtZW50YXRpb24gb2YgTm9kZS5qc1xuY29uc3QgZ2V0VHlwZWRBcnJheVByb3RvdHlwZVN5bWJvbFRvU3RyaW5nVGFnID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoUmVmbGVjdC5nZXRQcm90b3R5cGVPZihVaW50OEFycmF5KS5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZykuZ2V0O1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBVaW50OEFycmF5fFVpbnQ4Q2xhbXBlZEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fEludDhBcnJheXxJbnQxNkFycmF5fEludDMyQXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheXxCaWdVaW50NjRBcnJheXxCaWdJbnQ2NEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBnZXRUeXBlZEFycmF5UHJvdG90eXBlU3ltYm9sVG9TdHJpbmdUYWcuY2FsbCh2YWx1ZSkgIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVWludDE2QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1VpbnQxNkFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBnZXRUeXBlZEFycmF5UHJvdG90eXBlU3ltYm9sVG9TdHJpbmdUYWcuY2FsbCh2YWx1ZSkgPT09IFwiVWludDE2QXJyYXlcIjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgQmlnSW50NjRBcnJheXxCaWdVaW50NjRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQmlnSW50VHlwZWRBcnJheSh2YWx1ZSkge1xuICBjb25zdCB0eXBlZEFycmF5TmFtZSA9IGdldFR5cGVkQXJyYXlQcm90b3R5cGVTeW1ib2xUb1N0cmluZ1RhZy5jYWxsKHZhbHVlKTtcbiAgcmV0dXJuIHR5cGVkQXJyYXlOYW1lID09PSBcIkJpZ0ludDY0QXJyYXlcIiB8fCB0eXBlZEFycmF5TmFtZSA9PT0gXCJCaWdVaW50NjRBcnJheVwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBEYXRhVmlld31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRGF0YVZpZXcodmFsdWUpIHtcbiAgaWYgKCFBcnJheUJ1ZmZlci5pc1ZpZXcodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGlzVHlwZWRBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgQXJyYXlCdWZmZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09IFwiQXJyYXlCdWZmZXJcIjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgU2hhcmVkQXJyYXlCdWZmZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NoYXJlZEFycmF5QnVmZmVyKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09IFwiU2hhcmVkQXJyYXlCdWZmZXJcIjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgSXRlcmFibGU8YW55Pn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSXRlcmFibGUodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiB0eXBlb2YgdmFsdWVbU3ltYm9sLml0ZXJhdG9yXSA9PT0gXCJmdW5jdGlvblwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBhbnlbXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3JkaW5hcnlBcnJheSh2YWx1ZSkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaXRlcmF0b3IgPSB2YWx1ZVtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIGlmIChpdGVyYXRvcltTeW1ib2wudG9TdHJpbmdUYWddICE9PSBcIkFycmF5IEl0ZXJhdG9yXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVWludDhBcnJheXxVaW50OENsYW1wZWRBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxJbnQ4QXJyYXl8SW50MTZBcnJheXxJbnQzMkFycmF5fEZsb2F0MzJBcnJheXxGbG9hdDY0QXJyYXl8QmlnVWludDY0QXJyYXl8QmlnSW50NjRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3JkaW5hcnlUeXBlZEFycmF5KHZhbHVlKSB7XG4gIGlmICghaXNUeXBlZEFycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gdmFsdWVbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICBpZiAoaXRlcmF0b3JbU3ltYm9sLnRvU3RyaW5nVGFnXSAhPT0gXCJBcnJheSBJdGVyYXRvclwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHN0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBudW1iZXIgPSBOdW1iZXIodmFsdWUpO1xuICBpZiAodmFsdWUgIT09IG51bWJlciArIFwiXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW1iZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKG51bWJlciAhPT0gTWF0aC50cnVuYyhudW1iZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG4iLCJpbXBvcnQgeyBpc09iamVjdCB9IGZyb20gXCIuL191dGlsL2lzLm1qc1wiO1xuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b2ludGVnZXJvcmluZmluaXR5XG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFRvSW50ZWdlck9ySW5maW5pdHkodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcImJpZ2ludFwiKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IGNvbnZlcnQgYSBCaWdJbnQgdmFsdWUgdG8gYSBudW1iZXJcIik7XG4gIH1cblxuICBjb25zdCBudW1iZXIgPSBOdW1iZXIodGFyZ2V0KTtcblxuICBpZiAoTnVtYmVyLmlzTmFOKG51bWJlcikgfHwgbnVtYmVyID09PSAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gTWF0aC50cnVuYyhudW1iZXIpO1xufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b2xlbmd0aFxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIFRvTGVuZ3RoKHRhcmdldCkge1xuICBjb25zdCBsZW5ndGggPSBUb0ludGVnZXJPckluZmluaXR5KHRhcmdldCk7XG4gIGlmIChsZW5ndGggPCAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gbGVuZ3RoIDwgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIgPyBsZW5ndGggOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtbGVuZ3Rob2ZhcnJheWxpa2VcbiAqIEBwYXJhbSB7b2JqZWN0fSBhcnJheUxpa2VcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBMZW5ndGhPZkFycmF5TGlrZShhcnJheUxpa2UpIHtcbiAgaWYgKCFpc09iamVjdChhcnJheUxpa2UpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwidGhpcyBpcyBub3QgYSBvYmplY3RcIik7XG4gIH1cblxuICByZXR1cm4gVG9MZW5ndGgoYXJyYXlMaWtlLmxlbmd0aCk7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXNwZWNpZXNjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtvYmplY3R9IHRhcmdldFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZGVmYXVsdENvbnN0cnVjdG9yXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBTcGVjaWVzQ29uc3RydWN0b3IodGFyZ2V0LCBkZWZhdWx0Q29uc3RydWN0b3IpIHtcbiAgaWYgKCFpc09iamVjdCh0YXJnZXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwidGhpcyBpcyBub3QgYSBvYmplY3RcIik7XG4gIH1cblxuICBjb25zdCBjb25zdHJ1Y3RvciA9IHRhcmdldC5jb25zdHJ1Y3RvcjtcbiAgaWYgKGNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZGVmYXVsdENvbnN0cnVjdG9yO1xuICB9XG4gIGlmICghaXNPYmplY3QoY29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiY29uc3RydWN0b3IgaXMgbm90IGEgb2JqZWN0XCIpO1xuICB9XG5cbiAgY29uc3Qgc3BlY2llcyA9IGNvbnN0cnVjdG9yW1N5bWJvbC5zcGVjaWVzXTtcbiAgaWYgKHNwZWNpZXMgPT0gbnVsbCkge1xuICAgIHJldHVybiBkZWZhdWx0Q29uc3RydWN0b3I7XG4gIH1cblxuICByZXR1cm4gc3BlY2llcztcbn1cblxuLyoqXG4gKiBiaWdpbnQgY29tcGFyaXNvbnMgYXJlIG5vdCBzdXBwb3J0ZWRcbiAqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb3J0XG4gKiBAcGFyYW0ge251bWJlcn0geFxuICogQHBhcmFtIHtudW1iZXJ9IHlcbiAqIEByZXR1cm5zIHstMSB8IDAgfCAxfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdENvbXBhcmUoeCwgeSkge1xuICBjb25zdCBpc05hTl94ID0gTnVtYmVyLmlzTmFOKHgpO1xuICBjb25zdCBpc05hTl95ID0gTnVtYmVyLmlzTmFOKHkpO1xuXG4gIGlmIChpc05hTl94ICYmIGlzTmFOX3kpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChpc05hTl94KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICBpZiAoaXNOYU5feSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmICh4IDwgeSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmICh4ID4geSkge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCkge1xuICAgIGNvbnN0IGlzUGx1c1plcm9feCA9IE9iamVjdC5pcyh4LCAwKTtcbiAgICBjb25zdCBpc1BsdXNaZXJvX3kgPSBPYmplY3QuaXMoeSwgMCk7XG5cbiAgICBpZiAoIWlzUGx1c1plcm9feCAmJiBpc1BsdXNaZXJvX3kpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoaXNQbHVzWmVyb194ICYmICFpc1BsdXNaZXJvX3kpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAwO1xufVxuIiwiY29uc3QgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vKiogQHR5cGUgeyhvYmplY3Q6IG9iamVjdCwga2V5OiBQcm9wZXJ0eUtleSkgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBoYXNPd24gPSBPYmplY3QuaGFzT3duIHx8IGZ1bmN0aW9uIGhhc093bihvYmplY3QsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSk7XG59O1xuIiwiaW1wb3J0IHsgd3JhcEluQXJyYXlJdGVyYXRvciB9IGZyb20gXCIuL19hcnJheUl0ZXJhdG9yLm1qc1wiO1xuaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9fY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHsgTGVuZ3RoT2ZBcnJheUxpa2UsIFNwZWNpZXNDb25zdHJ1Y3RvciwgVG9JbnRlZ2VyT3JJbmZpbml0eSwgZGVmYXVsdENvbXBhcmUgfSBmcm9tIFwiLi9fc3BlYy5tanNcIjtcbmltcG9ydCB7IGhhc093biB9IGZyb20gXCIuL191dGlsL2hhc093bi5tanNcIjtcbmltcG9ydCB7IGlzQXJyYXlCdWZmZXIsIGlzQmlnSW50VHlwZWRBcnJheSwgaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcsIGlzSXRlcmFibGUsIGlzT2JqZWN0LCBpc09iamVjdExpa2UsIGlzT3JkaW5hcnlBcnJheSwgaXNPcmRpbmFyeVR5cGVkQXJyYXksIGlzU2hhcmVkQXJyYXlCdWZmZXIsIGlzVHlwZWRBcnJheSwgaXNVaW50MTZBcnJheSB9IGZyb20gXCIuL191dGlsL2lzLm1qc1wiO1xuaW1wb3J0IHsgY3JlYXRlUHJpdmF0ZVN0b3JhZ2UgfSBmcm9tIFwiLi9fdXRpbC9wcml2YXRlLm1qc1wiO1xuXG5jb25zdCBicmFuZCA9IFN5bWJvbC5mb3IoXCJfX0Zsb2F0MTZBcnJheV9fXCIpO1xuXG5jb25zdCBfID0gY3JlYXRlUHJpdmF0ZVN0b3JhZ2UoKTtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGhhc0Zsb2F0MTZBcnJheUJyYW5kKHRhcmdldCkge1xuICBpZiAoIWlzT2JqZWN0TGlrZSh0YXJnZXQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcHJvdG90eXBlID0gUmVmbGVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpO1xuICBpZiAoIWlzT2JqZWN0TGlrZShwcm90b3R5cGUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgY29uc3RydWN0b3IgPSBwcm90b3R5cGUuY29uc3RydWN0b3I7XG4gIGlmIChjb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICghaXNPYmplY3QoY29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiY29uc3RydWN0b3IgaXMgbm90IGEgb2JqZWN0XCIpO1xuICB9XG5cbiAgcmV0dXJuIFJlZmxlY3QuaGFzKGNvbnN0cnVjdG9yLCBicmFuZCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHt0YXJnZXQgaXMgRmxvYXQxNkFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGbG9hdDE2QXJyYXkodGFyZ2V0KSB7XG4gIHJldHVybiBoYXNGbG9hdDE2QXJyYXlCcmFuZCh0YXJnZXQpICYmICFpc1R5cGVkQXJyYXkodGFyZ2V0KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge3RhcmdldCBpcyBVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfX1cbiAqL1xuZnVuY3Rpb24gaXNGbG9hdDE2Qml0c0FycmF5KHRhcmdldCkge1xuICByZXR1cm4gaGFzRmxvYXQxNkFycmF5QnJhbmQodGFyZ2V0KSAmJiBpc1VpbnQxNkFycmF5KHRhcmdldCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0RmxvYXQxNkFycmF5KHRhcmdldCkge1xuICBpZiAoIWlzRmxvYXQxNkFycmF5KHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhpcyBpcyBub3QgYSBGbG9hdDE2QXJyYXlcIik7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge0Zsb2F0MTZBcnJheX0gZmxvYXQxNlxuICogQHJldHVybnMge1VpbnQxNkFycmF5ICYgeyBfX2Zsb2F0MTZiaXRzOiBuZXZlciB9fVxuICovXG5mdW5jdGlvbiBnZXRGbG9hdDE2Qml0c0FycmF5KGZsb2F0MTYpIHtcbiAgbGV0IHRhcmdldCA9IF8oZmxvYXQxNikudGFyZ2V0O1xuXG4gIC8vIGZyb20gb3RoZXIgcmVhbG1zXG4gIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGNsb25lID0gbmV3IEZsb2F0MTZBcnJheShmbG9hdDE2LmJ1ZmZlciwgZmxvYXQxNi5ieXRlT2Zmc2V0LCBmbG9hdDE2Lmxlbmd0aCk7XG4gICAgdGFyZ2V0ID0gXyhjbG9uZSkudGFyZ2V0O1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1VpbnQxNkFycmF5ICYgeyBfX2Zsb2F0MTZiaXRzOiBuZXZlciB9fSBmbG9hdDE2Yml0c0FycmF5XG4gKiBAcmV0dXJucyB7bnVtYmVyW119XG4gKi9cbmZ1bmN0aW9uIGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpIHtcbiAgY29uc3QgbGVuZ3RoID0gZmxvYXQxNmJpdHNBcnJheS5sZW5ndGg7XG5cbiAgY29uc3QgYXJyYXkgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGFycmF5W2ldID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKi9cbmZ1bmN0aW9uIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KHRhcmdldCkge1xuICBpZiAoaXNGbG9hdDE2QXJyYXkodGFyZ2V0KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghaXNUeXBlZEFycmF5KHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhpcyBpcyBub3QgYSBUeXBlZEFycmF5XCIpO1xuICB9XG5cbiAgaWYgKGlzQmlnSW50VHlwZWRBcnJheSh0YXJnZXQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBtaXggQmlnSW50IGFuZCBvdGhlciB0eXBlcywgdXNlIGV4cGxpY2l0IGNvbnZlcnNpb25zXCIpO1xuICB9XG59XG5cbmNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGUgPSBSZWZsZWN0LmdldFByb3RvdHlwZU9mKFVpbnQ4QXJyYXkpLnByb3RvdHlwZTtcblxuY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUdldHRlcnMgPSBuZXcgU2V0KCk7XG5mb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0Lm93bktleXMoVHlwZWRBcnJheVByb3RvdHlwZSkpIHtcbiAgY29uc3QgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoVHlwZWRBcnJheVByb3RvdHlwZSwga2V5KTtcbiAgaWYgKGhhc093bihkZXNjcmlwdG9yLCBcImdldFwiKSkge1xuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXR0ZXJzLmFkZChrZXkpO1xuICB9XG59XG5cbi8qKiBAdHlwZSB7UHJveHlIYW5kbGVyPEZsb2F0MTZBcnJheT59ICovXG5jb25zdCBoYW5kbGVyID0gT2JqZWN0LmZyZWV6ZSh7XG4gIGdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpIHtcbiAgICBpZiAoaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcoa2V5KSAmJiBoYXNPd24odGFyZ2V0LCBrZXkpKSB7XG4gICAgICByZXR1cm4gY29udmVydFRvTnVtYmVyKFJlZmxlY3QuZ2V0KHRhcmdldCwga2V5KSk7XG4gICAgfVxuXG4gICAgaWYgKFR5cGVkQXJyYXlQcm90b3R5cGVHZXR0ZXJzLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpO1xuICB9LFxuXG4gIHNldCh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgICBpZiAoaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcoa2V5KSAmJiBoYXNPd24odGFyZ2V0LCBrZXkpKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIGtleSwgdmFsdWUpO1xuICB9LFxufSk7XG5cbi8qKiBsaW1pdGF0aW9uOiBzZWUgUkVBRE1FLm1kIGZvciBkZXRhaWxzICovXG5leHBvcnQgY2xhc3MgRmxvYXQxNkFycmF5IGV4dGVuZHMgVWludDE2QXJyYXkge1xuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdHlwZWRhcnJheSAqL1xuICBjb25zdHJ1Y3RvcihpbnB1dCwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gICAgLy8gaW5wdXQgRmxvYXQxNkFycmF5XG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KGlucHV0KSkge1xuICAgICAgLy8gcGVlbCBvZmYgUHJveHlcbiAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KGlucHV0KTtcbiAgICAgIHN1cGVyKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgLy8gb2JqZWN0IHdpdGhvdXQgQXJyYXlCdWZmZXJcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGlucHV0KSAmJiAhaXNBcnJheUJ1ZmZlcihpbnB1dCkpIHtcbiAgICAgIC8qKiBAdHlwZSB7QXJyYXlMaWtlPG51bWJlcj59ICovXG4gICAgICBsZXQgbGlzdDtcbiAgICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICAgICAgbGV0IGxlbmd0aDtcblxuICAgICAgLy8gVHlwZWRBcnJheVxuICAgICAgaWYgKGlzVHlwZWRBcnJheShpbnB1dCkpIHtcbiAgICAgICAgaWYgKGlzQmlnSW50VHlwZWRBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IG1peCBCaWdJbnQgYW5kIG90aGVyIHR5cGVzLCB1c2UgZXhwbGljaXQgY29udmVyc2lvbnNcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0ID0gaW5wdXQ7XG4gICAgICAgIGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcblxuICAgICAgICBjb25zdCBidWZmZXIgPSBpbnB1dC5idWZmZXI7XG4gICAgICAgIC8qKiBAdHlwZSB7QXJyYXlCdWZmZXJDb25zdHJ1Y3Rvcn0gKi9cbiAgICAgICAgY29uc3QgQnVmZmVyQ29uc3RydWN0b3IgPSAhaXNTaGFyZWRBcnJheUJ1ZmZlcihidWZmZXIpID8gU3BlY2llc0NvbnN0cnVjdG9yKGJ1ZmZlciwgQXJyYXlCdWZmZXIpIDogQXJyYXlCdWZmZXI7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgQnVmZmVyQ29uc3RydWN0b3IobGVuZ3RoICogRmxvYXQxNkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKTtcbiAgICAgICAgc3VwZXIoZGF0YSk7XG5cbiAgICAgIC8vIEl0ZXJhYmxlIChBcnJheSlcbiAgICAgIH0gZWxzZSBpZiAoaXNJdGVyYWJsZShpbnB1dCkpIHtcbiAgICAgICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgICAgICBpZiAoaXNPcmRpbmFyeUFycmF5KGlucHV0KSkge1xuICAgICAgICAgIGxpc3QgPSBpbnB1dDtcbiAgICAgICAgICBsZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gICAgICAgICAgc3VwZXIobGVuZ3RoKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpc3QgPSBbLi4uaW5wdXRdO1xuICAgICAgICAgIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICAgICAgICAgIHN1cGVyKGxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgLy8gQXJyYXlMaWtlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaXN0ID0gaW5wdXQ7XG4gICAgICAgIGxlbmd0aCA9IExlbmd0aE9mQXJyYXlMaWtlKGlucHV0KTtcbiAgICAgICAgc3VwZXIobGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHZhbHVlc1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICAvLyBzdXBlciAoVWludDE2QXJyYXkpXG4gICAgICAgIHRoaXNbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMobGlzdFtpXSk7XG4gICAgICB9XG5cbiAgICAvLyBwcmltaXRpdmUsIEFycmF5QnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgc3VwZXIoaW5wdXQpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzdXBlcihpbnB1dCwgYnl0ZU9mZnNldCk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHN1cGVyKGlucHV0LCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwcm94eSA9IG5ldyBQcm94eSh0aGlzLCBoYW5kbGVyKTtcblxuICAgIC8vIHByb3h5IHByaXZhdGUgc3RvcmFnZVxuICAgIF8ocHJveHkpLnRhcmdldCA9IHRoaXM7XG5cbiAgICByZXR1cm4gcHJveHk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZsb2F0MTZBcnJheSlgIG9yIGBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5KWAgaW5jbHVkZSB0aGlzIGtleVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLmZyb21cbiAgICovXG4gIHN0YXRpYyBmcm9tKHNyYywgLi4ub3B0cykge1xuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gdGhpcztcblxuICAgIGlmICghUmVmbGVjdC5oYXMoQ29uc3RydWN0b3IsIGJyYW5kKSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKFwiVGhpcyBjb25zdHJ1Y3RvciBpcyBub3QgYSBzdWJjbGFzcyBvZiBGbG9hdDE2QXJyYXlcIik7XG4gICAgfVxuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBpZiAoaXNGbG9hdDE2QXJyYXkoc3JjKSAmJiBvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zdCB1aW50MTYgPSBuZXcgVWludDE2QXJyYXkoc3JjLmJ1ZmZlciwgc3JjLmJ5dGVPZmZzZXQsIHNyYy5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheSh1aW50MTYuc2xpY2UoKS5idWZmZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoVWludDE2QXJyYXkuZnJvbShzcmMsIHJvdW5kVG9GbG9hdDE2Qml0cykuYnVmZmVyKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWFwRnVuYyA9IG9wdHNbMF07XG4gICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1sxXTtcblxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoVWludDE2QXJyYXkuZnJvbShzcmMsIGZ1bmN0aW9uICh2YWwsIC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHJvdW5kVG9GbG9hdDE2Qml0cyhtYXBGdW5jLmNhbGwodGhpcywgdmFsLCAuLi5hcmdzKSk7XG4gICAgICB9LCB0aGlzQXJnKS5idWZmZXIpO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7QXJyYXlMaWtlPG51bWJlcj59ICovXG4gICAgbGV0IGxpc3Q7XG4gICAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG4gICAgbGV0IGxlbmd0aDtcblxuICAgIC8vIEl0ZXJhYmxlIChUeXBlZEFycmF5LCBBcnJheSlcbiAgICBpZiAoaXNJdGVyYWJsZShzcmMpKSB7XG4gICAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgICBpZiAoaXNPcmRpbmFyeUFycmF5KHNyYykgfHwgaXNPcmRpbmFyeVR5cGVkQXJyYXkoc3JjKSkge1xuICAgICAgICBsaXN0ID0gc3JjO1xuICAgICAgICBsZW5ndGggPSBzcmMubGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGlzdCA9IFsuLi5zcmNdO1xuICAgICAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgIH1cblxuICAgIC8vIEFycmF5TGlrZVxuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0ID0gc3JjO1xuICAgICAgbGVuZ3RoID0gTGVuZ3RoT2ZBcnJheUxpa2Uoc3JjKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gbGlzdFtpXTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtYXBGdW5jID0gb3B0c1swXTtcbiAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzFdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBhcnJheVtpXSA9IG1hcEZ1bmMuY2FsbCh0aGlzQXJnLCBsaXN0W2ldLCBpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZsb2F0MTZBcnJheSlgIG9yIGBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5KWAgaW5jbHVkZSB0aGlzIGtleVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLm9mXG4gICAqL1xuICBzdGF0aWMgb2YoLi4uaXRlbXMpIHtcbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICBpZiAoIVJlZmxlY3QuaGFzKENvbnN0cnVjdG9yLCBicmFuZCkpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcihcIlRoaXMgY29uc3RydWN0b3IgaXMgbm90IGEgc3ViY2xhc3Mgb2YgRmxvYXQxNkFycmF5XCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDtcblxuICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICBpZiAoQ29uc3RydWN0b3IgPT09IEZsb2F0MTZBcnJheSkge1xuICAgICAgY29uc3QgcHJveHkgPSBuZXcgRmxvYXQxNkFycmF5KGxlbmd0aCk7XG4gICAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShwcm94eSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZmxvYXQxNmJpdHNBcnJheVtpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhpdGVtc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm94eTtcbiAgICB9XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgYXJyYXlbaV0gPSBpdGVtc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUua2V5cyAqL1xuICBrZXlzKCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgIHJldHVybiBSZWZsZWN0LmFwcGx5KFR5cGVkQXJyYXlQcm90b3R5cGUua2V5cywgZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKSwgW10pO1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IHJldHVybnMgYSBvYmplY3Qgd2hvc2UgcHJvdG90eXBlIGlzIG5vdCBgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlYFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS52YWx1ZXNcbiAgICovXG4gIHZhbHVlcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheUl0ZXJhdG9yID0gUmVmbGVjdC5hcHBseShUeXBlZEFycmF5UHJvdG90eXBlLnZhbHVlcywgZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKSwgW10pO1xuICAgIHJldHVybiB3cmFwSW5BcnJheUl0ZXJhdG9yKChmdW5jdGlvbiogKCkge1xuICAgICAgZm9yIChjb25zdCB2YWwgb2YgYXJyYXlJdGVyYXRvcikge1xuICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiByZXR1cm5zIGEgb2JqZWN0IHdob3NlIHByb3RvdHlwZSBpcyBub3QgYCVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJWBcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZW50cmllc1xuICAgKi9cbiAgZW50cmllcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheUl0ZXJhdG9yID0gUmVmbGVjdC5hcHBseShUeXBlZEFycmF5UHJvdG90eXBlLmVudHJpZXMsIGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyksIFtdKTtcbiAgICByZXR1cm4gd3JhcEluQXJyYXlJdGVyYXRvcigoZnVuY3Rpb24qICgpIHtcbiAgICAgIGZvciAoY29uc3QgW2ksIHZhbF0gb2YgYXJyYXlJdGVyYXRvcikge1xuICAgICAgICB5aWVsZCBbaSwgY29udmVydFRvTnVtYmVyKHZhbCldO1xuICAgICAgfVxuICAgIH0pKCkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmF0ICovXG4gIGF0KGluZGV4KSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBmbG9hdDE2Yml0c0FycmF5Lmxlbmd0aDtcbiAgICBjb25zdCByZWxhdGl2ZUluZGV4ID0gVG9JbnRlZ2VyT3JJbmZpbml0eShpbmRleCk7XG4gICAgY29uc3QgayA9IHJlbGF0aXZlSW5kZXggPj0gMCA/IHJlbGF0aXZlSW5kZXggOiBsZW5ndGggKyByZWxhdGl2ZUluZGV4O1xuXG4gICAgaWYgKGsgPCAwIHx8IGsgPj0gbGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2tdKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5tYXAgKi9cbiAgbWFwKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBmbG9hdDE2Yml0c0FycmF5Lmxlbmd0aDtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IHByb3h5ID0gbmV3IEZsb2F0MTZBcnJheShsZW5ndGgpO1xuICAgICAgY29uc3QgYXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHByb3h5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCB2YWwgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gICAgICAgIGFycmF5W2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsLCBpLCB0aGlzKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm94eTtcbiAgICB9XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGFycmF5W2ldID0gY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWwsIGksIHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maWx0ZXIgKi9cbiAgZmlsdGVyKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBmbG9hdDE2Yml0c0FycmF5Lmxlbmd0aDtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGNvbnN0IGtlcHQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCB2YWwgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWwsIGksIHRoaXMpKSB7XG4gICAgICAgIGtlcHQucHVzaCh2YWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3Ioa2VwdCk7XG4gICAgYXNzZXJ0U3BlY2llc1R5cGVkQXJyYXkoYXJyYXkpO1xuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJlZHVjZSAqL1xuICByZWR1Y2UoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IGZsb2F0MTZiaXRzQXJyYXkubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggPT09IDAgJiYgb3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcihcIlJlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWVcIik7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbMF0pO1xuICAgICAgc3RhcnQgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soYWNjdW11bGF0b3IsIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSwgaSwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJlZHVjZXJpZ2h0ICovXG4gIHJlZHVjZVJpZ2h0KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBmbG9hdDE2Yml0c0FycmF5Lmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoXCJSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlXCIpO1xuICAgIH1cblxuICAgIGxldCBhY2N1bXVsYXRvciwgc3RhcnQ7XG4gICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2xlbmd0aCAtIDFdKTtcbiAgICAgIHN0YXJ0ID0gbGVuZ3RoIC0gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgYWNjdW11bGF0b3IgPSBvcHRzWzBdO1xuICAgICAgc3RhcnQgPSBsZW5ndGggLSAxO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soYWNjdW11bGF0b3IsIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSwgaSwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZvcmVhY2ggKi9cbiAgZm9yRWFjaChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gZmxvYXQxNmJpdHNBcnJheS5sZW5ndGg7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSwgaSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbmQgKi9cbiAgZmluZChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gZmxvYXQxNmJpdHNBcnJheS5sZW5ndGg7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpLCB0aGlzKSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbmRpbmRleCAqL1xuICBmaW5kSW5kZXgoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IGZsb2F0MTZiaXRzQXJyYXkubGVuZ3RoO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgdGhpcykpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLWFycmF5LWZpbmQtZnJvbS1sYXN0L2luZGV4Lmh0bWwjc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZGxhc3QgKi9cbiAgZmluZExhc3QoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IGZsb2F0MTZiaXRzQXJyYXkubGVuZ3RoO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpLCB0aGlzKSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLWFycmF5LWZpbmQtZnJvbS1sYXN0L2luZGV4Lmh0bWwjc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZGxhc3RpbmRleCAqL1xuICBmaW5kTGFzdEluZGV4KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBmbG9hdDE2Yml0c0FycmF5Lmxlbmd0aDtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSBsZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgdGhpcykpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmV2ZXJ5ICovXG4gIGV2ZXJ5KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBmbG9hdDE2Yml0c0FycmF5Lmxlbmd0aDtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmICghY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksIGksIHRoaXMpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb21lICovXG4gIHNvbWUoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IGZsb2F0MTZiaXRzQXJyYXkubGVuZ3RoO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pLCBpLCB0aGlzKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc2V0ICovXG4gIHNldChpbnB1dCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IHRhcmdldE9mZnNldCA9IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSk7XG4gICAgaWYgKHRhcmdldE9mZnNldCA8IDApIHtcbiAgICAgIHRocm93IFJhbmdlRXJyb3IoXCJvZmZzZXQgaXMgb3V0IG9mIGJvdW5kc1wiKTtcbiAgICB9XG5cbiAgICBpZiAoaXNCaWdJbnRUeXBlZEFycmF5KGlucHV0KSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBtaXggQmlnSW50IGFuZCBvdGhlciB0eXBlcywgdXNlIGV4cGxpY2l0IGNvbnZlcnNpb25zXCIpO1xuICAgIH1cblxuICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICBpZiAoaXNGbG9hdDE2QXJyYXkoaW5wdXQpKSB7XG4gICAgICAvLyBwZWVsIG9mZiBQcm94eVxuICAgICAgcmV0dXJuIFJlZmxlY3QuYXBwbHkoVHlwZWRBcnJheVByb3RvdHlwZS5zZXQsIGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyksIFtcbiAgICAgICAgZ2V0RmxvYXQxNkJpdHNBcnJheShpbnB1dCksXG4gICAgICAgIHRhcmdldE9mZnNldCxcbiAgICAgIF0pO1xuICAgIH1cblxuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGFyZ2V0TGVuZ3RoID0gZmxvYXQxNmJpdHNBcnJheS5sZW5ndGg7XG5cbiAgICBjb25zdCBzcmMgPSBPYmplY3QoaW5wdXQpO1xuICAgIGNvbnN0IHNyY0xlbmd0aCA9IExlbmd0aE9mQXJyYXlMaWtlKHNyYyk7XG5cbiAgICBpZiAodGFyZ2V0T2Zmc2V0ID09PSBJbmZpbml0eSB8fCBzcmNMZW5ndGggKyB0YXJnZXRPZmZzZXQgPiB0YXJnZXRMZW5ndGgpIHtcbiAgICAgIHRocm93IFJhbmdlRXJyb3IoXCJvZmZzZXQgaXMgb3V0IG9mIGJvdW5kc1wiKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNyY0xlbmd0aDsgKytpKSB7XG4gICAgICBmbG9hdDE2Yml0c0FycmF5W2kgKyB0YXJnZXRPZmZzZXRdID0gcm91bmRUb0Zsb2F0MTZCaXRzKHNyY1tpXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJldmVyc2UgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICBSZWZsZWN0LmFwcGx5KFR5cGVkQXJyYXlQcm90b3R5cGUucmV2ZXJzZSwgZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKSwgW10pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmlsbCAqL1xuICBmaWxsKHZhbHVlLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgUmVmbGVjdC5hcHBseShUeXBlZEFycmF5UHJvdG90eXBlLmZpbGwsIGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyksIFtyb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpLCAuLi5vcHRzXSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5jb3B5d2l0aGluICovXG4gIGNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgIFJlZmxlY3QuYXBwbHkoVHlwZWRBcnJheVByb3RvdHlwZS5jb3B5V2l0aGluLCBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpLCBbdGFyZ2V0LCBzdGFydCwgLi4ub3B0c10pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc29ydCAqL1xuICBzb3J0KC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBjb21wYXJlID0gb3B0c1swXSAhPT0gdW5kZWZpbmVkID8gb3B0c1swXSA6IGRlZmF1bHRDb21wYXJlO1xuICAgIFJlZmxlY3QuYXBwbHkoVHlwZWRBcnJheVByb3RvdHlwZS5zb3J0LCBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpLCBbKHgsIHkpID0+IHsgcmV0dXJuIGNvbXBhcmUoY29udmVydFRvTnVtYmVyKHgpLCBjb252ZXJ0VG9OdW1iZXIoeSkpOyB9XSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zbGljZSAqL1xuICBzbGljZSguLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCB1aW50MTYgPSBuZXcgVWludDE2QXJyYXkoZmxvYXQxNmJpdHNBcnJheS5idWZmZXIsIGZsb2F0MTZiaXRzQXJyYXkuYnl0ZU9mZnNldCwgZmxvYXQxNmJpdHNBcnJheS5sZW5ndGgpO1xuICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkodWludDE2LnNsaWNlKC4uLm9wdHMpLmJ1ZmZlcik7XG4gICAgfVxuXG4gICAgY29uc3QgbGVuZ3RoID0gZmxvYXQxNmJpdHNBcnJheS5sZW5ndGg7XG4gICAgY29uc3Qgc3RhcnQgPSBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pO1xuICAgIGNvbnN0IGVuZCA9IG9wdHNbMV0gPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1sxXSk7XG5cbiAgICBsZXQgaztcbiAgICBpZiAoc3RhcnQgPT09IC1JbmZpbml0eSkge1xuICAgICAgayA9IDA7XG4gICAgfSBlbHNlIGlmIChzdGFydCA8IDApIHtcbiAgICAgIGsgPSBsZW5ndGggKyBzdGFydCA+IDAgPyBsZW5ndGggKyBzdGFydCA6IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGsgPSBsZW5ndGggPCBzdGFydCA/IGxlbmd0aCA6IHN0YXJ0O1xuICAgIH1cblxuICAgIGxldCBmaW5hbDtcbiAgICBpZiAoZW5kID09PSAtSW5maW5pdHkpIHtcbiAgICAgIGZpbmFsID0gMDtcbiAgICB9IGVsc2UgaWYgKGVuZCA8IDApIHtcbiAgICAgIGZpbmFsID0gbGVuZ3RoICsgZW5kID4gMCA/IGxlbmd0aCArIGVuZCA6IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbmFsID0gbGVuZ3RoIDwgZW5kID8gbGVuZ3RoIDogZW5kO1xuICAgIH1cblxuICAgIGNvbnN0IGNvdW50ID0gZmluYWwgLSBrID4gMCA/IGZpbmFsIC0gayA6IDA7XG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IoY291bnQpO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5KTtcblxuICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cblxuICAgIGxldCBuID0gMDtcbiAgICB3aGlsZSAoayA8IGZpbmFsKSB7XG4gICAgICBhcnJheVtuXSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2tdKTtcbiAgICAgICsraztcbiAgICAgICsrbjtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc3ViYXJyYXkgKi9cbiAgc3ViYXJyYXkoLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdWludDE2ID0gbmV3IFVpbnQxNkFycmF5KGZsb2F0MTZiaXRzQXJyYXkuYnVmZmVyLCBmbG9hdDE2Yml0c0FycmF5LmJ5dGVPZmZzZXQsIGZsb2F0MTZiaXRzQXJyYXkubGVuZ3RoKTtcbiAgICBjb25zdCBzdWJhcnJheSA9IHVpbnQxNi5zdWJhcnJheSguLi5vcHRzKTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3Ioc3ViYXJyYXkuYnVmZmVyLCBzdWJhcnJheS5ieXRlT2Zmc2V0LCBzdWJhcnJheS5sZW5ndGgpO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5KTtcblxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5pbmRleG9mICovXG4gIGluZGV4T2YoZWxlbWVudCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gZmxvYXQxNmJpdHNBcnJheS5sZW5ndGg7XG5cbiAgICBsZXQgZnJvbSA9IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSk7XG4gICAgaWYgKGZyb20gPT09IEluZmluaXR5KSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICBmcm9tID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoaGFzT3duKGZsb2F0MTZiaXRzQXJyYXksIGkpICYmIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUubGFzdGluZGV4b2YgKi9cbiAgbGFzdEluZGV4T2YoZWxlbWVudCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gZmxvYXQxNmJpdHNBcnJheS5sZW5ndGg7XG5cbiAgICBsZXQgZnJvbSA9IG9wdHMubGVuZ3RoID49IDEgPyBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pIDogbGVuZ3RoIC0gMTtcbiAgICBpZiAoZnJvbSA9PT0gLUluZmluaXR5KSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKGZyb20gPj0gMCkge1xuICAgICAgZnJvbSA9IGZyb20gPCBsZW5ndGggLSAxID8gZnJvbSA6IGxlbmd0aCAtIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBmcm9tOyBpID49IDA7IC0taSkge1xuICAgICAgaWYgKGhhc093bihmbG9hdDE2Yml0c0FycmF5LCBpKSAmJiBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSkgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmluY2x1ZGVzICovXG4gIGluY2x1ZGVzKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IGZsb2F0MTZiaXRzQXJyYXkubGVuZ3RoO1xuXG4gICAgbGV0IGZyb20gPSBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pO1xuICAgIGlmIChmcm9tID09PSBJbmZpbml0eSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgZnJvbSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaXNOYU4gPSBOdW1iZXIuaXNOYU4oZWxlbWVudCk7XG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG5cbiAgICAgIGlmIChpc05hTiAmJiBOdW1iZXIuaXNOYU4odmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmpvaW4gKi9cbiAgam9pbiguLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG4gICAgY29uc3QgYXJyYXkgPSBjb3B5VG9BcnJheShmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIHJldHVybiBhcnJheS5qb2luKC4uLm9wdHMpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnRvbG9jYWxlc3RyaW5nICovXG4gIHRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcbiAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgcmV0dXJuIGFycmF5LnRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1nZXQtJXR5cGVkYXJyYXklLnByb3RvdHlwZS1AQHRvc3RyaW5ndGFnICovXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcbiAgICBpZiAoaXNGbG9hdDE2Qml0c0FycmF5KHRoaXMpKSB7XG4gICAgICByZXR1cm4gXCJGbG9hdDE2QXJyYXlcIjtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10eXBlZGFycmF5LmJ5dGVzX3Blcl9lbGVtZW50ICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5LCBcIkJZVEVTX1BFUl9FTEVNRU5UXCIsIHsgdmFsdWU6IFVpbnQxNkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UIH0pO1xuXG4vKiogbGltaXRhdGlvbjogSXQgaXMgcGVha2VkIGJ5IGBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKEZsb2F0MTZBcnJheSlgIGFuZCBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5LCBicmFuZCwge30pO1xuXG5jb25zdCBGbG9hdDE2QXJyYXlQcm90b3R5cGUgPSBGbG9hdDE2QXJyYXkucHJvdG90eXBlO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUtQEBpdGVyYXRvciAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheVByb3RvdHlwZSwgU3ltYm9sLml0ZXJhdG9yLCB7XG4gIHZhbHVlOiBGbG9hdDE2QXJyYXlQcm90b3R5cGUudmFsdWVzLFxuICB3cml0YWJsZTogdHJ1ZSxcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxufSk7XG4iLCJpbXBvcnQgeyBjb252ZXJ0VG9OdW1iZXIsIHJvdW5kVG9GbG9hdDE2Qml0cyB9IGZyb20gXCIuL19jb252ZXJ0ZXIubWpzXCI7XG5pbXBvcnQgeyBpc0RhdGFWaWV3IH0gZnJvbSBcIi4vX3V0aWwvaXMubWpzXCI7XG5cbi8qKlxuICogcmV0dXJucyBhbiB1bnNpZ25lZCAxNi1iaXQgZmxvYXQgYXQgdGhlIHNwZWNpZmllZCBieXRlIG9mZnNldCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgRGF0YVZpZXcuXG4gKlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge1tib29sZWFuXX0gb3B0c1xuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZsb2F0MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIC4uLm9wdHMpIHtcbiAgaWYgKCFpc0RhdGFWaWV3KGRhdGFWaWV3KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGaXJzdCBhcmd1bWVudCB0byBnZXRGbG9hdDE2IGZ1bmN0aW9uIG11c3QgYmUgYSBEYXRhVmlld1wiKTtcbiAgfVxuXG4gIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoIGRhdGFWaWV3LmdldFVpbnQxNihieXRlT2Zmc2V0LCAuLi5vcHRzKSApO1xufVxuXG4vKipcbiAqIHN0b3JlcyBhbiB1bnNpZ25lZCAxNi1iaXQgZmxvYXQgdmFsdWUgYXQgdGhlIHNwZWNpZmllZCBieXRlIG9mZnNldCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgRGF0YVZpZXcuXG4gKlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCB2YWx1ZSwgLi4ub3B0cykge1xuICBpZiAoIWlzRGF0YVZpZXcoZGF0YVZpZXcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZpcnN0IGFyZ3VtZW50IHRvIHNldEZsb2F0MTYgZnVuY3Rpb24gbXVzdCBiZSBhIERhdGFWaWV3XCIpO1xuICB9XG5cbiAgZGF0YVZpZXcuc2V0VWludDE2KGJ5dGVPZmZzZXQsIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSksIC4uLm9wdHMpO1xufVxuIl0sIm5hbWVzIjpbIl8iXSwibWFwcGluZ3MiOiI7Ozs7O0VBQUE7QUFDQTtFQUNBLE1BQU0sTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2xDLE1BQU0sU0FBUyxHQUFHLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzNDLE1BQU0sVUFBVSxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDO0VBQ0EsTUFBTSxTQUFTLEdBQUcsSUFBSSxX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RyxHQUFHLENBQUM7RUFDakIsTUFBTSxNQUFNLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDdEMsS0FBSztBQUNMO0VBQ0EsSUFBSSxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQztFQUNBLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtFQUMzQixNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDdkMsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzNCLE9BQU87QUFDUDtFQUNBLEtBQUssTUFBTTtFQUNYLE1BQU0sTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzlCLE1BQU0sTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzlCLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUN2QyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDckQsT0FBTztFQUNQLEtBQUs7QUFDTDtFQUNBLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztBQUNIO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUU7RUFDdEIsSUFBSSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDN0I7RUFDQSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsRUFBRTtFQUMxQyxNQUFNLE1BQU0sU0FBUyxDQUFDLG9E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
