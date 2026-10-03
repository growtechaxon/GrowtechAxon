(() => {
  const DEFAULT_API = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : 'https://growtechaxon-backend.onrender.com';
  const API = (window.GROWTECHAXON_API_URL || DEFAULT_API).replace(/\/$/, '');

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.nav-drop>a').forEach(a => a.addEventListener('click', e => {
    if (window.matchMedia('(max-width:820px)').matches) {
      const parent = a.parentElement;
      if (!parent.classList.contains('open')) {
        e.preventDefault();
        parent.classList.add('open');
      }
    }
  }));

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
  }

  function photoUrl(value) {
    if (!value) return '/assets/images/logo.jpeg';
    if (/^https?:\/\//i.test(value)) return value;
    return API + '/' + String(value).replace(/^\//, '');
  }

  function safeLinkedIn(value) {
    try {
      const url = new URL(String(value || ''));
      return /^https?:$/i.test(url.protocol) && /(^|\.)linkedin\.com$/i.test(url.hostname)
        ? url.href
        : '';
    } catch {
      return '';
    }
  }

  function teamCard(member, founder = false) {
    const name = escapeHtml(member.name || 'Team Member');
    const designation = escapeHtml(member.designation || 'Technology Professional');
    const description = escapeHtml(member.description || '');
    const linkedIn = safeLinkedIn(member.linkedin);
    return `<article class="card team-card${founder ? ' founder-card' : ''}">
      <div class="team-photo-wrap">
        <img src="${escapeHtml(photoUrl(member.photo))}" alt="${name} - ${designation}" loading="lazy" onerror="this.onerror=null;this.src='/assets/images/logo.jpeg';">
        ${founder ? '<span class="founder-badge">Founder</span>' : ''}
      </div>
      <div class="body">
        <span class="team-role">${founder ? 'Founder & Leadership' : 'Team Member'}</span>
        <h3>${name}</h3>
        <strong>${designation}</strong>
        ${description ? `<p>${description}</p>` : ''}
        ${linkedIn ? `<a class="linkedin-btn" href="${escapeHtml(linkedIn)}" target="_blank" rel="noopener noreferrer" aria-label="View ${name} on LinkedIn">LinkedIn ↗</a>` : ''}
      </div>
    </article>`;
  }

  async function loadTeam(container) {
    try {
      const response = await fetch(API + '/api/team', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Team API unavailable');
      const data = await response.json();
      const items = Array.isArray(data.team) ? data.team : (Array.isArray(data.data) ? data.data : []);
      if (!items.length) {
        container.innerHTML = '<div class="notice">Team profiles will be published here as the organization adds them.</div>';
        return;
      }

      const founder = items.find(item => item.isFounder === true || /\bfounder\b/i.test(item.designation || ''));
      const members = items.filter(item => item !== founder);
      const founderHtml = founder
        ? `<div class="founder-wrap">${teamCard(founder, true)}</div>`
        : '';
      const membersHtml = members.length
        ? `<div class="team-grid team-members-grid">${members.map(item => teamCard(item)).join('')}</div>`
        : '';
      const fallbackNotice = !founder
        ? '<div class="notice team-founder-note">No profile is marked as Founder yet. Use the Admin Team panel to mark the primary profile.</div>'
        : '';
      container.innerHTML = founderHtml + fallbackNotice + membersHtml;
    } catch (error) {
      console.error('Team load error:', error);
      container.innerHTML = '<div class="notice">Team information is temporarily unavailable. Please contact GrowtechAxon for current details.</div>';
    }
  }

  document.querySelectorAll('[data-team-grid]').forEach(loadTeam);

  document.querySelectorAll('[data-lead-form]').forEach(form => form.addEventListener('submit', async e => {
    e.preventDefault();
    const button = form.querySelector('button[type=submit]');
    const msg = form.querySelector('.form-message');
    const payload = Object.fromEntries(new FormData(form).entries());
    if (button) button.disabled = true;
    if (msg) msg.textContent = 'Sending…';
    try {
      const response = await fetch(API + '/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to send');
      if (msg) msg.textContent = 'Thanks. Your enquiry has been received.';
      form.reset();
    } catch (error) {
      if (msg) msg.textContent = error.message || 'Unable to send right now.';
    } finally {
      if (button) button.disabled = false;
    }
  }));
})();
