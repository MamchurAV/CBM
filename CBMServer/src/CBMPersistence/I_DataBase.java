/**
 * @author Alexander Mamchur
 */
package CBMPersistence;

//import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import CBMMeta.SelectTemplate;
import CBMServer.DSRequest;
import CBMServer.DSResponce;

/**
 * Interface for DB end-point execution
 */
public interface I_DataBase 
{
	  public DSResponce doSelect(SelectTemplate sql, DSRequest req) throws Exception; 
	  public DSResponce doInsert(Map<String,String[]> sql, DSRequest req) throws Exception; 
	  public DSResponce doUpdate(Map<String,String[]> sql, DSRequest req) throws Exception; 
	  public DSResponce doDelete(List<String> sql, DSRequest req) throws Exception; 
	  public int doCommit() throws Exception; 
	  public int doStartTrans() throws Exception; 
	  public DSResponce exequteDirect(String sql) throws Exception;
	  /**
	   * Executes SQL expression
	   * @param sql - SQL string to execute
	   * @return JDBC return code
	   * @throws Exception
	   */
	  public int exequteDirectSimple(String sql) throws Exception;
}
