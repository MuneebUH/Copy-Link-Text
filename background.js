chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyLinkText",
    title: "Copy Link Text",
    contexts: ["link"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copyLinkText" && tab.id) {
    chrome.tabs.sendMessage(tab.id, { type: "COPY_LAST_LINK_TEXT" }, (response) => {
      if (chrome.runtime.lastError) {
        // Inject content script if not already injected
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        });

        // Wait for content script to be ready
        const listener = (msg, sender) => {
          if (msg.type === "CONTENT_SCRIPT_READY" && sender.tab?.id === tab.id) {
            chrome.runtime.onMessage.removeListener(listener);
            chrome.tabs.sendMessage(tab.id, { type: "COPY_LAST_LINK_TEXT" });
          }
        };
        chrome.runtime.onMessage.addListener(listener);
      }
    });
  }
});
