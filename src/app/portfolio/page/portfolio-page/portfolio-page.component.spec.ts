import { TestBed } from '@angular/core/testing';
import { PortfolioPage } from './portfolio-page.component';

describe('PortfolioPage', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PortfolioPage],
    }).compileComponents();
  });

  it('mostra formação e empresas na mesma página', async () => {
    const fixture = TestBed.createComponent(PortfolioPage);
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Formação');
    expect(text).toContain('Empresas');
  });

  it('abre o modal de um ponto da linha do tempo', async () => {
    const fixture = TestBed.createComponent(PortfolioPage);
    await fixture.whenStable();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    button?.click();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Texto de exemplo para o modal deste local de estudo.');
  });
});
