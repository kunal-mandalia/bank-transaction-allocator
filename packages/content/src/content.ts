import { constants, message } from '@bank-transaction-allocator/common'
import { MESSAGE_TRANSACTION_ALLOCATED } from '@bank-transaction-allocator/common/dist/constants';

const {
  MESSAGE_GET_TRANSACTIONS,
  MESSAGE_ALLOCATE_TRANSACTION,
  MESSAGE_READY_FOR_ALLOCATION,
  MESSAGE_ACTIVATE_POPUP
} = constants

const {
  Status: MessageStatus
} = message

type Config = {
  enablePopup: Boolean
}

type Message = {
  type: string,
  payload?: object
}

type Transaction = {
  id: string,
  description: string,
  isAllocated: boolean
}

type Allocation = {
  category: string,
  explanation: string
}

async function sendMessage(message: Message): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // fire and forget
    chrome.runtime.sendMessage(message)
    return resolve()
  })
}

function getId(row: HTMLTableRowElement): string {
  return row.dataset.urn
}

function getDescription(row: HTMLTableRowElement): string {
  return row.children[1].textContent
}

function getIsAllocated(row: HTMLTableRowElement): boolean {
  return row.children[5].classList[1] === 'allocated'
}

function getTransactions(): Array<Transaction> {
  let transactions = []
  const table = document.querySelector('#transactions > tbody')
  const rows = table.querySelectorAll('tr')

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    transactions.push({
      id: getId(row),
      description: getDescription(row),
      isAllocated: getIsAllocated(row)
    })
  }
  return transactions
}

async function announceReadiness(isReady: boolean) {
  console.log(`announcing readiness`, isReady)
  await sendMessage({
    type: MESSAGE_READY_FOR_ALLOCATION,
    payload: {
      isReady
    }
  })
}

function getTransactionById(id): HTMLTableRowElement | null {
  let transaction = null
  const table = document.querySelector('#transactions > tbody')
  const rows = table.querySelectorAll('tr')

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (getId(row) === id) {
      return row
    }
  }
  return transaction
}

function showTransactionDetails(transaction: HTMLTableRowElement) {
  transaction.scrollIntoView({ behavior: 'auto', block: 'center' })
  transaction.click()
}

async function setSelectValue(query, displayValue) {
  console.log(`set select value of control ${query} to ${displayValue}`)
  const select = document.querySelector(query)
  if (select) {
    for (let option of select.options) {
      if (option.text === displayValue) {
        select.value = option.value
        const event = new Event('change')
        select.dispatchEvent(event)
        console.log(`value set for ${query}`, select)
        break
      }
    }
  }
}

async function updateAllocation(id: string, allocation: Allocation) {
  const options: WaitOptions = {
    duration: 250,
    maxRetries: 120,
    validator: el => el.options && el.options.length > 1
  }

  await waitForElement('select.pagesize', options)
  await setSelectValue('select.pagesize', 'all')

  await waitForElement('select#allocation_accounts', options)
  await setSelectValue('select#allocation_accounts', allocation.category)

  await waitForElement('select#allocation_bt_', {
    ...options,
    validator: (select: HTMLSelectElement) => !!Array.from(select.options).find(option => option.text === allocation.explanation)
  })
  await setSelectValue('select#allocation_bt_', allocation.explanation)

  await waitForElement('#btn_allocation_save', { ...options, validator: btn => btn.disabled !== true })
  const confirm = document.getElementById('btn_allocation_save')
  confirm.click()

  await waitForElement('#manage_allocation > tbody > tr.allocation_line', {
    ...options,
    validator: line => !!line
  })

  const close = document.getElementById('btn_close')
  close.click()

  console.log('confirming transaction allocated')

  await sendMessage({
    type: MESSAGE_TRANSACTION_ALLOCATED,
    payload: { id }
  })

  window.location.reload()
}

async function allocate(id: string, transaction: HTMLTableRowElement, allocation: Allocation) {
  showTransactionDetails(transaction)
  updateAllocation(id, allocation)
}

async function allocateTransaction(id: string, allocation: Allocation) {
  const transaction = getTransactionById(id)
  if (transaction === null) {
    return console.log(`cannot find transaction`, id)
  }
  return allocate(id, transaction, allocation)
}

function setupMessageListener() {
  chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    console.log(`content received message`, JSON.stringify(message), sender)

    switch (message.type) {
      case MESSAGE_GET_TRANSACTIONS:
        const transactions = getTransactions()
        console.log('responding with transactions', transactions)
        sendResponse({ transactions })
        return true
        break

      case MESSAGE_ALLOCATE_TRANSACTION:
        // @ts-ignore
        const { id, allocation } = message.payload
        sendResponse({ status: MessageStatus.OK })
        allocateTransaction(id, allocation)
        return true
        break

      default:
        console.log(`content did not handle message`, message, sender)
        break
    }
    return true
  })
}

async function wait(ms = 1000) {
  return new Promise(resolve => setTimeout(() => {
    resolve()
  }, ms))
}

type WaitOptions = {
  duration?: number,
  maxRetries?: number,
  validator?: Function
}

async function waitForElement(
  query: string,
  options: WaitOptions = {
    duration: 500,
    maxRetries: 30,
    validator: () => true
  }): Promise<Element> {
  console.log('wait for element options', options)
  let tries = 0
  let found = false

  while (tries < options.maxRetries && !found) {
    console.log(`waiting for element ${query}. Tries: ${tries}`)
    tries += 1
    const el = document.querySelector(query)
    // @ts-ignore
    if (el && el.computedStyleMap().get("display").value !== "none") {
      if (options.validator(el) === true) {
        found = true
        // @ts-ignore
        console.log(`found element after ${tries} tries`, el, el.value)
        // el.scrollIntoView()
        return el
        break
      }
    }
    await wait(options.duration)
  }
  throw new Error(`Did not find element ${query}`)
}

async function waitForElementVanish(query: string, options: WaitOptions = { duration: 500, maxRetries: 30 }): Promise<boolean> {
  let tries = 0
  let didVanished = false

  let el = document.querySelector(query)
  // @ts-ignore
  if (!el || el.computedStyleMap().get("display").value === "none") {
    return true
  }

  while (tries < options.maxRetries && !didVanished) {
    console.log(`waiting for element ${query} to vanish. Tries: ${tries}`)
    tries += 1
    const el = document.querySelector(query)
    // @ts-ignore
    if (!el || el.computedStyleMap().get("display").value === "none") {
      didVanished = true
      console.log(`element vanished after ${tries} tries`)
      // el.scrollIntoView()
      break
    }
    await wait(options.duration)
  }
  return didVanished
}

function getNextUnallocatedTransaction(): string | null {
  let next = null
  const t = document.querySelector('#transactions > tbody')
  const transactions = t.querySelectorAll('tr')
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].children[5].classList[1] !== 'allocated') {
      return transactions[i].dataset.urn
    }
  }
  return next
}

export async function main(config: Config): Promise<void> {
  await sendMessage({ type: MESSAGE_ACTIVATE_POPUP })
  console.log(`send message to enable popup`)
  setupMessageListener()
  const didVanish = await waitForElementVanish('#loading')
  console.log(`loading complete`, didVanish)

  await announceReadiness(true)
  return Promise.resolve()
}

export default {
  main
}