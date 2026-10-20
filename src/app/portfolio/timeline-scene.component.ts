import {
  afterNextRender,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import type { SceneFocus, TimelineStop } from './timeline.model';
import { TimelineScene } from './timeline-scene';

@Component({
  selector: 'app-timeline-scene',
  templateUrl: './timeline-scene.component.html',
  styleUrl: './timeline-scene.component.css',
})
export class TimelineSceneComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  readonly stops = input.required<readonly TimelineStop[]>();
  readonly focus = input.required<SceneFocus>();

  private timeline: TimelineScene | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    afterNextRender(() => this.start());
    this.destroyRef.onDestroy(() => this.stop());

    effect(() => {
      const stops = this.stops();
      const focus = this.focus();
      this.timeline?.syncStops(stops);
      this.timeline?.setFocus(focus);
    });
  }

  private start(): void {
    const canvas = this.canvas().nativeElement;
    const view = canvas.ownerDocument.defaultView;
    const reducedMotion = view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    try {
      const timeline = new TimelineScene({ reducedMotion });
      timeline.mount(canvas);
      timeline.syncStops(this.stops());
      timeline.setFocus(this.focus());
      this.timeline = timeline;
    } catch {
      this.timeline = null;
      return;
    }

    if (!view?.ResizeObserver) {
      return;
    }

    this.resizeObserver = new view.ResizeObserver(() => {
      this.timeline?.resize(canvas.clientWidth, canvas.clientHeight);
    });
    this.resizeObserver.observe(canvas);
  }

  private stop(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.timeline?.unmount();
    this.timeline = null;
  }
}
