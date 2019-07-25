console.log(`background running`)

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "activate_icon") {
      console.log(`enabling popup on tab ${sender.tab.id}`)
      chrome.pageAction.show(sender.tab.id)
    }
  })