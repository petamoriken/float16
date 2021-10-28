import {
  NativeWeakMap,
  ObjectCreate,
  WeakMapPrototypeGet,
  WeakMapPrototypeSet,
} from "./primordials.mjs";

/** @returns {(self: object) => object} */
export function createPrivateStorage() {
  const wm = new NativeWeakMap();

  return (self) => {
    const storage = WeakMapPrototypeGet(wm, self);
    if (storage !== undefined) {
      return storage;
    }

    const obj = ObjectCreate(null);
    WeakMapPrototypeSet(wm, self, obj);
    return obj;
  };
}
