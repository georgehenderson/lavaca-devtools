var _isLocal = function(url) {
  return url.search(/^(https?|ftp):\/\//) === -1;
};

require.load = function (context, moduleName, url) {
  if (_isLocal(url)) {
    url = chrome.extension.getURL(url) + '?r=' + new Date().getTime();
  }

  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function (e) {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var content = xhr.responseText;
      if (_isLocal(url)) {
        content += "\r\n//@ sourceURL=" + url.replace(/\?r=.*$/, '');
      }
      (function() {
        eval(content);
      }.bind(window))();
      context.completeLoad(moduleName)
    }
  };
  xhr.send(null);
};