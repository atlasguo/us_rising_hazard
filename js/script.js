const hexPopupTemplate = {
	title: "Risk Score of Selected<br>1K-SQ-MI Hexagon",
	content: [
		{
			type: "text", text: "{expression/color7} Heat Wave: {expression/score7}<br>\
			{expression/color8} Hurricane: {expression/score8}<br>\
			{expression/color14} Tornado: {expression/score14}<br>\
			{expression/color13} Strong Wind: {expression/score13}<br>\
			{expression/color11} Lightning: {expression/score11}<br>\
			{expression/color6} Hail: {expression/score6}<br>\
			{expression/color9} Ice Storm: {expression/score9}<br>\
			{expression/color18} Winter Weather: {expression/score18}<br>\
			{expression/color3} Cold Wave: {expression/score3}<br>\
			{expression/color1} Avalanche: {expression/score1}<br>\
			{expression/color12} Riverine Flooding: {expression/score12}<br>\
			{expression/color2} Coastal Flooding: {expression/score2}<br>\
			{expression/color10} Landslide: {expression/score10}<br>\
			{expression/color15} Tsunami: {expression/score15}<br>\
			{expression/color5} Earthquake: {expression/score5}<br>\
			{expression/color16} Volcanic Activity: {expression/score16}<br>\
			{expression/color17} Wildfire: {expression/score17}<br>\
			{expression/color4} Drought: {expression/score4}" }
	],
	expressionInfos: [
		{
			name: "score7",
			title: "Heat Wave",
			expression: "Round($feature.score7, 1)"
		},
		{
			name: "score8",
			title: "Hurricane",
			expression: "Round($feature.score8, 1)"
		},
		{
			name: "score14",
			title: "Tornado",
			expression: "Round($feature.score14, 1)"
		},
		{
			name: "score13",
			title: "Strong Wind",
			expression: "Round($feature.score13, 1)"
		},
		{
			name: "score11",
			title: "Lightning",
			expression: "Round($feature.score11, 1)"
		},
		{
			name: "score6",
			title: "Hail",
			expression: "Round($feature.score6, 1)"
		},
		{
			name: "score9",
			title: "Ice Storm",
			expression: "Round($feature.score9, 1)"
		},
		{
			name: "score18",
			title: "Winter Weather",
			expression: "Round($feature.score18, 1)"
		},
		{
			name: "score3",
			title: "Cold Wave",
			expression: "Round($feature.score3, 1)"
		},
		{
			name: "score1",
			title: "Avalanche",
			expression: "Round($feature.score1, 1)"
		},
		{
			name: "score12",
			title: "Riverine Flooding",
			expression: "Round($feature.score12, 1)"
		},
		{
			name: "score2",
			title: "Coastal Flooding",
			expression: "Round($feature.score2, 1)"
		},
		{
			name: "score10",
			title: "Landslide",
			expression: "Round($feature.score10, 1)"
		},
		{
			name: "score15",
			title: "Tsunami",
			expression: "Round($feature.score15, 1)"
		},
		{
			name: "score5",
			title: "Earthquake",
			expression: "Round($feature.score5, 1)"
		},
		{
			name: "score16",
			title: "Volcanic Activity",
			expression: "Round($feature.score16, 1)"
		},
		{
			name: "score17",
			title: "Wildfire",
			expression: "Round($feature.score17, 1)"
		},
		{
			name: "score4",
			title: "Drought",
			expression: "Round($feature.score4, 1)"
		},
		{
			name: "color7",
			title: "Heat Wave Color",
			expression: getColorExpression("score7")
		},
		{
			name: "color8",
			title: "Hurricane Color",
			expression: getColorExpression("score8")
		},
		{
			name: "color14",
			title: "Tornado Color",
			expression: getColorExpression("score14")
		},
		{
			name: "color13",
			title: "Strong Wind Color",
			expression: getColorExpression("score13")
		},
		{
			name: "color11",
			title: "Lightning Color",
			expression: getColorExpression("score11")
		},
		{
			name: "color6",
			title: "Hail Color",
			expression: getColorExpression("score6")
		},
		{
			name: "color9",
			title: "Ice Storm Color",
			expression: getColorExpression("score9")
		},
		{
			name: "color18",
			title: "Winter Weather Color",
			expression: getColorExpression("score18")
		},
		{
			name: "color3",
			title: "Cold Wave Color",
			expression: getColorExpression("score3")
		},
		{
			name: "color1",
			title: "Avalanche Color",
			expression: getColorExpression("score1")
		},
		{
			name: "color12",
			title: "Riverine Flooding Color",
			expression: getColorExpression("score12")
		},
		{
			name: "color2",
			title: "Coastal Flooding Color",
			expression: getColorExpression("score2")
		},
		{
			name: "color10",
			title: "Landslide Color",
			expression: getColorExpression("score10")
		},
		{
			name: "color15",
			title: "Tsunami Color",
			expression: getColorExpression("score15")
		},
		{
			name: "color5",
			title: "Earthquake Color",
			expression: getColorExpression("score5")
		},
		{
			name: "color16",
			title: "Volcanic Activity Color",
			expression: getColorExpression("score16")
		},
		{
			name: "color17",
			title: "Wildfire Color",
			expression: getColorExpression("score17")
		},
		{
			name: "color4",
			title: "Drought Color",
			expression: getColorExpression("score4")
		}
	]
};

