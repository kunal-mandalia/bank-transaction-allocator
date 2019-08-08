import React from 'react'
import { types } from '@bank-transaction-allocator/common'

interface IUpcoming {
  allocations: types.TransactionAllocation[] 
}

export const Upcoming = ({ allocations } : IUpcoming) => {
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
      {allocations.map(a => (
        <tr key={a.transaction.id}>
          <td className='upcoming'>UPCOMING</td>
          <td>{a.transaction.description}</td>
          {
            a.rule && (
              <>
              <td>{a.rule.decision.category}</td>
              <td>{a.rule.decision.explanation}</td>
              </>
            )
          }
        </tr>
      ))}
    </thead>
  </table>
}