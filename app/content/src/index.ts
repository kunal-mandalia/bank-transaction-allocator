console.log('content script running')

const load = (async () => {
  console.log('loading content.js')
  const src = chrome.extension.getURL("content/content.js")
  console.log(`loading src ${src}`)
  const content = await import(src)
  await content.main()
})()