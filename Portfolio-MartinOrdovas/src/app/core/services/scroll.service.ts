import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  readonly activeSection = signal<string>('inicio');
  private scrollContainer: HTMLElement | null = null;
  private sectionIds: string[] = ['inicio', 'sobreMi', 'proyectos', 'contactame'];
  private isThrottled = false;

  scrollToSection(sectionId: string): void {
    const cleanId = sectionId.replace(/^#/, '');
    const element = document.getElementById(cleanId);
    if (!element) return;

    const targetTop = this.scrollContainer ? element.offsetTop : element.getBoundingClientRect().top + window.pageYOffset;
    const startTop = this.scrollContainer ? this.scrollContainer.scrollTop : window.pageYOffset;
    const distance = targetTop - startTop;

    // Adjusted duration in ms for custom scroll speed (e.g. 450ms for a snappy yet smooth transition)
    const duration = 450;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Ease-in-out cubic easing function
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentTop = startTop + distance * ease;

      if (this.scrollContainer) {
        this.scrollContainer.scrollTop = currentTop;
      } else {
        window.scrollTo(0, currentTop);
      }

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        this.activeSection.set(cleanId);
      }
    };

    requestAnimationFrame(animation);
  }

  initScrollSpy(sectionIds: string[], scrollContainer?: HTMLElement | null): void {
    this.sectionIds = sectionIds;
    this.scrollContainer = scrollContainer || null;

    if (this.scrollContainer) {
      this.updateActiveSection();
    }
  }

  onScroll(): void {
    if (!this.scrollContainer || this.isThrottled) {
      return;
    }

    this.isThrottled = true;
    requestAnimationFrame(() => {
      this.updateActiveSection();
      this.isThrottled = false;
    });
  }

  private updateActiveSection(): void {
    if (!this.scrollContainer) return;

    const scrollTop = this.scrollContainer.scrollTop;
    const containerHeight = this.scrollContainer.clientHeight;
    const focalPoint = scrollTop + containerHeight * 0.45;

    let closestId = this.sectionIds[0];
    let minDiff = Infinity;

    for (const id of this.sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;

      const top = el.offsetTop;
      const height = el.offsetHeight;
      const middle = top + height / 2;

      const diff = Math.abs(focalPoint - middle);
      if (diff < minDiff) {
        minDiff = diff;
        closestId = id;
      }
    }

    if (this.activeSection() !== closestId) {
      this.activeSection.set(closestId);
    }
  }

  cleanup(): void {
    this.scrollContainer = null;
  }
}
