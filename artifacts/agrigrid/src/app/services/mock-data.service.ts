import { Injectable, signal } from '@angular/core';

export interface Plot {
  id: string;
  name: string;
  crop: string;
  area: number; // hectares
  lat: number;
  lng: number;
  ndvi: number;       // 0..1
  moisture: number;   // 0..100 %
  ph: number;         // 4.5..8.5
  n: number;          // mg/kg
  p: number;
  k: number;
  temperature: number; // °C
  status: 'healthy' | 'watch' | 'stress';
  irrigationOn: boolean;
  recommendation: string;
  yieldEstimate: number; // tons / ha
  plantingTime: string;
}

export interface Alert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  title: string;
  detail: string;
  plotId?: string;
  ts: number;
}

export interface LedgerEntry {
  id: string;
  ts: number;
  hash: string;
  prevHash: string;
  type: 'water' | 'fertilizer' | 'harvest' | 'planting';
  plotId: string;
  details: string;
  amount?: number;
  unit?: string;
  signer: string;
}

export interface NdviPoint {
  date: string; // YYYY-MM-DD
  value: number;
}

export interface SustainabilityKpi {
  waterSavedM3: number;
  energySavedKwh: number;
  co2ReducedKg: number;
  fertilizerReducedKg: number;
  yieldUpliftPct: number;
  wasteReducedPct: number;
  biodiversityScore: number;
}

const CROPS = ['Wheat', 'Tomato', 'Olive', 'Date Palm', 'Citrus', 'Barley'];

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]!; }
function statusFromMoisture(m: number, ndvi: number): 'healthy' | 'watch' | 'stress' {
  if (m < 28 || ndvi < 0.35) return 'stress';
  if (m < 42 || ndvi < 0.55) return 'watch';
  return 'healthy';
}

function makePlot(i: number): Plot {
  const moisture = Math.round(rand(20, 75));
  const ndvi = +(rand(0.25, 0.85)).toFixed(2);
  const status = statusFromMoisture(moisture, ndvi);
  const crop = pick(CROPS);
  return {
    id: `P-${100 + i}`,
    name: `Plot ${String.fromCharCode(64 + i)}`,
    crop,
    area: +(rand(2, 12)).toFixed(1),
    lat: 36.75 + rand(-0.06, 0.06),
    lng: 3.06 + rand(-0.08, 0.08),
    ndvi,
    moisture,
    ph: +(rand(5.4, 7.8)).toFixed(1),
    n: Math.round(rand(40, 120)),
    p: Math.round(rand(15, 60)),
    k: Math.round(rand(80, 240)),
    temperature: +(rand(18, 34)).toFixed(1),
    status,
    irrigationOn: status === 'stress',
    recommendation: status === 'stress'
      ? `Irrigate ${crop} immediately — moisture critical.`
      : status === 'watch'
        ? `Schedule drip irrigation in next 24h for ${crop}.`
        : `${crop} is thriving. Maintain current schedule.`,
    yieldEstimate: +(rand(2.5, 8.5)).toFixed(1),
    plantingTime: pick(['Mar 15', 'Apr 02', 'Apr 18', 'May 05', 'May 22']),
  };
}

function makeNdviHistory(weeks = 16): NdviPoint[] {
  const out: NdviPoint[] = [];
  const start = new Date();
  start.setDate(start.getDate() - weeks * 7);
  let v = 0.32;
  for (let i = 0; i < weeks; i++) {
    v = Math.min(0.88, Math.max(0.18, v + rand(-0.05, 0.09)));
    const d = new Date(start);
    d.setDate(start.getDate() + i * 7);
    out.push({ date: d.toISOString().slice(0, 10), value: +v.toFixed(2) });
  }
  return out;
}

function makeMoistureHistory(days = 30): NdviPoint[] {
  const out: NdviPoint[] = [];
  const start = new Date();
  start.setDate(start.getDate() - days);
  let v = 55;
  for (let i = 0; i < days; i++) {
    v = Math.min(85, Math.max(18, v + rand(-7, 6)));
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push({ date: d.toISOString().slice(5, 10), value: Math.round(v) });
  }
  return out;
}

function makeWaterUsage(days = 14): NdviPoint[] {
  const out: NdviPoint[] = [];
  for (let i = days; i > 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({ date: d.toISOString().slice(5, 10), value: Math.round(rand(40, 120)) });
  }
  return out;
}

