import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: `<canvas #c></canvas>`,
  styles: [`:host { display: block; width: 100%; height: 100%; min-height: 200px; position: relative; } canvas { width: 100% !important; height: 100% !important; }`],
})
export class BarChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('c', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @Input({ required: true }) labels: string[] = [];
  @Input({ required: true }) data: number[] = [];
  @Input() label = 'Series';
  @Input() color = '#0ea5e9';

  private chart?: Chart;

  ngAfterViewInit() { this.render(); }
  ngOnChanges(c: SimpleChanges) { if (this.chart && (c['data'] || c['labels'])) this.update(); }
  ngOnDestroy() { this.chart?.destroy(); }

  private render() {
    const ctx = this.canvas.nativeElement.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 240);
    grad.addColorStop(0, this.color);
    grad.addColorStop(1, this.hex(this.color, .25));
    const cfg: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: this.label,
          data: this.data,
          backgroundColor: grad,
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(15,23,42,.92)', padding: 10, cornerRadius: 8, displayColors: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: 'rgba(148,163,184,.16)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
        },
      },
    };
    this.chart = new Chart(ctx, cfg);
  }
  private update() {
    if (!this.chart) return;
    this.chart.data.labels = this.labels;
    this.chart.data.datasets[0]!.data = this.data;
    this.chart.update();
  }
  private hex(c: string, a: number) {
    if (c.startsWith('#') && c.length === 7) {
      const r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${a})`;
    }
    return c;
  }
}
