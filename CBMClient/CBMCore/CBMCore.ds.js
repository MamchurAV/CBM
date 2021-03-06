﻿//======================= Technological DataSources ===========================
isc.CBMDataSource.create({
  ID: "UserRights",
  fields: [{
    name: "ForUser",
    type: "text",
    title: "For User",
    length: 200
  }, {
    name: "ForResource",
    type: "text",
    title: "ForType",
    length: 200
  }, {
    name: "ActionType",
    type: "text",
    title: "Action",
    valueMap: ["Read", "Insert", "Update", "Delete"],
    editorType: "select",
    length: 200
  }, {
    name: "Creteria",
    type: "text",
    title: "Creteria",
    colSpan: 4,
    length: 2000
  }, {
    name: "FromFuncBlock",
    type: "text",
    title: "Inherited from Functinal block(s)",
    length: 2000
  }]
});

isc.CBMDataSource.create({
  ID: "WindowSettings",
  fields: [{
    name: "ForType",
    type: "text",
    title: "Type"
  }, {
    name: "Win",
    type: "text",
    title: "Win",
    length: 200
  }, {
    name: "Context",
    type: "text",
    title: "Context",
    length: 200
  }, {
    name: "ForUser",
    type: "text",
    title: "For User"
  }, {
    name: "Position",
    type: "text",
    title: "Position in JSON"
  }, {
    name: "T",
    type: "integer",
    ignore: true,
    length: 100,
    defaultValue: 10
  }, {
    name: "L",
    type: "integer",
    ignore: true,
    defaultValue: 10
  }, {
    name: "H",
    type: "integer",
    ignore: true,
    defaultValue: 200
  }, {
    name: "W",
    type: "integer",
    ignore: true,
    defaultValue: 100
  }]
});

isc.CBMDataSource.create({
  ID: "ListSettings",
  fields: [{
    name: "ForType",
    type: "text",
    title: "Type"
  }, {
    name: "Win",
    type: "text",
    title: "Win",
    length: 200
  }, {
    name: "Context",
    type: "text",
    title: "Context",
    length: 200
  }, {
    name: "ForUser",
    type: "text",
    title: "For User"
  }, {
    name: "Settings",
    type: "TreeGridViewState",
    title: "Settings of List"
  }]
});


