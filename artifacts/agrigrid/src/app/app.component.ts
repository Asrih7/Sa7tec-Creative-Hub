import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { DemoService } from './services/demo.service';
import { DemoOverlayComponent } from './components/demo-overlay/demo-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DemoOverlayComponent],
  template: `
    <div [class.dark-mode]="isDark()">
      <router-outlet />
      <app-demo-overlay />
    </div>
  `,
})
export class AppComponent {
  private theme = inject(ThemeService);
  // Touch DemoService so it's eagerly created
  private demo = inject(DemoService);
  isDark = computed(() => this.theme.isDark());
}
