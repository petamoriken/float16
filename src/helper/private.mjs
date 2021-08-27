/**
 * @returns {(self:object) => object}
 */
export function createPrivateStorage() {
  const wm = new WeakMap();
  return (self) => {
    const storage = wm.get(self);
    if (storage !== undefined) {
      return storage;
    }

    const obj = Object.create(null);
    wm.set(self, obj);
    return obj;
  };
}