// ----- Concept DS ----------------------------
isc.CBMDataSource.create({
  ID: "Concept",
  title: "Concept",
  titleField: "SysCode",
  infoField: "Description",
  isHierarchy: true,
//	cacheAllData: true, 
  // canExpandRecords: true,
  // expansionMode: "related",
  // detailDS: "Relation",

  MenuAdditions: [{
    isSeparator: true
    }, {
      title: "Objects of this Concept",
      icon: isc.Page.getAppImgDir() + "view.png",
      click: function () {
        var ds = this.context.getSelectedRecord()["SysCode"];	
        if (ds) {
          createTable(ds);
        }
        return false;
      },
    }, {
      title: "Migrate to other known CBM instance",
      icon: isc.Page.getAppImgDir() + "copyOne.png",
      click: "exportConcept(this.context.getSelectedRecord())"
    }, {
      title: "Export to file for migration",
      icon: isc.Page.getAppImgDir() + "download.png",
      click: "exportConcept(this.context.getSelectedRecord())"
    }, {
      title: "Generate default Program View",
      icon: isc.Page.getAppImgDir() + "add.png",
      click: "sendCommand(\"GenerateDefaultView\", \"POST\", {forType: this.context.getSelectedRecord()[\"SysCode\"]}, null ); return false;"
    }
  ],

  // Returns (by callback call!) relations for current concept, with merged parents hierarchy's relations.
  // TODO: Replace with common-scope function
/*  getRelations: function (relId, afterDataGot) {
    that = this;
    var relations = [];
    relations.setSort({property:"Odr", direction:"ascending"} );
    var inherited = false;
    function innerGetRelations(relId, afterDataGot) {
      if (that.hasAllData()) {
        var record = that.getCacheData().find({ID: relId});
        var relationsToThis = isc.DataSource.get("Relation").getCacheData().findAll({ForConcept: relId});
        var i = 0;
        if (relationsToThis !== null) {
          for (i; i < relationsToThis.length; i++) {
            var exists = false;
            for (j = 0; j < relations.length; j++) {
              if (relations[j].SysCode === relationsToThis[i].SysCode) {
                exists = true;
              }
            }
            if (!exists) {
      	  	  relationsToThis[i]._inherited = inherited;
              relations.add(relationsToThis[i]);
            }
          }
        }
      }
      if (record.BaseConcept && record.BaseConcept !== "null") {
      	inherited = true;  
        innerGetRelations(record.BaseConcept, afterDataGot);
      } else {
//        return afterDataGot(relations.setSort({property:"Odr", direction:"ascending", context: this.grid} ));
        return afterDataGot(relations.sortByProperty("Odr", true));
      }
    }

    innerGetRelations(relId, afterDataGot);
  }, 
*/
  beforeCopy: function (record) {
    record.SysCode = record.SysCode + " (copy! - must modify!)";
    return record;
  },

// 	afterCopy: function(record, callback) {
// 		// --- Attributes to Class pointer ---
// 		var prgClass;
// 		var relations;
// //		var relationDSCache = window.relationRS.allRows;
// 		var relationDSCache = isc.DataSource.get("Relation").getCacheData();
// 		var attribute;
// 		// -- Get collections objects --
// 		prgClass = isc.DataSource.get("PrgClass").getCacheData().find({ForConcept: record.ID, Actual: true});
// //		prgClass = window.classRS.allRows.find({ForConcept: record.ID, Actual: true});
// 		relations = relationDSCache.findAll({ForConcept: record.ID});
// 		// -- Data repairing cycle --
// 		if (relations && prgClass) {
// 			for (var i = 0; i<relations.length; i++){
//       attribute = isc.DataSource.get("PrgAttribute").getCacheData().find({ForRelation : relations[i].ID});
// //			attribute = window.attributeRS.find({ForRelation : relations[i].ID});
// 				if (attribute) {
// 					attribute.ForPrgClass = prgClass.ID; // <<< PrgClass link substitute
// 					updateDataInCache(attribute);
// 				}
// 			}
// 		}
// 		// --- Fields to Relation pointer ---
// 		var prgView;
// 		var prgViewFields;
// 		// -- Get collections objects --
//     prgView = isc.DataSource.get("PrgView").getCacheData().find({ForConcept: record.ID, Role: "Default"});
// //		prgView = window.viewRS.find({ForConcept: record.ID, Role: "Default"});
// 		if (prgView) {
// 		  prgViewFields = isc.DataSource.get("PrgViewField").getCacheData().findAll("ForPrgView", prgView.ID);
// 		//	prgViewFields = window.viewFieldRS.findAll("ForPrgView", prgView.ID);
// 			if (prgViewFields) {
// 				for (var i = 0; i<prgViewFields.length; i++) {
// 					var relationOld = relationDSCache.find({ID : prgViewFields[i].ForRelation});
// 					if (relationOld) {
// 						var relationCurrent = relationDSCache.find({SysCode: relationOld.SysCode, ForConcept: record.ID});
// 					}
// 					if (relationCurrent) {
// 						prgViewFields[i].ForRelation = relationCurrent.ID; // <<< Relation link substitute
// 						updateDataInCache(prgViewFields[i]);
// 					}
// 				}
// 			}
// 		}
// 		if (callback) {
// 			callback([record]);
// 		}
// 	},

  fields: [{
    name: "Del",
    type: "boolean",
    defaultValue: false,
    hidden: true
  }, {
    name: "Concept",
    type: "text",
    defaultValue: "Concept",
    hidden: true
  }, {
    name: "SysCode",
    type: "text",
    title: "System Code",
    length: 200,
    required: true,
    inList: true
  }, {
    name: "Description",
    type: "multiLangText",
    title: "Description",
    inList: true
  }, {
    name: "Notes",
    type: "multiLangText",
    title: "Notes",
    inList: true
  }, {
    name: "BaseConcept",
    type: "Concept",
    title: "Base Concept",
    foreignKey: "Concept.ID",
    rootValue: "null",
    editorType: "LinkControl",
    optionDataSource: "Concept",
    valueField: "ID",
    displayField: "SysCode",
    emptyMenuMessage: "No Sub Classes",
    canSelectParentItems: true,
    pickListWidth: 450,
    pickListFields: [{
      name: "SysCode"
    }, {
      name: "Description"
    }],
    pickListProperties: {
      loadDataOnDemand: false,
      canHover: true,
      showHover: true,
      cellHoverHTML: function (record) {
        return record.SysCode ? record.SysCode : "[no Code]";
      }
    },
    changed: function () {
      var fld = this;
      var frm = this.form;
      var currDS = isc.DataSource.getDataSource(this.form.dataSource.ID);
      if (currDS.cacheAllData) {
        var parRecord = currDS.getCacheData().find({
          "ID": (this.form.values["BaseConcept"])
        });
        var newCode = parRecord.HierCode + "," + this.getValue();
        frm.setValue("HierCode", newCode);
      } else {
        currDS.fetchData({"ID": (frm.values.Parent)},
          function (dsResponce, data) {
            if (data && data.length === 1) {
              var newCode = data[0].HierCode + ", " + fld.getValue();
              frm.setValue("HierCode", newCode);
            }
          });
      }
    }
  }, {
    name: "HierCode",
    type: "text",
    title: "Hirarchy Root",
  //  hidden: true,
    length: 2367
  }, {
    name: "Primitive",
    type: "boolean",
    defaultValue: false,
    title: "Primitive Type"
  }, {
    name: "Abstract",
    type: "boolean",
    defaultValue: false,
    title: "Abstract class"
  }, {
    name: "AbnormalInherit",
    type: "boolean",
    defaultValue: false,
    title: "Abnormal Inheritance"
  }, {
    name: "Source",
    type: "PrgComponent", // TODO : Substitute with Party DS when possible
    title: "Source (author) of Concept",
    foreignKey: "Concept.ID",
    editorType: "LinkControl"
//        editorType: "comboBox" // ,
    // optionDataSource : "Party",
    // valueField : "ID",
    // displayField : "Description",
    // emptyMenuMessage : "No Author",
    // pickListWidth : 450,
    // pickListFields : [ {
    // name : "ID",
    // width : 30
    // }, {
    // name : "Description"
    // }
    //]
  }, {
    name: "Relations",
    type: "Relation",
    title: "Свойства",
//      canSave: false, // ??????????????????????
    canSave: true,
    editorType: "RelationsAggregateControl", //"CollectionAggregateControl",
    relatedConcept: "Relation",
    backLinkRelation: "ForConcept",
    mainIDProperty: "ID",
    kind: "BackAggregate",
    copyLinked: true,
    deleteLinked: true,
    showTitle: true, //,
    titleOrientation: "top",
    colSpan: 6,
    endRow: true,
    startRow: true
//        UIPath: "Properties"
  }, {
    name: "Actual",
    type: "ConceptActuality",
    defaultValue: "Actual",
    inList: true,
    UIPath: "Information System aspects"
  }, {
    name: "PrgVersion",
    type: "PrgVersion",
    title: "Version",
    foreignKey: "PrgVersion.ID",
    editorType: "LinkControl", //"comboBox",
    optionDataSource: "PrgVersion",
    valueField: "ID",
    displayField: "SysCode",
    pickListWidth: 450,
    pickListFields: [{
      name: "ID",
      width: 30
    }, {
      name: "SysCode"
    }, {
      name: "Description"
    }],
    inList: true,
    UIPath: "Information System aspects"
  },
    /* TODO: Investigate why includeFrom does not work {
     name: "VersCode",
     includeFrom: "PrgVersion.SysCode",
     title: "Version Code",
     inList: true
     }, */
    {
      name: "PrgNotes",
      type: "multiLangText",
      inList: true,
      UIPath: "Information System aspects"
    }, {
      name: "ExprToString",
      type: "text",
      UIPath: "Information System aspects",
	  colSpan: 2
    }, {
      name: "ExprToStringDetailed",
      type: "text",
      UIPath: "Information System aspects",
	  colSpan: 2
    }, {
      name: "ExprFrom",
      type: "text",
      UIPath: "Information System aspects",
	  colSpan: 5
    }, {
      name: "ExprWhere",
      type: "text",
      UIPath: "Information System aspects",
	  colSpan: 5
    }, {
      name: "ExprOrder",
      type: "text",
      UIPath: "Information System aspects"
    }, {
      name: "ExprGroup",
      type: "text",
      UIPath: "Information System aspects"
    }, {
      name: "ExprHaving",
      type: "text",
      UIPath: "Information System aspects"
    }, {
      name: "PrgPackage",
      type: "text",
      UIPath: "Information System aspects"
    }, {
      name: "PrgType",
      type: "text",
      UIPath: "Information System aspects"
    }, {
      name: "IsHierarchy",
      type: "boolean",
      defaultValue: false,
      title: "Hierarchical",
      UIPath: "Information System aspects"
    }, {
      name: "Views",
      type: "PrgView",
      title: "Interface presentations",
      canSave: true,
      kind: "BackAggregate",
      copyLinked: true,
      copyFilter: ", \"Role\":\"Default\"", // Copied only default View
      deleteLinked: true,
      editorType: "CollectionAggregateControl",
      relatedConcept: "PrgView",
      backLinkRelation: "ForConcept",
      mainIDProperty: "ID",
      showTitle: true,
      titleOrientation: "top",
      colSpan: 6,
      UIPath: "Information System aspects"
    }, {
      name: "DataLocations",
      kind: "BackAggregate",
      type: "DataLocation",
      title: "DataBase Store",
      canSave: true,
      copyLinked: true,
      deleteLinked: true,
      editorType: "CollectionAggregateControl",
      relatedConcept: "DataLocation",
      backLinkRelation: "ForConcept",
      mainIDProperty: "ID",
      showTitle: true,
      titleOrientation: "top",
      colSpan: 6,
      UIPath: "Information System aspects"
    }, {
      name: "MenuAdditions",
      type: "text",
      UIPath: "Functions",
      titleOrientation: "top",
      colSpan: 6,
      length: 4000
    }, {
      name: "CreateFromMethods",
      type: "text",
      UIPath: "Functions",
      titleOrientation: "top",
      colSpan: 6,
      length: 4000
    }, {
      name: "Functions",
      type: "PrgFunction",
      canSave: true,
      editorType: "CollectionAggregateControl",
      copyLinked: true,
      deleteLinked: true,
      relatedConcept: "PrgFunction",
      backLinkRelation: "ForConcept",
      mainIDProperty: "ID",
      showTitle: false,
      UIPath: "Functions"
    }]
});


