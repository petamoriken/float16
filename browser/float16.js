/**
 * @petamoriken/float16 1.0.3 - https://github.com/petamoriken/float16
 * generated at 2017-06-27 00:32 +09:00
 *
 * ---
 * lodash-es 4.17.4
 */

(function (exports) {
'use strict';

// algorithm: ftp://ftp.fox-toolkit.org/pub/fasthalffloatconversion.pdf

const buffer = new ArrayBuffer(4);
const floatView = new Float32Array(buffer);
const uint32View = new Uint32Array(buffer);

const baseTable = new Uint32Array(512);
const shiftTable = new Uint32Array(512);

for (let i = 0; i < 256; ++i) {
    const e = i - 127;

    // very small number (0, -0)
    if (e < -27) {
        baseTable[i | 0x000] = 0x0000;
        baseTable[i | 0x100] = 0x8000;
        shiftTable[i | 0x000] = 24;
        shiftTable[i | 0x100] = 24;

        // small number (denorm)
    } else if (e < -14) {
        baseTable[i | 0x000] = 0x0400 >> -e - 14;
        baseTable[i | 0x100] = 0x0400 >> -e - 14 | 0x8000;
        shiftTable[i | 0x000] = -e - 1;
        shiftTable[i | 0x100] = -e - 1;

        // normal number
    } else if (e <= 15) {
        baseTable[i | 0x000] = e + 15 << 10;
        baseTable[i | 0x100] = e + 15 << 10 | 0x8000;
        shiftTable[i | 0x000] = 13;
        shiftTable[i | 0x100] = 13;

        // large number (Infinity, -Infinity)
    } else if (e < 128) {
        baseTable[i | 0x000] = 0x7c00;
        baseTable[i | 0x100] = 0xfc00;
        shiftTable[i | 0x000] = 24;
        shiftTable[i | 0x100] = 24;

        // stay (NaN, Infinity, -Infinity)        
    } else {
        baseTable[i | 0x000] = 0x7c00;
        baseTable[i | 0x100] = 0xfc00;
        shiftTable[i | 0x000] = 13;
        shiftTable[i | 0x100] = 13;
    }
}

/**
 * round a number to a half float number bits.
 * @param {number} num
 */
function roundToFloat16Bits(num) {
    floatView[0] = num;

    const f = uint32View[0];
    const e = f >> 23 & 0x1ff;
    return baseTable[e] + ((f & 0x007fffff) >> shiftTable[e]);
}

const mantissaTable = new Uint32Array(2048);
const exponentTable = new Uint32Array(64);
const offsetTable = new Uint32Array(64);

// mantissa
mantissaTable[0] = 0;
for (let i = 1; i < 1024; ++i) {
    let m = i << 13; // zero pad mantissa bits
    let e = 0; // zero exponent

    // normalized
    while ((m & 0x00800000) === 0) {
        e -= 0x00800000; // decrement exponent
        m <<= 1;
    }

    m &= ~0x00800000; // clear leading 1 bit
    e += 0x38800000; // adjust bias

    mantissaTable[i] = m | e;
}
for (let i = 1024; i < 2048; ++i) {
    mantissaTable[i] = 0x38000000 + (i - 1024 << 13);
}

// exponent
exponentTable[0] = 0;
for (let i = 1; i < 31; ++i) {
    exponentTable[i] = i << 23;
}
exponentTable[31] = 0x47800000;
exponentTable[32] = 0x80000000;
for (let i = 33; i < 63; ++i) {
    exponentTable[i] = 0x80000000 + (i - 32 << 23);
}
exponentTable[63] = 0xc7800000;

// offset
offsetTable[0] = 0;
for (let i = 1; i < 64; ++i) {
    if (i === 32) {
        offsetTable[i] = 0;
    } else {
        offsetTable[i] = 1024;
    }
}

/**
 * convert a half float number bits to a number.
 * @param {number} h - half float number bits
 */
function convertNumber(h) {
    const m = h >> 10;
    uint32View[0] = mantissaTable[offsetTable[m] + (h & 0x3ff)] + exponentTable[m];
    return floatView[0];
}

/**
 * returns the nearest half precision float representation of a number.
 * @param {number} num 
 */
function hfround(num) {
    num = Number(num);

    // for optimization
    if (!Number.isFinite(num) || num === 0) {
        return num;
    }

    const x16 = roundToFloat16Bits(num);
    return convertNumber(x16);
}

function ToInteger(num) {
    if (typeof num !== "number") num = Number(num);
    if (Number.isNaN(num)) num = 0;
    return Math.trunc(num);
}

function isPlusZero(val) {
    return val === 0 && 1 / val === Infinity;
}

function defaultCompareFunction(x, y) {
    var _ref = [Number.isNaN(x), Number.isNaN(y)];
    const isNaN_x = _ref[0],
          isNaN_y = _ref[1];


    if (isNaN_x && isNaN_y) return 0;

    if (isNaN_x) return 1;

    if (isNaN_y) return -1;

    if (x < y) return -1;

    if (x > y) return 1;

    if (x === 0 && y === 0) {
        var _ref2 = [isPlusZero(x), isPlusZero(y)];
        const isPlusZero_x = _ref2[0],
              isPlusZero_y = _ref2[1];


        if (!isPlusZero_x && isPlusZero_y) return -1;

        if (isPlusZero_x && !isPlusZero_y) return 1;
    }

    return 0;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var arrayBufferTag = '[object ArrayBuffer]';

/**
 * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
 */
function baseIsArrayBuffer(value) {
  return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = function () {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();

/* Node.js helper references. */
var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer;

/**
 * Checks if `value` is classified as an `ArrayBuffer` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
 * @example
 *
 * _.isArrayBuffer(new ArrayBuffer(2));
 * // => true
 *
 * _.isArrayBuffer(new Array(2));
 * // => false
 */
var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

function isDataView(view) {
    return view instanceof DataView;
}

function isNumberKey(key) {
    return typeof key === "string" && key === ToInteger(key) + "";
}

function createPrivateStorage() {
	const wm = new WeakMap();
	return self => {
		let obj = wm.get(self);
		if (obj) {
			return obj;
		} else {
			obj = Object.create(null);
			wm.set(self, obj);
			return obj;
		}
	};
}

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty$3.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED$1 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map || ListCache)(),
    'string': new Hash()
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function memoized() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

// JavaScriptCore bug: https://bugs.webkit.org/show_bug.cgi?id=171606
const isTypedArrayIndexedPropertyWritable = Object.getOwnPropertyDescriptor(new Uint8Array(1), 0).writable;

// Chakra (Edge <= 14) bug: https://github.com/Microsoft/ChakraCore/issues/1662
const proxy = new Proxy({}, {});
const isProxyAbleToBeWeakMapKey = new WeakMap().set(proxy, 1).get(proxy) === 1;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

const _ = createPrivateStorage();

const __target__ = Symbol("target");

function isFloat16Array(target) {
    return target instanceof Float16Array;
}

function assertFloat16Array(target) {
    if (!isFloat16Array(target)) {
        throw new TypeError("This is not a Float16Array");
    }
}

function isDefaultFloat16ArrayMethods(target) {
    return typeof target === "function" && defaultFloat16ArrayMethods.has(target);
}

function copyToArray(float16bits) {
    const length = float16bits.length;

    const array = new Array(length);
    for (let i = 0; i < length; ++i) {
        array[i] = convertNumber(float16bits[i]);
    }

    return array;
}

// proxy handler
const handler = {
    get(target, key) {
        let wrapper = null;
        if (!isTypedArrayIndexedPropertyWritable) {
            wrapper = target;
            target = _(wrapper).target;
        }

        if (isNumberKey(key)) {
            return convertNumber(Reflect.get(target, key));
        } else {
            const ret = wrapper !== null && Reflect.has(wrapper, key) ? Reflect.get(wrapper, key) : Reflect.get(target, key);

            if (typeof ret !== "function") return ret;

            // TypedArray methods can't be called by Proxy
            let proxy = _(ret).proxy;

            if (proxy === undefined) {
                proxy = _(ret).proxy = new Proxy(ret, {
                    apply(func, thisArg, args) {

                        // peel off proxy                        
                        if (isFloat16Array(thisArg) && isDefaultFloat16ArrayMethods(func)) return Reflect.apply(func, isProxyAbleToBeWeakMapKey ? _(thisArg).target : thisArg[__target__], args);

                        return Reflect.apply(func, thisArg, args);
                    }
                });
            }

            return proxy;
        }
    },

    set(target, key, value) {
        let wrapper = null;
        if (!isTypedArrayIndexedPropertyWritable) {
            wrapper = target;
            target = _(wrapper).target;
        }

        if (isNumberKey(key)) {
            return Reflect.set(target, key, roundToFloat16Bits(value));
        } else {
            // frozen object can't change prototype property
            if (wrapper !== null && (!Reflect.has(target, key) || Object.isFrozen(wrapper))) {
                return Reflect.set(wrapper, key, value);
            } else {
                return Reflect.set(target, key, value);
            }
        }
    }
};

if (!isTypedArrayIndexedPropertyWritable) {
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

class Float16Array extends Uint16Array {

    constructor(input, byteOffset, length) {

        // input Float16Array
        if (isFloat16Array(input)) {
            super(isProxyAbleToBeWeakMapKey ? _(input).target : input[__target__]);

            // 22.2.1.3, 22.2.1.4 TypedArray, Array, ArrayLike, Iterable
        } else if (input !== null && typeof input === "object" && !isArrayBuffer(input)) {
            // if input is Iterable, get Array
            const array = isArrayLike(input) ? input : [...input];

            const length = array.length;
            super(length);

            for (let i = 0; i < length; ++i) {
                // super (Uint16Array)
                this[i] = roundToFloat16Bits(array[i]);
            }

            // 22.2.1.2, 22.2.1.5 primitive, ArrayBuffer
        } else {
            switch (arguments.length) {
                case 0:
                    super();
                    break;

                case 1:
                    super(input);
                    break;

                case 2:
                    super(input, byteOffset);
                    break;

                default:
                    super(input, byteOffset, length);
            }
        }

        let proxy;

        if (isTypedArrayIndexedPropertyWritable) {
            proxy = new Proxy(this, handler);
        } else {
            const wrapper = Object.create(null);
            _(wrapper).target = this;
            proxy = new Proxy(wrapper, handler);
        }

        // proxy private storage
        if (isProxyAbleToBeWeakMapKey) {
            _(proxy).target = this;
        } else {
            this[__target__] = this;
        }

        // this private storage
        _(this).proxy = proxy;

        return proxy;
    }

    // static methods
    static from(src) {
        if ((arguments.length <= 1 ? 0 : arguments.length - 1) === 0) return new Float16Array(Uint16Array.from(src, roundToFloat16Bits).buffer);

        const mapFunc = arguments.length <= 1 ? undefined : arguments[1];
        const thisArg = arguments.length <= 2 ? undefined : arguments[2];

        return new Float16Array(Uint16Array.from(src, function (val) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            return roundToFloat16Bits(mapFunc.call(this, val, ...args));
        }, thisArg).buffer);
    }

    static of() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return new Float16Array(args);
    }

    // iterate methods
    *[Symbol.iterator]() {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = super[Symbol.iterator]()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                const val = _step.value;

                yield convertNumber(val);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    keys() {
        return super.keys();
    }

    *values() {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = super.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                const val = _step2.value;

                yield convertNumber(val);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    }

    *entries() {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = super.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                const _ref = _step3.value;

                var _ref2 = _slicedToArray(_ref, 2);

                const i = _ref2[0];
                const val = _ref2[1];

                yield [i, convertNumber(val)];
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }
    }

    // functional methods
    map(callback) {
        assertFloat16Array(this);

        const thisArg = arguments.length <= 1 ? undefined : arguments[1];

        const array = [];
        for (let i = 0, l = this.length; i < l; ++i) {
            const val = convertNumber(this[i]);
            array.push(callback.call(thisArg, val, i, _(this).proxy));
        }

        return new Float16Array(array);
    }

    filter(callback) {
        assertFloat16Array(this);

        const thisArg = arguments.length <= 1 ? undefined : arguments[1];

        const array = [];
        for (let i = 0, l = this.length; i < l; ++i) {
            const val = convertNumber(this[i]);

            if (callback.call(thisArg, val, i, _(this).proxy)) array.push(val);
        }

        return new Float16Array(array);
    }

    reduce(callback) {
        assertFloat16Array(this);

        let val, start;

        if ((arguments.length <= 1 ? 0 : arguments.length - 1) === 0) {
            val = convertNumber(this[0]);
            start = 1;
        } else {
            val = arguments.length <= 1 ? undefined : arguments[1];
            start = 0;
        }

        for (let i = start, l = this.length; i < l; ++i) {
            val = callback(val, convertNumber(this[i]), i, _(this).proxy);
        }

        return val;
    }

    reduceRight(callback) {
        assertFloat16Array(this);

        let val, start;

        const length = this.length;
        if ((arguments.length <= 1 ? 0 : arguments.length - 1) === 0) {
            val = convertNumber(this[length - 1]);
            start = length - 1;
        } else {
            val = arguments.length <= 1 ? undefined : arguments[1];
            start = length;
        }

        for (let i = start; i--;) {
            val = callback(val, convertNumber(this[i]), i, _(this).proxy);
        }

        return val;
    }

    forEach(callback) {
        assertFloat16Array(this);

        const thisArg = arguments.length <= 1 ? undefined : arguments[1];

        for (let i = 0, l = this.length; i < l; ++i) {
            callback.call(thisArg, convertNumber(this[i]), i, _(this).proxy);
        }
    }

    find(callback) {
        assertFloat16Array(this);

        const thisArg = arguments.length <= 1 ? undefined : arguments[1];

        for (let i = 0, l = this.length; i < l; ++i) {
            const value = convertNumber(this[i]);
            if (callback.call(thisArg, value, i, _(this).proxy)) return value;
        }
    }

    findIndex(callback) {
        assertFloat16Array(this);

        const thisArg = arguments.length <= 1 ? undefined : arguments[1];

        for (let i = 0, l = this.length; i < l; ++i) {
            const value = convertNumber(this[i]);
            if (callback.call(thisArg, value, i, _(this).proxy)) return i;
        }

        return -1;
    }

    every(callback) {
        assertFloat16Array(this);

        const thisArg = arguments.length <= 1 ? undefined : arguments[1];

        for (let i = 0, l = this.length; i < l; ++i) {
            if (!callback.call(thisArg, convertNumber(this[i]), i, _(this).proxy)) return false;
        }

        return true;
    }

    some(callback) {
        assertFloat16Array(this);

        const thisArg = arguments.length <= 1 ? undefined : arguments[1];

        for (let i = 0, l = this.length; i < l; ++i) {
            if (callback.call(thisArg, convertNumber(this[i]), i, _(this).proxy)) return true;
        }

        return false;
    }

    // change element methods
    set(input) {
        assertFloat16Array(this);

        const offset = arguments.length <= 1 ? undefined : arguments[1];

        let float16bits;

        // input Float16Array
        if (isFloat16Array(input)) {
            float16bits = isProxyAbleToBeWeakMapKey ? _(input).target : input[__target__];

            // input others
        } else {
            const array = isArrayLike(input) ? input : [...input];
            const length = array.length;

            float16bits = new Uint16Array(length);
            for (let i = 0, l = array.length; i < l; ++i) {
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

    fill(value) {
        assertFloat16Array(this);

        for (var _len3 = arguments.length, opts = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            opts[_key3 - 1] = arguments[_key3];
        }

        super.fill(roundToFloat16Bits(value), ...opts);

        return _(this).proxy;
    }

    copyWithin(target, start) {
        assertFloat16Array(this);

        for (var _len4 = arguments.length, opts = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
            opts[_key4 - 2] = arguments[_key4];
        }

        super.copyWithin(target, start, ...opts);

        return _(this).proxy;
    }

    sort() {
        assertFloat16Array(this);

        let compareFunction = arguments.length <= 0 ? undefined : arguments[0];

        if (compareFunction === undefined) {
            compareFunction = defaultCompareFunction;
        }

        const _convertNumber = memoize(convertNumber);

        super.sort((x, y) => compareFunction(_convertNumber(x), _convertNumber(y)));

        return _(this).proxy;
    }

    // copy element methods
    slice() {
        assertFloat16Array(this);

        let float16bits;

        // V8, SpiderMonkey, JavaScriptCore throw TypeError
        try {
            float16bits = super.slice(...arguments);
        } catch (e) {
            if (e instanceof TypeError) {
                const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
                float16bits = uint16.slice(...arguments);
            } else {
                throw e;
            }
        }

        return new Float16Array(float16bits.buffer);
    }

    subarray() {
        assertFloat16Array(this);

        let float16bits;

        // SpiderMonkey, JavaScriptCore throw TypeError
        try {
            float16bits = super.subarray(...arguments);
        } catch (e) {
            if (e instanceof TypeError) {
                const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
                float16bits = uint16.subarray(...arguments);
            } else {
                throw e;
            }
        }

        return new Float16Array(float16bits.buffer, float16bits.byteOffset, float16bits.length);
    }

    // contains methods
    indexOf(element) {
        assertFloat16Array(this);

        const length = this.length;

        let from = ToInteger(arguments.length <= 1 ? undefined : arguments[1]);

        if (from < 0) {
            from += length;
            if (from < 0) from = 0;
        }

        for (let i = from, l = length; i < l; ++i) {
            if (convertNumber(this[i]) === element) return i;
        }

        return -1;
    }

    lastIndexOf(element) {
        assertFloat16Array(this);

        const length = this.length;

        let from = ToInteger(arguments.length <= 1 ? undefined : arguments[1]);

        from = from === 0 ? length : from + 1;

        if (from >= 0) {
            from = from < length ? from : length;
        } else {
            from += length;
        }

        for (let i = from; i--;) {
            if (convertNumber(this[i]) === element) return i;
        }

        return -1;
    }

    includes(element) {
        assertFloat16Array(this);

        const length = this.length;

        let from = ToInteger(arguments.length <= 1 ? undefined : arguments[1]);

        if (from < 0) {
            from += length;
            if (from < 0) from = 0;
        }

        const isNaN = Number.isNaN(element);
        for (let i = from, l = length; i < l; ++i) {
            const value = convertNumber(this[i]);

            if (isNaN && Number.isNaN(value)) return true;

            if (value === element) return true;
        }

        return false;
    }

    // string methods
    join() {
        assertFloat16Array(this);

        const array = copyToArray(this);

        return array.join(...arguments);
    }

    toLocaleString() {
        assertFloat16Array(this);

        const array = copyToArray(this);

        return array.toLocaleString(...arguments);
    }

    get [Symbol.toStringTag]() {
        if (isFloat16Array(this)) return "Float16Array";
    }

}

const Float16Array$prototype = Float16Array.prototype;

const defaultFloat16ArrayMethods = new WeakSet();
var _iteratorNormalCompletion4 = true;
var _didIteratorError4 = false;
var _iteratorError4 = undefined;

try {
    for (var _iterator4 = Reflect.ownKeys(Float16Array$prototype)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        const key = _step4.value;

        const val = Float16Array$prototype[key];
        if (typeof val === "function") defaultFloat16ArrayMethods.add(val);
    }
} catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
} finally {
    try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
        }
    } finally {
        if (_didIteratorError4) {
            throw _iteratorError4;
        }
    }
}

/**
 * returns an unsigned 16-bit float at the specified byte offset from the start of the DataView.
 * @param {DataView} dataView 
 * @param {nunmber} byteOffset 
 * @param {*} opts 
 */
function getFloat16(dataView, byteOffset) {
    if (!isDataView(dataView)) throw new TypeError("First argument to getFloat16 function must be a DataView");

    for (var _len = arguments.length, opts = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        opts[_key - 2] = arguments[_key];
    }

    return convertNumber(dataView.getUint16(byteOffset, ...opts));
}

/**
 * stores an unsigned 16-bit float value at the specified byte offset from the start of the DataView.
 * @param {DataView} dataView 
 * @param {number} byteOffset 
 * @param {number} value 
 * @param {*} opts 
 */
function setFloat16(dataView, byteOffset, value) {
    if (!isDataView(dataView)) throw new TypeError("First argument to setFloat16 function must be a DataView");

    for (var _len2 = arguments.length, opts = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        opts[_key2 - 3] = arguments[_key2];
    }

    dataView.setUint16(byteOffset, roundToFloat16Bits(value), ...opts);
}

exports.hfround = hfround;
exports.Float16Array = Float16Array;
exports.getFloat16 = getFloat16;
exports.setFloat16 = setFloat16;

}((this.float16 = this.float16 || {})));
