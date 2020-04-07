/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject"],function(M){"use strict";var D=M.extend("sap.f.cards.DataProvider",{metadata:{events:{dataChanged:{parameters:{data:{type:"object"}}},error:{parameters:{message:{type:"string"}}}}}});D.prototype.setDestinations=function(d){this._oDestinations=d;};D.prototype.setSettings=function(s){this._oSettings=s;};D.prototype.getSettings=function(){return this._oSettings;};D.prototype.triggerDataUpdate=function(){return this.getData().then(function(d){this.fireDataChanged({data:d});}.bind(this)).catch(function(e){this.fireError({message:e});}.bind(this));};D.prototype.getData=function(){var d=this.getSettings();return new Promise(function(r,a){if(d.json){r(d.json);}else{a("Could not get card data.");}});};D.prototype.setUpdateInterval=function(i){var v=parseInt(i);if(!v){return;}if(this._iIntervalId){clearInterval(this._iIntervalId);}this._iIntervalId=setInterval(function(){this.triggerDataUpdate();}.bind(this),v*1000);};D.prototype.destroy=function(){if(this._iIntervalId){clearInterval(this._iIntervalId);this._iIntervalId=null;}this._oSettings=null;M.prototype.destroy.apply(this,arguments);};return D;});
