import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { ThemeService } from '../../services/theme.service';
import { DemoService } from '../../services/demo.service';
import { MockDataService } from '../../services/mock-data.service';
import { ScenarioToolbarComponent } from '../../components/scenario-toolbar/scenario-toolbar.component';

interface NavLink { label: string; icon: string; route: string; }

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterLinkActive, RouterOutlet,
    MatSidenavModule, MatIconModule, MatButtonModule, MatTooltipModule, MatMenuModule, MatBadgeModule,
    ScenarioToolbarComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private theme = inject(ThemeService);
  demo = inject(DemoService);
  data = inject(MockDataService);
  private router = inject(Router);

  isDark = computed(() => this.theme.isDark());
  alertCount = computed(() => this.data.alerts().length);
  collapsed = signal(false);

  links: NavLink[] = [
    { label: 'Dashboard', icon: 'dashboard', route: 'dashboard' },
    { label: 'Plot Map', icon: 'map', route: 'map' },
    { label: 'AI Recommendations', icon: 'auto_awesome', route: 'ai' },
    { label: 'Remote Sensing', icon: 'satellite_alt', route: 'sensing' },
    { label: 'Smart Irrigation', icon: 'water_drop', route: 'irrigation' },
    { label: 'Blockchain Ledger', icon: 'verified', route: 'blockchain' },
    { label: 'Sustainability', icon: 'eco', route: 'sustainability' },
    { label: 'Problems & Solutions', icon: 'lightbulb', route: 'problems' },
    { label: 'Architecture', icon: 'account_tree', route: 'architecture' },
    { label: 'Digital Twin', icon: '3d_rotation', route: 'twin' },
  ];

  toggleTheme() { this.theme.toggle(); }
  toggleCollapsed() { this.collapsed.update(v => !v); }
  startDemo() { this.demo.start(); }
  goLanding() { this.router.navigate(['/']); }
}
