//========================================================================
//======================= Tecnique DataSources ===========================
//========================================================================
isc.CBMDataSource.create({
    ID: "UserRights",
    dbName: "MySQL.CBM", //    dbName : "DB2.CBM",
    fields: [ {
            name: "ForType",
            type: "text",
            title: "ForType"
        }, {
            name: "ActionType",
            type: "text",
            title: "Action",
            length: 200
        }, {
            name: "ForUser",
            type: "text",
            title: "For User"
        }, {
            name: "Creteria",
            type: "text",
            title: "Creteria",
            length: 200
        } 
    ]
});

isc.CBMDataSource.create({
    ID: "WindowSettings",
    dbName: "MySQL.CBM", // dbName : "DB2.CBM",
    fields: [ {
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
        }
    ]
});

isc.CBMDataSource.create({
    ID: "ListSettings",
    dbName: "MySQL.CBM", // dbName : "DB2.CBM",
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
        }
    ]
});

//========================================================================
//============ CBM actual Domain Model Classes (DataSources) =============
//========================================================================

isc.CBMDataSource.create({
    ID: "PrgComponent",
    dbName: "MySQL.CBM", // dbName : "DB2.CBM",
    titleField: "SysCode",
    fields: [{
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
            editorType: "comboBox",
            optionDataSource: "Concept",
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
                }
            ]
        }, {
            name: "EntityKind",
            type: "EntityKind",
            title: "The Kind of this Component",
            // foreignKey : "Concept.ID"// ,
            editorType: "comboBox",
            optionDataSource: "EntityKind",
            valueField: "ID",
            displayField: "SysCode",
            pickListWidth: 450,
            pickListFields: [{
                    name: "ID",
                    width: 30
                }, {
                    name: "Code"
                }, {
                    name: "Description"
                }
            ],
            inList: true
        }, {
            name: "Installation",
            type: "PrgComponent",
            editorType: "comboBox",
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
       },{
            name: "Description",
            type: "text",
            title: "Description",
            inList: true
        }
    ]
});

// ----- Concept group ----------------------------
isc.CBMDataSource.create({
    ID: "Concept",
    dbName: "MySQL.CBM", // dbName : "DB2.CBM",
    titleField: "SysCode",
    infoField: "Description",
    isHierarchy: true,
    MenuAdditions: [{
            isSeparator: true
        }, {
            title: "Objects of this Concept",
            icon: isc.Page.getAppImgDir() + "View.png",
            click: function() { createTable(this.context.getSelectedRecord()["SysCode"]); return false;},
        }    ],
    fields: [{
            name: "SysCode",
            type: "text",
            title: "Code",
            length: 200,
            required: true,
            inList: true
        }, {
            name: "BaseConcept",
            type: "Concept",
            title: "Parent Concept",
            foreignKey: "Concept.ID",
            rootValue: "null",
            // editorType : "SelectItem",
            editorType: "comboBox",
            // 	        	 editorType : "TreeGridField",
            // 	        	 editorType : "pickTree",
            optionDataSource: "Concept",
            valueField: "ID",
            displayField: "SysCode",
            emptyMenuMessage: "No Sub Classes",
            canSelectParentItems: true,
            pickListWidth: 450,
            pickListFields: [{
                    name: "ID",
                    width: 30
                }, {
                    name: "SysCode"
                }, {
                    name: "Description"
                }
            ],
            pickListProperties: {
                loadDataOnDemand: false,
                canHover: true,
                showHover: true,
                cellHoverHTML: function (record) {
                    return record.SysCode ? record.SysCode : "[no Code]";
                }
            },
            inList: true,
			changed: function(){
			    // TODO form - isn't variant here!!! Temporary choice... (Really? - Think more!)
				this.form.setValue("HierCode", ConceptPrgClass.getCacheData().find({"ID" : (this.form.values["BaseConcept"])})["HierCode"] + this.getValue() + ",");
			}
        }, {
            name: "HierCode",
            type: "text",
            title: "Hierarchy full path",
            inList: false
        },{
            name: "Description",
            type: "text",
            title: "Description",
            inList: true
        }, {
            name: "Notes",
            type: "text",
            title: "Notes",
            inList: true
        }, {
            name: "Primitive",
            type: "boolean",
            title: "Primitive Type"
        }, {
            name: "Abstract",
            type: "boolean",
            title: "Abstract class"
        }, {
            name: "Author",
            type: "integer", // TODO : Substitute with Party DS when possible
            title: "Author of Concept",
            foreignKey: "Concept.ID",
            editorType: "comboBox" // ,
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
            name: "Properties",
            type: "custom",
            canSave: true,
            editorType: "BackLink",
            relatedConcept: "Relation",
            backLinkRelation: "ForConcept",
            mainIDProperty: "ID",
            showTitle: false,
            UIPath: "Properties"
        }
    ]
});

