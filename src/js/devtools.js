(function() {
  chrome.devtools.panels.create('Lavaca', 'img/icon-144x144.png', 'src/html/panel.html', function(panel) {
    var port = chrome.extension.connect({
          name: 'devtools'
        });
    port.postMessage({
      action: 'init',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  });
  
})();