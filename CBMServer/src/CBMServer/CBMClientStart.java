package CBMServer;


import org.restlet.data.CookieSetting;
import org.restlet.data.MediaType;
import org.restlet.representation.FileRepresentation;
import org.restlet.resource.ServerResource;
import org.restlet.Request;
import org.restlet.Response;
import org.restlet.resource.Get;

import CBMUtils.CredentialsManager;
import CBMUtils.I_AutentificationManager;

/**
 * CBM client starting logic class
 */
public class CBMClientStart extends ServerResource 
{
	Request request;
	Response response;

	public CBMClientStart()
	{
		request = Request.getCurrent();
		response = Response.getCurrent(); 
	}

	@Get("html") 
	public FileRepresentation ProceedGet()
	{ 
		// TODO: universalize file path below 
		FileRepresentation fr = new FileRepresentation("file:///c:/CBM/CBM/CBMClient/index.html", MediaType.TEXT_HTML);  
		String initialMsg = null;
		I_AutentificationManager credMan = new CredentialsManager();
		
		initialMsg = credMan.initFirstKeys();
		
		response.redirectPermanent("/CBMClient");
        CookieSetting cS = new CookieSetting(1, "ImgFirst", initialMsg /*, "/", ".127.0.0.1"*/);
//        cS.setAccessRestricted(false);
//        cS.setSecure(false);
        response.getCookieSettings().add(cS);

		return fr; 
	}
}
