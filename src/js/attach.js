(function() {

  var htmlTag = document.documentElement;

  var baseUrl = htmlTag.getAttribute('lavaca-dev-path');
  htmlTag.removeAttribute('lavaca-dev-path');

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

  // a simple security check
  if (!/^chrome-extension:\/\/\w+\/src\/js\/$/.test(baseUrl)) {
    console.error('[Lavaca Dev Tools] Incorrect extension URL');
    return;
  }

  var getViewTree = function() {
    var views = [];
    $('[data-view-id]').each(function(i, el) {
      var view = $(el).data('view');
      views.push({
        id: view.id,
        model: typeof view.model.toObject === 'function' ? view.model.toObject() : view.model,
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

  document.addEventListener('DOMContentLoaded', function(event) {
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
    
  });
  

})();