import { isDataView } from "./is";
import { roundToFloat16Bits, convertToNumber } from "./lib";

/**
 * returns an unsigned 16-bit float at the specified byte offset from the start of the DataView.
 * @param {DataView} dataView
 * @param {nunmber} byteOffset
 * @param {*} opts
 */
export function getFloat16(dataView, byteOffset, ...opts) {
    if(!isDataView(dataView))
        throw new TypeError("First argument to getFloat16 function must be a DataView");

    return convertToNumber( dataView.getUint16(byteOffset, ...opts) );
}

/**
 * stores an unsigned 16-bit float value at the specified byte offset from the start of the DataView.
 * @param {DataView} dataView
 * @param {number} byteOffset
 * @param {number} value
 * @param {*} opts
 */
export function setFloat16(dataView, byteOffset, value, ...opts) {
    if(!isDataView(dataView))
        throw new TypeError("First argument to setFloat16 function must be a DataView");

    dataView.setUint16(byteOffset, roundToFloat16Bits(value), ...opts);
}
