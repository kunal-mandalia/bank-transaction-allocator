import { setupMessageListener, setupTabListener } from './background'
import { store } from '@bank-transaction-allocator/common'

console.log(`background running`)

async function main() {
  await store.setInitialState()
  console.log('setting up message listeners')
  await setupMessageListener()
  await setupTabListener()
  console.log('setup up message listeners complete')

}

main()