// 命名空间
let ajax_interceptor_qoweifjqon = {
  settings: {
    ajaxInterceptor_switchOn: false,
    ajaxInterceptor_always200On: true,
    ajaxInterceptor_rules: [],
  },
  getMatchedItem: ({ thisRequestUrl = '', thisMethod = '' }) => {
    return ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_rules.find(item => {
      const { filterType = 'normal', limitMethod = 'ALL', switchOn = true, match } = item
      const matchedMethod = thisMethod === limitMethod || limitMethod === 'ALL'
      const matchedRequest = (filterType === 'normal' && thisRequestUrl.indexOf(match) > -1) ||
        (filterType === 'regex' && thisRequestUrl.match(new RegExp(match, 'i')))
      return switchOn && matchedMethod && matchedRequest
    })
  },
  getParams: (requestUrl) => {
    if (!requestUrl) {
      return null
    }
    const paramStr = requestUrl.indexOf('?') === -1 ? requestUrl : requestUrl.slice(requestUrl.indexOf('?') + 1)
    const keyValueArr = paramStr.split('&')
    let keyValueObj = {}
    keyValueArr.forEach((item) => {
      // 保证中间不会把=给忽略掉
      const itemArr = item.replace('=', '〓').split('〓')
      const itemObj = { [itemArr[0]]: itemArr[1] }
      keyValueObj = Object.assign(keyValueObj, itemObj)
    })
    return keyValueObj
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
          this._matchedInterface = ajax_interceptor_qoweifjqon.getMatchedItem({
            thisRequestUrl: requestUrl,
            thisMethod: method
          })
          const matchedInterface = this._matchedInterface
          // modify request
          if (matchedInterface) {
            // let { overrideFunc } = matchedInterface
            // try {
            //   overrideFunc = (new Function("args", overrideFunc))
            // } catch (e) {
            //   console.log('eeeeee', e)
            // }
            // args = overrideFunc(args)
            // const { replacementUrl, replacementMethod, headers, requestPayloadText } = matchedInterface
            // if (replacementUrl || replacementMethod || headers || requestPayloadText) {
            //   console.groupCollapsed(`%cMatched XHR Request modified：${matchedInterface.request}`, 'background-color: #fa8c16 color: white padding: 4px')
            //   console.info(`%cOriginal Request Url：`, 'background-color: #ff8040 color: white', requestUrl)
            // }
            // if (matchedInterface.replacementUrl && args[1]) {
            //   args[1] = matchedInterface.replacementUrl
            //   console.info(`%cModified Url：`, 'background-color: #ff8040 color: white', matchedInterface.replacementUrl)
            // }
            // if (matchedInterface.replacementMethod && args[0]) {
            //   args[0] = matchedInterface.replacementMethod
            //   console.info(`%cModified Method：`, 'background-color: #ff8040 color: white', matchedInterface.replacementMethod)
            // }
            // if (matchedInterface.requestPayloadText && args[0] && args[1] && args[0].toUpperCase() === 'GET') {
            //   const queryStringParameters = ajax_tools_space.getRequestParams(args[1])
            //   const data = {
            //     requestUrl: args[1],
            //     queryStringParameters
            //   }
            //   args[1] = ajax_tools_space.executeStringFunction(matchedInterface.requestPayloadText, data)
            //   console.info(`%cModified Request Payload, GET：`, 'background-color: #ff8040 color: white', args[1])
            // }
          }
          xhr.open && xhr.open.apply(xhr, args)
        }
        continue
      } else if (attr === 'send') {
        this.send = (...args) => {
          const matchedInterface = this._matchedInterface
          if (matchedInterface) {
            const [method] = this._openArgs
            if (matchedInterface.overrideFunc && method !== 'GET') { // Not GET
              try {
                const func = (new Function("...args", matchedInterface.overrideFunc))
                args = func(...args)
              } catch (e) {
                console.log('error', e)
              }
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
    return ajax_interceptor_qoweifjqon.originalFetch(...args).then((response) => {
      let txt = undefined
      const requestMethod = args[1]?.method
      ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_rules.forEach(({
                                                                            filterType = 'normal',
                                                                            limitMethod = 'ALL',
                                                                            switchOn = true,
                                                                            match,
                                                                            overrideTxt = ''
                                                                          }) => {
        let matched = false
        if (switchOn && match) {
          if (filterType === 'normal' && response.url.indexOf(match) > -1 && (requestMethod === limitMethod || limitMethod === 'ALL')) {
            matched = true
          } else if (filterType === 'regex' && response.url.match(new RegExp(match, 'i')) && (requestMethod === limitMethod || limitMethod === 'ALL')) {
            matched = true
          }
        }

        if (matched) {
          window.dispatchEvent(new CustomEvent("pageScript", {
            detail: { url: response.url, match }
          }))
          txt = overrideTxt
        }
      })

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

        const newResponse = new Response(stream, {
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
        })
        const proxy = new Proxy(newResponse, {
          get: function (target, name) {
            switch (name) {
              case 'ok':
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
