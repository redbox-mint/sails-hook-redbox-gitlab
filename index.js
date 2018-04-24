const ncp = require('ncp').ncp;
const fs = require('fs');
const _ = require('lodash');

const GitlabController = require('./api/controller/typescript/GitlabController');
const GitlabService = require('./api/services/typescript/GitlabService');
const recordTypeConfig = require('./config/recordtype.js');
const workflowConfig = require('./config/workflow.js');
const recordFormConfig = require('./form-config/gitlab-1.0-draft.js');

module.exports = function (sails) {
  return {
    initialize: function (cb) {
      let angularDest;
      let angularOrigin;
      ncp.limit = 16;
      //To test run NODE_ENV=test mocha
      if (sails.config.environment === 'test') { //TODO: the environment is specific to the HOOK development/test
        angularOrigin = './app/gitlab/src';
        angularDest = 'test/angular/gitlab';
      }
      else {
        angularOrigin = 'node_modules/sails-hook-redbox-gitlab/app/gitlab/src';
        angularDest = 'angular/gitlab';
      }
      if (fs.existsSync(angularDest)) {
        return cb();
      } else {
        ncp(angularOrigin, angularDest, function (err) {
          if (err) {
            return console.error(err);
          }
          return cb();
        });
      }
    },
    //If each route middleware do not exist sails.lift will fail during hook.load()
    routes: {
      before: {},
      after: {
        'get /:branding/:portal/ws/gitlab/user': GitlabController.user,
        'post /:branding/:portal/ws/gitlab/token': GitlabController.token,
        'get /:branding/:portal/ws/gitlab/revokeToken': GitlabController.revokeToken,
        'get /:branding/:portal/ws/gitlab/projectsRelatedRecord': GitlabController.projectsRelatedRecord,
        'post /:branding/:portal/ws/gitlab/link': GitlabController.link,
        'post /:branding/:portal/ws/gitlab/checkRepo': GitlabController.checkRepo,
        'post /:branding/:portal/ws/gitlab/create': GitlabController.create,
        'post /:branding/:portal/ws/gitlab/createWithTemplate': GitlabController.createWithTemplate,
        'post /:branding/:portal/ws/gitlab/project': GitlabController.project,
        'post /:branding/:portal/ws/gitlab/updateProject': GitlabController.updateProject,
        'get /:branding/:portal/ws/gitlab/groups': GitlabController.groups,
        'get /:branding/:portal/ws/gitlab/templates': GitlabController.templates,
      }
    },
    configure: function () {
      //sails.config['GitlabService'] = GitlabService;
      sails.config = _.merge(sails.config, recordTypeConfig);
      sails.config = _.merge(sails.config, workflowConfig);
      sails.config['form']['forms'] = _.merge(sails.config['form']['forms'], {'gitlab-1.0-draft': recordFormConfig});
    }
  }
};
