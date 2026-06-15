import { createApp } from "vue";
import "@tulpar-ui/tokens/css/tulpar.css";
import App from "./App.vue";
import { router } from "./router";

createApp(App).use(router).mount("#app");
