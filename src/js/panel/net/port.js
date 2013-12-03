define(function(require) {
  var port = chrome.runtime.connect({
    name: 'panel'
  });
  port.postMessage({
      action: 'init',
      tabId: chrome.devtools.inspectedWindow.tabId
  });
  port.onMessage.addListener(function(msg) {
    if (msg.action === 'refresh') {
      window.location.href = chrome.extension.getURL('src/html/panel.html');
    }
  });
  return port;
});