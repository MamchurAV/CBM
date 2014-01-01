/**
 * 
 */
package CBMServer;

import java.sql.ResultSet;

/**
 * @author Alexander Mamchur
 * Represents unified client responce 
 */
public class DSResponce {
	
//	public int startRow; 
//	public int endRow; 
	public int totalRows; 
	public ResultSet data;
	public int retCode;
	public String retMsg = "1"; 

}
