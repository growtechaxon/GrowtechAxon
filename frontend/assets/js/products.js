(() => {
  const grid = document.getElementById('gxProductGrid');
  if (!grid) return;
  const API = (window.GROWTECHAXON_API_URL || ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://growtechaxon-backend.onrender.com')).replace(/\/$/, '');
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const validURL = value => { try { const u = new URL(value); return /^https?:$/.test(u.protocol) ? u.href : ''; } catch { return ''; } };
  fetch(API + '/api/products', { headers: { Accept: 'application/json' } }).then(r => r.ok ? r.json() : Promise.reject()).then(data => {
    const products = Array.isArray(data.products) ? data.products : [];
    const existing = new Set(['https://growtech-axon.netlify.app/','https://super-dry-cleaners.netlify.app/']);
    for (const p of products) {
      const url = validURL(p.url); if (!url || existing.has(url)) continue; existing.add(url);
      const image = validURL(p.image) || '/assets/images/portfolio.webp';
      const card = document.createElement('article'); card.className = 'card project-card gx-product-card';
      card.innerHTML = `<a class="gx-product-image" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHTML(image)}" alt="${escapeHTML(p.name)} website preview" loading="lazy" width="900" height="600"><span class="gx-product-tag">${p.active ? 'Live Website' : 'Project'}</span></a><div class="body"><span class="eyebrow">${escapeHTML(p.category || 'Website')}</span><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.description || '')}</p><a class="btn btn-primary" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">Visit Website ↗</a></div>`;
      grid.appendChild(card);
    }
  }).catch(() => { /* Static featured projects remain available if the API is offline. */ });
})();
