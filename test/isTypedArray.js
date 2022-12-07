describe("isTypedArray", () => {
  let AnotherRealmFloat16Array;

  before(async function () {
    if (typeof window !== "undefined") {
      const iframe = document.getElementById("realm");
      const iWindow = iframe.contentWindow;
      const iDocument = iframe.contentDocument;

      let success = false;
      if (
        iDocument.readyState !== "complete" ||
        iDocument.getElementById("float16") === null
      ) {
        try {
          await new Promise((resolve, reject) => {
            const id = setTimeout(
              () => reject(new Error("Timeout Error")),
              10000,
            );
            iframe.addEventListener("load", () => {
              clearTimeout(id);
              resolve();
            }, { once: true });
          });
          success = true;
        } catch (e) {
          // ignore error
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

  it("property `name` is 'isTypedArray'", () => {
    assert(isTypedArray.name === "isTypedArray");
  });

  it("property `length` is 1", () => {
    assert(isTypedArray.length === 1);
  });

  it("check if Float16Array", () => {
    assert(isTypedArray(new Float16Array()) === true);
    assert(isTypedArray(new Float32Array()) === true);
    assert(isTypedArray(new Uint16Array()) === true);

    assert(isTypedArray() === /* empty */ false);
    assert(isTypedArray(null) === false);
    assert(isTypedArray(undefined) === false);
    assert(isTypedArray(0) === false);
    assert(isTypedArray(1) === false);
    assert(isTypedArray(NaN) === false);
    assert(isTypedArray(Infinity) === false);
    assert(isTypedArray(true) === false);
    assert(isTypedArray(false) === false);
    assert(isTypedArray("") === false);
    assert(isTypedArray("foo") === false);
    assert(isTypedArray(Symbol()) === false);
    assert(isTypedArray(BigInt(0)) === false);
    assert(isTypedArray(BigInt(1)) === false);
    assert(isTypedArray({}) === false);
    assert(isTypedArray([]) === false);
    assert(isTypedArray(/a/) === false);
    assert(isTypedArray(() => {}) === false);
  });

  it("check if Float16Array from another realm", function () {
    if (AnotherRealmFloat16Array === undefined) {
      this.skip();
    }

    assert(isTypedArray(new AnotherRealmFloat16Array()) === true);
  });
});
