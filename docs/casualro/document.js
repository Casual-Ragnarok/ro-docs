// Preserve legacy tools and DOM; only enhance local document links.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href]').forEach(a => {
    let url;
    try { url = new URL(a.getAttribute('href'), document.baseURI); } catch { return; }
    const local = url.protocol === location.protocol && url.host === location.host;
    if (!local) return;
    if (/\.(pdf|html?)$/i.test(url.pathname)) a.removeAttribute('target');
  });
});
