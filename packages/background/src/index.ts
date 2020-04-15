import { setupMessageListener, setupTabListener } from './background'
import { store, logger } from '@bank-transaction-allocator/common'

logger.log(`background running`)

async function main() {
  await store.setInitialState()
  logger.log('setting up message listeners')
  await setupMessageListener()
  await setupTabListener()
  logger.log('setup up message listeners complete')

}

main()