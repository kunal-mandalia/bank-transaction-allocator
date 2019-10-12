import { types } from '@bank-transaction-allocator/common'

export const rules = [
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CARD PAYMENT TO TFL'
    },
    decision: {
      category: 'Expenses',
      explanation: 'Travel'
    }
  },
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CARD PAYMENT TO MARKS&SPENCER'
    },
    decision: {
      category: 'Expenses',
      explanation: 'Sundry Expenses'
    }
  },
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CARD PAYMENT TO TESCO STORE'
    },
    decision: {
      category: 'Expenses',
      explanation: 'Sundry Expenses'
    }
  },
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'INTEREST PAID AFTER TAX 0.00 DEDUCTED'
    },
    decision: {
      category: 'Other Income',
      explanation: 'Bank Interest Received'
    }
  }
]