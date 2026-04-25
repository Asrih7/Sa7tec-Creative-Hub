import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-scenario-toolbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, MatMenuModule, MatSnackBarModule],
  template: `
    <div class="scenario-bar">
      <span class="badge" [attr.data-mode]="data.scenario()">
        <mat-icon>{{ icon() }}</mat-icon>
        <span>Scenario: <strong>{{ label() }}</strong></span>
      </span>
      <button mat-stroked-button [matMenuTriggerFor]="menu" matTooltip="Run a demo scenario">
        <mat-icon>science</mat-icon>
        <span class="hide-sm">Simulate</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="drought()">
          <mat-icon style="color: var(--warn)">local_fire_department</mat-icon>
          <span>Simulate drought</span>
        </button>
        <button mat-menu-item (click)="demand()">
          <mat-icon style="color: var(--warning)">trending_up</mat-icon>
          <span>Increase demand</span>
        </button>
        <button mat-menu-item (click)="autoIrrigation()">
          <mat-icon style="color: var(--accent)">water_drop</mat-icon>
          <span>Auto irrigation trigger</span>
        </button>
        <button mat-menu-item (click)="refresh()">
          <mat-icon>autorenew</mat-icon>
          <span>Refresh sensors</span>
        </button>
        <button mat-menu-item (click)="reset()">
          <mat-icon>restart_alt</mat-icon>
          <span>Reset to normal</span>
        </button>
      </mat-menu>
    </div>
  `,
  styles: [`
    .scenario-bar { display: flex; align-items: center; gap: 8px; }
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 10px; border-radius: 999px;
      font-size: .8rem; font-weight: 500;
      background: var(--surface-2); color: var(--text-soft);
      border: 1px solid var(--border);
    }
    .badge mat-icon { font-size: 16px; height: 16px; width: 16px; }
    .badge[data-mode="drought"] { background: var(--warn-soft); color: var(--warn); border-color: rgba(239,68,68,.3); }
    .badge[data-mode="high-demand"] { background: var(--warning-soft); color: var(--warning); border-color: rgba(245,158,11,.3); }
    .badge[data-mode="normal"] { background: var(--primary-soft); color: var(--primary); border-color: rgba(34,197,94,.3); }
    @media (max-width: 700px) { .badge, .hide-sm { display: none; } }
  `],
})
export class ScenarioToolbarComponent {
  data = inject(MockDataService);
  private snack = inject(MatSnackBar);

  icon = computed(() => {
    const m = this.data.scenario();
    return m === 'drought' ? 'local_fire_department' : m === 'high-demand' ? 'trending_up' : 'check_circle';
  });
  label = computed(() => {
    const m = this.data.scenario();
    return m === 'drought' ? 'Drought' : m === 'high-demand' ? 'High demand' : 'Normal';
  });

  drought() {
    this.data.simulateDrought();
    this.snack.open('Drought scenario activated — vegetation stress rising across plots.', 'OK', { duration: 3500 });
  }
  demand() {
    this.data.simulateHighDemand();
    this.snack.open('High demand scenario — production plan expanded.', 'OK', { duration: 3000 });
  }
  autoIrrigation() {
    const n = this.data.autoIrrigationTrigger();
    this.snack.open(n ? `Auto-irrigation triggered on ${n} stressed plot${n > 1 ? 's' : ''}.` : 'No plots required intervention right now.', 'OK', { duration: 3000 });
  }
  refresh() {
    this.data.refresh();
    this.snack.open('Sensor data refreshed.', 'OK', { duration: 1800 });
  }
  reset() {
    this.data.resetScenario();
    this.snack.open('Reset to normal operating conditions.', 'OK', { duration: 2000 });
  }
}