isc.CBMDataSource.create({
    ID: "PrgClass",
    dbName: "MySQL.CBM", //    dbName : "DB2.CBM",
    titleField: "SysCode",
    infoField: "Description",
    isHierarchy: true,
    fields: [{
            name: "ForConcept",
            type: "Concept",
			foreignKey: "Concept.ID",
            relationStructRole: "ID",
            inList: true
        }, { 
			name: "SysCode",
			includeFrom: "Concept.SysCode", 
			title: "Concept Code",
			hidden:"true"
		}, {
            name: "PrgVersion",
            type: "PrgVersion",
            title: "Current Version",
            UIPath: "Prg properties",
            foreignKey: "PrgVersion.ID",
            editorType: "comboBox",
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
                }
            ]
        }, {
            name: "Description",
            type: "text",
            inList: true
        }, {
            name: "Notes",
            type: "text",
            inList: true
        }, {
            name: "ExprToString",
            type: "text"
        }, {
            name: "DataBaseStore",
            type: "DataBaseStore",
            title: "DataBase Store",
            UIPath: "Prg properties",
            foreignKey: "PrgComponent.ID",
            editorType: "comboBox",
            optionDataSource: "DataBaseStore",
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
                }
            ]
        }, {
            name: "ExprFrom",
            type: "text"
        }, {
            name: "ExprWhere",
            type: "text"
        }, {
            name: "ExprOrder",
            type: "text"
        }, {
            name: "ExprGroup",
            type: "text"
        }, {
            name: "ExprHaving",
            type: "text"
        }, {
            name: "PrgPackage",
            type: "text",
            inList: true
        }, {
            name: "PrgType",
            type: "text",
            inList: true
        }, {
            name: "Properties",
            type: "custom",
            canSave: true,
            editorType: "BackLink",
			copyLinked: true,
			deleteLinked: true,
            relatedConcept: "PrgAttribute",
            backLinkRelation: "ForPrgClass",
            mainIDProperty: "ID",
            showTitle: false,
            UIPath: "Properties"
        }, {
            name: "Views",
            type: "custom",
            canSave: true,
            editorType: "BackLink",
            relatedConcept: "PrgView",
            backLinkRelation: "ForConcept",
            mainIDProperty: "ForConcept",
            showTitle: false,
            UIPath: "Views"
        }
    ]
});

