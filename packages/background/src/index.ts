import { hello } from '@bank-transaction-allocator/common'

console.log(`background running`)
hello('you')

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "activate_icon") {
      console.log(`enabling popup on tab ${sender.tab.id}`)
      chrome.pageAction.show(sender.tab.id)
    }
  })