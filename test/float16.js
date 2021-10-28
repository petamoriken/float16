/*! @petamoriken/float16 v3.5.1-1-g940e400 | MIT License - https://git.io/float16 */

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
   * @throws {TypeError}
   * @returns {asserts target is Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float16Array|Float32Array|Float64Array}
   */
  function assertSpeciesTypedArray(target) {
    if (isFloat16Array(target)) {
      return;
    }

    if (!isTypedArray(target)) {
      throw NativeTypeError(SPECIESCONSTRUCTOR_DIDNT_RETURN_TYPEDARRAY);
    }

    if (isBigIntTypedArray(target)) {
      throw NativeTypeError(
        CANNOT_MIX_BIGINT_AND_OTHER_TYPES
      );
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
      float16.buffer,
      float16.byteOffset,
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

  /** limitation: `Object.getPrototypeOf(Float16Array)` returns `Uint16Array` */
  class Float16Array extends NativeUint16Array {
    /** @see https://tc39.es/ecma262/#sec-typedarray */
    constructor(input, byteOffset, length) {
      if (isFloat16Array(input)) {
        // peel off Proxy
        const float16bitsArray = getFloat16BitsArray(input);
        super(float16bitsArray);
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
            length * Float16Array.BYTES_PER_ELEMENT
          );
          super(data);
        } else if (isIterable(input)) { // Iterable (Array)
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
        } else { // ArrayLike
          list = /** @type {ArrayLike<unknown>} */ (input);
          length = LengthOfArrayLike(input);
          super(length);
        }

        // set values
        for (let i = 0; i < length; ++i) {
          // super (Uint16Array)
          this[i] = roundToFloat16Bits(list[i]);
        }
      } else { // primitive, ArrayBuffer
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
            // @ts-ignore
            super(...arguments);
        }
      }

      const proxy = new NativeProxy(this, handler);

      // proxy private storage
      WeakMapPrototypeSet(targets, proxy, /** @type {any} */ (this));

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
      assertSpeciesTypedArray(array);

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
    value: NativeUint16Array.BYTES_PER_ELEMENT,
  });

  // limitation: It is peaked by `Object.getOwnPropertySymbols(Float16Array)` and `Reflect.ownKeys(Float16Array)`
  ObjectDefineProperty(Float16Array, brand, {});

  const Float16ArrayPrototype = Float16Array.prototype;

  /** @see https://tc39.es/ecma262/#sec-typedarray.prototype.bytes_per_element */
  ObjectDefineProperty(Float16ArrayPrototype, "BYTES_PER_ELEMENT", {
    value: NativeUint16Array.BYTES_PER_ELEMENT,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXQxNi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL191dGlsL3ByaW1vcmRpYWxzLm1qcyIsIi4uL3NyYy9fdXRpbC9jb252ZXJ0ZXIubWpzIiwiLi4vc3JjL191dGlsL21lc3NhZ2VzLm1qcyIsIi4uL3NyYy9oZnJvdW5kLm1qcyIsIi4uL3NyYy9fdXRpbC9hcnJheUl0ZXJhdG9yLm1qcyIsIi4uL3NyYy9fdXRpbC9pcy5tanMiLCIuLi9zcmMvX3V0aWwvc3BlYy5tanMiLCIuLi9zcmMvRmxvYXQxNkFycmF5Lm1qcyIsIi4uL3NyYy9EYXRhVmlldy5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovXG5cbmNvbnN0IHsgYmluZCwgY2FsbCB9ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4vKiogQHR5cGUgeyh0YXJnZXQ6IGFueSkgPT4gYW55fSAqL1xuY29uc3QgdW5jdXJyeVRoaXMgPSBiaW5kLmJpbmQoY2FsbCk7XG5cbi8qKiBAdHlwZSB7KHRhcmdldDogYW55LCBrZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4gYW55fSAqL1xuZnVuY3Rpb24gdW5jdXJyeVRoaXNHZXR0ZXIodGFyZ2V0LCBrZXkpIHtcbiAgcmV0dXJuIHVuY3VycnlUaGlzKFxuICAgIFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXG4gICAgICB0YXJnZXQsXG4gICAgICBrZXlcbiAgICApLmdldFxuICApO1xufVxuXG4vLyBSZWZsZWN0XG5leHBvcnQgY29uc3Qge1xuICBhcHBseTogUmVmbGVjdEFwcGx5LFxuICBnZXQ6IFJlZmxlY3RHZXQsXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgZ2V0UHJvdG90eXBlT2Y6IFJlZmxlY3RHZXRQcm90b3R5cGVPZixcbiAgaGFzOiBSZWZsZWN0SGFzLFxuICBvd25LZXlzOiBSZWZsZWN0T3duS2V5cyxcbiAgc2V0OiBSZWZsZWN0U2V0LFxuICBzZXRQcm90b3R5cGVPZjogUmVmbGVjdFNldFByb3RvdHlwZU9mLFxufSA9IFJlZmxlY3Q7XG5cbi8vIFByb3h5XG5leHBvcnQgY29uc3QgTmF0aXZlUHJveHkgPSBQcm94eTtcblxuLy8gTnVtYmVyXG5leHBvcnQgY29uc3QgTmF0aXZlTnVtYmVyID0gTnVtYmVyO1xuZXhwb3J0IGNvbnN0IHtcbiAgaXNGaW5pdGU6IE51bWJlcklzRmluaXRlLFxuICBpc05hTjogTnVtYmVySXNOYU4sXG59ID0gTmF0aXZlTnVtYmVyO1xuXG4vLyBTeW1ib2xcbmV4cG9ydCBjb25zdCB7XG4gIGl0ZXJhdG9yOiBTeW1ib2xJdGVyYXRvcixcbiAgc3BlY2llczogU3ltYm9sU3BlY2llcyxcbiAgdG9TdHJpbmdUYWc6IFN5bWJvbFRvU3RyaW5nVGFnLFxuICBmb3I6IFN5bWJvbEZvcixcbn0gPSBTeW1ib2w7XG5cbi8vIEFycmF5XG5jb25zdCBOYXRpdmVBcnJheSA9IEFycmF5O1xuZXhwb3J0IGNvbnN0IEFycmF5SXNBcnJheSA9IE5hdGl2ZUFycmF5LmlzQXJyYXk7XG5jb25zdCBBcnJheVByb3RvdHlwZSA9IE5hdGl2ZUFycmF5LnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KGFycmF5OiBBcnJheTx1bmtub3duPiwgc2VwYXJhdG9yPzogc3RyaW5nKSA9PiBzdHJpbmd9ICovXG5leHBvcnQgY29uc3QgQXJyYXlQcm90b3R5cGVKb2luID0gdW5jdXJyeVRoaXMoQXJyYXlQcm90b3R5cGUuam9pbik7XG4vKiogQHR5cGUgezxUPihhcnJheTogQXJyYXk8VD4sIC4uLml0ZW1zOiBUW10pID0+IG51bWJlcn0gKi9cbmV4cG9ydCBjb25zdCBBcnJheVByb3RvdHlwZVB1c2ggPSB1bmN1cnJ5VGhpcyhBcnJheVByb3RvdHlwZS5wdXNoKTtcbi8qKiBAdHlwZSB7KGFycmF5OiBBcnJheTx1bmtub3duPikgPT4gc3RyaW5nfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5UHJvdG90eXBlVG9Mb2NhbGVTdHJpbmcgPSB1bmN1cnJ5VGhpcyhcbiAgQXJyYXlQcm90b3R5cGUudG9Mb2NhbGVTdHJpbmdcbik7XG5cbi8vIE9iamVjdFxuZXhwb3J0IGNvbnN0IE5hdGl2ZU9iamVjdCA9IE9iamVjdDtcbmV4cG9ydCBjb25zdCB7XG4gIGNyZWF0ZTogT2JqZWN0Q3JlYXRlLFxuICBkZWZpbmVQcm9wZXJ0eTogT2JqZWN0RGVmaW5lUHJvcGVydHksXG4gIGZyZWV6ZTogT2JqZWN0RnJlZXplLFxuICBpczogT2JqZWN0SXMsXG59ID0gTmF0aXZlT2JqZWN0O1xuLyoqIEB0eXBlIHsob2JqZWN0OiBvYmplY3QsIGtleTogUHJvcGVydHlLZXkpID0+IGJvb2xlYW59ICovXG5leHBvcnQgY29uc3QgT2JqZWN0SGFzT3duID0gLyoqIEB0eXBlIHthbnl9ICovIChOYXRpdmVPYmplY3QpLmhhc093biB8fFxuICB1bmN1cnJ5VGhpcyhOYXRpdmVPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuLy8gTWF0aFxuZXhwb3J0IGNvbnN0IE1hdGhUcnVuYyA9IE1hdGgudHJ1bmM7XG5cbi8vIEFycmF5QnVmZmVyXG5leHBvcnQgY29uc3QgTmF0aXZlQXJyYXlCdWZmZXIgPSBBcnJheUJ1ZmZlcjtcblxuLy8gVHlwZWRBcnJheVxuLyoqIEB0eXBlZGVmIHtVaW50OEFycmF5fFVpbnQ4Q2xhbXBlZEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fEludDhBcnJheXxJbnQxNkFycmF5fEludDMyQXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheXxCaWdVaW50NjRBcnJheXxCaWdJbnQ2NEFycmF5fSBUeXBlZEFycmF5ICovXG4vKiogQHR5cGUge2FueX0gKi9cbmNvbnN0IFR5cGVkQXJyYXkgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YoVWludDhBcnJheSk7XG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZSA9IFR5cGVkQXJyYXkucHJvdG90eXBlO1xuLyoqIEB0eXBlIHsodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gSXRlcmFibGVJdGVyYXRvcjxudW1iZXI+fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVLZXlzID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5rZXlzKTtcbi8qKiBAdHlwZSB7KHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IEl0ZXJhYmxlSXRlcmF0b3I8bnVtYmVyPn0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlVmFsdWVzID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUudmFsdWVzXG4pO1xuLyoqIEB0eXBlIHsodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gSXRlcmFibGVJdGVyYXRvcjxbbnVtYmVyLCBudW1iZXJdPn0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlRW50cmllcyA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLmVudHJpZXNcbik7XG4vKiogQHR5cGUgeyh0eXBlZEFycmF5OiBUeXBlZEFycmF5LCBhcnJheTogQXJyYXlMaWtlPG51bWJlcj4sIG9mZnNldD86IG51bWJlcikgPT4gdm9pZH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlU2V0ID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5zZXQpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVJldmVyc2UgPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS5yZXZlcnNlXG4pO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHZhbHVlOiBudW1iZXIsIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUZpbGwgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLmZpbGwpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHRhcmdldDogbnVtYmVyLCBzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUNvcHlXaXRoaW4gPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS5jb3B5V2l0aGluXG4pO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIGNvbXBhcmVGbj86IChhOiBudW1iZXIsIGI6IG51bWJlcikgPT4gbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVTb3J0ID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5zb3J0KTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUuc2xpY2UpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVN1YmFycmF5ID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUuc3ViYXJyYXlcbik7XG4vKiogQHR5cGUgeygodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gQXJyYXlCdWZmZXIpfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIgPSB1bmN1cnJ5VGhpcyhcbiAgUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICAgIFwiYnVmZmVyXCJcbiAgKS5nZXRcbik7XG4vKiogQHR5cGUgeygodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gbnVtYmVyKX0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldCA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBcImJ5dGVPZmZzZXRcIlxuKTtcbi8qKiBAdHlwZSB7KCh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBudW1iZXIpfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGggPSB1bmN1cnJ5VGhpc0dldHRlcihcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgXCJsZW5ndGhcIlxuKTtcbi8qKiBAdHlwZSB7KHRhcmdldDogdW5rbm93bikgPT4gc3RyaW5nfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBTeW1ib2xUb1N0cmluZ1RhZ1xuKTtcblxuLy8gVWludDE2QXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVVaW50MTZBcnJheSA9IFVpbnQxNkFycmF5O1xuZXhwb3J0IGNvbnN0IFVpbnQxNkFycmF5RnJvbSA9IFR5cGVkQXJyYXkuZnJvbS5iaW5kKE5hdGl2ZVVpbnQxNkFycmF5KTtcblxuLy8gVWludDMyQXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVVaW50MzJBcnJheSA9IFVpbnQzMkFycmF5O1xuXG4vLyBGbG9hdDMyQXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVGbG9hdDMyQXJyYXkgPSBGbG9hdDMyQXJyYXk7XG5cbi8vIEl0ZXJhdG9yXG5leHBvcnQgY29uc3QgSXRlcmF0b3JQcm90b3R5cGUgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YoXG4gIFJlZmxlY3RHZXRQcm90b3R5cGVPZihbXVtTeW1ib2xJdGVyYXRvcl0oKSlcbik7XG5cbi8vIEdlbmVyYXRvclxuY29uc3QgR2VuZXJhdG9yUHJvdG90eXBlID0gKGZ1bmN0aW9uKiAoKSB7fSkuY29uc3RydWN0b3IucHJvdG90eXBlLnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7PFQgPSB1bmtub3duLCBUUmV0dXJuID0gYW55LCBUTmV4dCA9IHVua25vd24+KGdlbmVyYXRvcjogR2VuZXJhdG9yPFQsIFRSZXR1cm4sIFROZXh0PiwgdmFsdWU/OiBUTmV4dCkgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBHZW5lcmF0b3JQcm90b3R5cGVOZXh0ID0gdW5jdXJyeVRoaXMoR2VuZXJhdG9yUHJvdG90eXBlLm5leHQpO1xuXG4vLyBEYXRhVmlld1xuY29uc3QgRGF0YVZpZXdQcm90b3R5cGUgPSBEYXRhVmlldy5wcm90b3R5cGU7XG4vKiogQHR5cGUgeyhkYXRhVmlldzogRGF0YVZpZXcsIGJ5dGVPZmZzZXQ6IG51bWJlciwgbGl0dGxlRW5kaWFuPzogYm9vbGVhbikgPT4gbnVtYmVyfSAqL1xuZXhwb3J0IGNvbnN0IERhdGFWaWV3UHJvdG90eXBlR2V0VWludDE2ID0gdW5jdXJyeVRoaXMoXG4gIERhdGFWaWV3UHJvdG90eXBlLmdldFVpbnQxNlxuKTtcbi8qKiBAdHlwZSB7KGRhdGFWaWV3OiBEYXRhVmlldywgYnl0ZU9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBsaXR0bGVFbmRpYW4/OiBib29sZWFuKSA9PiB2b2lkfSAqL1xuZXhwb3J0IGNvbnN0IERhdGFWaWV3UHJvdG90eXBlU2V0VWludDE2ID0gdW5jdXJyeVRoaXMoXG4gIERhdGFWaWV3UHJvdG90eXBlLnNldFVpbnQxNlxuKTtcblxuLy8gRXJyb3JcbmV4cG9ydCBjb25zdCBOYXRpdmVUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG5leHBvcnQgY29uc3QgTmF0aXZlUmFuZ2VFcnJvciA9IFJhbmdlRXJyb3I7XG5cbi8vIFNldFxuZXhwb3J0IGNvbnN0IE5hdGl2ZVNldCA9IFNldDtcbmNvbnN0IFNldFByb3RvdHlwZSA9IE5hdGl2ZVNldC5wcm90b3R5cGU7XG4vKiogQHR5cGUgezxUPihzZXQ6IFNldDxUPiwgdmFsdWU6IFQpID0+IFNldDxUPn0gKi9cbmV4cG9ydCBjb25zdCBTZXRQcm90b3R5cGVBZGQgPSB1bmN1cnJ5VGhpcyhTZXRQcm90b3R5cGUuYWRkKTtcbi8qKiBAdHlwZSB7PFQ+KHNldDogU2V0PFQ+LCB2YWx1ZTogVCkgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBTZXRQcm90b3R5cGVIYXMgPSB1bmN1cnJ5VGhpcyhTZXRQcm90b3R5cGUuaGFzKTtcblxuLy8gV2Vha01hcFxuZXhwb3J0IGNvbnN0IE5hdGl2ZVdlYWtNYXAgPSBXZWFrTWFwO1xuY29uc3QgV2Vha01hcFByb3RvdHlwZSA9IE5hdGl2ZVdlYWtNYXAucHJvdG90eXBlO1xuLyoqIEB0eXBlIHs8SyBleHRlbmRzIHt9LCBWPih3ZWFrTWFwOiBXZWFrTWFwPEssIFY+LCBrZXk6IEspID0+IFZ9ICovXG5leHBvcnQgY29uc3QgV2Vha01hcFByb3RvdHlwZUdldCA9IHVuY3VycnlUaGlzKFdlYWtNYXBQcm90b3R5cGUuZ2V0KTtcbi8qKiBAdHlwZSB7PEsgZXh0ZW5kcyB7fSwgVj4od2Vha01hcDogV2Vha01hcDxLLCBWPiwga2V5OiBLLCB2YWx1ZTogVikgPT4gV2Vha01hcH0gKi9cbmV4cG9ydCBjb25zdCBXZWFrTWFwUHJvdG90eXBlU2V0ID0gdW5jdXJyeVRoaXMoV2Vha01hcFByb3RvdHlwZS5zZXQpO1xuIiwiLy8gYWxnb3JpdGhtOiBodHRwOi8vZm94LXRvb2xraXQub3JnL2Z0cC9mYXN0aGFsZmZsb2F0Y29udmVyc2lvbi5wZGZcblxuaW1wb3J0IHtcbiAgTmF0aXZlQXJyYXlCdWZmZXIsXG4gIE5hdGl2ZUZsb2F0MzJBcnJheSxcbiAgTmF0aXZlVWludDMyQXJyYXksXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG5jb25zdCBidWZmZXIgPSBuZXcgTmF0aXZlQXJyYXlCdWZmZXIoNCk7XG5jb25zdCBmbG9hdFZpZXcgPSBuZXcgTmF0aXZlRmxvYXQzMkFycmF5KGJ1ZmZlcik7XG5jb25zdCB1aW50MzJWaWV3ID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KGJ1ZmZlcik7XG5cbmNvbnN0IGJhc2VUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg1MTIpO1xuY29uc3Qgc2hpZnRUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg1MTIpO1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGNvbnN0IGUgPSBpIC0gMTI3O1xuXG4gIC8vIHZlcnkgc21hbGwgbnVtYmVyICgwLCAtMClcbiAgaWYgKGUgPCAtMjcpIHtcbiAgICBiYXNlVGFibGVbaV0gICAgICAgICA9IDB4MDAwMDtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAyNDtcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAyNDtcblxuICAvLyBzbWFsbCBudW1iZXIgKGRlbm9ybSlcbiAgfSBlbHNlIGlmIChlIDwgLTE0KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAgMHgwNDAwID4+ICgtZSAtIDE0KTtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9ICgweDA0MDAgPj4gKC1lIC0gMTQpKSB8IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAtZSAtIDE7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gLWUgLSAxO1xuXG4gIC8vIG5vcm1hbCBudW1iZXJcbiAgfSBlbHNlIGlmIChlIDw9IDE1KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAgKGUgKyAxNSkgPDwgMTA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAoKGUgKyAxNSkgPDwgMTApIHwgMHg4MDAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDEzO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDEzO1xuXG4gIC8vIGxhcmdlIG51bWJlciAoSW5maW5pdHksIC1JbmZpbml0eSlcbiAgfSBlbHNlIGlmIChlIDwgMTI4KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAweDdjMDA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweGZjMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gMjQ7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgLy8gc3RheSAoTmFOLCBJbmZpbml0eSwgLUluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gMHg3YzAwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDEzO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDEzO1xuICB9XG59XG5cbi8qKlxuICogcm91bmQgYSBudW1iZXIgdG8gYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzLlxuICpcbiAqIEBwYXJhbSB7dW5rbm93bn0gbnVtIC0gZG91YmxlIGZsb2F0XG4gKiBAcmV0dXJucyB7bnVtYmVyfSBoYWxmIGZsb2F0IG51bWJlciBiaXRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByb3VuZFRvRmxvYXQxNkJpdHMobnVtKSB7XG4gIGZsb2F0Vmlld1swXSA9IC8qKiBAdHlwZSB7YW55fSAqLyAobnVtKTtcbiAgY29uc3QgZiA9IHVpbnQzMlZpZXdbMF07XG4gIGNvbnN0IGUgPSAoZiA+PiAyMykgJiAweDFmZjtcbiAgcmV0dXJuIGJhc2VUYWJsZVtlXSArICgoZiAmIDB4MDA3ZmZmZmYpID4+IHNoaWZ0VGFibGVbZV0pO1xufVxuXG5jb25zdCBtYW50aXNzYVRhYmxlID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KDIwNDgpO1xuY29uc3QgZXhwb25lbnRUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg2NCk7XG5jb25zdCBvZmZzZXRUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg2NCk7XG5cbm1hbnRpc3NhVGFibGVbMF0gPSAwO1xuZm9yIChsZXQgaSA9IDE7IGkgPCAxMDI0OyArK2kpIHtcbiAgbGV0IG0gPSBpIDw8IDEzOyAgICAvLyB6ZXJvIHBhZCBtYW50aXNzYSBiaXRzXG4gIGxldCBlID0gMDsgICAgICAgICAgLy8gemVybyBleHBvbmVudFxuXG4gIC8vIG5vcm1hbGl6ZWRcbiAgd2hpbGUoKG0gJiAweDAwODAwMDAwKSA9PT0gMCkge1xuICAgIGUgLT0gMHgwMDgwMDAwMDsgIC8vIGRlY3JlbWVudCBleHBvbmVudFxuICAgIG0gPDw9IDE7XG4gIH1cblxuICBtICY9IH4weDAwODAwMDAwOyAgIC8vIGNsZWFyIGxlYWRpbmcgMSBiaXRcbiAgZSArPSAweDM4ODAwMDAwOyAgICAvLyBhZGp1c3QgYmlhc1xuXG4gIG1hbnRpc3NhVGFibGVbaV0gPSBtIHwgZTtcbn1cbmZvciAobGV0IGkgPSAxMDI0OyBpIDwgMjA0ODsgKytpKSB7XG4gIG1hbnRpc3NhVGFibGVbaV0gPSAweDM4MDAwMDAwICsgKChpIC0gMTAyNCkgPDwgMTMpO1xufVxuXG5leHBvbmVudFRhYmxlWzBdID0gMDtcbmZvciAobGV0IGkgPSAxOyBpIDwgMzE7ICsraSkge1xuICBleHBvbmVudFRhYmxlW2ldID0gaSA8PCAyMztcbn1cbmV4cG9uZW50VGFibGVbMzFdID0gMHg0NzgwMDAwMDtcbmV4cG9uZW50VGFibGVbMzJdID0gMHg4MDAwMDAwMDtcbmZvciAobGV0IGkgPSAzMzsgaSA8IDYzOyArK2kpIHtcbiAgZXhwb25lbnRUYWJsZVtpXSA9IDB4ODAwMDAwMDAgKyAoKGkgLSAzMikgPDwgMjMpO1xufVxuZXhwb25lbnRUYWJsZVs2M10gPSAweGM3ODAwMDAwO1xuXG5vZmZzZXRUYWJsZVswXSA9IDA7XG5mb3IgKGxldCBpID0gMTsgaSA8IDY0OyArK2kpIHtcbiAgaWYgKGkgPT09IDMyKSB7XG4gICAgb2Zmc2V0VGFibGVbaV0gPSAwO1xuICB9IGVsc2Uge1xuICAgIG9mZnNldFRhYmxlW2ldID0gMTAyNDtcbiAgfVxufVxuXG4vKipcbiAqIGNvbnZlcnQgYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBmbG9hdDE2Yml0cyAtIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGRvdWJsZSBmbG9hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzKSB7XG4gIGNvbnN0IG0gPSBmbG9hdDE2Yml0cyA+PiAxMDtcbiAgdWludDMyVmlld1swXSA9IG1hbnRpc3NhVGFibGVbb2Zmc2V0VGFibGVbbV0gKyAoZmxvYXQxNmJpdHMgJiAweDNmZildICsgZXhwb25lbnRUYWJsZVttXTtcbiAgcmV0dXJuIGZsb2F0Vmlld1swXTtcbn1cbiIsImV4cG9ydCBjb25zdCBDT05TVFJVQ1RPUl9JU19OT1RfQV9PQkpFQ1QgPSBcIkNvbnN0cnVjdG9yIGlzIG5vdCBhIG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IFRISVNfSVNfTk9UX0FfT0JKRUNUID0gXCJUaGlzIGlzIG5vdCBhIG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IFRISVNfSVNfTk9UX0FfRkxPQVQxNkFSUkFZID0gXCJUaGlzIGlzIG5vdCBhIEZsb2F0MTZBcnJheVwiO1xuZXhwb3J0IGNvbnN0IFRISVNfQ09OU1RSVUNUT1JfSVNfTk9UX0FfU1VCQ0xBU1NfT0ZfRkxPQVQxNkFSUkFZID1cbiAgXCJUaGlzIGNvbnN0cnVjdG9yIGlzIG5vdCBhIHN1YmNsYXNzIG9mIEZsb2F0MTZBcnJheVwiO1xuZXhwb3J0IGNvbnN0IFNQRUNJRVNDT05TVFJVQ1RPUl9ESUROVF9SRVRVUk5fVFlQRURBUlJBWSA9XG4gIFwiU3BlY2llc0NvbnN0cnVjdG9yIGRpZG4ndCByZXR1cm4gVHlwZWRBcnJheVwiO1xuZXhwb3J0IGNvbnN0IENBTk5PVF9DT05WRVJUX1VOREVGSU5FRF9PUl9OVUxMX1RPX09CSkVDVCA9XG4gIFwiQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgQ0FOTk9UX0NPTlZFUlRfQV9CSUdJTlRfVkFMVUVfVE9fQV9OVU1CRVIgPVxuICBcIkNhbm5vdCBjb252ZXJ0IGEgQmlnSW50IHZhbHVlIHRvIGEgbnVtYmVyXCI7XG5leHBvcnQgY29uc3QgQ0FOTk9UX01JWF9CSUdJTlRfQU5EX09USEVSX1RZUEVTID1cbiAgXCJDYW5ub3QgbWl4IEJpZ0ludCBhbmQgb3RoZXIgdHlwZXMsIHVzZSBleHBsaWNpdCBjb252ZXJzaW9uc1wiO1xuZXhwb3J0IGNvbnN0IFJFRFVDRV9PRl9FTVBUWV9BUlJBWV9XSVRIX05PX0lOSVRJQUxfVkFMVUUgPVxuICBcIlJlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWVcIjtcbmV4cG9ydCBjb25zdCBPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyA9IFwiT2Zmc2V0IGlzIG91dCBvZiBib3VuZHNcIjtcbiIsImltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHsgQ0FOTk9UX0NPTlZFUlRfQV9CSUdJTlRfVkFMVUVfVE9fQV9OVU1CRVIgfSBmcm9tIFwiLi9fdXRpbC9tZXNzYWdlcy5tanNcIjtcbmltcG9ydCB7XG4gIE5hdGl2ZU51bWJlcixcbiAgTmF0aXZlVHlwZUVycm9yLFxuICBOdW1iZXJJc0Zpbml0ZSxcbn0gZnJvbSBcIi4vX3V0aWwvcHJpbW9yZGlhbHMubWpzXCI7XG5cbi8qKlxuICogcmV0dXJucyB0aGUgbmVhcmVzdCBoYWxmIHByZWNpc2lvbiBmbG9hdCByZXByZXNlbnRhdGlvbiBvZiBhIG51bWJlci5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaGZyb3VuZChudW0pIHtcbiAgaWYgKHR5cGVvZiBudW0gPT09IFwiYmlnaW50XCIpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ0FOTk9UX0NPTlZFUlRfQV9CSUdJTlRfVkFMVUVfVE9fQV9OVU1CRVIpO1xuICB9XG5cbiAgbnVtID0gTmF0aXZlTnVtYmVyKG51bSk7XG5cbiAgLy8gZm9yIG9wdGltaXphdGlvblxuICBpZiAoIU51bWJlcklzRmluaXRlKG51bSkgfHwgbnVtID09PSAwKSB7XG4gICAgcmV0dXJuIG51bTtcbiAgfVxuXG4gIGNvbnN0IHgxNiA9IHJvdW5kVG9GbG9hdDE2Qml0cyhudW0pO1xuICByZXR1cm4gY29udmVydFRvTnVtYmVyKHgxNik7XG59XG4iLCJpbXBvcnQge1xuICBHZW5lcmF0b3JQcm90b3R5cGVOZXh0LFxuICBJdGVyYXRvclByb3RvdHlwZSxcbiAgTmF0aXZlV2Vha01hcCxcbiAgT2JqZWN0Q3JlYXRlLFxuICBTeW1ib2xUb1N0cmluZ1RhZyxcbiAgV2Vha01hcFByb3RvdHlwZUdldCxcbiAgV2Vha01hcFByb3RvdHlwZVNldCxcbn0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbi8qKiBAdHlwZSB7V2Vha01hcDx7fSwgR2VuZXJhdG9yPGFueT4+fSAqL1xuY29uc3QgZ2VuZXJhdG9ycyA9IG5ldyBOYXRpdmVXZWFrTWFwKCk7XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJWFycmF5aXRlcmF0b3Jwcm90b3R5cGUlLW9iamVjdCAqL1xuY29uc3QgQXJyYXlJdGVyYXRvclByb3RvdHlwZSA9IE9iamVjdENyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge1xuICBuZXh0OiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICBjb25zdCBnZW5lcmF0b3IgPSBXZWFrTWFwUHJvdG90eXBlR2V0KGdlbmVyYXRvcnMsIHRoaXMpO1xuICAgICAgcmV0dXJuIEdlbmVyYXRvclByb3RvdHlwZU5leHQoZ2VuZXJhdG9yKTtcbiAgICB9LFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgfSxcblxuICBbU3ltYm9sVG9TdHJpbmdUYWddOiB7XG4gICAgdmFsdWU6IFwiQXJyYXkgSXRlcmF0b3JcIixcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gIH0sXG59KTtcblxuLyoqIEB0eXBlIHs8VD4oZ2VuZXJhdG9yOiBHZW5lcmF0b3I8VD4pID0+IEl0ZXJhYmxlSXRlcmF0b3I8VD59ICovXG5leHBvcnQgZnVuY3Rpb24gd3JhcEluQXJyYXlJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgY29uc3QgYXJyYXlJdGVyYXRvciA9IE9iamVjdENyZWF0ZShBcnJheUl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgV2Vha01hcFByb3RvdHlwZVNldChnZW5lcmF0b3JzLCBhcnJheUl0ZXJhdG9yLCBnZW5lcmF0b3IpO1xuICByZXR1cm4gYXJyYXlJdGVyYXRvcjtcbn1cbiIsImltcG9ydCB7XG4gIEFycmF5SXNBcnJheSxcbiAgTWF0aFRydW5jLFxuICBOYXRpdmVOdW1iZXIsXG4gIE51bWJlcklzRmluaXRlLFxuICBTeW1ib2xJdGVyYXRvcixcbiAgU3ltYm9sVG9TdHJpbmdUYWcsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyxcbn0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHt9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHx8XG4gICAgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHt9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCI7XG59XG5cbi8vIEluc3BpcmVkIGJ5IHV0aWwudHlwZXMgaW1wbGVtZW50YXRpb24gb2YgTm9kZS5qc1xuLyoqIEB0eXBlZGVmIHtVaW50OEFycmF5fFVpbnQ4Q2xhbXBlZEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fEludDhBcnJheXxJbnQxNkFycmF5fEludDMyQXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheXxCaWdVaW50NjRBcnJheXxCaWdJbnQ2NEFycmF5fSBUeXBlZEFycmF5ICovXG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIFR5cGVkQXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyh2YWx1ZSkgIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgQmlnSW50NjRBcnJheXxCaWdVaW50NjRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQmlnSW50VHlwZWRBcnJheSh2YWx1ZSkge1xuICBjb25zdCB0eXBlZEFycmF5TmFtZSA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyh2YWx1ZSk7XG4gIHJldHVybiB0eXBlZEFycmF5TmFtZSA9PT0gXCJCaWdJbnQ2NEFycmF5XCIgfHxcbiAgICB0eXBlZEFycmF5TmFtZSA9PT0gXCJCaWdVaW50NjRBcnJheVwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBBcnJheUJ1ZmZlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgdmFsdWVbU3ltYm9sVG9TdHJpbmdUYWddID09PSBcIkFycmF5QnVmZmVyXCI7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIFNoYXJlZEFycmF5QnVmZmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTaGFyZWRBcnJheUJ1ZmZlcih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIHZhbHVlW1N5bWJvbFRvU3RyaW5nVGFnXSA9PT0gXCJTaGFyZWRBcnJheUJ1ZmZlclwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBJdGVyYWJsZTx1bmtub3duPn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSXRlcmFibGUodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZVtTeW1ib2xJdGVyYXRvcl0gPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgdW5rbm93bltdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPcmRpbmFyeUFycmF5KHZhbHVlKSB7XG4gIGlmICghQXJyYXlJc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gdmFsdWVbU3ltYm9sSXRlcmF0b3JdKCk7XG4gIGlmIChpdGVyYXRvcltTeW1ib2xUb1N0cmluZ1RhZ10gIT09IFwiQXJyYXkgSXRlcmF0b3JcIikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBUeXBlZEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPcmRpbmFyeVR5cGVkQXJyYXkodmFsdWUpIHtcbiAgaWYgKCFpc1R5cGVkQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaXRlcmF0b3IgPSB2YWx1ZVtTeW1ib2xJdGVyYXRvcl0oKTtcbiAgaWYgKGl0ZXJhdG9yW1N5bWJvbFRvU3RyaW5nVGFnXSAhPT0gXCJBcnJheSBJdGVyYXRvclwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHN0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBudW1iZXIgPSBOYXRpdmVOdW1iZXIodmFsdWUpO1xuICBpZiAodmFsdWUgIT09IG51bWJlciArIFwiXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU51bWJlcklzRmluaXRlKG51bWJlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAobnVtYmVyICE9PSBNYXRoVHJ1bmMobnVtYmVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuIiwiaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tIFwiLi9pcy5tanNcIjtcbmltcG9ydCB7XG4gIENBTk5PVF9DT05WRVJUX0FfQklHSU5UX1ZBTFVFX1RPX0FfTlVNQkVSLFxuICBDT05TVFJVQ1RPUl9JU19OT1RfQV9PQkpFQ1QsXG4gIFRISVNfSVNfTk9UX0FfT0JKRUNULFxufSBmcm9tIFwiLi9tZXNzYWdlcy5tanNcIjtcbmltcG9ydCB7XG4gIE1hdGhUcnVuYyxcbiAgTmF0aXZlTnVtYmVyLFxuICBOYXRpdmVUeXBlRXJyb3IsXG4gIE51bWJlcklzTmFOLFxuICBPYmplY3RJcyxcbiAgU3ltYm9sU3BlY2llcyxcbn0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvaW50ZWdlcm9yaW5maW5pdHlcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gVG9JbnRlZ2VyT3JJbmZpbml0eSh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwiYmlnaW50XCIpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ0FOTk9UX0NPTlZFUlRfQV9CSUdJTlRfVkFMVUVfVE9fQV9OVU1CRVIpO1xuICB9XG5cbiAgY29uc3QgbnVtYmVyID0gTmF0aXZlTnVtYmVyKHRhcmdldCk7XG5cbiAgaWYgKE51bWJlcklzTmFOKG51bWJlcikgfHwgbnVtYmVyID09PSAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gTWF0aFRydW5jKG51bWJlcik7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvbGVuZ3RoXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gVG9MZW5ndGgodGFyZ2V0KSB7XG4gIGNvbnN0IGxlbmd0aCA9IFRvSW50ZWdlck9ySW5maW5pdHkodGFyZ2V0KTtcbiAgaWYgKGxlbmd0aCA8IDApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiBsZW5ndGggPCBOYXRpdmVOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICAgID8gbGVuZ3RoXG4gICAgOiBOYXRpdmVOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtbGVuZ3Rob2ZhcnJheWxpa2VcbiAqIEBwYXJhbSB7b2JqZWN0fSBhcnJheUxpa2VcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBMZW5ndGhPZkFycmF5TGlrZShhcnJheUxpa2UpIHtcbiAgaWYgKCFpc09iamVjdChhcnJheUxpa2UpKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFRISVNfSVNfTk9UX0FfT0JKRUNUKTtcbiAgfVxuXG4gIHJldHVybiBUb0xlbmd0aCgvKiogQHR5cGUge2FueX0gKi8gKGFycmF5TGlrZSkubGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtc3BlY2llc2NvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0XG4gKiBAcGFyYW0ge3sgbmV3KC4uLmFyZ3M6IGFueVtdKTogYW55OyB9fSBkZWZhdWx0Q29uc3RydWN0b3JcbiAqIEByZXR1cm5zIHt7IG5ldyguLi5hcmdzOiBhbnlbXSk6IGFueTsgfX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFNwZWNpZXNDb25zdHJ1Y3Rvcih0YXJnZXQsIGRlZmF1bHRDb25zdHJ1Y3Rvcikge1xuICBpZiAoIWlzT2JqZWN0KHRhcmdldCkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhJU19JU19OT1RfQV9PQkpFQ1QpO1xuICB9XG5cbiAgY29uc3QgY29uc3RydWN0b3IgPSB0YXJnZXQuY29uc3RydWN0b3I7XG4gIGlmIChjb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRDb25zdHJ1Y3RvcjtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KGNvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihDT05TVFJVQ1RPUl9JU19OT1RfQV9PQkpFQ1QpO1xuICB9XG5cbiAgY29uc3Qgc3BlY2llcyA9IGNvbnN0cnVjdG9yW1N5bWJvbFNwZWNpZXNdO1xuICBpZiAoc3BlY2llcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRDb25zdHJ1Y3RvcjtcbiAgfVxuXG4gIHJldHVybiBzcGVjaWVzO1xufVxuXG4vKipcbiAqIGJpZ2ludCBjb21wYXJpc29ucyBhcmUgbm90IHN1cHBvcnRlZFxuICpcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNvcnRcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gKiBAcGFyYW0ge251bWJlcn0geVxuICogQHJldHVybnMgey0xIHwgMCB8IDF9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0Q29tcGFyZSh4LCB5KSB7XG4gIGNvbnN0IGlzTmFOX3ggPSBOdW1iZXJJc05hTih4KTtcbiAgY29uc3QgaXNOYU5feSA9IE51bWJlcklzTmFOKHkpO1xuXG4gIGlmIChpc05hTl94ICYmIGlzTmFOX3kpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChpc05hTl94KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICBpZiAoaXNOYU5feSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmICh4IDwgeSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmICh4ID4geSkge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCkge1xuICAgIGNvbnN0IGlzUGx1c1plcm9feCA9IE9iamVjdElzKHgsIDApO1xuICAgIGNvbnN0IGlzUGx1c1plcm9feSA9IE9iamVjdElzKHksIDApO1xuXG4gICAgaWYgKCFpc1BsdXNaZXJvX3ggJiYgaXNQbHVzWmVyb195KSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKGlzUGx1c1plcm9feCAmJiAhaXNQbHVzWmVyb195KSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cbiIsImltcG9ydCB7IHdyYXBJbkFycmF5SXRlcmF0b3IgfSBmcm9tIFwiLi9fdXRpbC9hcnJheUl0ZXJhdG9yLm1qc1wiO1xuaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9fdXRpbC9jb252ZXJ0ZXIubWpzXCI7XG5pbXBvcnQge1xuICBpc0FycmF5QnVmZmVyLFxuICBpc0JpZ0ludFR5cGVkQXJyYXksXG4gIGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nLFxuICBpc0l0ZXJhYmxlLFxuICBpc09iamVjdCxcbiAgaXNPYmplY3RMaWtlLFxuICBpc09yZGluYXJ5QXJyYXksXG4gIGlzT3JkaW5hcnlUeXBlZEFycmF5LFxuICBpc1NoYXJlZEFycmF5QnVmZmVyLFxuICBpc1R5cGVkQXJyYXksXG59IGZyb20gXCIuL191dGlsL2lzLm1qc1wiO1xuaW1wb3J0IHtcbiAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNULFxuICBDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVMsXG4gIENPTlNUUlVDVE9SX0lTX05PVF9BX09CSkVDVCxcbiAgT0ZGU0VUX0lTX09VVF9PRl9CT1VORFMsXG4gIFJFRFVDRV9PRl9FTVBUWV9BUlJBWV9XSVRIX05PX0lOSVRJQUxfVkFMVUUsXG4gIFNQRUNJRVNDT05TVFJVQ1RPUl9ESUROVF9SRVRVUk5fVFlQRURBUlJBWSxcbiAgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVksXG4gIFRISVNfSVNfTk9UX0FfRkxPQVQxNkFSUkFZLFxufSBmcm9tIFwiLi9fdXRpbC9tZXNzYWdlcy5tanNcIjtcbmltcG9ydCB7XG4gIEFycmF5UHJvdG90eXBlSm9pbixcbiAgQXJyYXlQcm90b3R5cGVQdXNoLFxuICBBcnJheVByb3RvdHlwZVRvTG9jYWxlU3RyaW5nLFxuICBOYXRpdmVBcnJheUJ1ZmZlcixcbiAgTmF0aXZlT2JqZWN0LFxuICBOYXRpdmVQcm94eSxcbiAgTmF0aXZlUmFuZ2VFcnJvcixcbiAgTmF0aXZlU2V0LFxuICBOYXRpdmVUeXBlRXJyb3IsXG4gIE5hdGl2ZVVpbnQxNkFycmF5LFxuICBOYXRpdmVXZWFrTWFwLFxuICBOdW1iZXJJc05hTixcbiAgT2JqZWN0RGVmaW5lUHJvcGVydHksXG4gIE9iamVjdEZyZWV6ZSxcbiAgT2JqZWN0SGFzT3duLFxuICBSZWZsZWN0QXBwbHksXG4gIFJlZmxlY3RHZXQsXG4gIFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIFJlZmxlY3RHZXRQcm90b3R5cGVPZixcbiAgUmVmbGVjdEhhcyxcbiAgUmVmbGVjdE93bktleXMsXG4gIFJlZmxlY3RTZXQsXG4gIFJlZmxlY3RTZXRQcm90b3R5cGVPZixcbiAgU2V0UHJvdG90eXBlQWRkLFxuICBTZXRQcm90b3R5cGVIYXMsXG4gIFN5bWJvbEZvcixcbiAgU3ltYm9sSXRlcmF0b3IsXG4gIFN5bWJvbFRvU3RyaW5nVGFnLFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBUeXBlZEFycmF5UHJvdG90eXBlQ29weVdpdGhpbixcbiAgVHlwZWRBcnJheVByb3RvdHlwZUVudHJpZXMsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVGaWxsLFxuICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyLFxuICBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUtleXMsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVSZXZlcnNlLFxuICBUeXBlZEFycmF5UHJvdG90eXBlU2V0LFxuICBUeXBlZEFycmF5UHJvdG90eXBlU2xpY2UsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVTb3J0LFxuICBUeXBlZEFycmF5UHJvdG90eXBlU3ViYXJyYXksXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVWYWx1ZXMsXG4gIFVpbnQxNkFycmF5RnJvbSxcbiAgV2Vha01hcFByb3RvdHlwZUdldCxcbiAgV2Vha01hcFByb3RvdHlwZVNldCxcbn0gZnJvbSBcIi4vX3V0aWwvcHJpbW9yZGlhbHMubWpzXCI7XG5pbXBvcnQge1xuICBMZW5ndGhPZkFycmF5TGlrZSxcbiAgU3BlY2llc0NvbnN0cnVjdG9yLFxuICBUb0ludGVnZXJPckluZmluaXR5LFxuICBkZWZhdWx0Q29tcGFyZSxcbn0gZnJvbSBcIi4vX3V0aWwvc3BlYy5tanNcIjtcblxuY29uc3QgYnJhbmQgPSBTeW1ib2xGb3IoXCJfX0Zsb2F0MTZBcnJheV9fXCIpO1xuXG4vKiogQHR5cGUge1dlYWtNYXA8RmxvYXQxNkFycmF5LCBVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfT59ICovXG5jb25zdCB0YXJnZXRzID0gbmV3IE5hdGl2ZVdlYWtNYXAoKTtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGhhc0Zsb2F0MTZBcnJheUJyYW5kKHRhcmdldCkge1xuICBpZiAoIWlzT2JqZWN0TGlrZSh0YXJnZXQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcHJvdG90eXBlID0gUmVmbGVjdEdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gIGlmICghaXNPYmplY3RMaWtlKHByb3RvdHlwZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBjb25zdHJ1Y3RvciA9IHByb3RvdHlwZS5jb25zdHJ1Y3RvcjtcbiAgaWYgKGNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCFpc09iamVjdChjb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ09OU1RSVUNUT1JfSVNfTk9UX0FfT0JKRUNUKTtcbiAgfVxuXG4gIHJldHVybiBSZWZsZWN0SGFzKGNvbnN0cnVjdG9yLCBicmFuZCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHt0YXJnZXQgaXMgRmxvYXQxNkFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGbG9hdDE2QXJyYXkodGFyZ2V0KSB7XG4gIHJldHVybiBoYXNGbG9hdDE2QXJyYXlCcmFuZCh0YXJnZXQpICYmICFpc1R5cGVkQXJyYXkodGFyZ2V0KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge2Fzc2VydHMgdGFyZ2V0IGlzIEZsb2F0MTZBcnJheX1cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0RmxvYXQxNkFycmF5KHRhcmdldCkge1xuICBpZiAoIWlzRmxvYXQxNkFycmF5KHRhcmdldCkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhJU19JU19OT1RfQV9GTE9BVDE2QVJSQVkpO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEByZXR1cm5zIHthc3NlcnRzIHRhcmdldCBpcyBVaW50OEFycmF5fFVpbnQ4Q2xhbXBlZEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fEludDhBcnJheXxJbnQxNkFycmF5fEludDMyQXJyYXl8RmxvYXQxNkFycmF5fEZsb2F0MzJBcnJheXxGbG9hdDY0QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KHRhcmdldCkge1xuICBpZiAoaXNGbG9hdDE2QXJyYXkodGFyZ2V0KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghaXNUeXBlZEFycmF5KHRhcmdldCkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoU1BFQ0lFU0NPTlNUUlVDVE9SX0RJRE5UX1JFVFVSTl9UWVBFREFSUkFZKTtcbiAgfVxuXG4gIGlmIChpc0JpZ0ludFR5cGVkQXJyYXkodGFyZ2V0KSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgIENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFU1xuICAgICk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge0Zsb2F0MTZBcnJheX0gZmxvYXQxNlxuICogQHJldHVybnMge1VpbnQxNkFycmF5ICYgeyBfX2Zsb2F0MTZiaXRzOiBuZXZlciB9fVxuICovXG5mdW5jdGlvbiBnZXRGbG9hdDE2Qml0c0FycmF5KGZsb2F0MTYpIHtcbiAgY29uc3QgdGFyZ2V0ID0gV2Vha01hcFByb3RvdHlwZUdldCh0YXJnZXRzLCBmbG9hdDE2KTtcbiAgaWYgKHRhcmdldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIC8vIGZyb20gYW5vdGhlciBGbG9hdDE2QXJyYXkgaW5zdGFuY2UgKGEgZGlmZmVyZW50IHZlcnNpb24/KVxuICBjb25zdCBjbG9uZWQgPSBuZXcgRmxvYXQxNkFycmF5KFxuICAgIGZsb2F0MTYuYnVmZmVyLFxuICAgIGZsb2F0MTYuYnl0ZU9mZnNldCxcbiAgICBmbG9hdDE2Lmxlbmd0aFxuICApO1xuICByZXR1cm4gV2Vha01hcFByb3RvdHlwZUdldCh0YXJnZXRzLCBjbG9uZWQpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7VWludDE2QXJyYXkgJiB7IF9fZmxvYXQxNmJpdHM6IG5ldmVyIH19IGZsb2F0MTZiaXRzQXJyYXlcbiAqIEByZXR1cm5zIHtudW1iZXJbXX1cbiAqL1xuZnVuY3Rpb24gY29weVRvQXJyYXkoZmxvYXQxNmJpdHNBcnJheSkge1xuICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gIGNvbnN0IGFycmF5ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBhcnJheVtpXSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgfVxuXG4gIHJldHVybiBhcnJheTtcbn1cblxuY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUdldHRlcnMgPSBuZXcgTmF0aXZlU2V0KCk7XG5mb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0T3duS2V5cyhUeXBlZEFycmF5UHJvdG90eXBlKSkge1xuICAvLyBAQHRvU3RyaW5nVGFnIG1ldGhvZCBpcyBkZWZpbmVkIGluIEZsb2F0MTZBcnJheS5wcm90b3R5cGVcbiAgaWYgKGtleSA9PT0gU3ltYm9sVG9TdHJpbmdUYWcpIHtcbiAgICBjb250aW51ZTtcbiAgfVxuXG4gIGNvbnN0IGRlc2NyaXB0b3IgPSBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFR5cGVkQXJyYXlQcm90b3R5cGUsIGtleSk7XG4gIGlmIChPYmplY3RIYXNPd24oZGVzY3JpcHRvciwgXCJnZXRcIikpIHtcbiAgICBTZXRQcm90b3R5cGVBZGQoVHlwZWRBcnJheVByb3RvdHlwZUdldHRlcnMsIGtleSk7XG4gIH1cbn1cblxuLyoqIEB0eXBlIHtQcm94eUhhbmRsZXI8RmxvYXQxNkFycmF5Pn0gKi9cbmNvbnN0IGhhbmRsZXIgPSBPYmplY3RGcmVlemUoe1xuICBnZXQodGFyZ2V0LCBrZXksIHJlY2VpdmVyKSB7XG4gICAgaWYgKGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKGtleSkgJiYgT2JqZWN0SGFzT3duKHRhcmdldCwga2V5KSkge1xuICAgICAgcmV0dXJuIGNvbnZlcnRUb051bWJlcihSZWZsZWN0R2V0KHRhcmdldCwga2V5KSk7XG4gICAgfVxuXG4gICAgLy8gJVR5cGVkQXJyYXklLnByb3RvdHlwZSBnZXR0ZXIgcHJvcGVydGllcyBjYW5ub3QgY2FsbGVkIGJ5IFByb3h5IHJlY2VpdmVyXG4gICAgaWYgKFNldFByb3RvdHlwZUhhcyhUeXBlZEFycmF5UHJvdG90eXBlR2V0dGVycywga2V5KSkge1xuICAgICAgcmV0dXJuIFJlZmxlY3RHZXQodGFyZ2V0LCBrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0R2V0KHRhcmdldCwga2V5LCByZWNlaXZlcik7XG4gIH0sXG5cbiAgc2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICBpZiAoaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcoa2V5KSAmJiBPYmplY3RIYXNPd24odGFyZ2V0LCBrZXkpKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdFNldCh0YXJnZXQsIGtleSwgcm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZmxlY3RTZXQodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcik7XG4gIH0sXG59KTtcblxuLyoqIGxpbWl0YXRpb246IGBPYmplY3QuZ2V0UHJvdG90eXBlT2YoRmxvYXQxNkFycmF5KWAgcmV0dXJucyBgVWludDE2QXJyYXlgICovXG5leHBvcnQgY2xhc3MgRmxvYXQxNkFycmF5IGV4dGVuZHMgTmF0aXZlVWludDE2QXJyYXkge1xuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXR5cGVkYXJyYXkgKi9cbiAgY29uc3RydWN0b3IoaW5wdXQsIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICAgIGlmIChpc0Zsb2F0MTZBcnJheShpbnB1dCkpIHtcbiAgICAgIC8vIHBlZWwgb2ZmIFByb3h5XG4gICAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShpbnB1dCk7XG4gICAgICBzdXBlcihmbG9hdDE2Yml0c0FycmF5KTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGlucHV0KSAmJiAhaXNBcnJheUJ1ZmZlcihpbnB1dCkpIHsgLy8gb2JqZWN0IHdpdGhvdXQgQXJyYXlCdWZmZXJcbiAgICAgIC8qKiBAdHlwZSB7QXJyYXlMaWtlPHVua25vd24+fSAqL1xuICAgICAgbGV0IGxpc3Q7XG4gICAgICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgICAgIGxldCBsZW5ndGg7XG5cbiAgICAgIGlmIChpc1R5cGVkQXJyYXkoaW5wdXQpKSB7IC8vIFR5cGVkQXJyYXlcbiAgICAgICAgaWYgKGlzQmlnSW50VHlwZWRBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgICAgICBDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVNcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgbGlzdCA9IGlucHV0O1xuICAgICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGlucHV0KTtcblxuICAgICAgICBjb25zdCBidWZmZXIgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGlucHV0KTtcbiAgICAgICAgY29uc3QgQnVmZmVyQ29uc3RydWN0b3IgPSAhaXNTaGFyZWRBcnJheUJ1ZmZlcihidWZmZXIpXG4gICAgICAgICAgPyAvKiogQHR5cGUge0FycmF5QnVmZmVyQ29uc3RydWN0b3J9ICovIChTcGVjaWVzQ29uc3RydWN0b3IoXG4gICAgICAgICAgICBidWZmZXIsXG4gICAgICAgICAgICBOYXRpdmVBcnJheUJ1ZmZlclxuICAgICAgICAgICkpXG4gICAgICAgICAgOiBOYXRpdmVBcnJheUJ1ZmZlcjtcbiAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBCdWZmZXJDb25zdHJ1Y3RvcihcbiAgICAgICAgICBsZW5ndGggKiBGbG9hdDE2QXJyYXkuQllURVNfUEVSX0VMRU1FTlRcbiAgICAgICAgKTtcbiAgICAgICAgc3VwZXIoZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKGlzSXRlcmFibGUoaW5wdXQpKSB7IC8vIEl0ZXJhYmxlIChBcnJheSlcbiAgICAgICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgICAgICBpZiAoaXNPcmRpbmFyeUFycmF5KGlucHV0KSkge1xuICAgICAgICAgIGxpc3QgPSBpbnB1dDtcbiAgICAgICAgICBsZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gICAgICAgICAgc3VwZXIobGVuZ3RoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaXN0ID0gWy4uLmlucHV0XTtcbiAgICAgICAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgICAgICBzdXBlcihsZW5ndGgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgeyAvLyBBcnJheUxpa2VcbiAgICAgICAgbGlzdCA9IC8qKiBAdHlwZSB7QXJyYXlMaWtlPHVua25vd24+fSAqLyAoaW5wdXQpO1xuICAgICAgICBsZW5ndGggPSBMZW5ndGhPZkFycmF5TGlrZShpbnB1dCk7XG4gICAgICAgIHN1cGVyKGxlbmd0aCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNldCB2YWx1ZXNcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgLy8gc3VwZXIgKFVpbnQxNkFycmF5KVxuICAgICAgICB0aGlzW2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGxpc3RbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIHByaW1pdGl2ZSwgQXJyYXlCdWZmZXJcbiAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgc3VwZXIoaW5wdXQpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzdXBlcihpbnB1dCwgYnl0ZU9mZnNldCk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHN1cGVyKGlucHV0LCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcHJveHkgPSBuZXcgTmF0aXZlUHJveHkodGhpcywgaGFuZGxlcik7XG5cbiAgICAvLyBwcm94eSBwcml2YXRlIHN0b3JhZ2VcbiAgICBXZWFrTWFwUHJvdG90eXBlU2V0KHRhcmdldHMsIHByb3h5LCAvKiogQHR5cGUge2FueX0gKi8gKHRoaXMpKTtcblxuICAgIHJldHVybiBwcm94eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiBgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRmxvYXQxNkFycmF5KWAgb3IgYFJlZmxlY3Qub3duS2V5cyhGbG9hdDE2QXJyYXkpYCBpbmNsdWRlIHRoaXMga2V5XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUuZnJvbVxuICAgKi9cbiAgc3RhdGljIGZyb20oc3JjLCAuLi5vcHRzKSB7XG4gICAgY29uc3QgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgaWYgKCFSZWZsZWN0SGFzKENvbnN0cnVjdG9yLCBicmFuZCkpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBpZiAoaXNGbG9hdDE2QXJyYXkoc3JjKSAmJiBvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShzcmMpO1xuICAgICAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldChmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlKHVpbnQxNikpXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKFxuICAgICAgICAgICAgVWludDE2QXJyYXlGcm9tKHNyYywgcm91bmRUb0Zsb2F0MTZCaXRzKVxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWFwRnVuYyA9IG9wdHNbMF07XG4gICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1sxXTtcblxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgICAgVWludDE2QXJyYXlGcm9tKHNyYywgZnVuY3Rpb24gKHZhbCwgLi4uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHJvdW5kVG9GbG9hdDE2Qml0cyhcbiAgICAgICAgICAgICAgUmVmbGVjdEFwcGx5KG1hcEZ1bmMsIHRoaXMsIFt2YWwsIC4uLmFyZ3NdKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9LCB0aGlzQXJnKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7QXJyYXlMaWtlPHVua25vd24+fSAqL1xuICAgIGxldCBsaXN0O1xuICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICAgIGxldCBsZW5ndGg7XG5cbiAgICBpZiAoaXNJdGVyYWJsZShzcmMpKSB7IC8vIEl0ZXJhYmxlIChUeXBlZEFycmF5LCBBcnJheSlcbiAgICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICAgIGlmIChpc09yZGluYXJ5QXJyYXkoc3JjKSkge1xuICAgICAgICBsaXN0ID0gc3JjO1xuICAgICAgICBsZW5ndGggPSBzcmMubGVuZ3RoO1xuICAgICAgfSBlbHNlIGlmIChpc09yZGluYXJ5VHlwZWRBcnJheShzcmMpKSB7XG4gICAgICAgIGxpc3QgPSBzcmM7XG4gICAgICAgIGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoc3JjKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpc3QgPSBbLi4uc3JjXTtcbiAgICAgICAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8gQXJyYXlMaWtlXG4gICAgICBsaXN0ID0gc3JjO1xuICAgICAgbGVuZ3RoID0gTGVuZ3RoT2ZBcnJheUxpa2Uoc3JjKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gLyoqIEB0eXBlIHtudW1iZXJ9ICovIChsaXN0W2ldKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbWFwRnVuYyA9IG9wdHNbMF07XG4gICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1sxXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgYXJyYXlbaV0gPSBSZWZsZWN0QXBwbHkobWFwRnVuYywgdGhpc0FyZywgW2xpc3RbaV0sIGldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZsb2F0MTZBcnJheSlgIG9yIGBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5KWAgaW5jbHVkZSB0aGlzIGtleVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLm9mXG4gICAqL1xuICBzdGF0aWMgb2YoLi4uaXRlbXMpIHtcbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICBpZiAoIVJlZmxlY3RIYXMoQ29uc3RydWN0b3IsIGJyYW5kKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBsZW5ndGggPSBpdGVtcy5sZW5ndGg7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IHByb3h5ID0gbmV3IEZsb2F0MTZBcnJheShsZW5ndGgpO1xuICAgICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkocHJveHkpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXlbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMoaXRlbXNbaV0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGFycmF5W2ldID0gaXRlbXNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmtleXMgKi9cbiAga2V5cygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gVHlwZWRBcnJheVByb3RvdHlwZUtleXMoZmxvYXQxNmJpdHNBcnJheSk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogcmV0dXJucyBhIG9iamVjdCB3aG9zZSBwcm90b3R5cGUgaXMgbm90IGAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSVgXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnZhbHVlc1xuICAgKi9cbiAgdmFsdWVzKCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIHJldHVybiB3cmFwSW5BcnJheUl0ZXJhdG9yKChmdW5jdGlvbiogKCkge1xuICAgICAgZm9yIChjb25zdCB2YWwgb2YgVHlwZWRBcnJheVByb3RvdHlwZVZhbHVlcyhmbG9hdDE2Yml0c0FycmF5KSkge1xuICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiByZXR1cm5zIGEgb2JqZWN0IHdob3NlIHByb3RvdHlwZSBpcyBub3QgYCVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJWBcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZW50cmllc1xuICAgKi9cbiAgZW50cmllcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gKHdyYXBJbkFycmF5SXRlcmF0b3IoKGZ1bmN0aW9uKiAoKSB7XG4gICAgICBmb3IgKGNvbnN0IFtpLCB2YWxdIG9mIFR5cGVkQXJyYXlQcm90b3R5cGVFbnRyaWVzKGZsb2F0MTZiaXRzQXJyYXkpKSB7XG4gICAgICAgIHlpZWxkIC8qKiBAdHlwZSB7W051bWJlciwgbnVtYmVyXX0gKi8gKFtpLCBjb252ZXJ0VG9OdW1iZXIodmFsKV0pO1xuICAgICAgfVxuICAgIH0pKCkpKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5hdCAqL1xuICBhdChpbmRleCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgcmVsYXRpdmVJbmRleCA9IFRvSW50ZWdlck9ySW5maW5pdHkoaW5kZXgpO1xuICAgIGNvbnN0IGsgPSByZWxhdGl2ZUluZGV4ID49IDAgPyByZWxhdGl2ZUluZGV4IDogbGVuZ3RoICsgcmVsYXRpdmVJbmRleDtcblxuICAgIGlmIChrIDwgMCB8fCBrID49IGxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtrXSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUubWFwICovXG4gIG1hcChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBwcm94eSA9IG5ldyBGbG9hdDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgIGNvbnN0IGFycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShwcm94eSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgICBhcnJheVtpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhcbiAgICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCB2YWwgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gICAgICBhcnJheVtpXSA9IFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbCwgaSwgdGhpc10pO1xuICAgIH1cblxuICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKGFycmF5KTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maWx0ZXIgKi9cbiAgZmlsdGVyKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGNvbnN0IGtlcHQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCB2YWwgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gICAgICBpZiAoUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdmFsLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgQXJyYXlQcm90b3R5cGVQdXNoKGtlcHQsIHZhbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgQ29uc3RydWN0b3IgPSBTcGVjaWVzQ29uc3RydWN0b3IoZmxvYXQxNmJpdHNBcnJheSwgRmxvYXQxNkFycmF5KTtcbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihrZXB0KTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSk7XG5cbiAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChhcnJheSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUucmVkdWNlICovXG4gIHJlZHVjZShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgaWYgKGxlbmd0aCA9PT0gMCAmJiBvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFJFRFVDRV9PRl9FTVBUWV9BUlJBWV9XSVRIX05PX0lOSVRJQUxfVkFMVUUpO1xuICAgIH1cblxuICAgIGxldCBhY2N1bXVsYXRvciwgc3RhcnQ7XG4gICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5WzBdKTtcbiAgICAgIHN0YXJ0ID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWNjdW11bGF0b3IgPSBvcHRzWzBdO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNhbGxiYWNrKFxuICAgICAgICBhY2N1bXVsYXRvcixcbiAgICAgICAgY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pLFxuICAgICAgICBpLFxuICAgICAgICB0aGlzXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5yZWR1Y2VyaWdodCAqL1xuICByZWR1Y2VSaWdodChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgaWYgKGxlbmd0aCA9PT0gMCAmJiBvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFJFRFVDRV9PRl9FTVBUWV9BUlJBWV9XSVRIX05PX0lOSVRJQUxfVkFMVUUpO1xuICAgIH1cblxuICAgIGxldCBhY2N1bXVsYXRvciwgc3RhcnQ7XG4gICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2xlbmd0aCAtIDFdKTtcbiAgICAgIHN0YXJ0ID0gbGVuZ3RoIC0gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgYWNjdW11bGF0b3IgPSBvcHRzWzBdO1xuICAgICAgc3RhcnQgPSBsZW5ndGggLSAxO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soXG4gICAgICAgIGFjY3VtdWxhdG9yLFxuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZvcmVhY2ggKi9cbiAgZm9yRWFjaChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pLFxuICAgICAgICBpLFxuICAgICAgICB0aGlzLFxuICAgICAgXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbmQgKi9cbiAgZmluZChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZGluZGV4ICovXG4gIGZpbmRJbmRleChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9wcm9wb3NhbC1hcnJheS1maW5kLWZyb20tbGFzdC9pbmRleC5odG1sI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbmRsYXN0ICovXG4gIGZpbmRMYXN0KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSBsZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gICAgICBpZiAoUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdmFsdWUsIGksIHRoaXNdKSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLWFycmF5LWZpbmQtZnJvbS1sYXN0L2luZGV4Lmh0bWwjc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZGxhc3RpbmRleCAqL1xuICBmaW5kTGFzdEluZGV4KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSBsZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gICAgICBpZiAoUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdmFsdWUsIGksIHRoaXNdKSkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZXZlcnkgKi9cbiAgZXZlcnkoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKFxuICAgICAgICAhUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbXG4gICAgICAgICAgY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pLFxuICAgICAgICAgIGksXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgXSlcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc29tZSAqL1xuICBzb21lKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChcbiAgICAgICAgUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbXG4gICAgICAgICAgY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pLFxuICAgICAgICAgIGksXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgXSlcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc2V0ICovXG4gIHNldChpbnB1dCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IHRhcmdldE9mZnNldCA9IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSk7XG4gICAgaWYgKHRhcmdldE9mZnNldCA8IDApIHtcbiAgICAgIHRocm93IE5hdGl2ZVJhbmdlRXJyb3IoT0ZGU0VUX0lTX09VVF9PRl9CT1VORFMpO1xuICAgIH1cblxuICAgIGlmIChpbnB1dCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIENBTk5PVF9DT05WRVJUX1VOREVGSU5FRF9PUl9OVUxMX1RPX09CSkVDVFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoaXNCaWdJbnRUeXBlZEFycmF5KGlucHV0KSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChpc0Zsb2F0MTZBcnJheShpbnB1dCkpIHtcbiAgICAgIC8vIHBlZWwgb2ZmIFByb3h5XG4gICAgICByZXR1cm4gVHlwZWRBcnJheVByb3RvdHlwZVNldChcbiAgICAgICAgZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKSxcbiAgICAgICAgZ2V0RmxvYXQxNkJpdHNBcnJheShpbnB1dCksXG4gICAgICAgIHRhcmdldE9mZnNldFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRMZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgY29uc3Qgc3JjID0gTmF0aXZlT2JqZWN0KGlucHV0KTtcbiAgICBjb25zdCBzcmNMZW5ndGggPSBMZW5ndGhPZkFycmF5TGlrZShzcmMpO1xuXG4gICAgaWYgKHRhcmdldE9mZnNldCA9PT0gSW5maW5pdHkgfHwgc3JjTGVuZ3RoICsgdGFyZ2V0T2Zmc2V0ID4gdGFyZ2V0TGVuZ3RoKSB7XG4gICAgICB0aHJvdyBOYXRpdmVSYW5nZUVycm9yKE9GRlNFVF9JU19PVVRfT0ZfQk9VTkRTKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNyY0xlbmd0aDsgKytpKSB7XG4gICAgICBmbG9hdDE2Yml0c0FycmF5W2kgKyB0YXJnZXRPZmZzZXRdID0gcm91bmRUb0Zsb2F0MTZCaXRzKHNyY1tpXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJldmVyc2UgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBUeXBlZEFycmF5UHJvdG90eXBlUmV2ZXJzZShmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbGwgKi9cbiAgZmlsbCh2YWx1ZSwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVGaWxsKFxuICAgICAgZmxvYXQxNmJpdHNBcnJheSxcbiAgICAgIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSksXG4gICAgICAuLi5vcHRzXG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmNvcHl3aXRoaW4gKi9cbiAgY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgVHlwZWRBcnJheVByb3RvdHlwZUNvcHlXaXRoaW4oZmxvYXQxNmJpdHNBcnJheSwgdGFyZ2V0LCBzdGFydCwgLi4ub3B0cyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb3J0ICovXG4gIHNvcnQoLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGNvbXBhcmUgPSBvcHRzWzBdICE9PSB1bmRlZmluZWQgPyBvcHRzWzBdIDogZGVmYXVsdENvbXBhcmU7XG4gICAgVHlwZWRBcnJheVByb3RvdHlwZVNvcnQoZmxvYXQxNmJpdHNBcnJheSwgKHgsIHkpID0+IHtcbiAgICAgIHJldHVybiBjb21wYXJlKGNvbnZlcnRUb051bWJlcih4KSwgY29udmVydFRvTnVtYmVyKHkpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNsaWNlICovXG4gIHNsaWNlKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgICApO1xuICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlKHVpbnQxNiwgLi4ub3B0cylcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHN0YXJ0ID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBjb25zdCBlbmQgPSBvcHRzWzFdID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMV0pO1xuXG4gICAgbGV0IGs7XG4gICAgaWYgKHN0YXJ0ID09PSAtSW5maW5pdHkpIHtcbiAgICAgIGsgPSAwO1xuICAgIH0gZWxzZSBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICBrID0gbGVuZ3RoICsgc3RhcnQgPiAwID8gbGVuZ3RoICsgc3RhcnQgOiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBrID0gbGVuZ3RoIDwgc3RhcnQgPyBsZW5ndGggOiBzdGFydDtcbiAgICB9XG5cbiAgICBsZXQgZmluYWw7XG4gICAgaWYgKGVuZCA9PT0gLUluZmluaXR5KSB7XG4gICAgICBmaW5hbCA9IDA7XG4gICAgfSBlbHNlIGlmIChlbmQgPCAwKSB7XG4gICAgICBmaW5hbCA9IGxlbmd0aCArIGVuZCA+IDAgPyBsZW5ndGggKyBlbmQgOiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaW5hbCA9IGxlbmd0aCA8IGVuZCA/IGxlbmd0aCA6IGVuZDtcbiAgICB9XG5cbiAgICBjb25zdCBjb3VudCA9IGZpbmFsIC0gayA+IDAgPyBmaW5hbCAtIGsgOiAwO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGNvdW50KTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSk7XG5cbiAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG5cbiAgICBsZXQgbiA9IDA7XG4gICAgd2hpbGUgKGsgPCBmaW5hbCkge1xuICAgICAgYXJyYXlbbl0gPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtrXSk7XG4gICAgICArK2s7XG4gICAgICArK247XG4gICAgfVxuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnN1YmFycmF5ICovXG4gIHN1YmFycmF5KC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgY29uc3QgdWludDE2ID0gbmV3IE5hdGl2ZVVpbnQxNkFycmF5KFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KVxuICAgICk7XG4gICAgY29uc3QgdWludDE2U3ViYXJyYXkgPSBUeXBlZEFycmF5UHJvdG90eXBlU3ViYXJyYXkodWludDE2LCAuLi5vcHRzKTtcblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcih1aW50MTZTdWJhcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldCh1aW50MTZTdWJhcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKHVpbnQxNlN1YmFycmF5KVxuICAgICk7XG4gICAgYXNzZXJ0U3BlY2llc1R5cGVkQXJyYXkoYXJyYXkpO1xuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmluZGV4b2YgKi9cbiAgaW5kZXhPZihlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAoZnJvbSA9PT0gSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBmcm9tOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChcbiAgICAgICAgT2JqZWN0SGFzT3duKGZsb2F0MTZiaXRzQXJyYXksIGkpICYmXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSA9PT0gZWxlbWVudFxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5sYXN0aW5kZXhvZiAqL1xuICBsYXN0SW5kZXhPZihlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIGxldCBmcm9tID0gb3B0cy5sZW5ndGggPj0gMSA/IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSkgOiBsZW5ndGggLSAxO1xuICAgIGlmIChmcm9tID09PSAtSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA+PSAwKSB7XG4gICAgICBmcm9tID0gZnJvbSA8IGxlbmd0aCAtIDEgPyBmcm9tIDogbGVuZ3RoIC0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPj0gMDsgLS1pKSB7XG4gICAgICBpZiAoXG4gICAgICAgIE9iamVjdEhhc093bihmbG9hdDE2Yml0c0FycmF5LCBpKSAmJlxuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSkgPT09IGVsZW1lbnRcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuaW5jbHVkZXMgKi9cbiAgaW5jbHVkZXMoZWxlbWVudCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICBsZXQgZnJvbSA9IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSk7XG4gICAgaWYgKGZyb20gPT09IEluZmluaXR5KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICBmcm9tID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpc05hTiA9IE51bWJlcklzTmFOKGVsZW1lbnQpO1xuICAgIGZvciAobGV0IGkgPSBmcm9tOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuXG4gICAgICBpZiAoaXNOYU4gJiYgTnVtYmVySXNOYU4odmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmpvaW4gKi9cbiAgam9pbiguLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgYXJyYXkgPSBjb3B5VG9BcnJheShmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIHJldHVybiBBcnJheVByb3RvdHlwZUpvaW4oYXJyYXksIC4uLm9wdHMpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnRvbG9jYWxlc3RyaW5nICovXG4gIHRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiBBcnJheVByb3RvdHlwZVRvTG9jYWxlU3RyaW5nKGFycmF5LCAuLi5vcHRzKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtZ2V0LSV0eXBlZGFycmF5JS5wcm90b3R5cGUtQEB0b3N0cmluZ3RhZyAqL1xuICBnZXQgW1N5bWJvbFRvU3RyaW5nVGFnXSgpIHtcbiAgICBpZiAoaXNGbG9hdDE2QXJyYXkodGhpcykpIHtcbiAgICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKFwiRmxvYXQxNkFycmF5XCIpO1xuICAgIH1cbiAgfVxufVxuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXR5cGVkYXJyYXkuYnl0ZXNfcGVyX2VsZW1lbnQgKi9cbk9iamVjdERlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheSwgXCJCWVRFU19QRVJfRUxFTUVOVFwiLCB7XG4gIHZhbHVlOiBOYXRpdmVVaW50MTZBcnJheS5CWVRFU19QRVJfRUxFTUVOVCxcbn0pO1xuXG4vLyBsaW1pdGF0aW9uOiBJdCBpcyBwZWFrZWQgYnkgYE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoRmxvYXQxNkFycmF5KWAgYW5kIGBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5KWBcbk9iamVjdERlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheSwgYnJhbmQsIHt9KTtcblxuY29uc3QgRmxvYXQxNkFycmF5UHJvdG90eXBlID0gRmxvYXQxNkFycmF5LnByb3RvdHlwZTtcblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10eXBlZGFycmF5LnByb3RvdHlwZS5ieXRlc19wZXJfZWxlbWVudCAqL1xuT2JqZWN0RGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5UHJvdG90eXBlLCBcIkJZVEVTX1BFUl9FTEVNRU5UXCIsIHtcbiAgdmFsdWU6IE5hdGl2ZVVpbnQxNkFycmF5LkJZVEVTX1BFUl9FTEVNRU5ULFxufSk7XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS1AQGl0ZXJhdG9yICovXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXlQcm90b3R5cGUsIFN5bWJvbEl0ZXJhdG9yLCB7XG4gIHZhbHVlOiBGbG9hdDE2QXJyYXlQcm90b3R5cGUudmFsdWVzLFxuICB3cml0YWJsZTogdHJ1ZSxcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxufSk7XG5cbi8vIFRvIG1ha2UgYG5ldyBGbG9hdDE2QXJyYXkoKSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5YCByZXR1cm5zIGBmYWxzZWBcblJlZmxlY3RTZXRQcm90b3R5cGVPZihGbG9hdDE2QXJyYXlQcm90b3R5cGUsIFR5cGVkQXJyYXlQcm90b3R5cGUpO1xuIiwiaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9fdXRpbC9jb252ZXJ0ZXIubWpzXCI7XG5pbXBvcnQge1xuICBEYXRhVmlld1Byb3RvdHlwZUdldFVpbnQxNixcbiAgRGF0YVZpZXdQcm90b3R5cGVTZXRVaW50MTYsXG59IGZyb20gXCIuL191dGlsL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKipcbiAqIHJldHVybnMgYW4gdW5zaWduZWQgMTYtYml0IGZsb2F0IGF0IHRoZSBzcGVjaWZpZWQgYnl0ZSBvZmZzZXQgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIERhdGFWaWV3LlxuICpcbiAqIEBwYXJhbSB7RGF0YVZpZXd9IGRhdGFWaWV3XG4gKiBAcGFyYW0ge251bWJlcn0gYnl0ZU9mZnNldFxuICogQHBhcmFtIHtbYm9vbGVhbl19IG9wdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCAuLi5vcHRzKSB7XG4gIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoXG4gICAgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIC4uLm9wdHMpXG4gICk7XG59XG5cbi8qKlxuICogc3RvcmVzIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCB2YWx1ZSBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlldy5cbiAqXG4gKiBAcGFyYW0ge0RhdGFWaWV3fSBkYXRhVmlld1xuICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXRcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxuICogQHBhcmFtIHtbYm9vbGVhbl19IG9wdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEZsb2F0MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIHZhbHVlLCAuLi5vcHRzKSB7XG4gIHJldHVybiBEYXRhVmlld1Byb3RvdHlwZVNldFVpbnQxNihcbiAgICBkYXRhVmlldyxcbiAgICBieXRlT2Zmc2V0LFxuICAgIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSksXG4gICAgLi4ub3B0c1xuICApO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0VBQUE7QUFDQTtFQUNBLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztBQUMxQztFQUNBO0VBQ0EsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQztFQUNBO0VBQ0EsU0FBUyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0VBQ3hDLEVBQUUsT0FBTyxXQUFXO0VBQ3BCLElBQUksK0JBQStCO0VBQ25DLE1BQU0sTUFBTTtFQUNaLE1BQU0sR0FBRztFQUNULEtBQUssQ0FBQyxHQUFHO0VBQ1QsR0FBRyxDQUFDO0VBQ0osQ0FBQztBQUNEO0VBQ0E7RUFDTyxNQUFNO0VBQ2IsRUFBRSxLQUFLLEVBQUUsWUFBWTtFQUNyQixFQUFFLEdBQUcsRUFBRSxVQUFVO0VBQ2pCLEVBQUUsd0JBQXdCLEVBQUUsK0JBQStCO0VBQzNELEVBQUUsY0FBYyxFQUFFLHFCQUFxQjtFQUN2QyxFQUFFLEdBQUcsRUFBRSxVQUFVO0VBQ2pCLEVBQUUsT0FBTyxFQUFFLGNBQWM7RUFDekIsRUFBRSxHQUFHLEVBQUUsVUFBVTtFQUNqQixFQUFFLGNBQWMsRUFBRSxxQkFBcUI7RUFDdkMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUNaO0VBQ0E7RUFDTyxNQUFNLFdBQVcsR0FBRyxLQUFL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
