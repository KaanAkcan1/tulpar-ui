import type { Routes } from '@angular/router';

import { ButtonDemoComponent } from './demos/button-demo.component';
import { TextInputDemoComponent } from './demos/text-input-demo.component';
import { TextareaDemoComponent } from './demos/textarea-demo.component';
import { NumberInputDemoComponent } from './demos/number-input-demo.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'button' },
  { path: 'button', component: ButtonDemoComponent, title: 'Button — Tulpar UI' },
  { path: 'text-input', component: TextInputDemoComponent, title: 'TextInput — Tulpar UI' },
  { path: 'textarea', component: TextareaDemoComponent, title: 'Textarea — Tulpar UI' },
  { path: 'number-input', component: NumberInputDemoComponent, title: 'NumberInput — Tulpar UI' },
  { path: '**', redirectTo: 'button' },
];
