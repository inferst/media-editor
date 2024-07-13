import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import solidSvg from "vite-plugin-solid-svg";
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [
    solid(),
    solidSvg({
      defaultAsComponent: true,
    }),
    eslint(),
  ],
});
