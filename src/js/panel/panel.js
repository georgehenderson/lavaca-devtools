define(function(require) {
  var Application = require('lavaca/ui/DustTemplate');
  var Application = require('lavaca/mvc/Application');
  var viewsCollection = require('panel/models/ViewsCollection');
  var HomeController = require('panel/net/HomeController');

  return new Application(function() {
    this.router.add({
      '/': [HomeController, 'index']
    });

    var port = chrome.extension.connect({
      name: "devtools"
    });
    port.onMessage.addListener(function (msg) {
      viewsCollection.clearModels();
      viewsCollection.add(msg.message.views);
    });
    port.postMessage({action: 'getViews'});
  });
});