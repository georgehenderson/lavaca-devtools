(function() {
  var namespace = localStorage.getItem('ldt-namespace');
  var timer = setTimeout(function () {
    document.removeEventListener('DOMNodeInserted', checkForLavaca);
  }, 5000);
  var checkForLavaca = function() {
    if (isLavacaApp()) {
      clearTimeout(timer);
      document.removeEventListener('DOMNodeInserted', checkForLavaca);
      init();
    }
  };
  document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('DOMNodeInserted', checkForLavaca);
    checkForLavaca();
  });

  var isLavacaApp = function() {
    return !!((namespace && window[namespace] && window[namespace]['lavaca/mvc/View'])
      || (window.require && window.require.defined && window.require.defined('lavaca/mvc/View')));
  };

  var debounce = function(fn, threshold, isAsap){
    var timeout, result;
    function debounced(){
        var args = arguments, context = this;
        function delayed(){
            if (! isAsap) {
                result = fn.apply(context, args);
            }
            timeout = null;
        }
        if (timeout) {
            clearTimeout(timeout);
        } else if (isAsap) {
            result = fn.apply(context, args);
        }
        timeout = setTimeout(delayed, threshold);
        return result;
    }
    return debounced;
  };

  var isRequire = function() {
    if (window.require) {
      return true;
    } 
  };

  var getModule = function(path) {
    var module;
    if (isRequire() && require.defined && require.defined(path)) {
      module = require(path);
    } else if (window[namespace] && window[namespace][path]) {
      module = window[namespace][path];
    }
    return module;
  };

  var getModuleName = function(module) {
    var moduleMap = isRequire() ? require.s.contexts._.defined : window[namespace],
        name;
    Object.keys(moduleMap).some(function(key) {
      if (moduleMap[key] === module || moduleMap[key] === module.constructor) {
        name = key;
        return true;
      }
    });
    return name;
  };

  var getViewTree = function() {
    var views = [];
    $('[data-view-id]').each(function(i, el) {
      var view = $(el).data('view');
      if (view) {
        views.push({
          id: view.id,
          model: (view.model && typeof view.model.toObject === 'function') ? view.model.toObject() : view.model,
          template: view.template,
          type: getModuleName(view) || 'View',
          parentView: view.parentView ? view.parentView.id : null
        });
      }
    });
    return views;
  };

  var sendTree = function(action) {
    var obj = {
      views: getViewTree()
    };
    sendMessage(action, obj);
  };

  var getRoutes = function() {
    var router = getModule('lavaca/mvc/Router'),
        routes = router.routes.map(function(route) {
          var controllerType = getModuleName(route.TController);
          return {
            action: route.action,
            params: route.params,
            pattern: route.pattern,
            TController: controllerType
          };
        });
    sendMessage('routes', routes);
  };

  var sendMessage = function(action, message) {
    var data = {
      message: message,
      action: action,
      from: 'injected-script'
    };
    window.postMessage(data, '*');
  };

  var highlightView = function(viewId) {
    if (viewId) {
      $('[data-view-id="'+ viewId +'"]').addClass('ldt-highlight');
    } else {
      $('[data-view-id]').removeClass('ldt-highlight');
    }
  };

  var init = function() {
    sendMessage('activatePanel', true);
    var View = getModule('lavaca/mvc/View'),
        renderPageView = View.prototype.renderPageView,
        render = View.prototype.render,
        redraw = View.prototype.redraw,
        enter = View.prototype.enter,
        exit = View.prototype.exit,
        debouncedSendTree = debounce(sendTree, 0);
    View.prototype.renderPageView = function() {
      return renderPageView.apply(this, arguments).then(function() {
        sendTree('getViews');
      });
    };
    View.prototype.render = function() {
      return render.apply(this, arguments).then(function() {
        sendTree('getViews');
      });
    };
    View.prototype.redraw = function() {
      return redraw.apply(this, arguments).then(function() {
        sendTree('getViews');
      });
    };
    View.prototype.enter = function() {
      return enter.apply(this, arguments).then(function() {
        sendTree('getViews');
      });
    };
    View.prototype.exit = function() {
      return exit.apply(this, arguments).then(function() {
        sendTree('getViews');
      });
    };
  };

  window.addEventListener('message', function(event) {
    var data = event.data,
        message;
    if (data) {
      message = data.message;
    }
    if (data.from === 'content-script') {
      if (message.action === 'init') {
        if (isLavacaApp()) {
          init();
        } else {
          sendMessage('activatePanel', false);
        }
      } else if (message.action === 'isPanelActive') {
        sendMessage('activatePanel', isLavacaApp());
      } else if (message.action === 'getViews') {
        sendTree(message.action);
      } else if (message.action === 'highlightView') {
        highlightView(message.viewId);
      } else if (message.action === 'setNamespace') {
        localStorage.setItem('ldt-namespace', message.namespace);
        window.location.reload(true);
      } else if (message.action === 'getNamespace') {
        sendMessage('setNamespace', localStorage.getItem('ldt-namespace'));
      } else if (message.action === 'getRoutes') {
        getRoutes();
      } else if (message.action === 'log') {
        console.log(message.message);
      }
    }
  });
  

})();