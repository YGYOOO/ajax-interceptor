
const settings = {
  ajaxInterceptor_switchOn: false,
  ajaxInterceptor_rules: [],
};

const originalXHR = window.XMLHttpRequest;

const myXHR = function() {
  let pageScriptEventDispatched = false;
  const modifyResponse = () => {
    settings.ajaxInterceptor_rules.forEach(({match, overrideTxt = ''}) => {
      if (match && RegExp(match).test(this.responseURL)) {
        this.responseText = overrideTxt;
        this.response = overrideTxt;
        
        if (!pageScriptEventDispatched) {
          window.dispatchEvent(new CustomEvent("pageScript", {
            detail: {url: this.responseURL, match}
          }));
          pageScriptEventDispatched = true;
        }
      }
    })
  }
  
  const xhr = new originalXHR;
  for (let attr in xhr) {
    if (attr === 'onreadystatechange') {
      xhr.onreadystatechange = (...args) => {
        if (this.onreadystatechange) {
          if (this.readyState == 4) {
            // 请求成功
            if (settings.ajaxInterceptor_switchOn) {
              // 开启拦截
              modifyResponse();
            }
          }
          this.onreadystatechange && this.onreadystatechange.apply(this, args);
        }
      }
      continue;
    } else if (attr === 'onload') {
      xhr.onload = (...args) => {
        // 请求成功
        if (settings.ajaxInterceptor_switchOn) {
          // 开启拦截
          modifyResponse();
        }
        this.onload && this.onload.apply(this, args);
      }
      continue;
    }

    if (typeof xhr[attr] === 'function') {
      this[attr] = xhr[attr].bind(xhr);
    } else {
      // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
      if (attr === 'responseText' || attr === 'response') {
        Object.defineProperty(this, attr, {
          get: () => this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
          set: (val) => this[`_${attr}`] = val,
          enumerable: true
        });
      } else {
        Object.defineProperty(this, attr, {
          get: () => xhr[attr],
          set: (val) => xhr[attr] = val,
          enumerable: true
        });
      }
    }
  }
}


window.addEventListener("message", function(event) {
  const data = event.data;
  if (data.type === 'ajaxInterceptor' && data.to === 'pageScript') {
    settings[data.key] = data.value;
  }

  if (settings.ajaxInterceptor_switchOn) {
    window.XMLHttpRequest = myXHR;
  } else {
    window.XMLHttpRequest = originalXHR;
  }
}, false);