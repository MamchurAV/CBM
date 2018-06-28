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

import CBMPersistence.DB2DataBase;
import CBMPersistence.I_DataBase;
import CBMPersistence.MSSqlDataBase;
import CBMPersistence.MySQLDataBase;
import CBMPersistence.PostgreSqlDataBase;
import CBMServer.CBMStart;
import CBMServer.DSRequest;
import CBMServer.DSResponse;

/**
 * @author Alexander Mamchur Provide Meta-Model defined storage information (in
 *         form of Select template structure and standard Maps for Insert and
 *         Updates and List for deletes)
 */
public class StorageMetaData implements I_StorageMetaData {
	static Map<String, Object> selectInfo = new HashMap<String, Object>();
	static Map<String, Map<String, String[]>> updInsInfo = new HashMap<String, Map<String, String[]>>();
	static Map<String, List<String>> delInfo = new HashMap<String, List<String>>();
	static I_DataBase metaDB;

	public StorageMetaData() {
		String dbType = CBMStart.getParam("primaryDBType");
		String dbUrl = CBMStart.getParam("primaryDBUrl");
		String dbUs = CBMStart.getParam("primaryDBUs");
		String dbCred = CBMStart.getParam("primaryDBCred");
		switch (dbType) {
		case "PostgreSql":
			metaDB = new PostgreSqlDataBase();
			break;
		case "MySQL":
			metaDB = new MySQLDataBase();
			break;
		case "DB2":
			metaDB = new DB2DataBase();
			break;
		case "MSSQL":
			metaDB = new MSSqlDataBase();
			break;
		}
	}

	// ------------ Interface implementation -----------------------

	// --- Returns DB specified for current request
	// TODO - !!! get DB name from Request to provide
	@Override
	public String getDataBase(DSRequest req) {
		// TODO: Implement function !!!(below - mock!!!)
		String out = CBMStart.getParam("primaryDBType");
		// String out = "DB2";
		// String out = "MySQL";
		// String out = "PostgreSql";
		// String out = "MSSQL";

		return out;
	}

	/**
	 * Provide information used for Select query
	 */
	@Override
	public SelectTemplate getSelect(DSRequest req) throws SQLException {
		String forView = req.dataSource;
		Date forDate = req.data.clientData.currDate;
		String forUser = req.data.clientData.currUser;
		return getSelect(forView, forDate, forUser);
	}

	private SelectTemplate getSelect(String forView, Date forDate, String forUser) throws SQLException {
		SelectTemplate out = null;

		// ---- Try get from cache
		out = (SelectTemplate) selectInfo.get(forView);
		if (out != null) {
			return out;
		}

		DSResponse metaResponse = null;

		SelectTemplate mdForSelect = new SelectTemplate();
		String forConceptId = "";
		String forViewId = "";

		// ------ Get common part of query for requested View from MetaData
		// -----------
		mdForSelect.from = "CBM.PrgView pv " + "inner join CBM.Concept c on c.id=pv.ForConcept and c.del='0'";
		mdForSelect.where = "pv.SysCode = '" + forView + "' and pv.del='0' and pv.actual = '1'";
		mdForSelect.orderby = "pv.ID"; // Must exist or - be an ID at least
		mdForSelect.columns = new ArrayList<ColumnInfo>(6);
		mdForSelect.columns.add(new ColumnInfo("IDView", "CBM.PrgView", "pv.ID", "String"));
		mdForSelect.columns.add(new ColumnInfo("ExprFrom", "CBM.Concept", "c.ExprFrom", "String"));
		mdForSelect.columns.add(new ColumnInfo("ExprWhere", "CBM.Concept", "c.ExprWhere", "String"));
		mdForSelect.columns.add(new ColumnInfo("ExprOrder", "CBM.Concept", "c.ExprOrder", "String"));
		mdForSelect.columns.add(new ColumnInfo("ExprGroup", "CBM.Concept", "c.ExprGroup", "String"));
		mdForSelect.columns.add(new ColumnInfo("ExprHaving", "CBM.Concept", "c.ExprHaving", "String"));

		try {
			metaResponse = metaDB.doSelect(mdForSelect, null);
		} catch (Exception ex) {
			ex.printStackTrace(System.err);
		}

		if (metaResponse != null && metaResponse.data != null) {
			out = new SelectTemplate();
			if (metaResponse.data.next()) {
				// forConceptId = metaResponse.data.getString("IDConcept");
				forViewId = metaResponse.data.getString("IDView");

				out.from = metaResponse.data.getString("ExprFrom").replaceAll("/forDate/", forDate.toString())
						.replaceAll("/forUser/", forUser);
				out.where = metaResponse.data.getString("ExprWhere");
				out.orderby = metaResponse.data.getString("ExprOrder");
				out.groupby = metaResponse.data.getString("ExprGroup");
				out.having = metaResponse.data.getString("ExprHaving");
			}
		} else {
			metaResponse.releaseDB();
			return null;
		}
		metaResponse.releaseDB();

		// ---- Get columns part of query from MetaData -------------
		mdForSelect.from = "CBM.PrgViewField pvf "
				+ "inner join CBM.Relation r on r.id=pvf.ForRelation and r.dbcolumn is not null "
				+ "inner join  CBM.Concept c on c.ID=r.RelatedConcept ";
		mdForSelect.where = "pvf.ForPrgView='" + forViewId + "' and pvf.del='0'";
		mdForSelect.orderby = "pvf.Odr, r.ID"; // Must exist and be an ID at
												// least
		mdForSelect.columns = new ArrayList<ColumnInfo>(4);
		mdForSelect.columns.add(new ColumnInfo("SysCode", "CBM.PrgViewField", "pvf.syscode", "String"));
		mdForSelect.columns.add(new ColumnInfo("DBTable", "CBM.Relation", "r.dbtable", "String"));
		mdForSelect.columns.add(new ColumnInfo("DBColumn", "CBM.Relation", "r.dbcolumn", "String"));
		mdForSelect.columns.add(new ColumnInfo("RelatedConcept", "CBM.Concept", "c.SysCode", "String"));
		try {
			metaResponse = metaDB.doSelect(mdForSelect, null);
		} catch (Exception ex) {
			ex.printStackTrace(System.err);
		}

		if (metaResponse != null && metaResponse.data != null) {
			out.columns = new ArrayList<ColumnInfo>();
			String col;
			String relatedConcept;
			while (metaResponse.data.next()) {
				col = metaResponse.data.getString("DBColumn");
				relatedConcept = metaResponse.data.getString("RelatedConcept");
				if (relatedConcept.equals("Boolean")) {
					col = "(CASE WHEN " + col + "='0' then 'false' ELSE 'true' END)";
				}
				out.columns.add(new ColumnInfo(metaResponse.data.getString("SysCode"),
						metaResponse.data.getString("DBTable"), col, relatedConcept));
			}
		}
		metaResponse.releaseDB();

		// Store loaded metadata to cache
		selectInfo.put(forView, out);
		// ---------------------------------------
		return out;
	}

