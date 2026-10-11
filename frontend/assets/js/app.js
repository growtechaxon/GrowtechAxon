
(() => {
  'use strict';

  // ==========================================
  // 1. API CONFIGURATION
  // ==========================================
  // Keep public pages and Admin on the same API/database by default.
  // An explicit deployment override remains supported when needed.
  const API = String(window.GROWTECHAXON_API_URL || window.location.origin)
    .replace(/\/+$/, '');

  const FALLBACK_IMAGE = '/assets/images/logo.jpeg';

  // ==========================================
  // 2. CURRENT YEAR
  // ==========================================
  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // ==========================================
  // 3. MOBILE NAVIGATION
  // ==========================================
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (!window.matchMedia('(max-width: 820px)').matches) {
          return;
        }

        if (!link.parentElement.classList.contains('nav-drop')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Mobile dropdown navigation
  document.querySelectorAll('.nav-drop > a').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!window.matchMedia('(max-width: 820px)').matches) {
        return;
      }

      const parent = link.parentElement;

      if (!parent.classList.contains('open')) {
        event.preventDefault();
        parent.classList.add('open');
      } else {
        parent.classList.remove('open');
      }
    });
  });

  // ==========================================
  // 4. SAFE HTML AND URL HELPERS
  // ==========================================
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => {
      const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };

      return entities[character];
    });
  }

  function photoUrl(value) {
    const photo = String(value || '').trim();

    if (!photo) {
      return FALLBACK_IMAGE;
    }

    // Full URLs, including Cloudinary image URLs
    if (/^https?:\/\//i.test(photo)) {
      try {
        const url = new URL(photo);

        if (!['http:', 'https:'].includes(url.protocol)) {
          return FALLBACK_IMAGE;
        }

        // Replace localhost image URLs on the live website
        if (
          location.hostname !== 'localhost' &&
          location.hostname !== '127.0.0.1' &&
          ['localhost', '127.0.0.1'].includes(url.hostname)
        ) {
          return API + url.pathname + url.search;
        }

        return url.href;
      } catch {
        return FALLBACK_IMAGE;
      }
    }

    // Relative image path
    return API + '/' + photo.replace(/^\/+/, '');
  }

  function safeLinkedIn(value) {
    try {
      const url = new URL(String(value || '').trim());

      if (
        !['http:', 'https:'].includes(url.protocol) ||
        !/(^|\.)linkedin\.com$/i.test(url.hostname)
      ) {
        return '';
      }

      return url.href;
    } catch {
      return '';
    }
  }

  // ==========================================
  // 5. TEAM CARD
  // ==========================================
  function teamCard(member, founder = false) {
    const name = escapeHtml(member.name || 'Team Member');

    const designation = escapeHtml(
      member.designation || 'Technology Professional'
    );

    const description = escapeHtml(member.description || '');

    const image = escapeHtml(
      photoUrl(member.photo || member.photoUrl || member.image)
    );

    const linkedIn = safeLinkedIn(member.linkedin);

    const founderBadge = founder
      ? '<span class="founder-badge">Founder & CEO</span>'
      : '';

    const descriptionHtml = description
      ? `<p>${description}</p>`
      : '';

    const linkedInHtml = linkedIn
      ? `
          <a
            class="linkedin-btn"
            href="${escapeHtml(linkedIn)}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View ${name} on LinkedIn"
          >
            LinkedIn ↗
          </a>
        `
      : '';

    return `
      <article class="card team-card${founder ? ' founder-card' : ''}">
        <div class="team-photo-wrap">
          <img
            class="team-photo"
            src="${image}"
            alt="${name} - ${designation}"
            loading="lazy"
            decoding="async"
            onerror="this.onerror=null;this.src='/assets/images/logo.jpeg';"
          />
          ${founderBadge}
        </div>

        <div class="body">
          <span class="team-role">
            ${founder ? 'Founder & Leadership' : 'Team Member'}
          </span>

          <h3>${name}</h3>
          <strong>${designation}</strong>

          ${descriptionHtml}
          ${linkedInHtml}
        </div>
      </article>
    `;
  }

  // ==========================================
  // 6. LOAD TEAM FROM BACKEND
  // ==========================================
  async function loadTeam(container) {
    container.innerHTML =
      '<div class="notice">Loading team profiles...</div>';

    try {
      console.info('[GrowtechAxon] Loading team from:', API);

      const response = await fetch(`${API}/api/team`, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Team API returned HTTP ${response.status}`);
      }

      const data = await response.json();

      console.info('[GrowtechAxon] Team API response:', data);

      const items = Array.isArray(data.team)
        ? data.team
        : Array.isArray(data.data)
          ? data.data
          : [];

      if (!items.length) {
        container.innerHTML =
          '<div class="notice">No team profiles found.</div>';

        console.warn('[GrowtechAxon] The Team API returned no members.');
        return;
      }

      // Log the photo URLs to help diagnose image problems.
      items.forEach((member) => {
        console.info(
          `[GrowtechAxon] ${member.name}:`,
          member.photo || member.photoUrl || member.image || '(no photo URL)'
        );
      });

      // Find the founder using the flag or designation.
      const founder =
        items.find((member) => member.isFounder === true) ||
        items.find((member) =>
          /\bfounder\b/i.test(member.designation || '')
        ) ||
        null;

      const members = items.filter((member) => {
        return !founder ||
          String(member._id || member.id || member.name) !==
          String(founder._id || founder.id || founder.name);
      });

      const founderHtml = founder
        ? `
            <div class="founder-wrap">
              ${teamCard(founder, true)}
            </div>
          `
        : '';

      const membersHtml = members.length
        ? `
            <div class="team-grid team-members-grid">
              ${members.map((member) => teamCard(member)).join('')}
            </div>
          `
        : '';

      const founderNotice = !founder
        ? `
            <div class="notice team-founder-note">
              No team member is currently marked as Founder.
            </div>
          `
        : '';

      container.innerHTML =
        founderHtml + founderNotice + membersHtml;

      console.info(
        `[GrowtechAxon] Loaded ${items.length} team member(s).`
      );

    } catch (error) {
      console.error('[GrowtechAxon] Team load error:', error);

      container.innerHTML = `
        <div class="notice">
          Team information is temporarily unavailable.
          Please try again later.
        </div>
      `;
    }
  }

  document.querySelectorAll('[data-team-grid]').forEach((container) => {
    loadTeam(container);
  });

  // ==========================================
  // 7. CONTACT / LEAD FORMS
  // ==========================================
  const selectedPlanId = new URLSearchParams(window.location.search).get('plan');
  const selectedPlan = ({
    starter: { name: 'Starter Website', price: 0, service: 'Website Development', budget: '₹0' },
    business: { name: 'Business Website', price: 4999, service: 'Business Website Development', budget: '₹4,999' },
    software: { name: 'Software / App', price: 9999, service: 'Software / App Development', budget: '₹9,999' }
  })[selectedPlanId];

  document.querySelectorAll('[data-lead-form]').forEach((form) => {
    if (selectedPlan) {
      let planIdInput = form.querySelector('[name="planId"]');
      if (!planIdInput) {
        planIdInput = document.createElement('input');
        planIdInput.type = 'hidden';
        planIdInput.name = 'planId';
        form.appendChild(planIdInput);
      }
      planIdInput.value = selectedPlanId;
      const serviceInput = form.querySelector('[name="service"]');
      if (serviceInput) {
        if (serviceInput.tagName === 'SELECT' && !Array.from(serviceInput.options).some((o) => o.value === selectedPlan.service)) {
          const option = document.createElement('option');
          option.value = selectedPlan.service;
          option.textContent = selectedPlan.service;
          serviceInput.appendChild(option);
        }
        serviceInput.value = selectedPlan.service;
      }
      const budgetInput = form.querySelector('[name="budget"]');
      if (budgetInput) budgetInput.value = selectedPlan.budget;
      const heading = form.closest('.container')?.querySelector('h1');
      if (heading) heading.textContent = `Request ${selectedPlan.name} — ₹${selectedPlan.price.toLocaleString('en-IN')}`;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const button = form.querySelector('button[type="submit"]');
      const message = form.querySelector('.form-message');

      const payload = Object.fromEntries(
        new FormData(form).entries()
      );

      if (button) {
        button.disabled = true;
      }

      if (message) {
        message.textContent = 'Sending...';
      }

      try {
        const response = await fetch(`${API}/api/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Unable to send your enquiry.'
          );
        }

        if (message) {
          message.textContent =
            'Thank you! Your enquiry has been received.';
        }

        form.reset();

      } catch (error) {
        console.error('[GrowtechAxon] Lead form error:', error);

        if (message) {
          message.textContent =
            error.message || 'Unable to send your enquiry right now.';
        }

      } finally {
        if (button) {
          button.disabled = false;
        }
      }
    });
  });

  console.info('[GrowtechAxon] App initialized successfully.');

})();
