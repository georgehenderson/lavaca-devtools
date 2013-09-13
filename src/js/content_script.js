(function() {

  // inject attach.js which can access existing JavaScript
  var s = document.createElement('script');
  s.src = chrome.extension.getURL('src/js/attach.js');
  s.onload = function() {
    this.parentNode.removeChild(this);
  };
  (document.head||document.documentElement).appendChild(s);

  window.addEventListener('message', function(event) {
    var data = event.data;
    if (data.from === 'injected-script') {
      chrome.runtime.sendMessage(event.data);
    }
  });

  //Handler request from background page
  chrome.extension.onMessage.addListener(function (message, sender) {
    var data = {
      message: message,
      from: 'content-script'
    };
    window.postMessage(data, '*');
  });

})();