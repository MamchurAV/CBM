/**
 * @author Alexander Mamchur
 *
 */
package CBMMeta;

import java.sql.SQLException;
import java.util.HashMap;
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
 * Generation of specific for Isomorphic SmartClient client-side metadata ("DataSource") from CBM metadata 
 *
 */
public class PrgViewGenerator  extends ServerResource {
	static I_DataBase metaDB = new MySQLDataBase(); // TODO Turn to configuration initialization
//	static I_DataBase metaDB = new DB2DataBase(); // TODO Turn to configuration initialization
	Request request;
	public PrgViewGenerator() 
	{
		request = Request.getCurrent();
		String req = request.toString();
		req = request.getEntityAsText();
		req = req.substring( req.indexOf("=")+1, req.length());
		
        try 
        {
        	generateDefaultView(req);
		} 
        catch (SQLException | IOException e) {
			e.printStackTrace();
		}
	}


	@Post("json") 
	public void generateDefaultView(String forType) throws SQLException, IOException 
	{
		SelectTemplate mdForSelect = new SelectTemplate();
		DSResponce metaResponce = null;
		long forConceptId = 0;
		long forPrgClassId = 0;
		String description = null;
		String notes = null;
		String insString = null;
		long idFirst = 0;
		int i = 0;
		I_IDProvider idProvider = new MySQLIDProvider(); // TODO Turn to configurable 
		String controlType = null;
		String dataSourceView = null;
		long relationKind = 0;

		 // ---- PrgView -------------
		mdForSelect.from = "CBM.Concept c "
				+ "inner join CBM.PrgClass pc on pc.ForConcept=c.ID and pc.del='0' " 
				+ "inner join CBM.PrgVersion vers on pc.PrgVersion=vers.ID and vers.Actual='1' and vers.Del='0'";
		mdForSelect.where = "c.SysCode = '" + forType + "'  and c.del = '0'";
		
		mdForSelect.columns = new HashMap<String,String>(4); 
		mdForSelect.columns.put("IDPrgClass", "pc.ID");
		mdForSelect.columns.put("IDConcept", "c.ID");
		mdForSelect.columns.put("Description", "pc.Description");
		mdForSelect.columns.put("Notes", "pc.Notes");
		
		try	{
			metaResponce = metaDB.doSelect(mdForSelect, null);
		}
		catch (Exception ex){ ex.printStackTrace(System.err); }
		
		if (metaResponce != null && metaResponce.data != null )
		{
			metaResponce.data.next();
			forPrgClassId = metaResponce.data.getLong("IDPrgClass");
			forConceptId = metaResponce.data.getLong("IDConcept");
			description = metaResponce.data.getString("Description");
			notes = metaResponce.data.getString("Notes");
			
			//--- Predictable Select for fields count - to simplify ID retrieval.
			mdForSelect.from = "CBM.Relation r "
					+ "inner join CBM.Concept c on c.ID=r.RelatedConcept and c.del='0'"
					+ "inner join CBM.PrgAttribute pa on pa.ForRelation=r.ID  and pa.ForPrgClass=" + String.valueOf(forPrgClassId) + " and pa.dbcolumn is not null "
					+ "inner join CBM.RelationKind rkind on rkind.ID = r.RelationKind";
			mdForSelect.where = "r.ForConcept=" + String.valueOf(forConceptId) + " and r.del='0'";
			mdForSelect.orderby = "r.Odr, pa.ID"; // Must exist and be an ID at least
			
			mdForSelect.columns = new HashMap<String,String>(1); 
			mdForSelect.columns.put("Count", "count(*)");
			
			try	{
				metaResponce = metaDB.doSelect(mdForSelect, null);
			}
			catch (Exception ex){ ex.printStackTrace(System.err); }
			
			if (metaResponce != null && metaResponce.data != null )
			{
				metaResponce.data.next();
				i = metaResponce.data.getInt("Count");
			}
			// --- Get IDentifiers pool
			idFirst = idProvider.GetID(i+1);
			
			// --- Insertion of Prg View record
			try {
				metaDB.doStartTrans();
				
				metaDB.exequteDirectSimple("INSERT INTO CBM.PrgView (ID, Del, UID, ForConcept, SysCode, Description, Notes) " +
						"VALUES (" + String.valueOf(idFirst) + ", '0', '" + String.valueOf(java.util.UUID.randomUUID()) + "', " + String.valueOf(forConceptId) + ", '" + forType + "', '" + description + "', '" + notes + "' )" 
						);
			}
			catch (Exception ex){ ex.printStackTrace(System.err); }
			
			 // ---- PrgView Fields -------------
			mdForSelect.from = "CBM.Relation r "
					+ " inner join CBM.Concept c on c.ID=r.RelatedConcept and c.del='0' "
					+ " inner join CBM.PrgAttribute pa on pa.ForRelation=r.ID  and pa.ForPrgClass=" + String.valueOf(forPrgClassId) + " and pa.dbcolumn is not null "
					+ " inner join CBM.RelationKind rkind on rkind.ID = r.RelationKind "
					+ " inner join CBM.Concept rc on rc.ID = r.RelatedConcept";
			mdForSelect.where = "r.ForConcept=" + String.valueOf(forConceptId) + " and r.del='0'";
			mdForSelect.orderby = "r.Odr, pa.ID"; // Must exist and be an ID at least
			
			mdForSelect.columns = new HashMap<String,String>(7); 
			mdForSelect.columns.put("SysCode", "r.SysCode");
			mdForSelect.columns.put("Title", "pa.DisplayName");
			mdForSelect.columns.put("ForRelation", "r.ID");
			mdForSelect.columns.put("Odr", "r.Odr");
			mdForSelect.columns.put("ControlType", "r.RelationKind");
			mdForSelect.columns.put("Hint", "pa.Notes");
			mdForSelect.columns.put("DataSourceView", "rc.SysCode");

			try
			{
				metaResponce = metaDB.doSelect(mdForSelect, null);
			}
			catch (Exception ex){ ex.printStackTrace(System.err); }
			
			if (metaResponce != null && metaResponce.data != null)
			{
				i = 0;
				while (metaResponce.data.next()) 
				{
					i++;
					
					relationKind = metaResponce.data.getLong("ControlType");
					if (relationKind == 151) {  // many-to-one
						controlType = "'combobox'"; 
					} else if (relationKind == 152 ) { // one-to-many 
						controlType = "'backLink'"; 
					} else if (relationKind == 2342) { // many-to-many 
						controlType = "'backLink'"; 
					} else if (relationKind == 2341 || relationKind == 153) { // Aggregate
						controlType = "null";
					} else if (relationKind == 150) { // Value 
						controlType = "null";
					}
					
					if (relationKind == 150 ) {
						dataSourceView = "null, ";
					} else {
						dataSourceView = metaResponce.data.getString("DataSourceView");
					}
							
					insString = String.valueOf(idFirst + i) + ", '0', '" 
							+ metaResponce.data.getString("SysCode") + "', '"
							+ metaResponce.data.getString("Title") + "', "
							+ String.valueOf(idFirst) + ", "
							+ String.valueOf(metaResponce.data.getLong("ForRelation")) + ", " 
							+ String.valueOf(metaResponce.data.getInt("Odr")) + ", "
							+ "null, " 
							+ "'0', "
							+ "'0', " 
							+ "'0', " 
							+ "'1', " 
							+ controlType + ", "   
							+ "'1', " 
							+ "'1', '" 
							+ metaResponce.data.getString("Hint") + "', '"
							+ dataSourceView + "', " 
							+ "'ID', " 
							+ "'SysCode', " 
							+ (relationKind == 151 ? "500, " : "null, ") 
							+ "null"; 
					
					// --- PrgViewField insertion
					try {
						metaDB.exequteDirectSimple("INSERT INTO CBM.PrgViewField (ID, Del, SysCode, Title, ForPrgView, ForRelation, Odr, UIPath, Mandatory, Hidden, ViewOnly, InList, ControlType, ShowTitle, Editable, Hint, DataSourceView, ValueField, DisplayField, PickListWidth, CreateFromMethods) " +
								"VALUES (" + insString + " )" 
								);
						
						metaDB.doCommit();
					}
					catch (Exception ex){ ex.printStackTrace(System.err); }

				}
			}
		}
		
		/**
		 * ---- The End -----------
		 */
	}

}
