import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the shell with a self-contained sidenav', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // The brand/account/utility chrome now lives inside the sidenav's shadow DOM
    // (prop-driven), so we assert the shell + sidenav web components are present
    // rather than reaching for light-DOM brand markup that no longer exists.
    expect(compiled.querySelector('tulpar-shell')).toBeTruthy();
    expect(compiled.querySelector('tulpar-sidenav')).toBeTruthy();
  });
});
