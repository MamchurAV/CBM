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
	public static final String ROOT_URI = "file:///" + CBMStart.CBM_ROOT + "/CBMClient/";
	private static Timer timer;
	private static TimerTask timerTask;
	private String dbURL;
	private Connection dbCon = null;
	
	public CBMRestlet() {
		super();
		try {
			// --- Central Metadata-hosting database connection
			Class.forName(CBMStart.getParam("primaryDBDriver"));
			dbURL = CBMStart.getParam("primaryDBUrl");
			dbCon = DriverManager.getConnection(dbURL, "CBM", "cbm");
		} catch (SQLException ex) {
			System.out.println("SQLException: " + ex.getMessage());
			System.out.println("SQLState: " + ex.getSQLState());
			System.out.println("VendorError: " + ex.getErrorCode());
		} catch (Exception ex) {
			ex.printStackTrace();
		}

		timer = new Timer(true);
		timerTask = new RemindTask();
        timer.scheduleAtFixedRate(timerTask, 20*1000, 300*1000);
	}
	
    /**
     * Creates a root Restlet that will receive all incoming calls.
     */
    @Override
    public synchronized Restlet createInboundRoot() {
        // ----------- Create a router Restlet that routes each call to a new instance of HelloWorldResource. --------------
        Router router = new Router(getContext());
        //--------------- Defines all necessary routes -----------------------
        // Route for main Data proceeding requests 
        router.attach("/CBMStart", CBMServer.CBMClientStart.class); 
        // Route for static resources (as JS files, ets.)
        router.attach("/CBMClient", new Directory(getContext(), ROOT_URI));
        // Route for main Data proceeding requests 
        router.attach("/DataService", CBMServer.DataAccessService.class); 
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
    	@Override
        public void run() {
        	// --- Clear dead sessions ---
			try {
				Statement statement = dbCon.createStatement();
				String dbType = CBMStart.getParam("primaryDBType");
				switch (dbType){
				case "PosgreSQL":
					statement.executeUpdate("DELETE FROM cbm.startsession WHERE Moment <= localtimestamp - interval '30 minutes'");
					break;
				case "MySQL":	
					statement.executeUpdate("DELETE FROM cbm.startsession WHERE Moment <= date_sub(sysdate(), INTERVAL 30 minute)");
					break;
				case "DB2":	
					statement.executeUpdate("DELETE FROM cbm.startsession WHERE Moment <= sysdate() - 0.0283");
					break;
				}
				statement.close();
			} catch (Exception e) {
				e.printStackTrace();
			}

        }
    }

}

