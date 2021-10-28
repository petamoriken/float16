import {
  GeneratorPrototypeNext,
  IteratorPrototype,
  NativeWeakMap,
  ObjectCreate,
  SymbolToStringTag,
  WeakMapPrototypeGet,
  WeakMapPrototypeSet,
} from "./primordials.mjs";

/** @type {WeakMap<object, Generator<any>>} */
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
export function wrapInArrayIterator(generator) {
  const arrayIterator = ObjectCreate(ArrayIteratorPrototype);
  WeakMapPrototypeSet(generators, arrayIterator, generator);
  return arrayIterator;
}
