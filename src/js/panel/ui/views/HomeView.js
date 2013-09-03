define(function(require) {
  var PageView = require('lavaca/mvc/PageView');
  var debounce = require('mout/function/debounce');
  var $ = require('jquery');

  var HomeView = PageView.extend(function() {
    PageView.apply(this, arguments);
    var modelUpdate = debounce(this.onModelUpdate, 100);
    this.mapEvent({
      '.view-item': {
        click: this.onClickViewItem.bind(this)
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
      this.model.set('selectedModel', this.syntaxHighlight(json));
      this.redraw('.model-inspector');
    },
    onModelUpdate: function() {
      this.redraw().then(function() {
        this.selectModel($('.view-item').attr('id'));
      }.bind(this));
    },
    onClickViewItem: function(e) {
      var el = $(e.currentTarget);
      this.selectModel(el.attr('id'));
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
    }
  });

return HomeView;

});