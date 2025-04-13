import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["**/node_modules/**", "dist/**"],
  },
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    languageOptions: {
      globals: globals.node,
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      // import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules, // Disables conflicting rules
      // "@typescript-eslint/no-unsafe-argument": "warn",
      "prettier/prettier": ["warn", {}, { usePrettierrc: true }], // Uses .prettierrc
      "no-console": ["warn", { allow: ["warn", "error"] }], // Your custom rules
      "no-param-reassign": "off",
      "no-unused-vars": "warn",
      "no-underscore-dangle": "off", // Allows underscores in variable names
      radix: "off",
      "func-names": "off",
      "consistent-return": "off",
      "object-shorthand": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
