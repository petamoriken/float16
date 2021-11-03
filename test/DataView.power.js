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
describe('additional DataView methods', () => {
    const data = [
        [
            0,
            0
        ],
        [
            32768,
            -0
        ],
        [
            15360,
            1
        ],
        [
            48128,
            -1
        ],
        [
            16968,
            3.140625
        ],
        [
            512,
            0.000030517578125
        ],
        [
            31743,
            65504
        ],
        [
            64511,
            -65504
        ],
        [
            1,
            2 ** -24
        ],
        [
            32769,
            -(2 ** -24)
        ],
        [
            32256,
            NaN
        ],
        [
            31744,
            Infinity
        ],
        [
            64512,
            -Infinity
        ]
    ];
    const buffer = new ArrayBuffer(2);
    const dataView = new DataView(buffer);
    function clear() {
        new Uint16Array(buffer)[0] = 0;
    }
    let AnotherRealmDataView;
    before(async function () {
        if (typeof window !== 'undefined') {
            const iframe = document.getElementById('realm');
            if (iframe.contentDocument.readyState !== 'complete') {
                await new Promise(resolve => {
                    iframe.addEventListener('load', () => {
                        resolve();
                    }, { once: true });
                });
            }
            AnotherRealmDataView = iframe.contentWindow.DataView;
        } else if (typeof global !== 'undefined' && typeof require !== 'undefined') {
            AnotherRealmDataView = require('vm').runInNewContext('DataView');
        } else {
            throw new Error('Unexpected environment');
        }
    });
    describe('getFloat16()', () => {
        beforeEach(clear);
        it('property `name` is \'getFloat16\'', () => {
            var _rec1 = new _PowerAssertRecorder1();
            assert(_rec1._expr(_rec1._capt(_rec1._capt(_rec1._capt(getFloat16, 'arguments/0/left/object').name, 'arguments/0/left') === 'getFloat16', 'arguments/0'), {
                content: 'assert(getFloat16.name === "getFloat16")',
                filepath: 'test/DataView.js',
                line: 52
            }));
        });
        it('property `length` is 2', () => {
            var _rec2 = new _PowerAssertRecorder1();
            assert(_rec2._expr(_rec2._capt(_rec2._capt(_rec2._capt(getFloat16, 'arguments/0/left/object').length, 'arguments/0/left') === 2, 'arguments/0'), {
                content: 'assert(getFloat16.length === 2)',
                filepath: 'test/DataView.js',
                line: 56
            }));
        });
        it('first argument must be DataView instance', () => {
            assert.doesNotThrow(() => getFloat16(dataView, 0));
            assert.throws(() => getFloat16(null, 0), TypeError);
            assert.throws(() => getFloat16(3.14, 0), TypeError);
            assert.throws(() => getFloat16('test', 0), TypeError);
            assert.throws(() => getFloat16({}, 0), TypeError);
            assert.throws(() => getFloat16([], 0), TypeError);
            assert.throws(() => getFloat16(() => {
            }, 0), TypeError);
        });
        it('get values', () => {
            var _rec3 = new _PowerAssertRecorder1();
            var _rec4 = new _PowerAssertRecorder1();
            for (const [float16bits, value] of data) {
                dataView.setUint16(0, float16bits);
                assert(_rec3._expr(_rec3._capt(_rec3._capt(Object, 'arguments/0/callee/object').is(_rec3._capt(getFloat16(_rec3._capt(dataView, 'arguments/0/arguments/0/arguments/0'), 0), 'arguments/0/arguments/0'), _rec3._capt(value, 'arguments/0/arguments/1')), 'arguments/0'), {
                    content: 'assert(Object.is(getFloat16(dataView, 0), value))',
                    filepath: 'test/DataView.js',
                    line: 73
                }));
                dataView.setUint16(0, float16bits, true);
                assert(_rec4._expr(_rec4._capt(_rec4._capt(Object, 'arguments/0/callee/object').is(_rec4._capt(getFloat16(_rec4._capt(dataView, 'arguments/0/arguments/0/arguments/0'), 0, true), 'arguments/0/arguments/0'), _rec4._capt(value, 'arguments/0/arguments/1')), 'arguments/0'), {
                    content: 'assert(Object.is(getFloat16(dataView, 0, true), value))',
                    filepath: 'test/DataView.js',
                    line: 76
                }));
            }
        });
        it('get another NaN', () => {
            var _rec5 = new _PowerAssertRecorder1();
            var _rec6 = new _PowerAssertRecorder1();
            const float16bits = 65024;
            dataView.setUint16(0, float16bits);
            assert(_rec5._expr(_rec5._capt(_rec5._capt(Number, 'arguments/0/callee/object').isNaN(_rec5._capt(getFloat16(_rec5._capt(dataView, 'arguments/0/arguments/0/arguments/0'), 0), 'arguments/0/arguments/0')), 'arguments/0'), {
                content: 'assert(Number.isNaN(getFloat16(dataView, 0)))',
                filepath: 'test/DataView.js',
                line: 84
            }));
            dataView.setUint16(0, float16bits, true);
            assert(_rec6._expr(_rec6._capt(_rec6._capt(Number, 'arguments/0/callee/object').isNaN(_rec6._capt(getFloat16(_rec6._capt(dataView, 'arguments/0/arguments/0/arguments/0'), 0, true), 'arguments/0/arguments/0')), 'arguments/0'), {
                content: 'assert(Number.isNaN(getFloat16(dataView, 0, true)))',
                filepath: 'test/DataView.js',
                line: 87
            }));
        });
        it('work with DataView from anothor realm', () => {
            assert.doesNotThrow(() => getFloat16(new AnotherRealmDataView(buffer), 0));
        });
        it('check modified Array.prototype [@@iterator]', () => {
            const original = Array.prototype[Symbol.iterator];
            try {
                Array.prototype[Symbol.iterator] = function () {
                    return original.call(this);
                };
                assert.doesNotThrow(() => getFloat16(dataView, 0));
            } finally {
                Array.prototype[Symbol.iterator] = original;
            }
        });
    });
    describe('setFloat16()', () => {
        beforeEach(clear);
        it('property `name` is \'setFloat16\'', () => {
            var _rec7 = new _PowerAssertRecorder1();
            assert(_rec7._expr(_rec7._capt(_rec7._capt(_rec7._capt(setFloat16, 'arguments/0/left/object').name, 'arguments/0/left') === 'setFloat16', 'arguments/0'), {
                content: 'assert(setFloat16.name === "setFloat16")',
                filepath: 'test/DataView.js',
                line: 115
            }));
        });
        it('property `length` is 3', () => {
            var _rec8 = new _PowerAssertRecorder1();
            assert(_rec8._expr(_rec8._capt(_rec8._capt(_rec8._capt(setFloat16, 'arguments/0/left/object').length, 'arguments/0/left') === 3, 'arguments/0'), {
                content: 'assert(setFloat16.length === 3)',
                filepath: 'test/DataView.js',
                line: 119
            }));
        });
        it('first argument must be DataView instance', () => {
            assert.doesNotThrow(() => setFloat16(dataView, 0, 0));
            assert.throws(() => setFloat16(null, 0, 0), TypeError);
            assert.throws(() => setFloat16(3.14, 0, 0), TypeError);
            assert.throws(() => setFloat16('test', 0, 0), TypeError);
            assert.throws(() => setFloat16({}, 0, 0), TypeError);
            assert.throws(() => setFloat16([], 0, 0), TypeError);
            assert.throws(() => setFloat16(() => {
            }, 0, 0), TypeError);
        });
        it('set values', () => {
            var _rec9 = new _PowerAssertRecorder1();
            var _rec10 = new _PowerAssertRecorder1();
            for (const [float16bits, value] of data) {
                setFloat16(dataView, 0, value);
                assert(_rec9._expr(_rec9._capt(_rec9._capt(Object, 'arguments/0/callee/object').is(_rec9._capt(_rec9._capt(dataView, 'arguments/0/arguments/0/callee/object').getUint16(0), 'arguments/0/arguments/0'), _rec9._capt(float16bits, 'arguments/0/arguments/1')), 'arguments/0'), {
                    content: 'assert(Object.is(dataView.getUint16(0), float16bits))',
                    filepath: 'test/DataView.js',
                    line: 136
                }));
                setFloat16(dataView, 0, value, true);
                assert(_rec10._expr(_rec10._capt(_rec10._capt(Object, 'arguments/0/callee/object').is(_rec10._capt(_rec10._capt(dataView, 'arguments/0/arguments/0/callee/object').getUint16(0, true), 'arguments/0/arguments/0'), _rec10._capt(float16bits, 'arguments/0/arguments/1')), 'arguments/0'), {
                    content: 'assert(Object.is(dataView.getUint16(0, true), float16bits))',
                    filepath: 'test/DataView.js',
                    line: 139
                }));
            }
        });
        it('work with DataView from anothor realm', () => {
            assert.doesNotThrow(() => setFloat16(new AnotherRealmDataView(buffer), 0, 0));
        });
        it('check modified Array.prototype [@@iterator]', () => {
            const original = Array.prototype[Symbol.iterator];
            try {
                Array.prototype[Symbol.iterator] = function () {
                    return original.call(this);
                };
                assert.doesNotThrow(() => setFloat16(dataView, 0, 0));
            } finally {
                Array.prototype[Symbol.iterator] = original;
            }
        });
    });
});
//# sourceMappingURL=DataView.power.js.map

