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
		I_IDProvider idProvider = new MySQLIDProvider(); // TODO Turn to configurable 
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
				forRootConcept = metaResponce.data.getLong("forRootConcept"); 
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
		mdForSelect.where = "c.HierCode like '" + rootHierCode + ",%' and c.del = '0'";
		
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
			Long[] conceptIDs = (Long[])childConceptIDs.toArray();
			
			for (Long childID : childClassIDs) {
				// --- Get analog Attribute of every child class ----
				mdForSelect.where = "pa.ForPrgClass=" + childID.toString() + " and r.SysCode='" + attrCode + "' and pa.del='0'";
				
				try {
					metaResponceChildAttribute = metaDB.doSelect(mdForSelect, null);
				} catch (Exception ex){ ex.printStackTrace(System.err); }
				if (metaResponceChildAttribute == null || metaResponceChildAttribute.data == null ) {
					return; 
				}
				
				if (metaResponceChildAttribute.data.next()) {
					//---- Compare and analyse attribute of current class with found child attribute
					//     Correct the last if need. --------------------------------------------------------------
					// TODO ***
				} else {
					// ---- Not exist - create new Attribute in child class
					// --- Get IDentifiers pool
					long id = idProvider.GetID(2);
					String insSql = "Insert into CBM.Relation values ("
					+ String.valueOf(id) 
					+ ",'0'," 
					+ String.valueOf(conceptIDs[iConcept]) + ","
					+ (metaResponce.data.getLong("InheritedFrom") != 0 ? String.valueOf(metaResponce.data.getLong("InheritedFrom")) : String.valueOf(forRootConcept)) + ","
					+ metaResponce.data.getLong("RelationRole") + ","
					+ metaResponce.data.getLong("RelatedConcept") + ","
					+ metaResponce.data.getLong("RelationKind") + ","
					+ metaResponce.data.getString("Domain") + ","
					+ metaResponce.data.getLong("BackLinkRelation") + ","
					+ metaResponce.data.getLong("CrossConcept") + ","
					+ metaResponce.data.getLong("CrossRelation") + ","
					+ metaResponce.data.getString("SysCode") + ","
					+ metaResponce.data.getString("Description") + ","
					+ metaResponce.data.getString("Notes") + ","
					+ metaResponce.data.getLong("Odr") + ","
					+ metaResponce.data.getString("Const") + ","
					+ metaResponce.data.getString("Countable") + ","
					+ metaResponce.data.getString("Historical") + ","
					+ metaResponce.data.getString("Versioned") + ","
					+ metaResponce.data.getString("VersPart") + ","
					+ metaResponce.data.getString("MainPartID") + ","
					+ metaResponce.data.getString("Root") + ")";
					try {
						metaDB.exequteDirectSimple(insSql);
					} catch (Exception e) {
						e.printStackTrace();
					}
					id++;
					insSql = "Insert into CBM.PrgAttribute values ("
					+ String.valueOf(id) 
					+ ",'0'," 
					+ String.valueOf(id-1) + ","
					+ String.valueOf(childID) + ","
					+ metaResponce.data.getString("Modified") + ","
					+ metaResponce.data.getLong("Size") + ","
					+ metaResponce.data.getString("LinkFilter") + ","
					+ metaResponce.data.getString("Mandatory") + ","
					+ metaResponce.data.getString("IsPublic") + ","
					+ metaResponce.data.getString("ExprEval") + ","
					+ metaResponce.data.getString("ExprDefault") + ","
					+ metaResponce.data.getString("ExprValidate") + ","
					+ metaResponce.data.getString("CopyValue") + ","
					+ metaResponce.data.getString("CopyLinked") + ","
					+ metaResponce.data.getString("DeleteLinked") + ","
					+ metaResponce.data.getString("RelationStructRole") + ","
					+ metaResponce.data.getString("Part") + ","
					+ metaResponce.data.getLong("Root") + ","
					+ metaResponce.data.getString("DisplayName") + ","
					+ metaResponce.data.getString("Notes") + ","
					+ metaResponce.data.getString("DBTable") + ","
					+ metaResponce.data.getString("DBColumn") + ")";
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