function hashLike(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const hex = (Math.abs(h).toString(16) + Math.abs(h * 7919).toString(16)).padEnd(16, '0');
  return '0x' + hex.slice(0, 16);
}

function makeLedger(plots: Plot[]): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  let prev = '0x0000000000000000';
  const now = Date.now();
  const types: LedgerEntry['type'][] = ['planting', 'water', 'fertilizer', 'water', 'water', 'harvest', 'fertilizer', 'water'];
  for (let i = 0; i < 14; i++) {
    const p = plots[i % plots.length]!;
    const t = types[i % types.length]!;
    const id = `tx-${1000 + i}`;
    const hash = hashLike(prev + id + p.id + t);
    entries.push({
      id,
      ts: now - i * 86400000 * 1.3 - Math.floor(rand(0, 86400000)),
      hash,
      prevHash: prev,
      type: t,
      plotId: p.id,
      details: t === 'water'
        ? `Irrigation cycle on ${p.name}`
        : t === 'fertilizer'
          ? `NPK 20-10-15 applied to ${p.name}`
          : t === 'planting'
            ? `Planted ${p.crop} in ${p.name}`
            : `Harvested ${p.crop} from ${p.name}`,
      amount: t === 'water' ? +(rand(8, 35)).toFixed(1) : t === 'fertilizer' ? +(rand(20, 80)).toFixed(0) : t === 'harvest' ? +(rand(2, 9)).toFixed(1) : undefined,
      unit: t === 'water' ? 'm³' : t === 'fertilizer' ? 'kg' : t === 'harvest' ? 't' : undefined,
      signer: pick(['agronomist@agrigrid', 'iot-bridge', 'cooperative-board', 'auditor-1']),
    });
    prev = hash;
  }
  return entries.sort((a, b) => b.ts - a.ts);
}

@Injectable({ providedIn: 'root' })
export class MockDataService {
  plots = signal<Plot[]>(Array.from({ length: 5 }).map((_, i) => makePlot(i + 1)));
  alerts = signal<Alert[]>([]);
  ledger = signal<LedgerEntry[]>([]);
  ndviHistory = signal<NdviPoint[]>(makeNdviHistory());
  moistureHistory = signal<NdviPoint[]>(makeMoistureHistory());
  waterUsage = signal<NdviPoint[]>(makeWaterUsage());
  sustainability = signal<SustainabilityKpi>({
    waterSavedM3: 12480,
    energySavedKwh: 3215,
    co2ReducedKg: 8740,
    fertilizerReducedKg: 940,
    yieldUpliftPct: 18,
    wasteReducedPct: 24,
    biodiversityScore: 78,
  });
  scenario = signal<'normal' | 'drought' | 'high-demand'>('normal');

  constructor() {
    this.regenAlerts();
    this.ledger.set(makeLedger(this.plots()));
  }

  refresh() {
    this.plots.update(list => list.map(p => {
      const moisture = Math.max(8, Math.min(95, p.moisture + Math.round(rand(-8, 6))));
      const ndvi = Math.max(0.1, Math.min(0.95, +(p.ndvi + rand(-0.06, 0.06)).toFixed(2)));
      const status = statusFromMoisture(moisture, ndvi);
      return {
        ...p,
        moisture,
        ndvi,
        temperature: +(p.temperature + rand(-0.6, 0.6)).toFixed(1),
        status,
        irrigationOn: p.irrigationOn || status === 'stress',
        recommendation: status === 'stress'
          ? `Irrigate ${p.crop} immediately — moisture critical.`
          : status === 'watch'
            ? `Schedule drip irrigation in next 24h for ${p.crop}.`
            : `${p.crop} is thriving. Maintain current schedule.`,
      };
    }));
    this.regenAlerts();
    this.appendNdvi();
    this.appendMoisture();
  }

  toggleIrrigation(id: string, value?: boolean) {
    this.plots.update(list => list.map(p => p.id === id
      ? { ...p, irrigationOn: value ?? !p.irrigationOn }
      : p));
    if (value === true) {
      const plot = this.plots().find(p => p.id === id);
      if (plot) this.appendLedger('water', plot, +(rand(6, 18)).toFixed(1), 'm³', 'irrigation auto-trigger');
    }
  }

