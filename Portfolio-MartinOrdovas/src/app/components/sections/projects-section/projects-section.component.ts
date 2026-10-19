import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS_DATA } from '../../../core/data/portfolio.data';
import { Project } from '../../../core/models/portfolio.model';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-section.component.html',
  styleUrl: './projects-section.component.css',
})
export class ProjectsSectionComponent {
  @ViewChild('mainCard') mainCardRef?: ElementRef<HTMLElement>;
  @ViewChild('innerCard') innerCardRef?: ElementRef<HTMLElement>;

  protected readonly projects: Project[] = PROJECTS_DATA;
  protected readonly selectedProject = signal<Project>(PROJECTS_DATA[0]);
  protected readonly isChanging = signal<boolean>(false);
  protected readonly cardHeight = signal<string | null>(null);

  protected readonly currentIndex = computed(() => {
    const idx = this.projects.findIndex((p) => p.id === this.selectedProject().id);
    return idx >= 0 ? idx + 1 : 1;
  });

  selectProject(project: Project): void {
    if (this.selectedProject().id === project.id || this.isChanging()) {
      return;
    }

    const cardEl = this.mainCardRef?.nativeElement;
    const innerEl = this.innerCardRef?.nativeElement;

    // 1. Measure initial heights before tab switch
    const currentCardH = cardEl ? cardEl.offsetHeight : 0;
    const oldInnerH = innerEl ? innerEl.offsetHeight : 0;

    if (currentCardH > 0) {
      this.cardHeight.set(`${currentCardH}px`);
    }

    // 2. Start subtle cross-fade
    this.isChanging.set(true);

    setTimeout(() => {
      // 3. Switch project data
      this.selectedProject.set(project);

      // 4. In next frame, compute new height based on delta of content
      requestAnimationFrame(() => {
        if (cardEl && innerEl) {
          const newInnerH = innerEl.offsetHeight;
          const delta = newInnerH - oldInnerH;
          const targetCardH = Math.max(currentCardH + delta, 300);

          // Animate smoothly to target height (both expanding and shrinking)
          this.cardHeight.set(`${targetCardH}px`);
        }

        this.isChanging.set(false);

        // 5. Unlock height back to auto after CSS transition finishes
        setTimeout(() => {
          this.cardHeight.set(null);
        }, 370);
      });
    }, 130);
  }
}
