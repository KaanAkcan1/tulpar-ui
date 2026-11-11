import { setCustomElementsManifest } from "@storybook/web-components-vite";
import type { Preview } from "@storybook/web-components-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import coreManifest from "../../../packages/core/custom-elements.json";
import shellManifest from "../../../packages/shell/custom-elements.json";

// Generated at build time by `cem analyze` (packages/*/custom-elements.json).
// Merged so the docs tables list each element's properties, events, slots and CSS parts.
setCustomElementsManifest({
  ...coreManifest,
  modules: [...coreManifest.modules, ...shellManifest.modules],
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: "error" },
  },
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
