console.log('content script loaded');

// log = console.log;
// console = {
//   ...console,
//   log: (...args) => {
//     log('Intercept:', ...args);
//   }
// }
// chrome.storage.sync.get(['open'], function(result) {
//   console.log('Value currently is ' + result.key);
// });


const settings = {
  ajaxInterceptor_switchOn: false,
  ajaxInterceptor_rules: [],
};


const originalXHR = window.XMLHttpRequest;

const overrideXMLHttpRequest = () => {
  window.XMLHttpRequest = function() {
    const that = this;
    const xhr = new originalXHR;
    for (let attr in xhr) {
      if (attr === 'onreadystatechange') {
        xhr.onreadystatechange = function(...args) {
          if (that.onreadystatechange) {
            if (this.readyState == 4) {
              // 请求成功
              if (settings.ajaxInterceptor_switchOn) {
                // 开启拦截
                settings.ajaxInterceptor_rules.forEach(({match, overrideTxt}) => {
                  if (RegExp(match).test(that.responseURL)) {
                    that.responseText = overrideTxt;
                  }
                })
              }
  
              that.onreadystatechange.apply(that, args);
            } else {
              that.onreadystatechange.apply(that, args);
            }
          }
        }
        continue;
      }
  
      var type = '';
      try {
        type = typeof xhr[attr]
      } catch (e) {}
      if (type === 'function') {
        this[attr] = xhr[attr].bind(xhr);
      } else {
        Object.defineProperty(this, attr, {
          get: () => this[`_${attr}`] || xhr[attr],
          set: (val) => {
            this[`_${attr}`] = val;
          }
        })
        // this[attr] = xhr[attr];
      }
    }
  }
}

window.addEventListener("message", function(event) {
  const data = event.data;
  if (data.type === 'ajaxInterceptor') {
    settings[data.key] = data.value;
  }

  if (settings.ajaxInterceptor_switchOn) {
    overrideXMLHttpRequest();
  } else {
    window.XMLHttpRequest = originalXHR;
  }
}, false);