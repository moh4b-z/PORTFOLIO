import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { PORTFOLIO_SECTIONS, stopsForSection, TIMELINE_STOPS } from '../../data/timeline.data';
import type { FocusFrame, SectionId, SectionRect, TimelineStop } from '../../models/timeline.model';
import { focusOnStop, resolveScrollFocus } from '../../scene/scene-focus';
import { DetailModal } from '../../components/detail-modal/detail-modal.component';
import { TimelineSceneComponent } from '../../components/timeline-scene/timeline-scene.component';

@Component({
  selector: 'app-portfolio-page',
  imports: [TimelineSceneComponent, DetailModal],
  templateUrl: './portfolio-page.component.html',
  styleUrl: './portfolio-page.component.css',
})
export class PortfolioPage {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly i18n = inject(LanguageService);
  protected readonly sections = PORTFOLIO_SECTIONS;
  protected readonly stops = TIMELINE_STOPS;

  private readonly focusFrame = signal<FocusFrame>({
    mode: 'idle',
    sectionId: 'intro',
    stopId: null,
    targetAngle: 0,
  });
  private readonly openedId = signal<string | null>(null);
  private pauseScrollFocus = false;
  private scrollFrame = 0;

  protected readonly sceneFocus = computed(() => ({
    mode: this.focusFrame().mode,
    targetAngle: this.focusFrame().targetAngle,
  }));
  protected readonly activeSectionId = computed(() => this.focusFrame().sectionId);
  protected readonly activeStopId = computed(() => this.focusFrame().stopId);
  protected readonly openedStop = computed(
    () => this.stops.find((stop) => stop.id === this.openedId()) ?? null,
  );

  constructor() {
    afterNextRender(() => this.listenToScroll());
  }

  protected stopsOf(sectionId: SectionId): readonly TimelineStop[] {
    return stopsForSection(sectionId, this.stops);
  }

  protected openStop(stopId: string): void {
    const stop = this.stops.find((item) => item.id === stopId);
    if (!stop) {
      return;
    }

    this.openedId.set(stop.id);
    this.pauseScrollFocus = true;
    this.focusFrame.set(focusOnStop(stop));
  }

  protected closeStop(): void {
    if (this.openedId() === null) {
      return;
    }

    this.openedId.set(null);
    this.pauseScrollFocus = false;
    this.publishFocus();
  }

  private listenToScroll(): void {
    const view = this.document.defaultView;
    if (!view) {
      return;
    }

    const onScroll = () => {
      if (this.scrollFrame !== 0) {
        return;
      }
      this.scrollFrame = view.requestAnimationFrame(() => {
        this.scrollFrame = 0;
        this.publishFocus();
      });
    };

    this.publishFocus();
    view.addEventListener('scroll', onScroll, { passive: true });
    view.addEventListener('resize', onScroll);

    this.destroyRef.onDestroy(() => {
      view.removeEventListener('scroll', onScroll);
      view.removeEventListener('resize', onScroll);
      if (this.scrollFrame !== 0) {
        view.cancelAnimationFrame(this.scrollFrame);
      }
    });
  }

  private publishFocus(): void {
    if (this.pauseScrollFocus) {
      return;
    }

    const view = this.document.defaultView;
    if (!view) {
      return;
    }

    this.focusFrame.set(
      resolveScrollFocus(this.sections, this.stops, this.readRects(), view.innerHeight),
    );
  }

  private readRects(): SectionRect[] {
    const root = this.host.nativeElement;
    const rects: SectionRect[] = [];

    for (const section of this.sections) {
      const element = root.querySelector(`[data-section='${section.id}']`);
      if (!(element instanceof HTMLElement)) {
        continue;
      }
      const rect = element.getBoundingClientRect();
      rects.push({ id: section.id, top: rect.top, height: rect.height });
    }

    return rects;
  }
}
