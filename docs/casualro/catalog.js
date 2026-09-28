const page = document.body.dataset.page || 'home';
document.title = `${({home:'首页',npcs:'NPC 脚本索引',docs:'文档与工具资料',downloads:'客户端补丁'})[page]} · 随缘仙境`;
const nav = [['home','首页','https://www.casualro.top/'],['npcs','NPC 索引','https://npc.casualro.top/'],['store','脚本商城 ↗','https://store.casualro.top/'],['docs','文档资料','https://docs.casualro.top/'],['downloads','补丁下载','https://grf.casualro.top/']];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = value => {
  try {
    const url = new URL(value, document.baseURI);
    const allowed = ['http:', 'https:'].includes(url.protocol)
      || (location.protocol === 'file:' && url.protocol === 'file:');
    return allowed ? url.href : '#';
  } catch {
    return '#';
  }
};
function link(item, label, cls = 'text-link') {
  if (!item) return '';
  const url = safeUrl(item.url);
  const external = new URL(url, location.href).origin !== location.origin;
  const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
  const anchor = `<a class="${cls}" href="${esc(url)}"${target}>${esc(label || item.text || '查看')} ${external ? '↗' : '→'}</a>`;
  const pdf = !external && /\.pdf$/i.test(new URL(url, location.href).pathname);
  return anchor + (pdf ? ` <a class="text-link" href="${esc(url)}" download>下载 PDF ↓</a>` : '');
}
document.querySelector('#header').innerHTML = `<a class="skip" href="#main">跳到主要内容</a><div class="nav-wrap"><a class="brand" href="https://www.casualro.top/"><span class="brand-mark" aria-hidden="true">✿</span><span>随缘仙境<small>CASUAL RAGNAROK</small></span></a><nav aria-label="主导航">${nav.map(([id,name,url])=>`<a href="${url}" ${id===page?'aria-current="page"':''} ${id==='store'?'target="_blank" rel="noopener noreferrer"':''}>${name}</a>`).join('')}</nav><span class="nav-note" aria-hidden="true">♡ Have a lovely adventure</span></div>`;
document.querySelector('#footer').innerHTML = '<span>✿ 随缘仙境 · Casual Ragnarok Online</span><span>愿每一次传送，都通往喜欢的地方。 ♡</span>';
const main = document.querySelector('#main');
const definitions = {
  npcs: ['SCRIPT DIRECTORY','NPC 脚本索引','知道自己要找什么？按编号、名称或关键词，直接定位脚本。','索引负责快速查找，商城提供完整介绍与购买信息。','搜索编号、名称或功能，例如 1047、商店'],
  docs: ['KNOWLEDGE LIBRARY','文档与工具资料','把多年积累的开发经验、运营资料和实用工具，放在触手可及的地方。','资料保留原始链接；部分历史内容适用较早版本。','搜索资料名称、分类或关键词'],
  downloads: ['CLIENT RESOURCES','客户端补丁','找到需要的 GRF 资源，按说明完成安装，再出发去冒险。','本页提供 GRF 补充资源，不是完整游戏客户端。','搜索文件名或用途，例如 UI、地图']
};
  const [eyebrow,title,description,note,placeholder] = definitions[page];
  main.innerHTML = `<section class="page-intro"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${description}</p></div><aside class="intro-note">${note}</aside></section>
  ${page==='downloads'?'<div class="notice">这些 GRF 是随缘仙境客户端的补充图档，大部分经过加密，其他服务器通常无法使用。请先确认你已有对应的游戏客户端。</div><section class="steps" aria-label="安装步骤"><div class="step"><strong>01 · 下载资源</strong>优先下载标记为「必装」的文件。</div><div class="step"><strong>02 · 放入客户端</strong>将 GRF 文件放在游戏客户端根目录。</div><div class="step"><strong>03 · 检查加载顺序</strong>按文件说明修改 data.ini，再启动游戏。</div></section>':''}
  <div class="workspace"><aside class="sidebar"><p class="sidebar-title">${page==='downloads'?'资源分类':'浏览分类'}</p><div class="filters" role="group" aria-label="分类筛选"></div><p class="side-note">${page==='npcs'?'保留熟悉的编号与分类。<br>想了解完整功能？点击详情前往商城。':page==='docs'?'按用途整理，让资料更容易找到。历史资料请结合实际版本使用。':'data.ini 序号 0 的优先级最高。原站说明最多配置 0–9 共 10 个 GRF；请结合你的客户端版本确认。'}</p></aside><section aria-label="查询结果"><div class="toolbar"><label class="search-wrap"><span aria-hidden="true">⌕</span><span class="sr-only">${placeholder}</span><input class="search" type="search" placeholder="${placeholder}"></label>${page==='npcs'?'<label><span class="sr-only">排序方式</span><select id="sort"><option value="original">默认顺序</option><option value="id">编号升序</option><option value="price">价格升序</option></select></label>':''}</div><p class="result-count" aria-live="polite">正在加载目录…</p><div id="results"></div></section></div>`;
  initCatalog().catch(() => {
    document.querySelector('.result-count').textContent = '目录加载失败';
    document.querySelector('#results').innerHTML = '<p class="empty error">目录增强功能暂不可用，原始内容显示在下方。</p>';
    document.querySelector('#catalog-source').hidden = false;
  });

