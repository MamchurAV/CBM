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


/**
 * Class that prepare SmartClient requests in unified fo CBM I_Request form.
 *
 */
public class IscIOFormatter implements I_ClientIOFormatter {

	/**
	 * ------------ Interface implementation -----------------------
	 */
	@Override
	public DSTransaction formatRequest(Request request) throws Exception 
	{
		DSTransaction dsTransaction = new DSTransaction();
		
        String req = request.getEntityAsText();
		if (req == null){
			// TODO: to do something... :-) 
		}
		// Jackson JSON to JAVA conversion
		ObjectMapper JsonMapper = new ObjectMapper();
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
						// --- Language part extracting
						// TODO: Differentiate, switching on only for marked fields (considering too big...)
//						if (obj != null && obj.getClass() == String.class) {
//							obj = MultiLangStringProcessor.extractValue((String)obj, dsRequest.currLocale);
//						}
						row.put(column, "" + obj);
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

}
	
