import {
  ArrayIteratorPrototypeNext,
  ArrayPrototypeSymbolIterator,
  GeneratorPrototypeNext,
  IteratorPrototype,
  NativeArrayPrototypeSymbolIterator,
  NativeWeakMap,
  ObjectCreate,
  ObjectFreeze,
  SymbolIterator,
  SymbolToStringTag,
  WeakMapPrototypeGet,
  WeakMapPrototypeSet,
} from "./primordials.mjs";

/** @type {WeakMap<{}, IterableIterator<any>>} */
const arrayIterators = new NativeWeakMap();

const SafeArrayIteratorPrototype = ObjectFreeze(
  ObjectCreate(null, {
    next: {
      value() {
        const arrayIterator = WeakMapPrototypeGet(arrayIterators, this);
        return ArrayIteratorPrototypeNext(arrayIterator);
      },
    },

    [SymbolIterator]: {
      value() {
        return this;
      },
    },
  })
);

/**
 * Wrap with the SafeArrayIterator If Array.prototype [@@iterator] has been modified
 *
 * @type {<T>(array: T[]) => Iterable<T>}
 */
export function toSafe(array) {
  if (array[SymbolIterator] === NativeArrayPrototypeSymbolIterator) {
    return array;
  }

  const arrayIterator = ArrayPrototypeSymbolIterator(array);
  const wrapper = ObjectCreate(SafeArrayIteratorPrototype);
  WeakMapPrototypeSet(arrayIterators, wrapper, arrayIterator);
  return wrapper;
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
export function wrapGenerator(generator) {
  const dummy = ObjectCreate(DummyArrayIteratorPrototype);
  WeakMapPrototypeSet(generators, dummy, generator);
  return dummy;
}
