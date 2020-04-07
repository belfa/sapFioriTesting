/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/rta/command/BaseCommand","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/fl/Utils","sap/base/Log","sap/base/util/merge","sap/ui/fl/write/api/ChangesWriteAPI","sap/base/util/values"],function(B,J,f,L,m,C,o){"use strict";var F=B.extend("sap.ui.rta.command.FlexCommand",{metadata:{library:"sap.ui.rta",properties:{changeType:{type:"string"},jsOnly:{type:"boolean"},selector:{type:"object"}},associations:{},events:{}}});F.prototype.getElementId=function(){var e=this.getElement();return e?e.getId():this.getSelector().id;};F.prototype.getAppComponent=function(){var e=this.getElement();return e?f.getAppComponentForControl(e):this.getSelector().appComponent;};F.prototype.prepare=function(a,v){var s;if(!this.getSelector()&&a&&a.templateSelector){s={id:a.templateSelector,appComponent:this.getAppComponent(),controlType:f.getControlType(sap.ui.getCore().byId(a.templateSelector))};this.setSelector(s);}else if(!this.getSelector()&&this.getElement()){s={id:this.getElement().getId(),appComponent:this.getAppComponent(),controlType:f.getControlType(this.getElement())};this.setSelector(s);}return this._createChange(a,v).then(function(c){this._oPreparedChange=c;return true;}.bind(this)).catch(function(e){L.error(e.message||e.name);return false;});};F.prototype.getPreparedChange=function(){return this._oPreparedChange;};F.prototype.execute=function(){var c=this.getPreparedChange();return this._applyChange(c);};F.prototype._getChangeSpecificData=function(){var p=this.getMetadata().getProperties();var c={changeType:this.getChangeType()};o(p).filter(function(P){return P.group==="content";}).forEach(function(P){c[P.name]=P.get(this);},this);return c;};F.prototype._createChange=function(a,v){return this._createChangeFromData(this._getChangeSpecificData(),a,v);};F.prototype._createChangeFromData=function(c,a,v){if(a){c=m({},c,a);}c.jsOnly=this.getJsOnly();var M=this.getAppComponent().getModel(f.VARIANT_MODEL_NAME);var V;if(M&&v){V=M.getCurrentVariantReference(v);}var b={variantManagementReference:v,variantReference:V};if(V){c=Object.assign({},c,b);}return C.create({changeSpecificData:c,selector:this._validateControlForChange(a)}).then(function(d){if(a&&a.originalSelector){d.addDependentControl(a.originalSelector,"originalSelector",{modifier:J,appComponent:this.getAppComponent()});d.getDefinition().selector=Object.assign(d.getDefinition().selector,J.getSelector(this.getSelector().id,this.getSelector().appComponent));d.setContent(Object.assign({},d.getContent(),a.content));}return d;}.bind(this));};F.prototype.undo=function(){var c=this.getElement()||J.bySelector(this.getSelector());var a=this.getPreparedChange();return C.revert({change:a,element:c});};F.prototype._applyChange=function(c){var a=c.change||c;var A=this.getAppComponent();var s=J.bySelector(a.getSelector(),A);var p={modifier:J,appComponent:A,view:f.getViewForControl(s)};return C.apply(Object.assign({change:a,element:s},p)).then(function(r){if(!r.success){return Promise.reject(r.error);}});};F.prototype._validateControlForChange=function(a){if(a&&a.originalSelector&&a.content&&a.content.boundAggregation){return{id:a.originalSelector,appComponent:this.getAppComponent(),controlType:f.getControlType(sap.ui.getCore().byId(a.originalSelector))};}return this.getElement()||this.getSelector();};return F;});