/**
 * @author Alexander Mamchur
 */
package CBMPersistence;

//import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import CBMMeta.SelectTemplate;
import CBMServer.DSRequest;
import CBMServer.DSResponse;

/**
 * Interface for DB end-point execution
 */
public interface I_DataBase 
{
	/**
	 * Selects data from DB.
	 * With data within DSResponse structure returns JDBC Connection and Statement, 
	 * that !!! MUST BE CLOSED !!! later, after returned by RS data are utilized, by call of DSResponse.releaseDB() function.
	 */
	 public DSResponse doSelect(SelectTemplate sql, DSRequest req) throws Exception; 
	 public DSResponse doInsert(Map<String,String[]> sql, DSRequest req) throws Exception; 
	 public DSResponse doUpdate(Map<String,String[]> sql, DSRequest req) throws Exception; 
	 public DSResponse doDelete(List<String> sql, DSRequest req) throws Exception; 
	 public int doStartTrans() throws Exception; 
	 public int doCommit() throws Exception; 
	 public DSResponse exequteDirect(String sql) throws Exception;
	 /**
	  * Executes SQL expression
	  * @param sql - SQL string to execute
	  * @return JDBC return code
	  * @throws Exception
	  */
	 public int exequteDirectSimple(String sql) throws Exception;
}
