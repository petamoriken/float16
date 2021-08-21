/* eslint-env mocha */
/* global assert getFloat16 setFloat16 */

describe("additional DataView methods", () => {

    const buffer = new ArrayBuffer(2);
    const dataView = new DataView(buffer);

    function clear() {
        new Uint16Array(buffer)[0] = 0;
    }

    /** @type {DataView} */
    let realmDataView;

    before(() => {
        if (typeof require !== "undefined") {
            realmDataView = require("vm").runInNewContext(`
                const buffer = new ArrayBuffer(2);
                new DataView(buffer);
            `);
        } else {
            const iframe = document.createElement("iframe");
            iframe.height = iframe.width = 0;
            document.body.appendChild(iframe);

            const iframeDocument = iframe.contentDocument;
            iframeDocument.write(`<script>
                const buffer = new ArrayBuffer(2);
                window.realmDataView = new DataView(buffer);
            </script>`);
            realmDataView = iframe.contentWindow.realmDataView;

            iframeDocument.close();
        }
    });

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
            assert.doesNotThrow(() => getFloat16(realmDataView, 0));
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
            assert.doesNotThrow(() => setFloat16(realmDataView, 0, 0));
        });

    });

});
