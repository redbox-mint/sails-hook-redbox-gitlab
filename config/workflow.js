module.exports.workflow = {
  "gitlab": {
    "draft": {
      config: {
        workflow: {
          stage: 'draft',
          stageLabel: 'Draft',
        },
        authorization: {
          viewRoles: ['Admin', 'Librarians'],
          editRoles: ['Admin', 'Librarians']
        },
        form: 'gitlab-1.0-draft'
      },
      starting: true
    }
  }
}
