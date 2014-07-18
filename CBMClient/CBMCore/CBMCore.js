// ======================= Some common Functions ==========================

function loadScript(script) {
    document.writeLn('<' + 'script src="' + script + '"><' + '/script>');
};

var parseJSON = function (data) {
    return window.JSON && window.JSON.parse ? window.JSON.parse(data) : (new Function("return " + data))();
};

// --- Useful to clone: Object, Array, Date, String, Number, or Boolean. 

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}


/*!Math.uuid.js (v1.4)http://www.broofa.commailto:robert@broofa.com Copyright (c) 2009 Robert Kieffer
 * Dual licensed under the MIT and GPL licenses.*/
/* * Generate a random uuid. 
 * * * USAGE: Math.uuid(length, radix) 
 * *   length - the desired number of characters 
 * *   radix  - the number of allowable values for each character. 
 * * * EXAMPLES: *   
 * // No arguments  - returns RFC4122, version 4 ID *   >>> Math.uuid() *   "92329D39-6F5C-4520-ABFC-AAB64544E172" *  *   
 * // One argument - returns ID of the specified length *   >>> Math.uuid(15)     
 * // 15 character ID (default base=62) *   "VcydxgltxrVZSTV" * *   
 * // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62) *   >>> Math.uuid(8, 2)  
 * // 8 character ID (base=2) *   "01001010" *   >>> Math.uuid(8, 10) 
 * // 8 character ID (base=10) *   "47473046" *   >>> Math.uuid(8, 16) // 8 character ID (base=16) *   "098F4D35" */

