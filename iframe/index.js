import React from 'react';
import ReactDOM from 'react-dom';

import Main from './Main';


if (chrome.storage) {
  chrome.storage.local.get(['ajaxInterceptor_switchOn', 'ajaxInterceptor_rules'], (result) => {
    // if (result.ajaxInterceptor_switchOn) {
    //   this.set('ajaxInterceptor_switchOn', result.ajaxInterceptor_switchOn, false);
    // }
    // if (result.ajaxInterceptor_rules) {
    //   this.set('ajaxInterceptor_rules', result.ajaxInterceptor_rules, false);
    // }
    window.setting = result;
  
    ReactDOM.render(
      <Main />,
      document.getElementById('main')
    );
  });
} else {
  window.setting = {
    ajaxInterceptor_switchOn: false,
    ajaxInterceptor_rules: [],
  };
  // 测试环境
  ReactDOM.render(
    <Main />,
    document.getElementById('main')
  );
}