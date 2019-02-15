// chrome.storage.sync.set({open: true});

localStorage.setItem('api-interceptor_open', 'true');


window.top.postMessage({ type: "IFRAME", text: "123!" }, "*");
