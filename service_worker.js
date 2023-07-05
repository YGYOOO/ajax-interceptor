let contentLoadedIds = []
let lastPanelPosition = 0

chrome.scripting.getRegisteredContentScripts({ ids: ["testing-scripts-gen"] },
  async (scripts) => {
    if (scripts && scripts.length) {
      await chrome.scripting.unregisterContentScripts({
        ids: ["testing-scripts-gen"]
      })
    }
    chrome.scripting
      .registerContentScripts([{
        id: "testing-scripts-gen",
        js: ['./content.js'],
        matches: ['<all_urls>'],
        runAt: "document_start",
        allFrames: true
      }])
  }
)

chrome.action.onClicked.addListener(function (tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    handleContentSend(tabs[0].id, "toggle")
  })
})

// 页面关闭，移除id
chrome.tabs.onRemoved.addListener(function (tabId) {
  contentLoadedIds = contentLoadedIds.filter(id => id !== tabId)
})

function handleContentSend(tabId, params = null) {
  if (contentLoadedIds.includes(tabId)) {
    chrome.tabs.sendMessage(tabId, params)
  } else {
    chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      files: ['content.js']
    }).then(() => {
      chrome.tabs.sendMessage(tabId, params)
    })
  }
}

// 接收iframe传来的信息，转发给content.js
chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === 'ajaxInterceptor' && msg.to === 'background') {
    if (msg.hasOwnProperty('contentScriptLoaded')) {
      msg.contentScriptLoaded && chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        tabs && tabs.length && !contentLoadedIds.includes(tabs[0].id) && contentLoadedIds.push(tabs[0].id)
      })
      // 收到的传送信息是contentScriptLoaded，说明是刷新状态，更新popup
      chrome.storage.local.get(['customFunction'], (result) => {
        lastPanelPosition = !!result.customFunction?.panelPosition
        setPopup(!!result.customFunction?.panelPosition)
      })
    }
    if (msg.key === 'ajaxInterceptor_switchOn') {
      if (msg.value === true) {
        chrome.action.setIcon({
          path: {
            16: '/images/16.png',
            32: '/images/32.png',
            48: '/images/48.png',
            128: '/images/128.png',
          }
        })
      } else {
        chrome.action.setIcon({
          path: {
            16: '/images/16_gray.png',
            32: '/images/32_gray.png',
            48: '/images/48_gray.png',
            128: '/images/128_gray.png',
          }
        })
      }
    }
    if (msg.key === 'customFunction') {
      setPopup(msg.value.panelPosition)
    }
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs.length) {
        handleContentSend(tabs[0].id, { ...msg, to: 'content' })
      } else if (msg.hasOwnProperty('iframeScriptLoaded')) {
        // 收到的传送信息是iframeScriptLoaded，说明是suspend刷新状态，提示需要在页面上刷新（只有在suspend时才会有此类情况）
        console.warn("[Ajax Modifier] To make the Ajax Modifier work, please do not refresh on devtools.")
      } else if (msg.key === "ajaxInterceptor_rules" || msg.key === 'ajaxInterceptor_switchOn') {
        // 收到的传送信息是修改rules且拿不到tab，说明内容也更新不到page script上，提示需要刷新（只有在分离的devtools时才会有此类情况）
        chrome.runtime.sendMessage(chrome.runtime.id, {type: 'ajaxInterceptor', to: 'iframe', showFreshTip: true})
      }
    })
  }
})

chrome.storage.local.get(['ajaxInterceptor_switchOn', 'ajaxInterceptor_rules', 'customFunction'], (result) => {
  if (result.hasOwnProperty('ajaxInterceptor_switchOn')) {
    if (result.ajaxInterceptor_switchOn) {
      chrome.action.setIcon({ path: "/images/16.png" })
    } else {
      chrome.action.setIcon({ path: "/images/16_gray.png" })
    }
  }
})

function setPopup(curPanelPosition = false) {
  // panelPosition - 0:页面悬浮面板, 1:devTools
  // 面板从devtools切换为悬浮，提示需要刷新
  if (lastPanelPosition && !curPanelPosition) {
    chrome.action.setPopup({ popup: 'popupSusFresh.html' })
  } else {   // 其他情况，判断当前是devtools，则提示打开devtools
    chrome.action.setPopup({ popup: curPanelPosition ? 'popupDev.html' : '' })
  }
  // 面板从悬浮切换为devtools，悬浮面板消失
  if (!lastPanelPosition && curPanelPosition) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      handleContentSend(tabs[0].id, "toggle")
    })
  }
  lastPanelPosition = curPanelPosition
}