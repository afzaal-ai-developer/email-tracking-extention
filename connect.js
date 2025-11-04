document.addEventListener('DOMContentLoaded', function() {
  const connectGoogleBtn = document.getElementById('connectGoogle');
  const statusMessage = document.getElementById('status');
  const profileInfo = document.getElementById('profile-info');
  const profilePicture = document.getElementById('profile-picture');
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');

  function updateConnectionStatus(isConnected) {
    if (isConnected) {
      profileInfo.style.display = 'block';
      profilePicture.src = localStorage.getItem('googleUserProfilePicture');
      profileName.textContent = localStorage.getItem('googleUserName');
      profileEmail.textContent = localStorage.getItem('googleUserEmail');
      statusMessage.textContent = 'Email account is connected.';
      statusMessage.style.color = 'green';
      connectGoogleBtn.textContent = 'Disconnect Google Account';
      connectGoogleBtn.removeEventListener('click', handleConnectClick);
      connectGoogleBtn.addEventListener('click', handleDisconnectClick);
    } else {
      profileInfo.style.display = 'none';
      statusMessage.textContent = 'Email account is not connected.';
      statusMessage.style.color = 'red';
      connectGoogleBtn.textContent = 'Connect with Google';
      connectGoogleBtn.removeEventListener('click', handleDisconnectClick);
      connectGoogleBtn.addEventListener('click', handleConnectClick);
    }
  }

  function fetchUserProfile(token) {
    fetch('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('googleUserName', data.names[0].displayName);
      localStorage.setItem('googleUserEmail', data.emailAddresses[0].value);
      localStorage.setItem('googleUserProfilePicture', data.photos[0].url);
      updateConnectionStatus(true);
    })
    .catch(error => {
      console.error('Error fetching user profile:', error);
      statusMessage.textContent = 'Error fetching user profile.';
      statusMessage.style.color = 'red';
    });
  }

  function handleConnectClick() {
    statusMessage.textContent = 'Connecting...';
    statusMessage.style.color = 'orange';

    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        statusMessage.textContent = 'Connection failed: ' + chrome.runtime.lastError.message;
        statusMessage.style.color = 'red';
        updateConnectionStatus(false);
        return;
      }
      if (token) {
        localStorage.setItem('googleAuthToken', token);
        fetchUserProfile(token);
      } else {
        statusMessage.textContent = 'Connection failed: No token received.';
        statusMessage.style.color = 'red';
        updateConnectionStatus(false);
      }
    });
  }

  function handleDisconnectClick() {
    const token = localStorage.getItem('googleAuthToken');
    if (token) {
      chrome.identity.removeCachedAuthToken({ token: token }, function() {
        localStorage.removeItem('googleAuthToken');
        localStorage.removeItem('googleUserName');
        localStorage.removeItem('googleUserEmail');
        localStorage.removeItem('googleUserProfilePicture');
        updateConnectionStatus(false);
        statusMessage.textContent = 'Disconnected successfully.';
        statusMessage.style.color = 'green';
        console.log('Google Auth Token removed.');
      });
    } else {
      updateConnectionStatus(false);
    }
  }

  // Check initial connection status
  chrome.identity.getAuthToken({ interactive: false }, function(token) {
    if (token) {
      localStorage.setItem('googleAuthToken', token);
      fetchUserProfile(token);
    } else {
      updateConnectionStatus(false);
    }
  });
});
