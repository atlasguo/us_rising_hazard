require(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Legend", "esri/widgets/Search"], function (Map, MapView, FeatureLayer, Legend, Search) {

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
            maxZoom: 9 // Maximum zoom level
        },
        ui: {
            components: [] // Remove default zoom buttons
        }
    });

    // Create zoom in and zoom out buttons
    const zoomInButton = document.createElement("button");
    zoomInButton.className = "zoom-button mapButton";
    zoomInButton.id = "zoomInButton";
    const zoomInIcon = document.createElement("i");
    zoomInIcon.className = "fas fa-plus";
    zoomInIcon.id = "zoomInIcon";
    zoomInButton.appendChild(zoomInIcon);

    const zoomOutButton = document.createElement("button");
    zoomOutButton.className = "zoom-button mapButton";
    zoomOutButton.id = "zoomOutButton";
    const zoomOutIcon = document.createElement("i");
    zoomOutIcon.className = "fas fa-minus";
    zoomOutIcon.id = "zoomOutIcon";
    zoomOutButton.appendChild(zoomOutIcon);

    // Add event listeners for zoom buttons
    zoomInButton.addEventListener("click", function () {
        view.zoom += 1;
    });

    zoomOutButton.addEventListener("click", function () {
        view.zoom -= 1;
    });

    // Add zoom buttons to the view
    view.ui.add(zoomInButton, "manual");
    view.ui.add(zoomOutButton, "manual");

    // Add the search widget to the right of the zoom buttons
    const searchWidget = new Search({
        view: view
    });
    view.ui.add(searchWidget, {
        position: "manual",
        index: 0
    });
    searchWidget.container.classList.add("search-widget-container");

    // Add event listener for search complete
    searchWidget.on("search-complete", function (event) {
        const result = event.results[0].results[0];
        if (result) {
            const point = result.feature.geometry;
            view.goTo({
                target: point,
                zoom: 10
            }).then(function () {
                view.popup.open({
                    location: point,
                    features: [result.feature]
                });
            });

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
                    // Increase the height of the popup window
                    view.popup.viewModel.container.style.height = "1.5em";
                }
            });

            // Hide the infoDialog
            const infoDialog = document.getElementById("infoDialog");
            infoDialog.style.display = "none";
        }
    });

    // Create home button
    const homeButton = document.createElement("button");
    homeButton.className = "zoom-button mapButton";
    homeButton.id = "homeButton";
    const homeIcon = document.createElement("i");
    homeIcon.className = "fas fa-home";
    homeIcon.id = "homeIcon";
    homeButton.appendChild(homeIcon);

    // Add event listener for home button
    homeButton.addEventListener("click", function () {
        view.goTo({
            center: [-97, 38], // Default center
            zoom: 4 // Default zoom level
        });
    });

    // Add home button to the view
    view.ui.add(homeButton, "manual");

    // Create info button
    const infoButton = document.createElement("button");
    infoButton.className = "zoom-button mapButton";
    infoButton.id = "infoButton";
    const infoIcon = document.createElement("i");
    infoIcon.className = "fas fa-info-circle";
    infoIcon.id = "infoIcon";
    infoButton.appendChild(infoIcon);

    // Add event listener for info button
    infoButton.addEventListener("click", function () {
        const infoDialog = document.getElementById("infoDialog");
        const legendContent = document.getElementById("legendContent");
        const legendContainer = document.getElementById("legendContainer");
        const toggleButton = document.getElementById("toggleButton");

        if (infoDialog.style.display === "block") {
            infoDialog.style.display = "none";
        } else {
            infoDialog.style.display = "block";
            // Collapse the legend
            legendContent.style.display = "none";
            legendContainer.style.maxHeight = "50px"; // Collapsed height
            legendContainer.style.width = "250px"; // Collapsed width
            toggleButton.innerHTML = "<i class='fas fa-chevron-up'></i>";
        }
    });

    // Add info button to the view
    view.ui.add(infoButton, "manual");

    // Display info dialog initially
    const initialInfoDialog = document.getElementById("infoDialog");
    initialInfoDialog.style.display = "block"; // Ensure the dialog is displayed

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
                            { value: 577791, size: 57.6 },
                        ]
                    }
                ]
            }
        });
    }

    // Define 18 colors in the specified sequence
    const colors = [
        "#d82626", "#d84726", "#d86826", "#d88926", "#d8ae26", "#c0d826",
        "#7ed826", "#3cd826", "#26d84e", "#26d890", "#26d8d2", "#269cd8",
        "#265ad8", "#3326d8", "#7626d8", "#b826d8", "#d826b7", "#d82675"
    ];

    // Define the order of colors and score fields
    const colorIndices = [2, 1, 0, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3];
    const scoreFields = [7, 8, 14, 13, 11, 6, 9, 18, 3, 1, 12, 2, 10, 15, 5, 16, 17, 4];

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
        popupTemplate: {
            title: "Risk Score in this 1K-sq-mi Hexagon",
            content: [
                { type: "text", text: "{expression/color7} Heat Wave: {expression/score7}<br>{expression/color8} Hurricane: {expression/score8}<br>{expression/color14} Tornado: {expression/score14}<br>{expression/color13} Strong Wind: {expression/score13}<br>{expression/color11} Lightning: {expression/score11}<br>{expression/color6} Hail: {expression/score6}<br>{expression/color9} Ice Storm: {expression/score9}<br>{expression/color18} Winter Weather: {expression/score18}<br>{expression/color3} Cold Wave: {expression/score3}<br>{expression/color1} Avalanche: {expression/score1}<br>{expression/color12} Riverine Flooding: {expression/score12}<br>{expression/color2} Coastal Flooding: {expression/score2}<br>{expression/color10} Landslide: {expression/score10}<br>{expression/color15} Tsunami: {expression/score15}<br>{expression/color5} Earthquake: {expression/score5}<br>{expression/color16} Volcanic Activity: {expression/score16}<br>{expression/color17} Wildfire: {expression/score17}<br>{expression/color4} Drought: {expression/score4}" }
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
        }
    });

    function getColorExpression(field) {
        return `
            var score = $feature.${field};
            return When(
                score >= 90, "🟥", 
                score >= 70, "🟧",  
                score >= 50, "🟨",  
                "🟩"               
            );
        `;
    }

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

    // Define the second new Feature Layer URL
    const stateFeatureLayerUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/us_state/FeatureServer";

    // Create a second new FeatureLayer with white border and no fill color
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

    // Add the second new layer to the map
    map.add(stateFeatureLayer);

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

    // Create a collapsible legend section
    const legendContainer = document.createElement("div");
    legendContainer.id = "legendContainer";
    legendContainer.style.maxHeight = "150px"; // Increased initial height
    legendContainer.style.width = "250px"; // Set initial width

    const legendHeader = document.createElement("div");
    legendHeader.id = "legendHeader";

    // Add icon to the legend header
    const legendIcon = document.createElement("img");
    legendIcon.src = "img/icon.png";
    legendHeader.appendChild(legendIcon);

    legendHeader.innerHTML += "LEGEND";

    // Add toggle button to the legend header
    const toggleButton = document.createElement("button");
    toggleButton.id = "toggleButton";
    toggleButton.innerHTML = "<i class='fas fa-chevron-up'></i>";

    legendHeader.appendChild(toggleButton);

    legendContainer.appendChild(legendHeader);

    const legendContent = document.createElement("div");
    legendContent.id = "legendContent";
    const legendImage = document.createElement("img");
    legendImage.src = "img/legend.png";
    legendContent.appendChild(legendImage);
    legendContainer.appendChild(legendContent);

    legendHeader.addEventListener("click", function () {
        const infoDialog = document.getElementById("infoDialog");
        if (infoDialog.style.display === "block") {
            infoDialog.style.display = "none";
        }
        if (legendContent.style.display === "none") {
            legendContent.style.display = "block";
            legendContainer.style.maxHeight = "500px"; // Expanded height
            legendContainer.style.width = "500px"; // Expanded width
            toggleButton.innerHTML = "<i class='fas fa-chevron-down'></i>";
        } else {
            legendContent.style.display = "none";
            legendContainer.style.maxHeight = "50px"; // Collapsed height
            legendContainer.style.width = "250px"; // Collapsed width
            toggleButton.innerHTML = "<i class='fas fa-chevron-up'></i>";
        }
    });

    view.ui.add(legendContainer, "manual");

});
