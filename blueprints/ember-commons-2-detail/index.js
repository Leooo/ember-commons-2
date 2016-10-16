/*jshint node:true*/
'use strict';
var walkSync = require('../../node_modules/walk-sync');
var walk = require('fs-walk');
var path = require('path');
var FileInfo = require ('../../lib/models/file-info');
// var FileInfo = require('ember-cli/lib/models/file-info');
var Promise = require('ember-cli/lib/ext/promise');
var sequence = require('ember-cli/lib/utilities/sequence');

// use with: ember g ember-commons-2-detail --typeName='models' --objectName='direct-debit'
module.exports = {
  install: function(options) {
    console.log('install');
    return this._super.apply(this, arguments);
  },
  normalizeEntityName: function(entityName) {
    // console.log('normalizeEntityName');
    // this prevents an error when the entityName is
  },
  fileMapTokens: function(options) {
    let typeName = options.locals.typeName,
    objectName = options.locals.objectName;
    console.log('fileMapTokens', objectName);
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
    console.log('filesPath');
    // options is null for first run from hasPathToken
    this.typeName = options ? options.taskOptions.typeName : '';
    this.objectName = options ? options.taskOptions.objectName : '';
    this.rootFolder = options ? options.taskOptions.rootFolder : '';
    this.keepConflictingExistingFiles = options ? options.taskOptions.keepConflictingExistingFiles : '';
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
    // console.log('files', this.options.taskOptions.objectName, filesPath);
    let _files = [];
    walk.walkSync(filesPath, function(basedir, filename, stat) {
      _files.push(filename);
    });
    this._files = _files;
    console.log('this._files', this._files);
    return this._files;
  },
  locals: function(options) {
    // console.log('locals');
    return options.taskOptions;
  },
  _process: function(options, beforeHook, process, afterHook) {
    console.log('_process', options.taskOptions);
    return this._super.apply(this, arguments);
  },
  beforeInstall: function(options) {
    console.log('beforeInstall', options.taskOptions);
  },
  buildFileInfo: function(intoDir, templateVariables, file) {
    console.log('buildFileInfo', templateVariables);
    let mappedPath = this.mapFile(file, templateVariables);
    mappedPath = `${templateVariables.rootFolder}/${templateVariables.typeName}/${templateVariables.objectName}/${mappedPath}`
    console.log('mappedPath', mappedPath);
    let base = new FileInfo({
      action: 'write',
      outputBasePath: path.normalize(intoDir),
      outputPath: path.join(intoDir, mappedPath),
      displayPath: path.normalize(mappedPath),
      inputPath: this.srcPath(file),
      templateVariables: templateVariables,
      ui: this.ui
    });
    // let base = this._super.apply(this, arguments);
    let baseName = templateVariables.dasherizedPackageName;
    console.log('base', base);
    let outputPath = base.outputPath;
    console.log('outputPath0', outputPath);
    /*outputPath = outputPath.replace(
      baseName,
      `${baseName}/${templateVariables.rootFolder}/${templateVariables.typeName}/${templateVariables.objectName}`
    );*/
    console.log('outputPath', outputPath);
    base.outputPath = outputPath;
    base.skipConflict = templateVariables.keepConflictingExistingFiles;
    //// console.log('base', base);
    return base;
  },
  /*processFiles: function(intoDir, templateVariables) {
    console.log('processFiles', templateVariables.targetFiles);
    let res = this._super.apply(this, arguments);
    console.log('processFiles 2', res);
    return res.then((res2) => {
      console.log('processFiles 3', res2);
      return res2;
    }, (err) => {
      console.log('error', err);
    });
  },*/
  processFiles: function(intoDir, templateVariables) {
    var files = this._getFilesForInstall(templateVariables.targetFiles);
    var fileInfos = this._getFileInfos(files, intoDir, templateVariables);
    this._checkForNoMatch(fileInfos, templateVariables.rawArgs);

    this._ignoreUpdateFiles();
    console.log('processFiles 0');
    return Promise.filter(fileInfos, isValidFile).
      map(prepareConfirm).
      then(finishProcessingForInstall);
  },
  _getFilesForInstall() {
    let getf = this._super.apply(this, arguments);
    console.log('_getFilesForInstall', getf);
    return getf;
  },
  _getFileInfos(files, intoDir, templateVariables) {
    console.log('_getFileInfos0', files, intoDir, templateVariables);
    let getf = files.map(this.buildFileInfo.bind(this, intoDir, templateVariables));
    console.log('_getFileInfos', getf);
    return getf;
  },
  _writeFile: function(info) {
    console.log('writeFile', info.rendered, info.inputPath);
    return this._super.apply(this,arguments);
  },
};

function prepareConfirm(info) {
  console.log('prepareConfirm');
  return info.checkForConflict().then(function(resolution) {
    console.log('resolution');
    info.resolution = resolution;
    return info;
  });
}

/*function finishProcessingForInstall(infos) {
  console.log('finishProcessingForInstall');
  let sup = this._super.apply(this, arguments);
  return sup.then((res) => {
    console.log('finishProcessingForInstall res', res);
    return res;
  });
}*/

function finishProcessingForInstall(infos) {
  console.log('finishProcessingForInstall');
  infos.forEach(markIdenticalToBeSkipped);

  var infosNeedingConfirmation = infos.reduce(gatherConfirmationMessages, []);

  return sequence(infosNeedingConfirmation).returns(infos);
}

function isValidFile(fileInfo) {
  return Promise.resolve(true);
}

function markIdenticalToBeSkipped(info) {
  if (info.resolution === 'identical') {
    info.action = 'skip';
  }
}

function gatherConfirmationMessages(collection, info) {
  if (info.resolution === 'confirm') {
    collection.push(info.confirmOverwriteTask());
  }
  return collection;
}
