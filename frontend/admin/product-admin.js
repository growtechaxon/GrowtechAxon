(() => {
  const form = document.getElementById('productForm');
  if (!form) return;
  const API = String(window.GROWTECHAXON_API_URL || ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://growtechaxon-backend.onrender.com')).replace(/\/$/, '');
  const el = (id) => document.getElementById(id);
  const table = el('productTable');
  const refreshButton = el('refreshProductsBtn');
  const msg = el('productMessage');
  const imageInput = el('productImage');
  const imagePreview = el('productImagePreview');
  let rows = [];
  let currentImage = '';
  let previewObjectUrl = '';
  const token = () => localStorage.getItem('growtechAdminToken') || localStorage.getItem('adminToken') || '';
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

  function showPreview(url, alt = 'Project image preview') {
    if (!imagePreview) return;
    imagePreview.alt = alt;
    if (url && url.startsWith('/uploads/')) url = API + url;
    if (!url) {
      imagePreview.removeAttribute('src');
      imagePreview.hidden = true;
      return;
    }
    imagePreview.src = url;
    imagePreview.hidden = false;
  }
  function clearObjectUrl() {
    if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
    previewObjectUrl = '';
  }
  async function request(path, options = {}) {
    const headers = { ...(options.headers || {}), Authorization: `Bearer ${token()}` };
    // Let the browser set the multipart boundary for FormData.
    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    const response = await fetch(API + path, { ...options, headers });
    let data;
    try { data = await response.json(); }
    catch { throw new Error(`Server returned an invalid response (HTTP ${response.status}).`); }
    if (response.status === 401) throw new Error(data.message || 'Your admin session expired. Please log in again.');
    if (!response.ok || !data.success) throw new Error(data.message || `Request failed (HTTP ${response.status}).`);
    return data;
  }
  function render() {
    if (!rows.length) {
      table.innerHTML = '<tr><td colspan="6">No projects found in the database. If projects are visible on the public website, check the API/database connection shown below and click Refresh Projects.</td></tr>';
      msg.textContent = 'Loaded 0 projects from the admin API.';
      return;
    }
    table.innerHTML = rows.map((project) => {
      const rawImage = String(project.image || '').trim();
      const image = rawImage.startsWith('/uploads/') ? API + rawImage : rawImage;
      const imageCell = image ? `<img class="product-table-image" src="${esc(image)}" alt="${esc(project.name)} image" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="product-table-no-image" hidden>No image</span>` : '<span class="product-table-no-image">No image</span>';
      return `<tr><td>${imageCell}</td><td><strong>${esc(project.name)}</strong><br><small>ID: ${esc(project._id)}</small></td><td><a href="${esc(project.url)}" target="_blank" rel="noopener noreferrer">Open website ↗</a></td><td>${esc(project.category || 'Website')}</td><td>${project.active ? 'Visible' : 'Hidden'}</td><td><button type="button" data-edit="${esc(project._id)}">Edit / Update</button> <button type="button" data-delete="${esc(project._id)}">Delete</button></td></tr>`;
    }).join('');
    msg.textContent = `Loaded ${rows.length} project(s) from the database. All existing projects, including hidden ones, are listed here.`;
  }
  async function load() {
    table.innerHTML = '<tr><td colspan="6">Loading projects from database…</td></tr>';
    if (refreshButton) refreshButton.disabled = true;
    msg.textContent = 'Connecting to the admin projects API…';
    try {
      const data = await request('/api/admin/products');
      rows = Array.isArray(data.products) ? data.products : [];
      render();
    } catch (error) {
      table.innerHTML = `<tr><td colspan="6">Could not load projects: ${esc(error.message)}</td></tr>`;
      msg.textContent = error.message.includes('401') || /expired|unauthorized|token/i.test(error.message)
        ? 'Admin authentication failed. Please log out, sign in again, then click Refresh Projects.'
        : 'The project list could not be loaded. Confirm the admin API is connected to the same database as the public website, then click Refresh Projects.';
    } finally { if (refreshButton) refreshButton.disabled = false; }
  }
  function reset() {
    clearObjectUrl();
    form.reset();
    el('productId').value = '';
    el('productCategory').value = 'Website';
    el('productOrder').value = '0';
    el('productActive').checked = true;
    el('saveProductBtn').textContent = 'Save Project';
    currentImage = '';
    showPreview('');
    msg.textContent = '';
  }
  refreshButton?.addEventListener('click', () => load());
  el('addProductBtn')?.addEventListener('click', () => {
    reset();
    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  el('cancelProductBtn')?.addEventListener('click', () => {
    form.hidden = true;
    reset();
  });
  imageInput?.addEventListener('change', () => {
    const file = imageInput.files?.[0];
    clearObjectUrl();
    if (!file) {
      showPreview(currentImage, 'Current project image');
      return;
    }
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
    if (!allowed.has(file.type)) {
      imageInput.value = '';
      showPreview(currentImage, 'Current project image');
      msg.textContent = 'Choose a JPG, JPEG, PNG or WEBP image.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      imageInput.value = '';
      showPreview(currentImage, 'Current project image');
      msg.textContent = 'Image size must be 5 MB or less.';
      return;
    }
    previewObjectUrl = URL.createObjectURL(file);
    showPreview(previewObjectUrl, file.name);
    msg.textContent = `${file.name} selected (${Math.max(1, Math.round(file.size / 1024))} KB).`;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = el('saveProductBtn');
    const id = el('productId').value;
    const file = imageInput?.files?.[0] || null;
    if (file && file.size > 5 * 1024 * 1024) {
      msg.textContent = 'Image size must be 5 MB or less.';
      return;
    }
    const payload = new FormData();
    payload.append('name', el('productName').value.trim());
    payload.append('url', el('productUrl').value.trim());
    payload.append('category', el('productCategory').value.trim());
    payload.append('description', el('productDescription').value.trim());
    payload.append('displayOrder', String(Number(el('productOrder').value) || 0));
    payload.append('active', String(el('productActive').checked));
    if (file) payload.append('image', file, file.name);
    button.disabled = true;
    button.textContent = id ? 'Updating…' : 'Uploading & saving…';
    msg.textContent = file ? 'Uploading image and saving project…' : 'Saving project…';
    try {
      const data = await request(id ? `/api/admin/products/${encodeURIComponent(id)}` : '/api/admin/products', {
        method: id ? 'PUT' : 'POST',
        body: payload
      });
      msg.textContent = data.message || 'Project saved successfully.';
      form.hidden = true;
      reset();
      await load();
    } catch (error) {
      msg.textContent = error.message;
    } finally {
      button.disabled = false;
      button.textContent = el('productId').value ? 'Update Project' : 'Save Project';
    }
  });

  table.addEventListener('click', async (event) => {
    const editId = event.target.closest('[data-edit]')?.dataset.edit;
    const deleteId = event.target.closest('[data-delete]')?.dataset.delete;
    if (editId) {
      const project = rows.find((item) => item._id === editId);
      if (!project) return;
      clearObjectUrl();
      form.reset();
      el('productId').value = project._id;
      el('productName').value = project.name || '';
      el('productUrl').value = project.url || '';
      el('productCategory').value = project.category || 'Website';
      el('productDescription').value = project.description || '';
      el('productOrder').value = project.displayOrder || 0;
      el('productActive').checked = !!project.active;
      if (imageInput) imageInput.value = '';
      currentImage = project.image || '';
      showPreview(currentImage, 'Current project image — choose a new file to replace it');
      el('saveProductBtn').textContent = 'Update Project';
      msg.textContent = currentImage ? 'Current image kept unless you select a replacement.' : 'No current image. Select one from your computer.';
      form.hidden = false;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (deleteId && confirm('Delete this project? This cannot be undone.')) {
      try {
        msg.textContent = 'Deleting project…';
        await request(`/api/admin/products/${encodeURIComponent(deleteId)}`, { method: 'DELETE' });
        msg.textContent = 'Project deleted.';
        await load();
      } catch (error) { alert(error.message); }
    }
  });

  if (token()) load();
  else { table.innerHTML = '<tr><td colspan="6">Please log in to manage projects.</td></tr>'; msg.textContent = 'Your admin login is missing. Open Admin Login and sign in again.'; }
})();
