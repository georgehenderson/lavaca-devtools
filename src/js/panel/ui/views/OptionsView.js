define(function(require) {
  var View = require('lavaca/mvc/View');
  var port = require('panel/net/port');

  var OptionsView = View.extend(function() {
    View.apply(this, arguments);
    this.portMessageHandler = this.onPortMessage.bind(this);
    port.onMessage.addListener(this.portMessageHandler);
    this.mapEvent({
      '.options': {
        submit: this.onSubmitNamespace.bind(this)
      }
    });
  }, {
    template: 'options',
    className: 'options',
    onPortMessage: function (msg) {
      if (msg.action === 'setNamespace') {
        this.model.set('namespace', msg.message);
        this.redraw();
      }
    },
    onSubmitNamespace: function(e) {
      e.preventDefault();
      var input = this.el.find('[name="namespace"]'),
          val = input.val();
      port.postMessage({action: 'setNamespace', namespace: val});
    },
    dispose: function() {
      port.onMessage.removeListener(this.portMessageHandler);
      View.prototype.dispose.apply(this, arguments);
    }
  });

return OptionsView;

});