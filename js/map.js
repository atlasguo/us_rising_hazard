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
            maxZoom: 9 // Maximum zoom level
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

    // Define the state Feature Layer URL
    const countryFeatureLayerUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/us_boundary/FeatureServer";

    // Create a state FeatureLayer with white border and no fill color
    const countryFeatureLayer = new FeatureLayer({
        url: countryFeatureLayerUrl,
        opacity: 0.5, // Set initial opacity to 50%        
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-fill", // Change symbol type to simple-fill
                color: [255, 0, 0, 1], // No fill color
                outline: {
                    color: [255, 255, 255, 0.1], // White border
                    width: 3
                }
            }
        }
    });

    // Add the state and country layer to the map
    map.add(stateFeatureLayer);
    //map.add(countryFeatureLayer);

    // Watch for scale changes and update opacity and width
    view.watch("scale", function (newValue) {
        if (newValue <= 9244649) {
            stateFeatureLayer.opacity = 0.75;
            stateFeatureLayer.renderer.symbol.outline.width = 2;

            countryFeatureLayer.opacity = 0.75;
            countryFeatureLayer.renderer.symbol.outline.width = 5;
        } else {
            stateFeatureLayer.opacity = 0.5;
            stateFeatureLayer.renderer.symbol.outline.width = 1.2;

            countryFeatureLayer.opacity = 0.5;
            countryFeatureLayer.renderer.symbol.outline.width = 3;
        }
    });

    view.ui.add(legendContainer, "manual");

    // Display info dialog initially
    const initialInfoDialog = document.getElementById("infoDialog");
    initialInfoDialog.style.display = "block"; // Ensure the dialog is displayed
});
