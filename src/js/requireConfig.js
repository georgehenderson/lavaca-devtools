var requirejsConfig = {
  baseUrl: '/src/js',
  paths: {
    'es5-shim': '../../node_modules/lavaca/src/js/libs/es5-shim',
    '$': '../../node_modules/lavaca/src/js/libs/jquery-2.0.0',
    'jquery': '../../node_modules/lavaca/src/js/libs/jquery-2.0.0',
    'jquery-mobile': '../../node_modules/lavaca/src/js/libs/jquery-mobile',
    'cordova': '../../node_modules/lavaca/src/js/libs/cordova',
    'mout': '../../node_modules/lavaca/src/js/libs/mout',
    'docCookies': '../../node_modules/lavaca/src/js/libs/docCookies',
    'dust': '../../node_modules/lavaca/src/js/libs/dust-full-1.2.4',
    'dust-helpers': '../../node_modules/lavaca/src/js/libs/dust-helpers-1.1.1',
    'rdust': '../../node_modules/lavaca/src/js/libs/require-dust',
    'iscroll': '../../node_modules/lavaca/src/js/libs/iscroll-lite',
    'iScroll': '../../node_modules/lavaca/src/js/libs/iscroll-lite',
    'lavaca': '../../node_modules/lavaca/src/js/lavaca'
  },
  shim: {
    $: {
      exports: '$'
    },
    jquery: {
      exports: '$'
    },
    dust: {
      exports: 'dust'
    },
    'dust-helpers': {
      deps: ['dust']
    },
    templates: {
      deps: ['dust']
    }
  }
};