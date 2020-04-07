/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','./library','sap/ui/core/TooltipBase','./CalloutBaseRenderer','sap/ui/core/Popup','sap/ui/events/ControlEvents','sap/ui/events/KeyCodes','sap/ui/dom/jquery/control','sap/ui/dom/jquery/Focusable'],function(q,l,T,C,P,a,K){"use strict";var D=P.Dock;var b=T.extend("sap.ui.commons.CalloutBase",{metadata:{library:"sap.ui.commons",events:{open:{parameters:{parent:{type:"sap.ui.core.Control"}}},close:{},beforeOpen:{allowPreventDefault:true,parameters:{parent:{type:"sap.ui.core.Control"}}},opened:{}}}});b.prototype.init=function(){this.oPopup=new P();this.oPopup.setShadow(true);this.oRb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");this.setPosition(D.BeginBottom,D.BeginTop);this.fAnyEventHandlerProxy=q.proxy(this.onAnyEvent,this);var t=this;this.oPopup._applyPosition=function(p){P.prototype._applyPosition.call(this,p);t.setTip();};this.oPopup.setFollowOf(P.CLOSE_ON_SCROLL);};b.prototype.exit=function(){this.oPopup.close();this.oPopup.detachEvent("opened",this.handleOpened,this);this.oPopup.detachEvent("closed",this.handleClosed,this);this.oPopup.destroy();delete this.oPopup;delete this.oRb;a.unbindAnyEvent(this.fAnyEventHandlerProxy);};b.prototype._getPopup=function(){return this.oPopup;};b.prototype.hasChild=function(d){return d&&!!(q(d).closest(this.getDomRef()).length);};b.prototype.isPopupElement=function(d){if(!d){return false;}if(this.hasChild(d)){return true;}var s=sap.ui.getCore().getStaticAreaRef();var t=parseInt(q(d).closest(q(s).children()).css("z-index"));var c=parseInt(this.$().css("z-index"));return t&&c&&t>=c;};b.prototype.setTip=function(){if(!this.oPopup||!this.oPopup.isOpen()){return;}var $=this._currentControl.$(),c=this.$(),d=this.$("arrow"),e=c.offset(),g=$.offset(),s=true,h={},t={l:e.left,r:e.left+c.outerWidth(),w:c.outerWidth(),t:e.top,b:e.top+c.outerHeight(),h:c.outerHeight()},p={l:g.left,r:g.left+$.outerWidth(),w:$.outerWidth(),t:g.top,b:g.top+$.outerHeight(),h:$.outerHeight()},i=(c.outerWidth()-c.innerWidth())/2,j=d.outerWidth()*1.4,k=d.outerWidth()/5,m=k-i-8,n=this.getMyPosition();if(t.r<p.l-m){h.x="right";}else if(t.l-m>p.r){h.x="left";}if(t.t>p.b-m){h.y="top";}else if(t.b<p.t+m){h.y="bottom";}if(h.x){var v=0;if(n.indexOf("top")>-1){v=20;}else if(n.indexOf("bottom")>-1){v=t.h-20-j;}else{v=(t.h-j)/2;}var o=t.t+v+j/2+i;if((o<p.t)||(o>p.b)||(p.t>t.t&&p.b<t.b)){v=(Math.max(t.t,p.t)+Math.min(t.b,p.b))/2-t.t-j/2;}d.css(h.x,m+"px");d.css("top",v);if(v<0||v>t.h-j){s=false;}}if(h.y){var r=sap.ui.getCore().getConfiguration().getRTL();if(r){n.replace("begin","right").replace("end","left");}var u=0;if((n.indexOf("begin")>-1)||(n.indexOf("left")>-1)){u=20;}else if((n.indexOf("right")>-1)||(n.indexOf("end")>-1)){u=t.w-20-j;}else{u=(t.w-j)/2;}var w=t.l+u+j/2+i;if((w<p.l)||(w>p.r)){u=(Math.max(t.l,p.l)+Math.min(t.r,p.r))/2-t.l-j/2;}d.css(h.y,m+"px");d.css("left",u+"px");if(u<0||u>t.w-j){s=false;}}if(h.x&&h.y||!h.x&&!h.y){s=false;}d.toggle(s);};b.prototype.adjustPosition=function(){function _(){if(this.oPopup){var p=this._currentControl.getDomRef();this.oPopup.setPosition(this.getMyPosition(),this.getAtPosition(),p,this.getOffset(),this.getCollision());}}setTimeout(q.proxy(_,this),0);};b.prototype.focus=function(){if(this.oPopup&&this.oPopup.isOpen()){var c=this.$("cont");f(c.firstFocusableDomRef()||c.get(0));}};b.prototype.openPopup=function(s){if(!this.oPopup||this.oPopup.isOpen()){return;}if(T.sOpenTimeout){clearTimeout(T.sOpenTimeout);T.sOpenTimeout=undefined;}if(!this.fireEvent("beforeOpen",{parent:this._currentControl},true,false)){if(!this.sCloseNowTimeout){T.sOpenTimeout=setTimeout(function(){this.openPopup(this._currentControl);}.bind(this),200);}return;}this.oParentFocusInfo=s.getFocusInfo();this.oPopup.attachEvent("opened",this.handleOpened,this);T.prototype.openPopup.call(this,s);this.adjustPosition();this.fireOpen({parent:this._currentControl});};b.prototype.close=function(){if(this.oPopup&&this.oPopup.isOpen()&&!this.sCloseNowTimeout){if(T.sOpenTimeout){clearTimeout(T.sOpenTimeout);T.sOpenTimeout=undefined;}this.closePopup();}};b.prototype.closePopup=function(){var w=this.oPopup!==undefined&&this.oPopup.isOpen();if(this.fAnyEventHandlerProxy){a.unbindAnyEvent(this.onAnyEvent);}T.prototype.closePopup.call(this);if(w&&this._currentControl&&this.bFocused){this._currentControl.applyFocusInfo(this.oParentFocusInfo);this.bFocused=false;}this.fireClose();};b.prototype.handleClosed=function(){if(this.oPopup){this.oPopup.detachEvent("closed",this.handleClosed,this);this.fireClosed();}};b.prototype.onkeydown=function(e){var c=e.ctrlKey&&e.which==K.I;var E=e.which==K.ESCAPE;if(!c&&!E){if(q(e.target).control(0)===this._currentControl){this.close();}return;}if(c){if(this.oPopup&&this.oPopup.isOpen()){return;}this.bDoFocus=true;}T.prototype.onkeydown.call(this,e);};b.prototype.handleOpened=function(){this.oPopup.detachEvent("opened",this.handleOpened,this);if(this.bDoFocus){this.focus();this.bDoFocus=false;this.bFocused=true;}this.$().css("display","");this.fireOpened();a.bindAnyEvent(this.fAnyEventHandlerProxy);};b.prototype.onfocusin=function(e){this.bFocused=true;var s=e.target;if(s.id===this.getId()+"-fhfe"){f(this.$("cont").lastFocusableDomRef());}else if(s.id===this.getId()+"-fhee"){f(this.$("cont").firstFocusableDomRef());}};b.prototype.onfocusout=function(e){return;};b.prototype.onmouseover=function(e){if(this.oPopup&&(this.oPopup.isOpen()&&this.oPopup.getContent()==this)){if(this.sCloseNowTimeout){clearTimeout(this.sCloseNowTimeout);this.sCloseNowTimeout=null;}return;}else{T.prototype.onmouseover.call(this,e);}};b.prototype.onmouseout=function(e){if(this.oPopup&&(this.oPopup.isOpen()&&this.isPopupElement(e.relatedTarget))){return;}T.prototype.onmouseout.call(this,e);};b.prototype.onmousedown=function(e){if(q(e.target).control(0)===this._currentControl){this.close();this.removeStandardTooltips();}};b.prototype.onAnyEvent=function(e){if((this.oPopup&&!this.oPopup.isOpen())||e.type!="mouseover"||this.hasChild(e.target)){return;}var d=this.isPopupElement(e.target)||q(e.target).control(0)===this._currentControl;if(!d&&!this.sCloseNowTimeout&&!T.sOpenTimeout){this.sCloseNowTimeout=setTimeout(function(){this.closePopup();}.bind(this),400);}if(d&&this.sCloseNowTimeout){clearTimeout(this.sCloseNowTimeout);this.sCloseNowTimeout=null;}};b.prototype.setPosition=function(m,c){var d=m||D.BeginBottom;var e=c||D.BeginTop;var g=0,h=0,i=0,j=0,k=5;if((d.indexOf("begin")>-1)||(d.indexOf("left")>-1)){g=-1;}else if((d.indexOf("right")>-1)||(d.indexOf("end")>-1)){g=1;}if((e.indexOf("begin")>-1)||(e.indexOf("left")>-1)){i=-1;}else if((e.indexOf("right")>-1)||(e.indexOf("end")>-1)){i=1;}if(d.indexOf("top")>-1){h=-1;}else if(d.indexOf("bottom")>-1){h=1;}if(e.indexOf("top")>-1){j=-1;}else if(e.indexOf("bottom")>-1){j=1;}var o=((g-i)*g*i*k)+" "+((h-j)*h*j*k);this.setMyPosition(d);this.setAtPosition(e);this.setOffset(o);return this;};function f(e){if(e){e.focus();}}return b;});
