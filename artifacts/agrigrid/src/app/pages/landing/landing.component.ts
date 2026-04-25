import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { trigger, style, transition, animate, stagger, query } from '@angular/animations';
import { DemoService } from '../../services/demo.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(24px)' }),
        animate('600ms 100ms cubic-bezier(.22,1,.36,1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('staggerCards', [
      transition(':enter', [
        query('.feature', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(120, animate('540ms cubic-bezier(.22,1,.36,1)', style({ opacity: 1, transform: 'translateY(0)' }))),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class LandingComponent {
  demo = inject(DemoService);
  showVideo = signal(false);

  features = [
    { icon: 'auto_awesome',  title: 'AI Decisions',     desc: 'Explainable AI recommendations for crop, planting and irrigation timing.' },
    { icon: 'satellite_alt', title: 'Remote Sensing',   desc: 'NDVI from satellite passes — vegetation health monitored every revisit.' },
    { icon: 'water_drop',    title: 'Smart Irrigation', desc: 'Sensor-driven drip lines that water only where and when needed.' },
    { icon: 'verified',      title: 'Blockchain Trust', desc: 'Tamper-evident ledger of every input, action and harvest.' },
  ];

  pillars = [
    { num: '38%',  label: 'Less water used' },
    { num: '24%',  label: 'Higher yield estimate' },
    { num: '8.7t', label: 'CO₂ avoided / season' },
    { num: '5★',   label: 'Cooperative trust score' },
  ];

  startDemo() { this.demo.start(); }
}
