const _ = require('lodash');
module.exports = function (sails) {
  return {
    initialize: function (cb) {
      const initPreReq = ["hook:redbox-storage-mongo:loaded"];
      sails.after(initPreReq, function() {
        global.ConfigService.mergeHookConfig('@researchdatabox/sails-hook-redbox-gitlab', sails.config);
        return cb();
      });
    },
    //If each route middleware do not exist sails.lift will fail during hook.load()
    routes: {

    },
    configure: function () {

    }
  }
};