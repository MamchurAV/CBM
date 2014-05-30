/**
 * 
 */
package CBMMeta;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//import CBMPersistence.DB2DataBase;
import CBMPersistence.I_DataBase;
import CBMPersistence.MySQLDataBase;
import CBMServer.DSRequest;
import CBMServer.DSResponce;


/**
 * @author Alexander Mamchur
 * Provide Meta-Model defined storage information (in form of Select template structure and standard Maps for Insert and Updates and List for deletes)
 */
public class StorageMetaData implements I_StorageMetaData {
	
	//static String metaDbURL;
	static Map<String, Object> selectInfo = new HashMap<String, Object>();
	static Map<String,  Map<String,String[]>> updInsInfo = new HashMap<String, Map<String,String[]>>();
	static Map<String, List<String>> delInfo = new HashMap<String, List<String>>();

	static I_DataBase metaDB = new MySQLDataBase(); // TODO Turn to configuration initialization
//	static I_DataBase metaDB = new DB2DataBase(); // TODO Turn to configuration initialization

	
	// ------------ Interface implementation -----------------------

	@Override
	public String getDataBase(DSRequest req) 
	{
		// TODO: Implement function !!!(below - mock!!!)
	//	String out = "MySQL";
	//	String out = "DB2";
		String out = "PosgreSql";
		// TODO Auto-generated method stub
		return out;
	}

	@Override
	public SelectTemplate getSelect(DSRequest req) throws SQLException 
	{
		String forView = req.dataSource;
		Date forDate = req.forDate;
		return getSelect(forView, forDate);
	}
	
	private SelectTemplate getSelect(String forView, Date forDate) throws SQLException 
	{
		SelectTemplate out = null;
		
		// ---- First search in cache
		out = (SelectTemplate)selectInfo.get(forView);
		if (out != null)
		{
			return out;
		}
		
		DSResponce metaResponce = null;
		
		SelectTemplate mdForSelect = new SelectTemplate();
		long forPrgClassId=0;
		long forViewId=0;
		/**
		 * ---- 1 - common (class-defined) Select parts -----------
		 */
		mdForSelect.from = "CBM.PrgView pv "
				+ "inner join CBM.Concept c on c.ID=pv.ForConcept "
				+ "inner join CBM.PrgClass pc on pc.ForConcept=c.ID and pc.del='0' " 
				+ "inner join CBM.PrgVersion vers on pc.PrgVersion=vers.ID and vers.Actual='1' and vers.Del='0'";
		mdForSelect.where = "pv.SysCode = '" + forView + "'  and pv.del = '0'";
		mdForSelect.orderby = "pv.ID"; // Must exist or - be an ID at least
		mdForSelect.columns = new HashMap<String,String>(7);
		mdForSelect.columns.put("IDPrgClass", "pc.ID");
		mdForSelect.columns.put("IDView", "pv.ID");  // <<< ??? Here
		mdForSelect.columns.put("ExprFrom", "pc.ExprFrom");
		mdForSelect.columns.put("ExprWhere", "pc.ExprWhere");
		mdForSelect.columns.put("ExprOrder", "pc.ExprOrder");
		mdForSelect.columns.put("ExprGroup", "pc.ExprGroup");
		mdForSelect.columns.put("ExprHaving", "pc.ExprHaving");
		
		try
		{
			metaResponce = metaDB.doSelect(mdForSelect, null);
		}
		catch (Exception ex){ ex.printStackTrace(System.err); }
		
		if (metaResponce != null && metaResponce.data != null)
		{
			out = new SelectTemplate();
			if (metaResponce.data.next()) 
			{
				forPrgClassId = metaResponce.data.getLong("IDPrgClass");
				forViewId = metaResponce.data.getLong("IDView");
				out.from = metaResponce.data.getString("ExprFrom").replaceAll("/forDate/", forDate.toString());
				out.where = metaResponce.data.getString("ExprWhere");
				out.orderby = metaResponce.data.getString("ExprOrder");
				out.groupby = metaResponce.data.getString("ExprGroup");
				out.having = metaResponce.data.getString("ExprHaving");
			}
		}
		else
		{
			return null;
		}
        
		// ---- 2 - Select columns from Attributes -------------
		mdForSelect.from = "CBM.PrgViewField pvf "
				+ "inner join CBM.Relation r on r.ID=pvf.ForRelation and r.del='0'"
				+ "inner join CBM.PrgAttribute pa on pa.ForRelation=r.ID  and pa.ForPrgClass=" + String.valueOf(forPrgClassId) + " and pa.dbcolumn is not null ";
		mdForSelect.where = "pvf.ForPrgView=" + String.valueOf(forViewId) + " and pvf.del='0'";
		mdForSelect.orderby = "pvf.Odr, r.Odr, pa.ID"; // Must exist and be an ID at least
		mdForSelect.columns = new HashMap<String,String>(3); 
		mdForSelect.columns.put("DBColumn", "pa.dbcolumn");
		mdForSelect.columns.put("SysCode", "pvf.syscode"); // Why not r.SysCode? - View may contain several fields with the same name (from diff. concepts) - but in view they must be unique!
		mdForSelect.columns.put("RelatedConcept", "r.RelatedConcept");
		try
		{
			metaResponce = metaDB.doSelect(mdForSelect, null);
		}
		catch (Exception ex){ ex.printStackTrace(System.err); }
		
		if (metaResponce != null && metaResponce.data != null)
		{
			out.columns = new HashMap<String,String>();
			String col;
			while (metaResponce.data.next()) 
			{
				col = metaResponce.data.getString("DBColumn");
				if (metaResponce.data.getString("RelatedConcept").equals("53"))
				{
					col = "(CASE WHEN " + col + "='0' then 'false' ELSE 'true' END)";
				}
				out.columns.put(metaResponce.data.getString("SysCode"), col);
			}
		}
		
		// Store loaded metadata to cache
		selectInfo.put(forView, out);		
		//---------------------------------------
		return out;
	}
	

