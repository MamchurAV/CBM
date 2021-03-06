package CBMPersistence;

import CBMMeta.ColumnInfo;
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
				ColumnInfo critColumn = selectTempl.columns.stream().filter(c -> c.sysCode.equals(critItem.fieldName)).findFirst().get();
				String col = critColumn.dbColumn;
				if (col != null)
				{	
					if (!critItem.value.equals("null"))
					{
						wherePart += " and " + iscDecodeOperator(col, critItem.operator, critItem.value, critColumn.relatedType);
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
	
	/*
"greaterThan"	Greater than
"lessThan"	Less than
"greaterOrEqual"	Greater than or equal to
"lessOrEqual"	Less than or equal to
"contains"	Contains as sub-string (match case)
"startsWith"	Starts with (match case)
"endsWith"	Ends with (match case)
"iContains"	Contains as sub-string (case insensitive)
"iStartsWith"	Starts with (case insensitive)
"iEndsWith"	Ends with (case insensitive)
"notContains"	Does not contain as sub-string (match case)
"notStartsWith"	Does not start with (match case)
"notEndsWith"	Does not end with (match case)
"iNotContains"	Does not contain as sub-string (case insensitive)
"iNotStartsWith"	Does not start with (case insensitive)
"iNotEndsWith"	Does not end with (case insensitive)
"iBetween"	shortcut for "greaterThan" + "and" + "lessThan" (case insensitive)
"iBetweenInclusive"	shortcut for "greaterOrEqual" + "and" + "lessOrEqual" (case insensitive)
"matchesPattern"	Basic GLOB matching using wildcards (see DataSource.translatePatternOperators for more information on available patterns)
"iMatchesPattern"	Basic GLOB matching using wildcards (case insensitive) (see DataSource.translatePatternOperators for more information on available patterns)
"containsPattern"	GLOB matching using wildcards. Value is considered to meet the criterion if it contains the pattern. See DataSource.translatePatternOperators for more information on available patterns)
"startsWithPattern"	GLOB mathcing using wildcards. Value is considered to meet the criterion if it starts with the pattern.See DataSource.translatePatternOperators for more information on available patterns)
"endsWithPattern"	GLOB mathcing using wildcards. Value is considered to meet the criterion if it starts with the pattern.See DataSource.translatePatternOperators for more information on available patterns)
"iContainsPattern"	GLOB matching using wildcards. Value is considered to meet the criterion if it contains the pattern. Matching is case insensitive. See DataSource.translatePatternOperators for more information on available patterns)
"iStartsWithPattern"	GLOB matching using wildcards. Value is considered to meet the criterion if it starts with the pattern. Matching is case insensitive.See DataSource.translatePatternOperators for more information on available patterns)
"iEndsWithPattern"	GLOB matching using wildcards.Value is considered to meet the criterion if it ends with the pattern. Matching is case insensitive. See DataSource.translatePatternOperators for more information on available patterns)
"regexp"	Regular expression match
"iregexp"	Regular expression match (case insensitive)
"isBlank"	value is either null or the empty string. For numeric fields it behaves as isNull
"notBlank"	value is neither null nor the empty string ("")
"isNull"	value is null
"notNull"	value is non-null. Note empty string ("") is non-null
"inSet"	value is in a set of values. Specify criterion.value as an Array
"notInSet"	value is not in a set of values. Specify criterion.value as an Array
"equalsField"	matches another field (match case, specify fieldName as criterion.value)
"notEqualField"	does not match another field (match case, specify fieldName as criterion.value)
"iEqualsField"	matches another field (case insensitive, specify fieldName as criterion.value)
"iNotEqualField"	does not match another field (case insensitive, specify fieldName as criterion.value)
"greaterThanField"	Greater than another field (specify fieldName as criterion.value)
"lessThanField"	Less than another field (specify fieldName as criterion.value)
"greaterOrEqualField"	Greater than or equal to another field (specify fieldName as criterion.value)
"lessOrEqualField"	Less than or equal to another field (specify fieldName as criterion.value)
"containsField"	Contains as sub-string (match case) another field value (specify fieldName as criterion.value)
"startsWithField"	Starts with (match case) another field value (specify fieldName as criterion.value)
"endsWithField"	Ends with (match case) another field value (specify fieldName as criterion.value)
"iContainsField"	Contains as sub-string (case insensitive) another field value (specify fieldName as criterion.value)
"iStartsWithField"	Starts with (case insensitive) another field value (specify fieldName as criterion.value)
"iEndsWithField"	Ends with (case insensitive) another field value (specify fieldName as criterion.value)
"notContainsField"	Does not contain as sub-string (match case) another field value (specify fieldName as criterion.value)
"notStartsWithField"	Does not start with (match case) another field value (specify fieldName as criterion.value)
"notEndsWithField"	Does not end with (match case) another field value (specify fieldName as criterion.value)
"iNotContainsField"	Does not contain as sub-string (case insensitive) another field value (specify fieldName as criterion.value)
"iNotStartsWithField"	Does not start with (case insensitive) another field value (specify fieldName as criterion.value)
"iNotEndsWithField"	Does not end with (case insensitive) another field value (specify fieldName as criterion.value)
"and"	all subcriteria (criterion.criteria) are true
"not"	all subcriteria (criterion.criteria) are false
"or"	at least one subcriteria (criterion.criteria) is true
"between"	shortcut for "greaterThan" + "lessThan" + "and". Specify criterion.start and criterion.end
"betweenInclusive"	shortcut for "greaterOrEqual" + "lessOrEqual" + "and". Specify criterion.start and criterion.end
	 */
	private static String iscDecodeOperator(String column, String operator, Object value, String type){
		String result = "";
		if(isString(type)) {
			switch (operator) {
				case "iEquals": //exactly equal to, if case is disregarded
					result = " (LOWER(" + column + ") =  '" + ((String) value).toLowerCase() + "' OR  " + column + " = '" + value + "') ";
					break;
				case "notEqual": //not equal to
					result = column + " != '" + value + "' ";
					break;
				case "iNotEqual": //not equal to, if case is disregarded
					result = " (LOWER(" + column + ") !=  '" + ((String) value).toLowerCase() + "' OR " + column + " != '" + value + "') ";
					break;
				case "startsWith": //not equal to, if case is disregarded
					result = column + " LIKE  '" + value + "%' ";
					break;
				case "iStartsWith": //not equal to, if case is disregarded
					result = " (LOWER(" + column + ") LIKE  '" + ((String) value).toLowerCase() + "%' OR " + column + " LIKE  '" + value + "%') ";
					break;
				case "contains": //not equal to, if case is disregarded
					result = column + " LIKE  '%" + value + "%' ";
					break;
				case "iContains": //not equal to, if case is disregarded
					result = " (LOWER(" + column + ") LIKE  '%" + ((String) value).toLowerCase() + "%' OR " + column + " LIKE  '%" + value + "%') ";
					break;
				default: //default to exactly equal
					result = column + " = '" + value + "' ";
					break;
			}
		} else if (isMLString(type)) {
			switch (operator) {
			case "iEquals": //exactly equal to, if case is disregarded
			case "iContains": //not equal to, if case is disregarded
				result = " (LOWER(" + column + ") LIKE  '%" + ((String) value).toLowerCase() + "%' OR " + column + " LIKE  '%" + value + "%') ";
				break;
			case "notEqual": //not equal to
				result = column + " NOT LIKE '%" + value + "%' ";
				break;
			case "iNotEqual": //not equal to, if case is disregarded
				result = " (LOWER(" + column + ") NOT LIKE '%" + ((String) value).toLowerCase() + "%' AND " + column + " NOT LIKE '%" + value + "%') ";
				break;
			case "startsWith": //not equal to, if case is disregarded
				result = column + " LIKE  '" + value + "%' ";
				break;
			case "iStartsWith": //not equal to, if case is disregarded
				result = " (LOWER(" + column + ") LIKE  '" + ((String) value).toLowerCase() + "%' OR " + column + " LIKE  '" + value + "%') ";
				break;
			default: //default to exactly equal
				result = column + " LIKE  '%" + value + "%' ";
				break;
		}
		} else if (isNumeric(type)){
			switch (operator) {
				case "notEqual": //not equal to
					result = column + " != " + value + " ";
					break;
				default: //default to exactly equal
					result = column + " = " + value + " ";
					break;
			}
		} else {
			switch (operator) {
				case "notEqual": //not equal to
				case "iNotEqual":
					result = column + " != '" + value + "' ";
					break;
				default: //default to exactly equal
					result = column + " = '" + value + "' ";
					break;
			}
		}
		return result;
	}


	private static boolean isString(String type) {
		if (type.equals("ShortString")
			|| type.equals("StandardString")
			|| type.equals("LongString")
			|| type.equals("Text")
			|| type.equals("URL")
			|| type.equals("imageFile")){
				return true;
		}
		return false;
	}


	private static boolean isMLString(String type) {
		if (type.equals("ShortMlString")
			|| type.equals("StandardMlString")
			|| type.equals("LongMlString")){
			return true;
		}
		return false;
	}
	
	
	private static boolean isNumeric(String type) {
		if (type.equals("Integer")
				|| type.equals("Bigint")
				|| type.equals("Decimal")
				|| type.equals("Money")
				|| type.equals("BigDecimal")){
				return true;
		}
		return false;
	}
		

	private static boolean isGuidOrDate(String type) {
		if (type.equals("GUID")
			|| !(isString(type)
			||   isNumeric(type))){
				return true;
		}
		return false;
	}

/*
	private static String kind(String type){
		if (type.equals("Boolean")) {
			return "bool";
		}
		if (type.equals("Integer")
			|| type.equals("Bigint")
			|| type.equals("Decimal")
			|| type.equals("Money")
			|| type.equals("BigDecimal")){
			return "numeric";
		}
		else
		{
			return "string";
		}
	}*/
}
