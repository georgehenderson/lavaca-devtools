(function() {
  var getViewProperties = function() {
    if (!(window.jQuery && $0)) {
      return {};
    }
    var level;
    function findView(elem, n) {
      if (!elem) {
        return;
      }
      level = n || 0;
      var found = $(elem).data('view');
      if (!found) {
        level++;
        found = findView(elem.parentElement, level);
      }
      return found;
    }
    var view = findView($0),
        data = { __proto__: null };
    if (view && view.model) {
      if (level > 0) { data.distance = level; }
      data.id = view.id;
      data.type = view.constructor.name || 'View';
      data.view = view;
      data.model = view.model;
      data.template = view.template;
      data.childViews = view.childViews;
      window.$view = view;
      window.$model = view.model;
    }
    return data;
  };
  var getModelProperties = function() {
    if (!(window.jQuery && $0)) {
      return {};
    }
    var level;
    function findView(elem, n) {
      if (!elem) {
        return;
      }
      level = n || 0;
      var found = $(elem).data('view');
      if (!found) {
        level++;
        found = findView(elem.parentElement, level);
      }
      return found;
    }
    var view = findView($0),
        data = { __proto__: null },
        messages;
    if (view && view.model) {
      messages = view.model.validate();
      data.toObject = view.model.toObject();
      data.model = view.model;
      if (messages.isValid) {
        data.isValid = true;
      } else {
        data.validationMessages = messages;
      }
      window.$view = view;
      window.$model = view.model;
    }
    return data;
  };
  chrome.devtools.panels.elements.createSidebarPane('Lavaca View Properties', function(sidebar) {
    var onSelectionChanged = function() {
      // expression to run in the context of the inspected page
      var expression = '(' + getViewProperties.toString() + ')()';
      // evaluate the expression and handle the result
      sidebar.setExpression(expression);
    };
    onSelectionChanged();
    chrome.devtools.panels.elements.onSelectionChanged.addListener(onSelectionChanged);
  });
  chrome.devtools.panels.elements.createSidebarPane('Lavaca Model Properties', function(sidebar) {
    var onSelectionChanged = function() {
      // expression to run in the context of the inspected page
      var expression = '(' + getModelProperties.toString() + ')()';
      // evaluate the expression and handle the result
      sidebar.setExpression(expression);
    };
    onSelectionChanged();
    chrome.devtools.panels.elements.onSelectionChanged.addListener(onSelectionChanged);
  });
})();