define(function(require) {
  var port = chrome.extension.connect({
    name: 'devtools'
  });
  port.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
  });
  return port;
});