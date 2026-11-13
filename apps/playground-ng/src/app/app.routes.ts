import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'button' },
  {
    path: 'button',
    loadComponent: () => import('./demos/button-demo.component').then((m) => m.ButtonDemoComponent),
    title: 'Button — Tulpar UI',
  },
  {
    path: 'text-input',
    loadComponent: () =>
      import('./demos/text-input-demo.component').then((m) => m.TextInputDemoComponent),
    title: 'TextInput — Tulpar UI',
  },
  {
    path: 'textarea',
    loadComponent: () =>
      import('./demos/textarea-demo.component').then((m) => m.TextareaDemoComponent),
    title: 'Textarea — Tulpar UI',
  },
  {
    path: 'number-input',
    loadComponent: () =>
      import('./demos/number-input-demo.component').then((m) => m.NumberInputDemoComponent),
    title: 'NumberInput — Tulpar UI',
  },
  {
    path: 'select',
    loadComponent: () => import('./demos/select-demo.component').then((m) => m.SelectDemoComponent),
    title: 'Select — Tulpar UI',
  },
  {
    path: 'colors',
    loadComponent: () => import('./demos/colors-demo.component').then((m) => m.ColorsDemoComponent),
    title: 'Colors — Tulpar UI',
  },
  {
    path: 'guide',
    loadComponent: () => import('./demos/guide-demo.component').then((m) => m.GuideDemoComponent),
    title: 'Sidebar & Theme — Tulpar UI',
  },
  {
    path: 'switch',
    loadComponent: () => import('./demos/switch-demo.component').then((m) => m.SwitchDemoComponent),
    title: 'Switch — Tulpar UI',
  },
  {
    path: 'checkbox',
    loadComponent: () =>
      import('./demos/checkbox-demo.component').then((m) => m.CheckboxDemoComponent),
    title: 'Checkbox — Tulpar UI',
  },
  {
    path: 'radio-group',
    loadComponent: () =>
      import('./demos/radio-group-demo.component').then((m) => m.RadioGroupDemoComponent),
    title: 'Radio Group — Tulpar UI',
  },
  {
    path: 'checkbox-group',
    loadComponent: () =>
      import('./demos/checkbox-group-demo.component').then((m) => m.CheckboxGroupDemoComponent),
    title: 'Checkbox Group — Tulpar UI',
  },
  {
    path: 'tooltip',
    loadComponent: () =>
      import('./demos/tooltip-demo.component').then((m) => m.TooltipDemoComponent),
    title: 'Tooltip — Tulpar UI',
  },
  {
    path: 'toggletip',
    loadComponent: () =>
      import('./demos/toggletip-demo.component').then((m) => m.ToggletipDemoComponent),
    title: 'Toggletip — Tulpar UI',
  },
  {
    path: 'popover',
    loadComponent: () =>
      import('./demos/popover-demo.component').then((m) => m.PopoverDemoComponent),
    title: 'Popover — Tulpar UI',
  },
  {
    path: 'toast',
    loadComponent: () => import('./demos/toast-demo.component').then((m) => m.ToastDemoComponent),
    title: 'Toast — Tulpar UI',
  },
  {
    path: 'message',
    loadComponent: () =>
      import('./demos/message-demo.component').then((m) => m.MessageDemoComponent),
    title: 'Message — Tulpar UI',
  },
  {
    path: 'tag',
    loadComponent: () => import('./demos/tag-demo.component').then((m) => m.TagDemoComponent),
    title: 'Tag — Tulpar UI',
  },
  {
    path: 'badge',
    loadComponent: () => import('./demos/badge-demo.component').then((m) => m.BadgeDemoComponent),
    title: 'Badge — Tulpar UI',
  },
  {
    path: 'chip',
    loadComponent: () => import('./demos/chip-demo.component').then((m) => m.ChipDemoComponent),
    title: 'Chip — Tulpar UI',
  },
  {
    path: 'avatar',
    loadComponent: () => import('./demos/avatar-demo.component').then((m) => m.AvatarDemoComponent),
    title: 'Avatar — Tulpar UI',
  },
  {
    path: 'skeleton',
    loadComponent: () =>
      import('./demos/skeleton-demo.component').then((m) => m.SkeletonDemoComponent),
    title: 'Skeleton — Tulpar UI',
  },
  {
    path: 'spinner',
    loadComponent: () =>
      import('./demos/spinner-demo.component').then((m) => m.SpinnerDemoComponent),
    title: 'Spinner — Tulpar UI',
  },
  {
    path: 'progress',
    loadComponent: () =>
      import('./demos/progress-demo.component').then((m) => m.ProgressDemoComponent),
    title: 'Progress — Tulpar UI',
  },
  { path: '**', redirectTo: 'button' },
];
