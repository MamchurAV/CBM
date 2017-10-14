/**
 * @author Alexander Mamchur
 */
package CBMPersistence;

//import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import CBMMeta.SelectTemplate;
import CBMServer.DSRequest;
import CBMServer.DSRequestSelect;
import CBMServer.DSRequestUpdate;
import CBMServer.DSResponce;

/**
 * Interface for DB end-point execution
 */
public interface I_DataBase 
{
	/**
	 * Selects data from DB.
	 * With data within DSResponce structure returns JDBC Connection and Statement, 
	 * that !!! MUST BE CLOSED !!! later, after returned by RS data are utilized, by call of DSResponce.releaseDB() function.
	 */
	 public DSResponce doSelect(SelectTemplate sql, DSRequestSelect req) throws Exception; 
	 public DSResponce doInsert(Map<String,String[]> sql, DSRequestUpdate req) throws Exception; 
	 public DSResponce doUpdate(Map<String,String[]> sql, DSRequestUpdate req) throws Exception; 
	 public DSResponce doDelete(List<String> sql, DSRequestUpdate req) throws Exception; 
	 public int doStartTrans() throws Exception; 
	 public int doCommit() throws Exception; 
	 public DSResponce exequteDirect(String sql) throws Exception;
	 /**
	  * Executes SQL expression
	  * @param sql - SQL string to execute
	  * @return JDBC return code
	  * @throws Exception
	  */
	 public int exequteDirectSimple(String sql) throws Exception;
}
