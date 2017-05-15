# float16

half precision floating point for JavaScript

[![license](https://img.shields.io/npm/l/@petamoriken/float16.svg?style=flat-square)](https://github.com/petamoriken/float16/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/petamoriken/float16.svg?style=flat-square)](https://github.com/petamoriken/float16/issues)
[![npm](https://img.shields.io/npm/v/@petamoriken/float16.svg?style=flat-square)](https://www.npmjs.com/package/@petamoriken/float16)
[![npm downloads](https://img.shields.io/npm/dt/@petamoriken/float16.svg?style=flat-square)](https://www.npmjs.com/package/@petamoriken/float16)  
[![Travis](https://img.shields.io/travis/petamoriken/float16.svg?style=flat-square)](https://travis-ci.org/petamoriken/float16)
[![dependencies Status](https://david-dm.org/petamoriken/float16/status.svg?style=flat-square)](https://david-dm.org/petamoriken/float16)
[![devDependencies Status](https://david-dm.org/petamoriken/float16/dev-status.svg?style=flat-square)](https://david-dm.org/petamoriken/float16?type=dev)



## Supports (at least)

Last 2 versions of modern browser (Chrome, Firefox) and latest version of default browser on Windows 10 or macOS (Edge, Safari) and Node latest.  

* Chrome: Last 2 versions
* Firefox: Last 2 versions and ESR
* Edge: Latest version
* Safari: Latest version
* Node.js: Latest version

This library's `Float16Array` uses `Proxy`, so IE11 is never supported.

## Install

```bash
yarn add @petamoriken/float16
```

or

```bash
npm install @petamoriken/float16 --save
```

## Require

```js
// ES6 Modules
import { Float16Array, getFloat16, setFloat16, hfround } from "@petamoriken/float16";
```

or

```js
// CommonJS
const { Float16Array, getFloat16, setFloat16, hfround } = require("@petamoriken/float16");
```

## API

* `Float16Array`

    This API is similar to `TypedArray` such as `Float32Array`.

    ```js
    let float16 = new Float16Array([1.0, 1.1, 1.2]);
    for(const val of float16) {
        console.log(val); // => 1, 1.099609375, 1.19921875
    }

    float16.reduce((prev, current) => prev + current); // 3.298828125
    ```

* `getFloat16(view: DataView, byteOffset: number [, littleEndian: boolean])`
* `setFloat16(view: DataView, byteOffset: number, value: number [, littleEndian: boolean])`

    These APIs are similar to `DataView` methods such as `DataView#getFloat32` and `DataView#setFloat32`.

    ```js
    let buffer = new ArrayBuffer(10);
    let view = new DataView(buffer);

    view.setUint16(0, 0x1234);
    getFloat16(view, 0); // 0.0007572174072265625

    // You can append to DataView instance
    view.getFloat16 = getFloat16.bind(null, view);
    view.setFloat16 = setFloat16.bind(null, view);

    view.getFloat16(0); // 0.0007572174072265625

    view.setFloat16(0, Math.PI, true);
    view.getFloat16(0, true); // 3.140625
    ```

* `hfround(x: number)`

    This API is similar to `Math.fround` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround)).  
    This function returns nearest half precision float representation of a number.

    ```js
    Math.fround(1.337); // 1.3370000123977661
    hfround(1.337); // 1.3369140625
    ```