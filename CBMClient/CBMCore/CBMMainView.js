//======================= Technological DataSources ===========================
isc.CBMDataSource.create({
    ID: "UserRights",
    dbName: Window.default_DB,
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
    dbName: Window.default_DB,
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
        }
    ]
});

// ----- Concept DS ----------------------------
isc.CBMDataSource.create({
    ID: "Concept",
    dbName: Window.default_DB,
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
            type: "multiLangText",
//            editorType: "MultilangTextItem",
            title: "Description",
            inList: true
        }, {
            name: "Notes",
            type: "multiLangText",
//            editorType: "MultilangTextItem",
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
            name: "Properties",
            type: "custom",
            canSave: true,
            editorType: "BackLink",
            relatedConcept: "Relation",
            backLinkRelation: "ForConcept",
            mainIDProperty: "ID",
            showTitle: false,
            UIPath: "Properties"
        }, {
            name: "Classes",
            type: "custom",
			title: "Program classes and storage aspects",
            canSave: true,
            editorType: "BackLink",
            relatedConcept: "PrgClass",
            backLinkRelation: "ForConcept",
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
            editorType: "BackLink",
            relatedConcept: "PrgView",
            backLinkRelation: "ForConcept",
            mainIDProperty: "ID",
            showTitle: true,
			titleOrientation: "top", 
            colSpan: 4,
            UIPath: "Information System aspects"
        }
    ]
});

//--- Menu metadata DS ---
isc.CBMDataSource.create({
    ID: "PrgMenu",
    dbName: Window.default_DB,
    titleField: "SysCode",
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
            length: 1000,
            inList: true
        }, {
            name: "Items",
            type: "custom",
            canSave: true,
            editorType: "BackLink",
            relatedConcept: "PrgMenuItem",
            backLinkRelation: "ForMenu",
            mainIDProperty: "ID",
            showTitle: false 
        }
    ]
});


isc.CBMDataSource.create({
    ID: "PrgMenuItem",
    dbName: Window.default_DB,
    titleField: "Description",
    infoField: "SysCode",
    isHierarchy: true,
    fields: [ {
            name: "Description",
            type: "text",
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
		   hidden: true
       }, {
            name: "SysCode",
            type: "text",
            title: "Code of Concept called by this Item",
            length: 100,
            required: true,
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
        }
    ]
});


// =========== Some initial data structures declarations ====================

isc.RPCManager.allowCrossDomainCalls = true;

// ------- Load full User Rights data from server-side -------
// UserRights plays special role - first authorized data request that initiate autentication on server
var userRightsRS = isc.ResultSet.create({
    dataSource: "UserRights",
    dataArrived: function(startRow, endRow)
	{
		// --- Clear cookies after first data arrival ---
		clearUnusedCookies();

		// --- Special actions - go program further if success credentials test
		if (typeof(loginWindow)!="undefined" && loginWindow != null)
		{
			loginWindow.destroy(); 
			loadCommonData();
			// --- Make some delay to let all initial data and locale files to be loaded
			var tm = isc.Timer.setTimeout(runMainView(), 200);
		}
	}
});
 
// ------- Load full Windows UI settings for current User from server-side 
var windowSettingsRS = isc.ResultSet.create({
    dataSource: "WindowSettings"
});

// ------- Load full List Columns UI settings for current User from server-side
var listSettingsRS = isc.ResultSet.create({
    dataSource: "ListSettings"//,
//    dataArrived: function(startRow, endRow){}
});

// ------- Load full Classes (DataSources) array from server-side DB-stored metadata ------
var conceptRS = isc.ResultSet.create({
    dataSource: "Concept",
    fetchMode: "paged"//,
//    dataArrived: function(startRow, endRow){}
});



// ======================== Application activation ==========================

// ---------------- Some Global objects (minimal set, I hope...) ----------------------------
var curr_User;
var curr_System;
//var curr_Lang;
//var tmp_Lang;
var curr_Img;
var curr_Session;
var curr_Date;
var default_DB = "PostgreSQL.CBM"; // dbName: "MySQL.CBM", //    dbName : "DB2.CBM",

