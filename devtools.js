chrome.storage.local.get(['customFunction'], (result) => {
  if (result.customFunction?.panelPosition) {
    chrome.devtools.panels.create('Ajax Interceptor', 'images/16.png', 'iframe/index.html', () => {});
  }
});

