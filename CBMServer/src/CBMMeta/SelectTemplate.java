/**
 * Normalized Metadata for real DBMS-specific query constructing
 */
package CBMMeta;

import java.util.List;
import java.util.Map;

/**
 * @author Alexander Mamchur
 * Structure of MetaModel-defined SQL request - for DBMS-specific processing into real SQL string by appropriate I_DataBase provider.
 */
public class SelectTemplate {
	
	public Map<String,String> columns; // May be the whole sub-select string
	public String from;
	public String where;
	public String orderby;
	public String groupby;
	public String having;
	public List<SelectTemplate> union;
	
	// TODO Add setters/getters here ....

}
