Vue.component("stock-header",{props:["mobile"],template:""}),Vue.component("stock-row",{props:["mobile","data"],template:'<li>{{mobile ? "Mobile" : "Desktop"}} - {{data.id}} - {{data.name}}</li>'});