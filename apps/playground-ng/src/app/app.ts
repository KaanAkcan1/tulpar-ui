import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TulparButtonComponent } from '@tulpar-ui/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TulparButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Tulpar UI — Angular Playground</h1>

    <button (click)="toggleDark()">
      Toggle dark mode (current: {{ isDark() ? 'dark' : 'light' }})
    </button>

    <section>
      <h2>Variants</h2>
      <tulpar-button-ng variant="primary">Primary</tulpar-button-ng>
      <tulpar-button-ng variant="secondary">Secondary</tulpar-button-ng>
      <tulpar-button-ng variant="danger">Danger</tulpar-button-ng>
      <tulpar-button-ng variant="ghost">Ghost</tulpar-button-ng>
      <tulpar-button-ng variant="link">Link</tulpar-button-ng>
    </section>

    <section>
      <h2>Sizes</h2>
      <tulpar-button-ng size="xs">xs</tulpar-button-ng>
      <tulpar-button-ng size="sm">sm</tulpar-button-ng>
      <tulpar-button-ng size="md">md</tulpar-button-ng>
      <tulpar-button-ng size="lg">lg</tulpar-button-ng>
      <tulpar-button-ng size="xl">xl</tulpar-button-ng>
      <tulpar-button-ng size="2xl">2xl</tulpar-button-ng>
      <tulpar-button-ng size="3xl">3xl</tulpar-button-ng>
    </section>

    <section>
      <h2>States</h2>
      <tulpar-button-ng [disabled]="true">Disabled</tulpar-button-ng>
      <tulpar-button-ng [loading]="true">Loading</tulpar-button-ng>
    </section>

    <section>
      <h2>Form integration</h2>
      <form (submit)="onSubmit($event)">
        <input name="email" type="email" placeholder="Email" />
        <tulpar-button-ng type="submit">Submit</tulpar-button-ng>
        <tulpar-button-ng type="reset" variant="secondary">Reset</tulpar-button-ng>
      </form>
      @if (submittedEmail()) {
        <p>Submitted: {{ submittedEmail() }}</p>
      }
    </section>
  `,
  styles: [
    `
      section {
        margin: 2rem 0;
      }
      section tulpar-button-ng {
        margin-right: 0.5rem;
      }
      form {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      input {
        height: 40px;
        padding: 0 12px;
        border: 1px solid var(--tulpar-color-border-default);
        border-radius: 6px;
      }
      h1,
      h2 {
        color: var(--tulpar-color-text-primary);
      }
    `,
  ],
})
export class App {
  isDark = signal(false);
  submittedEmail = signal<string | null>(null);

  toggleDark(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    document.documentElement.classList.toggle('dark', next);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const fd = new FormData(form);
    this.submittedEmail.set(String(fd.get('email') ?? ''));
  }
}
