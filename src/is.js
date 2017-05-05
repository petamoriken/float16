"use strict";

import isArrayBuffer from "lodash-es/isArrayBuffer";
import isArrayLike from "lodash-es/isArrayLike";

import { ToInteger } from "./spec";


export { isArrayBuffer, isArrayLike };

export function isDataView(view) {
    return view instanceof DataView;
}

export function isNumberKey(key) {
    return typeof key === "string" && key === ToInteger(key) + "";
}

export function isPlusZero(val) {
    return val === 0 && 1 / val === Infinity;
}