async function initCatalog() {
  const rows = readSourceRows();
  let active = '全部';
  const category = row => page==='downloads' ? (row.cells[2].checked?'必装资源':'可选资源') : row.category.replace(/（.*?）/g,'');
  const categories = ['全部', ...new Set(rows.map(category))];
  const buttons = document.querySelector('.filters');
  const search = document.querySelector('.search');
  buttons.innerHTML = categories.map(name=>`<button class="filter ${name===active?'active':''}" type="button" aria-pressed="${name===active}" data-category="${esc(name)}">${esc(name)}<small>${name==='全部'?rows.length:rows.filter(row=>category(row)===name).length}</small></button>`).join('');
  buttons.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    active = button.dataset.category;
    for (const item of buttons.children) {
      item.classList.toggle('active', item===button);
      item.setAttribute('aria-pressed', String(item===button));
    }
    render();
  });
  search.addEventListener('input', render);
  document.querySelector('#sort')?.addEventListener('change', render);
  function render() {
    const query = search.value.trim().toLocaleLowerCase();
    let filtered = rows.filter(row=>(active==='全部'||category(row)===active)&&row.cells.some(cell=>cell.text.toLocaleLowerCase().includes(query)));
    const sort = document.querySelector('#sort')?.value;
    if (sort==='id') filtered.sort((a,b)=>Number(a.cells[0].text)-Number(b.cells[0].text));
    if (sort==='price') {
      const price = row => { const n = row.cells[7].text.match(/[\d.]+/); return n?Number(n[0]):Infinity; };
      filtered.sort((a,b)=>price(a)-price(b));
    }
    document.querySelector('.result-count').textContent = `${active} · 找到 ${filtered.length} ${page==='npcs'?'个脚本':page==='docs'?'项资料':'个资源'}${query?' · 关键词「'+search.value.trim()+'」':''}`;
    const results = document.querySelector('#results');
    if (!filtered.length) { results.innerHTML = '<div class="empty">没有找到匹配内容，试试其他关键词或分类。</div>'; return; }
    if (page==='npcs') {
      results.innerHTML = `<div class="table-shell" role="region" aria-label="脚本列表，可横向滚动" tabindex="0"><table><thead><tr><th scope="col">编号</th><th scope="col">脚本 / 功能简介</th><th scope="col">适用系列</th><th scope="col">价格</th><th scope="col">快捷入口</th></tr></thead><tbody>${filtered.map(({cells:c})=>`<tr><td class="id-cell">${esc(c[0].text)}</td><td><span class="product-title">${esc(c[1].text)}</span><p class="product-desc">${esc(c[4].text)}</p></td><td><span class="tag">${esc(c[3].text)}</span><span class="version">${esc(c[2].text)}</span></td><td class="price">${esc(c[7].text)}</td><td><div class="row-links">${c[5].links.map(l=>link(l,'详情')).join('')}${c[6].links.map(l=>link(l,'演示')).join('')}${c[8].links.map(l=>link(l,'购买')).join('')}</div></td></tr>`).join('')}</tbody></table></div>`;
    } else if (page==='docs') {
      results.innerHTML = `<div class="resource-list">${filtered.map(({cells:c})=>`<article class="resource"><div><span class="tag">${esc(c[1].text)}</span><h3>${esc(c[2].text)}</h3><p>${esc(c[3].text)}</p>${c[3].links.map(l=>link(l)).join(' ')}<span class="muted" aria-label="原站推荐度">${esc(c[0].text)}</span></div><div class="resource-actions">${c[4].links.map(l=>link(l,'查看资料','button secondary')).join('')}</div></article>`).join('')}</div>`;
    } else {
      results.innerHTML = `<div class="resource-list">${filtered.map(({cells:c})=>`<article class="resource"><div><span class="tag">${c[2].checked?'必装':'可选'}${c[1].checked?' · 已加密':''}</span><h3>${esc(c[0].text)}</h3><p>${esc(c[3].text)}</p>${c[3].links.map(l=>link(l)).join(' ')}${c[3].images.map(url=>link({url},'查看效果图')).join(' ')}<p><strong>加载顺序：</strong>${esc(c[4].text)}</p></div><div class="resource-actions">${c[5].links.map(l=>link(l,l.text,'button secondary')).join('')}${c[6].text?`<button class="copy" type="button" data-copy="${esc(c[6].text)}" aria-label="复制提取码 ${esc(c[6].text)}">提取码 ${esc(c[6].text)} · 复制</button>`:''}</div></article>`).join('')}</div>`;
    }
  }
  document.querySelector('#results').addEventListener('click', async event => {
    const button = event.target.closest('[data-copy]');
    if (!button) return;
    try { await navigator.clipboard.writeText(button.dataset.copy); button.textContent = `已复制 ${button.dataset.copy}`; }
    catch { button.textContent = `请手动复制：${button.dataset.copy}`; }
  });
  render();
  document.querySelector('#catalog-source').hidden = true;
}

// The original HTML table is the only source of content. No JSON snapshot or fetch.
function readSourceRows() {
  const source = document.querySelector('#catalog-source');
  if (!source) throw new Error('Missing catalog source');
  let category = '';
  const rows = [];
  for (const element of source.querySelectorAll('h3, table')) {
    if (element.tagName === 'H3') { category = element.textContent.trim(); continue; }
    for (const row of element.rows) {
      if (!row.cells.length || row.cells[0].tagName !== 'TD') continue;
      const cells = Array.from(row.cells, cell => ({
        text: cell.textContent.replace(/\s+/g, ' ').trim(),
        links: Array.from(cell.querySelectorAll('a[href]')).filter(a => a.getAttribute('href').trim() && a.getAttribute('href') !== '#').map(a => ({text:a.textContent.trim(), url:new URL(a.getAttribute('href'), document.baseURI).href})),
        images: Array.from(cell.querySelectorAll('img[src]'), img => new URL(img.getAttribute('src'), document.baseURI).href),
        checked: Boolean(cell.querySelector('input[checked]')),
      }));
      if (cells.length !== ({npcs:9, docs:5, downloads:7})[page]) throw new Error('Unexpected catalog row');
      rows.push({category, cells});
    }
  }
  return rows;
}
