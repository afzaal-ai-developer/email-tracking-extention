// background.js

// Example: Listen for a message from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "trackEmail") {
    console.log("Email tracking request received:", request.data);
    // Here you would typically send the tracking data to your server
    // For now, we'll just log it to the console
    sendResponse({status: "success"});
  }
});
