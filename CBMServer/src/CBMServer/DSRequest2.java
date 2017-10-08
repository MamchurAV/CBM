/**
 * 
 */
package CBMServer;

import java.util.Date;
import java.util.List;
import java.util.Map;

import CBMMeta.CriteriaComplex;

/**
 * @author Alexander Mamchur
 * Represents unified client request 
 */
public class DSRequest2 {
	public String operationType;
	public String operationId;
	public String componentId;
	public String dataSource;
	public String itemImg;
	public String currUser;
	public Date forDate;
	public String currLocale;
	public String extraInfo;
	public int startRow; 
	public int endRow; 
	public String textMatchStyle;
	public List<String> sortBy;
	public DSRequestData data;
	public Map<String,Object> oldValues;
//	public CriteriaComplex criteria;

	public boolean isTransaction = false;
}
