/* eslint-env mocha, browser, node, es2020 */
/* global assert Float16Array isFloat16Array */

describe("Float16Array", () => {

    let AnotherRealmFloat16Array;

    if (typeof window !== "undefined") {
        const iframe = document.createElement("iframe");
        iframe.height = iframe.width = 0;
        document.body.appendChild(iframe);
        iframe.contentDocument.write('<script src="float16.js"></script>');
        AnotherRealmFloat16Array = iframe.contentWindow.float16.Float16Array;
        iframe.remove();
    }

    before(() => {
        assert.equalFloat16ArrayValues = function (_float16, _array) {
            const float16 = [];
            for (let i = 0, l = _float16.length; i < l; ++i) {
                // old assert.deepStrictEqual (power-assert) cannot compare NaN
                if (typeof window !== "undefined" && Number.isNaN(_float16[i])) {
                    float16[i] = "NaN";
                } else {
                    float16[i] = _float16[i];
                }
            }

            const array = [];
            for (let i = 0, l = _array.length; i < l; ++i) {
                // old assert.deepStrictEqual (power-assert) cannot compare NaN
                if (typeof window !== "undefined" && Number.isNaN(_array[i])) {
                    array[i] = "NaN";
                } else {
                    array[i] = _array[i];
                }
            }

            assert.deepStrictEqual(float16, array);
        };
    });

    after(() => {
        assert.equalFloat16ArrayValues = null;
    });

    it("property `name` is 'Float16Array'", () => {
        assert( Float16Array.name === "Float16Array" );
    });

    it("property `length` is 3", () => {
        assert( Float16Array.length === 3 );
    });

    it("property `BYTES_PER_ELEMENT` is 2", () => {
        assert( Float16Array.BYTES_PER_ELEMENT === 2 );
    });

    it("input empty or primitive", () => {
        assert.doesNotThrow(() => new Float16Array());
        assert.doesNotThrow(() => new Float16Array(0));
        assert.doesNotThrow(() => new Float16Array(4));

        assert.throws(() => new Float16Array(-1), Error);
        assert.throws(() => new Float16Array(Symbol()), TypeError);
    });

    it("input Array or TypedArray", () => {
        const array = [1, 1.1, 1.2, 1.3];
        const checkArray = [1, 1.099609375, 1.19921875, 1.2998046875];

        const float16_1 = new Float16Array(array);

        assert( float16_1.BYTES_PER_ELEMENT === 2 );
        assert( float16_1.byteOffset === 0 );
        assert( float16_1.byteLength === 8 );
        assert( float16_1.length === 4 );
        assert.equalFloat16ArrayValues( float16_1, checkArray );

        const float16_2 = new Float16Array( new Float32Array(array) );

        assert( float16_2.BYTES_PER_ELEMENT === 2 );
        assert( float16_2.byteOffset === 0 );
        assert( float16_2.byteLength === 8 );
        assert( float16_2.length === 4 );
        assert.equalFloat16ArrayValues( float16_2, checkArray );
    });

    it("input TypedArray with CustomArrayBuffer", () => {
        class FooArrayBuffer extends ArrayBuffer {}
        const buffer = new FooArrayBuffer(16);

        const float16 = new Float16Array( new Float32Array(buffer) );

        assert( float16.BYTES_PER_ELEMENT === 2 );
        assert( float16.byteOffset === 0 );
        assert( float16.byteLength === 8 );
        assert( float16.length === 4 );
        assert( float16.buffer instanceof FooArrayBuffer );
        assert( float16.buffer !== buffer );
    });

    it("input TypedArray with CustomSharedArrayBuffer", function () {
        if (typeof SharedArrayBuffer === "undefined") {
            this.skip();
        }

        class FooSharedArrayBuffer extends SharedArrayBuffer {}
        const buffer = new FooSharedArrayBuffer(16);

        const float16 = new Float16Array( new Float32Array(buffer) );

        assert( float16.BYTES_PER_ELEMENT === 2 );
        assert( float16.byteOffset === 0 );
        assert( float16.byteLength === 8 );
        assert( float16.length === 4 );
        assert( !(float16.buffer instanceof FooSharedArrayBuffer) );
        assert( float16.buffer !== buffer );
    });

    it("input Iterable", () => {
        const iterable = [1, 1.1, 1.2, 1.3][Symbol.iterator]();
        const checkArray = [1, 1.099609375, 1.19921875, 1.2998046875];

        const float16 = new Float16Array(iterable);

        assert( float16.BYTES_PER_ELEMENT === 2 );
        assert( float16.byteOffset === 0 );
        assert( float16.byteLength === 8 );
        assert( float16.length === 4 );
        assert.equalFloat16ArrayValues( float16, checkArray );
    });

    it("input ArrayLike", () => {
        const arrayLike = { "0": 1, "1": 1.1, "2": 1.2, "3": 1.3, length: 4 };
        const checkArray = [1, 1.099609375, 1.19921875, 1.2998046875];

        const float16 = new Float16Array(arrayLike);

        assert( float16.BYTES_PER_ELEMENT === 2 );
        assert( float16.byteOffset === 0 );
        assert( float16.byteLength === 8 );
        assert( float16.length === 4 );
        assert.equalFloat16ArrayValues( float16, checkArray );
    });

    it("input Float16Array", () => {
        const array = [1, 1.1, 1.2, 1.3];
        const checkArray = [1, 1.099609375, 1.19921875, 1.2998046875];

        const float16_1 = new Float16Array( new Float16Array(array) );

        assert( float16_1.BYTES_PER_ELEMENT === 2 );
        assert( float16_1.byteOffset === 0 );
        assert( float16_1.byteLength === 8 );
        assert( float16_1.length === 4 );
        assert.equalFloat16ArrayValues( float16_1, checkArray );

        class FooArrayBuffer extends ArrayBuffer {}
        const buffer = new FooArrayBuffer(16);

        const float16_2 = new Float16Array( new Float16Array(buffer) );

        assert( float16_2.BYTES_PER_ELEMENT === 2 );
        assert( float16_2.byteOffset === 0 );
        assert( float16_2.byteLength === 16 );
        assert( float16_2.length === 8 );
        assert( float16_2.buffer instanceof FooArrayBuffer );
        assert( float16_2.buffer !== buffer );
    });

    it("input Float16Array from another realm", function () {
        if (AnotherRealmFloat16Array === undefined) {
            this.skip();
        }

        const array = [1, 1.1, 1.2, 1.3];
        const checkArray = [1, 1.099609375, 1.19921875, 1.2998046875];

        const float16_1 = new Float16Array( new AnotherRealmFloat16Array(array) );

        assert( float16_1.BYTES_PER_ELEMENT === 2 );
        assert( float16_1.byteOffset === 0 );
        assert( float16_1.byteLength === 8 );
        assert( float16_1.length === 4 );
        assert.equalFloat16ArrayValues( float16_1, checkArray );

        class FooArrayBuffer extends ArrayBuffer {}
        const buffer = new FooArrayBuffer(16);

        const float16_2 = new Float16Array( new AnotherRealmFloat16Array(buffer) );

        assert( float16_2.BYTES_PER_ELEMENT === 2 );
        assert( float16_2.byteOffset === 0 );
        assert( float16_2.byteLength === 16 );
        assert( float16_2.length === 8 );
        assert( float16_2.buffer instanceof FooArrayBuffer );
        assert( float16_2.buffer !== buffer );
    });

    it("input ArrayBuffer", () => {
        const buffer = new Uint16Array([15360, 15462, 15564, 15667]).buffer;

        const float16_1 = new Float16Array(buffer);

        assert( float16_1.BYTES_PER_ELEMENT === 2 );
        assert( float16_1.buffer === buffer );
        assert( float16_1.byteOffset === 0 );
        assert( float16_1.byteLength === 8 );
        assert( float16_1.length === 4 );
        assert.equalFloat16ArrayValues( float16_1, [1, 1.099609375, 1.19921875, 1.2998046875] );

        const float16_2 = new Float16Array(buffer, 2, 2);

        assert( float16_2.BYTES_PER_ELEMENT === 2 );
        assert( float16_2.buffer === buffer );
        assert( float16_2.byteOffset === 2 );
        assert( float16_2.byteLength === 4 );
        assert( float16_2.length === 2 );
        assert.equalFloat16ArrayValues( float16_2, [1.099609375, 1.19921875] );
    });

    it("set & get values", () => {
        const float16 = new Float16Array(4);

        float16[0] = 1.337;
        float16[1] = Number.MAX_VALUE;
        float16[2] = Number.MIN_VALUE;
        float16[3] = "aaa";

        assert.equalFloat16ArrayValues( float16, [1.3369140625, Infinity, 0, NaN] );

        float16.foo = "foo";
        assert( float16.foo === "foo" );

        // not integer
        float16[0.5] = 1.337;
        assert( float16[0.5] === undefined );

        // out of range
        float16[10] = 1.337;
        assert( float16[10] === undefined );
    });

    it("iterate", () => {
        const checkArray = [1, 1.099609375, 1.19921875, 1.2998046875];

        const float16 = new Float16Array([1, 1.1, 1.2, 1.3]);
        for (const val of float16) {
            assert( val === checkArray.shift() );
        }
    });

    it("return undefined when access out of range number key", () => {
        const float16 = new Float16Array(4);
        float16[10] = 42;

        assert(float16[10] === undefined);
    });

    it("can't be frozen with elements", () => {
        assert.doesNotThrow(() => Object.freeze( new Float16Array() ));
        assert.throws(() => Object.freeze( new Float16Array(10) ), TypeError);
    });

    it("can't change property & prototype property if it frozen", function () {
        const float16 = new Float16Array();

        float16.hoge = "hoge";
        assert( float16.hoge === "hoge" );

        Object.freeze( float16 );

        float16.fuga = "fuga";
        assert( float16.fuga === undefined );

        float16.map = "map";
        assert( typeof float16.map === "function" );
    });

    it("check ownKeys", () => {
        const float16 = new Float16Array([1, 2]);
        assert.deepStrictEqual( Reflect.ownKeys(float16), ["0", "1"] );
    });

    it("append custom methods (not using `super`)", () => {
        const float16 = new Float16Array([1, 2, 3]);

        float16.sum = function () {
            let ret = 0;
            for (let i = 0, l = this.length; i < l; ++i) {
                ret += this[i];
            }
            return ret;
        };

        assert( float16.sum() === 6 );
    });

    it("prototype methods are as same as themselves", () => {
        const float16 = new Float16Array();
        assert( float16.map === float16.map );
    });

    describe(".from()", () => {

        it("property `name` is 'from'", () => {
            assert( Float16Array.from.name === "from" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.from.length === 1 );
        });

        it("input Array or TypedArray", () => {
            const array = [1, 1.1, 1.2, 1.3];
            const checkArray = [1, 1.099609375, 1.19921875, 1.2998046875];

            const float16_1 = Float16Array.from(array);

            assert( float16_1 instanceof Float16Array );
            assert.equalFloat16ArrayValues( float16_1, checkArray );

            const float16_2 = Float16Array.from( new Float32Array(array) );

            assert( float16_2 instanceof Float16Array );
            assert.equalFloat16ArrayValues( float16_2, checkArray );
        });

        it("input Iterable", () => {
            const iterable = [1, 1.1, 1.2, 1.3][Symbol.iterator]();
            const checkArray = [1, 1.099609375, 1.19921875, 1.2998046875];

            const float16 = Float16Array.from(iterable);

            assert( float16 instanceof Float16Array );
            assert.equalFloat16ArrayValues( float16, checkArray );
        });

        it("input ArrayLike", () => {
            const arrayLike = { 0: 1, 1: 1.1, 2: 1.2, 3: 1.3, length: 4 };
            const checkArray = [1, 1.099609375, 1.19921875, 1.2998046875];

            const float16 = Float16Array.from(arrayLike);

            assert( float16 instanceof Float16Array );
            assert.equalFloat16ArrayValues( float16, checkArray );
        });

        it("input Float16Array", () => {
            const array = [1, 1.1, 1.2, 1.3];
            const checkArray = [1, 1.099609375, 1.19921875, 1.2998046875];

            const float16 = Float16Array.from( new Float16Array(array) );

            assert( float16 instanceof Float16Array );
            assert.equalFloat16ArrayValues( float16, checkArray );
        });

        it("check mapFn callback arguments", () => {
            const thisArg = {};
            const checkArray = [2];

            const float16 = Float16Array.from([1], function (val, key) {

                assert( val === 1 );
                assert( key === 0 );
                assert( this === thisArg );

                return 2;

            }, thisArg);

            assert( float16 instanceof Float16Array );
            assert.equalFloat16ArrayValues( float16, checkArray );
        });

    });

    describe(".of()", () => {

        it("property `name` is 'of'", () => {
            assert( Float16Array.of.name === "of" );
        });

        it("property `length` is 0", () => {
            assert( Float16Array.of.length === 0 );
        });

        it("input arguments", () => {
            const array = [1, 1.1, 1.2, 1.3];
            const checkArray = [1, 1.099609375, 1.19921875, 1.2998046875];

            const float16 = Float16Array.of(...array);

            assert( float16 instanceof Float16Array );
            assert.equalFloat16ArrayValues( float16, checkArray );
        });

    });

    describe("get #[ @@toStringTag ]", () => {

        it("return 'Float16Array' when access by instance", () => {
            const float16 = new Float16Array();
            assert( float16[Symbol.toStringTag] === "Float16Array" );
        });

        it("return undefined when access by prototype", () => {
            assert( Float16Array.prototype[Symbol.toStringTag] === undefined );
        });

    });

    describe("#keys()", () => {

        it("property `name` is 'keys'", () => {
            assert( Float16Array.prototype.keys.name === "keys" );
        });

        it("property `length` is 0", () => {
            assert( Float16Array.prototype.keys.length === 0 );
        });

        it("get keys", () => {
            const float16 = new Float16Array([1, 2, 3]);
            const array = [...float16.keys()];

            assert.deepStrictEqual( array, [0, 1, 2] );
        });

        it("suspend to iterate keys", () => {
            const float16 = new Float16Array([1, 2, 3]);
            const iterator = float16.keys();

            for (const key of iterator) {
                if (key === 1) {
                    break;
                }
            }

            assert.deepStrictEqual( iterator.next(), { value: 2, done: false } );
            assert.deepStrictEqual( iterator.next(), { value: undefined, done: true } );
        });

    });

    describe("#values()", () => {

        it("property `name` is 'values'", () => {
            assert( Float16Array.prototype.values.name === "values" );
        });

        it("property `length` is 0", () => {
            assert( Float16Array.prototype.values.length === 0 );
        });

        it("get values", () => {
            const float16 = new Float16Array([1, 2, 3]);
            const array = [...float16.values()];

            assert.deepStrictEqual( array, [1, 2, 3] );
        });

        it("suspend to iterate values", () => {
            const float16 = new Float16Array([1, 2, 3]);
            const iterator = float16.values();

            for (const value of iterator) {
                if (value === 2) {
                    break;
                }
            }

            assert.deepStrictEqual( iterator.next(), { value: 3, done: false } );
            assert.deepStrictEqual( iterator.next(), { value: undefined, done: true } );
        });

    });

    describe("#entries()", () => {

        it("property `name` is 'entries'", () => {
            assert( Float16Array.prototype.entries.name === "entries" );
        });

        it("property `length` is 0", () => {
            assert( Float16Array.prototype.entries.length === 0 );
        });

        it("get entries", () => {
            const float16 = new Float16Array([1, 2, 3]);
            const array = [...float16.entries()];

            assert.deepStrictEqual( array, [[0, 1], [1, 2], [2, 3]] );
        });

        it("suspend to iterate entries", () => {
            const float16 = new Float16Array([1, 2, 3]);
            const iterator = float16.entries();

            // eslint-disable-next-line no-unused-vars
            for (const [_, value] of iterator) {
                if (value === 2) {
                    break;
                }
            }

            assert.deepStrictEqual( iterator.next(), { value: [2, 3], done: false } );
            assert.deepStrictEqual( iterator.next(), { value: undefined, done: true } );
        });

    });

    describe("#at()", () => {

        it("property `name` is 'at'", () => {
            assert( Float16Array.prototype.at.name === "at" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.at.length === 1 );
        });

        it("get values", () => {
            const float16 = new Float16Array([1, 2, 3]);

            assert( float16.at(0) === 1 );
            assert( float16.at(-1) === 3 );
            assert( float16.at(4) === undefined );
        });

    });

    describe("#map()", () => {

        it("property `name` is 'map'", () => {
            assert( Float16Array.prototype.map.name === "map" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.map.length === 1 );
        });

        it("check callback arguments", () => {
            const float16 = new Float16Array([1]);
            const thisArg = {};

            float16.map(function (val, key, f16) {

                assert( val === 1 );
                assert( key === 0 );
                assert( f16 === float16 );
                assert( this === thisArg );

            }, thisArg);
        });

        it("get x2", () => {
            const float16_1 = new Float16Array([1, 2, 3, 4]);
            const float16_2 = float16_1.map((val) => val * 2);

            assert( float16_2 instanceof Float16Array );
            assert.equalFloat16ArrayValues( float16_2, [2, 4, 6, 8] );
        });

        it("respect @@species", () => {
            let step = 0;
            class Foo extends Float16Array {
                constructor(...args) {
                    super(...args);
                    if (step === 0) {
                        assert( args.length === 1 );
                        assert.deepStrictEqual( args[0], [1, 2, 3, 4] );
                        ++step;
                    } else {
                        assert.deepStrictEqual( args, [4] );
                    }
                }
            }
            const foo = new Foo([1, 2, 3, 4]).map((val) => val);
            assert( foo instanceof Foo );
            assert.equalFloat16ArrayValues( foo, [1, 2, 3, 4] );

            class Bar extends Float16Array {
                static get [Symbol.species]() { return Float16Array; }
            }
            const bar = new Bar([1, 2, 3, 4]).map((val) => val);
            assert( !(bar instanceof Bar) );
            assert( bar instanceof Float16Array );
            assert.equalFloat16ArrayValues( bar, [1, 2, 3, 4] );
        });

    });

    describe("#filter()", () => {

        it("property `name` is 'filter'", () => {
            assert( Float16Array.prototype.filter.name === "filter" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.filter.length === 1 );
        });

        it("check callback arguments", () => {
            const float16 = new Float16Array([1]);
            const thisArg = {};

            float16.filter(function (val, key, f16) {

                assert( val === 1 );
                assert( key === 0 );
                assert( f16 === float16 );
                assert( this === thisArg );

            }, thisArg);
        });

        it("filter even value", () => {
            const float16_1 = new Float16Array([1, 2, 3, 4]);
            const float16_2 = float16_1.filter((val) => val % 2 === 0);

            assert( float16_2 instanceof Float16Array );
            assert.equalFloat16ArrayValues( float16_2, [2, 4] );
        });

        it("respect @@species", () => {
            let step = 0;
            class Foo extends Float16Array {
                constructor(...args) {
                    super(...args);
                    if (step === 0) {
                        assert( args.length === 1 );
                        assert.deepStrictEqual( args[0], [1, 2, 3, 4] );
                        ++step;
                    } else {
                        assert( args.length === 1 );
                        assert.deepStrictEqual( args[0], [1, 2, 3, 4] );
                    }
                }
            }
            const foo = new Foo([1, 2, 3, 4]).filter(() => true);
            assert( foo instanceof Foo );
            assert.equalFloat16ArrayValues( foo, [1, 2, 3, 4] );

            class Bar extends Float16Array {
                static get [Symbol.species]() { return Float16Array; }
            }
            const bar = new Bar([1, 2, 3, 4]).filter(() => true);
            assert( !(bar instanceof Bar) );
            assert( bar instanceof Float16Array );
            assert.equalFloat16ArrayValues( bar, [1, 2, 3, 4] );
        });

    });

    describe("#reduce()", () => {

        it("property `name` is 'reduce'", () => {
            assert( Float16Array.prototype.reduce.name === "reduce" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.reduce.length === 1 );
        });

        it("check callback arguments", () => {
            const float16_1 = new Float16Array([1, 2]);

            float16_1.reduce(function (prev, current, key, f16) {

                assert( prev === 1 );
                assert( current === 2 );
                assert( key === 1 );
                assert( f16 === float16_1 );

            });

            const float16_2 = new Float16Array([2]);

            float16_2.reduce(function (prev, current, key, f16) {

                assert( prev === 1 );
                assert( current === 2 );
                assert( key === 0 );
                assert( f16 === float16_2 );

            }, 1);
        });

        it("add as string", () => {
            const float16 = new Float16Array([1, 2, 3]);
            const val = float16.reduce((prev, current) => prev + current, "");
            assert( val === "123" );
        });

        it("throw TypeError on empty array with no initial value", () => {
            const float16 = new Float16Array();
            assert.throws(() => float16.reduce(() => {}), TypeError);
        });

    });

    describe("#reduceRight()", () => {

        it("property `name` is 'reduceRight'", () => {
            assert( Float16Array.prototype.reduceRight.name === "reduceRight" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.reduceRight.length === 1 );
        });

        it("check callback arguments", () => {
            const float16_1 = new Float16Array([1, 2]);

            float16_1.reduceRight(function (prev, current, key, f16) {

                assert( prev === 2 );
                assert( current === 1 );
                assert( key === 0 );
                assert( f16 === float16_1 );

            });

            const float16_2 = new Float16Array([2]);

            float16_2.reduceRight(function (prev, current, key, f16) {

                assert( prev === 1 );
                assert( current === 2 );
                assert( key === 0 );
                assert( f16 === float16_2 );

            }, 1);
        });

        it("add as string", () => {
            const float16 = new Float16Array([1, 2, 3]);
            const val = float16.reduceRight((prev, current) => prev + current, "");
            assert( val === "321" );
        });

        it("throw TypeError on empty array with no initial value", () => {
            const float16 = new Float16Array();
            assert.throws(() => float16.reduce(() => {}), TypeError);
        });

    });

    describe("#forEach()", () => {

        it("property `name` is 'forEach'", () => {
            assert( Float16Array.prototype.forEach.name === "forEach" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.forEach.length === 1 );
        });

        it("check callback arguments", () => {
            const float16 = new Float16Array([1]);
            const thisArg = {};

            float16.forEach(function (val, key, f16) {

                assert( val === 1 );
                assert( key === 0 );
                assert( f16 === float16 );
                assert( this === thisArg );

            }, thisArg);
        });

    });

    describe("#find()", () => {

        it("property `name` is 'find'", () => {
            assert( Float16Array.prototype.find.name === "find" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.find.length === 1 );
        });

        it("check callback arguments", () => {
            const float16 = new Float16Array([1]);
            const thisArg = {};

            float16.find(function (val, key, f16) {

                assert( val === 1 );
                assert( key === 0 );
                assert( f16 === float16 );
                assert( this === thisArg );

            }, thisArg);
        });

        it("find even value", () => {
            const float16_1 = new Float16Array([1, 2, 3, 4]);
            assert( float16_1.find((val) => val % 2 === 0) === 2 );

            const float16_2 = new Float16Array([1, 3, 5]);
            assert( float16_2.find((val) => val % 2 === 0) === undefined );
        });

    });

    describe("#findIndex()", () => {

        it("property `name` is 'findIndex'", () => {
            assert( Float16Array.prototype.findIndex.name === "findIndex" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.findIndex.length === 1 );
        });

        it("check callback arguments", () => {
            const float16 = new Float16Array([1]);
            const thisArg = {};

            float16.findIndex(function (val, key, f16) {

                assert( val === 1 );
                assert( key === 0 );
                assert( f16 === float16 );
                assert( this === thisArg );

            }, thisArg);
        });

        it("find index of even value", () => {
            const float16_1 = new Float16Array([1, 2, 3, 4]);
            assert( float16_1.findIndex((val) => val % 2 === 0) === 1 );

            const float16_2 = new Float16Array([1, 3, 5]);
            assert( float16_2.findIndex((val) => val % 2 === 0) === -1 );
        });

    });

    describe("#findLast()", () => {

        it("property `name` is 'findLast'", () => {
            assert( Float16Array.prototype.findLast.name === "findLast" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.findLast.length === 1 );
        });

        it("check callback arguments", () => {
            const float16 = new Float16Array([1]);
            const thisArg = {};

            float16.findLast(function (val, key, f16) {

                assert( val === 1 );
                assert( key === 0 );
                assert( f16 === float16 );
                assert( this === thisArg );

            }, thisArg);
        });

        it("find even value from last", () => {
            const float16_1 = new Float16Array([1, 2, 3, 4]);
            assert( float16_1.findLast((val) => val % 2 === 0) === 4 );

            const float16_2 = new Float16Array([1, 3, 5]);
            assert( float16_2.findLast((val) => val % 2 === 0) === undefined );
        });

    });

    describe("#findLastIndex()", () => {

        it("property `name` is 'findLastIndex'", () => {
            assert( Float16Array.prototype.findLastIndex.name === "findLastIndex" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.findLastIndex.length === 1 );
        });

        it("check callback arguments", () => {
            const float16 = new Float16Array([1]);
            const thisArg = {};

            float16.findLastIndex(function (val, key, f16) {

                assert( val === 1 );
                assert( key === 0 );
                assert( f16 === float16 );
                assert( this === thisArg );

            }, thisArg);
        });

        it("find last index of even value", () => {
            const float16_1 = new Float16Array([1, 2, 3, 4]);
            assert( float16_1.findLastIndex((val) => val % 2 === 0) === 3 );

            const float16_2 = new Float16Array([1, 3, 5]);
            assert( float16_2.findLastIndex((val) => val % 2 === 0) === -1 );
        });

    });

    describe("#every()", () => {

        it("property `name` is 'every'", () => {
            assert( Float16Array.prototype.every.name === "every" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.every.length === 1 );
        });

        it("check callback arguments", () => {
            const float16 = new Float16Array([1]);
            const thisArg = {};

            float16.every(function (val, key, f16) {

                assert( val === 1 );
                assert( key === 0 );
                assert( f16 === float16 );
                assert( this === thisArg );

            }, thisArg);
        });

        it("have all even value", () => {
            const float16_1 = new Float16Array([2, 4, 6]);
            assert( float16_1.every((val) => val % 2 === 0) === true );

            const float16_2 = new Float16Array([2, 4, 7]);
            assert( float16_2.every((val) => val % 2 === 0) === false );
        });

    });

    describe("#some()", () => {

        it("property `name` is 'some'", () => {
            assert( Float16Array.prototype.some.name === "some" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.some.length === 1 );
        });

        it("check callback arguments", () => {
            const float16 = new Float16Array([1]);
            const thisArg = {};

            float16.some(function (val, key, f16) {

                assert( val === 1 );
                assert( key === 0 );
                assert( f16 === float16 );
                assert( this === thisArg );

            }, thisArg);
        });

        it("have some even value", () => {
            const float16_1 = new Float16Array([1, 2, 3]);
            assert( float16_1.some((val) => val % 2 === 0) === true );

            const float16_2 = new Float16Array([1, 3, 5]);
            assert( float16_2.some((val) => val % 2 === 0) === false );
        });

    });

    describe("#set()", () => {

        it("property `name` is 'set'", () => {
            assert( Float16Array.prototype.set.name === "set" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.set.length === 1 );
        });

        it("set Array or TypedArray", () => {
            const float16 = new Float16Array([1, 2, 3, 4, 5]);
            const array = [10, 11];

            assert( float16.set(array, 2) === undefined );
            assert.equalFloat16ArrayValues( float16, [1, 2, 10, 11, 5] );

            const float32 = new Float32Array([20, 21]);

            assert( float16.set(float32, 1) === undefined );
            assert.equalFloat16ArrayValues( float16, [1, 20, 21, 11, 5] );
        });

        it("set ArrayLike", () => {
            const float16 = new Float16Array([1, 2, 3, 4, 5]);
            const arrayLike = { 0: 10, 1: 11, length: 2 };

            assert( float16.set(arrayLike, 2) === undefined );
            assert.equalFloat16ArrayValues( float16, [1, 2, 10, 11, 5] );

            const str = "89";
            assert( float16.set(str, 1) === undefined );
            assert.equalFloat16ArrayValues( float16, [1, 8, 9, 11, 5] );
        });

        it("set Iterable (no effect)", () => {
            const float16 = new Float16Array([1, 2, 3, 4, 5]);
            const Iterable = [10, 11][Symbol.iterator]();

            assert( float16.set(Iterable, 2) === undefined );
            assert.equalFloat16ArrayValues( float16, [1, 2, 3, 4, 5] );
        });

        it("set Float16Array", () => {
            const float16 = new Float16Array([1, 2, 3, 4, 5]);
            const array = [10, 11];

            assert( float16.set(new Float16Array(array), 2) === undefined );
            assert.equalFloat16ArrayValues( float16, [1, 2, 10, 11, 5] );
        });

        it("set Float16Array from another realm", function () {
            if (AnotherRealmFloat16Array === undefined) {
                this.skip();
            }

            const float16 = new Float16Array([1, 2, 3, 4, 5]);
            const array = [10, 11];

            assert( float16.set(new AnotherRealmFloat16Array(array), 2) === undefined );
            assert.equalFloat16ArrayValues( float16, [1, 2, 10, 11, 5] );
        });

        it("check out of Range", () => {
            const float16 = new Float16Array([1, 2, 3, 4, 5]);
            const array = [10, 11];

            assert.throws(() => float16.set(array, -1), RangeError);
            assert.throws(() => float16.set(array, 4), RangeError);
            assert.throws(() => float16.set(array, Infinity), RangeError);
        });

    });

    describe("#reverse()", () => {

        it("property `name` is 'reverse'", () => {
            assert( Float16Array.prototype.reverse.name === "reverse" );
        });

        it("property `length` is 0", () => {
            assert( Float16Array.prototype.reverse.length === 0 );
        });

        it("reverse", () => {
            const float16 = new Float16Array([1, 2, 3]);

            assert( float16.reverse() === float16 );
            assert.equalFloat16ArrayValues( float16, [3, 2, 1] );
        });

    });

    describe("#fill()", () => {

        it("property `name` is 'fill'", () => {
            assert( Float16Array.prototype.fill.name === "fill" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.fill.length === 1 );
        });

        it("fill", () => {
            const float16 = new Float16Array(5);

            assert( float16.fill(1, 1, 4) === float16 );
            assert.equalFloat16ArrayValues( float16, [0, 1, 1, 1, 0] );
        });

    });

    describe("#copyWithin()", () => {

        it("property `name` is 'copyWithin'", () => {
            assert( Float16Array.prototype.copyWithin.name === "copyWithin" );
        });

        it("property `length` is 2", () => {
            assert( Float16Array.prototype.copyWithin.length === 2 );
        });

        it("copyWitnin", () => {
            const float16 = new Float16Array([1, 2, 0, 0, 0]);

            assert( float16.copyWithin(2, 0, 2) === float16 );
            assert.equalFloat16ArrayValues( float16, [1, 2, 1, 2, 0] );
        });

    });

    describe("#sort()", () => {

        it("property `name` is 'sort'", () => {
            assert( Float16Array.prototype.sort.name === "sort" );
        });

        it("property `length` is 0", () => {
            assert( Float16Array.prototype.sort.length === 0 );
        });

        it("check default compare", () => {
            const float16 = new Float16Array([1, 2, -1, -2, 0, -0, NaN, Infinity, -Infinity]);

            assert( float16.sort() === float16 );
            assert.equalFloat16ArrayValues( float16, [-Infinity, -2, -1, -0, 0, 1, 2, Infinity, NaN] );
        });

        it("check custom compare", () => {
            const float16 = new Float16Array([1, 2, -1, -2, Infinity, -Infinity]);

            assert( float16.sort( (x, y) => x - y ) === float16 );
            assert.equalFloat16ArrayValues( float16, [-Infinity, -2, -1, 1, 2, Infinity] );
        });

    });

    describe("#slice()", () => {

        it("property `name` is 'slice'", () => {
            assert( Float16Array.prototype.slice.name === "slice" );
        });

        it("property `length` is 0", () => {
            assert( Float16Array.prototype.slice.length === 0 );
        });

        it("get slice", () => {
            const float16 = new Float16Array([1, 2, 3]);

            const sliced = float16.slice();
            assert( sliced instanceof Float16Array );
            assert.equalFloat16ArrayValues( float16, sliced );
            assert( float16.buffer !== sliced.buffer );
        });

        it("check sliced element & offset", () => {
            const float16 = new Float16Array([1, 2, 3, 4]);

            const sliced = float16.slice(1, 3);
            assert( sliced.byteOffset === 0 );
            assert.equalFloat16ArrayValues( sliced, [2, 3] );
        });

        it("respect @@species", () => {
            let step = 0;
            class Foo extends Float16Array {
                constructor(...args) {
                    super(...args);
                    if (step === 0) {
                        assert( args.length === 1 );
                        assert.deepStrictEqual( args[0], [1, 2, 3, 4] );
                        ++step;
                    } else {
                        assert.deepStrictEqual( args, [2] );
                    }
                }
            }
            const foo = new Foo([1, 2, 3, 4]).slice(2);
            assert( foo instanceof Foo );
            assert.equalFloat16ArrayValues( foo, [3, 4] );

            class Bar extends Float16Array {
                static get [Symbol.species]() { return Float16Array; }
            }
            const bar = new Bar([1, 2, 3, 4]).slice(2);
            assert( !(bar instanceof Bar) );
            assert( bar instanceof Float16Array );
            assert( bar, [3, 4] );
        });

    });

    describe("#subarray()", () => {

        it("property `name` is 'subarray'", () => {
            assert( Float16Array.prototype.subarray.name === "subarray" );
        });

        it("property `length` is 0", () => {
            assert( Float16Array.prototype.subarray.length === 0 );
        });

        it("get subarray", () => {
            const float16 = new Float16Array([1, 2, 3]);

            const subarray = float16.subarray();
            assert( subarray instanceof Float16Array );
            assert.equalFloat16ArrayValues( float16, subarray );
            assert( float16.buffer === subarray.buffer );
        });

        it("check subarray element & offset", () => {
            const float16 = new Float16Array([1, 2, 3, 4]);

            const subarray = float16.subarray(1, 3);
            assert( subarray.byteOffset === 2 );
            assert.equalFloat16ArrayValues( subarray, [2, 3] );
        });

        it("respect @@species", () => {
            let step = 0;
            class Foo extends Float16Array {
                constructor(...args) {
                    super(...args);
                    if (step === 0) {
                        assert( args.length === 1 );
                        assert.deepStrictEqual( args[0], [1, 2, 3, 4] );
                        ++step;
                    } else {
                        assert( args.length === 3 );
                        assert( args[0] instanceof ArrayBuffer );
                        assert( args[1] === 4 );
                        assert( args[2] === 2 );
                    }
                }
            }
            const foo = new Foo([1, 2, 3, 4]).subarray(2);
            assert( foo instanceof Foo );
            assert.equalFloat16ArrayValues( foo, [3, 4] );

            class Bar extends Float16Array {
                static get [Symbol.species]() { return Float16Array; }
            }
            const bar = new Bar([1, 2, 3, 4]).subarray(2);
            assert( !(bar instanceof Bar) );
            assert( bar instanceof Float16Array );
            assert.equalFloat16ArrayValues( bar, [3, 4] );
        });

    });

    describe("#indexOf()", () => {

        it("property `name` is 'indexOf'", () => {
            assert( Float16Array.prototype.indexOf.name === "indexOf" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.indexOf.length === 1 );
        });

        it("check indexOf", () => {
            const float16 = new Float16Array([1, 2, 3]);

            assert( float16.indexOf(1) === 0 );
            assert( float16.indexOf(1, 1) === -1 );
            assert( float16.indexOf(2, 1) === 1 );
            assert( float16.indexOf(2, -1) === -1 );
            assert( float16.indexOf(2, -2) === 1 );
        });

    });

    describe("#lastIndexOf()", () => {

        it("property `name` is 'lastIndexOf'", () => {
            assert( Float16Array.prototype.lastIndexOf.name === "lastIndexOf" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.lastIndexOf.length === 1 );
        });

        it("check lastIndexOf", () => {
            const float16 = new Float16Array([1, 2, 3]);

            assert( float16.lastIndexOf(1) === 0 );
            assert( float16.lastIndexOf(2, 1) === 1 );
            assert( float16.lastIndexOf(2, -2) === 1 );
            assert( float16.lastIndexOf(2, -3) === -1 );
            assert( float16.lastIndexOf(2, -5) === -1 );
            assert( float16.lastIndexOf(3, 1) === -1 );
        });

    });

    describe("#includes()", () => {

        it("property `name` is 'includes'", () => {
            assert( Float16Array.prototype.includes.name === "includes" );
        });

        it("property `length` is 1", () => {
            assert( Float16Array.prototype.includes.length === 1 );
        });

        it("check includes", () => {
            const float16 = new Float16Array([1, 2, 3]);

            assert( float16.includes(1) === true );
            assert( float16.includes(1, 1) === false );
            assert( float16.includes(2, 1) === true );
            assert( float16.includes(2, -1) === false );
            assert( float16.includes(2, -2) === true );
        });

    });

    describe("#join()", () => {

        it("property `name` is 'join'", () => {
            assert( Float16Array.prototype.join.name === "join" );
        });

        it("property `length` is 0", () => {
            assert( Float16Array.prototype.join.length === 0 );
        });

        it("check join", () => {
            const float16 = new Float16Array([1, 2, 3]);

            assert( float16.join() === "1,2,3" );
            assert( float16.join("|") === "1|2|3" );
        });

    });

    describe("#toLocaleString()", () => {

        it("property `name` is 'toLocaleString'", () => {
            assert( Float16Array.prototype.toLocaleString.name === "toLocaleString" );
        });

        it("property `length` is 0", () => {
            assert( Float16Array.prototype.toLocaleString.length === 0 );
        });

        it("same as Array", () => {
            const float16 = new Float16Array([1, 2, 3]);
            assert( float16.toLocaleString() === [1, 2, 3].toLocaleString() );
        });

    });

    describe("#toString()", () => {

        it("property `name` is 'toString'", () => {
            assert( Float16Array.prototype.toString.name === "toString" );
        });

        it("property `length` is 0", () => {
            assert( Float16Array.prototype.toString.length === 0 );
        });

        it("check toString", () => {
            const float16 = new Float16Array([1, 2, 3]);
            assert( float16.toString() === "1,2,3" );
        });

        it("call Array#toString by Float16Array", () => {
            const float16 = new Float16Array([1, 2, 3]);
            assert( Array.prototype.toString.call(float16) === "1,2,3" );
        });

        it("call Float16Array#toString by Array", () => {
            const array = [1, 2, 3];
            assert( Float16Array.prototype.toString.call(array) === "1,2,3" );
        });

    });

});

