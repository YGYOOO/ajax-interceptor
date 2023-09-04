// const elt = document.createElement("script")
// elt.innerHTML = "window.test = 1"
// document.head.appendChild(elt)

// 在页面上插入代码
// const s1 = document.createElement('script')
// s1.setAttribute('type', 'text/javascript')
// s1.setAttribute('src', chrome.runtime.getURL('pageScripts/defaultSettings.js'))
// document.documentElement.appendChild(s1)

// 在页面上插入代码
const script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', chrome.runtime.getURL('pageScripts/main.js'))
document.documentElement.appendChild(script)

script.addEventListener('load', () => {
  chrome.storage.local.get(['ajaxInterceptor_switchOn', 'ajaxInterceptor_rules'], (result) => {
    if (result.hasOwnProperty('ajaxInterceptor_switchOn')) {
      postMessage({type: 'ajaxInterceptor', to: 'pageScript', key: 'ajaxInterceptor_switchOn', value: result.ajaxInterceptor_switchOn})
    }
    if (result.ajaxInterceptor_rules) {
      postMessage({type: 'ajaxInterceptor', to: 'pageScript', key: 'ajaxInterceptor_rules', value: result.ajaxInterceptor_rules})
    }
  })
})


let iframe
let iframeLoaded = false
let isDevtoolPosition = false
chrome.storage.local.get(['customFunction'], (result) => {
  isDevtoolPosition = !!result.customFunction?.panelPosition
  if (!result.customFunction?.panelPosition) {
    if (['complete', 'interactive'].includes(document.readyState)) {
      insertIframe()
    } else {
      document.onreadystatechange = () => {
        if (document.readyState === 'interactive') {
          insertIframe()
        }
      }
    }
  }
})

// 只在最顶层页面嵌入iframe
function insertIframe() {
  if (window.self === window.top) {
    iframe = document.createElement('iframe')
    iframe.className = "api-interceptor"
    iframe.style.setProperty('height', '100%', 'important')
    iframe.style.setProperty('width', '518px', 'important')
    iframe.style.setProperty('min-width', '1px', 'important')
    iframe.style.setProperty('position', 'fixed', 'important')
    iframe.style.setProperty('top', '0', 'important')
    iframe.style.setProperty('right', '0', 'important')
    iframe.style.setProperty('left', 'auto', 'important')
    iframe.style.setProperty('bottom', 'auto', 'important')
    iframe.style.setProperty('z-index', '9999999999999', 'important')
    iframe.style.setProperty('transform', 'translateX(538px)', 'important')
    iframe.style.setProperty('transition', 'all .4s', 'important')
    iframe.style.setProperty('box-shadow', '0 0 15px 2px rgba(0,0,0,0.12)', 'important')
    iframe.frameBorder = "none"
    iframe.src = chrome.runtime.getURL("iframe/index.html")
    document.body.appendChild(iframe)
    let show = false
    chrome.runtime.onMessage.addListener((msg, sender) => {
      if (msg == 'toggle') {
        show = !show
        iframe.style.setProperty('transform', show ? 'translateX(0)' : 'translateX(538px)', 'important')
      }
      return Promise.resolve("Dummy response to keep the console quiet")
    })
  }
}


// 接收background.js传来的信息，转发给pageScript
chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === 'ajaxInterceptor' && msg.to === 'content') {
    if (msg.hasOwnProperty('iframeScriptLoaded')) {
      if (msg.iframeScriptLoaded) iframeLoaded = true
    } else {
      postMessage({...msg, to: 'pageScript'})
    }
  }
})

// 接收pageScript传来的信息，转发给iframe
window.addEventListener("pageScript", function(event) {
  if (iframeLoaded || isDevtoolPosition) {
    chrome.runtime.sendMessage({type: 'ajaxInterceptor', to: 'iframe', ...event.detail})
  } else {
    let count = 0
    const checktLoadedInterval = setInterval(() => {
      if (iframeLoaded) {
        clearInterval(checktLoadedInterval)
        chrome.runtime.sendMessage({type: 'ajaxInterceptor', to: 'iframe', ...event.detail})
      }
      if (count ++ > 500) {
        clearInterval(checktLoadedInterval)
      }
    }, 10)
  }
}, false)

// window.addEventListener("message", function(event) {
// console.log(event.data)
// }, false)

// window.parent.postMessage({ type: "CONTENT", text: "Hello from the webpage!" }, "*")


// var s = document.createElement('script')
// s.setAttribute('type', 'text/javascript')
// s.innerText = `console.log('test')`
// document.documentElement.appendChild(s)

chrome.runtime.sendMessage(chrome.runtime.id, {type: 'ajaxInterceptor', to: 'background', contentScriptLoaded: true})

if (isDevtoolPosition) {
  chrome.runtime.sendMessage(chrome.runtime.id, {type: 'ajaxInterceptor', to: 'iframe', contentScriptLoaded: true})
}
