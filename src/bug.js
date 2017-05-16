// JavaScriptCore bug: https://bugs.webkit.org/show_bug.cgi?id=171606
export const isTypedArrayIndexedPropertyWritable = Object.getOwnPropertyDescriptor(new Uint8Array(1), 0).writable;

// Chakra bug: https://github.com/Microsoft/ChakraCore/issues/1662
const proxy = new Proxy({}, {});
export const isProxyEnableToBeWeakMapKey = new WeakMap().set(proxy, 1).get(proxy) === 1;