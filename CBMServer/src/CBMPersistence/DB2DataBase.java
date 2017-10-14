/**
 * @author Alexander Mamchur
 */
package CBMPersistence;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import CBMMeta.SelectTemplate;
import CBMServer.DSRequest;
import CBMServer.DSRequestSelect;
import CBMServer.DSRequestUpdate;
import CBMServer.DSResponce;



/**
 * DataBase operations on IBM DB2 DBMS
 */
public class DB2DataBase implements I_DataBase {

	static String dbURL;
	static Connection dbCon;

	static {
		try {
			Class.forName("com.ibm.db2.jcc.DB2Driver");
			// Define the data source for the driver
			dbURL = "jdbc:db2://localhost:50000/CBM_TMP"; // <<< TODO Tern this to configurable  
			dbCon = DriverManager.getConnection(dbURL, "CBM", "cbm");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * ------------ Interface implementation -----------------------
	 */
	// TODO Main part of all functional below maybe transferred to StorageMetaData (or some universal "SqlPrepare") class.
	@Override
	public DSResponce doSelect(SelectTemplate selTempl, DSRequestSelect dsRequest)
		throws Exception {
		String sql = "SELECT ";
		String sqlCount = "Select count(*) ";
		String selectPart = "";
		String fromPart = "";
		String wherePart = "1=1 ";
		String orderPart = "";
		String groupPart = "";
		String havingPart = "";
		String pagePart = "";
	
		DSResponce dsResponce = new DSResponce();

		// -------- Preprocess SelectTemplate and data (parameters here) to complete real SQL Select string
		// --- Select ---
		for (Map.Entry<String, String> entry : selTempl.columns.entrySet())
		{
			if (!entry.getValue().equals("null"))
			{
				selectPart += entry.getValue() + " as \"" + entry.getKey() + "\", ";
			}
		}

		sql += selectPart.substring(0, selectPart.length()-2);
		
		// --- From ---
		fromPart = selTempl.from;
		sql += " from " + fromPart;
		
		// --- Where (MetaModel defined part)---
		if (selTempl.where != null)
		{
			wherePart = selTempl.where;
		}
		// --- Where (User filtering)---
		wherePart += SqlFormatter.prepareWhere(selTempl, dsRequest);

		sql += " where " + wherePart;

		// --- Group by ---
		if (selTempl.groupby != null)
		{
			groupPart = selTempl.groupby;
			sql += " group by " + groupPart;
	
			// --- Having ---
			if (selTempl.having != null)
			{
				havingPart = selTempl.having;
			    sql += " having " + havingPart;
			}
		}
		
		// --- Order by (Client defined)---
		if (dsRequest!= null && dsRequest.sortBy != null  && dsRequest.sortBy.size()>0)
		{
			for (int i = 0; i < dsRequest.sortBy.size(); i++)
			{
				String col = selTempl.columns.get(dsRequest.sortBy.get(i));
				if (col != null)
				{	
					String odr = col;
					if (odr.startsWith("-"))
					{
						odr = odr.substring(1) + " desc";
					}
					orderPart += odr + ", ";
				}
			}
		}
		
		// --- After(!) user-defined sort - add MetaModel defined default order ---
		if (selTempl.orderby != null)
		{
			orderPart += selTempl.orderby; // MetaModel defined <inTempl.orderby> MUST ends with ID.
		}
		sql += orderPart.equals("") ? "" : " order by " + orderPart;
		
		// --- Paging ---
		if (dsRequest!= null && dsRequest.endRow != 0)
		{
			// TODO To think on optimization of count(*) calls
			sqlCount += " from " + fromPart + (wherePart.equals("") ? "" : " where " + wherePart);
			Statement statement = dbCon.createStatement();
			ResultSet rsCount = statement.executeQuery(sqlCount);
			rsCount.next();
			dsResponce.totalRows = rsCount.getInt(1);

			pagePart += String.valueOf(dsRequest.startRow) + "," + String.valueOf(dsRequest.endRow - dsRequest.startRow);
			sql += " limit " + pagePart;
		}
		
		// ------------ Execute Select
		Statement statement = dbCon.createStatement();
		ResultSet rs = statement.executeQuery(sql);
		dsResponce.data = rs;
		return dsResponce;
	}
	
	
	@Override
	public DSResponce doInsert(Map<String,String[]> insTempl, DSRequestUpdate dsRequest) throws Exception 
	{
		DSResponce out = new DSResponce();
		
		// ---- Discover Tables list -----
		List<String> tables = new ArrayList<String>();
		for (Map.Entry<String, String[]> entry : insTempl.entrySet())
		{
			String tableForCol = entry.getValue()[1];
			if (!tables.contains(tableForCol))
			{	
				tables.add(tableForCol);
			}
		}

		// ------ For every Tables to be Updated --------
		for (String table : tables)
		{
			String sql = "INSERT INTO ";
			String columnsPart = "";
			String valuesPart = " VALUES (";
			
			sql += table + " (";

			// -------- Update list and Where ---------------
			if (dsRequest!= null && dsRequest.data != null && dsRequest.data.size()>0)
			{
				for (Map.Entry<String, Object> entry : dsRequest.data.entrySet())
				{
					// TODO Filter only fields that changes!
					String[] colInfo = insTempl.get(entry.getKey());
					// ---- Include columns of this table only
					if (colInfo != null && colInfo[1].equals(table))
					{	
							columnsPart += colInfo[0] + ", ";
							valuesPart += "'" + entry.getValue().toString() + "', ";
					}
				}
			}
			sql += columnsPart.substring(0, columnsPart.length()-2) + ")" + valuesPart.substring(0, valuesPart.length()-2) + ")";

			Statement statement = dbCon.createStatement();
			out.retCode += statement.executeUpdate(sql);
		}
		return out;
	}


	// TODO Provide multiply updates/Deletes
	
	@Override
	public DSResponce doUpdate(Map<String,String[]> updTempl, DSRequestUpdate dsRequest)	throws Exception 
	{
		DSResponce out = new DSResponce();
		
		// ---- Discover Tables list -----
		List<String> tables = new ArrayList<String>();
		for (Map.Entry<String, String[]> entry : updTempl.entrySet())
		{
			String tableForCol = entry.getValue()[1];
			if (!tables.contains(tableForCol))
			{	
				tables.add(tableForCol);
			}
		}

		// ------ For every Tables to be Updated --------
		for (String table : tables)
		{
			String sql = "UPDATE ";
			String updatePart = "";
			String wherePart = "";
			
			sql += table + " SET ";

			// -------- Update list and Where ---------------
			if (dsRequest!= null && dsRequest.data != null && dsRequest.data.size()>0)
			{
				for (Map.Entry<String, Object> entry : dsRequest.data.entrySet())
				{
					// TODO Filter only fields that changes!
					String[] colInfo = updTempl.get(entry.getKey());
					// ---- Include columns of this table only
					if (colInfo != null && colInfo[1].equals(table))
					{	
						if (entry.getKey().toUpperCase().equals("ID"))
						{
							wherePart += colInfo[0] + "=" + entry.getValue().toString();
						}
						else
						{
							// TODO (?)single quotas usage adjust to attribute DB type
							updatePart += colInfo[0] + "='" + entry.getValue().toString() + "', ";
						}
					}
				}
			}
			sql += updatePart.substring(0, updatePart.length()-2) + " where " + wherePart;

			Statement statement = dbCon.createStatement();
			out.retCode += statement.executeUpdate(sql);
		}
		return out;
	}

	
	@Override
	public DSResponce doDelete(List<String> tables, DSRequestUpdate dsRequest) throws Exception 
	{
		String id = "";
		DSResponce out = new DSResponce();
		// First discover ID value
		for (Map.Entry<String, Object> entry : dsRequest.data.entrySet())
		{
			if (entry.getKey().toUpperCase().equals("ID"))
			{
				id = entry.getValue().toString();
			}
		}
		// Delete record in each table
		for (String table : tables)
		{
			String sql = "DELETE FROM " + table + " WHERE id=" + id;

			Statement statement = dbCon.createStatement();
			out.retCode += statement.executeUpdate(sql);
		}

		return out;
	}


	@Override
	public int doCommit() throws Exception {
		// TODO Auto-generated method stub
		return 0;
	}


	@Override
	public int doStartTrans() throws Exception {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public DSResponce exequteDirect(String sql){
		DSResponce out = new DSResponce();
		try {
			Statement statement = dbCon.createStatement();
			out.retCode = statement.executeUpdate(sql);
		}
		catch (SQLException e) {
			e.printStackTrace();
			out.retCode = -1;
			out.retMsg = e.toString();
			return out;
		}
		return out;
	}

	

	@Override
	public int exequteDirectSimple(String sql) throws SQLException {
		int out = -1;
		Statement statement = dbCon.createStatement();
		out = statement.executeUpdate(sql);
		return out;
	}

}