describe("isFloat16Array", () => {

    let AnotherRealmFloat16Array;

    if (typeof window !== "undefined") {
        const iframe = document.createElement("iframe");
        iframe.height = iframe.width = 0;
        document.body.appendChild(iframe);
        iframe.contentDocument.write('<script src="float16.js"></script>');
        AnotherRealmFloat16Array = iframe.contentWindow.float16.Float16Array;
        iframe.remove();
    }

    it("property `name` is 'isFloat16Array'", () => {
        assert( isFloat16Array.name === "isFloat16Array" );
    });

    it("property `length` is 1", () => {
        assert( isFloat16Array.length === 1 );
    });

    it("check if Float16Array", () => {
        assert( isFloat16Array(new Float16Array()) === true );
        assert( isFloat16Array(new Float32Array()) === false );
        assert( isFloat16Array(new Uint16Array()) === false );

        assert( isFloat16Array(/* empty */) === false );
        assert( isFloat16Array(null) === false );
        assert( isFloat16Array(undefined) === false );
        assert( isFloat16Array(0) === false );
        assert( isFloat16Array(1) === false );
        assert( isFloat16Array(NaN) === false );
        assert( isFloat16Array(Infinity) === false );
        assert( isFloat16Array(true) === false );
        assert( isFloat16Array(false) === false );
        assert( isFloat16Array("") === false );
        assert( isFloat16Array("foo") === false );
        assert( isFloat16Array(Symbol()) === false );
        assert( isFloat16Array(BigInt(0)) === false );
        assert( isFloat16Array(BigInt(1)) === false );

        assert( isFloat16Array({}) === false );
        assert( isFloat16Array([]) === false );
        assert( isFloat16Array(/a/) === false );
        assert( isFloat16Array(() => {}) === false );
    });

    it("check if Float16Array from another realm", function () {
        if (AnotherRealmFloat16Array === undefined) {
            this.skip();
        }

        assert( isFloat16Array(new AnotherRealmFloat16Array()) === true );
    });

});