isc.DataSource.create({
  ID: "ConceptActuality",
  titleField: "SysCode",
  infoField: "Description",
  clientOnly: true,
  fields: [{
    name: "SysCode",
    type: "text",
    primaryKey: true,
    title: "Code"
  }, {
    name: "Description",
    type: "multiLangText",
    title: "Description"
  }],
  testData: [{
    SysCode: 'Actual',
    Description: 'Used for common purposes'
  }, {
    SysCode: 'Draft',
    Description: 'In construction or review'
  }, {
    SysCode: 'Obsolete',
    Description: 'Not used more'
  }]
});

// --- Functions (methods) and even functional blocks for Conjcept
isc.CBMDataSource.create({
  ID: "PrgFunction",
  cacheAllData: true, // <<<<
  titleField: "SysCode",
  infoField: "Description",
  fields: [{
    name: "Del",
    type: "boolean",
    defaultValue: false,
    hidden: true
  }, {
    name: "Concept",
    type: "text",
    defaultValue: "PrgFunction",
    hidden: true
  }, {
    name: "SysCode",
    type: "text",
    title: "Function name",
    length: 200,
    required: true,
    inList: true
  }, {
    name: "ForConcept",
    type: "Concept",
    title: "Belongs to Concept",
    editorType: "LinkControl",
    optionDataSource: "Concept",
    valueField: "ID",
    displayField: "SysCode",
    pickListWidth: 450,
    pickListFields: [{
      name: "SysCode"
    }, {
      name: "Description"
    }],
    required: true,
    inList: true
  }, {
    name: "Description",
    type: "multiLangText",
    title: "Function Description",
    titleOrientation: "top",
    colSpan: 2,
    length: 2000,
    inList: true
  }, {
    name: "CodeBlock",
    type: "text",
    colSpan: 3,
    length: 4000
  }]
});


isc.CBMDataSource.create({
  ID: "PrgVersion",
  titleField: "SysCode",
  infoField: "Description",
  fields: [{
    name: "Del",
    type: "boolean",
    defaultValue: false,
    hidden: true
  }, {
    name: "Concept",
    type: "text",
    defaultValue: "PrgVersion",
    hidden: true
  }, {
    name: "SysCode",
    type: "text",
    title: "Code of Version",
    length: 200,
    required: true,
    inList: true
  }, {
    name: "Description",
    type: "multiLangText",
    title: "Description of Version",
    titleOrientation: "top",
    colSpan: 2,
    length: 2000,
    inList: true
  }, {
    name: "Owner",
    type: "text",
    title: "Who owns this Version",
    editorType: "LinkControl",
    optionDataSource: "Party",
    valueField: "ID",
    displayField: "Description",
    inList: true
  }, {
    name: "DateMark",
    type: "Date",
    title: "Date associated with Version",
    inList: true
  }, {
    name: "Actual",
    type: "boolean",
    defaultValue: true,
    title: "Is Actual",
    inList: true
  }, {
    name: "ExprFilter",
    type: "text",
    title: "Selection criteria for this Version concepts filtering",
    titleOrientation: "top",
    colSpan: 2,
    length: 4000
  }]
});
// VVV TODO VVV Drop or make static DataSource, DataLocation and DataField DS-es.
isc.CBMDataSource.create({
  ID: "DBStorage",
  titleField: "SysCode",
  infoField: "Description",
  fields: [{
    name: "Del",
    type: "boolean",
    defaultValue: false,
    hidden: true
  }, {
    name: "Concept",
    type: "text",
    defaultValue: "DBStorage",
    hidden: true
  }, {
    name: "SysCode",
    type: "text",
    title: "Code",
    length: 200,
    required: true,
    inList: true
  }, {
    name: "Description",
    type: "multiLangText",
    title: "DataBase Store description",
    length: 400,
    inList: true
  }, {
    name: "DriverType",
    type: "text",
    title: "DataBase driver signature",
    length: 400
  }, {
    name: "ConnectionParams",
    type: "text",
    title: "DataBase connection parameters",
    titleOrientation: "top",
    colSpan: 2,
    length: 1000
  }]
});


