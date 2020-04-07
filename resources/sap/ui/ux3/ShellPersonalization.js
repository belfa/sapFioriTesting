/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','sap/ui/base/EventProvider','sap/ui/commons/Button','sap/ui/commons/Dialog','sap/ui/core/theming/Parameters','./ShellColorPicker','sap/ui/commons/library','sap/ui/core/HTML','sap/ui/core/Popup','sap/ui/commons/Tab','sap/ui/core/Item','sap/ui/Device','sap/base/security/encodeXML'],function(q,E,B,D,P,S,a,H,b,T,I,f,g){"use strict";var h=b.Dock;var i=E.extend("sap.ui.ux3.ShellPersonalization",{constructor:function(s){E.apply(this);this.shell=s;this.oSettings={};}});i.prototype.initializeSettings=function(s){this.oSettings=Object.assign({},s);if(this.shell.getDomRef()){this.applySettings(s);}};i.M_EVENTS={personalizationChange:"personalizationChange"};i.prototype.attachPersonalizationChange=function(F,l){this.attachEvent(i.M_EVENTS.personalizationChange,F,l);};i.prototype.detachPersonalizationChange=function(F,l){this.detachEvent(i.M_EVENTS.personalizationChange,F,l);};i.prototype.firePersonalizationChange=function(p){this.fireEvent(i.M_EVENTS.personalizationChange,p);};i.ORIGINAL_SETTINGS={bByDStyle:false,sBgColor:"rgb(17,17,17)",sBgCssImg:null,sBgImgSrc:null,sBgImgPos:"tile",fBgImgOpacity:1,fSidebarOpacity:1,sLineColor:"rgb(239,170,0)",sLogoImageSrc:null,sLogoAlign:"left",bUseLogoSize:false};i.TRANSPARENT_1x1=sap.ui.resource('sap.ui.core','themes/base/img/1x1.gif');i.IMAGE_FOLDER_PATH=sap.ui.require.toUrl("sap/ui/ux3/themes/"+sap.ui.getCore().getConfiguration().getTheme()+"/img/shell/");i.getOriginalSettings=function(){if(!i._bOriginalSettingsInitialized){i._bOriginalSettingsInitialized=true;var A=P.get();var c=A["sap.ui.ux3.Shell:sapUiUx3ShellGradientTop"];var d=A["sap.ui.ux3.Shell:sapUiUx3ShellGradientBottom"];if(f.browser.firefox){i.ORIGINAL_SETTINGS.sBgCssImg="-moz-linear-gradient(top, "+c+" 0, "+d+" 108px, "+d+")";}else if(f.browser.msie){if(f.browser.version==9){i.ORIGINAL_SETTINGS.sBgCssImg="url("+i.IMAGE_FOLDER_PATH+"Workset_bg.png)";}else{i.ORIGINAL_SETTINGS.sBgCssImg="-ms-linear-gradient(top, "+c+" 0, "+d+" 108px, "+d+")";}}else if(f.browser.webkit){i.ORIGINAL_SETTINGS.sBgCssImg="-webkit-linear-gradient(top, "+c+" 0, "+d+" 108px, "+d+")";}}return i.ORIGINAL_SETTINGS;};i.prototype.hasChanges=function(){var s=0;for(var k in this.oSettings){s++;}return(s>0);};i.prototype.applySettings=function(s){var A=Object.assign({},i.getOriginalSettings(),s);this.applyByDStyle(A.bByDStyle);this.applyBgColor(A.sBgColor);this.applyBgImage(A.sBgCssImg,A.sBgImgSrc);this.applyBgImageOpacity(A.fBgImgOpacity);if(A.sHeaderImageSrc){this.applyHeaderImage(A.sHeaderImageSrc);}else{this.shell.getDomRef("hdr").style.backgroundImage="";}this.applySidebarOpacity(A.fSidebarOpacity);this.applyBgColor(A.sBgColor);this.applyLineColor(A.sLineColor);this.applyLogoImage(A.sLogoImageSrc);this.applyLogoAlign(A.sLogoAlign);this.applyUseLogoSize(A.bUseLogoSize);};i.prototype.openDialog=function(){if(this.oDialog&&this._getDialog().isOpen()){return;}this.oTransientSettings=Object.assign({},this.oSettings);this._getDialog().open();this._bindDragAndDrop("bg");this._bindDragAndDrop("hdr");this._bindDragAndDrop("logo");};i.prototype.getTransientSettingsWithDefaults=function(){return Object.assign({},i.getOriginalSettings(),this.oTransientSettings);};i.prototype._bindDragAndDrop=function(p){if(window.FileReader){var s=this.shell.getId()+"-p13n_";q(document.getElementById(s+p+"ImageImg")).bind('dragover',q.proxy(this._handleDragover,this)).bind('dragend',q.proxy(this._handleDragend,this)).bind('drop',q.proxy(this._handleDrop,this));q(document.getElementById(s+p+"ImageHolder")).bind('dragover',q.proxy(this._handleDragover,this)).bind('dragend',q.proxy(this._handleDragend,this)).bind('drop',q.proxy(this._handleDrop,this));}};i.prototype._unbindDragAndDrop=function(p){if(window.FileReader){var s=this.shell.getId()+"-p13n_";q(document.getElementById(s+"hdrImageImg")).unbind('dragover',this._handleDragover).unbind('dragend',this._handleDragend).unbind('drop',this._handleDrop);q(document.getElementById(s+"hdrImageHolder")).unbind('dragover',this._handleDragover).unbind('dragend',this._handleDragend).unbind('drop',this._handleDrop);}};i.prototype._getDialog=function(){if(!this.oDialog){var s=this.shell.getId()+"-p13n_";var o=Object.assign({},i.getOriginalSettings(),this.oSettings);var c=sap.ui.commons;var t=this;var d=new c.Dialog({title:"Shell Personalization",width:"544px",height:"560px",showCloseButton:false,resizable:false,closed:[function(){this._unbindDragAndDrop("bg");this._unbindDragAndDrop("hdr");this._unbindDragAndDrop("logo");this.oTransientSettings=null;},this]}).addStyleClass("sapUiUx3ShellP13n");var e=new c.TabStrip({width:"100%",height:"100%",select:q.proxy(function(p){var C=sap.ui.getCore().byId(p.getParameter("id"));if(C){var n=p.getParameter("index");C.setSelectedIndex(n);var t=this;if(n==0){window.setTimeout(function(){t.shell.$("bgColor").css("background-color",t.getTransientSettingsWithDefaults().sBgColor);},1);window.setTimeout(q.proxy(function(){this._bindDragAndDrop("bg");},this),0);}else if(n==1){window.setTimeout(function(){t.shell.$("lineColor").css("background-color",t.getTransientSettingsWithDefaults().sLineColor);},1);window.setTimeout(q.proxy(function(){this._bindDragAndDrop("hdr");},this),0);}else if(n==2){window.setTimeout(q.proxy(function(){this._bindDragAndDrop("logo");},this),0);}}},this)});this.oBgImgHtml=new H(s+"bgImageHolder",{preferDOM:true,content:"<div id='"+s+"bgImageHolder' class='sapUiUx3ShellP13nImgHolder'><img id='"+s+"bgImageImg' src='"+(this.oTransientSettings.sBackgroundImageSrc?g(this.oTransientSettings.sBackgroundImageSrc):sap.ui.resource('sap.ui.core','themes/base/img/1x1.gif'))+"'/></div>"});this.oBgImgOpacitySlider=new c.Slider({value:(this.oTransientSettings.fBgImgOpacity!==undefined?100-this.oTransientSettings.fBgImgOpacity*100:100-i.getOriginalSettings().fBgImgOpacity*100),liveChange:q.proxy(this._handleBgImageOpacitySliderChange,this)});this.oSidebarOpacitySlider=new c.Slider({value:(this.oTransientSettings.fSidebarOpacity!==undefined?100-this.oTransientSettings.fSidebarOpacity*100:100-i.getOriginalSettings().fSidebarOpacity*100),liveChange:q.proxy(this._handleSidebarOpacitySliderChange,this)});this.oBgColorPicker=new S(s+"bgColorPicker");this.oBgColorPicker.attachLiveChange(function(n){t._handleBgColorChange(n);});var j=new c.Button({text:"Change..."});var t=this;j.attachPress(function(){if(!t.oBgColorPicker.isOpen()){t.oBgColorPicker.open(S.parseCssRgbString(t.getTransientSettingsWithDefaults().sBgColor),h.BeginTop,h.BeginBottom,t.shell.getDomRef("bgColor"));}});this.oBgPreviewHtml=new H({preferDom:true,content:"<div id='"+this.shell.getId()+"-bgColor' style='background-color:"+g(o.sBgColor)+"' class='sapUiUx3ShellColorPickerPreview'></div>"});var k=new T().setText("Background").addContent(new c.layout.MatrixLayout({layoutFixed:false}).createRow(new c.Label({text:"Background Image:"}),this.oBgImgHtml).createRow(new c.Label({text:"Image Transparency:"}),this.oBgImgOpacitySlider).createRow(new c.Label({text:"Background Color:"}),new c.layout.MatrixLayoutCell().addContent(this.oBgPreviewHtml).addContent(j)).createRow(null).createRow(new c.Label({text:"Sidebar Transparency:"}),this.oSidebarOpacitySlider));e.addTab(k);this.oByDStyleCb=new c.CheckBox({text:"ByDesign-style Header Bar",checked:this.oTransientSettings.bByDStyle,change:q.proxy(this._handleByDStyleChange,this)});this.oHdrImgHtml=new H(s+"hdrImageHolder",{preferDOM:true,content:"<div id='"+s+"hdrImageHolder' class='sapUiUx3ShellP13nImgHolder'><img id='"+s+"hdrImageImg' src='"+(this.oTransientSettings.sHeaderImageSrc?g(this.oTransientSettings.sHeaderImageSrc):sap.ui.resource('sap.ui.core','themes/base/img/1x1.gif'))+"'/></div>"});this.oLineColorPicker=new S(s+"lineColorPicker");this.oLineColorPicker.attachLiveChange(function(n){t._handleLineColorChange(n);});var l=new c.Button({text:"Change..."});var t=this;l.attachPress(function(){if(!t.oLineColorPicker.isOpen()){t.oLineColorPicker.open(S.parseCssRgbString(t.getTransientSettingsWithDefaults().sLineColor),h.BeginTop,h.BeginBottom,t.shell.getDomRef("lineColor"));}});this.oLinePreviewHtml=new H({preferDom:true,content:"<div id='"+this.shell.getId()+"-lineColor' style='background-color:"+g(o.sLineColor)+"' class='sapUiUx3ShellColorPickerPreview'></div>"});var m=new T().setText("Header Bar").addContent(new c.layout.MatrixLayout({layoutFixed:false}).createRow(new c.Label({text:"Line Color (ByD-style only):"}),new c.layout.MatrixLayoutCell().addContent(this.oLinePreviewHtml).addContent(l)).createRow(null).createRow(new c.Label({text:"Header Image:"}),this.oHdrImgHtml));e.addTab(m);this.oLogoImgHtml=new H(s+"logoImageHolder",{preferDOM:true,content:"<div id='"+s+"logoImageHolder' class='sapUiUx3ShellP13nImgHolder'><img id='"+s+"logoImageImg' src='"+(this.oTransientSettings.sLogoImageSrc?g(this.oTransientSettings.sLogoImageSrc):sap.ui.resource('sap.ui.core','themes/base/img/1x1.gif'))+"'/></div>"});this.oLogoRbg=new c.RadioButtonGroup().addItem(new I({text:"Left",key:"left"})).addItem(new I({text:"Center",key:"center"})).attachSelect(this._handleLogoAlignChange,this);this.oUseLogoSizeCb=new c.CheckBox({text:"Use original image size",checked:this.oTransientSettings.bUseLogoSize,change:q.proxy(this._handleUseLogoSizeChange,this)});var L=new T().setText("Logo").addContent(new c.layout.MatrixLayout({layoutFixed:false}).createRow(new c.Label({text:"Logo Image:"}),this.oLogoImgHtml).createRow(new c.Label({text:"Position:"}),this.oLogoRbg).createRow(this.oUseLogoSizeCb));e.addTab(L);d.addContent(e);var t=this;d.addButton(new c.Button({text:"Reset All",press:function(){t.applySettings(Object.assign({},i.getOriginalSettings()));t.oSettings={};t.oTransientSettings={};t.updateDialog();t._bindDragAndDrop("bg");t._bindDragAndDrop("hdr");t._bindDragAndDrop("logo");t.firePersonalizationChange({settings:{}});}}));d.addButton(new c.Button({text:"OK",press:function(){t.oSettings=Object.assign({},t.oTransientSettings);t.firePersonalizationChange({settings:t.oSettings});d.close();}}));d.addButton(new c.Button({text:"Cancel",press:function(){d.close();}}));this.oDialog=d;}return this.oDialog;};i.prototype.updateDialog=function(){var A=Object.assign({},i.getOriginalSettings(),this.oSettings);var s=this.shell.getId()+"-p13n_";this.oBgImgHtml.setContent("<div id='"+s+"bgImageHolder' class='sapUiUx3ShellP13nImgHolder'><img id='"+s+"bgImageImg' src='"+(A.sBackgroundImageSrc?g(A.sBackgroundImageSrc):sap.ui.resource('sap.ui.core','themes/base/img/1x1.gif'))+"'/></div>");this.oBgImgOpacitySlider.setValue(100-A.fBgImgOpacity*100);this.oSidebarOpacitySlider.setValue(100-A.fSidebarOpacity*100);this.oByDStyleCb.setChecked(A.bByDStyle);this.oHdrImgHtml.setContent("<div id='"+s+"hdrImageHolder' class='sapUiUx3ShellP13nImgHolder'><img id='"+s+"hdrImageImg' src='"+(A.sHeaderImageSrc?g(A.sHeaderImageSrc):sap.ui.resource('sap.ui.core','themes/base/img/1x1.gif'))+"'/></div>");this.oLogoRbg.setSelectedIndex((A.sLogoAlign=="center")?1:0);this.oUseLogoSizeCb.setChecked(A.bUseLogoSize);this.oLogoImgHtml.setContent("<div id='"+s+"logoImageHolder' class='sapUiUx3ShellP13nImgHolder'><img id='"+s+"logoImageImg' src='"+(A.sLogoImageSrc?g(A.sLogoImageSrc):sap.ui.resource('sap.ui.core','themes/base/img/1x1.gif'))+"'/></div>");};i.prototype._handleByDStyleChange=function(e){var c=e.getParameter("checked");this.oTransientSettings.bByDStyle=c;this.applyByDStyle(c);};i.prototype.applyByDStyle=function(c){this.shell.$().toggleClass("sapUiUx3ShellByD",c);};i.prototype._handleBgColorChange=function(e){var c=e.getParameter("cssColor");this.oTransientSettings.sBgColor=c;this.applyBgColor(c);};i.prototype.applyBgColor=function(c){this.shell.$("bg").css("background-color",c);this.shell.$("bgColor").css("background-color",c);};i.prototype._handleBackgroundImageChange=function(u,p){var t=true;if(p){if(t){this.oSettings.sBgCssImg="url("+u+")";this.oSettings.sBgImgSrc=null;}else{this.oSettings.sBgCssImg=null;this.oSettings.sBgImgSrc=u;}this.applyBgImage(this.oSettings.sBgCssImg,this.oSettings.sBgImgSrc);this.firePersonalizationChange({settings:this.oSettings});}else{if(t){this.oTransientSettings.sBgCssImg="url("+u+")";this.oTransientSettings.sBgImgSrc=null;}else{this.oTransientSettings.sBgCssImg=null;this.oTransientSettings.sBgImgSrc=u;}this.applyBgImage(this.oTransientSettings.sBgCssImg,this.oTransientSettings.sBgImgSrc);}};i.prototype.applyBgImage=function(s,c){s=s?s:"";c=c?c:i.TRANSPARENT_1x1;var o=this.shell.getDomRef("bgImg");o.style.backgroundImage=s;o.src=c;};i.prototype._handleHeaderImageChange=function(d,p){if(p){this.oSettings.sHeaderImageSrc=d;this.firePersonalizationChange({settings:this.oSettings});}else{this.oTransientSettings.sHeaderImageSrc=d;}this.applyHeaderImage(d);};i.prototype.applyHeaderImage=function(d){this.shell.$("hdr").css("background-image","url("+d+")");if(this.oDialog&&this.oDialog.isOpen()){this.shell.$("p13n_hdrImageImg").attr("src",d);}};i.prototype._handleLineColorChange=function(e){var c=e.getParameter("cssColor");this.oTransientSettings.sLineColor=c;this.applyLineColor(c);};i.prototype.applyLineColor=function(c){this.shell.$("hdr").find("hr").css("background-color",c);this.shell.$("lineColor").css("background-color",c);};i.prototype._handleBgImageOpacitySliderChange=function(e){var v=(100-e.getParameter("value"))/100;this.oTransientSettings.fBgImgOpacity=v;this.applyBgImageOpacity(v);};i.prototype.applyBgImageOpacity=function(v){this.shell.$("bgImg").css("opacity",v);};i.prototype._handleSidebarOpacitySliderChange=function(e){var v=(100-e.getParameter("value"))/100;this.oTransientSettings.fSidebarOpacity=v;this.applySidebarOpacity(v);};i.prototype.applySidebarOpacity=function(v){this.shell.$("tp").css("opacity",v);this.shell.$("paneBar").children(":nth-child(2)").css("opacity",v);};i.prototype._handleLogoImageChange=function(u,p){if(p){this.oSettings.sLogoImageSrc=u;this.firePersonalizationChange({settings:this.oSettings});}else{this.oTransientSettings.sLogoImageSrc=u;}this.applyLogoImage(u);};i.prototype.applyLogoImage=function(u){if(!u){u=this.shell.getAppIcon();if(!u){u=i.TRANSPARENT_1x1;}}this.shell.$("logoImg").attr("src",u);this.shell.$("p13n_logoImageImg").attr("src",u);};i.prototype._handleLogoAlignChange=function(e){var c=e.getParameter("selectedIndex");var A=["left","center"][c];this.oTransientSettings.sLogoAlign=A;this.applyLogoAlign(A);};i.prototype.applyLogoAlign=function(l){var r=l;if(sap.ui.getCore().getConfiguration().getRTL()&&(r=="right")){r="left";}this.shell.$("hdr").css("text-align",r);};i.prototype._handleUseLogoSizeChange=function(e){var u=e.getParameter("checked");this.oTransientSettings.bUseLogoSize=u;this.applyUseLogoSize(u);};i.prototype.applyUseLogoSize=function(u){this.shell.$("hdr").toggleClass("sapUiUx3ShellHeaderFlex",u);this.shell.$("hdrImg").toggleClass("sapUiUx3ShellHeaderImgFlex",u);};i.prototype._handleDragover=function(e){var c=e.target.id;if(!this._dragOverBlinking){var $=q(document.getElementById(c));$.css("opacity","0.5");this._dragOverBlinking=true;var t=this;window.setTimeout(function(){$.css("opacity","1");window.setTimeout(function(){t._dragOverBlinking=null;},250);},250);}return false;};i.prototype._handleDragend=function(e){return false;};i.prototype._handleDrop=function(c){var d=c.target.id;c.preventDefault();var e=c.originalEvent;var j=e.dataTransfer.files[0];if(j){var r=new window.FileReader();r.onload=q.proxy(function(k){var l=k.target.result;if((d==this.shell.getId()+"-p13n_bgImageImg")||(d==this.shell.getId()+"-p13n_bgImageHolder")){this._handleBackgroundImageChange(l);}else if((d==this.shell.getId()+"-p13n_hdrImageImg")||(d==this.shell.getId()+"-p13n_hdrImageHolder")){this._handleHeaderImageChange(l);}else if((d==this.shell.getId()+"-p13n_logoImageImg")||(d==this.shell.getId()+"-p13n_logoImageHolder")){this._handleLogoImageChange(l);}r=null;},this);r.readAsDataURL(j);}};return i;});
