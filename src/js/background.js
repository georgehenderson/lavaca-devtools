var connections = {},
    currentUrl;

chrome.runtime.onConnect.addListener(function (port) {

  var extensionListener = function (message, sender, sendResponse) {
    // The original connection event doesn't include the tab ID of the
    // DevTools page, so we need to send it explicitly.
    var respond = function (tabId, changeInfo, tab) {
      var tabs = Object.keys(connections);
      if (tabs.indexOf(tabId+'') === -1) {
        return;
      }
      if (tab.url.indexOf(currentUrl) === -1) {
        currentUrl = null;
        port.postMessage({action: 'refresh'});
      }
    };
    if (port.name === 'devtools' && message.action === 'init') {
      connections[message.tabId] = port;
      chrome.tabs.sendMessage(message.tabId, message);
    } else if (port.name === 'panel' && message.action === 'init') {
      connections[message.tabId] = port;
      chrome.tabs.sendMessage(message.tabId, message);
      chrome.tabs.onUpdated.addListener(respond);
      port.onDisconnect.addListener(function(port) {
        port.onMessage.removeListener(extensionListener);
        chrome.tabs.onUpdated.removeListener(respond);
        var tabs = Object.keys(connections);
        for (var i = 0, len = tabs.length; i < len; i++) {
          if (connections[tabs[i]] === port) {
            delete connections[tabs[i]];
            break;
          }
        }
      });
    } else {
      chrome.tabs.query({
        active: true,
        currentWindow: true,
      }, function (tabs) {
        currentUrl = tabs[0].url.split('#')[0];
        chrome.tabs.sendMessage(tabs[0].id, message);
      });
    }
  };

  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(extensionListener);
});

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Messages from content scripts should have sender.tab set
    if (sender.tab) {
      var tabId = sender.tab.id;
      if (tabId in connections) {
        connections[tabId].postMessage(request);
      } else {
        console.log('Tab not found in connection list.');
      }
    } else {
      console.log('sender.tab not defined.');
    }
    return true;
});
