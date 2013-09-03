define(function(require) {
  var Collection = require('lavaca/mvc/Collection');
  var ViewsCollection = Collection.extend(function() {
    Collection.apply(this, arguments);
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

  return new ViewsCollection();
});
