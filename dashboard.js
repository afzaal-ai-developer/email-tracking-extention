document.addEventListener('DOMContentLoaded', function() {
  const composeBtn = document.getElementById('composeBtn');
  const trackBtn = document.getElementById('trackBtn');
  const connectBtn = document.getElementById('connectBtn');
  const contentFrame = document.getElementById('contentFrame');

  composeBtn.addEventListener('click', () => {
    contentFrame.src = 'compose.html';
  });

  trackBtn.addEventListener('click', () => {
    contentFrame.src = 'track.html';
  });

  connectBtn.addEventListener('click', () => {
    contentFrame.src = 'connect.html';
  });
});
