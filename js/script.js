/* =========================================================
   NITHYA & KRUPAKARAN — WEDDING INVITATION
   All interactive behavior. No build step required.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. EDIT THESE — the only two values most people need to change
     --------------------------------------------------------- */
  const WEDDING_DATE = new Date('2026-08-30T11:06:00+05:30'); // Tula Lagnam, IST
  const RSVP_ENDPOINT = ''; // e.g. 'https://script.google.com/macros/s/AKf.../exec' or Formspree URL
  const RSVP_STORAGE_KEY = 'wedding-rsvp-history';

  const editorPanel = document.getElementById('editor-panel');
  const editorTabs = document.querySelectorAll('.editor-tab');
  const editorPanels = document.querySelectorAll('.editor-panel-content');
  const applyBtn = document.getElementById('apply-edits');
  const hideBtn = document.getElementById('hide-editor');
  const liveStreamFrame = document.getElementById('live-stream-frame');

  function normalizeYouTubeEmbedUrl(value) {
    const raw = (value || '').trim();
    if (!raw) return 'https://www.youtube.com/embed/ScMzIvxBSi4?si=I3OqY9mXyabmD0gG';

    if (raw.includes('youtube.com/watch?v=')) {
      return raw.replace('watch?v=', 'embed/').split('&')[0];
    }

    if (raw.includes('youtu.be/')) {
      const videoId = raw.split('youtu.be/')[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (raw.includes('youtube.com/live/')) {
      const videoId = raw.split('youtube.com/live/')[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (raw.includes('/embed/')) {
      return raw;
    }

    return raw;
  }

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

  function setNamesWithAmpersand(targetSelector, value) {
    const nodes = document.querySelectorAll(targetSelector);
    const raw = (value || '').trim();
    const parts = raw.split('&');

    nodes.forEach((node) => {
      node.innerHTML = '';

      if (parts.length >= 2) {
        const left = document.createTextNode(parts[0].trim());
        const amp = document.createElement('span');
        amp.className = 'amp';
        amp.innerHTML = '&';
        const right = document.createTextNode(parts.slice(1).join('&').trim());
        node.append(left, amp, right);
      } else {
        node.textContent = raw || 'Nithya & Krupakaran';
      }
    });
  }

  function applyTextEdits() {
    const coupleNames = document.getElementById('edit-couple-names').value || 'Nithya & Krupakaran';
    const dateText = document.getElementById('edit-date').value || 'Sunday, 30th August 2026 &middot; 11:06 AM';
    const venueText = document.getElementById('edit-venue').value || 'Mounaswamy Mutt &middot; Tirumala Tirupathi, Tirupathi';
    const celebrationText = document.getElementById('edit-celebration').value || 'Pellikoothuru, Koorallu, the wedding ceremony, and reception — we look forward to celebrating with you.';
    const storyText = document.getElementById('edit-story').value || 'With the divine blessings of our elders, we invite you to grace this auspicious occasion.';
    const liveLink = document.getElementById('edit-live-link').value || 'https://www.youtube.com/embed/ScMzIvxBSi4?si=I3OqY9mXyabmD0gG';

    setNamesWithAmpersand('.gate-names, .hero-names, .foot-names', coupleNames);

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

    if (liveStreamFrame) {
      liveStreamFrame.src = normalizeYouTubeEmbedUrl(liveLink);
    }
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', applyTextEdits);
  }

  if (hideBtn) {
    hideBtn.addEventListener('click', () => {
      if (editorPanel) editorPanel.hidden = true;
    });
  }

  if (editorPanel) {
    editorPanel.hidden = false;
  }

  /* ---------------------------------------------------------
     2. GATE — "Open Invitation"
     --------------------------------------------------------- */
  const gate = document.getElementById('gate');
  const openBtn = document.getElementById('open-btn');
  const site = document.getElementById('site');
  const musicToggle = document.getElementById('music-toggle');
  let opened = false;

  function setMusicUI(isPlaying) {
    if (isPlaying) {
      musicToggle.classList.remove('is-paused');
      musicToggle.setAttribute('aria-pressed', 'true');
      musicToggle.setAttribute('aria-label', 'Turn sound off');
      musicLabel.textContent = 'Sound On';
    } else {
      musicToggle.classList.add('is-paused');
      musicToggle.setAttribute('aria-pressed', 'false');
      musicToggle.setAttribute('aria-label', 'Turn sound on');
      musicLabel.textContent = 'Sound Off';
    }
  }

  function startMusic() {
    if (!audio || audioFailed) {
      setMusicUI(false);
      return;
    }

    audio.muted = false;
    audio.volume = 0.65;
    audio.currentTime = 0;
    audio.play().then(() => {
      setMusicUI(true);
    }).catch(() => {
      audioFailed = true;
      setMusicUI(false);
    });
  }

  function openInvitation() {
    if (opened) return;
    opened = true;
    gate.classList.add('gate--hidden');
    site.classList.add('site--visible');
    musicToggle.classList.add('is-ready');
    startCountdown();
    buildPetals();
    startMusic();
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
      const left = Math.random() * 100;
      const duration = 12 + Math.random() * 12;
      const delay = Math.random() * 12;
      const driftX = (Math.random() - 0.5) * 150;
      const size = 10 + Math.random() * 10;
      p.style.left = left + '%';
      p.style.width = size + 'px';
      p.style.height = (size * 1.4) + 'px';
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
      setMusicUI(false);
      return;
    }
    if (audio.paused) {
      audio.muted = false;
      audio.volume = 0.65;
      audio.currentTime = 0;
      audio.play().then(() => {
        setMusicUI(true);
      }).catch(() => {
        audioFailed = true;
        setMusicUI(false);
      });
    } else {
      audio.pause();
      setMusicUI(false);
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
  const rsvpHistoryList = document.getElementById('rsvp-history-list');

  function readSavedRSVPs() {
    try {
      return JSON.parse(localStorage.getItem(RSVP_STORAGE_KEY) || '[]');
    } catch (error) {
      return [];
    }
  }

  function saveRSVPToLocalStorage(record) {
    const saved = readSavedRSVPs();
    saved.unshift(record);
    localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(saved));
  }

  function renderSavedRSVPs() {
    if (!rsvpHistoryList) return;
    const entries = readSavedRSVPs();

    if (!entries.length) {
      rsvpHistoryList.innerHTML = '<p class="rsvp-history-empty">No responses saved yet.</p>';
      return;
    }

    rsvpHistoryList.innerHTML = entries.map((entry) => `
      <div class="rsvp-history-item">
        <strong>${entry.name}</strong>
        <div>${entry.contact}</div>
        <div>${entry.functions || 'Wedding'}</div>
        <div>Guests: ${entry.guests || 'Just me'} &middot; Meal: ${entry.meal || 'No preference'}</div>
        <small>${entry.createdAt || 'Saved locally'}</small>
      </div>
    `).join('');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('.btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const data = new FormData(form);
    const selectedFunctions = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value);
    const record = {
      name: data.get('name') || '',
      contact: data.get('contact') || '',
      functions: selectedFunctions.length ? selectedFunctions.join(', ') : 'Wedding',
      guests: data.get('guests') || 'Just me',
      meal: data.get('meal') || 'No preference',
      message: data.get('message') || '',
      createdAt: new Date().toLocaleString(),
    };

    try {
      if (RSVP_ENDPOINT) {
        const res = await fetch(RSVP_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(record)
        });
        if (!res.ok) throw new Error('Request failed');
      }

      saveRSVPToLocalStorage(record);
      renderSavedRSVPs();
      form.reset();
      form.hidden = true;
      formNote.hidden = true;
      formSuccess.classList.add('is-visible');
    } catch (err) {
      saveRSVPToLocalStorage(record);
      renderSavedRSVPs();
      form.reset();
      form.hidden = true;
      formNote.hidden = true;
      formSuccess.classList.add('is-visible');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Send RSVP';
  });

  renderSavedRSVPs();

  const templeBg = document.querySelector('.temple-background');
  const updateTempleScroll = () => {
    if (!templeBg) return;
    const shift = Math.min(window.scrollY * 0.6, 220);
    document.documentElement.style.setProperty('--scroll-shift', `${shift}px`);
    templeBg.style.opacity = Math.min(0.9, 0.38 + (window.scrollY / 1500));
  };

  updateTempleScroll();
  window.addEventListener('scroll', updateTempleScroll, { passive: true });

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
