import { types } from '@bank-transaction-allocator/common'

export const rules = [
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CARD PAYMENT TO TFL',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Travel',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CARD PAYMENT TO MARKS&SPENCER',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Subsistence',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CARD PAYMENT TO TESCO STORE',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Subsistence',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'INTEREST PAID AFTER TAX 0.00 DEDUCTED',
    },
    decision: {
      category: 'Other Income',
      explanation: 'Bank Interest Received',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CARD PAYMENT TO GIFFGAFF',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Telephone & Internet',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CARD PAYMENT TO giffgaff',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Telephone & Internet',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CHARGES FROM 20',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Bank Charges',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CHARGES FROM 2020',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Bank Charges',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.CONTAINS,
      value: 'SJD',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Accountancy',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CARD PAYMENT TO UPAY',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Subsistence',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CARD PAYMENT TO KFC',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Subsistence',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CARD PAYMENT TO MCDONALDS',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Subsistence',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.CONTAINS,
      value: 'MEENU FOOD & WINE',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Subsistence',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.CONTAINS,
      value: 'CARD PAYMENT TO HEROKU',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Computer Costs',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.STARTS_WITH,
      value: 'CARD PAYMENT TO UBER',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Travel',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.CONTAINS,
      value: 'GOOGLE',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Computer Costs',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.CONTAINS,
      value: 'WATSI.ORG',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Charitable Donations',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.CONTAINS,
      value: 'AMAZON',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Computer Costs',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.CONTAINS,
      value: 'BOLT',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Travel',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.CONTAINS,
      value: 'COFFEE',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Subsistence',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.CONTAINS,
      value: 'VISION',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Staff Welfare',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.CONTAINS,
      value: 'TRAIN',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Travel',
    },
  },
  {
    condition: {
      type: types.AllocationConditionType.CONTAINS,
      value: 'COACH',
    },
    decision: {
      category: 'Expenses',
      explanation: 'Travel',
    },
  },
]
