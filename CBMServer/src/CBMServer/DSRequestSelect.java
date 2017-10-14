/**
 * 
 */
package CBMServer;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import CBMMeta.CriteriaComplex;

/**
 * @author Alexander Mamchur
 * Represents unified client request 
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class DSRequestSelect extends DSRequest {
//	public DSRequestData data;
}
