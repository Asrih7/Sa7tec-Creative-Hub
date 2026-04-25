import { Component, Input, computed, signal, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="kpi" [attr.data-tone]="tone" @cardIn>
      <div class="head">
        <div class="ico"><mat-icon>{{ icon }}</mat-icon></div>
        <span class="trend" [class.up]="trend > 0" [class.down]="trend < 0" *ngIf="trend !== 0">
          <mat-icon>{{ trend > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
          {{ trend > 0 ? '+' : '' }}{{ trend }}%
        </span>
      </div>
      <div class="value">
        <span class="num">{{ display() }}</span>
        <span class="unit" *ngIf="unit">{{ unit }}</span>
      </div>
      <div class="label">{{ label }}</div>
      <div class="bar"><div class="bar-fill" [style.width.%]="barPct()"></div></div>
    </div>
  `,
  styles: [`
    .kpi {
      background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
      padding: 18px; box-shadow: var(--shadow-sm); position: relative; overflow: hidden;
      transition: transform .25s ease, box-shadow .25s ease;
    }
    .kpi:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
    .kpi::before {
      content: ''; position: absolute; top: 0; right: 0; width: 100px; height: 100px;
      background: radial-gradient(circle, var(--tone-soft, transparent), transparent 70%);
      opacity: .8; pointer-events: none;
    }
    .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .ico {
      width: 40px; height: 40px; border-radius: 10px;
      background: var(--tone-soft, var(--surface-2)); color: var(--tone, var(--text-soft));
      display: flex; align-items: center; justify-content: center;
    }
    .trend { font-size: .75rem; font-weight: 600; padding: 4px 8px; border-radius: 999px; display: inline-flex; align-items: center; gap: 2px; }
    .trend mat-icon { font-size: 14px; height: 14px; width: 14px; }
    .trend.up { background: #dcfce7; color: #16a34a; }
    .trend.down { background: #fee2e2; color: #ef4444; }
    .value { display: flex; align-items: baseline; gap: 4px; line-height: 1; }
    .num { font-size: 1.95rem; font-weight: 800; letter-spacing: -.02em; color: var(--text); }
    .unit { font-size: .9rem; color: var(--text-mute); font-weight: 500; }
    .label { color: var(--text-soft); font-size: .82rem; margin-top: 4px; font-weight: 500; }
    .bar { height: 4px; border-radius: 4px; background: var(--surface-2); margin-top: 14px; overflow: hidden; }
    .bar-fill { height: 100%; background: var(--tone, var(--primary)); transition: width 1.2s cubic-bezier(.22,1,.36,1); border-radius: 4px; }
    .kpi[data-tone="green"]  { --tone: #16a34a; --tone-soft: #dcfce7; }
    .kpi[data-tone="blue"]   { --tone: #0ea5e9; --tone-soft: #e0f2fe; }
    .kpi[data-tone="orange"] { --tone: #f59e0b; --tone-soft: #fef3c7; }
    .kpi[data-tone="purple"] { --tone: #8b5cf6; --tone-soft: #ede9fe; }
    .kpi[data-tone="red"]    { --tone: #ef4444; --tone-soft: #fee2e2; }
  `],
  animations: [
    trigger('cardIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(14px)' }),
        animate('480ms cubic-bezier(.22,1,.36,1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class KpiCardComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: number;
  @Input() unit = '';
  @Input() icon = 'insights';
  @Input() tone: 'green' | 'blue' | 'orange' | 'purple' | 'red' = 'green';
  @Input() decimals = 0;
  @Input() trend = 0;
  @Input() barMax = 100;

  private current = signal(0);
  private timer: any;

  display = computed(() => {
    const v = this.current();
    return v.toLocaleString(undefined, { minimumFractionDigits: this.decimals, maximumFractionDigits: this.decimals });
  });

  barPct = computed(() => Math.min(100, Math.round((this.current() / this.barMax) * 100)));

  ngOnInit() { this.animateTo(this.value); }
  ngOnChanges(c: SimpleChanges) { if (c['value'] && !c['value'].firstChange) this.animateTo(this.value); }
  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }

  private animateTo(target: number) {
    if (this.timer) clearInterval(this.timer);
    const start = this.current();
    const dt = 28;
    const dur = 1100;
    const steps = Math.max(1, Math.floor(dur / dt));
    let i = 0;
    this.timer = setInterval(() => {
      i++;
      const t = i / steps;
      const eased = 1 - Math.pow(1 - t, 3);
      this.current.set(start + (target - start) * eased);
      if (i >= steps) { clearInterval(this.timer); this.current.set(target); }
    }, dt);
  }
}
