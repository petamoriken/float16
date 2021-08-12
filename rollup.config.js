import { execSync } from "child_process";
import loadPlugins from "rollup-load-plugins";

const $ = loadPlugins();

const version = process.env.NPM_VERSION_SCRIPT === "1" ? `v${ process.env.npm_package_version }` :
    execSync("git describe").toString().trim();

const banner = `<%= pkg.name %> ${ version } | <%= pkg.license %> License - <%= pkg.homepage %>

@license<% _.forEach(dependencies, function (dependency) { %>
  <%= dependency.name %> v<%= dependency.version %> | <%= dependency.license %> License - <%= dependency.homepage %>
<% }) %>`;

export default {
    input: "src/index.mjs",
    output: [{
        file: "browser/float16.js",
        format: "iife",
        name: "float16",
    }, {
        file: "browser/float16.mjs",
        format: "es",
    }],
    plugins: [
        $.nodeResolve({ browser: true }),
        $.babel({
            babelrc: false,
            presets: [["@babel/preset-env", {
                modules: false,
                exclude: ["transform-regenerator"],
            }]],
        }),
        $.license({ banner }),
    ],
};
