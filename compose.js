document.addEventListener('DOMContentLoaded', function () {
  const composeForm = document.querySelector('form');
  composeForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const to = document.querySelector('input[type="email"]').value;
    const subject = document.querySelector('input[type="text"]').value;
    const message = document.querySelector('textarea').value;

    const authToken = localStorage.getItem('googleAuthToken');
    if (!authToken) {
      alert('You are not connected to your Google account. Please connect first.');
      return;
    }

    const trackingId = Date.now().toString();
    const trackingPixelUrl = `https://YOUR_NETLIFY_URL/.netlify/functions/tracker?trackingId=${trackingId}`;
    const trackedMessage = `${message}<img src="${trackingPixelUrl}" width="1" height="1" />`;

    const email = [
      'Content-Type: text/html; charset="UTF-8"',
      'MIME-Version: 1.0',
      'Content-Transfer-Encoding: 7bit',
      'to: ' + to,
      'subject: ' + subject,
      '',
      trackedMessage
    ].join('\n');

    const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_');

    fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        raw: encodedEmail
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Gmail API response:', data); // Log the response
      if (data && data.id) {
        alert('Email sent successfully!');
        
        // Store sent email information
        const sentEmail = {
          id: data.id,
          to: to,
          subject: subject,
          timestamp: new Date().toISOString(),
          trackingId: trackingId
        };
        
        chrome.storage.local.get({sentEmails: []}, function(result) {
          const sentEmails = result.sentEmails;
          sentEmails.push(sentEmail);
          chrome.storage.local.set({sentEmails: sentEmails}, function() {
            console.log('Email saved to storage.');
            window.close(); // Close the compose window
          });
        });

      } else if (data && data.error) {
        alert('Error sending email: ' + (data.error.message || 'Unknown error'));
      } else {
        alert('An unknown error occurred while sending the email.');
      }
    })
    .catch(error => {
      console.error('Error sending email:', error);
      alert('Error sending email. See console for details.');
    });
  });
});