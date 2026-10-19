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

    if (this.scrollContainer && element) {
      // Calculate exact offset inside scroll container
      const targetTop = element.offsetTop;
      this.scrollContainer.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
      this.activeSection.set(cleanId);
    } else if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection.set(cleanId);
    }
  }

  initScrollSpy(sectionIds: string[], scrollContainer?: HTMLElement | null): void {
    this.sectionIds = sectionIds;
    this.scrollContainer = scrollContainer || null;

    if (this.scrollContainer) {
      // Initial check
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
    // Target the center-third line of current view
    const focalPoint = scrollTop + containerHeight * 0.45;

    let closestId = this.sectionIds[0];
    let minDiff = Infinity;

    for (const id of this.sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;

      const top = el.offsetTop;
      const height = el.offsetHeight;
      const middle = top + height / 2;

      // Distance from middle of section to focal point
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
