// GH images folder
const BASE_URL = 'https://raw.githubusercontent.com/isabelle1309/COCBaseShowcase/main/images';

let months = [];
let monthIndex = 0;
let bases = [];
let baseIndex = 0;

// Preload images
function preloadImages(urls) {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

// Make sure DOM is loaded
function docReady(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

docReady(() => {
  const prevMonthBtn      = document.getElementById('prev-month');
  const nextMonthBtn      = document.getElementById('next-month');
  const currentMonthLabel = document.getElementById('current-month');
  const prevBaseBtn       = document.getElementById('prev-base');
  const nextBaseBtn       = document.getElementById('next-base');
  const currentBaseLabel  = document.getElementById('current-base');
  const imgEl             = document.getElementById('baseImg');
  const ccTextEl          = document.getElementById('ccText');
  const stTextEl          = document.getElementById('stText');
  const xbTextEl          = document.getElementById('xbText');

  // Load months from json
  fetch(`${BASE_URL}/months.json`)
    .then(resp => resp.text())
    .then(text => {
      const cleaned = text.trim().replace(/^\uFEFF/, '');
      const data    = JSON.parse(cleaned);
      months       = data.months || [];
      updateMonthNav();
      loadMonth();
    })
    .catch(err => console.error('Failed to load months.json', err));

  // Month nav
  prevMonthBtn.addEventListener('click', () => {
    if (monthIndex > 0) {
      monthIndex--;
      loadMonth();
    }
  });
  nextMonthBtn.addEventListener('click', () => {
    if (monthIndex < months.length - 1) {
      monthIndex++;
      loadMonth();
    }
  });

  // Base nav
  prevBaseBtn.addEventListener('click', () => {
    if (baseIndex > 0) {
      baseIndex--;
      renderBase();
    }
  });
  nextBaseBtn.addEventListener('click', () => {
    if (baseIndex < bases.length - 1) {
      baseIndex++;
      renderBase();
    }
  });

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (!bases.length) return;
    if (e.key === 'ArrowLeft' && baseIndex > 0) prevBaseBtn.click();
    if (e.key === 'ArrowRight' && baseIndex < bases.length - 1) nextBaseBtn.click();
  });

  // Load month JSON data
  function loadMonth() {
    const month = months[monthIndex] || '';
    currentMonthLabel.textContent = month;
    updateMonthNav();

    fetch(`${BASE_URL}/${month}/${month}.json`)
      .then(resp => resp.text())
      .then(text => {
        const cleaned = text.trim().replace(/^\uFEFF/, '');
        const data    = JSON.parse(cleaned);
        const baseObj = data[month] || {};

        // Convert object into array
        bases = Object
          .keys(baseObj)
          .sort((a, b) => Number(a) - Number(b))
          .map(key => baseObj[key]);

        // Create image urls
        const imgURLs = Object
          .keys(baseObj)
          .sort((a, b) => Number(a) - Number(b))
          .map(key => `${BASE_URL}/${month}/${key}.png`);

        // Preload images
        preloadImages(imgURLs);

        baseIndex = 0;
        updateBaseNav();
        renderBase();
      })
      .catch(err => {
        console.error(`Failed to load ${month}.json`, err);
        bases = [];
        baseIndex = 0;
        renderBase();
      });
  }

  // Render current base
  function renderBase() {
    // If there's no bases, clear UI and kill
    if (!bases.length) {
      imgEl.src     = '';
      imgEl.alt     = '';
      ccTextEl.textContent = '';
      stTextEl.textContent = '';
      xbTextEl.textContent = '';
      updateBaseNav();
      currentBaseLabel.textContent = 'Base –';
      return;
    }

    const month = months[monthIndex];
    const entry = bases[baseIndex];

    // Update base nav state & label
    updateBaseNav();
    currentBaseLabel.textContent = `Base ${baseIndex + 1}`;

    // Set base image
    imgEl.src = `${BASE_URL}/${month}/${baseIndex + 1}.png`;
    imgEl.alt = `Base ${baseIndex + 1}`;

    // Populate CC text
    ccTextEl.textContent = Object
      .values(entry.cc || {})
      .filter(t => t.name)
      .map(t => `${t.amount}× ${t.name}`)
      .join(', ') || 'N/A';

    // Populate ST and XB
    stTextEl.textContent = entry.st || 'N/A';
    xbTextEl.textContent = entry.xb || 'N/A';
  }

  // Enable/disable month buttons
  function updateMonthNav() {
    prevMonthBtn.disabled = monthIndex === 0;
    nextMonthBtn.disabled = monthIndex >= months.length - 1;
  }

  // Enable/disable base buttons
  function updateBaseNav() {
    prevBaseBtn.disabled = baseIndex === 0;
    nextBaseBtn.disabled = baseIndex >= bases.length - 1;
  }
});
