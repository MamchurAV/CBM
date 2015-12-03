/**
 * 
 */
package CBMUtils;

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
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.crypto.Cipher;

import org.restlet.Request;
import org.restlet.engine.util.Base64;

import CBMServer.CBMStart;
import CBMServer.IDProvider;
import CBMServer.I_IDProvider;

/**
 * TODO: Describe this class logic - very important! 
 * @author Alexander Mamchur
 *
 */
public class CredentialsManager implements I_AutentificationManager {
	private String dbURL;
	private Connection dbCon = null;
	
	private String login = null;
	
	/**
	 * Current confirmed user login
	 */
	public String getLogin(){
		return login;
	}
	
	public CredentialsManager(){
		try {
			Class.forName(CBMStart.getParam("primaryDBDriver"));
			dbURL = CBMStart.getParam("primaryDBUrl");
			dbCon = DriverManager.getConnection(dbURL, "CBM", "cbm");
		} catch (SQLException ex) {
			System.out.println("SQLException: " + ex.getMessage());
			System.out.println("SQLState: " + ex.getSQLState());
			System.out.println("VendorError: " + ex.getErrorCode());
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}
	
	
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
		PubKeysString = "{ n:\"" + pubRSA.getModulus().toString(16) + "\", e:\"" + pubRSA.getPublicExponent().toString(16) + "\", k:\"" + UID + "\" }";
		
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
	

@Override
public String[] decodeCredentials(String inputData, int newCounter) {
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
	byte[] tmpArr = Base64.decode(strTmp);
	String initData = null;
	try {
		initData = new String(tmpArr, "UTF8");
	} catch (UnsupportedEncodingException e1) {
		e1.printStackTrace();
	}
	String firstSessionID = initData.substring(2, initData.indexOf(",img:"));

	try {
		Statement statement = dbCon.createStatement();
		ResultSet rs = statement.executeQuery("SELECT FirstKey FROM cbm.startsession WHERE idSession='" + firstSessionID + "'");
		if (rs.next()){
			privKeyString = rs.getString("FirstKey");
		}
		statement.close();
	} catch (Exception e) {
		e.printStackTrace();
	}
	Request.getCurrent().getCookies().removeAll("ItemImg");
	
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
//			String s1 = initData.substring(initData.indexOf(",who:") + 5, initData.indexOf(",Img:"));
			String s1 = initData.substring(initData.indexOf(",img:") + 5, initData.indexOf(",L:"));
			String s2 = initData.substring(initData.indexOf(",L:") + 3, initData.indexOf(",B:"));
			String s3 = initData.substring(initData.indexOf(",B:") + 3);
			Cipher c = Cipher.getInstance("RSA/ECB/PKCS1Padding");
			c.init(Cipher.DECRYPT_MODE, privKey);
			byte[] bufTmp = c.doFinal(javax.xml.bind.DatatypeConverter.parseHexBinary(s1));
//			byte[] bufPass = c.doFinal(javax.xml.bind.DatatypeConverter	.parseHexBinary(s2));
			String sTmp = new String(bufTmp, "UTF8");
//			out[0] = new String(bufLogin, "UTF8");
//			out[1] = new String(bufPass, "UTF8");
			out[0] = sTmp.substring(0, sTmp.indexOf(",img:"));
			out[1] = sTmp.substring(sTmp.indexOf(",img:") + 5, sTmp.indexOf(",tmp:"));
			out[2] = sTmp.substring(sTmp.indexOf(",tmp:") + 5);
			out[3] = s2;
			out[4] = s3;
		} catch (Exception ex) {
			ex.printStackTrace(System.err);
		}
		
		try {
			Statement statement = dbCon.createStatement();
			// TODO turn out[0] to parameter below
			statement.executeUpdate("UPDATE cbm.startsession SET Moment = CURRENT_TIMESTAMP, Who= '" + out[0] 
					+ "', Counter = " + String.valueOf(newCounter) 
					+ ", TmpKey = '" + out[2]
					+ "', Locale = '" + out[3]
					+ "', SystemInstance = '" + out[4]
					+ "' WHERE idSession='" + firstSessionID + "'");
			statement.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	return out;
}
	
	private void storeFirstKeys(String sessionID, String strKeys){
		
		try
		{
			Statement statement = dbCon.createStatement();
			dbCon.setAutoCommit(false);
			dbCon.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
			statement.executeUpdate("INSERT INTO cbm.startsession (idSession, Moment, FirstKey) VALUES ('" + sessionID + "', CURRENT_TIMESTAMP, '" + strKeys + "')");
			statement.executeUpdate("COMMIT");
			statement.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	
	public String identifyByCredentials(String login, String pass, boolean newUser){
		String passStored = null;
		
		// ---- Get stored password hash -------------
		try {
			Statement statement = dbCon.createStatement();
			ResultSet rs = statement.executeQuery("SELECT o.Img FROM cbm.outformat o INNER JOIN cbm.imgname i ON i.ImgCode=o.Code WHERE o.Ds='" + login + "'");
			if (rs.next()){
				passStored = rs.getString(1);
			}
			statement.close();
		} catch (Exception e) {
			e.printStackTrace(System.err);
		}

		// ------ Analyze credentials -----
		if (passStored != null) {
			if (BCrypt.checkpw(pass, passStored)) {
				this.login = login;
				return "OK";
			}
			else{
				return "Bad password entered! Try once more.";
			}
		}
		else if (newUser){
			if (registerNewUserProfile(login, pass)){
				this.login = login;
			return "OK";
			}
			else{
				return "Failed to register new user.";
			}
		} else {
			return "Your are not registered yet! Proceed with registration.";
		}
	} 

	
	public String identifyBySessionID(String sessionID, Integer newCounter){
		String outMsg = null;
		
		// ---- Get stored SessionID -------------
		try {
			Statement statement = dbCon.createStatement();
			dbCon.setAutoCommit(false);
			dbCon.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
			ResultSet rs = statement.executeQuery("SELECT ss.Who FROM cbm.startsession ss WHERE ss.idSession='" + sessionID + "'");
			if (rs.next()){
				// --- If found - OK
				this.login = rs.getString(1);
 				outMsg = "OK";
 				// --- Set with new Session ID
				statement.executeUpdate("UPDATE cbm.startsession SET Moment = CURRENT_TIMESTAMP, Counter='" + newCounter + "' WHERE idSession='" + sessionID + "'");
				statement.executeUpdate("COMMIT");
 			}
			else {
				// TODO Analyze emergency here!!! Not found == Bad sign!!!
				outMsg = "Not found User";
			}
			statement.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return outMsg;
	}


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
		Statement statement = dbCon.createStatement();
		dbCon.setAutoCommit(false);
		dbCon.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
		statement.executeUpdate("INSERT INTO CBM.outformat (Code,Ds,Img) VALUES ('" + UID + "','" + login + "','" + pw_hash + "')");
		statement.executeUpdate("INSERT INTO CBM.imgname (ID, NameCode, ImgCode) VALUES (" + idProvider.GetID() + ",'" + login + "','" + UID + "')");
		statement.executeUpdate("COMMIT");
		statement.close();
	} catch (Exception e) {
		e.printStackTrace();
	}
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