// ------- Complex DS for Concept + PrgClass --------------
isc.CBMDataSource.create({
    ID: "ConceptPrgClass",
    inheritsFrom: Concept,
    useParentFieldOrder: true,
    dbName: "MySQL.CBM", //    dbName : "DB2.CBM",
    titleField: "SysCode", // ??? Inherited Field  - does it work?
    infoField: "Description",
    isHierarchy: true,
    MenuAdditions: [{
            isSeparator: true
        }, {
            title: "Objects of this Concept",
            icon: isc.Page.getAppImgDir() + "View.png",
            click: function() { createTable(this.context.getSelectedRecord()["SysCode"]); return false;},
        }, {
            title: "Generate default Program View",
            icon: isc.Page.getAppImgDir() + "add.png",
            click: "SendCommand(\"GenerateDefaultView\", \"POST\", {forType: this.context.getSelectedRecord()[\"SysCode\"]}, null ); return false;"
        }, {
            title: "Synchronize Attributes",
            icon: isc.Page.getAppImgDir() + "add.png",
            click: "SendCommand(\"SynchronizeAttributes\", \"POST\", {forType: this.context.getSelectedRecord()[\"PrgClassID\"]}, null ); return false;"
        }
    ],
    fields: [
        // --- PrgClass part attributes ---
        {
            name: "PrgClassID", // ID from CBMDataSource for "PrgClass" DS
            type: "integer",
            relationStructRole: "ID",
            part: "vers",
            hidden: true
        }, {
            name: "MainID", // ForConcept from "PrgClass" DS
            type: "Concept",
			foreignKey: "Concept.ID",
            relationStructRole: "MainID",
            mainPartID: "ID",
            part: "vers",
            hidden: true
        }, {
            name: "versDel",
            type: "boolean",
            length: 1,
            hidden: true
        }, {
            name: "versUID",
            type: "text",
            title: "Global Unique ID",
            length: 36,
            hidden: true
        }, {
            name: "PrgVersion",
            type: "PrgVersion",
            title: "Current Version",
            UIPath: "Prg properties",
            foreignKey: "PrgComponent.ID",
            editorType: "comboBox",
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
                }
            ]
        }, {
            name: "VersDescription",
            type: "text",
            inList: true,
            UIPath: "Prg properties"
        }, {
            name: "VersNotes",
            type: "text",
            inList: true,
            UIPath: "Prg properties"
        }, {
            name: "ExprToString",
            type: "text",
            UIPath: "Prg properties"
        }, {
            name: "DataBaseStore",
            type: "DataBaseStore",
            title: "DataBase Store",
            UIPath: "Prg properties",
            foreignKey: "PrgComponent.ID",
            editorType: "comboBox",
            optionDataSource: "DataBaseStore",
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
                }
            ]
        }, {
            name: "ExprFrom",
            type: "text",
            UIPath: "Prg properties"
        }, {
            name: "ExprWhere",
            type: "text",
            UIPath: "Prg properties"
        }, {
            name: "ExprGroup",
            type: "text",
            UIPath: "Prg properties"
        }, {
            name: "ExprHaving",
            type: "text",
            UIPath: "Prg properties"
        }, {
            name: "ExprOrder",
            type: "text",
            UIPath: "Prg properties"
        }, {
            name: "PrgPackage",
            type: "text",
            UIPath: "Prg properties",
            inList: true
        }, {
            name: "PrgType",
            type: "text",
            UIPath: "Prg properties",
            inList: true
        }, {
            name: "Views",
            type: "custom",
            canSave: true,
            editorType: "BackLink",
            relatedConcept: "PrgView",
            backLinkRelation: "ForConcept",
            mainIDProperty: "ID",
            showTitle: false,
            UIPath: "Prg properties"
        }, {
            name: "Properties",
            type: "custom",
            canSave: true,
            editorType: "BackLink",
			copyLinked: true,
            relatedConcept: "RelationPrgAttribute",
            backLinkRelation: "ForConcept",
            mainIDProperty: "ID",
            showTitle: false,
            UIPath: "Properties"
        }
    ]
});

isc.CBMDataSource.create({
    ID: "PrgVersion",
    dbName: "MySQL.CBM", //    dbName : "DB2.CBM",
    titleField: "SysCode",
    infoField: "Description",
    fields: [{
            name: "SysCode",
            type: "text",
            title: "Code of Version",
            length: 200,
            required: true,
            inList: true
        }, {
            name: "Description",
            type: "text",
            title: "Description of Version",
			titleOrientation: "top", 
            colSpan: 2,
			length: 2000,
            inList: true
        }, {
            name: "Owner",
            type: "Integer",
            title: "Who owns this Version",
            editorType: "comboBox",
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
            title: "Is Actual",
            inList: true
        }, {
            name: "ExprFilter",
            type: "text",
            title: "Selection criteria for this Version concepts filtering",
			titleOrientation: "top", 
            colSpan: 2, 
            length: 4000
        }
    ]
});

isc.CBMDataSource.create({
    ID: "DataBaseStore",
    dbName: "MySQL.CBM", //    dbName : "DB2.CBM",
    titleField: "SysCode",
    infoField: "Description",
    fields: [{
            name: "SysCode",
            type: "text",
            title: "Code",
            length: 200,
            required: true,
            inList: true
        }, {
            name: "Description",
            type: "text",
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
        }
    ]
});


