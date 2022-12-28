/*! @petamoriken/float16 v3.7.0-30-g724163e | MIT License - https://github.com/petamoriken/float16 */

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
  const MathTrunc = Math.trunc;
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

  const buffer = new NativeArrayBuffer(4);
  const floatView = new NativeFloat32Array(buffer);
  const uint32View = new NativeUint32Array(buffer);
  const baseTable = new NativeUint32Array(512);
  const shiftTable = new NativeUint32Array(512);
  for (let i = 0; i < 256; ++i) {
    const e = i - 127;
    if (e < -27) {
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
    floatView[0] =  (num);
    const f = uint32View[0];
    const e = (f >> 23) & 0x1ff;
    return baseTable[e] + ((f & 0x007fffff) >> shiftTable[e]);
  }
  const mantissaTable = new NativeUint32Array(2048);
  const exponentTable = new NativeUint32Array(64);
  const offsetTable = new NativeUint32Array(64);
  for (let i = 1; i < 1024; ++i) {
    let m = i << 13;
    let e = 0;
    while((m & 0x00800000) === 0) {
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
  for (let i = 1; i < 31; ++i) {
    exponentTable[i] = i << 23;
  }
  exponentTable[31] = 0x47800000;
  exponentTable[32] = 0x80000000;
  for (let i = 33; i < 63; ++i) {
    exponentTable[i] = 0x80000000 + ((i - 32) << 23);
  }
  exponentTable[63] = 0xc7800000;
  for (let i = 1; i < 64; ++i) {
    if (i !== 32) {
      offsetTable[i] = 1024;
    }
  }
  function convertToNumber(float16bits) {
    const m = float16bits >> 10;
    uint32View[0] = mantissaTable[offsetTable[m] + (float16bits & 0x3ff)] + exponentTable[m];
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

  function hfround(x) {
    const number = +x;
    if (!NumberIsFinite(number) || number === 0) {
      return number;
    }
    const x16 = roundToFloat16Bits(number);
    return convertToNumber(x16);
  }

  exports.Float16Array = Float16Array;
  exports.getFloat16 = getFloat16;
  exports.hfround = hfround;
  exports.isFloat16Array = isFloat16Array;
  exports.isTypedArray = isTypedArray;
  exports.setFloat16 = setFloat16;

  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

  return exports;

})({});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXQxNi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL191dGlsL21lc3NhZ2VzLm1qcyIsIi4uL3NyYy9fdXRpbC9wcmltb3JkaWFscy5tanMiLCIuLi9zcmMvX3V0aWwvYXJyYXlJdGVyYXRvci5tanMiLCIuLi9zcmMvX3V0aWwvaXMubWpzIiwiLi4vc3JjL191dGlsL2JyYW5kLm1qcyIsIi4uL3NyYy9fdXRpbC9jb252ZXJ0ZXIubWpzIiwiLi4vc3JjL191dGlsL3NwZWMubWpzIiwiLi4vc3JjL0Zsb2F0MTZBcnJheS5tanMiLCIuLi9zcmMvaXNUeXBlZEFycmF5Lm1qcyIsIi4uL3NyYy9EYXRhVmlldy5tanMiLCIuLi9zcmMvaGZyb3VuZC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFRISVNfSVNfTk9UX0FOX09CSkVDVCA9IFwiVGhpcyBpcyBub3QgYW4gb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgVEhJU19JU19OT1RfQV9GTE9BVDE2QVJSQVlfT0JKRUNUID0gXCJUaGlzIGlzIG5vdCBhIEZsb2F0MTZBcnJheSBvYmplY3RcIjtcbmV4cG9ydCBjb25zdCBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWSA9XG4gIFwiVGhpcyBjb25zdHJ1Y3RvciBpcyBub3QgYSBzdWJjbGFzcyBvZiBGbG9hdDE2QXJyYXlcIjtcbmV4cG9ydCBjb25zdCBUSEVfQ09OU1RSVUNUT1JfUFJPUEVSVFlfVkFMVUVfSVNfTk9UX0FOX09CSkVDVCA9XG4gIFwiVGhlIGNvbnN0cnVjdG9yIHByb3BlcnR5IHZhbHVlIGlzIG5vdCBhbiBvYmplY3RcIjtcbmV4cG9ydCBjb25zdCBTUEVDSUVTX0NPTlNUUlVDVE9SX0RJRE5UX1JFVFVSTl9UWVBFREFSUkFZX09CSkVDVCA9XG4gIFwiU3BlY2llcyBjb25zdHJ1Y3RvciBkaWRuJ3QgcmV0dXJuIFR5cGVkQXJyYXkgb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgREVSSVZFRF9DT05TVFJVQ1RPUl9DUkVBVEVEX1RZUEVEQVJSQVlfT0JKRUNUX1dISUNIX1dBU19UT09fU01BTExfTEVOR1RIID1cbiAgXCJEZXJpdmVkIGNvbnN0cnVjdG9yIGNyZWF0ZWQgVHlwZWRBcnJheSBvYmplY3Qgd2hpY2ggd2FzIHRvbyBzbWFsbCBsZW5ndGhcIjtcbmV4cG9ydCBjb25zdCBBVFRFTVBUSU5HX1RPX0FDQ0VTU19ERVRBQ0hFRF9BUlJBWUJVRkZFUiA9XG4gIFwiQXR0ZW1wdGluZyB0byBhY2Nlc3MgZGV0YWNoZWQgQXJyYXlCdWZmZXJcIjtcbmV4cG9ydCBjb25zdCBDQU5OT1RfQ09OVkVSVF9VTkRFRklORURfT1JfTlVMTF9UT19PQkpFQ1QgPVxuICBcIkNhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFUyA9XG4gIFwiQ2Fubm90IG1peCBCaWdJbnQgYW5kIG90aGVyIHR5cGVzLCB1c2UgZXhwbGljaXQgY29udmVyc2lvbnNcIjtcbmV4cG9ydCBjb25zdCBJVEVSQVRPUl9QUk9QRVJUWV9JU19OT1RfQ0FMTEFCTEUgPSBcIkBAaXRlcmF0b3IgcHJvcGVydHkgaXMgbm90IGNhbGxhYmxlXCI7XG5leHBvcnQgY29uc3QgUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSA9XG4gIFwiUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZVwiO1xuZXhwb3J0IGNvbnN0IFRIRV9DT01QQVJJU09OX0ZVTkNUSU9OX01VU1RfQkVfRUlUSEVSX0FfRlVOQ1RJT05fT1JfVU5ERUZJTkVEID1cbiAgXCJUaGUgY29tcGFyaXNvbiBmdW5jdGlvbiBtdXN0IGJlIGVpdGhlciBhIGZ1bmN0aW9uIG9yIHVuZGVmaW5lZFwiO1xuZXhwb3J0IGNvbnN0IE9GRlNFVF9JU19PVVRfT0ZfQk9VTkRTID0gXCJPZmZzZXQgaXMgb3V0IG9mIGJvdW5kc1wiO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzLCBuby1yZXN0cmljdGVkLXN5bnRheCAqL1xuLyogZ2xvYmFsIFNoYXJlZEFycmF5QnVmZmVyICovXG5cbmltcG9ydCB7IENBTk5PVF9DT05WRVJUX1VOREVGSU5FRF9PUl9OVUxMX1RPX09CSkVDVCB9IGZyb20gXCIuL21lc3NhZ2VzLm1qc1wiO1xuXG4vKiogQHR5cGUgezxUIGV4dGVuZHMgKC4uLmFyZ3M6IGFueSkgPT4gYW55Pih0YXJnZXQ6IFQpID0+ICh0aGlzQXJnOiBUaGlzVHlwZTxUPiwgLi4uYXJnczogYW55W10pID0+IGFueX0gKi9cbmZ1bmN0aW9uIHVuY3VycnlUaGlzKHRhcmdldCkge1xuICByZXR1cm4gKHRoaXNBcmcsIC4uLmFyZ3MpID0+IHtcbiAgICByZXR1cm4gUmVmbGVjdEFwcGx5KHRhcmdldCwgdGhpc0FyZywgYXJncyk7XG4gIH07XG59XG5cbi8qKiBAdHlwZSB7KHRhcmdldDogYW55LCBrZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4gKHRoaXNBcmc6IGFueSwgLi4uYXJnczogYW55W10pID0+IGFueX0gKi9cbmZ1bmN0aW9uIHVuY3VycnlUaGlzR2V0dGVyKHRhcmdldCwga2V5KSB7XG4gIHJldHVybiB1bmN1cnJ5VGhpcyhcbiAgICBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgICAgdGFyZ2V0LFxuICAgICAga2V5XG4gICAgKS5nZXRcbiAgKTtcbn1cblxuLy8gUmVmbGVjdFxuZXhwb3J0IGNvbnN0IHtcbiAgYXBwbHk6IFJlZmxlY3RBcHBseSxcbiAgY29uc3RydWN0OiBSZWZsZWN0Q29uc3RydWN0LFxuICBkZWZpbmVQcm9wZXJ0eTogUmVmbGVjdERlZmluZVByb3BlcnR5LFxuICBnZXQ6IFJlZmxlY3RHZXQsXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgZ2V0UHJvdG90eXBlT2Y6IFJlZmxlY3RHZXRQcm90b3R5cGVPZixcbiAgaGFzOiBSZWZsZWN0SGFzLFxuICBvd25LZXlzOiBSZWZsZWN0T3duS2V5cyxcbiAgc2V0OiBSZWZsZWN0U2V0LFxuICBzZXRQcm90b3R5cGVPZjogUmVmbGVjdFNldFByb3RvdHlwZU9mLFxufSA9IFJlZmxlY3Q7XG5cbi8vIFByb3h5XG5leHBvcnQgY29uc3QgTmF0aXZlUHJveHkgPSBQcm94eTtcblxuLy8gTnVtYmVyXG5leHBvcnQgY29uc3Qge1xuICBNQVhfU0FGRV9JTlRFR0VSLFxuICBpc0Zpbml0ZTogTnVtYmVySXNGaW5pdGUsXG4gIGlzTmFOOiBOdW1iZXJJc05hTixcbn0gPSBOdW1iZXI7XG5cbi8vIFN5bWJvbFxuZXhwb3J0IGNvbnN0IHtcbiAgaXRlcmF0b3I6IFN5bWJvbEl0ZXJhdG9yLFxuICBzcGVjaWVzOiBTeW1ib2xTcGVjaWVzLFxuICB0b1N0cmluZ1RhZzogU3ltYm9sVG9TdHJpbmdUYWcsXG4gIGZvcjogU3ltYm9sRm9yLFxufSA9IFN5bWJvbDtcblxuLy8gT2JqZWN0XG5leHBvcnQgY29uc3QgTmF0aXZlT2JqZWN0ID0gT2JqZWN0O1xuZXhwb3J0IGNvbnN0IHtcbiAgY3JlYXRlOiBPYmplY3RDcmVhdGUsXG4gIGRlZmluZVByb3BlcnR5OiBPYmplY3REZWZpbmVQcm9wZXJ0eSxcbiAgZnJlZXplOiBPYmplY3RGcmVlemUsXG4gIGlzOiBPYmplY3RJcyxcbn0gPSBOYXRpdmVPYmplY3Q7XG5jb25zdCBPYmplY3RQcm90b3R5cGUgPSBOYXRpdmVPYmplY3QucHJvdG90eXBlO1xuLyoqIEB0eXBlIHsob2JqZWN0OiBvYmplY3QsIGtleTogUHJvcGVydHlLZXkpID0+IEZ1bmN0aW9uIHwgdW5kZWZpbmVkfSAqL1xuZXhwb3J0IGNvbnN0IE9iamVjdFByb3RvdHlwZV9fbG9va3VwR2V0dGVyX18gPSAvKiogQHR5cGUge2FueX0gKi8gKE9iamVjdFByb3RvdHlwZSkuX19sb29rdXBHZXR0ZXJfX1xuICA/IHVuY3VycnlUaGlzKC8qKiBAdHlwZSB7YW55fSAqLyAoT2JqZWN0UHJvdG90eXBlKS5fX2xvb2t1cEdldHRlcl9fKVxuICA6IChvYmplY3QsIGtleSkgPT4ge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBDQU5OT1RfQ09OVkVSVF9VTkRFRklORURfT1JfTlVMTF9UT19PQkpFQ1RcbiAgICAgICk7XG4gICAgfVxuXG4gICAgbGV0IHRhcmdldCA9IE5hdGl2ZU9iamVjdChvYmplY3QpO1xuICAgIGRvIHtcbiAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgICAgIGlmIChkZXNjcmlwdG9yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKE9iamVjdEhhc093bihkZXNjcmlwdG9yLCBcImdldFwiKSkge1xuICAgICAgICAgIHJldHVybiBkZXNjcmlwdG9yLmdldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9IHdoaWxlICgodGFyZ2V0ID0gUmVmbGVjdEdldFByb3RvdHlwZU9mKHRhcmdldCkpICE9PSBudWxsKTtcbiAgfTtcbi8qKiBAdHlwZSB7KG9iamVjdDogb2JqZWN0LCBrZXk6IFByb3BlcnR5S2V5KSA9PiBib29sZWFufSAqL1xuZXhwb3J0IGNvbnN0IE9iamVjdEhhc093biA9IC8qKiBAdHlwZSB7YW55fSAqLyAoTmF0aXZlT2JqZWN0KS5oYXNPd24gfHxcbiAgdW5jdXJyeVRoaXMoT2JqZWN0UHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuLy8gQXJyYXlcbmNvbnN0IE5hdGl2ZUFycmF5ID0gQXJyYXk7XG5leHBvcnQgY29uc3QgQXJyYXlJc0FycmF5ID0gTmF0aXZlQXJyYXkuaXNBcnJheTtcbmNvbnN0IEFycmF5UHJvdG90eXBlID0gTmF0aXZlQXJyYXkucHJvdG90eXBlO1xuLyoqIEB0eXBlIHsoYXJyYXk6IEFycmF5TGlrZTx1bmtub3duPiwgc2VwYXJhdG9yPzogc3RyaW5nKSA9PiBzdHJpbmd9ICovXG5leHBvcnQgY29uc3QgQXJyYXlQcm90b3R5cGVKb2luID0gdW5jdXJyeVRoaXMoQXJyYXlQcm90b3R5cGUuam9pbik7XG4vKiogQHR5cGUgezxUPihhcnJheTogVFtdLCAuLi5pdGVtczogVFtdKSA9PiBudW1iZXJ9ICovXG5leHBvcnQgY29uc3QgQXJyYXlQcm90b3R5cGVQdXNoID0gdW5jdXJyeVRoaXMoQXJyYXlQcm90b3R5cGUucHVzaCk7XG4vKiogQHR5cGUgeyhhcnJheTogQXJyYXlMaWtlPHVua25vd24+LCAuLi5vcHRzOiBhbnlbXSkgPT4gc3RyaW5nfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5UHJvdG90eXBlVG9Mb2NhbGVTdHJpbmcgPSB1bmN1cnJ5VGhpcyhcbiAgQXJyYXlQcm90b3R5cGUudG9Mb2NhbGVTdHJpbmdcbik7XG5leHBvcnQgY29uc3QgTmF0aXZlQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvciA9IEFycmF5UHJvdG90eXBlW1N5bWJvbEl0ZXJhdG9yXTtcbi8qKiBAdHlwZSB7PFQ+KGFycmF5OiBUW10pID0+IEl0ZXJhYmxlSXRlcmF0b3I8VD59ICovXG5leHBvcnQgY29uc3QgQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvciA9IHVuY3VycnlUaGlzKE5hdGl2ZUFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IpO1xuXG4vLyBNYXRoXG5leHBvcnQgY29uc3QgTWF0aFRydW5jID0gTWF0aC50cnVuYztcblxuLy8gQXJyYXlCdWZmZXJcbmV4cG9ydCBjb25zdCBOYXRpdmVBcnJheUJ1ZmZlciA9IEFycmF5QnVmZmVyO1xuZXhwb3J0IGNvbnN0IEFycmF5QnVmZmVySXNWaWV3ID0gTmF0aXZlQXJyYXlCdWZmZXIuaXNWaWV3O1xuY29uc3QgQXJyYXlCdWZmZXJQcm90b3R5cGUgPSBOYXRpdmVBcnJheUJ1ZmZlci5wcm90b3R5cGU7XG4vKiogQHR5cGUgeyhidWZmZXI6IEFycmF5QnVmZmVyLCBiZWdpbj86IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBudW1iZXJ9ICovXG5leHBvcnQgY29uc3QgQXJyYXlCdWZmZXJQcm90b3R5cGVTbGljZSA9IHVuY3VycnlUaGlzKEFycmF5QnVmZmVyUHJvdG90eXBlLnNsaWNlKTtcbi8qKiBAdHlwZSB7KGJ1ZmZlcjogQXJyYXlCdWZmZXIpID0+IEFycmF5QnVmZmVyfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCA9IHVuY3VycnlUaGlzR2V0dGVyKEFycmF5QnVmZmVyUHJvdG90eXBlLCBcImJ5dGVMZW5ndGhcIik7XG5cbi8vIFNoYXJlZEFycmF5QnVmZmVyXG5leHBvcnQgY29uc3QgTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXIgPSB0eXBlb2YgU2hhcmVkQXJyYXlCdWZmZXIgIT09IFwidW5kZWZpbmVkXCIgPyBTaGFyZWRBcnJheUJ1ZmZlciA6IG51bGw7XG4vKiogQHR5cGUgeyhidWZmZXI6IFNoYXJlZEFycmF5QnVmZmVyKSA9PiBTaGFyZWRBcnJheUJ1ZmZlcn0gKi9cbmV4cG9ydCBjb25zdCBTaGFyZWRBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGggPSBOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlclxuICAmJiB1bmN1cnJ5VGhpc0dldHRlcihOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlci5wcm90b3R5cGUsIFwiYnl0ZUxlbmd0aFwiKTtcblxuLy8gVHlwZWRBcnJheVxuLyoqIEB0eXBlZGVmIHtVaW50OEFycmF5fFVpbnQ4Q2xhbXBlZEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fEludDhBcnJheXxJbnQxNkFycmF5fEludDMyQXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheXxCaWdVaW50NjRBcnJheXxCaWdJbnQ2NEFycmF5fSBUeXBlZEFycmF5ICovXG4vKiogQHR5cGUge2FueX0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5ID0gUmVmbGVjdEdldFByb3RvdHlwZU9mKFVpbnQ4QXJyYXkpO1xuY29uc3QgVHlwZWRBcnJheUZyb20gPSBUeXBlZEFycmF5LmZyb207XG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZSA9IFR5cGVkQXJyYXkucHJvdG90eXBlO1xuZXhwb3J0IGNvbnN0IE5hdGl2ZVR5cGVkQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvciA9IFR5cGVkQXJyYXlQcm90b3R5cGVbU3ltYm9sSXRlcmF0b3JdO1xuLyoqIEB0eXBlIHsodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gSXRlcmFibGVJdGVyYXRvcjxudW1iZXI+fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVLZXlzID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5rZXlzKTtcbi8qKiBAdHlwZSB7KHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IEl0ZXJhYmxlSXRlcmF0b3I8bnVtYmVyPn0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlVmFsdWVzID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUudmFsdWVzXG4pO1xuLyoqIEB0eXBlIHsodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gSXRlcmFibGVJdGVyYXRvcjxbbnVtYmVyLCBudW1iZXJdPn0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlRW50cmllcyA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLmVudHJpZXNcbik7XG4vKiogQHR5cGUgeyh0eXBlZEFycmF5OiBUeXBlZEFycmF5LCBhcnJheTogQXJyYXlMaWtlPG51bWJlcj4sIG9mZnNldD86IG51bWJlcikgPT4gdm9pZH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlU2V0ID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5zZXQpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVJldmVyc2UgPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS5yZXZlcnNlXG4pO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHZhbHVlOiBudW1iZXIsIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUZpbGwgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLmZpbGwpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHRhcmdldDogbnVtYmVyLCBzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUNvcHlXaXRoaW4gPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS5jb3B5V2l0aGluXG4pO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIGNvbXBhcmVGbj86IChhOiBudW1iZXIsIGI6IG51bWJlcikgPT4gbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVTb3J0ID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5zb3J0KTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUuc2xpY2UpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVN1YmFycmF5ID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUuc3ViYXJyYXlcbik7XG4vKiogQHR5cGUgeygodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gQXJyYXlCdWZmZXIpfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIgPSB1bmN1cnJ5VGhpc0dldHRlcihcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgXCJidWZmZXJcIlxuKTtcbi8qKiBAdHlwZSB7KCh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBudW1iZXIpfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0ID0gdW5jdXJyeVRoaXNHZXR0ZXIoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUsXG4gIFwiYnl0ZU9mZnNldFwiXG4pO1xuLyoqIEB0eXBlIHsoKHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IG51bWJlcil9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aCA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBcImxlbmd0aFwiXG4pO1xuLyoqIEB0eXBlIHsodGFyZ2V0OiB1bmtub3duKSA9PiBzdHJpbmd9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUdldFN5bWJvbFRvU3RyaW5nVGFnID0gdW5jdXJyeVRoaXNHZXR0ZXIoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUsXG4gIFN5bWJvbFRvU3RyaW5nVGFnXG4pO1xuXG4vLyBVaW50MTZBcnJheVxuZXhwb3J0IGNvbnN0IE5hdGl2ZVVpbnQxNkFycmF5ID0gVWludDE2QXJyYXk7XG4vKiogQHR5cGUge1VpbnQxNkFycmF5Q29uc3RydWN0b3JbXCJmcm9tXCJdfSAqL1xuZXhwb3J0IGNvbnN0IFVpbnQxNkFycmF5RnJvbSA9ICguLi5hcmdzKSA9PiB7XG4gIHJldHVybiBSZWZsZWN0QXBwbHkoVHlwZWRBcnJheUZyb20sIE5hdGl2ZVVpbnQxNkFycmF5LCBhcmdzKTtcbn07XG5cbi8vIFVpbnQzMkFycmF5XG5leHBvcnQgY29uc3QgTmF0aXZlVWludDMyQXJyYXkgPSBVaW50MzJBcnJheTtcblxuLy8gRmxvYXQzMkFycmF5XG5leHBvcnQgY29uc3QgTmF0aXZlRmxvYXQzMkFycmF5ID0gRmxvYXQzMkFycmF5O1xuXG4vLyBBcnJheUl0ZXJhdG9yXG4vKiogQHR5cGUge2FueX0gKi9cbmV4cG9ydCBjb25zdCBBcnJheUl0ZXJhdG9yUHJvdG90eXBlID0gUmVmbGVjdEdldFByb3RvdHlwZU9mKFtdW1N5bWJvbEl0ZXJhdG9yXSgpKTtcbi8qKiBAdHlwZSB7PFQ+KGFycmF5SXRlcmF0b3I6IEl0ZXJhYmxlSXRlcmF0b3I8VD4pID0+IEl0ZXJhdG9yUmVzdWx0PFQ+fSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5SXRlcmF0b3JQcm90b3R5cGVOZXh0ID0gdW5jdXJyeVRoaXMoQXJyYXlJdGVyYXRvclByb3RvdHlwZS5uZXh0KTtcblxuLy8gR2VuZXJhdG9yXG4vKiogQHR5cGUgezxUID0gdW5rbm93biwgVFJldHVybiA9IGFueSwgVE5leHQgPSB1bmtub3duPihnZW5lcmF0b3I6IEdlbmVyYXRvcjxULCBUUmV0dXJuLCBUTmV4dD4sIHZhbHVlPzogVE5leHQpID0+IFR9ICovXG5leHBvcnQgY29uc3QgR2VuZXJhdG9yUHJvdG90eXBlTmV4dCA9IHVuY3VycnlUaGlzKChmdW5jdGlvbiogKCkge30pKCkubmV4dCk7XG5cbi8vIEl0ZXJhdG9yXG5leHBvcnQgY29uc3QgSXRlcmF0b3JQcm90b3R5cGUgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YoQXJyYXlJdGVyYXRvclByb3RvdHlwZSk7XG5cbi8vIERhdGFWaWV3XG5jb25zdCBEYXRhVmlld1Byb3RvdHlwZSA9IERhdGFWaWV3LnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KGRhdGFWaWV3OiBEYXRhVmlldywgYnl0ZU9mZnNldDogbnVtYmVyLCBsaXR0bGVFbmRpYW4/OiBib29sZWFuKSA9PiBudW1iZXJ9ICovXG5leHBvcnQgY29uc3QgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYgPSB1bmN1cnJ5VGhpcyhcbiAgRGF0YVZpZXdQcm90b3R5cGUuZ2V0VWludDE2XG4pO1xuLyoqIEB0eXBlIHsoZGF0YVZpZXc6IERhdGFWaWV3LCBieXRlT2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIGxpdHRsZUVuZGlhbj86IGJvb2xlYW4pID0+IHZvaWR9ICovXG5leHBvcnQgY29uc3QgRGF0YVZpZXdQcm90b3R5cGVTZXRVaW50MTYgPSB1bmN1cnJ5VGhpcyhcbiAgRGF0YVZpZXdQcm90b3R5cGUuc2V0VWludDE2XG4pO1xuXG4vLyBFcnJvclxuZXhwb3J0IGNvbnN0IE5hdGl2ZVR5cGVFcnJvciA9IFR5cGVFcnJvcjtcbmV4cG9ydCBjb25zdCBOYXRpdmVSYW5nZUVycm9yID0gUmFuZ2VFcnJvcjtcblxuLy8gV2Vha1NldFxuLyoqXG4gKiBEbyBub3QgY29uc3RydWN0IHdpdGggYXJndW1lbnRzIHRvIGF2b2lkIGNhbGxpbmcgdGhlIFwiYWRkXCIgbWV0aG9kXG4gKlxuICogQHR5cGUge3tuZXcgPFQgZXh0ZW5kcyB7fT4oKTogV2Vha1NldDxUPn19XG4gKi9cbmV4cG9ydCBjb25zdCBOYXRpdmVXZWFrU2V0ID0gV2Vha1NldDtcbmNvbnN0IFdlYWtTZXRQcm90b3R5cGUgPSBOYXRpdmVXZWFrU2V0LnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyB7fT4oc2V0OiBXZWFrU2V0PFQ+LCB2YWx1ZTogVCkgPT4gU2V0PFQ+fSAqL1xuZXhwb3J0IGNvbnN0IFdlYWtTZXRQcm90b3R5cGVBZGQgPSB1bmN1cnJ5VGhpcyhXZWFrU2V0UHJvdG90eXBlLmFkZCk7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMge30+KHNldDogV2Vha1NldDxUPiwgdmFsdWU6IFQpID0+IGJvb2xlYW59ICovXG5leHBvcnQgY29uc3QgV2Vha1NldFByb3RvdHlwZUhhcyA9IHVuY3VycnlUaGlzKFdlYWtTZXRQcm90b3R5cGUuaGFzKTtcblxuLy8gV2Vha01hcFxuLyoqXG4gKiBEbyBub3QgY29uc3RydWN0IHdpdGggYXJndW1lbnRzIHRvIGF2b2lkIGNhbGxpbmcgdGhlIFwic2V0XCIgbWV0aG9kXG4gKlxuICogQHR5cGUge3tuZXcgPEsgZXh0ZW5kcyB7fSwgVj4oKTogV2Vha01hcDxLLCBWPn19XG4gKi9cbmV4cG9ydCBjb25zdCBOYXRpdmVXZWFrTWFwID0gV2Vha01hcDtcbmNvbnN0IFdlYWtNYXBQcm90b3R5cGUgPSBOYXRpdmVXZWFrTWFwLnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7PEsgZXh0ZW5kcyB7fSwgVj4od2Vha01hcDogV2Vha01hcDxLLCBWPiwga2V5OiBLKSA9PiBWfSAqL1xuZXhwb3J0IGNvbnN0IFdlYWtNYXBQcm90b3R5cGVHZXQgPSB1bmN1cnJ5VGhpcyhXZWFrTWFwUHJvdG90eXBlLmdldCk7XG4vKiogQHR5cGUgezxLIGV4dGVuZHMge30sIFY+KHdlYWtNYXA6IFdlYWtNYXA8SywgVj4sIGtleTogSykgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBXZWFrTWFwUHJvdG90eXBlSGFzID0gdW5jdXJyeVRoaXMoV2Vha01hcFByb3RvdHlwZS5oYXMpO1xuLyoqIEB0eXBlIHs8SyBleHRlbmRzIHt9LCBWPih3ZWFrTWFwOiBXZWFrTWFwPEssIFY+LCBrZXk6IEssIHZhbHVlOiBWKSA9PiBXZWFrTWFwfSAqL1xuZXhwb3J0IGNvbnN0IFdlYWtNYXBQcm90b3R5cGVTZXQgPSB1bmN1cnJ5VGhpcyhXZWFrTWFwUHJvdG90eXBlLnNldCk7XG4iLCJpbXBvcnQge1xuICBBcnJheUl0ZXJhdG9yUHJvdG90eXBlLFxuICBBcnJheUl0ZXJhdG9yUHJvdG90eXBlTmV4dCxcbiAgQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvcixcbiAgR2VuZXJhdG9yUHJvdG90eXBlTmV4dCxcbiAgSXRlcmF0b3JQcm90b3R5cGUsXG4gIE5hdGl2ZUFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IsXG4gIE5hdGl2ZVdlYWtNYXAsXG4gIE9iamVjdENyZWF0ZSxcbiAgT2JqZWN0RGVmaW5lUHJvcGVydHksXG4gIFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIFJlZmxlY3RPd25LZXlzLFxuICBTeW1ib2xJdGVyYXRvcixcbiAgV2Vha01hcFByb3RvdHlwZUdldCxcbiAgV2Vha01hcFByb3RvdHlwZVNldCxcbn0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbi8qKiBAdHlwZSB7V2Vha01hcDx7fSwgSXRlcmFibGVJdGVyYXRvcjxhbnk+Pn0gKi9cbmNvbnN0IGFycmF5SXRlcmF0b3JzID0gbmV3IE5hdGl2ZVdlYWtNYXAoKTtcblxuY29uc3QgU2FmZUl0ZXJhdG9yUHJvdG90eXBlID0gT2JqZWN0Q3JlYXRlKG51bGwsIHtcbiAgbmV4dDoge1xuICAgIHZhbHVlOiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgY29uc3QgYXJyYXlJdGVyYXRvciA9IFdlYWtNYXBQcm90b3R5cGVHZXQoYXJyYXlJdGVyYXRvcnMsIHRoaXMpO1xuICAgICAgcmV0dXJuIEFycmF5SXRlcmF0b3JQcm90b3R5cGVOZXh0KGFycmF5SXRlcmF0b3IpO1xuICAgIH0sXG4gIH0sXG5cbiAgW1N5bWJvbEl0ZXJhdG9yXToge1xuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICB9LFxufSk7XG5cbi8qKlxuICogV3JhcCB0aGUgQXJyYXkgYXJvdW5kIHRoZSBTYWZlSXRlcmF0b3IgSWYgQXJyYXkucHJvdG90eXBlIFtAQGl0ZXJhdG9yXSBoYXMgYmVlbiBtb2RpZmllZFxuICpcbiAqIEB0eXBlIHs8VD4oYXJyYXk6IFRbXSkgPT4gSXRlcmFibGU8VD59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYWZlSWZOZWVkZWQoYXJyYXkpIHtcbiAgaWYgKFxuICAgIGFycmF5W1N5bWJvbEl0ZXJhdG9yXSA9PT0gTmF0aXZlQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvciAmJlxuICAgIEFycmF5SXRlcmF0b3JQcm90b3R5cGUubmV4dCA9PT0gQXJyYXlJdGVyYXRvclByb3RvdHlwZU5leHRcbiAgKSB7XG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgY29uc3Qgc2FmZSA9IE9iamVjdENyZWF0ZShTYWZlSXRlcmF0b3JQcm90b3R5cGUpO1xuICBXZWFrTWFwUHJvdG90eXBlU2V0KGFycmF5SXRlcmF0b3JzLCBzYWZlLCBBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yKGFycmF5KSk7XG4gIHJldHVybiBzYWZlO1xufVxuXG4vKiogQHR5cGUge1dlYWtNYXA8e30sIEdlbmVyYXRvcjxhbnk+Pn0gKi9cbmNvbnN0IGdlbmVyYXRvcnMgPSBuZXcgTmF0aXZlV2Vha01hcCgpO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSVhcnJheWl0ZXJhdG9ycHJvdG90eXBlJS1vYmplY3QgKi9cbmNvbnN0IER1bW15QXJyYXlJdGVyYXRvclByb3RvdHlwZSA9IE9iamVjdENyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge1xuICBuZXh0OiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICBjb25zdCBnZW5lcmF0b3IgPSBXZWFrTWFwUHJvdG90eXBlR2V0KGdlbmVyYXRvcnMsIHRoaXMpO1xuICAgICAgcmV0dXJuIEdlbmVyYXRvclByb3RvdHlwZU5leHQoZ2VuZXJhdG9yKTtcbiAgICB9LFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgfSxcbn0pO1xuXG5mb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0T3duS2V5cyhBcnJheUl0ZXJhdG9yUHJvdG90eXBlKSkge1xuICAvLyBuZXh0IG1ldGhvZCBoYXMgYWxyZWFkeSBkZWZpbmVkXG4gIGlmIChrZXkgPT09IFwibmV4dFwiKSB7XG4gICAgY29udGludWU7XG4gIH1cblxuICAvLyBDb3B5IEFycmF5SXRlcmF0b3JQcm90b3R5cGUgZGVzY3JpcHRvcnMgdG8gRHVtbXlBcnJheUl0ZXJhdG9yUHJvdG90eXBlXG4gIE9iamVjdERlZmluZVByb3BlcnR5KER1bW15QXJyYXlJdGVyYXRvclByb3RvdHlwZSwga2V5LCBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEFycmF5SXRlcmF0b3JQcm90b3R5cGUsIGtleSkpO1xufVxuXG4vKipcbiAqIFdyYXAgdGhlIEdlbmVyYXRvciBhcm91bmQgdGhlIGR1bW15IEFycmF5SXRlcmF0b3JcbiAqXG4gKiBAdHlwZSB7PFQ+KGdlbmVyYXRvcjogR2VuZXJhdG9yPFQ+KSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFQ+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JhcChnZW5lcmF0b3IpIHtcbiAgY29uc3QgZHVtbXkgPSBPYmplY3RDcmVhdGUoRHVtbXlBcnJheUl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgV2Vha01hcFByb3RvdHlwZVNldChnZW5lcmF0b3JzLCBkdW1teSwgZ2VuZXJhdG9yKTtcbiAgcmV0dXJuIGR1bW15O1xufVxuIiwiaW1wb3J0IHtcbiAgQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoLFxuICBBcnJheUlzQXJyYXksXG4gIEFycmF5SXRlcmF0b3JQcm90b3R5cGUsXG4gIEFycmF5SXRlcmF0b3JQcm90b3R5cGVOZXh0LFxuICBNYXRoVHJ1bmMsXG4gIE5hdGl2ZUFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IsXG4gIE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyLFxuICBOYXRpdmVUeXBlZEFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IsXG4gIE51bWJlcklzRmluaXRlLFxuICBTaGFyZWRBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGgsXG4gIFN5bWJvbEl0ZXJhdG9yLFxuICBUeXBlZEFycmF5UHJvdG90eXBlR2V0U3ltYm9sVG9TdHJpbmdUYWcsXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyB7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiAoXG4gICAgKHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikgfHxcbiAgICB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICApO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyB7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiO1xufVxuXG4vLyBJbnNwaXJlZCBieSB1dGlsLnR5cGVzIGltcGxlbWVudGF0aW9uIG9mIE5vZGUuanNcbi8qKiBAdHlwZWRlZiB7VWludDhBcnJheXxVaW50OENsYW1wZWRBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxJbnQ4QXJyYXl8SW50MTZBcnJheXxJbnQzMkFycmF5fEZsb2F0MzJBcnJheXxGbG9hdDY0QXJyYXl8QmlnVWludDY0QXJyYXl8QmlnSW50NjRBcnJheX0gVHlwZWRBcnJheSAqL1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBUeXBlZEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOYXRpdmVUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBUeXBlZEFycmF5UHJvdG90eXBlR2V0U3ltYm9sVG9TdHJpbmdUYWcodmFsdWUpICE9PSB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIEJpZ0ludDY0QXJyYXl8QmlnVWludDY0QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05hdGl2ZUJpZ0ludFR5cGVkQXJyYXkodmFsdWUpIHtcbiAgY29uc3QgdHlwZWRBcnJheU5hbWUgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0U3ltYm9sVG9TdHJpbmdUYWcodmFsdWUpO1xuICByZXR1cm4gKFxuICAgIHR5cGVkQXJyYXlOYW1lID09PSBcIkJpZ0ludDY0QXJyYXlcIiB8fFxuICAgIHR5cGVkQXJyYXlOYW1lID09PSBcIkJpZ1VpbnQ2NEFycmF5XCJcbiAgKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgQXJyYXlCdWZmZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbHVlKSB7XG4gIHRyeSB7XG4gICAgQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoKC8qKiBAdHlwZSB7YW55fSAqLyAodmFsdWUpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBTaGFyZWRBcnJheUJ1ZmZlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhcmVkQXJyYXlCdWZmZXIodmFsdWUpIHtcbiAgaWYgKE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBTaGFyZWRBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGgoLyoqIEB0eXBlIHthbnl9ICovICh2YWx1ZSkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHVua25vd25bXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3JkaW5hcnlBcnJheSh2YWx1ZSkge1xuICBpZiAoIUFycmF5SXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBWZXJpZnkgdGhhdCB0aGVyZSBhcmUgbm8gY2hhbmdlcyBpbiBBcnJheUl0ZXJhdG9yXG4gIHJldHVybiAoXG4gICAgdmFsdWVbU3ltYm9sSXRlcmF0b3JdID09PSBOYXRpdmVBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yICYmXG4gICAgQXJyYXlJdGVyYXRvclByb3RvdHlwZS5uZXh0ID09PSBBcnJheUl0ZXJhdG9yUHJvdG90eXBlTmV4dFxuICApO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBUeXBlZEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPcmRpbmFyeU5hdGl2ZVR5cGVkQXJyYXkodmFsdWUpIHtcbiAgaWYgKCFpc05hdGl2ZVR5cGVkQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gVmVyaWZ5IHRoYXQgdGhlcmUgYXJlIG5vIGNoYW5nZXMgaW4gQXJyYXlJdGVyYXRvclxuICByZXR1cm4gKFxuICAgIHZhbHVlW1N5bWJvbEl0ZXJhdG9yXSA9PT0gTmF0aXZlVHlwZWRBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yICYmXG4gICAgQXJyYXlJdGVyYXRvclByb3RvdHlwZS5uZXh0ID09PSBBcnJheUl0ZXJhdG9yUHJvdG90eXBlTmV4dFxuICApO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgbnVtYmVyID0gK3ZhbHVlO1xuICBpZiAodmFsdWUgIT09IG51bWJlciArIFwiXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU51bWJlcklzRmluaXRlKG51bWJlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gbnVtYmVyID09PSBNYXRoVHJ1bmMobnVtYmVyKTtcbn1cbiIsImltcG9ydCB7IGlzT2JqZWN0LCBpc09iamVjdExpa2UgfSBmcm9tIFwiLi9pcy5tanNcIjtcbmltcG9ydCB7IFRIRV9DT05TVFJVQ1RPUl9QUk9QRVJUWV9WQUxVRV9JU19OT1RfQU5fT0JKRUNUIH0gZnJvbSBcIi4vbWVzc2FnZXMubWpzXCI7XG5pbXBvcnQgeyBOYXRpdmVUeXBlRXJyb3IsIFJlZmxlY3RHZXRQcm90b3R5cGVPZiwgUmVmbGVjdEhhcywgU3ltYm9sRm9yIH0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbmV4cG9ydCBjb25zdCBicmFuZCA9IFN5bWJvbEZvcihcIl9fRmxvYXQxNkFycmF5X19cIik7XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzRmxvYXQxNkFycmF5QnJhbmQodGFyZ2V0KSB7XG4gIGlmICghaXNPYmplY3RMaWtlKHRhcmdldCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBwcm90b3R5cGUgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcbiAgaWYgKCFpc09iamVjdExpa2UocHJvdG90eXBlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGNvbnN0cnVjdG9yID0gcHJvdG90eXBlLmNvbnN0cnVjdG9yO1xuICBpZiAoY29uc3RydWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KGNvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSEVfQ09OU1RSVUNUT1JfUFJPUEVSVFlfVkFMVUVfSVNfTk9UX0FOX09CSkVDVCk7XG4gIH1cblxuICByZXR1cm4gUmVmbGVjdEhhcyhjb25zdHJ1Y3RvciwgYnJhbmQpO1xufVxuIiwiLy8gYWxnb3JpdGhtOiBodHRwOi8vZm94LXRvb2xraXQub3JnL2Z0cC9mYXN0aGFsZmZsb2F0Y29udmVyc2lvbi5wZGZcblxuaW1wb3J0IHtcbiAgTmF0aXZlQXJyYXlCdWZmZXIsXG4gIE5hdGl2ZUZsb2F0MzJBcnJheSxcbiAgTmF0aXZlVWludDMyQXJyYXksXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG5jb25zdCBidWZmZXIgPSBuZXcgTmF0aXZlQXJyYXlCdWZmZXIoNCk7XG5jb25zdCBmbG9hdFZpZXcgPSBuZXcgTmF0aXZlRmxvYXQzMkFycmF5KGJ1ZmZlcik7XG5jb25zdCB1aW50MzJWaWV3ID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KGJ1ZmZlcik7XG5cbmNvbnN0IGJhc2VUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg1MTIpO1xuY29uc3Qgc2hpZnRUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg1MTIpO1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGNvbnN0IGUgPSBpIC0gMTI3O1xuXG4gIC8vIHZlcnkgc21hbGwgbnVtYmVyICgwLCAtMClcbiAgaWYgKGUgPCAtMjcpIHtcbiAgICBiYXNlVGFibGVbaV0gICAgICAgICA9IDB4MDAwMDtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAyNDtcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAyNDtcblxuICAvLyBzbWFsbCBudW1iZXIgKGRlbm9ybSlcbiAgfSBlbHNlIGlmIChlIDwgLTE0KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAgMHgwNDAwID4+ICgtZSAtIDE0KTtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9ICgweDA0MDAgPj4gKC1lIC0gMTQpKSB8IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAtZSAtIDE7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gLWUgLSAxO1xuXG4gIC8vIG5vcm1hbCBudW1iZXJcbiAgfSBlbHNlIGlmIChlIDw9IDE1KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAgKGUgKyAxNSkgPDwgMTA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAoKGUgKyAxNSkgPDwgMTApIHwgMHg4MDAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDEzO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDEzO1xuXG4gIC8vIGxhcmdlIG51bWJlciAoSW5maW5pdHksIC1JbmZpbml0eSlcbiAgfSBlbHNlIGlmIChlIDwgMTI4KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAweDdjMDA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweGZjMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gMjQ7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgLy8gc3RheSAoTmFOLCBJbmZpbml0eSwgLUluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gMHg3YzAwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDEzO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDEzO1xuICB9XG59XG5cbi8qKlxuICogcm91bmQgYSBudW1iZXIgdG8gYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzXG4gKlxuICogQHBhcmFtIHt1bmtub3dufSBudW0gLSBkb3VibGUgZmxvYXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kVG9GbG9hdDE2Qml0cyhudW0pIHtcbiAgZmxvYXRWaWV3WzBdID0gLyoqIEB0eXBlIHthbnl9ICovIChudW0pO1xuICBjb25zdCBmID0gdWludDMyVmlld1swXTtcbiAgY29uc3QgZSA9IChmID4+IDIzKSAmIDB4MWZmO1xuICByZXR1cm4gYmFzZVRhYmxlW2VdICsgKChmICYgMHgwMDdmZmZmZikgPj4gc2hpZnRUYWJsZVtlXSk7XG59XG5cbmNvbnN0IG1hbnRpc3NhVGFibGUgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoMjA0OCk7XG5jb25zdCBleHBvbmVudFRhYmxlID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KDY0KTtcbmNvbnN0IG9mZnNldFRhYmxlID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KDY0KTtcblxuZm9yIChsZXQgaSA9IDE7IGkgPCAxMDI0OyArK2kpIHtcbiAgbGV0IG0gPSBpIDw8IDEzOyAgICAvLyB6ZXJvIHBhZCBtYW50aXNzYSBiaXRzXG4gIGxldCBlID0gMDsgICAgICAgICAgLy8gemVybyBleHBvbmVudFxuXG4gIC8vIG5vcm1hbGl6ZWRcbiAgd2hpbGUoKG0gJiAweDAwODAwMDAwKSA9PT0gMCkge1xuICAgIG0gPDw9IDE7XG4gICAgZSAtPSAweDAwODAwMDAwOyAgLy8gZGVjcmVtZW50IGV4cG9uZW50XG4gIH1cblxuICBtICY9IH4weDAwODAwMDAwOyAgIC8vIGNsZWFyIGxlYWRpbmcgMSBiaXRcbiAgZSArPSAweDM4ODAwMDAwOyAgICAvLyBhZGp1c3QgYmlhc1xuXG4gIG1hbnRpc3NhVGFibGVbaV0gPSBtIHwgZTtcbn1cbmZvciAobGV0IGkgPSAxMDI0OyBpIDwgMjA0ODsgKytpKSB7XG4gIG1hbnRpc3NhVGFibGVbaV0gPSAweDM4MDAwMDAwICsgKChpIC0gMTAyNCkgPDwgMTMpO1xufVxuXG5mb3IgKGxldCBpID0gMTsgaSA8IDMxOyArK2kpIHtcbiAgZXhwb25lbnRUYWJsZVtpXSA9IGkgPDwgMjM7XG59XG5leHBvbmVudFRhYmxlWzMxXSA9IDB4NDc4MDAwMDA7XG5leHBvbmVudFRhYmxlWzMyXSA9IDB4ODAwMDAwMDA7XG5mb3IgKGxldCBpID0gMzM7IGkgPCA2MzsgKytpKSB7XG4gIGV4cG9uZW50VGFibGVbaV0gPSAweDgwMDAwMDAwICsgKChpIC0gMzIpIDw8IDIzKTtcbn1cbmV4cG9uZW50VGFibGVbNjNdID0gMHhjNzgwMDAwMDtcblxuZm9yIChsZXQgaSA9IDE7IGkgPCA2NDsgKytpKSB7XG4gIGlmIChpICE9PSAzMikge1xuICAgIG9mZnNldFRhYmxlW2ldID0gMTAyNDtcbiAgfVxufVxuXG4vKipcbiAqIGNvbnZlcnQgYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzIHRvIGEgbnVtYmVyXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGZsb2F0MTZiaXRzIC0gaGFsZiBmbG9hdCBudW1iZXIgYml0c1xuICogQHJldHVybnMge251bWJlcn0gZG91YmxlIGZsb2F0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHMpIHtcbiAgY29uc3QgbSA9IGZsb2F0MTZiaXRzID4+IDEwO1xuICB1aW50MzJWaWV3WzBdID0gbWFudGlzc2FUYWJsZVtvZmZzZXRUYWJsZVttXSArIChmbG9hdDE2Yml0cyAmIDB4M2ZmKV0gKyBleHBvbmVudFRhYmxlW21dO1xuICByZXR1cm4gZmxvYXRWaWV3WzBdO1xufVxuIiwiaW1wb3J0IHsgaXNPYmplY3QsIGlzU2hhcmVkQXJyYXlCdWZmZXIgfSBmcm9tIFwiLi9pcy5tanNcIjtcbmltcG9ydCB7XG4gIFRIRV9DT05TVFJVQ1RPUl9QUk9QRVJUWV9WQUxVRV9JU19OT1RfQU5fT0JKRUNULFxuICBUSElTX0lTX05PVF9BTl9PQkpFQ1QsXG59IGZyb20gXCIuL21lc3NhZ2VzLm1qc1wiO1xuaW1wb3J0IHtcbiAgQXJyYXlCdWZmZXJQcm90b3R5cGVTbGljZSxcbiAgTUFYX1NBRkVfSU5URUdFUixcbiAgTWF0aFRydW5jLFxuICBOYXRpdmVUeXBlRXJyb3IsXG4gIE51bWJlcklzTmFOLFxuICBPYmplY3RJcyxcbiAgU3ltYm9sU3BlY2llcyxcbn0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvaW50ZWdlcm9yaW5maW5pdHlcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gVG9JbnRlZ2VyT3JJbmZpbml0eSh0YXJnZXQpIHtcbiAgY29uc3QgbnVtYmVyID0gK3RhcmdldDtcblxuICBpZiAoTnVtYmVySXNOYU4obnVtYmVyKSB8fCBudW1iZXIgPT09IDApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiBNYXRoVHJ1bmMobnVtYmVyKTtcbn1cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9sZW5ndGhcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gVG9MZW5ndGgodGFyZ2V0KSB7XG4gIGNvbnN0IGxlbmd0aCA9IFRvSW50ZWdlck9ySW5maW5pdHkodGFyZ2V0KTtcbiAgaWYgKGxlbmd0aCA8IDApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiBsZW5ndGggPCBNQVhfU0FGRV9JTlRFR0VSXG4gICAgPyBsZW5ndGhcbiAgICA6IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXNwZWNpZXNjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtvYmplY3R9IHRhcmdldFxuICogQHBhcmFtIHt7IG5ldyguLi5hcmdzOiBhbnlbXSk6IGFueTsgfX0gZGVmYXVsdENvbnN0cnVjdG9yXG4gKiBAcmV0dXJucyB7eyBuZXcoLi4uYXJnczogYW55W10pOiBhbnk7IH19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBTcGVjaWVzQ29uc3RydWN0b3IodGFyZ2V0LCBkZWZhdWx0Q29uc3RydWN0b3IpIHtcbiAgaWYgKCFpc09iamVjdCh0YXJnZXQpKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFRISVNfSVNfTk9UX0FOX09CSkVDVCk7XG4gIH1cblxuICBjb25zdCBjb25zdHJ1Y3RvciA9IHRhcmdldC5jb25zdHJ1Y3RvcjtcbiAgaWYgKGNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZGVmYXVsdENvbnN0cnVjdG9yO1xuICB9XG4gIGlmICghaXNPYmplY3QoY29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFRIRV9DT05TVFJVQ1RPUl9QUk9QRVJUWV9WQUxVRV9JU19OT1RfQU5fT0JKRUNUKTtcbiAgfVxuXG4gIGNvbnN0IHNwZWNpZXMgPSBjb25zdHJ1Y3RvcltTeW1ib2xTcGVjaWVzXTtcbiAgaWYgKHNwZWNpZXMgPT0gbnVsbCkge1xuICAgIHJldHVybiBkZWZhdWx0Q29uc3RydWN0b3I7XG4gIH1cblxuICByZXR1cm4gc3BlY2llcztcbn1cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtaXNkZXRhY2hlZGJ1ZmZlclxuICogQHBhcmFtIHtBcnJheUJ1ZmZlckxpa2V9IGJ1ZmZlclxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikge1xuICBpZiAoaXNTaGFyZWRBcnJheUJ1ZmZlcihidWZmZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBBcnJheUJ1ZmZlclByb3RvdHlwZVNsaWNlKGJ1ZmZlciwgMCwgMCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGNhdGNoIChlKSB7LyogZW1wdHkgKi99XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogYmlnaW50IGNvbXBhcmlzb25zIGFyZSBub3Qgc3VwcG9ydGVkXG4gKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc29ydFxuICogQHBhcmFtIHtudW1iZXJ9IHhcbiAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gKiBAcmV0dXJucyB7LTEgfCAwIHwgMX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRDb21wYXJlKHgsIHkpIHtcbiAgY29uc3QgaXNYTmFOID0gTnVtYmVySXNOYU4oeCk7XG4gIGNvbnN0IGlzWU5hTiA9IE51bWJlcklzTmFOKHkpO1xuXG4gIGlmIChpc1hOYU4gJiYgaXNZTmFOKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAoaXNYTmFOKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICBpZiAoaXNZTmFOKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgaWYgKHggPCB5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgaWYgKHggPiB5KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICBpZiAoeCA9PT0gMCAmJiB5ID09PSAwKSB7XG4gICAgY29uc3QgaXNYUGx1c1plcm8gPSBPYmplY3RJcyh4LCAwKTtcbiAgICBjb25zdCBpc1lQbHVzWmVybyA9IE9iamVjdElzKHksIDApO1xuXG4gICAgaWYgKCFpc1hQbHVzWmVybyAmJiBpc1lQbHVzWmVybykge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChpc1hQbHVzWmVybyAmJiAhaXNZUGx1c1plcm8pIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAwO1xufVxuIiwiaW1wb3J0IHsgc2FmZUlmTmVlZGVkLCB3cmFwIH0gZnJvbSBcIi4vX3V0aWwvYXJyYXlJdGVyYXRvci5tanNcIjtcbmltcG9ydCB7IGJyYW5kLCBoYXNGbG9hdDE2QXJyYXlCcmFuZCB9IGZyb20gXCIuL191dGlsL2JyYW5kLm1qc1wiO1xuaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9fdXRpbC9jb252ZXJ0ZXIubWpzXCI7XG5pbXBvcnQge1xuICBpc0FycmF5QnVmZmVyLFxuICBpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyxcbiAgaXNOYXRpdmVCaWdJbnRUeXBlZEFycmF5LFxuICBpc05hdGl2ZVR5cGVkQXJyYXksXG4gIGlzT2JqZWN0LFxuICBpc09yZGluYXJ5QXJyYXksXG4gIGlzT3JkaW5hcnlOYXRpdmVUeXBlZEFycmF5LFxufSBmcm9tIFwiLi9fdXRpbC9pcy5tanNcIjtcbmltcG9ydCB7XG4gIEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSLFxuICBDQU5OT1RfQ09OVkVSVF9VTkRFRklORURfT1JfTlVMTF9UT19PQkpFQ1QsXG4gIENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFUyxcbiAgREVSSVZFRF9DT05TVFJVQ1RPUl9DUkVBVEVEX1RZUEVEQVJSQVlfT0JKRUNUX1dISUNIX1dBU19UT09fU01BTExfTEVOR1RILFxuICBJVEVSQVRPUl9QUk9QRVJUWV9JU19OT1RfQ0FMTEFCTEUsXG4gIE9GRlNFVF9JU19PVVRfT0ZfQk9VTkRTLFxuICBSRURVQ0VfT0ZfRU1QVFlfQVJSQVlfV0lUSF9OT19JTklUSUFMX1ZBTFVFLFxuICBTUEVDSUVTX0NPTlNUUlVDVE9SX0RJRE5UX1JFVFVSTl9UWVBFREFSUkFZX09CSkVDVCxcbiAgVEhFX0NPTVBBUklTT05fRlVOQ1RJT05fTVVTVF9CRV9FSVRIRVJfQV9GVU5DVElPTl9PUl9VTkRFRklORUQsXG4gIFRISVNfQ09OU1RSVUNUT1JfSVNfTk9UX0FfU1VCQ0xBU1NfT0ZfRkxPQVQxNkFSUkFZLFxuICBUSElTX0lTX05PVF9BX0ZMT0FUMTZBUlJBWV9PQkpFQ1QsXG59IGZyb20gXCIuL191dGlsL21lc3NhZ2VzLm1qc1wiO1xuaW1wb3J0IHtcbiAgQXJyYXlCdWZmZXJJc1ZpZXcsXG4gIEFycmF5UHJvdG90eXBlSm9pbixcbiAgQXJyYXlQcm90b3R5cGVQdXNoLFxuICBBcnJheVByb3RvdHlwZVRvTG9jYWxlU3RyaW5nLFxuICBOYXRpdmVBcnJheUJ1ZmZlcixcbiAgTmF0aXZlT2JqZWN0LFxuICBOYXRpdmVQcm94eSxcbiAgTmF0aXZlUmFuZ2VFcnJvcixcbiAgTmF0aXZlVHlwZUVycm9yLFxuICBOYXRpdmVVaW50MTZBcnJheSxcbiAgTmF0aXZlV2Vha01hcCxcbiAgTmF0aXZlV2Vha1NldCxcbiAgTnVtYmVySXNOYU4sXG4gIE9iamVjdERlZmluZVByb3BlcnR5LFxuICBPYmplY3RGcmVlemUsXG4gIE9iamVjdEhhc093bixcbiAgT2JqZWN0UHJvdG90eXBlX19sb29rdXBHZXR0ZXJfXyxcbiAgUmVmbGVjdEFwcGx5LFxuICBSZWZsZWN0Q29uc3RydWN0LFxuICBSZWZsZWN0RGVmaW5lUHJvcGVydHksXG4gIFJlZmxlY3RHZXQsXG4gIFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIFJlZmxlY3RIYXMsXG4gIFJlZmxlY3RPd25LZXlzLFxuICBSZWZsZWN0U2V0LFxuICBSZWZsZWN0U2V0UHJvdG90eXBlT2YsXG4gIFN5bWJvbEl0ZXJhdG9yLFxuICBTeW1ib2xUb1N0cmluZ1RhZyxcbiAgVHlwZWRBcnJheSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUNvcHlXaXRoaW4sXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVFbnRyaWVzLFxuICBUeXBlZEFycmF5UHJvdG90eXBlRmlsbCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcixcbiAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVLZXlzLFxuICBUeXBlZEFycmF5UHJvdG90eXBlUmV2ZXJzZSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVNldCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlLFxuICBUeXBlZEFycmF5UHJvdG90eXBlU29ydCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVN1YmFycmF5LFxuICBUeXBlZEFycmF5UHJvdG90eXBlVmFsdWVzLFxuICBVaW50MTZBcnJheUZyb20sXG4gIFdlYWtNYXBQcm90b3R5cGVHZXQsXG4gIFdlYWtNYXBQcm90b3R5cGVIYXMsXG4gIFdlYWtNYXBQcm90b3R5cGVTZXQsXG4gIFdlYWtTZXRQcm90b3R5cGVBZGQsXG4gIFdlYWtTZXRQcm90b3R5cGVIYXMsXG59IGZyb20gXCIuL191dGlsL3ByaW1vcmRpYWxzLm1qc1wiO1xuaW1wb3J0IHtcbiAgSXNEZXRhY2hlZEJ1ZmZlcixcbiAgU3BlY2llc0NvbnN0cnVjdG9yLFxuICBUb0ludGVnZXJPckluZmluaXR5LFxuICBUb0xlbmd0aCxcbiAgZGVmYXVsdENvbXBhcmUsXG59IGZyb20gXCIuL191dGlsL3NwZWMubWpzXCI7XG5cbmNvbnN0IEJZVEVTX1BFUl9FTEVNRU5UID0gMjtcblxuLyoqIEB0eXBlZGVmIHtVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfX0gRmxvYXQxNkJpdHNBcnJheSAqL1xuXG4vKiogQHR5cGUge1dlYWtNYXA8RmxvYXQxNkFycmF5LCBGbG9hdDE2Qml0c0FycmF5Pn0gKi9cbmNvbnN0IGZsb2F0MTZiaXRzQXJyYXlzID0gbmV3IE5hdGl2ZVdlYWtNYXAoKTtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge3RhcmdldCBpcyBGbG9hdDE2QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgcmV0dXJuIFdlYWtNYXBQcm90b3R5cGVIYXMoZmxvYXQxNmJpdHNBcnJheXMsIHRhcmdldCkgfHxcbiAgICAoIUFycmF5QnVmZmVySXNWaWV3KHRhcmdldCkgJiYgaGFzRmxvYXQxNkFycmF5QnJhbmQodGFyZ2V0KSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEByZXR1cm5zIHthc3NlcnRzIHRhcmdldCBpcyBGbG9hdDE2QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGFzc2VydEZsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgaWYgKCFpc0Zsb2F0MTZBcnJheSh0YXJnZXQpKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFRISVNfSVNfTk9UX0FfRkxPQVQxNkFSUkFZX09CSkVDVCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHBhcmFtIHtudW1iZXI9fSBjb3VudFxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge2Fzc2VydHMgdGFyZ2V0IGlzIFVpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDE2QXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheX1cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0U3BlY2llc1R5cGVkQXJyYXkodGFyZ2V0LCBjb3VudCkge1xuICBjb25zdCBpc1RhcmdldEZsb2F0MTZBcnJheSA9IGlzRmxvYXQxNkFycmF5KHRhcmdldCk7XG4gIGNvbnN0IGlzVGFyZ2V0VHlwZWRBcnJheSA9IGlzTmF0aXZlVHlwZWRBcnJheSh0YXJnZXQpO1xuXG4gIGlmICghaXNUYXJnZXRGbG9hdDE2QXJyYXkgJiYgIWlzVGFyZ2V0VHlwZWRBcnJheSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihTUEVDSUVTX0NPTlNUUlVDVE9SX0RJRE5UX1JFVFVSTl9UWVBFREFSUkFZX09CSkVDVCk7XG4gIH1cblxuICBpZiAodHlwZW9mIGNvdW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgbGV0IGxlbmd0aDtcbiAgICBpZiAoaXNUYXJnZXRGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRhcmdldCk7XG4gICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKHRhcmdldCk7XG4gICAgfVxuXG4gICAgaWYgKGxlbmd0aCA8IGNvdW50KSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIERFUklWRURfQ09OU1RSVUNUT1JfQ1JFQVRFRF9UWVBFREFSUkFZX09CSkVDVF9XSElDSF9XQVNfVE9PX1NNQUxMX0xFTkdUSFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoaXNOYXRpdmVCaWdJbnRUeXBlZEFycmF5KHRhcmdldCkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ0FOTk9UX01JWF9CSUdJTlRfQU5EX09USEVSX1RZUEVTKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7RmxvYXQxNkFycmF5fSBmbG9hdDE2XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcmV0dXJucyB7RmxvYXQxNkJpdHNBcnJheX1cbiAqL1xuZnVuY3Rpb24gZ2V0RmxvYXQxNkJpdHNBcnJheShmbG9hdDE2KSB7XG4gIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBXZWFrTWFwUHJvdG90eXBlR2V0KGZsb2F0MTZiaXRzQXJyYXlzLCBmbG9hdDE2KTtcbiAgaWYgKGZsb2F0MTZiaXRzQXJyYXkgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIpO1xuICAgIH1cblxuICAgIHJldHVybiBmbG9hdDE2Yml0c0FycmF5O1xuICB9XG5cbiAgLy8gZnJvbSBhbm90aGVyIEZsb2F0MTZBcnJheSBpbnN0YW5jZSAoYSBkaWZmZXJlbnQgdmVyc2lvbj8pXG4gIGNvbnN0IGJ1ZmZlciA9IC8qKiBAdHlwZSB7YW55fSAqLyAoZmxvYXQxNikuYnVmZmVyO1xuXG4gIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIpO1xuICB9XG5cbiAgY29uc3QgY2xvbmVkID0gUmVmbGVjdENvbnN0cnVjdChGbG9hdDE2QXJyYXksIFtcbiAgICBidWZmZXIsXG4gICAgLyoqIEB0eXBlIHthbnl9ICovIChmbG9hdDE2KS5ieXRlT2Zmc2V0LFxuICAgIC8qKiBAdHlwZSB7YW55fSAqLyAoZmxvYXQxNikubGVuZ3RoLFxuICBdLCBmbG9hdDE2LmNvbnN0cnVjdG9yKTtcbiAgcmV0dXJuIFdlYWtNYXBQcm90b3R5cGVHZXQoZmxvYXQxNmJpdHNBcnJheXMsIGNsb25lZCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtGbG9hdDE2Qml0c0FycmF5fSBmbG9hdDE2Yml0c0FycmF5XG4gKiBAcmV0dXJucyB7bnVtYmVyW119XG4gKi9cbmZ1bmN0aW9uIGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpIHtcbiAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICBjb25zdCBhcnJheSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgYXJyYXlbaV0gPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gIH1cblxuICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKiBAdHlwZSB7V2Vha1NldDxGdW5jdGlvbj59ICovXG5jb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0dGVycyA9IG5ldyBOYXRpdmVXZWFrU2V0KCk7XG5mb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0T3duS2V5cyhUeXBlZEFycmF5UHJvdG90eXBlKSkge1xuICAvLyBAQHRvU3RyaW5nVGFnIGdldHRlciBwcm9wZXJ0eSBpcyBkZWZpbmVkIGluIEZsb2F0MTZBcnJheS5wcm90b3R5cGVcbiAgaWYgKGtleSA9PT0gU3ltYm9sVG9TdHJpbmdUYWcpIHtcbiAgICBjb250aW51ZTtcbiAgfVxuXG4gIGNvbnN0IGRlc2NyaXB0b3IgPSBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFR5cGVkQXJyYXlQcm90b3R5cGUsIGtleSk7XG4gIGlmIChPYmplY3RIYXNPd24oZGVzY3JpcHRvciwgXCJnZXRcIikgJiYgdHlwZW9mIGRlc2NyaXB0b3IuZ2V0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBXZWFrU2V0UHJvdG90eXBlQWRkKFR5cGVkQXJyYXlQcm90b3R5cGVHZXR0ZXJzLCBkZXNjcmlwdG9yLmdldCk7XG4gIH1cbn1cblxuY29uc3QgaGFuZGxlciA9IE9iamVjdEZyZWV6ZSgvKiogQHR5cGUge1Byb3h5SGFuZGxlcjxGbG9hdDE2Qml0c0FycmF5Pn0gKi8gKHtcbiAgZ2V0KHRhcmdldCwga2V5LCByZWNlaXZlcikge1xuICAgIGlmIChpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyhrZXkpICYmIE9iamVjdEhhc093bih0YXJnZXQsIGtleSkpIHtcbiAgICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoUmVmbGVjdEdldCh0YXJnZXQsIGtleSkpO1xuICAgIH1cblxuICAgIC8vICVUeXBlZEFycmF5JS5wcm90b3R5cGUgZ2V0dGVyIHByb3BlcnRpZXMgY2Fubm90IGNhbGxlZCBieSBQcm94eSByZWNlaXZlclxuICAgIGlmIChXZWFrU2V0UHJvdG90eXBlSGFzKFR5cGVkQXJyYXlQcm90b3R5cGVHZXR0ZXJzLCBPYmplY3RQcm90b3R5cGVfX2xvb2t1cEdldHRlcl9fKHRhcmdldCwga2V5KSkpIHtcbiAgICAgIHJldHVybiBSZWZsZWN0R2V0KHRhcmdldCwga2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVmbGVjdEdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpO1xuICB9LFxuXG4gIHNldCh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgaWYgKGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKGtleSkgJiYgT2JqZWN0SGFzT3duKHRhcmdldCwga2V5KSkge1xuICAgICAgcmV0dXJuIFJlZmxlY3RTZXQodGFyZ2V0LCBrZXksIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0U2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpO1xuICB9LFxuXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkge1xuICAgIGlmIChpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyhrZXkpICYmIE9iamVjdEhhc093bih0YXJnZXQsIGtleSkpIHtcbiAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZGVzY3JpcHRvci52YWx1ZSk7XG4gICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gIH0sXG5cbiAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgICBpZiAoXG4gICAgICBpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyhrZXkpICYmXG4gICAgICBPYmplY3RIYXNPd24odGFyZ2V0LCBrZXkpICYmXG4gICAgICBPYmplY3RIYXNPd24oZGVzY3JpcHRvciwgXCJ2YWx1ZVwiKVxuICAgICkge1xuICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhkZXNjcmlwdG9yLnZhbHVlKTtcbiAgICAgIHJldHVybiBSZWZsZWN0RGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0RGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpO1xuICB9LFxufSkpO1xuXG5leHBvcnQgY2xhc3MgRmxvYXQxNkFycmF5IHtcbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10eXBlZGFycmF5ICovXG4gIGNvbnN0cnVjdG9yKGlucHV0LCBfYnl0ZU9mZnNldCwgX2xlbmd0aCkge1xuICAgIC8qKiBAdHlwZSB7RmxvYXQxNkJpdHNBcnJheX0gKi9cbiAgICBsZXQgZmxvYXQxNmJpdHNBcnJheTtcblxuICAgIGlmIChpc0Zsb2F0MTZBcnJheShpbnB1dCkpIHtcbiAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBbZ2V0RmxvYXQxNkJpdHNBcnJheShpbnB1dCldLCBuZXcudGFyZ2V0KTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGlucHV0KSAmJiAhaXNBcnJheUJ1ZmZlcihpbnB1dCkpIHsgLy8gb2JqZWN0IHdpdGhvdXQgQXJyYXlCdWZmZXJcbiAgICAgIC8qKiBAdHlwZSB7QXJyYXlMaWtlPHVua25vd24+fSAqL1xuICAgICAgbGV0IGxpc3Q7XG4gICAgICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgICAgIGxldCBsZW5ndGg7XG5cbiAgICAgIGlmIChpc05hdGl2ZVR5cGVkQXJyYXkoaW5wdXQpKSB7IC8vIFR5cGVkQXJyYXlcbiAgICAgICAgbGlzdCA9IGlucHV0O1xuICAgICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGlucHV0KTtcblxuICAgICAgICBjb25zdCBidWZmZXIgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGlucHV0KTtcblxuICAgICAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc05hdGl2ZUJpZ0ludFR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFUyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhID0gbmV3IE5hdGl2ZUFycmF5QnVmZmVyKFxuICAgICAgICAgIGxlbmd0aCAqIEJZVEVTX1BFUl9FTEVNRU5UXG4gICAgICAgICk7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBbZGF0YV0sIG5ldy50YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaXRlcmF0b3IgPSBpbnB1dFtTeW1ib2xJdGVyYXRvcl07XG4gICAgICAgIGlmIChpdGVyYXRvciAhPSBudWxsICYmIHR5cGVvZiBpdGVyYXRvciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKElURVJBVE9SX1BST1BFUlRZX0lTX05PVF9DQUxMQUJMRSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlcmF0b3IgIT0gbnVsbCkgeyAvLyBJdGVyYWJsZSAoQXJyYXkpXG4gICAgICAgICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgICAgICAgIGlmIChpc09yZGluYXJ5QXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBsaXN0ID0gaW5wdXQ7XG4gICAgICAgICAgICBsZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgICAgICAgbGlzdCA9IFsuLi4gLyoqIEB0eXBlIHtJdGVyYWJsZTx1bmtub3duPn0gKi8gKGlucHV0KV07XG4gICAgICAgICAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIEFycmF5TGlrZVxuICAgICAgICAgIGxpc3QgPSAvKiogQHR5cGUge0FycmF5TGlrZTx1bmtub3duPn0gKi8gKGlucHV0KTtcbiAgICAgICAgICBsZW5ndGggPSBUb0xlbmd0aChsaXN0Lmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgZmxvYXQxNmJpdHNBcnJheSA9IFJlZmxlY3RDb25zdHJ1Y3QoTmF0aXZlVWludDE2QXJyYXksIFtsZW5ndGhdLCBuZXcudGFyZ2V0KTtcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHZhbHVlc1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBmbG9hdDE2Yml0c0FycmF5W2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGxpc3RbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIHByaW1pdGl2ZSwgQXJyYXlCdWZmZXJcbiAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBhcmd1bWVudHMsIG5ldy50YXJnZXQpO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7RmxvYXQxNkFycmF5fSAqL1xuICAgIGNvbnN0IHByb3h5ID0gLyoqIEB0eXBlIHthbnl9ICovIChuZXcgTmF0aXZlUHJveHkoZmxvYXQxNmJpdHNBcnJheSwgaGFuZGxlcikpO1xuXG4gICAgLy8gcHJveHkgcHJpdmF0ZSBzdG9yYWdlXG4gICAgV2Vha01hcFByb3RvdHlwZVNldChmbG9hdDE2Yml0c0FycmF5cywgcHJveHksIGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgcmV0dXJuIHByb3h5O1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGbG9hdDE2QXJyYXkpYCBvciBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgIGluY2x1ZGUgdGhpcyBrZXlcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5mcm9tXG4gICAqL1xuICBzdGF0aWMgZnJvbShzcmMsIC4uLm9wdHMpIHtcbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICBpZiAoIVJlZmxlY3RIYXMoQ29uc3RydWN0b3IsIGJyYW5kKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGlmIChpc0Zsb2F0MTZBcnJheShzcmMpICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHNyYyk7XG4gICAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBOYXRpdmVVaW50MTZBcnJheShcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSlcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihUeXBlZEFycmF5UHJvdG90eXBlU2xpY2UodWludDE2KSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgICAgICBVaW50MTZBcnJheUZyb20oc3JjLCByb3VuZFRvRmxvYXQxNkJpdHMpXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXBGdW5jID0gb3B0c1swXTtcbiAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzFdO1xuXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgICBVaW50MTZBcnJheUZyb20oc3JjLCBmdW5jdGlvbiAodmFsLCAuLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gcm91bmRUb0Zsb2F0MTZCaXRzKFxuICAgICAgICAgICAgICBSZWZsZWN0QXBwbHkobWFwRnVuYywgdGhpcywgW3ZhbCwgLi4uc2FmZUlmTmVlZGVkKGFyZ3MpXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSwgdGhpc0FyZylcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvKiogQHR5cGUge0FycmF5TGlrZTx1bmtub3duPn0gKi9cbiAgICBsZXQgbGlzdDtcbiAgICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgICBsZXQgbGVuZ3RoO1xuXG4gICAgY29uc3QgaXRlcmF0b3IgPSBzcmNbU3ltYm9sSXRlcmF0b3JdO1xuICAgIGlmIChpdGVyYXRvciAhPSBudWxsICYmIHR5cGVvZiBpdGVyYXRvciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoSVRFUkFUT1JfUFJPUEVSVFlfSVNfTk9UX0NBTExBQkxFKTtcbiAgICB9XG5cbiAgICBpZiAoaXRlcmF0b3IgIT0gbnVsbCkgeyAvLyBJdGVyYWJsZSAoVHlwZWRBcnJheSwgQXJyYXkpXG4gICAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgICBpZiAoaXNPcmRpbmFyeUFycmF5KHNyYykpIHtcbiAgICAgICAgbGlzdCA9IHNyYztcbiAgICAgICAgbGVuZ3RoID0gc3JjLmxlbmd0aDtcbiAgICAgIH0gZWxzZSBpZiAoaXNPcmRpbmFyeU5hdGl2ZVR5cGVkQXJyYXkoc3JjKSkge1xuICAgICAgICBsaXN0ID0gc3JjO1xuICAgICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKHNyYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgICAgICAgbGlzdCA9IFsuLi5zcmNdO1xuICAgICAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyBBcnJheUxpa2VcbiAgICAgIGlmIChzcmMgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgICAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBsaXN0ID0gTmF0aXZlT2JqZWN0KHNyYyk7XG4gICAgICBsZW5ndGggPSBUb0xlbmd0aChsaXN0Lmxlbmd0aCk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBhcnJheVtpXSA9IC8qKiBAdHlwZSB7bnVtYmVyfSAqLyAobGlzdFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1hcEZ1bmMgPSBvcHRzWzBdO1xuICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMV07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gUmVmbGVjdEFwcGx5KG1hcEZ1bmMsIHRoaXNBcmcsIFtsaXN0W2ldLCBpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGbG9hdDE2QXJyYXkpYCBvciBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgIGluY2x1ZGUgdGhpcyBrZXlcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5vZlxuICAgKi9cbiAgc3RhdGljIG9mKC4uLml0ZW1zKSB7XG4gICAgY29uc3QgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgaWYgKCFSZWZsZWN0SGFzKENvbnN0cnVjdG9yLCBicmFuZCkpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgbGVuZ3RoID0gaXRlbXMubGVuZ3RoO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBwcm94eSA9IG5ldyBGbG9hdDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHByb3h5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBmbG9hdDE2Yml0c0FycmF5W2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGl0ZW1zW2ldKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH1cblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBhcnJheVtpXSA9IGl0ZW1zW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5rZXlzICovXG4gIGtleXMoKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgcmV0dXJuIFR5cGVkQXJyYXlQcm90b3R5cGVLZXlzKGZsb2F0MTZiaXRzQXJyYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IHJldHVybnMgYSBvYmplY3Qgd2hvc2UgcHJvdG90eXBlIGlzIG5vdCBgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlYFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS52YWx1ZXNcbiAgICovXG4gIHZhbHVlcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gd3JhcCgoZnVuY3Rpb24qICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgZm9yIChjb25zdCB2YWwgb2YgVHlwZWRBcnJheVByb3RvdHlwZVZhbHVlcyhmbG9hdDE2Yml0c0FycmF5KSkge1xuICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiByZXR1cm5zIGEgb2JqZWN0IHdob3NlIHByb3RvdHlwZSBpcyBub3QgYCVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJWBcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZW50cmllc1xuICAgKi9cbiAgZW50cmllcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gd3JhcCgoZnVuY3Rpb24qICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgZm9yIChjb25zdCBbaSwgdmFsXSBvZiBUeXBlZEFycmF5UHJvdG90eXBlRW50cmllcyhmbG9hdDE2Yml0c0FycmF5KSkge1xuICAgICAgICB5aWVsZCAvKiogQHR5cGUge1tOdW1iZXIsIG51bWJlcl19ICovIChbaSwgY29udmVydFRvTnVtYmVyKHZhbCldKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5hdCAqL1xuICBhdChpbmRleCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgcmVsYXRpdmVJbmRleCA9IFRvSW50ZWdlck9ySW5maW5pdHkoaW5kZXgpO1xuICAgIGNvbnN0IGsgPSByZWxhdGl2ZUluZGV4ID49IDAgPyByZWxhdGl2ZUluZGV4IDogbGVuZ3RoICsgcmVsYXRpdmVJbmRleDtcblxuICAgIGlmIChrIDwgMCB8fCBrID49IGxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtrXSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtY2hhbmdlLWFycmF5LWJ5LWNvcHkvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLndpdGggKi9cbiAgd2l0aChpbmRleCwgdmFsdWUpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHJlbGF0aXZlSW5kZXggPSBUb0ludGVnZXJPckluZmluaXR5KGluZGV4KTtcbiAgICBjb25zdCBrID0gcmVsYXRpdmVJbmRleCA+PSAwID8gcmVsYXRpdmVJbmRleCA6IGxlbmd0aCArIHJlbGF0aXZlSW5kZXg7XG5cbiAgICBjb25zdCBudW1iZXIgPSArdmFsdWU7XG5cbiAgICBpZiAoayA8IDAgfHwgayA+PSBsZW5ndGgpIHtcbiAgICAgIHRocm93IE5hdGl2ZVJhbmdlRXJyb3IoT0ZGU0VUX0lTX09VVF9PRl9CT1VORFMpO1xuICAgIH1cblxuICAgIC8vIGRvbid0IHVzZSBTcGVjaWVzQ29uc3RydWN0b3JcbiAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgKTtcbiAgICBjb25zdCBjbG9uZWQgPSBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlKHVpbnQxNilcbiAgICAgIClcbiAgICApO1xuICAgIGNvbnN0IGFycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShjbG9uZWQpO1xuXG4gICAgYXJyYXlba10gPSByb3VuZFRvRmxvYXQxNkJpdHMobnVtYmVyKTtcblxuICAgIHJldHVybiBjbG9uZWQ7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUubWFwICovXG4gIG1hcChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBwcm94eSA9IG5ldyBGbG9hdDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgIGNvbnN0IGFycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShwcm94eSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgICBhcnJheVtpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhcbiAgICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSwgbGVuZ3RoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGFycmF5W2ldID0gUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdmFsLCBpLCB0aGlzXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbHRlciAqL1xuICBmaWx0ZXIoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgY29uc3Qga2VwdCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKSkge1xuICAgICAgICBBcnJheVByb3RvdHlwZVB1c2goa2VwdCwgdmFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGtlcHQpO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5KTtcblxuICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKGFycmF5KTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5yZWR1Y2UgKi9cbiAgcmVkdWNlKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbMF0pO1xuICAgICAgc3RhcnQgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soXG4gICAgICAgIGFjY3VtdWxhdG9yLFxuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJlZHVjZXJpZ2h0ICovXG4gIHJlZHVjZVJpZ2h0KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbbGVuZ3RoIC0gMV0pO1xuICAgICAgc3RhcnQgPSBsZW5ndGggLSAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IGxlbmd0aCAtIDE7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpID49IDA7IC0taSkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjYWxsYmFjayhcbiAgICAgICAgYWNjdW11bGF0b3IsXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgaSxcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZm9yZWFjaCAqL1xuICBmb3JFYWNoKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW1xuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXMsXG4gICAgICBdKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZCAqL1xuICBmaW5kKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kaW5kZXggKi9cbiAgZmluZEluZGV4KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLWFycmF5LWZpbmQtZnJvbS1sYXN0L2luZGV4Lmh0bWwjc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZGxhc3QgKi9cbiAgZmluZExhc3QoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtYXJyYXktZmluZC1mcm9tLWxhc3QvaW5kZXguaHRtbCNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kbGFzdGluZGV4ICovXG4gIGZpbmRMYXN0SW5kZXgoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5ldmVyeSAqL1xuICBldmVyeShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoXG4gICAgICAgICFSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICBdKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb21lICovXG4gIHNvbWUoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKFxuICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICBdKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zZXQgKi9cbiAgc2V0KGlucHV0LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGFyZ2V0T2Zmc2V0ID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAodGFyZ2V0T2Zmc2V0IDwgMCkge1xuICAgICAgdGhyb3cgTmF0aXZlUmFuZ2VFcnJvcihPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyk7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0ID09IG51bGwpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpc05hdGl2ZUJpZ0ludFR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFU1xuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KGlucHV0KSkge1xuICAgICAgLy8gcGVlbCBvZmYgUHJveHlcbiAgICAgIHJldHVybiBUeXBlZEFycmF5UHJvdG90eXBlU2V0KFxuICAgICAgICBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpLFxuICAgICAgICBnZXRGbG9hdDE2Qml0c0FycmF5KGlucHV0KSxcbiAgICAgICAgdGFyZ2V0T2Zmc2V0XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpc05hdGl2ZVR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGlucHV0KTtcbiAgICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRMZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgY29uc3Qgc3JjID0gTmF0aXZlT2JqZWN0KGlucHV0KTtcbiAgICBjb25zdCBzcmNMZW5ndGggPSBUb0xlbmd0aChzcmMubGVuZ3RoKTtcblxuICAgIGlmICh0YXJnZXRPZmZzZXQgPT09IEluZmluaXR5IHx8IHNyY0xlbmd0aCArIHRhcmdldE9mZnNldCA+IHRhcmdldExlbmd0aCkge1xuICAgICAgdGhyb3cgTmF0aXZlUmFuZ2VFcnJvcihPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcmNMZW5ndGg7ICsraSkge1xuICAgICAgZmxvYXQxNmJpdHNBcnJheVtpICsgdGFyZ2V0T2Zmc2V0XSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhzcmNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5yZXZlcnNlICovXG4gIHJldmVyc2UoKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgVHlwZWRBcnJheVByb3RvdHlwZVJldmVyc2UoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9wcm9wb3NhbC1jaGFuZ2UtYXJyYXktYnktY29weS8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUudG9SZXZlcnNlZCAqL1xuICB0b1JldmVyc2VkKCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIC8vIGRvbid0IHVzZSBTcGVjaWVzQ29uc3RydWN0b3JcbiAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgKTtcbiAgICBjb25zdCBjbG9uZWQgPSBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlKHVpbnQxNilcbiAgICAgIClcbiAgICApO1xuXG4gICAgY29uc3QgY2xvbmVkRmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkoY2xvbmVkKTtcbiAgICBUeXBlZEFycmF5UHJvdG90eXBlUmV2ZXJzZShjbG9uZWRGbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIHJldHVybiBjbG9uZWQ7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmlsbCAqL1xuICBmaWxsKHZhbHVlLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgVHlwZWRBcnJheVByb3RvdHlwZUZpbGwoXG4gICAgICBmbG9hdDE2Yml0c0FycmF5LFxuICAgICAgcm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSxcbiAgICAgIC4uLnNhZmVJZk5lZWRlZChvcHRzKVxuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5jb3B5d2l0aGluICovXG4gIGNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVDb3B5V2l0aGluKGZsb2F0MTZiaXRzQXJyYXksIHRhcmdldCwgc3RhcnQsIC4uLnNhZmVJZk5lZWRlZChvcHRzKSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb3J0ICovXG4gIHNvcnQoY29tcGFyZUZuKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3Qgc29ydENvbXBhcmUgPSBjb21wYXJlRm4gIT09IHVuZGVmaW5lZCA/IGNvbXBhcmVGbiA6IGRlZmF1bHRDb21wYXJlO1xuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVTb3J0KGZsb2F0MTZiaXRzQXJyYXksICh4LCB5KSA9PiB7XG4gICAgICByZXR1cm4gc29ydENvbXBhcmUoY29udmVydFRvTnVtYmVyKHgpLCBjb252ZXJ0VG9OdW1iZXIoeSkpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtY2hhbmdlLWFycmF5LWJ5LWNvcHkvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnRvU29ydGVkICovXG4gIHRvU29ydGVkKGNvbXBhcmVGbikge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGlmIChjb21wYXJlRm4gIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgY29tcGFyZUZuICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBOYXRpdmVUeXBlRXJyb3IoVEhFX0NPTVBBUklTT05fRlVOQ1RJT05fTVVTVF9CRV9FSVRIRVJfQV9GVU5DVElPTl9PUl9VTkRFRklORUQpO1xuICAgIH1cbiAgICBjb25zdCBzb3J0Q29tcGFyZSA9IGNvbXBhcmVGbiAhPT0gdW5kZWZpbmVkID8gY29tcGFyZUZuIDogZGVmYXVsdENvbXBhcmU7XG5cbiAgICAvLyBkb24ndCB1c2UgU3BlY2llc0NvbnN0cnVjdG9yXG4gICAgY29uc3QgdWludDE2ID0gbmV3IE5hdGl2ZVVpbnQxNkFycmF5KFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KVxuICAgICk7XG4gICAgY29uc3QgY2xvbmVkID0gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSh1aW50MTYpXG4gICAgICApXG4gICAgKTtcblxuICAgIGNvbnN0IGNsb25lZEZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KGNsb25lZCk7XG4gICAgVHlwZWRBcnJheVByb3RvdHlwZVNvcnQoY2xvbmVkRmxvYXQxNmJpdHNBcnJheSwgKHgsIHkpID0+IHtcbiAgICAgIHJldHVybiBzb3J0Q29tcGFyZShjb252ZXJ0VG9OdW1iZXIoeCksIGNvbnZlcnRUb051bWJlcih5KSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY2xvbmVkO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNsaWNlICovXG4gIHNsaWNlKHN0YXJ0LCBlbmQpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgICApO1xuICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlKHVpbnQxNiwgc3RhcnQsIGVuZClcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHJlbGF0aXZlU3RhcnQgPSBUb0ludGVnZXJPckluZmluaXR5KHN0YXJ0KTtcbiAgICBjb25zdCByZWxhdGl2ZUVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogVG9JbnRlZ2VyT3JJbmZpbml0eShlbmQpO1xuXG4gICAgbGV0IGs7XG4gICAgaWYgKHJlbGF0aXZlU3RhcnQgPT09IC1JbmZpbml0eSkge1xuICAgICAgayA9IDA7XG4gICAgfSBlbHNlIGlmIChyZWxhdGl2ZVN0YXJ0IDwgMCkge1xuICAgICAgayA9IGxlbmd0aCArIHJlbGF0aXZlU3RhcnQgPiAwID8gbGVuZ3RoICsgcmVsYXRpdmVTdGFydCA6IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGsgPSBsZW5ndGggPCByZWxhdGl2ZVN0YXJ0ID8gbGVuZ3RoIDogcmVsYXRpdmVTdGFydDtcbiAgICB9XG5cbiAgICBsZXQgZmluYWw7XG4gICAgaWYgKHJlbGF0aXZlRW5kID09PSAtSW5maW5pdHkpIHtcbiAgICAgIGZpbmFsID0gMDtcbiAgICB9IGVsc2UgaWYgKHJlbGF0aXZlRW5kIDwgMCkge1xuICAgICAgZmluYWwgPSBsZW5ndGggKyByZWxhdGl2ZUVuZCA+IDAgPyBsZW5ndGggKyByZWxhdGl2ZUVuZCA6IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbmFsID0gbGVuZ3RoIDwgcmVsYXRpdmVFbmQgPyBsZW5ndGggOiByZWxhdGl2ZUVuZDtcbiAgICB9XG5cbiAgICBjb25zdCBjb3VudCA9IGZpbmFsIC0gayA+IDAgPyBmaW5hbCAtIGsgOiAwO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGNvdW50KTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSwgY291bnQpO1xuXG4gICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIpO1xuICAgIH1cblxuICAgIGxldCBuID0gMDtcbiAgICB3aGlsZSAoayA8IGZpbmFsKSB7XG4gICAgICBhcnJheVtuXSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2tdKTtcbiAgICAgICsraztcbiAgICAgICsrbjtcbiAgICB9XG5cbiAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChhcnJheSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc3ViYXJyYXkgKi9cbiAgc3ViYXJyYXkoYmVnaW4sIGVuZCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG5cbiAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgKTtcbiAgICBjb25zdCB1aW50MTZTdWJhcnJheSA9IFR5cGVkQXJyYXlQcm90b3R5cGVTdWJhcnJheSh1aW50MTYsIGJlZ2luLCBlbmQpO1xuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKHVpbnQxNlN1YmFycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KHVpbnQxNlN1YmFycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgodWludDE2U3ViYXJyYXkpXG4gICAgKTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSk7XG5cbiAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChhcnJheSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuaW5kZXhvZiAqL1xuICBpbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgbGV0IGZyb20gPSBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pO1xuICAgIGlmIChmcm9tID09PSBJbmZpbml0eSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgZnJvbSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKFxuICAgICAgICBPYmplY3RIYXNPd24oZmxvYXQxNmJpdHNBcnJheSwgaSkgJiZcbiAgICAgICAgY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pID09PSBlbGVtZW50XG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmxhc3RpbmRleG9mICovXG4gIGxhc3RJbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgbGV0IGZyb20gPSBvcHRzLmxlbmd0aCA+PSAxID8gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKSA6IGxlbmd0aCAtIDE7XG4gICAgaWYgKGZyb20gPT09IC1JbmZpbml0eSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChmcm9tID49IDApIHtcbiAgICAgIGZyb20gPSBmcm9tIDwgbGVuZ3RoIC0gMSA/IGZyb20gOiBsZW5ndGggLSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgT2JqZWN0SGFzT3duKGZsb2F0MTZiaXRzQXJyYXksIGkpICYmXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSA9PT0gZWxlbWVudFxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5pbmNsdWRlcyAqL1xuICBpbmNsdWRlcyhlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAoZnJvbSA9PT0gSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGlzTmFOID0gTnVtYmVySXNOYU4oZWxlbWVudCk7XG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG5cbiAgICAgIGlmIChpc05hTiAmJiBOdW1iZXJJc05hTih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuam9pbiAqL1xuICBqb2luKHNlcGFyYXRvcikge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGFycmF5ID0gY29weVRvQXJyYXkoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICByZXR1cm4gQXJyYXlQcm90b3R5cGVKb2luKGFycmF5LCBzZXBhcmF0b3IpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnRvbG9jYWxlc3RyaW5nICovXG4gIHRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgcmV0dXJuIEFycmF5UHJvdG90eXBlVG9Mb2NhbGVTdHJpbmcoYXJyYXksIC4uLnNhZmVJZk5lZWRlZChvcHRzKSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWdldC0ldHlwZWRhcnJheSUucHJvdG90eXBlLUBAdG9zdHJpbmd0YWcgKi9cbiAgZ2V0IFtTeW1ib2xUb1N0cmluZ1RhZ10oKSB7XG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KHRoaXMpKSB7XG4gICAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChcIkZsb2F0MTZBcnJheVwiKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10eXBlZGFycmF5LmJ5dGVzX3Blcl9lbGVtZW50ICovXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXksIFwiQllURVNfUEVSX0VMRU1FTlRcIiwge1xuICB2YWx1ZTogQllURVNfUEVSX0VMRU1FTlQsXG59KTtcblxuLy8gbGltaXRhdGlvbjogSXQgaXMgcGVha2VkIGJ5IGBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKEZsb2F0MTZBcnJheSlgIGFuZCBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXksIGJyYW5kLCB7fSk7XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtcHJvcGVydGllcy1vZi10aGUtdHlwZWRhcnJheS1jb25zdHJ1Y3RvcnMgKi9cblJlZmxlY3RTZXRQcm90b3R5cGVPZihGbG9hdDE2QXJyYXksIFR5cGVkQXJyYXkpO1xuXG5jb25zdCBGbG9hdDE2QXJyYXlQcm90b3R5cGUgPSBGbG9hdDE2QXJyYXkucHJvdG90eXBlO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXR5cGVkYXJyYXkucHJvdG90eXBlLmJ5dGVzX3Blcl9lbGVtZW50ICovXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXlQcm90b3R5cGUsIFwiQllURVNfUEVSX0VMRU1FTlRcIiwge1xuICB2YWx1ZTogQllURVNfUEVSX0VMRU1FTlQsXG59KTtcblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLUBAaXRlcmF0b3IgKi9cbk9iamVjdERlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheVByb3RvdHlwZSwgU3ltYm9sSXRlcmF0b3IsIHtcbiAgdmFsdWU6IEZsb2F0MTZBcnJheVByb3RvdHlwZS52YWx1ZXMsXG4gIHdyaXRhYmxlOiB0cnVlLFxuICBjb25maWd1cmFibGU6IHRydWUsXG59KTtcblxuUmVmbGVjdFNldFByb3RvdHlwZU9mKEZsb2F0MTZBcnJheVByb3RvdHlwZSwgVHlwZWRBcnJheVByb3RvdHlwZSk7XG4iLCJpbXBvcnQgeyBpc0Zsb2F0MTZBcnJheSB9IGZyb20gXCIuL0Zsb2F0MTZBcnJheS5tanNcIjtcbmltcG9ydCB7IGlzTmF0aXZlVHlwZWRBcnJheSB9IGZyb20gXCIuL191dGlsL2lzLm1qc1wiO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVWludDhBcnJheXxVaW50OENsYW1wZWRBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxJbnQ4QXJyYXl8SW50MTZBcnJheXxJbnQzMkFycmF5fEZsb2F0MTZBcnJheXxGbG9hdDMyQXJyYXl8RmxvYXQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fEJpZ0ludDY0QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1R5cGVkQXJyYXkodGFyZ2V0KSB7XG4gIHJldHVybiBpc05hdGl2ZVR5cGVkQXJyYXkodGFyZ2V0KSB8fCBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpO1xufVxuIiwiaW1wb3J0IHsgc2FmZUlmTmVlZGVkIH0gZnJvbSBcIi4vX3V0aWwvYXJyYXlJdGVyYXRvci5tanNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHtcbiAgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYsXG4gIERhdGFWaWV3UHJvdG90eXBlU2V0VWludDE2LFxufSBmcm9tIFwiLi9fdXRpbC9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiByZXR1cm5zIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlld1xuICpcbiAqIEBwYXJhbSB7RGF0YVZpZXd9IGRhdGFWaWV3XG4gKiBAcGFyYW0ge251bWJlcn0gYnl0ZU9mZnNldFxuICogQHBhcmFtIHtbYm9vbGVhbl19IG9wdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCAuLi5vcHRzKSB7XG4gIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoXG4gICAgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIC4uLnNhZmVJZk5lZWRlZChvcHRzKSlcbiAgKTtcbn1cblxuLyoqXG4gKiBzdG9yZXMgYW4gdW5zaWduZWQgMTYtYml0IGZsb2F0IHZhbHVlIGF0IHRoZSBzcGVjaWZpZWQgYnl0ZSBvZmZzZXQgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIERhdGFWaWV3XG4gKlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCB2YWx1ZSwgLi4ub3B0cykge1xuICByZXR1cm4gRGF0YVZpZXdQcm90b3R5cGVTZXRVaW50MTYoXG4gICAgZGF0YVZpZXcsXG4gICAgYnl0ZU9mZnNldCxcbiAgICByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpLFxuICAgIC4uLnNhZmVJZk5lZWRlZChvcHRzKVxuICApO1xufVxuIiwiaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9fdXRpbC9jb252ZXJ0ZXIubWpzXCI7XG5pbXBvcnQgeyBOdW1iZXJJc0Zpbml0ZSB9IGZyb20gXCIuL191dGlsL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKipcbiAqIHJldHVybnMgdGhlIG5lYXJlc3QgaGFsZi1wcmVjaXNpb24gZmxvYXQgcmVwcmVzZW50YXRpb24gb2YgYSBudW1iZXJcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0geFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhmcm91bmQoeCkge1xuICBjb25zdCBudW1iZXIgPSAreDtcblxuICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gIGlmICghTnVtYmVySXNGaW5pdGUobnVtYmVyKSB8fCBudW1iZXIgPT09IDApIHtcbiAgICByZXR1cm4gbnVtYmVyO1xuICB9XG5cbiAgY29uc3QgeDE2ID0gcm91bmRUb0Zsb2F0MTZCaXRzKG51bWJlcik7XG4gIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoeDE2KTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztFQUFPLE1BQU0scUJBQXFCLEdBQUcsdUJBQXVCLENBQUM7RUFDdEQsTUFBTSxpQ0FBaUMsR0FBRyxtQ0FBbUMsQ0FBQztFQUM5RSxNQUFNLGtEQUFrRDtFQUMvRCxFQUFFLG9EQUFvRCxDQUFDO0VBQ2hELE1BQU0sK0NBQStDO0VBQzVE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
