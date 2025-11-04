document.addEventListener('DOMContentLoaded', function () {
  const sentEmailsTable = document.getElementById('sent-emails-table').getElementsByTagName('tbody')[0];

  chrome.storage.local.get({sentEmails: []}, function(result) {
    const sentEmails = result.sentEmails;

    if (sentEmails.length === 0) {
      const row = sentEmailsTable.insertRow();
      const cell = row.insertCell();
      cell.colSpan = 3;
      cell.textContent = 'No sent emails to display.';
      cell.style.textAlign = 'center';
    } else {
      sentEmails.forEach(email => {
        const row = sentEmailsTable.insertRow();
        const toCell = row.insertCell();
        const subjectCell = row.insertCell();
        const sentAtCell = row.insertCell();
        const openedCell = row.insertCell();

        toCell.textContent = email.to;
        subjectCell.textContent = email.subject;
        sentAtCell.textContent = new Date(email.timestamp).toLocaleString();
        if (email.trackingId) {
          // Replace with your actual Netlify URL
          const netlifyFunctionUrl = `https://YOUR_NETLIFY_URL/.netlify/functions/tracker-status?trackingId=${email.trackingId}`;
          fetch(netlifyFunctionUrl)
            .then(response => response.json())
            .then(data => {
              if (data.opened) {
                openedCell.textContent = 'Yes';
              } else {
                openedCell.textContent = 'No';
              }
            })
            .catch(error => {
              console.error('Error fetching tracking status:', error);
              openedCell.textContent = 'Error';
            });
        } else {
          openedCell.textContent = 'N/A';
        }
      });
    }
  });
});