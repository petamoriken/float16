import { execSync } from "child_process";
import babel from "@rollup/plugin-babel";

const name = process.env.npm_package_name;
const version = process.env.NPM_VERSION_SCRIPT === "1" ? `v${ process.env.npm_package_version }` : execSync("git describe").toString().trim();
const license = process.env.npm_package_license;
const homepage = process.env.npm_package_homepage;

const banner = `/*! ${ name } ${ version } | ${ license } License - ${ homepage } */\n`;

export default {
    input: "src/index.mjs",
    output: [{
        file: "browser/float16.js",
        format: "iife",
        name: "float16",
        banner,
    }, {
        file: "browser/float16.mjs",
        format: "es",
        banner,
    }],
    plugins: [
        babel({
            babelrc: false,
            presets: ["@babel/preset-env"],
            babelHelpers: "bundled",
        }),
    ],
};
