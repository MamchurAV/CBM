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
import CBMServer.CBMStart;
import CBMServer.DSRequest;
import CBMServer.DSResponce;



/**
 * DataBase operations on PosgreSQL DBMS
 */
public class PostgreSqlDataBase implements I_DataBase {

	static String dbURL;
	private  String dbUs;
	private  String dbCred;
	private static final String ID = "id";
	
//	private  Connection dbCon = null;
//	private  Statement statement = null;
//	private  ResultSet rsCount = null;

	static {
		try 
		{
			Class.forName("org.postgresql.Driver");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public PostgreSqlDataBase(){
		dbURL = CBMStart.getParam("primaryDBUrl");
		dbUs = CBMStart.getParam("primaryDBUs");
		dbCred = CBMStart.getParam("primaryDBCred");
	}
	
	public PostgreSqlDataBase(String a_dbUrl, String a_dbUs, String a_dbCred){
		dbURL = a_dbUrl;
		dbUs = a_dbUs;
		dbCred = a_dbCred;
	}


	// -------------------------------- I_DataBase Interface implementation ---------------------------------------------
	/**
	 * Selects data from DB.
	 * With data within DSResponce structure returns JDBC Connection and Statement, 
	 * that !!! MUST BE CLOSED !!! later, after returned by RS data are utilized, by call of DSResponce.releaseDB() function.
	 */
	// TODO Main part of all functional below maybe transferred to StorageMetaData (or some universal "SqlPrepare") class.
	@Override
	public DSResponce doSelect(SelectTemplate selTempl, DSRequest dsRequest)
		throws Exception {
		Connection dbCon = null;
		Statement statement = null;
		ResultSet rsCount = null;

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
		if (dsRequest!= null && dsRequest.data != null && dsRequest.data.size()>0)
		{
			for (Map.Entry<String, Object> entry : dsRequest.data.entrySet())
			{
				String col = selTempl.columns.get(entry.getKey());
				if (col != null)
				{	
					if (!entry.getValue().equals("null"))
					{
						wherePart += " and " + col + "='" + entry.getValue().toString() + "'"; // TODO leave brackets for strings only
					}
					else
					{
						wherePart += " and " + col + " is null ";
					}
				}
 			}
		}
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

		// --- Paging pre-request ---
		if (dsRequest!= null && dsRequest.endRow != 0) {
			// TODO To think on optimization of count(*) calls 
			sqlCount += " from " + fromPart + (wherePart.equals("") ? "" : " where " + wherePart);
			try{
				dbCon = DriverManager.getConnection(dbURL, dbUs, dbCred);
				statement = dbCon.createStatement();
				rsCount = statement.executeQuery(sqlCount);
				rsCount.next();
				dsResponce.totalRows = rsCount.getInt(1);
			} catch (SQLException e) {
				e.printStackTrace();
				dsResponce.retCode = -1;
				dsResponce.retMsg = e.toString();
				return dsResponce; // Error-reporting responce return
			} finally {
			    try {
			        if(rsCount != null) rsCount.close();
			        if(statement != null) statement.close();
			        if(dbCon != null) dbCon.close();
			    } catch(SQLException sqlee) {
			        sqlee.printStackTrace();
			    } finally {  // Just to make sure that both con and stat are "garbage collected"
			    	rsCount = null;
			    	statement = null;
			    	dbCon = null;
			    }
			}

			pagePart += String.valueOf(dsRequest.endRow - dsRequest.startRow) + " offset " + String.valueOf(dsRequest.startRow);
			sql += " limit " + pagePart;
		}
		
		// ------------ Execute Select
		try{
			dbCon = DriverManager.getConnection(dbURL, dbUs, dbCred);
			statement = dbCon.createStatement();  
			ResultSet rs = statement.executeQuery(sql);
			dsResponce.data = rs;
			dsResponce.dbStatement = statement;
			dsResponce.dbConnection = dbCon;
		} catch (SQLException e) {
			e.printStackTrace();
			dsResponce.retCode = -1;
			dsResponce.retMsg = e.toString() + " while selecting data of <" + dsRequest.dataSource + "> class. SQL:<" + sql + ">";
			return dsResponce; // Error-reporting responce return
		}
		dsResponce.retCode = 0;
		return dsResponce;
	}
	
	
	@Override
	public DSResponce doInsert(Map<String,String[]> insTempl, DSRequest dsRequest)// throws Exception 
	{
		Connection dbCon = null;
		Statement statement = null;
		DSResponce out = new DSResponce();
		String idValue = null;
		
		// ---- Discover Tables list -----
		List<String> tables = new ArrayList<String>();
		for (Map.Entry<String, String[]> entry : insTempl.entrySet())
		{
			String tableForCol = entry.getValue()[1].toLowerCase();
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
			String valuesPart = "";
			
			sql += table + " (";

			// -------- Update list and Where ---------------
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
						if (colInfo[1].toLowerCase().equals(table))
						{	
							columnsPart += colInfo[0] + ", ";
	
							if (entry.getValue()==null)
							{
								valuesPart += "null, ";
							}
							else
							{
								String val = entry.getValue().toString();
								
								if (colInfo[0].toLowerCase().equals(ID)){
									idValue = val; // stored for further usage with possible inherited tables 
								}

								if (colInfo[2].equals("Boolean"))
								{
									if (val.equals("true")) { val = "1";}
									else if (val.equals("false")){ val = "0";}
								}
								if (val.equalsIgnoreCase("null")
										|| colInfo[2].equals("Integer")
										|| colInfo[2].equals("Bigint")
										|| colInfo[2].equals("Decimal")
										|| colInfo[2].equals("Money")
										|| colInfo[2].equals("BigDecimal")
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
			
			// For inherited-part tables, with no explicitly-defined ID
			if (!columnsPart.toUpperCase().startsWith("ID, ")){
				columnsPart = "ID, " + columnsPart;
				valuesPart = "'" + idValue + "', " + valuesPart;
			}

			sql += columnsPart.substring(0, columnsPart.length()-2) + ") VALUES (" + valuesPart.substring(0, valuesPart.length()-2) + ")";

			try {
				dbCon = DriverManager.getConnection(dbURL, dbUs, dbCred);
				statement = dbCon.createStatement();
// MySQL feature				statement.executeUpdate("SET NAMES 'utf8'");
				out.retCode = statement.executeUpdate(sql);
			}
			catch (SQLException e) {
				e.printStackTrace();
				out.retCode = -1;
				out.retMsg = e.toString() + " while <" + dsRequest.dataSource + "> inserting.    SQL: <" + sql + ">";
				return out;// Error-reporting responce return
			} finally {
			    try {
			        if(statement != null) statement.close();
			        if(dbCon != null) dbCon.close();
			    } catch(SQLException sqlee) {
			        sqlee.printStackTrace();
			    } finally {  // Just to make sure that both con and stat are "garbage collected"
			    	statement = null;
			    	dbCon = null;
			    }
			}
			
		}
		return out;
	}


	@Override
	public DSResponce doUpdate(Map<String,String[]> updTempl, DSRequest dsRequest) 
	{
		Connection dbCon = null;
		Statement statement = null;
		DSResponce out = new DSResponce();
		String idValue = null;

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
			String tableForCol = entry.getValue()[1].toLowerCase();
			if (!tables.contains(tableForCol)) {	
				tables.add(tableForCol);
			}
		}
		
//	Not need if updTempl prepared with ID field extracted first
//		// -- Preliminary discover table with ID column defined - 
//		// - to set it saved first, and extract ID for use it with all tables in set 
//		// (so they are considered to contain inherited parts of single instance).
//		for (Map.Entry<String, Object> entry : dsRequest.data.entrySet()) {
//			if (entry.getKey().toLowerCase().equals(ID)){
//			// Was not finished here					
//			}
//		}

		// ------ For every Tables to be Updated - gather SQL string and execute it --------
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
						if (colInfo[1].toLowerCase().equals(table))
						{	
							if (colInfo[0].toLowerCase().equals(ID) 
								|| entry.getKey().toLowerCase().equals(ID) 
								|| entry.getKey().toLowerCase().equals((table.substring(table.indexOf(".") + 1)  +ID).toLowerCase()) )
							{
								idValue = (String)entry.getValue(); // stored for further usage with possible inherited tables 
								wherePart += colInfo[0] + "='" + idValue + "'";
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
									if (colInfo[2].equals("Boolean"))
									{
										if (val.equals("true")) { val = "1";}
										else if (val.equals("false")){ val = "0";}
									}
									if (val.equalsIgnoreCase("null")
											|| colInfo[2].equals("Integer")
											|| colInfo[2].equals("Bigint")
											|| colInfo[2].equals("Decimal")
											|| colInfo[2].equals("Money")
											|| colInfo[2].equals("BigDecimal")
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
			
			// For inherited-part tables, with no explicitly-defined ID
			if (wherePart.equals("")) {
				wherePart = " id='" + idValue + "'";
			}

			sql += updatePart.substring(0, updatePart.length()-2) + " where " + wherePart;

			try {
				dbCon = DriverManager.getConnection(dbURL, dbUs, dbCred);
				statement = dbCon.createStatement();
// MySQL feature				statement.executeUpdate("SET NAMES 'utf8'");
				out.retCode = statement.executeUpdate(sql);
				
				statement.close();
				dbCon.close();
			}
			catch (SQLException e) {
				e.printStackTrace();
				out.retCode = -1;
				out.retMsg = e.toString() + " while <" + dsRequest.dataSource + "> updating.    SQL: <" + sql + ">";
				return out;// Error-reporting responce return
			} finally {
			    try {
			        if(statement != null) statement.close();
			        if(dbCon != null) dbCon.close();
			    } catch(SQLException sqlee) {
			        sqlee.printStackTrace();
			    } finally {  // Just to make sure that both con and stat are "garbage collected"
			    	statement = null;
			    	dbCon = null;
			    }
			}

		}
		return out;
	}

	
	@Override
	public DSResponce doDelete(List<String> tables, DSRequest dsRequest) 
	{
		Connection dbCon = null;
		Statement statement = null;
		String id;
		DSResponce out = new DSResponce();
		for (String tableRow : tables)
		{
			String table = tableRow.toLowerCase();
			// First discover ID value for table
			id = "";
			for (Map.Entry<String, Object> entry : dsRequest.data.entrySet())
			{
				if (entry.getKey().toLowerCase().equals(table.substring(table.indexOf(".") + 1) + ID))
				{
					id = entry.getValue().toString();
					break;
				}
			}
			if(id.equals(""))
			{
				for (Map.Entry<String, Object> entry : dsRequest.data.entrySet())
				{
					if (entry.getKey().toLowerCase().equals(ID))
					{
						id = entry.getValue().toString();
						break;
					}
				}
			}
			// Delete record in each table
			String sql = "DELETE FROM " + table + " WHERE id='" + id + "'";

			try {
				dbCon = DriverManager.getConnection(dbURL, dbUs, dbCred);
				statement = dbCon.createStatement();
// 	MySQL feature			statement.executeUpdate("SET NAMES 'utf8'");
				out.retCode = statement.executeUpdate(sql);
			}
			catch (SQLException e) {
				e.printStackTrace();
				out.retCode = -1;
				out.retMsg = e.toString() + " while <" + dsRequest.dataSource + "> deleting. SQL:<" + sql + ">";
				return out;
			} finally {
			    try {
			        if(statement != null) statement.close();
			        if(dbCon != null) dbCon.close();
			    } catch(SQLException sqlee) {
			        sqlee.printStackTrace();
			    } finally {  // Just to make sure that both con and stat are "garbage collected"
			    	statement = null;
			    	dbCon = null;
			    }
			}

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
		Connection dbCon = null;
		Statement statement = null;
		DSResponce out = new DSResponce();
		try {
			dbCon = DriverManager.getConnection(dbURL, dbUs, dbCred);
			statement = dbCon.createStatement();
			out.retCode = statement.executeUpdate(sql);
		}
		catch (SQLException e) {
			e.printStackTrace();
			out.retCode = -1;
			out.retMsg = e.toString();
			return out;
		} finally {
		    try {
		        if(statement != null) statement.close();
		        if(dbCon != null) dbCon.close();
		    } catch(SQLException sqlee) {
		        sqlee.printStackTrace();
		    } finally {  // Just to make sure that both con and stat are "garbage collected"
		    	statement = null;
		    	dbCon = null;
		    }
		}
		
		return out;
	}
	

	@Override
	public int exequteDirectSimple(String sql) {
		Connection dbCon = null;
		Statement statement = null;
	    try {	
			int out = -1;
			dbCon = DriverManager.getConnection(dbURL, dbUs, dbCred);
			statement = dbCon.createStatement();
			out = statement.executeUpdate(sql);
			return out;
	    } catch (SQLException e) {
			e.printStackTrace();
			return -1;
	    }finally {
		    try {
		        if(statement != null) statement.close();
		        if(dbCon != null) dbCon.close();
		    } catch(SQLException sqlee) {
		        sqlee.printStackTrace();
		    } finally {  // Just to make sure that both con and stat are "garbage collected"
		    	statement = null;
		    	dbCon = null;
		    }
	    }
    }
	
}
