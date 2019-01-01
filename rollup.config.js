import { execSync } from "child_process";
import loadPlugins from "rollup-load-plugins";

const $ = loadPlugins();

const gitTag = execSync("git tag -l --points-at HEAD").toString().trim();
const gitCommitHash = execSync("git rev-parse --short HEAD").toString().trim();

const banner = `<%= pkg.name %> ${ gitTag || gitCommitHash } | <%= pkg.license %> License - <%= pkg.homepage %>

@license<% _.forEach(dependencies, function (dependency) { %>
  <%= dependency.name %> v<%= dependency.version %> | <%= dependency.license %> License - <%= dependency.homepage %>
<% }) %>`;

export default {
    input: "src/index.js",
    output: {
        name: "float16",
        file: "browser/float16.js",
        format: "iife"
    },
    plugins: [
        $.nodeResolve({ browser: true }),
        $.babel({
            babelrc: false,
            presets: [["@babel/preset-env", {
                modules: false,
                exclude: ["transform-regenerator"]
            }]]
        }),
        $.license({ banner })
    ]
};