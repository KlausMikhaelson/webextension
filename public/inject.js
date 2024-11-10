// Background script for tab tracking
console.log("Background script initialized");

const SERVER_URL = "http://localhost:3002/";

// Function to get all open tabs
async function getAllTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    return tabs;
  } catch (error) {
    console.error('Error getting tabs:', error);
    return [];
  }
}

async function getUserToken() {
  try {
    // chrome.storage.sync.get returns an object with the requested key
    const result = await chrome.storage.local.get(['userToken']);
    console.log('Retrieved storage data:', result);
    
    // Return the userToken value or null if not found
    return result.userToken || null;
  } catch (error) {
    console.error('Error getting userToken:', error);
    return null;
  }
}

// Function to set user token (can be called from popup or when token is received)
async function setUserToken(token) {
  try {
    await chrome.storage.sync.set({ userToken: token });
    console.log('Token saved successfully');
  } catch (error) {
    console.error('Error saving token:', error);
  }
}

// Function to make POST request with all tabs
async function notifyServer() {
  try {
    const [allTabs, userToken] = await Promise.all([
      getAllTabs(),
      getUserToken()
    ]);

    console.log('User token:', userToken);

    // If no token is found, you might want to handle this case
    if (!userToken) {
      console.warn('No user token found');
      // Depending on your requirements, you might want to:
      // - Return early
      // - Use a default token
      // - Skip the request
      // return;
    }

    const payload = {
      tabs: allTabs,
      timestamp: new Date().toISOString(),
      userToken: userToken
    };

    console.log('Sending data:', payload);

    const response = await fetch(`${SERVER_URL}getdata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Request made to server');
    const data = await response.json();
    console.log('Server response:', data);
  } catch (error) {
    console.error('Error making request:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  }
}

// Debounce function to prevent too many requests
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounced version of notifyServer
const debouncedNotifyServer = debounce(notifyServer, 1000);

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
    debouncedNotifyServer();
  }
});

// Handle tab activation (when user switches tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('Tab activated');
  debouncedNotifyServer();
});

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  console.log('Tab removed:', tabId);
  debouncedNotifyServer();
});

// Initial send when extension loads
notifyServer();