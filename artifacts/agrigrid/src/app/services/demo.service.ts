import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MockDataService } from './mock-data.service';

export interface DemoStep {
  title: string;
  body: string;
  route: string;
  highlight?: string; // CSS selector to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void | Promise<void>;
}

@Injectable({ providedIn: 'root' })
export class DemoService {
  private router = inject(Router);
  private data = inject(MockDataService);

  active = signal<boolean>(false);
  index = signal<number>(0);

  steps: DemoStep[] = [
    {
      title: 'Welcome to AgriGrid',
      body: 'AgriGrid blends satellite remote sensing, IoT, AI and blockchain into a single decision platform for sustainable farming. Let me walk you through a real-world scenario in under a minute.',
      route: '/app/dashboard',
      highlight: '[data-tour="dashboard-hero"]',
      position: 'bottom',
    },
    {
      title: 'Step 1 — A real problem: water waste',
      body: 'Conventional irrigation can waste up to 50% of water. Watch what happens when we simulate a sudden drought across our cooperative\'s 5 plots.',
      route: '/app/dashboard',
      highlight: '[data-tour="alerts"]',
      position: 'left',
      action: async () => { this.data.simulateDrought(); },
    },
    {
      title: 'Step 2 — Satellite detects vegetation stress',
      body: 'Our remote sensing layer pulls NDVI from satellite passes. NDVI < 0.4 indicates stressed vegetation. The map below recolors plots in real time.',
      route: '/app/map',
      highlight: '[data-tour="map"]',
      position: 'right',
    },
    {
      title: 'Step 3 — AI generates a recommendation',
      body: 'The AI engine cross-references soil chemistry, micro-climate, NDVI and market demand. Here\'s the explainable recommendation it produced for our most stressed plot.',
      route: '/app/ai',
      highlight: '[data-tour="ai-card"]',
      position: 'right',
    },
    {
      title: 'Step 4 — IoT activates smart irrigation',
      body: 'A signed instruction is sent to the field controllers. Drip lines open only on the affected zones — see the animated water flow.',
      route: '/app/irrigation',
      highlight: '[data-tour="irrigation"]',
      position: 'left',
      action: async () => { this.data.autoIrrigationTrigger(); },
    },
    {
      title: 'Step 5 — Blockchain logs the action',
      body: 'Every irrigation cycle, fertilizer application and harvest is committed to a tamper-evident ledger so cooperatives, auditors and consumers can trust the supply chain.',
      route: '/app/blockchain',
      highlight: '[data-tour="ledger"]',
      position: 'top',
    },
    {
      title: 'Step 6 — Sustainability impact',
      body: 'Across the season, AgriGrid has saved thousands of m³ of water, reduced fertilizer use and cut CO₂ emissions. That\'s the story we tell investors and regulators.',
      route: '/app/sustainability',
      highlight: '[data-tour="sustain-counters"]',
      position: 'bottom',
    },
    {
      title: 'You\'re ready to explore',
      body: 'Browse freely from the sidebar. Use the scenario buttons (drought / high demand / auto-irrigation) anywhere to keep the demo dynamic.',
      route: '/app/dashboard',
      position: 'center',
    },
  ];

  start() {
    this.index.set(0);
    this.active.set(true);
    this.go(this.steps[0]!);
  }

  next() {
    const next = this.index() + 1;
    if (next >= this.steps.length) { this.stop(); return; }
    this.index.set(next);
    this.go(this.steps[next]!);
  }

  prev() {
    const prev = Math.max(0, this.index() - 1);
    this.index.set(prev);
    this.go(this.steps[prev]!);
  }

  stop() {
    this.active.set(false);
    this.clearHighlight();
  }

  private async go(step: DemoStep) {
    this.clearHighlight();
    await this.router.navigateByUrl(step.route);
    if (step.action) await step.action();
    if (step.highlight) {
      setTimeout(() => this.applyHighlight(step.highlight!), 300);
    }
  }

  private applyHighlight(selector: string) {
    this.clearHighlight();
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) return;
    el.classList.add('demo-highlight');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private clearHighlight() {
    document.querySelectorAll('.demo-highlight').forEach(el => el.classList.remove('demo-highlight'));
  }
}
