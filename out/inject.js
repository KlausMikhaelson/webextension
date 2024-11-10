// Background script for tab tracking
console.log("Background script initialized");

const SERVER_URL = "http://localhost:3002/";

// Simple function to make GET request
async function notifyServer(tabUrl) {
  try {
    const response = await fetch(`${SERVER_URL}getdata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ 
        url: tabUrl,
        timestamp: new Date().toISOString()
      })
    });
    
    console.log('Request made to server');
    const data = await response.text(); // Changed to text() since server sends plain text
    console.log('Server response:', data);
  } catch (error) {
    console.error('Error making request:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  }
}

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
    notifyServer(tab.url);
  }
});

// Handle tab activation (when user switches tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) {
      console.log('Tab activated:', tab.url);
      notifyServer(tab.url);
    }
  } catch (error) {
    console.error('Error getting tab info:', error);
  }
});