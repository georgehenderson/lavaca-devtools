define(function(require) {
  var Controller = require('lavaca/mvc/Controller');
  var HomeView = require('panel/ui/views/HomeView');
  var viewsCollection = require('panel/models/ViewsCollection');
  var port = require('panel/net/port');

  var HomeController = Controller.extend({
    index: function() {
      port.postMessage({action: 'getViews'});
      return this.view(null, HomeView, viewsCollection);
    }
  });
  return HomeController;
});