// ----- Relation group ----------------------------
isc.CBMDataSource.create({
    ID: "Relation",
    dbName: "MySQL.CBM", //    dbName : "DB2.CBM",
    titleField: "SysCode",
    infoField: "Description",
    fields: [{
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
            name: "ForConcept",
            type: "Concept",
            title: "Belongs to Class",
            foreignKey: "Concept.ID",
            editorType: "comboBox",
            optionDataSource: "Concept",
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
                }
            ],
            inList: true
        }, {
            name: "InheritedFrom",
            type: "Concept",
            title: "Inherited from Concept",
            foreignKey: "Concept.ID",
            editorType: "comboBox",
            optionDataSource: "Concept",
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
                }
            ],
            inList: true
        }, {
            name: "RelationRole",
            type: "Concept",
            title: "Role of Relation",
            foreignKey: "Concept.ID",
            editorType: "comboBox",
            optionDataSource: "Concept",
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
                }
            ]
        }, {
            name: "RelatedConcept",
            type: "Concept",
            required: true,
            title: "Attribute value Type",
            foreignKey: "Concept.ID",
            editorType: "comboBox",
            optionDataSource: "Concept",
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
                }
            ],
            inList: true
        }, {
            name: "RelationKind",
            type: "RelationKind",
            title: "Attribute Kind",
            foreignKey: "RelationKind.ID",
            editorType: "comboBox",
            optionDataSource: "RelationKind",
            valueField: "ID",
            displayField: "SysCode",
            pickListWidth: 450,
            pickListFields: [{
                    name: "ID",
                    width: 30
                }, {
                    name: "SysCode"
                }
            ]
        }, {
            name: "Domain",
            type: "text",
            title: "Domain restrictions",
			titleOrientation: "top", 
            colSpan: 2,
            length: 1000
        }, {
            name: "BackLinkRelation",
            type: "Relation",
            title: "Attribute from back-link class",
            foreignKey: "Relation.ID",
            editorType: "comboBox",
            optionDataSource: "Relation",
            valueField: "ID",
            displayField: "SysCode",
            pickListWidth: 550,
            pickListFields: [{
                    name: "ID",
                    width: 30
                }, {
                    name: "ForConcept"
                }, {
                    name: "SysCode"
                }, {
                    name: "Description"
                }
            ]
        }, {
            name: "CrossConcept",
            type: "Concept",
            title: "Many-to-many Class",
            foreignKey: "Concept.ID",
            editorType: "comboBox",
            optionDataSource: "Concept",
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
                }
            ]
        }, {
            name: "CrossRelation",
            type: "Relation",
            title: "Attribute from back-link to end-point class",
            foreignKey: "Relation.ID",
            editorType: "comboBox",
            optionDataSource: "Relation",
            valueField: "ID",
            displayField: "SysCode",
            pickListWidth: 550,
            pickListFields: [{
                    name: "ID",
                    width: 30
                }, {
                    name: "ForConcept"
                }, {
                    name: "SysCode"
                }, {
                    name: "Description"
                }
            ]
        }, {
            name: "Description",
            type: "text",
            title: "Description",
			titleOrientation: "top", 
            colSpan: 2,
            length: 400,
            inList: true
        }, {
            name: "Notes",
            type: "text",
            title: "Notes",
			titleOrientation: "top", 
            colSpan: 2,
            length: 2000
        }, {
            name: "Const",
            type: "boolean",
            title: "Constant"
        }, {
            name: "Countable",
            type: "boolean",
            title: "Countable"
        }, {
            name: "Historical",
            type: "boolean",
            title: "Historical"
        }, {
            name: "Versioned",
            type: "boolean",
            title: "Versioned"
        }, {
            name: "VersPart",
            type: "text",
            title: "Version Part Code",
            length: 120
        }, {
            name: "MainPartID",
            type: "text",
            title: "Main Part identifier field",
            length: 120
        }, {
            name: "root",
            type: "integer",
            title: "Root ID"
        }
    ],
    // --- Additional settings for
    edit: function (record, context) {
        // TODO : change to metadata - provided Filter
        this.fields["BackLinkRelation"].optionCriteria = {
            ForConcept: record["RelatedConcept"]
        };
        this.Super("edit", arguments);
    }

});

isc.CBMDataSource.create({
    ID: "PrgAttribute",
    dbName: "MySQL.CBM", //    dbName : "DB2.CBM",
    titleField: "SysCode",
    infoField: "DisplayName",
    fields: [{
            name: "ForRelation",
            type: "Relation",
            foreignKey: "Relation.ID",
            title: "For Relation",
            editorType: "comboBox",
            optionDataSource: "Relation",
            valueField: "ID",
            displayField: "SysCode",
            pickListWidth: 550,
            pickListFields: [{
                    name: "ID",
                    width: 30
                }, {
                    name: "ForConcept"
                }, {
                    name: "SysCode"
                }, {
                    name: "Description"
                }
            ],
            inList: true
        }, {
			name: "SysCode",
			includeFrom: "Relation.SysCode", 
			title: "Code"
		}, {
            name: "ForPrgClass",
            type: "PrgClass",
            foreignKey: "PrgClass.ID",
            title: "Program Class of this Property",
            editorType: "comboBox",
            optionDataSource: "PrgClass",
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
                }
            ]
        }, {
            name: "DisplayName",
            type: "text",
            inList: true
        }, {
            name: "Notes",
            type: "text",
            inList: true
        }, {
            name: "Modified",
            type: "boolean",
            title: "Modified"
        }, {
            name: "Size",
            type: "integer"
        }, {
            name: "LinkFilter",
            type: "text",
			titleOrientation: "top", 
            colSpan: 2,
			length: 4000
        }, {
            name: "Mandatory",
            type: "boolean",
            title: "Mandatory"
        }, {
            name: "IsPublic",
            type: "boolean",
            title: "IsPublic"
        }, {
            name: "ExprEval",
            type: "text",
			titleOrientation: "top", 
            colSpan: 2,
			length: 4000
        }, {
            name: "ExprDefault",
            type: "text",
			titleOrientation: "top", 
            colSpan: 2,
			length: 2000
        }, {
            name: "ExprValidate",
            type: "text",
			titleOrientation: "top", 
            colSpan: 2,
			length: 2000
        }, {
            name: "CopyValue",
            type: "boolean",
            title: "Copy Value"
        }, {
            name: "CopyLinked",
            type: "boolean",
            title: "Copy Linked"
        }, {
            name: "DeleteLinked",
            type: "boolean",
            title: "Delete Linked"
        }, {
            name: "RelationStructRole",
            type: "text"
        }, {
            name: "DBTable",
            type: "text",
            inList: true
        }, {
            name: "DBColumn",
            type: "text",
            inList: true
        }
    ]
});


