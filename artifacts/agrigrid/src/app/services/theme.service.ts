import { Injectable, signal, effect } from '@angular/core';

const KEY = 'agrigrid_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _isDark = signal<boolean>(this.read());
  isDark = this._isDark.asReadonly();

  constructor() {
    effect(() => {
      const dark = this._isDark();
      try { localStorage.setItem(KEY, dark ? 'dark' : 'light'); } catch {}
    });
  }

  toggle() { this._isDark.update(v => !v); }

  private read(): boolean {
    try {
      const v = localStorage.getItem(KEY);
      if (v === 'dark') return true;
      if (v === 'light') return false;
    } catch {}
    return false;
  }
}
