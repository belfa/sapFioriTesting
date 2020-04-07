/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control"],function(C){"use strict";var L=C.extend("sap.f.cards.loading.ListPlaceholder",{metadata:{library:"sap.f",properties:{maxItems:{type:"int",group:"Misc"},item:{type:"any"}}},renderer:function(r,c){var m=c.getMaxItems(),I=c.getItem();r.write("<div");r.addClass("sapFCardContentPlaceholder");r.addClass("sapFCardContentListPlaceholder");r.attr("tabindex","0");r.writeClasses();r.writeElementData(c);r.write(">");for(var i=0;i<m;i++){r.write("<div");r.addClass("sapFCardContentShimmerPlaceholderItem");if(I&&!I.icon&&!I.description){r.addClass("sapFCardContentShimmerPlaceholderNoIcon");}r.writeClasses();r.write(">");if(I&&I.icon){r.write("<div");r.addClass("sapFCardContentShimmerPlaceholderImg");r.addClass("sapFCardLoadingShimmer");r.writeClasses();r.write(">");r.write("</div>");}r.write("<div");r.addClass("sapFCardContentShimmerPlaceholderRows");r.writeClasses();r.write(">");if(I&&I.title){r.write("<div");r.addClass("sapFCardContentShimmerPlaceholderItemText");r.addClass("sapFCardLoadingShimmer");r.writeClasses();r.write(">");r.write("</div>");}if(I&&I.description){r.write("<div");r.addClass("sapFCardContentShimmerPlaceholderItemText");r.addClass("sapFCardLoadingShimmer");r.writeClasses();r.write(">");r.write("</div>");}r.write("</div>");r.write("</div>");}r.write("</div>");}});return L;});