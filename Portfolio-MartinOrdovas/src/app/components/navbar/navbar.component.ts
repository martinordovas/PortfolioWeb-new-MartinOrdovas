import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NAV_ITEMS } from '../../core/data/portfolio.data';
import { ScrollService } from '../../core/services/scroll.service';
import { NavItem } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-black/30 border-b border-white/10"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Terminal / Logo brand -->
          <a
            (click)="onNavigate('inicio', $event)"
            href="#inicio"
            class="group flex items-center gap-2.5 text-sm font-semibold tracking-wider text-[#ede6c8] hover:text-[#e192ab] transition-colors cursor-pointer select-none"
          >
            <span class="inline-block w-2.5 h-4 bg-[#e192ab] animate-pulse"></span>
            <span class="text-xs uppercase tracking-widest text-[#d39c7c]">martin</span>
            <span class="text-xs text-neutral-400 group-hover:text-white">portfolio</span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-6">
            @for (item of navItems; track item.id) {
              <a
                (click)="onNavigate(item.id, $event)"
                [href]="item.href"
                class="relative py-1 text-sm font-medium tracking-wide transition-colors cursor-pointer"
                [class.text-[#e192ab]]="scrollService.activeSection() === item.id"
                [class.text-neutral-400]="scrollService.activeSection() !== item.id"
                [class.hover:text-[#ede6c8]]="scrollService.activeSection() !== item.id"
              >
                {{ item.label }}
                <!-- Active underline bar -->
                <span
                  class="absolute bottom-0 left-0 h-[2px] bg-[#d39c7c] transition-all duration-300 rounded-full"
                  [class.w-full]="scrollService.activeSection() === item.id"
                  [class.w-0]="scrollService.activeSection() !== item.id"
                ></span>
              </a>
            }
          </div>

          <!-- Mobile Hamburger Toggle -->
          <div class="flex md:hidden">
            <button
              (click)="toggleMobileMenu()"
              type="button"
              class="p-2 rounded-lg text-neutral-300 hover:text-white focus:outline-none focus:ring-1 focus:ring-[#e192ab]"
              aria-label="Abrir menú de navegación"
            >
              <svg
                class="w-6 h-6 transition-transform"
                [class.rotate-90]="isMobileMenuOpen()"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                @if (!isMobileMenuOpen()) {
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                } @else {
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      @if (isMobileMenuOpen()) {
        <div
          class="md:hidden glass-card-nested border-t border-b border-white/10 px-4 pt-3 pb-5 space-y-2 backdrop-blur-xl bg-black/80 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          @for (item of navItems; track item.id) {
            <a
              (click)="onNavigate(item.id, $event)"
              [href]="item.href"
              class="block px-3 py-2.5 rounded-lg text-base font-medium tracking-wide transition-colors cursor-pointer"
              [class.bg-white/10]="scrollService.activeSection() === item.id"
              [class.text-[#e192ab]]="scrollService.activeSection() === item.id"
              [class.text-neutral-300]="scrollService.activeSection() !== item.id"
            >
              {{ item.label }}
            </a>
          }
        </div>
      }
    </nav>
  `,
})
export class NavbarComponent {
  protected readonly scrollService = inject(ScrollService);
  protected readonly navItems: NavItem[] = NAV_ITEMS;
  protected readonly isMobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  onNavigate(id: string, event: Event): void {
    event.preventDefault();
    this.scrollService.scrollToSection(id);
    this.isMobileMenuOpen.set(false);
  }
}
