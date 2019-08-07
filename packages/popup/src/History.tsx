import React from 'react'
import { store } from '@bank-transaction-allocator/common'

import './History.css'

interface IHistory {
  history: store.TransactionHistory[]
}

function getStatusClass(status: store.TransactionHistoryStatus): string {
  switch (status) {
    case store.TransactionHistoryStatus.ALLOCATION_SUCCESSFUL:
      return 'success'

    case store.TransactionHistoryStatus.MANUALLY_ALLOCATED:
      return 'success'

    case store.TransactionHistoryStatus.ALLOCATING:
      return 'inprogress'

    case store.TransactionHistoryStatus.MANUALLY_UNALLOCATED:
      return 'pending'
  
    default:
      return 'default'
  }
}

export const History = ({ history }: IHistory) => {
  return <table>
    <thead>
      <td>
        Status
      </td>
      <td>
        Description
      </td>
      <td>
        Category
      </td>
      <td>
        Explanation
      </td>
      {history.map(h => {
        const statusClass = getStatusClass(h.result)
        return (
          <tr key={h.id}>
            <td className={statusClass}>{h.result}</td>
            <td>{h.description}</td>
            {
              h.rule && (
                <>
                  <td>{h.rule.decision.category}</td>
                  <td>{h.rule.decision.explanation}</td>
                </>
              )
            }
          </tr>
        )
      })}
    </thead>
  </table>
}