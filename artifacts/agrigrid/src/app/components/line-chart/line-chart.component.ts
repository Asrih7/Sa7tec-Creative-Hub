import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  template: `<canvas #c></canvas>`,
  styles: [`:host { display: block; width: 100%; height: 100%; min-height: 200px; position: relative; } canvas { width: 100% !important; height: 100% !important; }`],
})
export class LineChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('c', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @Input({ required: true }) labels: string[] = [];
  @Input({ required: true }) data: number[] = [];
  @Input() label = 'Series';
  @Input() color = '#16a34a';
  @Input() yMin?: number;
  @Input() yMax?: number;
  @Input() fill = true;

  private chart?: Chart;

  ngAfterViewInit() { this.render(); }
  ngOnChanges(changes: SimpleChanges) { if (this.chart && (changes['data'] || changes['labels'])) this.update(); }
  ngOnDestroy() { this.chart?.destroy(); }

  private render() {
    const ctx = this.canvas.nativeElement.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 240);
    grad.addColorStop(0, this.hex(this.color, .35));
    grad.addColorStop(1, this.hex(this.color, 0));
    const cfg: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: this.label,
          data: this.data,
          borderColor: this.color,
          backgroundColor: grad,
          fill: this.fill,
          tension: .35,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: this.color,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          borderWidth: 2.4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: 'rgba(15,23,42,.92)', padding: 10, cornerRadius: 8, displayColors: false },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: {
            min: this.yMin, max: this.yMax,
            grid: { color: 'rgba(148,163,184,.16)' },
            ticks: { color: '#94a3b8', font: { size: 10 } },
          },
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

  private hex(c: string, a: number): string {
    if (c.startsWith('#') && c.length === 7) {
      const r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${a})`;
    }
    return c;
  }
}
