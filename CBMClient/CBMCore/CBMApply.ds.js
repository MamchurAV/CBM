///////////////////////////////////////////////////////////////////////////////
////////////////////////////// Ayda tools /////////////////////////////////////
//var AYDA_WS_URL = "http://localhost:5000/api/";
//var AYDA_WS_URL = "http://192.168.31.62:5000/api/";
var AYDA_WS_URL = "http://ayda.eastus.cloudapp.azure.com/api/";


///////////////////////////////////////////////////////////////////////////////
/////////////////////////// Ayda - Feed facilities ////////////////////////////

function createPayload(dstRec, srcRec, callback) {
  // Not finished!!! Async flow and quorters escaping...
    var org = isc.DataSource.get('Organization').getCacheData().find({ID: srcRec.Organization});
    dstRec.Payload = '{\
    "id": "' + srcRec.ID + '",\
    "title": "' + srcRec.Name + '",\
    "description": "' + srcRec.Name + '",\
    "isRecommended": ' + srcRec.isRecommended + ',\
    "topRated": ' + srcRec.TopRated + ',\
    "price": "' + srcRec.Price + '",\
    "organization": {\
      "organization_id": "' + srcRec.Organization + '",\
      "organization_name": "' + org.Description + '"\
    },\
    "birthdayDiscount": ' + srcRec.BirthdayDiscount + ',\
    "certificates": ' + srcRec.Certificates + ',\
    "giftCertificates": ' + srcRec.GiftCertificates + ',\
    "forMan": ' + srcRec.ForMan + ',\
    "forWoman": ' + srcRec.ForWoman + ',\
    "forBoy": ' + srcRec.ForBoy + ',\
    "forGirl": ' + srcRec.ForGirl + ',';
    // isc.DataSource.get('Contacts').fetchData(
      // {Offer: srcRec.SourceID},
      // function (dsResponce, data, dsRequest) {
        // if (data.length > 0) {
          // for (var geo=0; geo < data.length; geo++)
          // var geo = data[0]; 
          // //TODO!!!!! Continue collections loading in async fashion!!!!!!!!!!!!!!!!!!
          
        // }
      // }
    // );
    var geo = {Latitude: 53.760225, Longitude: 87.146347}
    
  
  var mediaFiles =  '"coverInfo": [\
      {\
        "image": "http://aydadev.blob.core.windows.net/media/80deaa53-64e8-4e51-90df-d260183ebf94.jpg",\
        "video": null,\
        "description": "1",\
        "type": "Основное",\
        "contactLink": null,\
        "id": "0ef1bf0e-36fd-48bf-9f50-319dcc5775c4",\
        "createTime": "2017-05-16T01:49:03.126"\
      }\
    ],';
    
  var contacts = '"contact_info": [\
      {\
        "type": 0,\
        "value": "8-3843-333-500"\
      },\
      {\
        "type": 1,\
        "value": "vk.com/club63558597"\
      }\
    ],';
    
    var workingHours = '"workingHours": [\
      {\
        "day": "Пн",\
        "timeRange": "09:00\n20:00"\
      },\
      {\
        "day": "Вт",\
        "timeRange": "09:00\n20:00"\
      },\
      {\
        "day": "Ср",\
        "timeRange": "09:00\n20:00"\
      },\
      {\
        "day": "Чт",\
        "timeRange": "09:00\n20:00"\
      },\
      {\
        "day": "Пт",\
        "timeRange": "09:00\n20:00"\
      },\
      {\
        "day": "Сб",\
        "timeRange": "09:00\n20:00"\
      },\
      {\
        "day": "Вс",\
        "timeRange": "10:00\n19:00"\
      }\
    ]';
    
// >>> All by callbacks stack  dstRec.Payload = singlePart + geoInfo + mediaFiles + contacts + workingHours;  
  
  if (callback) {
    callback(dstRec);
  }
}

function callVkPublish(entertainmentID) {
  isc.RPCManager.sendRequest({
        data: null,
        useSimpleHttp: true,
        contentType: "text/xml",
        transport: "xmlHttpRequest",
        httpMethod: "POST",
        actionURL: AYDA_WS_URL + "Social/VkPublish/" + entertainmentID
   });
}

///////////////////////////////////////////////////////////////////////////////
/////////////////////////// Ayda - Map facilities /////////////////////////////
isc.BaseWindow.create({
  ID: "AydaMapWindow", 
  title: "Map window",
  items: [
    isc.LeafletCanvas.create()
  ],
  
  draw: function () {
    this.setPosition();
    if (!this.readyToDraw()) return this;
    this.Super("draw", arguments);
    
    var map = this.items[0].mymap;
    var markerGroup = L.layerGroup().addTo(map);
    
    // Add to map specific dataRefresh() function
    //(TODO: - optimize data retrieving and settting for changed visual area only ???(to think!!!))
    this.items[0].dataRefresh = function(changeType){
      var bounds = map.getBounds();
      var zoom = map.getZoom();
      //Call Ayda service for objectson the map
      getAydaMapItems(bounds, 
        function(responce){
          // Clear previous markers 
  //        if (changeType === "zoom") {
            markerGroup.clearLayers();
 //         }
          // Set markers to the map
          for (var i = 0; i < responce.length; i++){
            var p = responce[i];
            L.marker([p.point.latitude, p.point.longitude]).addTo(markerGroup).bindPopup(p.description);//.openPopup();
          }
        }
      );
    }
    // Initial map settings (maybe removed or adjusted to some universal point)
    this.items[0].setValue({lat:53.767027, lng:87.109418, zoom:13})
  }
});

function getAydaMapItems(bounds, callbackOuter) {
  var lat1 = bounds.getSouthWest().lat;
  var lng1 = bounds.getSouthWest().lng;
  var lat2 = bounds.getNorthEast().lat;
  var lng2 = bounds.getNorthEast().lng;
  var latC = bounds.getCenter().lat;
  var lngC = bounds.getCenter().lng;
  var dataPayload = "{\"leftBottom\": {\"latitude\": " + lat1 + ", \"longitude\": " + lng1 + "}, \"rightTop\": {\"latitude\": " + lat2 + ", \"longitude\": " + lng2 + "}, \"nearToLocation\": {\"latitude\": " + latC + ", \"longitude\": " + lngC + "}, \"filters\": {\"categories\": [],\"discountForBirthday\": false,\"certificate\": false,\"giftCertificate\": false,\"forMan\": false,\"forWoman\": false,\"forBoy\": false,\"forGirl\": false,\"radius\": 100000}}";

  // var request = isc.RPCRequest.create({
    // useSimpleHttp: true,
    // transport: "xmlHttpRequest",
    // httpHeaders: {"Content-Type": "application/json"},
    // httpMethod: "POST",
    // actionURL: AYDA_WS_URL + "Catalog/MapItems", 
    // data: dataPayload,
    // callback: function(RPCResponse) {
        // try {
          // var resp = parseJSON(RPCResponse.data);
          // callbackOuter(resp.data);
        // } catch (err) {
        // }

    // }
  // });  
  // isc.RPCManager.sendRequest(request);
  
  isc.RPCManager.send(
      dataPayload,
      function(RPCResponse) {
          try {
            var resp = parseJSON(RPCResponse.data);
            callbackOuter(resp.data);
          } catch (err) {
          }
      },
      {useSimpleHttp: true,
      transport: "xmlHttpRequest",
      httpHeaders: {"Content-Type": "application/json"},
      httpMethod: "POST",
      actionURL: AYDA_WS_URL + "Map/MapItems"}  
  );
}

