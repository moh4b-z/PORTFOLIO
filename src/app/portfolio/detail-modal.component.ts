import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { LanguageService } from '../core/i18n/language.service';
import type { TimelineStop } from './timeline.model';

@Component({
  selector: 'app-detail-modal',
  templateUrl: './detail-modal.component.html',
  styleUrl: './detail-modal.component.css',
})
export class DetailModal {
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  readonly stop = input<TimelineStop | null>(null);
  readonly closed = output<void>();

  protected readonly i18n = inject(LanguageService);

  constructor() {
    effect(() => {
      const element = this.dialog()?.nativeElement;
      const stop = this.stop();
      if (!element) {
        return;
      }

      if (stop && !element.open) {
        try {
          element.showModal();
        } catch {
          element.setAttribute('open', '');
        }
        return;
      }

      if (!stop && element.open) {
        element.close();
      }
    });
  }

  protected onDialogClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.requestClose();
    }
  }

  protected requestClose(): void {
    const element = this.dialog()?.nativeElement;
    if (element?.open) {
      element.close();
      return;
    }

    this.closed.emit();
  }

  protected onDialogClose(): void {
    this.closed.emit();
  }
}
