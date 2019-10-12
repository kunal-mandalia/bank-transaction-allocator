import { store, message, constants, types } from '@bank-transaction-allocator/common'
import { getTransactionAllocations } from './transaction'
import { rules } from './rules'

const {
  MESSAGE_ACTIVATE_POPUP,
  MESSAGE_GET_TRANSACTIONS,
  MESSAGE_READY_FOR_ALLOCATION,
  MESSAGE_START_PROCESSING_TRANSACTIONS,
  MESSAGE_TRANSACTION_ALLOCATED
} = constants

const {
  MESSAGE_ALLOCATE_TRANSACTION
} = constants
const {
  Status: MessageStatus
} = message

export function setupMessageListener() {
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log(`background.js received message`, message, sender)

    if (!message || !message.type) {
      console.log(`unhandled message type`, message)
    }

    switch (message.type) {
      case MESSAGE_ACTIVATE_POPUP:
        // only one tab may have control
        let id
        const { context: { tabId } } = await store.get()
        if (!tabId) {
          id = sender.tab.id
          await store.set({ context: { tabId: id }})
        } else {
          id = tabId
        }
        chrome.pageAction.show(id)
        sendResponse({ status: MessageStatus.OK })
        return true
        break

      case MESSAGE_READY_FOR_ALLOCATION:
        sendResponse({ status: MessageStatus.OK })
        handleReadyForAllocation()
        return true
        break

      case MESSAGE_START_PROCESSING_TRANSACTIONS:
        sendResponse({ status: MessageStatus.OK })
        processNextAllocation()
        return true
        break

      case MESSAGE_TRANSACTION_ALLOCATED:
        console.log('handling allocated transaction', message)
        handleTransactionAllocated(message.payload.id)
        return true
        break

      default:
        break;
    }
  })
}

export async function setupTabListener() {
  chrome.tabs.onRemoved.addListener(async (tabId, removed) => {
    const { context } = await store.get()
    if (removed && (tabId === context.tabId)) {
      await store.set({ context: { tabId: null }})
    }
   })
}

async function sendMessage({ tabId, message }) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response = {}) => {
      if (!chrome.runtime.lastError) {
        return resolve(response)
      }
      return reject(`send message (tabId: ${tabId} did not receive a reply ${JSON.stringify(message)}`)
    })
  })
}

async function getTransactions({ tabId }): Promise<types.Transaction[]> {
  const response = await sendMessage({
    tabId,
    message: {
      type: MESSAGE_GET_TRANSACTIONS
    }
  })
  // @ts-ignore
  return response.transactions || []
}

function getNextPendingAllocation(allocations: types.TransactionAllocation[]) {
  return allocations.find(allocation => allocation.isAllocatable === true)
}

async function handleReadyForAllocation() {
  await store.set({ readiness: { content: true } })

  const state = await store.get()
  const { tabId } = state.context
  
  await syncAllocations({ tabId })

  if (state.status !== store.Status.ACTIVE) {
    return console.log('skipping processing: content ready but background not active')
  }
  
  await processNextAllocation()
}

async function syncAllocations({ tabId }) {
  const state = await store.get()
  const transactions = await getTransactions({ tabId })
  const allocations = getTransactionAllocations({
    transactions,
    rules
  })
  const storeUpdate = getLatestState({ allocations, state })
  await store.set(storeUpdate)
}

interface IGetLatestState {
  allocations: types.TransactionAllocation[],
  state: store.State
}

export function getLatestState({ allocations, state } : IGetLatestState): store.State {
  console.log('getLatestState allocations',allocations)

  let nextHistory = [...state.history]

  allocations.forEach(a => {
    const historyAllocatedStatus = [store.TransactionHistoryStatus.ALLOCATION_SUCCESSFUL, store.TransactionHistoryStatus.MANUALLY_ALLOCATED]
    const historyItem = nextHistory.find(h => h.id === a.transaction.id)
    if (historyItem) {
      const isTransactionAllocated = a.transaction.isAllocated
      const isHistoryItemAllocated = historyAllocatedStatus.includes(historyItem.result)
      const isHistoryItemAllocating = historyItem.result === store.TransactionHistoryStatus.ALLOCATING

      if (isTransactionAllocated) {
        if (isHistoryItemAllocated) return

        if (isHistoryItemAllocating) {
          return historyItem.result = store.TransactionHistoryStatus.ALLOCATION_SUCCESSFUL
        }

        if (!isHistoryItemAllocated) {
          return historyItem.result = store.TransactionHistoryStatus.MANUALLY_ALLOCATED
        }
      } else {
        if (isHistoryItemAllocated) {
          return historyItem.result = store.TransactionHistoryStatus.MANUALLY_UNALLOCATED
        }
      }
    }
  })

  console.log('next history', nextHistory)

  return {
    ...state,
    history: nextHistory,
    allocations
  }
}


async function processNextAllocation() {
  const state = await store.get()
  const { tabId } = state.context

  const transactions = await getTransactions({ tabId })

  const allocations = getTransactionAllocations({
    transactions,
    rules
  })
  const nextAllocation = getNextPendingAllocation(allocations)

  if (nextAllocation) {
    const { transaction, rule } = nextAllocation

    await sendMessage({
      tabId,
      message: {
        type: MESSAGE_ALLOCATE_TRANSACTION,
        payload: {
          id: transaction.id,
          allocation: rule.decision
        }
      }
    })

    const historyItem = state.history.find(h => h.id === nextAllocation.transaction.id)
    let nextHistory = [...state.history]

    if (historyItem) {
      nextHistory = nextHistory.map(h => {
        if (h.id === historyItem.id) {
          return {
            ...h,
            result: store.TransactionHistoryStatus.ALLOCATING,
            rule: nextAllocation.rule
          }
        }
        return h
      })
    } else {
      await store.set({
        history: [
          ...state.history,
          {
            id: transaction.id,
            description: transaction.description,
            startTime: Date.now(),
            stopTime: null,
            result: store.TransactionHistoryStatus.ALLOCATING,
            rule: nextAllocation.rule
          }
        ]
      })
    }
  } else {
    await store.set({
      status: store.Status.IDLE
    })
  }
}

async function handleTransactionAllocated(id: string) {
  const state = await store.get()
  const historyItem = state.history.find(h => h.id === id)

  if (!historyItem) {
    throw Error(`expected history with id ${id} but history contained ${state.history}`)
  }

  const updatedHistoryItem = {
    ...historyItem,
    stopTime: Date.now(),
    result: store.TransactionHistoryStatus.ALLOCATION_SUCCESSFUL
  }

  await store.set({
    history: state.history.map(h => (h.id === id ? updatedHistoryItem : h))
  })
}
