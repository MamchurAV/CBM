/**
 * Collection of MultiLanguage strings for general purpose messaging 
 */
package CBMUtils;

/**
 * @author user
 *
 */
public class CBMServerMessages {
	
    public static String noDBFound() { return MultiLangStringProcessor.extractValue("~|en-GB|No DB provider for data type found", "en-GB"); }
    public static String noRequestInterior() { return MultiLangStringProcessor.extractValue("~|en-GB|Request arrived looks empty: ", "en-GB"); }

}
