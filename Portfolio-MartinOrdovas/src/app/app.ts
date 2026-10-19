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

  private readonly scrollService = inject(ScrollService);
  private readonly isBrowser: boolean;

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

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.scrollService.cleanup();
    }
  }
}
