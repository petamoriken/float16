/* eslint-disable jsdoc/check-tag-names */

import {
  GeneratorPrototypeNext,
  IteratorPrototype,
  ObjectCreate,
  SymbolToStringTag,
} from "./_util/primordials.mjs";
import { createPrivateStorage } from "./_util/private.mjs";

const _ =
  /** @type {(self: object) => { generator: Iterator<any> }} */ (createPrivateStorage());

/** @see https://tc39.es/ecma262/#sec-%arrayiteratorprototype%-object */
const ArrayIteratorPrototype = ObjectCreate(IteratorPrototype, {
  next: {
    value: function next() {
      return GeneratorPrototypeNext(_(this).generator);
    },
    writable: true,
    configurable: true,
  },

  [SymbolToStringTag]: {
    value: "Array Iterator",
    configurable: true,
  },
});

/**
 * @template T
 * @param {Generator<T>} generator
 * @returns {IterableIterator<T>}
 */
export function wrapInArrayIterator(generator) {
  const arrayIterator = ObjectCreate(ArrayIteratorPrototype);
  _(arrayIterator).generator = generator;
  return arrayIterator;
}