	@Override
	public Map<String,String[]> getColumnsInfo(DSRequest req) throws SQLException 
	{
		return getColumnsInfo(req.dataSource);
	}
	
	private Map<String,String[]> getColumnsInfo(String forType) throws SQLException 
	{
		Map<String,String[]> out = null;
		
		// ---- First search in cache
		out = (Map<String,String[]>)updInsInfo.get(forType);
		if (out != null)
		{
			return out;
		}
		//---------------------------------------

		DSResponce metaResponce = null;
		
		SelectTemplate mdForSelect = new SelectTemplate();
		
		/**
		 * ---- Select from Attributes -------------
		 */
		mdForSelect.from = "CBM.PrgView pv "
				+ "inner join  CBM.PrgViewField pvf on pvf.ForPrgView=pv.ID and pvf.Del='0' "
				+ "inner join  CBM.Relation r on r.ID=pvf.ForRelation and r.Del='0' "
				+ "inner join CBM.PrgClass pc on pc.ForConcept=pv.ForConcept and pc.del='0' " 
				+ "inner join CBM.PrgVersion vers on pc.PrgVersion=vers.ID and vers.Actual='1' and vers.Del='0' "
				+ "inner join  CBM.PrgAttribute pa on pa.ForRelation=r.ID and pa.ForPrgClass=pc.ID and pa.dbtable is not null "; 
		mdForSelect.where = "pv.del='0'  and pv.syscode='" + forType + "'";
		mdForSelect.orderby = "pa.dbtable, pvf.Odr, r.Odr"; 

		mdForSelect.columns = new HashMap<String,String>(5); 
		mdForSelect.columns.put("syscode", "pvf.syscode");
		mdForSelect.columns.put("dbcolumn", "pa.dbcolumn");
		mdForSelect.columns.put("dbtable", "pa.dbtable");
		mdForSelect.columns.put("pointedclass", "r.RelatedConcept");
		mdForSelect.columns.put("versioned", "r.Versioned");
		
		try
		{
			metaResponce = metaDB.doSelect(mdForSelect, null);
		}
		catch (Exception ex){ ex.printStackTrace(System.err); }
		
		if (metaResponce != null && metaResponce.data != null)
		{
			out = new HashMap<String,String[]>();		
			while (metaResponce.data.next()) 
			{
				out.put(metaResponce.data.getString("syscode"), 
								new String[]{metaResponce.data.getString("dbcolumn").substring(metaResponce.data.getString("dbcolumn").indexOf(".") + 1),
											 metaResponce.data.getString("dbtable"),
											 metaResponce.data.getString("pointedclass"),
											 metaResponce.data.getString("versioned")
											});
			}
		}
		
		// Store loaded metadata to cache
		updInsInfo.put(forType, out);
		//---------------------------------------
		return out;
	}

	
	@Override
	public List<String> getDelete(DSRequest req) throws SQLException 
	{
		return getDelete(req.dataSource);
	}
	
