(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-04f73097"],{"2ddd":function(e,t,n){},"5f59":function(e,t,n){"use strict";n("2ddd")},bbe4:function(e,t,n){"use strict";n.r(t);var c=n("7a23"),r={class:"relation-config"},o={class:"main"},i={class:"reminder-config-button"},a=Object(c["l"])("保存提交");function l(e,t,n,l,b,u){var O=Object(c["J"])("van-nav-bar"),j=Object(c["J"])("van-field"),d=Object(c["J"])("van-popover"),s=Object(c["J"])("van-cell"),f=Object(c["J"])("van-cell-group"),m=Object(c["J"])("van-button");return Object(c["C"])(),Object(c["i"])("div",r,[Object(c["m"])(O,{title:l.relation?l.relation.remark:"备注","left-text":"返回","left-arrow":"",onClickLeft:t[0]||(t[0]=function(t){return e.$router.go(-1)}),class:"nav-bar"},null,8,["title"]),Object(c["j"])("div",o,[Object(c["m"])(f,{title:"可更改项"},{default:Object(c["R"])((function(){return[(Object(c["C"])(!0),Object(c["i"])(c["a"],null,Object(c["I"])(l.relation,(function(e,n){return Object(c["C"])(),Object(c["i"])("div",{key:n},[Object(c["S"])(Object(c["m"])(s,null,{title:Object(c["R"])((function(){return[Object(c["l"])(Object(c["N"])(l.relConfigOption.get(n)),1)]})),value:Object(c["R"])((function(){return["remark"==n?(Object(c["C"])(),Object(c["g"])(j,{key:0,rows:"1",autosize:"",placeholder:l.relation.remark,modelValue:l.relation.remark,"onUpdate:modelValue":t[1]||(t[1]=function(e){return l.relation.remark=e})},null,8,["placeholder","modelValue"])):Object(c["h"])("",!0),"reminderLevel"==n?(Object(c["C"])(),Object(c["g"])(d,{key:1,show:l.showPopover,"onUpdate:show":t[2]||(t[2]=function(e){return l.showPopover=e}),theme:"dark",actions:l.actions,onSelect:u.onSelect},{reference:Object(c["R"])((function(){return[Object(c["j"])("button",i,Object(c["N"])(l.reminderLevelOption.get(l.relation.reminderLevel)),1)]})),_:1},8,["show","actions","onSelect"])):Object(c["h"])("",!0)]})),_:2},1536),[[c["P"],void 0!=l.relConfigOption.get(n)]])])})),128))]})),_:1}),Object(c["m"])(f,{title:"不可更改项"},{default:Object(c["R"])((function(){return[(Object(c["C"])(!0),Object(c["i"])(c["a"],null,Object(c["I"])(l.relation,(function(e,t){return Object(c["C"])(),Object(c["i"])("div",{key:t},[Object(c["S"])(Object(c["m"])(s,null,{title:Object(c["R"])((function(){return[Object(c["l"])(Object(c["N"])(l.relUnconfigOption.get(t)),1)]})),value:Object(c["R"])((function(){return[Object(c["l"])(Object(c["N"])("createdAt"==t||"updatedAt"==t?new Date(Date.parse(e)).toLocaleString():e),1)]})),_:2},1536),[[c["P"],void 0!=l.relUnconfigOption.get(t)]])])})),128))]})),_:1})]),Object(c["m"])(m,{type:"primary",size:"large",round:"",onClick:u.onSubmit},{default:Object(c["R"])((function(){return[a]})),_:1},8,["onClick"])])}var b=n("5530"),u=(n("4ec9"),n("d3b7"),n("3ca3"),n("ddb0"),n("5502")),O=new Map([["contactId","id"],["createdAt","创建时间"],["updatedAt","更新时间"]]),j=new Map([["remark","备注"],["reminderLevel","提醒级别"]]),d=new Map([[0,"接收提醒"],[1,"接收不提醒"],[2,"不接收"]]),s={setup:function(){var e=Object(c["H"])(),t=O,n=j,r=d,o=Object(c["H"])(!1),i=[{text:"接收提醒"},{text:"接收不提醒"},{text:"不接收"}],a=Object(c["H"])();return{remark:a,actions:i,showPopover:o,relation:e,relUnconfigOption:t,relConfigOption:n,reminderLevelOption:r}},computed:Object(b["a"])(Object(b["a"])({},Object(u["e"])({access:function(e){return e.current.access}})),Object(u["c"])(["getRelation"])),mounted:function(){this.relation=this.getRelation(this.access),this.remark=this.relation.remark},methods:Object(b["a"])(Object(b["a"])({},Object(u["b"])(["setRelation"])),{},{onSubmit:function(){this.setRelation({key:this.access,relation:this.relation})},onSelect:function(e,t){this.relation.reminderLevel=t}})};n("5f59");s.render=l;t["default"]=s}}]);
//# sourceMappingURL=chunk-04f73097.4710cf41.js.map