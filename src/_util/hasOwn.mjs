const hasOwnProperty = Object.prototype.hasOwnProperty;

/** @type {(object: object, key: PropertyKey) => boolean} */
export const hasOwn = /** @type {any} */ (Object).hasOwn || function hasOwn(object, key) {
  return hasOwnProperty.call(object, key);
};
