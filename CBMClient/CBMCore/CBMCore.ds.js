//======================= Technological DataSources ===========================
isc.CBMDataSource.create({
    ID: "UserRights",
    dbName: Window.default_DB,
    fields: [{
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
    }]
});

isc.CBMDataSource.create({
    ID: "WindowSettings",
    dbName: Window.default_DB,
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
    dbName: Window.default_DB,
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
	dbName: Window.default_DB,
	titleField: "SysCode",
	infoField: "Description",
	isHierarchy: true,
//	cacheAllData: true, 
	MenuAdditions: [{
		isSeparator: true
    }, {
			title: "Objects of this Concept",
			icon: isc.Page.getAppImgDir() + "View.png",
			click: function() {
					createTable(this.context.getSelectedRecord()["SysCode"]);
					return false;
			},
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
		
	beforeCopy: function(srcRecord, callbacks) {
		var record = this.copyRecord(srcRecord);
			record.SysCode = record.SysCode + " (copy! - must modify!)"
		return record;
	},

	afterCopy: function(record, callback) {
		// --- Attributes to Class pointer ---
		var prgClass;
		var relations; 
		var relationDSCache = isc.DataSource.get("Relation").getCacheData();
		var attribute; 
		// -- Get collections objects --
		prgClass = isc.DataSource.get("PrgClass").getCacheData().find({ForConcept: record.ID, Actual: true});
		relations = relationDSCache.findAll({ForConcept: record.ID});
		// -- Data repairing cycle --
		if (relations && prgClass) {
			for (var i = 0; i<relations.length; i++){
				attribute = isc.DataSource.get("PrgAttribute").getCacheData().find({ForRelation : relations[i].ID});
				if (attribute) {
					attribute.ForPrgClass = prgClass.ID; // <<< PrgClass link substitute
					updateDataTransactional(attribute);
				}
			}
		}
		// --- Fields to Relation pointer ---
		var prgView;
		var prgViewFields; 
		// -- Get collections objects --
		prgView = isc.DataSource.get("PrgView").getCacheData().find({ForConcept: record.ID, Role: "main"});
		if (prgView) {
			prgViewFields = isc.DataSource.get("PrgViewField").getCacheData().findAll("ForPrgView", prgView.ID); 
			if (prgViewFields) {
				for (var i = 0; i<prgViewFields.length; i++) {
					var relationOld = relationDSCache.find({ID : prgViewFields[i].ForRelation});
					if (relationOld) {
						var relationCurrent = relationDSCache.find({SysCode: relationOld.SysCode, ForConcept: record.ID});
					}
					if (relationCurrent) {
						prgViewFields[i].ForRelation = relationCurrent.ID; // <<< Relation link substitute
						updateDataTransactional(prgViewFields[i]);
					}	
				}
			}
		} 
		if (callback) {
			callback([record]);
		}
	},
	

  fields: [{
        name: "Del",
        type: "boolean",
        hidden: true
    }, {
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
        editorType: "comboBox",
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
        }],
        pickListProperties: {
            loadDataOnDemand: false,
            canHover: true,
            showHover: true,
            cellHoverHTML: function(record) {
                return record.SysCode ? record.SysCode : "[no Code]";
            }
        },
        inList: true,
        changed: function() {
            // TODO form - isn't variant here!!! Temporary choice... (Really? - Think more!)
            this.form.setValue("HierCode",
                conceptRS.find({
                    "ID": (this.form.values["BaseConcept"])
                })["HierCode"] + this.getValue() + ",");
        }
    }, {
        name: "HierCode",
        type: "text",
        title: "Hierarchy full path",
        inList: false
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
        name: "Primitive",
        type: "boolean",
        title: "Primitive Type"
    }, {
        name: "Abstract",
        type: "boolean",
        title: "Abstract class"
    }, {
        name: "AbnormalInherit",
        type: "boolean",
        title: "Abnormal Inheritance"
    }, {
        name: "Author",
        type: "PrgComponent", // TODO : Substitute with Party DS when possible
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
        name: "Relations",
        type: "custom",
        canSave: true,
        editorType: "OneToManyAggregate",
        relatedConcept: "Relation",
        BackLinkRelation: "ForConcept",
        mainIDProperty: "ID",
        copyLinked: true,
        deleteLinked: true,
        showTitle: false,
        UIPath: "Properties"
    }, {
        name: "Classes",
        type: "custom",
        title: "Program classes and storage aspects",
        canSave: true,
        copyLinked: true,
				copyFilter: ", \"Actual\":\"true\"", // Copied only single active PrgClass
        deleteLinked: true,
        editorType: "OneToManyAggregate",
        relatedConcept: "PrgClass",
        BackLinkRelation: "ForConcept",
        mainIDProperty: "ID",
        showTitle: true,
        titleOrientation: "top",
        colSpan: 4,
        UIPath: "Information System aspects"
    }, {
        name: "Views",
        type: "custom",
        title: "Interface presentations",
        canSave: true,
        copyLinked: true,
				copyFilter: ", \"Role\":\"main\"", // Copied only default View
        deleteLinked: true,
        editorType: "OneToManyAggregate",
        relatedConcept: "PrgView",
        BackLinkRelation: "ForConcept",
        mainIDProperty: "ID",
        showTitle: true,
        titleOrientation: "top",
        colSpan: 4,
        UIPath: "Information System aspects"
    }]
});


