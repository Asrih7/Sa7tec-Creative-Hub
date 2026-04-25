import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { MockDataService } from '../../services/mock-data.service';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, KpiCardComponent, LineChartComponent, BarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('list', [
      transition(':enter', [
        query('.alert-card, .plot-row, .chart-card, .kpi-grid > *', [
          style({ opacity: 0, transform: 'translateY(14px)' }),
          stagger(60, animate('420ms cubic-bezier(.22,1,.36,1)', style({ opacity: 1, transform: 'translateY(0)' }))),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class DashboardComponent {
  data = inject(MockDataService);

  plots = computed(() => this.data.plots());
  alerts = computed(() => this.data.alerts());

  soilHealth = computed(() => {
    const ps = this.plots();
    if (!ps.length) return 0;
    const score = ps.reduce((acc, p) => {
      const phScore  = 100 - Math.min(100, Math.abs(p.ph - 6.5) * 30);
      const moScore  = Math.min(100, p.moisture * 1.4);
      const ndviScore = p.ndvi * 100;
      return acc + (phScore * .25 + moScore * .35 + ndviScore * .4);
    }, 0) / ps.length;
    return Math.round(score);
  });

  waterUsage = computed(() => {
    const wu = this.data.waterUsage();
    return wu.reduce((s, p) => s + p.value, 0);
  });

  cropRecommendation = computed(() => {
    const ps = this.plots();
    const stressed = ps.filter(p => p.status === 'stress').length;
    if (stressed) return `Irrigate ${stressed} plot${stressed > 1 ? 's' : ''}`;
    return 'All plots optimal';
  });

  sustainability = computed(() => {
    const s = this.data.sustainability();
    return Math.min(100, Math.round((s.waterSavedM3 / 200) + (s.co2ReducedKg / 200)));
  });

  ndviLabels = computed(() => this.data.ndviHistory().map(p => p.date.slice(5)));
  ndviData   = computed(() => this.data.ndviHistory().map(p => p.value));
  moistureLabels = computed(() => this.data.moistureHistory().map(p => p.date));
  moistureData   = computed(() => this.data.moistureHistory().map(p => p.value));
  waterLabels = computed(() => this.data.waterUsage().map(p => p.date));
  waterData   = computed(() => this.data.waterUsage().map(p => p.value));

  fmtTime(ts: number) {
    const m = Math.floor((Date.now() - ts) / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    return `${Math.floor(m / 60)}h ago`;
  }
}
