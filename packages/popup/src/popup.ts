import {
  MESSAGE_START_PROCESSING_TRANSACTIONS,
  MESSAGE_STORE_UPDATED
} from "@bank-transaction-allocator/common/dist/constants";
import {
  logger
} from "@bank-transaction-allocator/common/dist/index";


const { chrome } = window

// @ts-ignore
async function sendMessage({ message }) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs && tabs[0].id) {
        const tabId = tabs[0].id
        const messageWithTabId = {
          ...message,
          payload: {
            ...message.payload,
            tabId
          }
        }
        logger.log(`sending message ${JSON.stringify(messageWithTabId)}`)
        chrome.runtime.sendMessage(messageWithTabId, response => {
          return resolve(response)
        })
      } else {
        return reject()
      }
    })
  })
}

export function setupMessageListeners(input : { onStoreChange: Function }) {
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    logger.log(`popup.js received message`, message, sender)

    if (!message || !message.type) {
      logger.log(`unhandled message type`, message)
    }

    switch (message.type) {
      case MESSAGE_STORE_UPDATED:
        logger.log('popup notified store updated')
        input.onStoreChange()
        break

      default:
        break
    }
  })
}


export async function startProcessingTransactions() {
  const message = {
    type: MESSAGE_START_PROCESSING_TRANSACTIONS
  }
  await sendMessage({ message })
}
