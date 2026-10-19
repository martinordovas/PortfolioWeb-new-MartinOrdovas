import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROFILE_DATA, SOCIAL_LINKS } from '../../../core/data/portfolio.data';
import { ProfileInfo, SocialLink } from '../../../core/models/portfolio.model';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-section.component.html',
})
export class ContactSectionComponent {
  protected readonly profile: ProfileInfo = PROFILE_DATA;
  protected readonly socialLinks: SocialLink[] = SOCIAL_LINKS;
  protected readonly copied = signal<boolean>(false);

  copyEmail(): void {
    navigator.clipboard.writeText('martinordovas@gmail.com').then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    });
  }
}
