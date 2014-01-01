package CBMServer;

import org.restlet.resource.ServerResource;
import org.restlet.Request;
import org.restlet.resource.Get;
import CBMPersistence.MySQLIDProvider;

/**
 * CBM Identifier provider helper class
 */
public class IDProvider extends ServerResource 
{
//	I_IDProvider idProvider = new DB2IDProvider(); // TODO Turn to configurable 
	I_IDProvider idProvider = new MySQLIDProvider(); // TODO Turn to configurable 
	Request request;

	public IDProvider()
	{
		request = Request.getCurrent();
	}

	@Get("json") 
	public String ProceedGet() 
	{ 
		String out = null;
        String req = request.toString();
        
        int pool = Integer.valueOf(req.substring( req.indexOf("pool")+5, req.indexOf(" ", req.indexOf("pool")+5)));
        long num =  idProvider.GetID(pool);
		out =  "{\"numID\":" + String.valueOf(num) + "}";

		return out;
	}

}
