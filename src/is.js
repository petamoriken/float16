import { ToInteger } from "./spec";


export { default as isArrayBuffer } from "lodash-es/isArrayBuffer";
export { default as isArrayLike } from "lodash-es/isArrayLike";

export function isDataView(view) {
    return view instanceof DataView;
}

export function isNumberKey(key) {
    return typeof key === "string" && key === ToInteger(key) + "";
}