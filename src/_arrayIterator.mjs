/* eslint-disable jsdoc/check-tag-names */

import { createPrivateStorage } from "./_util/private.mjs";

const _ =
  /** @type {(self: object) => { iterator: Iterator<any> }} */ (createPrivateStorage());

const IteratorPrototype = Reflect.getPrototypeOf(
  /** @type {any} */ Reflect.getPrototypeOf([][Symbol.iterator]()),
);

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
 * @template T
 * @param {Iterator<T>} iterator
 * @returns {IterableIterator<T>}
 */
export function wrapInArrayIterator(iterator) {
  const arrayIterator = Object.create(ArrayIteratorPrototype);
  _(arrayIterator).iterator = iterator;
  return arrayIterator;
}
