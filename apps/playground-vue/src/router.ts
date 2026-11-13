import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/button" },
    {
      path: "/button",
      component: () => import("./components/ButtonDemo.vue"),
      meta: { title: "Button — Tulpar UI" },
    },
    {
      path: "/text-input",
      component: () => import("./components/TextInputDemo.vue"),
      meta: { title: "TextInput — Tulpar UI" },
    },
    {
      path: "/textarea",
      component: () => import("./components/TextareaDemo.vue"),
      meta: { title: "Textarea — Tulpar UI" },
    },
    {
      path: "/number-input",
      component: () => import("./components/NumberInputDemo.vue"),
      meta: { title: "NumberInput — Tulpar UI" },
    },
    {
      path: "/select",
      component: () => import("./components/SelectDemo.vue"),
      meta: { title: "Select — Tulpar UI" },
    },
    {
      path: "/switch",
      component: () => import("./components/SwitchDemo.vue"),
      meta: { title: "Switch — Tulpar UI" },
    },
    {
      path: "/checkbox",
      component: () => import("./components/CheckboxDemo.vue"),
      meta: { title: "Checkbox — Tulpar UI" },
    },
    {
      path: "/radio-group",
      component: () => import("./components/RadioGroupDemo.vue"),
      meta: { title: "RadioGroup — Tulpar UI" },
    },
    {
      path: "/checkbox-group",
      component: () => import("./components/CheckboxGroupDemo.vue"),
      meta: { title: "CheckboxGroup — Tulpar UI" },
    },
    {
      path: "/tooltip",
      component: () => import("./components/TooltipDemo.vue"),
      meta: { title: "Tooltip — Tulpar UI" },
    },
    {
      path: "/toggletip",
      component: () => import("./components/ToggletipDemo.vue"),
      meta: { title: "Toggletip — Tulpar UI" },
    },
    {
      path: "/popover",
      component: () => import("./components/PopoverDemo.vue"),
      meta: { title: "Popover — Tulpar UI" },
    },
    {
      path: "/toast",
      component: () => import("./components/ToastDemo.vue"),
      meta: { title: "Toast — Tulpar UI" },
    },
    {
      path: "/message",
      component: () => import("./components/MessageDemo.vue"),
      meta: { title: "Message — Tulpar UI" },
    },
    {
      path: "/tag",
      component: () => import("./components/TagDemo.vue"),
      meta: { title: "Tag — Tulpar UI" },
    },
    {
      path: "/badge",
      component: () => import("./components/BadgeDemo.vue"),
      meta: { title: "Badge — Tulpar UI" },
    },
    {
      path: "/chip",
      component: () => import("./components/ChipDemo.vue"),
      meta: { title: "Chip — Tulpar UI" },
    },
    {
      path: "/avatar",
      component: () => import("./components/AvatarDemo.vue"),
      meta: { title: "Avatar — Tulpar UI" },
    },
    {
      path: "/skeleton",
      component: () => import("./components/SkeletonDemo.vue"),
      meta: { title: "Skeleton — Tulpar UI" },
    },
    {
      path: "/spinner",
      component: () => import("./components/SpinnerDemo.vue"),
      meta: { title: "Spinner — Tulpar UI" },
    },
    {
      path: "/progress",
      component: () => import("./components/ProgressDemo.vue"),
      meta: { title: "Progress — Tulpar UI" },
    },
    {
      path: "/colors",
      component: () => import("./components/ColorsDemo.vue"),
      meta: { title: "Colors — Tulpar UI" },
    },
    {
      path: "/guide",
      component: () => import("./components/GuideDemo.vue"),
      meta: { title: "Sidebar & Theme — Tulpar UI" },
    },
    { path: "/:pathMatch(.*)*", redirect: "/button" },
  ],
});
