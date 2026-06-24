import { createRouter, createWebHistory } from "vue-router";

import ButtonDemo from "./components/ButtonDemo.vue";
import TextInputDemo from "./components/TextInputDemo.vue";
import TextareaDemo from "./components/TextareaDemo.vue";
import NumberInputDemo from "./components/NumberInputDemo.vue";
import SelectDemo from "./components/SelectDemo.vue";
import ColorsDemo from "./components/ColorsDemo.vue";
import GuideDemo from "./components/GuideDemo.vue";
import SwitchDemo from "./components/SwitchDemo.vue";
import CheckboxDemo from "./components/CheckboxDemo.vue";
import RadioGroupDemo from "./components/RadioGroupDemo.vue";
import CheckboxGroupDemo from "./components/CheckboxGroupDemo.vue";
import TooltipDemo from "./components/TooltipDemo.vue";
import ToggletipDemo from "./components/ToggletipDemo.vue";
import PopoverDemo from "./components/PopoverDemo.vue";
import ToastDemo from "./components/ToastDemo.vue";
import MessageDemo from "./components/MessageDemo.vue";
import TagDemo from "./components/TagDemo.vue";
import BadgeDemo from "./components/BadgeDemo.vue";
import ChipDemo from "./components/ChipDemo.vue";
import AvatarDemo from "./components/AvatarDemo.vue";
import SkeletonDemo from "./components/SkeletonDemo.vue";
import SpinnerDemo from "./components/SpinnerDemo.vue";
import ProgressDemo from "./components/ProgressDemo.vue";

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
    { path: "/select", component: SelectDemo, meta: { title: "Select — Tulpar UI" } },
    { path: "/switch", component: SwitchDemo, meta: { title: "Switch — Tulpar UI" } },
    { path: "/checkbox", component: CheckboxDemo, meta: { title: "Checkbox — Tulpar UI" } },
    {
      path: "/radio-group",
      component: RadioGroupDemo,
      meta: { title: "RadioGroup — Tulpar UI" },
    },
    {
      path: "/checkbox-group",
      component: CheckboxGroupDemo,
      meta: { title: "CheckboxGroup — Tulpar UI" },
    },
    { path: "/tooltip", component: TooltipDemo, meta: { title: "Tooltip — Tulpar UI" } },
    { path: "/toggletip", component: ToggletipDemo, meta: { title: "Toggletip — Tulpar UI" } },
    { path: "/popover", component: PopoverDemo, meta: { title: "Popover — Tulpar UI" } },
    { path: "/toast", component: ToastDemo, meta: { title: "Toast — Tulpar UI" } },
    { path: "/message", component: MessageDemo, meta: { title: "Message — Tulpar UI" } },
    { path: "/tag", component: TagDemo, meta: { title: "Tag — Tulpar UI" } },
    { path: "/badge", component: BadgeDemo, meta: { title: "Badge — Tulpar UI" } },
    { path: "/chip", component: ChipDemo, meta: { title: "Chip — Tulpar UI" } },
    { path: "/avatar", component: AvatarDemo, meta: { title: "Avatar — Tulpar UI" } },
    { path: "/skeleton", component: SkeletonDemo, meta: { title: "Skeleton — Tulpar UI" } },
    { path: "/spinner", component: SpinnerDemo, meta: { title: "Spinner — Tulpar UI" } },
    { path: "/progress", component: ProgressDemo, meta: { title: "Progress — Tulpar UI" } },
    { path: "/colors", component: ColorsDemo, meta: { title: "Colors — Tulpar UI" } },
    { path: "/guide", component: GuideDemo, meta: { title: "Sidebar & Theme — Tulpar UI" } },
    { path: "/:pathMatch(.*)*", redirect: "/button" },
  ],
});
