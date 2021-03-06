﻿// ============================================================================
// ========== Temporary candidates section ====================================
// ============================================================================
// EMPTY NOW
//alert(new Date().getTime().toString(16));


// ============================================================================
// ======================= Some common helper functions =======================
// ============================================================================
function loadScript(script) {
  document.writeLn('<' + 'script src="' + script + '"><' + '/script>');
};


function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
};


var parseJSON = function (data) {
  
  var out =  window.JSON && window.JSON.parse 
  ? window.JSON.parse(data) 
  : (new Function("return " + data))();
  return out;
};


// ----------------- Additions to standard Array ---------------------------------
// ---- To clear it ------------------------------------------
Array.prototype.popAll = function () {
  while (this.length > 0) {
    this.pop();
  }
};


// ----- To find element (if ECMAScript 7 not supported by browser)
if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchElement /*, fromIndex*/) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1], 10) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {
        k = 0;
      }
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
        (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
        return true;
      }
      k++;
    }
    return false;
  };
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
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = clone(obj[attr])
      }
      ;
    }
    return copy;
  }
  throw new Error("Unable to copy obj! Its type isn't supported.");
};


// --- Useful to copy values of fields from src to dest objects. ----------------
function syncronize(src, dest, exclude) {
//  var destRelationsMeta = dest.getRelatonsMeta(); // TODO: CBMObject.getRelatonsMeta()
  for (var attr in src) {
    if (src.hasOwnProperty(attr)
      && dest.hasOwnProperty(attr)
      /*&& !dest.overloaded*/
      && (!exclude || exclude.indexOf(attr) === -1) ) {
      // Aggregated object
      /*      if (destRelationsMeta[attr].RelationKind === "AggregateLink"){
       dest[attr] = syncronize(src[attr]);
       }
       // Collection aggregated
       else if (destRelationsMeta[attr].RelationKind === "CollectionAggregate"){
       }
       // Collection of links
       else if (destRelationsMeta[attr].RelationKind === "Collection"){
       }
       // Link to other object
       else if (destRelationsMeta[attr].RelationKind === "Link"){
       }
       else {*/
      // Scalar value
      if (dest[attr] !== src[attr]) {
        dest[attr] = src[attr];
        dest.infoState = "changed";
      }
    }
  }
};


// ----- Includes properties (with values) from second and next objects to first one.
// Properties from first object (or just included) are NOT replaced by that in later objects.
// - So priority is established from first to lust.
function collectObjects() {
  var ret = arguments[0]; //{};
  var len = arguments.length;
  for (var i = 1; i < len; i++) {
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
 * (Chosen after speed tests! - MAV)
 *
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 *
 * Alexander Mamchur have modified first segment of UUID
 * to gain sequential growing UUID-s for DBMS storage efficiency.
 * (Not for MSSQL due to it-s specific GUID structure! (back ordering sequence))
 **/
var UUID = (function () {
  var self = {};
  var lut = [];
  for (var i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
  }
  self.generate = function () {
    // var d0 = Math.random() * 0xffffffff | 0; // <<< Original Jeff Ward's version
    var d0 = new Date().getTime().toString(16).slice(-8); // <<< Alexander Mamchur replacement to gain sequential growing first part
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    // VVVVV Original Jeff Ward's version
    // return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
    // lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
    // lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
    // lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff]; 
    // ^^^^^ Original Jeff Ward's version
    return d0 + '-' +
    lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
    lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
    lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
  }
  return self;
})();


// Date difference calculation //
var _MS_PER_DAY = 1000 * 60 * 60 * 24;
function dateDiffInDays(begDate, endDate) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(begDate.getFullYear(), begDate.getMonth(), begDate.getDate());
  var utc2 = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}


// ============================================================================
// ============================================================================
// ============================================================================
// ======================== CBM - specific functions ==========================
// ============================================================================
// ============================================================================
// ============================================================================

// ================ iSC core customisations (in allowed way) ==================
isc.RPCManager.addClassProperties({
   handleTransportError : function (transactionNum, status, httpResponseCode, httpResponseText) 
   {
    if (status === -90 && httpResponseCode === 0) {
      isc.warn(isc.CBMStrings.ServerCall_Fail);
      return false;        
    }
   }
})


// =================== UI parameters globals =====================
var ICON_SIZE_SMALL = 10;



// ======= Dynamic creation of Isomorphic DataSource (DS) from Metadata =======
// --- Function that generates Isomorphic DataSource (DS) text from universal CBM metadata. ---
function generateDStext(forView, futherActions) {
  // --- Get all concept metadata ---
  var viewRec = viewRS.find("SysCode", forView);
  if (viewRec === null) {
    isc.warn(isc.CBMStrings.MD_NoPrgViewFound + forView, null);
    return;
  }
  var conceptRec = conceptRS.find("ID", viewRec["ForConcept"]);
  if (conceptRec === null) {
    isc.warn(isc.CBMStrings.MD_NoConceptFound + forView, null);
    return;
  }

  // --- Creation of head part of DS ---
  resultDS = "isc.CBMDataSource.create({ID: \"" + forView + "\",";

  if (conceptRec.DataBaseStore && conceptRec.DataBaseStore !== "null") {
    resultDS += "dbName: \"" + conceptRec.DataBaseStore.ConnectionParams + "\", ";
  } 

  var dsTitle = getLang(viewRec["Description"], tmp_Lang, true);
  if (dsTitle === null) {
    dsTitle = getLang(conceptRec["Description"], tmp_Lang, true)
  }
  if (dsTitle === null) {
    dsTitle = getLang(viewRec["Description"], tmp_Lang, false);
  }
  if (dsTitle === null) {
    dsTitle = getLang(conceptRec["Description"], tmp_Lang, false);
  }
  if (dsTitle === null) {
    dsTitle = forView;
  }
  resultDS += "title: \"" + dsTitle + "\", ";
  if (conceptRec.ExprToString && conceptRec.ExprToString !== "null") {
    resultDS += "titleField: \"" + conceptRec.ExprToString + "\", ";
  } else {
    resultDS += "titleField: \"Description\", ";
  }
  if (conceptRec.ExprToStringDetailed && conceptRec.ExprToStringDetailed !== "null") {
    resultDS += "infoField: \"" + conceptRec.ExprToStringDetailed + "\", ";
  } else {
    resultDS += "infoField: \"Description\", ";
  }
  if (conceptRec.IsHierarchy === true) {
    resultDS += "isHierarchy: " + conceptRec.IsHierarchy + ", ";
  }
  if (viewRec.CanExpandRecords && viewRec.CanExpandRecords === true) {
    resultDS += "canExpandRecords: true, ";
  }
  if (viewRec.ExpansionMode && viewRec.ExpansionMode !== "null") {
    resultDS += "expansionMode: \"" + viewRec.ExpansionMode + "\", ";
  }
  if (viewRec.ExpandedConcept && viewRec.ExpandedConcept !== "null") {
    resultDS += "detailDS: \"" + viewRec.ExpandedConcept + "\", ";
  }
  if (viewRec.ChildExpansionMode && viewRec.ChildExpansionMode !== "null") {
    resultDS += "childExpansionMode: \"" + viewRec.ChildExpansionMode + "\", ";
  }
  if (viewRec.MainTabName && viewRec.MainTabName !== "null") {
    resultDS += "mainTabName: \"" + getLang(viewRec.MainTabName, tmp_Lang, false) + "\", ";
  }

  // ---------- DS Fields creation ----------
  resultDS += "fields: [";
  // --- Some preparations ---
  var viewFields;
  var relations;
  isc.DataSource.get("PrgViewField").fetchData(
    {ForPrgView: viewRec.ID},
    function (dsResponce, data, dsRequest) {
    viewFields = data;
    if (!viewFields || viewFields.length === 0) {
      isc.warn("No ViewFields found for " + forView);
      return null;
    }

    // No "Concept" field in View - create it mandatory 
    if (!viewFields.find({SysCode: "Concept"})) {
      resultDS += "{name: \"Concept\", type: \"text\", hidden: true}, ";
    }
    
    // --- Relations with respect of base concepts relations ---
    getRelationsForConcept(conceptRec.ID,
        function (relationsData) {
            relations = relationsData;

        // --- Just fields creation ---
          var viewFieldsCount = viewFields.getLength();
          for (var i = 0; i < viewFieldsCount; i++) {
            var currentRelation = relations.find("ID", viewFields[i].ForRelation);
            
            // ------ Some special cases -------
            // No relation - means view only element - processed below
            if (!currentRelation) {
              resultDS += "{name: \"" + viewFields[i].SysCode + "\", editorType: \"" + viewFields[i].ControlType + "\"}, ";
              continue;
            }

            // ------ Ordinal relation-based element creation section ------
            resultDS += "{ name: \"" + viewFields[i].SysCode + "\", ";

            var kind = currentRelation.RelationKind;
            resultDS += "kind: \"" + kind + "\", ";

            var fldTitle = getLang(viewFields[i].Title, tmp_Lang, true);
            if (fldTitle === null) {
              fldTitle = getLang(currentRelation.Description, tmp_Lang, true)
            }
            if (fldTitle === null) {
              fldTitle = getLang(viewFields[i].Title, tmp_Lang, false);
            }
            if (fldTitle === null) {
              fldTitle = getLang(currentRelation.Description, tmp_Lang, false);
            }
            if (fldTitle === null) {
              fldTitle = currentRelation.SysCode;
            }
            resultDS += "title: \"" + fldTitle + "\", ";
            // TODO ???VVV??? - to rethink!
            if (fldTitle === "Code") {
              resultDS += "treeField: true, ";
            }

            if (viewFields[i].ShowTitle === false) {
              resultDS += "showTitle: false, ";
            } else {
              resultDS += "showTitle: true, ";
            }
            if (currentRelation.Size > 0) {
              resultDS += "length: " + currentRelation.Size + ", ";
            }
            if (viewFields[i].Hidden === true) {
              resultDS += "hidden: true, ";
            }
            // If "Mandatory" property is set on View level - it override that set in Relation
            if (!viewFields[i].Mandatory ) {
              if (currentRelation.Mandatory === true) {
                resultDS += "required: true, ";
              }
            } else if (viewFields[i].Mandatory === true) {
              resultDS += "required: true, ";
            }
              
            if (currentRelation.ExprDefault && currentRelation.ExprDefault !== "null" && currentRelation.ExprDefault !== null) {
              resultDS += "defaultValue: \"" + currentRelation.ExprDefault + "\", ";
            }
            if ((!currentRelation.DBColumn || currentRelation.DBColumn === "null" || currentRelation.DBColumn === null || currentRelation.DBColumn === "undefined") && kind !== "CollectionControl") {
              resultDS += "canSave: false, ";
              // only if canSave === false - editable === true needs explicit presentation
              if (viewFields[i].Editable === true) {
                resultDS += "canEdit: true, ";
              }
            }
            // Only editable === false needs explicit presentation (except case when canSave === false)
            if (viewFields[i].Editable === false) {
              resultDS += "canEdit: false, ";
            }
            if (viewFields[i].ViewOnly === true) {
              resultDS += "ignore: true, ";
            }
            if (currentRelation.Domain && currentRelation.Domain !== "null" && currentRelation.Domain !== null) {
              resultDS += "valueMap: " + currentRelation.Domain + ", ";
            }
            if (viewFields[i].UIPath && viewFields[i].UIPath !== "null") {
              resultDS += "UIPath: \"" + viewFields[i].UIPath + "\", ";
            }
            if (viewFields[i].InList === true) {
              resultDS += "inList: true, ";
            }
            if (viewFields[i].ColSpan && viewFields[i].ColSpan !== "null") {
              resultDS += "colSpan: " + viewFields[i].ColSpan + ", ";
            }
            if (viewFields[i].RowSpan && viewFields[i].RowSpan !== "null") {
              resultDS += "rowSpan: " + viewFields[i].RowSpan + ", ";
            }
            if (viewFields[i].Hint && viewFields[i].Hint !== "null") {
              resultDS += "prompt: \"" + getLang(viewFields[i].Hint, tmp_Lang, false) + "\", ";
            }
            
            //TODO ? Maybe move items below to kind-specific places?
            resultDS += "align: \"left\", ";
            // resultDS += "vAlign: \"center\", ";
            // resultDS += "titleVAlign: \"center\", ";
            
            if (currentRelation.CopyValue === true) {
              resultDS += "copyValue: true, ";
            }
            if (currentRelation.RelationStructRole && currentRelation.RelationStructRole !== "null" && currentRelation.RelationStructRole !== null) {
              resultDS += "relationStructRole: \"" + currentRelation.RelationStructRole + "\", ";
            }
            if (currentRelation.VersPart && currentRelation.VersPart !== "null" && currentRelation.VersPart !== null) {
              resultDS += "part: \"" + currentRelation.Part + "\", ";
            }
            if (currentRelation.MainPartID && currentRelation.MainPartID !== "null" && currentRelation.MainPartID !== null) {
              resultDS += "mainPartID: \"" + currentRelation.MainPartID + "\", ";
            }
            
            var relatedConceptRec = conceptRS.find("ID", currentRelation.RelatedConcept);
            var backLinkRelationRec = relationRS.find("ID", currentRelation.BackLinkRelation);
            // For all types of Relation - special EditorType may be defined
            if (viewFields[i].ControlType && viewFields[i].ControlType !== "null") {
              resultDS += "editorType: \"" + viewFields[i].ControlType + "\", ";
            }
            resultDS += "emptyDisplayValue: \"\", ";
             
            if (kind === "Command") {
 //             resultDS += "type: \"button\", ";
 //             resultDS += "editorType: \"ButtonItem\", ";
 //             resultDS += "autoFit: true, ";
 //             resultDS += "readOnly: false, ";
 //             resultDS += "disabled: false, ";
 //             resultDS += "startRow: false, ";
 //             resultDS += "endRow: false";
              if (currentRelation.ExprFunctions && currentRelation.ExprFunctions !== "null" && currentRelation.ExprFunctions !== null) {
                resultDS += "click: " + currentRelation.ExprFunctions;
              }
            }
            else {
              var type = relatedConceptRec.SysCode;
              switch (type) {
                case "Integer":
                case "Bigint":
                  resultDS += "type: \"localeInt\"";
                  break;
                case "Decimal":
                case "BigDecimal":
          //        resultDS += "type: \"localeFloat\"";
                  resultDS += "type: \"float\"";
                  break;
                case "Money":
          //        resultDS += "type: \"localeCurrency\"";
                  resultDS += "type: \"float\"";
                  break;
                case "StandardString":
                case "LongString":
                case "ShortString":
                case "GUID":
                  resultDS += "type: \"text\"";
                  break;
                case "StandardMlString":
                case "LongMlString":
                case "ShortMlString":
                  resultDS += "type: \"multiLangText\", filterEditorType: \"text\", ";
                  if (viewFields[i].ControlType && viewFields[i].ControlType !== "null") {
                    resultDS += "editorType: \"" + viewFields[i].ControlType + "\"";
                  } else {
                    resultDS += "editorType: \"MultilangTextItem\"";
                  }
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
                  resultDS += "type: \"datetime\"";
                  break;
                case "Time":
                  resultDS += "type: \"time\"";
                  break;
                case "Any":
                  resultDS += "type: \"any\"";
                  break;
                case "Binary":
                  resultDS += "type: \"binary\"";
                  break;
                case "BLOB":
                  resultDS += "type: \"blob\"";
                  break;
                case "Image":
                  resultDS += "type: \"image\"";
                  break;
                case "URL":
                  resultDS += "type: \"link\", ";
                  resultDS += "canEdit: \"false\"";
                  break;
                  
                default:
                  // --- Not primitive type - association type matters
                  if (currentRelation.CopyLinked === true) {
                    resultDS += "copyLinked: true, ";
                  }
                  if (currentRelation.DeleteLinked === true) {
                    resultDS += "deleteLinked: true, ";
                  }

                  if (kind === "Link") {
                    resultDS += "type: \"" + type + "\", ";
                    if (!viewFields[i].ControlType || viewFields[i].ControlType === "null"){
                      resultDS += "editorType: \"LinkControl\", ";
                    }
                    // Concerning "foreignKey" below: If "foreignKey" is not single - hierarchy won't work!
                    // because first "foreignKey" field are taken as hierarchy link - no matter "rootValue".
                    // So it had to be placed to hierarchy field only.
                    if (currentRelation.Root > 0) {
                      resultDS += "foreignKey: \"" + type + ".ID\", ";
                      resultDS += "rootValue: " + currentRelation.Root + ", ";
                    } else if (currentRelation.HierarchyLink === true) {
                      resultDS += "foreignKey: \"" + type + ".ID\", ";
                      resultDS += "rootValue: null, ";
                    }
                    if (viewFields[i].DataSourceView && viewFields[i].DataSourceView !== "null") {
                      resultDS += "optionDataSource: \"" + viewFields[i].DataSourceView + "\", ";
                    } else {
                      resultDS += "optionDataSource: \"" + type + "\", ";
                    }
                    if (currentRelation.LinkFilter && currentRelation.LinkFilter !== "null") {
                      resultDS += "optionCriteria: " + currentRelation.LinkFilter + ", ";
                    }
                    if (viewFields[i].ValueField && viewFields[i].ValueField !== "null") {
                      resultDS += "valueField: \"" + viewFields[i].ValueField + "\", ";
                    } else {
                      resultDS += "valueField: \"ID\", ";
                    }
                    if (viewFields[i].DisplayField && viewFields[i].DisplayField !== "null") {
                      resultDS += "displayField: \"" + viewFields[i].DisplayField + "\", ";
                    } else {
                      resultDS += "displayField: \"Description\", ";
                    }
                    if (viewFields[i].PickListFields && viewFields[i].PickListFields !== null && viewFields[i].PickListFields !== "null") {
                      resultDS += "pickListFields: " + viewFields[i].PickListFields + ", ";
                    }
                    if (viewFields[i].PickListWidth > 0) {
                      resultDS += "pickListWidth: " + viewFields[i].PickListWidth;
                    } else {
                      resultDS += "pickListWidth: 450 ";
                    }
                  } 
                  else if (kind === "BackLink" || kind === "BackAggregate") {
                    if (!backLinkRelationRec){
                      throw new Error("backLinkRelation not actual for field <" + fldTitle + "> of <" + forView + "> concept in generateDStext().");
                    }
                    resultDS += "type: \"custom\", "; //<<< ???
  //                  resultDS += "type: \"" + backLinkRelationRec.SysCode + "\", ";
                    resultDS += "canSave: true, ";
  //                  var editorType = editorType
                    if (!viewFields[i].ControlType || viewFields[i].ControlType === "null" || viewFields[i].ControlType === "") {
                      resultDS += "editorType: \"" + (kind === "BackAggregate" ? "CollectionAggregateControl" : "CollectionControl") + "\", ";
                    }
                    resultDS += "relatedConcept: \"" + relatedConceptRec.SysCode + "\", ";
                    resultDS += "backLinkRelation: \"" + backLinkRelationRec.SysCode + "\", ";
                    if (viewFields[i].ValueField && viewFields[i].ValueField !== "null") {
                      resultDS += "mainIDProperty: \"" + viewFields[i].ValueField + "\", ";
                    } else {
                      resultDS += "mainIDProperty: \"ID\", ";
                    }
                    if (viewFields[i].DataSourceView && viewFields[i].DataSourceView !== "null") {
                      resultDS += "optionDataSource: \"" + viewFields[i].DataSourceView + "\", ";
                    } else {
                      resultDS += "optionDataSource: \"" + type + "\", ";
                    }
                    if (currentRelation.LinkFilter && currentRelation.LinkFilter !== "null") {
                      resultDS += "optionCriteria: " + currentRelation.LinkFilter + ", ";
                    }
                    resultDS += "titleOrientation: \"top\" ";
                  } 
                  else if (kind === "CrossLink") {
                    resultDS += "type: \"custom\", "; //<<< ???
  //                  resultDS += "type: \"" + backLinkRelationRec.SysCode + "\", ";
                    resultDS += "canSave: true, ";
                    if ( !viewFields[i].ControlType || viewFields[i].ControlType === "null" || viewFields[i].ControlType === "") {
                      resultDS += "editorType: \"" + "CollectionCrossControl" + "\", ";
                    }
                    resultDS += "relatedConcept: \"" + relatedConceptRec.SysCode + "\", ";
                    resultDS += "backLinkRelation: \"" + backLinkRelationRec.SysCode + "\", ";
                    var crossConceptRec = conceptRS.find("ID", currentRelation.CrossConcept);
                    if (crossConceptRec) {
                      resultDS += "crossConcept: \"" + crossConceptRec.SysCode + "\", ";
                    }
                    var crossRelationRec = relationRS.find("ID", currentRelation.CrossRelation);
                    if (crossRelationRec) {
                      resultDS += "crossRelation: \"" + crossRelationRec.SysCode + "\", ";
                    }
                    if (viewFields[i].ValueField && viewFields[i].ValueField !== "null") {
                      resultDS += "mainIDProperty: \"" + viewFields[i].ValueField + "\", ";
                    } else {
                      resultDS += "mainIDProperty: \"ID\", ";
                    }
                    if (viewFields[i].DataSourceView && viewFields[i].DataSourceView !== "null") {
                      resultDS += "optionDataSource: \"" + viewFields[i].DataSourceView + "\", ";
                    } else {
                      resultDS += "optionDataSource: \"" + type + "\", ";
                    }
                    if (currentRelation.LinkFilter && currentRelation.LinkFilter !== "null") {
                      resultDS += "optionCriteria: " + currentRelation.LinkFilter + ", ";
                    }
                    resultDS += "titleOrientation: \"top\"";
                  }
                  else {
                    resultDS += "type: \"" + type + "\" ";
                  }
              }
              if (currentRelation.ExprFunctions && currentRelation.ExprFunctions !== "null" && currentRelation.ExprFunctions !== null) {
                resultDS += ", " + currentRelation.ExprFunctions;
              }
            }
            resultDS += "},";
          }
          resultDS = resultDS.slice(0, resultDS.length - 1);
           resultDS += "]";
          // --------- Functions processing ----------
          // --- Standard functions blocks ---
          if (conceptRec.MenuAdditions && conceptRec.MenuAdditions !== "null") {
            resultDS += ", MenuAdditions: " + conceptRec.MenuAdditions;
          }
          if (conceptRec.CreateFromMethods && conceptRec.CreateFromMethods !== "null") {
            resultDS += ", CreateFromMethods: " + conceptRec.CreateFromMethods;
          }
          // --- Any functions ---
          isc.DataSource.get("PrgFunction").fetchData(
              {ForConcept: conceptRec.ID}, 
              function (responce, data) {
                if (data.length > 0) {
                  resultDS += ", ";
                  for (var i = 0; i < data.length; i++) {
                    resultDS += data[i].CodeBlock;
                    if (i < data.length - 1) {
                      resultDS += ", ";
                    }
                  }
                }  

                resultDS += "})";

                // --- Callback for program flow after DS creation
                if (futherActions && futherActions != null) {
                  futherActions(resultDS);
                }
              }
          );
        }
    );
  });
}


// --- Function that provide creation of some Isomorphic DataSource (DS) itself
//     from universal CBM metadata. ---
function createDS(forView, callback) {
  // ---DS text generation ---
  generateDStext(forView, 
    function (resultDS) {
      // --- DS creation
      try {
        var ds = eval(resultDS);
      } catch (err) {
        isc.warn("Error in dynamically generearated DS " + forView + "."/*  Full generated text: " + resultDS*/);
      }
    
      if (ds){
        // Guarantie existence of linked DataSources (for one level in-depth)
        ds.resolveLinks(callback);
      } else if (callback && callback != null) {
        callback(null);
      }
    }
  );
}


// --- Function that tests DS existence and links to first-level actuality, and if absent - creates it.
function testCreateDS(forView, callback) {
  var ds = isc.DataSource.getDataSource(forView); 
  if (ds && ds.isA("isc.CBMDataSource")) {
    // Guarantie existence of linked DataSources (for one level in-depth)
    if(!ds.hasResolvedLinks) {
      ds.resolveLinks(callback);
    } else if (callback && callback != null) {
      callback(ds);
    }
  } else {
    createDS(forView, callback);
  }
}


// ============================================================================================
// ------------- Object - navigation functions ------------------------------------------------
// ============================================================================================

function getRelation(concept, relation) {
  var ds = isc.DataSource.getDataSource(concept);
  if (ds) {
    return ds.getRelation(relation);
  }
  return null;
};

// --- Universal helper-like function that return object _and/or_ set as parameter for callback - by ID ---
function getObject(concept, idParam, callback, context) {
  var ds = isc.DataSource.getDataSource(concept);
  if (!ds) { 
    return null;
  }
  var obj;
  if (ds.getCacheData()) {
    obj = ds.getCacheData().find({ID: idParam});
  }
  if (!obj) {
    obj = ds.fetchData({ID: idParam}, function (responce, data) {
      if (data.length > 0) {
        if (callback) {
          callback(data[0]);
        }
        return data[0];
      }
    });
  }
  else {
    if (callback) {
      callback(obj);
    }
    return obj;
  }
};

// --- Universal helper-like function that return object _and/or_ set as parameter for callback - by Filter---
function getObjectByFilter(concept, filter, callback, context) {
  var ds = isc.DataSource.getDataSource(concept);
  var obj;
  if (ds.getCacheData()) {
    obj = ds.getCacheData().find(filter);
  }
  if (!obj) {
    obj = ds.fetchData(filter, function (responce, data) {
      if (data.length > 0) {
        if (callback) {
          callback(data[0]);
        }
        return data[0];
      }
    });
  }
  else {
    if (callback) {
      callback(obj);
    }
    return obj;
  }
};


// Get final object in objects dot-separated chain expression 
function processObjectsChain(expr, context, callback) {
//  'use strict'; // <<< Don't remember reason for "strict"
  if (!expr || expr === "null") {
    return null;
  }
//  var exprOut = expr;
  var i = 0;

    var valArr = expr.split('.');
    var tmpVal;

    function processValue(innerContext) {
      i += 1;
      if (i < valArr.length) {
        tmpVal = innerContext[valArr[i]];
        if (likeKey(tmpVal) && i < valArr.length - 1) {
          // Get object for further processing
          var thatConcept = conceptRS.find({ID: getRelation(innerContext.Concept, valArr[i]).RelatedConcept});
          getObject(thatConcept.SysCode, tmpVal, processValue, innerContext);
        } else {
          if (callback) {
            callback(tmpVal);
          }
        }
      }
    };
    processValue(context);

   return tmpVal;
};

/*
// /[A-Za-z0-9_\.(]+(?!")[ .(),\+\-\*}]/g
function processExpression(expr, context) {
  var arrAttr = /[A-Za-z0-9_\.(]+(?!")[ .(),\+\-\*}]/g.exec(expr);
  var arrVal = [];
  for (var i = 0; i < arrAttr.length; i++) {
    // Additional cleaning
    arrOut[i] = /[A-Za-z0-9_.()]+/g.exec(arrOut[i])[0].trim();
    arrVal[i] = processValue(arrOut[i], context);
  }
  // TODO: Build resulting expression
  var exprOut = expr;

  return exprOut;
};

function processValue(value, context) {
  var outVal = value;
  return outVal;
} */


// TODO provide inline functions execution and result insertion
function processJSONExpression(expr, context) {
//  'use strict'; // <<< Don't remember reason for "strict"
  if (!expr || expr === "null") {
    return null;
  }
  var exprOut = expr;
  // Temporary remove brackets
  var exprInn = exprOut;
  if (expr.charAt(0) == '{') {
    exprInn = expr.slice(1);
  }
  if (expr.charAt(expr.length - 1) == '}') {
    exprInn = exprInn.slice(0, exprInn.length - 1);
  }
  // Split to  properties
  var exprArr = exprInn.split(',');
  // Process properties values that needs processing
  var outArr = [];
  var i = -1;
  var j = 0;

  function processElement() {
    i += 1;
    if (i < exprArr.length) {
      var propVal = exprArr[i].split(':')[1].trim();
      // Processing value
      if (propVal.charAt(0) === '"' && propVal.charAt(propVal.length - 1) === '"') {
        // String value - no processing need
        outArr[i] = exprArr[i];
        processElement();
      } else if (propVal.search("this.") === 0) {
        var valArr = propVal.split('.');
        var tmpVal;

        function processValue(innerContext) {
          j += 1;
          if (j < valArr.length) {
            tmpVal = innerContext[valArr[j]];
            if (likeKey(tmpVal) && j < valArr.length - 1) {
              // Get object for further processing
              var thatConcept = conceptRS.find({ID: getRelation(innerContext.Concept, valArr[j]).RelatedConcept});
              getObject(thatConcept.SysCode, tmpVal, processValue, innerContext);
            }
            if (j === valArr.length - 1 && i < exprArr.length) { //<<< TODO: ?if expression become longer
              outArr[i] = exprArr[i].split(':')[0].trim() + ":\"" + tmpVal + "\"";
              processElement();
            }
          }
        };
        processValue(context);
      }
    }
  };
  processElement();

  exprOut = "{";
  for (var z = 0; z < outArr.length; z++) {
    exprOut += outArr[z];
    if (z < outArr.length - 1) {
      exprOut += ",";
    }
  }
  exprOut += "}";

  return exprOut;
};

function isString(s) {
  return typeof(s) === 'string' || s instanceof String;
}

// Determine if value looks like (or can be) CBM object's identifier
function likeKey(val) {
  if (isString(val) && val.length === 36
    && val.charAt(8) === '-' && val.charAt(13) === '-' && val.charAt(18) === '-' && val.charAt(23) === '-') {
    return true;
  }
  return false;
}


// Returns (by callback call) relations for current concept, with merged parents hierarchy's relations.
function getRelationsForConcept(conceptId, callback) {
  var conceptDS = isc.DataSource.get("Concept"); // <<<<<<<<<<<<<<<<<<< var 
  var relations = [];
  var inherited = false;
  function innerGetRelations(conceptId, callbackBound) {
    if (conceptDS.hasAllData()) {
      var record = conceptDS.getCacheData().find({ID: conceptId});
      isc.DataSource.get("Relation").fetchData({ForConcept: conceptId}, 
        function(relationsFetched) {
          var relationsToThis = relationsFetched.data;
          var i = 0;
          if (relationsToThis !== null) {
            
            for (i; i < relationsToThis.length; i++) {
              var exists = false;
              var j = 0;
              for (j; j < relations.length; j++) {
                if (relations[j].SysCode === relationsToThis[i].SysCode && !relations[j].Del) {
                  exists = true;
                  if (!relations[j]._inherited) {
                    relations[j]._modified = true;
                  }
                }
              }
              if (!exists || !inherited) {
                relationsToThis[i]._inherited = inherited;
                if (inherited) {
                  relationsToThis[i]._modified = false;
                }
                relationsToThis[i].ForConceptSysCode = record.SysCode;
                relations.add(relationsToThis[i]);
              }
            }
          }
          if (record && record.BaseConcept && record.BaseConcept !== "null") {
            // Initialize relations for discovered Concept
            inherited = true;  
            innerGetRelations(record.BaseConcept, callbackBound);
          } else {
          if (record && relations){
            record.relations = relations.sortByProperty("Odr", true); 
          }
          if (callbackBound) {
            callbackBound(relations.sortByProperty("Odr", true));
          }
        }
      });
    }
  }
 
  var callbackBound = callback.bind(this); // <<< TODO: in main cases "this" here is just "window", so bind() looks abused
  innerGetRelations(conceptId, callbackBound);
}


// Returns (by callback call) relations for current concept, with merged parents hierarchy's relations.
function getRelationsForConceptName(conceptName, callback) {
  var conceptDS = isc.DataSource.get("Concept");
  var filter = {SysCode: conceptName };
  var conceptRecord = conceptDS.getCacheData().find(filter);
  var conceptID = conceptRecord.ID;
  getRelationsForConcept(conceptID, 
      function (rel) {
        isc.DataSource.get(conceptName).relations = rel;
        if (callback) {
          callback(rel); 
        }
      }
  );
}


// Returns (by callback call) relations for concept of requested "forView" param, with merged parents hierarchy's relations.
function getRelationsForViewConcept(forView, callback) {

  var viewRec = viewRS.find("SysCode", forView);
  
  if (viewRec) {
  var conceptDS = isc.DataSource.get("Concept");
  var filter = {ID: viewRec.ForConcept};
  var conceptRec = conceptDS.getCacheData().find(filter);
  var conceptName = conceptRec.SysCode;
  
//  if (viewRec) {
    getRelationsForConcept(viewRec.ForConcept, 
        function (rel) {
          var ds = isc.DataSource.get(conceptName);
          if(ds) { ds.relations = rel; }
          if (callback) {
            callback(rel); 
          }
        }
    );
  }

  // if (viewRec) {
    // getRelationsForConcept(viewRec.ForConcept, 
        // function (rel) {
          // testCreateDS(conceptName, 
            // function(ds){
              // if (!ds){
                // throw new Error("Undefined DS <" + conceptName + "> for PrgView <" + forView + "> in getRelationsForViewConcept()." );
              // }
              // ds.relations = rel;
              // if (callback) {
                // callback(rel); 
              // }
            // }
          // );
        // }
    // );
  // }
}



// ============================================================================
// ====================== Transactional data processing =======================
// ============================================================================
// ---------------- Singleton TransactionManager object -----------------------
var TransactionManager = {};
// - Managed transactions with default instance -
TransactionManager.transactions = [{Id: "default", Changes: []}];

// - Internal functions -
TransactionManager.createTransaction = function () {
  newTransaction = {Id: UUID.generate(), Changes: []}
  this.transactions.push(newTransaction);
  return newTransaction;
}


TransactionManager.getTransaction = function (transact) {
  var currTrans = null;
  if (transact) {
    currTrans = this.transactions.find("Id", transact.Id);
  } else {
    currTrans = this.transactions.find("Id", "default");
  }
  return currTrans;
};


// ------- Add object to transaction -------
TransactionManager.add = function (obj, transact, first) {
  var currTrans;
  if (transact) {
    currTrans = this.getTransaction(transact);
    // If tansact-parameter not in TransactionManager - add it
    if (!currTrans) {
      this.transactions.push(transact);
      currTrans = transact;
    }
    obj.currentTransaction = transact;
  } 
  else if (obj.currentTransaction) {
    currTrans = this.getTransaction(obj.currentTransaction);
    if (!currTrans) {
      this.transactions.push(obj.currentTransaction);
      currTrans = obj.currentTransaction;
    }
  } 
  else {
    currTrans = this.transactions.find("Id", "default");
    obj.currentTransaction = currTrans;
  }
  
  // Remove former stored object if that is the case
  for (var i = 0; i < currTrans.Changes.length; i++) {
    if (currTrans.Changes[i].ID === obj.ID) {
      currTrans.Changes.splice(i, 1);
    }
  }
  
  // Guarantie main object to be the first. Others - no matter.
  if (first) {
    currTrans.Changes.unshift(obj);
  } else {
    currTrans.Changes.push(obj);
  }
};


TransactionManager.commit = function (transact, callback, reverseOrder) {
  var currTrans = this.getTransaction(transact);
  if (currTrans !== null) {
    // TODO: Save objects in transaction to isc Data Source
    var len = currTrans.Changes.getLength();
    if (len === 0) {
      return;
    }
    // For more complicated cases - TODO: analyse dependensies and establish right order...
    var i = 0;
    
    for (i; i < len - 1; i++) {
      // Imoptant to clean up transaction in object _before_ it'll be saved to avoid infinite recurcion
      currTrans.Changes[i].currentTransaction = null;
      currTrans.Changes[i].save(true); // Call CBMobject's save()
      // >>> ??? currTrans.Changes[i].currentTransaction = null;
    }
    // The last object in transaction 
    // Imoptant to clean up transaction in object _before_ it'll be saved to avoid infinite recurcion
    currTrans.Changes[i].currentTransaction = null;
    if (currTrans.Id !== "default") {
      currTrans.Changes[i].save(true, undefined, undefined);
    } else {
      // Last call CBMobject's save() - with callback
      currTrans.Changes[i].save(true, undefined, undefined, callback);
    }
    // >>> ??? currTrans.Changes[i].currentTransaction = null;
    
    this.clear(currTrans);
    this.close(currTrans); // <<<<TODO Test uncommented (23.05.2017)
    
    // -- Commit default transaction too!!!
    if (currTrans.Id !== "default") {
      this.commit(this.transactions.find("Id", "default"), callback);
    }
  }
};


TransactionManager.clear = function (transact) {
  var currTrans = this.getTransaction(transact);
  if (currTrans !== null) {
    currTrans.Changes.popAll();
  }
};


TransactionManager.close = function (transact) {
  if (transact && transact.Id !== "default") {
    var currTrans = this.transactions.find("Id", transact.Id);
    for (var i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i] === currTrans) {
        this.transactions.splice(i, 1);
      }
    }
  }
};


