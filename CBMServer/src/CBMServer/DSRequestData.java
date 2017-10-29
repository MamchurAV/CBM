package CBMServer;

import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import CBMMeta.Criteria;
import CBMMeta.CriteriaComplex;
import CBMMeta.CriteriaItem;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DSRequestData {
	// Map contains field-value pairs for changed(/inserted) values
	public Map<String,Object> data;
	// Structure for different environment parameters that affects request processing 
	public ClientData clientData = new ClientData();
	// Data selection criteria
	public Criteria criteria;
}
