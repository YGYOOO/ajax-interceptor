// chrome.runtime.onInstalled.addListener(function() {
//   chrome.storage.sync.set({color: '#3aa757'}, function() {
//     console.log('The color is green.');
//   });
//   chrome.runtime.onInstalled.addListener(function(details) {
//     chrome.declarativeContent.onPageChanged.addRules([{
//       conditions: [new chrome.declarativeContent.PageStateMatcher({
//         pageUrl: {hostEquals: 'developer.chrome.com'},
//       })
//       ],
//           actions: [new chrome.declarativeContent.ShowPageAction()]
//     }]);
//   });
// });


// chrome.webNavigation.onBeforeNavigate.addListener(() => {
//   console.log(1)
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//       tabs[0].id,
//       {code: `console.log('executeScript')`});
//   });
// });

// chrome.webRequest.onBeforeRequest.addListener(
//   function(info) {   
//     console.log("Cat intercepted: " + info.url);
//     // Redirect the lolcal request to a random loldog URL.
//     chrome.tabs.sendMessage(details.tabId, details, function(response) {
//       // 此处可以修改response...
//       redirectUrl = "data:application/json;charset=UTF-8;base64," + Base64.encode(newResponse)
//   });
//     return  ({cancel: false});
// },
// ({
//     urls: ["*://*/*"],
//     types: ["script"]
// }),
// ["blocking"]);
console.log(0)
chrome.browserAction.onClicked.addListener(function(tab) {
  console.log(1111)
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, "toggle");
  })
});
