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
	public String operator;
	public String _constructor;
//	public ArrayList<CriteriaItem> criteria;
	public ArrayList<Criteria> criteria;
//	public CriteriaItem[] criteria;
//	public ArrayList<Criteria> criteria;
//	public Object criteria;
//	public Map<String,Object> criteria;
//	public ArrayList<Object> criteria;
	public String currUser;
	public String itemImg;
	public String currDate;
	public String currLang;
	public String extraInfo;
	
}
