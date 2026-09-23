/*
 * MateGrowth — SmartMate Family Request embed v1.
 * Reusable across websites: the iframe URL supplies the company slug.
 * Owns only the iframe height and fallback URL. No PII, storage or analytics.
 */
(() => {
  'use strict';
  const TRUSTED_ORIGIN = 'https://www.smartimateapp.com';
  const MESSAGE_TYPE = 'smartmate:family-request:resize';
  const MIN_HEIGHT = 640;
  const MAX_HEIGHT = 12000;
  const frames = new Set();

  function registerFrames() {
    document.querySelectorAll('iframe[data-family-request-frame]').forEach(iframe => {
      try {
        const url = new URL(iframe.getAttribute('src'), document.baseURI);
        if (url.origin !== TRUSTED_ORIGIN || url.pathname !== '/family-request/' || url.searchParams.get('embed') !== '1') return;
        const slug = url.searchParams.get('company');
        if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return;
        frames.add(iframe);
        const fallback = iframe.closest('[data-smartmate-embed]')?.querySelector('[data-family-request-fallback]');
        if (fallback) {
          // Deliberately retain only the public company slug; no parent query string or tokens.
          const target = new URL('/family-request/', TRUSTED_ORIGIN);
          target.searchParams.set('company', slug);
          fallback.href = target.href;
        }
      } catch (_) { /* Leave the static fallback in place if the configuration is invalid. */ }
    });
  }

  window.addEventListener('message', event => {
    if (event.origin !== TRUSTED_ORIGIN) return;
    const frame = Array.from(frames).find(iframe => event.source === iframe.contentWindow);
    if (!frame) return;
    const data = event.data;
    if (!data || typeof data !== 'object' || Array.isArray(data) || data.type !== MESSAGE_TYPE) return;
    // Compatible with the Sunshine resize contract (number or plain numeric string),
    // while rejecting booleans, arrays, CSS strings, missing values and oversized strings.
    const raw = data.height;
    const numericString = typeof raw === 'string' && raw.length <= 16 && /^\d+(?:\.\d+)?$/.test(raw);
    if (typeof raw !== 'number' && !numericString) return;
    const height = Number(raw);
    if (!Number.isFinite(height) || height <= 0) return;
    const applied = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.ceil(height)));
    if (frame.style.height !== `${applied}px`) frame.style.height = `${applied}px`;
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', registerFrames, { once: true });
  else registerFrames();
})();
