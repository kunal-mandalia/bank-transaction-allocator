export type Transaction = {
  id: string,
  description: string,
  isAllocated: boolean
}

export enum AllocationConditionType {
  STARTS_WITH = "STARTS_WITH",
  CONTAINS = "CONTAINS",
}

export type AllocationRule = {
  condition: {
    type: AllocationConditionType,
    value: string
  },
  decision: {
    category: string,
    explanation: string,
  }
}

export type TransactionAllocation = {
  transaction: Transaction,
  isAllocatable: boolean,
  rule?: AllocationRule
}

