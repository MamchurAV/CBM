package CBMMeta;

public class MetaAttribute {
	private long ID;
	private boolean Del;
	private MetaClass InheritedFrom;
	private long RelationRole;
	
	public long getID() {
		return ID;
	}
	public void setID(long iD) {
		ID = iD;
	}
	public boolean isDel() {
		return Del;
	}
	public void setDel(boolean del) {
		Del = del;
	}
	public MetaClass getInheritedFrom() {
		return InheritedFrom;
	}
	public void setInheritedFrom(MetaClass inheritedFrom) {
		InheritedFrom = inheritedFrom;
	}
	public long getRelationRole() {
		return RelationRole;
	}
	public void setRelationRole(long relationRole) {
		RelationRole = relationRole;
	}
	
	

//	mdForSelect.columns.put("RelationRole", "r.RelationRole");
//	mdForSelect.columns.put("RelatedConcept", "r.RelatedConcept");
//	mdForSelect.columns.put("RelationKind", "r.RelationKind");
//	mdForSelect.columns.put("Domain", "r.Domain");
//	mdForSelect.columns.put("BackLinkRelation", "r.BackLinkRelation");
//	mdForSelect.columns.put("CrossConcept", "r.CrossConcept");
//	mdForSelect.columns.put("CrossRelation", "r.CrossRelation");
//	mdForSelect.columns.put("SysCode", "r.SysCode");
//	mdForSelect.columns.put("Description", "r.Description");
//	mdForSelect.columns.put("Notes", "r.Notes");
//	mdForSelect.columns.put("Odr", "r.Odr");
//	mdForSelect.columns.put("Const", "r.Const");
//	mdForSelect.columns.put("Countable", "r.Countable");
//	mdForSelect.columns.put("Historical", "r.Historical");
//	mdForSelect.columns.put("Versioned", "r.Versioned");
//	mdForSelect.columns.put("VersPart", "r.VersPart");
//	mdForSelect.columns.put("MainPartID", "r.MainPartID");
//	mdForSelect.columns.put("Root", "r.Root");
//	
//	mdForSelect.columns.put("Modified", "pa.Modified");
//	mdForSelect.columns.put("Size", "pa.Size");
//	mdForSelect.columns.put("LinkFilter", "pa.LinkFilter");
//	mdForSelect.columns.put("Mandatory", "pa.Mandatory");
//	mdForSelect.columns.put("IsPublic", "pa.IsPublic");
//	mdForSelect.columns.put("ExprEval", "pa.ExprEval");
//	mdForSelect.columns.put("ExprDefault", "pa.ExprDefault");
//	mdForSelect.columns.put("ExprValidate", "pa.ExprValidate");
//	mdForSelect.columns.put("CopyValue", "pa.CopyValue");
//	mdForSelect.columns.put("CopyLinked", "pa.CopyLinked");
//	mdForSelect.columns.put("DeleteLinked", "pa.DeleteLinked");
//	mdForSelect.columns.put("RelationStructRole", "pa.RelationStructRole");
//	mdForSelect.columns.put("Part", "pa.Part");
//	mdForSelect.columns.put("Root", "pa.Root");
//	mdForSelect.columns.put("DisplayName", "pa.DisplayName");
//	mdForSelect.columns.put("Notes", "pa.Notes");
//	mdForSelect.columns.put("DBTable", "pa.DBTable");
//	mdForSelect.columns.put("DBColumn", "pa.DBColumn");


}
