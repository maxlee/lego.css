import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";

function restartOnJSChange() {
    return {
        name: "restart-on-js-change",
        handleHotUpdate({ file, server }) {
            if (file.endsWith(".js")) {
                console.log("JS file changed, restarting server...");
                server.restart();
                return [];
            }
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        UnoCSS({
            configFile: "./uno.config.js",
        }),
        restartOnJSChange(),
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