// ----------- Complex DS for Relation + PrgAttribute  -----------------
isc.CBMDataSource.create({
	ID: "RelationPrgAttribute",
    inheritsFrom: Relation,
    useParentFieldOrder: true,
    dbName: "MySQL.CBM", //    dbName : "DB2.CBM",
    titleField: "SysCode",
    infoField: "Description",
	fields: [
        // --- PrgAttribute part attributes ---
        {
            name: "PrgAttributeID",  // ID from CBMDataSource for "PrgAttribute" DS
            type: "integer",
            relationStructRole: "ID",
            part: "vers",
            hidden: true,
            UIPath: "IS related"
        }, {
            name: "ForRelation", // ForRelation from "PrgAttribute" DS
            type: "integer",
            relationStructRole: "MainID",
            mainPartID: "ID",
            part: "vers",
            UIPath: "IS related",
            hidden: true
        },{
            name: "ForPrgClass",
            type: "PrgClass",
            title: "Program Class of this Property",
            editorType: "comboBox",
            optionDataSource: "PrgClass",
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
                }
            ],
            required: true,
            inList: true,
            UIPath: "IS related"
        },
		{
			name: "DisplayName",
			type: "text",
			inList: true,
            UIPath: "IS related"
		}, {
			name: "PrgAttributeNotes",
			type: "text",
			inList: true,
            UIPath: "IS related"
		}, {
			name: "Modified",
			type: "boolean",
			title: "Modified",
            UIPath: "IS related"
		}, {
			name: "Size",
			type: "integer",
            UIPath: "IS related"
		}, {
			name: "LinkFilter",
			type: "text",
            UIPath: "IS related"
		}, {
			name: "Mandatory",
			type: "boolean",
			title: "Mandatory",
            UIPath: "IS related"
		}, {
			name: "IsPublic",
			type: "boolean",
			title: "IsPublic",
            UIPath: "IS related"
		}, {
			name: "ExprEval",
			type: "text",
            UIPath: "IS related"
		}, {
			name: "ExprDefault",
			type: "text",
            UIPath: "IS related"
		}, {
			name: "ExprValidate",
			type: "text",
            UIPath: "IS related"
		}, {
			name: "CopyValue",
			type: "boolean",
			title: "Copy Value",
            UIPath: "IS related"
		}, {
			name: "CopyLinked",
			type: "boolean",
			title: "Copy Linked",
            UIPath: "IS related"
		}, {
			name: "DeleteLinked",
			type: "boolean",
			title: "Delete Linked",
            UIPath: "IS related"
		}, {
			name: "RelationStructRole",
			type: "text",
            UIPath: "IS related"
		}, {
			name: "DBTable",
			type: "text",
			inList: true,
            UIPath: "IS related"
		}, {
			name: "DBColumn",
			type: "text",
			inList: true,
            UIPath: "IS related"
		}
	] 
});


isc.CBMDataSource.create({
    ID: "RelationKind",
    dbName: "MySQL.CBM", //    dbName : "DB2.CBM",
    titleField: "SysCode",
    infoField: "Description",
    fields: [{
            name: "SysCode",
            type: "text",
            title: "Code",
            length: 200,
            required: true,
            inList: true
        }, {
            name: "Description",
            type: "text",
            title: "Description",
			titleOrientation: "top", 
            colSpan: 2,
            length: 2000,
            inList: true
        }, {
            name: "Notes",
            type: "text",
            title: "Relation Kind explained",
			titleOrientation: "top", 
            colSpan: 2,
            length: 4000
        }
    ]
});

