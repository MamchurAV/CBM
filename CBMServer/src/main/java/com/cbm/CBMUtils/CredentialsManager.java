package com.cbm.CBMUtils;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.spec.RSAPrivateCrtKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HexFormat;

import javax.crypto.Cipher;
import javax.sql.DataSource;

import java.util.Base64;
import java.util.UUID;

import com.cbm.Main;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.http.Cookie;

import com.cbm.CBMPersistence.ConnectionPool;
import com.cbm.CBMServer.DSRequest;
import com.cbm.CBMServer.DSResponse;
import com.cbm.CBMServer.IDProvider;
import com.cbm.CBMServer.I_ClientIOFormatter;
import com.cbm.CBMServer.I_IDProvider;
import com.cbm.CBMServer.IscIOFormatter;

/**
 * TODO: Describe this class logic - very important! 
 * @author Alexander Mamchur
 *
 */
public class CredentialsManager implements I_AutentificationManager {
	private String login = null;

	private DataSource dataSource = ConnectionPool.getDataSource();

	//--------------------- First request processing in client work session -----------------------------
	/**
	 * First client request processing - create, store Private Key for sequential usage, 
	 * 		and returns Public Key (to store in cookie and send to client)
	 * No authentication on this phase are made. 
	 */
	public String initFirstKeys(){
		String PubKeysString;
		KeyPairGenerator kpg = null;
		RSAPublicKeySpec pubRSA = null;
		RSAPrivateCrtKeySpec privRSA = null;
		
		// --- Create RSA keys ---
		try {
			kpg = KeyPairGenerator.getInstance("RSA");
		} 
		catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		kpg.initialize(1024);
		KeyPair kp = kpg.genKeyPair();
		// ---
		try{
		KeyFactory kfRSA = KeyFactory.getInstance("RSA");
		pubRSA = kfRSA.getKeySpec(kp.getPublic(), RSAPublicKeySpec.class);
		privRSA = kfRSA.getKeySpec(kp.getPrivate(), RSAPrivateCrtKeySpec.class);
		}
		catch  (Exception ex) {
			ex.printStackTrace(System.err);
		}

		// --- Initial Session ID creation  ---
		String UID = java.util.UUID.randomUUID().toString();
		
		// --- Set Output string for keys ---
		PubKeysString = "{ \"n\":\"" + pubRSA.getModulus().toString(16) + "\", \"e\":\"" + pubRSA.getPublicExponent().toString(16) + "\", \"k\":\"" + UID + "\" }";
//		String PubKeysStringRaw = "{ n:\"" + pubRSA.getModulus().toString(16) + "\", e:\"" + pubRSA.getPublicExponent().toString(16) + "\", k:\"" + UID + "\" }";
//		PubKeysString = Base64.getUrlEncoder().encodeToString(PubKeysStringRaw.getBytes());

		// --- Store private for decrypt answer
		storeFirstKeys(UID, "n:" + privRSA.getModulus().toString() 
				+ ", e:" + privRSA.getPublicExponent().toString() 
				+ ", d:" + privRSA.getPrivateExponent().toString() 
				+ ", p:" + privRSA.getPrimeP().toString() 
				+ ", q:" + privRSA.getPrimeQ().toString() 
				+ ", pe:" + privRSA.getPrimeExponentP().toString() 
				+ ", pq:" + privRSA.getPrimeExponentQ().toString() 
				+ ", k:" + privRSA.getCrtCoefficient().toString());
		
		return PubKeysString;
	}
	
	
	/**
	 * Stores single-time initial keys, sent to client for sequential usage.
	 * (Process full DB cycle and release (close) used connection)
	 * @param sessionID
	 * @param strKeys
	 */
	private void storeFirstKeys(String sessionID, String strKeys){
		try
		{
            Connection dbCon = dataSource.getConnection();
			PreparedStatement pstmt = dbCon.prepareStatement(
				"INSERT INTO cbm.startsession (idSession, Moment, FirstKey) VALUES (?, CURRENT_TIMESTAMP, ?)");
			pstmt.setObject(1, UUID.fromString(sessionID));
			pstmt.setString(2, strKeys);
			pstmt.executeUpdate();
			pstmt.close();
			dbCon.close();
		} catch (SQLException ex) {
			System.out.println("SQLException: " + ex.getMessage());
			System.out.println("SQLState: " + ex.getSQLState());
			System.out.println("VendorError: " + ex.getErrorCode());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	//--------------------- Sequential requests authorization functions while client work session ---------------------
	// --- All utilizes one DB connection during client request processing cycle ---
	/**
	*
	*/
	public String testRights(DSRequest req) {
		DSResponse metaResponse = null;
		String pass = null;
		String outMsg = null;
		String badOut = null;
		I_ClientIOFormatter clientIOFormatter = new IscIOFormatter();
		HttpServerResponse response = req.rawRequest.response();

		// ------ Get credentials from cookie -----
		Cookie cook = req.rawRequest.getCookie("ItemImg");
		// ----- Initial authentication of user by strong password hash
		if (cook != null && !cook.getValue().equals("")) { // TODO Maybe not only cookie existence is sign for first check! 
			String sc = cook.getValue();
			String[] cookData = decodeCredentials(sc, Integer.parseInt(req.data.clientData.itemImg), req);
			login = cookData[0] != null ? cookData[0].trim() : null;
			pass = cookData[1];
			if (login != null && pass != null) {
				// Extract other data-access-related parameters 
				// TODO: Distinguish between first and subsequent entries...
				boolean newUser = false;
				if(req.data.clientData.extraInfo != null && req.data.clientData.extraInfo.contains("usReg")){
					newUser = true;
				}
				// Continue with rights resolving 
				outMsg = identifyByCredentials(login, pass, newUser);
				// --- Now it's time to clear cookies (by all means!) ---
				Cookie cS1 = io.vertx.core.http.Cookie.cookie("ImgFirst",  "" /*, "/", ".127.0.0.1"*/);
				cS1.setMaxAge(0);
		        response.addCookie(cS1);
				Cookie cS2 = io.vertx.core.http.Cookie.cookie( "ItemImg", "" /*, "/", ".127.0.0.1"*/);
				cS1.setMaxAge(0);
				response.addCookie(cS2);
				req.rawRequest.removeCookie("ImgFirst");
				req.rawRequest.removeCookie("ItemImg");
			} else {
				// TODO use localized message from CBMServerMessages class here. Temporary variant below
 				outMsg = "Перезагрузите страницу"; //Вы произвели перезагрузку страницы, (либо сработала загрузка ранее загруженной страницы), тогда как для старта приложения нужно войти через SBMStart. Повторите попытку использовав ссылку заканчивающуюся на CBMStart";
// 				outMsg = "You seems to use <Reload> page, instead of real relogin. Use CBMStart URL please to login.";
			}
		}
		// ----- Authenticate user by Session ID
		else {
			// ----- Get credentials from Data block -----
			outMsg = identifyBySessionID(req.data.clientData.currUser, Integer.parseInt(req.data.clientData.itemImg));
		}

		if (outMsg != null && outMsg.equals("OK")){
			req.data.clientData.currUser = getLogin();
			
			// TODO: !!! HERE !!! Resolve fine-grained rights for distinguished user and Reques

			// 			rightsDeterminedFilter = "1=1";
			
			return outMsg;
		}
		else{
			metaResponse = new DSResponse();
			metaResponse.retCode = -1;
			metaResponse.retMsg = outMsg;
			try {
				badOut = clientIOFormatter.formatResponse(metaResponse,	req);
			} catch (Exception e) {
				e.printStackTrace();
			}
			return badOut;
		}
	}


	/**
	 * After initial contact - used once to authenticate user in first (and only with password hash) request  
	 */
	@Override
	public String[] decodeCredentials(String inputData, int newCounter, DSRequest req) {

		String privKeyString = null;
		String strTmp = null;
		String[] out = new String[5];
	
		if (inputData.endsWith("%3D%3D%3D")) {
			strTmp = inputData.substring(0, inputData.length() - 9) + "===";
		} else if (inputData.endsWith("%3D%3D")) {
			strTmp = inputData.substring(0, inputData.length() - 6) + "==";
		} else if (inputData.endsWith("%3D")) {
			strTmp = inputData.substring(0, inputData.length() - 3) + "=";
		} else {
			strTmp = inputData;
		}
		byte[] tmpArr = Base64.getMimeDecoder().decode(strTmp);
		String initData = null;
		try {
			initData = new String(tmpArr, "UTF8");
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		String firstSessionID = initData.substring(2, initData.indexOf(",img:"));
	
		try {
			Connection dbCon = dataSource.getConnection();
			String tmpSql = "SELECT FirstKey FROM cbm.startsession WHERE idSession = ?";
			PreparedStatement pstmt = dbCon.prepareStatement(tmpSql);
			pstmt.setObject(1, UUID.fromString(firstSessionID));
			ResultSet rs = pstmt.executeQuery();
			if (rs.next()){
				privKeyString = rs.getString("FirstKey");
			}
			pstmt.close();
			dbCon.close();
		} catch (SQLException ex) {
			System.out.println("SQLException: " + ex.getMessage());
			System.out.println("SQLState: " + ex.getSQLState());
			System.out.println("VendorError: " + ex.getErrorCode());
		} catch (Exception e) {
			e.printStackTrace();
		}

		req.rawRequest.removeCookie("ItemImg");

		if (privKeyString != null){
			String sModulus = privKeyString.substring(2,privKeyString.indexOf(", e:"));
			String sPublicExponent = privKeyString.substring(privKeyString.indexOf(", e:") + 4,	privKeyString.indexOf(", d:"));
			String sPrivateExponent = privKeyString.substring(privKeyString.indexOf(", d:") + 4, privKeyString.indexOf(", p:"));
			String sPrimeP = privKeyString.substring(privKeyString.indexOf(", p:") + 4,	privKeyString.indexOf(", q"));
			String sPrimeQ = privKeyString.substring(privKeyString.indexOf(", q:") + 4,	privKeyString.indexOf(", pe:"));
			String sPrimeExponentP = privKeyString.substring(privKeyString.indexOf(", pe:") + 5, privKeyString.indexOf(", pq:"));
			String sPrimeExponentQ = privKeyString.substring(privKeyString.indexOf(", pq:") + 5, privKeyString.indexOf(", k:"));
			String sCrtCoefficient = privKeyString.substring(privKeyString.indexOf(", k:") + 4);
			BigInteger modulus = new BigInteger(sModulus);
			BigInteger publicExponent = new BigInteger(sPublicExponent);
			BigInteger privateExponent = new BigInteger(sPrivateExponent);
			BigInteger primeP = new BigInteger(sPrimeP);
			BigInteger primeQ = new BigInteger(sPrimeQ);
			BigInteger primeExponentP = new BigInteger(sPrimeExponentP);
			BigInteger primeExponentQ = new BigInteger(sPrimeExponentQ);
			BigInteger crtCoefficient = new BigInteger(sCrtCoefficient);

			// ------ Get privKey -------
			PrivateKey privKey = null;
			try {
				KeyFactory kfRSA = KeyFactory.getInstance("RSA");
				RSAPrivateCrtKeySpec ks = new RSAPrivateCrtKeySpec(modulus,
						publicExponent, privateExponent, primeP, primeQ,
						primeExponentP, primeExponentQ, crtCoefficient);
				privKey = kfRSA.generatePrivate(ks);
			} catch (Exception ex) {
				ex.printStackTrace(System.err);
			}
			try {
				String s1 = initData.substring(initData.indexOf(",img:") + 5, initData.indexOf(",L:"));
				String s2 = initData.substring(initData.indexOf(",L:") + 3, initData.indexOf(",B:"));
				String s3 = initData.substring(initData.indexOf(",B:") + 3);
				Cipher c = Cipher.getInstance("RSA/ECB/PKCS1Padding");
				c.init(Cipher.DECRYPT_MODE, privKey);
				byte[] bufTmp = c.doFinal(HexFormat.of().parseHex(s1));
				String sTmp = new String(bufTmp, "UTF8");
				out[0] = sTmp.substring(0, sTmp.indexOf(",img:"));
				out[1] = sTmp.substring(sTmp.indexOf(",img:") + 5, sTmp.indexOf(",tmp:"));
				out[2] = sTmp.substring(sTmp.indexOf(",tmp:") + 5);
				out[3] = s2;
				out[4] = s3;
			} catch (Exception ex) {
				ex.printStackTrace(System.err);
			}

			try {
				Connection dbCon = dataSource.getConnection();
				String tmpSql = "UPDATE cbm.startsession SET Moment = CURRENT_TIMESTAMP, Who = ?, Counter = ?, TmpKey = ?, Locale = ?, SystemInstance = ? WHERE idSession = ?";
				PreparedStatement pstmt = dbCon.prepareStatement(tmpSql);
				pstmt.setString(1, out[0].trim());
				pstmt.setInt(2, newCounter);
				pstmt.setObject(3, UUID.fromString(out[2]));
				pstmt.setString(4, out[3]);
				pstmt.setString(5, out[4]);
				pstmt.setObject(6, UUID.fromString(firstSessionID));
				int result = pstmt.executeUpdate();
// >>>				dbCon.commit();
				pstmt.close();
				dbCon.close();
			} catch (SQLException ex) {
				System.out.println("SQLException: " + ex.getMessage());
				System.out.println("SQLState: " + ex.getSQLState());
				System.out.println("VendorError: " + ex.getErrorCode());
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return out;
	}


	/**
	 * First (after initial contact) client request for Data - intended to made authentication once this time.
	 */
	public String identifyByCredentials(String login, String pass, boolean newUser){

		String passStored = null;

		// ---- Get stored password hash ---
		try {
			Connection dbCon = dataSource.getConnection();
			String tmpSql = "SELECT o.Img FROM cbm.outformat o INNER JOIN cbm.imgname i ON i.ImgCode=o.Code WHERE o.Ds = ?";
			PreparedStatement pstmt = dbCon.prepareStatement(tmpSql);
			pstmt.setString(1, login);
			ResultSet rs = pstmt.executeQuery();
			if (rs.next()){
				passStored = rs.getString(1);
			}
			pstmt.close();
			dbCon.close();
		} catch (SQLException ex) {
			System.out.println("SQLException: " + ex.getMessage());
			System.out.println("SQLState: " + ex.getSQLState());
			System.out.println("VendorError: " + ex.getErrorCode());
		} catch (Exception e) {
			e.printStackTrace(System.err);
		}

		// ------ Analyze credentials ---
		if (passStored != null) {
			if (BCrypt.checkpw(pass, passStored)) {
				this.login = login;
				return "OK";
			}
			else{
				// TODO use localized message from CBMServerMessages class here. Temporary variant below
				return "Введеный пароль не прошел проверку! Введите правильный пароль.";
//				return "Bad password entered! Try once more.";
			}
		}
		else if (newUser){
			if (registerNewUserProfile(login, pass)){
				this.login = login;
			return "OK";
			}
			else{
				// TODO use localized message from CBMServerMessages class here. Temporary variant below
				return "Не удалось зарегистрировать нового пользователя.";
//				return "Failed to register new user.";
			}
		} else {
			// TODO use localized message from CBMServerMessages class here. Temporary variant below
			return "Ваш логин не зарегистрирован в системе! Если Вы заходите впервые - воспользуйтесь режимом регистрации.";
//			return "Your are not registered yet! Proceed with registration.";
		}
	} 

	
	/**
	 * Sequential lightweight authentication while client requests  
	 */
	public String identifyBySessionID(String sessionID, Integer newCounter){
		String outMsg = null;
		
		// ---- Get stored SessionID ---
		try {
			Connection dbCon = dataSource.getConnection();
			dbCon.setAutoCommit(false);
			dbCon.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
			String tmpSql = "SELECT ss.Who FROM cbm.startsession ss WHERE ss.idSession = ?";
			PreparedStatement pstmt = dbCon.prepareStatement(tmpSql);
			pstmt.setObject(1, UUID.fromString(sessionID));
			ResultSet rs = pstmt.executeQuery();
			if (rs.next()){
				// --- If found - OK
				this.login = rs.getString(1);
 				outMsg = "OK";
 				// --- Set with new Session ID
				String tmpSqlIn = "UPDATE cbm.startsession SET Moment = CURRENT_TIMESTAMP, Counter = ? WHERE idSession = ?";
				PreparedStatement pstmtIn = dbCon.prepareStatement(tmpSqlIn);
				pstmtIn.setInt(1, newCounter);
				pstmtIn.setObject(2, UUID.fromString(sessionID));
				pstmtIn.executeUpdate();
				dbCon.commit();
				pstmtIn.close();
			} else {
				// TODO Analyze emergency here!!! Not found == Bad sign!!!
//				outMsg = "Not found User (while sequential, not first, request)";
 				// TODO use localized message from CBMServerMessages class here. Temporary variant below
				outMsg = "Вы не обращались к серверу более  " + Main.getParam("inactivityInterval") + " часов. Вам придется перевойти в программу.";
//				outMsg = "You seems to be inactive for more than " + CBMStart.getParam("inactivityInterval") + " hours. Relogin please.";
			}
			pstmt.close();
			dbCon.close();
		} catch (SQLException ex) {
			System.out.println("SQLException: " + ex.getMessage());
			System.out.println("SQLState: " + ex.getSQLState());
			System.out.println("VendorError: " + ex.getErrorCode());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return outMsg;
	}

	/**
	 * Current _confirmed_ user login
	 * (used after user identification)
	 */
	public String getLogin(){
		return login;
	}


	//---------------------- The case of new user registration -----------------------------
/**
 * New user credentials registering
 * 
 * @throws Exception
 */
public boolean registerNewUserProfile(String login, String pass){
	String pw_hash = BCrypt.hashpw(pass, BCrypt.gensalt());
	String UID = java.util.UUID.randomUUID().toString();
	I_IDProvider idProvider = new IDProvider();

	try {
		Connection dbCon = dataSource.getConnection();
		dbCon.setAutoCommit(false);
		dbCon.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
		PreparedStatement pstmt1 = dbCon.prepareStatement(
			"INSERT INTO CBM.outformat (Code, Ds, Img) VALUES (?, ?, ?)");
		pstmt1.setString(1, UID);
		pstmt1.setString(2, login);
		pstmt1.setString(3, pw_hash);
		pstmt1.executeUpdate();

		PreparedStatement pstmt2 = dbCon.prepareStatement(
			"INSERT INTO CBM.imgname (ID, NameCode, ImgCode) VALUES (?, ?, ?)");
		pstmt2.setString(1, idProvider.GetID());
		pstmt2.setString(2, login);
		pstmt2.setString(3, UID);
		pstmt2.executeUpdate();

		dbCon.commit();
		pstmt1.close();
		pstmt2.close();
		dbCon.close();
	} catch (SQLException ex) {
		System.out.println("SQLException: " + ex.getMessage());
		System.out.println("SQLState: " + ex.getSQLState());
		System.out.println("VendorError: " + ex.getErrorCode());
	} catch (Exception e) {
		e.printStackTrace();
	}  /* finally {
	    try {
	        if(statement != null) statement.close();
	        if(dbCon != null) dbCon.close();
	    } catch(SQLException ex) {
	    	ex.printStackTrace();
	    } finally {  // Just to make sure that both con and stat are "garbage collected"
	    	statement = null;
	    	dbCon = null;
	    }
	}*/

	return true;
}

//	public void saveToFile(String fileName,  BigInteger mod, BigInteger exp) throws IOException {
//		  ObjectOutputStream oout = new ObjectOutputStream(new BufferedOutputStream(new FileOutputStream(fileName)));
//		  try {
//		    oout.writeObject(mod);
//		    oout.writeObject(exp);
//		  } catch (Exception e) {
//		    throw new IOException("Unexpected error", e);
//		  } finally {
//		    oout.close();
//		  }
//	}
	
	   
// ----------- Functions for big data RSA proceeding -------------
// ------------(not used yet) ------------------------------------	
//	public String RSAdec(PrivateKey key, byte [] in) throws Exception {
//		    Cipher c = Cipher.getInstance("RSA/ECB/PKCS1Padding"); //RSA/NONE/NoPadding  RSA/ECB/NoPadding
//		    c.init(Cipher.DECRYPT_MODE, key);
//
//		    String result = "";
//		    byte[] part = new byte[100];
//		    int l = in.length;
//		    int i = 0;
//		    while(i+100<=l) {
//		        System.arraycopy(in, i, part, 0, part.length);
//		        result = result + new String(c.doFinal(part), "UTF-8");
//		        i= i+100;
//		    }
//		    return result;
//		}
//	   
//	    public byte[] RSAenc(PrivateKey key, String in) throws Exception {
//		    Cipher c = Cipher.getInstance("RSA");
//		    c.init(Cipher.ENCRYPT_MODE, key);
//		    int l = in.length();
//
//		    byte[] part;
//		    byte[] result = new byte[(int)(64*java.lang.Math.ceil(l/20.0))];
//		    int i = 0;
//		    while(i*20+20<l) {
//		        part = c.doFinal(in.substring(i*20,i*20+19).getBytes("UTF-8"));
//		        System.arraycopy(part, 0, result, i*64, part.length);
//		        i = i+1;
//		    }
//		    part = c.doFinal(in.substring(i*20,l-1).getBytes("UTF-8"));
//		    System.arraycopy(part, 0, result, i*64, part.length);
//		    return result;
//		}

	
}
