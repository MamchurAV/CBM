// ========== Temporary candidates zone ===================================
// EMPTY NOW
//alert(new Date().getTime().toString(16));
// ======================= Some common Functions ==========================
function loadScript(script) {
  document.writeLn('<' + 'script src="' + script + '"><' + '/script>');
};

var parseJSON = function(data) {
  return window.JSON && window.JSON.parse ? window.JSON.parse(data) : (new Function("return " + data))();
};

// ------- JS text beautifier ------------ 
function beautifyJS(str) {
  // TODO * * * TODO :-)
  return str;
};

// --- Addition to standard Array - to clear it ------------------------------------------
Array.prototype.popAll = function() {
  while (this.length > 0) {
    this.pop();
  }
};

// --- Useful to clone: Object, Array, Date, String, Number, or Boolean.  ----------------
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
      if (obj.hasOwnProperty(attr)){copy[attr] = clone(obj[attr])};
    }
    return copy;
  }
  throw new Error("Unable to copy obj! Its type isn't supported.");
};

// --- Create new object "concatenating" arguments, NOT replacing existing (from first objects) properties.
// 
function collect() {
  var ret = {};
  var len = arguments.length;
  for (var i=0; i<len; i++) {
    for (var p in arguments[i]) {
      if (arguments[i].hasOwnProperty(p) && ret[p] === undefined) {
        ret[p] = arguments[i][p];
      }
    }
  }
  return ret;
}

/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 * (Chosen after speed tests!)
 *
 * Alexander Mamchur change first part of UUID
 * to gain sequential growing UUID-s for DBMS storage efficiency.
 * (Not for MSSQL due to it-s specific GUID structure!)
 **/
var UUID = (function() {
  var self = {};
  var lut = [];
  for (var i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
  }
  self.generate = function() {
    //    var d0 = Math.random()*0xffffffff|0; // <<< Original Jeff Ward's version
    var d0 = new Date().getTime().toString(16).slice(-8); // <<< Alexander Mamchur replacement to gain sequential growing first part
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    // return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
    // lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
    // lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
    // lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff]; // <<< Original Jeff Ward's version
    return d0 + '-' +
      lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
      lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
      lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
  }
  return self;
})();



// ============================================================================
// ====================== Transactional data processing =======================
// ============================================================================
// ---------------- Singleton TransactionManager object -----------------------
var TransactionManager = {}; //Object.create();
// - Managed transactions with default instance -
TransactionManager.transactions = [{Id: "default", Changes: []}];
// - Internal functions -
TransactionManager.createTransaction = function() {
	newTransaction = {Id: UUID.generate(), Changes: []}
	this.transactions.push(newTransaction);
	return newTransaction;
}

TransactionManager.getTransaction = function(transactId) {
	var currTrans = null;
	if(transactId) { 
		currTrans = this.transactions.find("Id", transactId);
	} else {
		currTrans = this.transactions.find("Id", "default");
	}
	return currTrans;
};
// - Add object to transaction -
TransactionManager.add = function(obj, transactId) {
	var currTrans;
  if (transactId) {
		currTrans = this.getTransaction(transactId);
	} else {
		currTrans = this.transactions.find("Id", "default");
	}
  if (currTrans !== null) {
		currTrans.Changes.push(obj);
	}	
};

TransactionManager.commit = function(transactId, callback) {
	var currTrans = this.getTransaction(transactId);
  if (currTrans !== null) {
			// TODO: Save objects in transaction to isc Data Source
			var len = currTrans.Changes.getLength();
			var i = 0;
			for (i; i < len-1; i++){
				currTrans.Changes[i].save(true); // Call CBMobject's save() 
			}
			currTrans.Changes[i].save(true, callback); // TODO: <<<this is not solution -  Last call CBMobject's save() - with callback 
			this.close(currTrans);
	}	
};

TransactionManager.rollback = function(transactId) {
	var currTrans = this.getTransaction(transactId);
  if (currTrans !== null) {
		currTrans.Changes.popAll();
	}	
};

TransactionManager.close = function(transactId) {
	var currTrans =  this.transactions.find("Id", transactId);
	for (var i = 0; i < this.transactions.length; i++) {
		if (this.transactions[i] === currTrans) {
			this.transactions.splice(i, 1);
		}
	}	
};

// ==========================================================================================
// ----- Data in isc DS caches manipulation - without processing in persistent storage. -----
var addDataToCache = function(rec) { 
  currentDS = isc.DataSource.get(rec.Concept);
	if (currentDS) {	
		var dsResponse = {
			operationType: "add",
			data: [rec]
		};
		currentDS.updateCaches(dsResponse);
	}
};		 

var updateDataInCache = function(rec) { 
  currentDS = isc.DataSource.get(rec.Concept);
	if (currentDS) {	
		var dsResponse = {
			operationType: "update",
			data: [rec]
		};
		currentDS.updateCaches(dsResponse);
	}
};		 

var removeDataFromCache = function(rec) { 
  currentDS = isc.DataSource.get(rec.Concept);
	if (currentDS) {	
		var dsResponse = {
			operationType: "remove",
			data: [rec]
		};
		currentDS.updateCaches(dsResponse);
	}
};		 


// ============================================================================
// ========= CBM Technology and Domain Model Classes (DataSources)  ===========
// ============================================================================

// ==================== Some helper classes and Functions =====================

var sendCommand = function(command, httpMethod, params, callback) {
  isc.RPCManager.sendRequest({
    // --- Common part ---
    data: null,
    useSimpleHttp: true,
    contentType: "application/json",
    transport: "xmlHttpRequest",
    // --- Initialized part ---
    actionURL: CBM_URL + command,
    httpMethod: httpMethod,
    params: params,
    callback: callback
  });
};

// ------ Identifier (surrogate keys) provider ---------------------------
isc.ClassFactory.defineClass("IDProvider", isc.Class);
isc.IDProvider.addClassProperties({
  // --- UUID-based variant ---
  getNextID: function() {
    return UUID.generate();
  }
});

// ------ Create local (clientOnly) dataSource from other ----------------
var getClientOnlyDS = function(ds) {
	var dsLocal = isc.CBMDataSource.create({ID: ds.ID + "_" + this.ID, clientOnly:true});
	for (var prop in ds){
		if (ds.hasOwnProperty(prop)) {
			dsLocal[prop] = ds[prop];
		}
	}
	return dsLocal;
};

// ---- Managed set of named purposed criteria-s
isc.ClassFactory.defineClass("FilterSet", "Class"); // TODO (?) - switch to simple JS object???
isc.FilterSet.addProperties({

	init: function() {
		this.criterias = new Array;
    return this.Super("init", arguments);
	},
	
	add: function(keyName, criteriaValue, sysFlag){
		this.remove(keyName); // Disable double keys
		var item = {};
		item.filterName = keyName;
		item.filter = criteriaValue;
		item.sysFlag = (sysFlag ? sysFlag : false);
		this.criterias.add(item);
	},
	
	remove: function(keyName){
		this.criterias.remove(this.criterias.find("filterName", keyName));
	},
	
	clear: function(keyName){
		this.criterias.removeList(this.criterias.findAll("sysFlag", false));
	},
	
	// Prepare resulting criteria from set of criterias 
	getCriteria: function(){
		var tmp = this.criterias.getProperty("filter");
		var out = {};
		for (var i = 0; i < tmp.length; ++i) {
			if (tmp[i] !== undefined) { 
				// TODO: Enhance to not-plain conditions (if needed???) 
			  for (var attrname in tmp[i]) {
					if (tmp[i].hasOwnProperty(attrname)) {
						out[attrname] = tmp[i][attrname]; 
					}	
				}
			}
		}
		return out;
	}
});


// =======================================================================
// ================== CBM Base Classes (DataSources) =====================

// ------------------- Base CRUD setup ---------------
var opBindingsDefault = [{
  operationType: 'fetch',
  dataProtocol: 'postMessage'
}, {
  operationType: 'add',
  dataProtocol: 'postMessage'
}, {
  operationType: 'update',
  dataProtocol: 'postMessage'
}, {
  operationType: 'remove',
  dataProtocol: 'postMessage'
}];

// ----- The fundamental Attributes set ------
// For use in every "class" (DataSources)
isc.DataSource.create({
  ID: "BaseDataSource",
  fields: [
    // --- Common persistent attributes ---
    {
      name: "ID",
      type: "text",
      primaryKey: true,
      relationStructRole: "ID",
      part: "main",
      canEdit: false,
      hidden : true
    }, {
      name: "Concept",
      type: "text",
      canEdit: false,
      hidden : true
		},
    // --- Non-persisted technological properties ---
    {
      // --- Internal information-persistence-related state ---
      name: "infoState",
      type: "enum",
      valueMap: ["new", "copy", "loaded", "changed", "deleted"],
      ignore: true,
      canExport: false,
      canSave: false,
      hidden: true
    }
  ]
});


