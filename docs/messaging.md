Popup will be the user's control panel.

popup

- (no auto allocationg)
- start allocating transactions: pending transactions & IDLE
- stop allocating transactions: pending transactions && BUSY

- view all pending auto allocations
- filter view of transactions by unallocated, pending auto allocation, cannot be auto allocated
- highlight on screen


messaging flow:

popup GET_TRANSACTIONS: componentDidMount
content listens and responds with { transactions }
popup stores under { transactions }

(popup RESUME_PROCESSING )

popup button "Start" START_ALLOCATING

background listens, sets status to PROCESSING,

background ALLOCATE_TRANSACTION, update storage { history }


  content ---------------------------------- popup ---------------------------------- background
    onload
      .
      .
      READY_FOR_ALLOCATION
        ---------------------------------------------------------> { isViewReady: true, tabId }
        <--------------------------------------------------------- GET_TRANSACTIONS
        ---------------------------------------------------------> receive transactions
        <--------------------------------------------------------- ALLOCATE_TRANSACTION : (pending allocations = true, status = PROCESSING)
      allocateTransaction

      TRANSACTION_ALLOCATED -----------------------------------> { history: [{ ..., didAllocate: true }]}

      page refresh -----------------------------------------> listener detects page refresh { isViewReady: false } : tabId
      .
    &onload


  onload
      .
      .
      READY_FOR_ALLOCATION
        ---------------------------------------------------------> { isViewReady: true, tabId }
        <--------------------------------------------------------- GET_TRANSACTIONS
        ---------------------------------------------------------> receive transactions
                                                                    (pending allocations = true, status = STOPPED)

                                             START_ALLOCATING ----> { status: PROCESSING }, ALLOCATE_TRANSACTION




GET_TRANSACTION:
- transactions
  - allocatable
  - attention
  - allocated
  
map to transaction history?
  yes:
    all transactions -> transactionHistory
      -> order by id DESC as per UI
      -> filterByStatus