/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../utils/TableUtils","../library","sap/ui/base/Object","sap/ui/Device","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery"],function(T,l,B,D,K,q){"use strict";var C=T.CELLTYPE;var S=l.SelectionMode;var M={CTRL:1,SHIFT:2,ALT:4};var N={LEFT:"Left",RIGHT:"Right",UP:"Up",DOWN:"Down"};var H=5;var a="1rem";function p(E,P){E.setMarked("sapUiTableSkipItemNavigation",P!==false);}var b=B.extend("sap.ui.table.extensions.KeyboardDelegate",{constructor:function(t){B.call(this);},destroy:function(){B.prototype.destroy.apply(this,arguments);},getInterface:function(){return this;}});b._restoreFocusOnLastFocusedDataCell=function(t,E){var o=T.getFocusedItemInfo(t);var L=t._getKeyboardExtension()._getLastFocusedCellInfo();T.focusItem(t,o.cellInRow+(o.columnCount*L.row),E);};b._setFocusOnColumnHeaderOfLastFocusedDataCell=function(t,E){var o=T.getFocusedItemInfo(t);T.focusItem(t,o.cellInRow,E);};b._forwardFocusToTabDummy=function(t,g){t._getKeyboardExtension()._setSilentFocus(t.$().find("."+g));};b._isKeyCombination=function(E,k,m){if(m==null){m=0;}var g=typeof k==="string"?String.fromCharCode(E.charCode):E.keyCode;var h=0;h|=(D.os.macintosh?E.metaKey:E.ctrlKey)&&k!==K.CONTROL?M.CTRL:0;h|=E.shiftKey&&k!==K.SHIFT?M.SHIFT:0;h|=E.altKey&&k!==K.ALT?M.ALT:0;var v=k==null||g===k;var V=m===h;return v&&V;};b._handleSpaceAndEnter=function(t,E){var o=T.getCellInfo(E.target);if(o.isOfType(C.COLUMNROWHEADER)){t._getSelectionPlugin().onHeaderSelectorPress();}else if(b._isElementGroupToggler(t,E.target)){T.Grouping.toggleGroupHeaderByRef(t,E.target);}else if(o.isOfType(C.ROWHEADER)){h();}else if(o.isOfType(C.DATACELL|C.ROWACTION)){var g=!t.hasListeners("cellClick");if(!t._findAndfireCellEvent(t.fireCellClick,E)){if(T.isRowSelectionAllowed(t)){h();g=false;}}if(g){var i=T.getInteractiveElements(E.target);if(i){t._getKeyboardExtension().setActionMode(true);}}}function h(){var _=null;if(t._legacyMultiSelection){_=function(r){t._legacyMultiSelection(r,E);return true;};}T.toggleRowSelection(t,E.target,null,_);}};b._moveColumn=function(o,n){var t=o.getParent();var v=t._getVisibleColumns();var i=v.indexOf(o);var g;if(n&&i<v.length-1){g=t.indexOfColumn(v[i+1])+1;}else if(!n&&i>0){g=t.indexOfColumn(v[i-1]);}if(g!=null){T.Column.moveColumnTo(o,g);}};b._getVisibleAndGroupedColumns=function(t){return t.getColumns().filter(function(o){return o.getVisible()||o.getGrouped();});};b._getColumnIndexInVisibleAndGroupedColumns=function(t,o){var v=b._getVisibleAndGroupedColumns(t);for(var i=0;i<v.length;i++){var V=v[i];if(V===o){return i;}}return-1;};b._focusElement=function(t,E,g){if(!t||!E){return;}if(g==null){g=false;}T.deselectElementText(document.activeElement);if(g){t._getKeyboardExtension()._setSilentFocus(E);}else{E.focus();}T.selectElementText(E);};b._focusCell=function(t,i,r,g,F,A){if(!t||i==null||r==null||r<0||r>=t.getRows().length){return;}var R=t.getRows()[r];var o;if(i===C.ROWHEADER){t._getKeyboardExtension()._setFocus(t.getDomRef("rowsel"+r));return;}else if(i===C.ROWACTION){o=t.getDomRef("rowact"+r);}else if(i===C.DATACELL&&(g!=null&&g>=0)){var h=t.getColumns()[g];var j=b._getColumnIndexInVisibleAndGroupedColumns(t,h);if(j>=0){o=R.getDomRef("col"+j);}}if(!o){return;}if(F){var I=T.getInteractiveElements(o);if(I){b._focusElement(t,I[0]);return;}}if(A){t._getKeyboardExtension()._bStayInActionMode=true;}o.focus();};b._navigate=function(t,E,g){if(E.isMarked()){return;}var k=t._getKeyboardExtension();var A=k.isInActionMode();var o=T.getCellInfo(T.getCell(t,E.target));var h=false;if((g===N.UP||g===N.DOWN)&&o.isOfType(C.ANYCONTENTCELL)){var i=b._isKeyCombination(E,null,M.CTRL);var j=i||A;var P=T.getParentCell(t,E.target);var m=A&&o.isOfType(C.DATACELL);if(!i&&(E.target instanceof window.HTMLInputElement||E.target instanceof window.HTMLTextAreaElement)){return;}if(!j&&P){P.focus();return;}p(E);if(g===N.UP){if(T.isFirstScrollableRow(t,o.cell)){h=t._getScrollExtension().scrollVertically(false,false,true,m,function(){if(m){document.activeElement.blur();}});}}else if(T.isLastScrollableRow(t,o.cell)){h=t._getScrollExtension().scrollVertically(true,false,true,m,function(){if(m){document.activeElement.blur();}});}if(h){E.preventDefault();if(j){t.attachEventOnce("_rowsUpdated",function(){b._focusCell(t,o.type,o.rowIndex,o.columnIndex,true);});}}else if(g===N.UP&&o.rowIndex===0){p(E,o.isOfType(C.ROWACTION)||j);if(!A&&P){P.focus();}else{k.setActionMode(false);}}else if(g===N.DOWN&&o.rowIndex===t._getRowCounts().count-1){if(!A&&P){P.focus();}else{var n=t.getCreationRow();if(!n||!n._takeOverKeyboardHandling(E)){k.setActionMode(false);}}}else{var r=g===N.DOWN?1:-1;b._focusCell(t,o.type,o.rowIndex+r,o.columnIndex,j);E.preventDefault();}}else if(g===N.DOWN&&o.isOfType(C.ANYCOLUMNHEADER)){var u=T.getHeaderRowCount(t);if(T.isNoDataVisible(t)){var F=T.getFocusedItemInfo(t);if(F.row-u<=1){p(E);}}else if(o.isOfType(C.COLUMNROWHEADER)&&u>1){p(E);T.focusItem(t,u*(T.getVisibleColumnCount(t)+1),E);}}else if(g===N.LEFT&&!A){var I=sap.ui.getCore().getConfiguration().getRTL();if(o.isOfType(C.COLUMNHEADER)&&I){var v=T.getFocusedItemInfo(t);var w=v.cellInRow-(T.hasRowHeader(t)?1:0);var x=T.getVisibleColumnCount(t);if(T.hasRowActions(t)&&w===x-1){p(E);}}}};b._isElementGroupToggler=function(t,E){return T.Grouping.isInGroupHeaderRow(E)||(T.Grouping.isTreeMode(t)&&E.classList.contains("sapUiTableCellFirst")&&(E.querySelector(".sapUiTableTreeIconNodeOpen")||E.querySelector(".sapUiTableTreeIconNodeClosed")))||E.classList.contains("sapUiTableTreeIconNodeOpen")||E.classList.contains("sapUiTableTreeIconNodeClosed");};b._isElementInteractive=function(E){if(!E){return false;}return q(E).is(T.INTERACTIVE_ELEMENT_SELECTORS);};b._getFirstInteractiveElement=function(r){if(!r){return null;}var t=r.getParent();var g=r.getCells();var $;var I;if(T.hasRowActions(t)){g.push(r.getRowAction());}for(var i=0;i<g.length;i++){$=T.getParentCell(t,g[i].getDomRef());I=T.getInteractiveElements($);if(I){return I.first();}}return null;};b._getLastInteractiveElement=function(r){if(!r){return null;}var t=r.getParent();var g=r.getCells();var $;var I;if(T.hasRowActions(t)){g.push(r.getRowAction());}for(var i=g.length-1;i>=0;i--){$=T.getParentCell(t,g[i].getDomRef());I=T.getInteractiveElements($);if(I){return I.last();}}return null;};b._getPreviousInteractiveElement=function(t,E){if(!t||!E){return null;}var $=q(E);if(!this._isElementInteractive($)){return null;}var g=T.getParentCell(t,E);var I;var o;var h;var j;var k;var m;var n;I=T.getInteractiveElements(g);if(I[0]!==$[0]){return I.eq(I.index(E)-1);}o=T.getCellInfo(g);j=t.getRows()[o.rowIndex].getCells();if(o.isOfType(C.ROWACTION)){n=j.length-1;}else{k=t.getColumns()[o.columnIndex];m=b._getColumnIndexInVisibleAndGroupedColumns(t,k);n=m-1;}for(var i=n;i>=0;i--){h=j[i].getDomRef();g=T.getParentCell(t,h);I=T.getInteractiveElements(g);if(I){return I.last();}}return null;};b._getNextInteractiveElement=function(t,E){if(!t||!E){return null;}var $=q(E);if(!this._isElementInteractive($)){return null;}var g=T.getParentCell(t,E);var I;var o;var h;var j;var k;var r;var m;I=T.getInteractiveElements(g);if(I.get(-1)!==$[0]){return I.eq(I.index(E)+1);}o=T.getCellInfo(g);if(o.isOfType(C.ROWACTION)){return null;}r=t.getRows()[o.rowIndex];j=r.getCells();k=t.getColumns()[o.columnIndex];m=b._getColumnIndexInVisibleAndGroupedColumns(t,k);for(var i=m+1;i<j.length;i++){h=j[i].getDomRef();g=T.getParentCell(t,h);I=T.getInteractiveElements(g);if(I){return I.first();}}if(T.hasRowActions(t)){g=T.getParentCell(t,r.getRowAction().getDomRef());I=T.getInteractiveElements(g);if(I.get(-1)!==$[0]){return I.eq(I.index(E)+1);}}return null;};function s(t){var F=T.getRowIndexOfFocusedCell(t);var i=t.getRows()[F].getIndex();var o=t._getSelectionPlugin();t._oRangeSelection={startIndex:i,selected:o.isIndexSelected(i)};}b.prototype.enterActionMode=function(){var k=this._getKeyboardExtension();var A=document.activeElement;var i=T.getInteractiveElements(A);var $=T.getParentCell(this,A);var o=T.getCellInfo($);if(o.isOfType(C.ANYCOLUMNHEADER)){return false;}if(i){k._suspendItemNavigation();A.tabIndex=-1;b._focusElement(this,i[0],true);return true;}else if($){this._getKeyboardExtension()._suspendItemNavigation();return true;}return false;};b.prototype.leaveActionMode=function(A){A=A==null?true:A;var k=this._getKeyboardExtension();var o=document.activeElement;var $=T.getParentCell(this,o);k._resumeItemNavigation();if(A){if($){b._focusElement(this,$[0],true);}else{var i=this._getItemNavigation();if(i){var I=i.aItemDomRefs;var F=I.indexOf(o);if(F>-1){i.setFocusedIndex(F);}}k._setSilentFocus(o);}}};b.prototype.onfocusin=function(E){if(E.isMarked("sapUiTableIgnoreFocusIn")){return;}var t=q(E.target);if(t.hasClass("sapUiTableOuterBefore")||t.hasClass("sapUiTableOuterAfter")||(E.target!=this.getDomRef("overlay")&&this.getShowOverlay())){this.$("overlay").focus();}else if(t.hasClass("sapUiTableCtrlBefore")){var n=T.isNoDataVisible(this);if(!n||n&&this.getColumnHeaderVisible()){b._setFocusOnColumnHeaderOfLastFocusedDataCell(this,E);}else{this._getKeyboardExtension()._setSilentFocus(this.$("noDataCnt"));}}else if(t.hasClass("sapUiTableCtrlAfter")){if(!T.isNoDataVisible(this)){b._restoreFocusOnLastFocusedDataCell(this,E);}}var o=T.getCellInfo(E.target);var i=o.isOfType(C.ROWHEADER)&&T.Grouping.isInGroupHeaderRow(E.target);var I=o.isOfType(C.ROWHEADER)&&!i&&T.isRowSelectorSelectionAllowed(this);var g=o.isOfType(C.DATACELL)&&this._getKeyboardExtension()._bStayInActionMode;var P=T.getCellInfo(T.getParentCell(this,E.target)).isOfType(C.ANYCONTENTCELL);var h=b._isElementInteractive(E.target);var j=this._getKeyboardExtension().isInActionMode();var k=(j&&(i||I||g)||(h&&P));if(g){this._getKeyboardExtension()._bStayInActionMode=false;}this._getKeyboardExtension().setActionMode(k,false);};b.prototype.onkeydown=function(E){var k=this._getKeyboardExtension();var o=T.getCellInfo(E.target);var g=this.getSelectionMode();var h=this._getSelectionPlugin();if(D.browser.msie&&b._isKeyCombination(E,K.V,M.CTRL)){this.onpaste(E);return;}if(b._isKeyCombination(E,K.F2)){var i=k.isInActionMode();var $=T.getCell(this,E.target);var I=T.getParentCell(this,E.target)!=null;o=T.getCellInfo($);if(!i&&I){$.focus();}else if(o.isOfType(C.ANYCOLUMNHEADER)){var j=T.getInteractiveElements($);if(j){j[0].focus();}}else{k.setActionMode(!i);}return;}else if(b._isKeyCombination(E,K.F4)&&b._isElementGroupToggler(this,E.target)){T.Grouping.toggleGroupHeaderByRef(this,E.target);return;}if(this._getKeyboardExtension().isInActionMode()||!o.isOfType(C.ANY)){return;}if(b._isKeyCombination(E,K.SPACE)){E.preventDefault();}if(b._isKeyCombination(E,K.SHIFT)&&g===S.MultiToggle&&(o.isOfType(C.ROWHEADER)&&T.isRowSelectorSelectionAllowed(this)||(o.isOfType(C.DATACELL|C.ROWACTION)))){s(this);}else if(b._isKeyCombination(E,K.A,M.CTRL)){E.preventDefault();if(o.isOfType(C.ANYCONTENTCELL|C.COLUMNROWHEADER)&&g===S.MultiToggle){h.onKeyboardShortcut("toggle");}}else if(b._isKeyCombination(E,K.A,M.CTRL+M.SHIFT)){if(o.isOfType(C.ANYCONTENTCELL|C.COLUMNROWHEADER)){h.onKeyboardShortcut("clear");}}else if(b._isKeyCombination(E,K.F4)){if(o.isOfType(C.DATACELL)){k.setActionMode(true);}}};b.prototype.onkeypress=function(E){var k=this._getKeyboardExtension();var o=T.getCellInfo(E.target);if(b._isKeyCombination(E,"+")){if(b._isElementGroupToggler(this,E.target)){T.Grouping.toggleGroupHeaderByRef(this,E.target,true);}else if(o.isOfType(C.DATACELL|C.ROWACTION)){k.setActionMode(true);}}else if(b._isKeyCombination(E,"-")){if(b._isElementGroupToggler(this,E.target)){T.Grouping.toggleGroupHeaderByRef(this,E.target,false);}else if(o.isOfType(C.DATACELL|C.ROWACTION)){k.setActionMode(true);}}};b.prototype.oncontextmenu=function(E){if(E.isMarked("handledByPointerExtension")){return;}var o=T.getCellInfo(document.activeElement);if(o.isOfType(C.ANY)){E.preventDefault();T.Menu.openContextMenu(this,E.target,E);}};b.prototype.onkeyup=function(E){var o=T.getCellInfo(E.target);if(b._isKeyCombination(E,K.SHIFT)){delete this._oRangeSelection;}if(o.isOfType(C.COLUMNHEADER)){if(b._isKeyCombination(E,K.SPACE)||b._isKeyCombination(E,K.ENTER)){T.Menu.openContextMenu(this,E.target);}}else if(b._isKeyCombination(E,K.SPACE)){b._handleSpaceAndEnter(this,E);}else if(b._isKeyCombination(E,K.SPACE,M.SHIFT)){T.toggleRowSelection(this,this.getRows()[o.rowIndex].getIndex());s(this);}else if(this._legacyMultiSelection&&!o.isOfType(C.COLUMNROWHEADER)&&(b._isKeyCombination(E,K.SPACE,M.CTRL)||b._isKeyCombination(E,K.ENTER,M.CTRL))){b._handleSpaceAndEnter(this,E);}};b.prototype.onsaptabnext=function(E){var k=this._getKeyboardExtension();var o=T.getCellInfo(E.target);var $;if(k.isInActionMode()){var I;$=T.getCell(this,E.target);o=T.getCellInfo($);if(!o.isOfType(C.ANYCONTENTCELL)){return;}var r=this.getRows()[o.rowIndex];var L=b._getLastInteractiveElement(r);var g=L===null||L[0]===E.target;if(g){var A=r.getIndex();var h=T.isLastScrollableRow(this,$);var j=this._getTotalRowCount()-1===A;var t=T.isRowSelectorSelectionAllowed(this);E.preventDefault();if(j){k.setActionMode(false);}else if(h){c(this,o,t,o.rowIndex,r);}else{var R=o.rowIndex;if(t){b._focusCell(this,C.ROWHEADER,R+1);}else{var v=this._getRowCounts().count;var m=false;for(var i=o.rowIndex+1;i<v;i++){R=i;r=this.getRows()[R];I=b._getFirstInteractiveElement(r);m=r.isGroupHeader();if(I||m){break;}}if(I){b._focusElement(this,I[0]);}else if(m){b._focusCell(this,C.ROWHEADER,R);}else{c(this,o,t,R,r);}}}}else if(o.isOfType(C.ROWHEADER)){E.preventDefault();I=b._getFirstInteractiveElement(r);b._focusElement(this,I[0]);}else{E.preventDefault();I=b._getNextInteractiveElement(this,E.target);b._focusElement(this,I[0]);}}else if(o.isOfType(C.ANYCOLUMNHEADER)){if(T.isNoDataVisible(this)){this.$("noDataCnt").focus();}else{b._restoreFocusOnLastFocusedDataCell(this,E);}E.preventDefault();}else if(o.isOfType(C.ANYCONTENTCELL)){b._forwardFocusToTabDummy(this,"sapUiTableCtrlAfter");}else if(E.target===this.getDomRef("overlay")){k._setSilentFocus(this.$().find(".sapUiTableOuterAfter"));}else if(!o.isOfType(C.ANY)){$=T.getParentCell(this,E.target);if($){E.preventDefault();$.focus();}}};function c(t,o,g,r,R){var A=o.isOfType(C.DATACELL);var k=t._getKeyboardExtension();var h=t._getScrollExtension().scrollVertically(true,false,true,A,function(){if(A){document.activeElement.blur();}});if(h){t.attachEventOnce("_rowsUpdated",function(){d(t,R,r,g,R.isGroupHeader());});}else if(R.getIndex()!==t._getTotalRowCount()-1){var n=o.rowIndex+1;var i=t.getRows()[n];d(t,i,n,g,i.isGroupHeader());}else{k.setActionMode(false);}}function d(t,r,R,g,i){var k=t._getKeyboardExtension();if(g||i){b._focusCell(t,C.ROWHEADER,R);}else{var I=b._getFirstInteractiveElement(r);if(I){b._focusElement(t,I[0]);}else{b._focusCell(t,C.DATACELL,R,0,false,true);if(r.getIndex()===t._getTotalRowCount()-1){k.setActionMode(false);}}}}b.prototype.onsaptabprevious=function(E){var k=this._getKeyboardExtension();var o=T.getCellInfo(E.target);var $;if(k.isInActionMode()){var I;$=T.getCell(this,E.target);o=T.getCellInfo($);if(!o.isOfType(C.ANYCONTENTCELL)){return;}var r=this.getRows()[o.rowIndex];var A=r.getIndex();var F=b._getFirstInteractiveElement(r);var g=F!==null&&F[0]===E.target;var t=T.isRowSelectorSelectionAllowed(this);var R=t||r.isGroupHeader();if(g&&R){E.preventDefault();b._focusCell(this,C.ROWHEADER,o.rowIndex);}else if((g&&!R)||o.isOfType(C.ROWHEADER)||F===null){var h=T.isFirstScrollableRow(this,$);var j=A===0;E.preventDefault();if(j){k.setActionMode(false);}else if(h){e(this,o,R,o.rowIndex,r);}else{var m=o.rowIndex;var n=false;for(var i=o.rowIndex-1;i>=0;i--){m=i;r=this.getRows()[m];I=b._getLastInteractiveElement(r);n=r.isGroupHeader();if(I||R||n){break;}}if(I){b._focusElement(this,I[0]);}else if(n||R){b._focusCell(this,C.ROWHEADER,m);}else{e(this,o,R,m,r);}}}else{E.preventDefault();I=b._getPreviousInteractiveElement(this,E.target);b._focusElement(this,I[0]);}}else if(o.isOfType(C.ANYCONTENTCELL)||E.target===this.getDomRef("noDataCnt")){if(this.getColumnHeaderVisible()&&!o.isOfType(C.ROWACTION)){b._setFocusOnColumnHeaderOfLastFocusedDataCell(this,E);E.preventDefault();}else{b._forwardFocusToTabDummy(this,"sapUiTableCtrlBefore");}}else if(E.target===this.getDomRef("overlay")){this._getKeyboardExtension()._setSilentFocus(this.$().find(".sapUiTableOuterBefore"));}else if(!o.isOfType(C.ANY)){$=T.getParentCell(this,E.target);if($){E.preventDefault();$.focus();}}};function e(t,o,r,R,g){var A=o.isOfType(C.DATACELL);var k=t._getKeyboardExtension();var h=t._getScrollExtension().scrollVertically(false,false,true,A,function(){if(A){document.activeElement.blur();}});if(h){t.attachEventOnce("_rowsUpdated",function(){f(t,g,R,r,g.isGroupHeader());});}else if(g.getIndex()!==0){var P=o.rowIndex-1;var i=t.getRows()[P];f(t,i,P,r,i.isGroupHeader());}else{k.setActionMode(false);}}function f(t,r,R,g,i){var k=t._getKeyboardExtension();var I=b._getLastInteractiveElement(r);if(I){b._focusElement(t,I[0]);}else if(g||i){b._focusCell(t,C.ROWHEADER,R);}else{b._focusCell(t,C.DATACELL,R,0,false,true);if(r.getIndex()===0){k.setActionMode(false);}}}b.prototype.onsapdown=function(E){b._navigate(this,E,N.DOWN);};b.prototype.onsapdownmodifiers=function(E){if(b._isKeyCombination(E,null,M.CTRL)){b._navigate(this,E,N.DOWN);return;}var k=this._getKeyboardExtension();if(b._isKeyCombination(E,null,M.ALT)&&b._isElementGroupToggler(this,E.target)){p(E);T.Grouping.toggleGroupHeaderByRef(this,E.target,true);return;}if(k.isInActionMode()){return;}var o=T.getCellInfo(E.target);if(b._isKeyCombination(E,null,M.SHIFT)){E.preventDefault();if(o.isOfType(C.ANYCONTENTCELL)){if(!this._oRangeSelection){p(E);return;}var F=T.getRowIndexOfFocusedCell(this);var i=this.getRows()[F].getIndex();if(i===this._getTotalRowCount()-1){return;}if(T.isLastScrollableRow(this,E.target)){var g=this._getScrollExtension().scrollVertically(true,false,true);if(g){p(E);}}if(this._oRangeSelection.startIndex<=i){i++;if(this._oRangeSelection.selected){T.toggleRowSelection(this,i,true);}else{T.toggleRowSelection(this,i,false);}}else{T.toggleRowSelection(this,i,false);}}else{p(E);}}if(b._isKeyCombination(E,null,M.ALT)){if(o.isOfType(C.DATACELL)){k.setActionMode(true);}p(E);}};b.prototype.onsapup=function(E){b._navigate(this,E,N.UP);};b.prototype.onsapupmodifiers=function(E){var k=this._getKeyboardExtension();if(b._isKeyCombination(E,null,M.CTRL)){b._navigate(this,E,N.UP);return;}if(b._isKeyCombination(E,null,M.ALT)&&b._isElementGroupToggler(this,E.target)){p(E);T.Grouping.toggleGroupHeaderByRef(this,E.target,false);return;}if(k.isInActionMode()){return;}var o=T.getCellInfo(E.target);if(b._isKeyCombination(E,null,M.SHIFT)){E.preventDefault();if(o.isOfType(C.ANYCONTENTCELL)){if(!this._oRangeSelection){p(E);return;}var F=T.getRowIndexOfFocusedCell(this);var i=this.getRows()[F].getIndex();if(i===0){p(E);return;}if(T.isFirstScrollableRow(this,E.target)){var g=this._getScrollExtension().scrollVertically(false,false,true);if(g){p(E);}}if(this._oRangeSelection.startIndex>=i){i--;if(this._oRangeSelection.selected){T.toggleRowSelection(this,i,true);}else{T.toggleRowSelection(this,i,false);}}else{T.toggleRowSelection(this,i,false);}}else{p(E);}}if(b._isKeyCombination(E,null,M.ALT)){if(o.isOfType(C.DATACELL)){k.setActionMode(true);}p(E);}};b.prototype.onsapleft=function(E){b._navigate(this,E,N.LEFT);};b.prototype.onsapleftmodifiers=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}var o=T.getCellInfo(E.target);var I=sap.ui.getCore().getConfiguration().getRTL();if(b._isKeyCombination(E,null,M.SHIFT)){E.preventDefault();if(o.isOfType(C.DATACELL)){if(!this._oRangeSelection){p(E);return;}var F=T.getFocusedItemInfo(this);var g=T.hasRowHeader(this)&&F.cellInRow===1;if(g&&!T.isRowSelectorSelectionAllowed(this)){p(E);}}else if(o.isOfType(C.ROWACTION)){if(!this._oRangeSelection){p(E);}}else if(o.isOfType(C.ROWHEADER)&&I){if(!T.isRowSelectionAllowed(this)){p(E);}}else if(o.isOfType(C.COLUMNROWHEADER)&&I){p(E);}else if(o.isOfType(C.COLUMNHEADER)){var r=-T.convertCSSSizeToPixel(a);var h=0;if(I){r=r*-1;}for(var i=o.columnIndex;i<o.columnIndex+o.columnSpan;i++){h+=T.Column.getColumnWidth(this,i);}T.Column.resizeColumn(this,o.columnIndex,h+r,true,o.columnSpan);p(E);}}else if(b._isKeyCombination(E,null,M.CTRL)){if(o.isOfType(C.COLUMNHEADER)){E.preventDefault();E.stopImmediatePropagation();var j=this.getColumns()[o.columnIndex];b._moveColumn(j,I);}}};b.prototype.onsaprightmodifiers=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}var o=T.getCellInfo(E.target);var I=sap.ui.getCore().getConfiguration().getRTL();if(b._isKeyCombination(E,null,M.SHIFT)){E.preventDefault();if(o.isOfType(C.DATACELL)){if(!this._oRangeSelection){p(E);}}else if(o.isOfType(C.ROWHEADER)){if(!T.isRowSelectionAllowed(this)){p(E);}}else if(o.isOfType(C.ROWACTION)&&I){if(!this._oRangeSelection){p(E);}}else if(o.isOfType(C.COLUMNHEADER)){var r=T.convertCSSSizeToPixel(a);var g=0;if(I){r=r*-1;}for(var i=o.columnIndex;i<o.columnIndex+o.columnSpan;i++){g+=T.Column.getColumnWidth(this,i);}T.Column.resizeColumn(this,o.columnIndex,g+r,true,o.columnSpan);p(E);}else if(o.isOfType(C.COLUMNROWHEADER)){p(E);}}else if(b._isKeyCombination(E,null,M.CTRL)){if(o.isOfType(C.COLUMNHEADER)){E.preventDefault();E.stopImmediatePropagation();var h=this.getColumns()[o.columnIndex];b._moveColumn(h,!I);}}};b.prototype.onsaphome=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}if(T.Grouping.isInGroupHeaderRow(E.target)){p(E);E.preventDefault();return;}var o=T.getCellInfo(E.target);if(o.isOfType(C.ANY)){E.preventDefault();}if(o.isOfType(C.DATACELL|C.ROWACTION|C.COLUMNHEADER)){var F=T.getFocusedItemInfo(this);var i=F.cell;var g=F.cellInRow;var h=this.getComputedFixedColumnCount();var j=T.hasRowHeader(this);var r=j?1:0;if(T.hasFixedColumns(this)&&g>h+r){p(E);T.focusItem(this,i-g+h+r,null);}else if(j&&g>1){p(E);T.focusItem(this,i-g+r,null);}}};b.prototype.onsapend=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}if(T.Grouping.isInGroupHeaderRow(E.target)){E.preventDefault();p(E);return;}var o=T.getCellInfo(E.target);if(o.isOfType(C.ANY)){E.preventDefault();var F=T.getFocusedItemInfo(this);var i=F.cell;var g=F.columnCount;var h=this.getComputedFixedColumnCount();var j=F.cellInRow;var k=T.hasRowHeader(this);var r=k?1:0;var I=false;if(o.isOfType(C.COLUMNHEADER)&&T.hasFixedColumns(this)){var m=parseInt(o.cell.attr("colspan")||1);if(m>1&&j+m-r===h){I=true;}}if(k&&j===0){p(E);T.focusItem(this,i+1,null);}else if(T.hasFixedColumns(this)&&j<h-1+r&&!I){p(E);T.focusItem(this,i+h-j,null);}else if(T.hasRowActions(this)&&o.isOfType(C.DATACELL)&&j<g-2){p(E);T.focusItem(this,i-j+g-2,null);}}};b.prototype.onsaphomemodifiers=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}if(b._isKeyCombination(E,null,M.CTRL)){E.preventDefault();var o=T.getCellInfo(E.target);if(o.isOfType(C.ANYCONTENTCELL|C.COLUMNHEADER)){p(E);var F=T.getFocusedItemInfo(this);var i=F.row;if(i>0){var g=F.cell;var h=F.columnCount;var j=T.getHeaderRowCount(this);var r=this._getRowCounts();if(i<j+r.fixedTop){if(o.isOfType(C.ROWACTION)){T.focusItem(this,g-h*(i-j),E);}else{T.focusItem(this,g-h*i,E);}}else if(i>=j+r.fixedTop&&i<j+T.getNonEmptyVisibleRowCount(this)-r.fixedBottom){this._getScrollExtension().scrollVerticallyMax(false,true);if(r.fixedTop>0||o.isOfType(C.ROWACTION)){T.focusItem(this,g-h*(i-j),E);}else{T.focusItem(this,g-h*i,E);}}else{this._getScrollExtension().scrollVerticallyMax(false,true);T.focusItem(this,g-h*(i-j-r.fixedTop),E);}}}}};b.prototype.onsapendmodifiers=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}if(b._isKeyCombination(E,null,M.CTRL)){E.preventDefault();var o=T.getCellInfo(E.target);if(o.isOfType(C.ANY)){var F=T.getFocusedItemInfo(this);var i=F.row;var h=T.getHeaderRowCount(this);var n=T.getNonEmptyVisibleRowCount(this);var r=this._getRowCounts();p(E);if(r.fixedBottom===0||i<h+n-1||(T.isNoDataVisible(this)&&i<h-1)){var g=F.cell;var j=F.columnCount;if(T.isNoDataVisible(this)){T.focusItem(this,g+j*(h-i-1),E);}else if(i<h){if(r.fixedTop>0){T.focusItem(this,g+j*(h+r.fixedTop-i-1),E);}else{this._getScrollExtension().scrollVerticallyMax(true,true);T.focusItem(this,g+j*(h+n-r.fixedBottom-i-1),E);}}else if(i>=h&&i<h+r.fixedTop){this._getScrollExtension().scrollVerticallyMax(true,true);T.focusItem(this,g+j*(h+n-r.fixedBottom-i-1),E);}else if(i>=h+r.fixedTop&&i<h+n-r.fixedBottom){this._getScrollExtension().scrollVerticallyMax(true,true);T.focusItem(this,g+j*(h+n-i-1),E);}else{T.focusItem(this,g+j*(h+n-i-1),E);}}}}};b.prototype.onsappageup=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}E.preventDefault();var o=T.getCellInfo(E.target);if(o.isOfType(C.ANYCONTENTCELL|C.COLUMNHEADER)){var F=T.getFocusedItemInfo(this);var i=F.row;var h=T.getHeaderRowCount(this);var r=this._getRowCounts();if(r.fixedTop===0&&i>=h||r.fixedTop>0&&i>h){p(E);var g=F.cell;var j=F.columnCount;if(i<h+r.fixedTop){T.focusItem(this,g-j*(i-h),E);}else if(i===h+r.fixedTop){var P=T.getNonEmptyVisibleRowCount(this)-r.fixedTop-r.fixedBottom;var R=this.getFirstVisibleRow();this._getScrollExtension().scrollVertically(false,true,true);if(R<P){if(r.fixedTop>0||o.isOfType(C.ROWACTION)){T.focusItem(this,g-j*(i-h),E);}else{T.focusItem(this,g-j*h,E);}}}else if(i>h+r.fixedTop&&i<h+T.getNonEmptyVisibleRowCount(this)){T.focusItem(this,g-j*(i-h-r.fixedTop),E);}else{T.focusItem(this,g-j*(i-h-T.getNonEmptyVisibleRowCount(this)+1),E);}}if(o.isOfType(C.ROWACTION)&&i===h&&r.fixedTop>0){p(E);}}};b.prototype.onsappagedown=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}E.preventDefault();var o=T.getCellInfo(E.target);if(o.isOfType(C.ANY)){var F=T.getFocusedItemInfo(this);var i=F.row;var h=T.getHeaderRowCount(this);var n=T.getNonEmptyVisibleRowCount(this);var r=this._getRowCounts();p(E);if((T.isNoDataVisible(this)&&i<h-1)||r.fixedBottom===0||i<h+n-1){var g=F.cell;var j=F.columnCount;if(i<h-1&&!o.isOfType(C.COLUMNROWHEADER)){T.focusItem(this,g+j*(h-i-1),E);}else if(i<h){if(!T.isNoDataVisible(this)){T.focusItem(this,g+j*(h-i),E);}}else if(i>=h&&i<h+n-r.fixedBottom-1){T.focusItem(this,g+j*(h+n-r.fixedBottom-i-1),E);}else if(i===h+n-r.fixedBottom-1){var P=T.getNonEmptyVisibleRowCount(this)-r.fixedTop-r.fixedBottom;var R=this._getTotalRowCount()-r.fixedBottom-this.getFirstVisibleRow()-P*2;this._getScrollExtension().scrollVertically(true,true,true);if(R<P&&r.fixedBottom>0){T.focusItem(this,g+j*(h+n-i-1),E);}}else{T.focusItem(this,g+j*(h+n-i-1),E);}}}};b.prototype.onsappageupmodifiers=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}if(b._isKeyCombination(E,null,M.ALT)){var o=T.getCellInfo(E.target);var F=T.getFocusedItemInfo(this);if(o.isOfType(C.DATACELL|C.COLUMNHEADER)){var i=F.cell;var g=F.cellInRow;var h=T.hasRowHeader(this);var r=h?1:0;var P=H;p(E);if(h&&(T.Grouping.isInGroupHeaderRow(E.target)||g===1)){T.focusItem(this,i-g,null);}else if(g-r<P){T.focusItem(this,i-g+r,null);}else{T.focusItem(this,i-P,null);}}else if(o.isOfType(C.ROWACTION)){T.focusItem(this,F.cell-1,null);}}};b.prototype.onsappagedownmodifiers=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}if(b._isKeyCombination(E,null,M.ALT)){var o=T.getCellInfo(E.target);if(o.isOfType(C.DATACELL|C.ROWHEADER|C.ANYCOLUMNHEADER)){var F=T.getFocusedItemInfo(this);var i=F.cellInRow;var h=T.hasRowHeader(this);var r=h?1:0;var v=T.getVisibleColumnCount(this);var g=parseInt(o.cell.attr("colspan")||1);p(E);if(i+g-r<v){var j=F.cell;var P=H;if(h&&i===0){T.focusItem(this,j+1,null);}else if(g>P){T.focusItem(this,j+g,null);}else if(i+g-r+P>v){T.focusItem(this,j+v-i-1+r,null);}else if(!T.Grouping.isInGroupHeaderRow(E.target)){T.focusItem(this,j+P,null);}}else if(o.isOfType(C.DATACELL)&&T.hasRowActions(this)&&i===F.columnCount-2){T.focusItem(this,F.cell+1,null);}}}};b.prototype.onsapenter=function(E){b._handleSpaceAndEnter(this,E);};return b;});