function listenToFirebase(e){e&&fb.setOnStockChangedListener(e,"default",function(e){console.log("stock changed",e),APP.stock.codes=e,mbsRest.reload()})}var APP=new Vue({components:{localTable:localTable},el:"#app",data:{owner:localStorage.getItem("owner"),stock:{codes:[],stocks:[]}},computed:{mobile:detectMobile},methods:{onStocksChanged:function(e){console.log("update",e),console.log(this.stock.stocks),console.log(this.stock.codes),fb.write(this.owner,"default",this.stock.codes)},onPasswordKeyUp:function(e){if(13===event.keyCode){var o=e.target.value;e.target.value="",console.log(o),fb.getOwner(o,function(e){console.log(e),e&&(localStorage.setItem("owner",e),APP.owner=e,listenToFirebase(e))})}},onStockInputKeyUp:function(e){if(13===event.keyCode){var o=e.target.value;e.target.value="";for(var t=o.split(/\s*,\s*/),n=APP.stock.codes,s,l=0;l<t.length;l++)s=t[l].trim().toUpperCase(),!_ListStockInfo.hasOwnProperty(s)||s in n?console.log("Invalid:",s):n.push(s);fb.write(APP.owner,"default",n)}},doLogout:function(){this.owner=null,localStorage.removeItem("owner")}}}),fb=new Firebase;fb.init(),listenToFirebase(APP.owner);