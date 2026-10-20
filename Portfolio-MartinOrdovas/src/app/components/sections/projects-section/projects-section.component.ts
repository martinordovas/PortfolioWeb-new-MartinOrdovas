import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS_DATA } from '../../../core/data/portfolio.data';
import { Project } from '../../../core/models/portfolio.model';
import { ScrollService } from '../../../core/services/scroll.service';

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

  protected readonly scrollService = inject(ScrollService);
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

    const currentCardH = cardEl ? cardEl.offsetHeight : 0;
    const oldInnerH = innerEl ? innerEl.offsetHeight : 0;

    if (currentCardH > 0) {
      this.cardHeight.set(`${currentCardH}px`);
    }

    this.isChanging.set(true);

    setTimeout(() => {
      this.selectedProject.set(project);

      requestAnimationFrame(() => {
        if (cardEl && innerEl) {
          const newInnerH = innerEl.offsetHeight;
          const delta = newInnerH - oldInnerH;
          const targetCardH = Math.max(currentCardH + delta, 300);

          this.cardHeight.set(`${targetCardH}px`);
        }

        this.isChanging.set(false);

        setTimeout(() => {
          this.cardHeight.set(null);
        }, 370);
      });
    }, 130);
  }
}
