import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import solid from "eslint-plugin-solid/configs/typescript";

export default [
  {
    files: ["**/*.{ts,tsx}"],
    ...solid,
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
