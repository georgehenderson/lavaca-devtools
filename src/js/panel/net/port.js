define(function(require) {
  var port = chrome.extension.connect({
    name: 'devtools'
  });
  return port;
});