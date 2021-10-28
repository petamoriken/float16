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
export const {
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
export const NativeProxy = Proxy;

// Number
export const NativeNumber = Number;
export const {
  isFinite: NumberIsFinite,
  isNaN: NumberIsNaN,
} = NativeNumber;

// Symbol
export const {
  iterator: SymbolIterator,
  species: SymbolSpecies,
  toStringTag: SymbolToStringTag,
  for: SymbolFor,
} = Symbol;

// Array
const NativeArray = Array;
export const ArrayIsArray = NativeArray.isArray;
const ArrayPrototype = NativeArray.prototype;
/** @type {(array: Array<unknown>, separator?: string) => string} */
export const ArrayPrototypeJoin = uncurryThis(ArrayPrototype.join);
/** @type {<T>(array: Array<T>, ...items: T[]) => number} */
export const ArrayPrototypePush = uncurryThis(ArrayPrototype.push);
/** @type {(array: Array<unknown>) => string} */
export const ArrayPrototypeToLocaleString = uncurryThis(
  ArrayPrototype.toLocaleString
);

// Object
export const NativeObject = Object;
export const {
  create: ObjectCreate,
  defineProperty: ObjectDefineProperty,
  freeze: ObjectFreeze,
  is: ObjectIs,
} = NativeObject;
/** @type {(object: object, key: PropertyKey) => boolean} */
export const ObjectHasOwn = /** @type {any} */ (NativeObject).hasOwn ||
  uncurryThis(NativeObject.prototype.hasOwnProperty);

// Math
export const MathTrunc = Math.trunc;

// ArrayBuffer
export const NativeArrayBuffer = ArrayBuffer;

// TypedArray
/** @typedef {Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float32Array|Float64Array|BigUint64Array|BigInt64Array} TypedArray */
/** @type {any} */
const TypedArray = ReflectGetPrototypeOf(Uint8Array);
export const TypedArrayPrototype = TypedArray.prototype;
/** @type {(typedArray: TypedArray) => IterableIterator<number>} */
export const TypedArrayPrototypeKeys = uncurryThis(TypedArrayPrototype.keys);
/** @type {(typedArray: TypedArray) => IterableIterator<number>} */
export const TypedArrayPrototypeValues = uncurryThis(
  TypedArrayPrototype.values
);
/** @type {(typedArray: TypedArray) => IterableIterator<[number, number]>} */
export const TypedArrayPrototypeEntries = uncurryThis(
  TypedArrayPrototype.entries
);
/** @type {(typedArray: TypedArray, array: ArrayLike<number>, offset?: number) => void} */
export const TypedArrayPrototypeSet = uncurryThis(TypedArrayPrototype.set);
/** @type {<T extends TypedArray>(typedArray: T) => T} */
export const TypedArrayPrototypeReverse = uncurryThis(
  TypedArrayPrototype.reverse
);
/** @type {<T extends TypedArray>(typedArray: T, value: number, start?: number, end?: number) => T} */
export const TypedArrayPrototypeFill = uncurryThis(TypedArrayPrototype.fill);
/** @type {<T extends TypedArray>(typedArray: T, target: number, start: number, end?: number) => T} */
export const TypedArrayPrototypeCopyWithin = uncurryThis(
  TypedArrayPrototype.copyWithin
);
/** @type {<T extends TypedArray>(typedArray: T, compareFn?: (a: number, b: number) => number) => T} */
export const TypedArrayPrototypeSort = uncurryThis(TypedArrayPrototype.sort);
/** @type {<T extends TypedArray>(typedArray: T, start?: number, end?: number) => T} */
export const TypedArrayPrototypeSlice = uncurryThis(TypedArrayPrototype.slice);
/** @type {<T extends TypedArray>(typedArray: T, start?: number, end?: number) => T} */
export const TypedArrayPrototypeSubarray = uncurryThis(
  TypedArrayPrototype.subarray
);
/** @type {((typedArray: TypedArray) => ArrayBuffer)} */
export const TypedArrayPrototypeGetBuffer = uncurryThis(
  ReflectGetOwnPropertyDescriptor(
    TypedArrayPrototype,
    "buffer"
  ).get
);
/** @type {((typedArray: TypedArray) => number)} */
export const TypedArrayPrototypeGetByteOffset = uncurryThisGetter(
  TypedArrayPrototype,
  "byteOffset"
);
/** @type {((typedArray: TypedArray) => number)} */
export const TypedArrayPrototypeGetLength = uncurryThisGetter(
  TypedArrayPrototype,
  "length"
);
/** @type {(target: unknown) => string} */
export const TypedArrayPrototypeGetSymbolToStringTag = uncurryThisGetter(
  TypedArrayPrototype,
  SymbolToStringTag
);

// Uint16Array
export const NativeUint16Array = Uint16Array;
export const Uint16ArrayFrom = TypedArray.from.bind(NativeUint16Array);

// Uint32Array
export const NativeUint32Array = Uint32Array;

// Float32Array
export const NativeFloat32Array = Float32Array;

// Iterator
export const IteratorPrototype = ReflectGetPrototypeOf(
  ReflectGetPrototypeOf([][SymbolIterator]())
);

// Generator
const GeneratorPrototype = (function* () {}).constructor.prototype.prototype;
/** @type {<T = unknown, TReturn = any, TNext = unknown>(generator: Generator<T, TReturn, TNext>, value?: TNext) => T} */
export const GeneratorPrototypeNext = uncurryThis(GeneratorPrototype.next);

// DataView
const DataViewPrototype = DataView.prototype;
/** @type {(dataView: DataView, byteOffset: number, littleEndian?: boolean) => number} */
export const DataViewPrototypeGetUint16 = uncurryThis(
  DataViewPrototype.getUint16
);
/** @type {(dataView: DataView, byteOffset: number, value: number, littleEndian?: boolean) => void} */
export const DataViewPrototypeSetUint16 = uncurryThis(
  DataViewPrototype.setUint16
);

// Error
export const NativeTypeError = TypeError;
export const NativeRangeError = RangeError;

// Set
export const NativeSet = Set;
const SetPrototype = NativeSet.prototype;
/** @type {<T>(set: Set<T>, value: T) => Set<T>} */
export const SetPrototypeAdd = uncurryThis(SetPrototype.add);
/** @type {<T>(set: Set<T>, value: T) => boolean} */
export const SetPrototypeHas = uncurryThis(SetPrototype.has);

// WeakMap
export const NativeWeakMap = WeakMap;
const WeakMapPrototype = NativeWeakMap.prototype;
/** @type {<K extends object, V>(weakMap: WeakMap<K, V>, key: K) => V} */
export const WeakMapPrototypeGet = uncurryThis(WeakMapPrototype.get);
/** @type {<K extends object, V>(weakMap: WeakMap<K, V>, key: K, value: V) => WeakMap} */
export const WeakMapPrototypeSet = uncurryThis(WeakMapPrototype.set);
