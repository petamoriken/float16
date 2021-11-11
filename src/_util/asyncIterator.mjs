import { isObject } from "./is.mjs";
import { ITERATOR_RESULT_IS_NOT_AN_OBJECT, PROPERTY_IS_NOT_CALLABLE, THE_ALLOWED_ARRAY_SIZE_HAS_BEEN_EXCEEDED } from "./messages.mjs";
import { ArrayPrototypeSymbolIterator, NativePromise, NativeTypeError, PromisePrototypeCatch, PromisePrototypeThen, PromiseResolve, ReflectApply, SymbolAsyncIterator, SymbolIterator } from "./primordials.mjs";

const UINT32_MAX = 4294967295;

/**
 * @see https://tc39.es/ecma262/#sec-asyncfromsynciteratorcontinuation
 * @param {IteratorResult<any>} result
 * @returns {Promise<IteratorResult<any>>}
 */
function syncToAsyncContinuation(result) {
  const valueWrapper = PromiseResolve(result.value);
  const done = result.done;
  return PromisePrototypeThen(valueWrapper, (value) => {
    return { value, done };
  });
}

/**
 * @see https://tc39.es/ecma262/#sec-createasyncfromsynciterator
 * @param {Iterator<any>} iterator
 * @returns {AsyncIterator<any>}
 */
function syncToAsync(iterator) {
  return {
    next() {
      return syncToAsyncContinuation(iterator.next());
    },

    return() {
      const fn = iterator.return;
      let result;
      if (fn === undefined) {
        result = { value: undefined, done: true };
      } else {
        result = ReflectApply(fn, iterator, []);
      }
      return syncToAsyncContinuation(result);
    },

    // throw method won't be called
  };
}

/**
 * @see https://tc39.es/ecma262/#sec-asynciteratorclose
 * @param {AsyncIterator<any>} iterator
 * @param {Error} error
 * @returns {Promise<any>}
 */
function close(iterator, error) {
  const innerResult = /** @type {any} */ (iterator).result;
  if (innerResult == null) {
    throw error;
  }

  return PromisePrototypeThen(
    PromiseResolve(
      ReflectApply(innerResult, iterator, [])
    ),
    () => { throw error; }
  );
}

/**
 * @param {unknown} iterable
 * @param {Function=} mapFn
 * @param {any=} thisArg
 * @returns {Promise<any[]>}
 */
export function toArray(iterable, mapFn, thisArg) {
  const mapping = mapFn !== undefined;

  /** @type {AsyncIterator<any>} */
  let iterator;

  // eslint-disable-next-line no-restricted-globals
  const _SymbolAsyncIteratpr = SymbolAsyncIterator || Symbol.asyncIterator;
  if (_SymbolAsyncIteratpr !== undefined) {
    const usingAsyncIterator = iterable[_SymbolAsyncIteratpr];
    if (usingAsyncIterator != null && typeof usingAsyncIterator !== "function") {
      throw NativeTypeError(PROPERTY_IS_NOT_CALLABLE);
    }
    if (usingAsyncIterator != null) {
      iterator = ReflectApply(usingAsyncIterator, iterable, []);
    }
  }

  // fallback to iterator
  if (iterator === undefined) {
    const usingIterator = iterable[SymbolIterator];
    if (usingIterator != null && typeof usingIterator !== "function") {
      throw NativeTypeError(PROPERTY_IS_NOT_CALLABLE);
    }

    if (usingIterator != null) {
      iterator = syncToAsync(ReflectApply(usingIterator, iterable, []));
    } else {
      iterator = syncToAsync(
        ArrayPrototypeSymbolIterator(/** @type {any} */(iterable))
      );
    }
  }

  const array = [];

  let k = 0;
  return PromisePrototypeCatch(
    new NativePromise((resolve, reject) => {
      (function loop() {
        if (k === UINT32_MAX) {
          throw NativeTypeError(THE_ALLOWED_ARRAY_SIZE_HAS_BEEN_EXCEEDED);
        }

        PromisePrototypeCatch(
          PromisePrototypeThen(PromiseResolve(iterator.next()), (/** @type {IteratorResult<any>} */ result) => {
            if (!isObject(result)) {
              throw NativeTypeError(ITERATOR_RESULT_IS_NOT_AN_OBJECT);
            }

            if (result.done) {
              resolve(array);
              return;
            }

            if (mapping) {
              array[k] = ReflectApply(mapFn, thisArg, [result.value, k]);
            } else {
              array[k] = result.value;
            }

            ++k;
            loop();
          }),
          reject
        );
      })();
    }),
    (error) => {
      return close(iterator, error);
    }
  );
}
