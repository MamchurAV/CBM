/**
 * 
 */
package CBMServer;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * @author Alexander Mamchur
 * Represents unified client responce 
 */
public class DSResponce {
	
//	public int startRow; 
//	public int endRow; 
	public int totalRows; 
	public int retCode;
	public String retMsg = "1"; 
	public Connection dbConnection;
	public Statement dbStatement;
	public ResultSet data;
	
	
	
	public void releaseDB() {
	    try {
	        if(data != null) data.close();
	        if(dbStatement != null) dbStatement.close();
	        if(dbConnection != null) dbConnection.close();
	    } catch(SQLException sqlee) {
	        sqlee.printStackTrace();
	    } finally {  // Just to make sure that both con and stat are "garbage collected"
	    	data = null;
	    	dbStatement = null;
	        dbConnection = null;
	    }
	}

}
