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

// Create home button
const homeButton = document.createElement("button");
homeButton.className = "zoom-button mapButton";
homeButton.id = "homeButton";
const homeIcon = document.createElement("i");
homeIcon.className = "fas fa-home";
homeIcon.id = "homeIcon";
homeButton.appendChild(homeIcon);

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