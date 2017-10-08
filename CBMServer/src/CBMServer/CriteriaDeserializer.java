package CBMServer;

import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.core.JsonParser;
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.DeserializationContext;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
//import com.fasterxml.jackson.databind.node.ObjectNode;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.JsonProcessingException;
//import org.codehaus.jackson.Version;
import org.codehaus.jackson.map.DeserializationContext;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.deser.StdDeserializer;
//import org.codehaus.jackson.map.module.SimpleModule;
import org.codehaus.jackson.node.ObjectNode;



import CBMMeta.Criteria;

public class CriteriaDeserializer extends StdDeserializer<Criteria>
{
	  private Map<String, Class<? extends Criteria>> registry =
	      new HashMap<String, Class<? extends Criteria>>();

	  CriteriaDeserializer()
	  {
	    super(Criteria.class);
	  }

	  void registerCriteria(String uniqueAttribute,
	      Class<? extends Criteria> criteriaClass)
	  {
	    registry.put(uniqueAttribute, criteriaClass);
	  }

	  @Override
	  public Criteria deserialize(
	      JsonParser jp, DeserializationContext ctxt) 
	      throws IOException, JsonProcessingException
	  {
	    ObjectMapper mapper = (ObjectMapper) jp.getCodec();
	    ObjectNode root = (ObjectNode) mapper.readTree(jp);
	    Class<? extends Criteria> criteriaClass = null;
	    Iterator<Entry<String, JsonNode>> elementsIterator = root.getFields();
	    while (elementsIterator.hasNext())
	    {
	      Entry<String, JsonNode> element=elementsIterator.next();
	      String name = element.getKey();
	      if (registry.containsKey(name))
	      {
	    	  criteriaClass = registry.get(name);
	        break;
	      }
	    }
	    if (criteriaClass == null) return null;
	    return mapper.readValue(root, criteriaClass);
	  }
}

