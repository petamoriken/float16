/*! @petamoriken/float16 v3.5.2-1-g0aa5488 | MIT License - https://git.io/float16 */

const float16 = (function (exports) {
  'use strict';

  /* eslint-disable no-restricted-globals */

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
    return isObjectLike(value) && value[SymbolToStringTag] === "ArrayBuffer";
  }

  /**
   * @param {unknown} value
   * @returns {value is SharedArrayBuffer}
   */
  function isSharedArrayBuffer(value) {
    return isObjectLike(value) &&
      value[SymbolToStringTag] === "SharedArrayBuffer";
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
  const targets = new NativeWeakMap();

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
    return hasFloat16ArrayBrand(target) && !isTypedArray(target);
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
   * @returns {Uint16Array & { __float16bits: never }}
   */
  function getFloat16BitsArray(float16) {
    const target = WeakMapPrototypeGet(targets, float16);
    if (target !== undefined) {
      return target;
    }

    // from another Float16Array instance (a different version?)
    const cloned = new Float16Array(
      // @ts-ignore
      float16.buffer,
      // @ts-ignore
      float16.byteOffset,
      // @ts-ignore
      float16.length
    );
    return WeakMapPrototypeGet(targets, cloned);
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
          if (isBigIntTypedArray(input)) {
            throw NativeTypeError(
              CANNOT_MIX_BIGINT_AND_OTHER_TYPES
            );
          }

          list = input;
          length = TypedArrayPrototypeGetLength(input);

          const buffer = TypedArrayPrototypeGetBuffer(input);
          const BufferConstructor = !isSharedArrayBuffer(buffer)
            ? /** @type {ArrayBufferConstructor} */ (SpeciesConstructor(
              buffer,
              NativeArrayBuffer
            ))
            : NativeArrayBuffer;
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
          // super (Uint16Array)
          float16bitsArray[i] = roundToFloat16Bits(list[i]);
        }
      } else { // primitive, ArrayBuffer
        float16bitsArray = ReflectConstruct(NativeUint16Array, arguments, new.target);
      }

      const proxy = new NativeProxy(/** @type {any} */ (float16bitsArray), handler);

      // proxy private storage
      WeakMapPrototypeSet(targets, proxy, float16bitsArray);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXQxNi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL191dGlsL3ByaW1vcmRpYWxzLm1qcyIsIi4uL3NyYy9fdXRpbC9jb252ZXJ0ZXIubWpzIiwiLi4vc3JjL191dGlsL21lc3NhZ2VzLm1qcyIsIi4uL3NyYy9oZnJvdW5kLm1qcyIsIi4uL3NyYy9fdXRpbC9hcnJheUl0ZXJhdG9yLm1qcyIsIi4uL3NyYy9fdXRpbC9pcy5tanMiLCIuLi9zcmMvX3V0aWwvc3BlYy5tanMiLCIuLi9zcmMvRmxvYXQxNkFycmF5Lm1qcyIsIi4uL3NyYy9EYXRhVmlldy5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovXG5cbmNvbnN0IHsgYmluZCwgY2FsbCB9ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4vKiogQHR5cGUgeyh0YXJnZXQ6IGFueSkgPT4gYW55fSAqL1xuY29uc3QgdW5jdXJyeVRoaXMgPSBiaW5kLmJpbmQoY2FsbCk7XG5cbi8qKiBAdHlwZSB7KHRhcmdldDogYW55LCBrZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4gYW55fSAqL1xuZnVuY3Rpb24gdW5jdXJyeVRoaXNHZXR0ZXIodGFyZ2V0LCBrZXkpIHtcbiAgcmV0dXJuIHVuY3VycnlUaGlzKFxuICAgIFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXG4gICAgICB0YXJnZXQsXG4gICAgICBrZXlcbiAgICApLmdldFxuICApO1xufVxuXG4vLyBSZWZsZWN0XG5leHBvcnQgY29uc3Qge1xuICBhcHBseTogUmVmbGVjdEFwcGx5LFxuICBjb25zdHJ1Y3Q6IFJlZmxlY3RDb25zdHJ1Y3QsXG4gIGdldDogUmVmbGVjdEdldCxcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICBnZXRQcm90b3R5cGVPZjogUmVmbGVjdEdldFByb3RvdHlwZU9mLFxuICBoYXM6IFJlZmxlY3RIYXMsXG4gIG93bktleXM6IFJlZmxlY3RPd25LZXlzLFxuICBzZXQ6IFJlZmxlY3RTZXQsXG4gIHNldFByb3RvdHlwZU9mOiBSZWZsZWN0U2V0UHJvdG90eXBlT2YsXG59ID0gUmVmbGVjdDtcblxuLy8gUHJveHlcbmV4cG9ydCBjb25zdCBOYXRpdmVQcm94eSA9IFByb3h5O1xuXG4vLyBOdW1iZXJcbmV4cG9ydCBjb25zdCBOYXRpdmVOdW1iZXIgPSBOdW1iZXI7XG5leHBvcnQgY29uc3Qge1xuICBpc0Zpbml0ZTogTnVtYmVySXNGaW5pdGUsXG4gIGlzTmFOOiBOdW1iZXJJc05hTixcbn0gPSBOYXRpdmVOdW1iZXI7XG5cbi8vIFN5bWJvbFxuZXhwb3J0IGNvbnN0IHtcbiAgaXRlcmF0b3I6IFN5bWJvbEl0ZXJhdG9yLFxuICBzcGVjaWVzOiBTeW1ib2xTcGVjaWVzLFxuICB0b1N0cmluZ1RhZzogU3ltYm9sVG9TdHJpbmdUYWcsXG4gIGZvcjogU3ltYm9sRm9yLFxufSA9IFN5bWJvbDtcblxuLy8gQXJyYXlcbmNvbnN0IE5hdGl2ZUFycmF5ID0gQXJyYXk7XG5leHBvcnQgY29uc3QgQXJyYXlJc0FycmF5ID0gTmF0aXZlQXJyYXkuaXNBcnJheTtcbmNvbnN0IEFycmF5UHJvdG90eXBlID0gTmF0aXZlQXJyYXkucHJvdG90eXBlO1xuLyoqIEB0eXBlIHsoYXJyYXk6IEFycmF5PHVua25vd24+LCBzZXBhcmF0b3I/OiBzdHJpbmcpID0+IHN0cmluZ30gKi9cbmV4cG9ydCBjb25zdCBBcnJheVByb3RvdHlwZUpvaW4gPSB1bmN1cnJ5VGhpcyhBcnJheVByb3RvdHlwZS5qb2luKTtcbi8qKiBAdHlwZSB7PFQ+KGFycmF5OiBBcnJheTxUPiwgLi4uaXRlbXM6IFRbXSkgPT4gbnVtYmVyfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5UHJvdG90eXBlUHVzaCA9IHVuY3VycnlUaGlzKEFycmF5UHJvdG90eXBlLnB1c2gpO1xuLyoqIEB0eXBlIHsoYXJyYXk6IEFycmF5PHVua25vd24+KSA9PiBzdHJpbmd9ICovXG5leHBvcnQgY29uc3QgQXJyYXlQcm90b3R5cGVUb0xvY2FsZVN0cmluZyA9IHVuY3VycnlUaGlzKFxuICBBcnJheVByb3RvdHlwZS50b0xvY2FsZVN0cmluZ1xuKTtcblxuLy8gT2JqZWN0XG5leHBvcnQgY29uc3QgTmF0aXZlT2JqZWN0ID0gT2JqZWN0O1xuZXhwb3J0IGNvbnN0IHtcbiAgY3JlYXRlOiBPYmplY3RDcmVhdGUsXG4gIGRlZmluZVByb3BlcnR5OiBPYmplY3REZWZpbmVQcm9wZXJ0eSxcbiAgZnJlZXplOiBPYmplY3RGcmVlemUsXG4gIGlzOiBPYmplY3RJcyxcbn0gPSBOYXRpdmVPYmplY3Q7XG4vKiogQHR5cGUgeyhvYmplY3Q6IG9iamVjdCwga2V5OiBQcm9wZXJ0eUtleSkgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBPYmplY3RIYXNPd24gPSAvKiogQHR5cGUge2FueX0gKi8gKE5hdGl2ZU9iamVjdCkuaGFzT3duIHx8XG4gIHVuY3VycnlUaGlzKE5hdGl2ZU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuXG4vLyBNYXRoXG5leHBvcnQgY29uc3QgTWF0aFRydW5jID0gTWF0aC50cnVuYztcblxuLy8gQXJyYXlCdWZmZXJcbmV4cG9ydCBjb25zdCBOYXRpdmVBcnJheUJ1ZmZlciA9IEFycmF5QnVmZmVyO1xuXG4vLyBUeXBlZEFycmF5XG4vKiogQHR5cGVkZWYge1VpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDMyQXJyYXl8RmxvYXQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fEJpZ0ludDY0QXJyYXl9IFR5cGVkQXJyYXkgKi9cbi8qKiBAdHlwZSB7YW55fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXkgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YoVWludDhBcnJheSk7XG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZSA9IFR5cGVkQXJyYXkucHJvdG90eXBlO1xuLyoqIEB0eXBlIHsodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gSXRlcmFibGVJdGVyYXRvcjxudW1iZXI+fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVLZXlzID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5rZXlzKTtcbi8qKiBAdHlwZSB7KHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IEl0ZXJhYmxlSXRlcmF0b3I8bnVtYmVyPn0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlVmFsdWVzID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUudmFsdWVzXG4pO1xuLyoqIEB0eXBlIHsodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gSXRlcmFibGVJdGVyYXRvcjxbbnVtYmVyLCBudW1iZXJdPn0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlRW50cmllcyA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLmVudHJpZXNcbik7XG4vKiogQHR5cGUgeyh0eXBlZEFycmF5OiBUeXBlZEFycmF5LCBhcnJheTogQXJyYXlMaWtlPG51bWJlcj4sIG9mZnNldD86IG51bWJlcikgPT4gdm9pZH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlU2V0ID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5zZXQpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVJldmVyc2UgPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS5yZXZlcnNlXG4pO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHZhbHVlOiBudW1iZXIsIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUZpbGwgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLmZpbGwpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHRhcmdldDogbnVtYmVyLCBzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUNvcHlXaXRoaW4gPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS5jb3B5V2l0aGluXG4pO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIGNvbXBhcmVGbj86IChhOiBudW1iZXIsIGI6IG51bWJlcikgPT4gbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVTb3J0ID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5zb3J0KTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUuc2xpY2UpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVN1YmFycmF5ID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUuc3ViYXJyYXlcbik7XG4vKiogQHR5cGUgeygodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gQXJyYXlCdWZmZXIpfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIgPSB1bmN1cnJ5VGhpcyhcbiAgUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICAgIFwiYnVmZmVyXCJcbiAgKS5nZXRcbik7XG4vKiogQHR5cGUgeygodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gbnVtYmVyKX0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldCA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBcImJ5dGVPZmZzZXRcIlxuKTtcbi8qKiBAdHlwZSB7KCh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBudW1iZXIpfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGggPSB1bmN1cnJ5VGhpc0dldHRlcihcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgXCJsZW5ndGhcIlxuKTtcbi8qKiBAdHlwZSB7KHRhcmdldDogdW5rbm93bikgPT4gc3RyaW5nfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBTeW1ib2xUb1N0cmluZ1RhZ1xuKTtcblxuLy8gVWludDE2QXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVVaW50MTZBcnJheSA9IFVpbnQxNkFycmF5O1xuZXhwb3J0IGNvbnN0IFVpbnQxNkFycmF5RnJvbSA9IFR5cGVkQXJyYXkuZnJvbS5iaW5kKE5hdGl2ZVVpbnQxNkFycmF5KTtcblxuLy8gVWludDMyQXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVVaW50MzJBcnJheSA9IFVpbnQzMkFycmF5O1xuXG4vLyBGbG9hdDMyQXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVGbG9hdDMyQXJyYXkgPSBGbG9hdDMyQXJyYXk7XG5cbi8vIEl0ZXJhdG9yXG5leHBvcnQgY29uc3QgSXRlcmF0b3JQcm90b3R5cGUgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YoXG4gIFJlZmxlY3RHZXRQcm90b3R5cGVPZihbXVtTeW1ib2xJdGVyYXRvcl0oKSlcbik7XG5cbi8vIEdlbmVyYXRvclxuY29uc3QgR2VuZXJhdG9yUHJvdG90eXBlID0gKGZ1bmN0aW9uKiAoKSB7fSkuY29uc3RydWN0b3IucHJvdG90eXBlLnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7PFQgPSB1bmtub3duLCBUUmV0dXJuID0gYW55LCBUTmV4dCA9IHVua25vd24+KGdlbmVyYXRvcjogR2VuZXJhdG9yPFQsIFRSZXR1cm4sIFROZXh0PiwgdmFsdWU/OiBUTmV4dCkgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBHZW5lcmF0b3JQcm90b3R5cGVOZXh0ID0gdW5jdXJyeVRoaXMoR2VuZXJhdG9yUHJvdG90eXBlLm5leHQpO1xuXG4vLyBEYXRhVmlld1xuY29uc3QgRGF0YVZpZXdQcm90b3R5cGUgPSBEYXRhVmlldy5wcm90b3R5cGU7XG4vKiogQHR5cGUgeyhkYXRhVmlldzogRGF0YVZpZXcsIGJ5dGVPZmZzZXQ6IG51bWJlciwgbGl0dGxlRW5kaWFuPzogYm9vbGVhbikgPT4gbnVtYmVyfSAqL1xuZXhwb3J0IGNvbnN0IERhdGFWaWV3UHJvdG90eXBlR2V0VWludDE2ID0gdW5jdXJyeVRoaXMoXG4gIERhdGFWaWV3UHJvdG90eXBlLmdldFVpbnQxNlxuKTtcbi8qKiBAdHlwZSB7KGRhdGFWaWV3OiBEYXRhVmlldywgYnl0ZU9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBsaXR0bGVFbmRpYW4/OiBib29sZWFuKSA9PiB2b2lkfSAqL1xuZXhwb3J0IGNvbnN0IERhdGFWaWV3UHJvdG90eXBlU2V0VWludDE2ID0gdW5jdXJyeVRoaXMoXG4gIERhdGFWaWV3UHJvdG90eXBlLnNldFVpbnQxNlxuKTtcblxuLy8gRXJyb3JcbmV4cG9ydCBjb25zdCBOYXRpdmVUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG5leHBvcnQgY29uc3QgTmF0aXZlUmFuZ2VFcnJvciA9IFJhbmdlRXJyb3I7XG5cbi8vIFNldFxuZXhwb3J0IGNvbnN0IE5hdGl2ZVNldCA9IFNldDtcbmNvbnN0IFNldFByb3RvdHlwZSA9IE5hdGl2ZVNldC5wcm90b3R5cGU7XG4vKiogQHR5cGUgezxUPihzZXQ6IFNldDxUPiwgdmFsdWU6IFQpID0+IFNldDxUPn0gKi9cbmV4cG9ydCBjb25zdCBTZXRQcm90b3R5cGVBZGQgPSB1bmN1cnJ5VGhpcyhTZXRQcm90b3R5cGUuYWRkKTtcbi8qKiBAdHlwZSB7PFQ+KHNldDogU2V0PFQ+LCB2YWx1ZTogVCkgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBTZXRQcm90b3R5cGVIYXMgPSB1bmN1cnJ5VGhpcyhTZXRQcm90b3R5cGUuaGFzKTtcblxuLy8gV2Vha01hcFxuZXhwb3J0IGNvbnN0IE5hdGl2ZVdlYWtNYXAgPSBXZWFrTWFwO1xuY29uc3QgV2Vha01hcFByb3RvdHlwZSA9IE5hdGl2ZVdlYWtNYXAucHJvdG90eXBlO1xuLyoqIEB0eXBlIHs8SyBleHRlbmRzIHt9LCBWPih3ZWFrTWFwOiBXZWFrTWFwPEssIFY+LCBrZXk6IEspID0+IFZ9ICovXG5leHBvcnQgY29uc3QgV2Vha01hcFByb3RvdHlwZUdldCA9IHVuY3VycnlUaGlzKFdlYWtNYXBQcm90b3R5cGUuZ2V0KTtcbi8qKiBAdHlwZSB7PEsgZXh0ZW5kcyB7fSwgVj4od2Vha01hcDogV2Vha01hcDxLLCBWPiwga2V5OiBLLCB2YWx1ZTogVikgPT4gV2Vha01hcH0gKi9cbmV4cG9ydCBjb25zdCBXZWFrTWFwUHJvdG90eXBlU2V0ID0gdW5jdXJyeVRoaXMoV2Vha01hcFByb3RvdHlwZS5zZXQpO1xuIiwiLy8gYWxnb3JpdGhtOiBodHRwOi8vZm94LXRvb2xraXQub3JnL2Z0cC9mYXN0aGFsZmZsb2F0Y29udmVyc2lvbi5wZGZcblxuaW1wb3J0IHtcbiAgTmF0aXZlQXJyYXlCdWZmZXIsXG4gIE5hdGl2ZUZsb2F0MzJBcnJheSxcbiAgTmF0aXZlVWludDMyQXJyYXksXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG5jb25zdCBidWZmZXIgPSBuZXcgTmF0aXZlQXJyYXlCdWZmZXIoNCk7XG5jb25zdCBmbG9hdFZpZXcgPSBuZXcgTmF0aXZlRmxvYXQzMkFycmF5KGJ1ZmZlcik7XG5jb25zdCB1aW50MzJWaWV3ID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KGJ1ZmZlcik7XG5cbmNvbnN0IGJhc2VUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg1MTIpO1xuY29uc3Qgc2hpZnRUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg1MTIpO1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGNvbnN0IGUgPSBpIC0gMTI3O1xuXG4gIC8vIHZlcnkgc21hbGwgbnVtYmVyICgwLCAtMClcbiAgaWYgKGUgPCAtMjcpIHtcbiAgICBiYXNlVGFibGVbaV0gICAgICAgICA9IDB4MDAwMDtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAyNDtcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAyNDtcblxuICAvLyBzbWFsbCBudW1iZXIgKGRlbm9ybSlcbiAgfSBlbHNlIGlmIChlIDwgLTE0KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAgMHgwNDAwID4+ICgtZSAtIDE0KTtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9ICgweDA0MDAgPj4gKC1lIC0gMTQpKSB8IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAtZSAtIDE7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gLWUgLSAxO1xuXG4gIC8vIG5vcm1hbCBudW1iZXJcbiAgfSBlbHNlIGlmIChlIDw9IDE1KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAgKGUgKyAxNSkgPDwgMTA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAoKGUgKyAxNSkgPDwgMTApIHwgMHg4MDAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDEzO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDEzO1xuXG4gIC8vIGxhcmdlIG51bWJlciAoSW5maW5pdHksIC1JbmZpbml0eSlcbiAgfSBlbHNlIGlmIChlIDwgMTI4KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAweDdjMDA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweGZjMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gMjQ7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgLy8gc3RheSAoTmFOLCBJbmZpbml0eSwgLUluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gMHg3YzAwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDEzO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDEzO1xuICB9XG59XG5cbi8qKlxuICogcm91bmQgYSBudW1iZXIgdG8gYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzLlxuICpcbiAqIEBwYXJhbSB7dW5rbm93bn0gbnVtIC0gZG91YmxlIGZsb2F0XG4gKiBAcmV0dXJucyB7bnVtYmVyfSBoYWxmIGZsb2F0IG51bWJlciBiaXRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByb3VuZFRvRmxvYXQxNkJpdHMobnVtKSB7XG4gIGZsb2F0Vmlld1swXSA9IC8qKiBAdHlwZSB7YW55fSAqLyAobnVtKTtcbiAgY29uc3QgZiA9IHVpbnQzMlZpZXdbMF07XG4gIGNvbnN0IGUgPSAoZiA+PiAyMykgJiAweDFmZjtcbiAgcmV0dXJuIGJhc2VUYWJsZVtlXSArICgoZiAmIDB4MDA3ZmZmZmYpID4+IHNoaWZ0VGFibGVbZV0pO1xufVxuXG5jb25zdCBtYW50aXNzYVRhYmxlID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KDIwNDgpO1xuY29uc3QgZXhwb25lbnRUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg2NCk7XG5jb25zdCBvZmZzZXRUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg2NCk7XG5cbm1hbnRpc3NhVGFibGVbMF0gPSAwO1xuZm9yIChsZXQgaSA9IDE7IGkgPCAxMDI0OyArK2kpIHtcbiAgbGV0IG0gPSBpIDw8IDEzOyAgICAvLyB6ZXJvIHBhZCBtYW50aXNzYSBiaXRzXG4gIGxldCBlID0gMDsgICAgICAgICAgLy8gemVybyBleHBvbmVudFxuXG4gIC8vIG5vcm1hbGl6ZWRcbiAgd2hpbGUoKG0gJiAweDAwODAwMDAwKSA9PT0gMCkge1xuICAgIGUgLT0gMHgwMDgwMDAwMDsgIC8vIGRlY3JlbWVudCBleHBvbmVudFxuICAgIG0gPDw9IDE7XG4gIH1cblxuICBtICY9IH4weDAwODAwMDAwOyAgIC8vIGNsZWFyIGxlYWRpbmcgMSBiaXRcbiAgZSArPSAweDM4ODAwMDAwOyAgICAvLyBhZGp1c3QgYmlhc1xuXG4gIG1hbnRpc3NhVGFibGVbaV0gPSBtIHwgZTtcbn1cbmZvciAobGV0IGkgPSAxMDI0OyBpIDwgMjA0ODsgKytpKSB7XG4gIG1hbnRpc3NhVGFibGVbaV0gPSAweDM4MDAwMDAwICsgKChpIC0gMTAyNCkgPDwgMTMpO1xufVxuXG5leHBvbmVudFRhYmxlWzBdID0gMDtcbmZvciAobGV0IGkgPSAxOyBpIDwgMzE7ICsraSkge1xuICBleHBvbmVudFRhYmxlW2ldID0gaSA8PCAyMztcbn1cbmV4cG9uZW50VGFibGVbMzFdID0gMHg0NzgwMDAwMDtcbmV4cG9uZW50VGFibGVbMzJdID0gMHg4MDAwMDAwMDtcbmZvciAobGV0IGkgPSAzMzsgaSA8IDYzOyArK2kpIHtcbiAgZXhwb25lbnRUYWJsZVtpXSA9IDB4ODAwMDAwMDAgKyAoKGkgLSAzMikgPDwgMjMpO1xufVxuZXhwb25lbnRUYWJsZVs2M10gPSAweGM3ODAwMDAwO1xuXG5vZmZzZXRUYWJsZVswXSA9IDA7XG5mb3IgKGxldCBpID0gMTsgaSA8IDY0OyArK2kpIHtcbiAgaWYgKGkgPT09IDMyKSB7XG4gICAgb2Zmc2V0VGFibGVbaV0gPSAwO1xuICB9IGVsc2Uge1xuICAgIG9mZnNldFRhYmxlW2ldID0gMTAyNDtcbiAgfVxufVxuXG4vKipcbiAqIGNvbnZlcnQgYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBmbG9hdDE2Yml0cyAtIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGRvdWJsZSBmbG9hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzKSB7XG4gIGNvbnN0IG0gPSBmbG9hdDE2Yml0cyA+PiAxMDtcbiAgdWludDMyVmlld1swXSA9IG1hbnRpc3NhVGFibGVbb2Zmc2V0VGFibGVbbV0gKyAoZmxvYXQxNmJpdHMgJiAweDNmZildICsgZXhwb25lbnRUYWJsZVttXTtcbiAgcmV0dXJuIGZsb2F0Vmlld1swXTtcbn1cbiIsImV4cG9ydCBjb25zdCBDT05TVFJVQ1RPUl9JU19OT1RfQV9PQkpFQ1QgPSBcIkNvbnN0cnVjdG9yIGlzIG5vdCBhIG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IFRISVNfSVNfTk9UX0FfT0JKRUNUID0gXCJUaGlzIGlzIG5vdCBhIG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IFRISVNfSVNfTk9UX0FfRkxPQVQxNkFSUkFZID0gXCJUaGlzIGlzIG5vdCBhIEZsb2F0MTZBcnJheVwiO1xuZXhwb3J0IGNvbnN0IFRISVNfQ09OU1RSVUNUT1JfSVNfTk9UX0FfU1VCQ0xBU1NfT0ZfRkxPQVQxNkFSUkFZID1cbiAgXCJUaGlzIGNvbnN0cnVjdG9yIGlzIG5vdCBhIHN1YmNsYXNzIG9mIEZsb2F0MTZBcnJheVwiO1xuZXhwb3J0IGNvbnN0IFNQRUNJRVNDT05TVFJVQ1RPUl9ESUROVF9SRVRVUk5fVFlQRURBUlJBWSA9XG4gIFwiU3BlY2llc0NvbnN0cnVjdG9yIGRpZG4ndCByZXR1cm4gVHlwZWRBcnJheVwiO1xuZXhwb3J0IGNvbnN0IERFUklWRURfVFlQRURBUlJBWV9DT05TVFJVQ1RPUl9DUkVBVEVEX0FOX0FSUkFZX1dISUNIX1dBU19UT09fU01BTEwgPVxuICBcIkRlcml2ZWQgVHlwZWRBcnJheSBjb25zdHJ1Y3RvciBjcmVhdGVkIGFuIGFycmF5IHdoaWNoIHdhcyB0b28gc21hbGxcIjtcbmV4cG9ydCBjb25zdCBDQU5OT1RfQ09OVkVSVF9VTkRFRklORURfT1JfTlVMTF9UT19PQkpFQ1QgPVxuICBcIkNhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IENBTk5PVF9DT05WRVJUX0FfQklHSU5UX1ZBTFVFX1RPX0FfTlVNQkVSID1cbiAgXCJDYW5ub3QgY29udmVydCBhIEJpZ0ludCB2YWx1ZSB0byBhIG51bWJlclwiO1xuZXhwb3J0IGNvbnN0IENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFUyA9XG4gIFwiQ2Fubm90IG1peCBCaWdJbnQgYW5kIG90aGVyIHR5cGVzLCB1c2UgZXhwbGljaXQgY29udmVyc2lvbnNcIjtcbmV4cG9ydCBjb25zdCBSRURVQ0VfT0ZfRU1QVFlfQVJSQVlfV0lUSF9OT19JTklUSUFMX1ZBTFVFID1cbiAgXCJSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlXCI7XG5leHBvcnQgY29uc3QgT0ZGU0VUX0lTX09VVF9PRl9CT1VORFMgPSBcIk9mZnNldCBpcyBvdXQgb2YgYm91bmRzXCI7XG4iLCJpbXBvcnQgeyBjb252ZXJ0VG9OdW1iZXIsIHJvdW5kVG9GbG9hdDE2Qml0cyB9IGZyb20gXCIuL191dGlsL2NvbnZlcnRlci5tanNcIjtcbmltcG9ydCB7IENBTk5PVF9DT05WRVJUX0FfQklHSU5UX1ZBTFVFX1RPX0FfTlVNQkVSIH0gZnJvbSBcIi4vX3V0aWwvbWVzc2FnZXMubWpzXCI7XG5pbXBvcnQge1xuICBOYXRpdmVOdW1iZXIsXG4gIE5hdGl2ZVR5cGVFcnJvcixcbiAgTnVtYmVySXNGaW5pdGUsXG59IGZyb20gXCIuL191dGlsL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKipcbiAqIHJldHVybnMgdGhlIG5lYXJlc3QgaGFsZiBwcmVjaXNpb24gZmxvYXQgcmVwcmVzZW50YXRpb24gb2YgYSBudW1iZXIuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhmcm91bmQobnVtKSB7XG4gIGlmICh0eXBlb2YgbnVtID09PSBcImJpZ2ludFwiKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKENBTk5PVF9DT05WRVJUX0FfQklHSU5UX1ZBTFVFX1RPX0FfTlVNQkVSKTtcbiAgfVxuXG4gIG51bSA9IE5hdGl2ZU51bWJlcihudW0pO1xuXG4gIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgaWYgKCFOdW1iZXJJc0Zpbml0ZShudW0pIHx8IG51bSA9PT0gMCkge1xuICAgIHJldHVybiBudW07XG4gIH1cblxuICBjb25zdCB4MTYgPSByb3VuZFRvRmxvYXQxNkJpdHMobnVtKTtcbiAgcmV0dXJuIGNvbnZlcnRUb051bWJlcih4MTYpO1xufVxuIiwiaW1wb3J0IHtcbiAgR2VuZXJhdG9yUHJvdG90eXBlTmV4dCxcbiAgSXRlcmF0b3JQcm90b3R5cGUsXG4gIE5hdGl2ZVdlYWtNYXAsXG4gIE9iamVjdENyZWF0ZSxcbiAgU3ltYm9sVG9TdHJpbmdUYWcsXG4gIFdlYWtNYXBQcm90b3R5cGVHZXQsXG4gIFdlYWtNYXBQcm90b3R5cGVTZXQsXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKiogQHR5cGUge1dlYWtNYXA8e30sIEdlbmVyYXRvcjxhbnk+Pn0gKi9cbmNvbnN0IGdlbmVyYXRvcnMgPSBuZXcgTmF0aXZlV2Vha01hcCgpO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSVhcnJheWl0ZXJhdG9ycHJvdG90eXBlJS1vYmplY3QgKi9cbmNvbnN0IEFycmF5SXRlcmF0b3JQcm90b3R5cGUgPSBPYmplY3RDcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtcbiAgbmV4dDoge1xuICAgIHZhbHVlOiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgY29uc3QgZ2VuZXJhdG9yID0gV2Vha01hcFByb3RvdHlwZUdldChnZW5lcmF0b3JzLCB0aGlzKTtcbiAgICAgIHJldHVybiBHZW5lcmF0b3JQcm90b3R5cGVOZXh0KGdlbmVyYXRvcik7XG4gICAgfSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gIH0sXG5cbiAgW1N5bWJvbFRvU3RyaW5nVGFnXToge1xuICAgIHZhbHVlOiBcIkFycmF5IEl0ZXJhdG9yXCIsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICB9LFxufSk7XG5cbi8qKiBAdHlwZSB7PFQ+KGdlbmVyYXRvcjogR2VuZXJhdG9yPFQ+KSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFQ+fSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBJbkFycmF5SXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG4gIGNvbnN0IGFycmF5SXRlcmF0b3IgPSBPYmplY3RDcmVhdGUoQXJyYXlJdGVyYXRvclByb3RvdHlwZSk7XG4gIFdlYWtNYXBQcm90b3R5cGVTZXQoZ2VuZXJhdG9ycywgYXJyYXlJdGVyYXRvciwgZ2VuZXJhdG9yKTtcbiAgcmV0dXJuIGFycmF5SXRlcmF0b3I7XG59XG4iLCJpbXBvcnQge1xuICBBcnJheUlzQXJyYXksXG4gIE1hdGhUcnVuYyxcbiAgTmF0aXZlTnVtYmVyLFxuICBOdW1iZXJJc0Zpbml0ZSxcbiAgU3ltYm9sSXRlcmF0b3IsXG4gIFN5bWJvbFRvU3RyaW5nVGFnLFxuICBUeXBlZEFycmF5UHJvdG90eXBlR2V0U3ltYm9sVG9TdHJpbmdUYWcsXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyB7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB8fFxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyB7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiO1xufVxuXG4vLyBJbnNwaXJlZCBieSB1dGlsLnR5cGVzIGltcGxlbWVudGF0aW9uIG9mIE5vZGUuanNcbi8qKiBAdHlwZWRlZiB7VWludDhBcnJheXxVaW50OENsYW1wZWRBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxJbnQ4QXJyYXl8SW50MTZBcnJheXxJbnQzMkFycmF5fEZsb2F0MzJBcnJheXxGbG9hdDY0QXJyYXl8QmlnVWludDY0QXJyYXl8QmlnSW50NjRBcnJheX0gVHlwZWRBcnJheSAqL1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBUeXBlZEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBUeXBlZEFycmF5UHJvdG90eXBlR2V0U3ltYm9sVG9TdHJpbmdUYWcodmFsdWUpICE9PSB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIEJpZ0ludDY0QXJyYXl8QmlnVWludDY0QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0JpZ0ludFR5cGVkQXJyYXkodmFsdWUpIHtcbiAgY29uc3QgdHlwZWRBcnJheU5hbWUgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0U3ltYm9sVG9TdHJpbmdUYWcodmFsdWUpO1xuICByZXR1cm4gdHlwZWRBcnJheU5hbWUgPT09IFwiQmlnSW50NjRBcnJheVwiIHx8XG4gICAgdHlwZWRBcnJheU5hbWUgPT09IFwiQmlnVWludDY0QXJyYXlcIjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgQXJyYXlCdWZmZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIHZhbHVlW1N5bWJvbFRvU3RyaW5nVGFnXSA9PT0gXCJBcnJheUJ1ZmZlclwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBTaGFyZWRBcnJheUJ1ZmZlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhcmVkQXJyYXlCdWZmZXIodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICB2YWx1ZVtTeW1ib2xUb1N0cmluZ1RhZ10gPT09IFwiU2hhcmVkQXJyYXlCdWZmZXJcIjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgSXRlcmFibGU8dW5rbm93bj59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0l0ZXJhYmxlKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWVbU3ltYm9sSXRlcmF0b3JdID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHVua25vd25bXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3JkaW5hcnlBcnJheSh2YWx1ZSkge1xuICBpZiAoIUFycmF5SXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBpdGVyYXRvciA9IHZhbHVlW1N5bWJvbEl0ZXJhdG9yXSgpO1xuICBpZiAoaXRlcmF0b3JbU3ltYm9sVG9TdHJpbmdUYWddICE9PSBcIkFycmF5IEl0ZXJhdG9yXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVHlwZWRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3JkaW5hcnlUeXBlZEFycmF5KHZhbHVlKSB7XG4gIGlmICghaXNUeXBlZEFycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gdmFsdWVbU3ltYm9sSXRlcmF0b3JdKCk7XG4gIGlmIChpdGVyYXRvcltTeW1ib2xUb1N0cmluZ1RhZ10gIT09IFwiQXJyYXkgSXRlcmF0b3JcIikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgbnVtYmVyID0gTmF0aXZlTnVtYmVyKHZhbHVlKTtcbiAgaWYgKHZhbHVlICE9PSBudW1iZXIgKyBcIlwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFOdW1iZXJJc0Zpbml0ZShudW1iZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKG51bWJlciAhPT0gTWF0aFRydW5jKG51bWJlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cbiIsImltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSBcIi4vaXMubWpzXCI7XG5pbXBvcnQge1xuICBDQU5OT1RfQ09OVkVSVF9BX0JJR0lOVF9WQUxVRV9UT19BX05VTUJFUixcbiAgQ09OU1RSVUNUT1JfSVNfTk9UX0FfT0JKRUNULFxuICBUSElTX0lTX05PVF9BX09CSkVDVCxcbn0gZnJvbSBcIi4vbWVzc2FnZXMubWpzXCI7XG5pbXBvcnQge1xuICBNYXRoVHJ1bmMsXG4gIE5hdGl2ZU51bWJlcixcbiAgTmF0aXZlVHlwZUVycm9yLFxuICBOdW1iZXJJc05hTixcbiAgT2JqZWN0SXMsXG4gIFN5bWJvbFNwZWNpZXMsXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b2ludGVnZXJvcmluZmluaXR5XG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFRvSW50ZWdlck9ySW5maW5pdHkodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcImJpZ2ludFwiKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKENBTk5PVF9DT05WRVJUX0FfQklHSU5UX1ZBTFVFX1RPX0FfTlVNQkVSKTtcbiAgfVxuXG4gIGNvbnN0IG51bWJlciA9IE5hdGl2ZU51bWJlcih0YXJnZXQpO1xuXG4gIGlmIChOdW1iZXJJc05hTihudW1iZXIpIHx8IG51bWJlciA9PT0gMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIE1hdGhUcnVuYyhudW1iZXIpO1xufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b2xlbmd0aFxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIFRvTGVuZ3RoKHRhcmdldCkge1xuICBjb25zdCBsZW5ndGggPSBUb0ludGVnZXJPckluZmluaXR5KHRhcmdldCk7XG4gIGlmIChsZW5ndGggPCAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gbGVuZ3RoIDwgTmF0aXZlTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICA/IGxlbmd0aFxuICAgIDogTmF0aXZlTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWxlbmd0aG9mYXJyYXlsaWtlXG4gKiBAcGFyYW0ge29iamVjdH0gYXJyYXlMaWtlXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gTGVuZ3RoT2ZBcnJheUxpa2UoYXJyYXlMaWtlKSB7XG4gIGlmICghaXNPYmplY3QoYXJyYXlMaWtlKSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSElTX0lTX05PVF9BX09CSkVDVCk7XG4gIH1cblxuICByZXR1cm4gVG9MZW5ndGgoLyoqIEB0eXBlIHthbnl9ICovIChhcnJheUxpa2UpLmxlbmd0aCk7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXNwZWNpZXNjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtvYmplY3R9IHRhcmdldFxuICogQHBhcmFtIHt7IG5ldyguLi5hcmdzOiBhbnlbXSk6IGFueTsgfX0gZGVmYXVsdENvbnN0cnVjdG9yXG4gKiBAcmV0dXJucyB7eyBuZXcoLi4uYXJnczogYW55W10pOiBhbnk7IH19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBTcGVjaWVzQ29uc3RydWN0b3IodGFyZ2V0LCBkZWZhdWx0Q29uc3RydWN0b3IpIHtcbiAgaWYgKCFpc09iamVjdCh0YXJnZXQpKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFRISVNfSVNfTk9UX0FfT0JKRUNUKTtcbiAgfVxuXG4gIGNvbnN0IGNvbnN0cnVjdG9yID0gdGFyZ2V0LmNvbnN0cnVjdG9yO1xuICBpZiAoY29uc3RydWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBkZWZhdWx0Q29uc3RydWN0b3I7XG4gIH1cbiAgaWYgKCFpc09iamVjdChjb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ09OU1RSVUNUT1JfSVNfTk9UX0FfT0JKRUNUKTtcbiAgfVxuXG4gIGNvbnN0IHNwZWNpZXMgPSBjb25zdHJ1Y3RvcltTeW1ib2xTcGVjaWVzXTtcbiAgaWYgKHNwZWNpZXMgPT0gbnVsbCkge1xuICAgIHJldHVybiBkZWZhdWx0Q29uc3RydWN0b3I7XG4gIH1cblxuICByZXR1cm4gc3BlY2llcztcbn1cblxuLyoqXG4gKiBiaWdpbnQgY29tcGFyaXNvbnMgYXJlIG5vdCBzdXBwb3J0ZWRcbiAqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb3J0XG4gKiBAcGFyYW0ge251bWJlcn0geFxuICogQHBhcmFtIHtudW1iZXJ9IHlcbiAqIEByZXR1cm5zIHstMSB8IDAgfCAxfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdENvbXBhcmUoeCwgeSkge1xuICBjb25zdCBpc1hOYU4gPSBOdW1iZXJJc05hTih4KTtcbiAgY29uc3QgaXNZTmFOID0gTnVtYmVySXNOYU4oeSk7XG5cbiAgaWYgKGlzWE5hTiAmJiBpc1lOYU4pIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChpc1hOYU4pIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGlmIChpc1lOYU4pIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBpZiAoeCA8IHkpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBpZiAoeCA+IHkpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGlmICh4ID09PSAwICYmIHkgPT09IDApIHtcbiAgICBjb25zdCBpc1hQbHVzWmVybyA9IE9iamVjdElzKHgsIDApO1xuICAgIGNvbnN0IGlzWVBsdXNaZXJvID0gT2JqZWN0SXMoeSwgMCk7XG5cbiAgICBpZiAoIWlzWFBsdXNaZXJvICYmIGlzWVBsdXNaZXJvKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKGlzWFBsdXNaZXJvICYmICFpc1lQbHVzWmVybykge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIDA7XG59XG4iLCJpbXBvcnQgeyB3cmFwSW5BcnJheUl0ZXJhdG9yIH0gZnJvbSBcIi4vX3V0aWwvYXJyYXlJdGVyYXRvci5tanNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHtcbiAgaXNBcnJheUJ1ZmZlcixcbiAgaXNCaWdJbnRUeXBlZEFycmF5LFxuICBpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyxcbiAgaXNJdGVyYWJsZSxcbiAgaXNPYmplY3QsXG4gIGlzT2JqZWN0TGlrZSxcbiAgaXNPcmRpbmFyeUFycmF5LFxuICBpc09yZGluYXJ5VHlwZWRBcnJheSxcbiAgaXNTaGFyZWRBcnJheUJ1ZmZlcixcbiAgaXNUeXBlZEFycmF5LFxufSBmcm9tIFwiLi9fdXRpbC9pcy5tanNcIjtcbmltcG9ydCB7XG4gIENBTk5PVF9DT05WRVJUX1VOREVGSU5FRF9PUl9OVUxMX1RPX09CSkVDVCxcbiAgQ0FOTk9UX01JWF9CSUdJTlRfQU5EX09USEVSX1RZUEVTLFxuICBDT05TVFJVQ1RPUl9JU19OT1RfQV9PQkpFQ1QsXG4gIERFUklWRURfVFlQRURBUlJBWV9DT05TVFJVQ1RPUl9DUkVBVEVEX0FOX0FSUkFZX1dISUNIX1dBU19UT09fU01BTEwsXG4gIE9GRlNFVF9JU19PVVRfT0ZfQk9VTkRTLFxuICBSRURVQ0VfT0ZfRU1QVFlfQVJSQVlfV0lUSF9OT19JTklUSUFMX1ZBTFVFLFxuICBTUEVDSUVTQ09OU1RSVUNUT1JfRElETlRfUkVUVVJOX1RZUEVEQVJSQVksXG4gIFRISVNfQ09OU1RSVUNUT1JfSVNfTk9UX0FfU1VCQ0xBU1NfT0ZfRkxPQVQxNkFSUkFZLFxuICBUSElTX0lTX05PVF9BX0ZMT0FUMTZBUlJBWSxcbn0gZnJvbSBcIi4vX3V0aWwvbWVzc2FnZXMubWpzXCI7XG5pbXBvcnQge1xuICBBcnJheVByb3RvdHlwZUpvaW4sXG4gIEFycmF5UHJvdG90eXBlUHVzaCxcbiAgQXJyYXlQcm90b3R5cGVUb0xvY2FsZVN0cmluZyxcbiAgTmF0aXZlQXJyYXlCdWZmZXIsXG4gIE5hdGl2ZU9iamVjdCxcbiAgTmF0aXZlUHJveHksXG4gIE5hdGl2ZVJhbmdlRXJyb3IsXG4gIE5hdGl2ZVNldCxcbiAgTmF0aXZlVHlwZUVycm9yLFxuICBOYXRpdmVVaW50MTZBcnJheSxcbiAgTmF0aXZlV2Vha01hcCxcbiAgTnVtYmVySXNOYU4sXG4gIE9iamVjdERlZmluZVByb3BlcnR5LFxuICBPYmplY3RGcmVlemUsXG4gIE9iamVjdEhhc093bixcbiAgUmVmbGVjdEFwcGx5LFxuICBSZWZsZWN0Q29uc3RydWN0LFxuICBSZWZsZWN0R2V0LFxuICBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICBSZWZsZWN0R2V0UHJvdG90eXBlT2YsXG4gIFJlZmxlY3RIYXMsXG4gIFJlZmxlY3RPd25LZXlzLFxuICBSZWZsZWN0U2V0LFxuICBSZWZsZWN0U2V0UHJvdG90eXBlT2YsXG4gIFNldFByb3RvdHlwZUFkZCxcbiAgU2V0UHJvdG90eXBlSGFzLFxuICBTeW1ib2xGb3IsXG4gIFN5bWJvbEl0ZXJhdG9yLFxuICBTeW1ib2xUb1N0cmluZ1RhZyxcbiAgVHlwZWRBcnJheSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUNvcHlXaXRoaW4sXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVFbnRyaWVzLFxuICBUeXBlZEFycmF5UHJvdG90eXBlRmlsbCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcixcbiAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVLZXlzLFxuICBUeXBlZEFycmF5UHJvdG90eXBlUmV2ZXJzZSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVNldCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlLFxuICBUeXBlZEFycmF5UHJvdG90eXBlU29ydCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVN1YmFycmF5LFxuICBUeXBlZEFycmF5UHJvdG90eXBlVmFsdWVzLFxuICBVaW50MTZBcnJheUZyb20sXG4gIFdlYWtNYXBQcm90b3R5cGVHZXQsXG4gIFdlYWtNYXBQcm90b3R5cGVTZXQsXG59IGZyb20gXCIuL191dGlsL3ByaW1vcmRpYWxzLm1qc1wiO1xuaW1wb3J0IHtcbiAgTGVuZ3RoT2ZBcnJheUxpa2UsXG4gIFNwZWNpZXNDb25zdHJ1Y3RvcixcbiAgVG9JbnRlZ2VyT3JJbmZpbml0eSxcbiAgZGVmYXVsdENvbXBhcmUsXG59IGZyb20gXCIuL191dGlsL3NwZWMubWpzXCI7XG5cbmNvbnN0IEJZVEVTX1BFUl9FTEVNRU5UID0gMjtcblxuY29uc3QgYnJhbmQgPSBTeW1ib2xGb3IoXCJfX0Zsb2F0MTZBcnJheV9fXCIpO1xuXG4vKiogQHR5cGUge1dlYWtNYXA8RmxvYXQxNkFycmF5LCBVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfT59ICovXG5jb25zdCB0YXJnZXRzID0gbmV3IE5hdGl2ZVdlYWtNYXAoKTtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGhhc0Zsb2F0MTZBcnJheUJyYW5kKHRhcmdldCkge1xuICBpZiAoIWlzT2JqZWN0TGlrZSh0YXJnZXQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcHJvdG90eXBlID0gUmVmbGVjdEdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gIGlmICghaXNPYmplY3RMaWtlKHByb3RvdHlwZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBjb25zdHJ1Y3RvciA9IHByb3RvdHlwZS5jb25zdHJ1Y3RvcjtcbiAgaWYgKGNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCFpc09iamVjdChjb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ09OU1RSVUNUT1JfSVNfTk9UX0FfT0JKRUNUKTtcbiAgfVxuXG4gIHJldHVybiBSZWZsZWN0SGFzKGNvbnN0cnVjdG9yLCBicmFuZCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHt0YXJnZXQgaXMgRmxvYXQxNkFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGbG9hdDE2QXJyYXkodGFyZ2V0KSB7XG4gIHJldHVybiBoYXNGbG9hdDE2QXJyYXlCcmFuZCh0YXJnZXQpICYmICFpc1R5cGVkQXJyYXkodGFyZ2V0KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge2Fzc2VydHMgdGFyZ2V0IGlzIEZsb2F0MTZBcnJheX1cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0RmxvYXQxNkFycmF5KHRhcmdldCkge1xuICBpZiAoIWlzRmxvYXQxNkFycmF5KHRhcmdldCkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhJU19JU19OT1RfQV9GTE9BVDE2QVJSQVkpO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEBwYXJhbSB7bnVtYmVyPX0gY291bnRcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEByZXR1cm5zIHthc3NlcnRzIHRhcmdldCBpcyBVaW50OEFycmF5fFVpbnQ4Q2xhbXBlZEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fEludDhBcnJheXxJbnQxNkFycmF5fEludDMyQXJyYXl8RmxvYXQxNkFycmF5fEZsb2F0MzJBcnJheXxGbG9hdDY0QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KHRhcmdldCwgY291bnQpIHtcbiAgY29uc3QgaXNUYXJnZXRGbG9hdDE2QXJyYXkgPSBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpO1xuICBjb25zdCBpc1RhcmdldFR5cGVkQXJyYXkgPSBpc1R5cGVkQXJyYXkodGFyZ2V0KTtcblxuICBpZiAoIWlzVGFyZ2V0RmxvYXQxNkFycmF5ICYmICFpc1RhcmdldFR5cGVkQXJyYXkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoU1BFQ0lFU0NPTlNUUlVDVE9SX0RJRE5UX1JFVFVSTl9UWVBFREFSUkFZKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgY291bnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICBsZXQgbGVuZ3RoO1xuICAgIGlmIChpc1RhcmdldEZsb2F0MTZBcnJheSkge1xuICAgICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGFyZ2V0KTtcbiAgICAgIGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgodGFyZ2V0KTtcbiAgICB9XG5cbiAgICBpZiAobGVuZ3RoIDwgY291bnQpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgREVSSVZFRF9UWVBFREFSUkFZX0NPTlNUUlVDVE9SX0NSRUFURURfQU5fQVJSQVlfV0hJQ0hfV0FTX1RPT19TTUFMTFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoaXNCaWdJbnRUeXBlZEFycmF5KHRhcmdldCkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ0FOTk9UX01JWF9CSUdJTlRfQU5EX09USEVSX1RZUEVTKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7RmxvYXQxNkFycmF5fSBmbG9hdDE2XG4gKiBAcmV0dXJucyB7VWludDE2QXJyYXkgJiB7IF9fZmxvYXQxNmJpdHM6IG5ldmVyIH19XG4gKi9cbmZ1bmN0aW9uIGdldEZsb2F0MTZCaXRzQXJyYXkoZmxvYXQxNikge1xuICBjb25zdCB0YXJnZXQgPSBXZWFrTWFwUHJvdG90eXBlR2V0KHRhcmdldHMsIGZsb2F0MTYpO1xuICBpZiAodGFyZ2V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgLy8gZnJvbSBhbm90aGVyIEZsb2F0MTZBcnJheSBpbnN0YW5jZSAoYSBkaWZmZXJlbnQgdmVyc2lvbj8pXG4gIGNvbnN0IGNsb25lZCA9IG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGZsb2F0MTYuYnVmZmVyLFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBmbG9hdDE2LmJ5dGVPZmZzZXQsXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGZsb2F0MTYubGVuZ3RoXG4gICk7XG4gIHJldHVybiBXZWFrTWFwUHJvdG90eXBlR2V0KHRhcmdldHMsIGNsb25lZCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfX0gZmxvYXQxNmJpdHNBcnJheVxuICogQHJldHVybnMge251bWJlcltdfVxuICovXG5mdW5jdGlvbiBjb3B5VG9BcnJheShmbG9hdDE2Yml0c0FycmF5KSB7XG4gIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgY29uc3QgYXJyYXkgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGFycmF5W2ldID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5jb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0dGVycyA9IG5ldyBOYXRpdmVTZXQoKTtcbmZvciAoY29uc3Qga2V5IG9mIFJlZmxlY3RPd25LZXlzKFR5cGVkQXJyYXlQcm90b3R5cGUpKSB7XG4gIC8vIEBAdG9TdHJpbmdUYWcgbWV0aG9kIGlzIGRlZmluZWQgaW4gRmxvYXQxNkFycmF5LnByb3RvdHlwZVxuICBpZiAoa2V5ID09PSBTeW1ib2xUb1N0cmluZ1RhZykge1xuICAgIGNvbnRpbnVlO1xuICB9XG5cbiAgY29uc3QgZGVzY3JpcHRvciA9IFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoVHlwZWRBcnJheVByb3RvdHlwZSwga2V5KTtcbiAgaWYgKE9iamVjdEhhc093bihkZXNjcmlwdG9yLCBcImdldFwiKSkge1xuICAgIFNldFByb3RvdHlwZUFkZChUeXBlZEFycmF5UHJvdG90eXBlR2V0dGVycywga2V5KTtcbiAgfVxufVxuXG4vKiogQHR5cGUge1Byb3h5SGFuZGxlcjxGbG9hdDE2QXJyYXk+fSAqL1xuY29uc3QgaGFuZGxlciA9IE9iamVjdEZyZWV6ZSh7XG4gIGdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpIHtcbiAgICBpZiAoaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcoa2V5KSAmJiBPYmplY3RIYXNPd24odGFyZ2V0LCBrZXkpKSB7XG4gICAgICByZXR1cm4gY29udmVydFRvTnVtYmVyKFJlZmxlY3RHZXQodGFyZ2V0LCBrZXkpKTtcbiAgICB9XG5cbiAgICAvLyAlVHlwZWRBcnJheSUucHJvdG90eXBlIGdldHRlciBwcm9wZXJ0aWVzIGNhbm5vdCBjYWxsZWQgYnkgUHJveHkgcmVjZWl2ZXJcbiAgICBpZiAoU2V0UHJvdG90eXBlSGFzKFR5cGVkQXJyYXlQcm90b3R5cGVHZXR0ZXJzLCBrZXkpKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdEdldCh0YXJnZXQsIGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZmxlY3RHZXQodGFyZ2V0LCBrZXksIHJlY2VpdmVyKTtcbiAgfSxcblxuICBzZXQodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcikge1xuICAgIGlmIChpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyhrZXkpICYmIE9iamVjdEhhc093bih0YXJnZXQsIGtleSkpIHtcbiAgICAgIHJldHVybiBSZWZsZWN0U2V0KHRhcmdldCwga2V5LCByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVmbGVjdFNldCh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKTtcbiAgfSxcbn0pO1xuXG5leHBvcnQgY2xhc3MgRmxvYXQxNkFycmF5IHtcbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10eXBlZGFycmF5ICovXG4gIGNvbnN0cnVjdG9yKGlucHV0LCBfYnl0ZU9mZnNldCwgX2xlbmd0aCkge1xuICAgIC8qKiBAdHlwZSB7VWludDE2QXJyYXkgJiB7IF9fZmxvYXQxNmJpdHM6IG5ldmVyIH19ICovXG4gICAgbGV0IGZsb2F0MTZiaXRzQXJyYXk7XG5cbiAgICBpZiAoaXNGbG9hdDE2QXJyYXkoaW5wdXQpKSB7XG4gICAgICAvLyBwZWVsIG9mZiBQcm94eVxuICAgICAgZmxvYXQxNmJpdHNBcnJheSA9IFJlZmxlY3RDb25zdHJ1Y3QoTmF0aXZlVWludDE2QXJyYXksIFtnZXRGbG9hdDE2Qml0c0FycmF5KGlucHV0KV0sIG5ldy50YXJnZXQpO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoaW5wdXQpICYmICFpc0FycmF5QnVmZmVyKGlucHV0KSkgeyAvLyBvYmplY3Qgd2l0aG91dCBBcnJheUJ1ZmZlclxuICAgICAgLyoqIEB0eXBlIHtBcnJheUxpa2U8dW5rbm93bj59ICovXG4gICAgICBsZXQgbGlzdDtcbiAgICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICAgICAgbGV0IGxlbmd0aDtcblxuICAgICAgaWYgKGlzVHlwZWRBcnJheShpbnB1dCkpIHsgLy8gVHlwZWRBcnJheVxuICAgICAgICBpZiAoaXNCaWdJbnRUeXBlZEFycmF5KGlucHV0KSkge1xuICAgICAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgICAgIENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFU1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0ID0gaW5wdXQ7XG4gICAgICAgIGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoaW5wdXQpO1xuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoaW5wdXQpO1xuICAgICAgICBjb25zdCBCdWZmZXJDb25zdHJ1Y3RvciA9ICFpc1NoYXJlZEFycmF5QnVmZmVyKGJ1ZmZlcilcbiAgICAgICAgICA/IC8qKiBAdHlwZSB7QXJyYXlCdWZmZXJDb25zdHJ1Y3Rvcn0gKi8gKFNwZWNpZXNDb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIGJ1ZmZlcixcbiAgICAgICAgICAgIE5hdGl2ZUFycmF5QnVmZmVyXG4gICAgICAgICAgKSlcbiAgICAgICAgICA6IE5hdGl2ZUFycmF5QnVmZmVyO1xuICAgICAgICBjb25zdCBkYXRhID0gbmV3IEJ1ZmZlckNvbnN0cnVjdG9yKFxuICAgICAgICAgIGxlbmd0aCAqIEJZVEVTX1BFUl9FTEVNRU5UXG4gICAgICAgICk7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBbZGF0YV0sIG5ldy50YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzSXRlcmFibGUoaW5wdXQpKSB7IC8vIEl0ZXJhYmxlIChBcnJheSlcbiAgICAgICAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgICAgICAgaWYgKGlzT3JkaW5hcnlBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIGxpc3QgPSBpbnB1dDtcbiAgICAgICAgICAgIGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGlzdCA9IFsuLi5pbnB1dF07XG4gICAgICAgICAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIEFycmF5TGlrZVxuICAgICAgICAgIGxpc3QgPSAvKiogQHR5cGUge0FycmF5TGlrZTx1bmtub3duPn0gKi8gKGlucHV0KTtcbiAgICAgICAgICBsZW5ndGggPSBMZW5ndGhPZkFycmF5TGlrZShpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgZmxvYXQxNmJpdHNBcnJheSA9IFJlZmxlY3RDb25zdHJ1Y3QoTmF0aXZlVWludDE2QXJyYXksIFtsZW5ndGhdLCBuZXcudGFyZ2V0KTtcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHZhbHVlc1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICAvLyBzdXBlciAoVWludDE2QXJyYXkpXG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXlbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMobGlzdFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8gcHJpbWl0aXZlLCBBcnJheUJ1ZmZlclxuICAgICAgZmxvYXQxNmJpdHNBcnJheSA9IFJlZmxlY3RDb25zdHJ1Y3QoTmF0aXZlVWludDE2QXJyYXksIGFyZ3VtZW50cywgbmV3LnRhcmdldCk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJveHkgPSBuZXcgTmF0aXZlUHJveHkoLyoqIEB0eXBlIHthbnl9ICovIChmbG9hdDE2Yml0c0FycmF5KSwgaGFuZGxlcik7XG5cbiAgICAvLyBwcm94eSBwcml2YXRlIHN0b3JhZ2VcbiAgICBXZWFrTWFwUHJvdG90eXBlU2V0KHRhcmdldHMsIHByb3h5LCBmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIHJldHVybiBwcm94eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiBgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRmxvYXQxNkFycmF5KWAgb3IgYFJlZmxlY3Qub3duS2V5cyhGbG9hdDE2QXJyYXkpYCBpbmNsdWRlIHRoaXMga2V5XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUuZnJvbVxuICAgKi9cbiAgc3RhdGljIGZyb20oc3JjLCAuLi5vcHRzKSB7XG4gICAgY29uc3QgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgaWYgKCFSZWZsZWN0SGFzKENvbnN0cnVjdG9yLCBicmFuZCkpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBpZiAoaXNGbG9hdDE2QXJyYXkoc3JjKSAmJiBvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShzcmMpO1xuICAgICAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldChmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlKHVpbnQxNikpXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKFxuICAgICAgICAgICAgVWludDE2QXJyYXlGcm9tKHNyYywgcm91bmRUb0Zsb2F0MTZCaXRzKVxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWFwRnVuYyA9IG9wdHNbMF07XG4gICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1sxXTtcblxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgICAgVWludDE2QXJyYXlGcm9tKHNyYywgZnVuY3Rpb24gKHZhbCwgLi4uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHJvdW5kVG9GbG9hdDE2Qml0cyhcbiAgICAgICAgICAgICAgUmVmbGVjdEFwcGx5KG1hcEZ1bmMsIHRoaXMsIFt2YWwsIC4uLmFyZ3NdKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9LCB0aGlzQXJnKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7QXJyYXlMaWtlPHVua25vd24+fSAqL1xuICAgIGxldCBsaXN0O1xuICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICAgIGxldCBsZW5ndGg7XG5cbiAgICBpZiAoaXNJdGVyYWJsZShzcmMpKSB7IC8vIEl0ZXJhYmxlIChUeXBlZEFycmF5LCBBcnJheSlcbiAgICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICAgIGlmIChpc09yZGluYXJ5QXJyYXkoc3JjKSkge1xuICAgICAgICBsaXN0ID0gc3JjO1xuICAgICAgICBsZW5ndGggPSBzcmMubGVuZ3RoO1xuICAgICAgfSBlbHNlIGlmIChpc09yZGluYXJ5VHlwZWRBcnJheShzcmMpKSB7XG4gICAgICAgIGxpc3QgPSBzcmM7XG4gICAgICAgIGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoc3JjKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpc3QgPSBbLi4uc3JjXTtcbiAgICAgICAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8gQXJyYXlMaWtlXG4gICAgICBsaXN0ID0gc3JjO1xuICAgICAgbGVuZ3RoID0gTGVuZ3RoT2ZBcnJheUxpa2Uoc3JjKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gLyoqIEB0eXBlIHtudW1iZXJ9ICovIChsaXN0W2ldKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbWFwRnVuYyA9IG9wdHNbMF07XG4gICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1sxXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgYXJyYXlbaV0gPSBSZWZsZWN0QXBwbHkobWFwRnVuYywgdGhpc0FyZywgW2xpc3RbaV0sIGldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZsb2F0MTZBcnJheSlgIG9yIGBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5KWAgaW5jbHVkZSB0aGlzIGtleVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLm9mXG4gICAqL1xuICBzdGF0aWMgb2YoLi4uaXRlbXMpIHtcbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICBpZiAoIVJlZmxlY3RIYXMoQ29uc3RydWN0b3IsIGJyYW5kKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBsZW5ndGggPSBpdGVtcy5sZW5ndGg7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IHByb3h5ID0gbmV3IEZsb2F0MTZBcnJheShsZW5ndGgpO1xuICAgICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkocHJveHkpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXlbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMoaXRlbXNbaV0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGFycmF5W2ldID0gaXRlbXNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmtleXMgKi9cbiAga2V5cygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gVHlwZWRBcnJheVByb3RvdHlwZUtleXMoZmxvYXQxNmJpdHNBcnJheSk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogcmV0dXJucyBhIG9iamVjdCB3aG9zZSBwcm90b3R5cGUgaXMgbm90IGAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSVgXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnZhbHVlc1xuICAgKi9cbiAgdmFsdWVzKCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIHJldHVybiB3cmFwSW5BcnJheUl0ZXJhdG9yKChmdW5jdGlvbiogKCkge1xuICAgICAgZm9yIChjb25zdCB2YWwgb2YgVHlwZWRBcnJheVByb3RvdHlwZVZhbHVlcyhmbG9hdDE2Yml0c0FycmF5KSkge1xuICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiByZXR1cm5zIGEgb2JqZWN0IHdob3NlIHByb3RvdHlwZSBpcyBub3QgYCVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJWBcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZW50cmllc1xuICAgKi9cbiAgZW50cmllcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gKHdyYXBJbkFycmF5SXRlcmF0b3IoKGZ1bmN0aW9uKiAoKSB7XG4gICAgICBmb3IgKGNvbnN0IFtpLCB2YWxdIG9mIFR5cGVkQXJyYXlQcm90b3R5cGVFbnRyaWVzKGZsb2F0MTZiaXRzQXJyYXkpKSB7XG4gICAgICAgIHlpZWxkIC8qKiBAdHlwZSB7W051bWJlciwgbnVtYmVyXX0gKi8gKFtpLCBjb252ZXJ0VG9OdW1iZXIodmFsKV0pO1xuICAgICAgfVxuICAgIH0pKCkpKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5hdCAqL1xuICBhdChpbmRleCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgcmVsYXRpdmVJbmRleCA9IFRvSW50ZWdlck9ySW5maW5pdHkoaW5kZXgpO1xuICAgIGNvbnN0IGsgPSByZWxhdGl2ZUluZGV4ID49IDAgPyByZWxhdGl2ZUluZGV4IDogbGVuZ3RoICsgcmVsYXRpdmVJbmRleDtcblxuICAgIGlmIChrIDwgMCB8fCBrID49IGxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtrXSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUubWFwICovXG4gIG1hcChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBwcm94eSA9IG5ldyBGbG9hdDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgIGNvbnN0IGFycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShwcm94eSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgICBhcnJheVtpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhcbiAgICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSwgbGVuZ3RoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGFycmF5W2ldID0gUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdmFsLCBpLCB0aGlzXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbHRlciAqL1xuICBmaWx0ZXIoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgY29uc3Qga2VwdCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKSkge1xuICAgICAgICBBcnJheVByb3RvdHlwZVB1c2goa2VwdCwgdmFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGtlcHQpO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5KTtcblxuICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKGFycmF5KTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5yZWR1Y2UgKi9cbiAgcmVkdWNlKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbMF0pO1xuICAgICAgc3RhcnQgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soXG4gICAgICAgIGFjY3VtdWxhdG9yLFxuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJlZHVjZXJpZ2h0ICovXG4gIHJlZHVjZVJpZ2h0KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbbGVuZ3RoIC0gMV0pO1xuICAgICAgc3RhcnQgPSBsZW5ndGggLSAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IGxlbmd0aCAtIDE7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpID49IDA7IC0taSkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjYWxsYmFjayhcbiAgICAgICAgYWNjdW11bGF0b3IsXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgaSxcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZm9yZWFjaCAqL1xuICBmb3JFYWNoKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW1xuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXMsXG4gICAgICBdKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZCAqL1xuICBmaW5kKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kaW5kZXggKi9cbiAgZmluZEluZGV4KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLWFycmF5LWZpbmQtZnJvbS1sYXN0L2luZGV4Lmh0bWwjc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZGxhc3QgKi9cbiAgZmluZExhc3QoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtYXJyYXktZmluZC1mcm9tLWxhc3QvaW5kZXguaHRtbCNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kbGFzdGluZGV4ICovXG4gIGZpbmRMYXN0SW5kZXgoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5ldmVyeSAqL1xuICBldmVyeShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoXG4gICAgICAgICFSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICBdKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb21lICovXG4gIHNvbWUoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKFxuICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICBdKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zZXQgKi9cbiAgc2V0KGlucHV0LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGFyZ2V0T2Zmc2V0ID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAodGFyZ2V0T2Zmc2V0IDwgMCkge1xuICAgICAgdGhyb3cgTmF0aXZlUmFuZ2VFcnJvcihPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyk7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0ID09IG51bGwpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpc0JpZ0ludFR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFU1xuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KGlucHV0KSkge1xuICAgICAgLy8gcGVlbCBvZmYgUHJveHlcbiAgICAgIHJldHVybiBUeXBlZEFycmF5UHJvdG90eXBlU2V0KFxuICAgICAgICBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpLFxuICAgICAgICBnZXRGbG9hdDE2Qml0c0FycmF5KGlucHV0KSxcbiAgICAgICAgdGFyZ2V0T2Zmc2V0XG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldExlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICBjb25zdCBzcmMgPSBOYXRpdmVPYmplY3QoaW5wdXQpO1xuICAgIGNvbnN0IHNyY0xlbmd0aCA9IExlbmd0aE9mQXJyYXlMaWtlKHNyYyk7XG5cbiAgICBpZiAodGFyZ2V0T2Zmc2V0ID09PSBJbmZpbml0eSB8fCBzcmNMZW5ndGggKyB0YXJnZXRPZmZzZXQgPiB0YXJnZXRMZW5ndGgpIHtcbiAgICAgIHRocm93IE5hdGl2ZVJhbmdlRXJyb3IoT0ZGU0VUX0lTX09VVF9PRl9CT1VORFMpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3JjTGVuZ3RoOyArK2kpIHtcbiAgICAgIGZsb2F0MTZiaXRzQXJyYXlbaSArIHRhcmdldE9mZnNldF0gPSByb3VuZFRvRmxvYXQxNkJpdHMoc3JjW2ldKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUucmV2ZXJzZSAqL1xuICByZXZlcnNlKCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVSZXZlcnNlKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmlsbCAqL1xuICBmaWxsKHZhbHVlLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgVHlwZWRBcnJheVByb3RvdHlwZUZpbGwoXG4gICAgICBmbG9hdDE2Yml0c0FycmF5LFxuICAgICAgcm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSxcbiAgICAgIC4uLm9wdHNcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuY29weXdpdGhpbiAqL1xuICBjb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBUeXBlZEFycmF5UHJvdG90eXBlQ29weVdpdGhpbihmbG9hdDE2Yml0c0FycmF5LCB0YXJnZXQsIHN0YXJ0LCAuLi5vcHRzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNvcnQgKi9cbiAgc29ydCguLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgY29tcGFyZSA9IG9wdHNbMF0gIT09IHVuZGVmaW5lZCA/IG9wdHNbMF0gOiBkZWZhdWx0Q29tcGFyZTtcbiAgICBUeXBlZEFycmF5UHJvdG90eXBlU29ydChmbG9hdDE2Yml0c0FycmF5LCAoeCwgeSkgPT4ge1xuICAgICAgcmV0dXJuIGNvbXBhcmUoY29udmVydFRvTnVtYmVyKHgpLCBjb252ZXJ0VG9OdW1iZXIoeSkpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc2xpY2UgKi9cbiAgc2xpY2UoLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBOYXRpdmVVaW50MTZBcnJheShcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSlcbiAgICAgICk7XG4gICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlU2xpY2UodWludDE2LCAuLi5vcHRzKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3Qgc3RhcnQgPSBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pO1xuICAgIGNvbnN0IGVuZCA9IG9wdHNbMV0gPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1sxXSk7XG5cbiAgICBsZXQgaztcbiAgICBpZiAoc3RhcnQgPT09IC1JbmZpbml0eSkge1xuICAgICAgayA9IDA7XG4gICAgfSBlbHNlIGlmIChzdGFydCA8IDApIHtcbiAgICAgIGsgPSBsZW5ndGggKyBzdGFydCA+IDAgPyBsZW5ndGggKyBzdGFydCA6IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGsgPSBsZW5ndGggPCBzdGFydCA/IGxlbmd0aCA6IHN0YXJ0O1xuICAgIH1cblxuICAgIGxldCBmaW5hbDtcbiAgICBpZiAoZW5kID09PSAtSW5maW5pdHkpIHtcbiAgICAgIGZpbmFsID0gMDtcbiAgICB9IGVsc2UgaWYgKGVuZCA8IDApIHtcbiAgICAgIGZpbmFsID0gbGVuZ3RoICsgZW5kID4gMCA/IGxlbmd0aCArIGVuZCA6IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbmFsID0gbGVuZ3RoIDwgZW5kID8gbGVuZ3RoIDogZW5kO1xuICAgIH1cblxuICAgIGNvbnN0IGNvdW50ID0gZmluYWwgLSBrID4gMCA/IGZpbmFsIC0gayA6IDA7XG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IoY291bnQpO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5LCBjb3VudCk7XG5cbiAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG5cbiAgICBsZXQgbiA9IDA7XG4gICAgd2hpbGUgKGsgPCBmaW5hbCkge1xuICAgICAgYXJyYXlbbl0gPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtrXSk7XG4gICAgICArK2s7XG4gICAgICArK247XG4gICAgfVxuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnN1YmFycmF5ICovXG4gIHN1YmFycmF5KC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgY29uc3QgdWludDE2ID0gbmV3IE5hdGl2ZVVpbnQxNkFycmF5KFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KVxuICAgICk7XG4gICAgY29uc3QgdWludDE2U3ViYXJyYXkgPSBUeXBlZEFycmF5UHJvdG90eXBlU3ViYXJyYXkodWludDE2LCAuLi5vcHRzKTtcblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcih1aW50MTZTdWJhcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldCh1aW50MTZTdWJhcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKHVpbnQxNlN1YmFycmF5KVxuICAgICk7XG4gICAgYXNzZXJ0U3BlY2llc1R5cGVkQXJyYXkoYXJyYXkpO1xuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmluZGV4b2YgKi9cbiAgaW5kZXhPZihlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAoZnJvbSA9PT0gSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBmcm9tOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChcbiAgICAgICAgT2JqZWN0SGFzT3duKGZsb2F0MTZiaXRzQXJyYXksIGkpICYmXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSA9PT0gZWxlbWVudFxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5sYXN0aW5kZXhvZiAqL1xuICBsYXN0SW5kZXhPZihlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIGxldCBmcm9tID0gb3B0cy5sZW5ndGggPj0gMSA/IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSkgOiBsZW5ndGggLSAxO1xuICAgIGlmIChmcm9tID09PSAtSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA+PSAwKSB7XG4gICAgICBmcm9tID0gZnJvbSA8IGxlbmd0aCAtIDEgPyBmcm9tIDogbGVuZ3RoIC0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPj0gMDsgLS1pKSB7XG4gICAgICBpZiAoXG4gICAgICAgIE9iamVjdEhhc093bihmbG9hdDE2Yml0c0FycmF5LCBpKSAmJlxuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSkgPT09IGVsZW1lbnRcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuaW5jbHVkZXMgKi9cbiAgaW5jbHVkZXMoZWxlbWVudCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICBsZXQgZnJvbSA9IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSk7XG4gICAgaWYgKGZyb20gPT09IEluZmluaXR5KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICBmcm9tID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpc05hTiA9IE51bWJlcklzTmFOKGVsZW1lbnQpO1xuICAgIGZvciAobGV0IGkgPSBmcm9tOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuXG4gICAgICBpZiAoaXNOYU4gJiYgTnVtYmVySXNOYU4odmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmpvaW4gKi9cbiAgam9pbiguLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgYXJyYXkgPSBjb3B5VG9BcnJheShmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIHJldHVybiBBcnJheVByb3RvdHlwZUpvaW4oYXJyYXksIC4uLm9wdHMpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnRvbG9jYWxlc3RyaW5nICovXG4gIHRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiBBcnJheVByb3RvdHlwZVRvTG9jYWxlU3RyaW5nKGFycmF5LCAuLi5vcHRzKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtZ2V0LSV0eXBlZGFycmF5JS5wcm90b3R5cGUtQEB0b3N0cmluZ3RhZyAqL1xuICBnZXQgW1N5bWJvbFRvU3RyaW5nVGFnXSgpIHtcbiAgICBpZiAoaXNGbG9hdDE2QXJyYXkodGhpcykpIHtcbiAgICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKFwiRmxvYXQxNkFycmF5XCIpO1xuICAgIH1cbiAgfVxufVxuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXR5cGVkYXJyYXkuYnl0ZXNfcGVyX2VsZW1lbnQgKi9cbk9iamVjdERlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheSwgXCJCWVRFU19QRVJfRUxFTUVOVFwiLCB7XG4gIHZhbHVlOiBCWVRFU19QRVJfRUxFTUVOVCxcbn0pO1xuXG4vLyBsaW1pdGF0aW9uOiBJdCBpcyBwZWFrZWQgYnkgYE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoRmxvYXQxNkFycmF5KWAgYW5kIGBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5KWBcbk9iamVjdERlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheSwgYnJhbmQsIHt9KTtcblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1wcm9wZXJ0aWVzLW9mLXRoZS10eXBlZGFycmF5LWNvbnN0cnVjdG9ycyAqL1xuUmVmbGVjdFNldFByb3RvdHlwZU9mKEZsb2F0MTZBcnJheSwgVHlwZWRBcnJheSk7XG5cbmNvbnN0IEZsb2F0MTZBcnJheVByb3RvdHlwZSA9IEZsb2F0MTZBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdHlwZWRhcnJheS5wcm90b3R5cGUuYnl0ZXNfcGVyX2VsZW1lbnQgKi9cbk9iamVjdERlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheVByb3RvdHlwZSwgXCJCWVRFU19QRVJfRUxFTUVOVFwiLCB7XG4gIHZhbHVlOiBCWVRFU19QRVJfRUxFTUVOVCxcbn0pO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUtQEBpdGVyYXRvciAqL1xuT2JqZWN0RGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5UHJvdG90eXBlLCBTeW1ib2xJdGVyYXRvciwge1xuICB2YWx1ZTogRmxvYXQxNkFycmF5UHJvdG90eXBlLnZhbHVlcyxcbiAgd3JpdGFibGU6IHRydWUsXG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbn0pO1xuXG4vLyBUbyBtYWtlIGBuZXcgRmxvYXQxNkFycmF5KCkgaW5zdGFuY2VvZiBVaW50MTZBcnJheWAgcmV0dXJucyBgZmFsc2VgXG5SZWZsZWN0U2V0UHJvdG90eXBlT2YoRmxvYXQxNkFycmF5UHJvdG90eXBlLCBUeXBlZEFycmF5UHJvdG90eXBlKTtcbiIsImltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHtcbiAgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYsXG4gIERhdGFWaWV3UHJvdG90eXBlU2V0VWludDE2LFxufSBmcm9tIFwiLi9fdXRpbC9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiByZXR1cm5zIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlldy5cbiAqXG4gKiBAcGFyYW0ge0RhdGFWaWV3fSBkYXRhVmlld1xuICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXRcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmxvYXQxNihkYXRhVmlldywgYnl0ZU9mZnNldCwgLi4ub3B0cykge1xuICByZXR1cm4gY29udmVydFRvTnVtYmVyKFxuICAgIERhdGFWaWV3UHJvdG90eXBlR2V0VWludDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCAuLi5vcHRzKVxuICApO1xufVxuXG4vKipcbiAqIHN0b3JlcyBhbiB1bnNpZ25lZCAxNi1iaXQgZmxvYXQgdmFsdWUgYXQgdGhlIHNwZWNpZmllZCBieXRlIG9mZnNldCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgRGF0YVZpZXcuXG4gKlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCB2YWx1ZSwgLi4ub3B0cykge1xuICByZXR1cm4gRGF0YVZpZXdQcm90b3R5cGVTZXRVaW50MTYoXG4gICAgZGF0YVZpZXcsXG4gICAgYnl0ZU9mZnNldCxcbiAgICByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpLFxuICAgIC4uLm9wdHNcbiAgKTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztFQUFBO0FBQ0E7RUFDQSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUM7QUFDMUM7RUFDQTtFQUNBLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEM7RUFDQTtFQUNBLFNBQVMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtFQUN4QyxFQUFFLE9BQU8sV0FBVztFQUNwQixJQUFJLCtCQUErQjtFQUNuQyxNQUFNLE1BQU07RUFDWixNQUFNLEdBQUc7RUFDVCxLQUFLLENBQUMsR0FBRztFQUNULEdBQUcsQ0FBQztFQUNKLENBQUM7QUFDRDtFQUNBO0VBQ08sTUFBTTtFQUNiLEVBQUUsS0FBSyxFQUFFLFlBQVk7RUFDckIsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCO0VBQzdCLEVBQUUsR0FBRyxFQUFFLFVBQVU7RUFDakIsRUFBRSx3QkFBd0IsRUFBRSwrQkFBK0I7RUFDM0QsRUFBRSxjQUFjLEVBQUUscUJBQXFCO0VBQ3ZDLEVBQUUsR0FBRyxFQUFFLFVBQVU7RUFDakIsRUFBRSxPQUFPLEVBQUUsY0FBYztFQUN6QixFQUFFLEdBQUcsRUFBRSxVQUFVO0VBQ2pCLEVBQUUsY0FBYyxFQUFFLHFCQUFxQjtFQUN2QyxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQ1o7RUFDQTtFQUNPLE1BQU0sV0FBVyxHQUFH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
