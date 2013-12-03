define(function(require) {
  var BaseController = require('panel/net/BaseController');
  var HomeView = require('panel/ui/views/HomeView');
  var OptionsView = require('panel/ui/views/OptionsView');
  var RoutesView = require('panel/ui/views/RoutesView');
  var viewsCollection = require('panel/models/ViewsCollection');
  var port = require('panel/net/port');
  var Model = require('lavaca/mvc/Model');
  var Collection = require('lavaca/mvc/Collection');

  var HomeController = BaseController.extend({
    index: function(params, history) {
      port.postMessage({action: 'getViews'});
      port.postMessage({action: 'getNamespace'});
      port.postMessage({action: 'isPanelActive'});
      return this.view(null, HomeView, viewsCollection)
        .then(this.updateState(history, 'Views', params.url));
    },
    routes: function(params, history) {
      port.postMessage({action: 'getRoutes'});
      var model = new Collection();
      return this.view(null, RoutesView, model)
        .then(this.updateState(history, 'Routes', params.url));
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