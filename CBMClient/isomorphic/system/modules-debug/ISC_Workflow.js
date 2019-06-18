/*

  SmartClient Ajax RIA system
  Version SNAPSHOT_v12.1d_2019-05-29/LGPL Deployment (2019-05-29)

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

if(window.isc&&window.isc.module_Core&&!window.isc.module_Workflow){isc.module_Workflow=1;isc._moduleStart=isc._Workflow_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log && isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={ message:'Workflow load/parse time: ' + (isc._moduleStart-isc._moduleEnd) + 'ms', category:'loadTime'};
if(isc.Log && isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');
else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;
else isc._preLog=[isc._pTM]}isc.definingFramework=true;isc.defineClass("ProcessElement");
isc.A=isc.ProcessElement;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getTitle=function isc_c_ProcessElement_getTitle(){
        var title=this.getInstanceProperty("title");
        if(!title){
            title=this.getClassName();
            if(title.endsWith("Task"))title=title.substring(0,title.length-4);
            title=isc.DataSource.getAutoTitle(title);
        }
        return title;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.ProcessElement.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.editorType="ProcessElementEditor";
isc.B.push(isc.A.getElementDescription=function isc_ProcessElement_getElementDescription(){
        return this.description||this.ID;
    }
,isc.A._resolveCriteriaExpressions=function isc_ProcessElement__resolveCriteriaExpressions(criteria,inputData,inputRecord,process){
        criteria=isc.clone(criteria);
        if(isc.DS.isAdvancedCriteria(criteria)){
            this._resolveAdvancedCriteriaExpressions(criteria,inputData,inputRecord,process);
            if(process.ruleScope){
                var ruleScopeComponent=window[process.ruleScope];
                if(!ruleScopeComponent||ruleScopeComponent.destroyed){
                    this.logWarn("Attempt to resolve ruleScope references in taskInputExpression but ruleScope not found: "+process.ruleScope);
                }else{
                    criteria=isc.DS.resolveDynamicCriteria(criteria,ruleScopeComponent.getRuleContext());
                }
            }
        }else{
            criteria=this._resolveObjectDynamicExpressions(criteria,inputData,inputRecord,process);
        }
        return criteria;
    }
,isc.A._resolveAdvancedCriteriaExpressions=function isc_ProcessElement__resolveAdvancedCriteriaExpressions(criteria,inputData,inputRecord,process){
        var operator=criteria.operator;
        if(operator=="and"||operator=="or"||operator=="not"){
            var innerCriteria=criteria.criteria;
            if(!isc.isAn.Array(innerCriteria))innerCriteria=[innerCriteria];
            for(var i=0;i<innerCriteria.length;i++){
                this._resolveAdvancedCriteriaExpressions(innerCriteria[i],inputData,inputRecord,process);
            }
        }if(criteria.value!=null){
            criteria.value=this._resolveDynamicExpression(criteria.value,inputData,inputRecord,process);
        }
    }
,isc.A._resolveObjectDynamicExpressions=function isc_ProcessElement__resolveObjectDynamicExpressions(object,inputData,inputRecord,process){
        var newObject={};
        for(var key in object){
            newObject[key]=this._resolveDynamicExpression(object[key],inputData,inputRecord,process);
        }
        return newObject;
    }
,isc.A._resolveDynamicExpression=function isc_ProcessElement__resolveDynamicExpression(value,inputData,inputRecord,process){
        if(!isc.isA.String(value))return value;
        if(inputRecord&&value.startsWith("$inputRecord")){
            if(inputRecord){
                var dataPath=value.replace("$inputRecord","state");
                value=isc.Canvas._getFieldValue(dataPath,null,{state:inputRecord});
            }
        }else if(inputData&&value.startsWith("$input")){
            if(inputData){
                var dataPath=value.replace("$input","state");
                value=isc.Canvas._getFieldValue(dataPath,null,{state:inputData});
            }
        }else if(process&&value.startsWith("$last")){
            value=value.substring(5);
            var last;
            if(value.startsWith("[")){
                var key=value.substring(1,value.indexOf("]"));
                value=value.substring(value.indexOf("]")+1);
                last=process.getLastTaskOutput(key);
            }else{
                last=process.getLastTaskOutput();
            }
            if(value.startsWith(".")){
                var dataPath="state"+value;
                value=isc.Canvas._getFieldValue(dataPath,null,{state:last});
                if(value==null){
                    var testPath=dataPath.substring(0,dataPath.lastIndexOf("."));
                    if(!isc.Canvas._fieldHasValue(testPath,null,{state:last})){
                        this.logWarn(this.getClassName()+" taskInputExpression path "+dataPath+" not found in previous task output");
                    }
                }
            }else{
                value=last;
            }
        }else if(value.startsWith("$ruleScope")||value.startsWith("$scope")){
            if(!process.ruleScope){
                this.logWarn("Attempt to reference ruleScope in taskInputExpression but no ruleScope has been defined");
                value=null;
            }else{
                var ruleScopeComponent=window[process.ruleScope];
                if(!ruleScopeComponent||ruleScopeComponent.destroyed){
                    this.logWarn("Attempt to reference ruleScope in taskInputExpression but ruleScope not found: "+process.ruleScope);
                    value=null;
                }else{
                    var dataPath=value.replace("$ruleScope","").replace("$scope","");
                    if(dataPath.startsWith("."))dataPath=dataPath.substring(1);
                    value=ruleScopeComponent._getFromRuleContext(dataPath);
                }
            }
        }
        return value;
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("ProcessSequence","ProcessElement");
isc.ProcessSequence.addProperties({
})
isc.defineClass("Task","ProcessElement");
isc.A=isc.Task.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.editorType="TaskEditor";
isc.B.push(isc.A._resolveInputField=function isc_Task__resolveInputField(value,process){
        if(value==null)return null;
        var resolved;
        if(value.startsWith("$"))resolved=this._resolveDynamicExpression(value,null,null,process);
        else resolved=process.getStateVariable(value);
        return resolved;
    }
,isc.A._writeOutputExpression=function isc_Task__writeOutputExpression(data){
        var expression=this.outputExpression;
        if(!expression)return;
        if(expression.startsWith("$")){
            expression=expression.substring(1);
            var id=expression;
            var field;
            var fdi=id.indexOf(".");
            if(fdi>0){
                id=id.substring(0,fdi);
                field=id.substring(fdi+1);
            }
            var canvas=isc.Canvas.getById(id);
            if(canvas){
                if(field){
                    if(!isc.isAn.Array(data)){
                        if(isc.isA.DynamicForm(canvas)){
                            canvas.setFieldValue(field,data);
                        }else if(isc.isA.ListGrid(canvas)&&canvas.canEdit){
                            var editRow=canvas.getEditRow();
                            if(editRow!=null){
                                canvas.setEditValue(editRow,field,data);
                            }else{
                                var selection=canvas.getSelectedRecords();
                                if(selection!=null&&selection.length==1){
                                    var selectedRow=canvas.getRecordIndex(selection[0]);
                                    canvas.setEditValue(selectedRow,field,data);
                                }
                            }
                        }else{
                            this.logWarn("outputExpression target is not a supported DBC or is not editable - ignored: "+expression);
                        }
                    }else{
                        this.logWarn("Task output is not supported by outputExpression target - ignored: "+expression);
                    }
                }else{
                    if(canvas.setValues){
                        var value=(isc.isAn.Array(data)?data[0]:data);
                        if(isc.isAn.Object(value)){
                            canvas.setValues(value);
                        }else{
                            this.logWarn("task output is not an object and cannot be written with outputExpression - ignored: "+expression);
                        }
                    }else if(canvas.setData){
                        if(isc.isAn.Array(data)||isc.isAn.Object(data)){
                            if(!isc.isAn.Array(data))data=[data];
                            canvas.setData(data);
                        }else{
                            this.logWarn("task output is not an object and cannot be written with outputExpression - ignored: "+expression);
                        }
                    }else{
                        this.logWarn("outputExpression target is not a supported DBC - ignored: "+expression);
                    }
                }
            }else{
                this.logWarn("outputExpression DBC not found - ignored: "+expression);
            }
        }else{
            this.logWarn("Invalid outputExpression - ignored: "+expression);
        }
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("Process","Task");
isc.A=isc.Process;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._cache={};
isc.A.gatewayPlaceholderSelection="[placeholder]";
isc.B.push(isc.A.loadProcess=function isc_c_Process_loadProcess(processId,callback){
        var ds=isc.DataSource.get("WorkflowLoader");
        ds.fetchData({id:processId},function(response,data,request){
            var process=null;
            var content=data.content;
            if(content!=null){
                if(isc.isAn.Array(content)){
                    process=isc.Class.evaluate(content[0]);
                    process.ID=processId[0];
                    isc.Process._cache[processId[0]]=process;
                    for(var i=1;i<content.length;i++){
                        var p=isc.Class.evaluate(content[i]);
                        p.ID=processId[i];
                        isc.Process._cache[processId[i]]=p;
                    }
                }else{
                    process=isc.Class.evaluate(content);
                    process.ID=processId;
                    isc.Process._cache[processId]=process;
                }
            }else{
                isc.logWarn("File named \""+processId+"\".proc.xml could not "+
                    "be found in the search path specified by \"project.processes\".")
            }
            callback(process);
        });
    }
,isc.A.getProcess=function isc_c_Process_getProcess(processId){
        return isc.Process._cache[processId];
    }
);
isc.B._maxIndex=isc.C+2;

isc.A=isc.Process.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.autoStart=false;
isc.B.push(isc.A.init=function isc_Process_init(){
        var res=this.Super("init",arguments);
        this.instantiateElements();
        this._nextElement=this.startElement;
        if(this.autoStart)this.start();
        return res;
    }
,isc.A.instantiateElements=function isc_Process_instantiateElements(){
        if(this.elements)this.elements=this._instantiateElements(this.elements);
        if(this.sequences)this.sequences=this._instantiateElements(this.sequences);
    }
,isc.A._instantiateElements=function isc_Process__instantiateElements(elements){
        var newElements=[];
        for(var i=0;i<elements.length;i++){
            var element=elements[i];
            newElements[i]=element;
            if(isc.isAn.Object(element)){
                if(element._constructor){
                    newElements[i]=isc.ClassFactory.newInstance(element);
                }
                if(element.elements){
                    newElements[i].elements=this._instantiateElements(element.elements);
                }
            }
        }
        return newElements;
    }
,isc.A.getElement=function isc_Process_getElement(ID){
        return this._searchElement(this,ID);
    }
,isc.A._searchElement=function isc_Process__searchElement(sequence,ID){
        if(sequence.sequences){
            for(var i=0;i<sequence.sequences.length;i++){
                var s=sequence.sequences[i];
                if(s.ID==ID){
                    return s;
                }else if(s.sequences||s.elements){
                    var res=this._searchElement(s,ID);
                    if(res)return res;
                }
            }
        }
        if(sequence.elements){
            for(var i=0;i<sequence.elements.length;i++){
                var e=sequence.elements[i];
                if(e.ID==ID){
                    return e;
                }else if(e.sequences||e.elements){
                    var res=this._searchElement(e,ID);
                    if(res)return res;
                }
            }
        }
    }
,isc.A.getAllElements=function isc_Process_getAllElements(sequence,arr){
        if(!sequence)sequence=this;
        if(!arr)arr=[];
        if(sequence.sequences){
            for(var i=0;i<sequence.sequences.length;i++){
                var s=sequence.sequences[i];
                arr.add(s);
                if(s.sequences||s.elements){
                    this.getAllElements(s,arr);
                }
            }
        }
        if(sequence.elements){
            for(var i=0;i<sequence.elements.length;i++){
                var e=sequence.elements[i];
                arr.add(e);
                if(e.sequences||e.elements){
                    this.getAllElements(e,arr);
                }
            }
        }
        return arr;
    }
,isc.A.removeElement=function isc_Process_removeElement(element){
        this._removeElement(this,element);
    }
,isc.A._removeElement=function isc_Process__removeElement(sequence,element){
        if(sequence.sequences){
            for(var i=0;i<sequence.sequences.length;i++){
                var s=sequence.sequences[i];
                if(s==element){
                    sequence.sequences.removeAt(i);
                    return true;
                }
                if(s.sequences||s.elements){
                    if(this._removeElement(s,element))return true;
                }
            }
        }
        if(sequence.elements){
            for(var i=0;i<sequence.elements.length;i++){
                var e=sequence.elements[i];
                if(e==element){
                    sequence.elements.removeAt(i);
                    return true;
                }
                if(e.sequences||e.elements){
                    if(this._removeElement(e,element))return true;
                }
            }
        }
    }
,isc.A.addElement=function isc_Process_addElement(element,afterElement){
        if(afterElement){
            this._addElement(this,element,afterElement);
        }else{
            if(!this.elements)this.elements=[];
            this.elements.add(element);
        }
    }
,isc.A._addElement=function isc_Process__addElement(sequence,element,afterElement){
        if(sequence.sequences){
            for(var i=0;i<sequence.sequences.length;i++){
                var s=sequence.sequences[i];
                if(s==afterElement){
                    var position=i+1;
                    sequence.sequences.add(element,position);
                    return true;
                }
                if(s.sequences||s.elements){
                    if(this._addElement(s,element,afterElement))return true;
                }
            }
        }
        if(sequence.elements){
            for(var i=0;i<sequence.elements.length;i++){
                var e=sequence.elements[i];
                if(e==afterElement){
                    var position=i+1;
                    sequence.elements.add(element,position);
                    return true;
                }
                if(e.sequences||e.elements){
                    if(this._addElement(e,element,afterElement))return true;
                }
            }
        }
    }
,isc.A.setState=function isc_Process_setState(state){
        this.state=state;
    }
,isc.A.start=function isc_Process_start(){
        if(this.executionStack==null){
            if(this.logIsDebugEnabled("workflow")){
                this.logDebug("Start process: "+this.echo(this),"workflow");
            }
        }
        if(this.executionStack==null){
            this.executionStack=[];
        }
        if(this.state==null)this.state={};
        while(this._next()){
            var currentTask=this._getFirstTask();
            if(currentTask){
                this._started=true;
                if(!currentTask.executeElement(this)){
                    return;
                }
            }
        }
        if(this.finished){
            delete this._nextElement;
            this.finished(this.state);
        }
        if(this.logIsDebugEnabled("workflow")){
            this.logDebug("Process finished: "+this.echo(this),"workflow");
        }
    }
,isc.A.reset=function isc_Process_reset(state){
        this.state=state;
        this.executionStack=null;
        this._nextElement=this.startElement;
        this.setLastTaskClass(null);
        this._lastOutput=null;
    }
,isc.A._next=function isc_Process__next(skipLogEmptyMessage){
        var currEl=this.executionStack.last();
        if(currEl==null){
            if(this._nextElement){
                var nextEl=this._gotoElement(this,this._nextElement);
                if(nextEl==null){
                    isc.logWarn("unable to find task '"+this._nextElement+"' - process will be finished");
                }
                return nextEl;
            }else if(this._started){
                return null;
            }else if(this.sequences&&this.sequences.length>0){
                this.executionStack.add({el:this,sIndex:0});
                return this.sequences[0];
            }else if(this.elements&&this.elements.length>0){
                this.executionStack.add({el:this,eIndex:0});
                return this.elements[0];
            }else if(!skipLogEmptyMessage){
                isc.logWarn("There are neither sequences or elements. Nothing to execute.");
            }
        }else{
            var el=null;
            if(currEl.sIndex!=null){
                el=currEl.el.sequences[currEl.sIndex];
            }else if(currEl.eIndex!=null){
                el=currEl.el.elements[currEl.eIndex];
            }
            this.setLastTaskClass(el.getClassName());
            if(el.nextElement){
                this.executionStack=[];
                var nextEl=this._gotoElement(this,el.nextElement);
                if(nextEl==null){
                    isc.logWarn("unable to find task '"+el.nextElement+"' - process will be finished");
                }
                return nextEl;
            }else{
                return this._findNextElement();
            }
        }
    }
,isc.A._gotoElement=function isc_Process__gotoElement(sequence,ID){
        var elData={el:sequence};
        this.executionStack.add(elData);
        if(sequence.sequences){
            for(var i=0;i<sequence.sequences.length;i++){
                var s=sequence.sequences[i];
                elData.sIndex=i;
                if(s.ID==ID){
                    return s;
                }else if(s.sequences||s.elements){
                    var res=this._gotoElement(s,ID);
                    if(res)return res;
                }
            }
        }
        delete elData.sIndex;
        if(sequence.elements){
            for(var i=0;i<sequence.elements.length;i++){
                var e=sequence.elements[i];
                elData.eIndex=i;
                if(e.ID==ID){
                    return e;
                }else if(e.sequences||e.elements){
                    var res=this._gotoElement(e,ID);
                    if(res)return res;
                }
            }
        }
        this.executionStack.removeAt(this.executionStack.length-1);
    }
,isc.A._findNextElement=function isc_Process__findNextElement(){
        var elData=this.executionStack.last();
        if(elData.eIndex!=null&&elData.el!=this){
            if(elData.eIndex==elData.el.elements.length-1){
                this.executionStack.removeAt(this.executionStack.length-1);
                if(elData.el==this){
                    return;
                }else{
                    return this._findNextElement();
                }
            }else{
                elData.eIndex++;
                return elData.el.elements[elData.eIndex];
            }
        }
    }
,isc.A._getFirstTask=function isc_Process__getFirstTask(inner){
        var lastElData=this.executionStack.last();
        var el=null;
        if(lastElData.sIndex!=null){
            el=lastElData.el.sequences[lastElData.sIndex];
        }else if(lastElData.eIndex!=null){
            el=lastElData.el.elements[lastElData.eIndex];
        }
        if(el.sequences==null&&el.elements==null){
            if(!inner)this.handleTraceElement(el);
            return el;
        }
        var elData={el:el};
        this.executionStack.add(elData);
        if(el.sequences){
            for(var i=0;i<el.sequences.length;i++){
                elData.sIndex=i
                var res=this._getFirstTask(el.sequences[i]);
                if(res){
                    this.handleTraceElement(res);
                    return res;
                }
            }
        }
        if(el.elements){
            for(var i=0;i<el.elements.length;i++){
                elData.eIndex=i
                var res=this._getFirstTask(el.elements[i]);
                if(res){
                    if(elData.eIndex==0)this.handleTraceElement(elData.el);
                    this.handleTraceElement(res);
                    return res;
                }
            }
        }
        this.executionStack.removeAt(this.executionStack.length-1);
    }
,isc.A.setNextElement=function isc_Process_setNextElement(nextElement){
        var lastElData=this.executionStack.last(),
            el=null
        ;
        if(lastElData.sIndex!=null){
            el=lastElData.el.sequences[lastElData.sIndex];
        }else if(lastElData.eIndex!=null){
            el=lastElData.el.elements[lastElData.eIndex];
        }
        this.setLastTaskClass(el.getClassName());
        this.executionStack=[];
        this._nextElement=nextElement;
    }
,isc.A.setStateVariable=function isc_Process_setStateVariable(stateVariablePath,value){
        if(stateVariablePath.indexOf(".")<0||this.state[stateVariablePath]){
            this.state[stateVariablePath]=value;
        }else{
            var segments=stateVariablePath.split(".");
            var obj=this.state;
            for(var i=0;i<segments.length-1;i++){
                var nextObj=obj[segments[i]];
                if(nextObj==null){
                    obj[segments[i]]={}
                    nextObj=obj[segments[i]];
                }
                obj=nextObj;
            }
            obj[segments[i]]=value;
        }
    }
,isc.A.getStateVariable=function isc_Process_getStateVariable(stateVariablePath){
        if(stateVariablePath.indexOf(".")<0||this.state[stateVariablePath]){
            return this.state[stateVariablePath];
        }else{
            var segments=stateVariablePath.split(".");
            var obj=this.state;
            for(var i=0;i<segments.length-1;i++){
                obj=obj[segments[i]];
                if(obj==null){
                    isc.logWarn("Unable to get state variable: "+stateVariablePath+" no such path")
                    return;
                }
            }
            return obj[segments[i]]
        }
    }
,isc.A.setLastTaskClass=function isc_Process_setLastTaskClass(className){
        this._lastTaskClassName=(className?className.toLowerCase():null);
    }
,isc.A.getLastTaskClass=function isc_Process_getLastTaskClass(){
        return this._lastTaskClassName;
    }
,isc.A.setTaskOutput=function isc_Process_setTaskOutput(className,ID,output){
        if(!this._lastOutput)this._lastOutput={};
        this._lastOutput[className.toLowerCase()]=output;
        if(ID!=null)this._lastOutput[ID]=output;
    }
,isc.A.getLastTaskOutput=function isc_Process_getLastTaskOutput(key){
        if(!this._lastOutput)return null;
        var origKey=key;
        if(!key)key=this.getLastTaskClass();
        if(!key)return null;
        key=key.toLowerCase();
        if(origKey)origKey=origKey.toLowerCase();
        var value=this._lastOutput[key];
        if(origKey!=null&&value==null&&!origKey.endsWith("task")&&!origKey.endsWith("gateway")){
            key=origKey+"task";
            value=this._lastOutput[key];
            if(value==null){
                key=origKey+"gateway";
                value=this._lastOutput[key];
            }
        }
        return value;
    }
,isc.A.handleTraceElement=function isc_Process_handleTraceElement(element){
        if(isc.isA.Class(element)&&this.logIsDebugEnabled("workflow")){
            this.logDebug((this.traceElement?"Trace element: ":"Execute element: ")+this.echo(element),"workflow");
        }
        if(this.traceElement)this.traceElement(element,this.traceContext);
    }
);
isc.B._maxIndex=isc.C+25;

isc.Process.registerStringMethods({
    finished:"state",
    traceElement:"element,context"
});
isc.defineClass("ServiceTask","Task");
isc.A=isc.ServiceTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.operationType="fetch";
isc.A.title="DataSource Fetch Data";
isc.A.editorType="ServiceTaskEditor";
isc.B.push(isc.A.executeElement=function isc_ServiceTask_executeElement(process){
        var ds=this.dataSource;
        if(ds.getClassName==null||ds.getClassName()!="DataSource"){
            ds=isc.DataSource.get(ds);
        }
        var requestData=this._createRequestData(process);
        if(this.operationType=="export"){
            var requestProperties={
                exportAs:this.exportFormat,
                operationId:this.operationId
            };
            ds.exportData(requestData,requestProperties);
            return true;
        }
        var params=isc.addProperties({},this.requestProperties,{operationId:this.operationId});
        params.willHandleError=true;
        var task=this;
        ds.performDSOperation(this.operationType,requestData,function(dsResponse,data,request){
            var results=dsResponse.results,
                operation=request.operation;
            if(dsResponse.isStructured&&
                (!results||results.status<0||(results.status==null&&dsResponse.status<0)))
            {
                if(!isc.RPC.runDefaultErrorHandling(dsResponse,request,task.errorFormatter)){
                    task.fail(process);
                    return;
                }
            }
            var output=data;
            if(isc.isAn.Array(data)&&data.length>0){
                if(this.operationType=="fetch"){
                    var primaryKey=ds.getPrimaryKeyFieldName();
                    if(ds.isAdvancedCriteria(requestData)){
                        var criterion=ds.getFieldCriterion(requestData,primaryKey);
                        if(criterion&&criterion.operator=="equals"){
                            output=data[0];
                        }
                    }else if(ds.defaultTextMatchStyle=="equals"&&requestData[primaryKey]!=null){
                        output=data[0];
                    }
                }else if(this.operationType!="custom"){
                    output=data[0];
                }
            }
            process.setTaskOutput(task.getClassName(),task.ID,output);
            if(!isc.isAn.Array(data))data=[data];
            if(data.length>0){
                var fieldsToProcess=[];
                if(task.outputFieldList){
                    fieldsToProcess.addList(task.outputFieldList);
                }
                if(task.outputField)fieldsToProcess.add(task.outputField);
                for(var i=0;i<fieldsToProcess.length;i++){
                    var fieldName=fieldsToProcess[i];
                    if(fieldName.startsWith("$")){
                        var value=data.length==1?data[0]:data;
                        fieldName=fieldName.substring(1);
                        process.setStateVariable(fieldName,value);
                    }else{
                        var key=fieldName;
                        var ldi=key.lastIndexOf(".");
                        if(ldi>0){
                            key=key.substring(ldi+1);
                        }
                        var value=data[0][key];
                        if(typeof value!='undefined'){
                            if(data.length>1){
                                value=[value];
                                for(var i=1;i<data.length;i++){
                                  value.add(data[i][key])
                                }
                            }
                            process.setStateVariable(fieldName,value);
                        }
                    }
                };
                task._writeOutputExpression(data);
            }
            process.start();
        },params);
        return false;
    }
,isc.A._createRequestData=function isc_ServiceTask__createRequestData(process,skipDynamicExpressions){
        var inputData;
        var inputRecord={};
        if(this.inputFieldList){
            for(var i=0;i<this.inputFieldList.length;i++){
                var key=this.inputFieldList[i];
                var ldi=key.lastIndexOf(".");
                if(ldi>0){
                    key=key.substring(ldi+1);
                }
                inputRecord[key]=process.getStateVariable(this.inputFieldList[i]);
            };
        }
        if(this.inputField){
            var key=this.inputField;
            if(!skipDynamicExpressions&&key.startsWith("$")){
                inputData=this._resolveInputField(key,process);
            }
            var ldi=key.lastIndexOf(".");
            if(ldi>0){
                key=key.substring(ldi+1);
            }
            if(inputData==null)inputData=process.getStateVariable(this.inputField);
            inputRecord[key]=inputData;
        }
        var data=null;
        if(this.operationType=="fetch"||this.operationType=="export"){
            if(this.criteria&&!skipDynamicExpressions){
                data=this._resolveCriteriaExpressions(this.criteria,inputData,inputRecord,process);
            }else if(this.criteria){
                data=this.criteria;
            }
            if(this.fixedCriteria){
                if(data==null&&inputRecord==null){
                    data=this.fixedCriteria
                }else{
                    var crit=isc.clone(this.fixedCriteria);
                    if(inputRecord){
                        crit=isc.DataSource.combineCriteria(inputRecord,crit);
                    }
                    if(data){
                        crit=isc.DataSource.combineCriteria(data,crit);
                    }
                    data=crit;
                }
            }
        }
        if(data==null){
            data=(this.inputFieldList==null&&isc.isAn.Object(inputData)?inputData:inputRecord);
        }
        if(this.operationType!="fetch"&&this.operationType!="export"){
            if(this.values){
                data=this.values;
                if(!skipDynamicExpressions){
                    data=this._resolveObjectDynamicExpressions(this.values,inputData,inputRecord,process);
                }
            }
            if(this.fixedValues){
                for(var key in this.fixedValues){
                    data[key]=this.fixedValues[key];
                }
            }
        }
        return data;
    }
,isc.A.fail=function isc_ServiceTask_fail(process){
        if(!this.failureElement){
            this.logWarn("ServiceTask does not have a failureElement. Process is aborting.");
        }
        process.setNextElement(this.failureElement);
    }
,isc.A.errorFormatter=function isc_ServiceTask_errorFormatter(codeName,response,request){
        if(codeName=="VALIDATION_ERROR"){
            var errors=response.errors,
                message=["Server returned validation errors:<BR><UL>"]
            ;
            if(!isc.isAn.Array(errors))errors=[errors];
            for(var i=0;i<errors.length;i++){
                var error=errors[i];
                for(var field in error){
                    var fieldErrors=error[field];
                    message.add("<LI><B>"+field+":</B> ");
                    if(!isc.isAn.Array(fieldErrors))fieldErrors=[fieldErrors];
                    for(var j=0;j<fieldErrors.length;j++){
                        var fieldError=fieldErrors[j];
                        message.add((j>0?"<BR>":"")+(isc.isAn.Object(fieldError)?fieldError.errorMessage:fieldError));
                    }
                    message.add("</LI>");
                }
            }
            message.add("</UL>");
            return message.join("");
        }
        return null;
    }
,isc.A.getElementDescription=function isc_ServiceTask_getElementDescription(){
        if(!this.dataSource)return"";
        var description=this.dataSource+" "+this.operationType+(this.operationId?" ("+this.operationId+")":""),
            data=this._createRequestData({getStateVariable:function(stateVariablePath){return stateVariablePath;}},true)
        ;
        if(this.operationType=="fetch"||this.operationType=="remove"||this.operationType=="export"){
            if(!isc.DS.isAdvancedCriteria(data)){
                data=isc.DS.convertCriteria(data,(this.operationType=="remove"?"exact":null));
            }
            var dsFields=isc.XORGateway._processFieldsRecursively(data);
            var fieldsDS=isc.DataSource.create({
                addGlobalId:false,
                fields:dsFields
            });
            description+=" where "+isc.DataSource.getAdvancedCriteriaDescription(data,fieldsDS);
            fieldsDS.destroy();
        }
        return description;
    }
,isc.A.getOutputSchema=function isc_ServiceTask_getOutputSchema(){
        var ds=this.dataSource;
        if(ds&&(ds.getClassName==null||ds.getClassName()!="DataSource")){
            ds=isc.DataSource.get(ds);
        }
        return ds;
    }
);
isc.B._maxIndex=isc.C+6;

isc.defineClass("DSFetchTask","ServiceTask");
isc.A=isc.DSFetchTask.getPrototype();
isc.A.title="DataSource Fetch";
isc.A.classDescription="Retrieve data from a DataSource which match specified criteria";
isc.A.editorType="ServiceTaskEditor";
isc.A.editorProperties={showOperationTypePicker:false};
isc.A.operationType="fetch"
;

isc.defineClass("DSAddTask","ServiceTask");
isc.A=isc.DSAddTask.getPrototype();
isc.A.title="DataSource Add";
isc.A.classDescription="Add a new record";
isc.A.editorType="ServiceTaskEditor";
isc.A.editorProperties={showOperationTypePicker:false};
isc.A.operationType="add"
;

isc.defineClass("DSUpdateTask","ServiceTask");
isc.A=isc.DSUpdateTask.getPrototype();
isc.A.title="DataSource Update";
isc.A.classDescription="Update an existing record";
isc.A.editorType="ServiceTaskEditor";
isc.A.editorProperties={showOperationTypePicker:false};
isc.A.operationType="update"
;

isc.defineClass("DSRemoveTask","ServiceTask");
isc.A=isc.DSRemoveTask.getPrototype();
isc.A.title="DataSource Remove";
isc.A.classDescription="Remove an existing record";
isc.A.editorType="ServiceTaskEditor";
isc.A.editorProperties={showOperationTypePicker:false};
isc.A.operationType="remove"
;

isc.defineClass("ScriptTask","Task");
isc.A=isc.ScriptTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.isAsync=false;
isc.B.push(isc.A.getProcess=function isc_ScriptTask_getProcess(){
        return this._process;
    }
,isc.A.getInputData=function isc_ScriptTask_getInputData(){
        return this.inputData;
    }
,isc.A.setOutputData=function isc_ScriptTask_setOutputData(taskOutput){
        this._finishTask(this._process,null,taskOutput);
    }
,isc.A.getInputRecord=function isc_ScriptTask_getInputRecord(){
        return this.inputRecord;
    }
,isc.A.setOutputRecord=function isc_ScriptTask_setOutputRecord(outputRecord){
        this._finishTask(this._process,outputRecord);
    }
,isc.A.executeElement=function isc_ScriptTask_executeElement(process){
        var inputData;
        var inputRecord={};
        if(this.inputFieldList){
            for(var i=0;i<this.inputFieldList.length;i++){
                var key=this.inputFieldList[i];
                var ldi=key.lastIndexOf(".");
                if(ldi>0){
                    key=key.substring(ldi+1);
                }
                inputRecord[key]=isc.clone(process.getStateVariable(this.inputFieldList[i]));
            };
        }
        if(this.inputField){
            var key=this.inputField;
            if(key.startsWith("$")){
                inputData=isc.clone(this._resolveInputField(key,process));
            }
            var ldi=key.lastIndexOf(".");
            if(ldi>0){
                key=key.substring(ldi+1);
            }
            if(inputData==null)inputData=isc.clone(process.getStateVariable(this.inputField));
            inputRecord[key]=inputData;
        }
        this.inputData=inputData;
        this.inputRecord=inputRecord;
        this._process=process;
        try{
            var output=this.execute(inputData,inputRecord);
        }catch(e){
            isc.logWarn("Error while executing ScriptTask: "+e.toString());
        }
        if(this.isAsync){
            return false;
        }
        if(typeof output=='undefined'){
            return true;
        }
        this._processTaskOutput(process,output);
        return true;
    }
,isc.A._processTaskOutput=function isc_ScriptTask__processTaskOutput(process,output){
        process.setTaskOutput(this.getClassName(),this.ID,output);
        if(this.outputFieldList){
            for(var i=0;i<this.outputFieldList.length;i++){
                var key=this.outputFieldList[i];
                var ldi=key.lastIndexOf(".");
                if(ldi>0){
                    key=key.substring(ldi+1);
                }
                var value=output[key];
                if(typeof value!='undefined'){
                    process.setStateVariable(this.outputFieldList[i],value);
                }
            };
        }
        if(this.outputField){
            if(this.outputFieldList==null){
                if(typeof output!='undefined'){
                    process.setStateVariable(this.outputField,output);
                }
            }else{
                var key=this.outputField;
                var ldi=key.lastIndexOf(".");
                if(ldi>0){
                    key=key.substring(ldi+1);
                }
                var value=output[key];
                if(typeof value!='undefined'){
                    process.setStateVariable(this.outputField,value);
                }
            }
        }
        this._writeOutputExpression(output);
    }
,isc.A._finishTask=function isc_ScriptTask__finishTask(process,outputRecord,outputData){
        if(outputRecord==null){
            this._processTaskOutput(process,outputData);
        }else{
            if(outputData){
                var key=this.outputField;
                var ldi=key.lastIndexOf(".");
                if(ldi>0){
                    key=key.substring(ldi+1);
                }
                outputRecord[key]=outputData;
            }
            this._processTaskOutput(process,outputRecord);
        }
        if(this.isAsync){
            process.start();
        }
    }
,isc.A.getCustomDefaults=function isc_ScriptTask_getCustomDefaults(){
        return{execute:isc.Func.getBody(this.execute)};
    }
);
isc.B._maxIndex=isc.C+9;

isc.ScriptTask.registerStringMethods({
    execute:"input,inputRecord"
});
isc.defineClass("XORGateway","ProcessElement");
isc.A=isc.XORGateway;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A._processFieldsRecursivelyValuesOnly=function isc_c_XORGateway__processFieldsRecursivelyValuesOnly(criteria){
        var dsFields=[];
        if(criteria.fieldName){
            if(!dsFields.contains(criteria.fieldName)){
                dsFields.add(criteria.fieldName);
            }
        }else if(criteria.criteria){
            for(var i=0;i<criteria.criteria.length;i++){
                var fs=this._processFieldsRecursivelyValuesOnly(criteria.criteria[i]);
                for(var j=0;j<fs.length;j++){
                    if(!dsFields.contains(fs[j])){
                        dsFields.add(fs[j]);
                    }
                }
            }
        }else{
            for(var key in criteria){
                if(!dsFields.contains(key)){
                    dsFields.add(key);
                }
            }
        }
        return dsFields
    }
,isc.A._processFieldsRecursively=function isc_c_XORGateway__processFieldsRecursively(criteria){
        var res=[];
        var dsFields=isc.XORGateway._processFieldsRecursivelyValuesOnly(criteria);
        for(var i=0;i<dsFields.length;i++){
            var fieldName=dsFields[i],
                splitFieldName=fieldName.split("."),
                title=isc.DS.getAutoTitle(splitFieldName[splitFieldName.length-1])
            ;
            res.add({
                name:fieldName,
                title:title
            });
        }
        return res;
    }
);
isc.B._maxIndex=isc.C+2;

isc.A=isc.XORGateway.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.title="Single Decision";
isc.A.classDescription="Choose the next task based on criteria";
isc.A.editorType="XORGatewayEditor";
isc.B.push(isc.A.executeElement=function isc_XORGateway_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var criteria=this.criteria;
        if(criteria){
            criteria=this._resolveCriteriaExpressions(criteria,process.state,process.state,process);
        }
        var data=[process.state];
        if(process.ruleScope){
            var ruleScopeComponent=window[process.ruleScope];
            if(ruleScopeComponent&&!ruleScopeComponent.destroyed){
                data.add(ruleScopeComponent.getRuleContext());
            }
        }
        if(criteria&&isc.DS.applyFilter(data,criteria).length==1){
            if(this.nextElement)process.setNextElement(this.nextElement);
        }else{
            if(!this.failureElement){
                this.logWarn("XOR Gateway does not have a failureElement. Process is aborting.");
            }
            process.setNextElement(this.failureElement);
        }
        return true;
    }
,isc.A.getElementDescription=function isc_XORGateway_getElementDescription(){
        var description="No criteria - always fail";
        if(this.criteria){
            var dsFields=isc.XORGateway._processFieldsRecursively(this.criteria);
            var fieldsDS=isc.DataSource.create({
                addGlobalId:false,
                fields:dsFields
            });
            description=isc.DataSource.getAdvancedCriteriaDescription(this.criteria,fieldsDS);
            fieldsDS.destroy();
        }
        return description;
    }
,isc.A.getPlaceholders=function isc_XORGateway_getPlaceholders(){
        return(this.failureElement==isc.Process.gatewayPlaceholderSelection?["failureElement"]:null);
    }
,isc.A.setPlaceholderId=function isc_XORGateway_setPlaceholderId(placeholder,id){
        if(placeholder=="failureElement")this.failureElement=id;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("UserConfirmationGateway","ProcessElement");
isc.A=isc.UserConfirmationGateway.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.title="Confirm with user";
isc.A.classDescription="Choose the next task based on user confirmation";
isc.A.editorType="UserConfirmationGatewayEditor";
isc.B.push(isc.A.executeElement=function isc_UserConfirmationGateway_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var task=this;
        isc.confirm(this.message,function(value){
            if(value){
                if(task.nextElement)process.setNextElement(task.nextElement);
            }else{
                if(!task.failureElement){
                    task.logWarn("User Confirmation Gateway does not have a failureElement. Process is aborting.");
                }
                process.setNextElement(task.failureElement);
            }
            process.start();
        });
        return false;
    }
,isc.A.getElementDescription=function isc_UserConfirmationGateway_getElementDescription(){
        var description="Confirm with user";
        return description;
    }
,isc.A.getPlaceholders=function isc_UserConfirmationGateway_getPlaceholders(){
        return(this.failureElement==isc.Process.gatewayPlaceholderSelection?["failureElement"]:null);
    }
,isc.A.setPlaceholderId=function isc_UserConfirmationGateway_setPlaceholderId(placeholder,id){
        if(placeholder=="failureElement")this.failureElement=id;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("DecisionGateway","ProcessElement");
isc.A=isc.DecisionGateway.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._canAddNextElement=false;
isc.A.title="Multi Decision";
isc.A.classDescription="Choose multiple possible next tasks based on criteria";
isc.A.editorType="DecisionGatewayEditor";
isc.B.push(isc.A.executeElement=function isc_DecisionGateway_executeElement(process){
        this._convertCriteriaMap();
        if(!this.decisionList)this.decisionList=[];
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        for(var i=0;i<this.decisionList.length;i++){
            var taskDecision=this.decisionList[i],
                criteria=taskDecision.criteria
            ;
            if(criteria){
                criteria=this._resolveCriteriaExpressions(criteria,process.state,process.state,process);
            }
            var dsFields=isc.XORGateway._processFieldsRecursively(criteria);
            var ds=isc.DataSource.create({
                fields:dsFields
            });
            var data=[process.state];
            if(process.ruleScope){
                var ruleScopeComponent=window[process.ruleScope];
                if(ruleScopeComponent&&!ruleScopeComponent.destroyed){
                    data.add(ruleScopeComponent.getRuleContext());
                }
            }
            if(ds.applyFilter(data,criteria).length==1){
                process.setNextElement(taskDecision.targetTask);
                return true;
            }
        }
        if(this.defaultElement)process.setNextElement(this.defaultElement);
        return true;
    }
,isc.A._convertCriteriaMap=function isc_DecisionGateway__convertCriteriaMap(){
        if(!this.decisionList&&this.criteriaMap){
            var decisionList=[];
            for(var key in this.criteriaMap){
                decisionList.add({
                    criteria:this.criteriaMap[key],
                    targetTask:key
                });
            }
            this.decisionList=decisionList;
        }
    }
,isc.A.getElementDescription=function isc_DecisionGateway_getElementDescription(){
        this._convertCriteriaMap();
        var description="Multi-branch";
        if((!this.decisionList||this.decisionList.length==0)&&this.defaultElement){
            description="Go to "+this.defaultElement;
        }
        return description;
    }
,isc.A.dropElementReferences=function isc_DecisionGateway_dropElementReferences(ID){
        this._convertCriteriaMap();
        if(this.decisionList){
            var decisionsToDrop=[];
            for(var i=0;i<this.decisionList.length;i++){
                var taskDecision=this.decisionList[i];
                if(taskDecision.targetTask==ID)decisionsToDrop.add(taskDecision);
            }
            if(decisionsToDrop.length>0)this.decisionList.removeList(decisionsToDrop);
        }
        if(this.defaultElement==ID)this.defaultElement=null;
    }
,isc.A.getPlaceholders=function isc_DecisionGateway_getPlaceholders(){
        this._convertCriteriaMap();
        var placeholders=[];
        if(this.decisionList){
            for(var i=0;i<this.decisionList.length;i++){
                var taskDecision=this.decisionList[i];
                if(taskDecision.targetTask==isc.Process.gatewayPlaceholderSelection){
                    placeholders.add(""+i);
                }
            }
        }
        if(this.defaultElement==isc.Process.gatewayPlaceholderSelection){
            placeholders.add("defaultElement");
        }
        return placeholders;
    }
,isc.A.setPlaceholderId=function isc_DecisionGateway_setPlaceholderId(placeholder,id){
        if(placeholder=="defaultElement"){
            this.defaultElement=id;
        }else{
            var index=parseInt(placeholder);
            this.decisionList[index].targetTask=id;
        }
    }
);
isc.B._maxIndex=isc.C+6;

isc.defineClass("UserTask","Task");
isc.A=isc.UserTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.editorType="UserTaskEditor"
;
isc.B.push(isc.A.goToPrevious=function isc_UserTask_goToPrevious(){
        if(this.previousElement==null){
            isc.logWarn("PreviousElement is not set - unable to accomplish goToPrevious method.");
            return;
        }
        this._process.setNextElement(this.previousElement);
        this.completeEditing();
    }
,isc.A.cancelEditing=function isc_UserTask_cancelEditing(){
        if(this._process){
            if(this.wizard||this._process.wizard){
                if(this.targetFormValue){
                    this.targetFormValue.hide();
                }
            }
            var process=this._process
            delete this._process;
            process.setNextElement(this.cancelElement);
            process.start();
        }
    }
,isc.A.completeEditing=function isc_UserTask_completeEditing(){
        if(this._process){
            var process=this._process;
            delete this._process;
            if(this.wizard||process.wizard){
                if(this.targetFormValue){
                    this.targetFormValue.hide();
                }
            }
            var values;
            if(this.targetVMValue){
                values=this.targetVMValue.getValues();
            }else if(this.targetFormValue){
                values=this.targetFormValue.getValues();
            }
            process.setTaskOutput(this.getClassName(),this.ID,values);
            if(this.outputField){
                process.setStateVariable(this.outputField,values);
            }else if(this.outputFieldList){
                for(var i=0;i<this.outputFieldList.length;i++){
                    var key=this.outputFieldList[i];
                    var ldi=key.lastIndexOf(".");
                    if(ldi>0){
                        key=key.substring(ldi+1);
                    }
                    var value=values[key];
                    if(typeof value!='undefined'){
                        process.setStateVariable(this.outputFieldList[i],value);
                    }
                }
            }else{
                process.setStateVariable(this.inputField,values);
            }
            this._writeOutputExpression(values);
            process.start();
        }
    }
,isc.A.executeElement=function isc_UserTask_executeElement(process){
        this._process=process;
        if(this.targetView&&isc.isA.String(this.targetView)){
            if(process.getStateVariable(this.targetView)){
                this.targetViewValue=process.getStateVariable(this.targetView);
            }else{
                this.targetViewValue=window[this.targetView];
                if(this.targetViewValue==null&&process.views){
                    for(var i=0;i<process.views.length;i++){
                        if(process.views[i].ID==this.targetView){
                            this.targetViewValue=isc[process.views[i]._constructor].create(process.views[i]);
                            if(this._process.containerId){
                                window[this._process.containerId].addMember(this.targetViewValue);
                            }
                            break;
                        }
                    }
                }
                if(this.targetViewValue==null){
                    this.targetViewValue=this.addAutoChild(this.targetView);
                }
                if(this.targetViewValue==null){
                    isc.logWarn("TargetView "+this.targetView+" was not found.");
                }
            }
        }else{
            if(this.targetView){
                this.targetViewValue=this.targetView;
            }else if(this.inlineView){
                this.targetViewValue=isc[this.inlineView._constructor].create(this.inlineView);
                if(this._process.containerId){
                    window[this._process.containerId].addMember(this.targetViewValue);
                }
            }
        }
        if(this.targetVM&&isc.isA.String(this.targetVM)){
            if(process.state[this.targetVM]){
                this.targetVMValue=process.getStateVariable(this.targetVM);
            }else{
                this.targetVMValue=window[this.targetVM];
                if(this.targetVMValue==null){
                    isc.logWarn("TargetVM "+this.targetVM+" was not found.");
                }
            }
        }else{
            this.targetVMValue=this.targetVM;
        }
        if(this.targetForm&&isc.isA.String(this.targetForm)){
            if(process.state[this.targetForm]){
                this.targetFormValue=process.getStateVariable(this.targetForm);
            }else{
                this.targetFormValue=window[this.targetForm];
                if(this.targetFormValue==null){
                    isc.logWarn("TargetForm "+this.targetForm+" was not found.");
                }
            }
        }else{
            this.targetFormValue=this.targetForm;
        }
        if(this.targetViewValue==null){
            isc.logWarn("TargetView or inlineView should be set for UserTask");
            return true;
        }
        if(this.targetFormValue==null&&isc.isA.DynamicForm(this.targetViewValue)){
            this.targetFormValue=this.targetViewValue;
        }
        if(this.targetFormValue==null&&this.targetVMValue==null){
            isc.logWarn("Either targetForm or targetVM should be set for UserTask or "+
                "targetView should be a DynamicForm");
            return true;
        }
        this.targetViewValue.showRecursively();
        var values=null;
        if(this.inputField){
            if(this.inputField.startsWith("$")){
                values=isc.clone(this._resolveInputField(this.inputField,process));
            }else{
                values=isc.clone(process.getStateVariable(this.inputField));
            }
        }else if(this.inputFieldList){
            values={};
            for(var i=0;i<this.inputFieldList.length;i++){
                var key=this.inputFieldList[i];
                var ldi=key.lastIndexOf(".");
                if(ldi>0){
                    key=key.substring(ldi+1);
                }
                values[key]=isc.clone(process.getStateVariable(this.inputFieldList[i]));
            }
        }
        if(this.targetVMValue){
            if(values)this.targetVMValue.setValues(values);
            this.targetVMValue.userTask=this;
        }
        if(this.targetFormValue){
            if(values)this.targetFormValue.setValues(values);
            this.targetFormValue.saveToServer=(this.saveToServer==true);
            this.targetFormValue.userTask=this;
        }
        return false;
    }
,isc.A.getElementDescription=function isc_UserTask_getElementDescription(){
        var showTarget={type:"[nothing]"};
        if(this.targetView){
            showTarget={type:"targetView",ID:(isc.isA.String(this.targetView)?this.targetView:null)};
        }else if(this.inlineView){
            showTarget={type:"inlineView"};
        }
        return"Show "+(showTarget.ID?"'"+showTarget.ID+"' ":"")+showTarget.type+" and wait for input";
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("StateTask","Task");
isc.A=isc.StateTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.editorType="StateTaskEditor"
;
isc.B.push(isc.A.executeElement=function isc_StateTask_executeElement(process){
        if(this.value==null&&this.inputField==null&&this.inputFieldList==null){
            isc.logWarn("StateTask: value, inputField or inputFieldList should be set.");
            return true;
        }
        if(this.value==null&&this.inputField==null){
            if(this.outputFieldList==null||this.outputFieldList.length!=this.inputFieldList.length){
                isc.logWarn("StateTask: outputFieldList should have same number of parameters as inputFieldList.");
                return;
            }
            if(this.type){
                isc.logWarn("StateTask: type cannot be used with multiple outputFields");
            }
            for(var i=0;i<this.inputFieldList.lenght;i++){
                var value=process.getStateVariable(this.inputFieldList[i]);
                process.setStateVariable(this.outputFieldList[i],value);
            }
            return true;
        }
        var value=this.value||this._resolveInputField(this.inputField,process);
        value=this._executePair(value,this.type,process);
        process.setStateVariable(this.outputField,value);
        process.setTaskOutput(this.getClassName(),this.ID,value);
        return true;
    }
,isc.A._executePair=function isc_StateTask__executePair(value,type,process){
        if(value==null){
            isc.logWarn("StateTask: value is null. Unable to convert to "+type);
            this.fail(process);
            return null;
        }
        if("string"==type){
            return value.toString();
        }else if("boolean"==type){
            if("true"==value)return true;
            if("false"==value)return false;
            if(isc.isA.String(value))return value.length!=0;
            if(isc.isA.Number(value))return value!=0;
            return value!=null;
        }else if("decimal"==type){
            var v=parseFloat(value.toString());
            if(isNaN(v)){
                this.fail(process);
                return null;
            }
            return v;
        }else if("integer"==type){
            var v=parseInt(value.toString());
            if(isNaN(v)){
                this.fail(process);
                return null;
            }
            return v;
        }else if("record"==type){
            if(isc.isAn.Object(value)&&!isc.isAn.Array(value)&&
                    !isc.isAn.RegularExpression(value)&&!isc.isAn.Date(value))
            {
                return value;
            }
            return null;
        }else if("array"==type){
            if(isc.isAn.Array(value))return value;
            return[value];
        }else{
            return value;
        }
    }
,isc.A.fail=function isc_StateTask_fail(process){
        if(this.failureElement==null){
            isc.logWarn("There is no failureElement in stateTask");
        }else{
            process.setNextElement(this.failureElement);
        }
    }
,isc.A.getElementDescription=function isc_StateTask_getElementDescription(){
        var description="no-op";
        if(this.value!=null){
            description="Set "+this.outputField+"="+this.value;
        }else if(this.type!=null){
            description="Set "+this.outputField+"="+this.inputField+" as "+this.type;
        }else if(this.inputField||this.inputFieldList){
            description="Copy "+(this.inputField?this.inputField:this.inputFieldList.join(","))+" to "+(this.outputField?this.outputField:this.outputFieldList.join(","));
        }
        return description;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("StartProcessTask","ScriptTask");
isc.A=isc.StartProcessTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.isAsync=true;
isc.B.push(isc.A.execute=function isc_StartProcessTask_execute(input,inputRecord){
        if(!this.process){
            this.logWarn("StartProcessTask with no process. Skipped");
            return;
        }
        var process=this.process,
            finished=process.finished,
            _this=this
        ;
        process.finished=function(state){
            if(finished)finished(state);
            _this.setOutputRecord(state);
        }
        this.isAsync=true;
        process.setState(inputRecord);
        process.start();
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("EndProcessTask","ProcessElement");
isc.A=isc.EndProcessTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.editorPlaceholder=true;
isc.B.push(isc.A.executeElement=function isc_EndProcessTask_executeElement(process){
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("ShowMessageTask","ProcessElement");
isc.A=isc.ShowMessageTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.classDescription="Show a message in a modal dialog";
isc.A.editorType="ShowMessageTaskEditor";
isc.A.type="normal";
isc.A._typeDescriptionMap={
        "normal":"",
        "warning":"warning",
        "error":"error"
    };
isc.B.push(isc.A.executeElement=function isc_ShowMessageTask_executeElement(process){
        var messageType=this.type,
            callback=function(){process.start()}
        ;
        if(messageType=="normal"){
            isc.say(this.message,callback);
        }else if(messageType=="warning"){
            isc.warn(this.message,callback);
        }else if(messageType=="error"){
            isc.Dialog.create({
                message:this.message,
                icon:isc.Dialog.getInstanceProperty("errorIcon"),
                buttons:[
                    isc.Button.create({title:"OK"})
                ],
                buttonClick:function(button,index){
                    callback();
                }
            });
        }else{
            return true;
        }
        return false;
    }
,isc.A.getElementDescription=function isc_ShowMessageTask_getElementDescription(){
        var message=this.message||"",
            messageParts=message.split(" "),
            shortMessage=messageParts.getRange(0,3).join(" "),
            type=this.type||"message"
        ;
        if(shortMessage.length>25)shortMessage=shortMessage.substring(0,25);
        if(shortMessage!=message)shortMessage+=" ...";
        return"Show "+this._typeDescriptionMap[type]+" message:<br>"+shortMessage;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("AskForValueTask","UserConfirmationGateway");
isc.A=isc.AskForValueTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.title="Ask for Value";
isc.A.classDescription="Ask the user to input a value";
isc.A.editorType="AskForValueTaskEditor";
isc.B.push(isc.A.executeElement=function isc_AskForValueTask_executeElement(process){
        var properties=(this.defaultValue?{defaultValue:this.defaultValue}:null);
        var task=this;
        isc.askForValue(this.message,function(value){
            if(value){
                process.setTaskOutput(task.getClassName(),task.ID,value);
                if(task.nextElement)process.setNextElement(task.nextElement);
            }else{
                if(!task.failureElement){
                    task.logWarn("Ask For Value Task does not have a failureElement. Process is aborting.");
                }
                process.setNextElement(task.failureElement);
            }
            process.start();
        },properties);
        return false;
    }
,isc.A.getElementDescription=function isc_AskForValueTask_getElementDescription(){
        var description="Ask user for a value";
        return description;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("ShowNotificationTask","ProcessElement");
isc.A=isc.ShowNotificationTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.classDescription="Show a message which fades out automatically";
isc.A.editorType="ShowNotificationTaskEditor";
isc.A.autoDismiss=true;
isc.A.position="T";
isc.A.notifyType="message";
isc.A._notifyTypeDescriptionMap={
        "message":"",
        "warn":"warning",
        "error":"error"
    };
isc.B.push(isc.A.executeElement=function isc_ShowNotificationTask_executeElement(process){
        var notifyType=this.notifyType,
            settings={position:this.position};
        if(!this.autoDismiss){
            settings.duration=0;
            settings.canDismiss=true;
        }
        isc.Notify.addMessage(this.message,null,notifyType,settings);
        return true;
    }
,isc.A.getElementDescription=function isc_ShowNotificationTask_getElementDescription(){
        var message=this.message||"",
            messageParts=message.split(" "),
            shortMessage=messageParts.getRange(0,3).join(" "),
            notifyType=this.notifyType||"message"
        ;
        if(shortMessage.length>25)shortMessage=shortMessage.substring(0,25);
        if(shortMessage!=message)shortMessage+=" ...";
        return"Show "+this._notifyTypeDescriptionMap[notifyType]+" notification:<br>"+
            shortMessage;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("StartTransactionTask","ProcessElement");
isc.A=isc.StartTransactionTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.classDescription="Starts queuing all DataSource operations so they can be sent "+
        "to the server all together as a transaction";
isc.A.editorType=null;
isc.B.push(isc.A.executeElement=function isc_StartTransactionTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        isc.RPC.startQueue();
        return true;
    }
,isc.A.getElementDescription=function isc_StartTransactionTask_getElementDescription(){
        return"Start queuing";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("SendTransactionTask","ProcessElement");
isc.A=isc.SendTransactionTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.classDescription="Sends any currently queued DataSource operations "+
        "as a single transactional request to the server";
isc.A.editorType=null;
isc.B.push(isc.A.executeElement=function isc_SendTransactionTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        isc.RPC.sendQueue();
        return true;
    }
,isc.A.getElementDescription=function isc_SendTransactionTask_getElementDescription(){
        return"Send queue";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("ComponentTask","ProcessElement");
isc.A=isc.ComponentTask;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.isApplicableComponent=function isc_c_ComponentTask_isApplicableComponent(component){
        var clazz=(component.getClass?component.getClass():null);
        if(!clazz)return false;
        var baseClasses=this.getInstanceProperty("componentBaseClass"),
            requiresDataSource=this.getInstanceProperty("componentRequiresDataSource")||false
        ;
        baseClasses=(isc.isAn.Array(baseClasses)?baseClasses:[baseClasses]);
        for(var i=0;i<baseClasses.length;i++){
            if(clazz.isA(baseClasses[i])&&(!requiresDataSource||component.dataSource)){
                return true;
            }
        }
        return false;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.ComponentTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getComponentBaseClasses=function isc_ComponentTask_getComponentBaseClasses(){
        return(isc.isAn.Array(this.componentBaseClass)?this.componentBaseClass:[this.componentBaseClass]);
    }
,isc.A.getTargetComponent=function isc_ComponentTask_getTargetComponent(process){
        if(!this.componentId){
            this.logWarn("ComponentTask with no componentId. Task skipped");
            return null;
        }
        var component=window[this.componentId];
        if(!component){
            if(process&&process.screenComponent){
                component=process.screenComponent.getByLocalId(this.componentId);
            }
            if(!component){
                this.logWarn("Component not found for ID "+this.componentId+" not found. Task skipped");
                return null;
            }
        }
        var baseClasses=this.getComponentBaseClasses();
        for(var i=0;i<baseClasses.length;i++){
            if(component.isA(baseClasses[i]))return component;
        }
        this.logWarn("Component type '"+component.getClassName()+"' is not supported for "+this.getClassName()+". Task skipped");
        return null;
    }
,isc.A.getLocalComponent=function isc_ComponentTask_getLocalComponent(process,componentId){
        if(!componentId)return null;
        var component=window[componentId];
        if(!component){
            if(process&&process.screenComponent){
                component=process.screenComponent.getByLocalId(componentId);
            }
            if(!component)return null;
        }
        return component;
    }
);
isc.B._maxIndex=isc.C+3;

isc.defineClass("SetLabelTextTask","ComponentTask");
isc.A=isc.SetLabelTextTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="Label";
isc.A.classDescription="Sets the text of a label";
isc.A.editorType="SetLabelTextTaskEditor";
isc.B.push(isc.A.executeElement=function isc_SetLabelTextTask_executeElement(process){
        var label=this.getTargetComponent(process);
        if(!label)return true;
        var value=this.value;
        if(value){
            var values=this._resolveObjectDynamicExpressions({value:value},null,null,process);
            value=values.value;
        }
        label.setContents(value);
        return true;
    }
,isc.A.getElementDescription=function isc_SetLabelTextTask_getElementDescription(){
        var description="Set '"+this.componentId+"' text";
        return description;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("SetButtonTitleTask","ComponentTask");
isc.A=isc.SetButtonTitleTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["Button","Window"];
isc.A.classDescription="Sets the title of a button or window";
isc.A.editorType="SetButtonTitleTaskEditor";
isc.B.push(isc.A.executeElement=function isc_SetButtonTitleTask_executeElement(process){
        var button=this.getTargetComponent(process);
        if(!button)return true;
        var title=this.title;
        if(title){
            var values=this._resolveObjectDynamicExpressions({value:title},null,null,process);
            title=values.value;
        }
        button.setTitle(title);
        return true;
    }
,isc.A.getElementDescription=function isc_SetButtonTitleTask_getElementDescription(){
        var description="Set '"+this.componentId+"' title";
        return description;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("ShowComponentTask","ComponentTask");
isc.A=isc.ShowComponentTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="Canvas";
isc.A.title="Show";
isc.A.classDescription="Show a currently hidden component";
isc.A.editorType="ShowComponentTaskEditor";
isc.B.push(isc.A.executeElement=function isc_ShowComponentTask_executeElement(process){
        var canvas=this.getTargetComponent(process);
        if(!canvas)return true;
        canvas.show();
        return true;
    }
,isc.A.getElementDescription=function isc_ShowComponentTask_getElementDescription(){
        return"Show "+this.componentId;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("HideComponentTask","ComponentTask");
isc.A=isc.HideComponentTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="Canvas";
isc.A.title="Hide";
isc.A.classDescription="Hide a component";
isc.A.editorType="HideComponentTaskEditor";
isc.B.push(isc.A.executeElement=function isc_HideComponentTask_executeElement(process){
        var canvas=this.getTargetComponent(process);
        if(!canvas)return true;
        canvas.hide();
        return true;
    }
,isc.A.getElementDescription=function isc_HideComponentTask_getElementDescription(){
        return"Hide "+this.componentId;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormSetValuesTask","ComponentTask");
isc.A=isc.FormSetValuesTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.componentRequiresDataSource=true;
isc.A.classDescription="Set form values";
isc.A.editorType="FormSetValuesTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormSetValuesTask_executeElement(process){
        this.process=process;
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var data=null;
        if(this.values){
            data=this._resolveObjectDynamicExpressions(this.values,null,null,process);
        }
        if(this.fixedValues){
            for(var key in this.fixedValues){
                data[key]=this.fixedValues[key];
            }
        }
        form.setValues(data);
        return true;
    }
,isc.A.getElementDescription=function isc_FormSetValuesTask_getElementDescription(){
        return"Set '"+this.componentId+"' values";
    }
,isc.A.getOutputSchema=function isc_FormSetValuesTask_getOutputSchema(){
        var form=this.getTargetComponent(this.process);
        if(!form)return null;
        return form.getDataSource();
    }
);
isc.B._maxIndex=isc.C+3;

isc.defineClass("FormSetFieldValueTask","ComponentTask");
isc.A=isc.FormSetFieldValueTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.componentRequiresDataSource=true;
isc.A.classDescription="Put a value into just one field of a form";
isc.A.editorType="FormSetFieldValueTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormSetFieldValueTask_executeElement(process){
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var value=this.value;
        if(value){
            var values=this._resolveObjectDynamicExpressions({value:value},null,null,process);
            value=values.value;
        }
        form.setValue(this.targetField,value);
        return true;
    }
,isc.A.getElementDescription=function isc_FormSetFieldValueTask_getElementDescription(){
        return"Set '"+this.componentId+"."+this.targetField+"' value";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormClearValuesTask","ComponentTask");
isc.A=isc.FormClearValuesTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.classDescription="Clear form values and errors";
isc.A.editorType="FormClearValuesTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormClearValuesTask_executeElement(process){
        var form=this.getTargetComponent(process);
        if(!form)return true;
        form.clearValues();
        return true;
    }
,isc.A.getElementDescription=function isc_FormClearValuesTask_getElementDescription(){
        return"Clear '"+this.componentId+"' values";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormResetValuesTask","ComponentTask");
isc.A=isc.FormResetValuesTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.classDescription="Reset values in a form to defaults";
isc.A.editorType="FormResetValuesTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormResetValuesTask_executeElement(process){
        var form=this.getTargetComponent(process);
        if(!form)return true;
        form.resetValues();
        return true;
    }
,isc.A.getElementDescription=function isc_FormResetValuesTask_getElementDescription(){
        return"Reset '"+this.componentId+"' values";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormValidateValuesTask","ComponentTask");
isc.A=isc.FormValidateValuesTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.classDescription="Validate a form and show errors to user";
isc.A.editorType="FormValidateValuesTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormValidateValuesTask_executeElement(process){
        var form=this.getTargetComponent(process);
        if(!form)return true;
        form.validate();
        return true;
    }
,isc.A.getElementDescription=function isc_FormValidateValuesTask_getElementDescription(){
        return"Validate '"+this.componentId+"' values";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormSaveDataTask","ComponentTask");
isc.A=isc.FormSaveDataTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.classDescription="Save changes made in a form (validates first)";
isc.A.editorType="FormSaveDataTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormSaveDataTask_executeElement(process){
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var params=isc.addProperties({},this.requestProperties,{willHandleError:true});
        var task=this;
        form.saveData(function(dsResponse,data,request){
            var results=dsResponse.results;
            if(dsResponse.isStructured&&
                (!results||results.status<0||(results.status==null&&dsResponse.status<0)))
            {
                if(!isc.RPC.runDefaultErrorHandling(dsResponse,request,task.errorFormatter)){
                    task.fail(process);
                    return;
                }
            }
            process.start();
        },params);
        return false;
    }
,isc.A.fail=function isc_FormSaveDataTask_fail(process){
        if(!this.failureElement){
            this.logWarn("FormSaveDataTask does not have a failureElement. Process is aborting.");
        }
        process.setNextElement(this.failureElement);
    }
,isc.A.errorFormatter=function isc_FormSaveDataTask_errorFormatter(codeName,response,request){
        if(codeName=="VALIDATION_ERROR"){
            var errors=response.errors,
                message=["Server returned validation errors:<BR><UL>"]
            ;
            if(!isc.isAn.Array(errors))errors=[errors];
            for(var i=0;i<errors.length;i++){
                var error=errors[i];
                for(var field in error){
                    var fieldErrors=error[field];
                    message.add("<LI><B>"+field+":</B> ");
                    if(!isc.isAn.Array(fieldErrors))fieldErrors=[fieldErrors];
                    for(var j=0;j<fieldErrors.length;j++){
                        var fieldError=fieldErrors[j];
                        message.add((j>0?"<BR>":"")+(isc.isAn.Object(fieldError)?fieldError.errorMessage:fieldError));
                    }
                    message.add("</LI>");
                }
            }
            message.add("</UL>");
            return message.join("");
        }
        return null;
    }
,isc.A.getElementDescription=function isc_FormSaveDataTask_getElementDescription(){
        return"Save '"+this.componentId+"' data";
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("FormEditNewRecordTask","ComponentTask");
isc.A=isc.FormEditNewRecordTask;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._paramProperties=["record"];
isc.B.push(isc.A.createInitPropertiesFromAction=function isc_c_FormEditNewRecordTask_createInitPropertiesFromAction(action,sourceMethod){
        var properties={},
            mappings=action.mapping||[]
        ;
        for(var i=0;i<mappings.length;i++){
            var mapping=mappings[i];
            if(mapping=="null")mapping=null;
            properties[this._paramProperties[i]]=mapping;
        }
        return properties;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.FormEditNewRecordTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.classDescription="Start editing a new record";
isc.A.editorType="FormEditNewRecordTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormEditNewRecordTask_executeElement(process){
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var values;
        if(this.initialValues){
            values=this._resolveObjectDynamicExpressions(this.initialValues,null,null,process);
        }
        form.editNewRecord(values);
        return true;
    }
,isc.A.getElementDescription=function isc_FormEditNewRecordTask_getElementDescription(){
        return"Edit '"+this.componentId+"' new record";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormEditRecordTask","FormEditNewRecordTask");
isc.A=isc.FormEditRecordTask;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._paramProperties=["record"];
isc.B.push(isc.A.createInitPropertiesFromAction=function isc_c_FormEditRecordTask_createInitPropertiesFromAction(action,sourceMethod){
        var properties={},
            mappings=action.mapping||[]
        ;
        for(var i=0;i<mappings.length;i++){
            var mapping=mappings[i];
            if(mapping=="null")mapping=null;
            properties[this._paramProperties[i]]=mapping;
        }
        return properties;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.FormEditRecordTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.componentRequiresDataSource=true;
isc.A.editorType="FormEditRecordTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormEditRecordTask_executeElement(process){
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var recordSourceComponentId=this.recordSourceComponent;
        if(!recordSourceComponentId){
            this.logWarn("recordSourceComponent not specified on task. Task skipped.");
            return true;
        }
        var recordSourceComponent=this.getLocalComponent(process,recordSourceComponentId);
        if(!recordSourceComponent){
            this.logWarn("recordSourceComponent '"+recordSourceComponentId+"' not found. Task skipped.");
            return true;
        }
        var values=this.initialValues;
        if(isc.isA.ListGrid(recordSourceComponent)&&recordSourceComponent.anySelected()){
            values=recordSourceComponent.getSelectedRecord();
        }else if(isc.isA.DynamicForm(recordSourceComponent)){
            values=recordSourceComponent.getValues();
        }else if(isc.isA.ListGrid(recordSourceComponent)){
            values=recordSourceComponent.getRecord(0);
        }else if(isc.isA.DetailViewer(recordSourceComponent)){
            values=recordSourceComponent.data[0];
        }
        form.editRecord(values);
        return true;
    }
,isc.A.getElementDescription=function isc_FormEditRecordTask_getElementDescription(){
        return"Edit '"+this.componentId+"' from other record";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormEditSelectedTask","ComponentTask");
isc.A=isc.FormEditSelectedTask;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._paramProperties=["selectionComponent"];
isc.B.push(isc.A.createInitPropertiesFromAction=function isc_c_FormEditSelectedTask_createInitPropertiesFromAction(action,sourceMethod){
        var properties={},
            mappings=action.mapping||[]
        ;
        for(var i=0;i<mappings.length;i++){
            var mapping=mappings[i];
            if(mapping=="null")mapping=null;
            properties[this._paramProperties[i]]=mapping;
        }
        return properties;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.FormEditSelectedTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.componentRequiresDataSource=true;
isc.A.title="Edit Selected Record";
isc.A.classDescription="Edit a record currently showing in some other component";
isc.A.editorType="FormEditSelectedTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormEditSelectedTask_executeElement(process){
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var selectionComponentId=this.selectionComponentId;
        if(!selectionComponentId){
            this.logWarn("selectionComponentId not specified on task. Task skipped.");
            return true;
        }
        var selectionComponent=this.getLocalComponent(process,selectionComponentId);
        if(!selectionComponent){
            this.logWarn("selectionComponent '"+selectionComponentId+"' not found. Task skipped.");
            return true;
        }
        var values=null;
        if(selectionComponent.getSelectedRecord){
            values=selectionComponent.getSelectedRecord();
        }
        form.editRecord(values);
        return true;
    }
,isc.A.getElementDescription=function isc_FormEditSelectedTask_getElementDescription(){
        return"Edit '"+this.componentId+"' from selected record";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormHideFieldTask","ComponentTask");
isc.A=isc.FormHideFieldTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="DynamicForm";
isc.A.title="Show / Hide Field";
isc.A.classDescription="Show or hide a field of a form";
isc.A.editorType="FormHideFieldTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormHideFieldTask_executeElement(process){
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var targetField=this.targetField;
        if(!targetField){
            this.logWarn("targetField not specified on task. Task skipped.");
            return true;
        }
        var hide=this.hide;
        if(isc.isA.String(hide))hide=(hide=="true");
        if(hide)form.hideItem(targetField);
        else form.showItem(targetField);
        return true;
    }
,isc.A.getElementDescription=function isc_FormHideFieldTask_getElementDescription(){
        var hide=this.hide;
        if(isc.isA.String(hide))hide=(hide=="true");
        var action=(hide?"Hide":"Show");
        return action+" '"+this.componentId+"."+this.targetField+"'";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormDisableFieldTask","ComponentTask");
isc.A=isc.FormDisableFieldTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="DynamicForm";
isc.A.title="Enable / Disable Field";
isc.A.classDescription="Enable or disable a field of a form";
isc.A.editorType="FormDisableFieldTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormDisableFieldTask_executeElement(process){
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var targetField=this.targetField;
        if(!targetField){
            this.logWarn("targetField not specified on task. Task skipped.");
            return true;
        }
        var disable=this.disable;
        if(isc.isA.String(disable))disable=(disable=="true");
        var field=form.getField(targetField);
        if(field){
            field.setDisabled(disable);
        }
        return true;
    }
,isc.A.getElementDescription=function isc_FormDisableFieldTask_getElementDescription(){
        var disable=this.disable;
        if(isc.isA.String(disable))disable=(disable=="true");
        var action=(disable?"Disable":"Enable");
        return action+" '"+this.componentId+"."+this.targetField+"'";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridFetchDataTask","ComponentTask");
isc.A=isc.GridFetchDataTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["ListGrid","TileGrid","DetailViewer"];
isc.A.componentRequiresDataSource=true;
isc.A.classDescription="Cause a grid to fetch data matching specified criteria";
isc.A.editorType="GridFetchDataTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridFetchDataTask_executeElement(process){
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        var criteria=this._resolveCriteriaExpressions(this.criteria,process.state,process.state,process);
        grid.fetchData(criteria,function(){
            process.start();
        },this.requestProperties);
        return false;
    }
,isc.A.getElementDescription=function isc_GridFetchDataTask_getElementDescription(){
        var description="Fetch data on '"+this.componentId+"'",
            criteria=this.criteria
        ;
        if(!isc.DS.isAdvancedCriteria(criteria)){
            criteria=isc.DS.convertCriteria(criteria);
        }
        var dsFields=isc.XORGateway._processFieldsRecursively(criteria);
        var fieldsDS=isc.DataSource.create({
            addGlobalId:false,
            fields:dsFields
        });
        description+=" where "+isc.DataSource.getAdvancedCriteriaDescription(criteria,fieldsDS);
        fieldsDS.destroy();
        return description;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridFetchRelatedDataTask","ComponentTask");
isc.A=isc.GridFetchRelatedDataTask;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._paramProperties=["record","schema","callback","requestParameters"];
isc.B.push(isc.A.createInitPropertiesFromAction=function isc_c_GridFetchRelatedDataTask_createInitPropertiesFromAction(action,sourceMethod){
        var properties={},
            mappings=action.mapping||[]
        ;
        for(var i=0;i<mappings.length;i++){
            var mapping=mappings[i];
            if(mapping=="null")mapping=null;
            properties[this._paramProperties[i]]=mapping;
        }
        return properties;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.GridFetchRelatedDataTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["ListGrid","TileGrid","DetailViewer"];
isc.A.componentRequiresDataSource=true;
isc.A.classDescription="Cause a grid to fetch data related to a record in another grid";
isc.A.editorType="GridFetchRelatedDataTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridFetchRelatedDataTask_executeElement(process){
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        var recordSourceComponentId=this.recordSourceComponent;
        if(!recordSourceComponentId){
            this.logWarn("recordSourceComponent not specified on task. Task skipped.");
            return true;
        }
        var recordSourceComponent=this.getLocalComponent(process,recordSourceComponentId);
        if(!recordSourceComponent){
            this.logWarn("recordSourceComponent '"+recordSourceComponentId+"' not found. Task skipped.");
            return true;
        }
        var schema=this.dataSource||recordSourceComponent;
        var record=null;
        if(isc.isA.ListGrid(recordSourceComponent)&&recordSourceComponent.anySelected()){
            record=recordSourceComponent.getSelectedRecord();
        }else if(isc.isA.DynamicForm(recordSourceComponent)){
            record=recordSourceComponent.getValues();
        }else if(isc.isA.ListGrid(recordSourceComponent)){
            record=recordSourceComponent.getRecord(0);
        }else if(isc.isA.DetailViewer(recordSourceComponent)){
            record=recordSourceComponent.data[0];
        }
        grid.fetchRelatedData(record,schema,function(){
            process.start();
        });
        return false;
    }
,isc.A.getElementDescription=function isc_GridFetchRelatedDataTask_getElementDescription(){
        return"Fetch '"+this.componentId+"' data from related record";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridRemoveSelectedDataTask","ComponentTask");
isc.A=isc.GridRemoveSelectedDataTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["ListGrid","TileGrid"];
isc.A.classDescription="Remove data that is selected in a grid";
isc.A.editorType="GridRemoveSelectedDataTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridRemoveSelectedDataTask_executeElement(process){
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        grid.removeSelectedData(function(){
            process.start();
        });
        return false;
    }
,isc.A.getElementDescription=function isc_GridRemoveSelectedDataTask_getElementDescription(){
        return"Remove '"+this.componentId+"' selected records";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridStartEditingTask","ComponentTask");
isc.A=isc.GridStartEditingTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="ListGrid";
isc.A.classDescription="Start editing a new record";
isc.A.editorType="GridStartEditingTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridStartEditingTask_executeElement(process){
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        var values;
        if(this.initialValues){
            values=this._resolveObjectDynamicExpressions(this.initialValues,null,null,process);
        }
        grid.startEditingNew(values);
        return true;
    }
,isc.A.getElementDescription=function isc_GridStartEditingTask_getElementDescription(){
        return"Edit '"+this.componentId+"' new record";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridSetEditValueTask","ComponentTask");
isc.A=isc.GridSetEditValueTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="ListGrid";
isc.A.componentRequiresDataSource=true;
isc.A.classDescription="Set a value in an editable grid as if the user had made the edit";
isc.A.editorType="GridSetEditValueTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridSetEditValueTask_executeElement(process){
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        var colNum=this.targetField;
        if(colNum==null){
            this.logWarn("targetField not specified on task. Task skipped.");
            return true;
        }
        var editRow=grid.getEditRow(),
            rowNum=editRow
        ;
        if(rowNum<0){
            var selectedRecord=grid.getSelectedRecord();
            if(selectedRecord){
                rowNum=grid.getRecordIndex(selectedRecord);
            }
        }
        if(rowNum<0){
            if(grid.getRecord(0)!=null){
                rowNum=0;
            }
        }
        var value=this.value;
        if(value){
            var values=this._resolveObjectDynamicExpressions({value:value},null,null,process);
            value=values.value;
        }
        if(rowNum>=0){
            if(rowNum!=editRow){
                grid.startEditing(rowNum,colNum);
                rowNum=grid.getEditRow();
            }
            if(rowNum>=0){
                grid.setEditValue(rowNum,colNum,value);
            }
        }else{
            var initialValues={};
            initialValues[this.targetField]=value;
            grid.startEditingNew(initialValues);
        }
        return true;
    }
,isc.A.getElementDescription=function isc_GridSetEditValueTask_getElementDescription(){
        return"Set '"+this.componentId+"."+this.targetField+"' edit value";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridSaveAllEditsTask","ComponentTask");
isc.A=isc.GridSaveAllEditsTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="ListGrid";
isc.A.classDescription="Save all changes in a grid with auto-saving disabled";
isc.A.editorType="GridSaveAllEditsTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridSaveAllEditsTask_executeElement(process){
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        grid.saveAllEdits(null,function(){
            process.start();
        });
        return false;
    }
,isc.A.getElementDescription=function isc_GridSaveAllEditsTask_getElementDescription(){
        return"Save all '"+this.componentId+"' edits";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridExportDataTask","ComponentTask");
isc.A=isc.GridExportDataTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["ListGrid","TileGrid","DetailViewer"];
isc.A.componentRequiresDataSource=true;
isc.A.title="Export Data (Server)";
isc.A.classDescription="Export data currently shown in a grid";
isc.A.editorType="GridExportDataTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridExportDataTask_executeElement(process){
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        grid.exportData(this.requestProperties,function(){
            process.start();
        });
        return false;
    }
,isc.A.getElementDescription=function isc_GridExportDataTask_getElementDescription(){
        return"Export '"+this.componentId+"' data";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridExportClientDataTask","ComponentTask");
isc.A=isc.GridExportClientDataTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["ListGrid","TileGrid","DetailViewer"];
isc.A.title="Export Data (Client)";
isc.A.classDescription="Export data currently shown in a grid keeping all grid-specific formatting";
isc.A.editorType="GridExportClientDataTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridExportClientDataTask_executeElement(process){
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        grid.exportClientData(this.requestProperties,function(){
            process.start();
        });
        return false;
    }
,isc.A.getElementDescription=function isc_GridExportClientDataTask_getElementDescription(){
        return"Export '"+this.componentId+"' formatted data";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("ShowNextToComponentTask","ComponentTask");
isc.A=isc.ShowNextToComponentTask;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._paramProperties=["nextToComponentId","side","canOcclude","skipAnimation"];
isc.B.push(isc.A.createInitPropertiesFromAction=function isc_c_ShowNextToComponentTask_createInitPropertiesFromAction(action,sourceMethod){
        var properties={},
            mappings=action.mapping||[]
        ;
        for(var i=0;i<mappings.length;i++){
            var mapping=mappings[i];
            if(mapping=="null")mapping=null;
            properties[this._paramProperties[i]]=mapping;
        }
        return properties;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.ShowNextToComponentTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="Canvas";
isc.A.title="Show Next To";
isc.A.classDescription="Show a component next to some other component";
isc.A.editorType="ShowNextToComponentTaskEditor";
isc.B.push(isc.A.executeElement=function isc_ShowNextToComponentTask_executeElement(process){
        var canvas=this.getTargetComponent(process);
        if(!canvas)return true;
        var nextToComponentId=this.nextToComponentId;
        if(!nextToComponentId){
            this.logWarn("nextToComponentId not specified on task. Task skipped.");
            return true;
        }
        var nextToComponent=this.getLocalComponent(process,nextToComponentId);
        if(!nextToComponent){
            this.logWarn("nextToComponentId '"+nextToComponentId+"' not found. Task skipped.");
            return true;
        }
        canvas.showNextTo(nextToComponent,this.side,this.canOcclue,this.skipAnimation);
        return true;
    }
,isc.A.getElementDescription=function isc_ShowNextToComponentTask_getElementDescription(){
        return"Show '"+this.componentId+"' next to '"+this.nextToComponentId+"'";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("SetSectionTitleTask","ComponentTask");
isc.A=isc.SetSectionTitleTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="SectionStack";
isc.A.classDescription="Sets the title of a section in a SectionStack";
isc.A.editorType="SetSectionTitleTaskEditor";
isc.B.push(isc.A.executeElement=function isc_SetSectionTitleTask_executeElement(process){
        var sectionStack=this.getTargetComponent(process);
        if(!sectionStack)return true;
        var sectionName=this.targetSectionName;
        if(!sectionName&&this.targetSectionTitle){
            var sectionNames=sectionStack.getSectionNames();
            for(var i=0;i<sectionNames.length;i++){
                var sectionHeader=sectionStack.getSectionHeader(sectionNames[i]);
                if(sectionHeader&&sectionHeader.title==this.targetSectionTitle){
                    sectionName=sectionNames[i];
                    break;
                }
            }
        }
        if(!sectionName){
            isc.logWarn("Target section not identified by targetSectionName or targetSectionTitle. Task skipped");
            return true;
        }
        var title=this.title;
        if(title){
            var values=this._resolveObjectDynamicExpressions({value:title},null,null,process);
            title=values.value;
        }
        sectionStack.setSectionTitle(sectionName,title);
        return true;
    }
,isc.A.getElementDescription=function isc_SetSectionTitleTask_getElementDescription(){
        return"Set '"+this.componentId+"' section title";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("NavigateListPaneTask","ComponentTask");
isc.A=isc.NavigateListPaneTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="TriplePane";
isc.A.classDescription="Navigate to the List pane in a TriplePane, using the selection "+
        "in the Navigation pane to refresh the list, if applicable";
isc.A.editorType="NavigateListPaneTaskEditor";
isc.B.push(isc.A.executeElement=function isc_NavigateListPaneTask_executeElement(process){
        var triplePane=this.getTargetComponent(process);
        if(!triplePane)return true;
        var title=this.title;
        if(title){
            var values=this._resolveObjectDynamicExpressions({value:title},null,null,process);
            title=values.value;
        }
        triplePane.navigateListPane(title);
        return true;
    }
,isc.A.getElementDescription=function isc_NavigateListPaneTask_getElementDescription(){
        return"Navigate '"+this.componentId+"' list pane";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("NavigateDetailPaneTask","ComponentTask");
isc.A=isc.NavigateDetailPaneTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["SplitPane","TriplePane"];
isc.A.classDescription="Navigate to the Detail pane in a SplitPane or TriplePane, "+
        "using the selection in the Navigation pane (for SplitPane) or List Pane (for TriplePane)";
isc.A.editorType="NavigateDetailPaneTaskEditor";
isc.B.push(isc.A.executeElement=function isc_NavigateDetailPaneTask_executeElement(process){
        var splitPane=this.getTargetComponent(process);
        if(!splitPane)return true;
        var title=this.title;
        if(title){
            var values=this._resolveObjectDynamicExpressions({value:title},null,null,process);
            title=values.value;
        }
        splitPane.navigateDetailPane(title);
        return true;
    }
,isc.A.getElementDescription=function isc_NavigateDetailPaneTask_getElementDescription(){
        return"Navigate '"+this.componentId+"' detail pane";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("WorkflowEditor","VStack");
isc.A=isc.WorkflowEditor.getPrototype();
isc.A.elementWidth=180;
isc.A.elementHeight=100;
isc.A.elementSpacing=45;
isc.A.lineSpacing=40;
isc.A.autoWrapSequences=false;
isc.A.autoWrapSequenceCount=6;
isc.A.markUnreferencedTasks=true;
isc.A.unnamedSequencePrefix="_notNamed_";
isc.A.linkColor="#7B8284";
isc.A.linkWidth=2;
isc.A.connectorLineColors=[
        "#2ecc71",
        "#4d89f9",
        "#2de0e0",
        "#99FF33",
        "#639966",
        "#63CCCC",
        "#6366FF",
        "#999999",
        "#00FF00",
        "#00CCFF",
        "#996366",
        "#C0C0C0",
        "#000000",
        "#996100",
        "#3498db",
        "#006300",
        "#1abc9c",
        "#000080",
        "#636399",
        "#636363"
    ];
isc.A.failureConnectorLineColors=[
        "#df5545",
        "#e0e02d",
        "#e02de0",
        "#FF9933",
        "#9933FF",
        "#800080",
        "#FF00FF",
        "#FFCC00",
        "#c0392b",
        "#FFC312",
        "#FDA7D0",
        "#EE5A24",
        "#9980FA",
        "#B53471",
        "#D980FA",
        "#F79F1F",
        "#b71540",
        "#8e44ad",
        "#EA2027",
        "#E58E26"
    ];
isc.A.unreferencedLineColor="black";
isc.A.unreferencedLinkPointBackgroundColor="red";
isc.A.unreferencedLinkPointForegroundColor="white";
isc.A.startLineColor="#7B8284";
isc.A.startLinkPointBorderColor="#6bd77d";
isc.A.startLinkPointBackgroundColor="#b4f1c3";
isc.A.gatewayPlaceholderTaskType="EndProcessTask";
isc.A.addElementTitle="Add a step";
isc.A.addElementHint="Pick a task...";
isc.A.canceledLinkPrompt="canceled";
isc.A.failedLinkPrompt="failed";
isc.A.continuationLinkPrompt="continuation";
isc.A.startTaskLinkPrompt="Initial task to be executed";
isc.A.unreferencedTaskLinkPrompt="No other tasks currently lead to this task so it will never be executed";
isc.A.newElementTypes=[
        {title:"DataSource Tasks",prefix:"DataSource",icon:"workflow/dataSourceTasks.png",canSelect:false,children:[
            {icon:"workflow/fetch.png",
                elementType:"DSFetchTask"
            },
            {icon:"workflow/update.png",
                elementType:"DSUpdateTask"
            },
            {icon:"workflow/add.png",
                elementType:"DSAddTask"
            },
            {icon:"workflow/remove.png",
                elementType:"DSRemoveTask"
            }
          ]
        },
        {title:"Grid Tasks",prefix:"Grid",icon:"workflow/gridTasks.png",canSelect:false,children:[
            {icon:"workflow/fetch.png",
                elementType:"GridFetchDataTask"
            },{icon:"workflow/fetch.png",
                elementType:"GridFetchRelatedDataTask"
            },{icon:"workflow/remove.png",
                elementType:"GridRemoveSelectedDataTask"
            },{icon:"workflow/edit.png",
                elementType:"GridStartEditingTask"
            },{icon:"workflow/save.png",
                elementType:"GridSaveAllEditsTask"
            },{icon:"workflow/export.png",
                elementType:"GridExportDataTask"
            },{icon:"workflow/export.png",
                elementType:"GridExportClientDataTask"
            },{icon:"workflow/setValue.png",
                elementType:"GridSetEditValueTask"
            }
          ]
        },
        {title:"Form Tasks",prefix:"Form",icon:"workflow/formTasks.png",canSelect:false,children:[
            {icon:"workflow/setValue.png",
                elementType:"FormSetValuesTask"
            },{icon:"workflow/showOrHide.png",
                elementType:"FormHideFieldTask"
            },{icon:"workflow/enableOrDisable.png",
                elementType:"FormDisableFieldTask"
            },{icon:"workflow/save.png",
                elementType:"FormSaveDataTask"
            },{icon:"workflow/update.png",
                elementType:"FormEditSelectedTask"
            },{icon:"workflow/edit.png",
                elementType:"FormEditNewRecordTask"
            },{icon:"workflow/setValue.png",
                elementType:"FormSetFieldValueTask"
            },{icon:"workflow/remove.png",
                elementType:"FormClearValuesTask"
            },{icon:"workflow/validate.png",
                elementType:"FormValidateValuesTask"
            }
          ]
        },
        {title:"Widget Tasks",icon:"workflow/widgetTasks.png",canSelect:false,children:[
            {icon:"workflow/setLabelText.png",
                elementType:"SetLabelTextTask"
            },{icon:"workflow/setButtonText.png",
                elementType:"SetButtonTitleTask"
            },{icon:"workflow/setSectionTitle.png",
                elementType:"SetSectionTitleTask"
            },{icon:"workflow/show.png",
                elementType:"ShowComponentTask"
            },{icon:"workflow/hide.png",
                elementType:"HideComponentTask"
            },{icon:"workflow/showNextTo.png",
                elementType:"ShowNextToComponentTask"
            },{icon:"workflow/showMessage.png",
                elementType:"ShowMessageTask"
            },{icon:"workflow/askForValue.png",
                elementType:"AskForValueTask"
            },{icon:"workflow/showNotification.png",
                elementType:"ShowNotificationTask"
            },{icon:"workflow/navigate.png",
                elementType:"NavigateListPaneTask"
            },{icon:"workflow/navigate.png",
                elementType:"NavigateDetailPaneTask"
            }
          ]
        },
        {title:"Decisions",icon:"workflow/decisions.png",canSelect:false,children:[
            {icon:"workflow/singleDecision.png",
                elementType:"XORGateway"
            },
            {icon:"workflow/multiDecision.png",
                elementType:"DecisionGateway"
            },
            {icon:"workflow/confirm.png",
                elementType:"UserConfirmationGateway"
            }
          ]
        },
        {title:"Advanced Tasks",icon:null,canSelect:false,children:[
            {icon:null,
                elementType:"StartTransactionTask"
            },
            {icon:null,
                elementType:"SendTransactionTask"
            }
          ]
        }
    ];
isc.A.arrowOffsetX=10;
isc.A.arrowOffsetY=5;
isc.A.showSolidArrows=true;
isc.A.unreferencedLinkPointSize=24;
isc.A.divergingLinkPointSize=6;
isc.A.divergingLinkStartPointSpread=10
;

isc.A=isc.WorkflowEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.containerDefaults={
        _constructor:isc.VStack,
        height:"100%",
        overflow:"auto",
        destroyWorkflowComponents:function(){
            this.destroyPromptPanes();
            this.destroyMembers();
        },
        destroyMembers:function(){
            var members=this.getMembers().duplicate();
            this.removeMembers(members);
            for(var i=0;i<members.length;i++){
                members[i].destroy();
            }
        },
        addPromptPanes:function(promptPanes){
            this._promptPanes=promptPanes;
            for(var i=0;i<promptPanes.length;i++){
                this.addChild(promptPanes[i]);
            }
        },
        destroyPromptPanes:function(){
            var promptPanes=this._promptPanes;
            if(!promptPanes)return;
            for(var i=0;i<promptPanes.length;i++){
                this.removeChild(promptPanes[i]);
                promptPanes[i].destroy()
            }
            this._promptPanes=null;
        }
    };
isc.A.elementDefaults={
        _constructor:"WorkflowEditorElement",
        updateElementFromNode:function(node){
            this.prompt=node.prompt;
            if(this.title!=node.title)
                this.setContents(node.title);
        },
        doubleClick:function(){
            if(this.creator.canEditElements&&this.canEdit){
                var node=this._node,
                    editor=this.creator
                ;
                editor.editElementClick(node.element);
                return false;
            }
        }
    };
isc.A.elementAddDefaults={
        _constructor:"WorkflowEditorElement",
        _addElement:true,
        contributeToRuleContext:false,
        styleName:"processElementNew",
        createCanvas:function(){
            var _this=this,
                newElementTree=this.creator.newElementTypeTree,
                hint=this.creator.addElementHint
            ;
            var form=isc.DynamicForm.create({
                numCols:1,
                layoutAlign:"center",
                width:140,
                fields:[
                    {name:"type",
                        type:"SelectItem",
                        showTitle:false,
                        width:"*",
                        hint:hint,
                        showHintInField:true,
                        getClientPickListData:function(){return newElementTree;},
                        valueField:"elementType",
                        displayField:"title",
                        dataSetType:"tree",
                        pickListHeight:null,
                        pickListMaxWidth:null,
                        pickListFields:[
                            {name:"title",autoFitWidth:true},
                            {name:"description",width:"*"}
                        ],
                        pickListProperties:{
                            showHeader:false,
                            autoFitData:"both",
                            showClippedValuesOnHover:true,
                            getCellStyle:function(record,rowNum,colNum){
                                var workflowEditor=_this.creator,
                                    style=this.Super("getCellStyle",arguments)
                                ;
                                if(!workflowEditor.isAvailableElement(record)){
                                    var baseStyle=this.getBaseStyle(record,rowNum,colNum);
                                    if(baseStyle==style)style+="Disabled";
                                }
                                return style;
                            }
                        },
                        changed:function(form,item,value){
                            var workflowEditor=_this.creator,
                                selectedRecord=item.getSelectedRecord(),
                                element=(_this._node?_this._node.element:null)
                            ;
                            workflowEditor.addElementClick(element,value,selectedRecord.elementDefaults,_this.previousNode,function(node,rebuild){
                                if(rebuild){
                                    workflowEditor.rebuildWorkflow();
                                    workflowEditor.drawWorkflow();
                                }else{
                                    if(node)_this.previousNode=node;
                                    item.clearValue();
                                }
                            });
                        }
                    }
                ],
                draw:function(){
                    this.Super("draw",arguments);
                    if(!this._hasDrawn){
                        this._hasDrawn=true;
                        if(_this.autoOpenTaskList){
                            this.delayCall("initialFocusTaskList",[],10);
                        }
                    }
                },
                initialFocusTaskList:function(){
                    this.focus();
                    var field=this.getField("type"),
                        parents=this.getParentElements(),
                        parentWindow
                    ;
                    for(var i=0;i<parents.length;i++){
                        if(isc.isA.Window(parents[i])){
                            parentWindow=parents[i];
                            break;
                        }
                    }
                    if(parentWindow&&parentWindow.isAnimating()){
                        var showPicker=function(){
                            field.showPicker();
                        }
                        isc.Page.waitFor(parentWindow,"animateShowComplete",showPicker);
                    }else{
                        field.showPicker();
                    }
                }
            });
            return form;
        }
    };
isc.A.elementRowDefaults={
        _constructor:isc.HLayout,
        height:1,
        width:1
    };
isc.A.elementSegmentDefaults={
        _constructor:isc.VLayout,
        height:1,
        width:1
    };
isc.A.drawPaneDefaults={
        _constructor:isc.DrawPane,
        visibility:"hidden",
        resizeToMatch:function(source){
            this.resizeTo(source.getScrollWidth(),source.getScrollHeight());
        }
    };
isc.A.promptDrawPaneDefaults={
        _constructor:isc.DrawPane,
        canHover:true,
        hoverDelay:0,
        hoverWrap:false,
        hoverAutoFitMaxWidth:250
    };
isc.A._actionTargetPrefixes={
        "ListGrid":"Grid",
        "DynamicForm":"Form"
    };
isc.A._actionTargetExceptions={
        "ShowTask":"ShowComponentTask",
        "HideTask":"HideComponentTask",
        "ShowNextToTask":"ShowNextToComponentTask"
    };
isc.A.canRemoveElements=true;
isc.A.removeIcon="[SKIN]/actions/remove.png";
isc.A.removeIconSize=16;
isc.A.removeIconPrompt="Delete Task";
isc.A.warnOnRemoval=false;
isc.A.warnOnRemovalMessage="Are you sure you want to delete this element?";
isc.A.canEditElements=true;
isc.A.editIcon="[SKIN]/actions/edit.png";
isc.A.editIconSize=16;
isc.A.editIconPrompt="Edit Task";
isc.A.editorWindowDefaults={
        _constructor:"Window",
        autoSize:true,
        canDragResize:true,
        autoCenter:true,isModal:true,showModalMask:true,
        showMinimizeButton:false,
        contributeToRuleContext:false,
        draw:function(){
            this.Super("draw",arguments);
            if(!this._sized){
                var items=this.items;
                if(!isc.isAn.Array(items))items=[items];
                for(var i=0;i<items.length;i++){
                    items[i].setWidth("100%");
                    items[i].setHeight("100%");
                    this.setMinWidth(this.getWidth());
                    this.setMinHeight(this.getHeight());
                }
                this._sized=true;
            }
        }
    };
isc.A.canAddElements=true;
isc.B.push(isc.A.initWidget=function isc_WorkflowEditor_initWidget(){
        this.Super("initWidget",arguments);
        var layoutMargin=this.lineSpacing*2;
        this.drawPane=this.createAutoChild("drawPane");
        this.addAutoChild("container",{layoutMargin:layoutMargin,membersMargin:this.lineSpacing});
        this.container.addChild(this.drawPane);
        this.drawPane.observe(this.container,"resized","observer.resizeToMatch(observed)");
        this.drawPane.observe(this.container,"adjustOverflow","observer.resizeToMatch(observed)");
        this.newElementTypeTree=this.createNewElementTypeTree();
        if(this.process){
            this.setProcess(this.process);
        }else{
            this.clearProcess();
        }
        this.unreferencedLinkPointOffset=Math.round(this.unreferencedLinkPointSize/2);
        this.divergingLinkPointOffset=Math.round(this.divergingLinkPointSize/2);
    }
,isc.A.draw=function isc_WorkflowEditor_draw(){
        this.Super("draw",arguments);
        this.drawPane.show();
        this.drawPane.moveAbove(this);
    }
,isc.A.createNewElementTypeTree=function isc_WorkflowEditor_createNewElementTypeTree(tree,parentNode){
        if(!tree)tree=isc.Tree.create({data:this.newElementTypes,autoOpen:"all"});
        var children=tree.getChildren(parentNode||tree.getRoot());
        for(var i=0;i<children.length;i++){
            var node=children[i];
            if(node.elementType){
                var elementType=node.elementType,
                    clazz=isc.ClassFactory.getClass(elementType)
                ;
                if(clazz){
                    var editorType=clazz.getInstanceProperty("editorType");
                    if(editorType){
                        node.editor=editorType;
                    }
                    var title=clazz.getTitle(),
                        parentPrefix=parentNode.prefix
                    ;
                    if(parentPrefix&&title.startsWith(parentPrefix+" ")){
                        title=title.replace(parentPrefix+" ","");
                    }
                    node.title=title;
                    var description=clazz.getInstanceProperty("classDescription");
                    if(!node.description)node.description=description;
                    node.editorProperties=clazz.getInstanceProperty("editorProperties");
                }
            }
            if(node.children){
                this.createNewElementTypeTree(tree,node);
            }
        }
        return tree;
    }
,isc.A.getTaskIcon=function isc_WorkflowEditor_getTaskIcon(elementType){
        var node=this.newElementTypeTree.find("elementType",elementType);
        return(node?node.icon:null);
    }
,isc.A.getTaskTitle=function isc_WorkflowEditor_getTaskTitle(elementType){
        var node=this.newElementTypeTree.find("elementType",elementType);
        return(node?node.title:null);
    }
,isc.A.getTaskEditorProperties=function isc_WorkflowEditor_getTaskEditorProperties(elementType){
        var node=this.newElementTypeTree.find("elementType",elementType);
        return(node?node.editorProperties:null);
    }
,isc.A.drawWorkflow=function isc_WorkflowEditor_drawWorkflow(){
        var tree=this._processTree,
            parentNode=tree.getRoot()
        ;
        this.clearRoutes();
        this.nextSegmentId=0;
        if(this.drawTree(tree,parentNode)){
            if(this._scheduledDrawLinks)isc.Timer.clear(this._scheduledDrawLinks);
            this._scheduledDrawLinks=this.delayCall("drawLinks",[tree]);
        }
    }
,isc.A.rebuildWorkflow=function isc_WorkflowEditor_rebuildWorkflow(init){
        if(!init)this.process=this.getProcessLiveObject();
        if(this._scheduledDrawLinks){
            isc.Timer.clear(this._scheduledDrawLinks);
            delete this._scheduledDrawLinks;
        }
        this.container.destroyWorkflowComponents();
        this.container.scrollTo(0,0);
        this.drawPane.destroyItems();
        if(this._processTree)this._processTree.destroy();
        var tree=this.buildProcessTree();
        this._processTree=isc.Tree.create({root:tree});
    }
,isc.A.drawTree=function isc_WorkflowEditor_drawTree(tree,parentNode,parentSegment){
        var nodes=tree.getChildren(parentNode),
            segment=parentSegment,
            series=[],
            lastNode
        ;
        if(!segment){
            segment=this.createSegment();
            this.container.addMember(segment);
        }
        if(nodes.length==0){
            if(this.canAddElements){
                series.add(this.createElementAdd({
                    parentWidget:parentNode._widget,
                    autoOpenTaskList:true,
                    segmentId:segment.segmentId,
                    rowId:segment.nextRowId++
                }));
                this.drawSeries(series,tree.getLevel(parentNode),segment);
                delete parentNode._widget;
            }
            return true;
        }
        var foldersToDraw=[],
            _this=this,
            drawFolders=function(){
                if(foldersToDraw.length>0){
                    for(var i=0;i<foldersToDraw.length;i++){
                        var node=foldersToDraw[i];
                        _this.drawTree(tree,node,segment);
                    }
                    foldersToDraw=[];
                }
            }
        ;
        for(var i=0;i<nodes.length;i++){
            var node=nodes[i];
            if(node.orphan&&series.length>0){
                this.drawSeries(series,tree.getLevel(node)-1,segment);
                series=[];
                drawFolders();
                segment=this.createSegment();
                this.container.addMember(segment);
            }
            if(node._criteriaSeries){
                if(!node._backRef){
                    foldersToDraw.add(node);
                    drawFolders();
                }
            }else{
                var element=this.createElement(node);
                series.add(element);
                if(node.isFolder){
                    if(!node._backRef){
                        var childNodes=tree.getChildren(node);
                        if(childNodes&&childNodes.length>0){
                            foldersToDraw.add(node);
                        }
                    }
                }
                lastNode=node;
            }
            if(this.autoWrapSequences&&series.length>this.autoWrapSequenceCount&&i<nodes.length-1){
                this.drawSeries(series,tree.getLevel(node)-1,segment);
                series=[];
                drawFolders();
                segment=this.createSegment();
                this.container.addMember(segment);
            }
        }
        if(series.length>0){
            if(this.canAddElements&&lastNode.element&&!lastNode.element.nextElement&&lastNode.element._canAddNextElement!=false&&!lastNode.element.editorPlaceholder){
                series.add(this.createElementAdd({tree:tree,previousNode:lastNode,segmentId:segment.segmentId,rowId:segment.nextRowId++}));
            }
            var parents=tree.getParents(node),
                indent=0
            ;
            for(var i=0;i<parents.length-1;i++){
                if(!parents[i]._criteriaSeries)indent++;
            }
            this.drawSeries(series,indent,segment);
            series=[];
        }
        drawFolders();
        return true;
    }
,isc.A.createSegment=function isc_WorkflowEditor_createSegment(){
        return this.createAutoChild("elementSegment",{segmentId:this.nextSegmentId++,nextRowId:0,membersMargin:this.lineSpacing});
    }
,isc.A.drawSeries=function isc_WorkflowEditor_drawSeries(series,indent,segment){
        var row=this.createElementRow(indent);
        row.addMembers(series);
        segment.addMember(row);
    }
,isc.A.drawLinks=function isc_WorkflowEditor_drawLinks(tree){
        delete this._scheduledDrawLinks;
        var container=this.container,
            links={}
        ;
        var segmentLayouts=container.getMembers();
        for(var s=0;s<segmentLayouts.length;s++){
            var segmentLayout=segmentLayouts[s],
                rowLayouts=segmentLayout.getMembers()
            ;
            for(var i=0;i<rowLayouts.length;i++){
                var rowLayout=rowLayouts[i],
                    elements=rowLayout.getMembers(),
                    firstRowElement=true
                ;
                for(var j=0;j<elements.length;j++){
                    var element=elements[j];
                    if(element._addElement||isc.isA.LayoutSpacer(element))continue;
                    if(firstRowElement&&element._node.orphan){
                        var elementID=(element._node?element._node.elementID:element.ID),
                            sequenceID=(element._node&&element._node._sequence!=null&&(!previousElement||previousElement._node._sequence!=element._node._sequence)?element._node._sequence:null),
                            target=elementID||sequenceID
                        ;
                        var point=this.getCanvasLeftCenterPoint(container,element);
                        point[0]=this.unreferencedLinkPointOffset+2;
                        if(!links[target])links[target]=[];
                        links[target].add({startPoint:point,prompt:this.unreferencedTaskLinkPrompt,orphan:true});
                    }
                    firstRowElement=false;
                    if(j<elements.length-1){
                        this.drawNextElementLink(element);
                    }else{
                        if(element._node.element.nextElement){
                            var target=element._node.element.nextElement,
                                elementBottom=this.getCanvasBottom(container,element),
                                linkStart=this.getCanvasRightCenterPoint(container,element)
                            ;
                            if(!links[target])links[target]=[];
                            links[target].add({startPoint:linkStart,bottom:elementBottom,prompt:this.continuationLinkPrompt});
                        }
                    }
                    if(element._node.isFolder){
                        var target=null,
                            linkStart=this.getCanvasBottomCenterPoint(container,element)
                        ;
                        if(element._node._backRef){
                            target=element._node._backRef;
                        }else{
                            var children=tree.getChildren(element._node),
                                firstChild=(children&&children.length>0?children[0]:null),
                                target=(firstChild?firstChild.elementID:null)
                            ;
                            if(firstChild&&firstChild._criteriaSeries){
                                var routeCount=children.length,
                                    spread=this.divergingLinkStartPointSpread,
                                    center=linkStart[0],
                                    routeX=center-Math.round(spread*(routeCount-1)/2)
                                ;
                                for(var ii=0;ii<children.length;ii++){
                                    target=null;
                                    var criteriaNode=children[ii];
                                    if(criteriaNode._backRef){
                                        target=criteriaNode._backRef;
                                    }else{
                                        var seriesNodes=tree.getChildren(criteriaNode);
                                        target=(seriesNodes&&seriesNodes.length>0?(seriesNodes[0].elementID||seriesNodes[0]._sequence):null);
                                    }
                                    if(target){
                                        linkStart=[routeX,linkStart[1]];
                                        routeX+=spread;
                                        if(!links[target])links[target]=[];
                                        links[target].add({startPoint:linkStart,bottom:linkStart[1],prompt:criteriaNode._criteriaPrompt,failure:criteriaNode.failure});
                                    }
                                }
                                target=null;
                            }
                        }
                        if(target){
                            var prompt=(element._node.element.canceledElement?this.canceledLinkPrompt:this.failedLinkPrompt);
                            if(!links[target])links[target]=[];
                            links[target].add({startPoint:linkStart,bottom:linkStart[1],prompt:prompt,failed:true});
                        }
                    }
                }
            }
        }
        this._firstElementLeftCenterPoints=[];
        var segmentLayouts=container.getMembers();
        for(var s=0;s<segmentLayouts.length;s++){
            var segmentLayout=segmentLayouts[s],
                rowLayouts=segmentLayout.getMembers()
            ;
            for(var i=0;i<rowLayouts.length;i++){
                var rowLayout=rowLayouts[i],
                    elements=rowLayout.getMembers(),
                    previousElement=null
                ;
                for(var j=0;j<elements.length;j++){
                    var element=elements[j];
                    if(element._addElement||isc.isA.LayoutSpacer(element))continue;
                    var elementID=(element._node?element._node.elementID:element.ID),
                        sequenceID=(element._node&&element._node._sequence!=null&&(!previousElement||previousElement._node._sequence!=element._node._sequence)?element._node._sequence:null)
                    ;
                    if(!previousElement){
                        this._firstElementLeftCenterPoints.add(this.getCanvasLeftCenterPoint(container,element));
                    }
                    if(links[elementID]||(sequenceID&&links[sequenceID])){
                        var startPoints=links[elementID]||links[sequenceID];
                        for(var sp=0;sp<startPoints.length;sp++){
                            var elementBottom=startPoints[sp].bottom;
                            if(elementBottom!=null){
                                this.addHorizontalRouteReservation(elementBottom,elementID||sequenceID);
                            }
                        }
                        if(previousElement){
                            this.addHorizontalRouteReservation(this.getCanvasTop(container,element)-this.lineSpacing,elementID||sequenceID);
                        }
                    }
                    previousElement=element;
                }
            }
        }
        this.assignHorizontalRoutes();
        var targetLinkColors={},
            linkIndex=0,
            failedLinkIndex=0
        ;
        for(var target in links){
            targetLinkColors[target]=(links[target][0].orphan
                    ?this.unreferencedLineColor
                    :(links[target][0].failed
                        ?this.failureConnectorLineColors[failedLinkIndex++]
                        :this.connectorLineColors[linkIndex++]));
        }
        var promptPanes=[];
        var segmentLayouts=container.getMembers();
        for(var s=0;s<segmentLayouts.length;s++){
            var segmentLayout=segmentLayouts[s],
                rowLayouts=segmentLayout.getMembers()
            ;
            for(var i=0;i<rowLayouts.length;i++){
                var rowLayout=rowLayouts[i],
                    elements=rowLayout.getMembers(),
                    previousElement=null
                ;
                for(var j=0;j<elements.length;j++){
                    var element=elements[j];
                    if(isc.isA.LayoutSpacer(element))continue;
                    var elementID=(element._node?element._node.elementID:element.ID),
                        sequenceID=(element._node&&element._node._sequence!=null&&(!previousElement||previousElement._node._sequence!=element._node._sequence)?element._node._sequence:null)
                    ;
                    if(links[elementID]||(sequenceID&&links[sequenceID])){
                        elementID=elementID||sequenceID;
                        var firstElement=(previousElement==null),
                            startPoints=links[elementID],
                            lineColor=targetLinkColors[elementID]
                        ;
                        promptPanes.addList(this.drawElementLink(element,elementID,firstElement,startPoints,lineColor));
                    }else if(!previousElement&&(!element._node||!element._node.orphan)&&s==0&&i==0){
                        elementID=elementID||sequenceID;
                        var point=this.getCanvasLeftCenterPoint(container,element);
                        point[0]=this.unreferencedLinkPointOffset+2;
                        var startPoints=[{startPoint:point,prompt:this.startTaskLinkPrompt,pointColor:this.startLinkPointBorderColor,fillColor:this.startLinkPointBackgroundColor}];
                        promptPanes.addList(this.drawElementLink(element,elementID,true,startPoints));
                    }
                    previousElement=element;
                }
            }
        }
        container.addPromptPanes(promptPanes);
    }
,isc.A.drawNextElementLink=function isc_WorkflowEditor_drawNextElementLink(element){
        var container=this.container,
            lineStartPoint=this.getCanvasRightCenterPoint(container,element),
            lineEndPoint=[lineStartPoint[0]+this.elementSpacing,lineStartPoint[1]]
        ;
        isc.DrawLine.create({
            drawPane:this.drawPane,
            lineWidth:this.linkWidth,
            lineColor:this.linkColor,
            startPoint:lineStartPoint,
            endPoint:lineEndPoint
        });
        var endX=lineEndPoint[0],
            endY=lineEndPoint[1],
            topArrowPoint=[endX-this.arrowOffsetX,endY-this.arrowOffsetY],
            bottomArrowPoint=[endX-this.arrowOffsetX,endY+this.arrowOffsetY],
            arrowPoints=[topArrowPoint,lineEndPoint,bottomArrowPoint],
            arrowFillColor
        ;
        if(this.showSolidArrows){
            arrowPoints.add(topArrowPoint);
            arrowFillColor=this.linkColor;
        }
        isc.DrawPath.create({
            drawPane:this.drawPane,
            lineWidth:this.linkWidth,
            lineColor:this.linkColor,
            fillColor:arrowFillColor,
            points:arrowPoints
        });
    }
,isc.A.drawElementLink=function isc_WorkflowEditor_drawElementLink(element,elementID,firstElement,startPoints,lineColor){
        var container=this.container,
            endPoint=this.getCanvasLeftCenterPoint(container,element),
            promptItems=[]
        ;
        for(var sp=0;sp<startPoints.length;sp++){
            var startPoint=startPoints[sp].startPoint,
                elementBottom=startPoints[sp].bottom,
                linkPointOffset=this.divergingLinkPointOffset,
                prompt=startPoints[sp].prompt,
                pointColor=startPoints[sp].pointColor,
                fillColor=startPoints[sp].fillColor,
                orphan=startPoints[sp].orphan,
                isUnreferencedLink=(startPoint[1]==endPoint[1])
            ;
            var horizontalRouteY=this.getHorizontalRoute(elementBottom,elementID),
                verticalRouteX=this.getVerticalRoute(endPoint[1],elementID),
                lastPoint=null
            ;
            if(startPoint[1]==elementBottom){
                lastPoint=[startPoint[0],horizontalRouteY]
                isc.DrawLine.create({
                    drawPane:this.drawPane,
                    lineWidth:this.linkWidth,
                    lineColor:lineColor,
                    startPoint:startPoint,
                    endPoint:lastPoint
                });
                var promptDrawPane=promptItems[promptItems.length]=this.createAutoChild("promptDrawPane",{
                    left:startPoint[0]-linkPointOffset,
                    top:startPoint[1],
                    width:linkPointOffset*2,
                    height:linkPointOffset,
                    prompt:prompt,
                    hoverStyle:this.hoverStyle
                });
                isc.DrawCurve.create({
                    drawPane:promptDrawPane,
                    lineWidth:this.linkWidth,
                    lineColor:lineColor,
                    fillColor:lineColor,
                    startPoint:[0,0],
                    endPoint:[linkPointOffset*2,0],
                    controlPoint1:[linkPointOffset,linkPointOffset],
                    controlPoint2:[linkPointOffset,linkPointOffset]
                });
            }else if(!isUnreferencedLink){
                var nextPoint=[startPoint[0]+Math.round(this.elementSpacing/2),startPoint[1]];
                isc.DrawLine.create({
                    drawPane:this.drawPane,
                    lineWidth:this.linkWidth,
                    lineColor:lineColor,
                    startPoint:startPoint,
                    endPoint:nextPoint
                });
                lastPoint=[nextPoint[0],horizontalRouteY];
                if(prompt){
                    var promptDrawPane=promptItems[promptItems.length]=this.createAutoChild("promptDrawPane",{
                        left:startPoint[0],
                        top:startPoint[1]-linkPointOffset,
                        width:linkPointOffset,
                        height:linkPointOffset*2,
                        prompt:prompt,
                        hoverStyle:this.hoverStyle
                    });
                    isc.DrawCurve.create({
                        drawPane:promptDrawPane,
                        lineWidth:this.linkWidth,
                        lineColor:lineColor,
                        fillColor:lineColor,
                        startPoint:[0,0],
                        endPoint:[0,linkPointOffset*2],
                        controlPoint1:[linkPointOffset,linkPointOffset],
                        controlPoint2:[linkPointOffset,linkPointOffset]
                    });
                }
                isc.DrawLine.create({
                    drawPane:this.drawPane,
                    lineWidth:this.linkWidth,
                    lineColor:lineColor,
                    startPoint:nextPoint,
                    endPoint:lastPoint
                });
            }
            if(!isUnreferencedLink){
                isc.DrawLine.create({
                    drawPane:this.drawPane,
                    lineWidth:this.linkWidth,
                    lineColor:lineColor,
                    startPoint:lastPoint,
                    endPoint:[verticalRouteX,lastPoint[1]]
                });
                lastPoint=[verticalRouteX,lastPoint[1]];
                var returnHorizontalRouteY=endPoint[1];
                if(!firstElement){
                    returnHorizontalRouteY=this.getHorizontalRoute(this.getCanvasTop(container,element)-this.lineSpacing,elementID);
                }
                isc.DrawLine.create({
                    drawPane:this.drawPane,
                    lineWidth:this.linkWidth,
                    lineColor:lineColor,
                    startPoint:lastPoint,
                    endPoint:[verticalRouteX,returnHorizontalRouteY]
                });
                lastPoint=[verticalRouteX,returnHorizontalRouteY];
            }
            if(!firstElement){
                isc.DrawLine.create({
                    drawPane:this.drawPane,
                    lineWidth:this.linkWidth,
                    lineColor:lineColor,
                    startPoint:lastPoint,
                    endPoint:[endPoint[0]-Math.round(this.elementSpacing/2),lastPoint[1]]
                });
                lastPoint=[endPoint[0]-Math.round(this.elementSpacing/2),lastPoint[1]];
                isc.DrawLine.create({
                    drawPane:this.drawPane,
                    lineWidth:this.linkWidth,
                    lineColor:lineColor,
                    startPoint:lastPoint,
                    endPoint:[lastPoint[0],endPoint[1]]
                });
                lastPoint=[lastPoint[0],endPoint[1]];
            }
            if(isUnreferencedLink){
                lastPoint=startPoint;
            }
            var endX=endPoint[0],
                endY=endPoint[1],
                topArrowPoint=[endX-this.arrowOffsetX,endY-this.arrowOffsetY],
                bottomArrowPoint=[endX-this.arrowOffsetX,endY+this.arrowOffsetY],
                pointOffset=(isUnreferencedLink?this.unreferencedLinkPointOffset:this.divergingLinkPointOffset),
                pointColor=(isUnreferencedLink?pointColor||this.unreferencedLinkPointBackgroundColor:lineColor),
                fillColor=(isUnreferencedLink?fillColor||pointColor||this.unreferencedLinkPointBackgroundColor:lineColor)
            ;
            if(isUnreferencedLink&&!orphan)lineColor=this.startLineColor;
            if(prompt&&firstElement&&startPoints.length==1){
                var promptDrawPane=promptItems[promptItems.length]=this.createAutoChild("promptDrawPane",{
                    left:lastPoint[0]-pointOffset-1,
                    top:lastPoint[1]-pointOffset-1,
                    width:endX-lastPoint[0],
                    height:pointOffset*2+2,
                    prompt:prompt,
                    hoverStyle:this.hoverStyle
                });
                isc.DrawOval.create({
                    drawPane:promptDrawPane,
                    lineWidth:this.linkWidth,
                    lineColor:pointColor,
                    fillColor:fillColor,
                    centerPoint:[pointOffset+1,pointOffset+1],
                    radius:pointOffset
                });
                if(isUnreferencedLink&&orphan){
                    var offset=Math.round(pointOffset/2);
                    isc.DrawLine.create({
                        drawPane:promptDrawPane,
                        lineWidth:this.linkWidth,
                        lineColor:this.unreferencedLinkPointForegroundColor,
                        prompt:prompt,
                        canHover:true,
                        hoverStyle:this.hoverStyle,
                        startPoint:[pointOffset-offset,pointOffset-offset],
                        endPoint:[pointOffset+offset+1,pointOffset+offset+1]
                    });
                    isc.DrawLine.create({
                        drawPane:promptDrawPane,
                        lineWidth:this.linkWidth,
                        lineColor:this.unreferencedLinkPointForegroundColor,
                        prompt:prompt,
                        canHover:true,
                        hoverStyle:this.hoverStyle,
                        startPoint:[pointOffset+offset+1,pointOffset-offset],
                        endPoint:[pointOffset-offset,pointOffset+offset+1]
                    });
                }
            }
            isc.DrawLine.create({
                drawPane:this.drawPane,
                lineWidth:this.linkWidth,
                lineColor:lineColor,
                startPoint:lastPoint,
                endPoint:endPoint
            });
            if(!orphan){
                var arrowPoints=[topArrowPoint,endPoint,bottomArrowPoint],
                    arrowFillColor;
                if(this.showSolidArrows){
                    arrowPoints.add(topArrowPoint);
                    arrowFillColor=lineColor;
                }
                isc.DrawPath.create({
                    drawPane:this.drawPane,
                    lineWidth:this.linkWidth,
                    lineColor:lineColor,
                    fillColor:arrowFillColor,
                    points:arrowPoints
                });
            }
        }
        return promptItems;
    }
,isc.A.clearRoutes=function isc_WorkflowEditor_clearRoutes(){
        this._horizontalRoutes={};
        this._verticalRoutes={};
    }
,isc.A.addHorizontalRouteReservation=function isc_WorkflowEditor_addHorizontalRouteReservation(y,elementID){
        if(!this._horizontalRouteReservations)this._horizontalRouteReservations={};
        if(!this._horizontalRouteReservations[y])this._horizontalRouteReservations[y]={};
        this._horizontalRouteReservations[y][elementID]=true;
    }
,isc.A.assignHorizontalRoutes=function isc_WorkflowEditor_assignHorizontalRoutes(){
        var space=this.lineSpacing;
        for(var key in this._horizontalRouteReservations){
            var y=~~key,
                yReservations=this._horizontalRouteReservations[y]
            ;
            var routeCount=isc.getKeys(yReservations).length,
                spread=Math.floor(space/routeCount)-1,
                center=y+Math.round(space/2),
                routeY=center+Math.round(spread*(routeCount-1)/2)
            ;
            for(var elementID in yReservations){
                var routes=this._horizontalRoutes[elementID];
                if(!routes){
                    routes=this._horizontalRoutes[elementID]={};
                }
                routes[y]=routeY;
                routeY-=spread;
            }
        }
    }
,isc.A.getHorizontalRoute=function isc_WorkflowEditor_getHorizontalRoute(y,elementID){
        var routes=this._horizontalRoutes[elementID];
        if(routes){
            var route=routes[y];
            return route;
        }
    }
,isc.A.getVerticalRoute=function isc_WorkflowEditor_getVerticalRoute(y,elementID){
        var route=this._verticalRoutes[elementID];
        if(route!=null){
            return route;
        }
        var horizontalRoutes=this._horizontalRoutes[elementID],
            minY=y,
            maxY=y
        ;
        for(var key in horizontalRoutes){
            var routeY=~~key;
            minY=Math.min(minY,routeY);
            maxY=Math.max(maxY,routeY);
        }
        var leftPoints=this._firstElementLeftCenterPoints,
            minX=Number.MAX_VALUE
        ;
        for(var i=0;i<leftPoints.length;i++){
            var point=leftPoints[i];
            if(minY<=point[1]&&point[1]<=maxY){
                minX=Math.min(minX,point[0]);
            }
        }
        var increment=(minX<=this.container.layoutMargin?5:10);
        var x=minX-15;
        if(x<=3)x=Math.round(minX/2);
        do{
            var inUse=false;
            for(var key in this._verticalRoutes){
                var routeX=this._verticalRoutes[key];
                if(routeX==x){
                    x-=increment;
                    inUse=true;
                    break;
                }
            }
        }while(inUse);
        this._verticalRoutes[elementID]=x;
        return x;
    }
,isc.A.createElementRow=function isc_WorkflowEditor_createElementRow(indent){
        var elementRow=this.createAutoChild("elementRow",{height:this.elementHeight,membersMargin:this.elementSpacing});
        if(indent){
            var width=Math.round(indent*((this.elementWidth-(indent%2==0?0:this.elementSpacing))/2));
            elementRow.addMember(isc.LayoutSpacer.create({width:width}));
        }
        return elementRow;
    }
,isc.A.createElement=function isc_WorkflowEditor_createElement(node){
        var title=(node.title||node.elementID||node.name),
            prompt=node.prompt,
            elementType=(node.element&&node.element.getClassName?node.element.getClassName():null),
            elementClass=(node.element&&node.element.getClass?node.element.getClass():null)
        ;
        if(elementClass&&elementClass.getInstanceProperty("editorPlaceholder")){
            var element=this.createElementAdd();
            delete element._addElement;
            element._node=node;
            return element;
        }
        var defaults={
            editor:this,
            height:this.elementHeight,
            width:this.elementWidth,
            title:title,
            prompt:prompt,
            taskTitle:this.getTaskTitle(elementType),
            icon:this.getTaskIcon(elementType),
            hoverStyle:this.hoverStyle,
            _node:node,
            elementType:elementType,
            canEdit:this.canEditElements,
            editIcon:this.editIcon,
            editIconSize:this.editIconSize,
            editIconPrompt:this.editIconPrompt,
            canRemove:this.canRemoveElements,
            removeIcon:this.removeIcon,
            removeIconSize:this.removeIconSize,
            removeIconPrompt:this.removeIconPrompt
        };
        if(!node.element.editorType)defaults.canEdit=false;
        if(this.elementBackgroundColor)defaults.backgroundColor=this.elementBackgroundColor;
        return this.createAutoChild("element",defaults);
    }
);
isc.evalBoundary;isc.B.push(isc.A.createElementAdd=function isc_WorkflowEditor_createElementAdd(overrides){
        var defaults=isc.addProperties({
            editor:this,
            height:this.elementHeight,
            width:this.elementWidth,
            title:this.addElementTitle,
            newElementTypes:this.newElementTypes
        },overrides);
        if(this.elementBackgroundColor)defaults.backgroundColor=this.elementBackgroundColor;
        return this.createAutoChild("elementAdd",defaults);
    }
,isc.A.getCanvasRightCenterPoint=function isc_WorkflowEditor_getCanvasRightCenterPoint(container,canvas){
        var containerPageLeft=container.getPageLeft(),
            containerPageTop=container.getPageTop(),
            pageRight=canvas.getPageLeft()+canvas.getWidth()-containerPageLeft,
            pageTop=canvas.getPageTop()+Math.round(canvas.getHeight()/2)-containerPageTop
        ;
        return[pageRight,pageTop];
    }
,isc.A.getCanvasLeftCenterPoint=function isc_WorkflowEditor_getCanvasLeftCenterPoint(container,canvas){
        var containerPageLeft=container.getPageLeft(),
            containerPageTop=container.getPageTop(),
            pageLeft=canvas.getPageLeft()-containerPageLeft,
            pageTop=canvas.getPageTop()+Math.round(canvas.getHeight()/2)-containerPageTop
        ;
        return[pageLeft,pageTop];
    }
,isc.A.getCanvasTop=function isc_WorkflowEditor_getCanvasTop(container,canvas){
        var containerPageTop=container.getPageTop(),
            pageTop=canvas.getPageTop()-containerPageTop
        ;
        return pageTop;
    }
,isc.A.getCanvasBottom=function isc_WorkflowEditor_getCanvasBottom(container,canvas){
        var containerPageTop=container.getPageTop(),
            pageBottom=canvas.getPageTop()+canvas.getHeight()-containerPageTop
        ;
        return pageBottom;
    }
,isc.A.getCanvasBottomCenterPoint=function isc_WorkflowEditor_getCanvasBottomCenterPoint(container,canvas){
        var containerPageLeft=container.getPageLeft(),
            pageLeft=canvas.getPageLeft()+Math.round(canvas.getWidth()/2)-containerPageLeft,
            pageBottom=this.getCanvasBottom(container,canvas)
        ;
        return[pageLeft,pageBottom];
    }
,isc.A.clearProcess=function isc_WorkflowEditor_clearProcess(){
        var process=(!this.process||this.process.getAllElements().length>0
            ?isc.Process.create():this.process);
        this.setProcess(process);
    }
,isc.A.setProcess=function isc_WorkflowEditor_setProcess(process){
        this.process=process;
        this.rebuildWorkflow(true);
        this.drawWorkflow();
    }
,isc.A.getProcess=function isc_WorkflowEditor_getProcess(){
        var editContext=this.getProcessEditContext();
        var data=editContext.getEditNodeTree();
        var processNode=data.getChildren(data.root).get(0);
        editContext.destroyAll();
        return processNode.liveObject;
    }
,isc.A.getProcessProperties=function isc_WorkflowEditor_getProcessProperties(){
        var tree=this._processTree,
            parentNode=tree.getRoot(),
            childNodes=tree.getChildren(parentNode)
        ;
        if(!childNodes||childNodes.length==0)return null;
        var xml=this.serializeProcess();
        xml=xml.replace("<Process>","<Process xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">");
        var xmlDoc=isc.XMLTools.parseXML(xml);
        var js=isc.XMLTools.toJS(xmlDoc,null,isc.DS.get("Process"),true,{propertiesOnly:true});
        delete js["xmlns:xsi"];
        delete js["xmlns:xsd"];
        return js;
    }
,isc.A.handleChanged=function isc_WorkflowEditor_handleChanged(){
        if(this.changed){
            this.changed();
        }
    }
,isc.A.loadProcess=function isc_WorkflowEditor_loadProcess(processId,callback){
        this._loadedProcessId=processId;
        var _this=this;
        isc.Process.loadProcess(processId,function(process){
            if(process!=null){
                _this.setProcess(process);
            }
            if(callback)callback(process);
        });
    }
,isc.A.serializeProcess=function isc_WorkflowEditor_serializeProcess(){
        var editContext=this.getProcessEditContext();
        var xml=editContext.serializeAllEditNodes();
        editContext.destroyAll();
        return xml;
    }
,isc.A.getProcessLiveObject=function isc_WorkflowEditor_getProcessLiveObject(){
        var editContext=this.getProcessEditContext(),
            tree=editContext.getEditNodeTree(),
            process=tree.getChildren(editContext.getRootEditNode())[0].liveObject
        ;
        editContext.removeAll();
        return process;
    }
,isc.A.getProcessEditContext=function isc_WorkflowEditor_getProcessEditContext(){
        var tree=this._processTree,
            parentNode=tree.getRoot()
        ;
        var editContext=this._createEditContext();
        var processNode=this._addProcessNodeToEditContext(editContext);
        this._addProcessTasksToEditContext(editContext,processNode,parentNode);
        return editContext;
    }
,isc.A._createEditContext=function isc_WorkflowEditor__createEditContext(){
        var rootComponentSchemaName="_Workflow",
            rootComponentSchema=isc.DS.get(rootComponentSchemaName)
        ;
        if(!rootComponentSchema){
            isc.DS.create({
                ID:rootComponentSchemaName,
                clientOnly:true,
                fields:[
                   {name:"process",type:"Process"}
                ]
            });
        }
        var editContext=isc.EditContext.create({
            rootComponent:{
                type:rootComponentSchemaName
            }
        });
        return editContext;
    }
,isc.A._addProcessNodeToEditContext=function isc_WorkflowEditor__addProcessNodeToEditContext(editContext){
        var processDefaults=isc.addProperties({_constructor:"Process"},this.process);
        delete processDefaults.ID;
        delete processDefaults.sequences;
        delete processDefaults.elements;
        var processNode={
            type:"Process",
            defaults:processDefaults,
            liveObject:isc.Process.create(processDefaults)
        };
        return editContext.addNode(processNode);
    }
,isc.A._addProcessTasksToEditContext=function isc_WorkflowEditor__addProcessTasksToEditContext(editContext,parentEditNode,parentNode){
        var tree=this._processTree,
            childNodes=tree.getChildren(parentNode),
            series=[],
            currentSequence,
            sequenceStack=[],
            sequenceNode,
            previousNodeInSequence,
            standaloneElementNodes=[]
        ;
        if(!childNodes)return null;
        for(var i=0;i<childNodes.length;i++){
            var node=childNodes[i],
                element=node.element
            ;
            if(element){
                var seqId=node._sequence;
                if(seqId&&seqId!=currentSequence){
                    if(currentSequence)sequenceStack.push({seqId:currentSequence,sequenceNode:sequenceNode,previousNode:previousNodeInSequence});
                    currentSequence=seqId;
                    var className="ProcessSequence",
                        defaults={_constructor:className}
                    ;
                    if(!seqId.startsWith(this.unnamedSequencePrefix))defaults.ID=seqId;
                    sequenceNode=this._createEditNode(className,defaults);
                    sequenceNode=editContext.addNode(sequenceNode,parentEditNode);
                }else if(!seqId&&currentSequence){
                    var state=sequenceStack.pop();
                    currentSequence=(state?state.seqId:null);
                    sequenceNode=(state?state.sequenceNode:null);
                    previousNodeInSequence=(state?state.previousNode:null);
                }
                if(sequenceNode){
                    var className=element.getClassName(),
                        elementDefaults=isc.addProperties({},element)
                    ;
                    if(element.getCustomDefaults){
                        isc.addProperties(elementDefaults,element.getCustomDefaults());
                    }
                    if(previousNodeInSequence){
                        editContext.removeNodeProperties(previousNodeInSequence,["nextElement"]);
                    }
                    var editNode=this._createEditNode(className,elementDefaults);
                    editNode=editContext.addNode(editNode,sequenceNode);
                    previousNodeInSequence=editNode;
                }else{
                    standaloneElementNodes.add(node);
                    previousNodeInSequence=null;
                }
            }
        }
        for(var i=0;i<standaloneElementNodes.length;i++){
            var node=standaloneElementNodes[i],
                element=node.element
            ;
            var className=element.getClassName(),
                elementDefaults=element.getSerializeableFields()
            ;
            if(element.getCustomDefaults){
                isc.addProperties(elementDefaults,element.getCustomDefaults());
            }
            editNode=this._createEditNode(className,elementDefaults)
            editContext.addNode(editNode,parentEditNode);
        }
        for(var i=0;i<childNodes.length;i++){
            var node=childNodes[i],
                element=node.element
            ;
            if(element&&node.isFolder||node._criteriaSeries){
                this._addProcessTasksToEditContext(editContext,parentEditNode,node);
            }
        }
    }
,isc.A._createEditNode=function isc_WorkflowEditor__createEditNode(type,defaults,suppressLiveObject){
        defaults=isc.addProperties({_constructor:type},defaults);
        var node={
            type:type,
            defaults:defaults
        };
        if(!suppressLiveObject)node.liveObject=isc.ClassFactory.newInstance(type,defaults);
        return node;
    }
,isc.A.getProcessElementTypeForAction=function isc_WorkflowEditor_getProcessElementTypeForAction(action){
        var elements=this._newElementTree;
        if(!elements){
            elements=this._newElementTree=isc.Tree.create({data:this.newElementTypes});
        }
        var ID=action.target,
            methodName=action.name,
            canvas=window[ID],
            prefix=(canvas&&canvas.getClassName?this._actionTargetPrefixes[canvas.getClassName()]:null),
            suffix="Task"
        ;
        var potentialElementType=(prefix!=null
                ?prefix+methodName.substring(0,1).toUpperCase()+methodName.substring(1)+suffix
                :methodName.substring(0,1).toUpperCase()+methodName.substring(1)+suffix)
        ;
        var elementRecord=elements.find("elementType",potentialElementType);
        if(!elementRecord&&prefix){
            potentialElementType=potentialElementType.substring(prefix.length);
            elementRecord=elements.find("elementType",potentialElementType);
        }
        if(!elementRecord){
            potentialElementType=this._actionTargetExceptions[potentialElementType];
            if(potentialElementType){
                elementRecord=elements.find("elementType",potentialElementType);
            }
        }
        return(elementRecord?potentialElementType:null);
    }
,isc.A.removeElementClick=function isc_WorkflowEditor_removeElementClick(element){
        var node=this.getProcessTreeNode(element);
        if(!node)return;
        if(this.onRemoveElementClick(element)==false)return;
        var shouldWarn=this.warnOnRemoval;
        if(shouldWarn){
            isc.ask(
                    this.warnOnRemovalMessage,
                    this.getID()+".completeRemoveElementClick(value, "+element+", "+node+")"
            );
        }else{
            this.completeRemoveElementClick(true,element,node);
        }
    }
,isc.A.onRemoveElementClick=function isc_WorkflowEditor_onRemoveElementClick(element){
        return true;
    }
,isc.A.completeRemoveElementClick=function isc_WorkflowEditor_completeRemoveElementClick(shouldRemove,element,node,skipRemoveReferences){
        if(!shouldRemove)return;
        var previousNode=this.getPreviousNode(node),
            previousElement=(previousNode?previousNode.element:null)
        ;
        if(previousElement&&(previousElement.nextElement||element.nextElement)){
            previousElement.nextElement=element.nextElement;
        }
        var tree=this._processTree;
        if(tree.remove(node)){
            if(element.ID&&!skipRemoveReferences)this.dropElementReferences(element.ID);
            this.process.removeElement(element);
            this.rebuildWorkflow();
            this.drawWorkflow();
            this.handleChanged();
        }
    }
,isc.A.editElementClick=function isc_WorkflowEditor_editElementClick(element){
        var node=this.getProcessTreeNode(element);
        if(!node)return;
        var workflowEditor=this;
        workflowEditor.editElement(element,null,function(element,rebuild){
            if(!element)return;
            rebuild=workflowEditor.createPlaceholderElements(element)||rebuild;
            if(rebuild){
                workflowEditor.rebuildWorkflow();
                workflowEditor.drawWorkflow();
            }else{
                workflowEditor.updateProcessNodeFromElement(node,element);
                var elementCanvas=workflowEditor.getDrawnElement(node);
                if(elementCanvas)elementCanvas.updateElementFromNode(node);
            }
            workflowEditor.handleChanged();
        });
    }
,isc.A.editElement=function isc_WorkflowEditor_editElement(element,previousNode,callback){
        if(!element.editorType){
            callback(element);
            return;
        }
        var editorWindow=this.editorWindow=this.createAutoChild("editorWindow",{
            closeClick:function(){this.destroy();callback();}
        });
        var className=element.getClassName(),
            elementDefaults=isc.addProperties({},element),
            origPreviousNode=previousNode
        ;
        var lastTaskClass,
            lastTaskOutputSchema,
            lastTaskOutputDescription,
            previousNodes
        ;
        if(!previousNode){
            previousNodes=this.getPreviousElementNodes(element);
        }
        if(previousNode||(previousNodes.length==1&&previousNodes[0].element)){
            var previousNode=previousNode||previousNodes[0];
            if(previousNodes&&previousNode.element.getClassName().endsWith("Gateway")){
                previousNodes=this.getPreviousElementNodes(previousNode.element);
                previousNode=null;
                if(previousNodes.length==1&&previousNodes[0].element){
                    previousNode=previousNodes[0];
                }
            }
            if(previousNode&&previousNode.element&&previousNode.element.getOutputSchema){
                lastTaskClass=previousNode.element.getClass();
                lastTaskOutputSchema=previousNode.element.getOutputSchema();
                lastTaskOutputDescription=previousNode.element.getClassName();
            }
        }
        var previousNodeDS;
        if(origPreviousNode){
            previousNode=origPreviousNode;
            while(previousNode&&previousNode.element.getClassName()=="XORGateway"){
                previousNodes=this.getPreviousElementNodes(previousNode.element);
                if(!previousNodes||previousNodes.length==0){
                    previousNode=null;
                    break;
                }
                if(previousNodes&&previousNodes.length>1){
                    previousNode=null;
                    break;
                }
                previousNode=previousNodes[0];
            }
            if(previousNode&&previousNode.element.getClassName()=="ServiceTask"){
                var operationType=previousNode.element.operationType||"fetch";
                if(operationType=="fetch"){
                    previousNodeDS=previousNode.element.dataSource;
                }
            }
        }
        var allNodes=this._processTree.getAllNodes(),
            allElements=[]
        ;
        for(var i=0;i<allNodes.length;i++){
            var e=allNodes[i].element;
            if(e!=element)allElements.add(e);
        }
        var editNode=this._createEditNode(className,elementDefaults,true);
        var taskEditorDefaults=isc.addProperties({
            locatorParent:this,
            editor:this,
            ruleScope:this.ruleScope,
            elementEditNode:editNode,
            lastTaskClass:lastTaskClass,
            lastTaskOutputSchema:lastTaskOutputSchema,
            lastTaskOutputDescription:lastTaskOutputDescription,
            lastTaskFetchDataSource:previousNodeDS,
            allElements:allElements,
            dataSources:this.dataSources,
            availableComponents:this.availableComponents,
            targetComponents:this.getTargetComponents(className),
            canEditTaskId:this.canEditTaskIds,
            saveElementEditNode:function(editNode){
                editorWindow.destroy();
                if(editNode)isc.addProperties(element,editNode.defaults);
                callback(editNode?element:null,this.invalidateEditor);
            }
        },this.getTaskEditorProperties(className));
        var taskEditor=isc.ClassFactory.newInstance(element.editorType,taskEditorDefaults);
        editorWindow.addItems([taskEditor]);
        var editorTitle=this.getTaskTitle(className)||taskEditor.getEditorTitle();
        editorWindow.setTitle(editorTitle);
        editorWindow.show();
    }
,isc.A.addElementClick=function isc_WorkflowEditor_addElementClick(element,elementType,elementDefaults,previousNode,callback){
        var workflowEditor=this,
            addNode=this.getProcessTreeNode(element),
            newElement=isc.ClassFactory.newInstance(elementType,elementDefaults)
        ;
        workflowEditor.editElement(newElement,previousNode,function(newElement,rebuild){
            if(!newElement){
                if(callback)callback();
                return;
            }
            if(element&&element.editorPlaceholder)newElement.ID=element.ID;
            var node=workflowEditor.createNode(newElement);
            workflowEditor.updateProcessNodeFromElement(node,newElement);
            if(element&&element.editorPlaceholder){
                workflowEditor.addElement(node,addNode);
                workflowEditor.completeRemoveElementClick(true,element,addNode,true);
            }else{
                workflowEditor.addElement(node,previousNode);
            }
            var rebuild=workflowEditor.createPlaceholderElements(newElement)||rebuild;
            if(callback)callback(node,rebuild);
            workflowEditor.handleChanged();
        });
    }
,isc.A.createPlaceholderElements=function isc_WorkflowEditor_createPlaceholderElements(newElement){
        var rebuild;
        if(newElement.getPlaceholders){
            var placeholders=newElement.getPlaceholders();
            if(placeholders){
                for(var i=0;i<placeholders.length;i++){
                    var placeholderId=this.getNextPlaceholderId(),
                        placeholderType=this.gatewayPlaceholderTaskType,
                        placeholderDefaults={
                            ID:placeholderId
                        },
                        placeholderElement=isc.ClassFactory.newInstance(placeholderType,placeholderDefaults),
                        placeholderNode=this.createNode(placeholderElement)
                    ;
                    this.addElement(placeholderNode);
                    newElement.setPlaceholderId(placeholders[i],placeholderId);
                    rebuild=true;
                }
            }
        }
        return rebuild;
    }
,isc.A.getNextPlaceholderId=function isc_WorkflowEditor_getNextPlaceholderId(){
        var nextId=isc.WorkflowEditor.nextPlaceholderId||0;
        var allNodes=this._processTree.getAllNodes();
        var duplicateFound=false;
        var placeholderId;
        do{
            placeholderId="placeHolder"+nextId;
            for(var i=0;i<allNodes.length;i++){
                var e=allNodes[i].element;
                if(!e||e.ID!=placeholderId)continue;
                duplicateFound=true;
                nextId++;
                break;
            }
        }while(duplicateFound);
        isc.WorkflowEditor.nextPlaceholderId=nextId+1;
        return placeholderId;
    }
,isc.A.addElement=function isc_WorkflowEditor_addElement(newNode,previousNode){
        var tree=this._processTree,
            newElement=newNode.element
        ;
        if(previousNode){
            if(!previousNode.isFolder&&(previousNode._sequence||!previousNode.elementID)){
                if(!previousNode._sequence){
                    previousNode._sequence=this.unnamedSequencePrefix+this.nextSeqId++;
                }
                newNode._sequence=previousNode._sequence;
            }else{
                if(!newNode.element.ID){
                    newNode.elementID=newElement.ID=isc.ClassFactory.getNextGlobalID(newElement);
                }
                var nextElement=previousNode.element.nextElement;
                if(nextElement){
                    if(newElement._canAddNextElement!=false){
                        newElement.nextElement=nextElement;
                    }else{
                        newElement.defaultElement=nextElement;
                    }
                }
                previousNode.element.nextElement=newElement.ID;
            }
            var parentNode=tree.getParent(previousNode),
                children=tree.getChildren(parentNode),
                previousNodeChildPosition=children.indexOf(previousNode)
            ;
            tree.add(newNode,parentNode,previousNodeChildPosition+1);
            this.process.addElement(newElement,previousNode.element);
            var previousNodeElement=this.getDrawnElement(previousNode);
            if(previousNodeElement){
                var layout=previousNodeElement.parentElement,
                    previousNodeLayoutPosition=layout.getMemberNumber(previousNodeElement),
                    elementCanvas=this.createElement(newNode);
                ;
                layout.addMember(elementCanvas,previousNodeLayoutPosition+1);
                layout.reflowNow();
                this.drawNextElementLink(elementCanvas);
                this.handleChanged();
            }
        }else{
            var parentNode=tree.getRoot();
            tree.add(newNode,parentNode);
            this.process.addElement(newElement);
            var layout=this.getFirstDrawnRow(),
                elementCanvas=this.createElement(newNode);
            ;
            layout.addMember(elementCanvas,0);
            layout.reflowNow();
            this.drawNextElementLink(elementCanvas);
            this.handleChanged();
        }
    }
,isc.A.isAvailableElement=function isc_WorkflowEditor_isAvailableElement(elementRecord){
        if(!elementRecord.elementType)return true;
        var elementClass=isc.ClassFactory.getClass(elementRecord.elementType);
        if(!elementClass){
            this.logError("newElementType with invalid elementType: "+elementRecord.elementType+" - class not found");
            return false;
        }
        if(elementClass&&!elementClass.isA("ComponentTask"))return true;
        var hasAvailableComponents=false;
        var availableComponents=this.availableComponents||[];
        if(isc.isA.Tree(availableComponents))availableComponents=this.availableComponents.getAllNodes();
        for(var i=0;i<availableComponents.length;i++){
            var componentRecord=availableComponents[i],
                component=window[componentRecord.ID]
            ;
            if(component&&elementClass.isApplicableComponent(component)){
                hasAvailableComponents=true;
                break;
            }
        }
        return hasAvailableComponents;
    }
,isc.A.getTargetComponents=function isc_WorkflowEditor_getTargetComponents(elementType){
        if(!elementType)return null;
        var elementClass=isc.ClassFactory.getClass(elementType);
        if(!elementClass){
            this.logError("newElementType with invalid elementType: "+elementType+" - class not found");
            return null;
        }
        var availableComponents=this.availableComponents||[],
            components=availableComponents
        ;
        if(elementClass&&elementClass.isA("ComponentTask")){
            if(isc.isA.Tree(availableComponents)){
                components=this.filterComponentsTree(availableComponents,elementClass);
                components.openAll();
            }else{
                components=[];
                for(var i=0;i<availableComponents.length;i++){
                    var componentRecord=availableComponents[i];
                    if(this.isApplicableComponent(componentRecord,elementClass)){
                        components.add(componentRecord);
                    }
                }
            }
        }
        return components;
    }
,isc.A.isApplicableComponent=function isc_WorkflowEditor_isApplicableComponent(componentRecord,elementClass,baseClass){
        var ID=componentRecord.ID,
            component=window[ID]
        ;
        if(component){
            if(elementClass){
                return(elementClass.isApplicableComponent(component));
            }
            var clazz=component.getClass();
            for(var i=0;i<baseClass.length;i++){
                if(clazz.isA(baseClass[i])){
                    return true;
                }
            }
        }
        return false;
    }
,isc.A.filterComponentsTree=function isc_WorkflowEditor_filterComponentsTree(tree,elementClass,baseClass){
        var newTree=tree.duplicate(),
            parentNode=tree.getRoot(),
            newParentNode=newTree.getRoot()
        ;
        return this._filterComponentsTree(tree,parentNode,newTree,newParentNode,elementClass,baseClass);
    }
,isc.A._filterComponentsTree=function isc_WorkflowEditor__filterComponentsTree(tree,parentNode,newTree,newParentNode,elementClass,baseClass){
        var children=tree.getChildren(parentNode);
        if(!children){
            parentNode.isFolder=false;
            return;
        }
        for(var i=0;i<children.length;i++){
            var child=children[i],
                newChild=tree.getCleanNodeData(child)
            ;
            delete newChild.children;
            newChild.enabled=(child.canSelect!=false&&this.isApplicableComponent(child,elementClass,baseClass));
            newTree.add(newChild,newParentNode);
            this._filterComponentsTree(tree,child,newTree,newChild,elementClass,baseClass);
        }
        return newTree;
    }
,isc.A.getFirstDrawnRow=function isc_WorkflowEditor_getFirstDrawnRow(){
        var container=this.container;
        var segmentLayouts=container.getMembers();
        for(var s=0;s<segmentLayouts.length;s++){
            var segmentLayout=segmentLayouts[s];
            var rowLayouts=segmentLayout.getMembers();
            if(rowLayouts.length>0){
                return rowLayouts[0];
            }
        }
        return null;
    }
,isc.A.getDrawnElement=function isc_WorkflowEditor_getDrawnElement(node){
        var container=this.container,
            segmentLayouts=container.getMembers()
        ;
        for(var s=0;s<segmentLayouts.length;s++){
            var segmentLayout=segmentLayouts[s];
            var rowLayouts=segmentLayout.getMembers();
            for(var i=0;i<rowLayouts.length;i++){
                var rowLayout=rowLayouts[i],
                    elements=rowLayout.getMembers();
                for(var j=0;j<elements.length;j++){
                    var element=elements[j];
                    if(element._addElement||isc.isA.LayoutSpacer(element))continue;
                    if(element._node==node){
                        return element;
                    }
                }
            }
        }
    }
,isc.A.getProcessTreeNode=function isc_WorkflowEditor_getProcessTreeNode(element){
        var tree=this._processTree,
            parentNode=tree.getRoot()
        ;
        return this._getProcessTreeNode(tree,parentNode,element);
    }
,isc.A._getProcessTreeNode=function isc_WorkflowEditor__getProcessTreeNode(tree,parentNode,element){
        var nodes=tree.getChildren(parentNode);
        if(!nodes||nodes.length==0)return null;
        for(var i=0;i<nodes.length;i++){
            var node=nodes[i];
            if(node.element==element)return node;
            node=this._getProcessTreeNode(tree,node,element);
            if(node)return node;
        }
        return null;
    }
,isc.A.getPreviousNode=function isc_WorkflowEditor_getPreviousNode(node){
        var tree=this._processTree,
            parentNode=tree.getParent(node)
        ;
        return this._getPreviousNode(tree,parentNode,node);
    }
,isc.A._getPreviousNode=function isc_WorkflowEditor__getPreviousNode(tree,parentNode,node){
        var nodes=tree.getChildren(parentNode);
        if(!nodes||nodes.length==0)return null;
        for(var i=0;i<nodes.length;i++){
            if(nodes[i]==node)return(i>0?nodes[i-1]:null);
        }
        for(var i=0;i<nodes.length;i++){
            var foundNode=this._getPreviousNode(tree,nodes[i],node);
            if(foundNode)return foundNode;
        }
        return null;
    }
,isc.A.dropElementReferences=function isc_WorkflowEditor_dropElementReferences(ID){
        var tree=this._processTree,
            parentNode=tree.getRoot()
        ;
        this._dropElementReferences(tree,parentNode,ID);
    }
,isc.A._dropElementReferences=function isc_WorkflowEditor__dropElementReferences(tree,parentNode,ID){
        var nodes=tree.getChildren(parentNode);
        if(!nodes||nodes.length==0)return null;
        for(var i=0;i<nodes.length;i++){
            var element=nodes[i].element;
            if(element.dropElementReferences){
                element.dropElementReferences(ID);
            }else{
                if(element.nextElement==ID)element.nextElement=null;
                if(element.failureElement==ID)element.failureElement=null;
                if(element.cancelElement==ID)element.cancelElement=null;
            }
        }
    }
,isc.A.buildProcessTree=function isc_WorkflowEditor_buildProcessTree(){
        if(!this.process)return null;
        this.nextNodeId=null;
        var process=this.process,
            rootNode={},
            elementNodes=[],
            idsSeen={}
        ;
        var traceContext={
            editor:this,
            process:process,
            parentNode:rootNode,
            elementNodes:elementNodes,
            idsSeen:idsSeen
        };
        if(process.executionStack==null){
            process.executionStack=[];
        }
        var origTraceElement=process.traceElement,
            origTraceContext=process.traceContext
        ;
        process.traceElement=this.processTraceElement;
        process.traceContext=traceContext;
        this.traceProcess();
        this.addSubElements(traceContext);
        if(this.markUnreferencedTasks){
            traceContext.parentNode=rootNode;
            var allElements=process.getAllElements();
            for(var i=0;i<allElements.length;i++){
                var element=allElements[i];
                if(element.ID!=null&&!idsSeen[element.ID]){
                    traceContext.elementNodes=[];
                    this.traceProcess(element.ID,traceContext);
                    this.addSubElements(traceContext);
                    if(traceContext.elementNodes.length>0){
                        traceContext.elementNodes[0].orphan=true;
                    }
                    elementNodes.addList(traceContext.elementNodes);
                }
            }
        }
        this.nextSeqId=traceContext.nextSeqId||0;
        process.traceElement=origTraceElement;
        process.traceContext=origTraceContext;
        process.reset();
        return rootNode;
    }
,isc.A.addSubElements=function isc_WorkflowEditor_addSubElements(traceContext){
        var process=traceContext.process,
            parentNode=traceContext.parentNode,
            elementNodes=traceContext.elementNodes,
            idsSeen=traceContext.idsSeen
        ;
        if(!elementNodes)return;
        do{
            var elementNodesCount=elementNodes.length;
            var divergentNodes=elementNodes.findAll("isFolder",true)||[];
            for(var i=0;i<divergentNodes.length;i++){
                var node=divergentNodes[i];
                if(!node.isFolder||node._backRef||node.children)continue;
                var currentTask=node.element;
                if(!currentTask)continue;
                if(isc.isAn.DecisionGateway(currentTask)){
                    var placeholders=[];
                    if(currentTask.decisionList){
                        var decisionList=currentTask.decisionList;
                        for(var i=0;i<decisionList.length;i++){
                            var taskDecision=decisionList[i],
                                targetTask=taskDecision.targetTask
                            ;
                            var divergentElement=process.getElement(targetTask);
                            if(divergentElement){
                                var criteria=taskDecision.criteria,
                                    criteriaNode=this.addElementToProcessNode(null,node)
                                ;
                                criteriaNode._criteriaSeries=true;
                                criteriaNode._criteriaPrompt=this.getCriteriaDescription(criteria);
                                elementNodes.add(criteriaNode);
                                if(idsSeen[targetTask]){
                                    criteriaNode._backRef=divergentElement.ID;
                                }else{
                                    var divergentNode=this.addElementToProcessNode(divergentElement,criteriaNode);
                                    elementNodes.add(divergentNode);
                                    idsSeen[targetTask]=true;
                                    placeholders.add({criteriaNode:criteriaNode,divergentNode:divergentNode});
                                }
                            }
                        }
                    }
                    if(currentTask.defaultElement){
                        var divergentElement=process.getElement(currentTask.defaultElement);
                        if(divergentElement){
                            var criteriaNode=this.addElementToProcessNode(null,node);
                            criteriaNode._criteriaSeries=true;
                            criteriaNode._criteriaPrompt="default";
                            criteriaNode.failure=true;
                            elementNodes.add(criteriaNode);
                            if(idsSeen[currentTask.defaultElement]){
                                criteriaNode._backRef=divergentElement.ID;
                            }else{
                                var divergentNode=this.addElementToProcessNode(divergentElement,criteriaNode);
                                elementNodes.add(divergentNode);
                                idsSeen[currentTask.defaultElement]=true;
                                placeholders.add({criteriaNode:criteriaNode,divergentNode:divergentNode});
                            }
                        }
                    }
                    for(var j=0;j<placeholders.length;j++){
                        var placeholder=placeholders[j],
                            criteriaNode=placeholder.criteriaNode,
                            divergentNode=placeholder.divergentNode,
                            divergentElement=divergentNode.element
                        ;
                        criteriaNode.children=[];
                        elementNodes.remove(divergentNode);
                        delete idsSeen[divergentElement.ID];
                        traceContext.parentNode=criteriaNode;
                        this.traceProcess(divergentElement.ID,traceContext);
                    }
                }else{
                    var elementRef=(currentTask.failureElement?currentTask.failureElement:currentTask.cancelElement);
                    var divergentElement=process.getElement(elementRef);
                    if(divergentElement){
                        if(idsSeen[divergentElement.ID]){
                            node._backRef=divergentElement.ID;
                        }else{
                            traceContext.parentNode=node;
                            this.traceProcess(divergentElement.ID,traceContext);
                        }
                    }
                }
            }
        }while(elementNodes.length>elementNodesCount);
    }
,isc.A.traceProcess=function isc_WorkflowEditor_traceProcess(nextElement,traceContext){
        var process=this.process;
        if(nextElement){
            process.setNextElement(nextElement);
        }
        while(process._next(true)){
            var task=process._getFirstTask();
            if(traceContext&&traceContext._atBackRef){
                delete traceContext._atBackRef;
                break;
            }
            if(isc.isA.DecisionGateway(task)){
                break;
            }
        }
        if(traceContext)delete traceContext.currentSequence;
    }
,isc.A.processTraceElement=function isc_WorkflowEditor_processTraceElement(currentTask,context){
        if(!currentTask)return;
        if(!context.idsSeen)context.idsSeen={};
        if(context._atBackRef||(currentTask.ID&&context.idsSeen[currentTask.ID])){
            context._atBackRef=true;
            return;
        }
        if(!context.parentNode)context.parentNode={};
        if(!context.elementNodes)context.elementNodes=[];
        if(isc.isA.ProcessSequence(currentTask)){
            if(context.nextSeqId==null)context.nextSeqId=0;
            if(context.sequenceStack==null)context.sequenceStack=[];
            var seqId=currentTask.ID||context.editor.unnamedSequencePrefix+context.nextSeqId++;
            if(context.currentSequence)context.sequenceStack.push(seqId);
            context.currentSequence=seqId;
            if(currentTask.ID){
                context.idsSeen[currentTask.ID]=true;
            }
            return;
        }
        var node=context.editor.addElementToProcessNode(currentTask,context.parentNode),
            lastNode=(context.elementNodes.length>0?context.elementNodes[context.elementNodes.length-1]:null)
        ;
        if(context.currentSequence){
            node._sequence=context.currentSequence;
        }
        context.elementNodes.add(node);
        if(context.currentSequence&&currentTask.nextElement){
            context.currentSequence=context.sequenceStack.pop();
        }
        if(isc.isA.DecisionGateway(currentTask)||
            isc.isAn.XORGateway(currentTask)||
            isc.isAn.UserConfirmationGateway(currentTask)||
            currentTask.failureElement||currentTask.cancelElement)
        {
            node.isFolder=true;
        }
        if(currentTask.ID){
            context.idsSeen[currentTask.ID]=true;
        }
    }
);
isc.evalBoundary;isc.B.push(isc.A.getCriteriaDescription=function isc_WorkflowEditor_getCriteriaDescription(criteria){
        var dsFields=isc.XORGateway._processFieldsRecursively(criteria);
        var fieldsDS=isc.DataSource.create({
            addGlobalId:false,
            fields:dsFields
        });
        return isc.DataSource.getAdvancedCriteriaDescription(criteria,fieldsDS);
    }
,isc.A.updateProcessNodeFromElement=function isc_WorkflowEditor_updateProcessNodeFromElement(node,element){
        var ID=(element?element.ID:null);
        if(node.elementID!=ID){
            node.elementID=ID;
        }
        if(element&&element.getElementDescription){
            node.title=element.getElementDescription();
        }else{
            node.title=ID;
        }
        if(element&&element.description&&element.description!=node.title){
            node.prompt=element.description;
        }
    }
,isc.A.createNode=function isc_WorkflowEditor_createNode(element){
        if(this.nextNodeId==null)this.nextNodeId=0;
        var node={
            id:this.nextNodeId++,
            element:element
        };
        if(element&&
            (isc.isA.DecisionGateway(element)||isc.isAn.XORGateway(element)||
                isc.isAn.UserConfirmationGateway(element)||
                element.failureElement||element.cancelElement))
        {
            node.isFolder=true;
        }
        return node;
    }
,isc.A.addElementToProcessNode=function isc_WorkflowEditor_addElementToProcessNode(element,parentNode){
        var node=this.createNode(element);
        this.updateProcessNodeFromElement(node,element);
        if(!parentNode.children)parentNode.children=[];
        parentNode.children.add(node);
        return node;
    }
,isc.A.getPreviousElementNodes=function isc_WorkflowEditor_getPreviousElementNodes(element){
        var tree=this._processTree,
            parentNode=tree.getRoot()
        ;
        return this._getPreviousElementNodes(element,tree,parentNode);
    }
,isc.A._getPreviousElementNodes=function isc_WorkflowEditor__getPreviousElementNodes(element,tree,parentNode){
        var nodes=tree.getChildren(parentNode),
            previousElementNodes=[]
        ;
        for(var i=0;i<nodes.length;i++){
            var node=nodes[i];
            if(node.element&&node.element==element&&i==0){
                if(parentNode!=tree.getRoot()){
                    previousElementNodes.add(parentNode);
                }
            }else if(node.element&&node.element==element&&i>0){
                if(!element.ID||!nodes[i-1].element||nodes[i-1].element.nextElement!=element.ID){
                    previousElementNodes.add(nodes[i-1]);
                }
            }else if(element.ID&&node.element&&
                    (node.element.nextElement==element.ID||node._backRef==element.ID))
            {
                previousElementNodes.add(node);
            }
            if(node.children&&node.children.length>0){
                previousElementNodes.addList(this._getPreviousElementNodes(element,tree,node));
            }
        }
        return previousElementNodes;
    }
,isc.A.getElementByID=function isc_WorkflowEditor_getElementByID(id){
        var container=this.container,
            segmentLayouts=container.getMembers()
        ;
        if(isc.isA.String(id))id=Number.parseInt(id);
        for(var s=0;s<segmentLayouts.length;s++){
            var segmentLayout=segmentLayouts[s];
            var rowLayouts=segmentLayout.getMembers();
            for(var i=0;i<rowLayouts.length;i++){
                var rowLayout=rowLayouts[i],
                    elements=rowLayout.getMembers();
                for(var j=0;j<elements.length;j++){
                    var element=elements[j];
                    if(element._addElement||isc.isA.LayoutSpacer(element))continue;
                    if(element._node&&element._node.id==id){
                        return element;
                    }
                }
            }
        }
    }
,isc.A.getAddElement=function isc_WorkflowEditor_getAddElement(segmentId,rowId){
        var container=this.container,
            segmentLayouts=container.getMembers()
        ;
        if(isc.isA.String(segmentId))segmentId=Number.parseInt(segmentId);
        if(isc.isA.String(rowId))rowId=Number.parseInt(rowId);
        for(var s=0;s<segmentLayouts.length;s++){
            var segmentLayout=segmentLayouts[s];
            if(segmentLayout.segmentId==segmentId){
                var rowLayouts=segmentLayout.getMembers();
                for(var i=0;i<rowLayouts.length;i++){
                    var rowLayout=rowLayouts[i];
                    if(rowLayout.rowId==rowId){
                        var elements=rowLayout.getMembers();
                        for(var j=0;j<elements.length;j++){
                            var element=elements[j];
                            if(element._addElement)return element;
                        }
                    }
                }
            }
        }
    }
);
isc.B._maxIndex=isc.C+75;

isc.WorkflowEditor.registerStringMethods({
    changed:null
});
isc.defineClass("WorkflowEditorElement","VLayout");
isc.A=isc.WorkflowEditorElement.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.align="center";
isc.A.styleName="processElement";
isc.A.canEdit=true;
isc.A.editIcon="[SKIN]/actions/edit.png";
isc.A.editIconSize=16;
isc.A.editIconPrompt="Edit Task";
isc.A.canRemove=true;
isc.A.removeIcon="[SKIN]/actions/remove.png";
isc.A.removeIconSize=16;
isc.A.removeIconPrompt="Delete Task";
isc.A.headerDefaults={
        _constructor:"HLayout",
        styleName:"processElementHeader",
        height:26,
        width:"100%",
        layoutMargin:2,
        membersMargin:5
    };
isc.A.headerIconDefaults={
        _constructor:"Img",
        width:18,
        height:18,
        imageType:"normal",
        layoutAlign:"center",
        padding:2
    };
isc.A.headerTitleDefaults={
        _constructor:"Label",
        styleName:"processElementHeaderLabel",
        height:20,
        width:"*",
        overflow:"hidden",
        layoutAlign:"center",
        wrap:false
    };
isc.B.push(isc.A.init=function isc_WorkflowEditorElement_init(){
        this.Super("init",arguments);
        if(this.elementType){
            var header=this.addAutoChild("header");
            if(this.icon){
                header.addMember(this.createAutoChild("headerIcon",{src:this.icon}));
            }
            var title=this.createAutoChild("headerTitle",{contents:this.taskTitle||this.elementType});
            header.addMember(title);
            if(this.canEdit){
                this.editButton=isc.ImgButton.create({
                    width:this.editIconSize,
                    height:this.editIconSize,
                    layoutAlign:"center",
                    src:this.editIcon,
                    prompt:this.editIconPrompt,
                    hoverWrap:false,
                    hoverAutoFitWidth:false,
                    hoverStyle:this.hoverStyle,
                    showDown:false,
                    showRollOver:false,
                    showFocused:false,
                    click:function(){
                        var elementCanvas=this.parentElement.parentElement.parentElement,
                            node=elementCanvas._node,
                            editor=elementCanvas.creator
                        ;
                        editor.editElementClick(node.element);
                    }
                });
            }
            if(this.canRemove){
                this.removeButton=isc.ImgButton.create({
                    width:this.removeIconSize,
                    height:this.removeIconSize,
                    layoutAlign:"center",
                    src:this.removeIcon,
                    prompt:this.removeIconPrompt,
                    hoverWrap:false,
                    hoverAutoFitWidth:false,
                    hoverStyle:this.hoverStyle,
                    showDown:false,
                    showRollOver:false,
                    showFocused:false,
                    click:function(){
                        var elementCanvas=this.parentElement.parentElement.parentElement,
                            node=elementCanvas._node,
                            editor=elementCanvas.creator
                        ;
                        editor.removeElementClick(node.element);
                    }
                });
            }
            if(this.canEdit||this.canRemove){
                this.iconLayout=isc.HLayout.create({
                    height:Math.max(this.editIconSize,this.removeIconSize),
                    width:(this.canEdit?this.editIconSize:0)+5+(this.canRemove?this.removeIconSize:0),
                    layoutAlign:"center",
                    visibility:"hidden",
                    membersMargin:5
                });
                if(this.canEdit)this.iconLayout.addMember(this.editButton);
                if(this.canRemove)this.iconLayout.addMember(this.removeButton);
                this.header.addMember(this.iconLayout);
            }
        }
        var titleProperties={
            maxWidth:this.getInnerWidth()-10,
            overflow:"hidden",
            align:"center",
            contents:this.title,
            hoverWrap:false,
            hoverAutoFitWidth:false,
            hoverStyle:this.hoverStyle,
            prompt:this.prompt
        };
        if(!this.elementType)titleProperties.height=25;
        this.addMember(isc.Label.create(titleProperties));
        if(!this.elementType&&this.createCanvas){
            this.canvas=this.createCanvas();
            this.addMember(this.canvas);
        }
    }
,isc.A.getCanvas=function isc_WorkflowEditorElement_getCanvas(){
        return this.canvas;
    }
,isc.A.setContents=function isc_WorkflowEditorElement_setContents(contents){
        this.getMember(0).setContents(contents);
    }
,isc.A.mouseOver=function isc_WorkflowEditorElement_mouseOver(){
        if(this.iconLayout)this.iconLayout.show();
    }
,isc.A.mouseOut=function isc_WorkflowEditorElement_mouseOut(){
        if(this.iconLayout)this.iconLayout.hide();
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("ProcessElementEditor","VLayout");
isc.A=isc.ProcessElementEditor.getPrototype();
isc.A.contributeToRuleContext=false;
isc.A.width=300;
isc.A.height=150;
isc.A.minWidth=300;
isc.A.minHeight=150;
isc.A.padding=5;
isc.A.membersMargin=10;
isc.A.RULESCOPE_NODE_ID="1";
isc.A.LASTTASK_NODE_ID="2";
isc.A.taskScopeRuleScopeNodeTitle="Rule Scope";
isc.A.taskScopeLastTaskOutputNodeTitle="Last task output: ${description}";
isc.A.idEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        autoFocus:true,
        fields:[
            {name:"ID",type:"text",title:"ID"}
        ],
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.descriptionEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        fields:[
            {name:"description",type:"ProcessElementDescriptionItem",title:"Task Description",width:"*"}
        ],
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        },
        updateAutoDescription:function(){
            this.getField("description").updateAutoDescription();
        }
    };
isc.A.okButtonDefaults={
        _constructor:"IButton",
        autoParent:"editButtons",
        title:"OK",
        click:function(){
            this.parentElement.creator.saveEdits();
        }
    };
isc.A.cancelButtonDefaults={
        _constructor:"IButton",
        autoParent:"editButtons",
        title:"Cancel",
        click:function(){
            this.parentElement.creator.cancelEditing();
        }
    };
isc.A.editButtonsDefaults={
        _constructor:"HLayout",
        height:30,
        align:"right",
        membersMargin:5
    }
;

isc.A=isc.ProcessElementEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.editedFields=["ID","description"];
isc.B.push(isc.A.initWidget=function isc_ProcessElementEditor_initWidget(){
        this.Super("initWidget",arguments);
        if(!this.elementEditNode&&this.processElementType){
            this.elementEditNode={
                type:this.processElementType,
                defaults:{}
            }
        }
        this.elementEditNodeDefaults=(this.elementEditNode&&this.elementEditNode.defaults?this.elementEditNode.defaults:{});
        if(this.ruleScope){
            var canvas=this.ruleScope;
            this._targetRuleScope=(isc.isA.String(canvas)?window[canvas]:this.ruleScope);
        }
    }
,isc.A.destroy=function isc_ProcessElementEditor_destroy(){
        if(this._ruleScopeDataSources&&this._destroyRuleScopeDataSources){
            var dataSources=this._criteriaDataSources||this._ruleScopeDataSources;
            for(var i=0;i<dataSources.length;i++){
                var ds=dataSources[i];
                if(ds._tempScope){
                    ds.destroy();
                }
            }
        }
        this.Super("destroy",arguments);
    }
,isc.A.getEditorTitle=function isc_ProcessElementEditor_getEditorTitle(){
        return this.editorTitle;
    }
,isc.A.setElementEditNode=function isc_ProcessElementEditor_setElementEditNode(editNode){
        this.elementEditNode=editNode;
    }
,isc.A.saveEdits=function isc_ProcessElementEditor_saveEdits(){
        if(this.validate()){
            var editNode=this.getEditedElementEditNode();
            this.completeEditing(editNode);
        }
    }
,isc.A.cancelEditing=function isc_ProcessElementEditor_cancelEditing(){
        this.completeEditing(null);
    }
,isc.A.valuesChanged=function isc_ProcessElementEditor_valuesChanged(){
    }
,isc.A.validate=function isc_ProcessElementEditor_validate(){
        return true;
    }
,isc.A.getEditedElementEditNode=function isc_ProcessElementEditor_getEditedElementEditNode(){
        var editedDefaults=this.getEditedElementDefaults();
        return isc.addProperties({},this.elementEditNode,{defaults:editedDefaults});
    }
,isc.A.getEditedElementDefaults=function isc_ProcessElementEditor_getEditedElementDefaults(){
        var originalDefaults=this.elementEditNodeDefaults,
            id=this.getIdEditorValue(),
            description=this.getDescriptionEditorValue(),
            editedDefaults={},
            undef
        ;
        for(var key in originalDefaults){
            if(!this.editedFields.contains(key)){
                editedDefaults[key]=originalDefaults[key];
            }
        }
        if(id!=undef)editedDefaults.ID=id;
        if(description!=undef)editedDefaults.description=description;
        return editedDefaults;
    }
,isc.A.completeEditing=function isc_ProcessElementEditor_completeEditing(editNode){
        if(this.saveElementEditNode)this.fireCallback(this.saveElementEditNode,["editNode"],[editNode]);
    }
,isc.A.addIdEditor=function isc_ProcessElementEditor_addIdEditor(){
        this.addAutoChild("idEditor",{visibility:(this.canEditTaskId?"inherit":"hidden")});
    }
,isc.A.getIdEditorValue=function isc_ProcessElementEditor_getIdEditorValue(){
        return this.idEditor.getValue("ID");
    }
,isc.A.addDescriptionEditor=function isc_ProcessElementEditor_addDescriptionEditor(){
        this.addAutoChild("descriptionEditor",{elementEditor:this});
        this.observe(this,"valuesChanged",function(){
            this.descriptionEditor.updateAutoDescription();
        });
    }
,isc.A.getDescriptionEditorValue=function isc_ProcessElementEditor_getDescriptionEditorValue(){
        return this.descriptionEditor.getValue("description");
    }
,isc.A.addEditButtons=function isc_ProcessElementEditor_addEditButtons(){
        this.addAutoChild("editButtons");
        this.addAutoChild("cancelButton");
        this.addAutoChild("okButton");
    }
,isc.A.getRuleScopeDataSources=function isc_ProcessElementEditor_getRuleScopeDataSources(){
        if(!this._ruleScopeDataSources){
            this._ruleScopeDataSources=this.getCriteriaScopeData(this._targetRuleScope);
            this._destroyRuleScopeDataSources=true;
        }
        return this._ruleScopeDataSources;
    }
,isc.A.getCriteriaDataSources=function isc_ProcessElementEditor_getCriteriaDataSources(){
        if(!this._criteriaDataSources){
            this._criteriaDataSources=this.getRuleScopeDataSources();
            var lastTaskDataSource=this._makeLastTaskOutputDataSource();
            if(lastTaskDataSource){
                this._criteriaDataSources=this._criteriaDataSources.duplicate();
                var pos=this._criteriaDataSources.length;
                if(isc.isA.ServiceTask(this.lastTaskClass))pos=0;
                this._criteriaDataSources.addAt(lastTaskDataSource,pos);
            }
        }
        return this._criteriaDataSources;
    }
,isc.A.getTargetableElementsValueMap=function isc_ProcessElementEditor_getTargetableElementsValueMap(addPlaceholder){
        var allElements=this.allElements,
            valueMap={}
        ;
        if(addPlaceholder){
            valueMap[isc.Process.gatewayPlaceholderSelection]="[Placeholder]";
        }
        if(allElements){
            var elements=allElements.duplicate().sortByProperty("ID",true);
            for(var i=0;i<elements.length;i++){
                var e=elements[i];
                if(e&&e.ID)valueMap[e.ID]=e.ID+" - "+e.getElementDescription();
            }
        }
        return valueMap;
    }
,isc.A.getScopeTreeData=function isc_ProcessElementEditor_getScopeTreeData(){
        var data=[];
        var ruleScopeData=this._getRuleScopeTreeData(this._targetRuleScope.getRuleContext(),this.RULESCOPE_NODE_ID);
        if(ruleScopeData&&ruleScopeData.length>0){
            data[data.length]={id:this.RULESCOPE_NODE_ID,title:this.taskScopeRuleScopeNodeTitle,canDrag:false};
            data.addList(ruleScopeData);
        }
        if(this.lastTaskOutputSchema){
            var description=this.lastTaskOutputDescription,
                title=this.taskScopeLastTaskOutputNodeTitle.evalDynamicString(this,{
                    description:description
                })
            ;
            data[data.length]={id:this.LASTTASK_NODE_ID,title:title};
            data.addList(this._getLastTaskSchemaData(this.LASTTASK_NODE_ID));
        }
        return isc.Tree.create({modelType:"parent",data:data});
    }
,isc.A._getRuleScopeTreeData=function isc_ProcessElementEditor__getRuleScopeTreeData(ruleContext,parentId){
        var dataSources=this.getRuleScopeDataSources(),
            targetRuleScope=this._targetRuleScope,
            owners=isc.Canvas.getRuleScopeDataSourceOwners(targetRuleScope),
            testData=[],
            nodeIdIndex=0
        ;
        for(var i=0;i<dataSources.length;i++){
            var dataSource=dataSources[i];
            if(isc.isA.String(dataSource))dataSource=isc.DataSource.get(dataSource);
            if(dataSource==null){
                this.logWarn("_getRuleScopeTreeData() - unable to locate dataSource:"
                    +dataSource);
                continue;
            }
            var dsID=dataSource.getID(),
                dsFields=dataSource.getFieldNames(),
                nodeId=parentId+"_"+nodeIdIndex++,
                dsNodeId=nodeId
            ;
            var data=testData;
            var titlePrefix=(dataSource.criteriaBasePath?"":"<i>"),
                titleSuffix=(dataSource.criteriaBasePath?"":"</i>"),
                dsTitle=dataSource.pluralTitle||dataSource.title||dsID,
                title=titlePrefix+dsTitle+titleSuffix+" Fields",
                owner=owners[dataSource.ID],
                source=(owner?isc.Canvas.getRuleScopeSourceFromComponent(owner):null)
            ;
            if(owner&&source)title+=" ("+source+" in <i>"+owner.getID()+"</i>)";
            var parentRecord={id:nodeId,parentId:parentId,name:dsID,title:title,type:"text",enabled:true};
            var fieldData=[];
            for(var j=0;j<dsFields.length;j++){
                var fieldName=dsID+"."+dsFields[j],
                    field=dataSource.fields[dsFields[j]],
                    fieldTitle=field.title
                ;
                nodeId=dsNodeId+"_"+nodeIdIndex++;
                var record={id:nodeId,parentId:dsNodeId,name:fieldName,title:fieldTitle,type:field.type};
                if(dataSource.criteriaBasePath){
                    record.criteriaPath=field.criteriaPath||fieldName.replace(dsID,dataSource.criteriaBasePath);
                }
                if(ruleContext){
                    record.value=isc.DataSource.getPathValue(ruleContext,fieldName);
                }
                fieldData[fieldData.length]=record;
            }
            if(fieldData.length>0){
                data[data.length]=parentRecord;
                data.addList(fieldData);
            }
        }
        return testData;
    }
,isc.A.getCriteriaScopeData=function isc_ProcessElementEditor_getCriteriaScopeData(ruleScope){
        var dataSources=isc.Canvas.getAllRuleScopeDataSources(ruleScope);
        return dataSources;
    }
,isc.A._getLastTaskSchemaData=function isc_ProcessElementEditor__getLastTaskSchemaData(parentId){
        var dataSource=this.lastTaskOutputSchema;
        if(isc.isA.String(dataSource))dataSource=isc.DataSource.get(dataSource);
        var dsFields=dataSource.getFieldNames(),
            nodeIdIndex=0,
            data=[]
        ;
        for(var j=0;j<dsFields.length;j++){
            var fieldName=dsFields[j],
                field=dataSource.fields[fieldName],
                fieldTitle=field.title,
                nodeId=parentId+"_"+nodeIdIndex++
            ;
            var record={id:nodeId,parentId:parentId,name:fieldName,title:fieldTitle,type:field.type};
            data[data.length]=record;
        }
        return data;
    }
,isc.A._makeLastTaskOutputDataSource=function isc_ProcessElementEditor__makeLastTaskOutputDataSource(){
        if(!this.lastTaskOutputSchema)return null;
        var description=this.lastTaskOutputDescription,
            title=this.taskScopeLastTaskOutputNodeTitle.evalDynamicString(this,{
                description:description
            }),
            dsID="_lastTaskOutput"
        ;
        var properties={addGlobalId:false,_tempScope:true,ID:dsID,clientOnly:true,criteriaBasePath:"$last",title:title,pluralTitle:title};
        var fields=this._getLastTaskSchemaData(this.LASTTASK_NODE_ID),
            dsFields=[]
        ;
        for(var i=0;i<fields.length;i++){
            var field=fields[i];
            var props={name:field.name,type:field.type};
            dsFields.push(props);
        }
        properties.fields=dsFields;
        return isc.DS.create(properties);
    }
,isc.A._encodeAdvancedCriteriaExpressions=function isc_ProcessElementEditor__encodeAdvancedCriteriaExpressions(criteria){
        var operator=criteria.operator;
        if(operator=="and"||operator=="or"||operator=="not"){
            var innerCriteria=criteria.criteria;
            if(!isc.isAn.Array(innerCriteria))innerCriteria=[innerCriteria];
            for(var i=0;i<innerCriteria.length;i++){
                this._encodeAdvancedCriteriaExpressions(innerCriteria[i]);
            }
        }if(criteria.value!=null){
            this._encodeDynamicExpression(criteria);
        }
        return criteria;
    }
,isc.A._encodeDynamicExpression=function isc_ProcessElementEditor__encodeDynamicExpression(criterion){
        var value=criterion.value;
        if(isc.isA.String(value)&&(value.startsWith("$inputRecord")||value.startsWith("$input")||value.startsWith("$last")||
                value.startsWith("$ruleScope")||value.startsWith("$scope")))
        {
            criterion.valuePath=value.replace("$ruleScope","").replace("$scope","");
            delete criterion.value;
        }
    }
,isc.A._decodeAdvancedCriteriaExpressions=function isc_ProcessElementEditor__decodeAdvancedCriteriaExpressions(criteria){
        if(!criteria)return null;
        var operator=criteria.operator;
        if(operator=="and"||operator=="or"||operator=="not"){
            var innerCriteria=criteria.criteria;
            if(!isc.isAn.Array(innerCriteria))innerCriteria=[innerCriteria];
            for(var i=0;i<innerCriteria.length;i++){
                this._decodeAdvancedCriteriaExpressions(innerCriteria[i]);
            }
        }if(criteria.valuePath!=null){
            this._decodeDynamicExpression(criteria);
        }
        return criteria;
    }
,isc.A._decodeDynamicExpression=function isc_ProcessElementEditor__decodeDynamicExpression(criterion){
        var valuePath=criterion.valuePath;
        if(valuePath){
            if(!valuePath.startsWith("$")){
                criterion.value="$ruleScope."+valuePath;
            }else{
                criterion.value=valuePath;
            }
            delete criterion.valuePath;
        }
        return criterion;
    }
);
isc.B._maxIndex=isc.C+28;

isc.ProcessElementEditor.registerStringMethods({
    saveElementEditNode:"editNode"
});
isc.defineClass("UserTaskEditor","ProcessElementEditor");
isc.A=isc.UserTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="UserTask";
isc.A.editorTitle="User Task";
isc.A.topEditorDefaults={
        _constructor:"DynamicForm",
        wrapItemTitles:false
    };
isc.A.editedFields=["ID","description","wizard","saveToServer"]
;
isc.B.push(isc.A.initWidget=function isc_UserTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        var fields=[
            {name:"wizard",type:"boolean",title:"Wizard"},
            {name:"saveToServer",type:"boolean",title:"Save to server",defaultValue:false}
        ];
        this.addIdEditor();
        this.addAutoChild("topEditor",{fields:fields});
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.setEditorValues=function isc_UserTaskEditor_setEditorValues(){
        var values=this.elementEditNodeDefaults;
        this.idEditor.setValues(values);
        this.topEditor.setValues(values);
        this.descriptionEditor.setValues(values);
    }
,isc.A.validate=function isc_UserTaskEditor_validate(){
        var valid=this.idEditor.validate()&&this.topEditor.validate()&&this.descriptionEditor.validate();
        return valid;
    }
);
isc.B._maxIndex=isc.C+3;

isc.defineClass("StateTaskEditor","ProcessElementEditor");
isc.A=isc.StateTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=300;
isc.A.height=200;
isc.A.minWidth=300;
isc.A.minHeight=200;
isc.A.processElementType="StateTask";
isc.A.editorTitle="State Task";
isc.A.topEditorDefaults={
        _constructor:"DynamicForm",
        wrapItemTitles:false
    };
isc.A.editedFields=["ID","description","inputField","outputField","type","value"];
isc.B.push(isc.A.initWidget=function isc_StateTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        var fields=[
            {name:"inputField",type:"text",title:"Input field"},
            {name:"outputField",type:"text",title:"Output field"},
            {name:"type",type:"select",title:"Type",allowEmptyValue:true,valueMap:["string","boolean","decimal","integer","record","array"]},
            {name:"value",type:"text",title:"Value"}
        ];
        this.addIdEditor();
        this.addAutoChild("topEditor",{fields:fields});
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.setEditorValues=function isc_StateTaskEditor_setEditorValues(){
        var values=this.elementEditNodeDefaults;
        this.idEditor.setValues(values);
        this.topEditor.setValues(values);
        this.descriptionEditor.setValues(values);
    }
,isc.A.validate=function isc_StateTaskEditor_validate(){
        var valid=this.idEditor.validate()&&this.topEditor.validate()&&this.descriptionEditor.validate();
        return valid;
    }
,isc.A.getEditedElementEditNode=function isc_StateTaskEditor_getEditedElementEditNode(){
        var originalDefaults=this.elementEditNodeDefaults,
            values=this.topEditor.getValues(),
            editedDefaults=this.getEditedElementDefaults()
        ;
        for(var key in originalDefaults){
            if(!this.editedFields.contains(key)){
                editedDefaults[key]=originalDefaults[key];
            }
        }
        editedDefaults.inputField=values.inputField;
        editedDefaults.outputField=values.outputField;
        editedDefaults.type=values.type;
        editedDefaults.value=values.value;
        return isc.addProperties({},this.elementEditNode,{defaults:editedDefaults});
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("ServiceTaskEditor","ProcessElementEditor");
isc.A=isc.ServiceTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=600;
isc.A.height=400;
isc.A.minWidth=600;
isc.A.minHeight=400;
isc.A.processElementType="ServiceTask";
isc.A.invalidateEditor=true;
isc.A.editorTitle="DataSource Task";
isc.A.editorTitleFixedOperationType="DataSource ${operationType} Task";
isc.A.addInstructions="Drag available fields from the tree on the left to the grid on the right to specify what data should be stored. Or click the pencil icon to enter a fixed value.";
isc.A.removeInstructions="Select a source for the unique ID of the record to be deleted.";
isc.A.fetchInstructions="Define criteria for the DataSource fetch.";
isc.A.exportInstructions="Define criteria for the DataSource export.";
isc.A.overwriteBindingsMessage="Overwrite all existing bindings? Otherwise, new bindings will be merged.";
isc.A.missingPrimaryKeyMessage="The field ${fieldName} must have a binding because it is used to determine which record to udpate.";
isc.A.missingIdSourceMessage="An ID source must be selected to identify the record to remove.";
isc.A.fixedValueWindowTitle="Fixed value for field '${fieldName}'";
isc.A.bindingValuePrompt="Click the pencil icon to enter a fixed value";
isc.A.hiddenErrorsDefaults={
        _constructor:isc.HTMLFlow,
        width:"100%",
        padding:5,
        isGroup:true,
        groupTitle:"Hidden errors",
        visibility:"hidden"
    };
isc.A.dataSourcePickerDefaults={
        name:"dataSource",
        type:"ComboBoxItem",
        title:"DataSource",
        required:true,
        addUnknownValues:false
    };
isc.A.operationTypePickerDefaults={
        name:"operationType",
        type:"RadioGroupItem",
        title:"Operation Type",
        defaultValue:"fetch",
        vertical:false,
        valueMap:{
            "fetch":"Fetch",
            "add":"Add",
            "update":"Update",
            "remove":"Remove",
            "export":"Export"
        },
        required:true
    };
isc.A.topEditorDefaults={
        _constructor:"DynamicForm",
        wrapItemTitles:false,
        autoFocus:true,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.bindingContainerDefaults={
        _constructor:"BindingContainer",
        height:"*"
    };
isc.A.bindingValuesAddPaneDefaults={
        _constructor:"BindingValuesPane",
        valuesChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.bindingValuesUpdatePaneDefaults={
        _constructor:"BindingValuesPane",
        includeSequencePK:true,
        valuesChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.bindingCriteriaPaneDefaults={
        _constructor:"BindingCriteriaPane",
        valuesChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.exportPaneDefaults={
        _constructor:isc.VLayout,
        autoParent:"bindingLayout"
    };
isc.A.exportCriteriaDefaults={
        _constructor:"BindingCriteriaPane",
        valuesChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.exportSettingsDefaults={
        _constructor:"DynamicForm",
        width:300,
        fields:[
            {name:"exportFormat",title:"Export Format",type:"select",width:"*",
                defaultToFirstOption:true,
                valueMap:{
                    "csv":"CSV",
                    "xml":"XML",
                    "json":"JSON",
                    "xls":"XLS (Excel97)",
                    "ooxml":"OOXML (Excel2007)"
                }
            }
        ],
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.failureElementPickerDefaults={
        name:"failureElement",
        type:"SelectItem",
        title:"If operation <b>fails</b>, next task",
        showHintInField:true,
        hint:"terminate workflow",
        width:300,
        allowEmptyValue:true
    };
isc.A.navigationEditorLayoutDefaults={
        _constructor:"HLayout",
        align:"center",
        height:1
    };
isc.A.navigationEditorDefaults={
        _constructor:"DynamicForm",
        autoParent:"navigationEditorLayout",
        wrapItemTitles:false
    };
isc.A.editedFields=["ID","description","dataSource","operationType","values","criteria","exportFormat","failureElement"];
isc.B.push(isc.A.initWidget=function isc_ServiceTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        var editor=this;
        var fields=[];
        if(this.dataSources){
            fields.add(isc.addProperties({},this.dataSourcePickerDefaults,this.dataSourcePickerProperties,
                    {valueMap:this.dataSources,changed:this.dataSourceChanged}));
        }
        if(this.showOperationTypePicker!=false){
            fields.add(isc.addProperties({},this.operationTypePickerDefaults,this.operationTypePickerProperties,
                    {changed:this.operationTypeChanged}));
        }
        var scopeTreeData=this.getScopeTreeData();
        this.addAutoChild("hiddenErrors");
        this.addIdEditor();
        this.addAutoChild("topEditor",{fields:fields,visibility:(fields.length>0?"inherit":"hidden")});
        this.bindingValuesAddPane=this.createAutoChild("bindingValuesAddPane",{
            scopeTreeData:scopeTreeData,
            bindingValuePrompt:this.bindingValuePrompt,
            fixedValueWindowTitle:this.fixedValueWindowTitle,
            overwriteBindingsMessage:this.overwriteBindingsMessage
        });
        this.bindingValuesUpdatePane=this.createAutoChild("bindingValuesUpdatePane",{
            scopeTreeData:scopeTreeData,
            bindingValuePrompt:this.bindingValuePrompt,
            fixedValueWindowTitle:this.fixedValueWindowTitle,
            overwriteBindingsMessage:this.overwriteBindingsMessage
        });
        this.bindingCriteriaPane=this.createAutoChild("bindingCriteriaPane",{
            ruleScope:this.ruleScope,
            criteriaDataSources:this.getCriteriaDataSources()
        });
        this.removeKeyPane=this.createAutoChild("bindingValuesUpdatePane",{
            scopeTreeData:scopeTreeData,
            showBindings:false
        });
        this.exportPane=this.createAutoChild("exportPane");
        this.exportCriteria=this.createAutoChild("exportCriteria",{
            ruleScope:this.ruleScope,
            criteriaDataSources:this.getCriteriaDataSources()
        });
        this.exportSettings=this.createAutoChild("exportSettings");
        this.exportPane.addMembers(this.exportCriteria,this.exportSettings);
        var bindingPanes=[
            {name:"addValues",pane:this.bindingValuesAddPane,instructions:this.addInstructions},
            {name:"updateValues",pane:this.bindingValuesUpdatePane,instructions:this.addInstructions},
            {name:"criteria",pane:this.bindingCriteriaPane,instructions:this.fetchInstructions},
            {name:"remove",pane:this.removeKeyPane,instructions:this.removeInstructions},
            {name:"export",pane:this.exportPane,instructions:this.exportInstructions}
        ];
        var container=this.addAutoChild("bindingContainer",{bindingPanes:bindingPanes});
        var fields=[],
            targetableElementsValueMap=this.getTargetableElementsValueMap()
        ;
        fields.add(isc.addProperties({},this.failureElementPickerDefaults,this.failureElementPickerProperties,
            {valueMap:targetableElementsValueMap}));
        this.addAutoChild("navigationEditorLayout");
        this.addAutoChild("navigationEditor",{fields:fields});
        this.addDescriptionEditor();
        this.addEditButtons();
        this.validateHiddenProperties();
        this.setEditorValues();
    }
,isc.A.setEditorValues=function isc_ServiceTaskEditor_setEditorValues(){
        var values=this.elementEditNodeDefaults;
        this.idEditor.setValues(values);
        this.topEditor.setValues(values);
        this.navigationEditor.setValues(values);
        this.descriptionEditor.setValues(values);
        var operationType=this.topEditor.getValue("operationType");
        var dataSource=this.topEditor.getValue("dataSource");
        this.bindingValuesAddPane.setDataSource(dataSource);
        this.bindingValuesUpdatePane.setDataSource(dataSource);
        if(operationType=="add"){
            this.bindingValuesAddPane.setValues(this.elementEditNodeDefaults.values);
        }
        if(operationType=="update"){
            this.bindingValuesUpdatePane.setValues(this.elementEditNodeDefaults.values);
        }
        this.bindingCriteriaPane.setDataSource(dataSource);
        this.exportCriteria.setDataSource(dataSource);
        if(this.elementEditNode.defaults.criteria){
            var criteria=isc.clone(this.elementEditNodeDefaults.criteria);
            this._encodeAdvancedCriteriaExpressions(criteria);
            this.bindingCriteriaPane.setCriteria(criteria);
            var criteria=isc.clone(this.elementEditNodeDefaults.criteria);
            this._encodeAdvancedCriteriaExpressions(criteria);
            this.exportCriteria.setCriteria(criteria);
        }
        this.removeKeyPane.setDataSource(dataSource);
        if(operationType=="remove"){
            this.removeKeyPane.setValues(this.elementEditNodeDefaults.values);
        }
        this.exportSettings.setValues(values);
        this.updateOperationTypeFields();
    }
,isc.A.validateHiddenProperties=function isc_ServiceTaskEditor_validateHiddenProperties(){
        var errors=[];
        if(!this.dataSources&&!this.elementEditNodeDefaults.dataSource){
            errors.add("elementEditNode defaults do not include a dataSource value and editor.dataSources is not set.");
        }
        if(errors.length>0){
            this.hiddenErrors.setContents(errors.join("<br>"));
            this.hiddenErrors.show();
            this.okButton.disable();
        }
        return(errors.length==0);
    }
,isc.A.validate=function isc_ServiceTaskEditor_validate(){
        var valid=this.validateHiddenProperties()&&this.idEditor.validate()&&
            this.topEditor.validate()&&this.exportSettings.validate()&&
            this.navigationEditor.validate()&&this.descriptionEditor.validate();
        if(valid){
            var operationType=this.topEditor.getValue("operationType");
            if(operationType=="update"){
                var dataSourceName=this.topEditor.getValue("dataSource"),
                    ds=isc.DS.get(dataSourceName),
                    pkFieldName=ds.getPrimaryKeyFieldName(),
                    values=this.bindingValuesUpdatePane.getValues()
                ;
                valid=(values!=null&&values[pkFieldName]!=null);
                if(!valid){
                    var message=this.missingPrimaryKeyMessage.evalDynamicString(this,{
                            fieldName:pkFieldName
                        });
                    isc.warn(message);
                }
            }else if(operationType=="remove"){
                var values=this.removeKeyPane.getValues();
                if(!values||isc.isAn.emptyObject(values)){
                    valid=false;
                    isc.warn(this.missingIdSourceMessage);
                }
            }
        }
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_ServiceTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            values=this.topEditor.getValues(),
            exportValues=this.exportSettings.getValues(),
            navigationValues=this.navigationEditor.getValues()
        ;
        editedDefaults.dataSource=values.dataSource;
        editedDefaults.operationType=values.operationType;
        editedDefaults.values=this.getDefaultsForValues();
        editedDefaults.failureElement=navigationValues.failureElement;
        var operationType=values.operationType;
        var criteria;
        if(operationType=="fetch"){
            criteria=this.bindingCriteriaPane.getCriteria();
        }else if(operationType=="export"){
            criteria=this.exportCriteria.getCriteria();
        }
        if(criteria){
            this._decodeAdvancedCriteriaExpressions(criteria);
            editedDefaults.criteria=isc.DS.simplifyAdvancedCriteria(criteria,true);
        }
        if(operationType=="export"&&exportValues.exportFormat!=null){
            editedDefaults.exportFormat=exportValues.exportFormat;
        }
        return editedDefaults;
    }
,isc.A.getDefaultsForValues=function isc_ServiceTaskEditor_getDefaultsForValues(){
        var values;
        var operationType=this.topEditor.getValue("operationType");
        if(operationType=="add"){
            values=this.bindingValuesAddPane.getValues();
        }else if(operationType=="update"){
            values=this.bindingValuesUpdatePane.getValues();
        }else if(operationType=="remove"){
            values=this.removeKeyPane.getValues();
        }
        return values;
    }
,isc.A.getEditorTitle=function isc_ServiceTaskEditor_getEditorTitle(){
        var properties=this.elementEditNodeDefaults;
        if(this.isDrawn()){
            var operationType=this.topEditor.getValue("operationType");
            properties={operationType:operationType};
        }
        return(this.showOperationTypePicker
                ?this.editorTitle
                :this.editorTitleFixedOperationType.evalDynamicString(this,properties));
    }
,isc.A.dataSourceChanged=function isc_ServiceTaskEditor_dataSourceChanged(form,item,value){
        var dataSource=form.creator.topEditor.getValue("dataSource");
        form.creator.bindingValuesAddPane.setDataSource(dataSource);
        form.creator.bindingValuesUpdatePane.setDataSource(dataSource);
        form.creator.bindingCriteriaPane.setDataSource(dataSource);
        form.creator.exportCriteria.setDataSource(dataSource);
        form.creator.removeKeyPane.setDataSource(dataSource);
    }
,isc.A.operationTypeChanged=function isc_ServiceTaskEditor_operationTypeChanged(form,item,value){
        form.creator.updateOperationTypeFields();
    }
,isc.A.updateOperationTypeFields=function isc_ServiceTaskEditor_updateOperationTypeFields(){
        var operationType=this.topEditor.getValue("operationType");
        if(operationType=="add"){
            this.bindingContainer.setCurrentBindingPane("addValues");
        }else if(operationType=="update"){
                this.bindingContainer.setCurrentBindingPane("updateValues");
        }else if(operationType=="remove"){
            this.bindingContainer.setCurrentBindingPane("remove");
        }else if(operationType=="fetch"){
            this.bindingContainer.setCurrentBindingPane("criteria");
        }else if(operationType=="export"){
            this.bindingContainer.setCurrentBindingPane("export");
        }
        var parentElements=this.getParentElements();
        for(var i=0;i<parentElements.length;i++){
            if(isc.isA.Window(parentElements[i])){
                parentElements[i].setTitle(this.getEditorTitle());
                break;
            }
        }
    }
,isc.A.createDescription=function isc_ServiceTaskEditor_createDescription(defaults){
        var processElement=this._processElement;
        if(!processElement){
            this._processElement=processElement=isc.ClassFactory.newInstance(this.processElementType,defaults);
        }else{
            this._processElement.addProperties(defaults);
        }
        var description=processElement.getElementDescription();
        return description;
    }
);
isc.B._maxIndex=isc.C+11;

isc.defineClass("XORGatewayEditor","ProcessElementEditor");
isc.A=isc.XORGatewayEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=600;
isc.A.minWidth=600;
isc.A.processElementType="XORGateway";
isc.A.invalidateEditor=true;
isc.A.editorTitle="Single Decision";
isc.A.instructions="Define criteria to choose between two possible next tasks.";
isc.A.missingCriteriaMessage="Criteria must be selected.";
isc.A.instructionsDefaults={
        _constructor:isc.HTMLFlow,
        autoParent:"bindingLayout",
        width:"100%",
        padding:5
    };
isc.A.filterBuilderDefaults={
        _constructor:"FilterBuilder",
        autoParent:"bindingLayout",
        height:"*",
        border:"1px solid gray",
        showModeSwitcher:true,
        initWidget:function(){
            this._skipFilterChanged=true;
            this.Super("initWidget",arguments);
            this._skipFilterChanged=false;
        },
        draw:function(){
            this._skipFilterChanged=true;
            this.Super("draw",arguments);
            this._skipFilterChanged=false;
        },
        filterChanged:function(){
            if(!this._skipFilterChanged&&this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.nextElementPickerDefaults={
        name:"nextElement",
        type:"SelectItem",
        title:"If criteria match, next task",
        width:300,
        allowEmptyValue:true,
        showHintInField:true,
        hint:"Next task in sequence (not yet created)"
    };
isc.A.failureElementPickerDefaults={
        name:"failureElement",
        type:"SelectItem",
        title:"If criteria <b>do not</b> match, next task",
        width:300,
        allowEmptyValue:true,
        defaultValue:isc.Process.gatewayPlaceholderSelection
    };
isc.A.navigationEditorLayoutDefaults={
        _constructor:"HLayout",
        align:"center"
    };
isc.A.navigationEditorDefaults={
        _constructor:"DynamicForm",
        autoParent:"navigationEditorLayout",
        wrapItemTitles:false
    };
isc.A.bindingLayoutDefaults={
        _constructor:"VLayout",
        width:"100%"
    };
isc.A.editedFields=["ID","description","criteria","nextElement","failureElement"];
isc.B.push(isc.A.initWidget=function isc_XORGatewayEditor_initWidget(){
        this.Super("initWidget",arguments);
        var fields=[];
        fields.add(isc.addProperties({},this.nextElementPickerDefaults,this.nextElementPickerProperties,
                {valueMap:this.getTargetableElementsValueMap()}));
        fields.add(isc.addProperties({},this.failureElementPickerDefaults,this.failureElementPickerProperties,
                {valueMap:this.getTargetableElementsValueMap(true)}));
        this.addIdEditor();
        var layout=this.addAutoChild("bindingLayout");
        this.addAutoChild("instructions",{contents:this.instructions});
        var filterBuilderProperties={
            targetRuleScope:this.ruleScope,
            allowRuleScopeValues:true,
            createRuleCriteria:true,
            targetComponent:{ID:"_none_"},
            _ruleScopeDataSources:this.getCriteriaDataSources()
        };
        this.addAutoChild("filterBuilder",filterBuilderProperties);
        this.addAutoChild("navigationEditorLayout");
        this.addAutoChild("navigationEditor",{fields:fields});
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.setEditorValues=function isc_XORGatewayEditor_setEditorValues(){
        var values=this.elementEditNodeDefaults;
        this.idEditor.setValues(values);
        this.navigationEditor.setValues(values);
        this.descriptionEditor.setValues(values);
        if(this.elementEditNodeDefaults.criteria){
            var criteria=isc.clone(this.elementEditNodeDefaults.criteria);
            this._encodeAdvancedCriteriaExpressions(criteria);
            this.filterBuilder.setCriteria(criteria);
        }
    }
,isc.A.validate=function isc_XORGatewayEditor_validate(){
        var valid=this.idEditor.validate()&&this.navigationEditor.validate()&&this.descriptionEditor.validate();
        if(valid){
            var criteria=this.filterBuilder.getCriteria();
            if(!criteria.criteria||criteria.criteria.isEmpty()){
                valid=false;
                isc.warn(this.missingCriteriaMessage);
            }
        }
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_XORGatewayEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            navigationValues=this.navigationEditor.getValues()
        ;
        editedDefaults.nextElement=navigationValues.nextElement;
        editedDefaults.failureElement=navigationValues.failureElement;
        var criteria=this.filterBuilder.getCriteria();
        this._decodeAdvancedCriteriaExpressions(criteria);
        editedDefaults.criteria=isc.DS.simplifyAdvancedCriteria(criteria,true);
        return editedDefaults;
    }
,isc.A.createDescription=function isc_XORGatewayEditor_createDescription(defaults){
        var processElement=this._processElement;
        if(!processElement){
            this._processElement=processElement=isc.ClassFactory.newInstance(this.processElementType,defaults);
        }else{
            this._processElement.addProperties(defaults);
        }
        var description=processElement.getElementDescription();
        return description;
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("UserConfirmationGatewayEditor","ProcessElementEditor");
isc.A=isc.UserConfirmationGatewayEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=600;
isc.A.minWidth=600;
isc.A.processElementType="UserConfirmationGateway";
isc.A.invalidateEditor=true;
isc.A.editorTitle="User Confirmation";
isc.A.messageEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        fixedColWidths:true,
        numCols:3,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.messageFieldDefaults={
        name:"message",
        type:"TextArea",
        title:"Message",
        width:"*",
        height:50,
        colSpan:2,
        required:true
    };
isc.A.nextElementPickerDefaults={
        name:"nextElement",
        type:"SelectItem",
        title:"If user confirms, next task",
        width:300,
        allowEmptyValue:true,
        showHintInField:true,
        hint:"Next task in sequence (not yet created)"
    };
isc.A.failureElementPickerDefaults={
        name:"failureElement",
        type:"SelectItem",
        title:"If user <b>does not</b> confirm, next task",
        width:300,
        allowEmptyValue:true,
        defaultValue:isc.Process.gatewayPlaceholderSelection
    };
isc.A.navigationEditorLayoutDefaults={
        _constructor:"HLayout",
        align:"center"
    };
isc.A.navigationEditorDefaults={
        _constructor:"DynamicForm",
        autoParent:"navigationEditorLayout",
        wrapItemTitles:false
    };
isc.A.bindingLayoutDefaults={
        _constructor:"VLayout",
        width:"100%"
    };
isc.A.editedFields=["ID","description","message","nextElement","failureElement"];
isc.B.push(isc.A.initWidget=function isc_UserConfirmationGatewayEditor_initWidget(){
        this.Super("initWidget",arguments);
        var fields=[];
        fields.add(isc.addProperties({},this.nextElementPickerDefaults,this.nextElementPickerProperties,
                {valueMap:this.getTargetableElementsValueMap()}));
        fields.add(isc.addProperties({},this.failureElementPickerDefaults,this.failureElementPickerProperties,
                {valueMap:this.getTargetableElementsValueMap(true)}));
        this.addIdEditor();
        this.addMessageEditor();
        this.addAutoChild("navigationEditorLayout");
        this.addAutoChild("navigationEditor",{fields:fields});
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.addMessageEditor=function isc_UserConfirmationGatewayEditor_addMessageEditor(){
        var fields=[isc.addProperties({},this.messageFieldDefaults)];
        this.addAutoChild("messageEditor",{fields:fields});
    }
,isc.A.setEditorValues=function isc_UserConfirmationGatewayEditor_setEditorValues(){
        var values=this.elementEditNodeDefaults;
        this.idEditor.setValues(values);
        this.navigationEditor.setValues(values);
        this.descriptionEditor.setValues(values);
        this.messageEditor.setValues(values);
    }
,isc.A.validate=function isc_UserConfirmationGatewayEditor_validate(){
        var valid=this.idEditor.validate()&&
            this.messageEditor.validate()&&
            this.navigationEditor.validate()&&
            this.descriptionEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_UserConfirmationGatewayEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            navigationValues=this.navigationEditor.getValues(),
            messageValues=this.messageEditor.getValues()
        ;
        editedDefaults.message=messageValues.message;
        editedDefaults.nextElement=navigationValues.nextElement;
        editedDefaults.failureElement=navigationValues.failureElement;
        return editedDefaults;
    }
,isc.A.createDescription=function isc_UserConfirmationGatewayEditor_createDescription(defaults){
        var processElement=this._processElement;
        if(!processElement){
            this._processElement=processElement=isc.ClassFactory.newInstance(this.processElementType,defaults);
        }else{
            this._processElement.addProperties(defaults);
        }
        var description=processElement.getElementDescription();
        return description;
    }
);
isc.B._maxIndex=isc.C+6;

isc.defineClass("DecisionGatewayEditor","ProcessElementEditor");
isc.A=isc.DecisionGatewayEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=600;
isc.A.height=600;
isc.A.minWidth=600;
isc.A.minHeight=600;
isc.A.processElementType="DecisionGateway";
isc.A.invalidateEditor=true;
isc.A.editorTitle="Multi Decision";
isc.A.instructions="Pick tasks and the criteria that should cause that task to be done next. Pick a fallback task at the bottom, used if no criteria match.";
isc.A.instructionsDefaults={
        _constructor:isc.HTMLFlow,
        autoParent:"bindingLayout",
        width:"100%",
        padding:5
    };
isc.A.decisionListEditorDefaults={
        _constructor:isc.StackedListEditor,
        autoParent:"bindingLayout",
        height:"100%",
        width:"100%",
        newItemTitle:"[No criteria entered yet]",
        getItemTitle:function(item){
            return item.targetTask;
        },
        addButtonTitle:"Add another option",
        itemEditorConstructor:"TaskDecisionEditor",
        getItemEditorProperties:function(item){
            return{
                targetableElementsValueMap:this.targetableElementsValueMap,
                targetRuleScope:this.ruleScope,
                _ruleScopeDataSources:this._ruleScopeDataSources,
                taskDecision:item
            };
        },
        getItemEditorValue:function(itemEditor,section){
            return itemEditor.getValue();
        }
    };
isc.A.defaultElementPickerDefaults={
        name:"defaultElement",
        type:"SelectItem",
        title:"If no criteria match",
        width:300,
        allowEmptyValue:true
    };
isc.A.navigationEditorLayoutDefaults={
        _constructor:"HLayout",
        height:1,
        align:"center"
    };
isc.A.navigationEditorDefaults={
        _constructor:"DynamicForm",
        autoParent:"navigationEditorLayout",
        wrapItemTitles:false
    };
isc.A.bindingLayoutDefaults={
        _constructor:"VLayout",
        width:"100%"
    };
isc.A.editedFields=["ID","description","decisionList","defaultElement"];
isc.B.push(isc.A.initWidget=function isc_DecisionGatewayEditor_initWidget(){
        this.Super("initWidget",arguments);
        var fields=[],
            targetableElementsValueMap=this.getTargetableElementsValueMap(true)
        ;
        fields.add(isc.addProperties({},this.defaultElementPickerDefaults,this.defaultElementPickerProperties,
                {valueMap:targetableElementsValueMap}));
        this.addIdEditor();
        var layout=this.addAutoChild("bindingLayout");
        this.addAutoChild("instructions",{contents:this.instructions});
        var decisionListProperties={
            ruleScope:this.ruleScope,
            _ruleScopeDataSources:this.getCriteriaDataSources(),
            targetableElementsValueMap:this.getTargetableElementsValueMap(true),
            removeIcon:this.editor.removeIcon
        }
        this.addAutoChild("decisionListEditor",decisionListProperties);
        this.addAutoChild("navigationEditorLayout");
        this.addAutoChild("navigationEditor",{fields:fields});
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.setEditorValues=function isc_DecisionGatewayEditor_setEditorValues(){
        var values=this.elementEditNodeDefaults;
        this.idEditor.setValues(values);
        this.navigationEditor.setValues(values);
        this.descriptionEditor.setValues(values);
        if(values.decisionList){
            var decisionList=[],
                dl=values.decisionList
            ;
            for(var i=0;i<dl.length;i++){
                var criteria=isc.clone(dl[i].criteria),
                    taskDecision={targetTask:dl[i].targetTask}
                ;
                taskDecision.criteria=this._encodeAdvancedCriteriaExpressions(criteria);
                decisionList.add(taskDecision)
            }
            this.decisionListEditor.setItems(decisionList);
        }
    }
,isc.A.validate=function isc_DecisionGatewayEditor_validate(){
        return this.idEditor.validate()&&this.decisionListEditor.validate()&&
            this.navigationEditor.validate()&&this.descriptionEditor.validate();
    }
,isc.A.getEditedElementDefaults=function isc_DecisionGatewayEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            navigationValues=this.navigationEditor.getValues()
        ;
        editedDefaults.defaultElement=navigationValues.defaultElement;
        var decisionList=this.decisionListEditor.getItems();
        for(var i=0;i<decisionList.length;i++){
            var criteria=this._decodeAdvancedCriteriaExpressions(decisionList[i].criteria);
            decisionList[i].criteria=isc.DS.simplifyAdvancedCriteria(criteria,true);
        }
        editedDefaults.decisionList=decisionList;
        return editedDefaults;
    }
,isc.A.createDescription=function isc_DecisionGatewayEditor_createDescription(defaults){
        var processElement=this._processElement;
        if(!processElement){
            this._processElement=processElement=isc.ClassFactory.newInstance(this.processElementType,defaults);
        }else{
            this._processElement.addProperties(defaults);
        }
        var description=processElement.getElementDescription();
        return description;
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("ComponentTaskEditor","ProcessElementEditor");
isc.A=isc.ComponentTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=400;
isc.A.minWidth=400;
isc.A.processElementType=null;
isc.A.selectionComponentBaseClasses=["ListGrid","TileGrid"];
isc.A.editorTitle=null;
isc.A.componentIdEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        autoFocus:true,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        },
        setFocus:function(hasFocus,canTargetIcon){
            var initialItem=(hasFocus?this.getFocusSubItem():null);
            this.Super("setFocus",arguments);
            var currentItem=(hasFocus?this.getFocusSubItem():null);
            if(!initialItem&&currentItem&&currentItem.showPicker){
                if(currentItem.getValue()==null)currentItem.showPicker();
            }
        }
    };
isc.A.componentIdPickerDefaults={
        name:"componentId",
        type:"ComboBoxItem",
        title:"Component",
        required:true,
        valueField:"ID",
        displayField:"ID",
        pickListHeight:700,
        pickListFields:[
            {name:"ID",autoFitWidth:true,treeField:true},
            {name:"title",width:"*",showHover:true,formatCellValue:function(value,record,rowNum,colNum,grid){return value||record.className;}}
        ],
        pickListProperties:{showHeader:false},
        autoOpenTree:"all"
    };
isc.A.editedFields=["ID","description","componentId"];
isc.B.push(isc.A.destroy=function isc_ComponentTaskEditor_destroy(){
        this.Super("destroy",arguments);
        this.destroyComponentPickerDataSources();
    }
,isc.A.getEditorTitle=function isc_ComponentTaskEditor_getEditorTitle(){
        return isc.DS.getAutoTitle(this.processElementType);
    }
,isc.A.addComponentIdEditor=function isc_ComponentTaskEditor_addComponentIdEditor(forceTree){
        var task=isc.ClassFactory.newInstance(this.processElementType),
            supportedComponentBaseClasses=task.getComponentBaseClasses()
        ;
        var fields=[
            this.getFormFieldForAvailableComponents("componentIdPicker",this.targetComponents,supportedComponentBaseClasses,{
                changed:function(){
                    this.form.creator.componentIdChanged();
                }
            },forceTree)
        ];
        this.addAutoChild("componentIdEditor",{fields:fields});
    }
,isc.A.setEditorValues=function isc_ComponentTaskEditor_setEditorValues(){
        var values=this.elementEditNodeDefaults;
        this.idEditor.setValues(values);
        var selectedValue=this.componentIdEditor.getValue("componentId");
        this.componentIdEditor.setValues(values);
        if(selectedValue!=null)this.componentIdEditor.setValue("componentId",selectedValue);
        this.descriptionEditor.setValues(values);
    }
,isc.A.validate=function isc_ComponentTaskEditor_validate(){
        var valid=this.idEditor.validate()&&this.componentIdEditor.validate()&&this.descriptionEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_ComponentTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            values=this.componentIdEditor.getValues()
        ;
        editedDefaults.componentId=values.componentId;
        return editedDefaults;
    }
,isc.A.getDefaultComponentBindings=function isc_ComponentTaskEditor_getDefaultComponentBindings(defaultValues){
        if(!this.lastTaskFetchDataSource)return defaultValues;
        var componentDS=this.getComponentDataSource();
        if(!componentDS||componentDS!=isc.DS.get(this.lastTaskFetchDataSource)){
            return defaultValues;
        }
        var fieldNames=componentDS.getFieldNames(),
            values={}
        ;
        for(var i=0;i<fieldNames.length;i++){
            var fieldName=fieldNames[i];
            values[fieldName]="$last."+fieldName;
        }
        return values;
    }
,isc.A.componentIdChanged=function isc_ComponentTaskEditor_componentIdChanged(){}
,isc.A.getComponent=function isc_ComponentTaskEditor_getComponent(){
        var componentId=this.componentIdEditor.getValue("componentId");
        if(!componentId)return null;
        return window[componentId];
    }
,isc.A.getComponentDataSource=function isc_ComponentTaskEditor_getComponentDataSource(){
        var component=this.getComponent();
        if(!component)return null;
        var dataSource=component.dataSource;
        return isc.DS.get(dataSource);
    }
,isc.A.getFormFieldForAvailableComponents=function isc_ComponentTaskEditor_getFormFieldForAvailableComponents(fieldName,availableComponents,baseClass,properties,forceTree){
        availableComponents=availableComponents||[];
        baseClass=(baseClass?(isc.isAn.Array(baseClass)?baseClass:[baseClass]):null);
        if(forceTree==null&&baseClass&&baseClass.length==1&&baseClass[0]=="Canvas"){
            forceTree=true;
        }
        if(!forceTree&&isc.isA.Tree(availableComponents)){
            availableComponents=availableComponents.getCleanNodeData(availableComponents.getAllNodes());
            for(var i=0;i<availableComponents.length;i++){
                var componentRecord=availableComponents[i];
                delete componentRecord.isFolder;
                delete componentRecord.children;
            }
        }
        if(!isc.isA.Tree(availableComponents)){
            availableComponents.sortByProperty("ID",true);
        }
        var components=availableComponents;
        if(baseClass){
            var workflowEditor=this.editor;
            if(isc.isA.Tree(availableComponents)){
                components=workflowEditor.filterComponentsTree(availableComponents,null,baseClass);
                components.openAll();
            }else{
                components=[];
                for(var i=0;i<availableComponents.length;i++){
                    var componentRecord=availableComponents[i];
                    if(workflowEditor.isApplicableComponent(componentRecord,null,baseClass)){
                        components.add(componentRecord);
                    }
                }
            }
        }
        var defaults=this[fieldName+"Defaults"];
        var ds=this.createComponentPickerDataSource(fieldName,defaults,components);
        var additionalProperties=null;
        if(this.lastTaskFetchDataSource){
            additionalProperties={
                dataArrived:function(){
                    if(this.getValue()==null){
                        var choices=this.getClientPickListData();
                        if(choices&&choices.getLength()>0){
                            var choice=choices[0];
                            this.setValue(choice.ID);
                            this.form.creator.setEditorValues();
                            if(this.form.creator.valuesChanged){
                                this.form.creator.valuesChanged();
                            }
                        }
                    }
                }
            };
        }else if(components&&!isc.isA.Tree(components)&&components.getLength()==1){
            additionalProperties={
                defaultToFirstOption:true,
                dataArrived:function(){
                    if(!this._calledSetEditorValues){
                        this.form.creator.setEditorValues();
                        this._calledSetEditorValues=true;
                        if(this.form.creator.valuesChanged){
                            this.form.creator.valuesChanged();
                        }
                    }
                }
            };
        }else if(components&&isc.isA.Tree(components)){
            var filteredComponents=(isc.isA.Tree(components)?
                    components.getAllNodes().findAll("enabled",true):
                    components);
            if(filteredComponents&&filteredComponents.getLength()==1){
                additionalProperties={
                    dataArrived:function(){
                        if(!this._calledSetEditorValues){
                            this.setValue(filteredComponents[0].ID);
                            this.form.creator.setEditorValues();
                            this._calledSetEditorValues=true;
                            if(this.form.creator.valuesChanged){
                                this.form.creator.valuesChanged();
                            }
                        }
                    }
                };
            }
        }
        var field=isc.addProperties({},defaults,{
            optionDataSource:ds,
            emptyPickListMessage:"No appropriate components exist",
            dataSetType:(isc.isA.Tree(components)?"tree":"list"),
            addUnknownValues:false
        },properties,additionalProperties);
        return field;
    }
,isc.A.createComponentPickerDataSource=function isc_ComponentTaskEditor_createComponentPickerDataSource(fieldName,fieldProperties,data){
        var ID=this.getID()+"_"+fieldName+"_DS";
        var fields=[],
            fieldNames={}
        ;
        if(fieldProperties.valueField){
            fields.add({name:fieldProperties.valueField,primaryKey:true});
            fieldNames[fieldProperties.valueField]=true;
            if(isc.isA.Tree(data)){
                fields.add({name:"parentId",foreignKey:fieldProperties.valueField});
            }
        }
        if(fieldProperties.displayField&&!fieldNames[fieldProperties.displayField]){
            fields.add({name:fieldProperties.displayField});
            fieldNames[fieldProperties.displayField]=true;
        }
        var ds=isc.DS.create({
            ID:ID,
            clientOnly:true,
            fields:fields,
            cacheData:(isc.isA.Tree(data)?data.getAllNodes():data)
        });
        if(!this._componentPickerDataSources)this._componentPickerDataSources=[];
        this._componentPickerDataSources.add(ds);
        return ds;
    }
,isc.A.destroyComponentPickerDataSources=function isc_ComponentTaskEditor_destroyComponentPickerDataSources(){
        if(this._componentPickerDataSources){
            var dsList=this._componentPickerDataSources;
            for(var i=0;i<dsList.length;i++){
                dsList[i].destroy();
            }
        }
    }
,isc.A.getSelectionComponentBaseClasses=function isc_ComponentTaskEditor_getSelectionComponentBaseClasses(){
        return(isc.isAn.Array(this.selectionComponentBaseClasses)?this.selectionComponentBaseClasses:[this.selectionComponentBaseClasses]);
    }
);
isc.B._maxIndex=isc.C+14;

isc.defineClass("GridFetchDataTaskEditor","ComponentTaskEditor");
isc.A=isc.GridFetchDataTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="GridFetchDataTask";
isc.A.criteriaNotCompleteMessage="Criteria is missing or not complete";
isc.A.filterBuilderDefaults={
        _constructor:"FilterBuilder",
        showModeSwitcher:true,
        initWidget:function(){
            this._skipFilterChanged=true;
            this.Super("initWidget",arguments);
            this._skipFilterChanged=false;
        },
        draw:function(){
            this._skipFilterChanged=true;
            this.Super("draw",arguments);
            this._skipFilterChanged=false;
        },
        filterChanged:function(){
            if(!this._skipFilterChanged&&this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.criteriaErrorDefaults={
        _constructor:isc.HTMLFlow,
        width:"100%",
        visibility:"hidden"
    };
isc.A.editedFields=["ID","description","componentId","criteria"];
isc.B.push(isc.A.initWidget=function isc_GridFetchDataTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.addAutoChild("criteriaError");
        var filterBuilderProperties={
            targetRuleScope:this.ruleScope,
            allowRuleScopeValues:true,
            targetComponent:{ID:"_none_"},
            _ruleScopeDataSources:this.getCriteriaDataSources()
        };
        this.addAutoChild("filterBuilder",filterBuilderProperties);
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.setEditorValues=function isc_GridFetchDataTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        var ds=this.getComponentDataSource();
        this.filterBuilder.setDataSource(ds);
        if(this.elementEditNodeDefaults.criteria){
            var criteria=isc.clone(this.elementEditNodeDefaults.criteria);
            this._encodeAdvancedCriteriaExpressions(criteria);
            this.filterBuilder.setCriteria(criteria);
        }
        if(ds)this.filterBuilder.show();
        else this.filterBuilder.hide();
    }
,isc.A.validate=function isc_GridFetchDataTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.filterBuilder.validate(),
        message=null
        ;
        if(valid){
            var criteria=this.filterBuilder.getCriteria(),
                criteriaIsEmpty=(!criteria.criteria||criteria.criteria.isEmpty()),
                isPartialCriteria=criteriaIsEmpty&&!this.filterBuilder.getCriteria(true).criteria.isEmpty()
            ;
            if(criteriaIsEmpty||isPartialCriteria){
                valid=false;
                message=this.criteriaNotCompleteMessage;
            }
        }
        if(!valid&&message){
            var templateField=this.componentIdEditor.getField("componentId");
            var iconHTML=isc.Canvas.imgHTML(templateField.errorIconSrc,
                               templateField.errorIconWidth,templateField.errorIconHeight);
            this.criteriaError.setContents(iconHTML+"&nbsp;"+message);
            this.criteriaError.show();
        }else{
            this.criteriaError.hide();
        }
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_GridFetchDataTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments);
        var criteria=this.filterBuilder.getCriteria();
        this._decodeAdvancedCriteriaExpressions(criteria);
        editedDefaults.criteria=isc.DS.simplifyAdvancedCriteria(criteria,true);
        return editedDefaults;
    }
,isc.A.componentIdChanged=function isc_GridFetchDataTaskEditor_componentIdChanged(){
        var ds=this.getComponentDataSource();
        this.filterBuilder.setDataSource(ds);
        if(ds)this.filterBuilder.show();
        else this.filterBuilder.hide();
    }
,isc.A.createDescription=function isc_GridFetchDataTaskEditor_createDescription(defaults){
        var processElement=this._processElement;
        if(!processElement){
            this._processElement=processElement=isc.ClassFactory.newInstance(this.processElementType,defaults);
        }else{
            this._processElement.addProperties(defaults);
        }
        var description=processElement.getElementDescription();
        return description;
    }
);
isc.B._maxIndex=isc.C+6;

isc.defineClass("GridFetchRelatedDataTaskEditor","ComponentTaskEditor");
isc.A=isc.GridFetchRelatedDataTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="GridFetchRelatedDataTask";
isc.A.dataSourcePickerDefaults={
        name:"dataSource",
        type:"ComboBoxItem",
        title:"DataSource",
        required:true
    };
isc.A.recordSourceComponentPickerDefaults={
        name:"recordSourceComponent",
        type:"ComboBoxItem",
        title:"Record Source",
        required:true,
        valueField:"ID",
        displayField:"ID",
        pickListWidth:250,
        pickListFields:[
            {name:"ID",autoFitWidth:true,treeField:true},
            {name:"title",width:"*",showHover:true,formatCellValue:function(value,record,rowNum,colNum,grid){return value||record.className;}}
        ],
        pickListProperties:{showHeader:false},
        autoOpenTree:"all"
    };
isc.A.relatedEditorDefaults={
        _constructor:"DynamicForm",
        wrapItemTitles:false,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.editedFields=["ID","description","componentId","dataSource","recordSourceComponent"];
isc.B.push(isc.A.initWidget=function isc_GridFetchRelatedDataTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        var fields=[
            isc.addProperties({},this.dataSourcePickerDefaults,this.dataSourcePickerProperties,
                {valueMap:this.dataSources,changed:this.dataSourceChanged}),
            this.getFormFieldForAvailableComponents("recordSourceComponentPicker",this.availableComponents,"DataBoundComponent")
        ];
        this.addAutoChild("relatedEditor",{fields:fields});
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.setEditorValues=function isc_GridFetchRelatedDataTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        this.relatedEditor.setValues(this.elementEditNodeDefaults);
    }
,isc.A.validate=function isc_GridFetchRelatedDataTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.relatedEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_GridFetchRelatedDataTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            values=this.relatedEditor.getValues()
        ;
        editedDefaults.dataSource=values.dataSource;
        editedDefaults.recordSourceComponent=values.recordSourceComponent;
        return editedDefaults;
    }
,isc.A.createDescription=function isc_GridFetchRelatedDataTaskEditor_createDescription(defaults){
        return"Fetch '"+defaults.componentId+"' data from related record in '"+defaults.recordSourceComponent+"'";
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("GridStartEditingTaskEditor","ComponentTaskEditor");
isc.A=isc.GridStartEditingTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=600;
isc.A.minWidth=600;
isc.A.height=400;
isc.A.minHeight=400;
isc.A.processElementType="GridStartEditingTask";
isc.A.valuesInstructions="Drag available fields from the tree on the left to the grid on the right to specify initial values for the new record. Or click the pencil icon to enter a fixed value.";
isc.A.overwriteBindingsMessage="Overwrite all existing bindings? Otherwise, new bindings will be merged.";
isc.A.fixedValueWindowTitle="Fixed value for field '${fieldName}'";
isc.A.bindingValuePrompt="Click the pencil icon to enter a fixed value";
isc.A.bindingContainerDefaults={
        _constructor:"BindingContainer",
        height:"*"
    };
isc.A.bindingValuesPaneDefaults={
        _constructor:"BindingValuesPane",
        valuesChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.editedFields=["ID","description","componentId","initialValues"];
isc.B.push(isc.A.initWidget=function isc_GridStartEditingTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.bindingValuesPane=this.createAutoChild("bindingValuesPane",{
            scopeTreeData:this.getScopeTreeData(),
            bindingValuePrompt:this.bindingValuePrompt,
            fixedValueWindowTitle:this.fixedValueWindowTitle,
            overwriteBindingsMessage:this.overwriteBindingsMessage
        });
        var bindingPanes=[
            {name:"values",pane:this.bindingValuesPane,instructions:this.valuesInstructions,currentPane:true}
        ];
        var container=this.addAutoChild("bindingContainer",{bindingPanes:bindingPanes});
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.setEditorValues=function isc_GridStartEditingTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        var ds=this.getComponentDataSource();
        this.bindingValuesPane.setDataSource(ds);
        this.bindingValuesPane.setValues(this.getDefaultComponentBindings(this.elementEditNodeDefaults.initialValues));
        this.bindingContainer.showPane(ds!=null);
    }
,isc.A.getEditedElementDefaults=function isc_GridStartEditingTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments);
        editedDefaults.initialValues=this.bindingValuesPane.getValues();
        return editedDefaults;
    }
,isc.A.componentIdChanged=function isc_GridStartEditingTaskEditor_componentIdChanged(){
        var ds=this.getComponentDataSource();
        this.bindingValuesPane.setDataSource(ds);
        this.bindingContainer.showPane(ds!=null);
    }
,isc.A.createDescription=function isc_GridStartEditingTaskEditor_createDescription(defaults){
        return"Edit '"+defaults.componentId+"' new record";
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("GridRemoveSelectedDataTaskEditor","ComponentTaskEditor");
isc.A=isc.GridRemoveSelectedDataTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="GridRemoveSelectedDataTask";
isc.B.push(isc.A.initWidget=function isc_GridRemoveSelectedDataTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.createDescription=function isc_GridRemoveSelectedDataTaskEditor_createDescription(defaults){
        return"Remove '"+defaults.componentId+"' selected records";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridSaveAllEditsTaskEditor","ComponentTaskEditor");
isc.A=isc.GridSaveAllEditsTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="GridSaveAllEditsTask";
isc.B.push(isc.A.initWidget=function isc_GridSaveAllEditsTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.createDescription=function isc_GridSaveAllEditsTaskEditor_createDescription(defaults){
        return"Save all '"+defaults.componentId+"' edits";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridExportDataTaskEditor","ComponentTaskEditor");
isc.A=isc.GridExportDataTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="GridExportDataTask";
isc.B.push(isc.A.initWidget=function isc_GridExportDataTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.createDescription=function isc_GridExportDataTaskEditor_createDescription(defaults){
        return"Export '"+defaults.componentId+"' data (Server)";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridExportClientDataTaskEditor","ComponentTaskEditor");
isc.A=isc.GridExportClientDataTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="GridExportClientDataTask";
isc.B.push(isc.A.initWidget=function isc_GridExportClientDataTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.createDescription=function isc_GridExportClientDataTaskEditor_createDescription(defaults){
        return"Export '"+defaults.componentId+"' data (Client)";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridSetEditValueTaskEditor","ComponentTaskEditor");
isc.A=isc.GridSetEditValueTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="GridSetEditValueTask";
isc.A.targetEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        fixedColWidths:true,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.targetFieldPickerDefaults={
        name:"targetField",
        type:"ComboBoxItem",
        title:"Target Field",
        required:true,
        allowUnknownValues:false
    };
isc.A.valueFieldDefaults={
        name:"value",
        type:"DynamicValueItem",
        title:"Value",
        required:true,
        allowRuleScopeValues:true,
        fieldName:"value"
    };
isc.A.editedFields=["ID","description","componentId","targetField","value"];
isc.B.push(isc.A.initWidget=function isc_GridSetEditValueTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.addTargetEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.addTargetEditor=function isc_GridSetEditValueTaskEditor_addTargetEditor(){
        var fieldNames=this.getTargetComponentFieldNames();
        var fields=[
            isc.addProperties({},this.targetFieldPickerDefaults,{
                valueMap:fieldNames,
                changed:function(){
                    this.form.creator.targetFieldChanged();
                }
            }),
            isc.addProperties({},this.valueFieldDefaults,{targetRuleScope:this._targetRuleScope,_ruleScopeDataSources:this.getRuleScopeDataSources()})
        ];
        this.addAutoChild("targetEditor",{fields:fields});
    }
,isc.A.setEditorValues=function isc_GridSetEditValueTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        var fieldNames=this.getTargetComponentFieldNames();
        this.targetEditor.getField("targetField").setValueMap(fieldNames);
        var dataSource=this.getComponentDataSource(),
            fieldName=this.elementEditNodeDefaults.targetField,
            fieldTitle=(fieldName?dataSource.getField(fieldName).title:null),
            valueField=this.targetEditor.getField("value")
        ;
        valueField.targetComponent=this.getComponent();
        valueField.dataSource=this.getComponentDataSource();
        valueField.setField(fieldName,fieldTitle);
        this.targetEditor.setValues(this.elementEditNodeDefaults);
    }
,isc.A.validate=function isc_GridSetEditValueTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.targetEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_GridSetEditValueTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            targetFieldValues=this.targetEditor.getValues()
        ;
        editedDefaults.targetField=targetFieldValues.targetField;
        editedDefaults.value=targetFieldValues.value;
        return editedDefaults;
    }
,isc.A.getTargetComponentFieldNames=function isc_GridSetEditValueTaskEditor_getTargetComponentFieldNames(){
        var ds=this.getComponentDataSource();
        return(ds?ds.getFieldNames():[]);
    }
,isc.A.componentIdChanged=function isc_GridSetEditValueTaskEditor_componentIdChanged(){
        var fieldNames=this.getTargetComponentFieldNames();
        this.targetEditor.getField("targetField").setValueMap(fieldNames);
        var valueField=this.targetEditor.getField("value");
        valueField.dataSource=this.getComponentDataSource();
        valueField.setField(null);
        this.targetEditor.setValue("targetField",null);
        this.targetEditor.setValue("value",null);
    }
,isc.A.targetFieldChanged=function isc_GridSetEditValueTaskEditor_targetFieldChanged(){
        var fieldName=this.targetEditor.getValue("targetField"),
            valueField=this.targetEditor.getField("value")
        ;
        var dataSource=this.getComponentDataSource(),
            fieldTitle=(fieldName?dataSource.getField(fieldName).title:null)
        ;
        valueField.dataSource=dataSource;
        valueField.setField(fieldName,fieldTitle);
        this.targetEditor.setValue("value",null);
    }
,isc.A.createDescription=function isc_GridSetEditValueTaskEditor_createDescription(defaults){
        return"Set '"+defaults.componentId+"."+defaults.targetField+"' edit value";
    }
);
isc.B._maxIndex=isc.C+9;

isc.defineClass("FormSaveDataTaskEditor","ComponentTaskEditor");
isc.A=isc.FormSaveDataTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=500;
isc.A.minWidth=500;
isc.A.processElementType="FormSaveDataTask";
isc.A.failureElementPickerDefaults={
        name:"failureElement",
        type:"SelectItem",
        title:"If save <b>fails</b>, next task",
        showHintInField:true,
        hint:"terminate workflow",
        width:300,
        allowEmptyValue:true
    };
isc.A.navigationEditorLayoutDefaults={
        _constructor:"HLayout",
        align:"center",
        height:1
    };
isc.A.navigationEditorDefaults={
        _constructor:"DynamicForm",
        autoParent:"navigationEditorLayout",
        wrapItemTitles:false
    };
isc.A.editedFields=["ID","description","componentId","failureElement"];
isc.B.push(isc.A.initWidget=function isc_FormSaveDataTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        var fields=[],
            targetableElementsValueMap=this.getTargetableElementsValueMap()
        ;
        fields.add(isc.addProperties({},this.failureElementPickerDefaults,this.failureElementPickerProperties,
            {valueMap:targetableElementsValueMap}));
        this.addAutoChild("navigationEditorLayout");
        this.addAutoChild("navigationEditor",{fields:fields});
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.setEditorValues=function isc_FormSaveDataTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        var values=this.elementEditNodeDefaults;
        this.navigationEditor.setValues(values);
    }
,isc.A.validate=function isc_FormSaveDataTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.navigationEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_FormSaveDataTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            navigationValues=this.navigationEditor.getValues()
        ;
        editedDefaults.failureElement=navigationValues.failureElement;
        return editedDefaults;
    }
,isc.A.createDescription=function isc_FormSaveDataTaskEditor_createDescription(defaults){
        return"Save '"+defaults.componentId+"' data";
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("FormEditNewRecordTaskEditor","ComponentTaskEditor");
isc.A=isc.FormEditNewRecordTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=600;
isc.A.minWidth=600;
isc.A.height=400;
isc.A.minHeight=400;
isc.A.processElementType="FormEditNewRecordTask";
isc.A.valuesInstructions="Drag available fields from the tree on the left to the grid on the right to specify what data should be stored. Or click the pencil icon to enter a fixed value.";
isc.A.overwriteBindingsMessage="Overwrite all existing bindings? Otherwise, new bindings will be merged.";
isc.A.fixedValueWindowTitle="Fixed value for field '${fieldName}'";
isc.A.bindingValuePrompt="Click the pencil icon to enter a fixed value";
isc.A.bindingContainerDefaults={
        _constructor:"BindingContainer",
        height:"*"
    };
isc.A.bindingValuesPaneDefaults={
        _constructor:"BindingValuesPane",
        valuesChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.editedFields=["ID","description","componentId","initialValues"];
isc.B.push(isc.A.initWidget=function isc_FormEditNewRecordTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.bindingValuesPane=this.createAutoChild("bindingValuesPane",{
            scopeTreeData:this.getScopeTreeData(),
            bindingValuePrompt:this.bindingValuePrompt,
            fixedValueWindowTitle:this.fixedValueWindowTitle,
            overwriteBindingsMessage:this.overwriteBindingsMessage
        });
        var bindingPanes=[
            {name:"values",pane:this.bindingValuesPane,instructions:this.valuesInstructions,currentPane:true}
        ];
        var container=this.addAutoChild("bindingContainer",{bindingPanes:bindingPanes});
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.setEditorValues=function isc_FormEditNewRecordTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        var ds=this.getComponentDataSource();
        this.bindingValuesPane.setDataSource(ds);
        this.bindingValuesPane.setValues(this.getDefaultComponentBindings(this.elementEditNodeDefaults.initialValues));
        this.bindingContainer.showPane(ds!=null);
    }
,isc.A.getEditedElementDefaults=function isc_FormEditNewRecordTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments);
        editedDefaults.initialValues=this.bindingValuesPane.getValues();
        return editedDefaults;
    }
,isc.A.componentIdChanged=function isc_FormEditNewRecordTaskEditor_componentIdChanged(){
        var ds=this.getComponentDataSource();
        this.bindingValuesPane.setDataSource(ds);
        this.bindingContainer.showPane(ds!=null);
    }
,isc.A.createDescription=function isc_FormEditNewRecordTaskEditor_createDescription(defaults){
        return"Edit '"+defaults.componentId+"' new record";
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("FormEditRecordTaskEditor","ComponentTaskEditor");
isc.A=isc.FormEditRecordTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="FormEditRecordTask";
isc.A.recordSourceComponentPickerDefaults={
        name:"recordSourceComponent",
        type:"ComboBoxItem",
        title:"Record Source",
        required:true,
        valueField:"ID",
        displayField:"ID",
        pickListWidth:250,
        pickListFields:[
            {name:"ID",autoFitWidth:true,treeField:true},
            {name:"title",width:"*",showHover:true,formatCellValue:function(value,record,rowNum,colNum,grid){return value||record.className;}}
        ],
        pickListProperties:{showHeader:false},
        autoOpenTree:"all"
    };
isc.A.relatedEditorDefaults={
        _constructor:"DynamicForm",
        wrapItemTitles:false,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.editedFields=["ID","description","componentId","recordSourceComponent"];
isc.B.push(isc.A.initWidget=function isc_FormEditRecordTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        var fields=[
            this.getFormFieldForAvailableComponents("recordSourceComponentPicker",this.availableComponents,"DataBoundComponent")
        ];
        this.addAutoChild("relatedEditor",{fields:fields});
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.setEditorValues=function isc_FormEditRecordTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        this.relatedEditor.setValues(this.elementEditNodeDefaults);
    }
,isc.A.validate=function isc_FormEditRecordTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.relatedEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_FormEditRecordTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            values=this.relatedEditor.getValues()
        ;
        editedDefaults.recordSourceComponent=values.recordSourceComponent;
        return editedDefaults;
    }
,isc.A.createDescription=function isc_FormEditRecordTaskEditor_createDescription(defaults){
        return"Edit '"+defaults.componentId+"' from '"+defaults.recordSourceComponent+"' record";
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("FormEditSelectedTaskEditor","ComponentTaskEditor");
isc.A=isc.FormEditSelectedTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="FormEditSelectedTask";
isc.A.selectionComponentPickerDefaults={
        name:"selectionComponentId",
        type:"ComboBoxItem",
        title:"Select From",
        required:true,
        valueField:"ID",
        displayField:"ID",
        pickListWidth:250,
        pickListFields:[
            {name:"ID",autoFitWidth:true,treeField:true},
            {name:"title",width:"*",showHover:true,formatCellValue:function(value,record,rowNum,colNum,grid){return value||record.className;}}
        ],
        pickListProperties:{showHeader:false},
        autoOpenTree:"all"
    };
isc.A.selectedEditorDefaults={
        _constructor:"DynamicForm",
        wrapItemTitles:false,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.editedFields=["ID","description","componentId","selectionComponentId"];
isc.B.push(isc.A.initWidget=function isc_FormEditSelectedTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        var fields=[
            this.getFormFieldForAvailableComponents("selectionComponentPicker",this.availableComponents,this.getSelectionComponentBaseClasses())
        ];
        this.addAutoChild("selectedEditor",{fields:fields});
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.setEditorValues=function isc_FormEditSelectedTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        this.selectedEditor.setValues(this.elementEditNodeDefaults);
    }
,isc.A.validate=function isc_FormEditSelectedTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.selectedEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_FormEditSelectedTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            values=this.selectedEditor.getValues()
        ;
        editedDefaults.selectionComponentId=values.selectionComponentId;
        return editedDefaults;
    }
,isc.A.createDescription=function isc_FormEditSelectedTaskEditor_createDescription(defaults){
        return"Edit '"+defaults.componentId+"' from '"+defaults.selectionComponentId+"' selected record";
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("FormHideFieldTaskEditor","ComponentTaskEditor");
isc.A=isc.FormHideFieldTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="FormHideFieldTask";
isc.A.targetEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        fixedColWidths:true,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.targetFieldPickerDefaults={
        name:"targetField",
        type:"ComboBoxItem",
        title:"Target Field",
        required:true,
        allowUnknownValues:false
    };
isc.A.hideDefaults={
        name:"hide",
        type:"RadioGroupItem",
        title:"Field should be",
        defaultValue:true,
        vertical:false,
        valueMap:{
            true:"Hidden",
            false:"Visible"
        },
        required:true
    };
isc.A.editedFields=["ID","description","componentId","targetField","hide"];
isc.B.push(isc.A.initWidget=function isc_FormHideFieldTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.addTargetEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.addTargetEditor=function isc_FormHideFieldTaskEditor_addTargetEditor(){
        var fieldNames=this.getTargetComponentFieldNames();
        var fields=[
            isc.addProperties({},this.targetFieldPickerDefaults,{
                valueMap:fieldNames
            }),
            isc.addProperties({},this.hideDefaults)
        ];
        this.addAutoChild("targetEditor",{fields:fields});
    }
,isc.A.setEditorValues=function isc_FormHideFieldTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        var fieldNames=this.getTargetComponentFieldNames();
        this.targetEditor.getField("targetField").setValueMap(fieldNames);
        this.targetEditor.setValues(this.elementEditNodeDefaults);
    }
,isc.A.validate=function isc_FormHideFieldTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.targetEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_FormHideFieldTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            targetFieldValues=this.targetEditor.getValues()
        ;
        editedDefaults.targetField=targetFieldValues.targetField;
        editedDefaults.hide=targetFieldValues.hide;
        return editedDefaults;
    }
,isc.A.getTargetComponentFieldNames=function isc_FormHideFieldTaskEditor_getTargetComponentFieldNames(){
        var targetComponent=this.getComponent(),
            fieldNames=[]
        ;
        if(!targetComponent)return fieldNames;
        var fields=targetComponent.getFields();
        for(var i=0;i<fields.length;i++){
            fieldNames.add(fields[i].name);
        }
        if(fieldNames.length==0){
            var ds=this.getComponentDataSource();
            if(ds)fieldNames=ds.getFieldNames();
        }
        return fieldNames;
    }
,isc.A.componentIdChanged=function isc_FormHideFieldTaskEditor_componentIdChanged(){
        var fieldNames=this.getTargetComponentFieldNames();
        this.targetEditor.getField("targetField").setValueMap(fieldNames);
        this.targetEditor.setValue("targetField",null);
    }
,isc.A.createDescription=function isc_FormHideFieldTaskEditor_createDescription(defaults){
        var hide=defaults.hide;
        if(isc.isA.String(hide))hide=(hide=="true");
        return(hide?"Hide":"Show")+" "+defaults.componentId+"."+defaults.targetField;
    }
);
isc.B._maxIndex=isc.C+8;

isc.defineClass("FormDisableFieldTaskEditor","ComponentTaskEditor");
isc.A=isc.FormDisableFieldTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="FormDisableFieldTask";
isc.A.targetEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        fixedColWidths:true,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.targetFieldPickerDefaults={
        name:"targetField",
        type:"ComboBoxItem",
        title:"Target Field",
        required:true,
        allowUnknownValues:false
    };
isc.A.disableDefaults={
        name:"disable",
        type:"RadioGroupItem",
        title:"Field should be",
        defaultValue:true,
        vertical:false,
        valueMap:{
            true:"Disabled",
            false:"Enabled"
        },
        required:true
    };
isc.A.editedFields=["ID","description","componentId","targetField","disable"];
isc.B.push(isc.A.initWidget=function isc_FormDisableFieldTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.addTargetEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.addTargetEditor=function isc_FormDisableFieldTaskEditor_addTargetEditor(){
        var fieldNames=this.getTargetComponentFieldNames();
        var fields=[
            isc.addProperties({},this.targetFieldPickerDefaults,{
                valueMap:fieldNames
            }),
            isc.addProperties({},this.disableDefaults)
        ];
        this.addAutoChild("targetEditor",{fields:fields});
    }
,isc.A.setEditorValues=function isc_FormDisableFieldTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        var fieldNames=this.getTargetComponentFieldNames();
        this.targetEditor.getField("targetField").setValueMap(fieldNames);
        this.targetEditor.setValues(this.elementEditNodeDefaults);
    }
,isc.A.validate=function isc_FormDisableFieldTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.targetEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_FormDisableFieldTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            targetFieldValues=this.targetEditor.getValues()
        ;
        editedDefaults.targetField=targetFieldValues.targetField;
        editedDefaults.disable=targetFieldValues.disable;
        return editedDefaults;
    }
,isc.A.getTargetComponentFieldNames=function isc_FormDisableFieldTaskEditor_getTargetComponentFieldNames(){
        var targetComponent=this.getComponent(),
            fieldNames=[]
        ;
        if(!targetComponent)return fieldNames;
        var fields=targetComponent.getFields();
        for(var i=0;i<fields.length;i++){
            fieldNames.add(fields[i].name);
        }
        if(fieldNames.length==0){
            var ds=this.getComponentDataSource();
            if(ds)fieldNames=ds.getFieldNames();
        }
        return fieldNames;
    }
,isc.A.componentIdChanged=function isc_FormDisableFieldTaskEditor_componentIdChanged(){
        var fieldNames=this.getTargetComponentFieldNames();
        this.targetEditor.getField("targetField").setValueMap(fieldNames);
        this.targetEditor.setValue("targetField",null);
    }
,isc.A.createDescription=function isc_FormDisableFieldTaskEditor_createDescription(defaults){
        var disable=defaults.disable;
        if(isc.isA.String(disable))disable=(disable=="true");
        return(disable?"Disable":"Enable")+" '"+defaults.componentId+"."+defaults.targetField+"'";
    }
);
isc.B._maxIndex=isc.C+8;

isc.defineClass("FormSetFieldValueTaskEditor","ComponentTaskEditor");
isc.A=isc.FormSetFieldValueTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="FormSetFieldValueTask";
isc.A.targetEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        fixedColWidths:true,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.targetFieldPickerDefaults={
        name:"targetField",
        type:"ComboBoxItem",
        title:"Target Field",
        required:true,
        allowUnknownValues:false
    };
isc.A.valueFieldDefaults={
        name:"value",
        type:"DynamicValueItem",
        title:"Value",
        required:true,
        allowRuleScopeValues:true,
        fieldName:"value"
    };
isc.A.editedFields=["ID","description","componentId","targetField","value"];
isc.B.push(isc.A.initWidget=function isc_FormSetFieldValueTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.addTargetEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.addTargetEditor=function isc_FormSetFieldValueTaskEditor_addTargetEditor(){
        var fieldNames=this.getTargetComponentFieldNames();
        var fields=[
            isc.addProperties({},this.targetFieldPickerDefaults,{
                valueMap:fieldNames,
                changed:function(){
                    this.form.creator.targetFieldChanged();
                }
            }),
            isc.addProperties({},this.valueFieldDefaults,{targetRuleScope:this._targetRuleScope,_ruleScopeDataSources:this.getRuleScopeDataSources()})
        ];
        this.addAutoChild("targetEditor",{fields:fields});
    }
,isc.A.setEditorValues=function isc_FormSetFieldValueTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        var fieldNames=this.getTargetComponentFieldNames();
        this.targetEditor.getField("targetField").setValueMap(fieldNames);
        var dataSource=this.getComponentDataSource(),
            fieldName=this.elementEditNodeDefaults.targetField,
            fieldTitle=(fieldName?dataSource.getField(fieldName).title:null),
            valueField=this.targetEditor.getField("value")
        ;
        valueField.targetComponent=this.getComponent();
        valueField.dataSource=this.getComponentDataSource();
        valueField.setField(fieldName,fieldTitle);
        this.targetEditor.setValues(this.elementEditNodeDefaults);
    }
,isc.A.validate=function isc_FormSetFieldValueTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.targetEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_FormSetFieldValueTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            targetFieldValues=this.targetEditor.getValues()
        ;
        editedDefaults.targetField=targetFieldValues.targetField;
        editedDefaults.value=targetFieldValues.value;
        return editedDefaults;
    }
,isc.A.getComponentDataSource=function isc_FormSetFieldValueTaskEditor_getComponentDataSource(){
        var componentId=this.componentIdEditor.getValue("componentId");
        if(!componentId)return null;
        var component=window[componentId];
        if(!component)return null;
        var dataSource=component.dataSource;
        return isc.DS.get(dataSource);
    }
,isc.A.getTargetComponentFieldNames=function isc_FormSetFieldValueTaskEditor_getTargetComponentFieldNames(){
        var ds=this.getComponentDataSource();
        return(ds?ds.getFieldNames():[]);
    }
,isc.A.componentIdChanged=function isc_FormSetFieldValueTaskEditor_componentIdChanged(){
        var fieldNames=this.getTargetComponentFieldNames();
        this.targetEditor.getField("targetField").setValueMap(fieldNames);
        var valueField=this.targetEditor.getField("value");
        valueField.dataSource=this.getComponentDataSource();
        valueField.setFieldName(null);
        this.targetEditor.setValue("targetField",null);
        this.targetEditor.setValue("value",null);
    }
,isc.A.targetFieldChanged=function isc_FormSetFieldValueTaskEditor_targetFieldChanged(){
        var fieldName=this.targetEditor.getValue("targetField"),
            valueField=this.targetEditor.getField("value")
        ;
        var dataSource=this.getComponentDataSource(),
            fieldTitle=(fieldName?dataSource.getField(fieldName).title:null)
        ;
        valueField.dataSource=dataSource;
        valueField.setField(fieldName,fieldTitle);
        this.targetEditor.setValue("value",null);
    }
,isc.A.createDescription=function isc_FormSetFieldValueTaskEditor_createDescription(defaults){
        return"Set '"+defaults.componentId+"."+defaults.targetField+"' value";
    }
);
isc.B._maxIndex=isc.C+10;

isc.defineClass("FormSetValuesTaskEditor","ComponentTaskEditor");
isc.A=isc.FormSetValuesTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=600;
isc.A.minWidth=600;
isc.A.height=400;
isc.A.minHeight=400;
isc.A.processElementType="FormSetValuesTask";
isc.A.valuesInstructions="Drag available fields from the tree on the left to the grid on the right to specify initial values for the new record. Or click the pencil icon to enter a fixed value.";
isc.A.overwriteBindingsMessage="Overwrite all existing bindings? Otherwise, new bindings will be merged.";
isc.A.fixedValueWindowTitle="Fixed value for field '${fieldName}'";
isc.A.bindingValuePrompt="Click the pencil icon to enter a fixed value";
isc.A.bindingContainerDefaults={
        _constructor:"BindingContainer",
        height:"*"
    };
isc.A.bindingValuesPaneDefaults={
        _constructor:"BindingValuesPane",
        valuesChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.editedFields=["ID","description","componentId","values"];
isc.B.push(isc.A.initWidget=function isc_FormSetValuesTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.bindingValuesPane=this.createAutoChild("bindingValuesPane",{
            scopeTreeData:this.getScopeTreeData(),
            bindingValuePrompt:this.bindingValuePrompt,
            fixedValueWindowTitle:this.fixedValueWindowTitle,
            overwriteBindingsMessage:this.overwriteBindingsMessage
        });
        var bindingPanes=[
            {name:"values",pane:this.bindingValuesPane,instructions:this.valuesInstructions,currentPane:true}
        ];
        var container=this.addAutoChild("bindingContainer",{bindingPanes:bindingPanes});
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.setEditorValues=function isc_FormSetValuesTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        var ds=this.getComponentDataSource();
        this.bindingValuesPane.setDataSource(ds);
        this.bindingValuesPane.setValues(this.getDefaultComponentBindings(this.elementEditNodeDefaults.values));
        this.bindingContainer.showPane(ds!=null);
    }
,isc.A.getEditedElementDefaults=function isc_FormSetValuesTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments);
        editedDefaults.values=this.bindingValuesPane.getValues();
        return editedDefaults;
    }
,isc.A.componentIdChanged=function isc_FormSetValuesTaskEditor_componentIdChanged(){
        var ds=this.getComponentDataSource();
        this.bindingValuesPane.setDataSource(ds);
        this.bindingContainer.showPane(ds!=null);
    }
,isc.A.createDescription=function isc_FormSetValuesTaskEditor_createDescription(defaults){
        return"Set '"+defaults.componentId+"' values ";
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("FormClearValuesTaskEditor","ComponentTaskEditor");
isc.A=isc.FormClearValuesTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="FormClearValuesTask";
isc.B.push(isc.A.initWidget=function isc_FormClearValuesTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.createDescription=function isc_FormClearValuesTaskEditor_createDescription(defaults){
        return"Clear '"+defaults.componentId+"' values";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormResetValuesTaskEditor","ComponentTaskEditor");
isc.A=isc.FormResetValuesTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="FormResetValuesTask";
isc.B.push(isc.A.initWidget=function isc_FormResetValuesTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.createDescription=function isc_FormResetValuesTaskEditor_createDescription(defaults){
        return"Reset '"+defaults.componentId+"' values";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormValidateValuesTaskEditor","ComponentTaskEditor");
isc.A=isc.FormValidateValuesTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="FormValidateValuesTask";
isc.B.push(isc.A.initWidget=function isc_FormValidateValuesTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.createDescription=function isc_FormValidateValuesTaskEditor_createDescription(defaults){
        return"Validate '"+defaults.componentId+"' values";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("SetLabelTextTaskEditor","ComponentTaskEditor");
isc.A=isc.SetLabelTextTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="SetLabelTextTask";
isc.A.valueEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        fixedColWidths:true,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.valueFieldDefaults={
        name:"value",
        type:"DynamicValueItem",
        title:"Value",
        required:true,
        allowRuleScopeValues:true,
        fieldName:"value"
    };
isc.A.editedFields=["ID","description","componentId","value"];
isc.B.push(isc.A.initWidget=function isc_SetLabelTextTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor(true);
        this.addValueEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.addValueEditor=function isc_SetLabelTextTaskEditor_addValueEditor(){
        var fields=[isc.addProperties({},this.valueFieldDefaults,{targetRuleScope:this._targetRuleScope,_ruleScopeDataSources:this.getRuleScopeDataSources()})];
        this.addAutoChild("valueEditor",{fields:fields});
    }
,isc.A.setEditorValues=function isc_SetLabelTextTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        this.valueEditor.setValues(this.elementEditNodeDefaults);
    }
,isc.A.validate=function isc_SetLabelTextTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.valueEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_SetLabelTextTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            value=this.valueEditor.getValue("value")
        ;
        editedDefaults.value=value;
        return editedDefaults;
    }
,isc.A.createDescription=function isc_SetLabelTextTaskEditor_createDescription(defaults){
        return"Set '"+defaults.componentId+"' text";
    }
);
isc.B._maxIndex=isc.C+6;

isc.defineClass("SetButtonTitleTaskEditor","ComponentTaskEditor");
isc.A=isc.SetButtonTitleTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="SetButtonTitleTask";
isc.A.valueEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        fixedColWidths:true,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.valueFieldDefaults={
        name:"title",
        type:"DynamicValueItem",
        title:"Title",
        required:true,
        allowRuleScopeValues:true,
        fieldName:"value"
    };
isc.A.editedFields=["ID","description","componentId","value"];
isc.B.push(isc.A.initWidget=function isc_SetButtonTitleTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor(true);
        this.addValueEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.addValueEditor=function isc_SetButtonTitleTaskEditor_addValueEditor(){
        var fields=[isc.addProperties({},this.valueFieldDefaults,{targetRuleScope:this._targetRuleScope,_ruleScopeDataSources:this.getRuleScopeDataSources()})];
        this.addAutoChild("valueEditor",{fields:fields});
    }
,isc.A.setEditorValues=function isc_SetButtonTitleTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        this.valueEditor.setValues(this.elementEditNodeDefaults);
    }
,isc.A.validate=function isc_SetButtonTitleTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.valueEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_SetButtonTitleTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            title=this.valueEditor.getValue("title")
        ;
        editedDefaults.title=title;
        return editedDefaults;
    }
,isc.A.createDescription=function isc_SetButtonTitleTaskEditor_createDescription(defaults){
        return"Set '"+defaults.componentId+"' title";
    }
);
isc.B._maxIndex=isc.C+6;

isc.defineClass("ShowComponentTaskEditor","ComponentTaskEditor");
isc.A=isc.ShowComponentTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="ShowComponentTask";
isc.B.push(isc.A.initWidget=function isc_ShowComponentTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.createDescription=function isc_ShowComponentTaskEditor_createDescription(defaults){
        return"Show "+defaults.componentId;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("HideComponentTaskEditor","ComponentTaskEditor");
isc.A=isc.HideComponentTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="HideComponentTask";
isc.B.push(isc.A.initWidget=function isc_HideComponentTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.createDescription=function isc_HideComponentTaskEditor_createDescription(defaults){
        return"Hide "+defaults.componentId;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("ShowNotificationTaskEditor","ProcessElementEditor");
isc.A=isc.ShowNotificationTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=500;
isc.A.height=200;
isc.A.minWidth=500;
isc.A.minHeight=200;
isc.A.processElementType="ShowNotificationTask";
isc.A.editorTitle="Show Notification Task";
isc.A.messageEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        fixedColWidths:true,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.notifyTypePickerDefaults={
        name:"notifyType",
        type:"RadioGroupItem",
        title:"Notify Type",
        defaultValue:"message",
        vertical:false,
        valueMap:{
            "message":"Normal",
            "warn":"Warning",
            "error":"Error"
        },
        required:true
    };
isc.A.positionPickerDefaults={
        name:"position",
        type:"selectItem",
        title:"Screen Edge",
        defaultValue:"T",
        valueMap:{
            "L":"Left",
            "T":"Top",
            "R":"Right",
            "B":"Bottom"
        }
    };
isc.A.messageFieldDefaults={
        name:"message",
        type:"TextArea",
        title:"Message",
        width:"*",
        required:true
    };
isc.A.autoDismissFieldDefaults={
        name:"autoDismiss",
        type:"boolean",
        title:"Auto dismiss",
        labelAsTitle:true,
        defaultValue:true
    };
isc.A.editedFields=["ID","description","message","notifyType","position","autoDismiss"];
isc.A._notifyTypeDescriptionMap={
        "message":"",
        "warn":"warning",
        "error":"error"
    };
isc.B.push(isc.A.initWidget=function isc_ShowNotificationTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addMessageEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.addMessageEditor=function isc_ShowNotificationTaskEditor_addMessageEditor(){
        var fields=[
            isc.addProperties({},this.notifyTypePickerDefaults,this.notifyTypePickerProperties),
            isc.addProperties({},this.messageFieldDefaults,this.messageFieldProperties),
            isc.addProperties({},this.autoDismissFieldDefaults,this.autoDismissFieldProperties),
            isc.addProperties({},this.positionPickerDefaults,this.positionPickerProperties)
        ];
        this.addAutoChild("messageEditor",{fields:fields});
    }
,isc.A.setEditorValues=function isc_ShowNotificationTaskEditor_setEditorValues(){
        var values=this.elementEditNodeDefaults;
        this.idEditor.setValues(values);
        this.descriptionEditor.setValues(values);
        this.messageEditor.setValues(this.elementEditNodeDefaults);
    }
,isc.A.validate=function isc_ShowNotificationTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.messageEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_ShowNotificationTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            message=this.messageEditor.getValue("message"),
            notifyType=this.messageEditor.getValue("notifyType"),
            position=this.messageEditor.getValue("position"),
            autoDismiss=this.messageEditor.getValue("autoDismiss")
        ;
        editedDefaults.message=message;
        editedDefaults.notifyType=notifyType;
        editedDefaults.position=position;
        editedDefaults.autoDismiss=autoDismiss;
        return editedDefaults;
    }
,isc.A.createDescription=function isc_ShowNotificationTaskEditor_createDescription(defaults){
        var message=defaults.message||"",
            notifyType=defaults.notifyType||"message"
        ;
        return"Show "+this._notifyTypeDescriptionMap[notifyType]+" notification:<br>"+
            message;
    }
);
isc.B._maxIndex=isc.C+6;

isc.defineClass("ShowMessageTaskEditor","ProcessElementEditor");
isc.A=isc.ShowMessageTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=500;
isc.A.height=200;
isc.A.minWidth=500;
isc.A.minHeight=200;
isc.A.processElementType="ShowMessageTask";
isc.A.editorTitle="Show Message Task";
isc.A.messageEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        fixedColWidths:true,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.messageTypePickerDefaults={
        name:"type",
        type:"RadioGroupItem",
        title:"Message Type",
        defaultValue:"normal",
        vertical:false,
        valueMap:{
            "normal":"Normal",
            "warning":"Warning",
            "error":"Error"
        },
        required:true
    };
isc.A.messageFieldDefaults={
        name:"message",
        type:"TextArea",
        title:"Message",
        width:"*",
        required:true
    };
isc.A.editedFields=["ID","description","type","message"];
isc.A._typeDescriptionMap={
        "normal":"",
        "warning":"warning",
        "error":"error"
    };
isc.B.push(isc.A.initWidget=function isc_ShowMessageTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addMessageEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.addMessageEditor=function isc_ShowMessageTaskEditor_addMessageEditor(){
        var fields=[
            isc.addProperties({},this.messageTypePickerDefaults,this.messageTypePickerProperties,
                {changed:this.operationTypeChanged}),
            isc.addProperties({},this.messageFieldDefaults,this.messageFieldProperties)
        ];
        this.addAutoChild("messageEditor",{fields:fields});
    }
,isc.A.setEditorValues=function isc_ShowMessageTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        this.messageEditor.setValues(this.elementEditNodeDefaults);
    }
,isc.A.validate=function isc_ShowMessageTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.messageEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_ShowMessageTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            messageType=this.messageEditor.getValue("type"),
            message=this.messageEditor.getValue("message")
        ;
        editedDefaults.type=messageType;
        editedDefaults.message=message;
        return editedDefaults;
    }
,isc.A.createDescription=function isc_ShowMessageTaskEditor_createDescription(defaults){
        var message=defaults.message||"",
            type=defaults.type||"normal"
        ;
        return"Show "+this._typeDescriptionMap[type]+" notification:<br>"+message;
    }
);
isc.B._maxIndex=isc.C+6;

isc.defineClass("AskForValueTaskEditor","UserConfirmationGatewayEditor");
isc.A=isc.AskForValueTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="AskForValueTask";
isc.A.editorTitle="Ask For Value Task";
isc.A.hasDefaultValueFieldDefaults={
        name:"hasDefaultValue",
        type:"boolean",
        title:"Provide a default value of: ",
        defaultValue:false
    };
isc.A.defaultValueFieldDefaults={
        name:"defaultValue",
        type:"text",
        showTitle:false,
        width:"*",
        disabled:true
    };
isc.A.editedFields=["ID","description","message","nextElement","failureElement","defaultValue"];
isc.B.push(isc.A.addMessageEditor=function isc_AskForValueTaskEditor_addMessageEditor(){
        var fields=[
            isc.addProperties({},this.messageFieldDefaults),
            isc.addProperties({},this.hasDefaultValueFieldDefaults),
            isc.addProperties({},this.defaultValueFieldDefaults)
        ];
        this.addAutoChild("messageEditor",{fields:fields});
        var _this=this;
        this.observe(this,"valuesChanged",function(){
            if(_this.messageEditor.getValue("hasDefaultValue")){
                _this.messageEditor.getField("defaultValue").enable();
                _this.messageEditor.getField("defaultValue").setRequired(true);
            }else{
                _this.messageEditor.getField("defaultValue").disable();
                _this.messageEditor.getField("defaultValue").setRequired(false);
            }
        });
    }
,isc.A.getEditedElementDefaults=function isc_AskForValueTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            messageValues=this.messageEditor.getValues()
        ;
        editedDefaults.defaultValue=(messageValues.hasDefaultValue?messageValues.defaultValue:null);
        return editedDefaults;
    }
,isc.A.createDescription=function isc_AskForValueTaskEditor_createDescription(defaults){
        return"Ask user for value";
    }
);
isc.B._maxIndex=isc.C+3;

isc.defineClass("SetSectionTitleTaskEditor","ComponentTaskEditor");
isc.A=isc.SetSectionTitleTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="SetSectionTitleTask";
isc.A.sectionPickerFormatWithTitleValue="Section with title '${title}'";
isc.A.sectionPickerFormatWithNameValue="Section with name '${name}'";
isc.A.valuesEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        fixedColWidths:true,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.sectionPickerDefaults={
        name:"section",
        type:"SelectItem",
        title:"Section",
        required:true,
        valueField:"name",
        displayField:"title",
        pickListWidth:250,
        pickListFields:[
            {name:"name",autoFitWidth:true},
            {name:"title",width:"*",showHover:true}
        ],
        pickListProperties:{showHeader:false},
        formatValue:function(value,record,form,item){
            var selectedRecord=item.getSelectedRecord();
            if(selectedRecord!=null){
                var editor=form.creator,
                    valueFormat=editor.sectionPickerFormatWithNameValue
                ;
                if(selectedRecord.autoAssigned){
                    valueFormat=editor.sectionPickerFormatWithTitleValue;
                }
                var formattedValue=valueFormat.evalDynamicString(this,{
                    name:selectedRecord.name,
                    title:selectedRecord.title
                });
                return formattedValue;
            }else{
               return value;
            }
        }
    };
isc.A.valueFieldDefaults={
        name:"title",
        type:"DynamicValueItem",
        title:"Title",
        required:true,
        allowRuleScopeValues:true,
        fieldName:"title"
    };
isc.A.editedFields=["ID","description","componentId","title"];
isc.B.push(isc.A.initWidget=function isc_SetSectionTitleTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor(true);
        this.addValuesEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.addValuesEditor=function isc_SetSectionTitleTaskEditor_addValuesEditor(){
        var fields=[
            isc.addProperties({},this.sectionPickerDefaults,this.sectionPickerProperties,{
                getClientPickListData:function(){return this.form.sections;}
            }),
            isc.addProperties({},this.valueFieldDefaults,this.valueFieldProperties,{targetRuleScope:this._targetRuleScope,_ruleScopeDataSources:this.getRuleScopeDataSources()})
        ];
        this.addAutoChild("valuesEditor",{fields:fields,sections:this.getSections()});
    }
,isc.A.setEditorValues=function isc_SetSectionTitleTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        this.componentIdChanged();
        var values=this.elementEditNodeDefaults;
        this.valuesEditor.setValues(values);
        if(values.targetSectionName){
            this.valuesEditor.setValue("section",values.targetSectionName);
        }else{
            var title=values.targetSectionTitle,
                sections=this.getSections(),
                name
            ;
            for(var i=0;i<sections.length;i++){
                if(sections[i].title==title){
                    name=sections[i].name;
                    break;
                }
            }
            if(name)this.valuesEditor.setValue("section",name);
            else this.valuesEditor.clearValue("section");
        }
    }
,isc.A.validate=function isc_SetSectionTitleTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.valuesEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_SetSectionTitleTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            values=this.valuesEditor.getValues()
        ;
        editedDefaults.title=values.title;
        var sectionField=this.valuesEditor.getField("section"),
            sectionRecord=sectionField.getSelectedRecord()
        ;
        if(sectionRecord){
            editedDefaults.targetSectionName=(sectionRecord.autoAssigned?null:sectionRecord.name);
            editedDefaults.targetSectionTitle=(sectionRecord.autoAssigned?sectionRecord.title:null);
        }
        return editedDefaults;
    }
,isc.A.getSections=function isc_SetSectionTitleTaskEditor_getSections(){
        var componentId=this.componentIdEditor.getValue("componentId");
        if(!componentId)return[];
        var component=window[componentId];
        if(!component)return[];
        var sectionNames=component.getSectionNames(),
            sections=[]
        ;
        for(var i=0;i<sectionNames.length;i++){
            var config=component.getSectionConfig(sectionNames[i]);
            var autoAssignedName=(config.name==config.ID);
            if(!autoAssignedName){
                autoAssignedName=/^section\d+$/.test(config.name);
            }
            sections.add({
                name:config.name,
                title:config.title,
                autoAssigned:autoAssignedName
            });
        }
        return sections;
    }
,isc.A.componentIdChanged=function isc_SetSectionTitleTaskEditor_componentIdChanged(){
        this.valuesEditor.sections=this.getSections();
        this.valuesEditor.clearValue("section");
    }
,isc.A.createDescription=function isc_SetSectionTitleTaskEditor_createDescription(defaults){
        var section=defaults.targetSectionName||defaults.targetSectionTitle;
        return"Set '"+defaults.componentId+"' section '"+section+"' title";
    }
);
isc.B._maxIndex=isc.C+8;

isc.defineClass("ShowNextToComponentTaskEditor","ComponentTaskEditor");
isc.A=isc.ShowNextToComponentTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="ShowNextToComponentTask";
isc.A.nextToComponentPickerDefaults={
        name:"nextToComponentId",
        type:"ComboBoxItem",
        title:"Next To",
        required:true,
        valueField:"ID",
        displayField:"ID",
        pickListWidth:250,
        pickListFields:[
            {name:"ID",autoFitWidth:true,treeField:true},
            {name:"title",width:"*",showHover:true,formatCellValue:function(value,record,rowNum,colNum,grid){return value||record.className;}}
        ],
        pickListProperties:{showHeader:false},
        autoOpenTree:"all"
    };
isc.A.otherEditorDefaults={
        _constructor:"DynamicForm",
        wrapItemTitles:false,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.editedFields=["ID","description","componentId","nextToComponentId"];
isc.B.push(isc.A.initWidget=function isc_ShowNextToComponentTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor();
        var fields=[
            this.getFormFieldForAvailableComponents("nextToComponentPicker",this.availableComponents,"Canvas")
        ];
        this.addAutoChild("otherEditor",{fields:fields});
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.setEditorValues=function isc_ShowNextToComponentTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        this.otherEditor.setValues(this.elementEditNodeDefaults);
    }
,isc.A.validate=function isc_ShowNextToComponentTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.otherEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_ShowNextToComponentTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            values=this.otherEditor.getValues()
        ;
        editedDefaults.nextToComponentId=values.nextToComponentId;
        return editedDefaults;
    }
,isc.A.createDescription=function isc_ShowNextToComponentTaskEditor_createDescription(defaults){
        return"Show '"+defaults.componentId+"' next to '"+defaults.nextToComponentId+"'";
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("NavigateListPaneTaskEditor","ComponentTaskEditor");
isc.A=isc.NavigateListPaneTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="NavigateListPaneTask";
isc.A.valuesEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        fixedColWidths:true,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.valueFieldDefaults={
        name:"title",
        type:"DynamicValueItem",
        title:"Title",
        allowRuleScopeValues:true,
        fieldName:"title"
    };
isc.A.editedFields=["ID","description","componentId","title"];
isc.B.push(isc.A.initWidget=function isc_NavigateListPaneTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor(true);
        this.addValuesEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.addValuesEditor=function isc_NavigateListPaneTaskEditor_addValuesEditor(){
        var fields=[
            isc.addProperties({},this.valueFieldDefaults,this.valueFieldProperties,
                {targetRuleScope:this._targetRuleScope,_ruleScopeDataSources:this.getRuleScopeDataSources()})
        ];
        this.addAutoChild("valuesEditor",{fields:fields});
    }
,isc.A.setEditorValues=function isc_NavigateListPaneTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        this.componentIdChanged();
        var values=this.elementEditNodeDefaults;
        this.valuesEditor.setValues(values);
    }
,isc.A.validate=function isc_NavigateListPaneTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.valuesEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_NavigateListPaneTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            values=this.valuesEditor.getValues()
        ;
        editedDefaults.title=values.title;
        return editedDefaults;
    }
,isc.A.createDescription=function isc_NavigateListPaneTaskEditor_createDescription(defaults){
        var section=defaults.targetSectionName||defaults.targetSectionTitle;
        return"Navigate List Pane of '"+defaults.componentId+"'";
    }
);
isc.B._maxIndex=isc.C+6;

isc.defineClass("NavigateDetailPaneTaskEditor","ComponentTaskEditor");
isc.A=isc.NavigateDetailPaneTaskEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.processElementType="NavigateDetailPaneTask";
isc.A.valuesEditorDefaults={
        _constructor:isc.DynamicForm,
        wrapItemTitles:false,
        fixedColWidths:true,
        itemChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.valueFieldDefaults={
        name:"title",
        type:"DynamicValueItem",
        title:"Title",
        allowRuleScopeValues:true,
        fieldName:"title"
    };
isc.A.editedFields=["ID","description","componentId","title"];
isc.B.push(isc.A.initWidget=function isc_NavigateDetailPaneTaskEditor_initWidget(){
        this.Super("initWidget",arguments);
        this.addIdEditor();
        this.addComponentIdEditor(true);
        this.addValuesEditor();
        this.addDescriptionEditor();
        this.addEditButtons();
        this.setEditorValues();
    }
,isc.A.addValuesEditor=function isc_NavigateDetailPaneTaskEditor_addValuesEditor(){
        var fields=[
            isc.addProperties({},this.valueFieldDefaults,this.valueFieldProperties,
                {targetRuleScope:this._targetRuleScope,_ruleScopeDataSources:this.getRuleScopeDataSources()})
        ];
        this.addAutoChild("valuesEditor",{fields:fields});
    }
,isc.A.setEditorValues=function isc_NavigateDetailPaneTaskEditor_setEditorValues(){
        this.Super("setEditorValues",arguments);
        this.componentIdChanged();
        var values=this.elementEditNodeDefaults;
        this.valuesEditor.setValues(values);
    }
,isc.A.validate=function isc_NavigateDetailPaneTaskEditor_validate(){
        var valid=this.Super("validate",arguments)&&this.valuesEditor.validate();
        return valid;
    }
,isc.A.getEditedElementDefaults=function isc_NavigateDetailPaneTaskEditor_getEditedElementDefaults(){
        var editedDefaults=this.Super("getEditedElementDefaults",arguments),
            values=this.valuesEditor.getValues()
        ;
        editedDefaults.title=values.title;
        return editedDefaults;
    }
,isc.A.createDescription=function isc_NavigateDetailPaneTaskEditor_createDescription(defaults){
        var section=defaults.targetSectionName||defaults.targetSectionTitle;
        return"Navigate Detail Pane of '"+defaults.componentId+"'";
    }
);
isc.B._maxIndex=isc.C+6;

isc.defineClass("ProcessElementDescriptionItem","BlurbItem");
isc.A=isc.ProcessElementDescriptionItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.showTitle=true;
isc.A.icons=[{
        src:"[SKINIMG]actions/edit.png",
        prompt:"Enter a custom description",
        hspace:2,
        height:16,
        width:16,
        click:function(form,item,icon){
            item.editDescription();
        }
    }];
isc.A.valueDialogDefaults={
        _constructor:"ProcessElementValueDialog",
        height:185,
        width:600,
        title:"Custom Description"
    };
isc.A._autoGeneratedSuffix=" [auto-generated]";
isc.B.push(isc.A.editDescription=function isc_ProcessElementDescriptionItem_editDescription(){
        var item=this,
            originalValue=item.getValue(),
            defaultValue
        ;
        if(this.form.elementEditor.createDescription){
            var defaults=this.form.elementEditor.getEditedElementDefaults();
            defaultValue=this.form.elementEditor.createDescription(defaults);
        }
        var valueFieldProperties={
            type:"TextAreaItem",
            icons:[{
                src:"[SKINIMG]actions/refresh.png",
                prompt:"Reset to default description",
                click:"form.creator.resetToDefaultValue()"
             }]
        };
        var valueDialog=this.createAutoChild("valueDialog",{
            valueFieldProperties:valueFieldProperties,
            value:originalValue,
            callback:function(value){
                if(value!=originalValue){
                    item.setValue(value);
                    item._manualDescription=(value!=defaultValue);
                }
                this.markForDestroy();
            },
            resetToDefaultValue:function(){
                this.valueEditor.setValue("value",defaultValue);
            }
        });
        valueDialog.show();
    }
,isc.A.updateAutoDescription=function isc_ProcessElementDescriptionItem_updateAutoDescription(){
        if(!this._manualDescription&&this.form.elementEditor.createDescription){
            var defaults=this.form.elementEditor.getEditedElementDefaults();
            this.setValue(this.form.elementEditor.createDescription(defaults));
        }
    }
,isc.A.mapDisplayToValue=function isc_ProcessElementDescriptionItem_mapDisplayToValue(value){
        return value.replace(this._autoGeneratedSuffix,"");
    }
,isc.A.mapValueToDisplay=function isc_ProcessElementDescriptionItem_mapValueToDisplay(value){
        if(value!=null&&this.form.elementEditor.createDescription){
            var defaults=this.form.elementEditor.getEditedElementDefaults();
            var defaultValue=this.form.elementEditor.createDescription(defaults);
            if(value!=defaultValue){
                this._manualDescription=true;
            }else{
                value+=this._autoGeneratedSuffix;
                this._manualDescription=false;
            }
        }
        return value;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("BindingContainer","VLayout");
isc.A=isc.BindingContainer.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width="100%";
isc.A.height="100%";
isc.A.instructionsDefaults={
        _constructor:isc.HTMLFlow,
        width:"100%",
        padding:5
    };
isc.A.deckDefaults={
        _constructor:isc.Deck,
        width:"100%",
        height:"100%"
    };
isc.B.push(isc.A.initWidget=function isc_BindingContainer_initWidget(){
        this.Super("initWidget",arguments);
        this.addAutoChild("instructions");
        this.addAutoChild("deck");
        if(this.bindingPanes)this.setBindingPanes(this.bindingPanes);
    }
,isc.A.setBindingPanes=function isc_BindingContainer_setBindingPanes(bindingPanes){
        var panes=[],
            paneMap={},
            currentPane
        ;
        for(var i=0;i<bindingPanes.length;i++){
            var bindingPane=bindingPanes[i],
                name=bindingPane.name
            ;
            panes.add(bindingPane.pane);
            paneMap[name]=bindingPane;
            if(bindingPane.currentPane)currentPane=name;
        }
        this.paneMap=paneMap;
        this.deck.setPanes(panes);
        if(currentPane)this.setCurrentBindingPane(currentPane);
    }
,isc.A.setCurrentBindingPane=function isc_BindingContainer_setCurrentBindingPane(name){
        this.instructions.setContents(this.paneMap[name].instructions);
        this.deck.setCurrentPane(this.paneMap[name].pane);
    }
,isc.A.showPane=function isc_BindingContainer_showPane(show){
        if(show){
            this.instructions.show();
            this.deck.show();
        }else{
            this.instructions.hide();
            this.deck.hide();
        }
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("ProcessElementValueDialog","Window");
isc.A=isc.ProcessElementValueDialog.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=400;
isc.A.autoCenter=true;
isc.A.isModal=true;
isc.A.showModalMask=true;
isc.A.bodyProperties={layoutMargin:5,membersMargin:5};
isc.A.showMinimizeButton=false;
isc.A.showMaximizeButton=false;
isc.A.showCloseButton=false;
isc.A.contributeToRuleContext=false;
isc.A.valueEditorDefaults={
        _constructor:isc.DynamicForm,
        height:"*",
        wrapItemTitles:false,
        autoFocus:true
    };
isc.A.valueFieldDefaults={
        name:"value",
        title:"Value",
        required:true,
        width:"*",
        labelAsTitle:true
    };
isc.A.okButtonDefaults={
        _constructor:"IButton",
        autoParent:"editButtons",
        title:"OK",
        click:function(){
            this.parentElement.creator.saveEdits();
        }
    };
isc.A.cancelButtonDefaults={
        _constructor:"IButton",
        autoParent:"editButtons",
        title:"Cancel",
        click:function(){
            this.parentElement.creator.cancelEditing();
        }
    };
isc.A.editButtonsDefaults={
        _constructor:"HLayout",
        height:30,
        padding:2,
        align:"right",
        membersMargin:5
    };
isc.B.push(isc.A.init=function isc_ProcessElementValueDialog_init(){
        this.Super("init",arguments);
        var fields=[
            isc.addProperties({},this.valueFieldDefaults,this.valueFieldProperties)
        ];
        var values={};
        values.value=this.value||"";
        var editorProperties=isc.addProperties({},{fields:fields,values:values});
        if(this.dataSource)editorProperties.dataSource=this.dataSource;
        this.valueEditor=this.createAutoChild("valueEditor",editorProperties);
        var buttons=this.createAutoChild("editButtons",{layoutAlign:"right"});
        buttons.addMember(this.createAutoChild("cancelButton",{
            click:function(){
                this.creator.okClick();
            }
        }));
        buttons.addMember(this.createAutoChild("okButton",{
            click:function(){
                this.creator.okClick();
            }
        }));
        this.addItems([this.valueEditor,buttons]);
    }
,isc.A.cancelClick=function isc_ProcessElementValueDialog_cancelClick(){
        this.returnValue(this.value);
    }
,isc.A.okClick=function isc_ProcessElementValueDialog_okClick(){
        this.returnValue(this.valueEditor.getValue("value"));
    }
);
isc.B._maxIndex=isc.C+3;

isc.defineClass("BindingValuesPane","HLayout");
isc.A=isc.BindingValuesPane.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width="100%";
isc.A.height="100%";
isc.A.scopeTreeDefaults={
        _constructor:"TreeGrid",
        width:"40%",
        defaultFields:[
            {name:"title",title:"Task Scope"}
        ],
        selectionType:"single",
        canDragRecordsOut:true,
        dragDataAction:"copy",
        draw:function(){
            this.Super("draw",arguments);
            var nodes=this.data.getChildren(this.data.getRoot());
            this.data.openFolders(nodes);
        },
        recordDoubleClick:function(viewer,record,recordNum,field,fieldNum,value,rawValue){
            if(record.isFolder)this.bindRecord(record);
        },
        bindRecord:function(record){
            this.creator.bindingGrid.bindRecord(record);
        }
    };
isc.A.addToBindingDefaults={
        _constructor:isc.Img,
        src:"[SKINIMG]actions/next.png",
        width:32,height:32,
        imageType:"normal",
        imageWidth:16,imageHeight:16,
        padding:8,
        layoutAlign:"center",
        disabled:true,
        showDisabled:false,
        click:function(){
            var scopeTree=this.creator.scopeTree,
                record=scopeTree.getSelectedRecord()
            ;
            var bindingGrid=this.creator.bindingGrid,
                targetRecord=bindingGrid.getSelectedRecord()
            ;
            bindingGrid.bind(record,targetRecord);
        }
    };
isc.A.bindingGridDefaults={
        _constructor:"ListGrid",
        width:"*",
        defaultFields:[
            {name:"name",title:"Name",width:125,
                formatCellValue(value,record,rowNum,colNum,grid){
                    return value+(record.title?" ("+record.title+")":"");
                }
            },
            {name:"type",title:"Type",width:75},
            {name:"binding",title:"Binding",width:"*",
                showHover:true,
                hoverHTML:function(record,value,rowNum,colNum,grid){
                    return grid.bindingValuePrompt;
                },
                valueIconOrientation:"right",
                valueIconClick:function(viewer,record,recordNum,field,rawValue,editor){
                    var defaultValue=(record.fixedValue?rawValue:null);
                    viewer.editFixedValue(viewer.targetDataSource,record.name,defaultValue,function(newValue){
                        if(newValue!=defaultValue){
                            record.binding=newValue;
                            record.fixedValue=true;
                            viewer.refreshRow(recordNum);
                        }
                    });
                },
                formatCellValue(value,record,rowNum,colNum,grid){
                    if(!value)return"";
                    if(isc.isA.String(value)){
                        if(value.startsWith("$ruleScope")||value.startsWith("$scope")){
                            return value.replace("$ruleScope.","").replace("$scope.","");
                        }else if(value.startsWith("$last")){
                            return value.replace("$last","lastTaskResult");
                        }
                    }
                    var ds=isc.DS.get(grid.targetDataSource),
                        field=ds.getField(record.name),
                        formatRecord={}
                    ;
                    formatRecord[record.name]=value;
                    return grid.applyCellTypeFormatters(value,formatRecord,field,rowNum,colNum,false);
                }
            }
        ],
        getValueIcon:function(field,value,record){
            return(field.name=="binding"?"[SKINIMG]actions/edit.png":null);
        },
        canAcceptDroppedRecords:true,
        willAcceptDrop:function(){
            var accept=this.Super("willAcceptDrop",arguments);
            if(accept){
                var dragData=this.ns.EH.dragTarget.getDragData(),
                    dragRecord=dragData[0]
                ;
                if(dragRecord.isFolder){
                    this.selectAllRecords();
                }else{
                    var rowNum=this.getEventRecordNum();
                    this.selectSingleRecord(rowNum);
                }
            }
            return accept;
        },
        dropOver:function(){
            this.saveSelection();
        },
        dropOut:function(){
            this.restoreSelection();
        },
        recordDrop:function(dropRecords,targetRecord,index,sourceWidget){
            this.restoreSelection();
            if(dropRecords&&dropRecords.length>0&&targetRecord){
                this.bind(dropRecords[0],targetRecord);
            }
        },
        saveSelection:function(){
            this._preDropSelectedRecords=this.getSelectedRecords();
        },
        restoreSelection:function(){
            this.deselectAllRecords();
            this.selectRecords(this._preDropSelectedRecords);
        },
        contextMenu:{
            data:[
                {title:"Clear binding",
                    click:"target.clearBinding();"
                }
            ]
        },
        bind:function(record,targetRecord){
            if(record.isFolder){
                this.bindRecord(record);
            }else{
                this.bindField(record,targetRecord);
            }
        },
        bindRecord:function(record){
            var data=this.data,
                hasBindings=false
            ;
            for(var i=0;i<data.length;i++){
                if(data[i].binding!=null){
                    hasBindings=true;
                    break;
                }
            }
            var grid=this;
            var applyBindings=function(clearExisting){
                if(clearExisting){
                    for(var i=0;i<data.length;i++){
                        if(data[i].binding!=null){
                            data[i].binding=null;
                            data[i].fixedValue=null;
                            grid.refreshRow(i);
                        }
                    }
                }
                var fields=record.children;
                grid.bindRecordFields(fields);
            };
            if(hasBindings){
                isc.ask(this.creator.overwriteBindingsMessage,function(result){
                   applyBindings(result);
                });
            }else{
                applyBindings(false);
            }
        },
        bindRecordFields:function(fieldRecords){
            var data=this.data,
                changed=false
            ;
            for(var i=0;i<fieldRecords.length;i++){
                var fieldRecord=fieldRecords[i],
                    fieldName=fieldRecord.name
                ;
                var ldi=fieldName.lastIndexOf(".");
                if(ldi>0){
                    fieldName=fieldName.substring(ldi+1);
                }
                var rowNum=data.findIndex("name",fieldName);
                if(rowNum>=0){
                    var targetRecord=this.getRecord(rowNum);
                    if(fieldRecord.criteriaPath||fieldRecord.name.contains(".")){
                        targetRecord.binding="$ruleScope."+(fieldRecord.criteriaPath||fieldRecord.name);
                    }else{
                        targetRecord.binding="$last."+fieldRecord.name;
                    }
                    targetRecord.fixedValue=null;
                    this.refreshRow(rowNum);
                    changed=true;
                }
            }
            if(changed)this.fireValuesChanged();
        },
        bindField:function(sourceRecord,targetRecord){
            if(sourceRecord.criteriaPath||sourceRecord.name.contains(".")){
                targetRecord.binding="$ruleScope."+(sourceRecord.criteriaPath||sourceRecord.name);
                this.refreshRow(this.getRecordIndex(targetRecord));
            }else{
                targetRecord.binding="$last."+sourceRecord.name;
            }
            this.fireValuesChanged();
        },
        clearBinding:function(){
            var record=this.getSelectedRecord();
            if(record){
                if(record.binding!=null){
                    record.binding=null;
                    record.fixedValue=null;
                    this.refreshRow(this.getRecordIndex(record));
                    this.fireValuesChanged();
                }
            }
        },
        fireValuesChanged:function(){
            if(this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        },
        editorWindowDefaults:{
            _constructor:"Window",
            width:400,
            autoCenter:true,
            isModal:true,showModalMask:true,
            bodyProperties:{layoutMargin:5,membersMargin:5},
            showMinimizeButton:false,
            showMaximizeButton:false,
            showCloseButton:false,
            contributeToRuleContext:false
        },
        valueEditorDefaults:{
            _constructor:isc.DynamicForm,
            height:"*",
            wrapItemTitles:false,
            autoFocus:true
        },
        valueFieldDefaults:{
            title:"Value",
            required:true,
            width:"*",
            labelAsTitle:true
        },
        okButtonDefaults:{
            _constructor:"IButton",
            autoParent:"editButtons",
            title:"OK",
            click:function(){
                this.parentElement.creator.saveEdits();
            }
        },
        cancelButtonDefaults:{
            _constructor:"IButton",
            autoParent:"editButtons",
            title:"Cancel",
            click:function(){
                this.parentElement.creator.cancelEditing();
            }
        },
        editButtonsDefaults:{
            _constructor:"HLayout",
            height:30,
            padding:2,
            align:"right",
            membersMargin:5
        },
        editFixedValue:function(dataSource,fieldName,defaultValue,callback){
            var editorWindow=this.createAutoChild("editorWindow",{
                closeClick:function(){this.close();callback(defaultValue);}
            });
            var title=this.fixedValueWindowTitle.evalDynamicString(this,{
                fieldName:fieldName
            });
            editorWindow.setTitle(title);
            var fields=[
                isc.addProperties({},this.valueFieldDefaults,{name:fieldName})
            ];
            var values={};
            values[fieldName]=defaultValue;
            var editor=this.createAutoChild("valueEditor",{dataSource:dataSource,fields:fields,values:values});
            var buttons=this.createAutoChild("editButtons",{layoutAlign:"right"});
            buttons.addMember(this.createAutoChild("cancelButton",{
                click:function(){
                    editorWindow.close();
                    callback(defaultValue);
                }
            }));
            buttons.addMember(this.createAutoChild("okButton",{
                click:function(){
                    var value=editor.getValue(fieldName);
                    editorWindow.close();
                    callback(value);
                }
            }));
            editorWindow.addItems([editor,buttons]);
            editorWindow.show();
        }
    };
isc.B.push(isc.A.initWidget=function isc_BindingValuesPane_initWidget(){
        this.Super("initWidget",arguments);
        var editor=this;
        var scopeTreeProperties={data:this.scopeTreeData,selectionUpdated:function(){editor.updateAddToBindingState()}};
        if(this.showBindings==false){
            isc.addProperties(scopeTreeProperties,{
                width:"100%",
                selectionUpdated:function(){
                    if(editor.valuesChanged){
                        editor.valuesChanged();
                    }
                }
            });
        }
        this.addAutoChild("scopeTree",scopeTreeProperties);
        if(this.showBindings!=false){
            this.addAutoChild("addToBinding");
            this.addAutoChild("bindingGrid",{
                bindingValuePrompt:this.bindingValuePrompt,
                fixedValueWindowTitle:this.fixedValueWindowTitle,
                overwriteBindingsMessage:this.overwriteBindingsMessage,
                selectionUpdated:function(){editor.updateAddToBindingState()}
            });
        }
        if(this.dataSource)this.setDataSource(this.dataSource);
        if(this.values)this.setValues(this.values);
    }
,isc.A.setDataSource=function isc_BindingValuesPane_setDataSource(dataSource){
        this.dataSource=dataSource;
        if(this.bindingGrid){
            this.bindingGrid.targetDataSource=dataSource;
            this.updateBindingFields();
        }
    }
,isc.A.setValues=function isc_BindingValuesPane_setValues(values){
        this.values=values;
        if(this.showBindings!=false){
            this.showElementBindingValues(values);
        }else{
            var scopeTree=this.scopeTree,
                data=scopeTree.data,
                ds=isc.DS.get(this.dataSource),
                pkFieldName=(ds?ds.getPrimaryKeyFieldName():null),
                pkValue=(pkFieldName?values[pkFieldName]:null)
            ;
            if(pkValue&&(pkValue.startsWith("$ruleScope.")||pkValue.startsWith("$scope."))){
                pkValue=pkValue.replace("$ruleScope.","").replace("$scope.","");
            }
            var record=(pkFieldName?data.find("name",pkValue):null);
            if(record){
                scopeTree.selectSingleRecord(record);
                var path=data.getParentPath(record);
                data.openFolders([path]);
                isc.Timer.setTimeout(function(){
                    var rowNum=scopeTree.getRecordIndex(record);
                    scopeTree.scrollToRow(rowNum);
                });
            }else{
                this.scopeTree.deselectAllRecords();
            }
        }
    }
,isc.A.getValues=function isc_BindingValuesPane_getValues(){
        var values;
        if(this.showBindings!=false){
            var grid=this.bindingGrid,
                data=grid.data
            ;
            for(var i=0;i<data.length;i++){
                if(data[i].binding!=null){
                    if(!values)values={};
                    values[data[i].name]=data[i].binding;
                }
            }
        }else{
            var tree=this.scopeTree,
                selectedRecord=tree.getSelectedRecord(),
                ds=isc.DS.get(this.dataSource)
            ;
            if(ds){
                var pkFieldName=ds.getPrimaryKeyFieldName();
                if(selectedRecord){
                    values={};
                    values[pkFieldName]="$ruleScope."+selectedRecord.name;
                }
            }
        }
        return values;
    }
,isc.A.updateBindingFields=function isc_BindingValuesPane_updateBindingFields(){
        var data=[],
            dataSourceName=this.dataSource,
            ds=isc.DS.get(dataSourceName)
        ;
        if(ds){
            var pkFieldName=ds.getPrimaryKeyFieldName();
            var fieldNames=ds.getFieldNames();
            for(var i=0;i<fieldNames.length;i++){
                var fieldName=fieldNames[i],
                    field=ds.getField(fieldName)
                ;
                if(pkFieldName&&!this.includeSequencePK&&field.name==pkFieldName&&field.type=="sequence"){
                    continue;
                }
                data[data.length]={name:fieldName,title:field.title,type:field.type};
            }
        }
        this.bindingGrid.setData(data);
    }
,isc.A.showElementBindingValues=function isc_BindingValuesPane_showElementBindingValues(values){
        if(!this.bindingGrid)return;
        var grid=this.bindingGrid,
            data=grid.data
        ;
        for(var key in values){
            var targetRecord=data.find("name",key);
            if(targetRecord){
                targetRecord.binding=values[key];
                if(isc.isA.String(values[key])&&!values[key].startsWith("$")){
                    targetRecord.fixedValue=true;
                }
            }
        }
    }
,isc.A.updateAddToBindingState=function isc_BindingValuesPane_updateAddToBindingState(){
        if(this.addToBinding){
            this.addToBinding.setDisabled(!this.scopeTree.anySelected()||!this.bindingGrid.anySelected());
        }
    }
);
isc.B._maxIndex=isc.C+7;

isc.defineClass("BindingCriteriaPane","VLayout");
isc.A=isc.BindingCriteriaPane.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width="100%";
isc.A.height="100%";
isc.A.filterBuilderDefaults={
        _constructor:"FilterBuilder",
        height:"*",
        border:"1px solid gray",
        showModeSwitcher:true,
        initWidget:function(){
            this._skipFilterChanged=true;
            this.Super("initWidget",arguments);
            this._skipFilterChanged=false;
        },
        draw:function(){
            this._skipFilterChanged=true;
            this.Super("draw",arguments);
            this._skipFilterChanged=false;
        },
        filterChanged:function(){
            if(!this._skipFilterChanged&&this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.B.push(isc.A.initWidget=function isc_BindingCriteriaPane_initWidget(){
        this.Super("initWidget",arguments);
        var filterBuilderProperties={
            targetRuleScope:this.ruleScope,
            allowRuleScopeValues:true,
            _ruleScopeDataSources:this.criteriaDataSources
        };
        this.addAutoChild("filterBuilder",filterBuilderProperties);
        if(this.dataSource)this.setDataSource(this.dataSource);
    }
,isc.A.setDataSource=function isc_BindingCriteriaPane_setDataSource(dataSource){
        if(this.filterBuilder.dataSource!=dataSource){
            this.filterBuilder.setDataSource(dataSource);
        }
    }
,isc.A.setCriteria=function isc_BindingCriteriaPane_setCriteria(criteria){
        this.criteria=criteria;
        this.filterBuilder.setCriteria(criteria);
    }
,isc.A.getCriteria=function isc_BindingCriteriaPane_getCriteria(){
        return this.filterBuilder.getCriteria();
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("TaskDecisionEditor","VStack");
isc.A=isc.TaskDecisionEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.height=100;
isc.A.padding=5;
isc.A.criteriaNotCompleteMessage="Criteria is not complete";
isc.A.criteriaMissingMessage="Target is selected but no criteria is defined";
isc.A.targetTaskPickerDefaults={
        name:"targetTask",
        type:"SelectItem",
        title:"If criteria match, next task",
        width:300,
        allowEmptyValue:true,
        defaultValue:isc.Process.gatewayPlaceholderSelection,
        changed:function(form,item,value){
            var itemEditor=form.creator;
            itemEditor.creator.handleTitleChanged(itemEditor,value);
        }
    };
isc.A.targetEditorLayoutDefaults={
        _constructor:"HLayout",
        height:1,
        align:"center"
    };
isc.A.targetEditorDefaults={
        _constructor:"DynamicForm",
        autoParent:"targetEditorLayout",
        wrapItemTitles:false
    };
isc.A.filterBuilderDefaults={
        _constructor:"FilterBuilder",
        showModeSwitcher:true,
        initWidget:function(){
            this._skipFilterChanged=true;
            this.Super("initWidget",arguments);
            this._skipFilterChanged=false;
        },
        draw:function(){
            this._skipFilterChanged=true;
            this.Super("draw",arguments);
            this._skipFilterChanged=false;
        },
        filterChanged:function(){
            if(!this._skipFilterChanged&&this.creator.valuesChanged){
                this.creator.valuesChanged();
            }
        }
    };
isc.A.criteriaErrorDefaults={
        _constructor:isc.HTMLFlow,
        width:"100%",
        visibility:"hidden"
    };
isc.B.push(isc.A.initWidget=function isc_TaskDecisionEditor_initWidget(){
        this.Super("initWidget",arguments);
        var fields=[
            isc.addProperties({},this.targetTaskPickerDefaults,this.targetTaskPickerProperties,
                    {valueMap:this.targetableElementsValueMap})
        ];
        this.addAutoChild("targetEditorLayout");
        this.addAutoChild("targetEditor",{fields:fields});
        this.addAutoChild("criteriaError");
        var filterBuilderProperties={
            targetRuleScope:this.targetRuleScope,
            allowRuleScopeValues:true,
            createRuleCriteria:true,
            targetComponent:{ID:"_none_"},
            _ruleScopeDataSources:this._ruleScopeDataSources
        };
        this.addAutoChild("filterBuilder",filterBuilderProperties);
        if(this.taskDecision)this.setValue(this.taskDecision);
    }
,isc.A.getValue=function isc_TaskDecisionEditor_getValue(){
        var targetTask=this.targetEditor.getValue("targetTask"),
            criteria=this.filterBuilder.getCriteria()
        ;
        if(!criteria.criteria||criteria.criteria.isEmpty())criteria=null;
        return(targetTask&&criteria?{targetTask:targetTask,criteria:criteria}:null);
    }
,isc.A.setValue=function isc_TaskDecisionEditor_setValue(value){
        this.targetEditor.setValues(value);
        if(value.criteria){
            this.filterBuilder.setCriteria(value.criteria);
        }else this.filterBuilder.clearCriteria();
    }
,isc.A.validate=function isc_TaskDecisionEditor_validate(){
        var valid=this.targetEditor.validate()&&this.filterBuilder.validate(),
            message=null
        ;
        if(valid){
            var criteria=this.filterBuilder.getCriteria(),
                criteriaIsEmpty=(!criteria.criteria||criteria.criteria.isEmpty()),
                isPartialCriteria=criteriaIsEmpty&&!this.filterBuilder.getCriteria(true).criteria.isEmpty(),
                targetTaskIsEmpty=(this.targetEditor.getValue("targetTask")==null||this.targetEditor.getValue("targetTask")=="")
            ;
            if(isPartialCriteria){
                valid=false;
                message=this.criteriaNotCompleteMessage;
            }else if(criteriaIsEmpty&&!targetTaskIsEmpty){
                valid=false;
                message=this.criteriaMissingMessage;
            }else if(!criteriaIsEmpty&&targetTaskIsEmpty){
                this.targetEditor.setError("targetTask",isc.Validator.requiredField);
                this.targetEditor.markForRedraw();
                valid=false;
            }
        }
        if(!valid&&message){
            var templateField=this.targetEditor.getField("targetTask");
            var iconHTML=isc.Canvas.imgHTML(templateField.errorIconSrc,
                               templateField.errorIconWidth,templateField.errorIconHeight);
            this.criteriaError.setContents(iconHTML+"&nbsp;"+message);
            this.criteriaError.show();
        }else{
            this.criteriaError.hide();
        }
        return valid;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("DynamicValueItem","CanvasItem");
isc.A=isc.DynamicValueItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width="*";
isc.A.rowSpan="*";
isc.A.multiDSFieldFormat="separated";
isc.A.dynamicValuePrefix="Dynamic: ";
isc.A.dynamicValueButtonPrompt="Select dynamic value";
isc.A.dynamicValueWindowTitle="Choose dynamic value for field ${fieldTitle}";
isc.A.shouldSaveValue=true;
isc.A.valueEditorDefaults={
        _constructor:isc.DynamicForm,
        cellPadding:0,
        numCols:1,
        itemChanged:function(){
            this.creator.itemChanged();
        }
    };
isc.A.valueFieldDefaults={
        required:true,
        showTitle:false,
        labelAsTitle:true,
        useTextField:true,
        width:"*"
    };
isc.A.valuePathDefaults={
        name:"valuePath",
        type:"staticText",
        showTitle:false,
        height:isc.TextItem.getInstanceProperty("height"),
        wrap:false,
        clipValue:true,
        visible:false,
        valueSuffix:"</nobr>",
        formatValue:function(value,record,form,item){
            if(form.creator&&form.creator.creator&&form.creator.creator.targetComponent){
                var localValuePrefix=form.creator.creator.targetComponent.ID+".values.";
                if(value!=null&&value.startsWith(localValuePrefix))value=value.replace(localValuePrefix,"");
            }
            return(value!=null?this.valuePrefix+value+this.valueSuffix:null);
        }
    };
isc.A.dynamicValueIconDefaults={
        icons:[{
            src:"[SKINIMG]actions/dynamic.png",
            prompt:this.dynamicValueButtonPrompt,
            hspace:2,
            height:16,
            width:16,
            click:function(form,item,icon){
                form.creator.dynamicValueClick();
            }
        }]
    };
isc.A.dynamicValueWindowConstructor="DynamicValuePicker";
isc.A.dynamicValueWindowDefaults={
        okButtonClick:function(value){
            this.creator.dynamicValueSelected(value);
            this.destroy();
        },
        closeClick:function(){
            var result=this.Super("closeClick",arguments);
            this.destroy();
            return result;
        }
    };
isc.B.push(isc.A.setField=function isc_DynamicValueItem_setField(name,title){
        if(this.fieldName!=name){
            this.fieldName=name;
            this.fieldTitle=title;
            this.updateCanvas();
        }
    }
,isc.A.updateCanvas=function isc_DynamicValueItem_updateCanvas(value){
        var valueFieldProperties={name:this.fieldName},
            valuePathProperties={valuePrefix:"<nobr>"+this.dynamicValuePrefix}
        ;
        if(this.allowRuleScopeValues){
            isc.addProperties(valueFieldProperties,this.dynamicValueIconDefaults,{targetRuleScope:this.targetRuleScope});
            isc.addProperties(valuePathProperties,this.dynamicValueIconDefaults);
        }
        var fields=[
            isc.addProperties({},this.valueFieldDefaults,valueFieldProperties)
        ];
        if(this.allowRuleScopeValues){
            fields.add(isc.addProperties({},this.valuePathDefaults,valuePathProperties));
        }
        var values={};
        if(this.allowRuleScopeValues&&value&&isc.isA.String(value)&&(value.startsWith("$ruleScope")||value.startsWith("$scope"))){
            value=value.replace("$ruleScope.","").replace("$scope.","");
            values.valuePath=value;
            fields[0].visible=false;
            fields[1].visible=true;
        }else{
            values[this.fieldName]=value;
            fields[0].visible=true;
            if(this.allowRuleScopeValues)fields[1].visible=false;
        }
        var editor=this.createAutoChild("valueEditor",{dataSource:this.dataSource,fields:fields,values:values});
        this.setCanvas(editor);
    }
,isc.A.showValue=function isc_DynamicValueItem_showValue(displayValue,dataValue){
        if(this.canvas){
            this.updateCanvas(dataValue);
        }
    }
,isc.A.itemChanged=function isc_DynamicValueItem_itemChanged(){
        var value=this.canvas.getValue(this.fieldName);
        var valuePathField=this.canvas.getField("valuePath");
        if(valuePathField.isVisible()){
            value="$ruleScope."+this.canvas.getValue("valuePath");
        }
        this.storeValue(value);
    }
,isc.A.dynamicValueSelected=function isc_DynamicValueItem_dynamicValueSelected(value){
        this.updateCanvas(value!=null?"$ruleScope."+value:null);
        this.itemChanged();
    }
,isc.A.dynamicValueClick=function isc_DynamicValueItem_dynamicValueClick(){
        var selectedValue=this.canvas.getValue("valuePath");
        var window=this.createDynamicValuePicker(selectedValue);
        window.show();
    }
,isc.A.createDynamicValuePicker=function isc_DynamicValueItem_createDynamicValuePicker(selectedValue){
        var window=this.createAutoChild("dynamicValueWindow",{
            title:this.dynamicValueWindowTitle.evalDynamicString(this,{fieldTitle:this.fieldTitle}),
            ruleScopeDataSources:this._ruleScopeDataSources,
            targetRuleScope:this.targetRuleScope,
            targetComponent:this.targetComponent,
            multiDSFieldFormat:this.multiDSFieldFormat,
            selectedValue:selectedValue
        });
        return window;
    }
);
isc.B._maxIndex=isc.C+7;

isc.defineClass("DynamicValuePicker","Window");
isc.A=isc.DynamicValuePicker.getPrototype();
isc.A.autoSize=true;
isc.A.width=600;
isc.A.autoCenter=true;
isc.A.isModal=true;
isc.A.bodyProperties={layoutMargin:5,membersMargin:5};
isc.A.multiDSFieldFormat="separated";
isc.A.clearValueText="&lt;Use static value instead&gt;"
;

isc.A=isc.DynamicValuePicker.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.ruleScopeGridConstructor=isc.ListGrid;
isc.A.ruleScopeGridDefaults={
        height:400,
        width:"100%",
        autoFetchData:true,
        dataFetchMode:"local",
        selectionType:"single",
        initWidget:function(){
            this.fields=[
                {name:"name",type:"text",title:"Path",hidden:(this.pathField!="name")},
                {name:"title",type:"text",title:"Path",hidden:(this.pathField!="title")},
                {name:"value",type:"text",title:"Current value",hidden:true}
            ];
            this.Super("initWidget",arguments);
        },
        formatCellValue:function(value,record,rowNum,colNum){
            if(value==null&&colNum==0)return this.clearValueText;
            return(record.enabled==false||this.multiDSFieldFormat=="qualified"?value:"&nbsp;&nbsp;"+value);
        },
        recordDoubleClick:function(){
            this.creator.handleOkButtonClick();
        }
    };
isc.B.push(isc.A.initWidget=function isc_DynamicValuePicker_initWidget(){
        this.Super("initWidget",arguments);
        var ds=isc.Canvas.getMultiDSFieldDataSource(this.targetRuleScope,this.ruleScopeDataSources,this.targetComponent,null,this.multiDSFieldFormat);
        if(this.selectedValue!=null){
            ds.testData.addAt({name:null},0);
        }
        var pathField=(this.multiDSFieldFormat=="separated"?"title":"name");
        var _this=this,
            ruleScopeGrid=this.createAutoChild("ruleScopeGrid",{dataSource:ds,pathField:pathField,clearValueText:this.clearValueText}),
            okButton=isc.IButton.create({
                title:"OK",
                click:function(){
                    _this.handleOkButtonClick();
                }
            }),
            cancelButton=isc.IButton.create({
                title:"Cancel",
                click:function(){
                    _this.handleCloseClick();
                }
            })
        ;
        this.addItems([ruleScopeGrid,isc.HLayout.create({height:1,layoutAlign:"right",membersMargin:5,members:[cancelButton,okButton]})]);
        this.observe(ruleScopeGrid,"dataArrived","observer._selectDynamicValuePath()");
        this.ruleScopeGrid=ruleScopeGrid;
        this.ruleScopeDS=ds;
    }
,isc.A.handleOkButtonClick=function isc_DynamicValuePicker_handleOkButtonClick(){
        var record=this.ruleScopeGrid.getSelectedRecord();
        if(record&&this.okButtonClick){
            this.close();
            this.okButtonClick(record.criteriaPath||record.name);
        }else{
            this.closeClick();
        }
    }
,isc.A.destroy=function isc_DynamicValuePicker_destroy(){
        if(this.ruleScopeDS){
            this.ruleScopeDS.destroy();
        }
        this.Super("destroy",arguments);
    }
,isc.A._selectDynamicValuePath=function isc_DynamicValuePicker__selectDynamicValuePath(){
        if(!this.selectedValue)return;
        var grid=this.ruleScopeGrid,
            data=this.ruleScopeGrid.data,
            path=this.selectedValue
        ;
        if(data){
            var record=grid.data.find("name",path);
            if(!record)record=grid.data.find("criteriaPath",path);
            if(record)grid.selectSingleRecord(record);
            this.selectedValuePath=null;
        }
    }
);
isc.B._maxIndex=isc.C+4;
isc._debugModules = (isc._debugModules != null ? isc._debugModules : []);isc._debugModules.push('Workflow');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._Workflow_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('Workflow module init time: ' + (isc._moduleEnd-isc._moduleStart) + 'ms','loadTime');delete isc.definingFramework;if (isc.Page) isc.Page.handleEvent(null, "moduleLoaded", { moduleName: 'Workflow', loadTime: (isc._moduleEnd-isc._moduleStart)});}else{if(window.isc && isc.Log && isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'Workflow'.");}
/*

  SmartClient Ajax RIA system
  Version SNAPSHOT_v12.1d_2019-05-29/LGPL Deployment (2019-05-29)

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