Math.uuid = (function () {
    // Private array of chars to use  
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    return function (len, radix) {
        var chars = CHARS,
            uuid = [];
        radix = radix || chars.length;
        if (len) { // Compact form      
            for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else { // rfc4122, version 4 form      
            var r;
            // rfc4122 requires these characters      
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            // Fill in random data.  At i==19 set the high bits of clock sequence as      
            // per rfc4122, sec. 4.1.5      
            for (var i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    };
})();


// ========= CBM Technology and Domain Model Classes (DataSources)  ===========

// ================== Some helper classes and Functions ===================

var SendCommand = function (command, httpMethod, params, callback) {
    isc.RPCManager.sendRequest({
        // --- Common part ---
        data: null,
        useSimpleHttp: true,
        contentType: "application/json",
        transport: "xmlHttpRequest",
        // --- Initialized part ---
        actionURL: "http://127.0.0.1:8182/" + command, // TODO Turn to Configurable here" 
        httpMethod: httpMethod,
        params: params,
        callback: callback
    });
};

// ------ Identifier (surrogate keys) provider ---------------------------
isc.ClassFactory.defineClass("IDProvider", isc.Class);
isc.IDProvider.addClassProperties({
    pools: [{curr: 1, last: 0}, {curr: 1, last: 1}],
	wrkPool: 0,
	size: 4,

	updatePool: function(){
		SendCommand("IDProvider", "GET", {pool: this.size}, 
		function (rpcResponse, data, rpcRequest) {
			// Always update minor-valued pool
			var poolToUpdate = (isc.IDProvider.pools[0].last > isc.IDProvider.pools[1].last ? 1 : 0);
			if (rpcResponse.httpResponseCode == 200) {
				var jsonObj = parseJSON(rpcResponse.httpResponseText);
				isc.IDProvider.pools[poolToUpdate].curr = jsonObj["numID"];
				isc.IDProvider.pools[poolToUpdate].last = isc.IDProvider.pools[poolToUpdate].curr + isc.IDProvider.size - 1;
				if (poolToUpdate == 0 ){
					isc.Offline.put("IDcurr0", isc.IDProvider.pools[0].curr);
					isc.Offline.put("IDlast0", isc.IDProvider.pools[0].last);
				}
				else {
					isc.Offline.put("IDcurr1", isc.IDProvider.pools[1].curr);
					isc.Offline.put("IDlast1", isc.IDProvider.pools[1].last);
				}
				// --- Initial only! second pool update
                if (isc.IDProvider.pools[1].last == 1){
                    isc.IDProvider.updatePool();
                }
			}
		});
	},
	
	// TODO - adjust pool size
    getNextID: function () {
        if (this.pools[this.wrkPool].curr > this.pools[this.wrkPool].last) {
			this.wrkPool = (this.wrkPool == 0 ? 1 : 0);
			isc.Offline.put("idWrkPool", isc.IDProvider.wrkPool);
			this.updatePool();
        }
		this.pools[this.wrkPool].curr += 1;
		if (this.wrkPool == 0 ){
			isc.Offline.put("IDcurr0", this.pools[0].curr);
		}
		else {
			isc.Offline.put("IDcurr1", this.pools[1].curr);
		}
		return this.pools[this.wrkPool].curr;
    },

    getCurrentID: function () {
        return this.pools[this.wrkPool].curr;
    },
	
	testRepairPools: function(){
		var nonWrkPool = (this.wrkPool == 0 ? 1 : 0);
		if (isNaN(isc.IDProvider.pools[0].curr)
			|| this.pools[this.wrkPool].last >= this.pools[nonWrkPool].last
			|| this.pools[nonWrkPool].curr > this.pools[nonWrkPool].last
			|| this.pools[this.wrkPool].curr > this.pools[this.wrkPool].last)
				
		{
			this.pools = [{curr: 1, last: 0}, {curr: 1, last: 1}];
			this.wrkPool = 0;
			this.updatePool();
		}
	},
	
	initPools: function(){
		this.pools[0].curr = Number(isc.Offline.get("IDcurr0"));
		this.pools[0].last = Number(isc.Offline.get("IDlast0"));
		this.pools[1].curr = Number(isc.Offline.get("IDcurr1"));
		this.pools[1].last = Number(isc.Offline.get("IDlast1"));
		this.wrkPool = Number(isc.Offline.get("idWrkPool"));
		this.testRepairPools();
	}
});

// --- Initialization of IDProvider-s pools
isc.IDProvider.initPools();



// ================== CBM Base Classes (DataSources) =====================

// ------------------- Base CRUD setup ---------------
var opBindingsDefault = [{
        operationType: 'fetch', dataProtocol: 'postMessage'
    }, {
        operationType: 'add', dataProtocol: 'postMessage'
    }, {
        operationType: 'update', dataProtocol: 'postMessage'
    }, {
        operationType: 'remove', dataProtocol: 'postMessage'
    }
];


// ----- The most common fundamental Attributes set ------
// For use in every "class" (DataSources)
isc.DataSource.create({
    ID: "BaseDataSource",
    fields: [
        // --- Common persistent attributes ---
        {
            name: "ID",
            type: "integer",
            primaryKey: true,
            relationStructRole: "ID",
            part: "main",
            canEdit: false //,
            //				inList : true,
            //hidden : true
        },
        // --- Non-persisted technological properties ---
        {
            // --- Internal information-persistence-related state ---
            name: "infoState",
            type: "enum",
            valueMap: ["new", "copy", "loaded", "deleted"],
            ignore: true,
			canExport: false,
            canSave: false,
            hidden: true
        }
    ]
});



// ----------------- The main CBM base class -----------------------
//  inherited from isc RestDataSource class
// Special attribute <relationStructRole> values:
//	relationStructRole:"ID"; - Independent ID field
//	relationStructRole:"ChildID"; - Dependent 1:1 ID - taken from head part
//  relationStructRole:"MainID"; - Dependent pointer to ID of main part - historical or versioned
// For structured parts pointing - attribute <part>. Sample:
//	part:"vers";
isc.ClassFactory.defineClass("CBMDataSource", isc.RestDataSource);
isc.CBMDataSource.addProperties({
    // ---- Standard RestDataSource properties overloading -------
    dataURL: "http://127.0.0.1:8182/DataService", // <<< TODO switch to configurable source
    dataFormat: "json",
    dataTransport: "xmlHttpRequest",
    jsonPrefix: "//'\"]]>>isc_JSONResponseStart>>",
    jsonSuffix: "//isc_JSONResponseEnd",
    operationBindings: opBindingsDefault,
    autoCacheAllData: true,
    canMultiSort: true,
    // resultBatchSize:100, // <<< TODO  optimization here

    // ---- CBM - specific fields ----------------------
    inheritsFrom: BaseDataSource,
    useParentFieldOrder: true,
    abstr: false,
    isHierarchy: false,
    rec: null,

    // ---- Special functions (methods) definition -------

    // --- Additions to request 
    transformRequest: function (dsRequest) {
        if (typeof (curr_Img) != "undefined" && curr_Img != null) {
			curr_Img = (parseInt(curr_Img) + 1) + "";
            if (dsRequest.data == null) {
                dsRequest.data = {
                    currUser: curr_Session,
                    itemImg: curr_Img,
					currDate: curr_Date.toISOString(),	
					currLocale: tmp_Lang	
                 };
			} else {
                dsRequest.data.currUser = curr_Session;
                dsRequest.data.itemImg = curr_Img;
				dsRequest.data.currDate = curr_Date.toISOString(),	
				dsRequest.data.currLang = tmp_Lang; 
            }
        }
        return this.Super("transformRequest", arguments);
    },

    // --- Function for callback usage only!!! No explicit call intended!!!
    setID: function (record) {
        record["ID"] = isc.IDProvider.getNextID();
        if (typeof (record.contextForm) != 'undefined' && record.contextForm != null) {
            record.contextForm.setValue("ID", record["ID"]);
        }
		// --- 
        var atrNames = this.getFieldNames(false);
        for (var i = 0; i < atrNames.length; i++) {
			// --- Links to Main parts from Version parts
            if (this.getField(atrNames[i]).relationStructRole == "MainID" && record[atrNames[i]] == null) {
                record[atrNames[i]] = record[this.getField(atrNames[i]).mainPartID];
                if (typeof (record.contextForm) != 'undefined' && record.contextForm != null) {
                    record.contextForm.setValue(atrNames[i], record[atrNames[i]]);
                }
            }
			// --- Assignment for child tables for this "part" ID initialization
		    else if (this.getField(atrNames[i]).relationStructRole == "ChildID" && this.getField(atrNames[i]).part == that.getField(fieldName).part) {
                record[atrNames[i]] = record["ID"];
                if (typeof (record.contextForm) != 'undefined' && record.contextForm != null) {
                    record.contextForm.setValue(atrNames[i], record["ID"]);
                }
            }
			// --- Assignment of other parts ID (which name in this DS is not just "ID")			
			else if (this.getField(atrNames[i]).relationStructRole == "ID" && record[atrNames[i]] == null) {
                record[atrNames[i]] = isc.IDProvider.getNextID();
            }
		}

        if (this.afterSetID) { 
			this.afterSetID(record, this);
		} else if (window.afterSetID) { 
			window.afterSetID(record, this);
		}
    },
	
	// --- Constructing initial empty record of this DataSource - type
    constructNull: function (record) {
        var atrNames = this.getFieldNames(false);
        for (var i = 0; i < atrNames.length; i++) {
            record[atrNames[i]] = null;
        }
    },
	
	// --- Initialising of new record
    createInstance: function (contextGrid) {
        var record = {};
        this.constructNull(record);
        this.setID(record);
        record["infoState"] = "new";
        if (typeof (record["UID"]) != "undefined") {
            record["UID"] = Math.uuid();
        };
        record["Del"] = false;
        return record;
    },

	// --- Special setting all ID-like fields to <null> - used while cloning, and so on...
    setNullID: function (record) {
        var atrNames = this.getFieldNames(false);
        for (var i = 0; i < atrNames.length; i++) {
            if (this.getField(atrNames[i]).relationStructRole == "ID" || this.getField(atrNames[i]).relationStructRole == "ChildID" || this.getField(atrNames[i]).relationStructRole == "MainID") {
                record[atrNames[i]] = null;
            }
        }
    },

    cloneInstance: function (srcRecord) {
        var record = this.copyRecord(srcRecord);
        this.setNullID(record);
        this.setID(record);
        record["infoState"] = "copy";
        if (typeof (record["UID"]) != "undefined") {
            record["UID"] = Math.uuid();
        };
        record["Del"] = false;
        // --- Deep collection copying here (for fields having copyLinked field true) ---
        var atrNames = this.getFieldNames(false);
        for (var i = 0; i < atrNames.length; i++) {
			var fld = this.getField(atrNames[i]);
			if (fld.editorType == "BackLink" && fld.copyLinked == true )
			{
				this.copyCollection(fld, srcRecord, record);
			}
		}
        return record;
    },
	
	copyCollection: function(fld, srcRecord, record){
//		testDS(fld.relatedConcept);
		var collectionRS = isc.ResultSet.create({
			dataSource: fld.relatedConcept,
			fetchMode: "paged",
			criteria: parseJSON("{\"" + fld.backLinkRelation + "\" : \"" + srcRecord[fld.mainIDProperty] + "\"}"), // TODO: still record[ID] = null here!
			dataArrived: function (startRow, endRow) {
				var collectionNew = [];
				for(var i = startRow; i < endRow; i++)  
				{
					var rec = this.get(i); 
					var dsRelated = isc.DataSource.getDataSource(fld.relatedConcept);
					// dsRelated.afterSetID = this.getDataSource().afterSetIDCopy;
					// dsRelated.fldToSet = fld.backLinkRelation;
					// dsRelated.valToSet = record["ID"];
					var recNew = dsRelated.cloneInstance(rec);
					recNew[fld.backLinkRelation] = record["ID"];
					collectionNew[i] = recNew;
					collectionRS.getDataSource().addData(recNew);
				}
			}
		});
		collectionRS.getRange(0,1000);
	},
	
	// afterSetIDCopy: function (record, that){
	// record[that.fldToSet] = that.valToSet;
	// that.addData(record);
	// },
	
    onNew: function (record, context) {},

    onCopy: function (record, context) {},

    onFetch: function (record) {},

    onSave: function (record) {},

    onDelete: function (record) {},

    // --- Some peace of presentation logic: Default editing form. Can be overriden in child DS classes ---
    // --- Prepare interior layout based on DS meta-data:
    prepareFormLayout: function (valuesManager) {
        var tabSet = isc.TabSet.create({
            tabBarPosition: "top",
            width: "99%", height: "99%",
 //           width: "95%", height: "95%", <- Adequate smaller height, not affected width
 //           width : "*", height : "*", <- Small adjusted to content height, not affected width
 //			autoSize : true, <- No affect
            backgroundColor: "#DBF5E9", //"#DDFFEE",// "#D9F9E9",// 
            bodyColor: "#D9F7E9",//"#D9F9E9",
            overflow: "visible",
            paneContainerOverflow: "visible"
        });

        var atrNames = this.getFieldNames(false);
        var UIPaths = ["Main"];
        var forms = [];
        var items = [[]];
        for (var i = 0; i < atrNames.length; i++) {
            if (typeof (this.getField(atrNames[i]).hidden) == "undefined" || this.getField(atrNames[i]).hidden != true) {

                var currRoot = this.getField(atrNames[i]).UIPath;
                if (typeof (currRoot) == "undefined" || currRoot == null) {
                    currRoot = "Main";
                }

                var notFound = true;
                var j = 0;
                for (; j < UIPaths.length; j++) {
                    if (UIPaths[j] == currRoot) {
                        notFound = false;
                        items[j][items[[j]].length] = {
                            name: atrNames[i],
                            width: "100%"
                        }; //isc.FormItem.create({name:atrNames[i], width:"100%"}); // TODO isc.FormItem.create - unsupported call!!!
                        break;
                    }
                }
                if (notFound) {
                    UIPaths[j] = currRoot;
                    items[j] = [];
                    //        		items[j][0] = isc.FormItem.create({name:atrNames[i], width:"100%", shouldSaveValue:true, shouldSaveValue:(this.getField(atrNames[i]).canSave)});  
                    items[j][0] = {
                        name: atrNames[i],
                        width: "100%"
                    }; //isc.FormItem.create({name:atrNames[i], width:"100%"});  
                }
            }
        }

        var hiWidth = 600;
        var hiHeight = 100;
        for (var i = 0; i < UIPaths.length; i++) {
            forms[i] = isc.InnerForm.create({
                valuesManager: valuesManager,
                dataSource: this,
                items: items[i]
            });
            var height = 100;
            height = items[i].getLength() * 16 - (items[i].getLength() * items[i].getLength()) / 16;
            if (height > hiHeight) {
                hiHeight = height;
            }

            if (UIPaths.length > 1) {
                tabSet.addTab({
                    title: UIPaths[i],
                    pane: forms[i]
//					height: "*", width: "*" <- No affect but titles empty!
                });
            }
        }

        var formInterior = null;
        if (forms.length > 1) {
            formInterior = tabSet;
        } else {
            formInterior = forms[0];
        }

        var toolBar = isc.Toolbar.create({
            width: 100,
            height: "100%",
//            height: "*", <- Small (very!) not adjusted height
            autoSize: true,
            border: "1px solid #AACCDD",
            vertical: true,
            backgroundColor: "#C8E0D5", //"#99DDFF",
            title: "Commands",
            buttons: [{
                    name: "savebtn",
                    editorType: "button",
                    title: isc.CBMStrings.EditForm_Save, //"Save Item",
                    click: "{this.topElement.savePosition(); this.topElement.save(); return false;}",
                    width: 99, height: 25, extraSpace: 10
                }, {
                    name: "cancelbtn",
                    editorType: "button",
                    title: isc.CBMStrings.EditForm_Cancel, //"Cancel",
                    click: "{this.topElement.savePosition(); this.topElement.destroy(); return false;}",
                    width: 99, height: 25, extraSpace: 10
                }
            ]
        });

        var formLayout = isc.HLayout.create({
            autoDraw: false,
            //    				defaultWidth:"100%", defaultHeight:"100%", 
            defaultWidth: hiWidth, defaultHeight: hiHeight,
//            autoSize: true, <- seems to have no affect
            layoutMargin: 4,
            membersMargin: 10,
            members: [
                formInterior,
                toolBar
            ]
        });

        return formLayout;
    },

    // --- Edit pointed record according to metadata of current DS
    edit: function (record, context) {
        var valuesManager = isc.ValuesManager.create({
            dataSource: this, 
			values: record // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<!!!!!!16.05
        });

        var form = isc.FormWindow.create({
            valuesManager: valuesManager,
            content: this.prepareFormLayout(valuesManager),
            save: function () {
                if (this.valuesManager.validate(true)) {
                    this.valuesManager.saveData();
                    this.destroyLater(this, 400);
                    return false;
                }
            }
        });
        form.context = context;

        record.contextForm = valuesManager;
		var stateTitle = "?";
        switch (record["infoState"]) {
        case "new":
            this.onNew(record, form);
			stateTitle = isc.CBMStrings.InfoState_new; 
            break;
        case "copy":
            this.onCopy(record, form);
			stateTitle = isc.CBMStrings.InfoState_copy;
            break;
		case "loaded": stateTitle = isc.CBMStrings.InfoState_loaded; break;
		case "deleted": stateTitle = isc.CBMStrings.InfoState_deleted; break;
        };
		
        form.title = form.title + " - (" + stateTitle + ")";
		
        form.show();
        if (record["infoState"] == "loaded") {
            form.valuesManager.editRecord(record);
        } else {
            form.valuesManager.editNewRecord(record);
        }
    },

    // --- Edit several records according to metadata of current DS
    editMulti: function (records, context) {
        var valuesManager = isc.ValuesManager.create({
            dataSource: this
        });

        record = {};
        this.constructNull(record);
        record.contextForm = valuesManager;

        var form = isc.FormWindow.create({
            valuesManager: valuesManager,
            content: this.prepareFormLayout(valuesManager),
            save: function () {
                ds = this.getDataSource();
                var atrNames = ds.getFieldNames(false);
                for (var j = 0; j < records.getLength(); j++) {
                    rowNum = context.getRecordIndex(records[j]);
                    records[j]["infoState"] = "loaded";
                    for (var i = 0; i < atrNames.length; i++) {
                        if (valuesManager.values[atrNames[i]] != null && valuesManager.values[atrNames[i]] != "ID") {
                            records[j][atrNames[i]] = valuesManager.values[atrNames[i]];
                        }
                    }
                    //					context.setEditValues(rowNum, records[j]);
                    context.updateData(records[j]);
                    context.refreshRow(rowNum);
                }
                // context.endEditing();
                //				result = context.saveAllEdits();
                this.destroyLater(this, 400);
                return false;
            }
        });
        form.context = context;

        form.title = form.title + " (several objects editing)";
        form.show();

        form.valuesManager.editRecord(record);
    }

}); // ---^^^ END CBMDataSource ^^^---


// --- Universal function that provide UI presentation of any Record in any Context (or without any)
// --- (Record must have PrgClass property)
function editRecords(records, context, conceptRecord) {
    // --- Find DataSource for record (or if not defined - from context)
    var ds = null;
    var recordFull = null;

    var cls;
	if (conceptRecord) {
		cls = conceptRecord;
	} else{
		cls = conceptRS.findByKey(records[0]["PrgClass"]);
	}
    if (typeof (context) != "undefined" && context != null && (typeof (cls) == "undefined" || cls == null || cls == "loading" || records.getLength() > 1)) { // DS by Context 
        ds = context.getDataSource();
        if (records.getLength() == 1) {
            ds.edit(records[0], context);
        } else {
            ds.editMulti(records, context);
        }
    } else if (records.getLength() == 1) { // DS by exact record Class
        ds = eval(cls["SysCode"]); // TODO: Protect from eval
        // --- Load concrete class instance data, if record's class not equal (is subclass) of context class (DataSource)
        if (context.dataSource != cls["SysCode"] && records[0]["infoState"] == "loaded") {
//			testDS(cls["SysCode"]);
            var currentRecordRS = isc.ResultSet.create({
                dataSource: cls["SysCode"],
                criteria: {ID: records[0]["ID"]},
                dataArrived: function (startRow, endRow) {
                    recordFull = currentRecordRS.findByKey(records[0]["ID"]);
                    recordFull["infoState"] = "loaded";
                    recordFull["Del"] = false;
                    ds.edit(recordFull, context);
                }
            });
            currentRecordRS.getRange(0, 1);
        } else {
            ds.edit(records[0], context)
        }
    }
}

// --- Universal function that provide creation of some class (DS) instances based on existing records array.
// Can proceed array of several instances.
// Work in queue inside, to provide ID-s (all complex of them!) to be initialised subsequently by callbacks,  
// but in async. for all other programm flow. 
// Parameters: 
// resultClass	- function that provide destination object class. In most cases simpy returns name of class. 
// 					But can also define it different as function of some parameters for each source record.
// initFunc		- is a function, that provide target-from-source fields initialisation.
// context		- intended to be some ListGrid successor, that represent results. 
function createFrom(srcRecords, resultClass, initFunc, context) {
    if (srcRecords == null) {
        isc.warn(isc.CBMStrings.ListCreateFrom_NoSelectionDone, this.innerCloseNoChoiceDlg);
        return;
    }
	
    window.afterSetID = function (record, that) {
        var mainObj = null;
        if (context.topElement.valuesManager) {
            mainObj = context.topElement.valuesManager.getValue("ID");
        }
        initFunc(record, srcRecords[iteration], mainObj);
        if (context) {
            context.addData(record);
        }
        iteration++;
        if (iteration < srcRecords.getLength()) {
            newRecord();
        }
    };

    newRecord = function () {
        if (resultClass) {
            var newRec = isc.DataSource.getDataSource(resultClass(srcRecords[iteration])).createInstance();
        } else if (context) {
            var newRec = context.getDataSource().createInstance();
        } else {
            isc.Warn(isc.CBMStrings.ListCreateFrom_UndefinedClass);
        }
    };

    var iteration = 0;
    this.newRecord();
}


// ======= Isomorphic DataSource (DS) from Metadata dynamic creation ===============

// --- Function that provide creation of some Isomorphic DataSource (DS) itself 
//     from universal CBM metadata. ---
function createDS(forView, futherActions) {
	// --- Get all concept metadata ---
	var viewRec = viewRS.find("SysCode", forView);
	if (viewRec == null) { 
	    isc.warn(isc.CBMStrings.MD_NoPrgViewFound + forView, null);
		return; 
	}
	var conceptRec = conceptRS.find("ID", viewRec["ForConcept"]);
	if (conceptRec == null) { 
	    isc.warn(isc.CBMStrings.MD_NoConceptFound + forView, null);
		return; 
	}
	var classRec = classRS.find("ForConcept", conceptRec["ID"]);
	if (classRec == null) { 
	    isc.warn(isc.CBMStrings.MD_NoPrgClassFound + forView, null);
		return; 
	}
	
	// --- Creation of head part of DS ---
	resultDS = "isc.CBMDataSource.create({ID:\"" + forView + "\", dbName: Window.default_DB, "
		+ "title: \"" + viewRec["Description"] + "\", ";
	if (classRec.ExprToString && classRec.ExprToString != "null") {
		resultDS += "titleField: \"" + classRec.ExprToString + "\", ";
	}
	if (classRec.ExprToStringDetailed && classRec.ExprToStringDetailed != "null") {
		resultDS += "infoField: \"" + classRec.ExprToStringDetailed + "\", ";
	}
	if (classRec.isHierarchy === true) {
		resultDS += "isHierarchy: " + classRec.isHierarchy + ", ";
	}
	if (classRec.MenuAdditions && classRec.MenuAdditions != "null") {
		resultDS += "MenuAdditions: \"" + classRec.MenuAdditions + "\", ";
	}
	if (classRec.CreateFromMethods && classRec.CreateFromMethods != "null") {
		resultDS += "CreateFromMethods: \"" + classRec.CreateFromMethods + "\", ";
	}
	
	// --- Fields creation ---
	resultDS += "fields: [";
	// --- Some preparations ---
	var viewFields;
	var relations;
	var attributes;
	// TODO: Set criteria dynamically in place (in callbacks), not relay on closure 
	viewFieldRS.setCriteria({"ForPrgView": viewRec.ID}); 
	relationRS.setCriteria({"ForConcept": conceptRec.ID}); 
	attributeRS.setCriteria({"ForPrgClass": classRec.ID}); 
	viewFieldRS.dataArrived = function() { 
		viewFields = viewFieldRS.getAllVisibleRows();
		relationRS.getRange(0, 400);
	};
	relationRS.dataArrived = function() { 
		relations = relationRS.getAllVisibleRows();
		attributeRS.getRange(0, 400);
	};
	attributeRS.dataArrived = function() { 
		attributes = attributeRS.getAllVisibleRows();
		// --- Just fields creation ---
		for (var i=0; i < viewFields.getLength(); i++) {
			resultDS += "{ name: \"" + viewFields[i].SysCode + "\", title: \"" + viewFields[i].Description + "\",";
			resultDS += "type: " + relations[i].PointedClass;
			resultDS += "},";
		}
		resultDS = resultDS.slice(0, resultDS.length-1);
		resultDS += "]})";
		eval(resultDS);
		// --- Call for program flow after DS creation
		if (futherActions && futherActions != null) {
			futherActions();
		}
	};
	// Actual call chain start
	viewFieldRS.getRange(0, 400);
}

// --- Function that simply tests DS existence, and if absent - creates it/
function testDS(forView, futherActions) {
	if(isc.DataSource.getDataSource(forView)) {
		if (futherActions && futherActions != null) {
			futherActions();
		}
	} else {	
		createDS(forView, futherActions);
	} 
}

// ===================== Universal UI components and UI infrastructure ====================

//========================== CBM custom interface control types ===========================

isc.SimpleType.create({
    name: "currency",
    inheritsFrom: "float",

    normalDisplayFormatter: function (value) {
        return isc.isA.Number(value) ? value.toCurrencyString() : value;
    },
    shortDisplayFormatter: function (value) {
        return isc.isA.Number(value) ? value.toCurrencyString() : value;
    },
    editFormatter: function (value) {
        return isc.isA.Number(value) ? value.toFixed(2) : value;
    },
    parseInput: function (value) {
        var fVal = parseFloat(value);
        if (!isNaN(fVal)) return fVal;
        return value;
    },
    validators: [{
            type: "floatRange",
            min: 0//,
  //          errorMessage: isc.CBMStrings.MoneyType_NotNegative
        }, {
            type: "floatPrecision",
            precision: 2,
            roundToPrecision: true
        }
    ]

});


// =================== Multi-language support section ===================
// --- Set some global-context language-related objects ---
var curr_Lang =	isc.Offline.get("LastLang");
var tmp_Lang = curr_Lang;

var	langValueMap = {
		"en-GB" : "English",
		"cn-CN" : "China",
		"jp-JP" : "Japan",
		"de-DE" : "Germany",
		"fr-FR" : "France",
		"ru-RU" : "Русский",
		"sp-SP" : "Spain",
		"it-IT" : "Italy" };
var langValueIcons = {
		"en-GB" : "en-GB",
		"cn-CN" : "cn-CN",
		"jp-JP" : "jp-JP",
		"de-DE" : "de-DE",
		"fr-FR" : "fr-FR",
		"ru-RU" : "ru-RU",
		"sp-SP" : "sp-SP",
		"it-IT" : "it-IT" };
var	flagImageURLPrefix = "flags/48/";
var	flagImageURLSuffix = ".png";

// --- Common-purpose function for browser language recognition 
// function getSystemLanguage(){
	// nValue = oTextbox.value.charCodeAt(0);
	// if (navigator.userLanguage) // Explorer
		// l_lang = navigator.userLanguage;
	// else if (navigator.language) // Other browser
		// l_lang = navigator.language;
	// else
		// l_lang = "en"; 
	// return value;
// };

// --- Base String language-part extraction function
// If strictLang==false - returns strictly requested language value, or null.
function extractLanguagePart(value, language, strictLang){
	if (!value) {return;}
	// --- If string is not multi language - return it as is
	if (value.indexOf("~|") == -1) {
		if (!strictLang) {
			return value;
		} else {
			return null;  // - ??? (arguable) 
		}
	}
	// --- For multilanguage string - try to find requested language part, 
	// and if not found - returns first part, no matter prefixed by locale  or not.
	// Language prefix are in all cases removed.
	var out = value;
	var i = value.indexOf("~|" + language ); // Is there part for  requested locale?
	if (i != -1) { // Locale exists
		var tmp = value.slice(i + 8);
		i = tmp.indexOf("~|", 1);
		if ( i != -1) { // The substring is not the last
			out = tmp.substring(0, i);
		} else {
			out = tmp;
		}
	} else if (!strictLang){ // No requested locale - get first. 
	    // TODO: First part - temporary. Change to get next in language substitution list. 
		i = value.indexOf("~|", 1);
		if (i != -1) { // Some successor locale exists
			out = value.substring(0, i);
		}
	} else { // Strict language condition - no default allowed
		return null;
	}
	// If the first part is language-prefixed - remove that prefix	
	if (out.charAt(0) == "~") { 
		out = out.slice(8);
	}
	
	return out;
}

// --- Multi-language String primitive type --------
isc.SimpleType.create({
    name: "multiLangText",
    inheritsFrom: "text",
	editorType: "MultilangTextItem",
	locale: null,

    normalDisplayFormatter: function (value, field, form, record) {
		return extractLanguagePart(value, tmp_Lang, false); 
    },
	
    shortDisplayFormatter: function (value,  field, component, record) {
		return extractLanguagePart(value, tmp_Lang, false); 
	},

    editFormatter: function (value, field, form, record) {
		if (value == null) return "";
		var lang = tmp_Lang; // Default - global current language
		var strict = false;
		if (field && field.itemLang) {
			lang = field.itemLang;
			strict = field.strictLang;
		}
		return extractLanguagePart(value, lang, strict);
    },
	
	parseInput: function(value, field, form, record) {
		var	fullValue = field.getValue();
		if (fullValue == null) {
			if (value == null) {
				return null;
			} else {
				return "~|" + field.itemLang + "|" + value;
			}
		}
		var out = fullValue;
		if (value == null) { value = ""; }
		if (field && field.itemLang) { 
			// If edited language part exists - remove old value - insert new 
			var i = fullValue.indexOf("~|" + field.itemLang); // Is there part for  requested locale?
			if (i != -1) { // Locale exists
				var j = fullValue.indexOf("~|", i + 1); // Existence of successor parts
				out = fullValue.slice(0, i + 8) + value;
				if (j != -1) {
					out = out + fullValue.slice(j); 
				}
			} else if (field.strictLang) { 
			// OR - Append new language part 
				out = fullValue + "~|" + field.itemLang + "|" + value;
			} else { 
			// OR - replace in all cases the first part
				i = fullValue.indexOf("~|"); // Test if first part starts with language prefix
				j = fullValue.indexOf("~|", 1);
				if (i==0) { // Preserve language prefix of first part in all cases
					out = fullValue.slice(0, 8) + value; 
				} else {
					out = value;
				}	
				if (j != -1) {
					out = out + fullValue.slice(j); 
				}
			}		
		}
		return out;
   }
 
});

// --- Multi-language text control (FormItem) ---
isc.defineClass("MultilangTextItem", "TextItem", "PickList").addMethods({
	shouldSaveValue: true,
	iconPrompt: "Choose input language", 
	valueMap: langValueMap,
	valueIcons: langValueIcons,
	itemLang: tmp_Lang,
	strictLang: false,
	imageURLPrefix: flagImageURLPrefix,
	imageURLSuffix: flagImageURLSuffix,
	icons : [ {src : flagImageURLPrefix + tmp_Lang + flagImageURLSuffix, showFocused: true, showOver: false } ],
    
    init : function () {
		this.setProperty("icons", [{src : flagImageURLPrefix + tmp_Lang + flagImageURLSuffix, showFocused: true, showOver: false }]);
        return this.Super("init", arguments);
    },
	
	iconClick : function(form, item, icon){
		item.showPickList(false, false);
	},
	
    pickValue : function (lang) {
		switchLanguage(this, this.getValue(), lang);
    }

});

//if (isc.PickList) isc.MultilangTextItem.addMethods(isc.PickList._instanceMethodOverrides);

// --- Language processing for string content ---
var switchLanguage = function(field, value, lang){
	field.setProperty("icons", [{src : flagImageURLPrefix + field.valueIcons[lang] + flagImageURLSuffix, showFocused: true, showOver: false }]);
	field.setProperty("itemLang", lang);
	field.setProperty("strictLang", true);
	// So, while redraw(), item_Lang language part will be extracted an represented.
	field.redraw();
};


// ================== Grid-related controls infrastructure ==================

// --- Context Menu for use in Grids in CBM
var defaultContextMenuData = [{
//        title: isc.CBMStrings.InnerGridMenu_CreateNew,
        icon: isc.Page.getAppImgDir() + "new.png",
        click: function () {
            this.context.editObject("new");
            return false;
        }
    }, {
//        title: isc.CBMStrings.InnerGridMenu_CopyNew,
        icon: isc.Page.getAppImgDir() + "CopyOne.png",
        click: function () {
            this.context.editObject("copy");
            return false;
        }
    }, {
//        title: isc.CBMStrings.InnerGridMenu_Edit,
        icon: isc.Page.getAppImgDir() + "edit.png",
        click: function () {
            this.context.editObject("loaded");
            return false;
        }
    }, {
        isSeparator: true
    }, {
//        title: isc.CBMStrings.InnerGridMenu_Delete,
        icon: isc.Page.getAppImgDir() + "delete.png",
        click: function () {
            this.context.removeSelectedData();
            //			  this.context.redraw(); 
            //			  this.context.getDataSource().removeData(this.context.getSelectedRecords()[0]); 
            return false;
        } //"this.context.removeSelectedData(); return false;"
    }
];

var innerGridContextMenu = isc.Menu.create({
    cellHeight: 22,
    //data: defaultContextMenuData,

    setContext: function (cont) {
        this.context = cont;
		
		defaultContextMenuData[0].title = isc.CBMStrings.InnerGridMenu_CreateNew;
		defaultContextMenuData[1].title = isc.CBMStrings.InnerGridMenu_CopyNew;
		defaultContextMenuData[2].title = isc.CBMStrings.InnerGridMenu_Edit;
		defaultContextMenuData[4].title = isc.CBMStrings.InnerGridMenu_Delete;

        if (typeof (cont.getDataSource().MenuAdditions) != "undefined") {
            this.setData(defaultContextMenuData.concat(cont.getDataSource().MenuAdditions));
        } else {
            this.setData(defaultContextMenuData);
        }

        for (var i = 0; i < this.data.getLength(); i++) {
            this.data[i].context = cont;
        }

    }
});


// --- Base Grid/Tree control - for represent table of data in standalone Window, or to embed into DynamicForm as linked list.
isc.ClassFactory.defineClass("InnerGrid", "Canvas");
isc.InnerGrid.addProperties({
    grid: null,
    filter: null,
    listSettings: null,
    listSettingsExists: true,
    listSettingsChanged: false, // TODO: Determine changes while work
    // listSettingsApplied : false,
	treeRoot: null,

    initWidget: function () {
        this.Super("initWidget", arguments);
        // --- Prepare Fields array to show in grid
//		testDS(this.dataSource);
        var ds = this.getDataSource(); 
        var dsflds = ds.getFields();
        var flds = new Array();
        for (var fldName in dsflds) {
            var fld = dsflds[fldName];
            if (typeof (fld.inList) != "undefined" && fld.inList == true) {
                //flds.add(parseJSON("{ \"name\":\"" + fld.name + "\"}"));
                flds.add(fld);
            }
			 if(typeof(fld.rootValue) != "undefined"){
				 fld.rootValue = (typeof(this.treeRoot) == "undefined" ? fld.rootValue : this.treeRoot);
			 }
        }
        // --- Determine list kind and initialize appropriate type of Grid 
        if (ds.isHierarchy == false) {
            this.grid = isc.ListGrid.create({
                dataSource: this.dataSource,
                useAllDataSourceFields: false,
                dataPageSize: 75, // <<< Optimization recomended in actual inherited datasources.
                alternateRecordStyles: false,
                ////showFilterEditor: true, // TODO: switch this by user
                canHover: true,
                //hoverWidth: 500, hoverHeight: 20,
                autoFitData: false, // TODO ??? 
                //fixedRecordHeights: false,
                leaveScrollbarGaps: false,
                selectionType: "multiple",
                //selectionAppearance:"checkbox", // Use if more "stable" selection preferred.
                canDragRecordsOut: true,
                //recordDoubleClick: function () 
                //{ if(this.getSelectedRecord() != null this.editObject(\"loaded\"); return false;},
                canEdit: true,
                modalEditing: true,
                autoSaveEdits: false,
                //canRemoveRecords:true, 
                //warnOnRemoval:true,
                saveLocally: false,
                canMultiSort: true,
                canReorderRecords: true,
                viewStateChanged: function () {
                    this.parentElement.parentElement.listSettingsChanged = true;
                    return false;
                },
                dataArrived: function () {
                    this.parentElement.parentElement.setListSettings();
                    return true;
                }
            })
        } else {
            this.grid = isc.TreeGrid.create({
                dataSource: this.dataSource,
                useAllDataSourceFields: false,
				autoFetchData: true,
				keepParentsOnFilter: true,
				dataPageSize: 75, // <<< Optimization recomended in actual inherited datasources.
                alternateRecordStyles: false,
                //showFilterEditor: true, // TODO: switch this by user
                canHover: true,
                //hoverWidth: 200, hoverHeight: 40,
                autoFitData: false, // TODO ??? 
                //fixedRecordHeights: false,
                leaveScrollbarGaps: false,
                selectionType: "multiple",
                //selectionAppearance:"checkbox", // Use if more "stable" selection preferred.
                canDragRecordsOut: true,
                canEdit: true,
                modalEditing: true,
                autoSaveEdits: false,
                //canRemoveRecords:true, 
                //warnOnRemoval:true,
                saveLocally: false,
                canMultiSort: true,
                canReorderRecords: true,
                viewStateChanged: function () {
                    this.parentElement.parentElement.listSettingsChanged = true;
                    return false;
                },
                loadDataOnDemand: false, // !!! If false - treeRootValue won't be set!
				listSettingsApplied: false,
                dataArrived: function (parentNode) {
					if (!this.listSettingsApplied) {
						this.parentElement.parentElement.setListSettings();
						this.listSettingsApplied = true;
					}
                    return true;
                }
                // recordDoubleClick: "this.editObject(\"loaded\"); return false;",
            })
        }
		
        this.grid.setFields(flds);
		if (typeof(this.treeRoot) != "undefined") {
			this.grid.treeRootValue = this.treeRoot;
			this.grid.data.rootValue = this.treeRoot;
		}

        // --- Other grid intialisations:
        this.grid.showContextMenu = function () {
            innerGridContextMenu.setContext(this);
            return innerGridContextMenu.showContextMenu();
        };
        // TODO: Menu adjusted to current cell
        //  this.grid.cellContextClick = function (record, row, cell) {
        // 		innerGridContextMenu.setContext(this);
        // 		return innerGridContextMenu.showContextMenu(); 
        // };

        this.grid.editObject = function (mode) {
            var ds = this.getDataSource();
            var records = [];
            // --- Edit New record ---
            if (mode == "new") {
                this.selection.deselectAll();
				// TODO If ds is superclass - ask first, and create selected class (ds) instance.
				var dsRecord = conceptRS.find("SysCode", this.dataSource);
				var isSuper = dsRecord["Abstract"];
				if (isSuper){
//					var filter = parseJSON("{ \"BaseConcept\" : \"" + dsRecord["ID"] + "\"}");
					var filter = parseJSON("{ \"Abstract\" : \"false\", \"Primitive\" : \"false\" }");
					
					var newChild = function(record){
					    var dsNew = isc.DataSource.getDataSource(record[0].SysCode);
						if (dsNew == null) {
							isc.warn(isc.CBMStrings.NewObject_NoDS);
							return;
						}
						records[0] = dsNew.createInstance(this);
						records[0]["infoState"] = "new";
						var conceptRecord = conceptRS.find("SysCode", dsNew.ID); 
						records[0]["PrgClass"] = conceptRecord["ID"];
						var criter = this.getCriteria();
						// --- Set criteria fields to criteria value
						for (var fld in criter) {
							records[0][fld] = criter[fld];
						}
						if (records != null && records.getLength() > 0) {
							editRecords(records, this, conceptRecord);
						}
					}
					
					var table = createTable("Concept", this, newChild, null, dsRecord["ID"]);
					return;
				} else {
					records[0] = ds.createInstance(this);
					records[0]["infoState"] = "new";
					var criter = this.getCriteria();
					// --- Set criteria fields to criteria value
					for (var fld in criter) {
						records[0][fld] = criter[fld];
					}
				}
            }
            // --- Copy Selected record ---
            else if (mode == "copy") {
                records[0] = ds.cloneInstance(this.getSelectedRecord());
                records[0]["infoState"] = "copy";
                this.selection.deselectAll();
            }
            // --- Edit Selected record[s] ---
            else if (mode == "loaded") {
                records = this.getSelectedRecords();
                for (var i = 0; i < records.getLength(); i++) {
                    records[i]["infoState"] = "loaded";
                }
            }

            if (records != null && records.getLength() > 0) {
                editRecords(records, this);
            } else {
                isc.warn(isc.CBMStrings.InnerGrid_NoSelection);
            }
        };

        // --- Menu structures customisation ---
        var createFromMenuButton = isc.IconMenuButton.create({
            top: 250, left: 400, width: 82,
            title: "Create from",
            icon: isc.Page.getAppImgDir() + "new.png",
            //disabled: true
			visibility: "hidden"
        });
        if (typeof (this.getDataSource().CreateFromMethods) != "undefined") {
            var createMenuData = this.getDataSource().CreateFromMethods;
            menuCreate = isc.Menu.create({
                showShadow: true,
                shadowDepth: 10,
                context: this.grid, //createFromMenuButton, 
                data: createMenuData
            });
            createFromMenuButton.menu = menuCreate;
            //createFromMenuButton.enable();
			createFromMenuButton.show();
        }

        var toContextReturnButton = null;
        if (typeof (this.context) != "undefined" && this.context != null) {
            toContextReturnButton = isc.IconButton.create({
                top: 250, width: 25,
                title: "",
                icon: isc.Page.getAppImgDir() + "TickOut.png",
                click: function () {
                    var thisInnerGrid = this.parentElement.parentElement.parentElement;
                    if (thisInnerGrid.grid.anySelected()) {
                        this.topElement.callback(thisInnerGrid.grid.getDataSource().copyRecords(thisInnerGrid.grid.getSelectedRecords()),
                            thisInnerGrid.context);
                        this.topElement.destroy();
                    } else {
                        isc.warn(isc.CBMStrings.InnerGrid_NoSelectionDone, this.innerCloseNoChoiceDlg);
                    }

                    return false;
                }
            });
        }

        // --- InnerGrid layout ---
        controlLayout = isc.VLayout.create({
            width: "99%", height: "99%",
            // width: "*", height: "*", <- Leads to permanent small grid even in List form
            members: [
                isc.HLayout.create({
                    width: "100%",
                    height: "10",
                    layoutMargin: 0,
                    members: [
                        toContextReturnButton,
                        isc.IconButton.create({
                            top: 250, width: 25,
                            title: "",
                            icon: isc.Page.getAppImgDir() + "new.png",
							prompt: isc.CBMStrings.InnerGrid_CreateNew, 
                            click: function () {
                                this.parentElement.parentElement.parentElement.grid.editObject("new");
                                return false;
                            }
                        }),
                        isc.IconButton.create({
                            top: 250, width: 25,
                            title: "",
                            icon: isc.Page.getAppImgDir() + "CopyOne.png",
							prompt: isc.CBMStrings.InnerGrid_CopyNew,
							hoverWidth: 220,
                            click: function () {
                                this.parentElement.parentElement.parentElement.grid.editObject("copy");
                                return false;
                            }
                        }),
                        createFromMenuButton,
                        isc.IconButton.create({
                            top: 250, width: 25,
                            title: "",
                            icon: isc.Page.getAppImgDir() + "edit.png",
							prompt: isc.CBMStrings.InnerGrid_Edit, 
 							hoverWidth: 120,
                            click: function () {
                                this.parentElement.parentElement.parentElement.grid.editObject("loaded");
                                return false;
                            }
                        }),
                        isc.IconButton.create({
                            top: 250, left: 100, width: 25,
                            title: "",
                            icon: isc.Page.getAppImgDir() + "save.png",
							prompt: isc.CBMStrings.InnerGrid_Save,
 							hoverWidth: 170,
                            click: "this.parentElement.parentElement.parentElement.grid.saveAllEdits();  return false;"
                        }),
                        isc.IconButton.create({
                            top: 250, left: 100, width: 25,
                            title: "",
                            icon: isc.Page.getAppImgDir() + "delete.png",
							prompt: isc.CBMStrings.InnerGrid_Delete, 
 							hoverWidth: 130,
                            click: "this.parentElement.parentElement.parentElement.grid.removeSelectedData();  return false;"
                        }),
                        isc.IconButton.create({
                            top: 250, left: 200, width: 25,
                            title: "",
                            icon: isc.Page.getAppImgDir() + "refresh.png",
							prompt: isc.CBMStrings.InnerGrid_Reload, 
 							hoverWidth: 150,
                            click: "this.parentElement.parentElement.parentElement.refresh(); return false;"
                        }),
                        isc.IconButton.create({
                            top: 250, left: 300, width: 25,
                            title: "",
                            icon: isc.Page.getAppImgDir() + "filter.png",
							prompt: isc.CBMStrings.InnerGrid_AutoFilter, 
                            click: function () {
                                grid.filterData(advancedFilter.getCriteria());
                                return false;
                            }
                        })
                    ]
                }),
                this.grid
            ]
        });

        this.addChild(controlLayout);
    },
	
	// --- Apply previously stored current user's list settings
    setListSettings: function () {
        this.listSettings = listSettingsRS.find({
            ForUser: curr_User,
            ForType: this.grid.dataSource,
            Win: this.topElement.getClassName(),
            Context: this.topElement.contextString
        });
        if (typeof (this.listSettings) == "undefined" || this.listSettings == null) {
            this.listSettings = listSettingsRS.dataSource.createInstance(null);
            this.listSettingsExists = false;
            this.listSettings.ForType = this.grid.dataSource;
            this.listSettings.Win = this.topElement.getClassName();
            this.listSettings.ForUser = curr_User;
            this.listSettings.Context = this.topElement.contextString;
            this.listSettings.Settings = this.grid.getViewState();
        } else if (this.listSettings.Settings) {
            this.grid.setViewState(this.listSettings.Settings);
        }
    },

    innerCloseNoChoiceDlg: function () {
        if (okClick()) {
            this.topElement.destroy();
        }
    },

    refresh: function () {
        this.grid.invalidateCache();
    }
}); // END InnerGrid


// --- Back-link control ---
isc.ClassFactory.defineClass("BackLink", "CanvasItem");
isc.BackLink.addProperties({
//    height: "*",  width: "*", <- seems the same
//    height: "88%",  width: "88%", //<- very narrow, but normal hight! (???)
    rowSpan: "*",  colSpan: "*",
    endRow: true,
    startRow: true,
    shouldSaveValue: true,

    innerGrid: null,
    backLinkRelation: null,
    mainIDProperty: null,
    mainID: -1,
    filter: null,

    createCanvas: function (form) {
	//	testDS(this.relatedConcept);
        this.innerGrid = isc.InnerGrid.create({
            autoDraw: false,
//            width: "100%", height: "80%", <- Bad experiment!: If so, inner grid will not resize
            width: "*", height: "*",
            dataSource: this.relatedConcept
        });
        this.innerGrid.grid.showFilterEditor = false;
        return this.innerGrid;
    },

    showValue: function (displayValue, dataValue, form, item) {
        if (this.filter == null && typeof (form.valuesManager) != "undefined" && form.valuesManager != null) {
            this.mainID = form.valuesManager.getValue(this.mainIDProperty);
            if (typeof (this.mainID) != "undefined") {
                var filterString = "{\"" + this.backLinkRelation + "\" : \"" + this.mainID + "\"}";
                this.filter = parseJSON(filterString);
            } else {
                this.filter = {
                    ID: "-1"
                };
            }
        }
        if (typeof (this.filter) != "undefined" && this.filter != null) {
            this.innerGrid.grid.setCriteria(this.filter);
            this.innerGrid.grid.fetchData(this.filter, function (dsResponse, data, dsRequest) {
                if (typeof (this.getDataSource) == "undefined") {
                    if (!this.hasAllData()) {
                        this.setCacheData(data);
                    }
                } else {
                    if (!this.getDataSource().hasAllData()) {
                        this.getDataSource().setCacheData(data);
                    }
                }
            });
			this.innerGrid.refresh();
        }
    }
}); // End Back-link control

/* -- Not used yet
//--- List-call component (intended to add to any control that need TableWindow call) ---
isc.ClassFactory.defineClass("ListCall", isc.Class);
isc.ListCall.addProperties({
	// -- Outer initialized items
	classToCall : null,
	additionalActions : function(arraySelected){},
	// -- Inner (private-alike) items	
	arrayReturned : null,
	callList : function(){createTable(classToCall, this);}
	onChoiceDone : function(arrSelected) //Main called from List method
		{
			arrayReturned = copyRecords(arrSelected); 
			additionalActions(arrayReturned);
		} 
});
*/


// ============== CBM common Window class ===================================

isc.ClassFactory.defineClass("BaseWindow", isc.Window);
isc.BaseWindow.addProperties({
    width: 700, height: 500,
	layoutMargin: 2,
	autoSize: true,
    //	showFooter:true,
    canDragResize: true,
    showResizer: true,
    resizeBarSize: 6,
    isModal: false,
    autoDraw: false,
    showMaximizeButton: true,
    keepInParentRect: true,
    autoCenter: false,
    showShadow: true,
    shadowSoftness: 10,
    shadowOffset: 5,
    dataSource: null,
    winPos: null,
    winPosExists: true,
    contextString: "",
    canFocus: true,
//    hiliteHeaderStyle: "WindowHiliteHeader",
//    showHeaderBackground: false,
    // TODO: Provide Active (focused) window hilightning
    // headerProperties : {canFocus : true, focusChanged : function(hasFocus){
    // if (hasFocus){
    // this.topElement.headerStyle = "WindowHiliteHeader"; 
    // this.topElement.redraw();
    // }
    // else {
    // this.topElement.headerStyle = "WindowHeader";
    // this.topElement.redraw();
    // }}
    // },
    // bodyProperties : {canFocus : true, focusChanged : function(hasFocus){
    // if (hasFocus){
    // this.topElement.headerStyle = "WindowHiliteHeader"; 
    // this.topElement.redraw();
    // }
    // else {
    // this.topElement.headerStyle = "WindowHeader";
    // this.topElement.redraw();
    // }}
    // },
    // focusChanged : function(hasFocus){
    // if (hasFocus){
    // this.headerStyle = "WindowHiliteHeader"; 
    // this.redraw();
    // }
    // else {
    // this.headerStyle = "WindowHeader";
    // this.redraw();
    // }
    // },
    setPosition: function () {
        this.winPos = windowSettingsRS.find({
            ForUser: curr_User,
            ForType: this.dataSource,
            Win: this.getClassName(),
            Context: this.contextString
        });
        if (typeof (this.winPos) == "undefined" || this.winPos == null) {
            this.winPos = windowSettingsRS.dataSource.createInstance(null);
            this.winPosExists = false;
            this.winPos.ForType = this.dataSource;
            this.winPos.Win = this.getClassName();
            this.winPos.ForUser = curr_User;
            this.winPos.Context = this.contextString;
        } else if (this.winPos.Position) {
            var pos = parseJSON(this.winPos.Position);
            this.winPos.T = pos.T;
            this.setPageTop(pos.T);
            this.winPos.L = pos.L;
            this.setPageLeft(pos.L);
            this.winPos.W = pos.W;
            this.setWidth(pos.W);
            this.winPos.H = pos.H;
            this.setHeight(pos.H);

            this.setAutoSize(); // If ommited - content won't be adjusted to size of the Window
        }
        this.bringToFront();
        this.focus();
        //this.flash();
        // if (hasFocus){
        // headerStyle = "WindowHiliteHeader";
        // }
        // else {
        // headerStyle = "WindowHeader";
        // }
    },
	
	savePosition : function () {
        if (this.winPos.T != this.getPageTop() || this.winPos.L != this.getPageLeft() || this.winPos.W != this.getWidth() || this.winPos.H != this.getHeight()) {
            this.winPos.T = this.getPageTop();
            this.winPos.L = this.getPageLeft();
            this.winPos.W = this.getWidth();
            this.winPos.H = this.getHeight();
            this.winPos.Position = "{\"T\":" + this.winPos.T + ", \"L\":" + this.winPos.L + ", \"W\":" + this.winPos.W + ", \"H\":" + this.winPos.H + "}";
            if (this.winPosExists) {
                windowSettingsRS.dataSource.updateData(this.winPos);
            } else {
                windowSettingsRS.dataSource.addData(this.winPos);
            }
        }
        return true;
    },
	
    onCloseClick: function() {
		this.savePosition();
		return true;
	}

});


// ==================== CBM TableWindow ========================

//------------ TableWindow  itself -----------------
isc.ClassFactory.defineClass("TableWindow", isc.BaseWindow);
isc.TableWindow.addProperties({
    showFooter: true,
    context: null,
    innerGrid: null,
    initWidget: function () {
        this.Super("initWidget", arguments);
        this.innerGrid = isc.InnerGrid.create({
            dataSource: this.dataSource,
            context: this.context,
			treeRoot: this.treeRoot
        });
        this.addItems(
        [
            // TODO Activate Filter by special button		 
			// isc.FilterBuilder.create({ dataSource: this.dataSource, topOperator: "and" }),
            this.innerGrid
        ]);
        this.title = this.dataSource + isc.CBMStrings.TableWindow_Title;
        this.setPosition();
    },

    onCloseClick: function () {
        var tmp = this.Super("onCloseClick", arguments);

        if (this.innerGrid.listSettingsChanged) {
            this.innerGrid.listSettings.Settings = this.innerGrid.grid.getViewState();
            if (this.innerGrid.listSettingsExists) {
                listSettingsRS.dataSource.updateData(this.innerGrid.listSettings);
            } else {
                listSettingsRS.dataSource.addData(this.innerGrid.listSettings);
            }
        }
        return true;
    }
});

//---- Stand-along independent function, that creates TableWindow from elsewhere for entity view (DS) type ----
function createTable(forType, context, callback, filter, rootIdValue) {
	var futherCreateTableActions = function() {
		var table = isc.TableWindow.create({
			dataSource: forType,
			context: context, 
			callback: callback,
			treeRoot: rootIdValue
		});
		
		// if (rootIdValue){
			// table.innerGrid.treeRoot = rootIdValue;
		// }

		// TODO here - add previous stored Filters if any
		if (typeof (filter) != "undefined" && filter != null) {
			table.innerGrid.grid.setCriteria(filter);
			table.innerGrid.grid.fetchData(filter, function (dsResponse, data, dsRequest) {
				if (typeof (this.getDataSource) == "undefined") {
					if (!this.hasAllData()) {
						this.setCacheData(data);
					}
				} else {
					if (!this.getDataSource().hasAllData()) {
						this.getDataSource().setCacheData(data);
					}
				}
			});
		} else {
			table.innerGrid.grid.fetchData(null, function (dsResponse, data, dsRequest) {
				if (typeof (this.getDataSource) == "undefined") {
					if (!this.hasAllData()) {
						this.setCacheData(data);
					}
				} else {
					if (!this.getDataSource().hasAllData()) {
						this.getDataSource().setCacheData(data);
					}
				}
			});
		}
		table.show();
	};
	
//	testDS(forType, futherCreateTableActions);
futherCreateTableActions();
//	return table;
};


// ==================== CBM Form View Infrastructure ========================

isc.ClassFactory.defineClass("InnerForm", isc.DynamicForm);
isc.InnerForm.addProperties({
//    width: "89%", height: "89%", <- Some narrow width, NO affected height!
    width: "100%", height: "100%",
//    width: "*", height: "*", <- Narrow width and no resize!
    autoSize: true,
    numCols: 4,
    minColWidth: 100,
    colWidths: ["120", "30%", "120", "30%"],
    layoutMargin: 2,
    cellPadding: 2,
    //	cellBorder : 1, // <<< For layout testing only! In production - set to 0
    autoFocus: true,
    showTitlesWithErrorMessages: true
});



//  ------ FormWindow itself --------
isc.ClassFactory.defineClass("FormWindow", isc.BaseWindow);
isc.FormWindow.addProperties({
    valuesManager: null,
    content: null,
    context: null,
    width: "*", height: "*",
    autoSize: true,

//    title: "  instance ",
    bodyColor: "#DBF5E9", //"#DDFFEE", //"#D9F9E9", //"#D9F7E9", 

    initWidget: function () {
        this.Super("initWidget", arguments);
        this.addItems(
        [
            this.content
        ]);
        if (this.valuesManager != null) {
//			testDS(this.valuesManager.dataSource.ID);
            this.dataSource = this.valuesManager.dataSource.ID;
			this.title = this.dataSource;// + isc.CBMStrings.FormWindow_Title;
//            this.title = this.dataSource + this.title;
        }
        this.setPosition();
    },

    // Destroy with delay (for example to let callback to do it's work) 
    destroyLater: function (win, delay) {
        if (delay == 0 || delay == null) {
            delay = 100;
        }
		
 //       isc.Timer.setTimeout(win.destroy(), delay);
		
		var destroyInner = function() {
			win.destroy();
		};
        isc.Timer.setTimeout(destroyInner, delay);
    }
});

// ================================ The End =================================