// ==========================================================================================
// ----- Data in isc DS caches manipulation - without processing in persistent storage. -----
// ==========================================================================================
var addDataToCache = function (rec) {
  currentDS = isc.DataSource.get(rec.Concept);
  if (currentDS) {
      if (currentDS.cacheResultSet == undefined) {
      currentDS.setCacheAllData(true);
    }
    var dsResponse = {
      operationType: "add",
      data: [rec]
    };
    currentDS.updateCaches(dsResponse);
  }
};

var updateDataInCache = function (rec) {
  currentDS = isc.DataSource.get(rec.Concept);
  if (currentDS) {
    var dsResponse = {
      operationType: "update",
      data: [rec]
    };
    currentDS.updateCaches(dsResponse);
  }
};

var removeDataFromCache = function (rec) {
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
// ============================ CBM  DataSource ===============================
// ============================================================================

// =========== Some helper classes and functions for CBM DataSource ===========

var sendCommand = function (command, httpMethod, params, callback) {
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
  getNextID: function () {
    return UUID.generate();
  }
});

// ------ Create local (clientOnly) dataSource from other ----------------
var getClientOnlyDS = function (ds) {
  var dsLocal = isc.CBMDataSource.create({ID: ds.ID + "_" + this.ID, clientOnly: true});
  for (var prop in ds) {
    if (ds.hasOwnProperty(prop)) {
      dsLocal[prop] = ds[prop];
    }
  }
  return dsLocal;
};

