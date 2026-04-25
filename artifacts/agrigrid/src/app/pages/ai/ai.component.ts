import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { MockDataService, Plot } from '../../services/mock-data.service';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule, MatSliderModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './ai.component.html',
  styleUrl: './ai.component.scss',
  animations: [
    trigger('think', [
      transition(':enter', [
        query('.factor', [
          style({ opacity: 0, transform: 'translateX(-10px)' }),
          stagger(120, animate('420ms cubic-bezier(.22,1,.36,1)', style({ opacity: 1, transform: 'translateX(0)' }))),
        ]),
      ]),
    ]),
  ],
})
export class AiComponent {
  data = inject(MockDataService);
  plots = computed(() => this.data.plots());
  selectedId = signal<string>(this.data.plots()[0]!.id);

  // overrides
  moisture = signal<number>(40);
  temperature = signal<number>(26);
  demand = signal<number>(60);

  selected = computed(() => this.plots().find(p => p.id === this.selectedId()) ?? this.plots()[0]!);

  computing = signal(false);
  showResult = signal(true);

  result = computed(() => {
    const p = this.selected();
    const m = this.moisture(), t = this.temperature(), d = this.demand();
    const stress = m < 30 || p.ndvi < 0.4;
    const heat = t > 32;
    const cropChoice = heat ? 'Olive' : d > 70 ? 'Tomato' : p.crop;
    const planting = stress ? 'In 5 days (after irrigation cycle)' : t > 30 ? 'After Sept 5 (cooler window)' : p.plantingTime;
    const yieldEst = Math.max(1.5, Math.round(((p.ndvi * 8) + (m / 25) - (heat ? 1 : 0) + (d / 80)) * 10) / 10);
    const water = stress ? Math.round(p.area * 22) : Math.round(p.area * 12);
    const confidence = Math.min(98, Math.round(60 + (p.ndvi * 30) + (m / 4) - (heat ? 10 : 0)));
    return { cropChoice, planting, yieldEst, water, confidence, stress, heat };
  });

  factors = computed(() => {
    const p = this.selected();
    const m = this.moisture(), t = this.temperature(), d = this.demand();
    return [
      { icon: 'water_drop', label: 'Soil moisture', value: `${m}%`, weight: m < 30 ? 'high' : 'normal', impact: m < 30 ? 'Triggers urgent irrigation rule' : 'Within optimal range' },
      { icon: 'thermostat', label: 'Air temperature', value: `${t}°C`, weight: t > 32 ? 'high' : 'normal', impact: t > 32 ? 'Heat stress — shifts crop choice' : 'Comfortable for growth' },
      { icon: 'satellite_alt', label: 'Satellite NDVI', value: `${p.ndvi}`, weight: p.ndvi < .4 ? 'high' : 'normal', impact: p.ndvi < .4 ? 'Vegetation health declining' : 'Vegetation tracking healthy' },
      { icon: 'science', label: `Soil pH / N·P·K`, value: `${p.ph} / ${p.n}·${p.p}·${p.k}`, weight: p.ph > 7.4 ? 'high' : 'normal', impact: p.ph > 7.4 ? 'Salinity risk — apply gypsum' : 'Balanced nutrient profile' },
      { icon: 'trending_up', label: 'Market demand', value: `${d}%`, weight: d > 70 ? 'high' : 'normal', impact: d > 70 ? 'Suggests rotation to higher-value crop' : 'Stable demand' },
    ];
  });

  recompute() {
    this.computing.set(true);
    this.showResult.set(false);
    setTimeout(() => {
      this.computing.set(false);
      this.showResult.set(true);
    }, 900);
  }

  selectPlot(id: string) {
    this.selectedId.set(id);
    const p = this.plots().find(pp => pp.id === id)!;
    this.moisture.set(p.moisture);
    this.temperature.set(Math.round(p.temperature));
    this.recompute();
  }
}
