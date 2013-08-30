(function() {
  LDT.app = new lavaca.mvc.Application(function() {
    LDT.models.viewsCollection = new LDT.models.ViewsCollection();
    this.router.add({
      '/': [LDT.net.HomeController, 'index']
    });

    var port = chrome.extension.connect({
      name: "devtools"
    });
    port.onMessage.addListener(function (msg) {
      LDT.models.viewsCollection.clearModels();
      LDT.models.viewsCollection.add(msg.message.views);
    });
    port.postMessage({action: 'getViews'});
  });

  LDT.net.HomeController = lavaca.mvc.Controller.extend({
    index: function() {
      return this.view(null, LDT.views.HomeView, LDT.models.viewsCollection);
    }
  });

  LDT.views.HomeView = lavaca.mvc.PageView.extend(function() {
    lavaca.mvc.PageView.apply(this, arguments);
    var modelUpdate = LDT.utils.debounce(this.onModelUpdate, 100);
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
      var model = this.model.first({id: id});
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

  LDT.models.ViewsCollection = lavaca.mvc.Collection.extend(function() {
    lavaca.mvc.Collection.apply(this, arguments);
    this.apply({
      viewTree: this.buildViewTree
    });
  }, {
    buildViewTree: function() {
      var viewsWithLayers = [];
      this.each(function(i, model) {
        var distance = 0,
            parentView = model.get('parentView');
        if (parentView) {
          viewsWithLayers.some(function(item, j) {
            if (item.id === parentView) {
              distance = item.distance + 1;
              return true;
            }
          });
        }
        model.set('distance', distance);
        viewsWithLayers.push(model.toObject());
      });
      return viewsWithLayers;
    }
  });
})();