// ----- Relation group ----------------------------
isc.CBMDataSource.create({
  ID: "Relation",
//  	cacheAllData: true, 
  titleField: "SysCode",
  infoField: "Description",

  fields: [{
    name: "Del",
    type: "boolean",
    defaultValue: false,
    hidden: true
  }, {
    name: "Concept",
    type: "text",
    defaultValue: "Relation",
    hidden: true
  }, {
    name: "Odr",
    type: "integer",
    title: "Sequence",
    length: 100,
    inList: true
  }, {
    name: "SysCode",
    type: "text",
    title: "Code Sys",
    length: 200,
    required: true,
    inList: true
  }, {
    name: "Description",
    type: "multiLangText",
    title: "Description",
    titleOrientation: "top",
    colSpan: 2,
    length: 250,
    inList: true
  }, {
    name: "ForConcept",
    type: "Concept",
    title: "Belongs to Concept",
    required: true,
    foreignKey: "Concept.ID",
    editorType: "LinkControl",
    optionDataSource: "Concept",
    valueField: "ID",
    displayField: "SysCode",
    pickListWidth: 450,
    pickListFields: [{
      name: "SysCode",
      width: 100
    }, {
      name: "Description"
    }],
    inList: true,
    //hidden: true
  }, { // VVVVVVVVVVVV  Does ForConceptSysCode used for any purpose?
    name: "ForConceptSysCode",
    type: "text",
    title: "Belongs to Concept (string Code)",
    length: 100,
    hidden: true
  }, {
    // Property provide very imortant (in most cases ignored) aspect
    // of Semantic meaning of Relation.
    // In other words, it's relation's self-type, that allows to make assamptions
    // on relations meaning and similarity between different Concepts.
    // It adds more strength to Relation's names similarity between Concepts.
    name: "RelationRole",
    type: "Concept",
    title: "Semantic meaning of Relation",
    foreignKey: "Concept.ID",
    editorType: "LinkControl",
    optionDataSource: "Concept",
    valueField: "ID",
    displayField: "SysCode",
    pickListWidth: 450,
    pickListFields: [{
      name: "SysCode",
      width: 100
    }, {
      name: "Description"
    }]
  }, {
    name: "RelatedConcept",
    type: "Concept",
    title: "Relation value Type",
    foreignKey: "Concept.ID",
    editorType: "LinkControl",
    required: true,
    optionDataSource: "Concept",
    valueField: "ID",
    displayField: "SysCode",
    pickListWidth: 450,
    pickListFields: [{
      name: "SysCode",
      width: 100
    }, {
      name: "Description"
    }],
    inList: true
  }, {
    name: "RelationKind",
    type: "RelationKind",
    title: "Relation Kind",
    foreignKey: "RelationKind.SysCode",
    editorType: "LinkControl",
    required: true,
    optionDataSource: "RelationKind",
    valueField: "SysCode",
    displayField: "SysCode",
    pickListWidth: 550,
    pickListFields: [{
      name: "SysCode",
      width: 100
    }, {
      name: "Description",
      width: 450
    }],
    inList: true
  }, {
    name: "Countable",
    type: "boolean",
    defaultValue: false,
    title: "Countable"
  }, {
    name: "Domain",
    type: "text",
    title: "Domain restrictions",
    titleOrientation: "top",
    colSpan: 2,
    length: 250
  }, {
    name: "BackLinkRelation",
    type: "Relation",
    title: "Relation from back-linked concept",
    foreignKey: "Relation.ID",
    editorType: "LinkControl",
    optionDataSource: "Relation",
    valueField: "ID",
    displayField: "SysCode",
    pickListWidth: 550,
    pickListFields: [{
      name: "ForConcept"
    }, {
      name: "SysCode"
    }, {
      name: "Description"
    }]
  }, {
    name: "IsPublic",
    type: "boolean",
    defaultValue: true,
    title: "IsPublic"
  }, {
    name: "CrossConcept",
    type: "Concept",
    title: "Many-to-many concept",
    foreignKey: "Concept.ID",
    editorType: "LinkControl",
    optionDataSource: "Concept",
    valueField: "ID",
    displayField: "SysCode",
    pickListWidth: 450,
    pickListFields: [{
      name: "SysCode",
      width: 100
    }, {
      name: "Description"
    }]
  }, {
    name: "CrossRelation",
    type: "Relation",
    title: "Relation from many-to-many to end-point concept",
    foreignKey: "Relation.ID",
    editorType: "LinkControl",
    optionDataSource: "Relation",
    valueField: "ID",
    displayField: "SysCode",
    pickListWidth: 550,
    pickListFields: [{
      name: "ForConcept"
    }, {
      name: "SysCode"
    }, {
      name: "Description"
    }]
  }, {
    name: "HierarchyLink",
    type: "boolean",
    defaultValue: false,
    title: "Is Hierarchy-like Link (not necessary self-link!)"
  }, {
    name: "Notes",
    type: "multiLangText",
    title: "Notes",
    titleOrientation: "top",
    colSpan: 6,
    length: 2000
  }, {
    name: "PrgNotes",
    type: "multiLangText",
    title: "IS notes",
    inList: true,
    UIPath: "Information System aspects"
  }, {
    name: "Mandatory",
    type: "boolean",
    defaultValue: false,
    title: "Mandatory",
    UIPath: "Information System aspects"
  }, {
    name: "Const",
    type: "boolean",
    defaultValue: false,
    title: "Constant",
    UIPath: "Information System aspects"
  }, {
    name: "LinkFilter",
    type: "text",
    title: "Filter for list of choices for link",
    titleOrientation: "top",
    colSpan: 2,
    length: 4000,
    UIPath: "Information System aspects"
  }, {
    name: "CrossLinkFilter",
    type: "text",
    title: "Filter for list of choices for cross-link",
    titleOrientation: "top",
    colSpan: 2,
    length: 4000,
    UIPath: "Information System aspects"
  }, {
    name: "ExprEval",
    type: "text",
    title: "Expression to get attribute value",
    titleOrientation: "top",
    colSpan: 2,
    length: 4000,
    UIPath: "Information System aspects"
  }, {
    name: "ExprDefault",
    type: "text",
    title: "Expression for initial value",
    titleOrientation: "top",
    colSpan: 2,
    length: 2000,
    UIPath: "Information System aspects",
    inList: true
  }, {
    name: "ExprValidate",
    type: "text",
    title: "Expression to check value legitimity",
    titleOrientation: "top",
    colSpan: 2,
    length: 2000,
    UIPath: "Information System aspects"
  }, {
    name: "ExprFunctions",
    type: "text",
    title: "Funtions in context of attribute",
    titleOrientation: "top",
    colSpan: 2,
    length: 4000,
    UIPath: "Information System aspects"
  }, {
    name: "CopyValue",
    type: "boolean",
    defaultValue: true,
    title: "Copy Value",
    UIPath: "Information System aspects"
  }, {
    name: "CopyLinked",
    type: "boolean",
    defaultValue: false,
    title: "Copy Linked",
    UIPath: "Information System aspects"
  }, {
    name: "DeleteLinked",
    type: "boolean",
    defaultValue: false,
    title: "Delete Linked",
    UIPath: "Information System aspects"
  }, {
    name: "CopyFilter",///////////////////////
    type: "text",
    title: "Filter for records to be copied",
    UIPath: "Information System aspects"
  }, {
    name: "Root",
    type: "text", //TODO - switch to object link here
    title: "Root item",
    UIPath: "Information System aspects"
    //          foreignKey: "??????.ID",
    //          editorType: "LinkControl",
    //          optionDataSource: "Concept", //TODO - switch to object link here
    //          valueField: "ID",
    //          displayField: "Description",
    //          pickListWidth: 450
  }, {
    name: "Size",
    type: "integer",
    defaultValue: 0,
    UIPath: "Information System aspects"
  }, {
    name: "DBTable",
    type: "text",
    inList: true,
    UIPath: "Information System aspects"
  }, {
    name: "Historical",
    type: "boolean",
    defaultValue: false,
    title: "Historical",
    UIPath: "Information System aspects"
  }, {
    name: "Versioned",
    type: "boolean",
    defaultValue: false,
    title: "Versioned",
    UIPath: "Information System aspects"
  }, {
    name: "DBColumn",
    type: "text",
    inList: true,
    UIPath: "Information System aspects"
  }, {
    name: "RelationStructRole",
    type: "text",
    valueMap: [null, "ID", "ChildID", "MainID"],
    editorType: "select",
    UIPath: "Information System aspects"
  }, {
    name: "VersPart",
    type: "text",
    title: "Version Part Code in which this field are placed",
    length: 120,
    UIPath: "Information System aspects"
  }, {
    name: "MainPartID",
    type: "text",
    title: "Field in the version Part that points to Main Part",
    length: 120,
    UIPath: "Information System aspects"
  }
  ],
  // --- Additional settings for
  edit: function (record, context) {
    // TODO : change to metadata - provided Filter
    this.fields["BackLinkRelation"].optionCriteria = {
      ForConcept: record["RelatedConcept"]
    };
    this.fields["CrossRelation"].optionCriteria = {
      ForConcept: record["RelatedConcept"]
    };
    this.Super("edit", arguments);
  }

});


