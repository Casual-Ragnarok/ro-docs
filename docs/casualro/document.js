// Preserve legacy tools and DOM; only enhance local document links.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href]').forEach(a => {
    let url;
    try { url = new URL(a.getAttribute('href'), document.baseURI); } catch { return; }
    const local = url.protocol === location.protocol && url.host === location.host;
    if (!local) return;
    if (/\.(pdf|html?)$/i.test(url.pathname)) a.removeAttribute('target');
    if (/\.pdf$/i.test(url.pathname) && !a.hasAttribute('download')) {
      const download = document.createElement('a');
      download.href = url.href;
      download.download = '';
      download.className = 'cro-pdf-download';
      download.textContent = '下载 PDF ↓';
      a.after(download);
    }
  });
});
