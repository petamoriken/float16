import { createPrivateStorage } from "./_util/private.mjs";

const _ = createPrivateStorage();

const IteratorPrototype = Reflect.getPrototypeOf(Reflect.getPrototypeOf([][Symbol.iterator]()));

/** @see https://tc39.es/ecma262/#sec-%arrayiteratorprototype%-object */
const ArrayIteratorPrototype = Object.create(IteratorPrototype, {
  next: {
    value: function next() {
      return _(this).iterator.next();
    },
    writable: true,
    configurable: true,
  },

  [Symbol.toStringTag]: {
    value: "Array Iterator",
    configurable: true,
  },
});

/**
 * @param {Iterator<number>} iterator
 * @returns {IterableIterator<number>}
 */
export function wrapInArrayIterator(iterator) {
  const arrayIterator = Object.create(ArrayIteratorPrototype);
  _(arrayIterator).iterator = iterator;
  return arrayIterator;
}
