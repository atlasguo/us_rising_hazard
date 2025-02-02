const hexPopupTemplate = {
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
};

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

legendHeader.innerHTML += "Color Legend";

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

// Define 18 colors in the specified sequence
const colors = [
    "#d82626", "#d84726", "#d86826", "#d88926", "#d8ae26", "#c0d826",
    "#7ed826", "#3cd826", "#26d84e", "#26d890", "#26d8d2", "#269cd8",
    "#265ad8", "#3326d8", "#7626d8", "#b826d8", "#d826b7", "#d82675"
];

// Define the order of colors and score fields
const colorIndices = [2, 1, 0, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3];
const scoreFields = [7, 8, 14, 13, 11, 6, 9, 18, 3, 1, 12, 2, 10, 15, 5, 16, 17, 4];

