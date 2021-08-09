/**
 * @petamoriken/float16 v3.2.3-20-g0f4d063 | MIT License - https://git.io/float16
 *
 * @license
 * lodash-es v4.17.21 | MIT License - https://lodash.com/custom-builds
 */

var float16 = (function (exports) {
    'use strict';

    // algorithm: ftp://ftp.fox-toolkit.org/pub/fasthalffloatconversion.pdf
    const buffer = new ArrayBuffer(4);
    const floatView = new Float32Array(buffer);
    const uint32View = new Uint32Array(buffer);
    const baseTable = new Uint32Array(512);
    const shiftTable = new Uint32Array(512);

    for (let i = 0; i < 256; ++i) {
      const e = i - 127; // very small number (0, -0)

      if (e < -27) {
        baseTable[i] = 0x0000;
        baseTable[i | 0x100] = 0x8000;
        shiftTable[i] = 24;
        shiftTable[i | 0x100] = 24; // small number (denorm)
      } else if (e < -14) {
        baseTable[i] = 0x0400 >> -e - 14;
        baseTable[i | 0x100] = 0x0400 >> -e - 14 | 0x8000;
        shiftTable[i] = -e - 1;
        shiftTable[i | 0x100] = -e - 1; // normal number
      } else if (e <= 15) {
        baseTable[i] = e + 15 << 10;
        baseTable[i | 0x100] = e + 15 << 10 | 0x8000;
        shiftTable[i] = 13;
        shiftTable[i | 0x100] = 13; // large number (Infinity, -Infinity)
      } else if (e < 128) {
        baseTable[i] = 0x7c00;
        baseTable[i | 0x100] = 0xfc00;
        shiftTable[i] = 24;
        shiftTable[i | 0x100] = 24; // stay (NaN, Infinity, -Infinity)
      } else {
        baseTable[i] = 0x7c00;
        baseTable[i | 0x100] = 0xfc00;
        shiftTable[i] = 13;
        shiftTable[i | 0x100] = 13;
      }
    }
    /**
     * round a number to a half float number bits.
     * @param {number} num - double float
     * @returns {number} half float number bits
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
     * @param {number} float16bits - half float number bits
     * @returns {number} double float
     */


    function convertToNumber(float16bits) {
      const m = float16bits >> 10;
      uint32View[0] = mantissaTable[offsetTable[m] + (float16bits & 0x3ff)] + exponentTable[m];
      return floatView[0];
    }

    /**
     * returns the nearest half precision float representation of a number.
     * @param {number} num
     * @returns {number}
     */

    function hfround(num) {
      num = Number(num); // for optimization

      if (!Number.isFinite(num) || num === 0) {
        return num;
      }

      const x16 = roundToFloat16Bits(num);
      return convertToNumber(x16);
    }

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
    var freeGlobal$1 = freeGlobal;

    /** Detect free variable `self`. */

    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
    /** Used as a reference to the global object. */

    var root = freeGlobal$1 || freeSelf || Function('return this')();
    var root$1 = root;

    /** Built-in value references. */

    var Symbol$1 = root$1.Symbol;
    var Symbol$2 = Symbol$1;

    /** Used for built-in method references. */

    var objectProto$4 = Object.prototype;
    /** Used to check objects for own properties. */

    var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */

    var nativeObjectToString$1 = objectProto$4.toString;
    /** Built-in value references. */

    var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;
    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */

    function getRawTag(value) {
      var isOwn = hasOwnProperty$3.call(value, symToStringTag$1),
          tag = value[symToStringTag$1];

      try {
        value[symToStringTag$1] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString$1.call(value);

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
    var objectProto$3 = Object.prototype;
    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */

    var nativeObjectToString = objectProto$3.toString;
    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */

    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /** `Object#toString` result references. */

    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';
    /** Built-in value references. */

    var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : undefined;
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

    var asyncTag = '[object AsyncFunction]',
        funcTag$1 = '[object Function]',
        genTag = '[object GeneratorFunction]',
        proxyTag = '[object Proxy]';
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
      } // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.


      var tag = baseGetTag(value);
      return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /** Used to detect overreaching core-js shims. */

    var coreJsData = root$1['__core-js_shared__'];
    var coreJsData$1 = coreJsData;

    /** Used to detect methods masquerading as native. */

    var maskSrcKey = function () {
      var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || '');
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

    var funcProto = Function.prototype,
        objectProto$2 = Object.prototype;
    /** Used to resolve the decompiled source of functions. */

    var funcToString = funcProto.toString;
    /** Used to check objects for own properties. */

    var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
    /** Used to detect if a method is native. */

    var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
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
    var nativeCreate$1 = nativeCreate;

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */

    function hashClear() {
      this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
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

    var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';
    /** Used for built-in method references. */

    var objectProto$1 = Object.prototype;
    /** Used to check objects for own properties. */

    var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
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

      if (nativeCreate$1) {
        var result = data[key];
        return result === HASH_UNDEFINED$1 ? undefined : result;
      }

      return hasOwnProperty$1.call(data, key) ? data[key] : undefined;
    }

    /** Used for built-in method references. */

    var objectProto = Object.prototype;
    /** Used to check objects for own properties. */

    var hasOwnProperty = objectProto.hasOwnProperty;
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
      return nativeCreate$1 ? data[key] !== undefined : hasOwnProperty.call(data, key);
    }

    /** Used to stand-in for `undefined` hash values. */

    var HASH_UNDEFINED = '__lodash_hash_undefined__';
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
      data[key] = nativeCreate$1 && value === undefined ? HASH_UNDEFINED : value;
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
    } // Add methods to `Hash`.


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
    } // Add methods to `ListCache`.


    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /* Built-in method references that are verified to be native. */

    var Map = getNative(root$1, 'Map');
    var Map$1 = Map;

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
        'map': new (Map$1 || ListCache)(),
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
    } // Add methods to `MapCache`.


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

      var memoized = function () {
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
    } // Expose `MapCache`.


    memoize.Cache = MapCache;

    /**
     * @returns {(self:object) => object}
     */
    function createPrivateStorage() {
      const wm = new WeakMap();
      return self => {
        const storage = wm.get(self);

        if (storage !== undefined) {
          return storage;
        }

        const obj = Object.create(null);
        wm.set(self, obj);
        return obj;
      };
    }

    const _$1 = createPrivateStorage();

    const IteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));
    const ArrayIteratorPrototype = Object.create(IteratorPrototype, {
      next: {
        value: function next() {
          return _$1(this).iterator.next();
        },
        writable: true,
        configurable: true
      },
      [Symbol.toStringTag]: {
        value: "Array Iterator",
        configurable: true
      }
    });
    /**
     * @param {Iterator<number>} iterator
     * @returns {IterableIterator<number>}
     */

    function wrapInArrayIterator(iterator) {
      const arrayIterator = Object.create(ArrayIteratorPrototype);
      _$1(arrayIterator).iterator = iterator;
      return arrayIterator;
    }

    /**
     * @param {unknown} target
     * @returns {number}
     */

    function ToIntegerOrInfinity(target) {
      const number = Number(target);

      if (Number.isNaN(number) || number === 0) {
        return 0;
      }

      if (number === Infinity) {
        return Infinity;
      }

      if (number === -Infinity) {
        return -Infinity;
      }

      return Math.trunc(number);
    }
    /**
     * @param {unknown} target
     * @returns {number}
     */

    function ToLength(target) {
      const length = ToIntegerOrInfinity(target);

      if (length < 0) {
        return 0;
      }

      return length < Number.MAX_SAFE_INTEGER ? length : Number.MAX_SAFE_INTEGER;
    }
    /**
     * @param {object} arrayLike
     * @returns {number}
     */


    function LengthOfArrayLike(arrayLike) {
      if (!isObject(arrayLike)) {
        throw TypeError("this is not a object");
      }

      return ToLength(arrayLike.length);
    }
    /**
     * @param {object} target
     * @param {Function} defaultConstructor
     * @returns {Function}
     */

    function SpeciesConstructor(target, defaultConstructor) {
      if (!isObject(target)) {
        throw TypeError("this is not a object");
      }

      const constructor = target.constructor;

      if (constructor === undefined) {
        return defaultConstructor;
      }

      if (!isObject(constructor)) {
        throw TypeError("constructor is not a object");
      }

      const species = constructor[Symbol.species];

      if (species == null) {
        return defaultConstructor;
      }

      return species;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @returns {-1 | 0 | 1}
     */

    function defaultCompareFunction(x, y) {
      const [isNaN_x, isNaN_y] = [Number.isNaN(x), Number.isNaN(y)];

      if (isNaN_x && isNaN_y) {
        return 0;
      }

      if (isNaN_x) {
        return 1;
      }

      if (isNaN_y) {
        return -1;
      }

      if (x < y) {
        return -1;
      }

      if (x > y) {
        return 1;
      }

      if (x === 0 && y === 0) {
        const [isPlusZero_x, isPlusZero_y] = [Object.is(x, 0), Object.is(y, 0)];

        if (!isPlusZero_x && isPlusZero_y) {
          return -1;
        }

        if (isPlusZero_x && !isPlusZero_y) {
          return 1;
        }
      }

      return 0;
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

    var arrayBufferTag$1 = '[object ArrayBuffer]';
    /**
     * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     */

    function baseIsArrayBuffer(value) {
      return isObjectLike(value) && baseGetTag(value) == arrayBufferTag$1;
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

    var freeProcess = moduleExports && freeGlobal$1.process;
    /** Used to access faster Node.js helpers. */

    var nodeUtil = function () {
      try {
        // Use `util.types` for Node.js 10+.
        var types = freeModule && freeModule.require && freeModule.require('util').types;

        if (types) {
          return types;
        } // Legacy `process.binding('util')` for Node.js < 10.


        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }();

    var nodeUtil$1 = nodeUtil;

    /* Node.js helper references. */

    var nodeIsArrayBuffer = nodeUtil$1 && nodeUtil$1.isArrayBuffer;
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
    var isArrayBuffer$1 = isArrayBuffer;

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

    /** `Object#toString` result references. */

    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        funcTag = '[object Function]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        objectTag = '[object Object]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        weakMapTag = '[object WeakMap]';
    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';
    /** Used to identify `toStringTag` values of typed arrays. */

    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */

    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /* Node.js helper references. */

    var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;
    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */

    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    var isTypedArray$1 = isTypedArray;

    /**
     * @param {unknown} value
     * @returns {boolean}
     */

    function isDataView(value) {
      return ArrayBuffer.isView(value) && Object.prototype.toString.call(value) === "[object DataView]";
    }
    /**
     * @param {unknown} value
     * @returns {boolean}
     */

    function isSharedArrayBuffer(value) {
      return Object.prototype.toString.call(value) === "[object SharedArrayBuffer]";
    }
    /**
     * @param {unknown} value
     * @returns {boolean}
     */

    function isIterable(value) {
      return isObject(value) && typeof value[Symbol.iterator] === "function";
    }
    /**
     * @param {unknown} key
     * @returns {boolean}
     */

    function isCanonicalIntegerIndexString(key) {
      return typeof key === "string" && key === ToIntegerOrInfinity(key) + "";
    }

    const _ = createPrivateStorage();
    /**
     * @param {unknown} target
     * @returns {boolean}
     */


    function isFloat16ArrayProxy(target) {
      return target instanceof Float16Array && _(target).target !== undefined;
    }
    /**
     * @param {unknown} target
     * @returns {boolean}
     */


    function isFloat16ArrayBits(target) {
      return target instanceof Float16Array && _(target).proxy !== undefined;
    }
    /**
     * @param {unknown} target
     * @throws {TypeError}
     */


    function assertFloat16ArrayBits(target) {
      if (!isFloat16ArrayBits(target)) {
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

      for (let i = 0; i < length; ++i) {
        array.push(convertToNumber(float16bits[i]));
      }

      return array;
    }
    /** @type {ProxyHandler<Function>} */


    const applyHandler = {
      apply(func, thisArg, args) {
        // peel off proxy
        if (isFloat16ArrayProxy(thisArg)) {
          return Reflect.apply(func, _(thisArg).target, args);
        }

        return Reflect.apply(func, thisArg, args);
      }

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
          } // TypedArray methods can't be called by Proxy Object


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
      }

    };
    class Float16Array extends Uint16Array {
      /**
       * @see https://tc39.es/ecma262/#sec-typedarray
       */
      constructor(input, byteOffset, length) {
        // input Float16Array
        if (isFloat16ArrayProxy(input)) {
          super(_(input).target); // object without ArrayBuffer
        } else if (isObject(input) && !isArrayBuffer$1(input)) {
          let list;
          let length; // TypedArray

          if (isTypedArray$1(input)) {
            const buffer = input.buffer;
            list = input;
            length = input.length;
            /** @type {ArrayBufferConstructor} */

            const BufferConstructor = !isSharedArrayBuffer(buffer) ? SpeciesConstructor(buffer, ArrayBuffer) : ArrayBuffer;
            const data = new BufferConstructor(length * 2);
            super(data); // Iterable (Array)
          } else if (isIterable(input)) {
            list = [...input];
            length = list.length;
            super(length); // ArrayLike
          } else {
            list = input;
            length = LengthOfArrayLike(input);
            super(length);
          } // set values


          for (let i = 0; i < length; ++i) {
            // super (Uint16Array)
            this[i] = roundToFloat16Bits(list[i]);
          } // primitive, ArrayBuffer

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

            case 3:
              super(input, byteOffset, length);
              break;

            default:
              super(...arguments);
          }
        }

        const proxy = new Proxy(this, handler); // proxy private storage

        _(proxy).target = this; // this private storage

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

        for (let i = 0; i < length; ++i) {
          float16bits[i] = roundToFloat16Bits(items[i]);
        }

        return proxy;
      }
      /**
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
       */


      keys() {
        assertFloat16ArrayBits(this);
        return super.keys();
      }
      /**
       * limitation: returns a object whose prototype is not `%ArrayIteratorPrototype%`
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
       */


      values() {
        assertFloat16ArrayBits(this);
        const arrayIterator = super.values();
        return wrapInArrayIterator(function* () {
          for (const val of arrayIterator) {
            yield convertToNumber(val);
          }
        }());
      }
      /**
       * limitation: returns a object whose prototype is not `%ArrayIteratorPrototype%`
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
       */


      entries() {
        assertFloat16ArrayBits(this);
        const arrayIterator = super.entries();
        return wrapInArrayIterator(function* () {
          for (const [i, val] of arrayIterator) {
            yield [i, convertToNumber(val)];
          }
        }());
      }
      /**
       * @see https://tc39.es/proposal-relative-indexing-method/#sec-%typedarray%.prototype.at
       */


      at(index) {
        assertFloat16ArrayBits(this);
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
        assertFloat16ArrayBits(this);
        const thisArg = opts[0];
        const length = this.length;
        const Constructor = SpeciesConstructor(this, Float16Array); // for optimization

        if (Constructor === Float16Array) {
          const proxy = new Float16Array(length);

          const float16bits = _(proxy).target;

          for (let i = 0; i < length; ++i) {
            const val = convertToNumber(this[i]);
            float16bits[i] = roundToFloat16Bits(callback.call(thisArg, val, i, _(this).proxy));
          }

          return proxy;
        }

        const array = new Constructor(length);

        for (let i = 0; i < length; ++i) {
          const val = convertToNumber(this[i]);
          array[i] = callback.call(thisArg, val, i, _(this).proxy);
        }

        return array;
      }
      /**
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
       */


      filter(callback, ...opts) {
        assertFloat16ArrayBits(this);
        const thisArg = opts[0];
        const kept = [];

        for (let i = 0, l = this.length; i < l; ++i) {
          const val = convertToNumber(this[i]);

          if (callback.call(thisArg, val, i, _(this).proxy)) {
            kept.push(val);
          }
        }

        const Constructor = SpeciesConstructor(this, Float16Array);
        const array = new Constructor(kept);
        return array;
      }
      /**
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
       */


      reduce(callback, ...opts) {
        assertFloat16ArrayBits(this);
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

        for (let i = start; i < length; ++i) {
          accumulator = callback(accumulator, convertToNumber(this[i]), i, _(this).proxy);
        }

        return accumulator;
      }
      /**
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
       */


      reduceRight(callback, ...opts) {
        assertFloat16ArrayBits(this);
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

        for (let i = start; i >= 0; --i) {
          accumulator = callback(accumulator, convertToNumber(this[i]), i, _(this).proxy);
        }

        return accumulator;
      }
      /**
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
       */


      forEach(callback, ...opts) {
        assertFloat16ArrayBits(this);
        const thisArg = opts[0];

        for (let i = 0, l = this.length; i < l; ++i) {
          callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy);
        }
      }
      /**
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
       */


      find(callback, ...opts) {
        assertFloat16ArrayBits(this);
        const thisArg = opts[0];

        for (let i = 0, l = this.length; i < l; ++i) {
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
        assertFloat16ArrayBits(this);
        const thisArg = opts[0];

        for (let i = 0, l = this.length; i < l; ++i) {
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
        assertFloat16ArrayBits(this);
        const thisArg = opts[0];

        for (let i = this.length - 1; i >= 0; --i) {
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
        assertFloat16ArrayBits(this);
        const thisArg = opts[0];

        for (let i = this.length - 1; i >= 0; --i) {
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
        assertFloat16ArrayBits(this);
        const thisArg = opts[0];

        for (let i = 0, l = this.length; i < l; ++i) {
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
        assertFloat16ArrayBits(this);
        const thisArg = opts[0];

        for (let i = 0, l = this.length; i < l; ++i) {
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
        assertFloat16ArrayBits(this);
        const offset = ToIntegerOrInfinity(opts[0]);

        if (offset < 0) {
          throw RangeError("offset is out of bounds");
        }

        let float16bits; // input Float16Array

        if (isFloat16ArrayProxy(input)) {
          float16bits = _(input).target; // input others
        } else {
          const length = LengthOfArrayLike(input);
          float16bits = new Uint16Array(length);

          for (let i = 0; i < length; ++i) {
            float16bits[i] = roundToFloat16Bits(input[i]);
          }
        }

        super.set(float16bits, offset);
      }
      /**
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
       */


      reverse() {
        assertFloat16ArrayBits(this);
        super.reverse();
        return _(this).proxy;
      }
      /**
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
       */


      fill(value, ...opts) {
        assertFloat16ArrayBits(this);
        super.fill(roundToFloat16Bits(value), ...opts);
        return _(this).proxy;
      }
      /**
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
       */


      copyWithin(target, start, ...opts) {
        assertFloat16ArrayBits(this);
        super.copyWithin(target, start, ...opts);
        return _(this).proxy;
      }
      /**
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
       */


      sort(...opts) {
        assertFloat16ArrayBits(this);
        const compareFunction = opts[0] !== undefined ? opts[0] : defaultCompareFunction;

        const _convertToNumber = memoize(convertToNumber);

        super.sort((x, y) => {
          return compareFunction(_convertToNumber(x), _convertToNumber(y));
        });
        return _(this).proxy;
      }
      /**
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
       */


      slice(...opts) {
        assertFloat16ArrayBits(this);
        const Constructor = SpeciesConstructor(this, Float16Array); // for optimization

        if (Constructor === Float16Array) {
          const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
          const float16bits = uint16.slice(...opts);
          const proxy = new Float16Array(float16bits.buffer);
          return proxy;
        }

        const length = this.length;
        const start = ToIntegerOrInfinity(opts[0]);
        const end = opts[1] === undefined ? length : ToIntegerOrInfinity(opts[1]);
        let k;

        if (start === -Infinity) {
          k = 0;
        } else if (start < 0) {
          k = length + start > 0 ? length + start : 0;
        } else {
          k = length < start ? length : start;
        }

        let final;

        if (end === -Infinity) {
          final = 0;
        } else if (end < 0) {
          final = length + end > 0 ? length + end : 0;
        } else {
          final = length < end ? length : end;
        }

        const count = final - k > 0 ? final - k : 0;
        const array = new Constructor(count);

        if (count <= 0) {
          return array;
        }

        let n = 0;

        while (k < final) {
          array[n] = convertToNumber(this[k]);
          ++k;
          ++n;
        }

        return array;
      }
      /**
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
       */


      subarray(...opts) {
        assertFloat16ArrayBits(this);
        const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
        const float16bits = uint16.subarray(...opts);
        const Constructor = SpeciesConstructor(this, Float16Array);
        const array = new Constructor(float16bits.buffer, float16bits.byteOffset, float16bits.length);
        return array;
      }
      /**
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
       */


      indexOf(element, ...opts) {
        assertFloat16ArrayBits(this);
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

        for (let i = from, l = length; i < l; ++i) {
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
        assertFloat16ArrayBits(this);
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

        for (let i = from; i >= 0; --i) {
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
        assertFloat16ArrayBits(this);
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

        for (let i = from, l = length; i < l; ++i) {
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
        assertFloat16ArrayBits(this);
        const array = copyToArray(this);
        return array.join(...opts);
      }
      /**
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
       */


      toLocaleString(...opts) {
        assertFloat16ArrayBits(this);
        const array = copyToArray(this);
        return array.toLocaleString(...opts);
      }
      /**
       * @see https://tc39.es/ecma262/#sec-get-%typedarray%.prototype-@@tostringtag
       */


      get [Symbol.toStringTag]() {
        if (isFloat16ArrayBits(this)) {
          return "Float16Array";
        }
      }

    }
    const Float16ArrayPrototype = Float16Array.prototype;
    /**
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
     */

    Object.defineProperty(Float16ArrayPrototype, Symbol.iterator, {
      value: Float16ArrayPrototype.values,
      writable: true,
      configurable: true
    });
    const defaultFloat16ArrayMethods = new WeakSet();

    for (const key of Reflect.ownKeys(Float16ArrayPrototype)) {
      const val = Float16ArrayPrototype[key];

      if (typeof val === "function") {
        defaultFloat16ArrayMethods.add(val);
      }
    }

    /**
     * returns an unsigned 16-bit float at the specified byte offset from the start of the DataView.
     * @param {DataView} dataView
     * @param {number} byteOffset
     * @param {[boolean]} opts
     * @returns {number}
     */

    function getFloat16(dataView, byteOffset, ...opts) {
      if (!isDataView(dataView)) {
        throw new TypeError("First argument to getFloat16 function must be a DataView");
      }

      return convertToNumber(dataView.getUint16(byteOffset, ...opts));
    }
    /**
     * stores an unsigned 16-bit float value at the specified byte offset from the start of the DataView.
     * @param {DataView} dataView
     * @param {number} byteOffset
     * @param {number} value
     * @param {[boolean]} opts
     */

    function setFloat16(dataView, byteOffset, value, ...opts) {
      if (!isDataView(dataView)) {
        throw new TypeError("First argument to setFloat16 function must be a DataView");
      }

      dataView.setUint16(byteOffset, roundToFloat16Bits(value), ...opts);
    }

    exports.Float16Array = Float16Array;
    exports.getFloat16 = getFloat16;
    exports.hfround = hfround;
    exports.setFloat16 = setFloat16;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