// ----------------- Anonymous initial loadings zone --------------------
//curr_User =	"anonymous";
//curr_Img = "Ch5uPa_7e_KaB_ohR21adUzqp2g8q1";
 
// ------ Call fetchData() on the tree to load the initially visible categories --------
//navigationTree.fetchData();
//conceptRS.getRange(0,1000);
// conceptRS.getDataSource().setCacheAllData(true);
// conceptRS.getDataSource().fetchData(null, function (dsResponse, data, dsRequest)
			// { conceptRS.getDataSource().setCacheData(data); }); 
// -------------------------- End of anonymous loading zone ------------------------

curr_User =	isc.Offline.get("LastUser");
curr_System = isc.Offline.get("LastSystem");
//curr_Lang =	isc.Offline.get("LastLang");
//tmp_Lang = curr_Lang;
curr_Img = "";
curr_Date = moment.utc(isc.Offline.get("LastDate"));
if (typeof(curr_Date) == "undefined" || curr_Date == null || (typeof(curr_Date) != "undefined" && curr_Date != null && !curr_Date.isValid())){
	curr_Date = moment().utc();
}

// ---- User-dependent settings loading
var loadCommonData = function()
{		
	navigationTree.fetchData();
	conceptRS.getRange(0,1000);
		
	windowSettingsRS.criteria={ForUser : curr_User};
	windowSettingsRS.getRange(0,1000);
	// windowSettingsRS.getDataSource().setCacheAllData(true);
	// windowSettingsRS.getDataSource().fetchData({ForUser : curr_User}, function (dsResponse, data, dsRequest)
			// { windowSettingsRS.getDataSource().setCacheData(data); });
	listSettingsRS.criteria={ForUser : curr_User}; 
	listSettingsRS.getRange(0,1000);
	// listSettingsRS.getDataSource().setCacheAllData(true);
	// listSettingsRS.getDataSource().fetchData({ForUser : curr_User}, function (dsResponse, data, dsRequest)
			// { listSettingsRS.getDataSource().setCacheData(data); });
}


// --------- Page interface activation function (for call from initial screen) -------------
// --- Called after successful login ---
var runMainView = function()
{ 
	// --- Some preventive adjustments before start
	// TODO: - Ho to set validation message for SimpleType later? (just now)
//	isc.currency.validators[0].setProperty("errorMessage", isc.CBMStrings.MoneyType_NotNegative);
	
	// --- Main application start ---
	mainPageLayout.draw(); 
};

// ==========================================================================

isc.Window.create({
    ID: "loginWindow",
    title: "Welcome to CBM-based system",
    autoDraw: false,
    autoSize:true,
    autoCenter: true,
    isModal: true,
    showModalMask: true,
	contentLayout: "horizontal", 
    closeClick : function () { touchButton.setTitle('Touch This'); this.Super("closeClick", arguments)},
    items: [
		isc.Img.create({
			src: isc.Page.getAppImgDir() + "CBM_Logo.png",
			padding: "10"
			}),
        isc.DynamicForm.create({
            autoDraw: false,
			name: "form",
            height: 50,
        	width: 270,
            padding:8,
            fields: [
                {name: "field1", title:"Login", value: curr_User, prompt: "Enter Your login-name", hoverWidth: "130"},
                {name: "field2", title:"Password", type:"password", value: curr_Img, prompt: "Enter Your password", hoverWidth: "120" },
                {name: "field5", title:"Confirm password", type:"password", visible: false, prompt: "Confirm password", hoverWidth: "110" },
                {name: "field3", title:"Your localization", editorType: "comboBox",
					valueMap: langValueMap,
					valueIcons: langValueIcons,
					imageURLPrefix: flagImageURLPrefix,
					imageURLSuffix: flagImageURLSuffix,
					value: curr_Lang, 
					prompt: "Choose Your locale (language)", 
					hoverWidth: "170",
					// pickValue : function (value) {
							// var selectedLocale = this.getValue();
							// var script = document.createElement("script");
							// script.type = "text/javascript";
							// script.src = "isomorphic/locales/frameworkMessages_" + selectedLocale.substr(0,2) + ".properties";
							// document.head.appendChild(script); //or something of the likes
							// }
				},				
                {name: "field4", title:"System Instance", editorType: "comboBox",
                    valueMap : {
                        "Work" : "My Company",
                        "Test" : "My test environment",
                        "CBM" : "CBM Global"},
						value: curr_System , 
						prompt: "Choose CBM instance You want to work with", 
						hoverWidth: "190" 
						},
				{type: "button", title: "Registration", width: "100", endRow: false, click: "form.items[2].show();", prompt: "Press if You are new CBM user, to register yourself in the system", hoverWidth: "200" },
				{type: "button", title: "Enter Program", width: "150", startRow: false, click: "loginClose();", prompt: "Press to start work in CBM", hoverWidth: "150" }
            ]
        })
    ]
});

