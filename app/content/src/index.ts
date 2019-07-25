console.log('content script running')

chrome.runtime.sendMessage({"message": "activate_icon"});