/*

  SmartClient Ajax RIA system
  Version v12.0p_2018-06-28/LGPL Development Only (2018-06-28)

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

if(window.isc&&window.isc.module_Core&&!window.isc.module_ChangeLogViewer){isc.module_ChangeLogViewer=1;isc._moduleStart=isc._ChangeLogViewer_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log&&isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={message:'ChangeLogViewer load/parse time: '+(isc._moduleStart-isc._moduleEnd)+'ms',category:'loadTime'};if(isc.Log&&isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;else isc._preLog=[isc._pTM]}isc.definingFramework=true;isc.defineClass("ChangeLogViewer",isc.SectionStack);isc.A=isc.ChangeLogViewer.getPrototype();isc.B=isc._allFuncs;isc.C=isc.B._maxIndex;isc.D=isc._funcClasses;isc.D[isc.C]=isc.A.Class;isc.A.visibilityMode="multiple";isc.A.noChangeLogMessage="<h1>Full release notes coming soon</h1>";isc.A.noChangeLogLabelDefaults={_constructor:"Label",width:"100%",height:"100%",align:"center",valign:"top",styleName:"HeaderItem"};isc.A.filterFormProperties={_constructor:"DynamicForm",numCols:3,autoFocus:true,items:[{name:"filterBox",editorType:"TextItem",showTitle:false,width:400,showHintInField:true,hint:"Search change notes",changeOnKeypress:false,keyPress:function(){if(isc.EH.getKey()=="Enter"){this.updateValue();this.form.creator.filterGrids()}}},{name:"backCompatOnly",width:400,editorType:"CheckboxItem",title:"Limit to changes with back-compat notes",showTitle:false}],itemChanged:function(_1,_2){this.creator.filterGrids()}};isc.A.featureGridDefaults={_constructor:"ListGrid",dataFetchMode:"local",fixedRecordHeights:false,wrapCells:true,groupByField:["category"],groupStartOpen:"all",groupByMaxRecords:20000};isc.A.bugfixGridDefaults={_constructor:"ListGrid",dataFetchMode:"local",groupByField:["change_type","category"],groupStartOpen:"all",groupByMaxRecords:20000,fixedRecordHeights:false,wrapCells:true};isc.B.push(isc.A.getDataURL=function isc_ChangeLogViewer_getDataURL(_1){var _2=this.dataURLs;if(_2==null)return null;if(_1==null){_1=this.currentRelease;if(_1==null){for(var r in _2){_1=r;break}}}
return _2[_1]},isc.A.setCurrentRelease=function isc_ChangeLogViewer_setCurrentRelease(_1){var _2=this.getDataURL();this.currentRelease=_1;var _3=this.getDataURL();if(_3!=_2){if(this.publicLogEntryDS){this.publicLogEntryDS.dataURL=_3;this.publicLogEntryDS.invalidateCache();if(this.featureGrid)this.featureGrid.invalidateCache();if(this.bugfixGrid)this.bugfixGrid.invalidateCache()}}
if(_3==null){this.hideSection("filterUI");this.hideSection("featureGrid");this.hideSection("bugfixGrid");this.showSection("noChangeLogLabel")}else{this.showSection("filterUI");this.showSection("featureGrid");this.showSection("bugfixGrid");this.hideSection("noChangeLogLabel");this.filterGrids()}},isc.A.createPublicLogEntryDS=function isc_ChangeLogViewer_createPublicLogEntryDS(){this.publicLogEntryDS=isc.DataSource.create({clientOnly:true,dataURL:this.getDataURL(),fields:[{hidden:true,name:"id",primaryKey:true},{hidden:true,name:"relatedIds",multiple:true},{name:"product",type:"text"},{name:"date_time",type:"datetime"},{length:1,name:"change_type",title:"Change Type",type:"text"},{name:"category",title:"Category",type:"text"},{length:65535,name:"files",title:"Files",type:"text"},{length:65535,name:"public_notes",title:"Public Notes",type:"text"},{hidden:true,length:255,name:"reference",title:"Reference",type:"text"},{length:65535,name:"directory",title:"Directory",type:"text"},{name:"back_compat",type:"text"}]})},isc.A.filterGrids=function isc_ChangeLogViewer_filterGrids(_1,_2){var _3=this.filterForm.getValues(),_4={},_5=this;if(_3.filterBox!=null||_3.backCompatOnly){_4={_constructor:"AdvancedCriteria",operator:"and",criteria:[]}
if(_3.backCompatOnly){_4.criteria.add({fieldName:"back_compat",operator:"notNull"})}
if(_3.filterBox!=null){_4.criteria.add({operator:"or",criteria:[{fieldName:"files",operator:"iContains",value:_3.filterBox},{fieldName:"category",operator:"iContains",value:_3.filterBox},{fieldName:"public_notes",operator:"iContains",value:_3.filterBox}]})}}
this.featureGrid.fetchData(isc.DataSource.combineCriteria({change_type:"f"},_4),function(){if(_1!=null){var _6=_5.featureGrid;var _7=_6.data.indexOf({id:_1});if(_7!=-1){_6.scrollToCell(_7);_6.selectRecord(_7)}}});var _8=isc.DataSource.combineCriteria({_constructor:"AdvancedCriteria",operator:"and",criteria:[{fieldName:"change_type",operator:"notEqual",value:"f"}]},_4);this.bugfixGrid.fetchData(isc.DataSource.combineCriteria({_constructor:"AdvancedCriteria",operator:"and",criteria:[{fieldName:"change_type",operator:"notEqual",value:"f"}]},_4),function(){if(_2!=null){var _6=_5.bugfixGrid;var _7=_6.data.indexOf({id:_2});if(_7!=-1){_6.scrollToCell(_7);_6.selectRecord(_7)}}})},isc.A.initWidget=function isc_ChangeLogViewer_initWidget(){var _1=this;this.createPublicLogEntryDS();this.noChangeLogLabel=this.createAutoChild("noChangeLogLabel");this.noChangeLogLabel.setContents(this.noChangeLogMessage);this.filterForm=this.createAutoChild("filterForm");this.branchPicker=this.createAutoChild("branchPicker");var _2={"ANY":"Any","CUSTOM":"Custom"};isc.DevUtil.branchesDescending().map(function(_9){var _3=isc.DevUtil.branchConf(_9);var _4="SC "+_3.scVersionNumber+" / SGWT "+_3.sgwtVersionNumber;_2[_9]=_4});this.branchPicker.setValueMap("branch",_2);this.branchFilterBuilder=this.createAutoChild("branchFilterBuilder",{dataSource:this.permanentDataSource});this.logEntryPicker=this.createAutoChild("logEntryPicker");var _5={"CUSTOM":"Custom","MATCHES_DIR":"All parsed OK","HAS_PUBLIC_NOTES":"Publicly Documented","NO_PUBLIC_NOTES":"Not Publicly Documented","SC_RELEASE_NOTES":"SmartClient Release Notes (use this for export)","SGWT_RELEASE_NOTES":"SmartGWT Release Notes (use this for export)"};this.logEntryPicker.setValueMap("logEntry",_5);this.logEntryFilterBuilder=this.createAutoChild("logEntryFilterBuilder",{dataSource:this.permanentDataSource});this.filterWindow=this.createAutoChild("filterWindow",{items:[isc.HLayout.create({membersMargin:5,members:[isc.VLayout.create({members:[this.branchPicker,this.branchFilterBuilder]}),isc.VLayout.create({members:[this.logEntryPicker,this.logEntryFilterBuilder]})]}),isc.HLayout.create({membersMargin:5,members:[isc.Button.create({title:"Ok",click:function(){var _6=_1.logEntryFilterBuilder.getCriteria(true);var _7=_1.logEntryPicker.getValue("logEntry");isc.Offline.put("logEntry",_7);if(_7=="CUSTOM"){isc.Offline.put("logEntryCriteria",isc.JSON.encode(_8,{dateFormat:"dateConstructor"}))}
isc.Offline.put("logEntryCriteria",isc.JSON.encode(_6,{dateFormat:"dateConstructor"}));var _8=_1.branchFilterBuilder.getCriteria(true);var _9=_1.branchPicker.getValue("branch");isc.Offline.put("branch",_9);if(_9=="CUSTOM"){isc.Offline.put("branchCriteria",isc.JSON.encode(_8,{dateFormat:"dateConstructor"}))}
isc.Offline.remove("featureBookmark");isc.Offline.remove("bugfixBookmark");_1.filterWindow.hide();var _10={_constructor:"AdvancedCriteria",operator:"and",criteria:[_8,_6]};window.filterLabel.markForRedraw();_1.fireCallback(_1.filterWindow.userCallback,"criteria",[_10])}}),isc.Button.create({title:"Cancel",click:function(){_1.filterWindow.hide()}}),isc.Button.create({title:"Help?",click:function(){isc.say("Detailed overview of how to use this tool available at<a href='http://wiki.isomorphic.com/cvsCommitTemplate#cvsHistoryAdmin'>http://wiki.isomorphic.com/cvsCommitTemplate#cvsHistoryAdmin</a>")}})]})]});var _9=isc.Offline.get("branch");if(_9==null)_9=isc.DevUtil.nextDevBranch()||isc.DevUtil.latestStableBranch();this.branchPicker.setValue("branch",_9);this.updateBranchFilterBuilder(_9);var _7=isc.Offline.get("logEntry");if(_7==null)_7="MATCHES_DIR";this.logEntryPicker.setValue("logEntry",_7);this.updateLogEntryFilterBuilder(_7);this.featureGrid=this.createAutoChild("featureGrid",{dataSource:this.publicLogEntryDS,showHeader:false,fields:[{name:"category",showIf:function(_14,_15,_16){return false},width:100,escapeHTML:true,formatCellValue:function(_4,_14,_15,_16,_17){if(_4==null){var _11=_14.files;if(_11.length>100){_11=_11.substring(0,100)+"..."}
return _11}
return _4},getGroupValue:function(_4,_14,_15,_16,_17){if(_4==null)return _14.files;return _4}},{name:"public_notes",escapeHTML:true,formatCellValue:function(_4,_14,_15,_16,_17){if(_14.back_compat!=null){_4+="\n\nBack-Compat Notes:\n"+_14.back_compat}
return _4}}]});this.bugfixGrid=this.createAutoChild("bugfixGrid",{dataSource:this.publicLogEntryDS,showHeader:false,fields:[{name:"change_type",showIf:function(_14,_15,_16){return false},width:90,formatCellValue:function(_4,_14,_15,_16,_17){if(_4!=null){if(_4.toLowerCase()=="b")return"Bug Fix";if(_4.toLowerCase()=="f")return"New Feature";if(_4.toLowerCase()=="d")return"Documentation Change"}
return"Other"},getGroupTitle:function(_4,_14,_15,_16,_17){if(_4!=null){if(_4.toLowerCase()=="b")return"Bug Fix";if(_4.toLowerCase()=="f")return"New Feature";if(_4.toLowerCase()=="d")return"Documentation Change"}
return"Other"}},{name:"category",showIf:function(_14,_15,_16){return false},width:100,escapeHTML:true,formatCellValue:function(_4,_14,_15,_16,_17){if(_4==null){var _11=_14.files;if(_11.length>100){_11=_11.substring(0,100)+"..."}
return _11}},getGroupValue:function(_4,_14,_15,_16,_17){if(_4==null)return _14.files;return _4}},{name:"public_notes",escapeHTML:true,formatCellValue:function(_4,_14,_15,_16,_17){if(_14.back_compat!=null){_4+="\n\nBackcompat Notes:\n"+_14.back_compat}
return _4}}]});var _12=this.getDataURL(),_13=_12==null;this.sections=[{ID:"noChangeLogLabel",hidden:!_13,showHeader:false,items:[this.noChangeLogLabel]},{ID:"filterUI",hidden:_13,items:[isc.LayoutSpacer.create({height:10}),this.filterForm],showHeader:false,expanded:true},{ID:"featureGrid",hidden:_13,title:"New Features",items:[this.featureGrid],controls:[isc.GridTotalRowsIndicator.create({contents:"Total Features: ${this.rowCount}",grid:this.featureGrid})],expanded:true},{ID:"bugfixGrid",hidden:_13,title:"Bug Fixes and other Changes",items:[this.bugfixGrid],controls:[isc.GridTotalRowsIndicator.create({contents:"Total Bug Fixes: ${this.rowCount}",grid:this.bugfixGrid})],expanded:true}]
this.Super("initWidget",arguments);if(!_13)this.filterGrids()});isc.B._maxIndex=isc.C+5;isc._nonDebugModules=(isc._nonDebugModules!=null?isc._nonDebugModules:[]);isc._nonDebugModules.push('ChangeLogViewer');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._ChangeLogViewer_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('ChangeLogViewer module init time: '+(isc._moduleEnd-isc._moduleStart)+'ms','loadTime');delete isc.definingFramework;if(isc.Page)isc.Page.handleEvent(null,"moduleLoaded",{moduleName:'ChangeLogViewer',loadTime:(isc._moduleEnd-isc._moduleStart)});}else{if(window.isc&&isc.Log&&isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'ChangeLogViewer'.");}
