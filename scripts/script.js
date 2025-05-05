// globals to hold your JSON data
let dayData = null;
let dayKey  = null;

// UI elements
const navPrev    = document.getElementById("prev");
const navNext    = document.getElementById("next");
const baseNumText= document.getElementById("baseNum");
const baseImage  = document.getElementById("baseImg");
const ccText     = document.getElementById("ccText");
const stText     = document.getElementById("stText");
const xbText     = document.getElementById("xbText");

// Disable nav until data is loaded
navPrev.textContent    = "";
navNext.textContent    = "";
navPrev.style.color    = "grey";
navNext.style.color    = "grey";
navPrev.disabled       = true;
navNext.disabled       = true;

let baseNum = 1;

// Load JSON on file‐select
document.getElementById("fileInput").addEventListener("change", e => {
  const file   = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const full   = JSON.parse(reader.result);
    dayKey       = Object.keys(full)[0];
    dayData      = full[dayKey];
    baseNum      = 1;
  
    // Allow navigation (renderBase will set the right enabled/disabled state)
    navPrev.disabled = false;
    navNext.disabled = false;
  
    renderBase();
  };
  
  reader.readAsText(file);
});

// central render function
function renderBase() {
  const entry = dayData[baseNum];
  
  const maxBase = Object.keys(dayData).length;
  // clamp between 1 and maxBase
  baseNum = Math.min(Math.max(baseNum, 1), maxBase);

  // PREV button
  if (baseNum > 1) {
    navPrev.textContent = `Base ${baseNum - 1}`;
    navPrev.style.color = "white";
    navPrev.disabled    = false;
  } else {
    navPrev.textContent = "";
    navPrev.style.color = "grey";
    navPrev.disabled    = true;
  }

  // NEXT button
  if (baseNum < maxBase) {
    navNext.textContent = `Base ${baseNum + 1}`;
    navNext.style.color = "white";
    navNext.disabled    = false;
  } else {
    navNext.textContent = "";
    navNext.style.color = "grey";
    navNext.disabled    = true;
  }

  // Update current base number display
  baseNumText.textContent = `Base ${baseNum}`;
  
  // Update image
  baseImage.src = `images/${dayKey}/${baseNum}.png`;
  baseImage.alt= `Base ${baseNum}`;

  // Update CC text
  const ccList = Object.values(entry.cc)
                        .filter(t => t.name)
                        .map(t => `${t.amount}× ${t.name}`)
                        .join(", ");
  ccText.textContent = ccList;
  
  // ST and XB
  stText.textContent = entry.st;
  xbText.textContent = entry.xb;
}

// wire up nav buttons
navPrev.addEventListener("click", () => {
  if (baseNum > 1) {
    baseNum--;
    renderBase();
  }
});
navNext.addEventListener("click", () => {
  if (baseNum < Object.keys(dayData).length) {
    baseNum++;
    renderBase();
  }
});

document.addEventListener("keydown", (e) => {
    // only do anything once JSON is loaded
    if (!dayData) return;
  
    switch (e.key) {
      case "ArrowLeft":
        // if Prev is enabled, invoke it
        if (!navPrev.disabled) {
          navPrev.click();
        }
        break;
  
      case "ArrowRight":
        // if Next is enabled, invoke it
        if (!navNext.disabled) {
          navNext.click();
        }
        break;
    }
  });