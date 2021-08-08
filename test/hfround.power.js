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
    const maxFloat16 = 65504;
    const minFloat16 = 2 ** -24;
    describe('hfround()', () => {
        it('property `name` is \'hfround\'', () => {
            var _rec1 = new _PowerAssertRecorder1();
            assert(_rec1._expr(_rec1._capt(_rec1._capt(_rec1._capt(hfround, 'arguments/0/left/object').name, 'arguments/0/left') === 'hfround', 'arguments/0'), {
                content: 'assert(hfround.name === "hfround")',
                filepath: 'test/hfround.js',
                line: 12
            }));
        });
        it('property `length` is 1', () => {
            var _rec2 = new _PowerAssertRecorder1();
            assert(_rec2._expr(_rec2._capt(_rec2._capt(_rec2._capt(hfround, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
                content: 'assert(hfround.length === 1)',
                filepath: 'test/hfround.js',
                line: 16
            }));
        });
        it('return NaN when value is empty or undefined or NaN', () => {
            var _rec3 = new _PowerAssertRecorder1();
            var _rec4 = new _PowerAssertRecorder1();
            var _rec5 = new _PowerAssertRecorder1();
            assert(_rec3._expr(_rec3._capt(_rec3._capt(Number, 'arguments/0/callee/object').isNaN(_rec3._capt(hfround(), 'arguments/0/arguments/0')), 'arguments/0'), {
                content: 'assert(Number.isNaN(hfround()))',
                filepath: 'test/hfround.js',
                line: 20
            }));
            assert(_rec4._expr(_rec4._capt(_rec4._capt(Number, 'arguments/0/callee/object').isNaN(_rec4._capt(hfround(_rec4._capt(undefined, 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0')), 'arguments/0'), {
                content: 'assert(Number.isNaN(hfround(undefined)))',
                filepath: 'test/hfround.js',
                line: 21
            }));
            assert(_rec5._expr(_rec5._capt(_rec5._capt(Number, 'arguments/0/callee/object').isNaN(_rec5._capt(hfround(_rec5._capt(NaN, 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0')), 'arguments/0'), {
                content: 'assert(Number.isNaN(hfround(NaN)))',
                filepath: 'test/hfround.js',
                line: 22
            }));
        });
        it('return 0 when value is 0 or null', () => {
            var _rec6 = new _PowerAssertRecorder1();
            var _rec7 = new _PowerAssertRecorder1();
            assert(_rec6._expr(_rec6._capt(_rec6._capt(Object, 'arguments/0/callee/object').is(_rec6._capt(hfround(0), 'arguments/0/arguments/0'), 0), 'arguments/0'), {
                content: 'assert(Object.is(hfround(0), 0))',
                filepath: 'test/hfround.js',
                line: 26
            }));
            assert(_rec7._expr(_rec7._capt(_rec7._capt(Object, 'arguments/0/callee/object').is(_rec7._capt(hfround(null), 'arguments/0/arguments/0'), 0), 'arguments/0'), {
                content: 'assert(Object.is(hfround(null), 0))',
                filepath: 'test/hfround.js',
                line: 27
            }));
        });
        it('return -0 when value is -0', () => {
            var _rec8 = new _PowerAssertRecorder1();
            assert(_rec8._expr(_rec8._capt(_rec8._capt(Object, 'arguments/0/callee/object').is(_rec8._capt(hfround(_rec8._capt(-0, 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0'), _rec8._capt(-0, 'arguments/0/arguments/1')), 'arguments/0'), {
                content: 'assert(Object.is(hfround(-0), -0))',
                filepath: 'test/hfround.js',
                line: 31
            }));
        });
        it('return \xB1Infinity when value is \xB1Infinity', () => {
            var _rec9 = new _PowerAssertRecorder1();
            var _rec10 = new _PowerAssertRecorder1();
            assert(_rec9._expr(_rec9._capt(_rec9._capt(hfround(_rec9._capt(Infinity, 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec9._capt(Infinity, 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(hfround(Infinity) === Infinity)',
                filepath: 'test/hfround.js',
                line: 35
            }));
            assert(_rec10._expr(_rec10._capt(_rec10._capt(hfround(_rec10._capt(-_rec10._capt(Infinity, 'arguments/0/left/arguments/0/argument'), 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec10._capt(-_rec10._capt(Infinity, 'arguments/0/right/argument'), 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(hfround(-Infinity) === -Infinity)',
                filepath: 'test/hfround.js',
                line: 36
            }));
        });
        it('return \xB1Infinity when value is \xB1Number.MAX_VALUE', () => {
            var _rec11 = new _PowerAssertRecorder1();
            var _rec12 = new _PowerAssertRecorder1();
            assert(_rec11._expr(_rec11._capt(_rec11._capt(hfround(_rec11._capt(_rec11._capt(Number, 'arguments/0/left/arguments/0/object').MAX_VALUE, 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec11._capt(Infinity, 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(hfround(Number.MAX_VALUE) === Infinity)',
                filepath: 'test/hfround.js',
                line: 40
            }));
            assert(_rec12._expr(_rec12._capt(_rec12._capt(hfround(_rec12._capt(-_rec12._capt(_rec12._capt(Number, 'arguments/0/left/arguments/0/argument/object').MAX_VALUE, 'arguments/0/left/arguments/0/argument'), 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec12._capt(-_rec12._capt(Infinity, 'arguments/0/right/argument'), 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(hfround(-Number.MAX_VALUE) === -Infinity)',
                filepath: 'test/hfround.js',
                line: 41
            }));
        });
        it('return \xB10 when value is \xB1Number.MIN_VALUE', () => {
            var _rec13 = new _PowerAssertRecorder1();
            var _rec14 = new _PowerAssertRecorder1();
            assert(_rec13._expr(_rec13._capt(_rec13._capt(Object, 'arguments/0/callee/object').is(_rec13._capt(hfround(_rec13._capt(_rec13._capt(Number, 'arguments/0/arguments/0/arguments/0/object').MIN_VALUE, 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0'), 0), 'arguments/0'), {
                content: 'assert(Object.is(hfround(Number.MIN_VALUE), 0))',
                filepath: 'test/hfround.js',
                line: 45
            }));
            assert(_rec14._expr(_rec14._capt(_rec14._capt(Object, 'arguments/0/callee/object').is(_rec14._capt(hfround(_rec14._capt(-_rec14._capt(_rec14._capt(Number, 'arguments/0/arguments/0/arguments/0/argument/object').MIN_VALUE, 'arguments/0/arguments/0/arguments/0/argument'), 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0'), _rec14._capt(-0, 'arguments/0/arguments/1')), 'arguments/0'), {
                content: 'assert(Object.is(hfround(-Number.MIN_VALUE), -0))',
                filepath: 'test/hfround.js',
                line: 46
            }));
        });
        it('return same value when value is \xB1float16 max/min value', () => {
            var _rec15 = new _PowerAssertRecorder1();
            var _rec16 = new _PowerAssertRecorder1();
            var _rec17 = new _PowerAssertRecorder1();
            var _rec18 = new _PowerAssertRecorder1();
            assert(_rec15._expr(_rec15._capt(_rec15._capt(hfround(_rec15._capt(maxFloat16, 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec15._capt(maxFloat16, 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(hfround(maxFloat16) === maxFloat16)',
                filepath: 'test/hfround.js',
                line: 50
            }));
            assert(_rec16._expr(_rec16._capt(_rec16._capt(hfround(_rec16._capt(-_rec16._capt(maxFloat16, 'arguments/0/left/arguments/0/argument'), 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec16._capt(-_rec16._capt(maxFloat16, 'arguments/0/right/argument'), 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(hfround(-maxFloat16) === -maxFloat16)',
                filepath: 'test/hfround.js',
                line: 51
            }));
            assert(_rec17._expr(_rec17._capt(_rec17._capt(hfround(_rec17._capt(minFloat16, 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec17._capt(minFloat16, 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(hfround(minFloat16) === minFloat16)',
                filepath: 'test/hfround.js',
                line: 52
            }));
            assert(_rec18._expr(_rec18._capt(_rec18._capt(hfround(_rec18._capt(-_rec18._capt(minFloat16, 'arguments/0/left/arguments/0/argument'), 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec18._capt(-_rec18._capt(minFloat16, 'arguments/0/right/argument'), 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(hfround(-minFloat16) === -minFloat16)',
                filepath: 'test/hfround.js',
                line: 53
            }));
        });
        it('return same value when value is float16 max value + a bit number', () => {
            var _rec19 = new _PowerAssertRecorder1();
            assert(_rec19._expr(_rec19._capt(_rec19._capt(hfround(_rec19._capt(_rec19._capt(maxFloat16, 'arguments/0/left/arguments/0/left') + _rec19._capt(2 ** _rec19._capt(_rec19._capt(_rec19._capt(_rec19._capt(2 ** _rec19._capt(5 - 1, 'arguments/0/left/arguments/0/right/right/left/left/left/right'), 'arguments/0/left/arguments/0/right/right/left/left/left') - 1, 'arguments/0/left/arguments/0/right/right/left/left') - 10, 'arguments/0/left/arguments/0/right/right/left') - 2, 'arguments/0/left/arguments/0/right/right'), 'arguments/0/left/arguments/0/right'), 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec19._capt(maxFloat16, 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(hfround(maxFloat16 + 2 ** (2 ** (5 - 1) - 1 - 10 - 2)) === maxFloat16)',
                filepath: 'test/hfround.js',
                line: 57
            }));
        });
        it('return 0 when value is \xB1float16 min value / 2', () => {
            var _rec20 = new _PowerAssertRecorder1();
            var _rec21 = new _PowerAssertRecorder1();
            assert(_rec20._expr(_rec20._capt(_rec20._capt(Object, 'arguments/0/callee/object').is(_rec20._capt(hfround(_rec20._capt(_rec20._capt(minFloat16, 'arguments/0/arguments/0/arguments/0/left') / 2, 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0'), 0), 'arguments/0'), {
                content: 'assert(Object.is(hfround(minFloat16 / 2), 0))',
                filepath: 'test/hfround.js',
                line: 61
            }));
            assert(_rec21._expr(_rec21._capt(_rec21._capt(Object, 'arguments/0/callee/object').is(_rec21._capt(hfround(_rec21._capt(_rec21._capt(-_rec21._capt(minFloat16, 'arguments/0/arguments/0/arguments/0/left/argument'), 'arguments/0/arguments/0/arguments/0/left') / 2, 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0'), _rec21._capt(-0, 'arguments/0/arguments/1')), 'arguments/0'), {
                content: 'assert(Object.is(hfround(-minFloat16 / 2), -0))',
                filepath: 'test/hfround.js',
                line: 62
            }));
        });
        it('return \xB1float16 min value when value is \xB1float16 min value / 2 \xB1 a bit number', () => {
            var _rec22 = new _PowerAssertRecorder1();
            var _rec23 = new _PowerAssertRecorder1();
            assert(_rec22._expr(_rec22._capt(_rec22._capt(hfround(_rec22._capt(_rec22._capt(_rec22._capt(minFloat16, 'arguments/0/left/arguments/0/left/left') / 2, 'arguments/0/left/arguments/0/left') + _rec22._capt(2 ** _rec22._capt(-25, 'arguments/0/left/arguments/0/right/right'), 'arguments/0/left/arguments/0/right'), 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec22._capt(minFloat16, 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(hfround(minFloat16 / 2 + 2 ** -25) === minFloat16)',
                filepath: 'test/hfround.js',
                line: 66
            }));
            assert(_rec23._expr(_rec23._capt(_rec23._capt(hfround(_rec23._capt(_rec23._capt(_rec23._capt(-_rec23._capt(minFloat16, 'arguments/0/left/arguments/0/left/left/argument'), 'arguments/0/left/arguments/0/left/left') / 2, 'arguments/0/left/arguments/0/left') - _rec23._capt(2 ** _rec23._capt(-25, 'arguments/0/left/arguments/0/right/right'), 'arguments/0/left/arguments/0/right'), 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec23._capt(-_rec23._capt(minFloat16, 'arguments/0/right/argument'), 'arguments/0/right'), 'arguments/0'), {
                content: 'assert(hfround(-minFloat16 / 2 - 2 ** -25) === -minFloat16)',
                filepath: 'test/hfround.js',
                line: 67
            }));
        });
        it('return 1.3369140625 when value is 1.337', () => {
            var _rec24 = new _PowerAssertRecorder1();
            assert(_rec24._expr(_rec24._capt(_rec24._capt(hfround(1.337), 'arguments/0/left') === 1.3369140625, 'arguments/0'), {
                content: 'assert(hfround(1.337) === 1.3369140625)',
                filepath: 'test/hfround.js',
                line: 71
            }));
        });
    });
}());
//# sourceMappingURL=hfround.power.js.map

