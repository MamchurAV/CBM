/*

  SmartClient Ajax RIA system
  Version v14.1p_2026-08-14/LGPL Development Only (2026-08-14)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/

if(window.isc&&window.isc.module_Core&&!window.isc.module_ExampleViewer){isc.module_ExampleViewer=1;isc._moduleStart=isc._ExampleViewer_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log&&isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={message:'ExampleViewer load/parse time: '+(isc._moduleStart-isc._moduleEnd)+'ms',category:'loadTime'};
if(isc.Log&&isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');
else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;
else isc._preLog=[isc._pTM]}isc.definingFramework=true;isc.defineClass("ExampleViewer","TabSet");
isc.A=isc.ExampleViewer;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.websiteMode=(window.isc_websiteMode||isc.params.isc_websiteMode==="true")&&!isc.Browser.isMobile;
isc.A.reactSamplesInstalled=true;
isc.A.$191a={
Tahoe:"fontIncrease=3&sizeIncrease=10",
Twilight:"fontIncrease=3&sizeIncrease=10",
Stratus:"fontIncrease=3&sizeIncrease=10",
Obsidian:"fontIncrease=3&sizeIncrease=10",
Shiva:"fontIncrease=3&sizeIncrease=10",
"default":"fontIncrease=1&sizeIncrease=2"
};
isc.B.push(isc.A.getRefDocsURL=function isc_c_ExampleViewer_getRefDocsURL(){
return this.refDocsURL=isc.Page.getURL("[ISOMORPHIC]/system/reference/")}
,isc.A.$2572=function isc_c_ExampleViewer__getReactParamBooleanValue(_1){
if(!this.reactSamplesInstalled)return false;
return isc.getParamBooleanValue("react",_1)}
,isc.A.showReactFormatSwitcher=function isc_c_ExampleViewer_showReactFormatSwitcher(){
return this.$2572(true)&&isc.Browser.supportsECMA2015}
,isc.A.getSkin=function isc_c_ExampleViewer_getSkin(){
var _1=isc.params.skin;
if(_1==null||_1=="")_1=isc.Browser.defaultSkin;
return _1}
,isc.A.getDefaultDensityParams=function isc_c_ExampleViewer_getDefaultDensityParams(_1){
return this.$191a[_1]}
,isc.A.installSkinCustomizations=function isc_c_ExampleViewer_installSkinCustomizations(){
return"no-op"}
);
isc.B._maxIndex=isc.C+6;
isc.A=isc.ExampleViewer.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.minWidth=120;
isc.A.minHeight=30;
isc.A.paneContainerOverflow="auto";
isc.A.height="100%";
isc.A.rpcURL=isc.Page.getURL("[ISOMORPHIC]/FeatureExplorerRPC");
isc.A.layoutMargin=10;
isc.A.membersMargin=10;
isc.A.defaultUserId="showcaseUser";
isc.A.creatorName="exampleViewer";
isc.A.exampleViewPaneDefaults={
_constructor:"ExampleViewPane"
};
isc.A.exampleSourcePaneDefaults={
_constructor:"ExampleSourcePane",
scrollbarSize:16
};
isc.A.tabBarControlLayoutProperties={
styleName:null
};
isc.A.printButtonConstructor="ImgButton";
isc.A.printButtonDefaults={
_constructor:"ImgButton",
title:"Print",
showDown:false,
showFocused:false,
showOver:false,
showRollOver:false,
showRollOverIcon:false,
src:"[ISO_DOCS_SKIN]/images/silkicons/printer.png",
canHover:true,
prompt:"<nobr>Show a Print Preview of this sample</nobr>",
hoverHeight:20,
width:30,
height:20,
imageType:"normal",
imageWidth:16,
imageHeight:16,
margin:2,
padding:0,
leftPadding:5,
rightPadding:3,
layoutAlign:"center",
$jo:false,
isMouseTransparent:true,
click:function(){
this.exampleViewer.printExample()}
};
isc.A.reloadButtonConstructor="ImgButton";
isc.A.reloadButtonDefaults={
_constructor:"ImgButton",
title:"Reload",
showFocused:false,
src:"[ISO_DOCS_SKIN]/images/refresh.png",
canHover:true,
prompt:"<nobr>Reload this example.</nobr>",
hoverHeight:20,
width:30,
height:20,
imageType:"normal",
imageWidth:16,
imageHeight:16,
margin:2,
padding:0,
leftPadding:3,
rightPadding:5,
layoutAlign:"center",
$jo:false,
isMouseTransparent:true,
click:function(){
this.exampleViewer.reloadExample()}
};
isc.A.viewReifySourceCodeButtonConstructor="ImgButton";
isc.A.viewReifySourceCodeButtonDefaults={
_constructor:"ImgButton",
title:"View Reify Source",
showFocused:false,
src:"[ISO_DOCS_SKIN]/images/silkicons/script_code.png",
canHover:true,
prompt:"<nobr>View Reify Source</nobr>",
hoverHeight:20,
width:30,
height:20,
imageType:"normal",
showImageRollOver:false,
disabled:true,
visibility:"hidden",
imageWidth:16,
imageHeight:16,
margin:2,
padding:0,
leftPadding:3,
rightPadding:5,
layoutAlign:"center",
$jo:false,
isMouseTransparent:true,
click:function(){
this.exampleViewer.viewReifySourceCode()}
};
isc.A.optionsMenuButtonDefaults={
_constructor:"MenuButton",
layoutAlign:"center",
autoFit:true,
initWidget:function(){
this.Super("initWidget",arguments);
this.setupMenu()},
setupMenu:function(){
var _1=this.exampleViewer;
this.title=isc.Canvas.getImgHTML("[ISO_DOCS_SKIN]/images/features.png",16,16);
var _2=[];
var _3=[];
for(var _4 in _1.mobileSkins){
_2.add({name:_4})}
for(var _4 in _1.compactSkins){
_2.add({name:_4})}
for(var i=0;i<_2.length;i++){
_3.add({
title:_1.mobileSkins[_2[i].name],
skin:_2[i].name,
checked:_2[i].name==_1.currentSkin,
click:function(_14,_15,_16){
_1.setSkin(_15.skin)}
})}
var _6=isc.Menu.create({
data:_3
});
var _7=[],
_8=_1.featureExplorer.densityValueMap
;
var _9="fontIncrease=1&sizeIncrease=2",
_10=null;
if(_1.currentFontIncrease!=null&&_1.currentSizeIncrease!=null){
_10="fontIncrease="+_1.currentFontIncrease;
_10+="&sizeIncrease="+_1.currentSizeIncrease}else _10=_9;
for(var _11 in _8){
_7.add({
title:_8[_11],
density:_11,
checked:_11==_10,
click:function(_14,_15,_16){
_1.setDensity(_15.density)}
})}
var _12=isc.Menu.create({
data:_7
});
var _13=[];
_13.add({title:"Reload",icon:"[ISO_DOCS_SKIN]/images/refresh.png",
click:function(){_1.reloadExample()}
});
_13.add({title:"Print",icon:"[ISO_DOCS_SKIN]/images/silkicons/printer.png",
click:function(){_1.printExample()}
});
_13.add({title:"Change Skin",submenu:_6,
icon:"[ISO_DOCS_SKIN]/images/silkicons/palette.png"
});
_13.add({title:"Change Density",submenu:_12,
icon:"[ISO_DOCS_SKIN]/images/silkicons/layers.png"
});
this.menu=isc.Menu.create({
data:_13
});
if(_1.skins[isc.currentSkin.name]&&isc.currentSkin.name!="Tahoe"){
this.setBackgroundColor("transparent");
this.setBackgroundImage("")}
}
};
isc.A.loadedSCProjectReify=null;
isc.A.$251u="<em style='font-weight:bold;color:red'>This sample doesn't have a React JSX version. so below we just show the combined JS sample file with React-style imports.  Creating React JSX for any sample is simple - read the instructions <a class='linkText' href='http://smartclient.com/smartclient-latest/isomorphic/system/reference/?id=group..reactIntegration'>here.</a></em><p>";
isc.A.flatSkins={
Tahoe:"Tahoe",
Twilight:"Twilight",
Stratus:"Stratus",
Obsidian:"Obsidian",
Shiva:"Shiva"
};
isc.A.mobileSkins={
Shiva:"Shiva",
Tahoe:"Tahoe",
Twilight:"Twilight",
Graphite:"Graphite",
Enterprise:"Enterprise",
EnterpriseBlue:"Enterprise Blue",
Stratus:"Stratus"
};
isc.A.skins={
Tahoe:"Tahoe",
Twilight:"Twilight",
Stratus:"Stratus",
Obsidian:"Obsidian",
Shiva:"Shiva",
Enterprise:"Enterprise",
Graphite:"Graphite",
EnterpriseBlue:"Enterprise Blue",
Simplicity:"Simplicity",
BlackOps:"Black Ops",
TreeFrog:"TreeFrog"
};
isc.A.skinSwitcherDefaults={
_constructor:"DynamicForm",
colWidths:[40,130],
padding:0,border:"0px none",
width:170,
height:1,
overflow:"visible",
margin:0,
cellPadding:0,
titleSuffix:":&nbsp;",
showIf:function(_1,_2,_3,_4){
return(this.viewer.showSkinSwitch)}
};
isc.A.densitySwitcherDefaults={
_constructor:"DynamicForm",
viewer:this,
colWidths:[40,110],
padding:0,border:"0px none",
leftPadding:5,
height:1,
overflow:"visible",
margin:0,
width:175,
cellPadding:0,
titleSuffix:":&nbsp;",
showIf:function(_1,_2,_3,_4){
return(this.viewer.showDensitySwitch)}
};
isc.A.exampleFormatSwitcherDefaults={
_constructor:"DynamicForm",
viewer:this,
margin:0,
padding:0,border:"0px none",
cellPadding:0,
height:1,overflow:"visible",
titleSuffix:":&nbsp;",
readOnlyDisplay:"disabled",
isRuleScope:true,
values:{
format:isc.ExampleViewer.$2572()?"React":"JS"
},
items:[{
name:"format",type:"radioGroup",vertical:false,
cellHeight:"100%",showTitle:false,
valueMap:["React","JS"],
visibleWhen:{fieldName:"/react",operator:"equals",value:true},
prompt:"Choose between showing the sample as React JS/JSX or entirely in JavaScript",
changed:function(_1,_2,_3){
_1.viewer.setExampleFormat(_3)}
}]
};
isc.A.leftArrowImg=isc.Img.create({
autoDraw:false,
width:65,height:1,
imageHeight:25,
imageType:"center",
src:"[ISO_DOCS_SKIN]/images/leftArrow.png"
});
isc.A.$257u=[
"import React from 'react';",
"import 'smartclient-eval/release';",
"import 'smartclient-eval/skins/Tahoe';",
"import { SC } from 'smartclient-eval/react';"
];
isc.A.$257v=new RegExp("//>StartServerDataSource[\\S\\s]*//<StartServerDataSource");
isc.A.$251f="showcaseSample";
isc.A.$249x="$249y";
isc.A.screenshotDefaults={
showShadow:true,
showEdges:true,
edgeImage:"[ISO_DOCS_SKIN]/images/edges/rounded/frame/FFFFFF/5.png",
edgeSize:5,
shadowOffset:10,
shadowSoftness:5
};
isc.A.fullScreenCloseMessage="&nbsp;&nbsp;&nbsp;<span style='font-style:italic;'>[Close this window to return to example tree]</span>";
isc.A.stacktraceOnErrorLineLimit=10;
isc.B.push(isc.A.initWidget=function isc_ExampleViewer_initWidget(){
this.Super("initWidget",arguments);
this.haveSCServer=isc.hasOptionalModule("SCServer");
if(isc.params&&isc.params.isc_delay){
isc.RPCManager.actionURL="[ISOMORPHIC]/IDACall?isc_delay="+isc.params.isc_delay}
var _1=this;
isc.Media.getCompactSkinNames(function(_10){
if(_10)_1.updateSkinList(_10)});
this.standardViewPane=this.viewPane=this.createAutoChild("exampleViewPane");
this.viewtab=this.getTab(this.addTab({
title:"View",
paneMargin:10,
iconSize:16,
canAdaptWidth:true,
icon:"[ISO_DOCS_SKIN]/images/icon_view.png",
showRTLIcon:true,
pane:this.viewPane
}));
if(isc.Browser.isHandset){
this.optionsMenuButton=this.createAutoChild("optionsMenuButton");
if(isc.VoiceAssist&&isc.AI){
this.voiceAssistButton=isc.VoiceAssist.getVoiceAssistButton()}
this.tabBarControls=[
"tabPicker",isc.LayoutSpacer.create({width:"*"}),this.optionsMenuButton,
this.voiceAssistButton
]}else{
this.printButton=this.createAutoChild("printButton");
this.reloadButton=this.createAutoChild("reloadButton");
this.viewReifySourceCodeButton=this.createAutoChild("viewReifySourceCodeButton");
var _2=this.tabBarControls=[
"tabScroller","tabPicker",
"skinSwitcher","densitySwitcher",this.printButton,
this.reloadButton,this.viewReifySourceCodeButton
];
if(isc.ExampleViewer.showReactFormatSwitcher()){
_2.addAt("exampleFormatSwitcher",2)}
}
this.autotest=isc.Browser.autotest==isc.Browser.SHOWCASE;
if(this.autotest){
this.featureExplorer.treeData.openAll();
this.featureExplorer.noAutoJumpToExample=true;
this.exampleErrorDetails="";
var _3=this;
isc.RPCManager.addClassMethods({
transformRequest:function(_10){
if(this.errorReportState==this.ersEnumeration.complete){
this.errorReportState=this.ersEnumeration.pending}
if(_10.params==null)_10.params={};
_10.params.stacktraceOnFailure=true;
return _10.data},
transactionComplete:function(_10){
if(!this.requestsArePending()){
var _4=this.errorReportState==this.ersEnumeration.requested;
this.errorReportState=this.ersEnumeration.complete;
if(_4){
_3.exampleReportError(this.rpcErrors)}else{
if(this.rpcErrors.length>0){
this.logWarn("RPC error received outside example load: "+
this.rpcErrors)}
}
this.rpcErrors=""}
},
reportError:function(_10,_11){
if(_11!=null){
var _5=_3.stacktraceOnErrorLineLimit,
_6=_11.split('\n').slice(0,_5);
_10+="\nException Trace: "+_6.join('\n')}
this.rpcErrors+=_10}
});
isc.RPCManager.addClassProperties({
rpcErrors:"",
errorReportState:0,
ersEnumeration:{complete:0,pending:1,requested:2}
});
var _7=this.featureExplorer.exampleTree,
_8=isc.TreeGrid.getPrototype().drawAllMaxCells;
if(_7)_7.drawAllMaxCells=_8}
this.loadPreDefinedSavedSearch();
var _9=document.getElementById('loadingWrapper');
if(_9)isc.Element.clear(_9);
if(this.url)this.loadExample(this.url);
if(!isc.Browser.isHandset){
var _1=this;
isc.observe(isc.Reify,"loadProject",function(_10,_11,_12){
if(_1.loadedSCProjectReify&&_1.loadedSCProjectReify==_10){
return}
_1.loadedSCProjectReify=_10;
_1.viewReifySourceCodeButton.setDisabled(false);
_1.viewReifySourceCodeButton.prompt="View Reify Source";
_1.viewReifySourceCode(_12)})}
}
,isc.A.loadPreDefinedSavedSearch=function isc_ExampleViewer_loadPreDefinedSavedSearch(){
var _1=isc.SavedSearches.get();
if(!_1)return;
var _2=[];
var _3="showcaseSavedSampleViews";
var _4="({field:[{name:\"countryCode\",width:70},{name:\"countryName\",width:150},{name:\"capital\",autoFitWidth:false,width:142},{name:\"population\",autoFitWidth:false,width:122},{name:\"area\",visible:false,width:200},{name:\"High_Population_Density1\",userFormula:{text:\"round(A/B,2)\",formulaVars:{B:\"area\",A:\"population\"}},type:\"float\",canFilter:false,title:\"High Population Density\",autoFitWidth:false,width:207}],sort:\"[No Sorting]\",hilite:\"[No Hilites]\",group:\"[No Grouping]\",showFilterEditor:true,userCriteria:{   _constructor:\"AdvancedCriteria\",   operator:\"or\",    criteria:[        { operator:\"and\", criteria:[            { fieldName: \"area\", operator: \"lessThan\", value: 600000 },            { fieldName: \"population\", operator: \"lessThan\", value: 150000000 }          ]         },        { operator:\"and\", criteria:[            { fieldName: \"area\", operator: \"greaterThan\", value: 3000000 },            { fieldName: \"population\", operator: \"greaterThan\", value: 1000000000 }          ]        }    ] }})";
var _5="({field:[{name:\"countryCode\",width:70},{name:\"countryName\",width:150},{name:\"capital\",width:162},{name:\"population\",width:150},{name:\"area\",width:200}],sort:\"[No Sorting]\",hilite:\"[No Hilites]\",group:\"[No Grouping]\",showFilterEditor:true,userCriteria:{ _constructor: \"AdvancedCriteria\", operator: \"and\", criteria: [ { fieldName: \"area\", operator: \"greaterThan\", value: 8000000 } ] }})";
var _6="({field:[{name:\"countryCode\",width:70},{name:\"countryName\",width:150},{name:\"capital\",width:162},{name:\"population\",width:150},{name:\"area\",width:200}],sort:\"[No Sorting]\",hilite:\"[No Hilites]\",group:\"[No Grouping]\",showFilterEditor:true,userCriteria:{ _constructor: \"AdvancedCriteria\", operator: \"and\", criteria: [ { fieldName: \"population\", operator: \"greaterThan\", value: 200000000 } ] }})";
var _7=[
{data:_4,
searchName:"High Population Density",
componentId:"builtinViewsMenu:countryDS",
userId:null
},
{data:_5,
searchName:"Large Countries",
componentId:"builtinViewsMenu:countryDS",
userId:_3
},
{data:_6,
searchName:"Populous Countries",
componentId:"builtinViewsMenu:countryDS",
userId:_3
}
];
_2.addList(_7);
var _8=[
{data:_4,
searchName:"High Population Density",
componentId:"toolbarViewsMenu:countryDS",
userId:null
},
{data:_5,
searchName:"Large Countries",
componentId:"toolbarViewsMenu:countryDS",
userId:_3
},
{data:_6,
searchName:"Populous Countries",
componentId:"toolbarViewsMenu:countryDS",
userId:_3
}
];
_2.addList(_8);
var _9="({field:[{name:\"_defaultSearch\",autoFitWidth:false,width:24},{name:\"searchName\",autoFitWidth:true,width:100},{name:\"searchDescription\",width:200},{name:\"_removeSearchField\",autoFitWidth:false,width:24},{name:\"$239p\",autoFitWidth:false,width:24},{name:\"$239q\",autoFitWidth:false,width:24}],sort:\"[No Sorting]\",hilite:\"[No Hilites]\",group:\"[No Grouping]\",showFilterEditor:false,userCriteria:{ _constructor: \"AdvancedCriteria\", operator: \"and\", criteria: [ { fieldName: \"Regions\", operator: \"inSet\", value: [\"North\", \"West\"] } ] } })";
var _10="({field:[{name:\"_defaultSearch\",autoFitWidth:false,width:24},{name:\"searchName\",autoFitWidth:true,width:100},{name:\"searchDescription\",width:200},{name:\"_removeSearchField\",autoFitWidth:false,width:24},{name:\"$239p\",autoFitWidth:false,width:24},{name:\"$239q\",autoFitWidth:false,width:24}],sort:\"[No Sorting]\",hilite:\"[No Hilites]\",group:\"[No Grouping]\",showFilterEditor:false,userCriteria:{_constructor:\"AdvancedCriteria\", operator:\"and\", criteria:[ { fieldName:\"Scenarios\", operator:\"equals\", value :\"Budget\" },{ fieldName: \"Regions\", operator: \"notEqual\", value: \"sum\" },{fieldName:\"Time\", operator:\"equals\", value:\"Q4-2020\" } ]} })";
var _11="({field:[{name:\"_defaultSearch\",autoFitWidth:false,width:24},{name:\"searchName\",autoFitWidth:true,width:100},{name:\"searchDescription\",width:200},{name:\"_removeSearchField\",autoFitWidth:false,width:24},{name:\"$239p\",autoFitWidth:false,width:24},{name:\"$239q\",autoFitWidth:false,width:24}],sort:\"[No Sorting]\",hilite:\"[No Hilites]\",group:\"[No Grouping]\",showFilterEditor:false,userCriteria:{_constructor:\"AdvancedCriteria\", operator:\"and\", criteria:[ { fieldName:\"Regions\", operator:\"notEqual\", value:\"sum\" }, { fieldName:\"Products\", operator:\"notEqual\", value:\"sum\" }, { fieldName:\"Time\", operator:\"equals\", value:\"Q4-2020\" }, { fieldName:\"Scenarios\", operator:\"equals\", value:\"Actual\" } ]} })";
var _12=[
{data:_9,
searchName:"North + West only",
componentId:"dynamicChart:productRevenue",
userId:_3
},
{data:_10,
searchName:"Q4 Budget",
componentId:"dynamicChart:productRevenue",
userId:_3
},
{data:_11,
searchName:"Q4 2020 (Best Quarter)",
componentId:"dynamicChart:productRevenue",
userId:null
}
];
_2.addList(_12);
for(var i=0;i<_2.length;i++){
_2[i].applicationId=window.location.pathname}
var _14=1.0;
var _15=isc.Offline.get("$246k");
if(isc.getParamBooleanValue("clearSavedSearches")||
!_15||(parseFloat(_15)<_14))
{
isc.Offline.put("savedSearchesLocalDataSource",null)}
isc.Offline.put("$246k",_14);
var _16=[];
["dataField","primaryKeyField",
"searchNameField","componentIdField","projectIdField","screenIdField","applicationIdField",
"adminDefaultField",
"userIdField"].map(function(_25){
var _17=_1[_25];
if(_17){
var _18="string";
if(["adminField","defaultField"].contains(_25))_18="boolean";
else if("primaryKeyField"==_25)_18="sequence";
var _19={
name:_17,
type:_18
};
if(_25=="primaryKeyField")_19.primaryKey=true;
if(_25=="searchNameField")_19.length=8096;
if(_25=="defaultField")_19.title=" ";
_16.add(_19)}
});
var _20=isc.LocalDataSource.create({
ID:"savedSearchesLocalDataSource",
$145w:true,
version:_14,
fields:_16,
adminDefaultField:isc.ss.adminDefaultField,
transformRequest:function(_25){
if(_25.doNotTrackRPC==null)_25.doNotTrackRPC=!isc.ss.logLocalDSRequests;
if(_25.operationId=="setDefaultAdminSearch"){
if(this.defaultAdminSearch!=null){
this.defaultAdminSearch[this.adminDefaultField]=false;
this.updateData(this.defaultAdminSearch);
delete this.defaultAdminSearch}
}
return this.Super("transformRequest",arguments)},
transformResponse:function(_25,_26,_27){
if(_26.operationId=="setDefaultAdminSearch"){
var _21=_25.data;
if(_21&&_21[this.adminDefaultField]){
this.defaultAdminSearch=_21}
}
return this.Super("transformResponse",arguments)}
});
_20.fetchData(null,function(_25,_26,_27){
if(_26.length==0){
isc.RPCManager.startQueue();
for(var i=0;i<_2.length;i++){
_20.addData(_2[i])}
isc.RPCManager.sendQueue()}else{
isc.RPCManager.startQueue();
for(var i=0;i<_2.length;i++){
var _22=_2[i],
_23=_20.applyFilter(_26,{
componentId:_22.componentId,
searchName:_22.searchName,
userId:_22.userId
});
if(_23.length>0){
_20.updateData(isc.addProperties({pk:_23[0].pk},_22))}else{
_20.addData(_22)}
}
isc.RPCManager.sendQueue()}
var _24={};
_24[this.adminDefaultField]=true;
_20.fetchData(_24,
function(_28,_26,_29){
_20.defaultAdminSearch=(_26&&_26[0])}
)});
isc.SavedSearches.get().addProperties({defaultDataSource:_20})}
,isc.A.viewReifySourceCode=function isc_ExampleViewer_viewReifySourceCode(_1){
if(!_1)_1={};
var _2=this;
if(this.loadedSCProjectReify){
isc.Reify.loadProject(this.loadedSCProjectReify,function(_4,_5,_6){
var _3=isc.RPCManager.getLoadProjectErrorMessage(_6);
if(_3){
return}
_2.loadedSCProjectReify=null;
_2.lastReifyProject=_4;
isc.Reify.reifySourceViewer(_4,false)},
{
userName:_1.userName,
password:_1.password,
serverURL:"https://create-test.reify.com",
omitLoadedDataSources:false,
includeXML:true
}
)}else{
isc.Reify.reifySourceViewer(_2.lastReifyProject,true)}
}
,isc.A.$257w=function isc_ExampleViewer__updateDescriptionForFormat(){
if(this.exampleConfig.react!="showJS")return;
var _1=this.creator.exampleDescription,
_2=this.$2570()
;
if(_1.contents.contains(this.$251u)){
if(!_2)_1.setContents(_1.contents.replace(this.$251u,""))}else{
if(_2)_1.setContents(this.$251u+_1.contents)}
}
,isc.A.reloadExample=function isc_ExampleViewer_reloadExample(_1){
if(_1)this.$257w();
this.loadExample(this.exampleConfig)}
,isc.A.printExample=function isc_ExampleViewer_printExample(){
isc.Canvas.showPrintPreview(this.viewPane)}
,isc.A.$2570=function isc_ExampleViewer__loadAsReact(_1){
if(!_1)_1=this.exampleConfig;
if(!_1.jsURL||_1.showSource==false){
return false}
var _2=this.exampleFormatSwitcher;
if(_2)return _2.getValue("format")=="React"}
,isc.A.loadAsReact=function isc_ExampleViewer_loadAsReact(_1){
if(!_1)_1=this.exampleConfig;
if(_1.react=="showJS")return false;
return this.$2570(_1)}
,isc.A.updateSkinList=function isc_ExampleViewer_updateSkinList(_1){
if(this.compactSkinsInjected)return;
this.compactSkinsInjected=true;
this.compactSkins=_1;
var _2=this.injectCompactSkinsToPicker(this.skins,this.compactSkins);
this.skinSwitcher&&this.skinSwitcher.getItem(0).setValueMap(_2)}
,isc.A.injectCompactSkinsToPicker=function isc_ExampleViewer_injectCompactSkinsToPicker(_1,_2){
if(!_2)return isc.addProperties({},_1);
var _3={};
var _4=Object.keys(_1);
var _5=Object.keys(_2);
var _6={};
for(var i=0;i<_5.length;i++){
var _8=_5[i];
_6[_8]=_2[_8]}
for(var j=0;j<_4.length;j++){
var _10=_4[j];
_3[_10]=_1[_10];
var _11=[];
for(var k in _6){
if(_6.hasOwnProperty(k)&&k.indexOf(_10)===0){
_11.push(k)}
}
_11.sort();
for(var m=0;m<_11.length;m++){
var _14=_11[m];
_3[_14]="&#8195;"+_6[_14];
delete _6[_14]}
}
var _15=Object.keys(_6).sort();
for(var n=0;n<_15.length;n++){
var _17=_15[n];
_3[_17]=_6[_17]}
return _3}
,isc.A.getControl=function isc_ExampleViewer_getControl(_1){
var _2=isc.ExampleViewer.showReactFormatSwitcher();
if(_1=="skinSwitcher"){
if(!this.skinSwitcher&&this.showSkinSwitcher!==false){
var _3=this.skins;
if(this.compactSkins){
_3=this.injectCompactSkinsToPicker(this.skins,this.compactSkins)}
this.skinSwitcher=this.createAutoChild("skinSwitcher",{
viewer:this,
items:[
{name:"skin",editorType:"SelectItem",
width:"*",
defaultValue:this.currentSkin,
valueMap:(!this.creator||this.creator.useDesktopMode)?_3:
this.mobileSkins,
title:"Skin",
showTitle:!_2,
changed:function(_6,_7,_8){
if(_6.creator.flatSkins[_8]&&!isc.Browser.supportsFlatSkins)
{
this.logWarn(this.valueMap[_8]+
" isn't supported by this browser - not changing skin");
return}
_6.viewer.setSkin(_8)},
canHover:true,
hoverHeight:20,
hoverWidth:300,
prompt:"Several look and feel options are available.<P><b>Note:</b>some samples that have a limited number of controls will look nearly identical in different skins"
}]
})}
return this.skinSwitcher}
if(_1=="densitySwitcher"){
if(!this.densitySwitcher&&this.showDensitySwitcher!==false){
var _4="fontIncrease=1&sizeIncrease=2",
_5=null;
if(this.currentFontIncrease!=null&&this.currentSizeIncrease!=null){
_5="fontIncrease="+this.currentFontIncrease;
_5+="&sizeIncrease="+this.currentSizeIncrease}else _5=_4;
this.densitySwitcher=this.createAutoChild("densitySwitcher",{
viewer:this,
items:[
{name:"density",editorType:"SelectItem",
width:"*",
defaultValue:_5,
valueMap:this.featureExplorer.densityValueMap,
title:"Density",
showTitle:!_2,
changed:function(_6,_7,_8){
_6.viewer.setDensity(_8)},
canHover:true,
hoverHeight:20,
hoverWidth:300,
prompt:"Most skins support the ability to choose different data density options, allowing tradeoffs between a 'spacious' UI feel vs productivity gains in some applications when more data is viewable at once"
}]
})}
return this.densitySwitcher}
if(_1=="exampleFormatSwitcher"){
if(!this.exampleFormatSwitcher&&this.showSampleFormatSwitcher!==false){
this.exampleFormatSwitcher=this.createAutoChild("exampleFormatSwitcher",{
viewer:this
})}
return this.exampleFormatSwitcher}
if(_1=="voiceAssistButton"){
if(!this.voiceAssistButton&&this.showVoiceAssistButton!==false){
this.voiceAssistButton=isc.VoiceAssist.getVoiceAssistButton()}
return this.voiceAssistButton}
return this.Super("getControl",arguments)}
,isc.A.setNewDensityToURL=function isc_ExampleViewer_setNewDensityToURL(_1,_2,_3){
var _4=_1.indexOf("fontIncrease=");
if(_4>0){
var _5=_1.indexOf("&",_4);
if(_5==-1)_1=_1.substring(0,_4);
else _1=_1.substring(0,_4)+_1.substring(_5+1)}
var _6=_1.indexOf("sizeIncrease=");
if(_6>0){
var _7=_1.indexOf("&",_6);
if(_7==-1)_1=_1.substring(0,_6);
else _1=_1.substring(0,_6)+_1.substring(_7+1)}
if(_3==_1.length-1||_1.lastIndexOf("&")==_1.length-1)_1+=_2;
else _1+="&"+_2;
return _1}
,isc.A.setSkin=function isc_ExampleViewer_setSkin(_1){
var _2=this;
isc.Media.getSkinConfig(_1,function(_11){
var _3=_11&&_2.featureExplorer.densityPresets[_11.density];
var _4=document.location.href,
_5=_4.indexOf("#"),
_6=_4.indexOf("?");
var _7;
if(_5!=-1){
_7=_4.substring(_5);
_4=_4.substring(0,_5)}
if(_6==-1)_4+="?skin="+_1;
else{
var _8=_4.indexOf("skin=");
if(_8>0){
var _9=_4.indexOf("&",_8);
if(_9==-1)_4=_4.substring(0,_8);
else _4=_4.substring(0,_8)+_4.substring(_9+1)}
if(_6==_4.length-1||_4.lastIndexOf("&")==_4.length-1)_4+="skin="+_1;
else _4+="&skin="+_1}
if(_7!=null)_4+=_7;
var _10=_4.indexOf("dhc=");
_3=_3||isc.ExampleViewer.getDefaultDensityParams(_1);
if(_3){
_4=_2.setNewDensityToURL(_4,_3,_6)}else if(_10<0){
_4=_2.setNewDensityToURL(_4,isc.ExampleViewer.getDefaultDensityParams("default"),_6)}
_2.documentLocationReplace(_4)})}
,isc.A.setDensity=function isc_ExampleViewer_setDensity(_1){
var _2=document.location.href,
_3=_2.indexOf("#"),
_4=_2.indexOf("?");
var _5;
if(_3!=-1){
_5=_2.substring(_3);
_2=_2.substring(0,_3)}
if(_4==-1)_2+="?"+_1;
else _2=this.setNewDensityToURL(_2,_1,_4);
if(_5!=null)_2+=_5;
var _6=_2.indexOf("dhc=");
if(_6<0)_2+="&dhc=1";
this.documentLocationReplace(_2)}
,isc.A.documentLocationReplace=function isc_ExampleViewer_documentLocationReplace(_1){
var _2=isc.ExampleViewer,
_3=isc.URIBuilder.create(_1);
if(_2.showReactFormatSwitcher()){
var _4,_5=this.exampleFormatSwitcher;
if(_5)switch(_5.getValue("format")){
case"React":
_4=true;
break;
case"JS":
break}
_3.setQueryParam("react",_4)}
document.location.replace(_3.uri)}
,isc.A.setExampleFormat=function isc_ExampleViewer_setExampleFormat(_1){
if(_1=="JS"){
var _2=this.viewPane&&this.viewPane.viewContainer;
if(_2)_2.redraw()}
this.reloadExample(true)}
,isc.A.loadExample=function isc_ExampleViewer_loadExample(_1){
this.exampleConfig=_1;
if(this.exampleFormatSwitcher){
this.exampleFormatSwitcher.provideRuleContext("react",_1.jsURL&&
_1.showSource!=false)}
if(isc.isA.String(_1))_1={url:_1};
if(_1.showSkinSwitcher==null){
_1.showSkinSwitcher=true;
this.showSkinSwitch=true;
this.showDensitySwitch=this.showSkinSwitch}else{
this.showSkinSwitch=_1.showSkinSwitcher;
this.showDensitySwitch=this.showSkinSwitch}
if(this.skinSwitcher){
this.skinSwitcher.setVisibility(_1.showSkinSwitcher
?isc.Canvas.INHERIT
:isc.Canvas.HIDDEN);
if(this.densitySwitcher){
this.densitySwitcher.setVisibility(_1.showSkinSwitcher
?isc.Canvas.INHERIT
:isc.Canvas.HIDDEN)}
}
var _2=[];
if(_1.jsURL){
var _3=_1.jsURL;
if(this.loadAsReact()){
_2.addList([{
url:_3.replace(/\.js$/,".jsx"),
isReact:true,doEval:false,
isSource:true,canEdit:false,
showSource:_1.showSource,
fullScreen:_1.fullScreen
},{
url:_3,isReact:true,
exampleSource:true,
showSource:false,
isSource:true
}])}else{
_2.add({
url:_3,
isSource:true,exampleSource:true,
showSource:_1.showSource,
fullScreen:_1.fullScreen,
canEdit:_1.canEdit!="false"
})}
}
if(_1.xmlURL){
_2.add({
url:_1.xmlURL,
isSource:true,
showSource:_1.showSource,
fullScreen:_1.fullScreen,
exampleSource:!_1.jsURL,
canEdit:_1.canEdit!="false"
})}
if(_1.scssURL){
_2.add({
url:_1.scssURL,
isSource:true,
canEdit:false
})}
if(_1.css||_1.cssURL){
var _4=_1.css?_1.css:_1.cssURL;
_2.add(this.loadCSS({
url:_4,
canEdit:_1.canEdit!="false",
isCSS:true
},true))}
if(_2.length==0&&_1.url){
var c={
url:_1.url,
isSource:true,
showSource:_1.showSource,
exampleSource:true,
external:_1.external,
iframe:_1.iframe,
fullScreen:_1.fullScreen,
externalWindowConfig:_1.externalWindowConfig,
canEdit:_1.canEdit!="false"&&!_1.external&&!_1.iframe
};
if(_1.iframe)c.doEval=false;
_2.add(c)}
if(_1.dataSource){
var _6=_1.canEdit;
if(_6!=null)_6=_6=="true";
else _6=_1.dataSource.contains(".")?true:false;
_2.add({
dataSource:_1.dataSource,
showSource:_1.showDataSource,
canEdit:_6
})}
if(_1.tabs){
for(var i=0;i<_1.tabs.length;i++){
var _8=isc.addProperties({},_1.tabs[i]);
_8.canEdit=_8.canEdit!="false"&&!_1.external&&
!_1.iframe;
if(this.$2570()&&_8.react!="false"&&_8.url&&
_8.url.match(/\.js$/))
{
if(_1.react=="showJS")_8.showSource=false;
else{
if(_8.react=="true"){
var _9=_8.url;
_2.addList([
isc.addProperties({},_8,{
url:_9.replace(/\.js$/,".jsx"),
isReact:true,doEval:false,
isSource:true,canEdit:false,
showSource:_1.showSource,
fullScreen:_1.fullScreen
}),
isc.addProperties({},_8,{
url:_9,isReact:true,showSource:false
})
])}
continue}
}
if(_8.url&&_8.url.match(/\.css$/i)&&!_1.external&&
!_1.iframe)
{
_8.isCSS=true;
_8=this.loadCSS(_8)}
_2.add(_8)}
}
if(this.waitOnAnimation)this.$49i=true;
if(_1.requiresModules&&
!isc.FileLoader.moduleIsLoaded(_1.requiresModules))
{
this.loadingModules=true;
if(_1.requiresModules.split(/\s*,\s*/).contains("Analytics")){
this.logWarn("If you meant to install Analytics module as an optional module, you need to add a script tag doing so in the HTML after the other modules.  On-demand loading of Analytics is not supported in the Feature Explorer.")}
isc.FileLoader.loadModules(_1.requiresModules,this.getID()+".modulesLoaded()")}
if(!isc.hasOptionalModule("SCServer")){
isc.RPCManager.sendRequest({
actionURL:this.rpcURL,
internalClientContext:{
exampleFiles:_2
},
useSimpleHttp:true,
params:{
noSCServer:true,
data:isc.Comm.xmlSerialize("data",{
method:"loadFiles",
exampleFiles:_2
})
},
showPrompt:true,
promptStyle:"cursor",
serverOutputAsString:true,
callback:this.getID()+".loadExampleFilesCallback(rpcRequest, rpcResponse, isc.eval(data));"
})}else{
isc.RPCManager.sendRequest({
actionURL:this.rpcURL,
internalClientContext:{
exampleFiles:_2
},
data:{
method:"loadFiles",
exampleFiles:_2
},
showPrompt:true,
promptStyle:"cursor",
callback:this.getID()+".loadExampleFilesCallback(rpcRequest, rpcResponse, data);"
})}
if(this.exampleGlobals){
isc.Class.destroyGlobals(this.exampleGlobals);
delete this.exampleGlobals}
if(isc.Notify)isc.Notify.$2575();
if(!isc.Browser.isHandset)this.isReifySampleLoaded(_1);
if(this.featureExplorer)this.featureExplorer.checkAIAccess(_1)}
);
isc.evalBoundary;isc.B.push(isc.A.isReifySampleLoaded=function isc_ExampleViewer_isReifySampleLoaded(_1){
this.loadedSCProjectReify=null;
this.viewReifySourceCodeButton.setDisabled(true);
this.viewReifySourceCodeButton.prompt="View Reify Source - load a Reify project to enable";
if(_1&&_1.jsURL&&_1.jsURL.startsWith("reifyIntegration")){
this.viewReifySourceCodeButton.show()}else{
this.viewReifySourceCodeButton.hide();
isc.Reify.reifySourceViewer(null,false)}
}
,isc.A.modulesLoaded=function isc_ExampleViewer_modulesLoaded(){
this.loadingModules=null;
this.loadExampleFilesCallback()}
,isc.A.loadCSS=function isc_ExampleViewer_loadCSS(_1,_2){
var _3=this;
if(this.remainingCSSFiles==null)this.remainingCSSFiles=0;
if(_1.doEval!="false"){
this.remainingCSSFiles++;
var _4=_1.url.startsWith("/")?_1.url:isc.Page.getIsomorphicDocsDir()+
"inlineExamples/"+_1.url;
isc.FileLoader.loadFile(_4,function(){
_3.cssFileLoaded(_2?_1.url:null)})}else{
_1.canEdit=false}
return _1}
,isc.A.animationComplete=function isc_ExampleViewer_animationComplete(){
this.$49i=false;
this.loadExampleFilesCallback()}
,isc.A.cssFileLoaded=function isc_ExampleViewer_cssFileLoaded(_1){
if(_1){
isc.Canvas.resizeFonts(this.currentFontIncrease,_1,false)}
this.remainingCSSFiles--;
if(this.remainingCSSFiles==0){
isc.Canvas.clearCSSCaches();
this.loadExampleFilesCallback()}
}
,isc.A.loadExampleFilesCallback=function isc_ExampleViewer_loadExampleFilesCallback(_1,_2,_3){
if(_1){
this.rpcRequest=_1;
this.rpcResponse=_2;
this.exampleFiles=_3}
if(this.$49i||this.remainingCSSFiles||this.loadingModules){
return}
if(_1==null&&this.rpcRequest==null)return;
_1=this.rpcRequest;
_2=this.rpcResponse;
_3=this.exampleFiles;
if(_2.status!=isc.RPCResponse.STATUS_SUCCESS)return;
this.rpcRequest=this.rpcResponse=this.exampleFiles=null;
if(this.featureExplorer){
this.featureExplorer.examplePage.showSection("section_exampleViewer")}
for(var i=0;i<_3.length;i++){
var _5=_3[i];
isc.addProperties(_5,_1.internalClientContext.exampleFile);
if(!this.haveSCServer&&_5.isDataSource)_5.forceJS=true}
if(!this.showExample(_3)){
if(this.loadAsReact())this.cleanupTabs();
return}
this.currentExampleFiles=_3;
this.cleanupTabs();
var _6=[];
for(var i=0;i<_3.length;i++){
var _5=_3[i],
_7=_5.showSource
;
if(_7==(isc.isA.String(_7)?"false":false))continue;
var _8=_5.title;
if(_5.isSource&&!_5.external&&!_5.iframe)
_8=_5.isXML?this.xmlSourceTitle:this.jsSourceTitle;
if(_8==null){
_8=_5.url||_5.dataSource;
_8=_8.replace(/.*\/(.*)/,"$1")}
var _9=this;
if(_5.exampleSource)this.currentExampleSourceFile=_5;
_6.add({
title:_8,
paneMargin:_5.canEdit?4:6,
iconSize:16,
canAdaptWidth:true,
icon:"[ISO_DOCS_SKIN]/images/icon_code.png",
exampleFile:_5,
leftArrowAnimated:false,
tabDeselected:function(_15,_16,_17,_18,_19,_20,_21){
if(_9.leftArrowImg)_9.leftArrowImg.clear()},
click:function(){
if(!this.leftArrowAnimated&&this.pane.sourceEditor){
var _10=this.pane.sourceEditor.sourceEditorToolbar.tryItButton;
this.delayCall("animateArrow",[_10],400);
this.leftArrowAnimated=true}
},
animateArrow:function(_10){
var _11=_9.leftArrowImg;
_11.setTop(_10.getPageTop()+
((_10.getVisibleHeight()-25)>>1));
_11.setLeft(_10.getPageLeft()+120);
_11.draw();
var _12={
width:250,
top:_10.getPageTop()-90,
left:_10.getPageLeft()+20
};
isc.Hover.show(_10.getHoverHTML(),_12);
this.delayCall("clearHover",null,4000);
var _13=_11.getPageLeft()-20,
_14=_11.getPageTop();
_11.animateMove(_13,
_14,
function(_15){
_11.animateMove(_13+30,
_14,
function(_15){
_11.animateMove(_13,
_14,
function(_15){
_11.animateMove(_13+30,
_14,
null,400)},400)},400)},400)},
clearHover:function(){
isc.Hover.hide();
if(_9.leftArrowImg)_9.leftArrowImg.clear()}
})}
this.addTabs(_6)}
,isc.A.cleanupTabs=function isc_ExampleViewer_cleanupTabs(){
var _1;
while((_1=this.getTab(1))!=null)this.removeTab(_1)}
,isc.A.tabSelected=function isc_ExampleViewer_tabSelected(_1,_2,_3,_4){
if(_4.pane)return;
if(!isc.SyntaxHiliter){
isc.showPrompt("Hang on - loading code preview modules");
isc.FileLoader.loadModules("SyntaxHiliter,RichTextEditor",
this.getID()+".sourcePaneModulesLoaded("+_1+")");
return}
this.sourcePaneModulesLoaded(_1);
if(window.useAnalytics&&window.ga&&isc.isA.ExampleSourcePane(_4.pane))
{
var _5="/fe/source/"+_4.exampleFile.url;
this.logDebug("tracking: "+_5);
window.ga('send','pageview',{page:_5});
if(window.google_trackConversion){
window.google_trackConversion({
google_conversion_id:1063035128,
google_custom_params:{
action:"fe-source",
example:_4.exampleFile.url,
random:new Date().getTime()
},
google_remarketing_only:true
})}
}
}
,isc.A.sourcePaneModulesLoaded=function isc_ExampleViewer_sourcePaneModulesLoaded(_1){
var _2=this.getTabObject(_1);
var _3=_2.exampleFile;
isc.clearPrompt();
var _4=isc.StringBuffer.create();
_4.append(_3.forceJS?
this.getJSSource(_3):_3.fileContents);
var _5=this.createAutoChild("exampleSourcePane",{
rpcURL:this.rpcURL,
canEdit:_3.canEdit,
source:_4.release(false),
exampleFile:_3
});
this.updateTab(_1,_5)}
,isc.A.showExample=function isc_ExampleViewer_showExample(_1){
var _2=this.$2570(),
_3=_2&&this.exampleConfig.react=="showJS"
;
if(this.fullScreenBlurb!=null){
this.fullScreenBlurb.destroy();
this.fullScreenBlurb=null}
this.exampleClearResult();
if(isc.Auth.getRoles().length)isc.Auth.setRoles(null);
if(isc.Auth.getCurrentUserId()!=this.defaultUserId){
isc.Auth.setCurrentUser({userId:this.defaultUserId})}
if(this.parentElement&&!this.parentElement.isDrawn())this.parentElement.draw();
this.viewPane=this.standardViewPane;
if(!isc.AutoTest.testRoot)isc.AutoTest.setTestRoot(this.viewPane.viewContainer);
if(!_1)_1=this.currentExampleFiles;
var _4=isc.StringBuffer.create();
var _5,_6,_7,_8;
var _9;
for(var i=0;i<_1.length;i++){
var _11=_1[i];
if(_11.external){
_9=_11;
break}
if(_11.iframe){
_6=_11}
if(_11.fullScreen){
_7=true}
if(_11.error){
this.exampleReportError(_11.error);
return false}
if(_5==null&&_11.exampleSource){
_5=this.getJSSource(_11)}
if(_11.isSource)continue;
if(_11.loadAtEnd){
var _12=this.getJSSource(_11);
if(!_8)_8=_12;
else _8+=_12;
continue}
if(_11.doEval!==false&&_11.doEval!=="false"&&!_11.isCSS){
var _13=_11.isDataSource&&_3;
if(_13)_4.append("//>StartServerDataSource\n");
_4.append(this.getJSSource(_11),
"\r\n");
if(_13)_4.append("//<StartServerDataSource\n")}
}
if(_9){
isc.Class.destroyGlobals(this.exampleGlobals);
var _14=this.createLaunchExampleBlurb(_9);
this.exampleGlobals=[_14.getID()];
this.addCanviiToView(this.exampleGlobals);
_14.draw();
this.selectTab(0);
isc.clearPrompt();
_4.release(true);
return true}else if(_6){
isc.Class.destroyGlobals(this.exampleGlobals);
var _15=this.createIFRAME(_6);
this.exampleGlobals=[_15.getID()];
this.addCanviiToView(this.exampleGlobals);
_15.draw();
this.selectTab(0);
isc.clearPrompt();
_4.release(true);
return true}
_4=_4.append(";",_5,_8).release(false);
var _16;
if(_2){
if(_3){
for(var i=0;i<_1.length;i++){
var _11=_1[i];
if(_11.exampleSource)isc.addProperties(_11,{
fileContents:this.$257x(_4),
url:_11.url,canEdit:false,isReact:true
});
break}
}else{
_16=this.$251g(_1);
if(!this.$249z)this.$2490()}
}
if(_7){
this.fullScreenEvalBuf=_4;
this.fullScreenRenderTargets=_16;
isc.Class.destroyGlobals(this.exampleGlobals);
this.fullScreenBlurb=this.createLaunchFullScreenBlurb();
this.viewPane.addChild(this.fullScreenBlurb);
this.selectTab(0);
isc.clearPrompt();
return true}
if(this.paneContainer)this.paneContainer.scrollTo(0,0);
this.evalExample(_4,_16);
this.selectTab(0);
this.show();
return true}
,isc.A.$257x=function isc_ExampleViewer__createSpoofedReactFile(_1){
_1=_1.replace(this.$257v,"");
_1="\n\n"+_1.trimCharacters("; \t\n\r")+";\n";
return this.$257u.join("\n")+_1}
,isc.A.$251g=function isc_ExampleViewer__getReactRenderTargets(_1){
var _2=_1.filter(function(_4){
return _4.url&&_4.url.endsWith(".jsx")});
var _3=this.$251f;
if(_2.length==1)return[_3];
else _3+="_";
return _2.map(function(_4){
return _3+_4.url.replace(/.*\/([A-Za-z_]+)\.jsx/,"$1")})}
,isc.A.$2490=function isc_ExampleViewer__setWebpackPublicPath(){
this.$249z=true;
var _1=document.createElement("script");
_1.id=this.$249x;
_1.type="webpack/publicPath";
_1.src="/";
document.body.appendChild(_1)}
,isc.A.installReactRenderTargets=function isc_ExampleViewer_installReactRenderTargets(_1){
var _2=this.viewPane.viewContainer;
var _3=_1.length==1?"<div id='"+_1[0]+"'></div>":
"<div><div id='"+_1.join("'></div><div id='")+"'></div></div>";
_2.setContents(_3);
if(!this.isDrawn())this.draw();
else if(_2.isDrawn())_2.redraw();
_2.contents=isc.nbsp}
,isc.A.getJSSource=function isc_ExampleViewer_getJSSource(_1){
return _1.isXML?_1.xmlToJS:_1.fileContents}
,isc.A.evalExample=function isc_ExampleViewer_evalExample(_1,_2){
if(isc.DrawPane!=null)isc.DrawPane.$104v();
if(isc.EditProxy!=null&&isc.EditProxy.$40g==null)isc.EditProxy.$40f();
if(this.exampleGlobals)isc.Class.destroyGlobals(this.exampleGlobals);
isc.clearPrompt();
var _3=[];
try{
this.evalAndCaptureGlobals(_1,_3,_2);
this.addCanviiToView(_3)}catch(e){
if(_3)isc.Class.destroyGlobals(_3);
isc.globalsSnapshot=[];
if(this.lastEvalBuf){
this.exampleGlobals=this.evalAndCaptureGlobals(this.lastEvalBuf,null,
this.lastRenderTargets);
this.addCanviiToView(this.exampleGlobals)}
if(!_2)this.logWarn("Error from this code:\n\n"+_1);
var _4,_5;
if(_2&&e.message.match(/Module build failed/)){
_4=e.name+": "+e.message.replace(/[\x1B]|\[[0-9]+m/g,"");
_5=true}else if(this.autotest){
_4=e.name+": "+e.message;
if(e.stack){
var _6=e.stack.split("\n").slice(0,5);
_4+=" / stack: "+_6.join("\n")}
}else{
_4="Error evaluating your changes:<br><br>ErrorType: "+e.name+"<br>ErrorMessage: "+e.message}
this.exampleReportError(_4,_5);
return false}
this.lastRenderTargets=_2;
this.exampleGlobals=_3;
this.lastEvalBuf=_1;
this.exampleEvalComplete();
return true}
,isc.A.evalAndCaptureGlobals=function isc_ExampleViewer_evalAndCaptureGlobals(_1,_2,_3){
isc.noAutoDraw=true;
var _4=isc.globalsSnapshot=_2||[];
if(_3){
this.installReactRenderTargets(_3);
isc.React.renderFragment(_1,_3)}else if(isc.isA.Function(_1)){
this.fireCallback(_1)}else{
isc.eval(_1)}
delete isc.noAutoDraw;
isc.globalsSnapshot=null;
return _4}
,isc.A.addCanviiToView=function isc_ExampleViewer_addCanviiToView(_1){
if(!this.isDrawn())this.draw();
if(this.loadAsReact()){
for(var i=0;i<_1.length;i++){
var _3=window[_1[i]];
if(!_3||!isc.isA.Canvas(_3)||!isc.isAn.Instance(_3))continue;
_3.setHtmlElement(null);
_3.position="absolute"}
}
for(var i=0;i<_1.length;i++){
var _3=window[_1[i]];
if(!_3||!isc.isA.Canvas(_3)||!isc.isAn.Instance(_3))continue;
var _4=_3;
if(_4.parentElement==null&&_4.masterElement==null&&
!isc.isA.ScrollingMenu(_4)&&!isc.isA.Menu(_4)&&!_4.isModal&&
!(isc.isA.String(_4.$86x)&&
isc.isA.SectionStack(isc.Canvas.getById(_4.$86x)))&&
_4!==isc.Canvas.$178o)
{
if(_4.$2485=="$2481"){
if(_4.autoDraw!=false&&!_4.isDrawn())_4.draw()}else{
if(_4.canDragResize||_4.canDragReposition)_4.keepInParentRect=true;
this.viewPane.viewContainer.addChild(_4,null,_4.autoDraw!=false)}
}
}
}
,isc.A.createLaunchExampleBlurb=function isc_ExampleViewer_createLaunchExampleBlurb(_1){
var _2=isc.VLayout.create({
autoDraw:false,
width:"100%",
height:"100%",
membersMargin:5,
example:_1,
members:[
isc.Label.create({
height:1,
overflow:"visible",
autoDraw:false,
contents:"This example opens in a new window - click the button below to launch the example.<P><B>NOTE:</B> you may need to bypass your pop-up blocker by holding down CTRL as you click <i>Launch Example</i>"
}),
isc.IButton.create({
autoDraw:false,overflow:"visible",
icon:"[ISO_DOCS_SKIN]/images/icon_popup.png",
title:"Launch Example",
viewer:this,
exampleFile:_1,
click:function(){
this.viewer.launchExternalExample(this.exampleFile)}
})
]
});
var _3=this.exampleConfig;
if(_3.screenshot){
var _4=isc.addProperties({},this.screenshotDefaults,this.screenshotProperties,{
src:isc.Page.getIsomorphicDocsDir()+"inlineExamples/"+_3.screenshot,
viewer:this,
exampleFile:_1,
click:function(){
this.viewer.launchExternalExample(this.exampleFile)}
});
if(_3.screenshotHeight&&_3.screenshotWidth){
_4.width=_3.screenshotWidth;
_4.height=_3.screenshotHeight}else{
_4.height="*"}
_2.addMember(isc.Img.create(_4))}
return _2}
,isc.A.createLaunchFullScreenBlurb=function isc_ExampleViewer_createLaunchFullScreenBlurb(){
var _1=isc.VLayout.create({
autoDraw:false,
width:"100%",
height:"100%",
membersMargin:5,
members:[
isc.Label.create({
height:1,
overflow:"visible",
autoDraw:false,
contents:'This is a full-screen example - click the "Show Example" button to show fullscreen.'
}),
isc.IButton.create({
autoDraw:false,overflow:"visible",
icon:"[ISO_DOCS_SKIN]/images/features.png",
title:"Show Example",
viewer:this,
click:function(){
this.viewer.showFullScreenExample()}
})
]
});
this.fullScreenLaunchButton=_1.members[1];
var _2=this.exampleConfig;
if(_2.screenshot){
var _3=isc.addProperties({},this.screenshotDefaults,this.screenshotProperties,{
src:isc.Page.getIsomorphicDocsDir()+"inlineExamples/"+_2.screenshot,
viewer:this,
click:function(){
this.viewer.showFullScreenExample()}
});
if(_2.screenshotHeight&&_2.screenshotWidth){
_3.width=_2.screenshotWidth;
_3.height=_2.screenshotHeight}else{
_3.height="*"}
_1.addMember(isc.Img.create(_3))}
return _1}
,isc.A.createIFRAME=function isc_ExampleViewer_createIFRAME(_1){
var _2=_1.url;
if(!_2.startsWith("/"))_2=isc.Page.getIsomorphicDocsDir()+"inlineExamples/"+_1.url;
var _3=isc.Canvas.create({
autoDraw:false,
width:"100%",
height:"100%",
contentsURL:_2,
contentsType:"page",
destroy:function(){
if(isc.Browser.isIE){
var _4=this.getHandle().firstChild.contentWindow;
_4.document.open();
_4.document.write("");
_4.document.close()}
this.Super("destroy",arguments)}
});
return _3}
,isc.A.launchExternalExample=function isc_ExampleViewer_launchExternalExample(_1){
var _2=isc.Page.getIsomorphicDocsDir()+"inlineExamples/"+_1.url,
_3=_1.externalWindowConfig;
window.open(_2,"_blank",_3);
if(window.useAnalytics&&window.ga){
var _2=_1.url;
var _4="/fe/launchExternal/"+_2;
this.logDebug("tracking: "+_4);
window.ga('send','pageview',{page:_4})}
}
,isc.A.showFullScreenExample=function isc_ExampleViewer_showFullScreenExample(){
var _1=this;
var _2=function(){
if(!_1.fullScreenExmapleWindow){
_1.fullScreenExampleWindow=isc.FullScreenExampleWindow.create({viewer:_1,
exampleConfig:_1.exampleConfig});
_1.fullScreenExampleWindow.setTitle(_1.exampleConfig.title+
_1.fullScreenCloseMessage)}
};
if(!(!this.creator||this.creator.useDesktopMode)){
this.creator.hide();
_2();
this.completeFullScreenShow()}else{
this.showClickMask();
var _3=this.fullScreenLaunchButton.getPageRect();
if(!this.animationOutline){
this.animationOutline=isc.Canvas.create({
autoDraw:false,border:"2px solid black",
top:_3[1],left:_3[0],
width:_3[2],height:_3[3]
})}else{
this.animationOutline.setRect(_3)}
this.animationOutline.show();
this.animationOutline.animateRect(0,0,isc.Page.getWidth(),isc.Page.getHeight(),
{target:this,methodName:"completeFullScreenShow"},
500);
_2()}
if(window.useAnalytics&&window.ga){
var _4=this.exampleConfig.url||this.exampleConfig.jsURL;
var _5="/fe/fullscreen/"+_4;
this.logDebug("tracking: "+_5);
window.ga('send','pageview',{page:_5});
if(window.google_trackConversion){
window.google_trackConversion({
google_conversion_id:1063035128,
google_custom_params:{
action:"fe-fullscreen",
example:this.exampleConfig.jsURL,
random:new Date().getTime()
},
google_remarketing_only:true
})}
}
}
,isc.A.completeFullScreenShow=function isc_ExampleViewer_completeFullScreenShow(){
if(!this.creator||this.creator.useDesktopMode)this.hideClickMask();
this.fullScreenExampleWindow.bringToFront();
this.fullScreenExampleWindow.show();
if(this.viewPane!=this.fullScreenExampleWindow.viewPane){
this.viewPane=this.fullScreenExampleWindow.viewPane;
this.delayCall("evalExample",[this.fullScreenEvalBuf,this.fullScreenRenderTargets],
0)}
}
,isc.A.hideFullScreenExample=function isc_ExampleViewer_hideFullScreenExample(){
if(!(!this.creator||this.creator.useDesktopMode)){
this.fullScreenExampleWindow.clear();
this.creator.show()}else{
this.showClickMask();
this.animationOutline.setRect(0,0,isc.Page.getWidth(),isc.Page.getHeight());
this.animationOutline.show();
this.fullScreenExampleWindow.clear();
var _1=this.fullScreenLaunchButton.getPageRect();
this.animationOutline.animateRect(_1[0],_1[1],_1[2],_1[3],
{target:this,methodName:"completeFullScreenHide"},500)}
}
,isc.A.completeFullScreenHide=function isc_ExampleViewer_completeFullScreenHide(){
this.animationOutline.hide();
this.hideClickMask()}
,isc.A.exampleScheduleDelayCall=function isc_ExampleViewer_exampleScheduleDelayCall(){
this.$1150=this.delayCall("exampleReportCheckStatus",null,500)}
,isc.A.exampleReportCheckStatus=function isc_ExampleViewer_exampleReportCheckStatus(){
if(isc.AutoTest.isSystemDone(true)){
delete this.exampleReportDelayCallID;
this.exampleReportError("")}else this.exampleScheduleDelayCall()}
,isc.A.exampleReportError=function isc_ExampleViewer_exampleReportError(_1,_2){
if(!this.autotest){
if(_2){
this.logWarn(_1);
_1="Failed to load the React JSX for this sample.  An error report has been logged to the browser console."}
isc.warn(_1);
return}
if(this.resultViewer){
this.logWarn("Error received after creating DetailViewer: "+_1);
return}
this.exampleErrorDetails+=_1;
if(isc.RPCManager.errorReportState!=isc.RPCManager.ersEnumeration.complete){
isc.RPCManager.errorReportState=isc.RPCManager.ersEnumeration.requested;
return}
if(this.isObserving(isc.Log,"$115i")){
this.ignore(isc.Log,"$115i")}
if(this.$1150!=null){
isc.Timer.clear(this.$1150);
delete this.$1150}
if(_1==""&&!isc.AutoTest.isSystemDone(true)){
this.observe(isc.Log,"$115i",
"observer.exampleReportError(arguments[0])");
this.exampleScheduleDelayCall();
return}
var _3=[{result:this.exampleErrorDetails.length>0?"failure":"success",
description:this.exampleConfig.description,
detail:this.exampleErrorDetails}];
this.resultViewer=isc.AutoTest.
createDetailViewerForTestResults(this.viewPane.viewContainer,_3);
this.viewPane.viewContainer.addChild(this.resultViewer);
this.exampleErrorDetails=""}
,isc.A.exampleEvalComplete=function isc_ExampleViewer_exampleEvalComplete(){
if(this.autotest){
this.exampleReportError("")}
}
,isc.A.exampleClearResult=function isc_ExampleViewer_exampleClearResult(){
if(this.resultViewer){
this.resultViewer.destroy();
this.resultViewer=null}
}
);
isc.B._maxIndex=isc.C+48;
if(isc.ExampleViewer.showReactFormatSwitcher()){
isc.ExampleViewer.changeDefaults("skinSwitcherDefaults",{
width:130,numCols:1,colWidths:[130]
});
isc.ExampleViewer.changeDefaults("densitySwitcherDefaults",{
width:110,numCols:1,colWidths:[110]
});
isc.A=isc.React;
isc.A.synchronousRender=true}
isc.defineClass("FullScreenExampleWindow","Window");
isc.A=isc.FullScreenExampleWindow.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.autoDraw=false;
isc.A.width="100%";
isc.A.height="100%";
isc.A.showMinimizeButton=false;
isc.A.showCloseButton=true;
isc.A.canDragReposition=false;
isc.A.canDragResize=false;
isc.A.showShadow=false;
isc.B.push(isc.A.closeClick=function isc_FullScreenExampleWindow_closeClick(){
this.viewer.hideFullScreenExample()}
,isc.A.initWidget=function isc_FullScreenExampleWindow_initWidget(){
this.Super("initWidget",arguments);
var _1={};
if(this.exampleConfig.backgroundColor)_1.backgroundColor=this.exampleConfig.backgroundColor;
this.viewPane=isc.ExampleViewPane.create(_1);
this.items=[this.viewPane]}
);
isc.B._maxIndex=isc.C+2;
isc.defineClass("ExampleSourcePane","Canvas");
isc.A=isc.ExampleSourcePane.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.overflow="hidden";
isc.A.sourceViewerDefaults={
_constructor:"SourceViewer",
width:"100%",
height:"100%"
};
isc.A.sourceEditorDefaults={
_constructor:"SourceEditor",
width:"100%",
height:"100%",
useRichEditor:false
};
isc.B.push(isc.A.initWidget=function isc_ExampleSourcePane_initWidget(){
this.Super("initWidget",arguments);
if(this.canEdit){
this.view=this.sourceEditor=this.createAutoChild("sourceEditor")}else{
this.view=this.sourceViewer=this.createAutoChild("sourceViewer")}
this.addChild(this.view);
if(this.source)this.setSource(this.source)}
,isc.A.setSource=function isc_ExampleSourcePane_setSource(_1){
this.source=_1;
var _2="js";
if(!this.exampleFile.forceJS&&(this.exampleFile.isXML||this.exampleFile.external
||this.exampleFile.url.match(/\.wsdl|xml$/i)))_2="xml";
if(this.exampleFile.url&&this.exampleFile.url.match(/\.s?css$/i))_2="css";
this.view.setSource(_1,_2)}
,isc.A.revertEdit=function isc_ExampleSourcePane_revertEdit(){
this.sourceEditor.setSource(this.source)}
,isc.A.tryEditedCode=function isc_ExampleSourcePane_tryEditedCode(){
var _1=this.sourceEditor.getSource();
var _2=this.exampleFile;
_2.fileContents=_1;
if(_2.isXML){
if(!isc.hasOptionalModule("SCServer")){
isc.RPCManager.sendRequest({
actionURL:this.rpcURL,
useSimpleHttp:true,
serverOutputAsString:true,
params:{
noSCServer:true,
data:isc.Comm.xmlSerialize("data",{
method:"xmlToJS",
exampleFiles:[
_2
]
})
},
callback:this.getID()+
".xmlToJSCallback(rpcRequest, rpcResponse, isc.eval(data))"
})}else{
isc.RPCManager.sendRequest({
actionURL:this.rpcURL,
data:{
method:"xmlToJS",
exampleFiles:[
_2
]
},
callback:this.getID()+".xmlToJSCallback(rpcRequest, rpcResponse, data)"
})}
}else if(_2.isCSS){
var _3=this;
if(!isc.hasOptionalModule("SCServer")){
isc.RPCManager.sendRequest({
actionURL:this.rpcURL,
useSimpleHttp:true,
serverOutputAsString:true,
params:{
noSCServer:true,
data:isc.Comm.xmlSerialize("data",{
method:"bounceCSS",
exampleFile:_2
})
},
callback:function(){
_3.loadCSS(_3.rpcURL+"/bounce.css?cssID="+_2.url)}
})}else{
isc.RPCManager.sendRequest({
actionURL:this.rpcURL,
data:{
method:"bounceCSS",
exampleFile:_2
},
callback:function(){
isc.StatefulCanvas.clearBorderCSSCache();
isc.StatefulCanvas.clearShadowCSSCache();
isc.disableCSSStyleSheets([_2.url]);
_3.loadCSS(_3.rpcURL+"/bounce.css?cssID="+_2.url)}
})}
}else{
isc.StatefulCanvas.clearBorderCSSCache();
isc.StatefulCanvas.clearShadowCSSCache();
this.setCurrentExampleSource(_2);
this.exampleViewer.showExample()}
}
,isc.A.loadCSS=function isc_ExampleSourcePane_loadCSS(_1){
isc.FileLoader.loadFile(isc.RPC.addParamsToURL(_1,{ts:new Date().getTime()}),
this.getID()+".loadCSSCallback()")}
,isc.A.loadCSSCallback=function isc_ExampleSourcePane_loadCSSCallback(){
isc.Canvas.clearCSSCaches();
this.exampleViewer.showExample()}
,isc.A.xmlToJSCallback=function isc_ExampleSourcePane_xmlToJSCallback(_1,_2,_3){
var _4=_3[0];
if(_4.error){
isc.warn(_4.error);
return}
this.exampleFile.xmlToJS=_4.xmlToJS;
this.setCurrentExampleSource(this.exampleFile);
this.exampleViewer.showExample()}
,isc.A.setCurrentExampleSource=function isc_ExampleSourcePane_setCurrentExampleSource(_1){
if(_1.isSource&&!_1.exampleSource){
_1.exampleSource=true;
this.exampleViewer.currentExampleSourceFile.exampleSource=false;
this.exampleViewer.currentExampleSourceFile=this.exampleFile}
}
);
isc.B._maxIndex=isc.C+8;
isc.defineClass("SourceViewer","VLayout");
isc.A=isc.SourceViewer.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.sourceContainerDefaults={
_constructor:"HTMLFlow",
overflow:"auto",
canFocus:true,
canSelectText:true,
selectContentOnSelectAll:true,
height:"*"
};
isc.A.sourceViewerSeparatorDefaults={
_constructor:"Label",
overflow:"hidden",
baseStyle:"exampleSeparator",
height:6,width:"100%"
};
isc.A.sourceViewerToolbarDefaults={
_constructor:"HLayout",
overflow:"visible",
isGroup:true,
groupTitle:"",
height:20,
membersMargin:10,
layoutMargin:5,
viewOptionsFormDefaults:{
_constructor:"DynamicForm",
items:[{
name:"showImports",title:"Show imports",type:"boolean",
prompt:"For simplicity, React JSX is shown without imports by default.  Check the box to make the import statements visible.",
changed:function(_1,_2,_3){
var _4=_1.creator.creator,
_5=_4.creator,
_6=_5.source;
if(_6)_5.setSource(_6)}
}]
},
getViewOptions:function(){
return this.viewOptionsForm.getValues()},
initWidget:function(){
this.Super("initWidget",arguments);
this.addAutoChild("viewOptionsForm")}
};
isc.B.push(isc.A.initWidget=function isc_SourceViewer_initWidget(){
this.Super("initWidget",arguments);
this.sourceContainer=this.createAutoChild("sourceContainer");
this.addMember(this.sourceContainer);
if(this.isReact()){
this.sourceViewerToolbar=this.createAutoChild("sourceViewerToolbar");
this.sourceViewerSeparator=this.createAutoChild("sourceViewerSeparator");
this.addMembers([this.sourceViewerSeparator,this.sourceViewerToolbar])}
}
,isc.A.isReact=function isc_SourceViewer_isReact(){
var _1=this.creator.exampleFile;
if(_1)return _1.isReact}
,isc.A.setSource=function isc_SourceViewer_setSource(_1,_2){
if(!_1)_1=isc.emptyString;
if(this.isReact()){
_1=_1.replace(isc.React.autoGenFileMarker,"").trim();
var _3=this.sourceViewerToolbar,
_4=_3.getViewOptions();
if(!_4.showImports){
_1=_1.replace(/(\s*import[\s\S]*?;)*\s*/,"")}
}
if(_2){
if(!this.syntaxHiliter){
if(_2=="xml")this.syntaxHiliter=isc.XMLSyntaxHiliter.create();
else if(_2=="js")this.syntaxHiliter=isc.JSSyntaxHiliter.create();
else if(_2=="css")this.syntaxHiliter=isc.CSSSyntaxHiliter.create();
else this.logDebug("Can't find hiliter for type: "+_2)}
}
if(this.syntaxHiliter){
this.sourceContainer.setContents(this.syntaxHiliter.hilite(_1))}else{
this.sourceContainer.setContents(_1.asHTML())}
}
);
isc.B._maxIndex=isc.C+3;
isc.defineClass("SourceEditor","VLayout");
isc.A=isc.SourceEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.membersMargin=5;
isc.A.richSourceEditorDefaults={
getBrowserSpellCheck:function(){return false},
_constructor:"RichTextCanvas",
cursor:isc.Canvas.TEXT,
countLines:true,
changed:function(){
this.creator.sourceChanged()}
};
isc.A.sourceEditorFormDefaults={
browserSpellCheck:false,
_constructor:"DynamicForm",
overflow:"hidden",
autoFocus:false,
height:"*",
numCols:1,
itemChange:function(){
this.creator.sourceChanged()},
fields:[
{
formItemType:"textArea",
name:"source",
showTitle:false,
height:"*",
width:"*",
textBoxStyle:"explorerExampleSource",
wrap:"OFF",
browserAutoCapitalize:false,
browserAutoCorrect:false
}
]
};
isc.A.sourceEditorToolbarDefaults={
_constructor:"HLayout",
overflow:"visible",
height:1,
membersMargin:10,
layoutMargin:5,
tryItButtonDefaults:{
_constructor:"IButton",
title:"Try it",
showHover:true,
hoverWidth:250,
prompt:"This example viewer allows you to try out changes to the samples! Just edit the code above and press \"Try It\" to try out your changes",
icon:"[ISO_DOCS_SKIN]/images/icon_run.png",
click:"this.parentElement.creator.tryClicked()"
},
revertButtonDefaults:{
_constructor:"IButton",
title:"Revert",
disabled:true,
showDisabledIcon:false,
icon:"[ISO_DOCS_SKIN]/images/icon_revert.png",
click:"this.parentElement.creator.revertClicked()"
},
downloadSDKButtonDefaults:{
_constructor:"IButton",
width:140,
title:"Download SDK",
icon:"[ISO_DOCS_SKIN]/images/arrow_down_blue.png",
click:"window.location.href = '/product/download.jsp'"
},
initWidget:function(){
this.Super("initWidget",arguments);
this.refDocsURL=isc.ExampleViewer.getRefDocsURL();
this.tryItButton=this.createAutoChild("tryItButton");
this.revertButton=this.createAutoChild("revertButton");
if(!isc.Browser.isMobile&&isc.ExampleViewer.websiteMode){
this.downloadSDKButton=this.createAutoChild("downloadSDKButton")}
this.addMembers([this.tryItButton,this.revertButton,
isc.ExampleViewer.websiteMode?this.downloadSDKButton:null,
isc.LayoutSpacer.create({width:"*"})]);
this.docSearch=isc.DynamicForm.create({
ID:this.getID()+"$50n",
autoDraw:false,
refDocsURL:this.refDocsURL,
numCols:2,
colWidths:["*",150],
doSearch:function(){
var _1=this.getValue('searchString');
window.open(this.refDocsURL+(_1?"?id="+
encodeURIComponent("search="+_1):""),"refDocWindow")},
fields:[{
name:"searchString",
width:"*",
title:"<nobr>Search <a class='linkText' target='refDocWindow' href='"+this.refDocsURL+
"' onclick='"+this.getID()+"$50n.doSearch();return false;'>SmartClient Documentation</a></nobr>",
keyPress:function(_2,_3,_4){
if(_4=="Enter")_3.doSearch()}
}]
});
this.addMembers([this.docSearch])}
};
isc.B.push(isc.A.initWidget=function isc_SourceEditor_initWidget(){
this.Super("initWidget",arguments);
this.useRichEditor=this.useRichEditor&&isc.SyntaxHiliter&&isc.RichTextCanvas;
this.sourceEditor=this.createAutoChild(this.useRichEditor?"richSourceEditor":"sourceEditorForm");
this.sourceEditorToolbar=this.createAutoChild("sourceEditorToolbar");
this.addMembers([this.sourceEditor,this.sourceEditorToolbar])}
,isc.A.setSource=function isc_SourceEditor_setSource(_1,_2){
if(this.useRichEditor){
if(_2){
if(_2=="xml")this.syntaxHiliter=isc.XMLSyntaxHiliter.create();
else if(_2=="js")this.syntaxHiliter=isc.JSSyntaxHiliter.create();
else if(_2=="css")this.syntaxHiliter=isc.CSSSyntaxHiliter.create();
else{
this.logDebug("Can't find hiliter for type: "+_2);
delete this.syntaxHiliter}
}
}
if(this.useRichEditor){
this.sourceEditor.setSyntaxHiliter(this.syntaxHiliter);
this.sourceEditor.setContents(_1)}else{
this.sourceEditor.setValue("source",_1)}
}
,isc.A.getSource=function isc_SourceEditor_getSource(){
return this.useRichEditor?this.sourceEditor.getContents():this.sourceEditor.getValue("source")}
,isc.A.sourceChanged=function isc_SourceEditor_sourceChanged(){
this.sourceEditorToolbar.revertButton.enable()}
,isc.A.tryClicked=function isc_SourceEditor_tryClicked(_1){
this.creator.tryEditedCode()}
,isc.A.revertClicked=function isc_SourceEditor_revertClicked(_1){
if(this.creator.exampleFile.isCSS){
isc.disableCSSStyleSheets(this.creator.exampleFile.url,false);
isc.disableCSSStyleSheets("bounce.css?cssID="+this.creator.exampleFile.url,true)}
isc.StatefulCanvas.clearBorderCSSCache();
isc.StatefulCanvas.clearShadowCSSCache();
this.creator.revertEdit();
this.sourceEditorToolbar.revertButton.disable()}
);
isc.B._maxIndex=isc.C+6;
isc.defineClass("TitlePagePane","VLayout");
isc.A=isc.TitlePagePane.getPrototype();
isc.A.overflow="auto";
isc.A.layoutMargin=10;
isc.A.titlePageHeaderDefaults={
_constructor:"Label",
styleName:"explorerTitlePageTitle",
height:30,
wrap:false
};
isc.A.folderListDefaults={
_constructor:"Label",
styleName:"explorerFolderList",
valign:"top",
overflow:"visible",
height:50,
canSelectText:true,
extraSpace:14
};
isc.A.screenshotDefaults={
_constructor:"Img",
layoutAlign:"center"
};
isc.A.cSpacerDefaults={
_constructor:"LayoutSpacer",
height:"*"
};
isc.A.copyrightFooterDefaults={
_constructor:"Label",
contents:
"<div style='color: #C0C0C0;'>Copyright &copy; 2000 and beyond Isomorphic Software.<br>All rights reserved. <a style='color: #c0c0c0;' href='/licenses/isc_eval_license_050316.html'>Terms of use</a></div>",
align:"center",
width:"100%",height:28,overflow:"hidden",
visibility:"hidden"
};
isc.A.autoChildren=[
"titlePageHeader",
"folderList",
"screenshot",
"cSpacer",
"copyrightFooter"
]
;
isc.defineClass("ExampleViewPane","Canvas");
isc.A=isc.ExampleViewPane.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.autoDraw=false;
isc.A.children=[
{
autoChildName:"viewContainer",
width:"100%",height:"100%"
},
{
autoChildName:"sizer",
zIndex:100,
overflow:"hidden"
}
];
isc.A.overflow="visible"
;
isc.B.push(isc.A.childResized=function isc_ExampleViewPane_childResized(_1){
this.Super("childResized",arguments);
var _2=this.children;
if(_2.length<2)return;
_2[1].setRect(0,0,_2[0].getVisibleWidth(),_2[0].getVisibleHeight())}
);
isc.B._maxIndex=isc.C+1;
isc.defineClass("WebRightButtonBox","Layout");
isc.A=isc.WebRightButtonBox.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.showGradient=true;
isc.A.styleName="explorerButtonBoxR";
isc.A.width=200;
isc.A.height=1;
isc.B.push(isc.A.init=function isc_WebRightButtonBox_init(){
if(this.showGradient&&this.hasGradient)this.styleName+=" explorerButtonBoxGradient";
this.Super("init",arguments)}
);
isc.B._maxIndex=isc.C+1;
isc.defineClass("WebRightButton","Label");
isc.A=isc.WebRightButton.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=200;
isc.A.align="center";
isc.A.valign="center";
isc.A.height=1;
isc.A.fontSize=8;
isc.A.lineHeight=12;
isc.B.push(isc.A.getSkinStyle=function isc_WebRightButton_getSkinStyle(_1){
return _1}
,isc.A.getButtonStyle=function isc_WebRightButton_getButtonStyle(_1){
if(!_1)_1="";
return this.buttonBaseStyle+this.getSkinStyle("\x5fEbutton")+_1+this.getSkinStyle(" ERbutton")+_1}
,isc.A.init=function isc_WebRightButton_init(){
this.styleName=this.getButtonStyle("");
this.Super("init",arguments)}
);
isc.B._maxIndex=isc.C+3;
isc.defineClass("WebBottomButton","Label");
isc.A=isc.WebBottomButton.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.wrap=false;
isc.B.push(isc.A.getSkinStyle=function isc_WebBottomButton_getSkinStyle(_1){
return _1}
,isc.A.getButtonStyle=function isc_WebBottomButton_getButtonStyle(_1){
if(!_1)_1="";
return this.buttonBaseStyle+this.getSkinStyle("\x5fEbutton")+_1+this.getSkinStyle(" Ebutton")+_1}
,isc.A.init=function isc_WebBottomButton_init(){
this.styleName=this.getButtonStyle("");
this.Super("init",arguments)}
);
isc.B._maxIndex=isc.C+3;
if(!isc.GrippySplitbar){
isc.defineClass("GrippySplitbar","ImgSplitbar");
isc.A=isc.GrippySplitbar.getPrototype();
isc.A.imageWidth=7;
isc.A.imageHeight=16;
isc.A.vSrc="[ISO_DOCS_SKIN]/images/grips/vgrip.png";
isc.A.hSrc="[ISO_DOCS_SKIN]/images/grips/hgrip.png"
}
isc.defineClass("VersionLabel","Label");
isc.defineClass("FeatureExplorer","VLayout");
isc.A=isc.FeatureExplorer.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.creatorName="featureExplorer";
isc.A.leftPaneDefaults={
_constructor:"VLayout",
width:246
};
isc.A.gridSearchDefaults={
_constructor:"GridSearch",
searchProperty:"title",
hint:"Search examples...",
autoParent:"leftPane"
};
isc.A.exampleTreeDefaults={
_constructor:"TreeGrid",
autoParent:"leftPane",
showHeader:false,
leaveScrollbarGap:false,
selectionType:"single",
animateRowsMaxTime:200,
recordClick:function(_1,_2){
if(_2.id&&_2.id.startsWith("newSamplesFE")){
var _3="newSamples";
if(_2.id=="newSamplesFE131")_3="newSamples131";
var _4=_1.featureExplorer,
_5=_4.exampleTree.data.findById(_3),
_6=_4.exampleTree.getRowNum(_5);
_4.showExample(_5,null,true,"forward");
_4.exampleTree.deselectRecord(_2);
_4.exampleTree.selectRecord(_5);
_4.exampleTree.scrollToRow(_6)}else{
if((_1.hasAIAccess==false)&&_2&&_2.id&&_2.id.startsWith("ai")){
_1.featureExplorer.showAIDialog(null,_2.id);
return}
_1.featureExplorer.showExample(_2,null,true,"forward")}
},
canHover:isc.Browser.isDesktop,
hoverStyle:"hoverTreeGridCustom",
getCellStyle:function(_1,_2,_3){
if((this.hasAIAccess==false)&&_1&&_1.id&&_1.id.startsWith("ai")){
return"etreeCellShivaDisabled"}
return this.Super("getCellStyle",arguments)},
cellHoverHTML:function(_1,_2,_3){
if(_1.ref!=null&&_1.description==null){
var _4=this.data.findById(_1.ref);
if(_4!=null)_1.description=_4.description}
if((_1.description==null)||(_1.description.trim().length==0)){
return""}else{
var _5="<div style=\"width:450px; margin-top:10px; margin-bottom:10px; margin-left:10px; margin-right:10px;\"><b>Sample Description</b>: "+_1.description.evalDynamicString();
if((_1.id&&_1.id=="aiSamplesFE")||(_1.parentId&&_1.parentId=="aiSamplesFE")){
_5+=
"<br><br><span style='color: red;font-size:11px;font-weight: 700;'>BETA</span> : This sample demonstrates features available in the <b>SmartClient AI Module</b>."}else if(_1.beta){
_5+=
"<br><br><span style='color: red;font-size:11px;font-weight: 700;'>BETA</span> : This sample demonstrates features available in the next available version of SmartClient, "+isc.HomeInterface.getPreReleaseVersion()+
".  To download a "+isc.HomeInterface.getPreReleaseVersion()+
" SDK, click on \"Pre-release versions\" on the Download page."}
_5+="</div>";
return _5}
},
drawAllMaxCells:1000,
nodeIcon:"[ISO_DOCS_SKIN]/images/explorerTree/gears.png",
folderIcon:"[ISO_DOCS_SKIN]/images/explorerTree/folder.png",
disableAISamples:function(){
if(this.hasAIAccess==false)return;
this.hasAIAccess=false;
this.markForRedraw()}
};
isc.A.toolStripSCVersionDefaults={
_constructor:"ToolStrip",
autoParent:"leftPane",
width:"100%",
initWidget:function(){
this.Super("initWidget",arguments);
this.members[0].setContents("Version: "+isc.scVersion+" <br>Built: "+isc.buildDate)},
members:[
{
_constructor:"VersionLabel",
autoDraw:false,
width:"100%",
height:"100%",
padding:5,
dynamicContents:true,
valign:"center"
},
{
_constructor:"ToolStripButton",
iconSize:("Tahoe,Obsidian,Stratus,Twilight,Shiva".indexOf(isc.ExampleViewer.getSkin())!=-1)?32:16,
autoDraw:false,
padding:5,
prompt:"How to use this Showcase",
icon:"other/help.png",
skinImgDir:"",
iconClick:function(){
window.open('http://www.smartclient.com/docs/release/a/b/c/go.html#featureExplorerOverview')}
},
{
_constructor:"ToolStripButton",
visibility:isc.ExampleViewer.websiteMode?"visible":"hidden",
iconSize:("Tahoe,Obsidian,Stratus,Twilight,Shiva".indexOf(isc.ExampleViewer.getSkin())!=-1)?32:16,
autoDraw:false,
padding:5,
prompt:"Privacy and other policies",
icon:"other/privacy.png",
iconClick:function(){
window.open('http://www.smartclient.com/policies/index.jsp')}
}
]
};
isc.A.exampleDescriptionDefaults={
_constructor:"Label",
margin:5,
height:92,
overflow:"auto",
canSelectText:true,
valign:"top",
styleName:"darkDescription",
showResizeBar:true
};
isc.A.exampleSpacerDefaults={
_constructor:"LayoutSpacer",
height:6
};
isc.A.exampleViewerDefaults={
_constructor:"ExampleViewer"
};
isc.A.topPaneDefaults={
_constructor:"HLayout",
height:"100%",
overflow:"hidden"
};
isc.A.leftSuperPaneDefaults={
_constructor:"SplitPane",
resizeBarTarget:"next",
autoParent:"topPane",
navigationTitle:"Samples",
showMiniNav:true,
overflow:"hidden",
upClick:function(){
this.creator.$159z()},
downClick:function(){
this.creator.$142e()},
paneChanged:function(_1){
if(this.deviceMode==="handset"){
this.creator.gridSearch.searchItem.setDisabled(_1!=="navigation")}
}
};
isc.A.tabletNavButtonDefaults={
_constructor:"IButton",
title:"Sample Tree",
click:function(){
this.creator.leftSuperPane.showNavigationPane()}
};
isc.A.centerPaneDefaults={
_constructor:"Canvas",
overflow:"hidden"
};
isc.A.titlePageDefaults={
_constructor:"VLayout",
autoParent:"centerPane",
visibility:"hidden",
width:"100%",height:"100%",
overflow:"hidden",
titlePagePaneDefaults:{
_constructor:"TitlePagePane"
},
autoChildren:[
"titlePagePane"
]
};
isc.A.examplePageDefaults={
_constructor:"SectionStack",
autoParent:"centerPane",
visibility:"hidden",
visibilityMode:"multiple",
width:"100%",
height:"100%",
sectionHeaderClass:"ExampleViewerSectionHeader"
};
isc.A.homeInterfacePageDefaults={
_constructor:"SectionStack",
autoParent:"centerPane",
visibility:"hidden",
visibilityMode:"multiple",
border:"0px",
width:"100%",
height:"100%",
sectionHeaderClass:"ExampleViewerSectionHeader"
};
isc.A.homeInterfaceDefaults={
_constructor:"HomeInterface"
};
isc.A.rightPaneDefaults={
_constructor:"VStack",
autoParent:"topPane",
overflow:"auto",
defaultLayoutAlign:"center",
width:235
};
isc.A.smartGwtButtonBoxRDefaults={
_constructor:"WebRightButtonBox",
autoParent:"rightPane"
};
isc.A.smartGwtButtonRDefaults={
_constructor:"WebRightButton",
autoParent:"smartGwtButtonBoxR",
buttonBaseStyle:"lightgrey",
dynamicContents:true,
contents:"<div class='${this.getButtonStyle('Div')}'>Prefer to write UI in Java?</div><a class='${this.getButtonStyle('A')}' style='line-height: ${this.lineHeight}pt;padding-top:5pt;' href='"+(isc.scVersion.endsWith('p')?
'/smartgwtee/showcase/':'/smartgwtee-latest/showcase/')+
"'>Smart GWT<br/>Hands-On Demo</a>"
};
isc.A.contactUsButtonBoxRDefaults={
_constructor:"WebRightButtonBox",
autoParent:"rightPane",
hasGradient:true
};
isc.A.contactUsButtonRDefaults={
autoParent:"contactUsButtonBoxR",
_constructor:"WebRightButton",
buttonBaseStyle:"darkgrey",
dynamicContents:true,
contents:"<div class='${this.getButtonStyle('Div')}'>Got questions?<div class='${this.getButtonStyle('Div')}' style='font-size: ${this.fontSize}pt;'>We'd love to hear from you!</div></div><a class='${this.getButtonStyle('A')}' href='/company/contact.jsp'>Contact Us</a>"
};
isc.A.freeTrialButtonBoxRDefaults={
_constructor:"WebRightButtonBox",
autoParent:"rightPane",
hasGradient:true
};
isc.A.freeTrialButtonRDefaults={
autoParent:"freeTrialButtonBoxR",
_constructor:"WebRightButton",
buttonBaseStyle:"blue",
dynamicContents:true,
contents:"<div class='${this.getButtonStyle('Div')}'>Try it out for yourself!</div><a class='${this.getButtonStyle('A')}' style='line-height: ${this.lineHeight}pt; padding-top:5pt;' href='/product/download.jsp' >Free Trial<br/><span style='font-size: ${this.fontSize}pt;'>60 days</span></a>"
};
isc.A.pricingButtonBoxRDefaults={
_constructor:"WebRightButtonBox",
autoParent:"rightPane",
hasGradient:true
};
isc.A.pricingButtonRDefaults={
autoParent:"pricingButtonBoxR",
_constructor:"WebRightButton",
buttonBaseStyle:"orange",
dynamicContents:true,
contents:"<div class='${this.getButtonStyle('Div')}'>Want your own?</div><a class='${this.getButtonStyle('A')}' href='/product/' >Editions & Pricing</a>"
};
isc.A.learnMoreButtonBoxRDefaults={
_constructor:"WebRightButtonBox",
autoParent:"rightPane",
hasGradient:true
};
isc.A.learnMoreButtonRDefaults={
autoParent:"learnMoreButtonBoxR",
_constructor:"WebRightButton",
buttonBaseStyle:"lightgrey",
dynamicContents:true,
contents:"<div class='${this.getButtonStyle('Div')}'>Isomorphic has the advantage.</div><a class='${this.getButtonStyle('A')}' href='/technology/whysmart.jsp' >Learn More ></a>"
};
isc.A.bottomPaneDefaults={
_constructor:"HStack",
overflow:"hidden",
hidden:true,
width:"100%",
height:30,
styleName:"explorerBottomPane"
};
isc.A.bottomPaneLeftDefaults={
autoParent:"bottomPane",
_constructor:"HLayout",
width:"45%",
height:30,
layoutLeftMargin:10,
layoutRightMargin:10,
membersMargin:10,
align:"left"
};
isc.A.bottomPaneRightDefaults={
autoParent:"bottomPane",
_constructor:"HLayout",
width:"55%",
height:30,
layoutRightMargin:10,
align:"right"
};
isc.A.freeTrialButtonBDefaults={
autoParent:"bottomPaneLeft",
_constructor:"WebBottomButton",
buttonBaseStyle:"blue",
dynamicContents:true,
contents:"<a class='${this.getButtonStyle('A')}' href='/product/download.jsp' >Free Trial</a>"
};
isc.A.pricingButtonBDefaults={
autoParent:"bottomPaneLeft",
_constructor:"WebBottomButton",
buttonBaseStyle:"orange",
dynamicContents:true,
contents:"<a class='${this.getButtonStyle('A')}' href='/product/'>Editions & Pricing</a>"
};
isc.A.smartGwtButtonPreBDefaults={
autoParent:"bottomPaneRight",
_constructor:"WebBottomButton",
width:180,
buttonBaseStyle:"EBbutton",
dynamicContents:true,
contents:"<span class='${this.getSkinStyle('EBbutton')}Span'>Prefer to write UI in Java?</span>"
};
isc.A.smartGwtButtonBDefaults={
autoParent:"bottomPaneRight",
_constructor:"WebBottomButton",
width:160,
buttonBaseStyle:"darkgrey",
dynamicContents:true,
contents:
"<a class='${this.getButtonStyle('A')}' style='width: 160px;' href='"+
(isc.scVersion.endsWith('p')?'/smartgwtee/showcase/':
'/smartgwtee-latest/showcase/')+"'>Smart GWT Live Demo</a>"
};
isc.A.autoChildren=["topPane","leftPane","gridSearch","centerPane","titlePage","examplePage","homeInterfacePage"];
isc.A.exampleChecks=[
{
flag:"needServer",
message:"This example requires the ISC integration server.",
test:function(){
return window.location.href.startsWith("http")}
},
{
flag:"needXHR",
message:"This example requires the XMLHttpRequest object.  You'll need to enable ActiveX or, if you're running IE7 making sure the native XMLHttpRequest support is enabled is sufficient.",
test:function(){
return isc.RPCManager.xmlHttpRequestAvailable()}
},
{
flag:"needXML",
message:function(){
if(isc.Browser.isSafari){
return"This example requires a native XML parser, which is not supported in Safari."}
return"XML Processing in IE requires ActiveX.  Please enable ActiveX to see this example"},
test:function(){
return isc.XMLTools.nativeXMLAvailable()}
},
{
flag:"needEditMode",
message:"This example requires the Dashboard and Tools module, with an Enterprise license.",
test:function(){
return isc.EditContext&&(isc.EditContext.$1226||isc.isReifySDK)}
}
];
isc.A.initialExample="Welcome";
isc.A.densityPresets={
"Dense":"fontIncrease=0&sizeIncrease=0",
"Compact":"fontIncrease=1&sizeIncrease=2",
"Medium":"fontIncrease=2&sizeIncrease=4",
"Expanded":"fontIncrease=2&sizeIncrease=6",
"Spacious":"fontIncrease=3&sizeIncrease=10"
};
isc.B.push(isc.A.supportsVoiceCommands=function isc_FeatureExplorer_supportsVoiceCommands(){
return isc.AI&&isc.AI.isEnabled()}
,isc.A.doVoiceCommand=function isc_FeatureExplorer_doVoiceCommand(_1){
if(!isc.AI||!isc.AI.isEnabled()){
isc.say("Showcase support for VoiceCommands requires AI.");
return}
if(_1==""){
this.logWarn("doVoiceCommand() passed empty commandText.");
return}
var _2="This prompt is related to the Isomorphic SmartClient Showcase, which contains hundreds of samples of how to use the framework.\n\nYour task is to determine what the user appears to be looking for with this request: \""+_1+"\".\n\nYour response should be a JSON object with one of the following properties set:\n\n1.  \"sampleSearch\" (string) - include this property when the user is requesting a search for relevant samples.  Prompts like 'move widget to x/y' or similar are commands, not sample-search requests.   The value for this property is the word or words the user wants to find.  This should be very concise, since your \"sampleSearch\" value will be used in a straight word-search of sample-titles.\n\nExample 1 - \"sampleSearch\"\nrequest: \"Show me samples about data grouping\"\nresponse: { \"sampleSearch\": \"grouping\" }\n\nExample 2 - \"sampleSearch\"\nrequest: \"Are there any Calendar samples?\"\nresponse: { \"sampleSearch\": \"calendar\" }\n\nExample 3 - \"sampleSearch\"\nrequest: \"How do I use menus?\"\nresponse: { \"sampleSearch\": \"menu\" }\n\n2. \"gridRequest\" (string): include this property if the user-request appears to be something intended for a ListGrid widget, such as requests related to sorting, grouping, hiliting or filtering.  The value should be the user's request, rephrased for clarity if necessary.\n\nExample 1 - \"gridRequest\" - request for sorting\nrequest: \"sort by customer name\"\nresponse: { \"gridRequest\": \"Sort by customer name\" }\n\nExample 2 - \"gridRequest\" - request for grouping\nrequest: \"Group by customer alphabetically\"\nresponse: { \"gridRequest\": \"Group by customer alphabetically\" }\n\nExample 3 - \"gridRequest\" - request for hiliting\nrequest: \"Show order-values above 20k in red\"\nresponse: { \"gridRequest\": \"Show order-values above 20k in red\" }\n\nExample 4 - \"gridRequest\" - request to show the ListGrid filter-editor widget\nrequest: \"Show the filter editor\"\nresponse: { \"gridRequest\": \"Show the filter editor\" }\n\n3. \"clickRequest\" (string): include this property if the user-request does not appear to be related to a grid or a search, but seems like a click-request, such as 'close the window' or 'click the X button'.  The value should be the likely title of the thing that should be clicked.\n\nExample 1 - \"clickRequest\"\nrequest: \"close the current window\"\nresponse: { \"clickRequest\": \"Close\" }\n\nIf the user-request is neither a \"sampleSearch\", a \"gridRequest\" nor an \"clickRequest\", your response should be an empty object.\n\n";
var _3=function(_12,_13){
var _4=_12.error&&_12.error.message;
if(_4){
isc.logWarn("Error returned by AI - "+_4);
return}
var _5=_12.messageText||(_12.message&&_12.message.content);
if(!_5){
isc.logWarn("Invalid response from AI, no message-text - can't continue.");
return}
var _6=_5.replaceAll("```json","").replaceAll("```","");
var _7=JSON.parse(_6);
if(_7.sampleSearch){
var _8=this,
_9=_8.homeInterfacePage.getMember(1).children[0];
_8.showExample(_8.exampleTree.data.findById("Welcome"));
_9.setValue("search",_7.sampleSearch);
if(_8.useDesktopMode){
_9.focusInItem(_9.getField("search"))}
_9.showTiles(_7.sampleSearch,null);
isc.VoiceAssist.hideCommandWindow();
return}else if(_7.gridRequest){
var _10=isc.VoiceAssist.targetComponent;
if(!isc.isA.ListGrid(_10)||_10==this.exampleTree)
_10=this.getGridFromCurrentSample();
if(isc.isA.ListGrid(_10)){
_10.configureViaAI(_7.gridRequest);
isc.VoiceAssist.hideCommandWindow();
return}
}else if(_7.clickRequest){
var _11=isc.VoiceAssist.targetComponent;
if(_11&&_11!=window.featureExplorer){
if(isc.VoiceAssist.targetComponent.doVoiceCommand(_7.clickRequest)){
isc.VoiceAssist.hideCommandWindow();
return}
}
}
var _11=isc.VoiceAssist.targetComponent;
if(_11&&_11!=window.featureExplorer){
isc.VoiceAssist.targetComponent.doVoiceCommand(_1);
isc.VoiceAssist.hideCommandWindow();
return}
isc.doVoiceCommand(_1);
isc.VoiceAssist.hideCommandWindow()}.bind(this);
isc.AI.sendPrompt(_2,null,_3)}
,isc.A.getGridFromCurrentSample=function isc_FeatureExplorer_getGridFromCurrentSample(){
var _1=this.exampleViewer.viewPane.viewContainer;
var _2=this.getGridFromArray(_1.children);
return _2}
,isc.A.getGridFromArray=function isc_FeatureExplorer_getGridFromArray(_1){
for(var i=0;i<_1.length;i++){
if(isc.isA.ListGrid(_1[i]))return _1[i];
var _3=null;
if(_1[i].members)_3=this.getGridFromArray(_1[i].members);
else if(_1[i].children)_3=this.getGridFromArray(_1[i].children);
if(_3)return _3}
return null}
,isc.A.showAISamples=function isc_FeatureExplorer_showAISamples(){
if(!isc.AI||!isc.hasOptionalModule("AI"))return false;
return true}
,isc.A.showAIDialog=function isc_FeatureExplorer_showAIDialog(_1,_2){
if(!_2)_2=this.genExampleId(this.currentExampleConfig);
if(_1)this.aiAccessExtraData=_1;
else _1=this.aiAccessExtraData;
if(this.aiDialog){
this.aiDialog.destroy();
this.aiDialog=null}
var _3=this,
_4="<b>Oops, sorry about this</b><br><br>Live AI samples are restricted to customers and active community members. But just ask and you're in!",
_5=[];
if(_1&&_1.userid&&!_1.signedIn){
if(_1.message){
_4="You need to log back in to use the AI samples!"}else{
_4="Live AI samples are restricted to customers and active community members.<br><br>Looks like you aren't logged in to your SmartClient.com account. Log in to see if you have access.<br><br>Even if you don't, just ask and you're in!"}
_5=[
isc.IButton.create({
name:"login",
title:"Log In",
width:200,
autoDraw:false
})
]}else{
_5=[
isc.IButton.create({
name:"requestAccess",
title:"Request Access",
width:200,
autoDraw:false
}),
isc.IButton.create({
name:"learnAboutAI",
title:"Learn about AI Features",
width:200,
autoDraw:false
})
]}
_5.push(
isc.IButton.create({
name:"viewNonAISamples",
title:"View Non-AI Samples",
width:200,
autoDraw:false
})
);
var _6=this.aiOrigin||window.origin;
this.aiDialog=isc.Dialog.create({
title:"AI Samples",
message:_4,
icon:"[SKIN]warn.png",
width:700,
isModal:true,
autoDraw:true,
showCloseButton:false,
buttons:_5,
$2485:"$2483",
buttonClick:function(_9,_10){
if(_9.name=="requestAccess"){
window.open(_6+"/company/contact.jsp?AIAR=true","_blank")}else if(_9.name=="learnAboutAI"){
window.open(_6+"/ai/","_blank")}else if(_9.name=="login"){
var _7=window.location.pathname+window.location.search,
_8=isc.URIBuilder.create(_7);
_8.setQueryParam("id",_2);
window.location.assign(_6+"/devlogin/login.jsp?initialTarget="+
encodeURIComponent(_8.uri))}else{
_3.jumpToExample("Welcome");
this.hide()}
}
})}
,isc.A.setAIAccess=function isc_FeatureExplorer_setAIAccess(_1,_2){
var _3=this;
this.hasAIAccess=_1;
if(!_1){
if(this.exampleTree){
this.exampleTree.disableAISamples()}
if(this.homeInterface){
this.homeInterface.disableAISamples()}
if(this.exampleViewer){
var _4=isc.params["AI"]=="true",
_5=this.exampleViewer.exampleConfig;
this.checkAIAccess(_5,_4,_2);
if(_2)this.aiAccessExtraData=_2}
}
isc.RPCManager.addClassMethods({
transformResponse:function(_9){
if(_9.status<0&&_9.data){
var _6=_9.data,
_7=_6&&_6.error,
_8=_7&&_7.message
;
if(_8&&_8.match(/AI authorization fail/i)){
_3.showAIDialog(_7)}
}
return _9}
})}
,isc.A.checkAIAccess=function isc_FeatureExplorer_checkAIAccess(_1,_2,_3){
if(this.hasAIAccess!=false)return;
var _4=_1?_1.id:"";
if(_4.startsWith("ai")||_2){
this.showAIDialog(_3)}
}
,isc.A.initWidget=function isc_FeatureExplorer_initWidget(){
this.Super("initWidget",arguments);
this.createChildren()}
,isc.A.createChildren=function isc_FeatureExplorer_createChildren(){
this.densityValueMap={};
for(var _1 in this.densityPresets){
this.densityValueMap[this.densityPresets[_1]]=_1}
var _2=this.useDesktopMode=isc.Browser.isDesktop;
this.applySkinSettings();
isc.DataSource.addProperties({firstGeneratedSequenceValue:1});
this.addAutoChildren(this.autoChildren);
var _3={
cellPadding:0,
showHeader:false,
leaveScrollbarGap:false,
selectionType:"single",
animateFolders:_2
};
this.addAutoChild("exampleTree",_3);
this.addAutoChild("toolStripSCVersion",{
height:_2?34:44
});
var _4=!_2;
this.addAutoChild("leftSuperPane",{
deviceMode:_2?"desktop":"handset",
showNavigationBar:!_2,
showDetailToolStrip:!_2,
navigationPane:this.leftPane,
detailPane:this.centerPane,
currentPane:"detail",
showResizeBar:isc.ExampleViewer.websiteMode
});
this.$142f();
if(isc.ExampleViewer.websiteMode){
this.addAutoChildren(["bottomPane","rightPane",
"smartGwtButtonBoxR","smartGwtButtonR",
"contactUsButtonBoxR","contactUsButtonR",
"freeTrialButtonBoxR","freeTrialButtonR",
"pricingButtonBoxR","pricingButtonR",
"learnMoreButtonBoxR","learnMoreButtonR",
"bottomPaneLeft","bottomPaneRight",
"freeTrialButtonB","pricingButtonB",
"smartGwtButtonPreB","smartGwtButtonB"])}
if(this.skinConfig){
var _5=isc.StyleSheetHandler.create();
_5.loadSkinStyleSheet();
_5.injectCssText(".darkDescription { background-color: "+this.skinConfig.settings["$standard_bgColor"]+"; color: "+this.skinConfig.settings["$standard_color"]+"}"
);
_5.injectCssText(".showcaseTileGrid { border-image: none; border-color: "+this.skinConfig.settings["$standard_border_color"]+"}"
);
_5.injectCssText(".simpleTile, .simpleTileOver, .simpleTileSelected, .simpleTileSelectedOver { background-image: none; border-width: 2px}")}
this.exampleDescription=this.createAutoChild("exampleDescription",{
height:92
});
this.exampleViewer=this.createAutoChild("exampleViewer");
var _6={
ID:"section_exampleDescription",
canCollapse:_4,expanded:!_4,
title:"&nbsp;",
items:[this.exampleDescription]
};
this.examplePage.addSection(_6);
this.examplePage.addSection({ID:"section_exampleViewer",canCollapse:false,expanded:true,showHeader:false,hidden:true,items:[this.exampleViewer]});
this.gridSearch.setGrid(this.exampleTree);
if(this.treeData){
if(!this.showAISamples()){
var _7=this.treeData.findAll({fieldName:"id",operator:"startsWith",value:"ai"});
this.exampleTree.listAISamples=_7;
if(_7)this.treeData.removeList(_7)}else{
isc.AI.disabled=false}
this.exampleTree.setData(this.treeData)}
this.centerPane.setHeight("100%");
if(isc.ExampleViewer.websiteMode){
this.rightPane.hide();
this.bottomPane.hide();
this.rightPane.visibilityChanged=this.rightPaneVisibilityChanged}
isc.History.registerCallback({method:this.historyCallback,target:this});
isc.Page.setEvent(isc.Page.isLoaded()?"idle":"load",this.getID()+".autoJumpToExample()",
isc.Page.FIRE_ONCE);
isc.Page.setEvent("resize",this.getID()+".pageResized()");
if(!_4&&isc.Log.hasFireBug()){
var _8=isc.Window.create({
width:"100%",
height:80,
showHeaderIcon:false,
redrawOnResize:true,
title:"Firebug Detected",
items:[
isc.Label.create({
width:"100%",
height:50,
valign:"center",
align:"center",
contents:"<P style='clear: both; border: 2px solid red; padding: 5px; -moz-border-radius: 4px; border-radius: 4px;'>Firebug greatly slows the performance of applications that use large JavaScript files.  Isomorphic highly recommends Firebug for troubleshooting, but Firebug and other development tools should be disabled when assessing the real-world performance of SmartClient applications.</P>"
})
]
});
this.addMember(_8)}
if(isc.VoiceAssist){
isc.VoiceAssist.masterComponent=this}
}
,isc.A.getMediaSkin=function isc_FeatureExplorer_getMediaSkin(_1){
var _2=isc.getCurrentSkin();
var _3=_2&&_2.showcaseMediaSkin;
return _3||_1}
,isc.A.applySkinSettings=function isc_FeatureExplorer_applySkinSettings(){
var _1=isc.ExampleViewer.getSkin();
var _2=this.skinConfig;
if(_2){
this.setBackgroundColor(_2.settings["$standard_bgColor"]||"white")}else{
if(isc.currentSkin){
if(isc.currentSkin.backgroundColor){
this.setBackgroundColor(isc.currentSkin.backgroundColor)}else{
var _3=window.getComputedStyle(document.body);
if(_3.backgroundColor)this.setBackgroundColor(_3.backgroundColor)}
}
}
var _4=this.getMediaSkin(_1);
if(_4!=_1){
isc.Page.setIsomorphicDocsSkinDir("skin/"+_4+"/");
isc.Page.setSampleImgDir(isc.Page.getIsomorphicDocsDir()+"exampleImages/"+_4+"/")}
isc.Page.setSampleThumbnailDir(isc.Page.getIsomorphicDocsDir()+"skin/images/thumbnails/");
isc.Page.setSamplePhotoDir(isc.Page.getIsomorphicDocsDir()+"exampleImages/stockPhotos/");
var _5=isc.ExampleViewer.installSkinCustomizations();
if(_5=="no-op"){
isc.FeatureExplorer.changeDefaults("exampleTreeDefaults",{
showConnectors:this.currentSizeIncrease>=5?false:isc.Browser.isDesktop
});
isc.FeatureExplorer.changeDefaults("homeInterfaceDefaults",{
layoutTopMargin:this.useDesktopMode?5:0,
layoutRightMargin:this.useDesktopMode?10:0,
layoutLeftMargin:this.useDesktopMode?10:0,
layoutBottomMargin:this.useDesktopMode?5:0
});
if(this.useDesktopMode){
isc.HomeInterface.changeDefaults("customTileGridDefaults",{
tileWidth:144,tileHeight:134,
styleName:"showcaseTileGrid"
})}else{
isc.HomeInterface.changeDefaults("customTileGridDefaults",{
tileWidth:70,tileHeight:100
})}
if(!isc.Browser.isIE||isc.Browser.isIE9){
isc.HomeInterface.changeDefaults("searchFieldDefaults",{
textBoxStyle:"explorerSearchItem"
})}
isc.Page.setAppImgDir(isc.Page.getIsomorphicDocsDir()+"exampleImages/")}
}
,isc.A.rightPaneVisibilityChanged=function isc_FeatureExplorer_rightPaneVisibilityChanged(_1){
if(_1){
this.parentElement.setHeight("100%");
this.parentElement.parentElement.bottomPane.hide()}else{
this.parentElement.setHeight(
this.parentElement.getHeight()-this.parentElement.parentElement.bottomPane.getHeight());
this.parentElement.parentElement.bottomPane.show()}
}
,isc.A.configureWebsiteMode=function isc_FeatureExplorer_configureWebsiteMode(){
if(isc.Page.getWidth()<1050){
this.rightPane.hide();
this.bottomPane.show()}else{
this.rightPane.show();
this.bottomPane.hide()}
}
,isc.A.pageResized=function isc_FeatureExplorer_pageResized(){
if(isc.ExampleViewer.websiteMode){
this.configureWebsiteMode();
if(this.bottomPane.isVisible()){
this.topPane.setHeight("100%")}
}
}
,isc.A.draw=function isc_FeatureExplorer_draw(){
this.Super("draw",arguments);
if(isc.ExampleViewer.websiteMode){
this.configureWebsiteMode()}
return this}
,isc.A.historyCallback=function isc_FeatureExplorer_historyCallback(_1,_2){
this.jumpToExample(_1,true);
this.noAutoJumpToExample=true}
,isc.A.autoJumpToExample=function isc_FeatureExplorer_autoJumpToExample(){
if(!this.noAutoJumpToExample){
this.jumpToExample(isc.History.getCurrentHistoryId()||this.initialExample,true)}
}
,isc.A.jumpToExample=function isc_FeatureExplorer_jumpToExample(_1,_2){
if(this.exampleViewer&&this.exampleViewer.fullScreenExampleWindow!=null
&&this.exampleViewer.fullScreenExampleWindow.isDrawn()){
this.exampleViewer.hideFullScreenExample()}
if(_1==null)_1=this.initialExample;
_1=_1.replace(/\./g," ");
_1=_1.replace(/\|/g,"_");
var _3=this.exampleTree.data;
var _4=_3.getExampleNode(_1);
if(_4==null){
this.logWarn("Can't find example for id: "+_1+" - defaulting to the welcome page");
_4=_3.findById(this.initialExample);
if(_4==null){
_4=_3.find(this.initialExample)}
if(_4==null)return}
this.showExample(_4,_2,true);
_3.openFolders(_3.getParents(_4));
var _5=_3.indexOf(_4);
var _6=this;
isc.Timer.setTimeout(function(){
_6.exampleTree.selectionManager.deselectAll();
_6.exampleTree.selectRecord(_5);
_6.exampleTree.scrollRecordIntoView(_5)},0)}
,isc.A.formatFolderList=function isc_FeatureExplorer_formatFolderList(_1){
var _2=this.exampleTree;
var _3=_2.data;
var _4=_3.getChildren(_1);
if(!_4||_4.isEmpty())return isc.emptyString;
var _5=isc.StringBuffer.create();
_5.append("<table class='explorerFolderList' align='center' cellspacing='5' cellpadding='",
(isc.Browser.isDesktop?2:0),"' style='table-layout:fixed",
(isc.Browser.isIE&&isc.Browser.version<=7?";width:80%":null),
";clear:both'><colgroup>",
(isc.Browser.isDesktop?"<col width='45%'><col width='10%'><col width='45%'>"
:"<col width='50%'><col width='50%'>"),
"</colgroup><tbody>");
var _6=[];
var _7=Math.round(_4.getLength()/2);
var _8=0;
var _9=_7;
for(var i=0;i<_7;i++){
var _11=_4.getCachedRow(_8++),
_12=_4.getCachedRow(_9++);
_5.append("<tr>");
this.$49j(_11,_5);
if(isc.Browser.isDesktop)_5.append("<td>&nbsp;</td>");
this.$49j(_12,_5);
_5.append("</tr>")}
_5.append("</tbody></table>");
return _5.release(false)}
,isc.A.$49j=function isc_FeatureExplorer__htmlForCell(_1,_2){
var _3=this.exampleTree;
var _4=_3.data;
if(!_1){
_2.append("<td>&nbsp;</td>");
return}
var _5=_4.isFolder(_1)?"[ISO_DOCS_SKIN]/images/explorerTree/folder_closed.png"
:"[ISO_DOCS_SKIN]/images/explorerTree/gears.png";
_5=isc.Page.getURL(_5);
_2.append("<td>",isc.Canvas.imgHTML(_5,16,16),
"&nbsp;<a class='linkText' href='' onclick='",this.getID(),".jumpToExample(\"",
this.genExampleId(_1),"\");return false;'>",_4.getTitle(_1),
"</a></td>")}
,isc.A.genExampleId=function isc_FeatureExplorer_genExampleId(_1){
var _2=this.exampleTree.data.getPath(_1),
_3=_1.id!=null?_1.id:
_1.ref!=null?_1.ref:_2
;
return _3.replace(/ /g,".")}
,isc.A.hideCenterPane=function isc_FeatureExplorer_hideCenterPane(){
this.centerPane.hide()}
,isc.A.clearState=function isc_FeatureExplorer_clearState(){
delete this.currentExampleConfig}
,isc.A.$142f=function isc_FeatureExplorer__updateMiniNavControl(){
var _1=this.leftSuperPane,
_2=_1.navigationBar;
if(_2!=null&&_2.customNavControl==null){
var _3=_2.miniNavControl,
_4=isc.StatefulCanvas.STATE_UP,
_5=isc.StatefulCanvas.STATE_UP;
var _6=this.exampleTree&&this.exampleTree.data,
_7=this.currentExampleConfig,
_8,
_9;
if(_7==null||
_6==null||
(_8=_6.getParent(_7))==null||
(_9=_6.getChildren(_8))==null)
{
_4=_5=isc.StatefulCanvas.STATE_DISABLED}else{
var _10=_9.indexOf(_7);
if(_10<=0){
_4=isc.StatefulCanvas.STATE_DISABLED}
if(_9.getLength()-1<=_10){
_5=isc.StatefulCanvas.STATE_DISABLED}
}
_3.setState(_4,_3.$74f);
_3.setState(_5,_3.$74g)}
}
,isc.A.$159z=function isc_FeatureExplorer__goToPreviousExample(){
var _1=this.currentExampleConfig;
var _2=this.exampleTree&&this.exampleTree.data,
_3,
_4;
if(_2!=null&&
(_3=_2.getParent(_1))!=null&&
(_4=_2.getChildren(_3))!=null)
{
var _5=_4.indexOf(_1);
var _6=_4.get(_5-1);
this.showExample(_6,null,true)}
}
);
isc.evalBoundary;isc.B.push(isc.A.$142e=function isc_FeatureExplorer__goToNextExample(){
var _1=this.currentExampleConfig;
var _2=this.exampleTree&&this.exampleTree.data,
_3,
_4;
if(_2!=null&&
(_3=_2.getParent(_1))!=null&&
(_4=_2.getChildren(_3))!=null)
{
var _5=_4.indexOf(_1);
var _6=_4.get(_5+1);
this.showExample(_6,null,true)}
}
,isc.A.showExample=function isc_FeatureExplorer_showExample(_1,_2,_3,_4){
if(_1==null)_1=this.currentExampleConfig;
if(_3&&_1){
var _5=this.gridSearch;
_5.revertState();
_5.showNode(_1)}
if(this.exampleTree.data.isFolder(_1))_1.titlePage="true";
var _6=this.genExampleId(_1);
if(!_2)isc.History.addHistoryEntry(_6);
this.currentExampleConfig=_1;
this.$142f();
if(_1.ref){
var _7=this.exampleTree.data.findById(_1.ref);
if(_7!=null){
var _8=_1.id,
_9=_1.description,
_10=_1.title,
_11=_1.requiresModules,
_12=_1.ref;
_7=this.exampleTree.data.getCleanNodeData(_7);
isc.addProperties(_1,_7);
_1.id=_8;
if(_9)_1.description=_9;
if(_10)_1.title=_10;
if(_12)_1.ref=_12;
if(_11)_1.requiresModules=_11}else{
this.logWarn("Couldn't find example by id for ref: "+_1.ref)}
_1.ref=null}
if(window.useAnalytics&&window.ga){
var _6=this.genExampleId(_1);
if(_6!=null)_6=_6.replaceAll("|",".");
var _13="/fe/"+encodeURIComponent(_6);
this.logDebug("tracking: "+_13);
window.ga('send','pageview',{page:_13});
if(window.google_trackConversion){
window.google_trackConversion({
google_conversion_id:1063035128,
google_custom_params:{
action:"fe",
example:_6,
random:new Date().getTime()
},
google_remarketing_only:true
})}
}
var _14=isc.currentSkin?isc.currentSkin.name:null;
_14=_14||isc.ExampleViewer.getSkin();
if(_1.bestSkin!=null&&_14!=_1.bestSkin&&
(_1.badSkins==null||_1.badSkins.contains(_14)))
{
isc.warn("This example is best viewed in the "+_1.bestSkin+" skin.",
this.getID()+".exampleViewer.setSkin('"+_1.bestSkin+"');"
);
return}
if(this.homeInterfacePage.getSections().length!=1){
var _15=this.homeInterface=this.createAutoChild("homeInterface",{
featureExplorer:this
});
this.gridSearch.getField("search").featureExplorer=this;
var _16={
expanded:true,
canCollapse:false,
title:"Home",
items:[_15]
};
this.homeInterfacePage.addSection(_16)}
if(_1.titlePage=="true"){
this.examplePage.hide();
var _17=this.titlePage.titlePagePane;
if(_1.id=="Welcome"){
}else if(!this.useDesktopMode){
_17.titlePageHeader.hide();
_17.copyrightFooter.hide()}else{
_17.titlePageHeader.setContents(_1.title||_1.name);
_17.titlePageHeader.show();
_17.copyrightFooter.hide()}
var _18=(_1.description==null?"":
_1.description.evalDynamicString());
_18+=this.formatFolderList(_1);
if(_1.id!="Welcome"){
_17.screenshot.hide();
if(_1.screenshot){
_18+="<center>"+
_17.screenshot.imgHTML(_1.screenshot,
_1.screenshotWidth,_1.screenshotHeight)+
"</center>"}
_17.folderList.setContents(_18);
this.titlePage.show();
this.homeInterfacePage.hide()}else{
this.titlePage.hide();
this.homeInterfacePage.show()}
}else{
this.titlePage.hide();
this.homeInterfacePage.hide();
this.examplePage.hideSection("section_exampleViewer");
this.examplePage.show();
this.examplePage.setSectionTitle("section_exampleDescription",
this.leftSuperPane.deviceMode=="handset"?
"Description &amp; Instructions":
_1.title||_1.name);
if(this.descriptionHeight)this.exampleDescription.setHeight(this.descriptionHeight);
var _19=[];
for(var i=0;i<this.exampleChecks.length;i++){
var _21=this.exampleChecks[i];
var _22=_1[_21.flag];
if(_22!=null&&!_21.test(_1)){
var _23=_22;
if(_23=="true")_23=_21.message;
_23=isc.isA.Function(_23)?_23(_1):_23;
_19.add(_23)}
}
var _11=_1.requiresModules,
_24=_11?_11.indexOf("SCServer")>=0:false,
_25="",
_26=isc.hasOptionalModules("SCServer"),
_27=isc.licenseType=="Eval"
;
var _28="",
_29="",
_30="";
if(_11){
var _31=_11.split(","),
_32=/^\s+/,
_33=/\s+$/;
for(i=0;i<_31.length;i++){
var _34=_31[i].replace(_32,"").replace(_33,""),
_35=isc.getOptionalModule(_34),
_36=isc.hasOptionalModule(_34);
if(_35.isPro)continue;
if(_34=="Calendar"||_34=="Drawing"){
if(_36)continue}
if(_35.isFeature){
if(_28.length>0)_28+=", ";
_28+=_35.name}else{
if(_29.length>0)_29+=", ";
_29+=_35.name;
if(!_36){
if(_30.length>0)_30+=", ";
_30+=_35.name}
}
}
var _37=_29.lastIndexOf(", ");
if(_37>=0)_29=_29.substr(0,_37)+" and "+
_29.substring(_37+2);
_37=_28.lastIndexOf(", ");
if(_37>=0)_28=_28.substr(0,_37)+" and "+
_28.substring(_37+2);
_37=_30.lastIndexOf(", ");
if(_37>=0)_30=_30.substr(0,_37)+" and "+
_30.substring(_37+2)}
var _38=
((_24&&!_26)||(!_27&&_28.length>0));
if(_38){
_23="This example is disabled in this SDK because it requires ";
if(_24&&!_26){
_23+="<a class='linkText' href='"+isc.licensingPage+
"' target=_blank>SmartClient Pro Edition</a>"}
if(!_27&&_28.length>0){
if(_24&&!_26)_23+=" and ";
_23+="the following features from SmartClient Power Edition: <a class='linkText' href='"+
isc.licensingPage+"' target=_blank>"+_28+"</a>"}
_19.add(_23)}
if(_30.length>0){
if(_38){
_23="This example also "}else{
_23="This example is disabled in this SDK because it "}
_19.add(_23+"requires the  following optional SmartClient components: <a class='linkText' href='"+
isc.licensingPage+"' target=_blank>"+
_30+"</a>")}
if(_19.length>0){
var _39="https://www.smartclient.com/smartclient";
if(_1.beta)_39+="-latest";
_39+="/showcase/#";
_19.add("<p>Click <a class='linkText' target=_blank href='"+_39+
_1.id+"'>here</a> to see this example on smartclient.com.")}
var _40=isc.StringBuffer.create(),
_41=this.exampleViewer
;
if(_19.length>0){
_41.hide();
_40.append("<div class='explorerCheckErrorMessage'>");
for(var i=0;i<_19.length;i++){
_40.append(_19[i],"<BR><BR>")}
_40.append("</div>");
_40.append(_1.description);
this.exampleDescription.setContents(_40.release(false));
this.exampleDescription.setHeight("*");
return}
if(_41.$2570(_1)&&_1.react=="showJS"){
_40.append(_41.$251u)}
var _42=_1.descriptionHeight;
_40.append(_1.description);
var _43="";
if(_1.parentId&&_1.parentId=="aiSamplesFE"){
_43="<br><br><span style='color: red;font-size:11px;font-weight: 700;'>BETA</span> : This sample demonstrates features available in the <b>SmartClient AI Module</b>."}else if(_1.beta){
_43="<br><br><span style='color: red;font-size:11px;font-weight: 700;'>BETA</span> : This sample demonstrates features available in the <a class='linkText' href=\"http://www.smartclient.com/product/downloadOtherReleases.jsp#nextVersion\" target=\"_blank\"> next available version</a> of SmartClient, "+isc.HomeInterface.getPreReleaseVersion()+"."}
_40.append(_43);
this.exampleDescription.setContents(_40.release(false));
if(_1.url||_1.jsURL||_1.xmlURL){
_41.loadExample(_1);
this.exampleDescription.setHeight(_42||92);
this.exampleDescription.setVAlign("center")}else{
_41.hide();
this.exampleDescription.setHeight("*")}
}
this.leftSuperPane.showDetailPane(_1.title,null,_4)}
);
isc.B._maxIndex=isc.C+28;
isc.defineClass("ExampleTree","Tree");
isc.A=isc.ExampleTree.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.nameProperty="title";
isc.A.pathDelim="_";
isc.A.aliases={};
isc.A.currentReleaseVersion=isc.scVersionNumber;
isc.B.push(isc.A.getExampleNode=function isc_ExampleTree_getExampleNode(_1){
var _2=_1.startsWith(this.pathDelim)?this.find(_1):this.findById(_1);
if(_2==null&&this.aliases[_1])_2=this.findById(this.aliases[_1]);
if(_2==null&&_1.endsWith("NewSample")){
_2=this.getExampleNode(_1.substring(0,_1.indexOf("NewSample")))}
return _2}
,isc.A.isSampleNodeVisible=function isc_ExampleTree_isSampleNodeVisible(_1){
var _2=_1.visibility;
if(_2==null)return true;
var _3=this.nodeVisibility;
return isc.isA.String(_3)?_3==_2:
_3.indexOf(_2)>=0}
,isc.A.prepareMobileSamples=function isc_ExampleTree_prepareMobileSamples(){
var _1=this,
_2=1;
var _3="FSMobileSamples",
_4=this.findById(_3);
if(_4){
var _5=this.getDescendants(_4).reverse();
_5.map(function(_6){
if(_6.version>=isc.scParityStableVersionNumber){
_1.getParent(_6).version=isc.scParityStableVersionNumber}
if(_1.isFolder(_6)){
if(!_6.id)_6.id="MobileSampleFolder"+_2++}
})}
return _4}
,isc.A.disableAISamples=function isc_ExampleTree_disableAISamples(_1){
var _2=_1.recordEnabledProperty;
var _3="aiSamplesFE",
_4=this.findById(_3);
if(_4){
var _5=this.getDescendants(_4).reverse();
_5.map(function(_6){
_6[_2]=false})}
return _4}
,isc.A.init=function isc_ExampleTree_init(){
this.Super("init",arguments);
var _1=this.getDescendants(this.root);
var _2={},
_3={},
_4=this.findById("newSamples"),
_5=this.findById("newSamplesFE"),
_6=this.prepareMobileSamples();
if(_4)_4.title+=" in "+isc.scVersionNumber;
if(_5)_5.title+=" in "+isc.scVersionNumber;
for(var i=0;i<_1.length;i++){
var _8=_1[i];
if(_8.requiresModules){
if(!isc.hasOptionalModules(_8.requiresModules));
_8.missingModules=isc.getMissingModules(_8.requiresModules).getProperty("name").join(", ")}
if((_8.id=="customExpansionComponent")&&isc.Browser.isHandset)_8.fullScreen="true";
if(!_8.id&&(_8.title.contains(".")||_8.title.contains("_"))){
this.logWarn("Node title: "+_8.title+" contains invalid char '.' or '_'")}
if(_8.id&&(_8.id.contains(".")||_8.id.contains("_"))){
this.logWarn("Node id: "+_8.id+" (titled: "+_8.title+
") contains invalid char '.' or '_'")}
if(_8.id&&_3[_8.id]){
this.logWarn("Duplicate id detected on node titled: "+_8.title
+" id: "+_8.id
+" conflicts with previously encountered node titled: "
+_3[_8.id])}else if(_8.id){
_3[_8.id]=_8.title}
if(_8.visibility!=null&&!this.isSampleNodeVisible(_8)){
this.remove(_8,true);
continue}
if((_8.id&&_8.id=="aiSamplesFE")||(_8.parentId&&_8.parentId=="aiSamplesFE")){
_8.title+="<sup style='color: red;font-size:10px;font-weight: 700;'> BETA</sup>";
_8.beta=true;
this.hasBetaSamples=true}else if(_8.version){
if(parseFloat(_8.version)>parseFloat(isc.scVersionNumber)){
_8.title+="<sup style='color: red;font-size:10px;font-weight: 700;'> BETA</sup>";
_8.beta=true;
this.hasBetaSamples=true}else if(parseFloat(_8.version)==parseFloat(isc.scVersionNumber)){
if(_8.version+"d"==isc.scVersion){
_8.title+=
"<sup style='color: red;font-size:10px;font-weight: 700;'> BETA</sup>";
_8.beta=true;
this.hasBetaSamples=true}else{
_8.isNewSample=true}
if(_8.ref==null){
var _9=this.getParent(_8).id||"$158c";
if(!_9.endsWith("NewSample")){
var _10=_8.id+"NewSample",
_11=_2[_9+"NewSample"];
var _12=this.isFolder(_8),
_13={title:_8.title,id:_10,icon:_8.icon,
newSample:true,description:_8.description,
ref:_12?null:_8.id};
if(_12)_2[_10]=_13;
this.add(_13,_11!=null?_11:
_4)}
}
}
}
var _14=_8.aliases?_8.aliases.split(/\s*,(?:\s*)/):[];
for(var j=0;j<_14.length;j++)this.aliases[_14[j]]=_8.id}
for(var i=0;i<_1.length;i++){
var _8=_1[i];
if(!_8.ref)continue;
var _16=this.findById(_8.ref);
if(!_16){
this.logWarn("The node titled '"+this.getTitle(_8)
+"' references a non-existant id: "+_8.ref)}
if(!this.isFolder(_16))continue;
var _17=this.getChildren(_16);
if(!_17||_17.isEmpty())continue;
var _18=this.getCleanNodeData(_17,true,true);
if(!this.isFolder(_8))this.convertToFolder(_8);
this.addList(_18,_8);
delete _8.ref;
if(!_8.description)_8.description=_16.description}
for(var _19 in _2){
var _20=_2[_19];
if(!this.hasChildren(_20)){
this.remove(_20);
delete _2[_19]}
}
if(_6!=null){
var _21=this.findById(_6.id+"NewSample");
if(_21)this.move(_21,_4)}
}
);
isc.B._maxIndex=isc.C+5;
isc.defineClass("ExplorerShell","VLayout");
isc.A=isc.ExplorerShell.getPrototype();
isc.A.membersMargin=5;
isc.A.headerDefaults={
_constructor:"Canvas",
height:45,
contents:isc.Canvas.imgHTML("[ISO_DOCS_SKIN]/images/featureExplorer_title.gif")
};
isc.A.footerDefaults={
_constructor:"Label",
height:15,
overflow:"hidden",
align:"right",
contents:"<span style='color:#E0E0E0'>&copy;2000-2005 Isomorphic Software, Inc.</span>"
};
isc.A.featureExplorerDefaults={
_constructor:"FeatureExplorer"
};
isc.A.autoChildren=["header","featureExplorer","footer"]
;
isc.defineClass("GridSearch","DynamicForm");
isc.A=isc.GridSearch.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.browserSpellCheck=false;
isc.A.height=20;
isc.A.numCols=2;
isc.A.colWidths=[46,"*"];
isc.A.titleSuffix=":&nbsp;";
isc.A.cellPadding=0;
isc.A.showSearchTitle=false;
isc.A.wrapItemTitles=false;
isc.A.selectOnFocus=true;
isc.A.hint="Find...";
isc.A.searchTitle="Search examples";
isc.B.push(isc.A.initWidget=function isc_GridSearch_initWidget(){
var _1=isc.addProperties({},this.searchItemProperties,{
name:"search",width:"*",colSpan:"*",showTitle:this.showSearchTitle,
browserAutoCorrect:false,
featureExplorer:null,
selectOnFocus:true,
title:this.searchTitle,showHintInField:true,hint:this.hint,
changed:"form.findNode()",
keyPress:function(_4,_5,_6){
if(_6=="Enter"){
if(isc.EH.shiftKeyDown()){
_5.findNode();
return false}
_4.blurItem();
var _2=this.featureExplorer,
_3=_2.homeInterfacePage.getMember(1).children[0];
_2.showExample(_2.exampleTree.data.findById("Welcome"));
_3.setValue("search",_4.getValue());
if(_2.useDesktopMode){
_3.focusInItem(_3.getField("search"))}
_3.showTiles(_4.getValue(),null)}else if(_6=="Escape"){
_5.revertState();
return false}
}
});
this.items=[_1];
this.Super("initWidget",arguments);
this.searchItem=this.getItem("search");
if(this.grid)this.setGrid(this.grid)}
,isc.A.setGrid=function isc_GridSearch_setGrid(_1){
this.grid=_1;
this.defaultSearchProperty();
if(isc.isA.TreeGrid(_1)){
if(_1.$84w)_1.getNodeTitle=_1.$84w;
_1.$84w=_1.getNodeTitle;
_1.getNodeTitle=function(_5,_6,_7){
var _2=_1.$84w(_5,_6,_7);
if(_5.$826){
var _3,_4;
if(_2.match(/<.*>/)){
_4=new RegExp("(^|>)([^<]*?)("+_5.$826+")","ig");
_3=_2.replace(_4,"$1$2<span style='background-color:#00B2FA;'>$3</span>")}else{
_4=new RegExp("("+_5.$826+")","ig");
_3=_2.replace(_4,"<span style='background-color:#00B2FA;'>$1</span>")}
_2=_3}
return _2}}else{
if(_1.$84x){
_1.formatCellValue=_1.$84x}
_1.formatCellValue=function(_2,_5,_6,_7){
if(_1.$84x){
_2=_1.$84x(_2,_5,_6,_7)}
if(_2!=null&&_5.$826){
var _3,_4;
if(_2.match(/<.*>/)){
_4=new RegExp("(^|>)([^<]*?)("+_5.$826+")","ig");
_3=_2.replace(_4,"$1$2<span style='background-color:#FF0000;'>$3</span>")}else{
_4=new RegExp("("+_5.$826+")","ig");
_3=_2.replace(_4,"<span style='background-color:#FF0000;'>$1</span>")}
_2=_3}
return _2}}
}
,isc.A.defaultSearchProperty=function isc_GridSearch_defaultSearchProperty(){
if(!this.searchProperty&&this.grid){
if(isc.isA.TreeGrid(this.grid)){
this.searchProperty=this.grid.getTitleField()}else{
this.searchProperty=this.grid.getFieldName(0)}
}
}
,isc.A.revertState=function isc_GridSearch_revertState(_1){
var _2=this.grid;
if(!_1){
if(this.$49d){
delete this.$49d.$826;
_2.refreshRow(_2.getRecordIndex(this.$49d))}
this.$49c=this.$49d=null;
this.clearValue("search")}
if(this.$827){
for(var i=0;i<this.$827.length;i++){
_2.data.closeFolder(this.$827[i])}
}
this.$827=null}
,isc.A.showNode=function isc_GridSearch_showNode(_1,_2){
var _3=this.grid;
if(!isc.isA.TreeGrid(_3))return;
if(_2)this.$827=[];
var _4=_3.data.getParents(_1);
for(var i=0;i<_4.length;i++){
var _6=_4[i];
if(!_3.data.isOpen(_6)){
if(_2)this.$827.add(_6);
_3.data.openFolder(_6)}
}
if(_3.data.isFolder(_1)&&!_3.data.isOpen(_1)){
if(_2)this.$827.add(_1);
_3.data.openFolder(_1)}
}
,isc.A.findNode=function isc_GridSearch_findNode(){
if(!this.grid||!this.grid.getData())return;
var _1=this.getValue("search");
if(_1==null){
this.revertState();
return}
_1=_1.toLowerCase();
var _2=this.$49c==_1&&this.$49d;
this.$49c=_1;
var _3=this.grid;
var _4=isc.isA.TreeGrid(_3)?_3.data.getAllNodes():_3.getData();
var _5=this.$49d?_4.indexOf(this.$49d):0;
if(_2)_5++;
if(this.$49d){
delete this.$49d.$826;
_3.refreshRow(_3.getRecordIndex(this.$49d));
this.$49d=null}
var _6=this.findNext(_4,_5,_1);
if(!_6)_6=this.findNext(_4,0,_1);
if(_6){
this.$49d=_6;
_6.$826=_1;
this.revertState(true);
this.showNode(_6,true);
var _7=_3.getRecordIndex(_6);
_3.refreshRow(_7);
_3.scrollRecordIntoView(_7)}
}
,isc.A.findNext=function isc_GridSearch_findNext(_1,_2,_3){
for(var i=_2;i<_1.getLength();i++){
var _5=_1.get(i);
if(_5[this.searchProperty]&&_5[this.searchProperty].toLowerCase().contains(_3)){
return _5}
}
}
);
isc.B._maxIndex=isc.C+7;
isc.defineClass("ExampleViewerSectionHeader","SectionHeader");
isc.defineClass("FiltersForm","DynamicForm");
isc.A=isc.FiltersForm.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.styleName="showcaseFilterForm";
isc.A.autoFocus=false;
isc.A.fixedColWidths=true;
isc.A.sampleTreeData=null;
isc.A.customTileGrid=null;
isc.A.rankOfSamples={};
isc.A.considerForRanking=false;
isc.B.push(isc.A.itemChanged=function isc_FiltersForm_itemChanged(_1){
var _2=this.categoriesForm.getArrayCategories();
if(_1.isA("SliderItem")){
if(this.getField("search").getValue()!=null){
this.showTiles(this.getField("search").getValue(),null)}
else this.showTiles(null,_2)}
if(_1.name=="ascending"){
var _3=(this.getField("ascending")==null)?true:
this.getField("ascending").getValue();
this.customTileGrid.data.sortByProperty("title",_3)}
}
,isc.A.showTiles=function isc_FiltersForm_showTiles(_1,_2){
this.featureExplorer.exampleTree.selectionManager.deselectAll();
var _3=[];
var _4=(this.getField("noSamples")==null)?null:
this.getField("noSamples").getValue();
this.considerForRanking=isc.isA.nonemptyString(_1);
this.rankOfSamples={};
if(_1){
this.applyFilterAccordingToRanking(this.allSampleNodes,_3,_1)}else{
if(!_2)_2=this.categoriesForm.getArrayCategories();
for(var i=0;i<_2.length;i++){
if(_2[i]=="betaSamples"){
this.searchBetaSamples(this.allSampleNodes,_3,_1)}else if(_2[i]=="newSamples"){
this.searchNewSamples(this.allSampleNodes,_3,_1)}else{
var _6=this.sampleTreeData.find("id",_2[i]);
if(_6==null)continue;
var _7=this.sampleTreeData.getChildren(_6);
this.applyFilter(_7,_3,_1)}
}
}
var _8={};
_3=_3.filter(function(_10){
if(_8[_10.id]!=null||
(_10.id&&_10.id.indexOf("NewSample")!=-1))return false;
_8[_10.id]=_10;
return true});
var _9={};
_3=_3.filter(function(_10){
if(_10.ref==null)return true;
if(_8[_10.ref]!=null||
_9[_10.ref]!=null)return false;
_9[_10.ref]=_10;
return true});
if(_4!=null&&_3.length>=_4){
if(_1)_3.sortByProperty("position");
_3.length=_4}
this.customTileGrid.setData(_3);
if(this.considerForRanking)this.customTileGrid.data.sortByProperty("position",false)}
,isc.A.searchBetaSamples=function isc_FiltersForm_searchBetaSamples(_1,_2,_3,_4){
for(var i=0;i<_1.length;i++){
var _6=_1[i];
if(_6.title.indexOf("Featured")>-1)continue;
if(_6.beta)_2.push(_6)}
}
,isc.A.searchNewSamples=function isc_FiltersForm_searchNewSamples(_1,_2,_3,_4){
for(var i=0;i<_1.length;i++){
var _6=_1[i];
if(_6.title.indexOf("Featured")>-1)continue;
if(_6.isNewSample)_2.push(_6)}
}
,isc.A.applyFilterAccordingToRanking=function isc_FiltersForm_applyFilterAccordingToRanking(_1,_2,_3){
var _4=[];
var _5=_3.split(/\s+|,|\./);
for(var i=0;i<_5.length;i++){
if(_5[i].length==0)continue;
var _7=_5[i].replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");
_4.add(new RegExp("(^|\\s|>)?("+_7+")($|\\s|<)?","ig"))}
var _8=["Welcome","newSamples","main"],
_9={
title:10,
path:6,
description:2
};
for(var i=0;i<_1.length;i++){
var _10=_1[i];
if(this.sampleTreeData.hasChildren(_10)||this.sampleTreeData.isFolder(_10)||
_10.id===undefined||_10.id==null)
{
continue}
var _11={
title:_10.title,
path:"",
description:_10.description,
match:false
};
var _12=_10;
while((_12=_12._parent_exampleTree)){
if(_8.includes(_12.id))continue;
_11.path=_12.title+" "+_11.path}
for(var y=0;y<_4.length;y++){
var _14=_4[y];
for(var _15 in _9){
var _16=_11[_15];
if(!_16)continue;
var _17=_9[_15];
_14.lastIndex=0;
while(_14.exec(_16)!=null){
_10.position=this.rankSamples(_10.id,_17);
_11.match=true}
}
}
if(_11.match===true){
_2.push(_10)}
}
}
,isc.A.applyFilter=function isc_FiltersForm_applyFilter(_1,_2,_3,_4){
for(var i=0;i<_1.length;i++){
var _6=_1[i];
if(!this.sampleTreeData.hasChildren(_6)){
if(_3==null)_2.push(_6)}else if(!_4){
this.applyFilter(this.sampleTreeData.getChildren(_6),_2,_3,
_4)}
}
}
,isc.A.rankSamples=function isc_FiltersForm_rankSamples(_1,_2){
if(!this.considerForRanking)return 0;
if(this.rankOfSamples[_1]==null){
this.rankOfSamples[_1]=_2}else{
this.rankOfSamples[_1]=this.rankOfSamples[_1]+_2}
return this.rankOfSamples[_1]}
);
isc.B._maxIndex=isc.C+7;
isc.defineClass("CategoriesForm","DynamicForm");
isc.A=isc.CategoriesForm.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.styleName="showcaseFilterForm";
isc.A.border="0px";
isc.A.padding=0;
isc.A.autoFocus=false;
isc.A.fixedColWidths=true;
isc.B.push(isc.A.getArrayCategories=function isc_CategoriesForm_getArrayCategories(){
var _1=[];
if(!this.featureExplorer.useDesktopMode){
var _2=this.getField("categoriesItem").getValue()+",";
_1=_2.split(",")}else{
if(this.getField("Welcome").getValue())_1.push("Welcome");
if(this.getField("newSamples").getValue())_1.push("newSamples");
if(this.getField("gridsFolder").getValue())_1.push("gridsFolder");
if(this.getField("treesFolder").getValue())_1.push("treesFolder");
if(this.getField("cubeGrid").getValue())_1.push("cubeGrid");
if(this.getField("comboBoxAndFamily").getValue())_1.push("comboBoxAndFamily");
if(this.getField("formsFolder").getValue())_1.push("formsFolder");
if(this.getField("calendarsFolder").getValue())_1.push("calendarsFolder");
if(this.getField("layoutFolder").getValue())_1.push("layoutFolder");
if(this.getField("dataBindingFolder").getValue())_1.push("dataBindingFolder");
if(this.getField("dataIntegration").getValue())_1.push("dataIntegration");
if(this.getField("FSserverExamples").getValue())_1.push("FSserverExamples");
if(this.getField("serverValidation").getValue())_1.push("serverValidation");
if(this.getField("sqlFolder").getValue())_1.push("sqlFolder");
if(this.getField("hibernateBeansFolder").getValue())_1.push("hibernateBeansFolder");
if(this.getField("jpaFolder").getValue())_1.push("jpaFolder");
if(this.getField("transactionsFolder").getValue())_1.push("transactionsFolder");
if(this.getField("customDataSourcesFolder").getValue())_1.push("customDataSourcesFolder");
if(this.getField("exportFolder").getValue())_1.push("exportFolder");
if(this.getField("uploadDownloadFolder").getValue())_1.push("uploadDownloadFolder");
if(this.getField("realTimeMessagingFolder").getValue())_1.push("realTimeMessagingFolder");
if(this.getField("serverScriptingFolder").getValue())_1.push("serverScriptingFolder");
if(this.getField("chartingFolder").getValue())_1.push("chartingFolder");
if(this.getField("DDdragDropExamples").getValue())_1.push("DDdragDropExamples");
if(this.getField("controlFolder").getValue())_1.push("controlFolder");
if(this.getField("FSMobileSamples").getValue())_1.push("FSMobileSamples");
if(this.getField("basicsFolder").getValue())_1.push("basicsFolder");
if(this.getField("effectsFolder").getValue())_1.push("effectsFolder");
if(this.getField("drawingFolder").getValue())_1.push("drawingFolder");
if(this.getField("portal").getValue())_1.push("portal");
if(this.getField("applicationsFolder").getValue())_1.push("applicationsFolder");
if(this.getField("extendingFolder").getValue())_1.push("extendingFolder");
if(this.getField("betaSamples").getValue())_1.push("betaSamples")}
return _1}
,isc.A.itemChanged=function isc_CategoriesForm_itemChanged(_1){
var _2=this.filtersForm,
_3=this.getArrayCategories();
if(_1.isA("CheckboxItem")||(_1==this.getField("categoriesItem"))){
if(_2.getField("search").getValue()!=null){
_2.showTiles(_2.getField("search").getValue(),null)}
else _2.showTiles(null,_3)}
}
);
isc.B._maxIndex=isc.C+2;
isc.defineClass("BetaImg","Img");
isc.A=isc.BetaImg.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.src="[ISO_DOCS_SKIN]/images/beta.png";
isc.A.snapTo="TR";
isc.A.hoverStyle="hoverTreeGridCustom";
isc.A.showHover=true;
isc.A.canHover=true;
isc.A.filtersForm=null;
isc.B.push(isc.A.getHoverHTML=function isc_BetaImg_getHoverHTML(){
var _1="<div style=\"width:200px; margin-top:10px; margin-bottom:10px; margin-left:10px; margin-right:10px;\">";
return _1+
"<b>Sample Description</b>: "+this.filtersForm.getValue("description")+
"<br><br><span style='color: red;font-size:11px;font-weight: 700;'>BETA</span> : This sample demonstrates features available in the next available version of SmartClient, "+isc.HomeInterface.getPreReleaseVersion()+
".  To download a "+isc.HomeInterface.getPreReleaseVersion()+" SDK, click on \"Pre-release versions\" on the Download page.</div>"}
,isc.A.setFiltersForm=function isc_BetaImg_setFiltersForm(_1){
this.filtersForm=_1}
);
isc.B._maxIndex=isc.C+2;
isc.defineClass("CustomTile","SimpleTile");
isc.A=isc.CustomTile.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.contributeToRuleContext=false;
isc.A.baseStyle="simpleTile";
isc.A.customFormDefaults={
_constructor:"DynamicForm",
fixedColWidths:true,
overflow:"hidden",
numCols:1,
width:"100%",
height:"100%"
};
isc.A.betaImageDefaults={
_constructor:"BetaImg"
};
isc.A.thumbnailFieldDefaults={
name:"thumbnail",type:"StaticTextItem",align:"center",
showTitle:false,canEdit:false,showValueIconOnly:true,
cellStyle:"thumbnail",
valueIconRightPadding:0,
getValueIcon:function(_1){
return _1}
};
isc.A.titleFieldDefaults={
name:"title",type:"StaticTextItem",width:"*",
showTitle:false,canEdit:false,textAlign:"center",
clipValue:true,clipStaticValue:true,
wrap:true,
formatValue:function(_1,_2,_3,_4){
if(_2.shortTitle!=null)_1=_2.shortTitle;
var _5=new RegExp("\\s*<(sup|SUP)[^>]*>\\s*BETA\\s*</\\1[^>]*>|\\s*BETA","g");
_1=_1?_1.replace(_5,""):"";
return _1}
};
isc.A.descriptionFieldDefaults={
name:"description",type:"StaticTextItem",visible:false
};
isc.A.positionFieldDefaults={
name:"position",type:"StaticTextItem",visible:false
};
isc.B.push(isc.A.setValues=function isc_CustomTile_setValues(_1){
var _2;
if(_1.description==null&&_1.ref!=null){
var _3=this.featureExplorer.exampleTree.data.findById(_1.ref);
_2=_3.description}else{
_2=_1.description}
var _4=this.featureExplorer.exampleTree,
_5=_4.recordEnabledProperty;
this.setDisabled(_1[_5]==false);
var _6=_1.title,
_7=this.customForm;
var _8=_1.newSample?_1.ref:_1.id?_1.id:"blank";
_7.setValue("title",_6);
_7.setValue("shortTitle",_1.shortTitle);
_7.setValue("description",_2==null?"":_2),
_7.setValue("thumbnail","[SAMPLE_THUMBNAIL]"+_8+".png");
_7.setValue("position",_1.position);
var _9=this.betaImage;
_9.setFiltersForm(_7);
_9.name=_9.ID;
if((_1.id&&_1.id=="aiSamplesFE")||(_1.parentId&&_1.parentId=="aiSamplesFE")){
_9.getHoverHTML=function(){
var _10="<div style=\"width:200px; margin-top:10px; margin-bottom:10px; margin-left:10px; margin-right:10px;\">";
return _10+
"<b>Sample Description</b>: "+this.filtersForm.getValue("description")+
"<br><br><span style='color: red;font-size:11px;font-weight: 700;'>BETA</span> : This sample demonstrates features available in the <b>SmartClient AI Module</b>.</div>"}
}
if(_1.beta){
_9.show()}else{
_9.hide()}
if(this.getRecord()!=_1)this.$q7=true}
,isc.A.initWidget=function isc_CustomTile_initWidget(){
this.Super("initWidget",arguments);
var _1=this.featureExplorer.useDesktopMode;
var _2=_1?119:59,
_3=_1?89:44;
this.customForm=this.createAutoChild("customForm",{
itemHoverHTML:function(){
var _4=this.getValue("shortTitle")!=null||
this.getItem("title").valueClipped();
if(_4)return this.getValue("title");
return null},
fields:[
isc.addProperties({},this.thumbnailFieldDefaults,this.thumbnailFieldProperties,{
valueIconWidth:_2,
valueIconHeight:_3,
height:_3+(this.thumbnailFieldAddedHeight||0)
}),
isc.addProperties({},this.titleFieldDefaults,this.titleFieldProperties),
isc.addProperties({},this.descriptionFieldDefaults,this.descriptionFieldProperties),
isc.addProperties({},this.positionFieldDefaults,this.positionFieldProperties)
]
});
this.addChild(this.customForm);
var _5=this.betaImage=this.createAutoChild("betaImage",{
width:_2,
height:_3,
visibility:"hidden"
});
this.addChild(_5)}
);
isc.B._maxIndex=isc.C+2;
isc.defineClass("ExplorerCheckboxItem","CheckboxItem");
isc.A=isc.ExplorerCheckboxItem.getPrototype();
isc.A.showTitle=false;
isc.A.width=1
;
isc.defineClass("HomeInterface","VLayout");
isc.A=isc.HomeInterface;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getPreReleaseVersion=function isc_c_HomeInterface_getPreReleaseVersion(){
return isc.scVersionNumber}
);
isc.B._maxIndex=isc.C+1;
isc.A=isc.HomeInterface.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.membersMargin=5;
isc.A.closeIconSize=10;
isc.A.featureExplorer=null;
isc.A.filtersFormDefaults={
_constructor:"FiltersForm"
};
isc.A.categoriesFormDefaults={
_constructor:"CategoriesForm"
};
isc.A.searchFieldDefaults={
type:"text",
name:"search",
title:"Search",
titleAlign:"left",
width:"*",
titleAlign:"right",
titleStyle:"formTitle",
browserAutoCorrect:false,
changed:function(_1,_2,_3){
_2.doGridSearch(_1,_2,_3)},
doValueDictation:function(_1){
this.setValue(_1);
this.doGridSearch(this.form,this,_1)},
doGridSearch:function(_1,_2,_3){
var _4=_1.featureExplorer.gridSearch;
_4.revertState();
_4.setValue("search",_3);
_4.findNode();
if(!_1.pendingActionOnPause("tileSearch")){
_1.fireOnPause("tileSearch",function(){
_1.showTiles(_2.getValue(),null)})}
},
keyPress:function(_1,_2,_3,_4){
var _5=_1.getValue();
if(_5==null)return;
var _6=_2.featureExplorer.gridSearch;
if(_3=="Enter"&&_2.featureExplorer.useDesktopMode){
if(_6.getValue("search")==_5){
_6.findNode();
return false}
}
},
iconClick:function(_1,_2,_3){
if((_3.name=="search")&&(_2.getValue()!=null)){
_1.showTiles(_2.getValue(),null)}else{
_2.clearValue();
var _4=_1.categoriesForm;
_4.reset();
if(_4.getField("categoriesItem")==null){
_4.getField("Welcome").setValue(true);
_4.getField("newSamples").setValue(true);
_4.getField("betaSamples").setValue(true)}
var _5=["Welcome","newSamples","betaSamples"];
_1.showTiles(null,_5)}
},
iconHeight:22,iconWidth:18,iconHSpace:0,iconBaseStyle:"icon"
};
isc.A.tileDefaults={
};
isc.A.customTileGridDefaults={
_constructor:"TileGrid",
showEdges:false,
width:"100%",
height:"100%",
tileConstructor:"CustomTile",
autoFetchData:false,
animateChangeTile:true,
emptyMessage:"No samples match your criteria.",
featureExplorer:null,
homeInterfacePage:null,
valuesShowDown:false,
dataSource:isc.DataSource.create({
fields:[
{name:"id",primaryKey:true,hidden:true}
]
}),
recordClick:function(_1,_2,_3){
if((_1.featureExplorer.hasAIAccess==false)&&_3&&_3.id&&_3.id.startsWith("ai")){
_1.featureExplorer.showAIDialog(null,_3.id);
return}
this.homeInterfacePage.hide();
if(_3.id&&_3.id.startsWith("newSamplesFE")){
var _4="newSamples";
if(_3.id=="newSamplesFE131")_4="newSamples131";
var _5=this.featureExplorer,
_6=_5.exampleTree.data.findById(_4),
_7=_5.exampleTree.getRowNum(_6);
_5.exampleTree.deselectAllRecords();
_5.showExample(_6,null,true,"forward");
_5.exampleTree.selectRecord(_6);
_5.exampleTree.scrollToRow(_7)}else{
this.featureExplorer.showExample(_3,null,true,"forward");
var _8=this.featureExplorer.exampleTree.getRecordIndex(_3);
this.featureExplorer.exampleTree.deselectAllRecords();
this.featureExplorer.exampleTree.refreshRow(_8);
this.featureExplorer.exampleTree.scrollToRow(_8);
this.featureExplorer.exampleTree.selectRecord(_3)}
}
};
isc.B.push(isc.A.initWidget=function isc_HomeInterface_initWidget(){
this.Super("initWidget",arguments);
var _1=this.featureExplorer.useDesktopMode,
_2=this.featureExplorer.treeData.hasBetaSamples
;
var _3=[],
_4=[]
;
_4.push(isc.addProperties({},this.searchFieldDefaults,this.searchFieldProperties,{
colSpan:_1?2:1,
titleOrientation:_1?"left":"top",
icons:[{
name:"search",
inline:true,
imgOnly:true,
src:"[SKINIMG]actions/view.png",
width:16,
height:16,
showRTL:true,
hspace:5
},{
name:"clear",
inline:true,
imgOnly:true,
src:"[SKINIMG]actions/close.png",
width:this.closeIconSize,
height:this.closeIconSize,
hspace:3
}]
}));
_4.push({
type:"SpacerItem",width:1
});
if(_1){
isc.defineClass("RowSeparatorItem","StaticTextItem");
isc.RowSeparatorItem.addProperties({
startRow:true,endRow:true,colSpan:"*",
width:"*",height:5,
showTitle:false,
cellStyle:"rowSeparatorItem",
shouldSaveValue:false
});
_4.push({
title:"# of Samples",name:"noSamples",editorType:"SliderItem",
titleOrientation:"left",
minValue:1,maxValue:320,wrapTitle:false,
defaultValue:isc.Browser.isHandset?15:50,
height:50,
operator:"lessThan"
},{
type:"SpacerItem",width:1
},{
title:"Ascending",name:"ascending",editorType:"ExplorerCheckboxItem"
},{
editorType:"RowSeparatorItem"
});
_3.push(
{startRow:true,title:"Applications",name:"applicationsFolder"},
{title:"Basics",name:"basicsFolder"},
{title:"<span style=\"color:red;font-weight:700;\">BETA</span>",
name:"betaSamples",value:true,visible:_2},
{title:"Calendars",name:"calendarsFolder"},
{title:"Charting",name:"chartingFolder"},
{title:"ComboxBox &amp; Family",name:"comboBoxAndFamily"},
{title:"Control",name:"controlFolder"},
{title:"Cubes",name:"cubeGrid"},
{title:"Dashboards &amp; Tools",name:"portal"},
{title:"Data Binding",name:"dataBindingFolder"},
{title:"Data Integration",name:"dataIntegration"},
{title:"Drag &amp; Drop",name:"DDdragDropExamples"},
{title:"Drawing",name:"drawingFolder"},
{title:"Effects",name:"effectsFolder"},
{title:"Extending",name:"extendingFolder"},
{title:"Featured Samples",name:"Welcome",value:true},
{title:"Forms",name:"formsFolder"},
{title:"Grids",name:"gridsFolder"},
{title:"Layout",name:"layoutFolder"},
{title:"Mobile Samples",name:"FSMobileSamples"},
{title:"New Samples",name:"newSamples",value:true},
{title:"Server Custom DataSources",name:"customDataSourcesFolder"},
{title:"Server Examples",name:"FSserverExamples"},
{title:"Server Export",name:"exportFolder"},
{title:"Server Hibernate / Beans",name:"hibernateBeansFolder"},
{title:"Server JPA",name:"jpaFolder"},
{title:"Server Real-Time Messaging",name:"realTimeMessagingFolder"},
{title:"Server Scripting",name:"serverScriptingFolder"},
{title:"Server SQL",name:"sqlFolder"},
{title:"Server Transactions",name:"transactionsFolder"},
{title:"Server Upload / Download",name:"uploadDownloadFolder"},
{title:"Server Validation",name:"serverValidation"},
{title:"Trees",name:"treesFolder"}
);
_3.map(function(_6){_6.editorType="ExplorerCheckboxItem"})}else{
_3.push({
name:"categoriesItem",
title:"Categories",
type:"select",
titleOrientation:"top",
multiple:true,colSpan:1,
multipleAppearance:"picklist",
defaultValue:["Welcome","newSamples","betaSamples"],
valueMap:{
"applicationsFolder":"Applications",
"basicsFolder":"Basics",
"betaSamples":"<span style=\"color:red;font-weight:700;\">BETA</span>",
"calendarsFolder":"Calendars",
"chartingFolder":"Charting",
"comboBoxAndFamily":"ComboxBox &amp; Family",
"controlFolder":"Control",
"cubeGrid":"Cubes",
"portal":"Dashboards &amp; Tools",
"dataBindingFolder":"Data Binding",
"dataIntegration":"Data Integration",
"DDdragDropExamples":"Drag &amp; Drop",
"drawingFolder":"Drawing",
"effectsFolder":"Effects",
"extendingFolder":"Extending",
"Welcome":"Featured Samples",
"formsFolder":"Forms",
"gridsFolder":"Grids",
"layoutFolder":"Layout",
"FSMobileSamples":"Mobile Samples",
"newSamples":"New Samples",
"customDataSourcesFolder":"Server Custom DataSources",
"exportFolder":"Server Export",
"hibernateBeansFolder":"Server Hibernate / Beans",
"jpaFolder":"Server JPA",
"realTimeMessagingFolder":"Server Real-Time Messaging",
"FSserverExamples":"Server Samples",
"sqlFolder":"Server SQL",
"serverScriptingFolder":"Server Scripting",
"transactionsFolder":"Server Transactions",
"uploadDownloadFolder":"Server Upload / Download",
"serverValidation":"Server Validation",
"treesFolder":"Trees"
},
valueIcons:{
"applicationsFolder":this.featureExplorer.treeData.find("id","applicationsFolder").icon,
"basicsFolder":this.featureExplorer.treeData.find("id","basicsFolder").icon,
"calendarsFolder":this.featureExplorer.treeData.find("id","calendarsFolder").icon,
"chartingFolder":this.featureExplorer.treeData.find("id","chartingFolder").icon,
"comboBoxAndFamily":this.featureExplorer.treeData.find("id","comboBoxAndFamily").icon,
"controlFolder":this.featureExplorer.treeData.find("id","controlFolder").icon,
"cubeGrid":this.featureExplorer.treeData.find("id","cubeGrid").icon,
"portal":this.featureExplorer.treeData.find("id","portal").icon,
"dataBindingFolder":this.featureExplorer.treeData.find("id","dataBindingFolder").icon,
"dataIntegration":this.featureExplorer.treeData.find("id","dataIntegration").icon,
"DDdragDropExamples":this.featureExplorer.treeData.find("id","DDdragDropExamples").icon,
"drawingFolder":this.featureExplorer.treeData.find("id","drawingFolder").icon,
"effectsFolder":this.featureExplorer.treeData.find("id","effectsFolder").icon,
"extendingFolder":this.featureExplorer.treeData.find("id","extendingFolder").icon,
"Welcome":this.featureExplorer.treeData.find("id","Welcome").icon,
"formsFolder":this.featureExplorer.treeData.find("id","formsFolder").icon,
"gridsFolder":this.featureExplorer.treeData.find("id","gridsFolder").icon,
"layoutFolder":this.featureExplorer.treeData.find("id","layoutFolder").icon,
"FSMobileSamples":this.featureExplorer.treeData.find("id","FSMobileSamples").icon,
"newSamples":this.featureExplorer.treeData.find("id","newSamples").icon,
"customDataSourcesFolder":this.featureExplorer.treeData.find("id","customDataSourcesFolder").icon,
"exportFolder":this.featureExplorer.treeData.find("id","exportFolder").icon,
"hibernateBeansFolder":this.featureExplorer.treeData.find("id","hibernateBeansFolder").icon,
"jpaFolder":this.featureExplorer.treeData.find("id","jpaFolder").icon,
"realTimeMessagingFolder":this.featureExplorer.treeData.find("id","realTimeMessagingFolder").icon,
"FSserverExamples":this.featureExplorer.treeData.find("id","serverExamples").icon,
"sqlFolder":this.featureExplorer.treeData.find("id","sqlFolder").icon,
"serverScriptingFolder":this.featureExplorer.treeData.find("id","serverScriptingFolder").icon,
"transactionsFolder":this.featureExplorer.treeData.find("id","transactionsFolder").icon,
"uploadDownloadFolder":this.featureExplorer.treeData.find("id","uploadDownloadFolder").icon,
"serverValidation":this.featureExplorer.treeData.find("id","serverValidation").icon,
"treesFolder":this.featureExplorer.treeData.find("id","treesFolder").icon
}
});
if(!_2)delete _3.last().valueMap.betaSamples}
_4.push({
editorType:"CanvasItem",showTitle:false,
colSpan:_1?9:1,
canvas:this.categoriesForm=this.createAutoChild("categoriesForm",{
featureExplorer:this.featureExplorer,
numCols:_1?4:1,
colWidths:_1?["*","*","*","*"]:["*"],
fields:_3
})
});
this.filtersForm=this.createAutoChild("filtersForm",{
categoriesForm:this.categoriesForm,
featureExplorer:this.featureExplorer,
numCols:_1?9:3,
colWidths:_1?[60,125,"40%","20%",100,230,"20%",100,"20%"]:
["*",10,"*"],
fields:_4
});
this.categoriesForm.filtersForm=this.filtersForm;
this.customTileGrid=this.createAutoChild("customTileGrid",{
featureExplorer:this.featureExplorer,
homeInterfacePage:this.featureExplorer.homeInterfacePage,
tileProperties:isc.addProperties({},this.tileDefaults,this.tileProperties,{
featureExplorer:this.featureExplorer
})
});
this.filtersForm.customTileGrid=this.customTileGrid;
this.filtersForm.sampleTreeData=this.featureExplorer.treeData;
this.filtersForm.allSampleNodes=this.filtersForm.sampleTreeData.getAllNodes();
this.addMember(this.filtersForm);
this.addMember(this.customTileGrid);
var _5=["Welcome","newSamples","betaSamples"];
this.filtersForm.showTiles(null,_5)}
,isc.A.disableAISamples=function isc_HomeInterface_disableAISamples(){
this.filtersForm.showTiles()}
);
isc.B._maxIndex=isc.C+2;
isc._nonDebugModules=(isc._nonDebugModules!=null?isc._nonDebugModules:[]);isc._nonDebugModules.push('ExampleViewer');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._ExampleViewer_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('ExampleViewer module init time: '+(isc._moduleEnd-isc._moduleStart)+'ms','loadTime');delete isc.definingFramework;if(isc.Page)isc.Page.handleEvent(null,"moduleLoaded",{moduleName:'ExampleViewer',loadTime:(isc._moduleEnd-isc._moduleStart)});}else{if(window.isc&&isc.Log&&isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'ExampleViewer'.");}
