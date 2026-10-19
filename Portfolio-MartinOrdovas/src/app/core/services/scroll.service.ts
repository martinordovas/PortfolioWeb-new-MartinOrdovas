import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  readonly activeSection = signal<string>('inicio');
  private observer: IntersectionObserver | null = null;

  scrollToSection(sectionId: string): void {
    const cleanId = sectionId.replace(/^#/, '');
    const element = document.getElementById(cleanId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection.set(cleanId);
    }
  }

  initScrollSpy(sectionIds: string[], scrollContainer?: HTMLElement | null): void {
    this.cleanup();

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const options: IntersectionObserverInit = {
      root: scrollContainer || null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.3,
    };

    this.observer = new IntersectionObserver((entries) => {
      // Find the entry that has the highest intersection ratio
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const topEntry = visibleEntries[0];
        if (topEntry.target.id) {
          this.activeSection.set(topEntry.target.id);
        }
      }
    }, options);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        this.observer?.observe(el);
      }
    });
  }

  cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
