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
//	public String operator;
//	public String _constructor;
//	public ArrayList<Criteria> criteria;
	public ClientData clientData;
	public Criteria criteria;
}