// ----- Presentation Views group ----------------------------
isc.CBMDataSource.create({
    ID: "PrgView",
    dbName: "MySQL.CBM", //    dbName : "DB2.CBM",
    titleField: "SysCode",
    infoField: "Description",
    MenuAdditions: [{
            isSeparator: true
        }, {
            title: "Generate DataSource",
            icon: isc.Page.getAppImgDir() + "add.png",
            click: "SendCommand(\"GenerateDS\", \"POST\", {forType:this.context.getSelectedRecord()[\"SysCode\"]}, null ); return false;"
        }
    ],
    // 	Actions for instance creation from another entity. (Prepared as ready Menu data from CBM Metadata by Server)
    CreateFromMethods: [{
            title: "From Class",
            showHover: true,
            cellHover: "Create View from (better say For) Concept",
            icon: isc.Page.getAppImgDir() + "add.png",
            click: function (topElement) { 
				createTable("Concept", arguments[0].context, this.createRecordsFunc); 
                return false;
            },
            createRecordsFunc: function (srcRecords, context) {
				createFrom(srcRecords, function (srcRecord) { return "PrgView"; }, PrgView.CreateFromMethods[0].createViewFromPrgClass, context );
            },
            createViewFromPrgClass: function (dstRec, srcRec) {
                // --- Create standard fields
                // dstRec["SysCode"] = srcRec["SysCode"];
                // --- Create class - specific fields
                // dstRec["ForConcept"] = conceptRS.find("SysCode", srcRec["SysCode"])["ID"];
                // dstRec["Description"] = conceptRS.find("SysCode", srcRec["SysCode"])["Description"];
                // dstRec["Notes"] = "UI View for " + conceptRS.find("SysCode", srcRec["SysCode"])["Description"];
                // --- Create Fields from Attributes
				SendCommand("GenerateDefaultView", "POST", {forType: srcRec["SysCode"]}, null );
            }
        }
    ],

    fields: [{
            name: "SysCode",
            type: "text",
            title: "Code Sys",
            length: 200,
            required: true,
            inList: true
        }, {
            name: "ForConcept",
            type: "Concept",
            title: "Belongs to Class",
            foreignKey: "Concept.ID",
            editorType: "comboBox",
            optionDataSource: "Concept",
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
                }
            ],
            inList: true
        }, {
            name: "Description",
            type: "text",
            inList: true
        }, {
            name: "Notes",
            type: "text",
            inList: true
        }, {
            name: "Fields",
            type: "custom",
            canSave: true,
            editorType: "BackLink",
            relatedConcept: "PrgViewField",
            backLinkRelation: "ForPrgView",
            mainIDProperty: "ID",
            showTitle: false,
            UIPath: "Fields"
        }
    ]
});

