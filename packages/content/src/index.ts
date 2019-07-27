import { main } from './content'

console.log('content script running')

window.addEventListener('load', async () => {
  await main({ enablePopup: true })
})