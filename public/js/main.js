// ── Image fallback ─────────────────────────────────────────
const PLACEHOLDER = 'https://placehold.co/300x300/1a1a2e/8888aa?text=?';

document.querySelectorAll('img[data-src]').forEach((img) => {
  img.src = img.dataset.src || PLACEHOLDER;
  img.onerror = () => { img.src = PLACEHOLDER; };
});

// ── Filter by game series ──────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const cards      = document.querySelectorAll('.card');
const noResults  = document.querySelector('.no-results');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const series = btn.dataset.series;
    let count = 0;

    cards.forEach((card) => {
      const match = (series === 'all') || (card.dataset.series === series);
      card.style.display = match ? '' : 'none';
      if (match) count++;
    });

    if (noResults) noResults.style.display = count === 0 ? 'block' : 'none';
  });
});

// ── Modal ──────────────────────────────────────────────────
const overlay = document.getElementById('modal-overlay');
const modal   = {
  img:    document.getElementById('modal-img'),
  title:  document.getElementById('modal-title'),
  series: document.getElementById('modal-series'),
  year:   document.getElementById('modal-year'),
  desc:   document.getElementById('modal-desc'),
  play:   document.getElementById('modal-play'),
};

function openModal(data) {
  modal.img.src        = data.img || PLACEHOLDER;
  modal.img.onerror    = () => { modal.img.src = PLACEHOLDER; };
  modal.title.textContent  = data.name;
  modal.series.textContent = data.series;
  modal.year.innerHTML     = `Debut: <span>${data.year}</span>`;
  modal.desc.textContent   = data.desc;
  modal.play.innerHTML     = data.playable === 'true'
    ? 'Trạng thái: <span style="color:#4ade80">Playable ✔</span>'
    : 'Trạng thái: <span style="color:#aaa">NPC</span>';
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('click', () => openModal(card.dataset));
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});
document.getElementById('modal-close').addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
