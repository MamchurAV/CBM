/**
 * @author Alexander Mamchur
 */
package com.cbm.CBMServer;

import io.vertx.ext.web.RoutingContext;

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
	public DSTransaction formatRequest(RoutingContext request) throws Exception;

	/**
	 * ----------------- Output Formating --------------------
	 */
	/**
	 * Formats Server's selected data output 
	 */
	public String formatResponse(DSResponse dsResponse, DSRequest req) throws Exception;

}
