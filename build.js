import { cpSync } from "node:fs";

import * as esbuild from "esbuild";

const sharedConfig = {
    bundle: true,
    platform: "browser",
    target: "es2020",
    format: "esm",
    sourcemap: false,
};

await Promise.all([
    esbuild.build({
        ...sharedConfig,
        entryPoints: ["src/background.ts"],
        outfile: "dist/background.js",
    }),
]);

cpSync("public/manifest.json", "dist/manifest.json");
cpSync("public/icons", "dist/icons", { recursive: true });

console.log("Build complete.");
