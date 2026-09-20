/**
 * 
 */
package com.cbm.CBMMeta;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.cbm.CBMPersistence.I_DataBaseAsync;
import com.cbm.CBMPersistence.PostgreSqlDataBase;
import com.cbm.CBMServer.DSRequest;
import com.cbm.CBMServer.DSResponse;
import com.cbm.Main;

import io.vertx.core.Future;
import io.vertx.core.Promise;

/**
 * @author Alexander Mamchur Provide Meta-Model defined storage information (in
 *         form of Select template structure and standard Maps for Insert and
 *         Updates and List for deletes)
 */
public class StorageMetaData implements I_StorageMetaData {
	static Map<String, Object> selectInfo = new HashMap<String, Object>();
	static Map<String, Map<String, String[]>> updInsInfo = new HashMap<String, Map<String, String[]>>();
	static Map<String, List<String>> delInfo = new HashMap<String, List<String>>();
	static I_DataBaseAsync metaDB;

	public StorageMetaData() {
		String dbType = Main.getParam("primaryDBType");
		switch (dbType) {
		case "PostgreSql":
			metaDB = new PostgreSqlDataBase();
			break;
		default:
			metaDB = new PostgreSqlDataBase();
			break;
		}
	}

	// ------------ Interface implementation -----------------------

	// --- Returns DB specified for current request
	// TODO - !!! get DB name from Request to provide
	@Override
	public String getDataBase(DSRequest req) {
		// TODO: Implement function !!!(below - mock!!!)
		return Main.getParam("primaryDBType");
	}

	/**
	 * Асинхронная версия doSelect - возвращает Future вместо блокировки
	 */
	private Future<DSResponse> doSelectAsync(SelectTemplate selTempl, DSRequest dsRequest) {
		Promise<DSResponse> promise = Promise.promise();
		metaDB.doSelect(selTempl, dsRequest, promise);
		return promise.future();
	}

	/**
	 * Provide information used for Select query (async version)
	 */
	public Future<SelectTemplate> getSelectAsync(DSRequest req) {
		String forView = req.dataSource;
		Date forDate = req.data.clientData.currDate;
		String forUser = req.data.clientData.currUser;

		// ---- Try get from cache ----
		SelectTemplate cached = (SelectTemplate) selectInfo.get(forView);
		if (cached != null) {
			return Future.succeededFuture(cached);
		}

		Promise<SelectTemplate> promise = Promise.promise();

		// ------ Get common part of query for requested View from MetaData
		SelectTemplate mdForSelect = new SelectTemplate();

		mdForSelect.from = "CBM.PrgView pv " + "inner join CBM.Concept c on c.id=pv.ForConcept and c.del='0'";
		mdForSelect.where = "pv.SysCode = '" + forView + "' and pv.del='0' and pv.actual = '1'";
		mdForSelect.orderby = "pv.ID";
		mdForSelect.columns = new ArrayList<>();
		mdForSelect.columns.add(new ColumnInfo("IDView", "CBM.PrgView", "pv.ID", "String"));
		mdForSelect.columns.add(new ColumnInfo("ExprFrom", "CBM.Concept", "c.ExprFrom", "String"));
		mdForSelect.columns.add(new ColumnInfo("ExprWhere", "CBM.Concept", "c.ExprWhere", "String"));
		mdForSelect.columns.add(new ColumnInfo("ExprOrder", "CBM.Concept", "c.ExprOrder", "String"));
		mdForSelect.columns.add(new ColumnInfo("ExprGroup", "CBM.Concept", "c.ExprGroup", "String"));
		mdForSelect.columns.add(new ColumnInfo("ExprHaving", "CBM.Concept", "c.ExprHaving", "String"));

		doSelectAsync(mdForSelect, null)
			.compose(metaResponse -> {
				if (metaResponse == null || metaResponse.dataRows == null || metaResponse.dataRows.isEmpty()) {
					return Future.succeededFuture(null);
				}
				SelectTemplate out = new SelectTemplate();
				Map<String, Object> row = metaResponse.dataRows.get(0);
				String forViewId = (String) row.get("IDView");

				out.from = ((String) row.get("ExprFrom")).replaceAll("/forDate/", forDate.toString())
						.replaceAll("/forUser/", forUser);
				out.where = (String) row.get("ExprWhere");
				out.orderby = (String) row.get("ExprOrder");
				out.groupby = (String) row.get("ExprGroup");
				out.having = (String) row.get("ExprHaving");

				// ---- Get columns part of query from MetaData ----
				SelectTemplate mdForSelectCols = new SelectTemplate();
				mdForSelectCols.from = "CBM.PrgViewField pvf "
						+ "inner join CBM.Relation r on r.id=pvf.ForRelation and r.dbcolumn is not null "
						+ "inner join  CBM.Concept c on c.ID=r.RelatedConcept ";
				mdForSelectCols.where = "pvf.ForPrgView='" + forViewId + "' and pvf.del='0'";
				mdForSelectCols.orderby = "pvf.Odr, r.ID";
				mdForSelectCols.columns = new ArrayList<>();
				mdForSelectCols.columns.add(new ColumnInfo("SysCode", "CBM.PrgViewField", "pvf.syscode", "String"));
				mdForSelectCols.columns.add(new ColumnInfo("DBTable", "CBM.Relation", "r.dbtable", "String"));
				mdForSelectCols.columns.add(new ColumnInfo("DBColumn", "CBM.Relation", "r.dbcolumn", "String"));
				mdForSelectCols.columns.add(new ColumnInfo("RelatedConcept", "CBM.Concept", "c.SysCode", "String"));

				return doSelectAsync(mdForSelectCols, null).map(colsResponse -> {
					if (colsResponse != null && colsResponse.dataRows != null) {
						out.columns = new ArrayList<>();
						String col;
						String relatedConcept;
						for (Map<String, Object> row2 : colsResponse.dataRows) {
							col = (String) row2.get("DBColumn");
							relatedConcept = (String) row2.get("RelatedConcept");
							if (relatedConcept.equals("Boolean")) {
								col = "(CASE WHEN " + col + "='0' then 'false' ELSE 'true' END)";
							}
							out.columns.add(new ColumnInfo((String) row2.get("SysCode"),
									(String) row2.get("DBTable"), col, relatedConcept));
						}
					}
					// Store loaded metadata to cache
					selectInfo.put(forView, out);
					return out;
				});
			})
			.onComplete(promise);

		return promise.future();
	}

