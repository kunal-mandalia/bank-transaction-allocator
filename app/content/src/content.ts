type Config = {
  enablePopup: Boolean
}

export async function main(config: Config): Promise<boolean> {
  chrome.runtime.sendMessage({ "message": "activate_icon" })
  console.log(`send message to enable popup`)
  return Promise.resolve(true)
}

export default {
  main
}