/*jshint node:true*/
'use strict';
var walkSync = require('../../node_modules/walk-sync');
var path = require('path');

module.exports = {
  normalizeEntityName: function(entityName) {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
    let arr = entityName.split(" ");
    this.typeName = arr[0];
    this.objectName = arr[1];
    console.log('entityName', this.typeName, this.objectName);
    return entityName;
  },
  fileMapTokens: function() {
    return {
      __root__: function(options) {
        return '/commons';
      },
      __typeName__: function(options) {
        return this.typeName
      },
      __objectName__: function(options) {
        return this.objectName
      }
    };
  },
  filesPath: function(/* options */) {
    return path.join(this.path, 'files').replace(
      'blueprints/ember-commons-2/files',
      'node_modules/ember-commons/addon'
    );
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
