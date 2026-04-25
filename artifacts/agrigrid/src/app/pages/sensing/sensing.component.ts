import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';
import { MockDataService, Plot } from '../../services/mock-data.service';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';

type Layer = 'ndvi' | 'moisture' | 'temp';

@Component({
  selector: 'app-sensing',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatButtonToggleModule, FormsModule, LineChartComponent],
  templateUrl: './sensing.component.html',
  styleUrl: './sensing.component.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms', style({ opacity: 1 }))]),
    ]),
  ],
})
export class SensingComponent {
  data = inject(MockDataService);
  plots = computed(() => this.data.plots());
  layer = signal<Layer>('ndvi');
  selectedId = signal<string>(this.data.plots()[0]!.id);

  selected = computed(() => this.plots().find(p => p.id === this.selectedId()) ?? this.plots()[0]!);

  ndviLabels = computed(() => this.data.ndviHistory().map(p => p.date.slice(5)));
  ndviData   = computed(() => this.data.ndviHistory().map(p => p.value));

  cells = Array.from({ length: 64 }, (_, i) => i);

  cellValue(i: number, layer: Layer): number {
    // deterministic pseudo-noise based on plot + index
    const p = this.selected();
    const seed = (parseInt(p.id, 36) * 31 + i * 7) % 1000;
    const r1 = (Math.sin(seed) + 1) / 2;
    const r2 = (Math.sin(seed * 2.3) + 1) / 2;
    const noise = (r1 * .6 + r2 * .4);
    if (layer === 'ndvi')     return Math.max(.05, Math.min(.95, p.ndvi + (noise - .5) * .4));
    if (layer === 'moisture') return Math.max(5, Math.min(95, p.moisture + (noise - .5) * 35));
    return Math.max(15, Math.min(42, p.temperature + (noise - .5) * 8));
  }

  cellColor(i: number) {
    const v = this.cellValue(i, this.layer());
    const l = this.layer();
    if (l === 'ndvi')     return this.lerpColor('#7f1d1d', '#16a34a', v);
    if (l === 'moisture') return this.lerpColor('#fef3c7', '#0ea5e9', v / 100);
    return this.lerpColor('#0ea5e9', '#ef4444', (v - 15) / 27);
  }

  legend = computed(() => {
    const l = this.layer();
    if (l === 'ndvi')     return { title: 'NDVI', from: 'Bare soil',   to: 'Dense canopy', unit: '' };
    if (l === 'moisture') return { title: 'Moisture', from: 'Dry',     to: 'Saturated',    unit: '%' };
    return { title: 'Surface temp', from: '15°C', to: '42°C', unit: '°C' };
  });

  avg = computed(() => {
    let s = 0;
    for (let i = 0; i < 64; i++) s += this.cellValue(i, this.layer());
    return s / 64;
  });

  private lerpColor(a: string, b: string, t: number): string {
    t = Math.max(0, Math.min(1, t));
    const ah = a.replace('#', ''), bh = b.replace('#', '');
    const ar = parseInt(ah.slice(0, 2), 16), ag = parseInt(ah.slice(2, 4), 16), ab = parseInt(ah.slice(4, 6), 16);
    const br = parseInt(bh.slice(0, 2), 16), bg = parseInt(bh.slice(2, 4), 16), bb = parseInt(bh.slice(4, 6), 16);
    return `rgb(${Math.round(ar + (br - ar) * t)}, ${Math.round(ag + (bg - ag) * t)}, ${Math.round(ab + (bb - ab) * t)})`;
  }
}