isc.DataSource.create({
  ID: "RelationKind",
  titleField: "SysCode",
  infoField: "Description",
  clientOnly: true,
  fields: [{
    name: "SysCode",
    type: "text",
    primaryKey: true,
    title: "Code"
  }, {
    name: "Description",
    type: "multiLangText",
    title: "Description"
  }],
  testData: [{
    SysCode: 'Value',
    Description: 'By-value included instance. Usually of primitive type'
  }, {
    SysCode: 'Link',
    Description: 'Many-to-One - simple relation by direct pointer to some other instance'
  }, {
    SysCode: 'BackLink',
    Description: 'One-to-Many association. Aggregated by back-link entity - the most usual case (default meaning) for back-linked things'
  }, {
    SysCode: 'Aggregate',
    Description: 'One-to-One direct-linked association with strong dependency, even edited inside prime object'
  }, {
    SysCode: 'BackAggregate',
    Description: 'One-to-Many back-linked association with strong dependency, even edited inside prime object'
  }, {
    SysCode: 'CrossLink',
    Description: 'Many-to-Many association'
  }, {
    SysCode: 'Command',
    Description: 'Button for fuction call'
  }]
});


// ----- Presentation Views group ----------------------------
isc.CBMDataSource.create({
  ID: "PrgView",
//  	cacheAllData: true, 
  titleField: "SysCode",
  infoField: "Description",
  // 	Actions for instance creation from another entity. (Prepared as ready Menu data from CBM Metadata by Server)
  MenuAdditions: [{
    title: "Generate DS text",
    icon: isc.Page.getAppImgDir() + "edit.png",
    click: function () {
      generateDStext(this.context.getSelectedRecord()["SysCode"], function (dsText) {
        isc.say(beautifyJS(dsText));
      })
    }
  }, {
    title: "Generate DS immedeately",
    icon: isc.Page.getAppImgDir() + "edit.png",
    click: function () {
      generateDStext(this.context.getSelectedRecord()["SysCode"], function (dsText) {
        eval(dsText);
      })
    }
  }],

  CreateFromMethods: [{
    title: "For Concept",
    showHover: true,
    cellHover: "Create View for this Concept",
    icon: isc.Page.getAppImgDir() + "add.png",
    click: function (topElement) {
      // View created in context of it's concept, so call for list for choice not nessasary
      // TODO do this if no inner-context provided
//					if (is we in upper-level window) {
      createTable("Concept", arguments[0].context, this.createRecordsFunc, {SysCode: arguments[0].context.topElement.context.getSelection().SysCode});
      // } else {
      // var currConcept = isc.DataSource.get("Concept").getCacheData().find({SysCode: topElement.context.topElement.valuesManager.getValues().SysCode});
      // if (currConcept) {
      // this.createRecordsFunc(currConcept, topElement.context);
      // }
      // }
      return false;
    },
    createRecordsFunc: function (srcRecords, context) {
      createFrom(srcRecords, function (srcRecord) {
        return "PrgView";
      }, PrgView.CreateFromMethods[0].createViewFromConcept, context);
    },
    createViewFromConcept: function (dstRec, srcRec) {
      // --- Create standard fields
      dstRec.infoState = "new";
      dstRec["Concept"] = "PrgView";
      dstRec["Del"] = false;
      dstRec["SysCode"] = srcRec["SysCode"];
      // --- Create class - specific fields
      dstRec["ForConcept"] = conceptRS.find("SysCode", srcRec["SysCode"])["ID"];
      dstRec["Description"] = conceptRS.find("SysCode", srcRec["SysCode"])["Description"];
      dstRec["Notes"] = "UI View for " + conceptRS.find("SysCode", srcRec["SysCode"])["Description"];
      dstRec["Actual"] = true;
      dstRec["CanExpandRecords"] = false;
      dstRec["Role"] = "Default";
      // --- Create Fields from Attributes
      // sendCommand("GenerateDefaultView", "POST", {
      // forType: srcRec["SysCode"]
      // }, null);
    }
  }],

  fields: [{
    name: "Del",
    type: "boolean",
    defaultValue: false,
    hidden: true
  }, {
    name: "Concept",
    type: "text",
    defaultValue: "PrgView",
    hidden: true
  }, {
    name: "SysCode",
    type: "text",
    title: "Code Sys",
    length: 200,
    required: true,
    inList: true
  }, {
    name: "ForConcept",
    type: "Concept",
    title: "Represents Concept",
    foreignKey: "Concept.ID",
    editorType: "LinkControl",
    optionDataSource: "Concept",
    valueField: "ID",
    displayField: "SysCode",
    pickListWidth: 450,
    pickListFields: [{
      name: "SysCode",
      width: "30%"
    }, {
      name: "Description"
    }],
    inList: true
  }, {
    name: "Actual",
    type: "boolean",
    defaultValue: true,
    inList: true
  }, {
    name: "Description",
    type: "multiLangText",
    inList: true
  }, {
    name: "StrictConcept",
    type: "boolean",
    title: "Strict Concept",
    defaultValue: false
  }, {
    name: "Notes",
    type: "multiLangText",
    inList: true
  }, {
    name: "Role",
    type: "text",
    title: "View role",
    inList: true
  }, {
    name: "CanExpandRecords",
    type: "boolean",
    defaultValue: false,
    title: "Records can be expanded"
  }, {
    name: "ExpandedConcept",
    type: "text",
    title: "Concept in expanded list"
  }, {
    name: "ExpansionMode",
    title: "Expansion Mode",
    type: "text",
    valueMap: [null, "related", "detailField", "details", "detailRelated", "editor"],
    editorType: "select"
  }, {
    name: "ChildExpansionMode",
    title: "Childs expansion",
    type: "text",
    valueMap: [null, "related", "detailField", "details", "detailRelated", "editor"],
    editorType: "select"
  }, {
    name: "MainTabName",
    type: "multiLangText",
    title: "Name for main (first) tab",
    Prompt: "Optional substitution for localized config-based tab title"
  }, {
    name: "Fields",
    type: "PrgViewField",
    copyLinked: true,
    deleteLinked: true,
    canSave: true,
    editorType: "CollectionAggregateControl",
    relatedConcept: "PrgViewField",
    backLinkRelation: "ForPrgView",
    mainIDProperty: "ID",
    showTitle: false,
    colSpan: 6
  }]
});


