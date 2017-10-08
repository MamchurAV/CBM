/**
 * @author Alexander Mamchur
 */
package CBMServer;

import java.io.StringWriter;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.text.SimpleDateFormat;

import org.restlet.Request;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

import CBMMeta.Criteria;
import CBMMeta.CriteriaComplex;
import CBMMeta.CriteriaItem;
import CBMUtils.UniquePropertyPolymorphicDeserializer;


/**
 * Class that prepare SmartClient requests in unified for CBM I_Request form.
 *
 */
public class IscIOFormatter implements I_ClientIOFormatter {

	// ------------ Interface implementation -----------------------
	
	/**
	 * Format ongoing requests
	 * 
	 */
	@Override
	public DSTransaction formatRequest(Request request) throws Exception 
	{
		DSTransaction dsTransaction = new DSTransaction();
		
        String req = request.getEntityAsText();
		if (req == null){
			// TODO: to do something... :-) 
			throw new Exception("Empty Request");
		}
		// Jackson JSON to JAVA conversion
		ObjectMapper JsonMapper = new ObjectMapper();
//VVVVVVVVVVVVV		
//		testParse();	
		testParse2();	
// ^^^^^^^^^^^^^
		if(req.indexOf("\"transaction\":") >= 0
			&& req.indexOf("\"operations\":")  >= 0
			&& req.indexOf("\"transactionNum\":") >= 0)
		{
			req = req.substring(16, req.length()-1);
			dsTransaction = (DSTransaction)JsonMapper.readValue(req, dsTransaction.getClass());
			for (DSRequest DSreq : dsTransaction.operations) {
				DSreq.isTransaction = true;
				// Move parameters from request.data to DSRequest for usage in future query processing - for not to confusing them with Columns names.
				DSreq.itemImg = fromImg(DSreq.data.get("itemImg"));
				DSreq.data.remove("itemImg");
				DSreq.currUser = (String)DSreq.data.get("currUser");
				DSreq.forDate = new SimpleDateFormat("yyyy-MM-dd").parse((String)DSreq.data.get("currDate"));
				DSreq.data.remove("currUser");
				DSreq.currLocale = (String)DSreq.data.get("currLang");
				DSreq.data.remove("currLang");

//				DSreq.criteria = formatRequestCriteria(DSreq);
				
				// --- dsRequest preprocessing (for: 1. ID in linked data discovering - and - 2. provide full returned in response data---
				if (DSreq.oldValues != null) {
					for (Map.Entry<String, Object> entry : DSreq.oldValues.entrySet()) {
						if (!DSreq.data.containsKey(entry.getKey())) {
							DSreq.data.put(entry.getKey(), entry.getValue());
						}
					}
				}

			}
		}
		else
		{
			DSRequest dsRequest = new DSRequest();
			dsRequest = (DSRequest)JsonMapper.readValue(req, dsRequest.getClass());
			dsRequest.isTransaction = false;
			
			dsRequest.itemImg = fromImg(dsRequest.data.get("itemImg"));
			dsRequest.data.remove("itemImg");
			// Next two remains in request to participate in query
			dsRequest.currUser = (String)dsRequest.data.get("currUser");
			dsRequest.forDate = new SimpleDateFormat("yyyy-MM-dd").parse((String)dsRequest.data.get("currDate"));
			dsRequest.data.remove("currUser");
			dsRequest.currLocale = (String)dsRequest.data.get("currLang");
			dsRequest.data.remove("currLang");
			dsRequest.extraInfo = (String)dsRequest.data.get("extraInfo");
			dsRequest.data.remove("extraInfo");
			
//			dsRequest.criteria = formatRequestCriteria(dsRequest);
			
			// --- dsRequest preprocessing (for: 1. ID in linked data discovering - and - 2. provide full returned in response data---
			if (dsRequest.oldValues != null) {
				for (Map.Entry<String, Object> entry : dsRequest.oldValues.entrySet()) {
					if (!dsRequest.data.containsKey(entry.getKey())) {
						dsRequest.data.put(entry.getKey(), entry.getValue());
					}
				}
			}
			
			dsTransaction.operations.add(dsRequest);
		}
		
		return dsTransaction;
	}
	
