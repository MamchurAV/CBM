/**
 * @author Alexander Mamchur
 *
 */
package CBMServer;

import org.restlet.Request;
import org.restlet.Response;
import org.restlet.data.CharacterSet;
import org.restlet.data.Cookie;
import org.restlet.data.CookieSetting;
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
	private String clientCode = null;
	private String locale = null;
	private String sysInstance = null;
	
	private String rightsDeterminedFilter;


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
			ex.printStackTrace(System.err);
		}
	}

	@Post("json")
	public String ProceedRequest() {
		I_DataBase currentDB = null;
		String outTrans = "[";
		String outSingleOper = null;

		switch (metaProvider.getDataBase(dsTransaction.operations.get(0))) {
		case "MySQL":
			currentDB = new MySQLDataBase();
			break;
		case "PosgreSql":
			currentDB = new PostgreSqlDataBase();
			break;
		case "DB2":
			currentDB = new DB2DataBase();
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

		// --- Proceed request 
		for (int i = 0; i < dsTransaction.operations.size(); i++) {
			DSRequest dsRequest = dsTransaction.operations.get(i);
			
			// --- Identify user and test rights for each operation in transaction
			String tstResult = testRights(dsRequest);
			if (!tstResult.equals("OK")) {
				return "//'\"]]>>isc_JSONResponseStart>>" + tstResult
						+ "//isc_JSONResponseEnd";
			}
			
			// --- Main request proceeding
			try {
				switch (dsRequest.operationType) {
				case "fetch": {
					outSingleOper = clientIOFormatter.formatResponce(
							currentDB.doSelect(metaProvider.getSelect(dsRequest),
									dsRequest), dsRequest);
					break;
				}
				case "add": {
					outSingleOper = clientIOFormatter.formatResponce(
							currentDB.doInsert(metaProvider.getColumnsInfo(dsRequest),
									dsRequest), dsRequest);
					break;
				}
				case "update": {
					outSingleOper = clientIOFormatter.formatResponce(
							currentDB.doUpdate(metaProvider.getColumnsInfo(dsRequest),
									dsRequest), dsRequest);
					break;
				}
				case "remove": {
					// TODO --- If "Del" property exists - switch to update set Del=true
					outSingleOper = clientIOFormatter.formatResponce(
							currentDB.doDelete(metaProvider.getDelete(dsRequest),
									dsRequest), dsRequest);
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
		return ProceedRequest();
	}

	@Put("json")
	public String doPut() {
		return ProceedRequest();
	}

	@Delete("json")
	public String doDelete() {
		return ProceedRequest();
	}

	
	
	// ------- !!! ??? HERE? !!! ---------
	private String testRights(DSRequest req) {

		DSResponce metaResponce = null;
//		String login = null;
		String pass = null;
//		String clientCode = null;
//		String locale = null;
//		String sysInstance = null;
		String outMsg = null;
		String badOut = null;

		// TODO: Distinguish between first and subsequent entries...

		// ------ Get credentials from cookie -----
		Cookie cook = Request.getCurrent().getCookies().getFirst("ItemImg");
		// ----- Initial autentification of user by strong password hash
		if (cook != null && !cook.getValue().equals("")) { // TODO Maybe not only cookie existence is sign for first check! 
			String sc = cook.getValue();
			String[] cookData = credMan.decodeCredentials(sc, Integer.parseInt(req.itemImg));
			login = cookData[0];
			pass = cookData[1];
			// Extract other data-access-related parameters 
			clientCode = cookData[2];
			locale = cookData[3];
			sysInstance = cookData[4];
			// Continue with rights resolving 
			outMsg = credMan.identifyByCredentials(login, pass);
			// --- Now it's time to clear cookies (by all means!) ---
	        CookieSetting cS1 = new CookieSetting(1, "ImgFirst", "" /*, "/", ".127.0.0.1"*/);
	        cS1.setMaxAge(0);
	        Response.getCurrent().getCookieSettings().add(cS1);
	        CookieSetting cS2 = new CookieSetting(1, "ItemImg", "" /*, "/", ".127.0.0.1"*/);
	        cS2.setMaxAge(0);
	        Response.getCurrent().getCookieSettings().add(cS2);
			Request.getCurrent().getCookies().removeAll("ImgFirst");
			Request.getCurrent().getCookies().removeAll("ItemImg");
		}
		// ----- Authenticate user by Session ID
		else {
			// ----- Get credentials from Data block -----
			outMsg = credMan.identifyBySessionID(req.currUser, Integer.parseInt(req.itemImg));
		}

		if (outMsg.equals("OK")){
			req.currUser = credMan.getLogin();
			// TODO: Resolve fine-grained rights for distinguished user and Request
			
			rightsDeterminedFilter = "1=1";
			
			return outMsg;
		}
		else{
			metaResponce = new DSResponce();
			metaResponce.retCode = -1;
			metaResponce.retMsg = outMsg;
			try {
				badOut = clientIOFormatter.formatResponce(metaResponce,	req);
			} catch (Exception e) {
				e.printStackTrace();
			}
			return badOut;
		}
	}

}
