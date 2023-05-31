chrome.storage.local.get(['panel_position'], (result) => {
  if (result.panel_position) {
    chrome.devtools.panels.create('Ajax Interceptor', 'images/16.png', 'iframe/index.html', () => {});
  }
});

