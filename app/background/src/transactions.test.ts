
import { getTransactionAllocations } from './transaction'
import { AllocationConditionType } from './types'

const rules = [
  {
    condition: {
      type: AllocationConditionType.STARTS_WITH,
      value: 'CARD PAYMENT TO TFL'
    },
    decision: {
      category: 'expenses',
      explanation: 'travel'
    }
  },
  {
    condition: {
      type: AllocationConditionType.CONTAINS,
      value: 'HMRC'
    },
    decision: {
      category: 'tax',
      explanation: 'income'
    }
  }
]

const transactions = [
  {
    id: '1',
    description: 'CARD PAYMENT TO TFL TRAVEL',
    isAllocated: false
  },
  {
    id: '2',
    description: 'CARD PAYMENT TO TFL TRAVEL',
    isAllocated: true
  },
  {
    id: '3',
    description: 'PAYMENT TO HMRC',
    isAllocated: false
  },
  {
    id: '4',
    description: 'NANDOS',
    isAllocated: false
  },
]

describe('background: transaction', () => {

  describe('getTransactionAllocations', () => {
    it('should calculate unallocated transactions', () => {
      const input = {
        rules,
        transactions
      }
      const result = getTransactionAllocations(input)
      expect(result).toEqual([
        {
          transaction:
          {
            id: '1',
            description: 'CARD PAYMENT TO TFL TRAVEL',
            isAllocated: false
          },
          isAllocatable: true,
          rule: {
            condition: {
              type: AllocationConditionType.STARTS_WITH,
              value: 'CARD PAYMENT TO TFL'
            },
            decision: {
              category: 'expenses',
              explanation: 'travel'
            }
          }
        },
        {
          transaction:
          {
            id: '2',
            description: 'CARD PAYMENT TO TFL TRAVEL',
            isAllocated: true
          },
          isAllocatable: false
        },
        {
          transaction: { id: '3', description: 'PAYMENT TO HMRC', isAllocated: false },
          isAllocatable: true,
          rule: {
            condition: {
              type: AllocationConditionType.CONTAINS,
              value: 'HMRC'
            },
            decision: {
              category: 'tax',
              explanation: 'income'
            }
          }
        },
        {
          transaction: { id: '4', description: 'NANDOS', isAllocated: false },
          isAllocatable: false
        }])
    })
  })

  describe('requestAllocation', () => {
    it('should message content to request an allocation to be performed', () => {

    })
  })
})