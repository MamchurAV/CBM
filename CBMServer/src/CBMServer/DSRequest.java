/**
 * 
 */
package CBMServer;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import CBMMeta.Criteria;
import CBMMeta.CriteriaComplex;

/**
 * @author Alexander Mamchur
 * Represents unified client request 
 * 
 * Sample:
 * {
	"dataSource": "UserRights",
	"operationType": "fetch",
	"operationId": "UserRights_fetch",
	"startRow": 0,
	"endRow": 10000,
	"textMatchStyle": "exact",
	"componentId": "(created directly)",
	"data": {
		"criteria": {
			"_constructor": "AdvancedCriteria",
			"operator": "and",
			"criteria": []
		},
		"clientData": {
			"currUser": "542b29de-428c-4fd3-9d90-93851f2c4256",
			"itemImg": "1",
			"currDate": "2017-10-14T18:50:02.549Z",
			"currLocale": "ru-RU",
			"extraInfo": ""
		}
	},
	"oldValues": null
}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class DSRequest {
	public String operationType;
	public String operationId;
	public String componentId;
	public String dataSource;
	public int startRow; 
	public int endRow; 
	public String textMatchStyle;
	public List<String> sortBy;
	public Map<String,Object> oldValues;
	public boolean isTransaction = false;
	
	public DSRequestData data;
}
