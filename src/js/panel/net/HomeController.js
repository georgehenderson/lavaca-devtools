define(function(require) {
  var BaseController = require('panel/net/BaseController');
  var HomeView = require('panel/ui/views/HomeView');
  var OptionsView = require('panel/ui/views/OptionsView');
  var viewsCollection = require('panel/models/ViewsCollection');
  var port = require('panel/net/port');
  var Model = require('lavaca/mvc/Model');

  var HomeController = BaseController.extend({
    index: function(params, history) {
      port.postMessage({action: 'getViews'});
      port.postMessage({action: 'getNamespace'});
      port.postMessage({action: 'isPanelActive'});
      return this.view(null, HomeView, viewsCollection)
        .then(this.updateState(history, 'Views', params.url));
    },
    options: function(params, history) {
      port.postMessage({action: 'getNamespace'});
      var model = new Model();
      return this.view(null, OptionsView, model)
        .then(this.updateState(history, 'Options', params.url));
    }
  });
  return HomeController;
});