import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n';

const STORAGE_KEY = 'sa7tec_cookie_consent_v1';

export function hasConsented() {
  try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
}

export function setConsent(value: boolean) {
  try { localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false'); } catch {}
}

export function CookieConsent({ onAccept }: { onAccept?: () => void }) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === null) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    setConsent(true);
    setVisible(false);
    onAccept?.();
  };

  const decline = () => {
    setConsent(false);
    setVisible(false);
  };

  return (
    <div dir={document.documentElement.dir || 'ltr'} className="fixed left-0 right-0 bottom-6 z-50 flex justify-center">
      <div className="max-w-3xl mx-4 bg-white/95 dark:bg-black/90 border rounded-xl p-4 shadow-lg flex gap-4 items-center" style={{backdropFilter:'blur(6px)'}}>
        <div className="flex-1 text-sm text-slate-900 dark:text-slate-100">
          <strong>{t('consent.title') || 'We use cookies'}</strong>
          <div className="mt-1 text-xs">{t('consent.description') || 'We use cookies to improve your experience and to deliver analytics. You can accept or decline.'}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={decline} className="px-3 py-2 rounded-md border">{t('consent.decline') || 'Decline'}</button>
          <button onClick={accept} className="px-3 py-2 rounded-md bg-[var(--s7-primary)] text-white">{t('consent.accept') || 'Accept'}</button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
