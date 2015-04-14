window.indexedDB=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB,window.indexedDB||window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");var DataLoaderState={index:1,content:2,finish:10},request=window.indexedDB.open("CollocationDB",dbVersion);request.onerror=function(e){alert("Database error: "+e.target.errorCode)};var db;request.onsuccess=function(e){db=e.target.result},request.onupgradeneeded=function(e){db=e.target.result;var t=db.createObjectStore("words",{keyPath:"id"});t.createIndex("id","id",{unique:!0})};var reloadHttpData=function(e,t){e.get("/collocation/data/index.json").success(function(n,o,r,a){var d=createMapsFromIndex(n);saveIndexes(d),t(DataLoaderState.index,d),e.get("/collocation/data/content.json").success(function(e,n,o,r){t(DataLoaderState.content);var a=getWordsObjectStorage("readwrite");a.oncomplete=function(e){},console.log(e);for(var d=0;d<e.length;d++)a.add(e[d]);t(DataLoaderState.finish),localStorage.setItem("dbVersion",dbVersion)}).error(function(e,t,n,o){})}).error(function(e,n,o,r){t("data")})},saveIndexes=function(e){localStorage.setItem("indexMaps",JSON.stringify(e))},createMapsFromIndex=function(e){for(var t={},n={},o={},r=0,a=e.length;a>r;r++){var d=e[r],i=d.key.substr(0,1),s=d.key.substr(0,2),c=d.key.substr(0,3);i in t?t[i].push(r):t[i]=[r],2==s.length&&s in n?n[s].push(r):n[s]=[r],3==c.length&&c in o?o[c].push(r):o[c]=[r]}return{indexes:e,map1:t,map2:n,map3:o}},getWordsObjectStorage=function(e){return db?db.transaction("words",e).objectStore("words"):null},loadIndexFromStorage=function(e){var t=localStorage.getItem("indexMaps");if(t){var n=JSON.parse(t);e(DataLoaderState.index,n)}},getWordDefinition=function(e,t){var n=getWordsObjectStorage(),o=n.get(e);o.onerror=function(e){},o.onsuccess=function(e){t&&t(e.target.result)}},checkDataAAvailable=function(){return localStorage.getItem("dbVersion")?!0:!1},readDBVersion=function(){var e=localStorage.getItem("dbVersion");return e?parseInt(e):0};