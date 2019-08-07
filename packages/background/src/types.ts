export declare type Transaction = {
  id: string;
  description: string;
  isAllocated: boolean;
};
export declare enum AllocationConditionType {
  STARTS_WITH = "STARTS_WITH",
  CONTAINS = "CONTAINS"
}
export declare type AllocationRule = {
  condition: {
      type: AllocationConditionType;
      value: string;
  };
  decision: {
      category: string;
      explanation: string;
  };
};
export declare type TransactionAllocation = {
  transaction: Transaction;
  isAllocatable: boolean;
  rule?: AllocationRule;
};
