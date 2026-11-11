import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|js)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  managerHead: (head) =>
    `${head}<link rel="icon" type="image/svg+xml" href="favicon.svg" />`,
};

export default config;
