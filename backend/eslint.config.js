const eslintPluginTypeScript = require("@typescript-eslint/eslint-plugin");
const eslintParserTypeScript = require("@typescript-eslint/parser");

module.exports = [
    {
        files: ["**/*.ts"], // Apply these settings to TypeScript files
        languageOptions: {
            parser: eslintParserTypeScript,
            parserOptions: {
                ecmaVersion: "latest", // Use the latest ECMAScript standards
                sourceType: "module", // Enable ECMAScript modules
                tsconfigRootDir: "./", // Path to your project root
                project: ["./tsconfig.json"], // Path to your tsconfig.json
            },
        },
        plugins: {
            "@typescript-eslint": eslintPluginTypeScript,
        },
        rules: {

        },
    },
];
