import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig(({ command, mode }) => {
  const isTest = mode === "test" || Boolean(process.env.VITEST);
  const isBuild = command === "build";
  const minified = mode === "bookmarklet-min";

  return {
    root: command === "serve" && !isTest ? "src/demo" : ".",
    publicDir: false,
    define: {
      __XJTLU_BOOKMARKLET_AUTO_RUN__: JSON.stringify(isBuild)
    },
    test: {
      environment: "jsdom",
      globals: true,
      include: ["tests/**/*.test.ts"]
    },
    build: {
      emptyOutDir: !minified,
      outDir: "dist",
      sourcemap: false,
      minify: minified ? "esbuild" : false,
      lib: {
        entry: resolve(__dirname, "src/bookmarklet/main.ts"),
        name: "XjtluTimetableExporter",
        formats: ["iife"],
        fileName: () => (minified ? "bookmarklet.min.js" : "bookmarklet.js")
      },
      rollupOptions: {
        output: {
          inlineDynamicImports: true
        }
      }
    }
  };
});
