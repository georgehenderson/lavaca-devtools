define(function(require) {
  require('lavaca/ui/DustTemplate');
  var Application = require('lavaca/mvc/Application');
  var HomeController = require('panel/net/HomeController');

  return new Application(function() {
    this.router.add({
      '/': [HomeController, 'index']
    });
  });
});