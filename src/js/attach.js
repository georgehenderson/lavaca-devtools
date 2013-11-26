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

  var getViewTree = function() {
    var views = [];
    $('[data-view-id]').each(function(i, el) {
      var view = $(el).data('view');
      if (view) {
        views.push({
          id: view.id,
          model: (view.model && typeof view.model.toObject === 'function') ? view.model.toObject() : view.model,
          template: view.template,
          type: view.constructor.name || 'View',
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
    console.log('[Lavaca Dev Tools] Started');
    sendMessage('activatePanel', true);
    var View;
    if (namespace && window[namespace]['lavaca/mvc/View']) {
      View = window[namespace]['lavaca/mvc/View'];
    } else if (require && require.defined && require.defined('lavaca/mvc/View')) {
      View = require('lavaca/mvc/View');
    }
    var renderPageView = View.prototype.renderPageView,
        render = View.prototype.render,
        redraw = View.prototype.redraw,
        debouncedSendTree = debounce(sendTree, 1000);
    View.prototype.renderPageView = function() {
      return renderPageView.apply(this, arguments).then(function() {
        debouncedSendTree('getViews');
      });
    };
    View.prototype.render = function() {
      return render.apply(this, arguments).then(function() {
        debouncedSendTree('getViews');
      });
    };
    View.prototype.redraw = function() {
      return redraw.apply(this, arguments).then(function() {
        debouncedSendTree('getViews');
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
      if (message.action === 'isPanelActive') {
        sendMessage('activatePanel', isLavacaApp());
      } else if (message.action === 'getViews') {
        sendTree(message.action);
      } else if (message.action === 'highlightView') {
        highlightView(message.viewId);
      } else if (message.action === 'setNamespace') {
        localStorage.setItem('ldt-namespace', message.namespace);
      } else if (message.action === 'getNamespace') {
        sendMessage('setNamespace', localStorage.getItem('ldt-namespace'));
      }
    }
  });
  

})();