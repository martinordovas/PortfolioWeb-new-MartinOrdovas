import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROFILE_DATA, SKILLS_DATA } from '../../../core/data/portfolio.data';
import { ProfileInfo, Skill } from '../../../core/models/portfolio.model';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      id="sobreMi"
      class="snap-section relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-6 lg:px-8 pt-20 pb-16"
    >
      <!-- Translucent Glassmorphism Card -->
      <div
        class="glass-card w-full max-w-5xl p-6 sm:p-8 lg:p-10 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300"
      >
        <!-- Heading -->
        <h2
          class="text-2xl sm:text-3xl font-bold tracking-tight text-[#e192ab] mb-6 sm:mb-8 drop-shadow-[2px_2px_4px_#402835]"
        >
          &gt; about me
        </h2>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <!-- Left Column: Bio & Photo -->
          <div class="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
            <p class="text-sm sm:text-base leading-relaxed text-[#ede6c8] drop-shadow">
              {{ profile.bio }}
            </p>

            <div
              class="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-2"
            >
              <!-- Photo with grayscale-to-color hover transition -->
              <div class="relative group shrink-0">
                <img
                  [src]="profile.photoUrl"
                  [alt]="profile.name"
                  class="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-xl border border-white/15 shadow-xl filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500 ease-out"
                />
                <div
                  class="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none"
                ></div>
              </div>

              <!-- Based in info -->
              <div class="text-center sm:text-left flex flex-col justify-center sm:pt-4">
                <span
                  class="text-xs uppercase tracking-widest text-[#d39c7c] font-semibold flex items-center justify-center sm:justify-start gap-1.5"
                >
                  <svg
                    class="w-3.5 h-3.5 text-[#d39c7c]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Based in
                </span>
                <p class="mt-1 text-base sm:text-lg font-bold text-[#ede6c8]">
                  {{ profile.location }}
                </p>
              </div>
            </div>
          </div>

          <!-- Right Column: Core Tech Stack -->
          <div class="lg:col-span-5">
            <div
              class="glass-card-nested p-5 sm:p-6 rounded-xl border border-white/10 shadow-xl transition-all duration-300 hover:scale-[1.01]"
            >
              <h3
                class="text-xs sm:text-sm font-semibold tracking-widest text-[#d39c7c] uppercase mb-4"
              >
                &gt; core stack
              </h3>

              <div class="space-y-4">
                @for (skill of skills; track skill.name) {
                  <div class="group">
                    <div class="flex items-center justify-between text-xs sm:text-sm text-[#ede6c8] mb-1.5">
                      <div class="flex items-center gap-2.5">
                        <img
                          [src]="skill.icon"
                          [alt]="skill.name"
                          class="w-5 h-5 object-contain transition-transform group-hover:scale-110"
                        />
                        <span class="font-medium tracking-tight group-hover:text-white transition-colors">
                          {{ skill.name }}
                        </span>
                      </div>
                      <span class="text-xs text-neutral-400 font-mono">{{ skill.percentage }}%</span>
                    </div>

                    <!-- Progress Bar -->
                    <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-[#d39c7c] rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(211,156,124,0.6)]"
                        [style.width.%]="skill.percentage"
                      ></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AboutSectionComponent {
  protected readonly profile: ProfileInfo = PROFILE_DATA;
  protected readonly skills: Skill[] = SKILLS_DATA;
}
