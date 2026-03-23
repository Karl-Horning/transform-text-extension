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
    esbuild.build({
        ...sharedConfig,
        entryPoints: ["src/content.ts"],
        outfile: "dist/content.js",
    }),
]);

console.log("Build complete.");
