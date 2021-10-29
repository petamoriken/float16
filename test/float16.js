/*! @petamoriken/float16 v3.5.4-1-g4ef900f | MIT License - https://git.io/float16 */

const float16 = (function (exports) {
  'use strict';

  /* eslint-disable no-restricted-globals */
  /* global SharedArrayBuffer */

  const { bind, call } = Function.prototype;

  /** @type {(target: any) => any} */
  const uncurryThis = bind.bind(call);

  /** @type {(target: any, key: string | symbol) => any} */
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
  const TypedArrayPrototypeGetBuffer = uncurryThis(
    ReflectGetOwnPropertyDescriptor(
      TypedArrayPrototype,
      "buffer"
    ).get
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
  const Uint16ArrayFrom = TypedArray.from.bind(NativeUint16Array);

  // Uint32Array
  const NativeUint32Array = Uint32Array;

  // Float32Array
  const NativeFloat32Array = Float32Array;

  // Iterator
  const IteratorPrototype = ReflectGetPrototypeOf(
    ReflectGetPrototypeOf([][SymbolIterator]())
  );

  // Generator
  const GeneratorPrototype = (function* () {}).constructor.prototype.prototype;
  /** @type {<T = unknown, TReturn = any, TNext = unknown>(generator: Generator<T, TReturn, TNext>, value?: TNext) => T} */
  const GeneratorPrototypeNext = uncurryThis(GeneratorPrototype.next);

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
  const NativeSet = Set;
  const SetPrototype = NativeSet.prototype;
  /** @type {<T>(set: Set<T>, value: T) => Set<T>} */
  const SetPrototypeAdd = uncurryThis(SetPrototype.add);
  /** @type {<T>(set: Set<T>, value: T) => boolean} */
  const SetPrototypeHas = uncurryThis(SetPrototype.has);

  // WeakMap
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
   * returns the nearest half precision float representation of a number.
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
      (hasFloat16ArrayBrand(target) && !isTypedArray(target));
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

  /** @type {ProxyHandler<Float16Array>} */
  const handler = ObjectFreeze({
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
  });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXQxNi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL191dGlsL3ByaW1vcmRpYWxzLm1qcyIsIi4uL3NyYy9fdXRpbC9jb252ZXJ0ZXIubWpzIiwiLi4vc3JjL191dGlsL21lc3NhZ2VzLm1qcyIsIi4uL3NyYy9oZnJvdW5kLm1qcyIsIi4uL3NyYy9fdXRpbC9hcnJheUl0ZXJhdG9yLm1qcyIsIi4uL3NyYy9fdXRpbC9pcy5tanMiLCIuLi9zcmMvX3V0aWwvc3BlYy5tanMiLCIuLi9zcmMvRmxvYXQxNkFycmF5Lm1qcyIsIi4uL3NyYy9EYXRhVmlldy5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovXG4vKiBnbG9iYWwgU2hhcmVkQXJyYXlCdWZmZXIgKi9cblxuY29uc3QgeyBiaW5kLCBjYWxsIH0gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbi8qKiBAdHlwZSB7KHRhcmdldDogYW55KSA9PiBhbnl9ICovXG5jb25zdCB1bmN1cnJ5VGhpcyA9IGJpbmQuYmluZChjYWxsKTtcblxuLyoqIEB0eXBlIHsodGFyZ2V0OiBhbnksIGtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiBhbnl9ICovXG5mdW5jdGlvbiB1bmN1cnJ5VGhpc0dldHRlcih0YXJnZXQsIGtleSkge1xuICByZXR1cm4gdW5jdXJyeVRoaXMoXG4gICAgUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICAgIHRhcmdldCxcbiAgICAgIGtleVxuICAgICkuZ2V0XG4gICk7XG59XG5cbi8vIFJlZmxlY3RcbmV4cG9ydCBjb25zdCB7XG4gIGFwcGx5OiBSZWZsZWN0QXBwbHksXG4gIGNvbnN0cnVjdDogUmVmbGVjdENvbnN0cnVjdCxcbiAgZ2V0OiBSZWZsZWN0R2V0LFxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIGdldFByb3RvdHlwZU9mOiBSZWZsZWN0R2V0UHJvdG90eXBlT2YsXG4gIGhhczogUmVmbGVjdEhhcyxcbiAgb3duS2V5czogUmVmbGVjdE93bktleXMsXG4gIHNldDogUmVmbGVjdFNldCxcbiAgc2V0UHJvdG90eXBlT2Y6IFJlZmxlY3RTZXRQcm90b3R5cGVPZixcbn0gPSBSZWZsZWN0O1xuXG4vLyBQcm94eVxuZXhwb3J0IGNvbnN0IE5hdGl2ZVByb3h5ID0gUHJveHk7XG5cbi8vIE51bWJlclxuZXhwb3J0IGNvbnN0IE5hdGl2ZU51bWJlciA9IE51bWJlcjtcbmV4cG9ydCBjb25zdCB7XG4gIGlzRmluaXRlOiBOdW1iZXJJc0Zpbml0ZSxcbiAgaXNOYU46IE51bWJlcklzTmFOLFxufSA9IE5hdGl2ZU51bWJlcjtcblxuLy8gU3ltYm9sXG5leHBvcnQgY29uc3Qge1xuICBpdGVyYXRvcjogU3ltYm9sSXRlcmF0b3IsXG4gIHNwZWNpZXM6IFN5bWJvbFNwZWNpZXMsXG4gIHRvU3RyaW5nVGFnOiBTeW1ib2xUb1N0cmluZ1RhZyxcbiAgZm9yOiBTeW1ib2xGb3IsXG59ID0gU3ltYm9sO1xuXG4vLyBBcnJheVxuY29uc3QgTmF0aXZlQXJyYXkgPSBBcnJheTtcbmV4cG9ydCBjb25zdCBBcnJheUlzQXJyYXkgPSBOYXRpdmVBcnJheS5pc0FycmF5O1xuY29uc3QgQXJyYXlQcm90b3R5cGUgPSBOYXRpdmVBcnJheS5wcm90b3R5cGU7XG4vKiogQHR5cGUgeyhhcnJheTogQXJyYXk8dW5rbm93bj4sIHNlcGFyYXRvcj86IHN0cmluZykgPT4gc3RyaW5nfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5UHJvdG90eXBlSm9pbiA9IHVuY3VycnlUaGlzKEFycmF5UHJvdG90eXBlLmpvaW4pO1xuLyoqIEB0eXBlIHs8VD4oYXJyYXk6IEFycmF5PFQ+LCAuLi5pdGVtczogVFtdKSA9PiBudW1iZXJ9ICovXG5leHBvcnQgY29uc3QgQXJyYXlQcm90b3R5cGVQdXNoID0gdW5jdXJyeVRoaXMoQXJyYXlQcm90b3R5cGUucHVzaCk7XG4vKiogQHR5cGUgeyhhcnJheTogQXJyYXk8dW5rbm93bj4pID0+IHN0cmluZ30gKi9cbmV4cG9ydCBjb25zdCBBcnJheVByb3RvdHlwZVRvTG9jYWxlU3RyaW5nID0gdW5jdXJyeVRoaXMoXG4gIEFycmF5UHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nXG4pO1xuXG4vLyBPYmplY3RcbmV4cG9ydCBjb25zdCBOYXRpdmVPYmplY3QgPSBPYmplY3Q7XG5leHBvcnQgY29uc3Qge1xuICBjcmVhdGU6IE9iamVjdENyZWF0ZSxcbiAgZGVmaW5lUHJvcGVydHk6IE9iamVjdERlZmluZVByb3BlcnR5LFxuICBmcmVlemU6IE9iamVjdEZyZWV6ZSxcbiAgaXM6IE9iamVjdElzLFxufSA9IE5hdGl2ZU9iamVjdDtcbi8qKiBAdHlwZSB7KG9iamVjdDogb2JqZWN0LCBrZXk6IFByb3BlcnR5S2V5KSA9PiBib29sZWFufSAqL1xuZXhwb3J0IGNvbnN0IE9iamVjdEhhc093biA9IC8qKiBAdHlwZSB7YW55fSAqLyAoTmF0aXZlT2JqZWN0KS5oYXNPd24gfHxcbiAgdW5jdXJyeVRoaXMoTmF0aXZlT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG5cbi8vIE1hdGhcbmV4cG9ydCBjb25zdCBNYXRoVHJ1bmMgPSBNYXRoLnRydW5jO1xuXG4vLyBBcnJheUJ1ZmZlclxuZXhwb3J0IGNvbnN0IE5hdGl2ZUFycmF5QnVmZmVyID0gQXJyYXlCdWZmZXI7XG4vKiogQHR5cGUgeyhidWZmZXI6IEFycmF5QnVmZmVyLCBiZWdpbj86IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBudW1iZXJ9ICovXG5leHBvcnQgY29uc3QgQXJyYXlCdWZmZXJQcm90b3R5cGVTbGljZSA9IHVuY3VycnlUaGlzKE5hdGl2ZUFycmF5QnVmZmVyLnByb3RvdHlwZS5zbGljZSk7XG4vKiogQHR5cGUgeyhidWZmZXI6IEFycmF5QnVmZmVyKSA9PiBBcnJheUJ1ZmZlcn0gKi9cbmV4cG9ydCBjb25zdCBBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGggPSB1bmN1cnJ5VGhpc0dldHRlcihOYXRpdmVBcnJheUJ1ZmZlci5wcm90b3R5cGUsIFwiYnl0ZUxlbmd0aFwiKTtcblxuLy8gU2hhcmVkQXJyYXlCdWZmZXJcbmV4cG9ydCBjb25zdCBOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlciA9IHR5cGVvZiBTaGFyZWRBcnJheUJ1ZmZlciAhPT0gXCJ1bmRlZmluZWRcIiA/IFNoYXJlZEFycmF5QnVmZmVyIDogbnVsbDtcbi8qKiBAdHlwZSB7KGJ1ZmZlcjogU2hhcmVkQXJyYXlCdWZmZXIsIGJlZ2luPzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IG51bWJlcn0gKi9cbmV4cG9ydCBjb25zdCBTaGFyZWRBcnJheUJ1ZmZlclByb3RvdHlwZVNsaWNlID0gTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXJcbiAgJiYgdW5jdXJyeVRoaXMoTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXIucHJvdG90eXBlLnNsaWNlKTtcbi8qKiBAdHlwZSB7KGJ1ZmZlcjogU2hhcmVkQXJyYXlCdWZmZXIpID0+IFNoYXJlZEFycmF5QnVmZmVyfSAqL1xuZXhwb3J0IGNvbnN0IFNoYXJlZEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCA9IE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyXG4gICYmIHVuY3VycnlUaGlzR2V0dGVyKE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyLnByb3RvdHlwZSwgXCJieXRlTGVuZ3RoXCIpO1xuXG4vLyBUeXBlZEFycmF5XG4vKiogQHR5cGVkZWYge1VpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDMyQXJyYXl8RmxvYXQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fEJpZ0ludDY0QXJyYXl9IFR5cGVkQXJyYXkgKi9cbi8qKiBAdHlwZSB7YW55fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXkgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YoVWludDhBcnJheSk7XG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZSA9IFR5cGVkQXJyYXkucHJvdG90eXBlO1xuLyoqIEB0eXBlIHsodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gSXRlcmFibGVJdGVyYXRvcjxudW1iZXI+fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVLZXlzID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5rZXlzKTtcbi8qKiBAdHlwZSB7KHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IEl0ZXJhYmxlSXRlcmF0b3I8bnVtYmVyPn0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlVmFsdWVzID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUudmFsdWVzXG4pO1xuLyoqIEB0eXBlIHsodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gSXRlcmFibGVJdGVyYXRvcjxbbnVtYmVyLCBudW1iZXJdPn0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlRW50cmllcyA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLmVudHJpZXNcbik7XG4vKiogQHR5cGUgeyh0eXBlZEFycmF5OiBUeXBlZEFycmF5LCBhcnJheTogQXJyYXlMaWtlPG51bWJlcj4sIG9mZnNldD86IG51bWJlcikgPT4gdm9pZH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlU2V0ID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5zZXQpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVJldmVyc2UgPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS5yZXZlcnNlXG4pO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHZhbHVlOiBudW1iZXIsIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUZpbGwgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLmZpbGwpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHRhcmdldDogbnVtYmVyLCBzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUNvcHlXaXRoaW4gPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS5jb3B5V2l0aGluXG4pO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIGNvbXBhcmVGbj86IChhOiBudW1iZXIsIGI6IG51bWJlcikgPT4gbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVTb3J0ID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5zb3J0KTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUuc2xpY2UpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVN1YmFycmF5ID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUuc3ViYXJyYXlcbik7XG4vKiogQHR5cGUgeygodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gQXJyYXlCdWZmZXIpfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIgPSB1bmN1cnJ5VGhpcyhcbiAgUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICAgIFwiYnVmZmVyXCJcbiAgKS5nZXRcbik7XG4vKiogQHR5cGUgeygodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gbnVtYmVyKX0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldCA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBcImJ5dGVPZmZzZXRcIlxuKTtcbi8qKiBAdHlwZSB7KCh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBudW1iZXIpfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGggPSB1bmN1cnJ5VGhpc0dldHRlcihcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgXCJsZW5ndGhcIlxuKTtcbi8qKiBAdHlwZSB7KHRhcmdldDogdW5rbm93bikgPT4gc3RyaW5nfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBTeW1ib2xUb1N0cmluZ1RhZ1xuKTtcblxuLy8gVWludDE2QXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVVaW50MTZBcnJheSA9IFVpbnQxNkFycmF5O1xuZXhwb3J0IGNvbnN0IFVpbnQxNkFycmF5RnJvbSA9IFR5cGVkQXJyYXkuZnJvbS5iaW5kKE5hdGl2ZVVpbnQxNkFycmF5KTtcblxuLy8gVWludDMyQXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVVaW50MzJBcnJheSA9IFVpbnQzMkFycmF5O1xuXG4vLyBGbG9hdDMyQXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVGbG9hdDMyQXJyYXkgPSBGbG9hdDMyQXJyYXk7XG5cbi8vIEl0ZXJhdG9yXG5leHBvcnQgY29uc3QgSXRlcmF0b3JQcm90b3R5cGUgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YoXG4gIFJlZmxlY3RHZXRQcm90b3R5cGVPZihbXVtTeW1ib2xJdGVyYXRvcl0oKSlcbik7XG5cbi8vIEdlbmVyYXRvclxuY29uc3QgR2VuZXJhdG9yUHJvdG90eXBlID0gKGZ1bmN0aW9uKiAoKSB7fSkuY29uc3RydWN0b3IucHJvdG90eXBlLnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7PFQgPSB1bmtub3duLCBUUmV0dXJuID0gYW55LCBUTmV4dCA9IHVua25vd24+KGdlbmVyYXRvcjogR2VuZXJhdG9yPFQsIFRSZXR1cm4sIFROZXh0PiwgdmFsdWU/OiBUTmV4dCkgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBHZW5lcmF0b3JQcm90b3R5cGVOZXh0ID0gdW5jdXJyeVRoaXMoR2VuZXJhdG9yUHJvdG90eXBlLm5leHQpO1xuXG4vLyBEYXRhVmlld1xuY29uc3QgRGF0YVZpZXdQcm90b3R5cGUgPSBEYXRhVmlldy5wcm90b3R5cGU7XG4vKiogQHR5cGUgeyhkYXRhVmlldzogRGF0YVZpZXcsIGJ5dGVPZmZzZXQ6IG51bWJlciwgbGl0dGxlRW5kaWFuPzogYm9vbGVhbikgPT4gbnVtYmVyfSAqL1xuZXhwb3J0IGNvbnN0IERhdGFWaWV3UHJvdG90eXBlR2V0VWludDE2ID0gdW5jdXJyeVRoaXMoXG4gIERhdGFWaWV3UHJvdG90eXBlLmdldFVpbnQxNlxuKTtcbi8qKiBAdHlwZSB7KGRhdGFWaWV3OiBEYXRhVmlldywgYnl0ZU9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBsaXR0bGVFbmRpYW4/OiBib29sZWFuKSA9PiB2b2lkfSAqL1xuZXhwb3J0IGNvbnN0IERhdGFWaWV3UHJvdG90eXBlU2V0VWludDE2ID0gdW5jdXJyeVRoaXMoXG4gIERhdGFWaWV3UHJvdG90eXBlLnNldFVpbnQxNlxuKTtcblxuLy8gRXJyb3JcbmV4cG9ydCBjb25zdCBOYXRpdmVUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG5leHBvcnQgY29uc3QgTmF0aXZlUmFuZ2VFcnJvciA9IFJhbmdlRXJyb3I7XG5cbi8vIFNldFxuZXhwb3J0IGNvbnN0IE5hdGl2ZVNldCA9IFNldDtcbmNvbnN0IFNldFByb3RvdHlwZSA9IE5hdGl2ZVNldC5wcm90b3R5cGU7XG4vKiogQHR5cGUgezxUPihzZXQ6IFNldDxUPiwgdmFsdWU6IFQpID0+IFNldDxUPn0gKi9cbmV4cG9ydCBjb25zdCBTZXRQcm90b3R5cGVBZGQgPSB1bmN1cnJ5VGhpcyhTZXRQcm90b3R5cGUuYWRkKTtcbi8qKiBAdHlwZSB7PFQ+KHNldDogU2V0PFQ+LCB2YWx1ZTogVCkgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBTZXRQcm90b3R5cGVIYXMgPSB1bmN1cnJ5VGhpcyhTZXRQcm90b3R5cGUuaGFzKTtcblxuLy8gV2Vha01hcFxuZXhwb3J0IGNvbnN0IE5hdGl2ZVdlYWtNYXAgPSBXZWFrTWFwO1xuY29uc3QgV2Vha01hcFByb3RvdHlwZSA9IE5hdGl2ZVdlYWtNYXAucHJvdG90eXBlO1xuLyoqIEB0eXBlIHs8SyBleHRlbmRzIHt9LCBWPih3ZWFrTWFwOiBXZWFrTWFwPEssIFY+LCBrZXk6IEspID0+IFZ9ICovXG5leHBvcnQgY29uc3QgV2Vha01hcFByb3RvdHlwZUdldCA9IHVuY3VycnlUaGlzKFdlYWtNYXBQcm90b3R5cGUuZ2V0KTtcbi8qKiBAdHlwZSB7PEsgZXh0ZW5kcyB7fSwgVj4od2Vha01hcDogV2Vha01hcDxLLCBWPiwga2V5OiBLKSA9PiBib29sZWFufSAqL1xuZXhwb3J0IGNvbnN0IFdlYWtNYXBQcm90b3R5cGVIYXMgPSB1bmN1cnJ5VGhpcyhXZWFrTWFwUHJvdG90eXBlLmhhcyk7XG4vKiogQHR5cGUgezxLIGV4dGVuZHMge30sIFY+KHdlYWtNYXA6IFdlYWtNYXA8SywgVj4sIGtleTogSywgdmFsdWU6IFYpID0+IFdlYWtNYXB9ICovXG5leHBvcnQgY29uc3QgV2Vha01hcFByb3RvdHlwZVNldCA9IHVuY3VycnlUaGlzKFdlYWtNYXBQcm90b3R5cGUuc2V0KTtcbiIsIi8vIGFsZ29yaXRobTogaHR0cDovL2ZveC10b29sa2l0Lm9yZy9mdHAvZmFzdGhhbGZmbG9hdGNvbnZlcnNpb24ucGRmXG5cbmltcG9ydCB7XG4gIE5hdGl2ZUFycmF5QnVmZmVyLFxuICBOYXRpdmVGbG9hdDMyQXJyYXksXG4gIE5hdGl2ZVVpbnQzMkFycmF5LFxufSBmcm9tIFwiLi9wcmltb3JkaWFscy5tanNcIjtcblxuY29uc3QgYnVmZmVyID0gbmV3IE5hdGl2ZUFycmF5QnVmZmVyKDQpO1xuY29uc3QgZmxvYXRWaWV3ID0gbmV3IE5hdGl2ZUZsb2F0MzJBcnJheShidWZmZXIpO1xuY29uc3QgdWludDMyVmlldyA9IG5ldyBOYXRpdmVVaW50MzJBcnJheShidWZmZXIpO1xuXG5jb25zdCBiYXNlVGFibGUgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoNTEyKTtcbmNvbnN0IHNoaWZ0VGFibGUgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoNTEyKTtcblxuZm9yIChsZXQgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBjb25zdCBlID0gaSAtIDEyNztcblxuICAvLyB2ZXJ5IHNtYWxsIG51bWJlciAoMCwgLTApXG4gIGlmIChlIDwgLTI3KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAweDAwMDA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gMjQ7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgLy8gc21hbGwgbnVtYmVyIChkZW5vcm0pXG4gIH0gZWxzZSBpZiAoZSA8IC0xNCkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gIDB4MDQwMCA+PiAoLWUgLSAxNCk7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAoMHgwNDAwID4+ICgtZSAtIDE0KSkgfCAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gLWUgLSAxO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IC1lIC0gMTtcblxuICAvLyBub3JtYWwgbnVtYmVyXG4gIH0gZWxzZSBpZiAoZSA8PSAxNSkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gIChlICsgMTUpIDw8IDEwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gKChlICsgMTUpIDw8IDEwKSB8IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAxMztcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcblxuICAvLyBsYXJnZSBudW1iZXIgKEluZmluaXR5LCAtSW5maW5pdHkpXG4gIH0gZWxzZSBpZiAoZSA8IDEyOCkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gMHg3YzAwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDI0O1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDI0O1xuXG4gIC8vIHN0YXkgKE5hTiwgSW5maW5pdHksIC1JbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBiYXNlVGFibGVbaV0gICAgICAgICA9IDB4N2MwMDtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ZmMwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAxMztcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcbiAgfVxufVxuXG4vKipcbiAqIHJvdW5kIGEgbnVtYmVyIHRvIGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cy5cbiAqXG4gKiBAcGFyYW0ge3Vua25vd259IG51bSAtIGRvdWJsZSBmbG9hdFxuICogQHJldHVybnMge251bWJlcn0gaGFsZiBmbG9hdCBudW1iZXIgYml0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gcm91bmRUb0Zsb2F0MTZCaXRzKG51bSkge1xuICBmbG9hdFZpZXdbMF0gPSAvKiogQHR5cGUge2FueX0gKi8gKG51bSk7XG4gIGNvbnN0IGYgPSB1aW50MzJWaWV3WzBdO1xuICBjb25zdCBlID0gKGYgPj4gMjMpICYgMHgxZmY7XG4gIHJldHVybiBiYXNlVGFibGVbZV0gKyAoKGYgJiAweDAwN2ZmZmZmKSA+PiBzaGlmdFRhYmxlW2VdKTtcbn1cblxuY29uc3QgbWFudGlzc2FUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSgyMDQ4KTtcbmNvbnN0IGV4cG9uZW50VGFibGUgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoNjQpO1xuY29uc3Qgb2Zmc2V0VGFibGUgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoNjQpO1xuXG5tYW50aXNzYVRhYmxlWzBdID0gMDtcbmZvciAobGV0IGkgPSAxOyBpIDwgMTAyNDsgKytpKSB7XG4gIGxldCBtID0gaSA8PCAxMzsgICAgLy8gemVybyBwYWQgbWFudGlzc2EgYml0c1xuICBsZXQgZSA9IDA7ICAgICAgICAgIC8vIHplcm8gZXhwb25lbnRcblxuICAvLyBub3JtYWxpemVkXG4gIHdoaWxlKChtICYgMHgwMDgwMDAwMCkgPT09IDApIHtcbiAgICBlIC09IDB4MDA4MDAwMDA7ICAvLyBkZWNyZW1lbnQgZXhwb25lbnRcbiAgICBtIDw8PSAxO1xuICB9XG5cbiAgbSAmPSB+MHgwMDgwMDAwMDsgICAvLyBjbGVhciBsZWFkaW5nIDEgYml0XG4gIGUgKz0gMHgzODgwMDAwMDsgICAgLy8gYWRqdXN0IGJpYXNcblxuICBtYW50aXNzYVRhYmxlW2ldID0gbSB8IGU7XG59XG5mb3IgKGxldCBpID0gMTAyNDsgaSA8IDIwNDg7ICsraSkge1xuICBtYW50aXNzYVRhYmxlW2ldID0gMHgzODAwMDAwMCArICgoaSAtIDEwMjQpIDw8IDEzKTtcbn1cblxuZXhwb25lbnRUYWJsZVswXSA9IDA7XG5mb3IgKGxldCBpID0gMTsgaSA8IDMxOyArK2kpIHtcbiAgZXhwb25lbnRUYWJsZVtpXSA9IGkgPDwgMjM7XG59XG5leHBvbmVudFRhYmxlWzMxXSA9IDB4NDc4MDAwMDA7XG5leHBvbmVudFRhYmxlWzMyXSA9IDB4ODAwMDAwMDA7XG5mb3IgKGxldCBpID0gMzM7IGkgPCA2MzsgKytpKSB7XG4gIGV4cG9uZW50VGFibGVbaV0gPSAweDgwMDAwMDAwICsgKChpIC0gMzIpIDw8IDIzKTtcbn1cbmV4cG9uZW50VGFibGVbNjNdID0gMHhjNzgwMDAwMDtcblxub2Zmc2V0VGFibGVbMF0gPSAwO1xuZm9yIChsZXQgaSA9IDE7IGkgPCA2NDsgKytpKSB7XG4gIGlmIChpID09PSAzMikge1xuICAgIG9mZnNldFRhYmxlW2ldID0gMDtcbiAgfSBlbHNlIHtcbiAgICBvZmZzZXRUYWJsZVtpXSA9IDEwMjQ7XG4gIH1cbn1cblxuLyoqXG4gKiBjb252ZXJ0IGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cyB0byBhIG51bWJlci5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gZmxvYXQxNmJpdHMgLSBoYWxmIGZsb2F0IG51bWJlciBiaXRzXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBkb3VibGUgZmxvYXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0cykge1xuICBjb25zdCBtID0gZmxvYXQxNmJpdHMgPj4gMTA7XG4gIHVpbnQzMlZpZXdbMF0gPSBtYW50aXNzYVRhYmxlW29mZnNldFRhYmxlW21dICsgKGZsb2F0MTZiaXRzICYgMHgzZmYpXSArIGV4cG9uZW50VGFibGVbbV07XG4gIHJldHVybiBmbG9hdFZpZXdbMF07XG59XG4iLCJleHBvcnQgY29uc3QgQ09OU1RSVUNUT1JfSVNfTk9UX0FfT0JKRUNUID0gXCJDb25zdHJ1Y3RvciBpcyBub3QgYSBvYmplY3RcIjtcbmV4cG9ydCBjb25zdCBUSElTX0lTX05PVF9BX09CSkVDVCA9IFwiVGhpcyBpcyBub3QgYSBvYmplY3RcIjtcbmV4cG9ydCBjb25zdCBUSElTX0lTX05PVF9BX0ZMT0FUMTZBUlJBWSA9IFwiVGhpcyBpcyBub3QgYSBGbG9hdDE2QXJyYXlcIjtcbmV4cG9ydCBjb25zdCBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWSA9XG4gIFwiVGhpcyBjb25zdHJ1Y3RvciBpcyBub3QgYSBzdWJjbGFzcyBvZiBGbG9hdDE2QXJyYXlcIjtcbmV4cG9ydCBjb25zdCBTUEVDSUVTQ09OU1RSVUNUT1JfRElETlRfUkVUVVJOX1RZUEVEQVJSQVkgPVxuICBcIlNwZWNpZXNDb25zdHJ1Y3RvciBkaWRuJ3QgcmV0dXJuIFR5cGVkQXJyYXlcIjtcbmV4cG9ydCBjb25zdCBERVJJVkVEX1RZUEVEQVJSQVlfQ09OU1RSVUNUT1JfQ1JFQVRFRF9BTl9BUlJBWV9XSElDSF9XQVNfVE9PX1NNQUxMID1cbiAgXCJEZXJpdmVkIFR5cGVkQXJyYXkgY29uc3RydWN0b3IgY3JlYXRlZCBhbiBhcnJheSB3aGljaCB3YXMgdG9vIHNtYWxsXCI7XG5leHBvcnQgY29uc3QgVEhJU19CVUZGRVJfSEFTX0FMUkVBRFlfQkVFTl9ERVRBQ0hFRCA9IFwiVGhpcyBidWZmZXIgaGFzIGFscmVhZHkgYmVlbiBkZXRhY2hlZFwiO1xuZXhwb3J0IGNvbnN0IENBTk5PVF9DT05WRVJUX1VOREVGSU5FRF9PUl9OVUxMX1RPX09CSkVDVCA9XG4gIFwiQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgQ0FOTk9UX0NPTlZFUlRfQV9CSUdJTlRfVkFMVUVfVE9fQV9OVU1CRVIgPVxuICBcIkNhbm5vdCBjb252ZXJ0IGEgQmlnSW50IHZhbHVlIHRvIGEgbnVtYmVyXCI7XG5leHBvcnQgY29uc3QgQ0FOTk9UX01JWF9CSUdJTlRfQU5EX09USEVSX1RZUEVTID1cbiAgXCJDYW5ub3QgbWl4IEJpZ0ludCBhbmQgb3RoZXIgdHlwZXMsIHVzZSBleHBsaWNpdCBjb252ZXJzaW9uc1wiO1xuZXhwb3J0IGNvbnN0IFJFRFVDRV9PRl9FTVBUWV9BUlJBWV9XSVRIX05PX0lOSVRJQUxfVkFMVUUgPVxuICBcIlJlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWVcIjtcbmV4cG9ydCBjb25zdCBPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyA9IFwiT2Zmc2V0IGlzIG91dCBvZiBib3VuZHNcIjtcbiIsImltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHsgQ0FOTk9UX0NPTlZFUlRfQV9CSUdJTlRfVkFMVUVfVE9fQV9OVU1CRVIgfSBmcm9tIFwiLi9fdXRpbC9tZXNzYWdlcy5tanNcIjtcbmltcG9ydCB7XG4gIE5hdGl2ZU51bWJlcixcbiAgTmF0aXZlVHlwZUVycm9yLFxuICBOdW1iZXJJc0Zpbml0ZSxcbn0gZnJvbSBcIi4vX3V0aWwvcHJpbW9yZGlhbHMubWpzXCI7XG5cbi8qKlxuICogcmV0dXJucyB0aGUgbmVhcmVzdCBoYWxmIHByZWNpc2lvbiBmbG9hdCByZXByZXNlbnRhdGlvbiBvZiBhIG51bWJlci5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaGZyb3VuZChudW0pIHtcbiAgaWYgKHR5cGVvZiBudW0gPT09IFwiYmlnaW50XCIpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ0FOTk9UX0NPTlZFUlRfQV9CSUdJTlRfVkFMVUVfVE9fQV9OVU1CRVIpO1xuICB9XG5cbiAgbnVtID0gTmF0aXZlTnVtYmVyKG51bSk7XG5cbiAgLy8gZm9yIG9wdGltaXphdGlvblxuICBpZiAoIU51bWJlcklzRmluaXRlKG51bSkgfHwgbnVtID09PSAwKSB7XG4gICAgcmV0dXJuIG51bTtcbiAgfVxuXG4gIGNvbnN0IHgxNiA9IHJvdW5kVG9GbG9hdDE2Qml0cyhudW0pO1xuICByZXR1cm4gY29udmVydFRvTnVtYmVyKHgxNik7XG59XG4iLCJpbXBvcnQge1xuICBHZW5lcmF0b3JQcm90b3R5cGVOZXh0LFxuICBJdGVyYXRvclByb3RvdHlwZSxcbiAgTmF0aXZlV2Vha01hcCxcbiAgT2JqZWN0Q3JlYXRlLFxuICBTeW1ib2xUb1N0cmluZ1RhZyxcbiAgV2Vha01hcFByb3RvdHlwZUdldCxcbiAgV2Vha01hcFByb3RvdHlwZVNldCxcbn0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbi8qKiBAdHlwZSB7V2Vha01hcDx7fSwgR2VuZXJhdG9yPGFueT4+fSAqL1xuY29uc3QgZ2VuZXJhdG9ycyA9IG5ldyBOYXRpdmVXZWFrTWFwKCk7XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJWFycmF5aXRlcmF0b3Jwcm90b3R5cGUlLW9iamVjdCAqL1xuY29uc3QgQXJyYXlJdGVyYXRvclByb3RvdHlwZSA9IE9iamVjdENyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge1xuICBuZXh0OiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICBjb25zdCBnZW5lcmF0b3IgPSBXZWFrTWFwUHJvdG90eXBlR2V0KGdlbmVyYXRvcnMsIHRoaXMpO1xuICAgICAgcmV0dXJuIEdlbmVyYXRvclByb3RvdHlwZU5leHQoZ2VuZXJhdG9yKTtcbiAgICB9LFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgfSxcblxuICBbU3ltYm9sVG9TdHJpbmdUYWddOiB7XG4gICAgdmFsdWU6IFwiQXJyYXkgSXRlcmF0b3JcIixcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gIH0sXG59KTtcblxuLyoqIEB0eXBlIHs8VD4oZ2VuZXJhdG9yOiBHZW5lcmF0b3I8VD4pID0+IEl0ZXJhYmxlSXRlcmF0b3I8VD59ICovXG5leHBvcnQgZnVuY3Rpb24gd3JhcEluQXJyYXlJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgY29uc3QgYXJyYXlJdGVyYXRvciA9IE9iamVjdENyZWF0ZShBcnJheUl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgV2Vha01hcFByb3RvdHlwZVNldChnZW5lcmF0b3JzLCBhcnJheUl0ZXJhdG9yLCBnZW5lcmF0b3IpO1xuICByZXR1cm4gYXJyYXlJdGVyYXRvcjtcbn1cbiIsImltcG9ydCB7XG4gIEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCxcbiAgQXJyYXlJc0FycmF5LFxuICBNYXRoVHJ1bmMsXG4gIE5hdGl2ZU51bWJlcixcbiAgTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXIsXG4gIE51bWJlcklzRmluaXRlLFxuICBTaGFyZWRBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGgsXG4gIFN5bWJvbEl0ZXJhdG9yLFxuICBTeW1ib2xUb1N0cmluZ1RhZyxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUdldFN5bWJvbFRvU3RyaW5nVGFnLFxufSBmcm9tIFwiLi9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMge319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikgfHxcbiAgICB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMge319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIjtcbn1cblxuLy8gSW5zcGlyZWQgYnkgdXRpbC50eXBlcyBpbXBsZW1lbnRhdGlvbiBvZiBOb2RlLmpzXG4vKiogQHR5cGVkZWYge1VpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDMyQXJyYXl8RmxvYXQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fEJpZ0ludDY0QXJyYXl9IFR5cGVkQXJyYXkgKi9cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVHlwZWRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gVHlwZWRBcnJheVByb3RvdHlwZUdldFN5bWJvbFRvU3RyaW5nVGFnKHZhbHVlKSAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBCaWdJbnQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNCaWdJbnRUeXBlZEFycmF5KHZhbHVlKSB7XG4gIGNvbnN0IHR5cGVkQXJyYXlOYW1lID0gVHlwZWRBcnJheVByb3RvdHlwZUdldFN5bWJvbFRvU3RyaW5nVGFnKHZhbHVlKTtcbiAgcmV0dXJuIHR5cGVkQXJyYXlOYW1lID09PSBcIkJpZ0ludDY0QXJyYXlcIiB8fFxuICAgIHR5cGVkQXJyYXlOYW1lID09PSBcIkJpZ1VpbnQ2NEFycmF5XCI7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIEFycmF5QnVmZmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWx1ZSkge1xuICB0cnkge1xuICAgIEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCgvKiogQHR5cGUge2FueX0gKi8gKHZhbHVlKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgU2hhcmVkQXJyYXlCdWZmZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NoYXJlZEFycmF5QnVmZmVyKHZhbHVlKSB7XG4gIGlmIChOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlciA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgU2hhcmVkQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoKC8qKiBAdHlwZSB7YW55fSAqLyAodmFsdWUpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBJdGVyYWJsZTx1bmtub3duPn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSXRlcmFibGUodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZVtTeW1ib2xJdGVyYXRvcl0gPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgdW5rbm93bltdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPcmRpbmFyeUFycmF5KHZhbHVlKSB7XG4gIGlmICghQXJyYXlJc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gdmFsdWVbU3ltYm9sSXRlcmF0b3JdKCk7XG4gIGlmIChpdGVyYXRvcltTeW1ib2xUb1N0cmluZ1RhZ10gIT09IFwiQXJyYXkgSXRlcmF0b3JcIikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBUeXBlZEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPcmRpbmFyeVR5cGVkQXJyYXkodmFsdWUpIHtcbiAgaWYgKCFpc1R5cGVkQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaXRlcmF0b3IgPSB2YWx1ZVtTeW1ib2xJdGVyYXRvcl0oKTtcbiAgaWYgKGl0ZXJhdG9yW1N5bWJvbFRvU3RyaW5nVGFnXSAhPT0gXCJBcnJheSBJdGVyYXRvclwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHN0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBudW1iZXIgPSBOYXRpdmVOdW1iZXIodmFsdWUpO1xuICBpZiAodmFsdWUgIT09IG51bWJlciArIFwiXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU51bWJlcklzRmluaXRlKG51bWJlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAobnVtYmVyICE9PSBNYXRoVHJ1bmMobnVtYmVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuIiwiaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tIFwiLi9pcy5tanNcIjtcbmltcG9ydCB7XG4gIENBTk5PVF9DT05WRVJUX0FfQklHSU5UX1ZBTFVFX1RPX0FfTlVNQkVSLFxuICBDT05TVFJVQ1RPUl9JU19OT1RfQV9PQkpFQ1QsXG4gIFRISVNfSVNfTk9UX0FfT0JKRUNULFxufSBmcm9tIFwiLi9tZXNzYWdlcy5tanNcIjtcbmltcG9ydCB7XG4gIEFycmF5QnVmZmVyUHJvdG90eXBlU2xpY2UsXG4gIE1hdGhUcnVuYyxcbiAgTmF0aXZlTnVtYmVyLFxuICBOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlcixcbiAgTmF0aXZlVHlwZUVycm9yLFxuICBOdW1iZXJJc05hTixcbiAgT2JqZWN0SXMsXG4gIFNoYXJlZEFycmF5QnVmZmVyUHJvdG90eXBlU2xpY2UsXG4gIFN5bWJvbFNwZWNpZXMsXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b2ludGVnZXJvcmluZmluaXR5XG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFRvSW50ZWdlck9ySW5maW5pdHkodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcImJpZ2ludFwiKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKENBTk5PVF9DT05WRVJUX0FfQklHSU5UX1ZBTFVFX1RPX0FfTlVNQkVSKTtcbiAgfVxuXG4gIGNvbnN0IG51bWJlciA9IE5hdGl2ZU51bWJlcih0YXJnZXQpO1xuXG4gIGlmIChOdW1iZXJJc05hTihudW1iZXIpIHx8IG51bWJlciA9PT0gMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIE1hdGhUcnVuYyhudW1iZXIpO1xufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b2xlbmd0aFxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIFRvTGVuZ3RoKHRhcmdldCkge1xuICBjb25zdCBsZW5ndGggPSBUb0ludGVnZXJPckluZmluaXR5KHRhcmdldCk7XG4gIGlmIChsZW5ndGggPCAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gbGVuZ3RoIDwgTmF0aXZlTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICA/IGxlbmd0aFxuICAgIDogTmF0aXZlTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWxlbmd0aG9mYXJyYXlsaWtlXG4gKiBAcGFyYW0ge29iamVjdH0gYXJyYXlMaWtlXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gTGVuZ3RoT2ZBcnJheUxpa2UoYXJyYXlMaWtlKSB7XG4gIGlmICghaXNPYmplY3QoYXJyYXlMaWtlKSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSElTX0lTX05PVF9BX09CSkVDVCk7XG4gIH1cblxuICByZXR1cm4gVG9MZW5ndGgoLyoqIEB0eXBlIHthbnl9ICovIChhcnJheUxpa2UpLmxlbmd0aCk7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXNwZWNpZXNjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtvYmplY3R9IHRhcmdldFxuICogQHBhcmFtIHt7IG5ldyguLi5hcmdzOiBhbnlbXSk6IGFueTsgfX0gZGVmYXVsdENvbnN0cnVjdG9yXG4gKiBAcmV0dXJucyB7eyBuZXcoLi4uYXJnczogYW55W10pOiBhbnk7IH19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBTcGVjaWVzQ29uc3RydWN0b3IodGFyZ2V0LCBkZWZhdWx0Q29uc3RydWN0b3IpIHtcbiAgaWYgKCFpc09iamVjdCh0YXJnZXQpKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFRISVNfSVNfTk9UX0FfT0JKRUNUKTtcbiAgfVxuXG4gIGNvbnN0IGNvbnN0cnVjdG9yID0gdGFyZ2V0LmNvbnN0cnVjdG9yO1xuICBpZiAoY29uc3RydWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBkZWZhdWx0Q29uc3RydWN0b3I7XG4gIH1cbiAgaWYgKCFpc09iamVjdChjb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ09OU1RSVUNUT1JfSVNfTk9UX0FfT0JKRUNUKTtcbiAgfVxuXG4gIGNvbnN0IHNwZWNpZXMgPSBjb25zdHJ1Y3RvcltTeW1ib2xTcGVjaWVzXTtcbiAgaWYgKHNwZWNpZXMgPT0gbnVsbCkge1xuICAgIHJldHVybiBkZWZhdWx0Q29uc3RydWN0b3I7XG4gIH1cblxuICByZXR1cm4gc3BlY2llcztcbn1cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtaXNkZXRhY2hlZGJ1ZmZlclxuICogQHBhcmFtIHtBcnJheUJ1ZmZlckxpa2V9IGJ1ZmZlclxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikge1xuICB0cnkge1xuICAgIEFycmF5QnVmZmVyUHJvdG90eXBlU2xpY2UoYnVmZmVyLCAwLCAwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gY2F0Y2ggKGUpIHsvKiBlbXB0eSAqL31cblxuICBpZiAoTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXIgIT09IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgU2hhcmVkQXJyYXlCdWZmZXJQcm90b3R5cGVTbGljZSgvKiogQHR5cGUge1NoYXJlZEFycmF5QnVmZmVyfSAqLyAoYnVmZmVyKSwgMCwgMCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBjYXRjaCAoZSkgey8qIGVtcHR5ICovfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogYmlnaW50IGNvbXBhcmlzb25zIGFyZSBub3Qgc3VwcG9ydGVkXG4gKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc29ydFxuICogQHBhcmFtIHtudW1iZXJ9IHhcbiAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gKiBAcmV0dXJucyB7LTEgfCAwIHwgMX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRDb21wYXJlKHgsIHkpIHtcbiAgY29uc3QgaXNYTmFOID0gTnVtYmVySXNOYU4oeCk7XG4gIGNvbnN0IGlzWU5hTiA9IE51bWJlcklzTmFOKHkpO1xuXG4gIGlmIChpc1hOYU4gJiYgaXNZTmFOKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAoaXNYTmFOKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICBpZiAoaXNZTmFOKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgaWYgKHggPCB5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgaWYgKHggPiB5KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICBpZiAoeCA9PT0gMCAmJiB5ID09PSAwKSB7XG4gICAgY29uc3QgaXNYUGx1c1plcm8gPSBPYmplY3RJcyh4LCAwKTtcbiAgICBjb25zdCBpc1lQbHVzWmVybyA9IE9iamVjdElzKHksIDApO1xuXG4gICAgaWYgKCFpc1hQbHVzWmVybyAmJiBpc1lQbHVzWmVybykge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChpc1hQbHVzWmVybyAmJiAhaXNZUGx1c1plcm8pIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAwO1xufVxuIiwiaW1wb3J0IHsgd3JhcEluQXJyYXlJdGVyYXRvciB9IGZyb20gXCIuL191dGlsL2FycmF5SXRlcmF0b3IubWpzXCI7XG5pbXBvcnQgeyBjb252ZXJ0VG9OdW1iZXIsIHJvdW5kVG9GbG9hdDE2Qml0cyB9IGZyb20gXCIuL191dGlsL2NvbnZlcnRlci5tanNcIjtcbmltcG9ydCB7XG4gIGlzQXJyYXlCdWZmZXIsXG4gIGlzQmlnSW50VHlwZWRBcnJheSxcbiAgaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcsXG4gIGlzSXRlcmFibGUsXG4gIGlzT2JqZWN0LFxuICBpc09iamVjdExpa2UsXG4gIGlzT3JkaW5hcnlBcnJheSxcbiAgaXNPcmRpbmFyeVR5cGVkQXJyYXksXG4gIGlzU2hhcmVkQXJyYXlCdWZmZXIsXG4gIGlzVHlwZWRBcnJheSxcbn0gZnJvbSBcIi4vX3V0aWwvaXMubWpzXCI7XG5pbXBvcnQge1xuICBDQU5OT1RfQ09OVkVSVF9VTkRFRklORURfT1JfTlVMTF9UT19PQkpFQ1QsXG4gIENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFUyxcbiAgQ09OU1RSVUNUT1JfSVNfTk9UX0FfT0JKRUNULFxuICBERVJJVkVEX1RZUEVEQVJSQVlfQ09OU1RSVUNUT1JfQ1JFQVRFRF9BTl9BUlJBWV9XSElDSF9XQVNfVE9PX1NNQUxMLFxuICBPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyxcbiAgUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSxcbiAgU1BFQ0lFU0NPTlNUUlVDVE9SX0RJRE5UX1JFVFVSTl9UWVBFREFSUkFZLFxuICBUSElTX0JVRkZFUl9IQVNfQUxSRUFEWV9CRUVOX0RFVEFDSEVELFxuICBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWSxcbiAgVEhJU19JU19OT1RfQV9GTE9BVDE2QVJSQVksXG59IGZyb20gXCIuL191dGlsL21lc3NhZ2VzLm1qc1wiO1xuaW1wb3J0IHtcbiAgQXJyYXlQcm90b3R5cGVKb2luLFxuICBBcnJheVByb3RvdHlwZVB1c2gsXG4gIEFycmF5UHJvdG90eXBlVG9Mb2NhbGVTdHJpbmcsXG4gIE5hdGl2ZUFycmF5QnVmZmVyLFxuICBOYXRpdmVPYmplY3QsXG4gIE5hdGl2ZVByb3h5LFxuICBOYXRpdmVSYW5nZUVycm9yLFxuICBOYXRpdmVTZXQsXG4gIE5hdGl2ZVR5cGVFcnJvcixcbiAgTmF0aXZlVWludDE2QXJyYXksXG4gIE5hdGl2ZVdlYWtNYXAsXG4gIE51bWJlcklzTmFOLFxuICBPYmplY3REZWZpbmVQcm9wZXJ0eSxcbiAgT2JqZWN0RnJlZXplLFxuICBPYmplY3RIYXNPd24sXG4gIFJlZmxlY3RBcHBseSxcbiAgUmVmbGVjdENvbnN0cnVjdCxcbiAgUmVmbGVjdEdldCxcbiAgUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgUmVmbGVjdEdldFByb3RvdHlwZU9mLFxuICBSZWZsZWN0SGFzLFxuICBSZWZsZWN0T3duS2V5cyxcbiAgUmVmbGVjdFNldCxcbiAgUmVmbGVjdFNldFByb3RvdHlwZU9mLFxuICBTZXRQcm90b3R5cGVBZGQsXG4gIFNldFByb3RvdHlwZUhhcyxcbiAgU3ltYm9sRm9yLFxuICBTeW1ib2xJdGVyYXRvcixcbiAgU3ltYm9sVG9TdHJpbmdUYWcsXG4gIFR5cGVkQXJyYXksXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVDb3B5V2l0aGluLFxuICBUeXBlZEFycmF5UHJvdG90eXBlRW50cmllcyxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUZpbGwsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0LFxuICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoLFxuICBUeXBlZEFycmF5UHJvdG90eXBlS2V5cyxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVJldmVyc2UsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVTZXQsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVNvcnQsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVTdWJhcnJheSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVZhbHVlcyxcbiAgVWludDE2QXJyYXlGcm9tLFxuICBXZWFrTWFwUHJvdG90eXBlR2V0LFxuICBXZWFrTWFwUHJvdG90eXBlSGFzLFxuICBXZWFrTWFwUHJvdG90eXBlU2V0LFxufSBmcm9tIFwiLi9fdXRpbC9wcmltb3JkaWFscy5tanNcIjtcbmltcG9ydCB7XG4gIElzRGV0YWNoZWRCdWZmZXIsXG4gIExlbmd0aE9mQXJyYXlMaWtlLFxuICBTcGVjaWVzQ29uc3RydWN0b3IsXG4gIFRvSW50ZWdlck9ySW5maW5pdHksXG4gIGRlZmF1bHRDb21wYXJlLFxufSBmcm9tIFwiLi9fdXRpbC9zcGVjLm1qc1wiO1xuXG5jb25zdCBCWVRFU19QRVJfRUxFTUVOVCA9IDI7XG5cbmNvbnN0IGJyYW5kID0gU3ltYm9sRm9yKFwiX19GbG9hdDE2QXJyYXlfX1wiKTtcblxuLyoqIEB0eXBlIHtXZWFrTWFwPEZsb2F0MTZBcnJheSwgVWludDE2QXJyYXkgJiB7IF9fZmxvYXQxNmJpdHM6IG5ldmVyIH0+fSAqL1xuY29uc3QgZmxvYXQxNmJpdHNBcnJheXMgPSBuZXcgTmF0aXZlV2Vha01hcCgpO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaGFzRmxvYXQxNkFycmF5QnJhbmQodGFyZ2V0KSB7XG4gIGlmICghaXNPYmplY3RMaWtlKHRhcmdldCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBwcm90b3R5cGUgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcbiAgaWYgKCFpc09iamVjdExpa2UocHJvdG90eXBlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGNvbnN0cnVjdG9yID0gcHJvdG90eXBlLmNvbnN0cnVjdG9yO1xuICBpZiAoY29uc3RydWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KGNvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihDT05TVFJVQ1RPUl9JU19OT1RfQV9PQkpFQ1QpO1xuICB9XG5cbiAgcmV0dXJuIFJlZmxlY3RIYXMoY29uc3RydWN0b3IsIGJyYW5kKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge3RhcmdldCBpcyBGbG9hdDE2QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgcmV0dXJuIFdlYWtNYXBQcm90b3R5cGVIYXMoZmxvYXQxNmJpdHNBcnJheXMsIHRhcmdldCkgfHxcbiAgICAoaGFzRmxvYXQxNkFycmF5QnJhbmQodGFyZ2V0KSAmJiAhaXNUeXBlZEFycmF5KHRhcmdldCkpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcmV0dXJucyB7YXNzZXJ0cyB0YXJnZXQgaXMgRmxvYXQxNkFycmF5fVxuICovXG5mdW5jdGlvbiBhc3NlcnRGbG9hdDE2QXJyYXkodGFyZ2V0KSB7XG4gIGlmICghaXNGbG9hdDE2QXJyYXkodGFyZ2V0KSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSElTX0lTX05PVF9BX0ZMT0FUMTZBUlJBWSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHBhcmFtIHtudW1iZXI9fSBjb3VudFxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge2Fzc2VydHMgdGFyZ2V0IGlzIFVpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDE2QXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheX1cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0U3BlY2llc1R5cGVkQXJyYXkodGFyZ2V0LCBjb3VudCkge1xuICBjb25zdCBpc1RhcmdldEZsb2F0MTZBcnJheSA9IGlzRmxvYXQxNkFycmF5KHRhcmdldCk7XG4gIGNvbnN0IGlzVGFyZ2V0VHlwZWRBcnJheSA9IGlzVHlwZWRBcnJheSh0YXJnZXQpO1xuXG4gIGlmICghaXNUYXJnZXRGbG9hdDE2QXJyYXkgJiYgIWlzVGFyZ2V0VHlwZWRBcnJheSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihTUEVDSUVTQ09OU1RSVUNUT1JfRElETlRfUkVUVVJOX1RZUEVEQVJSQVkpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBjb3VudCA9PT0gXCJudW1iZXJcIikge1xuICAgIGxldCBsZW5ndGg7XG4gICAgaWYgKGlzVGFyZ2V0RmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0YXJnZXQpO1xuICAgICAgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aCh0YXJnZXQpO1xuICAgIH1cblxuICAgIGlmIChsZW5ndGggPCBjb3VudCkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBERVJJVkVEX1RZUEVEQVJSQVlfQ09OU1RSVUNUT1JfQ1JFQVRFRF9BTl9BUlJBWV9XSElDSF9XQVNfVE9PX1NNQUxMXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChpc0JpZ0ludFR5cGVkQXJyYXkodGFyZ2V0KSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVMpO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHtGbG9hdDE2QXJyYXl9IGZsb2F0MTZcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEByZXR1cm5zIHtVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfX1cbiAqL1xuZnVuY3Rpb24gZ2V0RmxvYXQxNkJpdHNBcnJheShmbG9hdDE2KSB7XG4gIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBXZWFrTWFwUHJvdG90eXBlR2V0KGZsb2F0MTZiaXRzQXJyYXlzLCBmbG9hdDE2KTtcbiAgaWYgKGZsb2F0MTZiaXRzQXJyYXkgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgaWYgKElzRGV0YWNoZWRCdWZmZXIoYnVmZmVyKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFRISVNfQlVGRkVSX0hBU19BTFJFQURZX0JFRU5fREVUQUNIRUQpO1xuICAgIH1cbiAgICByZXR1cm4gZmxvYXQxNmJpdHNBcnJheTtcbiAgfVxuXG4gIC8vIEB0cy1pZ25vcmVcbiAgY29uc3QgYnVmZmVyID0gZmxvYXQxNi5idWZmZXI7XG4gIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhJU19CVUZGRVJfSEFTX0FMUkVBRFlfQkVFTl9ERVRBQ0hFRCk7XG4gIH1cblxuICAvLyBmcm9tIGFub3RoZXIgRmxvYXQxNkFycmF5IGluc3RhbmNlIChhIGRpZmZlcmVudCB2ZXJzaW9uPylcbiAgY29uc3QgY2xvbmVkID0gUmVmbGVjdENvbnN0cnVjdChGbG9hdDE2QXJyYXksIFtcbiAgICBidWZmZXIsXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGZsb2F0MTYuYnl0ZU9mZnNldCxcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZmxvYXQxNi5sZW5ndGgsXG4gIF0sIGZsb2F0MTYuY29uc3RydWN0b3IpO1xuICByZXR1cm4gV2Vha01hcFByb3RvdHlwZUdldChmbG9hdDE2Yml0c0FycmF5cywgY2xvbmVkKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1VpbnQxNkFycmF5ICYgeyBfX2Zsb2F0MTZiaXRzOiBuZXZlciB9fSBmbG9hdDE2Yml0c0FycmF5XG4gKiBAcmV0dXJucyB7bnVtYmVyW119XG4gKi9cbmZ1bmN0aW9uIGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpIHtcbiAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICBjb25zdCBhcnJheSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgYXJyYXlbaV0gPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gIH1cblxuICByZXR1cm4gYXJyYXk7XG59XG5cbmNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXR0ZXJzID0gbmV3IE5hdGl2ZVNldCgpO1xuZm9yIChjb25zdCBrZXkgb2YgUmVmbGVjdE93bktleXMoVHlwZWRBcnJheVByb3RvdHlwZSkpIHtcbiAgLy8gQEB0b1N0cmluZ1RhZyBtZXRob2QgaXMgZGVmaW5lZCBpbiBGbG9hdDE2QXJyYXkucHJvdG90eXBlXG4gIGlmIChrZXkgPT09IFN5bWJvbFRvU3RyaW5nVGFnKSB7XG4gICAgY29udGludWU7XG4gIH1cblxuICBjb25zdCBkZXNjcmlwdG9yID0gUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihUeXBlZEFycmF5UHJvdG90eXBlLCBrZXkpO1xuICBpZiAoT2JqZWN0SGFzT3duKGRlc2NyaXB0b3IsIFwiZ2V0XCIpKSB7XG4gICAgU2V0UHJvdG90eXBlQWRkKFR5cGVkQXJyYXlQcm90b3R5cGVHZXR0ZXJzLCBrZXkpO1xuICB9XG59XG5cbi8qKiBAdHlwZSB7UHJveHlIYW5kbGVyPEZsb2F0MTZBcnJheT59ICovXG5jb25zdCBoYW5kbGVyID0gT2JqZWN0RnJlZXplKHtcbiAgZ2V0KHRhcmdldCwga2V5LCByZWNlaXZlcikge1xuICAgIGlmIChpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyhrZXkpICYmIE9iamVjdEhhc093bih0YXJnZXQsIGtleSkpIHtcbiAgICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoUmVmbGVjdEdldCh0YXJnZXQsIGtleSkpO1xuICAgIH1cblxuICAgIC8vICVUeXBlZEFycmF5JS5wcm90b3R5cGUgZ2V0dGVyIHByb3BlcnRpZXMgY2Fubm90IGNhbGxlZCBieSBQcm94eSByZWNlaXZlclxuICAgIGlmIChTZXRQcm90b3R5cGVIYXMoVHlwZWRBcnJheVByb3RvdHlwZUdldHRlcnMsIGtleSkpIHtcbiAgICAgIHJldHVybiBSZWZsZWN0R2V0KHRhcmdldCwga2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVmbGVjdEdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpO1xuICB9LFxuXG4gIHNldCh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgaWYgKGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKGtleSkgJiYgT2JqZWN0SGFzT3duKHRhcmdldCwga2V5KSkge1xuICAgICAgcmV0dXJuIFJlZmxlY3RTZXQodGFyZ2V0LCBrZXksIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0U2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpO1xuICB9LFxufSk7XG5cbmV4cG9ydCBjbGFzcyBGbG9hdDE2QXJyYXkge1xuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXR5cGVkYXJyYXkgKi9cbiAgY29uc3RydWN0b3IoaW5wdXQsIF9ieXRlT2Zmc2V0LCBfbGVuZ3RoKSB7XG4gICAgLyoqIEB0eXBlIHtVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfX0gKi9cbiAgICBsZXQgZmxvYXQxNmJpdHNBcnJheTtcblxuICAgIGlmIChpc0Zsb2F0MTZBcnJheShpbnB1dCkpIHtcbiAgICAgIC8vIHBlZWwgb2ZmIFByb3h5XG4gICAgICBmbG9hdDE2Yml0c0FycmF5ID0gUmVmbGVjdENvbnN0cnVjdChOYXRpdmVVaW50MTZBcnJheSwgW2dldEZsb2F0MTZCaXRzQXJyYXkoaW5wdXQpXSwgbmV3LnRhcmdldCk7XG4gICAgfSBlbHNlIGlmIChpc09iamVjdChpbnB1dCkgJiYgIWlzQXJyYXlCdWZmZXIoaW5wdXQpKSB7IC8vIG9iamVjdCB3aXRob3V0IEFycmF5QnVmZmVyXG4gICAgICAvKiogQHR5cGUge0FycmF5TGlrZTx1bmtub3duPn0gKi9cbiAgICAgIGxldCBsaXN0O1xuICAgICAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG4gICAgICBsZXQgbGVuZ3RoO1xuXG4gICAgICBpZiAoaXNUeXBlZEFycmF5KGlucHV0KSkgeyAvLyBUeXBlZEFycmF5XG4gICAgICAgIGxpc3QgPSBpbnB1dDtcbiAgICAgICAgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChpbnB1dCk7XG5cbiAgICAgICAgY29uc3QgYnVmZmVyID0gVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihpbnB1dCk7XG4gICAgICAgIGNvbnN0IEJ1ZmZlckNvbnN0cnVjdG9yID0gIWlzU2hhcmVkQXJyYXlCdWZmZXIoYnVmZmVyKVxuICAgICAgICAgID8gLyoqIEB0eXBlIHtBcnJheUJ1ZmZlckNvbnN0cnVjdG9yfSAqLyAoU3BlY2llc0NvbnN0cnVjdG9yKFxuICAgICAgICAgICAgYnVmZmVyLFxuICAgICAgICAgICAgTmF0aXZlQXJyYXlCdWZmZXJcbiAgICAgICAgICApKVxuICAgICAgICAgIDogTmF0aXZlQXJyYXlCdWZmZXI7XG5cbiAgICAgICAgaWYgKElzRGV0YWNoZWRCdWZmZXIoYnVmZmVyKSkge1xuICAgICAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSElTX0JVRkZFUl9IQVNfQUxSRUFEWV9CRUVOX0RFVEFDSEVEKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0JpZ0ludFR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFUyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhID0gbmV3IEJ1ZmZlckNvbnN0cnVjdG9yKFxuICAgICAgICAgIGxlbmd0aCAqIEJZVEVTX1BFUl9FTEVNRU5UXG4gICAgICAgICk7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBbZGF0YV0sIG5ldy50YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzSXRlcmFibGUoaW5wdXQpKSB7IC8vIEl0ZXJhYmxlIChBcnJheSlcbiAgICAgICAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgICAgICAgaWYgKGlzT3JkaW5hcnlBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIGxpc3QgPSBpbnB1dDtcbiAgICAgICAgICAgIGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGlzdCA9IFsuLi5pbnB1dF07XG4gICAgICAgICAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIEFycmF5TGlrZVxuICAgICAgICAgIGxpc3QgPSAvKiogQHR5cGUge0FycmF5TGlrZTx1bmtub3duPn0gKi8gKGlucHV0KTtcbiAgICAgICAgICBsZW5ndGggPSBMZW5ndGhPZkFycmF5TGlrZShpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgZmxvYXQxNmJpdHNBcnJheSA9IFJlZmxlY3RDb25zdHJ1Y3QoTmF0aXZlVWludDE2QXJyYXksIFtsZW5ndGhdLCBuZXcudGFyZ2V0KTtcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHZhbHVlc1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBmbG9hdDE2Yml0c0FycmF5W2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGxpc3RbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIHByaW1pdGl2ZSwgQXJyYXlCdWZmZXJcbiAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBhcmd1bWVudHMsIG5ldy50YXJnZXQpO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3h5ID0gbmV3IE5hdGl2ZVByb3h5KC8qKiBAdHlwZSB7YW55fSAqLyAoZmxvYXQxNmJpdHNBcnJheSksIGhhbmRsZXIpO1xuXG4gICAgLy8gcHJveHkgcHJpdmF0ZSBzdG9yYWdlXG4gICAgV2Vha01hcFByb3RvdHlwZVNldChmbG9hdDE2Yml0c0FycmF5cywgcHJveHksIGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgcmV0dXJuIHByb3h5O1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGbG9hdDE2QXJyYXkpYCBvciBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgIGluY2x1ZGUgdGhpcyBrZXlcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5mcm9tXG4gICAqL1xuICBzdGF0aWMgZnJvbShzcmMsIC4uLm9wdHMpIHtcbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICBpZiAoIVJlZmxlY3RIYXMoQ29uc3RydWN0b3IsIGJyYW5kKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGlmIChpc0Zsb2F0MTZBcnJheShzcmMpICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHNyYyk7XG4gICAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBOYXRpdmVVaW50MTZBcnJheShcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSlcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihUeXBlZEFycmF5UHJvdG90eXBlU2xpY2UodWludDE2KSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgICAgICBVaW50MTZBcnJheUZyb20oc3JjLCByb3VuZFRvRmxvYXQxNkJpdHMpXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXBGdW5jID0gb3B0c1swXTtcbiAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzFdO1xuXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgICBVaW50MTZBcnJheUZyb20oc3JjLCBmdW5jdGlvbiAodmFsLCAuLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gcm91bmRUb0Zsb2F0MTZCaXRzKFxuICAgICAgICAgICAgICBSZWZsZWN0QXBwbHkobWFwRnVuYywgdGhpcywgW3ZhbCwgLi4uYXJnc10pXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0sIHRoaXNBcmcpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqIEB0eXBlIHtBcnJheUxpa2U8dW5rbm93bj59ICovXG4gICAgbGV0IGxpc3Q7XG4gICAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG4gICAgbGV0IGxlbmd0aDtcblxuICAgIGlmIChpc0l0ZXJhYmxlKHNyYykpIHsgLy8gSXRlcmFibGUgKFR5cGVkQXJyYXksIEFycmF5KVxuICAgICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgICAgaWYgKGlzT3JkaW5hcnlBcnJheShzcmMpKSB7XG4gICAgICAgIGxpc3QgPSBzcmM7XG4gICAgICAgIGxlbmd0aCA9IHNyYy5sZW5ndGg7XG4gICAgICB9IGVsc2UgaWYgKGlzT3JkaW5hcnlUeXBlZEFycmF5KHNyYykpIHtcbiAgICAgICAgbGlzdCA9IHNyYztcbiAgICAgICAgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChzcmMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGlzdCA9IFsuLi5zcmNdO1xuICAgICAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyBBcnJheUxpa2VcbiAgICAgIGxpc3QgPSBzcmM7XG4gICAgICBsZW5ndGggPSBMZW5ndGhPZkFycmF5TGlrZShzcmMpO1xuICAgIH1cblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgYXJyYXlbaV0gPSAvKiogQHR5cGUge251bWJlcn0gKi8gKGxpc3RbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtYXBGdW5jID0gb3B0c1swXTtcbiAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzFdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBhcnJheVtpXSA9IFJlZmxlY3RBcHBseShtYXBGdW5jLCB0aGlzQXJnLCBbbGlzdFtpXSwgaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiBgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRmxvYXQxNkFycmF5KWAgb3IgYFJlZmxlY3Qub3duS2V5cyhGbG9hdDE2QXJyYXkpYCBpbmNsdWRlIHRoaXMga2V5XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUub2ZcbiAgICovXG4gIHN0YXRpYyBvZiguLi5pdGVtcykge1xuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gdGhpcztcblxuICAgIGlmICghUmVmbGVjdEhhcyhDb25zdHJ1Y3RvciwgYnJhbmQpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIFRISVNfQ09OU1RSVUNUT1JfSVNfTk9UX0FfU1VCQ0xBU1NfT0ZfRkxPQVQxNkFSUkFZXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDtcblxuICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICBpZiAoQ29uc3RydWN0b3IgPT09IEZsb2F0MTZBcnJheSkge1xuICAgICAgY29uc3QgcHJveHkgPSBuZXcgRmxvYXQxNkFycmF5KGxlbmd0aCk7XG4gICAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShwcm94eSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZmxvYXQxNmJpdHNBcnJheVtpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhpdGVtc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm94eTtcbiAgICB9XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgYXJyYXlbaV0gPSBpdGVtc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUua2V5cyAqL1xuICBrZXlzKCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIHJldHVybiBUeXBlZEFycmF5UHJvdG90eXBlS2V5cyhmbG9hdDE2Yml0c0FycmF5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiByZXR1cm5zIGEgb2JqZWN0IHdob3NlIHByb3RvdHlwZSBpcyBub3QgYCVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJWBcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUudmFsdWVzXG4gICAqL1xuICB2YWx1ZXMoKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgcmV0dXJuIHdyYXBJbkFycmF5SXRlcmF0b3IoKGZ1bmN0aW9uKiAoKSB7XG4gICAgICBmb3IgKGNvbnN0IHZhbCBvZiBUeXBlZEFycmF5UHJvdG90eXBlVmFsdWVzKGZsb2F0MTZiaXRzQXJyYXkpKSB7XG4gICAgICAgIHlpZWxkIGNvbnZlcnRUb051bWJlcih2YWwpO1xuICAgICAgfVxuICAgIH0pKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IHJldHVybnMgYSBvYmplY3Qgd2hvc2UgcHJvdG90eXBlIGlzIG5vdCBgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlYFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5lbnRyaWVzXG4gICAqL1xuICBlbnRyaWVzKCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIHJldHVybiAod3JhcEluQXJyYXlJdGVyYXRvcigoZnVuY3Rpb24qICgpIHtcbiAgICAgIGZvciAoY29uc3QgW2ksIHZhbF0gb2YgVHlwZWRBcnJheVByb3RvdHlwZUVudHJpZXMoZmxvYXQxNmJpdHNBcnJheSkpIHtcbiAgICAgICAgeWllbGQgLyoqIEB0eXBlIHtbTnVtYmVyLCBudW1iZXJdfSAqLyAoW2ksIGNvbnZlcnRUb051bWJlcih2YWwpXSk7XG4gICAgICB9XG4gICAgfSkoKSkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmF0ICovXG4gIGF0KGluZGV4KSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCByZWxhdGl2ZUluZGV4ID0gVG9JbnRlZ2VyT3JJbmZpbml0eShpbmRleCk7XG4gICAgY29uc3QgayA9IHJlbGF0aXZlSW5kZXggPj0gMCA/IHJlbGF0aXZlSW5kZXggOiBsZW5ndGggKyByZWxhdGl2ZUluZGV4O1xuXG4gICAgaWYgKGsgPCAwIHx8IGsgPj0gbGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2tdKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5tYXAgKi9cbiAgbWFwKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IHByb3h5ID0gbmV3IEZsb2F0MTZBcnJheShsZW5ndGgpO1xuICAgICAgY29uc3QgYXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHByb3h5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCB2YWwgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gICAgICAgIGFycmF5W2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKFxuICAgICAgICAgIFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbCwgaSwgdGhpc10pXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm94eTtcbiAgICB9XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5LCBsZW5ndGgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgYXJyYXlbaV0gPSBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChhcnJheSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmlsdGVyICovXG4gIGZpbHRlcihjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBjb25zdCBrZXB0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbCwgaSwgdGhpc10pKSB7XG4gICAgICAgIEFycmF5UHJvdG90eXBlUHVzaChrZXB0LCB2YWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3Ioa2VwdCk7XG4gICAgYXNzZXJ0U3BlY2llc1R5cGVkQXJyYXkoYXJyYXkpO1xuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJlZHVjZSAqL1xuICByZWR1Y2UoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGlmIChsZW5ndGggPT09IDAgJiYgb3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihSRURVQ0VfT0ZfRU1QVFlfQVJSQVlfV0lUSF9OT19JTklUSUFMX1ZBTFVFKTtcbiAgICB9XG5cbiAgICBsZXQgYWNjdW11bGF0b3IsIHN0YXJ0O1xuICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVswXSk7XG4gICAgICBzdGFydCA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gb3B0c1swXTtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjYWxsYmFjayhcbiAgICAgICAgYWNjdW11bGF0b3IsXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgaSxcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUucmVkdWNlcmlnaHQgKi9cbiAgcmVkdWNlUmlnaHQoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGlmIChsZW5ndGggPT09IDAgJiYgb3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihSRURVQ0VfT0ZfRU1QVFlfQVJSQVlfV0lUSF9OT19JTklUSUFMX1ZBTFVFKTtcbiAgICB9XG5cbiAgICBsZXQgYWNjdW11bGF0b3IsIHN0YXJ0O1xuICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtsZW5ndGggLSAxXSk7XG4gICAgICBzdGFydCA9IGxlbmd0aCAtIDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gb3B0c1swXTtcbiAgICAgIHN0YXJ0ID0gbGVuZ3RoIC0gMTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNhbGxiYWNrKFxuICAgICAgICBhY2N1bXVsYXRvcixcbiAgICAgICAgY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pLFxuICAgICAgICBpLFxuICAgICAgICB0aGlzXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5mb3JlYWNoICovXG4gIGZvckVhY2goY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgaSxcbiAgICAgICAgdGhpcyxcbiAgICAgIF0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kICovXG4gIGZpbmQoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gICAgICBpZiAoUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdmFsdWUsIGksIHRoaXNdKSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbmRpbmRleCAqL1xuICBmaW5kSW5kZXgoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gICAgICBpZiAoUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdmFsdWUsIGksIHRoaXNdKSkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtYXJyYXktZmluZC1mcm9tLWxhc3QvaW5kZXguaHRtbCNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kbGFzdCAqL1xuICBmaW5kTGFzdChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gbGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9wcm9wb3NhbC1hcnJheS1maW5kLWZyb20tbGFzdC9pbmRleC5odG1sI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbmRsYXN0aW5kZXggKi9cbiAgZmluZExhc3RJbmRleChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gbGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmV2ZXJ5ICovXG4gIGV2ZXJ5KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChcbiAgICAgICAgIVJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW1xuICAgICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgICBpLFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgIF0pXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNvbWUgKi9cbiAgc29tZShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoXG4gICAgICAgIFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW1xuICAgICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgICBpLFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgIF0pXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNldCAqL1xuICBzZXQoaW5wdXQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCB0YXJnZXRPZmZzZXQgPSBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pO1xuICAgIGlmICh0YXJnZXRPZmZzZXQgPCAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVSYW5nZUVycm9yKE9GRlNFVF9JU19PVVRfT0ZfQk9VTkRTKTtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXQgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBDQU5OT1RfQ09OVkVSVF9VTkRFRklORURfT1JfTlVMTF9UT19PQkpFQ1RcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGlzQmlnSW50VHlwZWRBcnJheShpbnB1dCkpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgQ0FOTk9UX01JWF9CSUdJTlRfQU5EX09USEVSX1RZUEVTXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICBpZiAoaXNGbG9hdDE2QXJyYXkoaW5wdXQpKSB7XG4gICAgICAvLyBwZWVsIG9mZiBQcm94eVxuICAgICAgcmV0dXJuIFR5cGVkQXJyYXlQcm90b3R5cGVTZXQoXG4gICAgICAgIGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyksXG4gICAgICAgIGdldEZsb2F0MTZCaXRzQXJyYXkoaW5wdXQpLFxuICAgICAgICB0YXJnZXRPZmZzZXRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGlzVHlwZWRBcnJheShpbnB1dCkpIHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoaW5wdXQpO1xuICAgICAgaWYgKElzRGV0YWNoZWRCdWZmZXIoYnVmZmVyKSkge1xuICAgICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhJU19CVUZGRVJfSEFTX0FMUkVBRFlfQkVFTl9ERVRBQ0hFRCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdGFyZ2V0TGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIGNvbnN0IHNyYyA9IE5hdGl2ZU9iamVjdChpbnB1dCk7XG4gICAgY29uc3Qgc3JjTGVuZ3RoID0gTGVuZ3RoT2ZBcnJheUxpa2Uoc3JjKTtcblxuICAgIGlmICh0YXJnZXRPZmZzZXQgPT09IEluZmluaXR5IHx8IHNyY0xlbmd0aCArIHRhcmdldE9mZnNldCA+IHRhcmdldExlbmd0aCkge1xuICAgICAgdGhyb3cgTmF0aXZlUmFuZ2VFcnJvcihPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcmNMZW5ndGg7ICsraSkge1xuICAgICAgZmxvYXQxNmJpdHNBcnJheVtpICsgdGFyZ2V0T2Zmc2V0XSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhzcmNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5yZXZlcnNlICovXG4gIHJldmVyc2UoKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgVHlwZWRBcnJheVByb3RvdHlwZVJldmVyc2UoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maWxsICovXG4gIGZpbGwodmFsdWUsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBUeXBlZEFycmF5UHJvdG90eXBlRmlsbChcbiAgICAgIGZsb2F0MTZiaXRzQXJyYXksXG4gICAgICByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpLFxuICAgICAgLi4ub3B0c1xuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5jb3B5d2l0aGluICovXG4gIGNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVDb3B5V2l0aGluKGZsb2F0MTZiaXRzQXJyYXksIHRhcmdldCwgc3RhcnQsIC4uLm9wdHMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc29ydCAqL1xuICBzb3J0KC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBjb21wYXJlID0gb3B0c1swXSAhPT0gdW5kZWZpbmVkID8gb3B0c1swXSA6IGRlZmF1bHRDb21wYXJlO1xuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVTb3J0KGZsb2F0MTZiaXRzQXJyYXksICh4LCB5KSA9PiB7XG4gICAgICByZXR1cm4gY29tcGFyZShjb252ZXJ0VG9OdW1iZXIoeCksIGNvbnZlcnRUb051bWJlcih5KSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zbGljZSAqL1xuICBzbGljZSguLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgQ29uc3RydWN0b3IgPSBTcGVjaWVzQ29uc3RydWN0b3IoZmxvYXQxNmJpdHNBcnJheSwgRmxvYXQxNkFycmF5KTtcblxuICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICBpZiAoQ29uc3RydWN0b3IgPT09IEZsb2F0MTZBcnJheSkge1xuICAgICAgY29uc3QgdWludDE2ID0gbmV3IE5hdGl2ZVVpbnQxNkFycmF5KFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldChmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KVxuICAgICAgKTtcbiAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSh1aW50MTYsIC4uLm9wdHMpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCBzdGFydCA9IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSk7XG4gICAgY29uc3QgZW5kID0gb3B0c1sxXSA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzFdKTtcblxuICAgIGxldCBrO1xuICAgIGlmIChzdGFydCA9PT0gLUluZmluaXR5KSB7XG4gICAgICBrID0gMDtcbiAgICB9IGVsc2UgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgayA9IGxlbmd0aCArIHN0YXJ0ID4gMCA/IGxlbmd0aCArIHN0YXJ0IDogMDtcbiAgICB9IGVsc2Uge1xuICAgICAgayA9IGxlbmd0aCA8IHN0YXJ0ID8gbGVuZ3RoIDogc3RhcnQ7XG4gICAgfVxuXG4gICAgbGV0IGZpbmFsO1xuICAgIGlmIChlbmQgPT09IC1JbmZpbml0eSkge1xuICAgICAgZmluYWwgPSAwO1xuICAgIH0gZWxzZSBpZiAoZW5kIDwgMCkge1xuICAgICAgZmluYWwgPSBsZW5ndGggKyBlbmQgPiAwID8gbGVuZ3RoICsgZW5kIDogMDtcbiAgICB9IGVsc2Uge1xuICAgICAgZmluYWwgPSBsZW5ndGggPCBlbmQgPyBsZW5ndGggOiBlbmQ7XG4gICAgfVxuXG4gICAgY29uc3QgY291bnQgPSBmaW5hbCAtIGsgPiAwID8gZmluYWwgLSBrIDogMDtcbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3Rvcihjb3VudCk7XG4gICAgYXNzZXJ0U3BlY2llc1R5cGVkQXJyYXkoYXJyYXksIGNvdW50KTtcblxuICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cblxuICAgIGNvbnN0IGJ1ZmZlciA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgaWYgKElzRGV0YWNoZWRCdWZmZXIoYnVmZmVyKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFRISVNfQlVGRkVSX0hBU19BTFJFQURZX0JFRU5fREVUQUNIRUQpO1xuICAgIH1cblxuICAgIGxldCBuID0gMDtcbiAgICB3aGlsZSAoayA8IGZpbmFsKSB7XG4gICAgICBhcnJheVtuXSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2tdKTtcbiAgICAgICsraztcbiAgICAgICsrbjtcbiAgICB9XG5cbiAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChhcnJheSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc3ViYXJyYXkgKi9cbiAgc3ViYXJyYXkoLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG5cbiAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgKTtcbiAgICBjb25zdCB1aW50MTZTdWJhcnJheSA9IFR5cGVkQXJyYXlQcm90b3R5cGVTdWJhcnJheSh1aW50MTYsIC4uLm9wdHMpO1xuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKHVpbnQxNlN1YmFycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KHVpbnQxNlN1YmFycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgodWludDE2U3ViYXJyYXkpXG4gICAgKTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSk7XG5cbiAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChhcnJheSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuaW5kZXhvZiAqL1xuICBpbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgbGV0IGZyb20gPSBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pO1xuICAgIGlmIChmcm9tID09PSBJbmZpbml0eSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgZnJvbSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKFxuICAgICAgICBPYmplY3RIYXNPd24oZmxvYXQxNmJpdHNBcnJheSwgaSkgJiZcbiAgICAgICAgY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pID09PSBlbGVtZW50XG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmxhc3RpbmRleG9mICovXG4gIGxhc3RJbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgbGV0IGZyb20gPSBvcHRzLmxlbmd0aCA+PSAxID8gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKSA6IGxlbmd0aCAtIDE7XG4gICAgaWYgKGZyb20gPT09IC1JbmZpbml0eSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChmcm9tID49IDApIHtcbiAgICAgIGZyb20gPSBmcm9tIDwgbGVuZ3RoIC0gMSA/IGZyb20gOiBsZW5ndGggLSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgT2JqZWN0SGFzT3duKGZsb2F0MTZiaXRzQXJyYXksIGkpICYmXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSA9PT0gZWxlbWVudFxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5pbmNsdWRlcyAqL1xuICBpbmNsdWRlcyhlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAoZnJvbSA9PT0gSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGlzTmFOID0gTnVtYmVySXNOYU4oZWxlbWVudCk7XG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG5cbiAgICAgIGlmIChpc05hTiAmJiBOdW1iZXJJc05hTih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuam9pbiAqL1xuICBqb2luKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgcmV0dXJuIEFycmF5UHJvdG90eXBlSm9pbihhcnJheSwgLi4ub3B0cyk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUudG9sb2NhbGVzdHJpbmcgKi9cbiAgdG9Mb2NhbGVTdHJpbmcoLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGFycmF5ID0gY29weVRvQXJyYXkoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIEFycmF5UHJvdG90eXBlVG9Mb2NhbGVTdHJpbmcoYXJyYXksIC4uLm9wdHMpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1nZXQtJXR5cGVkYXJyYXklLnByb3RvdHlwZS1AQHRvc3RyaW5ndGFnICovXG4gIGdldCBbU3ltYm9sVG9TdHJpbmdUYWddKCkge1xuICAgIGlmIChpc0Zsb2F0MTZBcnJheSh0aGlzKSkge1xuICAgICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoXCJGbG9hdDE2QXJyYXlcIik7XG4gICAgfVxuICB9XG59XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdHlwZWRhcnJheS5ieXRlc19wZXJfZWxlbWVudCAqL1xuT2JqZWN0RGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5LCBcIkJZVEVTX1BFUl9FTEVNRU5UXCIsIHtcbiAgdmFsdWU6IEJZVEVTX1BFUl9FTEVNRU5ULFxufSk7XG5cbi8vIGxpbWl0YXRpb246IEl0IGlzIHBlYWtlZCBieSBgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhGbG9hdDE2QXJyYXkpYCBhbmQgYFJlZmxlY3Qub3duS2V5cyhGbG9hdDE2QXJyYXkpYFxuT2JqZWN0RGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5LCBicmFuZCwge30pO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLXR5cGVkYXJyYXktY29uc3RydWN0b3JzICovXG5SZWZsZWN0U2V0UHJvdG90eXBlT2YoRmxvYXQxNkFycmF5LCBUeXBlZEFycmF5KTtcblxuY29uc3QgRmxvYXQxNkFycmF5UHJvdG90eXBlID0gRmxvYXQxNkFycmF5LnByb3RvdHlwZTtcblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10eXBlZGFycmF5LnByb3RvdHlwZS5ieXRlc19wZXJfZWxlbWVudCAqL1xuT2JqZWN0RGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5UHJvdG90eXBlLCBcIkJZVEVTX1BFUl9FTEVNRU5UXCIsIHtcbiAgdmFsdWU6IEJZVEVTX1BFUl9FTEVNRU5ULFxufSk7XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS1AQGl0ZXJhdG9yICovXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXlQcm90b3R5cGUsIFN5bWJvbEl0ZXJhdG9yLCB7XG4gIHZhbHVlOiBGbG9hdDE2QXJyYXlQcm90b3R5cGUudmFsdWVzLFxuICB3cml0YWJsZTogdHJ1ZSxcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxufSk7XG5cbi8vIFRvIG1ha2UgYG5ldyBGbG9hdDE2QXJyYXkoKSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5YCByZXR1cm5zIGBmYWxzZWBcblJlZmxlY3RTZXRQcm90b3R5cGVPZihGbG9hdDE2QXJyYXlQcm90b3R5cGUsIFR5cGVkQXJyYXlQcm90b3R5cGUpO1xuIiwiaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9fdXRpbC9jb252ZXJ0ZXIubWpzXCI7XG5pbXBvcnQge1xuICBEYXRhVmlld1Byb3RvdHlwZUdldFVpbnQxNixcbiAgRGF0YVZpZXdQcm90b3R5cGVTZXRVaW50MTYsXG59IGZyb20gXCIuL191dGlsL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKipcbiAqIHJldHVybnMgYW4gdW5zaWduZWQgMTYtYml0IGZsb2F0IGF0IHRoZSBzcGVjaWZpZWQgYnl0ZSBvZmZzZXQgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIERhdGFWaWV3LlxuICpcbiAqIEBwYXJhbSB7RGF0YVZpZXd9IGRhdGFWaWV3XG4gKiBAcGFyYW0ge251bWJlcn0gYnl0ZU9mZnNldFxuICogQHBhcmFtIHtbYm9vbGVhbl19IG9wdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCAuLi5vcHRzKSB7XG4gIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoXG4gICAgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIC4uLm9wdHMpXG4gICk7XG59XG5cbi8qKlxuICogc3RvcmVzIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCB2YWx1ZSBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlldy5cbiAqXG4gKiBAcGFyYW0ge0RhdGFWaWV3fSBkYXRhVmlld1xuICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXRcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxuICogQHBhcmFtIHtbYm9vbGVhbl19IG9wdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEZsb2F0MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIHZhbHVlLCAuLi5vcHRzKSB7XG4gIHJldHVybiBEYXRhVmlld1Byb3RvdHlwZVNldFVpbnQxNihcbiAgICBkYXRhVmlldyxcbiAgICBieXRlT2Zmc2V0LFxuICAgIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSksXG4gICAgLi4ub3B0c1xuICApO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0VBQUE7RUFDQTtBQUNBO0VBQ0EsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO0FBQzFDO0VBQ0E7RUFDQSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BDO0VBQ0E7RUFDQSxTQUFTLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7RUFD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QUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxNQUFNLENBQUM7RUFDckQsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0VBQy9CLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDL0I7RUFDQTtFQUNBLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUU7RUFDdEIsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLFdBQVcsTUFBTSxDQUFDO0VBQ2xDLElBQUksU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7RUFDbEMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0VBQy9CLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDL0I7RUFDQTtFQUNBLEdBQUcsTUFBTTtFQUNULElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLE1BQU0sQ0FBQztFQUNsQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDO0VBQ2xDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztFQUMvQixJQUFJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0VBQy9CLEdBQUc7RUFDSCxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLGtCQUFrQixDQUFDLEdBQUcsRUFBRTtFQUN4QyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDO0VBQzFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzFCLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElB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