isc.CBMDataSource.create({
    ID: "PrgClass",
    dbName: Window.default_DB,
    //    titleField: "SysCode",
    titleField: "Description",
    infoField: "Notes",
//	cacheAllData: true, 
    fields: [{
            name: "Del",
            type: "boolean",
            hidden: true
        }, {
            name: "ForConcept",
            type: "Concept",
            foreignKey: "Concept.ID",
            relationStructRole: "ID",
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
            }],
            inList: true
        },
        /*  TODO: Investigate why includeFrom does not work { 
        			name: "SysCode",
        			includeFrom: "Concept.SysCode", 
        			title: "Concept Code",
        //			hidden:"true",
                    inList: true
        		}, */
        {
            name: "Description",
            type: "multiLangText",
            inList: true
        }, {
            name: "Actual",
            type: "boolean",
            inList: true
        }, {
            name: "PrgVersion",
            type: "PrgVersion",
            title: "Version",
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
            }],
            inList: true
        },
        /* TODO: Investigate why includeFrom does not work { 
        			name: "VersCode",
        			includeFrom: "PrgVersion.SysCode", 
        			title: "Version Code",
                    inList: true
        		}, */
        {
            name: "Notes",
            type: "multiLangText",
            inList: true
        }, {
            name: "ExprToString",
            type: "text"
        }, {
            name: "ExprToStringDetailed",
            type: "text"
        }, {
            name: "DataBaseStore",
            type: "DataBaseStore",
            title: "DataBase Store",
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
            }]
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
            type: "text"
        }, {
            name: "PrgType",
            type: "text"
        }, {
            name: "MenuAdditions",
            type: "text"
        }, {
            name: "CreateFromMethods",
            type: "text"
        }, {
            name: "IsHierarchy",
            type: "boolean",
            title: "Hierarchical"
        },
        {
            name: "Attributes",
            type: "custom",
            canSave: true,
            editorType: "OneToMany",
//						copyLinked: true,
						deleteLinked: true,
            relatedConcept: "PrgAttribute",
            BackLinkRelation: "ForPrgClass",
            mainIDProperty: "ID",
            showTitle: false,
            UIPath: "Attributes"//,
//            hidden: true
        },
        {
            name: "Functions",
            type: "custom",
            canSave: true,
            copyLinked: true,
            deleteLinked: true,
            editorType: "OneToManyAggregate",
            copyLinked: true,
            deleteLinked: true,
            relatedConcept: "PrgFunction",
            BackLinkRelation: "ForPrgClass",
            mainIDProperty: "ID",
            showTitle: false,
            UIPath: "Functions"
        }
    ]
});

