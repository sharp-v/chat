(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-10a167e8"],{"068c":function(t,e,c){"use strict";c.r(e);var n=c("7a23"),i={class:"exhibt"},a={class:"main"},r={class:"avatar-wrapper"},o={class:"avatar-item"},s={class:"profile-items"},l={class:"buttons"},u=Object(n["l"])("发消息");function b(t,e,c,b,f,j){var O=Object(n["J"])("van-icon"),d=Object(n["J"])("van-nav-bar"),h=Object(n["J"])("van-image"),p=Object(n["J"])("avatar"),v=Object(n["J"])("van-cell"),g=Object(n["J"])("van-button");return Object(n["C"])(),Object(n["i"])("div",i,[Object(n["m"])(d,{title:j.title(),"left-text":"返回","left-arrow":"",onClickLeft:e[0]||(e[0]=function(e){return t.$router.go(-1)}),onClickRight:e[1]||(e[1]=function(t){return j.toRelationConifg()}),class:"nav-bar"},{right:Object(n["R"])((function(){return[Object(n["m"])(O,{name:"more",size:"24"})]})),_:1},8,["title"]),Object(n["j"])("div",a,[Object(n["m"])(h,{fit:"cover",class:"background",src:t.getBackImage(t.access)},null,8,["src"]),Object(n["j"])("div",r,[Object(n["j"])("div",o,[Object(n["m"])(p,{avatarLink:t.getAvatar(t.access),size:"80"},null,8,["avatarLink"])])]),Object(n["j"])("div",s,[(Object(n["C"])(!0),Object(n["i"])(n["a"],null,Object(n["I"])(b.profile?b.profile:[],(function(t,e){return Object(n["C"])(),Object(n["i"])("div",{class:"profile",key:e},[Object(n["S"])(Object(n["m"])(v,{icon:"user-circle-o"},{title:Object(n["R"])((function(){return[Object(n["j"])("span",null,Object(n["N"])(e)+" : "+Object(n["N"])(t),1)]})),_:2},1536),[[n["P"],t]])])})),128))]),Object(n["j"])("div",l,[!b.relation||b.relation.type!=b.TYPE.FRIEND&&b.relation.type!=b.TYPE.GROUP?(Object(n["C"])(),Object(n["g"])(g,{key:0,class:"button",plain:"",type:"primary",onClick:e[2]||(e[2]=function(t){return j.addRelation()})},{default:Object(n["R"])((function(){return[Object(n["l"])(Object(n["N"])(b.profile&&void 0!=b.profile.ownId?f.newGroupWord:f.newFriendWord),1)]})),_:1})):Object(n["h"])("",!0),Object(n["m"])(g,{class:"button",type:"primary",onClick:e[3]||(e[3]=function(t){return j.toChat()})},{default:Object(n["R"])((function(){return[u]})),_:1})])])])}var f=c("5530"),j=c("5502"),O=c("626a"),d=c("7e7f"),h=c("a49b"),p={setup:function(){var t=Object(n["H"])(),e=Object(n["H"])(),c=h["g"].TYPE;return{profile:t,relation:e,TYPE:c}},data:function(){return{newFriendWord:"添加好友",newGroupWord:"申请加群"}},computed:Object(f["a"])(Object(f["a"])({},Object(j["e"])({access:function(t){return t.current.access}})),Object(j["c"])(["getProfile","getRelation","getAvatar","getBackImage"])),methods:Object(f["a"])(Object(f["a"])({},Object(j["b"])(["initProfile"])),{},{title:function(){return this.relation?this.relation.remark:this.profile?this.profile.nickName:"备注"},toChat:function(){console.log(this.access),this.$router.push("/chat")},addRelation:function(){console.log(this.access),console.log(this.getProfile(this.access)),Object(O["a"])("待开发")},toRelationConifg:function(){this.getRelation(this.access)?this.$router.push("/relation-config"):Object(O["a"])("暂时不能设置")}}),mounted:function(){this.profile=this.getProfile(this.access),!this.profile&&this.initProfile(this.access),this.relation=this.getRelation(this.access)},components:{Avatar:d["a"]}};c("cfc6");p.render=b;e["default"]=p},2781:function(t,e,c){},4991:function(t,e,c){"use strict";c("2781")},"7e7f":function(t,e,c){"use strict";var n=c("7a23");function i(t,e,c,i,a,r){var o=Object(n["J"])("van-image");return Object(n["C"])(),Object(n["g"])(o,{round:"",width:c.size,height:c.size,src:c.avatarLink},null,8,["width","height","src"])}var a={props:{avatarLink:{type:String,default:c("f42b")},size:{type:String,default:"80"}},mounted:function(){}};c("4991");a.render=i,a.__scopeId="data-v-77e4a452";e["a"]=a},cfc6:function(t,e,c){"use strict";c("d4ff")},d4ff:function(t,e,c){}}]);
//# sourceMappingURL=chunk-10a167e8.40eb70c2.js.map