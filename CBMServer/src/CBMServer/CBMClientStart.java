package CBMServer;


import org.restlet.data.CacheDirective;
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
		FileRepresentation fr = new FileRepresentation("file:///" + CBMStart.CBM_ROOT + "/CBMClient/index.html", MediaType.TEXT_HTML);  
		String initialMsg = null;
		I_AutentificationManager credMan = new CredentialsManager();
		
		initialMsg = credMan.initFirstKeys();
		
        CookieSetting cS = new CookieSetting(1, "ImgFirst", initialMsg );
        response.getCookieSettings().add(cS);
        
        response.getCacheDirectives().add(new CacheDirective("no-store"));

		return fr; 
	}
}
