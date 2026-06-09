import angular from "@analogjs/vite-plugin-angular";
import { defineConfig } from "vitest/config";

// The Analog plugin returns multiple Vite plugins. One of them
// (`analogjs-router-optimization`) tries to apply its transform on virtual
// inline-style ids on Windows and explodes on the `\x00` NUL prefix that
// Vite uses for virtual module IDs. The router-optimization plugin is for
// runtime serve/SSR — it has nothing to do with unit tests, so we strip it.
const angularPlugins = angular({ tsconfig: "tsconfig.spec.json" }).filter(
  (plugin) => plugin && (plugin as { name?: string }).name !== "analogjs-router-optimization",
);

export default defineConfig({
  plugins: [angularPlugins],
  test: {
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    environment: "happy-dom",
    include: ["src/**/*.spec.ts"],
  },
});
