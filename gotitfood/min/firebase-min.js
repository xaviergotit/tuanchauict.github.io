function Firebase(){var e=this,t,i,o,a;this.init=function(a){var r={apiKey:"AIzaSyDUHEsElweVtebLYGJS7TJu0svlqpXDKlI",authDomain:"gotitfood.firebaseapp.com",databaseURL:"https://gotitfood.firebaseio.com",projectId:"gotitfood",storageBucket:"gotitfood.appspot.com",messagingSenderId:"668817774606"};return firebase.initializeApp(r),t=firebase.database(),i=t.ref().child("orders"),o=t.ref().child("orderDetail"),i.on("value",function(e){var t=e.val();t&&(console.log(t),a&&a(t))}),e},this.newOrderList=function(e){var t=i.push().key;return i.child(t).set({id:t,name:e,createdDate:(new Date).toISOString(),removable:!0}),o.child(t).child("_non_removable").set({removable:!1}),t},this.removeOrderList=function(e){i.child(e).remove(),o.child(e).remove()},this.cloneOrderList=function(e,t){var a=i.push().key;i.child(a).set({id:a,name:t,createdDate:(new Date).toISOString(),removable:!0}),o.child(e.id).once("value").then(function(e){var t=e.val();console.log("detail",t)})},this.renameOrderList=function(e,t){console.log("rename",e,t),e.name=t,i.child(e.id).update(e)},this.addOrderItem=function(e,t){t.hasOwnProperty("id")?t.modifiedDate=(new Date).toISOString():(t.id=i.child(e).push().key,t.listId=e,t.createdDate=(new Date).toISOString(),t.modifiedDate=(new Date).toISOString(),t.removable=!0),o.child(e).child(t.id).set(t)},this.removeOrderItem=function(e,t){o.child(e).child(t).remove()},this.listenToOrderListChange=function(e,t){e!==a&&(a&&o.child(a).off("value"),o.child(e).on("value",function(e){var i=e.val();t&&t(i)}),a=e)}}