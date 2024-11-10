// contentScript.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPageContent") {
      const pageContent = document.body ? document.body.innerText : document.documentElement.innerText;
      sendResponse({ content: pageContent });
    }
  });
  