import { ToInteger, defaultCompareFunction } from "./spec";
import { isStringNumberKey, isArrayBuffer } from "./is";
import { createPrivateStorage } from "./private";

import memoize from "lodash-es/memoize";

import { roundToFloat16Bits, convertToNumber } from "./lib";

import { isTypedArrayIndexedPropertyWritable } from "./bug";


const _ = createPrivateStorage();


function isFloat16Array(target) {
    return target instanceof Float16Array;
}

function assertFloat16Array(target) {
    if(!isFloat16Array(target)) {
        throw new TypeError("This is not a Float16Array");
    }
}

function isDefaultFloat16ArrayMethods(target) {
    return typeof target === "function" && defaultFloat16ArrayMethods.has(target);
}


function copyToArray(float16bits) {
    const length = float16bits.length;

    const array = new Array(length);
    for(let i = 0; i < length; ++i) {
        array[i] = convertToNumber(float16bits[i]);
    }

    return array;
}

// proxy handler
const applyHandler = {
    apply(func, thisArg, args) {
        // peel off proxy
        if(isFloat16Array(thisArg) && isDefaultFloat16ArrayMethods(func))
            return Reflect.apply(func, _(thisArg).target ,args);

        return Reflect.apply(func, thisArg, args);
    }
};

const handler = {
    get(target, key) {
        let wrapper = null;
        if(!isTypedArrayIndexedPropertyWritable) {
            wrapper = target;
            target = _(wrapper).target;
        }

        if(isStringNumberKey(key)) {
            return Reflect.has(target, key) ? convertToNumber(Reflect.get(target, key)) : undefined;

        } else {
            const ret = wrapper !== null && Reflect.has(wrapper, key) ? Reflect.get(wrapper, key) : Reflect.get(target, key);

            if(typeof ret !== "function")
                return ret;

            // TypedArray methods can't be called by Proxy Object
            let proxy = _(ret).proxy;

            if(proxy === undefined) {
                proxy = _(ret).proxy = new Proxy(ret, applyHandler);
            }

            return proxy;
        }
    },

    set(target, key, value) {
        let wrapper = null;
        if(!isTypedArrayIndexedPropertyWritable) {
            wrapper = target;
            target = _(wrapper).target;
        }

        if(isStringNumberKey(key)) {
            return Reflect.set(target, key, roundToFloat16Bits(value));

        } else {
            // frozen object can't change prototype property
            if(wrapper !== null && (!Reflect.has(target, key) || Object.isFrozen(wrapper))) {
                return Reflect.set(wrapper, key, value);

            } else {
                return Reflect.set(target, key, value);
            }
        }
    }
};

if(!isTypedArrayIndexedPropertyWritable) {
    handler.getPrototypeOf = wrapper => Reflect.getPrototypeOf(_(wrapper).target);
    handler.setPrototypeOf = (wrapper, prototype) => Reflect.setPrototypeOf(_(wrapper).target, prototype);

    handler.defineProperty = (wrapper, key, descriptor) => {
        const target = _(wrapper).target;
        return !Reflect.has(target, key) || Object.isFrozen(wrapper) ? Reflect.defineProperty(wrapper, key, descriptor) : Reflect.defineProperty(target, key, descriptor);
    };
    handler.deleteProperty = (wrapper, key) => {
        const target = _(wrapper).target;
        return Reflect.has(wrapper, key) ? Reflect.deleteProperty(wrapper, key) : Reflect.deleteProperty(target, key);
    };

    handler.has = (wrapper, key) => Reflect.has(wrapper, key) || Reflect.has(_(wrapper).target, key);

    handler.isExtensible = wrapper => Reflect.isExtensible(wrapper);
    handler.preventExtensions = wrapper => Reflect.preventExtensions(wrapper);

    handler.getOwnPropertyDescriptor = (wrapper, key) => Reflect.getOwnPropertyDescriptor(wrapper, key);
    handler.ownKeys = wrapper => Reflect.ownKeys(wrapper);
}


