import memoize from "lodash-es/memoize.js";
import { wrapInArrayIterator } from "./arrayIterator.mjs";
import { isArrayBuffer, isCanonicalIntegerIndexString , isIterable, isObject, isSharedArrayBuffer, isTypedArray } from "./is.mjs";
import { convertToNumber, roundToFloat16Bits } from "./lib.mjs";
import { createPrivateStorage } from "./private.mjs";
import { LengthOfArrayLike, SpeciesConstructor, ToIntegerOrInfinity, defaultCompareFunction } from "./spec.mjs";


const _ = createPrivateStorage();

/**
 * @param {unknown} target
 * @returns {boolean}
 */
function isFloat16Array(target) {
    return target instanceof Float16Array;
}

/**
 * @param {unknown} target
 * @throws {TypeError}
 */
function assertFloat16Array(target) {
    if (!isFloat16Array(target)) {
        throw new TypeError("This is not a Float16Array");
    }
}

/**
 * @param {unknown} target
 * @returns {boolean}
 */
function isDefaultFloat16ArrayMethods(target) {
    return typeof target === "function" && defaultFloat16ArrayMethods.has(target);
}

/**
 * @param {Float16Array} float16bits
 * @return {number[]}
 */
function copyToArray(float16bits) {
    const length = float16bits.length;

    const array = [];
    for(let i = 0; i < length; ++i) {
        array.push(convertToNumber(float16bits[i]));
    }

    return array;
}

/** @type {ProxyHandler<Function>} */
const applyHandler = {
    apply(func, thisArg, args) {
        // peel off proxy
        if (isFloat16Array(thisArg)) {
            return Reflect.apply(func, _(thisArg).target, args);
        }

        return Reflect.apply(func, thisArg, args);
    },
};

/** @type {ProxyHandler<Float16Array>} */
const handler = {
    get(target, key) {
        if (isCanonicalIntegerIndexString(key)) {
            return Reflect.has(target, key) ? convertToNumber(Reflect.get(target, key)) : undefined;
        } else {
            const ret = Reflect.get(target, key);

            if (!isDefaultFloat16ArrayMethods(ret)) {
                return ret;
            }

            // TypedArray methods can't be called by Proxy Object
            let proxy = _(ret).proxy;

            if (proxy === undefined) {
                proxy = _(ret).proxy = new Proxy(ret, applyHandler);
            }

            return proxy;
        }
    },

    set(target, key, value) {
        if (isCanonicalIntegerIndexString(key)) {
            return Reflect.set(target, key, roundToFloat16Bits(value));
        } else {
            return Reflect.set(target, key, value);
        }
    },
};

export default class Float16Array extends Uint16Array {

