(() => {
  'use strict';
  const form = document.getElementById('joinTeamForm');
  const status = document.getElementById('joinTeamStatus');
  if (!form || !status) return;
  const API = String(window.GROWTECHAXON_API_URL || ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://growtechaxon-backend.onrender.com')).replace(/\/+$/, '');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Submitting…';
    status.textContent = 'Submitting your application…';
    status.className = 'join-team-status';
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.service = 'Joining Team';
    payload.business = '';
    payload.budget = '';
    try {
      const response = await fetch(`${API}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      const raw = await response.text();
      let data;
      try { data = raw ? JSON.parse(raw) : {}; } catch { throw new Error(`Server returned an unreadable response (HTTP ${response.status}).`); }
      if (!response.ok || data.success === false) throw new Error(data.message || `Could not submit application (HTTP ${response.status}).`);
      form.reset();
      status.textContent = 'Application submitted successfully. Our team will contact you if there is a suitable opportunity.';
      status.classList.add('success');
    } catch (error) {
      status.textContent = error.message || 'Unable to submit right now. Please try again later.';
      status.classList.add('error');
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
})();
