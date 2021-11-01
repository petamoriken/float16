/*! @petamoriken/float16 v3.5.6-2-g09878a6 | MIT License - https://git.io/float16 */

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

  // Array
  const NativeArray = Array;
  const ArrayIsArray = NativeArray.isArray;
  const ArrayPrototype = NativeArray.prototype;
  /** @type {(array: ArrayLike<unknown>, separator?: string) => string} */
  const ArrayPrototypeJoin = uncurryThis(ArrayPrototype.join);
  /** @type {<T>(array: T[], ...items: T[]) => number} */
  const ArrayPrototypePush = uncurryThis(ArrayPrototype.push);
  /** @type {(array: ArrayLike<unknown>) => string} */
  const ArrayPrototypeToLocaleString = uncurryThis(
    ArrayPrototype.toLocaleString
  );
  const NativeArrayPrototypeSymbolIterator = ArrayPrototype[SymbolIterator];
  /** @type {<T>(array: T[]) => IterableIterator<T>} */
  const ArrayPrototypeSymbolIterator = uncurryThis(NativeArrayPrototypeSymbolIterator);

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

  // ArrayIterator
  /** @type {any} */
  const ArrayIteratorPrototype = ReflectGetPrototypeOf([][SymbolIterator]());
  /** @type {<T>(arrayIterator: IterableIterator<T>) => IteratorResult<T>} */
  const ArrayIteratorPrototypeNext = uncurryThis(ArrayIteratorPrototype.next);

  // Generator
  /** @type {<T = unknown, TReturn = any, TNext = unknown>(generator: Generator<T, TReturn, TNext>, value?: TNext) => T} */
  const GeneratorPrototypeNext = uncurryThis((function* () {})().next);

  // Iterator
  const IteratorPrototype = ReflectGetPrototypeOf(ArrayIteratorPrototype);

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

  const THIS_IS_NOT_AN_OBJECT = "This is not an object";
  const THIS_IS_NOT_A_FLOAT16ARRAY_OBJECT = "This is not a Float16Array object";
  const THIS_CONSTRUCTOR_IS_NOT_A_SUBCLASS_OF_FLOAT16ARRAY =
    "This constructor is not a subclass of Float16Array";
  const THE_CONSTRUCTOR_PROPERTY_VALUE_IS_NOT_AN_OBJECT =
    "The constructor property value is not an object";
  const SPECIES_CONSTRUCTOR_DIDNT_RETURN_TYPEDARRAY_OBJECT =
    "Species constructor didn't return TypedArray object";
  const DERIVED_CONSTRUCTOR_CREATED_TYPEDARRAY_OBJECT_WHICH_WAS_TOO_SMALL_LENGTH =
    "Derived constructor created TypedArray object which was too small length";
  const ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER =
    "Attempting to access detached ArrayBuffer";
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

  /**
   * Wrap ArrayIterator If Array.prototype [@@iterator] has been modified
   *
   * @type {<T>(array: T[]) => Iterable<T>}
   */
  function toSafe(array) {
    if (array[SymbolIterator] === NativeArrayPrototypeSymbolIterator) {
      return array;
    }

    const arrayIterator = ArrayPrototypeSymbolIterator(array);
    return ObjectFreeze(/** @type {any} */ ({
      next() {
        return ArrayIteratorPrototypeNext(arrayIterator);
      },
      return: undefined,
      throw: undefined,

      [SymbolIterator]() {
        return this;
      },
    }));
  }

  /** @type {WeakMap<{}, Generator<any>>} */
  const generators = new NativeWeakMap();

  /** @see https://tc39.es/ecma262/#sec-%arrayiteratorprototype%-object */
  const DummyArrayIteratorPrototype = ObjectCreate(IteratorPrototype, {
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
  function wrapGenerator(generator) {
    const dummy = ObjectCreate(DummyArrayIteratorPrototype);
    WeakMapPrototypeSet(generators, dummy, generator);
    return dummy;
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
      throw NativeTypeError(THIS_IS_NOT_AN_OBJECT);
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
      throw NativeTypeError(THIS_IS_NOT_AN_OBJECT);
    }

    const constructor = target.constructor;
    if (constructor === undefined) {
      return defaultConstructor;
    }
    if (!isObject(constructor)) {
      throw NativeTypeError(THE_CONSTRUCTOR_PROPERTY_VALUE_IS_NOT_AN_OBJECT);
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

    if (isSharedArrayBuffer(buffer)) {
      return false;
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
      throw NativeTypeError(THE_CONSTRUCTOR_PROPERTY_VALUE_IS_NOT_AN_OBJECT);
    }

    return ReflectHas(constructor, brand);
  }

  /**
   * @param {unknown} target
   * @returns {target is Float16Array}
   */
  function isFloat16Array(target) {
    return WeakMapPrototypeHas(float16bitsArrays, target) ||
      (!ArrayBufferIsView(target) && hasFloat16ArrayBrand(target));
  }

  /**
   * @param {unknown} target
   * @throws {TypeError}
   * @returns {asserts target is Float16Array}
   */
  function assertFloat16Array(target) {
    if (!isFloat16Array(target)) {
      throw NativeTypeError(THIS_IS_NOT_A_FLOAT16ARRAY_OBJECT);
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
      throw NativeTypeError(SPECIES_CONSTRUCTOR_DIDNT_RETURN_TYPEDARRAY_OBJECT);
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
          DERIVED_CONSTRUCTOR_CREATED_TYPEDARRAY_OBJECT_WHICH_WAS_TOO_SMALL_LENGTH
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
        throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
      }
      return float16bitsArray;
    }

    // from another Float16Array instance (a different version?)
    // @ts-ignore
    const buffer = float16.buffer;

    if (IsDetachedBuffer(buffer)) {
      throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
    }

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

  /** @type {Set<string | symbol>} */
  const TypedArrayPrototypeGetterKeys = new NativeSet();
  for (const key of ReflectOwnKeys(TypedArrayPrototype)) {
    // @@toStringTag method is defined in Float16Array.prototype
    if (key === SymbolToStringTag) {
      continue;
    }

    const descriptor = ReflectGetOwnPropertyDescriptor(TypedArrayPrototype, key);
    if (ObjectHasOwn(descriptor, "get")) {
      SetPrototypeAdd(TypedArrayPrototypeGetterKeys, key);
    }
  }

  const handler = ObjectFreeze(/** @type {ProxyHandler<Float16Array>} */ ({
    get(target, key, receiver) {
      if (isCanonicalIntegerIndexString(key) && ObjectHasOwn(target, key)) {
        return convertToNumber(ReflectGet(target, key));
      }

      // %TypedArray%.prototype getter properties cannot called by Proxy receiver
      if (SetPrototypeHas(TypedArrayPrototypeGetterKeys, key)) {
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
            throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
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
              // eslint-disable-next-line no-restricted-syntax
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
                ReflectApply(mapFunc, this, [val, ...toSafe(args)])
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
          // eslint-disable-next-line no-restricted-syntax
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

      return wrapGenerator((function* () {
        // eslint-disable-next-line no-restricted-syntax
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

      return wrapGenerator((function* () {
        // eslint-disable-next-line no-restricted-syntax
        for (const [i, val] of TypedArrayPrototypeEntries(float16bitsArray)) {
          yield /** @type {[Number, number]} */ ([i, convertToNumber(val)]);
        }
      })());
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
          throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
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
        ...toSafe(opts)
      );

      return this;
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin */
    copyWithin(target, start, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      TypedArrayPrototypeCopyWithin(float16bitsArray, target, start, ...toSafe(opts));

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
            TypedArrayPrototypeSlice(uint16, ...toSafe(opts))
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
        throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
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
      const uint16Subarray = TypedArrayPrototypeSubarray(uint16, ...toSafe(opts));

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

      return ArrayPrototypeJoin(array, ...toSafe(opts));
    }

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring */
    toLocaleString(...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);

      const array = copyToArray(float16bitsArray);

      // @ts-ignore
      return ArrayPrototypeToLocaleString(array, ...toSafe(opts));
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
      DataViewPrototypeGetUint16(dataView, byteOffset, ...toSafe(opts))
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
      ...toSafe(opts)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXQxNi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL191dGlsL3ByaW1vcmRpYWxzLm1qcyIsIi4uL3NyYy9fdXRpbC9jb252ZXJ0ZXIubWpzIiwiLi4vc3JjL191dGlsL21lc3NhZ2VzLm1qcyIsIi4uL3NyYy9oZnJvdW5kLm1qcyIsIi4uL3NyYy9fdXRpbC9hcnJheUl0ZXJhdG9yLm1qcyIsIi4uL3NyYy9fdXRpbC9pcy5tanMiLCIuLi9zcmMvX3V0aWwvc3BlYy5tanMiLCIuLi9zcmMvRmxvYXQxNkFycmF5Lm1qcyIsIi4uL3NyYy9EYXRhVmlldy5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovXG4vKiBnbG9iYWwgU2hhcmVkQXJyYXlCdWZmZXIgKi9cblxuLyoqIEB0eXBlIHsodGFyZ2V0OiBGdW5jdGlvbikgPT4gKHRoaXNBcmc6IGFueSwgLi4uYXJnczogYW55W10pID0+IGFueX0gKi9cbmZ1bmN0aW9uIHVuY3VycnlUaGlzKHRhcmdldCkge1xuICByZXR1cm4gKHRoaXNBcmcsIC4uLmFyZ3MpID0+IHtcbiAgICByZXR1cm4gUmVmbGVjdEFwcGx5KHRhcmdldCwgdGhpc0FyZywgYXJncyk7XG4gIH07XG59XG5cbi8qKiBAdHlwZSB7KHRhcmdldDogYW55LCBrZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4gKHRoaXNBcmc6IGFueSwgLi4uYXJnczogYW55W10pID0+IGFueX0gKi9cbmZ1bmN0aW9uIHVuY3VycnlUaGlzR2V0dGVyKHRhcmdldCwga2V5KSB7XG4gIHJldHVybiB1bmN1cnJ5VGhpcyhcbiAgICBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgICAgdGFyZ2V0LFxuICAgICAga2V5XG4gICAgKS5nZXRcbiAgKTtcbn1cblxuLy8gUmVmbGVjdFxuZXhwb3J0IGNvbnN0IHtcbiAgYXBwbHk6IFJlZmxlY3RBcHBseSxcbiAgY29uc3RydWN0OiBSZWZsZWN0Q29uc3RydWN0LFxuICBkZWZpbmVQcm9wZXJ0eTogUmVmbGVjdERlZmluZVByb3BlcnR5LFxuICBnZXQ6IFJlZmxlY3RHZXQsXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgZ2V0UHJvdG90eXBlT2Y6IFJlZmxlY3RHZXRQcm90b3R5cGVPZixcbiAgaGFzOiBSZWZsZWN0SGFzLFxuICBvd25LZXlzOiBSZWZsZWN0T3duS2V5cyxcbiAgc2V0OiBSZWZsZWN0U2V0LFxuICBzZXRQcm90b3R5cGVPZjogUmVmbGVjdFNldFByb3RvdHlwZU9mLFxufSA9IFJlZmxlY3Q7XG5cbi8vIFByb3h5XG5leHBvcnQgY29uc3QgTmF0aXZlUHJveHkgPSBQcm94eTtcblxuLy8gTnVtYmVyXG5leHBvcnQgY29uc3QgTmF0aXZlTnVtYmVyID0gTnVtYmVyO1xuZXhwb3J0IGNvbnN0IHtcbiAgaXNGaW5pdGU6IE51bWJlcklzRmluaXRlLFxuICBpc05hTjogTnVtYmVySXNOYU4sXG59ID0gTmF0aXZlTnVtYmVyO1xuXG4vLyBTeW1ib2xcbmV4cG9ydCBjb25zdCB7XG4gIGl0ZXJhdG9yOiBTeW1ib2xJdGVyYXRvcixcbiAgc3BlY2llczogU3ltYm9sU3BlY2llcyxcbiAgdG9TdHJpbmdUYWc6IFN5bWJvbFRvU3RyaW5nVGFnLFxuICBmb3I6IFN5bWJvbEZvcixcbn0gPSBTeW1ib2w7XG5cbi8vIE9iamVjdFxuZXhwb3J0IGNvbnN0IE5hdGl2ZU9iamVjdCA9IE9iamVjdDtcbmV4cG9ydCBjb25zdCB7XG4gIGNyZWF0ZTogT2JqZWN0Q3JlYXRlLFxuICBkZWZpbmVQcm9wZXJ0eTogT2JqZWN0RGVmaW5lUHJvcGVydHksXG4gIGZyZWV6ZTogT2JqZWN0RnJlZXplLFxuICBpczogT2JqZWN0SXMsXG59ID0gTmF0aXZlT2JqZWN0O1xuLyoqIEB0eXBlIHsob2JqZWN0OiBvYmplY3QsIGtleTogUHJvcGVydHlLZXkpID0+IGJvb2xlYW59ICovXG5leHBvcnQgY29uc3QgT2JqZWN0SGFzT3duID0gLyoqIEB0eXBlIHthbnl9ICovIChOYXRpdmVPYmplY3QpLmhhc093biB8fFxuICB1bmN1cnJ5VGhpcyhOYXRpdmVPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuLy8gQXJyYXlcbmNvbnN0IE5hdGl2ZUFycmF5ID0gQXJyYXk7XG5leHBvcnQgY29uc3QgQXJyYXlJc0FycmF5ID0gTmF0aXZlQXJyYXkuaXNBcnJheTtcbmNvbnN0IEFycmF5UHJvdG90eXBlID0gTmF0aXZlQXJyYXkucHJvdG90eXBlO1xuLyoqIEB0eXBlIHsoYXJyYXk6IEFycmF5TGlrZTx1bmtub3duPiwgc2VwYXJhdG9yPzogc3RyaW5nKSA9PiBzdHJpbmd9ICovXG5leHBvcnQgY29uc3QgQXJyYXlQcm90b3R5cGVKb2luID0gdW5jdXJyeVRoaXMoQXJyYXlQcm90b3R5cGUuam9pbik7XG4vKiogQHR5cGUgezxUPihhcnJheTogVFtdLCAuLi5pdGVtczogVFtdKSA9PiBudW1iZXJ9ICovXG5leHBvcnQgY29uc3QgQXJyYXlQcm90b3R5cGVQdXNoID0gdW5jdXJyeVRoaXMoQXJyYXlQcm90b3R5cGUucHVzaCk7XG4vKiogQHR5cGUgeyhhcnJheTogQXJyYXlMaWtlPHVua25vd24+KSA9PiBzdHJpbmd9ICovXG5leHBvcnQgY29uc3QgQXJyYXlQcm90b3R5cGVUb0xvY2FsZVN0cmluZyA9IHVuY3VycnlUaGlzKFxuICBBcnJheVByb3RvdHlwZS50b0xvY2FsZVN0cmluZ1xuKTtcbmV4cG9ydCBjb25zdCBOYXRpdmVBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yID0gQXJyYXlQcm90b3R5cGVbU3ltYm9sSXRlcmF0b3JdO1xuLyoqIEB0eXBlIHs8VD4oYXJyYXk6IFRbXSkgPT4gSXRlcmFibGVJdGVyYXRvcjxUPn0gKi9cbmV4cG9ydCBjb25zdCBBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yID0gdW5jdXJyeVRoaXMoTmF0aXZlQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvcik7XG5cbi8vIE1hdGhcbmV4cG9ydCBjb25zdCBNYXRoVHJ1bmMgPSBNYXRoLnRydW5jO1xuXG4vLyBBcnJheUJ1ZmZlclxuZXhwb3J0IGNvbnN0IE5hdGl2ZUFycmF5QnVmZmVyID0gQXJyYXlCdWZmZXI7XG5leHBvcnQgY29uc3QgQXJyYXlCdWZmZXJJc1ZpZXcgPSBOYXRpdmVBcnJheUJ1ZmZlci5pc1ZpZXc7XG4vKiogQHR5cGUgeyhidWZmZXI6IEFycmF5QnVmZmVyLCBiZWdpbj86IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBudW1iZXJ9ICovXG5leHBvcnQgY29uc3QgQXJyYXlCdWZmZXJQcm90b3R5cGVTbGljZSA9IHVuY3VycnlUaGlzKE5hdGl2ZUFycmF5QnVmZmVyLnByb3RvdHlwZS5zbGljZSk7XG4vKiogQHR5cGUgeyhidWZmZXI6IEFycmF5QnVmZmVyKSA9PiBBcnJheUJ1ZmZlcn0gKi9cbmV4cG9ydCBjb25zdCBBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGggPSB1bmN1cnJ5VGhpc0dldHRlcihOYXRpdmVBcnJheUJ1ZmZlci5wcm90b3R5cGUsIFwiYnl0ZUxlbmd0aFwiKTtcblxuLy8gU2hhcmVkQXJyYXlCdWZmZXJcbmV4cG9ydCBjb25zdCBOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlciA9IHR5cGVvZiBTaGFyZWRBcnJheUJ1ZmZlciAhPT0gXCJ1bmRlZmluZWRcIiA/IFNoYXJlZEFycmF5QnVmZmVyIDogbnVsbDtcbi8qKiBAdHlwZSB7KGJ1ZmZlcjogU2hhcmVkQXJyYXlCdWZmZXIpID0+IFNoYXJlZEFycmF5QnVmZmVyfSAqL1xuZXhwb3J0IGNvbnN0IFNoYXJlZEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCA9IE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyXG4gICYmIHVuY3VycnlUaGlzR2V0dGVyKE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyLnByb3RvdHlwZSwgXCJieXRlTGVuZ3RoXCIpO1xuXG4vLyBUeXBlZEFycmF5XG4vKiogQHR5cGVkZWYge1VpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDMyQXJyYXl8RmxvYXQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fEJpZ0ludDY0QXJyYXl9IFR5cGVkQXJyYXkgKi9cbi8qKiBAdHlwZSB7YW55fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXkgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YoVWludDhBcnJheSk7XG5jb25zdCBUeXBlZEFycmF5RnJvbSA9IFR5cGVkQXJyYXkuZnJvbTtcbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlID0gVHlwZWRBcnJheS5wcm90b3R5cGU7XG4vKiogQHR5cGUgeyh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBJdGVyYWJsZUl0ZXJhdG9yPG51bWJlcj59ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUtleXMgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLmtleXMpO1xuLyoqIEB0eXBlIHsodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gSXRlcmFibGVJdGVyYXRvcjxudW1iZXI+fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVWYWx1ZXMgPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS52YWx1ZXNcbik7XG4vKiogQHR5cGUgeyh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFtudW1iZXIsIG51bWJlcl0+fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVFbnRyaWVzID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUuZW50cmllc1xuKTtcbi8qKiBAdHlwZSB7KHR5cGVkQXJyYXk6IFR5cGVkQXJyYXksIGFycmF5OiBBcnJheUxpa2U8bnVtYmVyPiwgb2Zmc2V0PzogbnVtYmVyKSA9PiB2b2lkfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVTZXQgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLnNldCk7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCkgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlUmV2ZXJzZSA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLnJldmVyc2Vcbik7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgdmFsdWU6IG51bWJlciwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlRmlsbCA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUuZmlsbCk7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgdGFyZ2V0OiBudW1iZXIsIHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlQ29weVdpdGhpbiA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLmNvcHlXaXRoaW5cbik7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgY29tcGFyZUZuPzogKGE6IG51bWJlciwgYjogbnVtYmVyKSA9PiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVNvcnQgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLnNvcnQpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5zbGljZSk7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlU3ViYXJyYXkgPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS5zdWJhcnJheVxuKTtcbi8qKiBAdHlwZSB7KCh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBBcnJheUJ1ZmZlcil9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlciA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBcImJ1ZmZlclwiXG4pO1xuLyoqIEB0eXBlIHsoKHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IG51bWJlcil9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQgPSB1bmN1cnJ5VGhpc0dldHRlcihcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgXCJieXRlT2Zmc2V0XCJcbik7XG4vKiogQHR5cGUgeygodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gbnVtYmVyKX0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoID0gdW5jdXJyeVRoaXNHZXR0ZXIoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUsXG4gIFwibGVuZ3RoXCJcbik7XG4vKiogQHR5cGUgeyh0YXJnZXQ6IHVua25vd24pID0+IHN0cmluZ30gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0U3ltYm9sVG9TdHJpbmdUYWcgPSB1bmN1cnJ5VGhpc0dldHRlcihcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgU3ltYm9sVG9TdHJpbmdUYWdcbik7XG5cbi8vIFVpbnQxNkFycmF5XG5leHBvcnQgY29uc3QgTmF0aXZlVWludDE2QXJyYXkgPSBVaW50MTZBcnJheTtcbi8qKiBAdHlwZSB7VWludDE2QXJyYXlDb25zdHJ1Y3RvcltcImZyb21cIl19ICovXG5leHBvcnQgY29uc3QgVWludDE2QXJyYXlGcm9tID0gKC4uLmFyZ3MpID0+IHtcbiAgcmV0dXJuIFJlZmxlY3RBcHBseShUeXBlZEFycmF5RnJvbSwgTmF0aXZlVWludDE2QXJyYXksIGFyZ3MpO1xufTtcblxuLy8gVWludDMyQXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVVaW50MzJBcnJheSA9IFVpbnQzMkFycmF5O1xuXG4vLyBGbG9hdDMyQXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVGbG9hdDMyQXJyYXkgPSBGbG9hdDMyQXJyYXk7XG5cbi8vIEFycmF5SXRlcmF0b3Jcbi8qKiBAdHlwZSB7YW55fSAqL1xuY29uc3QgQXJyYXlJdGVyYXRvclByb3RvdHlwZSA9IFJlZmxlY3RHZXRQcm90b3R5cGVPZihbXVtTeW1ib2xJdGVyYXRvcl0oKSk7XG4vKiogQHR5cGUgezxUPihhcnJheUl0ZXJhdG9yOiBJdGVyYWJsZUl0ZXJhdG9yPFQ+KSA9PiBJdGVyYXRvclJlc3VsdDxUPn0gKi9cbmV4cG9ydCBjb25zdCBBcnJheUl0ZXJhdG9yUHJvdG90eXBlTmV4dCA9IHVuY3VycnlUaGlzKEFycmF5SXRlcmF0b3JQcm90b3R5cGUubmV4dCk7XG5cbi8vIEdlbmVyYXRvclxuLyoqIEB0eXBlIHs8VCA9IHVua25vd24sIFRSZXR1cm4gPSBhbnksIFROZXh0ID0gdW5rbm93bj4oZ2VuZXJhdG9yOiBHZW5lcmF0b3I8VCwgVFJldHVybiwgVE5leHQ+LCB2YWx1ZT86IFROZXh0KSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IEdlbmVyYXRvclByb3RvdHlwZU5leHQgPSB1bmN1cnJ5VGhpcygoZnVuY3Rpb24qICgpIHt9KSgpLm5leHQpO1xuXG4vLyBJdGVyYXRvclxuZXhwb3J0IGNvbnN0IEl0ZXJhdG9yUHJvdG90eXBlID0gUmVmbGVjdEdldFByb3RvdHlwZU9mKEFycmF5SXRlcmF0b3JQcm90b3R5cGUpO1xuXG4vLyBEYXRhVmlld1xuY29uc3QgRGF0YVZpZXdQcm90b3R5cGUgPSBEYXRhVmlldy5wcm90b3R5cGU7XG4vKiogQHR5cGUgeyhkYXRhVmlldzogRGF0YVZpZXcsIGJ5dGVPZmZzZXQ6IG51bWJlciwgbGl0dGxlRW5kaWFuPzogYm9vbGVhbikgPT4gbnVtYmVyfSAqL1xuZXhwb3J0IGNvbnN0IERhdGFWaWV3UHJvdG90eXBlR2V0VWludDE2ID0gdW5jdXJyeVRoaXMoXG4gIERhdGFWaWV3UHJvdG90eXBlLmdldFVpbnQxNlxuKTtcbi8qKiBAdHlwZSB7KGRhdGFWaWV3OiBEYXRhVmlldywgYnl0ZU9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBsaXR0bGVFbmRpYW4/OiBib29sZWFuKSA9PiB2b2lkfSAqL1xuZXhwb3J0IGNvbnN0IERhdGFWaWV3UHJvdG90eXBlU2V0VWludDE2ID0gdW5jdXJyeVRoaXMoXG4gIERhdGFWaWV3UHJvdG90eXBlLnNldFVpbnQxNlxuKTtcblxuLy8gRXJyb3JcbmV4cG9ydCBjb25zdCBOYXRpdmVUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG5leHBvcnQgY29uc3QgTmF0aXZlUmFuZ2VFcnJvciA9IFJhbmdlRXJyb3I7XG5cbi8vIFNldFxuLyoqXG4gKiBEbyBub3QgY29uc3RydWN0IHdpdGggYXJndW1lbnRzIHRvIGF2b2lkIGNhbGxpbmcgdGhlIFwiYWRkXCIgbWV0aG9kXG4gKlxuICogQHR5cGUge3tuZXcgPFQgPSBhbnk+KCk6IFNldDxUPn19XG4gKi9cbmV4cG9ydCBjb25zdCBOYXRpdmVTZXQgPSBTZXQ7XG5jb25zdCBTZXRQcm90b3R5cGUgPSBOYXRpdmVTZXQucHJvdG90eXBlO1xuLyoqIEB0eXBlIHs8VD4oc2V0OiBTZXQ8VD4sIHZhbHVlOiBUKSA9PiBTZXQ8VD59ICovXG5leHBvcnQgY29uc3QgU2V0UHJvdG90eXBlQWRkID0gdW5jdXJyeVRoaXMoU2V0UHJvdG90eXBlLmFkZCk7XG4vKiogQHR5cGUgezxUPihzZXQ6IFNldDxUPiwgdmFsdWU6IFQpID0+IGJvb2xlYW59ICovXG5leHBvcnQgY29uc3QgU2V0UHJvdG90eXBlSGFzID0gdW5jdXJyeVRoaXMoU2V0UHJvdG90eXBlLmhhcyk7XG5cbi8vIFdlYWtNYXBcbi8qKlxuICogRG8gbm90IGNvbnN0cnVjdCB3aXRoIGFyZ3VtZW50cyB0byBhdm9pZCBjYWxsaW5nIHRoZSBcInNldFwiIG1ldGhvZFxuICpcbiAqIEB0eXBlIHt7bmV3IDxLIGV4dGVuZHMge30sIFY+KCk6IFdlYWtNYXA8SywgVj59fVxuICovXG5leHBvcnQgY29uc3QgTmF0aXZlV2Vha01hcCA9IFdlYWtNYXA7XG5jb25zdCBXZWFrTWFwUHJvdG90eXBlID0gTmF0aXZlV2Vha01hcC5wcm90b3R5cGU7XG4vKiogQHR5cGUgezxLIGV4dGVuZHMge30sIFY+KHdlYWtNYXA6IFdlYWtNYXA8SywgVj4sIGtleTogSykgPT4gVn0gKi9cbmV4cG9ydCBjb25zdCBXZWFrTWFwUHJvdG90eXBlR2V0ID0gdW5jdXJyeVRoaXMoV2Vha01hcFByb3RvdHlwZS5nZXQpO1xuLyoqIEB0eXBlIHs8SyBleHRlbmRzIHt9LCBWPih3ZWFrTWFwOiBXZWFrTWFwPEssIFY+LCBrZXk6IEspID0+IGJvb2xlYW59ICovXG5leHBvcnQgY29uc3QgV2Vha01hcFByb3RvdHlwZUhhcyA9IHVuY3VycnlUaGlzKFdlYWtNYXBQcm90b3R5cGUuaGFzKTtcbi8qKiBAdHlwZSB7PEsgZXh0ZW5kcyB7fSwgVj4od2Vha01hcDogV2Vha01hcDxLLCBWPiwga2V5OiBLLCB2YWx1ZTogVikgPT4gV2Vha01hcH0gKi9cbmV4cG9ydCBjb25zdCBXZWFrTWFwUHJvdG90eXBlU2V0ID0gdW5jdXJyeVRoaXMoV2Vha01hcFByb3RvdHlwZS5zZXQpO1xuIiwiLy8gYWxnb3JpdGhtOiBodHRwOi8vZm94LXRvb2xraXQub3JnL2Z0cC9mYXN0aGFsZmZsb2F0Y29udmVyc2lvbi5wZGZcblxuaW1wb3J0IHtcbiAgTmF0aXZlQXJyYXlCdWZmZXIsXG4gIE5hdGl2ZUZsb2F0MzJBcnJheSxcbiAgTmF0aXZlVWludDMyQXJyYXksXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG5jb25zdCBidWZmZXIgPSBuZXcgTmF0aXZlQXJyYXlCdWZmZXIoNCk7XG5jb25zdCBmbG9hdFZpZXcgPSBuZXcgTmF0aXZlRmxvYXQzMkFycmF5KGJ1ZmZlcik7XG5jb25zdCB1aW50MzJWaWV3ID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KGJ1ZmZlcik7XG5cbmNvbnN0IGJhc2VUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg1MTIpO1xuY29uc3Qgc2hpZnRUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg1MTIpO1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGNvbnN0IGUgPSBpIC0gMTI3O1xuXG4gIC8vIHZlcnkgc21hbGwgbnVtYmVyICgwLCAtMClcbiAgaWYgKGUgPCAtMjcpIHtcbiAgICBiYXNlVGFibGVbaV0gICAgICAgICA9IDB4MDAwMDtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAyNDtcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAyNDtcblxuICAvLyBzbWFsbCBudW1iZXIgKGRlbm9ybSlcbiAgfSBlbHNlIGlmIChlIDwgLTE0KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAgMHgwNDAwID4+ICgtZSAtIDE0KTtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9ICgweDA0MDAgPj4gKC1lIC0gMTQpKSB8IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAtZSAtIDE7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gLWUgLSAxO1xuXG4gIC8vIG5vcm1hbCBudW1iZXJcbiAgfSBlbHNlIGlmIChlIDw9IDE1KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAgKGUgKyAxNSkgPDwgMTA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAoKGUgKyAxNSkgPDwgMTApIHwgMHg4MDAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDEzO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDEzO1xuXG4gIC8vIGxhcmdlIG51bWJlciAoSW5maW5pdHksIC1JbmZpbml0eSlcbiAgfSBlbHNlIGlmIChlIDwgMTI4KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAweDdjMDA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweGZjMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gMjQ7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgLy8gc3RheSAoTmFOLCBJbmZpbml0eSwgLUluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gMHg3YzAwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDEzO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDEzO1xuICB9XG59XG5cbi8qKlxuICogcm91bmQgYSBudW1iZXIgdG8gYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzLlxuICpcbiAqIEBwYXJhbSB7dW5rbm93bn0gbnVtIC0gZG91YmxlIGZsb2F0XG4gKiBAcmV0dXJucyB7bnVtYmVyfSBoYWxmIGZsb2F0IG51bWJlciBiaXRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByb3VuZFRvRmxvYXQxNkJpdHMobnVtKSB7XG4gIGZsb2F0Vmlld1swXSA9IC8qKiBAdHlwZSB7YW55fSAqLyAobnVtKTtcbiAgY29uc3QgZiA9IHVpbnQzMlZpZXdbMF07XG4gIGNvbnN0IGUgPSAoZiA+PiAyMykgJiAweDFmZjtcbiAgcmV0dXJuIGJhc2VUYWJsZVtlXSArICgoZiAmIDB4MDA3ZmZmZmYpID4+IHNoaWZ0VGFibGVbZV0pO1xufVxuXG5jb25zdCBtYW50aXNzYVRhYmxlID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KDIwNDgpO1xuY29uc3QgZXhwb25lbnRUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg2NCk7XG5jb25zdCBvZmZzZXRUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg2NCk7XG5cbm1hbnRpc3NhVGFibGVbMF0gPSAwO1xuZm9yIChsZXQgaSA9IDE7IGkgPCAxMDI0OyArK2kpIHtcbiAgbGV0IG0gPSBpIDw8IDEzOyAgICAvLyB6ZXJvIHBhZCBtYW50aXNzYSBiaXRzXG4gIGxldCBlID0gMDsgICAgICAgICAgLy8gemVybyBleHBvbmVudFxuXG4gIC8vIG5vcm1hbGl6ZWRcbiAgd2hpbGUoKG0gJiAweDAwODAwMDAwKSA9PT0gMCkge1xuICAgIGUgLT0gMHgwMDgwMDAwMDsgIC8vIGRlY3JlbWVudCBleHBvbmVudFxuICAgIG0gPDw9IDE7XG4gIH1cblxuICBtICY9IH4weDAwODAwMDAwOyAgIC8vIGNsZWFyIGxlYWRpbmcgMSBiaXRcbiAgZSArPSAweDM4ODAwMDAwOyAgICAvLyBhZGp1c3QgYmlhc1xuXG4gIG1hbnRpc3NhVGFibGVbaV0gPSBtIHwgZTtcbn1cbmZvciAobGV0IGkgPSAxMDI0OyBpIDwgMjA0ODsgKytpKSB7XG4gIG1hbnRpc3NhVGFibGVbaV0gPSAweDM4MDAwMDAwICsgKChpIC0gMTAyNCkgPDwgMTMpO1xufVxuXG5leHBvbmVudFRhYmxlWzBdID0gMDtcbmZvciAobGV0IGkgPSAxOyBpIDwgMzE7ICsraSkge1xuICBleHBvbmVudFRhYmxlW2ldID0gaSA8PCAyMztcbn1cbmV4cG9uZW50VGFibGVbMzFdID0gMHg0NzgwMDAwMDtcbmV4cG9uZW50VGFibGVbMzJdID0gMHg4MDAwMDAwMDtcbmZvciAobGV0IGkgPSAzMzsgaSA8IDYzOyArK2kpIHtcbiAgZXhwb25lbnRUYWJsZVtpXSA9IDB4ODAwMDAwMDAgKyAoKGkgLSAzMikgPDwgMjMpO1xufVxuZXhwb25lbnRUYWJsZVs2M10gPSAweGM3ODAwMDAwO1xuXG5vZmZzZXRUYWJsZVswXSA9IDA7XG5mb3IgKGxldCBpID0gMTsgaSA8IDY0OyArK2kpIHtcbiAgaWYgKGkgPT09IDMyKSB7XG4gICAgb2Zmc2V0VGFibGVbaV0gPSAwO1xuICB9IGVsc2Uge1xuICAgIG9mZnNldFRhYmxlW2ldID0gMTAyNDtcbiAgfVxufVxuXG4vKipcbiAqIGNvbnZlcnQgYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBmbG9hdDE2Yml0cyAtIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGRvdWJsZSBmbG9hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzKSB7XG4gIGNvbnN0IG0gPSBmbG9hdDE2Yml0cyA+PiAxMDtcbiAgdWludDMyVmlld1swXSA9IG1hbnRpc3NhVGFibGVbb2Zmc2V0VGFibGVbbV0gKyAoZmxvYXQxNmJpdHMgJiAweDNmZildICsgZXhwb25lbnRUYWJsZVttXTtcbiAgcmV0dXJuIGZsb2F0Vmlld1swXTtcbn1cbiIsImV4cG9ydCBjb25zdCBUSElTX0lTX05PVF9BTl9PQkpFQ1QgPSBcIlRoaXMgaXMgbm90IGFuIG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IFRISVNfSVNfTk9UX0FfRkxPQVQxNkFSUkFZX09CSkVDVCA9IFwiVGhpcyBpcyBub3QgYSBGbG9hdDE2QXJyYXkgb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVkgPVxuICBcIlRoaXMgY29uc3RydWN0b3IgaXMgbm90IGEgc3ViY2xhc3Mgb2YgRmxvYXQxNkFycmF5XCI7XG5leHBvcnQgY29uc3QgVEhFX0NPTlNUUlVDVE9SX1BST1BFUlRZX1ZBTFVFX0lTX05PVF9BTl9PQkpFQ1QgPVxuICBcIlRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eSB2YWx1ZSBpcyBub3QgYW4gb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgU1BFQ0lFU19DT05TVFJVQ1RPUl9ESUROVF9SRVRVUk5fVFlQRURBUlJBWV9PQkpFQ1QgPVxuICBcIlNwZWNpZXMgY29uc3RydWN0b3IgZGlkbid0IHJldHVybiBUeXBlZEFycmF5IG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IERFUklWRURfQ09OU1RSVUNUT1JfQ1JFQVRFRF9UWVBFREFSUkFZX09CSkVDVF9XSElDSF9XQVNfVE9PX1NNQUxMX0xFTkdUSCA9XG4gIFwiRGVyaXZlZCBjb25zdHJ1Y3RvciBjcmVhdGVkIFR5cGVkQXJyYXkgb2JqZWN0IHdoaWNoIHdhcyB0b28gc21hbGwgbGVuZ3RoXCI7XG5leHBvcnQgY29uc3QgQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIgPVxuICBcIkF0dGVtcHRpbmcgdG8gYWNjZXNzIGRldGFjaGVkIEFycmF5QnVmZmVyXCI7XG5leHBvcnQgY29uc3QgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUID1cbiAgXCJDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3RcIjtcbmV4cG9ydCBjb25zdCBDQU5OT1RfQ09OVkVSVF9BX0JJR0lOVF9WQUxVRV9UT19BX05VTUJFUiA9XG4gIFwiQ2Fubm90IGNvbnZlcnQgYSBCaWdJbnQgdmFsdWUgdG8gYSBudW1iZXJcIjtcbmV4cG9ydCBjb25zdCBDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVMgPVxuICBcIkNhbm5vdCBtaXggQmlnSW50IGFuZCBvdGhlciB0eXBlcywgdXNlIGV4cGxpY2l0IGNvbnZlcnNpb25zXCI7XG5leHBvcnQgY29uc3QgUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSA9XG4gIFwiUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZVwiO1xuZXhwb3J0IGNvbnN0IE9GRlNFVF9JU19PVVRfT0ZfQk9VTkRTID0gXCJPZmZzZXQgaXMgb3V0IG9mIGJvdW5kc1wiO1xuIiwiaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9fdXRpbC9jb252ZXJ0ZXIubWpzXCI7XG5pbXBvcnQgeyBDQU5OT1RfQ09OVkVSVF9BX0JJR0lOVF9WQUxVRV9UT19BX05VTUJFUiB9IGZyb20gXCIuL191dGlsL21lc3NhZ2VzLm1qc1wiO1xuaW1wb3J0IHtcbiAgTmF0aXZlTnVtYmVyLFxuICBOYXRpdmVUeXBlRXJyb3IsXG4gIE51bWJlcklzRmluaXRlLFxufSBmcm9tIFwiLi9fdXRpbC9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiByZXR1cm5zIHRoZSBuZWFyZXN0IGhhbGYtcHJlY2lzaW9uIGZsb2F0IHJlcHJlc2VudGF0aW9uIG9mIGEgbnVtYmVyLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoZnJvdW5kKG51bSkge1xuICBpZiAodHlwZW9mIG51bSA9PT0gXCJiaWdpbnRcIikge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihDQU5OT1RfQ09OVkVSVF9BX0JJR0lOVF9WQUxVRV9UT19BX05VTUJFUik7XG4gIH1cblxuICBudW0gPSBOYXRpdmVOdW1iZXIobnVtKTtcblxuICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gIGlmICghTnVtYmVySXNGaW5pdGUobnVtKSB8fCBudW0gPT09IDApIHtcbiAgICByZXR1cm4gbnVtO1xuICB9XG5cbiAgY29uc3QgeDE2ID0gcm91bmRUb0Zsb2F0MTZCaXRzKG51bSk7XG4gIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoeDE2KTtcbn1cbiIsImltcG9ydCB7XG4gIEFycmF5SXRlcmF0b3JQcm90b3R5cGVOZXh0LFxuICBBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yLFxuICBHZW5lcmF0b3JQcm90b3R5cGVOZXh0LFxuICBJdGVyYXRvclByb3RvdHlwZSxcbiAgTmF0aXZlQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvcixcbiAgTmF0aXZlV2Vha01hcCxcbiAgT2JqZWN0Q3JlYXRlLFxuICBPYmplY3RGcmVlemUsXG4gIFN5bWJvbEl0ZXJhdG9yLFxuICBTeW1ib2xUb1N0cmluZ1RhZyxcbiAgV2Vha01hcFByb3RvdHlwZUdldCxcbiAgV2Vha01hcFByb3RvdHlwZVNldCxcbn0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbi8qKlxuICogV3JhcCBBcnJheUl0ZXJhdG9yIElmIEFycmF5LnByb3RvdHlwZSBbQEBpdGVyYXRvcl0gaGFzIGJlZW4gbW9kaWZpZWRcbiAqXG4gKiBAdHlwZSB7PFQ+KGFycmF5OiBUW10pID0+IEl0ZXJhYmxlPFQ+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9TYWZlKGFycmF5KSB7XG4gIGlmIChhcnJheVtTeW1ib2xJdGVyYXRvcl0gPT09IE5hdGl2ZUFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IpIHtcbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICBjb25zdCBhcnJheUl0ZXJhdG9yID0gQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvcihhcnJheSk7XG4gIHJldHVybiBPYmplY3RGcmVlemUoLyoqIEB0eXBlIHthbnl9ICovICh7XG4gICAgbmV4dCgpIHtcbiAgICAgIHJldHVybiBBcnJheUl0ZXJhdG9yUHJvdG90eXBlTmV4dChhcnJheUl0ZXJhdG9yKTtcbiAgICB9LFxuICAgIHJldHVybjogdW5kZWZpbmVkLFxuICAgIHRocm93OiB1bmRlZmluZWQsXG5cbiAgICBbU3ltYm9sSXRlcmF0b3JdKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgfSkpO1xufVxuXG4vKiogQHR5cGUge1dlYWtNYXA8e30sIEdlbmVyYXRvcjxhbnk+Pn0gKi9cbmNvbnN0IGdlbmVyYXRvcnMgPSBuZXcgTmF0aXZlV2Vha01hcCgpO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSVhcnJheWl0ZXJhdG9ycHJvdG90eXBlJS1vYmplY3QgKi9cbmNvbnN0IER1bW15QXJyYXlJdGVyYXRvclByb3RvdHlwZSA9IE9iamVjdENyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge1xuICBuZXh0OiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICBjb25zdCBnZW5lcmF0b3IgPSBXZWFrTWFwUHJvdG90eXBlR2V0KGdlbmVyYXRvcnMsIHRoaXMpO1xuICAgICAgcmV0dXJuIEdlbmVyYXRvclByb3RvdHlwZU5leHQoZ2VuZXJhdG9yKTtcbiAgICB9LFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgfSxcblxuICBbU3ltYm9sVG9TdHJpbmdUYWddOiB7XG4gICAgdmFsdWU6IFwiQXJyYXkgSXRlcmF0b3JcIixcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gIH0sXG59KTtcblxuLyoqIEB0eXBlIHs8VD4oZ2VuZXJhdG9yOiBHZW5lcmF0b3I8VD4pID0+IEl0ZXJhYmxlSXRlcmF0b3I8VD59ICovXG5leHBvcnQgZnVuY3Rpb24gd3JhcEdlbmVyYXRvcihnZW5lcmF0b3IpIHtcbiAgY29uc3QgZHVtbXkgPSBPYmplY3RDcmVhdGUoRHVtbXlBcnJheUl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgV2Vha01hcFByb3RvdHlwZVNldChnZW5lcmF0b3JzLCBkdW1teSwgZ2VuZXJhdG9yKTtcbiAgcmV0dXJuIGR1bW15O1xufVxuIiwiaW1wb3J0IHtcbiAgQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoLFxuICBBcnJheUlzQXJyYXksXG4gIE1hdGhUcnVuYyxcbiAgTmF0aXZlTnVtYmVyLFxuICBOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlcixcbiAgTnVtYmVySXNGaW5pdGUsXG4gIFNoYXJlZEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCxcbiAgU3ltYm9sSXRlcmF0b3IsXG4gIFN5bWJvbFRvU3RyaW5nVGFnLFxuICBUeXBlZEFycmF5UHJvdG90eXBlR2V0U3ltYm9sVG9TdHJpbmdUYWcsXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyB7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB8fFxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyB7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiO1xufVxuXG4vLyBJbnNwaXJlZCBieSB1dGlsLnR5cGVzIGltcGxlbWVudGF0aW9uIG9mIE5vZGUuanNcbi8qKiBAdHlwZWRlZiB7VWludDhBcnJheXxVaW50OENsYW1wZWRBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxJbnQ4QXJyYXl8SW50MTZBcnJheXxJbnQzMkFycmF5fEZsb2F0MzJBcnJheXxGbG9hdDY0QXJyYXl8QmlnVWludDY0QXJyYXl8QmlnSW50NjRBcnJheX0gVHlwZWRBcnJheSAqL1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBUeXBlZEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBUeXBlZEFycmF5UHJvdG90eXBlR2V0U3ltYm9sVG9TdHJpbmdUYWcodmFsdWUpICE9PSB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIEJpZ0ludDY0QXJyYXl8QmlnVWludDY0QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0JpZ0ludFR5cGVkQXJyYXkodmFsdWUpIHtcbiAgY29uc3QgdHlwZWRBcnJheU5hbWUgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0U3ltYm9sVG9TdHJpbmdUYWcodmFsdWUpO1xuICByZXR1cm4gdHlwZWRBcnJheU5hbWUgPT09IFwiQmlnSW50NjRBcnJheVwiIHx8XG4gICAgdHlwZWRBcnJheU5hbWUgPT09IFwiQmlnVWludDY0QXJyYXlcIjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgQXJyYXlCdWZmZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbHVlKSB7XG4gIHRyeSB7XG4gICAgQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoKC8qKiBAdHlwZSB7YW55fSAqLyAodmFsdWUpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBTaGFyZWRBcnJheUJ1ZmZlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhcmVkQXJyYXlCdWZmZXIodmFsdWUpIHtcbiAgaWYgKE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBTaGFyZWRBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGgoLyoqIEB0eXBlIHthbnl9ICovICh2YWx1ZSkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge3ZhbHVlIGlzIEl0ZXJhYmxlPHVua25vd24+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJdGVyYWJsZSh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlW1N5bWJvbEl0ZXJhdG9yXSA9PT0gXCJmdW5jdGlvblwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyB1bmtub3duW119XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09yZGluYXJ5QXJyYXkodmFsdWUpIHtcbiAgaWYgKCFBcnJheUlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaXRlcmF0b3IgPSB2YWx1ZVtTeW1ib2xJdGVyYXRvcl0oKTtcbiAgaWYgKGl0ZXJhdG9yW1N5bWJvbFRvU3RyaW5nVGFnXSAhPT0gXCJBcnJheSBJdGVyYXRvclwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIFR5cGVkQXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09yZGluYXJ5VHlwZWRBcnJheSh2YWx1ZSkge1xuICBpZiAoIWlzVHlwZWRBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBpdGVyYXRvciA9IHZhbHVlW1N5bWJvbEl0ZXJhdG9yXSgpO1xuICBpZiAoaXRlcmF0b3JbU3ltYm9sVG9TdHJpbmdUYWddICE9PSBcIkFycmF5IEl0ZXJhdG9yXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgc3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IG51bWJlciA9IE5hdGl2ZU51bWJlcih2YWx1ZSk7XG4gIGlmICh2YWx1ZSAhPT0gbnVtYmVyICsgXCJcIikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghTnVtYmVySXNGaW5pdGUobnVtYmVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChudW1iZXIgIT09IE1hdGhUcnVuYyhudW1iZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG4iLCJpbXBvcnQgeyBpc09iamVjdCwgaXNTaGFyZWRBcnJheUJ1ZmZlciB9IGZyb20gXCIuL2lzLm1qc1wiO1xuaW1wb3J0IHtcbiAgQ0FOTk9UX0NPTlZFUlRfQV9CSUdJTlRfVkFMVUVfVE9fQV9OVU1CRVIsXG4gIFRIRV9DT05TVFJVQ1RPUl9QUk9QRVJUWV9WQUxVRV9JU19OT1RfQU5fT0JKRUNULFxuICBUSElTX0lTX05PVF9BTl9PQkpFQ1QsXG59IGZyb20gXCIuL21lc3NhZ2VzLm1qc1wiO1xuaW1wb3J0IHtcbiAgQXJyYXlCdWZmZXJQcm90b3R5cGVTbGljZSxcbiAgTWF0aFRydW5jLFxuICBOYXRpdmVOdW1iZXIsXG4gIE5hdGl2ZVR5cGVFcnJvcixcbiAgTnVtYmVySXNOYU4sXG4gIE9iamVjdElzLFxuICBTeW1ib2xTcGVjaWVzLFxufSBmcm9tIFwiLi9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9pbnRlZ2Vyb3JpbmZpbml0eVxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBUb0ludGVnZXJPckluZmluaXR5KHRhcmdldCkge1xuICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJiaWdpbnRcIikge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihDQU5OT1RfQ09OVkVSVF9BX0JJR0lOVF9WQUxVRV9UT19BX05VTUJFUik7XG4gIH1cblxuICBjb25zdCBudW1iZXIgPSBOYXRpdmVOdW1iZXIodGFyZ2V0KTtcblxuICBpZiAoTnVtYmVySXNOYU4obnVtYmVyKSB8fCBudW1iZXIgPT09IDApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiBNYXRoVHJ1bmMobnVtYmVyKTtcbn1cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9sZW5ndGhcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBUb0xlbmd0aCh0YXJnZXQpIHtcbiAgY29uc3QgbGVuZ3RoID0gVG9JbnRlZ2VyT3JJbmZpbml0eSh0YXJnZXQpO1xuICBpZiAobGVuZ3RoIDwgMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIGxlbmd0aCA8IE5hdGl2ZU51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgPyBsZW5ndGhcbiAgICA6IE5hdGl2ZU51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1sZW5ndGhvZmFycmF5bGlrZVxuICogQHBhcmFtIHtvYmplY3R9IGFycmF5TGlrZVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIExlbmd0aE9mQXJyYXlMaWtlKGFycmF5TGlrZSkge1xuICBpZiAoIWlzT2JqZWN0KGFycmF5TGlrZSkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhJU19JU19OT1RfQU5fT0JKRUNUKTtcbiAgfVxuXG4gIHJldHVybiBUb0xlbmd0aCgvKiogQHR5cGUge2FueX0gKi8gKGFycmF5TGlrZSkubGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtc3BlY2llc2NvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0XG4gKiBAcGFyYW0ge3sgbmV3KC4uLmFyZ3M6IGFueVtdKTogYW55OyB9fSBkZWZhdWx0Q29uc3RydWN0b3JcbiAqIEByZXR1cm5zIHt7IG5ldyguLi5hcmdzOiBhbnlbXSk6IGFueTsgfX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFNwZWNpZXNDb25zdHJ1Y3Rvcih0YXJnZXQsIGRlZmF1bHRDb25zdHJ1Y3Rvcikge1xuICBpZiAoIWlzT2JqZWN0KHRhcmdldCkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhJU19JU19OT1RfQU5fT0JKRUNUKTtcbiAgfVxuXG4gIGNvbnN0IGNvbnN0cnVjdG9yID0gdGFyZ2V0LmNvbnN0cnVjdG9yO1xuICBpZiAoY29uc3RydWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBkZWZhdWx0Q29uc3RydWN0b3I7XG4gIH1cbiAgaWYgKCFpc09iamVjdChjb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhFX0NPTlNUUlVDVE9SX1BST1BFUlRZX1ZBTFVFX0lTX05PVF9BTl9PQkpFQ1QpO1xuICB9XG5cbiAgY29uc3Qgc3BlY2llcyA9IGNvbnN0cnVjdG9yW1N5bWJvbFNwZWNpZXNdO1xuICBpZiAoc3BlY2llcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRDb25zdHJ1Y3RvcjtcbiAgfVxuXG4gIHJldHVybiBzcGVjaWVzO1xufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1pc2RldGFjaGVkYnVmZmVyXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyTGlrZX0gYnVmZmVyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIElzRGV0YWNoZWRCdWZmZXIoYnVmZmVyKSB7XG4gIHRyeSB7XG4gICAgQXJyYXlCdWZmZXJQcm90b3R5cGVTbGljZShidWZmZXIsIDAsIDApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBjYXRjaCAoZSkgey8qIGVtcHR5ICovfVxuXG4gIGlmIChpc1NoYXJlZEFycmF5QnVmZmVyKGJ1ZmZlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBiaWdpbnQgY29tcGFyaXNvbnMgYXJlIG5vdCBzdXBwb3J0ZWRcbiAqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb3J0XG4gKiBAcGFyYW0ge251bWJlcn0geFxuICogQHBhcmFtIHtudW1iZXJ9IHlcbiAqIEByZXR1cm5zIHstMSB8IDAgfCAxfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdENvbXBhcmUoeCwgeSkge1xuICBjb25zdCBpc1hOYU4gPSBOdW1iZXJJc05hTih4KTtcbiAgY29uc3QgaXNZTmFOID0gTnVtYmVySXNOYU4oeSk7XG5cbiAgaWYgKGlzWE5hTiAmJiBpc1lOYU4pIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChpc1hOYU4pIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGlmIChpc1lOYU4pIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBpZiAoeCA8IHkpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBpZiAoeCA+IHkpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGlmICh4ID09PSAwICYmIHkgPT09IDApIHtcbiAgICBjb25zdCBpc1hQbHVzWmVybyA9IE9iamVjdElzKHgsIDApO1xuICAgIGNvbnN0IGlzWVBsdXNaZXJvID0gT2JqZWN0SXMoeSwgMCk7XG5cbiAgICBpZiAoIWlzWFBsdXNaZXJvICYmIGlzWVBsdXNaZXJvKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKGlzWFBsdXNaZXJvICYmICFpc1lQbHVzWmVybykge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIDA7XG59XG4iLCJpbXBvcnQgeyB0b1NhZmUsIHdyYXBHZW5lcmF0b3IgfSBmcm9tIFwiLi9fdXRpbC9hcnJheUl0ZXJhdG9yLm1qc1wiO1xuaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9fdXRpbC9jb252ZXJ0ZXIubWpzXCI7XG5pbXBvcnQge1xuICBpc0FycmF5QnVmZmVyLFxuICBpc0JpZ0ludFR5cGVkQXJyYXksXG4gIGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nLFxuICBpc0l0ZXJhYmxlLFxuICBpc09iamVjdCxcbiAgaXNPYmplY3RMaWtlLFxuICBpc09yZGluYXJ5QXJyYXksXG4gIGlzT3JkaW5hcnlUeXBlZEFycmF5LFxuICBpc1NoYXJlZEFycmF5QnVmZmVyLFxuICBpc1R5cGVkQXJyYXksXG59IGZyb20gXCIuL191dGlsL2lzLm1qc1wiO1xuaW1wb3J0IHtcbiAgQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIsXG4gIENBTk5PVF9DT05WRVJUX1VOREVGSU5FRF9PUl9OVUxMX1RPX09CSkVDVCxcbiAgQ0FOTk9UX01JWF9CSUdJTlRfQU5EX09USEVSX1RZUEVTLFxuICBERVJJVkVEX0NPTlNUUlVDVE9SX0NSRUFURURfVFlQRURBUlJBWV9PQkpFQ1RfV0hJQ0hfV0FTX1RPT19TTUFMTF9MRU5HVEgsXG4gIE9GRlNFVF9JU19PVVRfT0ZfQk9VTkRTLFxuICBSRURVQ0VfT0ZfRU1QVFlfQVJSQVlfV0lUSF9OT19JTklUSUFMX1ZBTFVFLFxuICBTUEVDSUVTX0NPTlNUUlVDVE9SX0RJRE5UX1JFVFVSTl9UWVBFREFSUkFZX09CSkVDVCxcbiAgVEhFX0NPTlNUUlVDVE9SX1BST1BFUlRZX1ZBTFVFX0lTX05PVF9BTl9PQkpFQ1QsXG4gIFRISVNfQ09OU1RSVUNUT1JfSVNfTk9UX0FfU1VCQ0xBU1NfT0ZfRkxPQVQxNkFSUkFZLFxuICBUSElTX0lTX05PVF9BX0ZMT0FUMTZBUlJBWV9PQkpFQ1QsXG59IGZyb20gXCIuL191dGlsL21lc3NhZ2VzLm1qc1wiO1xuaW1wb3J0IHtcbiAgQXJyYXlCdWZmZXJJc1ZpZXcsXG4gIEFycmF5UHJvdG90eXBlSm9pbixcbiAgQXJyYXlQcm90b3R5cGVQdXNoLFxuICBBcnJheVByb3RvdHlwZVRvTG9jYWxlU3RyaW5nLFxuICBOYXRpdmVBcnJheUJ1ZmZlcixcbiAgTmF0aXZlT2JqZWN0LFxuICBOYXRpdmVQcm94eSxcbiAgTmF0aXZlUmFuZ2VFcnJvcixcbiAgTmF0aXZlU2V0LFxuICBOYXRpdmVUeXBlRXJyb3IsXG4gIE5hdGl2ZVVpbnQxNkFycmF5LFxuICBOYXRpdmVXZWFrTWFwLFxuICBOdW1iZXJJc05hTixcbiAgT2JqZWN0RGVmaW5lUHJvcGVydHksXG4gIE9iamVjdEZyZWV6ZSxcbiAgT2JqZWN0SGFzT3duLFxuICBSZWZsZWN0QXBwbHksXG4gIFJlZmxlY3RDb25zdHJ1Y3QsXG4gIFJlZmxlY3REZWZpbmVQcm9wZXJ0eSxcbiAgUmVmbGVjdEdldCxcbiAgUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgUmVmbGVjdEdldFByb3RvdHlwZU9mLFxuICBSZWZsZWN0SGFzLFxuICBSZWZsZWN0T3duS2V5cyxcbiAgUmVmbGVjdFNldCxcbiAgUmVmbGVjdFNldFByb3RvdHlwZU9mLFxuICBTZXRQcm90b3R5cGVBZGQsXG4gIFNldFByb3RvdHlwZUhhcyxcbiAgU3ltYm9sRm9yLFxuICBTeW1ib2xJdGVyYXRvcixcbiAgU3ltYm9sVG9TdHJpbmdUYWcsXG4gIFR5cGVkQXJyYXksXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVDb3B5V2l0aGluLFxuICBUeXBlZEFycmF5UHJvdG90eXBlRW50cmllcyxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUZpbGwsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0LFxuICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoLFxuICBUeXBlZEFycmF5UHJvdG90eXBlS2V5cyxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVJldmVyc2UsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVTZXQsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVNvcnQsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVTdWJhcnJheSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVZhbHVlcyxcbiAgVWludDE2QXJyYXlGcm9tLFxuICBXZWFrTWFwUHJvdG90eXBlR2V0LFxuICBXZWFrTWFwUHJvdG90eXBlSGFzLFxuICBXZWFrTWFwUHJvdG90eXBlU2V0LFxufSBmcm9tIFwiLi9fdXRpbC9wcmltb3JkaWFscy5tanNcIjtcbmltcG9ydCB7XG4gIElzRGV0YWNoZWRCdWZmZXIsXG4gIExlbmd0aE9mQXJyYXlMaWtlLFxuICBTcGVjaWVzQ29uc3RydWN0b3IsXG4gIFRvSW50ZWdlck9ySW5maW5pdHksXG4gIGRlZmF1bHRDb21wYXJlLFxufSBmcm9tIFwiLi9fdXRpbC9zcGVjLm1qc1wiO1xuXG5jb25zdCBCWVRFU19QRVJfRUxFTUVOVCA9IDI7XG5cbmNvbnN0IGJyYW5kID0gU3ltYm9sRm9yKFwiX19GbG9hdDE2QXJyYXlfX1wiKTtcblxuLyoqIEB0eXBlIHtXZWFrTWFwPEZsb2F0MTZBcnJheSwgVWludDE2QXJyYXkgJiB7IF9fZmxvYXQxNmJpdHM6IG5ldmVyIH0+fSAqL1xuY29uc3QgZmxvYXQxNmJpdHNBcnJheXMgPSBuZXcgTmF0aXZlV2Vha01hcCgpO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaGFzRmxvYXQxNkFycmF5QnJhbmQodGFyZ2V0KSB7XG4gIGlmICghaXNPYmplY3RMaWtlKHRhcmdldCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBwcm90b3R5cGUgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcbiAgaWYgKCFpc09iamVjdExpa2UocHJvdG90eXBlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGNvbnN0cnVjdG9yID0gcHJvdG90eXBlLmNvbnN0cnVjdG9yO1xuICBpZiAoY29uc3RydWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KGNvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSEVfQ09OU1RSVUNUT1JfUFJPUEVSVFlfVkFMVUVfSVNfTk9UX0FOX09CSkVDVCk7XG4gIH1cblxuICByZXR1cm4gUmVmbGVjdEhhcyhjb25zdHJ1Y3RvciwgYnJhbmQpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7dGFyZ2V0IGlzIEZsb2F0MTZBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRmxvYXQxNkFycmF5KHRhcmdldCkge1xuICByZXR1cm4gV2Vha01hcFByb3RvdHlwZUhhcyhmbG9hdDE2Yml0c0FycmF5cywgdGFyZ2V0KSB8fFxuICAgICghQXJyYXlCdWZmZXJJc1ZpZXcodGFyZ2V0KSAmJiBoYXNGbG9hdDE2QXJyYXlCcmFuZCh0YXJnZXQpKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge2Fzc2VydHMgdGFyZ2V0IGlzIEZsb2F0MTZBcnJheX1cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0RmxvYXQxNkFycmF5KHRhcmdldCkge1xuICBpZiAoIWlzRmxvYXQxNkFycmF5KHRhcmdldCkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhJU19JU19OT1RfQV9GTE9BVDE2QVJSQVlfT0JKRUNUKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcGFyYW0ge251bWJlcj19IGNvdW50XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcmV0dXJucyB7YXNzZXJ0cyB0YXJnZXQgaXMgVWludDhBcnJheXxVaW50OENsYW1wZWRBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxJbnQ4QXJyYXl8SW50MTZBcnJheXxJbnQzMkFycmF5fEZsb2F0MTZBcnJheXxGbG9hdDMyQXJyYXl8RmxvYXQ2NEFycmF5fVxuICovXG5mdW5jdGlvbiBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheSh0YXJnZXQsIGNvdW50KSB7XG4gIGNvbnN0IGlzVGFyZ2V0RmxvYXQxNkFycmF5ID0gaXNGbG9hdDE2QXJyYXkodGFyZ2V0KTtcbiAgY29uc3QgaXNUYXJnZXRUeXBlZEFycmF5ID0gaXNUeXBlZEFycmF5KHRhcmdldCk7XG5cbiAgaWYgKCFpc1RhcmdldEZsb2F0MTZBcnJheSAmJiAhaXNUYXJnZXRUeXBlZEFycmF5KSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFNQRUNJRVNfQ09OU1RSVUNUT1JfRElETlRfUkVUVVJOX1RZUEVEQVJSQVlfT0JKRUNUKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgY291bnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICBsZXQgbGVuZ3RoO1xuICAgIGlmIChpc1RhcmdldEZsb2F0MTZBcnJheSkge1xuICAgICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGFyZ2V0KTtcbiAgICAgIGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgodGFyZ2V0KTtcbiAgICB9XG5cbiAgICBpZiAobGVuZ3RoIDwgY291bnQpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgREVSSVZFRF9DT05TVFJVQ1RPUl9DUkVBVEVEX1RZUEVEQVJSQVlfT0JKRUNUX1dISUNIX1dBU19UT09fU01BTExfTEVOR1RIXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChpc0JpZ0ludFR5cGVkQXJyYXkodGFyZ2V0KSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVMpO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHtGbG9hdDE2QXJyYXl9IGZsb2F0MTZcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEByZXR1cm5zIHtVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfX1cbiAqL1xuZnVuY3Rpb24gZ2V0RmxvYXQxNkJpdHNBcnJheShmbG9hdDE2KSB7XG4gIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBXZWFrTWFwUHJvdG90eXBlR2V0KGZsb2F0MTZiaXRzQXJyYXlzLCBmbG9hdDE2KTtcbiAgaWYgKGZsb2F0MTZiaXRzQXJyYXkgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgaWYgKElzRGV0YWNoZWRCdWZmZXIoYnVmZmVyKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgICB9XG4gICAgcmV0dXJuIGZsb2F0MTZiaXRzQXJyYXk7XG4gIH1cblxuICAvLyBmcm9tIGFub3RoZXIgRmxvYXQxNkFycmF5IGluc3RhbmNlIChhIGRpZmZlcmVudCB2ZXJzaW9uPylcbiAgLy8gQHRzLWlnbm9yZVxuICBjb25zdCBidWZmZXIgPSBmbG9hdDE2LmJ1ZmZlcjtcblxuICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgfVxuXG4gIGNvbnN0IGNsb25lZCA9IFJlZmxlY3RDb25zdHJ1Y3QoRmxvYXQxNkFycmF5LCBbXG4gICAgYnVmZmVyLFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBmbG9hdDE2LmJ5dGVPZmZzZXQsXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGZsb2F0MTYubGVuZ3RoLFxuICBdLCBmbG9hdDE2LmNvbnN0cnVjdG9yKTtcbiAgcmV0dXJuIFdlYWtNYXBQcm90b3R5cGVHZXQoZmxvYXQxNmJpdHNBcnJheXMsIGNsb25lZCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfX0gZmxvYXQxNmJpdHNBcnJheVxuICogQHJldHVybnMge251bWJlcltdfVxuICovXG5mdW5jdGlvbiBjb3B5VG9BcnJheShmbG9hdDE2Yml0c0FycmF5KSB7XG4gIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgY29uc3QgYXJyYXkgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGFycmF5W2ldID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufVxuXG4vKiogQHR5cGUge1NldDxzdHJpbmcgfCBzeW1ib2w+fSAqL1xuY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUdldHRlcktleXMgPSBuZXcgTmF0aXZlU2V0KCk7XG5mb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0T3duS2V5cyhUeXBlZEFycmF5UHJvdG90eXBlKSkge1xuICAvLyBAQHRvU3RyaW5nVGFnIG1ldGhvZCBpcyBkZWZpbmVkIGluIEZsb2F0MTZBcnJheS5wcm90b3R5cGVcbiAgaWYgKGtleSA9PT0gU3ltYm9sVG9TdHJpbmdUYWcpIHtcbiAgICBjb250aW51ZTtcbiAgfVxuXG4gIGNvbnN0IGRlc2NyaXB0b3IgPSBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFR5cGVkQXJyYXlQcm90b3R5cGUsIGtleSk7XG4gIGlmIChPYmplY3RIYXNPd24oZGVzY3JpcHRvciwgXCJnZXRcIikpIHtcbiAgICBTZXRQcm90b3R5cGVBZGQoVHlwZWRBcnJheVByb3RvdHlwZUdldHRlcktleXMsIGtleSk7XG4gIH1cbn1cblxuY29uc3QgaGFuZGxlciA9IE9iamVjdEZyZWV6ZSgvKiogQHR5cGUge1Byb3h5SGFuZGxlcjxGbG9hdDE2QXJyYXk+fSAqLyAoe1xuICBnZXQodGFyZ2V0LCBrZXksIHJlY2VpdmVyKSB7XG4gICAgaWYgKGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKGtleSkgJiYgT2JqZWN0SGFzT3duKHRhcmdldCwga2V5KSkge1xuICAgICAgcmV0dXJuIGNvbnZlcnRUb051bWJlcihSZWZsZWN0R2V0KHRhcmdldCwga2V5KSk7XG4gICAgfVxuXG4gICAgLy8gJVR5cGVkQXJyYXklLnByb3RvdHlwZSBnZXR0ZXIgcHJvcGVydGllcyBjYW5ub3QgY2FsbGVkIGJ5IFByb3h5IHJlY2VpdmVyXG4gICAgaWYgKFNldFByb3RvdHlwZUhhcyhUeXBlZEFycmF5UHJvdG90eXBlR2V0dGVyS2V5cywga2V5KSkge1xuICAgICAgcmV0dXJuIFJlZmxlY3RHZXQodGFyZ2V0LCBrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0R2V0KHRhcmdldCwga2V5LCByZWNlaXZlcik7XG4gIH0sXG5cbiAgc2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICBpZiAoaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcoa2V5KSAmJiBPYmplY3RIYXNPd24odGFyZ2V0LCBrZXkpKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdFNldCh0YXJnZXQsIGtleSwgcm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZmxlY3RTZXQodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcik7XG4gIH0sXG5cbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG4gICAgaWYgKGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKGtleSkgJiYgT2JqZWN0SGFzT3duKHRhcmdldCwga2V5KSkge1xuICAgICAgY29uc3QgZGVzY3JpcHRvciA9IFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IGNvbnZlcnRUb051bWJlcihkZXNjcmlwdG9yLnZhbHVlKTtcbiAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgfSxcblxuICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICAgIGlmIChcbiAgICAgIGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKGtleSkgJiZcbiAgICAgIE9iamVjdEhhc093bih0YXJnZXQsIGtleSkgJiZcbiAgICAgIE9iamVjdEhhc093bihkZXNjcmlwdG9yLCBcInZhbHVlXCIpXG4gICAgKSB7XG4gICAgICBkZXNjcmlwdG9yLnZhbHVlID0gcm91bmRUb0Zsb2F0MTZCaXRzKGRlc2NyaXB0b3IudmFsdWUpO1xuICAgICAgcmV0dXJuIFJlZmxlY3REZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZmxlY3REZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcik7XG4gIH0sXG59KSk7XG5cbmV4cG9ydCBjbGFzcyBGbG9hdDE2QXJyYXkge1xuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXR5cGVkYXJyYXkgKi9cbiAgY29uc3RydWN0b3IoaW5wdXQsIF9ieXRlT2Zmc2V0LCBfbGVuZ3RoKSB7XG4gICAgLyoqIEB0eXBlIHtVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfX0gKi9cbiAgICBsZXQgZmxvYXQxNmJpdHNBcnJheTtcblxuICAgIGlmIChpc0Zsb2F0MTZBcnJheShpbnB1dCkpIHtcbiAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBbZ2V0RmxvYXQxNkJpdHNBcnJheShpbnB1dCldLCBuZXcudGFyZ2V0KTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGlucHV0KSAmJiAhaXNBcnJheUJ1ZmZlcihpbnB1dCkpIHsgLy8gb2JqZWN0IHdpdGhvdXQgQXJyYXlCdWZmZXJcbiAgICAgIC8qKiBAdHlwZSB7QXJyYXlMaWtlPHVua25vd24+fSAqL1xuICAgICAgbGV0IGxpc3Q7XG4gICAgICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgICAgIGxldCBsZW5ndGg7XG5cbiAgICAgIGlmIChpc1R5cGVkQXJyYXkoaW5wdXQpKSB7IC8vIFR5cGVkQXJyYXlcbiAgICAgICAgbGlzdCA9IGlucHV0O1xuICAgICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGlucHV0KTtcblxuICAgICAgICBjb25zdCBidWZmZXIgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGlucHV0KTtcbiAgICAgICAgY29uc3QgQnVmZmVyQ29uc3RydWN0b3IgPSAhaXNTaGFyZWRBcnJheUJ1ZmZlcihidWZmZXIpXG4gICAgICAgICAgPyAvKiogQHR5cGUge0FycmF5QnVmZmVyQ29uc3RydWN0b3J9ICovIChTcGVjaWVzQ29uc3RydWN0b3IoXG4gICAgICAgICAgICBidWZmZXIsXG4gICAgICAgICAgICBOYXRpdmVBcnJheUJ1ZmZlclxuICAgICAgICAgICkpXG4gICAgICAgICAgOiBOYXRpdmVBcnJheUJ1ZmZlcjtcblxuICAgICAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0JpZ0ludFR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFUyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhID0gbmV3IEJ1ZmZlckNvbnN0cnVjdG9yKFxuICAgICAgICAgIGxlbmd0aCAqIEJZVEVTX1BFUl9FTEVNRU5UXG4gICAgICAgICk7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBbZGF0YV0sIG5ldy50YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzSXRlcmFibGUoaW5wdXQpKSB7IC8vIEl0ZXJhYmxlIChBcnJheSlcbiAgICAgICAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgICAgICAgaWYgKGlzT3JkaW5hcnlBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIGxpc3QgPSBpbnB1dDtcbiAgICAgICAgICAgIGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgICAgICAgICBsaXN0ID0gWy4uLmlucHV0XTtcbiAgICAgICAgICAgIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8gQXJyYXlMaWtlXG4gICAgICAgICAgbGlzdCA9IC8qKiBAdHlwZSB7QXJyYXlMaWtlPHVua25vd24+fSAqLyAoaW5wdXQpO1xuICAgICAgICAgIGxlbmd0aCA9IExlbmd0aE9mQXJyYXlMaWtlKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBmbG9hdDE2Yml0c0FycmF5ID0gUmVmbGVjdENvbnN0cnVjdChOYXRpdmVVaW50MTZBcnJheSwgW2xlbmd0aF0sIG5ldy50YXJnZXQpO1xuICAgICAgfVxuXG4gICAgICAvLyBzZXQgdmFsdWVzXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXlbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMobGlzdFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8gcHJpbWl0aXZlLCBBcnJheUJ1ZmZlclxuICAgICAgZmxvYXQxNmJpdHNBcnJheSA9IFJlZmxlY3RDb25zdHJ1Y3QoTmF0aXZlVWludDE2QXJyYXksIGFyZ3VtZW50cywgbmV3LnRhcmdldCk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJveHkgPSBuZXcgTmF0aXZlUHJveHkoLyoqIEB0eXBlIHthbnl9ICovIChmbG9hdDE2Yml0c0FycmF5KSwgaGFuZGxlcik7XG5cbiAgICAvLyBwcm94eSBwcml2YXRlIHN0b3JhZ2VcbiAgICBXZWFrTWFwUHJvdG90eXBlU2V0KGZsb2F0MTZiaXRzQXJyYXlzLCBwcm94eSwgZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICByZXR1cm4gcHJveHk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZsb2F0MTZBcnJheSlgIG9yIGBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5KWAgaW5jbHVkZSB0aGlzIGtleVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLmZyb21cbiAgICovXG4gIHN0YXRpYyBmcm9tKHNyYywgLi4ub3B0cykge1xuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gdGhpcztcblxuICAgIGlmICghUmVmbGVjdEhhcyhDb25zdHJ1Y3RvciwgYnJhbmQpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIFRISVNfQ09OU1RSVUNUT1JfSVNfTk9UX0FfU1VCQ0xBU1NfT0ZfRkxPQVQxNkFSUkFZXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICBpZiAoQ29uc3RydWN0b3IgPT09IEZsb2F0MTZBcnJheSkge1xuICAgICAgaWYgKGlzRmxvYXQxNkFycmF5KHNyYykgJiYgb3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkoc3JjKTtcbiAgICAgICAgY29uc3QgdWludDE2ID0gbmV3IE5hdGl2ZVVpbnQxNkFycmF5KFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSh1aW50MTYpKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgICAgIFVpbnQxNkFycmF5RnJvbShzcmMsIHJvdW5kVG9GbG9hdDE2Qml0cylcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1hcEZ1bmMgPSBvcHRzWzBdO1xuICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMV07XG5cbiAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKFxuICAgICAgICAgIFVpbnQxNkFycmF5RnJvbShzcmMsIGZ1bmN0aW9uICh2YWwsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiByb3VuZFRvRmxvYXQxNkJpdHMoXG4gICAgICAgICAgICAgIFJlZmxlY3RBcHBseShtYXBGdW5jLCB0aGlzLCBbdmFsLCAuLi50b1NhZmUoYXJncyldKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9LCB0aGlzQXJnKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7QXJyYXlMaWtlPHVua25vd24+fSAqL1xuICAgIGxldCBsaXN0O1xuICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICAgIGxldCBsZW5ndGg7XG5cbiAgICBpZiAoaXNJdGVyYWJsZShzcmMpKSB7IC8vIEl0ZXJhYmxlIChUeXBlZEFycmF5LCBBcnJheSlcbiAgICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICAgIGlmIChpc09yZGluYXJ5QXJyYXkoc3JjKSkge1xuICAgICAgICBsaXN0ID0gc3JjO1xuICAgICAgICBsZW5ndGggPSBzcmMubGVuZ3RoO1xuICAgICAgfSBlbHNlIGlmIChpc09yZGluYXJ5VHlwZWRBcnJheShzcmMpKSB7XG4gICAgICAgIGxpc3QgPSBzcmM7XG4gICAgICAgIGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoc3JjKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgICBsaXN0ID0gWy4uLnNyY107XG4gICAgICAgIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIEFycmF5TGlrZVxuICAgICAgbGlzdCA9IHNyYztcbiAgICAgIGxlbmd0aCA9IExlbmd0aE9mQXJyYXlMaWtlKHNyYyk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBhcnJheVtpXSA9IC8qKiBAdHlwZSB7bnVtYmVyfSAqLyAobGlzdFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1hcEZ1bmMgPSBvcHRzWzBdO1xuICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMV07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gUmVmbGVjdEFwcGx5KG1hcEZ1bmMsIHRoaXNBcmcsIFtsaXN0W2ldLCBpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGbG9hdDE2QXJyYXkpYCBvciBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgIGluY2x1ZGUgdGhpcyBrZXlcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5vZlxuICAgKi9cbiAgc3RhdGljIG9mKC4uLml0ZW1zKSB7XG4gICAgY29uc3QgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgaWYgKCFSZWZsZWN0SGFzKENvbnN0cnVjdG9yLCBicmFuZCkpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgbGVuZ3RoID0gaXRlbXMubGVuZ3RoO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBwcm94eSA9IG5ldyBGbG9hdDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHByb3h5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBmbG9hdDE2Yml0c0FycmF5W2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGl0ZW1zW2ldKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH1cblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBhcnJheVtpXSA9IGl0ZW1zW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5rZXlzICovXG4gIGtleXMoKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgcmV0dXJuIFR5cGVkQXJyYXlQcm90b3R5cGVLZXlzKGZsb2F0MTZiaXRzQXJyYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IHJldHVybnMgYSBvYmplY3Qgd2hvc2UgcHJvdG90eXBlIGlzIG5vdCBgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlYFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS52YWx1ZXNcbiAgICovXG4gIHZhbHVlcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gd3JhcEdlbmVyYXRvcigoZnVuY3Rpb24qICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgZm9yIChjb25zdCB2YWwgb2YgVHlwZWRBcnJheVByb3RvdHlwZVZhbHVlcyhmbG9hdDE2Yml0c0FycmF5KSkge1xuICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiByZXR1cm5zIGEgb2JqZWN0IHdob3NlIHByb3RvdHlwZSBpcyBub3QgYCVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJWBcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZW50cmllc1xuICAgKi9cbiAgZW50cmllcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gd3JhcEdlbmVyYXRvcigoZnVuY3Rpb24qICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgZm9yIChjb25zdCBbaSwgdmFsXSBvZiBUeXBlZEFycmF5UHJvdG90eXBlRW50cmllcyhmbG9hdDE2Yml0c0FycmF5KSkge1xuICAgICAgICB5aWVsZCAvKiogQHR5cGUge1tOdW1iZXIsIG51bWJlcl19ICovIChbaSwgY29udmVydFRvTnVtYmVyKHZhbCldKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5hdCAqL1xuICBhdChpbmRleCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgcmVsYXRpdmVJbmRleCA9IFRvSW50ZWdlck9ySW5maW5pdHkoaW5kZXgpO1xuICAgIGNvbnN0IGsgPSByZWxhdGl2ZUluZGV4ID49IDAgPyByZWxhdGl2ZUluZGV4IDogbGVuZ3RoICsgcmVsYXRpdmVJbmRleDtcblxuICAgIGlmIChrIDwgMCB8fCBrID49IGxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtrXSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUubWFwICovXG4gIG1hcChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBwcm94eSA9IG5ldyBGbG9hdDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgIGNvbnN0IGFycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShwcm94eSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgICBhcnJheVtpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhcbiAgICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSwgbGVuZ3RoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGFycmF5W2ldID0gUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdmFsLCBpLCB0aGlzXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbHRlciAqL1xuICBmaWx0ZXIoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgY29uc3Qga2VwdCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKSkge1xuICAgICAgICBBcnJheVByb3RvdHlwZVB1c2goa2VwdCwgdmFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGtlcHQpO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5KTtcblxuICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKGFycmF5KTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5yZWR1Y2UgKi9cbiAgcmVkdWNlKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbMF0pO1xuICAgICAgc3RhcnQgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soXG4gICAgICAgIGFjY3VtdWxhdG9yLFxuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJlZHVjZXJpZ2h0ICovXG4gIHJlZHVjZVJpZ2h0KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbbGVuZ3RoIC0gMV0pO1xuICAgICAgc3RhcnQgPSBsZW5ndGggLSAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IGxlbmd0aCAtIDE7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpID49IDA7IC0taSkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjYWxsYmFjayhcbiAgICAgICAgYWNjdW11bGF0b3IsXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgaSxcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZm9yZWFjaCAqL1xuICBmb3JFYWNoKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW1xuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXMsXG4gICAgICBdKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZCAqL1xuICBmaW5kKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kaW5kZXggKi9cbiAgZmluZEluZGV4KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLWFycmF5LWZpbmQtZnJvbS1sYXN0L2luZGV4Lmh0bWwjc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZGxhc3QgKi9cbiAgZmluZExhc3QoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtYXJyYXktZmluZC1mcm9tLWxhc3QvaW5kZXguaHRtbCNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kbGFzdGluZGV4ICovXG4gIGZpbmRMYXN0SW5kZXgoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5ldmVyeSAqL1xuICBldmVyeShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoXG4gICAgICAgICFSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICBdKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb21lICovXG4gIHNvbWUoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKFxuICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICBdKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zZXQgKi9cbiAgc2V0KGlucHV0LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGFyZ2V0T2Zmc2V0ID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAodGFyZ2V0T2Zmc2V0IDwgMCkge1xuICAgICAgdGhyb3cgTmF0aXZlUmFuZ2VFcnJvcihPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyk7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0ID09IG51bGwpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpc0JpZ0ludFR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFU1xuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KGlucHV0KSkge1xuICAgICAgLy8gcGVlbCBvZmYgUHJveHlcbiAgICAgIHJldHVybiBUeXBlZEFycmF5UHJvdG90eXBlU2V0KFxuICAgICAgICBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpLFxuICAgICAgICBnZXRGbG9hdDE2Qml0c0FycmF5KGlucHV0KSxcbiAgICAgICAgdGFyZ2V0T2Zmc2V0XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpc1R5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGlucHV0KTtcbiAgICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRMZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgY29uc3Qgc3JjID0gTmF0aXZlT2JqZWN0KGlucHV0KTtcbiAgICBjb25zdCBzcmNMZW5ndGggPSBMZW5ndGhPZkFycmF5TGlrZShzcmMpO1xuXG4gICAgaWYgKHRhcmdldE9mZnNldCA9PT0gSW5maW5pdHkgfHwgc3JjTGVuZ3RoICsgdGFyZ2V0T2Zmc2V0ID4gdGFyZ2V0TGVuZ3RoKSB7XG4gICAgICB0aHJvdyBOYXRpdmVSYW5nZUVycm9yKE9GRlNFVF9JU19PVVRfT0ZfQk9VTkRTKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNyY0xlbmd0aDsgKytpKSB7XG4gICAgICBmbG9hdDE2Yml0c0FycmF5W2kgKyB0YXJnZXRPZmZzZXRdID0gcm91bmRUb0Zsb2F0MTZCaXRzKHNyY1tpXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJldmVyc2UgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBUeXBlZEFycmF5UHJvdG90eXBlUmV2ZXJzZShmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbGwgKi9cbiAgZmlsbCh2YWx1ZSwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVGaWxsKFxuICAgICAgZmxvYXQxNmJpdHNBcnJheSxcbiAgICAgIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSksXG4gICAgICAuLi50b1NhZmUob3B0cylcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuY29weXdpdGhpbiAqL1xuICBjb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBUeXBlZEFycmF5UHJvdG90eXBlQ29weVdpdGhpbihmbG9hdDE2Yml0c0FycmF5LCB0YXJnZXQsIHN0YXJ0LCAuLi50b1NhZmUob3B0cykpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc29ydCAqL1xuICBzb3J0KC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBjb21wYXJlID0gb3B0c1swXSAhPT0gdW5kZWZpbmVkID8gb3B0c1swXSA6IGRlZmF1bHRDb21wYXJlO1xuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVTb3J0KGZsb2F0MTZiaXRzQXJyYXksICh4LCB5KSA9PiB7XG4gICAgICByZXR1cm4gY29tcGFyZShjb252ZXJ0VG9OdW1iZXIoeCksIGNvbnZlcnRUb051bWJlcih5KSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zbGljZSAqL1xuICBzbGljZSguLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgQ29uc3RydWN0b3IgPSBTcGVjaWVzQ29uc3RydWN0b3IoZmxvYXQxNmJpdHNBcnJheSwgRmxvYXQxNkFycmF5KTtcblxuICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICBpZiAoQ29uc3RydWN0b3IgPT09IEZsb2F0MTZBcnJheSkge1xuICAgICAgY29uc3QgdWludDE2ID0gbmV3IE5hdGl2ZVVpbnQxNkFycmF5KFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldChmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KVxuICAgICAgKTtcbiAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSh1aW50MTYsIC4uLnRvU2FmZShvcHRzKSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHN0YXJ0ID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBjb25zdCBlbmQgPSBvcHRzWzFdID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMV0pO1xuXG4gICAgbGV0IGs7XG4gICAgaWYgKHN0YXJ0ID09PSAtSW5maW5pdHkpIHtcbiAgICAgIGsgPSAwO1xuICAgIH0gZWxzZSBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICBrID0gbGVuZ3RoICsgc3RhcnQgPiAwID8gbGVuZ3RoICsgc3RhcnQgOiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBrID0gbGVuZ3RoIDwgc3RhcnQgPyBsZW5ndGggOiBzdGFydDtcbiAgICB9XG5cbiAgICBsZXQgZmluYWw7XG4gICAgaWYgKGVuZCA9PT0gLUluZmluaXR5KSB7XG4gICAgICBmaW5hbCA9IDA7XG4gICAgfSBlbHNlIGlmIChlbmQgPCAwKSB7XG4gICAgICBmaW5hbCA9IGxlbmd0aCArIGVuZCA+IDAgPyBsZW5ndGggKyBlbmQgOiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaW5hbCA9IGxlbmd0aCA8IGVuZCA/IGxlbmd0aCA6IGVuZDtcbiAgICB9XG5cbiAgICBjb25zdCBjb3VudCA9IGZpbmFsIC0gayA+IDAgPyBmaW5hbCAtIGsgOiAwO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGNvdW50KTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSwgY291bnQpO1xuXG4gICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIpO1xuICAgIH1cblxuICAgIGxldCBuID0gMDtcbiAgICB3aGlsZSAoayA8IGZpbmFsKSB7XG4gICAgICBhcnJheVtuXSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2tdKTtcbiAgICAgICsraztcbiAgICAgICsrbjtcbiAgICB9XG5cbiAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChhcnJheSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc3ViYXJyYXkgKi9cbiAgc3ViYXJyYXkoLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG5cbiAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgKTtcbiAgICBjb25zdCB1aW50MTZTdWJhcnJheSA9IFR5cGVkQXJyYXlQcm90b3R5cGVTdWJhcnJheSh1aW50MTYsIC4uLnRvU2FmZShvcHRzKSk7XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIodWludDE2U3ViYXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQodWludDE2U3ViYXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aCh1aW50MTZTdWJhcnJheSlcbiAgICApO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5KTtcblxuICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKGFycmF5KTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5pbmRleG9mICovXG4gIGluZGV4T2YoZWxlbWVudCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICBsZXQgZnJvbSA9IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSk7XG4gICAgaWYgKGZyb20gPT09IEluZmluaXR5KSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICBmcm9tID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoXG4gICAgICAgIE9iamVjdEhhc093bihmbG9hdDE2Yml0c0FycmF5LCBpKSAmJlxuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSkgPT09IGVsZW1lbnRcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUubGFzdGluZGV4b2YgKi9cbiAgbGFzdEluZGV4T2YoZWxlbWVudCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICBsZXQgZnJvbSA9IG9wdHMubGVuZ3RoID49IDEgPyBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pIDogbGVuZ3RoIC0gMTtcbiAgICBpZiAoZnJvbSA9PT0gLUluZmluaXR5KSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKGZyb20gPj0gMCkge1xuICAgICAgZnJvbSA9IGZyb20gPCBsZW5ndGggLSAxID8gZnJvbSA6IGxlbmd0aCAtIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBmcm9tOyBpID49IDA7IC0taSkge1xuICAgICAgaWYgKFxuICAgICAgICBPYmplY3RIYXNPd24oZmxvYXQxNmJpdHNBcnJheSwgaSkgJiZcbiAgICAgICAgY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pID09PSBlbGVtZW50XG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmluY2x1ZGVzICovXG4gIGluY2x1ZGVzKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgbGV0IGZyb20gPSBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pO1xuICAgIGlmIChmcm9tID09PSBJbmZpbml0eSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgZnJvbSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaXNOYU4gPSBOdW1iZXJJc05hTihlbGVtZW50KTtcbiAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcblxuICAgICAgaWYgKGlzTmFOICYmIE51bWJlcklzTmFOKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlID09PSBlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5qb2luICovXG4gIGpvaW4oLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGFycmF5ID0gY29weVRvQXJyYXkoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICByZXR1cm4gQXJyYXlQcm90b3R5cGVKb2luKGFycmF5LCAuLi50b1NhZmUob3B0cykpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnRvbG9jYWxlc3RyaW5nICovXG4gIHRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiBBcnJheVByb3RvdHlwZVRvTG9jYWxlU3RyaW5nKGFycmF5LCAuLi50b1NhZmUob3B0cykpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1nZXQtJXR5cGVkYXJyYXklLnByb3RvdHlwZS1AQHRvc3RyaW5ndGFnICovXG4gIGdldCBbU3ltYm9sVG9TdHJpbmdUYWddKCkge1xuICAgIGlmIChpc0Zsb2F0MTZBcnJheSh0aGlzKSkge1xuICAgICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoXCJGbG9hdDE2QXJyYXlcIik7XG4gICAgfVxuICB9XG59XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdHlwZWRhcnJheS5ieXRlc19wZXJfZWxlbWVudCAqL1xuT2JqZWN0RGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5LCBcIkJZVEVTX1BFUl9FTEVNRU5UXCIsIHtcbiAgdmFsdWU6IEJZVEVTX1BFUl9FTEVNRU5ULFxufSk7XG5cbi8vIGxpbWl0YXRpb246IEl0IGlzIHBlYWtlZCBieSBgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhGbG9hdDE2QXJyYXkpYCBhbmQgYFJlZmxlY3Qub3duS2V5cyhGbG9hdDE2QXJyYXkpYFxuT2JqZWN0RGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5LCBicmFuZCwge30pO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLXR5cGVkYXJyYXktY29uc3RydWN0b3JzICovXG5SZWZsZWN0U2V0UHJvdG90eXBlT2YoRmxvYXQxNkFycmF5LCBUeXBlZEFycmF5KTtcblxuY29uc3QgRmxvYXQxNkFycmF5UHJvdG90eXBlID0gRmxvYXQxNkFycmF5LnByb3RvdHlwZTtcblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10eXBlZGFycmF5LnByb3RvdHlwZS5ieXRlc19wZXJfZWxlbWVudCAqL1xuT2JqZWN0RGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5UHJvdG90eXBlLCBcIkJZVEVTX1BFUl9FTEVNRU5UXCIsIHtcbiAgdmFsdWU6IEJZVEVTX1BFUl9FTEVNRU5ULFxufSk7XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS1AQGl0ZXJhdG9yICovXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXlQcm90b3R5cGUsIFN5bWJvbEl0ZXJhdG9yLCB7XG4gIHZhbHVlOiBGbG9hdDE2QXJyYXlQcm90b3R5cGUudmFsdWVzLFxuICB3cml0YWJsZTogdHJ1ZSxcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxufSk7XG5cbi8vIFRvIG1ha2UgYG5ldyBGbG9hdDE2QXJyYXkoKSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5YCByZXR1cm5zIGBmYWxzZWBcblJlZmxlY3RTZXRQcm90b3R5cGVPZihGbG9hdDE2QXJyYXlQcm90b3R5cGUsIFR5cGVkQXJyYXlQcm90b3R5cGUpO1xuIiwiaW1wb3J0IHsgdG9TYWZlIH0gZnJvbSBcIi4vX3V0aWwvYXJyYXlJdGVyYXRvci5tanNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHtcbiAgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYsXG4gIERhdGFWaWV3UHJvdG90eXBlU2V0VWludDE2LFxufSBmcm9tIFwiLi9fdXRpbC9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiByZXR1cm5zIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlldy5cbiAqXG4gKiBAcGFyYW0ge0RhdGFWaWV3fSBkYXRhVmlld1xuICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXRcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmxvYXQxNihkYXRhVmlldywgYnl0ZU9mZnNldCwgLi4ub3B0cykge1xuICByZXR1cm4gY29udmVydFRvTnVtYmVyKFxuICAgIERhdGFWaWV3UHJvdG90eXBlR2V0VWludDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCAuLi50b1NhZmUob3B0cykpXG4gICk7XG59XG5cbi8qKlxuICogc3RvcmVzIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCB2YWx1ZSBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlldy5cbiAqXG4gKiBAcGFyYW0ge0RhdGFWaWV3fSBkYXRhVmlld1xuICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXRcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxuICogQHBhcmFtIHtbYm9vbGVhbl19IG9wdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEZsb2F0MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIHZhbHVlLCAuLi5vcHRzKSB7XG4gIHJldHVybiBEYXRhVmlld1Byb3RvdHlwZVNldFVpbnQxNihcbiAgICBkYXRhVmlldyxcbiAgICBieXRlT2Zmc2V0LFxuICAgIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSksXG4gICAgLi4udG9TYWZlKG9wdHMpXG4gICk7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7RUFBQTtFQUNBO0FBQ0E7RUFDQTtFQUNBLFNBQVMsV0FBVyxDQUFDLE1BQU0sRUFBRTtFQUM3QixFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLEtBQUs7RUFDL0IsSUFBSSxPQUFPLFlBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQy9DLEdBQUcsQ0FBQztFQUNKLENBQUM7QUFDRDtFQUNBO0VBQ0EsU0FBUyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUs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LENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ25DLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkM7RUFDQTtFQUNBLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUU7RUFDdEIsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQztFQUMzQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLE1BQU0sQ0FBQztFQUNyRCxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7RUFDL0IsSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMvQjtFQUNBO0VBQ0EsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRTtFQUN0QixJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsV0FBVyxNQUFNLENBQUM7RUFDbEMsSUFBSSxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQztFQUNsQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7RUFDL0IsSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMvQjtFQUNBO0VBQ0EsR0FBRyxNQUFNO0VBQ1QsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLFdBQVcsTUFBTSxDQUFDO0VBQ2xDLElBQUksU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7RUFDbEMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0VBQy9CLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7RUFDL0IsR0FBRztFQUNILENBQUM7QUFDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsa0JBQWtCLENBQUMsR0FBRyxFQUFFO0VBQ3hDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUM7RUFDMUMsRUFBRSxNQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDMUIsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksS0FBSyxDQUFDO0VBQzlCLEVBQUUsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzVELENBQUM7QUFDRDtFQUNBLE1BQU0sYUFBYSxHQUFHLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDbEQsTUFBTSxhQUFhLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUNoRCxNQUFNLFdBQVcsR0FBRyxJQUFJLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzlDO0VBQ0EsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNyQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQy9CLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztFQUNsQixFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaO0VBQ0E7RUFDQSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxNQUFNLENBQUMsRUFBRTtFQUNoQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUM7RUFDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ1osR0FBRztBQUNIO0VBQ0EsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7RUFDbkIsRUFBRSxDQUFDLElBQUksVUFBVSxDQUFDO0FBQ2xCO0VBQ0EsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUMzQixDQUFDO0VBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRTtFQUNsQyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0VBQ3JELENBQUM7QUFDRDtFQUNBLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDckIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtFQUM3QixFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0VBQzdCLENBQUM7RUFDRCxhQUFhLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDO0VBQy9CLGFBQWEsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUM7RUFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtFQUM5QixFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0VBQ25ELENBQUM7RUFDRCxhQUFhLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDO0FBQy9CO0VBQ0EsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQzdCLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFO0VBQ2hCLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUN2QixHQUFHLE1BQU07RUFDVCxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7RUFDMUIsR0FBRztFQUNILENBQUM7QUFDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsZUFBZSxDQUFDLFdBQVcsRUFBRTtFQUM3QyxFQUFFLE1BQU0sQ0FBQyxHQUFHLFdBQVcsSUFBSSxFQUFFLENBQUM7RUFDOUIsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDM0YsRUFBRSxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN0Qjs7RUMxSE8sTUFBTSxxQkFBcUIsR0FBRyx1QkFBdUIsQ0FBQztFQUN0RCxNQUFNLGlDQUFpQyxHQUFHLG1DQUFtQyxDQUFDO0VBQzlFLE1BQU0sa0RBQWtEO0VBQy9ELEVBQUUsb0RBQW9ELENBQUM7RUFDaEQsTUFBTSwrQ0FBK0M7RUFDNUQsRUFBRSxpREFBaUQsQ0FBQztFQUM3QyxNQUFNLGtEQUFrRDtFQUMvRCxFQUFFLHFEQUFxRCxDQUFDO0VBQ2pELE1BQU0sd0VBQXdFO0VBQ3JGLEVBQUUsMEVBQTBFLENBQUM7RUFDdEUsTUFBTSx5Q0FBeUM7RUFDdEQsRUFBRSwyQ0FBMkMsQ0FBQztFQUN2QyxNQUFNLDBDQUEwQztFQUN2RCxFQUFFLDRDQUE0QyxDQUFDO0VBQ3hDLE1BQU0seUNBQXlDO0VBQ3RELEVBQUUsMkNBQTJDLENBQUM7RUFDdkMsTUFBTSxpQ0FBaUM7RUFDOUMsRUFBRSw2REFBNkQsQ0FBQztFQUN6RCxNQUFNLDJDQUEyQztFQUN4RCxFQUFFLDZDQUE2QyxDQUFDO0VBQ3pDLE1BQU0sdUJBQXVCLEdBQUcseUJBQXlCOztFQ1poRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7RUFDN0IsRUFBRSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtFQUMvQixJQUFJLE1BQU0sZUFBZSxDQUFDLHlDQUF5QyxDQUFDLENBQUM7RUFDckUsR0FBRztBQUNIO0VBQ0EsRUFBRSxHQUFHLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFCO0VBQ0E7RUFDQSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsRUFBRTtFQUN6QyxJQUFJLE9BQU8sR0FBRyxDQUFDO0VBQ2YsR0FBRztBQUNIO0VBQ0EsRUFBRSxNQUFNLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUN0QyxFQUFFLE9BQU8sZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzlCOztFQ2JBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLE1BQU0sQ0FBQyxLQUFLLEVBQUU7RUFDOUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxrQ0FBa0MsRUFBRTtFQUNwRSxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7QUFDSDtFQUNBLEVBQUUsTUFBTSxhQUFhLEdBQUcsNEJBQTRCLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDNUQsRUFBRSxPQUFPLFlBQVkscUJBQXFCO0VBQzFDLElBQUksSUFBSSxHQUFHO0VBQ1gsTUFBTSxPQUFPLDBCQUEwQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0VBQ3ZELEtBQUs7RUFDTCxJQUFJLE1BQU0sRUFBRSxTQUFTO0VBQ3JCLElBQUksS0FBSyxFQUFFLFNBQVM7QUFDcEI7RUFDQSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUc7RUFDdkIsTUFBTSxPQUFPLElBQUksQ0FBQztFQUNsQixLQUFLO0VBQ0wsR0FBRyxFQUFFLENBQUM7RUFDTixDQUFDO0FBQ0Q7RUFDQTtFQUNBLE1BQU0sVUFBVSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7QUFDdkM7RUFDQTtFQUNBLE1BQU0sMkJBQTJCLEdBQUcsWUFBWSxDQUFDLGlCQUFpQixFQUFFO0VBQ3BFLEVBQUUsSUFBSSxFQUFFO0VBQ1IsSUFBSSxLQUFLLEVBQUUsU0FBUyxJQUFJLEdBQUc7RUFDM0IsTUFBTSxNQUFNLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDOUQsTUFBTSxPQUFPLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQy9DLEtBQUs7RUFDTCxJQUFJLFFBQVEsRUFBRSxJQUFJO0VBQ2xCLElBQUksWUFBWSxFQUFFLElBQUk7RUFDdEIsR0FBRztBQUNIO0VBQ0EsRUFBRSxDQUFDLGlCQUFpQixHQUFHO0VBQ3ZCLElBQUksS0FBSyxFQUFFLGdCQUFnQjtFQUMzQixJQUFJLFlBQVksRUFBRSxJQUFJO0VBQ3RCLEdBQUc7RUFDSCxDQUFDLENBQUMsQ0FBQztBQUNIO0VBQ0E7RUFDTyxTQUFTLGFBQWEsQ0FBQyxTQUFTLEVBQUU7RUFDekMsRUFBRSxNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsMkJBQTJCLENBQUMsQ0FBQztFQUMxRCxFQUFFLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7RUFDcEQsRUFBRSxPQUFPLEtBQUssQ0FBQztFQUNmOztFQ25EQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRTtFQUNoQyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVE7RUFDckQsSUFBSSxPQUFPLEtBQUssS0FBSyxVQUFVLENBQUM7RUFDaEMsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLFlBQVksQ0FBQyxLQUFLLEVBQUU7RUFDcEMsRUFBRSxPQUFPLEtBQUssS0FBSyxJQUFJLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDO0VBQ3JELENBQUM7QUFDRDtFQUNBO0VBQ0E7QUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ08sU0FBUyxZQUFZLENBQUMsS0FBSyxFQUFFO0VBQ3BDLEVBQUUsT0FBTyx1Q0FBdUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxTQUFTLENBQUM7RUFDdEUsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLGtCQUFrQixDQUFDLEtBQUssRUFBRTtFQUMxQyxFQUFFLE1BQU0sY0FBYyxHQUFHLHVDQUF1QyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ3hFLEVBQUUsT0FBTyxjQUFjLEtBQUssZUFBZTtFQUMzQyxJQUFJLGNBQWMsS0FBSyxnQkFBZ0IsQ0FBQztFQUN4QyxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsYUFBYSxDQUFDLEtBQUssRUFBRTtFQUNyQyxFQUFFLElBQUk7RUFDTixJQUFJLGlDQUFpQyxxQkFBcUIsS0FBSyxFQUFFLENBQUM7RUFDbEUsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7RUFDZCxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7RUFDSCxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsbUJBQW1CLENBQUMsS0FBSyxFQUFFO0VBQzNDLEVBQUUsSUFBSSx1QkFBdUIsS0FBSyxJQUFJLEVBQUU7RUFDeEMsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQSxFQUFFLElBQUk7RUFDTixJQUFJLHVDQUF1QyxxQkFBcUIsS0FBSyxFQUFFLENBQUM7RUFDeEUsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7RUFDZCxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7RUFDSCxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ08sU0FBUyxVQUFVLENBQUMsS0FBSyxFQUFFO0VBQ2xDLEVBQUUsT0FBTyxPQUFPLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxVQUFVLENBQUM7RUFDckQsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLGVBQWUsQ0FBQyxLQUFLLEVBQUU7RUFDdkMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQzVCLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztBQUNIO0VBQ0EsRUFBRSxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztFQUMzQyxFQUFFLElBQUksUUFBUSxDQUFDLGlCQUFpQixDQUFDLEtBQUssZ0JBQWdCLEVBQUU7RUFDeEQsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQSxFQUFFLE9BQU8sSUFBSSxDQUFDO0VBQ2QsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLG9CQUFvQixDQUFDLEtBQUssRUFBRTtFQUM1QyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDNUIsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQSxFQUFFLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO0VBQzNDLEVBQUUsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsS0FBSyxnQkFBZ0IsRUFBRTtFQUN4RCxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7QUFDSDtFQUNBLEVBQUUsT0FBTyxJQUFJLENBQUM7RUFDZCxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsNkJBQTZCLENBQUMsS0FBSyxFQUFFO0VBQ3JELEVBQUUsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7RUFDakMsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQSxFQUFFLE1BQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNyQyxFQUFFLElBQUksS0FBSyxLQUFLLE1BQU0sR0FBRyxFQUFFLEVBQUU7RUFDN0IsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUU7RUFDL0IsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQSxFQUFFLElBQUksTUFBTSxLQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtFQUNwQyxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7QUFDSDtFQUNBLEVBQUUsT0FBTyxJQUFJLENBQUM7RUFDZDs7RUNuSUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsbUJBQW1CLENBQUMsTUFBTSxFQUFFO0VBQzVDLEVBQUUsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7RUFDbEMsSUFBSSxNQUFNLGVBQWUsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0VBQ3JFLEdBQUc7QUFDSDtFQUNBLEVBQUUsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDO0VBQ0EsRUFBRSxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO0VBQzNDLElBQUksT0FBTyxDQUFDLENBQUM7RUFDYixHQUFHO0FBQ0g7RUFDQSxFQUFFLE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzNCLENBQUM7QUFDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxTQUFTLFFBQVEsQ0FBQyxNQUFNLEVBQUU7RUFDMUIsRUFBRSxNQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUM3QyxFQUFFLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtFQUNsQixJQUFJLE9BQU8sQ0FBQyxDQUFDO0VBQ2IsR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLE1BQU0sR0FBRyxZQUFZLENBQUMsZ0JBQWdCO0VBQy9DLE1BQU0sTUFBTTtFQUNaLE1BQU0sWUFBWSxDQUFDLGdCQUFnQixDQUFDO0VBQ3BDLENBQUM7QUFDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLGlCQUFpQixDQUFDLFNBQVMsRUFBRTtFQUM3QyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7RUFDNUIsSUFBSSxNQUFNLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0VBQ2pELEdBQUc7QUFDSDtFQUNBLEVBQUUsT0FBTyxRQUFRLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztFQUN6RCxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxrQkFBa0IsRUFBRTtFQUMvRCxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7RUFDekIsSUFBSSxNQUFNLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0VBQ2pELEdBQUc7QUFDSDtFQUNBLEVBQUUsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztFQUN6QyxFQUFFLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtFQUNqQyxJQUFJLE9BQU8sa0JBQWtCLENBQUM7RUFDOUIsR0FBRztFQUNILEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtFQUM5QixJQUFJLE1BQU0sZUFBZSxDQUFDLCtDQUErQyxDQUFDLENBQUM7RUFDM0UsR0FBRztBQUNIO0VBQ0EsRUFBRSxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7RUFDN0MsRUFBRSxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7RUFDdkIsSUFBSSxPQUFPLGtCQUFrQixDQUFDO0VBQzlCLEdBQUc7QUFDSDtFQUNBLEVBQUUsT0FBTyxPQUFPLENBQUM7RUFDakIsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNPLFNBQVMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFO0VBQ3pDLEVBQUUsSUFBSTtFQUNOLElBQUkseUJBQXlCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUM1QyxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxhQUFhO0FBQzNCO0VBQ0EsRUFBRSxJQUFJLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQ25DLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQztFQUNkLENBQUM7QUFDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0VBQ3JDLEVBQUUsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2hDLEVBQUUsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hDO0VBQ0EsRUFBRSxJQUFJLE1BQU0sSUFBSSxNQUFNLEVBQUU7RUFDeEIsSUFBSSxPQUFPLENBQUMsQ0FBQztFQUNiLEdBQUc7QUFDSDtFQUNBLEVBQUUsSUFBSSxNQUFNLEVBQUU7RUFDZCxJQUFJLE9BQU8sQ0FBQyxDQUFDO0VBQ2IsR0FBRztBQUNIO0VBQ0EsRUFBRSxJQUFJLE1BQU0sRUFBRTtFQUNkLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztFQUNkLEdBQUc7QUFDSDtFQUNBLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0VBQ2IsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQ2QsR0FBRztBQUNIO0VBQ0EsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7RUFDYixJQUFJLE9BQU8sQ0FBQyxDQUFDO0VBQ2IsR0FBRztBQUNIO0VBQ0EsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUMxQixJQUFJLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDdkMsSUFBSSxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDO0VBQ0EsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLFdBQVcsRUFBRTtFQUNyQyxNQUFNLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFDaEIsS0FBSztBQUNMO0VBQ0EsSUFBSSxJQUFJLFdBQVcsSUFBSSxDQUFDLFdBQVcsRUFBRTtFQUNyQyxNQUFNLE9BQU8sQ0FBQyxDQUFDO0VBQ2YsS0FBSztFQUNMLEdBQUc7QUFDSDtFQUNBLEVBQUUsT0FBTyxDQUFDLENBQUM7RUFDWDs7RUNyRUEsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7QUFDNUI7RUFDQSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM1QztFQUNBO0VBQ0EsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO0FBQzlDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVMsb0JBQW9CLENBQUMsTUFBTSxFQUFFO0VBQ3RDLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTtFQUM3QixJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7QUFDSDtFQUNBLEVBQUUsTUFBTSxTQUFTLEdBQUcscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDbEQsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0VBQ2hDLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztBQUNIO0VBQ0EsRUFBRSxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDO0VBQzVDLEVBQUUsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO0VBQ2pDLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztFQUNILEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtFQUM5QixJQUFJLE1BQU0sZUFBZSxDQUFDLCtDQUErQyxDQUFDLENBQUM7RUFDM0UsR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLFVBQVUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7RUFDeEMsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLGNBQWMsQ0FBQyxNQUFNLEVBQUU7RUFDdkMsRUFBRSxPQUFPLG1CQUFtQixDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQztFQUN2RCxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLElBQUksb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztFQUNqRSxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBUyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUU7RUFDcEMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQy9CLElBQUksTUFBTSxlQUFlLENBQUMsaUNBQWlDLENBQUMsQ0FBQztFQUM3RCxHQUFHO0VBQ0gsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBUyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0VBQ2hELEVBQUUsTUFBTSxvQkFBb0IsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDdEQsRUFBRSxNQUFNLGtCQUFrQixHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsRDtFQUNBLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixJQUFJLENBQUMsa0JBQWtCLEVBQUU7RUFDcEQsSUFBSSxNQUFNLGVBQWUsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0VBQzlFLEdBQUc7QUFDSDtFQUNBLEVBQUUsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7RUFDakMsSUFBSSxJQUFJLE1BQU0sQ0FBQztFQUNmLElBQUksSUFBSSxvQkFBb0IsRUFBRTtFQUM5QixNQUFNLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDM0QsTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUM5RCxLQUFLLE1BQU07RUFDWCxNQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNwRCxLQUFLO0FBQ0w7RUFDQSxJQUFJLElBQUksTUFBTSxHQUFHLEtBQUssRUFBRTtFQUN4QixNQUFNLE1BQU0sZUFBZTtFQUMzQixRQUFRLHdFQUF3RTtFQUNoRixPQUFPLENBQUM7RUFDUixLQUFLO0VBQ0wsR0FBRztBQUNIO0VBQ0EsRUFBRSxJQUFJLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQ2xDLElBQUksTUFBTSxlQUFlLENBQUMsaUNBQWlDLENBQUMsQ0FBQztFQUM3RCxHQUFHO0VBQ0gsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVMsbUJBQW1CLENBQUMsT0FBTyxFQUFFO0VBQ3RDLEVBQUUsTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQztFQUMzRSxFQUFFLElBQUksZ0JBQWdCLEtBQUssU0FBUyxFQUFFO0VBQ3RDLElBQUksTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNsRSxJQUFJLElBQUksZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUU7RUFDbEMsTUFBTSxNQUFNLGVBQWUsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0VBQ3ZFLEtBQUs7RUFDTCxJQUFJLE9BQU8sZ0JBQWdCLENBQUM7RUFDNUIsR0FBRztBQUNIO0VBQ0E7RUFDQTtFQUNBLEVBQUUsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUNoQztFQUNBLEVBQUUsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRTtFQUNoQyxJQUFJLE1BQU0sZUFBZSxDQUFDLHlDQUF5QyxDQUFDLENBQUM7RUFDckUsR0FBRztBQUNIO0VBQ0EsRUFBRSxNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUU7RUFDaEQsSUFBSSxNQUFNO0VBQ1Y7RUFDQSxJQUFJLE9BQU8sQ0FBQyxVQUFVO0VBQ3RCO0VBQ0EsSUFBSSxPQUFPLENBQUMsTUFBTTtFQUNsQixHQUFHLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQzFCLEVBQUUsT0FBTyxtQkFBbUIsQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsQ0FBQztFQUN4RCxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVMsV0FBVyxDQUFDLGdCQUFnQixFQUFFO0VBQ3ZDLEVBQUUsTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNoRTtFQUNBLEVBQUUsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO0VBQ25CLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUNuQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNwRCxHQUFHO0FBQ0g7RUFDQSxFQUFFLE9BQU8sS0FBSyxDQUFDO0VBQ2YsQ0FBQztBQUNEO0VBQ0E7RUFDQSxNQUFNLDZCQUE2QixHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7RUFDdEQsS0FBSyxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQUMsbUJBQW1CLENBQUMsRUFBRTtFQUN2RDtFQUNBLEVBQUUsSUFBSSxHQUFHLEtBQUssaUJBQWlCLEVBQUU7RUFDakMsSUFBSSxTQUFTO0VBQ2IsR0FBRztBQUNIO0VBQ0EsRUFBRSxNQUFNLFVBQVUsR0FBRywrQkFBK0IsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLENBQUMsQ0FBQztFQUMvRSxFQUFFLElBQUksWUFBWSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBRTtFQUN2QyxJQUFJLGVBQWUsQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsQ0FBQztFQUN4RCxHQUFHO0VBQ0gsQ0FBQztBQUNEO0VBQ0EsTUFBTSxPQUFPLEdBQUcsWUFBWSw0Q0FBNEM7RUFDeEUsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUU7RUFDN0IsSUFBSSxJQUFJLDZCQUE2QixDQUFDLEdBQUcsQ0FBQyxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7RUFDekUsTUFBTSxPQUFPLGVBQWUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDdEQsS0FBSztBQUNMO0VBQ0E7RUFDQSxJQUFJLElBQUksZUFBZSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxFQUFFO0VBQzdELE1BQU0sT0FBTyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQ3JDLEtBQUs7QUFDTDtFQUNBLElBQUksT0FBTyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztFQUM3QyxHQUFHO0FBQ0g7RUFDQSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7RUFDcEMsSUFBSSxJQUFJLDZCQUE2QixDQUFDLEdBQUcsQ0FBQyxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7RUFDekUsTUFBTSxPQUFPLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDaEUsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztFQUNwRCxHQUFHO0FBQ0g7RUFDQSxFQUFFLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7RUFDeEMsSUFBSSxJQUFJLDZCQUE2QixDQUFDLEdBQUcsQ0FBQyxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7RUFDekUsTUFBTSxNQUFNLFVBQVUsR0FBRywrQkFBK0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDdEUsTUFBTSxVQUFVLENBQUMsS0FBSyxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDM0QsTUFBTSxPQUFPLFVBQVUsQ0FBQztFQUN4QixLQUFLO0FBQ0w7RUFDQSxJQUFJLE9BQU8sK0JBQStCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQ3hELEdBQUc7QUFDSDtFQUNBLEVBQUUsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFO0VBQzFDLElBQUk7RUFDSixNQUFNLDZCQUE2QixDQUFDLEdBQUcsQ0FBQztFQUN4QyxNQUFNLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO0VBQy9CLE1BQU0sWUFBWSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7RUFDdkMsTUFBTTtFQUNOLE1BQU0sVUFBVSxDQUFDLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDOUQsTUFBTSxPQUFPLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7RUFDNUQsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7RUFDMUQsR0FBRztFQUNILENBQUMsRUFBRSxDQUFDO0FBQ0o7RUFDTyxNQUFNLFlBQVksQ0FBQztFQUMxQjtFQUNBLEVBQUUsV0FBVyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFO0VBQzNDO0VBQ0EsSUFBSSxJQUFJLGdCQUFnQixDQUFDO0FBQ3pCO0VBQ0EsSUFBSSxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUMvQixNQUFNLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDdkcsS0FBSyxNQUFNLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQ3pEO0VBQ0EsTUFBTSxJQUFJLElBQUksQ0FBQztFQUNmO0VBQ0EsTUFBTSxJQUFJLE1BQU0sQ0FBQztBQUNqQjtFQUNBLE1BQU0sSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDL0IsUUFBUSxJQUFJLEdBQUcsS0FBSyxDQUFDO0VBQ3JCLFFBQVEsTUFBTSxHQUFHLDRCQUE0QixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JEO0VBQ0EsUUFBUSxNQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUMzRCxRQUFRLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUM7RUFDOUQsbURBQW1ELGtCQUFrQjtFQUNyRSxZQUFZLE1BQU07RUFDbEIsWUFBWSxpQkFBaUI7RUFDN0IsV0FBVztFQUNYLFlBQVksaUJBQWlCLENBQUM7QUFDOUI7RUFDQSxRQUFRLElBQUksZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUU7RUFDdEMsVUFBVSxNQUFNLGVBQWUsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0VBQzNFLFNBQVM7QUFDVDtFQUNBLFFBQVEsSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUN2QyxVQUFVLE1BQU0sZUFBZSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7RUFDbkUsU0FBUztBQUNUO0VBQ0EsUUFBUSxNQUFNLElBQUksR0FBRyxJQUFJLGlCQUFpQjtFQUMxQyxVQUFVLE1BQU0sR0FBRyxpQkFBaUI7RUFDcEMsU0FBUyxDQUFDO0VBQ1YsUUFBUSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNuRixPQUFPLE1BQU07RUFDYixRQUFRLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQy9CO0VBQ0EsVUFBVSxJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUN0QyxZQUFZLElBQUksR0FBRyxLQUFLLENBQUM7RUFDekIsWUFBWSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztFQUNsQyxXQUFXLE1BQU07RUFDakI7RUFDQSxZQUFZLElBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7RUFDOUIsWUFBWSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztFQUNqQyxXQUFXO0VBQ1gsU0FBUyxNQUFNO0VBQ2YsVUFBVSxJQUFJLHNDQUFzQyxLQUFLLENBQUMsQ0FBQztFQUMzRCxVQUFVLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUM1QyxTQUFTO0VBQ1QsUUFBUSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNyRixPQUFPO0FBQ1A7RUFDQTtFQUNBLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUN2QyxRQUFRLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzFELE9BQU87RUFDUCxLQUFLLE1BQU07RUFDWCxNQUFNLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDcEYsS0FBSztBQUNMO0VBQ0EsSUFBSSxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQVcscUJBQXFCLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQ2xGO0VBQ0E7RUFDQSxJQUFJLG1CQUFtQixDQUFDLGlCQUFpQixFQUFFLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3BFO0VBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDNUIsSUFBSSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDN0I7RUFDQSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxFQUFFO0VBQ3pDLE1BQU0sTUFBTSxlQUFlO0VBQzNCLFFBQVEsa0RBQWtEO0VBQzFELE9BQU8sQ0FBQztFQUNSLEtBQUs7QUFDTDtFQUNBO0VBQ0EsSUFBSSxJQUFJLFdBQVcsS0FBSyxZQUFZLEVBQUU7RUFDdEMsTUFBTSxJQUFJLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtFQUNwRCxRQUFRLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDMUQsUUFBUSxNQUFNLE1BQU0sR0FBRyxJQUFJLGlCQUFpQjtFQUM1QyxVQUFVLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDO0VBQ3hELFVBQVUsZ0NBQWdDLENBQUMsZ0JBQWdCLENBQUM7RUFDNUQsVUFBVSw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQztFQUN4RCxTQUFTLENBQUM7RUFDVixRQUFRLE9BQU8sSUFBSSxZQUFZO0VBQy9CLFVBQVUsNEJBQTRCLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDeEUsU0FBUyxDQUFDO0VBQ1YsT0FBTztBQUNQO0VBQ0EsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0VBQzdCLFFBQVEsT0FBTyxJQUFJLFlBQVk7RUFDL0IsVUFBVSw0QkFBNEI7RUFDdEMsWUFBWSxlQUFlLENBQUMsR0FBRyxFQUFFLGtCQUFrQixDQUFDO0VBQ3BELFdBQVc7RUFDWCxTQUFTLENBQUM7RUFDVixPQUFPO0FBQ1A7RUFDQSxNQUFNLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM5QixNQUFNLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QjtFQUNBLE1BQU0sT0FBTyxJQUFJLFlBQVk7RUFDN0IsUUFBUSw0QkFBNEI7RUFDcEMsVUFBVSxlQUFlLENBQUMsR0FBRyxFQUFFLFVBQVUsR0FBRyxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQ3ZELFlBQVksT0FBTyxrQkFBa0I7RUFDckMsY0FBYyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQ2pFLGFBQWEsQ0FBQztFQUNkLFdBQVcsRUFBRSxPQUFPLENBQUM7RUFDckIsU0FBUztFQUNULE9BQU8sQ0FBQztFQUNSLEtBQUs7QUFDTDtFQUNBO0VBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQztFQUNiO0VBQ0EsSUFBSSxJQUFJLE1BQU0sQ0FBQztBQUNmO0VBQ0EsSUFBSSxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtFQUN6QjtFQUNBLE1BQU0sSUFBSSxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUU7RUFDaEMsUUFBUSxJQUFJLEdBQUcsR0FBRyxDQUFDO0VBQ25CLFFBQVEsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7RUFDNUIsT0FBTyxNQUFNLElBQUksb0JBQW9CLENBQUMsR0FBRyxDQUFDLEVBQUU7RUFDNUMsUUFBUSxJQUFJLEdBQUcsR0FBRyxDQUFDO0VBQ25CLFFBQVEsTUFBTSxHQUFHLDRCQUE0QixDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ25ELE9BQU8sTUFBTTtFQUNiO0VBQ0EsUUFBUSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0VBQ3hCLFFBQVEsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7RUFDN0IsT0FBTztFQUNQLEtBQUssTUFBTTtFQUNYLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQztFQUNqQixNQUFNLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUN0QyxLQUFLO0FBQ0w7RUFDQSxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFDO0VBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0VBQzNCLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUN2QyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsMEJBQTBCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ25ELE9BQU87RUFDUCxLQUFLLE1BQU07RUFDWCxNQUFNLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM5QixNQUFNLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM5QixNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDdkMsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNoRSxPQUFPO0VBQ1AsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRTtFQUN0QixJQUFJLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQztBQUM3QjtFQUNBLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLEVBQUU7RUFDekMsTUFBTSxNQUFNLGVBQWU7RUFDM0IsUUFBUSxrREFBa0Q7RUFDMUQsT0FBTyxDQUFDO0VBQ1IsS0FBSztBQUNMO0VBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ2hDO0VBQ0E7RUFDQSxJQUFJLElBQUksV0FBVyxLQUFLLFlBQVksRUFBRTtFQUN0QyxNQUFNLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzdDLE1BQU0sTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxRDtFQUNBLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUN2QyxRQUFRLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzNELE9BQU87QUFDUDtFQUNBLE1BQU0sT0FBTyxLQUFLLENBQUM7RUFDbkIsS0FBSztBQUNMO0VBQ0EsSUFBSSxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQztFQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUNyQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDMUIsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsSUFBSSxHQUFHO0VBQ1QsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkQ7RUFDQSxJQUFJLE9BQU8sdUJBQXVCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNyRCxHQUFHO0FBQ0g7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxNQUFNLEdBQUc7RUFDWCxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RDtFQUNBLElBQUksT0FBTyxhQUFhLENBQUMsQ0FBQyxhQUFhO0VBQ3ZDO0VBQ0EsTUFBTSxLQUFLLE1BQU0sR0FBRyxJQUFJLHlCQUF5QixDQUFDLGdCQUFnQixDQUFDLEVBQUU7RUFDckUsUUFBUSxNQUFNLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNuQyxPQUFPO0VBQ1AsS0FBSyxHQUFHLENBQUMsQ0FBQztFQUNWLEdBQUc7QUFDSDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLE9BQU8sR0FBRztFQUNaLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZEO0VBQ0EsSUFBSSxPQUFPLGFBQWEsQ0FBQyxDQUFDLGFBQWE7RUFDdkM7RUFDQSxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSwwQkFBMEIsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO0VBQzNFLFFBQVEsdUNBQXVDLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDMUUsT0FBTztFQUNQLEtBQUssR0FBRyxDQUFDLENBQUM7RUFDVixHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBRTtFQUNaLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZEO0VBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0VBQ2xFLElBQUksTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDckQsSUFBSSxNQUFNLENBQUMsR0FBRyxhQUFhLElBQUksQ0FBQyxHQUFHLGFBQWEsR0FBRyxNQUFNLEdBQUcsYUFBYSxDQUFDO0FBQzFFO0VBQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sRUFBRTtFQUM5QixNQUFNLE9BQU87RUFDYixLQUFLO0FBQ0w7RUFDQSxJQUFJLE9BQU8sZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDaEQsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDekIsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkQ7RUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDbEUsSUFBSSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUI7RUFDQSxJQUFJLE1BQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzNFO0VBQ0E7RUFDQSxJQUFJLElBQUksV0FBVyxLQUFLLFlBQVksRUFBRTtFQUN0QyxNQUFNLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzdDLE1BQU0sTUFBTSxLQUFLLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0M7RUFDQSxNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDdkMsUUFBUSxNQUFNLEdBQUcsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6RCxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxrQkFBa0I7RUFDckMsVUFBVSxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDekQsU0FBUyxDQUFDO0VBQ1YsT0FBTztBQUNQO0VBQ0EsTUFBTSxPQUFPLEtBQUssQ0FBQztFQUNuQixLQUFLO0FBQ0w7RUFDQSxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzFDLElBQUksdUJBQXVCLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNDO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3JDLE1BQU0sTUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdkQsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDakUsS0FBSztBQUNMO0VBQ0EsSUFBSSwyQkFBMkIsS0FBSyxFQUFFO0VBQ3RDLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQzVCLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZEO0VBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0VBQ2xFLElBQUksTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVCO0VBQ0EsSUFBSSxNQUFNLElBQUksR0FBRyxFQUFFLENBQUM7RUFDcEIsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3JDLE1BQU0sTUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdkQsTUFBTSxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFO0VBQzNELFFBQVEsa0JBQWtCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQ3RDLE9BQU87RUFDUCxLQUFLO0FBQ0w7RUFDQSxJQUFJLE1BQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxDQUFDO0VBQzNFLElBQUksTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDeEMsSUFBSSx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQztFQUNBLElBQUksMkJBQTJCLEtBQUssRUFBRTtFQUN0QyxHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksRUFBRTtFQUM1QixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RDtFQUNBLElBQUksTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNsRSxJQUFJLElBQUksTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtFQUMzQyxNQUFNLE1BQU0sZUFBZSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7RUFDekUsS0FBSztBQUNMO0VBQ0EsSUFBSSxJQUFJLFdBQVcsRUFBRSxLQUFLLENBQUM7RUFDM0IsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0VBQzNCLE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3pELE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztFQUNoQixLQUFLLE1BQU07RUFDWCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDNUIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0VBQ2hCLEtBQUs7QUFDTDtFQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUN6QyxNQUFNLFdBQVcsR0FBRyxRQUFRO0VBQzVCLFFBQVEsV0FBVztFQUNuQixRQUFRLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM1QyxRQUFRLENBQUM7RUFDVCxRQUFRLElBQUk7RUFDWixPQUFPLENBQUM7RUFDUixLQUFLO0FBQ0w7RUFDQSxJQUFJLE9BQU8sV0FBVyxDQUFDO0VBQ3ZCLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQ2pDLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZEO0VBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0VBQ2xFLElBQUksSUFBSSxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0VBQzNDLE1BQU0sTUFBTSxlQUFlLENBQUMsMkNBQTJDLENBQUMsQ0FBQztFQUN6RSxLQUFLO0FBQ0w7RUFDQSxJQUFJLElBQUksV0FBVyxFQUFFLEtBQUssQ0FBQztFQUMzQixJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7RUFDM0IsTUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2xFLE1BQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDekIsS0FBSyxNQUFNO0VBQ1gsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzVCLE1BQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDekIsS0FBSztBQUNMO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3JDLE1BQU0sV0FBVyxHQUFHLFFBQVE7RUFDNUIsUUFBUSxXQUFXO0VBQ25CLFFBQVEsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzVDLFFBQVEsQ0FBQztFQUNULFFBQVEsSUFBSTtFQUNaLE9BQU8sQ0FBQztFQUNSLEtBQUs7QUFDTDtFQUNBLElBQUksT0FBTyxXQUFXLENBQUM7RUFDdkIsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDN0IsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkQ7RUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDbEUsSUFBSSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUI7RUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDckMsTUFBTSxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRTtFQUN0QyxRQUFRLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM1QyxRQUFRLENBQUM7RUFDVCxRQUFRLElBQUk7RUFDWixPQUFPLENBQUMsQ0FBQztFQUNULEtBQUs7RUFDTCxHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksRUFBRTtFQUMxQixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RDtFQUNBLElBQUksTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNsRSxJQUFJLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QjtFQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUNyQyxNQUFNLE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3pELE1BQU0sSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRTtFQUM3RCxRQUFRLE9BQU8sS0FBSyxDQUFDO0VBQ3JCLE9BQU87RUFDUCxLQUFLO0VBQ0wsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLFNBQVMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDL0IsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkQ7RUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDbEUsSUFBSSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUI7RUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDckMsTUFBTSxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6RCxNQUFNLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUU7RUFDN0QsUUFBUSxPQUFPLENBQUMsQ0FBQztFQUNqQixPQUFPO0VBQ1AsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQ2QsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDOUIsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkQ7RUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDbEUsSUFBSSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUI7RUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQzFDLE1BQU0sTUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDekQsTUFBTSxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFO0VBQzdELFFBQVEsT0FBTyxLQUFLLENBQUM7RUFDckIsT0FBTztFQUNQLEtBQUs7RUFDTCxHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsYUFBYSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksRUFBRTtFQUNuQyxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RDtFQUNBLElBQUksTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNsRSxJQUFJLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QjtFQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDMUMsTUFBTSxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6RCxNQUFNLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUU7RUFDN0QsUUFBUSxPQUFPLENBQUMsQ0FBQztFQUNqQixPQUFPO0VBQ1AsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQ2QsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDM0IsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkQ7RUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDbEUsSUFBSSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUI7RUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDckMsTUFBTTtFQUNOLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRTtFQUN6QyxVQUFVLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM5QyxVQUFVLENBQUM7RUFDWCxVQUFVLElBQUk7RUFDZCxTQUFTLENBQUM7RUFDVixRQUFRO0VBQ1IsUUFBUSxPQUFPLEtBQUssQ0FBQztFQUNyQixPQUFPO0VBQ1AsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksRUFBRTtFQUMxQixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RDtFQUNBLElBQUksTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNsRSxJQUFJLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QjtFQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUNyQyxNQUFNO0VBQ04sUUFBUSxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRTtFQUN4QyxVQUFVLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM5QyxVQUFVLENBQUM7RUFDWCxVQUFVLElBQUk7RUFDZCxTQUFTLENBQUM7RUFDVixRQUFRO0VBQ1IsUUFBUSxPQUFPLElBQUksQ0FBQztFQUNwQixPQUFPO0VBQ1AsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksRUFBRTtFQUN0QixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RDtFQUNBLElBQUksTUFBTSxZQUFZLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdEQsSUFBSSxJQUFJLFlBQVksR0FBRyxDQUFDLEVBQUU7RUFDMUIsTUFBTSxNQUFNLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLENBQUM7RUFDdEQsS0FBSztBQUNMO0VBQ0EsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7RUFDdkIsTUFBTSxNQUFNLGVBQWU7RUFDM0IsUUFBUSwwQ0FBMEM7RUFDbEQsT0FBTyxDQUFDO0VBQ1IsS0FBSztBQUNMO0VBQ0EsSUFBSSxJQUFJLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQ25DLE1BQU0sTUFBTSxlQUFlO0VBQzNCLFFBQVEsaUNBQWlDO0VBQ3pDLE9BQU8sQ0FBQztFQUNSLEtBQUs7QUFDTDtFQUNBO0VBQ0EsSUFBSSxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUMvQjtFQUNBLE1BQU0sT0FBTyxzQkFBc0I7RUFDbkMsUUFBUSxtQkFBbUIsQ0FBQyxJQUFJLENBQUM7RUFDakMsUUFBUSxtQkFBbUIsQ0FBQyxLQUFLLENBQUM7RUFDbEMsUUFBUSxZQUFZO0VBQ3BCLE9BQU8sQ0FBQztFQUNSLEtBQUs7QUFDTDtFQUNBLElBQUksSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDN0IsTUFBTSxNQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUN6RCxNQUFNLElBQUksZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUU7RUFDcEMsUUFBUSxNQUFNLGVBQWUsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0VBQ3pFLE9BQU87RUFDUCxLQUFLO0FBQ0w7RUFDQSxJQUFJLE1BQU0sWUFBWSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEU7RUFDQSxJQUFJLE1BQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNwQyxJQUFJLE1BQU0sU0FBUyxHQUFHLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdDO0VBQ0EsSUFBSSxJQUFJLFlBQVksS0FBSyxRQUFRLElBQUksU0FBUyxHQUFHLFlBQVksR0FBRyxZQUFZLEVBQUU7RUFDOUUsTUFBTSxNQUFNLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLENBQUM7RUFDdEQsS0FBSztBQUNMO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3hDLE1BQU0sZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxHQUFHLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3RFLEtBQUs7RUFDTCxHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsT0FBTyxHQUFHO0VBQ1osSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkQ7RUFDQSxJQUFJLDBCQUEwQixDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDakQ7RUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDO0VBQ2hCLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQ3ZCLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZEO0VBQ0EsSUFBSSx1QkFBdUI7RUFDM0IsTUFBTSxnQkFBZ0I7RUFDdEIsTUFBTSxrQkFBa0IsQ0FBQyxLQUFLLENBQUM7RUFDL0IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7RUFDckIsS0FBSyxDQUFDO0FBQ047RUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDO0VBQ2hCLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksRUFBRTtFQUNyQyxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RDtFQUNBLElBQUksNkJBQTZCLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3BGO0VBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO0VBQ2hCLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZEO0VBQ0EsSUFBSSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUM7RUFDckUsSUFBSSx1QkFBdUIsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUs7RUFDeEQsTUFBTSxPQUFPLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDN0QsS0FBSyxDQUFDLENBQUM7QUFDUDtFQUNBLElBQUksT0FBTyxJQUFJLENBQUM7RUFDaEIsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLEtBQUssQ0FBQyxHQUFHLElBQUksRUFBRTtFQUNqQixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RDtFQUNBLElBQUksTUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDM0U7RUFDQTtFQUNBLElBQUksSUFBSSxXQUFXLEtBQUssWUFBWSxFQUFFO0VBQ3RDLE1BQU0sTUFBTSxNQUFNLEdBQUcsSUFBSSxpQkFBaUI7RUFDMUMsUUFBUSw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQztFQUN0RCxRQUFRLGdDQUFnQyxDQUFDLGdCQUFnQixDQUFDO0VBQzFELFFBQVEsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUM7RUFDdEQsT0FBTyxDQUFDO0VBQ1IsTUFBTSxPQUFPLElBQUksWUFBWTtFQUM3QixRQUFRLDRCQUE0QjtFQUNwQyxVQUFVLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUMzRCxTQUFTO0VBQ1QsT0FBTyxDQUFDO0VBQ1IsS0FBSztBQUNMO0VBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0VBQ2xFLElBQUksTUFBTSxLQUFLLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDL0MsSUFBSSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RTtFQUNBLElBQUksSUFBSSxDQUFDLENBQUM7RUFDVixJQUFJLElBQUksS0FBSyxLQUFLLENBQUMsUUFBUSxFQUFFO0VBQzdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNaLEtBQUssTUFBTSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7RUFDMUIsTUFBTSxDQUFDLEdBQUcsTUFBTSxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7RUFDbEQsS0FBSyxNQUFNO0VBQ1gsTUFBTSxDQUFDLEdBQUcsTUFBTSxHQUFHLEtBQUssR0FBRyxNQUFNLEdBQUcsS0FBSyxDQUFDO0VBQzFDLEtBQUs7QUFDTDtFQUNBLElBQUksSUFBSSxLQUFLLENBQUM7RUFDZCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFO0VBQzNCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztFQUNoQixLQUFLLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO0VBQ3hCLE1BQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0VBQ2xELEtBQUssTUFBTTtFQUNYLE1BQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQztFQUMxQyxLQUFLO0FBQ0w7RUFDQSxJQUFJLE1BQU0sS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ2hELElBQUksTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDekMsSUFBSSx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUM7RUFDQSxJQUFJLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtFQUNyQixNQUFNLE9BQU8sS0FBSyxDQUFDO0VBQ25CLEtBQUs7QUFDTDtFQUNBLElBQUksTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNsRSxJQUFJLElBQUksZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUU7RUFDbEMsTUFBTSxNQUFNLGVBQWUsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0VBQ3ZFLEtBQUs7QUFDTDtFQUNBLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ2QsSUFBSSxPQUFPLENBQUMsR0FBRyxLQUFLLEVBQUU7RUFDdEIsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdEQsTUFBTSxFQUFFLENBQUMsQ0FBQztFQUNWLE1BQU0sRUFBRSxDQUFDLENBQUM7RUFDVixLQUFLO0FBQ0w7RUFDQSxJQUFJLDJCQUEyQixLQUFLLEVBQUU7RUFDdEMsR0FBRztBQUNIO0VBQ0E7RUFDQSxFQUFFLFFBQVEsQ0FBQyxHQUFHLElBQUksRUFBRTtFQUNwQixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RDtFQUNBLElBQUksTUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDM0U7RUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHLElBQUksaUJBQWlCO0VBQ3hDLE1BQU0sNEJBQTRCLENBQUMsZ0JBQWdCLENBQUM7RUFDcEQsTUFBTSxnQ0FBZ0MsQ0FBQyxnQkFBZ0IsQ0FBQztFQUN4RCxNQUFNLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDO0VBQ3BELEtBQUssQ0FBQztFQUNOLElBQUksTUFBTSxjQUFjLEdBQUcsMkJBQTJCLENBQUMsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDaEY7RUFDQSxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVztFQUNqQyxNQUFNLDRCQUE0QixDQUFDLGNBQWMsQ0FBQztFQUNsRCxNQUFNLGdDQUFnQyxDQUFDLGNBQWMsQ0FBQztFQUN0RCxNQUFNLDRCQUE0QixDQUFDLGNBQWMsQ0FBQztFQUNsRCxLQUFLLENBQUM7RUFDTixJQUFJLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25DO0VBQ0EsSUFBSSwyQkFBMkIsS0FBSyxFQUFFO0VBQ3RDLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQzVCLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZEO0VBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2xFO0VBQ0EsSUFBSSxJQUFJLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM1QyxJQUFJLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtFQUMzQixNQUFNLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFDaEIsS0FBSztBQUNMO0VBQ0EsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7RUFDbEIsTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDO0VBQ3JCLE1BQU0sSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO0VBQ3BCLFFBQVEsSUFBSSxHQUFHLENBQUMsQ0FBQztFQUNqQixPQUFPO0VBQ1AsS0FBSztBQUNMO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3hDLE1BQU07RUFDTixRQUFRLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7RUFDekMsUUFBUSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPO0VBQ3hELFFBQVE7RUFDUixRQUFRLE9BQU8sQ0FBQyxDQUFDO0VBQ2pCLE9BQU87RUFDUCxLQUFLO0FBQ0w7RUFDQSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFDZCxHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsV0FBVyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksRUFBRTtFQUNoQyxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RDtFQUNBLElBQUksTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNsRTtFQUNBLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztFQUM1RSxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO0VBQzVCLE1BQU0sT0FBTyxDQUFDLENBQUMsQ0FBQztFQUNoQixLQUFLO0FBQ0w7RUFDQSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsRUFBRTtFQUNuQixNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztFQUNuRCxLQUFLLE1BQU07RUFDWCxNQUFNLElBQUksSUFBSSxNQUFNLENBQUM7RUFDckIsS0FBSztBQUNMO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3BDLE1BQU07RUFDTixRQUFRLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7RUFDekMsUUFBUSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPO0VBQ3hELFFBQVE7RUFDUixRQUFRLE9BQU8sQ0FBQyxDQUFDO0VBQ2pCLE9BQU87RUFDUCxLQUFLO0FBQ0w7RUFDQSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFDZCxHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksRUFBRTtFQUM3QixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RDtFQUNBLElBQUksTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNsRTtFQUNBLElBQUksSUFBSSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDNUMsSUFBSSxJQUFJLElBQUksS0FBSyxRQUFRLEVBQUU7RUFDM0IsTUFBTSxPQUFPLEtBQUssQ0FBQztFQUNuQixLQUFLO0FBQ0w7RUFDQSxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtFQUNsQixNQUFNLElBQUksSUFBSSxNQUFNLENBQUM7RUFDckIsTUFBTSxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7RUFDcEIsUUFBUSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0VBQ2pCLE9BQU87RUFDUCxLQUFLO0FBQ0w7RUFDQSxJQUFJLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUN2QyxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDeEMsTUFBTSxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RDtFQUNBLE1BQU0sSUFBSSxLQUFLLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQ3ZDLFFBQVEsT0FBTyxJQUFJLENBQUM7RUFDcEIsT0FBTztBQUNQO0VBQ0EsTUFBTSxJQUFJLEtBQUssS0FBSyxPQUFPLEVBQUU7RUFDN0IsUUFBUSxPQUFPLElBQUksQ0FBQztFQUNwQixPQUFPO0VBQ1AsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO0VBQ2hCLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZEO0VBQ0EsSUFBSSxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNoRDtFQUNBLElBQUksT0FBTyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUN0RCxHQUFHO0FBQ0g7RUFDQTtFQUNBLEVBQUUsY0FBYyxDQUFDLEdBQUcsSUFBSSxFQUFFO0VBQzFCLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZEO0VBQ0EsSUFBSSxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNoRDtFQUNBO0VBQ0EsSUFBSSxPQUFPLDRCQUE0QixDQUFDLEtBQUssRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQ2hFLEdBQUc7QUFDSDtFQUNBO0VBQ0EsRUFBRSxLQUFLLGlCQUFpQixDQUFDLEdBQUc7RUFDNUIsSUFBSSxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtFQUM5QixNQUFNLDJCQUEyQixjQUFjLEVBQUU7RUFDakQsS0FBSztFQUNMLEdBQUc7RUFDSCxDQUFDO0FBQ0Q7RUFDQTtFQUNBLG9CQUFvQixDQUFDLFlBQVksRUFBRSxtQkFBbUIsRUFBRTtFQUN4RCxFQUFFLEtBQUssRUFBRSxpQkFBaUI7RUFDMUIsQ0FBQyxDQUFDLENBQUM7QUFDSDtFQUNBO0VBQ0Esb0JBQW9CLENBQUMsWUFBWSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM5QztFQUNBO0VBQ0EscUJBQXFCLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2hEO0VBQ0EsTUFBTSxxQkFBcUIsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDO0FBQ3JEO0VBQ0E7RUFDQSxvQkFBb0IsQ0FBQyxxQkFBcUIsRUFBRSxtQkFBbUIsRUFBRTtFQUNqRSxFQUFFLEtBQUssRUFBRSxpQkFBaUI7RUFDMUIsQ0FBQyxDQUFDLENBQUM7QUFDSDtFQUNBO0VBQ0Esb0JBQW9CLENBQUMscUJBQXFCLEVBQUUsY0FBYyxFQUFFO0VBQzVELEVBQUUsS0FBSyxFQUFFLHFCQUFxQixDQUFDLE1BQU07RUFDckMsRUFBRSxRQUFRLEVBQUUsSUFBSTtFQUNoQixFQUFFLFlBQVksRUFBRSxJQUFJO0VBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBQ0g7RUFDQTtFQUNBLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFLG1CQUFtQixDQUFDOztFQ3JtQ2pFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDTyxTQUFTLFVBQVUsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQzFELEVBQUUsT0FBTyxlQUFlO0VBQ3hCLElBQUksMEJBQTBCLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNyRSxHQUFHLENBQUM7RUFDSixDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ08sU0FBUyxVQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDakUsRUFBRSxPQUFPLDBCQUEwQjtFQUNuQyxJQUFJLFFBQVE7RUFDWixJQUFJLFVBQVU7RUFDZCxJQUFJLGtCQUFrQixDQUFDLEtBQUssQ0FBQztFQUM3QixJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztFQUNuQixHQUFHLENBQUM7RUFDSjs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
