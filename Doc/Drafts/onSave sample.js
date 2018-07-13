  onSave: function (record) {
    if (record.infoState === "new" || record.infoState === "changed") {
      var currConcept = conceptRS.find("ID", record.ForConcept);
      var val = currConcept.HierCode + "," + record.ForConcept;
      if (currConcept) {

        var cretin = {
          _constructor: "AdvancedCriteria",
          operator: "and",
          criteria: [{fieldName: "HierCode", operator: "startsWith", value: val}]
        }
        var concepts = conceptRS.findAll(cretin);

        for (var i = 0; i < concepts.length; i++) {
          cretin = {
            _constructor: "AdvancedCriteria",
            operator: "and",
            criteria: [{fieldName: "SysCode", operator: "equals", value: record.SysCode},
              {fieldName: "ForConcept", operator: "equals", value: concepts[i].ID}]
          }
          var eqRelation = relationRS.find(cretin);

          if (!eqRelation /*|| record.infoState === "new"*/) {
            var ds = isc.DataSource.getDataSource("Relation");
            record.notShow = true; // <<< To mark cloned record not to be shown in context grid
            var newRecord = ds.cloneInstance(record);
            newRecord.ForConcept = concepts[i].ID;
            // newRecord.InheritedFrom = record.ForConcept;
            TransactionManager.add(newRecord, record.currentTransaction);
            newRecord.currentTransaction = record.currentTransaction;
            newRecord.store();
            if (record.notShow) {
              delete record.notShow;
            }
          } else if (record.infoState === "changed") {
            var childRecord = createFromRecord(eqRelation);
            syncronize(record, childRecord, ["ID", "Concept", "ForConcept"]);
            childRecord.currentTransaction = record.currentTransaction;
            TransactionManager.add(childRecord, record.currentTransaction);
            childRecord.store();
          }
        }
      }
    }
  },
