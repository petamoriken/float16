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
describe('f16round()', () => {
    const maxFloat16 = 65504;
    const minFloat16 = 2 ** -24;
    it('property `name` is \'f16round\'', () => {
        var _rec1 = new _PowerAssertRecorder1();
        assert(_rec1._expr(_rec1._capt(_rec1._capt(_rec1._capt(f16round, 'arguments/0/left/object').name, 'arguments/0/left') === 'f16round', 'arguments/0'), {
            content: 'assert(f16round.name === "f16round")',
            filepath: 'test/f16round.js',
            line: 6
        }));
    });
    it('property `length` is 1', () => {
        var _rec2 = new _PowerAssertRecorder1();
        assert(_rec2._expr(_rec2._capt(_rec2._capt(_rec2._capt(f16round, 'arguments/0/left/object').length, 'arguments/0/left') === 1, 'arguments/0'), {
            content: 'assert(f16round.length === 1)',
            filepath: 'test/f16round.js',
            line: 10
        }));
    });
    it('return NaN when value is empty or undefined or NaN', () => {
        var _rec3 = new _PowerAssertRecorder1();
        var _rec4 = new _PowerAssertRecorder1();
        var _rec5 = new _PowerAssertRecorder1();
        assert(_rec3._expr(_rec3._capt(_rec3._capt(Number, 'arguments/0/callee/object').isNaN(_rec3._capt(f16round(), 'arguments/0/arguments/0')), 'arguments/0'), {
            content: 'assert(Number.isNaN(f16round()))',
            filepath: 'test/f16round.js',
            line: 14
        }));
        assert(_rec4._expr(_rec4._capt(_rec4._capt(Number, 'arguments/0/callee/object').isNaN(_rec4._capt(f16round(_rec4._capt(undefined, 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0')), 'arguments/0'), {
            content: 'assert(Number.isNaN(f16round(undefined)))',
            filepath: 'test/f16round.js',
            line: 15
        }));
        assert(_rec5._expr(_rec5._capt(_rec5._capt(Number, 'arguments/0/callee/object').isNaN(_rec5._capt(f16round(_rec5._capt(NaN, 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0')), 'arguments/0'), {
            content: 'assert(Number.isNaN(f16round(NaN)))',
            filepath: 'test/f16round.js',
            line: 16
        }));
    });
    it('return 0 when value is 0 or null', () => {
        var _rec6 = new _PowerAssertRecorder1();
        var _rec7 = new _PowerAssertRecorder1();
        assert(_rec6._expr(_rec6._capt(_rec6._capt(Object, 'arguments/0/callee/object').is(_rec6._capt(f16round(0), 'arguments/0/arguments/0'), 0), 'arguments/0'), {
            content: 'assert(Object.is(f16round(0), 0))',
            filepath: 'test/f16round.js',
            line: 20
        }));
        assert(_rec7._expr(_rec7._capt(_rec7._capt(Object, 'arguments/0/callee/object').is(_rec7._capt(f16round(null), 'arguments/0/arguments/0'), 0), 'arguments/0'), {
            content: 'assert(Object.is(f16round(null), 0))',
            filepath: 'test/f16round.js',
            line: 21
        }));
    });
    it('return -0 when value is -0', () => {
        var _rec8 = new _PowerAssertRecorder1();
        assert(_rec8._expr(_rec8._capt(_rec8._capt(Object, 'arguments/0/callee/object').is(_rec8._capt(f16round(_rec8._capt(-0, 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0'), _rec8._capt(-0, 'arguments/0/arguments/1')), 'arguments/0'), {
            content: 'assert(Object.is(f16round(-0), -0))',
            filepath: 'test/f16round.js',
            line: 25
        }));
    });
    it('return \xB1Infinity when value is \xB1Infinity', () => {
        var _rec9 = new _PowerAssertRecorder1();
        var _rec10 = new _PowerAssertRecorder1();
        assert(_rec9._expr(_rec9._capt(_rec9._capt(f16round(_rec9._capt(Infinity, 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec9._capt(Infinity, 'arguments/0/right'), 'arguments/0'), {
            content: 'assert(f16round(Infinity) === Infinity)',
            filepath: 'test/f16round.js',
            line: 29
        }));
        assert(_rec10._expr(_rec10._capt(_rec10._capt(f16round(_rec10._capt(-_rec10._capt(Infinity, 'arguments/0/left/arguments/0/argument'), 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec10._capt(-_rec10._capt(Infinity, 'arguments/0/right/argument'), 'arguments/0/right'), 'arguments/0'), {
            content: 'assert(f16round(-Infinity) === -Infinity)',
            filepath: 'test/f16round.js',
            line: 30
        }));
    });
    it('return \xB1Infinity when value is \xB1Number.MAX_VALUE', () => {
        var _rec11 = new _PowerAssertRecorder1();
        var _rec12 = new _PowerAssertRecorder1();
        assert(_rec11._expr(_rec11._capt(_rec11._capt(f16round(_rec11._capt(_rec11._capt(Number, 'arguments/0/left/arguments/0/object').MAX_VALUE, 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec11._capt(Infinity, 'arguments/0/right'), 'arguments/0'), {
            content: 'assert(f16round(Number.MAX_VALUE) === Infinity)',
            filepath: 'test/f16round.js',
            line: 34
        }));
        assert(_rec12._expr(_rec12._capt(_rec12._capt(f16round(_rec12._capt(-_rec12._capt(_rec12._capt(Number, 'arguments/0/left/arguments/0/argument/object').MAX_VALUE, 'arguments/0/left/arguments/0/argument'), 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec12._capt(-_rec12._capt(Infinity, 'arguments/0/right/argument'), 'arguments/0/right'), 'arguments/0'), {
            content: 'assert(f16round(-Number.MAX_VALUE) === -Infinity)',
            filepath: 'test/f16round.js',
            line: 35
        }));
    });
    it('return \xB10 when value is \xB1Number.MIN_VALUE', () => {
        var _rec13 = new _PowerAssertRecorder1();
        var _rec14 = new _PowerAssertRecorder1();
        assert(_rec13._expr(_rec13._capt(_rec13._capt(Object, 'arguments/0/callee/object').is(_rec13._capt(f16round(_rec13._capt(_rec13._capt(Number, 'arguments/0/arguments/0/arguments/0/object').MIN_VALUE, 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0'), 0), 'arguments/0'), {
            content: 'assert(Object.is(f16round(Number.MIN_VALUE), 0))',
            filepath: 'test/f16round.js',
            line: 39
        }));
        assert(_rec14._expr(_rec14._capt(_rec14._capt(Object, 'arguments/0/callee/object').is(_rec14._capt(f16round(_rec14._capt(-_rec14._capt(_rec14._capt(Number, 'arguments/0/arguments/0/arguments/0/argument/object').MIN_VALUE, 'arguments/0/arguments/0/arguments/0/argument'), 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0'), _rec14._capt(-0, 'arguments/0/arguments/1')), 'arguments/0'), {
            content: 'assert(Object.is(f16round(-Number.MIN_VALUE), -0))',
            filepath: 'test/f16round.js',
            line: 40
        }));
    });
    it('return same value when value is \xB1float16 max/min value', () => {
        var _rec15 = new _PowerAssertRecorder1();
        var _rec16 = new _PowerAssertRecorder1();
        var _rec17 = new _PowerAssertRecorder1();
        var _rec18 = new _PowerAssertRecorder1();
        assert(_rec15._expr(_rec15._capt(_rec15._capt(f16round(_rec15._capt(maxFloat16, 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec15._capt(maxFloat16, 'arguments/0/right'), 'arguments/0'), {
            content: 'assert(f16round(maxFloat16) === maxFloat16)',
            filepath: 'test/f16round.js',
            line: 44
        }));
        assert(_rec16._expr(_rec16._capt(_rec16._capt(f16round(_rec16._capt(-_rec16._capt(maxFloat16, 'arguments/0/left/arguments/0/argument'), 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec16._capt(-_rec16._capt(maxFloat16, 'arguments/0/right/argument'), 'arguments/0/right'), 'arguments/0'), {
            content: 'assert(f16round(-maxFloat16) === -maxFloat16)',
            filepath: 'test/f16round.js',
            line: 45
        }));
        assert(_rec17._expr(_rec17._capt(_rec17._capt(f16round(_rec17._capt(minFloat16, 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec17._capt(minFloat16, 'arguments/0/right'), 'arguments/0'), {
            content: 'assert(f16round(minFloat16) === minFloat16)',
            filepath: 'test/f16round.js',
            line: 46
        }));
        assert(_rec18._expr(_rec18._capt(_rec18._capt(f16round(_rec18._capt(-_rec18._capt(minFloat16, 'arguments/0/left/arguments/0/argument'), 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec18._capt(-_rec18._capt(minFloat16, 'arguments/0/right/argument'), 'arguments/0/right'), 'arguments/0'), {
            content: 'assert(f16round(-minFloat16) === -minFloat16)',
            filepath: 'test/f16round.js',
            line: 47
        }));
    });
    it('return 0 when value is \xB1float16 min value / 2', () => {
        var _rec19 = new _PowerAssertRecorder1();
        var _rec20 = new _PowerAssertRecorder1();
        assert(_rec19._expr(_rec19._capt(_rec19._capt(Object, 'arguments/0/callee/object').is(_rec19._capt(f16round(_rec19._capt(_rec19._capt(minFloat16, 'arguments/0/arguments/0/arguments/0/left') / 2, 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0'), 0), 'arguments/0'), {
            content: 'assert(Object.is(f16round(minFloat16 / 2), 0))',
            filepath: 'test/f16round.js',
            line: 51
        }));
        assert(_rec20._expr(_rec20._capt(_rec20._capt(Object, 'arguments/0/callee/object').is(_rec20._capt(f16round(_rec20._capt(_rec20._capt(-_rec20._capt(minFloat16, 'arguments/0/arguments/0/arguments/0/left/argument'), 'arguments/0/arguments/0/arguments/0/left') / 2, 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0'), _rec20._capt(-0, 'arguments/0/arguments/1')), 'arguments/0'), {
            content: 'assert(Object.is(f16round(-minFloat16 / 2), -0))',
            filepath: 'test/f16round.js',
            line: 52
        }));
    });
    it('return \xB1float16 min value when value is \xB1float16 min value / 2 \xB1 a bit number', () => {
        var _rec21 = new _PowerAssertRecorder1();
        var _rec22 = new _PowerAssertRecorder1();
        assert(_rec21._expr(_rec21._capt(_rec21._capt(f16round(2.980232238769532e-8), 'arguments/0/left') === _rec21._capt(minFloat16, 'arguments/0/right'), 'arguments/0'), {
            content: 'assert(f16round(2.980232238769531911744490042422139897126953655970282852649688720703125e-8) === minFloat16)',
            filepath: 'test/f16round.js',
            line: 56
        }));
        assert(_rec22._expr(_rec22._capt(_rec22._capt(f16round(_rec22._capt(-2.980232238769532e-8, 'arguments/0/left/arguments/0')), 'arguments/0/left') === _rec22._capt(-_rec22._capt(minFloat16, 'arguments/0/right/argument'), 'arguments/0/right'), 'arguments/0'), {
            content: 'assert(f16round(-2.980232238769531911744490042422139897126953655970282852649688720703125e-8) === -minFloat16)',
            filepath: 'test/f16round.js',
            line: 57
        }));
    });
    it('return 1.3369140625 when value is 1.337', () => {
        var _rec23 = new _PowerAssertRecorder1();
        assert(_rec23._expr(_rec23._capt(_rec23._capt(f16round(1.337), 'arguments/0/left') === 1.3369140625, 'arguments/0'), {
            content: 'assert(f16round(1.337) === 1.3369140625)',
            filepath: 'test/f16round.js',
            line: 61
        }));
    });
    it('throw TypeError when value is bigint', function () {
        assert.throws(() => {
            f16round(BigInt(0));
        }, TypeError);
    });
});
//# sourceMappingURL=f16round.power.js.map

