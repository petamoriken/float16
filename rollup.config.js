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
                        "last 2 versions",
                        "Firefox ESR",

                        "not IE >= 10",
                        "not IE_mob >= 10",

                        "not OperaMini all",
                        "not OperaMobile >= 12.1",

                        "not Android >= 4.4.3",
                        "not QQAndroid >= 1.2",
                        "not UCAndroid >= 11.4",

                        "not BlackBerry >= 7",
                        "not Baidu >= 7.12",
                        "not Samsung >= 4"
                    ]
                },
                modules: false,
                exclude: ["transform-regenerator"]
            }]]
        }),
        $.license({ banner })
    ],
    name: "float16"
};