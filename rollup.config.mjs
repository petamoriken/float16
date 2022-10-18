import { execSync } from "child_process";
import cleanup from "rollup-plugin-cleanup";

const name = process.env.npm_package_name;
const version = process.env.NPM_VERSION_SCRIPT === "1"
  ? `v${process.env.npm_package_version}`
  : execSync("git describe").toString().trim();
const license = process.env.npm_package_license;
const homepage = process.env.npm_package_homepage;
const banner = `/*! ${name} ${version} | ${license} License - ${homepage} */\n`;

const test = process.env.NODE_ENV === "test";

/** @type {import("rollup").RollupOptions} */
export default ({
  input: "src/index.mjs",
  output: [{
    file: "browser/float16.js",
    format: "iife",
    name: "float16",
    generatedCode: "es2015",
    banner,
    sourcemap: test ? "inline" : false,
  }, {
    file: "browser/float16.mjs",
    format: "es",
    generatedCode: "es2015",
    banner,
    sourcemap: test ? "inline" : false,
  }],
  plugins: [
    cleanup(),
  ],
});
