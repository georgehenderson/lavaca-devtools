define(function(require) {
  var Controller = require('lavaca/mvc/Controller');
  var HomeView = require('panel/ui/views/HomeView');
  var viewsCollection = require('panel/models/ViewsCollection');

  var HomeController = Controller.extend({
    index: function() {
      return this.view(null, HomeView, viewsCollection);
    }
  });
  return HomeController;
});