	private List<String> getDelete(String forType) throws SQLException 
	{
		List<String> out = null;

		// ---- First search in cache
		out = (List<String>)delInfo.get(forType);
		if (out != null)
		{
			return out;
		}
		//---------------------------------------

		DSResponce metaResponce = null;
		
		SelectTemplate mdForSelect = new SelectTemplate();
		
		/**
		 * ---- Select from Attributes -------------
		 */
		mdForSelect.from = "CBM.PrgView pv "
				+ "inner join  CBM.PrgViewField pvf on pvf.ForPrgView=pv.ID and pvf.Del='0' "
				+ "inner join  CBM.Relation r on r.ID=pvf.ForRelation and r.Del='0' "
				+ "inner join CBM.PrgClass pc on pc.ForConcept=pv.ForConcept and pc.del='0' " 
				+ "inner join CBM.PrgVersion vers on pc.PrgVersion=vers.ID and vers.Actual='1' and vers.Del='0' "
				+ "inner join  CBM.PrgAttribute pa on pa.ForRelation=r.ID and pa.ForPrgClass=pc.ID and pa.dbtable is not null "; 
		mdForSelect.where = "pv.del='0'  and pv.syscode='" + forType + "'";
		mdForSelect.orderby = "pa.dbtable"; // Must exist and be an ID at least

		mdForSelect.columns = new HashMap<String,String>(1); 
		mdForSelect.columns.put("dbtable", "pa.dbtable");
		
		try
		{
			metaResponce = metaDB.doSelect(mdForSelect, null);
		}
		catch (Exception ex){ ex.printStackTrace(System.err); }
		
		if (metaResponce != null && metaResponce.data != null)
		{
			out = new ArrayList<String>();
			while (metaResponce.data.next()) 
			{
				out.add(metaResponce.data.getString("dbtable"));
			}
		}
		
		// Store loaded metadata to cache
		delInfo.put(forType, out);
		//---------------------------------------
		
		return out;
	}
	
	private boolean columnSync(String forTable, String forColumn, String colType){
		boolean out = true;
		// --- Try for column existence
		try{
		metaDB.exequteDirectSimple("ALTER TABLE " + forTable + " ADD " + forColumn + " " + colType);
		} 
		catch (Exception ex) {
			// --- In this case - stop exception proceeding - it's normal if column exists.
		}
	
		return out;
	}

	public boolean DBSync(String forType){
		boolean out = true;
		Map<String,String[]> colInfo = null;
		try{
		colInfo = getColumnsInfo(forType);
		}
		catch (Exception ex){
		}
		
		for (Map.Entry<String, String[]> entry : colInfo.entrySet())
		{
			String table = entry.getValue()[1];
			String col = entry.getValue()[0];
			String type = getSqlType(entry.getValue()[2]);
			
			columnSync(table, col, type);
		}
		
		return out;
	}
	
	/**
	 * Retern DBMS data type for CBM metadata data type
	 * @param metaType
	 * @return
	 */
	private String getSqlType(String metaType){
		// 	TODO: make conversion for diff. DBMS according to current metaDB
		String out = "";
		if (metaType.equals("28")) {
			out = "VARCHAR(1000)";
		} 
		else if  (metaType.equals("30")) {
			out = "VARCHAR(200)";
		}
		else if  (metaType.equals("32")) {
			out = "VARCHAR(18000)";
		}
		else if  (metaType.equals("34")) {
			out = "VARCHAR(2000000)";
		}
		
		else if  (metaType.equals("18")) {
			out = "INTEGER";
		}
		else if  (metaType.equals("24")) {
			out = "DECIMAL(45,18)";
		}
		else if  (metaType.equals("22")) {
			out = "DECIMAL(22,4)";
		}
		else if  (metaType.equals("26")) {
			out = "DECIMAL(20,2)";
		}
		
		else if  (metaType.equals("36")) {
			out = "DATE";
		}
		else if  (metaType.equals("38")) {
			out = "DATETIME";
		}
		else if  (metaType.equals("40")) {
			out = "DATETIME";
		}

		else if (metaType.equals("53")) {
			out = "CHAR(1)";
		}
		else {
			out = "BIGINT";
		}
		
		
		return out;
	}

	@Override
	public SelectTemplate getSelect(String code) throws SQLException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public MetaClass getMetaClass(String code) throws SQLException {
		// TODO Auto-generated method stub
		return null;
	}

}
