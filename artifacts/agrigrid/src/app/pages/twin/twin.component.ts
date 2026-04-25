import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MockDataService, Plot } from '../../services/mock-data.service';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-twin',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSliderModule, MatButtonToggleModule, FormsModule],
  templateUrl: './twin.component.html',
  styleUrl: './twin.component.scss',
  animations: [
    trigger('panelIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.96)' }),
        animate('400ms cubic-bezier(.22,1,.36,1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class TwinComponent {
  data = inject(MockDataService);
  plots = computed(() => this.data.plots());
  selectedId = signal<string>(this.data.plots()[0]!.id);
  weeks = signal<number>(0);
  scenario = signal<'baseline' | 'drought' | 'rain' | 'irrigated'>('baseline');

  selected = computed(() => this.plots().find(p => p.id === this.selectedId()) ?? this.plots()[0]!);

  // simulated trajectory
  ndviAt = computed(() => {
    const p = this.selected();
    const w = this.weeks();
    let n = p.ndvi;
    const sc = this.scenario();
    if (sc === 'drought') n = Math.max(.1, n - w * .04);
    else if (sc === 'rain') n = Math.min(.95, n + w * .015);
    else if (sc === 'irrigated') n = Math.min(.92, n + w * .025);
    else n = Math.max(.2, Math.min(.9, n + Math.sin(w * .8) * .04));
    return n;
  });
  moistureAt = computed(() => {
    const p = this.selected();
    const w = this.weeks(); const sc = this.scenario();
    if (sc === 'drought') return Math.max(8, p.moisture - w * 6);
    if (sc === 'rain') return Math.min(95, p.moisture + w * 5);
    if (sc === 'irrigated') return Math.min(85, p.moisture + w * 3);
    return Math.max(15, Math.min(80, p.moisture + Math.sin(w * .5) * 6));
  });
  yieldAt = computed(() => {
    const base = this.selected().yieldEstimate;
    const ndvi = this.ndviAt();
    return Math.round(base * (ndvi / .65) * 10) / 10;
  });

  cells = Array.from({ length: 144 }, (_, i) => i);

  cellHealth(i: number): number {
    const p = this.selected();
    const w = this.weeks();
    const seed = (parseInt(p.id, 36) * 13 + i * 7) % 1000;
    const noise = (Math.sin(seed) + 1) / 2;
    let v = this.ndviAt() + (noise - .5) * .35;
    return Math.max(.02, Math.min(.98, v));
  }
  cellColor(i: number) {
    const v = this.cellHealth(i);
    if (v < .3) return '#9a3412';
    if (v < .5) return '#f59e0b';
    if (v < .7) return '#84cc16';
    return '#16a34a';
  }

  status = computed<{label: string, tone: string}>(() => {
    const n = this.ndviAt(), m = this.moistureAt();
    if (n < .35 || m < 18) return { label: 'Critical', tone: 'red' };
    if (n < .55 || m < 35) return { label: 'Stressed', tone: 'amber' };
    return { label: 'Healthy', tone: 'green' };
  });

  reset() { this.weeks.set(0); this.scenario.set('baseline'); }
}