/////////////////////////////////////////////////////////////
// Additionally sends uploaded video to Ayda queue to comress it //
// Tested? but NOT USED TILL FILES UPLOAD WILL NOT BE INCLUDED TO MAIN RECORD SAVE TRANSACTION //
/*isc.ClassFactory.defineClass("AydaAzureUploadVideoControl", isc.AzureUploadControl);
isc.AydaAzureUploadVideoControl.addProperties({
  createCanvas: function (formParent) {
      var canv = isc.AzureUploadCanvas.create(); 
      canv.draw = function () {
        if (!this.readyToDraw()) return this;
        this.Super("draw", arguments);
        
        this.div = document.getElementById("uploader_" + this.ID);
        this.azureUploader = new qq.azure.FineUploader({
            element: this.div,
            request: {
                endpoint: AZURE_BLOB_URL
            },
            signature: {
                endpoint: '/Upload'
            },
            retry: {
                enableAuto: true
            },
            validation: {
                itemLimit: 1,
                sizeLimit: 16384000000 // 16Gb
            },
            multiple: false,
            chunking: {
                partSize: 50000000, // 50Mb
                minFileSize: 204800001 // 200Mb
            },
            callbacks: {
              onComplete: function(id, name, responseJSON, xhr) {
                var newName = xhr.responseURL.substring(0, xhr.responseURL.indexOf("?"));
                this.iscContext.canvasItem.storeValue(newName);
                // Additional code:
                isc.RPCManager.sendRequest({
                    data: null,
                    useSimpleHttp: true,
                    contentType: "text/xml",
                    transport: "xmlHttpRequest",
                    httpMethod: "GET",
                    actionURL: AYDA_WS_URL + "Media/CompressVideo/?URL=" + newName
                    });
              }
            }
        });
        // Some artificial context establishing for callbacks (so that it seems buggy in usual resolving techniques) 
        this.azureUploader.iscContext = this;
         
        return this;
      };
      
      return canv;
    }
});
*/

////////////////////////// DataSources /////////////////////////
isc.CBMDataSource.create({
    ID: "MediaInfoItem",
    title: "Медиа-информация",
    titleField: "Description",
    infoField: "Description",
    fields: [{
        name: "Concept",
        type: "text",
        hidden: true
    }, {
        name: "ID",
        kind: "Value",
        title: "ID",
        showTitle: false,
        hidden: true,
        required: true,
        canEdit: false,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "Odr",
        kind: "Value",
        title: "Порядок",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        copyValue: true,
        emptyDisplayValue: "",
        type: "localeInt"
    }, {
        name: "Description",
        kind: "Value",
        title: "Наименование",
        showTitle: true,
        length: 1000,
        inList: true,
        colSpan: 3,
        rowSpan: 1,
        align: "left",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "MediaRole",
        kind: "Link",
        title: "Роль медиа-материала",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        copyValue: true,
        emptyDisplayValue: "",
        type: "MediaItemRole",
        editorType: "LinkControl",
        optionDataSource: "MediaItemRole",
        valueField: "ID",
        displayField: "Description",
        pickListWidth: 400
    }, {
        name: "Type",
        kind: "Value",
        title: "Тип / Категория",
        showTitle: true,
        defaultValue: "N'Основное'",
        valueMap: ["Основное", "Дополнительное"],
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        copyValue: true,
        editorType: "select",
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "ContactLink",
        kind: "Value",
        title: "Контактная информация",
        showTitle: true,
        length: 255,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "Entertainment",
        kind: "Link",
        title: "Предложение",
        showTitle: false,
        hidden: true,
        canEdit: false,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        copyValue: true,
        emptyDisplayValue: "",
        type: "Entertainment",
        editorType: "LinkControl",
        optionDataSource: "Entertainment",
        valueField: "ID",
        displayField: "Description",
        pickListWidth: 400
    }, {
        name: "CreateTime",
        kind: "Value",
        title: "Время создания",
        showTitle: false,
        hidden: true,
        canEdit: false,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        copyValue: true,
        emptyDisplayValue: "",
        type: "datetime"
    }, {
        name: "Image",
        kind: "Value",
        title: "Картинка",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        copyValue: true,
        editorType: "AzureUploadControl",
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "Video",
        kind: "Value",
        title: "Видео",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        copyValue: true,
        editorType: "AzureUploadControl",
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "CompressedVideo",
        kind: "Value",
        title: "Видео (low resolution)",
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        emptyDisplayValue: "",
        type: "text"
    }],
    // --- Functions ---
    onSave: function (record) {
        if (record.Video) {
          isc.RPCManager.sendRequest({
              data: null,
              useSimpleHttp: true,
              contentType: "text/xml",
              transport: "xmlHttpRequest",
              httpMethod: "GET",
              actionURL: AYDA_WS_URL + "Media/CompressVideo/?URL=" + record.Video + "&Item=" + record.ID
              });
        }
    }
});



