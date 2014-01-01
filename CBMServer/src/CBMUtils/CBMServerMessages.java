/**
 * Collection of MultiLanguage strings for general purpose messaging 
 */
package CBMUtils;

/**
 * @author user
 *
 */
public class CBMServerMessages {
	
	private static MultiLangString noDBFound = new MultiLangString("No DB provider for data type found", "en");
    public static String noDBFound() { return noDBFound.getValue(); }

}
