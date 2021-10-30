/*! @petamoriken/float16 v3.5.4-12-gc43754d | MIT License - https://git.io/float16 */

const float16 = (function (exports) {
  'use strict';

  /* eslint-disable no-restricted-globals */
  /* global SharedArrayBuffer */

  /** @type {(target: Function) => (thisArg: any, ...args: any[]) => any} */
  function uncurryThis(target) {
    return (thisArg, ...args) => {
      return ReflectApply(target, thisArg, args);
    };
  }

  /** @type {(target: any, key: string | symbol) => (thisArg: any, ...args: any[]) => any} */
  function uncurryThisGetter(target, key) {
    return uncurryThis(
      ReflectGetOwnPropertyDescriptor(
        target,
        key
      ).get
    );
  }

  // Reflect
  const {
    apply: ReflectApply,
    construct: ReflectConstruct,
    defineProperty: ReflectDefineProperty,
    get: ReflectGet,
    getOwnPropertyDescriptor: ReflectGetOwnPropertyDescriptor,
    getPrototypeOf: ReflectGetPrototypeOf,
    has: ReflectHas,
    ownKeys: ReflectOwnKeys,
    set: ReflectSet,
    setPrototypeOf: ReflectSetPrototypeOf,
  } = Reflect;

  // Proxy
  const NativeProxy = Proxy;

  // Number
  const NativeNumber = Number;
  const {
    isFinite: NumberIsFinite,
    isNaN: NumberIsNaN,
  } = NativeNumber;

  // Symbol
  const {
    iterator: SymbolIterator,
    species: SymbolSpecies,
    toStringTag: SymbolToStringTag,
    for: SymbolFor,
  } = Symbol;

  // Array
  const NativeArray = Array;
  const ArrayIsArray = NativeArray.isArray;
  const ArrayPrototype = NativeArray.prototype;
  /** @type {(array: Array<unknown>, separator?: string) => string} */
  const ArrayPrototypeJoin = uncurryThis(ArrayPrototype.join);
  /** @type {<T>(array: Array<T>, ...items: T[]) => number} */
  const ArrayPrototypePush = uncurryThis(ArrayPrototype.push);
  /** @type {(array: Array<unknown>) => string} */
  const ArrayPrototypeToLocaleString = uncurryThis(
    ArrayPrototype.toLocaleString
  );

  // Object
  const NativeObject = Object;
  const {
    create: ObjectCreate,
    defineProperty: ObjectDefineProperty,
    freeze: ObjectFreeze,
    is: ObjectIs,
  } = NativeObject;
  /** @type {(object: object, key: PropertyKey) => boolean} */
  const ObjectHasOwn = /** @type {any} */ (NativeObject).hasOwn ||
    uncurryThis(NativeObject.prototype.hasOwnProperty);

  // Math
  const MathTrunc = Math.trunc;

  // ArrayBuffer
  const NativeArrayBuffer = ArrayBuffer;
  const ArrayBufferIsView = NativeArrayBuffer.isView;
  /** @type {(buffer: ArrayBuffer, begin?: number, end?: number) => number} */
  const ArrayBufferPrototypeSlice = uncurryThis(NativeArrayBuffer.prototype.slice);
  /** @type {(buffer: ArrayBuffer) => ArrayBuffer} */
  const ArrayBufferPrototypeGetByteLength = uncurryThisGetter(NativeArrayBuffer.prototype, "byteLength");

  // SharedArrayBuffer
  const NativeSharedArrayBuffer = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : null;
  /** @type {(buffer: SharedArrayBuffer, begin?: number, end?: number) => number} */
  const SharedArrayBufferPrototypeSlice = NativeSharedArrayBuffer
    && uncurryThis(NativeSharedArrayBuffer.prototype.slice);
  /** @type {(buffer: SharedArrayBuffer) => SharedArrayBuffer} */
  const SharedArrayBufferPrototypeGetByteLength = NativeSharedArrayBuffer
    && uncurryThisGetter(NativeSharedArrayBuffer.prototype, "byteLength");

  // TypedArray
  /** @typedef {Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float32Array|Float64Array|BigUint64Array|BigInt64Array} TypedArray */
  /** @type {any} */
  const TypedArray = ReflectGetPrototypeOf(Uint8Array);
  const TypedArrayFrom = TypedArray.from;
  const TypedArrayPrototype = TypedArray.prototype;
  /** @type {(typedArray: TypedArray) => IterableIterator<number>} */
  const TypedArrayPrototypeKeys = uncurryThis(TypedArrayPrototype.keys);
  /** @type {(typedArray: TypedArray) => IterableIterator<number>} */
  const TypedArrayPrototypeValues = uncurryThis(
    TypedArrayPrototype.values
  );
  /** @type {(typedArray: TypedArray) => IterableIterator<[number, number]>} */
  const TypedArrayPrototypeEntries = uncurryThis(
    TypedArrayPrototype.entries
  );
  /** @type {(typedArray: TypedArray, array: ArrayLike<number>, offset?: number) => void} */
  const TypedArrayPrototypeSet = uncurryThis(TypedArrayPrototype.set);
  /** @type {<T extends TypedArray>(typedArray: T) => T} */
  const TypedArrayPrototypeReverse = uncurryThis(
    TypedArrayPrototype.reverse
  );
  /** @type {<T extends TypedArray>(typedArray: T, value: number, start?: number, end?: number) => T} */
  const TypedArrayPrototypeFill = uncurryThis(TypedArrayPrototype.fill);
  /** @type {<T extends TypedArray>(typedArray: T, target: number, start: number, end?: number) => T} */
  const TypedArrayPrototypeCopyWithin = uncurryThis(
    TypedArrayPrototype.copyWithin
  );
  /** @type {<T extends TypedArray>(typedArray: T, compareFn?: (a: number, b: number) => number) => T} */
  const TypedArrayPrototypeSort = uncurryThis(TypedArrayPrototype.sort);
  /** @type {<T extends TypedArray>(typedArray: T, start?: number, end?: number) => T} */
  const TypedArrayPrototypeSlice = uncurryThis(TypedArrayPrototype.slice);
  /** @type {<T extends TypedArray>(typedArray: T, start?: number, end?: number) => T} */
  const TypedArrayPrototypeSubarray = uncurryThis(
    TypedArrayPrototype.subarray
  );
  /** @type {((typedArray: TypedArray) => ArrayBuffer)} */
  const TypedArrayPrototypeGetBuffer = uncurryThisGetter(
    TypedArrayPrototype,
    "buffer"
  );
  /** @type {((typedArray: TypedArray) => number)} */
  const TypedArrayPrototypeGetByteOffset = uncurryThisGetter(
    TypedArrayPrototype,
    "byteOffset"
  );
  /** @type {((typedArray: TypedArray) => number)} */
  const TypedArrayPrototypeGetLength = uncurryThisGetter(
    TypedArrayPrototype,
    "length"
  );
  /** @type {(target: unknown) => string} */
  const TypedArrayPrototypeGetSymbolToStringTag = uncurryThisGetter(
    TypedArrayPrototype,
    SymbolToStringTag
  );

  // Uint16Array
  const NativeUint16Array = Uint16Array;
  /** @type {Uint16ArrayConstructor["from"]} */
  const Uint16ArrayFrom = (...args) => {
    return ReflectApply(TypedArrayFrom, NativeUint16Array, args);
  };

  // Uint32Array
  const NativeUint32Array = Uint32Array;

  // Float32Array
  const NativeFloat32Array = Float32Array;

  // Iterator
  const IteratorPrototype = ReflectGetPrototypeOf(
    ReflectGetPrototypeOf([][SymbolIterator]())
  );

  // Generator
  /** @type {<T = unknown, TReturn = any, TNext = unknown>(generator: Generator<T, TReturn, TNext>, value?: TNext) => T} */
  const GeneratorPrototypeNext = uncurryThis((function* () {})().next);

  // DataView
  const DataViewPrototype = DataView.prototype;
  /** @type {(dataView: DataView, byteOffset: number, littleEndian?: boolean) => number} */
  const DataViewPrototypeGetUint16 = uncurryThis(
    DataViewPrototype.getUint16
  );
  /** @type {(dataView: DataView, byteOffset: number, value: number, littleEndian?: boolean) => void} */
  const DataViewPrototypeSetUint16 = uncurryThis(
    DataViewPrototype.setUint16
  );

  // Error
  const NativeTypeError = TypeError;
  const NativeRangeError = RangeError;

  // Set
  /**
   * Do not construct with arguments to avoid calling the "add" method
   *
   * @type {{new <T = any>(): Set<T>}}
   */
  const NativeSet = Set;
  const SetPrototype = NativeSet.prototype;
  /** @type {<T>(set: Set<T>, value: T) => Set<T>} */
  const SetPrototypeAdd = uncurryThis(SetPrototype.add);
  /** @type {<T>(set: Set<T>, value: T) => boolean} */
  const SetPrototypeHas = uncurryThis(SetPrototype.has);

  // WeakMap
  /**
   * Do not construct with arguments to avoid calling the "set" method
   *
   * @type {{new <K extends {}, V>(): WeakMap<K, V>}}
   */
  const NativeWeakMap = WeakMap;
  const WeakMapPrototype = NativeWeakMap.prototype;
  /** @type {<K extends {}, V>(weakMap: WeakMap<K, V>, key: K) => V} */
  const WeakMapPrototypeGet = uncurryThis(WeakMapPrototype.get);
  /** @type {<K extends {}, V>(weakMap: WeakMap<K, V>, key: K) => boolean} */
  const WeakMapPrototypeHas = uncurryThis(WeakMapPrototype.has);
  /** @type {<K extends {}, V>(weakMap: WeakMap<K, V>, key: K, value: V) => WeakMap} */
  const WeakMapPrototypeSet = uncurryThis(WeakMapPrototype.set);

  // algorithm: http://fox-toolkit.org/ftp/fasthalffloatconversion.pdf

  const buffer = new NativeArrayBuffer(4);
  const floatView = new NativeFloat32Array(buffer);
  const uint32View = new NativeUint32Array(buffer);

  const baseTable = new NativeUint32Array(512);
  const shiftTable = new NativeUint32Array(512);

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
   * @param {unknown} num - double float
   * @returns {number} half float number bits
   */
  function roundToFloat16Bits(num) {
    floatView[0] = /** @type {any} */ (num);
    const f = uint32View[0];
    const e = (f >> 23) & 0x1ff;
    return baseTable[e] + ((f & 0x007fffff) >> shiftTable[e]);
  }

  const mantissaTable = new NativeUint32Array(2048);
  const exponentTable = new NativeUint32Array(64);
  const offsetTable = new NativeUint32Array(64);

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

  const CONSTRUCTOR_IS_NOT_A_OBJECT = "Constructor is not a object";
  const THIS_IS_NOT_A_OBJECT = "This is not a object";
  const THIS_IS_NOT_A_FLOAT16ARRAY = "This is not a Float16Array";
  const THIS_CONSTRUCTOR_IS_NOT_A_SUBCLASS_OF_FLOAT16ARRAY =
    "This constructor is not a subclass of Float16Array";
  const SPECIESCONSTRUCTOR_DIDNT_RETURN_TYPEDARRAY =
    "SpeciesConstructor didn't return TypedArray";
  const DERIVED_TYPEDARRAY_CONSTRUCTOR_CREATED_AN_ARRAY_WHICH_WAS_TOO_SMALL =
    "Derived TypedArray constructor created an array which was too small";
  const THIS_BUFFER_HAS_ALREADY_BEEN_DETACHED = "This buffer has already been detached";
  const CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT =
    "Cannot convert undefined or null to object";
  const CANNOT_CONVERT_A_BIGINT_VALUE_TO_A_NUMBER =
    "Cannot convert a BigInt value to a number";
  const CANNOT_MIX_BIGINT_AND_OTHER_TYPES =
    "Cannot mix BigInt and other types, use explicit conversions";
  const REDUCE_OF_EMPTY_ARRAY_WITH_NO_INITIAL_VALUE =
    "Reduce of empty array with no initial value";
  const OFFSET_IS_OUT_OF_BOUNDS = "Offset is out of bounds";

  /**
   * returns the nearest half-precision float representation of a number.
   *
   * @param {number} num
   * @returns {number}
   */
  function hfround(num) {
    if (typeof num === "bigint") {
      throw NativeTypeError(CANNOT_CONVERT_A_BIGINT_VALUE_TO_A_NUMBER);
    }

    num = NativeNumber(num);

    // for optimization
    if (!NumberIsFinite(num) || num === 0) {
      return num;
    }

    const x16 = roundToFloat16Bits(num);
    return convertToNumber(x16);
  }

  /** @type {WeakMap<{}, Generator<any>>} */
  const generators = new NativeWeakMap();

  /** @see https://tc39.es/ecma262/#sec-%arrayiteratorprototype%-object */
  const ArrayIteratorPrototype = ObjectCreate(IteratorPrototype, {
    next: {
      value: function next() {
        const generator = WeakMapPrototypeGet(generators, this);
        return GeneratorPrototypeNext(generator);
      },
      writable: true,
      configurable: true,
    },

    [SymbolToStringTag]: {
      value: "Array Iterator",
      configurable: true,
    },
  });

  /** @type {<T>(generator: Generator<T>) => IterableIterator<T>} */
  function wrapInArrayIterator(generator) {
    const arrayIterator = ObjectCreate(ArrayIteratorPrototype);
    WeakMapPrototypeSet(generators, arrayIterator, generator);
    return arrayIterator;
  }

  /**
   * @param {unknown} value
   * @returns {value is {}}
   */
  function isObject(value) {
    return (value !== null && typeof value === "object") ||
      typeof value === "function";
  }

  /**
   * @param {unknown} value
   * @returns {value is {}}
   */
  function isObjectLike(value) {
    return value !== null && typeof value === "object";
  }

  // Inspired by util.types implementation of Node.js
  /** @typedef {Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float32Array|Float64Array|BigUint64Array|BigInt64Array} TypedArray */

  /**
   * @param {unknown} value
   * @returns {value is TypedArray}
   */
  function isTypedArray(value) {
    return TypedArrayPrototypeGetSymbolToStringTag(value) !== undefined;
  }

  /**
   * @param {unknown} value
   * @returns {value is BigInt64Array|BigUint64Array}
   */
  function isBigIntTypedArray(value) {
    const typedArrayName = TypedArrayPrototypeGetSymbolToStringTag(value);
    return typedArrayName === "BigInt64Array" ||
      typedArrayName === "BigUint64Array";
  }

  /**
   * @param {unknown} value
   * @returns {value is ArrayBuffer}
   */
  function isArrayBuffer(value) {
    try {
      ArrayBufferPrototypeGetByteLength(/** @type {any} */ (value));
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @param {unknown} value
   * @returns {value is SharedArrayBuffer}
   */
  function isSharedArrayBuffer(value) {
    if (NativeSharedArrayBuffer === null) {
      return false;
    }

    try {
      SharedArrayBufferPrototypeGetByteLength(/** @type {any} */ (value));
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @param {unknown} value
   * @throws {TypeError}
   * @returns {value is Iterable<unknown>}
   */
  function isIterable(value) {
    return typeof value[SymbolIterator] === "function";
  }

  /**
   * @param {unknown} value
   * @returns {value is unknown[]}
   */
  function isOrdinaryArray(value) {
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
  function isOrdinaryTypedArray(value) {
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
  function isCanonicalIntegerIndexString(value) {
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

  /**
   * @see https://tc39.es/ecma262/#sec-tointegerorinfinity
   * @param {unknown} target
   * @returns {number}
   */
  function ToIntegerOrInfinity(target) {
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
  function LengthOfArrayLike(arrayLike) {
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
  function SpeciesConstructor(target, defaultConstructor) {
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
   * @see https://tc39.es/ecma262/#sec-isdetachedbuffer
   * @param {ArrayBufferLike} buffer
   * @returns {boolean}
   */
  function IsDetachedBuffer(buffer) {
    try {
      ArrayBufferPrototypeSlice(buffer, 0, 0);
      return false;
    } catch (e) {/* empty */}

    if (NativeSharedArrayBuffer !== null) {
      try {
        SharedArrayBufferPrototypeSlice(/** @type {SharedArrayBuffer} */ (buffer), 0, 0);
        return false;
      } catch (e) {/* empty */}
    }

    return true;
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
    const isXNaN = NumberIsNaN(x);
    const isYNaN = NumberIsNaN(y);

    if (isXNaN && isYNaN) {
      return 0;
    }

    if (isXNaN) {
      return 1;
    }

    if (isYNaN) {
      return -1;
    }

    if (x < y) {
      return -1;
    }

    if (x > y) {
      return 1;
    }

    if (x === 0 && y === 0) {
      const isXPlusZero = ObjectIs(x, 0);
      const isYPlusZero = ObjectIs(y, 0);

      if (!isXPlusZero && isYPlusZero) {
        return -1;
      }

      if (isXPlusZero && !isYPlusZero) {
        return 1;
      }
    }

    return 0;
  }

  const BYTES_PER_ELEMENT = 2;

  const brand = SymbolFor("__Float16Array__");

  /** @type {WeakMap<Float16Array, Uint16Array & { __float16bits: never }>} */
  const float16bitsArrays = new NativeWeakMap();

  /**
   * @param {unknown} target
   * @throws {TypeError}
   * @returns {boolean}
   */
  function hasFloat16ArrayBrand(target) {
    if (!isObjectLike(target)) {
      return false;
    }

    const prototype = ReflectGetPrototypeOf(target);
    if (!isObjectLike(prototype)) {
      return false;
    }

    const constructor = prototype.constructor;
    if (constructor === undefined) {
      return false;
    }
    if (!isObject(constructor)) {
      throw NativeTypeError(CONSTRUCTOR_IS_NOT_A_OBJECT);
    }

    return ReflectHas(constructor, brand);
  }

  /**
   * @param {unknown} target
   * @returns {target is Float16Array}
   */
  function isFloat16Array(target) {
    return WeakMapPrototypeHas(float16bitsArrays, target) ||
      (hasFloat16ArrayBrand(target) && !ArrayBufferIsView(target));
  }

  /**
   * @param {unknown} target
   * @throws {TypeError}
   * @returns {asserts target is Float16Array}
   */
  function assertFloat16Array(target) {
    if (!isFloat16Array(target)) {
      throw NativeTypeError(THIS_IS_NOT_A_FLOAT16ARRAY);
    }
  }

  /**
   * @param {unknown} target
   * @param {number=} count
   * @throws {TypeError}
   * @returns {asserts target is Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float16Array|Float32Array|Float64Array}
   */
  function assertSpeciesTypedArray(target, count) {
    const isTargetFloat16Array = isFloat16Array(target);
    const isTargetTypedArray = isTypedArray(target);

    if (!isTargetFloat16Array && !isTargetTypedArray) {
      throw NativeTypeError(SPECIESCONSTRUCTOR_DIDNT_RETURN_TYPEDARRAY);
    }

    if (typeof count === "number") {
      let length;
      if (isTargetFloat16Array) {
        const float16bitsArray = getFloat16BitsArray(target);
        length = TypedArrayPrototypeGetLength(float16bitsArray);
      } else {
        length = TypedArrayPrototypeGetLength(target);
      }

      if (length < count) {
        throw NativeTypeError(
          DERIVED_TYPEDARRAY_CONSTRUCTOR_CREATED_AN_ARRAY_WHICH_WAS_TOO_SMALL
        );
      }
    }

    if (isBigIntTypedArray(target)) {
      throw NativeTypeError(CANNOT_MIX_BIGINT_AND_OTHER_TYPES);
    }
  }

  /**
   * @param {Float16Array} float16
   * @throws {TypeError}
   * @returns {Uint16Array & { __float16bits: never }}
   */
  function getFloat16BitsArray(float16) {
    const float16bitsArray = WeakMapPrototypeGet(float16bitsArrays, float16);
    if (float16bitsArray !== undefined) {
      const buffer = TypedArrayPrototypeGetBuffer(float16bitsArray);
      if (IsDetachedBuffer(buffer)) {
        throw NativeTypeError(THIS_BUFFER_HAS_ALREADY_BEEN_DETACHED);
      }
      return float16bitsArray;
    }

    // @ts-ignore
    const buffer = float16.buffer;
    if (IsDetachedBuffer(buffer)) {
      throw NativeTypeError(THIS_BUFFER_HAS_ALREADY_BEEN_DETACHED);
    }

    // from another Float16Array instance (a different version?)
    const cloned = ReflectConstruct(Float16Array, [
      buffer,
      // @ts-ignore
      float16.byteOffset,
      // @ts-ignore
      float16.length,
    ], float16.constructor);
    return WeakMapPrototypeGet(float16bitsArrays, cloned);
  }

  /**
   * @param {Uint16Array & { __float16bits: never }} float16bitsArray
   * @returns {number[]}
   */
  function copyToArray(float16bitsArray) {
    const length = TypedArrayPrototypeGetLength(float16bitsArray);

    const array = [];
    for (let i = 0; i < length; ++i) {
      array[i] = convertToNumber(float16bitsArray[i]);
    }

    return array;
  }

  const TypedArrayPrototypeGetters = new NativeSet();
  for (const key of ReflectOwnKeys(TypedArrayPrototype)) {
    // @@toStringTag method is defined in Float16Array.prototype
    if (key === SymbolToStringTag) {
      continue;
    }

    const descriptor = ReflectGetOwnPropertyDescriptor(TypedArrayPrototype, key);
    if (ObjectHasOwn(descriptor, "get")) {
      SetPrototypeAdd(TypedArrayPrototypeGetters, key);
    }
  }

  const handler = ObjectFreeze(/** @type {ProxyHandler<Float16Array>} */ ({
    get(target, key, receiver) {
      if (isCanonicalIntegerIndexString(key) && ObjectHasOwn(target, key)) {
        return convertToNumber(ReflectGet(target, key));
      }

      // %TypedArray%.prototype getter properties cannot called by Proxy receiver
      if (SetPrototypeHas(TypedArrayPrototypeGetters, key)) {
        return ReflectGet(target, key);
      }

      return ReflectGet(target, key, receiver);
    },

    set(target, key, value, receiver) {
      if (isCanonicalIntegerIndexString(key) && ObjectHasOwn(target, key)) {
        return ReflectSet(target, key, roundToFloat16Bits(value));
      }

      return ReflectSet(target, key, value, receiver);
    },

    getOwnPropertyDescriptor(target, key) {
      if (isCanonicalIntegerIndexString(key) && ObjectHasOwn(target, key)) {
        const descriptor = ReflectGetOwnPropertyDescriptor(target, key);
        descriptor.value = convertToNumber(descriptor.value);
        return descriptor;
      }

      return ReflectGetOwnPropertyDescriptor(target, key);
    },

    defineProperty(target, key, descriptor) {
      if (
        isCanonicalIntegerIndexString(key) &&
        ObjectHasOwn(target, key) &&
        ObjectHasOwn(descriptor, "value")
      ) {
        descriptor.value = roundToFloat16Bits(descriptor.value);
        return ReflectDefineProperty(target, key, descriptor);
      }

      return ReflectDefineProperty(target, key, descriptor);
    },
  }));

  class Float16Array {
    /** @see https://tc39.es/ecma262/#sec-typedarray */
    constructor(input, _byteOffset, _length) {
      /** @type {Uint16Array & { __float16bits: never }} */
      let float16bitsArray;

      if (isFloat16Array(input)) {
        // peel off Proxy
        float16bitsArray = ReflectConstruct(NativeUint16Array, [getFloat16BitsArray(input)], new.target);
      } else if (isObject(input) && !isArrayBuffer(input)) { // object without ArrayBuffer
        /** @type {ArrayLike<unknown>} */
        let list;
        /** @type {number} */
        let length;

        if (isTypedArray(input)) { // TypedArray
          list = input;
          length = TypedArrayPrototypeGetLength(input);

          const buffer = TypedArrayPrototypeGetBuffer(input);
          const BufferConstructor = !isSharedArrayBuffer(buffer)
            ? /** @type {ArrayBufferConstructor} */ (SpeciesConstructor(
              buffer,
              NativeArrayBuffer
            ))
            : NativeArrayBuffer;

          if (IsDetachedBuffer(buffer)) {
            throw NativeTypeError(THIS_BUFFER_HAS_ALREADY_BEEN_DETACHED);
          }

          if (isBigIntTypedArray(input)) {
            throw NativeTypeError(CANNOT_MIX_BIGINT_AND_OTHER_TYPES);
          }

          const data = new BufferConstructor(
            length * BYTES_PER_ELEMENT
          );
          float16bitsArray = ReflectConstruct(NativeUint16Array, [data], new.target);
        } else {
          if (isIterable(input)) { // Iterable (Array)
            // for optimization
            if (isOrdinaryArray(input)) {
              list = input;
              length = input.length;
            } else {
              list = [...input];
              length = list.length;
            }
          } else { // ArrayLike
            list = /** @type {ArrayLike<unknown>} */ (input);
            length = LengthOfArrayLike(input);
          }
          float16bitsArray = ReflectConstruct(NativeUint16Array, [length], new.target);
        }

        // set values
        for (let i = 0; i < length; ++i) {
          float16bitsArray[i] = roundToFloat16Bits(list[i]);
        }
      } else { // primitive, ArrayBuffer
        float16bitsArray = ReflectConstruct(NativeUint16Array, arguments, new.target);
      }

      const proxy = new NativeProxy(/** @type {any} */ (float16bitsArray), handler);

      // proxy private storage
      WeakMapPrototypeSet(float16bitsArrays, proxy, float16bitsArray);

      return proxy;
    }

    /**
     * limitation: `Object.getOwnPropertyNames(Float16Array)` or `Reflect.ownKeys(Float16Array)` include this key
     *
     * @see https://tc39.es/ecma262/#sec-%typedarray%.from
     */
    static from(src, ...opts) {
      const Constructor = this;

      if (!ReflectHas(Constructor, brand)) {
        throw NativeTypeError(
          THIS_CONSTRUCTOR_IS_NOT_A_SUBCLASS_OF_FLOAT16ARRAY
        );
      }

      // for optimization
      if (Constructor === Float16Array) {
        if (isFloat16Array(src) && opts.length === 0) {
          const float16bitsArray = getFloat16BitsArray(src);
          const uint16 = new NativeUint16Array(
            TypedArrayPrototypeGetBuffer(float16bitsArray),
            TypedArrayPrototypeGetByteOffset(float16bitsArray),
            TypedArrayPrototypeGetLength(float16bitsArray)
          );
          return new Float16Array(
            TypedArrayPrototypeGetBuffer(TypedArrayPrototypeSlice(uint16))
          );
        }

        if (opts.length === 0) {
          return new Float16Array(
            TypedArrayPrototypeGetBuffer(
              Uint16ArrayFrom(src, roundToFloat16Bits)
            )
          );
        }

        const mapFunc = opts[0];
        const thisArg = opts[1];

        return new Float16Array(
          TypedArrayPrototypeGetBuffer(
            Uint16ArrayFrom(src, function (val, ...args) {
              return roundToFloat16Bits(
                ReflectApply(mapFunc, this, [val, ...args])
              );
            }, thisArg)
          )
        );
      }

      /** @type {ArrayLike<unknown>} */
      let list;
      /** @type {number} */
      let length;

      if (isIterable(src)) { // Iterable (TypedArray, Array)
        // for optimization
        if (isOrdinaryArray(src)) {
          list = src;
          length = src.length;
        } else if (isOrdinaryTypedArray(src)) {
          list = src;
          length = TypedArrayPrototypeGetLength(src);
        } else {
          list = [...src];
          length = list.length;
        }
      } else { // ArrayLike
        list = src;
        length = LengthOfArrayLike(src);
      }

      const array = new Constructor(length);

      if (opts.length === 0) {
        for (let i = 0; i < length; ++i) {
          array[i] = /** @type {number} */ (list[i]);
        }
      } else {
        const mapFunc = opts[0];
        const thisArg = opts[1];
        for (let i = 0; i < length; ++i) {
          array[i] = ReflectApply(mapFunc, thisArg, [list[i], i]);
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

      if (!ReflectHas(Constructor, brand)) {
        throw NativeTypeError(
          THIS_CONSTRUCTOR_IS_NOT_A_SUBCLASS_OF_FLOAT16ARRAY
        );
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
      const float16bitsArray = getFloat16BitsArray(this);

      return TypedArrayPrototypeKeys(float16bitsArray);
    }

    /**
     * limitation: returns a object whose prototype is not `%ArrayIteratorPrototype%`
     *
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
     */
    values() {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      return wrapInArrayIterator((function* () {
        for (const val of TypedArrayPrototypeValues(float16bitsArray)) {
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
      const float16bitsArray = getFloat16BitsArray(this);

      return (wrapInArrayIterator((function* () {
        for (const [i, val] of TypedArrayPrototypeEntries(float16bitsArray)) {
          yield /** @type {[Number, number]} */ ([i, convertToNumber(val)]);
        }
      })()));
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.at */
    at(index) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const length = TypedArrayPrototypeGetLength(float16bitsArray);
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

      const length = TypedArrayPrototypeGetLength(float16bitsArray);
      const thisArg = opts[0];

      const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);

      // for optimization
      if (Constructor === Float16Array) {
        const proxy = new Float16Array(length);
        const array = getFloat16BitsArray(proxy);

        for (let i = 0; i < length; ++i) {
          const val = convertToNumber(float16bitsArray[i]);
          array[i] = roundToFloat16Bits(
            ReflectApply(callback, thisArg, [val, i, this])
          );
        }

        return proxy;
      }

      const array = new Constructor(length);
      assertSpeciesTypedArray(array, length);

      for (let i = 0; i < length; ++i) {
        const val = convertToNumber(float16bitsArray[i]);
        array[i] = ReflectApply(callback, thisArg, [val, i, this]);
      }

      return /** @type {any} */ (array);
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter */
    filter(callback, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const length = TypedArrayPrototypeGetLength(float16bitsArray);
      const thisArg = opts[0];

      const kept = [];
      for (let i = 0; i < length; ++i) {
        const val = convertToNumber(float16bitsArray[i]);
        if (ReflectApply(callback, thisArg, [val, i, this])) {
          ArrayPrototypePush(kept, val);
        }
      }

      const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);
      const array = new Constructor(kept);
      assertSpeciesTypedArray(array);

      return /** @type {any} */ (array);
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce */
    reduce(callback, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const length = TypedArrayPrototypeGetLength(float16bitsArray);
      if (length === 0 && opts.length === 0) {
        throw NativeTypeError(REDUCE_OF_EMPTY_ARRAY_WITH_NO_INITIAL_VALUE);
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
        accumulator = callback(
          accumulator,
          convertToNumber(float16bitsArray[i]),
          i,
          this
        );
      }

      return accumulator;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright */
    reduceRight(callback, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const length = TypedArrayPrototypeGetLength(float16bitsArray);
      if (length === 0 && opts.length === 0) {
        throw NativeTypeError(REDUCE_OF_EMPTY_ARRAY_WITH_NO_INITIAL_VALUE);
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
        accumulator = callback(
          accumulator,
          convertToNumber(float16bitsArray[i]),
          i,
          this
        );
      }

      return accumulator;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach */
    forEach(callback, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const length = TypedArrayPrototypeGetLength(float16bitsArray);
      const thisArg = opts[0];

      for (let i = 0; i < length; ++i) {
        ReflectApply(callback, thisArg, [
          convertToNumber(float16bitsArray[i]),
          i,
          this,
        ]);
      }
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.find */
    find(callback, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const length = TypedArrayPrototypeGetLength(float16bitsArray);
      const thisArg = opts[0];

      for (let i = 0; i < length; ++i) {
        const value = convertToNumber(float16bitsArray[i]);
        if (ReflectApply(callback, thisArg, [value, i, this])) {
          return value;
        }
      }
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex */
    findIndex(callback, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const length = TypedArrayPrototypeGetLength(float16bitsArray);
      const thisArg = opts[0];

      for (let i = 0; i < length; ++i) {
        const value = convertToNumber(float16bitsArray[i]);
        if (ReflectApply(callback, thisArg, [value, i, this])) {
          return i;
        }
      }

      return -1;
    }

    /** @see https://tc39.es/proposal-array-find-from-last/index.html#sec-%typedarray%.prototype.findlast */
    findLast(callback, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const length = TypedArrayPrototypeGetLength(float16bitsArray);
      const thisArg = opts[0];

      for (let i = length - 1; i >= 0; --i) {
        const value = convertToNumber(float16bitsArray[i]);
        if (ReflectApply(callback, thisArg, [value, i, this])) {
          return value;
        }
      }
    }

    /** @see https://tc39.es/proposal-array-find-from-last/index.html#sec-%typedarray%.prototype.findlastindex */
    findLastIndex(callback, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const length = TypedArrayPrototypeGetLength(float16bitsArray);
      const thisArg = opts[0];

      for (let i = length - 1; i >= 0; --i) {
        const value = convertToNumber(float16bitsArray[i]);
        if (ReflectApply(callback, thisArg, [value, i, this])) {
          return i;
        }
      }

      return -1;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.every */
    every(callback, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const length = TypedArrayPrototypeGetLength(float16bitsArray);
      const thisArg = opts[0];

      for (let i = 0; i < length; ++i) {
        if (
          !ReflectApply(callback, thisArg, [
            convertToNumber(float16bitsArray[i]),
            i,
            this,
          ])
        ) {
          return false;
        }
      }

      return true;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.some */
    some(callback, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const length = TypedArrayPrototypeGetLength(float16bitsArray);
      const thisArg = opts[0];

      for (let i = 0; i < length; ++i) {
        if (
          ReflectApply(callback, thisArg, [
            convertToNumber(float16bitsArray[i]),
            i,
            this,
          ])
        ) {
          return true;
        }
      }

      return false;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.set */
    set(input, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const targetOffset = ToIntegerOrInfinity(opts[0]);
      if (targetOffset < 0) {
        throw NativeRangeError(OFFSET_IS_OUT_OF_BOUNDS);
      }

      if (input == null) {
        throw NativeTypeError(
          CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT
        );
      }

      if (isBigIntTypedArray(input)) {
        throw NativeTypeError(
          CANNOT_MIX_BIGINT_AND_OTHER_TYPES
        );
      }

      // for optimization
      if (isFloat16Array(input)) {
        // peel off Proxy
        return TypedArrayPrototypeSet(
          getFloat16BitsArray(this),
          getFloat16BitsArray(input),
          targetOffset
        );
      }

      if (isTypedArray(input)) {
        const buffer = TypedArrayPrototypeGetBuffer(input);
        if (IsDetachedBuffer(buffer)) {
          throw NativeTypeError(THIS_BUFFER_HAS_ALREADY_BEEN_DETACHED);
        }
      }

      const targetLength = TypedArrayPrototypeGetLength(float16bitsArray);

      const src = NativeObject(input);
      const srcLength = LengthOfArrayLike(src);

      if (targetOffset === Infinity || srcLength + targetOffset > targetLength) {
        throw NativeRangeError(OFFSET_IS_OUT_OF_BOUNDS);
      }

      for (let i = 0; i < srcLength; ++i) {
        float16bitsArray[i + targetOffset] = roundToFloat16Bits(src[i]);
      }
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse */
    reverse() {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      TypedArrayPrototypeReverse(float16bitsArray);

      return this;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill */
    fill(value, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      TypedArrayPrototypeFill(
        float16bitsArray,
        roundToFloat16Bits(value),
        ...opts
      );

      return this;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin */
    copyWithin(target, start, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      TypedArrayPrototypeCopyWithin(float16bitsArray, target, start, ...opts);

      return this;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort */
    sort(...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const compare = opts[0] !== undefined ? opts[0] : defaultCompare;
      TypedArrayPrototypeSort(float16bitsArray, (x, y) => {
        return compare(convertToNumber(x), convertToNumber(y));
      });

      return this;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice */
    slice(...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);

      // for optimization
      if (Constructor === Float16Array) {
        const uint16 = new NativeUint16Array(
          TypedArrayPrototypeGetBuffer(float16bitsArray),
          TypedArrayPrototypeGetByteOffset(float16bitsArray),
          TypedArrayPrototypeGetLength(float16bitsArray)
        );
        return new Float16Array(
          TypedArrayPrototypeGetBuffer(
            TypedArrayPrototypeSlice(uint16, ...opts)
          )
        );
      }

      const length = TypedArrayPrototypeGetLength(float16bitsArray);
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
      assertSpeciesTypedArray(array, count);

      if (count === 0) {
        return array;
      }

      const buffer = TypedArrayPrototypeGetBuffer(float16bitsArray);
      if (IsDetachedBuffer(buffer)) {
        throw NativeTypeError(THIS_BUFFER_HAS_ALREADY_BEEN_DETACHED);
      }

      let n = 0;
      while (k < final) {
        array[n] = convertToNumber(float16bitsArray[k]);
        ++k;
        ++n;
      }

      return /** @type {any} */ (array);
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray */
    subarray(...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);

      const uint16 = new NativeUint16Array(
        TypedArrayPrototypeGetBuffer(float16bitsArray),
        TypedArrayPrototypeGetByteOffset(float16bitsArray),
        TypedArrayPrototypeGetLength(float16bitsArray)
      );
      const uint16Subarray = TypedArrayPrototypeSubarray(uint16, ...opts);

      const array = new Constructor(
        TypedArrayPrototypeGetBuffer(uint16Subarray),
        TypedArrayPrototypeGetByteOffset(uint16Subarray),
        TypedArrayPrototypeGetLength(uint16Subarray)
      );
      assertSpeciesTypedArray(array);

      return /** @type {any} */ (array);
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof */
    indexOf(element, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const length = TypedArrayPrototypeGetLength(float16bitsArray);

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
        if (
          ObjectHasOwn(float16bitsArray, i) &&
          convertToNumber(float16bitsArray[i]) === element
        ) {
          return i;
        }
      }

      return -1;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof */
    lastIndexOf(element, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const length = TypedArrayPrototypeGetLength(float16bitsArray);

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
        if (
          ObjectHasOwn(float16bitsArray, i) &&
          convertToNumber(float16bitsArray[i]) === element
        ) {
          return i;
        }
      }

      return -1;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes */
    includes(element, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const length = TypedArrayPrototypeGetLength(float16bitsArray);

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

      const isNaN = NumberIsNaN(element);
      for (let i = from; i < length; ++i) {
        const value = convertToNumber(float16bitsArray[i]);

        if (isNaN && NumberIsNaN(value)) {
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

      return ArrayPrototypeJoin(array, ...opts);
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring */
    toLocaleString(...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const array = copyToArray(float16bitsArray);

      // @ts-ignore
      return ArrayPrototypeToLocaleString(array, ...opts);
    }

    /** @see https://tc39.es/ecma262/#sec-get-%typedarray%.prototype-@@tostringtag */
    get [SymbolToStringTag]() {
      if (isFloat16Array(this)) {
        return /** @type {any} */ ("Float16Array");
      }
    }
  }

  /** @see https://tc39.es/ecma262/#sec-typedarray.bytes_per_element */
  ObjectDefineProperty(Float16Array, "BYTES_PER_ELEMENT", {
    value: BYTES_PER_ELEMENT,
  });

  // limitation: It is peaked by `Object.getOwnPropertySymbols(Float16Array)` and `Reflect.ownKeys(Float16Array)`
  ObjectDefineProperty(Float16Array, brand, {});

  /** @see https://tc39.es/ecma262/#sec-properties-of-the-typedarray-constructors */
  ReflectSetPrototypeOf(Float16Array, TypedArray);

  const Float16ArrayPrototype = Float16Array.prototype;

  /** @see https://tc39.es/ecma262/#sec-typedarray.prototype.bytes_per_element */
  ObjectDefineProperty(Float16ArrayPrototype, "BYTES_PER_ELEMENT", {
    value: BYTES_PER_ELEMENT,
  });

  /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator */
  ObjectDefineProperty(Float16ArrayPrototype, SymbolIterator, {
    value: Float16ArrayPrototype.values,
    writable: true,
    configurable: true,
  });

  // To make `new Float16Array() instanceof Uint16Array` returns `false`
  ReflectSetPrototypeOf(Float16ArrayPrototype, TypedArrayPrototype);

  /**
   * returns an unsigned 16-bit float at the specified byte offset from the start of the DataView.
   *
   * @param {DataView} dataView
   * @param {number} byteOffset
   * @param {[boolean]} opts
   * @returns {number}
   */
  function getFloat16(dataView, byteOffset, ...opts) {
    return convertToNumber(
      DataViewPrototypeGetUint16(dataView, byteOffset, ...opts)
    );
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
    return DataViewPrototypeSetUint16(
      dataView,
      byteOffset,
      roundToFloat16Bits(value),
      ...opts
    );
  }

  exports.Float16Array = Float16Array;
  exports.getFloat16 = getFloat16;
  exports.hfround = hfround;
  exports.isFloat16Array = isFloat16Array;
  exports.setFloat16 = setFloat16;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXQxNi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL191dGlsL3ByaW1vcmRpYWxzLm1qcyIsIi4uL3NyYy9fdXRpbC9jb252ZXJ0ZXIubWpzIiwiLi4vc3JjL191dGlsL21lc3NhZ2VzLm1qcyIsIi4uL3NyYy9oZnJvdW5kLm1qcyIsIi4uL3NyYy9fdXRpbC9hcnJheUl0ZXJhdG9yLm1qcyIsIi4uL3NyYy9fdXRpbC9pcy5tanMiLCIuLi9zcmMvX3V0aWwvc3BlYy5tanMiLCIuLi9zcmMvRmxvYXQxNkFycmF5Lm1qcyIsIi4uL3NyYy9EYXRhVmlldy5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovXG4vKiBnbG9iYWwgU2hhcmVkQXJyYXlCdWZmZXIgKi9cblxuLyoqIEB0eXBlIHsodGFyZ2V0OiBGdW5jdGlvbikgPT4gKHRoaXNBcmc6IGFueSwgLi4uYXJnczogYW55W10pID0+IGFueX0gKi9cbmZ1bmN0aW9uIHVuY3VycnlUaGlzKHRhcmdldCkge1xuICByZXR1cm4gKHRoaXNBcmcsIC4uLmFyZ3MpID0+IHtcbiAgICByZXR1cm4gUmVmbGVjdEFwcGx5KHRhcmdldCwgdGhpc0FyZywgYXJncyk7XG4gIH07XG59XG5cbi8qKiBAdHlwZSB7KHRhcmdldDogYW55LCBrZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4gKHRoaXNBcmc6IGFueSwgLi4uYXJnczogYW55W10pID0+IGFueX0gKi9cbmZ1bmN0aW9uIHVuY3VycnlUaGlzR2V0dGVyKHRhcmdldCwga2V5KSB7XG4gIHJldHVybiB1bmN1cnJ5VGhpcyhcbiAgICBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgICAgdGFyZ2V0LFxuICAgICAga2V5XG4gICAgKS5nZXRcbiAgKTtcbn1cblxuLy8gUmVmbGVjdFxuZXhwb3J0IGNvbnN0IHtcbiAgYXBwbHk6IFJlZmxlY3RBcHBseSxcbiAgY29uc3RydWN0OiBSZWZsZWN0Q29uc3RydWN0LFxuICBkZWZpbmVQcm9wZXJ0eTogUmVmbGVjdERlZmluZVByb3BlcnR5LFxuICBnZXQ6IFJlZmxlY3RHZXQsXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgZ2V0UHJvdG90eXBlT2Y6IFJlZmxlY3RHZXRQcm90b3R5cGVPZixcbiAgaGFzOiBSZWZsZWN0SGFzLFxuICBvd25LZXlzOiBSZWZsZWN0T3duS2V5cyxcbiAgc2V0OiBSZWZsZWN0U2V0LFxuICBzZXRQcm90b3R5cGVPZjogUmVmbGVjdFNldFByb3RvdHlwZU9mLFxufSA9IFJlZmxlY3Q7XG5cbi8vIFByb3h5XG5leHBvcnQgY29uc3QgTmF0aXZlUHJveHkgPSBQcm94eTtcblxuLy8gTnVtYmVyXG5leHBvcnQgY29uc3QgTmF0aXZlTnVtYmVyID0gTnVtYmVyO1xuZXhwb3J0IGNvbnN0IHtcbiAgaXNGaW5pdGU6IE51bWJlcklzRmluaXRlLFxuICBpc05hTjogTnVtYmVySXNOYU4sXG59ID0gTmF0aXZlTnVtYmVyO1xuXG4vLyBTeW1ib2xcbmV4cG9ydCBjb25zdCB7XG4gIGl0ZXJhdG9yOiBTeW1ib2xJdGVyYXRvcixcbiAgc3BlY2llczogU3ltYm9sU3BlY2llcyxcbiAgdG9TdHJpbmdUYWc6IFN5bWJvbFRvU3RyaW5nVGFnLFxuICBmb3I6IFN5bWJvbEZvcixcbn0gPSBTeW1ib2w7XG5cbi8vIEFycmF5XG5jb25zdCBOYXRpdmVBcnJheSA9IEFycmF5O1xuZXhwb3J0IGNvbnN0IEFycmF5SXNBcnJheSA9IE5hdGl2ZUFycmF5LmlzQXJyYXk7XG5jb25zdCBBcnJheVByb3RvdHlwZSA9IE5hdGl2ZUFycmF5LnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KGFycmF5OiBBcnJheTx1bmtub3duPiwgc2VwYXJhdG9yPzogc3RyaW5nKSA9PiBzdHJpbmd9ICovXG5leHBvcnQgY29uc3QgQXJyYXlQcm90b3R5cGVKb2luID0gdW5jdXJyeVRoaXMoQXJyYXlQcm90b3R5cGUuam9pbik7XG4vKiogQHR5cGUgezxUPihhcnJheTogQXJyYXk8VD4sIC4uLml0ZW1zOiBUW10pID0+IG51bWJlcn0gKi9cbmV4cG9ydCBjb25zdCBBcnJheVByb3RvdHlwZVB1c2ggPSB1bmN1cnJ5VGhpcyhBcnJheVByb3RvdHlwZS5wdXNoKTtcbi8qKiBAdHlwZSB7KGFycmF5OiBBcnJheTx1bmtub3duPikgPT4gc3RyaW5nfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5UHJvdG90eXBlVG9Mb2NhbGVTdHJpbmcgPSB1bmN1cnJ5VGhpcyhcbiAgQXJyYXlQcm90b3R5cGUudG9Mb2NhbGVTdHJpbmdcbik7XG5cbi8vIE9iamVjdFxuZXhwb3J0IGNvbnN0IE5hdGl2ZU9iamVjdCA9IE9iamVjdDtcbmV4cG9ydCBjb25zdCB7XG4gIGNyZWF0ZTogT2JqZWN0Q3JlYXRlLFxuICBkZWZpbmVQcm9wZXJ0eTogT2JqZWN0RGVmaW5lUHJvcGVydHksXG4gIGZyZWV6ZTogT2JqZWN0RnJlZXplLFxuICBpczogT2JqZWN0SXMsXG59ID0gTmF0aXZlT2JqZWN0O1xuLyoqIEB0eXBlIHsob2JqZWN0OiBvYmplY3QsIGtleTogUHJvcGVydHlLZXkpID0+IGJvb2xlYW59ICovXG5leHBvcnQgY29uc3QgT2JqZWN0SGFzT3duID0gLyoqIEB0eXBlIHthbnl9ICovIChOYXRpdmVPYmplY3QpLmhhc093biB8fFxuICB1bmN1cnJ5VGhpcyhOYXRpdmVPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuLy8gTWF0aFxuZXhwb3J0IGNvbnN0IE1hdGhUcnVuYyA9IE1hdGgudHJ1bmM7XG5cbi8vIEFycmF5QnVmZmVyXG5leHBvcnQgY29uc3QgTmF0aXZlQXJyYXlCdWZmZXIgPSBBcnJheUJ1ZmZlcjtcbmV4cG9ydCBjb25zdCBBcnJheUJ1ZmZlcklzVmlldyA9IE5hdGl2ZUFycmF5QnVmZmVyLmlzVmlldztcbi8qKiBAdHlwZSB7KGJ1ZmZlcjogQXJyYXlCdWZmZXIsIGJlZ2luPzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IG51bWJlcn0gKi9cbmV4cG9ydCBjb25zdCBBcnJheUJ1ZmZlclByb3RvdHlwZVNsaWNlID0gdW5jdXJyeVRoaXMoTmF0aXZlQXJyYXlCdWZmZXIucHJvdG90eXBlLnNsaWNlKTtcbi8qKiBAdHlwZSB7KGJ1ZmZlcjogQXJyYXlCdWZmZXIpID0+IEFycmF5QnVmZmVyfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCA9IHVuY3VycnlUaGlzR2V0dGVyKE5hdGl2ZUFycmF5QnVmZmVyLnByb3RvdHlwZSwgXCJieXRlTGVuZ3RoXCIpO1xuXG4vLyBTaGFyZWRBcnJheUJ1ZmZlclxuZXhwb3J0IGNvbnN0IE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyID0gdHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyICE9PSBcInVuZGVmaW5lZFwiID8gU2hhcmVkQXJyYXlCdWZmZXIgOiBudWxsO1xuLyoqIEB0eXBlIHsoYnVmZmVyOiBTaGFyZWRBcnJheUJ1ZmZlciwgYmVnaW4/OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gbnVtYmVyfSAqL1xuZXhwb3J0IGNvbnN0IFNoYXJlZEFycmF5QnVmZmVyUHJvdG90eXBlU2xpY2UgPSBOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlclxuICAmJiB1bmN1cnJ5VGhpcyhOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlci5wcm90b3R5cGUuc2xpY2UpO1xuLyoqIEB0eXBlIHsoYnVmZmVyOiBTaGFyZWRBcnJheUJ1ZmZlcikgPT4gU2hhcmVkQXJyYXlCdWZmZXJ9ICovXG5leHBvcnQgY29uc3QgU2hhcmVkQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoID0gTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXJcbiAgJiYgdW5jdXJyeVRoaXNHZXR0ZXIoTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXIucHJvdG90eXBlLCBcImJ5dGVMZW5ndGhcIik7XG5cbi8vIFR5cGVkQXJyYXlcbi8qKiBAdHlwZWRlZiB7VWludDhBcnJheXxVaW50OENsYW1wZWRBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxJbnQ4QXJyYXl8SW50MTZBcnJheXxJbnQzMkFycmF5fEZsb2F0MzJBcnJheXxGbG9hdDY0QXJyYXl8QmlnVWludDY0QXJyYXl8QmlnSW50NjRBcnJheX0gVHlwZWRBcnJheSAqL1xuLyoqIEB0eXBlIHthbnl9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheSA9IFJlZmxlY3RHZXRQcm90b3R5cGVPZihVaW50OEFycmF5KTtcbmNvbnN0IFR5cGVkQXJyYXlGcm9tID0gVHlwZWRBcnJheS5mcm9tO1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGUgPSBUeXBlZEFycmF5LnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IEl0ZXJhYmxlSXRlcmF0b3I8bnVtYmVyPn0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlS2V5cyA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUua2V5cyk7XG4vKiogQHR5cGUgeyh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBJdGVyYWJsZUl0ZXJhdG9yPG51bWJlcj59ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVZhbHVlcyA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLnZhbHVlc1xuKTtcbi8qKiBAdHlwZSB7KHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IEl0ZXJhYmxlSXRlcmF0b3I8W251bWJlciwgbnVtYmVyXT59ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUVudHJpZXMgPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS5lbnRyaWVzXG4pO1xuLyoqIEB0eXBlIHsodHlwZWRBcnJheTogVHlwZWRBcnJheSwgYXJyYXk6IEFycmF5TGlrZTxudW1iZXI+LCBvZmZzZXQ/OiBudW1iZXIpID0+IHZvaWR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVNldCA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUuc2V0KTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBUKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVSZXZlcnNlID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUucmV2ZXJzZVxuKTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCB2YWx1ZTogbnVtYmVyLCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVGaWxsID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5maWxsKTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCB0YXJnZXQ6IG51bWJlciwgc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVDb3B5V2l0aGluID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUuY29weVdpdGhpblxuKTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCBjb21wYXJlRm4/OiAoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlU29ydCA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUuc29ydCk7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlU2xpY2UgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLnNsaWNlKTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVTdWJhcnJheSA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLnN1YmFycmF5XG4pO1xuLyoqIEB0eXBlIHsoKHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IEFycmF5QnVmZmVyKX0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyID0gdW5jdXJyeVRoaXNHZXR0ZXIoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUsXG4gIFwiYnVmZmVyXCJcbik7XG4vKiogQHR5cGUgeygodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gbnVtYmVyKX0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldCA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBcImJ5dGVPZmZzZXRcIlxuKTtcbi8qKiBAdHlwZSB7KCh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBudW1iZXIpfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGggPSB1bmN1cnJ5VGhpc0dldHRlcihcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgXCJsZW5ndGhcIlxuKTtcbi8qKiBAdHlwZSB7KHRhcmdldDogdW5rbm93bikgPT4gc3RyaW5nfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBTeW1ib2xUb1N0cmluZ1RhZ1xuKTtcblxuLy8gVWludDE2QXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVVaW50MTZBcnJheSA9IFVpbnQxNkFycmF5O1xuLyoqIEB0eXBlIHtVaW50MTZBcnJheUNvbnN0cnVjdG9yW1wiZnJvbVwiXX0gKi9cbmV4cG9ydCBjb25zdCBVaW50MTZBcnJheUZyb20gPSAoLi4uYXJncykgPT4ge1xuICByZXR1cm4gUmVmbGVjdEFwcGx5KFR5cGVkQXJyYXlGcm9tLCBOYXRpdmVVaW50MTZBcnJheSwgYXJncyk7XG59O1xuXG4vLyBVaW50MzJBcnJheVxuZXhwb3J0IGNvbnN0IE5hdGl2ZVVpbnQzMkFycmF5ID0gVWludDMyQXJyYXk7XG5cbi8vIEZsb2F0MzJBcnJheVxuZXhwb3J0IGNvbnN0IE5hdGl2ZUZsb2F0MzJBcnJheSA9IEZsb2F0MzJBcnJheTtcblxuLy8gSXRlcmF0b3JcbmV4cG9ydCBjb25zdCBJdGVyYXRvclByb3RvdHlwZSA9IFJlZmxlY3RHZXRQcm90b3R5cGVPZihcbiAgUmVmbGVjdEdldFByb3RvdHlwZU9mKFtdW1N5bWJvbEl0ZXJhdG9yXSgpKVxuKTtcblxuLy8gR2VuZXJhdG9yXG4vKiogQHR5cGUgezxUID0gdW5rbm93biwgVFJldHVybiA9IGFueSwgVE5leHQgPSB1bmtub3duPihnZW5lcmF0b3I6IEdlbmVyYXRvcjxULCBUUmV0dXJuLCBUTmV4dD4sIHZhbHVlPzogVE5leHQpID0+IFR9ICovXG5leHBvcnQgY29uc3QgR2VuZXJhdG9yUHJvdG90eXBlTmV4dCA9IHVuY3VycnlUaGlzKChmdW5jdGlvbiogKCkge30pKCkubmV4dCk7XG5cbi8vIERhdGFWaWV3XG5jb25zdCBEYXRhVmlld1Byb3RvdHlwZSA9IERhdGFWaWV3LnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KGRhdGFWaWV3OiBEYXRhVmlldywgYnl0ZU9mZnNldDogbnVtYmVyLCBsaXR0bGVFbmRpYW4/OiBib29sZWFuKSA9PiBudW1iZXJ9ICovXG5leHBvcnQgY29uc3QgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYgPSB1bmN1cnJ5VGhpcyhcbiAgRGF0YVZpZXdQcm90b3R5cGUuZ2V0VWludDE2XG4pO1xuLyoqIEB0eXBlIHsoZGF0YVZpZXc6IERhdGFWaWV3LCBieXRlT2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIGxpdHRsZUVuZGlhbj86IGJvb2xlYW4pID0+IHZvaWR9ICovXG5leHBvcnQgY29uc3QgRGF0YVZpZXdQcm90b3R5cGVTZXRVaW50MTYgPSB1bmN1cnJ5VGhpcyhcbiAgRGF0YVZpZXdQcm90b3R5cGUuc2V0VWludDE2XG4pO1xuXG4vLyBFcnJvclxuZXhwb3J0IGNvbnN0IE5hdGl2ZVR5cGVFcnJvciA9IFR5cGVFcnJvcjtcbmV4cG9ydCBjb25zdCBOYXRpdmVSYW5nZUVycm9yID0gUmFuZ2VFcnJvcjtcblxuLy8gU2V0XG4vKipcbiAqIERvIG5vdCBjb25zdHJ1Y3Qgd2l0aCBhcmd1bWVudHMgdG8gYXZvaWQgY2FsbGluZyB0aGUgXCJhZGRcIiBtZXRob2RcbiAqXG4gKiBAdHlwZSB7e25ldyA8VCA9IGFueT4oKTogU2V0PFQ+fX1cbiAqL1xuZXhwb3J0IGNvbnN0IE5hdGl2ZVNldCA9IFNldDtcbmNvbnN0IFNldFByb3RvdHlwZSA9IE5hdGl2ZVNldC5wcm90b3R5cGU7XG4vKiogQHR5cGUgezxUPihzZXQ6IFNldDxUPiwgdmFsdWU6IFQpID0+IFNldDxUPn0gKi9cbmV4cG9ydCBjb25zdCBTZXRQcm90b3R5cGVBZGQgPSB1bmN1cnJ5VGhpcyhTZXRQcm90b3R5cGUuYWRkKTtcbi8qKiBAdHlwZSB7PFQ+KHNldDogU2V0PFQ+LCB2YWx1ZTogVCkgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBTZXRQcm90b3R5cGVIYXMgPSB1bmN1cnJ5VGhpcyhTZXRQcm90b3R5cGUuaGFzKTtcblxuLy8gV2Vha01hcFxuLyoqXG4gKiBEbyBub3QgY29uc3RydWN0IHdpdGggYXJndW1lbnRzIHRvIGF2b2lkIGNhbGxpbmcgdGhlIFwic2V0XCIgbWV0aG9kXG4gKlxuICogQHR5cGUge3tuZXcgPEsgZXh0ZW5kcyB7fSwgVj4oKTogV2Vha01hcDxLLCBWPn19XG4gKi9cbmV4cG9ydCBjb25zdCBOYXRpdmVXZWFrTWFwID0gV2Vha01hcDtcbmNvbnN0IFdlYWtNYXBQcm90b3R5cGUgPSBOYXRpdmVXZWFrTWFwLnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7PEsgZXh0ZW5kcyB7fSwgVj4od2Vha01hcDogV2Vha01hcDxLLCBWPiwga2V5OiBLKSA9PiBWfSAqL1xuZXhwb3J0IGNvbnN0IFdlYWtNYXBQcm90b3R5cGVHZXQgPSB1bmN1cnJ5VGhpcyhXZWFrTWFwUHJvdG90eXBlLmdldCk7XG4vKiogQHR5cGUgezxLIGV4dGVuZHMge30sIFY+KHdlYWtNYXA6IFdlYWtNYXA8SywgVj4sIGtleTogSykgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBXZWFrTWFwUHJvdG90eXBlSGFzID0gdW5jdXJyeVRoaXMoV2Vha01hcFByb3RvdHlwZS5oYXMpO1xuLyoqIEB0eXBlIHs8SyBleHRlbmRzIHt9LCBWPih3ZWFrTWFwOiBXZWFrTWFwPEssIFY+LCBrZXk6IEssIHZhbHVlOiBWKSA9PiBXZWFrTWFwfSAqL1xuZXhwb3J0IGNvbnN0IFdlYWtNYXBQcm90b3R5cGVTZXQgPSB1bmN1cnJ5VGhpcyhXZWFrTWFwUHJvdG90eXBlLnNldCk7XG4iLCIvLyBhbGdvcml0aG06IGh0dHA6Ly9mb3gtdG9vbGtpdC5vcmcvZnRwL2Zhc3RoYWxmZmxvYXRjb252ZXJzaW9uLnBkZlxuXG5pbXBvcnQge1xuICBOYXRpdmVBcnJheUJ1ZmZlcixcbiAgTmF0aXZlRmxvYXQzMkFycmF5LFxuICBOYXRpdmVVaW50MzJBcnJheSxcbn0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbmNvbnN0IGJ1ZmZlciA9IG5ldyBOYXRpdmVBcnJheUJ1ZmZlcig0KTtcbmNvbnN0IGZsb2F0VmlldyA9IG5ldyBOYXRpdmVGbG9hdDMyQXJyYXkoYnVmZmVyKTtcbmNvbnN0IHVpbnQzMlZpZXcgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoYnVmZmVyKTtcblxuY29uc3QgYmFzZVRhYmxlID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KDUxMik7XG5jb25zdCBzaGlmdFRhYmxlID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KDUxMik7XG5cbmZvciAobGV0IGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgY29uc3QgZSA9IGkgLSAxMjc7XG5cbiAgLy8gdmVyeSBzbWFsbCBudW1iZXIgKDAsIC0wKVxuICBpZiAoZSA8IC0yNykge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gMHgwMDAwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHg4MDAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDI0O1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDI0O1xuXG4gIC8vIHNtYWxsIG51bWJlciAoZGVub3JtKVxuICB9IGVsc2UgaWYgKGUgPCAtMTQpIHtcbiAgICBiYXNlVGFibGVbaV0gICAgICAgICA9ICAweDA0MDAgPj4gKC1lIC0gMTQpO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gKDB4MDQwMCA+PiAoLWUgLSAxNCkpIHwgMHg4MDAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IC1lIC0gMTtcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAtZSAtIDE7XG5cbiAgLy8gbm9ybWFsIG51bWJlclxuICB9IGVsc2UgaWYgKGUgPD0gMTUpIHtcbiAgICBiYXNlVGFibGVbaV0gICAgICAgICA9ICAoZSArIDE1KSA8PCAxMDtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9ICgoZSArIDE1KSA8PCAxMCkgfCAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gMTM7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMTM7XG5cbiAgLy8gbGFyZ2UgbnVtYmVyIChJbmZpbml0eSwgLUluZmluaXR5KVxuICB9IGVsc2UgaWYgKGUgPCAxMjgpIHtcbiAgICBiYXNlVGFibGVbaV0gICAgICAgICA9IDB4N2MwMDtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ZmMwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAyNDtcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAyNDtcblxuICAvLyBzdGF5IChOYU4sIEluZmluaXR5LCAtSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAweDdjMDA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweGZjMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gMTM7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMTM7XG4gIH1cbn1cblxuLyoqXG4gKiByb3VuZCBhIG51bWJlciB0byBhIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHMuXG4gKlxuICogQHBhcmFtIHt1bmtub3dufSBudW0gLSBkb3VibGUgZmxvYXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kVG9GbG9hdDE2Qml0cyhudW0pIHtcbiAgZmxvYXRWaWV3WzBdID0gLyoqIEB0eXBlIHthbnl9ICovIChudW0pO1xuICBjb25zdCBmID0gdWludDMyVmlld1swXTtcbiAgY29uc3QgZSA9IChmID4+IDIzKSAmIDB4MWZmO1xuICByZXR1cm4gYmFzZVRhYmxlW2VdICsgKChmICYgMHgwMDdmZmZmZikgPj4gc2hpZnRUYWJsZVtlXSk7XG59XG5cbmNvbnN0IG1hbnRpc3NhVGFibGUgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoMjA0OCk7XG5jb25zdCBleHBvbmVudFRhYmxlID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KDY0KTtcbmNvbnN0IG9mZnNldFRhYmxlID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KDY0KTtcblxubWFudGlzc2FUYWJsZVswXSA9IDA7XG5mb3IgKGxldCBpID0gMTsgaSA8IDEwMjQ7ICsraSkge1xuICBsZXQgbSA9IGkgPDwgMTM7ICAgIC8vIHplcm8gcGFkIG1hbnRpc3NhIGJpdHNcbiAgbGV0IGUgPSAwOyAgICAgICAgICAvLyB6ZXJvIGV4cG9uZW50XG5cbiAgLy8gbm9ybWFsaXplZFxuICB3aGlsZSgobSAmIDB4MDA4MDAwMDApID09PSAwKSB7XG4gICAgZSAtPSAweDAwODAwMDAwOyAgLy8gZGVjcmVtZW50IGV4cG9uZW50XG4gICAgbSA8PD0gMTtcbiAgfVxuXG4gIG0gJj0gfjB4MDA4MDAwMDA7ICAgLy8gY2xlYXIgbGVhZGluZyAxIGJpdFxuICBlICs9IDB4Mzg4MDAwMDA7ICAgIC8vIGFkanVzdCBiaWFzXG5cbiAgbWFudGlzc2FUYWJsZVtpXSA9IG0gfCBlO1xufVxuZm9yIChsZXQgaSA9IDEwMjQ7IGkgPCAyMDQ4OyArK2kpIHtcbiAgbWFudGlzc2FUYWJsZVtpXSA9IDB4MzgwMDAwMDAgKyAoKGkgLSAxMDI0KSA8PCAxMyk7XG59XG5cbmV4cG9uZW50VGFibGVbMF0gPSAwO1xuZm9yIChsZXQgaSA9IDE7IGkgPCAzMTsgKytpKSB7XG4gIGV4cG9uZW50VGFibGVbaV0gPSBpIDw8IDIzO1xufVxuZXhwb25lbnRUYWJsZVszMV0gPSAweDQ3ODAwMDAwO1xuZXhwb25lbnRUYWJsZVszMl0gPSAweDgwMDAwMDAwO1xuZm9yIChsZXQgaSA9IDMzOyBpIDwgNjM7ICsraSkge1xuICBleHBvbmVudFRhYmxlW2ldID0gMHg4MDAwMDAwMCArICgoaSAtIDMyKSA8PCAyMyk7XG59XG5leHBvbmVudFRhYmxlWzYzXSA9IDB4Yzc4MDAwMDA7XG5cbm9mZnNldFRhYmxlWzBdID0gMDtcbmZvciAobGV0IGkgPSAxOyBpIDwgNjQ7ICsraSkge1xuICBpZiAoaSA9PT0gMzIpIHtcbiAgICBvZmZzZXRUYWJsZVtpXSA9IDA7XG4gIH0gZWxzZSB7XG4gICAgb2Zmc2V0VGFibGVbaV0gPSAxMDI0O1xuICB9XG59XG5cbi8qKlxuICogY29udmVydCBhIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHMgdG8gYSBudW1iZXIuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGZsb2F0MTZiaXRzIC0gaGFsZiBmbG9hdCBudW1iZXIgYml0c1xuICogQHJldHVybnMge251bWJlcn0gZG91YmxlIGZsb2F0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHMpIHtcbiAgY29uc3QgbSA9IGZsb2F0MTZiaXRzID4+IDEwO1xuICB1aW50MzJWaWV3WzBdID0gbWFudGlzc2FUYWJsZVtvZmZzZXRUYWJsZVttXSArIChmbG9hdDE2Yml0cyAmIDB4M2ZmKV0gKyBleHBvbmVudFRhYmxlW21dO1xuICByZXR1cm4gZmxvYXRWaWV3WzBdO1xufVxuIiwiZXhwb3J0IGNvbnN0IENPTlNUUlVDVE9SX0lTX05PVF9BX09CSkVDVCA9IFwiQ29uc3RydWN0b3IgaXMgbm90IGEgb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgVEhJU19JU19OT1RfQV9PQkpFQ1QgPSBcIlRoaXMgaXMgbm90IGEgb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgVEhJU19JU19OT1RfQV9GTE9BVDE2QVJSQVkgPSBcIlRoaXMgaXMgbm90IGEgRmxvYXQxNkFycmF5XCI7XG5leHBvcnQgY29uc3QgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVkgPVxuICBcIlRoaXMgY29uc3RydWN0b3IgaXMgbm90IGEgc3ViY2xhc3Mgb2YgRmxvYXQxNkFycmF5XCI7XG5leHBvcnQgY29uc3QgU1BFQ0lFU0NPTlNUUlVDVE9SX0RJRE5UX1JFVFVSTl9UWVBFREFSUkFZID1cbiAgXCJTcGVjaWVzQ29uc3RydWN0b3IgZGlkbid0IHJldHVybiBUeXBlZEFycmF5XCI7XG5leHBvcnQgY29uc3QgREVSSVZFRF9UWVBFREFSUkFZX0NPTlNUUlVDVE9SX0NSRUFURURfQU5fQVJSQVlfV0hJQ0hfV0FTX1RPT19TTUFMTCA9XG4gIFwiRGVyaXZlZCBUeXBlZEFycmF5IGNvbnN0cnVjdG9yIGNyZWF0ZWQgYW4gYXJyYXkgd2hpY2ggd2FzIHRvbyBzbWFsbFwiO1xuZXhwb3J0IGNvbnN0IFRISVNfQlVGRkVSX0hBU19BTFJFQURZX0JFRU5fREVUQUNIRUQgPSBcIlRoaXMgYnVmZmVyIGhhcyBhbHJlYWR5IGJlZW4gZGV0YWNoZWRcIjtcbmV4cG9ydCBjb25zdCBDQU5OT1RfQ09OVkVSVF9VTkRFRklORURfT1JfTlVMTF9UT19PQkpFQ1QgPVxuICBcIkNhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IENBTk5PVF9DT05WRVJUX0FfQklHSU5UX1ZBTFVFX1RPX0FfTlVNQkVSID1cbiAgXCJDYW5ub3QgY29udmVydCBhIEJpZ0ludCB2YWx1ZSB0byBhIG51bWJlclwiO1xuZXhwb3J0IGNvbnN0IENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFUyA9XG4gIFwiQ2Fubm90IG1peCBCaWdJbnQgYW5kIG90aGVyIHR5cGVzLCB1c2UgZXhwbGljaXQgY29udmVyc2lvbnNcIjtcbmV4cG9ydCBjb25zdCBSRURVQ0VfT0ZfRU1QVFlfQVJSQVlfV0lUSF9OT19JTklUSUFMX1ZBTFVFID1cbiAgXCJSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlXCI7XG5leHBvcnQgY29uc3QgT0ZGU0VUX0lTX09VVF9PRl9CT1VORFMgPSBcIk9mZnNldCBpcyBvdXQgb2YgYm91bmRzXCI7XG4iLCJpbXBvcnQgeyBjb252ZXJ0VG9OdW1iZXIsIHJvdW5kVG9GbG9hdDE2Qml0cyB9IGZyb20gXCIuL191dGlsL2NvbnZlcnRlci5tanNcIjtcbmltcG9ydCB7IENBTk5PVF9DT05WRVJUX0FfQklHSU5UX1ZBTFVFX1RPX0FfTlVNQkVSIH0gZnJvbSBcIi4vX3V0aWwvbWVzc2FnZXMubWpzXCI7XG5pbXBvcnQge1xuICBOYXRpdmVOdW1iZXIsXG4gIE5hdGl2ZVR5cGVFcnJvcixcbiAgTnVtYmVySXNGaW5pdGUsXG59IGZyb20gXCIuL191dGlsL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKipcbiAqIHJldHVybnMgdGhlIG5lYXJlc3QgaGFsZi1wcmVjaXNpb24gZmxvYXQgcmVwcmVzZW50YXRpb24gb2YgYSBudW1iZXIuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhmcm91bmQobnVtKSB7XG4gIGlmICh0eXBlb2YgbnVtID09PSBcImJpZ2ludFwiKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKENBTk5PVF9DT05WRVJUX0FfQklHSU5UX1ZBTFVFX1RPX0FfTlVNQkVSKTtcbiAgfVxuXG4gIG51bSA9IE5hdGl2ZU51bWJlcihudW0pO1xuXG4gIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgaWYgKCFOdW1iZXJJc0Zpbml0ZShudW0pIHx8IG51bSA9PT0gMCkge1xuICAgIHJldHVybiBudW07XG4gIH1cblxuICBjb25zdCB4MTYgPSByb3VuZFRvRmxvYXQxNkJpdHMobnVtKTtcbiAgcmV0dXJuIGNvbnZlcnRUb051bWJlcih4MTYpO1xufVxuIiwiaW1wb3J0IHtcbiAgR2VuZXJhdG9yUHJvdG90eXBlTmV4dCxcbiAgSXRlcmF0b3JQcm90b3R5cGUsXG4gIE5hdGl2ZVdlYWtNYXAsXG4gIE9iamVjdENyZWF0ZSxcbiAgU3ltYm9sVG9TdHJpbmdUYWcsXG4gIFdlYWtNYXBQcm90b3R5cGVHZXQsXG4gIFdlYWtNYXBQcm90b3R5cGVTZXQsXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKiogQHR5cGUge1dlYWtNYXA8e30sIEdlbmVyYXRvcjxhbnk+Pn0gKi9cbmNvbnN0IGdlbmVyYXRvcnMgPSBuZXcgTmF0aXZlV2Vha01hcCgpO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSVhcnJheWl0ZXJhdG9ycHJvdG90eXBlJS1vYmplY3QgKi9cbmNvbnN0IEFycmF5SXRlcmF0b3JQcm90b3R5cGUgPSBPYmplY3RDcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtcbiAgbmV4dDoge1xuICAgIHZhbHVlOiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgY29uc3QgZ2VuZXJhdG9yID0gV2Vha01hcFByb3RvdHlwZUdldChnZW5lcmF0b3JzLCB0aGlzKTtcbiAgICAgIHJldHVybiBHZW5lcmF0b3JQcm90b3R5cGVOZXh0KGdlbmVyYXRvcik7XG4gICAgfSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gIH0sXG5cbiAgW1N5bWJvbFRvU3RyaW5nVGFnXToge1xuICAgIHZhbHVlOiBcIkFycmF5IEl0ZXJhdG9yXCIsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICB9LFxufSk7XG5cbi8qKiBAdHlwZSB7PFQ+KGdlbmVyYXRvcjogR2VuZXJhdG9yPFQ+KSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFQ+fSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBJbkFycmF5SXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG4gIGNvbnN0IGFycmF5SXRlcmF0b3IgPSBPYmplY3RDcmVhdGUoQXJyYXlJdGVyYXRvclByb3RvdHlwZSk7XG4gIFdlYWtNYXBQcm90b3R5cGVTZXQoZ2VuZXJhdG9ycywgYXJyYXlJdGVyYXRvciwgZ2VuZXJhdG9yKTtcbiAgcmV0dXJuIGFycmF5SXRlcmF0b3I7XG59XG4iLCJpbXBvcnQge1xuICBBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGgsXG4gIEFycmF5SXNBcnJheSxcbiAgTWF0aFRydW5jLFxuICBOYXRpdmVOdW1iZXIsXG4gIE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyLFxuICBOdW1iZXJJc0Zpbml0ZSxcbiAgU2hhcmVkQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoLFxuICBTeW1ib2xJdGVyYXRvcixcbiAgU3ltYm9sVG9TdHJpbmdUYWcsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyxcbn0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHt9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHx8XG4gICAgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHt9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCI7XG59XG5cbi8vIEluc3BpcmVkIGJ5IHV0aWwudHlwZXMgaW1wbGVtZW50YXRpb24gb2YgTm9kZS5qc1xuLyoqIEB0eXBlZGVmIHtVaW50OEFycmF5fFVpbnQ4Q2xhbXBlZEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fEludDhBcnJheXxJbnQxNkFycmF5fEludDMyQXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheXxCaWdVaW50NjRBcnJheXxCaWdJbnQ2NEFycmF5fSBUeXBlZEFycmF5ICovXG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIFR5cGVkQXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyh2YWx1ZSkgIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgQmlnSW50NjRBcnJheXxCaWdVaW50NjRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQmlnSW50VHlwZWRBcnJheSh2YWx1ZSkge1xuICBjb25zdCB0eXBlZEFycmF5TmFtZSA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyh2YWx1ZSk7XG4gIHJldHVybiB0eXBlZEFycmF5TmFtZSA9PT0gXCJCaWdJbnQ2NEFycmF5XCIgfHxcbiAgICB0eXBlZEFycmF5TmFtZSA9PT0gXCJCaWdVaW50NjRBcnJheVwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBBcnJheUJ1ZmZlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsdWUpIHtcbiAgdHJ5IHtcbiAgICBBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGgoLyoqIEB0eXBlIHthbnl9ICovICh2YWx1ZSkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIFNoYXJlZEFycmF5QnVmZmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTaGFyZWRBcnJheUJ1ZmZlcih2YWx1ZSkge1xuICBpZiAoTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cnkge1xuICAgIFNoYXJlZEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCgvKiogQHR5cGUge2FueX0gKi8gKHZhbHVlKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgSXRlcmFibGU8dW5rbm93bj59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0l0ZXJhYmxlKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWVbU3ltYm9sSXRlcmF0b3JdID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHVua25vd25bXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3JkaW5hcnlBcnJheSh2YWx1ZSkge1xuICBpZiAoIUFycmF5SXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBpdGVyYXRvciA9IHZhbHVlW1N5bWJvbEl0ZXJhdG9yXSgpO1xuICBpZiAoaXRlcmF0b3JbU3ltYm9sVG9TdHJpbmdUYWddICE9PSBcIkFycmF5IEl0ZXJhdG9yXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVHlwZWRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3JkaW5hcnlUeXBlZEFycmF5KHZhbHVlKSB7XG4gIGlmICghaXNUeXBlZEFycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gdmFsdWVbU3ltYm9sSXRlcmF0b3JdKCk7XG4gIGlmIChpdGVyYXRvcltTeW1ib2xUb1N0cmluZ1RhZ10gIT09IFwiQXJyYXkgSXRlcmF0b3JcIikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgbnVtYmVyID0gTmF0aXZlTnVtYmVyKHZhbHVlKTtcbiAgaWYgKHZhbHVlICE9PSBudW1iZXIgKyBcIlwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFOdW1iZXJJc0Zpbml0ZShudW1iZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKG51bWJlciAhPT0gTWF0aFRydW5jKG51bWJlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cbiIsImltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSBcIi4vaXMubWpzXCI7XG5pbXBvcnQge1xuICBDQU5OT1RfQ09OVkVSVF9BX0JJR0lOVF9WQUxVRV9UT19BX05VTUJFUixcbiAgQ09OU1RSVUNUT1JfSVNfTk9UX0FfT0JKRUNULFxuICBUSElTX0lTX05PVF9BX09CSkVDVCxcbn0gZnJvbSBcIi4vbWVzc2FnZXMubWpzXCI7XG5pbXBvcnQge1xuICBBcnJheUJ1ZmZlclByb3RvdHlwZVNsaWNlLFxuICBNYXRoVHJ1bmMsXG4gIE5hdGl2ZU51bWJlcixcbiAgTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXIsXG4gIE5hdGl2ZVR5cGVFcnJvcixcbiAgTnVtYmVySXNOYU4sXG4gIE9iamVjdElzLFxuICBTaGFyZWRBcnJheUJ1ZmZlclByb3RvdHlwZVNsaWNlLFxuICBTeW1ib2xTcGVjaWVzLFxufSBmcm9tIFwiLi9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9pbnRlZ2Vyb3JpbmZpbml0eVxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBUb0ludGVnZXJPckluZmluaXR5KHRhcmdldCkge1xuICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJiaWdpbnRcIikge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihDQU5OT1RfQ09OVkVSVF9BX0JJR0lOVF9WQUxVRV9UT19BX05VTUJFUik7XG4gIH1cblxuICBjb25zdCBudW1iZXIgPSBOYXRpdmVOdW1iZXIodGFyZ2V0KTtcblxuICBpZiAoTnVtYmVySXNOYU4obnVtYmVyKSB8fCBudW1iZXIgPT09IDApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiBNYXRoVHJ1bmMobnVtYmVyKTtcbn1cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9sZW5ndGhcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBUb0xlbmd0aCh0YXJnZXQpIHtcbiAgY29uc3QgbGVuZ3RoID0gVG9JbnRlZ2VyT3JJbmZpbml0eSh0YXJnZXQpO1xuICBpZiAobGVuZ3RoIDwgMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIGxlbmd0aCA8IE5hdGl2ZU51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgPyBsZW5ndGhcbiAgICA6IE5hdGl2ZU51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1sZW5ndGhvZmFycmF5bGlrZVxuICogQHBhcmFtIHtvYmplY3R9IGFycmF5TGlrZVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIExlbmd0aE9mQXJyYXlMaWtlKGFycmF5TGlrZSkge1xuICBpZiAoIWlzT2JqZWN0KGFycmF5TGlrZSkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhJU19JU19OT1RfQV9PQkpFQ1QpO1xuICB9XG5cbiAgcmV0dXJuIFRvTGVuZ3RoKC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXlMaWtlKS5sZW5ndGgpO1xufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1zcGVjaWVzY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7eyBuZXcoLi4uYXJnczogYW55W10pOiBhbnk7IH19IGRlZmF1bHRDb25zdHJ1Y3RvclxuICogQHJldHVybnMge3sgbmV3KC4uLmFyZ3M6IGFueVtdKTogYW55OyB9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gU3BlY2llc0NvbnN0cnVjdG9yKHRhcmdldCwgZGVmYXVsdENvbnN0cnVjdG9yKSB7XG4gIGlmICghaXNPYmplY3QodGFyZ2V0KSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSElTX0lTX05PVF9BX09CSkVDVCk7XG4gIH1cblxuICBjb25zdCBjb25zdHJ1Y3RvciA9IHRhcmdldC5jb25zdHJ1Y3RvcjtcbiAgaWYgKGNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZGVmYXVsdENvbnN0cnVjdG9yO1xuICB9XG4gIGlmICghaXNPYmplY3QoY29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKENPTlNUUlVDVE9SX0lTX05PVF9BX09CSkVDVCk7XG4gIH1cblxuICBjb25zdCBzcGVjaWVzID0gY29uc3RydWN0b3JbU3ltYm9sU3BlY2llc107XG4gIGlmIChzcGVjaWVzID09IG51bGwpIHtcbiAgICByZXR1cm4gZGVmYXVsdENvbnN0cnVjdG9yO1xuICB9XG5cbiAgcmV0dXJuIHNwZWNpZXM7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWlzZGV0YWNoZWRidWZmZXJcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJMaWtlfSBidWZmZXJcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpIHtcbiAgdHJ5IHtcbiAgICBBcnJheUJ1ZmZlclByb3RvdHlwZVNsaWNlKGJ1ZmZlciwgMCwgMCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGNhdGNoIChlKSB7LyogZW1wdHkgKi99XG5cbiAgaWYgKE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyICE9PSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIFNoYXJlZEFycmF5QnVmZmVyUHJvdG90eXBlU2xpY2UoLyoqIEB0eXBlIHtTaGFyZWRBcnJheUJ1ZmZlcn0gKi8gKGJ1ZmZlciksIDAsIDApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gY2F0Y2ggKGUpIHsvKiBlbXB0eSAqL31cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIGJpZ2ludCBjb21wYXJpc29ucyBhcmUgbm90IHN1cHBvcnRlZFxuICpcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNvcnRcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gKiBAcGFyYW0ge251bWJlcn0geVxuICogQHJldHVybnMgey0xIHwgMCB8IDF9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0Q29tcGFyZSh4LCB5KSB7XG4gIGNvbnN0IGlzWE5hTiA9IE51bWJlcklzTmFOKHgpO1xuICBjb25zdCBpc1lOYU4gPSBOdW1iZXJJc05hTih5KTtcblxuICBpZiAoaXNYTmFOICYmIGlzWU5hTikge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKGlzWE5hTikge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKGlzWU5hTikge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmICh4IDwgeSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmICh4ID4geSkge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCkge1xuICAgIGNvbnN0IGlzWFBsdXNaZXJvID0gT2JqZWN0SXMoeCwgMCk7XG4gICAgY29uc3QgaXNZUGx1c1plcm8gPSBPYmplY3RJcyh5LCAwKTtcblxuICAgIGlmICghaXNYUGx1c1plcm8gJiYgaXNZUGx1c1plcm8pIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoaXNYUGx1c1plcm8gJiYgIWlzWVBsdXNaZXJvKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cbiIsImltcG9ydCB7IHdyYXBJbkFycmF5SXRlcmF0b3IgfSBmcm9tIFwiLi9fdXRpbC9hcnJheUl0ZXJhdG9yLm1qc1wiO1xuaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9fdXRpbC9jb252ZXJ0ZXIubWpzXCI7XG5pbXBvcnQge1xuICBpc0FycmF5QnVmZmVyLFxuICBpc0JpZ0ludFR5cGVkQXJyYXksXG4gIGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nLFxuICBpc0l0ZXJhYmxlLFxuICBpc09iamVjdCxcbiAgaXNPYmplY3RMaWtlLFxuICBpc09yZGluYXJ5QXJyYXksXG4gIGlzT3JkaW5hcnlUeXBlZEFycmF5LFxuICBpc1NoYXJlZEFycmF5QnVmZmVyLFxuICBpc1R5cGVkQXJyYXksXG59IGZyb20gXCIuL191dGlsL2lzLm1qc1wiO1xuaW1wb3J0IHtcbiAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNULFxuICBDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVMsXG4gIENPTlNUUlVDVE9SX0lTX05PVF9BX09CSkVDVCxcbiAgREVSSVZFRF9UWVBFREFSUkFZX0NPTlNUUlVDVE9SX0NSRUFURURfQU5fQVJSQVlfV0hJQ0hfV0FTX1RPT19TTUFMTCxcbiAgT0ZGU0VUX0lTX09VVF9PRl9CT1VORFMsXG4gIFJFRFVDRV9PRl9FTVBUWV9BUlJBWV9XSVRIX05PX0lOSVRJQUxfVkFMVUUsXG4gIFNQRUNJRVNDT05TVFJVQ1RPUl9ESUROVF9SRVRVUk5fVFlQRURBUlJBWSxcbiAgVEhJU19CVUZGRVJfSEFTX0FMUkVBRFlfQkVFTl9ERVRBQ0hFRCxcbiAgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVksXG4gIFRISVNfSVNfTk9UX0FfRkxPQVQxNkFSUkFZLFxufSBmcm9tIFwiLi9fdXRpbC9tZXNzYWdlcy5tanNcIjtcbmltcG9ydCB7XG4gIEFycmF5QnVmZmVySXNWaWV3LFxuICBBcnJheVByb3RvdHlwZUpvaW4sXG4gIEFycmF5UHJvdG90eXBlUHVzaCxcbiAgQXJyYXlQcm90b3R5cGVUb0xvY2FsZVN0cmluZyxcbiAgTmF0aXZlQXJyYXlCdWZmZXIsXG4gIE5hdGl2ZU9iamVjdCxcbiAgTmF0aXZlUHJveHksXG4gIE5hdGl2ZVJhbmdlRXJyb3IsXG4gIE5hdGl2ZVNldCxcbiAgTmF0aXZlVHlwZUVycm9yLFxuICBOYXRpdmVVaW50MTZBcnJheSxcbiAgTmF0aXZlV2Vha01hcCxcbiAgTnVtYmVySXNOYU4sXG4gIE9iamVjdERlZmluZVByb3BlcnR5LFxuICBPYmplY3RGcmVlemUsXG4gIE9iamVjdEhhc093bixcbiAgUmVmbGVjdEFwcGx5LFxuICBSZWZsZWN0Q29uc3RydWN0LFxuICBSZWZsZWN0RGVmaW5lUHJvcGVydHksXG4gIFJlZmxlY3RHZXQsXG4gIFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIFJlZmxlY3RHZXRQcm90b3R5cGVPZixcbiAgUmVmbGVjdEhhcyxcbiAgUmVmbGVjdE93bktleXMsXG4gIFJlZmxlY3RTZXQsXG4gIFJlZmxlY3RTZXRQcm90b3R5cGVPZixcbiAgU2V0UHJvdG90eXBlQWRkLFxuICBTZXRQcm90b3R5cGVIYXMsXG4gIFN5bWJvbEZvcixcbiAgU3ltYm9sSXRlcmF0b3IsXG4gIFN5bWJvbFRvU3RyaW5nVGFnLFxuICBUeXBlZEFycmF5LFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBUeXBlZEFycmF5UHJvdG90eXBlQ29weVdpdGhpbixcbiAgVHlwZWRBcnJheVByb3RvdHlwZUVudHJpZXMsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVGaWxsLFxuICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyLFxuICBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUtleXMsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVSZXZlcnNlLFxuICBUeXBlZEFycmF5UHJvdG90eXBlU2V0LFxuICBUeXBlZEFycmF5UHJvdG90eXBlU2xpY2UsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVTb3J0LFxuICBUeXBlZEFycmF5UHJvdG90eXBlU3ViYXJyYXksXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVWYWx1ZXMsXG4gIFVpbnQxNkFycmF5RnJvbSxcbiAgV2Vha01hcFByb3RvdHlwZUdldCxcbiAgV2Vha01hcFByb3RvdHlwZUhhcyxcbiAgV2Vha01hcFByb3RvdHlwZVNldCxcbn0gZnJvbSBcIi4vX3V0aWwvcHJpbW9yZGlhbHMubWpzXCI7XG5pbXBvcnQge1xuICBJc0RldGFjaGVkQnVmZmVyLFxuICBMZW5ndGhPZkFycmF5TGlrZSxcbiAgU3BlY2llc0NvbnN0cnVjdG9yLFxuICBUb0ludGVnZXJPckluZmluaXR5LFxuICBkZWZhdWx0Q29tcGFyZSxcbn0gZnJvbSBcIi4vX3V0aWwvc3BlYy5tanNcIjtcblxuY29uc3QgQllURVNfUEVSX0VMRU1FTlQgPSAyO1xuXG5jb25zdCBicmFuZCA9IFN5bWJvbEZvcihcIl9fRmxvYXQxNkFycmF5X19cIik7XG5cbi8qKiBAdHlwZSB7V2Vha01hcDxGbG9hdDE2QXJyYXksIFVpbnQxNkFycmF5ICYgeyBfX2Zsb2F0MTZiaXRzOiBuZXZlciB9Pn0gKi9cbmNvbnN0IGZsb2F0MTZiaXRzQXJyYXlzID0gbmV3IE5hdGl2ZVdlYWtNYXAoKTtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGhhc0Zsb2F0MTZBcnJheUJyYW5kKHRhcmdldCkge1xuICBpZiAoIWlzT2JqZWN0TGlrZSh0YXJnZXQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcHJvdG90eXBlID0gUmVmbGVjdEdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gIGlmICghaXNPYmplY3RMaWtlKHByb3RvdHlwZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBjb25zdHJ1Y3RvciA9IHByb3RvdHlwZS5jb25zdHJ1Y3RvcjtcbiAgaWYgKGNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCFpc09iamVjdChjb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ09OU1RSVUNUT1JfSVNfTk9UX0FfT0JKRUNUKTtcbiAgfVxuXG4gIHJldHVybiBSZWZsZWN0SGFzKGNvbnN0cnVjdG9yLCBicmFuZCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHt0YXJnZXQgaXMgRmxvYXQxNkFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGbG9hdDE2QXJyYXkodGFyZ2V0KSB7XG4gIHJldHVybiBXZWFrTWFwUHJvdG90eXBlSGFzKGZsb2F0MTZiaXRzQXJyYXlzLCB0YXJnZXQpIHx8XG4gICAgKGhhc0Zsb2F0MTZBcnJheUJyYW5kKHRhcmdldCkgJiYgIUFycmF5QnVmZmVySXNWaWV3KHRhcmdldCkpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcmV0dXJucyB7YXNzZXJ0cyB0YXJnZXQgaXMgRmxvYXQxNkFycmF5fVxuICovXG5mdW5jdGlvbiBhc3NlcnRGbG9hdDE2QXJyYXkodGFyZ2V0KSB7XG4gIGlmICghaXNGbG9hdDE2QXJyYXkodGFyZ2V0KSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSElTX0lTX05PVF9BX0ZMT0FUMTZBUlJBWSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHBhcmFtIHtudW1iZXI9fSBjb3VudFxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge2Fzc2VydHMgdGFyZ2V0IGlzIFVpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDE2QXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheX1cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0U3BlY2llc1R5cGVkQXJyYXkodGFyZ2V0LCBjb3VudCkge1xuICBjb25zdCBpc1RhcmdldEZsb2F0MTZBcnJheSA9IGlzRmxvYXQxNkFycmF5KHRhcmdldCk7XG4gIGNvbnN0IGlzVGFyZ2V0VHlwZWRBcnJheSA9IGlzVHlwZWRBcnJheSh0YXJnZXQpO1xuXG4gIGlmICghaXNUYXJnZXRGbG9hdDE2QXJyYXkgJiYgIWlzVGFyZ2V0VHlwZWRBcnJheSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihTUEVDSUVTQ09OU1RSVUNUT1JfRElETlRfUkVUVVJOX1RZUEVEQVJSQVkpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBjb3VudCA9PT0gXCJudW1iZXJcIikge1xuICAgIGxldCBsZW5ndGg7XG4gICAgaWYgKGlzVGFyZ2V0RmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0YXJnZXQpO1xuICAgICAgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aCh0YXJnZXQpO1xuICAgIH1cblxuICAgIGlmIChsZW5ndGggPCBjb3VudCkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBERVJJVkVEX1RZUEVEQVJSQVlfQ09OU1RSVUNUT1JfQ1JFQVRFRF9BTl9BUlJBWV9XSElDSF9XQVNfVE9PX1NNQUxMXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChpc0JpZ0ludFR5cGVkQXJyYXkodGFyZ2V0KSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVMpO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHtGbG9hdDE2QXJyYXl9IGZsb2F0MTZcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEByZXR1cm5zIHtVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfX1cbiAqL1xuZnVuY3Rpb24gZ2V0RmxvYXQxNkJpdHNBcnJheShmbG9hdDE2KSB7XG4gIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBXZWFrTWFwUHJvdG90eXBlR2V0KGZsb2F0MTZiaXRzQXJyYXlzLCBmbG9hdDE2KTtcbiAgaWYgKGZsb2F0MTZiaXRzQXJyYXkgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgaWYgKElzRGV0YWNoZWRCdWZmZXIoYnVmZmVyKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFRISVNfQlVGRkVSX0hBU19BTFJFQURZX0JFRU5fREVUQUNIRUQpO1xuICAgIH1cbiAgICByZXR1cm4gZmxvYXQxNmJpdHNBcnJheTtcbiAgfVxuXG4gIC8vIEB0cy1pZ25vcmVcbiAgY29uc3QgYnVmZmVyID0gZmxvYXQxNi5idWZmZXI7XG4gIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhJU19CVUZGRVJfSEFTX0FMUkVBRFlfQkVFTl9ERVRBQ0hFRCk7XG4gIH1cblxuICAvLyBmcm9tIGFub3RoZXIgRmxvYXQxNkFycmF5IGluc3RhbmNlIChhIGRpZmZlcmVudCB2ZXJzaW9uPylcbiAgY29uc3QgY2xvbmVkID0gUmVmbGVjdENvbnN0cnVjdChGbG9hdDE2QXJyYXksIFtcbiAgICBidWZmZXIsXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGZsb2F0MTYuYnl0ZU9mZnNldCxcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZmxvYXQxNi5sZW5ndGgsXG4gIF0sIGZsb2F0MTYuY29uc3RydWN0b3IpO1xuICByZXR1cm4gV2Vha01hcFByb3RvdHlwZUdldChmbG9hdDE2Yml0c0FycmF5cywgY2xvbmVkKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1VpbnQxNkFycmF5ICYgeyBfX2Zsb2F0MTZiaXRzOiBuZXZlciB9fSBmbG9hdDE2Yml0c0FycmF5XG4gKiBAcmV0dXJucyB7bnVtYmVyW119XG4gKi9cbmZ1bmN0aW9uIGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpIHtcbiAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICBjb25zdCBhcnJheSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgYXJyYXlbaV0gPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gIH1cblxuICByZXR1cm4gYXJyYXk7XG59XG5cbmNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXR0ZXJzID0gbmV3IE5hdGl2ZVNldCgpO1xuZm9yIChjb25zdCBrZXkgb2YgUmVmbGVjdE93bktleXMoVHlwZWRBcnJheVByb3RvdHlwZSkpIHtcbiAgLy8gQEB0b1N0cmluZ1RhZyBtZXRob2QgaXMgZGVmaW5lZCBpbiBGbG9hdDE2QXJyYXkucHJvdG90eXBlXG4gIGlmIChrZXkgPT09IFN5bWJvbFRvU3RyaW5nVGFnKSB7XG4gICAgY29udGludWU7XG4gIH1cblxuICBjb25zdCBkZXNjcmlwdG9yID0gUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihUeXBlZEFycmF5UHJvdG90eXBlLCBrZXkpO1xuICBpZiAoT2JqZWN0SGFzT3duKGRlc2NyaXB0b3IsIFwiZ2V0XCIpKSB7XG4gICAgU2V0UHJvdG90eXBlQWRkKFR5cGVkQXJyYXlQcm90b3R5cGVHZXR0ZXJzLCBrZXkpO1xuICB9XG59XG5cbmNvbnN0IGhhbmRsZXIgPSBPYmplY3RGcmVlemUoLyoqIEB0eXBlIHtQcm94eUhhbmRsZXI8RmxvYXQxNkFycmF5Pn0gKi8gKHtcbiAgZ2V0KHRhcmdldCwga2V5LCByZWNlaXZlcikge1xuICAgIGlmIChpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyhrZXkpICYmIE9iamVjdEhhc093bih0YXJnZXQsIGtleSkpIHtcbiAgICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoUmVmbGVjdEdldCh0YXJnZXQsIGtleSkpO1xuICAgIH1cblxuICAgIC8vICVUeXBlZEFycmF5JS5wcm90b3R5cGUgZ2V0dGVyIHByb3BlcnRpZXMgY2Fubm90IGNhbGxlZCBieSBQcm94eSByZWNlaXZlclxuICAgIGlmIChTZXRQcm90b3R5cGVIYXMoVHlwZWRBcnJheVByb3RvdHlwZUdldHRlcnMsIGtleSkpIHtcbiAgICAgIHJldHVybiBSZWZsZWN0R2V0KHRhcmdldCwga2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVmbGVjdEdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpO1xuICB9LFxuXG4gIHNldCh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgaWYgKGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKGtleSkgJiYgT2JqZWN0SGFzT3duKHRhcmdldCwga2V5KSkge1xuICAgICAgcmV0dXJuIFJlZmxlY3RTZXQodGFyZ2V0LCBrZXksIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0U2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpO1xuICB9LFxuXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkge1xuICAgIGlmIChpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyhrZXkpICYmIE9iamVjdEhhc093bih0YXJnZXQsIGtleSkpIHtcbiAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZGVzY3JpcHRvci52YWx1ZSk7XG4gICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gIH0sXG5cbiAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgICBpZiAoXG4gICAgICBpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyhrZXkpICYmXG4gICAgICBPYmplY3RIYXNPd24odGFyZ2V0LCBrZXkpICYmXG4gICAgICBPYmplY3RIYXNPd24oZGVzY3JpcHRvciwgXCJ2YWx1ZVwiKVxuICAgICkge1xuICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhkZXNjcmlwdG9yLnZhbHVlKTtcbiAgICAgIHJldHVybiBSZWZsZWN0RGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0RGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpO1xuICB9LFxufSkpO1xuXG5leHBvcnQgY2xhc3MgRmxvYXQxNkFycmF5IHtcbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10eXBlZGFycmF5ICovXG4gIGNvbnN0cnVjdG9yKGlucHV0LCBfYnl0ZU9mZnNldCwgX2xlbmd0aCkge1xuICAgIC8qKiBAdHlwZSB7VWludDE2QXJyYXkgJiB7IF9fZmxvYXQxNmJpdHM6IG5ldmVyIH19ICovXG4gICAgbGV0IGZsb2F0MTZiaXRzQXJyYXk7XG5cbiAgICBpZiAoaXNGbG9hdDE2QXJyYXkoaW5wdXQpKSB7XG4gICAgICAvLyBwZWVsIG9mZiBQcm94eVxuICAgICAgZmxvYXQxNmJpdHNBcnJheSA9IFJlZmxlY3RDb25zdHJ1Y3QoTmF0aXZlVWludDE2QXJyYXksIFtnZXRGbG9hdDE2Qml0c0FycmF5KGlucHV0KV0sIG5ldy50YXJnZXQpO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoaW5wdXQpICYmICFpc0FycmF5QnVmZmVyKGlucHV0KSkgeyAvLyBvYmplY3Qgd2l0aG91dCBBcnJheUJ1ZmZlclxuICAgICAgLyoqIEB0eXBlIHtBcnJheUxpa2U8dW5rbm93bj59ICovXG4gICAgICBsZXQgbGlzdDtcbiAgICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICAgICAgbGV0IGxlbmd0aDtcblxuICAgICAgaWYgKGlzVHlwZWRBcnJheShpbnB1dCkpIHsgLy8gVHlwZWRBcnJheVxuICAgICAgICBsaXN0ID0gaW5wdXQ7XG4gICAgICAgIGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoaW5wdXQpO1xuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoaW5wdXQpO1xuICAgICAgICBjb25zdCBCdWZmZXJDb25zdHJ1Y3RvciA9ICFpc1NoYXJlZEFycmF5QnVmZmVyKGJ1ZmZlcilcbiAgICAgICAgICA/IC8qKiBAdHlwZSB7QXJyYXlCdWZmZXJDb25zdHJ1Y3Rvcn0gKi8gKFNwZWNpZXNDb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIGJ1ZmZlcixcbiAgICAgICAgICAgIE5hdGl2ZUFycmF5QnVmZmVyXG4gICAgICAgICAgKSlcbiAgICAgICAgICA6IE5hdGl2ZUFycmF5QnVmZmVyO1xuXG4gICAgICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICAgICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhJU19CVUZGRVJfSEFTX0FMUkVBRFlfQkVFTl9ERVRBQ0hFRCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNCaWdJbnRUeXBlZEFycmF5KGlucHV0KSkge1xuICAgICAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBCdWZmZXJDb25zdHJ1Y3RvcihcbiAgICAgICAgICBsZW5ndGggKiBCWVRFU19QRVJfRUxFTUVOVFxuICAgICAgICApO1xuICAgICAgICBmbG9hdDE2Yml0c0FycmF5ID0gUmVmbGVjdENvbnN0cnVjdChOYXRpdmVVaW50MTZBcnJheSwgW2RhdGFdLCBuZXcudGFyZ2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc0l0ZXJhYmxlKGlucHV0KSkgeyAvLyBJdGVyYWJsZSAoQXJyYXkpXG4gICAgICAgICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgICAgICAgIGlmIChpc09yZGluYXJ5QXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBsaXN0ID0gaW5wdXQ7XG4gICAgICAgICAgICBsZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpc3QgPSBbLi4uaW5wdXRdO1xuICAgICAgICAgICAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvLyBBcnJheUxpa2VcbiAgICAgICAgICBsaXN0ID0gLyoqIEB0eXBlIHtBcnJheUxpa2U8dW5rbm93bj59ICovIChpbnB1dCk7XG4gICAgICAgICAgbGVuZ3RoID0gTGVuZ3RoT2ZBcnJheUxpa2UoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBbbGVuZ3RoXSwgbmV3LnRhcmdldCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNldCB2YWx1ZXNcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZmxvYXQxNmJpdHNBcnJheVtpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhsaXN0W2ldKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyBwcmltaXRpdmUsIEFycmF5QnVmZmVyXG4gICAgICBmbG9hdDE2Yml0c0FycmF5ID0gUmVmbGVjdENvbnN0cnVjdChOYXRpdmVVaW50MTZBcnJheSwgYXJndW1lbnRzLCBuZXcudGFyZ2V0KTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm94eSA9IG5ldyBOYXRpdmVQcm94eSgvKiogQHR5cGUge2FueX0gKi8gKGZsb2F0MTZiaXRzQXJyYXkpLCBoYW5kbGVyKTtcblxuICAgIC8vIHByb3h5IHByaXZhdGUgc3RvcmFnZVxuICAgIFdlYWtNYXBQcm90b3R5cGVTZXQoZmxvYXQxNmJpdHNBcnJheXMsIHByb3h5LCBmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIHJldHVybiBwcm94eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiBgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRmxvYXQxNkFycmF5KWAgb3IgYFJlZmxlY3Qub3duS2V5cyhGbG9hdDE2QXJyYXkpYCBpbmNsdWRlIHRoaXMga2V5XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUuZnJvbVxuICAgKi9cbiAgc3RhdGljIGZyb20oc3JjLCAuLi5vcHRzKSB7XG4gICAgY29uc3QgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgaWYgKCFSZWZsZWN0SGFzKENvbnN0cnVjdG9yLCBicmFuZCkpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBpZiAoaXNGbG9hdDE2QXJyYXkoc3JjKSAmJiBvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShzcmMpO1xuICAgICAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldChmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlKHVpbnQxNikpXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKFxuICAgICAgICAgICAgVWludDE2QXJyYXlGcm9tKHNyYywgcm91bmRUb0Zsb2F0MTZCaXRzKVxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWFwRnVuYyA9IG9wdHNbMF07XG4gICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1sxXTtcblxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgICAgVWludDE2QXJyYXlGcm9tKHNyYywgZnVuY3Rpb24gKHZhbCwgLi4uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHJvdW5kVG9GbG9hdDE2Qml0cyhcbiAgICAgICAgICAgICAgUmVmbGVjdEFwcGx5KG1hcEZ1bmMsIHRoaXMsIFt2YWwsIC4uLmFyZ3NdKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9LCB0aGlzQXJnKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7QXJyYXlMaWtlPHVua25vd24+fSAqL1xuICAgIGxldCBsaXN0O1xuICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICAgIGxldCBsZW5ndGg7XG5cbiAgICBpZiAoaXNJdGVyYWJsZShzcmMpKSB7IC8vIEl0ZXJhYmxlIChUeXBlZEFycmF5LCBBcnJheSlcbiAgICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICAgIGlmIChpc09yZGluYXJ5QXJyYXkoc3JjKSkge1xuICAgICAgICBsaXN0ID0gc3JjO1xuICAgICAgICBsZW5ndGggPSBzcmMubGVuZ3RoO1xuICAgICAgfSBlbHNlIGlmIChpc09yZGluYXJ5VHlwZWRBcnJheShzcmMpKSB7XG4gICAgICAgIGxpc3QgPSBzcmM7XG4gICAgICAgIGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoc3JjKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpc3QgPSBbLi4uc3JjXTtcbiAgICAgICAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8gQXJyYXlMaWtlXG4gICAgICBsaXN0ID0gc3JjO1xuICAgICAgbGVuZ3RoID0gTGVuZ3RoT2ZBcnJheUxpa2Uoc3JjKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gLyoqIEB0eXBlIHtudW1iZXJ9ICovIChsaXN0W2ldKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbWFwRnVuYyA9IG9wdHNbMF07XG4gICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1sxXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgYXJyYXlbaV0gPSBSZWZsZWN0QXBwbHkobWFwRnVuYywgdGhpc0FyZywgW2xpc3RbaV0sIGldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZsb2F0MTZBcnJheSlgIG9yIGBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5KWAgaW5jbHVkZSB0aGlzIGtleVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLm9mXG4gICAqL1xuICBzdGF0aWMgb2YoLi4uaXRlbXMpIHtcbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICBpZiAoIVJlZmxlY3RIYXMoQ29uc3RydWN0b3IsIGJyYW5kKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBsZW5ndGggPSBpdGVtcy5sZW5ndGg7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IHByb3h5ID0gbmV3IEZsb2F0MTZBcnJheShsZW5ndGgpO1xuICAgICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkocHJveHkpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXlbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMoaXRlbXNbaV0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGFycmF5W2ldID0gaXRlbXNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmtleXMgKi9cbiAga2V5cygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gVHlwZWRBcnJheVByb3RvdHlwZUtleXMoZmxvYXQxNmJpdHNBcnJheSk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogcmV0dXJucyBhIG9iamVjdCB3aG9zZSBwcm90b3R5cGUgaXMgbm90IGAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSVgXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnZhbHVlc1xuICAgKi9cbiAgdmFsdWVzKCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIHJldHVybiB3cmFwSW5BcnJheUl0ZXJhdG9yKChmdW5jdGlvbiogKCkge1xuICAgICAgZm9yIChjb25zdCB2YWwgb2YgVHlwZWRBcnJheVByb3RvdHlwZVZhbHVlcyhmbG9hdDE2Yml0c0FycmF5KSkge1xuICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiByZXR1cm5zIGEgb2JqZWN0IHdob3NlIHByb3RvdHlwZSBpcyBub3QgYCVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJWBcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZW50cmllc1xuICAgKi9cbiAgZW50cmllcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gKHdyYXBJbkFycmF5SXRlcmF0b3IoKGZ1bmN0aW9uKiAoKSB7XG4gICAgICBmb3IgKGNvbnN0IFtpLCB2YWxdIG9mIFR5cGVkQXJyYXlQcm90b3R5cGVFbnRyaWVzKGZsb2F0MTZiaXRzQXJyYXkpKSB7XG4gICAgICAgIHlpZWxkIC8qKiBAdHlwZSB7W051bWJlciwgbnVtYmVyXX0gKi8gKFtpLCBjb252ZXJ0VG9OdW1iZXIodmFsKV0pO1xuICAgICAgfVxuICAgIH0pKCkpKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5hdCAqL1xuICBhdChpbmRleCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgcmVsYXRpdmVJbmRleCA9IFRvSW50ZWdlck9ySW5maW5pdHkoaW5kZXgpO1xuICAgIGNvbnN0IGsgPSByZWxhdGl2ZUluZGV4ID49IDAgPyByZWxhdGl2ZUluZGV4IDogbGVuZ3RoICsgcmVsYXRpdmVJbmRleDtcblxuICAgIGlmIChrIDwgMCB8fCBrID49IGxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtrXSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUubWFwICovXG4gIG1hcChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBwcm94eSA9IG5ldyBGbG9hdDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgIGNvbnN0IGFycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShwcm94eSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgICBhcnJheVtpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhcbiAgICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSwgbGVuZ3RoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGFycmF5W2ldID0gUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdmFsLCBpLCB0aGlzXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbHRlciAqL1xuICBmaWx0ZXIoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgY29uc3Qga2VwdCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKSkge1xuICAgICAgICBBcnJheVByb3RvdHlwZVB1c2goa2VwdCwgdmFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGtlcHQpO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5KTtcblxuICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKGFycmF5KTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5yZWR1Y2UgKi9cbiAgcmVkdWNlKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbMF0pO1xuICAgICAgc3RhcnQgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soXG4gICAgICAgIGFjY3VtdWxhdG9yLFxuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJlZHVjZXJpZ2h0ICovXG4gIHJlZHVjZVJpZ2h0KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbbGVuZ3RoIC0gMV0pO1xuICAgICAgc3RhcnQgPSBsZW5ndGggLSAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IGxlbmd0aCAtIDE7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpID49IDA7IC0taSkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjYWxsYmFjayhcbiAgICAgICAgYWNjdW11bGF0b3IsXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgaSxcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZm9yZWFjaCAqL1xuICBmb3JFYWNoKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW1xuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXMsXG4gICAgICBdKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZCAqL1xuICBmaW5kKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kaW5kZXggKi9cbiAgZmluZEluZGV4KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLWFycmF5LWZpbmQtZnJvbS1sYXN0L2luZGV4Lmh0bWwjc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZGxhc3QgKi9cbiAgZmluZExhc3QoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtYXJyYXktZmluZC1mcm9tLWxhc3QvaW5kZXguaHRtbCNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kbGFzdGluZGV4ICovXG4gIGZpbmRMYXN0SW5kZXgoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5ldmVyeSAqL1xuICBldmVyeShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoXG4gICAgICAgICFSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICBdKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb21lICovXG4gIHNvbWUoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKFxuICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICBdKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zZXQgKi9cbiAgc2V0KGlucHV0LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGFyZ2V0T2Zmc2V0ID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAodGFyZ2V0T2Zmc2V0IDwgMCkge1xuICAgICAgdGhyb3cgTmF0aXZlUmFuZ2VFcnJvcihPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyk7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0ID09IG51bGwpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpc0JpZ0ludFR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFU1xuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KGlucHV0KSkge1xuICAgICAgLy8gcGVlbCBvZmYgUHJveHlcbiAgICAgIHJldHVybiBUeXBlZEFycmF5UHJvdG90eXBlU2V0KFxuICAgICAgICBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpLFxuICAgICAgICBnZXRGbG9hdDE2Qml0c0FycmF5KGlucHV0KSxcbiAgICAgICAgdGFyZ2V0T2Zmc2V0XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpc1R5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGlucHV0KTtcbiAgICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFRISVNfQlVGRkVSX0hBU19BTFJFQURZX0JFRU5fREVUQUNIRUQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldExlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICBjb25zdCBzcmMgPSBOYXRpdmVPYmplY3QoaW5wdXQpO1xuICAgIGNvbnN0IHNyY0xlbmd0aCA9IExlbmd0aE9mQXJyYXlMaWtlKHNyYyk7XG5cbiAgICBpZiAodGFyZ2V0T2Zmc2V0ID09PSBJbmZpbml0eSB8fCBzcmNMZW5ndGggKyB0YXJnZXRPZmZzZXQgPiB0YXJnZXRMZW5ndGgpIHtcbiAgICAgIHRocm93IE5hdGl2ZVJhbmdlRXJyb3IoT0ZGU0VUX0lTX09VVF9PRl9CT1VORFMpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3JjTGVuZ3RoOyArK2kpIHtcbiAgICAgIGZsb2F0MTZiaXRzQXJyYXlbaSArIHRhcmdldE9mZnNldF0gPSByb3VuZFRvRmxvYXQxNkJpdHMoc3JjW2ldKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUucmV2ZXJzZSAqL1xuICByZXZlcnNlKCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVSZXZlcnNlKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmlsbCAqL1xuICBmaWxsKHZhbHVlLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgVHlwZWRBcnJheVByb3RvdHlwZUZpbGwoXG4gICAgICBmbG9hdDE2Yml0c0FycmF5LFxuICAgICAgcm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSxcbiAgICAgIC4uLm9wdHNcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuY29weXdpdGhpbiAqL1xuICBjb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBUeXBlZEFycmF5UHJvdG90eXBlQ29weVdpdGhpbihmbG9hdDE2Yml0c0FycmF5LCB0YXJnZXQsIHN0YXJ0LCAuLi5vcHRzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNvcnQgKi9cbiAgc29ydCguLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgY29tcGFyZSA9IG9wdHNbMF0gIT09IHVuZGVmaW5lZCA/IG9wdHNbMF0gOiBkZWZhdWx0Q29tcGFyZTtcbiAgICBUeXBlZEFycmF5UHJvdG90eXBlU29ydChmbG9hdDE2Yml0c0FycmF5LCAoeCwgeSkgPT4ge1xuICAgICAgcmV0dXJuIGNvbXBhcmUoY29udmVydFRvTnVtYmVyKHgpLCBjb252ZXJ0VG9OdW1iZXIoeSkpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc2xpY2UgKi9cbiAgc2xpY2UoLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBOYXRpdmVVaW50MTZBcnJheShcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSlcbiAgICAgICk7XG4gICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlU2xpY2UodWludDE2LCAuLi5vcHRzKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3Qgc3RhcnQgPSBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pO1xuICAgIGNvbnN0IGVuZCA9IG9wdHNbMV0gPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1sxXSk7XG5cbiAgICBsZXQgaztcbiAgICBpZiAoc3RhcnQgPT09IC1JbmZpbml0eSkge1xuICAgICAgayA9IDA7XG4gICAgfSBlbHNlIGlmIChzdGFydCA8IDApIHtcbiAgICAgIGsgPSBsZW5ndGggKyBzdGFydCA+IDAgPyBsZW5ndGggKyBzdGFydCA6IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGsgPSBsZW5ndGggPCBzdGFydCA/IGxlbmd0aCA6IHN0YXJ0O1xuICAgIH1cblxuICAgIGxldCBmaW5hbDtcbiAgICBpZiAoZW5kID09PSAtSW5maW5pdHkpIHtcbiAgICAgIGZpbmFsID0gMDtcbiAgICB9IGVsc2UgaWYgKGVuZCA8IDApIHtcbiAgICAgIGZpbmFsID0gbGVuZ3RoICsgZW5kID4gMCA/IGxlbmd0aCArIGVuZCA6IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbmFsID0gbGVuZ3RoIDwgZW5kID8gbGVuZ3RoIDogZW5kO1xuICAgIH1cblxuICAgIGNvbnN0IGNvdW50ID0gZmluYWwgLSBrID4gMCA/IGZpbmFsIC0gayA6IDA7XG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IoY291bnQpO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5LCBjb3VudCk7XG5cbiAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG5cbiAgICBjb25zdCBidWZmZXIgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSElTX0JVRkZFUl9IQVNfQUxSRUFEWV9CRUVOX0RFVEFDSEVEKTtcbiAgICB9XG5cbiAgICBsZXQgbiA9IDA7XG4gICAgd2hpbGUgKGsgPCBmaW5hbCkge1xuICAgICAgYXJyYXlbbl0gPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtrXSk7XG4gICAgICArK2s7XG4gICAgICArK247XG4gICAgfVxuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnN1YmFycmF5ICovXG4gIHN1YmFycmF5KC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgY29uc3QgdWludDE2ID0gbmV3IE5hdGl2ZVVpbnQxNkFycmF5KFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KVxuICAgICk7XG4gICAgY29uc3QgdWludDE2U3ViYXJyYXkgPSBUeXBlZEFycmF5UHJvdG90eXBlU3ViYXJyYXkodWludDE2LCAuLi5vcHRzKTtcblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcih1aW50MTZTdWJhcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldCh1aW50MTZTdWJhcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKHVpbnQxNlN1YmFycmF5KVxuICAgICk7XG4gICAgYXNzZXJ0U3BlY2llc1R5cGVkQXJyYXkoYXJyYXkpO1xuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmluZGV4b2YgKi9cbiAgaW5kZXhPZihlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAoZnJvbSA9PT0gSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBmcm9tOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChcbiAgICAgICAgT2JqZWN0SGFzT3duKGZsb2F0MTZiaXRzQXJyYXksIGkpICYmXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSA9PT0gZWxlbWVudFxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5sYXN0aW5kZXhvZiAqL1xuICBsYXN0SW5kZXhPZihlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIGxldCBmcm9tID0gb3B0cy5sZW5ndGggPj0gMSA/IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSkgOiBsZW5ndGggLSAxO1xuICAgIGlmIChmcm9tID09PSAtSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA+PSAwKSB7XG4gICAgICBmcm9tID0gZnJvbSA8IGxlbmd0aCAtIDEgPyBmcm9tIDogbGVuZ3RoIC0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPj0gMDsgLS1pKSB7XG4gICAgICBpZiAoXG4gICAgICAgIE9iamVjdEhhc093bihmbG9hdDE2Yml0c0FycmF5LCBpKSAmJlxuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSkgPT09IGVsZW1lbnRcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuaW5jbHVkZXMgKi9cbiAgaW5jbHVkZXMoZWxlbWVudCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICBsZXQgZnJvbSA9IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSk7XG4gICAgaWYgKGZyb20gPT09IEluZmluaXR5KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICBmcm9tID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpc05hTiA9IE51bWJlcklzTmFOKGVsZW1lbnQpO1xuICAgIGZvciAobGV0IGkgPSBmcm9tOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuXG4gICAgICBpZiAoaXNOYU4gJiYgTnVtYmVySXNOYU4odmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmpvaW4gKi9cbiAgam9pbiguLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgYXJyYXkgPSBjb3B5VG9BcnJheShmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIHJldHVybiBBcnJheVByb3RvdHlwZUpvaW4oYXJyYXksIC4uLm9wdHMpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnRvbG9jYWxlc3RyaW5nICovXG4gIHRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiBBcnJheVByb3RvdHlwZVRvTG9jYWxlU3RyaW5nKGFycmF5LCAuLi5vcHRzKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtZ2V0LSV0eXBlZGFycmF5JS5wcm90b3R5cGUtQEB0b3N0cmluZ3RhZyAqL1xuICBnZXQgW1N5bWJvbFRvU3RyaW5nVGFnXSgpIHtcbiAgICBpZiAoaXNGbG9hdDE2QXJyYXkodGhpcykpIHtcbiAgICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKFwiRmxvYXQxNkFycmF5XCIpO1xuICAgIH1cbiAgfVxufVxuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXR5cGVkYXJyYXkuYnl0ZXNfcGVyX2VsZW1lbnQgKi9cbk9iamVjdERlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheSwgXCJCWVRFU19QRVJfRUxFTUVOVFwiLCB7XG4gIHZhbHVlOiBCWVRFU19QRVJfRUxFTUVOVCxcbn0pO1xuXG4vLyBsaW1pdGF0aW9uOiBJdCBpcyBwZWFrZWQgYnkgYE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoRmxvYXQxNkFycmF5KWAgYW5kIGBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5KWBcbk9iamVjdERlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheSwgYnJhbmQsIHt9KTtcblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1wcm9wZXJ0aWVzLW9mLXRoZS10eXBlZGFycmF5LWNvbnN0cnVjdG9ycyAqL1xuUmVmbGVjdFNldFByb3RvdHlwZU9mKEZsb2F0MTZBcnJheSwgVHlwZWRBcnJheSk7XG5cbmNvbnN0IEZsb2F0MTZBcnJheVByb3RvdHlwZSA9IEZsb2F0MTZBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdHlwZWRhcnJheS5wcm90b3R5cGUuYnl0ZXNfcGVyX2VsZW1lbnQgKi9cbk9iamVjdERlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheVByb3RvdHlwZSwgXCJCWVRFU19QRVJfRUxFTUVOVFwiLCB7XG4gIHZhbHVlOiBCWVRFU19QRVJfRUxFTUVOVCxcbn0pO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUtQEBpdGVyYXRvciAqL1xuT2JqZWN0RGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5UHJvdG90eXBlLCBTeW1ib2xJdGVyYXRvciwge1xuICB2YWx1ZTogRmxvYXQxNkFycmF5UHJvdG90eXBlLnZhbHVlcyxcbiAgd3JpdGFibGU6IHRydWUsXG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbn0pO1xuXG4vLyBUbyBtYWtlIGBuZXcgRmxvYXQxNkFycmF5KCkgaW5zdGFuY2VvZiBVaW50MTZBcnJheWAgcmV0dXJucyBgZmFsc2VgXG5SZWZsZWN0U2V0UHJvdG90eXBlT2YoRmxvYXQxNkFycmF5UHJvdG90eXBlLCBUeXBlZEFycmF5UHJvdG90eXBlKTtcbiIsImltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHtcbiAgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYsXG4gIERhdGFWaWV3UHJvdG90eXBlU2V0VWludDE2LFxufSBmcm9tIFwiLi9fdXRpbC9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiByZXR1cm5zIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlldy5cbiAqXG4gKiBAcGFyYW0ge0RhdGFWaWV3fSBkYXRhVmlld1xuICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXRcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmxvYXQxNihkYXRhVmlldywgYnl0ZU9mZnNldCwgLi4ub3B0cykge1xuICByZXR1cm4gY29udmVydFRvTnVtYmVyKFxuICAgIERhdGFWaWV3UHJvdG90eXBlR2V0VWludDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCAuLi5vcHRzKVxuICApO1xufVxuXG4vKipcbiAqIHN0b3JlcyBhbiB1bnNpZ25lZCAxNi1iaXQgZmxvYXQgdmFsdWUgYXQgdGhlIHNwZWNpZmllZCBieXRlIG9mZnNldCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgRGF0YVZpZXcuXG4gKlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCB2YWx1ZSwgLi4ub3B0cykge1xuICByZXR1cm4gRGF0YVZpZXdQcm90b3R5cGVTZXRVaW50MTYoXG4gICAgZGF0YVZpZXcsXG4gICAgYnl0ZU9mZnNldCxcbiAgICByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpLFxuICAgIC4uLm9wdHNcbiAgKTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztFQUFBO0VBQ0E7QUFDQTtFQUNBO0VBQ0EsU0FBUyxXQUFXLENBQUMsTUFBTSxFQUFFO0VBQzdCLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksS0FBSztFQUMvQixJQUFJLE9BQU8sWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDL0MsR0FBRyxDQUFDO0VBQ0osQ0FBQztBQUNEO0VBQ0E7RUFDQSxTQUFTLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7RUFDeEMsRUFBRSxPQUFPLFdBQVc7RUFDcEIsSUFBSSwrQkFBK0I7RUFDbkMsTUFBTSxNQUFNO0VBQ1osTUFBTSxHQUFHO0VBQ1QsS0FBSyxDQUFDLEdBQUc7RUFDVCxHQUFHLENBQUM7RUFDSixDQUFDO0FBQ0Q7RUFDQTtFQUNPLE1BQU07RUFDYixFQUFFLEtBQUssRUFBRSxZQUFZO0VBQ3JCLEVBQUUsU0FBUyxFQUFFLGdCQUFnQjtFQUM3QixFQUFFLGNBQWMsRUFBRSxxQkFBcUI7RUFDdkMsRUFBRSxHQUFHLEVBQUUsVUFBVTtFQUNqQixFQUFFLHdCQUF3QixFQUFFLCtCQUErQjtFQUMzRCxFQUFFLGNBQWMsRUFBRSxxQkFBcUI7RUFDdkMsRUFBRSxHQUFHLEVBQUUsVUFBVTtFQUNqQixFQUFFLE9BQU8sRUFBRSxjQUFjO0VBQ3pCLEVBQUUsR0FBRyxFQUFFLFVBQVU7RUFDakIsRUFBRSxjQUFjLEVBQUUscUJBQXFCO0VBQ3ZDLENBQUMsR0FBRyxPQUFPLENBQUM7QUFDWjtFQUNBO0VBQ08sTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDO0FB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
