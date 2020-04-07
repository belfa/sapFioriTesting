/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_Batch","./_GroupLock","./_Helper","./_V2Requestor","sap/base/Log","sap/ui/base/SyncPromise","sap/ui/thirdparty/jquery"],function(_,a,b,c,L,S,q){"use strict";var B={"Accept":"multipart/mixed"},C="sap.ui.model.odata.v4.lib._Requestor",d,r=/^\d+$/;function g(h){var s;h=h.toLowerCase();for(s in this.headers){if(s.toLowerCase()===h){return this.headers[s];}}}function R(s,h,Q,m){this.mBatchQueue={};this.mHeaders=h||{};this.aLockedGroupLocks=[];this.oModelInterface=m;this.sQueryParams=b.buildQuery(Q);this.mRunningChangeRequests={};this.oSecurityTokenPromise=null;this.iSessionTimer=0;this.iSerialNumber=0;this.sServiceUrl=s;}R.prototype.mFinalHeaders={"Content-Type":"application/json;charset=UTF-8;IEEE754Compatible=true"};R.prototype.mPredefinedPartHeaders={"Accept":"application/json;odata.metadata=minimal;IEEE754Compatible=true"};R.prototype.mPredefinedRequestHeaders={"Accept":"application/json;odata.metadata=minimal;IEEE754Compatible=true","OData-MaxVersion":"4.0","OData-Version":"4.0","X-CSRF-Token":"Fetch"};R.prototype.mReservedHeaders={accept:true,"accept-charset":true,"content-encoding":true,"content-id":true,"content-language":true,"content-length":true,"content-transfer-encoding":true,"content-type":true,"if-match":true,"if-none-match":true,isolation:true,"odata-isolation":true,"odata-maxversion":true,"odata-version":true,prefer:true,"sap-contextid":true};R.prototype.addChangeSet=function(G){var e=[],f=this.getOrCreateBatchQueue(G);e.iSerialNumber=this.getSerialNumber();f.iChangeSet+=1;f.splice(f.iChangeSet,0,e);};R.prototype.addChangeToGroup=function(o,G){var e;if(this.getGroupSubmitMode(G)==="Direct"){o.$resolve(this.request(o.method,o.url,this.lockGroup(G,this,true,true),o.headers,o.body,o.$submit,o.$cancel));}else{e=this.getOrCreateBatchQueue(G);e[e.iChangeSet].push(o);}};R.prototype.addQueryString=function(s,m,Q){var e=this.buildQueryString(m,Q,false,true);return s+(s.includes("?")?"&"+e.slice(1):e);};R.prototype.batchRequestSent=function(G,h){var p,f;if(h){if(this.mRunningChangeRequests[G]){throw new Error("Unexpected second $batch");}p=new S(function(e){f=e;});p.$resolve=f;this.mRunningChangeRequests[G]=p;}};R.prototype.batchResponseReceived=function(G,h){if(h){this.mRunningChangeRequests[G].$resolve();delete this.mRunningChangeRequests[G];}};R.prototype.buildQueryString=function(m,Q,D,s){return b.buildQuery(this.convertQueryOptions(m,Q,D,s));};R.prototype.cancelChanges=function(G){if(this.mRunningChangeRequests[G]){throw new Error("Cannot cancel the changes for group '"+G+"', the batch request is running");}this.cancelChangesByFilter(function(){return true;},G);this.cancelGroupLocks(G);};R.prototype.cancelChangesByFilter=function(f,G){var e=false,t=this;function h(s){var k=t.mBatchQueue[s],o,l,E,i,j;for(j=k.length-1;j>=0;j-=1){if(Array.isArray(k[j])){l=k[j];for(i=l.length-1;i>=0;i-=1){o=l[i];if(o.$cancel&&f(o)){o.$cancel();E=new Error("Request canceled: "+o.method+" "+o.url+"; group: "+s);E.canceled=true;o.$reject(E);l.splice(i,1);e=true;}}}}}if(G){if(this.mBatchQueue[G]){h(G);}}else{for(G in this.mBatchQueue){h(G);}}return e;};R.prototype.cancelGroupLocks=function(G){this.aLockedGroupLocks.forEach(function(o){if((!G||G===o.getGroupId())&&o.isModifying()&&o.isLocked()){o.cancel();}});};R.prototype.checkForOpenRequests=function(){var t=this;if(Object.keys(this.mRunningChangeRequests).length||Object.keys(this.mBatchQueue).some(function(G){return t.mBatchQueue[G].some(function(v){return Array.isArray(v)?v.length:true;});})||this.aLockedGroupLocks.some(function(G){return G.isLocked();})){throw new Error("Unexpected open requests");}};R.prototype.checkHeaderNames=function(h){var k;for(k in h){if(this.mReservedHeaders[k.toLowerCase()]){throw new Error("Unsupported header: "+k);}}};R.prototype.cleanUpChangeSets=function(e){var f,h=false,i;function j(o){if(!m(o)){f.push(o);}}function m(o){if(o.method!=="PATCH"){return false;}return f.some(function(k){if(k.method==="PATCH"&&k.headers["If-Match"]===o.headers["If-Match"]){b.merge(k.body,o.body);o.$resolve(k.$promise);return true;}});}for(i=e.iChangeSet;i>=0;i-=1){f=[];e[i].forEach(j);if(f.length===0){e.splice(i,1);}else if(f.length===1&&this.isChangeSetOptional()){e[i]=f[0];}else{e[i]=f;}h=h||f.length>0;}return h;};R.prototype.clearSessionContext=function(t){if(t){this.oModelInterface.fireSessionTimeout();}delete this.mHeaders["SAP-ContextId"];if(this.iSessionTimer){clearInterval(this.iSessionTimer);this.iSessionTimer=0;}};R.prototype.convertExpand=function(e,s){var k,f=[],t=this;if(!e||typeof e!=="object"){throw new Error("$expand must be a valid object");}k=Object.keys(e);if(s){k=k.sort();}k.forEach(function(E){var v=e[E];if(v&&typeof v==="object"){f.push(t.convertExpandOptions(E,v,s));}else{f.push(E);}});return f.join(",");};R.prototype.convertExpandOptions=function(e,E,s){var f=[];this.doConvertSystemQueryOptions(undefined,E,function(o,O){f.push(o+'='+O);},undefined,s);return f.length?e+"("+f.join(";")+")":e;};R.prototype.convertQueryOptions=function(m,Q,D,s){var e={};if(!Q){return undefined;}this.doConvertSystemQueryOptions(m,Q,function(k,v){e[k]=v;},D,s);return e;};R.prototype.convertResourcePath=function(s){return s;};R.prototype.destroy=function(){this.clearSessionContext();};R.prototype.doCheckVersionHeader=function(G,s,v){var o=G("OData-Version"),D=!o&&G("DataServiceVersion");if(D){throw new Error("Expected 'OData-Version' header with value '4.0' but received"+" 'DataServiceVersion' header with value '"+D+"' in response for "+this.sServiceUrl+s);}if(o==="4.0"||!o&&v){return;}throw new Error("Expected 'OData-Version' header with value '4.0' but received value '"+o+"' in response for "+this.sServiceUrl+s);};R.prototype.doConvertResponse=function(o,m){return o;};R.prototype.doConvertSystemQueryOptions=function(m,Q,f,D,s){var t=this;Object.keys(Q).forEach(function(k){var v=Q[k];if(D&&k[0]==='$'){return;}switch(k){case"$expand":v=t.convertExpand(v,s);break;case"$select":if(Array.isArray(v)){v=s?v.sort().join(","):v.join(",");}break;default:}f(k,v);});};R.prototype.fetchTypeForPath=function(m,A){return this.oModelInterface.fetchMetadata(m+(A?"/$Type":"/"));};R.prototype.formatPropertyAsLiteral=function(v,p){return b.formatLiteral(v,p.$Type);};R.prototype.getGroupSubmitMode=function(G){return this.oModelInterface.getGroupProperty(G,"submit");};R.prototype.getModelInterface=function(){return this.oModelInterface;};R.prototype.getOrCreateBatchQueue=function(G){var e,f=this.mBatchQueue[G];if(!f){e=[];e.iSerialNumber=0;f=this.mBatchQueue[G]=[e];f.iChangeSet=0;if(this.oModelInterface.onCreateGroup){this.oModelInterface.onCreateGroup(G);}}return f;};R.prototype.getPathAndAddQueryOptions=function(p,o,P){var A=[],n,N={},e,t=this;p=p.slice(1,-5);if(o.$Parameter){o.$Parameter.forEach(function(e){N[e.$Name]=e;});}if(o.$kind==="Function"){for(n in P){e=N[n];if(e){if(e.$isCollection){throw new Error("Unsupported collection-valued parameter: "+n);}A.push(encodeURIComponent(n)+"="+encodeURIComponent(t.formatPropertyAsLiteral(P[n],e)));}}p+="("+A.join(",")+")";}else{for(n in P){if(!(n in N)){delete P[n];}}}return p;};R.prototype.getSerialNumber=function(){this.iSerialNumber+=1;return this.iSerialNumber;};R.prototype.getServiceUrl=function(){return this.sServiceUrl;};R.prototype.hasChanges=function(G,e){var f=this.mBatchQueue[G];if(f){return f.some(function(v){return Array.isArray(v)&&v.some(function(o){return o.headers["If-Match"]===e;});});}return false;};R.prototype.hasPendingChanges=function(G){var t=this;function f(m){if(!G){return Object.keys(m);}return G in m?[G]:[];}return f(this.mRunningChangeRequests).length>0||this.aLockedGroupLocks.some(function(o){return(G===undefined||o.getGroupId()===G)&&o.isModifying()&&o.isLocked();})||f(this.mBatchQueue).some(function(s){return t.mBatchQueue[s].some(function(v){return Array.isArray(v)&&v.some(function(o){return o.$cancel;});});});};R.prototype.isActionBodyOptional=function(){return false;};R.prototype.isChangeSetOptional=function(){return true;};R.prototype.mergeGetRequests=function(e){var f=[],t=this;function m(o){return o.$queryOptions&&f.some(function(h){if(h.$queryOptions&&o.url===h.url){b.aggregateQueryOptions(h.$queryOptions,o.$queryOptions);o.$resolve(h.$promise);return true;}return false;});}e.forEach(function(o){if(!m(o)){f.push(o);}});f.forEach(function(o){if(o.$queryOptions){o.url=t.addQueryString(o.url,o.$metaPath,o.$queryOptions);}});f.iChangeSet=e.iChangeSet;return f;};R.prototype.processBatch=function(G){var h,e=this.mBatchQueue[G]||[],t=this;function o(i){if(Array.isArray(i)){i.forEach(o);}else if(i.$submit){i.$submit();}}function f(E,i){if(Array.isArray(i)){i.forEach(f.bind(null,E));}else{i.$reject(E);}}function v(e,i){var j;e.forEach(function(k,l){var E,s,m,n=i[l];if(Array.isArray(n)){v(k,n);}else if(!n){E=new Error("HTTP request was not processed because the previous request failed");E.cause=j;E.$reported=true;k.$reject(E);}else if(n.status>=400){n.getResponseHeader=g;j=b.createError(n,"Communication error",k.url,k.$resourcePath);f(j,k);}else{if(n.responseText){try{t.doCheckVersionHeader(g.bind(n),k.url,true);m=t.doConvertResponse(JSON.parse(n.responseText),k.$metaPath);}catch(p){k.$reject(p);return;}}else{m={};}t.reportUnboundMessagesAsJSON(k.url,g.call(n,"sap-messages"));s=g.call(n,"ETag");if(s){m["@odata.etag"]=s;}k.$resolve(m);}});}delete this.mBatchQueue[G];o(e);h=this.cleanUpChangeSets(e);if(e.length===0){return Promise.resolve();}this.batchRequestSent(G,h);e=this.mergeGetRequests(e);return this.sendBatch(d.cleanBatch(e)).then(function(i){v(e,i);}).catch(function(E){var i=new Error("HTTP request was not processed because $batch failed");i.cause=E;f(i,e);throw E;}).finally(function(){t.batchResponseReceived(G,h);});};R.prototype.ready=function(){return S.resolve();};R.prototype.lockGroup=function(G,o,l,m,f){var e;e=new a(G,o,l,m,this.getSerialNumber(),f);if(l){this.aLockedGroupLocks.push(e);}return e;};R.prototype.refreshSecurityToken=function(o){var t=this;if(!this.oSecurityTokenPromise){if(o!==this.mHeaders["X-CSRF-Token"]){return Promise.resolve();}this.oSecurityTokenPromise=new Promise(function(f,e){q.ajax(t.sServiceUrl+t.sQueryParams,{method:"HEAD",headers:Object.assign({},t.mHeaders,{"X-CSRF-Token":"Fetch"})}).then(function(D,T,j){var s=j.getResponseHeader("X-CSRF-Token");if(s){t.mHeaders["X-CSRF-Token"]=s;}else{delete t.mHeaders["X-CSRF-Token"];}t.oSecurityTokenPromise=null;f();},function(j,T,E){t.oSecurityTokenPromise=null;e(b.createError(j,"Could not refresh security token"));});});}return this.oSecurityTokenPromise;};R.prototype.relocate=function(s,o,n){var e=this.mBatchQueue[s],t=this,f=e&&e[0].some(function(h,i){if(h.body===o){t.addChangeToGroup(h,n);e[0].splice(i,1);return true;}});if(!f){throw new Error("Request not found in group '"+s+"'");}};R.prototype.relocateAll=function(s,n,e){var j=0,f=this.mBatchQueue[s],t=this;if(f){f[0].slice().forEach(function(o){if(!e||o.headers["If-Match"]===e){t.addChangeToGroup(o,n);f[0].splice(j,1);}else{j+=1;}});}};R.prototype.removePatch=function(p){var e=this.cancelChangesByFilter(function(o){return o.$promise===p;});if(!e){throw new Error("Cannot reset the changes, the batch request is running");}};R.prototype.removePost=function(G,e){var o=b.getPrivateAnnotation(e,"postBody"),f=this.cancelChangesByFilter(function(h){return h.body===o;},G);if(!f){throw new Error("Cannot reset the changes, the batch request is running");}};R.prototype.reportUnboundMessagesAsJSON=function(s,m){this.oModelInterface.reportUnboundMessages(s,JSON.parse(m||null));};R.prototype.request=function(m,s,G,h,p,f,e,M,o,A,Q){var i,E,j=G&&G.getGroupId()||"$direct",P,k=Infinity,l,t=this;if(j==="$cached"){E=new Error("Unexpected request: "+m+" "+s);E.$cached=true;throw E;}if(G&&G.isCanceled()){if(e){e();}E=new Error("Request already canceled");E.canceled=true;return Promise.reject(E);}if(G){G.unlock();k=G.getSerialNumber();}s=this.convertResourcePath(s);o=o||s;if(this.getGroupSubmitMode(j)!=="Direct"){P=new Promise(function(n,u){var v=t.getOrCreateBatchQueue(j);l={method:m,url:s,headers:Object.assign({},t.mPredefinedPartHeaders,t.mHeaders,h,t.mFinalHeaders),body:p,$cancel:e,$metaPath:M,$queryOptions:Q,$reject:u,$resolve:n,$resourcePath:o,$submit:f};if(m==="GET"){v.push(l);}else if(A){v[0].unshift(l);}else{i=v.iChangeSet;while(v[i].iSerialNumber>k){i-=1;}v[i].push(l);}});l.$promise=P;return P;}if(Q){s=t.addQueryString(s,M,Q);}if(f){f();}return this.sendRequest(m,s,Object.assign({},h,this.mFinalHeaders),JSON.stringify(d.cleanPayload(p)),o).then(function(n){t.reportUnboundMessagesAsJSON(n.resourcePath,n.messages);return t.doConvertResponse(n.body,M);});};R.prototype.sendBatch=function(e){var o=_.serializeBatchRequest(e);return this.sendRequest("POST","$batch"+this.sQueryParams,Object.assign(o.headers,B),o.body).then(function(f){if(f.messages!==null){throw new Error("Unexpected 'sap-messages' response header for batch request");}return _.deserializeBatchResponse(f.contentType,f.body);});};R.prototype.sendRequest=function(m,s,h,p,o){var e=this.sServiceUrl+s,t=this;return new Promise(function(f,i){function j(I){var O=t.mHeaders["X-CSRF-Token"];return q.ajax(e,{contentType:h&&h["Content-Type"],data:p,headers:Object.assign({},t.mPredefinedRequestHeaders,t.mHeaders,b.resolveIfMatchHeader(h)),method:m}).then(function(v,T,k){var E=k.getResponseHeader("ETag"),l=k.getResponseHeader("X-CSRF-Token");try{t.doCheckVersionHeader(k.getResponseHeader,s,!v);}catch(n){i(n);return;}if(l){t.mHeaders["X-CSRF-Token"]=l;}t.setSessionContext(k.getResponseHeader("SAP-ContextId"),k.getResponseHeader("SAP-Http-Session-Timeout"));v=v||{};if(E){v["@odata.etag"]=E;}f({body:v,contentType:k.getResponseHeader("Content-Type"),messages:k.getResponseHeader("sap-messages"),resourcePath:s});},function(k,T,E){var l=k.getResponseHeader("SAP-ContextId"),n=k.getResponseHeader("X-CSRF-Token"),M;if(!I&&k.status===403&&n&&n.toLowerCase()==="required"){t.refreshSecurityToken(O).then(function(){j(true);},i);}else{M="Communication error";if(l){t.setSessionContext(l,k.getResponseHeader("SAP-Http-Session-Timeout"));}else if(t.mHeaders["SAP-ContextId"]){M="Session not found on server";L.error(M,undefined,C);t.clearSessionContext(true);}i(b.createError(k,M,e,o));}});}if(t.oSecurityTokenPromise&&m!=="GET"){return t.oSecurityTokenPromise.then(j);}return j();});};R.prototype.setSessionContext=function(s,e){var t=r.test(e)?parseInt(e):0,i=Date.now()+15*60*1000,f=this;this.clearSessionContext();if(s){f.mHeaders["SAP-ContextId"]=s;if(t>=60){this.iSessionTimer=setInterval(function(){if(Date.now()>=i){f.clearSessionContext(true);}else{q.ajax(f.sServiceUrl+f.sQueryParams,{method:"HEAD",headers:{"SAP-ContextId":f.mHeaders["SAP-ContextId"]}}).fail(function(j){if(j.getResponseHeader("SAP-Err-Id")==="ICMENOSESSION"){L.error("Session not found on server",undefined,C);f.clearSessionContext(true);}});}},(t-5)*1000);}else if(e!==null){L.warning("Unsupported SAP-Http-Session-Timeout header",e,C);}}};R.prototype.submitBatch=function(G){var e,p,t=this;p=S.all(this.aLockedGroupLocks.map(function(o){return o.waitFor(G);}));e=p.isPending();if(e){L.info("submitBatch('"+G+"') is waiting for locks",null,C);}return p.then(function(){if(e){L.info("submitBatch('"+G+"') continues",null,C);}t.aLockedGroupLocks=t.aLockedGroupLocks.filter(function(o){return o.isLocked();});return t.processBatch(G);});};R.prototype.waitForRunningChangeRequests=function(G){return this.mRunningChangeRequests[G]||S.resolve();};d={cleanBatch:function(e){e.forEach(function(o){if(Array.isArray(o)){d.cleanBatch(o);}else{o.body=d.cleanPayload(o.body);}});return e;},cleanPayload:function(p){var o=p;if(o){Object.keys(o).forEach(function(k){if(k.indexOf("@$ui5.")===0){if(o===p){o=Object.assign({},p);}delete o[k];}});}return o;},create:function(s,m,h,Q,o){var e=new R(s,h,Q,m);if(o==="2.0"){c(e);}return e;}};return d;},false);
