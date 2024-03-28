/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  workspaces: {
    // portal: {
    //   authorization: 'Bearer 123123'
    // },
    provisionerUser: 'admin',
    parentRecord: 'rdmp',
    gitlab: {
      parentRecord: 'rdmp',
      formName: 'gitlab-1.0-draft',
      workflowStage: 'draft',
      appName: 'gitlab',
      appId: 'git-test',
      recordType: 'gitlab',
      host: '',
    }
  }
};
