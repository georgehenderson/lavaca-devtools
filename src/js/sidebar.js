(function() {
  var getViewProperties = function() {
    if (!(window.jQuery && $0)) {
      return {};
    }
    var isRequire = function() {
      if (window.require) {
        return true;
      } 
    };

    var getModule = function(path) {
      var module;
      if (isRequire() && window.require.defined && window.require.defined(path)) {
        module = window.require(path);
      } else if (window[namespace] && window[namespace][path]) {
        module = window[namespace][path];
      }
      return module;
    };

    var getModuleName = function(module) {
      var moduleMap = isRequire() ? window.require.s.contexts._.defined : window[namespace],
          name;
      Object.keys(moduleMap).some(function(key) {
        if (moduleMap[key] === (module.constructor ? module.constructor : module)) {
          name = key;
          return true;
        }
      });
      return name;
    };
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
    if (!view) {
      var namespace = localStorage.getItem('ldt-namespace'),
          viewManager = getModule('lavaca/mvc/ViewManager');
      if (viewManager) {
        view = viewManager.layers[viewManager.layers.length - 1];
      }
    }
    if (view && view.model) {
      if (level > 0) { data.distance = level; }
      data.id = view.id;
      data.type = getModuleName(view) || 'View';
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
    var isRequire = function() {
      if (window.require) {
        return true;
      } 
    };

    var getModule = function(path) {
      var module;
      if (isRequire() && window.require.defined && window.require.defined(path)) {
        module = window.require(path);
      } else if (window[namespace] && window[namespace][path]) {
        module = window[namespace][path];
      }
      return module;
    };

    var getModuleName = function(module) {
      var moduleMap = isRequire() ? window.require.s.contexts._.defined : window[namespace],
          name;
      Object.keys(moduleMap).some(function(key) {
        if (moduleMap[key] === (module.constructor ? module.constructor : module)) {
          name = key;
          return true;
        }
      });
      return name;
    };
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
    if (!view) {
      var namespace = localStorage.getItem('ldt-namespace'),
          viewManager = getModule('lavaca/mvc/ViewManager');
      if (viewManager) {
        view = viewManager.layers[viewManager.layers.length - 1];
      }
    }
    if (view && view.model) {
      messages = view.model.validate();
      data.toObject = view.model.toObject();
      data.model = view.model;
      data.type = getModuleName(view.model) || 'Model';
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