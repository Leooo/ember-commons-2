'use strict';
var FileInfo = require('ember-cli/lib/models/file-info');
var Promise = require('ember-cli/lib/ext/promise');
var fs = require('fs');
var readFile = Promise.denodeify(fs.readFile);
var lstat        = Promise.denodeify(fs.stat);

// same as ember-cli 's file-info, but option
// overrideConflict to skip the file when existing and conflict

FileInfo.prototype.checkForConflict = function() {
  console.log('checkForConflict');
  var skipConflict = this.skipConflict;
  console.log('skipConflict', skipConflict);
  return new Promise(function (resolve, reject) {
    console.log('this.outputPath', this.outputPath);
    let doesExist = fs.existsSync(this.outputPath);
    /*fs.exists(this.outputPath, function (doesExist, error) {
      console.log('doesExist?', doesExist);
      if (error) {
        console.log('error');
        reject(error);
        return;
      }*/

      var result;

      if (doesExist) {
        console.log('doesExist');
        result = Promise.hash({
          input: this.render(),
          output: readFile(this.outputPath)
        }).then(function(result) {
          var type;
          console.log('result');
          if (result.input.toString() === result.output.toString()) {
            type = 'identical';
          } else {
            console.log('skipConflict', skipConflict);
            type = skipConflict ? 'identical' : 'confirm'
          }
          return type;
        }.bind(this));
      } else {
        console.log('no result');
        result = 'none';
      }

      resolve(result);
    //}.bind(this));
  }.bind(this));
};

FileInfo.prototype.render = function() {
  var path = this.inputPath,
      context = this.templateVariables;
  if (!this.rendered) {
    console.log('rendering');
    this.rendered = readFile(path).then(function(content) {
      console.log('red file');
      return lstat(path).then(function(fileStat) {
        if (false) {
          return content;
        } else {
          try {
            console.log('would process template');
            return true;
          } catch (err) {
            err.message += ' (Error in blueprint template: ' + path + ')';
            throw err;
          }
        }
      });
    }, function (err) {
      console.log('err in reading file', err);
    });
  }
  return this.rendered;
};

module.exports = FileInfo;
