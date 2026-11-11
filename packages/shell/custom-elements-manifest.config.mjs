import publicApi from "../../scripts/cem-plugin-public-api.mjs";

export default {
  globs: ["src/**/*.ts"],
  exclude: ["src/_internal/**", "**/*.test.ts"],
  litelement: true,
  outdir: ".",
  plugins: [publicApi()],
};
