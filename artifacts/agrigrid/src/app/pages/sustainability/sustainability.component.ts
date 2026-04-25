import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MockDataService } from '../../services/mock-data.service';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';

@Component({
  selector: 'app-sustainability',
  standalone: true,
  imports: [CommonModule, MatIconModule, KpiCardComponent, LineChartComponent, BarChartComponent],
  templateUrl: './sustainability.component.html',
  styleUrl: './sustainability.component.scss',
})
export class SustainabilityComponent {
  data = inject(MockDataService);
  s = computed(() => this.data.sustainability());

  waterLabels = computed(() => this.data.waterUsage().map(p => p.date));
  waterData   = computed(() => this.data.waterUsage().map(p => p.value));
  ndviLabels  = computed(() => this.data.ndviHistory().map(p => p.date.slice(5)));
  ndviData    = computed(() => this.data.ndviHistory().map(p => p.value));

  goals = computed(() => [
    { id: 2, title: 'Zero Hunger', value: this.s().yieldUpliftPct, unit: '%', label: 'yield uplift', color: '#dc7e3c' },
    { id: 6, title: 'Clean Water', value: this.s().waterSavedM3, unit: 'm³', label: 'water saved', color: '#26bde2' },
    { id: 12, title: 'Responsible Production', value: this.s().wasteReducedPct, unit: '%', label: 'post-harvest waste cut', color: '#bf8b2e' },
    { id: 13, title: 'Climate Action', value: this.s().co2ReducedKg, unit: 'kg', label: 'CO₂ avoided', color: '#3f7e44' },
    { id: 15, title: 'Life on Land', value: this.s().biodiversityScore, unit: '/100', label: 'biodiversity score', color: '#56c02b' },
  ]);
}
