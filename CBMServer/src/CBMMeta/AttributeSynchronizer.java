/**
 * @author Alexander Mamchur
 *
 */
package CBMMeta;

import java.net.Socket;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.io.*;

import org.restlet.resource.ServerResource;
import org.restlet.Request;
import org.restlet.resource.Post;

import CBMPersistence.I_DataBase;
import CBMPersistence.MySQLDataBase;
import CBMPersistence.MySQLIDProvider;
import CBMServer.DSResponce;
import CBMServer.I_IDProvider;

/**
 * Synchronize attributes of given class with it's subclasses
 * 
 */
public class AttributeSynchronizer extends ServerResource {
	static I_DataBase metaDB = new MySQLDataBase(); // TODO Turn to
	// configuration
	// initialization
	// static I_DataBase metaDB = new DB2DataBase(); // TODO Turn to
	// configuration initialization
	Request request;

	public AttributeSynchronizer() {
		request = Request.getCurrent();
		String req = request.toString();
		req = request.getEntityAsText();
		req = req.substring(req.indexOf("=") + 1, req.length());

		try {
			AttributeSynchronize(req);
		} catch (SQLException | IOException e) {
			e.printStackTrace();
		}
	}

	@Post("json") 
	public void AttributeSynchronize(String forPrgClass) throws SQLException, IOException 
	{
		I_IDProvider idProvider = new MySQLIDProvider();
		SelectTemplate mdForSelect = new SelectTemplate();
		DSResponce metaResponce = null;
		DSResponce metaResponceChildAttribute = null;
		long forRootConcept = 0;
		String rootHierCode = "";

		// --------- Get root class data -------------
		mdForSelect.from = "CBM.Concept c "
				+ "inner join CBM.PrgClass pc on pc.ForConcept=c.ID and pc.del='0' " 
				+ "inner join CBM.PrgVersion vers on pc.PrgVersion=vers.ID and vers.Actual='1' and vers.Del='0'";
		mdForSelect.where = "pc.ID = '" + forPrgClass + "'  and c.del = '0'";
		mdForSelect.orderby = "pc.ID"; // <<< Must exist or - be an ID at least
		mdForSelect.columns = new HashMap<String,String>(2);
		mdForSelect.columns.put("HierCode", "c.HierCode");
		mdForSelect.columns.put("ConceptID", "c.ID");

		try
		{
			metaResponce = metaDB.doSelect(mdForSelect, null);
		}
		catch (Exception ex){ ex.printStackTrace(System.err); }

		if (metaResponce != null && metaResponce.data != null)
		{
			if (metaResponce.data.next()) 
			{
				rootHierCode = metaResponce.data.getString("HierCode");
				forRootConcept = metaResponce.data.getLong("ConceptID"); 
			}
		}
		else
		{
			return;
		}

		// --------------------- Get child classes ID-s ------------------------
		//		List<Long> childIDs = new ArrayList<Long>();
		Set<Long> childClassIDs = new HashSet<Long>();
		Set<Long> childConceptIDs = new HashSet<Long>();
		mdForSelect.from = "CBM.Concept c "
				+ "inner join CBM.PrgClass pc on pc.ForConcept=c.ID and pc.del='0' " 
				+ "inner join CBM.PrgVersion vers on pc.PrgVersion=vers.ID and vers.Actual='1' and vers.Del='0'";
		mdForSelect.where = "c.HierCode like '" + (rootHierCode == null ? "" :  rootHierCode) + String.valueOf(forRootConcept) + ",%' and c.del = '0'";

		mdForSelect.columns = new HashMap<String,String>(2); 
		mdForSelect.columns.put("IDConcept", "c.ID");
		mdForSelect.columns.put("IDPrgClass", "pc.ID");
		try	{
			metaResponce = metaDB.doSelect(mdForSelect, null);
		} catch (Exception ex) { ex.printStackTrace(System.err); }
		if (metaResponce != null && metaResponce.data != null )
		{
			while (metaResponce.data.next()){
				childConceptIDs.add(metaResponce.data.getLong("IDConcept"));
				childClassIDs.add(metaResponce.data.getLong("IDPrgClass"));
			}
		}

		// --------- Get relations & attributes for current class -------------
		mdForSelect.from = "CBM.PrgAttribute pa "
				+ "inner join CBM.Relation r on r.ID = pa.ForRelation and r.del='0'";
		mdForSelect.where = "pa.ForPrgClass=" + forPrgClass + " and pa.del='0'";
		mdForSelect.orderby = "r.Odr, pa.ID"; // Must exist and be an ID at least

		mdForSelect.columns = new HashMap<String,String>(37); 
		mdForSelect.columns.put("InheritedFrom", "r.InheritedFrom");
		mdForSelect.columns.put("RelationRole", "r.RelationRole");
		mdForSelect.columns.put("RelatedConcept", "r.RelatedConcept");
		mdForSelect.columns.put("RelationKind", "r.RelationKind");
		mdForSelect.columns.put("Domain", "r.Domain");
		mdForSelect.columns.put("BackLinkRelation", "r.BackLinkRelation");
		mdForSelect.columns.put("CrossConcept", "r.CrossConcept");
		mdForSelect.columns.put("CrossRelation", "r.CrossRelation");
		mdForSelect.columns.put("SysCode", "r.SysCode");
		mdForSelect.columns.put("Description", "r.Description");
		mdForSelect.columns.put("Notes", "r.Notes");
		mdForSelect.columns.put("Odr", "r.Odr");
		mdForSelect.columns.put("Const", "r.Const");
		mdForSelect.columns.put("Countable", "r.Countable");
		mdForSelect.columns.put("Historical", "r.Historical");
		mdForSelect.columns.put("Versioned", "r.Versioned");
		mdForSelect.columns.put("VersPart", "r.VersPart");
		mdForSelect.columns.put("MainPartID", "r.MainPartID");
		mdForSelect.columns.put("Root", "r.Root");

		mdForSelect.columns.put("Modified", "pa.Modified");
		mdForSelect.columns.put("Size", "pa.Size");
		mdForSelect.columns.put("LinkFilter", "pa.LinkFilter");
		mdForSelect.columns.put("Mandatory", "pa.Mandatory");
		mdForSelect.columns.put("IsPublic", "pa.IsPublic");
		mdForSelect.columns.put("ExprEval", "pa.ExprEval");
		mdForSelect.columns.put("ExprDefault", "pa.ExprDefault");
		mdForSelect.columns.put("ExprValidate", "pa.ExprValidate");
		mdForSelect.columns.put("CopyValue", "pa.CopyValue");
		mdForSelect.columns.put("CopyLinked", "pa.CopyLinked");
		mdForSelect.columns.put("DeleteLinked", "pa.DeleteLinked");
		mdForSelect.columns.put("RelationStructRole", "pa.RelationStructRole");
		mdForSelect.columns.put("Part", "pa.Part");
		mdForSelect.columns.put("Root", "pa.Root");
		mdForSelect.columns.put("DisplayName", "pa.DisplayName");
		mdForSelect.columns.put("Notes", "pa.Notes");
		mdForSelect.columns.put("DBTable", "pa.DBTable");
		mdForSelect.columns.put("DBColumn", "pa.DBColumn");

		try {
			metaResponce = metaDB.doSelect(mdForSelect, null);
		} catch (Exception ex){ ex.printStackTrace(System.err); }

		if (metaResponce == null || metaResponce.data == null ) {
			return; 
		}

		// ---- For every source Attribute - traverse all child classes, 
		//      determine adequate attribute existence, and - sync it if necessary. ---------------------------
		while (metaResponce.data.next()) 
		{
			String attrCode = metaResponce.data.getString("SysCode");
			int iConcept = 0;
			Object[] conceptIDs = childConceptIDs.toArray();

			for (Long childID : childClassIDs) {
				// --- Get analog Attribute of every child class ----
				mdForSelect.where = "pa.ForPrgClass=" + childID.toString() + " and r.SysCode='" + attrCode + "' and pa.del='0'";
				mdForSelect.columns.put("ID", "r.ID");                   // ???? map capacity - OK?
				mdForSelect.columns.put("PrgAttributeID", "pa.ID"); 

				try {
					metaResponceChildAttribute = metaDB.doSelect(mdForSelect, null);
				} catch (Exception ex){ ex.printStackTrace(System.err); }
				if (metaResponceChildAttribute == null || metaResponceChildAttribute.data == null ) {
					return; 
				}

				if (metaResponceChildAttribute.data.next()) {
					//---- Compare and analyse attribute of current class with found child attribute
					//     Correct the last if need. --------------------------------------------------------------
					if (metaResponceChildAttribute.data.getString("Modified").equals("0")) {
						if (metaResponceChildAttribute.data.getLong("InheritedFrom") != metaResponce.data.getLong("InheritedFrom")
								|| metaResponceChildAttribute.data.getLong("RelationRole") != metaResponce.data.getLong("RelationRole")
								|| metaResponceChildAttribute.data.getLong("RelatedConcept") != metaResponce.data.getLong("RelatedConcept")
								|| metaResponceChildAttribute.data.getLong("RelationKind") != metaResponce.data.getLong("RelationKind")
								|| !metaResponceChildAttribute.data.getString("Domain").equals(metaResponce.data.getString("Domain"))
								|| metaResponceChildAttribute.data.getLong("BackLinkRelation") != metaResponce.data.getLong("BackLinkRelation")
								|| metaResponceChildAttribute.data.getLong("CrossConcept") != metaResponce.data.getLong("CrossConcept")
								|| metaResponceChildAttribute.data.getLong("CrossRelation") != metaResponce.data.getLong("CrossRelation")
								|| !metaResponceChildAttribute.data.getString("SysCode").equals(metaResponce.data.getString("SysCode"))
								|| !metaResponceChildAttribute.data.getString("Description").equals(metaResponce.data.getString("Description"))
								|| !metaResponceChildAttribute.data.getString("Notes").equals(metaResponce.data.getString("Notes"))
								|| metaResponceChildAttribute.data.getInt("Odr") != metaResponce.data.getInt("Odr")
								|| !metaResponceChildAttribute.data.getString("Const").equals(metaResponce.data.getString("Const"))
								|| !metaResponceChildAttribute.data.getString("Countable").equals(metaResponce.data.getString("Countable"))
								|| !metaResponceChildAttribute.data.getString("Historical").equals(metaResponce.data.getString("Historical"))
								|| !metaResponceChildAttribute.data.getString("Versioned").equals(metaResponce.data.getString("Versioned"))
								|| !metaResponceChildAttribute.data.getString("VersPart").equals(metaResponce.data.getString("VersPart"))
								|| !metaResponceChildAttribute.data.getString("MainPartID").equals(metaResponce.data.getString("MainPartID"))
								|| metaResponceChildAttribute.data.getLong("Root") != metaResponce.data.getLong("Root")
								)
						{
							String updSql = "Update CBM.Relation set "
									+ "InheritedFrom=" + String.valueOf(metaResponce.data.getLong("InheritedFrom")) 
									+ ", RelationRole=" + String.valueOf(metaResponce.data.getLong("RelationRole"))
									+ ", RelatedConcept=" + String.valueOf(metaResponce.data.getLong("RelatedConcept"))
									+ ", RelationKind=" + String.valueOf(metaResponce.data.getLong("RelationKind"))
									+ ", Domain=" + String.valueOf(metaResponce.data.getString("Domain"))
									+ ", BackLinkRelation=" + String.valueOf(metaResponce.data.getLong("BackLinkRelation"))
									+ ", CrossConcept=" + String.valueOf(metaResponce.data.getLong("CrossConcept"))
									+ ", CrossRelation=" + String.valueOf(metaResponce.data.getLong("CrossRelation"))
									+ ", SysCode=" + String.valueOf(metaResponce.data.getString("SysCode"))
									+ ", Description=" + String.valueOf(metaResponce.data.getString("Description"))
									+ ", Notes=" + String.valueOf(metaResponce.data.getString("Notes"))
									+ ", Odr=" + String.valueOf(metaResponce.data.getInt("Odr"))
									+ ", Const=" + String.valueOf(metaResponce.data.getString("Const"))
									+ ", Countable=" + String.valueOf(metaResponce.data.getString("Countable"))
									+ ", Historical=" + String.valueOf(metaResponce.data.getString("Historical"))
									+ ", Versioned=" + String.valueOf(metaResponce.data.getString("Versioned"))
									+ ", VersPart=" + String.valueOf(metaResponce.data.getString("VersPart"))
									+ ", MainPartID=" + String.valueOf(metaResponce.data.getString("MainPartID"))
									+ ", Root=" + String.valueOf(metaResponce.data.getLong("Root")) + " where ID = " +  metaResponceChildAttribute.data.getLong("ID");
							try {
								metaDB.exequteDirectSimple(updSql);
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
						if (metaResponceChildAttribute.data.getInt("Size") != metaResponce.data.getInt("Size")
								|| !metaResponceChildAttribute.data.getString("LinkFilter").equals(metaResponce.data.getString("LinkFilter"))
								|| !metaResponceChildAttribute.data.getString("Mandatory").equals(metaResponce.data.getString("Mandatory"))
								|| !metaResponceChildAttribute.data.getString("IsPublic").equals(metaResponce.data.getString("IsPublic"))
								|| !metaResponceChildAttribute.data.getString("ExprEval").equals(metaResponce.data.getString("ExprEval"))
								|| !metaResponceChildAttribute.data.getString("ExprDefault").equals(metaResponce.data.getString("ExprDefault"))
								|| !metaResponceChildAttribute.data.getString("ExprValidate").equals(metaResponce.data.getString("ExprValidate"))
								|| !metaResponceChildAttribute.data.getString("CopyValue").equals(metaResponce.data.getString("CopyValue"))
								|| !metaResponceChildAttribute.data.getString("CopyLinked").equals(metaResponce.data.getString("CopyLinked"))
								|| !metaResponceChildAttribute.data.getString("DeleteLinked").equals(metaResponce.data.getString("DeleteLinked"))
								|| !metaResponceChildAttribute.data.getString("RelationStructRole").equals(metaResponce.data.getString("RelationStructRole"))
								|| !metaResponceChildAttribute.data.getString("Part").equals(metaResponce.data.getString("Part"))
								|| metaResponceChildAttribute.data.getLong("Root") != metaResponce.data.getLong("Root")
								|| !metaResponceChildAttribute.data.getString("DisplayName").equals(metaResponce.data.getString("DisplayName"))
								|| !metaResponceChildAttribute.data.getString("Notes").equals(metaResponce.data.getString("Notes"))
								|| !metaResponceChildAttribute.data.getString("DBTable").equals(metaResponce.data.getString("DBTable"))
								|| !metaResponceChildAttribute.data.getString("DBColumn").equals(metaResponce.data.getString("DBColumn"))
								)
						{
							String updSql = "Update CBM.PrgAttribute set "
									+ ", Size=" + String.valueOf(metaResponce.data.getInt("Size"))
									+ ", LinkFilter='" + metaResponce.data.getString("LinkFilter")
									+ "', Mandatory='" + metaResponce.data.getString("Mandatory")
									+ "', IsPublic='" + metaResponce.data.getString("IsPublic")
									+ "', ExprEval='" + metaResponce.data.getString("ExprEval")
									+ "', ExprDefault='" + metaResponce.data.getString("ExprDefault")
									+ "', ExprValidate='" + metaResponce.data.getString("ExprValidate")
									+ "', CopyValue='" + metaResponce.data.getString("CopyValue")
									+ "', CopyLinked='" + metaResponce.data.getString("CopyLinked")
									+ "', DeleteLinked='" + metaResponce.data.getString("DeleteLinked")
									+ "', RelationStructRole='" + metaResponce.data.getString("RelationStructRole")
									+ "', Part='" + metaResponce.data.getString("Part")
									+ "', Root=" + String.valueOf(metaResponce.data.getLong("Root"))
									+ ", DisplayName='" + metaResponce.data.getString("DisplayName")
									+ "', Notes='" + metaResponce.data.getString("Notes")
									+ "', DBTable='" + metaResponce.data.getString("DBTable")
									+ "', DBColumn='" + metaResponce.data.getString("DBColumn") + "' where ID = " +  metaResponceChildAttribute.data.getLong("PrgAttributeID");
							try {
								metaDB.exequteDirectSimple(updSql);
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
					}
				} else {
					// ---- Not exist - create new Attribute in child class
					// --- Get IDentifiers pool
					long id = idProvider.GetID(2);
					String insSql = "Insert into CBM.Relation (ID,Del,ForConcept,InheritedFrom,RelationRole,RelatedConcept,RelationKind,Domain," 
					+ "BackLinkRelation,CrossConcept,CrossRelation,SysCode,Description,Notes,Odr,Const,Countable,Historical,Versioned,VersPart,MainPartID,Root) " 
							+ " values ("
							+ String.valueOf(id) 
							+ ",'0'," 
							+ String.valueOf(conceptIDs[iConcept]) + ","
							+ (metaResponce.data.getLong("InheritedFrom") != 0 ? String.valueOf(metaResponce.data.getLong("InheritedFrom")) : String.valueOf(forRootConcept)) + ","
							+ metaResponce.data.getLong("RelationRole") + ","
							+ metaResponce.data.getLong("RelatedConcept") + ","
							+ metaResponce.data.getLong("RelationKind") + ",'"
							+ metaResponce.data.getString("Domain") + "',"
							+ metaResponce.data.getLong("BackLinkRelation") + ","
							+ metaResponce.data.getLong("CrossConcept") + ","
							+ metaResponce.data.getLong("CrossRelation") + ",'"
							+ metaResponce.data.getString("SysCode") + "','"
							+ metaResponce.data.getString("Description") + "','"
							+ metaResponce.data.getString("Notes") + "',"
							+ metaResponce.data.getInt("Odr") + ",'"
							+ metaResponce.data.getString("Const") + "','"
							+ metaResponce.data.getString("Countable") + "','"
							+ metaResponce.data.getString("Historical") + "','"
							+ metaResponce.data.getString("Versioned") + "','"
							+ metaResponce.data.getString("VersPart") + "','"
							+ metaResponce.data.getString("MainPartID") + "',"
							+ metaResponce.data.getLong("Root") + ")";
					try {
						metaDB.exequteDirectSimple(insSql);
					} catch (Exception e) {
						e.printStackTrace();
					}
					id++;
					insSql = "Insert into CBM.PrgAttribute (ID,Del,ForRelation,ForPrgClass,Modified,Size,LinkFilter,Mandatory,IsPublic,ExprEval,ExprDefault,ExprValidate, " 
					+ "CopyValue,CopyLinked,DeleteLinked,RelationStructRole,Part,Root,DisplayName,Notes,DBTable,DBColumn) values ("
							+ String.valueOf(id) 
							+ ",'0'," 
							+ String.valueOf(id-1) + ","
							+ String.valueOf(childID) + ","
							+ "'0',"
							+ metaResponce.data.getInt("Size") + ",'"
							+ metaResponce.data.getString("LinkFilter") + "','"
							+ metaResponce.data.getString("Mandatory") + "','"
							+ metaResponce.data.getString("IsPublic") + "','"
							+ metaResponce.data.getString("ExprEval") + "','"
							+ metaResponce.data.getString("ExprDefault") + "','"
							+ metaResponce.data.getString("ExprValidate") + "','"
							+ metaResponce.data.getString("CopyValue") + "','"
							+ metaResponce.data.getString("CopyLinked") + "','"
							+ metaResponce.data.getString("DeleteLinked") + "','"
							+ metaResponce.data.getString("RelationStructRole") + "','"
							+ metaResponce.data.getString("Part") + "',"
							+ metaResponce.data.getLong("Root") + ",'"
							+ metaResponce.data.getString("DisplayName") + "','"
							+ metaResponce.data.getString("Notes") + "','"
							+ metaResponce.data.getString("DBTable") + "','"
							+ metaResponce.data.getString("DBColumn") + "')";
					try {
						metaDB.exequteDirectSimple(insSql);
					} catch (Exception e) {
						e.printStackTrace();
					}
				}

				iConcept++;
			}
		}

	}
}