isc.CBMDataSource.create({
    ID: "WorkingTimeInput",
    title: "Время работы",
    titleField: "Description",
    infoField: "Description",
    fields: [{
        name: "ID",
        kind: "Value",
        title: "ID",
        showTitle: false,
        hidden: true,
        required: true,
        canEdit: false,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "Day1",
        kind: "Value",
        title: "пн.",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "localeInt"
    }, {
        name: "OpeningTime1",
        kind: "Value",
        title: "Начало работы",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "ClosingTime1",
        kind: "Value",
        title: "Окончание работы",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "Day2",
        kind: "Value",
        title: "вт.",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "localeInt"
    }, {
        name: "OpeningTime2",
        kind: "Value",
        title: "Начало работы",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "ClosingTime2",
        kind: "Value",
        title: "Окончание работы",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "Day3",
        kind: "Value",
        title: "ср.",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "localeInt"
    }, {
        name: "OpeningTime",
        kind: "Value",
        title: "Начало работы3",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "ClosingTime",
        kind: "Value",
        title: "Окончание работы3",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "Day4",
        kind: "Value",
        title: "чт.",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "localeInt"
    }, {
        name: "OpeningTime",
        kind: "Value",
        title: "Начало работы4",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "ClosingTime",
        kind: "Value",
        title: "Окончание работы4",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "Day5",
        kind: "Value",
        title: "пт.",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "localeInt"
    }, {
        name: "OpeningTime",
        kind: "Value",
        title: "Начало работы5",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "ClosingTime",
        kind: "Value",
        title: "Окончание работы5",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "Day6",
        kind: "Value",
        title: "сб.",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "localeInt"
    }, {
        name: "OpeningTime",
        kind: "Value",
        title: "Начало работы6",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "ClosingTime",
        kind: "Value",
        title: "Окончание работы6",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "Day7",
        kind: "Value",
        title: "вс.",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "localeInt"
    }, {
        name: "OpeningTime",
        kind: "Value",
        title: "Начало работы7",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "ClosingTime",
        kind: "Value",
        title: "Окончание работы7",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "Offer",
        kind: "Link",
        title: "Предложение",
        showTitle: false,
        hidden: true,
        canEdit: false,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "Offer",
        editorType: "LinkControl",
        optionDataSource: "Offer",
        valueField: "ID",
        displayField: "Description",
        pickListWidth: 400
    }, {
        name: "CreateTime",
        kind: "Value",
        title: "Время создания",
        showTitle: true,
        defaultValue: "new Date()",
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "datetime"
    }]
})