// --- Functions (methods) and even functional blocks for PrgClasses
isc.CBMDataSource.create({
    ID: "PrgFunction",
    dbName: Window.default_DB,
    titleField: "SysCode",
    infoField: "Description",
    fields: [{
        name: "Del",
        type: "boolean",
        hidden: true
    }, {
        name: "SysCode",
        type: "text",
        title: "Function name",
        length: 200,
        required: true,
        inList: true
    }, {
        name: "ForPrgClass",
        type: "PrgClass",
        title: "Program Class of this Function",
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
    dbName: Window.default_DB,
    titleField: "SysCode",
    infoField: "Description",
    fields: [{
        name: "Del",
        type: "boolean",
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
    }]
});

isc.CBMDataSource.create({
    ID: "DataBaseStore",
    dbName: Window.default_DB,
    titleField: "SysCode",
    infoField: "Description",
    fields: [{
        name: "Del",
        type: "boolean",
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
    dbName: Window.default_DB,
//	cacheAllData: true, 
    titleField: "SysCode",
    infoField: "Description",
    fields: [{
        name: "Del",
        type: "boolean",
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
        }],
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
        }],
        inList: true
    }, {
        name: "RelationRole",
        type: "Concept",
        title: "Semantic meaning of Relation",
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
        }]
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
        }],
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
        }],
        inList: true
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
        }]
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
        }]
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
        }]
    }, {
        name: "Domain",
        type: "text",
        title: "Domain restrictions",
        titleOrientation: "top",
        colSpan: 2,
        length: 1000
    }, {
        name: "Notes",
        type: "multiLangText",
        title: "Notes",
        titleOrientation: "top",
        colSpan: 2,
        length: 2000
    }, {
        name: "ISAspects",
        type: "custom",
        title: "Information System aspects",
        canSave: true,
        editorType: "OneToManyAggregate",
        copyLinked: true,
        deleteLinked: true,
        relatedConcept: "PrgAttribute",
        BackLinkRelation: "ForRelation",
        mainIDProperty: "ID",
        titleOrientation: "top"
            /*, 
                        showTitle: false ,
                        UIPath: "Information System aspects" */
    }, {
        name: "UIAspects",
        type: "custom",
        title: "User Interface aspects",
//        canSave: true,
        editorType: "OneToMany",
        // copyLinked: true,
        // deleteLinked: true,
        relatedConcept: "PrgViewField",
        BackLinkRelation: "ForRelation",
        mainIDProperty: "ID",
        titleOrientation: "top"
    }],
    // --- Additional settings for
    edit: function(record, context) {
        // TODO : change to metadata - provided Filter
        this.fields["BackLinkRelation"].optionCriteria = {
            ForConcept: record["RelatedConcept"]
        };
        this.Super("edit", arguments);
    }

});

isc.CBMDataSource.create({
    ID: "PrgAttribute",
    dbName: Window.default_DB,
//	cacheAllData: true, 
    titleField: "SysCode",
    infoField: "DisplayName",
		afterCopy: function(record, context) {
//			record.ForPrgClass = record.ForRelation; //.ForConcept; // TODO: Concept - current PrgClass contain
		},
    fields: [{
            name: "Del",
            type: "boolean",
            hidden: true
//						inList: true
        }, {
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
            }],
            inList: true
        },
        /* TODO: Investigate why includeFrom does not work {
        			name: "RelCode",
        			type: "Text",
        			includeFrom: "Relation.SysCode", 
        			title: "Code",
                    inList: true
        		},*/
        {
            name: "ForPrgClass",
            type: "PrgClass",
            foreignKey: "PrgClass.ID",
            title: "Program Class of this Property",
            editorType: "comboBox",
            optionDataSource: "PrgClass",
            valueField: "ID",
            displayField: "Description",
            pickListWidth: 450,
            pickListFields: [{
                name: "ID",
                width: 30
            }, {
                name: "SysCode"
            }, {
                name: "Description"
            }],
            inList: true
        },
        /* TODO: Investigate why includeFrom does not work { 
        			name: "ClassVersionCode",
        			type: "text",
        			includeFrom: "PrgClass.PrgVersion.SysCode", 
        			title: "Version of Class",
        //			hidden:"true",
                    inList: true
        		},*/
        {
            name: "DisplayName",
            type: "multiLangText",
            inList: true
        }, {
            name: "Notes",
            type: "multiLangText",
            inList: true
        }, {
            name: "Mandatory",
            type: "boolean",
            title: "Mandatory"
        }, {
            name: "IsPublic",
            type: "boolean",
            title: "IsPublic"
        }, {
            name: "LinkFilter",
            type: "text",
            titleOrientation: "top",
            colSpan: 2,
            length: 4000
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
            name: "CopyFilter",
            type: "text",
            title: "Filter of copied records"
        }, {
            name: "DeleteLinked",
            type: "boolean",
            title: "Delete Linked"
        }, {
            name: "Modified",
            type: "boolean",
            title: "Modified"
        }, {
            name: "RelationStructRole",
            type: "text"
        }, {
            name: "Size",
            type: "integer",
            defaultValue: 0
        }, {
            name: "DBTable",
            type: "text",
            inList: true
        }, {
            name: "DBColumn",
            type: "text",
            inList: true
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
            name: "Part",
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
            type: "text",
            title: "Root ID"
        }
    ]
});

isc.CBMDataSource.create({
    ID: "RelationKind",
    dbName: Window.default_DB,
    titleField: "SysCode",
    infoField: "Description",
    fields: [{
        name: "Del",
        type: "boolean",
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
        title: "Description",
        titleOrientation: "top",
        colSpan: 2,
        length: 2000,
        inList: true
    }, {
        name: "Notes",
        type: "multiLangText",
        title: "Relation Kind explained",
        titleOrientation: "top",
        colSpan: 2,
        length: 4000
    }]
});

