<script setup lang="ts">
import "@tulpar-ui/shell";
import {
  computed,
  defineComponent,
  h,
  ref,
  watchEffect,
  type Component,
  type PropType,
  type VNode,
} from "vue";
import type { TulparNavItemData, TulparSidenav as TulparSidenavEl } from "@tulpar-ui/shell";
import TulparNavItem from "./TulparNavItem.vue";
import TulparNavSection from "./TulparNavSection.vue";

/**
 * Vue-flavoured nav item data. Identical to the core {@link TulparNavItemData}
 * except `icon` may also be a Vue component — when a component is supplied the
 * wrapper projects it through a slotted `<span slot="icon">` rather than handing
 * the array to the web component (which only understands SVG strings).
 */
export interface TulparNavItemVueData extends Omit<TulparNavItemData, "icon" | "items"> {
  icon?: string | Component;
  items?: TulparNavItemVueData[];
}

interface Props {
  items?: TulparNavItemVueData[];
  navLabel?: string;
  position?: "left" | "right";
  density?: "comfortable" | "compact";
  singleExpand?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchLabel?: string;
  searchEmptyText?: string;
  toggleLabel?: string;
  showModeSelection?: boolean;
  showConfig?: boolean;
  configText?: string;
  themeLabel?: string;
  themeTextDark?: string;
  themeTextLight?: string;
  configLabel?: string;
  showAccountBlock?: boolean;
  userName?: string;
  userRole?: string;
  profileImage?: string;
  showSettings?: boolean;
  showLogout?: boolean;
  settingsLabel?: string;
  logoutLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  position: "left",
  density: "comfortable",
  singleExpand: false,
  showSearch: true,
  showModeSelection: true,
  showConfig: false,
  showAccountBlock: true,
  showSettings: false,
  showLogout: true,
});

const emit = defineEmits<{
  config: [];
  settings: [];
  logout: [];
}>();

function isStringIcon(icon: unknown): icon is string {
  return typeof icon === "string";
}

function hasComponentIcon(items: TulparNavItemVueData[] | undefined): boolean {
  if (!items) return false;
  return items.some((i) => (i.icon != null && !isStringIcon(i.icon)) || hasComponentIcon(i.items));
}

// When any item carries a component icon, render the whole tree in light DOM so
// the component can be projected through `<span slot="icon">`. Otherwise delegate
// the array to the web component (existing behaviour, preserves rendering).
const renderItemsInLightDom = computed(() => hasComponentIcon(props.items));

// Recursive renderer used only for the light-DOM path. String icons pass through
// to the `icon` prop; component icons project into the `icon` slot.
const NavNode = defineComponent({
  name: "TulparNavNode",
  props: { item: { type: Object as PropType<TulparNavItemVueData>, required: true } },
  setup(p) {
    const renderChildren = (children?: TulparNavItemVueData[]): VNode[] =>
      (children ?? []).map((c, i) => h(NavNode, { item: c, key: c.href ?? c.label ?? i }));

    return () => {
      const item = p.item;
      if (item.type === "section") {
        return h(TulparNavSection, { label: item.label }, () => renderChildren(item.items));
      }
      const isString = isStringIcon(item.icon);
      // The TulparNavItem SFC exposes only a default <slot/>; the underlying web
      // component has a named <slot name="icon">. So a component icon is rendered
      // as a default-slot child carrying the `slot="icon"` attribute, which the
      // browser then distributes to the WC's icon slot.
      const slots: Record<string, () => VNode[]> = {
        default: () => [
          ...(item.icon && !isString
            ? [h("span", { slot: "icon" }, [h(item.icon as Component)])]
            : []),
          ...renderChildren(item.items),
        ],
      };
      return h(
        TulparNavItem,
        {
          href: item.href,
          label: item.label,
          icon: isString ? (item.icon as string) : undefined,
          iconClass: item.iconClass,
          badge: item.badge,
          count: item.count,
          dot: item.dot ?? false,
          dotLabel: item.dotLabel,
          kbd: item.kbd,
          target: item.target,
          active: item.active ?? false,
          disabled: item.disabled ?? false,
        },
        slots,
      );
    };
  },
});

// `items` is attribute: false on the WC — set it as a JS property. Skip when we
// render in light DOM (would double-render).
const hostRef = ref<TulparSidenavEl | null>(null);
watchEffect(() => {
  if (!hostRef.value) return;
  hostRef.value.items = renderItemsInLightDom.value
    ? undefined
    : (props.items as TulparNavItemData[] | undefined);
  // `showSearch` defaults to true in the element; set it as a DOM property so
  // `false` actually disables it (an absent boolean attribute keeps the default).
  hostRef.value.showSearch = props.showSearch;
});
</script>

<template>
  <tulpar-sidenav
    ref="hostRef"
    :nav-label="navLabel ?? undefined"
    :position="position"
    :density="density"
    :single-expand="singleExpand || undefined"
    :search-placeholder="searchPlaceholder ?? undefined"
    :search-label="searchLabel ?? undefined"
    :search-empty-text="searchEmptyText ?? undefined"
    :toggle-label="toggleLabel ?? undefined"
    :show-mode-selection="showModeSelection || undefined"
    :show-config="showConfig || undefined"
    :config-text="configText ?? undefined"
    :theme-label="themeLabel ?? undefined"
    :theme-text-dark="themeTextDark ?? undefined"
    :theme-text-light="themeTextLight ?? undefined"
    :config-label="configLabel ?? undefined"
    :show-account-block="showAccountBlock || undefined"
    :user-name="userName ?? undefined"
    :user-role="userRole ?? undefined"
    :profile-image="profileImage ?? undefined"
    :show-settings="showSettings || undefined"
    :show-logout="showLogout || undefined"
    :settings-label="settingsLabel ?? undefined"
    :logout-label="logoutLabel ?? undefined"
    @tulpar-config-click="emit('config')"
    @tulpar-settings-click="emit('settings')"
    @tulpar-logout="emit('logout')"
  >
    <slot name="header" />
    <slot name="header-actions" />
    <slot name="search" />
    <slot name="utility-start" />
    <slot name="utility-end" />
    <template v-if="renderItemsInLightDom">
      <NavNode v-for="(item, i) in items" :key="item.href ?? item.label ?? i" :item="item" />
    </template>
    <slot />
    <slot name="footer" />
  </tulpar-sidenav>
</template>
