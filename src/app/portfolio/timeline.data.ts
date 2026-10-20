import type { PortfolioSection, TimelineStop } from './timeline.model';

/**
 * Seções da página e pontos da volta 3D.
 * Para incluir um local, acrescente o texto em `locales/pt.ts` e um item em `TIMELINE_STOPS`.
 * `imageSrc` alimenta o pin e o modal quando a imagem existir.
 */
export const PORTFOLIO_SECTIONS: readonly PortfolioSection[] = [
  {
    id: 'intro',
    titleKey: 'sections.intro.title',
    leadKey: 'sections.intro.lead',
  },
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
  {
    id: 'contact',
    titleKey: 'sections.contact.title',
    leadKey: 'sections.contact.lead',
  },
];

export const TIMELINE_STOPS: readonly TimelineStop[] = [
  {
    id: 'education-one',
    sectionId: 'education',
    position: 0.08,
    titleKey: 'timeline.education.one.title',
    periodKey: 'timeline.education.one.period',
    summaryKey: 'timeline.education.one.summary',
    imageSrc: null,
  },
  {
    id: 'education-two',
    sectionId: 'education',
    position: 0.22,
    titleKey: 'timeline.education.two.title',
    periodKey: 'timeline.education.two.period',
    summaryKey: 'timeline.education.two.summary',
    imageSrc: null,
  },
  {
    id: 'company-one',
    sectionId: 'companies',
    position: 0.55,
    titleKey: 'timeline.companies.one.title',
    periodKey: 'timeline.companies.one.period',
    summaryKey: 'timeline.companies.one.summary',
    imageSrc: null,
  },
  {
    id: 'company-two',
    sectionId: 'companies',
    position: 0.72,
    titleKey: 'timeline.companies.two.title',
    periodKey: 'timeline.companies.two.period',
    summaryKey: 'timeline.companies.two.summary',
    imageSrc: null,
  },
];

export function stopsForSection(
  sectionId: PortfolioSection['id'],
  stops: readonly TimelineStop[] = TIMELINE_STOPS,
): readonly TimelineStop[] {
  return stops
    .filter((stop) => stop.sectionId === sectionId)
    .sort((a, b) => a.position - b.position);
}