// ----- Presentation Views group ----------------------------
isc.CBMDataSource.create({
    ID: "PrgView",
    dbName: Window.default_DB,
//	cacheAllData: true, 
    titleField: "SysCode",
    infoField: "Description",
    // MenuAdditions: [{
    // isSeparator: true
    // }, {
    // title: "Generate default view",
    // icon: isc.Page.getAppImgDir() + "add.png",
    //         click: "SendCommand(\"GenerateDS\", \"POST\", {forType:this.context.getSelectedRecord()[\"SysCode\"]}, null ); return false;"
    // click: "SendCommand(\"GenerateDefaultView\", \"POST\", {forType: this.context.getSelectedRecord()[\"SysCode\"]}, null ); return false;"
    // }
    // ],
    // 	Actions for instance creation from another entity. (Prepared as ready Menu data from CBM Metadata by Server)
    MenuAdditions: [{
        title: "Generate DS text",
        icon: isc.Page.getAppImgDir() + "edit.png",
        click: function() {
            generateDStext(this.context.getSelectedRecord()["SysCode"], function(dsText) {
                isc.say(beautifyJS(dsText));
            })
        }
    }, {
        title: "Generate DS immedeately",
        icon: isc.Page.getAppImgDir() + "edit.png",
        click: function() {
            generateDStext(this.context.getSelectedRecord()["SysCode"], function(dsText) {
                eval(dsText);
            })
        }
    }],
    CreateFromMethods: [{
        title: "From Class",
        showHover: true,
        cellHover: "Create View from (better say For) Concept",
        icon: isc.Page.getAppImgDir() + "add.png",
        click: function(topElement) {
            createTable("Concept", arguments[0].context, this.createRecordsFunc);
            return false;
        },
        createRecordsFunc: function(srcRecords, context) {
            createFrom(srcRecords, function(srcRecord) {
                return "PrgView";
            }, PrgView.CreateFromMethods[0].createViewFromPrgClass, context);
        },
        createViewFromPrgClass: function(dstRec, srcRec) {
            // --- Create standard fields
            // dstRec["SysCode"] = srcRec["SysCode"];
            // --- Create class - specific fields
            // dstRec["ForConcept"] = conceptRS.find("SysCode", srcRec["SysCode"])["ID"];
            // dstRec["Description"] = conceptRS.find("SysCode", srcRec["SysCode"])["Description"];
            // dstRec["Notes"] = "UI View for " + conceptRS.find("SysCode", srcRec["SysCode"])["Description"];
            // --- Create Fields from Attributes
            SendCommand("GenerateDefaultView", "POST", {
                forType: srcRec["SysCode"]
            }, null);
        }
    }],

    fields: [{ 
        name: "Del",
        type: "boolean",
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
        }],
        inList: true
    }, {
        name: "Description",
        type: "multiLangText",
        inList: true
    }, {
        name: "Notes",
        type: "multiLangText",
        inList: true
    }, { 
        name: "Actual",
        type: "boolean",
        inList: true
    }, { 
        name: "Role",
        type: "text",
        title: "View role",
        inList: true
    }, {
        name: "Fields",
        type: "custom",
        copyLinked: true,
        deleteLinked: true,
        canSave: true,
        editorType: "OneToManyAggregate",
        relatedConcept: "PrgViewField",
        BackLinkRelation: "ForPrgView",
        mainIDProperty: "ID",
        showTitle: false
    }]
});

