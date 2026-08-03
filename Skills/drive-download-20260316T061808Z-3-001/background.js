console.log('Background script loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed or updated');
  chrome.contextMenus.create({
    id: "sendSelectedText",
    title: "📤 Send selected text",
    contexts: ["selection"]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error creating context menu:', chrome.runtime.lastError);
    } else {
      console.log('Context menu created successfully');
    }
  });
});

chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked');
  chrome.tabs.sendMessage(tab.id, { action: "getSelectedText" });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('Context menu clicked', info.menuItemId);
  if (info.menuItemId === "sendSelectedText") {
    console.log('Sending selected text:', info.selectionText);
    sendToWebhook(info.selectionText, tab.url);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in background', request);
  if (request.action === "sendText") {
    sendToWebhook(request.text, request.url);
  }
});

function sendToWebhook(text, url) {
  console.log('Sending to webhook:', text, url);
  fetch('https://hook.eu2.make.com/rzc8dik8vqnk1jf9oo2mmplh62ct2b68', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      url: url
    }),
  })
  .then(response => response.text())
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
}

console.log('Background script setup complete');