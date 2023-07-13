// 命名空间
let ajax_interceptor_qoweifjqon = {
  settings: {
    ajaxInterceptor_switchOn: false,
    ajaxInterceptor_always200On: false,
    ajaxInterceptor_rules: [],
  },
  getMatchedInterface: ({ thisRequestUrl = '', thisMethod = '' }) => {
    return ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_rules.find(item => {
      const { filterType = 'normal', limitMethod = 'ALL', switchOn = true, match } = item
      const matchedMethod = thisMethod === limitMethod || limitMethod === 'ALL'
      const matchedRequest = (filterType === 'normal' && thisRequestUrl.indexOf(match) > -1) ||
        (filterType === 'regex' && thisRequestUrl.match(new RegExp(match, 'i')))
      return switchOn && matchedMethod && matchedRequest
    })
  },
  executeStringFunction: (stringFunction, args, funcName = '') => {
    try {
      stringFunction = (new Function('...args', stringFunction))(args)
    } catch (e) {
      console.error(`[Ajax Modifier] ExecuteFunctionError: Please check the ${funcName} function.\n`, e)
    }
    return stringFunction;
  },
  getRequestParams: (requestUrl) => {
    if (!requestUrl) {
      return null;
    }
    const paramStr = requestUrl.split('?').pop();
    const keyValueArr = paramStr.split('&');
    let keyValueObj = {};
    keyValueArr.forEach((item) => {
      // 保证中间不会把=给忽略掉
      const itemArr = item.replace('=', '〓').split('〓');
      const itemObj = {[itemArr[0]]: itemArr[1]};
      keyValueObj = Object.assign(keyValueObj, itemObj);
    });
    return keyValueObj;
  },
  originalXHR: window.XMLHttpRequest,
  myXHR: function () {
    let pageScriptEventDispatched = false
    const modifyResponse = () => {
      // const [method, requestUrl] = this._openArgs
      // const queryStringParameters = ajax_tools_space.getRequestParams(requestUrl)
      // const [requestPayload] = this._sendArgs
      const matchedInterface = this._matchedInterface
      if (matchedInterface && matchedInterface.overrideTxt) {
        const { overrideTxt, match } = matchedInterface
        this.responseText = overrideTxt
        this.response = overrideTxt
        if (!pageScriptEventDispatched) {
          window.dispatchEvent(new CustomEvent("pageScript", {
            detail: { url: this.responseURL, match }
          }))
          pageScriptEventDispatched = true
        }
        if (ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_always200On && this.status !== 200) {
          this.status = 200
        }
      }
    }

    const xhr = new ajax_interceptor_qoweifjqon.originalXHR
    for (let attr in xhr) {
      if (attr === 'onreadystatechange') {
        xhr.onreadystatechange = (...args) => {
          if (this.readyState === 4) {
            // 请求成功
            modifyResponse()
          }
          this.onreadystatechange && this.onreadystatechange.apply(this, args)
        }
        this.onreadystatechange = null
        continue
      } else if (attr === 'onload') {
        xhr.onload = (...args) => {
          // 请求成功
          modifyResponse()
          this.onload && this.onload.apply(this, args)
        }
        this.onload = null
        continue
      } else if (attr === 'open') {
        this.open = (...args) => {
          this._openArgs = args
          const [method, requestUrl] = args
          this._matchedInterface = ajax_interceptor_qoweifjqon.getMatchedInterface({
            thisRequestUrl: requestUrl,
            thisMethod: method
          })
          const matchedInterface = this._matchedInterface
          // modify request
          if (matchedInterface) {
            const { overridePayloadFunc, match } = matchedInterface
            if (overridePayloadFunc && args[0] && args[1] && args[0].toUpperCase() === 'GET') {
              const queryStringParameters = ajax_interceptor_qoweifjqon.getRequestParams(args[1])
              const data = {
                requestUrl: args[1],
                queryStringParameters
              }
              args[1] = ajax_interceptor_qoweifjqon.executeStringFunction(overridePayloadFunc, data, 'payload')
            }
          }
          xhr.open && xhr.open.apply(xhr, args)
        }
        continue
      } else if (attr === 'setRequestHeader') {
        this.setRequestHeader = (...args) => {
          // get headers
          this._headerArgs = this._headerArgs ? Object.assign(this._headerArgs, {[args[0]]: args[1]}) : {[args[0]]: args[1]};
          const matchedInterface = this._matchedInterface;
          if (!(matchedInterface && matchedInterface.overrideHeadersFunc)) { // 没有要拦截修改或添加的header
            xhr.setRequestHeader && xhr.setRequestHeader.apply(xhr, args);
          }
        }
        continue;
      } else if (attr === 'send') {
        this.send = (...args) => {
          const matchedInterface = this._matchedInterface
          if (matchedInterface) {
            // modify headers
            const { overrideHeadersFunc, overridePayloadFunc } = matchedInterface
            if (overrideHeadersFunc) {
              const headers = ajax_interceptor_qoweifjqon.executeStringFunction(overrideHeadersFunc, this._headerArgs, 'headers')
              Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader && xhr.setRequestHeader.apply(xhr, [key, headers[key]]);
              })
            }
            // modify not GET payload
            const [method] = this._openArgs
            if (overridePayloadFunc && method !== 'GET') {
              args[0] = ajax_interceptor_qoweifjqon.executeStringFunction(overridePayloadFunc, args[0], 'payload');
            }
          }
          // this._sendArgs = args
          xhr.send && xhr.send.apply(xhr, args)
        }
        continue
      }

      if (typeof xhr[attr] === 'function') {
        this[attr] = xhr[attr].bind(xhr)
      } else {
        // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
        if (['responseText', 'response', 'status'].includes(attr)) {
          Object.defineProperty(this, attr, {
            get: () => this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
            set: (val) => this[`_${attr}`] = val,
            enumerable: true
          })
        } else {
          Object.defineProperty(this, attr, {
            get: () => xhr[attr],
            set: (val) => xhr[attr] = val,
            enumerable: true
          })
        }
      }
    }
  },
  originalFetch: window.fetch.bind(window),
  myFetch: function (...args) {
    const [requestUrl, data] = args;
    const matchedInterface = ajax_interceptor_qoweifjqon.getMatchedInterface({thisRequestUrl: requestUrl, thisMethod: data && data.method});
    if (matchedInterface && args) {
      const { overrideHeadersFunc, overridePayloadFunc } = matchedInterface;
      if (overrideHeadersFunc && args[1]) {
        const headers = ajax_interceptor_qoweifjqon.executeStringFunction(overrideHeadersFunc, this._headerArgs, 'headers')
        args[1].headers = headers
      }
      if (overridePayloadFunc && args[0] && args[1]) {
        const { method } = args[1]
        if (['GET', 'HEAD'].includes(method.toUpperCase())) {
          const queryStringParameters = ajax_interceptor_qoweifjqon.getRequestParams(args[0]);
          const data = {
            requestUrl: args[0],
            queryStringParameters
          }
          args[0] = ajax_interceptor_qoweifjqon.executeStringFunction(overridePayloadFunc, data);
        } else {
          data.body = ajax_interceptor_qoweifjqon.executeStringFunction(overridePayloadFunc, data.body);
        }
      }
    }
    return ajax_interceptor_qoweifjqon.originalFetch(...args).then((response) => {
      let txt = undefined
      if (matchedInterface && matchedInterface.overrideTxt) {
        window.dispatchEvent(new CustomEvent("pageScript", {
          detail: { url: response.url, match: matchedInterface.match }
        }))
        txt = matchedInterface.overrideTxt
      }

      if (txt !== undefined) {
        const stream = new ReadableStream({
          start(controller) {
            // const bufView = new Uint8Array(new ArrayBuffer(txt.length))
            // for (var i = 0 i < txt.length i++) {
            //   bufView[i] = txt.charCodeAt(i)
            // }
            controller.enqueue(new TextEncoder().encode(txt))
            controller.close()
          }
        })
        let always200OnResponseParams = {}
        if (ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_always200On) {
          always200OnResponseParams = {
            status: 200,
            statusText: 'OK',
            ok: true
          }
        }
        const newResponse = new Response(stream, {
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          ...always200OnResponseParams
        })
        const proxy = new Proxy(newResponse, {
          get: function (target, name) {
            switch (name) {
              case 'redirected':
              case 'type':
              case 'url':
              case 'useFinalURL':
              case 'body':
              case 'bodyUsed':
                return response[name]
            }
            return target[name]
          }
        })

        for (let key in proxy) {
          if (typeof proxy[key] === 'function') {
            proxy[key] = proxy[key].bind(newResponse)
          }
        }

        return proxy
      } else {
        return response
      }
    })
  },
}

window.addEventListener("message", function (event) {
  const data = event.data

  if (data.type === 'ajaxInterceptor' && data.to === 'pageScript') {
    ajax_interceptor_qoweifjqon.settings[data.key] = data.value
  }

  if (ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_switchOn) {
    window.XMLHttpRequest = ajax_interceptor_qoweifjqon.myXHR
    window.fetch = ajax_interceptor_qoweifjqon.myFetch
  } else {
    window.XMLHttpRequest = ajax_interceptor_qoweifjqon.originalXHR
    window.fetch = ajax_interceptor_qoweifjqon.originalFetch
  }
}, false)
