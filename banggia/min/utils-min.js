function detectMobile(){var e=new MobileDetect(window.navigator.userAgent);return"iOS"===e.os()&&"iPad"!==e.mobile()||"AndroidOS"===e.os()}function get(e,t){var n=new XMLHttpRequest;n.open("GET",e),n.addEventListener("load",function(e){t(e.target.responseText)}),n.send()}function parseNumber(e){if(void 0===e||0===e.length)return"";if("ATC"===e||"ATO"===e)return e;e=e.replace(",","");var t=parseFloat(e);return isNaN(t)?"":t}function round(e,t){return Math.round(e*t)/t}function normaliseAmount(e){if(""===e)return"";var t=e%100;e=Math.floor(e/100);for(var n=t>=10?"":"0",o=n+t;e>0;)t=e%1e3,e=Math.floor(e/1e3),n=0===e?"":t>=100?"":t>=10?"0":"00",o=n+t+","+o;return o}function checkChangeObject(e,t,n){for(var o=0;o<n.length;o++){var r=n[o];t[r]&&e[r]!==t[r]&&(e[r+"Update"]=.8),e[r]=t[r]}}function checkChange(e,t){var n=e.live,o=t.live;checkChangeObject(n.match,o.match,["price","volume"]);for(var r=0;3>r;r++)checkChangeObject(n.buy[r],o.buy[r],["price","volume"]),checkChangeObject(n.sell[r],o.sell[r],["price","volume"])}function updateStock(e,t){var n={},o,r,c;for(o=0;o<e.length;o++)r=e[o],n[r.id]=r;for(o=0;o<t.length;o++)r=t[o],c=r.id,n.hasOwnProperty(c)?checkChange(n[c],r):n[c]=r;var a=[];for(o=0;o<t.length;o++)c=t[o].id,a.push(n[c]);return a}function detectStockValueChangeType(e,t){var n=e.live.match.price;if("undefined"!=typeof t&&(n=t),""===t||0>t)return"";if("ATC"===t||"ATO"===t)return"atoatc";var o=e.price0.reference;return n>o?n>=e.price0.ceil?"c":"i":n===o?"e":n<=e.price0.floor?"f":"d"}function getStockChangeValue(e){var t=e.live.match.price-e.price0.reference;if(0===t)return"";var n=t>0,o=Math.abs(t)/e.price0.reference*100;return(n?"+":"")+round(t,100)+(n?"▲":"▼")+round(o,100)+"%"}var Store={stockIds:"stockIds"},Url={proxy:"http://herokuperoxy-1-us.herokuapp.com/proxy/?url=",mbsHttp:{full:"http://quote24pro.mbs.com.vn/Handler/LoadFull.ashx?Sequence=0&TradingCenter=&listCode={{code}}&{}&_={{timestamp}}",change:"http://quote24pro.mbs.com.vn/Handler/Mixed/LoadChange.ashx?Sequence=333350&TradingCenter=&ListCode={{code}}&{}&_={{timestamp}}",toUrl:function(e,t){return e=e.replace("{{code}}",t.join(",")).replace("{{timestamp}}",(new Date).getTime()),Url.proxy+encodeURIComponent(e)}},mbsWebsocket:["ws://banggia.mbs.com.vn/sjsrlt/153/5tw64kyi/websocket"],vndWebsocket:["wss://price-hn05.vndirect.com.vn/realtime/855/vlihtmgq/websocket"],fpt:{httpHSX:"http://priceboard.fpts.com.vn/hsx/data.ashx?s=quote&l=All",httpHNX:"http://priceboard.fpts.com.vn/hnx/data.ashx?s=quote&l=HNXIndex",httpUPC:"http://priceboard.fpts.com.vn/hnx/data.ashx?s=quote&l=HNXUpcomIndex",wsHSX:"ws://priceboard.fpts.com.vn/hsx/signalr/connect?transport=webSockets&clientProtocol=1.5&connectionToken={{connectionToken}}&connectionData=%5B%7B%22name%22%3A%22hubhsx2%22%7D%5D&tid=5",wsHSX2:"ws://priceboard.fpts.com.vn/hsx/signalr/connect?transport=webSockets&clientProtocol=1.5&connectionToken={{connectionToken}}&connectionData=%5B%7B%22name%22%3A%22hubhsx2%22%7D%5D&tid=8",httpStartWs1:"http://priceboard.fpts.com.vn/hnx/signalr/start?transport=webSockets&clientProtocol=1.5&connectionToken={{connectionToken}}&connectionData=%5B%7B%22name%22%3A%22hubhnx2%22%7D%5D&_={{timestamp}}",httpStartWs2:"http://priceboard.fpts.com.vn/hsx/signalr/start?transport=webSockets&clientProtocol=1.5&connectionToken={{connectionToken}}&connectionData=%5B%7B%22name%22%3A%22hubhsx2%22%7D%5D&_={{timestamp}}"}};