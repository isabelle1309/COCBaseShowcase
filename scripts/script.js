const BASE_URL =
	"https://raw.githubusercontent.com/isabelle1309/COCBaseShowcase/main/images";

let months = [];
let monthIndex = 0;
let bases = [];
let baseIndex = 0;
const MAX_BUTTONS = 10;

function preloadImages(urls) {
	urls.forEach((url) => {
		new Image().src = url;
	});
}

function docReady(fn) {
	if (document.readyState !== "loading") fn();
	else document.addEventListener("DOMContentLoaded", fn);
}

docReady(() => {
	const prevMonthBtn = document.getElementById("prev-month");
	const nextMonthBtn = document.getElementById("next-month");
	const currentMonthLabel = document.getElementById("current-month");

	const navBase = document.getElementById("nav-base");
	const prevBaseBtn = document.getElementById("prev-base");
	const nextBaseBtn = document.getElementById("next-base");
	const currentBaseLabel = document.getElementById("current-base");
	const baseControls = document.createElement("div");
	baseControls.id = "base-controls";
	navBase.appendChild(baseControls);

	const imgEl = document.getElementById("baseImg");
	const ccGrid = document.getElementById("ccGrid");
	const stText = document.getElementById("stText");
	const itText = document.getElementById("itText");
	const xbText = document.getElementById("xbText");
	const baseLink = document.getElementById("baseLink");
	const spellTower = document.getElementById("spelltower");
	const infernoTower = document.getElementById("infernotower");
	const xbow = document.getElementById("xbow");

	const firstBaseBtn = document.createElement("button");
	firstBaseBtn.id = "first-base";
	firstBaseBtn.textContent = "«";
	const lastBaseBtn = document.createElement("button");
	lastBaseBtn.id = "last-base";
	lastBaseBtn.textContent = "»";

	const gotoInput = document.createElement("input");
	gotoInput.id = "goto-base-input";
	gotoInput.type = "number";
	gotoInput.min = "1";
	gotoInput.placeholder = "Base #";
	const gotoBtn = document.createElement("button");
	gotoBtn.id = "goto-base-btn";
	gotoBtn.textContent = "Go";

	const baseButtonsContainer = document.createElement("div");
	baseButtonsContainer.id = "base-buttons";

	baseControls.append(
		firstBaseBtn,
		prevBaseBtn,
		baseButtonsContainer,
		nextBaseBtn,
		lastBaseBtn,
		gotoInput,
		gotoBtn
	);

	prevMonthBtn.addEventListener("click", () => {
		if (monthIndex > 0) {
			monthIndex--;
			loadMonth();
		}
	});
	nextMonthBtn.addEventListener("click", () => {
		if (monthIndex < months.length - 1) {
			monthIndex++;
			loadMonth();
		}
	});

	firstBaseBtn.addEventListener("click", () => {
		baseIndex = 0;
		renderBase();
	});
	prevBaseBtn.addEventListener("click", () => {
		if (baseIndex > 0) baseIndex--;
		renderBase();
	});
	nextBaseBtn.addEventListener("click", () => {
		if (baseIndex < bases.length - 1) baseIndex++;
		renderBase();
	});
	lastBaseBtn.addEventListener("click", () => {
		baseIndex = bases.length - 1;
		renderBase();
	});

	gotoBtn.addEventListener("click", () => {
		const n = parseInt(gotoInput.value, 10);
		if (n >= 1 && n <= bases.length) {
			baseIndex = n - 1;
			renderBase();
		}
	});
	gotoInput.addEventListener("keypress", (e) => {
		if (e.key === "Enter") gotoBtn.click();
	});

	document.addEventListener("keydown", (e) => {
		if (!bases.length) return;
		if (e.key === "ArrowLeft" && baseIndex > 0) prevBaseBtn.click();
		if (e.key === "ArrowRight" && baseIndex < bases.length - 1)
			nextBaseBtn.click();
	});

	fetch(`${BASE_URL}/months.json`)
		.then((r) => r.json())
		.then((data) => {
			months = data.months || [];
			monthIndex = months.length - 1;
			updateMonthNav();
			loadMonth();
		})
		.catch((err) => console.error("Failed to load months.json", err));

	function loadMonth() {
		const month = months[monthIndex] || "";
		currentMonthLabel.textContent = formatMonthLabel(month);
		updateMonthNav();

		fetch(`${BASE_URL}/${month}/${month}.json`)
			.then((r) => r.json())
			.then((data) => {
				const baseObj = data[month] || {};
				bases = Object.keys(baseObj)
					.sort((a, b) => +a - +b)
					.map((k) => baseObj[k]);

				const urls = Object.keys(baseObj)
					.sort((a, b) => +a - +b)
					.map((k) => `${BASE_URL}/${month}/${k}.png`);
				preloadImages(urls);

				baseIndex = 0;
				updateBaseNav();
				renderBase();
			})
			.catch((err) => {
				console.error(`Failed to load ${month}.json`, err);
				bases = [];
				baseIndex = 0;
				renderBase();
			});
	}

	function renderBase() {
		if (!bases.length) {
			imgEl.src = "";
			[stText, itText, xbText].forEach((el) => (el.textContent = ""));
			baseButtonsContainer.innerHTML = "";
			currentBaseLabel.textContent = "Base –";
			updateBaseNav();
			return;
		}

		const month = months[monthIndex];
		const entry = bases[baseIndex];

		if (entry.st) {
			if (entry.st.includes("Rage") && entry.st.includes("Poison")) {
				spellTower.src = `images/STRP.png`;
			} else if (
				entry.st.includes("Rage") &&
				entry.st.includes("Invis")
			) {
				spellTower.src = `images/STRI.png`;
			} else if (
				entry.st.includes("Poison") &&
				entry.st.includes("Invis")
			) {
				spellTower.src = `images/STPI.png`;
			} else if (entry.st.includes("Rage")) {
				spellTower.src = `images/STR.png`;
			} else if (entry.st.includes("Poison")) {
				spellTower.src = `images/STP.png`;
			} else if (entry.st.includes("Invis")) {
				spellTower.src = `images/STI.png`;
			}
		}

		if (entry.it) {
			if (entry.it.includes("Multi") && entry.it.includes("Single")) {
				infernoTower.src = `images/ITSM.png`;
			} else if (entry.it.includes("Multi")) {
				infernoTower.src = `images/ITM.png`;
			} else if (entry.it.includes("Single")) {
				infernoTower.src = `images/ITS.png`;
			}
		}

		if (entry.xb) {
			if (entry.xb.includes("Ground") && entry.xb.includes("Multi")) {
				xbow.src = `images/XBGA.png`;
			} else if (entry.xb.includes("Ground")) {
				xbow.src = `images/XBG.png`;
			} else if (entry.xb.includes("Multi")) {
				xbow.src = `images/XBA.png`;
			}
		}

		imgEl.src = `${BASE_URL}/${month}/${baseIndex + 1}.png`;
		imgEl.alt = `Base ${baseIndex + 1}`;
		baseLink.href = entry.url || "#";

		// Populate clan castle troops grid
		ccGrid.innerHTML = "";
		const troops = Object.values(entry.cc || {}).filter((t) => t.name);
		troops.forEach((t) => {
			const wrapper = document.createElement("div");
			wrapper.className = "cc-item";

			const img = new Image();
			img.src = `${BASE_URL}/cctroops/${t.name.toLowerCase()}.png`;
			img.alt = t.name;
			wrapper.appendChild(img);

			const count = document.createElement("span");
			count.className = "cc-count";
			count.textContent = t.amount;
			wrapper.appendChild(count);

			ccGrid.appendChild(wrapper);
		});

		// If no troops, show placeholder text
		if (!troops.length) {
			ccGrid.textContent = "N/A";
		}

		stText.textContent = entry.st || "N/A";
		itText.textContent = entry.it || "N/A";
		xbText.textContent = entry.xb || "N/A";

		currentBaseLabel.textContent = `Base ${baseIndex + 1}`;
		updateBaseNav();

		baseButtonsContainer.innerHTML = "";
		// determine window of buttons
		const total = bases.length;
		const half = Math.floor(MAX_BUTTONS / 2);
		let start = Math.max(0, baseIndex - half);
		let end = start + MAX_BUTTONS;
		if (end > total) {
			end = total;
			start = Math.max(0, end - MAX_BUTTONS);
		}
		for (let idx = start; idx < end; idx++) {
			const btn = document.createElement("button");
			btn.className = "base-num-btn";
			btn.textContent = idx + 1;
			if (idx === baseIndex) btn.classList.add("active");
			btn.addEventListener("click", () => {
				baseIndex = idx;
				renderBase();
			});
			baseButtonsContainer.appendChild(btn);
		}
	}

	function updateMonthNav() {
		prevMonthBtn.disabled = monthIndex === 0;
		nextMonthBtn.disabled = monthIndex >= months.length - 1;
	}
	function updateBaseNav() {
		firstBaseBtn.disabled = baseIndex === 0;
		prevBaseBtn.disabled = baseIndex === 0;
		nextBaseBtn.disabled = baseIndex >= bases.length - 1;
		lastBaseBtn.disabled = baseIndex >= bases.length - 1;
		gotoInput.max = bases.length;
	}

	const monthNames = {
		jan: "January",
		feb: "February",
		mar: "March",
		apr: "April",
		may: "May",
		jun: "June",
		jul: "July",
		aug: "August",
		sep: "September",
		oct: "October",
		nov: "November",
		dec: "December",
	};
	function formatMonthLabel(abbr) {
		const m = abbr.slice(0, 3).toLowerCase();
		const y = abbr.slice(3);
		return monthNames[m] && y ? `${monthNames[m]} 20${y}` : abbr;
	}
});