function getColorExpression(field) {
	return `
        var score = $feature.${field};
        return When(
            score >= 90, "▉", 
			score >= 75, "▊", 
            score >= 60, "▋",  
			score >= 45, "▍", 
            score >= 30, "▎",  
            "▏"               
        );
    `;
}

// Create a collapsible legend section
const legendContainer = document.createElement("div");
legendContainer.id = "legendContainer";
legendContainer.style.maxHeight = "58px";
legendContainer.style.width = "270px";

const legendHeader = document.createElement("div");
legendHeader.id = "legendHeader";

// Add icon to the legend header
const legendIcon = document.createElement("img");
legendIcon.src = "img/icon.png";
legendHeader.appendChild(legendIcon);

legendHeader.innerHTML += "LEGEND (Spectrum)";

// Add toggle button to the legend header
const toggleButton = document.createElement("button");
toggleButton.id = "toggleButton";
toggleButton.className = "mapButton"; // Add mapButton class
toggleButton.innerHTML = "<i class='fas fa-chevron-up'></i>";

legendHeader.appendChild(toggleButton);

legendContainer.appendChild(legendHeader);

const legendContent = document.createElement("div");
legendContent.id = "legendContent";
legendContent.style.display = "none";
const legendImageWrapper = document.createElement("div");
legendImageWrapper.className = "legend-image-wrapper";
const legendImage = document.createElement("img");
legendImage.src = "img/legend.png";
legendImage.alt = "Legend for 18 hazard layers";
const legendHotspotLayer = document.createElement("div");
legendHotspotLayer.className = "legend-hotspot-layer";
legendImageWrapper.appendChild(legendImage);
legendImageWrapper.appendChild(legendHotspotLayer);
legendContent.appendChild(legendImageWrapper);
legendContainer.appendChild(legendContent);

legendHeader.addEventListener("click", function () {
	const infoDialog = document.getElementById("infoDialog");
	if (infoDialog.style.display === "block") {
		infoDialog.style.display = "none";
	}
	if (legendContent.style.display === "none") {
		legendContent.style.display = "block";
		legendContainer.style.maxHeight = "520px";
		legendContainer.style.width = "420px";
		toggleButton.innerHTML = "<i class='fas fa-chevron-down'></i>";
	} else {
		legendContent.style.display = "none";
		legendContainer.style.maxHeight = "58px";
		legendContainer.style.width = "270px";
		toggleButton.innerHTML = "<i class='fas fa-chevron-up'></i>";
	}
});

// Create a collapsible layer panel
const layerPanelContainer = document.createElement("div");
layerPanelContainer.id = "layerPanelContainer";
layerPanelContainer.style.width = "52px";

const collapsedLayerPanelWidth = 52;
const maxExpandedLayerPanelWidth = 360;
let expandedLayerPanelWidth = "360px";

