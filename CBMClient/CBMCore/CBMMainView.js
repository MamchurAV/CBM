﻿//===========================================================================
// =========== Some widely-used objects declarations ====================

isc.RPCManager.allowCrossDomainCalls = true;

// ------- Declare full Windows UI settings for current User from server-side 
var windowSettingsRS = isc.ResultSet.create({
    dataSource: "WindowSettings",
		fetchMode: "local"
});
//windowSettingsRS.getDataSource().setCacheAllData(true);

// ------- Declare full List Columns UI settings for current User from server-side
var listSettingsRS = isc.ResultSet.create({
		dataSource: "ListSettings",
		fetchMode: "local"
});
//listSettingsRS.getDataSource().setCacheAllData(true);

// ------- Metadata providers for all in-browser application
// ------- Declare full PrgViews array from server-side DB-stored metadata ------
// ------ (related to presentation level implementation - isc DataSources) ------

// --- Loads statically (in JS file) defined apply (non-system) Data Sources ---
// May be done with appropriate localization
var loadStaticDataSources = function(){
	 var scriptDS = document.createElement("script");
	 scriptDS.type = "text/javascript";
	 scriptDS.src = "CBMCore/CBMApply.ds.js";
	 document.head.appendChild(scriptDS); 
};

// --- Create dynamically from Metadata apply (non-system) Data Sources ---
//     May be done with appropriate localization
var createDataSources = function(){
	// TODO: some User-specific criteria  	viewRS.setCriteria({"ForPrgView": }); 
	var views = viewRS.getAllVisibleRows();
	if (!views || views == null) return;
	var i = -1;
	var recursiveDS = function(){
		i += 1;
		if (i+1 < views.length) {
			testDS(views[i].SysCode, recursiveDS);
		}
	}
	recursiveDS();
};

// ------- Load full User Rights data from server-side -------
// UserRights plays special role - first authorized data request 
//   that provide hand-shaking stage of authentication on server.
// Another role - on this RS load fulfilling - main part of CBM begins execution.  
var userRightsRS = isc.ResultSet.create({
    dataSource: "UserRights",
    dataArrived: function(startRow, endRow)	{
			// --- Clear cookies after first data arrival ---
			clearUnusedCookies();

			// --- Special actions - run program further if success credentials test
			if (typeof(loginWindow)!="undefined" && loginWindow != null)
			{
				loadCommonData();
				loginWindow.destroy(); 
				// --- Make some delay to let all initial data and locale files to be loaded
				isc.Timer.setTimeout(runMainView, 200);
			}
		}
});

var curr_User = isc.Offline.get("LastUser");;
var curr_System = isc.Offline.get("LastSystem");
var curr_Img = "";
var curr_Session;
var curr_Date = moment.utc(isc.Offline.get("LastDate"));
if (typeof(curr_Date) == "undefined" || curr_Date == null || (typeof(curr_Date) != "undefined" && curr_Date != null && !curr_Date.isValid())){
	curr_Date = moment().utc();
}
var default_DB = "PostgreSQL.CBM"; // dbName: "MySQL.CBM", //    dbName : "DB2.CBM",

// ----------------- Anonymous initial loadings zone --------------------
//curr_User =	"anonymous";
//curr_Img = "Ch5uPa_7e_KaB_ohR21adUzqp2g8q1";
// -------------------------- End of anonymous loading zone ------------------------


// ======================== Application activation ==========================
// ---- User-dependent settings and metadata loading
var loadCommonData = function()
{		
	navigationTree.fetchData();
	
	// Conceptual metadata
	isc.DataSource.get("Concept").fetchData(null,
		function(dsResponce, data, dsRequest){
			window.conceptRS = isc.ResultSet.create({
			dataSource: "Concept",
			allRows: data,
			//fetchMode: "local",
			});			
			isc.DataSource.get("Relation").fetchData(null,
				function(dsResponce, data, dsRequest){
					window.relationRS = isc.ResultSet.create({
					dataSource: "Relation",
					allRows: data,
					//fetchMode: "local"
					});	
					isc.DataSource.get("RelationKind").fetchData(null,
						function(dsResponce, data, dsRequest){
							window.relationKindRS = isc.ResultSet.create({
							dataSource: "RelationKind",
							allRows: data,
							//fetchMode: "local"
							});	
							// --- Program aspects metadata	
							isc.DataSource.get("PrgClass").fetchData(null,
								function(dsResponce, data, dsRequest){
									window.classRS = isc.ResultSet.create({
									dataSource: "PrgClass",
									allRows: data,
									//fetchMode: "local"
									});			
									isc.DataSource.get("PrgAttribute").fetchData(null,
										function(dsResponce, data, dsRequest){
											window.attributeRS = isc.ResultSet.create({
											dataSource: "PrgAttribute",
											allRows: data,
											//fetchMode: "local",
											updatePartialCache: true
											});	
											// Presentation aspects metadata
											isc.DataSource.get("PrgView").fetchData(null,
												function(dsResponce, data, dsRequest){
													window.viewRS = isc.ResultSet.create({
													dataSource: "PrgView",
													allRows: data,
													//fetchMode: "local",
													updatePartialCache: true
													});			
													isc.DataSource.get("PrgViewField").fetchData(null,
														function(dsResponce, data, dsRequest){
															window.viewFieldRS = isc.ResultSet.create({
															dataSource: "PrgViewField",
															allRows: data,
															//fetchMode: "local",
															updatePartialCache: true
															});			
	//														createDataSources();
														});
												});
										});
								});
						});
				});
		});
		
	windowSettingsRS.criteria={ForUser : curr_User};
	windowSettingsRS.getRange(0,10000); // Hope that will be enough to cash all (local fetchMode!)
	
	listSettingsRS.criteria={ForUser : curr_User}; 
	listSettingsRS.getRange(0,10000); // Hope that will be enough to cash all (local fetchMode!)
}


