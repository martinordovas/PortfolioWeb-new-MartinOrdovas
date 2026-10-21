import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NAV_ITEMS } from '../../core/data/portfolio.data';
import { ScrollService } from '../../core/services/scroll.service';
import { NavItem } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  protected readonly scrollService = inject(ScrollService);
  protected readonly navItems: NavItem[] = NAV_ITEMS;
  protected readonly isMobileMenuOpen = signal<boolean>(false);

  // On mobile (<768px), navbar is always scrolled (fixed full-width top bar).
  protected readonly isNavbarScrolled = computed(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return isMobile || this.scrollService.activeSection() !== 'inicio' || this.isMobileMenuOpen();
  });

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  onNavigate(id: string, event: Event): void {
    event.preventDefault();
    this.scrollService.scrollToSection(id);
    this.isMobileMenuOpen.set(false);
  }
}
