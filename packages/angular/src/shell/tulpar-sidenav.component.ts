import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  type Type,
  computed,
  effect,
  inject,
  input,
  output,
} from "@angular/core";

import { NgComponentOutlet, NgTemplateOutlet } from "@angular/common";

import "@tulpar-ui/shell";
import type { TulparNavItemData, TulparSidenav } from "@tulpar-ui/shell";

import { TulparNavItemComponent } from "./tulpar-nav-item.component";
import { TulparNavSectionComponent } from "./tulpar-nav-section.component";

export type { TulparNavItemData };

/**
 * Angular-flavoured nav item data. Identical to the core {@link TulparNavItemData}
 * except `icon` may also be an Angular component `Type` — when a component is
 * supplied the wrapper projects it through a slotted `<span slot="icon">` rather
 * than handing the array to the web component (which only understands SVG strings).
 */
export interface TulparNavItemNgData extends Omit<TulparNavItemData, "icon" | "items"> {
  icon?: string | Type<unknown>;
  items?: TulparNavItemNgData[];
}

function hasComponentIcon(items: TulparNavItemNgData[] | undefined): boolean {
  if (!items) return false;
  return items.some(
    (i) => (i.icon != null && typeof i.icon !== "string") || hasComponentIcon(i.items),
  );
}

@Component({
  selector: "tulpar-sidenav-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    NgComponentOutlet,
    NgTemplateOutlet,
    TulparNavItemComponent,
    TulparNavSectionComponent,
  ],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-sidenav
      [attr.nav-label]="navLabel() ?? null"
      [attr.position]="position()"
      [attr.density]="density()"
      [attr.single-expand]="singleExpand() ? '' : null"
      [attr.toggle-label]="toggleLabel() ?? null"
      [attr.show-mode-selection]="showModeSelection() ? '' : null"
      [attr.show-config]="showConfig() ? '' : null"
      [attr.config-text]="configText() ?? null"
      [attr.theme-label]="themeLabel() ?? null"
      [attr.theme-text-dark]="themeTextDark() ?? null"
      [attr.theme-text-light]="themeTextLight() ?? null"
      [attr.config-label]="configLabel() ?? null"
      [attr.show-account-block]="showAccountBlock() ? '' : null"
      [attr.user-name]="userName() ?? null"
      [attr.user-role]="userRole() ?? null"
      [attr.profile-image]="profileImage() ?? null"
      [attr.show-settings]="showSettings() ? '' : null"
      [attr.show-logout]="showLogout() ? '' : null"
      [attr.settings-label]="settingsLabel() ?? null"
      [attr.logout-label]="logoutLabel() ?? null"
      (tulpar-config-click)="config.emit()"
      (tulpar-settings-click)="settings.emit()"
      (tulpar-logout)="logout.emit()"
    >
      <ng-content select="[slot='header']" />
      <ng-content select="[slot='header-actions']" />
      <ng-content select="[slot='search']" />
      <ng-content select="[slot='utility-start']" />
      <ng-content select="[slot='utility-end']" />
      @if (renderItemsInLightDom()) {
        @for (item of items(); track $index) {
          <ng-container [ngTemplateOutlet]="itemTpl" [ngTemplateOutletContext]="{ $implicit: item }" />
        }
      }
      <ng-content />
      <ng-content select="[slot='footer']" />
    </tulpar-sidenav>

    <ng-template #itemTpl let-item>
      @if (item.type === "section") {
        <tulpar-nav-section-ng [label]="item.label">
          @for (child of item.items; track $index) {
            <ng-container
              [ngTemplateOutlet]="itemTpl"
              [ngTemplateOutletContext]="{ $implicit: child }"
            />
          }
        </tulpar-nav-section-ng>
      } @else {
        <tulpar-nav-item-ng
          [href]="item.href"
          [label]="item.label"
          [icon]="isStringIcon(item.icon) ? item.icon : undefined"
          [iconClass]="item.iconClass"
          [badge]="item.badge"
          [count]="item.count"
          [dot]="item.dot ?? false"
          [dotLabel]="item.dotLabel"
          [kbd]="item.kbd"
          [target]="item.target"
          [active]="item.active ?? false"
          [disabled]="item.disabled ?? false"
        >
          @if (item.icon && !isStringIcon(item.icon)) {
            <span slot="icon">
              <ng-container [ngComponentOutlet]="item.icon" />
            </span>
          }
          @for (child of item.items; track $index) {
            <ng-container
              [ngTemplateOutlet]="itemTpl"
              [ngTemplateOutletContext]="{ $implicit: child }"
            />
          }
        </tulpar-nav-item-ng>
      }
    </ng-template>
  `,
})
export class TulparSidenavComponent {
  /**
   * Menu data. Items whose `icon` is a string (or absent) are handed to the web
   * component as a DOM property. If ANY item carries a component `icon`, the
   * whole tree is instead rendered in light DOM so the component can be projected
   * through `<span slot="icon">` (web components cannot host Angular components).
   */
  readonly items = input<TulparNavItemNgData[] | undefined>(undefined);
  readonly navLabel = input<string | undefined>(undefined);
  readonly position = input<"left" | "right">("left");
  readonly density = input<"comfortable" | "compact">("comfortable");
  readonly singleExpand = input<boolean>(false);

  readonly toggleLabel = input<string | undefined>(undefined);
  readonly showModeSelection = input<boolean>(true);
  readonly showConfig = input<boolean>(false);
  readonly configText = input<string | undefined>(undefined);
  readonly themeLabel = input<string | undefined>(undefined);
  readonly themeTextDark = input<string | undefined>(undefined);
  readonly themeTextLight = input<string | undefined>(undefined);
  readonly configLabel = input<string | undefined>(undefined);

  readonly showAccountBlock = input<boolean>(true);
  readonly userName = input<string | undefined>(undefined);
  readonly userRole = input<string | undefined>(undefined);
  readonly profileImage = input<string | undefined>(undefined);
  readonly showSettings = input<boolean>(false);
  readonly showLogout = input<boolean>(true);
  readonly settingsLabel = input<string | undefined>(undefined);
  readonly logoutLabel = input<string | undefined>(undefined);

  readonly config = output<void>();
  readonly settings = output<void>();
  readonly logout = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /**
   * True when items must be rendered in light DOM (component icons present).
   * Memoised as a computed signal so the `hasComponentIcon` tree traversal is
   * shared between the template `@if` and the `effect()` read sites.
   */
  readonly renderItemsInLightDom = computed(() => hasComponentIcon(this.items()));

  isStringIcon(icon: unknown): icon is string {
    return typeof icon === "string";
  }

  constructor() {
    // `items` is a DOM property (not an attribute) — set it on the element, but
    // ONLY when we're delegating to the web component. When component icons force
    // light-DOM rendering we must NOT also set the property (would double-render).
    effect(() => {
      const el = this.host.nativeElement.querySelector<TulparSidenav>("tulpar-sidenav");
      if (!el) return;
      el.items = this.renderItemsInLightDom()
        ? undefined
        : (this.items() as TulparNavItemData[] | undefined);
    });
  }
}
