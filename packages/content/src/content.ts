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

async function sendMessage(message: Message): Promise<boolean> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, resolve)
  })
}

// get transactions
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

async function announceTransactions() {
  const transactions = getTransactions()
  console.log(`announcing transactions`, transactions)
  // await sendMessage({
  //   type: 'ANNOUNCE_TRANSACTIONS',
  //   payload: transactions
  // })
}

// allocate transactions
type Allocation = {
  category: string,
  explanation: string
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
  transaction.click()
}

async function updateAllocation(allocation: Allocation) {

  await waitForElement('select#category')
  const category = document.querySelector('select#category')
  // @ts-ignore
  category.value = allocation.category

  const changeEvent = new Event('change')
  category.dispatchEvent(changeEvent)

  await waitForElement('select#explanation')
  const explanation = document.querySelector('select#explanation')
  // @ts-ignore
  explanation.value = allocation.explanation
  explanation.dispatchEvent(changeEvent)

  const confirm = document.getElementById('submit-allocation-details')
  confirm.click()
}

function allocate(transaction: HTMLTableRowElement, allocation: Allocation) {
  showTransactionDetails(transaction)
  updateAllocation(allocation)
}

async function allocateTransaction(id: string, allocation: Allocation) {
  const transaction = getTransactionById(id)
  if (transaction === null) {
    return console.log(`cannot find transaction`, id)
  }
  allocate(transaction, allocation)
}

// message listeners
function setupMessageListener() {
  chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    console.log(`content received message`, message, sender)

    switch (message.type) {
      case 'ALLOCATE_TRANSACTION':
        // @ts-ignore
        const { id, allocation } = message.payload
        allocateTransaction(id, allocation)
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
  maxRetries?: number
}

async function waitForElement(query: string, options: WaitOptions = { duration: 500, maxRetries: 30 }): Promise<boolean> {
  let tries = 0
  let found = false

  while (tries < options.maxRetries && !found) {
    console.log(`waiting for element ${query}. Tries: ${tries}`)
    tries += 1
    const el = document.querySelector(query)
    // @ts-ignore
    if (el && el.computedStyleMap().get("display").value !== "none") {
      found = true
      console.log(`found element after ${tries} tries`)
      break
    }
    await wait(options.duration)
  }
  return found
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

export async function main(config: Config): Promise<object> {
  chrome.runtime.sendMessage({ "message": "activate_icon" })
  console.log(`send message to enable popup`)
  setupMessageListener()
  const didVanish = await waitForElementVanish('#loading')
  console.log(`loading complete`, didVanish)


  await announceTransactions()
  const id = getNextUnallocatedTransaction()
  if (id) {
    await allocateTransaction(id, { category: 'expenses', explanation: 'travel' })
  }
  return Promise.resolve({ allocateTransaction })
}

export default {
  main
}