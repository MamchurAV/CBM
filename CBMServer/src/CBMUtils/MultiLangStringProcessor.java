package CBMUtils;

/**
 * Class processing multilanguage parts in one string, prefixed by "~|lo-LO|" - like insertions. 
 * String may contain single value w/o prefix (i.e. ordinal String). 
 * Also may contain first unprefixed part (taken as default), and others - localized.
 * 
 * @author Alexander Mamchur
 * 
 */
public final class MultiLangStringProcessor {

	public static String extractValue(String value, String locale) {
		// --- If string is not multi language - return it as is
		if (value.indexOf("~|") == -1) {
			return value;
		}

		// --- For multilanguage string - try to find requested language part, 
		// and if not found - returns first part, no matter prefixed by locale  or not.
		String out = value;
		int i = value.indexOf("~|" + locale ); // Is there part for  requested locale?
		if (i != -1) { // Locale exists
			String tmp = value.substring(i);
			i = tmp.indexOf("~|", 1);
			if ( i != -1) { // The substring is not the last
				out = tmp.substring(0, i);
			} else {
				out = tmp;
			}
		} else { // No requested locale - get first. TODO: first temporary. Change to get next in language substitution list. 
			i = value.indexOf("~|", 1);
			if (i != -1) { // Some successor other-locale exists
				out = value.substring(0, i);
			}
		}

		return out;
	}

	public String addValue(String src, String added, String loc) {
		// TODO Update <value> adding part in noted by <loc> language
		return src;
	}

}
