"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx_1 = require("rxjs/Rx");
var _ = require('lodash');
var Services;
(function (Services) {
    var Core;
    (function (Core) {
        var Service = (function () {
            function Service() {
                this._exportedMethods = [];
                this._defaultExportedMethods = [
                    '_config',
                ];
            }
            Service.prototype.getObservable = function (q, method, type) {
                if (method === void 0) { method = 'exec'; }
                if (type === void 0) { type = 'node'; }
                if (type == 'node')
                    return Rx_1.Observable.bindNodeCallback(q[method].bind(q))();
                else
                    return Rx_1.Observable.bindCallback(q[method].bind(q))();
            };
            Service.prototype.exec = function (q, successFn, errorFn) {
                this.getObservable(q).subscribe(successFn, errorFn);
            };
            Service.prototype.exports = function () {
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
            return Service;
        }());
        Core.Service = Service;
    })(Core = Services.Core || (Services.Core = {}));
})(Services = exports.Services || (exports.Services = {}));