isc.CBMDataSource.create({
  ID: "PrgViewField",
 	//cacheAllData: true, 
  titleField: "SysCode",
  infoField: "Description",
  // 	Actions for instance creation from another entity.
  CreateFromMethods: [{
    title: "From Relations",
    showHover: true,
    cellHover: "Create View Fields based on Relations of viewed Concept",
    icon: isc.Page.getAppImgDir() + "add.png",
    click: function (topElement) {
      var tbl = createTable(
                "Relation",
                arguments[0].context,
                this.createRecordsFunc, // On called window close callback function.
                {ForConcept: "empty list"},
                null,
                function(tbl){
                  // Set Relations records in just created Table 
                  var concept = arguments[0].context.topElement.valuesManager.getValue("ForConcept");
                  getRelationsForConcept(concept, tbl.innerGrid.grid.setData.bind(tbl.innerGrid.grid));
                }
              );
      // Set Relations records in just created Table 
      // var concept = arguments[0].context.topElement.valuesManager.getValue("ForConcept");
      // getRelationsForConcept(concept, tbl.innerGrid.grid.setData.bind(tbl.innerGrid.grid));
     
      return false;
    },			

    // Function for creation of records. Change	of argument types is enough.
    createRecordsFunc: function (srcRecords, context) {
      
      if (typeof(srcRecords) == 'undefined' || srcRecords == null) {
        return;
      }
      createFrom(
        srcRecords, function (srcRecord) {
          return "PrgViewField";
        },
        PrgViewField.CreateFromMethods[0].createPrgViewFieldFromRelation,
        context);
    },
    
    createPrgViewFieldFromRelation: function (dstRec, srcRec, PrgView) {
      if (typeof(srcRec) == 'undefined' || srcRec == null) {
        return;
      }
      // --- Create standard fields
      dstRec["SysCode"] = srcRec["SysCode"];
      dstRec["Concept"] = "PrgViewField"; //conceptRS.find("SysCode", "PrgViewField")["ID"]; // 180;
      dstRec["Del"] = false;
      // --- Create class - specific fields
      dstRec["Odr"] = srcRec["Odr"];
      dstRec["ForPrgView"] = PrgView;
      dstRec["ForRelation"] = srcRec["ID"];
      dstRec["Title"] = srcRec["Description"];
      dstRec["Hint"] = srcRec["Notes"];
      dstRec["Mandatory"] = false;
      dstRec["ViewOnly"] = false;
      dstRec["ColSpan"] = 1;
      dstRec["RowSpan"] = 1;
      dstRec["PickListWidth"] = 400;
      
      if(srcRec.SysCode === "ID") {
        dstRec["Hidden"] = true;
        dstRec["InList"] = false;
        dstRec["ShowTitle"] = false;
        dstRec["Editable"] = false;
      } else {
        dstRec["Hidden"] = false;
        if(srcRec.RelationKind !== "Value" && srcRec.RelationKind !== "Link") {
          dstRec["InList"] = false;
        } else {
          dstRec["InList"] = true;
        }
        dstRec["ShowTitle"] = true;
        dstRec["Editable"] = true;
      }
      // Below section not nessesary due to all that made by default in dynamic CBM DS generation functon
      // if(srcRec.RelationKind.SysCode !== "Value") {
        // switch (record["RelationKind"]) {
          // case "Link":
          // dstRec["ControlType"] = "LinkControl";
          // break;
          // case "BackLink":
          // dstRec["ControlType"] = "CollectionControl";
          // break;
          // case "BackAggregate":
          // dstRec["ControlType"] = "CollectionAggregateControl";
          // break;
          // case "CrossLink":
          // dstRec["ControlType"] = "CrossLinkControl";
          // break;
          // case "Command":
          // dstRec["ControlType"] = "Button";
          // break;
        // }
        // dstRec["DataSourceView"] = srcRec.RelatedConcept;
      // }
    }
  }],

  fields: [{
    name: "Del",
    type: "boolean",
    defaultValue: false,
    hidden: true
  }, {
    name: "Concept",
    type: "text",
    defaultValue: "PrgViewField",
    hidden: true
  }, {
    name: "Odr",
    type: "integer",
    title: "Sequence in UI",
    inList: true,
    defaultValue: 99
  }, {
    name: "SysCode",
    type: "text",
    title: "Code Sys",
    length: 200,
    required: true,
    inList: true
  }, {
    name: "Title",
    type: "multiLangText",
    title: "Description in UI",
    length: 250,
    inList: true
  }, {
    name: "ForPrgView",
    type: "PrgView",
    title: "Belongs to View",
    foreignKey: "PrgView.ID",
    editorType: "LinkControl",
    optionDataSource: "PrgView",
    valueField: "ID",
    displayField: "SysCode",
    pickListWidth: 450,
    inList: true,
    pickListFields: [{
      name: "SysCode"
    }, {
      name: "Description"
    }]
  }, {
    name: "ForRelation",
    type: "Relation",
    title: "Represents Relation",
 //   foreignKey: "Relation.ID", // <<<?
    editorType: "LinkControl",
    optionDataSource: "Relation", // <<<?
    valueField: "ID",
    displayField: "SysCode",
    pickListWidth: 450,
    inList: true,
    pickListFields: [{
      name: "ForConcept",
      title: "Belongs to concept"
    }, {
      name: "SysCode",
      title: "System code"
    }, {
      name: "Description"
    }]
  }, {
    name: "Mandatory",
    type: "boolean",
    defaultValue: false,
    title: "Mandatory"
  }, {
    name: "Hidden",
    type: "boolean",
    defaultValue: false,
    title: "Hidden"
  }, {
    name: "InList",
    type: "boolean",
    defaultValue: true,
    title: "Show in List",
    inList: true
  }, {
    name: "ViewOnly",
    type: "boolean",
    defaultValue: false,
    title: "Not in model - UI only"
  }, {
    name: "ShowTitle",
    type: "boolean",
    defaultValue: true,
    title: "Show title"
  }, {
    name: "Editable",
    type: "boolean",
    defaultValue: true,
    title: "Is Editable"
  }, {
    name: "UIPath",
    type: "text",
    title: "UI section (tab) name",
    inList: true
  }, {
    name: "ColSpan",
    type: "integer",
    title: "Spread to columns",
    defaultValue: 1,
    inList: true
  }, {
    name: "RowSpan",
    type: "integer",
    title: "Spread to rows",
    defaultValue: 1,
    inList: true
  }, {
    name: "ControlType",
    type: "text",
    title: "Type of Control",
    inList: true
  }, {
    name: "Hint",
    type: "multiLangText",
    title: "ToolTip message",
    titleOrientation: "top",
    colSpan: 2,
    length: 1000,
    inList: true
  },
    // Below are the fields that describe properties of complicated relation controls
    {
      name: "DataSourceView",
      type: "text",
      title: "Source data"
    }, {
      name: "ValueField",
      type: "text",
      title: "Link Field in main record (ID usually)",
      defaultValue: "ID"
    }, {
      name: "DisplayField",
      type: "text",
      title: "Display Field",
      defaultValue: "Description"
    }, {
      name: "PickListWidth",
      type: "integer",
      title: "List width"
    }, {
      name: "PickListFields",
      type: "text",
      title: "Pick list Fields",
      titleOrientation: "top",
      colSpan: 2,
      length: 2000
    }, {
      name: "CreateFromMethods",
      type: "text",
      title: "Program code for create from methods",
      titleOrientation: "top",
      colSpan: 2,
      length: 19000
    }]
});

