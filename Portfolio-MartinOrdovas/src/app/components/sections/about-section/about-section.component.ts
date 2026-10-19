import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROFILE_DATA, SKILLS_DATA } from '../../../core/data/portfolio.data';
import { ProfileInfo, Skill } from '../../../core/models/portfolio.model';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.css',
})
export class AboutSectionComponent {
  protected readonly profile: ProfileInfo = PROFILE_DATA;
  protected readonly skills: Skill[] = SKILLS_DATA;
}
