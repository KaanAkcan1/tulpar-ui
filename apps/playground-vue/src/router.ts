import { createRouter, createWebHistory } from "vue-router";

import ButtonDemo from "./components/ButtonDemo.vue";
import TextInputDemo from "./components/TextInputDemo.vue";
import TextareaDemo from "./components/TextareaDemo.vue";
import NumberInputDemo from "./components/NumberInputDemo.vue";
import ColorsDemo from "./components/ColorsDemo.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/button" },
    { path: "/button", component: ButtonDemo, meta: { title: "Button — Tulpar UI" } },
    { path: "/text-input", component: TextInputDemo, meta: { title: "TextInput — Tulpar UI" } },
    { path: "/textarea", component: TextareaDemo, meta: { title: "Textarea — Tulpar UI" } },
    {
      path: "/number-input",
      component: NumberInputDemo,
      meta: { title: "NumberInput — Tulpar UI" },
    },
    { path: "/colors", component: ColorsDemo, meta: { title: "Colors — Tulpar UI" } },
    { path: "/:pathMatch(.*)*", redirect: "/button" },
  ],
});
