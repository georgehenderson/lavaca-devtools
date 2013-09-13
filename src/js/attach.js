(function() {
  var timer = setTimeout(function () {
    document.removeEventListener('DOMNodeInserted', checkForLavaca);
  }, 5000);
  var checkForLavaca = function() {
    if (window.require && window.require.defined && window.require.defined('lavaca/mvc/Application')) {
      clearTimeout(timer);
      document.removeEventListener('DOMNodeInserted', checkForLavaca);
      init();
    }
  };
  document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('DOMNodeInserted', checkForLavaca);
    checkForLavaca();
  });

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
      views.push({
        id: view.id,
        model: (view.model && typeof view.model.toObject === 'function') ? view.model.toObject() : view.model,
        template: view.template,
        type: view.constructor.name || 'View',
        parentView: view.parentView ? view.parentView.id : null
      });
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

  var init = function() {
    console.log('[Lavaca Dev Tools] Started');
    window.addEventListener('message', function(event) {
      var data = event.data,
          message;
      if (data) {
        message = data.message;
      }
      if (data.from === 'content-script') {
        if (message.action === 'getViews') {
          sendTree(message.action);
        }
      }
    });

    // create an observer instance
    var debouncedSendTree = debounce(sendTree, 200);
    var observer = new MutationObserver(function(mutations) {
      debouncedSendTree();
    });
    var config = { attributes: true, childList: true, characterData: true, subtree: true };
    setTimeout(function() {
      observer.observe($('#view-root')[0], config);
    }, 1000);
    // later, you can stop observing
    //observer.disconnect();
  };
  

})();