	/**
	 * Format data output
	 */
	@Override
	public String formatResponce(DSResponce dsResponce, DSRequest dsRequest)  throws Exception
	{
		ObjectMapper JsonMapper = new ObjectMapper();
		if (dsResponce.retCode >= 0) { // -- Successful response ---
			if (dsRequest.operationType.equals("fetch")) {
				// --- Response data formatting
				List<Map<String, String>> ret = new ArrayList<Map<String, String>>();
				ResultSet rs = dsResponce.data;
				java.sql.ResultSetMetaData meta = rs.getMetaData();
				int size = meta.getColumnCount();
				int length = 0;
				while (rs.next()) {
					length +=1;
					Map<String, String> row = new HashMap<String, String>();
					for (int i = 1; i <= size; i++) {
						String column = meta.getColumnLabel(i);
						Object obj = rs.getObject(i);
						// --- Language part extracting (!now done on client!)
						// TODO: Differentiate, switching on only for marked fields (considering too big...)
//						if (obj != null && obj.getClass() == String.class) {
//							obj = MultiLangStringProcessor.extractValue((String)obj, dsRequest.currLocale);
//						}
						// Do not include null results
						if (obj != null ) {
							row.put(column, "" + obj);
						}
					}
					// If entity does not contain "Concept" field, add it.
					if (!row.containsKey("Concept")) {
						row.put("Concept", "" + dsRequest.dataSource);
					}
					ret.add(row);
				}
				StringWriter sw = new StringWriter();
				JsonMapper.writeValue(sw, ret);
				
				if (dsResponce.totalRows==0){
					dsResponce.totalRows = length;
				}
				
				// --- Response meta-information surrounding 
				return "{"     
				+ " response:{"     
				+ (dsRequest.isTransaction ? "   queueStatus: 0," : "")  // TODO -- Return transaction code here
				+ "   status: 0,"     
				+ "   startRow:" + dsRequest.startRow + ","     
				+ "   endRow:" + Integer.toString(dsRequest.startRow + length) + ","     
				+ "   totalRows:" + Integer.toString(dsResponce.totalRows) + ","     
				+ "   data:" 
				+ sw.toString()
				+ "  }"     
				+ "}";
			} else  { // -- Non-fetch command
				dsResponce.retCode = 0;
				dsResponce.retMsg = "[" + JsonMapper.writeValueAsString(dsRequest.data) + "]";
				String sTmp = "{"     
						+ " response:{"     
						+ (dsRequest.isTransaction ? "   queueStatus: 0," : "") // TODO -- Return transaction code here
						+ "   status:" + String.valueOf(dsResponce.retCode) + ","     
						+ "   data: " + dsResponce.retMsg  
						+ "} }";
				return sTmp; 
			}
		} else { // -- Error --- TODO: special for -4 ...
			dsResponce.retMsg = "\"" + dsResponce.retMsg + "\"";
			String sTmp = "{"     
					+ " response:{"     
					+ (dsRequest.isTransaction ? "   queueStatus: 0," : "") // TODO -- Return transaction code here
					+ "   status:" + String.valueOf(dsResponce.retCode) + ","     
					+ "   data: " + dsResponce.retMsg  
					+ "} }";
			return sTmp; 
		}
	}
	
	
	// ------------------------------- Private logic ------------------------------------
	/**
	 * ???
	 */
	private String fromImg(Object in) {
		if (in != null) {
		return (String)in; // <<< TODO Assymetric decription here!
		} else {
			return "";
		}
	}
	
