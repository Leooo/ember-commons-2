/*jshint node:true*/
'use strict';
var Blueprint = require('ember-cli/lib/models/blueprint');
var sequence = require('ember-cli/lib/utilities/sequence');
var _  = require('ember-cli-lodash-subset');

module.exports = {
  afterInstall: function(options, local) {
    // console.log('afterInstall options', options.importFromCommons);
    let importFromCommons = options.importFromCommons;
    //blueprintDetail = new Blueprint(`${this.path}-detail/index`);
    let promiseArray= [];
    // TODO: replace by using sequence (from ember-cli blueprint folder)
    Object.keys(importFromCommons).forEach((typeName) => {
      importFromCommons[typeName].forEach((objectName) => {
        ['commons', 'app'].forEach((rootFolder) => {
          let options2 = _.cloneDeep(options);
          console.log('cloneDeep', objectName);
          options2.taskOptions = {
            typeName,
            objectName,
            keepConflictingExistingFiles: (rootFolder === 'app'),
            rootFolder
          };
          let blueprintDetail = Blueprint.load(`${this.path}-detail`);
          promiseArray.push(blueprintDetail.install(options2));
        });
      });
    });
    /*let promise = promiseArray[0];
    for (let i=1; i<promiseArray.length; i++) {
      promise = promise.then(() => {
        return promiseArray[i];
      });
    }
    return promise;*/
    return sequence(promiseArray);
  },
  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },
  files: function() {
   this._files = [];
   return [];
  }
};
