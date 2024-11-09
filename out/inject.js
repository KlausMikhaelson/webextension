console.log("Calling the background script");

let currentTab = null;
let startTime = null;

// Function to send data to your server
async function sendDataToServer(data) {
  try {
    const response = await fetch("YOUR_SERVER_URL/api/tracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error sending data:", error);
  }
}

// Function to handle tab changes
function handleTabChange(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.active) {
    // If there was a previous tab, send its end time
    if (currentTab && startTime) {
      const endTime = new Date().toISOString();
      sendDataToServer({
        url: currentTab.url,
        startTime: startTime,
        endTime: endTime,
        tabId: currentTab.id,
      });
    }

    // Update current tab and start time
    currentTab = tab;
    startTime = new Date().toISOString();

    // Send initial visit data
    sendDataToServer({
      url: tab.url,
      startTime: startTime,
      tabId: tab.id,
      type: "visit",
    });
  }
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener(handleTabChange);

// Listen for tab activation changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  handleTabChange(activeInfo.tabId, { status: "complete" }, tab);
});

// Handle when browser closes or tab closes
chrome.windows.onRemoved.addListener(() => {
  if (currentTab && startTime) {
    const endTime = new Date().toISOString();
    sendDataToServer({
      url: currentTab.url,
      startTime: startTime,
      endTime: endTime,
      tabId: currentTab.id,
      type: "exit",
    });
  }
});
