export function setChromeStorage(key, value) {
  // 发送给background.js
  chrome.runtime.sendMessage(chrome.runtime.id, { type: 'ajaxInterceptor', to: 'background', key, value })
  chrome.storage && chrome.storage.local.set({ [key]: value })
}