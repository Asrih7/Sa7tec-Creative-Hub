import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-problems',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './problems.component.html',
  styleUrl: './problems.component.scss',
  animations: [
    trigger('list', [
      transition(':enter', [
        query('.pair', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(120, animate('500ms cubic-bezier(.22,1,.36,1)', style({ opacity: 1, transform: 'translateY(0)' }))),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class ProblemsComponent {
  pairs = [
    {
      pIcon: 'water_damage', pTitle: 'Water scarcity & over-irrigation',
      pBody: 'Farmers in arid regions waste up to 60% of irrigation water through fixed-schedule flood watering, while neighbouring plots stay parched.',
      sIcon: 'water_drop', sTitle: 'Sensor-driven precision irrigation',
      sBody: 'Per-plot soil moisture sensors trigger drip irrigation only when needed. AI cuts water use by ~32% while raising yields.',
      stat: '−32% water', tone: 'blue',
    },
    {
      pIcon: 'help_outline', pTitle: 'Guesswork on what to plant',
      pBody: 'Smallholders rely on tradition and word-of-mouth, missing market shifts and climate signals — leading to bad seasons and debt.',
      sIcon: 'auto_awesome', sTitle: 'Explainable AI recommendations',
      sBody: 'AgriGrid fuses soil, satellite, weather and market data to suggest the best crop, planting window and yield estimate, with reasons.',
      stat: '+18% yield', tone: 'green',
    },
    {
      pIcon: 'satellite', pTitle: 'No early warning for crop stress',
      pBody: 'By the time a disease or drought is visible, half the field is lost. Field walks cannot scale across cooperatives.',
      sIcon: 'visibility', sTitle: 'Continuous remote sensing',
      sBody: 'Sentinel-2 NDVI tracks every plot every revisit. Drops below 0.4 raise alerts and trigger AI re-scoring automatically.',
      stat: '5d earlier', tone: 'amber',
    },
    {
      pIcon: 'verified_user', pTitle: 'No trust in supply chain claims',
      pBody: 'Buyers and certifiers cannot verify whether a crop was grown sustainably or where exactly it came from.',
      sIcon: 'link', sTitle: 'Blockchain provenance ledger',
      sBody: 'Every irrigation, harvest, transport and sale event is hashed into an immutable chain that buyers can audit in seconds.',
      stat: '100% traceable', tone: 'purple',
    },
    {
      pIcon: 'co2', pTitle: 'Climate footprint invisible to farmers',
      pBody: 'Farmers cannot prove the CO₂ they save through better practices, missing out on carbon credits and premium pricing.',
      sIcon: 'eco', sTitle: 'Sustainability scoring',
      sBody: 'Live counters quantify water, CO₂, waste and biodiversity impact, mapped to UN SDGs and exportable as verifiable proof.',
      stat: '−1.4t CO₂', tone: 'green',
    },
    {
      pIcon: 'cell_tower', pTitle: 'Fragmented tools, no single view',
      pBody: 'Sensors, satellites, weather feeds and ledgers all live in separate apps. Decisions take days instead of minutes.',
      sIcon: 'dashboard', sTitle: 'One operational dashboard',
      sBody: 'AgriGrid unifies signals, alerts, AI and IoT controls in one Angular workspace built for cooperatives and field agronomists.',
      stat: '1 platform', tone: 'gray',
    },
  ];
}