// ====================== UI Structures ========================
// --- Login dialog sectionb ---
isc.Window.create({
    ID: "loginWindow",
    title: "Welcome to CBM-based system",
    autoDraw: false,
    autoSize:true,
    autoCenter: true,
    isModal: true,
    showModalMask: true,
	contentLayout: "horizontal", 
 //   closeClick : function () { touchButton.setTitle('Touch This'); this.Super("closeClick", arguments)},
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
          {name: "field3", title:"Your location", editorType: "comboBox",
					valueMap: langValueMap,
					valueIcons: langValueIcons,
					imageURLPrefix: flagImageURLPrefix,
					imageURLSuffix: flagImageURLSuffix,
					value: curr_Lang, 
					prompt: "Choose Your locale (language)", 
					hoverWidth: "170"
					},
					{defaultValue:"", type: "header"},
					{name: "field1", title:"Login", value: curr_User, prompt: "Enter Your login-name", hoverWidth: "130"},
					{name: "field2", title:"Password", type:"password", value: curr_Img, prompt: "Enter Your password", hoverWidth: "120", 
						keyUp: function(item, form, keyName){ 
								if (keyName === "Enter") { form.focusInItem("go"); loginClose(); } 
							} 
					},
					{name: "field5", title:"Confirm password", type:"password", visible: false, prompt: "Confirm password", hoverWidth: "110" },
//					{defaultValue:"", type: "header"},
					{name: "field4", title:"System Instance", editorType: "comboBox",
					valueMap : {
							"Work" : "My Company",
							"Test" : "Тестовая БД",
							"CBM" : "CBM Global"},
					value: curr_System , 
					prompt: "Choose CBM instance You want to work with", 
					hoverWidth: "190" 
					},
					{type: "button", title: "Registration", width: "100", endRow: false, click: "form.items[2].show();", prompt: "Press if You are new CBM user, to register yourself in the system", hoverWidth: "200" },
					{type: "button", id: "go", name: "go", title: "Enter Program", width: "150", startRow: false, click: "loginClose();", prompt: "Press to start work in CBM", hoverWidth: "150" }
        ]
      })
	]
});

var loginClose = function()
{
	curr_Img = B64.encode(((loginWindow.items[1]).getFields())[3].getValue());
	curr_User = ((loginWindow.items[1]).getFields())[2].getValue();
	curr_Lang = ((loginWindow.items[1]).getFields())[0].getValue();
	tmp_Lang = curr_Lang;
	curr_System = ((loginWindow.items[1]).getFields())[5].getValue();
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
    loadStaticDataSources(); 
	
	// --- Reset session Isomorphic messages locale according to user choice
	if (curr_Lang !== "en-GB") {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "isomorphic/locales/frameworkMessages_" + curr_Lang.substr(0,2) + ".properties";
		document.head.appendChild(script); 
	}

	// --- TODO - switch to locale format
	var dateTimeFormat = "ddd DD-MM-YYYY HH:mm";
	isc.Date.setShortDatetimeDisplayFormat(function(){
		return moment(this.toString()).format(dateTimeFormat)});
	isc.Date.setNormalDatetimeDisplayFormat("toEuropeanShortDatetime");
	isc.Date.setInputFormat("DMY");
	isc.Date.setDefaultDateSeparator("/");
	mainControlPanel.getFields()[0].setValue(curr_Date.local().format(dateTimeFormat));

	 if (typeof(curr_User)=="undefined" || curr_User == null || curr_User==""){
	 isc.warn("Sory, but Login is mandatory. \r\n Enter Your login please...");
	 } else if (typeof(curr_Img)=="undefined" || curr_Img == null || curr_Img==""){
		isc.warn("Sory, but Password is mandatory. \r\n Enter Your password please...");
	 } else if (this.setUser()) {
		return true;
	 } else {
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
				isc.warn("Something wrong with cookies. Check if cookies are enabled in Your browser");
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
			var tmpImg = UUID.generate();
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

// ------------------------- Application UI layout --------------------------
isc.TreeGrid.create({
	ID:"navigationTree",
    dataSource:"PrgMenuItem",
	nodeClick : function(viewer,node,recordNum) { 
		createTable(node.SysCode); 
		return false;
	},
  showHeader:false,
	fields:[
			{name:"Description"/*, name:"ForMenu" *//*, name:"CalledConcept"*/}
		],
    leaveScrollbarGap:false,
    animateFolders:true,
    animateRowsMaxTime:500,
    canReparentNodes:false,
	  loadDataOnDemand: false,
    selectionType:"single",
//	  criteria: {"ForMenu": "846ad9be-2aef-11e4-8209-0fa65c86c9e3"}, //b9ec6dd1-cf18-456b-8059-bbf4276ecf67
	  criteria: {"SysCode": "Concept"}, //b9ec6dd1-cf18-456b-8059-bbf4276ecf67
	  showAllRecords: true // Main navigator won't be too large in all cases (not thousands items...)
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
		this.Super("show");
	}
});

// --- Main application UI activation ---
//   Called after successful login
var runMainView = function()
{ 
	mainPageLayout.draw(); 
};


// =================== Application starts with Login window =============
loginWindow.show();


// ================================ The End =================================