isc.CBMDataSource.create({
    ID: "PrgViewField",
    dbName: Window.default_DB,
//	cacheAllData: true, 
    titleField: "SysCode",
    infoField: "Description",
    // 	Actions for instance creation from another entity.
    CreateFromMethods: [{
			title: "From Class Attributes",
			showHover: true,
			cellHover: "Create View from (better say For) Class",
			icon: isc.Page.getAppImgDir() + "add.png",
			click: function(topElement) {
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
			createRecordsFunc: function(srcRecords, context) {
				if (typeof(srcRecords) == 'undefined' || srcRecords == null) {
						return;
				}
				createFrom(
					srcRecords, function(srcRecord) {
							return "PrgViewField";
					},
					PrgViewField.CreateFromMethods[0].createPrgViewFieldFromPrgAttribute,
					context);
			},
			createPrgViewFieldFromPrgAttribute: function(dstRec, srcRec, PrgView) {
				if (typeof(srcRec) == 'undefined' || srcRec == null) {
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
    }],

    fields: [{
        name: "Del",
        type: "boolean",
        hidden: true
    }, {
        name: "Odr",
        type: "integer",
        title: "Sequence in UI",
        inList: true
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
        }]
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
        }]
    }, {
        name: "UIPath",
        type: "text",
        title: "UI section (tab) name",
        inList: true
    }, {
        name: "Mandatory",
        type: "boolean",
        title: "Mandatory"
    }, {
        name: "Hidden",
        type: "boolean",
        title: "Hidden"
    }, {
        name: "InList",
        type: "boolean",
        title: "Show in List",
        inList: true
    }, {
        name: "ViewOnly",
        type: "boolean",
        title: "Not in model - UI only"
    }, {
        name: "ShowTitle",
        type: "boolean",
        title: "Show title"
    }, {
        name: "Editable",
        type: "boolean",
        title: "Is Editable"
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
        length: 1000
    }, {
        name: "CreateFromMethods",
        type: "text",
        title: "Program code for create from methods",
        titleOrientation: "top",
        colSpan: 2,
        length: 19000
    }, 
		// Below fields that describe properties of complicated relation controls
		{
        name: "DataSourceView",
        type: "text",
        title: "Source data"
    }, {
        name: "ValueField",
        type: "text",
        title: "Link Field (ID usually)"
    }, {
        name: "DisplayField",
        type: "text",
        title: "Attribute to display"
    }, {
        name: "PickListWidth",
        type: "integer",
        title: "List width"
    }, {
        name: "PickListFields",
        type: "text",
        title: "~|en-EN|Pick list Fields~|ru-RU|Поля для выпадающего списка",
        titleOrientation: "top",
        colSpan: 2,
        length: 2000
    }]
});

//--- Menu metadata DS ---
isc.CBMDataSource.create({
    ID: "PrgMenu",
    dbName: Window.default_DB,
    titleField: "SysCode",
    infoField: "Description",
    fields: [{
        name: "Del",
        type: "boolean",
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
        type: "custom",
        copyLinked: true,
        deleteLinked: true,
        canSave: true,
        editorType: "OneToManyAggregate",
        relatedConcept: "PrgMenuItem",
        BackLinkRelation: "ForMenu",
        mainIDProperty: "ID",
        showTitle: false
    }]
});

isc.CBMDataSource.create({
    ID: "PrgMenuItem",
    dbName: Window.default_DB,
    titleField: "Description",
    infoField: "SysCode",
    isHierarchy: true,
    fields: [{
        name: "Description",
        type: "multiLangText",
        title: "Description of Item",
        titleOrientation: "top",
        colSpan: 2,
        length: 400,
        inList: true
    }, {
        name: "Odr",
        type: "integer",
        title: "Order",
        length: 4,
        //hidden: true,
        required: true,
        inList: true
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
        emptyMenuMessage: "No Items",
        canSelectParentItems: true,
        pickListWidth: 450,
        pickListFields: [{
            name: "ID",
            width: 30
        }, {
            name: "SysCode"
        }, {
            name: "Description"
        }],
        pickListProperties: {
            loadDataOnDemand: false,
            canHover: true,
            showHover: true,
            cellHoverHTML: function(record) {
                return record.SysCode ? record.SysCode : "[no Code]";
            }
        },
        inList: true,
        hidden: true
    }, {
        name: "ForMenu",
        type: "PrgMenu",
        title: "Menu to which this Item belongs",
        editorType: "comboBox",
        optionDataSource: "PrgMenu",
        valueField: "ID",
        displayField: "Description"
    }, {
        name: "SysCode",
        type: "text",
        title: "Code of Concept called by this Item",
        length: 100,
        required: true,
        inList: true
    }, {
        name: "CalledConcept",
        type: "Concept",
        title: "Concept called by this Item",
        editorType: "comboBox",
        optionDataSource: "Concept",
        valueField: "ID",
        displayField: "Description"
    }, {
        name: "CalledMethod", // TODO: substitute with Method link
        type: "PrgComponent",
        title: "Called method",
        defaultValue: 0
    }, {
        name: "Args",
        type: "text",
        title: "Called method Arguments",
        titleOrientation: "top",
        colSpan: 2,
        length: 2000
    }]
});

//========================================================================
//============ CBM actual Domain Model Classes (DataSources) =============
//========================================================================
isc.CBMDataSource.create({
    ID: "PrgComponent",
    dbName: Window.default_DB,
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
        }]
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
        }],
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
    }, {
        name: "Description",
        type: "multiLangText",
        title: "Description",
        inList: true
    }]
});

// =====^^^===== END Core DS definitions =====^^^=====