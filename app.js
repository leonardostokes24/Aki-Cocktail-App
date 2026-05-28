// =============================================================
// Kiyori × Aki — Cocktail Flashcards
// Renders cards with venue-specific layouts and category filtering
// =============================================================

(function () {
  'use strict';

  // ---- State ----
  const VENUES = ['Kiyori', 'Aki', 'Classics'];
  const state = {
    venue: 'Kiyori',
    category: 'All',
    index: 0,
    filtered: []
  };

  // ---- DOM ----
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

  // ---- Helpers ----
  function escape(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function categoriesFor(venue) {
    const set = new Set(
      cocktails.filter(c => c.venue === venue).map(c => c.category)
    );
    return ['All', ...Array.from(set)];
  }

  function applyFilters() {
    state.filtered = cocktails.filter(c => {
      if (c.venue !== state.venue) return false;
      if (state.category !== 'All' && c.category !== state.category) return false;
      return true;
    });
    state.index = 0;
  }

  // ---- Render: Venue Toggle ----
  function renderVenueToggle() {
    venueToggle.innerHTML = VENUES.map(v => {
      const count = cocktails.filter(c => c.venue === v).length;
      return `<button class="venue-btn ${v === state.venue ? 'active' : ''}" data-venue="${v}">${v} · ${count}</button>`;
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

  // ---- Render: Category Filters ----
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

  // ---- Render: Counter ----
  function renderCounter() {
    if (state.filtered.length === 0) {
      posEl.textContent = '00';
      totalEl.textContent = '00';
    } else {
      posEl.textContent = String(state.index + 1).padStart(2, '0');
      totalEl.textContent = String(state.filtered.length).padStart(2, '0');
    }
    const label = state.category === 'All'
      ? `All ${state.venue}`
      : state.category;
    filterLabel.textContent = label;
  }

  // ---- Render: Empty State ----
  function renderEmpty() {
    stage.innerHTML = `<div class="empty-state">No serves match this filter.</div>`;
  }

  // ---- Render: KIYORI card layout ----
  function renderKiyoriCard(c) {
    return `
      <div class="card" id="card">
        <div class="face face-front">
          ${c.hasNA ? '<div class="non-alc-badge">N/A Available</div>' : ''}
          <div class="venue-tag">Kiyori</div>
          <div class="kanji-watermark">${escape(c.kanji || '')}</div>
          <div class="prefecture">${escape(c.prefecture || '')}</div>
          <div class="cocktail-name">${escape(c.name)}</div>
          ${c.kanji ? `<div class="cocktail-kanji">${escape(c.kanji)}</div>` : ''}
          <div class="price">${escape(c.price || '')}</div>

          <div class="spec-block">
            <div class="spec-row"><span class="spec-label">Volume</span><span class="spec-value highlight">${escape(c.volume || '—')}</span></div>
            <div class="spec-row"><span class="spec-label">Method</span><span class="spec-value">${escape(c.method || '—')}</span></div>
            <div class="spec-row"><span class="spec-label">Glass</span><span class="spec-value">${escape(c.glass || '—')}</span></div>
            <div class="spec-row"><span class="spec-label">Garnish</span><span class="spec-value">${escape(c.garnish || '—')}</span></div>
            <div class="spec-row"><span class="spec-label">Ice</span><span class="spec-value">${escape(c.ice || '—')}</span></div>
          </div>

          <div class="flip-hint">— Tap to reveal —</div>
        </div>

        <div class="face face-back">
          <div class="back-header">
            <div class="back-eyebrow">${escape(c.category)}</div>
            <div class="back-name">${escape(c.name)}</div>
            <div class="divider-flourish"><span>◆</span></div>
          </div>
          ${c.narrative ? `<div class="narrative">"${escape(c.narrative)}"</div>` : ''}
          <div class="ingredients-label">— Build —</div>
          <div class="ingredients">${escape(c.ingredients || '—')}</div>
          <div class="technique-block">
            <div class="tech-cell"><div class="tlabel">Method</div><div class="tval">${escape(c.method || '—')}</div></div>
            <div class="tech-cell"><div class="tlabel">Glassware</div><div class="tval">${escape(c.glass || '—')}</div></div>
          </div>
          <div class="flip-hint">— Tap to return —</div>
        </div>
      </div>
    `;
  }

  // ---- Render: AKI card layout ----
  function renderAkiCard(c) {
    const notes = (c.tastingNotes || []).map(n =>
      `<span class="tasting-chip">${escape(n)}</span>`
    ).join('');
    return `
      <div class="card" id="card">
        <div class="face face-front">
          ${c.hasNA ? '<div class="non-alc-badge">N/A</div>' : ''}
          <div class="venue-tag">Aki</div>
          <div class="kanji-watermark">${escape(c.kanji || '')}</div>
          <div class="prefecture">${escape(c.category)} · Aki Bar</div>
          <div class="cocktail-name">${escape(c.name)}</div>
          ${c.kanji ? `<div class="cocktail-kanji">${escape(c.kanji)}</div>` : ''}
          <div class="price">${escape(c.price || '')}</div>

          ${notes ? `<div class="tasting-row">${notes}</div>` : ''}

          <div class="spec-block">
            <div class="spec-label" style="margin-bottom:8px;">Ingredients</div>
            <div class="ingredients-front">${escape(c.ingredients || '—')}</div>
          </div>

          <div class="flip-hint">— Tap for prep —</div>
        </div>

        <div class="face face-back">
          <div class="back-header">
            <div class="back-eyebrow">${escape(c.category)} · Prep</div>
            <div class="back-name">${escape(c.name)}</div>
            <div class="divider-flourish"><span>◆</span></div>
          </div>
          <div class="ingredients-label">— Build Instructions —</div>
          <div class="prep-text">${escape(c.prep || '—')}</div>
          ${c.ingredients ? `
            <div class="ingredients-label" style="margin-top:20px;">— Spec —</div>
            <div class="ingredients">${escape(c.ingredients)}</div>
          ` : ''}
          <div class="flip-hint">— Tap to return —</div>
        </div>
      </div>
    `;
  }

  // ---- Render: CLASSICS card layout ----
  function renderClassicCard(c) {
    return `
      <div class="card" id="card">
        <div class="face face-front">
          <div class="venue-tag">Classic</div>
          <div class="prefecture">UK Bar Standard</div>
          <div class="cocktail-name" style="margin-top:30px;">${escape(c.name)}</div>
          <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:20px 0;">
            <div class="classic-prompt">Recall the build, then tap to verify.</div>
          </div>
          <div class="flip-hint">— Tap to reveal —</div>
        </div>

        <div class="face face-back">
          <div class="back-header">
            <div class="back-eyebrow">Classic</div>
            <div class="back-name">${escape(c.name)}</div>
            <div class="divider-flourish"><span>◆</span></div>
          </div>
          <div class="ingredients-label">— Recipe —</div>
          <div class="prep-text">${escape(c.prep || '—')}</div>
          <div class="flip-hint">— Tap to return —</div>
        </div>
      </div>
    `;
  }

  // ---- Render: Card (dispatches by venue) ----
  function renderCard() {
    if (state.filtered.length === 0) {
      renderEmpty();
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }
    const c = state.filtered[state.index];
    let html;
    if (c.venue === 'Kiyori') html = renderKiyoriCard(c);
    else if (c.venue === 'Aki') html = renderAkiCard(c);
    else html = renderClassicCard(c);

    stage.innerHTML = html;

    const card = $('card');
    if (card) {
      card.addEventListener('click', () => card.classList.toggle('flipped'));
    }

    prevBtn.disabled = state.index === 0;
    nextBtn.disabled = state.index === state.filtered.length - 1;
  }

  // ---- Render: All ----
  function renderAll() {
    renderVenueToggle();
    renderFilters();
    renderCounter();
    renderCard();
  }

  // ---- Controls ----
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.index > 0) {
      state.index--;
      renderCounter();
      renderCard();
    }
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.index < state.filtered.length - 1) {
      state.index++;
      renderCounter();
      renderCard();
    }
  });

  shuffleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.filtered.length < 2) return;
    // Fisher-Yates shuffle
    const a = state.filtered;
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    state.index = 0;
    renderCounter();
    renderCard();
  });

  // ---- Touch swipe ----
  let touchStartX = 0;
  let touchStartY = 0;
  stage.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // Only treat as swipe if horizontal motion dominates
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0 && state.index < state.filtered.length - 1) {
        state.index++;
        renderCounter();
        renderCard();
      } else if (dx > 0 && state.index > 0) {
        state.index--;
        renderCounter();
        renderCard();
      }
    }
  }, { passive: true });

  // ---- Keyboard ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && state.index > 0) {
      state.index--;
      renderCounter();
      renderCard();
    } else if (e.key === 'ArrowRight' && state.index < state.filtered.length - 1) {
      state.index++;
      renderCounter();
      renderCard();
    } else if (e.key === ' ') {
      e.preventDefault();
      $('card')?.classList.toggle('flipped');
    }
  });

  // ---- Init ----
  applyFilters();
  renderAll();
})();
