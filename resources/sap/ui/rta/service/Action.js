/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/dt/OverlayRegistry","sap/ui/dt/Util","sap/base/util/restricted/_castArray","sap/base/util/restricted/_pick"],function(O,D,_,a){"use strict";return function(r){function i(v,o){return typeof v==='function'?v(o):v;}function g(E){var m=r._oDesignTime.getPlugins().map(function(p){return p.getMenuItems(E);});return Promise.all(m).then(function(M){return M.reduce(function(R,M){return M?R.concat(M):R;},[]).map(function(c){return Object.assign({},c,{enabled:i(c.enabled,E),text:i(c.text,E[0])});});});}function b(c){var C=_(c);var E=C.map(function(s){var o=O.getOverlay(s);if(!o){throw new Error(D.printf('Control with id="{0}" is not under the one of root elements or ignored.',s));}return o;});return g(E).then(function(m){return m.map(function(M){return a(M,['id','icon','rank','group','enabled','text']);});});}function e(c,A){var C=_(c);var E=C.map(function(s){var o=O.getOverlay(s);if(!o){throw new Error(D.printf('Control with id="{0}" is not under the one of root elements or ignored.',s));}return o;});return g(E).then(function(d){var m=d.filter(function(m){return m.id===A;}).pop();if(!m){throw new Error('No action found by specified ID');}else{return m.handler(E,{});}});}return{exports:{get:b,execute:e}};};});
