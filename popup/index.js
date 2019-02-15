var popupWindow = window.open(
  chrome.extension.getURL("popup/pane.html"),
  "exampleName",
  "width=300,height=600"
);


window.addEventListener("message", function(event) {
  console.log(event.data)
  chrome.tabs && chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.executeScript(
      tabs[0].id,
      {code: `postMessage(${JSON.stringify(event.data)})`});
  });
}, false);