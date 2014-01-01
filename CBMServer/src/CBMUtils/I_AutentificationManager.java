/**
 * 
 */
package CBMUtils;

/**
 * @author Alexander Mamchur
 *
 */
public interface I_AutentificationManager {
	
	/**
	 * @return current login
	 */
	public String getLogin();
	
	/**
	 * Generates session ID and RSA key pair
	 * @return String in format "{n:<PublicModulus>, e:<PublicExponent>, k:<SessionUID>}"
	 */
	public String initFirstKeys();
	
	/**
	 * Return credentials from Base64 encoded input string
	 * @param inputData Base64 encoded input string, containing "k:<SessionUID>,who:<RSAPub(login)>,Img:<RSAPub(Password)>,L:<locale>,B:<SystemInstance>"
	 * @return Array of strings [Login, Password, Locale, SystemInstance]
	 */
	public String[] decodeCredentials(String inputData, Integer newCounter); 
	
	/**
	 * 
	 * @param login
	 * @param password
	 * @return true if autentification succeeded
	 */
	public String identifyByCredentials(String login, String pass);
	
	/**
	 * 
	 * @param login
	 * @param sessionID
	 * @return
	 */
	public String identifyBySessionID(String sessionID, Integer newCounter);

	/**
	 * 
	 * @param login
	 * @param password
	 * @throws Exception
	 */
	public boolean registerNewUserProfile(String login, String password);

}
