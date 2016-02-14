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
    ColSpan: 1,
    RowSpan: 1,
    copyValue: true,
    type: "text"
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
    type: "text"
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
    optionDataSource: "null",
    valueField: "ID",
    displayField: "Description",
    pickListWidth: 400
  }, {
    name: "RelatedConcept",
    title: "RelatedConcept",
    showTitle: true,
    inList: true,
    ColSpan: 1,
    RowSpan: 1,
    copyValue: true,
    copyLinked: true,
    deleteLinked: true,
    type: "Concept",
    editorType: "LinkControl",
    optionDataSource: "null",
    valueField: "ID",
    displayField: "Description",
    pickListWidth: 400
  }, {
    name: "RelationKind",
    title: "RelationKind",
    showTitle: true,
    inList: true,
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
    ColSpan: 1,
    RowSpan: 1,
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
  }, {
    name: "ValueConstraint",
//    title: "Значение",
    // showTitle: true,
    length: 100,
    canSave: false,
    inList: true,
    ColSpan: 1,
    RowSpan: 1,
    copyValue: true,
    getFieldValue: function(record, value, field, fieldName){
    	var that = this;
    	var obj 
    	obj = getObjectByFilter("Constraint", {forRelation: record.ID, ConstraintKind: "b8055887-35c5-4ad0-9253-1cf9875023a8"}, 
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
})



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
