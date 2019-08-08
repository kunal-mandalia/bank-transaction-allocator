import { getLatestState } from './background'
import { store, types } from '@bank-transaction-allocator/common'

const initialState = store.initialState

const defaultAllocation = {
  transaction: { id: '123', description: 'VAT payment to HMRC', isAllocated: false },
  isAllocatable: true,
  rule: {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CARD PAYMENT TO TFL'
    },
    decision: {
      category: 'Expenses',
      explanation: 'Travel'
    }
  }
}

describe('getLatestState', () => {
  describe('unallocated allocatable transactions', () => {
    it('should return additional allocations', () => {
      const input = {
        allocations: [defaultAllocation],
        state: initialState
      }
      const expectedOutput = {
        ...initialState,
        allocations: [defaultAllocation]
      }
      expect(getLatestState(input)).toEqual(expectedOutput)
    })
  })

  describe('existing allocations', () => {
    it('should update the status of transaction history to manually unallocated', () => {
      const input = {
        allocations: [defaultAllocation],
        state: {
          ...initialState,
          history: [
            {
              id: '123',
              description: 'VAT payment to HMRC',
              startTime: 0,
              stopTime: 1,
              result: store.TransactionHistoryStatus.ALLOCATION_SUCCESSFUL
            }
          ]
        }
      }
      const expectedOutput = {
        ...initialState,
        allocations: [defaultAllocation],
        history: [
          {
            id: '123',
            description: 'VAT payment to HMRC',
            startTime: 0,
            stopTime: 1,
            result: store.TransactionHistoryStatus.MANUALLY_UNALLOCATED
          }
        ]
      }
      expect(getLatestState(input)).toEqual(expectedOutput)
    })

    it('should update the status of transaction history to allocated successfully', () => {
      const input = {
        allocations: [
          {
            ...defaultAllocation,
            transaction: { id: '123', description: 'VAT payment to HMRC', isAllocated: true }
          }
        ],
        state: {
          ...initialState,
          history: [
            {
              id: '123',
              description: 'VAT payment to HMRC',
              startTime: 0,
              stopTime: 1,
              result: store.TransactionHistoryStatus.ALLOCATING
            }
          ]
        }
      }
      const expectedOutput = {
        ...initialState,
        allocations: input.allocations,
        history: [
          {
            id: '123',
            description: 'VAT payment to HMRC',
            startTime: 0,
            stopTime: 1,
            result: store.TransactionHistoryStatus.ALLOCATION_SUCCESSFUL
          }
        ]
      }
      expect(getLatestState(input)).toEqual(expectedOutput)
    })
  })
})