//--- Menu metadata DS ---
isc.CBMDataSource.create({
  ID: "PrgMenu",
  titleField: "SysCode",
  infoField: "Description",
  fields: [{
    name: "Del",
    type: "boolean",
    hidden: true
  }, {
    name: "Concept",
    type: "text",
    defaultValue: "PrgMenu",
    hidden: true
  }, {
    name: "SysCode",
    type: "text",
    title: "Code Sys",
    length: 200,
    required: true,
    inList: true
  }, {
    name: "Description",
    type: "multiLangText",
    title: "Menu Description",
    titleOrientation: "top",
    colSpan: 2,
    length: 1000,
    inList: true
  }, {
    name: "Items",
    type: "PrgMenuItem",
    copyLinked: true,
    deleteLinked: true,
    canSave: true,
    colSpan: 6,
    startRow: true,
    editorType: "CollectionAggregateControl",
    relatedConcept: "PrgMenuItem",
    backLinkRelation: "ForMenu",
    mainIDProperty: "ID",
    showTitle: false
  }]
});

isc.CBMDataSource.create({
  ID: "PrgMenuItem",
  titleField: "Description",
  infoField: "SysCode",
  isHierarchy: true,
  fields: [{
    name: "Concept",
    type: "text",
    defaultValue: "PrgMenuItem",
    hidden: true
  }, {
    name: "Odr",
    type: "integer",
    title: "Order",
    length: 4,
    //hidden: true,
    required: true,
    inList: true
  }, {
    name: "ForMenu",
    type: "PrgMenu",
    title: "Menu to which this Item belongs",
    editorType: "LinkControl",
    optionDataSource: "PrgMenu",
    valueField: "ID",
    displayField: "Description"
  }, {
    name: "ParentItem",
    type: "PrgMenuItem",
    title: "Parent item",
    foreignKey: "PrgMenuItem.ID",
    rootValue: "null",
    editorType: "LinkControl",
    optionDataSource: "PrgMenuItem",
    valueField: "ID",
    displayField: "Description",
    emptyMenuMessage: "No Items",
    canSelectParentItems: true,
    pickListWidth: 650,
    pickListFields: [{
      name: "SysCode",
      width: 100
    }, {
      name: "Description"
    }],
    pickListProperties: {
      loadDataOnDemand: false,
      canHover: true,
      showHover: true,
      cellHoverHTML: function (record) {
        return record.SysCode ? record.SysCode : "[no Code]";
      }
    }//,
//        inList: true
  }, {
    name: "Description",
    type: "multiLangText",
    title: "Description of Item",
    //      titleOrientation: "top",
    colSpan: 5,
    length: 400,
    inList: true
  }, {
    name: "SysCode",
    type: "text",
    title: "Code of Concept called by this Item",
    length: 100,
    required: true,
    inList: true
  }, /*{
   name: "CalledConcept",
   type: "Concept",
   title: "Concept called by this Item",
   editorType: "LinkControl",
   optionDataSource: "Concept",
   valueField: "ID",
   displayField: "Description",
   hidden: true
   },*/ {
    name: "MenuItemActionType", 
    type: "MenuItemActionType",
    title: "Item Action Type",
    editorType: "ComboBoxItem",
    foreignKey: "MenuItemActionType.SysCode",
    optionDataSource: "MenuItemActionType",
    valueField: "SysCode",
    displayField: "Description",
    inList: true
  }, {
    name: "CalledMethod", // TODO: substitute with Method link
    type: "PrgFunction",
    title: "Called method",
    editorType: "LinkControl",
    optionDataSource: "PrgFunction",
    valueField: "ID",
    displayField: "Description"
  }, {
    name: "Args",
    type: "text",
    title: "Called method Arguments",
    titleOrientation: "top",
    colSpan: 2,
    length: 2000
  }]
});


