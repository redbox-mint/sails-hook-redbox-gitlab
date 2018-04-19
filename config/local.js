/**
 * Local related configuration
 */
module.exports = {
  workspaces: {
    provisionerUser: 'admin',
    parentRecord: 'rdmp',
    gitlab: {
      parentRecord: 'rdmp',
      formName: 'gitlab-1.0-draft',
      workflowStage: 'draft',
      appName: 'gitlab',
      appId: 'git-test',
      recordType: 'gitlab',
      host: 'https://git-test.research.uts.edu.au',
    }
  }
};
