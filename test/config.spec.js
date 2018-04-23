const assert = require('assert');
const _ = require('lodash');
const recordFormConfig = require('../form-config/gitlab-1.0-draft.js');

describe('Merge config ::', function () {

  var sails;

  before(function (done) {
    sails = {
      config: {
        form: {
          forms: {
            'form-1.0-draft.js': {},
            'form-2.0-draft.js': {}
          }
        }
      }
    };

    done();
  });


  it('should merge config', function (done) {
    sails.config['form']['forms'] = _.merge(sails.config['form']['forms'], {'gitlab-1.0-draft': recordFormConfig});
    assert.deepEqual(sails.config.form.forms['gitlab-1.0-draft'], recordFormConfig);
    done();
  });

});
