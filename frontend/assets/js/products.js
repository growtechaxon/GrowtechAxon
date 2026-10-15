(() => {
  const grid = document.getElementById('gxProductGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="notice">Loading projects from Admin Panel…</div>';
  const API = String(window.GROWTECHAXON_API_URL || ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://growtechaxon-backend.onrender.com')).replace(/\/$/, '');
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const validURL = (value) => { try { const url = new URL(value, location.href); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };
  const normalizeURL = (value) => { const url = validURL(value); if (!url) return ''; try { const parsed = new URL(url); parsed.hash = ''; if (parsed.pathname.length > 1) parsed.pathname = parsed.pathname.replace(/\/+$/, ''); return parsed.href.toLowerCase(); } catch { return ''; } };
  fetch(API + '/api/products', { headers: { Accept: 'application/json' }, cache: 'no-store' })
    .then((response) => { if (!response.ok) throw new Error(`Projects API returned HTTP ${response.status}`); return response.json(); })
    .then((data) => {
      const products = Array.isArray(data.products) ? data.products : [];
      grid.innerHTML = '';
      const existing = new Set();
      for (const project of products) {
        const url = validURL(project.url);
        const normalized = normalizeURL(url);
        if (!url || (normalized && existing.has(normalized))) continue;
        if (normalized) existing.add(normalized);
        const rawImage = String(project.image || '').trim();
        const image = rawImage ? (rawImage.startsWith('/uploads/') ? API + rawImage : validURL(rawImage)) : '';
        const safeImage = image || '/assets/images/logo.jpeg';
        const card = document.createElement('article');
        card.className = 'card project-card gx-product-card';
        card.innerHTML = `<a class="gx-product-image" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHTML(safeImage)}" alt="${escapeHTML(project.name)} project preview" loading="lazy" decoding="async" width="900" height="600"><span class="gx-product-tag">${project.active ? 'Live Website' : 'Project'}</span></a><div class="body"><span class="eyebrow">${escapeHTML(project.category || 'Website')}</span><h3>${escapeHTML(project.name)}</h3><p>${escapeHTML(project.description || '')}</p><a class="btn btn-primary" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">Visit Website ↗</a></div>`;
        grid.appendChild(card);
      }
      if (!products.length || !grid.children.length) grid.innerHTML = '<div class="notice">No projects published yet. Please check back soon.</div>';
    })
    .catch((error) => { console.warn('[GrowtechAxon] Could not load managed projects:', error.message); grid.innerHTML = '<div class="notice">Projects could not be loaded right now. Please try again later.</div>'; });
})();
