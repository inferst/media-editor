import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import solid from "vite-plugin-solid";
import solidSvg from "vite-plugin-solid-svg";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  plugins: [
    solid(),
    solidSvg({
      defaultAsComponent: true,
    }),
    eslint(),
    tsConfigPaths(),
  ],
});