	/**
	 * 	 * Sample:
	 * {
	 * 	"dataSource":"Equipment", 
	 *  "operationType":"fetch", 
	 *   "startRow":0, 
	 *   "endRow":100, 
	 *   "sortBy":[
	 *       "Description"
	 *   ], 
	 *   "textMatchStyle":"substring", 
	 *   "componentId":"isc_ListGrid_3", 
	 *   "data":{
	 *       "operator":"and", 
	 *       "_constructor":"AdvancedCriteria", 
	 *       "criteria":[
	 *           {
	 *               "fieldName":"Code", 
	 *               "operator":"iStartsWith", 
	 *               "value":"ZuZU"
	 *           },
	 *           {
	 *		       "operator":"or", 
	 *      		 "_constructor":"AdvancedCriteria", 
	 *  		     "criteria":[
	 *					{
	 *						"fieldName":"Code", 
	 *						"operator":"iStartsWith", 
	 *		               	"value":"ZuZU"
	 *           		}, 
	 *           		{
	 *						"operator":"equals", 
	 *						"fieldName":"Del", 
	 *						"value":false
	 *       		    }
	 *       		], 
	 *           }, 
	 *           {
	 *               "operator":"equals", 
	 *               "fieldName":"Del", 
	 *               "value":false
	 *           }
	 *       ], 
	 *       "currUser":"b82d29fc-615b-4c6d-90fc-dc0e0b145557", 
	 *       "itemImg":"34", 
	 *       "currDate":"2017-09-29T15:22:07.262Z", 
	 *       "currLang":"en-GB", 
	 *       "extraInfo":""
	 *   }, 
	 *   "oldValues":null
	 * }
	 * @param data (look at sample above)
	 * @return
	 */
	private CriteriaComplex formatRequestCriteria(DSRequest req){
		if (req.data.containsKey("operator")){
//			req.criteria.operator = (String)req.data.get("operator");
			
//			req.criteria.criterias = formatCriteria((Object[])req.data.get("criteria"));
		}
		
		return null;
	}
	
	private Criteria[] formatCriteria(Object[] crit){
		
		return null;
	}
	
