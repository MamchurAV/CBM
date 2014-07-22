package CBMServer;

import org.restlet.resource.ServerResource;
import org.restlet.Request;
import org.restlet.resource.Get;

import CBMPersistence.DB2IDProvider;
import CBMPersistence.MySQLIDProvider;
import CBMPersistence.PostgreSQLIDProvider;

/**
 * CBM Identifier provider helper class
 */
public class IDProvider extends ServerResource 
{
	
	private I_IDProvider idProvider;
	private Request request;

	public IDProvider()
	{
		request = Request.getCurrent();
		String dbType = CBMStart.getParam("primaryDBType");
		switch (dbType){
		case "PosgreSQL":
			idProvider = new PostgreSQLIDProvider(); 
			break;
		case "MySQL":	
			idProvider = new MySQLIDProvider();
			break;
		case "DB2":	
			idProvider = new DB2IDProvider();
			break;
		}
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
