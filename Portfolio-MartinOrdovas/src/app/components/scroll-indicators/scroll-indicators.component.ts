import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NAV_ITEMS } from '../../core/data/portfolio.data';
import { ScrollService } from '../../core/services/scroll.service';
import { NavItem } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-scroll-indicators',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-indicators.component.html',
})
export class ScrollIndicatorsComponent {
  protected readonly scrollService = inject(ScrollService);
  protected readonly navItems: NavItem[] = NAV_ITEMS;

  onDotClick(id: string): void {
    this.scrollService.scrollToSection(id);
  }
}
