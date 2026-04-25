import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { MockDataService, Plot } from '../../services/mock-data.service';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSlideToggleModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  animations: [
    trigger('panel', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapEl', { static: true }) mapEl!: ElementRef<HTMLDivElement>;
  data = inject(MockDataService);
  selected = signal<Plot | null>(null);
  showLayers = signal(true);
  private map?: L.Map;
  private markers = new Map<string, L.CircleMarker>();
  private rings = new Map<string, L.Circle>();

  plots = computed(() => this.data.plots());

  constructor() {
    effect(() => {
      const ps = this.plots();
      this.updateMarkers(ps);
    });
  }

  ngAfterViewInit() {
    this.map = L.map(this.mapEl.nativeElement, {
      center: [36.75, 3.06], zoom: 12, zoomControl: true, attributionControl: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(this.map);
    this.updateMarkers(this.plots());
    setTimeout(() => this.map?.invalidateSize(), 100);
  }

  ngOnDestroy() { this.map?.remove(); }

  private updateMarkers(plots: Plot[]) {
    if (!this.map) return;
    for (const p of plots) {
      const color = p.status === 'stress' ? '#ef4444' : p.status === 'watch' ? '#f59e0b' : '#16a34a';
      const radius = 14 + p.area;
      let marker = this.markers.get(p.id);
      let ring = this.rings.get(p.id);
      if (!marker) {
        ring = L.circle([p.lat, p.lng], { radius: radius * 60, color, fillColor: color, fillOpacity: .12, weight: 1, opacity: .35 }).addTo(this.map);
        marker = L.circleMarker([p.lat, p.lng], {
          radius, color: '#fff', weight: 2, fillColor: color, fillOpacity: .9,
        }).addTo(this.map);
        marker.on('click', () => this.selected.set(p));
        marker.bindTooltip(`<strong>${p.name}</strong><br/>${p.crop} · ${p.status}`, { direction: 'top', offset: [0, -6], className: 'plot-tip' });
        this.markers.set(p.id, marker);
        this.rings.set(p.id, ring!);
      } else {
        marker.setStyle({ fillColor: color });
        ring!.setStyle({ color, fillColor: color });
        marker.setTooltipContent(`<strong>${p.name}</strong><br/>${p.crop} · ${p.status}`);
      }
    }
  }

  select(p: Plot) {
    this.selected.set(p);
    this.map?.flyTo([p.lat, p.lng], 13, { duration: .8 });
  }

  toggleIrrigation(p: Plot) {
    this.data.toggleIrrigation(p.id, !p.irrigationOn);
  }

  closePanel() { this.selected.set(null); }
}
