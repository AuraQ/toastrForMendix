/*
    toastrForMendix
    ========================

    @file      : toastrForMendix.js
    @version   : 1.1.0
    @author    : Iain Lindsay
    @date      : 2023-07-12
    @copyright : AuraQ Limited 2021
    @license   : Apache V2

    Documentation
    ========================
    Notification widget built using toastr (http://www.toastrjs.com).
*/

define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "jquery",
    "toastr",
    "./ui/toastrForMendix.css"
], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent, $, toastr) {
    "use strict";

    return declare("toastrForMendix.widget.toastrForMendix", [ _WidgetBase ], {


        // Internal variables.
        _handles: null,
        _contextObj: null,
        _exists: [],

        constructor: function () { 
            this._handles = [];
        },

        postCreate: function () {
            console.debug(this.id + ".postCreate");         
        },

        update: function (obj, callback) {
            console.debug(this.id + ".update");

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering(callback);
        },

        resize: function (box) {
          console.debug(this.id + ".resize");
        },

        uninitialize: function () {
            console.debug(this.id + ".uninitialize");
            this._removeAll();
        },

        _updateRendering: function (callback) {
            console.debug(this.id + "._updateRendering");
            var self = this;

            if (this._contextObj && this._contextObj.get(this.loadNotificationsAttribute)) {
                this._execMf(this._contextObj.getGuid(), this.loadMicroflow, function(toAdd) {
                        var toRemove = self._exists;

                        if (toAdd) {
                            for (var i = 0; i < toAdd.length; i++) {                        
                                var exists = self._findExists(toAdd[i].getGuid());

                                if (!exists) {
                                    var notification = self._createNotification(toAdd[i]);
                                    if (notification) {
                                        self._addExists(toAdd[i].getGuid(), notification)
                                    }
                                } else {
                                    toastr.clear(exists.notification);
                                    exists.notification = self._createNotification(toAdd[i]);
                                }

                                toRemove = dojoArray.filter(toRemove, function(item) {
                                    return item.objGuid !== toAdd[i].getGuid()
                                });
                            }
                        }

                        if (toRemove) {
                            for (var i = 0; i < toRemove.length; i++) {                        
                                toastr.clear(toRemove[i].notification);
                                self._removeExists(toRemove[i].objGuid);
                            }
                        }
                    });
            } else {
                this._removeAll();
            }

            self._executeCallback(callback, "_updateRendering");
        },

        _getOptionsForObject : function(obj){
            var self = this;
            var options = {};
            options.closeButton = this.showCloseAttribute ? obj.get(this.showCloseAttribute) : this.showCloseDefault;
            options.progressBar = this.showProgressAttribute ? obj.get(this.showProgressAttribute) : this.showProgressDefault;
            options.tapToDismiss = this.tapToDismissAttribute ? obj.get(this.tapToDismissAttribute) : this.tapToDismissDefault;
            options.positionClass = this.positionClassAttribute ? obj.get(this.positionClassAttribute) : this.positionClassDefault.split('_').join('-');
            options.showDuration = Number(this.showDurationAttribute ? obj.get(this.showDurationAttribute) : this.showDurationDefault);
            options.hideDuration = Number(this.hideDurationAttribute ? obj.get(this.hideDurationAttribute) : this.hideDurationDefault);
            options.timeOut = Number(this.timeoutAttribute ? obj.get(this.timeoutAttribute) : this.timeoutDefault);
            options.extendedTimeOut = Number(this.extendedTimeoutAttribute ? obj.get(this.extendedTimeoutAttribute) : this.extendedTimeoutDefault);
            options.showEasing = this.showEasing;
            options.hideEasing = this.hideEasing;
            options.showMethod = this.showMethod;
            options.hideMethod = this.hideMethod;
            options.debug = this.debug;
            options.preventDuplicates = this.preventDuplicates;
            options.newestOnTop = this.newestOnTop;

            if(this.toastClass){
                options.toastClass = this.toastClass;
            }
            if(this.errorIconClass || this.infoIconClass || this.successIconClass || this.warningIconClass){
                options.iconClasses = {};            
                if(this.errorIconClass){
                    options.iconClasses.error = this.errorIconClass;
                }

                if(this.infoIconClass){
                    options.iconClasses.info = this.infoIconClass;
                }

                if(this.successIconClass){
                    options.iconClasses.success = this.successIconClass;
                }

                if(this.warningIconClass){
                    options.iconClasses.warning = this.warningIconClass;
                }
            }

            if(this.onClickMicroflow){
                options.onclick = function () {
                        self._execMf(obj.getGuid(), self.onClickMicroflow);
                };
            }

            if(this.onCloseClickMicroflow){
                options.onCloseClick = function () {
                        self._removeExists(obj.getGuid());
                        self._execMf(obj.getGuid(), self.onCloseClickMicroflow);
                };
            }
            else{
                options.onCloseClick = function () {
                        self._removeExists(obj.getGuid());
                };
            }


            if(this.onHiddenMicroflow){
                options.onHidden = function () {
                        self._removeExists(obj.getGuid());
                        self._execMf(obj.getGuid(), self.onHiddenMicroflow);
                };
            }
            else{
                options.onHidden = function () {
                        self._removeExists(obj.getGuid());
                };
            }


            if(this.onShownMicroflow){
                options.onShown = function () {
                        self._execMf(obj.getGuid(), self.onShownMicroflow);
                };
            }
            
            return options;
        },

        _createNotification: function(obj){
            var options = this._getOptionsForObject(obj);
            var type = this.typeAttribute ? obj.get(this.typeAttribute).toLowerCase() : this.typeDefault;
            var title = obj.get(this.titleAttribute);
            var message = obj.get(this.messageAttribute);
            
            toastr.options = options;
            return toastr[type](message, title);
        },        

        _findExists: function(objGuid) {
            return dojoArray.filter(this._exists, function(item) {
                return item.objGuid === objGuid;
            })[0]
        },

        _addExists: function(objGuid, notification) {
            this._exists.push({ objGuid, notification });
        },

        _removeExists: function(objGuid) {
            this._exists = dojoArray.filter(this._exists, function(item) {
                return item.objGuid !== objGuid;
            })
        },

        _removeAll: function() {
            for (var i = 0; i < this._exists.length; i++) {                        
                toastr.clear(this._exists[i].notification);
            }
            this._exists = [];
        },

        _execMf: function (guid, mf, cb) {
            if (guid && mf) {
                mx.data.action({
                    params: {
                        applyto: 'selection',
                        actionname: mf,
                        guids: [guid]
                    },
                    callback: function (objs) {
                        if (cb) {
                            cb(objs);
                        }
                    },
                    error: function (e) {
                        console.error('Error running Microflow: ' + e);
                    }
                }, this);
            }

        },

        // Reset subscriptions.
        _resetSubscriptions: function() {
            console.debug(this.id + "._resetSubscriptions");

            // Release handles on previous object, if any.
            this.unsubscribeAll();

            // When a mendix object exists create subscriptions.
            if (this._contextObj) {
                var objectHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: dojoLang.hitch(this, function(guid) {
                        this._updateRendering();
                    })
                });

            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            console.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});
