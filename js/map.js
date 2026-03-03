require(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Search"], function (Map, MapView, FeatureLayer, Search) {

	// Create a map with Dark Gray Canvas as basemap
	const map = new Map({
		basemap: "dark-gray"
	});

	// Create a MapView
	const view = new MapView({
		container: "viewDiv", // The id of the HTML element
		map: map,
		center: [-97, 38], // Longitude, latitude
		zoom: 4,
		environment: { // Enable bloom effect
			bloomEnabled: true
		},
		constraints: {
			minZoom: 3, // Minimum zoom level
			maxZoom: 8 // Maximum zoom level
		},
		ui: {
			components: [] // Remove default zoom buttons
		}
	});

	// Add zoom buttons to the view
	view.ui.add(zoomInButton, "manual");
	view.ui.add(zoomOutButton, "manual");

	// Add home button to the view
	view.ui.add(homeButton, "manual");

	// Add info button to the view
	view.ui.add(infoButton, "manual");

	// Add the search widget to the right of the zoom buttons
	const searchWidget = new Search({
		view: view
	});

	view.ui.add(searchWidget, {
		position: "manual",
		index: 0
	});

	searchWidget.container.classList.add("search-widget-container");

	searchWidget.popupEnabled = false;

	// Add event listener for search complete
	searchWidget.on("search-complete", function (event) {
		const result = event?.results?.[0]?.results?.[0];
		if (!result || !result.feature || !result.feature.geometry) {
			return;
		}

		// Hide the infoDialog
		const infoDialog = document.getElementById("infoDialog");
		infoDialog.style.display = "none";

		const point = result.feature.geometry;
		view.goTo({
			target: point,
			zoom: 4
		}).then(function () {
			// Query the hexFeatureLayer to show the pop-up
			hexFeatureLayer.queryFeatures({
				geometry: point,
				spatialRelationship: "intersects",
				returnGeometry: true,
				outFields: ["*"]
			}).then(function (results) {
				if (results.features.length > 0) {
					view.popup.open({
						features: results.features,
						location: point
					});
				}
			});
		});
	});

	// Add event listener for map click to show popup
	view.on("click", function (event) {
		view.hitTest(event, { include: [hexFeatureLayer] }).then(function (response) {
			// Hide the infoDialog on first map interaction.
			const infoDialog = document.getElementById("infoDialog");
			if (infoDialog.style.display === "block") {
				infoDialog.style.display = "none";
			}

			const hexHit = response.results.find(function (result) {
				return result?.graphic?.layer === hexFeatureLayer;
			});

			if (!hexHit) {
				view.popup.close();
				return;
			}

			view.popup.open({
				features: [hexHit.graphic],
				location: event.mapPoint
			});
		});
	});

	// Define the Feature Layer URL
	const featureLayerUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/usbr_point/FeatureServer";

	// Function to create a FeatureLayer with custom transparency, offset, blend mode, and bloom effect
	function createFeatureLayer(url, transparency, offsetX, offsetY, scoreField, color) {
		return new FeatureLayer({
			url: url,
			opacity: transparency, // Set transparency
			blendMode: "lighten", // Set blend mode
			effect: "bloom(0.8, 0.3px, 0.1)", // Add bloom effect
			renderer: {
				type: "simple",
				symbol: {
					type: "simple-marker",
					color: color,
					outline: null, // Remove outline
					xoffset: offsetX, // Horizontal offset
					yoffset: offsetY  // Vertical offset
				},
				visualVariables: [
					{
						type: "opacity",
						field: scoreField, // Field used for transparency
						stops: [
							{ value: 0, opacity: 0.01 },
							{ value: 70, opacity: 0.05 },
							{ value: 85, opacity: 0.10 },
							{ value: 100, opacity: 1 }
						]
					},
					{
						type: "size",
						valueExpression: "$view.scale",
						stops: [
							{ value: 36978595, size: 1.8 },
							{ value: 18489298, size: 3.6 },
							{ value: 9244649, size: 7.2 },
							{ value: 4622324, size: 14.4 },
							{ value: 2311162, size: 28.8 },
							{ value: 577791, size: 57.6 }
						]
					}
				]
			}
		});
	}

	// Create 18 layers with different transparency, offsets, and colors
	const layers = [];
	const radius = 10; // Radius for the circular arrangement
	for (let i = 0; i < 18; i++) {
		const angle = i * (360 / 18); // Calculate angle for each symbol
		const offsetX = radius * Math.cos(angle * (Math.PI / 180)) * 0.9;
		const offsetY = radius * Math.sin(angle * (Math.PI / 180)) * 0.9;
		layers.push(createFeatureLayer(featureLayerUrl, 0.8, offsetX, offsetY, `score${scoreFields[i]}`, colors[colorIndices[i]]));
	}

	// Add all layers to the map
	layers.forEach(layer => map.add(layer));

	// Define the new Feature Layer URL
	const hexFeatureLayerUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/hex_score/FeatureServer";

	// Create a new FeatureLayer with white border and no fill color
	const hexFeatureLayer = new FeatureLayer({
		url: hexFeatureLayerUrl,
		opacity: 0.01,
		minScale: 18489298,
		effect: "bloom(1, 1px, 0.1)",
		renderer: {
			type: "simple",
			symbol: {
				type: "simple-fill",
				color: [0, 0, 0, 0],
				outline: {
					color: [255, 255, 255, 0.3],
					width: 1
				}
			}
		},
		popupTemplate: hexPopupTemplate // Reference the popup template from script.js
	});

	// Add the new layer to the map
	map.add(hexFeatureLayer);

	// Watch for scale changes and update opacity
	view.watch("scale", function (newValue) {
		if (newValue <= 4622324) {
			hexFeatureLayer.opacity = 0.2;
		} else if (newValue <= 9244649) {
			hexFeatureLayer.opacity = 0.05;
		} else {
			hexFeatureLayer.opacity = 0.01;
		}
	});

	// Define the state Feature Layer URL
	const stateFeatureLayerUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/us_state/FeatureServer";

	// Create a state FeatureLayer with white border and no fill color
	const stateFeatureLayer = new FeatureLayer({
		url: stateFeatureLayerUrl,
		opacity: 0.5, // Set initial opacity to 50%
		renderer: {
			type: "simple",
			symbol: {
				type: "simple-fill", // Change symbol type to simple-fill
				color: [0, 0, 0, 0], // No fill color
				outline: {
					color: [255, 255, 255, 0.1], // White border
					width: 1.2
				}
			}
		}
	});

	// Add the state layer to the map
	map.add(stateFeatureLayer);

	function applyGlowIntensity(percent) {
		const normalized = Math.max(0, Math.min(1.2, percent / 100));
		const pointBloom = normalized.toFixed(2);
		const hexBloom = (0.25 + normalized * 0.95).toFixed(2);

		layers.forEach(function (layer) {
			layer.effect = `bloom(${pointBloom}, 0.3px, 0.1)`;
		});

		hexFeatureLayer.effect = `bloom(${hexBloom}, 1px, 0.1)`;
		view.environment.bloomEnabled = normalized > 0;
	}

	// Constrain panning to U.S. states extent (including AK and HI)
	stateFeatureLayer.when(function () {
		if (!stateFeatureLayer.fullExtent) {
			return;
		}

		const usExtent = stateFeatureLayer.fullExtent.clone().expand(1.03);
		view.constraints = {
			geometry: usExtent,
			minZoom: 3,
			maxZoom: 8
		};
	});

	// Watch for scale changes and update opacity and width
	view.watch("scale", function (newValue) {
		if (newValue <= 9244649) {
			stateFeatureLayer.opacity = 0.75;
			stateFeatureLayer.renderer.symbol.outline.width = 2;
		} else {
			stateFeatureLayer.opacity = 0.5;
			stateFeatureLayer.renderer.symbol.outline.width = 1.2;
		}
	});

	view.ui.add(legendContainer, "manual");

	// Add the layer panel to the view
	view.ui.add(layerPanelContainer, "manual");

	// Add the glow control panel to the view
	view.ui.add(glowControlContainer, "manual");

	const glowSlider = document.getElementById("glowSlider");
	const glowValue = document.getElementById("glowValue");
	if (glowSlider && glowValue) {
		const updateGlow = function () {
			const percent = Number(glowSlider.value) || 0;
			glowValue.textContent = `${percent}%`;
			applyGlowIntensity(percent);
		};

		glowSlider.addEventListener("input", updateGlow);
		updateGlow();
	}

	// Display info dialog initially
	const initialInfoDialog = document.getElementById("infoDialog");
	initialInfoDialog.style.display = "block"; // Ensure the dialog is displayed

	// Add event listeners for zoom buttons
	zoomInButton.addEventListener("click", function () {
		view.zoom += 1;
	});

	zoomOutButton.addEventListener("click", function () {
		view.zoom -= 1;
	});

	// Add event listener for home button
	homeButton.addEventListener("click", function () {
		view.goTo({
			center: [-97, 38], // Default center
			zoom: 4 // Default zoom level
		});
	});

	// Create checkboxes for each layer
	layers.forEach((layer, index) => {
		const layerCheckbox = document.createElement("input");
		layerCheckbox.type = "checkbox";
		layerCheckbox.id = `layerCheckbox${index}`;
		layerCheckbox.checked = true; // Initially checked
		layerCheckbox.addEventListener("change", function () {
			layer.visible = this.checked;
		});

		const layerLabel = document.createElement("label");
		layerLabel.htmlFor = `layerCheckbox${index}`;
		layerLabel.innerText = layerNames[index];
		layerLabel.style.color = colors[colorIndices[index]];

		const layerItem = document.createElement("div");
		layerItem.appendChild(layerCheckbox);
		layerItem.appendChild(layerLabel);
		layerPanelContent.appendChild(layerItem);
	});

	// Add "Show All" and "Clear" buttons
	const showAllButton = document.createElement("button");
	showAllButton.id = "showAllButton"; // Add ID for custom styling
	showAllButton.innerText = "Show All";
	showAllButton.style.marginRight = "10px"; // Add spacing between buttons
	showAllButton.addEventListener("click", function () {
		layers.forEach((layer, index) => {
			document.getElementById(`layerCheckbox${index}`).checked = true;
			layer.visible = true;
		});
	});

	const clearButton = document.createElement("button");
	clearButton.id = "clearButton"; // Add ID for custom styling
	clearButton.innerText = "Clear";
	clearButton.addEventListener("click", function () {
		layers.forEach((layer, index) => {
			document.getElementById(`layerCheckbox${index}`).checked = false;
			layer.visible = false;
		});
	});

	const buttonContainer = document.createElement("div");
	buttonContainer.style.marginTop = "10px"; // Add spacing above the buttons
	buttonContainer.appendChild(showAllButton);
	buttonContainer.appendChild(clearButton);
	layerPanelContent.appendChild(buttonContainer);

	// Recalculate expanded panel width after content is fully rendered.
	if (typeof refreshLayerPanelExpandedWidth === "function") {
		refreshLayerPanelExpandedWidth();
	}
});
