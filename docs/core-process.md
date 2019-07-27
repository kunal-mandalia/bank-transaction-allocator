AutomateAllocation

Goal: allocate known bank transactions

Challenge: handling page refresh

Architecture:

Cypress.js or Chrome extension are viable alternatives as they allow content to be controlled irrespective of page state e.g. whether the website reloading.

Chrome extension:

content.js
background.js
popup.js

background.js
```
state:
  {
    status: enum{ IDLE, PROCESSING },
    history: {
      [urn]: {
        status: enum{ ALLOCATE_START, ALLOCATE_ERROR, ALLOCATE_SUCCESS },
        timestamp: number
      }
    },
    transactions: [
      {
        urn: number,
        description: string,
        allocation: {
          re: RegEx,
          category: string,
          explanation: string
        }
      }
    ]
  }
```

content.js
  ---> send message { type: 'DEFINE_TRANSACTIONS', payload: object }

background.js
  ---> handles message DEFINE_TRANSACTIONS
       ---> sets unallocated transactions
       ---> if status === PROCESSING
            ---> send message { type: 'ALLOCATE_TRANSACTION', payload: { urn: number, allocation } }

content.js
  ---> handles message ALLOCATE_TRANSACTION
        ---> find transaction by urn, allocate
        ---> send message { type: 'ALLOCATION_SUCCESS', payload: { urn }}
        ---> reloads webpage

background.js
  ---> handles message ALLOCATION_SUCCESS
      ---> updates history of urn to ALLOCATE_SUCCESS