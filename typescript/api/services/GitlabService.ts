import {Observable, from, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators/catchError';

import {Sails, Model} from "sails";
import * as requestPromise from "request-promise";

import services = require('../core/CoreService.js');

declare var RecordsService, BrandingService;
declare var sails: Sails;
declare var _this;
declare var Institution, User: Model;

export module Services {

  export class GitlabService extends services.Services.Core.Service {

    protected _exportedMethods: any = [
      'token',
      'user',
      'project',
      'projects',
      'readFileFromRepo',
      'revokeToken',
      'create',
      'fork',
      'project',
      'updateProject',
      'groups',
      'templates',
      'addWorkspaceInfo'
    ];

    token(config: any, username: string, password: string) {
      const post = requestPromise({
        uri: config.host + '/oauth/token',
        method: 'POST',
        body: {
          grant_type: 'password', username: username, password: password
        },
        json: true
      });
      return from(post);
    }

    user(config: any, token: string) {
      const get = requestPromise({
        uri: config.host + `/api/v4/user?access_token=${token}`,
        json: true
      });
      return from(get);
    }

    project({config, token, pathWithNamespace}) {
      pathWithNamespace = encodeURIComponent(pathWithNamespace);
      const get = requestPromise({
        uri: config.host + `/api/v4/projects/${pathWithNamespace}?access_token=${token}`,
        json: true
      });
      return from(get);
    }

    projects({config, token, page, perPage}) {
      const url = `/api/v4/projects?membership=true&access_token=${token}&order_by=created_at&page=${page}&per_page=${perPage}&simple=false&sort=desc`;
      const get = requestPromise({
        uri: config.host + url,
        json: true,
        resolveWithFullResponse: true
      });
      return from(get);
    }

    fork(config: any, token: string, creation: any) {
      const origin = creation.template.id;
      let body = {};
      if (!creation.group.isUser) {
        body = {namespace: creation.group.id};
      }
      const post = requestPromise({
        uri: config.host + `/api/v4/projects/${origin}/fork?access_token=${token}`,
        method: 'POST',
        body: body,
        json: true
      });
      return from(post);
    }

    deleteForkRel(config: any, token: string, namespace: string, project: string) {
      const projectNameSpace = encodeURIComponent(namespace + '/' + project);
      const deleteRequest = requestPromise({
        uri: config.host + `/api/v4/projects/${projectNameSpace}/fork?access_token=${token}`,
        method: 'DELETE',
        json: true
      });
      return from(deleteRequest);
    }

    addWorkspaceInfo({config, token, branch, pathWithNamespace, project, workspaceLink, filePath}) {
      const projectNameSpace = encodeURIComponent(pathWithNamespace);
      const post = requestPromise({
        uri: config.host + `/api/v4/projects/${projectNameSpace}/repository/files/${filePath}?access_token=${token}`,
        method: 'POST',
        body: {
          branch: branch,
          content: workspaceLink,
          author_name: 'Stash',
          commit_message: 'provisioner bot'//TODO: define message via config file or form?
        },
        json: true
      });
      return from(post);
    }

    readFileFromRepo(config: any, token: string, branch: string, projectNameSpace: string, filePath: string) {
      const encodeProjectNameSpace = encodeURIComponent(projectNameSpace);
      const get = requestPromise({
        uri: config.host + `/api/v4/projects/${encodeProjectNameSpace}/repository/files/${filePath}?ref=${branch}&access_token=${token}&namespace=${encodeProjectNameSpace}`,
        json: true,
        method: 'GET',
        resolveWithFullResponse: true
      });
      return from(get)
        .pipe(
          catchError(error => {
            if (error.statusCode === 404 || error.statusCode === 403) {
              return of({path: projectNameSpace, content: {}});
            } else {
              return throwError(error);
            }
          })
        );
    }

    create(config: any, token: string, creation: any, group: any) {
      const body = {
        name: creation.name,
        description: creation.description
      };
      if (!group.isUser && group.id) {
        body['namespace_id'] = group.id
      }
      const post = requestPromise({
        uri: config.host + `/api/v4/projects?access_token=${token}`,
        method: 'POST',
        body: body,
        json: true
      });
      return from(post);
    }

    updateProject(config: any, token: string, pathWithNamespace: string, project: any) {
      pathWithNamespace = encodeURIComponent(pathWithNamespace);
      const body = {};
      project.attributes.map(p => {
        body[p.name] = p.newValue;
      });
      const put = requestPromise({
        uri: config.host + `/api/v4/projects/${pathWithNamespace}?access_token=${token}`,
        method: 'PUT',
        body: body,
        json: true
      });
      return from(put);
    }

    groups(config: any, token: string) {
      // Gets all groups that user has access to and can create projects;
      // Group access 50 owner  TODO: see if and how to do with group level 40 => Maintainer access
      // https://docs.gitlab.com/ce/api/members.html
      // https://docs.gitlab.com/ce/user/permissions.html#group-members-permissions
      const get = requestPromise({
        uri: config.host + `/api/v4/groups?access_token=${token}&owned=true&min_access_level=50`,
        json: true
      });
      return from(get);
    }

    templates(config: any, token: string, templateTag: string) {
      // Gets templates from all projects that the user has min_access_level of 20
      // https://docs.gitlab.com/ce/api/members.html
      // https://docs.gitlab.com/ce/api/projects.html#list-all-projects
      const get = requestPromise({
        uri: config.host + `/api/v4/projects?access_token=${token}&min_access_level=20`,
        json: true
      });
      return get
        .then(response => {
          const templates = response.filter(o => o.tag_list.find(t => t === templateTag));
          return of(templates);
        }).catch(error => {
          return Observable.throw(error);
        });
    }

  }

}

module.exports = new Services.GitlabService().exports();
