import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './architecture.component.html',
  styleUrl: './architecture.component.scss',
})
export class ArchitectureComponent {
  layers = [
    {
      name: 'Field layer · sensors & actuators',
      tone: 'green',
      icon: 'sensors',
      items: [
        { ico: 'water_drop', name: 'Soil moisture probes', desc: 'LoRa, 10 cm/30 cm depth, hourly' },
        { ico: 'thermostat', name: 'Air & soil temp', desc: 'Ambient + canopy, every 15 min' },
        { ico: 'cloud', name: 'Weather station', desc: 'Wind, rain, humidity, every 5 min' },
        { ico: 'opacity', name: 'Drip irrigation valves', desc: 'Solenoid, MQTT-controlled' },
      ],
    },
    {
      name: 'Edge layer · gateway & buffering',
      tone: 'amber',
      icon: 'router',
      items: [
        { ico: 'memory', name: 'LoRa gateway (RPi)', desc: 'Aggregates per cooperative' },
        { ico: 'sync', name: 'Local MQTT broker', desc: 'Buffers when offline' },
        { ico: 'shield', name: 'TLS + mTLS', desc: 'End-to-end secured uplink' },
      ],
    },
    {
      name: 'Cloud layer · platform services',
      tone: 'blue',
      icon: 'cloud',
      items: [
        { ico: 'database', name: 'TimescaleDB', desc: 'Sensor time-series store' },
        { ico: 'satellite_alt', name: 'Sentinel-2 ingestion', desc: 'NDVI / NDWI tiles, every revisit' },
        { ico: 'auto_awesome', name: 'AgriGrid-AI service', desc: 'GBT + LSTM, explainable' },
        { ico: 'link', name: 'Permissioned ledger', desc: 'Hyperledger-style chain' },
      ],
    },
    {
      name: 'Application layer · users',
      tone: 'purple',
      icon: 'devices',
      items: [
        { ico: 'web', name: 'Angular dashboard', desc: 'This very interface' },
        { ico: 'phone_android', name: 'Field PWA', desc: 'Offline-first for agronomists' },
        { ico: 'inventory', name: 'Buyer portal', desc: 'Audit blockchain provenance' },
        { ico: 'api', name: 'Public API', desc: 'For ministries & co-ops' },
      ],
    },
  ];
}
