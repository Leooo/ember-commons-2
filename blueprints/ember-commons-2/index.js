/*jshint node:true*/
'use strict';
var myModel = require('../../addon/test');
var walkSync = require('../../node_modules/walk-sync');
var path = require('path');

//give 'unexpected reserved word' (on 'import', http://stackoverflow.com/questions/32346886/unexpected-reserved-word-import-in-node-js)
//var myModel = require('../../node_modules/ember-commons/addon/models/premise');

module.exports = {
  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },
  fileMapTokens: function() {
    return {
      __root__: function(options) {
        return '/test1';
      },
      __modelname__: function(options) {
        return 'premise'
      }
    };
  },
  filesPath: function(/* options */) {
    return path.join(this.path, 'files').replace(
      'blueprints/ember-commons-2/files',
      'node_modules/ember-commons/addon'
    );
  },
  locals: function(options) {
    // Return custom template variables here.
     return {
       copycode: myModel
     };
   },
   files: function() {
     // https://ember-cli.com/api/files/lib_models_blueprint.js.html#l223
     if (this._files) { return this._files; }
     var filesPath = this.filesPath(this.options);
     /*filesPath = filesPath.replace(
       'blueprints/ember-commons-2/files',
       'node_modules/ember-commons/addon/models'
     );
     console.log('fileName:');
     console.log(filesPath);*/
     this._files = walkSync(filesPath);
     // console.log(this._files);
     return this._files;
   },
   srcPath: function(file) {
     var filesPath = this.filesPath(this.options);
     /*filesPath = filesPath.replace(
       'blueprints/ember-commons-2/files',
       'node_modules/ember-commons/addon/models'
     );*/
     return path.resolve(filesPath, file);
   },
   buildFileInfo: function(intoDir, templateVariables, file) {
    let base = this._super.apply(this, arguments);
    console.log('arguments', intoDir, templateVariables, file);
    console.log('base', base);
    return base;
  },
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
