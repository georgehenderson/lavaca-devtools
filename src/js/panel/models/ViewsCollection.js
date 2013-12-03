define(function(require) {
  var Collection = require('lavaca/mvc/Collection');
  var port = require('panel/net/port');
  var ViewsCollection = Collection.extend(function() {
    Collection.apply(this, arguments);
    this.apply({
      viewTree: this.buildViewTree
    });
  }, {
    buildViewTree: function() {
      var viewsWithParentIndexes = [];
      this.each(function(i, model) {
        var copyModel = model.toObject(),
            parentView = model.get('parentView'),
            parentIndex = -1;
        copyModel.model = JSON.stringify(copyModel.model || {}, undefined, 2);
        if (parentView) {
          this.models.some(function(item, i) {
            if (parentView === item.get('id')) {
              parentIndex = i;
              return true;
            }
          });
        }
        viewsWithParentIndexes.push([
          copyModel,
          parentIndex
        ]);
      }.bind(this));
      return makeTree(viewsWithParentIndexes);
    }
  });

  function makeTree(arr){
      //Array with all the children elements set correctly..
      var treeArr = [];
      var depth = 0;
      var lastParent;
      for (var i = 0, len = arr.length; i < len; i++){
          var arrI = arr[i];
          var newNode = {
              name: arrI[0],
              children: []
          };
          var found;
          var parentI = arrI[1];
          if (parentI > -1){ //i.e. not the root..
            found = recursiveSearchById(treeArr, arr[parentI][0].id);
            depth = found.depth + 1;
            newNode.depth = depth;
            found.children.push(newNode);
          } else {
            depth = newNode.depth = 0;
            treeArr.push(newNode);
          }
          lastParent = parentI;
      }
      return treeArr; //return the root..
  }

  function recursiveSearchById(items, id) {
      if (items) {
          for (var i = 0; i < items.length; i++) {
              if (items[i].name.id == id) {
                  return items[i];
              }
              var found = recursiveSearchById(items[i].children, id);
              if (found) return found;
          }
      }
  }

  return new ViewsCollection();
});