	/**
	 * Provide information used for Insert or Update operation (async version)
	 */
	public Future<Map<String, String[]>> getColumnsInfoAsync(DSRequest req) {
		String forType = req.dataSource;
		return getColumnsInfoAsync(forType);
	}

	private Future<Map<String, String[]>> getColumnsInfoAsync(String forType) {
		// ---- First search in cache
		Map<String, String[]> cached = (Map<String, String[]>) updInsInfo.get(forType);
		if (cached != null) {
			return Future.succeededFuture(cached);
		}
		// ---- If changes provided to MetaData concepts - drop Metadata for
		// that concept
		if (forType.equals("Concept") || forType.equals("Relation") || forType.equals("PrgView") || forType.equals("PrgViewField")) {
			selectInfo.clear();
			updInsInfo.clear();
			delInfo.clear();
		}

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

		mdForSelect.columns = new ArrayList<>();
		mdForSelect.columns.add(new ColumnInfo("syscode", "CBM.PrgViewField", "pvf.syscode", "String"));
		mdForSelect.columns.add(new ColumnInfo("dbtable", "CBM.Relation", "r.dbtable", "String"));
		mdForSelect.columns.add(new ColumnInfo("dbcolumn", "CBM.Relation", "r.dbcolumn", "String"));
		mdForSelect.columns.add(new ColumnInfo("pointedclass", "CBM.Concept", "c.SysCode", "String"));
		mdForSelect.columns.add(new ColumnInfo("versioned", "CBM.Relation", "r.Versioned", "Boolean"));

		return doSelectAsync(mdForSelect, null).map(metaResponse -> {
			Map<String, String[]> out = new HashMap<>();
			if (metaResponse != null && metaResponse.dataRows != null) {
				for (Map<String, Object> row : metaResponse.dataRows) {
					String dbcolumn = (String) row.get("dbcolumn");
					out.put((String) row.get("syscode"),
							new String[] {
									dbcolumn.substring(dbcolumn.indexOf(".") + 1),
									(String) row.get("dbtable"), (String) row.get("pointedclass"),
									(String) row.get("versioned") });
				}
			}
			// Store loaded metadata to cache
			updInsInfo.put(forType, out);
			return out;
		});
	}

	/**
	 * Provide information used for Delete operation (async version)
	 */
	public Future<List<String>> getDeleteAsync(DSRequest req) {
		return getDeleteAsync(req.dataSource);
	}

