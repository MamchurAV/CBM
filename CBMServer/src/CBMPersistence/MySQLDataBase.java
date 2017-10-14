/**
 * @author Alexander Mamchur
 */
package CBMPersistence;

//import java.io.IOException;
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
 * DataBase operations on MySQL DBMS
 */
public class MySQLDataBase implements I_DataBase {

	static String dbURL;
	static Connection dbCon;

	static 
	{
		try 
		{
			Class.forName("com.mysql.jdbc.Driver").newInstance();			
			// Define the data source for the driver
			dbURL = "jdbc:mysql://localhost/CBM?"; // <<< TODO Turn this to configurable  
			dbCon = DriverManager.getConnection(dbURL, "CBM", "cbm");
		}  
		catch (Exception ex) { ex.printStackTrace(); }	
	}

	/**
	 * ------------ Interface implementation -----------------------
	 */
	// TODO Main part of all functional below maybe transferred to StorageMetaData (or some universal "SqlPrepare") class.
	@Override
	public DSResponce doSelect(SelectTemplate selTempl, DSRequestSelect dsRequest) //throws Exception 
	{
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

		if (selectPart.length() < 2){
			dsResponce.retCode = -1;
			dsResponce.retMsg = "No metadata for <" + dsRequest.dataSource + "> found.   SQL: <" + sql + ">";
			return dsResponce;
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
			try{
				Statement statement = dbCon.createStatement();
				ResultSet rsCount = statement.executeQuery(sqlCount);
				rsCount.next();
				dsResponce.totalRows = rsCount.getInt(1);
			} catch (SQLException e) {
				e.printStackTrace();
				dsResponce.retCode = -1;
				dsResponce.retMsg = e.toString();
				return dsResponce;
			}

			pagePart += String.valueOf(dsRequest.startRow) + "," + String.valueOf(dsRequest.endRow - dsRequest.startRow);
			sql += " limit " + pagePart;
		}
		
		// ------------ Execute Select
		try{
			Statement statement = dbCon.createStatement();
			statement.executeUpdate("SET NAMES 'utf8'");
			ResultSet rs = statement.executeQuery(sql);
			dsResponce.data = rs;
		} catch (SQLException e) {
			e.printStackTrace();
			dsResponce.retCode = -1;
			dsResponce.retMsg = e.toString() + " while selecting data of <" + dsRequest.dataSource + "> class. SQL:<" + sql + ">";
			return dsResponce;
		}
		dsResponce.retCode = 0;
		return dsResponce;
	}
	
	
	@Override
	public DSResponce doInsert(Map<String,String[]> insTempl, DSRequestUpdate dsRequest) //throws Exception 
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
			if (dsRequest != null && dsRequest.data != null && dsRequest.data.size()>0)
			{
				for (Map.Entry<String, Object> entry : dsRequest.data.entrySet())
				{
					// --- Get collumn info for request field key
					String[] colInfo = insTempl.get(entry.getKey());
					// --- Include columns of this table only
					if (colInfo != null) 
					{ 
						if (colInfo[1].equals(table))
						{	
							columnsPart += colInfo[0] + ", ";
	
							if (entry.getValue()==null)
							{
								valuesPart += "null, ";
							}
							else
							{
								String val = entry.getValue().toString();
								if (colInfo[2].equals("53"))
								{
									if (val.equals("true")) { val = "1";}
									else if (val.equals("false")){ val = "0";}
								}
								if (val.equalsIgnoreCase("null")
										|| colInfo[2].equals("18")
										|| colInfo[2].equals("20")
										|| colInfo[2].equals("22")
										|| colInfo[2].equals("24")
										|| colInfo[2].equals("26")
										)
								{
									valuesPart += val + ", ";
								}
								else
								{
									valuesPart += "'" + val + "', "; 
								}
							}
						}
					}
//					else if (!entry.getKey().equals("infoState") && !entry.getKey().equals("UID")) // --- Column information for transfered from client data not found
//					{
//						out.retCode = -1;
//						out.retMsg = "Column information (PrgViewField+PrgAttribute) for field " + entry.getKey() + " = " + (entry.getValue()==null ? "null" : entry.getValue().toString()) + " transfered from client data not found";
//						return out;
//					}
				}
			}
			
			if (columnsPart.length() < 2){
				out.retCode = -1;
				out.retMsg = "No metadata for <" + dsRequest.dataSource + "> found.   SQL: <" + sql + columnsPart + ")" + valuesPart + ")>  in doInsert()";
				return out;
			}
			
			sql += columnsPart.substring(0, columnsPart.length()-2) + ")" + valuesPart.substring(0, valuesPart.length()-2) + ")";

