chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension Installed');
});

// You can remove the use of service worker if not necessary in your extension.