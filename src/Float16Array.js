"use strict";

import { ToInteger } from "./spec";
import { isNumberKey, isArrayBuffer, isArrayLike, isPlusZero } from "./is";
import { createPrivateStorage } from "./private";

import { roundToFloat16Bits, convertNumber } from "./lib";


const _ = createPrivateStorage();

const stringTag = "Float16Array";


function isFloat16Array(target) {
    return target instanceof Float16Array;
}

function assertFloat16Array(target) {
    if(!isFloat16Array(target)) {
        throw new TypeError("This is not a Float16Array");
    }
}

function defaultCompareFunction(x, y) {
    const [isNaN_x, isNaN_y] = [Number.isNaN(x), Number.isNaN(y)];

    if(isNaN_x && isNaN_y)
        return 0;

    if(isNaN_x)
        return 1;

    if(isNaN_y)
        return -1;

    if(x < y)
        return -1;

    if(x > y)
        return 1;
    
    if(x === 0 && y === 0) {
        const [isPlusZero_x, isPlusZero_y] = [isPlusZero(x), isPlusZero(y)];

        if(!isPlusZero_x && isPlusZero_y)
            return -1;
        
        if(isPlusZero_x && isPlusZero_y)
            return 1;
    }

    return 0;
}

function copyToArray(float16bits) {
    const length = float16bits.length;

    const array = new Array(length);
    for(let i = 0; i < length; ++i) {
        array[i] = convertNumber(float16bits[i]);
    }

    return array;
}

// proxy handler
const handler = {
    get(target, key) {
        if(isNumberKey(key)) {
            return convertNumber( Reflect.get(target, key) );
        } else {
            const ret = Reflect.get(target, key);

            if(typeof ret !== "function")
                return ret;
            
            // TypedArray methods can't be called by Proxy
            _(ret).proxy = _(ret).proxy || new Proxy(ret, {
                apply(func, thisArg, args) {
                    if(!isFloat16Array(thisArg))
                        return Reflect.apply(func, thisArg, args);

                    // peel off proxy
                    return Reflect.apply(func, _(thisArg).target, args);
                }
            });

            return _(ret).proxy;
        }
    },

    set(target, key, value) {
        if(isNumberKey(key)) {
            Reflect.set(target, key, roundToFloat16Bits(value));
        } else {
            Reflect.set(target, key, value);
        }
    }
}


export default class Float16Array extends Uint16Array {

    constructor(input, offset, length) {

        // input Float16Array
        if(isFloat16Array(input)) {
            super(_(input).target);

        // 22.2.1.3, 22.2.1.4 TypedArray, Array, ArrayLike, Iterable
        } else if(input !== null && typeof input === "object" && !isArrayBuffer(input)) {
            // if input is Iterable, get Array
            const array = isArrayLike(input) ? input : [...input];
            
            const length = array.length;
            super(length);

            for(let i = 0; i < length; ++i) {
                // super (Uint16Array)
                this[i] = roundToFloat16Bits( array[i] );
            }

        // 22.2.1.2, 22.2.1.5 primitive, ArrayBuffer
        } else {
            super(input, offset, length);
        }
        
        const proxy = new Proxy(this, handler);

        // proxy private storage
        _(proxy).target = this;

        // this private storage
        _(this).proxy = proxy;

        return proxy;
    }

    // static methods
    static from(src, ...opts) {
        if(opts.length === 0)
            return new Float16Array( Uint16Array.from(src, roundToFloat16Bits).buffer );

        const mapFunc = opts[0];
        const thisArg = opts[1];

        return new Float16Array( Uint16Array.from(src, function(val, ...args) {
            return roundToFloat16Bits( mapFunc.call(this, val, ...args) );
        }, thisArg).buffer );
    }

    static of(...args) {
        return new this(args);
    }

    // iterate methods
    * [Symbol.iterator]() {
        for(const val of super[Symbol.iterator]()) {
            yield convertNumber(val);
        }
    }

    // keys

    * values() {
        for(const val of super.values()) {
            yield convertNumber(val);
        }
    }

    * entries() {
        for(const [i, val] of super.entries()) {
            yield [i, convertNumber(val)];
        }
    }

    // functional methods
    map(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        const array = [];
        for(let i = 0, l = this.length; i < l; ++i) {
            const val = convertNumber(this[i]);
            array.push( callback.call(thisArg, val, i, _(this).proxy) );
        }

        return new Float16Array(array);
    }

    filter(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        const array = [];
        for(let i = 0, l = this.length; i < l; ++i) {
            const val = convertNumber(this[i]);

            if( callback.call(thisArg, val, i, _(this).proxy) )
                array.push(val);
        }

        return new Float16Array(array);
    }

    reduce(callback, ...opts) {
        assertFloat16Array(this);

        let val, start;

        if(opts.length === 0) {
            val = convertNumber(this[0]);
            start = 1;
        } else {
            val = opts[0];
            start = 0;
        }

        for(let i = start, l = this.length; i < l; ++i) {
            val = callback(val, convertNumber(this[i]), i, _(this).proxy);
        }

        return val;
    }

    reduceRight(callback, ...opts) {
        assertFloat16Array(this);

        let val, start;

        const length = this.length;
        if(opts.length === 0) {
            val = convertNumber(this[length - 1]);
            start = length - 1;
        } else {
            val = opts[0];
            start = length;
        }

        for(let i = start; i--; ) {
            val = callback(val, convertNumber(this[i]), i, _(this).proxy);
        }

        return val;
    }

    forEach(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            callback.call(thisArg, convertNumber(this[i]), i, _(this).proxy);
        }
    }

    find(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            const value = convertNumber(this[i]);
            if( callback.call(thisArg, value, i, _(this).proxy) ) return value;
        }
    }

    findIndex(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            const value = convertNumber(this[i]);
            if( callback.call(thisArg, value, i, _(this).proxy) ) return i;
        }

        return -1;
    }

    every(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            if( !callback.call(thisArg, convertNumber(this[i]), i, _(this).proxy) ) return false;
        }

        return true;
    }

    some(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];
        
        for(let i = 0, l = this.length; i < l; ++i) {
            if( callback.call(thisArg, convertNumber(this[i]), i, _(this).proxy) ) return true;
        }

        return false;
    }

    // change element methods
    set(input, offset = 0) {
        assertFloat16Array(this);

        let float16bits;

        // input Float16Array
        if(isFloat16Array(input)) {
            float16bits = _(input).target;
        
        // input others
        } else {
            const array = isArrayLike(input) ? input : [...input];
            const length = array.length;

            float16bits = new Uint16Array(length);
            for(let i = 0, l = array.length; i < l; ++i) {
                float16bits[i] = roundToFloat16Bits(array[i]);
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

        super.sort((x, y) => compareFunction(convertNumber(x), convertNumber(y)));
        
        return _(this).proxy;
    }

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
            if(convertNumber(this[i]) === element)
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

        for(let i = from; i--; ) {
            if(convertNumber(this[i]) === element)
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
            const value = convertNumber(this[i]);

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

    toString() {
        const array = copyToArray(this);

        return array.toString();
    }

    get [Symbol.toStringTag]() {
        return stringTag;
    }

}