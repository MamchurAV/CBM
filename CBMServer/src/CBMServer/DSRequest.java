/**
 * 
 */
package CBMServer;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * @author Alexander Mamchur
 * Represents unified client request 
 */
public class DSRequest {
	public String operationType;
	public String operationId;
	public String componentId;
	public String dataSource;
	public String itemImg;
	public String currUser;
	public Date forDate;
	public int startRow; 
	public int endRow; 
	public String textMatchStyle;
	public List<String> sortBy;
	public Map<String,Object> data;
	public Map<String,Object> oldValues;

	public boolean isTransaction = false;
}