function updateExpandedLayerPanelWidth() {
	const previousWidth = layerPanelContainer.style.width;
	const previousMaxWidth = layerPanelContainer.style.maxWidth;

	layerPanelContainer.style.width = "auto";
	layerPanelContainer.style.maxWidth = `${maxExpandedLayerPanelWidth}px`;

	const measuredWidth = Math.ceil(layerPanelContainer.getBoundingClientRect().width);
	const clampedWidth = Math.min(Math.max(measuredWidth, collapsedLayerPanelWidth), maxExpandedLayerPanelWidth);
	expandedLayerPanelWidth = `${clampedWidth}px`;

	layerPanelContainer.style.width = previousWidth;
	layerPanelContainer.style.maxWidth = previousMaxWidth;
}

function refreshLayerPanelExpandedWidth() {
	updateExpandedLayerPanelWidth();
	if (layerPanelContent.style.display !== "none") {
		layerPanelContainer.style.width = expandedLayerPanelWidth;
	}
}

function getExpandedLayerPanelHeight() {
	// Keep panel tall enough for larger line-height while staying inside viewport.
	return `${Math.min(window.innerHeight - 120, 500)}px`;
}

function setLayerPanelExpandedState(isExpanded) {
	if (isExpanded) {
		layerPanelContainer.classList.remove("is-collapsed");
		layerPanelHeader.style.flexDirection = "row";
		layerPanelContent.style.display = "block";
		refreshLayerPanelExpandedWidth();
		layerPanelContainer.style.height = getExpandedLayerPanelHeight();
		layerToggleButton.innerHTML = "<i class='fas fa-chevron-left'></i>";
	} else {
		layerPanelContainer.classList.add("is-collapsed");
		layerPanelContainer.style.width = `${collapsedLayerPanelWidth}px`;
		layerPanelContainer.style.height = "103px";
		layerToggleButton.innerHTML = "<i class='fas fa-chevron-right'></i>";
		layerPanelHeader.style.flexDirection = "column";
		layerPanelContent.style.display = "none";
	}
}

const layerPanelHeader = document.createElement("div");
layerPanelHeader.id = "layerPanelHeader";
layerPanelHeader.style.flexDirection = "row"; // Horizontal layout by default

// Add icon to the layer panel header
const layerPanelIcon = document.createElement("i");
layerPanelIcon.className = "fas fa-layer-group";
layerPanelHeader.appendChild(layerPanelIcon);

const layerPanelTitle = document.createElement("span");
layerPanelTitle.id = "layerPanelTitle";
layerPanelTitle.textContent = "LAYER";
layerPanelHeader.appendChild(layerPanelTitle);

// Add toggle button to the layer panel header
const layerToggleButton = document.createElement("button");
layerToggleButton.id = "layerToggleButton";
layerToggleButton.className = "mapButton"; // Add mapButton class
layerToggleButton.innerHTML = "<i class='fas fa-chevron-left'></i>";

layerPanelHeader.appendChild(layerToggleButton);

layerPanelContainer.appendChild(layerPanelHeader);

const layerPanelContent = document.createElement("div");
layerPanelContent.id = "layerPanelContent";
layerPanelContent.style.display = "block"; // Initially visible
layerPanelContainer.style.width = expandedLayerPanelWidth;
layerPanelContainer.style.height = getExpandedLayerPanelHeight();

// Add content to the layer panel
const layerNames = [
	"Heat Wave", "Hurricane", "Tornado", "Strong Wind", "Lightning", "Hail",
	"Ice Storm", "Winter Weather", "Cold Wave", "Avalanche", "Riverine Flooding",
	"Coastal Flooding", "Landslide", "Tsunami", "Earthquake", "Volcanic Activity",
	"Wildfire", "Drought"
];
const layerIndexByName = new Map(layerNames.map((name, index) => [name, index]));
window.layerIndexByName = layerIndexByName;

