import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS_DATA } from '../../../core/data/portfolio.data';
import { Project } from '../../../core/models/portfolio.model';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      id="proyectos"
      class="snap-section relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-6 lg:px-8 pt-20 pb-16"
    >
      <!-- Translucent Glassmorphism Card -->
      <div
        class="glass-card w-full max-w-5xl p-6 sm:p-8 lg:p-10 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300"
      >
        <!-- Heading -->
        <h2
          class="text-2xl sm:text-3xl font-bold tracking-tight text-[#e192ab] mb-6 drop-shadow-[2px_2px_4px_#402835]"
        >
          &gt; projects
        </h2>

        <!-- Tabs Pill Switcher -->
        <div class="flex flex-wrap items-center gap-2.5 sm:gap-4 mb-6 sm:mb-8">
          @for (project of projects; track project.id) {
            <button
              type="button"
              (click)="selectProject(project)"
              class="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer focus:outline-none"
              [class.glass-btn-active]="selectedProject().id === project.id"
              [class.scale-[1.03]]="selectedProject().id === project.id"
              [class.glass-btn]="selectedProject().id !== project.id"
              [class.text-[#ede6c8]]="selectedProject().id !== project.id"
            >
              {{ project.tabLabel }}
            </button>
          }
        </div>

        <!-- Project Detail Card -->
        <div
          class="glass-card-nested p-5 sm:p-7 rounded-xl border border-white/10 shadow-2xl transition-all duration-500"
        >
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <!-- Project Image Mockup -->
            <div class="lg:col-span-7 flex justify-center order-2 lg:order-1">
              <div class="relative w-full max-w-md lg:max-w-none group">
                <img
                  [src]="selectedProject().image"
                  [alt]="selectedProject().title"
                  class="w-full max-h-72 sm:max-h-80 object-cover rounded-xl border border-[#e192ab]/40 shadow-[0_0_15px_rgba(225,146,171,0.35)] transition-all duration-500 group-hover:shadow-[0_0_22px_rgba(225,146,171,0.6)] group-hover:scale-[1.01]"
                />
              </div>
            </div>

            <!-- Project Details -->
            <div class="lg:col-span-5 flex flex-col justify-between space-y-4 order-1 lg:order-2">
              <div>
                <!-- Title -->
                <h3 class="text-xl sm:text-2xl font-bold text-[#ede6c8] tracking-tight">
                  {{ selectedProject().title }}
                </h3>

                <!-- Subtitle / Short description -->
                <p class="mt-2 text-xs sm:text-sm text-[#d39c7c] leading-relaxed font-medium">
                  {{ selectedProject().subtitle }}
                </p>

                <!-- Bullet points list -->
                <ul class="mt-4 space-y-2 text-xs sm:text-sm text-[#ede6c8]/90">
                  @for (bullet of selectedProject().bullets; track bullet) {
                    <li class="flex items-start gap-2">
                      <span class="text-[#d39c7c] font-bold shrink-0">&gt;</span>
                      <span class="leading-relaxed">{{ bullet }}</span>
                    </li>
                  }
                </ul>

                <!-- Tech Tags -->
                @if (selectedProject().tags && selectedProject().tags!.length > 0) {
                  <div class="flex flex-wrap gap-1.5 pt-4">
                    @for (tag of selectedProject().tags; track tag) {
                      <span
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-white/5 border border-white/10 text-neutral-300"
                      >
                        {{ tag }}
                      </span>
                    }
                  </div>
                }
              </div>

              <!-- Links -->
              <div class="flex items-center gap-3 pt-3">
                @if (selectedProject().githubUrl) {
                  <a
                    [href]="selectedProject().githubUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="glass-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#ede6c8] flex items-center gap-1.5"
                  >
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                    Repo
                  </a>
                }
                @if (selectedProject().demoUrl) {
                  <a
                    [href]="selectedProject().demoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="glass-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#e192ab] flex items-center gap-1.5 border-[#e192ab]/40"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Live Demo
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ProjectsSectionComponent {
  protected readonly projects: Project[] = PROJECTS_DATA;
  protected readonly selectedProject = signal<Project>(PROJECTS_DATA[0]);

  selectProject(project: Project): void {
    this.selectedProject.set(project);
  }
}