/* *** Source variant ***
isc.CBMDataSource.create({
    ID: "WorkingTime",
    title: "Время работы",
    titleField: "Description",
    infoField: "Description",
    fields: [{
        name: "ID",
        kind: "Value",
        title: "ID",
        showTitle: false,
        hidden: true,
        required: true,
        canEdit: false,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "Day",
        kind: "Value",
        title: "День",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "localeInt"
    }, {
        name: "OpeningTime",
        kind: "Value",
        title: "Начало работы",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "ClosingTime",
        kind: "Value",
        title: "Окончание работы",
        showTitle: true,
        inList: true,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "text"
    }, {
        name: "Offer",
        kind: "Link",
        title: "Предложение",
        showTitle: false,
        hidden: true,
        canEdit: false,
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "Offer",
        editorType: "LinkControl",
        optionDataSource: "Offer",
        valueField: "ID",
        displayField: "Description",
        pickListWidth: 400
    }, {
        name: "CreateTime",
        kind: "Value",
        title: "Время создания",
        showTitle: true,
        defaultValue: "new Date()",
        colSpan: 1,
        rowSpan: 1,
        align: "left",
        vAlign: "center",
        titleVAlign: "center",
        copyValue: true,
        emptyDisplayValue: "",
        type: "datetime"
    }]
})
*/
/*
isc.CBMDataSource.create({
  ID: "RelationForKind",
  dbName: Window.default_DB,
  title: "Свойства типа",
  fields: [{
    name: "ID",
    title: "ID",
    showTitle: false,
    hidden: true,
    canEdit: false,
    ColSpan: 1,
    RowSpan: 1,
    copyValue: true,
    type: "text"
  }, {
    name: "Del",
    title: "Del",
    showTitle: false,
    hidden: true,
    canEdit: false,
    ColSpan: 1,
    RowSpan: 1,
    copyValue: true,
    type: "boolean"
  }, {
    name: "Odr",
    title: "Odr",
    showTitle: false,
    hidden: true,
    canEdit: false,
    ColSpan: 1,
    RowSpan: 1,
    copyValue: true,
    type: "localeInt"
  }, {
    name: "Description",
    title: "Description",
    showTitle: true,
    inList: true,
    canEdit: false,
    ColSpan: 1,
    RowSpan: 1,
    copyValue: true,
    type: "multiLangText"
  }, {
    name: "SysCode",
    title: "SysCode",
    showTitle: true,
    canEdit: false,
    inList: true,
    ColSpan: 1,
    RowSpan: 1,
    copyValue: true,
    type: "text"
  }, {
    name: "Notes",
    title: "Notes",
    showTitle: false,
    hidden: true,
    canEdit: false,
    ColSpan: 1,
    RowSpan: 1,
    copyValue: true,
    type: "multiLangText"
  }, {
    name: "ForConcept",
    title: "ForConcept",
    showTitle: true,
    ColSpan: 1,
    RowSpan: 1,
    copyValue: true,
    copyLinked: true,
    deleteLinked: true,
    type: "Concept",
    editorType: "LinkControl",
    optionDataSource: "Concept",
    valueField: "ID",
    displayField: "Description",
    pickListWidth: 400
  }, {
    name: "RelatedConcept",
    title: "Related Concept",
    showTitle: true,
    inList: true,
    canEdit: false,
    ColSpan: 1,
    RowSpan: 1,
    copyValue: true,
    copyLinked: true,
    deleteLinked: true,
    type: "Concept",
    editorType: "LinkControl",
    optionDataSource: "Concept",
    valueField: "ID",
    displayField: "Description",
    pickListWidth: 400
  }, {
    name: "RelationKind",
    title: "RelationKind",
    showTitle: true,
    inList: true,
    canEdit: false,
    ColSpan: 1,
    RowSpan: 1,
    copyValue: true,
    copyLinked: true,
    deleteLinked: true,
    type: "RelationKind",
    editorType: "LinkControl",
    optionDataSource: "RelationKind",
    valueField: "ID",
    displayField: "Description",
    pickListWidth: 400
  }, {
    name: "IsPublic",
    title: "Видимое свойство",
    showTitle: false,
    length: 100,
    hidden: true,
    canEdit: false,
    ColSpan: 1,
    RowSpan: 1,
    copyValue: true,
    type: "boolean"
  }, {
    name: "Constraints",
    title: "Ограничения",
    showTitle: true,
    length: 100,
    canSave: false,
    colSpan: 6,
    rowSpan: 6,
    copyValue: true,
    type: "custom",
    canSave: true,
    editorType: "CollectionControl",
    relatedConcept: "Constraint",
    backLinkRelation: "ForRelation",
    mainIDProperty: "ID",
    optionDataSource: "Constraint",
    titleOrientation: "top"
  }, {
    name: "ValueConstraint",
    title: "Значение",
    showTitle: true,
    length: 100,
    canSave: true,
    inList: true,
    ColSpan: 1,
    RowSpan: 1,
    copyValue: true,
    getFieldValue: function(record, value, field, fieldName){
    	var that = this;
    	var obj 
    	obj = getObjectByFilter("ConstraintValue", {forRelation: record.ID, ConstraintKind: "b8055887-35c5-4ad0-9253-1cf9875023a8"}, 
//    		function(record){return record} );
		null
//		return that.getFieldValue(record, value, field, fieldName);
		);
    	// if(obj && obj.Value){
    	return obj;
    	// }
    },
    // optionDataSource: "null",
    // valueField: "ID",
    // displayField: "Description",
    type: "ConstraintValue"
  }]
});
*/
// ===================== ZMK =====================
/*
isc.CBMDataSource.create({
  ID: "ProcProdSteelStructures",
  dbName: Window.default_DB,
  title: "Диспетчерский лист",
  titleField: "Description",
  infoField: "Description",
  isHierarchy: true,
  canExpandRecords: true,
  // expansionMode: "related",
  // detailDS: "SteelStructureProdRoot",
  // childExpansionMode: "related",
  fields: [{
    name: "ID",
    title: "ID",
    showTitle: false,
    length: 100,
    hidden: true,
    canEdit: false,
    colSpan: 0,
    rowSpan: 0,
    copyValue: true,
    type: "text"
  }, {
    name: "Del",
    title: "Del",
    showTitle: false,
    length: 100,
    hidden: true,
    canEdit: false,
    colSpan: 0,
    rowSpan: 0,
    copyValue: true,
    type: "boolean"
  }, {
    name: "Concept",
    title: "Is of Concept",
    showTitle: false,
    length: 100,
    hidden: true,
    canEdit: false,
    colSpan: 0,
    rowSpan: 0,
    copyValue: true,
  }, {
    name: "Description",
    title: "Описание",
    showTitle: true,
    length: 100,
    inList: true,
    colSpan: 4,
    rowSpan: 4,
    copyValue: true,
    type: "multiLangText",
    editorType: "MultilangTextItem"
  }, {
    name: "ApplyDate",
    title: "Планируемая дата",
    showTitle: true,
    length: 100,
    inList: true,
    colSpan: 1,
    rowSpan: 1,
    copyValue: true,
    type: "datetime"
  }, {
    name: "InProcess",
    title: "Из Заказа",
    showTitle: true,
    length: 100,
    inList: true,
    colSpan: 2,
    rowSpan: 2,
    copyValue: true,
    type: "ProcProduction",
    editorType: "LinkControl",
    foreignKey: "ProcProduction.ID",
    rootValue: null,
    optionDataSource: "ProcProduction",
    valueField: "ID",
    displayField: "Description",
    pickListWidth: 500
  }, {
    name: "ObjInActivity",
    title: "Материалы и детали",
    showTitle: true,
    length: 100,
    canSave: false,
    colSpan: 6,
    rowSpan: 6,
    copyValue: true,
    copyLinked: true,
    type: "custom",
    canSave: true,
    editorType: "CollectionAggregateControl",
    relatedConcept: "ObjInActivity",
    backLinkRelation: "Activity",
    mainIDProperty: "ID",
    optionDataSource: "ObjInActivity",
    titleOrientation: "top"
  }, {
    name: "Activities",
    title: "Состав Операций",
    showTitle: true,
    length: 500,
    canSave: false,
    colSpan: 6,
    rowSpan: 6,
    copyLinked: true,
    type: "custom",
    canSave: true,
    editorType: "CollectionControl",
    relatedConcept: "SteelStructureProdRoot",
    backLinkRelation: "InProcess",
    mainIDProperty: "ID",
    optionDataSource: "SteelStructureProdRoot",
    titleOrientation: "top"
  }]
});
*/
/*
isc.CBMDataSource.create({
  ID: "SteelStructureProdRoot",
  dbName: Window.default_DB,
  title: "Маршрутная карта",
  titleField: "Description",
//  infoField: "Description",
  isHierarchy: true,
  // canExpandRecords: true,
  // expansionMode: "related",
  // detailDS: "ObjInActivity",
  fields: [{
    name: "ID",
    title: "ID",
    showTitle: false,
    length: 100,
    hidden: true,
    canEdit: false,
    colSpan: 0,
    rowSpan: 0,
    copyValue: true,
    type: "text"
  }, {
    name: "Del",
    title: "Del",
    showTitle: false,
    length: 100,
    hidden: true,
    canEdit: false,
    colSpan: 0,
    rowSpan: 0,
    copyValue: true,
    type: "boolean"
  }, {
    name: "Concept",
    title: "Is of Concept",
    showTitle: false,
    length: 100,
    hidden: true,
    canEdit: false,
    colSpan: 0,
    rowSpan: 0,
    copyValue: true,
  }, {
    name: "Description",
    title: "Описание",
    showTitle: true,
    length: 100,
    inList: true,
    colSpan: 4,
    rowSpan: 4,
    copyValue: true,
    type: "multiLangText",
    editorType: "MultilangTextItem"
  }, {
    name: "Duration",
    title: "Длительность",
    showTitle: true,
    length: 100,
    inList: true,
    colSpan: 1,
    rowSpan: 1,
    copyValue: true,
    type: "localeInt"
  }, {
    name: "ApplyDate",
    title: "Планируемая дата",
    showTitle: true,
    length: 100,
    inList: true,
    colSpan: 1,
    rowSpan: 1,
    copyValue: true,
    type: "datetime"
  }, {
    name: "InProcess",
    title: "В диспетчерском листе",
    showTitle: true,
    length: 100,
    inList: true,
    colSpan: 2,
    rowSpan: 2,
    copyValue: true,
    type: "ProcProdSteelStructures",
 //   foreignKey: "ProcProdSteelStructures.ID",
 //   rootValue: null,
    editorType: "LinkControl",
    optionDataSource: "ProcProdSteelStructures",
    valueField: "ID",
    displayField: "Description",
    pickListWidth: 500
  }, {
    name: "ObjInActivity",
    title: "Участие объектов в активности",
    showTitle: true,
    length: 100,
    canSave: false,
    colSpan: 6,
    rowSpan: 6,
    copyValue: true,
    type: "custom",
    canSave: true,
    editorType: "CollectionAggregateControl",
    relatedConcept: "ObjInActivity",
    backLinkRelation: "Activity",
    mainIDProperty: "ID",
    optionDataSource: "ObjInActivity",
    titleOrientation: "top"
  }, {
    name: "Activities",
    title: "Состав Операций",
    showTitle: true,
    length: 100,
    canSave: false,
    colSpan: -1,
    rowSpan: -1,
    copyValue: true,
    type: "custom",
    canSave: true,
    editorType: "CollectionControl",
    relatedConcept: "Activity",
    backLinkRelation: "InProcess",
    mainIDProperty: "ID",
    optionDataSource: "OperProd",
    titleOrientation: "top"
  }]
});

isc.CBMDataSource.create({
  ID: "ProdOrderSteelStructures",
  dbName: Window.default_DB,
  title: "Заказ на производство металлоконструкций",
  titleField: "Description",
  fields: [{
    name: "ID",
    title: "ID",
    showTitle: false,
    length: 100,
    hidden: true,
    canEdit: false,
    colSpan: 1,
    rowSpan: 1,
    copyValue: true,
    type: "text"
  }, {
    name: "Del",
    title: "Del",
    showTitle: false,
    length: 100,
    hidden: true,
    canEdit: false,
    colSpan: 1,
    rowSpan: 1,
    copyValue: true,
    type: "boolean"
  }, {
    name: "Concept",
    title: "Is of Concept",
    showTitle: false,
    length: 100,
    hidden: true,
    canEdit: false,
    colSpan: 1,
    rowSpan: 1,
    copyValue: true,
    type: "Concept",
    editorType: "LinkControl",
    optionDataSource: "Concept",
    valueField: "ID",
    displayField: "Description",
    pickListWidth: 40
  }, {
    name: "Description",
    title: "Description",
    showTitle: true,
    length: 100,
    inList: true,
    copyValue: true,
    type: "multiLangText",
    editorType: "MultilangTextItem"
  }, {
    name: "Duration",
    title: "Длительность",
    showTitle: true,
    length: 100,
    inList: true,
    copyValue: true,
    type: "localeInt"
  }, {
    name: "ApplyDate",
    title: "ApplyDate",
    showTitle: true,
    length: 100,
    inList: true,
    copyValue: true,
    type: "datetime"
  }, {
    name: "ObjInActivity",
    title: "Участие объектов в активности",
    showTitle: true,
    length: 100,
    canSave: false,
    colSpan: 3,
    rowSpan: 3,
    copyValue: true,
    type: "custom",
    canSave: true,
    editorType: "CollectionAggregateControl",
    relatedConcept: "ObjInActivity",
    backLinkRelation: "Activity",
    mainIDProperty: "ID",
    optionDataSource: "ObjInActivity",
    titleOrientation: "top"
  }, {
    name: "InProcess",
    title: "В процессе",
    showTitle: true,
    length: 100,
    inList: true,
    colSpan: 1,
    rowSpan: 1,
    copyValue: true,
    type: "Process",
    editorType: "LinkControl",
    optionDataSource: "Process",
    valueField: "ID",
    displayField: "Description",
    pickListWidth: 450
  }, {
    name: "Activities",
    title: "Активности в процессе",
    showTitle: true,
    length: 100,
    canSave: false,
    colSpan: 3,
    rowSpan: 3,
    copyValue: true,
    type: "custom",
    canSave: true,
    editorType: "CollectionControl",
    relatedConcept: "Activity",
    backLinkRelation: "InProcess",
    mainIDProperty: "ID",
    optionDataSource: "Activity",
    titleOrientation: "top"
  }]
});
*/
/*isc.CBMDataSource.create({
    ID: "Kind",
    dbName: Window.default_DB,
    title: "Классификатор видов объектов",
    titleField: "Description",
    infoField: "Description",
    isHierarchy: true,
    fields: [ {
        name: "Del",
        title: "Del",
        showTitle: false,
        hidden: true,
        canEdit: false,
        type: "boolean"
    }, {
        name: "Code",
        title: "Код",
        showTitle: true,
        length: 400,
        inList: true,
        ColSpan: 1,
        RowSpan: 1,
        type: "multiLangText",
        editorType: "MultilangTextItem"
    }, {
        name: "SysCode",
        title: "Системный код",
        showTitle: true,
        length: 200,
        inList: true,
        ColSpan: 1,
        RowSpan: 1,
        type: "text"
    }, {
        name: "Concept",
        title: "Класс самого концепта",
        showTitle: false,
        length: 200,
        hidden: true,
        canEdit: false,
        ColSpan: 1,
        RowSpan: 1,
        type: "text"
    }, {
        name: "Description",
        title: "Наименование",
        showTitle: true,
        length: 1000,
        inList: true,
        copyValue: true,
        type: "multiLangText",
        editorType: "MultilangTextItem"
    }, {
        name: "Notes",
        title: "Пояснения",
        showTitle: true,
        length: 4000,
        inList: true,
        copyValue: true,
        type: "multiLangText",
        editorType: "MultilangTextItem"
    }, {
        name: "Parent",
        title: "Вышестоящий тип",
        showTitle: true,
        inList: true,
        ColSpan: 1,
        RowSpan: 1,
        copyValue: true,
        changed: function() {
            var fld = this;
            var frm = this.form;
            var currDS = isc.DataSource.getDataSource(this.form.dataSource.ID);
            if (currDS.cacheAllData) {
                var parRecord = currDS.getCacheData().find({
                    "ID": frm.values.Parent
                });
                var newCode = (parRecord.HierCode ? parRecord.HierCode + "," : "") + this.getValue();
                frm.setValue("HierCode", newCode);
            } else {
                currDS.fetchData({
                    "ID": frm.values.Parent
                }, function(dsResponce, data) {
                    if (data && data.length === 1) {
                        var newCode = (data[0].HierCode === null ? "" : data[0].HierCode + ",") + fld.getValue();
                        frm.setValue("HierCode", newCode);
                    }
                });
            }
        },
        type: "EntityKind",
        editorType: "LinkControl",
        foreignKey: "EntityKind.ID",
        rootValue: null,
        optionDataSource: "EntityKind",
        valueField: "ID",
        displayField: "Code",
        pickListFields: [{
            name: "Code",
            width: 200
        }, {
            name: "Description",
            width: 300
        }],
        pickListWidth: 500
    }, {
        name: "HierCode",
        title: "Hierarchy Code",
        showTitle: false,
        length: 400,
        hidden: true,
        canEdit: false,
        ColSpan: 1,
        RowSpan: 1,
        type: "text"
    }, {
        name: "BaseConcept",
        title: "Представляет класс",
        showTitle: true,
        length: 1000,
        inList: true,
        ColSpan: 1,
        RowSpan: 1,
        copyValue: true,
        type: "Concept",
        editorType: "LinkControl",
        optionDataSource: "Concept",
        valueField: "ID",
        displayField: "SysCode",
        pickListFields: [{
            name: "Description",
            width: "70%"
        }, {
            name: "SysCode"
        }],
        pickListWidth: 400
    }, {
        name: "Prototype",
        title: "Прототип",
        showTitle: true,
        copyValue: true,
        copyLinked: true,
        type: "Entity",
        editorType: "LinkControl",
        optionDataSource: "Entity",
        valueField: "ID",
        displayField: "Description",
        pickListWidth: 400
    }, {
        name: "Actual",
        title: "Используется",
        showTitle: true,
        defaultValue: "true",
        inList: true,
        ColSpan: 1,
        RowSpan: 1,
        copyValue: true,
        type: "boolean"
    }, {
        name: "Source",
        title: "Первоисточник позиции",
        showTitle: true,
        copyValue: true,
        type: "PrgComponent",
        editorType: "LinkControl",
        optionDataSource: "PrgComponent",
        valueField: "ID",
        displayField: "SysCode",
        pickListWidth: 500
    }, {
        name: "ObjInActivityPossible",
        title: "Возможные операции",
        showTitle: false,
        length: 100,
        canSave: false,
        UIPath: "Возможные операции",
        ColSpan: 6,
        RowSpan: 6,
        copyValue: true,
        type: "custom",
        canSave: true,
        editorType: "CollectionAggregateControl",
        relatedConcept: "ObjInActivityPossible",
        backLinkRelation: "EntityKind",
        mainIDProperty: "ID",
        titleOrientation: "top"
    }, {
        name: "Relations",
        title: "Свойства",
        showTitle: true,
        length: 100,
        canSave: false,
        ColSpan: 2,
        RowSpan: 2,
        copyValue: true,
        type: "custom",
        canSave: true,
        editorType: "CollectionControl",
        relatedConcept: "Relation",
        backLinkRelation: "ForConcept",
        mainIDProperty: "BaseConcept",
        titleOrientation: "top"
    }]
});
*/