    /**
     * @see https://tc39.es/ecma262/#sec-typedarray
     */
    constructor(input, byteOffset, length) {
        // input Float16Array
        if (isFloat16Array(input)) {
            super(_(input).target);

        // TypedArray, Array, ArrayLike, Iterable
        } else if (isObject(input)) {
            // TypedArray
            if (isTypedArray(input)) {
                const { buffer, length } = input;

                /** @type {ArrayBufferConstructor} */
                const BufferConstructor = !isSharedArrayBuffer(buffer) ? SpeciesConstructor(buffer, ArrayBuffer) : ArrayBuffer;
                const data = new BufferConstructor(length * 2);
                super(data);

                for (let i = 0, l = length; i < l; ++i) {
                    this[i] = roundToFloat16Bits(input[i]);
                }

            // ArrayBuffer
            } else if (isArrayBuffer(input)) {
                super(input, byteOffset, length);

            // Iterable
            } else if (isIterable(input)) {
                const list = [...input];
                const length = list.length;
                super(length);

                for(let i = 0; i < length; ++i) {
                    // super (Uint16Array)
                    this[i] = roundToFloat16Bits(list[i]);
                }

            // ArrayLike
            } else {
                const length = LengthOfArrayLike(input);
                super(length);

                for(let i = 0; i < length; ++i) {
                    // super (Uint16Array)
                    this[i] = roundToFloat16Bits(input[i]);
                }
            }

        // primitive
        } else {
            switch(arguments.length) {
                case 0:
                    super();
                    break;

                case 1:
                    super(input);
                    break;

                case 2:
                    super(input, byteOffset);
                    break;

                case 3:
                    super(input, byteOffset, length);
                    break;

                default:
                    super(...arguments);
            }
        }

        const proxy = new Proxy(this, handler);

        // proxy private storage
        _(proxy).target = this;

        // this private storage
        _(this).proxy = proxy;

        return proxy;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.from
     */
    static from(src, ...opts) {
        if (opts.length === 0) {
            return new Float16Array(Uint16Array.from(src, roundToFloat16Bits).buffer);
        }

        const mapFunc = opts[0];
        const thisArg = opts[1];

        return new Float16Array(Uint16Array.from(src, function (val, ...args) {
            return roundToFloat16Bits(mapFunc.call(this, val, ...args));
        }, thisArg).buffer);
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.of
     */
    static of(...items) {
        const length = items.length;

        const proxy = new Float16Array(length);
        const float16bits = _(proxy).target;

        for(let i = 0; i < length; ++i) {
            float16bits[i] = roundToFloat16Bits(items[i]);
        }

        return proxy;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
     * @todo It should be same function of `%TypedArray%#values`
     */
    [Symbol.iterator]() {
        const arrayIterator = super[Symbol.iterator]();
        return wrapInArrayIterator((function* () {
            for(const val of arrayIterator) {
                yield convertToNumber(val);
            }
        })());
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
     */
    keys() {
        assertFloat16Array(this);

        return super.keys();
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
     * @todo It should return a object whose prototype is `%ArrayIteratorPrototype%`
     */
    values() {
        assertFloat16Array(this);

        const arrayIterator = super.values();
        return wrapInArrayIterator((function* () {
            for(const val of arrayIterator) {
                yield convertToNumber(val);
            }
        })());
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
     * @todo It should return a object whose prototype is `%ArrayIteratorPrototype%`
     */
    entries() {
        assertFloat16Array(this);

        const arrayIterator = super.entries();
        return wrapInArrayIterator((function* () {
            for(const [i, val] of arrayIterator) {
                yield [i, convertToNumber(val)];
            }
        })());
    }

    /**
     * @see https://tc39.es/proposal-relative-indexing-method/#sec-%typedarray%.prototype.at
     */
    at(index) {
        assertFloat16Array(this);

        const length = this.length;
        const relativeIndex = ToIntegerOrInfinity(index);
        const k = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;

        if (k < 0 || k >= length) {
            return;
        }

        return convertToNumber(this[k]);
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
     */
    map(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        const length = this.length;

        const Constructor = SpeciesConstructor(this, Float16Array);
        const proxy = new Constructor(length);
        assertFloat16Array(proxy);

        const float16bits = _(proxy).target;

        for(let i = 0; i < length; ++i) {
            const val = convertToNumber(this[i]);
            float16bits[i] = roundToFloat16Bits(callback.call(thisArg, val, i, _(this).proxy));
        }

        return proxy;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
     */
    filter(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        const array = [];
        for(let i = 0, l = this.length; i < l; ++i) {
            const val = convertToNumber(this[i]);
            if (callback.call(thisArg, val, i, _(this).proxy)) {
                array.push(val);
            }
        }

        const Constructor = SpeciesConstructor(this, Float16Array);
        const proxy = new Constructor(array);
        assertFloat16Array(proxy);

        return proxy;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
     */
    reduce(callback, ...opts) {
        assertFloat16Array(this);

        const length = this.length;
        if (length === 0 && opts.length === 0) {
            throw TypeError("Reduce of empty array with no initial value");
        }

        let accumulator, start;
        if (opts.length === 0) {
            accumulator = convertToNumber(this[0]);
            start = 1;
        } else {
            accumulator = opts[0];
            start = 0;
        }

        for(let i = start; i < length; ++i) {
            accumulator = callback(accumulator, convertToNumber(this[i]), i, _(this).proxy);
        }

        return accumulator;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
     */
    reduceRight(callback, ...opts) {
        assertFloat16Array(this);

        const length = this.length;
        if (length === 0 && opts.length === 0) {
            throw TypeError("Reduce of empty array with no initial value");
        }

        let accumulator, start;
        if (opts.length === 0) {
            accumulator = convertToNumber(this[length - 1]);
            start = length - 2;
        } else {
            accumulator = opts[0];
            start = length - 1;
        }

        for(let i = start; i >= 0; --i) {
            accumulator = callback(accumulator, convertToNumber(this[i]), i, _(this).proxy);
        }

        return accumulator;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
     */
    forEach(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy);
        }
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
     */
    find(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            const value = convertToNumber(this[i]);
            if (callback.call(thisArg, value, i, _(this).proxy)) {
                return value;
            }
        }
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
     */
    findIndex(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            const value = convertToNumber(this[i]);
            if (callback.call(thisArg, value, i, _(this).proxy)) {
                return i;
            }
        }

        return -1;
    }

    /**
     * @see https://tc39.es/proposal-array-find-from-last/index.html#sec-%typedarray%.prototype.findlast
     */
    findLast(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = this.length - 1; i >= 0; --i) {
            const value = convertToNumber(this[i]);
            if (callback.call(thisArg, value, i, _(this).proxy)) {
                return value;
            }
        }
    }

    /**
     * @see https://tc39.es/proposal-array-find-from-last/index.html#sec-%typedarray%.prototype.findlastindex
     */
    findLastIndex(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = this.length - 1; i >= 0; --i) {
            const value = convertToNumber(this[i]);
            if (callback.call(thisArg, value, i, _(this).proxy)) {
                return i;
            }
        }

        return -1;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
     */
    every(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            if (!callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
     */
    some(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            if (callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
     */
    set(input, ...opts) {
        assertFloat16Array(this);

        const offset = opts[0];

        let float16bits;

        // input Float16Array
        if (isFloat16Array(input)) {
            float16bits = _(input).target;

        // input others
        } else {
            const arrayLike = !Reflect.has(input, "length") && input[Symbol.iterator] !== undefined ? [...input] : input;
            const length = arrayLike.length;

            float16bits = new Uint16Array(length);
            for(let i = 0, l = arrayLike.length; i < l; ++i) {
                float16bits[i] = roundToFloat16Bits(arrayLike[i]);
            }
        }

        super.set(float16bits, offset);
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
     */
    reverse() {
        assertFloat16Array(this);

        super.reverse();

        return _(this).proxy;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
     */
    fill(value, ...opts) {
        assertFloat16Array(this);

        super.fill(roundToFloat16Bits(value), ...opts);

        return _(this).proxy;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
     */
    copyWithin(target, start, ...opts) {
        assertFloat16Array(this);

        super.copyWithin(target, start, ...opts);

        return _(this).proxy;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
     */
    sort(...opts) {
        assertFloat16Array(this);

        let compareFunction = opts[0];

        if (compareFunction === undefined) {
            compareFunction = defaultCompareFunction;
        }

        const _convertToNumber = memoize(convertToNumber);

        super.sort((x, y) => { return compareFunction(_convertToNumber(x), _convertToNumber(y)); });

        return _(this).proxy;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
     * @todo It is required to give a TypedArray length as a SpeciesConstructor's argument
     */
    slice(...opts) {
        assertFloat16Array(this);

        const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
        const float16bits = uint16.slice(...opts);

        const Constructor = SpeciesConstructor(this, Float16Array);

        const proxy = new Constructor(float16bits.buffer);
        assertFloat16Array(proxy);

        return proxy;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
     */
    subarray(...opts) {
        assertFloat16Array(this);

        const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
        const float16bits = uint16.subarray(...opts);

        const Constructor = SpeciesConstructor(this, Float16Array);
        const proxy = new Constructor(float16bits.buffer, float16bits.byteOffset, float16bits.length);
        assertFloat16Array(proxy);

        return proxy;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
     */
    indexOf(element, ...opts) {
        assertFloat16Array(this);

        const length = this.length;

        let from = ToIntegerOrInfinity(opts[0]);
        if (from === Infinity) {
            return -1;
        }

        if (from < 0) {
            from += length;
            if (from < 0) {
                from = 0;
            }
        }

        for(let i = from, l = length; i < l; ++i) {
            if (Object.prototype.hasOwnProperty.call(this, i) && convertToNumber(this[i]) === element) {
                return i;
            }
        }

        return -1;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
     */
    lastIndexOf(element, ...opts) {
        assertFloat16Array(this);

        const length = this.length;

        let from = opts.length >= 1 ? ToIntegerOrInfinity(opts[0]) : length - 1;
        if (from === -Infinity) {
            return -1;
        }

        if (from >= 0) {
            from = from < length - 1 ? from : length - 1;
        } else {
            from += length;
        }

        for(let i = from; i >= 0; --i) {
            if (Object.prototype.hasOwnProperty.call(this, i) && convertToNumber(this[i]) === element) {
                return i;
            }
        }

        return -1;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
     */
    includes(element, ...opts) {
        assertFloat16Array(this);

        const length = this.length;

        let from = ToIntegerOrInfinity(opts[0]);
        if (from === Infinity) {
            return false;
        }

        if (from < 0) {
            from += length;
            if (from < 0) {
                from = 0;
            }
        }

        const isNaN = Number.isNaN(element);
        for(let i = from, l = length; i < l; ++i) {
            const value = convertToNumber(this[i]);

            if (isNaN && Number.isNaN(value)) {
                return true;
            }

            if (value === element) {
                return true;
            }
        }

        return false;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
     */
    join(...opts) {
        assertFloat16Array(this);

        const array = copyToArray(this);

        return array.join(...opts);
    }

    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
     */
    toLocaleString(...opts) {
        assertFloat16Array(this);

        const array = copyToArray(this);

        return array.toLocaleString(...opts);
    }

    /**
     * @see https://tc39.es/ecma262/#sec-get-%typedarray%.prototype-@@tostringtag
     */
    get [Symbol.toStringTag]() {
        if (isFloat16Array(this)) {
            return "Float16Array";
        }
    }
}

const Float16ArrayPrototype = Float16Array.prototype;

const defaultFloat16ArrayMethods = new WeakSet();
for(const key of Reflect.ownKeys(Float16ArrayPrototype)) {
    const val = Float16ArrayPrototype[key];
    if (typeof val === "function") {
        defaultFloat16ArrayMethods.add(val);
    }
}
