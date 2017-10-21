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
	public Map<String,Object> data;
	public ClientData clientData = new ClientData();
	public Criteria criteria;
}
