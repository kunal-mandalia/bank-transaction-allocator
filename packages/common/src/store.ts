import { MESSAGE_STORE_UPDATED } from './constants'
import { TransactionAllocation, AllocationRule } from './types'

export enum Status {
  IDLE = 'IDLE',
  ACTIVE = 'ACTIVE',
}

export enum TransactionHistoryStatus {
  ALLOCATING = 'ALLOCATING',
  ALLOCATION_SUCCESSFUL = 'ALLOCATION_SUCCESSFUL',
  ALLOCATION_FAILED = 'ALLOCATION_FAILED',
  MANUALLY_ALLOCATED = 'MANUALLY_ALLOCATED',
  MANUAL_ALLOCATION_REQUIRED = 'MANUAL_ALLOCATION_REQUIRED',
  MANUALLY_UNALLOCATED = 'MANUALLY_UNALLOCATED'
}

export type TransactionHistory = {
  id: string,
  description: string,
  startTime: number,
  stopTime: number | null,
  result: TransactionHistoryStatus,
  rule?: AllocationRule
}

export type State = {
  context: {
    tabId: number | null
  },
  initialised: number,
  status: Status,
  readiness: {
    content: boolean
  },
  allocations: TransactionAllocation[],
  history: TransactionHistory[],
}

export const initialState: State = {
  context: {
    tabId: null
  },
  initialised: Date.now(),
  status: Status.IDLE,
  readiness: {
    content: false
  },
  allocations: [],
  history: [],
}

export function setInitialState() {
  chrome.storage.sync.get(storage => {
    if (!storage.initialised) {
      set(initialState)
      console.log('set initial state')
    } else {
      console.log('state exists')
    }
  })
}

export async function get(): Promise<State> {
  return new Promise(resolve => {
    chrome.storage.sync.get(storage => {
      // @ts-ignore
      return resolve(storage)
    })
  })
}

export function isActive(state: State) {
  return state.status === Status.ACTIVE
}

export function set(state: Partial<State>): Promise<Partial<State>> {
  return new Promise(async resolve => {
    console.log('state set')
    chrome.storage.sync.set(state)
    chrome.runtime.sendMessage({
      type: MESSAGE_STORE_UPDATED,
    })
    return resolve(state)
  })
}