	private Future<List<String>> getDeleteAsync(String forType) {
		// ---- First search in cache
		List<String> cached = (List<String>) delInfo.get(forType);
		if (cached != null) {
			return Future.succeededFuture(cached);
		}

		SelectTemplate mdForSelect = new SelectTemplate();

		// ---- Select Tables participated in deletion info from Relations
		// storage info in MetaData -------------
		mdForSelect.from = "CBM.PrgView pv "
				+ "inner join  CBM.PrgViewField pvf on pvf.ForPrgView=pv.ID and pvf.Del='0' "
				+ "inner join  CBM.Relation r on r.ID=pvf.ForRelation and r.Del='0' and r.dbtable is not null and r.dbcolumn is not null ";
		mdForSelect.where = "pv.syscode='" + forType + "' and pv.del='0' and pv.actual = '1' ";
		mdForSelect.groupby = "r.dbtable";
		mdForSelect.orderby = "r.dbtable";

		mdForSelect.columns = new ArrayList<>();
		mdForSelect.columns.add(new ColumnInfo("dbtable", "CBM.Relation", "r.dbtable", "String"));

		return doSelectAsync(mdForSelect, null).map(metaResponse -> {
			List<String> out = new ArrayList<>();
			if (metaResponse != null && metaResponse.dataRows != null) {
				for (Map<String, Object> row : metaResponse.dataRows) {
					String dbtable = (String) row.get("dbtable");
					if (dbtable != null && !out.contains(dbtable.toLowerCase())) {
						out.add(dbtable.toLowerCase());
					}
				}
			}
			// Store loaded metadata to cache
			delInfo.put(forType, out);
			return out;
		});
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
	public SelectTemplate getSelect(String code) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * Interface stub - not used in async flow
	 */
	@Override
	public SelectTemplate getSelect(DSRequest req) {
		// Use getSelectAsync(req) instead - this is a legacy stub
		return null;
	}

	/**
	 * Synchronize DB to MetaData storage info
	 */
	private boolean columnSync(String forTable, String forColumn, String colType) {
		boolean out = true;
		// --- Try for column existence
		try {
			metaDB.executeDirect("ALTER TABLE " + forTable + " ADD " + forColumn + " " + colType, res -> {
				if (res.failed()) {
					// --- In this case - stop exception proceeding - it's normal if
					// column exists.
				}
			});
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
			colInfo = getColumnsInfoSync(forType);
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

	// ------------ Sync methods for interface compatibility ---------------

	/**
	 * Sync wrapper for getColumnsInfo - for interface compatibility only
	 */
	private DSResponse doSelectSync(SelectTemplate selTempl, DSRequest dsRequest) {
		Promise<DSResponse> promise = Promise.promise();
		metaDB.doSelect(selTempl, dsRequest, promise);
		try {
			return promise.future().toCompletionStage().toCompletableFuture().get();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public Map<String, String[]> getColumnsInfo(DSRequest req) {
		return getColumnsInfoSync(req.dataSource);
	}

	private Map<String, String[]> getColumnsInfoSync(String forType) {
		Map<String, String[]> out = null;

		// ---- First search in cache
		out = (Map<String, String[]>) updInsInfo.get(forType);
		if (out != null) {
			return out;
		}
		// ---- If changes provided to MetaData concepts - drop Metadata for
		// that concept
		if (forType.equals("Concept") || forType.equals("Relation") || forType.equals("PrgView") || forType.equals("PrgViewField")) {
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

		mdForSelect.columns = new ArrayList<>();
		mdForSelect.columns.add(new ColumnInfo("syscode", "CBM.PrgViewField", "pvf.syscode", "String"));
		mdForSelect.columns.add(new ColumnInfo("dbtable", "CBM.Relation", "r.dbtable", "String"));
		mdForSelect.columns.add(new ColumnInfo("dbcolumn", "CBM.Relation", "r.dbcolumn", "String"));
		mdForSelect.columns.add(new ColumnInfo("pointedclass", "CBM.Concept", "c.SysCode", "String"));
		mdForSelect.columns.add(new ColumnInfo("versioned", "CBM.Relation", "r.Versioned", "Boolean"));

		try {
			metaResponse = doSelectSync(mdForSelect, null);
		} catch (Exception ex) {
			ex.printStackTrace();
		}

		if (metaResponse != null && metaResponse.dataRows != null) {
			out = new HashMap<>();
			for (Map<String, Object> row : metaResponse.dataRows) {
				String dbcolumn = (String) row.get("dbcolumn");
				out.put((String) row.get("syscode"),
						new String[] {
								dbcolumn.substring(dbcolumn.indexOf(".") + 1),
								(String) row.get("dbtable"), (String) row.get("pointedclass"),
								(String) row.get("versioned") });
			}
		}

		// Store loaded metadata to cache
		updInsInfo.put(forType, out);
		return out;
	}

	@Override
	public List<String> getDelete(DSRequest req) {
		return getDeleteSync(req.dataSource);
	}

	private List<String> getDeleteSync(String forType) {
		List<String> out = null;

		// ---- First search in cache
		out = (List<String>) delInfo.get(forType);
		if (out != null) {
			return out;
		}

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

		mdForSelect.columns = new ArrayList<>();
		mdForSelect.columns.add(new ColumnInfo("dbtable", "CBM.Relation", "r.dbtable", "String"));

		try {
			metaResponse = doSelectSync(mdForSelect, null);
		} catch (Exception ex) {
			ex.printStackTrace();
		}

		if (metaResponse != null && metaResponse.dataRows != null) {
			out = new ArrayList<>();
			for (Map<String, Object> row : metaResponse.dataRows) {
				String dbtable = (String) row.get("dbtable");
				if (dbtable != null && !out.contains(dbtable.toLowerCase())) {
					out.add(dbtable.toLowerCase());
				}
			}
		}

		// Store loaded metadata to cache
		delInfo.put(forType, out);
		return out;
	}

}
