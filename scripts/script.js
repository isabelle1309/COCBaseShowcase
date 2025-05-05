const BASE_URL = 'https://raw.githubusercontent.com/isabelle1309/COCBaseShowcase/main/images';

let months = [];
let monthIndex = 0;
let bases = [];
let baseIndex = 0;

// Preload helper
function preloadImages(urls) {
  urls.forEach(url => { new Image().src = url; });
}

// DOM‑ready helper
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

  // Load months json
  fetch(`${BASE_URL}/months.json`)
    .then(r => r.text())
    .then(text => {
      const cleaned = text.trim().replace(/^\uFEFF/, '');
      months       = JSON.parse(cleaned).months || [];
      // Start on the latest month
      monthIndex   = months.length - 1;
      updateMonthNav();
      loadMonth();
    })
    .catch(err => console.error('Failed to load months.json', err));

  // Month buttons
  prevMonthBtn.onclick = () => {
    if (monthIndex > 0) { monthIndex--; loadMonth(); }
  };
  nextMonthBtn.onclick = () => {
    if (monthIndex < months.length - 1) { monthIndex++; loadMonth(); }
  };

  // Base buttons
  prevBaseBtn .onclick = () => { if (baseIndex > 0) { baseIndex--; renderBase(); } };
  nextBaseBtn .onclick = () => { if (baseIndex < bases.length - 1) { baseIndex++; renderBase(); } };

  // Arrow‑key support
  document.addEventListener('keydown', e => {
    if (!bases.length) return;
    if (e.key === 'ArrowLeft'  && baseIndex > 0)           prevBaseBtn.click();
    if (e.key === 'ArrowRight' && baseIndex < bases.length - 1) nextBaseBtn.click();
  });

  // Load month JSON, build base arr and preload images
  function loadMonth() {
    const month = months[monthIndex] || '';
    currentMonthLabel.textContent = formatMonthLabel(month);
    updateMonthNav();

    fetch(`${BASE_URL}/${month}/${month}.json`)
      .then(r => r.text())
      .then(text => {
        const data    = JSON.parse(text.trim().replace(/^\uFEFF/, ''));
        const baseObj = data[month] || {};

        // object → sorted array
        bases = Object.keys(baseObj)
          .sort((a,b) => +a - +b)
          .map(k => baseObj[k]);

        // preload
        const urls = Object.keys(baseObj)
          .sort((a,b) => +a - +b)
          .map(k => `${BASE_URL}/${month}/${k}.png`);
        preloadImages(urls);

        baseIndex = 0;
        updateBaseNav();
        renderBase();
      })
      .catch(err => {
        console.error(`Failed to load ${month}.json`, err);
        bases = []; baseIndex = 0; renderBase();
      });
  }

  // Render CC / ST / XB and image
  function renderBase() {
    if (!bases.length) {
      imgEl.src = ''; imgEl.alt = '';
      ccTextEl.textContent = '';
      stTextEl.textContent = '';
      xbTextEl.textContent = '';
      currentBaseLabel.textContent = 'Base –';
      updateBaseNav();
      return;
    }

    const month = months[monthIndex];
    const entry = bases[baseIndex];

    currentBaseLabel.textContent = `Base ${baseIndex + 1}`;
    updateBaseNav();

    imgEl.src = `${BASE_URL}/${month}/${baseIndex + 1}.png`;
    imgEl.alt = `Base ${baseIndex + 1}`;

    ccTextEl.textContent = Object.values(entry.cc || {})
      .filter(t => t.name).map(t => `${t.amount}× ${t.name}`).join(', ') || 'N/A';
    stTextEl.textContent = entry.st || 'N/A';
    xbTextEl.textContent = entry.xb || 'N/A';
  }

  // Helpers to toggle buttons
  function updateMonthNav() {
    prevMonthBtn.disabled = monthIndex === 0;
    nextMonthBtn.disabled = monthIndex >= months.length - 1;
  }
  function updateBaseNav() {
    prevBaseBtn.disabled = baseIndex === 0;
    nextBaseBtn.disabled = baseIndex >= bases.length - 1;
  }

  // Month formatting
  const monthNames = {
    jan: 'January', feb: 'February', mar: 'March',
    apr: 'April',   may: 'May',      jun: 'June',
    jul: 'July',    aug: 'August',   sep: 'September',
    oct: 'October', nov: 'November', dec: 'December'
  };
  function formatMonthLabel(abbr) {
    const m = abbr.slice(0,3).toLowerCase();
    const y = abbr.slice(3);
    return monthNames[m] && y
      ? `${monthNames[m]} 20${y}`
      : abbr;
  }
});