	/**
	 * Provide information used for Insert or Update operation
	 */
	@Override
	public Map<String, String[]> getColumnsInfo(DSRequest req) throws SQLException {
		return getColumnsInfo(req.dataSource);
	}

	private Map<String, String[]> getColumnsInfo(String forType) throws SQLException {
		Map<String, String[]> out = null;

		// ---- First search in cache
		out = (Map<String, String[]>) updInsInfo.get(forType);
		if (out != null) {
			return out;
		}
		// ---- If changes provided to MetaData concepts - drop Metadata for
		// that concept
		// TODO debug this part - as below it causes "No metadata for <> found. "
		if (forType.equals("Concept") || forType.equals("Relation") || forType.equals("PrgView") || forType.equals("PrgViewField")) {
			// selectInfo.remove(forType);
			// updInsInfo.remove(forType);
			// delInfo.remove(forType);
			selectInfo.clear();
			updInsInfo.clear();
			delInfo.clear();
		}

		DSResponse metaResponse = null;
		SelectTemplate mdForSelect = new SelectTemplate();

		// ---- Get Tables and Columns updated info from Relations storage info
		// in MetaData -------------
		mdForSelect.from = "CBM.PrgView pv "
				+ "inner join  CBM.PrgViewField pvf on pvf.ForPrgView=pv.ID and pvf.Del='0' "
				+ "inner join  CBM.Relation r on r.ID=pvf.ForRelation and r.Del='0' and r.dbtable is not null and r.dbcolumn is not null "
				+ "inner join  CBM.Concept c on c.ID=r.RelatedConcept ";
		mdForSelect.where = "pv.syscode='" + forType + "' and pv.del='0' and pv.actual = '1' "
				+ " and pvf.viewonly = '0'";
		mdForSelect.orderby = "r.Odr, r.dbtable, pvf.Odr";

		mdForSelect.columns = new ArrayList<ColumnInfo>(5);
		mdForSelect.columns.add(new ColumnInfo("syscode", "CBM.PrgViewField", "pvf.syscode", "String"));
		mdForSelect.columns.add(new ColumnInfo("dbtable", "CBM.Relation", "r.dbtable", "String"));
		mdForSelect.columns.add(new ColumnInfo("dbcolumn", "CBM.Relation", "r.dbcolumn", "String"));
		mdForSelect.columns.add(new ColumnInfo("pointedclass", "CBM.Concept", "c.SysCode", "String"));
		mdForSelect.columns.add(new ColumnInfo("versioned", "CBM.Relation", "r.Versioned", "Boolean"));

		try {
			metaResponse = metaDB.doSelect(mdForSelect, null);
		} catch (Exception ex) {
			ex.printStackTrace(System.err);
		}

		if (metaResponse != null && metaResponse.data != null) {
			out = new HashMap<String, String[]>();
			while (metaResponse.data.next()) {
				out.put(metaResponse.data.getString("syscode"),
						new String[] {
								metaResponse.data.getString("dbcolumn")
										.substring(metaResponse.data.getString("dbcolumn").indexOf(".") + 1),
								metaResponse.data.getString("dbtable"), metaResponse.data.getString("pointedclass"),
								metaResponse.data.getString("versioned") });
			}
		}
		metaResponse.releaseDB();

		// Store loaded metadata to cache
		updInsInfo.put(forType, out);
		// ---------------------------------------
		return out;
	}

