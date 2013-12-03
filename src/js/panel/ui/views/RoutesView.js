define(function(require) {
  var View = require('lavaca/mvc/View');
  var port = require('panel/net/port');
  require('rdust!templates/routes');

  var RoutesView = View.extend(function() {
    View.apply(this, arguments);
    this.portMessageHandler = this.onPortMessage.bind(this);
    port.onMessage.addListener(this.portMessageHandler);
  }, {
    template: 'templates/routes',
    className: 'routes',
    onPortMessage: function (msg) {
      if (msg.action === 'routes') {
        this.model.clearModels();
        this.model.add(msg.message);
        this.redraw();
      }
    },
    dispose: function() {
      port.onMessage.removeListener(this.portMessageHandler);
      View.prototype.dispose.apply(this, arguments);
    }
  });

return RoutesView;

});