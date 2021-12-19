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
describe('isTypedArray', () => {
    let AnotherRealmFloat16Array;
    before(async function () {
        if (typeof window !== 'undefined') {
            const iframe = document.getElementById('realm');
            const iWindow = iframe.contentWindow;
            const iDocument = iframe.contentDocument;
            let success = false;
            if (iDocument.readyState !== 'complete' || iDocument.getElementById('float16') === null) {
                try {
                    await new Promise((resolve, reject) => {
                        const id = setTimeout(() => reject(new Error('Timeout Error')), 10000);
                        iframe.addEventListener('load', () => {
                            clearTimeout(id);
                            resolve();
                        }, { once: true });
                    });
                    success = true;
                } catch (e) {
                    console.error(e);
                }
            } else {
                success = true;
            }
            if (success) {
                AnotherRealmFloat16Array = iWindow.float16.Float16Array;
            }
        }
    });
    it('property `name` is \'isTypedArray\'', () => {
        var _rec1 = new _PowerAssertRecorder1();
        assert(_rec1._expr(_rec1._capt(_rec1._capt(_rec1._capt(isTypedArray, 'arguments/0/left/object').name, 'arguments/0/left') === 'isTypedArray', 'arguments/0'), {
            content: 'assert(isTypedArray.name === "isTypedArray")',
            filepath: 'test/isTypedArray.js',
            line: 42
        }));
    });
    it('property `length` is 1', () => {
        var _rec2 = new _PowerAssertRecorder1();
        assert(_rec2._expr(_rec2._capt(_rec2._capt(_rec2._capt(isTypedArray, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
            content: 'assert(isTypedArray.length === 1)',
            filepath: 'test/isTypedArray.js',
            line: 46
        }));
    });
    it('check if Float16Array', () => {
        var _rec3 = new _PowerAssertRecorder1();
        var _rec4 = new _PowerAssertRecorder1();
        var _rec5 = new _PowerAssertRecorder1();
        var _rec6 = new _PowerAssertRecorder1();
        var _rec7 = new _PowerAssertRecorder1();
        var _rec8 = new _PowerAssertRecorder1();
        var _rec9 = new _PowerAssertRecorder1();
        var _rec10 = new _PowerAssertRecorder1();
        var _rec11 = new _PowerAssertRecorder1();
        var _rec12 = new _PowerAssertRecorder1();
        var _rec13 = new _PowerAssertRecorder1();
        var _rec14 = new _PowerAssertRecorder1();
        var _rec15 = new _PowerAssertRecorder1();
        var _rec16 = new _PowerAssertRecorder1();
        var _rec17 = new _PowerAssertRecorder1();
        var _rec18 = new _PowerAssertRecorder1();
        var _rec19 = new _PowerAssertRecorder1();
        var _rec20 = new _PowerAssertRecorder1();
        var _rec21 = new _PowerAssertRecorder1();
        var _rec22 = new _PowerAssertRecorder1();
        var _rec23 = new _PowerAssertRecorder1();
        assert(_rec3._expr(_rec3._capt(_rec3._capt(isTypedArray(_rec3._capt(new Float16Array(), 'arguments/0/left/arguments/0')), 'arguments/0/left') === true, 'arguments/0'), {
            content: 'assert(isTypedArray(new Float16Array()) === true)',
            filepath: 'test/isTypedArray.js',
            line: 50
        }));
        assert(_rec4._expr(_rec4._capt(_rec4._capt(isTypedArray(_rec4._capt(new Float32Array(), 'arguments/0/left/arguments/0')), 'arguments/0/left') === true, 'arguments/0'), {
            content: 'assert(isTypedArray(new Float32Array()) === true)',
            filepath: 'test/isTypedArray.js',
            line: 51
        }));
        assert(_rec5._expr(_rec5._capt(_rec5._capt(isTypedArray(_rec5._capt(new Uint16Array(), 'arguments/0/left/arguments/0')), 'arguments/0/left') === true, 'arguments/0'), {
            content: 'assert(isTypedArray(new Uint16Array()) === true)',
            filepath: 'test/isTypedArray.js',
            line: 52
        }));
        assert(_rec6._expr(_rec6._capt(_rec6._capt(isTypedArray(), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray() === false)',
            filepath: 'test/isTypedArray.js',
            line: 54
        }));
        assert(_rec7._expr(_rec7._capt(_rec7._capt(isTypedArray(null), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray(null) === false)',
            filepath: 'test/isTypedArray.js',
            line: 55
        }));
        assert(_rec8._expr(_rec8._capt(_rec8._capt(isTypedArray(_rec8._capt(undefined, 'arguments/0/left/arguments/0')), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray(undefined) === false)',
            filepath: 'test/isTypedArray.js',
            line: 56
        }));
        assert(_rec9._expr(_rec9._capt(_rec9._capt(isTypedArray(0), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray(0) === false)',
            filepath: 'test/isTypedArray.js',
            line: 57
        }));
        assert(_rec10._expr(_rec10._capt(_rec10._capt(isTypedArray(1), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray(1) === false)',
            filepath: 'test/isTypedArray.js',
            line: 58
        }));
        assert(_rec11._expr(_rec11._capt(_rec11._capt(isTypedArray(_rec11._capt(NaN, 'arguments/0/left/arguments/0')), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray(NaN) === false)',
            filepath: 'test/isTypedArray.js',
            line: 59
        }));
        assert(_rec12._expr(_rec12._capt(_rec12._capt(isTypedArray(_rec12._capt(Infinity, 'arguments/0/left/arguments/0')), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray(Infinity) === false)',
            filepath: 'test/isTypedArray.js',
            line: 60
        }));
        assert(_rec13._expr(_rec13._capt(_rec13._capt(isTypedArray(true), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray(true) === false)',
            filepath: 'test/isTypedArray.js',
            line: 61
        }));
        assert(_rec14._expr(_rec14._capt(_rec14._capt(isTypedArray(false), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray(false) === false)',
            filepath: 'test/isTypedArray.js',
            line: 62
        }));
        assert(_rec15._expr(_rec15._capt(_rec15._capt(isTypedArray(''), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray("") === false)',
            filepath: 'test/isTypedArray.js',
            line: 63
        }));
        assert(_rec16._expr(_rec16._capt(_rec16._capt(isTypedArray('foo'), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray("foo") === false)',
            filepath: 'test/isTypedArray.js',
            line: 64
        }));
        assert(_rec17._expr(_rec17._capt(_rec17._capt(isTypedArray(_rec17._capt(Symbol(), 'arguments/0/left/arguments/0')), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray(Symbol()) === false)',
            filepath: 'test/isTypedArray.js',
            line: 65
        }));
        if (typeof BigInt !== 'undefined') {
            assert(_rec18._expr(_rec18._capt(_rec18._capt(isTypedArray(_rec18._capt(BigInt(0), 'arguments/0/left/arguments/0')), 'arguments/0/left') === false, 'arguments/0'), {
                content: 'assert(isTypedArray(BigInt(0)) === false)',
                filepath: 'test/isTypedArray.js',
                line: 69
            }));
            assert(_rec19._expr(_rec19._capt(_rec19._capt(isTypedArray(_rec19._capt(BigInt(1), 'arguments/0/left/arguments/0')), 'arguments/0/left') === false, 'arguments/0'), {
                content: 'assert(isTypedArray(BigInt(1)) === false)',
                filepath: 'test/isTypedArray.js',
                line: 70
            }));
        }
        assert(_rec20._expr(_rec20._capt(_rec20._capt(isTypedArray(_rec20._capt({}, 'arguments/0/left/arguments/0')), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray({}) === false)',
            filepath: 'test/isTypedArray.js',
            line: 73
        }));
        assert(_rec21._expr(_rec21._capt(_rec21._capt(isTypedArray(_rec21._capt([], 'arguments/0/left/arguments/0')), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray([]) === false)',
            filepath: 'test/isTypedArray.js',
            line: 74
        }));
        assert(_rec22._expr(_rec22._capt(_rec22._capt(isTypedArray(/a/), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray(/a/) === false)',
            filepath: 'test/isTypedArray.js',
            line: 75
        }));
        assert(_rec23._expr(_rec23._capt(_rec23._capt(isTypedArray(() => {
        }), 'arguments/0/left') === false, 'arguments/0'), {
            content: 'assert(isTypedArray(() => {}) === false)',
            filepath: 'test/isTypedArray.js',
            line: 76
        }));
    });
    it('check if Float16Array from another realm', function () {
        var _rec24 = new _PowerAssertRecorder1();
        if (AnotherRealmFloat16Array === undefined) {
            this.skip();
        }
        assert(_rec24._expr(_rec24._capt(_rec24._capt(isTypedArray(_rec24._capt(new AnotherRealmFloat16Array(), 'arguments/0/left/arguments/0')), 'arguments/0/left') === true, 'arguments/0'), {
            content: 'assert(isTypedArray(new AnotherRealmFloat16Array()) === true)',
            filepath: 'test/isTypedArray.js',
            line: 84
        }));
    });
});
//# sourceMappingURL=isTypedArray.power.js.map

