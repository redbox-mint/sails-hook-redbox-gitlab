/**
 * Gitlab form
 */
module.exports = {
  name: 'gitlab-1.0-draft',
  type: 'gitlab',
  customAngularApp: {
    appName: 'gitlab',
    appSelector: 'gitlab-form'
  },
  skipValidationOnSave: true,
  editCssClasses: 'row col-md-12',
  viewCssClasses: 'row col-md-offset-1 col-md-10',
  messages: {
    'saving': ['@dmpt-form-saving'],
    'validationFail': ['@dmpt-form-validation-fail-prefix', '@dmpt-form-validation-fail-suffix'],
    'saveSuccess': ['@dmpt-form-save-success'],
    'saveError': ['@dmpt-form-save-error']
  },
  fields: [
    {
      class: 'Container',
      compClass: 'TextBlockComponent',
      viewOnly: false,
      definition: {
        name: 'title',
        value: 'GitLab',
        type: 'h2'
      }
    },
    {
      class: 'Container',
      compClass: 'TextBlockComponent',
      viewOnly: false,
      definition: {
        name: 'subtitle',
        value: 'Workspaces',
        type: 'h3'
      }
    },
    {
      class: 'ListWorkspaceDataField',
      showHeader: true,
      definition: {
        name: 'ListWorkspaces',
        columns: [
          {'label': 'Name', 'property': 'name'},
          {'label': 'Description', 'property': 'description'},
          {'label': 'Location', 'property': 'web_url', 'link': 'true'}
        ],
        rdmpLinkLabel: 'Plan',
        syncLabel: 'Sync',
        // subscribe: {
        //   'LoginWorkspaceApp': {
        //     listWorkspaces: [{
        //       action: 'listWorkspaces'
        //     }]
        //   }
        // },
      }
    },
    {
      class: 'CreateWorkspaceField',
      showHeader: true,
      definition: {
        name: 'CreateWorkspace',
        recordMap: [
          {record: 'completeName', ele: 'completeName'},
          {record: 'id', ele: 'id'},
          {record: 'name', ele: 'name'},
          {record: 'location', ele: 'location'},
          {record: 'namespace', ele: 'namespace.path'},
          {record: 'description', ele: 'description'},
          {record: 'title', ele: 'title'}
        ],
        branch: 'master',
        createLabel: 'Create',
        dismissLabel: 'Ok',
        createWorkspaceLabel: 'Create Workspace',
        workspaceDetailsLabel: 'Workspace Details',
        selectSpace: 'Select Space',
        nameWorkspace: 'Name your workspace',
        nameHasSpacesValidation: 'Name should not include spaces',
        addDescription: 'Add a description',
        selectTemplate: 'Select Template',
        nameWorkspaceValidation: 'Name of the workspace is required',
        descriptionWorkspaceValidation: 'Description of the workspace is required',
        creatingWorkspace: 'Creating Workspace',
        linkingWorkspace: 'Linking Workspace',
        updatingWorkspace: 'Updating Workspace',
        workspaceCreated: 'Workspace Created'
      }
    },
    {
      class: 'LinkModalWorkspaceField',
      showHeader: true,
      definition: {
        name: 'LinkModal',
        workspaceDefinition: [
          {label: 'Name', name: 'name_with_namespace'},
          {label: 'URL', name: 'web_url'}
        ],
        recordMap: [
          {record: 'completeName', ele: 'name_with_namespace'},
          {record: 'id', ele: 'id'},
          {record: 'name', ele: 'name'},
          {record: 'location', ele: 'http_url_to_repo'},
          {record: 'namespace', ele: 'namespace.path'},
          {record: 'description', ele: 'description'},
          {record: 'title', ele: 'name_with_namespace'}
        ],
        checkField: 'name_with_namespace',
        checkBranch: 'master',
        linkModalTitle: 'Workspace Linking',
        workspaceDetailsTitle: 'Workspace Details',
        processingLabel: 'Processing Link',
        processingMessage: 'Checking your master workspace link ...',
        comparingLabel: 'Checking current links ...',
        statusLabel: 'No links, Linking to workspace ...',
        processingSuccess: 'Your workspace was linked succesfully',
        processingFail: 'Your workspace is linked with another RDMP',
        closeLabel: 'Ok'
      }
    },
    {
      class: 'LoginWorkspaceAppField',
      showHeader: true,
      definition: {
        name: 'LoginWorkspaceApp',
        usernameLabel: 'username',
        passwordLabel: 'password',
        loginLabel: 'Login',
        permissionStep: 'Stash is requesting from Gitlab the following permissions:',
        permissionList: [
          'Create Repositories',
          'Write information into your repositories'
        ],
        allowLabel: 'Allow',
        closeLabel: 'Close',
        loginErrorMessage: 'Please include username and password'
      }
    },
    {
      class: 'RevokeLoginWorkspaceAppField',
      showHeader: true,
      definition: {
        name: 'RevokeLogin',
        revokeLabel: 'Revoke Login Consent',
        permissionRevokeTitle: 'Remove permissions:',
        permissionRevoke: 'Stash will delete your permissions',
        closeLabel: 'Cancel'
      }
    },
    {
      class: "AnchorOrButton",
      viewOnly: false,
      definition: {
        name: "BackToPlan",
        label: 'Back to your Plan',
        value: '/@branding/@portal/record/edit/',
        cssClasses: 'btn btn-large btn-info',
        showPencil: false,
        controlType: 'anchor'
      },
      variableSubstitutionFields: ['value']
    }
  ]
};
