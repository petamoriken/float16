/* eslint-disable no-restricted-globals */

const FunctionPrototypeBind = Function.prototype.bind;
const FunctionPrototypeCall = Function.prototype.call;
const uncurryThis = FunctionPrototypeBind.bind(FunctionPrototypeCall);

// Reflect
export const ReflectGet = Reflect.get;
export const ReflectGetOwnPropertyDescriptor = Reflect.getOwnPropertyDescriptor;
export const ReflectGetPrototypeOf = Reflect.getPrototypeOf;
export const ReflectHas = Reflect.has;
export const ReflectOwnKeys = Reflect.ownKeys;
export const ReflectSet = Reflect.set;
export const ReflectSetPrototypeOf = Reflect.setPrototypeOf;

// Proxy
export const NativeProxy = Proxy;

// Number
export const NativeNumber = Number;
export const NumberIsFinite = Number.isFinite;
export const NumberIsNaN = Number.isNaN;

// Symbol
export const SymbolIterator = Symbol.iterator;
export const SymbolSpecies = Symbol.species;
export const SymbolToStringTag = Symbol.toStringTag;
export const SymbolFor = Symbol.for;

// Array
export const ArrayIsArray = Array.isArray;
export const ArrayPrototypeJoin = uncurryThis(Array.prototype.join);
export const ArrayPrototypePush = uncurryThis(Array.prototype.push);
export const ArrayPrototypeToLocaleString = uncurryThis(
  Array.prototype.toLocaleString,
);

// Object
export const NativeObject = Object;
export const ObjectCreate = Object.create;
export const ObjectDefineProperty = Object.defineProperty;
export const ObjectFreeze = Object.freeze;
export const ObjectIs = Object.is;
/** @type {(object: object, key: PropertyKey) => boolean} */
export const ObjectHasOwn = /** @type {any} */ (Object).hasOwn ||
  uncurryThis(Object.prototype.hasOwnProperty);

// Math
export const MathTrunc = Math.trunc;

// ArrayBuffer
export const NativeArrayBuffer = ArrayBuffer;

// TypedArray
/** @typedef {Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float32Array|Float64Array|BigUint64Array|BigInt64Array} TypedArray */
/** @type {any} */
const TypedArray = Reflect.getPrototypeOf(Uint8Array);
export const TypedArrayPrototype = TypedArray.prototype;
/** @type {(typedArray: TypedArray) => IterableIterator<number>} */
export const TypedArrayPrototypeKeys = uncurryThis(TypedArrayPrototype.keys);
/** @type {(typedArray: TypedArray) => IterableIterator<number>} */
export const TypedArrayPrototypeValues = uncurryThis(
  TypedArrayPrototype.values,
);
/** @type {(typedArray: TypedArray) => IterableIterator<[number, number]>} */
export const TypedArrayPrototypeEntries = uncurryThis(
  TypedArrayPrototype.entries,
);
/** @type {(typedArray: TypedArray, array: ArrayLike<number>, offset?: number) => void} */
export const TypedArrayPrototypeSet = uncurryThis(TypedArrayPrototype.set);
/** @type {<T extends TypedArray>(typedArray: T) => T} */
export const TypedArrayPrototypeReverse = uncurryThis(
  TypedArrayPrototype.reverse,
);
/** @type {<T extends TypedArray>(typedArray: T, value: number, start?: number, end?: number) => T} */
export const TypedArrayPrototypeFill = uncurryThis(TypedArrayPrototype.fill);
/** @type {<T extends TypedArray>(typedArray: T, target: number, start: number, end?: number) => T} */
export const TypedArrayPrototypeCopyWithin = uncurryThis(
  TypedArrayPrototype.copyWithin,
);
/** @type {<T extends TypedArray>(typedArray: T, compareFn?: (a: number, b: number) => number) => T} */
export const TypedArrayPrototypeSort = uncurryThis(TypedArrayPrototype.sort);
/** @type {<T extends TypedArray>(typedArray: T, start?: number, end?: number) => T} */
export const TypedArrayPrototypeSlice = uncurryThis(TypedArrayPrototype.slice);
/** @type {<T extends TypedArray>(typedArray: T, start?: number, end?: number) => T} */
export const TypedArrayPrototypeSubarray = uncurryThis(
  TypedArrayPrototype.subarray,
);
/** @type {(target: unknown) => string} */
export const TypedArrayPrototypeGetSymbolToStringTag = uncurryThis(
  Reflect.getOwnPropertyDescriptor(
    TypedArrayPrototype,
    Symbol.toStringTag,
  ).get,
);

// Uint16Array
export const NativeUint16Array = Uint16Array;
export const Uint16ArrayFrom = TypedArray.from.bind(Uint16Array);

// Iterator
export const IteratorPrototype = Reflect.getPrototypeOf(
  /** @type {any} */ Reflect.getPrototypeOf([][Symbol.iterator]()),
);

// Generator
const GeneratorPrototype = (function* () {}).constructor.prototype.prototype;
/** @type {<T = unknown, TReturn = any, TNext = unknown>(generator: Generator<T, TReturn, TNext>, value?: TNext) => T} */
export const GeneratorPrototypeNext = uncurryThis(GeneratorPrototype.next);

// DataView
/** @type {(dataView: DataView, byteOffset: number, littleEndian?: boolean) => number} */
export const DataViewPrototypeGetUint16 = uncurryThis(
  DataView.prototype.getUint16,
);
/** @type {(dataView: DataView, byteOffset: number, value: number, littleEndian?: boolean) => void} */
export const DataViewPrototypeSetUint16 = uncurryThis(
  DataView.prototype.setUint16,
);

// Error
export const NativeTypeError = TypeError;
export const NativeRangeError = RangeError;

// Set
export const NativeSet = Set;
/** @type {<T>(set: Set<T>, value: T) => Set<T>} */
export const SetPrototypeAdd = uncurryThis(Set.prototype.add);
/** @type {<T>(set: Set<T>, value: T) => boolean} */
export const SetPrototypeHas = uncurryThis(Set.prototype.has);

// WeakMap
export const NativeWeakMap = WeakMap;
/** @type {<K extends object, V>(weakMap: WeakMap<K, V>, key: K) => V} */
export const WeakMapPrototypeGet = uncurryThis(WeakMap.prototype.get);
/** @type {<K extends object, V>(weakMap: WeakMap<K, V>, key: K, value: V) => WeakMap} */
export const WeakMapPrototypeSet = uncurryThis(WeakMap.prototype.set);
