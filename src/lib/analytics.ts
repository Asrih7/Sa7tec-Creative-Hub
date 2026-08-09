const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID;

export function loadAnalytics() {
  if (!GA_ID || typeof window === "undefined") return;
  if ((window as any).gtag) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  const inline = document.createElement("script");
  inline.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_ID}', { send_page_view: false });`;
  document.head.appendChild(inline);

  if (ADS_ID) {
    const adsInline = document.createElement("script");
    adsInline.innerHTML = `gtag('config', '${ADS_ID}');`;
    document.head.appendChild(adsInline);
  }
}

export function trackPage(path: string) {
  try {
    if ((window as any).gtag) {
      (window as any).gtag('event', 'page_view', { page_path: path });
    }
  } catch (e) {
    // swallow
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  try {
    if ((window as any).gtag) {
      (window as any).gtag('event', name, params);
    }
  } catch (e) {}
}

export default { loadAnalytics, trackPage, trackEvent };
