"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require('lodash');
var pathExists = require("path-exists");
var Controllers;
(function (Controllers) {
    var Core;
    (function (Core) {
        var Controller = (function () {
            function Controller() {
                this._config = {};
                this._exportedMethods = [];
                this._theme = 'default';
                this._layout = 'default';
                this._layoutRelativePath = '../_layouts/';
                this._defaultExportedMethods = [
                    '_config',
                ];
            }
            Controller.prototype.exports = function () {
                var methods = this._defaultExportedMethods.concat(this._exportedMethods);
                var exportedMethods = {};
                for (var i = 0; i < methods.length; i++) {
                    if (typeof this[methods[i]] !== 'undefined') {
                        if (methods[i][0] !== '_' || methods[i] === '_config') {
                            if (_.isFunction(this[methods[i]])) {
                                exportedMethods[methods[i]] = this[methods[i]].bind(this);
                            }
                            else {
                                exportedMethods[methods[i]] = this[methods[i]];
                            }
                        }
                        else {
                            console.error('The method "' + methods[i] + '" is not public and cannot be exported. ' + this);
                        }
                    }
                    else {
                        console.error('The method "' + methods[i] + '" does not exist on the controller ' + this);
                    }
                }
                return exportedMethods;
            };
            Controller.prototype._handleRequest = function (req, res, callback, options) {
                if (options === void 0) { options = {}; }
                callback(req, res, options);
            };
            Controller.prototype.index = function (req, res, callback, options) {
                if (options === void 0) { options = {}; }
                res.notFound();
            };
            Controller.prototype._getResolvedView = function (branding, portal, view) {
                var resolvedView = null;
                var viewToTest = sails.config.appPath + "/views/" + branding + "/" + portal + "/" + view + ".ejs";
                if (pathExists.sync(viewToTest)) {
                    resolvedView = branding + "/" + portal + "/" + view;
                }
                if (resolvedView == null) {
                    viewToTest = sails.config.appPath + "/views/default/" + portal + "/" + view + ".ejs";
                    if (pathExists.sync(viewToTest)) {
                        resolvedView = "default/" + portal + "/" + view;
                    }
                }
                if (resolvedView == null) {
                    viewToTest = sails.config.appPath + "/views/default/default/" + view + ".ejs";
                    if (pathExists.sync(viewToTest)) {
                        resolvedView = "default/default/" + view;
                    }
                }
                return resolvedView;
            };
            Controller.prototype._getResolvedLayout = function (branding, portal) {
                var resolvedLayout = null;
                var layoutToTest = sails.config.appPath + "/views/" + branding + "/" + portal + "/layout/layout.ejs";
                if (pathExists.sync(layoutToTest)) {
                    resolvedLayout = branding + "/" + portal + "/layout";
                }
                if (resolvedLayout == null) {
                    layoutToTest = sails.config.appPath + "/views/default/" + portal + "/layout.ejs";
                    if (pathExists.sync(layoutToTest)) {
                        resolvedLayout = "/default/" + portal + "/layout";
                    }
                }
                if (resolvedLayout == null) {
                    layoutToTest = sails.config.appPath + "/views/default/default/" + "layout.ejs";
                    if (pathExists.sync(layoutToTest)) {
                        resolvedLayout = "default/default/layout";
                    }
                }
                return resolvedLayout;
            };
            Controller.prototype.sendView = function (req, res, view, locals) {
                if (locals === void 0) { locals = {}; }
                if (req.options.locals == null) {
                    req.options.locals = {};
                }
                var mergedLocal = Object.assign({}, req.options.locals, locals);
                var branding = mergedLocal['branding'];
                var portal = mergedLocal['portal'];
                var resolvedView = this._getResolvedView(branding, portal, view);
                var resolvedLayout = this._getResolvedLayout(branding, portal);
                if (resolvedLayout != null && mergedLocal["layout"] != false) {
                    res.locals.layout = resolvedLayout;
                }
                if (resolvedView == null) {
                    res.notFound(mergedLocal, "404");
                }
                mergedLocal.view = {};
                mergedLocal.view.pathFromApp = resolvedView;
                mergedLocal.view.ext = 'ejs';
                _.merge(mergedLocal, this.getNg2Apps(view));
                sails.log.error("resolvedView");
                sails.log.error(resolvedView);
                sails.log.error("mergedLocal");
                sails.log.error(mergedLocal);
                res.view(resolvedView, mergedLocal);
            };
            Controller.prototype.respond = function (req, res, ajaxCb, normalCb, forceAjax) {
                if (req.headers['x-source'] == 'jsclient' || forceAjax == true) {
                    return ajaxCb(req, res);
                }
                else {
                    return normalCb(req, res);
                }
            };
            Controller.prototype.ajaxOk = function (req, res, msg, data, forceAjax) {
                if (msg === void 0) { msg = ''; }
                if (data === void 0) { data = null; }
                if (forceAjax === void 0) { forceAjax = false; }
                if (!data) {
                    data = { status: true, message: msg };
                }
                this.ajaxRespond(req, res, data, forceAjax);
            };
            Controller.prototype.ajaxFail = function (req, res, msg, data, forceAjax) {
                if (msg === void 0) { msg = ''; }
                if (data === void 0) { data = null; }
                if (forceAjax === void 0) { forceAjax = false; }
                if (!data) {
                    data = { status: false, message: msg };
                }
                this.ajaxRespond(req, res, data, forceAjax);
            };
            Controller.prototype.ajaxRespond = function (req, res, jsonObj, forceAjax) {
                if (jsonObj === void 0) { jsonObj = null; }
                var notAjaxMsg = "Got non-ajax request, don't know what do...";
                this.respond(req, res, function (req, res) {
                    return res.json(jsonObj);
                }, function (req, res) {
                    sails.log.verbose(notAjaxMsg);
                    res.notFound(notAjaxMsg);
                }, forceAjax);
            };
            Controller.prototype.getNg2Apps = function (viewPath) {
                if (sails.config.ng2.use_bundled && sails.config.ng2.apps[viewPath]) {
                    return { ng2_apps: sails.config.ng2.apps[viewPath] };
                }
                else {
                    return { ng2_apps: [] };
                }
            };
            return Controller;
        }());
        Core.Controller = Controller;
    })(Core = Controllers.Core || (Controllers.Core = {}));
})(Controllers = exports.Controllers || (exports.Controllers = {}));
