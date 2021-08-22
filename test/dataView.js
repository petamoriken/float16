/* eslint-env mocha, browser, node */
/* global assert getFloat16 setFloat16 */

describe("additional DataView methods", () => {

    const buffer = new ArrayBuffer(2);
    const dataView = new DataView(buffer);

    function clear() {
        new Uint16Array(buffer)[0] = 0;
    }

    /** @type {DataViewConstructor} */
    let AnotherRealmDataView;

    if (typeof window !== "undefined") {
        const iframe = document.createElement("iframe");
        iframe.height = iframe.width = 0;
        document.body.appendChild(iframe);
        AnotherRealmDataView = iframe.contentWindow.DataView;
        iframe.remove();
    } else if (typeof global !== "undefined" && typeof require !== "undefined") {
        AnotherRealmDataView = require("vm").runInNewContext("DataView");
    } else {
        throw new Error("Unexpected environment.");
    }

    describe("getFloat16()", () => {

        beforeEach( clear );

        it("property `name` is 'getFloat16'", () => {
            assert( getFloat16.name === "getFloat16" );
        });

        it("property `length` is 2", () => {
            assert( getFloat16.length === 2 );
        });

        it("first argument must be DataView instance", () => {
            assert.doesNotThrow(() => getFloat16(dataView, 0));

            assert.throws(() => getFloat16(null, 0), TypeError);
            assert.throws(() => getFloat16(3.14, 0), TypeError);
            assert.throws(() => getFloat16("test", 0), TypeError);
            assert.throws(() => getFloat16({}, 0), TypeError);
            assert.throws(() => getFloat16([], 0), TypeError);
            assert.throws(() => getFloat16(() => {}, 0), TypeError);
        });

        it("get 0.0007572174072265625 by big/little endian", () => {
            dataView.setUint16(0, 0x1234);
            assert( getFloat16(dataView, 0) === 0.0007572174072265625 );

            dataView.setUint16(0, 0x1234, true);
            assert( getFloat16(dataView, 0, true) === 0.0007572174072265625 );
        });

        it("work with DataView from anothor realm", () => {
            assert.doesNotThrow(() => getFloat16(new AnotherRealmDataView(buffer), 0));
        });

    });

    describe("setFloat16()", () => {

        beforeEach( clear );

        it("property `name` is 'setFloat16'", () => {
            assert( setFloat16.name === "setFloat16" );
        });

        it("property `length` is 3", () => {
            assert( setFloat16.length === 3 );
        });

        it("first argument must be DataView instance", () => {
            assert.doesNotThrow(() => setFloat16(dataView, 0, 0));

            assert.throws(() => setFloat16(null, 0, 0), TypeError);
            assert.throws(() => setFloat16(3.14, 0, 0), TypeError);
            assert.throws(() => setFloat16("test", 0, 0), TypeError);
            assert.throws(() => setFloat16({}, 0, 0), TypeError);
            assert.throws(() => setFloat16([], 0, 0), TypeError);
            assert.throws(() => setFloat16(() => {}, 0, 0), TypeError);
        });

        it("set 0.0007572174072265625 by big/little endian", () => {
            setFloat16(dataView, 0, 0.0007572174072265625);
            assert( dataView.getUint16(0) === 0x1234 );

            setFloat16(dataView, 0, 0.0007572174072265625, true);
            assert( dataView.getUint16(0, true) === 0x1234 );
        });

        it("work with DataView from anothor realm", () => {
            assert.doesNotThrow(() => setFloat16(new AnotherRealmDataView(buffer), 0, 0));
        });

    });

});
