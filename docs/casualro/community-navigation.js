/* Shared CasualRO navigation. Markup and styling originate in casual-ro-website. */
(() => {
  function initialize() {
    const items = [
      ['home', '首页', 'https://casualro.top/'],
      ['npcs', 'NPC 索引', 'https://npc.casualro.top/'],
      ['store', '脚本商城', 'https://store.casualro.top/'],
      ['docs', '文档资料', 'https://docs.casualro.top/'],
      ['downloads', '补丁下载', 'https://grf.casualro.top/'],
      ['features', '特色介绍', 'https://feature.casualro.top/'],
    ];
    const host = location.hostname.replace(/^www\./, '');
    const active = document.body.dataset.page || ({'casualro.top':'home','npc.casualro.top':'npcs','store.casualro.top':'store','docs.casualro.top':'docs','effect.casualro.top':'effects','grf.casualro.top':'downloads','feature.casualro.top':'features'}[host]) || (/ro-effects/.test(location.pathname) ? 'effects' : /casual-ro-feature-showcase/.test(location.pathname) ? 'features' : '');
    let menuNumber = 0;
    function docsMarkup() {
      const menuId = `cro-docs-menu-${++menuNumber}`;
      return `<div class="nav-docs${['docs', 'effects'].includes(active) ? ' is-active' : ''}"><a class="docs-link" href="https://docs.casualro.top/">文档资料</a><button class="nav-toggle" type="button" aria-label="展开文档资料菜单" aria-expanded="false" aria-controls="${menuId}"><svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button><div class="nav-submenu" id="${menuId}" hidden><a href="https://docs.casualro.top/"${active === 'docs' ? ' aria-current="page"' : ''}><span>文档与工具资料</span><small>开发笔记、运营经验与实用工具</small></a><a href="https://effect.casualro.top/"${active === 'effects' ? ' aria-current="page"' : ''}><span>特效演示清单</span><small>按编号查找 RO 特效与动图</small></a></div></div>`;
    }
    const legacy = document.querySelector('#cro-document-nav');
    let wrapper = document.querySelector('header .nav-wrap');
    const store = document.querySelector('#headNav');
    if (!wrapper && store) {
      // Keep the shop's categories, search, mobile drawer and native theme intact.
      const links = [...store.querySelectorAll('a')].filter(a => /^(文档资料|仙境资料)$/.test(a.textContent.trim()));
      for (const link of links) {
      const holder = document.createElement('div');
      holder.innerHTML = docsMarkup();
      link.replaceWith(holder.firstElementChild);
      }
    } else {
      let header = wrapper?.closest('header') || legacy;
      const qr = header?.querySelector('.cro-community-menu');
      if (!header) {
        header = document.createElement('header');
        document.body.prepend(header);
        document.body.classList.add('cro-has-global-nav');
      }
      header.classList.add('cro-global-header');
      const nav = items.map(([id, name, url]) => id === 'docs' ? docsMarkup() : `<a href="${url}"${active === id ? ' aria-current="page"' : ''}${id === 'store' ? ' target="_blank" rel="noopener noreferrer"' : ''}>${name}</a>`).join('');
      header.innerHTML = `<a class="skip" href="#main">跳到主要内容</a><div class="nav-wrap"><a class="brand" href="https://casualro.top/"><span class="brand-mark" aria-hidden="true">✿</span><span>随缘仙境<small>CASUAL RAGNAROK</small></span></a><nav aria-label="主导航">${nav}</nav><span class="nav-note" aria-hidden="true">♡ Have a lovely adventure</span></div>`;
      wrapper = header.querySelector('.nav-wrap');
      if (qr) wrapper.append(qr);
      if (!document.querySelector('#main')) document.querySelector('main')?.setAttribute('id', 'main');
    }
    for (const group of document.querySelectorAll('.nav-docs')) {
    const toggle = group.querySelector('.nav-toggle');
    const submenu = group.querySelector('.nav-submenu');
    let closeTimer;
    function open(value) {
      clearTimeout(closeTimer);
      submenu.hidden = !value;
      toggle.setAttribute('aria-expanded', String(value));
      toggle.setAttribute('aria-label', value ? '收起文档资料菜单' : '展开文档资料菜单');
    }
    toggle.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); open(submenu.hidden); });
    group.querySelector('.docs-link').addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') open(true); });
    // Touch browsers may blur the toggle and emit pointerleave before the link click.
    // Keep links mounted until their native click can navigate.
    group.addEventListener('pointerenter', () => clearTimeout(closeTimer));
    group.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse') return;
      closeTimer = setTimeout(() => {
        if (!group.contains(document.activeElement)) open(false);
      }, 200);
    });
    document.addEventListener('click', event => { if (!group.contains(event.target)) open(false); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !submenu.hidden) { open(false); toggle.focus(); } });
    }
  }
  // Run after existing deferred scripts have installed their shared header controls.
  if (document.readyState !== 'complete') document.addEventListener('DOMContentLoaded', initialize, { once: true }); else initialize();
})();
