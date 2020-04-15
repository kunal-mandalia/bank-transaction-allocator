import { main } from './content'
import {
  logger
} from "@bank-transaction-allocator/common/dist/index";

logger.log('content script running')

window.addEventListener('load', async () => {
  await main({ enablePopup: true })
})