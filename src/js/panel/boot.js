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

require.config({
  baseUrl: '/src/js',
  paths: {
    'es5-shim': '../components/es5-shim/es5-shim',
    '$': '../components/jquery/index',
    'jquery': '../components/jquery/index',
    'hammer': '../components/hammerjs/dist/jquery.hammer',
    'mout': '../components/mout/src',
    'dust': '../components/dustjs-linkedin/dist/dust-full-2.0.4',
    'dust-helpers': '../components/dustjs-linkedin-helpers/dist/dust-helpers-1.1.1',
    'rdust': 'panel/misc/rdust-chrome-extension',
    'iScroll': '../components/iscroll/dist/iscroll-lite-min',
    'bootstrap': '../components/bootstrap/dist/js/bootstrap',
    'lavaca': '../components/lavaca/src'
  },
  shim: {
    $: {
      exports: '$'
    },
    jquery: {
      exports: '$'
    },
    hammer: {
      deps: ['$'],
      exports: 'Hammer'
    },
    dust: {
      exports: 'dust'
    },
    'dust-helpers': {
      deps: ['dust']
    },
    bootstrap: {
      deps: ['$']
    }
  }
});

require(['panel/panel']);