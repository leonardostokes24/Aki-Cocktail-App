// =============================================================
// Kiyori × Aki — Cocktail Flashcards
// Tap-to-reveal study cards · grey + red UI
// =============================================================

(function () {
  'use strict';

  const VENUES = ['Kiyori', 'Aki', 'Classics'];
  const state = {
    venue: 'Kiyori',
    category: 'All',
    index: 0,
    revealed: false,
    filtered: []
  };

  const $ = (id) => document.getElementById(id);
  const venueToggle = $('venue-toggle');
  const filtersEl = $('filters');
  const stage = $('stage');
  const posEl = $('pos');
  const totalEl = $('total');
  const filterLabel = $('filter-label');
  const prevBtn = $('prev');
  const nextBtn = $('next');
  const shuffleBtn = $('shuffle');

  function escape(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function categoriesFor(venue) {
    const set = new Set(cocktails.filter(c => c.venue === venue).map(c => c.category));
    return ['All', ...Array.from(set)];
  }

  function applyFilters() {
    state.filtered = cocktails.filter(c => {
      if (c.venue !== state.venue) return false;
      if (state.category !== 'All' && c.category !== state.category) return false;
      return true;
    });
    state.index = 0;
    state.revealed = false;
  }

  // ---- Venue toggle ----
  function renderVenueToggle() {
    venueToggle.innerHTML = VENUES.map(v => {
      const count = cocktails.filter(c => c.venue === v).length;
      return `<button class="venue-btn ${v === state.venue ? 'active' : ''}" data-venue="${v}">${v}</button>`;
    }).join('');
    venueToggle.querySelectorAll('.venue-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.venue = btn.dataset.venue;
        state.category = 'All';
        applyFilters();
        renderAll();
      });
    });
  }

  // ---- Category pills ----
  function renderFilters() {
    const cats = categoriesFor(state.venue);
    filtersEl.innerHTML = cats.map(cat =>
      `<button class="pill ${cat === state.category ? 'active' : ''}" data-cat="${escape(cat)}">${escape(cat)}</button>`
    ).join('');
    filtersEl.querySelectorAll('.pill').forEach(btn => {
      btn.addEventListener('click', () => {
        state.category = btn.dataset.cat;
        applyFilters();
        renderAll();
      });
    });
  }

  // ---- Counter ----
  function renderCounter() {
    if (state.filtered.length === 0) {
      posEl.textContent = '00';
      totalEl.textContent = '00';
    } else {
      posEl.textContent = String(state.index + 1).padStart(2, '0');
      totalEl.textContent = String(state.filtered.length).padStart(2, '0');
    }
    filterLabel.textContent = state.category === 'All' ? `All ${state.venue}` : state.category;
  }

  // ---- Card builders ----
  function topRow(c, venueLabel) {
    return `
      <div class="card-top">
        <span class="cat-tag">${escape(c.category)}</span>
        ${c.hasNA ? '<span class="na-badge">N/A</span>' : `<span class="venue-label">${escape(venueLabel)}</span>`}
      </div>`;
  }

  function kiyoriCard(c) {
    return `
      <div class="card" id="card">
        ${topRow(c, 'Kiyori')}
        <div class="front-content">
          <div class="cocktail-name">${escape(c.name)}</div>
          ${c.prefecture ? `<div class="cocktail-sub">${escape(c.prefecture)}</div>` : ''}
          ${c.price ? `<div class="price">${escape(c.price)}</div>` : ''}

          <div class="reveal-zone">
            <button class="reveal-btn" data-reveal>Reveal Spec</button>
          </div>

          <div class="answer">
            ${c.narrative ? `<div class="narrative">"${escape(c.narrative)}"</div>` : ''}
            <div class="answer-label">Build</div>
            <div class="body-text">${escape(c.ingredients || '—')}</div>
            <div class="answer-label" style="margin-top:20px;">Spec</div>
            <div class="spec-list">
              <div class="spec-row"><span class="spec-label">Volume</span><span class="spec-value accent">${escape(c.volume || '—')}</span></div>
              <div class="spec-row"><span class="spec-label">Method</span><span class="spec-value">${escape(c.method || '—')}</span></div>
              <div class="spec-row"><span class="spec-label">Glass</span><span class="spec-value">${escape(c.glass || '—')}</span></div>
              <div class="spec-row"><span class="spec-label">Garnish</span><span class="spec-value">${escape(c.garnish || '—')}</span></div>
              <div class="spec-row"><span class="spec-label">Ice</span><span class="spec-value">${escape(c.ice || '—')}</span></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function akiCard(c) {
    const notes = (c.tastingNotes || []).map(n => `<span class="tasting-chip">${escape(n)}</span>`).join('');
    return `
      <div class="card" id="card">
        ${topRow(c, 'Aki')}
        <div class="front-content">
          <div class="cocktail-name">${escape(c.name)}</div>
          ${c.price ? `<div class="price">${escape(c.price)}</div>` : ''}
          ${notes ? `<div class="tasting-row">${notes}</div>` : ''}

          <div class="reveal-zone">
            <button class="reveal-btn" data-reveal>Reveal Build</button>
          </div>

          <div class="answer">
            <div class="answer-label">Ingredients</div>
            <div class="body-text">${escape(c.ingredients || '—')}</div>
            <div class="answer-label" style="margin-top:20px;">Prep</div>
            <div class="body-text">${escape(c.prep || '—')}</div>
          </div>
        </div>
      </div>`;
  }

  function classicCard(c) {
    return `
      <div class="card" id="card">
        ${topRow(c, 'Classic')}
        <div class="front-content">
          <div class="cocktail-name">${escape(c.name)}</div>
          <div class="prompt">Recall the build, then reveal to check.</div>

          <div class="reveal-zone">
            <button class="reveal-btn" data-reveal>Reveal Recipe</button>
          </div>

          <div class="answer">
            <div class="answer-label">Recipe</div>
            <div class="body-text">${escape(c.prep || '—')}</div>
          </div>
        </div>
      </div>`;
  }

  function renderCard() {
    if (state.filtered.length === 0) {
      stage.innerHTML = `<div class="empty-state">No serves match this filter.</div>`;
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }
    const c = state.filtered[state.index];
    let html;
    if (c.venue === 'Kiyori') html = kiyoriCard(c);
    else if (c.venue === 'Aki') html = akiCard(c);
    else html = classicCard(c);

    stage.innerHTML = html;

    const card = $('card');
    if (state.revealed) card.classList.add('revealed');

    // Reveal button
    const revealBtn = card.querySelector('[data-reveal]');
    if (revealBtn) {
      revealBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.revealed = true;
        card.classList.add('revealed');
      });
    }
    // Tapping the revealed card hides it again (toggle back to study)
    card.addEventListener('click', () => {
      if (state.revealed) {
        state.revealed = false;
        card.classList.remove('revealed');
      }
    });

    prevBtn.disabled = state.index === 0;
    nextBtn.disabled = state.index === state.filtered.length - 1;
  }

  function renderAll() {
    renderVenueToggle();
    renderFilters();
    renderCounter();
    renderCard();
  }

  function go(delta) {
    const ni = state.index + delta;
    if (ni < 0 || ni >= state.filtered.length) return;
    state.index = ni;
    state.revealed = false;
    renderCounter();
    renderCard();
  }

  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); go(-1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); go(1); });

  shuffleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.filtered.length < 2) return;
    const a = state.filtered;
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    state.index = 0;
    state.revealed = false;
    renderCounter();
    renderCard();
  });

  // Swipe
  let sx = 0, sy = 0;
  stage.addEventListener('touchstart', (e) => {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      go(dx < 0 ? 1 : -1);
    }
  }, { passive: true });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === ' ') {
      e.preventDefault();
      const card = $('card');
      if (!card) return;
      state.revealed = !state.revealed;
      card.classList.toggle('revealed', state.revealed);
    }
  });

  applyFilters();
  renderAll();
})();