// Прототип окон диспетчерской ЗМК
/*
var equipment = [
    { name: "Cutter", title: "Гильотина", operGroup: "Резка" },
    { name: "Plazm", title: "Плазма", operGroup: "Резка" },
    { name: "Dnepr", title: "Днепр", operGroup: "Резка" },
    { name: "bandMeter", title: "Рулетка 20м", operGroup: "Разметка" },
    { name: "ValcA", title: "Вальцы А", operGroup: "Гибка-правка" },
    { name: "ValcB", title: "Вальцы Б", operGroup: "Гибка-правка" },
    { name: "ValcC", title: "Вальцы С", operGroup: "Гибка-правка" }
];

var tasks = [
    { name: "t1_10a", title: "2015-10-1 10а", operGroup: "2015-10-1" },
    { name: "t1_10b", title: "2015-10-1 10б", operGroup: "2015-10-1" },
    { name: "t1_10", title: "2015-10-1 10", operGroup: "2015-10-1" },
    { name: "t3_7", title: "2015-10-3 7", operGroup: "2015-10-3" },
    { name: "t3_18", title: "2015-10-3 18", operGroup: "2015-10-3" },
    { name: "t3_28", title: "2015-10-3 28", operGroup: "2015-10-3" },
    { name: "t7_11a", title: "2015-10-7 11а", operGroup: "2015-10-7" },
    { name: "t7_11b", title: "2015-10-7 11б", operGroup: "2015-10-7" },
    { name: "t7_11", title: "2015-10-7 11", operGroup: "2015-10-7" }
];


var _today = isc.DateUtil.getStartOf(new Date(2015, 11, 18), "W");

var _start = _today.getDate() - _today.getDay();
var _month = _today.getMonth();
var _year = _today.getFullYear();
var events = [
{
    eventId: 1, 
    name: "Разметка (рулетка 20м)",
    description: "Add a new calendar Timeline component",
    startDate: new Date(2015, 11, 18, 8, 0),
    endDate: new Date(2015, 11, 18, 8, 30),
    lane: "t1_10a"
},
{
    eventId: 2,
    name: "Правка (Вальцы)",
    description: "Complex field-autosizing in ListGrid",
    startDate: new Date(2015, 11, 18, 8, 45),
    endDate: new Date(2015, 11, 18, 9, 15),
    lane: "t1_10a"
},
{
    eventId: 3,
    name: "Разметка (рулетка 20м)",
    description: "Implement native PDF import/export",
    startDate: new Date(2015, 11, 18, 9, 0),
    endDate: new Date(2015, 11, 18, 9, 30),
    lane: "t1_10b"
},
{
    eventId: 4, 
    name: "Правка (Вальцы)",
    description: "Formula and Summary fields for ListGrid",
    startDate: new Date(2015, 11, 18, 9, 40),
    endDate: new Date(2015, 11, 18, 10, 10),
    lane: "t1_10b"
},
{
    eventId: 5,
    name: "Резка (Плазма)",
    description: "Implement spreadsheet-like selection in ListGrid",
    startDate: new Date(2015, 11, 18, 10, 20),
    endDate: new Date(2015, 11, 18, 12, 40),
    lane: "t1_10"
},
{
    eventId: 6,
    name: "Сварка встык",
    description: "Server text-import",
    startDate: new Date(2015, 11, 18, 12, 50),
    endDate: new Date(2015, 11, 18, 13, 30),
    lane: "t1_10"
},
{
    eventId: 7,
    name: "ДНЕПР",
    description: "Enhance formItem tabindex handling",
    startDate: new Date(2015, 11, 18, 13, 40),
    endDate: new Date(2015, 11, 18, 14, 55),
    lane: "t1_10"
},
{
    eventId: 8,
    name: "Разметка (рулетка 20м)",
    description: "Skinning changes",
    startDate: new Date(2015, 11, 18, 9, 40),
    endDate: new Date(2015, 11, 18, 9, 55),
    lane: "t3_7"
},
{
    eventId: 9,
    name: "Резка (Плазма)",
    description: "New transaction features",
    startDate: new Date(2015, 11, 18,10, 15),
    endDate: new Date(2015, 11, 18, 12, 35),
    lane: "t3_7"
},
{
    eventId: 10,
    name: "Сварка встык",
    description: "Add 20 samples for the following new features: ...",
    startDate: new Date(2015, 11, 18,12, 50),
    endDate: new Date(2015, 11, 18, 13, 30),
    lane: "t3_7"
},
{
    eventId: 11,
    name: "Правка (Вальцы)",
    description: "Extend i18n support",
    startDate: new Date(2015, 11, 18,13, 30),
    endDate: new Date(2015, 11, 18, 13, 55),
    lane: "t3_7"
},
{
    eventId: 12,
    name: "Разметка (рулетка 20м)",
    description: "Add these 4 new language packs: ...",
    startDate: new Date(2015, 11, 18, 10, 20),
    endDate: new Date(2015, 11, 18, 10, 55),
    lane: "t3_18"
},
{
    eventId: 13,
    name: "Секатор",
    description: "Add the following features and update documentation: ...",
    startDate: new Date(2015, 11, 18, 11, 10),
    endDate: new Date(2015, 11, 18, 11, 45),
    lane: "t3_18"
},
{
    eventId: 13,
    name: "Сварка",
    description: "Add the following features and update documentation: ...",
    startDate: new Date(2015, 11, 18, 11, 50),
    endDate: new Date(2015, 11, 18, 12, 30),
    lane: "t3_18"
},
{
    eventId: 13,
    name: "Правка (Вальцы)",
    description: "Add the following features and update documentation: ...",
    startDate: new Date(2015, 11, 18, 12, 40),
    endDate: new Date(2015, 11, 18, 13, 0),
    lane: "t3_18"
},
{
    eventId: 13,
    name: "Правка (Вальцы)",
    description: "Add the following features and update documentation: ...",
    startDate: new Date(2015, 11, 18, 12, 15),
    endDate: new Date(2015, 11, 18, 12, 40),
    lane: "t3_28"
},
{
    eventId: 13,
    name: "Секатор",
    description: "Add the following features and update documentation: ...",
    startDate: new Date(2015, 11, 18, 12, 50),
    endDate: new Date(2015, 11, 18, 13, 5),
    lane: "t3_28"
},
{
    eventId: 13,
    name: "Сварка",
    description: "Add the following features and update documentation: ...",
    startDate: new Date(2015, 11, 18, 13, 10),
    endDate: new Date(2015, 11, 18, 13, 40),
    lane: "t3_28"
},
{
    eventId: 13,
    name: "Снятие усил.швов",
    description: "Add the following features and update documentation: ...",
    startDate: new Date(2015, 11, 18, 13, 45),
    endDate: new Date(2015, 11, 18, 14, 10),
    lane: "t3_28"
},
{
    eventId: 13,
    name: "Правка (Вальцы)",
    description: "Add the following features and update documentation: ...",
    startDate: new Date(2015, 11, 18, 14, 20),
    endDate: new Date(2015, 11, 18, 14, 35),
    lane: "t3_28"
},
{
    eventId: 14,
    name: "Разметка (рулетка 20м)",
    description: "Change styling on builtin tiles as follows: ...",
    startDate: new Date(2015, 11, 18, 11, 5),
    endDate: new Date(2015, 11, 18, 11, 30),
    lane: "t7_11a"
},
{
    eventId: 15,
    name: "Резка (Плазма)",
    description: "Weekly dev meeting",
    startDate: new Date(2015, 11, 18, 11, 45),
    endDate: new Date(2015, 11, 18, 13, 10),
    lane: "t7_11a",
    // eventWindowStyle: "testStyle",
    // canEdit: false
},
{
    eventId: 16,
    name: "ДНЕПР",
    description: "Weekly dev meeting",
    startDate: new Date(2015, 11, 18, 12, 40),
    endDate: new Date(2015, 11, 18, 13, 10),
    lane: "t7_11b",
    // eventWindowStyle: "testStyle",
    // canEdit: false
},
{
    eventId: 16,
    name: "Стыковка лист. (Флюс.подушка)",
    description: "Weekly dev meeting",
    startDate: new Date(2015, 11, 18, 13, 15),
    endDate: new Date(2015, 11, 18, 13, 25),
    lane: "t7_11"
},
{
    eventId: 16,
    name: "Сварка встык",
    description: "Weekly dev meeting",
    startDate: new Date(2015, 11, 18, 13, 30),
    endDate: new Date(2015, 11, 18, 13, 50),
    lane: "t7_11"
},
{
    eventId: 16,
    name: "Снятие усил.швов",
    description: "Weekly dev meeting",
    startDate: new Date(2015, 11, 18, 13, 55),
    endDate: new Date(2015, 11, 18, 14, 35),
    lane: "t7_11"
},
{
    eventId: 16,
    name: "Разметка контура",
    description: "Weekly dev meeting",
    startDate: new Date(2015, 11, 18, 14, 40),
    endDate: new Date(2015, 11, 18, 14, 55),
    lane: "t7_11"
},
{
    eventId: 16,
    name: "ДНЕПР",
    description: "Weekly dev meeting",
    startDate: new Date(2015, 11, 18, 15, 5),
    endDate: new Date(2015, 11, 18, 16, 10),
    lane: "t7_11"
},
{
    eventId: 16,
    name: "Правка (Вальцы)",
    description: "Weekly dev meeting",
    startDate: new Date(2015, 11, 18, 16, 20),
    endDate: new Date(2015, 11, 18, 17, 0),
    lane: "t7_11"
},
//--- повтор
{
    eventId: 16,
    name: "Стыковка лист. (Флюс.подушка)",
    description: "Weekly dev meeting",
    startDate: new Date(2015, 11, 18, 17, 15),
    endDate: new Date(2015, 11, 18, 17, 25),
    lane: "t7_11"
},
{
    eventId: 16,
    name: "Сварка встык",
    description: "Weekly dev meeting",
    startDate: new Date(2015, 11, 18, 17, 30),
    endDate: new Date(2015, 11, 18, 17, 50),
    lane: "t7_11"
},
{
    eventId: 16,
    name: "Снятие усил.швов",
    description: "Weekly dev meeting",
    startDate: new Date(2015, 11, 18, 17, 55),
    endDate: new Date(2015, 11, 18, 18, 20),
    lane: "t7_11"
},
{
    eventId: 16,
    name: "Разметка контура",
    description: "Weekly dev meeting",
    startDate: new Date(2015, 11, 18, 18, 40),
    endDate: new Date(2015, 11, 18, 18, 55),
    lane: "t7_11"
},
{
    eventId: 16,
    name: "ДНЕПР",
    description: "Weekly dev meeting",
    startDate: new Date(2015, 11, 18, 19, 5),
    endDate: new Date(2015, 11, 18, 20, 10),
    lane: "t7_11"
},
{
    eventId: 16,
    name: "Правка (Вальцы)",
    description: "Weekly dev meeting",
    startDate: new Date(2015, 11, 18, 20, 20),
    endDate: new Date(2015, 11, 18, 20, 45),
    lane: "t7_11"
}]



// ------------------------------------- Окно "Прохождение заказов" ----------------------------------------

//var _calStart = isc.DateUtil.getStartOf(new Date(2015, 10, 18, 8), "D");
var _calStart = new Date(2015, 11, 18, 8);
var _calEnd = _calStart.duplicate();
_calEnd.setDate(_calEnd.getDate() + 1);

isc.ToolStrip.create({
    ID: "toolstrip",
    width: "100%"
});
var eventForm = toolstrip.addFormItem({ name: "eventFilter", title: "По маршруту", titleOrientation: "top", changed: "timeline.rebuild();"});
var laneForm = toolstrip.addFormItem({ name: "laneFilter", title: "По операции-оборудованию", titleOrientation: "top", changed: "timeline.rebuild();" });
//var unusedLanesForm = toolstrip.addFormItem({ name: "hideUnusedLanes", title: "Hide Unused Lanes", titleOrientation: "top", type: "boolean", changed: "timeline.hideUnusedLanes = this.getValue(); timeline.rebuild();" });
// var dateForm = toolstrip.addFormItem({ name: "hideWednesdays", title: "Hide Wednesdays", titleOrientation: "top", type: "boolean", changed: "timeline.rebuild();" });
// var weekendForm = toolstrip.addFormItem({ name: "hideWeekends", title: "Hide Weekends", titleOrientation: "top", type: "boolean", changed: "timeline.showWeekends = !this.getValue(); timeline.rebuild();" });


isc.Timeline.create({
    ID: "workFlow", 
    height: 800,
    startDate: _calStart, 
    endDate: _calEnd,
    data: events,
    lanes: tasks,
    headerLevels: [ { unit: "day" },{ unit: "hour" } ],
    laneFields: [ { name: "title", title: "Заказы", width: 180 } ],
    canEditLane: true,
    showEventDescriptions: false,
    columnsPerPage: 5,
    laneEventPadding: 2,
    disableWeekends: false,
    // grouping settings
    canGroupLanes: true,
    laneGroupByField: "operGroup",
    laneFields: [
        { name: "title", title: "Заказы" , width: 300 },
        // fields which can be grouped must be declared here
        { name: "operGroup", hidden: true }
    ],
    rebuild : function () {
        // rebuild the timelineView
        this.getSelectedView().rebuild(true);
    },
    showIndicators: true,
    indicators: [
        { name: "ThisDay", description: "Текущий момент", startDate: new Date(2015, 11, 18, 11) }
    ]

});



// ------------------------------------- Окно "Загрузка оборудования" ----------------------------------------

//var _calStart = isc.DateUtil.getStartOf(new Date(2015, 10, 18, 8), "D");
var _calStart = new Date(2015, 11, 18, 8);
var _calEnd = _calStart.duplicate();
_calEnd.setDate(_calEnd.getDate() + 2);

isc.ToolStrip.create({
    ID: "toolstrip",
    width: "100%"
});
var eventForm = toolstrip.addFormItem({ name: "eventFilter", title: "По маршруту", titleOrientation: "top", changed: "timeline.rebuild();"});
var laneForm = toolstrip.addFormItem({ name: "laneFilter", title: "По операции-оборудованию", titleOrientation: "top", changed: "timeline.rebuild();" });
//var unusedLanesForm = toolstrip.addFormItem({ name: "hideUnusedLanes", title: "Hide Unused Lanes", titleOrientation: "top", type: "boolean", changed: "timeline.hideUnusedLanes = this.getValue(); timeline.rebuild();" });
// var dateForm = toolstrip.addFormItem({ name: "hideWednesdays", title: "Hide Wednesdays", titleOrientation: "top", type: "boolean", changed: "timeline.rebuild();" });
// var weekendForm = toolstrip.addFormItem({ name: "hideWeekends", title: "Hide Weekends", titleOrientation: "top", type: "boolean", changed: "timeline.showWeekends = !this.getValue(); timeline.rebuild();" });


isc.Timeline.create({
    ID: "equipmentLoad", 
    height: 600,
    startDate: _calStart, 
    endDate: _calEnd,
    data: events,
    lanes: equipment,
    headerLevels: [ { unit: "day" }, { unit: "hour" } ],
    laneFields: [ { name: "title", title: "Оборудование", width: 250 } ],
    canEditLane: true,
    showEventDescriptions: false,
    columnsPerPage: 5,
    laneEventPadding: 2,
    disableWeekends: false,
    // grouping settings
    canGroupLanes: true,
    laneGroupByField: "operGroup",
    laneFields: [
        { name: "title", title: "Оборудование" },
        // fields which can be grouped must be declared here
        { name: "operGroup", hidden: true }
    ],
	////	    hide events whose name does not contain the "eventFilter"
    // shouldShowEvent : function (event, view) {
        // var text = eventForm.getValue("eventFilter");
        // if (text && text != "") {
            // if (event.name && !event.name.toLowerCase().contains(text.toLowerCase())) {
                // return false;
            // }
        // }
        // return this.Super("shouldShowEvent", arguments);
    // },
    
  ////  hide Lanes whose name does not contain the "laneFilter"
    // shouldShowLane : function (lane, view) {
        // var text = laneForm.getValue("laneFilter");
        // if (lane && text && text != "") {
            // if (lane.name && !lane.name.toLowerCase().contains(text.toLowerCase())) {
                // return false;
            // }
        // }
        // return this.Super("shouldShowLane", arguments);
    // },
    rebuild : function () {
        // rebuild the timelineView
        this.getSelectedView().rebuild(true);
    },
    showIndicators: true,
    indicators: [
        { name: "ThisDay", description: "Текущий момент", startDate: new Date(2015, 11, 18, 11) }
    ]

});


*/

