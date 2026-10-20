import { Component, inject, OnInit, OnDestroy, signal, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PROFILE_DATA } from '../../../core/data/portfolio.data';
import { ScrollService } from '../../../core/services/scroll.service';
import { ProfileInfo } from '../../../core/models/portfolio.model';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  protected readonly scrollService = inject(ScrollService);
  protected readonly profile: ProfileInfo = PROFILE_DATA;
  private isBrowser: boolean;

  protected typedText = signal<string>('');
  private phrases: string[] = [
    PROFILE_DATA.role,
    '> Linux Enthusiast & Open Source Fan.',
    '> Building High-Performance Web Apps.',
    '> Full Stack Developer (Java, SQL, C#, Angular).'
  ];
  private phraseIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private timer: any = null;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startTyping();
    } else {
      this.typedText.set(this.profile.role);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }

  private startTyping(): void {
    const currentPhrase = this.phrases[this.phraseIndex];

    if (this.isDeleting) {
      this.charIndex--;
      this.typedText.set(currentPhrase.substring(0, this.charIndex));
    } else {
      this.charIndex++;
      this.typedText.set(currentPhrase.substring(0, this.charIndex));
    }

    let speed = this.isDeleting ? 30 : 65;

    if (!this.isDeleting && this.charIndex === currentPhrase.length) {
      speed = 2200; // Pause at the end
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      speed = 400; // Pause before next phrase
    }

    this.timer = setTimeout(() => this.startTyping(), speed);
  }

  onNavigate(id: string, event: Event): void {
    event.preventDefault();
    this.scrollService.scrollToSection(id);
  }
}
