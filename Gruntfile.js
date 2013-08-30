module.exports = function( grunt ) {

  'use strict';

  grunt.initConfig({
    'amd-dist': {
      all: {
        options: {
          standalone: true,
          exports: 'requireExports'
        },
        files: [
          {
            src: [
              './node_modules/lavaca/src/js/lavaca/**/*'
            ],
            dest: 'lavaca.js'
          }
        ]
      }
    },

    requirejs: {
      baseUrl: './node_modules/lavaca/src/js',
      mainConfigFile: './node_modules/lavaca/src/boot.js',
      optimize: 'none',
      keepBuildDir: true,
      locale: "en-us",
      useStrict: false,
      skipModuleInsertion: false,
      findNestedDependencies: false,
      removeCombined: false,
      preserveLicenseComments: false,
      logLevel: 0
    }


  });

  grunt.loadNpmTasks('grunt-amd-dist');

  grunt.registerTask('default', 'runs the tests and starts local server', ['amd-dist']);
};
