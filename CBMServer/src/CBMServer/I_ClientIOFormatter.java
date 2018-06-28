/**
 * @author Alexander Mamchur
 */
package CBMServer;

import org.restlet.Request;

/**
 * Application request for Data manipulations
 */
public interface I_ClientIOFormatter {
	
	/**
	 * ----------------- Input Formating --------------------
	 */
	/**
	 * Formats Client's input 
	 */
	public DSTransaction formatRequest(Request request) throws Exception;

	/**
	 * ----------------- Output Formating --------------------
	 */
	/**
	 * Formats Server's selected data output 
	 */
	public String formatResponse(DSResponse dsResponse, DSRequest req) throws Exception;

}
