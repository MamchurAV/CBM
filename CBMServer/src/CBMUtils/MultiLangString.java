/**
 * String that may contains values in several languages 
 */
package CBMUtils;

/**
 * @author user
 *
 */
public class MultiLangString {

	private String value;

	public MultiLangString(String str){
		value = str;
	}
	
	public MultiLangString(String str, String loc){
		//TODO Update <value> adding part in noted by <loc> language
		value = str;
	}
	
	public String getValue() { return value; }
	public String getValue(String loc) 
	{ 
		//TODO extract and return appropriate string part that are in <loc> language
		return value; 
	}
	
	public void setValue(String str) { value = str; }
	public void setValue(String str, String loc) 
	{ 
		//TODO Update <value> adding part in noted by <loc> language
		value = str; 
	}

}
