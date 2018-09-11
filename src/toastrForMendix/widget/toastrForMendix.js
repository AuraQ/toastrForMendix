/*global logger*/
/*
    toastrForMendix
    ========================

    @file      : toastrForMendix.js
    @version   : 1.0.0
    @author    : Iain Lindsay
    @date      : 2017-03-27
    @copyright : AuraQ Limited 2017
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
    "toastrForMendix/lib/jquery-1.11.2",
    "toastrForMendix/lib/toastr",

], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent, _jQuery, _toastr) {
    "use strict";

    var $ = _jQuery.noConflict(true); 
    $ = _toastr.createInstance($);

    return declare("toastrForMendix.widget.toastrForMendix", [ _WidgetBase ], {


        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function () { 
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");         
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering(callback);
        },

        resize: function (box) {
          logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
          logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");
            var self = this;

            if( this._contextObj && this._contextObj.get(this.loadNotificationsAttribute)){
                this._execMf(this._contextObj.getGuid(), this.loadMicroflow, function(objs){
                        if (objs) {
                            for( var i = 0; i < objs.length; i++){                        
                                self._createNotification(objs[i]);
                            }
                        }

                        if (callback) callback();
                    });

            }
            else{
                if (callback) callback();
            }
        },

        _getOptionsForObject : function(obj){
            var self = this;
            var options = {};
            options.closeButton = this.showCloseAttribute ? obj.get(this.showCloseAttribute) : this.showCloseDefault;
            options.progressBar = this.showProgressAttribute ? obj.get(this.showProgressAttribute) : this.showProgressDefault;
            options.tapToDismiss = this.tapToDismissAttribute ? obj.get(this.tapToDismissAttribute) : this.tapToDismissDefault;
            options.positionClass = this.positionClassAttribute ? obj.get(this.positionClassAttribute) : this.positionClassDefault.split('_').join('-');
            options.showDuration = this.showDurationAttribute ? obj.get(this.showDurationAttribute) : this.showDurationDefault;
            options.hideDuration = this.hideDurationAttribute ? obj.get(this.hideDurationAttribute) : this.hideDurationDefault;
            options.timeOut = this.timeoutAttribute ? obj.get(this.timeoutAttribute) : this.timeoutDefault;
            options.extendedTimeOut = this.extendedTimeoutAttribute ? obj.get(this.extendedTimeoutAttribute) : this.extendedTimeouDefault;
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
                        self._execMf(obj.getGuid(), self.onCloseClickMicroflow);
                };
            }

            if(this.onHiddenMicroflow){
                options.onHidden = function () {
                        self._execMf(obj.getGuid(), self.onHiddenMicroflow);
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
            var type = this.typeAttribute ? obj.get(this.typeAttribute) : this.typeDefault;
            var title = obj.get(this.titleAttribute);
            var message = obj.get(this.messageAttribute);

            toastr.options = options;

            toastr[type](message, title);
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
                        logger.error('Error running Microflow: ' + e);
                    }
                }, this);
            }

        },

        // Reset subscriptions.
        _resetSubscriptions: function() {
            logger.debug(this.id + "._resetSubscriptions");

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
    });
});

require(["toastrForMendix/widget/toastrForMendix"]);