isc.CBMDataSource.create({
    ID: "PrgViewField",
    dbName: "MySQL.CBM", //    dbName : "DB2.CBM",
    titleField: "SysCode",
    infoField: "Description",
    // 	Actions for instance creation from another entity. (Prepared as ready Menu data from CBM Metadata by Server)
    CreateFromMethods: [{
            title: "From Class Attributes",
            showHover: true,
            cellHover: "Create View from (better say For) Class",
            icon: isc.Page.getAppImgDir() + "add.png",
            click: function (topElement) {
                createTable(
                    "Relation",
                    arguments[0].context,
                    this.createRecordsFunc, // On called window close callback function.
                {
                    ForConcept: arguments[0].context.topElement.valuesManager.getValue("ForConcept")
                });
                return false;
            },
            // Function for creation of records. Change	of argument types is enough.
            createRecordsFunc: function (srcRecords, context) {
                if (typeof (srcRecords) == 'undefined' || srcRecords == null) {
                    return;
                }
                createFrom(
                    srcRecords, function (srcRecord) {
                    return "PrgViewField";
                },
                    PrgViewField.CreateFromMethods[0].createPrgViewFieldFromPrgAttribute,
                    context);
            },
            createPrgViewFieldFromPrgAttribute: function (dstRec, srcRec,
                PrgView) {
                if (typeof (srcRec) == 'undefined' || srcRec == null) {
                    return;
                }
                // --- Create standard fields
                dstRec["SysCode"] = srcRec["SysCode"];
                dstRec["Concept"] = conceptRS.find("SysCode",
                    "PrgViewField")["ID"]; // 180;
                // --- Create class - specific fields
                dstRec["ForPrgView"] = PrgView;
                dstRec["ForRelation"] = srcRec["ID"];
                dstRec["Odr"] = srcRec["Odr"];
            }
        }
    ],

    fields: [{
            name: "SysCode",
            type: "text",
            title: "Code Sys",
            length: 200,
            required: true,
            inList: true
        }, {
            name: "ForPrgView",
            type: "PrgView",
            title: "Belongs to View",
            foreignKey: "PrgView.ID",
            editorType: "comboBox",
            optionDataSource: "PrgView",
            valueField: "ID",
            displayField: "SysCode",
            pickListWidth: 450,
            pickListFields: [{
                    name: "ID"
                }, {
                    name: "SysCode"
                }, {
                    name: "Description"
                }
            ],
            inList: true
        }, {
            name: "ForRelation",
            type: "Relation",
            title: "Represents Relation",
            foreignKey: "Relation.ID",
            editorType: "comboBox",
            optionDataSource: "Relation",
            valueField: "ID",
            displayField: "SysCode",
            pickListWidth: 450,
            pickListFields: [{
                    name: "ID",
                    width: 30
                }, {
                    name: "ForConcept"
                }, {
                    name: "SysCode"
                }, {
                    name: "Description"
                }
            ],
            inList: true
        }, {
            name: "Odr",
            type: "integer",
            title: "Sequence in UI",
            inList: true
        }, {
            name: "UIPath",
            type: "text",
            title: "UI section (tab) name",
            inList: true
        }, {
            name: "Mandatory",
            type: "boolean",
            title: "Mandatory",
            inList: true
        }, {
            name: "Hidden",
            type: "boolean",
            title: "Hidden",
            inList: true
        }, {
            name: "InList",
            type: "boolean",
            title: "Show in List",
            inList: true
        }, {
            name: "ControlType",
            type: "text",
            title: "Type of Control",
            inList: true
        }, {
            name: "ShowTitle",
            type: "boolean",
            title: "Show title",
            inList: true
        }, {
            name: "Editable",
            type: "boolean",
            title: "IsEditable",
            inList: true
        }, {
            name: "Hint",
            type: "text",
            title: "ToolTip message",
			titleOrientation: "top", 
            colSpan: 2,
            length: 1000,
            inList: true
        }, {
            name: "DataSourceView",
            type: "text",
            title: "Source data",
            inList: true
        }, {
            name: "ValueField",
            type: "text",
            title: "Link Field (ID as usual)",
            inList: true
        }, {
            name: "DisplayField",
            type: "text",
            title: "Attribute to display",
            inList: true
        }, {
            name: "PickListWidth",
            type: "integer",
            title: "List width",
            inList: true
        }, {
            name: "CreateFromMethods",
            type: "text",
            title: "Program code for create from methods",
			titleOrientation: "top", 
            colSpan: 2,
            length: 19000
        }
    ]
});


isc.CBMDataSource.create({
    ID: "PrgMenu",
    dbName: "MySQL.CBM", //    dbName : "DB2.CBM",
    infoField: "Description",
    fields: [{
            name: "SysCode",
            type: "text",
            title: "Code Sys",
            length: 200,
            required: true,
            inList: true
        }, {
            name: "Description",
            type: "text",
            title: "Menu Description",
			titleOrientation: "top", 
            colSpan: 2,
            length: 2000,
            inList: true
        }, {
            name: "Items",
            type: "custom",
            canSave: true,
            editorType: "BackLink",
            RelatedConcept: "PrgMenuItem",
            counterAttribute: "ForMenu",
            mainIDAttribute: "ID"
        }
    ]
});


