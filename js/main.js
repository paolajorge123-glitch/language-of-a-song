// The Language of a Song — shared site behavior

document.addEventListener('DOMContentLoaded', () => {

  // ---- Newsletter forms: placeholder submit (swap with real provider later) ----
  document.querySelectorAll('form[id^="newsletter-form"], #footer-newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const note = document.getElementById('newsletter-note');
      if (input && input.value) {
        if (note) {
          note.classList.add('visible');
        } else {
          alert("Thanks for subscribing! (Connect an email service like Mailchimp or Kit to make this live.)");
        }
        form.reset();
      }
    });
  });

  // ---- Blog filter pills + search ----
  const filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    const pills = filterBar.querySelectorAll('.filter-pill');
    const searchInput = document.getElementById('post-search');
    const cards = document.querySelectorAll('#post-grid .post-card, .featured-post');
    const noResults = document.getElementById('no-results');

    function applyFilters() {
      const activePill = filterBar.querySelector('.filter-pill.active');
      const activeFilter = activePill ? activePill.dataset.filter : 'all';
      const query = (searchInput?.value || '').toLowerCase().trim();
      let visibleCount = 0;

      cards.forEach(card => {
        const cat = card.dataset.category;
        const title = (card.dataset.title || '').toLowerCase();
        const matchesFilter = activeFilter === 'all' || cat === activeFilter;
        const matchesSearch = !query || title.includes(query);
        const visible = matchesFilter && matchesSearch;
        card.style.display = visible ? '' : 'none';
        if (visible) visibleCount++;
      });

      if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        applyFilters();
      });
    });

    searchInput?.addEventListener('input', applyFilters);
  }

  // ---- Site-wide "Search topics..." box in the nav: sends to Topics page ----
  const siteSearch = document.getElementById('site-search');
  if (siteSearch) {
    siteSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && siteSearch.value.trim()) {
        window.location.href = 'blog.html?q=' + encodeURIComponent(siteSearch.value.trim());
      }
    });
  }

  // ---- If arriving at blog.html with ?q=, drop it into the post search ----
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const postSearch = document.getElementById('post-search');
  if (q && postSearch) {
    postSearch.value = q;
    postSearch.dispatchEvent(new Event('input'));
  }

  // ---- The Formula: accordion pillars ----
  const pillarHeads = document.querySelectorAll('.pillar-head');
  if (pillarHeads.length) {
    pillarHeads.forEach(head => {
      head.addEventListener('click', () => {
        const card = head.closest('.pillar-card');
        card.classList.toggle('open');
      });
    });

    // Open the pillar named in the URL hash (e.g. formula.html#growth-promotion)
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target && target.classList.contains('pillar-card')) {
        target.classList.add('open');
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }
});
