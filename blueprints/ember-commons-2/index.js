/*jshint node:true*/
'use strict';
var myModel = require('../../addon/test');
var walkSync = require('../../node_modules/walk-sync');
var path = require('path');

//give 'unexpected reserved word' (on 'import', http://stackoverflow.com/questions/32346886/unexpected-reserved-word-import-in-node-js)
//var myModel = require('../../node_modules/ember-commons/addon/models/premise');

module.exports = {
  afterInstall: function(options, local) {
    console.log('beforeInstall options', Object.keys(options), options);
  },
  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
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
    /*let base = this._super.apply(this, arguments);
    console.log('arguments', intoDir, templateVariables, file);
    console.log('base', base);
    console.log('templateVariablesdebug', templateVariables);
    let baseName = templateVariables.dasherizedPackageName;
    console.log('baseName', baseName);
    let filePath = base.inputPath;
    console.log('filePath0', filePath, filePath.indexOf('ember-commons/'));
    filePath = filePath.substr(filePath.indexOf('ember-commons/'), filePath.length);
    filePath = 'oam/' + filePath.replace('ember-commons/addon/', 'commons/');
    console.log('filePath', filePath);*/
    let baseName = templateVariables.dasherizedPackageName;
    let base = this._super.apply(this, arguments);
    let outputPath = base.outputPath;
    console.log('outputPath0', outputPath);
    outputPath = outputPath.replace(baseName, baseName + '/commons');
    console.log('outputPath', outputPath);
    base.outputPath = outputPath;
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
