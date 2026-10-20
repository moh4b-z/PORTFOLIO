import { TestBed } from '@angular/core/testing';
import { LANGUAGE_STORAGE_KEY } from './language.model';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'en';
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('começa em português', () => {
    const service = TestBed.inject(LanguageService);
    TestBed.flushEffects();

    expect(service.language()).toBe('pt');
    expect(service.t('app.title')).toBe('Portfólio');
    expect(document.documentElement.lang).toBe('pt');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('pt');
  });

  it('ignora idiomas ainda indisponíveis', () => {
    const service = TestBed.inject(LanguageService);

    service.setLanguage('en');
    service.setLanguage('es');
    service.setLanguage('fr');

    expect(service.language()).toBe('pt');
  });

  it('ignora um idioma salvo que ainda não pode ser usado', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');

    const service = TestBed.inject(LanguageService);

    expect(service.language()).toBe('pt');
  });
});