const legendHotspots = [
	{ layerName: "Hail", xPct: 42.3, yPct: 18.9, wPct: 7.7, hPct: 6.1 },
	{ layerName: "Lightning", xPct: 50, yPct: 18.9, wPct: 15.0, hPct: 6.1 },
	{ layerName: "Strong Wind", xPct: 52.6, yPct: 25.6, wPct: 23.9, hPct: 6.1 },
	{ layerName: "Tornado", xPct: 59.7, yPct: 33.7, wPct: 10.6, hPct: 6.1 },
	{ layerName: "Hurricane", xPct: 63.2, yPct: 41.0, wPct: 8.7, hPct: 6.1 },
	{ layerName: "Heat Wave", xPct: 58.5, yPct: 48.9, wPct: 21.1, hPct: 6.1 },
	{ layerName: "Drought", xPct: 60.5, yPct: 57.3, wPct: 12.7, hPct: 6.1 },
	{ layerName: "Wildfire", xPct: 61.0, yPct: 65.0, wPct: 7.8, hPct: 6.1 },
	{ layerName: "Volcanic Activity", xPct: 60.2, yPct: 72.8, wPct: 14.0, hPct: 6.5 },
	{ layerName: "Earthquake", xPct: 52.0, yPct: 80.3, wPct: 13.6, hPct: 6.3 },
	{ layerName: "Tsunami", xPct: 38.5, yPct: 80.3, wPct: 10.4, hPct: 6.3 },
	{ layerName: "Landslide", xPct: 32.6, yPct: 72.8, wPct: 10.2, hPct: 6.5 },
	{ layerName: "Coastal Flooding", xPct: 21.2, yPct: 65.1, wPct: 18.2, hPct: 6.1 },
	{ layerName: "Riverine Flooding", xPct: 19.9, yPct: 57.3, wPct: 15.5, hPct: 6.1 },
	{ layerName: "Avalanche", xPct: 26.5, yPct: 49.0, wPct: 10.2, hPct: 6.1 },
	{ layerName: "Cold Wave", xPct: 22.0, yPct: 41.1, wPct: 20.0, hPct: 6.1 },
	{ layerName: "Winter Weather", xPct: 16.4, yPct: 33.6, wPct: 28.3, hPct: 6.1 },
	{ layerName: "Ice Storm", xPct: 28.0, yPct: 25.5, wPct: 19.3, hPct: 6.1 }
];

function renderLegendHotspots() {
	legendHotspotLayer.innerHTML = "";
	const heightScale = 0.88;
	const globalYShift = -4.0;
	const verticalCenter = 50;
	const yCompression = 0.88;
	const globalXShift = 0;
	const referenceNames = new Set(["Hail", "Lightning"]);
	const referenceHotspots = legendHotspots.filter((item) => referenceNames.has(item.layerName));

	function getLabelLength(name) {
		return name.replace(/\s+/g, "").length;
	}

	function estimateWidthByReference(name, fallbackWidth) {
		if (referenceHotspots.length < 2) {
			return fallbackWidth;
		}

		const refA = referenceHotspots[0];
		const refB = referenceHotspots[1];
		const lenA = getLabelLength(refA.layerName);
		const lenB = getLabelLength(refB.layerName);
		if (lenA === lenB) {
			return fallbackWidth;
		}

		const slope = (refB.wPct - refA.wPct) / (lenB - lenA);
		const intercept = refA.wPct - slope * lenA;
		const estimated = intercept + slope * getLabelLength(name);

		return Math.max(fallbackWidth * 0.75, Math.min(fallbackWidth * 1.6, estimated));
	}

	legendHotspots.forEach(function (hotspot) {
		const hotspotButton = document.createElement("button");
		hotspotButton.type = "button";
		hotspotButton.className = "legend-hotspot";
		hotspotButton.dataset.layerName = hotspot.layerName;
		hotspotButton.setAttribute("aria-label", `Toggle ${hotspot.layerName} layer`);
		// Keep middle nearly stable while pulling top down and bottom up.
		const adjustedTop = verticalCenter + (hotspot.yPct + globalYShift - verticalCenter) * yCompression;
		const adjustedHeight = hotspot.hPct * heightScale;
		const shiftedLeft = hotspot.xPct + globalXShift;
		const shiftedCenter = shiftedLeft + hotspot.wPct / 2;
		const adjustedWidth = referenceNames.has(hotspot.layerName)
			? hotspot.wPct
			: estimateWidthByReference(hotspot.layerName, hotspot.wPct);
		const adjustedLeft = shiftedCenter - adjustedWidth / 2;
		hotspotButton.style.left = `${adjustedLeft}%`;
		hotspotButton.style.top = `${adjustedTop}%`;
		hotspotButton.style.width = `${adjustedWidth}%`;
		hotspotButton.style.height = `${adjustedHeight}%`;

		const layerIndex = layerIndexByName.get(hotspot.layerName);
		if (typeof layerIndex !== "number") {
			console.warn(`[legend-hotspot] Unknown layer name "${hotspot.layerName}"`);
			hotspotButton.disabled = true;
		} else {
			hotspotButton.addEventListener("click", function () {
				if (typeof window.toggleLayerVisibilityByName === "function") {
					window.toggleLayerVisibilityByName(hotspot.layerName);
				} else {
					console.warn("[legend-hotspot] toggleLayerVisibilityByName is not ready yet.");
				}
			});
		}

		legendHotspotLayer.appendChild(hotspotButton);
	});
}

