/*! @petamoriken/float16 v3.8.2-7-g3b6ab31 | MIT License - https://github.com/petamoriken/float16 */

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
    floor: MathFloor,
    log2: MathLog2,
    pow: MathPow,
    sign: MathSign,
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

  const mantissaBitLength = 10;
  const mantissaMask = 0x3ff;
  const exponentMax = 31;
  const exponentBias = 15;
  function roundToEven(num) {
    const truncated = MathTrunc(num);
    const delta = MathAbs(num - truncated);
    if (delta > 0.5 || delta === 0.5 && truncated % 2 !== 0) {
      return truncated + MathSign(num);
    }
    return truncated;
  }
  function roundToFloat16Bits(num) {
    const absolute = MathAbs( (num));
    const s =  (num) < 0 || ObjectIs(num, -0) ? 1 : 0;
    let m, e;
    if (!NumberIsFinite(absolute)) {
      m = NumberIsNaN(absolute) ? 0x200 : 0;
      e = exponentMax;
    } else {
      let rawE = MathFloor(MathLog2(absolute));
      let c = MathPow(2, -rawE);
      if (absolute * c < 1) {
        --rawE;
        c *= 2;
      } else if (absolute * c >= 2) {
        ++rawE;
        c /= 2;
      }
      if (rawE + exponentBias >= exponentMax) {
        m = 0;
        e = exponentMax;
      } else if (rawE + exponentBias >= 1) {
        m = roundToEven(((absolute * c) - 1) * 0x400);
        e = rawE + exponentBias;
      } else {
        m = roundToEven(absolute * 0x1000000);
        e = 0;
      }
    }
    return s << 15 | e << mantissaBitLength | m;
  }
  const buffer = new NativeArrayBuffer(4);
  const floatView = new NativeFloat32Array(buffer);
  const uint32View = new NativeUint32Array(buffer);
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
    const i = float16bits >> mantissaBitLength;
    uint32View[0] = mantissaTable[offsetTable[i] + (float16bits & mantissaMask)] + exponentTable[i];
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
      } else if (isObject(input) && !isArrayBuffer(input)) {
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
    const number = +x;
    if (!NumberIsFinite(number) || number === 0) {
      return number;
    }
    const x16 = roundToFloat16Bits(number);
    return convertToNumber(x16);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXQxNi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL191dGlsL21lc3NhZ2VzLm1qcyIsIi4uL3NyYy9fdXRpbC9wcmltb3JkaWFscy5tanMiLCIuLi9zcmMvX3V0aWwvYXJyYXlJdGVyYXRvci5tanMiLCIuLi9zcmMvX3V0aWwvaXMubWpzIiwiLi4vc3JjL191dGlsL2JyYW5kLm1qcyIsIi4uL3NyYy9fdXRpbC9jb252ZXJ0ZXIubWpzIiwiLi4vc3JjL191dGlsL3NwZWMubWpzIiwiLi4vc3JjL0Zsb2F0MTZBcnJheS5tanMiLCIuLi9zcmMvaXNUeXBlZEFycmF5Lm1qcyIsIi4uL3NyYy9EYXRhVmlldy5tanMiLCIuLi9zcmMvZjE2cm91bmQubWpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBUSElTX0lTX05PVF9BTl9PQkpFQ1QgPSBcIlRoaXMgaXMgbm90IGFuIG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IFRISVNfSVNfTk9UX0FfRkxPQVQxNkFSUkFZX09CSkVDVCA9IFwiVGhpcyBpcyBub3QgYSBGbG9hdDE2QXJyYXkgb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVkgPVxuICBcIlRoaXMgY29uc3RydWN0b3IgaXMgbm90IGEgc3ViY2xhc3Mgb2YgRmxvYXQxNkFycmF5XCI7XG5leHBvcnQgY29uc3QgVEhFX0NPTlNUUlVDVE9SX1BST1BFUlRZX1ZBTFVFX0lTX05PVF9BTl9PQkpFQ1QgPVxuICBcIlRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eSB2YWx1ZSBpcyBub3QgYW4gb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgU1BFQ0lFU19DT05TVFJVQ1RPUl9ESUROVF9SRVRVUk5fVFlQRURBUlJBWV9PQkpFQ1QgPVxuICBcIlNwZWNpZXMgY29uc3RydWN0b3IgZGlkbid0IHJldHVybiBUeXBlZEFycmF5IG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IERFUklWRURfQ09OU1RSVUNUT1JfQ1JFQVRFRF9UWVBFREFSUkFZX09CSkVDVF9XSElDSF9XQVNfVE9PX1NNQUxMX0xFTkdUSCA9XG4gIFwiRGVyaXZlZCBjb25zdHJ1Y3RvciBjcmVhdGVkIFR5cGVkQXJyYXkgb2JqZWN0IHdoaWNoIHdhcyB0b28gc21hbGwgbGVuZ3RoXCI7XG5leHBvcnQgY29uc3QgQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIgPVxuICBcIkF0dGVtcHRpbmcgdG8gYWNjZXNzIGRldGFjaGVkIEFycmF5QnVmZmVyXCI7XG5leHBvcnQgY29uc3QgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUID1cbiAgXCJDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3RcIjtcbmV4cG9ydCBjb25zdCBDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVMgPVxuICBcIkNhbm5vdCBtaXggQmlnSW50IGFuZCBvdGhlciB0eXBlcywgdXNlIGV4cGxpY2l0IGNvbnZlcnNpb25zXCI7XG5leHBvcnQgY29uc3QgSVRFUkFUT1JfUFJPUEVSVFlfSVNfTk9UX0NBTExBQkxFID0gXCJAQGl0ZXJhdG9yIHByb3BlcnR5IGlzIG5vdCBjYWxsYWJsZVwiO1xuZXhwb3J0IGNvbnN0IFJFRFVDRV9PRl9FTVBUWV9BUlJBWV9XSVRIX05PX0lOSVRJQUxfVkFMVUUgPVxuICBcIlJlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWVcIjtcbmV4cG9ydCBjb25zdCBUSEVfQ09NUEFSSVNPTl9GVU5DVElPTl9NVVNUX0JFX0VJVEhFUl9BX0ZVTkNUSU9OX09SX1VOREVGSU5FRCA9XG4gIFwiVGhlIGNvbXBhcmlzb24gZnVuY3Rpb24gbXVzdCBiZSBlaXRoZXIgYSBmdW5jdGlvbiBvciB1bmRlZmluZWRcIjtcbmV4cG9ydCBjb25zdCBPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyA9IFwiT2Zmc2V0IGlzIG91dCBvZiBib3VuZHNcIjtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscywgbm8tcmVzdHJpY3RlZC1zeW50YXggKi9cbi8qIGdsb2JhbCBTaGFyZWRBcnJheUJ1ZmZlciAqL1xuXG5pbXBvcnQgeyBDQU5OT1RfQ09OVkVSVF9VTkRFRklORURfT1JfTlVMTF9UT19PQkpFQ1QgfSBmcm9tIFwiLi9tZXNzYWdlcy5tanNcIjtcblxuLyoqIEB0eXBlIHs8VCBleHRlbmRzICguLi5hcmdzOiBhbnkpID0+IGFueT4odGFyZ2V0OiBUKSA9PiAodGhpc0FyZzogVGhpc1R5cGU8VD4sIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnl9ICovXG5mdW5jdGlvbiB1bmN1cnJ5VGhpcyh0YXJnZXQpIHtcbiAgcmV0dXJuICh0aGlzQXJnLCAuLi5hcmdzKSA9PiB7XG4gICAgcmV0dXJuIFJlZmxlY3RBcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ3MpO1xuICB9O1xufVxuXG4vKiogQHR5cGUgeyh0YXJnZXQ6IGFueSwga2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+ICh0aGlzQXJnOiBhbnksIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnl9ICovXG5mdW5jdGlvbiB1bmN1cnJ5VGhpc0dldHRlcih0YXJnZXQsIGtleSkge1xuICByZXR1cm4gdW5jdXJyeVRoaXMoXG4gICAgUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICAgIHRhcmdldCxcbiAgICAgIGtleVxuICAgICkuZ2V0XG4gICk7XG59XG5cbi8vIFJlZmxlY3RcbmV4cG9ydCBjb25zdCB7XG4gIGFwcGx5OiBSZWZsZWN0QXBwbHksXG4gIGNvbnN0cnVjdDogUmVmbGVjdENvbnN0cnVjdCxcbiAgZGVmaW5lUHJvcGVydHk6IFJlZmxlY3REZWZpbmVQcm9wZXJ0eSxcbiAgZ2V0OiBSZWZsZWN0R2V0LFxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIGdldFByb3RvdHlwZU9mOiBSZWZsZWN0R2V0UHJvdG90eXBlT2YsXG4gIGhhczogUmVmbGVjdEhhcyxcbiAgb3duS2V5czogUmVmbGVjdE93bktleXMsXG4gIHNldDogUmVmbGVjdFNldCxcbiAgc2V0UHJvdG90eXBlT2Y6IFJlZmxlY3RTZXRQcm90b3R5cGVPZixcbn0gPSBSZWZsZWN0O1xuXG4vLyBQcm94eVxuZXhwb3J0IGNvbnN0IE5hdGl2ZVByb3h5ID0gUHJveHk7XG5cbi8vIE51bWJlclxuZXhwb3J0IGNvbnN0IHtcbiAgTUFYX1NBRkVfSU5URUdFUixcbiAgaXNGaW5pdGU6IE51bWJlcklzRmluaXRlLFxuICBpc05hTjogTnVtYmVySXNOYU4sXG59ID0gTnVtYmVyO1xuXG4vLyBTeW1ib2xcbmV4cG9ydCBjb25zdCB7XG4gIGl0ZXJhdG9yOiBTeW1ib2xJdGVyYXRvcixcbiAgc3BlY2llczogU3ltYm9sU3BlY2llcyxcbiAgdG9TdHJpbmdUYWc6IFN5bWJvbFRvU3RyaW5nVGFnLFxuICBmb3I6IFN5bWJvbEZvcixcbn0gPSBTeW1ib2w7XG5cbi8vIE9iamVjdFxuZXhwb3J0IGNvbnN0IE5hdGl2ZU9iamVjdCA9IE9iamVjdDtcbmV4cG9ydCBjb25zdCB7XG4gIGNyZWF0ZTogT2JqZWN0Q3JlYXRlLFxuICBkZWZpbmVQcm9wZXJ0eTogT2JqZWN0RGVmaW5lUHJvcGVydHksXG4gIGZyZWV6ZTogT2JqZWN0RnJlZXplLFxuICBpczogT2JqZWN0SXMsXG59ID0gTmF0aXZlT2JqZWN0O1xuY29uc3QgT2JqZWN0UHJvdG90eXBlID0gTmF0aXZlT2JqZWN0LnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KG9iamVjdDogb2JqZWN0LCBrZXk6IFByb3BlcnR5S2V5KSA9PiBGdW5jdGlvbiB8IHVuZGVmaW5lZH0gKi9cbmV4cG9ydCBjb25zdCBPYmplY3RQcm90b3R5cGVfX2xvb2t1cEdldHRlcl9fID0gLyoqIEB0eXBlIHthbnl9ICovIChPYmplY3RQcm90b3R5cGUpLl9fbG9va3VwR2V0dGVyX19cbiAgPyB1bmN1cnJ5VGhpcygvKiogQHR5cGUge2FueX0gKi8gKE9iamVjdFByb3RvdHlwZSkuX19sb29rdXBHZXR0ZXJfXylcbiAgOiAob2JqZWN0LCBrZXkpID0+IHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUXG4gICAgICApO1xuICAgIH1cblxuICAgIGxldCB0YXJnZXQgPSBOYXRpdmVPYmplY3Qob2JqZWN0KTtcbiAgICBkbyB7XG4gICAgICBjb25zdCBkZXNjcmlwdG9yID0gUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gICAgICBpZiAoZGVzY3JpcHRvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChPYmplY3RIYXNPd24oZGVzY3JpcHRvciwgXCJnZXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSB3aGlsZSAoKHRhcmdldCA9IFJlZmxlY3RHZXRQcm90b3R5cGVPZih0YXJnZXQpKSAhPT0gbnVsbCk7XG4gIH07XG4vKiogQHR5cGUgeyhvYmplY3Q6IG9iamVjdCwga2V5OiBQcm9wZXJ0eUtleSkgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBPYmplY3RIYXNPd24gPSAvKiogQHR5cGUge2FueX0gKi8gKE5hdGl2ZU9iamVjdCkuaGFzT3duIHx8XG4gIHVuY3VycnlUaGlzKE9iamVjdFByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG5cbi8vIEFycmF5XG5jb25zdCBOYXRpdmVBcnJheSA9IEFycmF5O1xuZXhwb3J0IGNvbnN0IEFycmF5SXNBcnJheSA9IE5hdGl2ZUFycmF5LmlzQXJyYXk7XG5jb25zdCBBcnJheVByb3RvdHlwZSA9IE5hdGl2ZUFycmF5LnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KGFycmF5OiBBcnJheUxpa2U8dW5rbm93bj4sIHNlcGFyYXRvcj86IHN0cmluZykgPT4gc3RyaW5nfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5UHJvdG90eXBlSm9pbiA9IHVuY3VycnlUaGlzKEFycmF5UHJvdG90eXBlLmpvaW4pO1xuLyoqIEB0eXBlIHs8VD4oYXJyYXk6IFRbXSwgLi4uaXRlbXM6IFRbXSkgPT4gbnVtYmVyfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5UHJvdG90eXBlUHVzaCA9IHVuY3VycnlUaGlzKEFycmF5UHJvdG90eXBlLnB1c2gpO1xuLyoqIEB0eXBlIHsoYXJyYXk6IEFycmF5TGlrZTx1bmtub3duPiwgLi4ub3B0czogYW55W10pID0+IHN0cmluZ30gKi9cbmV4cG9ydCBjb25zdCBBcnJheVByb3RvdHlwZVRvTG9jYWxlU3RyaW5nID0gdW5jdXJyeVRoaXMoXG4gIEFycmF5UHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nXG4pO1xuZXhwb3J0IGNvbnN0IE5hdGl2ZUFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IgPSBBcnJheVByb3RvdHlwZVtTeW1ib2xJdGVyYXRvcl07XG4vKiogQHR5cGUgezxUPihhcnJheTogVFtdKSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFQ+fSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IgPSB1bmN1cnJ5VGhpcyhOYXRpdmVBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yKTtcblxuLy8gTWF0aFxuZXhwb3J0IGNvbnN0IHtcbiAgYWJzOiBNYXRoQWJzLFxuICBmbG9vcjogTWF0aEZsb29yLFxuICBsb2cyOiBNYXRoTG9nMixcbiAgcG93OiBNYXRoUG93LFxuICBzaWduOiBNYXRoU2lnbixcbiAgdHJ1bmM6IE1hdGhUcnVuYyxcbn0gPSBNYXRoO1xuXG4vLyBBcnJheUJ1ZmZlclxuZXhwb3J0IGNvbnN0IE5hdGl2ZUFycmF5QnVmZmVyID0gQXJyYXlCdWZmZXI7XG5leHBvcnQgY29uc3QgQXJyYXlCdWZmZXJJc1ZpZXcgPSBOYXRpdmVBcnJheUJ1ZmZlci5pc1ZpZXc7XG5jb25zdCBBcnJheUJ1ZmZlclByb3RvdHlwZSA9IE5hdGl2ZUFycmF5QnVmZmVyLnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KGJ1ZmZlcjogQXJyYXlCdWZmZXIsIGJlZ2luPzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IG51bWJlcn0gKi9cbmV4cG9ydCBjb25zdCBBcnJheUJ1ZmZlclByb3RvdHlwZVNsaWNlID0gdW5jdXJyeVRoaXMoQXJyYXlCdWZmZXJQcm90b3R5cGUuc2xpY2UpO1xuLyoqIEB0eXBlIHsoYnVmZmVyOiBBcnJheUJ1ZmZlcikgPT4gQXJyYXlCdWZmZXJ9ICovXG5leHBvcnQgY29uc3QgQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoID0gdW5jdXJyeVRoaXNHZXR0ZXIoQXJyYXlCdWZmZXJQcm90b3R5cGUsIFwiYnl0ZUxlbmd0aFwiKTtcblxuLy8gU2hhcmVkQXJyYXlCdWZmZXJcbmV4cG9ydCBjb25zdCBOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlciA9IHR5cGVvZiBTaGFyZWRBcnJheUJ1ZmZlciAhPT0gXCJ1bmRlZmluZWRcIiA/IFNoYXJlZEFycmF5QnVmZmVyIDogbnVsbDtcbi8qKiBAdHlwZSB7KGJ1ZmZlcjogU2hhcmVkQXJyYXlCdWZmZXIpID0+IFNoYXJlZEFycmF5QnVmZmVyfSAqL1xuZXhwb3J0IGNvbnN0IFNoYXJlZEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCA9IE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyXG4gICYmIHVuY3VycnlUaGlzR2V0dGVyKE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyLnByb3RvdHlwZSwgXCJieXRlTGVuZ3RoXCIpO1xuXG4vLyBUeXBlZEFycmF5XG4vKiogQHR5cGVkZWYge1VpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDMyQXJyYXl8RmxvYXQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fEJpZ0ludDY0QXJyYXl9IFR5cGVkQXJyYXkgKi9cbi8qKiBAdHlwZSB7YW55fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXkgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YoVWludDhBcnJheSk7XG5jb25zdCBUeXBlZEFycmF5RnJvbSA9IFR5cGVkQXJyYXkuZnJvbTtcbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlID0gVHlwZWRBcnJheS5wcm90b3R5cGU7XG5leHBvcnQgY29uc3QgTmF0aXZlVHlwZWRBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yID0gVHlwZWRBcnJheVByb3RvdHlwZVtTeW1ib2xJdGVyYXRvcl07XG4vKiogQHR5cGUgeyh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBJdGVyYWJsZUl0ZXJhdG9yPG51bWJlcj59ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUtleXMgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLmtleXMpO1xuLyoqIEB0eXBlIHsodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gSXRlcmFibGVJdGVyYXRvcjxudW1iZXI+fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVWYWx1ZXMgPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS52YWx1ZXNcbik7XG4vKiogQHR5cGUgeyh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFtudW1iZXIsIG51bWJlcl0+fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVFbnRyaWVzID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUuZW50cmllc1xuKTtcbi8qKiBAdHlwZSB7KHR5cGVkQXJyYXk6IFR5cGVkQXJyYXksIGFycmF5OiBBcnJheUxpa2U8bnVtYmVyPiwgb2Zmc2V0PzogbnVtYmVyKSA9PiB2b2lkfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVTZXQgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLnNldCk7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCkgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlUmV2ZXJzZSA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLnJldmVyc2Vcbik7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgdmFsdWU6IG51bWJlciwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlRmlsbCA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUuZmlsbCk7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgdGFyZ2V0OiBudW1iZXIsIHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlQ29weVdpdGhpbiA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLmNvcHlXaXRoaW5cbik7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgY29tcGFyZUZuPzogKGE6IG51bWJlciwgYjogbnVtYmVyKSA9PiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVNvcnQgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLnNvcnQpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5zbGljZSk7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlU3ViYXJyYXkgPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS5zdWJhcnJheVxuKTtcbi8qKiBAdHlwZSB7KCh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBBcnJheUJ1ZmZlcil9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlciA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBcImJ1ZmZlclwiXG4pO1xuLyoqIEB0eXBlIHsoKHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IG51bWJlcil9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQgPSB1bmN1cnJ5VGhpc0dldHRlcihcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgXCJieXRlT2Zmc2V0XCJcbik7XG4vKiogQHR5cGUgeygodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gbnVtYmVyKX0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoID0gdW5jdXJyeVRoaXNHZXR0ZXIoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUsXG4gIFwibGVuZ3RoXCJcbik7XG4vKiogQHR5cGUgeyh0YXJnZXQ6IHVua25vd24pID0+IHN0cmluZ30gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0U3ltYm9sVG9TdHJpbmdUYWcgPSB1bmN1cnJ5VGhpc0dldHRlcihcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgU3ltYm9sVG9TdHJpbmdUYWdcbik7XG5cbi8vIFVpbnQxNkFycmF5XG5leHBvcnQgY29uc3QgTmF0aXZlVWludDE2QXJyYXkgPSBVaW50MTZBcnJheTtcbi8qKiBAdHlwZSB7VWludDE2QXJyYXlDb25zdHJ1Y3RvcltcImZyb21cIl19ICovXG5leHBvcnQgY29uc3QgVWludDE2QXJyYXlGcm9tID0gKC4uLmFyZ3MpID0+IHtcbiAgcmV0dXJuIFJlZmxlY3RBcHBseShUeXBlZEFycmF5RnJvbSwgTmF0aXZlVWludDE2QXJyYXksIGFyZ3MpO1xufTtcblxuLy8gVWludDMyQXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVVaW50MzJBcnJheSA9IFVpbnQzMkFycmF5O1xuXG4vLyBGbG9hdDMyQXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVGbG9hdDMyQXJyYXkgPSBGbG9hdDMyQXJyYXk7XG5cbi8vIEFycmF5SXRlcmF0b3Jcbi8qKiBAdHlwZSB7YW55fSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5SXRlcmF0b3JQcm90b3R5cGUgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YoW11bU3ltYm9sSXRlcmF0b3JdKCkpO1xuLyoqIEB0eXBlIHs8VD4oYXJyYXlJdGVyYXRvcjogSXRlcmFibGVJdGVyYXRvcjxUPikgPT4gSXRlcmF0b3JSZXN1bHQ8VD59ICovXG5leHBvcnQgY29uc3QgQXJyYXlJdGVyYXRvclByb3RvdHlwZU5leHQgPSB1bmN1cnJ5VGhpcyhBcnJheUl0ZXJhdG9yUHJvdG90eXBlLm5leHQpO1xuXG4vLyBHZW5lcmF0b3Jcbi8qKiBAdHlwZSB7PFQgPSB1bmtub3duLCBUUmV0dXJuID0gYW55LCBUTmV4dCA9IHVua25vd24+KGdlbmVyYXRvcjogR2VuZXJhdG9yPFQsIFRSZXR1cm4sIFROZXh0PiwgdmFsdWU/OiBUTmV4dCkgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBHZW5lcmF0b3JQcm90b3R5cGVOZXh0ID0gdW5jdXJyeVRoaXMoKGZ1bmN0aW9uKiAoKSB7fSkoKS5uZXh0KTtcblxuLy8gSXRlcmF0b3JcbmV4cG9ydCBjb25zdCBJdGVyYXRvclByb3RvdHlwZSA9IFJlZmxlY3RHZXRQcm90b3R5cGVPZihBcnJheUl0ZXJhdG9yUHJvdG90eXBlKTtcblxuLy8gRGF0YVZpZXdcbmNvbnN0IERhdGFWaWV3UHJvdG90eXBlID0gRGF0YVZpZXcucHJvdG90eXBlO1xuLyoqIEB0eXBlIHsoZGF0YVZpZXc6IERhdGFWaWV3LCBieXRlT2Zmc2V0OiBudW1iZXIsIGxpdHRsZUVuZGlhbj86IGJvb2xlYW4pID0+IG51bWJlcn0gKi9cbmV4cG9ydCBjb25zdCBEYXRhVmlld1Byb3RvdHlwZUdldFVpbnQxNiA9IHVuY3VycnlUaGlzKFxuICBEYXRhVmlld1Byb3RvdHlwZS5nZXRVaW50MTZcbik7XG4vKiogQHR5cGUgeyhkYXRhVmlldzogRGF0YVZpZXcsIGJ5dGVPZmZzZXQ6IG51bWJlciwgdmFsdWU6IG51bWJlciwgbGl0dGxlRW5kaWFuPzogYm9vbGVhbikgPT4gdm9pZH0gKi9cbmV4cG9ydCBjb25zdCBEYXRhVmlld1Byb3RvdHlwZVNldFVpbnQxNiA9IHVuY3VycnlUaGlzKFxuICBEYXRhVmlld1Byb3RvdHlwZS5zZXRVaW50MTZcbik7XG5cbi8vIEVycm9yXG5leHBvcnQgY29uc3QgTmF0aXZlVHlwZUVycm9yID0gVHlwZUVycm9yO1xuZXhwb3J0IGNvbnN0IE5hdGl2ZVJhbmdlRXJyb3IgPSBSYW5nZUVycm9yO1xuXG4vLyBXZWFrU2V0XG4vKipcbiAqIERvIG5vdCBjb25zdHJ1Y3Qgd2l0aCBhcmd1bWVudHMgdG8gYXZvaWQgY2FsbGluZyB0aGUgXCJhZGRcIiBtZXRob2RcbiAqIEB0eXBlIHt7bmV3IDxUIGV4dGVuZHMge30+KCk6IFdlYWtTZXQ8VD59fVxuICovXG5leHBvcnQgY29uc3QgTmF0aXZlV2Vha1NldCA9IFdlYWtTZXQ7XG5jb25zdCBXZWFrU2V0UHJvdG90eXBlID0gTmF0aXZlV2Vha1NldC5wcm90b3R5cGU7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMge30+KHNldDogV2Vha1NldDxUPiwgdmFsdWU6IFQpID0+IFNldDxUPn0gKi9cbmV4cG9ydCBjb25zdCBXZWFrU2V0UHJvdG90eXBlQWRkID0gdW5jdXJyeVRoaXMoV2Vha1NldFByb3RvdHlwZS5hZGQpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIHt9PihzZXQ6IFdlYWtTZXQ8VD4sIHZhbHVlOiBUKSA9PiBib29sZWFufSAqL1xuZXhwb3J0IGNvbnN0IFdlYWtTZXRQcm90b3R5cGVIYXMgPSB1bmN1cnJ5VGhpcyhXZWFrU2V0UHJvdG90eXBlLmhhcyk7XG5cbi8vIFdlYWtNYXBcbi8qKlxuICogRG8gbm90IGNvbnN0cnVjdCB3aXRoIGFyZ3VtZW50cyB0byBhdm9pZCBjYWxsaW5nIHRoZSBcInNldFwiIG1ldGhvZFxuICogQHR5cGUge3tuZXcgPEsgZXh0ZW5kcyB7fSwgVj4oKTogV2Vha01hcDxLLCBWPn19XG4gKi9cbmV4cG9ydCBjb25zdCBOYXRpdmVXZWFrTWFwID0gV2Vha01hcDtcbmNvbnN0IFdlYWtNYXBQcm90b3R5cGUgPSBOYXRpdmVXZWFrTWFwLnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7PEsgZXh0ZW5kcyB7fSwgVj4od2Vha01hcDogV2Vha01hcDxLLCBWPiwga2V5OiBLKSA9PiBWfSAqL1xuZXhwb3J0IGNvbnN0IFdlYWtNYXBQcm90b3R5cGVHZXQgPSB1bmN1cnJ5VGhpcyhXZWFrTWFwUHJvdG90eXBlLmdldCk7XG4vKiogQHR5cGUgezxLIGV4dGVuZHMge30sIFY+KHdlYWtNYXA6IFdlYWtNYXA8SywgVj4sIGtleTogSykgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBXZWFrTWFwUHJvdG90eXBlSGFzID0gdW5jdXJyeVRoaXMoV2Vha01hcFByb3RvdHlwZS5oYXMpO1xuLyoqIEB0eXBlIHs8SyBleHRlbmRzIHt9LCBWPih3ZWFrTWFwOiBXZWFrTWFwPEssIFY+LCBrZXk6IEssIHZhbHVlOiBWKSA9PiBXZWFrTWFwfSAqL1xuZXhwb3J0IGNvbnN0IFdlYWtNYXBQcm90b3R5cGVTZXQgPSB1bmN1cnJ5VGhpcyhXZWFrTWFwUHJvdG90eXBlLnNldCk7XG4iLCJpbXBvcnQge1xuICBBcnJheUl0ZXJhdG9yUHJvdG90eXBlLFxuICBBcnJheUl0ZXJhdG9yUHJvdG90eXBlTmV4dCxcbiAgQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvcixcbiAgR2VuZXJhdG9yUHJvdG90eXBlTmV4dCxcbiAgSXRlcmF0b3JQcm90b3R5cGUsXG4gIE5hdGl2ZUFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IsXG4gIE5hdGl2ZVdlYWtNYXAsXG4gIE9iamVjdENyZWF0ZSxcbiAgT2JqZWN0RGVmaW5lUHJvcGVydHksXG4gIFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIFJlZmxlY3RPd25LZXlzLFxuICBTeW1ib2xJdGVyYXRvcixcbiAgV2Vha01hcFByb3RvdHlwZUdldCxcbiAgV2Vha01hcFByb3RvdHlwZVNldCxcbn0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbi8qKiBAdHlwZSB7V2Vha01hcDx7fSwgSXRlcmFibGVJdGVyYXRvcjxhbnk+Pn0gKi9cbmNvbnN0IGFycmF5SXRlcmF0b3JzID0gbmV3IE5hdGl2ZVdlYWtNYXAoKTtcblxuY29uc3QgU2FmZUl0ZXJhdG9yUHJvdG90eXBlID0gT2JqZWN0Q3JlYXRlKG51bGwsIHtcbiAgbmV4dDoge1xuICAgIHZhbHVlOiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgY29uc3QgYXJyYXlJdGVyYXRvciA9IFdlYWtNYXBQcm90b3R5cGVHZXQoYXJyYXlJdGVyYXRvcnMsIHRoaXMpO1xuICAgICAgcmV0dXJuIEFycmF5SXRlcmF0b3JQcm90b3R5cGVOZXh0KGFycmF5SXRlcmF0b3IpO1xuICAgIH0sXG4gIH0sXG5cbiAgW1N5bWJvbEl0ZXJhdG9yXToge1xuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICB9LFxufSk7XG5cbi8qKlxuICogV3JhcCB0aGUgQXJyYXkgYXJvdW5kIHRoZSBTYWZlSXRlcmF0b3IgSWYgQXJyYXkucHJvdG90eXBlIFtAQGl0ZXJhdG9yXSBoYXMgYmVlbiBtb2RpZmllZFxuICogQHR5cGUgezxUPihhcnJheTogVFtdKSA9PiBJdGVyYWJsZTxUPn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhZmVJZk5lZWRlZChhcnJheSkge1xuICBpZiAoXG4gICAgYXJyYXlbU3ltYm9sSXRlcmF0b3JdID09PSBOYXRpdmVBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yICYmXG4gICAgQXJyYXlJdGVyYXRvclByb3RvdHlwZS5uZXh0ID09PSBBcnJheUl0ZXJhdG9yUHJvdG90eXBlTmV4dFxuICApIHtcbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICBjb25zdCBzYWZlID0gT2JqZWN0Q3JlYXRlKFNhZmVJdGVyYXRvclByb3RvdHlwZSk7XG4gIFdlYWtNYXBQcm90b3R5cGVTZXQoYXJyYXlJdGVyYXRvcnMsIHNhZmUsIEFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IoYXJyYXkpKTtcbiAgcmV0dXJuIHNhZmU7XG59XG5cbi8qKiBAdHlwZSB7V2Vha01hcDx7fSwgR2VuZXJhdG9yPGFueT4+fSAqL1xuY29uc3QgZ2VuZXJhdG9ycyA9IG5ldyBOYXRpdmVXZWFrTWFwKCk7XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJWFycmF5aXRlcmF0b3Jwcm90b3R5cGUlLW9iamVjdCAqL1xuY29uc3QgRHVtbXlBcnJheUl0ZXJhdG9yUHJvdG90eXBlID0gT2JqZWN0Q3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7XG4gIG5leHQ6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIGNvbnN0IGdlbmVyYXRvciA9IFdlYWtNYXBQcm90b3R5cGVHZXQoZ2VuZXJhdG9ycywgdGhpcyk7XG4gICAgICByZXR1cm4gR2VuZXJhdG9yUHJvdG90eXBlTmV4dChnZW5lcmF0b3IpO1xuICAgIH0sXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICB9LFxufSk7XG5cbmZvciAoY29uc3Qga2V5IG9mIFJlZmxlY3RPd25LZXlzKEFycmF5SXRlcmF0b3JQcm90b3R5cGUpKSB7XG4gIC8vIG5leHQgbWV0aG9kIGhhcyBhbHJlYWR5IGRlZmluZWRcbiAgaWYgKGtleSA9PT0gXCJuZXh0XCIpIHtcbiAgICBjb250aW51ZTtcbiAgfVxuXG4gIC8vIENvcHkgQXJyYXlJdGVyYXRvclByb3RvdHlwZSBkZXNjcmlwdG9ycyB0byBEdW1teUFycmF5SXRlcmF0b3JQcm90b3R5cGVcbiAgT2JqZWN0RGVmaW5lUHJvcGVydHkoRHVtbXlBcnJheUl0ZXJhdG9yUHJvdG90eXBlLCBrZXksIFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoQXJyYXlJdGVyYXRvclByb3RvdHlwZSwga2V5KSk7XG59XG5cbi8qKlxuICogV3JhcCB0aGUgR2VuZXJhdG9yIGFyb3VuZCB0aGUgZHVtbXkgQXJyYXlJdGVyYXRvclxuICogQHR5cGUgezxUPihnZW5lcmF0b3I6IEdlbmVyYXRvcjxUPikgPT4gSXRlcmFibGVJdGVyYXRvcjxUPn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXAoZ2VuZXJhdG9yKSB7XG4gIGNvbnN0IGR1bW15ID0gT2JqZWN0Q3JlYXRlKER1bW15QXJyYXlJdGVyYXRvclByb3RvdHlwZSk7XG4gIFdlYWtNYXBQcm90b3R5cGVTZXQoZ2VuZXJhdG9ycywgZHVtbXksIGdlbmVyYXRvcik7XG4gIHJldHVybiBkdW1teTtcbn1cbiIsImltcG9ydCB7XG4gIEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCxcbiAgQXJyYXlJc0FycmF5LFxuICBBcnJheUl0ZXJhdG9yUHJvdG90eXBlLFxuICBBcnJheUl0ZXJhdG9yUHJvdG90eXBlTmV4dCxcbiAgTWF0aFRydW5jLFxuICBOYXRpdmVBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yLFxuICBOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlcixcbiAgTmF0aXZlVHlwZWRBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yLFxuICBOdW1iZXJJc0Zpbml0ZSxcbiAgU2hhcmVkQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoLFxuICBTeW1ib2xJdGVyYXRvcixcbiAgVHlwZWRBcnJheVByb3RvdHlwZUdldFN5bWJvbFRvU3RyaW5nVGFnLFxufSBmcm9tIFwiLi9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMge319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gKFxuICAgICh2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHx8XG4gICAgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMge319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIjtcbn1cblxuLy8gSW5zcGlyZWQgYnkgdXRpbC50eXBlcyBpbXBsZW1lbnRhdGlvbiBvZiBOb2RlLmpzXG4vKiogQHR5cGVkZWYge1VpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDMyQXJyYXl8RmxvYXQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fEJpZ0ludDY0QXJyYXl9IFR5cGVkQXJyYXkgKi9cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVHlwZWRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTmF0aXZlVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gVHlwZWRBcnJheVByb3RvdHlwZUdldFN5bWJvbFRvU3RyaW5nVGFnKHZhbHVlKSAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBCaWdJbnQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOYXRpdmVCaWdJbnRUeXBlZEFycmF5KHZhbHVlKSB7XG4gIGNvbnN0IHR5cGVkQXJyYXlOYW1lID0gVHlwZWRBcnJheVByb3RvdHlwZUdldFN5bWJvbFRvU3RyaW5nVGFnKHZhbHVlKTtcbiAgcmV0dXJuIChcbiAgICB0eXBlZEFycmF5TmFtZSA9PT0gXCJCaWdJbnQ2NEFycmF5XCIgfHxcbiAgICB0eXBlZEFycmF5TmFtZSA9PT0gXCJCaWdVaW50NjRBcnJheVwiXG4gICk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIEFycmF5QnVmZmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWx1ZSkge1xuICB0cnkge1xuICAgIEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCgvKiogQHR5cGUge2FueX0gKi8gKHZhbHVlKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgU2hhcmVkQXJyYXlCdWZmZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NoYXJlZEFycmF5QnVmZmVyKHZhbHVlKSB7XG4gIGlmIChOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlciA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgU2hhcmVkQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoKC8qKiBAdHlwZSB7YW55fSAqLyAodmFsdWUpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyB1bmtub3duW119XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09yZGluYXJ5QXJyYXkodmFsdWUpIHtcbiAgaWYgKCFBcnJheUlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gVmVyaWZ5IHRoYXQgdGhlcmUgYXJlIG5vIGNoYW5nZXMgaW4gQXJyYXlJdGVyYXRvclxuICByZXR1cm4gKFxuICAgIHZhbHVlW1N5bWJvbEl0ZXJhdG9yXSA9PT0gTmF0aXZlQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvciAmJlxuICAgIEFycmF5SXRlcmF0b3JQcm90b3R5cGUubmV4dCA9PT0gQXJyYXlJdGVyYXRvclByb3RvdHlwZU5leHRcbiAgKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVHlwZWRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3JkaW5hcnlOYXRpdmVUeXBlZEFycmF5KHZhbHVlKSB7XG4gIGlmICghaXNOYXRpdmVUeXBlZEFycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFZlcmlmeSB0aGF0IHRoZXJlIGFyZSBubyBjaGFuZ2VzIGluIEFycmF5SXRlcmF0b3JcbiAgcmV0dXJuIChcbiAgICB2YWx1ZVtTeW1ib2xJdGVyYXRvcl0gPT09IE5hdGl2ZVR5cGVkQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvciAmJlxuICAgIEFycmF5SXRlcmF0b3JQcm90b3R5cGUubmV4dCA9PT0gQXJyYXlJdGVyYXRvclByb3RvdHlwZU5leHRcbiAgKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgc3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IG51bWJlciA9ICt2YWx1ZTtcbiAgaWYgKHZhbHVlICE9PSBudW1iZXIgKyBcIlwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFOdW1iZXJJc0Zpbml0ZShudW1iZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIG51bWJlciA9PT0gTWF0aFRydW5jKG51bWJlcik7XG59XG4iLCJpbXBvcnQgeyBpc09iamVjdCwgaXNPYmplY3RMaWtlIH0gZnJvbSBcIi4vaXMubWpzXCI7XG5pbXBvcnQgeyBUSEVfQ09OU1RSVUNUT1JfUFJPUEVSVFlfVkFMVUVfSVNfTk9UX0FOX09CSkVDVCB9IGZyb20gXCIuL21lc3NhZ2VzLm1qc1wiO1xuaW1wb3J0IHsgTmF0aXZlVHlwZUVycm9yLCBSZWZsZWN0R2V0UHJvdG90eXBlT2YsIFJlZmxlY3RIYXMsIFN5bWJvbEZvciB9IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG5leHBvcnQgY29uc3QgYnJhbmQgPSBTeW1ib2xGb3IoXCJfX0Zsb2F0MTZBcnJheV9fXCIpO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc0Zsb2F0MTZBcnJheUJyYW5kKHRhcmdldCkge1xuICBpZiAoIWlzT2JqZWN0TGlrZSh0YXJnZXQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcHJvdG90eXBlID0gUmVmbGVjdEdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gIGlmICghaXNPYmplY3RMaWtlKHByb3RvdHlwZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBjb25zdHJ1Y3RvciA9IHByb3RvdHlwZS5jb25zdHJ1Y3RvcjtcbiAgaWYgKGNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCFpc09iamVjdChjb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhFX0NPTlNUUlVDVE9SX1BST1BFUlRZX1ZBTFVFX0lTX05PVF9BTl9PQkpFQ1QpO1xuICB9XG5cbiAgcmV0dXJuIFJlZmxlY3RIYXMoY29uc3RydWN0b3IsIGJyYW5kKTtcbn1cbiIsImltcG9ydCB7XG4gIE1hdGhBYnMsXG4gIE1hdGhGbG9vcixcbiAgTWF0aExvZzIsXG4gIE1hdGhQb3csXG4gIE1hdGhTaWduLFxuICBNYXRoVHJ1bmMsXG4gIE5hdGl2ZUFycmF5QnVmZmVyLFxuICBOYXRpdmVGbG9hdDMyQXJyYXksXG4gIE5hdGl2ZVVpbnQxNkFycmF5LFxuICBOYXRpdmVVaW50MzJBcnJheSxcbiAgTnVtYmVySXNGaW5pdGUsXG4gIE51bWJlcklzTmFOLFxuICBPYmplY3RJcyxcbn0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbmNvbnN0IG1hbnRpc3NhQml0TGVuZ3RoID0gMTA7XG5jb25zdCBtYW50aXNzYU1hc2sgPSAweDNmZjtcbmNvbnN0IGV4cG9uZW50TWF4ID0gMzE7XG5jb25zdCBleHBvbmVudEJpYXMgPSAxNTtcblxuLy8gYmFzZSBhbGdvcml0aG06IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvaWVlZTc1NFxuLy8gQlNELTMtQ2xhdXNlIExpY2Vuc2UuIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZy9vcGVuc291cmNlPlxuXG4vKipcbiAqIHJvdW5kIGEgbnVtYmVyIHRvIG5lYXJlc3QgaW50ZWdlciB2YWx1ZTtcbiAqIGlmIHRoZSBudW1iZXIgaXMgaGFsZndheSwgaXQgaXMgcm91bmRlZCB0byB0aGUgbmVhcmVzdCBldmVuIG51bWJlclxuICogQHBhcmFtIHtudW1iZXJ9IG51bSAtIGRvdWJsZSBmbG9hdFxuICogQHJldHVybnMge251bWJlcn0gaGFsZiBmbG9hdCBudW1iZXIgYml0c1xuICovXG5mdW5jdGlvbiByb3VuZFRvRXZlbihudW0pIHtcbiAgY29uc3QgdHJ1bmNhdGVkID0gTWF0aFRydW5jKG51bSk7XG4gIGNvbnN0IGRlbHRhID0gTWF0aEFicyhudW0gLSB0cnVuY2F0ZWQpO1xuICBpZiAoZGVsdGEgPiAwLjUgfHwgZGVsdGEgPT09IDAuNSAmJiB0cnVuY2F0ZWQgJSAyICE9PSAwKSB7XG4gICAgcmV0dXJuIHRydW5jYXRlZCArIE1hdGhTaWduKG51bSk7XG4gIH1cbiAgcmV0dXJuIHRydW5jYXRlZDtcbn1cblxuLyoqXG4gKiByb3VuZCBhIG51bWJlciB0byBhIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqIEBwYXJhbSB7dW5rbm93bn0gbnVtIC0gZG91YmxlIGZsb2F0XG4gKiBAcmV0dXJucyB7bnVtYmVyfSBoYWxmIGZsb2F0IG51bWJlciBiaXRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByb3VuZFRvRmxvYXQxNkJpdHMobnVtKSB7XG4gIGNvbnN0IGFic29sdXRlID0gTWF0aEFicygvKiogQHR5cGUge251bWJlcn0gKi8gKG51bSkpO1xuXG4gIGNvbnN0IHMgPSAvKiogQHR5cGUge251bWJlcn0gKi8gKG51bSkgPCAwIHx8IE9iamVjdElzKG51bSwgLTApID8gMSA6IDA7XG4gIGxldCBtLCBlO1xuXG4gIC8vIE5hTiwgSW5maW5pdHksIC1JbmZpbml0eVxuICBpZiAoIU51bWJlcklzRmluaXRlKGFic29sdXRlKSkge1xuICAgIC8vIHF1aWV0IE5hTlxuICAgIG0gPSBOdW1iZXJJc05hTihhYnNvbHV0ZSkgPyAweDIwMCA6IDA7XG4gICAgZSA9IGV4cG9uZW50TWF4O1xuXG4gIC8vIGZpbml0ZVxuICB9IGVsc2Uge1xuICAgIGxldCByYXdFID0gTWF0aEZsb29yKE1hdGhMb2cyKGFic29sdXRlKSk7XG4gICAgbGV0IGMgPSBNYXRoUG93KDIsIC1yYXdFKTtcbiAgICBpZiAoYWJzb2x1dGUgKiBjIDwgMSkge1xuICAgICAgLS1yYXdFO1xuICAgICAgYyAqPSAyO1xuICAgIH0gZWxzZSBpZiAoYWJzb2x1dGUgKiBjID49IDIpIHtcbiAgICAgICsrcmF3RTtcbiAgICAgIGMgLz0gMjtcbiAgICB9XG5cbiAgICAvLyBJbmZpbml0eSwgLUluZmluaXR5XG4gICAgaWYgKHJhd0UgKyBleHBvbmVudEJpYXMgPj0gZXhwb25lbnRNYXgpIHtcbiAgICAgIG0gPSAwO1xuICAgICAgZSA9IGV4cG9uZW50TWF4O1xuXG4gICAgLy8gbm9ybWFsIG51bWJlclxuICAgIH0gZWxzZSBpZiAocmF3RSArIGV4cG9uZW50QmlhcyA+PSAxKSB7XG4gICAgICBtID0gcm91bmRUb0V2ZW4oKChhYnNvbHV0ZSAqIGMpIC0gMSkgKiAweDQwMCk7XG4gICAgICBlID0gcmF3RSArIGV4cG9uZW50QmlhcztcblxuICAgIC8vIHN1Ym5vcm1hbCBudW1iZXIsIDAsIC0wXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSByb3VuZFRvRXZlbihhYnNvbHV0ZSAqIDB4MTAwMDAwMCk7XG4gICAgICBlID0gMDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcyA8PCAxNSB8IGUgPDwgbWFudGlzc2FCaXRMZW5ndGggfCBtO1xufVxuXG4vLyBiYXNlIGFsZ29yaXRobTogaHR0cDovL2ZveC10b29sa2l0Lm9yZy9mdHAvZmFzdGhhbGZmbG9hdGNvbnZlcnNpb24ucGRmXG5cbmNvbnN0IGJ1ZmZlciA9IG5ldyBOYXRpdmVBcnJheUJ1ZmZlcig0KTtcbmNvbnN0IGZsb2F0VmlldyA9IG5ldyBOYXRpdmVGbG9hdDMyQXJyYXkoYnVmZmVyKTtcbmNvbnN0IHVpbnQzMlZpZXcgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoYnVmZmVyKTtcblxuY29uc3QgbWFudGlzc2FUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSgyMDQ4KTtcbmZvciAobGV0IGkgPSAxOyBpIDwgMTAyNDsgKytpKSB7XG4gIGxldCBtID0gaSA8PCAxMzsgLy8gemVybyBwYWQgbWFudGlzc2EgYml0c1xuICBsZXQgZSA9IDA7IC8vIHplcm8gZXhwb25lbnRcblxuICAvLyBub3JtYWxpemVkXG4gIHdoaWxlICgobSAmIDB4MDA4MDAwMDApID09PSAwKSB7XG4gICAgbSA8PD0gMTtcbiAgICBlIC09IDB4MDA4MDAwMDA7IC8vIGRlY3JlbWVudCBleHBvbmVudFxuICB9XG5cbiAgbSAmPSB+MHgwMDgwMDAwMDsgLy8gY2xlYXIgbGVhZGluZyAxIGJpdFxuICBlICs9IDB4Mzg4MDAwMDA7IC8vIGFkanVzdCBiaWFzXG5cbiAgbWFudGlzc2FUYWJsZVtpXSA9IG0gfCBlO1xufVxuZm9yIChsZXQgaSA9IDEwMjQ7IGkgPCAyMDQ4OyArK2kpIHtcbiAgbWFudGlzc2FUYWJsZVtpXSA9IDB4MzgwMDAwMDAgKyAoKGkgLSAxMDI0KSA8PCAxMyk7XG59XG5cbmNvbnN0IGV4cG9uZW50VGFibGUgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoNjQpO1xuZm9yIChsZXQgaSA9IDE7IGkgPCAzMTsgKytpKSB7XG4gIGV4cG9uZW50VGFibGVbaV0gPSBpIDw8IDIzO1xufVxuZXhwb25lbnRUYWJsZVszMV0gPSAweDQ3ODAwMDAwO1xuZXhwb25lbnRUYWJsZVszMl0gPSAweDgwMDAwMDAwO1xuZm9yIChsZXQgaSA9IDMzOyBpIDwgNjM7ICsraSkge1xuICBleHBvbmVudFRhYmxlW2ldID0gMHg4MDAwMDAwMCArICgoaSAtIDMyKSA8PCAyMyk7XG59XG5leHBvbmVudFRhYmxlWzYzXSA9IDB4Yzc4MDAwMDA7XG5cbmNvbnN0IG9mZnNldFRhYmxlID0gbmV3IE5hdGl2ZVVpbnQxNkFycmF5KDY0KTtcbmZvciAobGV0IGkgPSAxOyBpIDwgNjQ7ICsraSkge1xuICBpZiAoaSAhPT0gMzIpIHtcbiAgICBvZmZzZXRUYWJsZVtpXSA9IDEwMjQ7XG4gIH1cbn1cblxuLyoqXG4gKiBjb252ZXJ0IGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cyB0byBhIG51bWJlclxuICogQHBhcmFtIHtudW1iZXJ9IGZsb2F0MTZiaXRzIC0gaGFsZiBmbG9hdCBudW1iZXIgYml0c1xuICogQHJldHVybnMge251bWJlcn0gZG91YmxlIGZsb2F0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHMpIHtcbiAgY29uc3QgaSA9IGZsb2F0MTZiaXRzID4+IG1hbnRpc3NhQml0TGVuZ3RoO1xuICB1aW50MzJWaWV3WzBdID0gbWFudGlzc2FUYWJsZVtvZmZzZXRUYWJsZVtpXSArIChmbG9hdDE2Yml0cyAmIG1hbnRpc3NhTWFzayldICsgZXhwb25lbnRUYWJsZVtpXTtcbiAgcmV0dXJuIGZsb2F0Vmlld1swXTtcbn1cbiIsImltcG9ydCB7IGlzT2JqZWN0LCBpc1NoYXJlZEFycmF5QnVmZmVyIH0gZnJvbSBcIi4vaXMubWpzXCI7XG5pbXBvcnQge1xuICBUSEVfQ09OU1RSVUNUT1JfUFJPUEVSVFlfVkFMVUVfSVNfTk9UX0FOX09CSkVDVCxcbiAgVEhJU19JU19OT1RfQU5fT0JKRUNULFxufSBmcm9tIFwiLi9tZXNzYWdlcy5tanNcIjtcbmltcG9ydCB7XG4gIEFycmF5QnVmZmVyUHJvdG90eXBlU2xpY2UsXG4gIE1BWF9TQUZFX0lOVEVHRVIsXG4gIE1hdGhUcnVuYyxcbiAgTmF0aXZlVHlwZUVycm9yLFxuICBOdW1iZXJJc05hTixcbiAgT2JqZWN0SXMsXG4gIFN5bWJvbFNwZWNpZXMsXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b2ludGVnZXJvcmluZmluaXR5XG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFRvSW50ZWdlck9ySW5maW5pdHkodGFyZ2V0KSB7XG4gIGNvbnN0IG51bWJlciA9ICt0YXJnZXQ7XG5cbiAgaWYgKE51bWJlcklzTmFOKG51bWJlcikgfHwgbnVtYmVyID09PSAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gTWF0aFRydW5jKG51bWJlcik7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvbGVuZ3RoXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFRvTGVuZ3RoKHRhcmdldCkge1xuICBjb25zdCBsZW5ndGggPSBUb0ludGVnZXJPckluZmluaXR5KHRhcmdldCk7XG4gIGlmIChsZW5ndGggPCAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gbGVuZ3RoIDwgTUFYX1NBRkVfSU5URUdFUlxuICAgID8gbGVuZ3RoXG4gICAgOiBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1zcGVjaWVzY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7eyBuZXcoLi4uYXJnczogYW55W10pOiBhbnk7IH19IGRlZmF1bHRDb25zdHJ1Y3RvclxuICogQHJldHVybnMge3sgbmV3KC4uLmFyZ3M6IGFueVtdKTogYW55OyB9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gU3BlY2llc0NvbnN0cnVjdG9yKHRhcmdldCwgZGVmYXVsdENvbnN0cnVjdG9yKSB7XG4gIGlmICghaXNPYmplY3QodGFyZ2V0KSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSElTX0lTX05PVF9BTl9PQkpFQ1QpO1xuICB9XG5cbiAgY29uc3QgY29uc3RydWN0b3IgPSB0YXJnZXQuY29uc3RydWN0b3I7XG4gIGlmIChjb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRDb25zdHJ1Y3RvcjtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KGNvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSEVfQ09OU1RSVUNUT1JfUFJPUEVSVFlfVkFMVUVfSVNfTk9UX0FOX09CSkVDVCk7XG4gIH1cblxuICBjb25zdCBzcGVjaWVzID0gY29uc3RydWN0b3JbU3ltYm9sU3BlY2llc107XG4gIGlmIChzcGVjaWVzID09IG51bGwpIHtcbiAgICByZXR1cm4gZGVmYXVsdENvbnN0cnVjdG9yO1xuICB9XG5cbiAgcmV0dXJuIHNwZWNpZXM7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWlzZGV0YWNoZWRidWZmZXJcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJMaWtlfSBidWZmZXJcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpIHtcbiAgaWYgKGlzU2hhcmVkQXJyYXlCdWZmZXIoYnVmZmVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgQXJyYXlCdWZmZXJQcm90b3R5cGVTbGljZShidWZmZXIsIDAsIDApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBjYXRjaCAoZSkgey8qIGVtcHR5ICovfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIGJpZ2ludCBjb21wYXJpc29ucyBhcmUgbm90IHN1cHBvcnRlZFxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc29ydFxuICogQHBhcmFtIHtudW1iZXJ9IHhcbiAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gKiBAcmV0dXJucyB7LTEgfCAwIHwgMX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRDb21wYXJlKHgsIHkpIHtcbiAgY29uc3QgaXNYTmFOID0gTnVtYmVySXNOYU4oeCk7XG4gIGNvbnN0IGlzWU5hTiA9IE51bWJlcklzTmFOKHkpO1xuXG4gIGlmIChpc1hOYU4gJiYgaXNZTmFOKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAoaXNYTmFOKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICBpZiAoaXNZTmFOKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgaWYgKHggPCB5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgaWYgKHggPiB5KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICBpZiAoeCA9PT0gMCAmJiB5ID09PSAwKSB7XG4gICAgY29uc3QgaXNYUGx1c1plcm8gPSBPYmplY3RJcyh4LCAwKTtcbiAgICBjb25zdCBpc1lQbHVzWmVybyA9IE9iamVjdElzKHksIDApO1xuXG4gICAgaWYgKCFpc1hQbHVzWmVybyAmJiBpc1lQbHVzWmVybykge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChpc1hQbHVzWmVybyAmJiAhaXNZUGx1c1plcm8pIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAwO1xufVxuIiwiaW1wb3J0IHsgc2FmZUlmTmVlZGVkLCB3cmFwIH0gZnJvbSBcIi4vX3V0aWwvYXJyYXlJdGVyYXRvci5tanNcIjtcbmltcG9ydCB7IGJyYW5kLCBoYXNGbG9hdDE2QXJyYXlCcmFuZCB9IGZyb20gXCIuL191dGlsL2JyYW5kLm1qc1wiO1xuaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9fdXRpbC9jb252ZXJ0ZXIubWpzXCI7XG5pbXBvcnQge1xuICBpc0FycmF5QnVmZmVyLFxuICBpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyxcbiAgaXNOYXRpdmVCaWdJbnRUeXBlZEFycmF5LFxuICBpc05hdGl2ZVR5cGVkQXJyYXksXG4gIGlzT2JqZWN0LFxuICBpc09yZGluYXJ5QXJyYXksXG4gIGlzT3JkaW5hcnlOYXRpdmVUeXBlZEFycmF5LFxufSBmcm9tIFwiLi9fdXRpbC9pcy5tanNcIjtcbmltcG9ydCB7XG4gIEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSLFxuICBDQU5OT1RfQ09OVkVSVF9VTkRFRklORURfT1JfTlVMTF9UT19PQkpFQ1QsXG4gIENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFUyxcbiAgREVSSVZFRF9DT05TVFJVQ1RPUl9DUkVBVEVEX1RZUEVEQVJSQVlfT0JKRUNUX1dISUNIX1dBU19UT09fU01BTExfTEVOR1RILFxuICBJVEVSQVRPUl9QUk9QRVJUWV9JU19OT1RfQ0FMTEFCTEUsXG4gIE9GRlNFVF9JU19PVVRfT0ZfQk9VTkRTLFxuICBSRURVQ0VfT0ZfRU1QVFlfQVJSQVlfV0lUSF9OT19JTklUSUFMX1ZBTFVFLFxuICBTUEVDSUVTX0NPTlNUUlVDVE9SX0RJRE5UX1JFVFVSTl9UWVBFREFSUkFZX09CSkVDVCxcbiAgVEhFX0NPTVBBUklTT05fRlVOQ1RJT05fTVVTVF9CRV9FSVRIRVJfQV9GVU5DVElPTl9PUl9VTkRFRklORUQsXG4gIFRISVNfQ09OU1RSVUNUT1JfSVNfTk9UX0FfU1VCQ0xBU1NfT0ZfRkxPQVQxNkFSUkFZLFxuICBUSElTX0lTX05PVF9BX0ZMT0FUMTZBUlJBWV9PQkpFQ1QsXG59IGZyb20gXCIuL191dGlsL21lc3NhZ2VzLm1qc1wiO1xuaW1wb3J0IHtcbiAgQXJyYXlCdWZmZXJJc1ZpZXcsXG4gIEFycmF5UHJvdG90eXBlSm9pbixcbiAgQXJyYXlQcm90b3R5cGVQdXNoLFxuICBBcnJheVByb3RvdHlwZVRvTG9jYWxlU3RyaW5nLFxuICBOYXRpdmVBcnJheUJ1ZmZlcixcbiAgTmF0aXZlT2JqZWN0LFxuICBOYXRpdmVQcm94eSxcbiAgTmF0aXZlUmFuZ2VFcnJvcixcbiAgTmF0aXZlVHlwZUVycm9yLFxuICBOYXRpdmVVaW50MTZBcnJheSxcbiAgTmF0aXZlV2Vha01hcCxcbiAgTmF0aXZlV2Vha1NldCxcbiAgTnVtYmVySXNOYU4sXG4gIE9iamVjdERlZmluZVByb3BlcnR5LFxuICBPYmplY3RGcmVlemUsXG4gIE9iamVjdEhhc093bixcbiAgT2JqZWN0UHJvdG90eXBlX19sb29rdXBHZXR0ZXJfXyxcbiAgUmVmbGVjdEFwcGx5LFxuICBSZWZsZWN0Q29uc3RydWN0LFxuICBSZWZsZWN0RGVmaW5lUHJvcGVydHksXG4gIFJlZmxlY3RHZXQsXG4gIFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIFJlZmxlY3RIYXMsXG4gIFJlZmxlY3RPd25LZXlzLFxuICBSZWZsZWN0U2V0LFxuICBSZWZsZWN0U2V0UHJvdG90eXBlT2YsXG4gIFN5bWJvbEl0ZXJhdG9yLFxuICBTeW1ib2xUb1N0cmluZ1RhZyxcbiAgVHlwZWRBcnJheSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUNvcHlXaXRoaW4sXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVFbnRyaWVzLFxuICBUeXBlZEFycmF5UHJvdG90eXBlRmlsbCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcixcbiAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVLZXlzLFxuICBUeXBlZEFycmF5UHJvdG90eXBlUmV2ZXJzZSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVNldCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlLFxuICBUeXBlZEFycmF5UHJvdG90eXBlU29ydCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVN1YmFycmF5LFxuICBUeXBlZEFycmF5UHJvdG90eXBlVmFsdWVzLFxuICBVaW50MTZBcnJheUZyb20sXG4gIFdlYWtNYXBQcm90b3R5cGVHZXQsXG4gIFdlYWtNYXBQcm90b3R5cGVIYXMsXG4gIFdlYWtNYXBQcm90b3R5cGVTZXQsXG4gIFdlYWtTZXRQcm90b3R5cGVBZGQsXG4gIFdlYWtTZXRQcm90b3R5cGVIYXMsXG59IGZyb20gXCIuL191dGlsL3ByaW1vcmRpYWxzLm1qc1wiO1xuaW1wb3J0IHtcbiAgSXNEZXRhY2hlZEJ1ZmZlcixcbiAgU3BlY2llc0NvbnN0cnVjdG9yLFxuICBUb0ludGVnZXJPckluZmluaXR5LFxuICBUb0xlbmd0aCxcbiAgZGVmYXVsdENvbXBhcmUsXG59IGZyb20gXCIuL191dGlsL3NwZWMubWpzXCI7XG5cbmNvbnN0IEJZVEVTX1BFUl9FTEVNRU5UID0gMjtcblxuLyoqIEB0eXBlZGVmIHtVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfX0gRmxvYXQxNkJpdHNBcnJheSAqL1xuXG4vKiogQHR5cGUge1dlYWtNYXA8RmxvYXQxNkFycmF5LCBGbG9hdDE2Qml0c0FycmF5Pn0gKi9cbmNvbnN0IGZsb2F0MTZiaXRzQXJyYXlzID0gbmV3IE5hdGl2ZVdlYWtNYXAoKTtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge3RhcmdldCBpcyBGbG9hdDE2QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgcmV0dXJuIFdlYWtNYXBQcm90b3R5cGVIYXMoZmxvYXQxNmJpdHNBcnJheXMsIHRhcmdldCkgfHxcbiAgICAoIUFycmF5QnVmZmVySXNWaWV3KHRhcmdldCkgJiYgaGFzRmxvYXQxNkFycmF5QnJhbmQodGFyZ2V0KSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEByZXR1cm5zIHthc3NlcnRzIHRhcmdldCBpcyBGbG9hdDE2QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGFzc2VydEZsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgaWYgKCFpc0Zsb2F0MTZBcnJheSh0YXJnZXQpKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFRISVNfSVNfTk9UX0FfRkxPQVQxNkFSUkFZX09CSkVDVCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHBhcmFtIHtudW1iZXI9fSBjb3VudFxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge2Fzc2VydHMgdGFyZ2V0IGlzIFVpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDE2QXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheX1cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0U3BlY2llc1R5cGVkQXJyYXkodGFyZ2V0LCBjb3VudCkge1xuICBjb25zdCBpc1RhcmdldEZsb2F0MTZBcnJheSA9IGlzRmxvYXQxNkFycmF5KHRhcmdldCk7XG4gIGNvbnN0IGlzVGFyZ2V0VHlwZWRBcnJheSA9IGlzTmF0aXZlVHlwZWRBcnJheSh0YXJnZXQpO1xuXG4gIGlmICghaXNUYXJnZXRGbG9hdDE2QXJyYXkgJiYgIWlzVGFyZ2V0VHlwZWRBcnJheSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihTUEVDSUVTX0NPTlNUUlVDVE9SX0RJRE5UX1JFVFVSTl9UWVBFREFSUkFZX09CSkVDVCk7XG4gIH1cblxuICBpZiAodHlwZW9mIGNvdW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgbGV0IGxlbmd0aDtcbiAgICBpZiAoaXNUYXJnZXRGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRhcmdldCk7XG4gICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKHRhcmdldCk7XG4gICAgfVxuXG4gICAgaWYgKGxlbmd0aCA8IGNvdW50KSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIERFUklWRURfQ09OU1RSVUNUT1JfQ1JFQVRFRF9UWVBFREFSUkFZX09CSkVDVF9XSElDSF9XQVNfVE9PX1NNQUxMX0xFTkdUSFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoaXNOYXRpdmVCaWdJbnRUeXBlZEFycmF5KHRhcmdldCkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ0FOTk9UX01JWF9CSUdJTlRfQU5EX09USEVSX1RZUEVTKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7RmxvYXQxNkFycmF5fSBmbG9hdDE2XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcmV0dXJucyB7RmxvYXQxNkJpdHNBcnJheX1cbiAqL1xuZnVuY3Rpb24gZ2V0RmxvYXQxNkJpdHNBcnJheShmbG9hdDE2KSB7XG4gIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBXZWFrTWFwUHJvdG90eXBlR2V0KGZsb2F0MTZiaXRzQXJyYXlzLCBmbG9hdDE2KTtcbiAgaWYgKGZsb2F0MTZiaXRzQXJyYXkgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIpO1xuICAgIH1cblxuICAgIHJldHVybiBmbG9hdDE2Yml0c0FycmF5O1xuICB9XG5cbiAgLy8gZnJvbSBhbm90aGVyIEZsb2F0MTZBcnJheSBpbnN0YW5jZSAoYSBkaWZmZXJlbnQgdmVyc2lvbj8pXG4gIGNvbnN0IGJ1ZmZlciA9IC8qKiBAdHlwZSB7YW55fSAqLyAoZmxvYXQxNikuYnVmZmVyO1xuXG4gIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIpO1xuICB9XG5cbiAgY29uc3QgY2xvbmVkID0gUmVmbGVjdENvbnN0cnVjdChGbG9hdDE2QXJyYXksIFtcbiAgICBidWZmZXIsXG4gICAgLyoqIEB0eXBlIHthbnl9ICovIChmbG9hdDE2KS5ieXRlT2Zmc2V0LFxuICAgIC8qKiBAdHlwZSB7YW55fSAqLyAoZmxvYXQxNikubGVuZ3RoLFxuICBdLCBmbG9hdDE2LmNvbnN0cnVjdG9yKTtcbiAgcmV0dXJuIFdlYWtNYXBQcm90b3R5cGVHZXQoZmxvYXQxNmJpdHNBcnJheXMsIGNsb25lZCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtGbG9hdDE2Qml0c0FycmF5fSBmbG9hdDE2Yml0c0FycmF5XG4gKiBAcmV0dXJucyB7bnVtYmVyW119XG4gKi9cbmZ1bmN0aW9uIGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpIHtcbiAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICBjb25zdCBhcnJheSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgYXJyYXlbaV0gPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gIH1cblxuICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKiBAdHlwZSB7V2Vha1NldDxGdW5jdGlvbj59ICovXG5jb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0dGVycyA9IG5ldyBOYXRpdmVXZWFrU2V0KCk7XG5mb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0T3duS2V5cyhUeXBlZEFycmF5UHJvdG90eXBlKSkge1xuICAvLyBAQHRvU3RyaW5nVGFnIGdldHRlciBwcm9wZXJ0eSBpcyBkZWZpbmVkIGluIEZsb2F0MTZBcnJheS5wcm90b3R5cGVcbiAgaWYgKGtleSA9PT0gU3ltYm9sVG9TdHJpbmdUYWcpIHtcbiAgICBjb250aW51ZTtcbiAgfVxuXG4gIGNvbnN0IGRlc2NyaXB0b3IgPSBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFR5cGVkQXJyYXlQcm90b3R5cGUsIGtleSk7XG4gIGlmIChPYmplY3RIYXNPd24oZGVzY3JpcHRvciwgXCJnZXRcIikgJiYgdHlwZW9mIGRlc2NyaXB0b3IuZ2V0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBXZWFrU2V0UHJvdG90eXBlQWRkKFR5cGVkQXJyYXlQcm90b3R5cGVHZXR0ZXJzLCBkZXNjcmlwdG9yLmdldCk7XG4gIH1cbn1cblxuY29uc3QgaGFuZGxlciA9IE9iamVjdEZyZWV6ZSgvKiogQHR5cGUge1Byb3h5SGFuZGxlcjxGbG9hdDE2Qml0c0FycmF5Pn0gKi8gKHtcbiAgZ2V0KHRhcmdldCwga2V5LCByZWNlaXZlcikge1xuICAgIGlmIChpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyhrZXkpICYmIE9iamVjdEhhc093bih0YXJnZXQsIGtleSkpIHtcbiAgICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoUmVmbGVjdEdldCh0YXJnZXQsIGtleSkpO1xuICAgIH1cblxuICAgIC8vICVUeXBlZEFycmF5JS5wcm90b3R5cGUgZ2V0dGVyIHByb3BlcnRpZXMgY2Fubm90IGNhbGxlZCBieSBQcm94eSByZWNlaXZlclxuICAgIGlmIChXZWFrU2V0UHJvdG90eXBlSGFzKFR5cGVkQXJyYXlQcm90b3R5cGVHZXR0ZXJzLCBPYmplY3RQcm90b3R5cGVfX2xvb2t1cEdldHRlcl9fKHRhcmdldCwga2V5KSkpIHtcbiAgICAgIHJldHVybiBSZWZsZWN0R2V0KHRhcmdldCwga2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVmbGVjdEdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpO1xuICB9LFxuXG4gIHNldCh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgaWYgKGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKGtleSkgJiYgT2JqZWN0SGFzT3duKHRhcmdldCwga2V5KSkge1xuICAgICAgcmV0dXJuIFJlZmxlY3RTZXQodGFyZ2V0LCBrZXksIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0U2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpO1xuICB9LFxuXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkge1xuICAgIGlmIChpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyhrZXkpICYmIE9iamVjdEhhc093bih0YXJnZXQsIGtleSkpIHtcbiAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZGVzY3JpcHRvci52YWx1ZSk7XG4gICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gIH0sXG5cbiAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgICBpZiAoXG4gICAgICBpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyhrZXkpICYmXG4gICAgICBPYmplY3RIYXNPd24odGFyZ2V0LCBrZXkpICYmXG4gICAgICBPYmplY3RIYXNPd24oZGVzY3JpcHRvciwgXCJ2YWx1ZVwiKVxuICAgICkge1xuICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhkZXNjcmlwdG9yLnZhbHVlKTtcbiAgICAgIHJldHVybiBSZWZsZWN0RGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0RGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpO1xuICB9LFxufSkpO1xuXG5leHBvcnQgY2xhc3MgRmxvYXQxNkFycmF5IHtcbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10eXBlZGFycmF5ICovXG4gIGNvbnN0cnVjdG9yKGlucHV0LCBfYnl0ZU9mZnNldCwgX2xlbmd0aCkge1xuICAgIC8qKiBAdHlwZSB7RmxvYXQxNkJpdHNBcnJheX0gKi9cbiAgICBsZXQgZmxvYXQxNmJpdHNBcnJheTtcblxuICAgIGlmIChpc0Zsb2F0MTZBcnJheShpbnB1dCkpIHtcbiAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBbZ2V0RmxvYXQxNkJpdHNBcnJheShpbnB1dCldLCBuZXcudGFyZ2V0KTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGlucHV0KSAmJiAhaXNBcnJheUJ1ZmZlcihpbnB1dCkpIHsgLy8gb2JqZWN0IHdpdGhvdXQgQXJyYXlCdWZmZXJcbiAgICAgIC8qKiBAdHlwZSB7QXJyYXlMaWtlPHVua25vd24+fSAqL1xuICAgICAgbGV0IGxpc3Q7XG4gICAgICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgICAgIGxldCBsZW5ndGg7XG5cbiAgICAgIGlmIChpc05hdGl2ZVR5cGVkQXJyYXkoaW5wdXQpKSB7IC8vIFR5cGVkQXJyYXlcbiAgICAgICAgbGlzdCA9IGlucHV0O1xuICAgICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGlucHV0KTtcblxuICAgICAgICBjb25zdCBidWZmZXIgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGlucHV0KTtcblxuICAgICAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc05hdGl2ZUJpZ0ludFR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFUyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhID0gbmV3IE5hdGl2ZUFycmF5QnVmZmVyKFxuICAgICAgICAgIGxlbmd0aCAqIEJZVEVTX1BFUl9FTEVNRU5UXG4gICAgICAgICk7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBbZGF0YV0sIG5ldy50YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaXRlcmF0b3IgPSBpbnB1dFtTeW1ib2xJdGVyYXRvcl07XG4gICAgICAgIGlmIChpdGVyYXRvciAhPSBudWxsICYmIHR5cGVvZiBpdGVyYXRvciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKElURVJBVE9SX1BST1BFUlRZX0lTX05PVF9DQUxMQUJMRSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlcmF0b3IgIT0gbnVsbCkgeyAvLyBJdGVyYWJsZSAoQXJyYXkpXG4gICAgICAgICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgICAgICAgIGlmIChpc09yZGluYXJ5QXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBsaXN0ID0gaW5wdXQ7XG4gICAgICAgICAgICBsZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgICAgICAgbGlzdCA9IFsuLi4gLyoqIEB0eXBlIHtJdGVyYWJsZTx1bmtub3duPn0gKi8gKGlucHV0KV07XG4gICAgICAgICAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIEFycmF5TGlrZVxuICAgICAgICAgIGxpc3QgPSAvKiogQHR5cGUge0FycmF5TGlrZTx1bmtub3duPn0gKi8gKGlucHV0KTtcbiAgICAgICAgICBsZW5ndGggPSBUb0xlbmd0aChsaXN0Lmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgZmxvYXQxNmJpdHNBcnJheSA9IFJlZmxlY3RDb25zdHJ1Y3QoTmF0aXZlVWludDE2QXJyYXksIFtsZW5ndGhdLCBuZXcudGFyZ2V0KTtcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHZhbHVlc1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBmbG9hdDE2Yml0c0FycmF5W2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGxpc3RbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIHByaW1pdGl2ZSwgQXJyYXlCdWZmZXJcbiAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBhcmd1bWVudHMsIG5ldy50YXJnZXQpO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7RmxvYXQxNkFycmF5fSAqL1xuICAgIGNvbnN0IHByb3h5ID0gLyoqIEB0eXBlIHthbnl9ICovIChuZXcgTmF0aXZlUHJveHkoZmxvYXQxNmJpdHNBcnJheSwgaGFuZGxlcikpO1xuXG4gICAgLy8gcHJveHkgcHJpdmF0ZSBzdG9yYWdlXG4gICAgV2Vha01hcFByb3RvdHlwZVNldChmbG9hdDE2Yml0c0FycmF5cywgcHJveHksIGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgcmV0dXJuIHByb3h5O1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGbG9hdDE2QXJyYXkpYCBvciBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgIGluY2x1ZGUgdGhpcyBrZXlcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5mcm9tXG4gICAqL1xuICBzdGF0aWMgZnJvbShzcmMsIC4uLm9wdHMpIHtcbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICBpZiAoIVJlZmxlY3RIYXMoQ29uc3RydWN0b3IsIGJyYW5kKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGlmIChpc0Zsb2F0MTZBcnJheShzcmMpICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHNyYyk7XG4gICAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBOYXRpdmVVaW50MTZBcnJheShcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSlcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihUeXBlZEFycmF5UHJvdG90eXBlU2xpY2UodWludDE2KSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgICAgICBVaW50MTZBcnJheUZyb20oc3JjLCByb3VuZFRvRmxvYXQxNkJpdHMpXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXBGdW5jID0gb3B0c1swXTtcbiAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzFdO1xuXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgICBVaW50MTZBcnJheUZyb20oc3JjLCBmdW5jdGlvbiAodmFsLCAuLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gcm91bmRUb0Zsb2F0MTZCaXRzKFxuICAgICAgICAgICAgICBSZWZsZWN0QXBwbHkobWFwRnVuYywgdGhpcywgW3ZhbCwgLi4uc2FmZUlmTmVlZGVkKGFyZ3MpXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSwgdGhpc0FyZylcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvKiogQHR5cGUge0FycmF5TGlrZTx1bmtub3duPn0gKi9cbiAgICBsZXQgbGlzdDtcbiAgICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgICBsZXQgbGVuZ3RoO1xuXG4gICAgY29uc3QgaXRlcmF0b3IgPSBzcmNbU3ltYm9sSXRlcmF0b3JdO1xuICAgIGlmIChpdGVyYXRvciAhPSBudWxsICYmIHR5cGVvZiBpdGVyYXRvciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoSVRFUkFUT1JfUFJPUEVSVFlfSVNfTk9UX0NBTExBQkxFKTtcbiAgICB9XG5cbiAgICBpZiAoaXRlcmF0b3IgIT0gbnVsbCkgeyAvLyBJdGVyYWJsZSAoVHlwZWRBcnJheSwgQXJyYXkpXG4gICAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgICBpZiAoaXNPcmRpbmFyeUFycmF5KHNyYykpIHtcbiAgICAgICAgbGlzdCA9IHNyYztcbiAgICAgICAgbGVuZ3RoID0gc3JjLmxlbmd0aDtcbiAgICAgIH0gZWxzZSBpZiAoaXNPcmRpbmFyeU5hdGl2ZVR5cGVkQXJyYXkoc3JjKSkge1xuICAgICAgICBsaXN0ID0gc3JjO1xuICAgICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKHNyYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgICAgICAgbGlzdCA9IFsuLi5zcmNdO1xuICAgICAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyBBcnJheUxpa2VcbiAgICAgIGlmIChzcmMgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgICAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBsaXN0ID0gTmF0aXZlT2JqZWN0KHNyYyk7XG4gICAgICBsZW5ndGggPSBUb0xlbmd0aChsaXN0Lmxlbmd0aCk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBhcnJheVtpXSA9IC8qKiBAdHlwZSB7bnVtYmVyfSAqLyAobGlzdFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1hcEZ1bmMgPSBvcHRzWzBdO1xuICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMV07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gUmVmbGVjdEFwcGx5KG1hcEZ1bmMsIHRoaXNBcmcsIFtsaXN0W2ldLCBpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGbG9hdDE2QXJyYXkpYCBvciBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgIGluY2x1ZGUgdGhpcyBrZXlcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5vZlxuICAgKi9cbiAgc3RhdGljIG9mKC4uLml0ZW1zKSB7XG4gICAgY29uc3QgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgaWYgKCFSZWZsZWN0SGFzKENvbnN0cnVjdG9yLCBicmFuZCkpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgbGVuZ3RoID0gaXRlbXMubGVuZ3RoO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBwcm94eSA9IG5ldyBGbG9hdDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHByb3h5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBmbG9hdDE2Yml0c0FycmF5W2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGl0ZW1zW2ldKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH1cblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBhcnJheVtpXSA9IGl0ZW1zW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5rZXlzICovXG4gIGtleXMoKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgcmV0dXJuIFR5cGVkQXJyYXlQcm90b3R5cGVLZXlzKGZsb2F0MTZiaXRzQXJyYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IHJldHVybnMgYSBvYmplY3Qgd2hvc2UgcHJvdG90eXBlIGlzIG5vdCBgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlYFxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS52YWx1ZXNcbiAgICovXG4gIHZhbHVlcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gd3JhcCgoZnVuY3Rpb24qICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgZm9yIChjb25zdCB2YWwgb2YgVHlwZWRBcnJheVByb3RvdHlwZVZhbHVlcyhmbG9hdDE2Yml0c0FycmF5KSkge1xuICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiByZXR1cm5zIGEgb2JqZWN0IHdob3NlIHByb3RvdHlwZSBpcyBub3QgYCVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJWBcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZW50cmllc1xuICAgKi9cbiAgZW50cmllcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gd3JhcCgoZnVuY3Rpb24qICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgZm9yIChjb25zdCBbaSwgdmFsXSBvZiBUeXBlZEFycmF5UHJvdG90eXBlRW50cmllcyhmbG9hdDE2Yml0c0FycmF5KSkge1xuICAgICAgICB5aWVsZCAvKiogQHR5cGUge1tudW1iZXIsIG51bWJlcl19ICovIChbaSwgY29udmVydFRvTnVtYmVyKHZhbCldKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5hdCAqL1xuICBhdChpbmRleCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgcmVsYXRpdmVJbmRleCA9IFRvSW50ZWdlck9ySW5maW5pdHkoaW5kZXgpO1xuICAgIGNvbnN0IGsgPSByZWxhdGl2ZUluZGV4ID49IDAgPyByZWxhdGl2ZUluZGV4IDogbGVuZ3RoICsgcmVsYXRpdmVJbmRleDtcblxuICAgIGlmIChrIDwgMCB8fCBrID49IGxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtrXSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtY2hhbmdlLWFycmF5LWJ5LWNvcHkvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLndpdGggKi9cbiAgd2l0aChpbmRleCwgdmFsdWUpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHJlbGF0aXZlSW5kZXggPSBUb0ludGVnZXJPckluZmluaXR5KGluZGV4KTtcbiAgICBjb25zdCBrID0gcmVsYXRpdmVJbmRleCA+PSAwID8gcmVsYXRpdmVJbmRleCA6IGxlbmd0aCArIHJlbGF0aXZlSW5kZXg7XG5cbiAgICBjb25zdCBudW1iZXIgPSArdmFsdWU7XG5cbiAgICBpZiAoayA8IDAgfHwgayA+PSBsZW5ndGgpIHtcbiAgICAgIHRocm93IE5hdGl2ZVJhbmdlRXJyb3IoT0ZGU0VUX0lTX09VVF9PRl9CT1VORFMpO1xuICAgIH1cblxuICAgIC8vIGRvbid0IHVzZSBTcGVjaWVzQ29uc3RydWN0b3JcbiAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgKTtcbiAgICBjb25zdCBjbG9uZWQgPSBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlKHVpbnQxNilcbiAgICAgIClcbiAgICApO1xuICAgIGNvbnN0IGFycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShjbG9uZWQpO1xuXG4gICAgYXJyYXlba10gPSByb3VuZFRvRmxvYXQxNkJpdHMobnVtYmVyKTtcblxuICAgIHJldHVybiBjbG9uZWQ7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUubWFwICovXG4gIG1hcChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBwcm94eSA9IG5ldyBGbG9hdDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgIGNvbnN0IGFycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShwcm94eSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgICBhcnJheVtpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhcbiAgICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSwgbGVuZ3RoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGFycmF5W2ldID0gUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdmFsLCBpLCB0aGlzXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbHRlciAqL1xuICBmaWx0ZXIoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgY29uc3Qga2VwdCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKSkge1xuICAgICAgICBBcnJheVByb3RvdHlwZVB1c2goa2VwdCwgdmFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGtlcHQpO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5KTtcblxuICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKGFycmF5KTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5yZWR1Y2UgKi9cbiAgcmVkdWNlKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbMF0pO1xuICAgICAgc3RhcnQgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soXG4gICAgICAgIGFjY3VtdWxhdG9yLFxuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJlZHVjZXJpZ2h0ICovXG4gIHJlZHVjZVJpZ2h0KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbbGVuZ3RoIC0gMV0pO1xuICAgICAgc3RhcnQgPSBsZW5ndGggLSAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IGxlbmd0aCAtIDE7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpID49IDA7IC0taSkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjYWxsYmFjayhcbiAgICAgICAgYWNjdW11bGF0b3IsXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgaSxcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZm9yZWFjaCAqL1xuICBmb3JFYWNoKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW1xuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXMsXG4gICAgICBdKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZCAqL1xuICBmaW5kKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kaW5kZXggKi9cbiAgZmluZEluZGV4KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLWFycmF5LWZpbmQtZnJvbS1sYXN0L2luZGV4Lmh0bWwjc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZGxhc3QgKi9cbiAgZmluZExhc3QoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtYXJyYXktZmluZC1mcm9tLWxhc3QvaW5kZXguaHRtbCNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kbGFzdGluZGV4ICovXG4gIGZpbmRMYXN0SW5kZXgoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5ldmVyeSAqL1xuICBldmVyeShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoXG4gICAgICAgICFSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICBdKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb21lICovXG4gIHNvbWUoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKFxuICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICBdKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zZXQgKi9cbiAgc2V0KGlucHV0LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGFyZ2V0T2Zmc2V0ID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAodGFyZ2V0T2Zmc2V0IDwgMCkge1xuICAgICAgdGhyb3cgTmF0aXZlUmFuZ2VFcnJvcihPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyk7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0ID09IG51bGwpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpc05hdGl2ZUJpZ0ludFR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFU1xuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KGlucHV0KSkge1xuICAgICAgLy8gcGVlbCBvZmYgUHJveHlcbiAgICAgIHJldHVybiBUeXBlZEFycmF5UHJvdG90eXBlU2V0KFxuICAgICAgICBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpLFxuICAgICAgICBnZXRGbG9hdDE2Qml0c0FycmF5KGlucHV0KSxcbiAgICAgICAgdGFyZ2V0T2Zmc2V0XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpc05hdGl2ZVR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGlucHV0KTtcbiAgICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRMZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgY29uc3Qgc3JjID0gTmF0aXZlT2JqZWN0KGlucHV0KTtcbiAgICBjb25zdCBzcmNMZW5ndGggPSBUb0xlbmd0aChzcmMubGVuZ3RoKTtcblxuICAgIGlmICh0YXJnZXRPZmZzZXQgPT09IEluZmluaXR5IHx8IHNyY0xlbmd0aCArIHRhcmdldE9mZnNldCA+IHRhcmdldExlbmd0aCkge1xuICAgICAgdGhyb3cgTmF0aXZlUmFuZ2VFcnJvcihPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcmNMZW5ndGg7ICsraSkge1xuICAgICAgZmxvYXQxNmJpdHNBcnJheVtpICsgdGFyZ2V0T2Zmc2V0XSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhzcmNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5yZXZlcnNlICovXG4gIHJldmVyc2UoKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgVHlwZWRBcnJheVByb3RvdHlwZVJldmVyc2UoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9wcm9wb3NhbC1jaGFuZ2UtYXJyYXktYnktY29weS8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUudG9SZXZlcnNlZCAqL1xuICB0b1JldmVyc2VkKCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIC8vIGRvbid0IHVzZSBTcGVjaWVzQ29uc3RydWN0b3JcbiAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgKTtcbiAgICBjb25zdCBjbG9uZWQgPSBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlKHVpbnQxNilcbiAgICAgIClcbiAgICApO1xuXG4gICAgY29uc3QgY2xvbmVkRmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkoY2xvbmVkKTtcbiAgICBUeXBlZEFycmF5UHJvdG90eXBlUmV2ZXJzZShjbG9uZWRGbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIHJldHVybiBjbG9uZWQ7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmlsbCAqL1xuICBmaWxsKHZhbHVlLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgVHlwZWRBcnJheVByb3RvdHlwZUZpbGwoXG4gICAgICBmbG9hdDE2Yml0c0FycmF5LFxuICAgICAgcm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSxcbiAgICAgIC4uLnNhZmVJZk5lZWRlZChvcHRzKVxuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5jb3B5d2l0aGluICovXG4gIGNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVDb3B5V2l0aGluKGZsb2F0MTZiaXRzQXJyYXksIHRhcmdldCwgc3RhcnQsIC4uLnNhZmVJZk5lZWRlZChvcHRzKSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb3J0ICovXG4gIHNvcnQoY29tcGFyZUZuKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3Qgc29ydENvbXBhcmUgPSBjb21wYXJlRm4gIT09IHVuZGVmaW5lZCA/IGNvbXBhcmVGbiA6IGRlZmF1bHRDb21wYXJlO1xuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVTb3J0KGZsb2F0MTZiaXRzQXJyYXksICh4LCB5KSA9PiB7XG4gICAgICByZXR1cm4gc29ydENvbXBhcmUoY29udmVydFRvTnVtYmVyKHgpLCBjb252ZXJ0VG9OdW1iZXIoeSkpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtY2hhbmdlLWFycmF5LWJ5LWNvcHkvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnRvU29ydGVkICovXG4gIHRvU29ydGVkKGNvbXBhcmVGbikge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGlmIChjb21wYXJlRm4gIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgY29tcGFyZUZuICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBOYXRpdmVUeXBlRXJyb3IoVEhFX0NPTVBBUklTT05fRlVOQ1RJT05fTVVTVF9CRV9FSVRIRVJfQV9GVU5DVElPTl9PUl9VTkRFRklORUQpO1xuICAgIH1cbiAgICBjb25zdCBzb3J0Q29tcGFyZSA9IGNvbXBhcmVGbiAhPT0gdW5kZWZpbmVkID8gY29tcGFyZUZuIDogZGVmYXVsdENvbXBhcmU7XG5cbiAgICAvLyBkb24ndCB1c2UgU3BlY2llc0NvbnN0cnVjdG9yXG4gICAgY29uc3QgdWludDE2ID0gbmV3IE5hdGl2ZVVpbnQxNkFycmF5KFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KVxuICAgICk7XG4gICAgY29uc3QgY2xvbmVkID0gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSh1aW50MTYpXG4gICAgICApXG4gICAgKTtcblxuICAgIGNvbnN0IGNsb25lZEZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KGNsb25lZCk7XG4gICAgVHlwZWRBcnJheVByb3RvdHlwZVNvcnQoY2xvbmVkRmxvYXQxNmJpdHNBcnJheSwgKHgsIHkpID0+IHtcbiAgICAgIHJldHVybiBzb3J0Q29tcGFyZShjb252ZXJ0VG9OdW1iZXIoeCksIGNvbnZlcnRUb051bWJlcih5KSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY2xvbmVkO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNsaWNlICovXG4gIHNsaWNlKHN0YXJ0LCBlbmQpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgICApO1xuICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlKHVpbnQxNiwgc3RhcnQsIGVuZClcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHJlbGF0aXZlU3RhcnQgPSBUb0ludGVnZXJPckluZmluaXR5KHN0YXJ0KTtcbiAgICBjb25zdCByZWxhdGl2ZUVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogVG9JbnRlZ2VyT3JJbmZpbml0eShlbmQpO1xuXG4gICAgbGV0IGs7XG4gICAgaWYgKHJlbGF0aXZlU3RhcnQgPT09IC1JbmZpbml0eSkge1xuICAgICAgayA9IDA7XG4gICAgfSBlbHNlIGlmIChyZWxhdGl2ZVN0YXJ0IDwgMCkge1xuICAgICAgayA9IGxlbmd0aCArIHJlbGF0aXZlU3RhcnQgPiAwID8gbGVuZ3RoICsgcmVsYXRpdmVTdGFydCA6IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGsgPSBsZW5ndGggPCByZWxhdGl2ZVN0YXJ0ID8gbGVuZ3RoIDogcmVsYXRpdmVTdGFydDtcbiAgICB9XG5cbiAgICBsZXQgZmluYWw7XG4gICAgaWYgKHJlbGF0aXZlRW5kID09PSAtSW5maW5pdHkpIHtcbiAgICAgIGZpbmFsID0gMDtcbiAgICB9IGVsc2UgaWYgKHJlbGF0aXZlRW5kIDwgMCkge1xuICAgICAgZmluYWwgPSBsZW5ndGggKyByZWxhdGl2ZUVuZCA+IDAgPyBsZW5ndGggKyByZWxhdGl2ZUVuZCA6IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbmFsID0gbGVuZ3RoIDwgcmVsYXRpdmVFbmQgPyBsZW5ndGggOiByZWxhdGl2ZUVuZDtcbiAgICB9XG5cbiAgICBjb25zdCBjb3VudCA9IGZpbmFsIC0gayA+IDAgPyBmaW5hbCAtIGsgOiAwO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGNvdW50KTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSwgY291bnQpO1xuXG4gICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIpO1xuICAgIH1cblxuICAgIGxldCBuID0gMDtcbiAgICB3aGlsZSAoayA8IGZpbmFsKSB7XG4gICAgICBhcnJheVtuXSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2tdKTtcbiAgICAgICsraztcbiAgICAgICsrbjtcbiAgICB9XG5cbiAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChhcnJheSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc3ViYXJyYXkgKi9cbiAgc3ViYXJyYXkoYmVnaW4sIGVuZCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG5cbiAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgKTtcbiAgICBjb25zdCB1aW50MTZTdWJhcnJheSA9IFR5cGVkQXJyYXlQcm90b3R5cGVTdWJhcnJheSh1aW50MTYsIGJlZ2luLCBlbmQpO1xuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKHVpbnQxNlN1YmFycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KHVpbnQxNlN1YmFycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgodWludDE2U3ViYXJyYXkpXG4gICAgKTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSk7XG5cbiAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChhcnJheSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuaW5kZXhvZiAqL1xuICBpbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgbGV0IGZyb20gPSBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pO1xuICAgIGlmIChmcm9tID09PSBJbmZpbml0eSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgZnJvbSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKFxuICAgICAgICBPYmplY3RIYXNPd24oZmxvYXQxNmJpdHNBcnJheSwgaSkgJiZcbiAgICAgICAgY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pID09PSBlbGVtZW50XG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmxhc3RpbmRleG9mICovXG4gIGxhc3RJbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgbGV0IGZyb20gPSBvcHRzLmxlbmd0aCA+PSAxID8gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKSA6IGxlbmd0aCAtIDE7XG4gICAgaWYgKGZyb20gPT09IC1JbmZpbml0eSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChmcm9tID49IDApIHtcbiAgICAgIGZyb20gPSBmcm9tIDwgbGVuZ3RoIC0gMSA/IGZyb20gOiBsZW5ndGggLSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgT2JqZWN0SGFzT3duKGZsb2F0MTZiaXRzQXJyYXksIGkpICYmXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSA9PT0gZWxlbWVudFxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5pbmNsdWRlcyAqL1xuICBpbmNsdWRlcyhlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAoZnJvbSA9PT0gSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGlzTmFOID0gTnVtYmVySXNOYU4oZWxlbWVudCk7XG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG5cbiAgICAgIGlmIChpc05hTiAmJiBOdW1iZXJJc05hTih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuam9pbiAqL1xuICBqb2luKHNlcGFyYXRvcikge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGFycmF5ID0gY29weVRvQXJyYXkoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICByZXR1cm4gQXJyYXlQcm90b3R5cGVKb2luKGFycmF5LCBzZXBhcmF0b3IpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnRvbG9jYWxlc3RyaW5nICovXG4gIHRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgcmV0dXJuIEFycmF5UHJvdG90eXBlVG9Mb2NhbGVTdHJpbmcoYXJyYXksIC4uLnNhZmVJZk5lZWRlZChvcHRzKSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWdldC0ldHlwZWRhcnJheSUucHJvdG90eXBlLUBAdG9zdHJpbmd0YWcgKi9cbiAgZ2V0IFtTeW1ib2xUb1N0cmluZ1RhZ10oKSB7XG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KHRoaXMpKSB7XG4gICAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChcIkZsb2F0MTZBcnJheVwiKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10eXBlZGFycmF5LmJ5dGVzX3Blcl9lbGVtZW50ICovXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXksIFwiQllURVNfUEVSX0VMRU1FTlRcIiwge1xuICB2YWx1ZTogQllURVNfUEVSX0VMRU1FTlQsXG59KTtcblxuLy8gbGltaXRhdGlvbjogSXQgaXMgcGVha2VkIGJ5IGBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKEZsb2F0MTZBcnJheSlgIGFuZCBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXksIGJyYW5kLCB7fSk7XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtcHJvcGVydGllcy1vZi10aGUtdHlwZWRhcnJheS1jb25zdHJ1Y3RvcnMgKi9cblJlZmxlY3RTZXRQcm90b3R5cGVPZihGbG9hdDE2QXJyYXksIFR5cGVkQXJyYXkpO1xuXG5jb25zdCBGbG9hdDE2QXJyYXlQcm90b3R5cGUgPSBGbG9hdDE2QXJyYXkucHJvdG90eXBlO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXR5cGVkYXJyYXkucHJvdG90eXBlLmJ5dGVzX3Blcl9lbGVtZW50ICovXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXlQcm90b3R5cGUsIFwiQllURVNfUEVSX0VMRU1FTlRcIiwge1xuICB2YWx1ZTogQllURVNfUEVSX0VMRU1FTlQsXG59KTtcblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLUBAaXRlcmF0b3IgKi9cbk9iamVjdERlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheVByb3RvdHlwZSwgU3ltYm9sSXRlcmF0b3IsIHtcbiAgdmFsdWU6IEZsb2F0MTZBcnJheVByb3RvdHlwZS52YWx1ZXMsXG4gIHdyaXRhYmxlOiB0cnVlLFxuICBjb25maWd1cmFibGU6IHRydWUsXG59KTtcblxuUmVmbGVjdFNldFByb3RvdHlwZU9mKEZsb2F0MTZBcnJheVByb3RvdHlwZSwgVHlwZWRBcnJheVByb3RvdHlwZSk7XG4iLCJpbXBvcnQgeyBpc0Zsb2F0MTZBcnJheSB9IGZyb20gXCIuL0Zsb2F0MTZBcnJheS5tanNcIjtcbmltcG9ydCB7IGlzTmF0aXZlVHlwZWRBcnJheSB9IGZyb20gXCIuL191dGlsL2lzLm1qc1wiO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVWludDhBcnJheXxVaW50OENsYW1wZWRBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxJbnQ4QXJyYXl8SW50MTZBcnJheXxJbnQzMkFycmF5fEZsb2F0MTZBcnJheXxGbG9hdDMyQXJyYXl8RmxvYXQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fEJpZ0ludDY0QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1R5cGVkQXJyYXkodGFyZ2V0KSB7XG4gIHJldHVybiBpc05hdGl2ZVR5cGVkQXJyYXkodGFyZ2V0KSB8fCBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpO1xufVxuIiwiaW1wb3J0IHsgc2FmZUlmTmVlZGVkIH0gZnJvbSBcIi4vX3V0aWwvYXJyYXlJdGVyYXRvci5tanNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHtcbiAgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYsXG4gIERhdGFWaWV3UHJvdG90eXBlU2V0VWludDE2LFxufSBmcm9tIFwiLi9fdXRpbC9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiByZXR1cm5zIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlld1xuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge1tib29sZWFuXX0gb3B0c1xuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZsb2F0MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIC4uLm9wdHMpIHtcbiAgcmV0dXJuIGNvbnZlcnRUb051bWJlcihcbiAgICBEYXRhVmlld1Byb3RvdHlwZUdldFVpbnQxNihkYXRhVmlldywgYnl0ZU9mZnNldCwgLi4uc2FmZUlmTmVlZGVkKG9wdHMpKVxuICApO1xufVxuXG4vKipcbiAqIHN0b3JlcyBhbiB1bnNpZ25lZCAxNi1iaXQgZmxvYXQgdmFsdWUgYXQgdGhlIHNwZWNpZmllZCBieXRlIG9mZnNldCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgRGF0YVZpZXdcbiAqIEBwYXJhbSB7RGF0YVZpZXd9IGRhdGFWaWV3XG4gKiBAcGFyYW0ge251bWJlcn0gYnl0ZU9mZnNldFxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlXG4gKiBAcGFyYW0ge1tib29sZWFuXX0gb3B0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RmxvYXQxNihkYXRhVmlldywgYnl0ZU9mZnNldCwgdmFsdWUsIC4uLm9wdHMpIHtcbiAgcmV0dXJuIERhdGFWaWV3UHJvdG90eXBlU2V0VWludDE2KFxuICAgIGRhdGFWaWV3LFxuICAgIGJ5dGVPZmZzZXQsXG4gICAgcm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSxcbiAgICAuLi5zYWZlSWZOZWVkZWQob3B0cylcbiAgKTtcbn1cbiIsImltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHsgTnVtYmVySXNGaW5pdGUgfSBmcm9tIFwiLi9fdXRpbC9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiByZXR1cm5zIHRoZSBuZWFyZXN0IGhhbGYtcHJlY2lzaW9uIGZsb2F0IHJlcHJlc2VudGF0aW9uIG9mIGEgbnVtYmVyXG4gKiBAcGFyYW0ge251bWJlcn0geFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGYxNnJvdW5kKHgpIHtcbiAgY29uc3QgbnVtYmVyID0gK3g7XG5cbiAgLy8gZm9yIG9wdGltaXphdGlvblxuICBpZiAoIU51bWJlcklzRmluaXRlKG51bWJlcikgfHwgbnVtYmVyID09PSAwKSB7XG4gICAgcmV0dXJuIG51bWJlcjtcbiAgfVxuXG4gIGNvbnN0IHgxNiA9IHJvdW5kVG9GbG9hdDE2Qml0cyhudW1iZXIpO1xuICByZXR1cm4gY29udmVydFRvTnVtYmVyKHgxNik7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7RUFBTyxNQUFNLHFCQUFxQixHQUFHLHVCQUF1QixDQUFDO0VBQ3RELE1BQU0saUNBQWlDLEdBQUcsbUNBQW1DLENBQUM7RUFDOUUsTUFBTSxrREFBa0Q7RUFDL0QsRUFBRSxvREFBb0QsQ0FBQztFQUNoRCxNQUFNLCtDQUErQztFQUM1RCxFQUFFLGlEQUFpRCxDQUFDO0VBQzdDLE1BQU0sa0RBQWtEO0VBQy9ELEVBQUUscURBQXFELENBQUM7RUFDakQsTUFBTSx3RUFBd0U7RUFDckYsRUFBRSwwRUFBMEUsQ0FBQztFQUN0RSxNQUFNLHlDQUF5QztFQUN0RCxFQUFFLDJDQUEyQyxDQUFDO0VBQ3ZDLE1BQU0sMENBQTBDO0VBQ3ZELEVBQUUsNENBQTRDLENBQUM7RUFDeEMsTUFBTSxpQ0FBaUM7RUFDOUMsRUFBRSw2REFBNkQsQ0FBQztFQUN6RCxNQUFNLGlDQUFpQyxHQUFHLHFDQUFxQyxDQUFDO0VBQ2hGLE1BQU0sMkNBQTJDO0VBQ3hELEVBQUUsNkNBQTZDLENBQUM7RUFDekMsTUFBTSw4REFBOEQ7RUFDM0UsRUFBRSxnRUFBZ0UsQ0FBQztFQUM1RCxNQUFNLHVCQUF1QixHQUFHLHlCQUF5Qjs7RUNmaEUsU0FBUyxXQUFXLENBQUMs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
