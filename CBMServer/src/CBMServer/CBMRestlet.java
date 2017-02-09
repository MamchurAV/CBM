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
	private String dbURL = null;
	private String dbUs = null;
	private String dbCred = null;
	
	public CBMRestlet() {
		super();
		try {
		Class.forName(CBMStart.getParam("primaryDBDriver"));
		dbURL = CBMStart.getParam("primaryDBUrl");
		dbUs = CBMStart.getParam("primaryDBUs");
		dbCred = CBMStart.getParam("primaryDBCred");
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
        return router;
    }
    
    class RemindTask extends TimerTask {
    	@Override
        public void run() {
        	// --- Clear dead sessions ---
    		Connection dbCon = null;
    		Statement statement = null;
    		String inact = CBMStart.getParam("inactivityInterval");
    		if (inact == null) {
    			inact = "4h";
    		}
			try {
				// --- Central Metadata-hosting database connection
				dbCon = DriverManager.getConnection(dbURL, dbUs, dbCred);
				// 	
				statement = dbCon.createStatement();
				String dbType = CBMStart.getParam("primaryDBType");
				switch (dbType){
				case "PosgreSQL":
					statement.executeUpdate("DELETE FROM cbm.startsession WHERE Moment <= localtimestamp - interval '" + inact + "'");
					break;
				case "DB2":	
					statement.executeUpdate("DELETE FROM cbm.startsession WHERE Moment <= sysdate() - 0.0283");
					break;
				case "MySQL":	
					statement.executeUpdate("DELETE FROM cbm.startsession WHERE Moment <= date_sub(sysdate(), INTERVAL 30 minute)");
					break;
				case "MSSQL":	
					statement.executeUpdate("DELETE FROM cbm.startsession WHERE Moment <= GETDATE() - 0.0283");
					break;
				}
				statement.close();
				dbCon.close();
			} catch (SQLException ex) {
				System.out.println("SQLException: " + ex.getMessage());
				System.out.println("SQLState: " + ex.getSQLState());
				System.out.println("VendorError: " + ex.getErrorCode());
			} catch (Exception ex) {
				ex.printStackTrace();
			} finally {
			    try {
			        if(statement != null) statement.close();
			        if(dbCon != null) dbCon.close();
			    } catch(SQLException sqlee) {
			        sqlee.printStackTrace();
			    } finally {  // Just to make sure that both dbCon and statement are "garbage collected"
			    	statement = null;
			    	dbCon = null;
			    }
			}

        }
    }
}



