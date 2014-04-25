/**
 * 
 */
package CBMServer;

/**
 * @author Alexander Mamchur
 *
 */
import org.restlet.Application;
import org.restlet.Restlet;
import org.restlet.routing.Router;
import org.restlet.resource.Directory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Timer;
import java.util.TimerTask;

public class CBMRestlet extends Application {

	// URI of the root directory.
	public static final String ROOT_URI = "file:///c:/CBM/CBM/CBMClient/";
	private Timer timer;
	private String dbURL;
	private Connection dbCon = null;
	
	public CBMRestlet() {
		super();
		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			dbURL = "jdbc:mysql://localhost/CBM?"; // <<< TODO Turn this to configurable
			dbCon = DriverManager.getConnection(dbURL, "CBM", "cbm"); // <<< // TODO Turn this to configurable DB credentials
		} catch (SQLException ex) {
			System.out.println("SQLException: " + ex.getMessage());
			System.out.println("SQLState: " + ex.getSQLState());
			System.out.println("VendorError: " + ex.getErrorCode());
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		
    timer = new Timer();
    timer.schedule(new RemindTask(),
                   5*1000,        //initial delay
                   60*1000);  //subsequent rate
	}
	
    /**
     * Creates a root Restlet that will receive all incoming calls.
     */
    @Override
    public synchronized Restlet createInboundRoot() {
        // ----------- Create a router Restlet that routes each call to a new instance of HelloWorldResource. --------------
        Router router = new Router(getContext());
        //--------------- Defines all necessary routes -----------------------
        // Route for static resources (as JS files, ets.)
        router.attach("/CBMClient", new Directory(getContext(), ROOT_URI));
        // Route for main Data proceeding requests 
        router.attach("/CBMStart", CBMServer.CBMClientStart.class); 
        // Route for main Data proceeding requests 
        router.attach("/CBMServer", CBMServer.CBMCore.class); 
        // Route to ID provider 
        router.attach("/IDProvider", CBMServer.IDProvider.class); 
        // Route to MetaData Programm View generator
        router.attach("/GenerateDefaultView", CBMMeta.PrgViewGenerator.class); 
        // Route to Isomorphic SmartClient Data Sources generator
        router.attach("/GenerateDS", CBMMeta.iscDSGenerator.class); 
        // Route to Isomorphic SmartClient Data Sources generator
        router.attach("/SynchronizeAttributes", CBMMeta.AttributeSynchronizer.class); 
        return router;
    }
    
    class RemindTask extends TimerTask {
        public void run() {
        	// --- Clear dead sessions ---
			try {
				Statement statement = dbCon.createStatement();
				// TODO turn out[0] to parameter below
				statement.executeUpdate("DELETE FROM cbm.startsession WHERE Moment <= date_sub(sysdate(), INTERVAL 30 minute)");
				
				statement.close();
			} catch (Exception e) {
				e.printStackTrace();
			}

        }
    }

}

