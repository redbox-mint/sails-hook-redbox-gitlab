const _ = require('lodash');
module.exports = function (sails) {
  return {
    initialize: function (cb) {
      const initPreReq = ["hook:redbox-storage-mongo:loaded"];
      sails.after(initPreReq, function() {
        global.ConfigService.mergeHookConfig('sails-hook-redbox-gitlab', sails.config);
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
// const ncp = require('ncp').ncp;
// const fs = require('fs-extra');
// const _ = require('lodash');

// const GitlabController = require('./api/controllers/GitlabController.js');
// const GitlabService = require('./api/services/GitlabService.js');
// const recordTypeConfig = require('./config/recordtype.js');
// const workflowConfig = require('./config/workflow.js');
// const workspaceTypeConfig = require('./config/workspacetype.js');
// const authConfig = require('./config/auth.js');
// const recordFormConfig = require('./form-config/gitlab-1.0-draft.js');

// module.exports = function (sails) {
//   return {
//     initialize: function (cb) {
//       //To test run with: NODE_ENV=test mocha
//       //The Hook is environment specific, that is, the environments are also available whenever the sails app is hooked
//       let angularDest;
//       let angularOrigin;
//       ncp.limit = 16;
//       const angularTmpDest = '.tmp/public/angular/gitlab';
//       if (sails.config.environment === 'test') {
//         angularOrigin = './app/gitlab/src';
//         angularDest = 'test/angular/gitlab';
//       }
//       else {
//         angularOrigin = './node_modules/sails-hook-redbox-gitlab/app/gitlab/dist';
//         angularDest = './assets/angular/gitlab';
//       }
//       if (fs.existsSync(angularDest)) {
//         fs.removeSync(angularDest)
//       }
//       if (fs.existsSync(angularTmpDest)) {
//         fs.removeSync(angularTmpDest)
//       }
//       console.log('GitLab: Copying angular files');
//       ncp(angularOrigin, angularDest, function (err) {
//         if (err) {
//           return console.error(err);
//         }
//         ncp(angularOrigin, angularTmpDest, function (err) {
//           if (err) {
//             return console.error(err);
//           }
//           return cb();
//         });
//       });
//     },
//     //If each route middleware do not exist sails.lift will fail during hook.load()
//     routes: {
//       before: {},
//       after: {
//         'get /:branding/:portal/ws/gitlab/info': GitlabController.info,
//         'get /:branding/:portal/ws/gitlab/user': GitlabController.user,
//         'post /:branding/:portal/ws/gitlab/token': GitlabController.token,
//         'get /:branding/:portal/ws/gitlab/revokeToken': GitlabController.revokeToken,
//         'get /:branding/:portal/ws/gitlab/projectsRelatedRecord': GitlabController.projectsRelatedRecord,
//         'post /:branding/:portal/ws/gitlab/link': GitlabController.link,
//         'post /:branding/:portal/ws/gitlab/checkRepo': GitlabController.checkRepo,
//         'post /:branding/:portal/ws/gitlab/create': GitlabController.create,
//         'post /:branding/:portal/ws/gitlab/createWithTemplate': GitlabController.createWithTemplate,
//         'post /:branding/:portal/ws/gitlab/project': GitlabController.project,
//         'post /:branding/:portal/ws/gitlab/updateProject': GitlabController.updateProject,
//         'get /:branding/:portal/ws/gitlab/groups': GitlabController.groups,
//         'get /:branding/:portal/ws/gitlab/templates': GitlabController.templates,
//       }
//     },
//     configure: function () {
//       sails.services['GitlabService'] = GitlabService;
//       sails.config = _.merge(sails.config, recordTypeConfig);
//       sails.config = _.merge(sails.config, workflowConfig);
//       sails.config = _.merge(sails.config, workspaceTypeConfig);
//       //sails.config['auth']['rules'] = _.merge(sails.config['auth']['rules'], authConfig);
//       sails.config['form']['forms'] = _.merge(sails.config['form']['forms'], {'gitlab-1.0-draft': recordFormConfig});
//     }
//   }
// };