var loginClose = function()
{
	curr_Img = B64.encode(((loginWindow.items[1]).getFields())[1].getValue());
	curr_User = ((loginWindow.items[1]).getFields())[0].getValue();
	curr_Lang = ((loginWindow.items[1]).getFields())[3].getValue();
	tmp_Lang = curr_Lang;
	curr_System = ((loginWindow.items[1]).getFields())[4].getValue();
 	isc.Offline.put("LastUser", curr_User);
	isc.Offline.put("LastLang", curr_Lang);
	isc.Offline.put("LastSystem", curr_System);
	curr_User = B64.encode(curr_User);
	
	// --- Set CBM localization according to user choice
	// TODO: - Test for locale-file existence
	var scriptCBM = document.createElement("script");
	scriptCBM.type = "text/javascript";
	scriptCBM.src = "locales/strings_" + curr_Lang.substr(0,2) + ".properties";
	document.head.appendChild(scriptCBM); 
	
	// --- Load CBM DataSources, using choosen localization
	loadDataSources(); 
	
	// --- Reset session Isomorphic messages locale according to user choice
	if (curr_Lang !== "en-GB") {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "isomorphic/locales/frameworkMessages_" + curr_Lang.substr(0,2) + ".properties";
		document.head.appendChild(script); 
	}

	// --- TODO - switch to locale format
	var dateTimeFormat = "ddd DD-MM-YYYY HH:mm";
//	isc.Date.setShortDatetimeDisplayFormat("toEuropeanShortDatetime");
	isc.Date.setShortDatetimeDisplayFormat(function(){
		return moment(this.toString()).format(dateTimeFormat)});
	isc.Date.setNormalDatetimeDisplayFormat("toEuropeanShortDatetime");
	isc.Date.setInputFormat("DMY");
	isc.Date.setDefaultDateSeparator("/");
	mainControlPanel.getFields()[0].setValue(curr_Date.local().format(dateTimeFormat));

	 if (typeof(curr_User)=="undefined" || curr_User == null || curr_User==""){
	 isc.warn("Sory, but Login is mandatory. \r\n Enter Your login please...");
	 }
	 else if (typeof(curr_Img)=="undefined" || curr_Img == null || curr_Img==""){
		isc.warn("Sory, but Password is mandatory. \r\n Enter Your password please...");
	 }
	 else if (setUser())
	 {
		return true;
	 }
	 else
	 {
		isc.warn("Sorry, but entered Login or Password is inappropriate");
	 }
	 return false;
};

var setUser = function()
{
	if(typeof(curr_User)!="undefined" && curr_User!= null)
	{
		strCookie = isc.Cookie.get("ImgFirst");
		if (typeof(strCookie) == "undefined" || strCookie == null || strCookie == ""){
			if (isc.Offline.get("lastCookie") == null){
				isc.warn("Something wrong with cookies. Check if Your browser are cookies-enabled");
				return false;
			} else if (isc.Offline.get("lastCookie") != null){
				strCookie = isc.Offline.get("lastCookie");
			}
		} else {
			isc.Offline.put("lastCookie", strCookie);
		}
		var jsonArr = parseJSON("[" + strCookie + "]");
		var jsonCookie = eval("(" + jsonArr[0] + ")"); 
		if (typeof(jsonCookie)!="undefined" && jsonCookie != null ){
			var tmpImg = Math.uuid(16);
			var rsa = new RSAKey();
			rsa.setPublic(jsonCookie.n, jsonCookie.e);
			var txt1 = rsa.encrypt(curr_User + ",img:" + curr_Img + ",tmp:" + tmpImg);
		}
		var txt = B64.encode("k:" + jsonCookie.k + ",img:" + txt1 + ",L:" + curr_Lang + ",B:" + curr_System);
		clearUnusedCookies();
		isc.Cookie.set("ItemImg", txt, "/");
		
		curr_Session = jsonCookie.k;
		curr_Img = "0"; //Switch curr_Img to some other purpouse...

		// userRights result set plays special role - first authorized data request that do test credentials
		userRightsRS.getRange(0,1000);

		return true;
	}
	else
	{
		return false;
	}
};  

