// content.js

// Example: Find the send button and attach a click listener
document.addEventListener('click', (event) => {
  // This is a very basic example, you would need to identify the actual send button
  // of the email client you are targeting.
  if (event.target.matches('button[aria-label*="Send"]')) {
    console.log("Send button clicked");

    // Example: Get the email recipient
    const recipient = document.querySelector('input[aria-label*="To"]').value;

    // Send a message to the background script to track the email
    chrome.runtime.sendMessage(
      { action: "trackEmail", data: { recipient: recipient } },
      (response) => {
        if (response.status === "success") {
          console.log("Email tracking initiated.");
        }
      }
    );
  }
});
