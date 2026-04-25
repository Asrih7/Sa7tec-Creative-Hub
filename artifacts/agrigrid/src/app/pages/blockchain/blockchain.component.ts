import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { LedgerEntry, MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-blockchain',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './blockchain.component.html',
  styleUrl: './blockchain.component.scss',
  animations: [
    trigger('chain', [
      transition(':enter', [
        query('.block', [
          style({ opacity: 0, transform: 'translateY(16px) scale(.96)' }),
          stagger(70, animate('500ms cubic-bezier(.22,1,.36,1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class BlockchainComponent {
  data = inject(MockDataService);
  blocks = computed(() => this.data.ledger());
  selected = signal<string | null>(null);

  add() {
    const plot = this.data.plots()[Math.floor(Math.random() * this.data.plots().length)]!;
    const types: LedgerEntry['type'][] = ['water', 'fertilizer', 'harvest', 'planting'];
    const t = types[Math.floor(Math.random() * types.length)]!;
    this.data.appendLedger(t, plot, t === 'water' ? 12 : t === 'fertilizer' ? 35 : t === 'harvest' ? 4.2 : undefined,
      t === 'water' ? 'm³' : t === 'fertilizer' ? 'kg' : t === 'harvest' ? 't' : undefined,
      'manual mint from ledger viewer');
  }

  fmt(ts: number) { return new Date(ts).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }); }
  short(h: string) { return h.slice(0, 14) + '…'; }

  byType(t: LedgerEntry['type']) {
    if (t === 'water')      return { ico: 'water_drop', tone: 'blue',   label: 'Irrigation' };
    if (t === 'fertilizer') return { ico: 'science',    tone: 'amber',  label: 'Fertilizer' };
    if (t === 'harvest')    return { ico: 'agriculture',tone: 'green',  label: 'Harvest' };
    return                       { ico: 'eco',         tone: 'purple', label: 'Planting' };
  }

  plotName(id: string) { return this.data.plots().find(p => p.id === id)?.name ?? id; }
}