// --- Data Sources loading ---
// May be done with appropriate localization
var loadDataSources = function(){
	var scriptDS = document.createElement("script");
	scriptDS.type = "text/javascript";
	scriptDS.src = "CBMCore/CBMCore.ds.js";
	document.head.appendChild(scriptDS); 
};

var clearUnusedCookies = function(){
		if (isc.Cookie.get("ImgFirst") != null ) {
			isc.Cookie.clear("ImgFirst", "/", null); 
		}
		if (isc.Cookie.get("ItemImg") != null) {
			isc.Cookie.clear("ItemImg", "/", null); 
		}
		// --- In addition let's delete some strange guest - Google GLog cookie...
		if (isc.Cookie.get("GLog") != null) {
			isc.Cookie.clear("GLog", "/", null); 
		}
}
// =================== Application starts with Login window =============
loginWindow.show();


// ========================== Application layout ============================

isc.TreeGrid.create({
	ID:"navigationTree",
    dataSource:"PrgMenuItem",
	nodeClick : function(viewer,node,recordNum) { createTable(node.SysCode); return false;},
    showHeader:false,
	fields:[
			{name:"Description"/*, name:"CalledConcept"*/}
		],
    leaveScrollbarGap:false,
    animateFolders:true,
    animateRowsMaxTime:750,
    canReparentNodes:false,
	loadDataOnDemand: false,
    selectionType:"single",
	criteria: {ForMenu: "103"}
});


isc.HTMLPane.create({
	ID:"helpCanvas",
	contentsURL:"CBMCore/CBM_helpText.html",
	overflow:"auto",
    styleName:"defaultBorder",
	padding:10
});

// --- Form for general application controls
isc.DynamicForm.create({
    ID: "mainControlPanel",
    height:15,
    width:120, numCols:2,
    fields: [{
		name: "currDate", type: "datetime", useTextField:true, title:"Date", width:140, 
		changed : function() {
			curr_Date = moment.utc(this.getValue().substring(5)); // --- TODO - extend isc.DatetimeItem to getValue() aware of format
			isc.Offline.put("LastDate", curr_Date.toISOString());
			}
		}]	
});

//var currDate = isc.DateChooser.create();

isc.HLayout.create({
	ID:"mainPageLayout",
	width:"100%",
	height:"100%",
    layoutMargin:2,
	members:[
		isc.SectionStack.create({
			ID:"leftSideLayout",
			width:280,
			showResizeBar:true,
			visibilityMode:"multiple",
            animateSections:true,
			sections:[
				{title: "Main menu", autoShow:true, sectionExpanded:true, items:[navigationTree], 
					controls:[mainControlPanel]},
				{title:"Navigation", sectionExpanded:false, items:[helpCanvas]},
				{title:"Instructions", sectionExpanded:false, items:[helpCanvas]}
			]
		})
	],
	show: function () {
		this.members[0].sections[0].setProperty("title", isc.CBMStrings.MainMenu_Title);
		this.members[0].sections[0].controls[0].getFields()[0].setProperty("title", isc.CBMStrings.MainMenu_DateTime);
		this.members[0].sections[1].setProperty("title", isc.CBMStrings.MainMenu_OpendNavigation);
		this.members[0].sections[2].setProperty("title", isc.CBMStrings.MainMenu_Support);
		this.Super();
	}
});

// ================================ The End =================================
