import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROFILE_DATA } from '../../../core/data/portfolio.data';
import { ScrollService } from '../../../core/services/scroll.service';
import { ProfileInfo } from '../../../core/models/portfolio.model';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
})
export class HeroSectionComponent {
  protected readonly scrollService = inject(ScrollService);
  protected readonly profile: ProfileInfo = PROFILE_DATA;

  onNavigate(id: string, event: Event): void {
    event.preventDefault();
    this.scrollService.scrollToSection(id);
  }
}