// ---- Managed set of named purposed criteria-s
// TODO: Switch to AdvancedCriteria
isc.ClassFactory.defineClass("FilterSet", isc.Class); // TODO (?) - switch to simple JS object???
isc.FilterSet.addProperties({

  init: function () {
    this.criterias = new Array;
    return this.Super("init", arguments);
  },

  add: function (keyName, criteriaValue, sysFlag) {
    this.remove(keyName); // Disable double keys
    var item = {};
    item.filterName = keyName;
    item.filter = criteriaValue;
    item.sysFlag = (sysFlag ? sysFlag : false);
    this.criterias.add(item);
  },

  remove: function (keyName) {
    this.criterias.remove(this.criterias.find("filterName", keyName));
  },

  clear: function (keyName) {
    this.criterias.removeList(this.criterias.findAll("sysFlag", false));
  },

  // Prepare resulting criteria from set of criterias
  // TODO: Switch to AdvancedCriteria
  getCriteria: function () {
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


// =============================================================================
// ================== CBM Base Classes (isc's DataSources) =====================
// =============================================================================

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
      hidden: true
//inList: true
    }, 
    // {
      // name: "Concept",
      // type: "text",
      // canEdit: false,
      // hidden: true
    // },
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


// =============================================================================
// =================== The main CBM ISC-metadata base class ====================
//  inherited from isc RestDataSource class
// Special attribute <relationStructRole> values:
//  relationStructRole:"ID"; - Independent ID field
//  relationStructRole:"ChildID"; - Dependent 1:1 ID - taken from head part
//  relationStructRole:"MainID"; - Dependent pointer to ID of main part - historical or versioned
// For structured parts pointing - attribute <part>. Sample:
//  part:"vers";
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
  allowAdvancedCriteria : true,
  //~ nullStringValue: "",
  //~ nullIntegerValue: "", 
  //~ nullFloatValue: "", 
  //~ nullDateValue: new Date(),
  
  // ---- CBM - specific fields ----------------------
  concept: null,
  prgClass: null,
  relations: null,
  abstr: false,
  isHierarchy: false,
  rec: null,
  // run-time client-defined flag that linkes-kind relations DataSourses are actual
  hasResolvedLinks: false,

  // ---- Special functions (methods) definition -------

  // --- Return CBM Concept record for this isc DataSource ---
  getConcept: function () {
    // If this.concept is null - initialise it (once!)
    if (this.concept === null) {
      var con = viewRS.find({SysCode: this.ID}); //<<< Becouse "this" - is PrgView, not Concept indeed
      this.concept = conceptRS.find({ID: con.ForConcept});
    }
    return this.concept;
  },

  // --- Return CBM PrgClass aspects record for this isc DataSource ---
  getPrgClass: function () {
    // If this.prgClass is null - initialise it (once!)
    if (this.prgClass === null) {
      this.prgClass = classRS.find({ForConcept: this.getConcept().ID, Actual: true});
    }
    return this.prgClass;
  },

  // --- Return CBM-metadata Relation record for this isc DataSource field ---
  getRelation: function (fldName) {
    // If this.relations is null - initialise it (once!)
    if (this.relations === null) {
//      this.relations = relationRS.findAll({ForConcept: this.getConcept().ID});
     getRelationsForViewConcept(this.ID, null);
   }
    var rel = this.relations.find({SysCode: fldName});
    return (rel ? rel : {} );
  },


  // --- Return CBM-metadata Relation record for this isc DataSource field ---
  findRelation: function (criteria) {
    // If this.relations is null - initialise it (once!)
    if (this.relations === null) {
      getRelationsForViewConcept(this.ID, null);
    }
    var rel = this.relations.find(criteria);
    return (rel ? rel : {} );
  },


  // --- Additions to request
  transformRequest: function (dsRequest) {
	if (this.convertDataSourceCriteria && dsRequest.data) {
		// Remove clientData from previous function pass
		delete dsRequest.data["clientData"];

		if (Object.keys(dsRequest.data).length > 0) {
			if (dsRequest.operationType === "fetch" && dsRequest.data._constructor !== "AdvancedCriteria") {
				for(var pairKey in dsRequest.data) {
					if (typeof dsRequest.data[pairKey] === "string") {
						dsRequest.data[pairKey] = dsRequest.data[pairKey].replace("~|" + curr_Lang + "|", "");
					}
				}
				// For fetch  - allways convert criteria to isc.AdvancedCriteria form
				var criteria = this.convertDataSourceCriteria(dsRequest.data);
				dsRequest.data = {}
				dsRequest.data.criteria = criteria;  
			} else {
				// For some reason iSC call this method twice, so to skip the second pass - condition below
				if ( !dsRequest.data.data ) {
					// For data changes - repack send for storage data to data.data 
					var tmpData = {};
					for (var attr in dsRequest.data) {
						if (dsRequest.data.hasOwnProperty(attr)) {
							tmpData[attr] = dsRequest.data[attr];
						}
					}
					
					delete dsRequest.data;
					dsRequest.data = {};
					dsRequest.data.data = tmpData;
				}
        // Clean up OldValues from unnessesary fields (important!!!)
        //var persistentOldValues = dsRequest.oldValues.getPersistent();
        //dsRequest.oldValues = persistentOldValues;
        delete dsRequest.oldValues;
        
			}
		}  
    }
    
    if (typeof(curr_Img) != "undefined" && curr_Img != null) {
      curr_Img = (parseInt(curr_Img) + 1) + "";
      if (!dsRequest.data) {
        dsRequest.data = {};
	  }
      dsRequest.data.clientData = 
        { currUser: curr_Session,
          itemImg: curr_Img,
          currDate: curr_Date.toISOString(),
          currLocale: tmp_Lang,
          extraInfo: extra_Info
        };

      extra_Info = "";
    }
    return this.Super("transformRequest", arguments);
  },

  // transformResponse: function (dsResponse, dsRequest, data) {
    // var dsResponse = this.Super("transformResponse", arguments);
    // //... do something to dsResponse ...
    // return dsResponse;
  // },

  
  // --- Ensure existing DataSources for link attributes to one level in depth.
  // (DataSources if needed are generated in cycle asyncroniously, result callback maybe called earlier)
  resolveLinks: function (callback){
    that = this;
    getRelationsForViewConcept(this.ID,
        function (data) {
          if (!data || data == null) return;
          var dataCount = data.length;
          var i = -1;
          
          var recursiveResolveLinks = function (callback) {
            var goDeep = false;
            i += 1;
            if (i < dataCount) {
              
              var relation = data[i];
              
              if (relation.RelationKind === "Link" 
                  || relation.RelationKind === "BackAggregate"
                  || relation.RelationKind === "BackLink"
                  || relation.RelationKind === "CrossLink"
                  || relation.RelationKind === "Aggregate")
              {
                var conceptDS = isc.DataSource.get("Concept");
                var filter = {ID: relation.RelatedConcept };
                var conceptRecord = conceptDS.getCacheData().find(filter);
                var forView = conceptRecord.SysCode;
                
                if (forView !== that.ID) {
                  var ds = isc.DataSource.getDataSource(forView); 
                  if (!ds) {
                    goDeep = true;
                    generateDStext(forView, 
                        function (resultDS) {
                        try {
                          eval(resultDS);

                          if (i == dataCount - 1)
                          {
                            that.hasResolvedLinks = true;
                            if (callback){
                              callback(that);
                            }
                          } else {
                            recursiveResolveLinks(callback);
                          }
                        } catch (err) {
                          isc.warn("Error in dynamically generearated DS <" + forView + "> while links resolving. Error: " + err + " Full generated text: " + resultDS.substring(0, 100));
                        }
                    });
                  }
                }
              } 
              
              if(!goDeep) {
                if (i == dataCount - 1) {
                  that.hasResolvedLinks = true;
                  if (callback){
                    callback(that);
                  }
                } else {
                  recursiveResolveLinks(callback);
                }
              }
            }
          }
          
          recursiveResolveLinks(callback);
        }
    );
  },
  
  
  // --- NOT ACTUAL COMMENT!(?) >>> Function for callback usage only!!! No explicit call intended!!!
  setID: function (record) {
    record["ID"] = isc.IDProvider.getNextID();
    if (typeof(record.valuesEditor) != 'undefined' && record.valuesEditor != null) {
      record.valuesEditor.setValue("ID", record["ID"]);
    }
    // ---
    var atrNames = this.getFieldNames(false);
    var n = atrNames.length;
    for (var i = 0; i < n; i++) {
      // --- Links to Main parts from Version parts
      if (this.getField(atrNames[i]).relationStructRole == "MainID" && record[atrNames[i]] == null) {
        record[atrNames[i]] = record[this.getField(atrNames[i]).mainPartID];
        if (typeof(record.valuesEditor) != 'undefined' && record.valuesEditor != null) {
          record.valuesEditor.setValue(atrNames[i], record[atrNames[i]]);
        }
      }
      // --- Assignment for child tables for this "part" ID initialization
      else if (this.getField(atrNames[i]).relationStructRole == "ChildID" /*&& this.getField(atrNames[i]).part == that.getField(fieldName).part*/) {
        record[atrNames[i]] = record["ID"];
        if (typeof(record.valuesEditor) != 'undefined' && record.valuesEditor != null) {
          record.valuesEditor.setValue(atrNames[i], record["ID"]);
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
    var n = atrNames.length;
    for (var i = 0; i < n; i++) {
      record[atrNames[i]] = null;
    }
  },

  // --- Initialising of new record
  createInstance: function (contextGrid) {
    var cbmRecord = Object.create(CBMobject);
    this.constructNull(cbmRecord);
    this.setID(cbmRecord);
    cbmRecord.Concept = this.ID;
    cbmRecord.infoState = "new";
    if (cbmRecord.Del === null) {
      cbmRecord.Del = false;
    }
    return cbmRecord;
  },

  // --- Special setting all ID-like fields to <null> - used while cloning, and so on...
  setNullID: function (record) {
    var atrNames = this.getFieldNames(false);
    var n = atrNames.length;
    for (var i = 0; i < n; i++) {
      if (this.getField(atrNames[i]).relationStructRole === "ID" || this.getField(atrNames[i]).relationStructRole === "ChildID" || this.getField(atrNames[i]).relationStructRole === "MainID") {
        record[atrNames[i]] = null;
      }
    }
  },


  // ======================= Copying logic section =======================
  cloneMainInstance: function (srcRecord) {
    var thatDS = this;
    var record = Object.create(CBMobject);
    var atrNames = this.getFieldNames(false);
    var n = atrNames.length;
    for (var i = 0; i < n; i++) {
      var fldInMain = thatDS.getField(atrNames[i]);
      if (fldInMain["copyValue"] || fldInMain["copyValue"] === undefined) {
        record[atrNames[i]] = clone(srcRecord[atrNames[i]]);
      } 
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
    record.currentTransaction = srcRecord.currentTransaction;
    return record;
  },

  // -- Deeper structures copying --
  cloneRelatedInstances: function (srcRecord, record, cloneNextRecord, afterCopyCallbacks, outerCallback) {
    var thatDS = this;
    var atrNames = thatDS.getFieldNames(false);
    // Discover structural fields
    var fieldsToCopyCollection = [];
    var n = atrNames.length;
    for (var i = 0; i < n; i++) {
      var fld = thatDS.getField(atrNames[i]);
      if (fld.kind === "BackAggregate" || fld.kind === "BackLink") {
        if (fld.copyLinked === true) {
          fieldsToCopyCollection.push(fld);
        }
      } else if (fld.copyValue !== undefined && fld.copyValue === false) {
        // Clear not-copied fields
        record[fld] = null;
      }
    }
    // Deep collection copying (for fields having copyLinked flag true)
    if (fieldsToCopyCollection.length > 0) {
      var iFld = -1;
      var recursiveCopyCollection = function () {
        iFld += 1;
        if (iFld < fieldsToCopyCollection.length) {
          if (iFld == fieldsToCopyCollection.length - 1 && (thatDS.afterCopy || afterCopyCallbacks || outerCallback)) {
            if (!afterCopyCallbacks) {
              afterCopyCallbacks = [];
            }
            if (thatDS.afterCopy) {
              afterCopyCallbacks.push({func: thatDS.afterCopy, rec: record, outerCall: outerCallback});
            } else if (outerCallback) {
              afterCopyCallbacks.push({func: outerCallback, rec: [record], outerCall: null});
            }
            thatDS.copyCollection(fieldsToCopyCollection[iFld], srcRecord, record, recursiveCopyCollection, cloneNextRecord, afterCopyCallbacks);
          } else {
            thatDS.copyCollection(fieldsToCopyCollection[iFld], srcRecord, record, recursiveCopyCollection, cloneNextRecord);
          }
        }
      }
      recursiveCopyCollection(); // First call
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
      if (outerCallback !== undefined) {
        outerCallback([record]);
      }
    }
  },

  copyCollection: function (fld, srcRecord, record, recursiveCopyCollection, cloneNextRecordPrev, callbacks) {
    record[fld.name] = [];
    isc.DataSource.get(fld.relatedConcept).fetchData(
      parseJSON("{\"" + fld.backLinkRelation + "\" : \"" + srcRecord[fld.mainIDProperty] + "\", \"Del\": false }"),
      function (dsResponce, data, dsRequest) {
        if (data.length === 0) {
          if (cloneNextRecordPrev) {
            cloneNextRecordPrev();
          }
          if (recursiveCopyCollection) {
            recursiveCopyCollection();
          }
          if (callbacks !== undefined) {
            for (var i = callbacks.length - 1; i >= 0; i--) {
              setTimeout(callbacks[i].func(callbacks[i].rec, callbacks[i].outerCall), 0);
            }
            callbacks.popAll();
          }
        } else {
          var z = -1;
//          var dsRelated = this; // Closures-based variant
          function cloneNextRecord() {
            var recNew = null;
            z += 1;
            if (z < data.length) {
              var rec = data[z];
              var dsRelated = isc.DataSource.getDataSource(fld.relatedConcept); // Instead of closures - define very time here
              if (z < data.length - 1) {
                recNew = dsRelated.cloneMainInstance(rec, cloneNextRecord);
                recNew[fld.backLinkRelation] = record["ID"];
                function cloneRecordRelatedInstances() {
                  dsRelated.cloneRelatedInstances(rec, recNew, cloneNextRecord);
                }

                addDataToCache(recNew);
                TransactionManager.add(recNew, recNew.currentTransaction);
                cloneRecordRelatedInstances();
              } else {  // The last record - callbacks and post-actions provided
                recNew = dsRelated.cloneMainInstance(rec);
                recNew[fld.backLinkRelation] = record["ID"];
                function cloneLastRecordRelatedInstances() {
                  dsRelated.cloneRelatedInstances(rec, recNew, cloneNextRecord, callbacks); // The last row only - processed with callbacks
                  if (recursiveCopyCollection) {
                    recursiveCopyCollection();
                  }
                  if (cloneNextRecordPrev) {
                    cloneNextRecordPrev();
                  }
                }

                addDataToCache(recNew);
                TransactionManager.add(recNew, recNew.currentTransaction);
                cloneLastRecordRelatedInstances();
              }
            }
          };
          cloneNextRecord(); // First call - start recursion
        }
      }
    );
  },

  cloneInstance: function (srcRecord, outerCallback) {
    var newRecord = this.cloneMainInstance(srcRecord);
    // Adding record to cache makes it visible in all bounded widgets.
    // So, if it's not desirable - source (!) record can be marked notShow=true.
    if (!srcRecord.notShow) {
      addDataToCache(newRecord);
      TransactionManager.add(newRecord, newRecord.currentTransaction);
    }
    this.cloneRelatedInstances(srcRecord, newRecord, undefined, undefined, outerCallback);
    return newRecord;
  },


  // ======================= Interceptor Functions group =======================
  beforeCopy: function (srcRecord, callbacks) {
    var record = this.copyRecord(srcRecord);
    // Special actions here
    return record;
  },

  onNew: function (record, context) {
  },

  onFetch: function (record) {
  },
  
  // onSave while CBMObject saved (no matter of content, but 
  onSave: function (record, form, context) {
  },
  
  // onSave for special case - while object is saved from UI edit session 
  onFormSave: function (record, form, context) {
  },

  onDelete: function (record) {
  },
  
  beforeEdit(record, context) {
  },

  // --- Determine deletion mode - real deletion, or using "Del" property deletion throw trash bin.
  isDeleteToBin: function () {
    if (this.fields["Del"]) {
      return true;
    }
    return false;
  },


  // ======= Some peace of presentation logic (even in DS): =================
  // ===== - default editing form. Can be overriden in child DS classes =====

  // Some notes:
  // - FormWindow.contextObject -> record - So, form.contextObject is that _edited record_.
  // - record.valuesEditor -> valuesManager - So, record.valuesEditor is fiorm's valuesManager, where changed values ca be retrieved.

  // --- Prepare interior layout based on DS meta-data:
  prepareFormLayout: function (valuesManager, record, context) {
    var tabSet = isc.TabSet.create({
      tabBarPosition: "top",
      width: "99%",
      height: "99%",
      //           width: "95%", height: "95%", <- Adequate smaller height, not affected width
      //           width : "*", height : "*", <- Small adjusted to content height, not affected width
      //      autoSize : true, <- No affect
      backgroundColor: "#DBF5E9", //"#DDFFEE",// "#D9F9E9",//
      bodyColor: "#D9F7E9", //"#D9F9E9",
      overflow: "visible",
      paneContainerOverflow: "visible"
    });

    var atrNames = this.getFieldNames(false);
    var mainUIPath = this.mainTabName ? this.mainTabName : isc.CBMStrings.FormWindow_MainTab;
    var UIPaths = [mainUIPath];
    var forms = [];
    var items = [[]];
    var n = atrNames.length;
    for (var i = 0; i < n; i++) {
      if (typeof(this.getField(atrNames[i]).hidden) == "undefined" || this.getField(atrNames[i]).hidden !== true
          || this.getField(atrNames[i]).inList ) {
//         this.getField(atrNames[i]).hidden = false; <<< prevent fields of hidden columns lost
        var that = this;
        
        // this.createField = function(){
        var currRoot = mainUIPath;
        if (!that.getField(atrNames[i])) {
          currRoot = mainUIPath;
        } else {
          currRoot = that.getField(atrNames[i]).UIPath;
          if(!currRoot || typeof(currRoot) === "undefined" || currRoot === null || typeof(currRoot) === "null") {
            currRoot = mainUIPath;
          }
        }
        
        var notFound = true;
        var j = 0;
        for (; j < UIPaths.length; j++) {
          if (UIPaths[j] === currRoot) {
            notFound = false;
            var nItem = items[[j]].length;
            var fld = this.getField(atrNames[i]);
            if (this.getField(atrNames[i]).kind != "Command") {
              items[j][nItem] = isc.FormItem.create({name:atrNames[i], width:"100%", hidden: null, showIf: null});
              if (fld.relatedConcept) {
                items[j][nItem].relatedConcept = fld.relatedConcept;
              } else {
                items[j][nItem].relatedConcept = fld.type;
              }
            } else {
              // Button linked to DS field seems to be disabled, we create it more "by hand"
              items[j][nItem] = isc.FormItem.create({type:'button', name:atrNames[i], title:fld.title, showTitle:false, click: fld.click, startRow:false, endRow:false, autoFit:true});
            }
            // Defaults setting
            if (this.getField(atrNames[i]).defaultValue) {
            try{
              items[j][nItem].defaultValue = eval(this.getField(atrNames[i]).defaultValue);
            } catch (e) {
              if (e instanceof SyntaxError || e instanceof ReferenceError) {
                // Simply ignore
              } else {
                throw(e);
              }
            }
            }
            break;
          }
        }
        if (notFound) {
          UIPaths[j] = currRoot;
          items[j] = [];
          var fld = this.getField(atrNames[i]);
          if (this.getField(atrNames[i]).kind != "Command") {
            items[j][0] = isc.FormItem.create({name:atrNames[i], width:"100%", hidden: null, showIf: null});
            if (fld.relatedConcept) {
              items[j][0].relatedConcept = fld.relatedConcept;
            } else {
              items[j][0].relatedConcept = fld.type;
            }
          } else {
            // Button linked to DS field seems to be disabled, we create it more "by hand"
            var fld = this.getField(atrNames[i]);
            items[j][0] = isc.FormItem.create({type:'button', name:atrNames[i], title:fld.title, showTitle:false, click: fld.click, startRow:false, endRow:false, autoFit:true});
          }
          // Defaults setting
          if (this.getField(atrNames[i]).defaultValue) {
            try{
              items[j][0].defaultValue = eval(this.getField(atrNames[i]).defaultValue);
            } catch (e) {
              if (e instanceof SyntaxError || e instanceof ReferenceError) {
                // Simply ignore
              } else {
                throw(e);
              }
            }
          }
        }
        
        // if (this.getField(atrNames[i]).kind === "Link" 
            // || this.getField(atrNames[i]).kind === "BackLink"
            // || this.getField(atrNames[i]).kind === "BackAggregate")
        // {
          // var relatedConcept = this.getField(atrNames[i]).relatedConcept;
          // if(!relatedConcept){
            // relatedConcept = this.getField(atrNames[i]).type;
          // }
          // testCreateDS(relatedConcept, 
                  // this.createField.bind(this));
        // } else {
          // this.createField();
        // }
      }
    }

    valuesManager.showHiddenFields = true;
    
    var hiWidth = 600;
    var hiHeight = 100;
    for (var i = 0; i < UIPaths.length; i++) {
      forms[i] = isc.InnerForm.create({
        valuesManager: valuesManager,
        dataSource: this,
        items: items[i],
        showHiddenFields: true
      });
      // Adjust Form's size
      var height = 100;
      height = items[i].getLength() * 16 - (items[i].getLength() * items[i].getLength()) / 16;
      if (height > hiHeight) {
        hiHeight = height;
      }

      if (UIPaths.length > 1) {
        tabSet.addTab({
          title: UIPaths[i],
          pane: forms[i]
          //          height: "*", width: "*" <- No affect but titles empty!
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
        click: function () {
          this.topElement.savePosition();
          // Save atribute-collections (if any)
          this.topElement.saveInnerGridsSettings();
          
          // Store changed value to caller's context object (if any)
          var currentId = this.topElement.valuesManager.values.ID;
          var currentValue = this.topElement.valuesManager.values.Description;

          this.topElement.save();

          if (context && context.setValue) {
            context.setValue(currentId);
            context.mapValueToDisplay(currentValue);
            context.redraw();
	      }

          return false;
        },
        width: 99,
        height: 25,
        extraSpace: 10
      }, {
        name: "cancelbtn",
        editorType: "button",
        title: isc.CBMStrings.EditForm_Cancel, //"Cancel",
        click: function () {
          this.topElement.savePosition();
          
          if (this.topElement.contextObject !== null // <<< Can be null if window opend for multi-records editing
              && this.topElement.contextObject.currentTransaction !== null
              && this.topElement.contextObject.currentTransaction.Changes.length > 0) 
          {
            var that = this;
            isc.confirm(isc.CBMStrings.CancelButton_SaveOrNot,
 /*             function (ok) {
                if (ok) {
                  // If top-level Cancel pressed, but inner savings exists - save them
                  if (!context.dependent) {
                    that.topElement.save(true); // true means top-level flag
                  } else {
                    that.topElement.destroy();
                  }
                } else {
                  // TODO: Clean TransactionManager (if top-level answer???)
                  if (!context.dependent) {
                    TransactionManager.clear(record.currentTransaction);
                    delete record.currentTransaction;
                  }
                  that.topElement.discard();
                }
                return false;
              },*/
              null, // <<< Callback - not used
              {buttons: [//isc.Dialog.OK,
                          { title:"Сохранить", 
                            click: function() {
                                     // If top-level Cancel pressed, but inner savings exists - save them
                                    if (!context.dependent) {
                                      that.topElement.save(true); // true means top-level flag
                                    } else {
                                      that.topElement.destroy();
                                    }
                                    this.topElement.close();
                                    return false;
                                  } 
                          },
                          isc.LayoutSpacer.create({width:50}),  
                          { title:"НЕ сохранять", 
                            click: function() {
                                    // TODO: Clean TransactionManager (if top-level answer???)
                                    if (!context.dependent) {
                                      // TODO - put all changes to this transaction - Don't use "Default" one!!!
                                      TransactionManager.clear(record.currentTransaction);
                                      delete record.currentTransaction;
                                    }
                                    that.topElement.discard();
                                    this.topElement.close();
                                    return false;
                                  }                                    
                          }
                        ]
              }
            );
          } else {
            this.topElement.destroy();
            return false;
          }
        },
        width: 99,
        height: 25,
        extraSpace: 10
      }]
    });

    var formLayout = isc.HLayout.create({
      autoDraw: false,
      //            defaultWidth:"100%", defaultHeight:"100%",
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
  edit: function (record, context) {
        
    // Function-intrceptor for any specific for DS actions before 
    this.beforeEdit(record, context);
    
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
      content: this.prepareFormLayout(valuesManager, record, context),
      contextObject: record, // So, form.contextObject is that _edited record_, and

      save: function (topCancel) {
        if (this.valuesManager.validate(true)) {
          var that = this;
         
          isc.DataSource.get(this.dataSource).onFormSave(this.valuesManager.getValues(), this, context);
          
          // Construct CBMobject to gather edited values back from ValuesManager before save
          var values = this.valuesManager.getValues();
          var oldValues = this.valuesManager.getOldValues();
          var changesExists = false;
          var record = Object.create(CBMobject);
          // Mandatory assign ID, infoState, Concept and Del property 
          // (that usually not changes, and even can be not in DS fields)
          record.ID = values.ID;
          record.infoState = values.infoState;
          if (values.Concept) {
            record.Concept = values.Concept;
          } else {
            record.Concept = this.dataSource;
          }
          //record.Del = values.Del;
          
          for (var attr in values) {
            var field = this.getDataSource().getFields()[attr];
            if (field) {
              if (values.hasOwnProperty(attr)) {
                // Get only changed values for save (NOT for "new" record!)
                if (record.infoState !== "loaded"
                    // Changed detection
                    || (values[attr] && !oldValues[attr])
                    || (!values[attr] && oldValues[attr])
                    || (values[attr] !== undefined
                      && ( (values[attr] === null && oldValues[attr] !== null)
                        || (values[attr] !== null && oldValues[attr] === null)
                        // Compare with respect of Date type
                        || (!(values[attr] instanceof Date) && values[attr] !== oldValues[attr])
                        // For Date - special checks
                        || ((values[attr] instanceof Date) && values[attr].getTime() !== oldValues[attr].getTime())))) {
                  record[attr] = values[attr];
                  changesExists = true;
                }
              }
              // Initialize Save() for non-standard controls
              // TODO !!! Universalize control type below !!! (if possible???)
              if (field.editorType === "WeekWorkControl") {
                var item = this.valuesManager.getItem(attr);
                if (item) {
                  item.saveCollection();
                }
              }
            }
          }

          if (record.infoState === "loaded") {
            if (changesExists) {
              record.infoState = "changed";
              record.fullRecord = values; // For update cache with full set of fields
            }
            else {
              // No changes made to existing record - simply commit upper transaction (for inner savings) and exit edit session
              if (!context.dependent && !topCancel) {
                TransactionManager.commit(record.currentTransaction);
                delete record.currentTransaction;
              }
              that.destroyLater(that, 200);
              return;
            }
          }

          if (context.dependent) {
            record.store();
// TODO Move to CBMObject save (later)           isc.DataSource.get(this.dataSource).onSave(record, this, context);
            TransactionManager.add(record, record.currentTransaction);
            that.destroyLater(that, 200);
          } else {
            if (!topCancel) {
              // Independent record must be the first in transaction(see true param) 
// TODO Move to CBMObject save (later)              isc.DataSource.get(this.dataSource).onSave(record, this, context);
              TransactionManager.add(record, record.currentTransaction, true);
               
 ////// Was ucommented for edited Relatoins refresh   record.store();
              // if(context.parentElement.parentElement.canvasItem
                 // && context.parentElement.parentElement.canvasItem.needRefresh) {
                //if(context.parentElement.parentElement.canvasItem.innerGrid) {
                  //updateDataInCache(record.fullRecord); 
                //} 
                // context.parentElement.parentElement.canvasItem.showValue("", null, 
                // context.parentElement.parentElement.parentElement, 
                // context.parentElement.parentElement.canvasItem);
            }
            TransactionManager.commit(record.currentTransaction);
            delete record.currentTransaction;
            that.destroyLater(that, 200);
          }
                          
          if(context
             && context.parentElement
             && context.parentElement.parentElement
             && context.parentElement.parentElement.canvasItem
             && context.parentElement.parentElement.canvasItem.needRefresh) {

            if(context.parentElement.parentElement.canvasItem.innerGrid) {
              updateDataInCache(record.fullRecord); 
            } 
            context.parentElement.parentElement.canvasItem.showValue("", null, 
            context.parentElement.parentElement.parentElement, 
            context.parentElement.parentElement.canvasItem);
          }

          return false;
        }
        else {
          isc.warn(isc.CBMStrings.EditForm_ValidationNotPassed);
        }
      },

      discard: function () {
        if (context.dependent) {
          // Not top-level context - clear changes below
          TransactionManager.clear(record.currentTransaction);
        } else {
          // Top-level context - drop transaction in whole
          TransactionManager.close(record.currentTransaction);
        }
        this.destroyLater(this, 200);
      }

    }); // end isc.FormWindow.create

    form.context = context;

    record.valuesEditor = valuesManager;
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
    }
    
    if (this.contextObject && this.contextObject.Description) {
      form.title = form.title + " <" + this.contextObject.Description + "> - (" + stateTitle + ")";
    } else {
      form.title = form.title + " - (" + stateTitle + ")";
    }


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
    record.valuesEditor = valuesManager;

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
              // TODO mark record to add to transaction
            }
          }
          // ??? TODO add to transaction - Does this matter for multi-editing???
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


// ==========================================================================
// ===================== CBM base object prototype ==========================
// ==========================================================================
// --- Provide domain-independent abilities of objects to "leave" in Information System,
//     keeping in mind that we work with information about things ---
var CBMobject = {
//  currentTransaction: null,
//  isMainTransaction: true,
//  ds: null,
//  hostObject: null,


  // ----------------- Link this object (record) with some transaction -------------------------
  store: function (trans) {
    //TODO: Transactions seemed to be processed not on by-record basis
    // if (trans) {
    // this.curentTransaction = trans;
    // }
    // if (!this.curentTransaction) {
    // this.curentTransaction = TransactionManager.getTransaction()
    // }
//    TransactionManager.add(this, this.curentTransaction)

    this.save(false);
  },

  // ----------------- Complete record save to persistent storage -------------------------
  save: function (real, context, contextField, callback) {
    var that = this;
    if (!this.ds) {
      this.ds = isc.DataSource.get(this.Concept);
    }
    // Save main object
    if (this.infoState === "new" || this.infoState === "copy") {
      // If Data Source contains unsaved data of <this> object 
      //   - remove it, and then add with normal save
      if (this.ds.getCacheData() && this.ds.getCacheData().find({ID: this.ID})) {
        removeDataFromCache(this);
      }
      // - If context defined - set new record to context's collection
      // TODO set not in every case! (child concepts Relation generated for instance).
      if (context && !this.notShow) {
        context[contextField].push(this);
      }

      if (real) {
        this.ds.addData(this.getPersistentChanged(),
                  function(){
                    if (that.ds.getCacheData() && !that.ds.getCacheData().find({ID:that.ID})) {
                      addDataToCache(that); 
                    }
                  }
                );
        this.infoState = "loaded";  
        addDataToCache(this); // <<< uncommented - was good for relations refresh
      } else {
        addDataToCache(this);
      }
    } else if (this.infoState === "changed") {
      if (real) {
        var that = this;
        this.ds.updateData(this.getPersistentChanged(), 
                    function(){ 
                      //Quick update
                      updateDataInCache(that.fullRecord); 
                      //Second update after iSC rewrites cache with only changed fields
                      setTimeout(updateDataInCache(that.fullRecord), 300); 
                    } 
                );
      } else {
        updateDataInCache(this.fullRecord);
      }
    } else if (this.infoState === "deleted") {
      if (real) {
        this.ds.removeData(this);
        removeDataFromCache(this); // <<< More likely redundant. Remove after tests...
      } else {
        removeDataFromCache(this);
      }
    }
    
    if (callback) {
      callback();
    }
  },

  
  // Defaults setting
  setDefaults: function(){
    if (!this.ds) {
      this.ds = isc.DataSource.get(this.Concept);
    }
    var flds = this.ds.getFields(false);
    for (var fld  in flds) {
      if (flds.hasOwnProperty(fld)) {
        if (flds[fld].defaultValue) {
          try{
            this[fld] = eval(flds[fld].defaultValue);
          } catch (e) {
            if (e instanceof SyntaxError || e instanceof ReferenceError) {
            // Simply ignore
            } else {
              throw(e);
            }
          }
        }
      }
    }
  },
  

  // -------- Retrieve record for link/aggregate field from DS ----------
  // and store  it in additional <fld_name + "_val"> field
  loadLink: function (fld, callback) {
    var dsRelated = isc.DataSource.getDataSource(fld.relatedConcept);
    dsRelated.fetchData({ID: this[fld.name]},
      function (dsResponse, data, dsRequest) {
        if (data.getLength() == 1) {
          // Reload data from primitive record to more functional CBMobject
          var record = Object.create(CBMobject);
          var atrNames = dsRelated.getFieldNames(false);
          var n = atrNames.length;
          for (var i = 0; i < n; i++) {
            record[atrNames[i]] = data[0][atrNames[i]];
          }
          // Separately assign Concept property (that can be not in DS fields)
          if (data[0].Concept) {
            record.Concept = data[0].Concept;
          } else {
            record.Concept = this.ID;
          }

          this[fld.name] = record;
          if (callback) {
            callback(fld);
          }
        }
      }
    );
  },

  // -------- Retrieve collection of back-linked records for one-to-many association field from DS ----------
  // and store  that collection in additional <fld_name + "_val"> field
  loadCollection: function (fld, callback) {
    var dsRelated = isc.DataSource.getDataSource(fld.relatedConcept);
    var that = this;
    dsRelated.fetchData(
      parseJSON("{\"" + fld.backLinkRelation + "\" : \"" + this[fld.mainIDProperty] + "\"}"),
      function (dsResponse, data, dsRequest) {
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
        if (callback) {
          callback(fld);
        }
      }
    );
  },

  // -------- Compete record retrieval from DS (/persistent storage) and construction ----------
  /*  loadRecord: function(ID, callback){
   if (!this.ds) {
   this.ds = isc.DataSource.get(this.Concept);
   }
   var atrNames = this.ds.getFieldNames(false);
   ////// TODO Recursive in callback fields initialisation
   for (var i = 0; i < atrNames.length; i++) {
   var fld = this.ds.getField(atrNames[i]);
   if (this.ds.getRelation(fld).RelationKind === "BackAggregate" || this.ds.getRelation(fld).RelationKind === "Aggregate" ) {
   loadLink(fld, callback);
   } else if (fld.editorType == "CollectionAggregateControl"){
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
  // TODO: Will be better to drop this and use only getPersistentChanged() below
  getPersistent: function () {
    if (!this.ds) {
      this.ds = isc.DataSource.get(this.Concept);
    }
    // Get CBM metadata descriptions (we need it to discover really persistent fields)
    var rec = {}; // Object.create();
    var atrNames = this.ds.getFieldNames(false);
    var n = atrNames.length;
    for (var i = 0; i < n; i++) {
      var rel = this.ds.getRelation(atrNames[i]);
      var fld = this.ds.getFields()[atrNames[i]];
      // Copy to returned "rec" only persistent fields
      if (rel && ((rel.DBColumn && rel.DBColumn !== null && rel.DBTable && rel.DBTable !== null)
         /* TODO >>> What for ??? || rel.RelationKind === "Value" || rel.RelationKind === "Link"*/)
          // AND - field is explicitly marked as not-persistent
          && fld && !fld.ignore) {
        rec[atrNames[i]] = this[atrNames[i]];
      }
    }
    return rec;
  },


  // -------- Returns object that has only persistent fields ---------
  getPersistentChanged: function () {
    if (!this.ds) {
      this.ds = isc.datasource.get(this.concept);
    }
    // get cbm metadata descriptions (we need it to discover really persistent fields)
    var rec = {};
    
    for (var existingFld in this) {
      var rel = this.ds.getRelation(existingFld);
      var fld = this.ds.getFields()[existingFld];
      // copy to returned "rec" only persistent fields
      if (rel && ((rel.DBColumn && rel.DBColumn !== null && rel.DBTable && rel.DBTable !== null))
          // and - field is not explicitly marked as not-persistent
          && fld && !fld.ignore) {
        rec[existingFld] = this[existingFld];
      }
    }
    return rec;
  },

  
  //----------- Provides collection of Relation -----------------
  getRelatonsMeta: function () {

  },

  
  // ----------- Discard changes to record (or whole record if New/Copied ----------------
  discardChanges: function (record) {
  },
 
 
  // ----------- Test if mainObject is new, and if so 
  //      - save it after user's confirmation, or not  -----------
  testMainRecordSaved :function(additionalMsg, contextValuesManager, callback, args) {
    var that = this;
    if (this.infoState === "new") {
      isc.confirm(isc.CBMStrings.Object_MainRecordNotSaved + (additionalMsg ? additionalMsg : ""),
        function (ok) {
            if (ok) {
              that.save(true, null, null, 
                      function() {
                        if (callback){
                          callback(args);
                        }
                      }
                  );
              if (contextValuesManager) {
                contextValuesManager.setValue("infoState", "loaded");
              }
            }
        }
      );
      return true; 
    }
    return false; // Means only that main recorb was not new
  }

}; // ---^^^---------- END CBMobject ----------------^^^---



// -------- CBMobject - related functions and classes -------
// --------- Transform simple JS object to CBMobject --------
function createFromRecord(srcRecord) {
  if (srcRecord.Concept) {
    var resultObj = Object.create(CBMobject);
    var atrNames = isc.DataSource.get(srcRecord.Concept).getFieldNames(false);
    var n = atrNames.length;
    for (var i = 0; i < n; i++) {
      resultObj[atrNames[i]] = clone(srcRecord[atrNames[i]]);
    }
    return resultObj;
  } else {
    return null;
  }
};


// function getDS(record){
////var cls = conceptRS.findByKey(record.Concept);
////var cls = conceptRS.find("SysCode", record.Concept);
// return isc.DataSource.get(record.Concept);
// }


// --- Universal function that provide UI presentation of any Record in any Context (or without any)
// --- (Record must have Concept property, and be a CBMobject-based)
function editRecords(records, context, conceptRecord, trans) {
  // --- Find DataSource for record (or if not defined - from context)
  var ds = null;
  var recordFull = null;

  if (records.length === 0) {
    return;
  }

  // --- Open new transaction if edited record has no one, otherwise use supplied one
  if (records[0].currentTransaction === undefined || records[0].currentTransaction === null) {
    if (!trans) {
      if (context && context.topElement && context.topElement.contextObject
        && context.topElement.contextObject.currentTransaction) {
        trans = context.topElement.contextObject.currentTransaction;
      }
    }
    if (trans) {
      records[0].currentTransaction = trans;
    } else {
      records[0].currentTransaction = TransactionManager.createTransaction();
    }
  }

  var cls; // Concept record
  if (conceptRecord) {
    cls = conceptRecord;
  } else {
    cls = conceptRS.find("SysCode", records[0].Concept);//cls = conceptRS.findByKey(records[0]["Concept"]);
  }
  // First if works if cls undefined only
  if (typeof(context) != "undefined" && context !== null &&
    (typeof(cls) == "undefined" || cls === null || cls === "loading" || records.getLength() > 1) || !cls.SysCode) 
  { // DS by Context
    ds = context.getDataSource();
    records[0].ds = ds;
    if (records.getLength() === 1) {
      ds.edit(records[0], context);
    } else {
      ds.editMulti(records, context);
    }
  } else if (records.getLength() === 1) { // DS by exact record Class
    ds = isc.DataSource.getDataSource(cls.SysCode);
    records[0].ds = ds;
    // --- Load concrete class instance data, if record's class not equal (is subclass) of context class (DataSource)
    if (context.dataSource != cls["SysCode"] && records[0]["infoState"] == "loaded") {
      var currentRecordRS = isc.ResultSet.create({
        dataSource: cls["SysCode"],
        criteria: {
          ID: records[0]["ID"]
        },
        dataArrived: function (startRow, endRow) {
          recordFull = currentRecordRS.findByKey(records[0]["ID"]);
          recordFull["infoState"] = "loaded";
          if (typeof(recordFull["Del"]) != "undefined") {
            recordFull["Del"] = false;
          }
          recordFull.currentTransaction = records[0].currentTransaction;
//          recordFull.isMainTransaction = records[0].isMainTransaction;
          ds.edit(recordFull, context);
//          currentRecordRS.dataArrived = undefined;
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
// resultClass  - function that provide destination object class. In most cases simply returns name of class.
//          But can also define it different as function of some parameters for each source record.
// initFunc   - is a function, that provide target-from-source fields initialisation.
// context    - intended to be some ListGrid successor, that represent results.
function createFrom(srcRecords, resultClass, initFunc, context) {
  if (srcRecords === null) {
    isc.warn(isc.CBMStrings.ListCreateFrom_NoSelectionDone, this.innerCloseNoChoiceDlg);
    return;
  }

  initDestRecord = function (record) {
    var mainObjID = null;
    var mainConcept = null;
    if (context.topElement.valuesManager) {
      mainObjID = context.topElement.valuesManager.getValue("ID");
      mainConcept = context.topElement.dataSource;
      // Try to initialize main object link by naming agreements:
      // (Attribute name == <linked concept name>, or "For" + <linked concept name>)
      if (record[mainConcept] === null) {
        record[mainConcept] = mainObjID;
      } else if (record["For" + mainConcept] === null) {
        record["For" + mainConcept] = mainObjID;
      }
    }
    // Call additional specific initializations (if any)
    // (Note that mainObjID and mainConcept are still supplied - for any...)
    if (initFunc) {
      if (mainConcept) {
        // mainObjID and mainConcept exists, Sync record to context placement
        initFunc(record, srcRecords[iteration], mainObjID, mainConcept);
        if (context) {
          //////BETTER record.store();
          //////BETTER context.data.add(record);
            record =  record.getPersistent();       // <<< To change to BETTER 
            setTimeout(context.addData(record), 0); // <<< To change to BETTER
        }
      } else {
        // No mainObjID and mainConcept exists, Async to context placement
        initFunc(record, srcRecords[iteration],
        function(record){
          if (context) {
            record =  record.getPersistent();
            setTimeout(context.addData(record), 0);
          }
        });
      }
    }
    iteration++;
    if (iteration < srcRecords.getLength()) {
      newRecord();
    } else {
/////BETTER      context.dataChanged();
    }
  };
//TODO: provide transaction context for createInstance() calls
  newRecord = function () {
    if (resultClass) {
      var newRec = isc.DataSource.getDataSource(resultClass(srcRecords[iteration])).createInstance();
    } else if (context) {
      var newRec = context.getDataSource().createInstance();
    } else {
      isc.Warn(isc.CBMStrings.ListCreateFrom_UndefinedClass);
    }
    newRec.setDefaults();
    initDestRecord(newRec)
  };

  var iteration = 0;
  this.newRecord();
};


// --- Universal function that provide deletion of Record ---
// --- Deletion processed to trash bin, or physically, depending on "Del" flag existence, and additional mode
function deleteRecord(record, delMode, contextGrid, mainToBin) {
  // --- Internal functions ---
  var deleteCollection = function (fld, record, delMode, mainToBin) {
    var collectionRS = isc.ResultSet.create({
      dataSource: fld.relatedConcept,
      fetchMode: "paged",
      criteria: parseJSON("{\"" + fld.backLinkRelation + "\" : \"" + record[fld.mainIDProperty] + "\"}"),
      dataArrived: function (startRow, endRow) {
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

  var deleteLinkedRecord = function (fld, record, delMode, mainToBin) {
    var dsInner = isc.DataSource.get(fld.relatedConcept);
    if (!dsInner) {
      isc.warn(isc.CBMStrings.NoDataSourceDefined + isc.CBMStrings.MD_ForViewField + fld.name + " (in function deleteLinkedRecord(). It's most likely You set flag CopyLinked for Attribute with no need.)");
      return;
    }
    dsInner.fetchRecord(record[fld], function (dsResponse, data, dsRequest) {
      deleteRecord(data, delMode, mainToBin);
    });
  }

  // Process linked (aggregated) dependent records
  var ds = isc.DataSource.get(record.Concept);
  if (!ds) {
    isc.warn(isc.CBMStrings.NoDataSourceDefined + " (in function deleteRecord(). )");
    return;
  }
  var atrNames = ds.getFieldNames(false);
  // Process composite aggregated records
  for (var i = 0; i < atrNames.length; i++) {
    var fld = ds.getField(atrNames[i]);
    // TODO: Replace DS editor type to MD association type, or MD but from DS (where it will exist)?
    if ((fld.editorType == "CollectionControl" || fld.editorType == "CollectionAggregateControl") && fld.deleteLinked == true) {
      deleteCollection(fld, record, delMode, ds.isDeleteToBin());
    } else if ((fld.editorType == "LinkControl" || fld.editorType == "combobox") && fld.deleteLinked == true) {
      deleteLinkedRecord(fld, record, delMode, ds.isDeleteToBin());
    }
  }
  // Process main record
  if (delMode == "deleteForce") {
    ds.removeData(record);
  } else { // delMode != "deleteForce" - process depending on "Del" flag existence
    if (record.Del != undefined) { // "Del" flag exists
      if (delMode == "delete") {
        record.Del = true;
      } else { // delMode == "restore" remains
        record.Del = false;
      }
      ds.updateData(record);
    }
    // Conditions below - to protect from physical deletion "Del-less" aggregated records
    else if (mainToBin == undefined || !mainToBin) { // // No "Del" flag exists
      ds.removeData(record);
    }
  }
};
// --- DRAFT VARIANT 
// (Semaphore prepared while processing cycle - so first async results MUST returnes after ALL async calls are made - not erlier)
// TODO: Refactor significantly, so this implementation is too chaotic, no matter that it works.
/*
function deleteRecord(record, delMode, contextGrid, mainToBin,  checkAttrProcessedComesInArgs, lastMain, attributesProcessed) {
  var ds = isc.DataSource.get(record.Concept);
  if (!ds) {
    isc.warn(isc.CBMStrings.NoDataSourceDefined + " (in function deleteRecord(). )");
    return;
  }
  var useBin = ds.isDeleteToBin();
  
  if (!record.currentTransaction && delMode !== "deleteForce") {
    record.currentTransaction = TransactionManager.createTransaction();
  }
 
  // --- Internal functions ---
   
  // Real deletion of record
  var deleteMainRecord = function(deletedRecord){
    var ds = isc.DataSource.get(record.Concept);
    if (delMode === "deleteForce") {
      ds.removeData(deletedRecord);
      removeDataFromCache(deletedRecord);
    } else { // delMode !== "deleteForce" - process depending on "Del" flag existence
      if (deletedRecord.Del !== undefined) { // "Del" flag exists
        deletedRecord.infoState = "changed";
        if (delMode === "delete") {
          deletedRecord.Del = true;
          updateDataInCache(deletedRecord);
        } else { // delMode === "restore"
          deletedRecord.Del = false;
          removeDataFromCache(deletedRecord); // <<< To prevent dubles
          addDataToCache(deletedRecord);
        }
        TransactionManager.add(deletedRecord);
      }
      // Conditions below - to protect from physical deletion of "Del-less" dependent records
      else if (mainToBin === undefined || !mainToBin) {
        deletedRecord.infoState = "deleted";
        TransactionManager.add(deletedRecord);
        removeDataFromCache(deletedRecord);
      }
    }
  }
  
  // Semaphore for complicated attributes in parallel processing before main record
  if (!attributesProcessed) {
    var attributesProcessed = 0;
  }
  
  var checkAttrProcessed = function() {
    attributesProcessed--;
    if (attributesProcessed <= 0) {
      deleteMainRecord(record);
    }
  }

  var deleteCollection = function (fld, mainRecord, delMode, mainToBin, last) {
    var collectionRS = isc.ResultSet.create({
      dataSource: fld.relatedConcept,
      fetchMode: "paged",
      criteria: parseJSON("{\"" + fld.backLinkRelation + "\" : \"" + mainRecord[fld.mainIDProperty] + "\"}"),
      dataArrived: function (startRow, endRow) {
        //No records returned, and attribute processed is the last, 
        //and no deeper calls on previous attrsibutes - execute main deletion
        if (last && startRow === endRow && attributesProcessed === 0) {
          deleteMainRecord(mainRecord);
        }
        for (var i = startRow; i < endRow; i++) {
          var rec = this.get(startRow);  // <<< Delete aways the first record - to workaround cache sync problem
          // For jast created (and already deleted) records - Concept may be not initialized
          if (!rec.Concept) {
            rec.Concept = this.dataSource.ID;
          }
          if (delMode !== "deleteForce" && mainRecord.currentTransaction) {
            rec.currentTransaction = mainRecord.currentTransaction;
          }
          attributesProcessed++;
          var lastlast = last && (i >= (endRow - 1))
          attributesProcessed = deleteRecord(rec, delMode, contextGrid, mainToBin,  checkAttrProcessed, lastlast, attributesProcessed); // <<< Main action!
        }
        collectionRS.dataArrived = undefined;
      }
    });
    collectionRS.getRange(0, 100000); // Some compromise - allow no more than 100 000 aggregated records 
  }

  var deleteLinkedRecord = function (fld, mainRecord, delMode, mainToBin, last) {
    var dsInner = isc.DataSource.get(fld.relatedConcept);
    if (!dsInner) {
      isc.warn(isc.CBMStrings.NoDataSourceDefined + isc.CBMStrings.MD_ForViewField + fld.name + " (in function deleteLinkedRecord(). It's most likely You set flag CopyLinked for Attribute with no need.)");
      return;
    }
    dsInner.fetchRecord(mainRecord[fld], function (dsResponse, data, dsRequest) {
      // No linked record, and attribute processed is the last, 
      // and no deeper calls on previous attrsibutes - execute main deletion
      if (last && !data && attributesProcessed === 0) {
        deleteMainRecord(mainRecord);
      }
      data.currentTransaction = mainRecord.currentTransaction;
      attributesProcessed++;
      deleteRecord(data, delMode, contextGrid, mainToBin,  checkAttrProcessed); // <<<  Main action!
    });
  }
  
  // --- Deletion process flow ---
  var atrNames = ds.getFieldNames(false);
  // Discover collections / aggregated links fields
  var structuralFields = [];
  var n = atrNames.length;
  for (var i = 0; i < n; i++) {
    var fld = ds.getField(atrNames[i]);
    if (fld.kind === "BackAggregate" 
          || fld.kind === "BackLink" 
          || fld.kind === "CrossLink"
          || fld.kind === "Aggregate" || fld.kind === "Link") {
      if (fld.deleteLinked === true) {
        structuralFields.push(fld);
      }
    }
  }
  var nStr = structuralFields.length;
  
  // No records returned, and attribute processed is the last, 
  // and no deeper calls on previous attrsibutes - execute main deletion
  if (nStr === 0) {
    attributesProcessed--;
    deleteMainRecord(record);
  }

  // Main cycle - actually process aggregated(/linked) records, and main record in the end
  var last = false;
  for (var i = 0; i < nStr; i++) {
    var fld = structuralFields[i];
    if (fld.kind === "BackAggregate" 
          || fld.kind === "BackLink" 
          || fld.kind === "CrossLink") {
      if (i === nStr-1) {last = true;}
      deleteCollection(fld, record, delMode, useBin, last);
    } else if (fld.kind === "Aggregate" || fld.kind === "Link") {
      deleteLinkedRecord(fld, record, delMode, useBin, last);
    }
  }
   
  // deleteMainRecord() _maybe(!)_ execution
  if (checkAttrProcessedComesInArgs && lastMain) {
    checkAttrProcessedComesInArgs();
  }
  
  return attributesProcessed;

};*/



/////////////////////////////////////////////////////
// TODO: -------- DRAFT Variant in work --------- //
// ------- Universal function for complicated object processing -------
function processRecord(record, methodToDo, mainFirst, outerCallback) {
  if (mainFirst) {
    methodToDo(record);
  }
  
  processRelatedRecords(record, methodToDo, mainFirst, outerCallback);

}

function processRelatedRecords(record, methodToDo, mainFirst, outerCallback){
  
  var atrNames = ds.getFieldNames(false);
  // --- Discover collections / aggregated links fields ---
  var structuralFields = [];
  var n = atrNames.length;
  for (var i = 0; i < n; i++) {
    var fld = ds.getField(atrNames[i]);
    // TODO switch to Relation kind instead of editorType
    if (fld.editorType === "CollectionControl" 
          || fld.editorType === "CollectionAggregateControl"
          || fld.editorType === "RelationsAggregateControl"
          || fld.editorType === "CollectionCrossControl"
          /*|| fld.editorType === "LinkControl" || fld.editorType === "combobox"*/) {
      if (fld.deleteLinked === true) {
        structuralFields.push(fld);
      }
    }
  }
  var nStr = structuralFields.length;
  
  // --- Process collections ---
    // Semaphore for complicated attributes in parallel processing before main record
  if (!attributesProcessed) {
    var attributesProcessed = 0;
  }
  
  // Main cycle - actually process aggregated(/linked) records, and main record in the end
  var last = false;
  for (var i = 0; i < nStr; i++) {
    var fld = structuralFields[i];
    // TODO: Replace DS editor type to MD association type, or MD but from DS (where it will exist)?
    if (fld.editorType === "CollectionControl" 
          || fld.editorType === "CollectionAggregateControl"
          || fld.editorType === "RelationsAggregateControl"
          || fld.editorType === "CollectionCrossControl") {
      if (i === nStr-1) {last = true;}
      deleteCollection(fld, record, delMode, useBin, last);
    }/* else if (fld.editorType === "LinkControl" || fld.editorType === "combobox") {
      deleteLinkedRecord(fld, record, delMode, useBin, last);
    }*/
  }

}

function processCollection(fld, record, methodToDo, mainFirst, outerCallback){
  
}

///////////// END DRAFT WORK ///////////////////////////////////////

 
 

// ========================================================================================
// ========================================================================================
// ===================== Universal UI components and UI infrastructure ====================
// ========================================================================================
// ========================================================================================

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
    min: 0 //,
    //          errorMessage: isc.CBMStrings.MoneyType_NotNegative
  }, {
    type: "floatPrecision",
    precision: 2,
    roundToPrecision: true
  }]

});

// -------------- time UI enhenced variant ----------------
function formatTime (value) {
  if (value && value.length > 6) {
    value = value.substring(0,4);
  }
  return value ? value.match(/^\d{1,2}:?\d{1,2}/) : "";
}

// TODO - Does not substitute base "time" funcs. :-(
isc.SimpleType.create({
  name: "timeCBM",
  inheritsFrom: "time",
  
  normalDisplayFormatter: function (value) {
    return formatTime(value);
  },
  
  shortDisplayFormatter: function (value) {
    return formatTime(value);
  },

  
  editFormatter: function (value) {
    return formatTime(value);
  },
  
  parseInput: function (value) {
    return formatTime(value);
  }


});


// ======================================================================
// =================== Multi-language support section ===================
// ======================================================================
// --- Set some global-context language-related objects ---
var curr_Lang = isc.Offline.get("LastLang");
var tmp_Lang = curr_Lang;

var langValueMap = {
  "ru-RU": "Русский",
  "en-GB": "English",
  "cn-CN": "China",
  "jp-JP": "Japan",
  "de-DE": "Germany",
  "fr-FR": "France",
  "sp-SP": "Spain",
  "it-IT": "Italy"
};
var langValueIcons = {
  "ru-RU": "ru-RU",
  "en-GB": "en-GB",
  "cn-CN": "cn-CN",
  "jp-JP": "jp-JP",
  "de-DE": "de-DE",
  "fr-FR": "fr-FR",
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
// Returnes string for language (in fact - string part for that language)
// If strictLang==false - returns strictly requested language value, or null.
function getLang(value, language, strictLang) {
  if (!value || value === "null" || value === null) {
    return null;
  }
  if (typeof value !== "string") {
    return value;
  }

  if (!strictLang) {
    strictLang = false;
  }

  // --- If string is not multi language - return it as is
  if (value.indexOf("~|") == -1) {
    if (!strictLang) {
      return value;
    } else {
//      return null; // - ??? (arguable)
      return value; // - ??? (better?)
    }
  }
  // --- For multilanguage string - try to find requested language part,
  // and if not found - returns first part, no matter prefixed by locale or not.
  // Language prefix are in all cases removed from returned string.
  var out = value;
  var i = value.indexOf("~|" + language); // Is there part for  requested locale?
  if (i !== -1) { // Locale exists
    var tmp = value.slice(i + 8);
    i = tmp.indexOf("~|", 1);
    if (i !== -1) { // The substring is not the last
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
  if (out.charAt(0) === "~") {
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
    return getLang(value, tmp_Lang, false);
  },

  shortDisplayFormatter: function (value, field, component, record) {
    return getLang(value, tmp_Lang, false);
  },

  editFormatter: function (value, field, form, record) {
    if (!value || value === null) return "";
    var lang = tmp_Lang; // Default - global current language
    var strict = false;
    if (field && field.itemLang) {
      lang = field.itemLang;
      strict = field.strictLang;
    }
    return getLang(value, lang, strict);
  },

  parseInput: function (value, field, form, record) {
    var fullValue = field.getValue();
    if (!fullValue || fullValue == null || fullValue === "null" || fullValue === "") {
      if (value === null) {
        return null;
      } else {
		  if (field.itemLang) {
			return "~|" + field.itemLang + "|" + value;
		  } else {
			return value;
		  }
      }
    }
    var out = fullValue;
    if (value === null) {
      value = "";
    }
    if (field && field.itemLang) {
      // If edited language part exists - remove old value - insert new
      var i = fullValue.indexOf("~|" + field.itemLang); // Is there part for  requested locale?
      if (i !== -1) { // Locale exists
        var j = fullValue.indexOf("~|", i + 1); // Existence of successor parts
        out = fullValue.slice(0, i + 8) + value;
        if (j != -1) {
          out = out + fullValue.slice(j);
        }
      } else if (field.strictLang) {
        // OR - Append new language part
        out = fullValue
         + "~|" + field.itemLang + "|" + value;
      } else {
        // OR - replace in all cases the first part
        i = fullValue.indexOf("~|"); // Test if first part starts with language prefix
        j = fullValue.indexOf("~|", 1); // Test if language descriptor exists in string
        if (i === 0) { // Preserve language prefix of first part in all cases
          out = fullValue.slice(0, 8) + value;
        } else {
          out = value;
        }
        if (j !== -1) {
          out = out + fullValue.slice(j);
        }
      }
    } else {
		out = value;
	}
    
    return out;
  }

});

// --- Multi-language text control (FormItem) ---
isc.defineClass("MultilangTextItem", "TextItem", "PickList");
//isc.ClassFactory.defineClass("MultilangTextItem", isc.ComboBoxItem);
isc.MultilangTextItem.addProperties({
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

  init: function () {
    this.setProperty("icons", [{
      src: flagImageURLPrefix + tmp_Lang + flagImageURLSuffix,
      showFocused: true,
      showOver: false
    }]);
    this.setProperty("itemLang", tmp_Lang);
    return this.Super("init", arguments);
  },

  iconClick: function (form, item, icon) {
    item.showPickList(false, false);
  },

  pickValue: function (lang) {
    switchLanguage(this, this.getValue(), lang);
  }

});

//if (isc.PickList) isc.MultilangTextItem.addMethods(isc.PickList._instanceMethodOverrides);

// --- Language processing for string content ---
var switchLanguage = function (field, value, lang) {
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



// ============================= Other Text controls ==================================

// --- "Small multiline" text control ---
isc.defineClass("SmallMultilineText", "TextAreaItem");
isc.SmallMultilineText.addProperties({
  height: 40
});



// =============================================================================================
// ============================== Link controls infrastructure =================================
// =============================================================================================
isc.ClassFactory.defineClass("LinkControlExt", isc.ComboBoxItem);
isc.LinkControlExt.addProperties({
  // shouldSaveValue: true,
  // iconPrompt: "Choose input language",
  // valueMap: langValueMap,
  // valueIcons: langValueIcons,
  // itemLang: tmp_Lang,
  // strictLang: false,
  // imageURLPrefix: flagImageURLPrefix,
  // imageURLSuffix: flagImageURLSuffix,
  // icons: [{
  // src: flagImageURLPrefix + tmp_Lang + flagImageURLSuffix,
  // showFocused: true,
  // showOver: false
  // }],

  // init: function() {
  // this.setProperty("icons", [{
  // src: flagImageURLPrefix + tmp_Lang + flagImageURLSuffix,
  // showFocused: true,
  // showOver: false
  // }]);
  // return this.Super("init", arguments);
  // }

// useClientFiltering : true,
  autoFetchData: false,
  cachePickListResults: false,
  showPickListOnKeypress: true,
  // pickListProperties: {
  // showFilterEditor:true
  // },

  editorEnter: function (form, item, value) {
    this.getFilter(form, item, value);
  },

  getFilter: function (form, item, value) {
    var relMetadata = form.getDataSource().getRelation(item.name);
    if (relMetadata.LinkFilter && relMetadata.LinkFilter !== "null") {
      if(!relMetadata.LinkFilter.startsWith("function")){
        // Expreccion represenrs filter - processed as filter
        var filterStr = processJSONExpression(relMetadata.LinkFilter, this.form.valuesManager.values);
        this.pickListCriteria = parseJSON(filterStr);
      } else {
          // Data are supplied by some function (in more complicated cases)
        this.getClientPickListData = function() {
          return this.valueMap;
        };
        var func = relMetadata.LinkFilter;
        eval(func);
      }
    }
  }
  
/*  getClientPickListData: function () {
    var relMetadata = form.getDataSource().getRelation(item.name);
    if (relMetadata.getData) {
      return relMetadata.getData();
    }
  }*/
});

// ------------- Link-control with reach facilities --------------
isc.defineClass("LinkControl", isc.ComboBoxItem);
isc.LinkControl.addProperties({
  // shouldSaveValue: true,
  
  // valueMap: langValueMap,
  // valueIcons: langValueIcons, 
  // itemLang: tmp_Lang,
  // strictLang: false,
  // imageURLPrefix: flagImageURLPrefix,
  // imageURLSuffix: flagImageURLSuffix,

  doubleClick: function(form, item) {
                   var ds = isc.DataSource.get(item.relatedConcept);
                   var record = ds.cacheResultSet.findByKey(item.getValue());
                   record.infoState = "loaded";
                   editRecords([record], item, conceptRS.find("SysCode", ds.ID));
  },
  
  //~ changed: function (form, item, value) {
	  //~ item.redraw();
  //~ },

  init: function() {
  this.setProperty("icons", [ {
	    src: isc.Page.getAppImgDir() + "deleteLink.png",
	    showFocused: true,
	    showOver: false,
        width: ICON_SIZE_SMALL, height: ICON_SIZE_SMALL, 
        inline: true,
        inlineIconAlign: "right",
        prompt: isc.CBMStrings.EditForm_LinkClear,
        name: "clear",
        showIf: function(form,item) {
                return item.getValue();
              },
        click: function(form, item) {
			     item.setValue(null);
			     item.redraw();
			   }
	  }, {
	    src: isc.Page.getAppImgDir() + "newLink.png",
	    showFocused: true,
	    showOver: false,
      width: ICON_SIZE_SMALL, height: ICON_SIZE_SMALL, 
      inline: true,
      inlineIconAlign: "right",
      prompt: isc.CBMStrings.EditForm_LinkCreateNew,
      name: "new",
      showIf: function(form,item) {
                return !item.getValue();
              },
        click: function(form, item) {
			     var ds = isc.DataSource.get(item.relatedConcept);
			     var record = ds.createInstance(item);
				 record.infoState = "new";
				//~ // If hierarchy - set parent value as in selected record (if any selected)
				//~ var hierarchyLink = ds.findRelation({HierarchyLink: true}).SysCode; 
				//~ if (hierarchyLink && this.getSelection().length > 0) {
				  //~ records[0][hierarchyLink] = this.getSelection()[0][hierarchyLink];
				//~ }
				//~ // --- Set fields partisipating in criteria to criteria value ---
				//~ var criter = this.getCriteria();
				//~ for (var fld in criter) {
				  //~ if (records[0].hasOwnProperty(fld)) {
					//~ records[0][fld] = criter[fld];
				  //~ }
				//~ }
				// var that = this;
				editRecords([record], item, conceptRS.find("SysCode", ds.ID));
				
            
             }
	  },{
	    src: isc.Page.getAppImgDir() + "list.png",
	    showFocused: true,
	    showOver: false,
      prompt: isc.CBMStrings.EditForm_LinkFullWindow,
      name: "listWindow",
      click: function(form, item) {
                var ds = isc.DataSource.get(item.relatedConcept);
                var table = createTable(item.relatedConcept, item, 
                    function(records) {
						if(records && records.length > 0) {
							item.setValue(records[0].ID);
						}
                    }); // filter, rootIdValue, afterCreate)
             }
	  }
   ]);
  return this.Super("init", arguments);
  },

// useClientFiltering : true,
  autoFetchData: false,
  cachePickListResults: false,
  showPickListOnKeypress: true,
  // pickListProperties: {
  // showFilterEditor:true
  // },

  editorEnter: function (form, item, value) {
    this.getFilter(form, item, value);
  },

  getFilter: function (form, item, value) {
    var relMetadata = form.getDataSource().getRelation(item.name);
    if (relMetadata.LinkFilter && relMetadata.LinkFilter !== "null") {
      if(!relMetadata.LinkFilter.startsWith("function")){
        // Expreccion represenrs filter - processed as filter
        var filterStr = processJSONExpression(relMetadata.LinkFilter, this.form.valuesManager.values);
        this.pickListCriteria = parseJSON(filterStr);
      } else {
          // Data are supplied by some function (in more complicated cases)
        this.getClientPickListData = function() {
          return this.valueMap;
        };
        var func = relMetadata.LinkFilter;
        eval(func);
      }
    }
  },
  
/*  getClientPickListData: function () {
    var relMetadata = form.getDataSource().getRelation(item.name);
    if (relMetadata.getData) {
      return relMetadata.getData();
    }
  }*/
});



isc.ClassFactory.defineClass("MultiLinkControl", isc.MultiComboBoxItem);
isc.MultiLinkControl.addProperties({
  //TODO: todo...
});


// =============================================================================================
// ========================== Grid-related controls infrastructure =============================
// =============================================================================================
// --- Delete selected in grid records acording to delete mode
//  parameter: mode - real deletion, or using "Del" property deletion throw trash bin.
function deleteSelectedRecords(innerGrid, mode) {
  if (mode === "restore") {
    restoreSelectedRecords(innerGrid, mode);
    return;
  }
  var gridDS = innerGrid.getDataSource().ID;
  isc.confirm(isc.CBMStrings.InnerGridMenu_DeletionPrompt,
    function (ok) {
      if (ok) {
        var n = innerGrid.grid.getSelectedRecords().length;
        for (var i = 0; i < n; i++) {
          var record = innerGrid.grid.getSelectedRecords()[i];
          if(!record.Concept) {
            record.Concept = gridDS;
          }
          cbmRecord = createFromRecord(record);
          // Supply transactional context to deleted record
          if (innerGrid.context && innerGrid.context.valuesManager) {
            cbmRecord.currentTransaction = innerGrid.context.valuesManager.getValues().currentTransaction;
          }
          deleteRecord(cbmRecord, mode, innerGrid);
          if (mode === "restore" || mode === "delete") {
            updateDataInCache(cbmRecord);
          } else if (mode === "deleteForce") {
            removeDataFromCache(cbmRecord);
          }
          innerGrid.refresh();
        }
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
  click: function () {
    this.context.callObjectsEdit("new");
    return false;
  }
}, {
  icon: isc.Page.getAppImgDir() + "copyOne.png",
  click: function () {
    this.context.callObjectsEdit("copy");
    return false;
  }
}, {
  icon: isc.Page.getAppImgDir() + "edit.png",
  click: function () {
    this.context.callObjectsEdit("loaded");
    return false;
  }
}, {
  isSeparator: true
}, {
  click: function () {
    var deleteMode = this.context.parentElement.parentElement.context ? "delete" : "deleteForce";
    deleteSelectedRecords(this.context.parentElement.parentElement, deleteMode);
    return false;
  }
}];

var innerGridContextMenu = isc.Menu.create({
  cellHeight: 22,
  setContext: function (cont) {
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
  click: function () {
    deleteSelectedRecords(this.context.parentElement.parentElement, "restore");
    return false;
  }
}, {
  isSeparator: true
}, {
  icon: isc.Page.getAppImgDir() + "delete.png",
  click: function () {
    deleteSelectedRecords(this.context.parentElement.parentElement, "deleteForce");
    return false;
  }
}, {
  isSeparator: true
}, {
  icon: isc.Page.getAppImgDir() + "edit.png",
  click: function () {
    this.context.callObjectsEdit("loaded");
    return false;
  }
}];

var innerGridBinContextMenu = isc.Menu.create({
  cellHeight: 22,
  setContext: function (cont) {
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
isc.ClassFactory.defineClass("InnerGrid", isc.Canvas);
isc.InnerGrid.addProperties({
  grid: null, // TODO (?) - move from class to instance !!! (???)
  listSettings: null,
  listSettingsExists: true,
  listSettingsChanged: false, // TODO: Determine changes while work
  // listSettingsApplied : false,
  treeRoot: null,
//  contextObject: null,
  isFilterVisible: false,
  
  addFilter: function (keyName, criteriaValue, sys) {
    this.filters.add(keyName, criteriaValue, sys);
  },

  applyFilters: function (callback) {
    this.grid.setCriteria(this.filters.getCriteria());
    if (callback !== undefined) {
      callback();
    }
  },

  // iSC-supplied Function preserves locally changed data from been overriden.
  // So sometime may cause confusion.
  // TODO: - make cuch cases more clear
  refresh: function () {
 	this.grid.setCriteria(this.grid.getFilterEditorCriteria());
    this.grid.invalidateCache();
    if(this.canvasItem && this.canvasItem.showValue) {
      this.canvasItem.showValue("", null, 
                                this.topElement, 
                                this.canvasItem);
    }
    // this.grid.refreshData();
    // var that = this.grid;
    // this.fetchData( function(responce, data) {
    // that.setData(data);
    // });
  },

  // ----- Function that adopts isc ListGrid function for use InnerGrid's managed set of filters
  fetchData: function (callback) {
    this.grid.fetchData(this.filters.getCriteria(), callback);
  },

  initWidget: function () {
    this.Super("initWidget", arguments);
    var that = this;
    var ds = this.getDataSource();
    if (!ds) {
      isc.warn(isc.CBMStrings.NoDataSourceDefined);
      return;
    }
    
    // Wery long continueInitInnerGrid() definition, for use directly OR in callback (if DS had to be created)
    this.continueInitInnerGrid = function () {
      ds = that.getDataSource();
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
          fld.rootValue = (typeof(that.treeRoot) == "undefined" ? fld.rootValue : that.treeRoot);
        }
      }
      // --- Determine list kind and initialize appropriate type of Grid
      if (ds.isHierarchy == false) {
        that.grid = isc.ListGrid.create({
          dataSource: that.dataSource,
          useAllDataSourceFields: false,
          dataPageSize: 100, // <<< Optimization recomended in actual inherited datasources.
          alternateRecordStyles: false,
          canHover: true,
          hoverWidth: 300, //hoverHeight: 20,
          autoFitData: false, // TODO ???
          //fixedRecordHeights: false,
          leaveScrollbarGaps: false,
          selectionType: "multiple",
          //selectionAppearance:"checkbox", // Use if more "stable" selection preferred.
          canDragRecordsOut: true,
          // TODO: Set some user action to inline record editing
//          recordDoubleClick: function () {
//            if(that.grid.getSelectedRecord() != null) {
//              that.grid.callObjectsEdit("loaded");
//              return false;
//            }
//          },
          canEdit: true,
          modalEditing: true,
          autoSaveEdits: false,
          //canRemoveRecords:true,
          //warnOnRemoval:true,
          saveLocally: false,
          canMultiSort: true,
          canReorderRecords: true,
          
          autoFitWidthApproach:"both",
          wrapHeaderTitles:true,
          headerHeight:25,
          
          innerGrid: that,
          formatCellValue: function (value, record, rowNum, colNum, grid) {
            return getLang(value, tmp_Lang, false);
          },
          viewStateChanged: function () {
            // Don't take into consideration the first grid state change (caused by previous state restore)
            if (this.notFirstDataArived) {
              //Set changed status in Inner Grid
              if (that.ID.startsWith("isc_InnerGrid_")){
                that.listSettingsChanged = true;
              }
              //TODO VVV NOT USED >>> Set changed status also in Window (as flag for saving included grids)
              if (that.parentElement && that.parentElement.parentElement) {
                that.parentElement.parentElement.listSettingsChanged = true;
              }
            }
            this.notFirstDataArived = true;
            return false;
          },
          dataArrived: function () {
            // Set grid settings once on first InnerGrid load
            if (!this.notFirstDataArived) {
              if (that.setListSettings && that.ID.startsWith("isc_InnerGrid_")) {
                that.setListSettings();
              } else {
                if (that.parentElement && that.parentElement.parentElement && that.parentElement.parentElement.setListSettings) {
                  that.parentElement.parentElement.setListSettings();
                }             
              }
            }
            return true;
          }
        })
      } else {
        that.grid = isc.TreeGrid.create({
          dataSource: that.dataSource,
          useAllDataSourceFields: false,
          //        autoFetchData: true,
          keepParentsOnFilter: false, // TODO: Set to "true", but change parent records to Gray
          //        keepParentsOnFilter: true, // If true - the in-form tree will crush
          dataPageSize: 100, // <<< Optimization recomended in actual inherited datasources.
          loadDataOnDemand: false, // !!! If false - treeRootValue won't be set!
          listSettingsApplied: false,
          alternateRecordStyles: false,
          canHover: true,
          hoverWidth: 300, //hoverHeight: 40,
          autoFitData: false, // TODO ???
          //fixedRecordHeights: false,
          leaveScrollbarGaps: false,
          selectionType: "multiple",
          //selectionAppearance:"checkbox", // Use if more "stable" selection preferred.
          canDragRecordsOut: true,
          canEdit: true,
          modalEditing: true,
          autoSaveEdits: false,
          
          autoFitWidthApproach:"both",
          wrapHeaderTitles:true,
          headerHeight:27,
          
          formatCellValue: function (value, record, rowNum, colNum, grid) {
            return getLang(value, tmp_Lang, false);
          },
          // TODO: Set some user action to inline record editing
          recordDoubleClick: function () {
            if (that.grid.getSelectedRecord() != null) {
              that.grid.callObjectsEdit("loaded");
              return false;
            }
          },
          //canRemoveRecords:true,
          //warnOnRemoval:true,
          saveLocally: false,
          canMultiSort: true,
          canReorderRecords: true,
          innerGrid: that,
          viewStateChanged: function () {
            // Set changed status in Inner Grid
            if (that.ID.startsWith("isc_InnerGrid_")){
              that.listSettingsChanged = true;
            }
            this.parentElement.parentElement.listSettingsChanged = true;
            return false;
          },
          dataArrived: function (parentNode) {
            if (!this.listSettingsApplied) {
              if (this.parentElement && this.parentElement.parentElement && this.parentElement.parentElement.setListSettings) {
                this.parentElement.parentElement.setListSettings();
              } else {
                if (that.setListSettings) {
                  that.setListSettings();
                }
              }
//            this.parentElement.parentElement.setListSettings();
              this.listSettingsApplied = true;
            }
            return true;
          }
        })
      }
      
      that.grid.allowFilterOperators = true;
      that.grid.filterEditorSubmit = function(criteria) {
        return true;
      } 
      
      that["filters"] = isc.FilterSet.create(); // TODO: (?) - switch "FilterSet" to simple JS object???
      // By default 
      if (ds.isDeleteToBin()) {
        that.addFilter("Del", {"Del": false}, true);
        that.applyFilters();
      }

      that.grid.setFields(flds);
      if (typeof(that.treeRoot) != "undefined") {
        that.grid.treeRootValue = that.treeRoot;
        that.grid.data.rootValue = that.treeRoot;
      }

      // --- Other grid intialisations:
      that.grid.showContextMenu = function () {
        innerGridContextMenu.setContext(this);
        return innerGridContextMenu.showContextMenu();
      };

      if (ds.canExpandRecords) {
        that.grid.canExpandRecords = true;
        that.grid.detailDS = ds.detailDS;
        if (ds.expansionMode) {
          that.grid.expansionMode = ds.expansionMode;
        } else {
          that.grid.expansionMode = "related";
        }
        if (ds.childExpansionMode) {
          that.grid.childExpansionMode = ds.childExpansionMode;
        }
      }

      //TODO: Menu adjusted to current cell
      //         this.grid.cellContextClick = function (record, row, cell) {
      //          return this.showContextMenu();
      //        };

      that.grid.callObjectsEdit = function (mode) {
        'use strict';
        var ds = this.getDataSource();
        var records = [];

        // !!! TODO: --- VVV Provide full View properties (in favor of Concept!!!)
        var viewRecord = viewRS.find("SysCode", (this.dataSource.ID ? this.dataSource.ID : this.dataSource));

        // --- Edit New record ---
        if (mode == "new") {
          //        this.selection.deselectAll();
          // If ds is superclass - ask first, and create selected class (ds) instance.
          var dsRecord = conceptRS.find("SysCode", (this.dataSource.ID ? this.dataSource.ID : this.dataSource));
          var childs = conceptRS.findAll("BaseConcept", dsRecord.ID);
          var isSuper = (childs && childs.length > 0);
          if (isSuper && !viewRecord["StrictConcept"]) {
            var cretin = {
              _constructor: "AdvancedCriteria",
              operator: "and",
              criteria: [{fieldName: "Primitive", operator: "equals", value: false},
                {fieldName: "Abstract", operator: "equals", value: false},
                {
                  operator: "or", criteria: [
                  {
                    fieldName: "HierCode",
                    operator: "startsWith",
                    value: dsRecord.HierCode + "," + dsRecord.ID
                  },
                  {fieldName: "ID", operator: "equals", value: dsRecord.ID}
                ]
                }
              ]
            }

            var that = this;
            var newChild = function (record) {
              var dsNew = isc.DataSource.getDataSource(record[0].SysCode);
              if (dsNew == null) {
                isc.warn(isc.CBMStrings.NewObject_NoDS);
                return;
              }
              records[0] = dsNew.createInstance(that);
              records[0]["infoState"] = "new";
              var conceptRecord = conceptRS.find("SysCode", dsNew.ID);
              //            records[0]["PrgClass"] = conceptRecord["ID"]; // TODO <<< ??? TEST (concept != class)
              var criter = that.getCriteria();
              // --- Set fields partisipating in criteria to criteria value
              for (var fld in criter) {
                if (criter.hasOwnProperty(fld)) {
                  records[0][fld] = criter[fld];
                }
              }
              if (records != null && records.getLength() > 0) {
                editRecords(records, that /*this*/, conceptRecord); // <<< 11.22 try
              }
            }
            var table = createTable("Concept", this, newChild, cretin, dsRecord["ID"]);
            return;
          } else {
            // Not superclass - create instance directly
            records[0] = ds.createInstance(this);
            records[0]["infoState"] = "new";
            // If hierarchy - set parent value as in selected record (if any selected)
            var hierarchyLink = ds.findRelation({HierarchyLink: true}).SysCode; 
            if (hierarchyLink && this.getSelection().length > 0) {
              records[0][hierarchyLink] = this.getSelection()[0][hierarchyLink];
            }
            // --- Set fields partisipating in criteria to criteria value ---
            var criter = this.getCriteria();
            for (var fld in criter) {
              if (records[0].hasOwnProperty(fld)) {
                records[0][fld] = criter[fld];
              }
            }
            var that = this;
            editRecords(records, that, conceptRS.find("SysCode", ds.ID));
          }
          this.selection.deselectAll();
        }

        // --- Copy Selected record ---
        else if (mode == "copy") {
          records[0] = this.getSelectedRecord();
          //        records[0]["infoState"] = "copy"; // <<<<<<<<<<< ???????? Here? Not in cloneInstance() ???
          var that = this;
          var editCopy = function (records) {
            editRecords(records, that);
          }
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
            if (viewRecord["StrictConcept"]) {
              // Strict non-polymorphic editing
              editRecords(records, this, viewRecord);
            } else {
              // Typical polymorphic editing
              editRecords(records, this);
            }
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
        title: isc.CBMStrings.InnerGrid_CreateFrom,
        icon: isc.Page.getAppImgDir() + "newFromSelect.png",
        visibility: "hidden"
      });
      if (typeof(that.getDataSource().CreateFromMethods) != "undefined") {
        var createMenuData = that.getDataSource().CreateFromMethods;
        menuCreate = isc.Menu.create({
          showShadow: true,
          shadowDepth: 10,
          context: that.grid,
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
      if (typeof(that.getDataSource().SpecificMethods) != "undefined") {
        var methodsMenuData = that.getDataSource().SpecificMethods;
        menuMethods = isc.Menu.create({
          showShadow: true,
          shadowDepth: 10,
          context: that.grid,
          data: methodsMenuData
        });
        methodsMenuButton.menu = menuMethods;
        methodsMenuButton.show();
      };

      var toContextReturnButton = null;
      if (typeof(that.context) != "undefined" && that.context != null
        && that.context.Class !== "InnerForm" ) {
        toContextReturnButton = isc.IconButton.create({
          top: 250,
          width: 25,
          title: "",
          icon: isc.Page.getAppImgDir() + "tickOut.png",
          prompt: isc.CBMStrings.InnerGrid_ChoiceDone,
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
      };

      var innerGridDefaultMenu = [
        toContextReturnButton,
        isc.IconButton.create({
          top: 250,
          width: 25,
          title: "",
          icon: isc.Page.getAppImgDir() + "new.png",
          prompt: isc.CBMStrings.InnerGrid_CreateNew,
          click: function () {
            this.parentElement.parentElement.parentElement.grid.callObjectsEdit("new");
            return false;
          }
        }),
        isc.IconButton.create({
          top: 250,
          width: 25,
          title: "",
          icon: isc.Page.getAppImgDir() + "copyOne.png",
          prompt: isc.CBMStrings.InnerGrid_CopyNew,
          hoverWidth: 220,
          click: function () {
            this.parentElement.parentElement.parentElement.grid.callObjectsEdit("copy");
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
          click: function () {
            this.parentElement.parentElement.parentElement.grid.callObjectsEdit("loaded");
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
          click: function () {
            deleteSelectedRecords(this.parentElement.parentElement.parentElement, "delete");
            return false;
          },
          visibility: (that.getDataSource().isDeleteToBin() ? "inherit" : "hidden"),
          menu: isc.Menu.create({ // TODO: initialize menu here
            showShadow: true,
            shadowDepth: 10,
            currentInnerGrid: that,
            data: [{
              icon: isc.Page.getAppImgDir() + "binOpen.png",
              title: isc.CBMStrings.InnerGrid_ProcessBinSubMenu,
              click: function (context) {
                context.currentInnerGrid.addFilter("Del", {"Del": true}, true);
                context.currentInnerGrid.applyFilters();
                if(context.currentInnerGrid.canvasItem.showValue) {
                  context.currentInnerGrid.canvasItem.showValue("", null, 
                                                  context.currentInnerGrid.topElement, 
                                                  context.currentInnerGrid.canvasItem);
                }
                // Adjust menus to "bin-mode"
                context.currentInnerGrid.grid.contextMenu = innerGridBinContextMenu;
                context.currentInnerGrid.grid.showContextMenu = function () {
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
          click: function () {
            var deleteMode = this.parentElement.parentElement.parentElement.context ? "delete" : "deleteForce";
            deleteSelectedRecords(this.parentElement.parentElement.parentElement, deleteMode);
            return false;
          },
          visibility: (that.getDataSource().isDeleteToBin() ? "hidden" : "inherit")
        }),
        isc.IconButton.create({
          top: 250,
          left: 200,
          width: 25,
          title: "",
          icon: isc.Page.getAppImgDir() + "refresh.png",
          prompt: isc.CBMStrings.InnerGrid_Reload,
          hoverWidth: 150,
//        click: "this.parentElement.parentElement.parentElement.refresh(); return false;"
          click: function () {
            // TODO: Guarantie reload from DB, not from cache
            this.parentElement.parentElement.parentElement.refresh();
            return false;
          }
        }),
        isc.IconButton.create({
          top: 250,
          left: 300,
          width: 25,
          title: "",
          icon: isc.Page.getAppImgDir() + "filter.png",
          prompt: isc.CBMStrings.InnerGrid_AutoFilter,
          click: function () { // TODO: below - sample only!!!
            //grid.filterData(advancedFilter.getCriteria());
            var thisGrid = this.parentElement.parentElement;
            thisGrid.parentElement.isFilterVisible = !thisGrid.parentElement.isFilterVisible; 
            thisGrid.members[1].setShowFilterEditor(thisGrid.parentElement.isFilterVisible);
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
          currentInnerGrid: that,
          click: function (context) {
            this.parentElement.parentElement.parentElement.addFilter("Del", {"Del": false}, true);
            this.parentElement.parentElement.parentElement.applyFilters();
            if(this.parentElement.parentElement.parentElement.canvasItem.showValue) {
              this.parentElement.parentElement.parentElement.canvasItem.showValue("", null, 
                                                    this.parentElement.parentElement.parentElement.topElement, 
                                                    this.parentElement.parentElement.parentElement.canvasItem);
            }
            context.currentInnerGrid
            // Return menus to normal innerGrid mode
            this.parentElement.parentElement.parentElement.grid.contextMenu = innerGridContextMenu;
            this.parentElement.parentElement.parentElement.grid.showContextMenu = function () {
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
          click: function () {
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
          click: function () {
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
          click: function () {
            this.parentElement.parentElement.parentElement.grid.callObjectsEdit("loaded");
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
          that.grid
        ]
      });
      that.addChild(controlLayout);
      that.menuContainer = controlLayout.members[0];
      that.menuContainer.setMembers(innerGridDefaultMenu);
    }

    // --- Function initWidget() work flow continuation after long continueInitInnerGrid() definition...
    if (!ds.getFields) {
      testCreateDS.bind(this, ds, this.continueInitInnerGrid);
      return;
    }
    // --- Run function if not done erlier in callback ---
    this.continueInitInnerGrid();

  }, // --- end initWidget()


  // --- Apply previously stored current user's list settings
  setListSettings: function () {
    if (this.topElement) { // Settings for top-level List window
      this.listSettings = listSettingsRS.find({
        ForUser: curr_User,
        ForType: this.grid.dataSource,
        Win: this.topElement.getClassName(),
        Context: this.topElement.contextString
      });
    } else { // Settings for in-form collection controls
      this.listSettings = listSettingsRS.find({
        ForUser: curr_User,
        ForType: this.grid.dataSource,
        Win: this.grid.topElement.getClassName(),
        Context: this.grid.getDataSource().ID
      });
    }
    if (typeof(this.listSettings) == "undefined" || this.listSettings == null) {
      this.listSettings = listSettingsRS.dataSource.createInstance();
      this.listSettingsExists = false;
      this.listSettings.ForType = this.grid.dataSource;
      this.listSettings.Win = (this.topElement ? this.topElement.getClassName() : this.grid.topElement.getClassName());
      this.listSettings.ForUser = curr_User;
      this.listSettings.Context = (this.topElement ? this.topElement.contextString : this.grid.getDataSource().ID);
      this.listSettings.Settings = this.grid.getViewState();
    } else if (this.listSettings.Settings) {
      this.grid.setViewState(this.listSettings.Settings);
    }
  },

  innerCloseNoChoiceDlg: function () {
    if (okClick()) {
      this.topElement.destroy();
    }
  }

}); // ----- END InnerGrid ------



//----------------------------------------------------------------------------------------------------
// -------------------------------- CollectionControl (Back-link) control ------------------------------------------------
isc.ClassFactory.defineClass("CollectionControl", isc.CanvasItem);
isc.CollectionControl.addProperties({
  //    height: "*",  width: "*", <- seems the same
  //    height: "88%",  width: "88%", //<- very narrow, but normal hight! (???)
  rowSpan: "*",
  colSpan: "*",
  vAlign: "top",
  shouldSaveValue: true, // Don't switch, or showValue() won't be called

  innerGrid: null,
  backLinkRelation: null,
  mainIDProperty: null,
  mainID: -1,
  aggregate: false,

  createCanvas: function (form) {
    this.innerGrid = isc.InnerGrid.create({
      autoDraw: false,
      //width: "100%", height: "80%", <- Bad experience: If so, inner grid will not resize
      width: "*", height: "*",
      dataSource: (this.optionDataSource ? this.optionDataSource : this.relatedConcept),
      context: form // TODO: Part off: Provide settings to collection-controls too
    });
 //   this.innerGrid.grid.showFilterEditor = false;
    return this.innerGrid;
  },

  showValue: function (displayValue, dataValue, form, item) {
    // Lightweight variant - data are supplied
    if (dataValue && dataValue.length > 0) {
      this.innerGrid.grid.setData(dataValue);
    } else { // Data not supplied - get it from Storage
      if (typeof(form.valuesManager) != "undefined" && form.valuesManager != null) {
        this.mainID = form.valuesManager.getValue(this.mainIDProperty);
        if (typeof(this.mainID) != "undefined") {
          var filterString = "{\"" + this.backLinkRelation + "\" : \"" + this.mainID + "\"}";
          this.innerGrid.addFilter("BackLink", parseJSON(filterString), true);
          if (this.optionCriteria) {
            this.innerGrid.addFilter("LinkFilter", this.optionCriteria, true);
          }
          // TODO: Switch to AdvancedCriteria
          /*          var cretin = null;
           if (this.optionCriteria) {
           cretin = {
           _constructor:"AdvancedCriteria",
           operator: "and",
           criteria:[parseJSON(filterString), this.optionCriteria ]};
           } else {
           cretin = parseJSON(filterString);
           }
           this.innerGrid.addFilter("BackLink", cretin, true);*/

        }
      }
      this.innerGrid.fetchData(function (dsResponse, data, dsRequest) {
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
}); // <<< End CollectionControl (Back-link) control

// -------------------------------- CollectionControl aggregate control (strong-dependent collection) ------------------------------------------------
isc.ClassFactory.defineClass("CollectionAggregateControl", isc.CollectionControl);
isc.CollectionAggregateControl.addProperties({
  //    height: "*",  width: "*", <- seems the same
  //    height: "88%",  width: "88%", //<- very narrow, but normal hight! (???)
  rowSpan: "*",
  colSpan: "*",
  shouldSaveValue: true, // Don't switch, or showValue() won't be called

  innerGrid: null,
  backLinkRelation: null,
  mainIDProperty: null,
  mainID: -1,
  aggregate: true, // <<<<<<<<<<<<<<<<

  createCanvas: function (form) {
    var that = this;
    var ds = (this.optionDataSource ? this.optionDataSource : this.relatedConcept);
//    testCreateDS(ds, function(){
      that.innerGrid = isc.InnerGrid.create({
        autoDraw: false,
        // // //width: "100%", height: "80%", <- Bad experience: If so, inner grid will not resize
        width: "*", height: "*",
        dataSource: ds,
        context: form // TODO: Part off: Provide settings to collection-controls too
      });
      // that.innerGrid.grid.showFilterEditor = false;
      // that.innerGrid.grid.dependent = true;
//    });
    
    // that.innerGrid = isc.InnerGrid.create({
    // autoDraw: false,
    // //width: "100%", height: "80%", <- Bad experience: If so, inner grid will not resize
    // width: "*", height: "*",
    // dataSource: ds,
    // context: form // TODO: Part off: Provide settings to collection-controls too
    // });
    return that.innerGrid;
  },

  showValue: function (displayValue, dataValue, form, item) {
    this.innerGrid.grid.showFilterEditor = false;
    this.innerGrid.grid.dependent = true;
    // Lightweight variant - data are supplied
    if (dataValue && dataValue.length > 0) {
      this.innerGrid.grid.setData(dataValue);
    } else { // Data not supplied - get it from Storage
      if (typeof(form.valuesManager) != "undefined" && form.valuesManager != null) {
        this.mainID = form.valuesManager.getValue(this.mainIDProperty);
        if (typeof(this.mainID) != "undefined") {
          var filterString = "{\"" + this.backLinkRelation + "\" : \"" + this.mainID + "\"}";
          this.innerGrid.addFilter("BackLink", parseJSON(filterString), true);
        }
      }
      this.innerGrid.fetchData(function (dsResponse, data, dsRequest) {
          if (!this.getDataSource) {
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

// ------------ Relations for Concept(/Kind) specific CollectionControl ------------------------------------------------
isc.ClassFactory.defineClass("RelationsAggregateControl", isc.CollectionAggregateControl);
isc.RelationsAggregateControl.addProperties({ 
  needRefresh: true, // Means that this control does not refresh itself when DS changes, so need explicit showValue() call
  createCanvas: function (form) {
  this.Super("createCanvas", arguments);    
  // Array of hilite-objects to apply to the grid
  var hiliteArray =  
    [
      {
        fieldName: ["SysCode", "Description", "ForConcept", "RelatedConcept", "PrgNotes", "DBTable", "DBColumn"],
        cssText: "background-color:#C8E0F0;", 
        criteria: {
          fieldName: "_inherited", 
          operator: "equals", 
          value: true
        }
      }, {
        fieldName: ["SysCode", "Description", "ForConcept", "RelatedConcept", "PrgNotes", "DBTable", "DBColumn"],
        cssText: "background-color:#E5F5FF;", 
        criteria: {
          fieldName: "_modified", 
          operator: "equals", 
          value: true
        }
      }, {
        fieldName: ["RelatedConcept", "RelationKind"],
        cssText: "color:#0000FF;", 
        criteria: {
          fieldName: "RelationKind", 
          operator: "inSet", 
          value: ["Link", "Aggregate"]
        }
      }, {
        fieldName: ["RelatedConcept", "RelationKind"],
        cssText: "color:#990099;", 
        criteria: {
          fieldName: "RelationKind", 
          operator: "inSet", 
          value: ["BackLink", "BackAggregate", "CrossLink"]
        }
      }
    ];
    this.innerGrid.grid.hilites = hiliteArray;
     return this.innerGrid;
  },
  
  // showValue() function overriden
  showValue: function (displayValue, dataValue, form, item) {
    // Lightweight variant - data are supplied
    if (dataValue && dataValue.length > 0) {
      this.innerGrid.grid.setData(dataValue);
    } else { // Data not supplied - get it from Storage
      if (typeof(form.valuesManager) != "undefined" && form.valuesManager != null) {
        this.mainID = form.valuesManager.getValue(this.mainIDProperty);
        var that = this;
        if (typeof(this.mainID) != "undefined") {
          var that = this;
          getRelationsForConcept(this.mainID,
            function (data) {
              var filter = that.innerGrid.filters.getCriteria();
              var filteredData = data.findAll(filter);
              if (filteredData === null) {
                filteredData = [];
              }
              that.innerGrid.grid.setData(filteredData);
             //     that.innerGrid.getDataSource().setCacheData(data);

              //if (!that.innerGrid.getDataSource) {
                //if (!that.innerGrid.hasAllData()) {
                  //that.innerGrid.setCacheData(data);
                //}
              //} else {
                //if (!that.innerGrid.getDataSource().hasAllData()) {
                  //that.innerGrid.getDataSource().setCacheData(data);
                //}
              //}

            },
            this.innerGrid.filters
          );
        }
      }
    }
  }
}); // <<< End of special aggregate control for Relations-for-Concept 


// ----------------------------------------------------------------------------------------------------
// ------------------------- CollectionControl (Back-link) control ------------------------------------
isc.ClassFactory.defineClass("CollectionCrossControl", isc.CanvasItem);
isc.CollectionCrossControl.addProperties({
  //    height: "*",  width: "*", <- seems the same
  //    height: "88%",  width: "88%", //<- very narrow, but normal hight! (???)
  rowSpan: "*",
  colSpan: "*",
  vAlign: "top",
  shouldSaveValue: true, // Don't switch, or showValue() won't be called

  innerGrid: null,
  backLinkRelation: null,
  mainIDProperty: null,
  mainID: -1,
  aggregate: false,

  createCanvas: function (form) {
    this.innerGrid = isc.InnerGrid.create({
      autoDraw: false,
      //width: "100%", height: "80%", <- Bad experience: If so, inner grid will not resize
      width: "*", height: "*",
      dataSource: (this.optionDataSource ? this.optionDataSource : this.relatedConcept),
      context: form // TODO: Part off: Provide settings to collection-controls too
    });
   return this.innerGrid;
  },

  showValue: function (displayValue, dataValue, form, item) {
    this.innerGrid.grid.showFilterEditor = false;
     // Lightweight variant - data are supplied
    if (dataValue && dataValue.length > 0) {
      this.innerGrid.grid.setData(dataValue);
    } else { // Data not supplied - get it from Storage
      if (typeof(form.valuesManager) != "undefined" && form.valuesManager != null) {
        this.mainID = form.valuesManager.getValue(this.mainIDProperty);
        if (typeof(this.mainID) != "undefined") {
          var filterString = "{\"" + this.backLinkRelation + "\" : \"" + this.mainID + "\"}";
          this.innerGrid.addFilter("BackLink", parseJSON(filterString), true);
          if (this.optionCriteria) {
            this.innerGrid.addFilter("LinkFilter", this.optionCriteria, true);
          }
          // TODO: Switch to AdvancedCriteria
          /*          var cretin = null;
           if (this.optionCriteria) {
           cretin = {
           _constructor:"AdvancedCriteria",
           operator: "and",
           criteria:[parseJSON(filterString), this.optionCriteria ]};
           } else {
           cretin = parseJSON(filterString);
           }
           this.innerGrid.addFilter("BackLink", cretin, true);*/

        }
      }
      this.innerGrid.fetchData(function (dsResponse, data, dsRequest) {
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
}); // <<< End CollectionControl (Cross-link) control


// ----------------- CollectionControl for direct-linked objects --------------
// TODO: ***
/*isc.ClassFactory.defineClass("CollectionDirectItem", "CollectionControl");
 isc.CollectionAggregateControl.addProperties({
 aggregate: true,

 createCanvas: function(form) {
 var grid = this.Super("createCanvas", arguments);
 this.innerGrid.grid.dependent = true;
 return grid;
 },

 }); // <<< End CollectionDirectItem control (direct collection control).
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
 
 

// ----------------- Special control for single week working time ------------------
// TODO !!! switch from special "WorkingTime" implementation to work on universal TimePeriod structure
isc.ClassFactory.defineClass("WeekWorkControl", isc.CanvasItem);
isc.WeekWorkControl.addProperties({
  rowSpan: "*",
  colSpan: "*",
  vAlign: "top",
  maxHeight: 190,
  shouldSaveValue: true, // Don't switch, or showValue() won't be called
  dynaForm: null,
  records: null,
      
  createCanvas: function (form) {
    this.dynaForm = isc.DynamicForm.create({
      autoDraw: false,
      width: "*", height: "*",
      numCols: 3,
      backgroundColor:"#CFEEDD",
      border: "1px solid blue",
      cellPadding: 5,
      dataSource: (this.optionDataSource ? this.optionDataSource : this.relatedConcept),
      context: form,

      fields: [
      {name:"day1", title:"ПН", type:"timeCBM", hint:"мм:сс", textAlign:"right", parseEditorValue: formatTime}, {name:"end1", showTitle:false, type:"time", hint:"мм:сс", textAlign:"right", parseEditorValue: formatTime}, 
      {name:"day2", title:"ВТ", type:"time", hint:"мм:сс", textAlign:"right", parseEditorValue: formatTime}, {name:"end2", showTitle:false, type:"time", hint:"мм:сс", textAlign:"right", parseEditorValue: formatTime}, 
      {name:"day3", title:"СР", type:"time", hint:"мм:сс", textAlign:"right", parseEditorValue: formatTime}, {name:"end3", showTitle:false, type:"time", hint:"мм:сс", textAlign:"right", parseEditorValue: formatTime}, 
      {name:"day4", title:"ЧТ", type:"time", hint:"мм:сс", textAlign:"right", parseEditorValue: formatTime}, {name:"end4", showTitle:false, type:"time", hint:"мм:сс", textAlign:"right", parseEditorValue: formatTime}, 
      {name:"day5", title:"ПТ", type:"time", hint:"мм:сс", textAlign:"right", parseEditorValue: formatTime}, {name:"end5", showTitle:false, type:"time", hint:"мм:сс", textAlign:"right", parseEditorValue: formatTime}, 
      {name:"day6", title:"СБ", type:"time", hint:"мм:сс", textAlign:"right", parseEditorValue: formatTime}, {name:"end6", showTitle:false, type:"time", hint:"мм:сс", textAlign:"right", parseEditorValue: formatTime}, 
      {name:"day7", title:"ВС", type:"time", hint:"мм:сс", textAlign:"right", parseEditorValue: formatTime}, {name:"end7", showTitle:false, type:"time", hint:"мм:сс", textAlign:"right", parseEditorValue: formatTime}
      ]
    });
    return this.dynaForm;
  },

  showValue: function (displayValue, dataValue, form, item) {
    this.mainID = form.valuesManager.getValue(this.mainIDProperty);
    if (typeof(this.mainID) != "undefined") {
      var filterString = "{\"" + this.backLinkRelation + "\" : \"" + this.mainID + "\"}";
      var filter = parseJSON(filterString);
    }
    
    that = this;
    this.dynaForm.dataSource.fetchData(
      filter,
      function (dsResponce, data, dsRequest) {
        if (data.length > 0) {
          that.records = data;
          for (var i = 1; i < 8; i++) {
            var record = data.find({Day: i});
            if (record) {
              if (record.OpeningTime.indexOf(':') === 2) {
                var beg = record.OpeningTime.substr(0,5); // like: 10:00:00.0
              } else {
                var beg = record.OpeningTime.substr(11,5); // like: 1900-01-01 10:00:00.0
              }
              if (record.OpeningTime.indexOf(':') === 2) {
                var end = record.ClosingTime.substr(0,5); // like: 10:00:00.0
              } else {
                var end = record.ClosingTime.substr(11,5); // like: 1900-01-01 10:00:00.0
              }
              that.dynaForm.items.find({name:"day" + i}).setValue(beg); 
              that.dynaForm.items.find({name:"end" + i}).setValue(end); 
            }
          }
          that.storeValue(that.records);
        }
      }
    );
  },
 
  saveCollection: function() {
    var record = null;
    
    for (var i = 1; i < 8; i++) {
      var begFld = this.dynaForm.getItem("day" + i);
      var endFld = this.dynaForm.getItem("end" + i);
      if (!begFld || !endFld) {return;}
      var beg = begFld.getValue();
      var end = endFld.getValue();

      record = null;
      if (this.records) {
        record = this.records.find({Day: i});
      }
      if ((beg || end) && !record) {
        // Inserting 
        // TODO!!! Switch to CBMDataSourse.createInstance()
        var cbmRecord = Object.create(CBMobject);
        cbmRecord.ID = isc.IDProvider.getNextID();
        cbmRecord.Concept = this.relatedConcept;
        cbmRecord.Day = i;
        cbmRecord.Offer = this.mainID;
        cbmRecord.OpeningTime = beg;
        cbmRecord.ClosingTime = end;
        cbmRecord.CreateTime = new Date();
        cbmRecord.infoState = "new";
        TransactionManager.add(cbmRecord);
        addDataToCache(cbmRecord);
        if (!this.records) {
          this.records = [];
        }
        this.records.add(cbmRecord);
      } else if (record && !beg && !end) {
        // Deleting
        this.dynaForm.dataSource.removeData(record);
        removeDataFromCache(record);
        this.records.remove(cbmRecord);
      } else if (record 
          && ((new Date(record.OpeningTime).getHours() !== beg.getHours()) 
              || (new Date(record.OpeningTime).getMinutes() !== beg.getMinutes()) 
           || (new Date(record.ClosingTime).getHours() !== end.getHours()) 
              || (new Date(record.ClosingTime).getMinutes() !== end.getMinutes()))) 
      {
        // Update 
        var cbmRecord = Object.create(CBMobject);
        collectObjects(cbmRecord, record); 
        if (!cbmRecord.Concept) {
          cbmRecord.Concept = this.relatedConcept;
        }
        cbmRecord.OpeningTime = beg;
        cbmRecord.ClosingTime = end;
        cbmRecord.infoState = "changed";
        TransactionManager.add(cbmRecord);
        updateDataInCache(cbmRecord);
      }
    }
  }

}); // <<< End WeekWorkControl control.

 
// ==========================================================================
// ================= CBM Windows / Dialogs components =======================
// ==========================================================================


// ============== CBM common Window class ===================================
isc.ClassFactory.defineClass("BaseWindow", isc.Window );
isc.BaseWindow.addProperties({
  width: 700,
  height: 500,
  layoutMargin: 2,
  autoSize: true,
  //  showFooter:true,
  canDragResize: true,
  showResizer: true,
  resizeBarSize: 10, //6,
    resizeFrom:["T","L","B","R","TL","BL","TR","BR"],
    edgeMarginSize:10,

  
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
  hiliteHeaderStyle: "WindowHiliteHeader",
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
    if (typeof(this.winPos) == "undefined" || this.winPos == null) {
      this.winPos = windowSettingsRS.dataSource.createInstance();
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

  savePosition: function () {
	//~ if (!this.winPos) {
		//~ this.WinPos = windowSettingsRS.dataSource.createInstance();
	//~ }
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

  onCloseClick: function () {
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
  callback: null,
  afterCreate: null,
  initWidget: function () {
    
//    this.continueAfterDSTested = function(ds){
      this.Super("initWidget", arguments);
    
      this.innerGrid = isc.InnerGrid.create({
        dataSource: this.dataSource,
        context: this.context,
        treeRoot: this.treeRoot,
        width: "100%",
        defaultHeight: "500",
        autoSize: true
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
      
      if(this.afterCreate){
        this.afterCreate(this);
      }
//    }
    
//    testCreateDS(this.dataSource, this.continueAfterDSTested.bind(this)); // Dynamic DS creation if needed
     
  },

  onCloseClick: function () {
    // In all cases - save in-grid editings 
    this.innerGrid.grid.saveAllEdits();
    
    var tmp = this.Super("onCloseClick", arguments);
    
    // Save ListSettings
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
function createTable(forType, context, callback, filter, rootIdValue, afterCreate) {
  // Dynamic DS creation if needed
  testCreateDS(forType, 
    function(){
      
      var initCreatedTable = function(table){
        if (!table.innerGrid || !table.innerGrid.grid) {
          return;
        }

        if (rootIdValue) {
          table.innerGrid.treeRoot = rootIdValue;
        }

        // TODO here - add previous stored Filters if any
        //    filter = {Del:false};
        if (context === undefined) {
          context = table;
        }
        
        if (filter !== undefined && filter !== null && context != table) {
          filter = isc.DataSource.combineCriteria(filter, table.innerGrid.grid.getCriteria());
          table.innerGrid.grid.setCriteria(filter);
        } else {
          filter = table.innerGrid.grid.getCriteria();
        }
        
        table.innerGrid.grid.fetchData(filter, function (dsResponse, data, dsRequest) {
		  if(!context.innerGrid || !context.getDataSource()) {
			  // Context isn't of grid nature - do nothing
			  return;
		  }
          if (context.getDataSource === undefined) {
            if (!context.innerGrid.grid.hasAllData()) {
              context.innerGrid.grid.setCacheData(data);
            }
          } else {
            if (!context.getDataSource().hasAllData()) {
              context.getDataSource().setCacheData(data);
            }
          }
        });
        table.show();
        if (afterCreate){
          afterCreate(table);
        }
        return table;
      }
      
      var table = isc.TableWindow.create({
        dataSource: forType,
        context: context,
        callback: callback,
        treeRoot: rootIdValue,
        afterCreate: initCreatedTable
      });
      
    }
  ); 
  // return table;
};


// ==================== CBM Form View Infrastructure ========================

// InnerForm - intended to preset some DynamicForm proerties to CBM reasonable values
isc.ClassFactory.defineClass("InnerForm", isc.DynamicForm);
isc.InnerForm.addProperties({
  //    width: "89%", height: "89%", <- Some narrow width, NO affected height!
  width: "100%",
  height: "100%",
  //    width: "*", height: "*", <- Narrow width and no resize!
  autoSize: true,
  numCols: 6,
  minColWidth: 100,
//  colWidths: ["120", "30%", "120", "30%"],
  colWidths: ["10%", "23%", "10%", "23%", "10%", "23%"],
  layoutMargin: 2,
  cellPadding: 2,
  //  cellBorder : 1, // <<< For layout testing only! In production - set to 0
  autoFocus: true,
  showTitlesWithErrorMessages: true,
  itemHoverWidth: 180
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

  initWidget: function () {
    this.Super("initWidget", arguments);
    this.addItems(
      [
        this.content
      ]);
    if (this.valuesManager != null) {
      //      testCreateDS(this.valuesManager.dataSource.ID);
      this.dataSource = this.valuesManager.dataSource.ID;
      // TODO: Add object description in window head
      var titleDS = this.getDataSource().title;
      this.title = (titleDS ? titleDS : this.dataSource); // + isc.CBMStrings.FormWindow_Title;
    }
    this.setPosition();
  },

  // Destroy with delay (for example to let callback to do it's work)
  destroyLater: function (win, delay) {
    if (delay == 0 || delay == null) {
      delay = 100;
    }
    isc.Timer.setTimeout(win.destroy(), delay);
    // var destroyInner = function() {
    // win.destroy();
    // };
    // isc.Timer.setTimeout(destroyInner, delay);
  },
  
  // Save inner grids editings and settings
  saveInnerGridsSettings: function(){
    if (this.items[0].members[0].items) {
      // In Form window witout tabs
      var items = this.items[0].members[0].items;
      this.saveGridsInItems(items);
    } else if (this.items[0].members[0].tabs) {
      // Form with tabs - iterate by them (for 1 level till now)
      var tabs = this.items[0].members[0].tabs;
      for (var j = 0; j < tabs.length; j++)
      {
        var items = tabs[j].pane.items;
        this.saveGridsInItems(items);
      }        
    }
   },
  
  saveGridsInItems: function(items) {
    for (var i= 0; i < items.length; i++) {
      var item = items[i];
      if (/*item.kind === "BackAggregate" || item.kind === "BackLink" || item.kind === "CrossLink"
          || */item.editorType === "CollectionAggregateControl" || item.editorType === "CollectionControl"
          || item.editorType ===  "CollectionCrossControl" || item.editorType === "RelationsAggregateControl") {
        
        // In case Save or [X] pressed - save in-grid editings 
        if (item.innerGrid && item.innerGrid.grid) {
          item.innerGrid.grid.saveAllEdits();
	    }
        
        //Save ListSettings
        if (item.innerGrid.listSettingsChanged) {
          // If innerGrid.listSettings not initialized
          if (!item.innerGrid.listSettings) {
            item.innerGrid.setListSettings();
          }
          
          item.innerGrid.listSettings.Settings = item.innerGrid.grid.getViewState();
          if (item.innerGrid.listSettingsExists) {
            listSettingsRS.dataSource.updateData(item.innerGrid.listSettings);
          } else {
            listSettingsRS.dataSource.addData(item.innerGrid.listSettings);
          }
        }
      }
    }
  },
  
  
  
  onCloseClick: function () {
    this.saveInnerGridsSettings();
    this.Super("onCloseClick", arguments);
  }

});


// =======================================================================
// =============== Infrastructure-technology functions ===================
// =======================================================================

// ------- Export Concept (with it's scope) to file fore migration purposes -------
function exportConcept(concept){
}







// =======================================================================
// =======================================================================
// =======================================================================
// ================= Third-party systems comunications ===================
// =======================================================================
// =======================================================================
// =======================================================================


// ===================== Geospatial section ==============================

// -------------------------- Leaflet control  ----------------------------
// ----------------- Inner canvas for leaflet control  --------------------
isc.defineClass("LeafletCanvas", "Canvas");
isc.LeafletCanvas.addProperties({
    height: "*",
    width: "100%", // Using "*" leads to fixed this canvas and window body size of 100px (if placefd i the window directly)
  
    getInnerHTML: function () {
                      var divHtml = '<div id=leaflet_' + this.ID + ' style="height: auto; min-height: 200px; width: auto;">Place for Map</div>';
                      return divHtml;
                    },

    draw: function () {
            if (!this.readyToDraw()) return this;
            this.Super("draw", arguments);
            
            this.div = document.getElementById("leaflet_" + this.ID);
            var haha = this.height;
            this.div.style.height = haha + "px";
            
            this.mymap = L.map(this.div);
            
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 21,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiYWxleG1hdiIsImEiOiJjajJkcWNoOGcwMDNpMndudDF0M2xpaHVpIn0.iLB4oEdNFOAZPo_PVrFdfw'
            }).addTo(this.mymap);
            
            this.mymap.iscContext = this;
            
            var that = this;
            this.mymap.on('zoomend', function() {
              that.zoomEnd();
            });  
            this.mymap.on('moveend', function() {
              that.moveEnd();
            });  
             
            return this;
          },
       
    resized:  function(){
                this.Super("resized", arguments);
                if (this.div && this.div.style) {
                  var haha = this.height;
                  this.div.style.height = haha + "px";
                  var vava = this.width;
                  this.div.style.width = vava + "px";
                }
              },
              
    // Value expected to be supplied in form of object:
    // { lat:###, lng:###, zoom:###, points:[{lat:###, lng:###, descr:###}]} 
    setValue: function(val) {
                if (val){
                  this.mymap.setView([val.lat, val.lng], val.zoom);
                  if (this.marker) {
                    this.marker.remove();
                  }
                  if (val.points) {
                    for (var i = 0; i < val.points.length; i++) {
                      this.marker = L.marker([val.points[i].lat, val.points[i].lng]).addTo(this.mymap).bindPopup(val.points[i].descr).openPopup();
                    }
                  }
                } 
              }, 
              
    zoomEnd: function(){
                if (this.dataRefresh) { this.dataRefresh("zoom"); }
              },
                
    moveEnd: function(){
                if (this.dataRefresh) { this.dataRefresh("move"); }
              },
                
   
    redrawOnResize: false 
}); 

// ---------------------- Leaflet control itself ------------------------
isc.ClassFactory.defineClass("LeafletControl", isc.CanvasItem);
isc.LeafletControl.addProperties({
  shouldSaveValue: true, 
  createCanvas: function (myForm) {
                  var canv = isc.LeafletCanvas.create(); 
                  canv.myForm = myForm;
                  return canv;
                },
  // Value can be supplied in form of object:
  // { lat:###, lng:###, zoom:###, points:[{lat:###, lng:###, descr:###}]} 
  setValue: function(val) {
              if (val){
                this.canvas.setValue(val);
              } 
              else if (!this.canvas.marker) { // <<< to prevent second initialization
                // Attempt to initialize by expected fields
                var latFld = this.canvas.myForm.items.find({name:'Latitude'});
                var lngFld = this.canvas.myForm.items.find({name:'Longitude'});
                var adrFld = this.canvas.myForm.items.find({name:'Address'});
                if(latFld && lngFld) {
                  var lat = latFld.getValue();
                  var lng = lngFld.getValue();
                  if (lat && lng) {
                    this.canvas.mymap.setView([lat, lng], 16);
                    if (adrFld && adrFld.getValue()) {
                      var adr = adrFld.getValue();
                      this.canvas.marker = L.marker([lat, lng]).addTo(this.canvas.mymap).bindPopup(adr).openPopup();
                    } else {
                      this.canvas.marker = L.marker([lat, lng]).addTo(this.canvas.mymap);
                    }
                  } else {
                    var that = this;
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                          that.canvas.myForm.items.find({name:'Latitude'}).setValue(position.coords.latitude);
                          that.canvas.myForm.items.find({name:'Longitude'}).setValue(position.coords.longitude);
                          that.canvas.mymap.setView([position.coords.latitude, position.coords.longitude], 13);
                        }
                    );
                  }
                }             
              }
            },
  
  startRow:true,
  endRow: true,
  showTitle: false,
  colSpan: 6,
  rowSpan: '*',
  height: '*',
  overflow: 'hidden'
});



// ===================== Geocoding block =================================

// Yandex geocoding service request
// Returns results in expected format {lat:*, lng:*, adr:*}
function directGeocodingYandex(address, callback) {
  isc.RPCManager.sendRequest({
        data: null,
        useSimpleHttp: true,
        contentType: "text/xml",
        transport: "xmlHttpRequest",
        httpMethod: "GET",
        actionURL: "https://geocode-maps.yandex.ru/1.x/?format=json&geocode=" + address,
        callback: function(RPCResponse) {
            var resp = parseJSON(RPCResponse.data);
            var results = [];
            for (var i = 0; i < resp.response.GeoObjectCollection.featureMember.length; i++) {
              var coordsAdr = resp.response.GeoObjectCollection.featureMember[i].GeoObject.metaDataProperty.GeocoderMetaData.text;
              var pos = resp.response.GeoObjectCollection.featureMember[i].GeoObject.Point.pos;
              var coords = pos.split(' ');
              results.add({lat: coords[1], lng: coords[0], adr: coordsAdr});
            } 
            callback(results);
        }
  });
}

// Provide geocoding search by possible services, and user's choice from several results
// Expects providers to return results in array with structure: {lat:*, lng:*, adr:*}
function getGeocodingResults(address, form, callback) {
  
    // TODO: Gather results from searching by several geocoding service providers
    directGeocodingYandex(address, 
              function(results) {
                // TODO: Let user make choice if several points discovered
                // Show results in form's Map control
                // if(form) {***}
                // ***
                // Till now - returnes first result
                callback(results[0]); 
              }
    );
    
    return false;
}

// Fills form fields with result of geocoding search
// For correct work - assumed existance of fields "Address", "Latitude" and "Longitude" on form
function fillGeocoding(form, item) {
  
 
    var adrFld = form.items.find({name:'Address'});
    if (!adrFld) {
      adrFld = form.items.find({name:'Description'});
    }
    if (adrFld) {
      getGeocodingResults(adrFld.getValue(), form,
                function(result) {
                  form.items.find({name:'Latitude'}).setValue(result.lat);
                  form.items.find({name:'Longitude'}).setValue(result.lng);
                  // Set address to "Address" field only, not in case of "Description"
                  if (adrFld.name === 'Address') {
                    form.items.find({name:'Address'}).setValue(result.adr);
                  }
                  if (form.items.find({name:'Map'})) {
                    form.items.find({name:'Map'}).setValue(result);
                  }
                }
      );
    }
    return false;
}

// ================================ The End =================================