isc.CBMDataSource.create({
  ID: "MenuItemActionType",
  clientOnly: true,
  titleField: "SysCodeDescription",
  infoField: "Description",
  fields: [{
    name: "Odr",
    type: "integer",
    title: "Order",
    length: 4,
    //hidden: true,
    required: true,
    inList: true
  }, {
    name: "SysCode",
    type: "text",
    primaryKey: true,
    title: "Code of Concept called by this Item",
    length: 400,
    required: true,
    inList: true
  }, {
    name: "Description",
    type: "multiLangText",
    title: "Description of Item",
    //      titleOrientation: "top",
    colSpan: 5,
    length: 400,
    inList: true
  }],
  
   testData: [{
    Odr: 0,
    SysCode: 'Empty',
    Description: 'Empty information'
  }, {
    Odr: 1,
    SysCode: 'List',
    Description: 'List'
  }, {
    Odr: 2,
    SysCode: 'SingleInstance',
    Description: 'Existing instance of some concept selected by some filter'
  }, {
    Odr: 3,
    SysCode: 'Form',
    Description: 'Some singleton form - wide variants of use'
  }, {
    Odr: 4,
    SysCode: 'Command',
    Description: 'Command'
  }]

});

//========================================================================
//============ CBM actual Domain Model Classes (DataSources) =============
//========================================================================
isc.CBMDataSource.create({
  ID: "PrgComponent",
  titleField: "SysCode",
  fields: [{
    name: "Concept",
    type: "text",
    defaultValue: "PrgComponent",
    hidden: true
  }, {
    name: "SysCode",
    type: "text",
    title: "Code Sys",
    length: 200,
    required: true,
    inList: true
  }, {
    name: "Concept",
    type: "Concept",
    title: "Program Class that provide work with this Thing",
    // foreignKey : "Concept.ID"// ,
    editorType: "LinkControl",
    optionDataSource: "Concept",
    valueField: "ID",
    displayField: "SysCode",
    pickListWidth: 450,
    pickListFields: [{
      name: "SysCode"
    }, {
      name: "Description"
    }]
  }, {
    name: "EntityKind",
    type: "EntityKind",
    title: "The Kind of this Component",
    // foreignKey : "Concept.ID"// ,
    editorType: "LinkControl",
    optionDataSource: "EntityKind",
    valueField: "ID",
    displayField: "SysCode",
    pickListWidth: 450,
    pickListFields: [{
      name: "Code"
    }, {
      name: "Description"
    }],
    inList: true
  }, {
    name: "Installation",
    type: "PrgComponent",
    editorType: "LinkControl",
    optionDataSource: "PrgComponent",
    valueField: "ID",
    displayField: "SysCode",
    pickListWidth: 450,
    pickListFields: [{
      name: "ID",
      width: 30
    }, {
      name: "SysCode"
    }, {
      name: "Description"
    }]
  }, {
    name: "Description",
    type: "multiLangText",
    title: "Description",
    inList: true
  }]
});

// =====^^^===== END Core DS definitions =====^^^=====