export default class Float16Array extends Uint16Array {

    constructor(input, byteOffset, length) {

        // input Float16Array
        if(isFloat16Array(input)) {
            super(_(input).target);

        // 22.2.1.3, 22.2.1.4 TypedArray, Array, ArrayLike, Iterable
        } else if(input !== null && typeof input === "object" && !isArrayBuffer(input)) {
            // if input is not ArrayLike and Iterable, get Array
            const arrayLike = !Reflect.has(input, "length") && input[Symbol.iterator] !== undefined ? [...input] : input;

            const length = arrayLike.length;
            super(length);

            for(let i = 0; i < length; ++i) {
                // super (Uint16Array)
                this[i] = roundToFloat16Bits(arrayLike[i]);
            }

        // 22.2.1.2, 22.2.1.5 primitive, ArrayBuffer
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

        let proxy;

        if(isTypedArrayIndexedPropertyWritable) {
            proxy = new Proxy(this, handler);
        } else {
            const wrapper = Object.create(null);
            _(wrapper).target = this;
            proxy = new Proxy(wrapper, handler);
        }

        // proxy private storage
        _(proxy).target = this;

        // this private storage
        _(this).proxy = proxy;

        return proxy;
    }

    // static methods
    static from(src, ...opts) {
        if(opts.length === 0)
            return new Float16Array(Uint16Array.from(src, roundToFloat16Bits).buffer);

        const mapFunc = opts[0];
        const thisArg = opts[1];

        return new Float16Array(Uint16Array.from(src, function(val, ...args) {
            return roundToFloat16Bits(mapFunc.call(this, val, ...args));
        }, thisArg).buffer);
    }

    static of(...args) {
        return new Float16Array(args);
    }

    // iterate methods
    * [Symbol.iterator]() {
        for(const val of super[Symbol.iterator]()) {
            yield convertToNumber(val);
        }
    }

    keys() {
        return super.keys();
    }

    * values() {
        for(const val of super.values()) {
            yield convertToNumber(val);
        }
    }

    * entries() {
        for(const [i, val] of super.entries()) {
            yield [i, convertToNumber(val)];
        }
    }

    // functional methods
    map(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        const array = [];
        for(let i = 0, l = this.length; i < l; ++i) {
            const val = convertToNumber(this[i]);
            array.push(callback.call(thisArg, val, i, _(this).proxy));
        }

        return new Float16Array(array);
    }

    filter(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        const array = [];
        for(let i = 0, l = this.length; i < l; ++i) {
            const val = convertToNumber(this[i]);
            if(callback.call(thisArg, val, i, _(this).proxy)) {
                array.push(val);
            }
        }

        return new Float16Array(array);
    }

    reduce(callback, ...opts) {
        assertFloat16Array(this);

        let val, start;

        if(opts.length === 0) {
            val = convertToNumber(this[0]);
            start = 1;
        } else {
            val = opts[0];
            start = 0;
        }

        for(let i = start, l = this.length; i < l; ++i) {
            val = callback(val, convertToNumber(this[i]), i, _(this).proxy);
        }

        return val;
    }

    reduceRight(callback, ...opts) {
        assertFloat16Array(this);

        let val, start;

        const length = this.length;
        if(opts.length === 0) {
            val = convertToNumber(this[length - 1]);
            start = length - 1;
        } else {
            val = opts[0];
            start = length;
        }

        for(let i = start; i--;) {
            val = callback(val, convertToNumber(this[i]), i, _(this).proxy);
        }

        return val;
    }

    forEach(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy);
        }
    }

    find(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            const value = convertToNumber(this[i]);
            if(callback.call(thisArg, value, i, _(this).proxy)) return value;
        }
    }

    findIndex(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            const value = convertToNumber(this[i]);
            if(callback.call(thisArg, value, i, _(this).proxy)) return i;
        }

        return -1;
    }

    every(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            if(!callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy)) return false;
        }

        return true;
    }

    some(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            if(callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy)) return true;
        }

        return false;
    }

    // change element methods
    set(input, ...opts) {
        assertFloat16Array(this);

        const offset = opts[0];

        let float16bits;

        // input Float16Array
        if(isFloat16Array(input)) {
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

    reverse() {
        assertFloat16Array(this);

        super.reverse();

        return _(this).proxy;
    }

    fill(value, ...opts) {
        assertFloat16Array(this);

        super.fill(roundToFloat16Bits(value), ...opts);

        return _(this).proxy;
    }

    copyWithin(target, start, ...opts) {
        assertFloat16Array(this);

        super.copyWithin(target, start, ...opts);

        return _(this).proxy;
    }

    sort(...opts) {
        assertFloat16Array(this);

        let compareFunction = opts[0];

        if(compareFunction === undefined) {
            compareFunction = defaultCompareFunction;
        }

        const _convertToNumber = memoize(convertToNumber);

        super.sort((x, y) => compareFunction(_convertToNumber(x), _convertToNumber(y)));

        return _(this).proxy;
    }

    // copy element methods
    slice(...opts) {
        assertFloat16Array(this);

        let float16bits;

        // V8, SpiderMonkey, JavaScriptCore, Chakra throw TypeError
        try {
            float16bits = super.slice(...opts);
        } catch(e) {
            if(e instanceof TypeError) {
                const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
                float16bits = uint16.slice(...opts);
            } else {
                throw e;
            }
        }

        return new Float16Array(float16bits.buffer);
    }

    subarray(...opts) {
        assertFloat16Array(this);

        let float16bits;

        // V8, SpiderMonkey, JavaScriptCore, Chakra throw TypeError
        try {
            float16bits = super.subarray(...opts);
        } catch(e) {
            if(e instanceof TypeError) {
                const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
                float16bits = uint16.subarray(...opts);
            } else {
                throw e;
            }
        }

        return new Float16Array(float16bits.buffer, float16bits.byteOffset, float16bits.length);
    }

    // contains methods
    indexOf(element, ...opts) {
        assertFloat16Array(this);

        const length = this.length;

        let from = ToInteger(opts[0]);

        if(from < 0) {
            from += length;
            if(from < 0)
                from = 0;
        }

        for(let i = from, l = length; i < l; ++i) {
            if(convertToNumber(this[i]) === element)
                return i;
        }

        return -1;
    }

    lastIndexOf(element, ...opts) {
        assertFloat16Array(this);

        const length = this.length;

        let from = ToInteger(opts[0]);

        from = from === 0 ? length : from + 1;

        if(from >= 0) {
            from = from < length ? from : length;
        } else {
            from += length;
        }

        for(let i = from; i--;) {
            if(convertToNumber(this[i]) === element)
                return i;
        }

        return -1;
    }

    includes(element, ...opts) {
        assertFloat16Array(this);

        const length = this.length;

        let from = ToInteger(opts[0]);

        if(from < 0) {
            from += length;
            if(from < 0)
                from = 0;
        }

        const isNaN = Number.isNaN(element);
        for(let i = from, l = length; i < l; ++i) {
            const value = convertToNumber(this[i]);

            if(isNaN && Number.isNaN(value))
                return true;

            if(value === element)
                return true;
        }

        return false;
    }

    // string methods
    join(...opts) {
        assertFloat16Array(this);

        const array = copyToArray(this);

        return array.join(...opts);
    }

    toLocaleString(...opts) {
        assertFloat16Array(this);

        const array = copyToArray(this);

        return array.toLocaleString(...opts);
    }

    get [Symbol.toStringTag]() {
        if(isFloat16Array(this))
            return "Float16Array";
    }
}

const Float16Array$prototype = Float16Array.prototype;

const defaultFloat16ArrayMethods = new WeakSet();
for(const key of Reflect.ownKeys(Float16Array$prototype)) {
    const val = Float16Array$prototype[key];
    if(typeof val === "function")
        defaultFloat16ArrayMethods.add(val);
}
