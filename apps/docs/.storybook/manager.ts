import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

const tulparTheme = create({
  base: "light",
  brandTitle: "Tulpar UI",
  brandUrl: "https://tulpar-ui-docs.pages.dev",
  brandImage: "brand/tulpar-ui-lockup-light.svg",
  brandTarget: "_self",
});

addons.setConfig({ theme: tulparTheme });
