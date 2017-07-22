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
    const buffer = new ArrayBuffer(2);
    const dataView = new DataView(buffer);
    function clear() {
        new Uint16Array(buffer)[0] = 0;
    }
    describe('additional DataView methods', () => {
        describe('getFloat16()', () => {
            beforeEach(clear);
            it('property `name` is \'getFloat16\'', () => {
                var _rec1 = new _PowerAssertRecorder1();
                assert(_rec1._expr(_rec1._capt(_rec1._capt(_rec1._capt(getFloat16, 'arguments/0/left/object').name, 'arguments/0/left') === 'getFloat16', 'arguments/0'), {
                    content: 'assert(getFloat16.name === "getFloat16")',
                    filepath: 'test/dataView.js',
                    line: 17
                }));
            });
            it('property `length` is 2', () => {
                var _rec2 = new _PowerAssertRecorder1();
                assert(_rec2._expr(_rec2._capt(_rec2._capt(_rec2._capt(getFloat16, 'arguments/0/left/object').length, 'arguments/0/left') === 2, 'arguments/0'), {
                    content: 'assert(getFloat16.length === 2)',
                    filepath: 'test/dataView.js',
                    line: 21
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
            it('get 0.0007572174072265625 by big/little endian', () => {
                var _rec3 = new _PowerAssertRecorder1();
                var _rec4 = new _PowerAssertRecorder1();
                dataView.setUint16(0, 4660);
                assert(_rec3._expr(_rec3._capt(_rec3._capt(getFloat16(_rec3._capt(dataView, 'arguments/0/left/arguments/0'), 0), 'arguments/0/left') === 0.0007572174072265625, 'arguments/0'), {
                    content: 'assert(getFloat16(dataView, 0) === 0.0007572174072265625)',
                    filepath: 'test/dataView.js',
                    line: 37
                }));
                dataView.setUint16(0, 4660, true);
                assert(_rec4._expr(_rec4._capt(_rec4._capt(getFloat16(_rec4._capt(dataView, 'arguments/0/left/arguments/0'), 0, true), 'arguments/0/left') === 0.0007572174072265625, 'arguments/0'), {
                    content: 'assert(getFloat16(dataView, 0, true) === 0.0007572174072265625)',
                    filepath: 'test/dataView.js',
                    line: 40
                }));
            });
        });
        describe('setFloat16()', () => {
            beforeEach(clear);
            it('property `name` is \'setFloat16\'', () => {
                var _rec5 = new _PowerAssertRecorder1();
                assert(_rec5._expr(_rec5._capt(_rec5._capt(_rec5._capt(setFloat16, 'arguments/0/left/object').name, 'arguments/0/left') === 'setFloat16', 'arguments/0'), {
                    content: 'assert(setFloat16.name === "setFloat16")',
                    filepath: 'test/dataView.js',
                    line: 50
                }));
            });
            it('property `length` is 3', () => {
                var _rec6 = new _PowerAssertRecorder1();
                assert(_rec6._expr(_rec6._capt(_rec6._capt(_rec6._capt(setFloat16, 'arguments/0/left/object').length, 'arguments/0/left') === 3, 'arguments/0'), {
                    content: 'assert(setFloat16.length === 3)',
                    filepath: 'test/dataView.js',
                    line: 54
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
            it('set 0.0007572174072265625 by big/little endian', () => {
                var _rec7 = new _PowerAssertRecorder1();
                var _rec8 = new _PowerAssertRecorder1();
                setFloat16(dataView, 0, 0.0007572174072265625);
                assert(_rec7._expr(_rec7._capt(_rec7._capt(_rec7._capt(dataView, 'arguments/0/left/callee/object').getUint16(0), 'arguments/0/left') === 4660, 'arguments/0'), {
                    content: 'assert(dataView.getUint16(0) === 0x1234)',
                    filepath: 'test/dataView.js',
                    line: 70
                }));
                setFloat16(dataView, 0, 0.0007572174072265625, true);
                assert(_rec8._expr(_rec8._capt(_rec8._capt(_rec8._capt(dataView, 'arguments/0/left/callee/object').getUint16(0, true), 'arguments/0/left') === 4660, 'arguments/0'), {
                    content: 'assert(dataView.getUint16(0, true) === 0x1234)',
                    filepath: 'test/dataView.js',
                    line: 73
                }));
            });
        });
    });
}());
//# sourceMappingURL=dataView.power.js.map