// ----------------- The main CBM ISC-metadata base class -----------------------
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
  dataURL: CBM_URL + "DataService",
  dataFormat: "json",
  dataTransport: "xmlHttpRequest",
  jsonPrefix: "//'\"]]>>isc_JSONResponseStart>>",
  jsonSuffix: "//isc_JSONResponseEnd",
  operationBindings: opBindingsDefault,
  autoCacheAllData: true,
	cacheMaxAge: 28800, // 8 hours to keep unsaved data in DS locally  
  canMultiSort: true,
  // resultBatchSize:100, // <<< TODO  optimization here
  inheritsFrom: BaseDataSource,
  useParentFieldOrder: true,

  // ---- CBM - specific fields ----------------------
	concept: null,
	prgClass: null,
	relations: null,
  abstr: false,
  isHierarchy: false,
  rec: null,

  // ---- Special functions (methods) definition -------
	// --- Return CBM Concept record for this isc DataSource ---
	getConcept: function() {
		// If this.concept is null - initialise it (once!)
		if (this.concept === null) { 
			this.concept = conceptRS.find({SysCode:this.ID});
		}	
		return this.concept		
	},
	
	// --- Return CBM PrgClass aspects record for this isc DataSource ---
	getPrgClass: function() {
		// If this.prgClass is null - initialise it (once!)
		if (this.prgClass === null) { 
			this.prgClass = classRS.find({ForConcept: this.getConcept().ID, Actual: true});
		}	
		return this.concept		
	},
	
	// --- Return CBM-metadata Relation record for this isc DataSource field ---
	getRelation: function(fldName) {
		// If this.relations is null - initialise it (once!)
		if (this.relations === null) { 
			this.relations = relationRS.findAll({ForConcept: this.getConcept().ID});
			// Add PrgAttribute information to every Relation position
			var n = this.relations.length;
			for (var i = 0; i < n; i++){
				var attr = attributeRS.findAll({ForRelation: this.relations[i].ID/*, ForPrgClass: this.getPrgClass().ID*/});
				this.relations[i] = collect(this.relations[i], attr[0]);
			}			
		}	
		var rel = this.relations.find({SysCode: fldName});
		return (rel ? rel : {} );
	},

  // --- Additions to request 
  transformRequest: function(dsRequest) {
    if (typeof(curr_Img) != "undefined" && curr_Img != null) {
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

  // --- NOT ACTUAL COMMENT!(?) >>> Function for callback usage only!!! No explicit call intended!!!
  setID: function(record) {
    record["ID"] = isc.IDProvider.getNextID();
    if (typeof(record.contextForm) != 'undefined' && record.contextForm != null) {
      record.contextForm.setValue("ID", record["ID"]);
    }
    // --- 
    var atrNames = this.getFieldNames(false);
		var n = atrNames.length;
    for (var i = 0; i < n; i++) {
      // --- Links to Main parts from Version parts
      if (this.getField(atrNames[i]).relationStructRole == "MainID" && record[atrNames[i]] == null) {
        record[atrNames[i]] = record[this.getField(atrNames[i]).mainPartID];
        if (typeof(record.contextForm) != 'undefined' && record.contextForm != null) {
          record.contextForm.setValue(atrNames[i], record[atrNames[i]]);
        }
      }
      // --- Assignment for child tables for this "part" ID initialization
      else if (this.getField(atrNames[i]).relationStructRole == "ChildID" && this.getField(atrNames[i]).part == that.getField(fieldName).part) {
        record[atrNames[i]] = record["ID"];
        if (typeof(record.contextForm) != 'undefined' && record.contextForm != null) {
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
  constructNull: function(record) {
    var atrNames = this.getFieldNames(false);
		var n = atrNames.length;
    for (var i = 0; i < n; i++) {
      record[atrNames[i]] = null;
    }
  },

  // --- Initialising of new record
  createInstance: function(contextGrid) {
    var record = Object.create(CBMobject);
    this.constructNull(record);
    this.setID(record);
		this.Concept = this.toString();
    record["infoState"] = "new";
    if (typeof(record.Del) != "undefined") {
      record.Del = false;
    }
    return record;
  },

  // --- Special setting all ID-like fields to <null> - used while cloning, and so on...
  setNullID: function(record) {
    var atrNames = this.getFieldNames(false);
		var n = atrNames.length;
    for (var i = 0; i < n; i++) {
      if (this.getField(atrNames[i]).relationStructRole == "ID" || this.getField(atrNames[i]).relationStructRole == "ChildID" || this.getField(atrNames[i]).relationStructRole == "MainID") {
        record[atrNames[i]] = null;
      }
    }
  },

	// ---------------------------- Copying section ---------------------------------
	cloneMainInstance: function(srcRecord) {
		var thatDS = this;
    var record = Object.create(CBMobject);
    var atrNames = this.getFieldNames(false);
		var n = atrNames.length;
    for (var i = 0; i < n; i++) {
			record[atrNames[i]] = clone(srcRecord[atrNames[i]]);
    }
		// Separately assign Concept property (that can be not in DS fields)
		if (srcRecord.Concept) {
			record.Concept = srcRecord.Concept;
		} else {
			record.Concept = thatDS.ID;
		}			
		
		thatDS.beforeCopy(record);
		thatDS.setNullID(record);
		thatDS.setID(record);
		record["infoState"] = "copy";
		if (typeof(record["Del"]) != "undefined") {
			record["Del"] = false;
		}
		return record;
	},

	// -- Deeper structures copying --
	cloneRelatedInstances: function(srcRecord, record, cloneNextRecord, afterCopyCallbacks, outerCallback) {
		var thatDS = this;
		var atrNames = thatDS.getFieldNames(false);
		// Discover structural fields 
		var fieldsToCopyCollection = [];
		var n = atrNames.length;
		for (var i = 0; i < n; i++) {
			var fld = thatDS.getField(atrNames[i]);
			if (fld.editorType == "OneToManyAggregate"){
				if (fld.copyLinked === true) {
					fieldsToCopyCollection.push(fld);
				}
			} else if (fld.copyValue !== undefined && fld.copyValue === false){ 
				record[fld] = null; // Clear not-copied fields 
			}
		}
		// Deep collection copying (for fields having copyLinked flag true) 
		if (fieldsToCopyCollection.length > 0){
			var iFld = -1;
			var recursiveCopyCollection = function(){
				iFld += 1;
				if (iFld < fieldsToCopyCollection.length) {
					if (iFld == fieldsToCopyCollection.length - 1 && (thatDS.afterCopy || afterCopyCallbacks || outerCallback)) {
						if (!afterCopyCallbacks){
							afterCopyCallbacks = [];
						}
						if (thatDS.afterCopy){
							afterCopyCallbacks.push({func:thatDS.afterCopy, rec: record, outerCall: outerCallback});
						} else if (outerCallback) {
							afterCopyCallbacks.push({func:outerCallback, rec: [record], outerCall: null});
						}
						thatDS.copyCollection(fieldsToCopyCollection[iFld], srcRecord, record, recursiveCopyCollection, cloneNextRecord, afterCopyCallbacks); 
					} else {
						thatDS.copyCollection(fieldsToCopyCollection[iFld], srcRecord, record, recursiveCopyCollection, cloneNextRecord); 
					} 
				}
			}
			recursiveCopyCollection(); // First call
		} else { // -- No structural fields - Execute afterCopy functions
			if (cloneNextRecord !== undefined){
				cloneNextRecord();
			}
			if (thatDS.afterCopy){
				thatDS.afterCopy(record, srcRecord);
			}
			if (afterCopyCallbacks !== undefined){
				for (var i = afterCopyCallbacks.length - 1; i >= 0; i--) { 
					afterCopyCallbacks[i].func(afterCopyCallbacks[i].rec, afterCopyCallbacks[i].outerCall);
				}
				afterCopyCallbacks.popAll();
			}
			if (outerCallback !== undefined){
				outerCallback();
			}
		}
	},

	copyCollection: function(fld, srcRecord, record, recursiveCopyCollection, cloneNextRecordPrev, callbacks) {
		record[fld.name] = [];
		isc.DataSource.get(fld.relatedConcept).fetchData(
			parseJSON("{\"" + fld.BackLinkRelation + "\" : \"" + srcRecord[fld.mainIDProperty] + "\"}"),
			function(dsResponce, data, dsRequest) {
				if (data.length === 0) {
					if (cloneNextRecordPrev) {
						cloneNextRecordPrev();
					}
					if (recursiveCopyCollection) {
						recursiveCopyCollection();
					}
					if (callbacks !== undefined) {
						for (var i = callbacks.length - 1; i >= 0; i--) {
							setTimeout(callbacks[i].func(callbacks[i].rec), 0);
						}
						callbacks.popAll();
					} 
				} else {
					var z = -1;
//					var dsRelated = this; // Closures-based variant
					function cloneNextRecord(){
						var recNew = null;
						z += 1;
						if (z < data.length) {
							var rec = data[z];
							var dsRelated = isc.DataSource.getDataSource(fld.relatedConcept); // Instead of closures - define very time here
							if (z < data.length - 1){
								recNew = dsRelated.cloneMainInstance(rec, cloneNextRecord);
								recNew[fld.BackLinkRelation] = record["ID"];
								function cloneRecordRelatedInstances(){ 
									dsRelated.cloneRelatedInstances(rec, recNew, cloneNextRecord);
								}
								addDataToCache(recNew);
								cloneRecordRelatedInstances();
							} else {  // The last record - callbacks and post-actions provided
								recNew = dsRelated.cloneMainInstance(rec); 
								recNew[fld.BackLinkRelation] = record["ID"];
								function cloneLastRecordRelatedInstances(){
									dsRelated.cloneRelatedInstances(rec, recNew, cloneNextRecord, callbacks); // The last row only - processed with callbacks
									if (recursiveCopyCollection) {
										recursiveCopyCollection();
									}
									if (cloneNextRecordPrev) {
										cloneNextRecordPrev();
									}
								}
								addDataToCache(recNew);
								cloneLastRecordRelatedInstances();
							}
						}
					};
					cloneNextRecord(); // First call.
				}
			}	
		);
  },

	cloneInstance: function(srcRecord, outerCallback) {
		var newRecord = this.cloneMainInstance(srcRecord);
		newRecord.currentTransaction = TransactionManager.createTransaction();
		addDataToCache(newRecord);		
		this.cloneRelatedInstances(srcRecord, newRecord, null, null, outerCallback);
		return newRecord;
	},

  beforeCopy: function(srcRecord, callbacks) {
		var record = this.copyRecord(srcRecord);
		// Special actions here
		return record;
	},

  onNew: function(record, context) {},

  onFetch: function(record) {},

  onSave: function(record) {},

  onDelete: function(record) {},

  // --- Determine deletion mode - real deletion, or using "Del" property deletion throw trash bin.
  isDeleteToBin: function() {
    if (this.fields["Del"]) {
      return true;
    }
    return false;
  },
	
  // --- Some peace of presentation logic: Default editing form. Can be overriden in child DS classes ---
  // --- Prepare interior layout based on DS meta-data:
  prepareFormLayout: function(valuesManager) {
    var tabSet = isc.TabSet.create({
      tabBarPosition: "top",
      width: "99%",
      height: "99%",
      //           width: "95%", height: "95%", <- Adequate smaller height, not affected width
      //           width : "*", height : "*", <- Small adjusted to content height, not affected width
      //			autoSize : true, <- No affect
      backgroundColor: "#DBF5E9", //"#DDFFEE",// "#D9F9E9",// 
      bodyColor: "#D9F7E9", //"#D9F9E9",
      overflow: "visible",
      paneContainerOverflow: "visible"
    });

    var atrNames = this.getFieldNames(false);
    var UIPaths = ["Main"];
    var forms = [];
    var items = [[]];
		var n = atrNames.length;
    for (var i = 0; i < n; i++) {
      if (typeof(this.getField(atrNames[i]).hidden) == "undefined" || this.getField(atrNames[i]).hidden != true) {

        var currRoot = this.getField(atrNames[i]).UIPath;
        if (typeof(currRoot) == "undefined" || currRoot == null) {
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
        // TODO: VVV save all updates in nested grids (back links) VVV
        click: function(){
					this.topElement.savePosition(); 
					this.topElement.save();	
					return false;},
        width: 99,
        height: 25,
        extraSpace: 10
      }, {
        name: "cancelbtn",
        editorType: "button",
        title: isc.CBMStrings.EditForm_Cancel, //"Cancel",
        click: "{this.topElement.savePosition(); this.topElement.destroy(); return false;}",
        width: 99,
        height: 25,
        extraSpace: 10
      }]
    });

    var formLayout = isc.HLayout.create({
      autoDraw: false,
      //    				defaultWidth:"100%", defaultHeight:"100%", 
      defaultWidth: hiWidth,
      defaultHeight: hiHeight,
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
  edit: function(record, context) {
    var valuesManager = isc.ValuesManager.create({
      dataSource: this,
      values: record 
    });
		// --- Control shot: Open transaction if from core call, otherwise use supplied one 
		// if (record.currentTransaction === null) {
			// record.currentTransaction = TransactionManager.createTransaction(); 
		// }
		
    var form = isc.FormWindow.create({
      valuesManager: valuesManager,
      content: this.prepareFormLayout(valuesManager),
      save: function() {
        if (this.valuesManager.validate(true)) {
          // Old way>>> this.valuesManager.saveData();
					var values = this.valuesManager.getValues();
			    // Construct CBMobject to gather edited values back from ValuesManager before save
					var record = Object.create(CBMobject); 
					for (var attr in values) {
						if (values.hasOwnProperty(attr)){
							record[attr] = values[attr];
						}
					}
					// Separately assign Concept property (that can be not in DS fields)
					if (values.Concept) {
						record.Concept = values.Concept;
					} else {
						record.Concept = this.ID;
					}			

					var that = this;
					if (context.dependent) {
						record.store();
						that.destroy();
					} else {
//						record.save(true, that.destroyLater(that, 200));
						record.save(true);
						that.destroy();
					}
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
        stateTitle = isc.CBMStrings.InfoState_copy;
        break;
      case "loaded":
        stateTitle = isc.CBMStrings.InfoState_loaded;
        break;
      case "deleted":
        stateTitle = isc.CBMStrings.InfoState_deleted;
        break;
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
  editMulti: function(records, context) {
    var valuesManager = isc.ValuesManager.create({
      dataSource: this
    });

    record = {};
    this.constructNull(record);
    record.contextForm = valuesManager;

    var form = isc.FormWindow.create({
      valuesManager: valuesManager,
      content: this.prepareFormLayout(valuesManager),
      save: function() {
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
          context.updateData(records[j]);
          context.refreshRow(rowNum);
        }
        this.destroyLater(this, 400);
        return false;
      }
    });
    form.context = context;

    form.title = form.title + " (several objects editing)";
    form.show();

    form.valuesManager.editRecord(record);
  }

}); // ---^^^--------------- END CBMDataSource ----------------^^^---

// ------------------- Additions to isc.DataSourceField --------------------
//// EMPTY ////

// --------------------- CBM base object prototype --------------------------
// --- Provide domain-independent abilities of objects to "leave" in Information System, 
//     keeping in mind that we work with information about things ---
var CBMobject = { 
	currentTransaction: null,
	isMainTransaction: true,
	ds: null,
//	hostObject: null,
	
	// -------- Retrieve record for link/aggregate field from DS ----------
	// and store  it in additional <fld_name + "_val"> field          
	loadLink: function(fld, callback){
		var dsRelated = isc.DataSource.getDataSource(fld.relatedConcept);
		dsRelated.fetchData({ID: this[fld.name]}, 
			function(dsResponse, data, dsRequest) {
				if (data.getLength() == 1) {
					// Reload data from primitive record to more functional CBMobject
					var record = Object.create(CBMobject);
					var atrNames = dsRelated.getFieldNames(false);
					var n = atrNames.length;
					for (var i = 0; i < n; i++){
						record[atrNames[i]] = data[0][atrNames[i]];
					}
					// Separately assign Concept property (that can be not in DS fields)
					if (data[0].Concept) {
						record.Concept = data[0].Concept;
					} else {
						record.Concept = this.ID;
					}			

					this[fld.name] = record;
					if (callback) {callback(fld);}
				} 
			}
		);	
	},
	
	// -------- Retrieve collection of back-linked records for one-to-many association field from DS ----------
	// and store  that collection in additional <fld_name + "_val"> field          
	loadCollection: function(fld, callback){
		var dsRelated = isc.DataSource.getDataSource(fld.relatedConcept);
		var that = this;
		dsRelated.fetchData(
			parseJSON("{\"" + fld.BackLinkRelation + "\" : \"" + this[fld.mainIDProperty] + "\"}"),
			function(dsResponse, data, dsRequest) {
				var records = [];
				var n = data.getLength();
				for (var i = 0; i < n; i++) {
					// Reload data from primitive records to more functional CBMobject-s
					var record = Object.create(CBMobject);
					var atrNames = dsRelated.getFieldNames(false);
					var nn = atrNames.length;
					for (var j = 0; j < nn; j++) {
						record[atrNames[j]] = data[i][atrNames[j]];
					}
					// Separately assign Concept property (that can be not in DS fields)
					if (data[i].Concept) {
						record.Concept = data[i].Concept;
					} else {
						record.Concept = this.ID;
					}			
					
					records.push(record);
				} 
				that[fld.name] = records;
				if (callback) {callback(fld);}
			}
		);	
	},
	
	// -------- Compete record retrieval from DS (/persistent storage) and construction ----------
/*	loadRecord: function(ID, callback){
		if (this.ds === null) {
			this.ds = isc.DataSource.get(this.Concept); 
		}
		var atrNames = this.ds.getFieldNames(false);
////// TODO Recursive in callback fields initialisation
		for (var i = 0; i < atrNames.length; i++) {
			var fld = this.ds.getField(atrNames[i]);
			if (this.ds.getRelation(fld).RelationKind === "BackAggregate" || this.ds.getRelation(fld).RelationKind === "Aggregate" ) {
				loadLink(fld, callback);
			} else if (fld.editorType == "OneToManyAggregate"){
				loadCollection(fld, callback);
			}
		}
	},
*/
/*
	loadRecords: function (criteria, callback){
////// TODO ...todo :-)
	},
*/
	// -------- Returns object that has only persistent fields ---------
	getPersistent: function() {
		if (this.ds === null) {
			this.ds = isc.DataSource.get(this.Concept); 
		}
		// Get CBM metadata descriptions (we need it to discover really persistent fields)
		var rec = {}; // Object.create();
//		var atrNames = Object.getOwnPropertyNames(obj); ////////////////////??? What's better?
		var atrNames = this.ds.getFieldNames(false);
		var n = atrNames.length;
		for (var i = 0; i < n; i++) {
			var rel = this.ds.getRelation(atrNames[i]);
			// Copy to returned "rec" only persistent fields
			if (rel && rel.DBColumn && rel.DBColumn !== null){
				rec[atrNames[i]] = this[atrNames[i]];
			}
		}
		return rec;
	},
	
	// ----------------- Link this object (record) with some transaction -------------------------
	store: function(trans){
		// TODO: Transactions seemed to be processed not on by-record basis 
		// if (trans) {
			// this.curentTransaction = trans;
		// }
		// if (!this.curentTransaction) { 
			// this.curentTransaction = TransactionManager.getTransaction()
		// }
		// TransactionManager.add(this, this.curentTransaction)
		this.save(false);
	},
	
	// ----------------- Complete record save to persistent storage -------------------------
	save: function(real, callback){
	//TODO here and not only - undefined this.Concept situation!!! (when not defined in DS as I gess...)
		if (this.ds === null) {
			this.ds = isc.DataSource.get(this.Concept); 
		}
		// -- No callback - simple asynchronous save
		if (callback === undefined) {
			var atrNames = this.ds.getFieldNames(false);
			// 1 - save direct-linked aggregated object
			var n = atrNames.length;
			for (var i = 0; i < n; i++) {
				var fld = this.ds.getField(atrNames[i]);
				var rel = this.ds.getRelation(fld.name);
				if ( this.ds.getRelation(fld.name) !== null 
				     && this.ds.getRelation(fld.name).RelationKind === "Aggregate"){ //TODO <<<< TEST this! 
					this.loadRecord(fld, function(){
							this[fld.name].getValue().save(real);
						}
					); 
				}	
			}				
			// 2 - save main object (real save here!!!)
			if (this.infoState === "new" || this.infoState === "copy"){
			// - If Data Source contains unsaved data of <this> object - remove it, and then add with normal save
				if (this.ds.getCacheData().find({ID: this.ID})) {
					removeDataFromCache(this);
				}	
				if (real){
					this.ds.addData(this.getPersistent());
				} else {
					addDataToCache(this);
				}
			} else if (this.infoState === "loaded" || this.infoState === "changed"){
				if (real){
					this.ds.updateData(this.getPersistent());
				} else {
					updateDataInCache(this);
				}
			}
			// 3 - save dependent aggregated by back-link structures
			for (var i = 0; i < atrNames.length; i++) {
				var fld = this.ds.getField(atrNames[i]);
				if ((this.ds.getRelation(fld.name) !== null 
						&& this.ds.getRelation(fld.name).RelationKind === "BackAggregate")
/* >>> TODO: remove later... */		|| fld.editorType === "OneToManyAggregate"){
						var that = this;
						this.loadCollection(fld, function(fld){
							var n = that[fld.name].length;
							if (n > 0) {
								for (var j = 0; j < n; j++) {
									that[fld.name][j].save(real);
								}
							}
						}
					);
				}
			}
		} else {
		
		// -- Callback provided - all sequential processing with Callback in the end
		/*		if (this.infoState === "new" || this.infoState === "copy") {
			// -- If Data Source contains unsaved data of <this> object - remove it, and then add with normal save
				if (this.ds.getCacheData().find({ID: this.ID})) {
					removeDataFromCache(this);
				}	
				// -- Add with normal save 
				this.ds.addData(this.getPersistent(this), callback);
			} else if (this.infoState === "loaded" || this.infoState === "changed") {
				this.ds.updateData(this.getPersistent(this), callback);
			}
				
				// -- Deeper structures copying --
			var that = this;
				var saveRelatedInstances = function(that, callback) {
					var thatDS = ds;
					var atrNames = thatDS.getFieldNames(false);
					// Discover structural fields 
					var fieldsCollection = [];
					for (var i = 0; i < atrNames.length; i++) {
						var fld = thatDS.getField(atrNames[i]);
						if (fld.editorType == "OneToManyAggregate") {
							if (fld.copyLinked === true) {
								fieldsCollection.push(fld);
							}
						} else if (fld.copyValue !== undefined && fld.copyValue === false) { 
							record[fld] = null; // Clear not-copied fields 
						}
					}
					// Deep collection copying (for fields having copyLinked flag true) 
					if (fieldsCollection.length > 0) {
						var iFld = -1;
						var recursiveSaveCollection = function(){
							iFld += 1;
							if (iFld < fieldsCollection.length) {
								if (iFld == fieldsCollection.length - 1 && (thatDS.afterCopy || afterCopyCallbacks)) {
									if (!afterCopyCallbacks){
										afterCopyCallbacks = [];
									}
									if (thatDS.afterCopy) {
										afterCopyCallbacks.push({func:thatDS.afterCopy, rec: record, outerCall: outerCallback});
									}
									thatDS.copyCollection(fieldsCollection[iFld], srcRecord, record, recursiveSaveCollection, cloneNextRecord, afterCopyCallbacks); 
								} else {
									thatDS.copyCollection(fieldsCollection[iFld], srcRecord, record, recursiveSaveCollection, cloneNextRecord); 
								} 
							}
						}
						recursiveSaveCollection(); // First call
					} else { // -- No structural fields - Execute afterCopy functions
						if (cloneNextRecord !== undefined) {
							cloneNextRecord();
						}
						if (thatDS.afterCopy) {
							thatDS.afterCopy(record, srcRecord);
						}
						if (afterCopyCallbacks !== undefined) {
							for (var i = afterCopyCallbacks.length - 1; i >= 0; i--) { 
								afterCopyCallbacks[i].func(afterCopyCallbacks[i].rec, afterCopyCallbacks[i].outerCall);
							}
							afterCopyCallbacks.popAll();
						}
					}
				};*/
		}
	},

	// ----------- Discard changes to record (or whole record if New/Copied ----------------
	discardRecord: function(record){
	},

	// ----------- ?????????????????????????? ----------------
	copyRecord: function (srcRecord){
	}
	
}; // ---^^^---------- END CBMobject ----------------^^^---

// function getDS(record){
////var cls = conceptRS.findByKey(record.Concept);
////var cls = conceptRS.find("SysCode", record.Concept);
// return isc.DataSource.get(record.Concept);
// }


// --- Universal function that provide UI presentation of any Record in any Context (or without any)
// --- (Record must have Concept property, and be a CBMobject-based)
function editRecords(records, context, conceptRecord) {
  // --- Find DataSource for record (or if not defined - from context)
  var ds = null;
  var recordFull = null;
	
	if (records.length === 0) { return;}

	// --- Open new transaction if edited record has no one, otherwise use supplied one 
	if (records[0].currentTransaction === undefined || records[0].currentTransaction === null) {
		records[0].currentTransaction = TransactionManager.createTransaction();
	}
	
  var cls; // Concept record
  if (conceptRecord) {
    cls = conceptRecord;
  } else {
    cls = conceptRS.findByKey(records[0]["Concept"]);
  }
  if (typeof(context) != "undefined" && context !== null && (typeof(cls) == "undefined" || cls === null || cls === "loading" || records.getLength() > 1)) { // DS by Context 
    ds = context.getDataSource();
		records[0].ds = ds;
    if (records.getLength() === 1) {
      ds.edit(records[0], context);
    } else {
      ds.editMulti(records, context);
    }
  } else if (records.getLength() === 1) { // DS by exact record Class
    ds = isc.getDataSource(cls.SysCode); // TODO: Protect from eval
		records[0].ds = ds;
    // --- Load concrete class instance data, if record's class not equal (is subclass) of context class (DataSource)
    if (context.dataSource != cls["SysCode"] && records[0]["infoState"] == "loaded") {
      //			testDS(cls["SysCode"]);
      var currentRecordRS = isc.ResultSet.create({
        dataSource: cls["SysCode"],
        criteria: {
          ID: records[0]["ID"]
        },
        dataArrived: function(startRow, endRow) {
          recordFull = currentRecordRS.findByKey(records[0]["ID"]);
          recordFull["infoState"] = "loaded";
          if (typeof(recordFull["Del"]) != "undefined") {
            recordFull["Del"] = false;
          }
					recordFull.currentTransaction = records[0].currentTransaction;
					recordFull.isMainTransaction = records[0].isMainTransaction;
          ds.edit(recordFull, context);
//					currentRecordRS.dataArrived = undefined;
        }
      });
      currentRecordRS.getRange(0, 1);
    } else {
			records[0].ds = ds;
      ds.edit(records[0], context);
    }
  }
}

// --- Universal function that provide creation of some class (DS) instances based on existing records array.
// Can process array of several instances.
// Work in queue inside, to provide ID-s (all complex of them!) to be initialised subsequently by callbacks,  
// but in asynchronously for all other program flow. 
// Parameters: 
// resultClass	- function that provide destination object class. In most cases simply returns name of class. 
// 					But can also define it different as function of some parameters for each source record.
// initFunc		- is a function, that provide target-from-source fields initialisation.
// context		- intended to be some ListGrid successor, that represent results. 
function createFrom(srcRecords, resultClass, initFunc, context) {
  if (srcRecords == null) {
    isc.warn(isc.CBMStrings.ListCreateFrom_NoSelectionDone, this.innerCloseNoChoiceDlg);
    return;
  }

  window.afterSetID = function(record, that) {
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

  newRecord = function() {
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
};

// --- Universal function that provide deletion of Record ---
// --- Deletion processed to trash bin, or physically, depending on "Del" flag existence, and additional mode  
function deleteRecord(record, delMode, mainToBin) {
  // --- Internal functions ---
  var deleteCollection = function(fld, record, delMode, mainToBin) {
    var collectionRS = isc.ResultSet.create({
      dataSource: fld.relatedConcept,
      fetchMode: "paged",
      criteria: parseJSON("{\"" + fld.BackLinkRelation + "\" : \"" + record[fld.mainIDProperty] + "\"}"),
      dataArrived: function(startRow, endRow) {
        var collectionNew = [];
        for (var i = startRow; i < endRow; i++) {
          var rec = this.get(i);
          deleteRecord(rec, delMode, mainToBin);
        }
				collectionRS.dataArrived = undefined;
      }
    });
    collectionRS.getRange(0, 100000); // Some compromise - composite aggregated records of number no more than 100 000
  }

  var deleteLinkedRecord = function(fld, record, delMode, mainToBin) {
    var dsInner = isc.DataSource.get(fld.relatedConcept);
    dsInner.fetchRecord(record[fld], function(dsResponse, data, dsRequest) {
      deleteRecord(data, delMode, mainToBin);
    });
  }
	
  // Process linked (aggregated) dependent records
  var ds = isc.DataSource.get(record.Concept);
  var atrNames = ds.getFieldNames(false);
  // Process composite aggregated records
  for (var i = 0; i < atrNames.length; i++) {
    var fld = ds.getField(atrNames[i]);
    // TODO: Replace DS editor type to MD association type, or MD but from DS (where it will exist)? 
    if ((fld.editorType == "OneToMany" || fld.editorType == "OneToManyAggregate") && fld.deleteLinked == true) {
      deleteCollection(fld, record, delMode, ds.isDeleteToBin());
    } else if (fld.editorType == "comboBox" && fld.deleteLinked == true) {
      deleteLinkedRecord(fld, record, delMode, ds.isDeleteToBin());
    }
  }
  // Process main record
  if (delMode == "deleteForce") {
    ds.removeData(record);
  } else { // delMode != "deleteForce" - process depending on "Del" flag existence
    if (record.Del != undefined) { // "Del" flag exists
			if (delMode == "delete"){
				record.Del = true;
			} else { // delMode == "restore" remains
				record.Del = false;
			}
      ds.updateData(record);
    } 
		// Conditions below - to protect from physical deletion "Del-less" aggregated records
		else if (mainToBin == undefined || !mainToBin) { // // No "Del" flag exists
      ds.removeData(record.ID);
    }
  }
};



// =================================================================================
// ======= Isomorphic DataSource (DS) from Metadata dynamic creation ===============

// --- Function that generates Isomorphic DataSource (DS) text from universal CBM metadata. ---
function generateDStext(forView, futherActions) {
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
  resultDS = "isc.CBMDataSource.create({ID:\"" + forView + "\", dbName: Window.default_DB, ";
  var dsTitle = extractLanguagePart(viewRec["Description"], tmp_Lang, true);
  if (dsTitle == null) {
    dsTitle = extractLanguagePart(conceptRec["Description"], tmp_Lang, true)
  }
  if (dsTitle == null) {
    dsTitle = extractLanguagePart(viewRec["Description"], tmp_Lang, false);
  }
  if (dsTitle == null) {
    dsTitle = extractLanguagePart(conceptRec["Description"], tmp_Lang, false);
  }
  if (dsTitle == null) {
    dsTitle = forView;
  }
  resultDS += "title: \"" + dsTitle + "\", ";
  if (classRec.ExprToString && classRec.ExprToString != "null") {
    resultDS += "titleField: \"" + classRec.ExprToString + "\", ";
  }
  if (classRec.ExprToStringDetailed && classRec.ExprToStringDetailed != "null") {
    resultDS += "infoField: \"" + classRec.ExprToStringDetailed + "\", ";
  }
  if (classRec.IsHierarchy === true) {
    resultDS += "isHierarchy: " + classRec.IsHierarchy + ", ";
  }
  if (classRec.MenuAdditions && classRec.MenuAdditions != "null") {
    resultDS += "MenuAdditions: \"" + classRec.MenuAdditions + "\", ";
  }
  if (classRec.CreateFromMethods && classRec.CreateFromMethods != "null") {
    resultDS += "CreateFromMethods: \"" + classRec.CreateFromMethods + "\", ";
  }

  // --- DS Fields creation ---
  resultDS += "fields: [";
  // --- Some preparations ---
  var viewFields;
  var relations;
  var attributes;
  // TODO: Set criteria dynamically in place (in callbacks), not relay on closure 
  viewFields = viewFieldRS.findAll({ForPrgView: viewRec.ID});
  relations = relationRS.findAll({ForConcept: conceptRec.ID});
  attributes = attributeRS.findAll({ForPrgClass: classRec.ID});
	// --- Just fields creation ---
	for (var i = 0; i < viewFields.getLength(); i++) {
		var currentRelation = relations.find("ID", viewFields[i].ForRelation);
		var currentAttribute = attributes.find("ForRelation", viewFields[i].ForRelation);
		resultDS += "{ name: \"" + viewFields[i].SysCode + "\", ";

//		var relationKindRec = relationKindRS.find("SysCode", currentRelation.RelationKind);
//		var kind = relationKindRec.SysCode;
		var kind = currentRelation.RelationKind;

		var fldTitle = extractLanguagePart(viewFields[i].Title, tmp_Lang, true);
		if (fldTitle == null) {
			fldTitle = extractLanguagePart(currentRelation.Description, tmp_Lang, true)
		}
		if (fldTitle == null) {
			fldTitle = extractLanguagePart(viewFields[i].Title, tmp_Lang, false);
		}
		if (fldTitle == null) {
			fldTitle = extractLanguagePart(currentRelation.Description, tmp_Lang, false);
		}
		if (fldTitle == null) {
			fldTitle = currentRelation.SysCode;
		}
		resultDS += "title: \"" + fldTitle + "\", ";

		if (viewFields[i].ShowTitle === false) {
			resultDS += "showTitle: false, ";
		}
		if (currentAttribute.Size > 0) {
			resultDS += "length: " + currentAttribute.Size + ", ";
		}
		if (viewFields[i].Hidden == true) {
			resultDS += "hidden: true, ";
		}
		if (viewFields[i].Mandatory == true) {
			resultDS += "required: true, ";
		}
		if (currentAttribute.ExprDefault && currentAttribute.ExprDefault != "null" && currentAttribute.ExprDefault != null) {
			resultDS += "defaultValue: \"" + currentAttribute.ExprDefault + "\", ";
		}
		if ((currentAttribute.DBColumn == "null" || currentAttribute.DBColumn == null || currentAttribute.DBColumn == "undefined") && kind !== "OneToMany") {
			resultDS += "canSave: false, ";
		}
		if (viewFields[i].Editable == false) {
			resultDS += "canEdit: false, ";
		}
		if (viewFields[i].ViewOnly == true) {
			resultDS += "ignore: true, ";
		}
		if (currentRelation.Domain && currentRelation.Domain != "null" && currentRelation.Domain != null) {
			resultDS += "valueMap: \"" + currentRelation.Domain + "\", ";
		}
		if (viewFields[i].UIPath == true) {
			resultDS += "UIPath: \"" + viewFields[i].UIPath + "\", ";
		}
		if (viewFields[i].InList == true) {
			resultDS += "inList: true, ";
		}
		if (currentAttribute.CopyValue == true) {
			resultDS += "copyValue: true, ";
		}
		if (currentAttribute.AttrSpecType && currentAttribute.AttrSpecType != "null" && currentAttribute.AttrSpecType != null) {
			resultDS += "relationStructRole: \"" + currentAttribute.AttrSpecType + "\", ";
		}
		if (currentAttribute.Part && currentAttribute.Part != "null" && currentAttribute.Part != null) {
			resultDS += "part: \"" + currentAttribute.Part + "\", ";
		}
		if (currentAttribute.MainPartID && currentAttribute.MainPartID != "null" && currentAttribute.MainPartID != null) {
			resultDS += "mainPartID: \"" + currentAttribute.MainPartID + "\", ";
		}
		var relatedConceptRec = conceptRS.find("ID", currentRelation.RelatedConcept);
		var type = relatedConceptRec.SysCode;
		switch (type) {
			case "Integer":
			case "Bigint":
				resultDS += "type: \"localeInt\"";
				break;
			case "Decimal":
			case "BigDecimal":
				resultDS += "type: \"localeFloat\"";
				break;
			case "Money":
				resultDS += "type: \"localeCurrency\"";
				break;
			case "StandardString":
			case "LongString":
			case "ShortString":
				resultDS += "type: \"text\"";
				break;
			case "StandardMlString":
			case "LongMlString":
			case "ShortMlString":
				resultDS += "type: \"multiLangText\"";
				break;
			case "Text":
				resultDS += "type: \"multiLangText\"";
				break;
			case "Boolean":
				resultDS += "type: \"boolean\"";
				break;
			case "Date":
				resultDS += "type: \"date\"";
				break;
			case "DateTime":
				resultDS += "type: \"datetime\"";
				break;
			case "TimePrecize":
				resultDS += "type: \"time\"";
				break;
			default:
				// --- Not primitive type - association type matters
				if (currentAttribute.CopyLinked == true) {
					resultDS += "copyLinked: true, ";
				}
				if (currentAttribute.DeleteLinked == true) {
					resultDS += "deleteLinked: true, ";
				}

				if (kind === "Link") {
					resultDS += "type: \"" + type + "\", ";
					resultDS += "foreignKey: \"" + type + ".ID\", ";
					resultDS += "editorType: \"comboBox\", ";
					if (currentAttribute.Root > 0) {
						resultDS += "rootValue: " + currentAttribute.Root + ", ";
					}
					if (viewFields[i].DataSourceView != null) {
						resultDS += "optionDataSource: \"" + viewFields[i].DataSourceView + "\", ";
					}
					if (currentAttribute.LinkFilter != "null") {
						resultDS += "optionCriteria: \"" + currentAttribute.LinkFilter + "\", ";
					}
					if (viewFields[i].ValueField != "null") {
						resultDS += "valueField: \"" + viewFields[i].ValueField + "\", ";
					} else {
						resultDS += "valueField: \"ID\", ";
					}
					if (viewFields[i].DisplayField != "null") {
						resultDS += "displayField: \"" + viewFields[i].DisplayField + "\", ";
					} else {
						resultDS += "displayField: \"Description\", ";
					}
					if (viewFields[i].pickListFields && viewFields[i].pickListFields != null && viewFields[i].pickListFields != "null") {
						resultDS += "pickListFields: " + viewFields[i].pickListFields + ", ";
					}
					if (viewFields[i].PickListWidth > 0) {
						resultDS += "pickListWidth: " + viewFields[i].PickListWidth;
					} else {
						resultDS += "pickListWidth: 450 ";
					}
				} else if (kind === "OneToMany" || kind === "OneToManyAggregate") {
					resultDS += "type: \"custom\", ";
					resultDS += "canSave: true, ";
					resultDS += "editorType: \"" + kind + "\", ";
					resultDS += "relatedConcept: \"" + currentRelation.RelatedConcept + "\", ";
					resultDS += "BackLinkRelation: \"" + currentRelation.BackLinkRelation + "ID\", ";
					resultDS += "mainIDProperty: \"ID\", ";
					resultDS += "showTitle: false";
				} else {
					if (viewFields[i].ControlType != "null") {
						resultDS += "editorType: \"" + viewFields[i].ControlType + "\"";

					}
				}
		}

		resultDS += "},";
	}
	resultDS = resultDS.slice(0, resultDS.length - 1);
	resultDS += "]})";

	// --- Callback for program flow after DS creation
	if (futherActions && futherActions != null) {
		futherActions(resultDS);
	}
}

// --- Function that provide creation of some Isomorphic DataSource (DS) itself 
//     from universal CBM metadata. ---
function createDS(forView, futherActions) {
  // ---DS text generation ---
  generateDStext(forView, function(resultDS) {
    // --- DS creation 
    eval(resultDS);
    // --- Call for program flow after DS creation
    if (futherActions && futherActions != null) {
      futherActions(resultDS);
    }
  })
}

// --- Function that simply tests DS existence, and if absent - creates it/
function testDS(forView, futherActions) {
  if (isc.DataSource.getDataSource(forView)) {
    if (futherActions && futherActions != null) {
      futherActions(null);
    }
  } else {
    createDS(forView, futherActions);
  }
}

// ===================== Universal UI components and UI infrastructure ====================
// ========================================================================================
//========================== CBM custom interface control types ===========================

isc.SimpleType.create({
  name: "currency",
  inheritsFrom: "float",

  normalDisplayFormatter: function(value) {
    return isc.isA.Number(value) ? value.toCurrencyString() : value;
  },
  shortDisplayFormatter: function(value) {
    return isc.isA.Number(value) ? value.toCurrencyString() : value;
  },
  editFormatter: function(value) {
    return isc.isA.Number(value) ? value.toFixed(2) : value;
  },
  parseInput: function(value) {
    var fVal = parseFloat(value);
    if (!isNaN(fVal)) return fVal;
    return value;
  },
  validators: [{
    type: "floatRange",
    min: 0 //,
      //          errorMessage: isc.CBMStrings.MoneyType_NotNegative
  }, {
    type: "floatPrecision",
    precision: 2,
    roundToPrecision: true
  }]

});


// ======================================================================
// =================== Multi-language support section ===================
// --- Set some global-context language-related objects ---
var curr_Lang = isc.Offline.get("LastLang");
var tmp_Lang = curr_Lang;

var langValueMap = {
  "en-GB": "English",
  "cn-CN": "China",
  "jp-JP": "Japan",
  "de-DE": "Germany",
  "fr-FR": "France",
  "ru-RU": "Россия",
  "sp-SP": "Spain",
  "it-IT": "Italy"
};
var langValueIcons = {
  "en-GB": "en-GB",
  "cn-CN": "cn-CN",
  "jp-JP": "jp-JP",
  "de-DE": "de-DE",
  "fr-FR": "fr-FR",
  "ru-RU": "ru-RU",
  "sp-SP": "sp-SP",
  "it-IT": "it-IT"
};
var flagImageURLPrefix = "flags/48/";
var flagImageURLSuffix = ".png";

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
function extractLanguagePart(value, language, strictLang) {
  if (!value || value === "null" || value === null) {
    return null;
  }

  // --- If string is not multi language - return it as is
  if (value.indexOf("~|") == -1) {
    if (!strictLang) {
      return value;
    } else {
      return null; // - ??? (arguable) 
    }
  }
  // --- For multilanguage string - try to find requested language part, 
  // and if not found - returns first part, no matter prefixed by locale  or not.
  // Language prefix are in all cases removed.
  var out = value;
  var i = value.indexOf("~|" + language); // Is there part for  requested locale?
  if (i != -1) { // Locale exists
    var tmp = value.slice(i + 8);
    i = tmp.indexOf("~|", 1);
    if (i != -1) { // The substring is not the last
      out = tmp.substring(0, i);
    } else {
      out = tmp;
    }
  } else if (!strictLang) { // No requested locale - get first. 
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

  normalDisplayFormatter: function(value, field, form, record) {
    return extractLanguagePart(value, tmp_Lang, false);
  },

  shortDisplayFormatter: function(value, field, component, record) {
    return extractLanguagePart(value, tmp_Lang, false);
  },

  editFormatter: function(value, field, form, record) {
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
    var fullValue = field.getValue();
    if (fullValue == null) {
      if (value == null) {
        return null;
      } else {
        return "~|" + field.itemLang + "|" + value;
      }
    }
    var out = fullValue;
    if (value == null) {
      value = "";
    }
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
        if (i == 0) { // Preserve language prefix of first part in all cases
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
  icons: [{
    src: flagImageURLPrefix + tmp_Lang + flagImageURLSuffix,
    showFocused: true,
    showOver: false
  }],

  init: function() {
    this.setProperty("icons", [{
      src: flagImageURLPrefix + tmp_Lang + flagImageURLSuffix,
      showFocused: true,
      showOver: false
    }]);
    return this.Super("init", arguments);
  },

  iconClick: function(form, item, icon) {
    item.showPickList(false, false);
  },

  pickValue: function(lang) {
    switchLanguage(this, this.getValue(), lang);
  }

});

//if (isc.PickList) isc.MultilangTextItem.addMethods(isc.PickList._instanceMethodOverrides);

// --- Language processing for string content ---
var switchLanguage = function(field, value, lang) {
  field.setProperty("icons", [{
    src: flagImageURLPrefix + field.valueIcons[lang] + flagImageURLSuffix,
    showFocused: true,
    showOver: false
  }]);
  field.setProperty("itemLang", lang);
  field.setProperty("strictLang", true);
  // So, while redraw(), item_Lang language part will be extracted an represented.
  field.redraw();
};


// =============================================================================================
// ========================== Grid-related controls infrastructure =============================
// --- Delete selected in grid records in conjunction with delete mode
//  parameter: mode - real deletion, or using "Del" property deletion throw trash bin.
function deleteSelectedRecords(innerGrid, mode) {
	if (mode == "restore") {
		restoreSelectedRecords(innerGrid, mode);
		return;
	}	
  var that = innerGrid;
  var ds = innerGrid.getDataSource(); // <<< TODO: get concrete DS for record 
  isc.confirm(isc.CBMStrings.InnerGridMenu_DeletionPrompt,
    function(ok) {
      if (ok) {
				var n = that.grid.getSelectedRecords().getLength();
        for (var i = 0; i < n; i++) {
          var record = that.grid.getSelectedRecords()[i];
          deleteRecord(record, mode);
        }
        that.refresh();
      }
    }
  );
}

//  parameter: mode - real deletion, or using "Del" property deletion throw trash bin.
function restoreSelectedRecords(innerGrid, mode) {
  var ds = innerGrid.getDataSource(); // <<< TODO: get concrete DS for record 
	var n = innerGrid.grid.getSelectedRecords().getLength();
	for (var i = 0; i < n; i++) {
		var record = innerGrid.grid.getSelectedRecords()[i];
		deleteRecord(record, mode);
	}
	innerGrid.refresh();
}

// --- Context Menu for use in Grids in CBM
var defaultContextMenuData = [{
  icon: isc.Page.getAppImgDir() + "new.png",
  click: function() {
    this.context.editObject("new");
    return false;
  }
}, {
  icon: isc.Page.getAppImgDir() + "CopyOne.png",
  click: function() {
    this.context.editObject("copy");
    return false;
  }
}, {
  icon: isc.Page.getAppImgDir() + "edit.png",
  click: function() {
    this.context.editObject("loaded");
    return false;
  }
}, {
  isSeparator: true
}, {
  click: function() {
    deleteSelectedRecords(this.context.parentElement.parentElement, "delete");
    return false;
  }
}];

var innerGridContextMenu = isc.Menu.create({
  cellHeight: 22,
  setContext: function(cont) {
    this.context = cont;
    defaultContextMenuData[0].title = isc.CBMStrings.InnerGridMenu_CreateNew;
    defaultContextMenuData[1].title = isc.CBMStrings.InnerGridMenu_CopyNew;
    defaultContextMenuData[2].title = isc.CBMStrings.InnerGridMenu_Edit;
    defaultContextMenuData[4].dynamicTitle = "this.context.getDataSource().isDeleteToBin() ? isc.CBMStrings.InnerGridMenu_DeleteToBin : isc.CBMStrings.InnerGridMenu_Delete";
    defaultContextMenuData[4].dynamicIcon = "this.context.getDataSource().isDeleteToBin() ? isc.Page.getAppImgDir() + \"bin.png\" : isc.Page.getAppImgDir() + \"delete.png\"";
    if (typeof(cont.getDataSource().MenuAdditions) != "undefined") {
      this.setData(defaultContextMenuData.concat(cont.getDataSource().MenuAdditions));
    } else {
      this.setData(defaultContextMenuData);
    }
		var n = this.data.getLength();
    for (var i = 0; i < n; i++) {
      this.data[i].context = cont;
    }
  }
});

var binContextMenuData = [{
  icon: isc.Page.getAppImgDir() + "binRestore.png",
  click: function() {
    deleteSelectedRecords(this.context.parentElement.parentElement, "restore");
    return false;
  }
}, {
  isSeparator: true
}, {
  icon: isc.Page.getAppImgDir() + "delete.png",
  click: function() {
    deleteSelectedRecords(this.context.parentElement.parentElement, "deleteForce");
    return false;
  }
}, {
  isSeparator: true
}, {
  icon: isc.Page.getAppImgDir() + "edit.png",
  click: function() {
    this.context.editObject("loaded");
    return false;
  }
}];

var innerGridBinContextMenu = isc.Menu.create({
  cellHeight: 22,
  setContext: function(cont) {
    this.context = cont;
    binContextMenuData[0].title = isc.CBMStrings.InnerGridMenu_Restore;
    binContextMenuData[2].title = isc.CBMStrings.InnerGridMenu_Delete;
    this.setData(binContextMenuData);

		var n = this.data.getLength();
    for (var i = 0; i < n; i++) {
      this.data[i].context = cont;
    }
  }
});

//----------------------------------------------------------------------------------------------------
// --- Grid/Tree control - for represent table of data in standalone Window, 
//     or to embed into DynamicForm as linked list. --------------------------------------------------
isc.ClassFactory.defineClass("InnerGrid", "Canvas");
isc.InnerGrid.addProperties({
  grid: null, // TODO (?) - move from class to instance !!! (???)
  listSettings: null,
  listSettingsExists: true,
  listSettingsChanged: false, // TODO: Determine changes while work
  // listSettingsApplied : false,
  treeRoot: null,
	
	addFilter: function(keyName, criteriaValue, sys){
		this.filters.add(keyName, criteriaValue, sys);
	},
	
	applyFilters: function(callback){
		this.grid.setCriteria(this.filters.getCriteria());
		if (callback !== undefined) {
			callback();
		}
	},
	
  refresh: function() {
    this.grid.invalidateCache();
  },
	
	// ----- Function that adopts isc ListGrid function for use InnerGrid's managed set of filters 
	fetchData: function(callback){
		this.grid.fetchData(this.filters.getCriteria(), callback);
	},

  initWidget: function() {
    this.Super("initWidget", arguments);
    // --- Prepare Fields array to show in grid
    //		testDS(this.dataSource); // Dynamic DS creation if needed
    var ds = this.getDataSource();
    if (!ds) {
      isc.warn(isc.CBMStrings.NoDataSourceDefined);
      return;
    }
    if (!ds.getFields) {
      isc.warn(isc.CBMStrings.NoDataSourceExists + "\"" + ds + "\"");
      return;
    }
    var dsflds = ds.getFieldNames();
    var flds = new Array();
    for (var i = 0; i < dsflds.length; i++) {
			var fld = ds.getField(dsflds[i]);
      if (typeof(fld.inList) != "undefined" && fld.inList === true) {
        //flds.add(parseJSON("{ \"name\":\"" + fld.name + "\"}"));
        flds.add(fld);
      }
      if (typeof(fld.rootValue) != "undefined") {
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
        innerGrid: this,
        viewStateChanged: function() {
          this.parentElement.parentElement.listSettingsChanged = true;
          return false;
        },
        dataArrived: function() {
          this.parentElement.parentElement.setListSettings();
          return true;
        }
      })
    } else {
      this.grid = isc.TreeGrid.create({
        dataSource: this.dataSource,
        useAllDataSourceFields: false,
//        autoFetchData: true,
        keepParentsOnFilter: false, // TODO: Set to "true", but change parent records to Gray
//        keepParentsOnFilter: true, // If true - the in-form tree will crush 
        dataPageSize: 75, // <<< Optimization recomended in actual inherited datasources.
        loadDataOnDemand: false, // !!! If false - treeRootValue won't be set!
        listSettingsApplied: false,
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
        innerGrid: this,
        viewStateChanged: function() {
          this.parentElement.parentElement.listSettingsChanged = true;
          return false;
        },
        dataArrived: function(parentNode) {
            if (!this.listSettingsApplied) {
              this.parentElement.parentElement.setListSettings();
              this.listSettingsApplied = true;
            }
            return true;
          }
          // recordDoubleClick: "this.editObject(\"loaded\"); return false;",
      })
    }
		
		this["filters"] = isc.FilterSet.create(), // TODO: (?) - switch "FilterSet" to simple JS object???
		// By default
		this.addFilter("Del", {"Del": false}, true);
		this.applyFilters();

    this.grid.setFields(flds);
    if (typeof(this.treeRoot) != "undefined") {
      this.grid.treeRootValue = this.treeRoot;
      this.grid.data.rootValue = this.treeRoot;
    }

    // --- Other grid intialisations:
    this.grid.showContextMenu = function() {
      innerGridContextMenu.setContext(this);
      return innerGridContextMenu.showContextMenu();
    };
    //TODO: Menu adjusted to current cell
    //         this.grid.cellContextClick = function (record, row, cell) {
    //       		return this.showContextMenu(); 
    //        };

    this.grid.editObject = function(mode) {
      var ds = this.getDataSource();
      var records = [];
      // --- Edit New record ---
      if (mode == "new") {
        this.selection.deselectAll();
        // TODO If ds is superclass - ask first, and create selected class (ds) instance.
        var dsRecord = conceptRS.find("SysCode", this.dataSource);
        var isSuper = dsRecord["Abstract"];
        if (isSuper) {
          //					var filter = parseJSON("{ \"BaseConcept\" : \"" + dsRecord["ID"] + "\"}");
					// ??? VVV Not used??? VVV TODO........
          var filter = parseJSON("{ \"Abstract\" : \"false\", \"Primitive\" : \"false\" }");

          var newChild = function(record) {
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
							if (criter.hasOwnProperty(fld)) {
								records[0][fld] = criter[fld];
							}
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
						if (criter.hasOwnProperty(fld)) {
							records[0][fld] = criter[fld];
						}
          }
					var that = this;
					editRecords(records, that, conceptRS.find("SysCode", ds.ID));
        }
      }
      // --- Copy Selected record ---
      else if (mode == "copy") {
				records[0] = this.getSelectedRecord();
//        records[0]["infoState"] = "copy"; // <<<<<<<<<<< ???????? Here? Not in cloneInstance() ???
				var that = this;
				var editCopy = function(records) { editRecords(records, that);}
        ds.cloneInstance(records[0], editCopy);
        this.selection.deselectAll();
      }
      // --- Edit Selected record[s] ---
      else if (mode == "loaded") {
        records = this.getSelectedRecords();
        for (var i = 0; i < records.getLength(); i++) {
          records[i]["infoState"] = "loaded";
        }

				if (records != null && records.getLength() > 0) {
					editRecords(records, this);
				} else {
					isc.warn(isc.CBMStrings.InnerGrid_NoSelection);
				}
      }
    };

    // --- Menu structures customisation ---
    var createFromMenuButton = isc.IconMenuButton.create({
      top: 250,
      left: 400,
      width: 82,
      title: "Create from",
      icon: isc.Page.getAppImgDir() + "new.png",
      visibility: "hidden"
    });
    if (typeof(this.getDataSource().CreateFromMethods) != "undefined") {
      var createMenuData = this.getDataSource().CreateFromMethods;
      menuCreate = isc.Menu.create({
        showShadow: true,
        shadowDepth: 10,
        context: this.grid,
        data: createMenuData
      });
      createFromMenuButton.menu = menuCreate;
      createFromMenuButton.show();
    };

    var methodsMenuButton = isc.IconMenuButton.create({
      top: 250,
      left: 400,
      width: 82,
      title: "Specific functions",
      icon: isc.Page.getAppImgDir() + "edit.png",
      visibility: "hidden"
    });
    if (typeof(this.getDataSource().SpecificMethods) != "undefined") {
      var methodsMenuData = this.getDataSource().SpecificMethods;
      menuMethods = isc.Menu.create({
        showShadow: true,
        shadowDepth: 10,
        context: this.grid,
        data: methodsMenuData
      });
      methodsMenuButton.menu = menuMethods;
      methodsMenuButton.show();
    };

    var toContextReturnButton = null;
    if (typeof(this.context) != "undefined" && this.context != null) {
      toContextReturnButton = isc.IconButton.create({
        top: 250,
        width: 25,
        title: "",
        icon: isc.Page.getAppImgDir() + "TickOut.png",
        click: function() {
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
    };

    var innerGridDefaultMenu = [
      toContextReturnButton,
      isc.IconButton.create({
        top: 250,
        width: 25,
        title: "",
        icon: isc.Page.getAppImgDir() + "new.png",
        prompt: isc.CBMStrings.InnerGrid_CreateNew,
        click: function() {
          this.parentElement.parentElement.parentElement.grid.editObject("new");
          return false;
        }
      }),
      isc.IconButton.create({
        top: 250,
        width: 25,
        title: "",
        icon: isc.Page.getAppImgDir() + "CopyOne.png",
        prompt: isc.CBMStrings.InnerGrid_CopyNew,
        hoverWidth: 220,
        click: function() {
          this.parentElement.parentElement.parentElement.grid.editObject("copy");
          return false;
        }
      }),
      createFromMenuButton,
      isc.IconButton.create({
        top: 250,
        width: 25,
        title: "",
        icon: isc.Page.getAppImgDir() + "edit.png",
        prompt: isc.CBMStrings.InnerGrid_Edit,
        hoverWidth: 120,
        click: function() {
          this.parentElement.parentElement.parentElement.grid.editObject("loaded");
          return false;
        }
      }),
      isc.IconButton.create({
        top: 250,
        left: 100,
        width: 25,
        title: "",
        icon: isc.Page.getAppImgDir() + "save.png",
        prompt: isc.CBMStrings.InnerGrid_Save,
        hoverWidth: 170,
        click: "this.parentElement.parentElement.parentElement.grid.saveAllEdits();  return false;"
      }),
      isc.IconMenuButton.create({
        top: 250,
        left: 100,
        width: 25,
        title: "",
        icon: isc.Page.getAppImgDir() + "bin.png",
        prompt: isc.CBMStrings.InnerGrid_DeleteToBin,
        hoverWidth: 130,
        click: function() {
          deleteSelectedRecords(this.parentElement.parentElement.parentElement, "delete");
          return false;
        },
        visibility: (this.getDataSource().isDeleteToBin() ? "inherit" : "hidden"),
        menu: isc.Menu.create({ // TODO: initialize menu here 
          showShadow: true,
          shadowDepth: 10,
          currentInnerGrid: this,
          data: [{
            icon: isc.Page.getAppImgDir() + "binOpen.png",
            title: isc.CBMStrings.InnerGrid_ProcessBinSubMenu,
            click: function(context) {
							context.currentInnerGrid.addFilter("Del", {"Del": true}, true);
							context.currentInnerGrid.applyFilters();
              // Adjust menus to "bin-mode"
              context.currentInnerGrid.grid.contextMenu = innerGridBinContextMenu;
              context.currentInnerGrid.grid.showContextMenu = function() {
                innerGridBinContextMenu.setContext(this);
                return innerGridBinContextMenu.showContextMenu();
              };
              context.currentInnerGrid.menuContainer.setMembers(innerGridBinMenu);
              return false;
            }
          }]
        })
      }),
      isc.IconButton.create({
        top: 250,
        left: 100,
        width: 25,
        title: "",
        icon: isc.Page.getAppImgDir() + "delete.png",
        prompt: isc.CBMStrings.InnerGrid_Delete,
        hoverWidth: 130,
        click: function() {
          deleteSelectedRecords(this.parentElement.parentElement.parentElement, "delete");
          return false;
        },
        visibility: (this.getDataSource().isDeleteToBin() ? "hidden" : "inherit")
      }),
      isc.IconButton.create({
        top: 250,
        left: 200,
        width: 25,
        title: "",
        icon: isc.Page.getAppImgDir() + "refresh.png",
        prompt: isc.CBMStrings.InnerGrid_Reload,
        hoverWidth: 150,
        click: "this.parentElement.parentElement.parentElement.refresh(); return false;"
      }),
      isc.IconButton.create({
        top: 250,
        left: 300,
        width: 25,
        title: "",
        icon: isc.Page.getAppImgDir() + "filter.png",
        prompt: isc.CBMStrings.InnerGrid_AutoFilter,
        click: function() { // TODO: below - sample only!!! 
          grid.filterData(advancedFilter.getCriteria());
          return false;
        }
      }),
      methodsMenuButton
    ];

    var innerGridBinMenu = [
      isc.IconButton.create({
        top: 250,
        width: 25,
        title: "",
        icon: isc.Page.getAppImgDir() + "binClose.png",
        prompt: isc.CBMStrings.InnerGridMenu_ReturnFromBin,
        currentInnerGrid: this,
        click: function(context) {
					this.parentElement.parentElement.parentElement.addFilter("Del", {"Del": false}, true);
					this.parentElement.parentElement.parentElement.applyFilters();
          // Return menus to normal innerGrid mode
          this.parentElement.parentElement.parentElement.grid.contextMenu = innerGridContextMenu;
          this.parentElement.parentElement.parentElement.grid.showContextMenu = function() {
            innerGridContextMenu.setContext(this);
            return innerGridContextMenu.showContextMenu();
          };
          this.parentElement.parentElement.parentElement.menuContainer.setMembers(innerGridDefaultMenu);
          return false;
        }
      }),
      isc.IconButton.create({
        top: 250,
        width: 25,
        title: "",
        icon: isc.Page.getAppImgDir() + "binRestore.png",
        prompt: isc.CBMStrings.InnerGridMenu_Restore,
        hoverWidth: 220,
        click: function() {
          deleteSelectedRecords(this.parentElement.parentElement.parentElement, "restore");
          return false;
        }
      }),
      createFromMenuButton,
      isc.IconButton.create({
        top: 250,
        width: 25,
        title: "",
        icon: isc.Page.getAppImgDir() + "delete.png",
        prompt: isc.CBMStrings.InnerGridMenu_Delete,
        hoverWidth: 120,
        click: function() {
          deleteSelectedRecords(this.parentElement.parentElement.parentElement, "deleteForce");
          return false;
        }
      }),   
			isc.IconButton.create({
        top: 250,
        width: 25,
        title: "",
        icon: isc.Page.getAppImgDir() + "edit.png",
        prompt: isc.CBMStrings.InnerGrid_Edit,
        hoverWidth: 120,
        click: function() {
          this.parentElement.parentElement.parentElement.grid.editObject("loaded");
          return false;
        }
      })
    ];

    // --- InnerGrid layout ---
    var controlLayout = isc.VLayout.create({
      width: "99%",
      height: "99%",
      // width: "*", height: "*", <- Leads to permanent small grid even in List form
      members: [
        isc.HLayout.create({
          width: "100%",
          height: "10",
          layoutMargin: 0
        }),
        this.grid
      ]
    });
    this.addChild(controlLayout);
    this.menuContainer = controlLayout.members[0];
    this.menuContainer.setMembers(innerGridDefaultMenu);
  }, // end initWidget()

  // --- Apply previously stored current user's list settings
  setListSettings: function() {
    this.listSettings = listSettingsRS.find({
      ForUser: curr_User,
      ForType: this.grid.dataSource,
      Win: this.topElement.getClassName(),
      Context: this.topElement.contextString
    });
    if (typeof(this.listSettings) == "undefined" || this.listSettings == null) {
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

  innerCloseNoChoiceDlg: function() {
    if (okClick()) {
      this.topElement.destroy();
    }
  }
	
}); // --- END InnerGrid ---


//----------------------------------------------------------------------------------------------------
// -------------------------------- OneToMany (Back-link) control ------------------------------------------------
isc.ClassFactory.defineClass("OneToMany", "CanvasItem");
isc.OneToMany.addProperties({
  //    height: "*",  width: "*", <- seems the same
  //    height: "88%",  width: "88%", //<- very narrow, but normal hight! (???)
  rowSpan: "*",
  colSpan: "*",
  endRow: true,
  startRow: true,
  shouldSaveValue: true, // Don't switch, or showValue() won't be called

  innerGrid: null,
  BackLinkRelation: null,
  mainIDProperty: null,
  mainID: -1,
	aggregate: false,

  createCanvas: function(form) {
    this.innerGrid = isc.InnerGrid.create({
      autoDraw: false,
    //width: "100%", height: "80%", <- Bad experience: If so, inner grid will not resize
      width: "*", height: "*",
      dataSource: this.relatedConcept
    });
    this.innerGrid.grid.showFilterEditor = false;
    return this.innerGrid;
  },

  showValue: function(displayValue, dataValue, form, item) {
		// Lightweight variant - data are supplied
		if (dataValue && dataValue.length > 0) {
			this.innerGrid.grid.setData(dataValue);
		} else { // Data not supplied - get it from Storage
			if (typeof(form.valuesManager) != "undefined" && form.valuesManager != null) {
				this.mainID = form.valuesManager.getValue(this.mainIDProperty);
				if (typeof(this.mainID) != "undefined") {
					var filterString = "{\"" + this.BackLinkRelation + "\" : \"" + this.mainID + "\"}";
					this.innerGrid.addFilter("BackLink", parseJSON(filterString), true);
				} 
			}
			this.innerGrid.fetchData(function(dsResponse, data, dsRequest) {
					if (typeof(this.getDataSource) == "undefined") {
						if (!this.hasAllData()) {
							this.setCacheData(data);
						}
					} else {
						if (!this.getDataSource().hasAllData()) {
							this.getDataSource().setCacheData(data);
						}
					}
				}
			);
		}
  }
}); // <<< End OneToMany (Back-link) control

// -------------------------------- OneToMany aggregate control (direct collection control) ------------------------------------------------
isc.ClassFactory.defineClass("OneToManyAggregate", "OneToMany");
isc.OneToManyAggregate.addProperties({
  //    height: "*",  width: "*", <- seems the same
  //    height: "88%",  width: "88%", //<- very narrow, but normal hight! (???)
  rowSpan: "*",
  colSpan: "*",
  endRow: true,
  startRow: true,
  shouldSaveValue: true, // Don't switch, or showValue() won't be called

  innerGrid: null,
  BackLinkRelation: null,
  mainIDProperty: null,
  mainID: -1,
  aggregate: true, // <<<<<<<<<<<<<<<<
  createCanvas: function(form) {
    this.innerGrid = isc.InnerGrid.create({
      autoDraw: false,
    //width: "100%", height: "80%", <- Bad experience: If so, inner grid will not resize
      width: "*", height: "*",
      dataSource: this.relatedConcept
    });
    this.innerGrid.grid.showFilterEditor = false;
		this.innerGrid.grid.dependent = true;  // <<<<<<<<<<<<<<<<
    return this.innerGrid;
  },
	
  showValue: function(displayValue, dataValue, form, item) {
		// Lightweight variant - data are supplied
		if (dataValue && dataValue.length > 0) {
			this.innerGrid.grid.setData(dataValue);
		} else { // Data not supplied - get it from Storage
			if (typeof(form.valuesManager) != "undefined" && form.valuesManager != null) {
				this.mainID = form.valuesManager.getValue(this.mainIDProperty);
				if (typeof(this.mainID) != "undefined") {
					var filterString = "{\"" + this.BackLinkRelation + "\" : \"" + this.mainID + "\"}";
					this.innerGrid.addFilter("BackLink", parseJSON(filterString), true);
				} 
			}
			this.innerGrid.fetchData(function(dsResponse, data, dsRequest) {
					if (typeof(this.getDataSource) == "undefined") {
						if (!this.hasAllData()) {
							this.setCacheData(data);
						}
					} else {
						if (!this.getDataSource().hasAllData()) {
							this.getDataSource().setCacheData(data);
						}
					}
				}
			);
		}
  }
	
}); // <<< End One-To-Many aggregate control (direct collection control).
/*isc.ClassFactory.defineClass("OneToManyAggregate", "OneToMany");
isc.OneToManyAggregate.addProperties({
	aggregate: true,
	
  createCanvas: function(form) {
		var grid = this.Super("createCanvas", arguments);
		this.innerGrid.grid.dependent = true;
		return grid;
  },
	
}); // <<< End One-To-Many aggregate control (direct collection control).
*/

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
  width: 700,
  height: 500,
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
  setPosition: function() {
    this.winPos = windowSettingsRS.find({
      ForUser: curr_User,
      ForType: this.dataSource,
      Win: this.getClassName(),
      Context: this.contextString
    });
    if (typeof(this.winPos) == "undefined" || this.winPos == null) {
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

  savePosition: function() {
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
  initWidget: function() {
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

    var titleDS = this.getDataSource().title;
    this.title = (titleDS ? titleDS : this.dataSource) + isc.CBMStrings.TableWindow_Title;

    this.setPosition();
  },

  onCloseClick: function() {
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
    var table = isc.TableWindow.create({
      dataSource: forType,
      context: context,
      callback: callback,
      treeRoot: rootIdValue
    });

    if (rootIdValue){
    table.innerGrid.treeRoot = rootIdValue;
    }

    // TODO here - add previous stored Filters if any
    //		filter = {Del:false};
    if (typeof(filter) != "undefined" && filter != null) {
      filter = this.getDataSource.combineCriteria(filter, table.innerGrid.grid.getCriteria());
      table.innerGrid.grid.setCriteria(filter);
    } else {
      filter = table.innerGrid.grid.getCriteria();
    }
    table.innerGrid.grid.fetchData(filter, function(dsResponse, data, dsRequest) {
      if (typeof(this.getDataSource) == "undefined") {
        if (!this.hasAllData()) {
          this.setCacheData(data);
        }
      } else {
        if (!this.getDataSource().hasAllData()) {
          this.getDataSource().setCacheData(data);
        }
      }
    });
    table.show();
  	return table;
};


// ==================== CBM Form View Infrastructure ========================

isc.ClassFactory.defineClass("InnerForm", isc.DynamicForm);
isc.InnerForm.addProperties({
  //    width: "89%", height: "89%", <- Some narrow width, NO affected height!
  width: "100%",
  height: "100%",
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
  width: "*",
  height: "*",
  autoSize: true,

  //    title: "  instance ",
  bodyColor: "#DBF5E9", //"#DDFFEE", //"#D9F9E9", //"#D9F7E9", 

  initWidget: function() {
    this.Super("initWidget", arguments);
    this.addItems(
      [
        this.content
      ]);
    if (this.valuesManager != null) {
      //			testDS(this.valuesManager.dataSource.ID);
      this.dataSource = this.valuesManager.dataSource.ID;
      // TODO: Add object description in window head
      var titleDS = this.getDataSource().title;
      this.title = (titleDS ? titleDS : this.dataSource); // + isc.CBMStrings.FormWindow_Title;
    }
    this.setPosition();
  },

  // Destroy with delay (for example to let callback to do it's work) 
  destroyLater: function(win, delay) {
    if (delay == 0 || delay == null) {
      delay = 100;
    }
		isc.Timer.setTimeout(win.destroy(), delay);
    // var destroyInner = function() {
      // win.destroy();
    // };
    // isc.Timer.setTimeout(destroyInner, delay);
  }
});

// ================================ The End =================================