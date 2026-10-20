import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY } from './theme.model';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset['theme'] = 'dark';
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    TestBed.resetTestingModule();
  });

  it('usa o tema escuro por padrão', () => {
    const service = TestBed.inject(ThemeService);
    TestBed.flushEffects();

    expect(service.preference()).toBe('dark');
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('aplica e guarda o tema claro', () => {
    const service = TestBed.inject(ThemeService);

    service.setPreference('light');
    TestBed.flushEffects();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('ignora uma preferência desconhecida', () => {
    const service = TestBed.inject(ThemeService);

    service.setPreference('azul');
    TestBed.flushEffects();

    expect(service.preference()).toBe('dark');
  });

  it('segue o navegador quando a preferência é sistema', () => {
    let listener: ((event: MediaQueryListEvent) => void) | undefined;

    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      media: '(prefers-color-scheme: light)',
      addEventListener: (_type: string, callback: (event: MediaQueryListEvent) => void) => {
        listener = callback;
      },
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
    }));

    const service = TestBed.inject(ThemeService);
    service.setPreference('system');
    TestBed.flushEffects();

    expect(service.theme()).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');

    listener?.({ matches: true } as MediaQueryListEvent);
    TestBed.flushEffects();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
  });

  it('restaura a preferência salva', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');

    const service = TestBed.inject(ThemeService);
    TestBed.flushEffects();

    expect(service.preference()).toBe('light');
    expect(service.theme()).toBe('light');
  });
});
