!function(){var e=function(e){var r=e.split("^");return{id:r[0],name:"Hoang Anh Gia Lai",price0:{ceil:parseFloat(r[1]),floor:parseFloat(r[2]),reference:parseFloat(r[3])},live:{match:{price:parseNumber(r[11]),volume:nomaliseAmount(parseNumber(r[12]))},buy:[{price:parseNumber(r[4]),volume:nomaliseAmount(parseNumber(r[5]))},{price:parseNumber(r[6]),volume:nomaliseAmount(parseNumber(r[7]))},{price:parseNumber(r[8]),volume:nomaliseAmount(parseNumber(r[9]))}],sell:[{price:parseNumber(r[13]),volume:nomaliseAmount(parseNumber(r[14]))},{price:parseNumber(r[15]),volume:nomaliseAmount(parseNumber(r[16]))},{price:parseNumber(r[17]),volume:nomaliseAmount(parseNumber(r[18]))}],stats:{totalVolume:nomaliseAmount(parseNumber(r[19])),high:parseNumber(r[21]),low:parseNumber(r[22]),average:parseNumber(r[20])},foreign:{buyVolume:nomaliseAmount(parseNumber(r[25])),buyRoom:nomaliseAmount(parseNumber(r[27])),sellAmount:nomaliseAmount(parseNumber(r[26])),sellRoom:nomaliseAmount(parseNumber(r[27]))}}}};get(Url.mbsHttp.toUrl(Url.mbsHttp.full,storage.codes),function(r){for(var o=r.split("|")[2].split("#"),s=new Set,a=storage.codes,m=0;m<a.length;m++)s.add(a[m]);var t,u;storage.stockCodes=[];for(var l=storage.stockCodes,m=0,n=o.length;n>m;m++)t=o[m],u=t.substr(0,3),s.has(u)&&l.push(e(t));app.stocks=updateStock(app.stocks,l),setInterval(function(){get(Url.mbsHttp.toUrl(Url.mbsHttp.change,storage.codes),function(e){console.log(e)})},1e3)})}();