	private Object testParse(){
		String sos = "{\n" +
				"    \"dataSource\":\"Feed\", \n" +
				"    \"operationType\":\"fetch\", \n" +
				"    \"startRow\":0, \n" +
				"    \"endRow\":100, \n" +
				"    \"sortBy\":[\n" +
				"        \"StartDate\"\n" +
				"    ], \n" +
				"    \"textMatchStyle\":\"substring\", \n" +
				"    \"componentId\":\"isc_ListGrid_0\", \n" +
				"    \"data\":{\n" +
//				"        \"type\":\"CriteriaComplex\", \n" +
				"        \"operator\":\"and\", \n" +
				"        \"_constructor\":\"AdvancedCriteria\", \n" +
				"        \"criteria\":[\n" +
				"            {\n" +
				"                \"type\":\"CriteriaItem\", \n" +
				"                \"fieldName\":\"Description\", \n" +
				"                \"operator\":\"iStartsWith\", \n" +
				"                \"value\":\"Кон\"\n" +
				"            }, \n" +
				"            {\n" +
				"                \"type\":\"CriteriaItem\", \n" +
				"                \"fieldName\":\"Description\", \n" +
				"                \"operator\":\"iStartsWith\", \n" +
				"                \"value\":\"Кон\"\n" +
				"            }, \n" +
/////////////////				
"            {\n" +
"             \"type\":\"CriteriaComplex\", \n" +
"             \"operator\":\"or\", \n" +
"             \"_constructor\":\"AdvancedCriteria\", \n" +
"             \"criteria\":[\n" +
"					{\n" +
"                       \"type\":\"CriteriaItem\", \n" +
"						\"fieldName\":\"Code\", \n" +
"						\"operator\":\"iStartsWith\", \n" +
"						\"value\":\"ZuZU\"\n" +
"					}, \n" +
"					{\n" +
"                       \"type\":\"CriteriaItem\", \n" +
"						\"operator\":\"equals\", \n" +
"						\"fieldName\":\"Del\", \n" +
"						\"value\":false\n" +
"					}\n" +
"				] \n" +
"			}, \n" +
///////////////				
				"            {\n" +
				"                \"type\":\"CriteriaItem\", \n" +
				"                \"fieldName\":\"Description\", \n" +
				"                \"operator\":\"iStartsWith\", \n" +
				"                \"value\":\"ЕЙОЕ\"\n" +
				"            }\n" +
				"        ], \n" +
				"        \"currUser\":\"f410ece9-659a-48ad-8ff3-23b06f5ac3e2\", \n" +
				"        \"itemImg\":\"29\", \n" +
				"        \"currDate\":\"2017-10-04T11:37:03.785Z\", \n" +
				"        \"currLang\":\"ru-RU\", \n" +
				"        \"extraInfo\":\"\"\n" +
				"    }, \n" +
				"    \"oldValues\":null\n" +
				"}";
		ObjectMapper JsonMapper = new ObjectMapper();
		DSRequest2 ds = new DSRequest2();
		try{
		   ds = (DSRequest2)JsonMapper.readValue(sos, ds.getClass());
		} catch (Exception ex) {
			
		}
		
		return ds;
	}
	
	
	private Object testParse2(){
		String sos = "{\n" +
				"    \"dataSource\":\"Feed\", \n" +
				"    \"operationType\":\"fetch\", \n" +
				"    \"startRow\":0, \n" +
				"    \"endRow\":100, \n" +
				"    \"sortBy\":[\n" +
				"        \"StartDate\"\n" +
				"    ], \n" +
				"    \"textMatchStyle\":\"substring\", \n" +
				"    \"componentId\":\"isc_ListGrid_0\", \n" +
				"    \"data\":{\n" +
				"        \"operator\":\"and\", \n" +
				"        \"_constructor\":\"AdvancedCriteria\", \n" +
				"        \"criteria\":[\n" +
				"            {\n" +
				"                \"fieldName\":\"Description\", \n" +
				"                \"operator\":\"iStartsWith\", \n" +
				"                \"value\":\"Кон\"\n" +
				"            }, \n" +
				"            {\n" +
				"                \"fieldName\":\"Description\", \n" +
				"                \"operator\":\"iStartsWith\", \n" +
				"                \"value\":\"Кон\"\n" +
				"            }, \n" +
/////////////////				
"            {\n" +
"             \"operator\":\"or\", \n" +
"             \"_constructor\":\"AdvancedCriteria\", \n" +
"             \"criteria\":[\n" +
"					{\n" +
"						\"fieldName\":\"Code\", \n" +
"						\"operator\":\"iStartsWith\", \n" +
"						\"value\":\"ZuZU\"\n" +
"					}, \n" +
"					{\n" +
"						\"operator\":\"equals\", \n" +
"						\"fieldName\":\"Del\", \n" +
"						\"value\":false\n" +
"					}\n" +
"				] \n" +
"			}, \n" +
///////////////				
				"            {\n" +
				"                \"fieldName\":\"Description\", \n" +
				"                \"operator\":\"iStartsWith\", \n" +
				"                \"value\":\"ЕЙОЕ\"\n" +
				"            }\n" +
				"        ], \n" +
				"        \"currUser\":\"f410ece9-659a-48ad-8ff3-23b06f5ac3e2\", \n" +
				"        \"itemImg\":\"29\", \n" +
				"        \"currDate\":\"2017-10-04T11:37:03.785Z\", \n" +
				"        \"currLang\":\"ru-RU\", \n" +
				"        \"extraInfo\":\"\"\n" +
				"    }, \n" +
				"    \"oldValues\":null\n" +
				"}";
		ObjectMapper JsonMapper = new ObjectMapper();
		
		UniquePropertyPolymorphicDeserializer<Criteria> deserializer = new UniquePropertyPolymorphicDeserializer<Criteria>(Criteria.class);
		deserializer.register("fieldName", CriteriaItem.class); // if "one" field is present, then it's a TestObjectOne
		deserializer.register("_constructor", CriteriaComplex.class); // if "two" field is present, then it's a TestObjectTwo
		
		// Add and register the UniquePropertyPolymorphicDeserializer to the Jackson module
		SimpleModule module = new SimpleModule("UniquePropertyPolymorphicDeserializer<Criteria>", 
				new Version(1, 0, 0, "", "", ""));	
		module.addDeserializer(Criteria.class, deserializer);
		JsonMapper.registerModule(module);
		
		DSRequest2 ds = new DSRequest2();
		try{
		   ds = (DSRequest2)JsonMapper.readValue(sos, ds.getClass());
		} catch (Exception ex) {
			
		}
		
		return ds;
	}

}
	
