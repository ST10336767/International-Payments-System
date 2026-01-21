const js = require("@eslint/js");
const globals = require("globals");
const nPlugin = require("eslint-plugin-n");

module.exports = [
{ ignores: ["node_modules/", "coverage/", "dist/", "build/", ".circleci/", "ssl/"] },

js.configs.recommended,

{
    files: ["**/*.js"],
    languageOptions: {
    ecmaVersion: 2023,
    sourceType: "commonjs",
    globals: { ...globals.node, ...globals.es2021 }
    },
    // rules: {
    // "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    // //added
    //  "import/no-unresolved": "error",
    // },
     //added
//    plugins: { import: importPlugin }, // <-- flat config format
//    rules: {
//       "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
//       "import/no-unresolved": "error", // import plugin rule
//     },
plugins: { n: nPlugin }, // register plugin
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "n/no-missing-require": "error" // ✅ catch require typos
    },
},

{
    files: ["test/**/*.test.js", "**/__tests__/**/*.js"],
    languageOptions: {
    globals: { ...globals.jest }
    }
}
];