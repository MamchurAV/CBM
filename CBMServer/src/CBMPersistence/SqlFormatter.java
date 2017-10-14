package CBMPersistence;

import CBMMeta.Criteria;
import CBMMeta.CriteriaItem;
import CBMMeta.SelectTemplate;
import CBMServer.DSRequest;
import CBMServer.DSRequestSelect;

public class SqlFormatter {
	
	public static String prepareWhere(SelectTemplate selTempl, DSRequestSelect dsRequest) {
	
		String wherePart = "";
//		if (dsRequest!= null && dsRequest.data != null && dsRequest.data.criteria.criteria.size()>0)
//		{
//			for (Criteria crit : dsRequest.data.criteria.criteria)
//			{
//				if (crit instanceof CriteriaItem){
//					CriteriaItem critItem = (CriteriaItem)crit;
//					String col = selTempl.columns.get(critItem.fieldName);
//					if (col != null)
//					{	
//						if (!critItem.value.equals("null"))
//						{
//							wherePart += " and " + col + " like '" + critItem.value + "%'"; // TODO leave brackets for strings only
//						}
//						else
//						{
//							wherePart += " and " + col + " is null ";
//						}
//					}
//				}
//			}
//		}
		
		return "";
	}
}
