/**
 * @author Alexander Mamchur
 *
 */
package CBMServer;

import org.restlet.Request;
import org.restlet.data.CharacterSet;
import org.restlet.data.MediaType;
import org.restlet.representation.Representation;
import org.restlet.resource.Delete;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.Put;
import org.restlet.resource.ServerResource;

import CBMMeta.I_StorageMetaData;
import CBMMeta.StorageMetaData;
import CBMPersistence.I_DataBase;
import CBMPersistence.MSSqlDataBase;
import CBMPersistence.DB2DataBase;
import CBMPersistence.MySQLDataBase;
import CBMPersistence.PostgreSqlDataBase;
import CBMUtils.CBMServerMessages;
import CBMUtils.CredentialsManager;
import CBMUtils.I_AutentificationManager;


/**
 * Main data_access-like operations provider.
 */
public class DataAccessService extends ServerResource {
	private DSTransaction dsTransaction = new DSTransaction();
	private I_ClientIOFormatter clientIOFormatter = new IscIOFormatter();
	private I_StorageMetaData metaProvider = new StorageMetaData();
	private I_AutentificationManager credMan = new CredentialsManager();
	
	private String login = null;
//	String pass = null;
//	private String clientCode = null;
//	private String locale = null;
//	private String sysInstance = null;
	
//	private String rightsDeterminedFilter;


	public DataAccessService() {
		// Adjust some [maybe] missing request parameters
		Request request = Request.getCurrent();
        Representation rep = request.getEntity();
        rep.setCharacterSet(CharacterSet.UTF_8);
        rep.setMediaType(MediaType.APPLICATION_JSON);
        request.setEntity(rep);
		try {
	        // Additional ingoing processing.
			dsTransaction = clientIOFormatter.formatRequest(request);
		} catch (Exception ex) {
			if (ex.getMessage().equals("Empty Request")){
				dsTransaction = new DSTransaction();
				dsTransaction.transactionNum = -2;
			} else {
				ex.printStackTrace(System.err);
			}
		}
	}

