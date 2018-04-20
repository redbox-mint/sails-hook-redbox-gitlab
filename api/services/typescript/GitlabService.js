"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Rx_1 = require("rxjs/Rx");
var services = require("../../typescript/services/CoreService.js");
var request = require("request-promise");
var Services;
(function (Services) {
    var GitlabService = (function (_super) {
        __extends(GitlabService, _super);
        function GitlabService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'token',
                'user',
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
            return _this;
        }
        GitlabService.prototype.token = function (config, username, password) {
            var post = request({
                uri: config.host + '/oauth/token',
                method: 'POST',
                body: {
                    grant_type: 'password', username: username, password: password
                },
                json: true
            });
            return Rx_1.Observable.fromPromise(post);
        };
        GitlabService.prototype.user = function (config, token) {
            var get = request({
                uri: config.host + ("/api/v4/user?access_token=" + token),
                json: true
            });
            return Rx_1.Observable.fromPromise(get);
        };
        GitlabService.prototype.project = function (_a) {
            var config = _a.config, token = _a.token, pathWithNamespace = _a.pathWithNamespace;
            pathWithNamespace = encodeURIComponent(pathWithNamespace);
            var get = request({
                uri: config.host + ("/api/v4/projects/" + pathWithNamespace + "?access_token=" + token),
                json: true
            });
            return Rx_1.Observable.fromPromise(get);
        };
        GitlabService.prototype.projects = function (_a) {
            var config = _a.config, token = _a.token;
            var get = request({
                uri: config.host + ("/api/v4/projects?membership=true&access_token=" + token),
                json: true
            });
            return Rx_1.Observable.fromPromise(get);
        };
        GitlabService.prototype.fork = function (config, token, creation) {
            var origin = creation.template.id;
            var body = {};
            if (!creation.group.isUser) {
                body = { namespace: creation.group.id };
            }
            var post = request({
                uri: config.host + ("/api/v4/projects/" + origin + "/fork?access_token=" + token),
                method: 'POST',
                body: body,
                json: true
            });
            return Rx_1.Observable.fromPromise(post);
        };
        GitlabService.prototype.deleteForkRel = function (config, token, namespace, project) {
            var projectNameSpace = encodeURIComponent(namespace + '/' + project);
            var deleteRequest = request({
                uri: config.host + ("/api/v4/projects/" + projectNameSpace + "/fork?access_token=" + token),
                method: 'DELETE',
                json: true
            });
            return Rx_1.Observable.fromPromise(deleteRequest);
        };
        GitlabService.prototype.addWorkspaceInfo = function (config, token, branch, project, workspaceLink, filePath) {
            var projectNameSpace = encodeURIComponent(project.path_with_namespace);
            var post = request({
                uri: config.host + ("/api/v4/projects/" + projectNameSpace + "/repository/files/" + filePath + "?access_token=" + token),
                method: 'POST',
                body: {
                    branch: branch,
                    content: workspaceLink,
                    author_name: 'Stash',
                    commit_message: 'provisioner bot'
                },
                json: true
            });
            return Rx_1.Observable.fromPromise(post);
        };
        GitlabService.prototype.readFileFromRepo = function (config, token, branch, projectNameSpace, filePath) {
            var encodeProjectNameSpace = encodeURIComponent(projectNameSpace);
            var get = request({
                uri: config.host + ("/api/v4/projects/" + encodeProjectNameSpace + "/repository/files/" + filePath + "?ref=" + branch + "&access_token=" + token + "&namespace=" + encodeProjectNameSpace),
                json: true,
                method: 'GET',
                resolveWithFullResponse: true
            });
            return Rx_1.Observable.fromPromise(get).catch(function (error) {
                if (error.statusCode === 404 || error.statusCode === 403) {
                    return Rx_1.Observable.of({ path: projectNameSpace, content: {} });
                }
                else {
                    return Rx_1.Observable.throw(error);
                }
            });
        };
        GitlabService.prototype.create = function (config, token, creation) {
            var body = {
                name: creation.name,
                description: creation.description
            };
            if (creation.namespaceId) {
                body['namespace_id'] = creation.namespaceId;
            }
            var post = request({
                uri: config.host + ("/api/v4/projects?access_token=" + token),
                method: 'POST',
                body: body,
                json: true
            });
            return Rx_1.Observable.fromPromise(post);
        };
        GitlabService.prototype.updateProject = function (config, token, pathWithNamespace, project) {
            pathWithNamespace = encodeURIComponent(pathWithNamespace);
            var body = {};
            project.attributes.map(function (p) { body[p.name] = p.newValue; });
            var put = request({
                uri: config.host + ("/api/v4/projects/" + pathWithNamespace + "?access_token=" + token),
                method: 'PUT',
                body: body,
                json: true
            });
            return Rx_1.Observable.fromPromise(put);
        };
        GitlabService.prototype.groups = function (config, token) {
            var get = request({
                uri: config.host + ("/api/v4/groups?access_token=" + token),
                json: true
            });
            return Rx_1.Observable.fromPromise(get);
        };
        GitlabService.prototype.templates = function (config, token, templateTag) {
            var get = request({
                uri: config.host + ("/api/v4/projects?access_token=" + token),
                json: true
            });
            return get
                .then(function (response) {
                var templates = response.filter(function (o) { return o.tag_list.find(function (t) { return t === templateTag; }); });
                return Rx_1.Observable.of(templates);
            }).catch(function (error) {
                return Rx_1.Observable.throw(error);
            });
        };
        return GitlabService;
    }(services.Services.Core.Service));
    Services.GitlabService = GitlabService;
    var Config = (function () {
        function Config() {
        }
        return Config;
    }());
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.GitlabService().exports();