			try {
				Statement statement = dbCon.createStatement();
				statement.executeUpdate("SET NAMES 'utf8'");
				out.retCode = statement.executeUpdate(sql);
			}
			catch (SQLException e) {
				e.printStackTrace();
				out.retCode = -1;
				out.retMsg = e.toString() + " while <" + dsRequest.dataSource + "> inserting.    SQL: <" + sql + ">";
				return out;
			}

		}
		return out;
	}


	@Override
	public DSResponce doUpdate(Map<String,String[]> updTempl, DSRequestUpdate dsRequest) 
	{
		DSResponce out = new DSResponce();

		// --- Discover Tables list ---
		List<String> tables = new ArrayList<String>();
		for (Map.Entry<String, String[]> entry : updTempl.entrySet())
		{
			// --- Filter only fields that changes!
			String sysCode = entry.getKey();
			// --- If column not exists in input data - don't use its Table 
			if (!(dsRequest.data.containsKey(sysCode))) {
				continue;
			}
			// --- If value not changed - don't use its Table
			Object v1 = dsRequest.data.get(sysCode);
			Object v2 = null;
			if(dsRequest.oldValues != null)	{
				v2 = dsRequest.oldValues.get(sysCode);
			}
			if(( v1 != null && v1.equals(v2)) || (v1 == null && v2 == null)) { 
				continue;
			}
			// --- Update Tables list
			String tableForCol = entry.getValue()[1];
			if (!tables.contains(tableForCol)) {	
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
					String[] colInfo = updTempl.get(entry.getKey());
					// ---- Include columns of this table only
					if (colInfo != null)
					{
						if (colInfo[1].equals(table))
						{	
							if (colInfo[0].equals("ID") 
								|| entry.getKey().toUpperCase().equals("ID") 
								|| entry.getKey().equals(table.substring(table.indexOf(".") + 1)  +"ID") )
							{
								wherePart += colInfo[0] + "=" + entry.getValue().toString();
							}
							else
							{
								if (entry.getValue()==null)
								{
									updatePart += colInfo[0] + " = null, ";
								}
								else
								{
									String val = entry.getValue().toString();
									if (colInfo[2].equals("53"))
									{
										if (val.equals("true")) { val = "1";}
										else if (val.equals("false")){ val = "0";}
									}
									if (val.equalsIgnoreCase("null")
											|| colInfo[2].equals("18")
											|| colInfo[2].equals("20")
											|| colInfo[2].equals("22")
											|| colInfo[2].equals("24")
											|| colInfo[2].equals("26")
											)
									{
										updatePart += colInfo[0] + "=" + val + ", ";
									}
									else
									{
										updatePart += colInfo[0] + "='" + val + "', ";
									}
								}
							}
						}	
					}
//	No error! It may be normal!				else if (!entry.getKey().equals("infoState") && !entry.getKey().equals("UID")) // --- Column information for transfered from client data not found
//					{
//						out.retCode = -1;
//						out.retMsg = "Column information (PrgViewField+PrgAttribute) for field " + entry.getKey() + " = " + (entry.getValue()==null ? "null" : entry.getValue().toString()) + " transfered from client data not found";
//						return out;
//					}
				}
			}
			
			if (updatePart.length() < 2){
				out.retCode = -1;
				out.retMsg = "No metadata for <" + dsRequest.dataSource + "> found.   SQL: <" + updatePart + " where " + wherePart + ">  in doUpdate()";
				return out;
			}

			sql += updatePart.substring(0, updatePart.length()-2) + " where " + wherePart;

			try {
				Statement statement = dbCon.createStatement();
				statement.executeUpdate("SET NAMES 'utf8'");
				out.retCode = statement.executeUpdate(sql);
			}
			catch (SQLException e) {
				e.printStackTrace();
				out.retCode = -1;
				out.retMsg = e.toString() + " while <" + dsRequest.dataSource + "> updating.    SQL: <" + sql + ">";
				return out;
			}

		}
		return out;
	}

	
	@Override
	public DSResponce doDelete(List<String> tables, DSRequestUpdate dsRequest) //throws Exception 
	{
		String id;
		DSResponce out = new DSResponce();
		for (String table : tables)
		{
			// First discover ID value for table
			id = "";
			for (Map.Entry<String, Object> entry : dsRequest.data.entrySet())
			{
				if (entry.getKey().equals(table.substring(table.indexOf(".") + 1)  +"ID"))
				{
					id = entry.getValue().toString();
					break;
				}
			}
			if(id.equals(""))
			{
				for (Map.Entry<String, Object> entry : dsRequest.data.entrySet())
				{
					if (entry.getKey().toUpperCase().equals("ID"))
					{
						id = entry.getValue().toString();
						break;
					}
				}
			}
			// Delete record in each table
			String sql = "DELETE FROM " + table + " WHERE id=" + id;

			try {
				Statement statement = dbCon.createStatement();
				statement.executeUpdate("SET NAMES 'utf8'");
				out.retCode = statement.executeUpdate(sql);
			}
			catch (SQLException e) {
				e.printStackTrace();
				out.retCode = -1;
				out.retMsg = e.toString() + " while <" + dsRequest.dataSource + "> deleting. SQL:<" + sql + ">";
				return out;
			}

		}

		return out;
	}


	@Override
	public int doStartTrans() throws Exception {
		Statement statement = dbCon.createStatement();
		return statement.executeUpdate("START TRANSACTION");
	}


	@Override
	public int doCommit() throws Exception {
		Statement statement = dbCon.createStatement();
		return statement.executeUpdate("COMMIT");
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
