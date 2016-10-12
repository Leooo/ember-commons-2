/*jshint node:true*/
'use strict';

module.exports = {
  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },
  fileMapTokens: function() {
    return {
      __root__: function(options) {
        return '/test1-other';
      }
    };
  }
  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  // afterInstall: function(options) {
  //   // Perform extra work here.
  // }
  //
  // included: function(app) {
  // this._super.included(app);

  // app.import(app.bowerDirectory + '/x-button/dist/js/x-button.js');
  // app.import(app.bowerDirectory + '/x-button/dist/css/x-button.css');
  // }
};
