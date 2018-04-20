const local = require('./config/local');
const GitlabController = require('./api/controller/GitlabController');
const GitlabService = require('./api/services/GitlabService');
const recordTypeConfig = require('./config/recordType.js');
const workflowConfig = require('./config/workflow.js');
const recordFormConfig = require('./form-config/gitlab-1.0-draft.js');

module.exports = function (sails) {

  // Declare a var that will act as a reference to this hook.
  var hook;

  return {
    initialize: function (cb) {
      // Assign this hook object to the `hook` var.
      // This allows us to add/modify values that users of the hook can retrieve.
      hook = this;
      // Initialize a couple of values on the hook.
      hook.numRequestsSeen = 0;
      hook.numUnhandledRequestsSeen = 0;

      // if(env.production) {
      //   fs.copySync('angular/gitlab/assets', '../../.tmp/public/angular/gitlab');
      // } else {
        fs.copySync('angular/gitlab/src', '../../angular/gitlab');
      // }
      // Signal that initialization of this hook is complete
      // by calling the callback.
      return cb();
    },
    routes: {
      after: {
        'get /:branding/:portal/ws/gitlab/user': GitlabController.user,
        'post /:branding/:portal/ws/gitlab/token': GitlabController.token,
        'get /:branding/:portal/ws/gitlab/revokeToken': GitlabController.revokeToken,
        'get /:branding/:portal/ws/gitlab/projects': GitlabController.projects,
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
      sails.config['GitlabService'] = GitlabService;
      Object.assign(sails.config.recordtype, recordTypeConfig);
      Object.assign(sails.config.workflow, workflowConfig);
      Object.assign(sails.config.local, local);
      sails.config['form']['forms']['gitlab-1.0-draft.js'] = recordFormConfig;
    }
  }
};
