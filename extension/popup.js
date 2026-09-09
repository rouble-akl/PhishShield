// Runs when the popup opens — gets the current tab's URL and checks it

document.addEventListener("DOMContentLoaded", async () => {
    const statusDiv = document.getElementById("status");

    // Get the URL of the currently active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tab.url;

    // Call the (currently mock) checker function
    const stats = await checkUrl(currentUrl);

    if (stats.malicious > 0 || stats.suspicious > 0) {
        statusDiv.className = "danger";
        statusDiv.textContent = `\u26A0\uFE0F Dangerous \u2014 flagged by ${stats.malicious} vendor(s).`;
    } else {
        statusDiv.className = "safe";
        statusDiv.textContent = "\u2705 This page looks safe.";
    }
});