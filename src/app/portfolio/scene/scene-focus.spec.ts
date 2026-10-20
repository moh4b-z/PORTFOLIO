import { TIMELINE_STOPS } from '../data/timeline.data';
import type { PortfolioSection, SectionRect, TimelineStop } from '../models/timeline.model';
import {
  advanceAngle,
  IDLE_SPIN_RADIANS_PER_SECOND,
  resolveScrollFocus,
  shortestAngleDelta,
} from './scene-focus';

const sections: readonly PortfolioSection[] = [
  { id: 'intro', titleKey: 'sections.intro.title', leadKey: 'sections.intro.lead' },
  {
    id: 'education',
    titleKey: 'sections.education.title',
    leadKey: 'sections.education.lead',
  },
  {
    id: 'companies',
    titleKey: 'sections.companies.title',
    leadKey: 'sections.companies.lead',
  },
  { id: 'contact', titleKey: 'sections.contact.title', leadKey: 'sections.contact.lead' },
];

const stops: readonly TimelineStop[] = [
  {
    id: 'edu-a',
    sectionId: 'education',
    position: 0,
    titleKey: 'timeline.education.one.title',
    periodKey: 'timeline.education.one.period',
    summaryKey: 'timeline.education.one.summary',
    imageSrc: null,
  },
  {
    id: 'edu-b',
    sectionId: 'education',
    position: 0.25,
    titleKey: 'timeline.education.two.title',
    periodKey: 'timeline.education.two.period',
    summaryKey: 'timeline.education.two.summary',
    imageSrc: null,
  },
  {
    id: 'company-a',
    sectionId: 'companies',
    position: 0.5,
    titleKey: 'timeline.companies.one.title',
    periodKey: 'timeline.companies.one.period',
    summaryKey: 'timeline.companies.one.summary',
    imageSrc: null,
  },
  {
    id: 'company-b',
    sectionId: 'companies',
    position: 0.75,
    titleKey: 'timeline.companies.two.title',
    periodKey: 'timeline.companies.two.period',
    summaryKey: 'timeline.companies.two.summary',
    imageSrc: null,
  },
];

describe('resolveScrollFocus', () => {
  const viewportHeight = 1000;

  it('gira livre nas seções sem pins', () => {
    const rects: SectionRect[] = [
      { id: 'intro', top: -200, height: 1000 },
      { id: 'education', top: 800, height: 1000 },
    ];

    const focus = resolveScrollFocus(sections, stops, rects, viewportHeight);

    expect(focus.mode).toBe('idle');
    expect(focus.sectionId).toBe('intro');
    expect(focus.stopId).toBeNull();
  });

  it('trava no meio do trecho de formação', () => {
    const rects: SectionRect[] = [{ id: 'education', top: -100, height: 1000 }];

    const focus = resolveScrollFocus(sections, stops, rects, viewportHeight);

    expect(focus.mode).toBe('locked');
    expect(focus.sectionId).toBe('education');
    expect(focus.stopId).toBe('edu-b');
    expect(focus.targetAngle).toBeCloseTo(Math.PI / 4);
  });

  it('mostra o trecho de empresas quando essa seção está na tela', () => {
    const rects: SectionRect[] = [
      { id: 'education', top: -1200, height: 1000 },
      { id: 'companies', top: -100, height: 1000 },
    ];

    const focus = resolveScrollFocus(sections, stops, rects, viewportHeight);

    expect(focus.mode).toBe('locked');
    expect(focus.sectionId).toBe('companies');
    expect(focus.targetAngle).toBeGreaterThan(Math.PI);
    expect(focus.targetAngle).toBeLessThan(Math.PI * 1.5);
  });

  it('mantém formação e empresas em arcos separados', () => {
    const education = TIMELINE_STOPS.filter((stop) => stop.sectionId === 'education').map(
      (stop) => stop.position,
    );
    const companies = TIMELINE_STOPS.filter((stop) => stop.sectionId === 'companies').map(
      (stop) => stop.position,
    );

    expect(Math.max(...education)).toBeLessThan(Math.min(...companies));
  });
});

describe('advanceAngle', () => {
  it('continua girando no modo livre', () => {
    const next = advanceAngle(
      { currentAngle: 0.2, targetAngle: 0, mode: 'idle', reducedMotion: false },
      1,
    );

    expect(next).toBeCloseTo(0.2 + IDLE_SPIN_RADIANS_PER_SECOND);
  });

  it('aproxima pelo caminho mais curto quando a seção trava o foco', () => {
    const target = Math.PI * 2 - 0.05;
    const next = advanceAngle(
      { currentAngle: 0.1, targetAngle: target, mode: 'locked', reducedMotion: false },
      0.05,
    );

    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(0.1);
  });

  it('encosta no ângulo da seção quando o movimento reduzido está ativo', () => {
    const target = Math.PI * 2 - 0.01;
    const next = advanceAngle(
      { currentAngle: 0.2, targetAngle: target, mode: 'locked', reducedMotion: true },
      1,
    );

    expect(next).toBeCloseTo(target);
  });

  it('mede o atalho entre dois ângulos', () => {
    expect(shortestAngleDelta(0.1, Math.PI * 2 - 0.1)).toBeCloseTo(-0.2);
  });
});
