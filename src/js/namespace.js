(function() {
  var resolve = function(name, createIfNotExists, value) {
    if (!name) {
      return null;
    }
    name = name.split('/');
    var last = window,
        o = window,
        i = -1,
        segment;
    while (segment = name[++i]) {
      o = o[segment];
      if (!o) {
        if (createIfNotExists) {
          o = last[segment] = value || {};
        } else {
          return null;
        }
      }
      last = o;
    }
    return o;
  };
  for (prop in window.requireExports) {
    resolve(prop, true, window.requireExports[prop]);
  }
  window.LDT = {};
  LDT.net = {};
  LDT.views = {};
  LDT.models = {};
  LDT.utils = {};

  LDT.utils.debounce = function(fn, threshold, isAsap){
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
})();