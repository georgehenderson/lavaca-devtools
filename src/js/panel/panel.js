define(function(require) {
  require('lavaca/ui/DustTemplate');
  var Application = require('lavaca/mvc/Application');
  var HomeController = require('panel/net/HomeController');
  var HeaderView = require('panel/ui/views/HeaderView');

  return new Application(function() {
    this.router.add({
      '/': [HomeController, 'index'],
      '/options': [HomeController, 'options']
    });
    HeaderView.render();
  });
});