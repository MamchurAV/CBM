///////////////////////////////////////////////////////////////////////////////
////////////////////////////// Ayda - related /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
/////////////////////////// Ayda - Map facilities /////////////////////////////
isc.BaseWindow.create({
  ID: "MapWindow", 
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


///////////////////// Ayda - Publishing section //////////////////////////

function createPublishings(form, item) {
  var src = form.valuesManager.getValues();
  testCreateDS("PublishingProcessData", 
      function (ds) {
        testCreateDS("Publisher", 
            function(dsPublisher){
              dsPublisher.fetchData(null, 
                  function(dsResponce, data, dsRequest) {
                    
                    var publisher = data.find({SysCode:"Ayda.Feed"});
                    var publication = ds.createInstance();
                    publication.Source = src.ID;
                    publication.Publisher = publisher.ID;
                    publication.Location = src.Location;
                    publication.IsTest = src.IsTest;
                    publication.StartDate = src.StartDate;
                    publication.ExpireTime = getExpireTime(src);
                    form.items[7].innerGrid.grid.addData(publication);
                    
                    publisher = data.find({SysCode:"vk"});
                    publication = ds.createInstance();
                    publication.Source = src.ID;
                    publication.Publisher = publisher.ID;
                    publication.Location = src.Location;
                    publication.IsTest = src.IsTest;
                    publication.StartDate =  new Date(src.StartDate.getTime() + 5*60000);
                    publication.ExpireTime = getExpireTime(src);
                    form.items[7].innerGrid.grid.addData(publication);
                    
                    publisher = data.find({SysCode:"Fb"});
                    publication = ds.createInstance();
                    publication.Source = src.ID;
                    publication.Publisher = publisher.ID;
                    publication.Location = src.Location;
                    publication.IsTest = src.IsTest;
                    publication.StartDate = new Date(src.StartDate.getTime() + 5*60000);
                    publication.ExpireTime = getExpireTime(src);
                    form.items[7].innerGrid.grid.addData(publication);
                  }  
              );
            }
        );
      }
  );
  return false;
}


// Calculates expiration time from PublicationSource of Event concept
function getExpireTime(src) {
  if (src.Concept === "Event") {
    var endDate;
    if (src.DueDate ) {
      endDate = src.DueDate;
    } else if (src.FromDate ) {
      endDate = src.FromDate;
    }
    return dateDiffInDays(src.StartDate, endDate);
  }
}

function runPublishings(form, item) {
  var srcRecords = form.items[7].innerGrid.grid.getData().localData.findAll({"FactEnqueueDate": undefined});
  if (!srcRecords){ 
    isc.warn("Нет записей для публикации, либо все они уже публиковались ранее. Повторную публикацию Вы можете сделать для нужных записей индивидуально - в списке по правой кнопке.");
    return false; 
  }
  
  var mainObject = createFromRecord(form.valuesManager.getValues());
  
  // Test if mainObject is new, and if so 
  //  - save it inside testMainRecordSaved() after confirmation, 
  //    and continue with publishings (by supplied callback)
  if (!mainObject.testMainRecordSaved("  Подумайте, готова ли она к публикации? Всё ли заполнено?", 
                                      form.valuesManager,
                                      continuePublishing, srcRecords)) 
  {
    // If mainObject not new - continue with publishings too
    continuePublishing(srcRecords);
  }
  
  return false;
}


function continuePublishing(srcRecords){
  validateSourceForPublication(srcRecords,
        function(srcRecords) {
          testCreateDS("Publisher", 
            function(dsPublisher){
              dsPublisher.fetchData(null, 
                  function(dsResponce, data, dsRequest) {
                    
                    var publisher = data.find({SysCode: "Ayda.Feed"});
                    var records = srcRecords.findAll({Publisher: publisher.ID});
                    publishByPublisher(records, publisher);
                    
                    publisher = data.find({SysCode: "vk"});
                    records = srcRecords.findAll({Publisher: publisher.ID});
                    setTimeout( publishByPublisher(records, publisher), 60000);
                    
                    publisher = data.find({SysCode: "Fb"});
                    records = srcRecords.findAll({Publisher: publisher.ID});
                    setTimeout( publishByPublisher(records, publisher), 70000);
                  }
              );
            }
          );
        } 
  );
}


function publishByPublisher(srcRecords, publisher) {
  if(srcRecords && publisher) {
    for (var i = 0;  i < srcRecords.length; i++) {
      var rec = srcRecords[i];
        if (rec.PublicationId) {
          isc.confirm("Эта запись уже публиковалась. Зменить прежнюю публикацию?",
            function (ok) {
              if (ok) {
                justPublish(rec, publisher);
              }
            }
          );
        } 
        else {
          justPublish(rec, publisher);
        }
    }
  }
}


function justPublish(rec, publisher, callback) {
  // If this source was already published to Feed - guarantee not overlapping in time
  if (publisher.SysCode === "Ayda.Feed") {
    testUpdateExistingFeeds(rec);        
  }
  
  // Prepare some values for publication
  if (! rec.PublicationAddress) rec.PublicationAddress = '';
  var locationId = "null";
  if (rec.Location) {
    locationId = "\"" + rec.Location + "\"";
  }
  var formerPublId = rec.PublicationId ? rec.PublicationId.trim() : null;
  var payload = "{\"PublishingId\":\"" + rec.ID + "\", \"SourceId\":\"" + rec.Source + "\", \"PublisherCode\": \"" + publisher.SysCode + "\", \"LocationId\": " + locationId + ", \"PublicationAddress\": \"" + rec.PublicationAddress + "\", \"StartDate\": \"" + rec.StartDate.toISOString() + "\", \"ExpireTimeTics\": " + rec.ExpireTime + ", \"IsTest\": " + rec.IsTest + "}";

  // Publish request
  isc.RPCManager.sendRequest({
        data: payload,
        useSimpleHttp: true,
        contentType: "application/json",
        transport: "xmlHttpRequest",
        httpMethod: "POST",
        actionURL: AYDA_WS_URL + "Publishing/Publish",
        callback: function() {
                    // If publisher is Ayda Feed, and this publishing was fulfilled earlier - delete previous feed record
                    if (publisher.SysCode === "Ayda.Feed" && formerPublId) {
                      var feedDS = isc.DataSource.get("Feed");
                      feedDS.removeData ({ID: formerPublId});
                    }
                    
                    if (callback) {
                      callback();
                    }
                  }
      } 
  );
}


// Validates PublicationSource for compliteness for publication 
function validateSourceForPublication(srcRecords, callback) {
  
  if (!srcRecords || srcRecords.length === 0){
    isc.warn("Нет записей для публикации.");
    return;
  }
 
  var invalid = "";
  var srcId = srcRecords[0].Source;
  
  // Media-files - test any picture exists
  var mediaDS = isc.DataSource.get("MediaInfoItem");
  mediaDS.fetchData({PublicationSource: srcId},
    function(responce, data, request) {
      if (!data || data.length === 0){
        invalid = "Отсутствуют медиа-материалы - нужна хотя бы одна картинка.";
      }
      // Location (Geo point) - must exist any
      var geoLocationDS = isc.DataSource.get("GeolocationItem");
      geoLocationDS.fetchData({Service: srcId},
        function(responce, data, request) {
          if (!data || data.length === 0){
            invalid += " Отсутствуют местоположения - нужно хотя бы одно.";
          }
          
          if (invalid === "" && callback) {
            // Contunue publishing
            callback(srcRecords);
          } else {
            // Only inform user
            isc.warn("Не всё необходимое заполнено: " + invalid);
          }
        }
      );
    }
  );
}


// Find existing Feed position which end overlaps new publishing record's start, 
// and shorten the life of previous Feed item to prevent overlaping conflict 
function testUpdateExistingFeeds(record) {
  var feedDS = isc.DataSource.get("Feed");
  feedDS.fetchData({Source: record.Source},
      function(responce, data, request) {
        if (data.length > 0) {
          for(var i = 0; i < data.length; i++) {
            var feed = data[i];
            if (feed.EndDate >= record.StartDate) {
              var d = new Date(record.StartDate);
              feed.EndDate = new Date(d.getTime() - (1 * 24 * 60 * 60 * 1000)); 
              feedDS.updateData(feed);
            } 
          }
        }
      }
  );
}


//// //// //// //// //// VVVVVVVVVVV NOT USED VVVVVVVVVVV //// //// //// //// //// 

////////////////////////// Ayda - Feed facilities /////////////////////////////

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
        "image": "http://ayda.blob.core.windows.net/media/80deaa53-64e8-4e51-90df-d260183ebf94.jpg",\
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

//////////////////////////////////////////////////////////////