renderLegendHotspots();

layerPanelContainer.appendChild(layerPanelContent);

layerPanelHeader.addEventListener("click", function () {
	if (layerPanelContent.style.display === "none") {
		setLayerPanelExpandedState(true);
	} else {
		setLayerPanelExpandedState(false);
	}
});

window.addEventListener("resize", function () {
	if (layerPanelContent.style.display !== "none") {
		refreshLayerPanelExpandedWidth();
		layerPanelContainer.style.height = getExpandedLayerPanelHeight();
	}
});

// Glow control panel
const glowControlContainer = document.createElement("div");
glowControlContainer.id = "glowControlContainer";

const glowControlHeader = document.createElement("div");
glowControlHeader.id = "glowControlHeader";
const glowControlTitle = document.createElement("span");
glowControlTitle.id = "glowControlTitle";
glowControlTitle.textContent = "GLOW EFFECT";
glowControlHeader.appendChild(glowControlTitle);

const glowControlValue = document.createElement("span");
glowControlValue.id = "glowValue";
glowControlValue.textContent = "80%";
glowControlHeader.appendChild(glowControlValue);

const glowToggleButton = document.createElement("button");
glowToggleButton.id = "glowToggleButton";
glowToggleButton.className = "mapButton";
glowToggleButton.innerHTML = "<i class='fas fa-chevron-left'></i>";
glowControlHeader.appendChild(glowToggleButton);

const glowSlider = document.createElement("input");
glowSlider.id = "glowSlider";
glowSlider.type = "range";
glowSlider.min = "0";
glowSlider.max = "120";
glowSlider.value = "80";
glowSlider.step = "1";
glowSlider.setAttribute("aria-label", "Glow effect intensity");

const glowControlBody = document.createElement("div");
glowControlBody.id = "glowControlBody";
glowControlBody.appendChild(glowSlider);

function setGlowControlExpandedState(isExpanded) {
	if (isExpanded) {
		glowControlContainer.classList.remove("is-collapsed");
		glowToggleButton.innerHTML = "<i class='fas fa-chevron-left'></i>";
	} else {
		glowControlContainer.classList.add("is-collapsed");
		glowToggleButton.innerHTML = "<i class='fas fa-chevron-right'></i>";
	}
}

glowControlHeader.addEventListener("click", function () {
	const isCollapsed = glowControlContainer.classList.contains("is-collapsed");
	setGlowControlExpandedState(isCollapsed);
});

glowControlContainer.appendChild(glowControlHeader);
glowControlContainer.appendChild(glowControlBody);
setGlowControlExpandedState(window.innerWidth > 900);

// Define 18 colors in the specified sequence
const colors = [
	"#d82626", "#d84726", "#d86826", "#d88926", "#d8ae26", "#c0d826",
	"#7ed826", "#3cd826", "#26d84e", "#26d890", "#26d8d2", "#269cd8",
	"#265ad8", "#3326d8", "#7626d8", "#b826d8", "#d826b7", "#d82675"
];

// Define the order of colors and score fields
const colorIndices = [2, 1, 0, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3];
const scoreFields = [7, 8, 14, 13, 11, 6, 9, 18, 3, 1, 12, 2, 10, 15, 5, 16, 17, 4];


