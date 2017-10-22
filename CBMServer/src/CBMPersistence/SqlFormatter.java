package CBMPersistence;

import CBMMeta.Criteria;
import CBMMeta.CriteriaItem;
import CBMMeta.CriteriaComplex;
import CBMMeta.SelectTemplate;
import CBMServer.DSRequest;

public class SqlFormatter {
	
	public static String prepareWhere(SelectTemplate selectTempl, DSRequest dsRequest) {
	
		String wherePart = "";
		if (dsRequest!= null && dsRequest.data != null 
				&& (CriteriaComplex)dsRequest.data.criteria != null
				&& ((CriteriaComplex)dsRequest.data.criteria).criteria.size()>0)
		{
			wherePart += processCriteriaComplex(selectTempl, (CriteriaComplex)dsRequest.data.criteria);
		}
		
		return wherePart;
	}
	
	private static String processCriteriaComplex(SelectTemplate selectTempl, CriteriaComplex criteriaCopmlex){
		if (criteriaCopmlex.criteria.size() == 0){
			return "";
		}
		String wherePart = "";
		for (Criteria crit : criteriaCopmlex.criteria)
		{
			if (crit instanceof CriteriaItem){
				CriteriaItem critItem = (CriteriaItem)crit;
				String col = selectTempl.columns.get(critItem.fieldName);
				if (col != null)
				{	
					if (!critItem.value.equals("null"))
					{
						wherePart += " and " + col + iscDecodeOperator(critItem.operator, critItem.value);
					}
					else
					{
						wherePart += " and " + col + " is null ";
					}
				}
			} else {
				if (!wherePart.equals("")){
					wherePart += ((CriteriaComplex)crit).operator;
				}
				wherePart +=  " (" + processCriteriaComplex(selectTempl, (CriteriaComplex)crit);
				wherePart += ") ";
			}
		}
		// wherePart += ") ";
		return wherePart;
	}
	
	// TODO******VVVVVVVV
	private static String iscDecodeOperator(String operator, Object value){
		 // TODO leave brackets for strings only
		return " = '" + value + "' ";
	}
}
