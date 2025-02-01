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
    zoomInButton.innerHTML = "+";
    zoomInButton.className = "zoom-button";
    zoomInButton.id = "zoomInButton";

    const zoomOutButton = document.createElement("button");
    zoomOutButton.innerHTML = "-";
    zoomOutButton.className = "zoom-button";
    zoomOutButton.id = "zoomOutButton";

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
                }
            });
        }
    });

    // Create home button
    const homeButton = document.createElement("button");
    homeButton.className = "zoom-button";
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
    infoButton.className = "zoom-button";
    infoButton.id = "infoButton";
    const infoIcon = document.createElement("i");
    infoIcon.className = "fas fa-info-circle";
    infoIcon.id = "infoIcon";
    infoButton.appendChild(infoIcon);

    // Add event listener for info button
    infoButton.addEventListener("click", function () {
        const infoDialog = document.createElement("div");
        infoDialog.id = "infoDialog";

        const infoContent = document.createElement("div");
        infoContent.innerHTML = "Welcome to the web map of <b>The United States of Rising Hazards</b>! The map is designed by Atlas Guo (2025), CartoGuophy.com";
        infoDialog.appendChild(infoContent);

        const closeButton = document.createElement("button");
        closeButton.innerHTML = "Close";
        closeButton.addEventListener("click", function () {
            document.body.removeChild(infoDialog);
        });
        infoDialog.appendChild(closeButton);

        document.body.appendChild(infoDialog);
    });

    // Add info button to the view
    view.ui.add(infoButton, "manual");

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
                            { value: 36978595, size: 2 },
                            { value: 18489298, size: 4 },
                            { value: 9244649, size: 8 },
                            { value: 4622324, size: 16 },
                            { value: 2311162, size: 32 },
                            { value: 577791, size: 64 }
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
                { type: "text", text: "{expression/score7} Heat Wave: {score7}" },
                { type: "text", text: "{expression/score8} Hurricane: {score8}" },
                { type: "text", text: "{expression/score14} Tornado: {score14}" },
                { type: "text", text: "{expression/score13} Strong Wind: {score13}" },
                { type: "text", text: "{expression/score11} Lightning: {score11}" },
                { type: "text", text: "{expression/score6} Hail: {score6}" },
                { type: "text", text: "{expression/score9} Ice Storm: {score9}" },
                { type: "text", text: "{expression/score18} Winter Weather: {score18}" },
                { type: "text", text: "{expression/score3} Cold Wave: {score3}" },
                { type: "text", text: "{expression/score1} Avalanche: {score1}" },
                { type: "text", text: "{expression/score12} Riverine Flooding: {score12}" },
                { type: "text", text: "{expression/score2} Coastal Flooding: {score2}" },
                { type: "text", text: "{expression/score10} Landslide: {score10}" },
                { type: "text", text: "{expression/score15} Tsunami: {score15}" },
                { type: "text", text: "{expression/score5} Earthquake: {score5}" },
                { type: "text", text: "{expression/score16} Volcanic Activity: {score16}" },
                { type: "text", text: "{expression/score17} Wildfire: {score17}" },
                { type: "text", text: "{expression/score4} Drought: {score4}" }
            ],
            expressionInfos: [
                {
                    name: "score7",
                    title: "Heat Wave",
                    expression: getColorExpression("score7")
                },
                {
                    name: "score8",
                    title: "Hurricane",
                    expression: getColorExpression("score8")
                },
                {
                    name: "score14",
                    title: "Tornado",
                    expression: getColorExpression("score14")
                },
                {
                    name: "score13",
                    title: "Strong Wind",
                    expression: getColorExpression("score13")
                },
                {
                    name: "score11",
                    title: "Lightning",
                    expression: getColorExpression("score11")
                },
                {
                    name: "score6",
                    title: "Hail",
                    expression: getColorExpression("score6")
                },
                {
                    name: "score9",
                    title: "Ice Storm",
                    expression: getColorExpression("score9")
                },
                {
                    name: "score18",
                    title: "Winter Weather",
                    expression: getColorExpression("score18")
                },
                {
                    name: "score3",
                    title: "Cold Wave",
                    expression: getColorExpression("score3")
                },
                {
                    name: "score1",
                    title: "Avalanche",
                    expression: getColorExpression("score1")
                },
                {
                    name: "score12",
                    title: "Riverine Flooding",
                    expression: getColorExpression("score12")
                },
                {
                    name: "score2",
                    title: "Coastal Flooding",
                    expression: getColorExpression("score2")
                },
                {
                    name: "score10",
                    title: "Landslide",
                    expression: getColorExpression("score10")
                },
                {
                    name: "score15",
                    title: "Tsunami",
                    expression: getColorExpression("score15")
                },
                {
                    name: "score5",
                    title: "Earthquake",
                    expression: getColorExpression("score5")
                },
                {
                    name: "score16",
                    title: "Volcanic Activity",
                    expression: getColorExpression("score16")
                },
                {
                    name: "score17",
                    title: "Wildfire",
                    expression: getColorExpression("score17")
                },
                {
                    name: "score4",
                    title: "Drought",
                    expression: getColorExpression("score4")
                }
            ]
        }
    });

    function getColorExpression(field) {
        return `
            var score = $feature.${field};
            return When(
                score >= 80, "🟥", 
                score >= 60, "🟧",  
                score >= 40, "🟨",  
                "🟩"               
            );
        `;
    }

    // Add the new layer to the map
    map.add(hexFeatureLayer);

    // Watch for scale changes and update opacity
    view.watch("scale", function (newValue) {
        if (newValue <= 4622324) {
            hexFeatureLayer.opacity = 0.2; // Set opacity to 30% when scale is 4622324 or lower
        } else {
            hexFeatureLayer.opacity = 0.01; // Set opacity back to 10% for higher scales
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
    toggleButton.innerHTML = "Show";
    legendHeader.appendChild(toggleButton);

    legendContainer.appendChild(legendHeader);

    const legendContent = document.createElement("div");
    legendContent.id = "legendContent";
    const legendImage = document.createElement("img");
    legendImage.src = "img/legend.png";
    legendContent.appendChild(legendImage);
    legendContainer.appendChild(legendContent);

    legendHeader.addEventListener("click", function () {
        if (legendContent.style.display === "none") {
            legendContent.style.display = "block";
            legendContainer.style.maxHeight = "500px"; // Expanded height
            legendContainer.style.width = "500px"; // Expanded width
            toggleButton.innerHTML = "Hide";
        } else {
            legendContent.style.display = "none";
            legendContainer.style.maxHeight = "50px"; // Collapsed height
            legendContainer.style.width = "250px"; // Collapsed width
            toggleButton.innerHTML = "Show";
        }
    });

    view.ui.add(legendContainer, "manual");

});
