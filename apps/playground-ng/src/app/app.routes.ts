import type { Routes } from '@angular/router';

import { ButtonDemoComponent } from './demos/button-demo.component';
import { TextInputDemoComponent } from './demos/text-input-demo.component';
import { TextareaDemoComponent } from './demos/textarea-demo.component';
import { NumberInputDemoComponent } from './demos/number-input-demo.component';
import { ColorsDemoComponent } from './demos/colors-demo.component';
import { GuideDemoComponent } from './demos/guide-demo.component';
import { SwitchDemoComponent } from './demos/switch-demo.component';
import { CheckboxDemoComponent } from './demos/checkbox-demo.component';
import { RadioGroupDemoComponent } from './demos/radio-group-demo.component';
import { CheckboxGroupDemoComponent } from './demos/checkbox-group-demo.component';
import { TooltipDemoComponent } from './demos/tooltip-demo.component';
import { ToggletipDemoComponent } from './demos/toggletip-demo.component';
import { PopoverDemoComponent } from './demos/popover-demo.component';
import { ToastDemoComponent } from './demos/toast-demo.component';
import { MessageDemoComponent } from './demos/message-demo.component';
import { AtomsDemoComponent } from './demos/atoms-demo.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'button' },
  { path: 'button', component: ButtonDemoComponent, title: 'Button — Tulpar UI' },
  { path: 'text-input', component: TextInputDemoComponent, title: 'TextInput — Tulpar UI' },
  { path: 'textarea', component: TextareaDemoComponent, title: 'Textarea — Tulpar UI' },
  { path: 'number-input', component: NumberInputDemoComponent, title: 'NumberInput — Tulpar UI' },
  { path: 'colors', component: ColorsDemoComponent, title: 'Colors — Tulpar UI' },
  { path: 'guide', component: GuideDemoComponent, title: 'Sidebar & Theme — Tulpar UI' },
  { path: 'switch', component: SwitchDemoComponent, title: 'Switch — Tulpar UI' },
  { path: 'checkbox', component: CheckboxDemoComponent, title: 'Checkbox — Tulpar UI' },
  { path: 'radio-group', component: RadioGroupDemoComponent, title: 'Radio Group — Tulpar UI' },
  {
    path: 'checkbox-group',
    component: CheckboxGroupDemoComponent,
    title: 'Checkbox Group — Tulpar UI',
  },
  { path: 'tooltip', component: TooltipDemoComponent, title: 'Tooltip — Tulpar UI' },
  { path: 'toggletip', component: ToggletipDemoComponent, title: 'Toggletip — Tulpar UI' },
  { path: 'popover', component: PopoverDemoComponent, title: 'Popover — Tulpar UI' },
  { path: 'toast', component: ToastDemoComponent, title: 'Toast — Tulpar UI' },
  { path: 'message', component: MessageDemoComponent, title: 'Message — Tulpar UI' },
  { path: 'atoms', component: AtomsDemoComponent, title: 'Display & Status atoms — Tulpar UI' },
  { path: '**', redirectTo: 'button' },
];
