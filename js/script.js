/* =========================================================
   NITHYA & KRUPAKARAN — WEDDING INVITATION
   All interactive behavior. No build step required.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. EDIT THESE — the only two values most people need to change
     --------------------------------------------------------- */
  const WEDDING_DATE = new Date('2026-08-30T11:06:00+05:30'); // Tula Lagnam, IST
  const RSVP_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxxx' — leave blank to use the built-in demo mode

  const editorPanel = document.getElementById('editor-panel');
  const editorTabs = document.querySelectorAll('.editor-tab');
  const editorPanels = document.querySelectorAll('.editor-panel-content');
  const applyBtn = document.getElementById('apply-edits');
  const hideBtn = document.getElementById('hide-editor');

  function setTab(tabName) {
    editorTabs.forEach((tab) => {
      const active = tab.dataset.tab === tabName;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    editorPanels.forEach((panel) => {
      const active = panel.dataset.panel === tabName;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  }

  editorTabs.forEach((tab) => {
    tab.addEventListener('click', () => setTab(tab.dataset.tab));
  });

  function formatCoupleNames(value) {
    const trimmed = (value || '').trim();
    const match = trimmed.match(/^(.+?)\s*&\s*(.+)$/);
    if (match) {
      return `${match[1].trim()}<span class="amp">&amp;</span>${match[2].trim()}`;
    }
    return trimmed;
  }

  function applyTextEdits() {
    const coupleNames = document.getElementById('edit-couple-names').value || 'Nithya & Krupakaran';
    const dateText = document.getElementById('edit-date').value || 'Sunday, 30th August 2026 &middot; 11:06 AM';
    const venueText = document.getElementById('edit-venue').value || 'Mounaswamy Mutt &middot; Tirumala Tirupathi, Tirupathi';
    const celebrationText = document.getElementById('edit-celebration').value || 'Pellikoothuru, Koorallu, the wedding ceremony, and reception — we look forward to celebrating with you.';
    const storyText = document.getElementById('edit-story').value || 'With the divine blessings of our elders, we invite you to grace this auspicious occasion.';

    document.querySelectorAll('.gate-names, .hero-names, .foot-names').forEach((el) => {
      el.innerHTML = formatCoupleNames(coupleNames);
    });

    document.querySelectorAll('.gate-sub, .hero-date').forEach((el) => {
      el.innerHTML = dateText;
    });

    document.querySelectorAll('.hero-place').forEach((el) => {
      el.innerHTML = venueText;
    });

    const eventsLead = document.querySelector('#events .section-head p');
    if (eventsLead) eventsLead.textContent = celebrationText;

    const storyLead = document.querySelector('#story .section-head p');
    if (storyLead) storyLead.textContent = storyText;
  }

  applyBtn.addEventListener('click', applyTextEdits);
  hideBtn.addEventListener('click', () => {
    editorPanel.hidden = true;
  });

  const toggleEditor = document.getElementById('toggle-editor');
  if (toggleEditor) {
    toggleEditor.addEventListener('click', () => { editorPanel.hidden = !editorPanel.hidden; });
  }

  /* ---------------------------------------------------------
     2. GATE — "Open Invitation"
     --------------------------------------------------------- */
  const gate = document.getElementById('gate');
  const openBtn = document.getElementById('open-btn');
  const site = document.getElementById('site');
  const musicToggle = document.getElementById('music-toggle');
  let opened = false;

  function openInvitation() {
    if (opened) return;
    opened = true;
    gate.classList.add('gate--hidden');
    site.classList.add('site--visible');
    musicToggle.classList.add('is-ready');
    startCountdown();
    buildPetals();
  }

  openBtn.addEventListener('click', openInvitation);

  /* ---------------------------------------------------------
     3. COUNTDOWN TIMER
     --------------------------------------------------------- */
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');
  let countdownInterval = null;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now = new Date();
    let diff = WEDDING_DATE - now;
    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMins.textContent = '00';
      cdSecs.textContent = '00';
      clearInterval(countdownInterval);
      return;
    }
    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);
    diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(mins);
    cdSecs.textContent = pad(secs);
  }

  function startCountdown() {
    tick();
    countdownInterval = setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------
     4. FLOATING PETALS — gate (continuous) + hero (on open)
     --------------------------------------------------------- */
  function spawnPetal(container, count) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      p.innerHTML = '<img src="assets/petal.svg" alt="">';
      const left = Math.random() * 100;
      const duration = 12 + Math.random() * 12;
      const delay = Math.random() * 12;
      const driftX = (Math.random() - 0.5) * 150;
      p.style.left = left + '%';
      p.style.width = p.style.height = (10 + Math.random() * 10) + 'px';
      p.style.animationDuration = duration + 's';
      p.style.animationDelay = '-' + delay + 's';
      p.style.setProperty('--drift-x', driftX + 'px');
      container.appendChild(p);
    }
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    spawnPetal(document.getElementById('gate-petals'), window.innerWidth < 640 ? 5 : 9);
  }

  function buildPetals() {
    const field = document.getElementById('petal-field');
    if (!field || reduceMotion) return;
    spawnPetal(field, window.innerWidth < 640 ? 6 : 10);
  }

  /* ---------------------------------------------------------
     5. BACKGROUND MUSIC TOGGLE
     --------------------------------------------------------- */
  const audio = document.getElementById('bg-music');
  const musicLabel = document.getElementById('music-label');
  let audioFailed = false;

  audio.addEventListener('error', () => { audioFailed = true; });

  musicToggle.addEventListener('click', () => {
    if (audioFailed) {
      musicToggle.classList.add('is-paused');
      return;
    }
    if (audio.paused) {
      audio.play().then(() => {
        musicToggle.classList.remove('is-paused');
        musicToggle.setAttribute('aria-pressed', 'true');
        musicToggle.setAttribute('aria-label', 'Turn sound off');
        musicLabel.textContent = 'Sound On';
      }).catch(() => {
        audioFailed = true;
      });
    } else {
      audio.pause();
      musicToggle.classList.add('is-paused');
      musicToggle.setAttribute('aria-pressed', 'false');
      musicToggle.setAttribute('aria-label', 'Turn sound on');
      musicLabel.textContent = 'Sound Off';
    }
  });

  /* ---------------------------------------------------------
     6. GALLERY LIGHTBOX
     --------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item img').forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-active');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    lightboxImg.src = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------------------------------------------------------
     7. RSVP FORM
     --------------------------------------------------------- */
  const form = document.getElementById('rsvp-form');
  const formNote = document.getElementById('form-note');
  const formSuccess = document.getElementById('form-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('.btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const data = new FormData(form);

    try {
      if (RSVP_ENDPOINT) {
        const res = await fetch(RSVP_ENDPOINT, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error('Request failed');
      } else {
        // Demo mode: no endpoint configured yet — simulate success locally.
        await new Promise((resolve) => setTimeout(resolve, 600));
        console.log('RSVP (demo mode — connect RSVP_ENDPOINT in js/script.js):',
          Object.fromEntries(data.entries()));
      }
      form.reset();
      form.hidden = true;
      formNote.hidden = true;
      formSuccess.classList.add('is-visible');
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send RSVP';
      formNote.textContent = 'Something went wrong sending that — please try again, or reach us directly.';
    }
  });

  /* ---------------------------------------------------------
     8. SCROLL REVEAL (subtle, respects reduced motion)
     --------------------------------------------------------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll('.event-card, .story-item, .gallery-item');
    revealTargets.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach((el) => observer.observe(el));
  }

});
