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

            if( this._contextObj.get(this.loadNotificationsAttribute)){
                this._execMf(this._contextObj.getGuid(), this.loadMicroflow, function(objs){
                        
                        for( var i = 0; i < objs.length; i++){                        
                            self._createNotification(objs[i]);
                        }

                        mendix.lang.nullExec(callback);
                    });

            }
            else{
                mendix.lang.nullExec(callback);
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

            if(this.onClickMicroflow){
                options.onclick = function () {
                        self._execMf(obj.getGuid(), self.onClickMicroflow);
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

        }
    });
});

require(["toastrForMendix/widget/toastrForMendix"]);