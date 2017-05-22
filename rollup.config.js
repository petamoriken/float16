import nodeResolve from "rollup-plugin-node-resolve";
import license from "rollup-plugin-license";

const banner =
`<%= pkg.name %> <%= pkg.version %> - https://github.com/petamoriken/float16
generated at <%= moment().format('YYYY-MM-DD HH:mm Z') %>

---<% _.forEach(dependencies, function (dependency) { %>
  <%= dependency.name %> <%= dependency.version %>
<% }) %>`;

export default {
    entry: "src/index.js",
    dest: "browser/float16.js",
    plugins: [
        nodeResolve({ browser: true }),
        license({ banner })
    ],
    moduleName: "float16",
    format: "iife"
};