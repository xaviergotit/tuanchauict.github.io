/**
 * Created by tuanchau on 6/28/17.
 */
var Store = {
    stockIds: 'stockIds'
};

var Url = {
    proxy: 'http://herokuperoxy-1-us.herokuapp.com/proxy/?url=',
    mbsHttp: {
        full: 'http://quote24pro.mbs.com.vn/Handler/LoadFull.ashx?Sequence=0&TradingCenter=&listCode={{code}}&{}&_={{timestamp}}',
        change: 'http://quote24pro.mbs.com.vn/Handler/Mixed/LoadChange.ashx?Sequence=333350&TradingCenter=&ListCode={{code}}&{}&_={{timestamp}}',

        toUrl: function (url, codes) {
            url = url.replace('{{code}}', codes.join(',')).replace('{{timestamp}}', new Date().getTime());
            return Url.proxy + encodeURIComponent(url);
        }
    },
    mbsWebsocket: [
        'ws://banggia.mbs.com.vn/sjsrlt/153/5tw64kyi/websocket'
    ],
    vndWebsocket: [
        'wss://price-hn05.vndirect.com.vn/realtime/855/vlihtmgq/websocket'
    ],
    fpt: {
        httpHSX: 'http://priceboard.fpts.com.vn/hsx/data.ashx?s=quote&l=All',
        httpHNX: 'http://priceboard.fpts.com.vn/hnx/data.ashx?s=quote&l=HNXIndex',
        httpUPC: 'http://priceboard.fpts.com.vn/hnx/data.ashx?s=quote&l=HNXUpcomIndex',
        wsHSX: 'ws://priceboard.fpts.com.vn/hsx/signalr/connect?transport=webSockets&clientProtocol=1.5&connectionToken={{connectionToken}}&connectionData=%5B%7B%22name%22%3A%22hubhsx2%22%7D%5D&tid=5',
        wsHSX2: 'ws://priceboard.fpts.com.vn/hsx/signalr/connect?transport=webSockets&clientProtocol=1.5&connectionToken={{connectionToken}}&connectionData=%5B%7B%22name%22%3A%22hubhsx2%22%7D%5D&tid=8',
        httpStartWs1: 'http://priceboard.fpts.com.vn/hnx/signalr/start?transport=webSockets&clientProtocol=1.5&connectionToken={{connectionToken}}&connectionData=%5B%7B%22name%22%3A%22hubhnx2%22%7D%5D&_={{timestamp}}',
        httpStartWs2: 'http://priceboard.fpts.com.vn/hsx/signalr/start?transport=webSockets&clientProtocol=1.5&connectionToken={{connectionToken}}&connectionData=%5B%7B%22name%22%3A%22hubhsx2%22%7D%5D&_={{timestamp}}'

    }
};

function detectMobile(){
    var md = new MobileDetect(window.navigator.userAgent);
    return (md.os() === 'iOS' && md.mobile() !== 'iPad') || (md.os() === 'AndroidOS');
}

function get(url, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.addEventListener('load', function (res) {
        callback(res.target.responseText);
    });
    req.send();
}

function parseNumber(text) {
    if (text === undefined || text.length === 0)
        return '';
    if (text === 'ATC' || text === 'ATO')
        return text;
    text = text.replace(',', '');
    var num = parseFloat(text);
    return isNaN(num) ? '' : num;
}

function round(number, to) {
    return Math.round(number * to) / to;
}

function normaliseAmount(number) {
    if (number === '') {
        return ''
    }

    var low = number % 100;
    number = Math.floor(number / 100);
    var p = low >= 10 ? '' : '0';
    var r = p + low;
    while (number > 0) {
        low = number % 1000;
        number = Math.floor(number / 1000);
        p = number === 0 ? '' : low >= 100 ? '' : low >= 10 ? '0' : '00';
        r = p + low + ',' + r;
    }
    return r;
}

function checkChangeObject(oldObject, newObject, keys){
    for (var i  = 0; i < keys.length; i++){
        var key = keys[i];
        if(newObject[key] && oldObject[key] !== newObject[key]){
            oldObject[key + 'Update'] = 0.8;
        }
        oldObject[key] = newObject[key];
    }
}

function checkChange(oldStock, newStock){
    var lo = oldStock.live;
    var ln = newStock.live;
    checkChangeObject(lo.match, ln.match, ['price', 'volume']);
    for(var i = 0; i < 3; i++){
        checkChangeObject(lo.buy[i], ln.buy[i], ['price', 'volume']);
        checkChangeObject(lo.sell[i], ln.sell[i], ['price', 'volume']);
    }
    oldStock.price0 = newStock.price0;
    oldStock.live.stats = newStock.live.stats;
    oldStock.live.foreign = newStock.live.foreign;
    // checkChangeObject(lo.stats, ln.stats, ['totalVolume', 'high', 'low', 'average']);
    // checkChangeObject(lo.foreign, ln.foreign, ['buyVolume', 'buyRoom', 'sellAmount', 'sellRoom']);
}

function updateStock(oldStocks, newStocks) {
    var m = {};
    var i;
    var stock;
    var id;
    for(i = 0; i < oldStocks.length; i++){
        stock = oldStocks[i];
        m[stock.id] = stock;
    }
    for(i = 0; i < newStocks.length; i++){
        stock = newStocks[i];
        id = stock.id;
        if(m.hasOwnProperty(id)){
            checkChange(m[id], stock);
        } else {
            m[id] = stock;
        }
    }
    var stocks = [];
    for(i = 0; i < newStocks.length; i++){
        id = newStocks[i].id;
        stocks.push(m[id]);
    }

    return stocks;
}

function detectStockValueChangeType(item, value) {
    var p = item.live.match.price;
    if (typeof value !== 'undefined') {
        p = value;
    }
    if (value === '' || value < 0) {
        return '';
    }

    if (value === 'ATC' || value === 'ATO') {
        return 'atoatc';
    }

    var r = item.price0.reference;
    if (p > r) {
        return p >= item.price0.ceil ? 'c' : 'i';
    } else if (p === r) {
        return 'e';
    } else {
        return p <= item.price0.floor ? 'f' : 'd';
    }
}

function getStockChangeValue(item) {
    var diff = item.live.match.price - item.price0.reference;
    if (diff === 0)
        return '';
    var increase = diff > 0;
    var percent = Math.abs(diff) / item.price0.reference * 100;
    return (increase ? '+' : '') + round(diff, 100) + (increase ? '▲' : '▼') + round(percent, 100) + '%';
}

