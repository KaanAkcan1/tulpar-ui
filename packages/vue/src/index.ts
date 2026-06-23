export { default as TulparButton } from "./button/TulparButton.vue";
export type {
  ButtonSeverity,
  ButtonVariant,
  ButtonSize,
  ButtonShape,
  ButtonIconPosition,
  ButtonLoadingPosition,
  ButtonType,
  ButtonJustify,
  ButtonColor,
} from "@tulpar-ui/core";

export { default as TulparTextInput } from "./text-input/TulparTextInput.vue";
export type {
  TextInputType,
  FieldSize,
  FieldVariant,
  LabelPosition,
  NecessityIndicator,
} from "@tulpar-ui/core";

export { default as TulparTextarea } from "./textarea/TulparTextarea.vue";

export { default as TulparNumberInput } from "./number-input/TulparNumberInput.vue";

export { default as TulparShell } from "./shell/TulparShell.vue";
export { default as TulparTopbar } from "./shell/TulparTopbar.vue";
export { default as TulparSidenav } from "./shell/TulparSidenav.vue";
export type { TulparNavItemVueData } from "./shell/TulparSidenav.vue";
export { default as TulparNavItem } from "./shell/TulparNavItem.vue";
export { default as TulparNavSection } from "./shell/TulparNavSection.vue";
export type { ShellSidenavMode, ShellState, TulparNavItemData } from "@tulpar-ui/shell";

export { default as TulparSwitch } from "./switch/TulparSwitch.vue";
export { default as TulparCheckbox } from "./checkbox/TulparCheckbox.vue";
export { default as TulparRadio } from "./radio/TulparRadio.vue";
export { default as TulparRadioGroup } from "./radio-group/TulparRadioGroup.vue";
export { default as TulparCheckboxGroup } from "./checkbox-group/TulparCheckboxGroup.vue";
export type { SelectionSize, SelectionLabelPosition } from "@tulpar-ui/core/switch";

// --- Overlay directives (v0.11) -------------------------------------------
// Custom Vue directives that attach a core overlay (<tulpar-tooltip> /
// <tulpar-toggletip> / <tulpar-popover>) to ANY host element via the `for`=id
// model, never wrapping it. Register on a component/app:
//   import { vTulparTooltip } from "@tulpar-ui/vue";
//   directives: { tulparTooltip: vTulparTooltip }   // → v-tulpar-tooltip
export { vTulparTooltip } from "./overlay/tulpar-tooltip.directive";
export type { TooltipPlacement } from "./overlay/tulpar-tooltip.directive";

export { vTulparToggletip } from "./overlay/tulpar-toggletip.directive";
export type { ToggletipPlacement, ToggletipTone } from "./overlay/tulpar-toggletip.directive";

export { vTulparPopover } from "./overlay/tulpar-popover.directive";
export type { PopoverPlacement, PopoverTone } from "./overlay/tulpar-popover.directive";

export type {
  OverlayDirectiveConfig,
  OverlayDirectiveValue,
} from "./overlay/overlay-directive-base";

// --- Toast + Message (v0.12) --------------------------------------------------
// Imperative notification service.
//   const toast = useTulparToast();   toast.success("Kaydedildi");
//   const msg   = useTulparMessage(); msg.info("Bilgi");
//   app.use(TulparToastPlugin)        ← idiomatic entry; composables work without it too
export { useTulparToast, useTulparMessage, TulparToastPlugin } from "./toast/index";
export type {
  ToastOptions,
  MessageOptions,
  ToasterDefaults,
  DismissReason,
  ToastLocation,
  ToastPromiseMsgs,
} from "./toast/index";

// Declarative / rich SFC (Task 6.2).
export { default as TulparToast } from "./toast/TulparToast.vue";
export type { ToastAction, ToneValue } from "@tulpar-ui/core/toast";

// --- Display & status atoms (v0.13) -------------------------------------------
export { default as TulparTag } from "./tag/TulparTag.vue";
export type { TagVariant, TagShape, TagSize } from "@tulpar-ui/core/tag";

export { default as TulparBadge } from "./badge/TulparBadge.vue";
export type {
  BadgeTone,
  BadgeVariant,
  BadgeShape,
  BadgeSize,
  BadgePlacement,
} from "@tulpar-ui/core/badge";

export { default as TulparChip } from "./chip/TulparChip.vue";
export type { ChipVariant, ChipShape, ChipSize } from "@tulpar-ui/core/chip";

export { default as TulparAvatar } from "./avatar/TulparAvatar.vue";
export type { AvatarShape, AvatarSize } from "@tulpar-ui/core/avatar";

export { default as TulparSkeleton } from "./skeleton/TulparSkeleton.vue";
export type { SkeletonVariant, SkeletonAnimation } from "@tulpar-ui/core/skeleton";

export { default as TulparSpinner } from "./spinner/TulparSpinner.vue";
export type { SpinnerSize, SpinnerTone } from "@tulpar-ui/core/spinner";

export { default as TulparProgress } from "./progress/TulparProgress.vue";
export type {
  ProgressVariant,
  ProgressTone,
  ProgressThickness,
  ProgressSize,
  ProgressValueFormatter,
} from "@tulpar-ui/core/progress";
