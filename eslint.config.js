import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
// https://github.com/solidjs-community/eslint-plugin-solid/issues/146
import solid from "eslint-plugin-solid/configs/typescript.js";

export default [
  {
    files: ["**/*.{ts,tsx}"],
    ...solid,
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
