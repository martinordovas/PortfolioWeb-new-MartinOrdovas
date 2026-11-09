import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollService } from './core/services/scroll.service';
import { ParticleBackgroundComponent } from './components/particle-background/particle-background.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ScrollIndicatorsComponent } from './components/scroll-indicators/scroll-indicators.component';
import { HeroSectionComponent } from './components/sections/hero-section/hero-section.component';
import { AboutSectionComponent } from './components/sections/about-section/about-section.component';
import { ProjectsSectionComponent } from './components/sections/projects-section/projects-section.component';
import { ContactSectionComponent } from './components/sections/contact-section/contact-section.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ParticleBackgroundComponent,
    NavbarComponent,
    ScrollIndicatorsComponent,
    HeroSectionComponent,
    AboutSectionComponent,
    ProjectsSectionComponent,
    ContactSectionComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainerRef?: ElementRef<HTMLElement>;

  protected readonly scrollService = inject(ScrollService);
  private readonly isBrowser: boolean;

  private touchStartX = 0;
  private touchEndX = 0;
  private lastSwipeTime = 0;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      const container = this.scrollContainerRef?.nativeElement || null;
      this.scrollService.initScrollSpy(
        ['inicio', 'sobreMi', 'proyectos', 'contactame'],
        container
      );
    }
  }

  onContainerScroll(): void {
    if (this.isBrowser) {
      this.scrollService.onScroll();
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.isBrowser || window.innerWidth >= 768) return;
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  onWheel(event: WheelEvent): void {
    if (!this.isBrowser || window.innerWidth >= 768) return;
    const now = Date.now();
    if (now - this.lastSwipeTime < 500) return;

    if (Math.abs(event.deltaX) > 20) {
      this.lastSwipeTime = now;
      if (event.deltaX > 0) {
        this.navigateRelative(1); // next section
      } else {
        this.navigateRelative(-1); // prev section
      }
    }
  }

  private handleSwipe(): void {
    const now = Date.now();
    if (now - this.lastSwipeTime < 500) return;

    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 35) {
      this.lastSwipeTime = now;
      if (diff > 0) {
        this.navigateRelative(1); // swipe left -> next section
      } else {
        this.navigateRelative(-1); // swipe right -> prev section
      }
    }
  }

  private navigateRelative(direction: number): void {
    const sections = ['inicio', 'sobreMi', 'proyectos', 'contactame'];
    const current = this.scrollService.activeSection();
    const currentIndex = sections.indexOf(current);
    const newIndex = Math.min(Math.max(currentIndex + direction, 0), sections.length - 1);
    if (newIndex !== currentIndex) {
      this.scrollService.scrollToSection(sections[newIndex]);
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.scrollService.cleanup();
    }
  }
}
