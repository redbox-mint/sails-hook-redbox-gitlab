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
      ncp.limit = 16;
      //TODO: How to copy code and be able to test it at the same time??
      //ncp('node_modules/sails-hook-redbox-gitlab/angular/gitlab/src', 'angular/gitlab', function (err) {
      if (sails.config.environment !== 'test') {
        return cb();
      }
      if (fs.existsSync('app/gitlab')) {
        return cb();
      } else {
        ncp('./app/gitlab/src', 'test/angular/gitlab', function (err) {
          if (err) {
            return console.error(err);
          }
          return cb();
        });
      }
    },
    routes: {
      before: {},
      after: {
        'get /:branding/:portal/ws/gitlab/user': GitlabController.user,
        'post /:branding/:portal/ws/gitlab/token': GitlabController.token,
        'get /:branding/:portal/ws/gitlab/revokeToken': GitlabController.revokeToken,
        //'get /:branding/:portal/ws/gitlab/projects': GitlabController.projects,
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
      sails.config['workflow'] = _.merge(sails.config['recordtype'], recordTypeConfig);
      sails.config['workflow'] = _.merge(sails.config['workflow'], workflowConfig);
      sails.config['form']['forms'] = _.merge(sails.config['form']['forms'], {forms: {'gitlab-1.0-draft.js': recordFormConfig}});
    }
  }
};
