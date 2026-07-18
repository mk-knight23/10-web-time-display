/**
 * MK Suite — Privacy-Safe Analytics
 */

type EventParams = Record<string, string | number | boolean>;

const BLOCKED = ["payee", "amount", "password", "email", "prompt", "custom_text", "uploaded"];

function sanitize(params: EventParams): EventParams {
  const safe: EventParams = {};
  for (const [k, v] of Object.entries(params)) {
    if (!BLOCKED.some(b => k.toLowerCase().includes(b))) safe[k] = v;
  }
  return safe;
}

declare const __DEV__: boolean;

export const analytics = {
  track(event: string, params: EventParams = {}) {
    const safe = sanitize(params);
    try {
      if ((window as any).dataLayer) (window as any).dataLayer.push({ event, ...safe });
      if ((window as any).gtag) (window as any).gtag("event", event, safe);
    } catch { /* analytics unavailable */ }
  },
  pageView(path: string, title: string) {
    this.track("page_view", { page_path: path, page_title: title });
  }
};

