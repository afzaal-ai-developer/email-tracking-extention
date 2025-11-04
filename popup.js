document.addEventListener('DOMContentLoaded', function() {
  var openDashboardButton = document.getElementById('openDashboard');
  openDashboardButton.addEventListener('click', function() {
    chrome.tabs.create({ url: 'dashboard.html' });
  });
});
