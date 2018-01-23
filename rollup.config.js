import loadPlugins from "rollup-load-plugins";

const $ = loadPlugins();

const banner =
`<%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> License - <%= pkg.homepage %>
generated at <%= moment().format('YYYY-MM-DD HH:mm Z') %>

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
            presets: [["env", {
                targets: {
                    browsers: [
                        "last 2 Firefox major versions",
                        "last 2 Chrome major versions",
                        "last 2 Edge major versions",
                        "last 2 Safari major versions",
                        "Firefox ESR"
                    ]
                },
                modules: false,
                exclude: ["transform-regenerator"]
            }]]
        }),
        $.license({ banner })
    ]
};