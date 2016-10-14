/*jshint node:true*/
'use strict';
var walkSync = require('../../node_modules/walk-sync');
var walk = require('fs-walk');
var path = require('path');

// use with: ember g ember-commons-2-detail --typeName='models' --objectName='direct-debit'
module.exports = {
  normalizeEntityName: function(entityName) {
    console.log('normalizeEntityName');
    // this prevents an error when the entityName is
  },
  fileMapTokens: function() {
    let typeName = this.typeName,
    objectName = this.objectName;
    return {
      __root__: function(options) {
        return '/commons';
      },
      __typeName__: function(options) {
        return typeName;
      },
      __objectName__: function(options) {
        return objectName;
      }
    };
  },
  filesPath: function(options) {
    // console.log('options', options ? options : '');
    // first run from hasPathToken
    this.typeName = options ? options.taskOptions.typeName : '';
    this.objectName = options ? options.taskOptions.objectName : '';
    let filesPath = path.join(this.path, 'files').replace(
      'blueprints/ember-commons-2-detail/files',
      `node_modules/ember-commons/addon/${this.typeName}/${this.objectName}`
    );
    console.log('filesPath debug', filesPath);
    return filesPath;
  },
  files: function() {
    // https://ember-cli.com/api/files/lib_models_blueprint.js.html#l223
    if (this._files && this.typeName.length) { return this._files; }
    var filesPath = this.filesPath(this.options);
    /*filesPath = filesPath.replace(
      'blueprints/ember-commons-2/files',
      'node_modules/ember-commons/addon/models'
    );
    console.log('fileName:');
    console.log(filesPath);*/
    // this._files = walkSync(filesPath, { directories: false });
    let _files = [];
    walk.walkSync(filesPath, function(basedir, filename, stat) {
      _files.push(filename);
    });
    this._files = _files;
    // this._files = [filesPath];
    // console.log('filesPath', filesPath);
    console.log('this._files', this._files);
    // console.log('_files', this._files);
    return this._files;
  },
  _process: function(options, beforeHook, process, afterHook) {
    return this._super.apply(this, arguments);
  },
  locals: function() {console.log('locals');},
  _locals: function(options) {
    var packageName = options.project.name();
    var moduleName = options.entity && options.entity.name || packageName;
    var sanitizedModuleName = moduleName.replace(/\//g, '-');
    var fileMapVariables = this._generateFileMapVariables(moduleName, undefined, options);
    var fileMap = this.generateFileMap(fileMapVariables);
    console.log('_process',fileMap);
    console.log('_locals0', moduleName);
    return this._super.apply(this,arguments).then(function(res){
      console.log('_locals', res);
      return res;
    });
  },
  beforeInstall: function() {
    console.log('beforeInstall');
  },
  buildFileInfo: function(intoDir, templateVariables, file) {
  console.log('buildFileInfo');
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
   outputPath = outputPath.replace(baseName, `${baseName}/commons/${this.typeName}/`);
   console.log('outputPath', outputPath);
   base.outputPath = outputPath;
   return base;
 },
};
