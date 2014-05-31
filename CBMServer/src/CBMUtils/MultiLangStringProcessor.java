/**
 * String that may contains values in several languages 
 */
package CBMUtils;

/**
 * Class processing multilanguage parts in one string, prefixed by "~|ru-RU|" - like insertions.
 * String may contain single value w/o prefix (i.e. ordinal String).
 * Also may contain first unprefixed part (taken as default), and others - localized. 
 * 
 * @author Alexander Mamchur
 * 
 */
public final class MultiLangStringProcessor {

	public static String extractValue(String value, String locale) 
	{ 
		String out = value;
		int i = value.indexOf(locale + "|")-1; // Is there part for requested locale?
		if (i > 0) {
			String tmp = value.substring(i + 7);	
			if (tmp.indexOf("~|") > 0) { // The substring is not the last
				out = tmp.substring(0, value.indexOf("~|"));
			} else { // Requested substring was the last
				out = tmp;
			}
		} else if (value.indexOf("~|") > 0) { // Not requested locale, but others exists, so - get the first (default) part
			if (value.indexOf("~|") == 1) { // The first part are prefixed
				String tmp = value.substring(8);
				if (tmp.indexOf("~|") > 0) { // The substring is not the last
					out = tmp.substring(0, value.indexOf("~|"));
				} else { // Requested substring was the last
					out = tmp;
				}
				
			} else { // Value is the first and unprefixed part.
				out = value.substring(0, value.indexOf("~|"));
			}
		}
		return out; 
	}
	
	public String addValue(String src, String added, String loc) 
	{ 
		//TODO Update <value> adding part in noted by <loc> language
		return src; 
	}

}