isc.CBMDataSource.create({
    ID: "PrgMenuItem",
    dbName: "MySQL.CBM", //    dbName : "DB2.CBM",
    infoField: "Description",
    fields: [ {
			name: "Odr",
			type: "integer",
			title: "Order",
			length: 4,
			hidden: true,
			required: true,
			inList: true
		}, {
            name: "ForMenu",
            type: "PrgMenu",
            title: "Menu to which this Item belongs",
            editorType: "comboBox",
            optionDataSource: "PrgMenu",
            valueField: "ID",
            displayField: "Description"
        }, {
            name: "ParentItem",
            type: "PrgMenuItem",
            title: "Parent item",
            foreignKey: "PrgMenuItem.ID",
            rootValue: "null",
            editorType: "comboBox",
            optionDataSource: "PrgMenuItem",
            valueField: "ID",
            displayField: "Description",
            emptyMenuMessage: "No Sub Classes",
            inList: true
       }, {
            name: "SysCode",
            type: "text",
            title: "Code of Concept called by this Item",
            length: 100,
            required: true,
            inList: true
        }, {
            name: "Description",
            type: "text",
            title: "Description of Item",
			titleOrientation: "top", 
            colSpan: 2,
            length: 400,
            inList: true
        },{
            name: "CalledConcept",
            type: "Concept",
            title: "Concept called by this Item",
            editorType: "comboBox",
            optionDataSource: "Concept",
            valueField: "ID",
            displayField: "Description"
        }, {
            name: "CalledMethod", // TODO: substitute with Method link
            type: "integer",
            title: "Called method",
			defaultValue: 0
        }, {
            name: "Args",
            type: "text",
            title: "Called method Arguments",
			titleOrientation: "top", 
            colSpan: 2,
            length: 2000
        }
    ]
});

isc.CBMDataSource.create({
ID:"EntityKind",
dbName: "MySQL.CBM",
titleField: "Code",
infoField: "Description",
isHierarchy: true,
fields: [
	{
        name: "Del",
        type: "boolean",
        defaultValue: false,
        hidden: true
    }, {
		name: "SysCode",
		type: "text",
		title: "System Code",
		length: 200,
		inList: true
	}, {
		name: "Parent",
		type: "EntityKind",
		title: "Parent Kind",
		foreignKey: "EntityKind.ID",
		rootValue: "null",
		editorType: "comboBox",
		optionDataSource: "EntityKind",
		valueField: "ID",
		displayField: "Code",
		emptyMenuMessage: "No Subkinds",
		canSelectParentItems: true,
		pickListWidth: 500,
		pickListFields: [{
		  name: "ID",
		  width: 50
		  }, {
		  name: "SysCode"
		  }, {
		  name: "Description"
		  }
		],
		pickListProperties: {
			loadDataOnDemand: false,
			canHover: true,
			showHover: true,
			cellHoverHTML: function (record) {
				return record.SysCode ? record.SysCode : "[no Code]";
				}
		},
		inList: true,
		changed: function(){
		// TODO form - isn't variant here!!! Temporary choice... (Really? - Think more!)
			this.form.setValue("HierCode", EntityKind.getCacheData().find({"ID" : (this.form.values["Parent"])})["HierCode"] + this.getValue() + ",");
		}
	}, {
		name: "HierCode",
		title: "Hierarchy Code",
		length: 200,
		inList: true,
		type: "text"
	}, {
		name: "Code",
		title: "Code",
		length: 200,
		inList: true,
		type: "text"
	}, {
		name: "Description",
		title: "Description",
		length: 400,
		inList: true,
		copyValue: true,
		relationStructRole: "null",
		part: "null",
		type: "text"
	}, {
		name: "Source",
		title: "Comes from CBM installation",
		type: "PrgComponent",
		foreignKey: "PrgComponent.ID",
		editorType: "comboBox",
		optionDataSource: "PrgComponent",
		valueField: "ID",
		displayField: "SysCode",
		pickListWidth: 500,
		pickListFields: [{
		  name: "ID",
		  width: 50
		  }, {
		  name: "SysCode"
		  }, {
		  name: "Description"
		  }
		],
		pickListProperties: {
			loadDataOnDemand: false,
			canHover: true,
			showHover: true,
			cellHoverHTML: function (record) {
				return record.SysCode ? record.SysCode : "[no Code]";
				}
		},
		inList: true
	}, {
		name: "Concept",
		title: "Concept",
		type: "Concept",
		length: 1000,
		foreignKey: "Concept.ID",
		editorType: "comboBox",
		optionDataSource: "Concept",
	// !!! >>> Don't use this with null!!!	optionCriteria: "null",
		valueField: "ID",
		displayField: "SysCode",
		pickListWidth: 500,
		pickListFields: [{
		  name: "ID",
		  width: 50
		  }, {
		  name: "SysCode"
		  }, {
		  name: "Description"
		  }
		],
		pickListProperties: {
			loadDataOnDemand: false,
			canHover: true,
			showHover: true,
			cellHoverHTML: function (record) {
				return record.SysCode ? record.SysCode : "[no Code]";
				}
		},	
		inList: true 
	}, {
		name: "Actual",
		title: "Actual",
		inList: true,
		type: "boolean"
	}] 
});
