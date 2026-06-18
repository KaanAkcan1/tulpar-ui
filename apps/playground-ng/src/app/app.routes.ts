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
  { path: '**', redirectTo: 'button' },
];
