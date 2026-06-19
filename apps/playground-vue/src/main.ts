import { createApp } from "vue";
import "@tulpar-ui/tokens/css/tulpar.css";
import { TulparToastPlugin } from "@tulpar-ui/vue";
import App from "./App.vue";
import { router } from "./router";

// Install the toast plugin with explicit defaults (the idiomatic
// `app.use(TulparToastPlugin, { … })` form). Passing a defaults object also
// sidesteps the plugin's optional-undefined install overload during type-check.
createApp(App).use(router).use(TulparToastPlugin, {}).mount("#app");
