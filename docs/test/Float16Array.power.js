var _PowerAssertRecorder1 = function () {
    function PowerAssertRecorder() {
        this.captured = [];
    }
    PowerAssertRecorder.prototype._capt = function _capt(value, espath) {
        this.captured.push({
            value: value,
            espath: espath
        });
        return value;
    };
    PowerAssertRecorder.prototype._expr = function _expr(value, source) {
        var capturedValues = this.captured;
        this.captured = [];
        return {
            powerAssertContext: {
                value: value,
                events: capturedValues
            },
            source: source
        };
    };
    return PowerAssertRecorder;
}();
(function () {
    const isTypedArrayIndexedPropertyWritable = Object.getOwnPropertyDescriptor(new Uint8Array(1), 0).writable;
    const isProxyAbleToBeWeakMapKey = function () {
        const proxy = new Proxy({}, {});
        return new WeakMap().set(proxy, 1).get(proxy) === 1;
    }();
    function isPlusZero(num) {
        return num === 0 && 1 / num === Infinity;
    }
    function isMinusZero(num) {
        return num === 0 && 1 / num === -Infinity;
    }
    function deepEqualArray(x, y) {
        var _rec1 = new _PowerAssertRecorder1();
        var _rec2 = new _PowerAssertRecorder1();
        assert(_rec1._expr(_rec1._capt(_rec1._capt(_rec1._capt(x, 'arguments/0/left/object').length, 'arguments/0/left') === _rec1._capt(_rec1._capt(y, 'arguments/0/right/object').length, 'arguments/0/right'), 'arguments/0'), {
            content: 'assert(x.length === y.length)',
            filepath: 'test/Float16Array.js',
            line: 18
        }));
        for (let i = 0, l = x.length; i < l; ++i) {
            assert(_rec2._expr(_rec2._capt(_rec2._capt(_rec2._capt(x, 'arguments/0/left/object')[_rec2._capt(i, 'arguments/0/left/property')], 'arguments/0/left') === _rec2._capt(_rec2._capt(y, 'arguments/0/right/object')[_rec2._capt(i, 'arguments/0/right/property')], 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(x[i] === y[i])',
                filepath: 'test/Float16Array.js',
                line: 21
            }));
        }
    }
    function deepEqualNumberArray(x, y) {
        var _rec3 = new _PowerAssertRecorder1();
        var _rec4 = new _PowerAssertRecorder1();
        var _rec5 = new _PowerAssertRecorder1();
        assert(_rec3._expr(_rec3._capt(_rec3._capt(_rec3._capt(x, 'arguments/0/left/object').length, 'arguments/0/left') === _rec3._capt(_rec3._capt(y, 'arguments/0/right/object').length, 'arguments/0/right'), 'arguments/0'), {
            content: 'assert(x.length === y.length)',
            filepath: 'test/Float16Array.js',
            line: 26
        }));
        for (let i = 0, l = x.length; i < l; ++i) {
            const [val_x, val_y] = [
                x[i],
                y[i]
            ];
            assert(_rec4._expr(_rec4._capt(_rec4._capt(_rec4._capt(val_x, 'arguments/0/left/left') === _rec4._capt(val_y, 'arguments/0/left/right'), 'arguments/0/left') || _rec4._capt(_rec4._capt(_rec4._capt(Number, 'arguments/0/right/left/callee/object').isNaN(_rec4._capt(val_x, 'arguments/0/right/left/arguments/0')), 'arguments/0/right/left') && _rec4._capt(_rec4._capt(Number, 'arguments/0/right/right/callee/object').isNaN(_rec4._capt(val_y, 'arguments/0/right/right/arguments/0')), 'arguments/0/right/right'), 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(val_x === val_y || Number.isNaN(val_x) && Number.isNaN(val_y))',
                filepath: 'test/Float16Array.js',
                line: 30
            }));
            if (val_x === 0 && val_y === 0) {
                assert(_rec5._expr(_rec5._capt(_rec5._capt(_rec5._capt(isPlusZero(_rec5._capt(val_x, 'arguments/0/left/left/arguments/0')), 'arguments/0/left/left') && _rec5._capt(isPlusZero(_rec5._capt(val_y, 'arguments/0/left/right/arguments/0')), 'arguments/0/left/right'), 'arguments/0/left') || _rec5._capt(_rec5._capt(isMinusZero(_rec5._capt(val_x, 'arguments/0/right/left/arguments/0')), 'arguments/0/right/left') && _rec5._capt(isMinusZero(_rec5._capt(val_y, 'arguments/0/right/right/arguments/0')), 'arguments/0/right/right'), 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(isPlusZero(val_x) && isPlusZero(val_y) || isMinusZero(val_x) && isMinusZero(val_y))',
                    filepath: 'test/Float16Array.js',
                    line: 33
                }));
            }
        }
    }
    describe('Float16Array', () => {
        it('property `name` is \'Float16Array\'', () => {
            var _rec6 = new _PowerAssertRecorder1();
            assert(_rec6._expr(_rec6._capt(_rec6._capt(_rec6._capt(Float16Array, 'arguments/0/left/object').name, 'arguments/0/left') === 'Float16Array', 'arguments/0'), {
                content: 'assert(Float16Array.name === "Float16Array")',
                filepath: 'test/Float16Array.js',
                line: 41
            }));
        });
        it('property `length` is 3', () => {
            var _rec7 = new _PowerAssertRecorder1();
            assert(_rec7._expr(_rec7._capt(_rec7._capt(_rec7._capt(Float16Array, 'arguments/0/left/object').length, 'arguments/0/left') === 3, 'arguments/0'), {
                content: 'assert(Float16Array.length === 3)',
                filepath: 'test/Float16Array.js',
                line: 45
            }));
        });
        it('property `BYTES_PER_ELEMENT` is 2', () => {
            var _rec8 = new _PowerAssertRecorder1();
            assert(_rec8._expr(_rec8._capt(_rec8._capt(_rec8._capt(Float16Array, 'arguments/0/left/object').BYTES_PER_ELEMENT, 'arguments/0/left') === 2, 'arguments/0'), {
                content: 'assert(Float16Array.BYTES_PER_ELEMENT === 2)',
                filepath: 'test/Float16Array.js',
                line: 49
            }));
        });
        it('input empty or primitive', () => {
            assert.doesNotThrow(() => new Float16Array());
            assert.doesNotThrow(() => new Float16Array(0));
            assert.doesNotThrow(() => new Float16Array(4));
            assert.throws(() => new Float16Array(-1), Error);
            assert.throws(() => new Float16Array(Symbol()), TypeError);
        });
        it('input Array or TypedArray', () => {
            var _rec9 = new _PowerAssertRecorder1();
            var _rec10 = new _PowerAssertRecorder1();
            var _rec11 = new _PowerAssertRecorder1();
            var _rec12 = new _PowerAssertRecorder1();
            var _rec13 = new _PowerAssertRecorder1();
            var _rec14 = new _PowerAssertRecorder1();
            var _rec15 = new _PowerAssertRecorder1();
            var _rec16 = new _PowerAssertRecorder1();
            const array = [
                1,
                1.1,
                1.2,
                1.3
            ];
            const checkArray = [
                1,
                1.099609375,
                1.19921875,
                1.2998046875
            ];
            const float16_1 = new Float16Array(array);
            assert(_rec9._expr(_rec9._capt(_rec9._capt(_rec9._capt(float16_1, 'arguments/0/left/object').BYTES_PER_ELEMENT, 'arguments/0/left') === 2, 'arguments/0'), {
                content: 'assert(float16_1.BYTES_PER_ELEMENT === 2)',
                filepath: 'test/Float16Array.js',
                line: 67
            }));
            assert(_rec10._expr(_rec10._capt(_rec10._capt(_rec10._capt(float16_1, 'arguments/0/left/object').byteOffset, 'arguments/0/left') === 0, 'arguments/0'), {
                content: 'assert(float16_1.byteOffset === 0)',
                filepath: 'test/Float16Array.js',
                line: 68
            }));
            assert(_rec11._expr(_rec11._capt(_rec11._capt(_rec11._capt(float16_1, 'arguments/0/left/object').byteLength, 'arguments/0/left') === 8, 'arguments/0'), {
                content: 'assert(float16_1.byteLength === 8)',
                filepath: 'test/Float16Array.js',
                line: 69
            }));
            assert(_rec12._expr(_rec12._capt(_rec12._capt(_rec12._capt(float16_1, 'arguments/0/left/object').length, 'arguments/0/left') === 4, 'arguments/0'), {
                content: 'assert(float16_1.length === 4)',
                filepath: 'test/Float16Array.js',
                line: 70
            }));
            deepEqualArray(float16_1, checkArray);
            const float16_2 = new Float16Array(new Float32Array(array));
            assert(_rec13._expr(_rec13._capt(_rec13._capt(_rec13._capt(float16_2, 'arguments/0/left/object').BYTES_PER_ELEMENT, 'arguments/0/left') === 2, 'arguments/0'), {
                content: 'assert(float16_2.BYTES_PER_ELEMENT === 2)',
                filepath: 'test/Float16Array.js',
                line: 75
            }));
            assert(_rec14._expr(_rec14._capt(_rec14._capt(_rec14._capt(float16_2, 'arguments/0/left/object').byteOffset, 'arguments/0/left') === 0, 'arguments/0'), {
                content: 'assert(float16_2.byteOffset === 0)',
                filepath: 'test/Float16Array.js',
                line: 76
            }));
            assert(_rec15._expr(_rec15._capt(_rec15._capt(_rec15._capt(float16_2, 'arguments/0/left/object').byteLength, 'arguments/0/left') === 8, 'arguments/0'), {
                content: 'assert(float16_2.byteLength === 8)',
                filepath: 'test/Float16Array.js',
                line: 77
            }));
            assert(_rec16._expr(_rec16._capt(_rec16._capt(_rec16._capt(float16_2, 'arguments/0/left/object').length, 'arguments/0/left') === 4, 'arguments/0'), {
                content: 'assert(float16_2.length === 4)',
                filepath: 'test/Float16Array.js',
                line: 78
            }));
            deepEqualArray(float16_2, checkArray);
        });
        it('input ArrayLike', () => {
            var _rec17 = new _PowerAssertRecorder1();
            var _rec18 = new _PowerAssertRecorder1();
            var _rec19 = new _PowerAssertRecorder1();
            var _rec20 = new _PowerAssertRecorder1();
            const arrayLike = {
                '0': 1,
                '1': 1.1,
                '2': 1.2,
                '3': 1.3,
                length: 4
            };
            const checkArray = [
                1,
                1.099609375,
                1.19921875,
                1.2998046875
            ];
            const float16 = new Float16Array(arrayLike);
            assert(_rec17._expr(_rec17._capt(_rec17._capt(_rec17._capt(float16, 'arguments/0/left/object').BYTES_PER_ELEMENT, 'arguments/0/left') === 2, 'arguments/0'), {
                content: 'assert(float16.BYTES_PER_ELEMENT === 2)',
                filepath: 'test/Float16Array.js',
                line: 88
            }));
            assert(_rec18._expr(_rec18._capt(_rec18._capt(_rec18._capt(float16, 'arguments/0/left/object').byteOffset, 'arguments/0/left') === 0, 'arguments/0'), {
                content: 'assert(float16.byteOffset === 0)',
                filepath: 'test/Float16Array.js',
                line: 89
            }));
            assert(_rec19._expr(_rec19._capt(_rec19._capt(_rec19._capt(float16, 'arguments/0/left/object').byteLength, 'arguments/0/left') === 8, 'arguments/0'), {
                content: 'assert(float16.byteLength === 8)',
                filepath: 'test/Float16Array.js',
                line: 90
            }));
            assert(_rec20._expr(_rec20._capt(_rec20._capt(_rec20._capt(float16, 'arguments/0/left/object').length, 'arguments/0/left') === 4, 'arguments/0'), {
                content: 'assert(float16.length === 4)',
                filepath: 'test/Float16Array.js',
                line: 91
            }));
            deepEqualArray(float16, checkArray);
        });
        it('input Iterator', () => {
            var _rec21 = new _PowerAssertRecorder1();
            var _rec22 = new _PowerAssertRecorder1();
            var _rec23 = new _PowerAssertRecorder1();
            var _rec24 = new _PowerAssertRecorder1();
            const iterator = [
                1,
                1.1,
                1.2,
                1.3
            ][Symbol.iterator]();
            const checkArray = [
                1,
                1.099609375,
                1.19921875,
                1.2998046875
            ];
            const float16 = new Float16Array(iterator);
            assert(_rec21._expr(_rec21._capt(_rec21._capt(_rec21._capt(float16, 'arguments/0/left/object').BYTES_PER_ELEMENT, 'arguments/0/left') === 2, 'arguments/0'), {
                content: 'assert(float16.BYTES_PER_ELEMENT === 2)',
                filepath: 'test/Float16Array.js',
                line: 101
            }));
            assert(_rec22._expr(_rec22._capt(_rec22._capt(_rec22._capt(float16, 'arguments/0/left/object').byteOffset, 'arguments/0/left') === 0, 'arguments/0'), {
                content: 'assert(float16.byteOffset === 0)',
                filepath: 'test/Float16Array.js',
                line: 102
            }));
            assert(_rec23._expr(_rec23._capt(_rec23._capt(_rec23._capt(float16, 'arguments/0/left/object').byteLength, 'arguments/0/left') === 8, 'arguments/0'), {
                content: 'assert(float16.byteLength === 8)',
                filepath: 'test/Float16Array.js',
                line: 103
            }));
            assert(_rec24._expr(_rec24._capt(_rec24._capt(_rec24._capt(float16, 'arguments/0/left/object').length, 'arguments/0/left') === 4, 'arguments/0'), {
                content: 'assert(float16.length === 4)',
                filepath: 'test/Float16Array.js',
                line: 104
            }));
            deepEqualArray(float16, checkArray);
        });
        it('input myself (Float16Array)', () => {
            var _rec25 = new _PowerAssertRecorder1();
            var _rec26 = new _PowerAssertRecorder1();
            var _rec27 = new _PowerAssertRecorder1();
            var _rec28 = new _PowerAssertRecorder1();
            const array = [
                1,
                1.1,
                1.2,
                1.3
            ];
            const checkArray = [
                1,
                1.099609375,
                1.19921875,
                1.2998046875
            ];
            const float16 = new Float16Array(new Float16Array(array));
            assert(_rec25._expr(_rec25._capt(_rec25._capt(_rec25._capt(float16, 'arguments/0/left/object').BYTES_PER_ELEMENT, 'arguments/0/left') === 2, 'arguments/0'), {
                content: 'assert(float16.BYTES_PER_ELEMENT === 2)',
                filepath: 'test/Float16Array.js',
                line: 114
            }));
            assert(_rec26._expr(_rec26._capt(_rec26._capt(_rec26._capt(float16, 'arguments/0/left/object').byteOffset, 'arguments/0/left') === 0, 'arguments/0'), {
                content: 'assert(float16.byteOffset === 0)',
                filepath: 'test/Float16Array.js',
                line: 115
            }));
            assert(_rec27._expr(_rec27._capt(_rec27._capt(_rec27._capt(float16, 'arguments/0/left/object').byteLength, 'arguments/0/left') === 8, 'arguments/0'), {
                content: 'assert(float16.byteLength === 8)',
                filepath: 'test/Float16Array.js',
                line: 116
            }));
            assert(_rec28._expr(_rec28._capt(_rec28._capt(_rec28._capt(float16, 'arguments/0/left/object').length, 'arguments/0/left') === 4, 'arguments/0'), {
                content: 'assert(float16.length === 4)',
                filepath: 'test/Float16Array.js',
                line: 117
            }));
            deepEqualArray(float16, checkArray);
        });
        it('input ArrayBuffer', () => {
            var _rec29 = new _PowerAssertRecorder1();
            var _rec30 = new _PowerAssertRecorder1();
            var _rec31 = new _PowerAssertRecorder1();
            var _rec32 = new _PowerAssertRecorder1();
            var _rec33 = new _PowerAssertRecorder1();
            var _rec34 = new _PowerAssertRecorder1();
            var _rec35 = new _PowerAssertRecorder1();
            var _rec36 = new _PowerAssertRecorder1();
            var _rec37 = new _PowerAssertRecorder1();
            var _rec38 = new _PowerAssertRecorder1();
            const buffer = new Uint16Array([
                15360,
                15462,
                15564,
                15667
            ]).buffer;
            const float16_1 = new Float16Array(buffer);
            assert(_rec29._expr(_rec29._capt(_rec29._capt(_rec29._capt(float16_1, 'arguments/0/left/object').BYTES_PER_ELEMENT, 'arguments/0/left') === 2, 'arguments/0'), {
                content: 'assert(float16_1.BYTES_PER_ELEMENT === 2)',
                filepath: 'test/Float16Array.js',
                line: 126
            }));
            assert(_rec30._expr(_rec30._capt(_rec30._capt(_rec30._capt(float16_1, 'arguments/0/left/object').buffer, 'arguments/0/left') === _rec30._capt(buffer, 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(float16_1.buffer === buffer)',
                filepath: 'test/Float16Array.js',
                line: 127
            }));
            assert(_rec31._expr(_rec31._capt(_rec31._capt(_rec31._capt(float16_1, 'arguments/0/left/object').byteOffset, 'arguments/0/left') === 0, 'arguments/0'), {
                content: 'assert(float16_1.byteOffset === 0)',
                filepath: 'test/Float16Array.js',
                line: 128
            }));
            assert(_rec32._expr(_rec32._capt(_rec32._capt(_rec32._capt(float16_1, 'arguments/0/left/object').byteLength, 'arguments/0/left') === 8, 'arguments/0'), {
                content: 'assert(float16_1.byteLength === 8)',
                filepath: 'test/Float16Array.js',
                line: 129
            }));
            assert(_rec33._expr(_rec33._capt(_rec33._capt(_rec33._capt(float16_1, 'arguments/0/left/object').length, 'arguments/0/left') === 4, 'arguments/0'), {
                content: 'assert(float16_1.length === 4)',
                filepath: 'test/Float16Array.js',
                line: 130
            }));
            deepEqualArray(float16_1, [
                1,
                1.099609375,
                1.19921875,
                1.2998046875
            ]);
            const float16_2 = new Float16Array(buffer, 2, 2);
            assert(_rec34._expr(_rec34._capt(_rec34._capt(_rec34._capt(float16_2, 'arguments/0/left/object').BYTES_PER_ELEMENT, 'arguments/0/left') === 2, 'arguments/0'), {
                content: 'assert(float16_2.BYTES_PER_ELEMENT === 2)',
                filepath: 'test/Float16Array.js',
                line: 135
            }));
            assert(_rec35._expr(_rec35._capt(_rec35._capt(_rec35._capt(float16_2, 'arguments/0/left/object').buffer, 'arguments/0/left') === _rec35._capt(buffer, 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(float16_2.buffer === buffer)',
                filepath: 'test/Float16Array.js',
                line: 136
            }));
            assert(_rec36._expr(_rec36._capt(_rec36._capt(_rec36._capt(float16_2, 'arguments/0/left/object').byteOffset, 'arguments/0/left') === 2, 'arguments/0'), {
                content: 'assert(float16_2.byteOffset === 2)',
                filepath: 'test/Float16Array.js',
                line: 137
            }));
            assert(_rec37._expr(_rec37._capt(_rec37._capt(_rec37._capt(float16_2, 'arguments/0/left/object').byteLength, 'arguments/0/left') === 4, 'arguments/0'), {
                content: 'assert(float16_2.byteLength === 4)',
                filepath: 'test/Float16Array.js',
                line: 138
            }));
            assert(_rec38._expr(_rec38._capt(_rec38._capt(_rec38._capt(float16_2, 'arguments/0/left/object').length, 'arguments/0/left') === 2, 'arguments/0'), {
                content: 'assert(float16_2.length === 2)',
                filepath: 'test/Float16Array.js',
                line: 139
            }));
            deepEqualArray(float16_2, [
                1.099609375,
                1.19921875
            ]);
        });
        it('iterate', () => {
            var _rec39 = new _PowerAssertRecorder1();
            const checkArray = [
                1,
                1.099609375,
                1.19921875,
                1.2998046875
            ];
            const float16 = new Float16Array([
                1,
                1.1,
                1.2,
                1.3
            ]);
            for (const val of float16) {
                assert(_rec39._expr(_rec39._capt(_rec39._capt(val, 'arguments/0/left') === _rec39._capt(_rec39._capt(checkArray, 'arguments/0/right/callee/object').shift(), 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(val === checkArray.shift())',
                    filepath: 'test/Float16Array.js',
                    line: 148
                }));
            }
        });
        it('return undefined when access out of range number key', () => {
            var _rec40 = new _PowerAssertRecorder1();
            const float16 = new Float16Array(4);
            float16[10] = 42;
            assert(_rec40._expr(_rec40._capt(_rec40._capt(_rec40._capt(float16, 'arguments/0/left/object')[10], 'arguments/0/left') === _rec40._capt(undefined, 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(float16[10] === undefined)',
                filepath: 'test/Float16Array.js',
                line: 156
            }));
        });
        it('can\'t be frozen with elements', function () {
            assert.doesNotThrow(() => Object.freeze(new Float16Array()));
            if (!isTypedArrayIndexedPropertyWritable)
                this.skip();
            assert.throws(() => Object.freeze(new Float16Array(10)), TypeError);
        });
        it('can\'t change property & prototype property if it frozen', function () {
            var _rec41 = new _PowerAssertRecorder1();
            var _rec42 = new _PowerAssertRecorder1();
            var _rec43 = new _PowerAssertRecorder1();
            const float16 = new Float16Array();
            float16.hoge = 'hoge';
            assert(_rec41._expr(_rec41._capt(_rec41._capt(_rec41._capt(float16, 'arguments/0/left/object').hoge, 'arguments/0/left') === 'hoge', 'arguments/0'), {
                content: 'assert(float16.hoge === "hoge")',
                filepath: 'test/Float16Array.js',
                line: 174
            }));
            Object.freeze(float16);
            float16.fuga = 'fuga';
            assert(_rec42._expr(_rec42._capt(_rec42._capt(_rec42._capt(float16, 'arguments/0/left/object').fuga, 'arguments/0/left') === _rec42._capt(undefined, 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(float16.fuga === undefined)',
                filepath: 'test/Float16Array.js',
                line: 183
            }));
            float16.map = 'map';
            assert(_rec43._expr(_rec43._capt(_rec43._capt(typeof _rec43._capt(_rec43._capt(float16, 'arguments/0/left/argument/object').map, 'arguments/0/left/argument'), 'arguments/0/left') === 'function', 'arguments/0'), {
                content: 'assert(typeof float16.map === "function")',
                filepath: 'test/Float16Array.js',
                line: 186
            }));
        });
        it('check ownKeys', function () {
            if (!isTypedArrayIndexedPropertyWritable || !isProxyAbleToBeWeakMapKey)
                this.skip();
            const float16 = new Float16Array([
                1,
                2
            ]);
            deepEqualArray(Reflect.ownKeys(float16), [
                '0',
                '1'
            ]);
        });
        it('append custom methods (not using `super`)', () => {
            var _rec44 = new _PowerAssertRecorder1();
            const float16 = new Float16Array([
                1,
                2,
                3
            ]);
            float16.sum = function () {
                let ret = 0;
                for (let i = 0, l = this.length; i < l; ++i) {
                    ret += this[i];
                }
                return ret;
            };
            assert(_rec44._expr(_rec44._capt(_rec44._capt(_rec44._capt(float16, 'arguments/0/left/callee/object').sum(), 'arguments/0/left') === 6, 'arguments/0'), {
                content: 'assert(float16.sum() === 6)',
                filepath: 'test/Float16Array.js',
                line: 208
            }));
        });
        it('prototype methods are as same as themselves', () => {
            var _rec45 = new _PowerAssertRecorder1();
            const float16 = new Float16Array();
            assert(_rec45._expr(_rec45._capt(_rec45._capt(_rec45._capt(float16, 'arguments/0/left/object').map, 'arguments/0/left') === _rec45._capt(_rec45._capt(float16, 'arguments/0/right/object').map, 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(float16.map === float16.map)',
                filepath: 'test/Float16Array.js',
                line: 213
            }));
        });
        describe('.from()', () => {
            it('property `name` is \'from\'', () => {
                var _rec46 = new _PowerAssertRecorder1();
                assert(_rec46._expr(_rec46._capt(_rec46._capt(_rec46._capt(_rec46._capt(Float16Array, 'arguments/0/left/object/object').from, 'arguments/0/left/object').name, 'arguments/0/left') === 'from', 'arguments/0'), {
                    content: 'assert(Float16Array.from.name === "from")',
                    filepath: 'test/Float16Array.js',
                    line: 219
                }));
            });
            it('property `length` is 1', () => {
                var _rec47 = new _PowerAssertRecorder1();
                assert(_rec47._expr(_rec47._capt(_rec47._capt(_rec47._capt(_rec47._capt(Float16Array, 'arguments/0/left/object/object').from, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.from.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 223
                }));
            });
            it('input Array or TypedArray', () => {
                var _rec48 = new _PowerAssertRecorder1();
                var _rec49 = new _PowerAssertRecorder1();
                const array = [
                    1,
                    1.1,
                    1.2,
                    1.3
                ];
                const checkArray = [
                    1,
                    1.099609375,
                    1.19921875,
                    1.2998046875
                ];
                const float16_1 = Float16Array.from(array);
                assert(_rec48._expr(_rec48._capt(_rec48._capt(float16_1, 'arguments/0/left') instanceof _rec48._capt(Float16Array, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16_1 instanceof Float16Array)',
                    filepath: 'test/Float16Array.js',
                    line: 232
                }));
                deepEqualArray(float16_1, checkArray);
                const float16_2 = Float16Array.from(new Float32Array(array));
                assert(_rec49._expr(_rec49._capt(_rec49._capt(float16_2, 'arguments/0/left') instanceof _rec49._capt(Float16Array, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16_2 instanceof Float16Array)',
                    filepath: 'test/Float16Array.js',
                    line: 237
                }));
                deepEqualArray(float16_2, checkArray);
            });
            it('input ArrayLike', () => {
                var _rec50 = new _PowerAssertRecorder1();
                const arrayLike = {
                    0: 1,
                    1: 1.1,
                    2: 1.2,
                    3: 1.3,
                    length: 4
                };
                const checkArray = [
                    1,
                    1.099609375,
                    1.19921875,
                    1.2998046875
                ];
                const float16 = Float16Array.from(arrayLike);
                assert(_rec50._expr(_rec50._capt(_rec50._capt(float16, 'arguments/0/left') instanceof _rec50._capt(Float16Array, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16 instanceof Float16Array)',
                    filepath: 'test/Float16Array.js',
                    line: 247
                }));
                deepEqualArray(float16, checkArray);
            });
            it('input Iterator', () => {
                var _rec51 = new _PowerAssertRecorder1();
                const iterator = [
                    1,
                    1.1,
                    1.2,
                    1.3
                ][Symbol.iterator]();
                const checkArray = [
                    1,
                    1.099609375,
                    1.19921875,
                    1.2998046875
                ];
                const float16 = Float16Array.from(iterator);
                assert(_rec51._expr(_rec51._capt(_rec51._capt(float16, 'arguments/0/left') instanceof _rec51._capt(Float16Array, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16 instanceof Float16Array)',
                    filepath: 'test/Float16Array.js',
                    line: 257
                }));
                deepEqualArray(float16, checkArray);
            });
            it('input myself (Float16Array)', () => {
                var _rec52 = new _PowerAssertRecorder1();
                const array = [
                    1,
                    1.1,
                    1.2,
                    1.3
                ];
                const checkArray = [
                    1,
                    1.099609375,
                    1.19921875,
                    1.2998046875
                ];
                const float16 = Float16Array.from(new Float16Array(array));
                assert(_rec52._expr(_rec52._capt(_rec52._capt(float16, 'arguments/0/left') instanceof _rec52._capt(Float16Array, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16 instanceof Float16Array)',
                    filepath: 'test/Float16Array.js',
                    line: 267
                }));
                deepEqualArray(float16, checkArray);
            });
            it('check mapFn callback arguments', () => {
                const thisArg = {};
                Float16Array.from([1], function (val, key) {
                    var _rec53 = new _PowerAssertRecorder1();
                    var _rec54 = new _PowerAssertRecorder1();
                    var _rec55 = new _PowerAssertRecorder1();
                    assert(_rec53._expr(_rec53._capt(_rec53._capt(val, 'arguments/0/left') === 1, 'arguments/0'), {
                        content: 'assert(val === 1)',
                        filepath: 'test/Float16Array.js',
                        line: 276
                    }));
                    assert(_rec54._expr(_rec54._capt(_rec54._capt(key, 'arguments/0/left') === 0, 'arguments/0'), {
                        content: 'assert(key === 0)',
                        filepath: 'test/Float16Array.js',
                        line: 277
                    }));
                    assert(_rec55._expr(_rec55._capt(this === _rec55._capt(thisArg, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(this === thisArg)',
                        filepath: 'test/Float16Array.js',
                        line: 278
                    }));
                }, thisArg);
            });
        });
        describe('.of()', () => {
            it('property `name` is \'of\'', () => {
                var _rec56 = new _PowerAssertRecorder1();
                assert(_rec56._expr(_rec56._capt(_rec56._capt(_rec56._capt(_rec56._capt(Float16Array, 'arguments/0/left/object/object').of, 'arguments/0/left/object').name, 'arguments/0/left') === 'of', 'arguments/0'), {
                    content: 'assert(Float16Array.of.name === "of")',
                    filepath: 'test/Float16Array.js',
                    line: 288
                }));
            });
            it('property `length` is 0', () => {
                var _rec57 = new _PowerAssertRecorder1();
                assert(_rec57._expr(_rec57._capt(_rec57._capt(_rec57._capt(_rec57._capt(Float16Array, 'arguments/0/left/object/object').of, 'arguments/0/left/object').length, 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(Float16Array.of.length === 0)',
                    filepath: 'test/Float16Array.js',
                    line: 292
                }));
            });
            it('input arguments', () => {
                var _rec58 = new _PowerAssertRecorder1();
                const array = [
                    1,
                    1.1,
                    1.2,
                    1.3
                ];
                const checkArray = [
                    1,
                    1.099609375,
                    1.19921875,
                    1.2998046875
                ];
                const float16 = Float16Array.of(...array);
                assert(_rec58._expr(_rec58._capt(_rec58._capt(float16, 'arguments/0/left') instanceof _rec58._capt(Float16Array, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16 instanceof Float16Array)',
                    filepath: 'test/Float16Array.js',
                    line: 301
                }));
                deepEqualArray(float16, checkArray);
            });
        });
        describe('get #[ @@toStringTag ]', () => {
            it('return \'Float16Array\' when access by instance', () => {
                var _rec59 = new _PowerAssertRecorder1();
                const float16 = new Float16Array();
                assert(_rec59._expr(_rec59._capt(_rec59._capt(_rec59._capt(float16, 'arguments/0/left/object')[_rec59._capt(_rec59._capt(Symbol, 'arguments/0/left/property/object').toStringTag, 'arguments/0/left/property')], 'arguments/0/left') === 'Float16Array', 'arguments/0'), {
                    content: 'assert(float16[Symbol.toStringTag] === "Float16Array")',
                    filepath: 'test/Float16Array.js',
                    line: 311
                }));
            });
            it('return undefined when access by prototype', () => {
                var _rec60 = new _PowerAssertRecorder1();
                assert(_rec60._expr(_rec60._capt(_rec60._capt(_rec60._capt(_rec60._capt(Float16Array, 'arguments/0/left/object/object').prototype, 'arguments/0/left/object')[_rec60._capt(_rec60._capt(Symbol, 'arguments/0/left/property/object').toStringTag, 'arguments/0/left/property')], 'arguments/0/left') === _rec60._capt(undefined, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(Float16Array.prototype[Symbol.toStringTag] === undefined)',
                    filepath: 'test/Float16Array.js',
                    line: 315
                }));
            });
        });
        describe('#keys()', () => {
            it('property `name` is \'keys\'', () => {
                var _rec61 = new _PowerAssertRecorder1();
                assert(_rec61._expr(_rec61._capt(_rec61._capt(_rec61._capt(_rec61._capt(_rec61._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').keys, 'arguments/0/left/object').name, 'arguments/0/left') === 'keys', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.keys.name === "keys")',
                    filepath: 'test/Float16Array.js',
                    line: 323
                }));
            });
            it('property `length` is 0', () => {
                var _rec62 = new _PowerAssertRecorder1();
                assert(_rec62._expr(_rec62._capt(_rec62._capt(_rec62._capt(_rec62._capt(_rec62._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').keys, 'arguments/0/left/object').length, 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.keys.length === 0)',
                    filepath: 'test/Float16Array.js',
                    line: 327
                }));
            });
            it('get keys', () => {
                var _rec63 = new _PowerAssertRecorder1();
                var _rec64 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                const array = [...float16.keys()];
                assert.deepStrictEqual(_rec63._expr(_rec63._capt(array, 'arguments/0'), {
                    content: 'assert.deepStrictEqual(array, [0,1,2])',
                    filepath: 'test/Float16Array.js',
                    line: 333
                }), _rec64._expr(_rec64._capt([
                    0,
                    1,
                    2
                ], 'arguments/1'), {
                    content: 'assert.deepStrictEqual(array, [0,1,2])',
                    filepath: 'test/Float16Array.js',
                    line: 333
                }));
            });
        });
        describe('#values()', () => {
            it('property `name` is \'values\'', () => {
                var _rec65 = new _PowerAssertRecorder1();
                assert(_rec65._expr(_rec65._capt(_rec65._capt(_rec65._capt(_rec65._capt(_rec65._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').values, 'arguments/0/left/object').name, 'arguments/0/left') === 'values', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.values.name === "values")',
                    filepath: 'test/Float16Array.js',
                    line: 341
                }));
            });
            it('property `length` is 0', () => {
                var _rec66 = new _PowerAssertRecorder1();
                assert(_rec66._expr(_rec66._capt(_rec66._capt(_rec66._capt(_rec66._capt(_rec66._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').values, 'arguments/0/left/object').length, 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.values.length === 0)',
                    filepath: 'test/Float16Array.js',
                    line: 345
                }));
            });
            it('get values', () => {
                var _rec67 = new _PowerAssertRecorder1();
                var _rec68 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                const array = [...float16.values()];
                assert.deepStrictEqual(_rec67._expr(_rec67._capt(array, 'arguments/0'), {
                    content: 'assert.deepStrictEqual(array, [1,2,3])',
                    filepath: 'test/Float16Array.js',
                    line: 352
                }), _rec68._expr(_rec68._capt([
                    1,
                    2,
                    3
                ], 'arguments/1'), {
                    content: 'assert.deepStrictEqual(array, [1,2,3])',
                    filepath: 'test/Float16Array.js',
                    line: 352
                }));
            });
        });
        describe('#entries()', () => {
            it('property `name` is \'entries\'', () => {
                var _rec69 = new _PowerAssertRecorder1();
                assert(_rec69._expr(_rec69._capt(_rec69._capt(_rec69._capt(_rec69._capt(_rec69._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').entries, 'arguments/0/left/object').name, 'arguments/0/left') === 'entries', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.entries.name === "entries")',
                    filepath: 'test/Float16Array.js',
                    line: 360
                }));
            });
            it('property `length` is 0', () => {
                var _rec70 = new _PowerAssertRecorder1();
                assert(_rec70._expr(_rec70._capt(_rec70._capt(_rec70._capt(_rec70._capt(_rec70._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').entries, 'arguments/0/left/object').length, 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.entries.length === 0)',
                    filepath: 'test/Float16Array.js',
                    line: 364
                }));
            });
            it('get values', () => {
                var _rec71 = new _PowerAssertRecorder1();
                var _rec72 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                const array = [...float16.entries()];
                assert.deepStrictEqual(_rec71._expr(_rec71._capt(array, 'arguments/0'), {
                    content: 'assert.deepStrictEqual(array, [[0,1],[1,2],[2,3]])',
                    filepath: 'test/Float16Array.js',
                    line: 371
                }), _rec72._expr(_rec72._capt([
                    _rec72._capt([
                        0,
                        1
                    ], 'arguments/1/elements/0'),
                    _rec72._capt([
                        1,
                        2
                    ], 'arguments/1/elements/1'),
                    _rec72._capt([
                        2,
                        3
                    ], 'arguments/1/elements/2')
                ], 'arguments/1'), {
                    content: 'assert.deepStrictEqual(array, [[0,1],[1,2],[2,3]])',
                    filepath: 'test/Float16Array.js',
                    line: 371
                }));
            });
        });
        describe('#map()', () => {
            it('property `name` is \'map\'', () => {
                var _rec73 = new _PowerAssertRecorder1();
                assert(_rec73._expr(_rec73._capt(_rec73._capt(_rec73._capt(_rec73._capt(_rec73._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').map, 'arguments/0/left/object').name, 'arguments/0/left') === 'map', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.map.name === "map")',
                    filepath: 'test/Float16Array.js',
                    line: 379
                }));
            });
            it('property `length` is 1', () => {
                var _rec74 = new _PowerAssertRecorder1();
                assert(_rec74._expr(_rec74._capt(_rec74._capt(_rec74._capt(_rec74._capt(_rec74._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').map, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.map.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 383
                }));
            });
            it('check callback arguments', () => {
                const float16 = new Float16Array([1]);
                const thisArg = {};
                float16.map(function (val, key, f16) {
                    var _rec75 = new _PowerAssertRecorder1();
                    var _rec76 = new _PowerAssertRecorder1();
                    var _rec77 = new _PowerAssertRecorder1();
                    var _rec78 = new _PowerAssertRecorder1();
                    assert(_rec75._expr(_rec75._capt(_rec75._capt(val, 'arguments/0/left') === 1, 'arguments/0'), {
                        content: 'assert(val === 1)',
                        filepath: 'test/Float16Array.js',
                        line: 392
                    }));
                    assert(_rec76._expr(_rec76._capt(_rec76._capt(key, 'arguments/0/left') === 0, 'arguments/0'), {
                        content: 'assert(key === 0)',
                        filepath: 'test/Float16Array.js',
                        line: 393
                    }));
                    assert(_rec77._expr(_rec77._capt(_rec77._capt(f16, 'arguments/0/left') === _rec77._capt(float16, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(f16 === float16)',
                        filepath: 'test/Float16Array.js',
                        line: 394
                    }));
                    assert(_rec78._expr(_rec78._capt(this === _rec78._capt(thisArg, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(this === thisArg)',
                        filepath: 'test/Float16Array.js',
                        line: 395
                    }));
                }, thisArg);
            });
            it('get x2', () => {
                var _rec79 = new _PowerAssertRecorder1();
                const float16_1 = new Float16Array([
                    1,
                    2,
                    3,
                    4
                ]);
                const float16_2 = float16_1.map(val => val * 2);
                assert(_rec79._expr(_rec79._capt(_rec79._capt(float16_2, 'arguments/0/left') instanceof _rec79._capt(Float16Array, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16_2 instanceof Float16Array)',
                    filepath: 'test/Float16Array.js',
                    line: 404
                }));
                deepEqualArray(float16_2, [
                    2,
                    4,
                    6,
                    8
                ]);
            });
        });
        describe('#filter()', () => {
            it('property `name` is \'fillter\'', () => {
                var _rec80 = new _PowerAssertRecorder1();
                assert(_rec80._expr(_rec80._capt(_rec80._capt(_rec80._capt(_rec80._capt(_rec80._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').filter, 'arguments/0/left/object').name, 'arguments/0/left') === 'filter', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.filter.name === "filter")',
                    filepath: 'test/Float16Array.js',
                    line: 413
                }));
            });
            it('property `length` is 1', () => {
                var _rec81 = new _PowerAssertRecorder1();
                assert(_rec81._expr(_rec81._capt(_rec81._capt(_rec81._capt(_rec81._capt(_rec81._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').filter, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.filter.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 417
                }));
            });
            it('check callback arguments', () => {
                const float16 = new Float16Array([1]);
                const thisArg = {};
                float16.filter(function (val, key, f16) {
                    var _rec82 = new _PowerAssertRecorder1();
                    var _rec83 = new _PowerAssertRecorder1();
                    var _rec84 = new _PowerAssertRecorder1();
                    var _rec85 = new _PowerAssertRecorder1();
                    assert(_rec82._expr(_rec82._capt(_rec82._capt(val, 'arguments/0/left') === 1, 'arguments/0'), {
                        content: 'assert(val === 1)',
                        filepath: 'test/Float16Array.js',
                        line: 426
                    }));
                    assert(_rec83._expr(_rec83._capt(_rec83._capt(key, 'arguments/0/left') === 0, 'arguments/0'), {
                        content: 'assert(key === 0)',
                        filepath: 'test/Float16Array.js',
                        line: 427
                    }));
                    assert(_rec84._expr(_rec84._capt(_rec84._capt(f16, 'arguments/0/left') === _rec84._capt(float16, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(f16 === float16)',
                        filepath: 'test/Float16Array.js',
                        line: 428
                    }));
                    assert(_rec85._expr(_rec85._capt(this === _rec85._capt(thisArg, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(this === thisArg)',
                        filepath: 'test/Float16Array.js',
                        line: 429
                    }));
                }, thisArg);
            });
            it('filter even value', () => {
                var _rec86 = new _PowerAssertRecorder1();
                const float16_1 = new Float16Array([
                    1,
                    2,
                    3,
                    4
                ]);
                const float16_2 = float16_1.filter(val => val % 2 === 0);
                assert(_rec86._expr(_rec86._capt(_rec86._capt(float16_2, 'arguments/0/left') instanceof _rec86._capt(Float16Array, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16_2 instanceof Float16Array)',
                    filepath: 'test/Float16Array.js',
                    line: 438
                }));
                deepEqualArray(float16_2, [
                    2,
                    4
                ]);
            });
        });
        describe('#reduce()', () => {
            it('property `name` is \'reduce\'', () => {
                var _rec87 = new _PowerAssertRecorder1();
                assert(_rec87._expr(_rec87._capt(_rec87._capt(_rec87._capt(_rec87._capt(_rec87._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').reduce, 'arguments/0/left/object').name, 'arguments/0/left') === 'reduce', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.reduce.name === "reduce")',
                    filepath: 'test/Float16Array.js',
                    line: 447
                }));
            });
            it('property `length` is 1', () => {
                var _rec88 = new _PowerAssertRecorder1();
                assert(_rec88._expr(_rec88._capt(_rec88._capt(_rec88._capt(_rec88._capt(_rec88._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').reduce, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.reduce.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 451
                }));
            });
            it('check callback arguments', () => {
                const float16_1 = new Float16Array([
                    1,
                    2
                ]);
                float16_1.reduce(function (prev, current, key, f16) {
                    var _rec89 = new _PowerAssertRecorder1();
                    var _rec90 = new _PowerAssertRecorder1();
                    var _rec91 = new _PowerAssertRecorder1();
                    var _rec92 = new _PowerAssertRecorder1();
                    assert(_rec89._expr(_rec89._capt(_rec89._capt(prev, 'arguments/0/left') === 1, 'arguments/0'), {
                        content: 'assert(prev === 1)',
                        filepath: 'test/Float16Array.js',
                        line: 459
                    }));
                    assert(_rec90._expr(_rec90._capt(_rec90._capt(current, 'arguments/0/left') === 2, 'arguments/0'), {
                        content: 'assert(current === 2)',
                        filepath: 'test/Float16Array.js',
                        line: 460
                    }));
                    assert(_rec91._expr(_rec91._capt(_rec91._capt(key, 'arguments/0/left') === 1, 'arguments/0'), {
                        content: 'assert(key === 1)',
                        filepath: 'test/Float16Array.js',
                        line: 461
                    }));
                    assert(_rec92._expr(_rec92._capt(_rec92._capt(f16, 'arguments/0/left') === _rec92._capt(float16_1, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(f16 === float16_1)',
                        filepath: 'test/Float16Array.js',
                        line: 462
                    }));
                });
                const float16_2 = new Float16Array([2]);
                float16_2.reduce(function (prev, current, key, f16) {
                    var _rec93 = new _PowerAssertRecorder1();
                    var _rec94 = new _PowerAssertRecorder1();
                    var _rec95 = new _PowerAssertRecorder1();
                    var _rec96 = new _PowerAssertRecorder1();
                    assert(_rec93._expr(_rec93._capt(_rec93._capt(prev, 'arguments/0/left') === 1, 'arguments/0'), {
                        content: 'assert(prev === 1)',
                        filepath: 'test/Float16Array.js',
                        line: 470
                    }));
                    assert(_rec94._expr(_rec94._capt(_rec94._capt(current, 'arguments/0/left') === 2, 'arguments/0'), {
                        content: 'assert(current === 2)',
                        filepath: 'test/Float16Array.js',
                        line: 471
                    }));
                    assert(_rec95._expr(_rec95._capt(_rec95._capt(key, 'arguments/0/left') === 0, 'arguments/0'), {
                        content: 'assert(key === 0)',
                        filepath: 'test/Float16Array.js',
                        line: 472
                    }));
                    assert(_rec96._expr(_rec96._capt(_rec96._capt(f16, 'arguments/0/left') === _rec96._capt(float16_2, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(f16 === float16_2)',
                        filepath: 'test/Float16Array.js',
                        line: 473
                    }));
                }, 1);
            });
            it('add as string', () => {
                var _rec97 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                const val = float16.reduce((prev, current) => prev + current, '');
                assert(_rec97._expr(_rec97._capt(_rec97._capt(val, 'arguments/0/left') === '123', 'arguments/0'), {
                    content: 'assert(val === "123")',
                    filepath: 'test/Float16Array.js',
                    line: 481
                }));
            });
        });
        describe('#reduceRight()', () => {
            it('property `name` is \'reduceRight\'', () => {
                var _rec98 = new _PowerAssertRecorder1();
                assert(_rec98._expr(_rec98._capt(_rec98._capt(_rec98._capt(_rec98._capt(_rec98._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').reduceRight, 'arguments/0/left/object').name, 'arguments/0/left') === 'reduceRight', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.reduceRight.name === "reduceRight")',
                    filepath: 'test/Float16Array.js',
                    line: 489
                }));
            });
            it('property `length` is 1', () => {
                var _rec99 = new _PowerAssertRecorder1();
                assert(_rec99._expr(_rec99._capt(_rec99._capt(_rec99._capt(_rec99._capt(_rec99._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').reduceRight, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.reduceRight.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 493
                }));
            });
            it('check callback arguments', () => {
                const float16_1 = new Float16Array([
                    1,
                    2
                ]);
                float16_1.reduceRight(function (prev, current, key, f16) {
                    var _rec100 = new _PowerAssertRecorder1();
                    var _rec101 = new _PowerAssertRecorder1();
                    var _rec102 = new _PowerAssertRecorder1();
                    var _rec103 = new _PowerAssertRecorder1();
                    assert(_rec100._expr(_rec100._capt(_rec100._capt(prev, 'arguments/0/left') === 2, 'arguments/0'), {
                        content: 'assert(prev === 2)',
                        filepath: 'test/Float16Array.js',
                        line: 501
                    }));
                    assert(_rec101._expr(_rec101._capt(_rec101._capt(current, 'arguments/0/left') === 1, 'arguments/0'), {
                        content: 'assert(current === 1)',
                        filepath: 'test/Float16Array.js',
                        line: 502
                    }));
                    assert(_rec102._expr(_rec102._capt(_rec102._capt(key, 'arguments/0/left') === 0, 'arguments/0'), {
                        content: 'assert(key === 0)',
                        filepath: 'test/Float16Array.js',
                        line: 503
                    }));
                    assert(_rec103._expr(_rec103._capt(_rec103._capt(f16, 'arguments/0/left') === _rec103._capt(float16_1, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(f16 === float16_1)',
                        filepath: 'test/Float16Array.js',
                        line: 504
                    }));
                });
                const float16_2 = new Float16Array([2]);
                float16_2.reduceRight(function (prev, current, key, f16) {
                    var _rec104 = new _PowerAssertRecorder1();
                    var _rec105 = new _PowerAssertRecorder1();
                    var _rec106 = new _PowerAssertRecorder1();
                    var _rec107 = new _PowerAssertRecorder1();
                    assert(_rec104._expr(_rec104._capt(_rec104._capt(prev, 'arguments/0/left') === 1, 'arguments/0'), {
                        content: 'assert(prev === 1)',
                        filepath: 'test/Float16Array.js',
                        line: 512
                    }));
                    assert(_rec105._expr(_rec105._capt(_rec105._capt(current, 'arguments/0/left') === 2, 'arguments/0'), {
                        content: 'assert(current === 2)',
                        filepath: 'test/Float16Array.js',
                        line: 513
                    }));
                    assert(_rec106._expr(_rec106._capt(_rec106._capt(key, 'arguments/0/left') === 0, 'arguments/0'), {
                        content: 'assert(key === 0)',
                        filepath: 'test/Float16Array.js',
                        line: 514
                    }));
                    assert(_rec107._expr(_rec107._capt(_rec107._capt(f16, 'arguments/0/left') === _rec107._capt(float16_2, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(f16 === float16_2)',
                        filepath: 'test/Float16Array.js',
                        line: 515
                    }));
                }, 1);
            });
            it('add as string', () => {
                var _rec108 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                const val = float16.reduceRight((prev, current) => prev + current, '');
                assert(_rec108._expr(_rec108._capt(_rec108._capt(val, 'arguments/0/left') === '321', 'arguments/0'), {
                    content: 'assert(val === "321")',
                    filepath: 'test/Float16Array.js',
                    line: 523
                }));
            });
        });
        describe('#forEach()', () => {
            it('property `name` is \'forEach\'', () => {
                var _rec109 = new _PowerAssertRecorder1();
                assert(_rec109._expr(_rec109._capt(_rec109._capt(_rec109._capt(_rec109._capt(_rec109._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').forEach, 'arguments/0/left/object').name, 'arguments/0/left') === 'forEach', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.forEach.name === "forEach")',
                    filepath: 'test/Float16Array.js',
                    line: 531
                }));
            });
            it('property `length` is 1', () => {
                var _rec110 = new _PowerAssertRecorder1();
                assert(_rec110._expr(_rec110._capt(_rec110._capt(_rec110._capt(_rec110._capt(_rec110._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').forEach, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.forEach.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 535
                }));
            });
            it('check callback arguments', () => {
                const float16 = new Float16Array([1]);
                const thisArg = {};
                float16.forEach(function (val, key, f16) {
                    var _rec111 = new _PowerAssertRecorder1();
                    var _rec112 = new _PowerAssertRecorder1();
                    var _rec113 = new _PowerAssertRecorder1();
                    var _rec114 = new _PowerAssertRecorder1();
                    assert(_rec111._expr(_rec111._capt(_rec111._capt(val, 'arguments/0/left') === 1, 'arguments/0'), {
                        content: 'assert(val === 1)',
                        filepath: 'test/Float16Array.js',
                        line: 544
                    }));
                    assert(_rec112._expr(_rec112._capt(_rec112._capt(key, 'arguments/0/left') === 0, 'arguments/0'), {
                        content: 'assert(key === 0)',
                        filepath: 'test/Float16Array.js',
                        line: 545
                    }));
                    assert(_rec113._expr(_rec113._capt(_rec113._capt(f16, 'arguments/0/left') === _rec113._capt(float16, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(f16 === float16)',
                        filepath: 'test/Float16Array.js',
                        line: 546
                    }));
                    assert(_rec114._expr(_rec114._capt(this === _rec114._capt(thisArg, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(this === thisArg)',
                        filepath: 'test/Float16Array.js',
                        line: 547
                    }));
                }, thisArg);
            });
        });
        describe('#find()', () => {
            it('property `name` is \'find\'', () => {
                var _rec115 = new _PowerAssertRecorder1();
                assert(_rec115._expr(_rec115._capt(_rec115._capt(_rec115._capt(_rec115._capt(_rec115._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').find, 'arguments/0/left/object').name, 'arguments/0/left') === 'find', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.find.name === "find")',
                    filepath: 'test/Float16Array.js',
                    line: 557
                }));
            });
            it('property `length` is 1', () => {
                var _rec116 = new _PowerAssertRecorder1();
                assert(_rec116._expr(_rec116._capt(_rec116._capt(_rec116._capt(_rec116._capt(_rec116._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').find, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.find.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 561
                }));
            });
            it('check callback arguments', () => {
                const float16 = new Float16Array([1]);
                const thisArg = {};
                float16.find(function (val, key, f16) {
                    var _rec117 = new _PowerAssertRecorder1();
                    var _rec118 = new _PowerAssertRecorder1();
                    var _rec119 = new _PowerAssertRecorder1();
                    var _rec120 = new _PowerAssertRecorder1();
                    assert(_rec117._expr(_rec117._capt(_rec117._capt(val, 'arguments/0/left') === 1, 'arguments/0'), {
                        content: 'assert(val === 1)',
                        filepath: 'test/Float16Array.js',
                        line: 570
                    }));
                    assert(_rec118._expr(_rec118._capt(_rec118._capt(key, 'arguments/0/left') === 0, 'arguments/0'), {
                        content: 'assert(key === 0)',
                        filepath: 'test/Float16Array.js',
                        line: 571
                    }));
                    assert(_rec119._expr(_rec119._capt(_rec119._capt(f16, 'arguments/0/left') === _rec119._capt(float16, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(f16 === float16)',
                        filepath: 'test/Float16Array.js',
                        line: 572
                    }));
                    assert(_rec120._expr(_rec120._capt(this === _rec120._capt(thisArg, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(this === thisArg)',
                        filepath: 'test/Float16Array.js',
                        line: 573
                    }));
                }, thisArg);
            });
            it('find even value', () => {
                var _rec121 = new _PowerAssertRecorder1();
                var _rec122 = new _PowerAssertRecorder1();
                const float16_1 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                assert(_rec121._expr(_rec121._capt(_rec121._capt(_rec121._capt(float16_1, 'arguments/0/left/callee/object').find(val => val % 2 === 0), 'arguments/0/left') === 2, 'arguments/0'), {
                    content: 'assert(float16_1.find(val => val % 2 === 0) === 2)',
                    filepath: 'test/Float16Array.js',
                    line: 580
                }));
                const float16_2 = new Float16Array([
                    1,
                    3,
                    5
                ]);
                assert(_rec122._expr(_rec122._capt(_rec122._capt(_rec122._capt(float16_2, 'arguments/0/left/callee/object').find(val => val % 2 === 0), 'arguments/0/left') === _rec122._capt(undefined, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16_2.find(val => val % 2 === 0) === undefined)',
                    filepath: 'test/Float16Array.js',
                    line: 583
                }));
            });
        });
        describe('#findIndex()', () => {
            it('property `name` is \'findIndex\'', () => {
                var _rec123 = new _PowerAssertRecorder1();
                assert(_rec123._expr(_rec123._capt(_rec123._capt(_rec123._capt(_rec123._capt(_rec123._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').findIndex, 'arguments/0/left/object').name, 'arguments/0/left') === 'findIndex', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.findIndex.name === "findIndex")',
                    filepath: 'test/Float16Array.js',
                    line: 591
                }));
            });
            it('property `length` is 1', () => {
                var _rec124 = new _PowerAssertRecorder1();
                assert(_rec124._expr(_rec124._capt(_rec124._capt(_rec124._capt(_rec124._capt(_rec124._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').findIndex, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.findIndex.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 595
                }));
            });
            it('check callback arguments', () => {
                const float16 = new Float16Array([1]);
                const thisArg = {};
                float16.findIndex(function (val, key, f16) {
                    var _rec125 = new _PowerAssertRecorder1();
                    var _rec126 = new _PowerAssertRecorder1();
                    var _rec127 = new _PowerAssertRecorder1();
                    var _rec128 = new _PowerAssertRecorder1();
                    assert(_rec125._expr(_rec125._capt(_rec125._capt(val, 'arguments/0/left') === 1, 'arguments/0'), {
                        content: 'assert(val === 1)',
                        filepath: 'test/Float16Array.js',
                        line: 604
                    }));
                    assert(_rec126._expr(_rec126._capt(_rec126._capt(key, 'arguments/0/left') === 0, 'arguments/0'), {
                        content: 'assert(key === 0)',
                        filepath: 'test/Float16Array.js',
                        line: 605
                    }));
                    assert(_rec127._expr(_rec127._capt(_rec127._capt(f16, 'arguments/0/left') === _rec127._capt(float16, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(f16 === float16)',
                        filepath: 'test/Float16Array.js',
                        line: 606
                    }));
                    assert(_rec128._expr(_rec128._capt(this === _rec128._capt(thisArg, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(this === thisArg)',
                        filepath: 'test/Float16Array.js',
                        line: 607
                    }));
                }, thisArg);
            });
            it('find index of even value', () => {
                var _rec129 = new _PowerAssertRecorder1();
                var _rec130 = new _PowerAssertRecorder1();
                const float16_1 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                assert(_rec129._expr(_rec129._capt(_rec129._capt(_rec129._capt(float16_1, 'arguments/0/left/callee/object').findIndex(val => val % 2 === 0), 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(float16_1.findIndex(val => val % 2 === 0) === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 614
                }));
                const float16_2 = new Float16Array([
                    1,
                    3,
                    5
                ]);
                assert(_rec130._expr(_rec130._capt(_rec130._capt(_rec130._capt(float16_2, 'arguments/0/left/callee/object').findIndex(val => val % 2 === 0), 'arguments/0/left') === _rec130._capt(-1, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16_2.findIndex(val => val % 2 === 0) === -1)',
                    filepath: 'test/Float16Array.js',
                    line: 617
                }));
            });
        });
        describe('#every()', () => {
            it('property `name` is \'every\'', () => {
                var _rec131 = new _PowerAssertRecorder1();
                assert(_rec131._expr(_rec131._capt(_rec131._capt(_rec131._capt(_rec131._capt(_rec131._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').every, 'arguments/0/left/object').name, 'arguments/0/left') === 'every', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.every.name === "every")',
                    filepath: 'test/Float16Array.js',
                    line: 625
                }));
            });
            it('property `length` is 1', () => {
                var _rec132 = new _PowerAssertRecorder1();
                assert(_rec132._expr(_rec132._capt(_rec132._capt(_rec132._capt(_rec132._capt(_rec132._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').every, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.every.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 629
                }));
            });
            it('check callback arguments', () => {
                const float16 = new Float16Array([1]);
                const thisArg = {};
                float16.every(function (val, key, f16) {
                    var _rec133 = new _PowerAssertRecorder1();
                    var _rec134 = new _PowerAssertRecorder1();
                    var _rec135 = new _PowerAssertRecorder1();
                    var _rec136 = new _PowerAssertRecorder1();
                    assert(_rec133._expr(_rec133._capt(_rec133._capt(val, 'arguments/0/left') === 1, 'arguments/0'), {
                        content: 'assert(val === 1)',
                        filepath: 'test/Float16Array.js',
                        line: 638
                    }));
                    assert(_rec134._expr(_rec134._capt(_rec134._capt(key, 'arguments/0/left') === 0, 'arguments/0'), {
                        content: 'assert(key === 0)',
                        filepath: 'test/Float16Array.js',
                        line: 639
                    }));
                    assert(_rec135._expr(_rec135._capt(_rec135._capt(f16, 'arguments/0/left') === _rec135._capt(float16, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(f16 === float16)',
                        filepath: 'test/Float16Array.js',
                        line: 640
                    }));
                    assert(_rec136._expr(_rec136._capt(this === _rec136._capt(thisArg, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(this === thisArg)',
                        filepath: 'test/Float16Array.js',
                        line: 641
                    }));
                }, thisArg);
            });
            it('have all even value', () => {
                var _rec137 = new _PowerAssertRecorder1();
                var _rec138 = new _PowerAssertRecorder1();
                const float16_1 = new Float16Array([
                    2,
                    4,
                    6
                ]);
                assert(_rec137._expr(_rec137._capt(_rec137._capt(_rec137._capt(float16_1, 'arguments/0/left/callee/object').every(val => val % 2 === 0), 'arguments/0/left') === true, 'arguments/0'), {
                    content: 'assert(float16_1.every(val => val % 2 === 0) === true)',
                    filepath: 'test/Float16Array.js',
                    line: 648
                }));
                const float16_2 = new Float16Array([
                    2,
                    4,
                    7
                ]);
                assert(_rec138._expr(_rec138._capt(_rec138._capt(_rec138._capt(float16_2, 'arguments/0/left/callee/object').every(val => val % 2 === 0), 'arguments/0/left') === false, 'arguments/0'), {
                    content: 'assert(float16_2.every(val => val % 2 === 0) === false)',
                    filepath: 'test/Float16Array.js',
                    line: 651
                }));
            });
        });
        describe('#some()', () => {
            it('property `name` is \'some\'', () => {
                var _rec139 = new _PowerAssertRecorder1();
                assert(_rec139._expr(_rec139._capt(_rec139._capt(_rec139._capt(_rec139._capt(_rec139._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').some, 'arguments/0/left/object').name, 'arguments/0/left') === 'some', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.some.name === "some")',
                    filepath: 'test/Float16Array.js',
                    line: 659
                }));
            });
            it('property `length` is 1', () => {
                var _rec140 = new _PowerAssertRecorder1();
                assert(_rec140._expr(_rec140._capt(_rec140._capt(_rec140._capt(_rec140._capt(_rec140._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').some, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.some.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 663
                }));
            });
            it('check callback arguments', () => {
                const float16 = new Float16Array([1]);
                const thisArg = {};
                float16.some(function (val, key, f16) {
                    var _rec141 = new _PowerAssertRecorder1();
                    var _rec142 = new _PowerAssertRecorder1();
                    var _rec143 = new _PowerAssertRecorder1();
                    var _rec144 = new _PowerAssertRecorder1();
                    assert(_rec141._expr(_rec141._capt(_rec141._capt(val, 'arguments/0/left') === 1, 'arguments/0'), {
                        content: 'assert(val === 1)',
                        filepath: 'test/Float16Array.js',
                        line: 672
                    }));
                    assert(_rec142._expr(_rec142._capt(_rec142._capt(key, 'arguments/0/left') === 0, 'arguments/0'), {
                        content: 'assert(key === 0)',
                        filepath: 'test/Float16Array.js',
                        line: 673
                    }));
                    assert(_rec143._expr(_rec143._capt(_rec143._capt(f16, 'arguments/0/left') === _rec143._capt(float16, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(f16 === float16)',
                        filepath: 'test/Float16Array.js',
                        line: 674
                    }));
                    assert(_rec144._expr(_rec144._capt(this === _rec144._capt(thisArg, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(this === thisArg)',
                        filepath: 'test/Float16Array.js',
                        line: 675
                    }));
                }, thisArg);
            });
            it('have some even value', () => {
                var _rec145 = new _PowerAssertRecorder1();
                var _rec146 = new _PowerAssertRecorder1();
                const float16_1 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                assert(_rec145._expr(_rec145._capt(_rec145._capt(_rec145._capt(float16_1, 'arguments/0/left/callee/object').some(val => val % 2 === 0), 'arguments/0/left') === true, 'arguments/0'), {
                    content: 'assert(float16_1.some(val => val % 2 === 0) === true)',
                    filepath: 'test/Float16Array.js',
                    line: 682
                }));
                const float16_2 = new Float16Array([
                    1,
                    3,
                    5
                ]);
                assert(_rec146._expr(_rec146._capt(_rec146._capt(_rec146._capt(float16_2, 'arguments/0/left/callee/object').some(val => val % 2 === 0), 'arguments/0/left') === false, 'arguments/0'), {
                    content: 'assert(float16_2.some(val => val % 2 === 0) === false)',
                    filepath: 'test/Float16Array.js',
                    line: 685
                }));
            });
        });
        describe('#set()', () => {
            it('property `name` is \'set\'', () => {
                var _rec147 = new _PowerAssertRecorder1();
                assert(_rec147._expr(_rec147._capt(_rec147._capt(_rec147._capt(_rec147._capt(_rec147._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').set, 'arguments/0/left/object').name, 'arguments/0/left') === 'set', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.set.name === "set")',
                    filepath: 'test/Float16Array.js',
                    line: 693
                }));
            });
            it('property `length` is 1', () => {
                var _rec148 = new _PowerAssertRecorder1();
                assert(_rec148._expr(_rec148._capt(_rec148._capt(_rec148._capt(_rec148._capt(_rec148._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').set, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.set.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 697
                }));
            });
            it('set Array or TypedArray', () => {
                var _rec149 = new _PowerAssertRecorder1();
                var _rec150 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3,
                    4,
                    5
                ]);
                const array = [
                    10,
                    11
                ];
                assert(_rec149._expr(_rec149._capt(_rec149._capt(_rec149._capt(float16, 'arguments/0/left/callee/object').set(_rec149._capt(array, 'arguments/0/left/arguments/0'), 2), 'arguments/0/left') === _rec149._capt(undefined, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.set(array, 2) === undefined)',
                    filepath: 'test/Float16Array.js',
                    line: 704
                }));
                deepEqualArray(float16, [
                    1,
                    2,
                    10,
                    11,
                    5
                ]);
                const float32 = new Float32Array([
                    20,
                    21
                ]);
                assert(_rec150._expr(_rec150._capt(_rec150._capt(_rec150._capt(float16, 'arguments/0/left/callee/object').set(_rec150._capt(float32, 'arguments/0/left/arguments/0'), 1), 'arguments/0/left') === _rec150._capt(undefined, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.set(float32, 1) === undefined)',
                    filepath: 'test/Float16Array.js',
                    line: 709
                }));
                deepEqualArray(float16, [
                    1,
                    20,
                    21,
                    11,
                    5
                ]);
            });
            it('set ArrayLike', () => {
                var _rec151 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3,
                    4,
                    5
                ]);
                const arrayLike = {
                    0: 10,
                    1: 11,
                    length: 2
                };
                assert(_rec151._expr(_rec151._capt(_rec151._capt(_rec151._capt(float16, 'arguments/0/left/callee/object').set(_rec151._capt(arrayLike, 'arguments/0/left/arguments/0'), 2), 'arguments/0/left') === _rec151._capt(undefined, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.set(arrayLike, 2) === undefined)',
                    filepath: 'test/Float16Array.js',
                    line: 717
                }));
                deepEqualArray(float16, [
                    1,
                    2,
                    10,
                    11,
                    5
                ]);
            });
            it('set Itetator', () => {
                var _rec152 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3,
                    4,
                    5
                ]);
                const iterator = [
                    10,
                    11
                ][Symbol.iterator]();
                assert(_rec152._expr(_rec152._capt(_rec152._capt(_rec152._capt(float16, 'arguments/0/left/callee/object').set(_rec152._capt(iterator, 'arguments/0/left/arguments/0'), 2), 'arguments/0/left') === _rec152._capt(undefined, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.set(iterator, 2) === undefined)',
                    filepath: 'test/Float16Array.js',
                    line: 725
                }));
                deepEqualArray(float16, [
                    1,
                    2,
                    10,
                    11,
                    5
                ]);
            });
            it('set myself (Float16Array)', () => {
                var _rec153 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3,
                    4,
                    5
                ]);
                const array = [
                    10,
                    11
                ];
                assert(_rec153._expr(_rec153._capt(_rec153._capt(_rec153._capt(float16, 'arguments/0/left/callee/object').set(_rec153._capt(new Float16Array(_rec153._capt(array, 'arguments/0/left/arguments/0/arguments/0')), 'arguments/0/left/arguments/0'), 2), 'arguments/0/left') === _rec153._capt(undefined, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.set(new Float16Array(array), 2) === undefined)',
                    filepath: 'test/Float16Array.js',
                    line: 733
                }));
                deepEqualArray(float16, [
                    1,
                    2,
                    10,
                    11,
                    5
                ]);
            });
            it('check out of Range', () => {
                const float16 = new Float16Array([
                    1,
                    2,
                    3,
                    4,
                    5
                ]);
                const array = [
                    10,
                    11
                ];
                assert.throws(() => float16.set(array, -1), Error);
                assert.throws(() => float16.set(array, 4), Error);
            });
        });
        describe('#reverse()', () => {
            it('property `name` is \'reverse\'', () => {
                var _rec154 = new _PowerAssertRecorder1();
                assert(_rec154._expr(_rec154._capt(_rec154._capt(_rec154._capt(_rec154._capt(_rec154._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').reverse, 'arguments/0/left/object').name, 'arguments/0/left') === 'reverse', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.reverse.name === "reverse")',
                    filepath: 'test/Float16Array.js',
                    line: 750
                }));
            });
            it('property `length` is 0', () => {
                var _rec155 = new _PowerAssertRecorder1();
                assert(_rec155._expr(_rec155._capt(_rec155._capt(_rec155._capt(_rec155._capt(_rec155._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').reverse, 'arguments/0/left/object').length, 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.reverse.length === 0)',
                    filepath: 'test/Float16Array.js',
                    line: 754
                }));
            });
            it('reverse', () => {
                var _rec156 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                assert(_rec156._expr(_rec156._capt(_rec156._capt(_rec156._capt(float16, 'arguments/0/left/callee/object').reverse(), 'arguments/0/left') === _rec156._capt(float16, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.reverse() === float16)',
                    filepath: 'test/Float16Array.js',
                    line: 760
                }));
                deepEqualArray(float16, [
                    3,
                    2,
                    1
                ]);
            });
        });
        describe('#fill()', () => {
            it('property `name` is \'fill\'', () => {
                var _rec157 = new _PowerAssertRecorder1();
                assert(_rec157._expr(_rec157._capt(_rec157._capt(_rec157._capt(_rec157._capt(_rec157._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').fill, 'arguments/0/left/object').name, 'arguments/0/left') === 'fill', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.fill.name === "fill")',
                    filepath: 'test/Float16Array.js',
                    line: 769
                }));
            });
            it('property `length` is 1', () => {
                var _rec158 = new _PowerAssertRecorder1();
                assert(_rec158._expr(_rec158._capt(_rec158._capt(_rec158._capt(_rec158._capt(_rec158._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').fill, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.fill.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 773
                }));
            });
            it('fill', () => {
                var _rec159 = new _PowerAssertRecorder1();
                const float16 = new Float16Array(5);
                assert(_rec159._expr(_rec159._capt(_rec159._capt(_rec159._capt(float16, 'arguments/0/left/callee/object').fill(1, 1, 4), 'arguments/0/left') === _rec159._capt(float16, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.fill(1, 1, 4) === float16)',
                    filepath: 'test/Float16Array.js',
                    line: 779
                }));
                deepEqualArray(float16, [
                    0,
                    1,
                    1,
                    1,
                    0
                ]);
            });
        });
        describe('#copyWithin()', () => {
            it('property `name` is \'copyWithin\'', () => {
                var _rec160 = new _PowerAssertRecorder1();
                assert(_rec160._expr(_rec160._capt(_rec160._capt(_rec160._capt(_rec160._capt(_rec160._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').copyWithin, 'arguments/0/left/object').name, 'arguments/0/left') === 'copyWithin', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.copyWithin.name === "copyWithin")',
                    filepath: 'test/Float16Array.js',
                    line: 788
                }));
            });
            it('property `length` is 2', () => {
                var _rec161 = new _PowerAssertRecorder1();
                assert(_rec161._expr(_rec161._capt(_rec161._capt(_rec161._capt(_rec161._capt(_rec161._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').copyWithin, 'arguments/0/left/object').length, 'arguments/0/left') === 2, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.copyWithin.length === 2)',
                    filepath: 'test/Float16Array.js',
                    line: 792
                }));
            });
            it('copyWitnin', () => {
                var _rec162 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    0,
                    0,
                    0
                ]);
                assert(_rec162._expr(_rec162._capt(_rec162._capt(_rec162._capt(float16, 'arguments/0/left/callee/object').copyWithin(2, 0, 2), 'arguments/0/left') === _rec162._capt(float16, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.copyWithin(2, 0, 2) === float16)',
                    filepath: 'test/Float16Array.js',
                    line: 798
                }));
                deepEqualArray(float16, [
                    1,
                    2,
                    1,
                    2,
                    0
                ]);
            });
        });
        describe('#sort()', () => {
            it('property `name` is \'sort\'', () => {
                var _rec163 = new _PowerAssertRecorder1();
                assert(_rec163._expr(_rec163._capt(_rec163._capt(_rec163._capt(_rec163._capt(_rec163._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').sort, 'arguments/0/left/object').name, 'arguments/0/left') === 'sort', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.sort.name === "sort")',
                    filepath: 'test/Float16Array.js',
                    line: 807
                }));
            });
            it('property `length` is 0', () => {
                var _rec164 = new _PowerAssertRecorder1();
                assert(_rec164._expr(_rec164._capt(_rec164._capt(_rec164._capt(_rec164._capt(_rec164._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').sort, 'arguments/0/left/object').length, 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.sort.length === 0)',
                    filepath: 'test/Float16Array.js',
                    line: 811
                }));
            });
            it('check default compare', () => {
                var _rec165 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    -1,
                    -2,
                    0,
                    -0,
                    NaN,
                    Infinity,
                    -Infinity
                ]);
                assert(_rec165._expr(_rec165._capt(_rec165._capt(_rec165._capt(float16, 'arguments/0/left/callee/object').sort(), 'arguments/0/left') === _rec165._capt(float16, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.sort() === float16)',
                    filepath: 'test/Float16Array.js',
                    line: 817
                }));
                deepEqualNumberArray(float16, [
                    -Infinity,
                    -2,
                    -1,
                    -0,
                    0,
                    1,
                    2,
                    Infinity,
                    NaN
                ]);
            });
            it('check custom compare', function () {
                var _rec166 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    -1,
                    -2,
                    Infinity,
                    -Infinity
                ]);
                assert(_rec166._expr(_rec166._capt(_rec166._capt(_rec166._capt(float16, 'arguments/0/left/callee/object').sort((x, y) => x - y), 'arguments/0/left') === _rec166._capt(float16, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.sort((x, y) => x - y) === float16)',
                    filepath: 'test/Float16Array.js',
                    line: 824
                }));
                deepEqualArray(float16, [
                    -Infinity,
                    -2,
                    -1,
                    1,
                    2,
                    Infinity
                ]);
            });
        });
        describe('#slice()', () => {
            it('property `name` is \'slice\'', () => {
                var _rec167 = new _PowerAssertRecorder1();
                assert(_rec167._expr(_rec167._capt(_rec167._capt(_rec167._capt(_rec167._capt(_rec167._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').slice, 'arguments/0/left/object').name, 'arguments/0/left') === 'slice', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.slice.name === "slice")',
                    filepath: 'test/Float16Array.js',
                    line: 833
                }));
            });
            it('property `length` is 0', () => {
                var _rec168 = new _PowerAssertRecorder1();
                assert(_rec168._expr(_rec168._capt(_rec168._capt(_rec168._capt(_rec168._capt(_rec168._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').slice, 'arguments/0/left/object').length, 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.slice.length === 0)',
                    filepath: 'test/Float16Array.js',
                    line: 837
                }));
            });
            it('get slice', () => {
                var _rec169 = new _PowerAssertRecorder1();
                var _rec170 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                const sliced = float16.slice();
                assert(_rec169._expr(_rec169._capt(_rec169._capt(sliced, 'arguments/0/left') instanceof _rec169._capt(Float16Array, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(sliced instanceof Float16Array)',
                    filepath: 'test/Float16Array.js',
                    line: 844
                }));
                deepEqualArray(float16, sliced);
                assert(_rec170._expr(_rec170._capt(_rec170._capt(_rec170._capt(float16, 'arguments/0/left/object').buffer, 'arguments/0/left') !== _rec170._capt(_rec170._capt(sliced, 'arguments/0/right/object').buffer, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.buffer !== sliced.buffer)',
                    filepath: 'test/Float16Array.js',
                    line: 846
                }));
            });
            it('check sliced element & offset', () => {
                var _rec171 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3,
                    4
                ]);
                const sliced = float16.slice(1, 3);
                assert(_rec171._expr(_rec171._capt(_rec171._capt(_rec171._capt(sliced, 'arguments/0/left/object').byteOffset, 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(sliced.byteOffset === 0)',
                    filepath: 'test/Float16Array.js',
                    line: 853
                }));
                deepEqualArray(sliced, [
                    2,
                    3
                ]);
            });
        });
        describe('#subarray()', () => {
            it('property `name` is \'subarray\'', () => {
                var _rec172 = new _PowerAssertRecorder1();
                assert(_rec172._expr(_rec172._capt(_rec172._capt(_rec172._capt(_rec172._capt(_rec172._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').subarray, 'arguments/0/left/object').name, 'arguments/0/left') === 'subarray', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.subarray.name === "subarray")',
                    filepath: 'test/Float16Array.js',
                    line: 862
                }));
            });
            it('property `length` is 0', () => {
                var _rec173 = new _PowerAssertRecorder1();
                assert(_rec173._expr(_rec173._capt(_rec173._capt(_rec173._capt(_rec173._capt(_rec173._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').subarray, 'arguments/0/left/object').length, 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.subarray.length === 0)',
                    filepath: 'test/Float16Array.js',
                    line: 866
                }));
            });
            it('get subarray', () => {
                var _rec174 = new _PowerAssertRecorder1();
                var _rec175 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                const subarray = float16.subarray();
                assert(_rec174._expr(_rec174._capt(_rec174._capt(subarray, 'arguments/0/left') instanceof _rec174._capt(Float16Array, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(subarray instanceof Float16Array)',
                    filepath: 'test/Float16Array.js',
                    line: 873
                }));
                deepEqualArray(float16, subarray);
                assert(_rec175._expr(_rec175._capt(_rec175._capt(_rec175._capt(float16, 'arguments/0/left/object').buffer, 'arguments/0/left') === _rec175._capt(_rec175._capt(subarray, 'arguments/0/right/object').buffer, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.buffer === subarray.buffer)',
                    filepath: 'test/Float16Array.js',
                    line: 875
                }));
            });
            it('check subarray element & offset', () => {
                var _rec176 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3,
                    4
                ]);
                const subarray = float16.subarray(1, 3);
                assert(_rec176._expr(_rec176._capt(_rec176._capt(_rec176._capt(subarray, 'arguments/0/left/object').byteOffset, 'arguments/0/left') === 2, 'arguments/0'), {
                    content: 'assert(subarray.byteOffset === 2)',
                    filepath: 'test/Float16Array.js',
                    line: 882
                }));
                deepEqualArray(subarray, [
                    2,
                    3
                ]);
            });
        });
        describe('#indexOf()', () => {
            it('property `name` is \'indexOf\'', () => {
                var _rec177 = new _PowerAssertRecorder1();
                assert(_rec177._expr(_rec177._capt(_rec177._capt(_rec177._capt(_rec177._capt(_rec177._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').indexOf, 'arguments/0/left/object').name, 'arguments/0/left') === 'indexOf', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.indexOf.name === "indexOf")',
                    filepath: 'test/Float16Array.js',
                    line: 891
                }));
            });
            it('property `length` is 1', () => {
                var _rec178 = new _PowerAssertRecorder1();
                assert(_rec178._expr(_rec178._capt(_rec178._capt(_rec178._capt(_rec178._capt(_rec178._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').indexOf, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.indexOf.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 895
                }));
            });
            it('check indexOf', () => {
                var _rec179 = new _PowerAssertRecorder1();
                var _rec180 = new _PowerAssertRecorder1();
                var _rec181 = new _PowerAssertRecorder1();
                var _rec182 = new _PowerAssertRecorder1();
                var _rec183 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                assert(_rec179._expr(_rec179._capt(_rec179._capt(_rec179._capt(float16, 'arguments/0/left/callee/object').indexOf(1), 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(float16.indexOf(1) === 0)',
                    filepath: 'test/Float16Array.js',
                    line: 901
                }));
                assert(_rec180._expr(_rec180._capt(_rec180._capt(_rec180._capt(float16, 'arguments/0/left/callee/object').indexOf(1, 1), 'arguments/0/left') === _rec180._capt(-1, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.indexOf(1, 1) === -1)',
                    filepath: 'test/Float16Array.js',
                    line: 902
                }));
                assert(_rec181._expr(_rec181._capt(_rec181._capt(_rec181._capt(float16, 'arguments/0/left/callee/object').indexOf(2, 1), 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(float16.indexOf(2, 1) === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 903
                }));
                assert(_rec182._expr(_rec182._capt(_rec182._capt(_rec182._capt(float16, 'arguments/0/left/callee/object').indexOf(2, _rec182._capt(-1, 'arguments/0/left/arguments/1')), 'arguments/0/left') === _rec182._capt(-1, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.indexOf(2, -1) === -1)',
                    filepath: 'test/Float16Array.js',
                    line: 904
                }));
                assert(_rec183._expr(_rec183._capt(_rec183._capt(_rec183._capt(float16, 'arguments/0/left/callee/object').indexOf(2, _rec183._capt(-2, 'arguments/0/left/arguments/1')), 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(float16.indexOf(2, -2) === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 905
                }));
            });
        });
        describe('#lastIndexOf()', () => {
            it('property `name` is \'lastIndexOf\'', () => {
                var _rec184 = new _PowerAssertRecorder1();
                assert(_rec184._expr(_rec184._capt(_rec184._capt(_rec184._capt(_rec184._capt(_rec184._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').lastIndexOf, 'arguments/0/left/object').name, 'arguments/0/left') === 'lastIndexOf', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.lastIndexOf.name === "lastIndexOf")',
                    filepath: 'test/Float16Array.js',
                    line: 913
                }));
            });
            it('property `length` is 1', () => {
                var _rec185 = new _PowerAssertRecorder1();
                assert(_rec185._expr(_rec185._capt(_rec185._capt(_rec185._capt(_rec185._capt(_rec185._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').lastIndexOf, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.lastIndexOf.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 917
                }));
            });
            it('check lastIndexOf', () => {
                var _rec186 = new _PowerAssertRecorder1();
                var _rec187 = new _PowerAssertRecorder1();
                var _rec188 = new _PowerAssertRecorder1();
                var _rec189 = new _PowerAssertRecorder1();
                var _rec190 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                assert(_rec186._expr(_rec186._capt(_rec186._capt(_rec186._capt(float16, 'arguments/0/left/callee/object').lastIndexOf(1), 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(float16.lastIndexOf(1) === 0)',
                    filepath: 'test/Float16Array.js',
                    line: 923
                }));
                assert(_rec187._expr(_rec187._capt(_rec187._capt(_rec187._capt(float16, 'arguments/0/left/callee/object').lastIndexOf(3, 1), 'arguments/0/left') === _rec187._capt(-1, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.lastIndexOf(3, 1) === -1)',
                    filepath: 'test/Float16Array.js',
                    line: 924
                }));
                assert(_rec188._expr(_rec188._capt(_rec188._capt(_rec188._capt(float16, 'arguments/0/left/callee/object').lastIndexOf(2, 1), 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(float16.lastIndexOf(2, 1) === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 925
                }));
                assert(_rec189._expr(_rec189._capt(_rec189._capt(_rec189._capt(float16, 'arguments/0/left/callee/object').lastIndexOf(2, _rec189._capt(-3, 'arguments/0/left/arguments/1')), 'arguments/0/left') === _rec189._capt(-1, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.lastIndexOf(2, -3) === -1)',
                    filepath: 'test/Float16Array.js',
                    line: 926
                }));
                assert(_rec190._expr(_rec190._capt(_rec190._capt(_rec190._capt(float16, 'arguments/0/left/callee/object').lastIndexOf(2, _rec190._capt(-2, 'arguments/0/left/arguments/1')), 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(float16.lastIndexOf(2, -2) === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 927
                }));
            });
        });
        describe('#includes()', () => {
            it('property `name` is \'includes\'', () => {
                var _rec191 = new _PowerAssertRecorder1();
                assert(_rec191._expr(_rec191._capt(_rec191._capt(_rec191._capt(_rec191._capt(_rec191._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').includes, 'arguments/0/left/object').name, 'arguments/0/left') === 'includes', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.includes.name === "includes")',
                    filepath: 'test/Float16Array.js',
                    line: 935
                }));
            });
            it('property `length` is 1', () => {
                var _rec192 = new _PowerAssertRecorder1();
                assert(_rec192._expr(_rec192._capt(_rec192._capt(_rec192._capt(_rec192._capt(_rec192._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').includes, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.includes.length === 1)',
                    filepath: 'test/Float16Array.js',
                    line: 939
                }));
            });
            it('check includes', () => {
                var _rec193 = new _PowerAssertRecorder1();
                var _rec194 = new _PowerAssertRecorder1();
                var _rec195 = new _PowerAssertRecorder1();
                var _rec196 = new _PowerAssertRecorder1();
                var _rec197 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                assert(_rec193._expr(_rec193._capt(_rec193._capt(_rec193._capt(float16, 'arguments/0/left/callee/object').includes(1), 'arguments/0/left') === true, 'arguments/0'), {
                    content: 'assert(float16.includes(1) === true)',
                    filepath: 'test/Float16Array.js',
                    line: 945
                }));
                assert(_rec194._expr(_rec194._capt(_rec194._capt(_rec194._capt(float16, 'arguments/0/left/callee/object').includes(1, 1), 'arguments/0/left') === false, 'arguments/0'), {
                    content: 'assert(float16.includes(1, 1) === false)',
                    filepath: 'test/Float16Array.js',
                    line: 946
                }));
                assert(_rec195._expr(_rec195._capt(_rec195._capt(_rec195._capt(float16, 'arguments/0/left/callee/object').includes(2, 1), 'arguments/0/left') === true, 'arguments/0'), {
                    content: 'assert(float16.includes(2, 1) === true)',
                    filepath: 'test/Float16Array.js',
                    line: 947
                }));
                assert(_rec196._expr(_rec196._capt(_rec196._capt(_rec196._capt(float16, 'arguments/0/left/callee/object').includes(2, _rec196._capt(-1, 'arguments/0/left/arguments/1')), 'arguments/0/left') === false, 'arguments/0'), {
                    content: 'assert(float16.includes(2, -1) === false)',
                    filepath: 'test/Float16Array.js',
                    line: 948
                }));
                assert(_rec197._expr(_rec197._capt(_rec197._capt(_rec197._capt(float16, 'arguments/0/left/callee/object').includes(2, _rec197._capt(-2, 'arguments/0/left/arguments/1')), 'arguments/0/left') === true, 'arguments/0'), {
                    content: 'assert(float16.includes(2, -2) === true)',
                    filepath: 'test/Float16Array.js',
                    line: 949
                }));
            });
        });
        describe('#join()', () => {
            it('property `name` is \'join\'', () => {
                var _rec198 = new _PowerAssertRecorder1();
                assert(_rec198._expr(_rec198._capt(_rec198._capt(_rec198._capt(_rec198._capt(_rec198._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').join, 'arguments/0/left/object').name, 'arguments/0/left') === 'join', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.join.name === "join")',
                    filepath: 'test/Float16Array.js',
                    line: 957
                }));
            });
            it('property `length` is 0', () => {
                var _rec199 = new _PowerAssertRecorder1();
                assert(_rec199._expr(_rec199._capt(_rec199._capt(_rec199._capt(_rec199._capt(_rec199._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').join, 'arguments/0/left/object').length, 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.join.length === 0)',
                    filepath: 'test/Float16Array.js',
                    line: 961
                }));
            });
            it('check join', () => {
                var _rec200 = new _PowerAssertRecorder1();
                var _rec201 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                assert(_rec200._expr(_rec200._capt(_rec200._capt(_rec200._capt(float16, 'arguments/0/left/callee/object').join(), 'arguments/0/left') === '1,2,3', 'arguments/0'), {
                    content: 'assert(float16.join() === "1,2,3")',
                    filepath: 'test/Float16Array.js',
                    line: 967
                }));
                assert(_rec201._expr(_rec201._capt(_rec201._capt(_rec201._capt(float16, 'arguments/0/left/callee/object').join('|'), 'arguments/0/left') === '1|2|3', 'arguments/0'), {
                    content: 'assert(float16.join("|") === "1|2|3")',
                    filepath: 'test/Float16Array.js',
                    line: 968
                }));
            });
        });
        describe('#toLocaleString()', () => {
            it('property `name` is \'toLocaleString\'', () => {
                var _rec202 = new _PowerAssertRecorder1();
                assert(_rec202._expr(_rec202._capt(_rec202._capt(_rec202._capt(_rec202._capt(_rec202._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').toLocaleString, 'arguments/0/left/object').name, 'arguments/0/left') === 'toLocaleString', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.toLocaleString.name === "toLocaleString")',
                    filepath: 'test/Float16Array.js',
                    line: 976
                }));
            });
            it('property `length` is 0', () => {
                var _rec203 = new _PowerAssertRecorder1();
                assert(_rec203._expr(_rec203._capt(_rec203._capt(_rec203._capt(_rec203._capt(_rec203._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').toLocaleString, 'arguments/0/left/object').length, 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.toLocaleString.length === 0)',
                    filepath: 'test/Float16Array.js',
                    line: 980
                }));
            });
            it('same as Array', () => {
                var _rec204 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                assert(_rec204._expr(_rec204._capt(_rec204._capt(_rec204._capt(float16, 'arguments/0/left/callee/object').toLocaleString(), 'arguments/0/left') === _rec204._capt(_rec204._capt([
                    1,
                    2,
                    3
                ], 'arguments/0/right/callee/object').toLocaleString(), 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(float16.toLocaleString() === [1,2,3].toLocaleString())',
                    filepath: 'test/Float16Array.js',
                    line: 985
                }));
            });
        });
        describe('#toString()', () => {
            it('property `name` is \'toString\'', () => {
                var _rec205 = new _PowerAssertRecorder1();
                assert(_rec205._expr(_rec205._capt(_rec205._capt(_rec205._capt(_rec205._capt(_rec205._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').toString, 'arguments/0/left/object').name, 'arguments/0/left') === 'toString', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.toString.name === "toString")',
                    filepath: 'test/Float16Array.js',
                    line: 993
                }));
            });
            it('property `length` is 0', () => {
                var _rec206 = new _PowerAssertRecorder1();
                assert(_rec206._expr(_rec206._capt(_rec206._capt(_rec206._capt(_rec206._capt(_rec206._capt(Float16Array, 'arguments/0/left/object/object/object').prototype, 'arguments/0/left/object/object').toString, 'arguments/0/left/object').length, 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.toString.length === 0)',
                    filepath: 'test/Float16Array.js',
                    line: 997
                }));
            });
            it('check toString', () => {
                var _rec207 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                assert(_rec207._expr(_rec207._capt(_rec207._capt(_rec207._capt(float16, 'arguments/0/left/callee/object').toString(), 'arguments/0/left') === '1,2,3', 'arguments/0'), {
                    content: 'assert(float16.toString() === "1,2,3")',
                    filepath: 'test/Float16Array.js',
                    line: 1002
                }));
            });
            it('call Array#toString by Float16Array', () => {
                var _rec208 = new _PowerAssertRecorder1();
                const float16 = new Float16Array([
                    1,
                    2,
                    3
                ]);
                assert(_rec208._expr(_rec208._capt(_rec208._capt(_rec208._capt(_rec208._capt(_rec208._capt(Array, 'arguments/0/left/callee/object/object/object').prototype, 'arguments/0/left/callee/object/object').toString, 'arguments/0/left/callee/object').call(_rec208._capt(float16, 'arguments/0/left/arguments/0')), 'arguments/0/left') === '1,2,3', 'arguments/0'), {
                    content: 'assert(Array.prototype.toString.call(float16) === "1,2,3")',
                    filepath: 'test/Float16Array.js',
                    line: 1007
                }));
            });
            it('call Float16Array#toString by Array', () => {
                var _rec209 = new _PowerAssertRecorder1();
                const array = [
                    1,
                    2,
                    3
                ];
                assert(_rec209._expr(_rec209._capt(_rec209._capt(_rec209._capt(_rec209._capt(_rec209._capt(Float16Array, 'arguments/0/left/callee/object/object/object').prototype, 'arguments/0/left/callee/object/object').toString, 'arguments/0/left/callee/object').call(_rec209._capt(array, 'arguments/0/left/arguments/0')), 'arguments/0/left') === '1,2,3', 'arguments/0'), {
                    content: 'assert(Float16Array.prototype.toString.call(array) === "1,2,3")',
                    filepath: 'test/Float16Array.js',
                    line: 1012
                }));
            });
        });
    });
}());
//# sourceMappingURL=Float16Array.power.js.map

