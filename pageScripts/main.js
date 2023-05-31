
// 命名空间
let ajax_interceptor_qoweifjqon = {
  settings: {
    ajaxInterceptor_switchOn: false,
    ajaxInterceptor_rules: [],
    // panel_position: 0 // 0:页面悬浮面板, 1:devTools
  },
  originalXHR: window.XMLHttpRequest,
  myXHR: function() {
    let requestMethod = undefined;
    function initXMLHttpRequest() {
      let open = ajax_interceptor_qoweifjqon.originalXHR.prototype.open;
      ajax_interceptor_qoweifjqon.originalXHR.prototype.open = function (...args) {
        // 请求前拦截
        modifyBefore(args)
        return open.apply(this, args);
      }
    }
    const modifyBefore = (args) => {
      // 抛出请求的method
      requestMethod = args[0];
    }
    initXMLHttpRequest()

    let pageScriptEventDispatched = false;
    const modifyResponse = () => {
      ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_rules.forEach(({filterType = 'normal', limitMethod = 'ALL', switchOn = true, match, overrideTxt = ''}) => {
        let matched = false;
        if (switchOn && match) {
          if (filterType === 'normal' && this.responseURL.indexOf(match) > -1 && (requestMethod === limitMethod || limitMethod === 'ALL')) {
            matched = true;
          } else if (filterType === 'regex' && this.responseURL.match(new RegExp(match, 'i')) && (requestMethod === limitMethod || limitMethod === 'ALL')) {
            matched = true;
          }
        }
        if (matched) {
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

    const xhr = new ajax_interceptor_qoweifjqon.originalXHR;
    for (let attr in xhr) {
      if (attr === 'onreadystatechange') {
        xhr.onreadystatechange = (...args) => {
          if (this.readyState == 4) {
            // 请求成功
            if (ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_switchOn) {
              // 开启拦截
              modifyResponse();
            }
          }
          this.onreadystatechange && this.onreadystatechange.apply(this, args);
        }

        this.onreadystatechange = null;
        continue;
      } else if (attr === 'onload') {
        xhr.onload = (...args) => {
          // 请求成功
          if (ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_switchOn) {
            // 开启拦截
            modifyResponse();
          }
          this.onload && this.onload.apply(this, args);
        }

        this.onload = null;
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
  },

  originalFetch: window.fetch.bind(window),
  myFetch: function(...args) {
    return ajax_interceptor_qoweifjqon.originalFetch(...args).then((response) => {
      let txt = undefined;
      const requestMethod = args[1]?.method;
      ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_rules.forEach(({filterType = 'normal', limitMethod = 'ALL', switchOn = true, match, overrideTxt = ''}) => {
        let matched = false;
        if (switchOn && match) {
          if (filterType === 'normal' && response.url.indexOf(match) > -1 && (requestMethod === limitMethod || limitMethod === 'ALL')) {
            matched = true;
          } else if (filterType === 'regex' && response.url.match(new RegExp(match, 'i')) && (requestMethod === limitMethod || limitMethod === 'ALL')) {
            matched = true;
          }
        }

        if (matched) {
          window.dispatchEvent(new CustomEvent("pageScript", {
            detail: {url: response.url, match}
          }));
          txt = overrideTxt;
        }
      });

      if (txt !== undefined) {
        const stream = new ReadableStream({
          start(controller) {
            // const bufView = new Uint8Array(new ArrayBuffer(txt.length));
            // for (var i = 0; i < txt.length; i++) {
            //   bufView[i] = txt.charCodeAt(i);
            // }
            controller.enqueue(new TextEncoder().encode(txt));
            controller.close();
          }
        });

        const newResponse = new Response(stream, {
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
        });
        const proxy = new Proxy(newResponse, {
          get: function(target, name){
            switch(name) {
              case 'ok':
              case 'redirected':
              case 'type':
              case 'url':
              case 'useFinalURL':
              case 'body':
              case 'bodyUsed':
                return response[name];
            }
            return target[name];
          }
        });

        for (let key in proxy) {
          if (typeof proxy[key] === 'function') {
            proxy[key] = proxy[key].bind(newResponse);
          }
        }

        return proxy;
      } else {
        return response;
      }
    });
  },
}

window.addEventListener("message", function(event) {
  const data = event.data;

  if (data.type === 'ajaxInterceptor' && data.to === 'pageScript') {
    ajax_interceptor_qoweifjqon.settings[data.key] = data.value;
  }

  if (ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_switchOn) {
    window.XMLHttpRequest = ajax_interceptor_qoweifjqon.myXHR;
    window.fetch = ajax_interceptor_qoweifjqon.myFetch;
  } else {
    window.XMLHttpRequest = ajax_interceptor_qoweifjqon.originalXHR;
    window.fetch = ajax_interceptor_qoweifjqon.originalFetch;
  }
}, false);
