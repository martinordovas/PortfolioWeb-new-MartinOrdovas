import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS_DATA } from '../../../core/data/portfolio.data';
import { Project } from '../../../core/models/portfolio.model';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-section.component.html',
})
export class ProjectsSectionComponent {
  protected readonly projects: Project[] = PROJECTS_DATA;
  protected readonly selectedProject = signal<Project>(PROJECTS_DATA[0]);

  selectProject(project: Project): void {
    this.selectedProject.set(project);
  }
}