  autoIrrigationTrigger() {
    let count = 0;
    this.plots.update(list => list.map(p => {
      if (p.status === 'stress' && !p.irrigationOn) { count++; return { ...p, irrigationOn: true }; }
      return p;
    }));
    this.plots().forEach(p => {
      if (p.irrigationOn && p.status === 'stress') {
        this.appendLedger('water', p, +(rand(6, 18)).toFixed(1), 'm³', 'auto-trigger by AI rule');
      }
    });
    return count;
  }

  simulateDrought() {
    this.scenario.set('drought');
    this.plots.update(list => list.map(p => ({
      ...p,
      moisture: Math.max(8, p.moisture - Math.round(rand(15, 32))),
      ndvi: +Math.max(0.18, p.ndvi - rand(0.08, 0.20)).toFixed(2),
      temperature: +(p.temperature + rand(2, 6)).toFixed(1),
    })));
    this.plots.update(list => list.map(p => {
      const status = statusFromMoisture(p.moisture, p.ndvi);
      return {
        ...p, status,
        recommendation: status === 'stress'
          ? `Severe drought stress on ${p.crop}. Immediate irrigation required.`
          : p.recommendation,
      };
    }));
    this.regenAlerts();
  }

  simulateHighDemand() {
    this.scenario.set('high-demand');
    const cur = this.sustainability();
    this.sustainability.set({
      ...cur,
      waterSavedM3: Math.round(cur.waterSavedM3 * 0.92),
      energySavedKwh: Math.round(cur.energySavedKwh * 0.94),
    });
    this.appendLedger('planting', this.plots()[0]!, undefined, undefined, 'expanded planting plan for higher demand');
  }

  resetScenario() {
    this.scenario.set('normal');
    this.plots.set(Array.from({ length: 5 }).map((_, i) => makePlot(i + 1)));
    this.regenAlerts();
  }

  private regenAlerts() {
    const out: Alert[] = [];
    let id = 1;
    for (const p of this.plots()) {
      if (p.status === 'stress') {
        out.push({
          id: `a-${id++}`,
          level: 'critical',
          title: 'Water stress detected',
          detail: `${p.name} (${p.crop}) — moisture ${p.moisture}% / NDVI ${p.ndvi}. Action required.`,
          plotId: p.id,
          ts: Date.now() - Math.floor(rand(0, 3600_000)),
        });
      } else if (p.status === 'watch') {
        out.push({
          id: `a-${id++}`,
          level: 'warning',
          title: 'Crop watch',
          detail: `${p.name} (${p.crop}) — vegetation index trending down.`,
          plotId: p.id,
          ts: Date.now() - Math.floor(rand(0, 3 * 3600_000)),
        });
      }
      if (p.ph > 7.4 && Math.random() < 0.5) {
        out.push({
          id: `a-${id++}`,
          level: 'warning',
          title: 'Salinity risk',
          detail: `${p.name} pH at ${p.ph}. Consider gypsum amendment.`,
          plotId: p.id,
          ts: Date.now() - Math.floor(rand(0, 5 * 3600_000)),
        });
      }
    }
    this.alerts.set(out.slice(0, 6));
  }

  private appendNdvi() {
    this.ndviHistory.update(list => {
      const last = list[list.length - 1]!.value;
      const v = Math.min(0.95, Math.max(0.15, last + rand(-0.05, 0.07)));
      const d = new Date();
      const next = [...list.slice(1), { date: d.toISOString().slice(0, 10), value: +v.toFixed(2) }];
      return next;
    });
  }

  private appendMoisture() {
    this.moistureHistory.update(list => {
      const last = list[list.length - 1]!.value;
      const v = Math.min(90, Math.max(15, last + rand(-7, 6)));
      const d = new Date();
      const next = [...list.slice(1), { date: d.toISOString().slice(5, 10), value: Math.round(v) }];
      return next;
    });
  }

  appendLedger(type: LedgerEntry['type'], plot: Plot, amount?: number, unit?: string, note?: string) {
    this.ledger.update(list => {
      const prev = list[0]?.hash ?? '0x0000000000000000';
      const id = `tx-${Date.now()}`;
      const hash = hashLike(prev + id + plot.id + type);
      const entry: LedgerEntry = {
        id,
        ts: Date.now(),
        hash,
        prevHash: prev,
        type,
        plotId: plot.id,
        details: note ? `${type[0]!.toUpperCase() + type.slice(1)} on ${plot.name} — ${note}` : `${type} on ${plot.name}`,
        amount,
        unit,
        signer: 'auto-system',
      };
      return [entry, ...list].slice(0, 60);
    });
  }
}
