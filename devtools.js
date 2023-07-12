chrome.storage.local.get(['customFunction'], (result) => {
  if (result.customFunction?.panelPosition) {
    chrome.devtools.panels.create('Ajax Modifier', 'images/16.png', 'iframe/index.html', () => {})
  }
})

