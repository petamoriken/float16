import { ToInteger } from "./spec";


export { default as isArrayBuffer } from "lodash-es/isArrayBuffer";

export function isDataView(view) {
    return view instanceof DataView;
}

export function isStringNumberKey(key) {
    return typeof key === "string" && key === ToInteger(key) + "";
}