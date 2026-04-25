import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { MockDataService, Plot } from '../../services/mock-data.service';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';

@Component({
  selector: 'app-irrigation',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSlideToggleModule, LineChartComponent],
  templateUrl: './irrigation.component.html',
  styleUrl: './irrigation.component.scss',
  animations: [
    trigger('rows', [
      transition(':enter', [
        query('.iot-card', [
          style({ opacity: 0, transform: 'translateY(14px)' }),
          stagger(80, animate('420ms cubic-bezier(.22,1,.36,1)', style({ opacity: 1, transform: 'translateY(0)' }))),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class IrrigationComponent {
  data = inject(MockDataService);
  plots = computed(() => this.data.plots());

  totalActive = computed(() => this.plots().filter(p => p.irrigationOn).length);
  totalLitres = computed(() => this.plots().reduce((s, p) => s + (p.irrigationOn ? Math.round(p.area * 1200) : 0), 0));
  saved = computed(() => this.data.sustainability().waterSavedM3);

  moistureLabels = computed(() => this.data.moistureHistory().map(p => p.date));
  moistureData   = computed(() => this.data.moistureHistory().map(p => p.value));

  toggle(p: Plot) { this.data.toggleIrrigation(p.id, !p.irrigationOn); }
  autoAll() { for (const p of this.plots()) if (p.status === 'stress') this.data.toggleIrrigation(p.id, true); }
  stopAll() { for (const p of this.plots()) this.data.toggleIrrigation(p.id, false); }

  litres(p: Plot): number { return p.irrigationOn ? Math.round(p.area * 1200) : 0; }
}
