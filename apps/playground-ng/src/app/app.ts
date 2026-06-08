import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { TulparButtonComponent } from "@tulpar-ui/angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [TulparButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Tulpar UI — Angular Playground (v0.3)</h1>

    <button (click)="toggleDark()">
      Toggle dark mode (current: {{ isDark() ? "dark" : "light" }})
    </button>

    <section>
      <h2>Severities × Solid variant</h2>
      <tulpar-button-ng severity="primary">Primary</tulpar-button-ng>
      <tulpar-button-ng severity="secondary">Secondary</tulpar-button-ng>
      <tulpar-button-ng severity="info">Info</tulpar-button-ng>
      <tulpar-button-ng severity="success">Success</tulpar-button-ng>
      <tulpar-button-ng severity="warn">Warn</tulpar-button-ng>
      <tulpar-button-ng severity="help">Help</tulpar-button-ng>
      <tulpar-button-ng severity="danger">Danger</tulpar-button-ng>
      <tulpar-button-ng severity="contrast">Contrast</tulpar-button-ng>
    </section>

    <section>
      <h2>Variants × Primary severity</h2>
      <tulpar-button-ng variant="solid">Solid</tulpar-button-ng>
      <tulpar-button-ng variant="outlined">Outlined</tulpar-button-ng>
      <tulpar-button-ng variant="tonal">Tonal</tulpar-button-ng>
      <tulpar-button-ng variant="ghost">Ghost</tulpar-button-ng>
      <tulpar-button-ng variant="link">Link</tulpar-button-ng>
    </section>

    <section>
      <h2>Color overrides</h2>
      <tulpar-button-ng color="gold">Gold</tulpar-button-ng>
      <tulpar-button-ng color="emerald" variant="tonal">Emerald tonal</tulpar-button-ng>
      <tulpar-button-ng color="rose" variant="outlined">Rose outlined</tulpar-button-ng>
      <tulpar-button-ng color="indigo">Indigo</tulpar-button-ng>
      <tulpar-button-ng color="yellow">Yellow (auto-dark text)</tulpar-button-ng>
    </section>

    <section>
      <h2>Shapes + modifiers</h2>
      <tulpar-button-ng shape="round">Round</tulpar-button-ng>
      <tulpar-button-ng [raised]="true">Raised</tulpar-button-ng>
      <tulpar-button-ng [raised]="true" severity="danger">Raised danger</tulpar-button-ng>
    </section>

    <section>
      <h2>Loading</h2>
      <tulpar-button-ng [loading]="true">Save</tulpar-button-ng>
      <tulpar-button-ng [loading]="true" loadingLabel="Saving…">Save</tulpar-button-ng>
      <tulpar-button-ng [loading]="true" loadingPosition="start">Save</tulpar-button-ng>
    </section>

    <section>
      <h2>Form integration</h2>
      <form (submit)="onSubmit($event)">
        <input name="email" type="email" placeholder="Email" />
        <tulpar-button-ng type="submit">Submit</tulpar-button-ng>
        <tulpar-button-ng type="reset" severity="secondary" variant="outlined">Reset</tulpar-button-ng>
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
        margin-bottom: 0.5rem;
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
        border-radius: 4px;
      }
      h1,
      h2 {
        color: var(--tulpar-color-text-primary);
        font-family: var(--tulpar-font-family-display);
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
    document.documentElement.classList.toggle("dark", next);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const fd = new FormData(form);
    this.submittedEmail.set(String(fd.get("email") ?? ""));
  }
}
