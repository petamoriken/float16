/*! @petamoriken/float16 v3.8.7-54-g6f8287a | MIT License - https://github.com/petamoriken/float16 */

var float16 = (function (exports) {
  'use strict';

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
  const CANNOT_MIX_BIGINT_AND_OTHER_TYPES =
    "Cannot mix BigInt and other types, use explicit conversions";
  const ITERATOR_PROPERTY_IS_NOT_CALLABLE = "@@iterator property is not callable";
  const REDUCE_OF_EMPTY_ARRAY_WITH_NO_INITIAL_VALUE =
    "Reduce of empty array with no initial value";
  const THE_COMPARISON_FUNCTION_MUST_BE_EITHER_A_FUNCTION_OR_UNDEFINED =
    "The comparison function must be either a function or undefined";
  const OFFSET_IS_OUT_OF_BOUNDS = "Offset is out of bounds";

  function uncurryThis(target) {
    return (thisArg, ...args) => {
      return ReflectApply(target, thisArg, args);
    };
  }
  function uncurryThisGetter(target, key) {
    return uncurryThis(
      ReflectGetOwnPropertyDescriptor(
        target,
        key
      ).get
    );
  }
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
  const NativeProxy = Proxy;
  const {
    EPSILON,
    MAX_SAFE_INTEGER,
    isFinite: NumberIsFinite,
    isNaN: NumberIsNaN,
  } = Number;
  const {
    iterator: SymbolIterator,
    species: SymbolSpecies,
    toStringTag: SymbolToStringTag,
    for: SymbolFor,
  } = Symbol;
  const NativeObject = Object;
  const {
    create: ObjectCreate,
    defineProperty: ObjectDefineProperty,
    freeze: ObjectFreeze,
    is: ObjectIs,
  } = NativeObject;
  const ObjectPrototype = NativeObject.prototype;
  const ObjectPrototype__lookupGetter__ =  (ObjectPrototype).__lookupGetter__
    ? uncurryThis( (ObjectPrototype).__lookupGetter__)
    : (object, key) => {
      if (object == null) {
        throw NativeTypeError(
          CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT
        );
      }
      let target = NativeObject(object);
      do {
        const descriptor = ReflectGetOwnPropertyDescriptor(target, key);
        if (descriptor !== undefined) {
          if (ObjectHasOwn(descriptor, "get")) {
            return descriptor.get;
          }
          return;
        }
      } while ((target = ReflectGetPrototypeOf(target)) !== null);
    };
  const ObjectHasOwn =  (NativeObject).hasOwn ||
    uncurryThis(ObjectPrototype.hasOwnProperty);
  const NativeArray = Array;
  const ArrayIsArray = NativeArray.isArray;
  const ArrayPrototype = NativeArray.prototype;
  const ArrayPrototypeJoin = uncurryThis(ArrayPrototype.join);
  const ArrayPrototypePush = uncurryThis(ArrayPrototype.push);
  const ArrayPrototypeToLocaleString = uncurryThis(
    ArrayPrototype.toLocaleString
  );
  const NativeArrayPrototypeSymbolIterator = ArrayPrototype[SymbolIterator];
  const ArrayPrototypeSymbolIterator = uncurryThis(NativeArrayPrototypeSymbolIterator);
  const {
    abs: MathAbs,
    trunc: MathTrunc,
  } = Math;
  const NativeArrayBuffer = ArrayBuffer;
  const ArrayBufferIsView = NativeArrayBuffer.isView;
  const ArrayBufferPrototype = NativeArrayBuffer.prototype;
  const ArrayBufferPrototypeSlice = uncurryThis(ArrayBufferPrototype.slice);
  const ArrayBufferPrototypeGetByteLength = uncurryThisGetter(ArrayBufferPrototype, "byteLength");
  const NativeSharedArrayBuffer = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : null;
  const SharedArrayBufferPrototypeGetByteLength = NativeSharedArrayBuffer
    && uncurryThisGetter(NativeSharedArrayBuffer.prototype, "byteLength");
  const TypedArray = ReflectGetPrototypeOf(Uint8Array);
  const TypedArrayFrom = TypedArray.from;
  const TypedArrayPrototype = TypedArray.prototype;
  const NativeTypedArrayPrototypeSymbolIterator = TypedArrayPrototype[SymbolIterator];
  const TypedArrayPrototypeKeys = uncurryThis(TypedArrayPrototype.keys);
  const TypedArrayPrototypeValues = uncurryThis(
    TypedArrayPrototype.values
  );
  const TypedArrayPrototypeEntries = uncurryThis(
    TypedArrayPrototype.entries
  );
  const TypedArrayPrototypeSet = uncurryThis(TypedArrayPrototype.set);
  const TypedArrayPrototypeReverse = uncurryThis(
    TypedArrayPrototype.reverse
  );
  const TypedArrayPrototypeFill = uncurryThis(TypedArrayPrototype.fill);
  const TypedArrayPrototypeCopyWithin = uncurryThis(
    TypedArrayPrototype.copyWithin
  );
  const TypedArrayPrototypeSort = uncurryThis(TypedArrayPrototype.sort);
  const TypedArrayPrototypeSlice = uncurryThis(TypedArrayPrototype.slice);
  const TypedArrayPrototypeSubarray = uncurryThis(
    TypedArrayPrototype.subarray
  );
  const TypedArrayPrototypeGetBuffer = uncurryThisGetter(
    TypedArrayPrototype,
    "buffer"
  );
  const TypedArrayPrototypeGetByteOffset = uncurryThisGetter(
    TypedArrayPrototype,
    "byteOffset"
  );
  const TypedArrayPrototypeGetLength = uncurryThisGetter(
    TypedArrayPrototype,
    "length"
  );
  const TypedArrayPrototypeGetSymbolToStringTag = uncurryThisGetter(
    TypedArrayPrototype,
    SymbolToStringTag
  );
  const NativeUint8Array = Uint8Array;
  const NativeUint16Array = Uint16Array;
  const Uint16ArrayFrom = (...args) => {
    return ReflectApply(TypedArrayFrom, NativeUint16Array, args);
  };
  const NativeUint32Array = Uint32Array;
  const NativeFloat32Array = Float32Array;
  const ArrayIteratorPrototype = ReflectGetPrototypeOf([][SymbolIterator]());
  const ArrayIteratorPrototypeNext = uncurryThis(ArrayIteratorPrototype.next);
  const GeneratorPrototypeNext = uncurryThis((function* () {})().next);
  const IteratorPrototype = ReflectGetPrototypeOf(ArrayIteratorPrototype);
  const DataViewPrototype = DataView.prototype;
  const DataViewPrototypeGetUint16 = uncurryThis(
    DataViewPrototype.getUint16
  );
  const DataViewPrototypeSetUint16 = uncurryThis(
    DataViewPrototype.setUint16
  );
  const NativeTypeError = TypeError;
  const NativeRangeError = RangeError;
  const NativeWeakSet = WeakSet;
  const WeakSetPrototype = NativeWeakSet.prototype;
  const WeakSetPrototypeAdd = uncurryThis(WeakSetPrototype.add);
  const WeakSetPrototypeHas = uncurryThis(WeakSetPrototype.has);
  const NativeWeakMap = WeakMap;
  const WeakMapPrototype = NativeWeakMap.prototype;
  const WeakMapPrototypeGet = uncurryThis(WeakMapPrototype.get);
  const WeakMapPrototypeHas = uncurryThis(WeakMapPrototype.has);
  const WeakMapPrototypeSet = uncurryThis(WeakMapPrototype.set);

  const arrayIterators = new NativeWeakMap();
  const SafeIteratorPrototype = ObjectCreate(null, {
    next: {
      value: function next() {
        const arrayIterator = WeakMapPrototypeGet(arrayIterators, this);
        return ArrayIteratorPrototypeNext(arrayIterator);
      },
    },
    [SymbolIterator]: {
      value: function values() {
        return this;
      },
    },
  });
  function safeIfNeeded(array) {
    if (
      array[SymbolIterator] === NativeArrayPrototypeSymbolIterator &&
      ArrayIteratorPrototype.next === ArrayIteratorPrototypeNext
    ) {
      return array;
    }
    const safe = ObjectCreate(SafeIteratorPrototype);
    WeakMapPrototypeSet(arrayIterators, safe, ArrayPrototypeSymbolIterator(array));
    return safe;
  }
  const generators = new NativeWeakMap();
  const DummyArrayIteratorPrototype = ObjectCreate(IteratorPrototype, {
    next: {
      value: function next() {
        const generator = WeakMapPrototypeGet(generators, this);
        return GeneratorPrototypeNext(generator);
      },
      writable: true,
      configurable: true,
    },
  });
  for (const key of ReflectOwnKeys(ArrayIteratorPrototype)) {
    if (key === "next") {
      continue;
    }
    ObjectDefineProperty(DummyArrayIteratorPrototype, key, ReflectGetOwnPropertyDescriptor(ArrayIteratorPrototype, key));
  }
  function wrap(generator) {
    const dummy = ObjectCreate(DummyArrayIteratorPrototype);
    WeakMapPrototypeSet(generators, dummy, generator);
    return dummy;
  }

  function isObject(value) {
    return (
      (value !== null && typeof value === "object") ||
      typeof value === "function"
    );
  }
  function isObjectLike(value) {
    return value !== null && typeof value === "object";
  }
  function isNativeTypedArray(value) {
    return TypedArrayPrototypeGetSymbolToStringTag(value) !== undefined;
  }
  function isNativeBigIntTypedArray(value) {
    const typedArrayName = TypedArrayPrototypeGetSymbolToStringTag(value);
    return (
      typedArrayName === "BigInt64Array" ||
      typedArrayName === "BigUint64Array"
    );
  }
  function isArrayBuffer(value) {
    try {
      if (ArrayIsArray(value)) {
        return false;
      }
      ArrayBufferPrototypeGetByteLength( (value));
      return true;
    } catch (e) {
      return false;
    }
  }
  function isSharedArrayBuffer(value) {
    if (NativeSharedArrayBuffer === null) {
      return false;
    }
    try {
      SharedArrayBufferPrototypeGetByteLength( (value));
      return true;
    } catch (e) {
      return false;
    }
  }
  function isAnyArrayBuffer(value) {
    return isArrayBuffer(value) || isSharedArrayBuffer(value);
  }
  function isOrdinaryArray(value) {
    if (!ArrayIsArray(value)) {
      return false;
    }
    return (
      value[SymbolIterator] === NativeArrayPrototypeSymbolIterator &&
      ArrayIteratorPrototype.next === ArrayIteratorPrototypeNext
    );
  }
  function isOrdinaryNativeTypedArray(value) {
    if (!isNativeTypedArray(value)) {
      return false;
    }
    return (
      value[SymbolIterator] === NativeTypedArrayPrototypeSymbolIterator &&
      ArrayIteratorPrototype.next === ArrayIteratorPrototypeNext
    );
  }
  function isCanonicalIntegerIndexString(value) {
    if (typeof value !== "string") {
      return false;
    }
    const number = +value;
    if (value !== number + "") {
      return false;
    }
    if (!NumberIsFinite(number)) {
      return false;
    }
    return number === MathTrunc(number);
  }

  const brand = SymbolFor("__Float16Array__");
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

  const INVERSE_OF_EPSILON = 1 / EPSILON;
  function roundTiesToEven(num) {
    return (num + INVERSE_OF_EPSILON) - INVERSE_OF_EPSILON;
  }
  const FLOAT16_MIN_VALUE = 6.103515625e-05;
  const FLOAT16_MAX_VALUE = 65504;
  const FLOAT16_EPSILON = 0.0009765625;
  const FLOAT16_EPSILON_MULTIPLIED_BY_FLOAT16_MIN_VALUE = FLOAT16_EPSILON * FLOAT16_MIN_VALUE;
  const FLOAT16_EPSILON_DEVIDED_BY_EPSILON = FLOAT16_EPSILON * INVERSE_OF_EPSILON;
  function roundToFloat16(num) {
    const number = +num;
    if (!NumberIsFinite(number) || number === 0) {
      return number;
    }
    const sign = number > 0 ? 1 : -1;
    const absolute = MathAbs(number);
    if (absolute < FLOAT16_MIN_VALUE) {
      return sign * roundTiesToEven(absolute / FLOAT16_EPSILON_MULTIPLIED_BY_FLOAT16_MIN_VALUE) * FLOAT16_EPSILON_MULTIPLIED_BY_FLOAT16_MIN_VALUE;
    }
    const temp = (1 + FLOAT16_EPSILON_DEVIDED_BY_EPSILON) * absolute;
    const result = temp - (temp - absolute);
    if (result > FLOAT16_MAX_VALUE || NumberIsNaN(result)) {
      return sign * Infinity;
    }
    return sign * result;
  }
  const buffer = new NativeArrayBuffer(4);
  const floatView = new NativeFloat32Array(buffer);
  const uint32View = new NativeUint32Array(buffer);
  const baseTable = new NativeUint16Array(512);
  const shiftTable = new NativeUint8Array(512);
  for (let i = 0; i < 256; ++i) {
    const e = i - 127;
    if (e < -24) {
      baseTable[i]         = 0x0000;
      baseTable[i | 0x100] = 0x8000;
      shiftTable[i]         = 24;
      shiftTable[i | 0x100] = 24;
    } else if (e < -14) {
      baseTable[i]         =  0x0400 >> (-e - 14);
      baseTable[i | 0x100] = (0x0400 >> (-e - 14)) | 0x8000;
      shiftTable[i]         = -e - 1;
      shiftTable[i | 0x100] = -e - 1;
    } else if (e <= 15) {
      baseTable[i]         =  (e + 15) << 10;
      baseTable[i | 0x100] = ((e + 15) << 10) | 0x8000;
      shiftTable[i]         = 13;
      shiftTable[i | 0x100] = 13;
    } else if (e < 128) {
      baseTable[i]         = 0x7c00;
      baseTable[i | 0x100] = 0xfc00;
      shiftTable[i]         = 24;
      shiftTable[i | 0x100] = 24;
    } else {
      baseTable[i]         = 0x7c00;
      baseTable[i | 0x100] = 0xfc00;
      shiftTable[i]         = 13;
      shiftTable[i | 0x100] = 13;
    }
  }
  function roundToFloat16Bits(num) {
    floatView[0] = roundToFloat16(num);
    const f = uint32View[0];
    const e = (f >> 23) & 0x1ff;
    return baseTable[e] + ((f & 0x007fffff) >> shiftTable[e]);
  }
  const mantissaTable = new NativeUint32Array(2048);
  for (let i = 1; i < 1024; ++i) {
    let m = i << 13;
    let e = 0;
    while ((m & 0x00800000) === 0) {
      m <<= 1;
      e -= 0x00800000;
    }
    m &= ~0x00800000;
    e += 0x38800000;
    mantissaTable[i] = m | e;
  }
  for (let i = 1024; i < 2048; ++i) {
    mantissaTable[i] = 0x38000000 + ((i - 1024) << 13);
  }
  const exponentTable = new NativeUint32Array(64);
  for (let i = 1; i < 31; ++i) {
    exponentTable[i] = i << 23;
  }
  exponentTable[31] = 0x47800000;
  exponentTable[32] = 0x80000000;
  for (let i = 33; i < 63; ++i) {
    exponentTable[i] = 0x80000000 + ((i - 32) << 23);
  }
  exponentTable[63] = 0xc7800000;
  const offsetTable = new NativeUint16Array(64);
  for (let i = 1; i < 64; ++i) {
    if (i !== 32) {
      offsetTable[i] = 1024;
    }
  }
  function convertToNumber(float16bits) {
    const i = float16bits >> 10;
    uint32View[0] = mantissaTable[offsetTable[i] + (float16bits & 0x3ff)] + exponentTable[i];
    return floatView[0];
  }

  function ToIntegerOrInfinity(target) {
    const number = +target;
    if (NumberIsNaN(number) || number === 0) {
      return 0;
    }
    return MathTrunc(number);
  }
  function ToLength(target) {
    const length = ToIntegerOrInfinity(target);
    if (length < 0) {
      return 0;
    }
    return length < MAX_SAFE_INTEGER
      ? length
      : MAX_SAFE_INTEGER;
  }
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
  function IsDetachedBuffer(buffer) {
    if (isSharedArrayBuffer(buffer)) {
      return false;
    }
    try {
      ArrayBufferPrototypeSlice(buffer, 0, 0);
      return false;
    } catch (e) {}
    return true;
  }
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
  const float16bitsArrays = new NativeWeakMap();
  function isFloat16Array(target) {
    return WeakMapPrototypeHas(float16bitsArrays, target) ||
      (!ArrayBufferIsView(target) && hasFloat16ArrayBrand(target));
  }
  function assertFloat16Array(target) {
    if (!isFloat16Array(target)) {
      throw NativeTypeError(THIS_IS_NOT_A_FLOAT16ARRAY_OBJECT);
    }
  }
  function assertSpeciesTypedArray(target, count) {
    const isTargetFloat16Array = isFloat16Array(target);
    const isTargetTypedArray = isNativeTypedArray(target);
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
    if (isNativeBigIntTypedArray(target)) {
      throw NativeTypeError(CANNOT_MIX_BIGINT_AND_OTHER_TYPES);
    }
  }
  function getFloat16BitsArray(float16) {
    const float16bitsArray = WeakMapPrototypeGet(float16bitsArrays, float16);
    if (float16bitsArray !== undefined) {
      const buffer = TypedArrayPrototypeGetBuffer(float16bitsArray);
      if (IsDetachedBuffer(buffer)) {
        throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
      }
      return float16bitsArray;
    }
    const buffer =  (float16).buffer;
    if (IsDetachedBuffer(buffer)) {
      throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
    }
    const cloned = ReflectConstruct(Float16Array, [
      buffer,
       (float16).byteOffset,
       (float16).length,
    ], float16.constructor);
    return WeakMapPrototypeGet(float16bitsArrays, cloned);
  }
  function copyToArray(float16bitsArray) {
    const length = TypedArrayPrototypeGetLength(float16bitsArray);
    const array = [];
    for (let i = 0; i < length; ++i) {
      array[i] = convertToNumber(float16bitsArray[i]);
    }
    return array;
  }
  const TypedArrayPrototypeGetters = new NativeWeakSet();
  for (const key of ReflectOwnKeys(TypedArrayPrototype)) {
    if (key === SymbolToStringTag) {
      continue;
    }
    const descriptor = ReflectGetOwnPropertyDescriptor(TypedArrayPrototype, key);
    if (ObjectHasOwn(descriptor, "get") && typeof descriptor.get === "function") {
      WeakSetPrototypeAdd(TypedArrayPrototypeGetters, descriptor.get);
    }
  }
  const handler = ObjectFreeze( ({
    get(target, key, receiver) {
      if (isCanonicalIntegerIndexString(key) && ObjectHasOwn(target, key)) {
        return convertToNumber(ReflectGet(target, key));
      }
      if (WeakSetPrototypeHas(TypedArrayPrototypeGetters, ObjectPrototype__lookupGetter__(target, key))) {
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
    constructor(input, _byteOffset, _length) {
      let float16bitsArray;
      if (isFloat16Array(input)) {
        float16bitsArray = ReflectConstruct(NativeUint16Array, [getFloat16BitsArray(input)], new.target);
      } else if (isObject(input) && !isAnyArrayBuffer(input)) {
        let list;
        let length;
        if (isNativeTypedArray(input)) {
          list = input;
          length = TypedArrayPrototypeGetLength(input);
          const buffer = TypedArrayPrototypeGetBuffer(input);
          if (IsDetachedBuffer(buffer)) {
            throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
          }
          if (isNativeBigIntTypedArray(input)) {
            throw NativeTypeError(CANNOT_MIX_BIGINT_AND_OTHER_TYPES);
          }
          const data = new NativeArrayBuffer(
            length * BYTES_PER_ELEMENT
          );
          float16bitsArray = ReflectConstruct(NativeUint16Array, [data], new.target);
        } else {
          const iterator = input[SymbolIterator];
          if (iterator != null && typeof iterator !== "function") {
            throw NativeTypeError(ITERATOR_PROPERTY_IS_NOT_CALLABLE);
          }
          if (iterator != null) {
            if (isOrdinaryArray(input)) {
              list = input;
              length = input.length;
            } else {
              list = [...  (input)];
              length = list.length;
            }
          } else {
            list =  (input);
            length = ToLength(list.length);
          }
          float16bitsArray = ReflectConstruct(NativeUint16Array, [length], new.target);
        }
        for (let i = 0; i < length; ++i) {
          float16bitsArray[i] = roundToFloat16Bits(list[i]);
        }
      } else {
        float16bitsArray = ReflectConstruct(NativeUint16Array, arguments, new.target);
      }
      const proxy =  (new NativeProxy(float16bitsArray, handler));
      WeakMapPrototypeSet(float16bitsArrays, proxy, float16bitsArray);
      return proxy;
    }
    static from(src, ...opts) {
      const Constructor = this;
      if (!ReflectHas(Constructor, brand)) {
        throw NativeTypeError(
          THIS_CONSTRUCTOR_IS_NOT_A_SUBCLASS_OF_FLOAT16ARRAY
        );
      }
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
                ReflectApply(mapFunc, this, [val, ...safeIfNeeded(args)])
              );
            }, thisArg)
          )
        );
      }
      let list;
      let length;
      const iterator = src[SymbolIterator];
      if (iterator != null && typeof iterator !== "function") {
        throw NativeTypeError(ITERATOR_PROPERTY_IS_NOT_CALLABLE);
      }
      if (iterator != null) {
        if (isOrdinaryArray(src)) {
          list = src;
          length = src.length;
        } else if (isOrdinaryNativeTypedArray(src)) {
          list = src;
          length = TypedArrayPrototypeGetLength(src);
        } else {
          list = [...src];
          length = list.length;
        }
      } else {
        if (src == null) {
          throw NativeTypeError(
            CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT
          );
        }
        list = NativeObject(src);
        length = ToLength(list.length);
      }
      const array = new Constructor(length);
      if (opts.length === 0) {
        for (let i = 0; i < length; ++i) {
          array[i] =  (list[i]);
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
    static of(...items) {
      const Constructor = this;
      if (!ReflectHas(Constructor, brand)) {
        throw NativeTypeError(
          THIS_CONSTRUCTOR_IS_NOT_A_SUBCLASS_OF_FLOAT16ARRAY
        );
      }
      const length = items.length;
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
    keys() {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      return TypedArrayPrototypeKeys(float16bitsArray);
    }
    values() {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      return wrap((function* () {
        for (const val of TypedArrayPrototypeValues(float16bitsArray)) {
          yield convertToNumber(val);
        }
      })());
    }
    entries() {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      return wrap((function* () {
        for (const [i, val] of TypedArrayPrototypeEntries(float16bitsArray)) {
          yield  ([i, convertToNumber(val)]);
        }
      })());
    }
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
    with(index, value) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      const length = TypedArrayPrototypeGetLength(float16bitsArray);
      const relativeIndex = ToIntegerOrInfinity(index);
      const k = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;
      const number = +value;
      if (k < 0 || k >= length) {
        throw NativeRangeError(OFFSET_IS_OUT_OF_BOUNDS);
      }
      const uint16 = new NativeUint16Array(
        TypedArrayPrototypeGetBuffer(float16bitsArray),
        TypedArrayPrototypeGetByteOffset(float16bitsArray),
        TypedArrayPrototypeGetLength(float16bitsArray)
      );
      const cloned = new Float16Array(
        TypedArrayPrototypeGetBuffer(
          TypedArrayPrototypeSlice(uint16)
        )
      );
      const array = getFloat16BitsArray(cloned);
      array[k] = roundToFloat16Bits(number);
      return cloned;
    }
    map(callback, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      const length = TypedArrayPrototypeGetLength(float16bitsArray);
      const thisArg = opts[0];
      const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);
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
      return  (array);
    }
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
      return  (array);
    }
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
      if (isNativeBigIntTypedArray(input)) {
        throw NativeTypeError(
          CANNOT_MIX_BIGINT_AND_OTHER_TYPES
        );
      }
      if (isFloat16Array(input)) {
        return TypedArrayPrototypeSet(
          getFloat16BitsArray(this),
          getFloat16BitsArray(input),
          targetOffset
        );
      }
      if (isNativeTypedArray(input)) {
        const buffer = TypedArrayPrototypeGetBuffer(input);
        if (IsDetachedBuffer(buffer)) {
          throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
        }
      }
      const targetLength = TypedArrayPrototypeGetLength(float16bitsArray);
      const src = NativeObject(input);
      const srcLength = ToLength(src.length);
      if (targetOffset === Infinity || srcLength + targetOffset > targetLength) {
        throw NativeRangeError(OFFSET_IS_OUT_OF_BOUNDS);
      }
      for (let i = 0; i < srcLength; ++i) {
        float16bitsArray[i + targetOffset] = roundToFloat16Bits(src[i]);
      }
    }
    reverse() {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      TypedArrayPrototypeReverse(float16bitsArray);
      return this;
    }
    toReversed() {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      const uint16 = new NativeUint16Array(
        TypedArrayPrototypeGetBuffer(float16bitsArray),
        TypedArrayPrototypeGetByteOffset(float16bitsArray),
        TypedArrayPrototypeGetLength(float16bitsArray)
      );
      const cloned = new Float16Array(
        TypedArrayPrototypeGetBuffer(
          TypedArrayPrototypeSlice(uint16)
        )
      );
      const clonedFloat16bitsArray = getFloat16BitsArray(cloned);
      TypedArrayPrototypeReverse(clonedFloat16bitsArray);
      return cloned;
    }
    fill(value, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      TypedArrayPrototypeFill(
        float16bitsArray,
        roundToFloat16Bits(value),
        ...safeIfNeeded(opts)
      );
      return this;
    }
    copyWithin(target, start, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      TypedArrayPrototypeCopyWithin(float16bitsArray, target, start, ...safeIfNeeded(opts));
      return this;
    }
    sort(compareFn) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      const sortCompare = compareFn !== undefined ? compareFn : defaultCompare;
      TypedArrayPrototypeSort(float16bitsArray, (x, y) => {
        return sortCompare(convertToNumber(x), convertToNumber(y));
      });
      return this;
    }
    toSorted(compareFn) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      if (compareFn !== undefined && typeof compareFn !== "function") {
        throw new NativeTypeError(THE_COMPARISON_FUNCTION_MUST_BE_EITHER_A_FUNCTION_OR_UNDEFINED);
      }
      const sortCompare = compareFn !== undefined ? compareFn : defaultCompare;
      const uint16 = new NativeUint16Array(
        TypedArrayPrototypeGetBuffer(float16bitsArray),
        TypedArrayPrototypeGetByteOffset(float16bitsArray),
        TypedArrayPrototypeGetLength(float16bitsArray)
      );
      const cloned = new Float16Array(
        TypedArrayPrototypeGetBuffer(
          TypedArrayPrototypeSlice(uint16)
        )
      );
      const clonedFloat16bitsArray = getFloat16BitsArray(cloned);
      TypedArrayPrototypeSort(clonedFloat16bitsArray, (x, y) => {
        return sortCompare(convertToNumber(x), convertToNumber(y));
      });
      return cloned;
    }
    slice(start, end) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);
      if (Constructor === Float16Array) {
        const uint16 = new NativeUint16Array(
          TypedArrayPrototypeGetBuffer(float16bitsArray),
          TypedArrayPrototypeGetByteOffset(float16bitsArray),
          TypedArrayPrototypeGetLength(float16bitsArray)
        );
        return new Float16Array(
          TypedArrayPrototypeGetBuffer(
            TypedArrayPrototypeSlice(uint16, start, end)
          )
        );
      }
      const length = TypedArrayPrototypeGetLength(float16bitsArray);
      const relativeStart = ToIntegerOrInfinity(start);
      const relativeEnd = end === undefined ? length : ToIntegerOrInfinity(end);
      let k;
      if (relativeStart === -Infinity) {
        k = 0;
      } else if (relativeStart < 0) {
        k = length + relativeStart > 0 ? length + relativeStart : 0;
      } else {
        k = length < relativeStart ? length : relativeStart;
      }
      let final;
      if (relativeEnd === -Infinity) {
        final = 0;
      } else if (relativeEnd < 0) {
        final = length + relativeEnd > 0 ? length + relativeEnd : 0;
      } else {
        final = length < relativeEnd ? length : relativeEnd;
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
      return  (array);
    }
    subarray(begin, end) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);
      const uint16 = new NativeUint16Array(
        TypedArrayPrototypeGetBuffer(float16bitsArray),
        TypedArrayPrototypeGetByteOffset(float16bitsArray),
        TypedArrayPrototypeGetLength(float16bitsArray)
      );
      const uint16Subarray = TypedArrayPrototypeSubarray(uint16, begin, end);
      const array = new Constructor(
        TypedArrayPrototypeGetBuffer(uint16Subarray),
        TypedArrayPrototypeGetByteOffset(uint16Subarray),
        TypedArrayPrototypeGetLength(uint16Subarray)
      );
      assertSpeciesTypedArray(array);
      return  (array);
    }
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
    join(separator) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      const array = copyToArray(float16bitsArray);
      return ArrayPrototypeJoin(array, separator);
    }
    toLocaleString(...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      const array = copyToArray(float16bitsArray);
      return ArrayPrototypeToLocaleString(array, ...safeIfNeeded(opts));
    }
    get [SymbolToStringTag]() {
      if (isFloat16Array(this)) {
        return  ("Float16Array");
      }
    }
  }
  ObjectDefineProperty(Float16Array, "BYTES_PER_ELEMENT", {
    value: BYTES_PER_ELEMENT,
  });
  ObjectDefineProperty(Float16Array, brand, {});
  ReflectSetPrototypeOf(Float16Array, TypedArray);
  const Float16ArrayPrototype = Float16Array.prototype;
  ObjectDefineProperty(Float16ArrayPrototype, "BYTES_PER_ELEMENT", {
    value: BYTES_PER_ELEMENT,
  });
  ObjectDefineProperty(Float16ArrayPrototype, SymbolIterator, {
    value: Float16ArrayPrototype.values,
    writable: true,
    configurable: true,
  });
  ReflectSetPrototypeOf(Float16ArrayPrototype, TypedArrayPrototype);

  function isTypedArray(target) {
    return isNativeTypedArray(target) || isFloat16Array(target);
  }

  function getFloat16(dataView, byteOffset, ...opts) {
    return convertToNumber(
      DataViewPrototypeGetUint16(dataView, byteOffset, ...safeIfNeeded(opts))
    );
  }
  function setFloat16(dataView, byteOffset, value, ...opts) {
    return DataViewPrototypeSetUint16(
      dataView,
      byteOffset,
      roundToFloat16Bits(value),
      ...safeIfNeeded(opts)
    );
  }

  function f16round(x) {
    return roundToFloat16(x);
  }

  exports.Float16Array = Float16Array;
  exports.f16round = f16round;
  exports.getFloat16 = getFloat16;
  exports.hfround = f16round;
  exports.isFloat16Array = isFloat16Array;
  exports.isTypedArray = isTypedArray;
  exports.setFloat16 = setFloat16;

  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

  return exports;

})({});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXQxNi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL191dGlsL21lc3NhZ2VzLm1qcyIsIi4uL3NyYy9fdXRpbC9wcmltb3JkaWFscy5tanMiLCIuLi9zcmMvX3V0aWwvYXJyYXlJdGVyYXRvci5tanMiLCIuLi9zcmMvX3V0aWwvaXMubWpzIiwiLi4vc3JjL191dGlsL2JyYW5kLm1qcyIsIi4uL3NyYy9fdXRpbC9jb252ZXJ0ZXIubWpzIiwiLi4vc3JjL191dGlsL3NwZWMubWpzIiwiLi4vc3JjL0Zsb2F0MTZBcnJheS5tanMiLCIuLi9zcmMvaXNUeXBlZEFycmF5Lm1qcyIsIi4uL3NyYy9EYXRhVmlldy5tanMiLCIuLi9zcmMvZjE2cm91bmQubWpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBUSElTX0lTX05PVF9BTl9PQkpFQ1QgPSBcIlRoaXMgaXMgbm90IGFuIG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IFRISVNfSVNfTk9UX0FfRkxPQVQxNkFSUkFZX09CSkVDVCA9IFwiVGhpcyBpcyBub3QgYSBGbG9hdDE2QXJyYXkgb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVkgPVxuICBcIlRoaXMgY29uc3RydWN0b3IgaXMgbm90IGEgc3ViY2xhc3Mgb2YgRmxvYXQxNkFycmF5XCI7XG5leHBvcnQgY29uc3QgVEhFX0NPTlNUUlVDVE9SX1BST1BFUlRZX1ZBTFVFX0lTX05PVF9BTl9PQkpFQ1QgPVxuICBcIlRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eSB2YWx1ZSBpcyBub3QgYW4gb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgU1BFQ0lFU19DT05TVFJVQ1RPUl9ESUROVF9SRVRVUk5fVFlQRURBUlJBWV9PQkpFQ1QgPVxuICBcIlNwZWNpZXMgY29uc3RydWN0b3IgZGlkbid0IHJldHVybiBUeXBlZEFycmF5IG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IERFUklWRURfQ09OU1RSVUNUT1JfQ1JFQVRFRF9UWVBFREFSUkFZX09CSkVDVF9XSElDSF9XQVNfVE9PX1NNQUxMX0xFTkdUSCA9XG4gIFwiRGVyaXZlZCBjb25zdHJ1Y3RvciBjcmVhdGVkIFR5cGVkQXJyYXkgb2JqZWN0IHdoaWNoIHdhcyB0b28gc21hbGwgbGVuZ3RoXCI7XG5leHBvcnQgY29uc3QgQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIgPVxuICBcIkF0dGVtcHRpbmcgdG8gYWNjZXNzIGRldGFjaGVkIEFycmF5QnVmZmVyXCI7XG5leHBvcnQgY29uc3QgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUID1cbiAgXCJDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3RcIjtcbmV4cG9ydCBjb25zdCBDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVMgPVxuICBcIkNhbm5vdCBtaXggQmlnSW50IGFuZCBvdGhlciB0eXBlcywgdXNlIGV4cGxpY2l0IGNvbnZlcnNpb25zXCI7XG5leHBvcnQgY29uc3QgSVRFUkFUT1JfUFJPUEVSVFlfSVNfTk9UX0NBTExBQkxFID0gXCJAQGl0ZXJhdG9yIHByb3BlcnR5IGlzIG5vdCBjYWxsYWJsZVwiO1xuZXhwb3J0IGNvbnN0IFJFRFVDRV9PRl9FTVBUWV9BUlJBWV9XSVRIX05PX0lOSVRJQUxfVkFMVUUgPVxuICBcIlJlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWVcIjtcbmV4cG9ydCBjb25zdCBUSEVfQ09NUEFSSVNPTl9GVU5DVElPTl9NVVNUX0JFX0VJVEhFUl9BX0ZVTkNUSU9OX09SX1VOREVGSU5FRCA9XG4gIFwiVGhlIGNvbXBhcmlzb24gZnVuY3Rpb24gbXVzdCBiZSBlaXRoZXIgYSBmdW5jdGlvbiBvciB1bmRlZmluZWRcIjtcbmV4cG9ydCBjb25zdCBPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyA9IFwiT2Zmc2V0IGlzIG91dCBvZiBib3VuZHNcIjtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscywgbm8tcmVzdHJpY3RlZC1zeW50YXggKi9cbi8qIGdsb2JhbCBTaGFyZWRBcnJheUJ1ZmZlciAqL1xuXG5pbXBvcnQgeyBDQU5OT1RfQ09OVkVSVF9VTkRFRklORURfT1JfTlVMTF9UT19PQkpFQ1QgfSBmcm9tIFwiLi9tZXNzYWdlcy5tanNcIjtcblxuLyoqIEB0eXBlIHs8VCBleHRlbmRzICguLi5hcmdzOiBhbnkpID0+IGFueT4odGFyZ2V0OiBUKSA9PiAodGhpc0FyZzogVGhpc1R5cGU8VD4sIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnl9ICovXG5mdW5jdGlvbiB1bmN1cnJ5VGhpcyh0YXJnZXQpIHtcbiAgcmV0dXJuICh0aGlzQXJnLCAuLi5hcmdzKSA9PiB7XG4gICAgcmV0dXJuIFJlZmxlY3RBcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ3MpO1xuICB9O1xufVxuXG4vKiogQHR5cGUgeyh0YXJnZXQ6IGFueSwga2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+ICh0aGlzQXJnOiBhbnksIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnl9ICovXG5mdW5jdGlvbiB1bmN1cnJ5VGhpc0dldHRlcih0YXJnZXQsIGtleSkge1xuICByZXR1cm4gdW5jdXJyeVRoaXMoXG4gICAgUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICAgIHRhcmdldCxcbiAgICAgIGtleVxuICAgICkuZ2V0XG4gICk7XG59XG5cbi8vIFJlZmxlY3RcbmV4cG9ydCBjb25zdCB7XG4gIGFwcGx5OiBSZWZsZWN0QXBwbHksXG4gIGNvbnN0cnVjdDogUmVmbGVjdENvbnN0cnVjdCxcbiAgZGVmaW5lUHJvcGVydHk6IFJlZmxlY3REZWZpbmVQcm9wZXJ0eSxcbiAgZ2V0OiBSZWZsZWN0R2V0LFxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIGdldFByb3RvdHlwZU9mOiBSZWZsZWN0R2V0UHJvdG90eXBlT2YsXG4gIGhhczogUmVmbGVjdEhhcyxcbiAgb3duS2V5czogUmVmbGVjdE93bktleXMsXG4gIHNldDogUmVmbGVjdFNldCxcbiAgc2V0UHJvdG90eXBlT2Y6IFJlZmxlY3RTZXRQcm90b3R5cGVPZixcbn0gPSBSZWZsZWN0O1xuXG4vLyBQcm94eVxuZXhwb3J0IGNvbnN0IE5hdGl2ZVByb3h5ID0gUHJveHk7XG5cbi8vIE51bWJlclxuZXhwb3J0IGNvbnN0IHtcbiAgRVBTSUxPTixcbiAgTUFYX1NBRkVfSU5URUdFUixcbiAgaXNGaW5pdGU6IE51bWJlcklzRmluaXRlLFxuICBpc05hTjogTnVtYmVySXNOYU4sXG59ID0gTnVtYmVyO1xuXG4vLyBTeW1ib2xcbmV4cG9ydCBjb25zdCB7XG4gIGl0ZXJhdG9yOiBTeW1ib2xJdGVyYXRvcixcbiAgc3BlY2llczogU3ltYm9sU3BlY2llcyxcbiAgdG9TdHJpbmdUYWc6IFN5bWJvbFRvU3RyaW5nVGFnLFxuICBmb3I6IFN5bWJvbEZvcixcbn0gPSBTeW1ib2w7XG5cbi8vIE9iamVjdFxuZXhwb3J0IGNvbnN0IE5hdGl2ZU9iamVjdCA9IE9iamVjdDtcbmV4cG9ydCBjb25zdCB7XG4gIGNyZWF0ZTogT2JqZWN0Q3JlYXRlLFxuICBkZWZpbmVQcm9wZXJ0eTogT2JqZWN0RGVmaW5lUHJvcGVydHksXG4gIGZyZWV6ZTogT2JqZWN0RnJlZXplLFxuICBpczogT2JqZWN0SXMsXG59ID0gTmF0aXZlT2JqZWN0O1xuY29uc3QgT2JqZWN0UHJvdG90eXBlID0gTmF0aXZlT2JqZWN0LnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KG9iamVjdDogb2JqZWN0LCBrZXk6IFByb3BlcnR5S2V5KSA9PiBGdW5jdGlvbiB8IHVuZGVmaW5lZH0gKi9cbmV4cG9ydCBjb25zdCBPYmplY3RQcm90b3R5cGVfX2xvb2t1cEdldHRlcl9fID0gLyoqIEB0eXBlIHthbnl9ICovIChPYmplY3RQcm90b3R5cGUpLl9fbG9va3VwR2V0dGVyX19cbiAgPyB1bmN1cnJ5VGhpcygvKiogQHR5cGUge2FueX0gKi8gKE9iamVjdFByb3RvdHlwZSkuX19sb29rdXBHZXR0ZXJfXylcbiAgOiAob2JqZWN0LCBrZXkpID0+IHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUXG4gICAgICApO1xuICAgIH1cblxuICAgIGxldCB0YXJnZXQgPSBOYXRpdmVPYmplY3Qob2JqZWN0KTtcbiAgICBkbyB7XG4gICAgICBjb25zdCBkZXNjcmlwdG9yID0gUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gICAgICBpZiAoZGVzY3JpcHRvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChPYmplY3RIYXNPd24oZGVzY3JpcHRvciwgXCJnZXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSB3aGlsZSAoKHRhcmdldCA9IFJlZmxlY3RHZXRQcm90b3R5cGVPZih0YXJnZXQpKSAhPT0gbnVsbCk7XG4gIH07XG4vKiogQHR5cGUgeyhvYmplY3Q6IG9iamVjdCwga2V5OiBQcm9wZXJ0eUtleSkgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBPYmplY3RIYXNPd24gPSAvKiogQHR5cGUge2FueX0gKi8gKE5hdGl2ZU9iamVjdCkuaGFzT3duIHx8XG4gIHVuY3VycnlUaGlzKE9iamVjdFByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG5cbi8vIEFycmF5XG5jb25zdCBOYXRpdmVBcnJheSA9IEFycmF5O1xuZXhwb3J0IGNvbnN0IEFycmF5SXNBcnJheSA9IE5hdGl2ZUFycmF5LmlzQXJyYXk7XG5jb25zdCBBcnJheVByb3RvdHlwZSA9IE5hdGl2ZUFycmF5LnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KGFycmF5OiBBcnJheUxpa2U8dW5rbm93bj4sIHNlcGFyYXRvcj86IHN0cmluZykgPT4gc3RyaW5nfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5UHJvdG90eXBlSm9pbiA9IHVuY3VycnlUaGlzKEFycmF5UHJvdG90eXBlLmpvaW4pO1xuLyoqIEB0eXBlIHs8VD4oYXJyYXk6IFRbXSwgLi4uaXRlbXM6IFRbXSkgPT4gbnVtYmVyfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5UHJvdG90eXBlUHVzaCA9IHVuY3VycnlUaGlzKEFycmF5UHJvdG90eXBlLnB1c2gpO1xuLyoqIEB0eXBlIHsoYXJyYXk6IEFycmF5TGlrZTx1bmtub3duPiwgLi4ub3B0czogYW55W10pID0+IHN0cmluZ30gKi9cbmV4cG9ydCBjb25zdCBBcnJheVByb3RvdHlwZVRvTG9jYWxlU3RyaW5nID0gdW5jdXJyeVRoaXMoXG4gIEFycmF5UHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nXG4pO1xuZXhwb3J0IGNvbnN0IE5hdGl2ZUFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IgPSBBcnJheVByb3RvdHlwZVtTeW1ib2xJdGVyYXRvcl07XG4vKiogQHR5cGUgezxUPihhcnJheTogVFtdKSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFQ+fSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IgPSB1bmN1cnJ5VGhpcyhOYXRpdmVBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yKTtcblxuLy8gTWF0aFxuZXhwb3J0IGNvbnN0IHtcbiAgYWJzOiBNYXRoQWJzLFxuICB0cnVuYzogTWF0aFRydW5jLFxufSA9IE1hdGg7XG5cbi8vIEFycmF5QnVmZmVyXG5leHBvcnQgY29uc3QgTmF0aXZlQXJyYXlCdWZmZXIgPSBBcnJheUJ1ZmZlcjtcbmV4cG9ydCBjb25zdCBBcnJheUJ1ZmZlcklzVmlldyA9IE5hdGl2ZUFycmF5QnVmZmVyLmlzVmlldztcbmNvbnN0IEFycmF5QnVmZmVyUHJvdG90eXBlID0gTmF0aXZlQXJyYXlCdWZmZXIucHJvdG90eXBlO1xuLyoqIEB0eXBlIHsoYnVmZmVyOiBBcnJheUJ1ZmZlciwgYmVnaW4/OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gbnVtYmVyfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5QnVmZmVyUHJvdG90eXBlU2xpY2UgPSB1bmN1cnJ5VGhpcyhBcnJheUJ1ZmZlclByb3RvdHlwZS5zbGljZSk7XG4vKiogQHR5cGUgeyhidWZmZXI6IEFycmF5QnVmZmVyKSA9PiBBcnJheUJ1ZmZlcn0gKi9cbmV4cG9ydCBjb25zdCBBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGggPSB1bmN1cnJ5VGhpc0dldHRlcihBcnJheUJ1ZmZlclByb3RvdHlwZSwgXCJieXRlTGVuZ3RoXCIpO1xuXG4vLyBTaGFyZWRBcnJheUJ1ZmZlclxuZXhwb3J0IGNvbnN0IE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyID0gdHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyICE9PSBcInVuZGVmaW5lZFwiID8gU2hhcmVkQXJyYXlCdWZmZXIgOiBudWxsO1xuLyoqIEB0eXBlIHsoYnVmZmVyOiBTaGFyZWRBcnJheUJ1ZmZlcikgPT4gU2hhcmVkQXJyYXlCdWZmZXJ9ICovXG5leHBvcnQgY29uc3QgU2hhcmVkQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoID0gTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXJcbiAgJiYgdW5jdXJyeVRoaXNHZXR0ZXIoTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXIucHJvdG90eXBlLCBcImJ5dGVMZW5ndGhcIik7XG5cbi8vIFR5cGVkQXJyYXlcbi8qKiBAdHlwZWRlZiB7VWludDhBcnJheXxVaW50OENsYW1wZWRBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxJbnQ4QXJyYXl8SW50MTZBcnJheXxJbnQzMkFycmF5fEZsb2F0MzJBcnJheXxGbG9hdDY0QXJyYXl8QmlnVWludDY0QXJyYXl8QmlnSW50NjRBcnJheX0gVHlwZWRBcnJheSAqL1xuLyoqIEB0eXBlIHthbnl9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheSA9IFJlZmxlY3RHZXRQcm90b3R5cGVPZihVaW50OEFycmF5KTtcbmNvbnN0IFR5cGVkQXJyYXlGcm9tID0gVHlwZWRBcnJheS5mcm9tO1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGUgPSBUeXBlZEFycmF5LnByb3RvdHlwZTtcbmV4cG9ydCBjb25zdCBOYXRpdmVUeXBlZEFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IgPSBUeXBlZEFycmF5UHJvdG90eXBlW1N5bWJvbEl0ZXJhdG9yXTtcbi8qKiBAdHlwZSB7KHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IEl0ZXJhYmxlSXRlcmF0b3I8bnVtYmVyPn0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlS2V5cyA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUua2V5cyk7XG4vKiogQHR5cGUgeyh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBJdGVyYWJsZUl0ZXJhdG9yPG51bWJlcj59ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVZhbHVlcyA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLnZhbHVlc1xuKTtcbi8qKiBAdHlwZSB7KHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IEl0ZXJhYmxlSXRlcmF0b3I8W251bWJlciwgbnVtYmVyXT59ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUVudHJpZXMgPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS5lbnRyaWVzXG4pO1xuLyoqIEB0eXBlIHsodHlwZWRBcnJheTogVHlwZWRBcnJheSwgYXJyYXk6IEFycmF5TGlrZTxudW1iZXI+LCBvZmZzZXQ/OiBudW1iZXIpID0+IHZvaWR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVNldCA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUuc2V0KTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBUKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVSZXZlcnNlID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUucmV2ZXJzZVxuKTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCB2YWx1ZTogbnVtYmVyLCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVGaWxsID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5maWxsKTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCB0YXJnZXQ6IG51bWJlciwgc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVDb3B5V2l0aGluID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUuY29weVdpdGhpblxuKTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCBjb21wYXJlRm4/OiAoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlU29ydCA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUuc29ydCk7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlU2xpY2UgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLnNsaWNlKTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVTdWJhcnJheSA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLnN1YmFycmF5XG4pO1xuLyoqIEB0eXBlIHsoKHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IEFycmF5QnVmZmVyKX0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyID0gdW5jdXJyeVRoaXNHZXR0ZXIoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUsXG4gIFwiYnVmZmVyXCJcbik7XG4vKiogQHR5cGUgeygodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gbnVtYmVyKX0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldCA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBcImJ5dGVPZmZzZXRcIlxuKTtcbi8qKiBAdHlwZSB7KCh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBudW1iZXIpfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGggPSB1bmN1cnJ5VGhpc0dldHRlcihcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgXCJsZW5ndGhcIlxuKTtcbi8qKiBAdHlwZSB7KHRhcmdldDogdW5rbm93bikgPT4gc3RyaW5nfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBTeW1ib2xUb1N0cmluZ1RhZ1xuKTtcblxuLy8gVWludDhBcnJheVxuZXhwb3J0IGNvbnN0IE5hdGl2ZVVpbnQ4QXJyYXkgPSBVaW50OEFycmF5O1xuXG4vLyBVaW50MTZBcnJheVxuZXhwb3J0IGNvbnN0IE5hdGl2ZVVpbnQxNkFycmF5ID0gVWludDE2QXJyYXk7XG4vKiogQHR5cGUge1VpbnQxNkFycmF5Q29uc3RydWN0b3JbXCJmcm9tXCJdfSAqL1xuZXhwb3J0IGNvbnN0IFVpbnQxNkFycmF5RnJvbSA9ICguLi5hcmdzKSA9PiB7XG4gIHJldHVybiBSZWZsZWN0QXBwbHkoVHlwZWRBcnJheUZyb20sIE5hdGl2ZVVpbnQxNkFycmF5LCBhcmdzKTtcbn07XG5cbi8vIFVpbnQzMkFycmF5XG5leHBvcnQgY29uc3QgTmF0aXZlVWludDMyQXJyYXkgPSBVaW50MzJBcnJheTtcblxuLy8gRmxvYXQzMkFycmF5XG5leHBvcnQgY29uc3QgTmF0aXZlRmxvYXQzMkFycmF5ID0gRmxvYXQzMkFycmF5O1xuXG4vLyBBcnJheUl0ZXJhdG9yXG4vKiogQHR5cGUge2FueX0gKi9cbmV4cG9ydCBjb25zdCBBcnJheUl0ZXJhdG9yUHJvdG90eXBlID0gUmVmbGVjdEdldFByb3RvdHlwZU9mKFtdW1N5bWJvbEl0ZXJhdG9yXSgpKTtcbi8qKiBAdHlwZSB7PFQ+KGFycmF5SXRlcmF0b3I6IEl0ZXJhYmxlSXRlcmF0b3I8VD4pID0+IEl0ZXJhdG9yUmVzdWx0PFQ+fSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5SXRlcmF0b3JQcm90b3R5cGVOZXh0ID0gdW5jdXJyeVRoaXMoQXJyYXlJdGVyYXRvclByb3RvdHlwZS5uZXh0KTtcblxuLy8gR2VuZXJhdG9yXG4vKiogQHR5cGUgezxUID0gdW5rbm93biwgVFJldHVybiA9IGFueSwgVE5leHQgPSB1bmtub3duPihnZW5lcmF0b3I6IEdlbmVyYXRvcjxULCBUUmV0dXJuLCBUTmV4dD4sIHZhbHVlPzogVE5leHQpID0+IFR9ICovXG5leHBvcnQgY29uc3QgR2VuZXJhdG9yUHJvdG90eXBlTmV4dCA9IHVuY3VycnlUaGlzKChmdW5jdGlvbiogKCkge30pKCkubmV4dCk7XG5cbi8vIEl0ZXJhdG9yXG5leHBvcnQgY29uc3QgSXRlcmF0b3JQcm90b3R5cGUgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YoQXJyYXlJdGVyYXRvclByb3RvdHlwZSk7XG5cbi8vIERhdGFWaWV3XG5jb25zdCBEYXRhVmlld1Byb3RvdHlwZSA9IERhdGFWaWV3LnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KGRhdGFWaWV3OiBEYXRhVmlldywgYnl0ZU9mZnNldDogbnVtYmVyLCBsaXR0bGVFbmRpYW4/OiBib29sZWFuKSA9PiBudW1iZXJ9ICovXG5leHBvcnQgY29uc3QgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYgPSB1bmN1cnJ5VGhpcyhcbiAgRGF0YVZpZXdQcm90b3R5cGUuZ2V0VWludDE2XG4pO1xuLyoqIEB0eXBlIHsoZGF0YVZpZXc6IERhdGFWaWV3LCBieXRlT2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIGxpdHRsZUVuZGlhbj86IGJvb2xlYW4pID0+IHZvaWR9ICovXG5leHBvcnQgY29uc3QgRGF0YVZpZXdQcm90b3R5cGVTZXRVaW50MTYgPSB1bmN1cnJ5VGhpcyhcbiAgRGF0YVZpZXdQcm90b3R5cGUuc2V0VWludDE2XG4pO1xuXG4vLyBFcnJvclxuZXhwb3J0IGNvbnN0IE5hdGl2ZVR5cGVFcnJvciA9IFR5cGVFcnJvcjtcbmV4cG9ydCBjb25zdCBOYXRpdmVSYW5nZUVycm9yID0gUmFuZ2VFcnJvcjtcblxuLy8gV2Vha1NldFxuLyoqXG4gKiBEbyBub3QgY29uc3RydWN0IHdpdGggYXJndW1lbnRzIHRvIGF2b2lkIGNhbGxpbmcgdGhlIFwiYWRkXCIgbWV0aG9kXG4gKiBAdHlwZSB7e25ldyA8VCBleHRlbmRzIHt9PigpOiBXZWFrU2V0PFQ+fX1cbiAqL1xuZXhwb3J0IGNvbnN0IE5hdGl2ZVdlYWtTZXQgPSBXZWFrU2V0O1xuY29uc3QgV2Vha1NldFByb3RvdHlwZSA9IE5hdGl2ZVdlYWtTZXQucHJvdG90eXBlO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIHt9PihzZXQ6IFdlYWtTZXQ8VD4sIHZhbHVlOiBUKSA9PiBTZXQ8VD59ICovXG5leHBvcnQgY29uc3QgV2Vha1NldFByb3RvdHlwZUFkZCA9IHVuY3VycnlUaGlzKFdlYWtTZXRQcm90b3R5cGUuYWRkKTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyB7fT4oc2V0OiBXZWFrU2V0PFQ+LCB2YWx1ZTogVCkgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBXZWFrU2V0UHJvdG90eXBlSGFzID0gdW5jdXJyeVRoaXMoV2Vha1NldFByb3RvdHlwZS5oYXMpO1xuXG4vLyBXZWFrTWFwXG4vKipcbiAqIERvIG5vdCBjb25zdHJ1Y3Qgd2l0aCBhcmd1bWVudHMgdG8gYXZvaWQgY2FsbGluZyB0aGUgXCJzZXRcIiBtZXRob2RcbiAqIEB0eXBlIHt7bmV3IDxLIGV4dGVuZHMge30sIFY+KCk6IFdlYWtNYXA8SywgVj59fVxuICovXG5leHBvcnQgY29uc3QgTmF0aXZlV2Vha01hcCA9IFdlYWtNYXA7XG5jb25zdCBXZWFrTWFwUHJvdG90eXBlID0gTmF0aXZlV2Vha01hcC5wcm90b3R5cGU7XG4vKiogQHR5cGUgezxLIGV4dGVuZHMge30sIFY+KHdlYWtNYXA6IFdlYWtNYXA8SywgVj4sIGtleTogSykgPT4gVn0gKi9cbmV4cG9ydCBjb25zdCBXZWFrTWFwUHJvdG90eXBlR2V0ID0gdW5jdXJyeVRoaXMoV2Vha01hcFByb3RvdHlwZS5nZXQpO1xuLyoqIEB0eXBlIHs8SyBleHRlbmRzIHt9LCBWPih3ZWFrTWFwOiBXZWFrTWFwPEssIFY+LCBrZXk6IEspID0+IGJvb2xlYW59ICovXG5leHBvcnQgY29uc3QgV2Vha01hcFByb3RvdHlwZUhhcyA9IHVuY3VycnlUaGlzKFdlYWtNYXBQcm90b3R5cGUuaGFzKTtcbi8qKiBAdHlwZSB7PEsgZXh0ZW5kcyB7fSwgVj4od2Vha01hcDogV2Vha01hcDxLLCBWPiwga2V5OiBLLCB2YWx1ZTogVikgPT4gV2Vha01hcH0gKi9cbmV4cG9ydCBjb25zdCBXZWFrTWFwUHJvdG90eXBlU2V0ID0gdW5jdXJyeVRoaXMoV2Vha01hcFByb3RvdHlwZS5zZXQpO1xuIiwiaW1wb3J0IHtcbiAgQXJyYXlJdGVyYXRvclByb3RvdHlwZSxcbiAgQXJyYXlJdGVyYXRvclByb3RvdHlwZU5leHQsXG4gIEFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IsXG4gIEdlbmVyYXRvclByb3RvdHlwZU5leHQsXG4gIEl0ZXJhdG9yUHJvdG90eXBlLFxuICBOYXRpdmVBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yLFxuICBOYXRpdmVXZWFrTWFwLFxuICBPYmplY3RDcmVhdGUsXG4gIE9iamVjdERlZmluZVByb3BlcnR5LFxuICBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICBSZWZsZWN0T3duS2V5cyxcbiAgU3ltYm9sSXRlcmF0b3IsXG4gIFdlYWtNYXBQcm90b3R5cGVHZXQsXG4gIFdlYWtNYXBQcm90b3R5cGVTZXQsXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKiogQHR5cGUge1dlYWtNYXA8e30sIEl0ZXJhYmxlSXRlcmF0b3I8YW55Pj59ICovXG5jb25zdCBhcnJheUl0ZXJhdG9ycyA9IG5ldyBOYXRpdmVXZWFrTWFwKCk7XG5cbmNvbnN0IFNhZmVJdGVyYXRvclByb3RvdHlwZSA9IE9iamVjdENyZWF0ZShudWxsLCB7XG4gIG5leHQ6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIGNvbnN0IGFycmF5SXRlcmF0b3IgPSBXZWFrTWFwUHJvdG90eXBlR2V0KGFycmF5SXRlcmF0b3JzLCB0aGlzKTtcbiAgICAgIHJldHVybiBBcnJheUl0ZXJhdG9yUHJvdG90eXBlTmV4dChhcnJheUl0ZXJhdG9yKTtcbiAgICB9LFxuICB9LFxuXG4gIFtTeW1ib2xJdGVyYXRvcl06IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWVzKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgfSxcbn0pO1xuXG4vKipcbiAqIFdyYXAgdGhlIEFycmF5IGFyb3VuZCB0aGUgU2FmZUl0ZXJhdG9yIElmIEFycmF5LnByb3RvdHlwZSBbQEBpdGVyYXRvcl0gaGFzIGJlZW4gbW9kaWZpZWRcbiAqIEB0eXBlIHs8VD4oYXJyYXk6IFRbXSkgPT4gSXRlcmFibGU8VD59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYWZlSWZOZWVkZWQoYXJyYXkpIHtcbiAgaWYgKFxuICAgIGFycmF5W1N5bWJvbEl0ZXJhdG9yXSA9PT0gTmF0aXZlQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvciAmJlxuICAgIEFycmF5SXRlcmF0b3JQcm90b3R5cGUubmV4dCA9PT0gQXJyYXlJdGVyYXRvclByb3RvdHlwZU5leHRcbiAgKSB7XG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgY29uc3Qgc2FmZSA9IE9iamVjdENyZWF0ZShTYWZlSXRlcmF0b3JQcm90b3R5cGUpO1xuICBXZWFrTWFwUHJvdG90eXBlU2V0KGFycmF5SXRlcmF0b3JzLCBzYWZlLCBBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yKGFycmF5KSk7XG4gIHJldHVybiBzYWZlO1xufVxuXG4vKiogQHR5cGUge1dlYWtNYXA8e30sIEdlbmVyYXRvcjxhbnk+Pn0gKi9cbmNvbnN0IGdlbmVyYXRvcnMgPSBuZXcgTmF0aXZlV2Vha01hcCgpO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSVhcnJheWl0ZXJhdG9ycHJvdG90eXBlJS1vYmplY3QgKi9cbmNvbnN0IER1bW15QXJyYXlJdGVyYXRvclByb3RvdHlwZSA9IE9iamVjdENyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge1xuICBuZXh0OiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICBjb25zdCBnZW5lcmF0b3IgPSBXZWFrTWFwUHJvdG90eXBlR2V0KGdlbmVyYXRvcnMsIHRoaXMpO1xuICAgICAgcmV0dXJuIEdlbmVyYXRvclByb3RvdHlwZU5leHQoZ2VuZXJhdG9yKTtcbiAgICB9LFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgfSxcbn0pO1xuXG5mb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0T3duS2V5cyhBcnJheUl0ZXJhdG9yUHJvdG90eXBlKSkge1xuICAvLyBuZXh0IG1ldGhvZCBoYXMgYWxyZWFkeSBkZWZpbmVkXG4gIGlmIChrZXkgPT09IFwibmV4dFwiKSB7XG4gICAgY29udGludWU7XG4gIH1cblxuICAvLyBDb3B5IEFycmF5SXRlcmF0b3JQcm90b3R5cGUgZGVzY3JpcHRvcnMgdG8gRHVtbXlBcnJheUl0ZXJhdG9yUHJvdG90eXBlXG4gIE9iamVjdERlZmluZVByb3BlcnR5KER1bW15QXJyYXlJdGVyYXRvclByb3RvdHlwZSwga2V5LCBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEFycmF5SXRlcmF0b3JQcm90b3R5cGUsIGtleSkpO1xufVxuXG4vKipcbiAqIFdyYXAgdGhlIEdlbmVyYXRvciBhcm91bmQgdGhlIGR1bW15IEFycmF5SXRlcmF0b3JcbiAqIEB0eXBlIHs8VD4oZ2VuZXJhdG9yOiBHZW5lcmF0b3I8VD4pID0+IEl0ZXJhYmxlSXRlcmF0b3I8VD59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3cmFwKGdlbmVyYXRvcikge1xuICBjb25zdCBkdW1teSA9IE9iamVjdENyZWF0ZShEdW1teUFycmF5SXRlcmF0b3JQcm90b3R5cGUpO1xuICBXZWFrTWFwUHJvdG90eXBlU2V0KGdlbmVyYXRvcnMsIGR1bW15LCBnZW5lcmF0b3IpO1xuICByZXR1cm4gZHVtbXk7XG59XG4iLCJpbXBvcnQge1xuICBBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGgsXG4gIEFycmF5SXNBcnJheSxcbiAgQXJyYXlJdGVyYXRvclByb3RvdHlwZSxcbiAgQXJyYXlJdGVyYXRvclByb3RvdHlwZU5leHQsXG4gIE1hdGhUcnVuYyxcbiAgTmF0aXZlQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvcixcbiAgTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXIsXG4gIE5hdGl2ZVR5cGVkQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvcixcbiAgTnVtYmVySXNGaW5pdGUsXG4gIFNoYXJlZEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCxcbiAgU3ltYm9sSXRlcmF0b3IsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyxcbn0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHt9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIChcbiAgICAodmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB8fFxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHt9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCI7XG59XG5cbi8vIEluc3BpcmVkIGJ5IHV0aWwudHlwZXMgaW1wbGVtZW50YXRpb24gb2YgTm9kZS5qc1xuLyoqIEB0eXBlZGVmIHtVaW50OEFycmF5fFVpbnQ4Q2xhbXBlZEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fEludDhBcnJheXxJbnQxNkFycmF5fEludDMyQXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheXxCaWdVaW50NjRBcnJheXxCaWdJbnQ2NEFycmF5fSBUeXBlZEFycmF5ICovXG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIFR5cGVkQXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05hdGl2ZVR5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyh2YWx1ZSkgIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgQmlnSW50NjRBcnJheXxCaWdVaW50NjRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTmF0aXZlQmlnSW50VHlwZWRBcnJheSh2YWx1ZSkge1xuICBjb25zdCB0eXBlZEFycmF5TmFtZSA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyh2YWx1ZSk7XG4gIHJldHVybiAoXG4gICAgdHlwZWRBcnJheU5hbWUgPT09IFwiQmlnSW50NjRBcnJheVwiIHx8XG4gICAgdHlwZWRBcnJheU5hbWUgPT09IFwiQmlnVWludDY0QXJyYXlcIlxuICApO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBBcnJheUJ1ZmZlcn1cbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWx1ZSkge1xuICB0cnkge1xuICAgIC8vIEFycmF5QnVmZmVycyBhcmUgbmV2ZXIgYXJyYXlzXG4gICAgaWYgKEFycmF5SXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoKC8qKiBAdHlwZSB7YW55fSAqLyAodmFsdWUpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBTaGFyZWRBcnJheUJ1ZmZlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhcmVkQXJyYXlCdWZmZXIodmFsdWUpIHtcbiAgaWYgKE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBTaGFyZWRBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGgoLyoqIEB0eXBlIHthbnl9ICovICh2YWx1ZSkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIEFycmF5QnVmZmVyfFNoYXJlZEFycmF5QnVmZmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBbnlBcnJheUJ1ZmZlcih2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheUJ1ZmZlcih2YWx1ZSkgfHwgaXNTaGFyZWRBcnJheUJ1ZmZlcih2YWx1ZSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHVua25vd25bXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3JkaW5hcnlBcnJheSh2YWx1ZSkge1xuICBpZiAoIUFycmF5SXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBWZXJpZnkgdGhhdCB0aGVyZSBhcmUgbm8gY2hhbmdlcyBpbiBBcnJheUl0ZXJhdG9yXG4gIHJldHVybiAoXG4gICAgdmFsdWVbU3ltYm9sSXRlcmF0b3JdID09PSBOYXRpdmVBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yICYmXG4gICAgQXJyYXlJdGVyYXRvclByb3RvdHlwZS5uZXh0ID09PSBBcnJheUl0ZXJhdG9yUHJvdG90eXBlTmV4dFxuICApO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBUeXBlZEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPcmRpbmFyeU5hdGl2ZVR5cGVkQXJyYXkodmFsdWUpIHtcbiAgaWYgKCFpc05hdGl2ZVR5cGVkQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gVmVyaWZ5IHRoYXQgdGhlcmUgYXJlIG5vIGNoYW5nZXMgaW4gQXJyYXlJdGVyYXRvclxuICByZXR1cm4gKFxuICAgIHZhbHVlW1N5bWJvbEl0ZXJhdG9yXSA9PT0gTmF0aXZlVHlwZWRBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yICYmXG4gICAgQXJyYXlJdGVyYXRvclByb3RvdHlwZS5uZXh0ID09PSBBcnJheUl0ZXJhdG9yUHJvdG90eXBlTmV4dFxuICApO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgbnVtYmVyID0gK3ZhbHVlO1xuICBpZiAodmFsdWUgIT09IG51bWJlciArIFwiXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU51bWJlcklzRmluaXRlKG51bWJlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gbnVtYmVyID09PSBNYXRoVHJ1bmMobnVtYmVyKTtcbn1cbiIsImltcG9ydCB7IGlzT2JqZWN0LCBpc09iamVjdExpa2UgfSBmcm9tIFwiLi9pcy5tanNcIjtcbmltcG9ydCB7IFRIRV9DT05TVFJVQ1RPUl9QUk9QRVJUWV9WQUxVRV9JU19OT1RfQU5fT0JKRUNUIH0gZnJvbSBcIi4vbWVzc2FnZXMubWpzXCI7XG5pbXBvcnQgeyBOYXRpdmVUeXBlRXJyb3IsIFJlZmxlY3RHZXRQcm90b3R5cGVPZiwgUmVmbGVjdEhhcywgU3ltYm9sRm9yIH0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbmV4cG9ydCBjb25zdCBicmFuZCA9IFN5bWJvbEZvcihcIl9fRmxvYXQxNkFycmF5X19cIik7XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzRmxvYXQxNkFycmF5QnJhbmQodGFyZ2V0KSB7XG4gIGlmICghaXNPYmplY3RMaWtlKHRhcmdldCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBwcm90b3R5cGUgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcbiAgaWYgKCFpc09iamVjdExpa2UocHJvdG90eXBlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGNvbnN0cnVjdG9yID0gcHJvdG90eXBlLmNvbnN0cnVjdG9yO1xuICBpZiAoY29uc3RydWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KGNvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSEVfQ09OU1RSVUNUT1JfUFJPUEVSVFlfVkFMVUVfSVNfTk9UX0FOX09CSkVDVCk7XG4gIH1cblxuICByZXR1cm4gUmVmbGVjdEhhcyhjb25zdHJ1Y3RvciwgYnJhbmQpO1xufVxuIiwiaW1wb3J0IHtcbiAgRVBTSUxPTixcbiAgTWF0aEFicyxcbiAgTmF0aXZlQXJyYXlCdWZmZXIsXG4gIE5hdGl2ZUZsb2F0MzJBcnJheSxcbiAgTmF0aXZlVWludDE2QXJyYXksXG4gIE5hdGl2ZVVpbnQzMkFycmF5LFxuICBOYXRpdmVVaW50OEFycmF5LFxuICBOdW1iZXJJc0Zpbml0ZSxcbiAgTnVtYmVySXNOYU4sXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG5jb25zdCBJTlZFUlNFX09GX0VQU0lMT04gPSAxIC8gRVBTSUxPTjtcblxuLyoqXG4gKiByb3VuZHMgdG8gdGhlIG5lYXJlc3QgdmFsdWU7XG4gKiBpZiB0aGUgbnVtYmVyIGZhbGxzIG1pZHdheSwgaXQgaXMgcm91bmRlZCB0byB0aGUgbmVhcmVzdCB2YWx1ZSB3aXRoIGFuIGV2ZW4gbGVhc3Qgc2lnbmlmaWNhbnQgZGlnaXRcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIHJvdW5kVGllc1RvRXZlbihudW0pIHtcbiAgcmV0dXJuIChudW0gKyBJTlZFUlNFX09GX0VQU0lMT04pIC0gSU5WRVJTRV9PRl9FUFNJTE9OO1xufVxuXG5jb25zdCBGTE9BVDE2X01JTl9WQUxVRSA9IDYuMTAzNTE1NjI1ZS0wNTtcbmNvbnN0IEZMT0FUMTZfTUFYX1ZBTFVFID0gNjU1MDQ7XG5jb25zdCBGTE9BVDE2X0VQU0lMT04gPSAwLjAwMDk3NjU2MjU7XG5cbmNvbnN0IEZMT0FUMTZfRVBTSUxPTl9NVUxUSVBMSUVEX0JZX0ZMT0FUMTZfTUlOX1ZBTFVFID0gRkxPQVQxNl9FUFNJTE9OICogRkxPQVQxNl9NSU5fVkFMVUU7XG5jb25zdCBGTE9BVDE2X0VQU0lMT05fREVWSURFRF9CWV9FUFNJTE9OID0gRkxPQVQxNl9FUFNJTE9OICogSU5WRVJTRV9PRl9FUFNJTE9OO1xuXG4vKipcbiAqIHJvdW5kIGEgbnVtYmVyIHRvIGEgaGFsZiBmbG9hdCBudW1iZXJcbiAqIEBwYXJhbSB7dW5rbm93bn0gbnVtIC0gZG91YmxlIGZsb2F0XG4gKiBAcmV0dXJucyB7bnVtYmVyfSBoYWxmIGZsb2F0IG51bWJlclxuICovXG5leHBvcnQgZnVuY3Rpb24gcm91bmRUb0Zsb2F0MTYobnVtKSB7XG4gIGNvbnN0IG51bWJlciA9ICtudW07XG5cbiAgLy8gTmFOLCBJbmZpbml0eSwgLUluZmluaXR5LCAwLCAtMFxuICBpZiAoIU51bWJlcklzRmluaXRlKG51bWJlcikgfHwgbnVtYmVyID09PSAwKSB7XG4gICAgcmV0dXJuIG51bWJlcjtcbiAgfVxuXG4gIC8vIGZpbml0ZSBleGNlcHQgMCwgLTBcbiAgY29uc3Qgc2lnbiA9IG51bWJlciA+IDAgPyAxIDogLTE7XG4gIGNvbnN0IGFic29sdXRlID0gTWF0aEFicyhudW1iZXIpO1xuXG4gIC8vIHNtYWxsIG51bWJlclxuICBpZiAoYWJzb2x1dGUgPCBGTE9BVDE2X01JTl9WQUxVRSkge1xuICAgIHJldHVybiBzaWduICogcm91bmRUaWVzVG9FdmVuKGFic29sdXRlIC8gRkxPQVQxNl9FUFNJTE9OX01VTFRJUExJRURfQllfRkxPQVQxNl9NSU5fVkFMVUUpICogRkxPQVQxNl9FUFNJTE9OX01VTFRJUExJRURfQllfRkxPQVQxNl9NSU5fVkFMVUU7XG4gIH1cblxuICBjb25zdCB0ZW1wID0gKDEgKyBGTE9BVDE2X0VQU0lMT05fREVWSURFRF9CWV9FUFNJTE9OKSAqIGFic29sdXRlO1xuICBjb25zdCByZXN1bHQgPSB0ZW1wIC0gKHRlbXAgLSBhYnNvbHV0ZSk7XG5cbiAgLy8gbGFyZ2UgbnVtYmVyXG4gIGlmIChyZXN1bHQgPiBGTE9BVDE2X01BWF9WQUxVRSB8fCBOdW1iZXJJc05hTihyZXN1bHQpKSB7XG4gICAgcmV0dXJuIHNpZ24gKiBJbmZpbml0eTtcbiAgfVxuXG4gIHJldHVybiBzaWduICogcmVzdWx0O1xufVxuXG4vLyBiYXNlIGFsZ29yaXRobTogaHR0cDovL2ZveC10b29sa2l0Lm9yZy9mdHAvZmFzdGhhbGZmbG9hdGNvbnZlcnNpb24ucGRmXG5cbmNvbnN0IGJ1ZmZlciA9IG5ldyBOYXRpdmVBcnJheUJ1ZmZlcig0KTtcbmNvbnN0IGZsb2F0VmlldyA9IG5ldyBOYXRpdmVGbG9hdDMyQXJyYXkoYnVmZmVyKTtcbmNvbnN0IHVpbnQzMlZpZXcgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoYnVmZmVyKTtcblxuY29uc3QgYmFzZVRhYmxlID0gbmV3IE5hdGl2ZVVpbnQxNkFycmF5KDUxMik7XG5jb25zdCBzaGlmdFRhYmxlID0gbmV3IE5hdGl2ZVVpbnQ4QXJyYXkoNTEyKTtcblxuZm9yIChsZXQgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBjb25zdCBlID0gaSAtIDEyNztcblxuICAvLyB2ZXJ5IHNtYWxsIG51bWJlciAoMCwgLTApXG4gIGlmIChlIDwgLTI0KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAweDAwMDA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gMjQ7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgLy8gc21hbGwgbnVtYmVyIChkZW5vcm0pXG4gIH0gZWxzZSBpZiAoZSA8IC0xNCkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gIDB4MDQwMCA+PiAoLWUgLSAxNCk7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAoMHgwNDAwID4+ICgtZSAtIDE0KSkgfCAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gLWUgLSAxO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IC1lIC0gMTtcblxuICAvLyBub3JtYWwgbnVtYmVyXG4gIH0gZWxzZSBpZiAoZSA8PSAxNSkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gIChlICsgMTUpIDw8IDEwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gKChlICsgMTUpIDw8IDEwKSB8IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAxMztcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcblxuICAvLyBsYXJnZSBudW1iZXIgKEluZmluaXR5LCAtSW5maW5pdHkpXG4gIH0gZWxzZSBpZiAoZSA8IDEyOCkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gMHg3YzAwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDI0O1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDI0O1xuXG4gIC8vIHN0YXkgKE5hTiwgSW5maW5pdHksIC1JbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBiYXNlVGFibGVbaV0gICAgICAgICA9IDB4N2MwMDtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ZmMwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAxMztcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcbiAgfVxufVxuXG4vKipcbiAqIHJvdW5kIGEgbnVtYmVyIHRvIGEgaGFsZiBmbG9hdCBudW1iZXIgYml0c1xuICogQHBhcmFtIHt1bmtub3dufSBudW0gLSBkb3VibGUgZmxvYXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kVG9GbG9hdDE2Qml0cyhudW0pIHtcbiAgZmxvYXRWaWV3WzBdID0gcm91bmRUb0Zsb2F0MTYobnVtKTtcbiAgY29uc3QgZiA9IHVpbnQzMlZpZXdbMF07XG4gIGNvbnN0IGUgPSAoZiA+PiAyMykgJiAweDFmZjtcbiAgcmV0dXJuIGJhc2VUYWJsZVtlXSArICgoZiAmIDB4MDA3ZmZmZmYpID4+IHNoaWZ0VGFibGVbZV0pO1xufVxuXG5jb25zdCBtYW50aXNzYVRhYmxlID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KDIwNDgpO1xuZm9yIChsZXQgaSA9IDE7IGkgPCAxMDI0OyArK2kpIHtcbiAgbGV0IG0gPSBpIDw8IDEzOyAvLyB6ZXJvIHBhZCBtYW50aXNzYSBiaXRzXG4gIGxldCBlID0gMDsgLy8gemVybyBleHBvbmVudFxuXG4gIC8vIG5vcm1hbGl6ZWRcbiAgd2hpbGUgKChtICYgMHgwMDgwMDAwMCkgPT09IDApIHtcbiAgICBtIDw8PSAxO1xuICAgIGUgLT0gMHgwMDgwMDAwMDsgLy8gZGVjcmVtZW50IGV4cG9uZW50XG4gIH1cblxuICBtICY9IH4weDAwODAwMDAwOyAvLyBjbGVhciBsZWFkaW5nIDEgYml0XG4gIGUgKz0gMHgzODgwMDAwMDsgLy8gYWRqdXN0IGJpYXNcblxuICBtYW50aXNzYVRhYmxlW2ldID0gbSB8IGU7XG59XG5mb3IgKGxldCBpID0gMTAyNDsgaSA8IDIwNDg7ICsraSkge1xuICBtYW50aXNzYVRhYmxlW2ldID0gMHgzODAwMDAwMCArICgoaSAtIDEwMjQpIDw8IDEzKTtcbn1cblxuY29uc3QgZXhwb25lbnRUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg2NCk7XG5mb3IgKGxldCBpID0gMTsgaSA8IDMxOyArK2kpIHtcbiAgZXhwb25lbnRUYWJsZVtpXSA9IGkgPDwgMjM7XG59XG5leHBvbmVudFRhYmxlWzMxXSA9IDB4NDc4MDAwMDA7XG5leHBvbmVudFRhYmxlWzMyXSA9IDB4ODAwMDAwMDA7XG5mb3IgKGxldCBpID0gMzM7IGkgPCA2MzsgKytpKSB7XG4gIGV4cG9uZW50VGFibGVbaV0gPSAweDgwMDAwMDAwICsgKChpIC0gMzIpIDw8IDIzKTtcbn1cbmV4cG9uZW50VGFibGVbNjNdID0gMHhjNzgwMDAwMDtcblxuY29uc3Qgb2Zmc2V0VGFibGUgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoNjQpO1xuZm9yIChsZXQgaSA9IDE7IGkgPCA2NDsgKytpKSB7XG4gIGlmIChpICE9PSAzMikge1xuICAgIG9mZnNldFRhYmxlW2ldID0gMTAyNDtcbiAgfVxufVxuXG4vKipcbiAqIGNvbnZlcnQgYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzIHRvIGEgbnVtYmVyXG4gKiBAcGFyYW0ge251bWJlcn0gZmxvYXQxNmJpdHMgLSBoYWxmIGZsb2F0IG51bWJlciBiaXRzXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBkb3VibGUgZmxvYXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0cykge1xuICBjb25zdCBpID0gZmxvYXQxNmJpdHMgPj4gMTA7XG4gIHVpbnQzMlZpZXdbMF0gPSBtYW50aXNzYVRhYmxlW29mZnNldFRhYmxlW2ldICsgKGZsb2F0MTZiaXRzICYgMHgzZmYpXSArIGV4cG9uZW50VGFibGVbaV07XG4gIHJldHVybiBmbG9hdFZpZXdbMF07XG59XG4iLCJpbXBvcnQgeyBpc09iamVjdCwgaXNTaGFyZWRBcnJheUJ1ZmZlciB9IGZyb20gXCIuL2lzLm1qc1wiO1xuaW1wb3J0IHtcbiAgVEhFX0NPTlNUUlVDVE9SX1BST1BFUlRZX1ZBTFVFX0lTX05PVF9BTl9PQkpFQ1QsXG4gIFRISVNfSVNfTk9UX0FOX09CSkVDVCxcbn0gZnJvbSBcIi4vbWVzc2FnZXMubWpzXCI7XG5pbXBvcnQge1xuICBBcnJheUJ1ZmZlclByb3RvdHlwZVNsaWNlLFxuICBNQVhfU0FGRV9JTlRFR0VSLFxuICBNYXRoVHJ1bmMsXG4gIE5hdGl2ZVR5cGVFcnJvcixcbiAgTnVtYmVySXNOYU4sXG4gIE9iamVjdElzLFxuICBTeW1ib2xTcGVjaWVzLFxufSBmcm9tIFwiLi9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9pbnRlZ2Vyb3JpbmZpbml0eVxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBUb0ludGVnZXJPckluZmluaXR5KHRhcmdldCkge1xuICBjb25zdCBudW1iZXIgPSArdGFyZ2V0O1xuXG4gIGlmIChOdW1iZXJJc05hTihudW1iZXIpIHx8IG51bWJlciA9PT0gMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIE1hdGhUcnVuYyhudW1iZXIpO1xufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b2xlbmd0aFxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBUb0xlbmd0aCh0YXJnZXQpIHtcbiAgY29uc3QgbGVuZ3RoID0gVG9JbnRlZ2VyT3JJbmZpbml0eSh0YXJnZXQpO1xuICBpZiAobGVuZ3RoIDwgMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIGxlbmd0aCA8IE1BWF9TQUZFX0lOVEVHRVJcbiAgICA/IGxlbmd0aFxuICAgIDogTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtc3BlY2llc2NvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0XG4gKiBAcGFyYW0ge3sgbmV3KC4uLmFyZ3M6IGFueVtdKTogYW55OyB9fSBkZWZhdWx0Q29uc3RydWN0b3JcbiAqIEByZXR1cm5zIHt7IG5ldyguLi5hcmdzOiBhbnlbXSk6IGFueTsgfX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFNwZWNpZXNDb25zdHJ1Y3Rvcih0YXJnZXQsIGRlZmF1bHRDb25zdHJ1Y3Rvcikge1xuICBpZiAoIWlzT2JqZWN0KHRhcmdldCkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhJU19JU19OT1RfQU5fT0JKRUNUKTtcbiAgfVxuXG4gIGNvbnN0IGNvbnN0cnVjdG9yID0gdGFyZ2V0LmNvbnN0cnVjdG9yO1xuICBpZiAoY29uc3RydWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBkZWZhdWx0Q29uc3RydWN0b3I7XG4gIH1cbiAgaWYgKCFpc09iamVjdChjb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhFX0NPTlNUUlVDVE9SX1BST1BFUlRZX1ZBTFVFX0lTX05PVF9BTl9PQkpFQ1QpO1xuICB9XG5cbiAgY29uc3Qgc3BlY2llcyA9IGNvbnN0cnVjdG9yW1N5bWJvbFNwZWNpZXNdO1xuICBpZiAoc3BlY2llcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRDb25zdHJ1Y3RvcjtcbiAgfVxuXG4gIHJldHVybiBzcGVjaWVzO1xufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1pc2RldGFjaGVkYnVmZmVyXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyTGlrZX0gYnVmZmVyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIElzRGV0YWNoZWRCdWZmZXIoYnVmZmVyKSB7XG4gIGlmIChpc1NoYXJlZEFycmF5QnVmZmVyKGJ1ZmZlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cnkge1xuICAgIEFycmF5QnVmZmVyUHJvdG90eXBlU2xpY2UoYnVmZmVyLCAwLCAwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gY2F0Y2ggKGUpIHsvKiBlbXB0eSAqL31cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBiaWdpbnQgY29tcGFyaXNvbnMgYXJlIG5vdCBzdXBwb3J0ZWRcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNvcnRcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gKiBAcGFyYW0ge251bWJlcn0geVxuICogQHJldHVybnMgey0xIHwgMCB8IDF9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0Q29tcGFyZSh4LCB5KSB7XG4gIGNvbnN0IGlzWE5hTiA9IE51bWJlcklzTmFOKHgpO1xuICBjb25zdCBpc1lOYU4gPSBOdW1iZXJJc05hTih5KTtcblxuICBpZiAoaXNYTmFOICYmIGlzWU5hTikge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKGlzWE5hTikge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKGlzWU5hTikge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmICh4IDwgeSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmICh4ID4geSkge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCkge1xuICAgIGNvbnN0IGlzWFBsdXNaZXJvID0gT2JqZWN0SXMoeCwgMCk7XG4gICAgY29uc3QgaXNZUGx1c1plcm8gPSBPYmplY3RJcyh5LCAwKTtcblxuICAgIGlmICghaXNYUGx1c1plcm8gJiYgaXNZUGx1c1plcm8pIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoaXNYUGx1c1plcm8gJiYgIWlzWVBsdXNaZXJvKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cbiIsImltcG9ydCB7IHNhZmVJZk5lZWRlZCwgd3JhcCB9IGZyb20gXCIuL191dGlsL2FycmF5SXRlcmF0b3IubWpzXCI7XG5pbXBvcnQgeyBicmFuZCwgaGFzRmxvYXQxNkFycmF5QnJhbmQgfSBmcm9tIFwiLi9fdXRpbC9icmFuZC5tanNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHtcbiAgaXNBbnlBcnJheUJ1ZmZlcixcbiAgaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcsXG4gIGlzTmF0aXZlQmlnSW50VHlwZWRBcnJheSxcbiAgaXNOYXRpdmVUeXBlZEFycmF5LFxuICBpc09iamVjdCxcbiAgaXNPcmRpbmFyeUFycmF5LFxuICBpc09yZGluYXJ5TmF0aXZlVHlwZWRBcnJheSxcbn0gZnJvbSBcIi4vX3V0aWwvaXMubWpzXCI7XG5pbXBvcnQge1xuICBBVFRFTVBUSU5HX1RPX0FDQ0VTU19ERVRBQ0hFRF9BUlJBWUJVRkZFUixcbiAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNULFxuICBDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVMsXG4gIERFUklWRURfQ09OU1RSVUNUT1JfQ1JFQVRFRF9UWVBFREFSUkFZX09CSkVDVF9XSElDSF9XQVNfVE9PX1NNQUxMX0xFTkdUSCxcbiAgSVRFUkFUT1JfUFJPUEVSVFlfSVNfTk9UX0NBTExBQkxFLFxuICBPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyxcbiAgUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSxcbiAgU1BFQ0lFU19DT05TVFJVQ1RPUl9ESUROVF9SRVRVUk5fVFlQRURBUlJBWV9PQkpFQ1QsXG4gIFRIRV9DT01QQVJJU09OX0ZVTkNUSU9OX01VU1RfQkVfRUlUSEVSX0FfRlVOQ1RJT05fT1JfVU5ERUZJTkVELFxuICBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWSxcbiAgVEhJU19JU19OT1RfQV9GTE9BVDE2QVJSQVlfT0JKRUNULFxufSBmcm9tIFwiLi9fdXRpbC9tZXNzYWdlcy5tanNcIjtcbmltcG9ydCB7XG4gIEFycmF5QnVmZmVySXNWaWV3LFxuICBBcnJheVByb3RvdHlwZUpvaW4sXG4gIEFycmF5UHJvdG90eXBlUHVzaCxcbiAgQXJyYXlQcm90b3R5cGVUb0xvY2FsZVN0cmluZyxcbiAgTmF0aXZlQXJyYXlCdWZmZXIsXG4gIE5hdGl2ZU9iamVjdCxcbiAgTmF0aXZlUHJveHksXG4gIE5hdGl2ZVJhbmdlRXJyb3IsXG4gIE5hdGl2ZVR5cGVFcnJvcixcbiAgTmF0aXZlVWludDE2QXJyYXksXG4gIE5hdGl2ZVdlYWtNYXAsXG4gIE5hdGl2ZVdlYWtTZXQsXG4gIE51bWJlcklzTmFOLFxuICBPYmplY3REZWZpbmVQcm9wZXJ0eSxcbiAgT2JqZWN0RnJlZXplLFxuICBPYmplY3RIYXNPd24sXG4gIE9iamVjdFByb3RvdHlwZV9fbG9va3VwR2V0dGVyX18sXG4gIFJlZmxlY3RBcHBseSxcbiAgUmVmbGVjdENvbnN0cnVjdCxcbiAgUmVmbGVjdERlZmluZVByb3BlcnR5LFxuICBSZWZsZWN0R2V0LFxuICBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICBSZWZsZWN0SGFzLFxuICBSZWZsZWN0T3duS2V5cyxcbiAgUmVmbGVjdFNldCxcbiAgUmVmbGVjdFNldFByb3RvdHlwZU9mLFxuICBTeW1ib2xJdGVyYXRvcixcbiAgU3ltYm9sVG9TdHJpbmdUYWcsXG4gIFR5cGVkQXJyYXksXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVDb3B5V2l0aGluLFxuICBUeXBlZEFycmF5UHJvdG90eXBlRW50cmllcyxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUZpbGwsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0LFxuICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoLFxuICBUeXBlZEFycmF5UHJvdG90eXBlS2V5cyxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVJldmVyc2UsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVTZXQsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVNvcnQsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVTdWJhcnJheSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVZhbHVlcyxcbiAgVWludDE2QXJyYXlGcm9tLFxuICBXZWFrTWFwUHJvdG90eXBlR2V0LFxuICBXZWFrTWFwUHJvdG90eXBlSGFzLFxuICBXZWFrTWFwUHJvdG90eXBlU2V0LFxuICBXZWFrU2V0UHJvdG90eXBlQWRkLFxuICBXZWFrU2V0UHJvdG90eXBlSGFzLFxufSBmcm9tIFwiLi9fdXRpbC9wcmltb3JkaWFscy5tanNcIjtcbmltcG9ydCB7XG4gIElzRGV0YWNoZWRCdWZmZXIsXG4gIFNwZWNpZXNDb25zdHJ1Y3RvcixcbiAgVG9JbnRlZ2VyT3JJbmZpbml0eSxcbiAgVG9MZW5ndGgsXG4gIGRlZmF1bHRDb21wYXJlLFxufSBmcm9tIFwiLi9fdXRpbC9zcGVjLm1qc1wiO1xuXG5jb25zdCBCWVRFU19QRVJfRUxFTUVOVCA9IDI7XG5cbi8qKiBAdHlwZWRlZiB7VWludDE2QXJyYXkgJiB7IF9fZmxvYXQxNmJpdHM6IG5ldmVyIH19IEZsb2F0MTZCaXRzQXJyYXkgKi9cblxuLyoqIEB0eXBlIHtXZWFrTWFwPEZsb2F0MTZBcnJheSwgRmxvYXQxNkJpdHNBcnJheT59ICovXG5jb25zdCBmbG9hdDE2Yml0c0FycmF5cyA9IG5ldyBOYXRpdmVXZWFrTWFwKCk7XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHt0YXJnZXQgaXMgRmxvYXQxNkFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGbG9hdDE2QXJyYXkodGFyZ2V0KSB7XG4gIHJldHVybiBXZWFrTWFwUHJvdG90eXBlSGFzKGZsb2F0MTZiaXRzQXJyYXlzLCB0YXJnZXQpIHx8XG4gICAgKCFBcnJheUJ1ZmZlcklzVmlldyh0YXJnZXQpICYmIGhhc0Zsb2F0MTZBcnJheUJyYW5kKHRhcmdldCkpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcmV0dXJucyB7YXNzZXJ0cyB0YXJnZXQgaXMgRmxvYXQxNkFycmF5fVxuICovXG5mdW5jdGlvbiBhc3NlcnRGbG9hdDE2QXJyYXkodGFyZ2V0KSB7XG4gIGlmICghaXNGbG9hdDE2QXJyYXkodGFyZ2V0KSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSElTX0lTX05PVF9BX0ZMT0FUMTZBUlJBWV9PQkpFQ1QpO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEBwYXJhbSB7bnVtYmVyPX0gY291bnRcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEByZXR1cm5zIHthc3NlcnRzIHRhcmdldCBpcyBVaW50OEFycmF5fFVpbnQ4Q2xhbXBlZEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fEludDhBcnJheXxJbnQxNkFycmF5fEludDMyQXJyYXl8RmxvYXQxNkFycmF5fEZsb2F0MzJBcnJheXxGbG9hdDY0QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KHRhcmdldCwgY291bnQpIHtcbiAgY29uc3QgaXNUYXJnZXRGbG9hdDE2QXJyYXkgPSBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpO1xuICBjb25zdCBpc1RhcmdldFR5cGVkQXJyYXkgPSBpc05hdGl2ZVR5cGVkQXJyYXkodGFyZ2V0KTtcblxuICBpZiAoIWlzVGFyZ2V0RmxvYXQxNkFycmF5ICYmICFpc1RhcmdldFR5cGVkQXJyYXkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoU1BFQ0lFU19DT05TVFJVQ1RPUl9ESUROVF9SRVRVUk5fVFlQRURBUlJBWV9PQkpFQ1QpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBjb3VudCA9PT0gXCJudW1iZXJcIikge1xuICAgIGxldCBsZW5ndGg7XG4gICAgaWYgKGlzVGFyZ2V0RmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0YXJnZXQpO1xuICAgICAgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aCh0YXJnZXQpO1xuICAgIH1cblxuICAgIGlmIChsZW5ndGggPCBjb3VudCkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBERVJJVkVEX0NPTlNUUlVDVE9SX0NSRUFURURfVFlQRURBUlJBWV9PQkpFQ1RfV0hJQ0hfV0FTX1RPT19TTUFMTF9MRU5HVEhcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGlzTmF0aXZlQmlnSW50VHlwZWRBcnJheSh0YXJnZXQpKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFUyk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge0Zsb2F0MTZBcnJheX0gZmxvYXQxNlxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge0Zsb2F0MTZCaXRzQXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGdldEZsb2F0MTZCaXRzQXJyYXkoZmxvYXQxNikge1xuICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gV2Vha01hcFByb3RvdHlwZUdldChmbG9hdDE2Yml0c0FycmF5cywgZmxvYXQxNik7XG4gIGlmIChmbG9hdDE2Yml0c0FycmF5ICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBidWZmZXIgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgaWYgKElzRGV0YWNoZWRCdWZmZXIoYnVmZmVyKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmxvYXQxNmJpdHNBcnJheTtcbiAgfVxuXG4gIC8vIGZyb20gYW5vdGhlciBGbG9hdDE2QXJyYXkgaW5zdGFuY2UgKGEgZGlmZmVyZW50IHZlcnNpb24/KVxuICBjb25zdCBidWZmZXIgPSAvKiogQHR5cGUge2FueX0gKi8gKGZsb2F0MTYpLmJ1ZmZlcjtcblxuICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgfVxuXG4gIGNvbnN0IGNsb25lZCA9IFJlZmxlY3RDb25zdHJ1Y3QoRmxvYXQxNkFycmF5LCBbXG4gICAgYnVmZmVyLFxuICAgIC8qKiBAdHlwZSB7YW55fSAqLyAoZmxvYXQxNikuYnl0ZU9mZnNldCxcbiAgICAvKiogQHR5cGUge2FueX0gKi8gKGZsb2F0MTYpLmxlbmd0aCxcbiAgXSwgZmxvYXQxNi5jb25zdHJ1Y3Rvcik7XG4gIHJldHVybiBXZWFrTWFwUHJvdG90eXBlR2V0KGZsb2F0MTZiaXRzQXJyYXlzLCBjbG9uZWQpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7RmxvYXQxNkJpdHNBcnJheX0gZmxvYXQxNmJpdHNBcnJheVxuICogQHJldHVybnMge251bWJlcltdfVxuICovXG5mdW5jdGlvbiBjb3B5VG9BcnJheShmbG9hdDE2Yml0c0FycmF5KSB7XG4gIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgY29uc3QgYXJyYXkgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGFycmF5W2ldID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufVxuXG4vKiogQHR5cGUge1dlYWtTZXQ8RnVuY3Rpb24+fSAqL1xuY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUdldHRlcnMgPSBuZXcgTmF0aXZlV2Vha1NldCgpO1xuZm9yIChjb25zdCBrZXkgb2YgUmVmbGVjdE93bktleXMoVHlwZWRBcnJheVByb3RvdHlwZSkpIHtcbiAgLy8gQEB0b1N0cmluZ1RhZyBnZXR0ZXIgcHJvcGVydHkgaXMgZGVmaW5lZCBpbiBGbG9hdDE2QXJyYXkucHJvdG90eXBlXG4gIGlmIChrZXkgPT09IFN5bWJvbFRvU3RyaW5nVGFnKSB7XG4gICAgY29udGludWU7XG4gIH1cblxuICBjb25zdCBkZXNjcmlwdG9yID0gUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihUeXBlZEFycmF5UHJvdG90eXBlLCBrZXkpO1xuICBpZiAoT2JqZWN0SGFzT3duKGRlc2NyaXB0b3IsIFwiZ2V0XCIpICYmIHR5cGVvZiBkZXNjcmlwdG9yLmdldCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgV2Vha1NldFByb3RvdHlwZUFkZChUeXBlZEFycmF5UHJvdG90eXBlR2V0dGVycywgZGVzY3JpcHRvci5nZXQpO1xuICB9XG59XG5cbmNvbnN0IGhhbmRsZXIgPSBPYmplY3RGcmVlemUoLyoqIEB0eXBlIHtQcm94eUhhbmRsZXI8RmxvYXQxNkJpdHNBcnJheT59ICovICh7XG4gIGdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpIHtcbiAgICBpZiAoaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcoa2V5KSAmJiBPYmplY3RIYXNPd24odGFyZ2V0LCBrZXkpKSB7XG4gICAgICByZXR1cm4gY29udmVydFRvTnVtYmVyKFJlZmxlY3RHZXQodGFyZ2V0LCBrZXkpKTtcbiAgICB9XG5cbiAgICAvLyAlVHlwZWRBcnJheSUucHJvdG90eXBlIGdldHRlciBwcm9wZXJ0aWVzIGNhbm5vdCBjYWxsZWQgYnkgUHJveHkgcmVjZWl2ZXJcbiAgICBpZiAoV2Vha1NldFByb3RvdHlwZUhhcyhUeXBlZEFycmF5UHJvdG90eXBlR2V0dGVycywgT2JqZWN0UHJvdG90eXBlX19sb29rdXBHZXR0ZXJfXyh0YXJnZXQsIGtleSkpKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdEdldCh0YXJnZXQsIGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZmxlY3RHZXQodGFyZ2V0LCBrZXksIHJlY2VpdmVyKTtcbiAgfSxcblxuICBzZXQodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcikge1xuICAgIGlmIChpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyhrZXkpICYmIE9iamVjdEhhc093bih0YXJnZXQsIGtleSkpIHtcbiAgICAgIHJldHVybiBSZWZsZWN0U2V0KHRhcmdldCwga2V5LCByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVmbGVjdFNldCh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKTtcbiAgfSxcblxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcbiAgICBpZiAoaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcoa2V5KSAmJiBPYmplY3RIYXNPd24odGFyZ2V0LCBrZXkpKSB7XG4gICAgICBjb25zdCBkZXNjcmlwdG9yID0gUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gICAgICBkZXNjcmlwdG9yLnZhbHVlID0gY29udmVydFRvTnVtYmVyKGRlc2NyaXB0b3IudmFsdWUpO1xuICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuICB9LFxuXG4gIGRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gICAgaWYgKFxuICAgICAgaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcoa2V5KSAmJlxuICAgICAgT2JqZWN0SGFzT3duKHRhcmdldCwga2V5KSAmJlxuICAgICAgT2JqZWN0SGFzT3duKGRlc2NyaXB0b3IsIFwidmFsdWVcIilcbiAgICApIHtcbiAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSByb3VuZFRvRmxvYXQxNkJpdHMoZGVzY3JpcHRvci52YWx1ZSk7XG4gICAgICByZXR1cm4gUmVmbGVjdERlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVmbGVjdERlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKTtcbiAgfSxcbn0pKTtcblxuZXhwb3J0IGNsYXNzIEZsb2F0MTZBcnJheSB7XG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdHlwZWRhcnJheSAqL1xuICBjb25zdHJ1Y3RvcihpbnB1dCwgX2J5dGVPZmZzZXQsIF9sZW5ndGgpIHtcbiAgICAvKiogQHR5cGUge0Zsb2F0MTZCaXRzQXJyYXl9ICovXG4gICAgbGV0IGZsb2F0MTZiaXRzQXJyYXk7XG5cbiAgICBpZiAoaXNGbG9hdDE2QXJyYXkoaW5wdXQpKSB7XG4gICAgICBmbG9hdDE2Yml0c0FycmF5ID0gUmVmbGVjdENvbnN0cnVjdChOYXRpdmVVaW50MTZBcnJheSwgW2dldEZsb2F0MTZCaXRzQXJyYXkoaW5wdXQpXSwgbmV3LnRhcmdldCk7XG4gICAgfSBlbHNlIGlmIChpc09iamVjdChpbnB1dCkgJiYgIWlzQW55QXJyYXlCdWZmZXIoaW5wdXQpKSB7IC8vIG9iamVjdCB3aXRob3V0IEFycmF5QnVmZmVyLCBTaGFyZWRBcnJheUJ1ZmZlclxuICAgICAgLyoqIEB0eXBlIHtBcnJheUxpa2U8dW5rbm93bj59ICovXG4gICAgICBsZXQgbGlzdDtcbiAgICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICAgICAgbGV0IGxlbmd0aDtcblxuICAgICAgaWYgKGlzTmF0aXZlVHlwZWRBcnJheShpbnB1dCkpIHsgLy8gVHlwZWRBcnJheVxuICAgICAgICBsaXN0ID0gaW5wdXQ7XG4gICAgICAgIGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoaW5wdXQpO1xuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoaW5wdXQpO1xuXG4gICAgICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICAgICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTmF0aXZlQmlnSW50VHlwZWRBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ0FOTk9UX01JWF9CSUdJTlRfQU5EX09USEVSX1RZUEVTKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgTmF0aXZlQXJyYXlCdWZmZXIoXG4gICAgICAgICAgbGVuZ3RoICogQllURVNfUEVSX0VMRU1FTlRcbiAgICAgICAgKTtcbiAgICAgICAgZmxvYXQxNmJpdHNBcnJheSA9IFJlZmxlY3RDb25zdHJ1Y3QoTmF0aXZlVWludDE2QXJyYXksIFtkYXRhXSwgbmV3LnRhcmdldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpdGVyYXRvciA9IGlucHV0W1N5bWJvbEl0ZXJhdG9yXTtcbiAgICAgICAgaWYgKGl0ZXJhdG9yICE9IG51bGwgJiYgdHlwZW9mIGl0ZXJhdG9yICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoSVRFUkFUT1JfUFJPUEVSVFlfSVNfTk9UX0NBTExBQkxFKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVyYXRvciAhPSBudWxsKSB7IC8vIEl0ZXJhYmxlIChBcnJheSlcbiAgICAgICAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgICAgICAgaWYgKGlzT3JkaW5hcnlBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIGxpc3QgPSBpbnB1dDtcbiAgICAgICAgICAgIGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgICAgICAgICBsaXN0ID0gWy4uLiAvKiogQHR5cGUge0l0ZXJhYmxlPHVua25vd24+fSAqLyAoaW5wdXQpXTtcbiAgICAgICAgICAgIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8gQXJyYXlMaWtlXG4gICAgICAgICAgbGlzdCA9IC8qKiBAdHlwZSB7QXJyYXlMaWtlPHVua25vd24+fSAqLyAoaW5wdXQpO1xuICAgICAgICAgIGxlbmd0aCA9IFRvTGVuZ3RoKGxpc3QubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBmbG9hdDE2Yml0c0FycmF5ID0gUmVmbGVjdENvbnN0cnVjdChOYXRpdmVVaW50MTZBcnJheSwgW2xlbmd0aF0sIG5ldy50YXJnZXQpO1xuICAgICAgfVxuXG4gICAgICAvLyBzZXQgdmFsdWVzXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXlbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMobGlzdFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8gcHJpbWl0aXZlLCBBcnJheUJ1ZmZlciwgU2hhcmVkQXJyYXlCdWZmZXJcbiAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBhcmd1bWVudHMsIG5ldy50YXJnZXQpO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7RmxvYXQxNkFycmF5fSAqL1xuICAgIGNvbnN0IHByb3h5ID0gLyoqIEB0eXBlIHthbnl9ICovIChuZXcgTmF0aXZlUHJveHkoZmxvYXQxNmJpdHNBcnJheSwgaGFuZGxlcikpO1xuXG4gICAgLy8gcHJveHkgcHJpdmF0ZSBzdG9yYWdlXG4gICAgV2Vha01hcFByb3RvdHlwZVNldChmbG9hdDE2Yml0c0FycmF5cywgcHJveHksIGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgcmV0dXJuIHByb3h5O1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGbG9hdDE2QXJyYXkpYCBvciBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgIGluY2x1ZGUgdGhpcyBrZXlcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5mcm9tXG4gICAqL1xuICBzdGF0aWMgZnJvbShzcmMsIC4uLm9wdHMpIHtcbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICBpZiAoIVJlZmxlY3RIYXMoQ29uc3RydWN0b3IsIGJyYW5kKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGlmIChpc0Zsb2F0MTZBcnJheShzcmMpICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHNyYyk7XG4gICAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBOYXRpdmVVaW50MTZBcnJheShcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSlcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihUeXBlZEFycmF5UHJvdG90eXBlU2xpY2UodWludDE2KSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgICAgICBVaW50MTZBcnJheUZyb20oc3JjLCByb3VuZFRvRmxvYXQxNkJpdHMpXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXBGdW5jID0gb3B0c1swXTtcbiAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzFdO1xuXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgICBVaW50MTZBcnJheUZyb20oc3JjLCBmdW5jdGlvbiAodmFsLCAuLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gcm91bmRUb0Zsb2F0MTZCaXRzKFxuICAgICAgICAgICAgICBSZWZsZWN0QXBwbHkobWFwRnVuYywgdGhpcywgW3ZhbCwgLi4uc2FmZUlmTmVlZGVkKGFyZ3MpXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSwgdGhpc0FyZylcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvKiogQHR5cGUge0FycmF5TGlrZTx1bmtub3duPn0gKi9cbiAgICBsZXQgbGlzdDtcbiAgICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgICBsZXQgbGVuZ3RoO1xuXG4gICAgY29uc3QgaXRlcmF0b3IgPSBzcmNbU3ltYm9sSXRlcmF0b3JdO1xuICAgIGlmIChpdGVyYXRvciAhPSBudWxsICYmIHR5cGVvZiBpdGVyYXRvciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoSVRFUkFUT1JfUFJPUEVSVFlfSVNfTk9UX0NBTExBQkxFKTtcbiAgICB9XG5cbiAgICBpZiAoaXRlcmF0b3IgIT0gbnVsbCkgeyAvLyBJdGVyYWJsZSAoVHlwZWRBcnJheSwgQXJyYXkpXG4gICAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgICBpZiAoaXNPcmRpbmFyeUFycmF5KHNyYykpIHtcbiAgICAgICAgbGlzdCA9IHNyYztcbiAgICAgICAgbGVuZ3RoID0gc3JjLmxlbmd0aDtcbiAgICAgIH0gZWxzZSBpZiAoaXNPcmRpbmFyeU5hdGl2ZVR5cGVkQXJyYXkoc3JjKSkge1xuICAgICAgICBsaXN0ID0gc3JjO1xuICAgICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKHNyYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgICAgICAgbGlzdCA9IFsuLi5zcmNdO1xuICAgICAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyBBcnJheUxpa2VcbiAgICAgIGlmIChzcmMgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgICAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBsaXN0ID0gTmF0aXZlT2JqZWN0KHNyYyk7XG4gICAgICBsZW5ndGggPSBUb0xlbmd0aChsaXN0Lmxlbmd0aCk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBhcnJheVtpXSA9IC8qKiBAdHlwZSB7bnVtYmVyfSAqLyAobGlzdFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1hcEZ1bmMgPSBvcHRzWzBdO1xuICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMV07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gUmVmbGVjdEFwcGx5KG1hcEZ1bmMsIHRoaXNBcmcsIFtsaXN0W2ldLCBpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGbG9hdDE2QXJyYXkpYCBvciBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgIGluY2x1ZGUgdGhpcyBrZXlcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5vZlxuICAgKi9cbiAgc3RhdGljIG9mKC4uLml0ZW1zKSB7XG4gICAgY29uc3QgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgaWYgKCFSZWZsZWN0SGFzKENvbnN0cnVjdG9yLCBicmFuZCkpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgbGVuZ3RoID0gaXRlbXMubGVuZ3RoO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBwcm94eSA9IG5ldyBGbG9hdDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHByb3h5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBmbG9hdDE2Yml0c0FycmF5W2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGl0ZW1zW2ldKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH1cblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBhcnJheVtpXSA9IGl0ZW1zW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5rZXlzICovXG4gIGtleXMoKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgcmV0dXJuIFR5cGVkQXJyYXlQcm90b3R5cGVLZXlzKGZsb2F0MTZiaXRzQXJyYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IHJldHVybnMgYSBvYmplY3Qgd2hvc2UgcHJvdG90eXBlIGlzIG5vdCBgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlYFxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS52YWx1ZXNcbiAgICovXG4gIHZhbHVlcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gd3JhcCgoZnVuY3Rpb24qICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgZm9yIChjb25zdCB2YWwgb2YgVHlwZWRBcnJheVByb3RvdHlwZVZhbHVlcyhmbG9hdDE2Yml0c0FycmF5KSkge1xuICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiByZXR1cm5zIGEgb2JqZWN0IHdob3NlIHByb3RvdHlwZSBpcyBub3QgYCVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJWBcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZW50cmllc1xuICAgKi9cbiAgZW50cmllcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gd3JhcCgoZnVuY3Rpb24qICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgZm9yIChjb25zdCBbaSwgdmFsXSBvZiBUeXBlZEFycmF5UHJvdG90eXBlRW50cmllcyhmbG9hdDE2Yml0c0FycmF5KSkge1xuICAgICAgICB5aWVsZCAvKiogQHR5cGUge1tudW1iZXIsIG51bWJlcl19ICovIChbaSwgY29udmVydFRvTnVtYmVyKHZhbCldKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5hdCAqL1xuICBhdChpbmRleCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgcmVsYXRpdmVJbmRleCA9IFRvSW50ZWdlck9ySW5maW5pdHkoaW5kZXgpO1xuICAgIGNvbnN0IGsgPSByZWxhdGl2ZUluZGV4ID49IDAgPyByZWxhdGl2ZUluZGV4IDogbGVuZ3RoICsgcmVsYXRpdmVJbmRleDtcblxuICAgIGlmIChrIDwgMCB8fCBrID49IGxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtrXSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtY2hhbmdlLWFycmF5LWJ5LWNvcHkvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLndpdGggKi9cbiAgd2l0aChpbmRleCwgdmFsdWUpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHJlbGF0aXZlSW5kZXggPSBUb0ludGVnZXJPckluZmluaXR5KGluZGV4KTtcbiAgICBjb25zdCBrID0gcmVsYXRpdmVJbmRleCA+PSAwID8gcmVsYXRpdmVJbmRleCA6IGxlbmd0aCArIHJlbGF0aXZlSW5kZXg7XG5cbiAgICBjb25zdCBudW1iZXIgPSArdmFsdWU7XG5cbiAgICBpZiAoayA8IDAgfHwgayA+PSBsZW5ndGgpIHtcbiAgICAgIHRocm93IE5hdGl2ZVJhbmdlRXJyb3IoT0ZGU0VUX0lTX09VVF9PRl9CT1VORFMpO1xuICAgIH1cblxuICAgIC8vIGRvbid0IHVzZSBTcGVjaWVzQ29uc3RydWN0b3JcbiAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgKTtcbiAgICBjb25zdCBjbG9uZWQgPSBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlKHVpbnQxNilcbiAgICAgIClcbiAgICApO1xuICAgIGNvbnN0IGFycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShjbG9uZWQpO1xuXG4gICAgYXJyYXlba10gPSByb3VuZFRvRmxvYXQxNkJpdHMobnVtYmVyKTtcblxuICAgIHJldHVybiBjbG9uZWQ7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUubWFwICovXG4gIG1hcChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBwcm94eSA9IG5ldyBGbG9hdDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgIGNvbnN0IGFycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShwcm94eSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgICBhcnJheVtpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhcbiAgICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSwgbGVuZ3RoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGFycmF5W2ldID0gUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdmFsLCBpLCB0aGlzXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbHRlciAqL1xuICBmaWx0ZXIoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgY29uc3Qga2VwdCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKSkge1xuICAgICAgICBBcnJheVByb3RvdHlwZVB1c2goa2VwdCwgdmFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGtlcHQpO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5KTtcblxuICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKGFycmF5KTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5yZWR1Y2UgKi9cbiAgcmVkdWNlKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbMF0pO1xuICAgICAgc3RhcnQgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soXG4gICAgICAgIGFjY3VtdWxhdG9yLFxuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJlZHVjZXJpZ2h0ICovXG4gIHJlZHVjZVJpZ2h0KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbbGVuZ3RoIC0gMV0pO1xuICAgICAgc3RhcnQgPSBsZW5ndGggLSAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IGxlbmd0aCAtIDE7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpID49IDA7IC0taSkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjYWxsYmFjayhcbiAgICAgICAgYWNjdW11bGF0b3IsXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgaSxcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZm9yZWFjaCAqL1xuICBmb3JFYWNoKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW1xuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXMsXG4gICAgICBdKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZCAqL1xuICBmaW5kKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kaW5kZXggKi9cbiAgZmluZEluZGV4KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLWFycmF5LWZpbmQtZnJvbS1sYXN0L2luZGV4Lmh0bWwjc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZGxhc3QgKi9cbiAgZmluZExhc3QoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtYXJyYXktZmluZC1mcm9tLWxhc3QvaW5kZXguaHRtbCNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kbGFzdGluZGV4ICovXG4gIGZpbmRMYXN0SW5kZXgoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5ldmVyeSAqL1xuICBldmVyeShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoXG4gICAgICAgICFSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICBdKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb21lICovXG4gIHNvbWUoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKFxuICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICBdKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zZXQgKi9cbiAgc2V0KGlucHV0LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGFyZ2V0T2Zmc2V0ID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAodGFyZ2V0T2Zmc2V0IDwgMCkge1xuICAgICAgdGhyb3cgTmF0aXZlUmFuZ2VFcnJvcihPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyk7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0ID09IG51bGwpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpc05hdGl2ZUJpZ0ludFR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFU1xuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KGlucHV0KSkge1xuICAgICAgLy8gcGVlbCBvZmYgUHJveHlcbiAgICAgIHJldHVybiBUeXBlZEFycmF5UHJvdG90eXBlU2V0KFxuICAgICAgICBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpLFxuICAgICAgICBnZXRGbG9hdDE2Qml0c0FycmF5KGlucHV0KSxcbiAgICAgICAgdGFyZ2V0T2Zmc2V0XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpc05hdGl2ZVR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGlucHV0KTtcbiAgICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRMZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgY29uc3Qgc3JjID0gTmF0aXZlT2JqZWN0KGlucHV0KTtcbiAgICBjb25zdCBzcmNMZW5ndGggPSBUb0xlbmd0aChzcmMubGVuZ3RoKTtcblxuICAgIGlmICh0YXJnZXRPZmZzZXQgPT09IEluZmluaXR5IHx8IHNyY0xlbmd0aCArIHRhcmdldE9mZnNldCA+IHRhcmdldExlbmd0aCkge1xuICAgICAgdGhyb3cgTmF0aXZlUmFuZ2VFcnJvcihPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcmNMZW5ndGg7ICsraSkge1xuICAgICAgZmxvYXQxNmJpdHNBcnJheVtpICsgdGFyZ2V0T2Zmc2V0XSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhzcmNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5yZXZlcnNlICovXG4gIHJldmVyc2UoKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgVHlwZWRBcnJheVByb3RvdHlwZVJldmVyc2UoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9wcm9wb3NhbC1jaGFuZ2UtYXJyYXktYnktY29weS8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUudG9SZXZlcnNlZCAqL1xuICB0b1JldmVyc2VkKCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIC8vIGRvbid0IHVzZSBTcGVjaWVzQ29uc3RydWN0b3JcbiAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgKTtcbiAgICBjb25zdCBjbG9uZWQgPSBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlKHVpbnQxNilcbiAgICAgIClcbiAgICApO1xuXG4gICAgY29uc3QgY2xvbmVkRmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkoY2xvbmVkKTtcbiAgICBUeXBlZEFycmF5UHJvdG90eXBlUmV2ZXJzZShjbG9uZWRGbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIHJldHVybiBjbG9uZWQ7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmlsbCAqL1xuICBmaWxsKHZhbHVlLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgVHlwZWRBcnJheVByb3RvdHlwZUZpbGwoXG4gICAgICBmbG9hdDE2Yml0c0FycmF5LFxuICAgICAgcm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSxcbiAgICAgIC4uLnNhZmVJZk5lZWRlZChvcHRzKVxuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5jb3B5d2l0aGluICovXG4gIGNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVDb3B5V2l0aGluKGZsb2F0MTZiaXRzQXJyYXksIHRhcmdldCwgc3RhcnQsIC4uLnNhZmVJZk5lZWRlZChvcHRzKSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb3J0ICovXG4gIHNvcnQoY29tcGFyZUZuKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3Qgc29ydENvbXBhcmUgPSBjb21wYXJlRm4gIT09IHVuZGVmaW5lZCA/IGNvbXBhcmVGbiA6IGRlZmF1bHRDb21wYXJlO1xuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVTb3J0KGZsb2F0MTZiaXRzQXJyYXksICh4LCB5KSA9PiB7XG4gICAgICByZXR1cm4gc29ydENvbXBhcmUoY29udmVydFRvTnVtYmVyKHgpLCBjb252ZXJ0VG9OdW1iZXIoeSkpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtY2hhbmdlLWFycmF5LWJ5LWNvcHkvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnRvU29ydGVkICovXG4gIHRvU29ydGVkKGNvbXBhcmVGbikge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGlmIChjb21wYXJlRm4gIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgY29tcGFyZUZuICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBOYXRpdmVUeXBlRXJyb3IoVEhFX0NPTVBBUklTT05fRlVOQ1RJT05fTVVTVF9CRV9FSVRIRVJfQV9GVU5DVElPTl9PUl9VTkRFRklORUQpO1xuICAgIH1cbiAgICBjb25zdCBzb3J0Q29tcGFyZSA9IGNvbXBhcmVGbiAhPT0gdW5kZWZpbmVkID8gY29tcGFyZUZuIDogZGVmYXVsdENvbXBhcmU7XG5cbiAgICAvLyBkb24ndCB1c2UgU3BlY2llc0NvbnN0cnVjdG9yXG4gICAgY29uc3QgdWludDE2ID0gbmV3IE5hdGl2ZVVpbnQxNkFycmF5KFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KVxuICAgICk7XG4gICAgY29uc3QgY2xvbmVkID0gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSh1aW50MTYpXG4gICAgICApXG4gICAgKTtcblxuICAgIGNvbnN0IGNsb25lZEZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KGNsb25lZCk7XG4gICAgVHlwZWRBcnJheVByb3RvdHlwZVNvcnQoY2xvbmVkRmxvYXQxNmJpdHNBcnJheSwgKHgsIHkpID0+IHtcbiAgICAgIHJldHVybiBzb3J0Q29tcGFyZShjb252ZXJ0VG9OdW1iZXIoeCksIGNvbnZlcnRUb051bWJlcih5KSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY2xvbmVkO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNsaWNlICovXG4gIHNsaWNlKHN0YXJ0LCBlbmQpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgICApO1xuICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlKHVpbnQxNiwgc3RhcnQsIGVuZClcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHJlbGF0aXZlU3RhcnQgPSBUb0ludGVnZXJPckluZmluaXR5KHN0YXJ0KTtcbiAgICBjb25zdCByZWxhdGl2ZUVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogVG9JbnRlZ2VyT3JJbmZpbml0eShlbmQpO1xuXG4gICAgbGV0IGs7XG4gICAgaWYgKHJlbGF0aXZlU3RhcnQgPT09IC1JbmZpbml0eSkge1xuICAgICAgayA9IDA7XG4gICAgfSBlbHNlIGlmIChyZWxhdGl2ZVN0YXJ0IDwgMCkge1xuICAgICAgayA9IGxlbmd0aCArIHJlbGF0aXZlU3RhcnQgPiAwID8gbGVuZ3RoICsgcmVsYXRpdmVTdGFydCA6IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGsgPSBsZW5ndGggPCByZWxhdGl2ZVN0YXJ0ID8gbGVuZ3RoIDogcmVsYXRpdmVTdGFydDtcbiAgICB9XG5cbiAgICBsZXQgZmluYWw7XG4gICAgaWYgKHJlbGF0aXZlRW5kID09PSAtSW5maW5pdHkpIHtcbiAgICAgIGZpbmFsID0gMDtcbiAgICB9IGVsc2UgaWYgKHJlbGF0aXZlRW5kIDwgMCkge1xuICAgICAgZmluYWwgPSBsZW5ndGggKyByZWxhdGl2ZUVuZCA+IDAgPyBsZW5ndGggKyByZWxhdGl2ZUVuZCA6IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbmFsID0gbGVuZ3RoIDwgcmVsYXRpdmVFbmQgPyBsZW5ndGggOiByZWxhdGl2ZUVuZDtcbiAgICB9XG5cbiAgICBjb25zdCBjb3VudCA9IGZpbmFsIC0gayA+IDAgPyBmaW5hbCAtIGsgOiAwO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGNvdW50KTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSwgY291bnQpO1xuXG4gICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIpO1xuICAgIH1cblxuICAgIGxldCBuID0gMDtcbiAgICB3aGlsZSAoayA8IGZpbmFsKSB7XG4gICAgICBhcnJheVtuXSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2tdKTtcbiAgICAgICsraztcbiAgICAgICsrbjtcbiAgICB9XG5cbiAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChhcnJheSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc3ViYXJyYXkgKi9cbiAgc3ViYXJyYXkoYmVnaW4sIGVuZCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG5cbiAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgKTtcbiAgICBjb25zdCB1aW50MTZTdWJhcnJheSA9IFR5cGVkQXJyYXlQcm90b3R5cGVTdWJhcnJheSh1aW50MTYsIGJlZ2luLCBlbmQpO1xuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKHVpbnQxNlN1YmFycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KHVpbnQxNlN1YmFycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgodWludDE2U3ViYXJyYXkpXG4gICAgKTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSk7XG5cbiAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChhcnJheSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuaW5kZXhvZiAqL1xuICBpbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgbGV0IGZyb20gPSBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pO1xuICAgIGlmIChmcm9tID09PSBJbmZpbml0eSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgZnJvbSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKFxuICAgICAgICBPYmplY3RIYXNPd24oZmxvYXQxNmJpdHNBcnJheSwgaSkgJiZcbiAgICAgICAgY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pID09PSBlbGVtZW50XG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmxhc3RpbmRleG9mICovXG4gIGxhc3RJbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgbGV0IGZyb20gPSBvcHRzLmxlbmd0aCA+PSAxID8gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKSA6IGxlbmd0aCAtIDE7XG4gICAgaWYgKGZyb20gPT09IC1JbmZpbml0eSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChmcm9tID49IDApIHtcbiAgICAgIGZyb20gPSBmcm9tIDwgbGVuZ3RoIC0gMSA/IGZyb20gOiBsZW5ndGggLSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgT2JqZWN0SGFzT3duKGZsb2F0MTZiaXRzQXJyYXksIGkpICYmXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSA9PT0gZWxlbWVudFxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5pbmNsdWRlcyAqL1xuICBpbmNsdWRlcyhlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAoZnJvbSA9PT0gSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGlzTmFOID0gTnVtYmVySXNOYU4oZWxlbWVudCk7XG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG5cbiAgICAgIGlmIChpc05hTiAmJiBOdW1iZXJJc05hTih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuam9pbiAqL1xuICBqb2luKHNlcGFyYXRvcikge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGFycmF5ID0gY29weVRvQXJyYXkoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICByZXR1cm4gQXJyYXlQcm90b3R5cGVKb2luKGFycmF5LCBzZXBhcmF0b3IpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnRvbG9jYWxlc3RyaW5nICovXG4gIHRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgcmV0dXJuIEFycmF5UHJvdG90eXBlVG9Mb2NhbGVTdHJpbmcoYXJyYXksIC4uLnNhZmVJZk5lZWRlZChvcHRzKSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWdldC0ldHlwZWRhcnJheSUucHJvdG90eXBlLUBAdG9zdHJpbmd0YWcgKi9cbiAgZ2V0IFtTeW1ib2xUb1N0cmluZ1RhZ10oKSB7XG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KHRoaXMpKSB7XG4gICAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChcIkZsb2F0MTZBcnJheVwiKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10eXBlZGFycmF5LmJ5dGVzX3Blcl9lbGVtZW50ICovXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXksIFwiQllURVNfUEVSX0VMRU1FTlRcIiwge1xuICB2YWx1ZTogQllURVNfUEVSX0VMRU1FTlQsXG59KTtcblxuLy8gbGltaXRhdGlvbjogSXQgaXMgcGVha2VkIGJ5IGBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKEZsb2F0MTZBcnJheSlgIGFuZCBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXksIGJyYW5kLCB7fSk7XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtcHJvcGVydGllcy1vZi10aGUtdHlwZWRhcnJheS1jb25zdHJ1Y3RvcnMgKi9cblJlZmxlY3RTZXRQcm90b3R5cGVPZihGbG9hdDE2QXJyYXksIFR5cGVkQXJyYXkpO1xuXG5jb25zdCBGbG9hdDE2QXJyYXlQcm90b3R5cGUgPSBGbG9hdDE2QXJyYXkucHJvdG90eXBlO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXR5cGVkYXJyYXkucHJvdG90eXBlLmJ5dGVzX3Blcl9lbGVtZW50ICovXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXlQcm90b3R5cGUsIFwiQllURVNfUEVSX0VMRU1FTlRcIiwge1xuICB2YWx1ZTogQllURVNfUEVSX0VMRU1FTlQsXG59KTtcblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLUBAaXRlcmF0b3IgKi9cbk9iamVjdERlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheVByb3RvdHlwZSwgU3ltYm9sSXRlcmF0b3IsIHtcbiAgdmFsdWU6IEZsb2F0MTZBcnJheVByb3RvdHlwZS52YWx1ZXMsXG4gIHdyaXRhYmxlOiB0cnVlLFxuICBjb25maWd1cmFibGU6IHRydWUsXG59KTtcblxuUmVmbGVjdFNldFByb3RvdHlwZU9mKEZsb2F0MTZBcnJheVByb3RvdHlwZSwgVHlwZWRBcnJheVByb3RvdHlwZSk7XG4iLCJpbXBvcnQgeyBpc0Zsb2F0MTZBcnJheSB9IGZyb20gXCIuL0Zsb2F0MTZBcnJheS5tanNcIjtcbmltcG9ydCB7IGlzTmF0aXZlVHlwZWRBcnJheSB9IGZyb20gXCIuL191dGlsL2lzLm1qc1wiO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVWludDhBcnJheXxVaW50OENsYW1wZWRBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxJbnQ4QXJyYXl8SW50MTZBcnJheXxJbnQzMkFycmF5fEZsb2F0MTZBcnJheXxGbG9hdDMyQXJyYXl8RmxvYXQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fEJpZ0ludDY0QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1R5cGVkQXJyYXkodGFyZ2V0KSB7XG4gIHJldHVybiBpc05hdGl2ZVR5cGVkQXJyYXkodGFyZ2V0KSB8fCBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpO1xufVxuIiwiaW1wb3J0IHsgc2FmZUlmTmVlZGVkIH0gZnJvbSBcIi4vX3V0aWwvYXJyYXlJdGVyYXRvci5tanNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHtcbiAgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYsXG4gIERhdGFWaWV3UHJvdG90eXBlU2V0VWludDE2LFxufSBmcm9tIFwiLi9fdXRpbC9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiByZXR1cm5zIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlld1xuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge1tib29sZWFuXX0gb3B0c1xuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZsb2F0MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIC4uLm9wdHMpIHtcbiAgcmV0dXJuIGNvbnZlcnRUb051bWJlcihcbiAgICBEYXRhVmlld1Byb3RvdHlwZUdldFVpbnQxNihkYXRhVmlldywgYnl0ZU9mZnNldCwgLi4uc2FmZUlmTmVlZGVkKG9wdHMpKVxuICApO1xufVxuXG4vKipcbiAqIHN0b3JlcyBhbiB1bnNpZ25lZCAxNi1iaXQgZmxvYXQgdmFsdWUgYXQgdGhlIHNwZWNpZmllZCBieXRlIG9mZnNldCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgRGF0YVZpZXdcbiAqIEBwYXJhbSB7RGF0YVZpZXd9IGRhdGFWaWV3XG4gKiBAcGFyYW0ge251bWJlcn0gYnl0ZU9mZnNldFxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlXG4gKiBAcGFyYW0ge1tib29sZWFuXX0gb3B0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RmxvYXQxNihkYXRhVmlldywgYnl0ZU9mZnNldCwgdmFsdWUsIC4uLm9wdHMpIHtcbiAgcmV0dXJuIERhdGFWaWV3UHJvdG90eXBlU2V0VWludDE2KFxuICAgIGRhdGFWaWV3LFxuICAgIGJ5dGVPZmZzZXQsXG4gICAgcm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSxcbiAgICAuLi5zYWZlSWZOZWVkZWQob3B0cylcbiAgKTtcbn1cbiIsImltcG9ydCB7IHJvdW5kVG9GbG9hdDE2IH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuXG4vKipcbiAqIHJldHVybnMgdGhlIG5lYXJlc3QgaGFsZi1wcmVjaXNpb24gZmxvYXQgcmVwcmVzZW50YXRpb24gb2YgYSBudW1iZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZjE2cm91bmQoeCkge1xuICByZXR1cm4gcm91bmRUb0Zsb2F0MTYoeCk7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7RUFBTyxNQUFNLHFCQUFxQixHQUFHLHVCQUF1QixDQUFDO0VBQ3RELE1BQU0saUNBQWlDLEdBQUcsbUNBQW1DLENBQUM7RUFDOUUsTUFBTSxrREFBa0Q7RUFDL0QsRUFBRSxvREFBb0QsQ0FBQztFQUNoRCxNQUFNLCtDQUErQztFQUM1RCxFQUFFLGlEQUFpRCxDQUFDO0VBQzdDLE1BQU0sa0RBQWtEO0VBQy9ELEVBQUUscURBQXFELENBQUM7RUFDakQsTUFBTSx3RUFBd0U7RUFDckYsRUFBRSwwRUFBMEUsQ0FBQztFQUN0RSxNQUFNLHlDQUF5QztFQUN0RCxFQUFFLDJDQUEyQyxDQUFDO0VBQ3ZDLE1BQU0sMENBQTBDO0VBQ3ZELEVBQUUsNENBQTRDLENBQUM7RUFDeEMsTUFBTSxpQ0FBaUM7RUFDOUMsRUFBRSw2REFBNkQsQ0FBQztFQUN6RCxNQUFNLGlDQUFpQyxHQUFHLHFDQUFxQyxDQUFDO0VBQ2hGLE1BQU0sMkNBQTJDO0VBQ3hELEVBQUUsNkNBQTZDLENBQUM7RUFDekMsTUFBTSw4REFBOEQ7RUFDM0UsRUFBRSxnRUFBZ0UsQ0FBQztFQUM1RCxNQUFNLHVCQUF1QixHQUFHLHlCQUF5Qjs7RUNmaEUsU0FBUyxXQUFXLENBQUMsTUFBTSxFQUFFO0VBQzdCLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksS0FBSztFQUMvQixJQUFJLE9BQU8sWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDL0MsR0FBRyxDQUFDO0VBQ0osQ0FBQztFQUdELFNBQVMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtFQUN4QyxFQUFFLE9BQU8sV0FBVztFQUNwQixJQUFJLCtCQUErQjtFQUNuQyxNQUFNLE1BQU07RUFDWixNQUFNLEdBQUc7RUFDVCxLQUFLLENBQUMsR0FBRztFQUNULEdBQUcsQ0FBQztFQUNKLENBQUM7RUFHTSxNQUFNO0VBQ2IsRUFBRSxLQUFLLEVBQUUsWUFBWTtFQUNyQixFQUFFLFNBQVMsRUFBRSxnQkFBZ0I7RUFDN0IsRUFBRSxjQUFjLEVBQUUscUJBQXFCO0VBQ3ZDLEVBQUUsR0FBRyxFQUFFLFVBQVU7RUFDakIsRUFBRSx3QkFBd0IsRUFBRSwrQkFBK0I7RUFDM0QsRUFBRSxjQUFjLEVBQUUscUJBQXFCO0VBQ3ZDLEVBQUUsR0FBRyxFQUFFLFVBQVU7RUFDakIsRUFBRSxPQUFPLEVBQUUsY0FBYztFQUN6QixFQUFFLEdBQUcsRUFBRSxVQUFVO0VBQ2pCLEVBQUUsY0FBYyxFQUFFLHFCQUFxQjtFQUN2QyxDQUFDLEdBQUcsT0FBTyxDQUFDO0VBR0wsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDO0VBRzFCLE1BQU07RUFDYixFQUFFLE9BQU87RUFDVCxFQUFFLGdCQUFnQjtFQUNsQixFQUFFLFFBQVEsRUFBRSxjQUFjO0VBQzFCLEVBQUUsS0FBSyxFQUFFLFdBQVc7RUFDcEIsQ0FBQyxHQUFHLE1BQU0sQ0FBQztFQUdKLE1BQU07RUFDYixFQUFFLFFBQVEsRUFBRSxjQUFjO0VBQzFCLEVBQUUsT0FBTyxFQUFFLGFBQWE7RUFDeEIsRUFBRSxXQUFXLEVBQUUsaUJBQWlCO0VBQ2hDLEVBQUUsR0FBRyxFQUFFLFNBQVM7RUFDaEIsQ0FBQyxHQUFHLE1BQU0sQ0FBQztFQUdKLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQztFQUM1QixNQUFNO0VBQ2IsRUFBRSxNQUFNLEVBQUUsWUFBWTtFQUN0QixFQUFFLGNBQWMsRUFBRSxvQkFBb0I7RUFDdEMsRUFBRSxNQUFNLEVBQUUsWUFBWTtFQUN0QixFQUFFLEVBQUUsRUFBRSxRQUFRO0VBQ2QsQ0FBQyxHQUFHLFlBQVksQ0FBQztFQUNqQixNQUFNLGVBQWUsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDO0VBRXhDLE1BQU0sK0JBQStCLElBQXNCLENBQUMsZUFBZSxFQUFFLGdCQUFnQjtFQUNwRyxJQUFJLFdBQVcsRUFBb0IsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLENBQUM7RUFDdEUsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUs7RUFDckIsSUFBSSxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7RUFDeEIsTUFBTSxNQUFNLGVBQWU7RUFDM0IsUUFBUSwwQ0FBMEM7RUFDbEQsT0FBTyxDQUFDO0VBQ1IsS0FBSztFQUVMLElBQUksSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3RDLElBQUksR0FBRztFQUNQLE1BQU0sTUFBTSxVQUFVLEdBQUcsK0JBQStCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQ3RFLE1BQU0sSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO0VBQ3BDLFFBQVEsSUFBSSxZQUFZLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFFO0VBQzdDLFVBQVUsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDO0VBQ2hDLFNBQVM7RUFFVCxRQUFRLE9BQU87RUFDZixPQUFPO0VBQ1AsS0FBSyxRQUFRLENBQUMsTUFBTSxHQUFHLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRTtFQUNoRSxHQUFHLENBQUM7RUFFRyxNQUFNLFlBQVksSUFBc0IsQ0FBQyxZQUFZLEVBQUUsTUFBTTtFQUNwRSxFQUFFLFdBQVcsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7RUFHOUMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDO0VBQ25CLE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7RUFDaEQsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQztFQUV0QyxNQUFNLGtCQUFrQixHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFNUQsTUFBTSxrQkFBa0IsR0FBRyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBRTVELE1BQU0sNEJBQTRCLEdBQUcsV0FBVztFQUN2RCxFQUFFLGNBQWMsQ0FBQyxjQUFjO0VBQy9CLENBQUMsQ0FBQztFQUNLLE1BQU0sa0NBQWtDLEdBQUcsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0VBRTFFLE1BQU0sNEJBQTRCLEdBQUcsV0FBVyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7RUFHckYsTUFBTTtFQUNiLEVBQUUsR0FBRyxFQUFFLE9BQU87RUFDZCxFQUFFLEtBQUssRUFBRSxTQUFTO0VBQ2xCLENBQUMsR0FBRyxJQUFJLENBQUM7RUFHRixNQUFNLGlCQUFpQixHQUFHLFdBQVcsQ0FBQztFQUN0QyxNQUFNLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztFQUMxRCxNQUFNLG9CQUFvQixHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQztFQUVsRCxNQUFNLHlCQUF5QixHQUFHLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUUxRSxNQUFNLGlDQUFpQyxHQUFHLGlCQUFpQixDQUFDLG9CQUFvQixFQUFFLFlBQVksQ0FBQyxDQUFDO0VBR2hHLE1BQU0sdUJBQXVCLEdBQUcsT0FBTyxpQkFBaUIsS0FBSyxXQUFXLEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0VBRXBHLE1BQU0sdUNBQXVDLEdBQUcsdUJBQXVCO0VBQzlFLEtBQUssaUJBQWlCLENBQUMsdUJBQXVCLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO0VBS2pFLE1BQU0sVUFBVSxHQUFHLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0VBQzVELE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7RUFDaEMsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDO0VBQ2pELE1BQU0sdUNBQXVDLEdBQUcsbUJBQW1CLENBQUMsY0FBYyxDQUFDLENBQUM7RUFFcEYsTUFBTSx1QkFBdUIsR0FBRyxXQUFXLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFdEUsTUFBTSx5QkFBeUIsR0FBRyxXQUFXO0VBQ3BELEVBQUUsbUJBQW1CLENBQUMsTUFBTTtFQUM1QixDQUFDLENBQUM7RUFFSyxNQUFNLDBCQUEwQixHQUFHLFdBQVc7RUFDckQsRUFBRSxtQkFBbUIsQ0FBQyxPQUFPO0VBQzdCLENBQUMsQ0FBQztFQUVLLE1BQU0sc0JBQXNCLEdBQUcsV0FBVyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBRXBFLE1BQU0sMEJBQTBCLEdBQUcsV0FBVztFQUNyRCxFQUFFLG1CQUFtQixDQUFDLE9BQU87RUFDN0IsQ0FBQyxDQUFDO0VBRUssTUFBTSx1QkFBdUIsR0FBRyxXQUFXLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFdEUsTUFBTSw2QkFBNkIsR0FBRyxXQUFXO0VBQ3hELEVBQUUsbUJBQW1CLENBQUMsVUFBVTtFQUNoQyxDQUFDLENBQUM7RUFFSyxNQUFNLHVCQUF1QixHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUV0RSxNQUFNLHdCQUF3QixHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUV4RSxNQUFNLDJCQUEyQixHQUFHLFdBQVc7RUFDdEQsRUFBRSxtQkFBbUIsQ0FBQyxRQUFRO0VBQzlCLENBQUMsQ0FBQztFQUVLLE1BQU0sNEJBQTRCLEdBQUcsaUJBQWlCO0VBQzdELEVBQUUsbUJBQW1CO0VBQ3JCLEVBQUUsUUFBUTtFQUNWLENBQUMsQ0FBQztFQUVLLE1BQU0sZ0NBQWdDLEdBQUcsaUJBQWlCO0VBQ2pFLEVBQUUsbUJBQW1CO0VBQ3JCLEVBQUUsWUFBWTtFQUNkLENBQUMsQ0FBQztFQUVLLE1BQU0sNEJBQTRCLEdBQUcsaUJBQWlCO0VBQzdELEVBQUUsbUJBQW1CO0VBQ3JCLEVBQUUsUUFBUTtFQUNWLENBQUMsQ0FBQztFQUVLLE1BQU0sdUNBQXVDLEdBQUcsaUJBQWlCO0VBQ3hFLEVBQUUsbUJBQW1CO0VBQ3JCLEVBQUUsaUJBQWlCO0VBQ25CLENBQUMsQ0FBQztFQUdLLE1BQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDO0VBR3BDLE1BQU0saUJBQWlCLEdBQUcsV0FBVyxDQUFDO0VBRXRDLE1BQU0sZUFBZSxHQUFHLENBQUMsR0FBRyxJQUFJLEtBQUs7RUFDNUMsRUFBRSxPQUFPLFlBQVksQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDL0QsQ0FBQyxDQUFDO0VBR0ssTUFBTSxpQkFBaUIsR0FBRyxXQUFXLENBQUM7RUFHdEMsTUFBTSxrQkFBa0IsR0FBRyxZQUFZLENBQUM7RUFJeEMsTUFBTSxzQkFBc0IsR0FBRyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBRTNFLE1BQU0sMEJBQTBCLEdBQUcsV0FBVyxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBSTVFLE1BQU0sc0JBQXNCLEdBQUcsV0FBVyxDQUFDLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUdyRSxNQUFNLGlCQUFpQixHQUFHLHFCQUFxQixDQUFDLHNCQUFzQixDQUFDLENBQUM7RUFHL0UsTUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO0VBRXRDLE1BQU0sMEJBQTBCLEdBQUcsV0FBVztFQUNyRCxFQUFFLGlCQUFpQixDQUFDLFNBQVM7RUFDN0IsQ0FBQyxDQUFDO0VBRUssTUFBTSwwQkFBMEIsR0FBRyxXQUFXO0VBQ3JELEVBQUUsaUJBQWlCLENBQUMsU0FBUztFQUM3QixDQUFDLENBQUM7RUFHSyxNQUFNLGVBQWUsR0FBRyxTQUFTLENBQUM7RUFDbEMsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUM7RUFPcEMsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDO0VBQ3JDLE1BQU0sZ0JBQWdCLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQztFQUUxQyxNQUFNLG1CQUFtQixHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUU5RCxNQUFNLG1CQUFtQixHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQU85RCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUM7RUFDckMsTUFBTSxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDO0VBRTFDLE1BQU0sbUJBQW1CLEdBQUcsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBRTlELE1BQU0sbUJBQW1CLEdBQUcsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBRTlELE1BQU0sbUJBQW1CLEdBQUcsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQzs7RUMzT3BFLE1BQU0sY0FBYyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7RUFFM0MsTUFBTSxxQkFBcUIsR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFO0VBQ2pELEVBQUUsSUFBSSxFQUFFO0VBQ1IsSUFBSSxLQUFLLEVBQUUsU0FBUyxJQUFJLEdBQUc7RUFDM0IsTUFBTSxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDdEUsTUFBTSxPQUFPLDBCQUEwQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0VBQ3ZELEtBQUs7RUFDTCxHQUFHO0VBRUgsRUFBRSxDQUFDLGNBQWMsR0FBRztFQUNwQixJQUFJLEtBQUssRUFBRSxTQUFTLE1BQU0sR0FBRztFQUM3QixNQUFNLE9BQU8sSUFBSSxDQUFDO0VBQ2xCLEtBQUs7RUFDTCxHQUFHO0VBQ0gsQ0FBQyxDQUFDLENBQUM7RUFNSSxTQUFTLFlBQVksQ0FBQyxLQUFLLEVBQUU7RUFDcEMsRUFBRTtFQUNGLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLGtDQUFrQztFQUNoRSxJQUFJLHNCQUFzQixDQUFDLElBQUksS0FBSywwQkFBMEI7RUFDOUQsSUFBSTtFQUNKLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztFQUVILEVBQUUsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLHFCQUFxQixDQUFDLENBQUM7RUFDbkQsRUFBRSxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLDRCQUE0QixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDakYsRUFBRSxPQUFPLElBQUksQ0FBQztFQUNkLENBQUM7RUFHRCxNQUFNLFVBQVUsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO0VBR3ZDLE1BQU0sMkJBQTJCLEdBQUcsWUFBWSxDQUFDLGlCQUFpQixFQUFFO0VBQ3BFLEVBQUUsSUFBSSxFQUFFO0VBQ1IsSUFBSSxLQUFLLEVBQUUsU0FBUyxJQUFJLEdBQUc7RUFDM0IsTUFBTSxNQUFNLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDOUQsTUFBTSxPQUFPLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQy9DLEtBQUs7RUFDTCxJQUFJLFFBQVEsRUFBRSxJQUFJO0VBQ2xCLElBQUksWUFBWSxFQUFFLElBQUk7RUFDdEIsR0FBRztFQUNILENBQUMsQ0FBQyxDQUFDO0VBRUgsS0FBSyxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQUMsc0JBQXNCLENBQUMsRUFBRTtFQUUxRCxFQUFFLElBQUksR0FBRyxLQUFLLE1BQU0sRUFBRTtFQUN0QixJQUFJLFNBQVM7RUFDYixHQUFHO0VBR0gsRUFBRSxvQkFBb0IsQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUUsK0JBQStCLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztFQUN2SCxDQUFDO0VBTU0sU0FBUyxJQUFJLENBQUMsU0FBUyxFQUFFO0VBQ2hDLEVBQUUsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLDJCQUEyQixDQUFDLENBQUM7RUFDMUQsRUFBRSxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0VBQ3BELEVBQUUsT0FBTyxLQUFLLENBQUM7RUFDZjs7RUNsRU8sU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFO0VBQ2hDLEVBQUU7RUFDRixJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRO0VBQ2hELElBQUksT0FBTyxLQUFLLEtBQUssVUFBVTtFQUMvQixJQUFJO0VBQ0osQ0FBQztFQU1NLFNBQVMsWUFBWSxDQUFDLEtBQUssRUFBRTtFQUNwQyxFQUFFLE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7RUFDckQsQ0FBQztFQVNNLFNBQVMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO0VBQzFDLEVBQUUsT0FBTyx1Q0FBdUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxTQUFTLENBQUM7RUFDdEUsQ0FBQztFQU1NLFNBQVMsd0JBQXdCLENBQUMsS0FBSyxFQUFFO0VBQ2hELEVBQUUsTUFBTSxjQUFjLEdBQUcsdUNBQXVDLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDeEUsRUFBRTtFQUNGLElBQUksY0FBYyxLQUFLLGVBQWU7RUFDdEMsSUFBSSxjQUFjLEtBQUssZ0JBQWdCO0VBQ3ZDLElBQUk7RUFDSixDQUFDO0VBTUQsU0FBUyxhQUFhLENBQUMsS0FBSyxFQUFFO0VBQzlCLEVBQUUsSUFBSTtFQUVOLElBQUksSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDN0IsTUFBTSxPQUFPLEtBQUssQ0FBQztFQUNuQixLQUFLO0VBQ0wsSUFBSSxpQ0FBaUMsR0FBcUIsS0FBSyxFQUFFLENBQUM7RUFDbEUsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7RUFDZCxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7RUFDSCxDQUFDO0VBTU0sU0FBUyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUU7RUFDM0MsRUFBRSxJQUFJLHVCQUF1QixLQUFLLElBQUksRUFBRTtFQUN4QyxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7RUFFSCxFQUFFLElBQUk7RUFDTixJQUFJLHVDQUF1QyxHQUFxQixLQUFLLEVBQUUsQ0FBQztFQUN4RSxJQUFJLE9BQU8sSUFBSSxDQUFDO0VBQ2hCLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTtFQUNkLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztFQUNILENBQUM7RUFNTSxTQUFTLGdCQUFnQixDQUFDLEtBQUssRUFBRTtFQUN4QyxFQUFFLE9BQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzVELENBQUM7RUFNTSxTQUFTLGVBQWUsQ0FBQyxLQUFLLEVBQUU7RUFDdkMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQzVCLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztFQUdILEVBQUU7RUFDRixJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxrQ0FBa0M7RUFDaEUsSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLEtBQUssMEJBQTBCO0VBQzlELElBQUk7RUFDSixDQUFDO0VBTU0sU0FBUywwQkFBMEIsQ0FBQyxLQUFLLEVBQUU7RUFDbEQsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDbEMsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0VBR0gsRUFBRTtFQUNGLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLHVDQUF1QztFQUNyRSxJQUFJLHNCQUFzQixDQUFDLElBQUksS0FBSywwQkFBMEI7RUFDOUQsSUFBSTtFQUNKLENBQUM7RUFNTSxTQUFTLDZCQUE2QixDQUFDLEtBQUssRUFBRTtFQUNyRCxFQUFFLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO0VBQ2pDLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztFQUVILEVBQUUsTUFBTSxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUM7RUFDeEIsRUFBRSxJQUFJLEtBQUssS0FBSyxNQUFNLEdBQUcsRUFBRSxFQUFFO0VBQzdCLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztFQUVILEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRTtFQUMvQixJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7RUFFSCxFQUFFLE9BQU8sTUFBTSxLQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUN0Qzs7RUNsSk8sTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUM7RUFPNUMsU0FBUyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUU7RUFDN0MsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQzdCLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztFQUVILEVBQUUsTUFBTSxTQUFTLEdBQUcscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDbEQsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0VBQ2hDLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztFQUVILEVBQUUsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQztFQUM1QyxFQUFFLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtFQUNqQyxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7RUFDSCxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7RUFDOUIsSUFBSSxNQUFNLGVBQWUsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0VBQzNFLEdBQUc7RUFFSCxFQUFFLE9BQU8sVUFBVSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztFQUN4Qzs7RUNsQkEsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO0VBUXZDLFNBQVMsZUFBZSxDQUFDLEdBQUcsRUFBRTtFQUM5QixFQUFFLE9BQU8sQ0FBQyxHQUFHLEdBQUcsa0JBQWtCLElBQUksa0JBQWtCLENBQUM7RUFDekQsQ0FBQztFQUVELE1BQU0saUJBQWlCLEdBQUcsZUFBZSxDQUFDO0VBQzFDLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDO0VBQ2hDLE1BQU0sZUFBZSxHQUFHLFlBQVksQ0FBQztFQUVyQyxNQUFNLCtDQUErQyxHQUFHLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQztFQUM1RixNQUFNLGtDQUFrQyxHQUFHLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQztFQU96RSxTQUFTLGNBQWMsQ0FBQyxHQUFHLEVBQUU7RUFDcEMsRUFBRSxNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUd0QixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtFQUMvQyxJQUFJLE9BQU8sTUFBTSxDQUFDO0VBQ2xCLEdBQUc7RUFHSCxFQUFFLE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQ25DLEVBQUUsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBR25DLEVBQUUsSUFBSSxRQUFRLEdBQUcsaUJBQWlCLEVBQUU7RUFDcEMsSUFBSSxPQUFPLElBQUksR0FBRyxlQUFlLENBQUMsUUFBUSxHQUFHLCtDQUErQyxDQUFDLEdBQUcsK0NBQStDLENBQUM7RUFDaEosR0FBRztFQUVILEVBQUUsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsa0NBQWtDLElBQUksUUFBUSxDQUFDO0VBQ25FLEVBQUUsTUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQztFQUcxQyxFQUFFLElBQUksTUFBTSxHQUFHLGlCQUFpQixJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRTtFQUN6RCxJQUFJLE9BQU8sSUFBSSxHQUFHLFFBQVEsQ0FBQztFQUMzQixHQUFHO0VBRUgsRUFBRSxPQUFPLElBQUksR0FBRyxNQUFNLENBQUM7RUFDdkIsQ0FBQztFQUlELE1BQU0sTUFBTSxHQUFHLElBQUksaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDeEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNqRCxNQUFNLFVBQVUsR0FBRyxJQUFJLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBRWpELE1BQU0sU0FBUyxHQUFHLElBQUksaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDN0MsTUFBTSxVQUFVLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUU3QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQzlCLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztFQUdwQixFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFO0VBQ2YsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLFdBQVcsTUFBTSxDQUFDO0VBQ2xDLElBQUksU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7RUFDbEMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0VBQy9CLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7RUFHL0IsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFO0VBQ3RCLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxZQUFZLE1BQU0sS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztFQUNoRCxJQUFJLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksTUFBTSxDQUFDO0VBQzFELElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNuQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBR25DLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUU7RUFDdEIsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQztFQUMzQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLE1BQU0sQ0FBQztFQUNyRCxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7RUFDL0IsSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztFQUcvQixHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFO0VBQ3RCLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLE1BQU0sQ0FBQztFQUNsQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDO0VBQ2xDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztFQUMvQixJQUFJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0VBRy9CLEdBQUcsTUFBTTtFQUNULElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLE1BQU0sQ0FBQztFQUNsQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDO0VBQ2xDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztFQUMvQixJQUFJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0VBQy9CLEdBQUc7RUFDSCxDQUFDO0VBT00sU0FBUyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUU7RUFDeEMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3JDLEVBQUUsTUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzFCLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEtBQUssQ0FBQztFQUM5QixFQUFFLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVUsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM1RCxDQUFDO0VBRUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNsRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQy9CLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztFQUNsQixFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUdaLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxVQUFVLE1BQU0sQ0FBQyxFQUFFO0VBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNaLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQztFQUNwQixHQUFHO0VBRUgsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7RUFDbkIsRUFBRSxDQUFDLElBQUksVUFBVSxDQUFDO0VBRWxCLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDM0IsQ0FBQztFQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDbEMsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztFQUNyRCxDQUFDO0VBRUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUNoRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQzdCLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7RUFDN0IsQ0FBQztFQUNELGFBQWEsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUM7RUFDL0IsYUFBYSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztFQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQzlCLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7RUFDbkQsQ0FBQztFQUNELGFBQWEsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUM7RUFFL0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQzdCLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFO0VBQ2hCLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztFQUMxQixHQUFHO0VBQ0gsQ0FBQztFQU9NLFNBQVMsZUFBZSxDQUFDLFdBQVcsRUFBRTtFQUM3QyxFQUFFLE1BQU0sQ0FBQyxHQUFHLFdBQVcsSUFBSSxFQUFFLENBQUM7RUFDOUIsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDM0YsRUFBRSxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN0Qjs7RUN4Sk8sU0FBUyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUU7RUFDNUMsRUFBRSxNQUFNLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQztFQUV6QixFQUFFLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUU7RUFDM0MsSUFBSSxPQUFPLENBQUMsQ0FBQztFQUNiLEdBQUc7RUFFSCxFQUFFLE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzNCLENBQUM7RUFPTSxTQUFTLFFBQVEsQ0FBQyxNQUFNLEVBQUU7RUFDakMsRUFBRSxNQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUM3QyxFQUFFLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtFQUNsQixJQUFJLE9BQU8sQ0FBQyxDQUFDO0VBQ2IsR0FBRztFQUVILEVBQUUsT0FBTyxNQUFNLEdBQUcsZ0JBQWdCO0VBQ2xDLE1BQU0sTUFBTTtFQUNaLE1BQU0sZ0JBQWdCLENBQUM7RUFDdkIsQ0FBQztFQVFNLFNBQVMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLGtCQUFrQixFQUFFO0VBQy9ELEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtFQUN6QixJQUFJLE1BQU0sZUFBZSxDQUFDLHFCQUFxQixDQUFDLENBQUM7RUFDakQsR0FBRztFQUVILEVBQUUsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztFQUN6QyxFQUFFLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtFQUNqQyxJQUFJLE9BQU8sa0JBQWtCLENBQUM7RUFDOUIsR0FBRztFQUNILEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtFQUM5QixJQUFJLE1BQU0sZUFBZSxDQUFDLCtDQUErQyxDQUFDLENBQUM7RUFDM0UsR0FBRztFQUVILEVBQUUsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0VBQzdDLEVBQUUsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO0VBQ3ZCLElBQUksT0FBTyxrQkFBa0IsQ0FBQztFQUM5QixHQUFHO0VBRUgsRUFBRSxPQUFPLE9BQU8sQ0FBQztFQUNqQixDQUFDO0VBT00sU0FBUyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7RUFDekMsRUFBRSxJQUFJLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQ25DLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztFQUVILEVBQUUsSUFBSTtFQUNOLElBQUkseUJBQXlCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUM1QyxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFhO0VBRTNCLEVBQUUsT0FBTyxJQUFJLENBQUM7RUFDZCxDQUFDO0VBU00sU0FBUyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtFQUNyQyxFQUFFLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNoQyxFQUFFLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUVoQyxFQUFFLElBQUksTUFBTSxJQUFJLE1BQU0sRUFBRTtFQUN4QixJQUFJLE9BQU8sQ0FBQyxDQUFDO0VBQ2IsR0FBRztFQUVILEVBQUUsSUFBSSxNQUFNLEVBQUU7RUFDZCxJQUFJLE9BQU8sQ0FBQyxDQUFDO0VBQ2IsR0FBRztFQUVILEVBQUUsSUFBSSxNQUFNLEVBQUU7RUFDZCxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFDZCxHQUFHO0VBRUgsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7RUFDYixJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFDZCxHQUFHO0VBRUgsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7RUFDYixJQUFJLE9BQU8sQ0FBQyxDQUFDO0VBQ2IsR0FBRztFQUVILEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDMUIsSUFBSSxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQ3ZDLElBQUksTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUV2QyxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksV0FBVyxFQUFFO0VBQ3JDLE1BQU0sT0FBTyxDQUFDLENBQUMsQ0FBQztFQUNoQixLQUFLO0VBRUwsSUFBSSxJQUFJLFdBQVcsSUFBSSxDQUFDLFdBQVcsRUFBRTtFQUNyQyxNQUFNLE9BQU8sQ0FBQyxDQUFDO0VBQ2YsS0FBSztFQUNMLEdBQUc7RUFFSCxFQUFFLE9BQU8sQ0FBQyxDQUFDO0VBQ1g7O0VDcERBLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0VBSzVCLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztFQU12QyxTQUFTLGNBQWMsQ0FBQyxNQUFNLEVBQUU7RUFDdkMsRUFBRSxPQUFPLG1CQUFtQixDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQztFQUN2RCxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLElBQUksb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztFQUNqRSxDQUFDO0VBT0QsU0FBUyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUU7RUFDcEMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQy9CLElBQUksTUFBTSxlQUFlLENBQUMsaUNBQWlDLENBQUMsQ0FBQztFQUM3RCxHQUFHO0VBQ0gsQ0FBQztFQVFELFNBQVMsdUJBQXVCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtFQUNoRCxFQUFFLE1BQU0sb0JBQW9CLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3RELEVBQUUsTUFBTSxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUV4RCxFQUFFLElBQUksQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLGtCQUFrQixFQUFFO0VBQ3BELElBQUksTUFBTSxlQUFlLENBQUMsa0RBQWtELENBQUMsQ0FBQztFQUM5RSxHQUFHO0VBRUgsRUFBRSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtFQUNqQyxJQUFJLElBQUksTUFBTSxDQUFDO0VBQ2YsSUFBSSxJQUFJLG9CQUFvQixFQUFFO0VBQzlCLE1BQU0sTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUMzRCxNQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0VBQzlELEtBQUssTUFBTTtFQUNYLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3BELEtBQUs7RUFFTCxJQUFJLElBQUksTUFBTSxHQUFHLEtBQUssRUFBRTtFQUN4QixNQUFNLE1BQU0sZUFBZTtFQUMzQixRQUFRLHdFQUF3RTtFQUNoRixPQUFPLENBQUM7RUFDUixLQUFLO0VBQ0wsR0FBRztFQUVILEVBQUUsSUFBSSx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsRUFBRTtFQUN4QyxJQUFJLE1BQU0sZUFBZSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7RUFDN0QsR0FBRztFQUNILENBQUM7RUFPRCxTQUFTLG1CQUFtQixDQUFDLE9BQU8sRUFBRTtFQUN0QyxFQUFFLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUM7RUFDM0UsRUFBRSxJQUFJLGdCQUFnQixLQUFLLFNBQVMsRUFBRTtFQUN0QyxJQUFJLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFFbEUsSUFBSSxJQUFJLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQ2xDLE1BQU0sTUFBTSxlQUFlLENBQUMseUNBQXlDLENBQUMsQ0FBQztFQUN2RSxLQUFLO0VBRUwsSUFBSSxPQUFPLGdCQUFnQixDQUFDO0VBQzVCLEdBQUc7RUFHSCxFQUFFLE1BQU0sTUFBTSxJQUFzQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7RUFFckQsRUFBRSxJQUFJLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQ2hDLElBQUksTUFBTSxlQUFlLENBQUMseUNBQXlDLENBQUMsQ0FBQztFQUNyRSxHQUFHO0VBRUgsRUFBRSxNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUU7RUFDaEQsSUFBSSxNQUFNO0VBQ1YsS0FBdUIsQ0FBQyxPQUFPLEVBQUUsVUFBVTtFQUMzQyxLQUF1QixDQUFDLE9BQU8sRUFBRSxNQUFNO0VBQ3ZDLEdBQUcsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDMUIsRUFBRSxPQUFPLG1CQUFtQixDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0VBQ3hELENBQUM7RUFNRCxTQUFTLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRTtFQUN2QyxFQUFFLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFFaEUsRUFBRSxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7RUFDbkIsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ25DLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3BELEdBQUc7RUFFSCxFQUFFLE9BQU8sS0FBSyxDQUFDO0VBQ2YsQ0FBQztFQUdELE1BQU0sMEJBQTBCLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztFQUN2RCxLQUFLLE1BQU0sR0FBRyxJQUFJLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO0VBRXZELEVBQUUsSUFBSSxHQUFHLEtBQUssaUJBQWlCLEVBQUU7RUFDakMsSUFBSSxTQUFTO0VBQ2IsR0FBRztFQUVILEVBQUUsTUFBTSxVQUFVLEdBQUcsK0JBQStCLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDL0UsRUFBRSxJQUFJLFlBQVksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLElBQUksT0FBTyxVQUFVLENBQUMsR0FBRyxLQUFLLFVBQVUsRUFBRTtFQUMvRSxJQUFJLG1CQUFtQixDQUFDLDBCQUEwQixFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNwRSxHQUFHO0VBQ0gsQ0FBQztFQUVELE1BQU0sT0FBTyxHQUFHLFlBQVksR0FBZ0Q7RUFDNUUsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUU7RUFDN0IsSUFBSSxJQUFJLDZCQUE2QixDQUFDLEdBQUcsQ0FBQyxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7RUFDekUsTUFBTSxPQUFPLGVBQWUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDdEQsS0FBSztFQUdMLElBQUksSUFBSSxtQkFBbUIsQ0FBQywwQkFBMEIsRUFBRSwrQkFBK0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTtFQUN2RyxNQUFNLE9BQU8sVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztFQUNyQyxLQUFLO0VBRUwsSUFBSSxPQUFPLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0VBQzdDLEdBQUc7RUFFSCxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7RUFDcEMsSUFBSSxJQUFJLDZCQUE2QixDQUFDLEdBQUcsQ0FBQyxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7RUFDekUsTUFBTSxPQUFPLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDaEUsS0FBSztFQUVMLElBQUksT0FBTyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7RUFDcEQsR0FBRztFQUVILEVBQUUsd0JBQXdCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtFQUN4QyxJQUFJLElBQUksNkJBQTZCLENBQUMsR0FBRyxDQUFDLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtFQUN6RSxNQUFNLE1BQU0sVUFBVSxHQUFHLCtCQUErQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztFQUN0RSxNQUFNLFVBQVUsQ0FBQyxLQUFLLEdBQUcsZUFBZSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUMzRCxNQUFNLE9BQU8sVUFBVSxDQUFDO0VBQ3hCLEtBQUs7RUFFTCxJQUFJLE9BQU8sK0JBQStCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQ3hELEdBQUc7RUFFSCxFQUFFLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRTtFQUMxQyxJQUFJO0VBQ0osTUFBTSw2QkFBNkIsQ0FBQyxHQUFHLENBQUM7RUFDeEMsTUFBTSxZQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztFQUMvQixNQUFNLFlBQVksQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDO0VBQ3ZDLE1BQU07RUFDTixNQUFNLFVBQVUsQ0FBQyxLQUFLLEdBQUcsa0JBQWtCLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzlELE1BQU0sT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0VBQzVELEtBQUs7RUFFTCxJQUFJLE9BQU8scUJBQXFCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztFQUMxRCxHQUFHO0VBQ0gsQ0FBQyxFQUFFLENBQUM7RUFFRyxNQUFNLFlBQVksQ0FBQztFQUUxQixFQUFFLFdBQVcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRTtFQUUzQyxJQUFJLElBQUksZ0JBQWdCLENBQUM7RUFFekIsSUFBSSxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUMvQixNQUFNLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDdkcsS0FBSyxNQUFNLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFFNUQsTUFBTSxJQUFJLElBQUksQ0FBQztFQUVmLE1BQU0sSUFBSSxNQUFNLENBQUM7RUFFakIsTUFBTSxJQUFJLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQ3JDLFFBQVEsSUFBSSxHQUFHLEtBQUssQ0FBQztFQUNyQixRQUFRLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUVyRCxRQUFRLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLEtBQUssQ0FBQyxDQUFDO0VBRTNELFFBQVEsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRTtFQUN0QyxVQUFVLE1BQU0sZUFBZSxDQUFDLHlDQUF5QyxDQUFDLENBQUM7RUFDM0UsU0FBUztFQUVULFFBQVEsSUFBSSx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUM3QyxVQUFVLE1BQU0sZUFBZSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7RUFDbkUsU0FBUztFQUVULFFBQVEsTUFBTSxJQUFJLEdBQUcsSUFBSSxpQkFBaUI7RUFDMUMsVUFBVSxNQUFNLEdBQUcsaUJBQWlCO0VBQ3BDLFNBQVMsQ0FBQztFQUNWLFFBQVEsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDbkYsT0FBTyxNQUFNO0VBQ2IsUUFBUSxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7RUFDL0MsUUFBUSxJQUFJLFFBQVEsSUFBSSxJQUFJLElBQUksT0FBTyxRQUFRLEtBQUssVUFBVSxFQUFFO0VBQ2hFLFVBQVUsTUFBTSxlQUFlLENBQUMsaUNBQWlDLENBQUMsQ0FBQztFQUNuRSxTQUFTO0VBRVQsUUFBUSxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7RUFFOUIsVUFBVSxJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUN0QyxZQUFZLElBQUksR0FBRyxLQUFLLENBQUM7RUFDekIsWUFBWSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztFQUNsQyxXQUFXLE1BQU07RUFFakIsWUFBWSxJQUFJLEdBQUcsQ0FBQyxNQUFzQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0VBQ2xFLFlBQVksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7RUFDakMsV0FBVztFQUNYLFNBQVMsTUFBTTtFQUNmLFVBQVUsSUFBSSxLQUFzQyxLQUFLLENBQUMsQ0FBQztFQUMzRCxVQUFVLE1BQU0sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3pDLFNBQVM7RUFDVCxRQUFRLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3JGLE9BQU87RUFHUCxNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDdkMsUUFBUSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMxRCxPQUFPO0VBQ1AsS0FBSyxNQUFNO0VBQ1gsTUFBTSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3BGLEtBQUs7RUFHTCxJQUFJLE1BQU0sS0FBSyxLQUF1QixJQUFJLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBR2xGLElBQUksbUJBQW1CLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUM7RUFFcEUsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0VBTUgsRUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDNUIsSUFBSSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUM7RUFFN0IsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsRUFBRTtFQUN6QyxNQUFNLE1BQU0sZUFBZTtFQUMzQixRQUFRLGtEQUFrRDtFQUMxRCxPQUFPLENBQUM7RUFDUixLQUFLO0VBR0wsSUFBSSxJQUFJLFdBQVcsS0FBSyxZQUFZLEVBQUU7RUFDdEMsTUFBTSxJQUFJLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtFQUNwRCxRQUFRLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDMUQsUUFBUSxNQUFNLE1BQU0sR0FBRyxJQUFJLGlCQUFpQjtFQUM1QyxVQUFVLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDO0VBQ3hELFVBQVUsZ0NBQWdDLENBQUMsZ0JBQWdCLENBQUM7RUFDNUQsVUFBVSw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQztFQUN4RCxTQUFTLENBQUM7RUFDVixRQUFRLE9BQU8sSUFBSSxZQUFZO0VBQy9CLFVBQVUsNEJBQTRCLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDeEUsU0FBUyxDQUFDO0VBQ1YsT0FBTztFQUVQLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtFQUM3QixRQUFRLE9BQU8sSUFBSSxZQUFZO0VBQy9CLFVBQVUsNEJBQTRCO0VBQ3RDLFlBQVksZUFBZSxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsQ0FBQztFQUNwRCxXQUFXO0VBQ1gsU0FBUyxDQUFDO0VBQ1YsT0FBTztFQUVQLE1BQU0sTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzlCLE1BQU0sTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBRTlCLE1BQU0sT0FBTyxJQUFJLFlBQVk7RUFDN0IsUUFBUSw0QkFBNEI7RUFDcEMsVUFBVSxlQUFlLENBQUMsR0FBRyxFQUFFLFVBQVUsR0FBRyxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQ3ZELFlBQVksT0FBTyxrQkFBa0I7RUFDckMsY0FBYyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQ3ZFLGFBQWEsQ0FBQztFQUNkLFdBQVcsRUFBRSxPQUFPLENBQUM7RUFDckIsU0FBUztFQUNULE9BQU8sQ0FBQztFQUNSLEtBQUs7RUFHTCxJQUFJLElBQUksSUFBSSxDQUFDO0VBRWIsSUFBSSxJQUFJLE1BQU0sQ0FBQztFQUVmLElBQUksTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0VBQ3pDLElBQUksSUFBSSxRQUFRLElBQUksSUFBSSxJQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFBRTtFQUM1RCxNQUFNLE1BQU0sZUFBZSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7RUFDL0QsS0FBSztFQUVMLElBQUksSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO0VBRTFCLE1BQU0sSUFBSSxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUU7RUFDaEMsUUFBUSxJQUFJLEdBQUcsR0FBRyxDQUFDO0VBQ25CLFFBQVEsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7RUFDNUIsT0FBTyxNQUFNLElBQUksMEJBQTBCLENBQUMsR0FBRyxDQUFDLEVBQUU7RUFDbEQsUUFBUSxJQUFJLEdBQUcsR0FBRyxDQUFDO0VBQ25CLFFBQVEsTUFBTSxHQUFHLDRCQUE0QixDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ25ELE9BQU8sTUFBTTtFQUViLFFBQVEsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztFQUN4QixRQUFRLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0VBQzdCLE9BQU87RUFDUCxLQUFLLE1BQU07RUFDWCxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtFQUN2QixRQUFRLE1BQU0sZUFBZTtFQUM3QixVQUFVLDBDQUEwQztFQUNwRCxTQUFTLENBQUM7RUFDVixPQUFPO0VBQ1AsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQy9CLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDckMsS0FBSztFQUVMLElBQUksTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7RUFFMUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0VBQzNCLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUN2QyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBMEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDbkQsT0FBTztFQUNQLEtBQUssTUFBTTtFQUNYLE1BQU0sTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzlCLE1BQU0sTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzlCLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUN2QyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2hFLE9BQU87RUFDUCxLQUFLO0VBRUwsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0VBTUgsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRTtFQUN0QixJQUFJLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQztFQUU3QixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxFQUFFO0VBQ3pDLE1BQU0sTUFBTSxlQUFlO0VBQzNCLFFBQVEsa0RBQWtEO0VBQzFELE9BQU8sQ0FBQztFQUNSLEtBQUs7RUFFTCxJQUFJLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7RUFHaEMsSUFBSSxJQUFJLFdBQVcsS0FBSyxZQUFZLEVBQUU7RUFDdEMsTUFBTSxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUM3QyxNQUFNLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7RUFFMUQsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3ZDLFFBQVEsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDM0QsT0FBTztFQUVQLE1BQU0sT0FBTyxLQUFLLENBQUM7RUFDbkIsS0FBSztFQUVMLElBQUksTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7RUFFMUMsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3JDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMxQixLQUFLO0VBRUwsSUFBSSxPQUFPLEtBQUssQ0FBQztFQUNqQixHQUFHO0VBR0gsRUFBRSxJQUFJLEdBQUc7RUFDVCxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUV2RCxJQUFJLE9BQU8sdUJBQXVCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNyRCxHQUFHO0VBTUgsRUFBRSxNQUFNLEdBQUc7RUFDWCxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUV2RCxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsYUFBYTtFQUU5QixNQUFNLEtBQUssTUFBTSxHQUFHLElBQUkseUJBQXlCLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtFQUNyRSxRQUFRLE1BQU0sZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ25DLE9BQU87RUFDUCxLQUFLLEdBQUcsQ0FBQyxDQUFDO0VBQ1YsR0FBRztFQU1ILEVBQUUsT0FBTyxHQUFHO0VBQ1osSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFdkQsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLGFBQWE7RUFFOUIsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksMEJBQTBCLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtFQUMzRSxRQUFRLFFBQXVDLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDMUUsT0FBTztFQUNQLEtBQUssR0FBRyxDQUFDLENBQUM7RUFDVixHQUFHO0VBR0gsRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFO0VBQ1osSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFdkQsSUFBSSxNQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0VBQ2xFLElBQUksTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDckQsSUFBSSxNQUFNLENBQUMsR0FBRyxhQUFhLElBQUksQ0FBQyxHQUFHLGFBQWEsR0FBRyxNQUFNLEdBQUcsYUFBYSxDQUFDO0VBRTFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLEVBQUU7RUFDOUIsTUFBTSxPQUFPO0VBQ2IsS0FBSztFQUVMLElBQUksT0FBTyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNoRCxHQUFHO0VBR0gsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtFQUNyQixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUV2RCxJQUFJLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDbEUsSUFBSSxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNyRCxJQUFJLE1BQU0sQ0FBQyxHQUFHLGFBQWEsSUFBSSxDQUFDLEdBQUcsYUFBYSxHQUFHLE1BQU0sR0FBRyxhQUFhLENBQUM7RUFFMUUsSUFBSSxNQUFNLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQztFQUUxQixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxFQUFFO0VBQzlCLE1BQU0sTUFBTSxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0VBQ3RELEtBQUs7RUFHTCxJQUFJLE1BQU0sTUFBTSxHQUFHLElBQUksaUJBQWlCO0VBQ3hDLE1BQU0sNEJBQTRCLENBQUMsZ0JBQWdCLENBQUM7RUFDcEQsTUFBTSxnQ0FBZ0MsQ0FBQyxnQkFBZ0IsQ0FBQztFQUN4RCxNQUFNLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDO0VBQ3BELEtBQUssQ0FBQztFQUNOLElBQUksTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFZO0VBQ25DLE1BQU0sNEJBQTRCO0VBQ2xDLFFBQVEsd0JBQXdCLENBQUMsTUFBTSxDQUFDO0VBQ3hDLE9BQU87RUFDUCxLQUFLLENBQUM7RUFDTixJQUFJLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBRTlDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBRTFDLElBQUksT0FBTyxNQUFNLENBQUM7RUFDbEIsR0FBRztFQUdILEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksRUFBRTtFQUN6QixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUV2RCxJQUFJLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDbEUsSUFBSSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFFNUIsSUFBSSxNQUFNLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLENBQUMsQ0FBQztFQUczRSxJQUFJLElBQUksV0FBVyxLQUFLLFlBQVksRUFBRTtFQUN0QyxNQUFNLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzdDLE1BQU0sTUFBTSxLQUFLLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7RUFFL0MsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3ZDLFFBQVEsTUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDekQsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsa0JBQWtCO0VBQ3JDLFVBQVUsWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQ3pELFNBQVMsQ0FBQztFQUNWLE9BQU87RUFFUCxNQUFNLE9BQU8sS0FBSyxDQUFDO0VBQ25CLEtBQUs7RUFFTCxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzFDLElBQUksdUJBQXVCLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0VBRTNDLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUNyQyxNQUFNLE1BQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3ZELE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQ2pFLEtBQUs7RUFFTCxJQUFJLFNBQTJCLEtBQUssRUFBRTtFQUN0QyxHQUFHO0VBR0gsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQzVCLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBRXZELElBQUksTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNsRSxJQUFJLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUU1QixJQUFJLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztFQUNwQixJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDckMsTUFBTSxNQUFNLEdBQUcsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN2RCxNQUFNLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUU7RUFDM0QsUUFBUSxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDdEMsT0FBTztFQUNQLEtBQUs7RUFFTCxJQUFJLE1BQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxDQUFDO0VBQzNFLElBQUksTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDeEMsSUFBSSx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUVuQyxJQUFJLFNBQTJCLEtBQUssRUFBRTtFQUN0QyxHQUFHO0VBR0gsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQzVCLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBRXZELElBQUksTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNsRSxJQUFJLElBQUksTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtFQUMzQyxNQUFNLE1BQU0sZUFBZSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7RUFDekUsS0FBSztFQUVMLElBQUksSUFBSSxXQUFXLEVBQUUsS0FBSyxDQUFDO0VBQzNCLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtFQUMzQixNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6RCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7RUFDaEIsS0FBSyxNQUFNO0VBQ1gsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzVCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztFQUNoQixLQUFLO0VBRUwsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3pDLE1BQU0sV0FBVyxHQUFHLFFBQVE7RUFDNUIsUUFBUSxXQUFXO0VBQ25CLFFBQVEsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzVDLFFBQVEsQ0FBQztFQUNULFFBQVEsSUFBSTtFQUNaLE9BQU8sQ0FBQztFQUNSLEtBQUs7RUFFTCxJQUFJLE9BQU8sV0FBVyxDQUFDO0VBQ3ZCLEdBQUc7RUFHSCxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDakMsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFdkQsSUFBSSxNQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0VBQ2xFLElBQUksSUFBSSxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0VBQzNDLE1BQU0sTUFBTSxlQUFlLENBQUMsMkNBQTJDLENBQUMsQ0FBQztFQUN6RSxLQUFLO0VBRUwsSUFBSSxJQUFJLFdBQVcsRUFBRSxLQUFLLENBQUM7RUFDM0IsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0VBQzNCLE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNsRSxNQUFNLEtBQUssR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQ3pCLEtBQUssTUFBTTtFQUNYLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM1QixNQUFNLEtBQUssR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQ3pCLEtBQUs7RUFFTCxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDckMsTUFBTSxXQUFXLEdBQUcsUUFBUTtFQUM1QixRQUFRLFdBQVc7RUFDbkIsUUFBUSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDNUMsUUFBUSxDQUFDO0VBQ1QsUUFBUSxJQUFJO0VBQ1osT0FBTyxDQUFDO0VBQ1IsS0FBSztFQUVMLElBQUksT0FBTyxXQUFXLENBQUM7RUFDdkIsR0FBRztFQUdILEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksRUFBRTtFQUM3QixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUV2RCxJQUFJLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDbEUsSUFBSSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFFNUIsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3JDLE1BQU0sWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUU7RUFDdEMsUUFBUSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDNUMsUUFBUSxDQUFDO0VBQ1QsUUFBUSxJQUFJO0VBQ1osT0FBTyxDQUFDLENBQUM7RUFDVCxLQUFLO0VBQ0wsR0FBRztFQUdILEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksRUFBRTtFQUMxQixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUV2RCxJQUFJLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDbEUsSUFBSSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFFNUIsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3JDLE1BQU0sTUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDekQsTUFBTSxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFO0VBQzdELFFBQVEsT0FBTyxLQUFLLENBQUM7RUFDckIsT0FBTztFQUNQLEtBQUs7RUFDTCxHQUFHO0VBR0gsRUFBRSxTQUFTLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQy9CLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBRXZELElBQUksTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNsRSxJQUFJLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUU1QixJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDckMsTUFBTSxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6RCxNQUFNLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUU7RUFDN0QsUUFBUSxPQUFPLENBQUMsQ0FBQztFQUNqQixPQUFPO0VBQ1AsS0FBSztFQUVMLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztFQUNkLEdBQUc7RUFHSCxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDOUIsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFdkQsSUFBSSxNQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0VBQ2xFLElBQUksTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBRTVCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDMUMsTUFBTSxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6RCxNQUFNLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUU7RUFDN0QsUUFBUSxPQUFPLEtBQUssQ0FBQztFQUNyQixPQUFPO0VBQ1AsS0FBSztFQUNMLEdBQUc7RUFHSCxFQUFFLGFBQWEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDbkMsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFdkQsSUFBSSxNQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0VBQ2xFLElBQUksTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBRTVCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDMUMsTUFBTSxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6RCxNQUFNLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUU7RUFDN0QsUUFBUSxPQUFPLENBQUMsQ0FBQztFQUNqQixPQUFPO0VBQ1AsS0FBSztFQUVMLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztFQUNkLEdBQUc7RUFHSCxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDM0IsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFdkQsSUFBSSxNQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0VBQ2xFLElBQUksTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBRTVCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtFQUNyQyxNQUFNO0VBQ04sUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFO0VBQ3pDLFVBQVUsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzlDLFVBQVUsQ0FBQztFQUNYLFVBQVUsSUFBSTtFQUNkLFNBQVMsQ0FBQztFQUNWLFFBQVE7RUFDUixRQUFRLE9BQU8sS0FBSyxDQUFDO0VBQ3JCLE9BQU87RUFDUCxLQUFLO0VBRUwsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHO0VBR0gsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQzFCLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBRXZELElBQUksTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNsRSxJQUFJLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUU1QixJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDckMsTUFBTTtFQUNOLFFBQVEsWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUU7RUFDeEMsVUFBVSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDOUMsVUFBVSxDQUFDO0VBQ1gsVUFBVSxJQUFJO0VBQ2QsU0FBUyxDQUFDO0VBQ1YsUUFBUTtFQUNSLFFBQVEsT0FBTyxJQUFJLENBQUM7RUFDcEIsT0FBTztFQUNQLEtBQUs7RUFFTCxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7RUFHSCxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDdEIsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFdkQsSUFBSSxNQUFNLFlBQVksR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN0RCxJQUFJLElBQUksWUFBWSxHQUFHLENBQUMsRUFBRTtFQUMxQixNQUFNLE1BQU0sZ0JBQWdCLENBQUMsdUJBQXVCLENBQUMsQ0FBQztFQUN0RCxLQUFLO0VBRUwsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7RUFDdkIsTUFBTSxNQUFNLGVBQWU7RUFDM0IsUUFBUSwwQ0FBMEM7RUFDbEQsT0FBTyxDQUFDO0VBQ1IsS0FBSztFQUVMLElBQUksSUFBSSx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUN6QyxNQUFNLE1BQU0sZUFBZTtFQUMzQixRQUFRLGlDQUFpQztFQUN6QyxPQUFPLENBQUM7RUFDUixLQUFLO0VBR0wsSUFBSSxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUUvQixNQUFNLE9BQU8sc0JBQXNCO0VBQ25DLFFBQVEsbUJBQW1CLENBQUMsSUFBSSxDQUFDO0VBQ2pDLFFBQVEsbUJBQW1CLENBQUMsS0FBSyxDQUFDO0VBQ2xDLFFBQVEsWUFBWTtFQUNwQixPQUFPLENBQUM7RUFDUixLQUFLO0VBRUwsSUFBSSxJQUFJLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQ25DLE1BQU0sTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDekQsTUFBTSxJQUFJLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQ3BDLFFBQVEsTUFBTSxlQUFlLENBQUMseUNBQXlDLENBQUMsQ0FBQztFQUN6RSxPQUFPO0VBQ1AsS0FBSztFQUVMLElBQUksTUFBTSxZQUFZLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUV4RSxJQUFJLE1BQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNwQyxJQUFJLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7RUFFM0MsSUFBSSxJQUFJLFlBQVksS0FBSyxRQUFRLElBQUksU0FBUyxHQUFHLFlBQVksR0FBRyxZQUFZLEVBQUU7RUFDOUUsTUFBTSxNQUFNLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLENBQUM7RUFDdEQsS0FBSztFQUVMLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRTtFQUN4QyxNQUFNLGdCQUFnQixDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN0RSxLQUFLO0VBQ0wsR0FBRztFQUdILEVBQUUsT0FBTyxHQUFHO0VBQ1osSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFdkQsSUFBSSwwQkFBMEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0VBRWpELElBQUksT0FBTyxJQUFJLENBQUM7RUFDaEIsR0FBRztFQUdILEVBQUUsVUFBVSxHQUFHO0VBQ2YsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7RUFHdkQsSUFBSSxNQUFNLE1BQU0sR0FBRyxJQUFJLGlCQUFpQjtFQUN4QyxNQUFNLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDO0VBQ3BELE1BQU0sZ0NBQWdDLENBQUMsZ0JBQWdCLENBQUM7RUFDeEQsTUFBTSw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQztFQUNwRCxLQUFLLENBQUM7RUFDTixJQUFJLE1BQU0sTUFBTSxHQUFHLElBQUksWUFBWTtFQUNuQyxNQUFNLDRCQUE0QjtFQUNsQyxRQUFRLHdCQUF3QixDQUFDLE1BQU0sQ0FBQztFQUN4QyxPQUFPO0VBQ1AsS0FBSyxDQUFDO0VBRU4sSUFBSSxNQUFNLHNCQUFzQixHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQy9ELElBQUksMEJBQTBCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztFQUV2RCxJQUFJLE9BQU8sTUFBTSxDQUFDO0VBQ2xCLEdBQUc7RUFHSCxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLEVBQUU7RUFDdkIsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFdkQsSUFBSSx1QkFBdUI7RUFDM0IsTUFBTSxnQkFBZ0I7RUFDdEIsTUFBTSxrQkFBa0IsQ0FBQyxLQUFLLENBQUM7RUFDL0IsTUFBTSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUM7RUFDM0IsS0FBSyxDQUFDO0VBRU4sSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHO0VBR0gsRUFBRSxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksRUFBRTtFQUNyQyxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUV2RCxJQUFJLDZCQUE2QixDQUFDLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUUxRixJQUFJLE9BQU8sSUFBSSxDQUFDO0VBQ2hCLEdBQUc7RUFHSCxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUU7RUFDbEIsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFdkQsSUFBSSxNQUFNLFdBQVcsR0FBRyxTQUFTLEtBQUssU0FBUyxHQUFHLFNBQVMsR0FBRyxjQUFjLENBQUM7RUFDN0UsSUFBSSx1QkFBdUIsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUs7RUFDeEQsTUFBTSxPQUFPLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakUsS0FBSyxDQUFDLENBQUM7RUFFUCxJQUFJLE9BQU8sSUFBSSxDQUFDO0VBQ2hCLEdBQUc7RUFHSCxFQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUU7RUFDdEIsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFdkQsSUFBSSxJQUFJLFNBQVMsS0FBSyxTQUFTLElBQUksT0FBTyxTQUFTLEtBQUssVUFBVSxFQUFFO0VBQ3BFLE1BQU0sTUFBTSxJQUFJLGVBQWUsQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO0VBQ2hHLEtBQUs7RUFDTCxJQUFJLE1BQU0sV0FBVyxHQUFHLFNBQVMsS0FBSyxTQUFTLEdBQUcsU0FBUyxHQUFHLGNBQWMsQ0FBQztFQUc3RSxJQUFJLE1BQU0sTUFBTSxHQUFHLElBQUksaUJBQWlCO0VBQ3hDLE1BQU0sNEJBQTRCLENBQUMsZ0JBQWdCLENBQUM7RUFDcEQsTUFBTSxnQ0FBZ0MsQ0FBQyxnQkFBZ0IsQ0FBQztFQUN4RCxNQUFNLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDO0VBQ3BELEtBQUssQ0FBQztFQUNOLElBQUksTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFZO0VBQ25DLE1BQU0sNEJBQTRCO0VBQ2xDLFFBQVEsd0JBQXdCLENBQUMsTUFBTSxDQUFDO0VBQ3hDLE9BQU87RUFDUCxLQUFLLENBQUM7RUFFTixJQUFJLE1BQU0sc0JBQXNCLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDL0QsSUFBSSx1QkFBdUIsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUs7RUFDOUQsTUFBTSxPQUFPLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakUsS0FBSyxDQUFDLENBQUM7RUFFUCxJQUFJLE9BQU8sTUFBTSxDQUFDO0VBQ2xCLEdBQUc7RUFHSCxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO0VBQ3BCLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBRXZELElBQUksTUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLENBQUM7RUFHM0UsSUFBSSxJQUFJLFdBQVcsS0FBSyxZQUFZLEVBQUU7RUFDdEMsTUFBTSxNQUFNLE1BQU0sR0FBRyxJQUFJLGlCQUFpQjtFQUMxQyxRQUFRLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDO0VBQ3RELFFBQVEsZ0NBQWdDLENBQUMsZ0JBQWdCLENBQUM7RUFDMUQsUUFBUSw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQztFQUN0RCxPQUFPLENBQUM7RUFDUixNQUFNLE9BQU8sSUFBSSxZQUFZO0VBQzdCLFFBQVEsNEJBQTRCO0VBQ3BDLFVBQVUsd0JBQXdCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUM7RUFDdEQsU0FBUztFQUNULE9BQU8sQ0FBQztFQUNSLEtBQUs7RUFFTCxJQUFJLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDbEUsSUFBSSxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNyRCxJQUFJLE1BQU0sV0FBVyxHQUFHLEdBQUcsS0FBSyxTQUFTLEdBQUcsTUFBTSxHQUFHLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBRTlFLElBQUksSUFBSSxDQUFDLENBQUM7RUFDVixJQUFJLElBQUksYUFBYSxLQUFLLENBQUMsUUFBUSxFQUFFO0VBQ3JDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNaLEtBQUssTUFBTSxJQUFJLGFBQWEsR0FBRyxDQUFDLEVBQUU7RUFDbEMsTUFBTSxDQUFDLEdBQUcsTUFBTSxHQUFHLGFBQWEsR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLGFBQWEsR0FBRyxDQUFDLENBQUM7RUFDbEUsS0FBSyxNQUFNO0VBQ1gsTUFBTSxDQUFDLEdBQUcsTUFBTSxHQUFHLGFBQWEsR0FBRyxNQUFNLEdBQUcsYUFBYSxDQUFDO0VBQzFELEtBQUs7RUFFTCxJQUFJLElBQUksS0FBSyxDQUFDO0VBQ2QsSUFBSSxJQUFJLFdBQVcsS0FBSyxDQUFDLFFBQVEsRUFBRTtFQUNuQyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7RUFDaEIsS0FBSyxNQUFNLElBQUksV0FBVyxHQUFHLENBQUMsRUFBRTtFQUNoQyxNQUFNLEtBQUssR0FBRyxNQUFNLEdBQUcsV0FBVyxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsV0FBVyxHQUFHLENBQUMsQ0FBQztFQUNsRSxLQUFLLE1BQU07RUFDWCxNQUFNLEtBQUssR0FBRyxNQUFNLEdBQUcsV0FBVyxHQUFHLE1BQU0sR0FBRyxXQUFXLENBQUM7RUFDMUQsS0FBSztFQUVMLElBQUksTUFBTSxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDaEQsSUFBSSxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUN6QyxJQUFJLHVCQUF1QixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztFQUUxQyxJQUFJLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtFQUNyQixNQUFNLE9BQU8sS0FBSyxDQUFDO0VBQ25CLEtBQUs7RUFFTCxJQUFJLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDbEUsSUFBSSxJQUFJLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQ2xDLE1BQU0sTUFBTSxlQUFlLENBQUMseUNBQXlDLENBQUMsQ0FBQztFQUN2RSxLQUFLO0VBRUwsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDZCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEtBQUssRUFBRTtFQUN0QixNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN0RCxNQUFNLEVBQUUsQ0FBQyxDQUFDO0VBQ1YsTUFBTSxFQUFFLENBQUMsQ0FBQztFQUNWLEtBQUs7RUFFTCxJQUFJLFNBQTJCLEtBQUssRUFBRTtFQUN0QyxHQUFHO0VBR0gsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtFQUN2QixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUV2RCxJQUFJLE1BQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxDQUFDO0VBRTNFLElBQUksTUFBTSxNQUFNLEdBQUcsSUFBSSxpQkFBaUI7RUFDeEMsTUFBTSw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQztFQUNwRCxNQUFNLGdDQUFnQyxDQUFDLGdCQUFnQixDQUFDO0VBQ3hELE1BQU0sNEJBQTRCLENBQUMsZ0JBQWdCLENBQUM7RUFDcEQsS0FBSyxDQUFDO0VBQ04sSUFBSSxNQUFNLGNBQWMsR0FBRywyQkFBMkIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBRTNFLElBQUksTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFXO0VBQ2pDLE1BQU0sNEJBQTRCLENBQUMsY0FBYyxDQUFDO0VBQ2xELE1BQU0sZ0NBQWdDLENBQUMsY0FBYyxDQUFDO0VBQ3RELE1BQU0sNEJBQTRCLENBQUMsY0FBYyxDQUFDO0VBQ2xELEtBQUssQ0FBQztFQUNOLElBQUksdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7RUFFbkMsSUFBSSxTQUEyQixLQUFLLEVBQUU7RUFDdEMsR0FBRztFQUdILEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksRUFBRTtFQUM1QixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUV2RCxJQUFJLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFFbEUsSUFBSSxJQUFJLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM1QyxJQUFJLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtFQUMzQixNQUFNLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFDaEIsS0FBSztFQUVMLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO0VBQ2xCLE1BQU0sSUFBSSxJQUFJLE1BQU0sQ0FBQztFQUNyQixNQUFNLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtFQUNwQixRQUFRLElBQUksR0FBRyxDQUFDLENBQUM7RUFDakIsT0FBTztFQUNQLEtBQUs7RUFFTCxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDeEMsTUFBTTtFQUNOLFFBQVEsWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztFQUN6QyxRQUFRLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU87RUFDeEQsUUFBUTtFQUNSLFFBQVEsT0FBTyxDQUFDLENBQUM7RUFDakIsT0FBTztFQUNQLEtBQUs7RUFFTCxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFDZCxHQUFHO0VBR0gsRUFBRSxXQUFXLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQ2hDLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBRXZELElBQUksTUFBTSxNQUFNLEdBQUcsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUVsRSxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDNUUsSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtFQUM1QixNQUFNLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFDaEIsS0FBSztFQUVMLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFO0VBQ25CLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQ25ELEtBQUssTUFBTTtFQUNYLE1BQU0sSUFBSSxJQUFJLE1BQU0sQ0FBQztFQUNyQixLQUFLO0VBRUwsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3BDLE1BQU07RUFDTixRQUFRLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7RUFDekMsUUFBUSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPO0VBQ3hELFFBQVE7RUFDUixRQUFRLE9BQU8sQ0FBQyxDQUFDO0VBQ2pCLE9BQU87RUFDUCxLQUFLO0VBRUwsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQ2QsR0FBRztFQUdILEVBQUUsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksRUFBRTtFQUM3QixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUV2RCxJQUFJLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFFbEUsSUFBSSxJQUFJLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM1QyxJQUFJLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtFQUMzQixNQUFNLE9BQU8sS0FBSyxDQUFDO0VBQ25CLEtBQUs7RUFFTCxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtFQUNsQixNQUFNLElBQUksSUFBSSxNQUFNLENBQUM7RUFDckIsTUFBTSxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7RUFDcEIsUUFBUSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0VBQ2pCLE9BQU87RUFDUCxLQUFLO0VBRUwsSUFBSSxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDdkMsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3hDLE1BQU0sTUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFFekQsTUFBTSxJQUFJLEtBQUssSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDdkMsUUFBUSxPQUFPLElBQUksQ0FBQztFQUNwQixPQUFPO0VBRVAsTUFBTSxJQUFJLEtBQUssS0FBSyxPQUFPLEVBQUU7RUFDN0IsUUFBUSxPQUFPLElBQUksQ0FBQztFQUNwQixPQUFPO0VBQ1AsS0FBSztFQUVMLElBQUksT0FBTyxLQUFLLENBQUM7RUFDakIsR0FBRztFQUdILEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRTtFQUNsQixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLElBQUksTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUV2RCxJQUFJLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0VBRWhELElBQUksT0FBTyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7RUFDaEQsR0FBRztFQUdILEVBQUUsY0FBYyxDQUFDLEdBQUcsSUFBSSxFQUFFO0VBQzFCLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBRXZELElBQUksTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFFaEQsSUFBSSxPQUFPLDRCQUE0QixDQUFDLEtBQUssRUFBRSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQ3RFLEdBQUc7RUFHSCxFQUFFLEtBQUssaUJBQWlCLENBQUMsR0FBRztFQUM1QixJQUFJLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO0VBQzlCLE1BQU0sU0FBMkIsY0FBYyxFQUFFO0VBQ2pELEtBQUs7RUFDTCxHQUFHO0VBQ0gsQ0FBQztFQUdELG9CQUFvQixDQUFDLFlBQVksRUFBRSxtQkFBbUIsRUFBRTtFQUN4RCxFQUFFLEtBQUssRUFBRSxpQkFBaUI7RUFDMUIsQ0FBQyxDQUFDLENBQUM7RUFHSCxvQkFBb0IsQ0FBQyxZQUFZLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBRzlDLHFCQUFxQixDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztFQUVoRCxNQUFNLHFCQUFxQixHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUM7RUFHckQsb0JBQW9CLENBQUMscUJBQXFCLEVBQUUsbUJBQW1CLEVBQUU7RUFDakUsRUFBRSxLQUFLLEVBQUUsaUJBQWlCO0VBQzFCLENBQUMsQ0FBQyxDQUFDO0VBR0gsb0JBQW9CLENBQUMscUJBQXFCLEVBQUUsY0FBYyxFQUFFO0VBQzVELEVBQUUsS0FBSyxFQUFFLHFCQUFxQixDQUFDLE1BQU07RUFDckMsRUFBRSxRQUFRLEVBQUUsSUFBSTtFQUNoQixFQUFFLFlBQVksRUFBRSxJQUFJO0VBQ3BCLENBQUMsQ0FBQyxDQUFDO0VBRUgscUJBQXFCLENBQUMscUJBQXFCLEVBQUUsbUJBQW1CLENBQUM7O0VDbHFDMUQsU0FBUyxZQUFZLENBQUMsTUFBTSxFQUFFO0VBQ3JDLEVBQUUsT0FBTyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDOUQ7O0VDS08sU0FBUyxVQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksRUFBRTtFQUMxRCxFQUFFLE9BQU8sZUFBZTtFQUN4QixJQUFJLDBCQUEwQixDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDM0UsR0FBRyxDQUFDO0VBQ0osQ0FBQztFQVNNLFNBQVMsVUFBVSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxFQUFFO0VBQ2pFLEVBQUUsT0FBTywwQkFBMEI7RUFDbkMsSUFBSSxRQUFRO0VBQ1osSUFBSSxVQUFVO0VBQ2QsSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLENBQUM7RUFDN0IsSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUM7RUFDekIsR0FBRyxDQUFDO0VBQ0o7O0VDM0JPLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtFQUM1QixFQUFFLE9BQU8sY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzNCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
