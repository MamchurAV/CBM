package CBMServer;
/**
 * @author Alexander Mamchur
 *
 */

import org.restlet.Component;
import org.restlet.Server;
import org.restlet.data.Parameter;
import org.restlet.data.Protocol;
import org.restlet.util.Series;
//import org.restlet.ext.ssl.PkixSslContextFactory;

public class CBMStart { 
	
	public static void main(String[] args) throws Exception {  
	    // Create a new Component.  
	    Component component = new Component();  
	  
	    // Add a new HTTP server listening on port 8182.  
	    Server server = component.getServers().add(Protocol.HTTP, 8182); 
	    component.getClients().add(Protocol.FILE);

	    // Add a new HTTPS server listening on port 8183
//	    Server server = component.getServers().add(Protocol.HTTPS, 8183);
	    
	    Series<Parameter> parameters = server.getContext().getParameters();
	    parameters.add("maxThreads", "40");

//	    parameters.add("sslContextFactory", "org.restlet.ext.ssl.PkixSslContextFactory");
//	    parameters.add("keystorePath", "<path>serverX.jks");
//	    parameters.add("keystorePassword", "password");
//	    parameters.add("keyPassword", "password");
//	    parameters.add("keystoreType", "JKS");
	    
//	    parameters.add("sslContextFactory","com.noelios.restlet.ext.ssl.PkixSslContextFactory");
//	    parameters.add("keystorePath","/path/to/keystore1.p12");
//	    parameters.add("keystorePassword","ZuZuZu");
//	    parameters.add("keystoreType","PKCS12");
    
//	    parameters.add("needClientAuthentication", "false");


// --- WORK CODE	    
//	    Series<Parameter> parametersHTTPS = serverHTTPS.getContext().getParameters();
//	    Series<Parameter> parametersHTTP = serverHTTP.getContext().getParameters();
//	    parameters.add("sslContextFactory", "org.restlet.ext.ssl.PkixSslContextFactory");
	    // I have created self signed certificate. reference is attached with parameter
//	    parameters.add("keystorePath","${user.home}/serverX.jks");
//	    parameters.add("keystorePassword", "password");
//	    parameters.add("keyPassword", "password");
//	    parameters.add("keystoreType", "JKS");  
// --- END WORK CODE
	    // --- Other variant ---
	 // increase maximumSeries<Parameter>ds (RESTlet default is 10)
//	    parameters.add("sslContextFactory","org.restlet.ext.ssl.PkixSslContextFactory");
//	    parameters.add("keystorePath", "${user.home}/serverX.jks");
//	    parameters.add("keystorePassword", "password");
//	    parameters.add("keystoreType", "JKS");
//	    parameters.add("keyPassword", "password");
// --- END Other Other variant ---
	    
	    // ------ Attach the CBM application !!! --------  
	    component.getDefaultHost().attach(new CBMRestlet());  

	    
	    // Start the component.  
	    component.start();  
	} 

}   

