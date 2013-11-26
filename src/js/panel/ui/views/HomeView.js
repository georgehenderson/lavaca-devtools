define(function(require) {
  var PageView = require('lavaca/mvc/PageView');
  var debounce = require('mout/function/debounce');
  var $ = require('jquery');
  var port = require('panel/net/port');

  var HomeView = PageView.extend(function() {
    PageView.apply(this, arguments);
    var modelUpdate = debounce(this.onModelUpdate, 100);
    this.portMessageHandler = this.onPortMessage.bind(this);
    port.onMessage.addListener(this.portMessageHandler);
    this.mapEvent({
      '.view-item': {
        click: this.onClickViewItem.bind(this),
        mouseover: this.onMouseOverItem.bind(this),
        mouseout: this.onMouseOutItem.bind(this)
      },
      model: {
        'addItem': modelUpdate.bind(this)
      }
    });
  }, {
    template: 'home',
    className: 'home',
    selectModel: function(id) {
      var model = this.model.first({id: id}),
          json = JSON.stringify(model.get('model') || {}, undefined, 2);
      this.model.set('selectedModel', {
        model: model,
        json: this.syntaxHighlight(json)
      });
      this.redraw('.model-inspector');
    },
    selectViewItem: function(el) {
      el = $(el);
      el.addClass('selected')
        .siblings()
          .removeClass('selected');
      this.selectModel(el.attr('id'));
    },
    onPortMessage: function (msg) {
      if (msg.action === 'activatePanel') {
        this.model.set('active', msg.message);
      } else if (msg.action === 'getViews') {
        this.model.clearModels();
        this.model.add(msg.message.views);
      }
    },
    onModelUpdate: function() {
      this.redraw().then(function() {
        this.selectViewItem($('.view-item'));
      }.bind(this));
    },
    onClickViewItem: function(e) {
      var el = $(e.currentTarget);
      this.selectViewItem(el);
    },
    onMouseOverItem: function(e) {
      port.postMessage({action: 'highlightView', viewId: $(e.currentTarget).attr('id')});
    },
    onMouseOutItem: function(e) {
      port.postMessage({action: 'highlightView', viewId: null});
    },
    syntaxHighlight: function(json) {
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
    },
    dispose: function() {
      port.onMessage.removeListener(this.portMessageHandler);
      PageView.prototype.dispose.apply(this, arguments);
    }
  });

return HomeView;

});