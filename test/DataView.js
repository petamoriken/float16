describe("additional DataView methods", () => {
  const data = [
    [0b0000000000000000, 0],
    [0b1000000000000000, -0],
    [0b0011110000000000, 1],
    [0b1011110000000000, -1],
    [0b0100001001001000, 3.140625],
    [0b0000001000000000, 0.000030517578125],
    [0b0111101111111111, 65504],
    [0b1111101111111111, -65504],
    [0b0000000000000001, 2 ** -24],
    [0b1000000000000001, -(2 ** -24)],
    [0b0111111000000000, NaN],
    [0b0111110000000000, Infinity],
    [0b1111110000000000, -Infinity],
  ];

  const buffer = new ArrayBuffer(2);
  const dataView = new DataView(buffer);

  function clear() {
    new Uint16Array(buffer)[0] = 0;
  }

  /** @type {DataViewConstructor} */
  let AnotherRealmDataView;

  before(async function () {
    if (typeof window !== "undefined") {
      const iframe = document.getElementById("realm");
      if (iframe.contentDocument.readyState !== "complete") {
        await new Promise((resolve) => {
          iframe.addEventListener("load", () => {
            resolve();
          }, { once: true });
        });
      }
      AnotherRealmDataView = iframe.contentWindow.DataView;
    } else if (
      typeof global !== "undefined" && typeof require !== "undefined"
    ) {
      AnotherRealmDataView = require("vm").runInNewContext("DataView");
    } else {
      throw new Error("Unexpected environment");
    }
  });

  describe("getFloat16()", () => {
    beforeEach(clear);

    it("property `name` is 'getFloat16'", () => {
      assert(getFloat16.name === "getFloat16");
    });

    it("property `length` is 2", () => {
      assert(getFloat16.length === 2);
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

    it("get values", () => {
      for (const [float16bits, value] of data) {
        dataView.setUint16(0, float16bits);
        assert(Object.is(getFloat16(dataView, 0), value));

        dataView.setUint16(0, float16bits, true);
        assert(Object.is(getFloat16(dataView, 0, true), value));
      }
    });

    it("get another NaN", () => {
      const float16bits = 0b1111111000000000;

      dataView.setUint16(0, float16bits);
      assert(Number.isNaN(getFloat16(dataView, 0)));

      dataView.setUint16(0, float16bits, true);
      assert(Number.isNaN(getFloat16(dataView, 0, true)));
    });

    it("work with DataView from anothor realm", () => {
      assert.doesNotThrow(() =>
        getFloat16(new AnotherRealmDataView(buffer), 0)
      );
    });

    it("check modified Array.prototype [@@iterator]", () => {
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

  describe("setFloat16()", () => {
    beforeEach(clear);

    it("property `name` is 'setFloat16'", () => {
      assert(setFloat16.name === "setFloat16");
    });

    it("property `length` is 3", () => {
      assert(setFloat16.length === 3);
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

    it("set values", () => {
      for (const [float16bits, value] of data) {
        setFloat16(dataView, 0, value);
        assert(Object.is(dataView.getUint16(0), float16bits));

        setFloat16(dataView, 0, value, true);
        assert(Object.is(dataView.getUint16(0, true), float16bits));
      }
    });

    it("work with DataView from anothor realm", () => {
      assert.doesNotThrow(() =>
        setFloat16(new AnotherRealmDataView(buffer), 0, 0)
      );
    });

    it("check modified Array.prototype [@@iterator]", () => {
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
