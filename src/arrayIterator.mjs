import { createPrivateStorage } from "./private.mjs";

const _ = createPrivateStorage();

const IteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));

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
