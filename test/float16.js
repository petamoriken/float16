/*! @petamoriken/float16 v3.6.1-20-g7bc8131 | MIT License - https://git.io/float16 */

const float16 = (function (exports) {
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
  const CANNOT_CONVERT_A_BIGINT_VALUE_TO_A_NUMBER =
    "Cannot convert a BigInt value to a number";
  const CANNOT_MIX_BIGINT_AND_OTHER_TYPES =
    "Cannot mix BigInt and other types, use explicit conversions";
  const ITERATOR_PROPERTY_IS_NOT_CALLABLE = "@@iterator property is not callable";
  const REDUCE_OF_EMPTY_ARRAY_WITH_NO_INITIAL_VALUE =
    "Reduce of empty array with no initial value";
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
  const NativeNumber = Number;
  const {
    isFinite: NumberIsFinite,
    isNaN: NumberIsNaN,
  } = NativeNumber;
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
        if (descriptor !== undefined && ObjectHasOwn(descriptor, "get")) {
          return descriptor.get;
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
  const WEakSetPrototype = NativeWeakSet.prototype;
  const WeakSetPrototypeAdd = uncurryThis(WEakSetPrototype.add);
  const WeakSetPrototypeHas = uncurryThis(WEakSetPrototype.has);
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
    if (array[SymbolIterator] === NativeArrayPrototypeSymbolIterator) {
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
    return (value !== null && typeof value === "object") ||
      typeof value === "function";
  }
  function isObjectLike(value) {
    return value !== null && typeof value === "object";
  }
  function isNativeTypedArray(value) {
    return TypedArrayPrototypeGetSymbolToStringTag(value) !== undefined;
  }
  function isNativeBigIntTypedArray(value) {
    const typedArrayName = TypedArrayPrototypeGetSymbolToStringTag(value);
    return typedArrayName === "BigInt64Array" ||
      typedArrayName === "BigUint64Array";
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
    if (value[SymbolIterator] === NativeArrayPrototypeSymbolIterator) {
      return true;
    }
    const iterator = value[SymbolIterator]();
    return iterator[SymbolToStringTag] === "Array Iterator";
  }
  function isOrdinaryNativeTypedArray(value) {
    if (!isNativeTypedArray(value)) {
      return false;
    }
    if (value[SymbolIterator] === NativeTypedArrayPrototypeSymbolIterator) {
      return true;
    }
    const iterator = value[SymbolIterator]();
    return iterator[SymbolToStringTag] === "Array Iterator";
  }
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

  const MAX_SAFE_INTEGER = NativeNumber.MAX_SAFE_INTEGER;
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
    if (ObjectHasOwn(descriptor, "get")) {
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
          const BufferConstructor = !isSharedArrayBuffer(buffer)
            ?  (SpeciesConstructor(
              buffer,
              NativeArrayBuffer
            ))
            : NativeArrayBuffer;
          if (IsDetachedBuffer(buffer)) {
            throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
          }
          if (isNativeBigIntTypedArray(input)) {
            throw NativeTypeError(CANNOT_MIX_BIGINT_AND_OTHER_TYPES);
          }
          const data = new BufferConstructor(
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
    sort(...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      const compare = opts[0] !== undefined ? opts[0] : defaultCompare;
      TypedArrayPrototypeSort(float16bitsArray, (x, y) => {
        return compare(convertToNumber(x), convertToNumber(y));
      });
      return this;
    }
    slice(...opts) {
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
            TypedArrayPrototypeSlice(uint16, ...safeIfNeeded(opts))
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
      return  (array);
    }
    subarray(...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);
      const uint16 = new NativeUint16Array(
        TypedArrayPrototypeGetBuffer(float16bitsArray),
        TypedArrayPrototypeGetByteOffset(float16bitsArray),
        TypedArrayPrototypeGetLength(float16bitsArray)
      );
      const uint16Subarray = TypedArrayPrototypeSubarray(uint16, ...safeIfNeeded(opts));
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
    join(...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      const array = copyToArray(float16bitsArray);
      return ArrayPrototypeJoin(array, ...safeIfNeeded(opts));
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

  function hfround(num) {
    if (typeof num === "bigint") {
      throw NativeTypeError(CANNOT_CONVERT_A_BIGINT_VALUE_TO_A_NUMBER);
    }
    num = NativeNumber(num);
    if (!NumberIsFinite(num) || num === 0) {
      return num;
    }
    const x16 = roundToFloat16Bits(num);
    return convertToNumber(x16);
  }

  exports.Float16Array = Float16Array;
  exports.getFloat16 = getFloat16;
  exports.hfround = hfround;
  exports.isFloat16Array = isFloat16Array;
  exports.isTypedArray = isTypedArray;
  exports.setFloat16 = setFloat16;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXQxNi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL191dGlsL21lc3NhZ2VzLm1qcyIsIi4uL3NyYy9fdXRpbC9wcmltb3JkaWFscy5tanMiLCIuLi9zcmMvX3V0aWwvYXJyYXlJdGVyYXRvci5tanMiLCIuLi9zcmMvX3V0aWwvaXMubWpzIiwiLi4vc3JjL191dGlsL2JyYW5kLm1qcyIsIi4uL3NyYy9fdXRpbC9jb252ZXJ0ZXIubWpzIiwiLi4vc3JjL191dGlsL3NwZWMubWpzIiwiLi4vc3JjL0Zsb2F0MTZBcnJheS5tanMiLCIuLi9zcmMvaXNUeXBlZEFycmF5Lm1qcyIsIi4uL3NyYy9EYXRhVmlldy5tanMiLCIuLi9zcmMvaGZyb3VuZC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFRISVNfSVNfTk9UX0FOX09CSkVDVCA9IFwiVGhpcyBpcyBub3QgYW4gb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgVEhJU19JU19OT1RfQV9GTE9BVDE2QVJSQVlfT0JKRUNUID0gXCJUaGlzIGlzIG5vdCBhIEZsb2F0MTZBcnJheSBvYmplY3RcIjtcbmV4cG9ydCBjb25zdCBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWSA9XG4gIFwiVGhpcyBjb25zdHJ1Y3RvciBpcyBub3QgYSBzdWJjbGFzcyBvZiBGbG9hdDE2QXJyYXlcIjtcbmV4cG9ydCBjb25zdCBUSEVfQ09OU1RSVUNUT1JfUFJPUEVSVFlfVkFMVUVfSVNfTk9UX0FOX09CSkVDVCA9XG4gIFwiVGhlIGNvbnN0cnVjdG9yIHByb3BlcnR5IHZhbHVlIGlzIG5vdCBhbiBvYmplY3RcIjtcbmV4cG9ydCBjb25zdCBTUEVDSUVTX0NPTlNUUlVDVE9SX0RJRE5UX1JFVFVSTl9UWVBFREFSUkFZX09CSkVDVCA9XG4gIFwiU3BlY2llcyBjb25zdHJ1Y3RvciBkaWRuJ3QgcmV0dXJuIFR5cGVkQXJyYXkgb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgREVSSVZFRF9DT05TVFJVQ1RPUl9DUkVBVEVEX1RZUEVEQVJSQVlfT0JKRUNUX1dISUNIX1dBU19UT09fU01BTExfTEVOR1RIID1cbiAgXCJEZXJpdmVkIGNvbnN0cnVjdG9yIGNyZWF0ZWQgVHlwZWRBcnJheSBvYmplY3Qgd2hpY2ggd2FzIHRvbyBzbWFsbCBsZW5ndGhcIjtcbmV4cG9ydCBjb25zdCBBVFRFTVBUSU5HX1RPX0FDQ0VTU19ERVRBQ0hFRF9BUlJBWUJVRkZFUiA9XG4gIFwiQXR0ZW1wdGluZyB0byBhY2Nlc3MgZGV0YWNoZWQgQXJyYXlCdWZmZXJcIjtcbmV4cG9ydCBjb25zdCBDQU5OT1RfQ09OVkVSVF9VTkRFRklORURfT1JfTlVMTF9UT19PQkpFQ1QgPVxuICBcIkNhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IENBTk5PVF9DT05WRVJUX0FfQklHSU5UX1ZBTFVFX1RPX0FfTlVNQkVSID1cbiAgXCJDYW5ub3QgY29udmVydCBhIEJpZ0ludCB2YWx1ZSB0byBhIG51bWJlclwiO1xuZXhwb3J0IGNvbnN0IENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFUyA9XG4gIFwiQ2Fubm90IG1peCBCaWdJbnQgYW5kIG90aGVyIHR5cGVzLCB1c2UgZXhwbGljaXQgY29udmVyc2lvbnNcIjtcbmV4cG9ydCBjb25zdCBJVEVSQVRPUl9QUk9QRVJUWV9JU19OT1RfQ0FMTEFCTEUgPSBcIkBAaXRlcmF0b3IgcHJvcGVydHkgaXMgbm90IGNhbGxhYmxlXCI7XG5leHBvcnQgY29uc3QgUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSA9XG4gIFwiUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZVwiO1xuZXhwb3J0IGNvbnN0IE9GRlNFVF9JU19PVVRfT0ZfQk9VTkRTID0gXCJPZmZzZXQgaXMgb3V0IG9mIGJvdW5kc1wiO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzLCBuby1yZXN0cmljdGVkLXN5bnRheCAqL1xuLyogZ2xvYmFsIFNoYXJlZEFycmF5QnVmZmVyICovXG5cbmltcG9ydCB7IENBTk5PVF9DT05WRVJUX1VOREVGSU5FRF9PUl9OVUxMX1RPX09CSkVDVCB9IGZyb20gXCIuL21lc3NhZ2VzLm1qc1wiO1xuXG4vKiogQHR5cGUgezxUIGV4dGVuZHMgKC4uLmFyZ3M6IGFueSkgPT4gYW55Pih0YXJnZXQ6IFQpID0+ICh0aGlzQXJnOiBUaGlzVHlwZTxUPiwgLi4uYXJnczogYW55W10pID0+IGFueX0gKi9cbmZ1bmN0aW9uIHVuY3VycnlUaGlzKHRhcmdldCkge1xuICByZXR1cm4gKHRoaXNBcmcsIC4uLmFyZ3MpID0+IHtcbiAgICByZXR1cm4gUmVmbGVjdEFwcGx5KHRhcmdldCwgdGhpc0FyZywgYXJncyk7XG4gIH07XG59XG5cbi8qKiBAdHlwZSB7KHRhcmdldDogYW55LCBrZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4gKHRoaXNBcmc6IGFueSwgLi4uYXJnczogYW55W10pID0+IGFueX0gKi9cbmZ1bmN0aW9uIHVuY3VycnlUaGlzR2V0dGVyKHRhcmdldCwga2V5KSB7XG4gIHJldHVybiB1bmN1cnJ5VGhpcyhcbiAgICBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgICAgdGFyZ2V0LFxuICAgICAga2V5XG4gICAgKS5nZXRcbiAgKTtcbn1cblxuLy8gUmVmbGVjdFxuZXhwb3J0IGNvbnN0IHtcbiAgYXBwbHk6IFJlZmxlY3RBcHBseSxcbiAgY29uc3RydWN0OiBSZWZsZWN0Q29uc3RydWN0LFxuICBkZWZpbmVQcm9wZXJ0eTogUmVmbGVjdERlZmluZVByb3BlcnR5LFxuICBnZXQ6IFJlZmxlY3RHZXQsXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgZ2V0UHJvdG90eXBlT2Y6IFJlZmxlY3RHZXRQcm90b3R5cGVPZixcbiAgaGFzOiBSZWZsZWN0SGFzLFxuICBvd25LZXlzOiBSZWZsZWN0T3duS2V5cyxcbiAgc2V0OiBSZWZsZWN0U2V0LFxuICBzZXRQcm90b3R5cGVPZjogUmVmbGVjdFNldFByb3RvdHlwZU9mLFxufSA9IFJlZmxlY3Q7XG5cbi8vIFByb3h5XG5leHBvcnQgY29uc3QgTmF0aXZlUHJveHkgPSBQcm94eTtcblxuLy8gTnVtYmVyXG5leHBvcnQgY29uc3QgTmF0aXZlTnVtYmVyID0gTnVtYmVyO1xuZXhwb3J0IGNvbnN0IHtcbiAgaXNGaW5pdGU6IE51bWJlcklzRmluaXRlLFxuICBpc05hTjogTnVtYmVySXNOYU4sXG59ID0gTmF0aXZlTnVtYmVyO1xuXG4vLyBTeW1ib2xcbmV4cG9ydCBjb25zdCB7XG4gIGl0ZXJhdG9yOiBTeW1ib2xJdGVyYXRvcixcbiAgc3BlY2llczogU3ltYm9sU3BlY2llcyxcbiAgdG9TdHJpbmdUYWc6IFN5bWJvbFRvU3RyaW5nVGFnLFxuICBmb3I6IFN5bWJvbEZvcixcbn0gPSBTeW1ib2w7XG5cbi8vIE9iamVjdFxuZXhwb3J0IGNvbnN0IE5hdGl2ZU9iamVjdCA9IE9iamVjdDtcbmV4cG9ydCBjb25zdCB7XG4gIGNyZWF0ZTogT2JqZWN0Q3JlYXRlLFxuICBkZWZpbmVQcm9wZXJ0eTogT2JqZWN0RGVmaW5lUHJvcGVydHksXG4gIGZyZWV6ZTogT2JqZWN0RnJlZXplLFxuICBpczogT2JqZWN0SXMsXG59ID0gTmF0aXZlT2JqZWN0O1xuY29uc3QgT2JqZWN0UHJvdG90eXBlID0gTmF0aXZlT2JqZWN0LnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KG9iamVjdDogb2JqZWN0LCBrZXk6IFByb3BlcnR5S2V5KSA9PiBhbnl9ICovXG5leHBvcnQgY29uc3QgT2JqZWN0UHJvdG90eXBlX19sb29rdXBHZXR0ZXJfXyA9IC8qKiBAdHlwZSB7YW55fSAqLyAoT2JqZWN0UHJvdG90eXBlKS5fX2xvb2t1cEdldHRlcl9fXG4gID8gdW5jdXJyeVRoaXMoLyoqIEB0eXBlIHthbnl9ICovIChPYmplY3RQcm90b3R5cGUpLl9fbG9va3VwR2V0dGVyX18pXG4gIDogKG9iamVjdCwga2V5KSA9PiB7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIENBTk5PVF9DT05WRVJUX1VOREVGSU5FRF9PUl9OVUxMX1RPX09CSkVDVFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgdGFyZ2V0ID0gTmF0aXZlT2JqZWN0KG9iamVjdCk7XG4gICAgZG8ge1xuICAgICAgY29uc3QgZGVzY3JpcHRvciA9IFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuICAgICAgaWYgKGRlc2NyaXB0b3IgIT09IHVuZGVmaW5lZCAmJiBPYmplY3RIYXNPd24oZGVzY3JpcHRvciwgXCJnZXRcIikpIHtcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IuZ2V0O1xuICAgICAgfVxuICAgIH0gd2hpbGUgKCh0YXJnZXQgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YodGFyZ2V0KSkgIT09IG51bGwpO1xuICB9O1xuLyoqIEB0eXBlIHsob2JqZWN0OiBvYmplY3QsIGtleTogUHJvcGVydHlLZXkpID0+IGJvb2xlYW59ICovXG5leHBvcnQgY29uc3QgT2JqZWN0SGFzT3duID0gLyoqIEB0eXBlIHthbnl9ICovIChOYXRpdmVPYmplY3QpLmhhc093biB8fFxuICB1bmN1cnJ5VGhpcyhPYmplY3RQcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuXG4vLyBBcnJheVxuY29uc3QgTmF0aXZlQXJyYXkgPSBBcnJheTtcbmV4cG9ydCBjb25zdCBBcnJheUlzQXJyYXkgPSBOYXRpdmVBcnJheS5pc0FycmF5O1xuY29uc3QgQXJyYXlQcm90b3R5cGUgPSBOYXRpdmVBcnJheS5wcm90b3R5cGU7XG4vKiogQHR5cGUgeyhhcnJheTogQXJyYXlMaWtlPHVua25vd24+LCBzZXBhcmF0b3I/OiBzdHJpbmcpID0+IHN0cmluZ30gKi9cbmV4cG9ydCBjb25zdCBBcnJheVByb3RvdHlwZUpvaW4gPSB1bmN1cnJ5VGhpcyhBcnJheVByb3RvdHlwZS5qb2luKTtcbi8qKiBAdHlwZSB7PFQ+KGFycmF5OiBUW10sIC4uLml0ZW1zOiBUW10pID0+IG51bWJlcn0gKi9cbmV4cG9ydCBjb25zdCBBcnJheVByb3RvdHlwZVB1c2ggPSB1bmN1cnJ5VGhpcyhBcnJheVByb3RvdHlwZS5wdXNoKTtcbi8qKiBAdHlwZSB7KGFycmF5OiBBcnJheUxpa2U8dW5rbm93bj4sIC4uLm9wdHM6IGFueVtdKSA9PiBzdHJpbmd9ICovXG5leHBvcnQgY29uc3QgQXJyYXlQcm90b3R5cGVUb0xvY2FsZVN0cmluZyA9IHVuY3VycnlUaGlzKFxuICBBcnJheVByb3RvdHlwZS50b0xvY2FsZVN0cmluZ1xuKTtcbmV4cG9ydCBjb25zdCBOYXRpdmVBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yID0gQXJyYXlQcm90b3R5cGVbU3ltYm9sSXRlcmF0b3JdO1xuLyoqIEB0eXBlIHs8VD4oYXJyYXk6IFRbXSkgPT4gSXRlcmFibGVJdGVyYXRvcjxUPn0gKi9cbmV4cG9ydCBjb25zdCBBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yID0gdW5jdXJyeVRoaXMoTmF0aXZlQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvcik7XG5cbi8vIE1hdGhcbmV4cG9ydCBjb25zdCBNYXRoVHJ1bmMgPSBNYXRoLnRydW5jO1xuXG4vLyBBcnJheUJ1ZmZlclxuZXhwb3J0IGNvbnN0IE5hdGl2ZUFycmF5QnVmZmVyID0gQXJyYXlCdWZmZXI7XG5leHBvcnQgY29uc3QgQXJyYXlCdWZmZXJJc1ZpZXcgPSBOYXRpdmVBcnJheUJ1ZmZlci5pc1ZpZXc7XG5jb25zdCBBcnJheUJ1ZmZlclByb3RvdHlwZSA9IE5hdGl2ZUFycmF5QnVmZmVyLnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KGJ1ZmZlcjogQXJyYXlCdWZmZXIsIGJlZ2luPzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IG51bWJlcn0gKi9cbmV4cG9ydCBjb25zdCBBcnJheUJ1ZmZlclByb3RvdHlwZVNsaWNlID0gdW5jdXJyeVRoaXMoQXJyYXlCdWZmZXJQcm90b3R5cGUuc2xpY2UpO1xuLyoqIEB0eXBlIHsoYnVmZmVyOiBBcnJheUJ1ZmZlcikgPT4gQXJyYXlCdWZmZXJ9ICovXG5leHBvcnQgY29uc3QgQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoID0gdW5jdXJyeVRoaXNHZXR0ZXIoQXJyYXlCdWZmZXJQcm90b3R5cGUsIFwiYnl0ZUxlbmd0aFwiKTtcblxuLy8gU2hhcmVkQXJyYXlCdWZmZXJcbmV4cG9ydCBjb25zdCBOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlciA9IHR5cGVvZiBTaGFyZWRBcnJheUJ1ZmZlciAhPT0gXCJ1bmRlZmluZWRcIiA/IFNoYXJlZEFycmF5QnVmZmVyIDogbnVsbDtcbi8qKiBAdHlwZSB7KGJ1ZmZlcjogU2hhcmVkQXJyYXlCdWZmZXIpID0+IFNoYXJlZEFycmF5QnVmZmVyfSAqL1xuZXhwb3J0IGNvbnN0IFNoYXJlZEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCA9IE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyXG4gICYmIHVuY3VycnlUaGlzR2V0dGVyKE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyLnByb3RvdHlwZSwgXCJieXRlTGVuZ3RoXCIpO1xuXG4vLyBUeXBlZEFycmF5XG4vKiogQHR5cGVkZWYge1VpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDMyQXJyYXl8RmxvYXQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fEJpZ0ludDY0QXJyYXl9IFR5cGVkQXJyYXkgKi9cbi8qKiBAdHlwZSB7YW55fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXkgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YoVWludDhBcnJheSk7XG5jb25zdCBUeXBlZEFycmF5RnJvbSA9IFR5cGVkQXJyYXkuZnJvbTtcbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlID0gVHlwZWRBcnJheS5wcm90b3R5cGU7XG5leHBvcnQgY29uc3QgTmF0aXZlVHlwZWRBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yID0gVHlwZWRBcnJheVByb3RvdHlwZVtTeW1ib2xJdGVyYXRvcl07XG4vKiogQHR5cGUgeyh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBJdGVyYWJsZUl0ZXJhdG9yPG51bWJlcj59ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUtleXMgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLmtleXMpO1xuLyoqIEB0eXBlIHsodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gSXRlcmFibGVJdGVyYXRvcjxudW1iZXI+fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVWYWx1ZXMgPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS52YWx1ZXNcbik7XG4vKiogQHR5cGUgeyh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFtudW1iZXIsIG51bWJlcl0+fSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVFbnRyaWVzID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUuZW50cmllc1xuKTtcbi8qKiBAdHlwZSB7KHR5cGVkQXJyYXk6IFR5cGVkQXJyYXksIGFycmF5OiBBcnJheUxpa2U8bnVtYmVyPiwgb2Zmc2V0PzogbnVtYmVyKSA9PiB2b2lkfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVTZXQgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLnNldCk7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCkgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlUmV2ZXJzZSA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLnJldmVyc2Vcbik7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgdmFsdWU6IG51bWJlciwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlRmlsbCA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUuZmlsbCk7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgdGFyZ2V0OiBudW1iZXIsIHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlQ29weVdpdGhpbiA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLmNvcHlXaXRoaW5cbik7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgY29tcGFyZUZuPzogKGE6IG51bWJlciwgYjogbnVtYmVyKSA9PiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVNvcnQgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLnNvcnQpO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIFR5cGVkQXJyYXk+KHR5cGVkQXJyYXk6IFQsIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IFR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5zbGljZSk7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlU3ViYXJyYXkgPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS5zdWJhcnJheVxuKTtcbi8qKiBAdHlwZSB7KCh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBBcnJheUJ1ZmZlcil9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlciA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBcImJ1ZmZlclwiXG4pO1xuLyoqIEB0eXBlIHsoKHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IG51bWJlcil9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQgPSB1bmN1cnJ5VGhpc0dldHRlcihcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgXCJieXRlT2Zmc2V0XCJcbik7XG4vKiogQHR5cGUgeygodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gbnVtYmVyKX0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoID0gdW5jdXJyeVRoaXNHZXR0ZXIoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUsXG4gIFwibGVuZ3RoXCJcbik7XG4vKiogQHR5cGUgeyh0YXJnZXQ6IHVua25vd24pID0+IHN0cmluZ30gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0U3ltYm9sVG9TdHJpbmdUYWcgPSB1bmN1cnJ5VGhpc0dldHRlcihcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgU3ltYm9sVG9TdHJpbmdUYWdcbik7XG5cbi8vIFVpbnQxNkFycmF5XG5leHBvcnQgY29uc3QgTmF0aXZlVWludDE2QXJyYXkgPSBVaW50MTZBcnJheTtcbi8qKiBAdHlwZSB7VWludDE2QXJyYXlDb25zdHJ1Y3RvcltcImZyb21cIl19ICovXG5leHBvcnQgY29uc3QgVWludDE2QXJyYXlGcm9tID0gKC4uLmFyZ3MpID0+IHtcbiAgcmV0dXJuIFJlZmxlY3RBcHBseShUeXBlZEFycmF5RnJvbSwgTmF0aXZlVWludDE2QXJyYXksIGFyZ3MpO1xufTtcblxuLy8gVWludDMyQXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVVaW50MzJBcnJheSA9IFVpbnQzMkFycmF5O1xuXG4vLyBGbG9hdDMyQXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVGbG9hdDMyQXJyYXkgPSBGbG9hdDMyQXJyYXk7XG5cbi8vIEFycmF5SXRlcmF0b3Jcbi8qKiBAdHlwZSB7YW55fSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5SXRlcmF0b3JQcm90b3R5cGUgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YoW11bU3ltYm9sSXRlcmF0b3JdKCkpO1xuLyoqIEB0eXBlIHs8VD4oYXJyYXlJdGVyYXRvcjogSXRlcmFibGVJdGVyYXRvcjxUPikgPT4gSXRlcmF0b3JSZXN1bHQ8VD59ICovXG5leHBvcnQgY29uc3QgQXJyYXlJdGVyYXRvclByb3RvdHlwZU5leHQgPSB1bmN1cnJ5VGhpcyhBcnJheUl0ZXJhdG9yUHJvdG90eXBlLm5leHQpO1xuXG4vLyBHZW5lcmF0b3Jcbi8qKiBAdHlwZSB7PFQgPSB1bmtub3duLCBUUmV0dXJuID0gYW55LCBUTmV4dCA9IHVua25vd24+KGdlbmVyYXRvcjogR2VuZXJhdG9yPFQsIFRSZXR1cm4sIFROZXh0PiwgdmFsdWU/OiBUTmV4dCkgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBHZW5lcmF0b3JQcm90b3R5cGVOZXh0ID0gdW5jdXJyeVRoaXMoKGZ1bmN0aW9uKiAoKSB7fSkoKS5uZXh0KTtcblxuLy8gSXRlcmF0b3JcbmV4cG9ydCBjb25zdCBJdGVyYXRvclByb3RvdHlwZSA9IFJlZmxlY3RHZXRQcm90b3R5cGVPZihBcnJheUl0ZXJhdG9yUHJvdG90eXBlKTtcblxuLy8gRGF0YVZpZXdcbmNvbnN0IERhdGFWaWV3UHJvdG90eXBlID0gRGF0YVZpZXcucHJvdG90eXBlO1xuLyoqIEB0eXBlIHsoZGF0YVZpZXc6IERhdGFWaWV3LCBieXRlT2Zmc2V0OiBudW1iZXIsIGxpdHRsZUVuZGlhbj86IGJvb2xlYW4pID0+IG51bWJlcn0gKi9cbmV4cG9ydCBjb25zdCBEYXRhVmlld1Byb3RvdHlwZUdldFVpbnQxNiA9IHVuY3VycnlUaGlzKFxuICBEYXRhVmlld1Byb3RvdHlwZS5nZXRVaW50MTZcbik7XG4vKiogQHR5cGUgeyhkYXRhVmlldzogRGF0YVZpZXcsIGJ5dGVPZmZzZXQ6IG51bWJlciwgdmFsdWU6IG51bWJlciwgbGl0dGxlRW5kaWFuPzogYm9vbGVhbikgPT4gdm9pZH0gKi9cbmV4cG9ydCBjb25zdCBEYXRhVmlld1Byb3RvdHlwZVNldFVpbnQxNiA9IHVuY3VycnlUaGlzKFxuICBEYXRhVmlld1Byb3RvdHlwZS5zZXRVaW50MTZcbik7XG5cbi8vIEVycm9yXG5leHBvcnQgY29uc3QgTmF0aXZlVHlwZUVycm9yID0gVHlwZUVycm9yO1xuZXhwb3J0IGNvbnN0IE5hdGl2ZVJhbmdlRXJyb3IgPSBSYW5nZUVycm9yO1xuXG4vLyBXZWFrU2V0XG4vKipcbiAqIERvIG5vdCBjb25zdHJ1Y3Qgd2l0aCBhcmd1bWVudHMgdG8gYXZvaWQgY2FsbGluZyB0aGUgXCJhZGRcIiBtZXRob2RcbiAqXG4gKiBAdHlwZSB7e25ldyA8VCBleHRlbmRzIHt9PigpOiBXZWFrU2V0PFQ+fX1cbiAqL1xuZXhwb3J0IGNvbnN0IE5hdGl2ZVdlYWtTZXQgPSBXZWFrU2V0O1xuY29uc3QgV0Vha1NldFByb3RvdHlwZSA9IE5hdGl2ZVdlYWtTZXQucHJvdG90eXBlO1xuLyoqIEB0eXBlIHs8VCBleHRlbmRzIHt9PihzZXQ6IFdlYWtTZXQ8VD4sIHZhbHVlOiBUKSA9PiBTZXQ8VD59ICovXG5leHBvcnQgY29uc3QgV2Vha1NldFByb3RvdHlwZUFkZCA9IHVuY3VycnlUaGlzKFdFYWtTZXRQcm90b3R5cGUuYWRkKTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyB7fT4oc2V0OiBXZWFrU2V0PFQ+LCB2YWx1ZTogVCkgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBXZWFrU2V0UHJvdG90eXBlSGFzID0gdW5jdXJyeVRoaXMoV0Vha1NldFByb3RvdHlwZS5oYXMpO1xuXG4vLyBXZWFrTWFwXG4vKipcbiAqIERvIG5vdCBjb25zdHJ1Y3Qgd2l0aCBhcmd1bWVudHMgdG8gYXZvaWQgY2FsbGluZyB0aGUgXCJzZXRcIiBtZXRob2RcbiAqXG4gKiBAdHlwZSB7e25ldyA8SyBleHRlbmRzIHt9LCBWPigpOiBXZWFrTWFwPEssIFY+fX1cbiAqL1xuZXhwb3J0IGNvbnN0IE5hdGl2ZVdlYWtNYXAgPSBXZWFrTWFwO1xuY29uc3QgV2Vha01hcFByb3RvdHlwZSA9IE5hdGl2ZVdlYWtNYXAucHJvdG90eXBlO1xuLyoqIEB0eXBlIHs8SyBleHRlbmRzIHt9LCBWPih3ZWFrTWFwOiBXZWFrTWFwPEssIFY+LCBrZXk6IEspID0+IFZ9ICovXG5leHBvcnQgY29uc3QgV2Vha01hcFByb3RvdHlwZUdldCA9IHVuY3VycnlUaGlzKFdlYWtNYXBQcm90b3R5cGUuZ2V0KTtcbi8qKiBAdHlwZSB7PEsgZXh0ZW5kcyB7fSwgVj4od2Vha01hcDogV2Vha01hcDxLLCBWPiwga2V5OiBLKSA9PiBib29sZWFufSAqL1xuZXhwb3J0IGNvbnN0IFdlYWtNYXBQcm90b3R5cGVIYXMgPSB1bmN1cnJ5VGhpcyhXZWFrTWFwUHJvdG90eXBlLmhhcyk7XG4vKiogQHR5cGUgezxLIGV4dGVuZHMge30sIFY+KHdlYWtNYXA6IFdlYWtNYXA8SywgVj4sIGtleTogSywgdmFsdWU6IFYpID0+IFdlYWtNYXB9ICovXG5leHBvcnQgY29uc3QgV2Vha01hcFByb3RvdHlwZVNldCA9IHVuY3VycnlUaGlzKFdlYWtNYXBQcm90b3R5cGUuc2V0KTtcbiIsImltcG9ydCB7XG4gIEFycmF5SXRlcmF0b3JQcm90b3R5cGUsXG4gIEFycmF5SXRlcmF0b3JQcm90b3R5cGVOZXh0LFxuICBBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yLFxuICBHZW5lcmF0b3JQcm90b3R5cGVOZXh0LFxuICBJdGVyYXRvclByb3RvdHlwZSxcbiAgTmF0aXZlQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvcixcbiAgTmF0aXZlV2Vha01hcCxcbiAgT2JqZWN0Q3JlYXRlLFxuICBPYmplY3REZWZpbmVQcm9wZXJ0eSxcbiAgUmVmbGVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgUmVmbGVjdE93bktleXMsXG4gIFN5bWJvbEl0ZXJhdG9yLFxuICBXZWFrTWFwUHJvdG90eXBlR2V0LFxuICBXZWFrTWFwUHJvdG90eXBlU2V0LFxufSBmcm9tIFwiLi9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqIEB0eXBlIHtXZWFrTWFwPHt9LCBJdGVyYWJsZUl0ZXJhdG9yPGFueT4+fSAqL1xuY29uc3QgYXJyYXlJdGVyYXRvcnMgPSBuZXcgTmF0aXZlV2Vha01hcCgpO1xuXG5jb25zdCBTYWZlSXRlcmF0b3JQcm90b3R5cGUgPSBPYmplY3RDcmVhdGUobnVsbCwge1xuICBuZXh0OiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICBjb25zdCBhcnJheUl0ZXJhdG9yID0gV2Vha01hcFByb3RvdHlwZUdldChhcnJheUl0ZXJhdG9ycywgdGhpcyk7XG4gICAgICByZXR1cm4gQXJyYXlJdGVyYXRvclByb3RvdHlwZU5leHQoYXJyYXlJdGVyYXRvcik7XG4gICAgfSxcbiAgfSxcblxuICBbU3ltYm9sSXRlcmF0b3JdOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlcygpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gIH0sXG59KTtcblxuLyoqXG4gKiBXcmFwIHRoZSBBcnJheSBhcm91bmQgdGhlIFNhZmVJdGVyYXRvciBJZiBBcnJheS5wcm90b3R5cGUgW0BAaXRlcmF0b3JdIGhhcyBiZWVuIG1vZGlmaWVkXG4gKlxuICogQHR5cGUgezxUPihhcnJheTogVFtdKSA9PiBJdGVyYWJsZTxUPn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhZmVJZk5lZWRlZChhcnJheSkge1xuICBpZiAoYXJyYXlbU3ltYm9sSXRlcmF0b3JdID09PSBOYXRpdmVBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yKSB7XG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgY29uc3Qgc2FmZSA9IE9iamVjdENyZWF0ZShTYWZlSXRlcmF0b3JQcm90b3R5cGUpO1xuICBXZWFrTWFwUHJvdG90eXBlU2V0KGFycmF5SXRlcmF0b3JzLCBzYWZlLCBBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yKGFycmF5KSk7XG4gIHJldHVybiBzYWZlO1xufVxuXG4vKiogQHR5cGUge1dlYWtNYXA8e30sIEdlbmVyYXRvcjxhbnk+Pn0gKi9cbmNvbnN0IGdlbmVyYXRvcnMgPSBuZXcgTmF0aXZlV2Vha01hcCgpO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSVhcnJheWl0ZXJhdG9ycHJvdG90eXBlJS1vYmplY3QgKi9cbmNvbnN0IER1bW15QXJyYXlJdGVyYXRvclByb3RvdHlwZSA9IE9iamVjdENyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge1xuICBuZXh0OiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICBjb25zdCBnZW5lcmF0b3IgPSBXZWFrTWFwUHJvdG90eXBlR2V0KGdlbmVyYXRvcnMsIHRoaXMpO1xuICAgICAgcmV0dXJuIEdlbmVyYXRvclByb3RvdHlwZU5leHQoZ2VuZXJhdG9yKTtcbiAgICB9LFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgfSxcbn0pO1xuXG5mb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0T3duS2V5cyhBcnJheUl0ZXJhdG9yUHJvdG90eXBlKSkge1xuICAvLyBuZXh0IG1ldGhvZCBoYXMgYWxyZWFkeSBkZWZpbmVkXG4gIGlmIChrZXkgPT09IFwibmV4dFwiKSB7XG4gICAgY29udGludWU7XG4gIH1cblxuICAvLyBDb3B5IEFycmF5SXRlcmF0b3JQcm90b3R5cGUgZGVzY3JpcHRvcnMgdG8gRHVtbXlBcnJheUl0ZXJhdG9yUHJvdG90eXBlXG4gIE9iamVjdERlZmluZVByb3BlcnR5KER1bW15QXJyYXlJdGVyYXRvclByb3RvdHlwZSwga2V5LCBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEFycmF5SXRlcmF0b3JQcm90b3R5cGUsIGtleSkpO1xufVxuXG4vKipcbiAqIFdyYXAgdGhlIEdlbmVyYXRvciBhcm91bmQgdGhlIGR1bW15IEFycmF5SXRlcmF0b3JcbiAqXG4gKiBAdHlwZSB7PFQ+KGdlbmVyYXRvcjogR2VuZXJhdG9yPFQ+KSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFQ+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JhcChnZW5lcmF0b3IpIHtcbiAgY29uc3QgZHVtbXkgPSBPYmplY3RDcmVhdGUoRHVtbXlBcnJheUl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgV2Vha01hcFByb3RvdHlwZVNldChnZW5lcmF0b3JzLCBkdW1teSwgZ2VuZXJhdG9yKTtcbiAgcmV0dXJuIGR1bW15O1xufVxuIiwiaW1wb3J0IHtcbiAgQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoLFxuICBBcnJheUlzQXJyYXksXG4gIE1hdGhUcnVuYyxcbiAgTmF0aXZlQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvcixcbiAgTmF0aXZlTnVtYmVyLFxuICBOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlcixcbiAgTmF0aXZlVHlwZWRBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yLFxuICBOdW1iZXJJc0Zpbml0ZSxcbiAgU2hhcmVkQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoLFxuICBTeW1ib2xJdGVyYXRvcixcbiAgU3ltYm9sVG9TdHJpbmdUYWcsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyxcbn0gZnJvbSBcIi4vcHJpbW9yZGlhbHMubWpzXCI7XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHt9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHx8XG4gICAgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHt9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCI7XG59XG5cbi8vIEluc3BpcmVkIGJ5IHV0aWwudHlwZXMgaW1wbGVtZW50YXRpb24gb2YgTm9kZS5qc1xuLyoqIEB0eXBlZGVmIHtVaW50OEFycmF5fFVpbnQ4Q2xhbXBlZEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fEludDhBcnJheXxJbnQxNkFycmF5fEludDMyQXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheXxCaWdVaW50NjRBcnJheXxCaWdJbnQ2NEFycmF5fSBUeXBlZEFycmF5ICovXG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIFR5cGVkQXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05hdGl2ZVR5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyh2YWx1ZSkgIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgQmlnSW50NjRBcnJheXxCaWdVaW50NjRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTmF0aXZlQmlnSW50VHlwZWRBcnJheSh2YWx1ZSkge1xuICBjb25zdCB0eXBlZEFycmF5TmFtZSA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyh2YWx1ZSk7XG4gIHJldHVybiB0eXBlZEFycmF5TmFtZSA9PT0gXCJCaWdJbnQ2NEFycmF5XCIgfHxcbiAgICB0eXBlZEFycmF5TmFtZSA9PT0gXCJCaWdVaW50NjRBcnJheVwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBBcnJheUJ1ZmZlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsdWUpIHtcbiAgdHJ5IHtcbiAgICBBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGgoLyoqIEB0eXBlIHthbnl9ICovICh2YWx1ZSkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIFNoYXJlZEFycmF5QnVmZmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTaGFyZWRBcnJheUJ1ZmZlcih2YWx1ZSkge1xuICBpZiAoTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cnkge1xuICAgIFNoYXJlZEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCgvKiogQHR5cGUge2FueX0gKi8gKHZhbHVlKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgdW5rbm93bltdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPcmRpbmFyeUFycmF5KHZhbHVlKSB7XG4gIGlmICghQXJyYXlJc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh2YWx1ZVtTeW1ib2xJdGVyYXRvcl0gPT09IE5hdGl2ZUFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIGZvciBvdGhlciByZWFsbXNcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gIGNvbnN0IGl0ZXJhdG9yID0gdmFsdWVbU3ltYm9sSXRlcmF0b3JdKCk7XG4gIHJldHVybiBpdGVyYXRvcltTeW1ib2xUb1N0cmluZ1RhZ10gPT09IFwiQXJyYXkgSXRlcmF0b3JcIjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVHlwZWRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3JkaW5hcnlOYXRpdmVUeXBlZEFycmF5KHZhbHVlKSB7XG4gIGlmICghaXNOYXRpdmVUeXBlZEFycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh2YWx1ZVtTeW1ib2xJdGVyYXRvcl0gPT09IE5hdGl2ZVR5cGVkQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gZm9yIG90aGVyIHJlYWxtc1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgY29uc3QgaXRlcmF0b3IgPSB2YWx1ZVtTeW1ib2xJdGVyYXRvcl0oKTtcbiAgcmV0dXJuIGl0ZXJhdG9yW1N5bWJvbFRvU3RyaW5nVGFnXSA9PT0gXCJBcnJheSBJdGVyYXRvclwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Nhbm9uaWNhbEludGVnZXJJbmRleFN0cmluZyh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgbnVtYmVyID0gTmF0aXZlTnVtYmVyKHZhbHVlKTtcbiAgaWYgKHZhbHVlICE9PSBudW1iZXIgKyBcIlwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFOdW1iZXJJc0Zpbml0ZShudW1iZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIG51bWJlciA9PT0gTWF0aFRydW5jKG51bWJlcik7XG59XG4iLCJpbXBvcnQgeyBpc09iamVjdCwgaXNPYmplY3RMaWtlIH0gZnJvbSBcIi4vaXMubWpzXCI7XG5pbXBvcnQgeyBUSEVfQ09OU1RSVUNUT1JfUFJPUEVSVFlfVkFMVUVfSVNfTk9UX0FOX09CSkVDVCB9IGZyb20gXCIuL21lc3NhZ2VzLm1qc1wiO1xuaW1wb3J0IHsgTmF0aXZlVHlwZUVycm9yLCBSZWZsZWN0R2V0UHJvdG90eXBlT2YsIFJlZmxlY3RIYXMsIFN5bWJvbEZvciB9IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG5leHBvcnQgY29uc3QgYnJhbmQgPSBTeW1ib2xGb3IoXCJfX0Zsb2F0MTZBcnJheV9fXCIpO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc0Zsb2F0MTZBcnJheUJyYW5kKHRhcmdldCkge1xuICBpZiAoIWlzT2JqZWN0TGlrZSh0YXJnZXQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcHJvdG90eXBlID0gUmVmbGVjdEdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gIGlmICghaXNPYmplY3RMaWtlKHByb3RvdHlwZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBjb25zdHJ1Y3RvciA9IHByb3RvdHlwZS5jb25zdHJ1Y3RvcjtcbiAgaWYgKGNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCFpc09iamVjdChjb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhFX0NPTlNUUlVDVE9SX1BST1BFUlRZX1ZBTFVFX0lTX05PVF9BTl9PQkpFQ1QpO1xuICB9XG5cbiAgcmV0dXJuIFJlZmxlY3RIYXMoY29uc3RydWN0b3IsIGJyYW5kKTtcbn1cbiIsIi8vIGFsZ29yaXRobTogaHR0cDovL2ZveC10b29sa2l0Lm9yZy9mdHAvZmFzdGhhbGZmbG9hdGNvbnZlcnNpb24ucGRmXG5cbmltcG9ydCB7XG4gIE5hdGl2ZUFycmF5QnVmZmVyLFxuICBOYXRpdmVGbG9hdDMyQXJyYXksXG4gIE5hdGl2ZVVpbnQzMkFycmF5LFxufSBmcm9tIFwiLi9wcmltb3JkaWFscy5tanNcIjtcblxuY29uc3QgYnVmZmVyID0gbmV3IE5hdGl2ZUFycmF5QnVmZmVyKDQpO1xuY29uc3QgZmxvYXRWaWV3ID0gbmV3IE5hdGl2ZUZsb2F0MzJBcnJheShidWZmZXIpO1xuY29uc3QgdWludDMyVmlldyA9IG5ldyBOYXRpdmVVaW50MzJBcnJheShidWZmZXIpO1xuXG5jb25zdCBiYXNlVGFibGUgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoNTEyKTtcbmNvbnN0IHNoaWZ0VGFibGUgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoNTEyKTtcblxuZm9yIChsZXQgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBjb25zdCBlID0gaSAtIDEyNztcblxuICAvLyB2ZXJ5IHNtYWxsIG51bWJlciAoMCwgLTApXG4gIGlmIChlIDwgLTI3KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAweDAwMDA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gMjQ7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgLy8gc21hbGwgbnVtYmVyIChkZW5vcm0pXG4gIH0gZWxzZSBpZiAoZSA8IC0xNCkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gIDB4MDQwMCA+PiAoLWUgLSAxNCk7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAoMHgwNDAwID4+ICgtZSAtIDE0KSkgfCAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gLWUgLSAxO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IC1lIC0gMTtcblxuICAvLyBub3JtYWwgbnVtYmVyXG4gIH0gZWxzZSBpZiAoZSA8PSAxNSkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gIChlICsgMTUpIDw8IDEwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gKChlICsgMTUpIDw8IDEwKSB8IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAxMztcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcblxuICAvLyBsYXJnZSBudW1iZXIgKEluZmluaXR5LCAtSW5maW5pdHkpXG4gIH0gZWxzZSBpZiAoZSA8IDEyOCkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gMHg3YzAwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDI0O1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDI0O1xuXG4gIC8vIHN0YXkgKE5hTiwgSW5maW5pdHksIC1JbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBiYXNlVGFibGVbaV0gICAgICAgICA9IDB4N2MwMDtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ZmMwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAxMztcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcbiAgfVxufVxuXG4vKipcbiAqIHJvdW5kIGEgbnVtYmVyIHRvIGEgaGFsZiBmbG9hdCBudW1iZXIgYml0c1xuICpcbiAqIEBwYXJhbSB7dW5rbm93bn0gbnVtIC0gZG91YmxlIGZsb2F0XG4gKiBAcmV0dXJucyB7bnVtYmVyfSBoYWxmIGZsb2F0IG51bWJlciBiaXRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByb3VuZFRvRmxvYXQxNkJpdHMobnVtKSB7XG4gIGZsb2F0Vmlld1swXSA9IC8qKiBAdHlwZSB7YW55fSAqLyAobnVtKTtcbiAgY29uc3QgZiA9IHVpbnQzMlZpZXdbMF07XG4gIGNvbnN0IGUgPSAoZiA+PiAyMykgJiAweDFmZjtcbiAgcmV0dXJuIGJhc2VUYWJsZVtlXSArICgoZiAmIDB4MDA3ZmZmZmYpID4+IHNoaWZ0VGFibGVbZV0pO1xufVxuXG5jb25zdCBtYW50aXNzYVRhYmxlID0gbmV3IE5hdGl2ZVVpbnQzMkFycmF5KDIwNDgpO1xuY29uc3QgZXhwb25lbnRUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg2NCk7XG5jb25zdCBvZmZzZXRUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSg2NCk7XG5cbmZvciAobGV0IGkgPSAxOyBpIDwgMTAyNDsgKytpKSB7XG4gIGxldCBtID0gaSA8PCAxMzsgICAgLy8gemVybyBwYWQgbWFudGlzc2EgYml0c1xuICBsZXQgZSA9IDA7ICAgICAgICAgIC8vIHplcm8gZXhwb25lbnRcblxuICAvLyBub3JtYWxpemVkXG4gIHdoaWxlKChtICYgMHgwMDgwMDAwMCkgPT09IDApIHtcbiAgICBtIDw8PSAxO1xuICAgIGUgLT0gMHgwMDgwMDAwMDsgIC8vIGRlY3JlbWVudCBleHBvbmVudFxuICB9XG5cbiAgbSAmPSB+MHgwMDgwMDAwMDsgICAvLyBjbGVhciBsZWFkaW5nIDEgYml0XG4gIGUgKz0gMHgzODgwMDAwMDsgICAgLy8gYWRqdXN0IGJpYXNcblxuICBtYW50aXNzYVRhYmxlW2ldID0gbSB8IGU7XG59XG5mb3IgKGxldCBpID0gMTAyNDsgaSA8IDIwNDg7ICsraSkge1xuICBtYW50aXNzYVRhYmxlW2ldID0gMHgzODAwMDAwMCArICgoaSAtIDEwMjQpIDw8IDEzKTtcbn1cblxuZm9yIChsZXQgaSA9IDE7IGkgPCAzMTsgKytpKSB7XG4gIGV4cG9uZW50VGFibGVbaV0gPSBpIDw8IDIzO1xufVxuZXhwb25lbnRUYWJsZVszMV0gPSAweDQ3ODAwMDAwO1xuZXhwb25lbnRUYWJsZVszMl0gPSAweDgwMDAwMDAwO1xuZm9yIChsZXQgaSA9IDMzOyBpIDwgNjM7ICsraSkge1xuICBleHBvbmVudFRhYmxlW2ldID0gMHg4MDAwMDAwMCArICgoaSAtIDMyKSA8PCAyMyk7XG59XG5leHBvbmVudFRhYmxlWzYzXSA9IDB4Yzc4MDAwMDA7XG5cbmZvciAobGV0IGkgPSAxOyBpIDwgNjQ7ICsraSkge1xuICBpZiAoaSAhPT0gMzIpIHtcbiAgICBvZmZzZXRUYWJsZVtpXSA9IDEwMjQ7XG4gIH1cbn1cblxuLyoqXG4gKiBjb252ZXJ0IGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cyB0byBhIG51bWJlclxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBmbG9hdDE2Yml0cyAtIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGRvdWJsZSBmbG9hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzKSB7XG4gIGNvbnN0IG0gPSBmbG9hdDE2Yml0cyA+PiAxMDtcbiAgdWludDMyVmlld1swXSA9IG1hbnRpc3NhVGFibGVbb2Zmc2V0VGFibGVbbV0gKyAoZmxvYXQxNmJpdHMgJiAweDNmZildICsgZXhwb25lbnRUYWJsZVttXTtcbiAgcmV0dXJuIGZsb2F0Vmlld1swXTtcbn1cbiIsImltcG9ydCB7IGlzT2JqZWN0LCBpc1NoYXJlZEFycmF5QnVmZmVyIH0gZnJvbSBcIi4vaXMubWpzXCI7XG5pbXBvcnQge1xuICBDQU5OT1RfQ09OVkVSVF9BX0JJR0lOVF9WQUxVRV9UT19BX05VTUJFUixcbiAgVEhFX0NPTlNUUlVDVE9SX1BST1BFUlRZX1ZBTFVFX0lTX05PVF9BTl9PQkpFQ1QsXG4gIFRISVNfSVNfTk9UX0FOX09CSkVDVCxcbn0gZnJvbSBcIi4vbWVzc2FnZXMubWpzXCI7XG5pbXBvcnQge1xuICBBcnJheUJ1ZmZlclByb3RvdHlwZVNsaWNlLFxuICBNYXRoVHJ1bmMsXG4gIE5hdGl2ZU51bWJlcixcbiAgTmF0aXZlVHlwZUVycm9yLFxuICBOdW1iZXJJc05hTixcbiAgT2JqZWN0SXMsXG4gIFN5bWJvbFNwZWNpZXMsXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG5jb25zdCBNQVhfU0FGRV9JTlRFR0VSID0gTmF0aXZlTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvaW50ZWdlcm9yaW5maW5pdHlcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gVG9JbnRlZ2VyT3JJbmZpbml0eSh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwiYmlnaW50XCIpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ0FOTk9UX0NPTlZFUlRfQV9CSUdJTlRfVkFMVUVfVE9fQV9OVU1CRVIpO1xuICB9XG5cbiAgY29uc3QgbnVtYmVyID0gTmF0aXZlTnVtYmVyKHRhcmdldCk7XG5cbiAgaWYgKE51bWJlcklzTmFOKG51bWJlcikgfHwgbnVtYmVyID09PSAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gTWF0aFRydW5jKG51bWJlcik7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvbGVuZ3RoXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFRvTGVuZ3RoKHRhcmdldCkge1xuICBjb25zdCBsZW5ndGggPSBUb0ludGVnZXJPckluZmluaXR5KHRhcmdldCk7XG4gIGlmIChsZW5ndGggPCAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gbGVuZ3RoIDwgTUFYX1NBRkVfSU5URUdFUlxuICAgID8gbGVuZ3RoXG4gICAgOiBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1zcGVjaWVzY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7eyBuZXcoLi4uYXJnczogYW55W10pOiBhbnk7IH19IGRlZmF1bHRDb25zdHJ1Y3RvclxuICogQHJldHVybnMge3sgbmV3KC4uLmFyZ3M6IGFueVtdKTogYW55OyB9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gU3BlY2llc0NvbnN0cnVjdG9yKHRhcmdldCwgZGVmYXVsdENvbnN0cnVjdG9yKSB7XG4gIGlmICghaXNPYmplY3QodGFyZ2V0KSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSElTX0lTX05PVF9BTl9PQkpFQ1QpO1xuICB9XG5cbiAgY29uc3QgY29uc3RydWN0b3IgPSB0YXJnZXQuY29uc3RydWN0b3I7XG4gIGlmIChjb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRDb25zdHJ1Y3RvcjtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KGNvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSEVfQ09OU1RSVUNUT1JfUFJPUEVSVFlfVkFMVUVfSVNfTk9UX0FOX09CSkVDVCk7XG4gIH1cblxuICBjb25zdCBzcGVjaWVzID0gY29uc3RydWN0b3JbU3ltYm9sU3BlY2llc107XG4gIGlmIChzcGVjaWVzID09IG51bGwpIHtcbiAgICByZXR1cm4gZGVmYXVsdENvbnN0cnVjdG9yO1xuICB9XG5cbiAgcmV0dXJuIHNwZWNpZXM7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWlzZGV0YWNoZWRidWZmZXJcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJMaWtlfSBidWZmZXJcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpIHtcbiAgaWYgKGlzU2hhcmVkQXJyYXlCdWZmZXIoYnVmZmVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgQXJyYXlCdWZmZXJQcm90b3R5cGVTbGljZShidWZmZXIsIDAsIDApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBjYXRjaCAoZSkgey8qIGVtcHR5ICovfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIGJpZ2ludCBjb21wYXJpc29ucyBhcmUgbm90IHN1cHBvcnRlZFxuICpcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNvcnRcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gKiBAcGFyYW0ge251bWJlcn0geVxuICogQHJldHVybnMgey0xIHwgMCB8IDF9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0Q29tcGFyZSh4LCB5KSB7XG4gIGNvbnN0IGlzWE5hTiA9IE51bWJlcklzTmFOKHgpO1xuICBjb25zdCBpc1lOYU4gPSBOdW1iZXJJc05hTih5KTtcblxuICBpZiAoaXNYTmFOICYmIGlzWU5hTikge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKGlzWE5hTikge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKGlzWU5hTikge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmICh4IDwgeSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmICh4ID4geSkge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCkge1xuICAgIGNvbnN0IGlzWFBsdXNaZXJvID0gT2JqZWN0SXMoeCwgMCk7XG4gICAgY29uc3QgaXNZUGx1c1plcm8gPSBPYmplY3RJcyh5LCAwKTtcblxuICAgIGlmICghaXNYUGx1c1plcm8gJiYgaXNZUGx1c1plcm8pIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoaXNYUGx1c1plcm8gJiYgIWlzWVBsdXNaZXJvKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cbiIsImltcG9ydCB7IHNhZmVJZk5lZWRlZCwgd3JhcCB9IGZyb20gXCIuL191dGlsL2FycmF5SXRlcmF0b3IubWpzXCI7XG5pbXBvcnQgeyBicmFuZCwgaGFzRmxvYXQxNkFycmF5QnJhbmQgfSBmcm9tIFwiLi9fdXRpbC9icmFuZC5tanNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHtcbiAgaXNBcnJheUJ1ZmZlcixcbiAgaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcsXG4gIGlzTmF0aXZlQmlnSW50VHlwZWRBcnJheSxcbiAgaXNOYXRpdmVUeXBlZEFycmF5LFxuICBpc09iamVjdCxcbiAgaXNPcmRpbmFyeUFycmF5LFxuICBpc09yZGluYXJ5TmF0aXZlVHlwZWRBcnJheSxcbiAgaXNTaGFyZWRBcnJheUJ1ZmZlcixcbn0gZnJvbSBcIi4vX3V0aWwvaXMubWpzXCI7XG5pbXBvcnQge1xuICBBVFRFTVBUSU5HX1RPX0FDQ0VTU19ERVRBQ0hFRF9BUlJBWUJVRkZFUixcbiAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNULFxuICBDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVMsXG4gIERFUklWRURfQ09OU1RSVUNUT1JfQ1JFQVRFRF9UWVBFREFSUkFZX09CSkVDVF9XSElDSF9XQVNfVE9PX1NNQUxMX0xFTkdUSCxcbiAgSVRFUkFUT1JfUFJPUEVSVFlfSVNfTk9UX0NBTExBQkxFLFxuICBPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyxcbiAgUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSxcbiAgU1BFQ0lFU19DT05TVFJVQ1RPUl9ESUROVF9SRVRVUk5fVFlQRURBUlJBWV9PQkpFQ1QsXG4gIFRISVNfQ09OU1RSVUNUT1JfSVNfTk9UX0FfU1VCQ0xBU1NfT0ZfRkxPQVQxNkFSUkFZLFxuICBUSElTX0lTX05PVF9BX0ZMT0FUMTZBUlJBWV9PQkpFQ1QsXG59IGZyb20gXCIuL191dGlsL21lc3NhZ2VzLm1qc1wiO1xuaW1wb3J0IHtcbiAgQXJyYXlCdWZmZXJJc1ZpZXcsXG4gIEFycmF5UHJvdG90eXBlSm9pbixcbiAgQXJyYXlQcm90b3R5cGVQdXNoLFxuICBBcnJheVByb3RvdHlwZVRvTG9jYWxlU3RyaW5nLFxuICBOYXRpdmVBcnJheUJ1ZmZlcixcbiAgTmF0aXZlT2JqZWN0LFxuICBOYXRpdmVQcm94eSxcbiAgTmF0aXZlUmFuZ2VFcnJvcixcbiAgTmF0aXZlVHlwZUVycm9yLFxuICBOYXRpdmVVaW50MTZBcnJheSxcbiAgTmF0aXZlV2Vha01hcCxcbiAgTmF0aXZlV2Vha1NldCxcbiAgTnVtYmVySXNOYU4sXG4gIE9iamVjdERlZmluZVByb3BlcnR5LFxuICBPYmplY3RGcmVlemUsXG4gIE9iamVjdEhhc093bixcbiAgT2JqZWN0UHJvdG90eXBlX19sb29rdXBHZXR0ZXJfXyxcbiAgUmVmbGVjdEFwcGx5LFxuICBSZWZsZWN0Q29uc3RydWN0LFxuICBSZWZsZWN0RGVmaW5lUHJvcGVydHksXG4gIFJlZmxlY3RHZXQsXG4gIFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIFJlZmxlY3RIYXMsXG4gIFJlZmxlY3RPd25LZXlzLFxuICBSZWZsZWN0U2V0LFxuICBSZWZsZWN0U2V0UHJvdG90eXBlT2YsXG4gIFN5bWJvbEl0ZXJhdG9yLFxuICBTeW1ib2xUb1N0cmluZ1RhZyxcbiAgVHlwZWRBcnJheSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUNvcHlXaXRoaW4sXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVFbnRyaWVzLFxuICBUeXBlZEFycmF5UHJvdG90eXBlRmlsbCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcixcbiAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVLZXlzLFxuICBUeXBlZEFycmF5UHJvdG90eXBlUmV2ZXJzZSxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVNldCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVNsaWNlLFxuICBUeXBlZEFycmF5UHJvdG90eXBlU29ydCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZVN1YmFycmF5LFxuICBUeXBlZEFycmF5UHJvdG90eXBlVmFsdWVzLFxuICBVaW50MTZBcnJheUZyb20sXG4gIFdlYWtNYXBQcm90b3R5cGVHZXQsXG4gIFdlYWtNYXBQcm90b3R5cGVIYXMsXG4gIFdlYWtNYXBQcm90b3R5cGVTZXQsXG4gIFdlYWtTZXRQcm90b3R5cGVBZGQsXG4gIFdlYWtTZXRQcm90b3R5cGVIYXMsXG59IGZyb20gXCIuL191dGlsL3ByaW1vcmRpYWxzLm1qc1wiO1xuaW1wb3J0IHtcbiAgSXNEZXRhY2hlZEJ1ZmZlcixcbiAgU3BlY2llc0NvbnN0cnVjdG9yLFxuICBUb0ludGVnZXJPckluZmluaXR5LFxuICBUb0xlbmd0aCxcbiAgZGVmYXVsdENvbXBhcmUsXG59IGZyb20gXCIuL191dGlsL3NwZWMubWpzXCI7XG5cbmNvbnN0IEJZVEVTX1BFUl9FTEVNRU5UID0gMjtcblxuLyoqIEB0eXBlZGVmIHtVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfX0gRmxvYXQxNkJpdHNBcnJheSAqL1xuXG4vKiogQHR5cGUge1dlYWtNYXA8RmxvYXQxNkFycmF5LCBGbG9hdDE2Qml0c0FycmF5Pn0gKi9cbmNvbnN0IGZsb2F0MTZiaXRzQXJyYXlzID0gbmV3IE5hdGl2ZVdlYWtNYXAoKTtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge3RhcmdldCBpcyBGbG9hdDE2QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgcmV0dXJuIFdlYWtNYXBQcm90b3R5cGVIYXMoZmxvYXQxNmJpdHNBcnJheXMsIHRhcmdldCkgfHxcbiAgICAoIUFycmF5QnVmZmVySXNWaWV3KHRhcmdldCkgJiYgaGFzRmxvYXQxNkFycmF5QnJhbmQodGFyZ2V0KSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEByZXR1cm5zIHthc3NlcnRzIHRhcmdldCBpcyBGbG9hdDE2QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGFzc2VydEZsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgaWYgKCFpc0Zsb2F0MTZBcnJheSh0YXJnZXQpKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFRISVNfSVNfTk9UX0FfRkxPQVQxNkFSUkFZX09CSkVDVCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHBhcmFtIHtudW1iZXI9fSBjb3VudFxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge2Fzc2VydHMgdGFyZ2V0IGlzIFVpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDE2QXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheX1cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0U3BlY2llc1R5cGVkQXJyYXkodGFyZ2V0LCBjb3VudCkge1xuICBjb25zdCBpc1RhcmdldEZsb2F0MTZBcnJheSA9IGlzRmxvYXQxNkFycmF5KHRhcmdldCk7XG4gIGNvbnN0IGlzVGFyZ2V0VHlwZWRBcnJheSA9IGlzTmF0aXZlVHlwZWRBcnJheSh0YXJnZXQpO1xuXG4gIGlmICghaXNUYXJnZXRGbG9hdDE2QXJyYXkgJiYgIWlzVGFyZ2V0VHlwZWRBcnJheSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihTUEVDSUVTX0NPTlNUUlVDVE9SX0RJRE5UX1JFVFVSTl9UWVBFREFSUkFZX09CSkVDVCk7XG4gIH1cblxuICBpZiAodHlwZW9mIGNvdW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgbGV0IGxlbmd0aDtcbiAgICBpZiAoaXNUYXJnZXRGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRhcmdldCk7XG4gICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKHRhcmdldCk7XG4gICAgfVxuXG4gICAgaWYgKGxlbmd0aCA8IGNvdW50KSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIERFUklWRURfQ09OU1RSVUNUT1JfQ1JFQVRFRF9UWVBFREFSUkFZX09CSkVDVF9XSElDSF9XQVNfVE9PX1NNQUxMX0xFTkdUSFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoaXNOYXRpdmVCaWdJbnRUeXBlZEFycmF5KHRhcmdldCkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ0FOTk9UX01JWF9CSUdJTlRfQU5EX09USEVSX1RZUEVTKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7RmxvYXQxNkFycmF5fSBmbG9hdDE2XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcmV0dXJucyB7RmxvYXQxNkJpdHNBcnJheX1cbiAqL1xuZnVuY3Rpb24gZ2V0RmxvYXQxNkJpdHNBcnJheShmbG9hdDE2KSB7XG4gIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBXZWFrTWFwUHJvdG90eXBlR2V0KGZsb2F0MTZiaXRzQXJyYXlzLCBmbG9hdDE2KTtcbiAgaWYgKGZsb2F0MTZiaXRzQXJyYXkgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgaWYgKElzRGV0YWNoZWRCdWZmZXIoYnVmZmVyKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgICB9XG4gICAgcmV0dXJuIGZsb2F0MTZiaXRzQXJyYXk7XG4gIH1cblxuICAvLyBmcm9tIGFub3RoZXIgRmxvYXQxNkFycmF5IGluc3RhbmNlIChhIGRpZmZlcmVudCB2ZXJzaW9uPylcbiAgY29uc3QgYnVmZmVyID0gLyoqIEB0eXBlIHthbnl9ICovIChmbG9hdDE2KS5idWZmZXI7XG5cbiAgaWYgKElzRGV0YWNoZWRCdWZmZXIoYnVmZmVyKSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihBVFRFTVBUSU5HX1RPX0FDQ0VTU19ERVRBQ0hFRF9BUlJBWUJVRkZFUik7XG4gIH1cblxuICBjb25zdCBjbG9uZWQgPSBSZWZsZWN0Q29uc3RydWN0KEZsb2F0MTZBcnJheSwgW1xuICAgIGJ1ZmZlcixcbiAgICAvKiogQHR5cGUge2FueX0gKi8gKGZsb2F0MTYpLmJ5dGVPZmZzZXQsXG4gICAgLyoqIEB0eXBlIHthbnl9ICovIChmbG9hdDE2KS5sZW5ndGgsXG4gIF0sIGZsb2F0MTYuY29uc3RydWN0b3IpO1xuICByZXR1cm4gV2Vha01hcFByb3RvdHlwZUdldChmbG9hdDE2Yml0c0FycmF5cywgY2xvbmVkKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0Zsb2F0MTZCaXRzQXJyYXl9IGZsb2F0MTZiaXRzQXJyYXlcbiAqIEByZXR1cm5zIHtudW1iZXJbXX1cbiAqL1xuZnVuY3Rpb24gY29weVRvQXJyYXkoZmxvYXQxNmJpdHNBcnJheSkge1xuICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gIGNvbnN0IGFycmF5ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBhcnJheVtpXSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgfVxuXG4gIHJldHVybiBhcnJheTtcbn1cblxuLyoqIEB0eXBlIHtXZWFrU2V0PEZ1bmN0aW9uPn0gKi9cbmNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXR0ZXJzID0gbmV3IE5hdGl2ZVdlYWtTZXQoKTtcbmZvciAoY29uc3Qga2V5IG9mIFJlZmxlY3RPd25LZXlzKFR5cGVkQXJyYXlQcm90b3R5cGUpKSB7XG4gIC8vIEBAdG9TdHJpbmdUYWcgbWV0aG9kIGlzIGRlZmluZWQgaW4gRmxvYXQxNkFycmF5LnByb3RvdHlwZVxuICBpZiAoa2V5ID09PSBTeW1ib2xUb1N0cmluZ1RhZykge1xuICAgIGNvbnRpbnVlO1xuICB9XG5cbiAgY29uc3QgZGVzY3JpcHRvciA9IFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoVHlwZWRBcnJheVByb3RvdHlwZSwga2V5KTtcbiAgaWYgKE9iamVjdEhhc093bihkZXNjcmlwdG9yLCBcImdldFwiKSkge1xuICAgIFdlYWtTZXRQcm90b3R5cGVBZGQoVHlwZWRBcnJheVByb3RvdHlwZUdldHRlcnMsIGRlc2NyaXB0b3IuZ2V0KTtcbiAgfVxufVxuXG5jb25zdCBoYW5kbGVyID0gT2JqZWN0RnJlZXplKC8qKiBAdHlwZSB7UHJveHlIYW5kbGVyPEZsb2F0MTZCaXRzQXJyYXk+fSAqLyAoe1xuICAvKiogbGltaXRhdGlvbjogSWYgdGhlIGdldHRlciBwcm9wZXJ0eSBpcyB0aGUgc2FtZSBhcyAlVHlwZWRBcnJheSUucHJvdG90eXBlLCB0aGUgcmVjZWl2ZXIgaXMgbm90IHBhc3NlZCAqL1xuICBnZXQodGFyZ2V0LCBrZXksIHJlY2VpdmVyKSB7XG4gICAgaWYgKGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKGtleSkgJiYgT2JqZWN0SGFzT3duKHRhcmdldCwga2V5KSkge1xuICAgICAgcmV0dXJuIGNvbnZlcnRUb051bWJlcihSZWZsZWN0R2V0KHRhcmdldCwga2V5KSk7XG4gICAgfVxuXG4gICAgLy8gJVR5cGVkQXJyYXklLnByb3RvdHlwZSBnZXR0ZXIgcHJvcGVydGllcyBjYW5ub3QgY2FsbGVkIGJ5IFByb3h5IHJlY2VpdmVyXG4gICAgaWYgKFdlYWtTZXRQcm90b3R5cGVIYXMoVHlwZWRBcnJheVByb3RvdHlwZUdldHRlcnMsIE9iamVjdFByb3RvdHlwZV9fbG9va3VwR2V0dGVyX18odGFyZ2V0LCBrZXkpKSkge1xuICAgICAgcmV0dXJuIFJlZmxlY3RHZXQodGFyZ2V0LCBrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0R2V0KHRhcmdldCwga2V5LCByZWNlaXZlcik7XG4gIH0sXG5cbiAgc2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICBpZiAoaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcoa2V5KSAmJiBPYmplY3RIYXNPd24odGFyZ2V0LCBrZXkpKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdFNldCh0YXJnZXQsIGtleSwgcm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZmxlY3RTZXQodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcik7XG4gIH0sXG5cbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG4gICAgaWYgKGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKGtleSkgJiYgT2JqZWN0SGFzT3duKHRhcmdldCwga2V5KSkge1xuICAgICAgY29uc3QgZGVzY3JpcHRvciA9IFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IGNvbnZlcnRUb051bWJlcihkZXNjcmlwdG9yLnZhbHVlKTtcbiAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgfSxcblxuICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICAgIGlmIChcbiAgICAgIGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKGtleSkgJiZcbiAgICAgIE9iamVjdEhhc093bih0YXJnZXQsIGtleSkgJiZcbiAgICAgIE9iamVjdEhhc093bihkZXNjcmlwdG9yLCBcInZhbHVlXCIpXG4gICAgKSB7XG4gICAgICBkZXNjcmlwdG9yLnZhbHVlID0gcm91bmRUb0Zsb2F0MTZCaXRzKGRlc2NyaXB0b3IudmFsdWUpO1xuICAgICAgcmV0dXJuIFJlZmxlY3REZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZmxlY3REZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcik7XG4gIH0sXG59KSk7XG5cbmV4cG9ydCBjbGFzcyBGbG9hdDE2QXJyYXkge1xuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXR5cGVkYXJyYXkgKi9cbiAgY29uc3RydWN0b3IoaW5wdXQsIF9ieXRlT2Zmc2V0LCBfbGVuZ3RoKSB7XG4gICAgLyoqIEB0eXBlIHtGbG9hdDE2Qml0c0FycmF5fSAqL1xuICAgIGxldCBmbG9hdDE2Yml0c0FycmF5O1xuXG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KGlucHV0KSkge1xuICAgICAgZmxvYXQxNmJpdHNBcnJheSA9IFJlZmxlY3RDb25zdHJ1Y3QoTmF0aXZlVWludDE2QXJyYXksIFtnZXRGbG9hdDE2Qml0c0FycmF5KGlucHV0KV0sIG5ldy50YXJnZXQpO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoaW5wdXQpICYmICFpc0FycmF5QnVmZmVyKGlucHV0KSkgeyAvLyBvYmplY3Qgd2l0aG91dCBBcnJheUJ1ZmZlclxuICAgICAgLyoqIEB0eXBlIHtBcnJheUxpa2U8dW5rbm93bj59ICovXG4gICAgICBsZXQgbGlzdDtcbiAgICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICAgICAgbGV0IGxlbmd0aDtcblxuICAgICAgaWYgKGlzTmF0aXZlVHlwZWRBcnJheShpbnB1dCkpIHsgLy8gVHlwZWRBcnJheVxuICAgICAgICBsaXN0ID0gaW5wdXQ7XG4gICAgICAgIGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoaW5wdXQpO1xuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoaW5wdXQpO1xuICAgICAgICBjb25zdCBCdWZmZXJDb25zdHJ1Y3RvciA9ICFpc1NoYXJlZEFycmF5QnVmZmVyKGJ1ZmZlcilcbiAgICAgICAgICA/IC8qKiBAdHlwZSB7QXJyYXlCdWZmZXJDb25zdHJ1Y3Rvcn0gKi8gKFNwZWNpZXNDb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIGJ1ZmZlcixcbiAgICAgICAgICAgIE5hdGl2ZUFycmF5QnVmZmVyXG4gICAgICAgICAgKSlcbiAgICAgICAgICA6IE5hdGl2ZUFycmF5QnVmZmVyO1xuXG4gICAgICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICAgICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTmF0aXZlQmlnSW50VHlwZWRBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ0FOTk9UX01JWF9CSUdJTlRfQU5EX09USEVSX1RZUEVTKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgQnVmZmVyQ29uc3RydWN0b3IoXG4gICAgICAgICAgbGVuZ3RoICogQllURVNfUEVSX0VMRU1FTlRcbiAgICAgICAgKTtcbiAgICAgICAgZmxvYXQxNmJpdHNBcnJheSA9IFJlZmxlY3RDb25zdHJ1Y3QoTmF0aXZlVWludDE2QXJyYXksIFtkYXRhXSwgbmV3LnRhcmdldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpdGVyYXRvciA9IGlucHV0W1N5bWJvbEl0ZXJhdG9yXTtcbiAgICAgICAgaWYgKGl0ZXJhdG9yICE9IG51bGwgJiYgdHlwZW9mIGl0ZXJhdG9yICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoSVRFUkFUT1JfUFJPUEVSVFlfSVNfTk9UX0NBTExBQkxFKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVyYXRvciAhPSBudWxsKSB7IC8vIEl0ZXJhYmxlIChBcnJheSlcbiAgICAgICAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgICAgICAgaWYgKGlzT3JkaW5hcnlBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIGxpc3QgPSBpbnB1dDtcbiAgICAgICAgICAgIGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgICAgICAgICBsaXN0ID0gWy4uLiAvKiogQHR5cGUge0l0ZXJhYmxlPHVua25vd24+fSAqLyAoaW5wdXQpXTtcbiAgICAgICAgICAgIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8gQXJyYXlMaWtlXG4gICAgICAgICAgbGlzdCA9IC8qKiBAdHlwZSB7QXJyYXlMaWtlPHVua25vd24+fSAqLyAoaW5wdXQpO1xuICAgICAgICAgIGxlbmd0aCA9IFRvTGVuZ3RoKGxpc3QubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBmbG9hdDE2Yml0c0FycmF5ID0gUmVmbGVjdENvbnN0cnVjdChOYXRpdmVVaW50MTZBcnJheSwgW2xlbmd0aF0sIG5ldy50YXJnZXQpO1xuICAgICAgfVxuXG4gICAgICAvLyBzZXQgdmFsdWVzXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXlbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMobGlzdFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8gcHJpbWl0aXZlLCBBcnJheUJ1ZmZlclxuICAgICAgZmxvYXQxNmJpdHNBcnJheSA9IFJlZmxlY3RDb25zdHJ1Y3QoTmF0aXZlVWludDE2QXJyYXksIGFyZ3VtZW50cywgbmV3LnRhcmdldCk7XG4gICAgfVxuXG4gICAgLyoqIEB0eXBlIHtGbG9hdDE2QXJyYXl9ICovXG4gICAgY29uc3QgcHJveHkgPSAvKiogQHR5cGUge2FueX0gKi8gKG5ldyBOYXRpdmVQcm94eShmbG9hdDE2Yml0c0FycmF5LCBoYW5kbGVyKSk7XG5cbiAgICAvLyBwcm94eSBwcml2YXRlIHN0b3JhZ2VcbiAgICBXZWFrTWFwUHJvdG90eXBlU2V0KGZsb2F0MTZiaXRzQXJyYXlzLCBwcm94eSwgZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICByZXR1cm4gcHJveHk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZsb2F0MTZBcnJheSlgIG9yIGBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5KWAgaW5jbHVkZSB0aGlzIGtleVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLmZyb21cbiAgICovXG4gIHN0YXRpYyBmcm9tKHNyYywgLi4ub3B0cykge1xuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gdGhpcztcblxuICAgIGlmICghUmVmbGVjdEhhcyhDb25zdHJ1Y3RvciwgYnJhbmQpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIFRISVNfQ09OU1RSVUNUT1JfSVNfTk9UX0FfU1VCQ0xBU1NfT0ZfRkxPQVQxNkFSUkFZXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICBpZiAoQ29uc3RydWN0b3IgPT09IEZsb2F0MTZBcnJheSkge1xuICAgICAgaWYgKGlzRmxvYXQxNkFycmF5KHNyYykgJiYgb3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkoc3JjKTtcbiAgICAgICAgY29uc3QgdWludDE2ID0gbmV3IE5hdGl2ZVVpbnQxNkFycmF5KFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSh1aW50MTYpKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgICAgIFVpbnQxNkFycmF5RnJvbShzcmMsIHJvdW5kVG9GbG9hdDE2Qml0cylcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1hcEZ1bmMgPSBvcHRzWzBdO1xuICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMV07XG5cbiAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKFxuICAgICAgICAgIFVpbnQxNkFycmF5RnJvbShzcmMsIGZ1bmN0aW9uICh2YWwsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiByb3VuZFRvRmxvYXQxNkJpdHMoXG4gICAgICAgICAgICAgIFJlZmxlY3RBcHBseShtYXBGdW5jLCB0aGlzLCBbdmFsLCAuLi5zYWZlSWZOZWVkZWQoYXJncyldKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9LCB0aGlzQXJnKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7QXJyYXlMaWtlPHVua25vd24+fSAqL1xuICAgIGxldCBsaXN0O1xuICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICAgIGxldCBsZW5ndGg7XG5cbiAgICBjb25zdCBpdGVyYXRvciA9IHNyY1tTeW1ib2xJdGVyYXRvcl07XG4gICAgaWYgKGl0ZXJhdG9yICE9IG51bGwgJiYgdHlwZW9mIGl0ZXJhdG9yICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihJVEVSQVRPUl9QUk9QRVJUWV9JU19OT1RfQ0FMTEFCTEUpO1xuICAgIH1cblxuICAgIGlmIChpdGVyYXRvciAhPSBudWxsKSB7IC8vIEl0ZXJhYmxlIChUeXBlZEFycmF5LCBBcnJheSlcbiAgICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICAgIGlmIChpc09yZGluYXJ5QXJyYXkoc3JjKSkge1xuICAgICAgICBsaXN0ID0gc3JjO1xuICAgICAgICBsZW5ndGggPSBzcmMubGVuZ3RoO1xuICAgICAgfSBlbHNlIGlmIChpc09yZGluYXJ5TmF0aXZlVHlwZWRBcnJheShzcmMpKSB7XG4gICAgICAgIGxpc3QgPSBzcmM7XG4gICAgICAgIGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoc3JjKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgICBsaXN0ID0gWy4uLnNyY107XG4gICAgICAgIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIEFycmF5TGlrZVxuICAgICAgaWYgKHNyYyA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgICBDQU5OT1RfQ09OVkVSVF9VTkRFRklORURfT1JfTlVMTF9UT19PQkpFQ1RcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGxpc3QgPSBOYXRpdmVPYmplY3Qoc3JjKTtcbiAgICAgIGxlbmd0aCA9IFRvTGVuZ3RoKGxpc3QubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gLyoqIEB0eXBlIHtudW1iZXJ9ICovIChsaXN0W2ldKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbWFwRnVuYyA9IG9wdHNbMF07XG4gICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1sxXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgYXJyYXlbaV0gPSBSZWZsZWN0QXBwbHkobWFwRnVuYywgdGhpc0FyZywgW2xpc3RbaV0sIGldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZsb2F0MTZBcnJheSlgIG9yIGBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5KWAgaW5jbHVkZSB0aGlzIGtleVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLm9mXG4gICAqL1xuICBzdGF0aWMgb2YoLi4uaXRlbXMpIHtcbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICBpZiAoIVJlZmxlY3RIYXMoQ29uc3RydWN0b3IsIGJyYW5kKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBsZW5ndGggPSBpdGVtcy5sZW5ndGg7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IHByb3h5ID0gbmV3IEZsb2F0MTZBcnJheShsZW5ndGgpO1xuICAgICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkocHJveHkpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXlbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMoaXRlbXNbaV0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGFycmF5W2ldID0gaXRlbXNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmtleXMgKi9cbiAga2V5cygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gVHlwZWRBcnJheVByb3RvdHlwZUtleXMoZmxvYXQxNmJpdHNBcnJheSk7XG4gIH1cblxuICAvKipcbiAgICogbGltaXRhdGlvbjogcmV0dXJucyBhIG9iamVjdCB3aG9zZSBwcm90b3R5cGUgaXMgbm90IGAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSVgXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnZhbHVlc1xuICAgKi9cbiAgdmFsdWVzKCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIHJldHVybiB3cmFwKChmdW5jdGlvbiogKCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgICBmb3IgKGNvbnN0IHZhbCBvZiBUeXBlZEFycmF5UHJvdG90eXBlVmFsdWVzKGZsb2F0MTZiaXRzQXJyYXkpKSB7XG4gICAgICAgIHlpZWxkIGNvbnZlcnRUb051bWJlcih2YWwpO1xuICAgICAgfVxuICAgIH0pKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IHJldHVybnMgYSBvYmplY3Qgd2hvc2UgcHJvdG90eXBlIGlzIG5vdCBgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlYFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5lbnRyaWVzXG4gICAqL1xuICBlbnRyaWVzKCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIHJldHVybiB3cmFwKChmdW5jdGlvbiogKCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgICBmb3IgKGNvbnN0IFtpLCB2YWxdIG9mIFR5cGVkQXJyYXlQcm90b3R5cGVFbnRyaWVzKGZsb2F0MTZiaXRzQXJyYXkpKSB7XG4gICAgICAgIHlpZWxkIC8qKiBAdHlwZSB7W051bWJlciwgbnVtYmVyXX0gKi8gKFtpLCBjb252ZXJ0VG9OdW1iZXIodmFsKV0pO1xuICAgICAgfVxuICAgIH0pKCkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmF0ICovXG4gIGF0KGluZGV4KSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCByZWxhdGl2ZUluZGV4ID0gVG9JbnRlZ2VyT3JJbmZpbml0eShpbmRleCk7XG4gICAgY29uc3QgayA9IHJlbGF0aXZlSW5kZXggPj0gMCA/IHJlbGF0aXZlSW5kZXggOiBsZW5ndGggKyByZWxhdGl2ZUluZGV4O1xuXG4gICAgaWYgKGsgPCAwIHx8IGsgPj0gbGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2tdKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5tYXAgKi9cbiAgbWFwKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IHByb3h5ID0gbmV3IEZsb2F0MTZBcnJheShsZW5ndGgpO1xuICAgICAgY29uc3QgYXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHByb3h5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCB2YWwgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gICAgICAgIGFycmF5W2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKFxuICAgICAgICAgIFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbCwgaSwgdGhpc10pXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm94eTtcbiAgICB9XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5LCBsZW5ndGgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgYXJyYXlbaV0gPSBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChhcnJheSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmlsdGVyICovXG4gIGZpbHRlcihjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBjb25zdCBrZXB0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbCwgaSwgdGhpc10pKSB7XG4gICAgICAgIEFycmF5UHJvdG90eXBlUHVzaChrZXB0LCB2YWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3Ioa2VwdCk7XG4gICAgYXNzZXJ0U3BlY2llc1R5cGVkQXJyYXkoYXJyYXkpO1xuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJlZHVjZSAqL1xuICByZWR1Y2UoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGlmIChsZW5ndGggPT09IDAgJiYgb3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihSRURVQ0VfT0ZfRU1QVFlfQVJSQVlfV0lUSF9OT19JTklUSUFMX1ZBTFVFKTtcbiAgICB9XG5cbiAgICBsZXQgYWNjdW11bGF0b3IsIHN0YXJ0O1xuICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVswXSk7XG4gICAgICBzdGFydCA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gb3B0c1swXTtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjYWxsYmFjayhcbiAgICAgICAgYWNjdW11bGF0b3IsXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgaSxcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUucmVkdWNlcmlnaHQgKi9cbiAgcmVkdWNlUmlnaHQoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGlmIChsZW5ndGggPT09IDAgJiYgb3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihSRURVQ0VfT0ZfRU1QVFlfQVJSQVlfV0lUSF9OT19JTklUSUFMX1ZBTFVFKTtcbiAgICB9XG5cbiAgICBsZXQgYWNjdW11bGF0b3IsIHN0YXJ0O1xuICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtsZW5ndGggLSAxXSk7XG4gICAgICBzdGFydCA9IGxlbmd0aCAtIDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gb3B0c1swXTtcbiAgICAgIHN0YXJ0ID0gbGVuZ3RoIC0gMTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNhbGxiYWNrKFxuICAgICAgICBhY2N1bXVsYXRvcixcbiAgICAgICAgY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pLFxuICAgICAgICBpLFxuICAgICAgICB0aGlzXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5mb3JlYWNoICovXG4gIGZvckVhY2goY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgaSxcbiAgICAgICAgdGhpcyxcbiAgICAgIF0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kICovXG4gIGZpbmQoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gICAgICBpZiAoUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdmFsdWUsIGksIHRoaXNdKSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbmRpbmRleCAqL1xuICBmaW5kSW5kZXgoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG4gICAgICBpZiAoUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdmFsdWUsIGksIHRoaXNdKSkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtYXJyYXktZmluZC1mcm9tLWxhc3QvaW5kZXguaHRtbCNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kbGFzdCAqL1xuICBmaW5kTGFzdChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gbGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9wcm9wb3NhbC1hcnJheS1maW5kLWZyb20tbGFzdC9pbmRleC5odG1sI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbmRsYXN0aW5kZXggKi9cbiAgZmluZExhc3RJbmRleChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gbGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmV2ZXJ5ICovXG4gIGV2ZXJ5KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChcbiAgICAgICAgIVJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW1xuICAgICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgICBpLFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgIF0pXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNvbWUgKi9cbiAgc29tZShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoXG4gICAgICAgIFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW1xuICAgICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgICBpLFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgIF0pXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNldCAqL1xuICBzZXQoaW5wdXQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCB0YXJnZXRPZmZzZXQgPSBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pO1xuICAgIGlmICh0YXJnZXRPZmZzZXQgPCAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVSYW5nZUVycm9yKE9GRlNFVF9JU19PVVRfT0ZfQk9VTkRTKTtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXQgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBDQU5OT1RfQ09OVkVSVF9VTkRFRklORURfT1JfTlVMTF9UT19PQkpFQ1RcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGlzTmF0aXZlQmlnSW50VHlwZWRBcnJheShpbnB1dCkpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgQ0FOTk9UX01JWF9CSUdJTlRfQU5EX09USEVSX1RZUEVTXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICBpZiAoaXNGbG9hdDE2QXJyYXkoaW5wdXQpKSB7XG4gICAgICAvLyBwZWVsIG9mZiBQcm94eVxuICAgICAgcmV0dXJuIFR5cGVkQXJyYXlQcm90b3R5cGVTZXQoXG4gICAgICAgIGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyksXG4gICAgICAgIGdldEZsb2F0MTZCaXRzQXJyYXkoaW5wdXQpLFxuICAgICAgICB0YXJnZXRPZmZzZXRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGlzTmF0aXZlVHlwZWRBcnJheShpbnB1dCkpIHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoaW5wdXQpO1xuICAgICAgaWYgKElzRGV0YWNoZWRCdWZmZXIoYnVmZmVyKSkge1xuICAgICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldExlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICBjb25zdCBzcmMgPSBOYXRpdmVPYmplY3QoaW5wdXQpO1xuICAgIGNvbnN0IHNyY0xlbmd0aCA9IFRvTGVuZ3RoKHNyYy5sZW5ndGgpO1xuXG4gICAgaWYgKHRhcmdldE9mZnNldCA9PT0gSW5maW5pdHkgfHwgc3JjTGVuZ3RoICsgdGFyZ2V0T2Zmc2V0ID4gdGFyZ2V0TGVuZ3RoKSB7XG4gICAgICB0aHJvdyBOYXRpdmVSYW5nZUVycm9yKE9GRlNFVF9JU19PVVRfT0ZfQk9VTkRTKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNyY0xlbmd0aDsgKytpKSB7XG4gICAgICBmbG9hdDE2Yml0c0FycmF5W2kgKyB0YXJnZXRPZmZzZXRdID0gcm91bmRUb0Zsb2F0MTZCaXRzKHNyY1tpXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJldmVyc2UgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBUeXBlZEFycmF5UHJvdG90eXBlUmV2ZXJzZShmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbGwgKi9cbiAgZmlsbCh2YWx1ZSwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVGaWxsKFxuICAgICAgZmxvYXQxNmJpdHNBcnJheSxcbiAgICAgIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSksXG4gICAgICAuLi5zYWZlSWZOZWVkZWQob3B0cylcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuY29weXdpdGhpbiAqL1xuICBjb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBUeXBlZEFycmF5UHJvdG90eXBlQ29weVdpdGhpbihmbG9hdDE2Yml0c0FycmF5LCB0YXJnZXQsIHN0YXJ0LCAuLi5zYWZlSWZOZWVkZWQob3B0cykpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc29ydCAqL1xuICBzb3J0KC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBjb21wYXJlID0gb3B0c1swXSAhPT0gdW5kZWZpbmVkID8gb3B0c1swXSA6IGRlZmF1bHRDb21wYXJlO1xuICAgIFR5cGVkQXJyYXlQcm90b3R5cGVTb3J0KGZsb2F0MTZiaXRzQXJyYXksICh4LCB5KSA9PiB7XG4gICAgICByZXR1cm4gY29tcGFyZShjb252ZXJ0VG9OdW1iZXIoeCksIGNvbnZlcnRUb051bWJlcih5KSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zbGljZSAqL1xuICBzbGljZSguLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgQ29uc3RydWN0b3IgPSBTcGVjaWVzQ29uc3RydWN0b3IoZmxvYXQxNmJpdHNBcnJheSwgRmxvYXQxNkFycmF5KTtcblxuICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICBpZiAoQ29uc3RydWN0b3IgPT09IEZsb2F0MTZBcnJheSkge1xuICAgICAgY29uc3QgdWludDE2ID0gbmV3IE5hdGl2ZVVpbnQxNkFycmF5KFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldChmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KVxuICAgICAgKTtcbiAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVTbGljZSh1aW50MTYsIC4uLnNhZmVJZk5lZWRlZChvcHRzKSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHN0YXJ0ID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBjb25zdCBlbmQgPSBvcHRzWzFdID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMV0pO1xuXG4gICAgbGV0IGs7XG4gICAgaWYgKHN0YXJ0ID09PSAtSW5maW5pdHkpIHtcbiAgICAgIGsgPSAwO1xuICAgIH0gZWxzZSBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICBrID0gbGVuZ3RoICsgc3RhcnQgPiAwID8gbGVuZ3RoICsgc3RhcnQgOiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBrID0gbGVuZ3RoIDwgc3RhcnQgPyBsZW5ndGggOiBzdGFydDtcbiAgICB9XG5cbiAgICBsZXQgZmluYWw7XG4gICAgaWYgKGVuZCA9PT0gLUluZmluaXR5KSB7XG4gICAgICBmaW5hbCA9IDA7XG4gICAgfSBlbHNlIGlmIChlbmQgPCAwKSB7XG4gICAgICBmaW5hbCA9IGxlbmd0aCArIGVuZCA+IDAgPyBsZW5ndGggKyBlbmQgOiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaW5hbCA9IGxlbmd0aCA8IGVuZCA/IGxlbmd0aCA6IGVuZDtcbiAgICB9XG5cbiAgICBjb25zdCBjb3VudCA9IGZpbmFsIC0gayA+IDAgPyBmaW5hbCAtIGsgOiAwO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGNvdW50KTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSwgY291bnQpO1xuXG4gICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIpO1xuICAgIH1cblxuICAgIGxldCBuID0gMDtcbiAgICB3aGlsZSAoayA8IGZpbmFsKSB7XG4gICAgICBhcnJheVtuXSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2tdKTtcbiAgICAgICsraztcbiAgICAgICsrbjtcbiAgICB9XG5cbiAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChhcnJheSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc3ViYXJyYXkgKi9cbiAgc3ViYXJyYXkoLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG5cbiAgICBjb25zdCB1aW50MTYgPSBuZXcgTmF0aXZlVWludDE2QXJyYXkoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpXG4gICAgKTtcbiAgICBjb25zdCB1aW50MTZTdWJhcnJheSA9IFR5cGVkQXJyYXlQcm90b3R5cGVTdWJhcnJheSh1aW50MTYsIC4uLnNhZmVJZk5lZWRlZChvcHRzKSk7XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3RvcihcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIodWludDE2U3ViYXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQodWludDE2U3ViYXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aCh1aW50MTZTdWJhcnJheSlcbiAgICApO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5KTtcblxuICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKGFycmF5KTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5pbmRleG9mICovXG4gIGluZGV4T2YoZWxlbWVudCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICBsZXQgZnJvbSA9IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSk7XG4gICAgaWYgKGZyb20gPT09IEluZmluaXR5KSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICBmcm9tID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoXG4gICAgICAgIE9iamVjdEhhc093bihmbG9hdDE2Yml0c0FycmF5LCBpKSAmJlxuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSkgPT09IGVsZW1lbnRcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUubGFzdGluZGV4b2YgKi9cbiAgbGFzdEluZGV4T2YoZWxlbWVudCwgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICBsZXQgZnJvbSA9IG9wdHMubGVuZ3RoID49IDEgPyBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pIDogbGVuZ3RoIC0gMTtcbiAgICBpZiAoZnJvbSA9PT0gLUluZmluaXR5KSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKGZyb20gPj0gMCkge1xuICAgICAgZnJvbSA9IGZyb20gPCBsZW5ndGggLSAxID8gZnJvbSA6IGxlbmd0aCAtIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBmcm9tOyBpID49IDA7IC0taSkge1xuICAgICAgaWYgKFxuICAgICAgICBPYmplY3RIYXNPd24oZmxvYXQxNmJpdHNBcnJheSwgaSkgJiZcbiAgICAgICAgY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pID09PSBlbGVtZW50XG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmluY2x1ZGVzICovXG4gIGluY2x1ZGVzKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgbGV0IGZyb20gPSBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pO1xuICAgIGlmIChmcm9tID09PSBJbmZpbml0eSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgZnJvbSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaXNOYU4gPSBOdW1iZXJJc05hTihlbGVtZW50KTtcbiAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcblxuICAgICAgaWYgKGlzTmFOICYmIE51bWJlcklzTmFOKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlID09PSBlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5qb2luICovXG4gIGpvaW4oLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGFycmF5ID0gY29weVRvQXJyYXkoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICByZXR1cm4gQXJyYXlQcm90b3R5cGVKb2luKGFycmF5LCAuLi5zYWZlSWZOZWVkZWQob3B0cykpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnRvbG9jYWxlc3RyaW5nICovXG4gIHRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgcmV0dXJuIEFycmF5UHJvdG90eXBlVG9Mb2NhbGVTdHJpbmcoYXJyYXksIC4uLnNhZmVJZk5lZWRlZChvcHRzKSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWdldC0ldHlwZWRhcnJheSUucHJvdG90eXBlLUBAdG9zdHJpbmd0YWcgKi9cbiAgZ2V0IFtTeW1ib2xUb1N0cmluZ1RhZ10oKSB7XG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KHRoaXMpKSB7XG4gICAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChcIkZsb2F0MTZBcnJheVwiKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10eXBlZGFycmF5LmJ5dGVzX3Blcl9lbGVtZW50ICovXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXksIFwiQllURVNfUEVSX0VMRU1FTlRcIiwge1xuICB2YWx1ZTogQllURVNfUEVSX0VMRU1FTlQsXG59KTtcblxuLy8gbGltaXRhdGlvbjogSXQgaXMgcGVha2VkIGJ5IGBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKEZsb2F0MTZBcnJheSlgIGFuZCBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXksIGJyYW5kLCB7fSk7XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtcHJvcGVydGllcy1vZi10aGUtdHlwZWRhcnJheS1jb25zdHJ1Y3RvcnMgKi9cblJlZmxlY3RTZXRQcm90b3R5cGVPZihGbG9hdDE2QXJyYXksIFR5cGVkQXJyYXkpO1xuXG5jb25zdCBGbG9hdDE2QXJyYXlQcm90b3R5cGUgPSBGbG9hdDE2QXJyYXkucHJvdG90eXBlO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXR5cGVkYXJyYXkucHJvdG90eXBlLmJ5dGVzX3Blcl9lbGVtZW50ICovXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXlQcm90b3R5cGUsIFwiQllURVNfUEVSX0VMRU1FTlRcIiwge1xuICB2YWx1ZTogQllURVNfUEVSX0VMRU1FTlQsXG59KTtcblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLUBAaXRlcmF0b3IgKi9cbk9iamVjdERlZmluZVByb3BlcnR5KEZsb2F0MTZBcnJheVByb3RvdHlwZSwgU3ltYm9sSXRlcmF0b3IsIHtcbiAgdmFsdWU6IEZsb2F0MTZBcnJheVByb3RvdHlwZS52YWx1ZXMsXG4gIHdyaXRhYmxlOiB0cnVlLFxuICBjb25maWd1cmFibGU6IHRydWUsXG59KTtcblxuLy8gVG8gbWFrZSBgbmV3IEZsb2F0MTZBcnJheSgpIGluc3RhbmNlb2YgVWludDE2QXJyYXlgIHJldHVybnMgYGZhbHNlYFxuUmVmbGVjdFNldFByb3RvdHlwZU9mKEZsb2F0MTZBcnJheVByb3RvdHlwZSwgVHlwZWRBcnJheVByb3RvdHlwZSk7XG4iLCJpbXBvcnQgeyBpc0Zsb2F0MTZBcnJheSB9IGZyb20gXCIuL0Zsb2F0MTZBcnJheS5tanNcIjtcbmltcG9ydCB7IGlzTmF0aXZlVHlwZWRBcnJheSB9IGZyb20gXCIuL191dGlsL2lzLm1qc1wiO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVWludDhBcnJheXxVaW50OENsYW1wZWRBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxJbnQ4QXJyYXl8SW50MTZBcnJheXxJbnQzMkFycmF5fEZsb2F0MTZBcnJheXxGbG9hdDMyQXJyYXl8RmxvYXQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fEJpZ0ludDY0QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1R5cGVkQXJyYXkodGFyZ2V0KSB7XG4gIHJldHVybiBpc05hdGl2ZVR5cGVkQXJyYXkodGFyZ2V0KSB8fCBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpO1xufVxuIiwiaW1wb3J0IHsgc2FmZUlmTmVlZGVkIH0gZnJvbSBcIi4vX3V0aWwvYXJyYXlJdGVyYXRvci5tanNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHtcbiAgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYsXG4gIERhdGFWaWV3UHJvdG90eXBlU2V0VWludDE2LFxufSBmcm9tIFwiLi9fdXRpbC9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiByZXR1cm5zIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlld1xuICpcbiAqIEBwYXJhbSB7RGF0YVZpZXd9IGRhdGFWaWV3XG4gKiBAcGFyYW0ge251bWJlcn0gYnl0ZU9mZnNldFxuICogQHBhcmFtIHtbYm9vbGVhbl19IG9wdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCAuLi5vcHRzKSB7XG4gIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoXG4gICAgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIC4uLnNhZmVJZk5lZWRlZChvcHRzKSlcbiAgKTtcbn1cblxuLyoqXG4gKiBzdG9yZXMgYW4gdW5zaWduZWQgMTYtYml0IGZsb2F0IHZhbHVlIGF0IHRoZSBzcGVjaWZpZWQgYnl0ZSBvZmZzZXQgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIERhdGFWaWV3XG4gKlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCB2YWx1ZSwgLi4ub3B0cykge1xuICByZXR1cm4gRGF0YVZpZXdQcm90b3R5cGVTZXRVaW50MTYoXG4gICAgZGF0YVZpZXcsXG4gICAgYnl0ZU9mZnNldCxcbiAgICByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpLFxuICAgIC4uLnNhZmVJZk5lZWRlZChvcHRzKVxuICApO1xufVxuIiwiaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9fdXRpbC9jb252ZXJ0ZXIubWpzXCI7XG5pbXBvcnQgeyBDQU5OT1RfQ09OVkVSVF9BX0JJR0lOVF9WQUxVRV9UT19BX05VTUJFUiB9IGZyb20gXCIuL191dGlsL21lc3NhZ2VzLm1qc1wiO1xuaW1wb3J0IHtcbiAgTmF0aXZlTnVtYmVyLFxuICBOYXRpdmVUeXBlRXJyb3IsXG4gIE51bWJlcklzRmluaXRlLFxufSBmcm9tIFwiLi9fdXRpbC9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiByZXR1cm5zIHRoZSBuZWFyZXN0IGhhbGYtcHJlY2lzaW9uIGZsb2F0IHJlcHJlc2VudGF0aW9uIG9mIGEgbnVtYmVyXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhmcm91bmQobnVtKSB7XG4gIGlmICh0eXBlb2YgbnVtID09PSBcImJpZ2ludFwiKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKENBTk5PVF9DT05WRVJUX0FfQklHSU5UX1ZBTFVFX1RPX0FfTlVNQkVSKTtcbiAgfVxuXG4gIG51bSA9IE5hdGl2ZU51bWJlcihudW0pO1xuXG4gIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgaWYgKCFOdW1iZXJJc0Zpbml0ZShudW0pIHx8IG51bSA9PT0gMCkge1xuICAgIHJldHVybiBudW07XG4gIH1cblxuICBjb25zdCB4MTYgPSByb3VuZFRvRmxvYXQxNkJpdHMobnVtKTtcbiAgcmV0dXJuIGNvbnZlcnRUb051bWJlcih4MTYpO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0VBQU8sTUFBTSxxQkFBcUIsR0FBRyx1QkFBdUIsQ0FBQztFQUN0RCxNQUFNLGlDQUFpQyxHQUFHLG1DQUFtQyxDQUFDO0VBQzlFLE1BQU0sa0RBQWtEO0VBQy9ELEVBQUUsb0RBQW9ELENBQUM7RUFDaEQsTUFBTSwrQ0FBK0M7RUFDNUQsRUFBRSxpREFBaUQsQ0FBQztFQUM3QyxNQUFNLGtEQUFrRDtFQUMvRCxFQUFFLHFEQUFxRCxDQUFDO0VBQ2pELE1BQU0sd0VBQXdFO0VBQ3JGLEVBQUUsMEVBQTBFLENBQUM7RUFDdEUsTUFBTSx5Q0FBeUM7RUFDdEQsRUFBRSwyQ0FBMkMsQ0FBQztFQUN2QyxNQUFNLDBDQUEwQztFQUN2RCxFQUFFLDRDQUE0QyxDQUFDO0VBQ3hDLE1BQU0seUNBQXlDO0VBQ3RELEVBQUUsMkNBQTJDLENBQUM7RUFDdkMsTUFBTSxpQ0FBaUM7RUFDOUMsRUFBRSw2REFBNkQsQ0FBQztFQUN6RCxNQUFNLGlDQUFpQyxHQUFHLHFDQUFxQyxDQUFDO0VBQ2hGLE1BQU0sMkNBQTJDO0VBQ3hELEVBQUUsNkNBQTZDLENBQUM7RUFDekMsTUFBTSx1QkFBdUIsR0FBRyx5QkFBeUI7O0VDZmhFLFNBQVMsV0FBVyxDQUFDLE1BQU0sRUFBRTtFQUM3QixFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLEtBQUs7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