	@Post("json")
	public String ProcessRequest() {
		I_DataBase currentDB = null;
		String outTrans = "[";
		String outSingleOper = null;
		
		if (dsTransaction.transactionNum == -2
			|| dsTransaction.operations.size() == 0) {
			return "//'\"]]>>isc_JSONResponseStart>>" + CBMServerMessages.noRequestInterior() + Request.getCurrent().toString() + "//isc_JSONResponseEnd";
		}
		
		String dbName = metaProvider.getDataBase(dsTransaction.operations.get(0));
		if (dbName == null){
			dbName = CBMStart.getParam("primaryDBType");
		}
		switch (dbName) {
		// TODO (info - dsTransaction.operations.get(0) are not used till now in  metaProvider.getDataBase() - is mocked there!)
		case "PostgreSql":
			currentDB = new PostgreSqlDataBase();
			break;
		case "DB2":
			currentDB = new DB2DataBase();
			break;
		case "MySQL":
			currentDB = new MySQLDataBase();
			break;
		case "MSSQL":
			currentDB = new MSSqlDataBase();
			break;
		}
		if (currentDB == null) {
			return "//'\"]]>>isc_JSONResponseStart>>"
					+ CBMServerMessages.noDBFound() + "//isc_JSONResponseEnd";
		}

		// --- If more then one operation in request - explicitly start transaction 
		if (dsTransaction.operations.size() > 1) {
			try {
				currentDB.doStartTrans();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		// --- Process request 
		for (int i = 0; i < dsTransaction.operations.size(); i++) {
			DSRequest dsRequest = dsTransaction.operations.get(i);
			
			// --- Identify user and test rights for each operation in transaction
			String tstResult = credMan.testRights(dsRequest);
			if (!tstResult.equals("OK")) {
				return "//'\"]]>>isc_JSONResponseStart>>" + tstResult
						+ "//isc_JSONResponseEnd";
			}
			
			// --- Main request processing
			try {
				switch (dsRequest.operationType) {
				case "fetch": {
					// In case of Select - we must manually free DB resources after utilized.
					DSResponse response = currentDB.doSelect(metaProvider.getSelect(dsRequest), dsRequest);
					outSingleOper = clientIOFormatter.formatResponse(response, dsRequest);
					response.releaseDB();
					break;
				}
				case "add": {
					outSingleOper = clientIOFormatter.formatResponse(
							currentDB.doInsert(metaProvider.getColumnsInfo(dsRequest), dsRequest),
							dsRequest);
					break;
				}
				case "update": {
					outSingleOper = clientIOFormatter.formatResponse(
							currentDB.doUpdate(metaProvider.getColumnsInfo(dsRequest), dsRequest),
							dsRequest);
					break;
				}
				case "remove": {
					// TODO --- If "Del" property exists - switch to update set Del=true
					outSingleOper = clientIOFormatter.formatResponse(
							currentDB.doDelete(metaProvider.getDelete(dsRequest), dsRequest),
							dsRequest);
					break;
				}
				}
			} catch (Exception e) {
				e.printStackTrace(System.err);
			}
			if (dsRequest.isTransaction) {
				outTrans += outSingleOper;
				if (i < dsTransaction.operations.size() - 1) {
					outTrans += ",";
				}
			}
		}

		if (dsTransaction.operations.size() > 1) {
			try {
				currentDB.doCommit();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			return "//'\"]]>>isc_JSONResponseStart>>" + outTrans
					+ "]//isc_JSONResponseEnd";
		} else {
			return "//'\"]]>>isc_JSONResponseStart>>" + outSingleOper
					+ "//isc_JSONResponseEnd";
		}
	}

	/**
	 * Unifies all http requests to @Post form (like Isomorphic SmartClient in some
	 * modes does)
	 * --------------------------------------------------------------
	 * ------------------------------------------
	 */
	@Get("json")
	public String doGet() {
		return ProcessRequest();
	}

	@Put("json")
	public String doPut() {
		return ProcessRequest();
	}

	@Delete("json")
	public String doDelete() {
		return ProcessRequest();
	}

	
	
	// ------- !!! ??? HERE? !!! ---------
//	private String testRights(DSRequest req) {
//
//		DSResponse metaResponse = null;
////		String login = null;
//		String pass = null;
////		String clientCode = null;
////		String locale = null;
////		String sysInstance = null;
//		String outMsg = null;
//		String badOut = null;
//
//		// ------ Get credentials from cookie -----
//		Cookie cook = Request.getCurrent().getCookies().getFirst("ItemImg");
//		// ----- Initial autentification of user by strong password hash
//		if (cook != null && !cook.getValue().equals("")) { // TODO Maybe not only cookie existence is sign for first check! 
//			String sc = cook.getValue();
//			String[] cookData = credMan.decodeCredentials(sc, Integer.parseInt(req.itemImg));
//			login = cookData[0];
//			pass = cookData[1];
//			// Extract other data-access-related parameters 
////			clientCode = cookData[2];
////			locale = cookData[3];
////			sysInstance = cookData[4];
//			// TODO: Distinguish between first and subsequent entries...
//			boolean newUser = false;
//			if(req.extraInfo != null && req.extraInfo.contains("usReg")){
//				newUser = true;
//			}
//			// Continue with rights resolving 
//			outMsg = credMan.identifyByCredentials(login, pass, newUser);
//			// --- Now it's time to clear cookies (by all means!) ---
//	        CookieSetting cS1 = new CookieSetting(1, "ImgFirst", "" /*, "/", ".127.0.0.1"*/);
//	        cS1.setMaxAge(0);
//	        Response.getCurrent().getCookieSettings().add(cS1);
//	        CookieSetting cS2 = new CookieSetting(1, "ItemImg", "" /*, "/", ".127.0.0.1"*/);
//	        cS2.setMaxAge(0);
//	        Response.getCurrent().getCookieSettings().add(cS2);
//			Request.getCurrent().getCookies().removeAll("ImgFirst");
//			Request.getCurrent().getCookies().removeAll("ItemImg");
//		}
//		// ----- Authenticate user by Session ID
//		else {
//			// ----- Get credentials from Data block -----
//			outMsg = credMan.identifyBySessionID(req.currUser, Integer.parseInt(req.itemImg));
//		}
//
//		if (outMsg.equals("OK")){
//			req.currUser = credMan.getLogin();
//			
//			// TODO: Resolve fine-grained rights for distinguished user and Request
//			
////			rightsDeterminedFilter = "1=1";
//			
//			return outMsg;
//		}
//		else{
//			metaResponse = new DSResponse();
//			metaResponse.retCode = -1;
//			metaResponse.retMsg = outMsg;
//			try {
//				badOut = clientIOFormatter.formatResponse(metaResponse,	req);
//			} catch (Exception e) {
//				e.printStackTrace();
//			}
//			return badOut;
//		}
//	}

}
