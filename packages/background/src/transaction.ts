import { types } from '@bank-transaction-allocator/common'

import {
  AllocationRule,
  Transaction,
  TransactionAllocation
} from './types'

function applicableRule(description: string, rule: AllocationRule): AllocationRule | null {
  switch (rule.condition.type) {
    case types.AllocationConditionType.CONTAINS:
      if (description.includes(rule.condition.value)) {
        return rule
      }
      return null

    case types.AllocationConditionType.STARTS_WITH:
      if (description.startsWith(rule.condition.value)) {
        return rule
      }
      return null

    default:
      return null
  }
}

function isUnallocated(transaction: Transaction): boolean {
  return transaction.isAllocated === false
}

export function getTransactionAllocations(input: {
  transactions: Array<Transaction>,
  rules: Array<AllocationRule>,
}, ): Array<TransactionAllocation> {
  const { transactions, rules } = input
  return transactions.reduce((acc, cur): Array<TransactionAllocation> => {
    for (let i = 0; i < rules.length; i++) {
      const rule = applicableRule(cur.description, rules[i])
      if (isUnallocated(cur) && rule) {
        acc.push({
          transaction: cur,
          isAllocatable: true,
          rule
        })
        return acc
      }
    }
    acc.push({
      transaction: cur,
      isAllocatable: false
    })
    return acc
  }, [])
}