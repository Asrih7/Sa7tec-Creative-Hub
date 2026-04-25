import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { trigger, style, transition, animate } from '@angular/animations';
import { DemoService } from '../../services/demo.service';

@Component({
  selector: 'app-demo-overlay',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './demo-overlay.component.html',
  styleUrl: './demo-overlay.component.scss',
  animations: [
    trigger('overlayAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('cardAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(.95)' }),
        animate('360ms cubic-bezier(.2,.7,.3,1.2)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      ]),
      transition(':leave', [
        animate('220ms ease-in', style({ opacity: 0, transform: 'translateY(8px) scale(.97)' })),
      ]),
    ]),
  ],
})
export class DemoOverlayComponent {
  demo = inject(DemoService);
  active = computed(() => this.demo.active());
  step = computed(() => this.demo.steps[this.demo.index()]);
  totalSteps = computed(() => this.demo.steps.length);
  current = computed(() => this.demo.index() + 1);
  progress = computed(() => Math.round((this.current() / this.totalSteps()) * 100));
  isLast = computed(() => this.demo.index() === this.demo.steps.length - 1);
  isFirst = computed(() => this.demo.index() === 0);
}