//===============================================================================================================
// Переведено в динамический вариант. Оставлено для примера.
/*isc.CBMDataSource.create({
ID:"EntityKind",
dbName: Window.default_DB,
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
*/
/*
isc.CBMDataSource.create({
	ID:"EntityKind", 
	dbName: Window.default_DB, 
	title: "Классификатор видов объектов", 
	isHierarchy: true, 
	fields: [
	{	name: "ID", title: "ID", showTitle: false, hidden: true, canEdit: false, type: "text"},
	{ name: "Del", title: "Del", showTitle: false, hidden: true, canEdit: false, type: "boolean"},
	{ name: "Code", title: "Код", length: 400, inList: true, type: "text"},
	{ name: "Description", title: "Наименование", length: 1000, inList: true, copyValue: true, type: "text"},
	{ name: "SysCode", title: "Системный код", length: 200, type: "text"},
	{ name: "Source", title: "Первоисточник позиции", copyValue: true, type: "PrgComponent", editorType: "LinkControl", optionDataSource: "PrgComponent", valueField: "ID", displayField: "SysCode", pickListWidth: 500},
	{ name: "OfConcept", 
	title: "Представляет класс", 
	length: 1000, inList: true, 
	copyValue: true, 
	type: "Concept", 
	editorType: "LinkControl", 
	optionDataSource: "Concept", 
	valueField: "ID", 
	displayField: "SysCode", 
	pickListWidth: 500},
	{ name: "Prototype", title: "Прототип", copyValue: true, copyLinked: true, deleteLinked: true, type: "Entity", editorType: "LinkControl", optionDataSource: "Entity", valueField: "ID", displayField: "Description", pickListWidth: 400},
	{ name: "Parent", title: "Вышестоящий тип", inList: true, copyValue: true, deleteLinked: true, type: "EntityKind", editorType: "LinkControl", foreignKey: "EntityKind.ID", rootValue: null, optionDataSource: "EntityKind", valueField: "ID", displayField: "SysCode", pickListWidth: 500},
	{ name: "HierCode", title: "Hierarchy Code", showTitle: false, length: 400, hidden: true, canEdit: false, type: "text"},
	{ name: "Actual", title: "Используется", defaultValue: "true", inList: true, copyValue: true, type: "boolean"}]})
*/
