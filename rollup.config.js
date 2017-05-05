import nodeResolve from "rollup-plugin-node-resolve";

export default {
    entry: "src/index.js",
    dest: "browser/float16.js",
    plugins: [
        nodeResolve({ browser: true })
    ],
    moduleName: "float16",
    format: "iife"
};