// const elt = document.createElement("script");
// elt.innerHTML = "window.test = 1"
// document.head.appendChild(elt);

// 在页面上插入代码
// const s1 = document.createElement('script');
// s1.setAttribute('type', 'text/javascript');
// s1.setAttribute('src', chrome.extension.getURL('pageScripts/defaultSettings.js'));
// document.documentElement.appendChild(s1);

// 在页面上插入代码
const s2 = document.createElement('script');
s2.setAttribute('type', 'text/javascript');
s2.setAttribute('src', chrome.extension.getURL('pageScripts/main.js'));
document.documentElement.appendChild(s2);

chrome.storage.local.get(['ajaxInterceptor_switchOn', 'ajaxInterceptor_rules'], (result) => {
  if (result.ajaxInterceptor_switchOn) {
    postMessage({type: 'ajaxInterceptor', to: 'pageScript', key: 'ajaxInterceptor_switchOn', value: result.ajaxInterceptor_switchOn});
  }
  if (result.ajaxInterceptor_rules) {
    postMessage({type: 'ajaxInterceptor', to: 'pageScript', key: 'ajaxInterceptor_rules', value: result.ajaxInterceptor_rules});
  }
});

let iframe;

// 只在最顶层页面嵌入iframe
if (window.self === window.top) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', chrome.extension.getURL('iframe.css'));
  document.documentElement.appendChild(link);

  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      iframe = document.createElement('iframe'); 
      iframe.className = "api-interceptor";
      iframe.style.height = "100%";
      iframe.style.width = "350px";
      iframe.style.position = "fixed";
      iframe.style.top = "0px";
      iframe.style.right = "0px";
      iframe.style.zIndex = "99999999999999";
      iframe.frameBorder = "none"; 
      iframe.src = chrome.extension.getURL("iframe/index.html")
      document.body.appendChild(iframe);
    
      chrome.runtime.onMessage.addListener((msg, sender) => {
        if (msg == 'toggle') {
          iframe.classList.toggle('show');
        }

        return true;
      })
    }
  }
}

// 接收background.js传来的信息，转发给pageScript
chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === 'ajaxInterceptor' && msg.to === 'content') {
    postMessage({...msg, to: 'pageScript'});
  }
});

// 接收pageScript传来的信息，转发给iframe
window.addEventListener("pageScript", function(event) {
  chrome.runtime.sendMessage({type: 'ajaxInterceptor', to: 'iframe', ...event.detail});

}, false);

// window.addEventListener("message", function(event) {
// console.log(event.data)
// }, false);

// window.parent.postMessage({ type: "CONTENT", text: "Hello from the webpage!" }, "*");


// var s = document.createElement('script');
// s.setAttribute('type', 'text/javascript');
// s.innerText = `console.log('test')`;
// document.documentElement.appendChild(s);