	/**
	 * Provide information used for Delete operation
	 */
	@Override
	public List<String> getDelete(DSRequest req) throws SQLException {
		return getDelete(req.dataSource);
	}

	private List<String> getDelete(String forType) throws SQLException {
		List<String> out = null;

		// ---- First search in cache
		out = (List<String>) delInfo.get(forType);
		if (out != null) {
			return out;
		}
		// ---------------------------------------

		DSResponse metaResponse = null;

		SelectTemplate mdForSelect = new SelectTemplate();

		// ---- Select Tables participated in deletion info from Relations
		// storage info in MetaData -------------
		mdForSelect.from = "CBM.PrgView pv "
				+ "inner join  CBM.PrgViewField pvf on pvf.ForPrgView=pv.ID and pvf.Del='0' "
				+ "inner join  CBM.Relation r on r.ID=pvf.ForRelation and r.Del='0' and r.dbtable is not null and r.dbcolumn is not null ";
		mdForSelect.where = "pv.syscode='" + forType + "' and pv.del='0' and pv.actual = '1' ";
		mdForSelect.groupby = "r.dbtable";
		mdForSelect.orderby = "r.dbtable";

		mdForSelect.columns = new ArrayList<ColumnInfo>(1);
		mdForSelect.columns.add(new ColumnInfo("dbtable", "CBM.Relation", "r.dbtable", "String"));

		try {
			metaResponse = metaDB.doSelect(mdForSelect, null);
		} catch (Exception ex) {
			ex.printStackTrace(System.err);
		}

		if (metaResponse != null && metaResponse.data != null) {
			out = new ArrayList<String>();
			while (metaResponse.data.next()) {
				if (!out.contains(metaResponse.data.getString("dbtable").toLowerCase())) {
					out.add(metaResponse.data.getString("dbtable").toLowerCase());
				}
			}
		}
		metaResponse.releaseDB();

		// Store loaded metadata to cache
		delInfo.put(forType, out);
		// ---------------------------------------

		return out;
	}

	/**
	 * Retern DBMS data type for CBM metadata data type
	 * 
	 * @param metaType
	 * @return
	 */
	private String getSqlType(String metaType) {
		// TODO: make conversion for diff. DBMS according to current metaDB
		String out = "";
		if (metaType.equals("StandardString") || metaType.equals("StandardMlString")) {
			out = "VARCHAR(1000)";
		} else if (metaType.equals("ShortString") || metaType.equals("ShortMlString")) {
			out = "VARCHAR(200)";
		} else if (metaType.equals("LongString") || metaType.equals("LongMlString")) {
			out = "VARCHAR(18000)";
		} else if (metaType.equals("Text")) {
			out = "VARCHAR(2000000)";
		}

		else if (metaType.equals("Integer")) {
			out = "INTEGER";
		} else if (metaType.equals("BigDecimal")) {
			out = "DECIMAL(45,18)";
		} else if (metaType.equals("Decimal")) {
			out = "DECIMAL(22,4)";
		} else if (metaType.equals("Money")) {
			out = "DECIMAL(20,2)";
		}

		else if (metaType.equals("Date")) {
			out = "DATE";
		} else if (metaType.equals("DateTime")) {
			out = "DATETIME";
		} else if (metaType.equals("TimePrecize")) {
			out = "DATETIME";
		}

		else if (metaType.equals("Boolean")) {
			out = "CHAR(1)";
		} else {
			out = "BIGINT";
		}
		return out;
	}

	@Override
	public SelectTemplate getSelect(String code) throws SQLException {
		// TODO Auto-generated method stub
		return null;
	}

	// @Override
	// public MetaClass getMetaClass(String code) throws SQLException {
	// // TODO Auto-generated method stub
	// return null;
	// }

	/**
	 * Synchronize DB to MetaData storage info
	 */
	private boolean columnSync(String forTable, String forColumn, String colType) {
		boolean out = true;
		// --- Try for column existence
		try {
			metaDB.exequteDirectSimple("ALTER TABLE " + forTable + " ADD " + forColumn + " " + colType);
		} catch (Exception ex) {
			// --- In this case - stop exception proceeding - it's normal if
			// column exists.
		}

		return out;
	}

	public boolean DBSync(String forType) {
		boolean out = true;
		Map<String, String[]> colInfo = null;
		try {
			colInfo = getColumnsInfo(forType);
		} catch (Exception ex) {
		}

		for (Map.Entry<String, String[]> entry : colInfo.entrySet()) {
			String table = entry.getValue()[1];
			String col = entry.getValue()[0];
			String type = getSqlType(entry.getValue()[2]);

			columnSync(table, col, type);
		}

		return out;
	}

}
