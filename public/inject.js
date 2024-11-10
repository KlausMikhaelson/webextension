// Background script for tab tracking
console.log("Background script initialized");

const SERVER_URL = "http://localhost:3002/";

// Function to get tab content
async function getTabContent(tabId) {
  try {
    // Only inject script in pages we have permission for
    const results = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        // Get text content while excluding script and style tags
        const bodyText = document.body.innerText;
        const title = document.title;
        return { title, bodyText };
      }
    });
    
    return results[0].result;
  } catch (error) {
    console.error(`Error getting content for tab ${tabId}:`, error);
    return { title: '', bodyText: '' };
  }
}

// Function to get all open tabs with their content
async function getAllTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    const tabsWithContent = await Promise.all(tabs.map(async (tab) => {
      // Only try to get content from tabs we can access
      if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
        try {
          const content = await getTabContent(tab.id);
          return {
            ...tab,
            content: content
          };
        } catch (error) {
          console.error(`Skipping content extraction for tab ${tab.id}:`, error);
          return tab;
        }
      }
      return tab;
    }));
    return tabsWithContent;
  } catch (error) {
    console.error('Error getting tabs:', error);
    return [];
  }
}

async function getUserToken() {
  try {
    const result = await chrome.storage.local.get(['userToken']);
    console.log('Retrieved storage data:', result);
    return result.userToken || null;
  } catch (error) {
    console.error('Error getting userToken:', error);
    return null;
  }
}

async function setUserToken(token) {
  try {
    await chrome.storage.sync.set({ userToken: token });
    console.log('Token saved successfully');
  } catch (error) {
    console.error('Error saving token:', error);
  }
}

async function notifyServer() {
  try {
    const [allTabs, userToken] = await Promise.all([
      getAllTabs(),
      getUserToken()
    ]);

    console.log('User token:', userToken);

    if (!userToken) {
      console.warn('No user token found');
    }

    const payload = {
      tabs: allTabs.map(tab => ({
        id: tab.id,
        url: tab.url,
        title: tab.title,
        // get only the first 500 characters of the content
        content: tab.content ? tab.content.bodyText.slice(0, 500) : '',
        ...tab
      })),
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

const debouncedNotifyServer = debounce(notifyServer, 1000);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
    debouncedNotifyServer();
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('Tab activated');
  debouncedNotifyServer();
});

chrome.tabs.onRemoved.addListener((tabId) => {
  console.log('Tab removed:', tabId);
  debouncedNotifyServer();
});

notifyServer();