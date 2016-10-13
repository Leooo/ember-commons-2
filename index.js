/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-commons-2',
  included: function(app, parentAddon) {
    // var target = (parentAddon || app);
    // Now you can modify the app / parentAddon. For example, if you wanted
    // to include a custom preprocessor, you could add it to the target's
    // registry:
    //
    //     target.registry.add('js', myPreprocessor);
    this._super.included(app);
  },
  isDevelopingAddon: function () {
    return true;
  }
};
