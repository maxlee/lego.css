import { defineConfig } from "vite";
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        UnoCSS({
            configFile: "./uno.config.js",
        }),
    ],
    base: "./",
    build: {
       target: "modules",
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: "./index.html",
                layout: "layout/index.html",
            },
        },
    },
});
