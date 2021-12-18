/*! @petamoriken/float16 v3.5.11-22-g3193776 | MIT License - https://git.io/float16 */

const float16 = (function (exports) {
  'use strict';

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
  const ObjectPrototypeIsPrototypeOf = uncurryThis(ObjectPrototype.isPrototypeOf);
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
  const ArrayBufferPrototypeSlice = uncurryThis(NativeArrayBuffer.prototype.slice);
  const ArrayBufferPrototypeGetByteLength = uncurryThisGetter(NativeArrayBuffer.prototype, "byteLength");
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
  const NativeSet = Set;
  const SetPrototype = NativeSet.prototype;
  const SetPrototypeAdd = uncurryThis(SetPrototype.add);
  const SetPrototypeHas = uncurryThis(SetPrototype.has);
  const NativeWeakMap = WeakMap;
  const WeakMapPrototype = NativeWeakMap.prototype;
  const WeakMapPrototypeGet = uncurryThis(WeakMapPrototype.get);
  const WeakMapPrototypeHas = uncurryThis(WeakMapPrototype.has);
  const WeakMapPrototypeSet = uncurryThis(WeakMapPrototype.set);

  function toSafe(array) {
    if (array[SymbolIterator] === NativeArrayPrototypeSymbolIterator) {
      return array;
    }
    const arrayIterator = ArrayPrototypeSymbolIterator(array);
    return ObjectCreate(null, {
      next: {
        value: function next() {
          return ArrayIteratorPrototypeNext(arrayIterator);
        },
      },
      [SymbolIterator]: {
        value: function values() {
          return this;
        },
      },
    });
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
    [SymbolToStringTag]: {
      value: "Array Iterator",
      configurable: true,
    },
  });
  function wrapGenerator(generator) {
    const dummy = ObjectCreate(DummyArrayIteratorPrototype);
    WeakMapPrototypeSet(generators, dummy, generator);
    return dummy;
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
  mantissaTable[0] = 0;
  for (let i = 1; i < 1024; ++i) {
    let m = i << 13;
    let e = 0;
    while((m & 0x00800000) === 0) {
      e -= 0x00800000;
      m <<= 1;
    }
    m &= ~0x00800000;
    e += 0x38800000;
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
  function convertToNumber(float16bits) {
    const m = float16bits >> 10;
    uint32View[0] = mantissaTable[offsetTable[m] + (float16bits & 0x3ff)] + exponentTable[m];
    return floatView[0];
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
  const brand = SymbolFor("__Float16Array__");
  const float16bitsArrays = new NativeWeakMap();
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
  const TypedArrayPrototypeGetterKeys = new NativeSet();
  for (const key of ReflectOwnKeys(TypedArrayPrototype)) {
    if (key === SymbolToStringTag) {
      continue;
    }
    const descriptor = ReflectGetOwnPropertyDescriptor(TypedArrayPrototype, key);
    if (ObjectHasOwn(descriptor, "get")) {
      SetPrototypeAdd(TypedArrayPrototypeGetterKeys, key);
    }
  }
  const handler = ObjectFreeze( ({
    get(target, key, receiver) {
      if (isCanonicalIntegerIndexString(key) && ObjectHasOwn(target, key)) {
        return convertToNumber(ReflectGet(target, key));
      }
      if (
        SetPrototypeHas(TypedArrayPrototypeGetterKeys, key) &&
        ObjectPrototypeIsPrototypeOf(TypedArrayPrototype, target)
      ) {
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
                ReflectApply(mapFunc, this, [val, ...toSafe(args)])
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
      return wrapGenerator((function* () {
        for (const val of TypedArrayPrototypeValues(float16bitsArray)) {
          yield convertToNumber(val);
        }
      })());
    }
    entries() {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      return wrapGenerator((function* () {
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
        ...toSafe(opts)
      );
      return this;
    }
    copyWithin(target, start, ...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      TypedArrayPrototypeCopyWithin(float16bitsArray, target, start, ...toSafe(opts));
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
      const uint16Subarray = TypedArrayPrototypeSubarray(uint16, ...toSafe(opts));
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
      return ArrayPrototypeJoin(array, ...toSafe(opts));
    }
    toLocaleString(...opts) {
      assertFloat16Array(this);
      const float16bitsArray = getFloat16BitsArray(this);
      const array = copyToArray(float16bitsArray);
      return ArrayPrototypeToLocaleString(array, ...toSafe(opts));
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

  function getFloat16(dataView, byteOffset, ...opts) {
    return convertToNumber(
      DataViewPrototypeGetUint16(dataView, byteOffset, ...toSafe(opts))
    );
  }
  function setFloat16(dataView, byteOffset, value, ...opts) {
    return DataViewPrototypeSetUint16(
      dataView,
      byteOffset,
      roundToFloat16Bits(value),
      ...toSafe(opts)
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

  function isTypedArray(target) {
    return isNativeTypedArray(target) || isFloat16Array(target);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXQxNi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL191dGlsL3ByaW1vcmRpYWxzLm1qcyIsIi4uL3NyYy9fdXRpbC9hcnJheUl0ZXJhdG9yLm1qcyIsIi4uL3NyYy9fdXRpbC9jb252ZXJ0ZXIubWpzIiwiLi4vc3JjL191dGlsL2lzLm1qcyIsIi4uL3NyYy9fdXRpbC9tZXNzYWdlcy5tanMiLCIuLi9zcmMvX3V0aWwvc3BlYy5tanMiLCIuLi9zcmMvRmxvYXQxNkFycmF5Lm1qcyIsIi4uL3NyYy9EYXRhVmlldy5tanMiLCIuLi9zcmMvaGZyb3VuZC5tanMiLCIuLi9zcmMvaW5kZXgubWpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscywgbm8tcmVzdHJpY3RlZC1zeW50YXggKi9cbi8qIGdsb2JhbCBTaGFyZWRBcnJheUJ1ZmZlciAqL1xuXG4vKiogQHR5cGUgeyh0YXJnZXQ6IEZ1bmN0aW9uKSA9PiAodGhpc0FyZzogYW55LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55fSAqL1xuZnVuY3Rpb24gdW5jdXJyeVRoaXModGFyZ2V0KSB7XG4gIHJldHVybiAodGhpc0FyZywgLi4uYXJncykgPT4ge1xuICAgIHJldHVybiBSZWZsZWN0QXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn1cblxuLyoqIEB0eXBlIHsodGFyZ2V0OiBhbnksIGtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiAodGhpc0FyZzogYW55LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55fSAqL1xuZnVuY3Rpb24gdW5jdXJyeVRoaXNHZXR0ZXIodGFyZ2V0LCBrZXkpIHtcbiAgcmV0dXJuIHVuY3VycnlUaGlzKFxuICAgIFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXG4gICAgICB0YXJnZXQsXG4gICAgICBrZXlcbiAgICApLmdldFxuICApO1xufVxuXG4vLyBSZWZsZWN0XG5leHBvcnQgY29uc3Qge1xuICBhcHBseTogUmVmbGVjdEFwcGx5LFxuICBjb25zdHJ1Y3Q6IFJlZmxlY3RDb25zdHJ1Y3QsXG4gIGRlZmluZVByb3BlcnR5OiBSZWZsZWN0RGVmaW5lUHJvcGVydHksXG4gIGdldDogUmVmbGVjdEdldCxcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICBnZXRQcm90b3R5cGVPZjogUmVmbGVjdEdldFByb3RvdHlwZU9mLFxuICBoYXM6IFJlZmxlY3RIYXMsXG4gIG93bktleXM6IFJlZmxlY3RPd25LZXlzLFxuICBzZXQ6IFJlZmxlY3RTZXQsXG4gIHNldFByb3RvdHlwZU9mOiBSZWZsZWN0U2V0UHJvdG90eXBlT2YsXG59ID0gUmVmbGVjdDtcblxuLy8gUHJveHlcbmV4cG9ydCBjb25zdCBOYXRpdmVQcm94eSA9IFByb3h5O1xuXG4vLyBOdW1iZXJcbmV4cG9ydCBjb25zdCBOYXRpdmVOdW1iZXIgPSBOdW1iZXI7XG5leHBvcnQgY29uc3Qge1xuICBpc0Zpbml0ZTogTnVtYmVySXNGaW5pdGUsXG4gIGlzTmFOOiBOdW1iZXJJc05hTixcbn0gPSBOYXRpdmVOdW1iZXI7XG5cbi8vIFN5bWJvbFxuZXhwb3J0IGNvbnN0IHtcbiAgaXRlcmF0b3I6IFN5bWJvbEl0ZXJhdG9yLFxuICBzcGVjaWVzOiBTeW1ib2xTcGVjaWVzLFxuICB0b1N0cmluZ1RhZzogU3ltYm9sVG9TdHJpbmdUYWcsXG4gIGZvcjogU3ltYm9sRm9yLFxufSA9IFN5bWJvbDtcblxuLy8gT2JqZWN0XG5leHBvcnQgY29uc3QgTmF0aXZlT2JqZWN0ID0gT2JqZWN0O1xuZXhwb3J0IGNvbnN0IHtcbiAgY3JlYXRlOiBPYmplY3RDcmVhdGUsXG4gIGRlZmluZVByb3BlcnR5OiBPYmplY3REZWZpbmVQcm9wZXJ0eSxcbiAgZnJlZXplOiBPYmplY3RGcmVlemUsXG4gIGlzOiBPYmplY3RJcyxcbn0gPSBOYXRpdmVPYmplY3Q7XG5jb25zdCBPYmplY3RQcm90b3R5cGUgPSBOYXRpdmVPYmplY3QucHJvdG90eXBlO1xuZXhwb3J0IGNvbnN0IE9iamVjdFByb3RvdHlwZUlzUHJvdG90eXBlT2YgPSB1bmN1cnJ5VGhpcyhPYmplY3RQcm90b3R5cGUuaXNQcm90b3R5cGVPZik7XG4vKiogQHR5cGUgeyhvYmplY3Q6IG9iamVjdCwga2V5OiBQcm9wZXJ0eUtleSkgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBPYmplY3RIYXNPd24gPSAvKiogQHR5cGUge2FueX0gKi8gKE5hdGl2ZU9iamVjdCkuaGFzT3duIHx8XG4gIHVuY3VycnlUaGlzKE9iamVjdFByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG5cbi8vIEFycmF5XG5jb25zdCBOYXRpdmVBcnJheSA9IEFycmF5O1xuZXhwb3J0IGNvbnN0IEFycmF5SXNBcnJheSA9IE5hdGl2ZUFycmF5LmlzQXJyYXk7XG5jb25zdCBBcnJheVByb3RvdHlwZSA9IE5hdGl2ZUFycmF5LnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KGFycmF5OiBBcnJheUxpa2U8dW5rbm93bj4sIHNlcGFyYXRvcj86IHN0cmluZykgPT4gc3RyaW5nfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5UHJvdG90eXBlSm9pbiA9IHVuY3VycnlUaGlzKEFycmF5UHJvdG90eXBlLmpvaW4pO1xuLyoqIEB0eXBlIHs8VD4oYXJyYXk6IFRbXSwgLi4uaXRlbXM6IFRbXSkgPT4gbnVtYmVyfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5UHJvdG90eXBlUHVzaCA9IHVuY3VycnlUaGlzKEFycmF5UHJvdG90eXBlLnB1c2gpO1xuLyoqIEB0eXBlIHsoYXJyYXk6IEFycmF5TGlrZTx1bmtub3duPiwgLi4ub3B0czogYW55W10pID0+IHN0cmluZ30gKi9cbmV4cG9ydCBjb25zdCBBcnJheVByb3RvdHlwZVRvTG9jYWxlU3RyaW5nID0gdW5jdXJyeVRoaXMoXG4gIEFycmF5UHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nXG4pO1xuZXhwb3J0IGNvbnN0IE5hdGl2ZUFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IgPSBBcnJheVByb3RvdHlwZVtTeW1ib2xJdGVyYXRvcl07XG4vKiogQHR5cGUgezxUPihhcnJheTogVFtdKSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFQ+fSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IgPSB1bmN1cnJ5VGhpcyhOYXRpdmVBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yKTtcblxuLy8gTWF0aFxuZXhwb3J0IGNvbnN0IE1hdGhUcnVuYyA9IE1hdGgudHJ1bmM7XG5cbi8vIEFycmF5QnVmZmVyXG5leHBvcnQgY29uc3QgTmF0aXZlQXJyYXlCdWZmZXIgPSBBcnJheUJ1ZmZlcjtcbmV4cG9ydCBjb25zdCBBcnJheUJ1ZmZlcklzVmlldyA9IE5hdGl2ZUFycmF5QnVmZmVyLmlzVmlldztcbi8qKiBAdHlwZSB7KGJ1ZmZlcjogQXJyYXlCdWZmZXIsIGJlZ2luPzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IG51bWJlcn0gKi9cbmV4cG9ydCBjb25zdCBBcnJheUJ1ZmZlclByb3RvdHlwZVNsaWNlID0gdW5jdXJyeVRoaXMoTmF0aXZlQXJyYXlCdWZmZXIucHJvdG90eXBlLnNsaWNlKTtcbi8qKiBAdHlwZSB7KGJ1ZmZlcjogQXJyYXlCdWZmZXIpID0+IEFycmF5QnVmZmVyfSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCA9IHVuY3VycnlUaGlzR2V0dGVyKE5hdGl2ZUFycmF5QnVmZmVyLnByb3RvdHlwZSwgXCJieXRlTGVuZ3RoXCIpO1xuXG4vLyBTaGFyZWRBcnJheUJ1ZmZlclxuZXhwb3J0IGNvbnN0IE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyID0gdHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyICE9PSBcInVuZGVmaW5lZFwiID8gU2hhcmVkQXJyYXlCdWZmZXIgOiBudWxsO1xuLyoqIEB0eXBlIHsoYnVmZmVyOiBTaGFyZWRBcnJheUJ1ZmZlcikgPT4gU2hhcmVkQXJyYXlCdWZmZXJ9ICovXG5leHBvcnQgY29uc3QgU2hhcmVkQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoID0gTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXJcbiAgJiYgdW5jdXJyeVRoaXNHZXR0ZXIoTmF0aXZlU2hhcmVkQXJyYXlCdWZmZXIucHJvdG90eXBlLCBcImJ5dGVMZW5ndGhcIik7XG5cbi8vIFR5cGVkQXJyYXlcbi8qKiBAdHlwZWRlZiB7VWludDhBcnJheXxVaW50OENsYW1wZWRBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxJbnQ4QXJyYXl8SW50MTZBcnJheXxJbnQzMkFycmF5fEZsb2F0MzJBcnJheXxGbG9hdDY0QXJyYXl8QmlnVWludDY0QXJyYXl8QmlnSW50NjRBcnJheX0gVHlwZWRBcnJheSAqL1xuLyoqIEB0eXBlIHthbnl9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheSA9IFJlZmxlY3RHZXRQcm90b3R5cGVPZihVaW50OEFycmF5KTtcbmNvbnN0IFR5cGVkQXJyYXlGcm9tID0gVHlwZWRBcnJheS5mcm9tO1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGUgPSBUeXBlZEFycmF5LnByb3RvdHlwZTtcbmV4cG9ydCBjb25zdCBOYXRpdmVUeXBlZEFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IgPSBUeXBlZEFycmF5UHJvdG90eXBlW1N5bWJvbEl0ZXJhdG9yXTtcbi8qKiBAdHlwZSB7KHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IEl0ZXJhYmxlSXRlcmF0b3I8bnVtYmVyPn0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlS2V5cyA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUua2V5cyk7XG4vKiogQHR5cGUgeyh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBJdGVyYWJsZUl0ZXJhdG9yPG51bWJlcj59ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVZhbHVlcyA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLnZhbHVlc1xuKTtcbi8qKiBAdHlwZSB7KHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IEl0ZXJhYmxlSXRlcmF0b3I8W251bWJlciwgbnVtYmVyXT59ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUVudHJpZXMgPSB1bmN1cnJ5VGhpcyhcbiAgVHlwZWRBcnJheVByb3RvdHlwZS5lbnRyaWVzXG4pO1xuLyoqIEB0eXBlIHsodHlwZWRBcnJheTogVHlwZWRBcnJheSwgYXJyYXk6IEFycmF5TGlrZTxudW1iZXI+LCBvZmZzZXQ/OiBudW1iZXIpID0+IHZvaWR9ICovXG5leHBvcnQgY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZVNldCA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUuc2V0KTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBUKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVSZXZlcnNlID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUucmV2ZXJzZVxuKTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCB2YWx1ZTogbnVtYmVyLCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVGaWxsID0gdW5jdXJyeVRoaXMoVHlwZWRBcnJheVByb3RvdHlwZS5maWxsKTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCB0YXJnZXQ6IG51bWJlciwgc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVDb3B5V2l0aGluID0gdW5jdXJyeVRoaXMoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUuY29weVdpdGhpblxuKTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCBjb21wYXJlRm4/OiAoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlU29ydCA9IHVuY3VycnlUaGlzKFR5cGVkQXJyYXlQcm90b3R5cGUuc29ydCk7XG4vKiogQHR5cGUgezxUIGV4dGVuZHMgVHlwZWRBcnJheT4odHlwZWRBcnJheTogVCwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gVH0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlU2xpY2UgPSB1bmN1cnJ5VGhpcyhUeXBlZEFycmF5UHJvdG90eXBlLnNsaWNlKTtcbi8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBUeXBlZEFycmF5Pih0eXBlZEFycmF5OiBULCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBUfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVTdWJhcnJheSA9IHVuY3VycnlUaGlzKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLnN1YmFycmF5XG4pO1xuLyoqIEB0eXBlIHsoKHR5cGVkQXJyYXk6IFR5cGVkQXJyYXkpID0+IEFycmF5QnVmZmVyKX0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyID0gdW5jdXJyeVRoaXNHZXR0ZXIoXG4gIFR5cGVkQXJyYXlQcm90b3R5cGUsXG4gIFwiYnVmZmVyXCJcbik7XG4vKiogQHR5cGUgeygodHlwZWRBcnJheTogVHlwZWRBcnJheSkgPT4gbnVtYmVyKX0gKi9cbmV4cG9ydCBjb25zdCBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldCA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBcImJ5dGVPZmZzZXRcIlxuKTtcbi8qKiBAdHlwZSB7KCh0eXBlZEFycmF5OiBUeXBlZEFycmF5KSA9PiBudW1iZXIpfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGggPSB1bmN1cnJ5VGhpc0dldHRlcihcbiAgVHlwZWRBcnJheVByb3RvdHlwZSxcbiAgXCJsZW5ndGhcIlxuKTtcbi8qKiBAdHlwZSB7KHRhcmdldDogdW5rbm93bikgPT4gc3RyaW5nfSAqL1xuZXhwb3J0IGNvbnN0IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRTeW1ib2xUb1N0cmluZ1RhZyA9IHVuY3VycnlUaGlzR2V0dGVyKFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBTeW1ib2xUb1N0cmluZ1RhZ1xuKTtcblxuLy8gVWludDE2QXJyYXlcbmV4cG9ydCBjb25zdCBOYXRpdmVVaW50MTZBcnJheSA9IFVpbnQxNkFycmF5O1xuLyoqIEB0eXBlIHtVaW50MTZBcnJheUNvbnN0cnVjdG9yW1wiZnJvbVwiXX0gKi9cbmV4cG9ydCBjb25zdCBVaW50MTZBcnJheUZyb20gPSAoLi4uYXJncykgPT4ge1xuICByZXR1cm4gUmVmbGVjdEFwcGx5KFR5cGVkQXJyYXlGcm9tLCBOYXRpdmVVaW50MTZBcnJheSwgYXJncyk7XG59O1xuXG4vLyBVaW50MzJBcnJheVxuZXhwb3J0IGNvbnN0IE5hdGl2ZVVpbnQzMkFycmF5ID0gVWludDMyQXJyYXk7XG5cbi8vIEZsb2F0MzJBcnJheVxuZXhwb3J0IGNvbnN0IE5hdGl2ZUZsb2F0MzJBcnJheSA9IEZsb2F0MzJBcnJheTtcblxuLy8gQXJyYXlJdGVyYXRvclxuLyoqIEB0eXBlIHthbnl9ICovXG5jb25zdCBBcnJheUl0ZXJhdG9yUHJvdG90eXBlID0gUmVmbGVjdEdldFByb3RvdHlwZU9mKFtdW1N5bWJvbEl0ZXJhdG9yXSgpKTtcbi8qKiBAdHlwZSB7PFQ+KGFycmF5SXRlcmF0b3I6IEl0ZXJhYmxlSXRlcmF0b3I8VD4pID0+IEl0ZXJhdG9yUmVzdWx0PFQ+fSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5SXRlcmF0b3JQcm90b3R5cGVOZXh0ID0gdW5jdXJyeVRoaXMoQXJyYXlJdGVyYXRvclByb3RvdHlwZS5uZXh0KTtcblxuLy8gR2VuZXJhdG9yXG4vKiogQHR5cGUgezxUID0gdW5rbm93biwgVFJldHVybiA9IGFueSwgVE5leHQgPSB1bmtub3duPihnZW5lcmF0b3I6IEdlbmVyYXRvcjxULCBUUmV0dXJuLCBUTmV4dD4sIHZhbHVlPzogVE5leHQpID0+IFR9ICovXG5leHBvcnQgY29uc3QgR2VuZXJhdG9yUHJvdG90eXBlTmV4dCA9IHVuY3VycnlUaGlzKChmdW5jdGlvbiogKCkge30pKCkubmV4dCk7XG5cbi8vIEl0ZXJhdG9yXG5leHBvcnQgY29uc3QgSXRlcmF0b3JQcm90b3R5cGUgPSBSZWZsZWN0R2V0UHJvdG90eXBlT2YoQXJyYXlJdGVyYXRvclByb3RvdHlwZSk7XG5cbi8vIERhdGFWaWV3XG5jb25zdCBEYXRhVmlld1Byb3RvdHlwZSA9IERhdGFWaWV3LnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7KGRhdGFWaWV3OiBEYXRhVmlldywgYnl0ZU9mZnNldDogbnVtYmVyLCBsaXR0bGVFbmRpYW4/OiBib29sZWFuKSA9PiBudW1iZXJ9ICovXG5leHBvcnQgY29uc3QgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYgPSB1bmN1cnJ5VGhpcyhcbiAgRGF0YVZpZXdQcm90b3R5cGUuZ2V0VWludDE2XG4pO1xuLyoqIEB0eXBlIHsoZGF0YVZpZXc6IERhdGFWaWV3LCBieXRlT2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIGxpdHRsZUVuZGlhbj86IGJvb2xlYW4pID0+IHZvaWR9ICovXG5leHBvcnQgY29uc3QgRGF0YVZpZXdQcm90b3R5cGVTZXRVaW50MTYgPSB1bmN1cnJ5VGhpcyhcbiAgRGF0YVZpZXdQcm90b3R5cGUuc2V0VWludDE2XG4pO1xuXG4vLyBFcnJvclxuZXhwb3J0IGNvbnN0IE5hdGl2ZVR5cGVFcnJvciA9IFR5cGVFcnJvcjtcbmV4cG9ydCBjb25zdCBOYXRpdmVSYW5nZUVycm9yID0gUmFuZ2VFcnJvcjtcblxuLy8gU2V0XG4vKipcbiAqIERvIG5vdCBjb25zdHJ1Y3Qgd2l0aCBhcmd1bWVudHMgdG8gYXZvaWQgY2FsbGluZyB0aGUgXCJhZGRcIiBtZXRob2RcbiAqXG4gKiBAdHlwZSB7e25ldyA8VCA9IGFueT4oKTogU2V0PFQ+fX1cbiAqL1xuZXhwb3J0IGNvbnN0IE5hdGl2ZVNldCA9IFNldDtcbmNvbnN0IFNldFByb3RvdHlwZSA9IE5hdGl2ZVNldC5wcm90b3R5cGU7XG4vKiogQHR5cGUgezxUPihzZXQ6IFNldDxUPiwgdmFsdWU6IFQpID0+IFNldDxUPn0gKi9cbmV4cG9ydCBjb25zdCBTZXRQcm90b3R5cGVBZGQgPSB1bmN1cnJ5VGhpcyhTZXRQcm90b3R5cGUuYWRkKTtcbi8qKiBAdHlwZSB7PFQ+KHNldDogU2V0PFQ+LCB2YWx1ZTogVCkgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBTZXRQcm90b3R5cGVIYXMgPSB1bmN1cnJ5VGhpcyhTZXRQcm90b3R5cGUuaGFzKTtcblxuLy8gV2Vha01hcFxuLyoqXG4gKiBEbyBub3QgY29uc3RydWN0IHdpdGggYXJndW1lbnRzIHRvIGF2b2lkIGNhbGxpbmcgdGhlIFwic2V0XCIgbWV0aG9kXG4gKlxuICogQHR5cGUge3tuZXcgPEsgZXh0ZW5kcyB7fSwgVj4oKTogV2Vha01hcDxLLCBWPn19XG4gKi9cbmV4cG9ydCBjb25zdCBOYXRpdmVXZWFrTWFwID0gV2Vha01hcDtcbmNvbnN0IFdlYWtNYXBQcm90b3R5cGUgPSBOYXRpdmVXZWFrTWFwLnByb3RvdHlwZTtcbi8qKiBAdHlwZSB7PEsgZXh0ZW5kcyB7fSwgVj4od2Vha01hcDogV2Vha01hcDxLLCBWPiwga2V5OiBLKSA9PiBWfSAqL1xuZXhwb3J0IGNvbnN0IFdlYWtNYXBQcm90b3R5cGVHZXQgPSB1bmN1cnJ5VGhpcyhXZWFrTWFwUHJvdG90eXBlLmdldCk7XG4vKiogQHR5cGUgezxLIGV4dGVuZHMge30sIFY+KHdlYWtNYXA6IFdlYWtNYXA8SywgVj4sIGtleTogSykgPT4gYm9vbGVhbn0gKi9cbmV4cG9ydCBjb25zdCBXZWFrTWFwUHJvdG90eXBlSGFzID0gdW5jdXJyeVRoaXMoV2Vha01hcFByb3RvdHlwZS5oYXMpO1xuLyoqIEB0eXBlIHs8SyBleHRlbmRzIHt9LCBWPih3ZWFrTWFwOiBXZWFrTWFwPEssIFY+LCBrZXk6IEssIHZhbHVlOiBWKSA9PiBXZWFrTWFwfSAqL1xuZXhwb3J0IGNvbnN0IFdlYWtNYXBQcm90b3R5cGVTZXQgPSB1bmN1cnJ5VGhpcyhXZWFrTWFwUHJvdG90eXBlLnNldCk7XG4iLCJpbXBvcnQge1xuICBBcnJheUl0ZXJhdG9yUHJvdG90eXBlTmV4dCxcbiAgQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvcixcbiAgR2VuZXJhdG9yUHJvdG90eXBlTmV4dCxcbiAgSXRlcmF0b3JQcm90b3R5cGUsXG4gIE5hdGl2ZUFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IsXG4gIE5hdGl2ZVdlYWtNYXAsXG4gIE9iamVjdENyZWF0ZSxcbiAgU3ltYm9sSXRlcmF0b3IsXG4gIFN5bWJvbFRvU3RyaW5nVGFnLFxuICBXZWFrTWFwUHJvdG90eXBlR2V0LFxuICBXZWFrTWFwUHJvdG90eXBlU2V0LFxufSBmcm9tIFwiLi9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiBXcmFwIEFycmF5SXRlcmF0b3IgSWYgQXJyYXkucHJvdG90eXBlIFtAQGl0ZXJhdG9yXSBoYXMgYmVlbiBtb2RpZmllZFxuICpcbiAqIEB0eXBlIHs8VD4oYXJyYXk6IFRbXSkgPT4gSXRlcmFibGU8VD59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1NhZmUoYXJyYXkpIHtcbiAgaWYgKGFycmF5W1N5bWJvbEl0ZXJhdG9yXSA9PT0gTmF0aXZlQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvcikge1xuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIGNvbnN0IGFycmF5SXRlcmF0b3IgPSBBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yKGFycmF5KTtcbiAgcmV0dXJuIE9iamVjdENyZWF0ZShudWxsLCB7XG4gICAgbmV4dDoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgIHJldHVybiBBcnJheUl0ZXJhdG9yUHJvdG90eXBlTmV4dChhcnJheUl0ZXJhdG9yKTtcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIFtTeW1ib2xJdGVyYXRvcl06IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn1cblxuLyoqIEB0eXBlIHtXZWFrTWFwPHt9LCBHZW5lcmF0b3I8YW55Pj59ICovXG5jb25zdCBnZW5lcmF0b3JzID0gbmV3IE5hdGl2ZVdlYWtNYXAoKTtcblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0lYXJyYXlpdGVyYXRvcnByb3RvdHlwZSUtb2JqZWN0ICovXG5jb25zdCBEdW1teUFycmF5SXRlcmF0b3JQcm90b3R5cGUgPSBPYmplY3RDcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtcbiAgbmV4dDoge1xuICAgIHZhbHVlOiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgY29uc3QgZ2VuZXJhdG9yID0gV2Vha01hcFByb3RvdHlwZUdldChnZW5lcmF0b3JzLCB0aGlzKTtcbiAgICAgIHJldHVybiBHZW5lcmF0b3JQcm90b3R5cGVOZXh0KGdlbmVyYXRvcik7XG4gICAgfSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gIH0sXG5cbiAgW1N5bWJvbFRvU3RyaW5nVGFnXToge1xuICAgIHZhbHVlOiBcIkFycmF5IEl0ZXJhdG9yXCIsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICB9LFxufSk7XG5cbi8qKiBAdHlwZSB7PFQ+KGdlbmVyYXRvcjogR2VuZXJhdG9yPFQ+KSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFQ+fSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBHZW5lcmF0b3IoZ2VuZXJhdG9yKSB7XG4gIGNvbnN0IGR1bW15ID0gT2JqZWN0Q3JlYXRlKER1bW15QXJyYXlJdGVyYXRvclByb3RvdHlwZSk7XG4gIFdlYWtNYXBQcm90b3R5cGVTZXQoZ2VuZXJhdG9ycywgZHVtbXksIGdlbmVyYXRvcik7XG4gIHJldHVybiBkdW1teTtcbn1cbiIsIi8vIGFsZ29yaXRobTogaHR0cDovL2ZveC10b29sa2l0Lm9yZy9mdHAvZmFzdGhhbGZmbG9hdGNvbnZlcnNpb24ucGRmXG5cbmltcG9ydCB7XG4gIE5hdGl2ZUFycmF5QnVmZmVyLFxuICBOYXRpdmVGbG9hdDMyQXJyYXksXG4gIE5hdGl2ZVVpbnQzMkFycmF5LFxufSBmcm9tIFwiLi9wcmltb3JkaWFscy5tanNcIjtcblxuY29uc3QgYnVmZmVyID0gbmV3IE5hdGl2ZUFycmF5QnVmZmVyKDQpO1xuY29uc3QgZmxvYXRWaWV3ID0gbmV3IE5hdGl2ZUZsb2F0MzJBcnJheShidWZmZXIpO1xuY29uc3QgdWludDMyVmlldyA9IG5ldyBOYXRpdmVVaW50MzJBcnJheShidWZmZXIpO1xuXG5jb25zdCBiYXNlVGFibGUgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoNTEyKTtcbmNvbnN0IHNoaWZ0VGFibGUgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoNTEyKTtcblxuZm9yIChsZXQgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBjb25zdCBlID0gaSAtIDEyNztcblxuICAvLyB2ZXJ5IHNtYWxsIG51bWJlciAoMCwgLTApXG4gIGlmIChlIDwgLTI3KSB7XG4gICAgYmFzZVRhYmxlW2ldICAgICAgICAgPSAweDAwMDA7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gMjQ7XG4gICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgLy8gc21hbGwgbnVtYmVyIChkZW5vcm0pXG4gIH0gZWxzZSBpZiAoZSA8IC0xNCkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gIDB4MDQwMCA+PiAoLWUgLSAxNCk7XG4gICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAoMHgwNDAwID4+ICgtZSAtIDE0KSkgfCAweDgwMDA7XG4gICAgc2hpZnRUYWJsZVtpXSAgICAgICAgID0gLWUgLSAxO1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IC1lIC0gMTtcblxuICAvLyBub3JtYWwgbnVtYmVyXG4gIH0gZWxzZSBpZiAoZSA8PSAxNSkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gIChlICsgMTUpIDw8IDEwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gKChlICsgMTUpIDw8IDEwKSB8IDB4ODAwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAxMztcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcblxuICAvLyBsYXJnZSBudW1iZXIgKEluZmluaXR5LCAtSW5maW5pdHkpXG4gIH0gZWxzZSBpZiAoZSA8IDEyOCkge1xuICAgIGJhc2VUYWJsZVtpXSAgICAgICAgID0gMHg3YzAwO1xuICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgIHNoaWZ0VGFibGVbaV0gICAgICAgICA9IDI0O1xuICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDI0O1xuXG4gIC8vIHN0YXkgKE5hTiwgSW5maW5pdHksIC1JbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBiYXNlVGFibGVbaV0gICAgICAgICA9IDB4N2MwMDtcbiAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ZmMwMDtcbiAgICBzaGlmdFRhYmxlW2ldICAgICAgICAgPSAxMztcbiAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcbiAgfVxufVxuXG4vKipcbiAqIHJvdW5kIGEgbnVtYmVyIHRvIGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cy5cbiAqXG4gKiBAcGFyYW0ge3Vua25vd259IG51bSAtIGRvdWJsZSBmbG9hdFxuICogQHJldHVybnMge251bWJlcn0gaGFsZiBmbG9hdCBudW1iZXIgYml0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gcm91bmRUb0Zsb2F0MTZCaXRzKG51bSkge1xuICBmbG9hdFZpZXdbMF0gPSAvKiogQHR5cGUge2FueX0gKi8gKG51bSk7XG4gIGNvbnN0IGYgPSB1aW50MzJWaWV3WzBdO1xuICBjb25zdCBlID0gKGYgPj4gMjMpICYgMHgxZmY7XG4gIHJldHVybiBiYXNlVGFibGVbZV0gKyAoKGYgJiAweDAwN2ZmZmZmKSA+PiBzaGlmdFRhYmxlW2VdKTtcbn1cblxuY29uc3QgbWFudGlzc2FUYWJsZSA9IG5ldyBOYXRpdmVVaW50MzJBcnJheSgyMDQ4KTtcbmNvbnN0IGV4cG9uZW50VGFibGUgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoNjQpO1xuY29uc3Qgb2Zmc2V0VGFibGUgPSBuZXcgTmF0aXZlVWludDMyQXJyYXkoNjQpO1xuXG5tYW50aXNzYVRhYmxlWzBdID0gMDtcbmZvciAobGV0IGkgPSAxOyBpIDwgMTAyNDsgKytpKSB7XG4gIGxldCBtID0gaSA8PCAxMzsgICAgLy8gemVybyBwYWQgbWFudGlzc2EgYml0c1xuICBsZXQgZSA9IDA7ICAgICAgICAgIC8vIHplcm8gZXhwb25lbnRcblxuICAvLyBub3JtYWxpemVkXG4gIHdoaWxlKChtICYgMHgwMDgwMDAwMCkgPT09IDApIHtcbiAgICBlIC09IDB4MDA4MDAwMDA7ICAvLyBkZWNyZW1lbnQgZXhwb25lbnRcbiAgICBtIDw8PSAxO1xuICB9XG5cbiAgbSAmPSB+MHgwMDgwMDAwMDsgICAvLyBjbGVhciBsZWFkaW5nIDEgYml0XG4gIGUgKz0gMHgzODgwMDAwMDsgICAgLy8gYWRqdXN0IGJpYXNcblxuICBtYW50aXNzYVRhYmxlW2ldID0gbSB8IGU7XG59XG5mb3IgKGxldCBpID0gMTAyNDsgaSA8IDIwNDg7ICsraSkge1xuICBtYW50aXNzYVRhYmxlW2ldID0gMHgzODAwMDAwMCArICgoaSAtIDEwMjQpIDw8IDEzKTtcbn1cblxuZXhwb25lbnRUYWJsZVswXSA9IDA7XG5mb3IgKGxldCBpID0gMTsgaSA8IDMxOyArK2kpIHtcbiAgZXhwb25lbnRUYWJsZVtpXSA9IGkgPDwgMjM7XG59XG5leHBvbmVudFRhYmxlWzMxXSA9IDB4NDc4MDAwMDA7XG5leHBvbmVudFRhYmxlWzMyXSA9IDB4ODAwMDAwMDA7XG5mb3IgKGxldCBpID0gMzM7IGkgPCA2MzsgKytpKSB7XG4gIGV4cG9uZW50VGFibGVbaV0gPSAweDgwMDAwMDAwICsgKChpIC0gMzIpIDw8IDIzKTtcbn1cbmV4cG9uZW50VGFibGVbNjNdID0gMHhjNzgwMDAwMDtcblxub2Zmc2V0VGFibGVbMF0gPSAwO1xuZm9yIChsZXQgaSA9IDE7IGkgPCA2NDsgKytpKSB7XG4gIGlmIChpID09PSAzMikge1xuICAgIG9mZnNldFRhYmxlW2ldID0gMDtcbiAgfSBlbHNlIHtcbiAgICBvZmZzZXRUYWJsZVtpXSA9IDEwMjQ7XG4gIH1cbn1cblxuLyoqXG4gKiBjb252ZXJ0IGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cyB0byBhIG51bWJlci5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gZmxvYXQxNmJpdHMgLSBoYWxmIGZsb2F0IG51bWJlciBiaXRzXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBkb3VibGUgZmxvYXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0cykge1xuICBjb25zdCBtID0gZmxvYXQxNmJpdHMgPj4gMTA7XG4gIHVpbnQzMlZpZXdbMF0gPSBtYW50aXNzYVRhYmxlW29mZnNldFRhYmxlW21dICsgKGZsb2F0MTZiaXRzICYgMHgzZmYpXSArIGV4cG9uZW50VGFibGVbbV07XG4gIHJldHVybiBmbG9hdFZpZXdbMF07XG59XG4iLCJpbXBvcnQge1xuICBBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGgsXG4gIEFycmF5SXNBcnJheSxcbiAgTWF0aFRydW5jLFxuICBOYXRpdmVBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yLFxuICBOYXRpdmVOdW1iZXIsXG4gIE5hdGl2ZVNoYXJlZEFycmF5QnVmZmVyLFxuICBOYXRpdmVUeXBlZEFycmF5UHJvdG90eXBlU3ltYm9sSXRlcmF0b3IsXG4gIE51bWJlcklzRmluaXRlLFxuICBTaGFyZWRBcnJheUJ1ZmZlclByb3RvdHlwZUdldEJ5dGVMZW5ndGgsXG4gIFN5bWJvbEl0ZXJhdG9yLFxuICBTeW1ib2xUb1N0cmluZ1RhZyxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUdldFN5bWJvbFRvU3RyaW5nVGFnLFxufSBmcm9tIFwiLi9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMge319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikgfHxcbiAgICB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMge319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIjtcbn1cblxuLy8gSW5zcGlyZWQgYnkgdXRpbC50eXBlcyBpbXBsZW1lbnRhdGlvbiBvZiBOb2RlLmpzXG4vKiogQHR5cGVkZWYge1VpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDMyQXJyYXl8RmxvYXQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fEJpZ0ludDY0QXJyYXl9IFR5cGVkQXJyYXkgKi9cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgVHlwZWRBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTmF0aXZlVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gVHlwZWRBcnJheVByb3RvdHlwZUdldFN5bWJvbFRvU3RyaW5nVGFnKHZhbHVlKSAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBCaWdJbnQ2NEFycmF5fEJpZ1VpbnQ2NEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOYXRpdmVCaWdJbnRUeXBlZEFycmF5KHZhbHVlKSB7XG4gIGNvbnN0IHR5cGVkQXJyYXlOYW1lID0gVHlwZWRBcnJheVByb3RvdHlwZUdldFN5bWJvbFRvU3RyaW5nVGFnKHZhbHVlKTtcbiAgcmV0dXJuIHR5cGVkQXJyYXlOYW1lID09PSBcIkJpZ0ludDY0QXJyYXlcIiB8fFxuICAgIHR5cGVkQXJyYXlOYW1lID09PSBcIkJpZ1VpbnQ2NEFycmF5XCI7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIEFycmF5QnVmZmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWx1ZSkge1xuICB0cnkge1xuICAgIEFycmF5QnVmZmVyUHJvdG90eXBlR2V0Qnl0ZUxlbmd0aCgvKiogQHR5cGUge2FueX0gKi8gKHZhbHVlKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgU2hhcmVkQXJyYXlCdWZmZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NoYXJlZEFycmF5QnVmZmVyKHZhbHVlKSB7XG4gIGlmIChOYXRpdmVTaGFyZWRBcnJheUJ1ZmZlciA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgU2hhcmVkQXJyYXlCdWZmZXJQcm90b3R5cGVHZXRCeXRlTGVuZ3RoKC8qKiBAdHlwZSB7YW55fSAqLyAodmFsdWUpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyB1bmtub3duW119XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09yZGluYXJ5QXJyYXkodmFsdWUpIHtcbiAgaWYgKCFBcnJheUlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHZhbHVlW1N5bWJvbEl0ZXJhdG9yXSA9PT0gTmF0aXZlQXJyYXlQcm90b3R5cGVTeW1ib2xJdGVyYXRvcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gZm9yIG90aGVyIHJlYWxtc1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgY29uc3QgaXRlcmF0b3IgPSB2YWx1ZVtTeW1ib2xJdGVyYXRvcl0oKTtcbiAgcmV0dXJuIGl0ZXJhdG9yW1N5bWJvbFRvU3RyaW5nVGFnXSA9PT0gXCJBcnJheSBJdGVyYXRvclwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmFsdWVcbiAqIEByZXR1cm5zIHt2YWx1ZSBpcyBUeXBlZEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPcmRpbmFyeU5hdGl2ZVR5cGVkQXJyYXkodmFsdWUpIHtcbiAgaWYgKCFpc05hdGl2ZVR5cGVkQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHZhbHVlW1N5bWJvbEl0ZXJhdG9yXSA9PT0gTmF0aXZlVHlwZWRBcnJheVByb3RvdHlwZVN5bWJvbEl0ZXJhdG9yKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBmb3Igb3RoZXIgcmVhbG1zXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICBjb25zdCBpdGVyYXRvciA9IHZhbHVlW1N5bWJvbEl0ZXJhdG9yXSgpO1xuICByZXR1cm4gaXRlcmF0b3JbU3ltYm9sVG9TdHJpbmdUYWddID09PSBcIkFycmF5IEl0ZXJhdG9yXCI7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIHN0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBudW1iZXIgPSBOYXRpdmVOdW1iZXIodmFsdWUpO1xuICBpZiAodmFsdWUgIT09IG51bWJlciArIFwiXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU51bWJlcklzRmluaXRlKG51bWJlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gbnVtYmVyID09PSBNYXRoVHJ1bmMobnVtYmVyKTtcbn1cbiIsImV4cG9ydCBjb25zdCBUSElTX0lTX05PVF9BTl9PQkpFQ1QgPSBcIlRoaXMgaXMgbm90IGFuIG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IFRISVNfSVNfTk9UX0FfRkxPQVQxNkFSUkFZX09CSkVDVCA9IFwiVGhpcyBpcyBub3QgYSBGbG9hdDE2QXJyYXkgb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVkgPVxuICBcIlRoaXMgY29uc3RydWN0b3IgaXMgbm90IGEgc3ViY2xhc3Mgb2YgRmxvYXQxNkFycmF5XCI7XG5leHBvcnQgY29uc3QgVEhFX0NPTlNUUlVDVE9SX1BST1BFUlRZX1ZBTFVFX0lTX05PVF9BTl9PQkpFQ1QgPVxuICBcIlRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eSB2YWx1ZSBpcyBub3QgYW4gb2JqZWN0XCI7XG5leHBvcnQgY29uc3QgU1BFQ0lFU19DT05TVFJVQ1RPUl9ESUROVF9SRVRVUk5fVFlQRURBUlJBWV9PQkpFQ1QgPVxuICBcIlNwZWNpZXMgY29uc3RydWN0b3IgZGlkbid0IHJldHVybiBUeXBlZEFycmF5IG9iamVjdFwiO1xuZXhwb3J0IGNvbnN0IERFUklWRURfQ09OU1RSVUNUT1JfQ1JFQVRFRF9UWVBFREFSUkFZX09CSkVDVF9XSElDSF9XQVNfVE9PX1NNQUxMX0xFTkdUSCA9XG4gIFwiRGVyaXZlZCBjb25zdHJ1Y3RvciBjcmVhdGVkIFR5cGVkQXJyYXkgb2JqZWN0IHdoaWNoIHdhcyB0b28gc21hbGwgbGVuZ3RoXCI7XG5leHBvcnQgY29uc3QgQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIgPVxuICBcIkF0dGVtcHRpbmcgdG8gYWNjZXNzIGRldGFjaGVkIEFycmF5QnVmZmVyXCI7XG5leHBvcnQgY29uc3QgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUID1cbiAgXCJDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3RcIjtcbmV4cG9ydCBjb25zdCBDQU5OT1RfQ09OVkVSVF9BX0JJR0lOVF9WQUxVRV9UT19BX05VTUJFUiA9XG4gIFwiQ2Fubm90IGNvbnZlcnQgYSBCaWdJbnQgdmFsdWUgdG8gYSBudW1iZXJcIjtcbmV4cG9ydCBjb25zdCBDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVMgPVxuICBcIkNhbm5vdCBtaXggQmlnSW50IGFuZCBvdGhlciB0eXBlcywgdXNlIGV4cGxpY2l0IGNvbnZlcnNpb25zXCI7XG5leHBvcnQgY29uc3QgSVRFUkFUT1JfUFJPUEVSVFlfSVNfTk9UX0NBTExBQkxFID0gXCJAQGl0ZXJhdG9yIHByb3BlcnR5IGlzIG5vdCBjYWxsYWJsZVwiO1xuZXhwb3J0IGNvbnN0IFJFRFVDRV9PRl9FTVBUWV9BUlJBWV9XSVRIX05PX0lOSVRJQUxfVkFMVUUgPVxuICBcIlJlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWVcIjtcbmV4cG9ydCBjb25zdCBPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyA9IFwiT2Zmc2V0IGlzIG91dCBvZiBib3VuZHNcIjtcbiIsImltcG9ydCB7IGlzT2JqZWN0LCBpc1NoYXJlZEFycmF5QnVmZmVyIH0gZnJvbSBcIi4vaXMubWpzXCI7XG5pbXBvcnQge1xuICBDQU5OT1RfQ09OVkVSVF9BX0JJR0lOVF9WQUxVRV9UT19BX05VTUJFUixcbiAgVEhFX0NPTlNUUlVDVE9SX1BST1BFUlRZX1ZBTFVFX0lTX05PVF9BTl9PQkpFQ1QsXG4gIFRISVNfSVNfTk9UX0FOX09CSkVDVCxcbn0gZnJvbSBcIi4vbWVzc2FnZXMubWpzXCI7XG5pbXBvcnQge1xuICBBcnJheUJ1ZmZlclByb3RvdHlwZVNsaWNlLFxuICBNYXRoVHJ1bmMsXG4gIE5hdGl2ZU51bWJlcixcbiAgTmF0aXZlVHlwZUVycm9yLFxuICBOdW1iZXJJc05hTixcbiAgT2JqZWN0SXMsXG4gIFN5bWJvbFNwZWNpZXMsXG59IGZyb20gXCIuL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG5jb25zdCBNQVhfU0FGRV9JTlRFR0VSID0gTmF0aXZlTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvaW50ZWdlcm9yaW5maW5pdHlcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gVG9JbnRlZ2VyT3JJbmZpbml0eSh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwiYmlnaW50XCIpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ0FOTk9UX0NPTlZFUlRfQV9CSUdJTlRfVkFMVUVfVE9fQV9OVU1CRVIpO1xuICB9XG5cbiAgY29uc3QgbnVtYmVyID0gTmF0aXZlTnVtYmVyKHRhcmdldCk7XG5cbiAgaWYgKE51bWJlcklzTmFOKG51bWJlcikgfHwgbnVtYmVyID09PSAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gTWF0aFRydW5jKG51bWJlcik7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvbGVuZ3RoXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFRvTGVuZ3RoKHRhcmdldCkge1xuICBjb25zdCBsZW5ndGggPSBUb0ludGVnZXJPckluZmluaXR5KHRhcmdldCk7XG4gIGlmIChsZW5ndGggPCAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gbGVuZ3RoIDwgTUFYX1NBRkVfSU5URUdFUlxuICAgID8gbGVuZ3RoXG4gICAgOiBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1zcGVjaWVzY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7eyBuZXcoLi4uYXJnczogYW55W10pOiBhbnk7IH19IGRlZmF1bHRDb25zdHJ1Y3RvclxuICogQHJldHVybnMge3sgbmV3KC4uLmFyZ3M6IGFueVtdKTogYW55OyB9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gU3BlY2llc0NvbnN0cnVjdG9yKHRhcmdldCwgZGVmYXVsdENvbnN0cnVjdG9yKSB7XG4gIGlmICghaXNPYmplY3QodGFyZ2V0KSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSElTX0lTX05PVF9BTl9PQkpFQ1QpO1xuICB9XG5cbiAgY29uc3QgY29uc3RydWN0b3IgPSB0YXJnZXQuY29uc3RydWN0b3I7XG4gIGlmIChjb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRDb25zdHJ1Y3RvcjtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KGNvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihUSEVfQ09OU1RSVUNUT1JfUFJPUEVSVFlfVkFMVUVfSVNfTk9UX0FOX09CSkVDVCk7XG4gIH1cblxuICBjb25zdCBzcGVjaWVzID0gY29uc3RydWN0b3JbU3ltYm9sU3BlY2llc107XG4gIGlmIChzcGVjaWVzID09IG51bGwpIHtcbiAgICByZXR1cm4gZGVmYXVsdENvbnN0cnVjdG9yO1xuICB9XG5cbiAgcmV0dXJuIHNwZWNpZXM7XG59XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWlzZGV0YWNoZWRidWZmZXJcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJMaWtlfSBidWZmZXJcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpIHtcbiAgaWYgKGlzU2hhcmVkQXJyYXlCdWZmZXIoYnVmZmVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgQXJyYXlCdWZmZXJQcm90b3R5cGVTbGljZShidWZmZXIsIDAsIDApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBjYXRjaCAoZSkgey8qIGVtcHR5ICovfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIGJpZ2ludCBjb21wYXJpc29ucyBhcmUgbm90IHN1cHBvcnRlZFxuICpcbiAqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNvcnRcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gKiBAcGFyYW0ge251bWJlcn0geVxuICogQHJldHVybnMgey0xIHwgMCB8IDF9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0Q29tcGFyZSh4LCB5KSB7XG4gIGNvbnN0IGlzWE5hTiA9IE51bWJlcklzTmFOKHgpO1xuICBjb25zdCBpc1lOYU4gPSBOdW1iZXJJc05hTih5KTtcblxuICBpZiAoaXNYTmFOICYmIGlzWU5hTikge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKGlzWE5hTikge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKGlzWU5hTikge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmICh4IDwgeSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmICh4ID4geSkge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCkge1xuICAgIGNvbnN0IGlzWFBsdXNaZXJvID0gT2JqZWN0SXMoeCwgMCk7XG4gICAgY29uc3QgaXNZUGx1c1plcm8gPSBPYmplY3RJcyh5LCAwKTtcblxuICAgIGlmICghaXNYUGx1c1plcm8gJiYgaXNZUGx1c1plcm8pIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoaXNYUGx1c1plcm8gJiYgIWlzWVBsdXNaZXJvKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cbiIsImltcG9ydCB7IHRvU2FmZSwgd3JhcEdlbmVyYXRvciB9IGZyb20gXCIuL191dGlsL2FycmF5SXRlcmF0b3IubWpzXCI7XG5pbXBvcnQgeyBjb252ZXJ0VG9OdW1iZXIsIHJvdW5kVG9GbG9hdDE2Qml0cyB9IGZyb20gXCIuL191dGlsL2NvbnZlcnRlci5tanNcIjtcbmltcG9ydCB7XG4gIGlzQXJyYXlCdWZmZXIsXG4gIGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nLFxuICBpc05hdGl2ZUJpZ0ludFR5cGVkQXJyYXksXG4gIGlzTmF0aXZlVHlwZWRBcnJheSxcbiAgaXNPYmplY3QsXG4gIGlzT2JqZWN0TGlrZSxcbiAgaXNPcmRpbmFyeUFycmF5LFxuICBpc09yZGluYXJ5TmF0aXZlVHlwZWRBcnJheSxcbiAgaXNTaGFyZWRBcnJheUJ1ZmZlcixcbn0gZnJvbSBcIi4vX3V0aWwvaXMubWpzXCI7XG5pbXBvcnQge1xuICBBVFRFTVBUSU5HX1RPX0FDQ0VTU19ERVRBQ0hFRF9BUlJBWUJVRkZFUixcbiAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNULFxuICBDQU5OT1RfTUlYX0JJR0lOVF9BTkRfT1RIRVJfVFlQRVMsXG4gIERFUklWRURfQ09OU1RSVUNUT1JfQ1JFQVRFRF9UWVBFREFSUkFZX09CSkVDVF9XSElDSF9XQVNfVE9PX1NNQUxMX0xFTkdUSCxcbiAgSVRFUkFUT1JfUFJPUEVSVFlfSVNfTk9UX0NBTExBQkxFLFxuICBPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyxcbiAgUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSxcbiAgU1BFQ0lFU19DT05TVFJVQ1RPUl9ESUROVF9SRVRVUk5fVFlQRURBUlJBWV9PQkpFQ1QsXG4gIFRIRV9DT05TVFJVQ1RPUl9QUk9QRVJUWV9WQUxVRV9JU19OT1RfQU5fT0JKRUNULFxuICBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWSxcbiAgVEhJU19JU19OT1RfQV9GTE9BVDE2QVJSQVlfT0JKRUNULFxufSBmcm9tIFwiLi9fdXRpbC9tZXNzYWdlcy5tanNcIjtcbmltcG9ydCB7XG4gIEFycmF5QnVmZmVySXNWaWV3LFxuICBBcnJheVByb3RvdHlwZUpvaW4sXG4gIEFycmF5UHJvdG90eXBlUHVzaCxcbiAgQXJyYXlQcm90b3R5cGVUb0xvY2FsZVN0cmluZyxcbiAgTmF0aXZlQXJyYXlCdWZmZXIsXG4gIE5hdGl2ZU9iamVjdCxcbiAgTmF0aXZlUHJveHksXG4gIE5hdGl2ZVJhbmdlRXJyb3IsXG4gIE5hdGl2ZVNldCxcbiAgTmF0aXZlVHlwZUVycm9yLFxuICBOYXRpdmVVaW50MTZBcnJheSxcbiAgTmF0aXZlV2Vha01hcCxcbiAgTnVtYmVySXNOYU4sXG4gIE9iamVjdERlZmluZVByb3BlcnR5LFxuICBPYmplY3RGcmVlemUsXG4gIE9iamVjdEhhc093bixcbiAgT2JqZWN0UHJvdG90eXBlSXNQcm90b3R5cGVPZixcbiAgUmVmbGVjdEFwcGx5LFxuICBSZWZsZWN0Q29uc3RydWN0LFxuICBSZWZsZWN0RGVmaW5lUHJvcGVydHksXG4gIFJlZmxlY3RHZXQsXG4gIFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIFJlZmxlY3RHZXRQcm90b3R5cGVPZixcbiAgUmVmbGVjdEhhcyxcbiAgUmVmbGVjdE93bktleXMsXG4gIFJlZmxlY3RTZXQsXG4gIFJlZmxlY3RTZXRQcm90b3R5cGVPZixcbiAgU2V0UHJvdG90eXBlQWRkLFxuICBTZXRQcm90b3R5cGVIYXMsXG4gIFN5bWJvbEZvcixcbiAgU3ltYm9sSXRlcmF0b3IsXG4gIFN5bWJvbFRvU3RyaW5nVGFnLFxuICBUeXBlZEFycmF5LFxuICBUeXBlZEFycmF5UHJvdG90eXBlLFxuICBUeXBlZEFycmF5UHJvdG90eXBlQ29weVdpdGhpbixcbiAgVHlwZWRBcnJheVByb3RvdHlwZUVudHJpZXMsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVGaWxsLFxuICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyLFxuICBUeXBlZEFycmF5UHJvdG90eXBlR2V0Qnl0ZU9mZnNldCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aCxcbiAgVHlwZWRBcnJheVByb3RvdHlwZUtleXMsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVSZXZlcnNlLFxuICBUeXBlZEFycmF5UHJvdG90eXBlU2V0LFxuICBUeXBlZEFycmF5UHJvdG90eXBlU2xpY2UsXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVTb3J0LFxuICBUeXBlZEFycmF5UHJvdG90eXBlU3ViYXJyYXksXG4gIFR5cGVkQXJyYXlQcm90b3R5cGVWYWx1ZXMsXG4gIFVpbnQxNkFycmF5RnJvbSxcbiAgV2Vha01hcFByb3RvdHlwZUdldCxcbiAgV2Vha01hcFByb3RvdHlwZUhhcyxcbiAgV2Vha01hcFByb3RvdHlwZVNldCxcbn0gZnJvbSBcIi4vX3V0aWwvcHJpbW9yZGlhbHMubWpzXCI7XG5pbXBvcnQge1xuICBJc0RldGFjaGVkQnVmZmVyLFxuICBTcGVjaWVzQ29uc3RydWN0b3IsXG4gIFRvSW50ZWdlck9ySW5maW5pdHksXG4gIFRvTGVuZ3RoLFxuICBkZWZhdWx0Q29tcGFyZSxcbn0gZnJvbSBcIi4vX3V0aWwvc3BlYy5tanNcIjtcblxuY29uc3QgQllURVNfUEVSX0VMRU1FTlQgPSAyO1xuXG5jb25zdCBicmFuZCA9IFN5bWJvbEZvcihcIl9fRmxvYXQxNkFycmF5X19cIik7XG5cbi8qKiBAdHlwZSB7V2Vha01hcDxGbG9hdDE2QXJyYXksIFVpbnQxNkFycmF5ICYgeyBfX2Zsb2F0MTZiaXRzOiBuZXZlciB9Pn0gKi9cbmNvbnN0IGZsb2F0MTZiaXRzQXJyYXlzID0gbmV3IE5hdGl2ZVdlYWtNYXAoKTtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGhhc0Zsb2F0MTZBcnJheUJyYW5kKHRhcmdldCkge1xuICBpZiAoIWlzT2JqZWN0TGlrZSh0YXJnZXQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcHJvdG90eXBlID0gUmVmbGVjdEdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gIGlmICghaXNPYmplY3RMaWtlKHByb3RvdHlwZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBjb25zdHJ1Y3RvciA9IHByb3RvdHlwZS5jb25zdHJ1Y3RvcjtcbiAgaWYgKGNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCFpc09iamVjdChjb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoVEhFX0NPTlNUUlVDVE9SX1BST1BFUlRZX1ZBTFVFX0lTX05PVF9BTl9PQkpFQ1QpO1xuICB9XG5cbiAgcmV0dXJuIFJlZmxlY3RIYXMoY29uc3RydWN0b3IsIGJyYW5kKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge3RhcmdldCBpcyBGbG9hdDE2QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgcmV0dXJuIFdlYWtNYXBQcm90b3R5cGVIYXMoZmxvYXQxNmJpdHNBcnJheXMsIHRhcmdldCkgfHxcbiAgICAoIUFycmF5QnVmZmVySXNWaWV3KHRhcmdldCkgJiYgaGFzRmxvYXQxNkFycmF5QnJhbmQodGFyZ2V0KSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEByZXR1cm5zIHthc3NlcnRzIHRhcmdldCBpcyBGbG9hdDE2QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGFzc2VydEZsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgaWYgKCFpc0Zsb2F0MTZBcnJheSh0YXJnZXQpKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFRISVNfSVNfTk9UX0FfRkxPQVQxNkFSUkFZX09CSkVDVCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHBhcmFtIHtudW1iZXI9fSBjb3VudFxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHJldHVybnMge2Fzc2VydHMgdGFyZ2V0IGlzIFVpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDE2QXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheX1cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0U3BlY2llc1R5cGVkQXJyYXkodGFyZ2V0LCBjb3VudCkge1xuICBjb25zdCBpc1RhcmdldEZsb2F0MTZBcnJheSA9IGlzRmxvYXQxNkFycmF5KHRhcmdldCk7XG4gIGNvbnN0IGlzVGFyZ2V0VHlwZWRBcnJheSA9IGlzTmF0aXZlVHlwZWRBcnJheSh0YXJnZXQpO1xuXG4gIGlmICghaXNUYXJnZXRGbG9hdDE2QXJyYXkgJiYgIWlzVGFyZ2V0VHlwZWRBcnJheSkge1xuICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihTUEVDSUVTX0NPTlNUUlVDVE9SX0RJRE5UX1JFVFVSTl9UWVBFREFSUkFZX09CSkVDVCk7XG4gIH1cblxuICBpZiAodHlwZW9mIGNvdW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgbGV0IGxlbmd0aDtcbiAgICBpZiAoaXNUYXJnZXRGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRhcmdldCk7XG4gICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKHRhcmdldCk7XG4gICAgfVxuXG4gICAgaWYgKGxlbmd0aCA8IGNvdW50KSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIERFUklWRURfQ09OU1RSVUNUT1JfQ1JFQVRFRF9UWVBFREFSUkFZX09CSkVDVF9XSElDSF9XQVNfVE9PX1NNQUxMX0xFTkdUSFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoaXNOYXRpdmVCaWdJbnRUeXBlZEFycmF5KHRhcmdldCkpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQ0FOTk9UX01JWF9CSUdJTlRfQU5EX09USEVSX1RZUEVTKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7RmxvYXQxNkFycmF5fSBmbG9hdDE2XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcmV0dXJucyB7VWludDE2QXJyYXkgJiB7IF9fZmxvYXQxNmJpdHM6IG5ldmVyIH19XG4gKi9cbmZ1bmN0aW9uIGdldEZsb2F0MTZCaXRzQXJyYXkoZmxvYXQxNikge1xuICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gV2Vha01hcFByb3RvdHlwZUdldChmbG9hdDE2Yml0c0FycmF5cywgZmxvYXQxNik7XG4gIGlmIChmbG9hdDE2Yml0c0FycmF5ICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBidWZmZXIgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihBVFRFTVBUSU5HX1RPX0FDQ0VTU19ERVRBQ0hFRF9BUlJBWUJVRkZFUik7XG4gICAgfVxuICAgIHJldHVybiBmbG9hdDE2Yml0c0FycmF5O1xuICB9XG5cbiAgLy8gZnJvbSBhbm90aGVyIEZsb2F0MTZBcnJheSBpbnN0YW5jZSAoYSBkaWZmZXJlbnQgdmVyc2lvbj8pXG4gIGNvbnN0IGJ1ZmZlciA9IC8qKiBAdHlwZSB7YW55fSAqLyAoZmxvYXQxNikuYnVmZmVyO1xuXG4gIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoQVRURU1QVElOR19UT19BQ0NFU1NfREVUQUNIRURfQVJSQVlCVUZGRVIpO1xuICB9XG5cbiAgY29uc3QgY2xvbmVkID0gUmVmbGVjdENvbnN0cnVjdChGbG9hdDE2QXJyYXksIFtcbiAgICBidWZmZXIsXG4gICAgLyoqIEB0eXBlIHthbnl9ICovIChmbG9hdDE2KS5ieXRlT2Zmc2V0LFxuICAgIC8qKiBAdHlwZSB7YW55fSAqLyAoZmxvYXQxNikubGVuZ3RoLFxuICBdLCBmbG9hdDE2LmNvbnN0cnVjdG9yKTtcbiAgcmV0dXJuIFdlYWtNYXBQcm90b3R5cGVHZXQoZmxvYXQxNmJpdHNBcnJheXMsIGNsb25lZCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfX0gZmxvYXQxNmJpdHNBcnJheVxuICogQHJldHVybnMge251bWJlcltdfVxuICovXG5mdW5jdGlvbiBjb3B5VG9BcnJheShmbG9hdDE2Yml0c0FycmF5KSB7XG4gIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgY29uc3QgYXJyYXkgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGFycmF5W2ldID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufVxuXG4vKiogQHR5cGUge1NldDxzdHJpbmcgfCBzeW1ib2w+fSAqL1xuY29uc3QgVHlwZWRBcnJheVByb3RvdHlwZUdldHRlcktleXMgPSBuZXcgTmF0aXZlU2V0KCk7XG5mb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0T3duS2V5cyhUeXBlZEFycmF5UHJvdG90eXBlKSkge1xuICAvLyBAQHRvU3RyaW5nVGFnIG1ldGhvZCBpcyBkZWZpbmVkIGluIEZsb2F0MTZBcnJheS5wcm90b3R5cGVcbiAgaWYgKGtleSA9PT0gU3ltYm9sVG9TdHJpbmdUYWcpIHtcbiAgICBjb250aW51ZTtcbiAgfVxuXG4gIGNvbnN0IGRlc2NyaXB0b3IgPSBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFR5cGVkQXJyYXlQcm90b3R5cGUsIGtleSk7XG4gIGlmIChPYmplY3RIYXNPd24oZGVzY3JpcHRvciwgXCJnZXRcIikpIHtcbiAgICBTZXRQcm90b3R5cGVBZGQoVHlwZWRBcnJheVByb3RvdHlwZUdldHRlcktleXMsIGtleSk7XG4gIH1cbn1cblxuY29uc3QgaGFuZGxlciA9IE9iamVjdEZyZWV6ZSgvKiogQHR5cGUge1Byb3h5SGFuZGxlcjxVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfT59ICovICh7XG4gIC8qKiBsaW1pdGF0aW9uOiBJZiB0aGUgZ2V0dGVyIHByb3BlcnR5IGlzIHRoZSBzYW1lIGFzICVUeXBlZEFycmF5JS5wcm90b3R5cGUsIHRoZSByZWNlaXZlciBpcyBub3QgcGFzc2VkICovXG4gIGdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpIHtcbiAgICBpZiAoaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcoa2V5KSAmJiBPYmplY3RIYXNPd24odGFyZ2V0LCBrZXkpKSB7XG4gICAgICByZXR1cm4gY29udmVydFRvTnVtYmVyKFJlZmxlY3RHZXQodGFyZ2V0LCBrZXkpKTtcbiAgICB9XG5cbiAgICAvLyAlVHlwZWRBcnJheSUucHJvdG90eXBlIGdldHRlciBwcm9wZXJ0aWVzIGNhbm5vdCBjYWxsZWQgYnkgUHJveHkgcmVjZWl2ZXJcbiAgICBpZiAoXG4gICAgICBTZXRQcm90b3R5cGVIYXMoVHlwZWRBcnJheVByb3RvdHlwZUdldHRlcktleXMsIGtleSkgJiZcbiAgICAgIE9iamVjdFByb3RvdHlwZUlzUHJvdG90eXBlT2YoVHlwZWRBcnJheVByb3RvdHlwZSwgdGFyZ2V0KVxuICAgICkge1xuICAgICAgcmV0dXJuIFJlZmxlY3RHZXQodGFyZ2V0LCBrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0R2V0KHRhcmdldCwga2V5LCByZWNlaXZlcik7XG4gIH0sXG5cbiAgc2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICBpZiAoaXNDYW5vbmljYWxJbnRlZ2VySW5kZXhTdHJpbmcoa2V5KSAmJiBPYmplY3RIYXNPd24odGFyZ2V0LCBrZXkpKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdFNldCh0YXJnZXQsIGtleSwgcm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZmxlY3RTZXQodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcik7XG4gIH0sXG5cbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG4gICAgaWYgKGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKGtleSkgJiYgT2JqZWN0SGFzT3duKHRhcmdldCwga2V5KSkge1xuICAgICAgY29uc3QgZGVzY3JpcHRvciA9IFJlZmxlY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IGNvbnZlcnRUb051bWJlcihkZXNjcmlwdG9yLnZhbHVlKTtcbiAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgfSxcblxuICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICAgIGlmIChcbiAgICAgIGlzQ2Fub25pY2FsSW50ZWdlckluZGV4U3RyaW5nKGtleSkgJiZcbiAgICAgIE9iamVjdEhhc093bih0YXJnZXQsIGtleSkgJiZcbiAgICAgIE9iamVjdEhhc093bihkZXNjcmlwdG9yLCBcInZhbHVlXCIpXG4gICAgKSB7XG4gICAgICBkZXNjcmlwdG9yLnZhbHVlID0gcm91bmRUb0Zsb2F0MTZCaXRzKGRlc2NyaXB0b3IudmFsdWUpO1xuICAgICAgcmV0dXJuIFJlZmxlY3REZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZmxlY3REZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcik7XG4gIH0sXG59KSk7XG5cbmV4cG9ydCBjbGFzcyBGbG9hdDE2QXJyYXkge1xuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXR5cGVkYXJyYXkgKi9cbiAgY29uc3RydWN0b3IoaW5wdXQsIF9ieXRlT2Zmc2V0LCBfbGVuZ3RoKSB7XG4gICAgLyoqIEB0eXBlIHtVaW50MTZBcnJheSAmIHsgX19mbG9hdDE2Yml0czogbmV2ZXIgfX0gKi9cbiAgICBsZXQgZmxvYXQxNmJpdHNBcnJheTtcblxuICAgIGlmIChpc0Zsb2F0MTZBcnJheShpbnB1dCkpIHtcbiAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBbZ2V0RmxvYXQxNkJpdHNBcnJheShpbnB1dCldLCBuZXcudGFyZ2V0KTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGlucHV0KSAmJiAhaXNBcnJheUJ1ZmZlcihpbnB1dCkpIHsgLy8gb2JqZWN0IHdpdGhvdXQgQXJyYXlCdWZmZXJcbiAgICAgIC8qKiBAdHlwZSB7QXJyYXlMaWtlPHVua25vd24+fSAqL1xuICAgICAgbGV0IGxpc3Q7XG4gICAgICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgICAgIGxldCBsZW5ndGg7XG5cbiAgICAgIGlmIChpc05hdGl2ZVR5cGVkQXJyYXkoaW5wdXQpKSB7IC8vIFR5cGVkQXJyYXlcbiAgICAgICAgbGlzdCA9IGlucHV0O1xuICAgICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGlucHV0KTtcblxuICAgICAgICBjb25zdCBidWZmZXIgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGlucHV0KTtcbiAgICAgICAgY29uc3QgQnVmZmVyQ29uc3RydWN0b3IgPSAhaXNTaGFyZWRBcnJheUJ1ZmZlcihidWZmZXIpXG4gICAgICAgICAgPyAvKiogQHR5cGUge0FycmF5QnVmZmVyQ29uc3RydWN0b3J9ICovIChTcGVjaWVzQ29uc3RydWN0b3IoXG4gICAgICAgICAgICBidWZmZXIsXG4gICAgICAgICAgICBOYXRpdmVBcnJheUJ1ZmZlclxuICAgICAgICAgICkpXG4gICAgICAgICAgOiBOYXRpdmVBcnJheUJ1ZmZlcjtcblxuICAgICAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc05hdGl2ZUJpZ0ludFR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFUyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhID0gbmV3IEJ1ZmZlckNvbnN0cnVjdG9yKFxuICAgICAgICAgIGxlbmd0aCAqIEJZVEVTX1BFUl9FTEVNRU5UXG4gICAgICAgICk7XG4gICAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBbZGF0YV0sIG5ldy50YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaXRlcmF0b3IgPSBpbnB1dFtTeW1ib2xJdGVyYXRvcl07XG4gICAgICAgIGlmIChpdGVyYXRvciAhPSBudWxsICYmIHR5cGVvZiBpdGVyYXRvciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKElURVJBVE9SX1BST1BFUlRZX0lTX05PVF9DQUxMQUJMRSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlcmF0b3IgIT0gbnVsbCkgeyAvLyBJdGVyYWJsZSAoQXJyYXkpXG4gICAgICAgICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgICAgICAgIGlmIChpc09yZGluYXJ5QXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBsaXN0ID0gaW5wdXQ7XG4gICAgICAgICAgICBsZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgICAgICAgbGlzdCA9IFsuLi4gLyoqIEB0eXBlIHtJdGVyYWJsZTx1bmtub3duPn0gKi8gKGlucHV0KV07XG4gICAgICAgICAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIEFycmF5TGlrZVxuICAgICAgICAgIGxpc3QgPSAvKiogQHR5cGUge0FycmF5TGlrZTx1bmtub3duPn0gKi8gKGlucHV0KTtcbiAgICAgICAgICBsZW5ndGggPSBUb0xlbmd0aChsaXN0Lmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgZmxvYXQxNmJpdHNBcnJheSA9IFJlZmxlY3RDb25zdHJ1Y3QoTmF0aXZlVWludDE2QXJyYXksIFtsZW5ndGhdLCBuZXcudGFyZ2V0KTtcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHZhbHVlc1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBmbG9hdDE2Yml0c0FycmF5W2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGxpc3RbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIHByaW1pdGl2ZSwgQXJyYXlCdWZmZXJcbiAgICAgIGZsb2F0MTZiaXRzQXJyYXkgPSBSZWZsZWN0Q29uc3RydWN0KE5hdGl2ZVVpbnQxNkFycmF5LCBhcmd1bWVudHMsIG5ldy50YXJnZXQpO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7RmxvYXQxNkFycmF5fSAqL1xuICAgIGNvbnN0IHByb3h5ID0gLyoqIEB0eXBlIHthbnl9ICovIChuZXcgTmF0aXZlUHJveHkoZmxvYXQxNmJpdHNBcnJheSwgaGFuZGxlcikpO1xuXG4gICAgLy8gcHJveHkgcHJpdmF0ZSBzdG9yYWdlXG4gICAgV2Vha01hcFByb3RvdHlwZVNldChmbG9hdDE2Yml0c0FycmF5cywgcHJveHksIGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgcmV0dXJuIHByb3h5O1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGbG9hdDE2QXJyYXkpYCBvciBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgIGluY2x1ZGUgdGhpcyBrZXlcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5mcm9tXG4gICAqL1xuICBzdGF0aWMgZnJvbShzcmMsIC4uLm9wdHMpIHtcbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICBpZiAoIVJlZmxlY3RIYXMoQ29uc3RydWN0b3IsIGJyYW5kKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKFxuICAgICAgICBUSElTX0NPTlNUUlVDVE9SX0lTX05PVF9BX1NVQkNMQVNTX09GX0ZMT0FUMTZBUlJBWVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGlmIChpc0Zsb2F0MTZBcnJheShzcmMpICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHNyYyk7XG4gICAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBOYXRpdmVVaW50MTZBcnJheShcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSlcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoXG4gICAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihUeXBlZEFycmF5UHJvdG90eXBlU2xpY2UodWludDE2KSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFxuICAgICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoXG4gICAgICAgICAgICBVaW50MTZBcnJheUZyb20oc3JjLCByb3VuZFRvRmxvYXQxNkJpdHMpXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXBGdW5jID0gb3B0c1swXTtcbiAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzFdO1xuXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgICBVaW50MTZBcnJheUZyb20oc3JjLCBmdW5jdGlvbiAodmFsLCAuLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gcm91bmRUb0Zsb2F0MTZCaXRzKFxuICAgICAgICAgICAgICBSZWZsZWN0QXBwbHkobWFwRnVuYywgdGhpcywgW3ZhbCwgLi4udG9TYWZlKGFyZ3MpXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSwgdGhpc0FyZylcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvKiogQHR5cGUge0FycmF5TGlrZTx1bmtub3duPn0gKi9cbiAgICBsZXQgbGlzdDtcbiAgICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgICBsZXQgbGVuZ3RoO1xuXG4gICAgY29uc3QgaXRlcmF0b3IgPSBzcmNbU3ltYm9sSXRlcmF0b3JdO1xuICAgIGlmIChpdGVyYXRvciAhPSBudWxsICYmIHR5cGVvZiBpdGVyYXRvciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoSVRFUkFUT1JfUFJPUEVSVFlfSVNfTk9UX0NBTExBQkxFKTtcbiAgICB9XG5cbiAgICBpZiAoaXRlcmF0b3IgIT0gbnVsbCkgeyAvLyBJdGVyYWJsZSAoVHlwZWRBcnJheSwgQXJyYXkpXG4gICAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgICBpZiAoaXNPcmRpbmFyeUFycmF5KHNyYykpIHtcbiAgICAgICAgbGlzdCA9IHNyYztcbiAgICAgICAgbGVuZ3RoID0gc3JjLmxlbmd0aDtcbiAgICAgIH0gZWxzZSBpZiAoaXNPcmRpbmFyeU5hdGl2ZVR5cGVkQXJyYXkoc3JjKSkge1xuICAgICAgICBsaXN0ID0gc3JjO1xuICAgICAgICBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKHNyYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgICAgICAgbGlzdCA9IFsuLi5zcmNdO1xuICAgICAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyBBcnJheUxpa2VcbiAgICAgIGlmIChzcmMgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgICAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBsaXN0ID0gTmF0aXZlT2JqZWN0KHNyYyk7XG4gICAgICBsZW5ndGggPSBUb0xlbmd0aChsaXN0Lmxlbmd0aCk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBhcnJheVtpXSA9IC8qKiBAdHlwZSB7bnVtYmVyfSAqLyAobGlzdFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1hcEZ1bmMgPSBvcHRzWzBdO1xuICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMV07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gUmVmbGVjdEFwcGx5KG1hcEZ1bmMsIHRoaXNBcmcsIFtsaXN0W2ldLCBpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGbG9hdDE2QXJyYXkpYCBvciBgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSlgIGluY2x1ZGUgdGhpcyBrZXlcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5vZlxuICAgKi9cbiAgc3RhdGljIG9mKC4uLml0ZW1zKSB7XG4gICAgY29uc3QgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgaWYgKCFSZWZsZWN0SGFzKENvbnN0cnVjdG9yLCBicmFuZCkpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgVEhJU19DT05TVFJVQ1RPUl9JU19OT1RfQV9TVUJDTEFTU19PRl9GTE9BVDE2QVJSQVlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgbGVuZ3RoID0gaXRlbXMubGVuZ3RoO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBwcm94eSA9IG5ldyBGbG9hdDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHByb3h5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBmbG9hdDE2Yml0c0FycmF5W2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGl0ZW1zW2ldKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH1cblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBhcnJheVtpXSA9IGl0ZW1zW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5rZXlzICovXG4gIGtleXMoKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgcmV0dXJuIFR5cGVkQXJyYXlQcm90b3R5cGVLZXlzKGZsb2F0MTZiaXRzQXJyYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGxpbWl0YXRpb246IHJldHVybnMgYSBvYmplY3Qgd2hvc2UgcHJvdG90eXBlIGlzIG5vdCBgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlYFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS52YWx1ZXNcbiAgICovXG4gIHZhbHVlcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gd3JhcEdlbmVyYXRvcigoZnVuY3Rpb24qICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgZm9yIChjb25zdCB2YWwgb2YgVHlwZWRBcnJheVByb3RvdHlwZVZhbHVlcyhmbG9hdDE2Yml0c0FycmF5KSkge1xuICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaW1pdGF0aW9uOiByZXR1cm5zIGEgb2JqZWN0IHdob3NlIHByb3RvdHlwZSBpcyBub3QgYCVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJWBcbiAgICpcbiAgICogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZW50cmllc1xuICAgKi9cbiAgZW50cmllcygpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICByZXR1cm4gd3JhcEdlbmVyYXRvcigoZnVuY3Rpb24qICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgZm9yIChjb25zdCBbaSwgdmFsXSBvZiBUeXBlZEFycmF5UHJvdG90eXBlRW50cmllcyhmbG9hdDE2Yml0c0FycmF5KSkge1xuICAgICAgICB5aWVsZCAvKiogQHR5cGUge1tOdW1iZXIsIG51bWJlcl19ICovIChbaSwgY29udmVydFRvTnVtYmVyKHZhbCldKTtcbiAgICAgIH1cbiAgICB9KSgpKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5hdCAqL1xuICBhdChpbmRleCkge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgcmVsYXRpdmVJbmRleCA9IFRvSW50ZWdlck9ySW5maW5pdHkoaW5kZXgpO1xuICAgIGNvbnN0IGsgPSByZWxhdGl2ZUluZGV4ID49IDAgPyByZWxhdGl2ZUluZGV4IDogbGVuZ3RoICsgcmVsYXRpdmVJbmRleDtcblxuICAgIGlmIChrIDwgMCB8fCBrID49IGxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtrXSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUubWFwICovXG4gIG1hcChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gRmxvYXQxNkFycmF5KSB7XG4gICAgICBjb25zdCBwcm94eSA9IG5ldyBGbG9hdDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgIGNvbnN0IGFycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheShwcm94eSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgICBhcnJheVtpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhcbiAgICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IobGVuZ3RoKTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSwgbGVuZ3RoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGFycmF5W2ldID0gUmVmbGVjdEFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdmFsLCBpLCB0aGlzXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmZpbHRlciAqL1xuICBmaWx0ZXIoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgY29uc3Qga2VwdCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWwsIGksIHRoaXNdKSkge1xuICAgICAgICBBcnJheVByb3RvdHlwZVB1c2goa2VwdCwgdmFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IENvbnN0cnVjdG9yKGtlcHQpO1xuICAgIGFzc2VydFNwZWNpZXNUeXBlZEFycmF5KGFycmF5KTtcblxuICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKGFycmF5KTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5yZWR1Y2UgKi9cbiAgcmVkdWNlKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbMF0pO1xuICAgICAgc3RhcnQgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soXG4gICAgICAgIGFjY3VtdWxhdG9yLFxuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnJlZHVjZXJpZ2h0ICovXG4gIHJlZHVjZVJpZ2h0KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoUkVEVUNFX09GX0VNUFRZX0FSUkFZX1dJVEhfTk9fSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuXG4gICAgbGV0IGFjY3VtdWxhdG9yLCBzdGFydDtcbiAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbbGVuZ3RoIC0gMV0pO1xuICAgICAgc3RhcnQgPSBsZW5ndGggLSAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2N1bXVsYXRvciA9IG9wdHNbMF07XG4gICAgICBzdGFydCA9IGxlbmd0aCAtIDE7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpID49IDA7IC0taSkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjYWxsYmFjayhcbiAgICAgICAgYWNjdW11bGF0b3IsXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSxcbiAgICAgICAgaSxcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZm9yZWFjaCAqL1xuICBmb3JFYWNoKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW1xuICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgIGksXG4gICAgICAgIHRoaXMsXG4gICAgICBdKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZCAqL1xuICBmaW5kKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kaW5kZXggKi9cbiAgZmluZEluZGV4KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pO1xuICAgICAgaWYgKFJlZmxlY3RBcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3ZhbHVlLCBpLCB0aGlzXSkpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLWFycmF5LWZpbmQtZnJvbS1sYXN0L2luZGV4Lmh0bWwjc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuZmluZGxhc3QgKi9cbiAgZmluZExhc3QoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtYXJyYXktZmluZC1mcm9tLWxhc3QvaW5kZXguaHRtbCNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maW5kbGFzdGluZGV4ICovXG4gIGZpbmRMYXN0SW5kZXgoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKTtcbiAgICAgIGlmIChSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt2YWx1ZSwgaSwgdGhpc10pKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5ldmVyeSAqL1xuICBldmVyeShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoXG4gICAgICAgICFSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICBdKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zb21lICovXG4gIHNvbWUoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKFxuICAgICAgICBSZWZsZWN0QXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFtcbiAgICAgICAgICBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSksXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICBdKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zZXQgKi9cbiAgc2V0KGlucHV0LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgdGFyZ2V0T2Zmc2V0ID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAodGFyZ2V0T2Zmc2V0IDwgMCkge1xuICAgICAgdGhyb3cgTmF0aXZlUmFuZ2VFcnJvcihPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyk7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0ID09IG51bGwpIHtcbiAgICAgIHRocm93IE5hdGl2ZVR5cGVFcnJvcihcbiAgICAgICAgQ0FOTk9UX0NPTlZFUlRfVU5ERUZJTkVEX09SX05VTExfVE9fT0JKRUNUXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpc05hdGl2ZUJpZ0ludFR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICB0aHJvdyBOYXRpdmVUeXBlRXJyb3IoXG4gICAgICAgIENBTk5PVF9NSVhfQklHSU5UX0FORF9PVEhFUl9UWVBFU1xuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKGlzRmxvYXQxNkFycmF5KGlucHV0KSkge1xuICAgICAgLy8gcGVlbCBvZmYgUHJveHlcbiAgICAgIHJldHVybiBUeXBlZEFycmF5UHJvdG90eXBlU2V0KFxuICAgICAgICBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpLFxuICAgICAgICBnZXRGbG9hdDE2Qml0c0FycmF5KGlucHV0KSxcbiAgICAgICAgdGFyZ2V0T2Zmc2V0XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpc05hdGl2ZVR5cGVkQXJyYXkoaW5wdXQpKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKGlucHV0KTtcbiAgICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRMZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgY29uc3Qgc3JjID0gTmF0aXZlT2JqZWN0KGlucHV0KTtcbiAgICBjb25zdCBzcmNMZW5ndGggPSBUb0xlbmd0aChzcmMubGVuZ3RoKTtcblxuICAgIGlmICh0YXJnZXRPZmZzZXQgPT09IEluZmluaXR5IHx8IHNyY0xlbmd0aCArIHRhcmdldE9mZnNldCA+IHRhcmdldExlbmd0aCkge1xuICAgICAgdGhyb3cgTmF0aXZlUmFuZ2VFcnJvcihPRkZTRVRfSVNfT1VUX09GX0JPVU5EUyk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcmNMZW5ndGg7ICsraSkge1xuICAgICAgZmxvYXQxNmJpdHNBcnJheVtpICsgdGFyZ2V0T2Zmc2V0XSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhzcmNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5yZXZlcnNlICovXG4gIHJldmVyc2UoKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgVHlwZWRBcnJheVByb3RvdHlwZVJldmVyc2UoZmxvYXQxNmJpdHNBcnJheSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5maWxsICovXG4gIGZpbGwodmFsdWUsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBUeXBlZEFycmF5UHJvdG90eXBlRmlsbChcbiAgICAgIGZsb2F0MTZiaXRzQXJyYXksXG4gICAgICByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpLFxuICAgICAgLi4udG9TYWZlKG9wdHMpXG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmNvcHl3aXRoaW4gKi9cbiAgY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgVHlwZWRBcnJheVByb3RvdHlwZUNvcHlXaXRoaW4oZmxvYXQxNmJpdHNBcnJheSwgdGFyZ2V0LCBzdGFydCwgLi4udG9TYWZlKG9wdHMpKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnNvcnQgKi9cbiAgc29ydCguLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgY29tcGFyZSA9IG9wdHNbMF0gIT09IHVuZGVmaW5lZCA/IG9wdHNbMF0gOiBkZWZhdWx0Q29tcGFyZTtcbiAgICBUeXBlZEFycmF5UHJvdG90eXBlU29ydChmbG9hdDE2Yml0c0FycmF5LCAoeCwgeSkgPT4ge1xuICAgICAgcmV0dXJuIGNvbXBhcmUoY29udmVydFRvTnVtYmVyKHgpLCBjb252ZXJ0VG9OdW1iZXIoeSkpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc2xpY2UgKi9cbiAgc2xpY2UoLi4ub3B0cykge1xuICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcbiAgICBjb25zdCBmbG9hdDE2Yml0c0FycmF5ID0gZ2V0RmxvYXQxNkJpdHNBcnJheSh0aGlzKTtcblxuICAgIGNvbnN0IENvbnN0cnVjdG9yID0gU3BlY2llc0NvbnN0cnVjdG9yKGZsb2F0MTZiaXRzQXJyYXksIEZsb2F0MTZBcnJheSk7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKENvbnN0cnVjdG9yID09PSBGbG9hdDE2QXJyYXkpIHtcbiAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBOYXRpdmVVaW50MTZBcnJheShcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ5dGVPZmZzZXQoZmxvYXQxNmJpdHNBcnJheSksXG4gICAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgoZmxvYXQxNmJpdHNBcnJheSlcbiAgICAgICk7XG4gICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShcbiAgICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihcbiAgICAgICAgICBUeXBlZEFycmF5UHJvdG90eXBlU2xpY2UodWludDE2LCAuLi50b1NhZmUob3B0cykpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcbiAgICBjb25zdCBzdGFydCA9IFRvSW50ZWdlck9ySW5maW5pdHkob3B0c1swXSk7XG4gICAgY29uc3QgZW5kID0gb3B0c1sxXSA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzFdKTtcblxuICAgIGxldCBrO1xuICAgIGlmIChzdGFydCA9PT0gLUluZmluaXR5KSB7XG4gICAgICBrID0gMDtcbiAgICB9IGVsc2UgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgayA9IGxlbmd0aCArIHN0YXJ0ID4gMCA/IGxlbmd0aCArIHN0YXJ0IDogMDtcbiAgICB9IGVsc2Uge1xuICAgICAgayA9IGxlbmd0aCA8IHN0YXJ0ID8gbGVuZ3RoIDogc3RhcnQ7XG4gICAgfVxuXG4gICAgbGV0IGZpbmFsO1xuICAgIGlmIChlbmQgPT09IC1JbmZpbml0eSkge1xuICAgICAgZmluYWwgPSAwO1xuICAgIH0gZWxzZSBpZiAoZW5kIDwgMCkge1xuICAgICAgZmluYWwgPSBsZW5ndGggKyBlbmQgPiAwID8gbGVuZ3RoICsgZW5kIDogMDtcbiAgICB9IGVsc2Uge1xuICAgICAgZmluYWwgPSBsZW5ndGggPCBlbmQgPyBsZW5ndGggOiBlbmQ7XG4gICAgfVxuXG4gICAgY29uc3QgY291bnQgPSBmaW5hbCAtIGsgPiAwID8gZmluYWwgLSBrIDogMDtcbiAgICBjb25zdCBhcnJheSA9IG5ldyBDb25zdHJ1Y3Rvcihjb3VudCk7XG4gICAgYXNzZXJ0U3BlY2llc1R5cGVkQXJyYXkoYXJyYXksIGNvdW50KTtcblxuICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cblxuICAgIGNvbnN0IGJ1ZmZlciA9IFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCdWZmZXIoZmxvYXQxNmJpdHNBcnJheSk7XG4gICAgaWYgKElzRGV0YWNoZWRCdWZmZXIoYnVmZmVyKSkge1xuICAgICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKEFUVEVNUFRJTkdfVE9fQUNDRVNTX0RFVEFDSEVEX0FSUkFZQlVGRkVSKTtcbiAgICB9XG5cbiAgICBsZXQgbiA9IDA7XG4gICAgd2hpbGUgKGsgPCBmaW5hbCkge1xuICAgICAgYXJyYXlbbl0gPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtrXSk7XG4gICAgICArK2s7XG4gICAgICArK247XG4gICAgfVxuXG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoYXJyYXkpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLnN1YmFycmF5ICovXG4gIHN1YmFycmF5KC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBDb25zdHJ1Y3RvciA9IFNwZWNpZXNDb25zdHJ1Y3RvcihmbG9hdDE2Yml0c0FycmF5LCBGbG9hdDE2QXJyYXkpO1xuXG4gICAgY29uc3QgdWludDE2ID0gbmV3IE5hdGl2ZVVpbnQxNkFycmF5KFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldEJ1ZmZlcihmbG9hdDE2Yml0c0FycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KGZsb2F0MTZiaXRzQXJyYXkpLFxuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KVxuICAgICk7XG4gICAgY29uc3QgdWludDE2U3ViYXJyYXkgPSBUeXBlZEFycmF5UHJvdG90eXBlU3ViYXJyYXkodWludDE2LCAuLi50b1NhZmUob3B0cykpO1xuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQ29uc3RydWN0b3IoXG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlR2V0QnVmZmVyKHVpbnQxNlN1YmFycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRCeXRlT2Zmc2V0KHVpbnQxNlN1YmFycmF5KSxcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGVHZXRMZW5ndGgodWludDE2U3ViYXJyYXkpXG4gICAgKTtcbiAgICBhc3NlcnRTcGVjaWVzVHlwZWRBcnJheShhcnJheSk7XG5cbiAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChhcnJheSk7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuaW5kZXhvZiAqL1xuICBpbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgbGV0IGZyb20gPSBUb0ludGVnZXJPckluZmluaXR5KG9wdHNbMF0pO1xuICAgIGlmIChmcm9tID09PSBJbmZpbml0eSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgZnJvbSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKFxuICAgICAgICBPYmplY3RIYXNPd24oZmxvYXQxNmJpdHNBcnJheSwgaSkgJiZcbiAgICAgICAgY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzQXJyYXlbaV0pID09PSBlbGVtZW50XG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0ldHlwZWRhcnJheSUucHJvdG90eXBlLmxhc3RpbmRleG9mICovXG4gIGxhc3RJbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBUeXBlZEFycmF5UHJvdG90eXBlR2V0TGVuZ3RoKGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgbGV0IGZyb20gPSBvcHRzLmxlbmd0aCA+PSAxID8gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKSA6IGxlbmd0aCAtIDE7XG4gICAgaWYgKGZyb20gPT09IC1JbmZpbml0eSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChmcm9tID49IDApIHtcbiAgICAgIGZyb20gPSBmcm9tIDwgbGVuZ3RoIC0gMSA/IGZyb20gOiBsZW5ndGggLSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgT2JqZWN0SGFzT3duKGZsb2F0MTZiaXRzQXJyYXksIGkpICYmXG4gICAgICAgIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c0FycmF5W2ldKSA9PT0gZWxlbWVudFxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5pbmNsdWRlcyAqL1xuICBpbmNsdWRlcyhlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gVHlwZWRBcnJheVByb3RvdHlwZUdldExlbmd0aChmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyT3JJbmZpbml0eShvcHRzWzBdKTtcbiAgICBpZiAoZnJvbSA9PT0gSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgIGZyb20gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGlzTmFOID0gTnVtYmVySXNOYU4oZWxlbWVudCk7XG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNBcnJheVtpXSk7XG5cbiAgICAgIGlmIChpc05hTiAmJiBOdW1iZXJJc05hTih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuam9pbiAqL1xuICBqb2luKC4uLm9wdHMpIHtcbiAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG4gICAgY29uc3QgZmxvYXQxNmJpdHNBcnJheSA9IGdldEZsb2F0MTZCaXRzQXJyYXkodGhpcyk7XG5cbiAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzQXJyYXkpO1xuXG4gICAgcmV0dXJuIEFycmF5UHJvdG90eXBlSm9pbihhcnJheSwgLi4udG9TYWZlKG9wdHMpKTtcbiAgfVxuXG4gIC8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS50b2xvY2FsZXN0cmluZyAqL1xuICB0b0xvY2FsZVN0cmluZyguLi5vcHRzKSB7XG4gICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuICAgIGNvbnN0IGZsb2F0MTZiaXRzQXJyYXkgPSBnZXRGbG9hdDE2Qml0c0FycmF5KHRoaXMpO1xuXG4gICAgY29uc3QgYXJyYXkgPSBjb3B5VG9BcnJheShmbG9hdDE2Yml0c0FycmF5KTtcblxuICAgIHJldHVybiBBcnJheVByb3RvdHlwZVRvTG9jYWxlU3RyaW5nKGFycmF5LCAuLi50b1NhZmUob3B0cykpO1xuICB9XG5cbiAgLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1nZXQtJXR5cGVkYXJyYXklLnByb3RvdHlwZS1AQHRvc3RyaW5ndGFnICovXG4gIGdldCBbU3ltYm9sVG9TdHJpbmdUYWddKCkge1xuICAgIGlmIChpc0Zsb2F0MTZBcnJheSh0aGlzKSkge1xuICAgICAgcmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoXCJGbG9hdDE2QXJyYXlcIik7XG4gICAgfVxuICB9XG59XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdHlwZWRhcnJheS5ieXRlc19wZXJfZWxlbWVudCAqL1xuT2JqZWN0RGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5LCBcIkJZVEVTX1BFUl9FTEVNRU5UXCIsIHtcbiAgdmFsdWU6IEJZVEVTX1BFUl9FTEVNRU5ULFxufSk7XG5cbi8vIGxpbWl0YXRpb246IEl0IGlzIHBlYWtlZCBieSBgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhGbG9hdDE2QXJyYXkpYCBhbmQgYFJlZmxlY3Qub3duS2V5cyhGbG9hdDE2QXJyYXkpYFxuT2JqZWN0RGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5LCBicmFuZCwge30pO1xuXG4vKiogQHNlZSBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLXR5cGVkYXJyYXktY29uc3RydWN0b3JzICovXG5SZWZsZWN0U2V0UHJvdG90eXBlT2YoRmxvYXQxNkFycmF5LCBUeXBlZEFycmF5KTtcblxuY29uc3QgRmxvYXQxNkFycmF5UHJvdG90eXBlID0gRmxvYXQxNkFycmF5LnByb3RvdHlwZTtcblxuLyoqIEBzZWUgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10eXBlZGFycmF5LnByb3RvdHlwZS5ieXRlc19wZXJfZWxlbWVudCAqL1xuT2JqZWN0RGVmaW5lUHJvcGVydHkoRmxvYXQxNkFycmF5UHJvdG90eXBlLCBcIkJZVEVTX1BFUl9FTEVNRU5UXCIsIHtcbiAgdmFsdWU6IEJZVEVTX1BFUl9FTEVNRU5ULFxufSk7XG5cbi8qKiBAc2VlIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS1AQGl0ZXJhdG9yICovXG5PYmplY3REZWZpbmVQcm9wZXJ0eShGbG9hdDE2QXJyYXlQcm90b3R5cGUsIFN5bWJvbEl0ZXJhdG9yLCB7XG4gIHZhbHVlOiBGbG9hdDE2QXJyYXlQcm90b3R5cGUudmFsdWVzLFxuICB3cml0YWJsZTogdHJ1ZSxcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxufSk7XG5cbi8vIFRvIG1ha2UgYG5ldyBGbG9hdDE2QXJyYXkoKSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5YCByZXR1cm5zIGBmYWxzZWBcblJlZmxlY3RTZXRQcm90b3R5cGVPZihGbG9hdDE2QXJyYXlQcm90b3R5cGUsIFR5cGVkQXJyYXlQcm90b3R5cGUpO1xuIiwiaW1wb3J0IHsgdG9TYWZlIH0gZnJvbSBcIi4vX3V0aWwvYXJyYXlJdGVyYXRvci5tanNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vX3V0aWwvY29udmVydGVyLm1qc1wiO1xuaW1wb3J0IHtcbiAgRGF0YVZpZXdQcm90b3R5cGVHZXRVaW50MTYsXG4gIERhdGFWaWV3UHJvdG90eXBlU2V0VWludDE2LFxufSBmcm9tIFwiLi9fdXRpbC9wcmltb3JkaWFscy5tanNcIjtcblxuLyoqXG4gKiByZXR1cm5zIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlldy5cbiAqXG4gKiBAcGFyYW0ge0RhdGFWaWV3fSBkYXRhVmlld1xuICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXRcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmxvYXQxNihkYXRhVmlldywgYnl0ZU9mZnNldCwgLi4ub3B0cykge1xuICByZXR1cm4gY29udmVydFRvTnVtYmVyKFxuICAgIERhdGFWaWV3UHJvdG90eXBlR2V0VWludDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCAuLi50b1NhZmUob3B0cykpXG4gICk7XG59XG5cbi8qKlxuICogc3RvcmVzIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCB2YWx1ZSBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlldy5cbiAqXG4gKiBAcGFyYW0ge0RhdGFWaWV3fSBkYXRhVmlld1xuICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXRcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxuICogQHBhcmFtIHtbYm9vbGVhbl19IG9wdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEZsb2F0MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIHZhbHVlLCAuLi5vcHRzKSB7XG4gIHJldHVybiBEYXRhVmlld1Byb3RvdHlwZVNldFVpbnQxNihcbiAgICBkYXRhVmlldyxcbiAgICBieXRlT2Zmc2V0LFxuICAgIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSksXG4gICAgLi4udG9TYWZlKG9wdHMpXG4gICk7XG59XG4iLCJpbXBvcnQgeyBjb252ZXJ0VG9OdW1iZXIsIHJvdW5kVG9GbG9hdDE2Qml0cyB9IGZyb20gXCIuL191dGlsL2NvbnZlcnRlci5tanNcIjtcbmltcG9ydCB7IENBTk5PVF9DT05WRVJUX0FfQklHSU5UX1ZBTFVFX1RPX0FfTlVNQkVSIH0gZnJvbSBcIi4vX3V0aWwvbWVzc2FnZXMubWpzXCI7XG5pbXBvcnQge1xuICBOYXRpdmVOdW1iZXIsXG4gIE5hdGl2ZVR5cGVFcnJvcixcbiAgTnVtYmVySXNGaW5pdGUsXG59IGZyb20gXCIuL191dGlsL3ByaW1vcmRpYWxzLm1qc1wiO1xuXG4vKipcbiAqIHJldHVybnMgdGhlIG5lYXJlc3QgaGFsZi1wcmVjaXNpb24gZmxvYXQgcmVwcmVzZW50YXRpb24gb2YgYSBudW1iZXIuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhmcm91bmQobnVtKSB7XG4gIGlmICh0eXBlb2YgbnVtID09PSBcImJpZ2ludFwiKSB7XG4gICAgdGhyb3cgTmF0aXZlVHlwZUVycm9yKENBTk5PVF9DT05WRVJUX0FfQklHSU5UX1ZBTFVFX1RPX0FfTlVNQkVSKTtcbiAgfVxuXG4gIG51bSA9IE5hdGl2ZU51bWJlcihudW0pO1xuXG4gIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgaWYgKCFOdW1iZXJJc0Zpbml0ZShudW0pIHx8IG51bSA9PT0gMCkge1xuICAgIHJldHVybiBudW07XG4gIH1cblxuICBjb25zdCB4MTYgPSByb3VuZFRvRmxvYXQxNkJpdHMobnVtKTtcbiAgcmV0dXJuIGNvbnZlcnRUb051bWJlcih4MTYpO1xufVxuIiwiLyogaWdub3JlIHVudXNlZCBleHBvcnRzICovXG5cbmltcG9ydCB7IEZsb2F0MTZBcnJheSwgaXNGbG9hdDE2QXJyYXkgfSBmcm9tIFwiLi9GbG9hdDE2QXJyYXkubWpzXCI7XG5pbXBvcnQgeyBpc05hdGl2ZVR5cGVkQXJyYXkgfSBmcm9tIFwiLi9fdXRpbC9pcy5tanNcIjtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge3ZhbHVlIGlzIFVpbnQ4QXJyYXl8VWludDhDbGFtcGVkQXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8SW50OEFycmF5fEludDE2QXJyYXl8SW50MzJBcnJheXxGbG9hdDE2QXJyYXl8RmxvYXQzMkFycmF5fEZsb2F0NjRBcnJheXxCaWdVaW50NjRBcnJheXxCaWdJbnQ2NEFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNUeXBlZEFycmF5KHRhcmdldCkge1xuICByZXR1cm4gaXNOYXRpdmVUeXBlZEFycmF5KHRhcmdldCkgfHwgaXNGbG9hdDE2QXJyYXkodGFyZ2V0KTtcbn1cblxuZXhwb3J0IHsgRmxvYXQxNkFycmF5LCBpc0Zsb2F0MTZBcnJheSB9O1xuXG5leHBvcnQgeyBnZXRGbG9hdDE2LCBzZXRGbG9hdDE2IH0gZnJvbSBcIi4vRGF0YVZpZXcubWpzXCI7XG5leHBvcnQgeyBoZnJvdW5kIH0gZnJvbSBcIi4vaGZyb3VuZC5tanNcIjtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztFQUlBLFNBQVMsV0FBVyxDQUFDLE1BQU0sRUFBRTtFQUM3QixFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLEtBQUs7RUFDL0IsSUFBSSxPQUFPLFlBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQy9DLEdBQUcsQ0FBQztFQUNKLENBQUM7RUFHRCxTQUFTLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7RUFDeEMsRUFBRSxPQUFPLFdBQVc7RUFDcEIsSUFBSSwrQkFBK0I7RUFDbkMsTUFB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S0FBSyxFQUFFLENBQUM7RUFDM0MsSUFBSSxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxNQUFNLENBQUM7RUFDckQsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0VBQy9CLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7RUFHL0IsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRTtFQUN0QixJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsV0FBVyxNQUFNLENBQUM7RUFDbEMsSUFBSSxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQztFQUNsQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7RUFDL0IsSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztFQUcvQixHQUFHLE1BQU07RUFDVCxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsV0FBVyxNQUFNLENBQUM7RUFDbEMsSUFBSSxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQztFQUNsQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7RUFDL0IsSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztFQUMvQixHQUFHO0VBQ0gsQ0FBQztFQVFNLFNBQVMsa0JBQWtCLENBQUMsR0FBRyxFQUFFO0VBQ3hDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUF1QixHQUFHLENBQUMsQ0FBQztFQUMxQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMxQixFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxLQUFLLENBQUM7RUFDOUIs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
