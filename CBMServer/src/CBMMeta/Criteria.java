package CBMMeta;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

//@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
//@JsonSubTypes({
//    @JsonSubTypes.Type(value=CriteriaItem.class, name="CriteriaItem"),
//    @JsonSubTypes.Type(value=CriteriaComplex.class, name="CriteriaComplex") })
public class Criteria {
//	public String type;
	public String  operator; 
}
