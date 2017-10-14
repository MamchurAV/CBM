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
import CBMUtils.JSONUniquePropertyPolymorphicDeserializer;


/**
 * Class that prepare SmartClient requests in unified for CBM I_Request form.
 *
 */
public class IscIOFormatter implements I_ClientIOFormatter {

	private String tst = "{\n" +
			"\t\"dataSource\": \"UserRights\",\n" +
			"\t\"operationType\": \"fetch\",\n" +
			"\t\"operationId\": \"UserRights_fetch\",\n" +
			"\t\"startRow\": 0,\n" +
			"\t\"endRow\": 10000,\n" +
			"\t\"textMatchStyle\": \"exact\",\n" +
			"\t\"componentId\": \"(created directly)\",\n" +
			"\t\"data\": {\n" +
			"\t\t\"criteria\": {\n" +
			"\t\t\t\"_constructor\": \"AdvancedCriteria\",\n" +
			"\t\t\t\"operator\": \"and\",\n" +
			"\t\t\t\"criteria\": []\n" +
			"\t\t},\n" +
			"\t\t\"clientData\": {\n" +
			"\t\t\t\"currUser\": \"542b29de-428c-4fd3-9d90-93851f2c4256\",\n" +
			"\t\t\t\"itemImg\": \"1\",\n" +
			"\t\t\t\"currDate\": \"2017-10-14T18:50:02.549Z\",\n" +
			"\t\t\t\"currLocale\": \"ru-RU\",\n" +
			"\t\t\t\"extraInfo\": \"\"\n" +
			"\t\t}\n" +
			"\t},\n" +
			"\t\"oldValues\": null\n" +
			"}\n";
	
	// ------------ Interface implementation -----------------------
	
	/**
	 * Format ongoing requests
	 * 
	 */
	@Override
	public DSTransaction formatRequest(Request request) throws Exception 
	{
		DSTransaction dsTransaction = new DSTransaction();
        String reqStr = request.getEntityAsText();
		if (reqStr == null){
			// TODO: to do something... :-) 
			throw new Exception("Empty Request");
		}
		
		boolean isFetch = reqStr.contains("\"operationType\":\"fetch\"");
		// Jackson JSON to JAVA conversion
		ObjectMapper jsonMapper = new ObjectMapper();
//VVVVVVVVVVVVV		
//		testParse();	
//	
// ^^^^^^^^^^^^^
		if(reqStr.indexOf("\"transaction\":") >= 0
			&& reqStr.indexOf("\"operations\":")  >= 0
			&& reqStr.indexOf("\"transactionNum\":") >= 0)
		{
			reqStr = reqStr.substring(16, reqStr.length()-1);
			
			dsTransaction = (DSTransaction)jsonMapper.readValue(reqStr, dsTransaction.getClass());
			
			for (DSRequest dsRequest : dsTransaction.operations) {
				dsRequest.isTransaction = true;
				// Move parameters from request.data to DSRequest for usage in future query processing - for not to confusing them with Columns names.
//				dsRequest.itemImg = fromImg(DSreq.data.get("itemImg"));
//				dsRequest.data.remove("itemImg");
//				dsRequest.currUser = (String)DSreq.data.get("currUser");
//				dsRequest.forDate = new SimpleDateFormat("yyyy-MM-dd").parse((String)DSreq.data.get("currDate"));
//				dsRequest.data.remove("currUser");
//				dsRequest.currLocale = (String)DSreq.data.get("currLang");
//				dsRequest.data.remove("currLang");

//				DSreq.criteria = formatRequestCriteria(DSreq);
				
				// --- dsRequest preprocessing (for: 1. ID in linked data discovering - and - 2. provide full returned in response data---
				if (dsRequest.oldValues != null) {
					for (Map.Entry<String, Object> entry : dsRequest.oldValues.entrySet()) {
//						if (!DSreq.data.containsKey(entry.getKey())) {
//							DSreq.data.put(entry.getKey(), entry.getValue());
//						}
					}
				}

			}
		}
		else
		{
			DSRequest dsRequest = null;
			if (isFetch){
				dsRequest = (DSRequestSelect)formatDSCriteria(reqStr, jsonMapper);
			}
			else {
				dsRequest = (DSRequestUpdate)jsonMapper.readValue(reqStr, dsRequest.getClass());
				
				// --- dsRequest preprocessing (for: 1. ID in linked data discovering - and - 2. provide full returned in response data---
				if (dsRequest.oldValues != null) {
					for (Map.Entry<String, Object> entry : dsRequest.oldValues.entrySet()) {
						if (!((DSRequestUpdate)dsRequest).data.containsKey(entry.getKey())) {
							((DSRequestUpdate)dsRequest).data.put(entry.getKey(), entry.getValue());
						}
					}
				}
			}

			dsRequest.isTransaction = false;
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
				dsResponce.retMsg = "[" + JsonMapper.writeValueAsString(((DSRequestUpdate)dsRequest).data) + "]";
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
//	private CriteriaComplex formatRequestCriteria(DSRequest req){
//		if (req.data.containsKey("operator")){
////			req.criteria.operator = (String)req.data.get("operator");
//			
////			req.criteria.criterias = formatCriteria((Object[])req.data.get("criteria"));
//		}
//		
//		return null;
//	}
	
	private DSRequestSelect formatDSCriteria(String src, ObjectMapper jsonMapper ){
		JSONUniquePropertyPolymorphicDeserializer<Criteria> deserializer = new JSONUniquePropertyPolymorphicDeserializer<Criteria>(Criteria.class);
		deserializer.register("fieldName", CriteriaItem.class); // if "one" field is present, then it's a TestObjectOne
		deserializer.register("_constructor", CriteriaComplex.class); // if "two" field is present, then it's a TestObjectTwo
		
		// Add and register the UniquePropertyPolymorphicDeserializer to the Jackson module
		SimpleModule module = new SimpleModule("UniquePropertyPolymorphicDeserializer<Criteria>", 
				new Version(1, 0, 0, "", "", ""));	
		module.addDeserializer(Criteria.class, deserializer);
		jsonMapper.registerModule(module);
		
		DSRequestSelect ds = new DSRequestSelect();
		try{
		   ds = (DSRequestSelect)jsonMapper.readValue(src, ds.getClass());
		} catch (Exception ex) {
			
		}
		
		return ds;
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
		
		JSONUniquePropertyPolymorphicDeserializer<Criteria> deserializer = new JSONUniquePropertyPolymorphicDeserializer<Criteria>(Criteria.class);
		deserializer.register("fieldName", CriteriaItem.class); // if "one" field is present, then it's a TestObjectOne
		deserializer.register("_constructor", CriteriaComplex.class); // if "two" field is present, then it's a TestObjectTwo
		
		// Add and register the UniquePropertyPolymorphicDeserializer to the Jackson module
		SimpleModule module = new SimpleModule("UniquePropertyPolymorphicDeserializer<Criteria>", 
				new Version(1, 0, 0, "", "", ""));	
		module.addDeserializer(Criteria.class, deserializer);
		JsonMapper.registerModule(module);
		
		DSRequestSelect ds = new DSRequestSelect();
		try{
		   ds = (DSRequestSelect)JsonMapper.readValue(sos, ds.getClass());
		} catch (Exception ex) {
			
		}
		
		return ds;
	}

}
	
