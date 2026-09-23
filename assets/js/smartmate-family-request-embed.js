/*
 * MateGrowth — SmartMate Family Request embed v1.
 * Reusable across websites: the iframe URL supplies the company slug.
 * Owns iframe height, fallback URL and the consent decision bridge. No PII.
 */
(() => {
  'use strict';
  const TRUSTED_ORIGIN = 'https://www.smartimateapp.com';
  const MESSAGE_TYPE = 'smartmate:family-request:resize';
  const CONSENT_MESSAGE_TYPE = 'smartmate:consent:update';
  const CONSENT_CHANGE_EVENT = 'smartmate:parent-consent:update';
  const MIN_HEIGHT = 640;
  const MAX_HEIGHT = 12000;
  const frames = new Set();
  const pendingHeights = new Map();
  let resizeFrame = 0;

  function currentAnalyticsDecision() {
    if (typeof window.getSmartMateAnalyticsConsent !== 'function') return null;
    const decision = window.getSmartMateAnalyticsConsent();
    return decision === 'granted' || decision === 'denied' ? decision : null;
  }

  function sendAnalyticsConsent(frame, decision = currentAnalyticsDecision()) {
    if (!frames.has(frame) || !frame.contentWindow) return;
    if (decision !== 'granted' && decision !== 'denied') return;
    frame.contentWindow.postMessage({
      type: CONSENT_MESSAGE_TYPE,
      analytics: decision
    }, TRUSTED_ORIGIN);
  }

  function syncAnalyticsConsent(decision = currentAnalyticsDecision()) {
    if (decision !== 'granted' && decision !== 'denied') return;
    frames.forEach(frame => sendAnalyticsConsent(frame, decision));
  }

  function applyFrameHeight(frame, nextHeight) {
    const currentHeight = Number.parseFloat(frame.style.height) || frame.getBoundingClientRect().height;

    // Ignore sub-pixel chatter from the embedded app and keep one layout update per frame.
    if (Math.abs(currentHeight - nextHeight) < 2) return;

    // Only protect the viewport when a user is actively interacting with a shrinking iframe.
    // This avoids global scroll commands while preventing a Back action from anchoring at the footer.
    const preserveViewport = document.activeElement === frame && nextHeight < currentHeight;
    const previousScrollY = window.scrollY;

    frame.style.height = `${nextHeight}px`;

    if (!preserveViewport) return;

    requestAnimationFrame(() => {
      const scrollRoot = document.scrollingElement;
      const maxScrollY = Math.max(0, scrollRoot.scrollHeight - window.innerHeight);
      const targetScrollY = Math.min(previousScrollY, maxScrollY);

      if (Math.abs(window.scrollY - targetScrollY) > 1) {
        window.scrollTo(0, targetScrollY);
      }
    });
  }

  function queueFrameHeight(frame, height) {
    pendingHeights.set(frame, height);

    if (resizeFrame) return;

    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      pendingHeights.forEach((nextHeight, pendingFrame) => {
        applyFrameHeight(pendingFrame, nextHeight);
      });
      pendingHeights.clear();
    });
  }

  function registerFrames() {
    document.querySelectorAll('iframe[data-family-request-frame]').forEach(iframe => {
      try {
        const url = new URL(iframe.getAttribute('src'), document.baseURI);
        if (url.origin !== TRUSTED_ORIGIN || url.pathname !== '/family-request/' || url.searchParams.get('embed') !== '1') return;
        const slug = url.searchParams.get('company');
        if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return;
        frames.add(iframe);
        if (!iframe.dataset.smartmateConsentBridge) {
          iframe.dataset.smartmateConsentBridge = 'ready';
          iframe.addEventListener('load', () => sendAnalyticsConsent(iframe));
        }
        sendAnalyticsConsent(iframe);
        const shell = iframe.closest('.eda-request-frame-shell');
        if (shell) shell.style.overflowAnchor = 'none';
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
    queueFrameHeight(frame, applied);
  });

  document.addEventListener(CONSENT_CHANGE_EVENT, event => {
    const decision = event?.detail?.analytics;
    if (decision !== 'granted' && decision !== 'denied') return;
    syncAnalyticsConsent(decision);
  });

  window.addEventListener('storage', event => {
    if (event.storageArea !== localStorage) return;
    syncAnalyticsConsent();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', registerFrames, { once: true });
  else registerFrames();
})();
