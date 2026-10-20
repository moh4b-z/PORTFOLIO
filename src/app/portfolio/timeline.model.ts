import type { TranslationKey } from '../core/i18n/translate';

export const SECTION_IDS = ['intro', 'education', 'companies', 'contact'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type TimelineSectionId = Extract<SectionId, 'education' | 'companies'>;

export interface PortfolioSection {
  id: SectionId;
  titleKey: TranslationKey;
  leadKey: TranslationKey;
}

export interface TimelineStop {
  id: string;
  sectionId: TimelineSectionId;
  /** Posição de 0 a 1 ao longo de uma volta da linha do tempo. */
  position: number;
  titleKey: TranslationKey;
  periodKey: TranslationKey;
  summaryKey: TranslationKey;
  imageSrc: string | null;
}

export interface SectionRect {
  id: SectionId;
  top: number;
  height: number;
}

export type SceneMode = 'idle' | 'locked';

export interface SceneFocus {
  mode: SceneMode;
  /** Ângulo, em radianos, do ponto que deve ficar de frente para a câmera. */
  targetAngle: number;
}

export interface FocusFrame extends SceneFocus {
  sectionId: SectionId;
  stopId: string | null;
}
