import React from 'react'
import ReactDOM from 'react-dom'

import Main from './Main'

const DEFAULT_SETTING = {
  ajaxInterceptor_switchOn: false,
  ajaxInterceptor_rules: [],
  customFunction: {
    panelPosition: 0,  // 0:页面悬浮面板, 1:devTools
  }
}

if (chrome.storage) {
  chrome.storage.local.get(['ajaxInterceptor_switchOn', 'ajaxInterceptor_rules', 'customFunction'], (result) => {
    // if (result.ajaxInterceptor_switchOn) {
    //   this.set('ajaxInterceptor_switchOn', result.ajaxInterceptor_switchOn, false)
    // }
    // if (result.ajaxInterceptor_rules) {
    //   this.set('ajaxInterceptor_rules', result.ajaxInterceptor_rules, false)
    // }
    window.setting = {
      ...DEFAULT_SETTING,
      ...result,
    }

    ReactDOM.render(
      <Main/>,
      document.getElementById('main')
    )
  })
} else {
  window.setting = DEFAULT_SETTING
  // 测试环境
  ReactDOM.render(
    <Main/>,
    document.getElementById('main')
  )
}