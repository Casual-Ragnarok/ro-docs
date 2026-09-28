(() => {
  const base = new URL('../', document.currentScript.src);
  const qr = new URL('imgs/wechat.jpg', base).href;
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('#cro-document-nav, header .nav-wrap');
    if (header) {
      const menu = document.createElement('details');
      menu.className = 'cro-community-menu';
      menu.innerHTML = `<summary aria-label="关注随缘仙境，显示微信二维码"><svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 3h5v5H5zM14 3h5v5h-5zM5 12h5v5H5zM14 12h2v2h3v5h-5v-3M3 21h7M21 3v7"/></svg><span>关注我们</span></summary><div class="cro-community-panel"><img src="${qr}" alt="随缘仙境微信公众号二维码" width="220" height="220"><p>微信扫一扫，冒险路上常相见</p></div>`;
      header.append(menu);
      document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
      document.addEventListener('keydown', event => { if (event.key === 'Escape') menu.open = false; });
    }
    // Skill trees are absolutely positioned; place their footer below the last skill.
    const section = document.createElement('section');
    section.className = 'cro-community-footer';
    section.setAttribute('aria-label', '关注随缘仙境');
    const feedback = new URL('https://github.com/Casual-Ragnarok/ro-docs/issues/new');
    feedback.searchParams.set('title', '[资料反馈] ' + document.title);
    // Share a public document URL, never the visitor's local filesystem path.
    const documentPath = location.pathname.startsWith(base.pathname) ? location.pathname.slice(base.pathname.length) : '';
    const publicPage = new URL(documentPath, 'https://docs.casualro.top/').href;
    feedback.searchParams.set('body', '页面：' + document.title + '\n地址：' + publicPage + '\n\n遇到的问题：\n\n期望的结果或补充资料：\n');
    section.innerHTML = `<div class="cro-footer-grid"><div class="cro-footer-about"><small>CASUAL RAGNAROK</small><h2>随缘相遇，一起冒险</h2><p>收集仙境里的灵感，分享冒险路上的经验。<br>开发笔记、实用工具与游戏资源，都在这里慢慢积攒。</p><span>愿每一次传送，都通往喜欢的地方。 ♡</span></div><div class="cro-footer-links"><h3>冒险传送门</h3><a href="https://store.casualro.top/">脚本商城</a><a href="https://npc.casualro.top/">NPC 脚本索引</a><a href="${new URL('index.html', base).href}">文档与工具资料</a><a href="https://grf.casualro.top/">客户端补丁</a></div><div class="cro-footer-links"><h3>一起完善仙境</h3><a href="${feedback.href.replace(/&/g, '&amp;')}">通过 GitHub 反馈 ↗</a><p>发现失效链接或资料错误？<br>前往 GitHub 填写 Issue，<br>页面信息会自动带上。</p></div><div class="cro-footer-qr"><img src="${qr}" alt="微信扫码关注随缘仙境" width="160" height="160"><p>微信扫一扫<br>冒险之外，也常来坐坐</p></div></div><div class="cro-footer-bottom"><span>随缘仙境 · Casual Ragnarok</span><p>历史资料请结合游戏版本使用。转载内容保留原作者署名，游戏名称、图像及相关素材归各自权利人所有。</p></div>`;
    if (document.body.classList.contains('cro-simulator')) {
      const bottom = Math.max(...Array.from(document.querySelectorAll('table.job, table.quest'), el => el.offsetTop + el.offsetHeight), 1000);
      section.style.position = 'absolute'; section.style.top = `${bottom + 50}px`; section.style.left = '0'; section.style.right = '0';
    }
    const footer = document.querySelector('footer#footer, body > footer');
    if (footer) footer.replaceWith(section); else document.body.append(section);
  });
})();
